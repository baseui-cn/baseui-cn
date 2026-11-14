import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import { createRequire } from "node:module"

if (!process.env.BASEUI_TEST_TOOLS) throw Error("Set BASEUI_TEST_TOOLS to Playwright tooling")
const require = createRequire(path.join(process.env.BASEUI_TEST_TOOLS, "package.json"))
const playwright = require("playwright")
const origin = process.env.GRID_CONSUMER_URL ?? "http://127.0.0.1:4196"
const output = process.env.EVIDENCE_DIR ?? "/private/tmp/grid-demo-browser"
await fs.mkdir(output, { recursive: true })
const results = [], versions = {}
const cases = [
  { width: 1440, dark: false, rtl: false, input: "keyboard" },
  { width: 1440, dark: true, rtl: true, input: "pointer" },
  { width: 390, dark: false, rtl: true, input: "keyboard" },
  { width: 390, dark: true, rtl: false, input: "pointer" },
]

for (const engine of (process.env.GRID_BROWSERS ?? "chromium,firefox,webkit").split(",")) {
  const browser = await playwright[engine].launch()
  versions[engine] = browser.version()
  for (const demo of ["basic", "features"]) for (const config of cases) {
    const { width, dark, rtl, input } = config
    const id = `${engine}-${demo}-${width}-${dark ? "dark" : "light"}-${rtl ? "rtl" : "ltr"}-${input}`
    const page = await browser.newPage({ viewport: { width, height: 1000 } })
    page.setDefaultTimeout(7000)
    const errors = []
    page.on("pageerror", error => errors.push(error.message))
    const identities = () => page.locator("tbody tr").evaluateAll(rows => rows.map(row =>
      row.querySelector("[data-row-id]")?.getAttribute("data-row-id") ??
      row.querySelector("td:nth-child(2) .text-muted-foreground")?.textContent
    ))
    const waitOrder = async expected => {
      for (let n = 0; n < 40; n++) {
        if (JSON.stringify(await identities()) === JSON.stringify(expected)) return
        await page.waitForTimeout(40)
      }
      assert.deepEqual(await identities(), expected)
    }
    const drag = async (from, to, cancel = false) => {
      const handles = page.getByRole("button", { name: "Drag to reorder row", exact: true })
      const a = handles.nth(from), z = handles.nth(to)
      if (input === "keyboard") {
        await a.focus(); await page.keyboard.press("Space"); await page.waitForTimeout(60)
        for (let i = 0; i < Math.abs(to - from); i++) {
          await page.keyboard.press(to > from ? "ArrowDown" : "ArrowUp")
          await page.waitForTimeout(50)
        }
        await page.keyboard.press(cancel ? "Escape" : "Space")
      } else {
        const start = await a.boundingBox(), end = await z.boundingBox()
        await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2)
        await page.mouse.down()
        await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2 + 12, { steps: 3 })
        await page.waitForTimeout(60)
        await page.mouse.move(end.x + end.width / 2, end.y + end.height / 2, { steps: 10 })
        await page.waitForTimeout(80)
        if (cancel) await page.keyboard.press("Escape")
        await page.mouse.up()
      }
      // dnd-kit keeps its document click-suppression listener for 50ms after
      // pointer teardown; a subsequent toolbar click belongs to a new gesture.
      await page.waitForTimeout(80)
    }
    try {
      await page.goto(`${origin}/?mode=demo-${demo}&dark=${+dark}&rtl=${+rtl}`)
      await page.getByRole("button", { name: "Drag to reorder row", exact: true }).first().waitFor()
      await page.evaluate(() => document.fonts.ready)
      assert.equal(await page.locator('[data-slot="data-grid"]').count(), 1)
      assert.equal(await page.locator('[data-slot="card"]').count(), 0)
      let order = await identities()
      assert.equal(order.length, 5)
      const initial = [...order]
      for (const [from, to] of [[0, 2], [3, 1], [4, 0]]) {
        await drag(from, to)
        const [moved] = order.splice(from, 1); order.splice(to, 0, moved)
        await waitOrder(order)
      }
      await drag(0, 2, true); await waitOrder(order)
      assert.equal(await page.evaluate(() => document.body.style.cursor), "")
      // Reordering the next page must not use indices from the first page.
      await page.getByRole("button", { name: "Go to next page", exact: true }).click()
      await page.waitForTimeout(100)
      let secondPage = await identities()
      await drag(0, 1)
      ;[secondPage[0], secondPage[1]] = [secondPage[1], secondPage[0]]
      await waitOrder(secondPage)
      await page.getByRole("button", { name: "Go to previous page", exact: true }).click()
      await waitOrder(order)
      // Sorting is explicitly a separate order mode, not a silent snap-back.
      const title = demo === "basic" ? "Staff" : "Name"
      await page.getByRole("button", { name: title, exact: true }).click()
      await page.getByRole("menuitem", { name: "Asc", exact: true }).click()
      const grip = page.getByRole("button", { name: "Drag to reorder row", exact: true }).first()
      assert.equal(await grip.isDisabled(), true)
      assert.equal(await grip.getAttribute("title"), "Clear column sorting to reorder rows")
      await page.getByRole("button", { name: title, exact: true }).click()
      await page.getByRole("menuitem", { name: "Asc", exact: true }).click()
      await waitOrder(order)
      assert.equal(await grip.isDisabled(), false)
      // A filtered model still owns the drag geometry and page membership.
      await page.getByRole("button", { name: `Filter ${title}`, exact: true }).click()
      await page.getByRole("textbox", { name: `${title} filter value`, exact: true }).fill("e")
      await page.getByRole("button", { name: "Apply", exact: true }).click()
      await page.waitForTimeout(100)
      const filtered = await identities()
      assert.ok(filtered.length >= 2)
      await drag(0, 1)
      ;[filtered[0], filtered[1]] = [filtered[1], filtered[0]]
      await waitOrder(filtered)
      const next = page.getByRole("button", { name: "Go to next page", exact: true })
      assert.equal(await next.count(), 1)
      assert.equal(await next.isDisabled(), false)
      await next.click(); await page.waitForTimeout(80)
      await page.getByRole("button", { name: `Filter ${title}`, exact: true }).click()
      await page.getByRole("textbox", { name: `${title} filter value`, exact: true }).fill(demo === "basic" ? "Sarah" : "Riley")
      await page.getByRole("button", { name: "Apply", exact: true }).click()
      await page.waitForTimeout(100)
      assert.equal((await identities()).length, 2)
      assert.match(await page.locator('[data-slot="data-grid-pagination"]').innerText(), /1\s*-\s*2\s*of\s*2/)
      // The shared pagination intentionally hides navigation for one page.
      assert.equal(await next.count(), 0)
      assert.equal(await page.getByRole("button", { name: "Go to previous page", exact: true }).count(), 0)
      assert.deepEqual(errors, [])
      await page.screenshot({ path: path.join(output, id + ".png") })
      results.push({ id, pass: true, initial, repeatedDrags: 3, cancellation: true, pagination: true, sortingGuardAndRecovery: true, filteredReorder: true, filteredCountAndPageReset: true })
      console.log("PASS", id)
    } catch (error) {
      results.push({ id, pass: false, error: error.stack, errors })
      console.log("FAIL", id, error.message)
      await page.screenshot({ path: path.join(output, id + "-failure.png") })
    } finally { await page.close() }
  }
  for (const demo of ["editing", "async"]) for (const config of [cases[0], cases[2]]) {
    const page = await browser.newPage({ viewport: { width: config.width, height: 1000 } })
    page.setDefaultTimeout(8000)
    const id = `${engine}-${demo}-${config.width}-${config.rtl ? "rtl" : "ltr"}`
    try {
      await page.goto(`${origin}/?mode=demo-${demo}&dark=${+config.rtl}&rtl=${+config.rtl}`)
      const name = page.locator('[data-slot="data-grid-editable-cell"][data-column-id="name"]').first()
      const rowId = await name.getAttribute("data-row-id")
      const row = page.locator("tbody tr").filter({ has: page.locator(`[data-row-id="${rowId}"][data-column-id="name"]`) })
      const before = (await row.boundingBox()).height
      const original = await name.getByRole("button").innerText()
      assert.equal(await page.locator('[data-slot="data-grid"]').count(), 1)
      assert.equal(await page.locator('[data-slot="card"]').count(), 0)
      await name.getByRole("button").click()
      await name.getByRole("textbox").fill(original + " QA")
      assert.ok(Math.abs((await row.boundingBox()).height - before) < .5)
      await page.keyboard.press("Enter")
      if (demo === "async") {
        await page.waitForTimeout(80)
        assert.equal(await name.getByRole("textbox").isDisabled(), true)
        assert.ok(Math.abs((await row.boundingBox()).height - before) < .5)
      }
      await name.getByRole("button", { name: original + " QA", exact: true }).waitFor()
      assert.ok(Math.abs((await row.boundingBox()).height - before) < .5)
      if (demo === "async") {
        await page.getByRole("button", { name: "Fail next save", exact: true }).click()
        await name.getByRole("button").click()
        await name.getByRole("textbox").fill(original + " rejected")
        await page.keyboard.press("Enter")
        await page.getByText(/Simulated API failure/).first().waitFor()
        await page.keyboard.press("Escape")
        await name.getByRole("button", { name: original + " QA", exact: true }).waitFor()
      }
      await page.getByRole("button", { name: demo === "async" ? "Reset demo" : "Reset all", exact: true }).click()
      await name.getByRole("button", { name: original, exact: true }).waitFor()
      results.push({ id, pass: true, save: true, reset: true, pendingAndRollback: demo === "async", rowHeight: before })
      console.log("PASS", id)
    } catch (error) {
      results.push({ id, pass: false, error: error.stack })
      console.log("FAIL", id, error.message)
      await page.screenshot({ path: path.join(output, id + "-failure.png") })
    } finally { await page.close() }
  }
  for (const mode of ["rows", "combined"]) {
    const page = await browser.newPage()
    const id = `${engine}-${mode}-rendered-scope`
    try {
      await page.goto(origin)
      await page.waitForFunction(() => !!window.gridAcceptance)
      await page.getByRole("button", { name: mode, exact: true }).click()
      await page.evaluate(() => {
        const table = window.gridAcceptance.table
        table.setPagination({ pageIndex: 1, pageSize: 5 })
        table.setColumnFilters([{ id: "age", value: { type: "number", operator: ">=", value: "5" } }])
      })
      await page.waitForTimeout(100)
      const visible = () => page.locator('[data-column-id="name"][data-slot="data-grid-editable-cell"]').evaluateAll(nodes => nodes.map(n => n.getAttribute("data-row-id")))
      const expected = await visible()
      const grip = page.getByRole("button", { name: "Drag to reorder row", exact: true }).first()
      await grip.focus(); await page.keyboard.press("Space"); await page.waitForTimeout(60)
      await page.keyboard.press("ArrowDown"); await page.waitForTimeout(60); await page.keyboard.press("Space")
      await page.waitForTimeout(120)
      ;[expected[0], expected[1]] = [expected[1], expected[0]]
      assert.deepEqual(await visible(), expected)
      assert.equal(await page.evaluate(() => window.gridAcceptance.table.store.state.pagination.pageIndex), 1)
      const before = await page.evaluate(() => ({ rows: window.gridAcceptance.rows.map(r => r.id), events: window.gridAcceptance.events.length }))
      await grip.focus(); await page.keyboard.press("Space"); await page.waitForTimeout(60)
      await page.evaluate(() => window.gridAcceptance.table.setColumnFilters([{ id: "age", value: { type: "number", operator: ">=", value: "490" } }]))
      await page.waitForTimeout(80); await page.keyboard.press("Space"); await page.waitForTimeout(100)
      assert.deepEqual(await page.evaluate(() => window.gridAcceptance.rows.map(r => r.id)), before.rows)
      assert.equal(await page.evaluate(() => window.gridAcceptance.events.length), before.events)
      assert.equal(await page.evaluate(() => document.body.style.cursor), "")
      results.push({ id, pass: true, filteredPaginatedMove: true, originalCallbackIds: true, staleViewDropIgnored: true })
      console.log("PASS", id)
    } catch (error) { results.push({ id, pass: false, error: error.stack }); console.log("FAIL", id, error.message) }
    finally { await page.close() }
  }
  {
    const page = await browser.newPage({ viewport: { width: 1800, height: 1000 } })
    const id = `${engine}-combined-visible-column-scope`
    try {
      await page.goto(origin)
      await page.waitForFunction(() => !!window.gridAcceptance)
      await page.getByRole("button", { name: "combined", exact: true }).click()
      await page.evaluate(() => {
        const table = window.gridAcceptance.table
        table.getColumn("age").toggleVisibility(false)
        table.getColumn("name").pin("start")
      })
      await page.waitForTimeout(100)
      const columnHandle = title => page.getByRole("columnheader")
        .filter({ has: page.getByRole("button", { name: title, exact: true }) })
        .getByRole("button", { name: "Drag to reorder column", exact: true })
      const before = await page.evaluate(() => window.gridAcceptance.table.store.state.columnOrder)
      await columnHandle("Status").focus(); await page.keyboard.press("Space"); await page.waitForTimeout(60)
      await page.keyboard.press("ArrowRight"); await page.waitForTimeout(60); await page.keyboard.press("Space")
      await page.waitForTimeout(100)
      const expected = [...before], a = expected.indexOf("status"), z = expected.indexOf("date")
      ;[expected[a], expected[z]] = [expected[z], expected[a]]
      assert.deepEqual(await page.evaluate(() => window.gridAcceptance.table.store.state.columnOrder), expected)
      const events = await page.evaluate(() => window.gridAcceptance.events.length)
      await columnHandle("Date").focus(); await page.keyboard.press("Space"); await page.waitForTimeout(60)
      await page.evaluate(() => window.gridAcceptance.table.getColumn("date").toggleVisibility(false))
      await page.waitForTimeout(80); await page.keyboard.press("Space"); await page.waitForTimeout(100)
      assert.deepEqual(await page.evaluate(() => window.gridAcceptance.table.store.state.columnOrder), expected)
      assert.equal(await page.evaluate(() => window.gridAcceptance.events.length), events)
      results.push({ id, pass: true, hiddenAndPinnedColumns: true, staleHiddenColumnDropIgnored: true })
      console.log("PASS", id)
    } catch (error) { results.push({ id, pass: false, error: error.stack }); console.log("FAIL", id, error.message) }
    finally { await page.close() }
  }
  // Virtual rendering is a distinct supported renderer, not a virtual-DnD API.
  {
    const page = await browser.newPage()
    const id = `${engine}-virtual-sort-filter-scroll`
    try {
      await page.goto(origin)
      await page.waitForFunction(() => window.gridAcceptance?.rows.length === 500)
      const mounted = () => page.locator("tbody tr[data-index]").count()
      assert.ok(await mounted() > 0 && await mounted() < 80)
      await page.evaluate(() => {
        window.gridAcceptance.setHasMore(false)
        window.gridAcceptance.table.setSorting([{ id: "age", desc: true }])
      })
      await page.waitForTimeout(100)
      await page.locator('[data-slot="scroll-area-viewport"]').evaluate(node => { node.scrollTop = 6000 })
      await page.waitForTimeout(150)
      assert.ok(await mounted() > 0 && await mounted() < 80)
      await page.evaluate(() => window.gridAcceptance.table.setColumnFilters([{ id: "age", value: { type: "number", operator: ">=", value: "495" } }]))
      await page.waitForTimeout(150)
      assert.equal(await page.evaluate(() => window.gridAcceptance.table.getRowModel().rows.length), 5)
      assert.ok(await mounted() > 0 && await mounted() <= 5)
      assert.equal(await page.getByRole("button", { name: "Drag to reorder row", exact: true }).count(), 0)
      results.push({ id, pass: true, boundedMountedRows: true, sort: true, filter: true, scroll: true, virtualizedDnd: "unsupported; not added" })
      console.log("PASS", id)
    } catch (error) { results.push({ id, pass: false, error: error.stack }); console.log("FAIL", id, error.message) }
    finally { await page.close() }
  }
  if (engine === "chromium") for (const demo of ["basic", "features"]) {
    const page = await browser.newPage({ viewport: { width: 390, height: 1000 }, hasTouch: true })
    const id = `${engine}-${demo}-touch`
    try {
      await page.goto(`${origin}/?mode=demo-${demo}`)
      const handles = page.getByRole("button", { name: "Drag to reorder row", exact: true })
      await handles.first().waitFor()
      const rows = () => page.locator("tbody tr").evaluateAll(nodes => nodes.map(row => row.querySelector("[data-row-id]")?.getAttribute("data-row-id") ?? row.querySelector("td:nth-child(2) .text-muted-foreground")?.textContent))
      const expected = await rows(), a = await handles.nth(0).boundingBox(), z = await handles.nth(1).boundingBox()
      const cdp = await page.context().newCDPSession(page)
      const x = a.x + a.width / 2, y = a.y + a.height / 2, end = z.y + z.height / 2
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y, id: 1 }] })
      for (let i = 1; i <= 12; i++) {
        await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: y + (end - y) * i / 12, id: 1 }] })
        await page.waitForTimeout(20)
      }
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] })
      await page.waitForTimeout(150)
      ;[expected[0], expected[1]] = [expected[1], expected[0]]
      assert.deepEqual(await rows(), expected)
      results.push({ id, pass: true, touch: "automated CDP native touch; not physical device acceptance" })
      console.log("PASS", id)
    } catch (error) { results.push({ id, pass: false, error: error.stack }); console.log("FAIL", id, error.message) }
    finally { await page.close() }
  }
  await browser.close()
}
await fs.writeFile(path.join(output, "demo-results.json"), JSON.stringify({ versions, results }, null, 2))
console.log(`${results.filter(x => x.pass).length}/${results.length} actual-demo drag configurations passed`)
if (results.some(x => !x.pass)) process.exitCode = 1
