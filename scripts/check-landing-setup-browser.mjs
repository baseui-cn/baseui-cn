// Run against `next build && next start`, never a mocked component fixture.
// LANDING_ORIGIN defaults to loopback; PLAYWRIGHT_MODULE and CHROME_PATH can
// reuse existing browser installations without changing project dependencies.
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import os from "node:os"
import { pathToFileURL } from "node:url"
const modulePath = process.env.PLAYWRIGHT_MODULE
const { chromium } = await import(
  modulePath?.startsWith("/") ? pathToFileURL(modulePath).href : (modulePath ?? "playwright")
)
const origin = process.env.LANDING_ORIGIN ?? "http://127.0.0.1:3142"
assert.ok(["localhost", "127.0.0.1"].includes(new URL(origin).hostname), "Local QA only")
const evidence =
  process.env.LANDING_EVIDENCE ?? (await fs.mkdtemp(path.join(os.tmpdir(), "landing-setup-")))
await fs.mkdir(evidence, { recursive: true })
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
async function geometry(page) {
  return page.evaluate(() => {
    const rect = (e) => {
      const r = e.getBoundingClientRect()
      return {
        x: r.x,
        y: r.y,
        right: r.right,
        bottom: r.bottom,
        width: r.width,
        height: r.height,
        clientWidth: e.clientWidth,
        scrollWidth: e.scrollWidth,
        clientHeight: e.clientHeight,
        scrollHeight: e.scrollHeight,
      }
    }
    const drawer = document.querySelector(".project-setup-drawer")
    return {
      viewport: {
        top: visualViewport.offsetTop,
        height: visualViewport.height,
        width: visualViewport.width,
      },
      documentOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      drawer: rect(drawer),
      scroll: rect(drawer.querySelector(".setup-scroll")),
      actions: rect(drawer.querySelector(".setup-output-actions")),
      buttons: [...drawer.querySelectorAll(".setup-output-actions button")].map(rect),
      overflowing: [
        ...drawer.querySelectorAll("input,button,fieldset,pre,.setup-choices,.setup-theme-preview"),
      ]
        .filter((e) => {
          const r = e.getBoundingClientRect(),
            d = drawer.getBoundingClientRect()
          return (
            r.width > 1 &&
            r.height > 1 &&
            (r.x < d.x - 1 ||
              r.right > d.right + 1 ||
              (e.tagName !== "INPUT" && e.scrollWidth > e.clientWidth + 1))
          )
        })
        .map((e) => ({
          label: e.getAttribute("aria-label") || e.textContent.slice(0, 50),
          ...rect(e),
        })),
      scrollers: [
        drawer,
        drawer.querySelector(".setup-builder"),
        drawer.querySelector(".setup-scroll"),
        drawer.querySelector(".setup-body"),
        drawer.querySelector(".setup-output"),
      ].filter(
        (e) => /auto|scroll/.test(getComputedStyle(e).overflowY) && e.scrollHeight > e.clientHeight
      ).length,
    }
  })
}
async function contained(page) {
  const g = await geometry(page)
  assert.equal(g.documentOverflow, false)
  assert.ok(g.drawer.y >= g.viewport.top - 1)
  assert.ok(g.drawer.bottom <= g.viewport.top + g.viewport.height + 1)
  assert.ok(g.scroll.height >= 80, "Usable content height")
  assert.ok(g.scroll.bottom <= g.actions.y + 1, "Content ends above footer")
  assert.ok(g.actions.bottom <= g.drawer.bottom + 1)
  assert.ok(g.buttons.every((b) => b.y >= g.actions.y && b.bottom <= g.drawer.bottom))
  assert.deepEqual(g.overflowing, [])
  assert.equal(g.scrollers, 1, "Exactly one content scrollbar")
  return g
}
async function open(page, trigger) {
  await trigger.click()
  await page.locator(".project-setup-drawer").waitFor()
  await page.waitForTimeout(250)
}
try {
  const sizes = [
    [1440, 900],
    [1024, 768],
    [768, 1024],
    [430, 932],
    [390, 844],
    [320, 740],
    [844, 390],
  ]
  for (const [w, h] of sizes)
    for (const theme of ["light", "dark"]) {
      const coarse = w < 768 || h < 500
      const context = await browser.newContext({
        viewport: { width: w, height: h },
        hasTouch: coarse,
        isMobile: coarse,
        colorScheme: theme,
        permissions: ["clipboard-read", "clipboard-write"],
      })
      await context.addInitScript((t) => localStorage.setItem("querycanvas-theme", t), theme)
      const page = await context.newPage()
      page.on("pageerror", (e) => errors.push(e.message))
      await page.goto(origin, { waitUntil: "networkidle" })
      assert.equal(
        await page.locator("html").evaluate((e) => e.classList.contains("dark")),
        theme === "dark"
      )
      const trigger = page.getByRole("button", { name: "Create your project" }).first()
      await open(page, trigger)
      const drawer = page.locator(".project-setup-drawer"),
        scroll = drawer.locator(".setup-scroll")
      const g = await contained(page)
      for (const position of ["top", "middle", "bottom"]) {
        await scroll.evaluate(
          (e, p) =>
            (e.scrollTop =
              p === "top"
                ? 0
                : p === "middle"
                  ? (e.scrollHeight - e.clientHeight) / 2
                  : e.scrollHeight),
          position
        )
        assert.equal((await contained(page)).actions.y, g.actions.y)
        await page.screenshot({ path: path.join(evidence, `${w}x${h}-${theme}-${position}.png`) })
      }
      check(`${w}x${h} ${theme}: geometry, one scrollbar, fixed actions, top/middle/bottom`, g)
      const select = drawer.getByRole("combobox")
      await select.click()
      const popup = page.getByRole("listbox")
      await popup.waitFor()
      const box = await popup.boundingBox()
      assert.ok(
        box.x >= -1 && box.y >= -1 && box.x + box.width <= w + 1 && box.y + box.height <= h + 1
      )
      await page.keyboard.press("Escape")
      await popup.waitFor({ state: "hidden" })
      assert.equal(await drawer.isVisible(), true)
      assert.equal(await select.evaluate((e) => e === document.activeElement), true)
      check(`${w}x${h} ${theme}: Select popup contained; first Escape dismisses only Select`)
      const command = await drawer
        .getByRole("region", { name: "Setup command", exact: true })
        .innerText()
      await drawer.getByRole("button", { name: "Copy command", exact: true }).click()
      assert.equal(await page.evaluate(() => navigator.clipboard.readText()), command)
      check(`${w}x${h} ${theme}: exact command copy`)
      for (const key of ["Tab", "Shift+Tab"])
        for (let i = 0; i < 36; i++) {
          await page.keyboard.press(key)
          await page.waitForTimeout(20)
          assert.equal(
            await drawer.evaluate((e) => e.contains(document.activeElement)),
            true,
            `${key} focus containment: ${await page.locator(":focus").evaluate((e) => e.outerHTML)}`
          )
        }
      const y = await page.evaluate(() => scrollY)
      await page.mouse.move(5, h / 2)
      await page.mouse.wheel(0, 700)
      await page.waitForTimeout(80)
      assert.equal(await page.evaluate(() => scrollY), y)
      check(`${w}x${h} ${theme}: 72 trapped Tab/Shift+Tab moves and body scroll lock`)
      await page.keyboard.press("Escape")
      await drawer.waitFor({ state: "hidden" })
      assert.equal(await trigger.evaluate((e) => e === document.activeElement), true)
      await open(page, trigger)
      await drawer.getByRole("button", { name: "Close project setup", exact: true }).click()
      await drawer.waitFor({ state: "hidden" })
      assert.equal(await trigger.evaluate((e) => e === document.activeElement), true)
      check(`${w}x${h} ${theme}: Escape, close button and trigger focus return`)
      await context.close()
    }
  // Full onboarding controls, long commands, responsive resize and viewport changes.
  for (const theme of ["light", "dark"]) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
      reducedMotion: "reduce",
      permissions: ["clipboard-read", "clipboard-write"],
    })
    await context.addInitScript((t) => localStorage.setItem("querycanvas-theme", t), theme)
    const page = await context.newPage()
    page.on("pageerror", (e) => errors.push(e.message))
    await page.goto(origin, { waitUntil: "networkidle" })
    const triggers = page.getByRole("button", { name: "Create your project" }),
      trigger = triggers.last()
    await open(page, trigger)
    const drawer = page.locator(".project-setup-drawer"),
      scroll = drawer.locator(".setup-scroll")
    for (const [framework, label] of [
      ["next", "Next.js"],
      ["tanstack-start", "TanStack Start"],
      ["react-router", "React Router"],
      ["vite", "Vite"],
      ["react", "Existing React"],
    ]) {
      await drawer.getByRole("combobox").click()
      await page.getByRole("option", { name: label, exact: true }).click()
      for (const pm of ["npm", "pnpm", "yarn", "bun"]) {
        await drawer.getByRole("button", { name: pm, exact: true }).click()
        const command = await drawer
          .getByRole("region", { name: "Setup command", exact: true })
          .innerText()
        assert.ok(
          command.startsWith(
            { npm: "npx", pnpm: "pnpm dlx", yarn: "yarn dlx", bun: "bunx" }[pm] +
              " baseui-cn@latest"
          )
        )
        assert.ok(command.includes(framework === "react" ? " init" : `--framework ${framework}`))
      }
    }
    check(`${theme}: all five frameworks and four package managers`)
    for (const color of ["Iris", "Blue", "Violet", "Emerald", "Orange", "Rose", "Neutral"]) {
      await drawer.getByRole("button", { name: `${color} theme`, exact: true }).click()
      assert.equal(
        await drawer
          .getByRole("button", { name: `${color} theme`, exact: true })
          .getAttribute("aria-pressed"),
        "true"
      )
    }
    for (const radius of ["Sharp", "Medium", "Rounded", "Extra"]) {
      await drawer.getByRole("button", { name: radius, exact: true }).click()
      assert.equal(
        await drawer
          .getByRole("button", { name: radius, exact: true })
          .getAttribute("aria-pressed"),
        "true"
      )
    }
    await drawer.getByRole("button", { name: /Preview (light|dark) theme/ }).click()
    await drawer.getByRole("button", { name: "Copy theme CSS", exact: true }).click()
    assert.match(
      await page.evaluate(() => navigator.clipboard.readText()),
      /:root \{[\s\S]*\.dark \{/
    )
    check(`${theme}: seven colors, four radii, preview mode and exact CSS copy`)
    await drawer.getByRole("button", { name: "Monorepo", exact: true }).click()
    await drawer.locator("#setup-workspace").fill("apps/" + "long-workspace-".repeat(35))
    const summary = drawer.locator(".setup-follow-up summary")
    await summary.click()
    assert.equal(await drawer.locator("details").evaluate((e) => e.open), true)
    await summary.focus()
    await page.keyboard.press("Enter")
    assert.equal(await drawer.locator("details").evaluate((e) => e.open), false)
    await page.keyboard.press("Enter")
    assert.equal(await drawer.locator("details").evaluate((e) => e.open), true)
    for (const [width, height] of [
      [320, 740],
      [844, 390],
      [1440, 900],
      [768, 1024],
      [390, 844],
      [320, 390],
    ]) {
      await page.setViewportSize({ width, height })
      await page.waitForTimeout(80)
      const g = await contained(page)
      await scroll.evaluate((e) => (e.scrollTop = e.scrollHeight))
      const followUp = await drawer.locator(".setup-follow-up > div").boundingBox()
      assert.ok(followUp.y + followUp.height <= g.actions.y + 1)
      await page.screenshot({
        path: path.join(evidence, `${width}x${height}-${theme}-long-workspace.png`),
      })
      check(`${theme}: long workspace + expanded follow-up survives resize ${width}x${height}`, g)
    }
    // Synthetic visual-viewport resize/pan verifies the page-local subscription.
    // This is not a claim of physical keyboard or browser chrome coverage.
    await page.evaluate(() => {
      Object.defineProperty(visualViewport, "height", { configurable: true, value: 300 })
      Object.defineProperty(visualViewport, "offsetTop", { configurable: true, value: 40 })
      visualViewport.dispatchEvent(new Event("resize"))
      visualViewport.dispatchEvent(new Event("scroll"))
    })
    await contained(page)
    await page.evaluate(() => {
      delete visualViewport.height
      delete visualViewport.offsetTop
      visualViewport.dispatchEvent(new Event("resize"))
    })
    check(
      `${theme}: synthetic visual viewport 300px high, panned 40px; coarse pointer and reduced motion`
    )
    await drawer.getByRole("combobox").click()
    await page.getByRole("option", { name: "Next.js", exact: true }).click()
    await drawer.getByRole("button", { name: "New project", exact: true }).click()
    await drawer.locator("#setup-project").fill("a".repeat(100))
    for (const [width, height] of [
      [320, 740],
      [844, 390],
    ]) {
      await page.setViewportSize({ width, height })
      await page.waitForTimeout(80)
      await contained(page)
    }
    await drawer.locator("#setup-project").fill("Bad Project!")
    assert.equal(await drawer.getByRole("button", { name: "Copy command", exact: true }).count(), 0)
    assert.equal(await drawer.locator("#setup-project").getAttribute("aria-invalid"), "true")
    await contained(page)
    await drawer.getByRole("button", { name: "Existing project", exact: true }).click()
    check(`${theme}: maximum valid project name and invalid-name copy suppression`)
    assert.equal(await page.evaluate(() => matchMedia("(pointer: coarse)").matches), true)
    assert.equal(
      await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches),
      true
    )
    await drawer.getByRole("button", { name: "Done", exact: true }).click()
    await drawer.waitFor({ state: "hidden" })
    assert.equal(await trigger.evaluate((e) => e === document.activeElement), true)
    // Closing and reopening preserves the local draft.
    await open(page, trigger)
    assert.equal(
      await drawer.locator("#setup-workspace").inputValue(),
      "apps/" + "long-workspace-".repeat(35)
    )
    await page.keyboard.press("Escape")
    await drawer.waitFor({ state: "hidden" })
    assert.equal(await trigger.evaluate((e) => e === document.activeElement), true)
    const y = await page.evaluate(() => scrollY)
    await page.mouse.wheel(0, -400)
    await page.waitForTimeout(100)
    assert.notEqual(await page.evaluate(() => scrollY), y, "Body scrolling restored")
    check(`${theme}: Done, final CTA focus return, draft preservation and body scrolling restored`)
    await context.close()
  }
  assert.deepEqual(errors, [])
  check("zero runtime page errors")
  passed = true
} finally {
  await fs.writeFile(
    path.join(evidence, "results.json"),
    JSON.stringify({ passed, checks: results.length, results, errors }, null, 2) + "\n"
  )
  await browser.close()
}
