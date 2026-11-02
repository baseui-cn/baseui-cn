import { typography } from "./typography.generated"
import type { ThemeOptions } from "./theme-options"

export function fontDependencies(options: ThemeOptions): string[] {
  return [
    ...new Set(
      [options.bodyFont, options.headingFont].flatMap((id) => {
        const preset = id ? typography.fonts[id as keyof typeof typography.fonts] : undefined
        return preset?.package ? [`${preset.package}@${preset.version}`] : []
      })
    ),
  ]
}

// CSS imports work through the app's existing Tailwind v4 pipeline in every
// framework. Package-relative font URLs become consumer-owned build assets.
export function applyTypography(css: string, options: ThemeOptions): string {
  const imports = new Set<string>()
  for (const key of ["bodyFont", "headingFont"] as const) {
    const id = options[key]
    if (!id) continue
    const preset = typography.fonts[id as keyof typeof typography.fonts]
    preset.imports.forEach((entry) => imports.add(`@import "${entry}";`))
    const dimension = key === "bodyFont" ? "body" : "heading"
    const start = `/* baseui-cn ${dimension} typography */`
    const end = `/* end baseui-cn ${dimension} typography */`
    const block = `${start}\n:root, .dark { --font-${dimension}: ${preset.family}; }\n${
      key === "bodyFont"
        ? `body { font-family: var(--font-body); }\n@theme inline { --font-sans: var(--font-body); }`
        : `h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading); }`
    }\n${end}`
    const from = css.indexOf(start),
      to = css.indexOf(end, from)
    css =
      from >= 0 && to >= 0
        ? css.slice(0, from) + block + css.slice(to + end.length)
        : css.trimEnd() + "\n\n" + block + "\n"
  }
  const missing = [...imports].filter((entry) => !css.includes(entry))
  return missing.length ? missing.join("\n") + "\n" + css : css
}
