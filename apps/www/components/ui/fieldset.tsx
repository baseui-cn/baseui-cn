"use client"

import { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset"
import type React from "react"
import { cn } from "@/lib/utils"

import "@/styles/form.styles.css"
import { cva, type VariantProps } from "class-variance-authority"

const fieldsetLegendVariants = cva("cn-fieldset-legend", {
  variants: {
    variant: {
      border: "cn-fieldset-legend-border",
      default: "",
    },
    size: {
      sm: "cn-fieldset-legend-sm",
      md: "cn-fieldset-legend-md",
      lg: "cn-fieldset-legend-lg",
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
      className={cn("cn-fieldset", className)}
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
