"use client"

import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete"
import { ChevronsUpDownIcon, XIcon } from "lucide-react"
import type React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import "@/styles/selection.styles.css"

import { ScrollArea } from "@/components/ui/scroll-area"

export const Autocomplete: typeof AutocompletePrimitive.Root = AutocompletePrimitive.Root

export function AutocompleteInput({
  className,
  showTrigger = false,
  showClear = false,
  startAddon,
  size,
  triggerProps,
  clearProps,
  ...props
}: Omit<AutocompletePrimitive.Input.Props, "size"> & {
  showTrigger?: boolean
  showClear?: boolean
  startAddon?: React.ReactNode
  size?: "sm" | "default" | "lg" | number
  ref?: React.Ref<HTMLInputElement>
  triggerProps?: AutocompletePrimitive.Trigger.Props
  clearProps?: AutocompletePrimitive.Clear.Props
}): React.ReactElement {
  const sizeValue = (size ?? "default") as "sm" | "default" | "lg" | number

  return (
    <AutocompletePrimitive.InputGroup
      className="cn-input-group cn-autocomplete-control"
      data-slot="autocomplete-input-group"
    >
      {startAddon && (
        <div aria-hidden="true" className="cn-selection-start" data-slot="autocomplete-start-addon">
          {startAddon}
        </div>
      )}
      <AutocompletePrimitive.Input
        className={className}
        data-slot="autocomplete-input"
        render={<Input nativeInput unstyled size={sizeValue} />}
        {...props}
      />
      {showTrigger && (
        <AutocompleteTrigger aria-label="Show suggestions" {...triggerProps}>
          <AutocompletePrimitive.Icon data-slot="autocomplete-icon">
            <ChevronsUpDownIcon />
          </AutocompletePrimitive.Icon>
        </AutocompleteTrigger>
      )}
      {showClear && (
        <AutocompleteClear {...clearProps}>
          <XIcon />
        </AutocompleteClear>
      )}
    </AutocompletePrimitive.InputGroup>
  )
}

export function AutocompletePopup({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  alignOffset,
  align = "start",
  anchor,
  portalProps,
  ...props
}: AutocompletePrimitive.Popup.Props & {
  align?: AutocompletePrimitive.Positioner.Props["align"]
  sideOffset?: AutocompletePrimitive.Positioner.Props["sideOffset"]
  alignOffset?: AutocompletePrimitive.Positioner.Props["alignOffset"]
  side?: AutocompletePrimitive.Positioner.Props["side"]
  anchor?: AutocompletePrimitive.Positioner.Props["anchor"]
  portalProps?: AutocompletePrimitive.Portal.Props
}): React.ReactElement {
  return (
    <AutocompletePrimitive.Portal {...portalProps}>
      <AutocompletePrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="cn-selection-positioner"
        data-slot="autocomplete-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <AutocompletePrimitive.Popup
          className={cn("cn-selection-popup cn-autocomplete-popup", className)}
          data-slot="autocomplete-popup"
          {...props}
        >
          {children}
        </AutocompletePrimitive.Popup>
      </AutocompletePrimitive.Positioner>
    </AutocompletePrimitive.Portal>
  )
}

export const AutocompleteContent = AutocompletePopup

export function AutocompleteItem({
  className,
  children,
  ...props
}: AutocompletePrimitive.Item.Props): React.ReactElement {
  return (
    <AutocompletePrimitive.Item
      className={cn("cn-selection-item", className)}
      data-slot="autocomplete-item"
      {...props}
    >
      {children}
    </AutocompletePrimitive.Item>
  )
}

export function AutocompleteSeparator({
  className,
  ...props
}: AutocompletePrimitive.Separator.Props): React.ReactElement {
  return (
    <AutocompletePrimitive.Separator
      className={cn("cn-selection-separator", className)}
      data-slot="autocomplete-separator"
      {...props}
    />
  )
}

export function AutocompleteGroup({
  className,
  ...props
}: AutocompletePrimitive.Group.Props): React.ReactElement {
  return (
    <AutocompletePrimitive.Group
      className={cn("cn-selection-group", className)}
      data-slot="autocomplete-group"
      {...props}
    />
  )
}

export function AutocompleteGroupLabel({
  className,
  ...props
}: AutocompletePrimitive.GroupLabel.Props): React.ReactElement {
  return (
    <AutocompletePrimitive.GroupLabel
      className={cn("cn-selection-label", className)}
      data-slot="autocomplete-group-label"
      {...props}
    />
  )
}

export function AutocompleteEmpty({
  className,
  ...props
}: AutocompletePrimitive.Empty.Props): React.ReactElement {
  return (
    <AutocompletePrimitive.Empty
      className={cn("cn-selection-empty", className)}
      data-slot="autocomplete-empty"
      {...props}
    />
  )
}

export function AutocompleteRow({
  className,
  ...props
}: AutocompletePrimitive.Row.Props): React.ReactElement {
  return <AutocompletePrimitive.Row className={className} data-slot="autocomplete-row" {...props} />
}

export function AutocompleteValue({
  ...props
}: AutocompletePrimitive.Value.Props): React.ReactElement {
  return <AutocompletePrimitive.Value data-slot="autocomplete-value" {...props} />
}

export function AutocompleteList({
  className,
  ...props
}: AutocompletePrimitive.List.Props): React.ReactElement {
  return (
    <ScrollArea className="cn-selection-scroll h-auto" scrollbarGutter>
      <AutocompletePrimitive.List
        className={cn("cn-selection-list", className)}
        data-slot="autocomplete-list"
        {...props}
      />
    </ScrollArea>
  )
}

export function AutocompleteClear({
  className,
  ...props
}: AutocompletePrimitive.Clear.Props): React.ReactElement {
  return (
    <AutocompletePrimitive.Clear
      aria-label="Clear input"
      tabIndex={0}
      className={cn("cn-selection-action", className)}
      data-slot="autocomplete-clear"
      {...props}
    >
      <XIcon />
    </AutocompletePrimitive.Clear>
  )
}

export function AutocompleteStatus({
  className,
  ...props
}: AutocompletePrimitive.Status.Props): React.ReactElement {
  return (
    <AutocompletePrimitive.Status
      className={cn("cn-selection-status", className)}
      data-slot="autocomplete-status"
      {...props}
    />
  )
}

export function AutocompleteCollection({
  ...props
}: AutocompletePrimitive.Collection.Props): React.ReactElement {
  return <AutocompletePrimitive.Collection data-slot="autocomplete-collection" {...props} />
}

export function AutocompleteTrigger({
  className,
  children,
  ...props
}: AutocompletePrimitive.Trigger.Props): React.ReactElement {
  return (
    <AutocompletePrimitive.Trigger
      className={cn("cn-selection-action", className)}
      data-slot="autocomplete-trigger"
      {...props}
    >
      {children}
    </AutocompletePrimitive.Trigger>
  )
}

export const useAutocompleteFilter: typeof AutocompletePrimitive.useFilter =
  AutocompletePrimitive.useFilter

export { AutocompletePrimitive }
