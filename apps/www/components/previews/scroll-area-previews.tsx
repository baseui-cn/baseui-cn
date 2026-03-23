"use client"

import * as React from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

function ScrollAreaPreview() {
  return (
    <ScrollArea className="h-48 w-64 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm leading-none font-medium">Items</h4>
        {Array.from({ length: 20 }, (_, i) => (
          <React.Fragment key={i}>
            <div className="text-sm">Item {i + 1}</div>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  )
}

export const scrollAreaPreviewMap: Record<string, React.ComponentType> = {
  "scroll-area": ScrollAreaPreview,
  "scroll-area-demo": ScrollAreaPreview,
}
