"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import { cn } from "@/lib/utils"

const Drawer = DrawerPrimitive.Root
const DrawerTrigger = DrawerPrimitive.Trigger
const DrawerClose = DrawerPrimitive.Close
const DrawerPortal = DrawerPrimitive.Portal

const DrawerBackdrop = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Backdrop>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Backdrop
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50",
      "transition-opacity duration-300",
      "data-[open]:opacity-100 data-[closed]:opacity-0 data-[starting-style]:opacity-0",
      className,
    )}
    {...props}
  />
))
DrawerBackdrop.displayName = "DrawerBackdrop"

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Popup> & {
    side?: "top" | "bottom" | "left" | "right"
  }
>(({ className, children, side = "right", ...props }, ref) => (
  <DrawerPortal>
    <DrawerBackdrop />
    <DrawerPrimitive.Popup
      ref={ref}
      className={cn(
        "fixed z-50 flex flex-col bg-background shadow-xl outline-none",
        "transition-transform duration-300 ease-in-out",
        side === "right"  && "inset-y-0 right-0 h-full w-3/4 max-w-sm data-[open]:translate-x-0 data-[closed]:translate-x-full data-[starting-style]:translate-x-full",
        side === "left"   && "inset-y-0 left-0 h-full w-3/4 max-w-sm data-[open]:translate-x-0 data-[closed]:-translate-x-full data-[starting-style]:-translate-x-full",
        side === "bottom" && "inset-x-0 bottom-0 h-auto max-h-[80vh] w-full rounded-t-xl data-[open]:translate-y-0 data-[closed]:translate-y-full data-[starting-style]:translate-y-full",
        side === "top"    && "inset-x-0 top-0 h-auto max-h-[80vh] w-full rounded-b-xl data-[open]:translate-y-0 data-[closed]:-translate-y-full data-[starting-style]:-translate-y-full",
        className,
      )}
      {...props}
    >
      {(side === "bottom" || side === "top") && (
        <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-muted shrink-0" />
      )}
      {children}
    </DrawerPrimitive.Popup>
  </DrawerPortal>
))
DrawerContent.displayName = "DrawerContent"

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1.5 p-6", className)} {...props} />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex flex-col gap-2 p-6", className)} {...props} />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
DrawerTitle.displayName = "DrawerTitle"

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DrawerDescription.displayName = "DrawerDescription"

export {
  Drawer, DrawerTrigger, DrawerClose, DrawerPortal, DrawerBackdrop,
  DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription,
}
