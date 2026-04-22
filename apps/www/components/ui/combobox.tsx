"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { ChevronDownIcon, ChevronsUpDownIcon, XIcon, CheckIcon } from "lucide-react"

export const ComboboxContext: React.Context<{
  chipsRef: React.RefObject<Element | null> | null
  multiple: boolean
}> = React.createContext<{
  chipsRef: React.RefObject<Element | null> | null
  multiple: boolean
}>({
  chipsRef: null,
  multiple: false,
})

const Combobox = ComboboxPrimitive.Root

function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />
}

type ComboboxTriggerProps = ComboboxPrimitive.Trigger.Props & {
  /** Whether to render the built-in chevron icon. Defaults to `true`. */
  showIcon?: boolean
  /** Icon to render when `showIcon` is true. Defaults to `ChevronDownIcon`. */
  icon?: React.ReactNode
}

function ComboboxTrigger({
  className,
  children,
  showIcon = true,
  icon,
  ...props
}: ComboboxTriggerProps) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn("[&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      {children}
      {showIcon &&
        (icon ?? <ChevronDownIcon className="text-muted-foreground size-4 pointer-events-none" />)}
    </ComboboxPrimitive.Trigger>
  )
}

function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      render={<Button variant="ghost" size="icon-xs" />}
      className={cn(className)}
      {...props}
    >
      <XIcon className="pointer-events-none" />
    </ComboboxPrimitive.Clear>
  )
}

function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  autoFocus = true,
  startAddon,
  onChange,
  ...props
}: ComboboxPrimitive.Input.Props & {
  showTrigger?: boolean
  showClear?: boolean
  /**
   * Whether the input receives focus when the popup opens.
   * Defaults to `true` — standard combobox UX so the user can type immediately.
   * Pass `false` to opt out (e.g. on mobile where auto-keyboard is unwanted).
   */
  autoFocus?: boolean
  /**
   * Content rendered at the leading edge of the input.
   * Typically an icon like `<SearchIcon />` to hint the input is for searching.
   */
  startAddon?: React.ReactNode
}) {
  // Track the input's current text locally so we can show/hide the clear button
  // whenever the user has typed something, independent of Base UI's selection-based
  // visibility on ComboboxClear (which only shows when a value is selected).
  const [hasValue, setHasValue] = React.useState(false)

  const handleChange: NonNullable<ComboboxPrimitive.Input.Props["onChange"]> = (event) => {
    setHasValue(event.currentTarget.value !== "")
    onChange?.(event)
  }

  return (
    <InputGroup className={cn("w-auto", className)}>
      {startAddon && (
        <InputGroupAddon
          align="inline-start"
          className="text-muted-foreground [&_svg:not([class*='size-'])]:size-4"
        >
          {startAddon}
        </InputGroupAddon>
      )}
      <ComboboxPrimitive.Input
        render={<InputGroupInput disabled={disabled} />}
        autoFocus={autoFocus}
        onChange={handleChange}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        {showClear && hasValue && <ComboboxClear disabled={disabled} keepMounted />}
        {showTrigger && (
          <Button
            size="icon-xs"
            variant="ghost"
            render={<ComboboxTrigger />}
            data-slot="input-group-button"
            className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
            disabled={disabled}
          />
        )}
      </InputGroupAddon>
      {children}
    </InputGroup>
  )
}

function ComboboxContent({
  className,
  children,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    "side" | "align" | "sideOffset" | "alignOffset" | "anchor"
  >) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="isolate z-50"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          data-chips={!!anchor}
          className={cn(
            "bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/5 *:data-[slot=input-group]:bg-input/30 overflow-hidden rounded-md shadow-2xl ring-1 duration-100 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-9 *:data-[slot=input-group]:border-none *:data-[slot=input-group]:shadow-none data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 group/combobox-content relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+--spacing(7))] origin-(--transform-origin) data-[chips=true]:min-w-(--anchor-width)",
            className
          )}
          {...props}
        >
          {children}
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        "no-scrollbar max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 p-1 data-empty:p-0 overflow-y-auto overscroll-contain",
        className
      )}
      {...props}
    />
  )
}

