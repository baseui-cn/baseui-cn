import Link from "next/link"
import { navSections } from "@/lib/registry"

export function DocsSidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 overflow-y-auto sticky top-0 h-screen">
      <nav className="px-3 py-6 flex flex-col gap-6">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              {section.title}
            </p>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center justify-between rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    {item.label}
                    {item.badge && (
                      <span className="text-[9px] font-semibold bg-foreground text-background rounded px-1 py-0.5 leading-none">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
