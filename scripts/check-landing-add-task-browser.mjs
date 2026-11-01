// Production-build QA for the landing demo's canonical Add task Dialog.
// --before captures the pre-fix composition without applying spacing assertions.
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { pathToFileURL } from "node:url"
const modulePath = process.env.PLAYWRIGHT_MODULE
const { chromium } = await import(
  modulePath?.startsWith("/") ? pathToFileURL(modulePath).href : (modulePath ?? "playwright")
)
const origin = process.env.LANDING_ORIGIN ?? "http://127.0.0.1:3142"
assert.ok(["localhost", "127.0.0.1"].includes(new URL(origin).hostname))
const evidence =
  process.env.ADD_TASK_EVIDENCE ?? (await fs.mkdtemp(path.join(os.tmpdir(), "landing-add-task-")))
await fs.mkdir(evidence, { recursive: true })
const before = process.argv.includes("--before")
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
})
const results = [],
  errors = []
let passed = false
function check(name, detail = {}) {
  results.push({ name, ...detail })
  console.log("PASS", name)
}
async function measure(dialog) {
  return dialog.evaluate((e) => {
    const rect = (x) => {
      const r = x.getBoundingClientRect()
      return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom }
    }
    const style = getComputedStyle(e),
      input = e.querySelector("#release-new-task"),
      footer = e.querySelector('[data-slot="dialog-footer"]')
    const control = input.parentElement
    const controlStyle = getComputedStyle(control)
    const ring = parseFloat(controlStyle.outlineWidth) + parseFloat(controlStyle.outlineOffset)
    const cr = control.getBoundingClientRect()
    const focusClips = []
    for (let ancestor = control.parentElement; ancestor; ancestor = ancestor.parentElement) {
      const style = getComputedStyle(ancestor),
        ar = ancestor.getBoundingClientRect()
      if (
        ring > 0 &&
        /auto|scroll|hidden|clip/.test(style.overflowX) &&
        (cr.x - ring < ar.x || cr.right + ring > ar.right)
      )
        focusClips.push(ancestor.dataset.slot || ancestor.tagName)
      if (
        ring > 0 &&
        /auto|scroll|hidden|clip/.test(style.overflowY) &&
        (cr.y - ring < ar.y || cr.bottom + ring > ar.bottom)
      )
        focusClips.push(ancestor.dataset.slot || ancestor.tagName)
    }
    const title = e.querySelector('[data-slot="dialog-title"]'),
      description = e.querySelector('[data-slot="dialog-description"]')
    const buttonRects = [...footer.querySelectorAll("button")].map(rect)
    const actions = {
      x: Math.min(...buttonRects.map((r) => r.x)),
      y: Math.min(...buttonRects.map((r) => r.y)),
      right: Math.max(...buttonRects.map((r) => r.right)),
      bottom: Math.max(...buttonRects.map((r) => r.bottom)),
    }
    actions.width = actions.right - actions.x
    actions.height = actions.bottom - actions.y
    return {
      focusClips,
      dialog: rect(e),
      title: rect(title),
      description: rect(description),
      label: rect(e.querySelector('label[for="release-new-task"]')),
      input: rect(input),
      control: rect(input.parentElement),
      footer: rect(footer),
      actions,
      close: rect(e.querySelector(".modal-close-layout")),
      inputToActions: actions.y - input.getBoundingClientRect().bottom,
      footerToBottom: e.getBoundingClientRect().bottom - actions.bottom,
      tokens: {
        gap: parseFloat(style.gap),
        paddingTop: parseFloat(style.paddingTop),
        paddingBottom: parseFloat(style.paddingBottom),
        borderBottom: parseFloat(style.borderBottomWidth),
      },
      tag: e.tagName,
      directSlots: [...e.children].map((x) => x.dataset.slot || x.tagName),
      documentOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    }
  })
}
try {
  for (const [w, h] of [
    [1440, 900],
    [1024, 768],
    [768, 1024],
    [430, 932],
    [390, 844],
    [320, 740],
    [844, 390],
  ])
    for (const theme of ["light", "dark"]) {
      const coarse = w < 768 || h < 500
      const context = await browser.newContext({
        viewport: { width: w, height: h },
        hasTouch: coarse,
        isMobile: coarse,
        colorScheme: theme,
        reducedMotion: coarse ? "reduce" : "no-preference",
      })
      await context.addInitScript((t) => localStorage.setItem("querycanvas-theme", t), theme)
      const page = await context.newPage()
      page.on("pageerror", (e) => errors.push(e.message))
      await page.goto(origin, { waitUntil: "networkidle" })
      assert.equal(
        await page.locator("html").evaluate((e) => e.classList.contains("dark")),
        theme === "dark"
      )
      const trigger = page.getByRole("button", { name: "New task", exact: true })
      await trigger.click()
      const dialog = page.getByRole("dialog", { name: "Add a task", exact: true })
      await dialog.waitFor()
      await page.waitForTimeout(250)
      const g = await measure(dialog)
      await page.screenshot({ path: path.join(evidence, `${w}x${h}-${theme}.png`) })
      check(`${w}x${h} ${theme}: measured composition`, g)
      if (!before) {
        assert.equal(g.documentOverflow, false)
        assert.deepEqual(g.focusClips, [], "Input focus outline remains unclipped")
        assert.ok(
          g.dialog.x >= 0 && g.dialog.y >= 0 && g.dialog.right <= w + 1 && g.dialog.bottom <= h + 1
        )
        for (const rect of [g.title, g.description, g.label, g.control, g.actions, g.close])
          assert.ok(
            rect.x >= g.dialog.x &&
              rect.right <= g.dialog.right &&
              rect.y >= g.dialog.y &&
              rect.bottom <= g.dialog.bottom
          )
        assert.ok(
          g.inputToActions >= g.tokens.gap - 1,
          "Deliberate canonical V2 gap between input and actions"
        )
        assert.ok(
          Math.abs(g.footerToBottom - g.tokens.paddingBottom - g.tokens.borderBottom) < 1,
          "Only canonical footer padding below actions"
        )
        assert.equal(g.tag, "FORM", "The canonical popup itself is the form")
        assert.deepEqual(g.directSlots.slice(0, 3), [
          "dialog-header",
          "dialog-body",
          "dialog-footer",
        ])
        // Height is the sum of rendered content, canonical gaps, padding and borders.
        const natural = await dialog.evaluate((e) => {
          const s = getComputedStyle(e)
          return (
            [...e.children]
              .filter((x) => getComputedStyle(x).position !== "absolute")
              .reduce((n, x) => n + x.getBoundingClientRect().height, 0) +
            2 * parseFloat(s.gap) +
            parseFloat(s.paddingTop) +
            parseFloat(s.paddingBottom) +
            parseFloat(s.borderTopWidth) +
            parseFloat(s.borderBottomWidth)
          )
        })
        assert.ok(Math.abs(g.dialog.height - natural) < 1, "No unused growing/fixed-height region")
        const input = dialog.getByRole("textbox", { name: "Task name", exact: true }),
          add = dialog.getByRole("button", { name: "Add task", exact: true })
        assert.equal(await add.isDisabled(), true)
        await input.fill("   ")
        assert.equal(await add.isDisabled(), true)
        await input.fill("QA task")
        assert.equal(await add.isEnabled(), true)
        for (const key of ["Tab", "Shift+Tab"])
          for (let i = 0; i < 12; i++) {
            await page.keyboard.press(key)
            await page.waitForTimeout(20)
            assert.equal(await dialog.evaluate((e) => e.contains(document.activeElement)), true)
          }
        await page.keyboard.press("Escape")
        await dialog.waitFor({ state: "hidden" })
        assert.equal(await trigger.evaluate((e) => e === document.activeElement), true)
        await trigger.click()
        await dialog.getByRole("button", { name: "Cancel", exact: true }).click()
        await dialog.waitFor({ state: "hidden" })
        assert.equal(await trigger.evaluate((e) => e === document.activeElement), true)
        await trigger.click()
        await dialog.getByRole("button", { name: "Close", exact: true }).click()
        await dialog.waitFor({ state: "hidden" })
        assert.equal(await trigger.evaluate((e) => e === document.activeElement), true)
        assert.equal(await page.getByRole("button", { name: "QA task", exact: true }).count(), 0)
        for (const method of ["enter", "button"]) {
          await trigger.click()
          const title = `QA ${w} ${h} ${theme} ${method}`
          await input.fill(`  ${title}  `)
          if (method === "enter") await input.press("Enter")
          else await add.click()
          await dialog.waitFor({ state: "hidden" })
          assert.equal(await trigger.evaluate((e) => e === document.activeElement), true)
          assert.equal(await page.getByRole("button", { name: title, exact: true }).count(), 1)
          await trigger.click()
          assert.equal(await input.inputValue(), "")
          assert.equal(await add.isDisabled(), true)
          await page.keyboard.press("Escape")
          await dialog.waitFor({ state: "hidden" })
        }
        if (coarse) {
          assert.equal(await page.evaluate(() => matchMedia("(pointer: coarse)").matches), true)
          assert.equal(
            await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches),
            true
          )
        }
        check(
          `${w}x${h} ${theme}: spacing, containment, natural height, 24 keyboard moves, dismissal/focus, disabled/valid states, Enter/button submission, trim/reset`
        )
      }
      await context.close()
    }
  assert.deepEqual(errors, [])
  check("zero runtime page errors")
  passed = true
} finally {
  await fs.writeFile(
    path.join(evidence, "results.json"),
    JSON.stringify({ passed, before, checks: results.length, results, errors }, null, 2) + "\n"
  )
  await browser.close()
}
