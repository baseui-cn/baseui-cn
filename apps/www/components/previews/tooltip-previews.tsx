"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

function TooltipPreview() {
  return (
    <TooltipProvider>
      <div className="flex gap-3">
        {[
          { label: "Save", tip: "Save document (⌘S)" },
          { label: "Share", tip: "Share with team" },
          { label: "Delete", tip: "Delete permanently" },
        ].map(({ label, tip }) => (
          <Tooltip key={label}>
            <TooltipTrigger
              render={
                <Button variant="outline" size="sm">
                  {label}
                </Button>
              }
            />
            <TooltipContent>{tip}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}

function TooltipBasicPreview() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
        <TooltipContent>This is a tooltip</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function TooltipPlacementPreview() {
  return (
    <TooltipProvider>
      <div className="flex gap-2">
        {(["top", "bottom", "left", "right"] as const).map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger render={<Button variant="outline" size="sm">{side}</Button>} />
            <TooltipContent side={side}>{side}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}

function TooltipDelayGroupPreview() {
  return (
    <TooltipProvider delay={300}>
      <div className="flex gap-2">
        {["Save", "Share", "Copy"].map((label) => (
          <Tooltip key={label}>
            <TooltipTrigger render={<Button variant="outline" size="sm">{label}</Button>} />
            <TooltipContent>{label} action</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}

function TooltipWithShortcutPreview() {
  return (
    <TooltipProvider>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" size="sm">Save</Button>} />
          <TooltipContent>Save document <kbd className="ml-2 rounded bg-muted px-1 py-0.5 text-[10px] font-mono">⌘S</kbd></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" size="sm">Undo</Button>} />
          <TooltipContent>Undo last action <kbd className="ml-2 rounded bg-muted px-1 py-0.5 text-[10px] font-mono">⌘Z</kbd></TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

export const tooltipPreviewMap: Record<string, React.ComponentType> = {
  tooltip: TooltipPreview,
  "tooltip-demo": TooltipPreview,
  "tooltip-basic": TooltipBasicPreview,
  "tooltip-placement": TooltipPlacementPreview,
  "tooltip-delay-group": TooltipDelayGroupPreview,
  "tooltip-with-shortcut": TooltipWithShortcutPreview,
}
