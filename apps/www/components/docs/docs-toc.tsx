"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export interface TocItem {
  title: string
  url: string
  depth: number
  items?: TocItem[]
}

function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = React.useState<string | null>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "0% 0% -80% 0%" }
    )
    for (const id of itemIds) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => {
      for (const id of itemIds) {
        const el = document.getElementById(id)
        if (el) observer.unobserve(el)
      }
    }
  }, [itemIds])

  return activeId
}

function flattenToc(items: TocItem[]): TocItem[] {
  return items.flatMap((item) => [item, ...(item.items ? flattenToc(item.items) : [])])
}

function scrollToAnchor(href: string) {
  const id = href.replace("#", "")
  const target = document.getElementById(id)

  if (!target) return

  target.scrollIntoView({ behavior: "smooth", block: "start" })
  window.history.replaceState(null, "", href)
}

// ── Sidebar list variant (desktop right column) ────────────────────────────
export function DocsToc({
  toc,
  className,
}: {
  toc: TocItem[]
  className?: string
}) {
  const flat = React.useMemo(() => flattenToc(toc), [toc])
  const ids = React.useMemo(() => flat.map((i) => i.url.replace("#", "")), [flat])
  const activeId = useActiveItem(ids)

  if (!flat.length) return null

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-widest">
        On This Page
      </p>
      {flat.map((item) => (
        <a
          key={item.url}
          href={item.url}
          onClick={(event) => {
            event.preventDefault()
            scrollToAnchor(item.url)
          }}
          data-active={`#${activeId}` === item.url}
          className={cn(
            "text-sm text-muted-foreground hover:text-foreground transition-[color,transform] no-underline hover:translate-x-0.5",
            "data-[active=true]:text-foreground data-[active=true]:font-medium",
            item.depth === 3 && "pl-4",
            item.depth === 4 && "pl-6"
          )}
        >
          {item.title}
        </a>
      ))}
    </div>
  )
}

// ── Dropdown variant (mobile) ──────────────────────────────────────────────
export function DocsTocDropdown({
  toc,
  className,
}: {
  toc: TocItem[]
  className?: string
}) {
  const flat = React.useMemo(() => flattenToc(toc), [toc])

  if (!flat.length) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" className={cn("h-8 gap-1.5", className)}>
            <svg className="size-4" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            On This Page
          </Button>
        }
      />
      <DropdownMenuContent align="start" className="max-h-[70svh] overflow-y-auto">
        {flat.map((item) => (
          <DropdownMenuItem
            key={item.url}
            className={cn(item.depth === 3 && "pl-6", item.depth === 4 && "pl-8")}
          >
            <a
              href={item.url}
              className="w-full"
              onClick={(event) => {
                event.preventDefault()
                scrollToAnchor(item.url)
              }}
            >
              {item.title}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
