"use client"

import * as React from "react"
import { Toggle } from "@/components/ui/toggle"
import { Bold, Italic, Underline } from "lucide-react"

function TogglePreview() {
  return (
    <Toggle aria-label="Toggle bold">
      <Bold className="size-4" />
    </Toggle>
  )
}

function ToggleWithTextPreview() {
  return (
    <Toggle aria-label="Toggle italic">
      <Italic className="size-4" />
      Italic
    </Toggle>
  )
}

function ToggleOutlinePreview() {
  return (
    <Toggle variant="outline" aria-label="Toggle underline">
      <Underline className="size-4" />
    </Toggle>
  )
}

function ToggleSizesPreview() {
  return (
    <div className="flex items-center gap-2">
      <Toggle size="sm" aria-label="Bold small">
        <Bold className="size-4" />
      </Toggle>
      <Toggle size="default" aria-label="Bold default">
        <Bold className="size-4" />
      </Toggle>
      <Toggle size="lg" aria-label="Bold large">
        <Bold className="size-4" />
      </Toggle>
    </div>
  )
}

function ToggleDisabledPreview() {
  return (
    <Toggle disabled aria-label="Toggle bold (disabled)">
      <Bold className="size-4" />
    </Toggle>
  )
}

export const togglePreviewMap: Record<string, React.ComponentType> = {
  toggle: TogglePreview,
  "toggle-demo": TogglePreview,
  "toggle-with-text": ToggleWithTextPreview,
  "toggle-outline": ToggleOutlinePreview,
  "toggle-sizes": ToggleSizesPreview,
  "toggle-disabled": ToggleDisabledPreview,
}
