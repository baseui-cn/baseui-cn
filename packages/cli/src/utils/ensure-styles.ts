import path from "path"
import fs from "fs-extra"
import chalk from "chalk"
import ora from "ora"
import type { Config } from "./config"

const BASEUI_CN_MARKER = "/* baseui-cn theme */"

// ── Required variables for each CSS block ─────────────────────────────

const REQUIRED_THEME_INLINE: Record<string, string> = {
  "--color-background": "var(--background)",
  "--color-foreground": "var(--foreground)",
  "--color-card": "var(--card)",
  "--color-card-foreground": "var(--card-foreground)",
  "--color-popover": "var(--popover)",
  "--color-popover-foreground": "var(--popover-foreground)",
  "--color-primary": "var(--primary)",
  "--color-primary-foreground": "var(--primary-foreground)",
  "--color-secondary": "var(--secondary)",
  "--color-secondary-foreground": "var(--secondary-foreground)",
  "--color-muted": "var(--muted)",
  "--color-muted-foreground": "var(--muted-foreground)",
  "--color-accent": "var(--accent)",
  "--color-accent-foreground": "var(--accent-foreground)",
  "--color-destructive": "var(--destructive)",
  "--color-destructive-foreground": "var(--destructive-foreground)",
  "--color-border": "var(--border)",
  "--color-input": "var(--input)",
  "--color-ring": "var(--ring)",
  "--radius-sm": "calc(var(--radius) - 4px)",
  "--radius-md": "calc(var(--radius) - 2px)",
  "--radius-lg": "var(--radius)",
  "--radius-xl": "calc(var(--radius) + 4px)",
}

const REQUIRED_ROOT_VARS: Record<string, string> = {
  "--background": "oklch(1 0 0)",
  "--foreground": "oklch(0.141 0 0)",
  "--card": "oklch(1 0 0)",
  "--card-foreground": "oklch(0.141 0 0)",
  "--popover": "oklch(1 0 0)",
  "--popover-foreground": "oklch(0.141 0 0)",
  "--primary": "oklch(0.21 0 0)",
  "--primary-foreground": "oklch(0.985 0 0)",
  "--secondary": "oklch(0.967 0 0)",
  "--secondary-foreground": "oklch(0.21 0 0)",
  "--muted": "oklch(0.967 0 0)",
  "--muted-foreground": "oklch(0.552 0 0)",
  "--accent": "oklch(0.967 0 0)",
  "--accent-foreground": "oklch(0.21 0 0)",
  "--destructive": "oklch(0.577 0.245 27.325)",
  "--destructive-foreground": "oklch(0.985 0 0)",
  "--border": "oklch(0.922 0 0)",
  "--input": "oklch(0.922 0 0)",
  "--ring": "oklch(0.708 0 0)",
  "--radius": "0.5rem",
}

const REQUIRED_DARK_VARS: Record<string, string> = {
  "--background": "oklch(0.141 0 0)",
  "--foreground": "oklch(0.985 0 0)",
  "--card": "oklch(0.141 0 0)",
  "--card-foreground": "oklch(0.985 0 0)",
  "--popover": "oklch(0.141 0 0)",
  "--popover-foreground": "oklch(0.985 0 0)",
  "--primary": "oklch(0.985 0 0)",
  "--primary-foreground": "oklch(0.21 0 0)",
  "--secondary": "oklch(0.269 0 0)",
  "--secondary-foreground": "oklch(0.985 0 0)",
  "--muted": "oklch(0.269 0 0)",
  "--muted-foreground": "oklch(0.708 0 0)",
  "--accent": "oklch(0.269 0 0)",
  "--accent-foreground": "oklch(0.985 0 0)",
  "--destructive": "oklch(0.396 0.141 25.723)",
  "--destructive-foreground": "oklch(0.985 0 0)",
  "--border": "oklch(1 0 0 / 10%)",
  "--input": "oklch(1 0 0 / 15%)",
  "--ring": "oklch(0.552 0 0)",
}

// ── Full blocks (used only when creating from scratch) ────────────────

function buildBlock(selector: string, vars: Record<string, string>): string {
  const lines = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join("\n")
  return `${selector} {\n${lines}\n}`
}

const UTILITIES_BLOCK = `@layer utilities {
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
}`

// ── Helpers ───────────────────────────────────────────────────────────

function extractVarNames(blockContent: string): Set<string> {
  const vars = new Set<string>()
  const regex = /(--[\w-]+)\s*:/g
  let m: RegExpExecArray | null
  while ((m = regex.exec(blockContent)) !== null) {
    vars.add(m[1])
  }
  return vars
}

/**
 * Remove any previously-appended baseui-cn injection block.
 * Our marker is always appended at the end, so we strip from there onward.
 */
function stripPreviousInjection(css: string): string {
  const idx = css.indexOf(BASEUI_CN_MARKER)
  if (idx === -1) return css
  return css.slice(0, idx).trimEnd() + "\n"
}

