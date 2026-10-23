import path from "path"
import fs from "fs-extra"
import execa from "execa"
import prompts from "prompts"
import { init } from "./init"
import { themePresets } from "../utils/theme.generated"
import {
  themeQuestions,
  validateThemeOptions,
  type ColorPreset,
  type RadiusPreset,
  type ThemeOptions,
} from "../utils/theme-options"
import {
  detectFramework,
  frameworkLabels,
  promptOptions,
  CancelledError,
  type Framework,
} from "../utils/project"
import {
  detectPackageManager,
  packageManagers,
  runner,
  type PackageManager,
} from "../utils/package-manager"

export type CreateFramework = Exclude<Framework, "react">
export interface CreateOptions {
  framework?: string
  packageManager?: string
  monorepo?: boolean
  yes?: boolean
  color?: string
  radius?: string
}
export interface CreatePlan {
  name: string
  framework: CreateFramework
  packageManager: PackageManager
  monorepo: boolean
  color: ColorPreset
  radius: RadiusPreset
}
export function validateProjectName(name: string): true | string {
  return /^[a-z0-9][a-z0-9-]*$/.test(name) &&
    name.length <= 100 &&
    !["node_modules", "favicon.ico"].includes(name)
    ? true
    : "Use 1–100 lowercase letters, numbers or hyphens, starting with a letter or number."
}
export function assertPackageManagerVersion(manager: PackageManager, version: string) {
  if (manager === "yarn" && Number(version.split(".")[0]) < 2) {
    throw new Error(
      "create requires Yarn 2+ (yarn dlx). Use --package-manager npm or upgrade Yarn."
    )
  }
}
export function scaffoldCommand(plan: CreatePlan, appName: string) {
  const pm = plan.packageManager
  switch (plan.framework) {
    case "next":
      return runner(pm, "create-next-app@latest", [
        appName,
        "--ts",
        "--tailwind",
        "--eslint",
        "--app",
        "--src-dir",
        "--import-alias",
        "@/*",
        `--use-${pm}`,
        "--skip-install",
        "--disable-git",
        "--yes",
      ])
    case "tanstack-start":
      return runner(pm, "@tanstack/cli@latest", [
        "create",
        appName,
        "--framework",
        "React",
        "--package-manager",
        pm,
        "--no-install",
        "--no-git",
        "--no-intent",
        "--no-examples",
        "--no-toolchain",
        "--non-interactive",
      ])
    case "react-router":
      return runner(pm, "create-react-router@latest", [
        appName,
        "--package-manager",
        pm,
        "--no-install",
        "--no-git-init",
        "--no-agent-skills",
        "--yes",
      ])
    case "vite":
      return runner(pm, "create-vite@latest", [
        appName,
        "--template",
        "react-ts",
        "--no-interactive",
      ])
    default:
      throw new Error(`Unsupported framework: ${plan.framework}`)
  }
}
export interface CreateServices {
  run: (command: string, args: string[], cwd: string) => Promise<void>
  initialize: (cwd: string, theme: ThemeOptions) => Promise<void>
  prompt: typeof prompts
}
const services: CreateServices = {
  run: async (command, args, cwd) => {
    await execa(command, args, { cwd, stdio: "inherit" })
  },
  initialize: async (cwd, theme) => {
    const previous = process.cwd()
    process.chdir(cwd)
    try {
      await init({ yes: true, defaults: true, skipTailwind: false, ...theme })
    } finally {
      process.chdir(previous)
    }
  },
  prompt: prompts,
}
export async function resolveCreatePlan(
  name: string | undefined,
  options: CreateOptions,
  ask = prompts
): Promise<CreatePlan> {
  validateThemeOptions(options)
  if (
    options.framework &&
    !["next", "tanstack-start", "react-router", "vite"].includes(options.framework)
  )
    throw new Error(
      `Unsupported framework: ${options.framework}. Choose next, tanstack-start, react-router or vite.`
    )
  if (options.packageManager && !packageManagers.includes(options.packageManager as PackageManager))
    throw new Error(
      `Unsupported package manager: ${options.packageManager}. Choose npm, pnpm, yarn or bun.`
    )
  if (name && validateProjectName(name) !== true) throw new Error(String(validateProjectName(name)))
  const detectedPm = await detectPackageManager()
  const answers = await ask(
    [
      {
        type: name ? null : "text",
        name: "name",
        message: "Project name",
        initial: "my-app",
        validate: validateProjectName,
      },
      {
        type: options.framework || options.yes ? null : "select",
        name: "framework",
        message: "Framework",
        choices: ["next", "tanstack-start", "react-router", "vite"].map((value) => ({
          title: frameworkLabels[value as CreateFramework],
          value,
        })),
      },
      {
        type: options.packageManager || options.yes ? null : "select",
        name: "packageManager",
        message: "Package manager",
        choices: packageManagers.map((value) => ({ title: value, value })),
        initial: packageManagers.indexOf(detectedPm),
      },
      {
        type: options.monorepo !== undefined || options.yes ? null : "select",
        name: "monorepo",
        message: "Project structure",
        choices: [
          { title: "Single application", value: false },
          { title: "Monorepo (apps/web)", value: true },
        ],
      },
      ...themeQuestions(options).map((question) => ({
        ...question,
        type: options.yes ? null : question.type,
      })),
    ],
    promptOptions
  )
  const resolvedName = name ?? answers.name
  if (!resolvedName) throw new CancelledError()
  if (validateProjectName(resolvedName) !== true)
    throw new Error(String(validateProjectName(resolvedName)))
  const color = options.color ?? answers.color ?? themePresets.defaultColor
  const radius = options.radius ?? answers.radius ?? themePresets.defaultRadius
  validateThemeOptions({ color, radius })
  return {
    name: resolvedName,
    framework: (options.framework as CreateFramework) ?? answers.framework ?? "next",
    packageManager:
      (options.packageManager as PackageManager) ?? answers.packageManager ?? detectedPm,
    monorepo: options.monorepo ?? answers.monorepo ?? false,
    color: color as ColorPreset,
    radius: radius as RadiusPreset,
  }
}

