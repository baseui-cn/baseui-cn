"use client"

import * as React from "react"
import { ChevronDownIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/components/ui/frame"

function CollapsiblePreview() {
  return (
    <Frame className="w-full max-w-md">
      <Collapsible>
        <FrameHeader className="flex-row items-center justify-between gap-3 px-2 py-2">
          <CollapsibleTrigger
            className="data-panel-open:[&_svg]:rotate-180"
            render={<Button className="justify-start" size="sm" variant="ghost" />}
          >
            <ChevronDownIcon className="size-4 transition-transform duration-200" />
            Section header
          </CollapsibleTrigger>
          <Button aria-label="Delete section" size="icon-sm" variant="ghost">
            <Trash2Icon className="size-4" />
          </Button>
        </FrameHeader>
        <CollapsiblePanel>
          <FramePanel className="mx-1 mb-1 p-4">
            <FrameTitle>Section title</FrameTitle>
            <FrameDescription>
              Pair `Collapsible` with `Frame` for settings panels, inspectors, and compact dashboards.
            </FrameDescription>
          </FramePanel>
        </CollapsiblePanel>
      </Collapsible>
    </Frame>
  )
}

function CollapsibleBasicPreview() {
  return (
    <Collapsible className="w-full max-w-sm rounded-lg border border-border">
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left font-medium text-sm">
        What is baseui-cn?
        <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-200" />
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <div className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">
          A registry of Tailwind-styled components built exclusively on Base UI
          primitives. Install with one command, own the code, style with
          Tailwind.
        </div>
      </CollapsiblePanel>
    </Collapsible>
  )
}

function CollapsibleControlledPreview() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Collapsible
        className="rounded-lg border border-border"
        open={open}
        onOpenChange={setOpen}
      >
        <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left font-medium text-sm">
          {open ? "Hide" : "Show"} details
          <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-200" />
        </CollapsibleTrigger>
        <CollapsiblePanel>
          <div className="px-4 pb-4 text-sm text-muted-foreground">
            This collapsible is controlled externally. Current state:{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
              {String(open)}
            </code>
          </div>
        </CollapsiblePanel>
      </Collapsible>
      <Button
        onClick={() => setOpen((value) => !value)}
        size="sm"
        variant="outline"
      >
        Toggle externally
      </Button>
    </div>
  )
}

export const collapsiblePreviewMap: Record<string, React.ComponentType> = {
  collapsible: CollapsiblePreview,
  "collapsible-demo": CollapsiblePreview,
  "collapsible-basic": CollapsibleBasicPreview,
  "collapsible-controlled": CollapsibleControlledPreview,
  "collapsible-compact-frame": CollapsiblePreview,
}
