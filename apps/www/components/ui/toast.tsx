"use client"

import * as React from "react"
import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import { cn } from "@/lib/utils"

function useToast() {
  return ToastPrimitive.useToastManager()
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager()
  return (
    <ToastPrimitive.Viewport
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm outline-none pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastPrimitive.Root
          key={toast.id}
          toast={toast}
          className={cn(
            "group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-lg border p-4 shadow-lg",
            "transition-all duration-300 ease-in-out",
            "data-[open]:translate-x-0 data-[open]:opacity-100",
            "data-[closed]:translate-x-full data-[closed]:opacity-0",
            "data-[starting-style]:translate-x-full data-[starting-style]:opacity-0",
            toast.type === "success" ? "bg-background border-green-500/30 text-foreground" :
            toast.type === "error" ? "bg-background border-destructive/30 text-foreground" :
            toast.type === "warning" ? "bg-background border-yellow-500/30 text-foreground" :
            "bg-background border-border text-foreground"
          )}
        >
          <div className="flex flex-1 flex-col gap-0.5">
            {toast.title && (
              <ToastPrimitive.Title className="text-sm font-semibold">
                {toast.title}
              </ToastPrimitive.Title>
            )}
            {toast.description && (
              <ToastPrimitive.Description className="text-xs text-muted-foreground">
                {toast.description}
              </ToastPrimitive.Description>
            )}
          </div>
          <ToastPrimitive.Close
            className={cn(
              "shrink-0 rounded-md p-1 text-muted-foreground",
              "opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100",
              "hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            )}
            aria-label="Close"
          >
            <svg className="size-4" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
    </ToastPrimitive.Viewport>
  )
}

function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastPrimitive.Provider>
      {children}
      <ToastList />
    </ToastPrimitive.Provider>
  )
}

export { ToastProvider, useToast }
