"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ComponentPreviewProps {
  preview: React.ReactNode
  code: string
  className?: string
}

export function ComponentPreview({ preview, code, className }: ComponentPreviewProps) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview")
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("rounded-lg border border-border overflow-hidden", className)}>
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-border px-1 bg-muted/30">
        <div className="flex">
          <button
            onClick={() => setTab("preview")}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
              tab === "preview"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Preview
          </button>
          <button
            onClick={() => setTab("code")}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
              tab === "code"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Code
          </button>
        </div>
        {tab === "code" && (
          <button
            onClick={handleCopy}
            className="mr-2 flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            {copied ? (
              <>
                <svg className="h-3.5 w-3.5 text-green-500" viewBox="0 0 16 16" fill="none">
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
        )}
      </div>

      {/* Preview pane */}
      {tab === "preview" && (
        <div className="flex min-h-55 items-center justify-center p-8 bg-background">
          {preview}
        </div>
      )}

      {/* Code pane */}
      {tab === "code" && (
        <div className="relative bg-[#0a0a0a]">
          <pre className="overflow-x-auto p-5 text-[13px] leading-relaxed">
            <code className="font-mono text-[#e4e4e7]">{code}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
