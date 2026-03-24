"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

function PopoverPreview() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline">Open Popover</Button>} />
      <PopoverContent side="bottom" align="start">
        <PopoverTitle>Dimensions</PopoverTitle>
        <PopoverDescription className="mb-3">Set the layer dimensions.</PopoverDescription>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1.5">
            <Label>Width</Label>
            <Input defaultValue="100%" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Height</Label>
            <Input defaultValue="25px" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function PopoverBasicPreview() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline">Open popover</Button>} />
      <PopoverContent><p className="text-sm">Simple popover content.</p></PopoverContent>
    </Popover>
  )
}

function PopoverPlacementPreview() {
  return (
    <div className="flex gap-2">
      {(["top", "bottom", "left", "right"] as const).map((side) => (
        <Popover key={side}>
          <PopoverTrigger render={<Button variant="outline" size="sm">{side}</Button>} />
          <PopoverContent side={side}><p className="text-sm">Placed on {side}</p></PopoverContent>
        </Popover>
      ))}
    </div>
  )
}

function PopoverWithFormPreview() {
  return <PopoverPreview />
}

export const popoverPreviewMap: Record<string, React.ComponentType> = {
  popover: PopoverPreview,
  "popover-demo": PopoverPreview,
  "popover-basic": PopoverBasicPreview,
  "popover-placement": PopoverPlacementPreview,
  "popover-with-form": PopoverWithFormPreview,
}
