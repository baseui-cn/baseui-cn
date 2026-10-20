import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"
import { cn } from "@/lib/utils"

import "@/styles/feedback.styles.css"

const alertVariants = cva("alert-layout", {
  defaultVariants: {
    variant: "default",
  },
  variants: {
    variant: {
      default: "",
      destructive: "alert-destructive-layout",
      info: "alert-info-layout",
      success: "alert-success-layout",
      warning: "alert-warning-layout",
    },
  },
})

export function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>): React.ReactElement {
  return (
    <div
      className={cn(alertVariants({ variant }), className)}
      data-slot="alert"
      role="alert"
      {...props}
    />
  )
}

export function AlertTitle({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return <div className={cn("alert-title-layout", className)} data-slot="alert-title" {...props} />
}

export function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      className={cn("alert-description-layout", className)}
      data-slot="alert-description"
      {...props}
    />
  )
}

export function AlertAction({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div className={cn("alert-action-layout", className)} data-slot="alert-action" {...props} />
  )
}
