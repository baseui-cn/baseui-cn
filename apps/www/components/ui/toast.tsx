"use client"

import * as React from "react"
import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import { cn } from "@/lib/utils"
import { X, CheckCircle2, XCircle, AlertTriangle, Info, Loader2 } from "lucide-react"

type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"

interface ToastContextValue {
  position: ToastPosition
}

const ToastContext = React.createContext<ToastContextValue>({
  position: "bottom-right",
})

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

const typeIcon: Record<string, React.ReactNode> = {
  success: <CheckCircle2 className="size-5 text-green-500 shrink-0" />,
  error: <XCircle className="size-5 text-destructive shrink-0" />,
  warning: <AlertTriangle className="size-5 text-yellow-500 shrink-0" />,
  info: <Info className="size-5 text-blue-500 shrink-0" />,
  loading: <Loader2 className="size-5 text-muted-foreground shrink-0 animate-spin" />,
}

function ToastViewport({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Viewport>) {
  const { position } = React.useContext(ToastContext)
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

const sharedRootClasses = [
  "group",
  "[--gap:0.75rem]",
  "[--peek:0.75rem]",
  "[--scale:calc(max(0,1-(var(--toast-index)*0.1)))]",
  "[--shrink:calc(1-var(--scale))]",
  "[--height:var(--toast-frontmost-height,var(--toast-height))]",
  "absolute left-auto z-[calc(1000-var(--toast-index))] mr-0 w-full",
  "h-[var(--height)]",
  "rounded-lg border bg-background text-foreground shadow-lg select-none bg-clip-padding p-4",
  "[transition:transform_0.5s_cubic-bezier(0.22,1,0.36,1),opacity_0.5s,height_0.15s]",
  "data-[ending-style]:opacity-0",
  "data-[limited]:opacity-0",
  "data-[expanded]:h-[var(--toast-height)]",
  "after:absolute after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
]

const bottomClasses = [
  ...sharedRootClasses,
  "right-0 bottom-0 origin-bottom",
  "after:top-full",
  "[--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))]",
  "[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))]",
  "data-[starting-style]:[transform:translateY(150%)]",
  "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]",
  "data-[expanded]:[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--offset-y)))]",
  "data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
  "data-[expanded]:data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
  "data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
  "data-[expanded]:data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
  "data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
  "data-[expanded]:data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
  "data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
  "data-[expanded]:data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
]

const topClasses = [
  ...sharedRootClasses,
  "right-0 top-0 origin-top",
  "after:bottom-full",
  "[--offset-y:calc(var(--toast-offset-y)+calc(var(--toast-index)*var(--gap))+var(--toast-swipe-movement-y))]",
  "[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+(var(--toast-index)*var(--peek))+(var(--shrink)*var(--height))))_scale(var(--scale))]",
  "data-[starting-style]:[transform:translateY(-150%)]",
  "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(-150%)]",
  "data-[expanded]:[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--offset-y)))]",
  "data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
  "data-[expanded]:data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
  "data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
  "data-[expanded]:data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
  "data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
  "data-[expanded]:data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
  "data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
  "data-[expanded]:data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
]

function ToastRoot({ toast, className, ...props }: ToastPrimitive.Root.Props) {
  const { position } = React.useContext(ToastContext)
  const isTop = position.startsWith("top")

  const typeStyles: Record<string, string> = {
    success: "border-green-500/30",
    error: "border-destructive/30",
    warning: "border-yellow-500/30",
    info: "border-blue-500/30",
  }
  const borderColor =
    toast.type && toast.type in typeStyles ? typeStyles[toast.type] : "border-border"

  return (
    <ToastPrimitive.Root
      toast={toast}
      className={cn(isTop ? topClasses : bottomClasses, borderColor, className)}
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
        "overflow-hidden transition-opacity [transition-duration:250ms]",
        "data-[behind]:pointer-events-none data-[behind]:opacity-0",
        "data-[expanded]:pointer-events-auto data-[expanded]:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function ToastTitle({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Title>) {
  return (
    <ToastPrimitive.Title className={cn("text-sm font-semibold leading-5", className)} {...props} />
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

function ToastAction({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Action>) {
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
      {children ?? <X className="size-4" />}
    </ToastPrimitive.Close>
  )
}

function getToastIcon(toast: ToastPrimitive.Root.ToastObject): React.ReactNode {
  if (toast.type && toast.type in typeIcon) {
    return typeIcon[toast.type]
  }
  return null
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager()
  return toasts.map((toast) => {
    const icon = getToastIcon(toast)
    return (
      <ToastRoot key={toast.id} toast={toast}>
        <ToastContent className="flex items-start gap-3">
          {icon && <div className="mt-0.5">{icon}</div>}
          <div className="flex flex-1 flex-col gap-1">
            <ToastTitle />
            <ToastDescription />
            {toast.actionProps && (
              <div className="mt-2">
                <ToastAction />
              </div>
            )}
          </div>
          <ToastClose />
        </ToastContent>
      </ToastRoot>
    )
  })
}

interface ToastProviderProps {
  children: React.ReactNode
  position?: ToastPosition
  limit?: number
  toastManager?: ReturnType<typeof ToastPrimitive.createToastManager>
}

function ToastProvider({
  children,
  position = "bottom-right",
  limit = 5,
  toastManager,
}: ToastProviderProps) {
  const ctx = React.useMemo(() => ({ position }), [position])

  return (
    <ToastContext.Provider value={ctx}>
      <ToastPrimitive.Provider limit={limit} {...(toastManager ? { toastManager } : {})}>
        {children}
        <ToastPrimitive.Portal>
          <ToastViewport>
            <ToastList />
          </ToastViewport>
        </ToastPrimitive.Portal>
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  )
}

const createToastManager = ToastPrimitive.createToastManager

export {
  ToastProvider,
  ToastViewport,
  ToastRoot,
  ToastContent,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  ToastList,
  useToast,
  createToastManager,
  typeIcon,
}
export type { ToastPosition, ToastProviderProps }
