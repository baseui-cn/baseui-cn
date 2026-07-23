export const siteConfig = {
  name: "baseui-cn",
  url: "https://baseui-cn.com",
  github: "https://github.com/baseui-cn/baseui-cn",
  npm: "https://www.npmjs.com/package/baseui-cn",
  version: "1.3.3",
  description:
    "Copy-paste React components built with Base UI and Tailwind CSS, including buttons, forms, data display, OTP fields, and production-ready date and time pickers.",
  baseUIVersion: "^1.6.0",
  license: "MIT",
} as const

export type SiteConfig = typeof siteConfig
