import path from "path"
import fs from "fs-extra"
import chalk from "chalk"
import ora from "ora"
import type { Config } from "./config"
import {
  validateThemeOptions,
  type ThemeOptions,
  type ColorPreset,
  type RadiusPreset,
} from "./theme-options"

const BASEUI_CN_MARKER = "/* baseui-cn theme */"

import {
  themeInline as REQUIRED_THEME_INLINE,
  themeRoot as REQUIRED_ROOT_VARS,
  themeDark as REQUIRED_DARK_VARS,
  themeStrategy,
  themeFoundation,
  themePresets,
} from "./theme.generated"

// ── Full blocks (used only when creating from scratch) ────────────────

function buildBlock(selector: string, vars: Record<string, string>): string {
  const lines = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n")
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
  blockContent = blockContent
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, "")
  let m: RegExpExecArray | null
  while ((m = regex.exec(blockContent)) !== null) {
    if (m[1]) {
      vars.add(m[1])
    }
  }
  return vars
}

/** Find real blocks, including indented/layered and grouped selectors.
 * Ignore comments, quoted strings and their braces. Missing defaults go into
 * the first matching block; values in every existing matching block win.
 */
function findBlocks(css: string, selector: string): Array<{ start: number; end: number }> {
  const blocks: Array<{ start: number; end: number }> = []
  const stack: Array<{ start: number; matches: boolean }> = []
  let headerStart = 0
  let quote = ""
  let comment = false
  for (let i = 0; i < css.length; i++) {
    const ch = css[i]
    if (comment) {
      if (ch === "*" && css[i + 1] === "/") {
        comment = false
        i++
      }
      continue
    }
    if (quote) {
      if (ch === "\\") {
        i++
        continue
      }
      if (ch === quote) quote = ""
      continue
    }
    if (ch === "/" && css[i + 1] === "*") {
      comment = true
      i++
      continue
    }
    if (ch === '"' || ch === "'") {
      quote = ch
      continue
    }
    if (ch === "{") {
      const header = css
        .slice(headerStart, i)
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\s+/g, " ")
        .trim()
      const matches = header.split(",").some((part) => part.trim() === selector)
      stack.push({ start: i + 1, matches })
      headerStart = i + 1
    } else if (ch === "}") {
      const block = stack.pop()
      if (block?.matches) blocks.push({ start: block.start, end: i })
      headerStart = i + 1
    } else if (ch === ";") headerStart = i + 1
  }
  return blocks.sort((a, b) => a.start - b.start)
}

function mergeVarsIntoBlock(
  css: string,
  selector: string,
  required: Record<string, string>
): { css: string; changed: boolean; found: boolean } {
  const blocks = findBlocks(css, selector)
  const first = blocks[0]
  if (!first) return { css, changed: false, found: false }
  const existing = new Set(
    blocks.flatMap(({ start, end }) => [...extractVarNames(css.slice(start, end))])
  )
  const missing = Object.entries(required).filter(([name]) => !existing.has(name))
  if (!missing.length) return { css, changed: false, found: true }
  const lines = missing.map(([name, value]) => `  ${name}: ${value};`).join("\n")
  return {
    css: css.slice(0, first.end) + "\n" + lines + "\n" + css.slice(first.end),
    changed: true,
    found: true,
  }
}

