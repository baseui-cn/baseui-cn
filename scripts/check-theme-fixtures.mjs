// Behavioral filesystem coverage for the real CLI theme installer. No new runner.
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const requireCLI = createRequire(path.join(root, "packages/cli/package.json"))
const requireTsup = createRequire(requireCLI.resolve("tsup"))
const { build } = requireTsup("esbuild")
const dir = await fs.mkdtemp(path.join(os.tmpdir(), "baseui-theme-fixtures-"))
const bundle = path.join(dir, "installer.cjs")
await build({
  entryPoints: [path.join(root, "packages/cli/src/utils/ensure-styles.ts")],
  bundle: true,
  platform: "node",
  format: "cjs",
  outfile: bundle,
  logLevel: "silent",
})
const { ensureThemeCSS } = createRequire(import.meta.url)(bundle)
const cases = {
  fresh: null,
  whitespace:
    '@import "tailwindcss";\n@theme   inline { --color-primary: rebeccapurple; }\n:root { content: "--ring: red; }"; }\n',
  missing:
    '@import "tailwindcss";\n:root { --background: #fafafa; }\n.dark { --background: #101010; }\n',
  custom:
    '@import "tailwindcss";\n/* baseui-cn theme */\n:root { --radius: 13px; --input: #123456; --customer-boundary: #456789; --customer-unit: .07rem; }\n.dark { --input: #abcdef; --ring: #fedcba; }\n.custom-tail { color: rebeccapurple; }\n',
  commented: '@import "tailwindcss";\n:root { /* --ring: red; */ --primary: rebeccapurple; }\n',
  grouped:
    '@import "tailwindcss";\n:root, .brand { --primary: #531783; }\n.dark, .night { --foreground: #fffabc; }\n',
  repeated: '@import "tailwindcss";\n:root { --primary: #111222; }\n:root { --ring: #531783; }\n',
  layered:
    '@import "tailwindcss";\n@layer base {\n  :root { --primary: #531783; content: "} {"; }\n  .dark { --primary: #dabafa; }\n}\n',
}
for (const [name, before] of Object.entries(cases)) {
  const file = path.join(dir, name, "globals.css")
  if (before !== null) {
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, before)
  }
  const config = { globalCss: file, tailwind: true }
  assert.equal(await ensureThemeCSS(config, { silent: true }), true, `${name}: first merge`)
  const first = await fs.readFile(file, "utf8")
  assert.equal(
    await ensureThemeCSS(config, { silent: true }),
    false,
    `${name}: repeated merge must be no-op`
  )
  assert.equal(await fs.readFile(file, "utf8"), first, `${name}: bytes remain identical`)
  assert.match(first, /@custom-variant dark \(&:where\(\.dark, \.dark \*\)\);/)
  assert.match(first, /--input:/)
  assert.match(first, /--ring:/)
  if (name === "fresh") assert.ok(!first.includes("--cn-"), "fresh theme has no V2 namespace")
  if (name === "custom") {
    for (const text of [
      "--radius: 13px",
      "--input: #123456",
      "--customer-boundary: #456789",
      "--customer-unit: .07rem",
      "--input: #abcdef",
      "--ring: #fedcba",
      ".custom-tail { color: rebeccapurple; }",
    ])
      assert.ok(first.includes(text), `preserved ${text}`)
  }
  if (["layered", "grouped"].includes(name))
    assert.equal(
      (first.match(/--primary:/g) ?? []).length,
      name === "grouped" ? 1 : 2,
      `${name}: must not append overriding primary defaults`
    )
  if (name === "repeated")
    assert.equal(
      (first.match(/--ring:/g) ?? []).length,
      1,
      "root semantic override must not be shadowed by a dark default"
    )
  if (name === "custom")
    assert.equal(
      (first.match(/--customer-boundary:/g) ?? []).length,
      1,
      "unknown consumer variable is preserved"
    )
  if (name === "whitespace") {
    assert.equal(
      (first.match(/--color-primary:/g) ?? []).length,
      1,
      "preserve mapping despite whitespace"
    )
    assert.match(first, /--ring: #6673e8/, "quoted example is not a declaration")
  }
  if (name === "commented") assert.match(first, /--ring: #6673e8/)
  console.log(`PASS ${name}: additive merge + byte-idempotence`)
}
assert.equal(
  await ensureThemeCSS(
    { globalCss: path.join(dir, "skip.css"), tailwind: false },
    { silent: true }
  ),
  false
)
console.log(`Fixtures retained: ${dir}`)

// Presets come from the authored generator schema; there are no test-owned colors.
const definition = JSON.parse(
  await fs.readFile(path.join(root, "scripts/theme-definition.json"), "utf8")
)
const { presets } = definition
const readVars = (css, selector) =>
  Object.fromEntries(
    [
      ...css.match(new RegExp(`${selector} \\{([^}]+)\\}`))[1].matchAll(/(--[\w-]+):\s*([^;]+);/g),
    ].map((m) => [m[1], m[2]])
  )
for (const [color, preset] of Object.entries(presets.colors))
  for (const [radius, size] of Object.entries(presets.radii)) {
    const file = path.join(dir, `preset-${color}-${radius}.css`),
      config = { globalCss: file, tailwind: true }
    await ensureThemeCSS(config, { silent: true, color, radius })
    const css = await fs.readFile(file, "utf8"),
      light = readVars(css, ":root"),
      dark = readVars(css, "\\.dark")
    assert.equal(light["--radius"], size.value)
    for (const mode of ["light", "dark"]) {
      const actual = mode === "light" ? light : dark
      for (const [key, value] of Object.entries(preset[mode])) assert.equal(actual[key], value)
      for (const key of [
        "--background",
        "--card",
        "--popover",
        "--success",
        "--warning",
        "--info",
        "--destructive",
      ])
        assert.equal(actual[key], definition[mode][key])
    }
    assert.equal(new Set([...Object.keys(light), ...Object.keys(dark)]).size, 26)
    assert.ok(!css.includes("--cn-"))
    assert.equal(await ensureThemeCSS(config, { silent: true, color, radius }), false)
    assert.equal(await fs.readFile(file, "utf8"), css)
  }
const fresh = await fs.readFile(path.join(dir, "fresh/globals.css"), "utf8")
assert.equal(readVars(fresh, ":root")["--radius"], presets.radii[presets.defaultRadius].value)
assert.equal(
  readVars(fresh, ":root")["--primary"],
  presets.colors[presets.defaultColor].light["--primary"]
)
for (const options of [{ color: "bad" }, { radius: "bad" }, { color: "toString" }])
  await assert.rejects(
    ensureThemeCSS(
      { globalCss: path.join(dir, "invalid.css"), tailwind: true },
      { silent: true, ...options }
    ),
    /Invalid/
  )
const customFile = path.join(dir, "explicit-custom.css")
const custom =
  '@import "tailwindcss";\n/* --primary: fake; */\n:root { --primary: rebeccapurple; --radius: 13px; --success: #123456; content: "--primary: ignored;"; }\n:root { --primary: #c0ffee !important; }\n@layer base { .dark { --primary: #fedcba; --radius: 19px; --success: #654321; } }\n.other { --primary: tomato; }\n'
await fs.writeFile(customFile, custom)
const customConfig = { globalCss: customFile, tailwind: true }
await ensureThemeCSS(customConfig, { silent: true })
const preserved = await fs.readFile(customFile, "utf8")
assert.ok(preserved.includes(custom.split("\n")[1]))
for (const value of [
  "--primary: rebeccapurple",
  "--primary: #c0ffee !important",
  "--radius: 13px",
  "--radius: 19px",
])
  assert.ok(preserved.includes(value))
await ensureThemeCSS(customConfig, { silent: true, color: "emerald" })
const changedColor = await fs.readFile(customFile, "utf8")
assert.ok(
  changedColor.includes("--primary: " + presets.colors.emerald.light["--primary"] + " !important")
)
assert.ok(changedColor.includes("--radius: 13px"))
assert.ok(changedColor.includes("--radius: 19px"))
assert.ok(changedColor.includes('content: "--primary: ignored;"'))
assert.ok(changedColor.includes(".other { --primary: tomato; }"))
for (const value of ["--success: #123456", "--success: #654321"])
  assert.ok(changedColor.includes(value))
await ensureThemeCSS(customConfig, { silent: true, radius: "xl" })
const changedRadius = await fs.readFile(customFile, "utf8")
assert.equal((changedRadius.match(/--radius: 1rem/g) || []).length, 2)
assert.ok(changedRadius.includes("--primary: " + presets.colors.emerald.light["--primary"]))
assert.equal(
  await ensureThemeCSS(customConfig, { silent: true, color: "emerald", radius: "xl" }),
  false
)
console.log(
  "PASS 28 color/radius combinations, generic variables, default Iris/Rounded, invalid options, light/dark semantic preservation, repeated explicit init and customized CSS boundaries"
)

const luminance = (hex) => {
  const values = hex
    .slice(1)
    .match(/../g)
    .map((value) => parseInt(value, 16) / 255)
    .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4))
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722
}
const contrast = (a, b) => {
  const [high, low] = [luminance(a), luminance(b)].sort((a, b) => b - a)
  return (high + 0.05) / (low + 0.05)
}
for (const [id, preset] of Object.entries(presets.colors))
  for (const mode of ["light", "dark"]) {
    assert.ok(
      contrast(preset[mode]["--primary"], preset[mode]["--primary-foreground"]) >= 4.5,
      `${id}/${mode} primary text contrast`
    )
    assert.ok(
      contrast(preset[mode]["--accent"], preset[mode]["--accent-foreground"]) >= 4.5,
      `${id}/${mode} selection text contrast`
    )
    assert.ok(
      contrast(preset[mode]["--ring"], definition[mode]["--background"]) >= 3,
      `${id}/${mode} focus ring contrast`
    )
  }
await assert.rejects(
  ensureThemeCSS({ globalCss: path.join(dir, "skip.css"), tailwind: false }, { color: "iris" }),
  /Theme flags require/
)
console.log(
  "PASS all 14 primary/accent text pairs >=4.5:1 and focus rings >=3:1; unsupported theme/skip-CSS combination fails truthfully"
)
const composite = (color, background, alpha) =>
  "#" +
  [1, 3, 5]
    .map((i) =>
      Math.round(
        parseInt(color.slice(i, i + 2), 16) * alpha +
          parseInt(background.slice(i, i + 2), 16) * (1 - alpha)
      )
        .toString(16)
        .padStart(2, "0")
    )
    .join("")
for (const [id, preset] of Object.entries(presets.colors))
  for (const mode of ["light", "dark"]) {
    const hovered = composite(preset[mode]["--primary"], definition[mode]["--card"], 0.9)
    assert.ok(
      contrast(hovered, preset[mode]["--primary-foreground"]) >= 4.5,
      `${id}/${mode}: shared primary 90% hover contrast`
    )
  }
console.log("PASS all 14 preset/mode shared primary hover states >=4.5:1")
