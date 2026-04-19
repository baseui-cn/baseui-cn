"use client"

import * as React from "react"
import { trackCopyCode } from "@/lib/events"
import { CheckCheckIcon, CheckCircle, CheckCircleIcon, CopyIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

import { ToastProvider, useToast } from "@/components/ui/toast"
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false)
  const { add } = useToast()
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    trackCopyCode("code_block")
    add({
      title: "Copied to clipboard",
      type: "success",
      timeout: 3000,
    })
  }

  return (
    <Button
      onClick={handleCopy}
      variant="ghost"
      size="icon"
      className="rounded-full text-muted-foreground hover:text-foreground transition-colors"
      aria-label={copied ? "Copied" : "Copy"}
    >
      {copied ? (
        <CheckCheckIcon className="size-4 text-success" />
      ) : (
        <CopyIcon className="size-4 text-muted-foreground" />
      )}
    </Button>
  )
}
