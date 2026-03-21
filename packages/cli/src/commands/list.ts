import chalk from "chalk"
import { fetchRegistry } from "../utils/registry"

export async function list(options: { json: boolean }) {
  const registry = await fetchRegistry()

  if (options.json) {
    console.log(JSON.stringify(registry.components, null, 2))
    return
  }

  console.log()
  console.log(chalk.bold(`Available components (${registry.components.length})`))
  console.log()

  for (const component of registry.components) {
    const tags = component.tags?.length
      ? chalk.dim(` [${component.tags.join(", ")}]`)
      : ""
    console.log(`  ${chalk.cyan(component.name.padEnd(24))}${component.description}${tags}`)
  }

  console.log()
}
