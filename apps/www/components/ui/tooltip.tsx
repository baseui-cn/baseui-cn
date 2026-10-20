"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"

import "@/styles/overlay.styles.css"

function TooltipProvider({ delay = 0, ...props }: TooltipPrimitive.Provider.Props) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delay={delay} {...props} />
}

// The installed primitive owns interaction timing. This context only wires the
// mounted informational content to its trigger's accessible description.
const TooltipDescriptionContext = React.createContext<{
  id: string
  contentId: string | undefined
  setContentId: React.Dispatch<React.SetStateAction<string | undefined>>
} | null>(null)

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  const id = React.useId()
  const [contentId, setContentId] = React.useState<string>()
  const description = React.useMemo(() => ({ id, contentId, setContentId }), [id, contentId])
  return (
    <TooltipDescriptionContext.Provider value={description}>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipDescriptionContext.Provider>
  )
}

function TooltipTrigger({
  className,
  "aria-describedby": describedBy,
  ...props
}: TooltipPrimitive.Trigger.Props) {
  const description = React.useContext(TooltipDescriptionContext)
  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      className={cn("overlay-trigger-layout", className)}
      aria-describedby={
        [describedBy, description?.contentId].filter(Boolean).join(" ") || undefined
      }
      {...props}
    />
  )
}

function TooltipDescriptionRegistration({ id }: { id: string }) {
  const setContentId = React.useContext(TooltipDescriptionContext)?.setContentId
  React.useLayoutEffect(() => {
    setContentId?.(id)
    return () => setContentId?.(undefined)
  }, [id, setContentId])
  return null
}

function TooltipContent({
  className,
  id: idProp,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  children,
  positionerProps,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<TooltipPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset"> & {
    positionerProps?: Omit<TooltipPrimitive.Positioner.Props, "children">
  }) {
  const description = React.useContext(TooltipDescriptionContext)
  const fallbackId = React.useId()
  const id = idProp ?? description?.id ?? fallbackId
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
        {...positionerProps}
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          id={id}
          role="tooltip"
          className={cn(
            "overlay-popup-layout tooltip-popup-layout border-0 bg-foreground text-background",
            className
          )}
          {...props}
        >
          <TooltipDescriptionRegistration id={id} />
          {children}
          <TooltipPrimitive.Arrow className="tooltip-arrow-layout" />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
