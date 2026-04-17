#!/usr/bin/env node

import { Command } from "commander"
import { init } from "./commands/init"
import { add } from "./commands/add"
import { list } from "./commands/list"
import { update } from "./commands/update"

const program = new Command()

program
  .name("baseui-cn")
  .description("Add Base UI components to your React app - one command at a time.")
  .version("1.0.2")

program
  .command("init")
  .description("Initialize baseui-cn in your project. Sets up Tailwind, CSS variables, and utils.")
  .option("-y, --yes", "Skip confirmation prompts and use defaults", false)
  .option("-d, --defaults", "Use default configuration", false)
  .option("--css <path>", "Stylesheet file to update with theme variables")
  .option("--skip-tailwind", "Skip Tailwind CSS configuration", false)
  .action(init)

program
  .command("add [components...]")
  .description("Add one or more components to your project.")
  .option("-y, --yes", "Skip confirmation prompts", false)
  .option("-o, --overwrite", "Overwrite existing files", false)
  .option("-a, --all", "Add all available components", false)
  .option("--css <path>", "Stylesheet file to update with theme variables")
  .option("-p, --path <path>", "Custom path to add components to")
  .action(add)

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
  .action(update)

program.parse()
