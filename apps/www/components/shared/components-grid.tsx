"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRightIcon,
  CalendarDays,
  Clock3,
  RefreshCw,
  SearchIcon,
  Sparkles,
  TableProperties,
  XIcon,
} from "lucide-react"
import { CopyButton } from "@/components/shared/copy-button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
    id: "date-picker",
    label: "Date Picker",
    featured: true,
    matches: (component) => component.name === "date-picker",
  },
  {
    id: "time-picker",
    label: "Time Picker",
    featured: true,
    matches: (component) => component.name === "time-picker",
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
    href: "/docs/components/data-grid",
    icon: TableProperties,
    label: "Data Grid",
    description:
      "Build sortable, editable data surfaces with reusable columns, row actions, and loading states.",
    cta: "Open data-grid docs",
  },
  {
    href: "/docs/components/data-grid#async-editing-with-optimistic-rollback",
    icon: RefreshCw,
    label: "Optimistic Update",
    description:
      "Explore inline editing with pending states, optimistic commits, failure feedback, and rollback handling.",
    cta: "Open optimistic update demo",
  },
  {
    href: "/docs/components/date-picker",
    icon: CalendarDays,
    label: "Date Picker",
    description:
      "Single date, date range, presets, forms, formats, and theme-aware styling in one registry install.",
    cta: "Open date-picker docs",
  },
  {
    href: "/docs/components/time-picker",
    icon: Clock3,
    label: "Time Picker",
    description:
      "Desktop, mobile, and static time selection with formats, steps, constraints, and form-ready controls.",
    cta: "Open time-picker docs",
  },
] as const

export function ComponentsGrid({ components }: { components: ComponentMeta[] }) {
  const [search, setSearch] = React.useState("")
  const [activeFilter, setActiveFilter] = React.useState<string>("all")

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
            Explore the Data Grid, optimistic editing workflow, Date Picker, and the new Time
            Picker.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
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
                  <div className="mt-3 text-xs font-medium text-primary">
                    {feature.cta}
                    <ArrowRightIcon className="size-3 inline-block ml-1 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              )
            })}
          </div>
        </AlertDescription>
      </Alert>

      <div className="mb-6 space-y-3">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <InputGroup className="w-full lg:w-72">
            <InputGroupInput
              aria-label="Search"
              placeholder="Search installables..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              type="search"
            />
            <InputGroupAddon>
              <SearchIcon aria-hidden="true" />
            </InputGroupAddon>
            {search && (
              <InputGroupAddon align="inline-end" className="pointer-events-auto">
                <Button variant="ghost" size="icon-xs" onClick={() => setSearch("")}>
                  <XIcon aria-hidden="true" />
                </Button>
              </InputGroupAddon>
            )}
          </InputGroup>

          <span className="text-xs text-muted-foreground sr-only">
            Quick filters for the most-used component groups
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((filter) => (
            <Button
              size="xs"
              className="rounded-2xl"
              variant={activeFilter === filter.id ? "default" : "outline"}
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-muted-foreground">
            No installables match &ldquo;{search}&rdquo;
          </p>
          <Button
            variant="ghost"
            onClick={() => {
              setSearch("")
              setActiveFilter("all")
            }}
            className="mt-2 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((component) => (
            <div
              key={component.name}
              className="flex min-h-40 flex-col justify-between rounded-2xl border border-border/70 bg-background p-5 shadow-xs/5 transition-all hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-lg hover:shadow-black/5"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/docs/components/${component.name}`}
                      className="text-base font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {component.label}
                    </Link>
                  </div>
                  {component.badge ? (
                    <Badge variant="success-outline" size="sm" shape="pill">
                      {component.badge}
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {component.description}
                </p>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/20 px-3 py-1">
                  <code className="min-w-0 truncate font-mono text-[11px] text-foreground">
                    npx baseui-cn add {component.name}
                  </code>
                  <CopyButton size="icon-xs" text={`npx baseui-cn add ${component.name}`} />
                </div>

                <Link
                  href={`/docs/components/${component.name}`}
                  className="px-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  View docs
                  <ArrowRightIcon className="size-3 inline-block ml-1 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-center">
        <span className="text-xs text-muted-foreground">
          {filtered.length} of {components.length} installables
        </span>
      </div>
    </>
  )
}
