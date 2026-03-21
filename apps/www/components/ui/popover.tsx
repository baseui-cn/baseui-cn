"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverClose = PopoverPrimitive.Close
const PopoverPortal = PopoverPrimitive.Portal

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Popup> & {
    side?: "top" | "bottom" | "left" | "right"
    align?: "start" | "center" | "end"
    sideOffset?: number
    showArrow?: boolean
  }
>(({ className, children, side = "bottom", align = "center", sideOffset = 8, showArrow = true, ...props }, ref) => (
  <PopoverPortal>
    <PopoverPrimitive.Positioner side={side} align={align} sideOffset={sideOffset}>
      <PopoverPrimitive.Popup
        ref={ref}
        className={cn(
          "z-50 min-w-[220px] rounded-lg border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none",
          "transition-all duration-150 origin-[var(--transform-origin)]",
          "data-[open]:opacity-100 data-[open]:scale-100",
          "data-[closed]:opacity-0 data-[closed]:scale-95",
          "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
          className
        )}
        {...props}
      >
        {showArrow && (
          <PopoverPrimitive.Arrow className="fill-border [&>svg]:fill-popover">
            <svg width="10" height="5" viewBox="0 0 10 5">
              <path d="M0 5L5 0L10 5" />
            </svg>
          </PopoverPrimitive.Arrow>
        )}
        {children}
      </PopoverPrimitive.Popup>
    </PopoverPrimitive.Positioner>
  </PopoverPortal>
))
PopoverContent.displayName = "PopoverContent"

const PopoverHeading = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Title>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Title
    ref={ref}
    className={cn("mb-1.5 text-sm font-semibold", className)}
    {...props}
  />
))
PopoverHeading.displayName = "PopoverHeading"

const PopoverDescription = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Description>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
PopoverDescription.displayName = "PopoverDescription"

export {
  Popover, PopoverTrigger, PopoverClose, PopoverPortal,
  PopoverContent, PopoverHeading, PopoverDescription,
}
