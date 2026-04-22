import { changelogEntries } from "@/lib/changelog"
import { siteConfig } from "@/lib/site-config"

export function GET() {
  const items = changelogEntries
    .map(
      (entry) => `
        <item>
          <title><![CDATA[${entry.title}]]></title>
          <link>${siteConfig.url}/docs/changelog#${entry.slug}</link>
          <guid>${siteConfig.url}/docs/changelog#${entry.slug}</guid>
          <pubDate>${new Date(entry.isoDate).toUTCString()}</pubDate>
          <description><![CDATA[${entry.summary}]]></description>
        </item>`.trim()
    )
    .join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${siteConfig.name} changelog</title>
    <link>${siteConfig.url}/docs/changelog</link>
    <description>Product updates, component releases, docs improvements, and installability changes across ${siteConfig.name}.</description>
    <language>en-us</language>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
