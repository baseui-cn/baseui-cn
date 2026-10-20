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
      "\n:root { --primary: rebeccapurple; --radius: 9px; --destructive: #911; }\n.dark { --ring: #bbd5ff; }\n"
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

// Phase 3 shares selection anatomy, with Command -> Autocomplete -> Input closure.
const phaseThree = ["select", "autocomplete", "combobox", "command"]
for (const scenario of ["phase2", "custom", "partial", "reverse"]) {
  const dir = path.join(fixtureRoot, "phase3-" + scenario)
  await fs.mkdir(path.join(dir, "bin"), { recursive: true })
  await fs.writeFile(path.join(dir, "package.json"), '{"name":"phase3-consumer","private":true}')
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
  if (scenario === "phase2" || scenario === "custom") run(["add", ...phaseTwo, "-y"])
  if (scenario === "partial") run(["add", "input-group", "field", "-y"])
  if (scenario === "custom")
    await fs.appendFile(
      path.join(dir, "globals.css"),
      "\n:root { --accent: #e5efe6; --radius: 9px; --primary: #245734; }\n.dark { --ring: #c5e4ff; }\n"
    )
  const theme = await fs.readFile(path.join(dir, "globals.css"), "utf8")
  const order = scenario === "reverse" ? [...phaseThree].reverse() : phaseThree
  const preserved = new Map()
  for (const name of order) {
    run(["add", name, "-y"])
    // Every imported component/helper/stylesheet must be installed recursively.
    const seen = new Set()
    const closure = async (file) => {
      if (seen.has(file)) return
      seen.add(file)
      const source = await fs.readFile(path.join(dir, file), "utf8")
      for (const [, dep] of source.matchAll(/(?:from|import) "@\/([^\"]+)"/g)) {
        const target = dep.endsWith(".css") ? dep : dep + (dep.startsWith("lib/") ? ".ts" : ".tsx")
        await fs.access(path.join(dir, target))
        if (!target.endsWith(".css")) await closure(target)
      }
    }
    await closure("components/ui/" + name + ".tsx")
    for (const [file, content] of preserved) assert.equal(await fs.readFile(file, "utf8"), content)
    const style = path.join(dir, "styles/selection.styles.css")
    if (!preserved.has(style)) {
      await fs.appendFile(style, "\n/* Consumer selection customization. */\n")
      preserved.set(style, await fs.readFile(style, "utf8"))
    }
  }
  const source = path.join(dir, "components/ui/" + order[0] + ".tsx")
  await fs.appendFile(source, "\n// Consumer selection source.\n")
  preserved.set(source, await fs.readFile(source, "utf8"))
  run(["add", ...phaseThree, "-y"])
  run(["init", "-y", "--css", "globals.css"])
  for (const [file, content] of preserved) assert.equal(await fs.readFile(file, "utf8"), content)
  assert.equal(await fs.readFile(path.join(dir, "globals.css"), "utf8"), theme)
  console.log(
    `PASS Phase 3 ${scenario}: recursive install closure, sequential/shared styles, preserved custom theme/source, repeated add/init`
  )
}

