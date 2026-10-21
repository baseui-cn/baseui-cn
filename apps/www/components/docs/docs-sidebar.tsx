"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { navSections } from "@/lib/registry"
import { ScrollArea } from "@/components/ui/scroll-area"

export function DocsNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav aria-label="Documentation" className="docs-navigation">
      {navSections.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          <ul>
            {section.items.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  onClick={onNavigate}
                >
                  <span>{item.label}</span>
                  {item.badge && <span className="docs-nav-badge">{item.badge}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  )
}

export function DocsSidebar() {
  return (
    <aside className="docs-sidebar">
      <ScrollArea className="h-full" aria-label="Documentation navigation scroll area">
        <DocsNavigation />
      </ScrollArea>
    </aside>
  )
}