type ComboboxItemProps = ComboboxPrimitive.Item.Props & {
  /**
   * Where to render the selected-state check indicator.
   * - `'right'` (default): indicator is absolute-positioned at the trailing edge.
   * - `'left'`: indicator occupies a dedicated grid column at the leading edge.
   */
  checkPosition?: "left" | "right"
}

function ComboboxItem({
  className,
  children,
  checkPosition = "right",
  ...props
}: ComboboxItemProps) {
  if (checkPosition === "left") {
    return (
      <ComboboxPrimitive.Item
        data-slot="combobox-item"
        data-check-position="left"
        className={cn(
          "data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground grid grid-cols-[1rem_1fr] items-center gap-2 rounded-md py-2 px-3 text-sm [&_svg:not([class*='size-'])]:size-4 w-full cursor-default outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
          className
        )}
        {...props}
      >
        <ComboboxPrimitive.ItemIndicator
          render={
            <span className="col-start-1 pointer-events-none flex size-4 items-center justify-center" />
          }
        >
          <CheckIcon className="pointer-events-none" />
        </ComboboxPrimitive.ItemIndicator>
        <div className="col-start-2 min-w-0">{children}</div>
      </ComboboxPrimitive.Item>
    )
  }

  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      data-check-position="right"
      className={cn(
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground gap-2.5 rounded-md py-2 pr-8 pl-3 text-sm [&_svg:not([class*='size-'])]:size-4 relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
        }
      >
        <CheckIcon className="pointer-events-none" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  )
}

function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
  return <ComboboxPrimitive.Group data-slot="combobox-group" className={cn(className)} {...props} />
}

function ComboboxLabel({ className, ...props }: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      className={cn("text-muted-foreground px-3.5 py-2.5 text-xs", className)}
      {...props}
    />
  )
}

function ComboboxCollection({ ...props }: ComboboxPrimitive.Collection.Props) {
  return <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "text-muted-foreground hidden w-full justify-center py-2 text-center text-sm group-data-empty/combobox-content:flex",
        className
      )}
      {...props}
    />
  )
}

function ComboboxStatus({ className, ...props }: ComboboxPrimitive.Status.Props) {
  return (
    <ComboboxPrimitive.Status
      data-slot="combobox-status"
      className={cn(
        "px-3 py-2 font-medium text-muted-foreground text-xs empty:m-0 empty:p-0",
        className
      )}
      {...props}
    />
  )
}

function ComboboxRow({ className, ...props }: ComboboxPrimitive.Row.Props) {
  return <ComboboxPrimitive.Row data-slot="combobox-row" className={cn(className)} {...props} />
}

