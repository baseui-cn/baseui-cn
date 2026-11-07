// Date activation, primitive open-state styling, focus ownership and cell geometry.
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import { createRequire } from "node:module"
if (!process.env.BASEUI_TEST_TOOLS) throw Error("Set BASEUI_TEST_TOOLS to a project containing playwright")
const require = createRequire(path.join(process.env.BASEUI_TEST_TOOLS, "package.json"))
const playwright = require("playwright")
const output = process.env.EVIDENCE_DIR ?? "/private/tmp/data-grid-date-interactions"
await fs.mkdir(output, { recursive: true })
const results = [], versions = {}, standaloneResults = []
for (const engine of (process.env.GRID_BROWSERS ?? "chromium,firefox,webkit").split(",")) {
  const browser = await playwright[engine].launch({ headless: true })
  versions[engine] = browser.version()
  const cases = process.env.GRID_DATE_SMOKE === "1" ? [{ width: 1280, dark: false, rtl: false }]
    : [320, 1280].flatMap(width => [false, true].flatMap(dark => [false, true].map(rtl => ({ width, dark, rtl }))))
  for (const { width, dark, rtl } of cases) {
    const id = `${engine}-${width}-${dark ? "dark" : "light"}-${rtl ? "rtl" : "ltr"}`
    // WebKit's default Mac tab policy omits ordinary buttons; Option+Tab
    // exercises the full-keyboard-navigation path used when Safari enables it.
    const nativeTabKey = engine === "webkit" ? "Alt+Tab" : "Tab"
    const page = await browser.newPage({ viewport: { width, height: 1000 } })
    page.setDefaultTimeout(6500)
    await page.clock.setFixedTime(new Date("2026-10-29T12:00:00Z"))
    const errors = [], samples = [], activations = []
    page.on("pageerror", error => errors.push(error.message))
    const cell = (column, row = "record-0") => page.locator(`[data-row-id="${row}"][data-column-id="${column}"]`)
    const row = page.locator("tbody tr").filter({ has: cell("date") })
    const popup = page.locator('[data-slot="popover-content"]')
    const trigger = () => cell("date").locator(".data-grid-inline-date-trigger-layout")
    let originalRow, height
    const reset = async () => {
      await page.goto(`${process.env.GRID_CONSUMER_URL ?? "http://127.0.0.1:4196"}/?mode=geometry&dark=${dark ? 1 : 0}&rtl=${rtl ? 1 : 0}`)
      await page.waitForFunction(() => !!window.geometryGrid)
      await page.waitForTimeout(70)
      originalRow = await row.elementHandle(); height = (await row.boundingBox()).height
    }
    const measure = async state => {
      const value = await row.evaluate((node, original) => ({ height: node.getBoundingClientRect().height, sameNode: node === original }), originalRow)
      assert.ok(Math.abs(value.height - height) <= 0.5, `${state}: ${height} → ${value.height}`)
      assert.equal(value.sameNode, true, `${state}: row remounted`)
      samples.push({ state, ...value })
    }
    const ring = async state => {
      const value = await trigger().evaluate(node => {
        const css = getComputedStyle(node), probe = document.createElement("span")
        probe.style.position = "fixed"; probe.style.color = css.getPropertyValue("--ring")
        document.body.append(probe); const expected = getComputedStyle(probe).color; probe.remove()
        return { open: node.hasAttribute("data-popup-open"), expanded: node.getAttribute("aria-expanded"), focused: node === document.activeElement, width: parseFloat(css.outlineWidth), style: css.outlineStyle, offset: parseFloat(css.outlineOffset), color: css.outlineColor, expected }
      })
      assert.ok(value.open && value.expanded === "true")
      assert.equal(value.width, 2); assert.equal(value.style, "solid"); assert.equal(value.offset, -2)
      assert.equal(value.color, value.expected)
      await measure(state)
      return value
    }
    const closeWithEscape = async () => {
      await page.keyboard.press("Escape"); await popup.waitFor({ state: "hidden" })
      await page.waitForFunction(() => {
        const node = document.querySelector('[data-row-id="record-0"][data-column-id="date"] button')
        return node === document.activeElement
      })
      const value = await cell("date").getByRole("button").evaluate(node => ({ open: node.hasAttribute("data-popup-open"), visible: node.matches(":focus-visible"), width: parseFloat(getComputedStyle(node).outlineWidth), style: getComputedStyle(node).outlineStyle }))
      assert.equal(value.open, false)
      if (value.visible) { assert.equal(value.width, 2); assert.equal(value.style, "solid") }
      else assert.equal(value.style, "none")
      assert.equal(await page.evaluate(() => window.geometryGrid.rows[0].date), "2026-10-29")
      await measure("escape-restored-focus")
      return value
    }
    try {
      for (const activation of ["pointer", "Enter", "Space"]) {
        await reset()
        const display = cell("date").getByRole("button")
        if (activation === "pointer") await display.click()
        else { await display.focus(); await page.keyboard.press(activation) }
        await popup.waitFor(); await page.waitForTimeout(100)
        const initial = await ring(`${activation}-one-activation-open`)
        await page.getByRole("button", { name: /next month/i }).focus()
        const calendarFocus = await ring(`${activation}-calendar-focus`)
        assert.equal(calendarFocus.focused, false)
        await page.getByRole("button", { name: /next month/i }).hover()
        await page.getByRole("button", { name: /next month/i }).click()
        await page.getByRole("button", { name: /previous month/i }).click()
        const afterInteraction = await ring(`${activation}-calendar-interaction`)
        assert.equal(afterInteraction.focused, false)
        if (activation === "pointer" && width === 1280) await page.screenshot({ path: path.join(output, `${id}-open.png`) })
        const closed = await closeWithEscape()
        activations.push({ activation, initial, calendarFocus, afterInteraction, closed })
      }
      await reset()
      await cell("status").getByRole("button").focus(); await page.keyboard.press(nativeTabKey)
      assert.equal(await cell("date").getByRole("button").evaluate(node => node === document.activeElement), true)
      await page.waitForTimeout(100); assert.equal(await popup.count(), 0)
      await measure("native-tab-focus-keeps-closed")
      await page.evaluate(() => window.geometryGrid.table.getColumn("status").toggleVisibility(false))
      await cell("age").getByRole("button").click(); await page.keyboard.press("Tab")
      await page.waitForFunction(() => window.geometryGrid.editing.activeCell?.columnId === "date")
      assert.equal(await trigger().getAttribute("aria-expanded"), "false")
      await page.waitForTimeout(100); assert.equal(await popup.count(), 0)
      await measure("editing-tab-navigation-keeps-closed")
      await page.keyboard.press("Enter"); await popup.waitFor(); await ring("keyboard-opens-tab-entered-editor")
      await popup.getByRole("button").first().focus(); await page.keyboard.press(nativeTabKey)
      assert.equal(await popup.evaluate(node => node.contains(document.activeElement)), true)
      assert.equal(await page.evaluate(() => window.geometryGrid.editing.activeCell?.columnId), "date")
      await ring("tab-within-calendar-retains-owner")
      await page.getByRole("button", { name: /next month/i }).focus(); await closeWithEscape()
      await reset()
      await cell("date").getByRole("button").click(); await popup.waitFor()
      await trigger().click(); await popup.waitFor({ state: "hidden" })
      const pointerClosed = await trigger().evaluate(node => ({ open: node.hasAttribute("data-popup-open"), visible: node.matches(":focus-visible"), outlineWidth: parseFloat(getComputedStyle(node).outlineWidth), outlineStyle: getComputedStyle(node).outlineStyle, shellOutlineStyle: getComputedStyle(node.closest('[data-slot="data-grid-inline-editor-content"]')).outlineStyle }))
      assert.equal(pointerClosed.open, false)
      if (pointerClosed.visible) { assert.equal(pointerClosed.outlineStyle, "solid"); assert.equal(pointerClosed.outlineWidth, 2) }
      else assert.equal(pointerClosed.outlineStyle, "none")
      assert.equal(pointerClosed.shellOutlineStyle, "none")
      await measure("pointer-close-resumes-focus-visible")
      await reset()
      await cell("status").getByRole("button").click()
      await page.locator('[data-slot="select-content"]').waitFor()
      await page.keyboard.press("Escape")
      await page.locator('[data-slot="select-content"]').waitFor({ state: "hidden" })
      await cell("date").getByRole("button").click(); await popup.waitFor()
      await ring("one-click-after-select-dismissal")
      await page.getByRole("button", { name: /next month/i }).focus(); await closeWithEscape()
      await reset()
      await cell("date").getByRole("button").click(); await popup.waitFor()
      await page.evaluate(() => window.geometryGrid.hold())
      await page.getByRole("button", { name: "Friday, October 30th, 2026", exact: true }).click()
      await page.waitForFunction(() => window.geometryGrid.editing.isCellPending("record-0", "date"))
      await popup.waitFor({ state: "hidden" }); assert.equal(await trigger().isDisabled(), true)
      await measure("selection-closes-and-pends")
      await cell("name", "record-1").getByRole("button").click()
      await cell("name", "record-1").getByRole("textbox").fill("Later draft")
      await page.evaluate(() => window.geometryGrid.release())
      await page.waitForFunction(() => !window.geometryGrid.editing.isGridPending())
      assert.equal(await page.evaluate(() => window.geometryGrid.rows[0].date), "2026-10-30")
      assert.equal(await cell("name", "record-1").getByRole("textbox").inputValue(), "Later draft")
      assert.equal(await cell("name", "record-1").getByRole("textbox").evaluate(node => node === document.activeElement), true)
      await measure("selection-saved-without-stealing-later-focus")
      await reset()
      await page.evaluate(() => {
        document.querySelector('[data-row-id="record-0"][data-column-id="date"] button').click()
        window.geometryGrid.editing.startCellEdit(window.geometryGrid.rows[1], "name")
      })
      await cell("name", "record-1").getByRole("textbox").waitFor(); await page.waitForTimeout(100)
      assert.equal(await popup.count(), 0)
      assert.equal(await cell("name", "record-1").getByRole("textbox").evaluate(node => node === document.activeElement), true)
      await measure("superseded-activation-does-not-open")
      await reset()
      await page.evaluate(() => window.geometryGrid.hold())
      await cell("name").getByRole("button").click(); await cell("name").getByRole("textbox").fill("Pending name"); await page.keyboard.press("Enter")
      await page.waitForFunction(() => window.geometryGrid.editing.isCellPending("record-0", "name"))
      await cell("date").getByRole("button").click(); await page.waitForTimeout(100)
      assert.equal(await popup.count(), 0)
      await page.evaluate(() => window.geometryGrid.release()); await page.waitForFunction(() => !window.geometryGrid.editing.isGridPending())
      await page.waitForTimeout(100); assert.equal(await popup.count(), 0)
      await measure("pending-row-activation-remains-blocked")
      assert.deepEqual(errors, [])
      results.push({ id, engine, width, dark, rtl, pass: true, nativeTabKey, pointerClosed, activations, samples })
      console.log(`PASS ${id}: pointer/Enter/Space, Tab, open ring, Escape focus, saved date, ownership, geometry`)
    } catch (error) {
      results.push({ id, engine, width, dark, rtl, pass: false, error: error.message, errors, activations, samples })
      console.log(`FAIL ${id}: ${error.message}`)
      await page.screenshot({ path: path.join(output, `${id}-failure.png`) })
    } finally {
      await page.close()
      await fs.writeFile(path.join(output, "date-interactions.json"), JSON.stringify({ versions, results, standaloneResults }, null, 2))
    }
  }
  const standalone = await browser.newPage()
  try {
    await standalone.goto(`${process.env.GRID_CONSUMER_URL ?? "http://127.0.0.1:4196"}/?mode=inline-date`)
    await standalone.waitForFunction(() => !!window.regressionInline)
    const button = standalone.locator(".data-grid-inline-date-trigger-layout")
    for (let count = 1; count <= 2; count++) {
      await button.click(); await standalone.locator('[data-slot="popover-content"]').waitFor()
      await button.focus(); await standalone.keyboard.press("Escape")
      await standalone.locator('[data-slot="popover-content"]').waitFor({ state: "hidden" })
      assert.equal(await standalone.evaluate(() => window.regressionInline.cancels), count)
      assert.equal(await button.evaluate(node => node === document.activeElement), true)
    }
    standaloneResults.push({ engine, pass: true, escapes: 2, cancelCallbacks: 2 })
  } catch (error) { standaloneResults.push({ engine, pass: false, error: error.message }) }
  finally {
    await standalone.close()
    await fs.writeFile(path.join(output, "date-interactions.json"), JSON.stringify({ versions, results, standaloneResults }, null, 2))
  }
  await browser.close()
}
console.log(`${results.filter(r => r.pass).length}/${results.length} Date interaction configurations passed`)
if (results.some(r => !r.pass) || standaloneResults.some(r => !r.pass)) process.exitCode = 1
