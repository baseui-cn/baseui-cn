// Real local production build: release exposure, command copy and operation regressions.
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import { pathToFileURL } from "node:url"
const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href)
const origin = process.env.LANDING_ORIGIN ?? "http://127.0.0.1:3152"
assert.ok(["localhost", "127.0.0.1"].includes(new URL(origin).hostname))
const enabled = process.env.SITE_TYPOGRAPHY === "enabled"
const evidence = process.env.RELEASE_EVIDENCE
assert.ok(evidence)
await fs.mkdir(evidence, { recursive: true })
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH })
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
      await context.addInitScript((mode) => localStorage.setItem("querycanvas-theme", mode), mode)
      const page = await context.newPage()
      page.on("pageerror", (error) => errors.push(error.message))
      await page.goto(origin, { waitUntil: "networkidle" })
      await page.getByRole("button", { name: "Create your project", exact: true }).first().click()
      const drawer = page.locator(".project-setup-drawer")
      const command = () =>
        drawer.getByRole("region", { name: "Setup command", exact: true }).innerText()
      const capture = async (operation) => {
        const text = await command()
        if (!enabled) assert.doesNotMatch(text, /--body-font|--heading-font/)
        await drawer.getByRole("button", { name: "Copy command", exact: true }).click()
        assert.equal(await page.evaluate(() => navigator.clipboard.readText()), text)
        results.push({ width, mode, operation, command: text })
        return text
      }
      assert.equal(
        await drawer.getByRole("combobox", { name: "Body font", exact: true }).count(),
        enabled ? 1 : 0
      )
      assert.equal(
        await drawer.getByRole("combobox", { name: "Heading font", exact: true }).count(),
        enabled ? 1 : 0
      )
      await drawer.getByRole("heading", { name: "Create new project", exact: true }).waitFor()
      await drawer.getByRole("button", { name: "pnpm", exact: true }).click()
      await drawer.locator("#setup-project").fill("my-app-online")
      assert.match(
        await capture("new"),
        /create my-app-online --framework next --package-manager pnpm --color iris --radius lg/
      )
      await drawer.getByRole("button", { name: "Monorepo", exact: true }).click()
      assert.match(await capture("new-monorepo"), /create my-app-online.*--monorepo/)
      assert.doesNotMatch(await command(), /--workspace/)
      await drawer.getByRole("combobox", { name: "Framework", exact: true }).click()
      await page.getByRole("listbox").waitFor()
      assert.equal(
        await page.getByRole("option", { name: "Existing React", exact: true }).count(),
        0
      )
      await page.keyboard.press("Escape")
      await page.getByRole("listbox").waitFor({ state: "hidden" })
      await drawer.getByRole("button", { name: "Existing project", exact: true }).click()
      await drawer
        .getByRole("heading", { name: "Initialize existing project", exact: true })
        .waitFor()
      assert.equal(await drawer.locator("#setup-project").count(), 0)
      await drawer.getByRole("combobox", { name: "Framework", exact: true }).click()
      await page.getByRole("option", { name: "Existing React", exact: true }).click()
      await drawer.locator("#setup-workspace").fill("apps/web")
      assert.equal(
        await capture("existing-monorepo"),
        "pnpm dlx baseui-cn@latest init --workspace apps/web"
      )
      await drawer.getByRole("button", { name: "Single app", exact: true }).click()
      assert.equal(
        await capture("existing-single-hidden-workspace"),
        "pnpm dlx baseui-cn@latest init"
      )
      await drawer.getByRole("button", { name: "New project", exact: true }).click()
      await drawer.getByRole("heading", { name: "Create new project", exact: true }).waitFor()
      assert.equal(await drawer.locator("#setup-project").inputValue(), "my-app")
      assert.equal(await drawer.locator("#setup-workspace").count(), 0)
      assert.match(await capture("existing-react-to-new"), /create my-app --framework next/)
      assert.doesNotMatch(await command(), /--workspace/)
      await page.screenshot({ path: path.join(evidence, `${width}-${mode}.png`) })
      await page.goto(origin + "/docs/installation", { waitUntil: "networkidle" })
      const docs = await page.locator("main").innerText()
      if (enabled) assert.match(docs, /--body-font|--heading-font/)
      else assert.doesNotMatch(docs, /--body-font|--heading-font/)
      await context.close()
    }
  assert.deepEqual(errors, [])
  await fs.writeFile(
    path.join(evidence, "release-browser.json"),
    JSON.stringify({ enabled, passed: results.length, errors, results }, null, 2) + "\n"
  )
  console.log(
    `PASS ${results.length} copied command regressions; ${enabled ? "post" : "pre"}-publish exposure; 4 viewport/theme states`
  )
} finally {
  await browser.close()
}
