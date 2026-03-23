import path from "path"
import fs from "fs-extra"
import chalk from "chalk"
import ora from "ora"
import prompts from "prompts"
import { execa } from "execa"
import { getConfig } from "../utils/config"
import {
  fetchRegistry,
  fetchComponent,
  resolveComponentDependencies,
} from "../utils/registry"
import { detectPackageManager } from "../utils/package-manager"
import { ensureThemeCSS } from "../utils/ensure-styles"
import { init } from "./init"

export async function add(
  components: string[],
  options: {
    yes: boolean
    overwrite: boolean
    all: boolean
    path?: string
  }
) {
  let config = await getConfig()

  if (!config) {
    console.log()
    console.log(chalk.dim("baseui-cn is not initialized. Running init first..."))
    console.log()
    await init({ yes: false, defaults: false, skipTailwind: false })
    config = await getConfig()
    if (!config) return
  }

  // --all flag: grab every component from registry
  if (options.all) {
    const registry = await fetchRegistry()
    components = registry.components.map((c: { name: string }) => c.name)
    console.log()
    console.log(chalk.bold(`Adding all ${components.length} components...`))
    console.log()
  }

  // No components specified — interactive picker
  if (!components.length) {
    const registry = await fetchRegistry()

    const { selected } = await prompts({
      type: "multiselect",
      name: "selected",
      message: "Which components would you like to add?",
      choices: registry.components.map(
        (c: { name: string; description: string; type: string }) => ({
          title: c.name,
          description: c.description,
          value: c.name,
          ...(c.type === "block" ? { title: `[block] ${c.name}` } : {}),
        })
      ),
      hint: "Space to select · Enter to confirm · A to select all",
    })

    if (!selected?.length) {
      console.log(chalk.dim("No components selected."))
      return
    }

    components = selected
  }

  // Resolve full dependency tree
  const resolveSpinner = ora("Resolving dependencies...").start()
  const allComponents = await resolveComponentDependencies(components)
  const toInstall = options.overwrite
    ? allComponents
    : await filterExisting(allComponents, config, options.path)

  resolveSpinner.succeed(
    `${allComponents.length} component${allComponents.length !== 1 ? "s" : ""} resolved`
  )

  if (!toInstall.length) {
    console.log()
    console.log(
      chalk.dim("All selected components already exist. Use --overwrite to replace.")
    )
    return
  }

  // Confirm
  if (!options.yes) {
    console.log()
    console.log("Components to add:")
    toInstall.forEach((c) => console.log(chalk.cyan(`  + ${c}`)))
    console.log()

    const { confirm } = await prompts({
      type: "confirm",
      name: "confirm",
      message: `Add ${toInstall.length} component${toInstall.length !== 1 ? "s" : ""}?`,
      initial: true,
    })

    if (!confirm) return
  }

  // Ensure theme CSS is present before writing components
  await ensureThemeCSS(config)

  // Collect npm deps across all components
  const allNpmDeps: string[] = []

  // Write each component
  for (const componentName of toInstall) {
    const spinner = ora(`Adding ${componentName}...`).start()

    try {
      const component = await fetchComponent(componentName)

      if (component.dependencies?.required) {
        allNpmDeps.push(...component.dependencies.required)
      }

      const basePath = options.path
        ? path.resolve(options.path)
        : path.resolve(config.componentsPath)

      for (const file of component.files) {
        const filePath = path.join(basePath, file.path)
        await fs.ensureDir(path.dirname(filePath))
        await fs.writeFile(filePath, file.content)
      }

      spinner.succeed(
        `${componentName} ${chalk.dim(`→ ${config.componentsPath}/${componentName}.tsx`)}`
      )
    } catch (err) {
      spinner.fail(`Failed to add ${componentName}`)
      console.log(chalk.dim(`  ${err}`))
    }
  }

  // Install npm deps (deduplicated, exclude already-required @base-ui/react)
  const uniqueDeps = [...new Set(allNpmDeps)].filter(Boolean)

  if (uniqueDeps.length) {
    const depsSpinner = ora("Installing npm dependencies...").start()
    const pm = await detectPackageManager()

    try {
      await execa(pm, [pm === "npm" ? "install" : "add", ...uniqueDeps])
      depsSpinner.succeed("Dependencies installed")
    } catch {
      depsSpinner.fail("Failed to install dependencies")
      console.log(
        chalk.dim(`  Run manually: npm install ${uniqueDeps.join(" ")}`)
      )
    }
  }

  console.log()
  console.log(chalk.green("✓") + " Done. Components are yours — edit freely.")
  console.log()
}

async function filterExisting(
  components: string[],
  config: { componentsPath: string },
  customPath?: string
): Promise<string[]> {
  const basePath = customPath
    ? path.resolve(customPath)
    : path.resolve(config.componentsPath)

  const existing: string[] = []
  const missing: string[] = []

  for (const name of components) {
    const filePath = path.join(basePath, `${name}.tsx`)
    if (await fs.pathExists(filePath)) {
      existing.push(name)
    } else {
      missing.push(name)
    }
  }

  if (existing.length) {
    console.log()
    console.log(chalk.dim("Already installed (skipping):"))
    existing.forEach((c) => console.log(chalk.dim(`  · ${c}`)))
  }

  return missing
}
