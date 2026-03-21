"use client"

import * as React from "react"
import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete"
import { cn } from "@/lib/utils"

export interface AutocompleteOption {
  value: string
  label: string
  disabled?: boolean
}

export interface AutocompleteProps {
  options: AutocompleteOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  emptyText?: string
  label?: string
  error?: string
  disabled?: boolean
  className?: string
}

export function Autocomplete({
  options,
  value,
  onValueChange,
  placeholder = "Search...",
  emptyText = "No results found.",
  label,
  error,
  disabled,
  className,
}: AutocompleteProps) {
  const inputId = React.useId()

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <AutocompletePrimitive.Root
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <div className="relative">
          <AutocompletePrimitive.Input
            id={inputId}
            placeholder={placeholder}
            className={cn(
              "flex h-9 w-full rounded-lg border border-input bg-input/30 dark:bg-input/50 px-3 py-1 text-sm shadow-xs",
              "placeholder:text-muted-foreground text-foreground",
              "transition-[color,box-shadow]",
              "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-destructive focus-visible:ring-destructive/20",
              className
            )}
            aria-invalid={!!error}
          />
          <AutocompletePrimitive.Trigger className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            <svg className="size-4" viewBox="0 0 16 16" fill="none">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </AutocompletePrimitive.Trigger>
          <AutocompletePrimitive.Clear className="absolute right-7 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            <svg className="size-4" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </AutocompletePrimitive.Clear>
        </div>

        <AutocompletePrimitive.Portal>
          <AutocompletePrimitive.Positioner sideOffset={6}>
            <AutocompletePrimitive.Popup className={cn(
              "z-50 w-[var(--anchor-width)] overflow-hidden rounded-lg border border-border bg-popover shadow-md outline-none",
              "transition-all duration-150 origin-[var(--transform-origin)]",
              "data-[open]:opacity-100 data-[open]:scale-100",
              "data-[closed]:opacity-0 data-[closed]:scale-95",
              "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
            )}>
              <AutocompletePrimitive.List className="p-1 max-h-56 overflow-y-auto">
                <AutocompletePrimitive.Empty className="py-4 text-center text-sm text-muted-foreground">
                  {emptyText}
                </AutocompletePrimitive.Empty>
                {options.map(opt => (
                  <AutocompletePrimitive.Item
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                    className={cn(
                      "relative flex w-full cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none",
                      "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
                      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    )}
                  >
                    {opt.label}
                  </AutocompletePrimitive.Item>
                ))}
              </AutocompletePrimitive.List>
            </AutocompletePrimitive.Popup>
          </AutocompletePrimitive.Positioner>
        </AutocompletePrimitive.Portal>
      </AutocompletePrimitive.Root>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
