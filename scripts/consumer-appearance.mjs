// Shared by the full network matrix and follow-up rendered acceptance.
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import { spawn } from "node:child_process"
import { createRequire } from "node:module"
import { pathToFileURL } from "node:url"
export async function mountConsumerSample(result) {
  const { app, input } = result
  const config = JSON.parse(await fs.readFile(path.join(app, "baseui-cn.json"), "utf8"))
  const sample = path.join(app, config.componentsPath, "typography-sample.tsx")
  await fs.mkdir(path.dirname(sample), { recursive: true })
  await fs.writeFile(
    sample,
    'export function TypographySample() { return <section id="consumer-typography"><h2>Make something your own.</h2><p>Comfortable body text.</p><input aria-label="Name" /><button>Continue</button><code>const example = true</code></section> }\n'
  )
  const entry = {
    next: "src/app/page.tsx",
    vite: "src/App.tsx",
    "tanstack-start": "src/routes/index.tsx",
    "react-router": "app/routes/home.tsx",
  }[input.framework]
  const relative = path
    .relative(path.dirname(path.join(app, entry)), sample)
    .split(path.sep)
    .join("/")
    .replace(/\.tsx$/, "")
  const imported = `import { TypographySample } from ${JSON.stringify(relative.startsWith(".") ? relative : "./" + relative)};\n`
  const source =
    input.framework === "tanstack-start"
      ? "import { createFileRoute } from '@tanstack/react-router';\n" +
        imported +
        "export const Route = createFileRoute('/')({ component: TypographySample });\n"
      : imported + "export default function Home() { return <TypographySample /> }\n"
  await fs.writeFile(path.join(app, entry), source)
}
export async function inspectConsumer(result, typography, themePresets, evidence, env) {
  const modulePath = process.env.PLAYWRIGHT_MODULE
  const { chromium } = await import(modulePath ? pathToFileURL(modulePath).href : "playwright")
  const { app, input } = result
  const resolveApp = createRequire(path.join(app, "package.json"))
  const packageDir = (name) => path.dirname(resolveApp.resolve(name + "/package.json"))
  const port = Number(process.env.CONSUMER_PORT ?? 3191)
  const entry =
    input.framework === "next"
      ? [path.join(packageDir("next"), "dist/bin/next"), "start", "--port", String(port)]
      : input.framework === "react-router"
        ? [path.join(packageDir("@react-router/serve"), "bin.cjs"), "./build/server/index.js"]
        : [
            path.join(packageDir("vite"), "bin/vite.js"),
            "preview",
            "--host",
            "127.0.0.1",
            "--port",
            String(port),
            "--strictPort",
          ]
  const output = await fs.open(path.join(evidence, result.id + "-server.log"), "a")
  const server = spawn(process.execPath, entry, {
    cwd: app,
    env: { ...env, PORT: String(port), HOST: "127.0.0.1" },
    stdio: ["ignore", output.fd, output.fd],
  })
  let browser
  try {
    let ready = false
    for (let i = 0; i < 150; i++) {
      try {
        const response = await fetch(`http://127.0.0.1:${port}`)
        if (response.ok) {
          ready = true
          break
        }
      } catch {}
      if (server.exitCode !== null) break
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
    assert.ok(ready, "Production consumer server ready: " + result.id)
    browser = await chromium.launch({
      headless: true,
      ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
    })
    const page = await browser.newPage()
    const errors = [],
      fontRequests = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("response", (response) => {
      if (/\.(woff2?|ttf)(\?|$)/.test(response.url()))
        fontRequests.push({ url: response.url(), status: response.status() })
    })
    await page.goto(`http://127.0.0.1:${port}`, { waitUntil: "networkidle" })
    await page.locator("#consumer-typography").waitFor()
    const modes = []
    for (const mode of ["light", "dark"]) {
      await page.evaluate(
        (value) => document.documentElement.classList.toggle("dark", value === "dark"),
        mode
      )
      for (const [dimension, id, selector] of [
        ["body", input.bodyFont, "#consumer-typography p"],
        ["heading", input.headingFont, "#consumer-typography h2"],
      ]) {
        const font = typography.fonts[id]
        const family = await page.locator(selector).evaluate((e) => getComputedStyle(e).fontFamily)
        assert.equal(
          family.split(",")[0].replaceAll('"', ""),
          font.family.split(",")[0].replaceAll('"', ""),
          `${result.id} ${mode} ${dimension}: selected face`
        )
        if (id !== "system")
          assert.ok(
            await page.evaluate(
              async (family) => (await document.fonts.load(`600 20px ${family}`)).length,
              font.family.split(",")[0]
            )
          )
      }
      const values = await page
        .locator("html")
        .evaluate((e) =>
          Object.fromEntries(
            [
              "--primary",
              "--border",
              "--input",
              "--ring",
              "--radius",
              "--font-body",
              "--font-heading",
            ].map((key) => [key, getComputedStyle(e).getPropertyValue(key).trim()])
          )
        )
      for (const token of ["--primary", "--border", "--input", "--ring"])
        assert.equal(values[token], themePresets.colors[input.color][mode][token])
      assert.equal(values["--radius"], themePresets.radii[input.radius].value)
      const code = await page
        .locator("#consumer-typography code")
        .evaluate((e) => getComputedStyle(e).fontFamily)
      assert.ok(/mono/i.test(code), "Code keeps monospace typography: " + code)
      await page.screenshot({ path: path.join(evidence, result.id + "-" + mode + ".png") })
      modes.push({ mode, values, code })
    }
    assert.deepEqual(errors, [])
    if (input.bodyFont !== "system" || input.headingFont !== "system") {
      assert.ok(fontRequests.length > 0)
      assert.ok(
        fontRequests.every((r) => new URL(r.url).hostname === "127.0.0.1" && r.status === 200)
      )
    }
    return { passed: true, modes, fontRequests, errors }
  } finally {
    if (browser) await browser.close()
    const stopped = new Promise((resolve) => server.once("exit", resolve))
    server.kill("SIGTERM")
    if (server.exitCode === null) await stopped
    await output.close()
  }
}
