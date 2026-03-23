"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CommandDialog, type CommandItem } from "@/components/ui/command"
import { navSections } from "@/lib/registry"
import { trackSearchOpen, trackSearchSelect } from "@/lib/events"

const commandItems: CommandItem[] = navSections.flatMap((section) =>
  section.items.map((item) => ({
    id: item.name,
    label: item.label,
    group: section.title,
    description: item.badge,
    onSelect: undefined as (() => void) | undefined,
    href: item.href,
  }))
)

export function SiteSearch() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((prev) => {
          if (!prev) trackSearchOpen("shortcut")
          return !prev
        })
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  const items: CommandItem[] = React.useMemo(
    () =>
      commandItems.map((item) => ({
        ...item,
        onSelect: () => {
          setOpen(false)
          trackSearchSelect(item.id)
          router.push((item as CommandItem & { href: string }).href)
        },
      })),
    [router]
  )

  return (
    <>
      <button
        onClick={() => {
          trackSearchOpen("click")
          setOpen(true)
        }}
        className="hidden md:inline-flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="hidden lg:inline">Search components…</span>
        <kbd className="pointer-events-none hidden lg:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        items={items}
        placeholder="Search components…"
        emptyText="No components found."
      />
    </>
  )
}
