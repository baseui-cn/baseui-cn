"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { cn } from "@/lib/utils"

interface CommandItem {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
  shortcut?: string
  group?: string
  onSelect?: () => void
  disabled?: boolean
}

interface CommandProps {
  items: CommandItem[]
  placeholder?: string
  emptyText?: string
  className?: string
  onSelect?: (item: CommandItem) => void
}

function Command({
  items,
  placeholder = "Type a command or search...",
  emptyText = "No results found.",
  className,
  onSelect,
}: CommandProps) {
  const [search, setSearch] = React.useState("")
  const [activeIndex, setActiveIndex] = React.useState(0)

  const filtered = React.useMemo(
    () =>
      items.filter(
        (i) =>
          i.label.toLowerCase().includes(search.toLowerCase()) ||
          i.description?.toLowerCase().includes(search.toLowerCase())
      ),
    [items, search]
  )

  const groups = React.useMemo(() => {
    const map = new Map<string, CommandItem[]>()
    filtered.forEach((item) => {
      const key = item.group ?? ""
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(item)
    })
    return map
  }, [filtered])

  const flatItems = filtered.filter((i) => !i.disabled)

  React.useEffect(() => {
    setActiveIndex(0)
  }, [search])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, flatItems.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      const item = flatItems[activeIndex]
      if (item) {
        item.onSelect?.()
        onSelect?.(item)
      }
    }
  }

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-lg bg-popover text-popover-foreground",
        className
      )}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center border-b border-border px-3">
        <svg className="mr-2 size-4 shrink-0 text-muted-foreground" viewBox="0 0 16 16" fill="none">
          <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          className="flex h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-muted-foreground hover:text-foreground"
          >
            <svg className="size-4" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="max-h-72 overflow-y-auto p-1">
        {filtered.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">{emptyText}</div>
        ) : (
          Array.from(groups.entries()).map(([group, groupItems]) => (
            <div key={group}>
              {group && (
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{group}</div>
              )}
              {groupItems.map((item) => {
                const flatIdx = flatItems.indexOf(item)
                const isActive = flatIdx === activeIndex && !item.disabled
                return (
                  <button
                    key={item.id}
                    disabled={item.disabled}
                    className={cn(
                      "relative flex w-full cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors",
                      "disabled:pointer-events-none disabled:opacity-50",
                      isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                    )}
                    onClick={() => {
                      item.onSelect?.()
                      onSelect?.(item)
                    }}
                  >
                    {item.icon && (
                      <span className="flex size-4 items-center justify-center">{item.icon}</span>
                    )}
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.description && (
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    )}
                    {item.shortcut && (
                      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                        {item.shortcut}
                      </kbd>
                    )}
                  </button>
                )
              })}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

interface CommandDialogProps extends CommandProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

function CommandDialog({ open, onOpenChange, trigger, ...commandProps }: CommandDialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogPrimitive.Trigger>{trigger}</DialogPrimitive.Trigger>}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/50 data-open:opacity-100adata-closed:opacity-0ata-[starting-style]:opacity-0 transition-opacity duration-200" />
        <DialogPrimitive.Popup
          className={cn(
            "fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-popover shadow-2xl",
            "transition-all duration-200",
            "data-open:opacity-100adata-open:scale-100adata-open:-translate-x-1/2",
            "data-closed:opacity-0 data-closed:scale-95 data-closed:-translate-x-1/2",
            "data-starting-style:opacity-0 data-starting-style:scale-95 data-starting-style:-translate-x-1/2"
          )}
        >
          <Command {...commandProps} />
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export { Command, CommandDialog }
export type { CommandItem }
