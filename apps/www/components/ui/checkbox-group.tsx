"use client"

import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group"
import type React from "react"
import { cn } from "@/lib/utils"

import "@/styles/choice-control.styles.css"

export function CheckboxGroup({
  className,
  ...props
}: CheckboxGroupPrimitive.Props): React.ReactElement {
  return (
    <CheckboxGroupPrimitive
      className={cn("checkbox-group-layout", className)}
      data-slot="checkbox-group"
      {...props}
    />
  )
}

export { CheckboxGroupPrimitive }
