"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "@/lib/utils"

export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  label?: string
  description?: string
}

const Switch = React.forwardRef<React.ComponentRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  ({ className, label, description, id, ...props }, ref) => {
    return (
      <div className="flex items-center gap-3">
        <SwitchPrimitive.Root
          ref={ref}
          id={id}
          className={cn(
            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent",
            "bg-input transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "data-checked:bg-primary",
            className
          )}
          {...props}
        >
          <SwitchPrimitive.Thumb
            className={cn(
              "pointer-events-none block size-4 rounded-full bg-background shadow-lg ring-0",
              "transition-transform duration-200",
              "translate-x-0 data-checked:translate-x-4"
            )}
          />
        </SwitchPrimitive.Root>
        {(label || description) && (
          <div className="flex flex-col gap-0.5">
            {label && (
              <label htmlFor={id} className="text-sm font-medium leading-none cursor-pointer">
                {label}
              </label>
            )}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        )}
      </div>
    )
  }
)
Switch.displayName = "Switch"

export { Switch }
