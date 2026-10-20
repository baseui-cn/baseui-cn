import type * as React from "react"
import { cn } from "@/lib/utils"

import "@/styles/surface.styles.css"

export function Frame({ className, ...props }: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      className={cn(
        "frame-layout",

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
  return <div className={cn("frame-panel-layout", className)} data-slot="frame-panel" {...props} />
}

export function FrameHeader({
  className,
  ...props
}: React.ComponentProps<"header">): React.ReactElement {
  return (
    <header
      className={cn("flex flex-col frame-footer-layout", className)}
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
    <div className={cn("frame-title-layout", className)} data-slot="frame-panel-title" {...props} />
  )
}

export function FrameDescription({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      className={cn("surface-description-layout", className)}
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
      className={cn("frame-footer-layout", className)}
      data-slot="frame-panel-footer"
      {...props}
    />
  )
}
