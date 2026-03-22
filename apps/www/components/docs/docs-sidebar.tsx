"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { navSections } from "@/lib/registry"

export function DocsSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 overflow-y-auto sticky top-0 h-screen">
      <nav className="px-3 py-6 flex flex-col gap-6">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              {section.title}
            </p>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors ${
                        isActive
                          ? "bg-accent text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      {item.label}
                      {item.badge && (
                        <span className="text-[9px] font-semibold bg-foreground text-background rounded px-1 py-0.5 leading-none">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
