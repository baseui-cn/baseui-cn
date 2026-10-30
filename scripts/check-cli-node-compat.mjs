// Run with real Node 18. Package installation is a tripwire/stub in these atomicity
// fixtures; separate real pnpm consumers validate installation on Node 18 and 20.
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import os from "node:os"
import { createHash } from "node:crypto"
import { createRequire } from "node:module"
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"

assert.equal(Number(process.versions.node.split(".")[0]), 18, "Run this suite with Node 18")
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const entry = await fs.realpath(path.resolve(process.env.BASEUI_CLI_ENTRY ?? path.join(repo, "packages/cli/dist/index.js")))
const require = createRequire(entry)
const promptsPath = require.resolve("prompts")
const registry = path.resolve(path.dirname(entry), "../registry")
const temp = await fs.mkdtemp(path.join(os.tmpdir(), "baseui-cli-node18-"))
const preload = path.join(temp, "preload.cjs")
await fs.writeFile(preload, `
const fs = require("node:fs/promises");
const path = require("node:path");
require(${JSON.stringify(promptsPath)}).inject(JSON.parse(process.env.NODE_COMPAT_ANSWERS || "[]"));
global.fetch = async (url) => {
  const name = new URL(String(url)).pathname.split("/").pop();
  if (name === "grid-wrapper.json") return new Response(JSON.stringify({ registryDependencies: ["data-grid"] }));
  const text = await fs.readFile(path.join(${JSON.stringify(registry)}, name), "utf8");
  if (name === "index.json" && process.env.NODE_COMPAT_CATALOG === "normal-only") {
    const index = JSON.parse(text);
    index.components = index.components.filter((component) => ["button", "dialog"].includes(component.name));
    return new Response(JSON.stringify(index));
  }
  return new Response(text);
};
`)
let count = 0
const results = []
function pass(name) { count++; results.push(name); console.log(`PASS ${name}`) }
async function fixture(name, initialized = true) {
  const dir = path.join(temp, name)
  await fs.mkdir(path.join(dir, "bin"), { recursive: true })
  await fs.writeFile(path.join(dir, "package.json"), JSON.stringify({ name, private: true, packageManager: "pnpm@9.0.0", dependencies: { react: "^18" } }))
  await fs.writeFile(path.join(dir, "pnpm-lock.yaml"), "# Consumer lock sentinel\n")
  // A rejected operation must never invoke this executable or create its log.
  for (const pm of ["npm", "pnpm"])
    await fs.writeFile(path.join(dir, "bin", pm), '#!/bin/sh\nprintf called >> package-install-called\nexit 0\n', { mode: 0o755 })
  if (initialized) {
    await fs.writeFile(path.join(dir, "baseui-cn.json"), JSON.stringify({ componentsPath: "components/ui", utilsPath: "lib/utils", globalCss: "globals.css", tailwind: true, rsc: false }))
    for (const file of ["globals.css", "styles/data.styles.css", "components/data-grid/data-grid.tsx", "components/ui/button.tsx", "types/data-grid-filter.ts"] ) {
      await fs.mkdir(path.dirname(path.join(dir, file)), { recursive: true })
      await fs.writeFile(path.join(dir, file), `/* Consumer-owned ${file}. */\n`)
    }
  }
  return dir
}
function run(dir, args, { answers = [], catalog } = {}) {
  return spawnSync(process.execPath, ["--require", preload, entry, ...args], {
    cwd: dir, encoding: "utf8", timeout: 15000,
    env: { ...process.env, PATH: path.join(dir, "bin") + path.delimiter + process.env.PATH,
      NODE_COMPAT_ANSWERS: JSON.stringify(answers), NODE_COMPAT_CATALOG: catalog ?? "full" },
  })
}
async function snapshot(dir) {
  const files = {}
  async function visit(folder, relative = "") {
    for (const item of await fs.readdir(folder, { withFileTypes: true })) {
      const name = path.posix.join(relative, item.name)
      if (item.isDirectory()) { files[name + "/"] = "directory"; await visit(path.join(folder, item.name), name) }
      else files[name] = createHash("sha256").update(await fs.readFile(path.join(folder, item.name))).digest("hex")
    }
  }
  await visit(dir)
  return files
}

