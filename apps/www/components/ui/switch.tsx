"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import type React from "react"
import { cn } from "@/lib/utils"

import "@/styles/choice-control.styles.css"

export function Switch({ className, ...props }: SwitchPrimitive.Root.Props): React.ReactElement {
  return (
    <SwitchPrimitive.Root className={cn("cn-switch", className)} data-slot="switch" {...props}>
      <SwitchPrimitive.Thumb className={cn("cn-switch-thumb")} data-slot="switch-thumb" />
    </SwitchPrimitive.Root>
  )
}

export { SwitchPrimitive }
