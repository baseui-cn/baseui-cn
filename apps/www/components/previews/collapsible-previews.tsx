"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

function CollapsiblePreview() {
  return (
    <Collapsible className="w-full max-w-sm rounded-lg border border-border px-4">
      <CollapsibleTrigger>What is baseui-cn?</CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pb-4">
          A registry of Tailwind-styled components built exclusively on Base UI primitives. Install
          with one command, own the code, style with Tailwind.
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function CollapsibleBasicPreview() {
  return (
    <Collapsible className="w-full max-w-sm rounded-lg border border-border px-4">
      <CollapsibleTrigger>Show details</CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pb-4 text-sm text-muted-foreground">Hidden content revealed on click.</div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function CollapsibleControlledPreview() {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="flex flex-col gap-3 w-full max-w-sm">
      <Collapsible open={open} onOpenChange={setOpen} className="rounded-lg border border-border px-4">
        <CollapsibleTrigger>{open ? "Hide" : "Show"} details</CollapsibleTrigger>
        <CollapsibleContent>
          <div className="pb-4 text-sm text-muted-foreground">Controlled open state: {String(open)}</div>
        </CollapsibleContent>
      </Collapsible>
      <Button variant="outline" size="sm" onClick={() => setOpen((v) => !v)}>Toggle externally</Button>
    </div>
  )
}

export const collapsiblePreviewMap: Record<string, React.ComponentType> = {
  collapsible: CollapsiblePreview,
  "collapsible-demo": CollapsiblePreview,
  "collapsible-basic": CollapsibleBasicPreview,
  "collapsible-controlled": CollapsibleControlledPreview,
}
