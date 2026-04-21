"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAutocompleteFilter } from "@/components/ui/autocomplete"
import {
  Command,
  CommandCollection,
  CommandDialog,
  CommandDialogPopup,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
} from "@/components/ui/command"
import { navSections } from "@/lib/registry"
import { trackSearchOpen, trackSearchSelect } from "@/lib/events"

interface SearchItem {
  id: string
  label: string
  badge?: string
  href: string
}

interface SearchGroup {
  value: string
  items: SearchItem[]
}

const commandItems: SearchGroup[] = navSections.map((section) => ({
  value: section.title,
  items: section.items.map((item) => ({
    id: item.name,
    label: item.label,
    badge: item.badge,
    href: item.href,
  })),
}))

export function SiteSearch() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const { contains } = useAutocompleteFilter({ sensitivity: "base" })

  const filterItem = React.useCallback(
    (itemValue: unknown, query: string) => {
      if (typeof itemValue !== "object" || itemValue === null) {
        return false
      }

      const item = itemValue as SearchItem
      return contains(item.label, query) || contains(item.badge ?? "", query)
    },
    [contains]
  )

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

  const handleSelect = React.useCallback(
    (item: SearchItem) => {
      setOpen(false)
      trackSearchSelect(item.id)
      router.push(item.href)
    },
    [router]
  )

  return (
    <>
      <button
        onClick={() => {
          trackSearchOpen("click")
          setOpen(true)
        }}
        className="hidden md:inline-flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="hidden lg:inline">Search components...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground lg:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandDialogPopup>
          <Command filter={filterItem} items={commandItems}>
            <CommandInput placeholder="Search components..." />
            <CommandPanel>
              <CommandEmpty>No components found.</CommandEmpty>
              <CommandList>
                {(group: SearchGroup) => (
                  <CommandGroup key={group.value} items={group.items}>
                    <CommandGroupLabel>{group.value}</CommandGroupLabel>
                    <CommandCollection>
                      {(item: SearchItem) => (
                        <CommandItem key={item.id} onClick={() => handleSelect(item)} value={item}>
                          <span className="flex-1">{item.label}</span>
                          {item.badge ? (
                            <span className="text-xs text-muted-foreground">{item.badge}</span>
                          ) : null}
                        </CommandItem>
                      )}
                    </CommandCollection>
                  </CommandGroup>
                )}
              </CommandList>
            </CommandPanel>
          </Command>
        </CommandDialogPopup>
      </CommandDialog>
    </>
  )
}
