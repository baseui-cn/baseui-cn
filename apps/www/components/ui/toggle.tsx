"use client"

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"
import type React from "react"
import { cn } from "@/lib/utils"

import "@/styles/button.styles.css"
import "@/styles/toggle.styles.css"

export const toggleVariants = cva(
  [
    "button-layout toggle-layout border border-transparent text-foreground data-[pressed]:bg-accent",
    "data-[pressed]:text-accent-foreground data-[pressed]:shadow-[inset_0_-2px_0_currentColor]",
    "data-[pressed]:focus-visible:shadow-[inset_0_-2px_0_currentColor] disabled:border-border disabled:bg-muted",
    "disabled:text-muted-foreground data-[disabled]:border-border data-[disabled]:bg-muted data-[disabled]:text-muted-foreground",
    "data-[pressed]:data-[disabled]:border-border data-[pressed]:data-[disabled]:bg-muted data-[pressed]:data-[disabled]:text-muted-foreground",
    "aria-invalid:border-destructive data-[invalid]:border-destructive focus-visible:outline-ring",
  ],
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "",
        lg: "button-lg-layout",
        sm: "button-sm-layout",
      },
      variant: {
        default: "bg-transparent [@media(hover:hover)]:enabled:not-data-[pressed]:hover:bg-muted",
        outline:
          "button-outline-layout border-input bg-background [@media(hover:hover)]:enabled:not-data-[pressed]:hover:bg-muted",
      },
    },
  }
)

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
