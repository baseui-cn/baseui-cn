"use client"

import * as React from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  LayoutGrid,
  LayoutList,
} from "lucide-react"

function ToggleGroupPreview() {
  return (
    <ToggleGroup>
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Bold className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Italic className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <Underline className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

function ToggleGroupOutlinePreview() {
  return (
    <ToggleGroup variant="outline">
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Bold className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Italic className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <Underline className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

function ToggleGroupSinglePreview() {
  return (
    <ToggleGroup variant="outline">
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="justify" aria-label="Justify">
        <AlignJustify className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

function ToggleGroupSizesPreview() {
  return (
    <div className="flex flex-col gap-3">
      <ToggleGroup size="sm" variant="outline">
        <ToggleGroupItem value="list" aria-label="List view">
          <List className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="grid" aria-label="Grid view">
          <LayoutGrid className="size-4" />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup size="default" variant="outline">
        <ToggleGroupItem value="list" aria-label="List view">
          <List className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="grid" aria-label="Grid view">
          <LayoutGrid className="size-4" />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup size="lg" variant="outline">
        <ToggleGroupItem value="list" aria-label="List view">
          <List className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="grid" aria-label="Grid view">
          <LayoutGrid className="size-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

function ToggleGroupVerticalPreview() {
  return (
    <ToggleGroup variant="outline" orientation="vertical">
      <ToggleGroupItem value="list" aria-label="List view">
        <LayoutList className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="ordered" aria-label="Ordered list">
        <ListOrdered className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="grid" aria-label="Grid view">
        <LayoutGrid className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

function ToggleGroupWithTextPreview() {
  return (
    <ToggleGroup variant="outline" spacing={1}>
      <ToggleGroupItem value="list" aria-label="List view">
        <LayoutList className="size-4" /> List
      </ToggleGroupItem>
      <ToggleGroupItem value="grid" aria-label="Grid view">
        <LayoutGrid className="size-4" /> Grid
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

export const toggleGroupPreviewMap: Record<string, React.ComponentType> = {
  "toggle-group": ToggleGroupPreview,
  "toggle-group-demo": ToggleGroupPreview,
  "toggle-group-outline": ToggleGroupOutlinePreview,
  "toggle-group-single": ToggleGroupSinglePreview,
  "toggle-group-sizes": ToggleGroupSizesPreview,
  "toggle-group-vertical": ToggleGroupVerticalPreview,
  "toggle-group-with-text": ToggleGroupWithTextPreview,
}
