"use client"

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"
import type React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

import "@/styles/avatar.styles.css"

export type AvatarSize = "xs" | "sm" | "md" | "lg"

const avatarSizeClasses: Record<AvatarSize, string> = {
  xs: "avatar-xs-layout",
  sm: "avatar-sm-layout",
  md: "",
  lg: "avatar-lg-layout",
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
    <div className="avatar-wrap-layout">
      <AvatarPrimitive.Root
        className={cn("avatar-layout", avatarSizeClasses[size], className)}
        data-size={size}
        data-slot="avatar"
        {...props}
      >
        {children}
      </AvatarPrimitive.Root>
      {showBadge ? <AvatarBadge variant={badgeVariant} badgePosition={badgePosition} /> : null}
    </div>
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
        "flex size-full items-center justify-center rounded-[inherit] text-current",
        className
      )}
      data-slot="avatar-fallback"
      {...props}
    />
  )
}

const avatarBadgeVariants = cva("avatar-marker-layout", {
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
    <div className={cn("avatar-group-layout", className)} data-slot="avatar-group" {...props} />
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
        "avatar-count-layout",
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
