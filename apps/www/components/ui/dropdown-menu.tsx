"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { cn } from "@/lib/utils"

const DropdownMenu = MenuPrimitive.Root
const DropdownMenuTrigger = MenuPrimitive.Trigger
const DropdownMenuPortal = MenuPrimitive.Portal
const DropdownMenuGroup = MenuPrimitive.Group
const DropdownMenuRadioGroup = MenuPrimitive.RadioGroup
const DropdownMenuSub = MenuPrimitive.Root
const DropdownMenuSubTrigger = MenuPrimitive.SubmenuTrigger

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Popup> & {
    side?: "top" | "bottom" | "left" | "right"
    align?: "start" | "center" | "end"
    sideOffset?: number
  }
>(({ className, side = "bottom", align = "start", sideOffset = 6, ...props }, ref) => (
  <MenuPrimitive.Portal>
    <MenuPrimitive.Positioner side={side} align={align} sideOffset={sideOffset}>
      <MenuPrimitive.Popup
        ref={ref}
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none",
          "transition-all duration-150 origin-[var(--transform-origin)]",
          "data-[open]:opacity-100 data-[open]:scale-100",
          "data-[closed]:opacity-0 data-[closed]:scale-95",
          "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
          className
        )}
        {...props}
      />
    </MenuPrimitive.Positioner>
  </MenuPrimitive.Portal>
))
DropdownMenuContent.displayName = "DropdownMenuContent"

const itemBase = cn(
  "relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors",
  "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
)

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item> & {
    inset?: boolean
    destructive?: boolean
  }
>(({ className, inset, destructive, ...props }, ref) => (
  <MenuPrimitive.Item
    ref={ref}
    className={cn(
      itemBase,
      inset && "pl-8",
      destructive && "text-destructive data-[highlighted]:bg-destructive/10 data-[highlighted]:text-destructive",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>
>(({ className, children, ...props }, ref) => (
  <MenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(itemBase, "pl-8", className)}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <MenuPrimitive.CheckboxItemIndicator>
        <svg className="size-3" viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </MenuPrimitive.CheckboxItemIndicator>
    </span>
    {children}
  </MenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem"

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenuPrimitive.RadioItem
    ref={ref}
    className={cn(itemBase, "pl-8", className)}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <MenuPrimitive.RadioItemIndicator>
        <svg className="size-2" viewBox="0 0 8 8" fill="currentColor">
          <circle cx="4" cy="4" r="3" />
        </svg>
      </MenuPrimitive.RadioItemIndicator>
    </span>
    {children}
  </MenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem"

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.GroupLabel> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <MenuPrimitive.GroupLabel
    ref={ref}
    className={cn("px-2 py-1.5 text-xs font-semibold text-muted-foreground", inset && "pl-8", className)}
    {...props}
  />
))
DropdownMenuLabel.displayName = "DropdownMenuLabel"

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />
)
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuPortal, DropdownMenuGroup, DropdownMenuSub,
  DropdownMenuSubTrigger, DropdownMenuRadioGroup,
  DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut,
}
