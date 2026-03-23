import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [],
    },
    sitemap: "https://baseui-cn.com/sitemap.xml",
    host: "https://baseui-cn.com",
  }
}
