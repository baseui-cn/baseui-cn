"use client"

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"
import type React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

export type AvatarSize = "xs" | "sm" | "md" | "lg"

const avatarSizeClasses: Record<AvatarSize, string> = {
  xs: "size-6 text-[11px]",
  sm: "size-8 text-xs",
  md: "size-10 text-xs",
  lg: "size-12 text-sm",
}

export function Avatar({
  className,
  size = "md",
  showBadge = false,
  badgeVariant = "online",
  badgePosition = "top-right",
  children,
  ...props
}: AvatarPrimitive.Root.Props & {
  size?: AvatarSize
  showBadge?: boolean
  badgeVariant?: "online" | "offline" | "busy" | "away"
  badgePosition?: "top-right" | "top-left" | "bottom-right" | "bottom-left"
}): React.ReactElement {
  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full border border-border/70 bg-background align-middle font-medium text-foreground shadow-xs",
        avatarSizeClasses[size],
        className
      )}
      data-size={size}
      data-slot="avatar"
      {...props}
    >
      {children}
      {showBadge ? (
        <AvatarBadge variant={badgeVariant} badgePosition={badgePosition} />
      ) : null}
    </AvatarPrimitive.Root>
  )
}

export function AvatarImage({
  className,
  ...props
}: AvatarPrimitive.Image.Props): React.ReactElement {
  return (
    <AvatarPrimitive.Image
      className={cn("size-full object-cover", className)}
      data-slot="avatar-image"
      {...props}
    />
  )
}

export function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props): React.ReactElement {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted text-current",
        className
      )}
      data-slot="avatar-fallback"
      {...props}
    />
  )
}

const avatarBadgeVariants = cva(
  "absolute size-2 rounded-full outline-2 outline-background ring-1 ring-background/60",
  {
  variants: {
    variant: {
      online: "bg-success", // available
      offline: "bg-muted-foreground", // neutral
      busy: "bg-destructive", // do not disturb
      away: "bg-warning", // idle/away
    },
    badgePosition: {
      "top-right": "top-0 right-0",
      "top-left": "top-0 left-0",
      "bottom-right": "bottom-0 end-0",
      "bottom-left": "bottom-0 start-0",
    },
  },
  defaultVariants: {
    variant: "online",
    badgePosition: "top-right",
  },
})

export function AvatarBadge({
  className,
  variant = "online",
  badgePosition = "top-right",
  ...props
}: React.ComponentProps<"span"> & {
  variant?: "online" | "offline" | "busy" | "away"
  badgePosition?: "top-right" | "top-left" | "bottom-right" | "bottom-left"
}): React.ReactElement {
  return (
    <span
      aria-hidden="true"
      className={cn(avatarBadgeVariants({ variant, badgePosition }), className)}
      data-slot="avatar-badge"
      {...props}
    />
  )
}

export function AvatarGroup({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      className={cn(
        "flex items-center -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className
      )}
      data-slot="avatar-group"
      {...props}
    />
  )
}

export function AvatarGroupCount({
  className,
  size = "md",
  ...props
}: React.ComponentProps<"span"> & { size?: AvatarSize }): React.ReactElement {
  return (
    <span
      className={cn(
        "relative inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-medium text-muted-foreground ring-2 ring-background",
        "cursor-default hover:z-10 leading-none",
        avatarSizeClasses[size],
        className
      )}
      data-slot="avatar-group-count"
      {...props}
    />
  )
}

export { AvatarPrimitive }
