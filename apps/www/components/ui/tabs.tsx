"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import type React from "react"
import { cn } from "@/lib/utils"

import "@/styles/navigation.styles.css"

export type TabsVariant = "default" | "underline" | "line"

export function Tabs({ className, ...props }: TabsPrimitive.Root.Props): React.ReactElement {
  return (
    <TabsPrimitive.Root
      className={cn(
        "tabs-layout flex flex-col gap-2 data-[orientation=vertical]:flex-row",
        className
      )}
      data-slot="tabs"
      {...props}
    />
  )
}

export function TabsList({
  variant = "default",
  className,
  children,
  ...props
}: TabsPrimitive.List.Props & {
  variant?: TabsVariant
}): React.ReactElement {
  const resolvedVariant = variant === "line" ? "underline" : variant

  return (
    <TabsPrimitive.List
      className={cn(
        "tabs-list-layout relative z-0 flex w-fit items-center justify-center gap-x-0.5 text-muted-foreground",
        "data-[orientation=vertical]:flex-col",
        resolvedVariant === "default"
          ? "rounded-md p-0.5"
          : "data-[orientation=vertical]:px-1 data-[orientation=horizontal]:py-1",
        className
      )}
      data-slot="tabs-list"
      {...props}
    >
      {children}
      <TabsPrimitive.Indicator
        className={cn(
          "tabs-indicator-layout absolute bottom-0 left-0 h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) -translate-y-(--active-tab-bottom)",
          resolvedVariant === "underline"
            ? "z-10 bg-accent-foreground data-[orientation=horizontal]:h-0.5 data-[orientation=vertical]:w-0.5 data-[orientation=vertical]:-translate-x-px data-[orientation=horizontal]:translate-y-px"
            : "-z-1 rounded-sm bg-muted"
        )}
        data-slot="tab-indicator"
      />
    </TabsPrimitive.List>
  )
}

export function TabsTab({ className, ...props }: TabsPrimitive.Tab.Props): React.ReactElement {
  return (
    <TabsPrimitive.Tab
      className={cn(
        "tabs-tab-layout relative flex shrink-0 grow cursor-pointer items-center justify-center whitespace-nowrap text-muted-foreground data-disabled:text-muted-foreground data-disabled:pointer-events-none data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start data-active:text-foreground [@media(hover:hover)]:not-data-disabled:hover:text-foreground",
        className
      )}
      data-slot="tabs-tab"
      {...props}
    />
  )
}

export function TabsPanel({ className, ...props }: TabsPrimitive.Panel.Props): React.ReactElement {
  return (
    <TabsPrimitive.Panel
      className={cn("tabs-panel-layout flex-1", className)}
      data-slot="tabs-content"
      {...props}
    />
  )
}

export { TabsPrimitive, TabsTab as TabsTrigger, TabsPanel as TabsContent }