// Configure only freshly generated official scaffolds. Existing/custom apps keep
// their own build pipeline; init never replaces a user's Vite or TS config.
export async function configureScaffold(app: string, framework: CreateFramework) {
  const source = (await fs.pathExists(path.join(app, "src"))) ? "src" : "app"
  for (const name of ["tsconfig.json", "tsconfig.app.json"]) {
    const file = path.join(app, name)
    if (!(await fs.pathExists(file))) continue
    let text = await fs.readFile(file, "utf8")
    // The registry's strict compiler contract does not enable unused-symbol
    // linting. Some upstream starters do; match the registry without changing
    // approved component source or disabling strict type checking.
    text = text.replace(/("noUnused(?:Locals|Parameters)"\s*:\s*)true/g, "$1false")
    if (!/"@\/\*"\s*:/.test(text)) {
      const alias = `"@/*": ["./${source}/*"]`
      text = /"paths"\s*:\s*\{/.test(text)
        ? text.replace(/("paths"\s*:\s*\{)/, `$1\n      ${alias},`)
        : text.replace(/("compilerOptions"\s*:\s*\{)/, `$1\n    "paths": { ${alias} },`)
    }
    await fs.writeFile(file, text)
  }
  if (framework !== "vite") return
  const file = path.join(app, "vite.config.ts")
  const text = await fs.readFile(file, "utf8")
  if (!/plugins\s*:\s*\[/.test(text))
    throw new Error(
      "Official Vite config changed: configure Tailwind and @/* aliases manually before init."
    )
  await fs.writeFile(
    file,
    `import tailwindcss from '@tailwindcss/vite'\nimport tsconfigPaths from 'vite-tsconfig-paths'\n${text.replace(/plugins\s*:\s*\[/, "plugins: [tailwindcss(), tsconfigPaths(), ")}`
  )
  const cssFile = path.join(app, "src/index.css")
  const css = await fs.readFile(cssFile, "utf8")
  if (!css.includes('@import "tailwindcss"'))
    await fs.writeFile(cssFile, `@import "tailwindcss";\n${css}`)
}
export async function create(
  name: string | undefined,
  options: CreateOptions,
  overrides: Partial<CreateServices> = {},
  cwd = process.cwd()
) {
  const api = { ...services, ...overrides }
  const plan = await resolveCreatePlan(name, options, api.prompt)
  const destination = path.resolve(cwd, plan.name)
  if (await fs.pathExists(destination))
    throw new Error(
      `Destination already exists: ${plan.name}. Choose a new directory; nothing was overwritten.`
    )
  // Check the executable before creating even the outer workspace directory.
  try {
    await api.run(plan.packageManager, ["--version"], cwd)
  } catch {
    throw new Error(
      `${plan.packageManager} is unavailable. Install it or select another --package-manager.`
    )
  }
  if (plan.packageManager === "yarn" && !overrides.run) {
    const { stdout } = await execa("yarn", ["--version"], { cwd })
    assertPackageManagerVersion("yarn", stdout)
  }
  const app = plan.monorepo ? path.join(destination, "apps/web") : destination
  const scaffoldCwd = plan.monorepo ? path.join(destination, "apps") : cwd
  if (plan.monorepo) await fs.ensureDir(scaffoldCwd)
  const command = scaffoldCommand(plan, plan.monorepo ? "web" : plan.name)
  console.log(`\nCreating ${frameworkLabels[plan.framework]} with the official scaffolder…\n`)
  try {
    await api.run(command.command, command.args, scaffoldCwd)
    const actual = await detectFramework(app)
    if (actual !== plan.framework)
      throw new Error(
        `Scaffolder produced ${frameworkLabels[actual]}, expected ${frameworkLabels[plan.framework]}.`
      )
    await configureScaffold(app, plan.framework)
    if (plan.monorepo) {
      await fs.writeJson(
        path.join(destination, "package.json"),
        {
          name: plan.name,
          private: true,
          workspaces: ["apps/*"],
          scripts: {
            dev: `cd apps/web && ${plan.packageManager} run dev`,
            build: `cd apps/web && ${plan.packageManager} run build`,
          },
        },
        { spaces: 2 }
      )
      if (plan.packageManager === "pnpm")
        await fs.writeFile(
          path.join(destination, "pnpm-workspace.yaml"),
          'packages:\n  - "apps/*"\n'
        )
      if (plan.packageManager === "yarn")
        await fs.writeFile(path.join(destination, ".yarnrc.yml"), "nodeLinker: node-modules\n")
    }
    // Install from the workspace root so all four PMs own one workspace graph.
    await api.run(plan.packageManager, ["install"], destination)
    if (plan.framework === "vite")
      await api.run(
        plan.packageManager,
        [
          plan.packageManager === "npm" ? "install" : "add",
          "tailwindcss",
          "@tailwindcss/vite",
          "vite-tsconfig-paths",
        ],
        app
      )
    await api.initialize(app, { color: plan.color, radius: plan.radius })
  } catch (error) {
    throw new Error(
      `Project setup stopped at ${app}. Files are retained for inspection. ${error instanceof Error ? error.message : String(error)}`
    )
  }
  console.log(
    `\n✓ Project ready\n\n  cd ${plan.name}${plan.monorepo ? "/apps/web" : ""}\n  ${plan.packageManager} run dev\n\n  Add components: ${runner(plan.packageManager, "baseui-cn@latest", ["add", "button"]).command} ${runner(
      plan.packageManager,
      "baseui-cn@latest",
      ["add", "button"]
    )
      .args.filter((a) => a !== "--yes")
      .join(" ")}\n`
  )
}
