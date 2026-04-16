import path from "path"
import fs from "fs-extra"
import chalk from "chalk"
import ora from "ora"
import prompts from "prompts"
import { execa } from "execa"
import { getConfig, writeConfig } from "../utils/config"
import {
  fetchRegistry,
  fetchComponent,
  resolveComponentDependencies,
  type ComponentEntry,
} from "../utils/registry"
import { detectPackageManager } from "../utils/package-manager"
import { ensureThemeCSS } from "../utils/ensure-styles"
import { detectStyleFiles, promptForStyleFile } from "../utils/style-file"
import { init } from "./init"

function resolveInstallFilePath(
  filePath: string,
  defaultComponentsPath: string,
  customPath?: string
): string {
  const installAnchor = path.resolve(customPath ?? defaultComponentsPath)
  const projectSourceRoot = path.dirname(path.dirname(installAnchor))
  const normalizedPath = filePath.replace(/\\/g, "/")

  if (normalizedPath.startsWith("components/") || normalizedPath.startsWith("hooks/")) {
    return path.resolve(projectSourceRoot, normalizedPath)
  }

  return path.resolve(installAnchor, filePath)
}

export async function add(
  components: string[],
  options: {
    yes: boolean
    overwrite: boolean
    all: boolean
    css?: string
    path?: string
  }
) {
  let config = await getConfig()

  if (!config) {
    console.log()
    console.log(chalk.dim("baseui-cn is not initialized. Running init first..."))
    console.log()
    await init({
      yes: false,
      defaults: false,
      css: options.css,
      skipTailwind: false,
    })
    config = await getConfig()
    if (!config) return
  }

  if (options.css && options.css !== config.globalCss) {
    config = { ...config, globalCss: options.css }
    await writeConfig(config)
  }

  const configuredCssPath = path.resolve(config.globalCss)
  if (!(await fs.pathExists(configuredCssPath)) && !options.yes) {
    const hasSrcDir = await fs.pathExists(path.resolve("src"))
    const hasAppDir = await fs.pathExists(path.resolve(hasSrcDir ? "src/app" : "app"))
    const styleDetection = await detectStyleFiles({ hasSrcDir, hasAppDir })

    const selectedStyleFile = await promptForStyleFile({
      detection: styleDetection,
      initialValue: config.globalCss,
      missingConfiguredPath: config.globalCss,
      message: `Configured stylesheet "${config.globalCss}" was not found. Which stylesheet should baseui-cn update?`,
    })

    if (selectedStyleFile !== config.globalCss) {
      config = { ...config, globalCss: selectedStyleFile }
      await writeConfig(config)
      console.log(chalk.dim(`Using stylesheet: ${config.globalCss}`))
      console.log()
    }
  }

  if (options.all) {
    const registry = await fetchRegistry()
    components = registry.components.map((component) => component.name)
    console.log()
    console.log(chalk.bold(`Adding all ${components.length} components...`))
    console.log()
  }

  if (!components.length) {
    const registry = await fetchRegistry()

    const { selected } = await prompts({
      type: "multiselect",
      name: "selected",
      message: "Which components would you like to add?",
      choices: registry.components.map((component) => ({
        title: component.type === "block" ? `[block] ${component.name}` : component.name,
        description: component.description,
        value: component.name,
      })),
      hint: "Space to select | Enter to confirm | A to select all",
    })

    if (!selected?.length) {
      console.log(chalk.dim("No components selected."))
      return
    }

    components = selected
  }

  const resolveSpinner = ora("Resolving dependencies...").start()
  const allComponents = await resolveComponentDependencies(components)
  const componentEntries = new Map<string, ComponentEntry>()

  for (const name of allComponents) {
    componentEntries.set(name, await fetchComponent(name))
  }

  const toInstall = options.overwrite
    ? allComponents
    : await filterExisting(allComponents, componentEntries, config, options.path)

  resolveSpinner.succeed(
    `${allComponents.length} component${allComponents.length !== 1 ? "s" : ""} resolved`
  )

  if (!toInstall.length) {
    console.log()
    console.log(chalk.dim("All selected components already exist. Use --overwrite to replace."))
    return
  }

  if (!options.yes) {
    console.log()
    console.log("Components to add:")
    toInstall.forEach((component) => console.log(chalk.cyan(`  + ${component}`)))
    console.log()

    const { confirm } = await prompts({
      type: "confirm",
      name: "confirm",
      message: `Add ${toInstall.length} component${toInstall.length !== 1 ? "s" : ""}?`,
      initial: true,
    })

    if (!confirm) return
  }

  await ensureThemeCSS(config)

  const allNpmDeps: string[] = []

  for (const componentName of toInstall) {
    const spinner = ora(`Adding ${componentName}...`).start()

    try {
      const component = componentEntries.get(componentName)
      if (!component) {
        throw new Error(`Missing registry entry for "${componentName}"`)
      }

      if (component.dependencies?.required) {
        allNpmDeps.push(...component.dependencies.required)
      }

      for (const file of component.files) {
        const filePath = resolveInstallFilePath(file.path, config.componentsPath, options.path)
        await fs.ensureDir(path.dirname(filePath))
        await fs.writeFile(filePath, file.content)
      }

      spinner.succeed(
        `${componentName} ${chalk.dim(`-> ${describeInstallTarget(component, config.componentsPath, options.path)}`)}`
      )
    } catch (err) {
      spinner.fail(`Failed to add ${componentName}`)
      console.log(chalk.dim(`  ${err}`))
    }
  }

  const uniqueDeps = [...new Set(allNpmDeps)].filter(Boolean)

  if (uniqueDeps.length) {
    const depsSpinner = ora("Installing npm dependencies...").start()
    const pm = await detectPackageManager()

    try {
      await execa(pm, [pm === "npm" ? "install" : "add", ...uniqueDeps])
      depsSpinner.succeed("Dependencies installed")
    } catch {
      depsSpinner.fail("Failed to install dependencies")
      console.log(chalk.dim(`  Run manually: npm install ${uniqueDeps.join(" ")}`))
    }
  }

  console.log()
  console.log(`${chalk.green("✓")} Done. Components are yours - edit freely.`)
  console.log()
}

