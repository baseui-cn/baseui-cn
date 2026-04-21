import { components } from "@/lib/registry"
import { siteConfig } from "@/lib/site-config"
import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url
  const now = new Date()

  const staticPages = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/docs`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/docs/installation`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/docs/theming`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/docs/llms`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/docs/changelog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ] as MetadataRoute.Sitemap

  const componentPages = components.map((c) => ({
    url: `${base}/docs/components/${c.name}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return [...staticPages, ...componentPages]
}
