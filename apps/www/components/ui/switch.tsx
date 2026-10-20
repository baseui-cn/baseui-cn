"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import type React from "react"
import { cn } from "@/lib/utils"

import "@/styles/choice-control.styles.css"

export function Switch({ className, ...props }: SwitchPrimitive.Root.Props): React.ReactElement {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "switch-layout group/switch bg-input data-[checked]:bg-accent-foreground data-[disabled]:bg-muted data-[disabled]:data-[checked]:bg-muted-foreground focus-visible:outline-ring",
        className
      )}
      data-slot="switch"
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "switch-thumb-layout bg-background group-data-[checked]/switch:bg-background group-data-[disabled]/switch:bg-muted-foreground group-data-[disabled]/switch:group-data-[checked]/switch:bg-muted"
        )}
        data-slot="switch-thumb"
      />
    </SwitchPrimitive.Root>
  )
}

export { SwitchPrimitive }
