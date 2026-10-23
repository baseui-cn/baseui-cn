import path from "path"
import fs from "fs-extra"
import chalk from "chalk"
import ora from "ora"
import prompts from "prompts"
import execa from "execa"
import { detectPackageManager } from "../utils/package-manager"
import { getConfig, writeConfig } from "../utils/config"
import { ensureThemeCSS, detectExistingTheme } from "../utils/ensure-styles"
import { chooseThemeOptions, validateThemeOptions } from "../utils/theme-options"
import { detectStyleFiles, promptForStyleFile } from "../utils/style-file"
import { detectFramework, frameworkLabels, promptOptions } from "../utils/project"

const UTILS_CONTENT = `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`

export async function init(options: {
  yes: boolean
  defaults: boolean
  css?: string
  skipTailwind: boolean
  customize?: boolean
  color?: string
  radius?: string
}) {
  validateThemeOptions(options)
  console.log()
  console.log(chalk.bold("baseui-cn") + chalk.dim("  Base UI components. One command install."))
  console.log()

  const existingConfig = await getConfig()
  if (
    existingConfig &&
    !options.yes &&
    !options.defaults &&
    !options.color &&
    !options.radius &&
    process.stdin.isTTY
  ) {
    const { proceed } = await prompts(
      {
        type: "confirm",
        name: "proceed",
        message: "baseui-cn is already initialized. Reinitialize?",
        initial: false,
      },
      promptOptions
    )
    if (!proceed) return
  }

  const spinner = ora("Detecting project structure...").start()

  const framework = await detectFramework()
  const isNextJs = framework === "next"
  const pm = await detectPackageManager()

  const hasSrcDir = await fs.pathExists(path.resolve("src"))
  const hasAppDir = await fs.pathExists(path.resolve(hasSrcDir ? "src/app" : "app"))
  const sourceDir = hasSrcDir ? "src" : framework === "react-router" && hasAppDir ? "app" : ""

  spinner.succeed(
    `${frameworkLabels[framework]} project detected` +
      (hasSrcDir ? " · src/ dir" : "") +
      (isNextJs && hasAppDir ? " · App Router" : "")
  )
  console.log(chalk.dim(`  ✓ Detected ${pm}`))
  if (framework === "unknown" || framework === "react") {
    console.log(
      chalk.dim(
        "  Custom React setup: ensure Tailwind CSS v4 and the @/* source alias are configured. See https://baseui-cn.com/docs/installation"
      )
    )
  }

  const styleDetection = await detectStyleFiles({ hasSrcDir, hasAppDir, sourceDir })

  let config = {
    componentsPath: sourceDir ? `${sourceDir}/components/ui` : "components/ui",
    utilsPath: sourceDir ? `${sourceDir}/lib/utils` : "lib/utils",
    globalCss: options.css ?? styleDetection.preferredPath,
    tailwind: !options.skipTailwind,
    rsc: isNextJs && hasAppDir,
    ...existingConfig,
  }
  if (options.css) config.globalCss = options.css
  if (options.skipTailwind) config.tailwind = false

  if (options.customize && !options.yes && !options.defaults) {
    const answers = await prompts(
      [
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
          type: "confirm",
          name: "rsc",
          message: "Are you using React Server Components?",
          initial: config.rsc,
        },
      ],
      promptOptions
    )
    const globalCss = options.css
      ? options.css
      : await promptForStyleFile({
          detection: styleDetection,
          initialValue: config.globalCss,
          message: "Which stylesheet should baseui-cn update with theme variables?",
        })
    config = { ...config, ...answers, globalCss }
  } else if (
    !options.yes &&
    !options.defaults &&
    !options.css &&
    styleDetection.existingCandidates.length > 1 &&
    !existingConfig
  ) {
    config.globalCss = await promptForStyleFile({
      detection: styleDetection,
      initialValue: config.globalCss,
      message: "Which stylesheet should baseui-cn update with theme variables?",
    })
  }

  const themeOptions = await chooseThemeOptions(
    options,
    await detectExistingTheme(config.globalCss),
    !!process.stdin.isTTY && !options.yes && !options.defaults
  )
  if (!config.tailwind && (themeOptions.color || themeOptions.radius)) {
    throw new Error(
      "Theme flags require theme CSS initialization. Enable tailwind in baseui-cn.json and omit --skip-tailwind."
    )
  }
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
  } catch (error) {
    depsSpinner.fail("Failed to install dependencies")
    throw error
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

  await ensureThemeCSS(config, themeOptions)

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
