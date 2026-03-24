"use client"

import * as React from "react"
import { Field as FieldPrimitive } from "@base-ui/react/field"
import { cn } from "@/lib/utils"

function Field({ className, ...props }: FieldPrimitive.Root.Props) {
  return (
    <FieldPrimitive.Root
      data-slot="field"
      className={cn("flex w-full flex-col items-start gap-1.5", className)}
      {...props}
    />
  )
}

function FieldLabel({ className, ...props }: FieldPrimitive.Label.Props) {
  return (
    <FieldPrimitive.Label
      data-slot="field-label"
      className={cn(
        "text-sm font-medium leading-none text-foreground",
        "data-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function FieldControl({ className, ...props }: FieldPrimitive.Control.Props) {
  return (
    <FieldPrimitive.Control
      data-slot="field-control"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/50 border-input flex h-9 w-full min-w-0 rounded-lg border bg-input/30 px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-primary focus-visible:ring-primary/30 focus-visible:ring-[3px]",
        "data-invalid:ring-destructive/20 dark:data-invalid:ring-destructive/40 data-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: FieldPrimitive.Description.Props) {
  return (
    <FieldPrimitive.Description
      data-slot="field-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function FieldError({
  className,
  ...props
}: FieldPrimitive.Error.Props) {
  return (
    <FieldPrimitive.Error
      data-slot="field-error"
      className={cn(
        "text-sm text-destructive",
        "data-starting-style:opacity-0 data-ending-style:opacity-0",
        "transition-opacity duration-200",
        className
      )}
      {...props}
    />
  )
}

function FieldValidity({ children }: FieldPrimitive.Validity.Props) {
  return <FieldPrimitive.Validity>{children}</FieldPrimitive.Validity>
}

export {
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldValidity,
}
