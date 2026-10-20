"use client"

import { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset"
import type React from "react"
import { cn } from "@/lib/utils"

import "@/styles/form.styles.css"
import { cva, type VariantProps } from "class-variance-authority"

const fieldsetLegendVariants = cva("fieldset-legend-layout", {
  variants: {
    variant: {
      border: "fieldset-legend-border-layout",
      default: "",
    },
    size: {
      sm: "fieldset-legend-sm-layout",
      md: "",
      lg: "fieldset-legend-lg-layout",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
})

export function Fieldset({
  className,
  ...props
}: FieldsetPrimitive.Root.Props): React.ReactElement {
  return (
    <FieldsetPrimitive.Root
      className={cn("fieldset-layout", className)}
      data-slot="fieldset"
      {...props}
    />
  )
}
export function FieldsetLegend({
  className,
  variant = "default",
  size = "md",
  ...props
}: FieldsetPrimitive.Legend.Props &
  VariantProps<typeof fieldsetLegendVariants>): React.ReactElement {
  return (
    <FieldsetPrimitive.Legend
      className={cn(fieldsetLegendVariants({ variant, size }), className)}
      data-slot="fieldset-legend"
      {...props}
    />
  )
}
