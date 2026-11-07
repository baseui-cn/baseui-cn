import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import { createRequire } from "node:module"
if (!process.env.BASEUI_TEST_TOOLS) throw Error("Set BASEUI_TEST_TOOLS to a project with playwright and axe-core")
const require = createRequire(path.join(process.env.BASEUI_TEST_TOOLS, "package.json"))
const playwright = require("playwright")
const axe = require.resolve("axe-core/axe.min.js")
const output = process.env.EVIDENCE_DIR ?? "/private/tmp/grid-fixed-browser"
await fs.mkdir(output, { recursive: true })
const results = [], versions = {}, fullPageAxeObservations = []
for (const engine of (process.env.GRID_BROWSERS ?? "chromium,firefox,webkit").split(",")) {
 const browser = await playwright[engine].launch({ headless: true })
 versions[engine] = browser.version()
 const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
 page.setDefaultTimeout(6000)
 await page.clock.setFixedTime(new Date("2026-10-29T12:00:00Z"))
 const errors = []
 page.on("pageerror", (error) => errors.push(error.message))
 const reset = async (mode = "dynamic") => {
   await page.goto(`${process.env.GRID_CONSUMER_URL ?? "http://127.0.0.1:4196"}/?mode=${mode}`)
   await page.waitForFunction((mode) => mode === "acceptance" ? !!window.gridAcceptance : mode === "preferences" ? !!window.preferenceProbe : mode.startsWith("inline") ? !!window.regressionInline : !!window.regressionGrid, mode)
   await page.waitForTimeout(100)
 }
 const run = async (finding, name, fn) => {
   if (process.env.GRID_GROUP_PATTERN && finding !== "all" && !new RegExp(process.env.GRID_GROUP_PATTERN).test(`${finding} ${name}`)) return
   try { await fn(); results.push({ engine, finding, name, pass: true }); console.log(`PASS ${engine} ${finding}: ${name}`) }
   catch (error) { results.push({ engine, finding, name, pass: false, error: error.message }); console.log(`FAIL ${engine} ${finding}: ${name}: ${error.message}`); await page.screenshot({ path: path.join(output, `${engine}-failure-${results.length}.png`) }) }
 }
 const cell = (column, row = "one") => page.locator(`[data-slot="data-grid-editable-cell"][data-row-id="${row}"][data-column-id="${column}"]`)
 const auditAxe = async (surface = "page") => {
   await page.addScriptTag({ path: axe })
   const fullPage = await page.evaluate(async () => (await window.axe.run(document, { rules: { region: { enabled: false } } })).violations.map(({ id, nodes }) => ({ id, targets: nodes.map(n => n.target) })))
   if (fullPage.length) fullPageAxeObservations.push({ engine, surface, violations: fullPage })
   const violations = surface === "select" ? await page.evaluate(async () =>
     (await window.axe.run({ include: [['[data-slot="select-trigger"]'], ['[data-slot="select-content"]']] }, { rules: { region: { enabled: false } } })).violations.map(({ id, nodes }) => ({ id, targets: nodes.map(n => n.target) }))) : fullPage
   assert.deepEqual(violations, [])
 }
 await run("F01", "dialog merges only dirty fields and rejects dirty-field conflicts", async () => {
   await reset(); await page.evaluate(() => window.regressionGrid.editing.openDialog(window.regressionGrid.rows[0]))
   await page.getByRole("dialog").waitFor()
   await page.evaluate(() => window.regressionGrid.setRows(rows => rows.map(row => ({ ...row, a: "Server A" }))))
   await page.getByRole("dialog").getByRole("textbox", { name: "B", exact: true }).fill("User B")
   await page.getByRole("button", { name: "Save changes", exact: true }).click(); await page.getByRole("dialog").waitFor({ state: "hidden" })
   assert.equal(await page.evaluate(() => window.regressionGrid.rows[0].a), "Server A")
   assert.deepEqual(await page.evaluate(() => window.regressionGrid.savedDrafts), [{ b: "User B" }])
   await page.evaluate(() => window.regressionGrid.editing.openDialog(window.regressionGrid.rows[0]))
   await page.getByRole("dialog").getByRole("textbox", { name: "B", exact: true }).fill("Stale B")
   await page.evaluate(() => window.regressionGrid.setRows(rows => rows.map(row => ({ ...row, b: "New server B" }))))
   await page.getByRole("button", { name: "Save changes", exact: true }).click()
   await page.getByText(/B changed while this dialog was open/).waitFor()
   assert.equal(await page.evaluate(() => window.regressionGrid.rows[0].b), "New server B")
   assert.equal(await page.evaluate(() => window.regressionGrid.savedDrafts.length), 1)
 })
 await run("F02/F08", "unequal pinned widths and new column variables in LTR and RTL", async () => {
   for (const rtl of [false, true]) {
     await reset(); await page.evaluate(rtl => { const g = window.regressionGrid; g.setVariant(true); g.setRtl(rtl) }, rtl)
     await page.waitForFunction(() => document.querySelector("table").style.getPropertyValue("--col-c-size") === "300")
     await page.evaluate(() => { const t = window.regressionGrid.table; t.getColumn("c").pin("start"); t.getColumn("a").pin("end") })
     await page.waitForTimeout(80)
     const widths = await page.locator("th").evaluateAll(nodes => nodes.filter(n => n.innerText.trim()).map(n => ({ title: n.innerText.trim(), width: n.getBoundingClientRect().width })))
     assert.deepEqual(widths.map(w => w.title), ["C", "B", "A"])
     widths.forEach((w, i) => assert.ok(Math.abs(w.width - [300, 200, 100][i]) < 1, JSON.stringify(widths)))
   }
 })
 await run("F03", "slow Tab retains a later editor and ignores refreshed save ownership", async () => {
   await reset("acceptance"); await page.evaluate(() => { window.gridAcceptance.setHasMore(false); window.gridAcceptance.setDelay(450) }); await page.waitForTimeout(50)
   await cell("name", "name").getByRole("button").click(); await cell("name", "name").getByRole("textbox").fill("First save"); await page.keyboard.press("Tab")
   await page.waitForTimeout(60); await cell("name", "row-1").getByRole("button").click(); await cell("name", "row-1").getByRole("textbox").fill("Later draft")
   await page.waitForTimeout(550)
   assert.deepEqual(await page.evaluate(() => window.gridAcceptance.editing.activeCell), { rowId: "row-1", columnId: "name" })
   assert.equal(await cell("name", "row-1").getByRole("textbox").inputValue(), "Later draft")
   await reset("acceptance"); await page.evaluate(() => { window.gridAcceptance.setHasMore(false); window.gridAcceptance.setDelay(350) }); await page.waitForTimeout(50)
   await cell("name", "name").getByRole("button").click(); await cell("name", "name").getByRole("textbox").fill("Saving"); await page.keyboard.press("Tab")
   await page.waitForTimeout(80); await page.evaluate(() => window.gridAcceptance.setRows(rows => rows.map((row, index) => index ? row : { ...row, name: "Refreshed" })))
   await page.waitForTimeout(450)
   assert.equal(await page.evaluate(() => window.gridAcceptance.rows[0].name), "Refreshed")
   assert.equal(await page.evaluate(() => window.gridAcceptance.editing.activeCell), null)
   await reset("acceptance"); await page.evaluate(() => window.gridAcceptance.setHasMore(false))
   await cell("name", "name").getByRole("button").click(); await cell("name", "name").getByRole("textbox").fill(""); await page.keyboard.press("Tab")
   await page.evaluate(() => { const g = window.gridAcceptance; g.editing.startCellEdit(g.rows[0], "name") })
   await cell("name", "name").getByRole("textbox").fill("Reopened session"); await page.keyboard.press("Tab"); await page.waitForTimeout(200)
   assert.deepEqual(await page.evaluate(() => window.gridAcceptance.editing.activeCell), { rowId: "name", columnId: "age" })
 })
 await run("F04", "composition Enter preserves default and standalone drafts", async () => {
   for (const standalone of [false, true]) {
     await reset(standalone ? "inline-text" : "dynamic")
     if (!standalone) await cell("a").getByRole("button").click()
     const input = standalone ? page.getByRole("textbox", { name: "Standalone text" }) : cell("a").getByRole("textbox")
     await input.fill("Composition")
     await input.evaluate(node => node.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", isComposing: true, bubbles: true })))
     await page.waitForTimeout(80)
     assert.equal(await page.evaluate(standalone => standalone ? window.regressionInline.value : window.regressionGrid.rows[0].a, standalone), "Alpha")
     await input.press("Enter"); await page.waitForTimeout(80)
     assert.equal(await page.evaluate(standalone => standalone ? window.regressionInline.value : window.regressionGrid.rows[0].a, standalone), "Composition")
   }
 })
 await run("F05/F14", "named selects, unavailable options and nullable values", async () => {
   for (const standalone of [false, true]) {
     await reset(standalone ? "inline" : "options")
     if (!standalone) await cell("status").getByRole("button").click()
     const trigger = page.getByRole("combobox", { name: standalone ? "Standalone status" : "Status", exact: true })
     await trigger.waitFor(); await auditAxe("select")
     if (standalone) await trigger.click()
     const option = page.getByRole("option", { name: "Unavailable", exact: true })
     assert.equal(await option.getAttribute("aria-disabled"), "true")
     await page.getByRole("option", { name: "No status", exact: true }).click(); await page.waitForTimeout(100)
     assert.equal(await page.evaluate(standalone => standalone ? window.regressionInline.value : window.regressionGrid.rows[0].status, standalone), null)
   }
   await reset("preferences"); await page.getByRole("button", { name: "Design", exact: true }).first().click()
   await page.getByRole("combobox", { name: "Team", exact: true }).waitFor(); await auditAxe("select")
 })
 await run("F06", "inline and dialog number controls are disabled while saving", async () => {
   await reset("options"); await page.evaluate(() => window.regressionGrid.setDelay(350)); await page.waitForTimeout(50)
   await cell("age").getByRole("button").click(); await cell("age").getByRole("textbox").fill("43"); await page.keyboard.press("Enter")
   await page.waitForFunction(() => window.regressionGrid.editing.isCellPending("one", "age"))
   assert.equal(await cell("age").getByRole("textbox").isDisabled(), true)
   assert.ok((await cell("age").getByRole("button").evaluateAll(nodes => nodes.map(n => n.disabled))).every(Boolean))
   await page.waitForTimeout(450)
   await page.evaluate(() => window.regressionGrid.editing.openDialog(window.regressionGrid.rows[0])); await page.getByRole("dialog").waitFor()
   await page.getByRole("dialog").getByRole("textbox", { name: "Age", exact: true }).fill("44")
   await page.getByRole("button", { name: "Save changes", exact: true }).click()
   assert.equal(await page.getByRole("dialog").getByRole("textbox", { name: "Age", exact: true }).isDisabled(), true)
   await page.getByRole("dialog").waitFor({ state: "hidden" })
   assert.equal(await page.evaluate(() => window.regressionGrid.rows[0].age), 44)
 })
 await run("F09", "geometry-only resize skips cells; data updates still render during resize", async () => {
   for (const mode of ["dynamic", "virtual-disabled"]) {
     await reset(mode); await page.evaluate(() => window.regressionGrid.table.setColumnResizing(s => ({ ...s, isResizingColumn: "a" }))); await page.waitForTimeout(80)
     await page.evaluate(() => { const g = window.regressionGrid; g.renderCounts.cells = 0; g.table.setColumnSizing({ a: 130 }) }); await page.waitForTimeout(80)
     assert.equal(await page.evaluate(() => window.regressionGrid.renderCounts.cells), 0, mode)
     await page.evaluate(() => window.regressionGrid.setRows(rows => rows.map(row => ({ ...row, a: "Live update" })))); await page.waitForTimeout(80)
     assert.ok(await page.evaluate(() => window.regressionGrid.renderCounts.cells > 0))
     assert.ok(await page.getByRole("button", { name: "Live update", exact: true }).isVisible())
   }
 })
 await run("F10/F11", "minimal virtual overrides, logical indices, sorting and keyboard resize", async () => {
   await reset("virtual-disabled"); assert.equal(await page.locator("tbody tr[aria-rowindex]").count(), 1)
   const separator = page.getByRole("separator", { name: "Resize A column", exact: true })
   await separator.focus(); await page.keyboard.press("ArrowRight"); await page.waitForTimeout(80)
   assert.equal(await page.evaluate(() => window.regressionGrid.table.getColumn("a").getSize()), 110)
   await page.evaluate(() => window.regressionGrid.setRtl(true)); await page.waitForTimeout(50)
   await separator.focus(); await page.keyboard.press("ArrowLeft"); await page.waitForTimeout(80)
   assert.equal(await page.evaluate(() => window.regressionGrid.table.getColumn("a").getSize()), 120)
   await page.keyboard.press("Home"); await page.waitForTimeout(50); assert.equal(await separator.getAttribute("aria-valuenow"), "20")
   await reset("acceptance"); await page.evaluate(() => { window.gridAcceptance.setHasMore(false); window.gridAcceptance.table.setSorting([{ id: "name", desc: false }]) }); await page.waitForTimeout(80)
   assert.ok(Number(await page.locator("table").getAttribute("aria-rowcount")) >= 501)
   assert.equal(await page.locator('th[aria-sort="ascending"]').count(), 1)
   const before = await page.locator("tbody tr[data-index]").first().getAttribute("aria-rowindex")
   await page.locator('[data-slot="scroll-area-viewport"]').evaluate(n => { n.scrollTop = 6000 }); await page.waitForTimeout(100)
   const after = await page.locator("tbody tr[data-index]").first().getAttribute("aria-rowindex")
   assert.ok(Number(after) > Number(before))
   const indices = await page.locator("tr[aria-rowindex]").evaluateAll(nodes => nodes.map(n => Number(n.getAttribute("aria-rowindex"))))
   assert.ok(indices.every((n, i) => !i || n > indices[i - 1]))
   await auditAxe()
 })
 await run("Polish", "row pin fill, pressed state and labels agree for pointer and keyboard", async () => {
   for (const mode of ["basic", "virtual", "combined", "rows", "columns"]) {
     for (const [dark, rtl] of mode === "basic" ? [[false, false], [true, false], [false, true], [true, true]] : [[false, false]]) {
       await reset("acceptance")
       await page.evaluate(() => window.gridAcceptance.setHasMore(false))
       if (mode !== "virtual") await page.getByRole("button", { name: mode, exact: true }).click()
       if (dark) await page.getByRole("button", { name: "Toggle dark", exact: true }).click()
       if (rtl) await page.getByRole("button", { name: "Toggle RTL", exact: true }).click()
       const row = page.locator("tbody tr").filter({ has: page.locator('[data-slot="data-grid-editable-cell"][data-row-id="name"]') })
       const pin = (pinned) => row.getByRole("button", { name: pinned ? "Unpin row" : "Pin row", exact: true })
       const assertState = async (pinned) => {
         assert.equal(await pin(pinned).getAttribute("aria-pressed"), String(pinned))
         assert.equal(await pin(pinned).getAttribute("title"), pinned ? "Unpin row" : "Pin row")
         assert.equal(await pin(pinned).locator("svg").getAttribute("fill"), pinned ? "currentColor" : "none")
         if (pinned) assert.equal(await pin(true).evaluate(node => getComputedStyle(node.querySelector("svg")).fill), await pin(true).evaluate(node => getComputedStyle(node).color))
       }
       await assertState(false)
       await pin(false).click(); await page.getByRole("menuitem", { name: "Pin to top", exact: true }).click()
       await page.waitForFunction(() => window.gridAcceptance.table.getRow("name").getIsPinned() === "top")
       await assertState(true)
       await pin(true).click(); await page.getByRole("menuitem", { name: "Unpin row", exact: true }).click()
       await page.waitForFunction(() => !window.gridAcceptance.table.getRow("name").getIsPinned())
       await page.locator('[data-slot="scroll-area-viewport"]').evaluate(node => { node.scrollTop = 0 })
       await assertState(false)
       await pin(false).focus(); await page.keyboard.press("Space")
       await page.getByRole("menuitem", { name: "Pin to bottom", exact: true }).focus(); await page.keyboard.press("Enter")
       await page.waitForFunction(() => window.gridAcceptance.table.getRow("name").getIsPinned() === "bottom")
       await assertState(true)
       await pin(true).focus(); await page.keyboard.press("Enter")
       await page.getByRole("menuitem", { name: "Unpin row", exact: true }).focus(); await page.keyboard.press("Space")
       await page.waitForFunction(() => !window.gridAcceptance.table.getRow("name").getIsPinned())
       // Unpinning a bottom row returns it to its logical position outside a virtual window.
       await page.locator('[data-slot="scroll-area-viewport"]').evaluate(node => { node.scrollTop = 0 })
       await assertState(false)
     }
   }
   await reset("preferences")
   const previewPin = page.getByRole("button", { name: "Pin row", exact: true }).first()
   await previewPin.click(); await page.getByRole("menuitem", { name: "Pin to top", exact: true }).click()
   const previewPinned = page.getByRole("button", { name: "Unpin row", exact: true })
   assert.equal(await previewPinned.getAttribute("aria-pressed"), "true")
   assert.equal(await previewPinned.locator("svg").getAttribute("fill"), "currentColor")
 })
 await run("Polish", "pagination values fit, navigation works and empty range starts at zero", async () => {
   for (const width of [320, 530, 1440]) for (const [dark, rtl] of [[false, false], [true, false], [false, true], [true, true]]) {
     await page.setViewportSize({ width, height: 1000 }); await reset("acceptance")
     await page.evaluate(() => window.gridAcceptance.setHasMore(false))
     if (dark) await page.getByRole("button", { name: "Toggle dark", exact: true }).click()
     if (rtl) await page.getByRole("button", { name: "Toggle RTL", exact: true }).click()
     const footer = page.locator('[data-slot="data-grid-pagination"]')
     const sizes = footer.getByRole("combobox", { name: "Rows per page", exact: true })
     for (const size of [5, 10, 25, 50, 100, 500]) {
       await page.evaluate(size => window.gridAcceptance.table.setPageSize(size), size)
       await page.waitForFunction(size => document.querySelector('[data-slot="data-grid-pagination"] [data-slot="select-value"]').textContent === String(size), size)
       const value = await sizes.locator('[data-slot="select-value"]').evaluate(node => { const range = document.createRange(); range.selectNodeContents(node); return { width: node.getBoundingClientRect().width, textWidth: range.getBoundingClientRect().width } })
       assert.ok(value.width >= value.textWidth - 0.1, JSON.stringify({ engine, width, dark, rtl, size, value }))
     }
     const box = await footer.boundingBox()
     assert.ok(box && box.x >= 0 && box.x + box.width <= width + 1)
     assert.equal(await footer.getByText("1 - 500 of 500", { exact: true }).evaluate(node => getComputedStyle(node).direction), "ltr")
     assert.equal(await footer.getByRole("navigation", { name: "Pagination", exact: true }).count(), 0)
     await page.screenshot({ path: path.join(output, `${engine}-pagination-${width}-${dark ? "dark" : "light"}-${rtl ? "rtl" : "ltr"}.png`) })
   }
   await page.setViewportSize({ width: 1280, height: 900 }); await reset("acceptance")
   const footer = page.locator('[data-slot="data-grid-pagination"]')
   await page.evaluate(() => { window.gridAcceptance.setHasMore(false); window.gridAcceptance.table.setPageSize(5) })
   const next = footer.getByRole("button", { name: "Go to next page", exact: true })
   const previous = footer.getByRole("button", { name: "Go to previous page", exact: true })
   assert.equal(await previous.isDisabled(), true)
   await next.click(); await page.waitForFunction(() => window.gridAcceptance.table.store.state.pagination.pageIndex === 1)
   assert.equal(await footer.getByRole("button", { name: "Page 2", exact: true }).getAttribute("aria-current"), "page")
   await previous.focus(); await page.keyboard.press("Enter")
   await page.waitForFunction(() => window.gridAcceptance.table.store.state.pagination.pageIndex === 0)
   await footer.getByRole("button", { name: "Go to next pages", exact: true }).click()
   await page.waitForFunction(() => window.gridAcceptance.table.store.state.pagination.pageIndex === 5)
   await footer.getByRole("button", { name: "Go to previous pages", exact: true }).click()
   await page.waitForFunction(() => window.gridAcceptance.table.store.state.pagination.pageIndex === 4)
   await footer.getByRole("combobox", { name: "Rows per page", exact: true }).click()
   await page.getByRole("option", { name: "50", exact: true }).click()
   await page.waitForFunction(() => window.gridAcceptance.table.store.state.pagination.pageSize === 50)
   await page.evaluate(() => { window.gridAcceptance.setRows([]); window.gridAcceptance.table.setPageIndex(0) })
   await footer.getByText("0 - 0 of 0", { exact: true }).waitFor()
 })
 await run("Polish", "standalone keyboard DnD moves one neighbor in LTR and RTL", async () => {
   for (const mode of ["rows", "columns"]) for (const rtl of [false, true]) {
     await reset("acceptance"); await page.getByRole("button", { name: mode, exact: true }).click()
     if (rtl) await page.getByRole("button", { name: "Toggle RTL", exact: true }).click()
     if (mode === "rows") await page.locator("tbody tr").evaluateAll(nodes => nodes.forEach(node => { node.style.height = "96px" }))
     const handle = page.getByRole("button", { name: mode === "rows" ? "Drag to reorder row" : "Drag to reorder", exact: true }).nth(mode === "rows" ? 0 : 1)
     await handle.focus(); await page.keyboard.press("Space"); await page.waitForTimeout(80)
     await page.keyboard.press(mode === "rows" ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight"); await page.waitForTimeout(80)
     await page.keyboard.press("Space")
     if (mode === "rows") await page.waitForFunction(() => window.gridAcceptance.rows[1].id === "name")
     else await page.waitForFunction(() => window.gridAcceptance.table.store.state.columnOrder[2] === "name")
   }
 })
 await run("F12", "preference writes serialize and reads/replay do not write back", async () => {
   await reset("preferences"); await page.getByRole("button", { name: "Avery Miles", exact: true }).waitFor()
   assert.deepEqual(await page.evaluate(() => [window.preferenceProbe.columns.length, window.preferenceProbe.pinning.length]), [0, 0])
   await page.getByRole("button", { name: "Name", exact: true }).click(); await page.getByRole("menuitem", { name: "Pin to start", exact: true }).click()
   await page.waitForFunction(() => window.preferenceProbe.columns.length === 1)
   await page.getByRole("button", { name: "Unpin Name column", exact: true }).click(); await page.waitForTimeout(80)
   assert.equal(await page.evaluate(() => window.preferenceProbe.columns.length), 1)
   await page.evaluate(() => window.preferenceProbe.columns[0].resolve()); await page.waitForFunction(() => window.preferenceProbe.columns.length === 2)
   await page.evaluate(() => window.preferenceProbe.columns[1].resolve()); await page.waitForTimeout(80)
   await page.getByRole("button", { name: "Refresh rows", exact: true }).click(); await page.waitForTimeout(120)
   assert.equal(await page.evaluate(() => window.preferenceProbe.columns.length), 2)
 })
 await run("F12", "failed reorder retains a newer edit and locks overlapping reorder", async () => {
   await reset("preferences"); const handle = page.getByRole("button", { name: "Drag to reorder row", exact: true }).first()
   await handle.waitFor(); await handle.focus(); await page.keyboard.press("Space"); await page.waitForTimeout(80); await page.keyboard.press("ArrowDown"); await page.waitForTimeout(80); await page.keyboard.press("Space")
   await page.waitForFunction(() => window.preferenceProbe.reorder.length === 1)
   assert.ok((await page.getByRole("button", { name: "Drag to reorder row", exact: true }).evaluateAll(nodes => nodes.map(n => n.disabled))).every(Boolean))
   await page.getByRole("button", { name: "Avery Miles", exact: true }).click(); await page.getByRole("textbox", { name: "Name", exact: true }).fill("Edited Avery"); await page.keyboard.press("Enter")
   await page.getByRole("button", { name: "Edited Avery", exact: true }).waitFor()
   await page.evaluate(() => window.preferenceProbe.reorder[0].reject(Error("Reorder rejected"))); await page.getByRole("alert").getByText("Reorder rejected").waitFor()
   assert.ok((await page.locator("tbody tr").first().innerText()).includes("Edited Avery"))
 })
 await run("F16", "frozen consumer options support both pointer resize modes", async () => {
   await reset("frozen")
   for (const mode of ["onEnd", "onChange"]) {
     await page.evaluate(mode => window.regressionGrid.setResizeMode(mode), mode); await page.waitForTimeout(60)
     const width = await page.evaluate(() => window.regressionGrid.table.getColumn("a").getSize())
     const handle = page.getByRole("separator", { name: "Resize A column", exact: true }), box = await handle.boundingBox()
     assert.ok(box); await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down(); await page.mouse.move(box.x + box.width / 2 + 30, box.y + box.height / 2, { steps: 5 }); await page.waitForTimeout(80)
     assert.equal(await page.evaluate(() => window.regressionGrid.table.getColumn("a").getSize()) > width, mode === "onChange")
     await page.mouse.up(); await page.waitForTimeout(80)
     assert.ok(await page.evaluate(() => window.regressionGrid.table.getColumn("a").getSize()) > width)
     assert.equal(await page.evaluate(() => Object.isFrozen(window.regressionGrid.table.options)), true)
     assert.equal(await page.evaluate(() => window.regressionGrid.table.options.columnResizeMode), undefined)
   }
 })
 await run("F12", "refresh and source replacement invalidate an older reorder rollback", async () => {
   for (const replaceSource of [false, true]) {
     await reset("preferences")
     const handle = page.getByRole("button", { name: "Drag to reorder row", exact: true }).first()
     await handle.waitFor(); await handle.focus(); await page.keyboard.press("Space"); await page.waitForTimeout(80)
     await page.keyboard.press("ArrowDown"); await page.waitForTimeout(80); await page.keyboard.press("Space")
     await page.waitForFunction(() => window.preferenceProbe.reorder.length === 1)
     if (replaceSource) await page.evaluate(() => window.preferenceProbe.reloadSource())
     else await page.getByRole("button", { name: "Refresh rows", exact: true }).click()
     await page.waitForTimeout(150)
     assert.ok((await page.locator("tbody tr").first().innerText()).includes("Avery Miles"))
     await page.evaluate(() => window.preferenceProbe.reorder[0].reject(Error("Obsolete reorder failure")))
     await page.waitForTimeout(100)
     assert.equal(await page.getByRole("alert").count(), 0)
     assert.ok((await page.locator("tbody tr").first().innerText()).includes("Avery Miles"))
   }
 })
 await run("F15/Vite", "merged and clean CSS have real dark colors and preserve consumer CSS", async () => {
   for (const name of ["merged", "clean"]) {
     await page.goto(`${process.env.GRID_CONSUMER_URL ?? "http://127.0.0.1:4196"}/theme-${name}.html`)
     assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--background").trim()), "#101011")
     if (name === "merged") { const sizes = await page.getByRole("heading").evaluate(node => [parseFloat(getComputedStyle(node).fontSize), parseFloat(getComputedStyle(node.parentElement).fontSize)]); assert.ok(Math.abs(sizes[0] / sizes[1] - 3.2) < 0.01, JSON.stringify(sizes)) }
     await page.evaluate(() => document.documentElement.classList.remove("dark"))
     assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--background").trim()), "#f8f9fb")
   }
 })
 await run("all", "no browser runtime errors", () => assert.deepEqual(errors, []))
 await browser.close()
}
await fs.writeFile(path.join(output, "browser-regressions.json"), JSON.stringify({ versions, results, fullPageAxeObservations }, null, 2))
console.log(`${results.filter(r => r.pass).length}/${results.length} browser regression groups passed`)
if (results.some(r => !r.pass)) process.exitCode = 1
