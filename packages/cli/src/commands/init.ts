import path from "path"
import fs from "fs-extra"
import chalk from "chalk"
import ora from "ora"
import prompts from "prompts"
import { execa } from "execa"
import { detectPackageManager } from "../utils/package-manager"
import { getConfig, writeConfig } from "../utils/config"

const BASE_CSS_VARIABLES = `
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
  }
}

@layer utilities {
  @keyframes accordion-down {
    from { height: 0; opacity: 0; }
    to { height: var(--accordion-content-height); opacity: 1; }
  }
  @keyframes accordion-up {
    from { height: var(--accordion-content-height); opacity: 1; }
    to { height: 0; opacity: 0; }
  }
  .animate-accordion-down { animation: accordion-down 0.2s ease-out; }
  .animate-accordion-up { animation: accordion-up 0.2s ease-out; }
}
`

const TAILWIND_THEME_BLOCK = `
@theme {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}
`

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

  // Check if already initialized
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

  // Detect project structure
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
    `${isNextJs ? "Next.js" : "React"} project detected${hasSrcDir ? " · src/ dir" : ""}${hasAppDir ? " · App Router" : ""}`
  )

  // Build default config
  let config = {
    componentsPath: hasSrcDir ? "src/components/ui" : "components/ui",
    utilsPath: hasSrcDir ? "src/lib/utils" : "lib/utils",
    globalCss: hasSrcDir
      ? hasAppDir
        ? "src/app/globals.css"
        : "src/styles/globals.css"
      : hasAppDir
        ? "app/globals.css"
        : "styles/globals.css",
    tailwind: !options.skipTailwind,
    rsc: isNextJs && hasAppDir,
  }

  // Prompt for overrides unless skipping
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

  // Install dependencies
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

  // Write utils file
  const utilsSpinner = ora("Creating utils file...").start()
  const utilsFilePath = path.resolve(`${config.utilsPath}.ts`)
  await fs.ensureDir(path.dirname(utilsFilePath))
  if (!(await fs.pathExists(utilsFilePath))) {
    await fs.writeFile(utilsFilePath, UTILS_CONTENT)
    utilsSpinner.succeed(`Utils created at ${chalk.cyan(config.utilsPath + ".ts")}`)
  } else {
    utilsSpinner.info(`Utils already exists at ${chalk.cyan(config.utilsPath + ".ts")} — skipped`)
  }

  // Create components/ui directory
  await fs.ensureDir(path.resolve(config.componentsPath))

  // Inject CSS into globals
  if (config.tailwind) {
    const cssSpinner = ora("Adding CSS variables...").start()
    const cssPath = path.resolve(config.globalCss)

    if (await fs.pathExists(cssPath)) {
      let cssContent = await fs.readFile(cssPath, "utf-8")

      if (!cssContent.includes("--background")) {
        // Tailwind v4: add after @import "tailwindcss" if present
        if (cssContent.includes('@import "tailwindcss"')) {
          cssContent = cssContent.replace(
            '@import "tailwindcss"',
            `@import "tailwindcss"\n${TAILWIND_THEME_BLOCK}`
          )
        }
        cssContent += BASE_CSS_VARIABLES
        await fs.writeFile(cssPath, cssContent)
        cssSpinner.succeed(`CSS variables added to ${chalk.cyan(config.globalCss)}`)
      } else {
        cssSpinner.info("CSS variables already present — skipped")
      }
    } else {
      // Create globals.css from scratch (Tailwind v4)
      await fs.ensureDir(path.dirname(cssPath))
      await fs.writeFile(
        cssPath,
        `@import "tailwindcss";\n${TAILWIND_THEME_BLOCK}\n${BASE_CSS_VARIABLES}`
      )
      cssSpinner.succeed(`Global CSS created at ${chalk.cyan(config.globalCss)}`)
    }
  }

  // Save config file
  await writeConfig(config)

  console.log()
  console.log(chalk.green("✓") + " baseui-cn initialized successfully.")
  console.log()
  console.log("  Next steps:")
  console.log(
    "  " + chalk.cyan("npx baseui-cn add button") + "          Add a component"
  )
  console.log(
    "  " + chalk.cyan("npx baseui-cn add --all") + "           Add everything"
  )
  console.log(
    "  " + chalk.cyan("npx baseui-cn list") + "                See all components"
  )
  console.log()
  console.log(
    "  " + chalk.dim("Docs: https://baseui-cn.com")
  )
  console.log()
}
