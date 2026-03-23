"use client"

import * as React from "react"
import { ChevronsUpDown, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

function CollapsiblePreview() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full max-w-sm space-y-2"
    >
      <div className="flex items-center justify-between gap-4 rounded-md border border-border px-4 py-2">
        <h4 className="text-sm font-semibold">@baseui-cn starred 3 repositories</h4>
        <CollapsibleTrigger
          className="inline-flex w-auto! justify-center! rounded-md p-1 hover:bg-accent"
        >
          <ChevronsUpDown className="size-4" />
          <span className="sr-only">Toggle</span>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border border-border px-4 py-2 font-mono text-sm">
        @base-ui/react
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border border-border px-4 py-2 font-mono text-sm">
          tailwind-merge
        </div>
        <div className="rounded-md border border-border px-4 py-2 font-mono text-sm">
          class-variance-authority
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function CollapsibleBasicPreview() {
  return (
    <Collapsible className="w-full max-w-sm rounded-lg border border-border">
      <CollapsibleTrigger className="px-4">
        What is baseui-cn?
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
          A registry of Tailwind-styled components built exclusively on Base UI
          primitives. Install with one command, own the code, style with
          Tailwind.
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function CollapsibleControlledPreview() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        className="rounded-lg border border-border"
      >
        <CollapsibleTrigger className="px-4">
          {open ? "Hide" : "Show"} details
          <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 text-sm text-muted-foreground">
            This collapsible is controlled externally. Current state:{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
              {String(open)}
            </code>
          </div>
        </CollapsibleContent>
      </Collapsible>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen((v) => !v)}
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
}
