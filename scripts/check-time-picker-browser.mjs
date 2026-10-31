// Real-component browser regression fixture, served only on loopback.
// PLAYWRIGHT_MODULE may point to an existing playwright-core installation.
// CHROME_PATH may select an installed Chromium executable. No installs required.
// --compare-head also reproduces the bug and compares geometry/focus boundaries
// against HEAD; use it only while HEAD is the pre-fix implementation.
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import os from "node:os"
import http from "node:http"
import { execFileSync } from "node:child_process"
import { createRequire } from "node:module"
import { pathToFileURL } from "node:url"

const repo = path.resolve(import.meta.dirname, "..")
const www = path.join(repo, "apps/www")
const require = createRequire(path.join(www, "package.json"))
const cliRequire = createRequire(path.join(repo, "packages/cli/package.json"))
const { build } = createRequire(cliRequire.resolve("tsup"))("esbuild")
const postcss = createRequire(require.resolve("@tailwindcss/postcss"))("postcss")
const tailwind = require("@tailwindcss/postcss")
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright-core")
const evidence =
  process.env.TIME_PICKER_EVIDENCE ??
  (await fs.mkdtemp(path.join(os.tmpdir(), "baseui-time-picker-browser-")))
await fs.mkdir(evidence, { recursive: true })
const baseline = process.argv.includes("--compare-head")
  ? execFileSync("git", ["show", "HEAD:apps/www/components/ui/time-picker.tsx"], {
      cwd: repo,
      encoding: "utf8",
    })
  : null
for (const version of baseline ? ["before", "after"] : ["after"]) {
  const dir = path.join(evidence, version)
  await fs.mkdir(dir, { recursive: true })
  await build({
    entryPoints: [path.join(repo, "scripts/fixtures/time-picker-keyboard.tsx")],
    outfile: path.join(dir, "fixture.js"),
    bundle: true,
    platform: "browser",
    jsx: "automatic",
    alias: { "@": www },
    nodePaths: [path.join(www, "node_modules")],
    conditions: ["style", "browser", "import", "default"],
    define: { "process.env.NODE_ENV": '"development"' },
    plugins:
      version === "before"
        ? [
            {
              name: "baseline",
              setup(builder) {
                builder.onLoad({ filter: /\/components\/ui\/time-picker\.tsx$/ }, () => ({
                  contents: baseline,
                  loader: "tsx",
                  resolveDir: path.join(www, "components/ui"),
                }))
              },
            },
          ]
        : [],
  })
  const css = await postcss([tailwind({ base: www })]).process(
    await fs.readFile(path.join(dir, "fixture.css"), "utf8"),
    { from: path.join(www, "styles/globals.css") }
  )
  await fs.writeFile(path.join(dir, "fixture.css"), css.css)
}
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost")
    const version = url.pathname.startsWith("/before/") ? "before" : "after"
    const file = path.basename(url.pathname)
    if (file === "fixture.js" || file === "fixture.css") {
      res.setHeader("Content-Type", file.endsWith("js") ? "text/javascript" : "text/css")
      res.end(await fs.readFile(path.join(evidence, version, file)))
    } else {
      res.setHeader("Content-Type", "text/html")
      res.end(
        `<html><head><link rel="stylesheet" href="/${version}/fixture.css"></head><body><div id="root"></div><script src="/${version}/fixture.js"></script></body></html>`
      )
    }
  } catch (error) {
    res.statusCode = 500
    res.end(String(error))
  }
})
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve))
const origin = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
})
const page = await browser.newPage({ viewport: { width: 1100, height: 850 } })
const results = [],
  errors = []
