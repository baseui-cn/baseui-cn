import path from "path"
import fs from "fs-extra"
import chalk from "chalk"
import ora from "ora"
import prompts from "prompts"
import { execa } from "execa"
import { detectPackageManager } from "../utils/package-manager"
import { getConfig, writeConfig } from "../utils/config"
import { ensureThemeCSS } from "../utils/ensure-styles"

const UTILS_CONTENT = `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`

export async function init(options: {
  yes: boolean
  defaults: boolean
  skipTailwind: boolean
}) {
  console.log()
  console.log(
    chalk.bold("baseui-cn") +
    chalk.dim("  Base UI components. One command install.")
  )
  console.log()

  const existingConfig = await getConfig()
  if (existingConfig && !options.yes) {
    const { proceed } = await prompts({
      type: "confirm",
      name: "proceed",
      message: "baseui-cn is already initialized. Reinitialize?",
      initial: false,
    })
    if (!proceed) return
  }

  const spinner = ora("Detecting project structure...").start()

  const isNextJs =
    (await fs.pathExists(path.resolve("next.config.js"))) ||
    (await fs.pathExists(path.resolve("next.config.ts"))) ||
    (await fs.pathExists(path.resolve("next.config.mjs")))

  const hasSrcDir = await fs.pathExists(path.resolve("src"))
  const hasAppDir = await fs.pathExists(
    path.resolve(hasSrcDir ? "src/app" : "app")
  )

  spinner.succeed(
    `${isNextJs ? "Next.js" : "React"} project detected` +
    (hasSrcDir ? " · src/ dir" : "") +
    (hasAppDir ? " · App Router" : "")
  )

  let config = {
    componentsPath: hasSrcDir ? "src/components/ui" : "components/ui",
    utilsPath: hasSrcDir ? "src/lib/utils" : "lib/utils",
    globalCss: hasSrcDir
      ? hasAppDir ? "src/app/globals.css" : "src/styles/globals.css"
      : hasAppDir ? "app/globals.css" : "styles/globals.css",
    tailwind: !options.skipTailwind,
    rsc: isNextJs && hasAppDir,
  }

  if (!options.yes && !options.defaults) {
    const answers = await prompts([
      {
        type: "text",
        name: "componentsPath",
        message: "Where should components be added?",
        initial: config.componentsPath,
      },
      {
        type: "text",
        name: "utilsPath",
        message: "Where is your utils file?",
        initial: config.utilsPath,
      },
      {
        type: "text",
        name: "globalCss",
        message: "Where is your global CSS file?",
        initial: config.globalCss,
      },
      {
        type: "confirm",
        name: "rsc",
        message: "Are you using React Server Components?",
        initial: config.rsc,
      },
    ])
    config = { ...config, ...answers }
  }

  const pm = await detectPackageManager()
  const depsSpinner = ora("Installing dependencies...").start()

  try {
    await execa(pm, [
      pm === "npm" ? "install" : "add",
      "@base-ui/react",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ])
    depsSpinner.succeed("Dependencies installed")
  } catch {
    depsSpinner.fail("Failed to install dependencies")
    console.log(
      chalk.dim(
        "  Run manually: npm install @base-ui/react class-variance-authority clsx tailwind-merge"
      )
    )
  }

  const utilsSpinner = ora("Creating utils file...").start()
  const utilsFilePath = path.resolve(`${config.utilsPath}.ts`)
  await fs.ensureDir(path.dirname(utilsFilePath))
  if (!(await fs.pathExists(utilsFilePath))) {
    await fs.writeFile(utilsFilePath, UTILS_CONTENT)
    utilsSpinner.succeed(`Utils created at ${chalk.cyan(config.utilsPath + ".ts")}`)
  } else {
    utilsSpinner.info(`Utils already exists — skipped`)
  }

  await fs.ensureDir(path.resolve(config.componentsPath))

  await ensureThemeCSS(config)

  await writeConfig(config)

  console.log()
  console.log(chalk.green("✓") + " baseui-cn initialized successfully.")
  console.log()
  console.log("  Next steps:")
  console.log("  " + chalk.cyan("npx baseui-cn add button") + "          Add a component")
  console.log("  " + chalk.cyan("npx baseui-cn add --all") + "           Add everything")
  console.log("  " + chalk.cyan("npx baseui-cn list") + "                See all components")
  console.log()
  console.log("  " + chalk.dim("Docs: https://baseui-cn.com"))
  console.log()
}
