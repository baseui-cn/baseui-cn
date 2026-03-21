"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { cn } from "@/lib/utils"

export interface ProgressProps
  extends Omit<React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>, 'value'> {
  value?: number | null
  label?: string
  showValue?: boolean
  size?: "sm" | "md" | "lg"
}

const sizeMap = { sm: "h-1", md: "h-2", lg: "h-3" }

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, label, showValue = false, size = "md", ...props }, ref) => (
  <div className="flex flex-col gap-1.5 w-full">
    {(label || showValue) && (
      <div className="flex items-center justify-between">
        {label && <span className="text-sm font-medium text-foreground">{label}</span>}
        {showValue && value != null && (
          <span className="text-sm text-muted-foreground tabular-nums">{Math.round(value as number)}%</span>
        )}
      </div>
    )}
    <ProgressPrimitive.Root
      ref={ref}
      value={value ?? null}
      className={cn(
        "relative w-full overflow-hidden rounded-full bg-secondary",
        sizeMap[size],
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Track className="h-full w-full">
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full bg-primary transition-all duration-500 ease-in-out",
            value == null && "animate-[indeterminate_1.5s_ease-in-out_infinite] w-1/3"
          )}
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  </div>
))
Progress.displayName = "Progress"

export { Progress }
