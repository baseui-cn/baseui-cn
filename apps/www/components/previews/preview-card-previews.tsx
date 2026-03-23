"use client"

import * as React from "react"
import {
  PreviewCard,
  PreviewCardTrigger,
  PreviewCardContent,
} from "@/components/ui/preview-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays } from "lucide-react"

function PreviewCardPreview() {
  return (
    <PreviewCard>
      <PreviewCardTrigger
        className="cursor-pointer text-sm font-medium text-foreground underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-foreground"
        href="https://base-ui.com"
      >
        @base-ui
      </PreviewCardTrigger>
      <PreviewCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/mui.png" />
            <AvatarFallback>BU</AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <h4 className="text-sm font-semibold">@base-ui</h4>
            <p className="text-sm text-muted-foreground">
              Unstyled UI components for building accessible web apps and design systems.
            </p>
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 size-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Open source since 2024
              </span>
            </div>
          </div>
        </div>
      </PreviewCardContent>
    </PreviewCard>
  )
}

function PreviewCardBasicPreview() {
  return (
    <PreviewCard>
      <PreviewCardTrigger
        className="cursor-pointer text-sm font-medium underline underline-offset-4"
        href="#"
      >
        Hover me
      </PreviewCardTrigger>
      <PreviewCardContent>
        <p className="text-sm text-muted-foreground">
          This is a basic preview card that appears on hover.
        </p>
      </PreviewCardContent>
    </PreviewCard>
  )
}

function PreviewCardSidesPreview() {
  return (
    <div className="flex items-center justify-center gap-8">
      <PreviewCard>
        <PreviewCardTrigger
          className="cursor-pointer text-sm font-medium underline underline-offset-4"
          href="#"
        >
          Top
        </PreviewCardTrigger>
        <PreviewCardContent side="top">
          <p className="text-sm text-muted-foreground">Preview card on top</p>
        </PreviewCardContent>
      </PreviewCard>

      <PreviewCard>
        <PreviewCardTrigger
          className="cursor-pointer text-sm font-medium underline underline-offset-4"
          href="#"
        >
          Right
        </PreviewCardTrigger>
        <PreviewCardContent side="right">
          <p className="text-sm text-muted-foreground">Preview card on right</p>
        </PreviewCardContent>
      </PreviewCard>

      <PreviewCard>
        <PreviewCardTrigger
          className="cursor-pointer text-sm font-medium underline underline-offset-4"
          href="#"
        >
          Bottom
        </PreviewCardTrigger>
        <PreviewCardContent side="bottom">
          <p className="text-sm text-muted-foreground">Preview card on bottom</p>
        </PreviewCardContent>
      </PreviewCard>
    </div>
  )
}

export const previewCardPreviewMap: Record<string, React.ComponentType> = {
  "preview-card": PreviewCardPreview,
  "preview-card-demo": PreviewCardPreview,
  "preview-card-basic": PreviewCardBasicPreview,
  "preview-card-sides": PreviewCardSidesPreview,
}
