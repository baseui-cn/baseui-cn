"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import { cn } from "@/lib/utils"
import "@/styles/modal.styles.css"

const Drawer = DrawerPrimitive.Root
const DrawerTrigger = DrawerPrimitive.Trigger
const DrawerClose = DrawerPrimitive.Close
const DrawerPortal = DrawerPrimitive.Portal

const DrawerBackdrop = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Backdrop>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Backdrop
    ref={ref}
    data-slot="drawer-backdrop"
    className={cn("modal-scrim-layout drawer-scrim-layout", className)}
    {...props}
  />
))
DrawerBackdrop.displayName = "DrawerBackdrop"

const DrawerContent = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Popup> & {
    side?: "top" | "bottom" | "left" | "right"
  }
>(({ className, children, side = "right", ...props }, ref) => (
  <DrawerPortal>
    <DrawerBackdrop />
    <DrawerPrimitive.Viewport data-slot="drawer-viewport" className="drawer-viewport-layout">
      <DrawerPrimitive.Popup
        ref={ref}
        data-slot="drawer-content"
        data-side={side}
        className={cn(
          "modal-surface-layout drawer-popup-layout border border-border bg-popover text-popover-foreground",
          side === "right" && "border-r-0",
          side === "left" && "border-l-0",
          side === "bottom" && "border-b-0",
          side === "top" && "border-t-0",
          className
        )}
        {...props}
      >
        {(side === "bottom" || side === "top") && (
          <div
            aria-hidden="true"
            data-slot="drawer-handle"
            className="drawer-handle-layout bg-muted"
          />
        )}
        {children}
      </DrawerPrimitive.Popup>
    </DrawerPrimitive.Viewport>
  </DrawerPortal>
))
DrawerContent.displayName = "DrawerContent"

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div data-slot="drawer-header" className={cn("drawer-header-layout", className)} {...props} />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div data-slot="drawer-footer" className={cn("drawer-footer-layout", className)} {...props} />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title ref={ref} className={cn("modal-title-layout", className)} {...props} />
))
DrawerTitle.displayName = "DrawerTitle"

const DrawerDescription = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("modal-description-layout text-muted-foreground", className)}
    {...props}
  />
))
DrawerDescription.displayName = "DrawerDescription"

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerPortal,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
