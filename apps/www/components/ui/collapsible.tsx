"use client"

import * as React from "react"
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import { cn } from "@/lib/utils"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.Trigger
    ref={ref}
    className={cn(
      "flex w-full items-center justify-between py-3 text-sm font-medium text-left",
      "transition-all hover:underline",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
      "[&[data-open]>svg]:rotate-180",
      className
    )}
    {...props}
  >
    {children}
    <svg
      className="size-4 shrink-0 text-muted-foreground transition-transform duration-200"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </CollapsiblePrimitive.Trigger>
))
CollapsibleTrigger.displayName = "CollapsibleTrigger"

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Panel>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Panel>
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.Panel
    ref={ref}
    className={cn(
      "overflow-hidden text-sm text-muted-foreground",
      "data-[open]:animate-accordion-down data-[closed]:animate-accordion-up",
      className
    )}
    {...props}
  />
))
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
