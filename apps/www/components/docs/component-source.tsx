"use client"

import * as React from "react"
import { CodeBlock } from "./code-block"
import { Button } from "@/components/ui/button"
import { trackComponentSourceExpand } from "@/lib/events"

interface ComponentSourceProps {
  name: string
  title?: string
  code?: string
}

export function ComponentSource({ name, title, code }: ComponentSourceProps) {
  const [fetched, setFetched] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(!code)
  const [expanded, setExpanded] = React.useState(false)
  const id = React.useId()
  React.useEffect(() => {
    if (code) return
    let cancelled = false
    setLoading(true)
    fetch(`/registry/${name}.json`)
      .then((response) => {
        if (!response.ok) throw new Error("Source unavailable")
        return response.json()
      })
      .then((data) => {
        if (!cancelled) setFetched(data?.files?.[0]?.content ?? null)
      })
      .catch(() => {
        if (!cancelled) setFetched(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [name, code])
  const source = code || fetched
  if (!code && loading)
    return (
      <p className="text-sm text-muted-foreground" role="status">
        Loading source…
      </p>
    )
  if (!source)
    return (
      <p className="text-sm text-muted-foreground" role="status">
        Source unavailable
      </p>
    )
  return (
    <div className="my-[16px] min-w-0">
      <div id={id} className={expanded ? "" : "source-file-collapsed"}>
        <CodeBlock filename={title ?? `components/ui/${name}.tsx`} code={source} />
      </div>
      <Button
        variant="ghost"
        className="mt-[8px]"
        aria-expanded={expanded}
        aria-controls={id}
        onClick={() => {
          if (!expanded) trackComponentSourceExpand(name)
          setExpanded(!expanded)
        }}
      >
        {expanded ? "Collapse code" : "Expand code"}
      </Button>
    </div>
  )
}
