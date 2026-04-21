export const siteConfig = {
  name: "baseui-cn",
  url: "https://baseui-cn.com",
  github: "https://github.com/baseui-cn/baseui-cn",
  version: "1.0.0",
  description:
    "Open-source shadcn-style Base UI components for React and Next.js. Copy accessible components into your project, own the code, and style them with Tailwind CSS.",
  baseUIVersion: ">=1.3.0",
  license: "MIT",
} as const

export type SiteConfig = typeof siteConfig
