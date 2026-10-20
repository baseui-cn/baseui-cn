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
