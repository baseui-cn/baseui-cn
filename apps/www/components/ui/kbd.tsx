import type * as React from "react"
import { cn } from "@/lib/utils"

export function Kbd({ className, ...props }: React.ComponentProps<"kbd">): React.ReactElement {
  return (
    <kbd
      className={cn(
        "pointer-events-none inline-flex h-[calc(20*var(--component-unit,0.0625rem))] min-w-[calc(20*var(--component-unit,0.0625rem))] select-none items-center justify-center gap-1 rounded-[4px] bg-muted px-1 font-medium font-sans text-muted-foreground text-[calc(12*var(--component-unit,0.0625rem))] leading-none [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      data-slot="kbd"
      {...props}
    />
  )
}

export function KbdGroup({ className, ...props }: React.ComponentProps<"kbd">): React.ReactElement {
  return (
    <kbd
      className={cn("inline-flex items-center gap-1", className)}
      data-slot="kbd-group"
      {...props}
    />
  )
}
