"use client"

import { Form as FormPrimitive } from "@base-ui/react/form"
import type React from "react"
import { cn } from "@/lib/utils"

import "@/styles/form.styles.css"

export function Form<TValues extends object = object>({
  className,
  ...props
}: FormPrimitive.Props<TValues>): React.ReactElement {
  return <FormPrimitive className={cn("form-layout", className)} data-slot="form" {...props} />
}

export { FormPrimitive }
