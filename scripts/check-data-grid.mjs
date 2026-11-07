// Deterministic v9 model/filter/transport tests. No browser or backend is simulated here.
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { createRequire } from "node:module"
import { pathToFileURL, fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const require = createRequire(await fs.realpath(path.join(root, "packages/cli/node_modules/tsup/package.json")))
const { build } = require("esbuild")
const tableRequire = createRequire(await fs.realpath(path.join(root, "apps/www/node_modules/@tanstack/react-table/package.json")))
const bindings = tableRequire.resolve("@tanstack/table-core/store-reactivity-bindings")
const temp = await fs.mkdtemp(path.join(os.tmpdir(), "baseui-grid-v9-models-"))
const outfile = path.join(temp, "models.mjs")
await build({
  stdin: { contents: `
    export * from "./components/data-grid/data-grid-filter-client";
    export * from "./components/data-grid/data-grid-filter-server";
    export * from "./components/data-grid/table-features";
    export { constructTable } from "@tanstack/react-table";
    export { storeReactivityBindings } from ${JSON.stringify(bindings)};
  `, resolveDir: path.join(root, "apps/www"), loader: "ts" },
  tsconfig: path.join(root, "apps/www/tsconfig.json"),
  bundle: true, format: "esm", platform: "node", outfile, logLevel: "silent",
})
const m = await import(pathToFileURL(outfile))
let count = 0
const test = (label, fn) => { fn(); count++; console.log(`PASS ${label}`) }
for (const [operator, yes, no] of [
  ["contains", " Alpha Beta ", "gamma"], ["notContains", "gamma", "alpha"],
  ["equals", " ALPHA ", "alphas"], ["notEquals", "alphas", "alpha"],
  ["startsWith", "alphabet", "the alpha"], ["endsWith", "the alpha", "alphabet"],
]) test(`text ${operator}`, () => {
  assert.equal(m.matchesTextFilter(yes, operator, "alpha"), true)
  assert.equal(m.matchesTextFilter(no, operator, "alpha"), false)
})
for (const empty of [null, undefined, "", " \t "]) test(`blank ${String(empty)}`, () => {
  assert.equal(m.matchesTextFilter(empty, "blank", ""), true)
  assert.equal(m.matchesTextFilter(empty, "notBlank", ""), false)
})
test("zero is not blank", () => assert.equal(m.matchesTextFilter(0, "blank", ""), false))
for (const op of m.NUMERIC_OPERATORS) test(`number ${op}`, () => {
  for (const value of [-2, 0, 2, 2.5, "2"]) {
    const actual = Number(value)
    const expected = op === "=" ? actual === 2 : op === ">" ? actual > 2 :
      op === "<" ? actual < 2 : op === ">=" ? actual >= 2 : actual <= 2
    assert.equal(m.matchesNumberFilter(value, op, "2"), expected)
  }
})
for (const value of [null, undefined, "", " ", false, true, [], {}, "no", Infinity, NaN]) {
  test(`number rejects ${JSON.stringify(value)}`, () => assert.equal(m.matchesNumberFilter(value, "=", "0"), false))
}
test("empty numeric query rejected", () => {
  assert.equal(m.matchesNumberFilter(0, "=", ""), false)
  assert.equal(m.validateNumberFilter("=", " ").valid, false)
})
for (const key of ["2024-02-29", "2000-02-29", "0001-01-01", "2026-12-31"]) {
  test(`valid calendar ${key}`, () => assert.equal(m.isValidDate(key), true))
}
for (const key of ["2025-02-29", "1900-02-29", "2024-02-30", "2026-04-31", "0000-01-01", "2026-00-01", "2026-13-01", "2026-01-00", "10/11/2026", "2026-1-01"]) {
  test(`invalid calendar ${key}`, () => {
    assert.equal(m.isValidDate(key), false)
    assert.equal(m.matchesDateFilter(key, "after", "0001-01-01"), false)
    assert.equal(m.validateDateFilter("on", key).valid, false)
  })
}
test("date boundaries", () => {
  assert.equal(m.matchesDateFilter("2024-02-29", "before", "2024-02-29"), false)
  assert.equal(m.matchesDateFilter("2024-02-29", "after", "2024-02-29"), false)
  assert.equal(m.matchesDateFilter("2024-02-29", "on", "2024-02-29"), true)
  for (const value of ["2024-02-28", "2024-02-29", "2024-03-01"])
    assert.equal(m.matchesDateFilter(value, "between", "2024-02-28", "2024-03-01"), true)
  assert.equal(m.validateDateFilter("between", "2024-03-01", "2024-02-28").valid, false)
  assert.equal(m.matchesDateFilter("2024-02-29", "on", "2025-02-29"), false)
  assert.equal(m.matchesDateFilter(null, "before", "2026-01-01"), false)
  assert.equal(m.matchesDateFilter("2024-02-29T23:00:00Z", "on", "2024-02-29"), true)
  assert.equal(m.parseDataGridDate("0001-01-01").getFullYear(), 1)
})
test("transport roundtrip and strict validation", () => {
  const query = { pagination: { pageIndex: 0, pageSize: 20 }, sorting: [{ id: "name", desc: true }],
    columnFilters: [{ id: "date", value: { type: "date", operator: "between", value: "2024-02-28", secondValue: "2024-02-29" } }] }
  assert.deepEqual(JSON.parse(m.serializeDataGridQuery(query)), query)
  for (const value of [
    { type: "text", operator: "sql", value: "x" },
    { type: "number", operator: "=", value: "" },
    { type: "date", operator: "on", value: "2025-02-29" },
    { type: "date", operator: "between", value: "2024-02-29", secondValue: 99 },
  ]) assert.throws(() => m.serializeDataGridQuery({ ...query, columnFilters: [{ id: "x", value }] }))
  assert.throws(() => m.serializeDataGridQuery({ ...query, pagination: { pageIndex: -1, pageSize: 0 } }))
})
test("active labels", () => {
  assert.equal(m.formatFilterLabel("Name", { type: "text", operator: "blank", value: "" }), "Name is blank")
  assert.equal(m.formatFilterLabel("Age", { type: "number", operator: ">=", value: "18" }), "Age >= 18")
})
const table = m.constructTable({ features: { coreReactivityFeature: m.storeReactivityBindings(), ...m.dataGridFeatures },
  data: [{ id: "b", name: "Beta", age: 20 }, { id: "a", name: "Alpha", age: 10 }, { id: "c", name: "Gamma", age: 30 }],
  columns: [{ accessorKey: "name" }, { accessorKey: "age", filterFn: m.createExcelFilterFn() }],
  getRowId: (row) => row.id,
})
test("initial rows and explicit feature APIs", () => {
  assert.equal(table.getRowModel().rows.length, 3)
  for (const method of ["setSorting", "setPagination", "setColumnFilters", "setRowSelection", "setColumnVisibility", "setColumnSizing", "setColumnOrder", "setColumnPinning", "setRowPinning"])
    assert.equal(typeof table[method], "function", method)
})
test("registered auto sort functions", () => {
  table.setSorting([{ id: "name", desc: false }])
  assert.deepEqual(table.getRowModel().rows.map((row) => row.id), ["a", "b", "c"])
})
test("filter/pagination/selection/visibility", () => {
  table.setColumnFilters([{ id: "age", value: { type: "number", operator: ">=", value: "20" } }])
  assert.deepEqual(table.getRowModel().rows.map((row) => row.id), ["b", "c"])
  table.setPageSize(1)
  assert.equal(table.getRowModel().rows.length, 1)
  table.getRow("b").toggleSelected(true)
  assert.equal(table.getSelectedRowModel().rows[0].id, "b")
  table.getColumn("age").toggleVisibility(false)
  assert.deepEqual(table.getVisibleLeafColumns().map((column) => column.id), ["name"])
})
test("logical pinning and row sections", () => {
  table.setColumnFilters([]); table.setPageSize(10)
  table.getColumn("name").pin("start")
  assert.equal(table.getColumn("name").getIsPinned(), "start")
  table.getRow("b").pin("top")
  assert.deepEqual(table.getTopRows().map((row) => row.id), ["b"])
  assert.equal(table.getCenterRows().some((row) => row.id === "b"), false)
})
test("manual processing preserves server rows", () => {
  table.setOptions((options) => ({ ...options, manualFiltering: true, manualPagination: true, manualSorting: true }))
  table.setColumnFilters([{ id: "age", value: { type: "number", operator: ">", value: "999" } }])
  assert.equal(table.getRowModel().rows.length, 3)
})
console.log(`${count}/${count} Data Grid model/contract tests passed; ${temp}`)
