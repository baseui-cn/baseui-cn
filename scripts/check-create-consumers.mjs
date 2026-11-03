// Opt-in network acceptance: actual generated commands, a packed local candidate,
// real runners/scaffolders/installers/builds. Never publishes or rewrites commands.
// Put Yarn 2+ and Bun on PATH. Evidence/consumers remain outside the checkout.
import assert from "node:assert/strict"
import { mountConsumerSample, inspectConsumer } from "./consumer-appearance.mjs"
import fs from "node:fs/promises"
import path from "node:path"
import os from "node:os"
import http from "node:http"
import https from "node:https"
import crypto from "node:crypto"
import { spawn } from "node:child_process"
import { createRequire } from "node:module"
const repo = path.resolve(import.meta.dirname, "..")
const evidence =
  process.env.CREATE_EVIDENCE ??
  (await fs.mkdtemp(path.join(os.tmpdir(), "baseui-create-consumers-")))
await fs.mkdir(evidence, { recursive: true })
const cliRequire = createRequire(path.join(repo, "packages/cli/package.json"))
const { build } = createRequire(cliRequire.resolve("tsup"))("esbuild")
async function bundle(source, name) {
  const outfile = path.join(evidence, name + ".cjs")
  await build({
    entryPoints: [path.join(repo, source)],
    outfile,
    bundle: true,
    platform: "node",
    format: "cjs",
    logLevel: "silent",
  })
  return createRequire(import.meta.url)(outfile)
}
const { setupCommand } = await bundle("apps/www/lib/setup-command.ts", "setup")
const { scaffoldCommand, configureScaffold } = await bundle(
  "packages/cli/src/commands/create.ts",
  "create"
)
const { themePresets } = await bundle("packages/cli/src/utils/theme.generated.ts", "theme")
const { typography } = await bundle("packages/cli/src/utils/typography.generated.ts", "typography")
const baseEnv = { ...process.env, CI: "1", npm_config_yes: "true", NEXT_TELEMETRY_DISABLED: "1" }
async function run(command, args, cwd, log, env = baseEnv) {
  await fs.mkdir(path.dirname(log), { recursive: true })
  const output = await fs.open(log, "a")
  await output.write(`\n$ ${[command, ...args].join(" ")}\n`)
  try {
    await new Promise((resolve, reject) => {
      const child = spawn(command, args, { cwd, env, stdio: ["ignore", output.fd, output.fd] })
      const timer = setTimeout(() => {
        child.kill("SIGTERM")
        reject(new Error(`Timed out: ${log}`))
      }, 15 * 60_000)
      child.on("error", (e) => {
        clearTimeout(timer)
        reject(e)
      })
      child.on("exit", (code) => {
        clearTimeout(timer)
        code === 0 ? resolve() : reject(new Error(`Exit ${code}: ${log}`))
      })
    })
  } finally {
    await output.close()
  }
}
await run(
  "npm",
  ["pack", "--pack-destination", evidence, "--silent"],
  path.join(repo, "packages/cli"),
  path.join(evidence, "pack.log")
)
const manifest = JSON.parse(await fs.readFile(path.join(repo, "packages/cli/package.json"), "utf8"))
const tarball = await fs.readFile(path.join(evidence, `baseui-cn-${manifest.version}.tgz`))
const registryRequests = []
let registryOrigin
const registry = http.createServer((req, res) => {
  if (req.url === "/baseui-cn/-/candidate.tgz") {
    registryRequests.push(req.url)
    res.setHeader("Content-Type", "application/octet-stream")
    res.end(tarball)
    return
  }
  if (req.url === "/baseui-cn" || req.url === "/baseui-cn/latest") {
    registryRequests.push(req.url)
    const version = {
      ...manifest,
      dist: {
        tarball: registryOrigin + "/baseui-cn/-/candidate.tgz",
        shasum: crypto.createHash("sha1").update(tarball).digest("hex"),
        integrity: "sha512-" + crypto.createHash("sha512").update(tarball).digest("base64"),
      },
    }
    res.setHeader("Content-Type", "application/json")
    res.end(
      JSON.stringify(
        req.url.endsWith("/latest")
          ? version
          : {
              name: manifest.name,
              "dist-tags": { latest: manifest.version },
              versions: { [manifest.version]: version },
              time: { [manifest.version]: new Date(Date.now() - 7 * 86400_000).toISOString() },
            }
      )
    )
    return
  }
  const upstream = https.request(
    "https://registry.npmjs.org" + req.url,
    { method: req.method, headers: { accept: req.headers.accept ?? "*/*" } },
    (response) => {
      res.writeHead(response.statusCode, response.headers)
      response.pipe(res)
    }
  )
  upstream.on("error", (e) => {
    res.statusCode = 502
    res.end(e.message)
  })
  req.pipe(upstream)
})
await new Promise((resolve) => registry.listen(0, "127.0.0.1", resolve))
registryOrigin = `http://127.0.0.1:${registry.address().port}`
const candidateDistSha256 = crypto
  .createHash("sha256")
  .update(await fs.readFile(path.join(repo, "packages/cli/dist/index.js")))
  .digest("hex")
