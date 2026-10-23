"use client"

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import type React from "react"
import { cn } from "@/lib/utils"

import "@/styles/navigation.styles.css"

export function Collapsible({ ...props }: CollapsiblePrimitive.Root.Props): React.ReactElement {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

export function CollapsibleTrigger({
  className,
  ...props
}: CollapsiblePrimitive.Trigger.Props): React.ReactElement {
  return (
    <CollapsiblePrimitive.Trigger
      className={cn(
        "disclosure-trigger-layout cursor-pointer disabled:pointer-events-none data-disabled:pointer-events-none",
        className
      )}
      data-slot="collapsible-trigger"
      {...props}
    />
  )
}

export function CollapsiblePanel({
  className,
  ...props
}: CollapsiblePrimitive.Panel.Props): React.ReactElement {
  return (
    <CollapsiblePrimitive.Panel
      className={cn(
        "disclosure-panel-layout h-(--collapsible-panel-height) overflow-hidden data-ending-style:h-0 data-starting-style:h-0",
        className
      )}
      data-slot="collapsible-panel"
      {...props}
    />
  )
}

export { CollapsiblePrimitive, CollapsiblePanel as CollapsibleContent }
