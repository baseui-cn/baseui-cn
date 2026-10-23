import Link from "next/link"
import { siteConfig } from "@/lib/site-config"

export function SiteFooter({ compact = false }: { compact?: boolean }) {
  return (
    <footer className={compact ? "site-footer site-footer-compact" : "site-footer"}>
      <div className="site-footer-inner">
        <p>
          baseui-cn <span aria-hidden="true">·</span> Copy and own.
        </p>
        <nav aria-label="Footer">
          {[
            ["Docs", "/docs"],
            ["Components", "/docs/components/button"],
            ["GitHub", siteConfig.github],
            ["npm", siteConfig.npm],
            ["Changelog", "/docs/changelog"],
            ["License", `${siteConfig.github}/blob/main/LICENSE`],
            ...(!compact
              ? [
                  ["Base UI", "https://base-ui.com"],
                  ["llms.txt", "/llms.txt"],
                ]
              : []),
          ].map(([label, href]) => (
            <Link key={label} href={href}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
