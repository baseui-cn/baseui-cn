"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { cn } from "@/lib/utils"

export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string
  description?: string
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, label, description, id, ...props }, ref) => {
  const checkboxId = id ?? React.useId()
  return (
    <div className="flex items-start gap-3">
      <CheckboxPrimitive.Root
        ref={ref}
        id={checkboxId}
        className={cn(
          "mt-0.5 size-4 shrink-0 rounded border border-input bg-input/30 dark:bg-input/50 shadow-xs",
          "transition-[color,box-shadow,background-color]",
          "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-[checked]:bg-primary data-[checked]:border-primary data-[checked]:text-primary-foreground",
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
          <svg className="size-3" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {(label || description) && (
        <div className="flex flex-col gap-0.5">
          {label && (
            <label
              htmlFor={checkboxId}
              className="text-sm font-medium leading-none cursor-pointer"
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      )}
    </div>
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
