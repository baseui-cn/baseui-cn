"use client"

import { cn } from "@/lib/utils"

import "@/styles/choice-control.styles.css"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("radio-group-layout", className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer radio-layout",
        "[@media(hover:hover)]:not-data-[disabled]:not-data-[checked]:not-data-[readonly]:hover:bg-muted border border-input",
        "bg-background text-foreground focus-visible:outline-ring aria-invalid:data-[checked]:border-destructive",
        "aria-invalid:data-[indeterminate]:border-destructive data-[disabled]:aria-invalid:border-border",
        "data-[disabled]:aria-invalid:data-[checked]:border-border data-[disabled]:aria-invalid:data-[indeterminate]:border-border",
        "data-[disabled]:border-border data-[disabled]:bg-muted data-[disabled]:text-muted-foreground aria-invalid:border-destructive",
        "data-[invalid]:border-destructive data-[checked]:border-accent-foreground data-[checked]:text-accent-foreground",
        "data-[checked]:data-[disabled]:border-border data-[checked]:data-[disabled]:text-muted-foreground",
        "data-[checked]:data-[invalid]:border-destructive data-[disabled]:data-[invalid]:border-border",

        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="radio-indicator-layout"
      >
        <span className="radio-mark-layout" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
