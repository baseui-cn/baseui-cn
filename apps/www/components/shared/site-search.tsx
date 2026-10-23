"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { SearchIcon } from "lucide-react"
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
  const trigger = React.useRef<HTMLButtonElement>(null)
  const returnFocus = React.useRef<HTMLElement | null>(null)
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
          if (!prev) {
            returnFocus.current =
              document.activeElement instanceof HTMLElement
                ? document.activeElement
                : trigger.current
            trackSearchOpen("shortcut")
          }
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
      <Button
        ref={trigger}
        variant="outline"
        size="icon-xl"
        type="button"
        aria-label="Search documentation"
        onClick={() => {
          returnFocus.current = trigger.current
          trackSearchOpen("click")
          setOpen(true)
        }}
        className="site-search-trigger"
      >
        <SearchIcon className="size-3.5" aria-hidden="true" />
        <span className="hidden lg:inline">Search documentation...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[12px] font-medium text-muted-foreground lg:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandDialogPopup finalFocus={returnFocus} aria-label="Search documentation">
          <Command filter={filterItem} items={commandItems}>
            <CommandInput placeholder="Search documentation..." />
            <CommandPanel>
              <CommandEmpty>No results. Try a component name or installation.</CommandEmpty>
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
