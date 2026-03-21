"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { cn } from "@/lib/utils"

export interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  className?: string
  label?: string
  error?: string
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  disabled,
  className,
  label,
  error,
}: ComboboxProps) {
  const [inputValue, setInputValue] = React.useState(
    options.find(o => o.value === value)?.label ?? ""
  )
  const inputId = React.useId()

  const filtered = React.useMemo(
    () => options.filter(o => o.label.toLowerCase().includes(inputValue.toLowerCase())),
    [options, inputValue]
  )

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <ComboboxPrimitive.Root
        value={value}
        onValueChange={(val) => {
          onValueChange?.(val as string)
          const found = options.find(o => o.value === val)
          setInputValue(found?.label ?? "")
        }}
        disabled={disabled}
        inputValue={inputValue}
        onInputValueChange={(val) => setInputValue(val)}
      >
        <div className="relative">
          <ComboboxPrimitive.Input
            id={inputId}
            placeholder={placeholder}
            className={cn(
              "flex h-9 w-full rounded-lg border border-input bg-input/30 dark:bg-input/50 px-3 py-1 text-sm shadow-xs",
              "placeholder:text-muted-foreground",
              "transition-[color,box-shadow]",
              "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-destructive focus-visible:ring-destructive/20",
              className
            )}
            aria-invalid={!!error}
          />
          <ComboboxPrimitive.Trigger className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
            <svg className="size-4" viewBox="0 0 16 16" fill="none">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </ComboboxPrimitive.Trigger>
        </div>

        <ComboboxPrimitive.Portal>
          <ComboboxPrimitive.Positioner sideOffset={6}>
            <ComboboxPrimitive.Popup className={cn(
              "z-50 w-[var(--anchor-width)] overflow-hidden rounded-lg border border-border bg-popover shadow-md",
              "transition-all duration-150 origin-[var(--transform-origin)]",
              "data-[open]:opacity-100 data-[open]:scale-100",
              "data-[closed]:opacity-0 data-[closed]:scale-95",
              "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
            )}>
              <ComboboxPrimitive.List className="p-1 max-h-56 overflow-y-auto">
                {filtered.length === 0 ? (
                  <ComboboxPrimitive.Empty className="py-4 text-center text-sm text-muted-foreground">
                    {emptyText}
                  </ComboboxPrimitive.Empty>
                ) : (
                  filtered.map(opt => (
                    <ComboboxPrimitive.Item
                      key={opt.value}
                      value={opt.value}
                      disabled={opt.disabled}
                      className={cn(
                        "relative flex w-full cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none",
                        "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
                        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                        "data-[selected]:font-medium"
                      )}
                    >
                      {opt.label}
                    </ComboboxPrimitive.Item>
                  ))
                )}
              </ComboboxPrimitive.List>
            </ComboboxPrimitive.Popup>
          </ComboboxPrimitive.Positioner>
        </ComboboxPrimitive.Portal>
      </ComboboxPrimitive.Root>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
