"use client"

import * as React from "react"
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"
import { cn } from "@/lib/utils"

const AlertDialog = AlertDialogPrimitive.Root
const AlertDialogTrigger = AlertDialogPrimitive.Trigger
const AlertDialogClose = AlertDialogPrimitive.Close
const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogBackdrop = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Backdrop>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Backdrop
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50",
      "transition-opacity duration-200",
      "data-[open]:opacity-100 data-[closed]:opacity-0 data-[starting-style]:opacity-0",
      className
    )}
    {...props}
  />
))
AlertDialogBackdrop.displayName = "AlertDialogBackdrop"

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Popup>
>(({ className, children, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogBackdrop />
    <AlertDialogPrimitive.Popup
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
        "rounded-xl border border-border bg-background shadow-xl outline-none",
        "transition-all duration-200",
        "data-[open]:opacity-100 data-[open]:scale-100",
        "data-[closed]:opacity-0 data-[closed]:scale-95",
        "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
        className
      )}
      {...props}
    >
      {children}
    </AlertDialogPrimitive.Popup>
  </AlertDialogPortal>
))
AlertDialogContent.displayName = "AlertDialogContent"

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-2 p-6 pb-0", className)} {...props} />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse gap-2 p-6 pt-4 sm:flex-row sm:justify-end", className)} {...props} />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = "AlertDialogTitle"

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName = "AlertDialogDescription"

export {
  AlertDialog, AlertDialogTrigger, AlertDialogClose,
  AlertDialogPortal, AlertDialogBackdrop, AlertDialogContent,
  AlertDialogHeader, AlertDialogFooter,
  AlertDialogTitle, AlertDialogDescription,
}
