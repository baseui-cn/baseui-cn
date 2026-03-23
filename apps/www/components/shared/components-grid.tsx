"use client"

import * as React from "react"
import Link from "next/link"
import type { ComponentMeta } from "@/lib/registry"

const TAGS = ["All", "Display", "Form", "Overlay", "Navigation", "Layout"] as const

function matchesTag(comp: ComponentMeta, tag: string): boolean {
  if (tag === "All") return true
  const t = tag.toLowerCase()
  return comp.tags.some((ct) => ct.startsWith(t))
}

export function ComponentsGrid({ components }: { components: ComponentMeta[] }) {
  const [search, setSearch] = React.useState("")
  const [activeTag, setActiveTag] = React.useState<string>("All")

  const filtered = components.filter((comp) => {
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      comp.name.includes(q) ||
      comp.description.toLowerCase().includes(q) ||
      (comp.baseUIPrimitive?.toLowerCase().includes(q) ?? false)
    return matchSearch && matchesTag(comp, activeTag)
  })

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            viewBox="0 0 16 16"
            fill="none"
          >
            <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search components…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeTag === tag
                  ? "bg-foreground text-background"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-muted-foreground">No components match &ldquo;{search}&rdquo;</p>
          <button
            onClick={() => { setSearch(""); setActiveTag("All") }}
            className="mt-2 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-px bg-border">
          {filtered.map((comp) => (
            <Link
              key={comp.name}
              href={`/docs/components/${comp.name}`}
              className="group bg-background p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-sm text-foreground">{comp.name}</span>
                {comp.badge && (
                  <span className="shrink-0 text-[9px] font-semibold bg-foreground text-background rounded px-1 py-0.5 leading-none">
                    {comp.badge}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {comp.description}
              </p>
              {comp.baseUIPrimitive && (
                <p className="mt-2 text-[10px] font-mono text-muted-foreground/40">
                  {comp.baseUIPrimitive}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-4 text-center">
        <span className="text-xs text-muted-foreground">
          {filtered.length} of {components.length} components
        </span>
      </div>
    </>
  )
}