// Phase 4 shares anchored anatomy, with Menubar -> DropdownMenu closure.
const phaseFour = ["popover", "tooltip", "preview-card", "dropdown-menu", "menubar"]
for (const scenario of ["phase2", "custom", "partial", "reverse"]) {
  const dir = path.join(fixtureRoot, "phase4-" + scenario)
  await fs.mkdir(path.join(dir, "bin"), { recursive: true })
  await fs.writeFile(path.join(dir, "package.json"), '{"name":"phase4-consumer","private":true}')
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
  if (scenario === "phase2" || scenario === "custom") run(["add", ...phaseTwo, "-y"])
  if (scenario === "partial") run(["add", "input-group", "field", "-y"])
  if (scenario === "custom")
    await fs.appendFile(
      path.join(dir, "globals.css"),
      "\n:root { --accent: #e5efe6; --radius: 9px; --primary: #245734; }\n.dark { --ring: #c5e4ff; }\n"
    )
  const theme = await fs.readFile(path.join(dir, "globals.css"), "utf8")
  const order = scenario === "reverse" ? [...phaseFour].reverse() : phaseFour
  const preserved = new Map()
  for (const name of order) {
    run(["add", name, "-y"])
    // Every imported component/helper/stylesheet must be installed recursively.
    const seen = new Set()
    const closure = async (file) => {
      if (seen.has(file)) return
      seen.add(file)
      const source = await fs.readFile(path.join(dir, file), "utf8")
      for (const [, dep] of source.matchAll(/(?:from|import) "@\/([^\"]+)"/g)) {
        const target = dep.endsWith(".css") ? dep : dep + (dep.startsWith("lib/") ? ".ts" : ".tsx")
        await fs.access(path.join(dir, target))
        if (!target.endsWith(".css")) await closure(target)
      }
    }
    await closure("components/ui/" + name + ".tsx")
    for (const [file, content] of preserved) assert.equal(await fs.readFile(file, "utf8"), content)
    const style = path.join(dir, "styles/overlay.styles.css")
    if (!preserved.has(style)) {
      await fs.appendFile(style, "\n/* Consumer overlay customization. */\n")
      preserved.set(style, await fs.readFile(style, "utf8"))
    }
  }
  const source = path.join(dir, "components/ui/" + order[0] + ".tsx")
  await fs.appendFile(source, "\n// Consumer overlay source.\n")
  preserved.set(source, await fs.readFile(source, "utf8"))
  run(["add", ...phaseFour, "-y"])
  run(["init", "-y", "--css", "globals.css"])
  for (const [file, content] of preserved) assert.equal(await fs.readFile(file, "utf8"), content)
  assert.equal(await fs.readFile(path.join(dir, "globals.css"), "utf8"), theme)
  console.log(
    `PASS Phase 4 ${scenario}: recursive install closure, sequential/shared styles, preserved custom theme/source, repeated add/init`
  )
}

// Modal shells install alone or incrementally, preserving shared consumer CSS.
const phaseFive = ["dialog", "alert-dialog", "drawer", "command"]
for (const scenario of ["phase2", "custom", "partial", "reverse", ...phaseFive]) {
  const dir = path.join(fixtureRoot, "phase5-" + scenario)
  await fs.mkdir(path.join(dir, "bin"), { recursive: true })
  await fs.writeFile(path.join(dir, "package.json"), '{"name":"phase5-consumer","private":true}')
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
  if (scenario === "phase2" || scenario === "custom") run(["add", ...phaseTwo, "-y"])
  if (scenario === "partial") run(["add", "input-group", "field", "-y"])
  if (scenario === "custom")
    await fs.appendFile(
      path.join(dir, "globals.css"),
      "\n:root { --accent: #e5efe6; --radius: 9px; --primary: #245734; }\n.dark { --ring: #c5e4ff; }\n"
    )
  const theme = await fs.readFile(path.join(dir, "globals.css"), "utf8")
  const order = phaseFive.includes(scenario)
    ? [scenario]
    : scenario === "reverse"
      ? [...phaseFive].reverse()
      : phaseFive
  const preserved = new Map()
  for (const name of order) {
    run(["add", name, "-y"])
    // Every imported component/helper/stylesheet must be installed recursively.
    const seen = new Set()
    const closure = async (file) => {
      if (seen.has(file)) return
      seen.add(file)
      const source = await fs.readFile(path.join(dir, file), "utf8")
      for (const [, dep] of source.matchAll(/(?:from|import) "@\/([^\"]+)"/g)) {
        const target = dep.endsWith(".css") ? dep : dep + (dep.startsWith("lib/") ? ".ts" : ".tsx")
        await fs.access(path.join(dir, target))
        if (!target.endsWith(".css")) await closure(target)
      }
    }
    await closure("components/ui/" + name + ".tsx")
    for (const [file, content] of preserved) assert.equal(await fs.readFile(file, "utf8"), content)
    const style = path.join(dir, "styles/modal.styles.css")
    if (!preserved.has(style)) {
      await fs.appendFile(style, "\n/* Consumer modal customization. */\n")
      preserved.set(style, await fs.readFile(style, "utf8"))
    }
  }
  const source = path.join(dir, "components/ui/" + order[0] + ".tsx")
  await fs.appendFile(source, "\n// Consumer modal source.\n")
  preserved.set(source, await fs.readFile(source, "utf8"))
  run(["add", ...phaseFive, "-y"])
  run(["init", "-y", "--css", "globals.css"])
  for (const [file, content] of preserved) assert.equal(await fs.readFile(file, "utf8"), content)
  assert.equal(await fs.readFile(path.join(dir, "globals.css"), "utf8"), theme)
  console.log(
    `PASS Phase 5 ${scenario}: recursive install closure, sequential/shared styles, preserved custom theme/source, repeated add/init`
  )
}

