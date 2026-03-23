"use client"

import * as React from "react"

import { Separator } from "@/components/ui/separator"

function SeparatorPreview() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <div>
        <p className="text-sm font-medium">Section A</p>
        <Separator className="my-3" />
        <p className="text-sm text-muted-foreground">Content below the separator.</p>
      </div>
      <div className="flex items-center gap-4 h-5">
        <span className="text-sm">Left</span>
        <Separator orientation="vertical" />
        <span className="text-sm">Center</span>
        <Separator orientation="vertical" />
        <span className="text-sm">Right</span>
      </div>
    </div>
  )
}

function SeparatorHorizontalPreview() {
  return (
    <div className="w-full max-w-xs">
      <p className="text-sm font-medium">Above</p>
      <Separator className="my-3" />
      <p className="text-sm text-muted-foreground">Below</p>
    </div>
  )
}

function SeparatorVerticalPreview() {
  return (
    <div className="flex items-center gap-3 h-6">
      <span className="text-sm">Left</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Center</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Right</span>
    </div>
  )
}

export const separatorPreviewMap: Record<string, React.ComponentType> = {
  separator: SeparatorPreview,
  "separator-demo": SeparatorPreview,
  "separator-horizontal": SeparatorHorizontalPreview,
  "separator-vertical": SeparatorVerticalPreview,
}
