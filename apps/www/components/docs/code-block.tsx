"use client"

import * as React from "react"

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
}

export function CodeBlock({ code, language: _, filename }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative rounded-lg border border-border overflow-hidden bg-[#0a0a0a]">
      {filename && (
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-2.5">
          <span className="font-mono text-xs text-zinc-500">{filename}</span>
        </div>
      )}
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/10 transition-colors"
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
      <pre className="overflow-x-auto p-5 pt-10 text-[13px] leading-relaxed">
        <code className="font-mono text-[#e4e4e7] whitespace-pre">{code}</code>
      </pre>
    </div>
  )
}
