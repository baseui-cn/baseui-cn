"use client"

import { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset"
import type React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const fieldsetLegendVariants = cva("font-semibold text-foreground flex items-center gap-2", {
  variants: {
    variant: {
      border: "border-b border-border",
      default: "",
    },
    size: {
      sm: "text-sm py-1",
      md: "text-base py-1.5",
      lg: "text-lg py-2.5",
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
  return <FieldsetPrimitive.Root className={className} data-slot="fieldset" {...props} />
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
