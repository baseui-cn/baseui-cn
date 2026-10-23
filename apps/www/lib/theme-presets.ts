import theme from "./__generated__/theme.json"

export const themePresets = theme.presets
export type ColorPreset = keyof typeof themePresets.colors
export type RadiusPreset = keyof typeof themePresets.radii
export const defaultColor = themePresets.defaultColor as ColorPreset
export const defaultRadius = themePresets.defaultRadius as RadiusPreset
export function themeVariables(color: ColorPreset, radius: RadiusPreset, mode: "light" | "dark") {
  return {
    ...theme.light,
    ...(mode === "dark" ? theme.dark : {}),
    ...themePresets.colors[color][mode],
    "--radius": themePresets.radii[radius].value,
    "--control-radius": "var(--radius)",
  }
}
