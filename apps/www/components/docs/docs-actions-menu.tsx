"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { trackCopyCode, trackExternalLink } from "@/lib/events"

type DocsActionsMenuProps = {
  title: string
  markdown?: string
  pageUrl: string
}

type ActionState = "idle" | "copied" | "opened"

const AI_TARGETS = {
  chatgpt: {
    label: "Open with ChatGPT",
    url: "https://chatgpt.com/",
  },
  claude: {
    label: "Open with Claude",
    url: "https://claude.ai/",
  },
  v0: {
    label: "Open in v0",
    url: "https://v0.app/chat",
  },
} as const

function buildAIPrompt(title: string, pageUrl: string) {
  return [
    `I'm looking at this baseui-cn documentation: ${pageUrl}.`,
    `Help me understand how to use the ${title} component.`,
    "Be ready to explain concepts, give examples, or help debug based on it.",
  ].join(" ")
}

export function DocsActionsMenu({ title, markdown, pageUrl }: DocsActionsMenuProps) {
  const [state, setState] = React.useState<ActionState>("idle")
  const timeoutRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const setTemporaryState = React.useCallback((nextState: ActionState) => {
    setState(nextState)

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      setState("idle")
      timeoutRef.current = null
    }, 2200)
  }, [])

  const handleCopyMarkdown = React.useCallback(async () => {
    if (!markdown) return
    await navigator.clipboard.writeText(markdown)
    trackCopyCode("code_block")
    setTemporaryState("copied")
  }, [markdown, setTemporaryState])

  const handleViewMarkdown = React.useCallback(() => {
    if (!markdown) return
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" })
    const objectUrl = URL.createObjectURL(blob)
    const opened = window.open(objectUrl, "_blank", "noopener,noreferrer")

    if (opened) {
      opened.addEventListener(
        "load",
        () => {
          window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500)
        },
        { once: true }
      )
    } else {
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500)
    }
  }, [markdown])

  const handleOpenAI = React.useCallback(
    async (target: keyof typeof AI_TARGETS) => {
      const entry = AI_TARGETS[target]
      const prompt = buildAIPrompt(title, pageUrl)

      window.open(entry.url, "_blank", "noopener,noreferrer")
      await navigator.clipboard.writeText(prompt)
      trackCopyCode("code_block")
      trackExternalLink(entry.url)
      setTemporaryState("opened")
    },
    [pageUrl, setTemporaryState, title]
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            aria-live="polite"
            className={cn(
              "group min-w-[11rem] justify-center gap-2 transition-[background-color,border-color,color,box-shadow,transform]",
              state === "copied" &&
                "border-success/30 bg-success/8 text-success hover:bg-success/10",
              state === "opened" && "border-info/30 bg-info/8 text-info hover:bg-info/10"
            )}
            size="sm"
            title="Markdown and AI actions"
            variant="outline"
          >
            <span
              className={cn(
                "inline-flex transition-transform duration-200 group-hover:scale-105",
                state === "copied" && "text-success",
                state === "opened" && "text-info"
              )}
            >
              {state === "copied" ? (
                <svg className="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M3 8l3.5 3.5 6.5-7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : state === "opened" ? (
                <svg className="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M6 3h7v7M10 6l3-3M13 3 7 9"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 9v2.5A1.5 1.5 0 0 1 8.5 13H4.5A1.5 1.5 0 0 1 3 11.5v-7A1.5 1.5 0 0 1 4.5 3H7"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg className="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect
                    x="5"
                    y="5"
                    width="8"
                    height="8"
                    rx="1.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M3 11V3h8"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span className="inline-flex items-center gap-1">
              <span>
                {state === "copied"
                  ? "Markdown Copied"
                  : state === "opened"
                    ? "Prompt Copied"
                    : "Markdown & AI"}
              </span>
            </span>
            <svg
              className="size-3.5 text-muted-foreground transition-transform duration-200 group-data-[popup-open]:rotate-180"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        }
      />

      <DropdownMenuContent align="end" className="w-64 min-w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Markdown actions</DropdownMenuLabel>
          <DropdownMenuItem disabled={!markdown} onClick={handleCopyMarkdown}>
            Copy as Markdown
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!markdown} onClick={handleViewMarkdown}>
            View as Markdown
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Open with AI</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => void handleOpenAI("chatgpt")}>
            {AI_TARGETS.chatgpt.label}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => void handleOpenAI("claude")}>
            {AI_TARGETS.claude.label}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => void handleOpenAI("v0")}>
            {AI_TARGETS.v0.label}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
