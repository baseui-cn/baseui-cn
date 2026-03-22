import path from "path"
import fs from "fs-extra"
import chalk from "chalk"
import ora from "ora"
import prompts from "prompts"
import { execa } from "execa"
import { detectPackageManager } from "../utils/package-manager"
import { getConfig, writeConfig } from "../utils/config"

// ── Markers we use to detect our injected CSS ─────────────────────────────
// We check for the baseui-cn marker comment OR the oklch primary value.
// This handles both fresh installs and re-runs.
const BASEUI_CN_MARKER = "/* baseui-cn theme */"
const DETECT_STRINGS = [
  BASEUI_CN_MARKER,
  "--background: oklch",
  "--color-background: var(--background)",
]

const BASE_CSS_VARIABLES = `
${BASEUI_CN_MARKER}
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.141 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.141 0 0);
  --primary: oklch(0.21 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.967 0 0);
  --secondary-foreground: oklch(0.21 0 0);
  --muted: oklch(0.967 0 0);
  --muted-foreground: oklch(0.552 0 0);
  --accent: oklch(0.967 0 0);
  --accent-foreground: oklch(0.21 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --radius: 0.5rem;
}

.dark {
  --background: oklch(0.141 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.141 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.141 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.21 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.396 0.141 25.723);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.552 0 0);
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
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
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

function hasOurTheme(css: string): boolean {
  return DETECT_STRINGS.some((s) => css.includes(s))
}

function hasThemeBlock(css: string): boolean {
  return css.includes("--color-background: var(--background)")
}

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
    `${isNextJs ? "Next.js" : "React"} project detected` +
    (hasSrcDir ? " · src/ dir" : "") +
    (hasAppDir ? " · App Router" : "")
  )

  // Build default config
  let config = {
    componentsPath: hasSrcDir ? "src/components/ui" : "components/ui",
    utilsPath: hasSrcDir ? "src/lib/utils" : "lib/utils",
    globalCss: hasSrcDir
      ? hasAppDir ? "src/app/globals.css" : "src/styles/globals.css"
      : hasAppDir ? "app/globals.css" : "styles/globals.css",
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
    utilsSpinner.info(`Utils already exists — skipped`)
  }

  // Create components/ui directory
  await fs.ensureDir(path.resolve(config.componentsPath))

  // ── CSS injection ──────────────────────────────────────────────────────
  if (config.tailwind) {
    const cssSpinner = ora("Adding CSS variables...").start()
    const cssPath = path.resolve(config.globalCss)

    if (await fs.pathExists(cssPath)) {
      let css = await fs.readFile(cssPath, "utf-8")
      let changed = false

      // 1. Inject @theme inline block if not present (Tailwind v4)
      if (!hasThemeBlock(css)) {
        if (css.includes('@import "tailwindcss"')) {
          // Insert right after the tailwindcss import line
          css = css.replace(
            /(@import "tailwindcss";?\n?)/,
            `$1\n${TAILWIND_THEME_BLOCK}`
          )
        } else if (css.includes("@tailwind base")) {
          // Tailwind v3 — append theme block before @tailwind directives
          css = css.replace(
            /(@tailwind base)/,
            `${TAILWIND_THEME_BLOCK}\n$1`
          )
        } else {
          // No import found — prepend
          css = TAILWIND_THEME_BLOCK + "\n" + css
        }
        changed = true
      }

      // 2. Inject :root / .dark variables if not present
      if (!hasOurTheme(css)) {
        css = css + "\n" + BASE_CSS_VARIABLES
        changed = true
      }

      if (changed) {
        await fs.writeFile(cssPath, css)
        cssSpinner.succeed(`CSS variables added to ${chalk.cyan(config.globalCss)}`)
      } else {
        cssSpinner.info("CSS variables already present — skipped")
      }
    } else {
      // Create globals.css from scratch
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
  console.log("  " + chalk.cyan("npx baseui-cn add button") + "          Add a component")
  console.log("  " + chalk.cyan("npx baseui-cn add --all") + "           Add everything")
  console.log("  " + chalk.cyan("npx baseui-cn list") + "                See all components")
  console.log()
  console.log("  " + chalk.dim("Docs: https://baseui-cn.com"))
  console.log()
}
