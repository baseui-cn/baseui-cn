import assert from "node:assert/strict"
import { test } from "node:test"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { createRequire } from "node:module"
import { spawnSync } from "node:child_process"
const root = path.resolve(import.meta.dirname, "..")
const cliRequire = createRequire(path.join(root, "packages/cli/package.json"))
const { build } = createRequire(cliRequire.resolve("tsup"))("esbuild")
const dir = await fs.mkdtemp(path.join(os.tmpdir(), "baseui-setup-contract-"))
async function bundle(file, name) {
  const outfile = path.join(dir, name + ".cjs")
  await build({
    entryPoints: [path.join(root, file)],
    bundle: true,
    platform: "node",
    format: "cjs",
    outfile,
    logLevel: "silent",
  })
  return createRequire(import.meta.url)(outfile)
}
const setup = await bundle("apps/www/lib/setup-command.ts", "setup")
const { createProgram } = await bundle("packages/cli/src/program.ts", "program")
const { resolveCreatePlan } = await bundle("packages/cli/src/commands/create.ts", "create")
const { ensureThemeCSS } = await bundle("packages/cli/src/utils/ensure-styles.ts", "styles")
const { chooseThemeOptions, themeQuestions } = await bundle(
  "packages/cli/src/utils/theme-options.ts",
  "options"
)
const { typography } = await bundle("packages/cli/src/utils/typography.generated.ts", "fonts")
const { fontDependencies } = await bundle("packages/cli/src/utils/typography.ts", "deps")
const { themePresets, themeInline } = await bundle(
  "packages/cli/src/utils/theme.generated.ts",
  "theme"
)
const base = {
  framework: "next",
  projectMode: "new",
  structure: "single",
  packageManager: "pnpm",
  projectName: "my-app",
  workspace: "",
}
export function shellArgv(command) {
  const result = spawnSync("/bin/sh", ["-c", `printf '%s\\0' ${command}`], { encoding: "utf8" })
  assert.equal(result.status, 0)
  return result.stdout.split("\0").slice(0, -1)
}
await test("entrypoint, built parser and package version preserve the hardened artifact contract", async () => {
  const pkg = JSON.parse(await fs.readFile(path.join(root, "packages/cli/package.json"), "utf8"))
  const entrypoint = await fs.readFile(path.join(root, "packages/cli/src/index.ts"), "utf8")
  assert.deepEqual(
    [...entrypoint.matchAll(/\.version\(\s*"([^"]+)"\s*\)/g)].map((m) => m[1]),
    [pkg.version]
  )
  const banner = spawnSync(
    process.execPath,
    [path.join(root, "packages/cli/dist/index.js"), "--version"],
    { encoding: "utf8" }
  )
  assert.equal(banner.status, 0, banner.stderr)
  assert.equal(banner.stdout.trim(), pkg.version)
})
function cliTypographyCommand(input) {
  return (
    setup.setupCommand({ ...input, bodyFont: undefined, headingFont: undefined }).primary +
    ` --body-font ${input.bodyFont} --heading-font ${input.headingFont}`
  )
}
await test("pre-publish website ignores all hidden typography state and exposes no font flags", () => {
  for (const packageManager of setup.setupManagers)
    for (const projectMode of ["new", "existing"])
      for (const structure of ["single", "monorepo"])
        for (const framework of ["next", "tanstack-start", "react-router", "vite"])
          for (const fonts of [
            { bodyFont: "inter", headingFont: "poppins" },
            { bodyFont: "bad;id", headingFont: "" },
          ]) {
            const input = {
              ...base,
              packageManager,
              projectMode,
              structure,
              framework,
              workspace: "apps/web",
            }
            const plain = setup.setupCommand(input)
            assert.deepEqual(setup.setupCommand({ ...input, ...fonts }), plain)
            assert.doesNotMatch(plain.primary, /--body-font|--heading-font/)
          }
})
for (const packageManager of setup.setupManagers) {
  for (const projectMode of ["new", "existing"])
    for (const structure of ["single", "monorepo"])
      await test(`${packageManager} ${projectMode} ${structure}: exact operation and hidden-state isolation`, () => {
        const result = setup.setupCommand({
          ...base,
          packageManager,
          projectMode,
          structure,
          workspace: "apps/web",
        })
        assert.equal(result.error, undefined)
        const args = shellArgv(result.primary)
        assert.ok(
          result.primary.startsWith(
            setup.packageInvocation(packageManager) +
              " baseui-cn@latest " +
              (projectMode === "new" ? "create my-app" : "init")
          )
        )
        assert.equal(args.includes("create"), projectMode === "new")
        assert.equal(args.includes("init"), projectMode === "existing")
        assert.equal(args.includes("--monorepo"), projectMode === "new" && structure === "monorepo")
        assert.equal(
          args.includes("--workspace"),
          projectMode === "existing" && structure === "monorepo"
        )
        assert.equal(args.includes("my-app"), projectMode === "new")
      })
}
await test("regression: my-app-online in a hidden workspace never produces init --workspace for New Project", () => {
  const result = setup.setupCommand({
    ...base,
    projectName: "my-app-online",
    workspace: "my-app-online",
    structure: "monorepo",
  })
  assert.match(result.primary, /create my-app-online/)
  assert.doesNotMatch(result.primary, /init|--workspace/)
  assert.equal(
    setup.setupCommand({
      ...base,
      projectMode: "existing",
      structure: "monorepo",
      projectName: "my-app-online",
    }).primary,
    "pnpm dlx baseui-cn@latest init"
  )
})
await test("mode transitions clear hidden paths and explicit appearance consent; custom React can return to New", () => {
  const input = setup.changeProjectMode(
    { ...base, workspace: "old-app", color: "iris", bodyFont: "inter" },
    "existing"
  )
  assert.equal(input.workspace, "")
  assert.equal(input.color, undefined)
  assert.equal(input.bodyFont, undefined)
  const next = setup.changeProjectMode(
    { ...input, framework: "react", workspace: "apps/web" },
    "new"
  )
  assert.equal(next.framework, "next")
  assert.equal(next.workspace, "")
})
await test("invalid appearance and shell fields suppress commands before execution", () => {
  for (const patch of [
    { color: "bad" },
    { radius: "" },
    { framework: "bad" },
    { packageManager: "bad" },
    { projectName: "$(id)" },
  ])
    assert.ok(setup.setupCommand({ ...base, ...patch }).error)
})
for (const bodyFont of typography.bodyFonts)
  for (const headingFont of typography.headingFonts)
    await test(`font round-trip: ${bodyFont}/${headingFont}`, async () => {
      const input = { ...base, color: "emerald", radius: "xl", bodyFont, headingFont }
      const argv = shellArgv(cliTypographyCommand(input))
      let plan
      await createProgram({
        create: async (name, options) => {
          plan = await resolveCreatePlan(name, options, async () => ({}))
        },
      }).parseAsync(["node", "baseui-cn", ...argv.slice(argv.indexOf("baseui-cn@latest") + 1)])
      for (const key of [
        "framework",
        "packageManager",
        "color",
        "radius",
        "bodyFont",
        "headingFont",
      ])
        assert.equal(plan[key], input[key])
      const file = path.join(dir, `${bodyFont}-${headingFont}.css`)
      const config = { globalCss: file, tailwind: true }
      await ensureThemeCSS(config, { ...plan, silent: true })
      const css = await fs.readFile(file, "utf8")
      for (const [key, value] of Object.entries(themePresets.colors.emerald.light))
        assert.ok(css.includes(`${key}: ${value};`))
      for (const [key, value] of Object.entries(themePresets.colors.emerald.dark))
        assert.ok(css.includes(`${key}: ${value};`))
      assert.ok(css.includes("--radius: " + themePresets.radii.xl.value))
      for (const [key, id] of [
        ["body", bodyFont],
        ["heading", headingFont],
      ]) {
        assert.ok(css.includes(`--font-${key}: ${typography.fonts[id].family};`))
        for (const entry of typography.fonts[id].imports)
          assert.equal(css.split(`@import "${entry}";`).length - 1, 1)
      }
      assert.ok(css.includes("body { font-family: var(--font-body); }"))
      assert.ok(css.includes("h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading); }"))
      assert.equal(
        fontDependencies(plan).length,
        new Set([bodyFont, headingFont].filter((f) => f !== "system")).size
      )
      await ensureThemeCSS(config, { ...plan, silent: true })
      assert.equal(await fs.readFile(file, "utf8"), css)
    })
await test("interactive init always offers Keep existing typography first; noninteractive init never guesses", async () => {
  const questions = themeQuestions({}, { color: false, radius: false }, true)
  for (const key of ["bodyFont", "headingFont"]) {
    const question = questions.find((q) => q.name === key)
    assert.equal(question.choices[0].value, "keep")
    assert.equal(question.initial, 0)
  }
  const selected = await chooseThemeOptions({}, { color: false, radius: false }, false)
  assert.equal(selected.bodyFont, undefined)
  assert.equal(selected.headingFont, undefined)
})
await test("existing typography remains byte-identical on repeat init; explicit fonts are opt-in by dimension", async () => {
  const file = path.join(dir, "custom.css")
  const original =
    '@import "tailwindcss";\n:root { --font-body: "Custom Body"; --font-heading: "Custom Heading"; }\nbody { font-family: "Custom Body"; }\nh1 { font-family: "Custom Heading"; }\ncode { font-family: monospace; }'
  await fs.writeFile(file, original)
  await ensureThemeCSS({ globalCss: file, tailwind: true }, { silent: true })
  const first = await fs.readFile(file, "utf8")
  for (const fragment of [
    '--font-body: "Custom Body"',
    '--font-heading: "Custom Heading"',
    'body { font-family: "Custom Body"; }',
    'h1 { font-family: "Custom Heading"; }',
    "code { font-family: monospace; }",
  ])
    assert.ok(first.includes(fragment))
  assert.doesNotMatch(first, /baseui-cn (body|heading) typography|@fontsource/)
  await ensureThemeCSS({ globalCss: file, tailwind: true }, { silent: true })
  assert.equal(await fs.readFile(file, "utf8"), first)
  await ensureThemeCSS({ globalCss: file, tailwind: true }, { bodyFont: "inter", silent: true })
  const changed = await fs.readFile(file, "utf8")
  assert.ok(changed.includes('--font-heading: "Custom Heading"'))
  assert.ok(changed.includes('h1 { font-family: "Custom Heading"; }'))
  assert.ok(changed.includes("code { font-family: monospace; }"))
  assert.doesNotMatch(changed, /baseui-cn heading typography/)
})
await test("derived radius tokens and all palette members remain canonical", () => {
  for (const preset of Object.values(themePresets.colors))
    for (const mode of ["light", "dark"]) {
      for (const token of ["--border", "--input", "--ring", "--primary", "--accent"])
        assert.ok(preset[mode][token])
    }
  for (const key of ["sm", "md", "lg", "xl"])
    assert.ok(themeInline["--radius-" + key].includes("var(--radius)"))
})
console.log("Setup contract checks complete", dir)

await test("existing init parser round-trip uses only explicit appearance flags", async () => {
  const cwd = process.cwd()
  const app = path.join(dir, "existing-app")
  await fs.mkdir(app, { recursive: true })
  await fs.writeFile(path.join(app, "package.json"), '{"dependencies":{"react":"19"}}')
  try {
    process.chdir(app)
    for (const manager of setup.setupManagers) {
      const input = {
        ...base,
        packageManager: manager,
        projectMode: "existing",
        projectName: "stale-project",
        color: "blue",
        radius: "md",
        bodyFont: "inter",
        headingFont: "poppins",
      }
      const argv = shellArgv(cliTypographyCommand(input))
      let parsed
      await createProgram({
        init: async (options) => {
          parsed = options
        },
      }).parseAsync(["node", "baseui-cn", ...argv.slice(argv.indexOf("baseui-cn@latest") + 1)])
      for (const key of ["color", "radius", "bodyFont", "headingFont"])
        assert.equal(parsed[key], input[key])
      assert.equal(parsed.workspace, undefined)
      assert.equal(parsed.projectName, undefined)
    }
  } finally {
    process.chdir(cwd)
  }
})
await test("single-app official pnpm packages-dot workspace remains a valid init target", async () => {
  const { applicationWorkspaces, resolveProjectTarget } = await bundle(
    "packages/cli/src/utils/project.ts",
    "project"
  )
  const app = path.join(dir, "self-workspace")
  await fs.mkdir(app, { recursive: true })
  await fs.writeFile(
    path.join(app, "package.json"),
    '{"dependencies":{"@tanstack/react-start":"1","react":"19"}}'
  )
  await fs.writeFile(path.join(app, "pnpm-workspace.yaml"), "packages:\n  - .\n")
  assert.deepEqual(await applicationWorkspaces(app), ["."])
  assert.equal(await resolveProjectTarget({ yes: true }, app), app)
  assert.equal(await resolveProjectTarget({ workspace: "." }, app), app)
})
await test("direct init --workspace misuse fails safely with create guidance; create rejects workspace flags", async () => {
  const cwd = path.join(dir, "invalid-workspace")
  await fs.mkdir(cwd)
  const result = spawnSync(
    process.execPath,
    [path.join(root, "packages/cli/dist/index.js"), "init", "--workspace", "my-app-online"],
    { cwd, encoding: "utf8" }
  )
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /existing monorepo/)
  assert.match(result.stderr, /create my-app --monorepo/)
  assert.deepEqual(await fs.readdir(cwd), [])
  const program = createProgram()
    .exitOverride()
    .configureOutput({ writeErr: () => {} })
  for (const command of program.commands) command.exitOverride()
  await assert.rejects(
    program.parseAsync(["node", "baseui-cn", "create", "my-app", "--workspace", "my-app-online"]),
    /unknown option/
  )
  assert.deepEqual(await fs.readdir(cwd), [])
})

