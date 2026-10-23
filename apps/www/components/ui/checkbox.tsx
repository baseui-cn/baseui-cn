"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import type React from "react"
import { cn } from "@/lib/utils"

import "@/styles/choice-control.styles.css"

export function Checkbox({
  className,
  ...props
}: CheckboxPrimitive.Root.Props): React.ReactElement {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "checkbox-layout [@media(hover:hover)]:not-data-[disabled]:not-data-[checked]:not-data-[readonly]:hover:bg-muted border",
        "border-input bg-background text-foreground focus-visible:outline-ring aria-invalid:data-[checked]:border-destructive",
        "aria-invalid:data-[indeterminate]:border-destructive data-[disabled]:aria-invalid:border-border",
        "data-[disabled]:aria-invalid:data-[checked]:border-border data-[disabled]:aria-invalid:data-[indeterminate]:border-border",
        "data-[disabled]:border-border data-[disabled]:bg-muted data-[disabled]:text-muted-foreground aria-invalid:border-destructive",
        "data-[invalid]:border-destructive data-[checked]:border-accent-foreground data-[checked]:bg-accent",
        "data-[checked]:text-accent-foreground data-[indeterminate]:border-accent-foreground data-[indeterminate]:bg-accent",
        "data-[indeterminate]:text-accent-foreground data-[checked]:data-[disabled]:border-border",
        "data-[checked]:data-[disabled]:bg-muted data-[checked]:data-[disabled]:text-muted-foreground",
        "data-[indeterminate]:data-[disabled]:border-border data-[indeterminate]:data-[disabled]:bg-muted",
        "data-[indeterminate]:data-[disabled]:text-muted-foreground data-[invalid]:data-[checked]:border-destructive",
        "data-[invalid]:data-[disabled]:border-border",

        className
      )}
      data-slot="checkbox"
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className="checkbox-indicator-layout"
        data-slot="checkbox-indicator"
        render={(props: React.ComponentProps<"span">, state: CheckboxPrimitive.Indicator.State) => (
          <span {...props}>
            {state.indeterminate ? (
              <svg
                aria-hidden="true"
                className="checkbox-mark-layout"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5.252 12h13.496" />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                className="checkbox-mark-layout"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5.252 12.7 10.2 18.63 18.748 5.37" />
              </svg>
            )}
          </span>
        )}
      />
    </CheckboxPrimitive.Root>
  )
}

export { CheckboxPrimitive }
