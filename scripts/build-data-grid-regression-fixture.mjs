import fs from "node:fs/promises"
import path from "node:path"
import os from "node:os"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const www = path.join(root, "apps/www")
const output = process.env.GRID_REGRESSION_BUILD_DIR ?? await fs.mkdtemp(path.join(os.tmpdir(), "grid-regression-browser-"))
await fs.mkdir(output, { recursive: true })
const require = createRequire(await fs.realpath(path.join(root, "packages/cli/node_modules/tsup/package.json")))
await require("esbuild").build({
  stdin: { contents: `import { StrictMode } from 'react'; import { createRoot } from 'react-dom/client'; import App from ${JSON.stringify(path.join(root, "scripts/fixtures/data-grid-regressions.tsx"))}; createRoot(document.getElementById('root')).render(<StrictMode><App/></StrictMode>);`, loader: "tsx", resolveDir: www },
  bundle: true, format: "esm", platform: "browser", jsx: "automatic", tsconfig: path.join(www, "tsconfig.json"),
  nodePaths: [path.join(www, "node_modules")], loader: { ".css": "empty" },
  define: { "process.env.NODE_ENV": JSON.stringify(process.env.GRID_REACT_MODE ?? "production") }, outfile: path.join(output, "app.js"),
})
const appRequire = createRequire(path.join(www, "package.json"))
const tailwindRequire = createRequire(await fs.realpath(appRequire.resolve("@tailwindcss/postcss")))
const componentImports = (await fs.readdir(path.join(www, "styles"))).filter(name => name.endsWith(".styles.css")).map(name => `@import "./${name}";`).join("\n")
const css = (await fs.readFile(path.join(www, "styles/globals.css"), "utf8")).replace('@import "tailwindcss";', `@import "tailwindcss";\n${componentImports}`)
const result = await tailwindRequire("postcss")([appRequire("@tailwindcss/postcss")({ base: www })]).process(css + `\n@source "../../../scripts/fixtures";`, { from: path.join(www, "styles/globals.css") })
await fs.writeFile(path.join(output, "app.css"), result.css)
await fs.writeFile(path.join(output, "index.html"), '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Grid regression fixture</title><link rel="stylesheet" href="/app.css"></head><body><div id="root"></div><script type="module" src="/app.js"></script></body></html>')
console.log(output)
