import typography from "./__generated__/typography.json"

export { typography }
export type BodyFont = (typeof typography.bodyFonts)[number] & keyof typeof typography.fonts
export type HeadingFont = (typeof typography.headingFonts)[number] & keyof typeof typography.fonts
export function typographyVariables(bodyFont: BodyFont, headingFont: HeadingFont) {
  return {
    "--font-body": typography.fonts[bodyFont].family,
    "--font-heading": typography.fonts[headingFont].family,
  }
}