// Keep comments/strings out of declaration matching while retaining positions.
function maskCSS(css: string) {
  return css.replace(/\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, (value) =>
    value.replace(/[^\n]/g, " ")
  )
}
export async function detectExistingTheme(globalCss: string) {
  if (!(await fs.pathExists(path.resolve(globalCss)))) return { color: false, radius: false }
  const css = maskCSS(await fs.readFile(path.resolve(globalCss), "utf8"))
  return {
    color: /--(?:primary|primary-foreground|accent|accent-foreground|ring)\s*:/.test(css),
    radius: /--radius\s*:/.test(css),
  }
}
function replaceRequestedVars(css: string, selector: string, requested: Record<string, string>) {
  for (const block of findBlocks(css, selector).reverse()) {
    const body = css.slice(block.start, block.end)
    const masked = maskCSS(body)
    const edits: { start: number; end: number; value: string }[] = []
    for (const match of masked.matchAll(/(--[\w-]+)\s*:\s*([^;{}]+)(?=;|$)/g)) {
      const value = requested[match[1]!]
      if (value === undefined) continue
      const start = match.index! + match[0].indexOf(":") + 1
      const end = match.index! + match[0].length
      const priority = /!\s*important\s*$/i.test(masked.slice(start, end)) ? " !important" : ""
      // Preserve declaration formatting when its value is already correct.
      if (body.slice(start, end).trim() === value + priority) continue
      edits.push({ start, end, value: ` ${value}${priority}` })
    }
    let updated = body
    for (const edit of edits.reverse())
      updated = updated.slice(0, edit.start) + edit.value + updated.slice(edit.end)
    css = css.slice(0, block.start) + updated + css.slice(block.end)
  }
  return css
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
  options: ThemeOptions & { silent?: boolean } = {}
): Promise<boolean> {
  validateThemeOptions(options)
  if (!config.tailwind) {
    if (options.color || options.radius)
      throw new Error(
        "Theme flags require theme CSS initialization. Enable tailwind in baseui-cn.json and omit --skip-tailwind."
      )
    return false
  }

  const color = themePresets.colors[(options.color ?? themePresets.defaultColor) as ColorPreset]
  const radius =
    themePresets.radii[(options.radius ?? themePresets.defaultRadius) as RadiusPreset].value
  const rootVars = { ...REQUIRED_ROOT_VARS, ...color.light, "--radius": radius }
  const darkVars = { ...REQUIRED_DARK_VARS, ...color.dark }
  const requestedRoot: Record<string, string> = {
    ...(options.color ? color.light : {}),
    ...(options.radius ? { "--radius": radius } : {}),
  }
  const requestedDark: Record<string, string> = {
    ...(options.color ? color.dark : {}),
    ...(options.radius ? { "--radius": radius } : {}),
  }

  const cssPath = path.resolve(config.globalCss)
  const spinner = options.silent ? null : ora("Checking theme styles...").start()

  if (await fs.pathExists(cssPath)) {
    let css = await fs.readFile(cssPath, "utf-8")
    let changed = false
    // An existing root semantic override may intentionally cover both themes.
    // Do not introduce a dark default that would shadow it on .dark roots.
    const existingRootNames = new Set(
      findBlocks(css, ":root").flatMap(({ start, end }) => [
        ...extractVarNames(css.slice(start, end)),
      ])
    )
    const darkDefaults = Object.fromEntries(
      Object.entries({ ...darkVars, ...requestedDark }).filter(
        ([name]) => !existingRootNames.has(name) || Object.hasOwn(requestedDark, name)
      )
    )

    // Preserve all existing CSS, including customized legacy injection blocks.
    if (!/@custom-variant\s+dark\b/.test(css.replace(/\/\*[\s\S]*?\*\//g, ""))) {
      css += "\n\n" + themeStrategy
      changed = true
    }
    if (!css.includes("/* baseui-cn foundation */")) {
      css += "\n\n" + themeFoundation
      changed = true
    }

    // ── Step 2: @theme inline — merge or create ───────────────────
    const themeResult = mergeVarsIntoBlock(css, "@theme inline", REQUIRED_THEME_INLINE)
    if (themeResult.changed) {
      css = themeResult.css
      changed = true
    } else if (!themeResult.found) {
      const themeBlock = buildBlock("@theme inline", REQUIRED_THEME_INLINE)
      if (/(?:@import\s+['"]tailwindcss['"]|@tailwind\s+base)/.test(css)) {
        css = css.replace(
          /(@import\s+['"]tailwindcss['"];?\n?|@tailwind\s+base;?\n?)/,
          `$1\n${themeBlock}\n`
        )
      } else {
        css = themeBlock + "\n\n" + css
      }
      changed = true
    }

    // ── Step 3: :root — merge or create ───────────────────────────
    // Respect existing blocks inside cascade layers as well as top-level CSS.
    const rootResult = mergeVarsIntoBlock(css, ":root", rootVars)
    if (rootResult.changed) {
      css = rootResult.css
      changed = true
    } else if (!rootResult.found) {
      css += "\n\n" + buildBlock(":root", rootVars)
      changed = true
    }

    // ── Step 4: .dark — merge or create ───────────────────────────
    const darkResult = mergeVarsIntoBlock(css, ".dark", darkDefaults)
    if (darkResult.changed) {
      css = darkResult.css
      changed = true
    } else if (!darkResult.found) {
      css += "\n\n" + buildBlock(".dark", darkDefaults)
      changed = true
    }

    // ── Step 5: Accordion utilities ───────────────────────────────
    if (!css.includes("accordion-down")) {
      css += "\n\n" + UTILITIES_BLOCK
      changed = true
    }

    const beforeSelection = css
    css = replaceRequestedVars(css, ":root", requestedRoot)
    css = replaceRequestedVars(css, ".dark", requestedDark)
    if (css !== beforeSelection) changed = true

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
    themeStrategy,
    "",
    buildBlock("@theme inline", REQUIRED_THEME_INLINE),
    "",
    buildBlock(":root", rootVars),
    "",
    buildBlock(".dark", { ...darkVars, ...requestedDark }),
    "",
    UTILITIES_BLOCK,
    "",
    themeFoundation,
    "",
  ].join("\n")
  await fs.writeFile(cssPath, fresh)
  spinner?.succeed(`Global CSS created at ${chalk.cyan(config.globalCss)}`)
  return true
}

export { BASEUI_CN_MARKER }
