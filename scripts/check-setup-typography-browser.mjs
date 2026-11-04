import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import os from "node:os"
import { pathToFileURL } from "node:url"
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : "playwright"
)
const origin = process.env.LANDING_ORIGIN ?? "http://127.0.0.1:3147"
assert.ok(["localhost", "127.0.0.1"].includes(new URL(origin).hostname))
const evidence =
  process.env.TYPOGRAPHY_EVIDENCE ??
  (await fs.mkdtemp(path.join(os.tmpdir(), "baseui-typography-browser-")))
await fs.mkdir(evidence, { recursive: true })
const typography = JSON.parse(
  await fs.readFile(new URL("./typography-definition.json", import.meta.url), "utf8")
)
const theme = JSON.parse(
  await fs.readFile(new URL("../apps/www/lib/__generated__/theme.json", import.meta.url), "utf8")
)
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
})
let debugPage
const results = [],
  errors = []
try {
  for (const [width, height] of [
    [1440, 900],
    [320, 740],
  ])
    for (const mode of ["light", "dark"]) {
      const context = await browser.newContext({
        viewport: { width, height },
        permissions: ["clipboard-read", "clipboard-write"],
      })
      await context.addInitScript((value) => localStorage.setItem("querycanvas-theme", value), mode)
      const page = await context.newPage()
      debugPage = page
      page.on("pageerror", (e) => errors.push(e.message))
      await page.goto(origin, { waitUntil: "networkidle" })
      const trigger = page.getByRole("button", { name: "Create your project", exact: true }).first()
      await trigger.click()
      const drawer = page.locator(".project-setup-drawer")
      const command = () =>
        drawer.getByRole("region", { name: "Setup command", exact: true }).innerText()
      await drawer.getByRole("button", { name: "pnpm", exact: true }).click()
      await drawer.getByRole("button", { name: "Monorepo", exact: true }).click()
      await drawer.locator("#setup-project").fill("my-app-online")
      await drawer.getByRole("combobox", { name: "Framework", exact: true }).click()
      await page.getByRole("listbox").waitFor()
      assert.equal(
        await page.getByRole("option", { name: "Existing React", exact: true }).count(),
        0
      )
      await page.keyboard.press("Escape")
      await page.getByRole("listbox").waitFor({ state: "hidden" })
      assert.equal(await drawer.locator("#setup-workspace").count(), 0)
      assert.match(await command(), /baseui-cn@latest create my-app-online.*--monorepo/)
      assert.doesNotMatch(await command(), /init|--workspace/)
      for (const [dimension, ids, label] of [
        ["body", typography.bodyFonts, "Body font"],
        ["heading", typography.headingFonts, "Heading font"],
      ]) {
        for (let index = 0; index < ids.length; index++) {
          const id = ids[index]
          console.log("FONT", width, mode, dimension, id)
          const select = drawer.getByRole("combobox", { name: label, exact: true })
          await select.focus()
          await select.press("ArrowDown")
          await page.getByRole("listbox").waitFor()
          await page.waitForFunction(
            () => document.activeElement?.getAttribute("role") === "option"
          )
          const box = await page.getByRole("listbox").boundingBox()
          assert.ok(
            box.x >= -1 &&
              box.y >= -1 &&
              box.x + box.width <= width + 1 &&
              box.y + box.height <= height + 1
          )
          await page.keyboard.press("Home")
          await page.waitForFunction(
            (label) =>
              document.activeElement?.getAttribute("role") === "option" &&
              document.activeElement.textContent.trim() === label,
            typography.fonts[ids[0]].label
          )
          for (let step = 0; step < index; step++) {
            await page.keyboard.press("ArrowDown")
            await page.waitForFunction(
              (label) =>
                document.activeElement?.getAttribute("role") === "option" &&
                document.activeElement.textContent.trim() === label,
              typography.fonts[ids[step + 1]].label
            )
          }
          await page.keyboard.press("Enter")
          await page.getByRole("listbox").waitFor({ state: "hidden" })
          assert.equal(await select.evaluate((e) => e === document.activeElement), true)
          assert.ok((await command()).includes(`--${dimension}-font ${id}`))
          const sample = drawer.locator(
            dimension === "body" ? ".setup-preview-body" : ".setup-preview-title"
          )
          const family = typography.fonts[id].family
          assert.equal(
            await sample.evaluate(
              (e, key) => getComputedStyle(e).getPropertyValue(key).trim(),
              "--font-" + dimension
            ),
            family
          )
          if (id !== "system") {
            const actualFamily = family.split(",")[0]
            const loaded = await page.evaluate(
              async (family) => (await document.fonts.load(`600 20px ${family}`)).length,
              actualFamily
            )
            assert.ok(loaded > 0, `${id}: actual font faces load`)
          }
        }
      }
      const preview = drawer.locator(".setup-theme-preview")
      for (const [color, preset] of Object.entries(theme.presets.colors)) {
        await drawer.getByRole("button", { name: preset.label + " theme", exact: true }).click()
        for (const token of ["--primary", "--border", "--input", "--ring"])
          assert.equal(
            await preview.evaluate(
              (e, key) => getComputedStyle(e).getPropertyValue(key).trim(),
              token
            ),
            preset[mode][token]
          )
        assert.ok((await command()).includes("--color " + color))
      }
      for (const [radius, preset] of Object.entries(theme.presets.radii)) {
        await drawer.getByRole("button", { name: preset.label, exact: true }).click()
        assert.equal(
          await preview.evaluate((e) => getComputedStyle(e).getPropertyValue("--radius").trim()),
          preset.value
        )
        assert.ok((await command()).includes("--radius " + radius))
      }
      // Same persisted preview is used by command and actual rendered samples.
      for (const [label, option] of [
        ["Body font", "Inter"],
        ["Heading font", "Space Grotesk"],
      ]) {
        await drawer.getByRole("combobox", { name: label, exact: true }).click()
        await page.getByRole("option", { name: option, exact: true }).click()
      }
      await drawer.getByRole("button", { name: "Iris theme", exact: true }).click()
      await drawer.getByRole("button", { name: "Rounded", exact: true }).click()
      const expected =
        "pnpm dlx baseui-cn@latest create my-app-online --framework next --package-manager pnpm --monorepo --color iris --radius lg --body-font inter --heading-font space-grotesk"
      assert.equal(await command(), expected)
      await drawer.getByRole("button", { name: "Copy command", exact: true }).click()
      assert.equal(await page.evaluate(() => navigator.clipboard.readText()), expected)
      await preview.scrollIntoViewIfNeeded()
      await page.screenshot({ path: path.join(evidence, `${width}-${mode}-appearance.png`) })
      await drawer.getByRole("button", { name: "Copy theme CSS", exact: true }).click()
      const copiedCss = await page.evaluate(() => navigator.clipboard.readText())
      for (const entry of [
        ...typography.fonts.inter.imports,
        ...typography.fonts["space-grotesk"].imports,
      ])
        assert.equal(copiedCss.split(`@import "${entry}";`).length - 1, 1)
      assert.ok(copiedCss.includes("h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading); }"))
      assert.ok(copiedCss.includes("--font-body:"))
      await drawer.getByRole("button", { name: "Existing project", exact: true }).click()
      assert.equal(await command(), "pnpm dlx baseui-cn@latest init")
      assert.equal(
        await drawer
          .getByRole("heading", { name: "Initialize existing project", exact: true })
          .count(),
        1
      )
      for (const label of ["Body font", "Heading font"])
        assert.match(
          await drawer.getByRole("combobox", { name: label, exact: true }).innerText(),
          /Keep existing typography/
        )
      await drawer.locator("#setup-workspace").fill("my-app-online")
      assert.equal(await command(), "pnpm dlx baseui-cn@latest init --workspace my-app-online")
      assert.match(
        await drawer.locator(".setup-caption").innerText(),
        /Run this from the existing workspace root\./
      )
      await drawer.getByRole("button", { name: "New project", exact: true }).click()
      assert.equal(await drawer.locator("#setup-workspace").count(), 0)
      assert.doesNotMatch(await command(), /init|--workspace/)
      await drawer.getByRole("button", { name: "Done", exact: true }).click()
      await drawer.waitFor({ state: "hidden" })
      await trigger.click()
      assert.doesNotMatch(await command(), /init|--workspace/)
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        false
      )
      results.push({
        width,
        height,
        mode,
        passed: true,
        fonts: 12,
        colors: 7,
        radii: 4,
        command: expected,
      })
      console.log(
        "PASS",
        width,
        mode,
        "fonts, keyboard, palettes, radius, exact copy, mode regression, reopen"
      )
      await context.close()
    }
  assert.deepEqual(errors, [])
} catch (error) {
  if (debugPage) {
    await debugPage.screenshot({ path: path.join(evidence, "failure.png") })
    await fs.writeFile(path.join(evidence, "failure.html"), await debugPage.content())
  }
  throw error
} finally {
  await fs.writeFile(
    path.join(evidence, "results.json"),
    JSON.stringify({ results, errors }, null, 2)
  )
  await browser.close()
}
