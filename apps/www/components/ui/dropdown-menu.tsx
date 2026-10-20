"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { CheckIcon, ChevronRightIcon } from "lucide-react"

import "@/styles/overlay.styles.css"

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
}

function DropdownMenuTrigger({ className, ...props }: MenuPrimitive.Trigger.Props) {
  return (
    <MenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      className={cn("overlay-trigger-layout", className)}
      {...props}
    />
  )
}

function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  className,
  positionerProps,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset"> & {
    positionerProps?: Omit<MenuPrimitive.Positioner.Props, "children">
  }) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        {...positionerProps}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "overlay-popup-layout menu-popup-layout border border-border bg-popover text-popover-foreground",
            className
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn("menu-label-layout", className)}
      {...props}
    />
  )
}

function DropdownMenuItem({
  className,
  children,
  inset,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "menu-item-layout group/menu-item text-popover-foreground data-[highlighted]:bg-muted data-[popup-open]:bg-muted",
        "data-[variant=destructive]:text-destructive",
        "data-[variant=destructive]:data-[highlighted]:bg-destructive/10 data-[disabled]:text-muted-foreground",
        "data-[disabled]:bg-transparent",

        className
      )}
      {...props}
    >
      <span className="menu-item-content-layout">{children}</span>
      <span
        className="menu-indicator-layout group-data-[checked]/menu-item:text-accent-foreground group-data-[disabled]/menu-item:text-muted-foreground"
        aria-hidden="true"
      />
    </MenuPrimitive.Item>
  )
}

function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "menu-item-layout group/menu-item text-popover-foreground data-[highlighted]:bg-muted data-[popup-open]:bg-muted",
        "data-[variant=destructive]:text-destructive",
        "data-[variant=destructive]:data-[highlighted]:bg-destructive/10 data-[disabled]:text-muted-foreground",
        "data-[disabled]:bg-transparent",

        className
      )}
      {...props}
    >
      <span className="menu-item-content-layout">{children}</span>
      <span
        className="menu-indicator-layout group-data-[checked]/menu-item:text-accent-foreground group-data-[disabled]/menu-item:text-muted-foreground"
        aria-hidden="true"
      >
        <ChevronRightIcon className="menu-chevron-layout" />
      </span>
    </MenuPrimitive.SubmenuTrigger>
  )
}

function DropdownMenuSubContent({
  align = "start",
  alignOffset = -4,
  side = "right",
  sideOffset = 0,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      className={cn("menu-sub-popup-layout", className)}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        "menu-item-layout group/menu-item text-popover-foreground data-[highlighted]:bg-muted data-[popup-open]:bg-muted",
        "data-[variant=destructive]:text-destructive",
        "data-[variant=destructive]:data-[highlighted]:bg-destructive/10 data-[disabled]:text-muted-foreground",
        "data-[disabled]:bg-transparent",

        className
      )}
      checked={checked}
      {...props}
    >
      <span className="menu-item-content-layout">{children}</span>
      <span
        className="menu-indicator-layout group-data-[checked]/menu-item:text-accent-foreground group-data-[disabled]/menu-item:text-muted-foreground"
        aria-hidden="true"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
    </MenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return <MenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: MenuPrimitive.RadioItem.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      className={cn(
        "menu-item-layout group/menu-item text-popover-foreground data-[highlighted]:bg-muted data-[popup-open]:bg-muted",
        "data-[variant=destructive]:text-destructive",
        "data-[variant=destructive]:data-[highlighted]:bg-destructive/10 data-[disabled]:text-muted-foreground",
        "data-[disabled]:bg-transparent",

        className
      )}
      {...props}
    >
      <span className="menu-item-content-layout">{children}</span>
      <span
        className="menu-indicator-layout group-data-[checked]/menu-item:text-accent-foreground group-data-[disabled]/menu-item:text-muted-foreground"
        aria-hidden="true"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </MenuPrimitive.RadioItemIndicator>
      </span>
    </MenuPrimitive.RadioItem>
  )
}

function DropdownMenuSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("menu-separator-layout", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("menu-shortcut-layout", className)}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
