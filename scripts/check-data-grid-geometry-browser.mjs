// Measures the same logical/DOM row through every editor/save/error state.
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import { createRequire } from "node:module"
if (!process.env.BASEUI_TEST_TOOLS) throw Error("Set BASEUI_TEST_TOOLS to a project containing playwright")
const require = createRequire(path.join(process.env.BASEUI_TEST_TOOLS, "package.json"))
const playwright = require("playwright")
const output = process.env.EVIDENCE_DIR ?? "/private/tmp/data-grid-inline-geometry"
const recordOnly = process.env.GRID_GEOMETRY_RECORD_ONLY === "1"
const tolerance = 0.5
await fs.mkdir(output, { recursive: true })
const results = [], versions = {}, lateEnableResults = []
for (const engine of (process.env.GRID_BROWSERS ?? "chromium,firefox,webkit").split(",")) {
  const browser = await playwright[engine].launch({ headless: true })
  versions[engine] = browser.version()
  const cases = process.env.GRID_GEOMETRY_SMOKE === "1"
    ? [{ width: 1280, dark: false, rtl: false, shape: "default", renderer: "basic" }]
    : [
      ...[320, 530, 768, 1440].flatMap(width => [false, true].flatMap(dark => [false, true].map(rtl => ({ width, dark, rtl, shape: "default", renderer: "basic" })))),
      ...["dense", "padded", "tall", "wrapped"].map(shape => ({ width: 530, dark: true, rtl: true, shape, renderer: "basic" })),
      ...["virtual", "combined"].flatMap(renderer => ["default", "tall"].map(shape => ({ width: 530, dark: true, rtl: true, shape, renderer }))),
      { width: 530, dark: true, rtl: true, shape: "default", renderer: "basic", loading: "spinner" },
    ]
  for (const config of cases) {
    const { width, dark, rtl, shape, renderer } = config
    const id = `${engine}-${width}-${dark ? "dark" : "light"}-${rtl ? "rtl" : "ltr"}-${shape}-${renderer}-${config.loading ?? "skeleton"}`
    const page = await browser.newPage({ viewport: { width, height: 1000 } })
    page.setDefaultTimeout(6500)
    await page.clock.setFixedTime(new Date("2026-10-29T12:00:00Z"))
    const errors = [], samples = [], popups = []
    page.on("pageerror", error => errors.push(error.message))
    const cell = column => page.locator(`[data-slot="data-grid-editable-cell"][data-row-id="record-0"][data-column-id="${column}"]`)
    const row = page.locator("tbody tr").filter({ has: cell("name") })
    let originalRow
    const capture = async (state, column) => {
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
      const measuredRow = recordOnly && await row.count() === 0 ? page.locator("tbody tr").first() : row
      const measurement = await measuredRow.evaluate((element, original) => {
        const r = element.getBoundingClientRect(), next = element.nextElementSibling?.getBoundingClientRect()
        return { height: r.height, nextOffset: next ? next.top - r.top : null, sameNode: element === original }
      }, originalRow)
      const sample = { state, ...measurement }
      if (column && await cell(column).count()) sample.control = await cell(column).evaluate(element => {
        const td = element.closest("td").getBoundingClientRect()
        const controls = [...element.querySelectorAll('input:not([aria-hidden="true"]), button, textarea, [role="switch"]')].filter(n => !n.hasAttribute("data-base-ui-focus-guard"))
        return { cellHeight: td.height, boxes: controls.map(n => { const r = n.getBoundingClientRect(); return { height: r.height, top: r.top - td.top, bottom: r.bottom - td.top } }) }
      })
      samples.push(sample)
      if (!recordOnly) {
        assert.equal(sample.sameNode, true, `${state}: row was remounted`)
        assert.ok(Math.abs(sample.height - samples[0].height) <= tolerance, `${state}: ${samples[0].height} → ${sample.height}`)
        assert.ok(Math.abs(sample.nextOffset - samples[0].nextOffset) <= tolerance, `${state}: neighboring row moved`)
        if (sample.control) for (const box of sample.control.boxes) {
          assert.ok(box.height > 1 && box.height <= sample.control.cellHeight + tolerance, `${state}: control height ${JSON.stringify(box)}`)
          assert.ok(box.top >= -tolerance && box.bottom <= sample.control.cellHeight + tolerance, `${state}: control escaped the cell ${JSON.stringify(box)}`)
        }
      }
    }
    const cancel = async () => {
      await page.keyboard.press("Escape")
      await page.evaluate(() => window.geometryGrid.editing.cancelCellEdit())
      await page.waitForFunction(() => !window.geometryGrid.editing.activeCell)
      await page.waitForTimeout(30)
    }
    const popup = async (selector, kind) => {
      const element = page.locator(selector)
      await element.waitFor(); await page.waitForTimeout(160)
      const data = await element.evaluate(node => {
        const row = document.querySelector('[data-row-id="record-0"]').closest("tr")
        const next = row.nextElementSibling.getBoundingClientRect(), r = node.getBoundingClientRect()
        return { portalled: !row.closest("table").contains(node), overlapsNextRow: r.top < next.bottom && r.bottom > next.top, x: r.x, width: r.width }
      })
      popups.push({ kind, ...data })
      assert.equal(data.portalled, true, `${kind}: popup participates in table DOM`)
      assert.equal(data.overlapsNextRow, true, `${kind}: popup did not overlay the neighboring row`)
      assert.ok(data.x >= -1 && data.x + data.width <= width + 1, `${kind}: popup escapes viewport`)
      if (width === 530 && dark && rtl && shape === "default" && renderer === "basic") await page.screenshot({ path: path.join(output, `${id}-${kind}.png`) })
    }
    try {
      const query = new URLSearchParams({ mode: "geometry", dark: dark ? "1" : "0", rtl: rtl ? "1" : "0", shape, renderer, loading: config.loading ?? "skeleton" })
      await page.goto(`${process.env.GRID_CONSUMER_URL ?? "http://127.0.0.1:4196"}/?${query}`)
      await page.waitForFunction(() => !!window.geometryGrid)
      await page.waitForTimeout(80)
      originalRow = await row.elementHandle()
      await capture("display")
      await cell("name").getByRole("button").click(); await capture("text-edit", "name")
      await page.evaluate(() => window.geometryGrid.hold())
      await cell("name").getByRole("textbox").fill("Saved name"); await page.keyboard.press("Enter")
      await page.waitForFunction(() => window.geometryGrid.editing.isCellPending("record-0", "name")); await capture("text-pending", "name")
      await page.evaluate(() => window.geometryGrid.release()); await page.waitForFunction(() => !window.geometryGrid.editing.isGridPending())
      await capture("text-completed")
      await cell("date").getByRole("button").click(); await capture("date-edit", "date")
      if (!recordOnly) assert.equal(await cell("date").locator('[data-slot="field-label"]').count(), 0)
      if (recordOnly) await cell("date").getByRole("button").click()
      await popup('[data-slot="popover-content"]', "date-popup")
      await capture("date-popup-open", "date")
      await page.getByRole("button", { name: /Thursday, October 29th, 2026/ }).click()
      await page.getByRole("alert").filter({ hasText: "Please enter a valid date." }).waitFor()
      assert.equal(await page.locator('[data-slot="popover-content"]').count(), 1)
      assert.equal(await page.evaluate(() => window.geometryGrid.rows[0].date), "2026-10-29")
      await capture("date-validation-error", "date")
      await page.getByRole("button", { name: /next month/i }).click()
      await page.getByRole("button", { name: /previous month/i }).click()
      await page.evaluate(() => window.geometryGrid.hold())
      await page.getByRole("button", { name: "Friday, October 30th, 2026", exact: true }).click()
      await page.waitForFunction(() => window.geometryGrid.editing.isCellPending("record-0", "date")); await capture("date-pending", "date")
      if (!recordOnly) assert.equal(await cell("date").getByRole("button").isDisabled(), true)
      await page.evaluate(() => window.geometryGrid.release()); await page.waitForFunction(() => !window.geometryGrid.editing.isGridPending())
      assert.equal(await page.evaluate(() => window.geometryGrid.rows[0].date), "2026-10-30")
      await capture("date-completed")
      await cell("age").getByRole("button").click(); await capture("number-edit", "age")
      await page.evaluate(() => window.geometryGrid.hold())
      await cell("age").getByRole("textbox", { name: "Age", exact: true }).fill("42"); await page.keyboard.press("Enter")
      await page.waitForFunction(() => window.geometryGrid.editing.isCellPending("record-0", "age")); await capture("number-pending", "age")
      assert.equal(await cell("age").getByRole("textbox", { name: "Age", exact: true }).isDisabled(), true)
      await page.evaluate(() => window.geometryGrid.release()); await page.waitForFunction(() => !window.geometryGrid.editing.isGridPending())
      await capture("number-completed")
      await cell("status").getByRole("button").click(); await popup('[data-slot="select-content"]', "select-popup")
      if (!recordOnly) assert.equal(await cell("status").locator('[data-slot="select-value"]').innerText(), "Active")
      await capture("select-open", "status")
      await page.evaluate(() => window.geometryGrid.hold())
      await page.getByRole("option", { name: "Away", exact: true }).click()
      await page.waitForFunction(() => window.geometryGrid.editing.isCellPending("record-0", "status")); await capture("select-pending", "status")
      await page.evaluate(() => window.geometryGrid.release()); await page.waitForFunction(() => !window.geometryGrid.editing.isGridPending())
      await capture("select-completed")
      await page.evaluate(() => window.geometryGrid.hold())
      await cell("enabled").getByRole("switch").click()
      await page.waitForFunction(() => window.geometryGrid.editing.isCellPending("record-0", "enabled"))
      await capture("switch-pending", "enabled")
      if (!recordOnly) {
        assert.equal(await cell("enabled").getByRole("switch").isDisabled(), true)
        assert.equal(await cell("enabled").getAttribute("aria-busy"), "true")
      }
      await page.evaluate(() => window.geometryGrid.release()); await page.waitForFunction(() => !window.geometryGrid.editing.isGridPending())
      await page.evaluate(() => window.geometryGrid.hold())
      await cell("checked").getByRole("checkbox").click()
      await page.waitForFunction(() => window.geometryGrid.editing.isCellPending("record-0", "checked")); await capture("checkbox-pending", "checked")
      await page.evaluate(() => window.geometryGrid.release()); await page.waitForFunction(() => !window.geometryGrid.editing.isGridPending())
      await capture("boolean-completed")
      await cell("custom").getByRole("button").click(); await capture("custom-edit", "custom"); await cancel()
      await cell("name").getByRole("button").click(); await cell("name").getByRole("textbox").fill(""); await page.keyboard.press("Tab")
      await page.waitForFunction(() => !!window.geometryGrid.editing.getCellError("record-0", "name"))
      await capture("validation-error", "name"); await cancel()
      await page.evaluate(() => window.geometryGrid.hold(true))
      await cell("name").getByRole("button").click(); await cell("name").getByRole("textbox").fill("Rejected name"); await page.keyboard.press("Enter")
      await page.waitForFunction(() => window.geometryGrid.editing.isCellPending("record-0", "name")); await capture("rejected-pending", "name")
      await page.evaluate(() => window.geometryGrid.release()); await page.waitForFunction(() => !!window.geometryGrid.editing.getCellError("record-0", "name"))
      await capture("rejected-error", "name")
      if (!recordOnly) {
        const description = await cell("name").getByRole("textbox").getAttribute("aria-describedby")
        assert.ok(description)
        assert.equal(await page.locator(`[id="${description}"]`).innerText(), "Server rejected this edit")
        assert.equal(await page.locator(`[id="${description}"]`).evaluate(n => !!n.closest("table")), false)
      }
      await cancel(); await page.evaluate(() => window.geometryGrid.accept()); await capture("completed")
      assert.deepEqual(errors, [])
      results.push({ id, ...config, pass: true, samples, popups, maxHeightDelta: Math.max(...samples.map(s => Math.abs(s.height - samples[0].height))) })
      console.log(`${recordOnly ? "RECORDED" : "PASS"} ${id}: ${samples.map(s => `${s.state}=${s.height}`).join(", ")}`)
    } catch (error) {
      results.push({ id, ...config, pass: false, error: error.message, errors, samples, popups })
      console.log(`FAIL ${id}: ${error.message}`)
      await page.screenshot({ path: path.join(output, `${id}-failure.png`) })
    } finally {
      await page.close()
      await fs.writeFile(path.join(output, "geometry-results.json"), JSON.stringify({ versions, recordOnly, tolerance, results, lateEnableResults }, null, 2))
    }
  }
  if (!recordOnly) {
    const page = await browser.newPage()
    try {
      await page.goto(`${process.env.GRID_CONSUMER_URL ?? "http://127.0.0.1:4196"}/?mode=geometry&late=1`)
      await page.waitForFunction(() => !!window.geometryGrid)
      await page.evaluate(() => window.geometryGrid.enableEditing())
      const cell = page.locator('[data-row-id="record-0"][data-column-id="name"]')
      await cell.waitFor(); await page.waitForTimeout(80)
      const row = page.locator("tbody tr").filter({ has: cell })
      const before = (await row.boundingBox()).height
      await cell.getByRole("button").click(); await page.waitForTimeout(80)
      const after = (await row.boundingBox()).height
      assert.ok(Math.abs(after - before) <= tolerance, `late metadata: ${before} → ${after}`)
      lateEnableResults.push({ engine, pass: true, before, after })
      console.log(`PASS ${engine} late-enabled single-column editing: ${before} → ${after}`)
    } catch (error) {
      lateEnableResults.push({ engine, pass: false, error: error.message })
      console.log(`FAIL ${engine} late-enabled editing: ${error.message}`)
    } finally {
      await page.close()
      await fs.writeFile(path.join(output, "geometry-results.json"), JSON.stringify({ versions, recordOnly, tolerance, results, lateEnableResults }, null, 2))
    }
  }
  await browser.close()
}
console.log(`${results.filter(r => r.pass).length}/${results.length} geometry configurations ${recordOnly ? "recorded" : "passed"}`)
if (results.some(r => !r.pass) || lateEnableResults.some(r => !r.pass)) process.exitCode = 1
