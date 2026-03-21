"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { Radio } from "@base-ui/react/radio"
import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive> & {
    label?: string
  }
>(({ className, label, ...props }, ref) => (
  <div className="flex flex-col gap-2">
    {label && (
      <p className="text-sm font-medium text-foreground">{label}</p>
    )}
    <RadioGroupPrimitive
      ref={ref}
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  </div>
))
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof Radio.Root>,
  React.ComponentPropsWithoutRef<typeof Radio.Root> & {
    label?: string
    description?: string
  }
>(({ className, label, description, id, ...props }, ref) => {
  const radioId = id ?? React.useId()
  return (
    <div className="flex items-start gap-3">
      <Radio.Root
        ref={ref}
        id={radioId}
        className={cn(
          "mt-0.5 size-4 shrink-0 rounded-full border border-input bg-input/30 dark:bg-input/50 shadow-xs",
          "transition-[color,box-shadow,background-color]",
          "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-[checked]:border-primary",
          className
        )}
        {...props}
      >
        <Radio.Indicator
          className={cn(
            "flex items-center justify-center",
            "after:block after:size-2 after:rounded-full after:bg-primary",
            "after:scale-0 data-[checked]:after:scale-100 after:transition-transform after:duration-150"
          )}
        />
      </Radio.Root>
      {(label || description) && (
        <div className="flex flex-col gap-0.5">
          {label && (
            <label
              htmlFor={radioId}
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
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
