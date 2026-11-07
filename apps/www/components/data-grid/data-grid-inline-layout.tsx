"use client"

import { type RefObject, useLayoutEffect } from "react"
import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import "@/styles/data-grid-editing.styles.css"

// One observer for the mounted window; geometry updates never rerender cells.
let geometryObserver: ResizeObserver | undefined

export function useDataGridInlineLayout(ref: RefObject<HTMLDivElement | null>, active: boolean, enabled: boolean) {
  useLayoutEffect(() => {
    const element = ref.current
    if (!element || !enabled) return
    if (active) {
      // Normal activation uses the last idle measurement. An initially active
      // editor can instead inherit a consumer-sized cell without inventing a height.
      if (!element.style.getPropertyValue("--data-grid-editor-content-height")) {
        const cell = element.closest("td")
        if (cell) {
          const style = getComputedStyle(cell)
          const inset = [style.paddingTop, style.paddingBottom, style.borderTopWidth, style.borderBottomWidth]
            .reduce((sum, value) => sum + (parseFloat(value) || 0), 0)
          element.style.setProperty("--data-grid-editor-content-height", `${Math.max(0, cell.getBoundingClientRect().height - inset)}px`)
        }
      }
      return
    }
    if (typeof ResizeObserver === "undefined") {
      element.style.setProperty("--data-grid-editor-content-height", `${element.getBoundingClientRect().height}px`)
      return
    }
    geometryObserver ??= new ResizeObserver((entries) => {
      for (const entry of entries) {
        const target = entry.target as HTMLElement
        if (target.dataset.inlineEditorActive) continue
        const height = entry.borderBoxSize?.[0]?.blockSize ?? target.getBoundingClientRect().height
        if (height <= 0) continue
        target.style.setProperty("--data-grid-editor-content-height", `${height}px`)
      }
    })
    geometryObserver.observe(element)
    return () => geometryObserver?.unobserve(element)
  }, [ref, active, enabled])
}

export function DataGridInlineError({
  error,
  id,
  anchor,
}: {
  error?: string | null
  id: string
  anchor: RefObject<HTMLDivElement | null>
}) {
  if (!error) return null
  return (
    <TooltipProvider>
      <Tooltip open={Boolean(error)}>
        <TooltipContent side="bottom" align="start" positionerProps={{ anchor, style: { pointerEvents: "none" } }}
          className="pointer-events-none max-w-[min(24rem,calc(100vw-2rem))] whitespace-normal border border-destructive bg-popover text-destructive">
          <span id={id} role="alert">{error}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