// Navigation/disclosure installs independently or over earlier families.
const phaseSix = [
  "tabs",
  "accordion",
  "collapsible",
  "navigation-menu",
  "breadcrumb",
  "pagination",
  "menubar",
]
for (const scenario of ["phase2", "custom", "partial", "reverse", ...phaseSix]) {
  const dir = path.join(fixtureRoot, "phase6-" + scenario)
  await fs.mkdir(path.join(dir, "bin"), { recursive: true })
  await fs.writeFile(path.join(dir, "package.json"), '{"name":"phase6-consumer","private":true}')
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
  if (scenario === "phase2" || scenario === "custom") run(["add", ...phaseTwo, "-y"])
  if (scenario === "partial") run(["add", "input-group", "field", "-y"])
  if (scenario === "custom")
    await fs.appendFile(
      path.join(dir, "globals.css"),
      "\n:root { --accent: #e5efe6; --radius: 9px; --primary: #245734; }\n.dark { --ring: #c5e4ff; }\n"
    )
  const theme = await fs.readFile(path.join(dir, "globals.css"), "utf8")
  const order = phaseSix.includes(scenario)
    ? [scenario]
    : scenario === "reverse"
      ? [...phaseSix].reverse()
      : phaseSix
  const preserved = new Map()
  for (const name of order) {
    run(["add", name, "-y"])
    // Every imported component/helper/stylesheet must be installed recursively.
    const seen = new Set()
    const closure = async (file) => {
      if (seen.has(file)) return
      seen.add(file)
      const source = await fs.readFile(path.join(dir, file), "utf8")
      for (const [, dep] of source.matchAll(/(?:from|import) "@\/([^\"]+)"/g)) {
        const target = dep.endsWith(".css") ? dep : dep + (dep.startsWith("lib/") ? ".ts" : ".tsx")
        await fs.access(path.join(dir, target))
        if (!target.endsWith(".css")) await closure(target)
      }
    }
    await closure("components/ui/" + name + ".tsx")
    for (const [file, content] of preserved) assert.equal(await fs.readFile(file, "utf8"), content)
    const style = path.join(
      dir,
      name === "menubar" ? "styles/overlay.styles.css" : "styles/navigation.styles.css"
    )
    if (!preserved.has(style)) {
      await fs.appendFile(style, "\n/* Consumer navigation customization. */\n")
      preserved.set(style, await fs.readFile(style, "utf8"))
    }
  }
  const source = path.join(dir, "components/ui/" + order[0] + ".tsx")
  await fs.appendFile(source, "\n// Consumer navigation source.\n")
  preserved.set(source, await fs.readFile(source, "utf8"))
  run(["add", ...phaseSix, "-y"])
  run(["init", "-y", "--css", "globals.css"])
  for (const [file, content] of preserved) assert.equal(await fs.readFile(file, "utf8"), content)
  assert.equal(await fs.readFile(path.join(dir, "globals.css"), "utf8"), theme)
  console.log(
    `PASS Phase 6 ${scenario}: recursive install closure, sequential/shared styles, preserved custom theme/source, repeated add/init`
  )
}