const attestation = path.join(evidence, "attest-candidate.cjs")
const receiptFile = path.join(evidence, "candidate-receipts.jsonl")
await fs.writeFile(
  attestation,
  `const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
if(process.argv[1]){let file;try{file=fs.realpathSync(process.argv[1])}catch{}if(file&&path.basename(path.dirname(file))==="dist"){const manifest=path.join(path.dirname(file),"../package.json");if(fs.existsSync(manifest)&&JSON.parse(fs.readFileSync(manifest)).name==="baseui-cn"){const sha=crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");if(sha!==${JSON.stringify(candidateDistSha256)})throw Error("Stale candidate CLI: "+file);fs.appendFileSync(${JSON.stringify(receiptFile)},JSON.stringify({file,sha,args:process.argv.slice(2)})+"\\n")}}}
`
)
await fs.mkdir(path.join(evidence, "tmp"), { recursive: true })
const env = {
  ...baseEnv,
  NODE_OPTIONS: `${process.env.NODE_OPTIONS ?? ""} --require=${JSON.stringify(attestation)}`,
  BUN_INSTALL_CACHE_DIR: path.join(evidence, "bun-cache"),
  TMPDIR: path.join(evidence, "tmp"),
  npm_config_registry: registryOrigin,
  NPM_CONFIG_REGISTRY: registryOrigin,
  npm_config_cache: path.join(evidence, "npm-cache"),
  YARN_NPM_REGISTRY_SERVER: registryOrigin,
  YARN_UNSAFE_HTTP_WHITELIST: "127.0.0.1",
  YARN_ENABLE_IMMUTABLE_INSTALLS: "false",
  YARN_ENABLE_TELEMETRY: "0",
  BUN_CONFIG_NO_CLEAR_TERMINAL: "1",
}
const matrix = [
  {
    id: "next-pnpm-single",
    framework: "next",
    packageManager: "pnpm",
    bodyFont: "inter",
    headingFont: "space-grotesk",
  },
  {
    id: "next-npm-single",
    framework: "next",
    packageManager: "npm",
    bodyFont: "geist",
    headingFont: "manrope",
  },
  {
    id: "start-pnpm-single",
    framework: "tanstack-start",
    packageManager: "pnpm",
    bodyFont: "roboto",
    headingFont: "montserrat",
  },
  {
    id: "router-yarn-single",
    framework: "react-router",
    packageManager: "yarn",
    bodyFont: "manrope",
    headingFont: "poppins",
  },
  {
    id: "vite-bun-single",
    framework: "vite",
    packageManager: "bun",
    bodyFont: "system",
    headingFont: "inter",
  },
  {
    id: "vite-pnpm-monorepo",
    framework: "vite",
    packageManager: "pnpm",
    structure: "monorepo",
    bodyFont: "inter",
    headingFont: "inter",
  },
  {
    id: "next-npm-existing",
    framework: "next",
    packageManager: "npm",
    projectMode: "existing",
    bodyFont: "system",
    headingFont: "system",
  },
  {
    id: "next-npm-existing-monorepo",
    framework: "next",
    packageManager: "npm",
    projectMode: "existing",
    structure: "monorepo",
    bodyFont: "inter",
    headingFont: "space-grotesk",
  },
]
const results = []
try {
  for (const item of matrix) {
    if (process.env.CREATE_CASE && !item.id.includes(process.env.CREATE_CASE)) continue
    const input = {
      projectMode: "new",
      structure: "single",
      projectName: item.id,
      workspace: "apps/web",
      color: "emerald",
      radius: "xl",
      ...item,
    }
    const cwd = path.join(evidence, item.id + "-parent")
    await fs.mkdir(cwd, { recursive: true })
    // Bun reads the same local registry through its project-level config.
    await fs.writeFile(path.join(cwd, "bunfig.toml"), `[install]\nregistry = "${registryOrigin}"\n`)
    const log = path.join(evidence, item.id + ".log")
    const root = input.projectMode === "new" ? path.join(cwd, input.projectName) : cwd
    const app = input.structure === "monorepo" ? path.join(root, "apps/web") : root
    const result = {
      id: item.id,
      input,
      // Qualify unpublished CLI capability explicitly; the public site must omit these flags.
      siteCommand: setupCommand({ ...input, bodyFont: undefined, headingFont: undefined }).primary,
      command:
        setupCommand({ ...input, bodyFont: undefined, headingFont: undefined }).primary +
        ` --body-font ${input.bodyFont} --heading-font ${input.headingFont}`,
      root,
      app,
      log,
      passed: false,
    }
    results.push(result)
    console.log("RUN", result.id, result.command)
    try {
      if (input.projectMode === "existing") {
        const scaffoldParent = input.structure === "monorepo" ? path.join(cwd, "apps") : cwd
        await fs.mkdir(scaffoldParent, { recursive: true })
        const scaffold = scaffoldCommand(
          { framework: input.framework, packageManager: input.packageManager },
          "web"
        )
        await run(scaffold.command, scaffold.args, scaffoldParent, log, env)
        if (input.structure === "single") {
          for (const file of await fs.readdir(path.join(cwd, "web")))
            await fs.rename(path.join(cwd, "web", file), path.join(cwd, file))
        } else
          await fs.writeFile(
            path.join(cwd, "package.json"),
            JSON.stringify({ name: item.id, private: true, workspaces: ["apps/*"] })
          )
        await configureScaffold(app, input.framework)
        await run(input.packageManager, ["install"], cwd, log, env)
      }
      // Execute the EXACT website command in a real shell. Only the registry
      // resolves baseui-cn@latest to this unmodified local candidate tarball.
      await run("/bin/sh", ["-c", result.command], cwd, log, env)
      const config = JSON.parse(await fs.readFile(path.join(app, "baseui-cn.json"), "utf8"))
      const cssPath = path.join(app, config.globalCss)
      const css = await fs.readFile(cssPath, "utf8")
      const appManifest = JSON.parse(await fs.readFile(path.join(app, "package.json"), "utf8"))
      for (const mode of ["light", "dark"])
        for (const [key, value] of Object.entries(themePresets.colors[input.color][mode]))
          assert.ok(css.includes(`${key}: ${value};`), `${mode} ${key}`)
      assert.ok(css.includes(`--radius: ${themePresets.radii[input.radius].value}`))
      for (const [dimension, id] of [
        ["body", input.bodyFont],
        ["heading", input.headingFont],
      ]) {
        const font = typography.fonts[id]
        assert.ok(css.includes(`--font-${dimension}: ${font.family};`))
        if (font.package) assert.equal(appManifest.dependencies[font.package], font.version)
        for (const entry of font.imports)
          assert.equal(css.split(`@import "${entry}";`).length - 1, 1)
      }
      assert.ok(css.includes("body { font-family: var(--font-body); }"))
      assert.ok(css.includes("font-family: var(--font-heading)"))
      if (input.structure === "monorepo") {
        const rootManifest = JSON.parse(await fs.readFile(path.join(root, "package.json"), "utf8"))
        assert.deepEqual(rootManifest.workspaces, ["apps/*"])
        assert.equal(rootManifest.dependencies, undefined)
        await assert.rejects(fs.access(path.join(root, "baseui-cn.json")))
      }
      await mountConsumerSample(result)
      await run(input.packageManager, ["run", "build"], app, log, env)
      result.rendered = await inspectConsumer(result, typography, themePresets, evidence, env)
      // Reinit with no appearance flags must preserve the selected/custom setup.
      await fs.appendFile(
        cssPath,
        '\n/* Consumer typography */\n.custom-font { font-family: "Custom Font", serif; }\n'
      )
      const customized = await fs.readFile(cssPath, "utf8")
      const preserve = setupCommand({
        ...input,
        projectMode: "existing",
        workspace: input.structure === "monorepo" ? "apps/web" : "",
        color: undefined,
        radius: undefined,
        bodyFont: undefined,
        headingFont: undefined,
      }).primary
      await run("/bin/sh", ["-c", preserve], root, log, env)
      assert.equal(await fs.readFile(cssPath, "utf8"), customized)
      result.preserveCommand = preserve
      result.cssPath = cssPath
      result.cssSha256 = crypto.createHash("sha256").update(css).digest("hex")
      result.fontDependencies = Object.fromEntries(
        Object.entries(appManifest.dependencies ?? {}).filter(([name]) =>
          name.startsWith("@fontsource")
        )
      )
      result.passed = true
      console.log("PASS", item.id)
    } catch (error) {
      result.error = error.message
      console.log("FAIL", item.id, error.message)
    }
    await fs.writeFile(
      path.join(evidence, "results.json"),
      JSON.stringify(
        {
          registryOrigin,
          candidateSha256: crypto.createHash("sha256").update(tarball).digest("hex"),
          registryRequests,
          results,
        },
        null,
        2
      )
    )
  }
  assert.ok(results.length > 0)
  assert.ok(
    registryRequests.includes("/baseui-cn/-/candidate.tgz"),
    "Actual candidate tarball was fetched by a runner"
  )
  assert.ok(
    results.every((r) => r.passed),
    "Every real consumer must pass; inspect retained logs"
  )
} finally {
  registry.closeAllConnections()
  registry.close()
}
console.log("Real consumer evidence:", evidence)
