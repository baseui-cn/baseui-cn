import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import os from "node:os"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const temp = await fs.mkdtemp(path.join(os.tmpdir(), "grid-css-regression-"))
const require = createRequire(await fs.realpath(path.join(root, "packages/cli/node_modules/tsup/package.json")))
const outfile = path.join(temp, "styles.cjs")
await require("esbuild").build({ entryPoints: [path.join(root, "packages/cli/src/utils/ensure-styles.ts")], bundle: true, format: "cjs", platform: "node", outfile })
const { ensureThemeCSS } = require(outfile)
const www = path.join(root, "apps/www")
const appRequire = createRequire(path.join(www, "package.json"))
const tailwindRequire = createRequire(await fs.realpath(appRequire.resolve("@tailwindcss/postcss")))
const output = process.env.GRID_REGRESSION_BUILD_DIR ?? temp
await fs.mkdir(output, { recursive: true })
const results = []
for (const existing of [true, false]) {
 const name = existing ? "merged" : "clean", globalCss = path.join(temp, name + ".css")
 const original = '@import "tailwindcss";\n:root { --background: #ffffff; --foreground: #111111; }\nh1 {font-size:3.2em;line-height:1.1}\n'
 if (existing) { await fs.writeFile(globalCss, original); await ensureThemeCSS({ globalCss, tailwind: true }, { silent: true }); const preserved = await fs.readFile(globalCss, "utf8"); assert.ok(preserved.includes('--background: #ffffff')); assert.ok(preserved.includes('h1 {font-size:3.2em;line-height:1.1}')) }
 await ensureThemeCSS({ globalCss, tailwind: true }, { silent: true, color: "iris", radius: "lg" })
 const css = await fs.readFile(globalCss, "utf8")
 assert.match(css, /\n\.dark \{[^}]*--background: #101011/s)
 assert.equal(await ensureThemeCSS({ globalCss, tailwind: true }, { silent: true, color: "iris", radius: "lg" }), false)
 const compiled = await tailwindRequire("postcss")([appRequire("@tailwindcss/postcss")({ base: www })]).process(css, { from: path.join(www, "styles/css-regression.css") })
 await fs.writeFile(path.join(output, `theme-${name}.css`), compiled.css)
 await fs.writeFile(path.join(output, `theme-${name}.html`), `<!doctype html><html lang="en" class="dark"><head><meta charset="utf-8"><title>Theme regression</title><link rel="stylesheet" href="/theme-${name}.css"></head><body><main><h1>Consumer heading</h1></main></body></html>`)
 results.push({ name, passed: true, idempotent: true, customCssPreserved: existing })
}
if (process.env.EVIDENCE_DIR) { await fs.mkdir(process.env.EVIDENCE_DIR, { recursive: true }); await fs.writeFile(path.join(process.env.EVIDENCE_DIR, "css-regressions.json"), JSON.stringify({ results }, null, 2)) }
console.log("PASS Vite CSS merge: layered foundation, explicit unlayered palette, custom CSS preservation, clean CSS, idempotence")
