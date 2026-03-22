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

  return <CodeBlock language="tsx" code={source ?? fallbackCode} />
}
