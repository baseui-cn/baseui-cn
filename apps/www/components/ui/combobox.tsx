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

import "@/styles/selection.styles.css"

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
      className={cn("cn-combobox-trigger", className)}
      {...props}
    >
      {children}
      {showIcon && (icon ?? <ChevronDownIcon aria-hidden="true" />)}
    </ComboboxPrimitive.Trigger>
  )
}

function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      aria-label="Clear selection"
      tabIndex={0}
      data-slot="combobox-clear"
      className={cn("cn-selection-action cn-combobox-clear", className)}
      {...props}
    >
      <XIcon className="pointer-events-none" />
    </ComboboxPrimitive.Clear>
  )
}

function ComboboxInput({
  className,
  children,
  disabled,
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
    <ComboboxPrimitive.InputGroup
      render={<InputGroup />}
      className={cn("cn-combobox-control w-auto", className)}
    >
      {startAddon && (
        <InputGroupAddon
          align="inline-start"
          className="text-muted-foreground [&_svg:not([class*='size-'])]:size-4"
        >
          {startAddon}
        </InputGroupAddon>
      )}
      <ComboboxPrimitive.Input
        render={<InputGroupInput nativeInput />}
        disabled={disabled}
        autoFocus={autoFocus}
        onChange={handleChange}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        {showClear && (
          <ComboboxClear
            disabled={disabled}
            keepMounted
            className={hasValue ? "cn-selection-query-clear" : undefined}
            onClick={() => setHasValue(false)}
          />
        )}
        {showTrigger && (
          <Button
            size="icon-xs"
            variant="ghost"
            render={<ComboboxTrigger />}
            data-slot="input-group-button"
            className="cn-selection-action"
            aria-label="Show options"
            disabled={disabled}
          />
        )}
      </InputGroupAddon>
      {children}
    </ComboboxPrimitive.InputGroup>
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
        className="cn-selection-positioner"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          data-chips={!!anchor}
          className={cn("cn-selection-popup cn-combobox-popup", className)}
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
      className={cn("cn-selection-list cn-combobox-list", className)}
      {...props}
    />
  )
}

type ComboboxItemProps = ComboboxPrimitive.Item.Props & {
  /**
   * Where to render the selected-state check indicator.
   * - `'right'` (default): indicator occupies a trailing flex slot.
   * - `'left'`: indicator occupies a leading flex slot.
   */
  checkPosition?: "left" | "right"
}

function ComboboxItem({
  className,
  children,
  checkPosition = "right",
  ...props
}: ComboboxItemProps) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      data-check-position={checkPosition}
      className={cn("cn-selection-item", className)}
      {...props}
    >
      <div className="cn-selection-text">{children}</div>
      <span className="cn-selection-indicator" aria-hidden="true">
        <ComboboxPrimitive.ItemIndicator>
          <CheckIcon />
        </ComboboxPrimitive.ItemIndicator>
      </span>
    </ComboboxPrimitive.Item>
  )
}

function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      className={cn("cn-selection-group", className)}
      {...props}
    />
  )
}

function ComboboxLabel({ className, ...props }: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      className={cn("cn-selection-label", className)}
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
      className={cn("cn-selection-empty", className)}
      {...props}
    />
  )
}

function ComboboxStatus({ className, ...props }: ComboboxPrimitive.Status.Props) {
  return (
    <ComboboxPrimitive.Status
      data-slot="combobox-status"
      className={cn("cn-selection-status", className)}
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
      className={cn("cn-selection-separator", className)}
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
      className={cn("cn-combobox-chips", className)}
      data-slot="combobox-chips"
      ref={chipsRef as React.Ref<HTMLDivElement> | null}
      {...props}
    >
      {startAddon && (
        <div aria-hidden="true" className="cn-selection-start" data-slot="combobox-start-addon">
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
  className,
  ...props
}: ComboboxPrimitive.Chip.Props & {
  removeProps?: ComboboxPrimitive.ChipRemove.Props
}): React.ReactElement {
  return (
    <ComboboxPrimitive.Chip
      className={cn("cn-combobox-chip", className)}
      data-slot="combobox-chip"
      {...props}
    >
      <span className="cn-combobox-chip-text">{children}</span>
      <ComboboxChipRemove
        aria-label={
          props["aria-label"]
            ? `Remove ${props["aria-label"]}`
            : typeof children === "string"
              ? `Remove ${children}`
              : "Remove"
        }
        {...removeProps}
      />
    </ComboboxPrimitive.Chip>
  )
}

function ComboboxChipRemove({
  className,
  ...props
}: ComboboxPrimitive.ChipRemove.Props): React.ReactElement {
  return (
    <ComboboxPrimitive.ChipRemove
      aria-label="Remove"
      className={cn("cn-selection-action cn-combobox-chip-remove", className)}
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
      className={cn("cn-combobox-chips-input", className)}
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
