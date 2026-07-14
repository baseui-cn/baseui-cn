import path from "path"
import fs from "fs-extra"
import chalk from "chalk"
import ora from "ora"
import prompts from "prompts"
import execa from "execa"
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

type InstallMode = "add" | "update"

interface InstallOptions {
  yes: boolean
  overwrite: boolean
  all: boolean
  css?: string
  path?: string
  mode: InstallMode
}

interface InstallState {
  requestedColliding: string[]
  dependencyColliding: string[]
  fresh: string[]
}

type DependencyConflictAction = "reuse" | "replace" | "cancel"

function resolveInstallFilePath(
  filePath: string,
  defaultComponentsPath: string,
  customPath?: string
): string {
  const installAnchor = path.resolve(customPath ?? defaultComponentsPath)
  const projectSourceRoot = path.dirname(path.dirname(installAnchor))
  const normalizedPath = filePath.replace(/\\/g, "/")

  if (
    normalizedPath.startsWith("components/") ||
    normalizedPath.startsWith("hooks/") ||
    normalizedPath.startsWith("styles/")
  ) {
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
  return installComponents(components, { ...options, mode: "add" })
}

export async function installComponents(components: string[], options: InstallOptions) {
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
    console.log(
      chalk.bold(
        `${options.mode === "update" ? "Updating" : "Adding"} all ${components.length} components...`
      )
    )
    console.log()
  }

  if (!components.length) {
    const registry = await fetchRegistry()

    const { selected } = await prompts({
      type: "multiselect",
      name: "selected",
      message:
        options.mode === "update"
          ? "Which components would you like to update?"
          : "Which components would you like to add?",
      choices: registry.components.map((component) => ({
        title: component.type === "block" ? `[block] ${component.name}` : component.name,
        description: component.description,
        value: component.name,
      })),
      hint: "Space to select | Enter to confirm | A to select all",
    })

    if (!selected?.length) {
      console.log(
        chalk.dim(`No components selected${options.mode === "update" ? " for update" : ""}.`)
      )
      return
    }

    components = selected
  }

  const requestedComponents = new Set(components)
  const resolveSpinner = ora("Resolving dependencies...").start()
  let allComponents: string[]
  const componentEntries = new Map<string, ComponentEntry>()
  let installState: InstallState

  try {
    allComponents = await resolveComponentDependencies(components)

    for (const name of allComponents) {
      componentEntries.set(name, await fetchComponent(name))
    }

    installState = await partitionInstallState(
      allComponents,
      requestedComponents,
      componentEntries,
      config,
      options.path
    )
  } catch (error) {
    resolveSpinner.fail("Failed to resolve dependencies")
    throw error
  }

  resolveSpinner.succeed(
    `${allComponents.length} component${allComponents.length !== 1 ? "s" : ""} resolved`
  )

  const dependencyAction = await resolveDependencyConflicts(
    installState,
    componentEntries,
    config,
    options
  )

  if (dependencyAction === "cancel") {
    console.log()
    console.log(chalk.dim("Installation cancelled. No component files were changed."))
    return
  }

  const toInstall = await resolveInstallTargets(
    installState,
    componentEntries,
    config,
    options,
    dependencyAction
  )

  if (!toInstall.length) {
    console.log()
    console.log(
      chalk.dim(
        options.mode === "update"
          ? "No components selected for update."
          : "All selected components already exist. Use --overwrite or update to replace."
      )
    )
    return
  }

  if (!options.yes) {
    console.log()
    console.log(`Components to ${options.mode === "update" ? "update" : "add"}:`)
    toInstall.forEach((component) => console.log(chalk.cyan(`  + ${component}`)))
    console.log()

    const { confirm } = await prompts({
      type: "confirm",
      name: "confirm",
      message: `${options.mode === "update" ? "Update" : "Add"} ${toInstall.length} component${toInstall.length !== 1 ? "s" : ""}?`,
      initial: true,
    })

    if (!confirm) return
  }

  await ensureThemeCSS(config)

  const allNpmDeps = allComponents.flatMap(
    (componentName) => componentEntries.get(componentName)?.dependencies?.required ?? []
  )

  for (const componentName of toInstall) {
    const spinner = ora(
      `${options.mode === "update" ? "Updating" : "Adding"} ${componentName}...`
    ).start()

    try {
      const component = componentEntries.get(componentName)
      if (!component) {
        throw new Error(`Missing registry entry for "${componentName}"`)
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
      spinner.fail(`Failed to ${options.mode === "update" ? "update" : "add"} ${componentName}`)
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
  console.log(
    `${chalk.green("✓")} ${
      options.mode === "update"
        ? "Done. Components refreshed successfully."
        : "Done. Components are yours - edit freely."
    }`
  )
  console.log()
}

async function partitionInstallState(
  components: string[],
  requestedComponents: Set<string>,
  componentEntries: Map<string, ComponentEntry>,
  config: { componentsPath: string },
  customPath?: string
): Promise<InstallState> {
  const requestedColliding: string[] = []
  const dependencyColliding: string[] = []
  const fresh: string[] = []

  for (const name of components) {
    const component = componentEntries.get(name)
    if (!component) {
      fresh.push(name)
      continue
    }

    const existingFiles = await Promise.all(
      component.files.map((file) =>
        fs.pathExists(resolveInstallFilePath(file.path, config.componentsPath, customPath))
      )
    )

    if (existingFiles.some(Boolean)) {
      if (requestedComponents.has(name)) {
        requestedColliding.push(name)
      } else {
        dependencyColliding.push(name)
      }
    } else {
      fresh.push(name)
    }
  }

  return { requestedColliding, dependencyColliding, fresh }
}

async function resolveDependencyConflicts(
  installState: InstallState,
  componentEntries: Map<string, ComponentEntry>,
  config: { componentsPath: string },
  options: InstallOptions
): Promise<DependencyConflictAction> {
  if (!installState.dependencyColliding.length || options.overwrite) {
    return options.overwrite ? "replace" : "reuse"
  }

  console.log()
  console.log(chalk.bold("Some dependency components already exist:"))
  installState.dependencyColliding.forEach((componentName) => {
    const component = componentEntries.get(componentName)
    if (!component) return

    console.log(
      chalk.dim(
        `  - ${componentName} -> ${describeInstallTarget(component, config.componentsPath, options.path)}`
      )
    )
  })

  if (options.yes) {
    console.log()
    console.log(`${chalk.green("✔")} Reuse existing files`)
    return "reuse"
  }

  console.log()
  const { dependencyAction } = await prompts({
    type: "select",
    name: "dependencyAction",
    message: "How should baseui-cn handle these existing dependencies?",
    choices: [
      {
        title: "Reuse existing files",
        description: "Keep project customizations and install only missing components.",
        value: "reuse",
      },
      {
        title: "Replace existing files",
        description: "Overwrite the listed dependency component files.",
        value: "replace",
      },
      {
        title: "Cancel",
        description: "Stop before installing the resolved components.",
        value: "cancel",
      },
    ],
    initial: 0,
  })

  return dependencyAction ?? "cancel"
}

async function resolveInstallTargets(
  installState: InstallState,
  componentEntries: Map<string, ComponentEntry>,
  config: { componentsPath: string },
  options: InstallOptions,
  dependencyAction: DependencyConflictAction
): Promise<string[]> {
  const { requestedColliding, dependencyColliding, fresh } = installState

  if (options.overwrite) {
    return [...fresh, ...requestedColliding, ...dependencyColliding]
  }

  const installable =
    dependencyAction === "replace" ? [...fresh, ...dependencyColliding] : [...fresh]

  if (!requestedColliding.length || options.yes) {
    if (requestedColliding.length && options.yes) {
      console.log()
      console.log(chalk.dim("Existing target files detected (skipping without --overwrite):"))
      requestedColliding.forEach((component) => console.log(chalk.dim(`  - ${component}`)))
    }
    return installable
  }

  console.log()
  console.log(chalk.bold("Existing requested component files:"))
  requestedColliding.forEach((componentName) => {
    const component = componentEntries.get(componentName)
    if (!component) return

    console.log(
      chalk.dim(
        `  - ${componentName} -> ${describeInstallTarget(component, config.componentsPath, options.path)}`
      )
    )
  })
  console.log()

  const { replaceExisting } = await prompts({
    type: "confirm",
    name: "replaceExisting",
    message: `Replace ${requestedColliding.length} requested component${requestedColliding.length !== 1 ? "s" : ""} with existing target files?`,
    initial: true,
  })

  return replaceExisting ? [...installable, ...requestedColliding] : installable
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
    return relativeToCwd(resolveInstallFilePath(firstFile.path, defaultComponentsPath, customPath))
  }

  const firstFile = component.files[0]!
  return `${relativeToCwd(resolveInstallFilePath(firstFile.path, defaultComponentsPath, customPath))} +${component.files.length - 1} files`
}
