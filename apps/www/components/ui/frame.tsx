import type * as React from "react"
import { cn } from "@/lib/utils"

import "@/styles/surface.styles.css"

export function Frame({ className, ...props }: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      className={cn(
        "cn-frame",

        className
      )}
      data-slot="frame"
      {...props}
    />
  )
}

export function FramePanel({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return <div className={cn("cn-frame-panel", className)} data-slot="frame-panel" {...props} />
}

export function FrameHeader({
  className,
  ...props
}: React.ComponentProps<"header">): React.ReactElement {
  return (
    <header
      className={cn("flex flex-col cn-frame-footer", className)}
      data-slot="frame-panel-header"
      {...props}
    />
  )
}

export function FrameTitle({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div className={cn("cn-frame-title", className)} data-slot="frame-panel-title" {...props} />
  )
}

export function FrameDescription({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      className={cn("cn-surface-description", className)}
      data-slot="frame-panel-description"
      {...props}
    />
  )
}

export function FrameFooter({
  className,
  ...props
}: React.ComponentProps<"footer">): React.ReactElement {
  return (
    <footer
      className={cn("cn-frame-footer", className)}
      data-slot="frame-panel-footer"
      {...props}
    />
  )
}
