import prompts from "prompts"
import { promptOptions } from "./project"
import { themePresets } from "./theme.generated"

export type ColorPreset = keyof typeof themePresets.colors
export type RadiusPreset = keyof typeof themePresets.radii
export interface ThemeOptions {
  color?: string
  radius?: string
}
export function validateThemeOptions(options: ThemeOptions) {
  if (options.color !== undefined && !Object.hasOwn(themePresets.colors, options.color))
    throw new Error(
      `Invalid color: ${options.color}. Choose ${Object.keys(themePresets.colors).join(", ")}.`
    )
  if (options.radius !== undefined && !Object.hasOwn(themePresets.radii, options.radius))
    throw new Error(
      `Invalid radius: ${options.radius}. Choose ${Object.keys(themePresets.radii).join(", ")}.`
    )
}
export function themeQuestions(
  options: ThemeOptions,
  existing = { color: false, radius: false }
): prompts.PromptObject[] {
  return [
    {
      type: options.color ? null : "select",
      name: "color",
      message: "Theme color",
      initial: existing.color
        ? 0
        : Object.keys(themePresets.colors).indexOf(themePresets.defaultColor),
      choices: [
        ...(existing.color ? [{ title: "Keep existing color values", value: "keep" }] : []),
        ...Object.entries(themePresets.colors).map(([value, preset]) => ({
          title: preset.label,
          value,
        })),
      ],
    },
    {
      type: options.radius ? null : "select",
      name: "radius",
      message: "Radius",
      initial: existing.radius
        ? 0
        : Object.keys(themePresets.radii).indexOf(themePresets.defaultRadius),
      choices: [
        ...(existing.radius ? [{ title: "Keep existing radius", value: "keep" }] : []),
        ...Object.entries(themePresets.radii).map(([value, preset]) => ({
          title: preset.label,
          value,
        })),
      ],
    },
  ]
}
export async function chooseThemeOptions(
  options: ThemeOptions,
  existing: { color: boolean; radius: boolean },
  interactive: boolean,
  ask = prompts
): Promise<ThemeOptions> {
  validateThemeOptions(options)
  const answers = interactive
    ? await ask(themeQuestions(options, existing) as prompts.PromptObject[], promptOptions)
    : {}
  const selected = {
    color: options.color ?? (answers.color === "keep" ? undefined : answers.color),
    radius: options.radius ?? (answers.radius === "keep" ? undefined : answers.radius),
  }
  validateThemeOptions(selected)
  return selected
}
