"use client"

import * as React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { PackageManagerTabs } from "@/components/docs/package-manager-tabs"
import { Button } from "@/components/ui/button"

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
  const targetPath = installedPath ?? `components/ui/${slug}.tsx`
  const isMultiFileInstall = targetPath.includes("*")

  return (
    <Tabs defaultValue="command" className="gap-[16px]">
      <TabsList variant="underline" aria-label="Installation method">
        <TabsTrigger value="command">Command</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </TabsList>
      <TabsContent value="command" className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          Run the following command to add the component to your project:
        </p>
        <PackageManagerTabs command={addCmd} />
      </TabsContent>
      <TabsContent value="manual" className="flex flex-col gap-6">
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
      </TabsContent>
    </Tabs>
  )
}

function ComponentSourceBlock({ slug, fallbackCode }: { slug: string; fallbackCode: string }) {
  const [files, setFiles] = React.useState<RegistrySourceFile[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const url = `/registry/${slug}.json`
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
    return <div className="h-32 animate-pulse rounded-lg border border-border bg-card" />
  }

  if (!files.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
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
  const id = React.useId()
  return (
    <div>
      <div id={id} className={expanded ? "" : "source-file-collapsed"}>
        <CodeBlock filename={title} code={code} />
      </div>
      <Button
        variant="ghost"
        className="mt-[8px]"
        aria-expanded={expanded}
        aria-controls={id}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Collapse code" : "Expand code"}
      </Button>
    </div>
  )
}