async function filterExisting(
  components: string[],
  componentEntries: Map<string, ComponentEntry>,
  config: { componentsPath: string },
  customPath?: string
): Promise<string[]> {
  const existing: string[] = []
  const missing: string[] = []

  for (const name of components) {
    const component = componentEntries.get(name)
    if (!component) {
      missing.push(name)
      continue
    }

    const allFilesExist = await Promise.all(
      component.files.map((file) =>
        fs.pathExists(resolveInstallFilePath(file.path, config.componentsPath, customPath))
      )
    )

    if (allFilesExist.every(Boolean)) {
      existing.push(name)
    } else {
      missing.push(name)
    }
  }

  if (existing.length) {
    console.log()
    console.log(chalk.dim("Already installed (skipping):"))
    existing.forEach((component) => console.log(chalk.dim(`  · ${component}`)))
  }

  return missing
}

function describeInstallTarget(
  component: ComponentEntry,
  defaultComponentsPath: string,
  customPath?: string
): string {
  const relativeToCwd = (resolvedPath: string) =>
    path.relative(process.cwd(), resolvedPath).replace(/\\/g, "/")

  if (component.files.length === 1) {
    const firstFile = component.files[0]!
    return relativeToCwd(
      resolveInstallFilePath(firstFile.path, defaultComponentsPath, customPath)
    )
  }

  const firstFile = component.files[0]!
  return `${relativeToCwd(resolveInstallFilePath(firstFile.path, defaultComponentsPath, customPath))} +${component.files.length - 1} files`
}
