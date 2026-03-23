"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { trackCopyCode, trackComponentSourceExpand } from "@/lib/events"

interface ComponentSourceProps {
  name: string
  title?: string
  code?: string
}

export function ComponentSource({ name, title, code }: ComponentSourceProps) {
  const [source, setSource] = React.useState<string | null>(code || null)
  const [loading, setLoading] = React.useState(!code)
  const [expanded, setExpanded] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (code) return
    const url = `https://raw.githubusercontent.com/baseui-cn/baseui-cn/main/packages/registry/registry/${name}.json`
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const content = data?.files?.[0]?.content
        setSource(content ?? null)
      })
      .catch(() => setSource(null))
      .finally(() => setLoading(false))
  }, [name, code])

  if (loading) {
    return <div className="h-32 rounded-lg border border-border bg-[#0a0a0a] animate-pulse" />
  }

  if (!source) {
    return (
      <div className="rounded-lg border border-border bg-[#0a0a0a] p-4 text-sm text-zinc-400">
        Source unavailable
      </div>
    )
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(source)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    trackCopyCode("source", name)
  }

  return (
    <div className="relative rounded-lg border border-border overflow-hidden bg-[#0a0a0a]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="font-mono text-xs text-zinc-400">
          {title ?? `components/ui/${name}.tsx`}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/10 transition-colors"
          aria-label={copied ? "Copied" : "Copy"}
        >
          {copied ? (
            <>
              <svg className="h-3.5 w-3.5 text-green-400" viewBox="0 0 16 16" fill="none">
                <path d="M3 8l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
                <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M3 11V3h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code area */}
      <div className={cn(
        "relative",
        expanded ? "max-h-96 overflow-y-auto" : "max-h-52 overflow-hidden"
      )}>
        <pre className="overflow-x-auto p-5 pt-4 text-[13px] leading-relaxed">
          <code className="font-mono text-[#e4e4e7] whitespace-pre">{source}</code>
        </pre>
        {!expanded && (
          <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
        )}
      </div>

      {/* Expand / Collapse */}
      <div className={cn(
        "flex justify-center py-3",
        !expanded && "absolute inset-x-0 bottom-0"
      )}>
        <button
          onClick={() => {
            setExpanded((v) => {
              if (!v) trackComponentSourceExpand(name)
              return !v
            })
          }}
          className="flex items-center gap-1.5 rounded-md border border-white/10 bg-[#0a0a0a] px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:border-white/20 transition-colors"
        >
          {expanded ? (
            <>
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
                <path d="M4 10l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Collapse
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              View Code
            </>
          )}
        </button>
      </div>
    </div>
  )
}