// Phase 7: feedback/data/blocks must install without website CSS, in either order.
const phaseSeven = [
  "alert",
  "toast",
  "progress",
  "skeleton",
  "spinner",
  "item",
  "scroll-area",
  "table",
  "data-grid",
  "empty-state",
  "login",
  "signup",
]
const { componentMeta } = await import("./registry-meta.mjs")
const phaseSevenSource = (name) =>
  componentMeta[name].installedPath.endsWith("/*")
    ? componentMeta[name].files[0].targetPath
    : componentMeta[name].installedPath
const mixedPhases = ["tabs", "navigation-menu", "alert", "toast", "table", "data-grid", "login"]
for (const scenario of [
  "incremental",
  "custom",
  "partial",
  "reverse",
  "mixed",
  "mixed-reverse",
  ...phaseSeven,
]) {
  const dir = path.join(fixtureRoot, "phase7-" + scenario)
  await fs.mkdir(path.join(dir, "bin"), { recursive: true })
  await fs.writeFile(path.join(dir, "package.json"), '{"name":"phase7-consumer","private":true}')
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
  if (["incremental", "custom"].includes(scenario))
    run(["add", ...phaseTwo, ...phaseThree, ...phaseFour, ...phaseFive, "-y"])
  if (scenario === "partial") run(["add", "button", "input", "card", "field", "-y"])
  if (["custom", "mixed", "mixed-reverse"].includes(scenario))
    await fs.appendFile(
      path.join(dir, "globals.css"),
      "\n:root { --success: #245734; --radius: 9px; --popover: #f7f4ed; }\n.dark { --ring: #c5e4ff; }\n"
    )
  const theme = await fs.readFile(path.join(dir, "globals.css"), "utf8")
  const order =
    scenario === "mixed"
      ? mixedPhases
      : scenario === "mixed-reverse"
        ? [...mixedPhases].reverse()
        : phaseSeven.includes(scenario)
          ? [scenario]
          : scenario === "reverse"
            ? [...phaseSeven].reverse()
            : phaseSeven
  const preserved = new Map()
  const closure = async (file, seen = new Set()) => {
    if (seen.has(file)) return
    seen.add(file)
    const source = await fs.readFile(path.join(dir, file), "utf8")
    for (const [, dep] of source.matchAll(/(?:from|import) "@\/([^\"]+)"/g)) {
      let target
      for (const suffix of dep.endsWith(".css") ? [""] : [".tsx", ".ts"]) {
        try {
          await fs.access(path.join(dir, dep + suffix))
          target = dep + suffix
          break
        } catch {}
      }
      assert.ok(target, `${file}: missing copied import ${dep}`)
      if (!target.endsWith(".css")) await closure(target, seen)
    }
  }
  for (const name of order) {
    run(["add", name, "-y"])
    await closure(phaseSevenSource(name))
    for (const [file, content] of preserved) assert.equal(await fs.readFile(file, "utf8"), content)
    for (const style of ["navigation", "feedback", "data", "blocks"]) {
      const file = path.join(dir, `styles/${style}.styles.css`)
      try {
        await fs.access(file)
        if (!preserved.has(file)) {
          await fs.appendFile(file, "\n/* Consumer Phase 7 customization. */\n")
          preserved.set(file, await fs.readFile(file, "utf8"))
        }
      } catch (error) {
        if (error.code !== "ENOENT") throw error
      }
    }
  }
  const source = path.join(dir, phaseSevenSource(order[0]))
  await fs.appendFile(source, "\n// Consumer Phase 7 source.\n")
  preserved.set(source, await fs.readFile(source, "utf8"))
  run(["add", ...new Set([...order, ...phaseSeven]), "-y"])
  run(["init", "-y", "--css", "globals.css"])
  for (const name of phaseSeven) await closure(phaseSevenSource(name))
  for (const [file, content] of preserved) assert.equal(await fs.readFile(file, "utf8"), content)
  assert.equal(await fs.readFile(path.join(dir, "globals.css"), "utf8"), theme)
  console.log(
    `PASS Phase 7 ${scenario}: recursive source/style closure, shared CSS/source/theme preservation, repeated add/init`
  )
}