function ComboboxSeparator({ className, ...props }: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn("bg-border/50 -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function ComboboxChips({
  className,
  children,
  startAddon,
  ...props
}: ComboboxPrimitive.Chips.Props & {
  startAddon?: React.ReactNode
}): React.ReactElement {
  const { chipsRef } = React.useContext(ComboboxContext)

  return (
    <ComboboxPrimitive.Chips
      className={cn(
        "relative inline-flex min-h-9 w-full flex-wrap gap-1 rounded-lg border border-input bg-background not-dark:bg-clip-padding p-[calc(--spacing(1)-1px)] text-base shadow-xs/5 outline-none ring-ring/24 transition-shadow *:min-h-7 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-disabled:not-focus-within:not-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] focus-within:border-ring focus-within:ring-[3px] has-disabled:pointer-events-none has-data-[size=lg]:min-h-10 has-data-[size=sm]:min-h-8 has-aria-invalid:border-destructive/36 has-autofill:bg-foreground/4 has-disabled:opacity-64 has-[:disabled,:focus-within,[aria-invalid]]:shadow-none focus-within:has-aria-invalid:border-destructive/64 focus-within:has-aria-invalid:ring-destructive/16 has-data-[size=lg]:*:min-h-8 has-data-[size=sm]:*:min-h-6 sm:*:min-h-6 dark:not-has-disabled:bg-input/32 dark:has-autofill:bg-foreground/8 dark:has-aria-invalid:ring-destructive/24 dark:not-has-disabled:not-focus-within:not-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]",
        className
      )}
      data-slot="combobox-chips"
      ref={chipsRef as React.Ref<HTMLDivElement> | null}
      {...props}
    >
      {startAddon && (
        <div
          aria-hidden="true"
          className="flex shrink-0 items-center ps-2 opacity-80 has-[~[data-size=sm]]:has-[+[data-slot=combobox-chip]]:pe-1.5 has-[~[data-size=sm]]:ps-1.5 has-[+[data-slot=combobox-chip]]:pe-2 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:-ms-0.5 [&_svg]:-me-1.5"
          data-slot="combobox-start-addon"
        >
          {startAddon}
        </div>
      )}
      {children}
    </ComboboxPrimitive.Chips>
  )
}

function ComboboxChip({
  children,
  removeProps,
  ...props
}: ComboboxPrimitive.Chip.Props & {
  removeProps?: ComboboxPrimitive.ChipRemove.Props
}): React.ReactElement {
  return (
    <ComboboxPrimitive.Chip
      className="flex items-center rounded-[calc(var(--radius-md)-1px)] bg-accent ps-2 font-medium text-accent-foreground text-sm outline-none sm:text-xs/(--text-xs--line-height) [&_svg:not([class*='size-'])]:size-4 sm:[&_svg:not([class*='size-'])]:size-3.5"
      data-slot="combobox-chip"
      {...props}
    >
      {children}
      <ComboboxChipRemove {...removeProps} />
    </ComboboxPrimitive.Chip>
  )
}

function ComboboxChipRemove(props: ComboboxPrimitive.ChipRemove.Props): React.ReactElement {
  return (
    <ComboboxPrimitive.ChipRemove
      aria-label="Remove"
      className="h-full shrink-0 cursor-pointer px-1.5 opacity-80 hover:opacity-100 [&_svg:not([class*='size-'])]:size-4 sm:[&_svg:not([class*='size-'])]:size-3.5"
      data-slot="combobox-chip-remove"
      {...props}
    >
      <XIcon />
    </ComboboxPrimitive.ChipRemove>
  )
}

function ComboboxChipsInput({
  className,
  size,
  ...props
}: Omit<ComboboxPrimitive.Input.Props, "size"> & {
  size?: "sm" | "default" | "lg" | number
  ref?: React.Ref<HTMLInputElement>
}): React.ReactElement {
  const sizeValue = (size ?? "default") as "sm" | "default" | "lg" | number

  return (
    <ComboboxPrimitive.Input
      className={cn(
        "min-w-12 flex-1 text-base outline-none sm:text-sm [[data-slot=combobox-chip]+&]:ps-0.5",
        sizeValue === "sm" ? "ps-1.5" : "ps-2",
        className
      )}
      data-size={typeof sizeValue === "string" ? sizeValue : undefined}
      data-slot="combobox-chips-input"
      size={typeof sizeValue === "number" ? sizeValue : undefined}
      {...props}
    />
  )
}
function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null)
}

const useComboboxFilter: typeof ComboboxPrimitive.useFilter = ComboboxPrimitive.useFilter

// Re-exported for callers that want the Base UI up/down chevron convention.
export { ChevronsUpDownIcon as ComboboxUpDownIcon }

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxContent as ComboboxPopup,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxLabel as ComboboxGroupLabel,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxStatus,
  ComboboxRow,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxChipRemove,
  ComboboxTrigger,
  ComboboxClear,
  ComboboxValue,
  useComboboxAnchor,
  useComboboxFilter,
}
