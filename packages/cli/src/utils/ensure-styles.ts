import path from "path"
import fs from "fs-extra"
import chalk from "chalk"
import ora from "ora"
import type { Config } from "./config"

const BASEUI_CN_MARKER = "/* baseui-cn theme */"

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

function hasThemeVariables(css: string): boolean {
  return (
    css.includes(BASEUI_CN_MARKER) ||
    css.includes("--background: oklch") ||
    css.includes("--background: hsl")
  )
}

function hasThemeBlock(css: string): boolean {
  return css.includes("--color-background: var(--background)")
}

function hasTailwindImport(css: string): boolean {
  return /(?:@import\s+["']tailwindcss["']|@tailwind\s+base)/.test(css)
}

/**
 * Ensures the user's global CSS file has the baseui-cn theme variables
 * and the Tailwind @theme mapping block. Creates the file if it doesn't exist.
 *
 * Returns true if changes were made, false if everything was already in place.
 */
export async function ensureThemeCSS(
  config: Config,
  options: { silent?: boolean } = {}
): Promise<boolean> {
  if (!config.tailwind) return false

  const cssPath = path.resolve(config.globalCss)
  const spinner = options.silent ? null : ora("Checking theme styles...").start()
  let changed = false

  if (await fs.pathExists(cssPath)) {
    let css = await fs.readFile(cssPath, "utf-8")

    // Inject @theme inline block if missing
    if (!hasThemeBlock(css)) {
      if (hasTailwindImport(css)) {
        css = css.replace(
          /(@import\s+["']tailwindcss["'];?\n?|@tailwind\s+base;?\n?)/,
          `$1\n${TAILWIND_THEME_BLOCK}`
        )
      } else {
        css = TAILWIND_THEME_BLOCK + "\n" + css
      }
      changed = true
    }

    // Inject :root / .dark CSS variables if missing
    if (!hasThemeVariables(css)) {
      css = css + "\n" + BASE_CSS_VARIABLES
      changed = true
    }

    if (changed) {
      await fs.writeFile(cssPath, css)
      spinner?.succeed(`Theme styles added to ${chalk.cyan(config.globalCss)}`)
    } else {
      spinner?.succeed("Theme styles already present")
    }
  } else {
    // CSS file doesn't exist — create it from scratch
    await fs.ensureDir(path.dirname(cssPath))
    await fs.writeFile(
      cssPath,
      `@import "tailwindcss";\n${TAILWIND_THEME_BLOCK}\n${BASE_CSS_VARIABLES}`
    )
    spinner?.succeed(`Global CSS created at ${chalk.cyan(config.globalCss)}`)
    changed = true
  }

  return changed
}

export { BASEUI_CN_MARKER, BASE_CSS_VARIABLES, TAILWIND_THEME_BLOCK }
