export const siteConfig = {
  name: "baseui-cn",
  url: "https://baseui-cn.com",
  github: "https://github.com/baseui-cn/baseui-cn",
  version: "1.0.0",
  description:
    "A Base UI-first open component registry. 40+ components built exclusively on @base-ui/react. shadcn-style install.",
  baseUIVersion: ">=1.3.0",
  license: "MIT",
} as const

export type SiteConfig = typeof siteConfig
