"use client"

import { Field as FieldPrimitive } from "@base-ui/react/field"
import type React from "react"
import { cn } from "@/lib/utils"

import "@/styles/form.styles.css"

export function Field({ className, ...props }: FieldPrimitive.Root.Props): React.ReactElement {
  return <FieldPrimitive.Root className={cn("cn-field", className)} data-slot="field" {...props} />
}

export function FieldLabel({
  className,
  ...props
}: FieldPrimitive.Label.Props): React.ReactElement {
  return (
    <FieldPrimitive.Label
      className={cn("cn-field-label", className)}
      data-slot="field-label"
      {...props}
    />
  )
}

export function FieldItem({ className, ...props }: FieldPrimitive.Item.Props): React.ReactElement {
  return (
    <FieldPrimitive.Item
      className={cn("cn-field-item", className)}
      data-slot="field-item"
      {...props}
    />
  )
}

export function FieldDescription({
  className,
  ...props
}: FieldPrimitive.Description.Props): React.ReactElement {
  return (
    <FieldPrimitive.Description
      className={cn("cn-field-description", className)}
      data-slot="field-description"
      {...props}
    />
  )
}

export function FieldError({
  className,
  ...props
}: FieldPrimitive.Error.Props): React.ReactElement {
  return (
    <FieldPrimitive.Error
      className={cn("cn-field-error", className)}
      data-slot="field-error"
      {...props}
    />
  )
}

export const FieldControl: typeof FieldPrimitive.Control = FieldPrimitive.Control
export const FieldValidity: typeof FieldPrimitive.Validity = FieldPrimitive.Validity

export { FieldPrimitive }
