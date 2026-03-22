"use client"

import * as React from "react"
import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import { cn } from "@/lib/utils"

type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"

const ToastPositionContext = React.createContext<ToastPosition>("bottom-right")

function useToast() {
  return ToastPrimitive.useToastManager()
}

const viewportPositionStyles: Record<ToastPosition, string> = {
  "top-left": "top-4 left-4 sm:top-6 sm:left-6",
  "top-center": "top-4 left-1/2 -translate-x-1/2 sm:top-6",
  "top-right": "top-4 right-4 sm:top-6 sm:right-6",
  "bottom-left": "bottom-4 left-4 sm:bottom-6 sm:left-6",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 sm:bottom-6",
  "bottom-right": "bottom-4 right-4 sm:bottom-6 sm:right-6",
}

function ToastViewport({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Viewport>) {
  const position = React.useContext(ToastPositionContext)
  return (
    <ToastPrimitive.Viewport
      className={cn(
        "fixed z-100 flex w-full max-w-sm flex-col outline-none",
        viewportPositionStyles[position],
        className
      )}
      {...props}
    />
  )
}

function ToastRoot({
  toast,
  className,
  ...props
}: ToastPrimitive.Root.Props) {
  const position = React.useContext(ToastPositionContext)
  const isTop = position.startsWith("top")

  const typeStyles: Record<string, string> = {
    success: "border-green-500/30",
    error: "border-destructive/30",
    warning: "border-yellow-500/30",
    info: "border-blue-500/30",
  }
  const borderColor =
    toast.type && toast.type in typeStyles
      ? typeStyles[toast.type]
      : "border-border"

  return (
    <ToastPrimitive.Root
      toast={toast}
      className={cn(
        "group",
        "[--gap:0.5rem]",
        "[--height:var(--toast-frontmost-height,var(--toast-height))]",
        "[--scale:calc(max(0,1-(var(--toast-index)*0.05)))]",
        "[--shrink:calc(1-var(--scale))]",
        "absolute left-auto z-[calc(1000-var(--toast-index))] w-full",
        isTop
          ? "right-0 top-0 origin-top"
          : "right-0 bottom-0 origin-bottom",
        "h-(--height)",
        "rounded-lg border bg-background text-foreground shadow-lg select-none",
        borderColor,
        "[transition:transform_0.4s_cubic-bezier(0.22,1,0.36,1),opacity_0.4s,height_0.15s]",
        isTop
          ? "data-starting-style:transform-[translateY(-150%)]"
          : "data-starting-style:transform-[translateY(150%)]",
        "data-ending-style:opacity-0",
        isTop
          ? "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:transform-[translateY(-150%)]"
          : "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:transform-[translateY(150%)]",
        "data-limited:opacity-0",
        "data-expanded:transform-[translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
        "data-expanded:h-(--toast-height)",
        "data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))]",
        "data-expanded:data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        "data-expanded:data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
        "data-expanded:data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-expanded:data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))]",
        "after:absolute after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
        isTop ? "after:bottom-full" : "after:top-full",
        className
      )}
      style={{
        ["--offset-y" as string]: isTop
          ? "calc(var(--toast-offset-y) + var(--toast-index) * var(--gap) + var(--toast-swipe-movement-y))"
          : "calc(var(--toast-offset-y) * -1 + var(--toast-index) * var(--gap) * -1 + var(--toast-swipe-movement-y))",
        transform: isTop
          ? "translateX(var(--toast-swipe-movement-x)) translateY(calc(var(--toast-swipe-movement-y) + var(--toast-index) * 0.5rem + var(--shrink) * var(--height))) scale(var(--scale))"
          : "translateX(var(--toast-swipe-movement-x)) translateY(calc(var(--toast-swipe-movement-y) - var(--toast-index) * 0.5rem - var(--shrink) * var(--height))) scale(var(--scale))",
      }}
      {...props}
    />
  )
}

function ToastContent({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Content>) {
  return (
    <ToastPrimitive.Content
      className={cn(
        "flex items-start gap-3 overflow-hidden p-4",
        "transition-opacity duration-250",
        "data-behind:pointer-events-none data-behind:opacity-0",
        "data-expanded:pointer-events-auto data-expanded:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function ToastTitle({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Title>) {
  return (
    <ToastPrimitive.Title
      className={cn("text-sm font-semibold leading-5", className)}
      {...props}
    />
  )
}

function ToastDescription({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Description>) {
  return (
    <ToastPrimitive.Description
      className={cn("text-sm text-muted-foreground leading-5", className)}
      {...props}
    />
  )
}

function ToastAction({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Action>) {
  return (
    <ToastPrimitive.Action
      className={cn(
        "inline-flex h-8 items-center justify-center rounded-md border border-border bg-transparent px-3 text-sm font-medium transition-colors",
        "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring",
        className
      )}
      {...props}
    />
  )
}

function ToastClose({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Close>) {
  return (
    <ToastPrimitive.Close
      className={cn(
        "absolute top-2 right-2 rounded-md p-1 text-muted-foreground",
        "opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100",
        "hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
        className
      )}
      aria-label="Close"
      {...props}
    >
      {children ?? (
        <svg
          className="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      )}
    </ToastPrimitive.Close>
  )
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager()
  return toasts.map((toast) => (
    <ToastRoot key={toast.id} toast={toast}>
      <ToastContent>
        <div className="flex flex-1 flex-col gap-1">
          <ToastTitle />
          <ToastDescription />
        </div>
        <ToastClose />
      </ToastContent>
    </ToastRoot>
  ))
}

function ToastProvider({
  children,
  position = "bottom-right",
}: {
  children: React.ReactNode
  position?: ToastPosition
}) {
  return (
    <ToastPositionContext.Provider value={position}>
      <ToastPrimitive.Provider>
        {children}
        <ToastPrimitive.Portal>
          <ToastViewport>
            <ToastList />
          </ToastViewport>
        </ToastPrimitive.Portal>
      </ToastPrimitive.Provider>
    </ToastPositionContext.Provider>
  )
}

export {
  ToastProvider,
  ToastViewport,
  ToastRoot,
  ToastContent,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  useToast,
}
export type { ToastPosition }
