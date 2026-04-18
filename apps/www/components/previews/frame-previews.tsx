"use client"

import * as React from "react"
import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/components/ui/frame"

function FramePreview() {
  return (
    <Frame className="w-full max-w-md">
      <FrameHeader>
        <FrameTitle>Project overview</FrameTitle>
        <FrameDescription>
          Use Frame when you want layered cards that still feel like one grouped surface.
        </FrameDescription>
      </FrameHeader>
      <FramePanel>
        <div className="space-y-1">
          <p className="font-medium text-sm">Design system migration</p>
          <p className="text-muted-foreground text-sm">
            12 components updated to Base UI primitives.
          </p>
        </div>
      </FramePanel>
      <FrameFooter className="text-muted-foreground text-sm">
        Great for collapsible settings, inspectors, and stacked summaries.
      </FrameFooter>
    </Frame>
  )
}

function FrameStackedPreview() {
  return (
    <Frame className="w-full max-w-md">
      <FramePanel>
        <FrameTitle>Security</FrameTitle>
        <FrameDescription>2FA enabled, 3 recovery codes remaining.</FrameDescription>
      </FramePanel>
      <FramePanel>
        <FrameTitle>Team access</FrameTitle>
        <FrameDescription>4 maintainers, 2 pending invitations.</FrameDescription>
      </FramePanel>
    </Frame>
  )
}

export const framePreviewMap: Record<string, React.ComponentType> = {
  frame: FramePreview,
  "frame-demo": FramePreview,
  "frame-stacked": FrameStackedPreview,
}