page.on("pageerror", (error) => errors.push(error.message))
const check = (name, detail = {}) => {
  results.push({ name, pass: true, ...detail })
  console.log("PASS", name)
}
const hour = () => page.getByRole("listbox", { name: "Select hour", exact: true })
const minute = () => page.getByRole("listbox", { name: "Select minute", exact: true })
const option = (column, value) => column.getByRole("option", { name: value, exact: true })
const focusedText = () => page.evaluate(() => document.activeElement?.textContent)
const changes = async () => JSON.parse(await page.locator("#changes").textContent())
async function load({
  version = "after",
  surface = "static",
  theme = "light",
  format = "24h",
  scenario = "disabled-selection",
} = {}) {
  await page.goto(
    `${origin}/${version}/?${new URLSearchParams({ surface, theme, format, case: scenario })}`
  )
  await page.locator("#before").waitFor()
  await page.keyboard.press("Tab")
  assert.equal(await page.locator("#before").evaluate((e) => e === document.activeElement), true)
  if (surface !== "static") {
    await page.keyboard.press("Tab")
    await page.keyboard.press("Enter")
    await page.locator(`.tp-shell[data-surface="${surface}"]`).waitFor()
    await page.waitForTimeout(250)
  }
}
async function tabToEntry(column, text) {
  for (let i = 0; i < 20; i++) {
    if (await column.locator('[role="option"]:focus').count()) break
    await page.keyboard.press("Tab")
  }
  assert.equal(await focusedText(), text)
  assert.equal(await column.locator('[role="option"]:focus').count(), 1)
  assert.equal(
    await column.locator('[role="option"]:focus').evaluate((e) => e.matches(":focus-visible")),
    true
  )
}
async function geometry() {
  return page
    .locator(".tp-shell, .tp-list, .tp-list_column, .tp-list_option")
    .evaluateAll((elements) =>
      elements.map((e) => {
        const { x, y, width, height } = e.getBoundingClientRect()
        const css = getComputedStyle(e)
        return {
          class: e.className,
          x,
          y,
          width,
          height,
          font: css.font,
          padding: css.padding,
          border: css.borderWidth,
        }
      })
    )
}
async function overlayBoundary(surface) {
  const shell = page.locator(`.tp-shell[data-surface="${surface}"]`)
  if (surface === "popover") {
    // Base UI 1.9 modal Popovers without Popover.Close intentionally tab out.
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press("Tab")
      if (
        !(await page.evaluate(() =>
          document.querySelector(".tp-shell")?.contains(document.activeElement)
        ))
      )
        break
    }
    await shell.waitFor({ state: "hidden" })
    assert.equal(await page.locator("#after").evaluate((e) => e === document.activeElement), true)
    await page.keyboard.press("Shift+Tab")
    await page.keyboard.press("Enter")
    await shell.waitFor()
  } else {
    for (const key of ["Tab", "Shift+Tab"])
      for (let i = 0; i < 14; i++) {
        await page.keyboard.press(key)
        // Base UI redirects focus from its sentinel on the next animation frame.
        await page.waitForFunction(
          () =>
            document
              .querySelector('[data-slot="dialog-content"]')
              ?.contains(document.activeElement),
          null,
          { timeout: 1500 }
        )
        assert.equal(
          await page
            .locator('[data-slot="dialog-content"]')
            .evaluate((e) => e.contains(document.activeElement)),
          true,
          await page.evaluate(() => document.activeElement?.outerHTML)
        )
      }
  }
  await page.keyboard.press("Escape")
  await shell.waitFor({ state: "hidden" })
  assert.equal(
    await page.locator(".tp-input_trigger").evaluate((e) => e === document.activeElement),
    true
  )
  await page.keyboard.press("Tab")
  assert.equal(await page.locator("#after").evaluate((e) => e === document.activeElement), true)
}
try {
  for (const surface of ["static", "popover", "dialog"]) {
    for (const theme of ["light", "dark"]) {
      for (const format of ["12h", "24h"]) {
        const config = { surface, theme, format }
        let beforeGeometry
        if (baseline) {
          await load({ ...config, version: "before" })
          beforeGeometry = await geometry()
          assert.equal(await hour().locator('[tabindex="0"]:disabled').count(), 1)
          assert.equal(await hour().locator('[tabindex="0"]:not(:disabled)').count(), 0)
          if (surface !== "static") await overlayBoundary(surface)
        }
        await load(config)
        if (baseline) {
          const afterGeometry = await geometry()
          await fs.writeFile(
            path.join(evidence, `${surface}-${theme}-${format}-geometry.json`),
            JSON.stringify({ before: beforeGeometry, after: afterGeometry }, null, 2) + "\n"
          )
          assert.deepEqual(afterGeometry, beforeGeometry)
        }
        await tabToEntry(hour(), "10")
        assert.deepEqual(await changes(), [])
        assert.equal(await page.locator("#external-value").textContent(), "09:30")
        assert.equal((await option(hour(), "09").count()) || (await option(hour(), "9").count()), 1)
        assert.equal(await minute().locator('[tabindex="0"]').count(), 0)
        const focusStyle = await hour()
          .locator(":focus")
          .evaluate((e) => ({
            outline: getComputedStyle(e).outline,
            visible: e.getBoundingClientRect().top >= 0,
          }))
        assert.ok(!focusStyle.outline.startsWith("0px"))
        await page.screenshot({
          path: path.join(evidence, `${surface}-${theme}-${format}-entry.png`),
        })
        await page.keyboard.press("ArrowDown")
        assert.equal(await focusedText(), "11")
        await page.keyboard.press("ArrowUp")
        assert.equal(await focusedText(), "10")
        await page.keyboard.press("ArrowRight")
        assert.equal(await focusedText(), "11")
        await page.keyboard.press("ArrowLeft")
        assert.equal(await focusedText(), "10")
        await page.keyboard.press("End")
        assert.equal(await focusedText(), format === "12h" ? "11" : "23")
        await page.keyboard.press("ArrowDown")
        assert.equal(await focusedText(), "10")
        await page.keyboard.press("Home")
        assert.equal(await focusedText(), "10")
        assert.deepEqual(await changes(), [])
        await page.keyboard.press("Enter")
        assert.deepEqual(await changes(), ["10:30"])
        assert.equal(await page.locator("#external-value").textContent(), "09:30")
        await page.keyboard.press("Space")
        assert.deepEqual(await changes(), ["10:30", "10:30"])
        if (surface === "static") {
          for (
            let i = 0;
            i < 12 && !(await page.locator("#after").evaluate((e) => e === document.activeElement));
            i++
          )
            await page.keyboard.press("Tab")
          assert.equal(
            await page.locator("#after").evaluate((e) => e === document.activeElement),
            true
          )
        } else {
          await overlayBoundary(surface)
        }
        check(
          `${surface}/${theme}/${format}: exact repro, entry, arrows, Home/End, Enter/Space, focus boundaries${baseline ? ", unchanged geometry" : ""}`,
          focusStyle
        )
      }
    }
  }
  for (const [scenario, columnName, entryText, lastText] of [
    ["enabled", "Select minute", "30", "59"],
    ["minute", "Select minute", "30", "45"],
    ["seconds", "Select second", "20", "40"],
    ["predicate", "Select hour", "11", "23"],
    ["range", "Select minute", "36", "59"],
  ]) {
    await load({ scenario })
    const column = page.getByRole("listbox", { name: columnName, exact: true })
    await tabToEntry(column, entryText)
    await page.keyboard.press("End")
    assert.equal(await focusedText(), lastText)
    await page.keyboard.press("Home")
    assert.equal(await focusedText(), scenario === "enabled" ? "00" : entryText)
    assert.deepEqual(await changes(), [])
    await page.keyboard.press("Enter")
    assert.equal((await changes()).length, 1)
    check(`${scenario}: keyboard entry, Home/End and explicit activation`)
  }
  await load({ scenario: "all" })
  assert.equal(await page.locator('[role="option"][tabindex="0"]').count(), 0)
  for (
    let i = 0;
    i < 12 && !(await page.locator("#after").evaluate((e) => e === document.activeElement));
    i++
  )
    await page.keyboard.press("Tab")
  assert.equal(await page.locator("#after").evaluate((e) => e === document.activeElement), true)
  assert.deepEqual(await changes(), [])
  check("all disabled: no invented entry and Tab leaves static picker")
  await load()
  await page.locator("#external").focus()
  await page.keyboard.press("Enter")
  assert.equal(await page.locator("#external-value").textContent(), "08:15")
  assert.deepEqual(await changes(), [])
  assert.equal(await hour().locator('[tabindex="0"]').textContent(), "10")
  check("controlled external invalid update: fallback recalculates without callback")
  await load({ scenario: "clock" })
  await tabToEntry(page.getByRole("listbox", { name: "Select hours", exact: true }), "09")
  await page.keyboard.press("ArrowRight")
  assert.equal(await focusedText(), "10")
  await page.keyboard.press("Enter")
  assert.deepEqual(await changes(), ["10:30"])
  check("Time clock regression: keyboard selection still works")
  await load({ scenario: "date" })
  await page.keyboard.press("Tab")
  await page.keyboard.press("Enter")
  await page.locator(".rdp-root").waitFor()
  await page.keyboard.press("Escape")
  await page.locator(".rdp-root").waitFor({ state: "hidden" })
  assert.equal(
    await page.locator(".rdp-input_trigger").evaluate((e) => e === document.activeElement),
    true
  )
  check("Date Picker regression: keyboard open/Escape/focus return")
  assert.deepEqual(errors, [])
  check("zero browser runtime errors")
} finally {
  await fs.writeFile(
    path.join(evidence, "results.json"),
    JSON.stringify({ results, errors }, null, 2) + "\n"
  )
  await browser.close()
  await new Promise((resolve) => server.close(resolve))
  console.log(`Evidence: ${pathToFileURL(evidence)}`)
}
