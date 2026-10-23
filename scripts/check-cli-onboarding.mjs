// Deterministic onboarding coverage. Actual official scaffold consumers are
// separately recorded in docs/landing-cli-onboarding-report.md.
import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import os from "node:os"
import { createRequire } from "node:module"
import { execFileSync, spawnSync } from "node:child_process"
import ts from "typescript"
const repo = path.resolve(import.meta.dirname, "..")
const dir = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), "baseui-onboarding-")))
const compiled = path.join(dir, "compiled")
async function transpile(source, destination) {
  await fs.mkdir(destination, { recursive: true })
  for (const e of await fs.readdir(source, { withFileTypes: true })) {
    if (e.isDirectory()) await transpile(path.join(source, e.name), path.join(destination, e.name))
    else if (e.name.endsWith(".ts"))
      await fs.writeFile(
        path.join(destination, e.name.replace(/\.ts$/, ".js")),
        ts.transpileModule(await fs.readFile(path.join(source, e.name), "utf8"), {
          compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES2022,
            esModuleInterop: true,
          },
        }).outputText
      )
  }
}
await transpile(path.join(repo, "packages/cli/src"), compiled)
await fs.symlink(path.join(repo, "packages/cli/node_modules"), path.join(compiled, "node_modules"))
const require = createRequire(import.meta.url)
const project = require(path.join(compiled, "utils/project.js"))
const pm = require(path.join(compiled, "utils/package-manager.js"))
const creator = require(path.join(compiled, "commands/create.js"))
await fs.writeFile(
  path.join(compiled, "setup.js"),
  ts.transpileModule(await fs.readFile(path.join(repo, "apps/www/lib/setup-command.ts"), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText
)
await fs.writeFile(
  path.join(compiled, "theme-presets.js"),
  ts.transpileModule(await fs.readFile(path.join(repo, "apps/www/lib/theme-presets.ts"), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText
)
await fs.mkdir(path.join(compiled, "__generated__"), { recursive: true })
await fs.copyFile(
  path.join(repo, "apps/www/lib/__generated__/theme.json"),
  path.join(compiled, "__generated__/theme.json")
)
const setup = require(path.join(compiled, "setup.js"))
let count = 0
async function check(name, run) {
  await test(name, run)
  count++
}
async function fixture(name, manifest = {}) {
  const p = path.join(dir, name)
  await fs.mkdir(p, { recursive: true })
  await fs.writeFile(path.join(p, "package.json"), JSON.stringify(manifest))
  return p
}
for (const [framework, deps] of Object.entries({
  next: { next: "16", react: "19", vite: "7" },
  "tanstack-start": { "@tanstack/react-start": "1", vite: "7", react: "19" },
  "react-router": { "@react-router/dev": "7", react: "19", vite: "7" },
  vite: { vite: "7", react: "19" },
  react: { react: "19" },
  unknown: {},
})) {
  await check(`framework ${framework}`, async () =>
    assert.equal(
      await project.detectFramework(
        await fixture(`framework-${framework}`, { dependencies: deps })
      ),
      framework
    )
  )
}
for (const [manager, file] of [
  ["npm", "package-lock.json"],
  ["pnpm", "pnpm-lock.yaml"],
  ["yarn", "yarn.lock"],
  ["bun", "bun.lock"],
  ["bun", "bun.lockb"],
]) {
  await check(`lockfile ${file}`, async () => {
    const p = await fixture(`lock-${file}`)
    await fs.writeFile(path.join(p, file), "")
    assert.equal(await pm.detectPackageManager(p), manager)
  })
}
for (const manager of pm.packageManagers)
  await check(`packageManager field ${manager} inherited from root`, async () => {
    const p = await fixture(`declared-${manager}`, { packageManager: `${manager}@10.0.0` })
    const app = await fixture(`declared-${manager}/apps/web`, { dependencies: { react: "19" } })
    assert.equal(await pm.detectPackageManager(app), manager)
  })
await check("pnpm workspace without a lockfile", async () => {
  const p = await fixture("pnpm-no-lock")
  await fs.writeFile(
    path.join(p, "pnpm-workspace.yaml"),
    'packages:\n  - "apps/*"\ncatalogs:\n  unused:\n    - "packages/*"\n'
  )
  assert.deepEqual(await project.workspacePatterns(p), ["apps/*"])
  assert.equal(await pm.detectPackageManager(p), "pnpm")
})
for (const manager of pm.packageManagers)
  await check(
    `${manager} workspace: candidates, root safety, selection, invalid target`,
    async () => {
      const p = await fixture(`workspace-${manager}`, {
        private: true,
        workspaces:
          manager === "yarn" ? { packages: ["apps/*", "packages/*"] } : ["apps/*", "packages/*"],
        packageManager: `${manager}@10.0.0`,
      })
      if (manager === "pnpm")
        await fs.writeFile(
          path.join(p, "pnpm-workspace.yaml"),
          'packages:\n  - "apps/*"\n  - "packages/*"\n'
        )
      const app = await fixture(`workspace-${manager}/apps/web`, {
        dependencies: { "@tanstack/react-start": "1", react: "19" },
      })
      await fixture(`workspace-${manager}/packages/ui`, { dependencies: { react: "19" } })
      assert.equal(await project.findWorkspaceRoot(app), p)
      assert.deepEqual(await project.applicationWorkspaces(p), ["apps/web"])
      assert.equal(await project.resolveProjectTarget({ yes: true }, p), app)
      await fixture(`workspace-${manager}/apps/admin`, {
        dependencies: { next: "16", react: "19" },
      })
      await assert.rejects(project.resolveProjectTarget({ yes: true }, p), /Multiple application/)
      assert.equal(await project.resolveProjectTarget({ workspace: "apps/web" }, p), app)
      assert.equal(await project.resolveProjectTarget({ yes: true }, app), app)
      for (const invalid of [".", "../escape", "packages/ui", "apps/missing"])
        await assert.rejects(
          project.resolveProjectTarget({ workspace: invalid }, p),
          /Invalid application/
        )
    }
  )
await check("empty workspace root never receives files", async () => {
  const p = await fixture("empty-workspace", { workspaces: ["apps/*"] })
  await assert.rejects(
    project.resolveProjectTarget({ yes: true }, p),
    /repository-root installation was skipped/
  )
})
await check("negative workspace patterns and dotfiles", async () => {
  const p = await fixture("negative", { workspaces: ["apps/*", "!apps/private"] })
  await fixture("negative/apps/web", { dependencies: { vite: "7", react: "19" } })
  await fixture("negative/apps/private", { dependencies: { next: "16" } })
  assert.deepEqual(await project.applicationWorkspaces(p), ["apps/web"])
})
for (const framework of ["next", "tanstack-start", "react-router", "vite"])
  for (const manager of pm.packageManagers)
    await check(`official scaffold command ${framework}/${manager}`, () => {
      const command = creator.scaffoldCommand(
        { framework, packageManager: manager, name: "my-app", monorepo: false },
        "my-app"
      )
      assert.equal(
        command.command,
        manager === "npm" ? "npx" : manager === "bun" ? "bunx" : manager
      )
      assert.ok(command.args.includes("my-app"))
      assert.ok(command.args.some((a) => a.endsWith("@latest")))
      if (framework !== "vite")
        assert.ok(command.args.includes(framework === "next" ? `--use-${manager}` : manager))
      const input = {
        framework,
        packageManager: manager,
        projectMode: "new",
        structure: "single",
        projectName: "my-app",
        workspace: "",
      }
      const output = setup.setupCommand(input)
      assert.ok(!output.error)
      assert.ok(output.primary.includes(`--framework ${framework}`))
      assert.ok(output.primary.includes(`--package-manager ${manager}`))
    })
await check("project name rejects traversal, options and shell syntax", () => {
  for (const name of [
    "../app",
    ".",
    "/tmp/app",
    "--bad",
    "My App",
    "app;id",
    "$(id)",
    "node_modules",
    "a".repeat(101),
  ])
    assert.notEqual(creator.validateProjectName(name), true)
  assert.equal(creator.validateProjectName("my-app-2"), true)
})
await check("unsupported inputs rejected before scaffold", async () => {
  await assert.rejects(
    creator.resolveCreatePlan("my-app", { framework: "angular" }),
    /Unsupported framework/
  )
  await assert.rejects(
    creator.resolveCreatePlan("my-app", { packageManager: "deno" }),
    /Unsupported package manager/
  )
  assert.throws(
    () => creator.scaffoldCommand({ framework: "react", packageManager: "npm" }, "app"),
    /Unsupported framework/
  )
})
await check("canceled create prompt has no side effects", async () => {
  const cwd = await fixture("cancel")
  await assert.rejects(
    creator.create(undefined, {}, { prompt: async (_q, options) => options.onCancel() }, cwd),
    /cancelled/
  )
  assert.deepEqual(await fs.readdir(cwd), ["package.json"])
})
await check("existing destination is preserved", async () => {
  const cwd = await fixture("exists")
  await fixture("exists/my-app", { private: true })
  await assert.rejects(
    creator.create(
      "my-app",
      { framework: "vite", packageManager: "npm", yes: true },
      { prompt: async () => ({}), run: () => assert.fail("must not run") },
      cwd
    ),
    /already exists/
  )
  assert.equal(JSON.parse(await fs.readFile(path.join(cwd, "my-app/package.json"))).private, true)
})
await check("failed upstream cannot initialize or report success", async () => {
  const cwd = await fixture("failed")
  let called = false
  await assert.rejects(
    creator.create(
      "my-app",
      { framework: "vite", packageManager: "npm", yes: true },
      {
        prompt: async () => ({}),
        run: async (cmd) => {
          if (cmd === "npx") throw Error("upstream failed")
        },
        initialize: async () => {
          called = true
        },
      },
      cwd
    ),
    /upstream failed/
  )
  assert.equal(called, false)
})
await check("unavailable manager stops before workspace creation", async () => {
  const cwd = await fixture("unavailable")
  await assert.rejects(
    creator.create(
      "my-app",
      { framework: "next", packageManager: "bun", monorepo: true, yes: true },
      {
        prompt: async () => ({}),
        run: async () => {
          throw Error("ENOENT")
        },
      },
      cwd
    ),
    /unavailable/
  )
  assert.equal((await fs.readdir(cwd)).includes("my-app"), false)
})
for (const monorepo of [false, true])
  await check(`successful create follows up init in app (monorepo ${monorepo})`, async () => {
    const cwd = await fixture(`success-${monorepo}`)
    const calls = []
    let initialized
    await creator.create(
      "my-app",
      { framework: "vite", packageManager: "npm", monorepo, yes: true },
      {
        prompt: async () => ({}),
        run: async (cmd, args, at) => {
          calls.push({ cmd, args, at })
          if (cmd === "npx") {
            const app = path.join(at, monorepo ? "web" : "my-app")
            await fs.mkdir(path.join(app, "src"), { recursive: true })
            await fs.writeFile(
              path.join(app, "package.json"),
              JSON.stringify({ dependencies: { vite: "7", react: "19" } })
            )
            await fs.writeFile(path.join(app, "tsconfig.json"), '{"compilerOptions":{}}')
            await fs.writeFile(path.join(app, "vite.config.ts"), "export default { plugins: [] }")
            await fs.writeFile(path.join(app, "src/index.css"), "body {}")
          }
        },
        initialize: async (at) => {
          initialized = at
        },
      },
      cwd
    )
    const app = path.join(cwd, "my-app", monorepo ? "apps/web" : "")
    assert.equal(initialized, app)
    assert.ok(
      calls.some(
        (c) => c.cmd === "npm" && c.args[0] === "install" && c.at === path.join(cwd, "my-app")
      )
    )
    assert.match(
      await fs.readFile(path.join(app, "vite.config.ts"), "utf8"),
      /tailwindcss\(\), tsconfigPaths\(\)/
    )
    if (monorepo)
      assert.deepEqual(
        JSON.parse(await fs.readFile(path.join(cwd, "my-app/package.json"))).workspaces,
        ["apps/*"]
      )
  })
await check("homepage existing flows omit ineffective framework and manager flags", () => {
  for (const manager of pm.packageManagers) {
    const out = setup.setupCommand({
      framework: "tanstack-start",
      packageManager: manager,
      projectMode: "existing",
      structure: "monorepo",
      projectName: "",
      workspace: "apps/web",
    })
    assert.equal(
      out.primary,
      `${setup.packageInvocation(manager)} baseui-cn@latest init --workspace apps/web`
    )
    assert.ok(out.followUp.endsWith("--workspace apps/web"))
  }
})
await check("homepage custom React new app and invalid names fail truthfully", () => {
  const input = {
    framework: "react",
    packageManager: "npm",
    projectMode: "new",
    structure: "single",
    projectName: "app",
    workspace: "",
  }
  assert.ok(setup.setupCommand(input).error)
  assert.ok(setup.setupCommand({ ...input, framework: "vite", projectName: "app;id" }).error)
  assert.ok(
    setup.setupCommand({
      ...input,
      projectMode: "existing",
      structure: "monorepo",
      workspace: "../x",
    }).error
  )
})
for (const manager of pm.packageManagers)
  await check(
    `built CLI existing monorepo ${manager}: correct dependency cwd, CSS, files and repeated init/add`,
    async () => {
      const root = await fixture(`consumer-${manager}`, {
        private: true,
        workspaces: ["apps/*"],
        packageManager: `${manager}@10.0.0`,
      })
      await fixture(`consumer-${manager}/apps/web`, {
        dependencies: { "@tanstack/react-start": "1", react: "19" },
      })
      await fs.mkdir(path.join(root, "apps/web/src"), { recursive: true })
      await fs.writeFile(path.join(root, "apps/web/src/styles.css"), "/* original */\n")
      const bin = path.join(root, "bin")
      await fs.mkdir(bin)
      await fs.writeFile(
        path.join(bin, manager),
        '#!/bin/sh\nprintf "%s\\n" "$PWD $*" >> "' + root + '/installs.log"\nexit 0\n',
        { mode: 0o755 }
      )
      const offline = path.join(root, "offline.cjs")
      await fs.writeFile(offline, 'global.fetch=async()=>{throw Error("bundled fixture")}')
      const cli = path.join(repo, "packages/cli/dist/index.js")
      const run = (args, cwd = root) =>
        execFileSync(process.execPath, ["--require", offline, cli, ...args], {
          cwd,
          env: { ...process.env, PATH: bin + path.delimiter + process.env.PATH },
          encoding: "utf8",
          stdio: ["ignore", "pipe", "pipe"],
        })
      run(["init", "-y"])
      run(["add", "button", "-y"])
      const css = path.join(root, "apps/web/src/styles.css")
      const source = path.join(root, "apps/web/src/components/ui/button.tsx")
      await fs.appendFile(source, "\n// custom source\n")
      await fs.appendFile(css, "\n:root { --primary: rebeccapurple; }\n")
      const original = await fs.readFile(source, "utf8"),
        theme = await fs.readFile(css, "utf8")
      run(["init", "--workspace", "apps/web", "-y"])
      run(["add", "button", "--workspace", "apps/web", "-y"])
      assert.equal(await fs.readFile(source, "utf8"), original)
      assert.equal(await fs.readFile(css, "utf8"), theme)
      assert.ok(
        (await fs.readFile(path.join(root, "installs.log"), "utf8"))
          .trim()
          .split("\n")
          .every((line) => line.startsWith(path.join(root, "apps/web") + " "))
      )
      for (const file of ["baseui-cn.json", "components", "src", "styles", "lib"])
        assert.equal(
          await fs.stat(path.join(root, file)).then(
            () => true,
            () => false
          ),
          false
        )
      await fixture(`consumer-${manager}/apps/admin`, { dependencies: { next: "16" } })
      const failed = spawnSync(process.execPath, [cli, "init", "-y"], {
        cwd: root,
        encoding: "utf8",
      })
      assert.notEqual(failed.status, 0)
      assert.match(failed.stderr, /Multiple application/)
    }
  )
console.log(`\n${count} onboarding tests. Fixtures retained: ${dir}`)

await check("Yarn Classic create is rejected with an actionable runner fallback", () => {
  assert.throws(() => creator.assertPackageManagerVersion("yarn", "1.22.22"), /Yarn 2\+/)
  assert.doesNotThrow(() => creator.assertPackageManagerVersion("yarn", "4.9.0"))
})
await check(
  "fresh scaffold retains strict TypeScript while matching registry unused-symbol policy",
  async () => {
    const app = await fixture("compiler-policy")
    await fs.mkdir(path.join(app, "src"))
    await fs.writeFile(
      path.join(app, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: {
          strict: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          paths: { "@/*": ["./src/*"] },
        },
      })
    )
    await creator.configureScaffold(app, "next")
    const config = JSON.parse(await fs.readFile(path.join(app, "tsconfig.json")))
    assert.equal(config.compilerOptions.strict, true)
    assert.equal(config.compilerOptions.noUnusedLocals, false)
    assert.equal(config.compilerOptions.noUnusedParameters, false)
  }
)

const themeOptions = require(path.join(compiled, "utils/theme-options.js"))
const generatedTheme = require(path.join(compiled, "utils/theme.generated.js"))
const { themePresets: presets } = generatedTheme
await check("theme defaults and explicit create selections reach follow-up init", async () => {
  const defaults = await creator.resolveCreatePlan("my-app", { yes: true }, async () => ({}))
  assert.equal(defaults.color, presets.defaultColor)
  assert.equal(defaults.radius, presets.defaultRadius)
  const selected = await creator.resolveCreatePlan(
    "my-app",
    { color: "emerald", radius: "xl", yes: true },
    async () => ({})
  )
  assert.equal(selected.color, "emerald")
  assert.equal(selected.radius, "xl")
  const cwd = await fixture("theme-follow-up")
  let theme
  await creator.create(
    "my-app",
    { framework: "next", packageManager: "npm", color: "rose", radius: "sm", yes: true },
    {
      prompt: async () => ({}),
      run: async (command, args, at) => {
        if (command === "npx") {
          await fs.mkdir(path.join(at, "my-app"), { recursive: true })
          await fs.writeFile(
            path.join(at, "my-app/package.json"),
            JSON.stringify({ dependencies: { next: "16", react: "19" } })
          )
        }
      },
      initialize: async (_at, selected) => {
        theme = selected
      },
    },
    cwd
  )
  assert.deepEqual(theme, { color: "rose", radius: "sm" })
})
await check(
  "interactive color/radius questions select new values or preserve existing values",
  async () => {
    const prompts = createRequire(path.join(repo, "packages/cli/package.json"))("prompts")
    const questions = themeOptions.themeQuestions({})
    assert.equal(questions[0].choices[questions[0].initial].value, presets.defaultColor)
    assert.equal(questions[1].choices[questions[1].initial].value, presets.defaultRadius)
    prompts.inject(["blue", "md"])
    assert.deepEqual(
      await themeOptions.chooseThemeOptions({}, { color: false, radius: false }, true),
      { color: "blue", radius: "md" }
    )
    prompts.inject(["keep", "keep"])
    assert.deepEqual(
      await themeOptions.chooseThemeOptions({}, { color: true, radius: true }, true),
      { color: undefined, radius: undefined }
    )
    assert.deepEqual(
      await themeOptions.chooseThemeOptions({}, { color: true, radius: true }, false),
      { color: undefined, radius: undefined }
    )
    const plan = await creator.resolveCreatePlan("my-app", {}, async () => ({
      framework: "tanstack-start",
      packageManager: "pnpm",
      color: "violet",
      radius: "xl",
    }))
    assert.equal(plan.color, "violet")
    assert.equal(plan.radius, "xl")
  }
)
await check("invalid theme flags fail before project/destination mutations", async () => {
  for (const options of [{ color: "invalid" }, { radius: "invalid" }, { color: "constructor" }]) {
    assert.throws(() => themeOptions.validateThemeOptions(options), /Invalid/)
    await assert.rejects(
      creator.resolveCreatePlan("my-app", options, async () =>
        assert.fail("no prompt on invalid flags")
      ),
      /Invalid/
    )
  }
})
await check("all framework/runner/color/radius commands exactly use supported CLI syntax", () => {
  for (const framework of ["next", "tanstack-start", "react-router", "vite"])
    for (const manager of pm.packageManagers)
      for (const color of Object.keys(presets.colors))
        for (const radius of Object.keys(presets.radii)) {
          const input = {
            framework,
            packageManager: manager,
            color,
            radius,
            projectMode: "new",
            structure: "single",
            projectName: "my-app",
            workspace: "",
          }
          assert.equal(
            setup.setupCommand(input).primary,
            `${setup.packageInvocation(manager)} baseui-cn@latest create my-app --framework ${framework} --package-manager ${manager} --color ${color} --radius ${radius}`
          )
          assert.equal(
            setup.setupCommand({ ...input, projectMode: "existing" }).primary,
            `${setup.packageInvocation(manager)} baseui-cn@latest init --color ${color} --radius ${radius}`
          )
        }
  const old = {
    framework: "next",
    packageManager: "npm",
    projectMode: "existing",
    structure: "single",
    projectName: "",
    workspace: "",
  }
  assert.equal(setup.setupCommand(old).primary, "npx baseui-cn@latest init")
  assert.ok(setup.setupCommand({ ...old, color: "bad" }).error)
  assert.ok(setup.setupCommand({ ...old, radius: "bad" }).error)
  assert.ok(setup.setupCommand({ ...old, color: "" }).error)
  assert.ok(setup.setupCommand({ ...old, radius: "" }).error)
})
await check(
  "built init: defaults, custom theme preservation, explicit color/radius updates and idempotence",
  async () => {
    const root = await fixture("theme-cli", { dependencies: { react: "19" } }),
      bin = path.join(root, "bin")
    await fs.mkdir(bin)
    await fs.writeFile(path.join(bin, "npm"), "#!/bin/sh\nexit 0\n", { mode: 0o755 })
    const cli = path.join(repo, "packages/cli/dist/index.js")
    const run = (args) =>
      execFileSync(process.execPath, [cli, ...args], {
        cwd: root,
        env: { ...process.env, PATH: bin + path.delimiter + process.env.PATH },
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      })
    run(["init", "-y", "--css", "globals.css"])
    const file = path.join(root, "globals.css")
    const initial = await fs.readFile(file, "utf8")
    assert.ok(initial.includes("--primary: " + presets.colors.iris.light["--primary"]))
    assert.ok(initial.includes("--radius: " + presets.radii.lg.value))
    await fs.appendFile(
      file,
      "\n:root { --primary: rebeccapurple; --radius: 13px; --success: #123456; }\n.dark { --primary: #fedcba; --radius: 19px; }\n"
    )
    const custom = await fs.readFile(file, "utf8")
    run(["init", "-y"])
    assert.equal(await fs.readFile(file, "utf8"), custom)
    run(["init", "--color", "emerald"])
    let changed = await fs.readFile(file, "utf8")
    assert.ok(changed.includes("--primary: " + presets.colors.emerald.light["--primary"]))
    assert.ok(changed.includes("--primary: " + presets.colors.emerald.dark["--primary"]))
    assert.ok(changed.includes("--radius: 13px"))
    assert.ok(changed.includes("--radius: 19px"))
    assert.ok(changed.includes("--success: #123456"))
    run(["init", "--radius", "xl"])
    changed = await fs.readFile(file, "utf8")
    assert.ok(!changed.includes("--radius: 13px"))
    assert.ok(!changed.includes("--radius: 19px"))
    assert.ok(changed.includes("--primary: " + presets.colors.emerald.light["--primary"]))
    run(["init", "-y", "--color", "emerald", "--radius", "xl"])
    assert.equal(await fs.readFile(file, "utf8"), changed)
    const invalid = spawnSync(process.execPath, [cli, "init", "--color", "invalid", "-y"], {
      cwd: root,
      encoding: "utf8",
    })
    assert.notEqual(invalid.status, 0)
    assert.equal(await fs.readFile(file, "utf8"), changed)
  }
)
console.log(
  `Final onboarding total: ${count}. Theme command matrix covers 448 new and 448 existing combinations.`
)
