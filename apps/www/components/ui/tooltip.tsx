"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger
const TooltipPortal = TooltipPrimitive.Portal

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Popup> & {
    side?: "top" | "bottom" | "left" | "right"
    sideOffset?: number
    showArrow?: boolean
  }
>(({ className, children, side = "top", sideOffset = 6, showArrow = true, ...props }, ref) => (
  <TooltipPortal>
    <TooltipPrimitive.Positioner side={side} sideOffset={sideOffset}>
      <TooltipPrimitive.Popup
        ref={ref}
        className={cn(
          "z-50 rounded-md bg-primary px-2.5 py-1.5 text-xs text-primary-foreground shadow-md",
          "transition-all duration-150 origin-[var(--transform-origin)]",
          "data-[open]:opacity-100 data-[open]:scale-100",
          "data-[closed]:opacity-0 data-[closed]:scale-95",
          "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
          className
        )}
        {...props}
      >
        {children}
        {showArrow && (
          <TooltipPrimitive.Arrow className="fill-primary data-[side=bottom]:-top-[5px] data-[side=top]:-bottom-[5px] data-[side=left]:-right-[5px] data-[side=right]:-left-[5px]" />
        )}
      </TooltipPrimitive.Popup>
    </TooltipPrimitive.Positioner>
  </TooltipPortal>
))
TooltipContent.displayName = "TooltipContent"

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipPortal, TooltipContent }
