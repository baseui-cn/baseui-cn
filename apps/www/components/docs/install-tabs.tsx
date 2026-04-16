"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { CodeBlock } from "@/components/docs/code-block"

interface InstallTabsProps {
  addCmd: string
  manualDeps?: string
  manualCode?: string
  slug: string
  installedPath?: string
}

interface RegistrySourceFile {
  path: string
  content: string
}

export function InstallTabs({
  addCmd,
  manualDeps,
  manualCode,
  slug,
  installedPath,
}: InstallTabsProps) {
  const [tab, setTab] = React.useState<"command" | "manual">("command")
  const targetPath = installedPath ?? `components/ui/${slug}.tsx`
  const isMultiFileInstall = targetPath.includes("*")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex border-b border-border">
        {(["command", "manual"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "border-b-2 -mb-px px-4 py-2.5 text-sm font-medium capitalize transition-colors",
              tab === t
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t === "command" ? "Command" : "Manual"}
          </button>
        ))}
      </div>

      {tab === "command" && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            Run the following command to add the component to your project:
          </p>
          <CodeBlock code={addCmd} />
        </div>
      )}

      {tab === "manual" && (
        <div className="flex flex-col gap-6">
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

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-6 items-center justify-center rounded-full border border-border text-xs font-semibold text-muted-foreground">
                {manualDeps ? "2" : "1"}
              </span>
              {isMultiFileInstall ? (
                <p className="text-sm font-medium">Copy the source files into your project.</p>
              ) : (
                <p className="text-sm font-medium">
                  Copy and paste into{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                    {targetPath}
                  </code>
                </p>
              )}
            </div>
            <div className="ml-9">
              <ComponentSourceBlock slug={slug} fallbackCode={manualCode ?? ""} />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-border text-xs font-semibold text-muted-foreground">
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

function ComponentSourceBlock({ slug, fallbackCode }: { slug: string; fallbackCode: string }) {
  const [files, setFiles] = React.useState<RegistrySourceFile[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const url = `https://raw.githubusercontent.com/baseui-cn/baseui-cn/main/packages/registry/registry/${slug}.json`
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const nextFiles = Array.isArray(data?.files)
          ? data.files
              .filter(
                (file: unknown): file is RegistrySourceFile =>
                  typeof file === "object" &&
                  file !== null &&
                  typeof (file as RegistrySourceFile).path === "string" &&
                  typeof (file as RegistrySourceFile).content === "string"
              )
              .map((file: RegistrySourceFile) => ({ path: file.path, content: file.content }))
          : []

        setFiles(nextFiles)
      })
      .catch(() => {
        setFiles(
          fallbackCode
            ? [
                {
                  path: `${slug}.tsx`,
                  content: fallbackCode,
                },
              ]
            : []
        )
      })
      .finally(() => setLoading(false))
  }, [fallbackCode, slug])

  if (loading) {
    return <div className="h-32 animate-pulse rounded-lg border border-border bg-[#0a0a0a]" />
  }

  if (!files.length) {
    return (
      <div className="rounded-lg border border-border bg-[#0a0a0a] p-4 text-sm text-zinc-400">
        Source unavailable
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {files.map((file) => (
        <SourceFileCard key={file.path} title={file.path} code={file.content} />
      ))}
    </div>
  )
}

function SourceFileCard({ title, code }: { title: string; code: string }) {
  const [expanded, setExpanded] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-[#0a0a0a]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="font-mono text-xs text-zinc-400">{title}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-200"
          aria-label={copied ? "Copied" : "Copy"}
        >
          {copied ? (
            <>
              <svg className="h-3.5 w-3.5 text-green-400" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8l3.5 3.5 6.5-7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
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
              Copy
            </>
          )}
        </button>
      </div>

      <div className={cn("relative", expanded ? "max-h-96 overflow-y-auto" : "max-h-52 overflow-hidden")}>
        <pre className="overflow-x-auto p-5 pt-4 text-[13px] leading-relaxed">
          <code className="whitespace-pre font-mono text-[#e4e4e7]">{code}</code>
        </pre>
        {!expanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-[#0a0a0a] to-transparent" />
        )}
      </div>

      <div className={cn("flex justify-center py-3", !expanded && "absolute inset-x-0 bottom-0")}>
        <button
          onClick={() => setExpanded((value) => !value)}
          className="flex items-center gap-1.5 rounded-md border border-white/10 bg-[#0a0a0a] px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
        >
          {expanded ? (
            <>
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 10l4-4 4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Collapse
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 6l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              View Code
            </>
          )}
        </button>
      </div>
    </div>
  )
}
