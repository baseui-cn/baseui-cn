"use client"

import { CopyButton } from "@/components/shared/copy-button"

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  onCopied?: () => void
}

export function CodeBlock({ code, language, filename, onCopied }: CodeBlockProps) {
  return (
    <div className="docs-code-block">
      <div className="code-toolbar">
        <span className="min-w-0 truncate">{filename ?? language ?? "Code"}</span>
        <CopyButton text={code} showLabel onCopied={onCopied} />
      </div>
      <pre tabIndex={0} aria-label={filename ? `${filename} source code` : "Source code"}>
        <code>{code}</code>
      </pre>
    </div>
  )
}