/**
 * Find a CSS block matching `regex` and add any missing variables from
 * `required` into it. Returns the modified CSS and whether it changed.
 */
function mergeVarsIntoBlock(
  css: string,
  blockRegex: RegExp,
  required: Record<string, string>,
): { css: string; changed: boolean } {
  const match = css.match(blockRegex)
  if (!match) return { css, changed: false }

  const [fullMatch, content] = match
  const existing = extractVarNames(content)
  const missing = Object.entries(required).filter(([n]) => !existing.has(n))

  if (!missing.length) return { css, changed: false }

  const lines = missing.map(([n, v]) => `  ${n}: ${v};`).join("\n")
  const newBlock = fullMatch.replace(/\}\s*$/, `${lines}\n}`)

  return { css: css.replace(fullMatch, newBlock), changed: true }
}

// ── Main entry point ──────────────────────────────────────────────────

/**
 * Ensures the user's global CSS file has all baseui-cn theme variables.
 *
 * Instead of blindly appending, this function **merges** missing variables
 * into the user's existing `:root`, `@theme inline`, and `.dark` blocks.
 * This handles the common case where a user's project already has partial
 * CSS variables (e.g. a default Next.js project with `--background` and
 * `--foreground` only).
 */
export async function ensureThemeCSS(
  config: Config,
  options: { silent?: boolean } = {},
): Promise<boolean> {
  if (!config.tailwind) return false

  const cssPath = path.resolve(config.globalCss)
  const spinner = options.silent ? null : ora("Checking theme styles...").start()

  if (await fs.pathExists(cssPath)) {
    let css = await fs.readFile(cssPath, "utf-8")
    let changed = false

    // ── Step 1: Remove any previous baseui-cn injection ───────────
    const stripped = stripPreviousInjection(css)
    if (stripped !== css) {
      css = stripped
      changed = true
    }

    // ── Step 2: @theme inline — merge or create ───────────────────
    const themeResult = mergeVarsIntoBlock(
      css,
      /@theme\s+inline\s*\{([^}]*)\}/,
      REQUIRED_THEME_INLINE,
    )
    if (themeResult.changed) {
      css = themeResult.css
      changed = true
    } else if (!/@theme\s+inline/.test(css)) {
      const themeBlock = buildBlock("@theme inline", REQUIRED_THEME_INLINE)
      if (/(?:@import\s+['"]tailwindcss['"]|@tailwind\s+base)/.test(css)) {
        css = css.replace(
          /(@import\s+['"]tailwindcss['"];?\n?|@tailwind\s+base;?\n?)/,
          `$1\n${themeBlock}\n`,
        )
      } else {
        css = themeBlock + "\n\n" + css
      }
      changed = true
    }

    // ── Step 3: :root — merge or create ───────────────────────────
    // Use ^ anchor with multiline to match only top-level :root
    const rootResult = mergeVarsIntoBlock(
      css,
      /^:root\s*\{([^}]*)\}/m,
      REQUIRED_ROOT_VARS,
    )
    if (rootResult.changed) {
      css = rootResult.css
      changed = true
    } else if (!/^:root\s*\{/m.test(css)) {
      css += "\n\n" + buildBlock(":root", REQUIRED_ROOT_VARS)
      changed = true
    }

    // ── Step 4: .dark — merge or create ───────────────────────────
    const darkResult = mergeVarsIntoBlock(
      css,
      /^\.dark\s*\{([^}]*)\}/m,
      REQUIRED_DARK_VARS,
    )
    if (darkResult.changed) {
      css = darkResult.css
      changed = true
    } else if (!/^\.dark\s*\{/m.test(css)) {
      css += "\n\n" + buildBlock(".dark", REQUIRED_DARK_VARS)
      changed = true
    }

    // ── Step 5: Accordion utilities ───────────────────────────────
    if (!css.includes("accordion-down")) {
      css += "\n\n" + UTILITIES_BLOCK
      changed = true
    }

    if (changed) {
      await fs.writeFile(cssPath, css)
      spinner?.succeed(`Theme styles merged into ${chalk.cyan(config.globalCss)}`)
    } else {
      spinner?.succeed("Theme styles already present")
    }

    return changed
  }

  // ── File doesn't exist — create from scratch ────────────────────
  await fs.ensureDir(path.dirname(cssPath))
  const fresh = [
    '@import "tailwindcss";',
    "",
    buildBlock("@theme inline", REQUIRED_THEME_INLINE),
    "",
    buildBlock(":root", REQUIRED_ROOT_VARS),
    "",
    buildBlock(".dark", REQUIRED_DARK_VARS),
    "",
    UTILITIES_BLOCK,
    "",
  ].join("\n")
  await fs.writeFile(cssPath, fresh)
  spinner?.succeed(`Global CSS created at ${chalk.cyan(config.globalCss)}`)
  return true
}

export { BASEUI_CN_MARKER }
