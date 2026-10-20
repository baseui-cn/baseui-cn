"use client"

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { ChevronDownIcon } from "lucide-react"
import type React from "react"
import { cn } from "@/lib/utils"

import "@/styles/navigation.styles.css"

export function Accordion(props: AccordionPrimitive.Root.Props): React.ReactElement {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

export function AccordionItem({
  className,
  ...props
}: AccordionPrimitive.Item.Props): React.ReactElement {
  return (
    <AccordionPrimitive.Item
      className={cn("border-b border-border last:border-b-0", className)}
      data-slot="accordion-item"
      {...props}
    />
  )
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props): React.ReactElement {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "disclosure-trigger-layout accordion-trigger-layout flex flex-1 cursor-pointer items-start justify-between text-foreground disabled:text-muted-foreground data-disabled:text-muted-foreground disabled:pointer-events-none data-disabled:pointer-events-none data-panel-open:*:data-[slot=accordion-indicator]:rotate-180 [@media(hover:hover)]:not-data-disabled:hover:underline underline-offset-4",
          className
        )}
        data-slot="accordion-trigger"
        {...props}
      >
        {children}
        <ChevronDownIcon
          className="disclosure-indicator-layout pointer-events-none shrink-0 translate-y-0.5 text-muted-foreground"
          data-slot="accordion-indicator"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

export function AccordionPanel({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props): React.ReactElement {
  return (
    <AccordionPrimitive.Panel
      className="disclosure-panel-layout h-(--accordion-panel-height) overflow-hidden text-muted-foreground data-ending-style:h-0 data-starting-style:h-0"
      data-slot="accordion-panel"
      {...props}
    >
      <div className={cn("accordion-panel-content-layout", className)}>{children}</div>
    </AccordionPrimitive.Panel>
  )
}

export { AccordionPrimitive, AccordionPanel as AccordionContent }
