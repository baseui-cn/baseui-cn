#!/usr/bin/env node

import { Command } from "commander"
import { init } from "./commands/init"
import { add } from "./commands/add"
import { list } from "./commands/list"
import { update } from "./commands/update"
import { create } from "./commands/create"
import { inProject } from "./utils/project"

const program = new Command()

program
  .name("baseui-cn")
  .description("Add Base UI components to your React app - one command at a time.")
  .version("1.4.0")

program
  .command("init")
  .description("Initialize baseui-cn in your project. Sets up Tailwind, CSS variables, and utils.")
  .option("-y, --yes", "Skip confirmation prompts and use defaults", false)
  .option("-d, --defaults", "Use default configuration", false)
  .option("--css <path>", "Stylesheet file to update with theme variables")
  .option("--skip-tailwind", "Skip Tailwind CSS configuration", false)
  .option("--workspace <path>", "Target an application workspace relative to its root")
  .option("--customize", "Choose component, utility, RSC and stylesheet settings")
  .option(
    "--color <preset>",
    "Set theme color: iris, blue, violet, emerald, orange, rose or neutral"
  )
  .option("--radius <preset>", "Set radius: sm (Sharp), md (Medium), lg (Rounded), xl (Extra)")
  .action((options) => inProject(options, () => init(options)))

program
  .command("create [name]")
  .description(
    "Create an application with its official framework scaffolder and initialize baseui-cn."
  )
  .option("--framework <framework>", "next, tanstack-start, react-router or vite")
  .option("--package-manager <manager>", "npm, pnpm, yarn (2+) or bun")
  .option("--monorepo", "Create a workspace with the application in apps/web")
  .option("--color <preset>", "Theme color (default iris)")
  .option("--radius <preset>", "Radius: sm, md, lg or xl (default lg)")
  .option("-y, --yes", "Use defaults for unspecified framework, manager and structure")
  .action((name, options) => create(name, options))

program
  .command("add [components...]")
  .description("Add one or more components to your project.")
  .option("-y, --yes", "Skip confirmation prompts", false)
  .option("-o, --overwrite", "Overwrite existing requested and dependency component files", false)
  .option("-a, --all", "Add all available components", false)
  .option("--css <path>", "Stylesheet file to update with theme variables")
  .option("-p, --path <path>", "Custom path to add components to")
  .option("--workspace <path>", "Target an application workspace relative to its root")
  .action((components, options) => inProject(options, () => add(components, options)))

program
  .command("list")
  .description("List all available installables in the registry.")
  .option("--json", "Output as JSON")
  .action(list)

program
  .command("update [components...]")
  .description("Replace existing installed components with the latest registry versions.")
  .option("-y, --yes", "Skip confirmation prompts", false)
  .option("-a, --all", "Update all available components", false)
  .option("--css <path>", "Stylesheet file to update with theme variables")
  .option("-p, --path <path>", "Custom path to update components in")
  .option("--workspace <path>", "Target an application workspace relative to its root")
  .action((components, options) => inProject(options, () => update(components, options)))

program.parseAsync().catch((error: Error) => {
  console.error(`\n${error.message}\n`)
  process.exitCode = 1
})
