"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { CodeBlock } from "@/components/docs/code-block"

interface InstallTabsProps {
  addCmd: string
  manualDeps: string
  manualCode: string
  slug: string
}

export function InstallTabs({ addCmd, manualDeps, manualCode, slug }: InstallTabsProps) {
  const [tab, setTab] = React.useState<"command" | "manual">("command")

  return (
    <div className="flex flex-col gap-4">
      {/* Tab switcher */}
      <div className="flex border-b border-border">
        {(["command", "manual"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px",
              tab === t
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t === "command" ? "Command" : "Manual"}
          </button>
        ))}
      </div>

      {/* Command tab */}
      {tab === "command" && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            Run the following command to add the component to your project:
          </p>
          <CodeBlock code={addCmd} />
        </div>
      )}

      {/* Manual tab */}
      {tab === "manual" && (
        <div className="flex flex-col gap-6">
          {/* Step 1: deps */}
          {manualDeps && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="flex size-6 items-center justify-center rounded-full border border-border text-xs font-semibold text-muted-foreground">
                  1
                </span>
                <p className="text-sm font-medium">Install dependencies</p>
              </div>
              <div className="ml-9">
                <CodeBlock code={manualDeps} />
              </div>
            </div>
          )}

          {/* Step 2: copy code */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-6 items-center justify-center rounded-full border border-border text-xs font-semibold text-muted-foreground">
                {manualDeps ? "2" : "1"}
              </span>
              <p className="text-sm font-medium">
                Copy and paste into{" "}
                <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                  components/ui/{slug}.tsx
                </code>
              </p>
            </div>
            <div className="ml-9">
              <ComponentSourceBlock slug={slug} fallbackCode={manualCode} />
            </div>
          </div>

          {/* Step 3: update imports */}
          <div className="flex items-start gap-3">
            <span className="flex size-6 items-center justify-center rounded-full border border-border text-xs font-semibold text-muted-foreground shrink-0 mt-0.5">
              {manualDeps ? "3" : "2"}
            </span>
            <p className="text-sm text-muted-foreground">
              Update import paths to match your project&apos;s alias configuration.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// Fetches actual component source from the registry for the Manual tab
function ComponentSourceBlock({ slug, fallbackCode }: { slug: string; fallbackCode: string }) {
  const [source, setSource] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [expanded, setExpanded] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    const url = `https://raw.githubusercontent.com/baseui-cn/baseui-cn/main/packages/registry/registry/${slug}.json`
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const content = data?.files?.[0]?.content
        setSource(content ?? null)
      })
      .catch(() => setSource(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="h-32 rounded-lg border border-border bg-[#0a0a0a] animate-pulse" />
    )
  }

  const code = source ?? fallbackCode

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative rounded-lg border border-border overflow-hidden bg-[#0a0a0a]">
      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 z-20 flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/10 transition-colors"
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

      {/* Code area */}
      <div
        className={cn(
          "relative",
          expanded ? "max-h-96 overflow-y-auto" : "max-h-52 overflow-hidden"
        )}
      >
        <pre className="overflow-x-auto p-5 pt-10 text-[13px] leading-relaxed">
          <code className="font-mono text-[#e4e4e7] whitespace-pre">{code}</code>
        </pre>

        {/* Fade overlay — only when collapsed */}
        {!expanded && (
          <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
        )}
      </div>

      {/* View Code / Collapse button */}
      <div className={cn(
        "flex justify-center py-3",
        !expanded && "absolute inset-x-0 bottom-0"
      )}>
        <button
          onClick={() => setExpanded((v) => !v)}
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
