// Render the real Free component; no source extraction or mocked picker context.
// Run: node --test scripts/check-time-picker.mjs
import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { createRequire } from "node:module"

const repo = path.resolve(import.meta.dirname, "..")
const www = path.join(repo, "apps/www")
const require = createRequire(path.join(www, "package.json"))
const cliRequire = createRequire(path.join(repo, "packages/cli/package.json"))
const { build } = createRequire(cliRequire.resolve("tsup"))("esbuild")
const React = require("react")
const { renderToStaticMarkup } = require("react-dom/server")
const dir = await fs.mkdtemp(path.join(os.tmpdir(), "baseui-time-picker-tests-"))
await fs.symlink(path.join(www, "node_modules"), path.join(dir, "node_modules"))
await build({
  entryPoints: [process.env.TIME_PICKER_SOURCE ?? path.join(www, "components/ui/time-picker.tsx")],
  outfile: path.join(dir, "picker.cjs"),
  bundle: true,
  platform: "node",
  packages: "external",
  format: "cjs",
  jsx: "automatic",
  alias: { "@": www },
  loader: { ".css": "empty" },
})
const { TimePicker } = require(path.join(dir, "picker.cjs"))
test.after(() => fs.rm(dir, { recursive: true, force: true }))

function columns(props) {
  const html = renderToStaticMarkup(
    React.createElement(TimePicker, {
      value: "09:30",
      format: "24h",
      pickerMode: "list",
      actions: { showOk: false },
      ...props,
    })
  )
  return [...html.matchAll(/role="listbox" aria-label="([^"]+)">([\s\S]*?)<\/div>/g)].map(
    ([, label, content]) => ({
      label,
      options: [...content.matchAll(/<button ([^>]+)>(\d+)<\/button>/g)].map(([, attrs, text]) => ({
        value: Number(text),
        selected: attrs.includes('aria-selected="true"'),
        disabled: attrs.includes('disabled=""'),
        tabIndex: Number(attrs.match(/tabindex="(-?\d+)"/)[1]),
      })),
    })
  )
}

function entry(column, expected) {
  assert.deepEqual(
    column.options.filter((option) => option.tabIndex === 0).map((option) => option.value),
    expected === undefined ? [] : [expected]
  )
  assert.ok(column.options.filter((option) => option.disabled).every((o) => o.tabIndex === -1))
}

for (const format of ["12h", "24h"]) {
  test(`${format}: enabled selection remains the entry`, () => {
    const [hour, minute] = columns({ format })
    entry(hour, 9)
    entry(minute, 30)
  })
  test(`${format}: exact disabled controlled selection uses first enabled hour`, () => {
    const [hour, minute] = columns({ format, minTime: "10:00" })
    entry(hour, 10)
    entry(minute, undefined) // The current 09 hour has no available minutes.
    assert.ok(hour.options.find((o) => o.value === 9).selected)
    assert.ok(minute.options.find((o) => o.value === 30).selected)
  })
  test(`${format}: current hour constrains minute entry`, () => {
    const [hour, minute] = columns({ format, value: "10:15", minTime: "10:30", maxTime: "10:45" })
    entry(hour, 10)
    entry(minute, 30)
    assert.ok(minute.options.find((o) => o.value === 15).disabled)
  })
}

test("all options disabled never invents an entry", () => {
  columns({ disabledTimes: () => true }).forEach((column) => entry(column, undefined))
})
test("disabled picker has no list entry", () => {
  columns({ disabled: true }).forEach((column) => entry(column, undefined))
})
test("fallback rendering never calls onValueChange for an unavailable controlled value", () => {
  const changes = []
  columns({ minTime: "10:00", onValueChange: (value) => changes.push(value) })
  assert.deepEqual(changes, [])
})
test("external minute absent from step options uses first enabled option", () => {
  const [, minute] = columns({ value: "10:07", minuteStep: 15, minTime: "10:10" })
  entry(minute, 15)
  assert.ok(minute.options.every((o) => !o.selected))
})
test("seconds use an enabled fallback under min/max constraints", () => {
  const [hour, minute, second] = columns({
    value: "10:30:10",
    showSeconds: true,
    secondStep: 5,
    minTime: "10:30:20",
    maxTime: "10:30:40",
  })
  entry(hour, 10)
  entry(minute, 30)
  entry(second, 20)
})
test("disabledTimes predicate skips the selected hour and intervening disabled hours", () => {
  const [hour] = columns({ disabledTimes: (value) => Number(value.slice(0, 2)) < 11 })
  entry(hour, 11)
})
test("disabledTimes range constrains minutes without changing selection", () => {
  const [, minute] = columns({ value: "10:30", disabledTimes: { from: "10:00", to: "10:35" } })
  entry(minute, 36)
  assert.ok(minute.options.find((o) => o.value === 30).selected)
})
test("disabledTimes exact matcher uses first enabled minute", () => {
  const [, minute] = columns({ disabledTimes: "09:30" })
  entry(minute, 0)
})
test("24h clock retains its existing selection and geometry contract", () => {
  const html = renderToStaticMarkup(
    React.createElement(TimePicker, {
      value: "09:30",
      format: "24h",
      pickerMode: "clock",
    })
  )
  assert.match(html, /data-mode="clock"/)
  assert.equal((html.match(/class="tp-clock_option"/g) ?? []).length, 24)
  assert.match(html, /aria-selected="true"[^>]*tabindex="0"[^>]*>09<\/button>/)
})