const normal = await fixture("normal", false)
let result = run(normal, ["--version"])
assert.equal(result.status, 0, result.stderr); assert.match(result.stdout, /1\.4\.0/); pass("Node 18 CLI starts")
result = run(normal, ["create", "--help"])
assert.equal(result.status, 0, result.stderr); assert.match(result.stdout, /--framework/); pass("Node 18 create command remains available; upstream requirements unchanged")
result = run(normal, ["list", "--json"])
assert.equal(result.status, 0, result.stderr); assert.match(result.stdout, /data-grid/); pass("Node 18 list includes Grid metadata without blocking")
result = run(normal, ["init", "-y", "--css", "globals.css"])
assert.equal(result.status, 0, result.stderr); await fs.access(path.join(normal, "baseui-cn.json")); pass("Node 18 init remains available")
result = run(normal, ["add", "button", "dialog", "-y"])
assert.equal(result.status, 0, result.stderr)
await fs.access(path.join(normal, "components/ui/button.tsx")); await fs.access(path.join(normal, "components/ui/dialog.tsx")); pass("Node 18 non-Grid add remains available")
result = run(normal, ["update", "button", "-y"])
assert.equal(result.status, 0, result.stderr); pass("Node 18 unrelated update remains available")

const cases = [
  ["fresh-add", false, ["add", "data-grid", "-y"]],
  ["fresh-update", false, ["update", "data-grid", "-y"]],
  ["add-overrides", true, ["add", "data-grid", "-y", "--overwrite", "--css", "alternate.css", "--path", "new/components/ui"]],
  ["update-overrides", true, ["update", "data-grid", "-y", "--css", "alternate.css"]],
  ["mixed-add", true, ["add", "button", "data-grid", "dialog", "-y"]],
  ["add-all", true, ["add", "--all", "-y", "--css", "alternate.css"]],
  ["update-all", true, ["update", "--all", "-y", "--css", "alternate.css"]],
  ["fresh-all", false, ["add", "--all", "-y"]],
  ["interactive-add", false, ["add"], { answers: [["data-grid"]] }],
  ["interactive-update", false, ["update"], { answers: [["data-grid"]] }],
  ["transitive-grid", false, ["add", "grid-wrapper", "-y"]],
]
for (const [name, initialized, args, options] of cases) {
  const dir = await fixture(name, initialized)
  const before = await snapshot(dir)
  const rejected = run(dir, args, options)
  assert.equal(rejected.status, 1, `${name}: ${rejected.stderr}`)
  assert.match(rejected.stderr, /Data Grid requires Node\.js 20 or newer because it uses TanStack Table v9/)
  assert.ok(rejected.stderr.includes(`Current Node.js: ${process.version}`), rejected.stderr)
  assert.ok(rejected.stderr.includes(`baseui-cn ${args[0]} data-grid`), rejected.stderr)
  assert.deepEqual(await snapshot(dir), before, `${name}: no source, styles, config, manifest, lock, registry-owned paths, new directories or install calls`)
  pass(`${name}: actionable rejection and complete tree unchanged`)
}
const workspace = await fixture("workspace-root", false)
await fs.writeFile(path.join(workspace, "package.json"), JSON.stringify({ private: true, workspaces: ["apps/*"] }))
const web = path.join(workspace, "apps/web")
await fs.mkdir(web, { recursive: true })
await fs.writeFile(path.join(web, "package.json"), JSON.stringify({ dependencies: { react: "18", vite: "5" } }))
const beforeWorkspace = await snapshot(workspace)
result = run(workspace, ["add", "data-grid", "--workspace", "apps/web", "-y"])
assert.equal(result.status, 1, result.stderr); assert.match(result.stderr, /Data Grid requires Node\.js 20/)
assert.deepEqual(await snapshot(workspace), beforeWorkspace); pass("workspace Grid rejection leaves root and application unchanged")

const subset = await fixture("all-without-grid", false)
result = run(subset, ["init", "-y", "--css", "globals.css"]); assert.equal(result.status, 0, result.stderr)
for (const command of ["add", "update"]) {
  result = run(subset, [command, "--all", "-y"], { catalog: "normal-only" })
  assert.equal(result.status, 0, result.stderr); pass(`${command} --all is allowed when the actual catalog excludes Grid`)
}
await fs.writeFile(path.join(temp, "results.json"), JSON.stringify({ node: process.version, entry, passed: count, results }, null, 2))
console.log(`${count}/${count} Node 18 compatibility cases passed; fixtures: ${temp}`)
