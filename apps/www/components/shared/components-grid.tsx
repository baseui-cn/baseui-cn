"use client"

import * as React from "react"
import Link from "next/link"
import { Sparkles, TerminalSquare, TableProperties } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import type { ComponentMeta } from "@/lib/registry"

type FilterDefinition = {
  id: string
  label: string
  featured?: boolean
  matches: (component: ComponentMeta) => boolean
}

const matchesTagPrefix = (component: ComponentMeta, tag: string) => {
  const normalized = tag.toLowerCase()
  return component.tags.some((componentTag) => componentTag.startsWith(normalized))
}

const FILTERS: FilterDefinition[] = [
  { id: "all", label: "All", matches: () => true },
  {
    id: "command",
    label: "AI Command",
    featured: true,
    matches: (component) => component.name === "command",
  },
  {
    id: "data-grid",
    label: "Data Grid",
    featured: true,
    matches: (component) => component.name === "data-grid",
  },
  {
    id: "display",
    label: "Display",
    matches: (component) => matchesTagPrefix(component, "display"),
  },
  {
    id: "form",
    label: "Form",
    matches: (component) => matchesTagPrefix(component, "form"),
  },
  {
    id: "overlay",
    label: "Overlay",
    matches: (component) => matchesTagPrefix(component, "overlay"),
  },
  {
    id: "navigation",
    label: "Navigation",
    matches: (component) => matchesTagPrefix(component, "navigation"),
  },
  {
    id: "layout",
    label: "Layout",
    matches: (component) => matchesTagPrefix(component, "layout"),
  },
  {
    id: "block",
    label: "Block",
    matches: (component) => component.type === "block" || matchesTagPrefix(component, "block"),
  },
]

const FEATURED_INSTALLABLES = [
  {
    href: "/docs/components/command",
    icon: TerminalSquare,
    label: "Try AI Command Search Demo",
    description:
      "Open the richer command palette demo with grouped results, keyboard flows, and AI-style search interactions.",
    cta: "Open command docs",
  },
  {
    href: "/docs/components/data-grid",
    icon: TableProperties,
    label: "Try Data Grid Optimistic Updates",
    description:
      "Explore inline editing, pending states, rollback handling, and the optimistic update workflow in one installable family.",
    cta: "Open data-grid docs",
  },
] as const

export function ComponentsGrid({ components }: { components: ComponentMeta[] }) {
  const [search, setSearch] = React.useState("")
  const [activeFilter, setActiveFilter] = React.useState<string>("all")
  const authBlocks = components.filter(
    (component) => component.name === "login" || component.name === "signup"
  )

  const filtered = components.filter((component) => {
    const query = search.toLowerCase()
    const matchesSearch =
      !query ||
      component.name.toLowerCase().includes(query) ||
      component.label.toLowerCase().includes(query) ||
      component.description.toLowerCase().includes(query) ||
      component.tags.some((tag) => tag.toLowerCase().includes(query)) ||
      (component.baseUIPrimitive?.toLowerCase().includes(query) ?? false)

    const selectedFilter = FILTERS.find((filter) => filter.id === activeFilter) ?? FILTERS[0]

    return matchesSearch && selectedFilter.matches(component)
  })

  return (
    <>
      <Alert className="mb-6 border-border/80 bg-muted/40">
        <Sparkles className="size-4 text-primary" />
        <AlertTitle className="flex flex-wrap items-center gap-2">
          Start with the newest interactive demos
          <Badge variant="success" size="sm" shape="pill">
            New
          </Badge>
        </AlertTitle>
        <AlertDescription>
          <p>
            The fastest way to understand what is different here is to try the AI command search
            demo and the optimistic-editing data grid demo first.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {FEATURED_INSTALLABLES.map((feature) => {
              const Icon = feature.icon

              return (
                <Link
                  key={feature.href}
                  href={feature.href}
                  className="group rounded-xl border border-border bg-background px-4 py-4 transition-colors hover:bg-accent/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Icon className="size-4 text-primary" />
                        {feature.label}
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                    <Badge variant="info-outline" size="sm" shape="pill" className="shrink-0">
                      Demo
                    </Badge>
                  </div>
                  <div className="mt-3 text-xs font-medium text-primary">{feature.cta} →</div>
                </Link>
              )
            })}
          </div>
        </AlertDescription>
      </Alert>

      <div className="mb-6 space-y-3">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M11 11l3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search installables..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <span className="text-xs text-muted-foreground">
            Quick filters for the most-used component groups
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeFilter === filter.id
                  ? "bg-foreground text-background"
                  : filter.featured
                    ? "border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-muted-foreground">
            No installables match &ldquo;{search}&rdquo;
          </p>
          <button
            onClick={() => {
              setSearch("")
              setActiveFilter("all")
            }}
            className="mt-2 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((component) => (
            <Link
              key={component.name}
              href={`/docs/components/${component.name}`}
              className="group bg-background p-4 transition-colors hover:bg-accent/50"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-sm text-foreground">{component.name}</span>
                {component.badge && (
                  <span className="shrink-0 rounded bg-foreground px-1 py-0.5 text-[9px] font-semibold leading-none text-background">
                    {component.badge}
                  </span>
                )}
              </div>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {component.description}
              </p>
              {/* {component.baseUIPrimitive && (
                <p className="mt-2 font-mono text-[10px] text-primary/80">
                  {component.baseUIPrimitive}
                </p>
              )} */}
            </Link>
          ))}
        </div>
      )}

      {authBlocks.length > 0 ? (
        <div className="mt-6 grid gap-3 rounded-xl border border-border bg-muted/20 p-4 md:grid-cols-2">
          {authBlocks.map((block) => (
            <Link
              key={block.name}
              href={`/docs/components/${block.name}`}
              className="rounded-lg border border-border bg-background px-4 py-3 transition-colors hover:bg-accent/30"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-foreground">{block.label}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{block.description}</p>
                </div>
                <Badge variant="info-outline" size="sm" shape="pill">
                  Block
                </Badge>
              </div>
              <div className="mt-3 font-mono text-[11px] text-muted-foreground">
                installs from {block.installedPath}
              </div>
            </Link>
          ))}
        </div>
      ) : null}

      <div className="mt-4 text-center">
        <span className="text-xs text-muted-foreground">
          {filtered.length} of {components.length} installables
        </span>
      </div>
    </>
  )
}
