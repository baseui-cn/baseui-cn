"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { trackCopyCode } from "@/lib/events"

interface CopyButtonProps {
  text: string
  size?: "icon" | "icon-xs"
  showLabel?: boolean
  onCopied?: () => void
  label?: string
  variant?: "default" | "ghost" | "outline"
}

export function CopyButton({
  text,
  size = "icon",
  showLabel = false,
  onCopied,
  label: idleLabel = "Copy",
  variant = "ghost",
}: CopyButtonProps) {
  const [status, setStatus] = React.useState<"idle" | "copied" | "error">("idle")
  const timeout = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  React.useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current)
    },
    []
  )
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setStatus("copied")
      trackCopyCode("code_block")
      onCopied?.()
    } catch {
      setStatus("error")
    }
    if (timeout.current) clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setStatus("idle"), 2400)
  }
  const label = status === "copied" ? "Copied" : status === "error" ? "Copy failed" : idleLabel
  return (
    <span className="inline-flex shrink-0">
      <Button
        type="button"
        onClick={handleCopy}
        variant={variant}
        size={showLabel ? "sm" : size}
        className="code-copy-button"
        aria-label={label}
      >
        {status === "copied" ? (
          <CheckIcon size={16} aria-hidden="true" />
        ) : (
          <CopyIcon size={16} aria-hidden="true" />
        )}
        {showLabel && label}
      </Button>
      <span role="status" className="sr-only">
        {status === "copied"
          ? "Copied to clipboard"
          : status === "error"
            ? "Unable to copy. Select the code to copy manually."
            : ""}
      </span>
    </span>
  )
}