await test("explicit heading font overrides ordinary starter heading selectors without targeting code or inputs", async () => {
  const file = path.join(dir, "starter-heading.css")
  await fs.writeFile(
    file,
    '@import "tailwindcss";\n:root { --heading: system-ui; }\nh1, h2 { font-family: var(--heading); }\ncode { font-family: "Custom Mono"; }'
  )
  await ensureThemeCSS({ globalCss: file, tailwind: true }, { headingFont: "inter", silent: true })
  const css = await fs.readFile(file, "utf8")
  assert.ok(css.includes("h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading); }"))
  assert.ok(
    css.indexOf("font-family: var(--font-heading)") > css.indexOf("font-family: var(--heading)")
  )
  assert.ok(css.includes('code { font-family: "Custom Mono"; }'))
  assert.doesNotMatch(css, /baseui-cn body typography/)
})
await test("dark palette regression: foundation/layered dark selectors cannot lose to an unlayered light root", async () => {
  for (const layered of [false, true]) {
    const file = path.join(dir, `dark-layer-${layered}.css`)
    await fs.writeFile(
      file,
      '@import "tailwindcss";\n:root { --primary: #123456; }\n' +
        (layered ? "@layer base { .dark { --primary: #abcdef; } }\n" : "")
    )
    const config = { globalCss: file, tailwind: true }
    await ensureThemeCSS(config, { color: "emerald", radius: "xl", silent: true })
    const css = await fs.readFile(file, "utf8")
    const unlayeredDark = css.match(/\n\.dark \{([^}]+)\}/)?.[1]
    assert.ok(unlayeredDark, "Explicit palette has an unlayered .dark selector")
    for (const [token, value] of Object.entries(themePresets.colors.emerald.dark))
      assert.ok(unlayeredDark.includes(`${token}: ${value};`))
    await ensureThemeCSS(config, { silent: true })
    assert.equal(await fs.readFile(file, "utf8"), css)
  }
})
