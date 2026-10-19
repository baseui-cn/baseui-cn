// Exercise the built CLI's real init/add paths using its bundled registry.
// npm installation is stubbed: this fixture tests file/theme distribution offline.
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { execFileSync } from "node:child_process"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const fixtureRoot = await fs.mkdtemp(path.join(os.tmpdir(), "baseui-cli-fixtures-"))
for (const order of [
  ["input", "textarea", "input-group", "card", "frame"],
  ["frame", "card", "textarea", "input"],
]) {
  const dir = path.join(fixtureRoot, order[0])
  const bin = path.join(dir, "bin")
  await fs.mkdir(bin, { recursive: true })
  await fs.writeFile(path.join(dir, "package.json"), '{"name":"offline-consumer","private":true}')
  await fs.writeFile(path.join(bin, "npm"), "#!/bin/sh\nexit 0\n", { mode: 0o755 })
  const offline = path.join(dir, "offline.cjs")
  await fs.writeFile(
    offline,
    'global.fetch = async () => { throw new Error("Use bundled registry in this fixture") }'
  )
  const run = (args) =>
    execFileSync(
      process.execPath,
      ["--require", offline, path.join(root, "packages/cli/dist/index.js"), ...args],
      {
        cwd: dir,
        env: { ...process.env, PATH: bin + path.delimiter + process.env.PATH },
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      }
    )
  run(["init", "-y", "--css", "globals.css"])
  const theme = await fs.readFile(path.join(dir, "globals.css"), "utf8")
  run(["init", "-y", "--css", "globals.css"])
  assert.equal(await fs.readFile(path.join(dir, "globals.css"), "utf8"), theme)
  const customizedStyles = new Map()
  for (const name of order) {
    run(["add", name, "-y"])
    assert.ok(
      (await fs.stat(path.join(dir, "components/ui", name + ".tsx"))).isFile(),
      `${name}: source must install despite shared style collision`
    )
    for (const [file, content] of customizedStyles)
      assert.equal(await fs.readFile(file, "utf8"), content, "shared consumer style must be reused")
    const style = path.join(
      dir,
      "styles",
      ["card", "frame"].includes(name) ? "surface.styles.css" : "text-control.styles.css"
    )
    if (!customizedStyles.has(style)) {
      const content =
        (await fs.readFile(style, "utf8")) +
        "\n/* Consumer anatomy customization. */\n.consumer-custom { color: rebeccapurple; }\n"
      await fs.writeFile(style, content)
      customizedStyles.set(style, content)
    }
  }
  const firstSource = path.join(dir, "components/ui", order[0] + ".tsx")
  const customSource =
    (await fs.readFile(firstSource, "utf8")) + "\n// Consumer source customization.\n"
  await fs.writeFile(firstSource, customSource)
  run(["add", ...order, "-y"])
  run(["init", "-y", "--css", "globals.css"])
  assert.equal(await fs.readFile(firstSource, "utf8"), customSource)
  assert.equal(await fs.readFile(path.join(dir, "globals.css"), "utf8"), theme)
  for (const [file, content] of customizedStyles)
    assert.equal(await fs.readFile(file, "utf8"), content)
  console.log(
    `PASS sequential ${order.join(" -> ")}; shared style/source preservation; repeated init/add`
  )
}
console.log(`CLI fixtures retained: ${fixtureRoot} (dependency installation stubbed)`)

// Phase 2 is installed incrementally over a Phase 1 theme and partial sources.
const phaseTwo = [
  "field",
  "form",
  "fieldset",
  "checkbox",
  "checkbox-group",
  "radio-group",
  "switch",
  "number-field",
  "slider",
  "otp-field",
  "toggle",
  "toggle-group",
]
for (const scenario of ["phase1", "custom", "partial"]) {
  const dir = path.join(fixtureRoot, "phase2-" + scenario)
  await fs.mkdir(path.join(dir, "bin"), { recursive: true })
  await fs.writeFile(path.join(dir, "package.json"), '{"name":"phase2-consumer","private":true}')
  await fs.writeFile(path.join(dir, "bin/npm"), "#!/bin/sh\nexit 0\n", { mode: 0o755 })
  const offline = path.join(dir, "offline.cjs")
  await fs.writeFile(offline, 'global.fetch = async () => { throw new Error("bundled fixture") }')
  const run = (args) =>
    execFileSync(
      process.execPath,
      ["--require", offline, path.join(root, "packages/cli/dist/index.js"), ...args],
      {
        cwd: dir,
        env: { ...process.env, PATH: path.join(dir, "bin") + path.delimiter + process.env.PATH },
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      }
    )
  run(["init", "-y", "--css", "globals.css"])
  run(["add", "input", "button", "-y"])
  const themeFile = path.join(dir, "globals.css")
  if (scenario === "custom")
    await fs.appendFile(
      themeFile,
      "\n:root { --cn-primary: rebeccapurple; --cn-radius-control: 9px; --cn-status-destructive-text: #911; }\n.dark { --cn-focus-color: #bbd5ff; }\n"
    )
  if (scenario === "partial") run(["add", "number-field", "toggle", "-y"])
  const theme = await fs.readFile(themeFile, "utf8")
  const existingFiles = [
    "components/ui/input.tsx",
    "styles/text-control.styles.css",
    "styles/button.styles.css",
  ]
  const preserved = new Map()
  for (const file of existingFiles) {
    const target = path.join(dir, file)
    await fs.appendFile(
      target,
      file.endsWith("tsx") ? "\n// Consumer-owned source.\n" : "\n/* Consumer-owned anatomy. */\n"
    )
    preserved.set(target, await fs.readFile(target, "utf8"))
  }
  const order = scenario === "partial" ? [...phaseTwo].reverse() : phaseTwo
  for (const name of order) run(["add", name, "-y"])
  run(["add", ...phaseTwo, "-y"])
  run(["init", "-y", "--css", "globals.css"])
  assert.equal(
    await fs.readFile(themeFile, "utf8"),
    theme,
    "theme values must survive incremental installs"
  )
  for (const [target, content] of preserved)
    assert.equal(await fs.readFile(target, "utf8"), content)
  for (const name of phaseTwo) {
    const source = await fs.readFile(path.join(dir, "components/ui", name + ".tsx"), "utf8")
    for (const [, style] of source.matchAll(/import "@\/styles\/([^"]+)"/g))
      assert.ok((await fs.stat(path.join(dir, "styles", style))).isFile())
    for (const [, dep] of source.matchAll(/from "@\/components\/ui\/([^"]+)"/g))
      assert.ok((await fs.stat(path.join(dir, "components/ui", dep + ".tsx"))).isFile())
  }
  console.log(
    `PASS Phase 2 ${scenario}: twelve incremental installs, partial/shared styles, custom values, repeated add/init, local import closure`
  )
}
