"use client"

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"
import type React from "react"
import { cn } from "@/lib/utils"

import "@/styles/button.styles.css"
import "@/styles/toggle.styles.css"

export const toggleVariants = cva("cn-button cn-toggle", {
  defaultVariants: {
    size: "default",
    variant: "default",
  },
  variants: {
    size: {
      default: "cn-button-default",
      lg: "cn-button-lg",
      sm: "cn-button-sm",
    },
    variant: {
      default: "cn-button-ghost",
      outline: "cn-button-outline",
    },
  },
})

export function Toggle({
  className,
  variant,
  size,
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>): React.ReactElement {
  return (
    <TogglePrimitive
      className={cn(toggleVariants({ className, size, variant }))}
      data-slot="toggle"
      {...props}
    />
  )
}

export { TogglePrimitive }
