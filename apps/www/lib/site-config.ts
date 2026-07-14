export const siteConfig = {
  name: "baseui-cn",
  url: "https://baseui-cn.com",
  github: "https://github.com/baseui-cn/baseui-cn",
  version: "1.2.2",
  description:
    "Copy-paste React components built with Base UI and Tailwind CSS, including buttons, forms, data display, OTP fields, and production-ready date pickers.",
  baseUIVersion: "^1.6.0",
  license: "MIT",
} as const

export type SiteConfig = typeof siteConfig
