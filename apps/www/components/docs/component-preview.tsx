"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CodeBlock } from "./code-block"

interface ComponentPreviewProps {
  preview: React.ReactNode
  code: string
  className?: string
}

export function ComponentPreview({ preview, code, className }: ComponentPreviewProps) {
  return (
    <Tabs defaultValue="preview" className={cn("component-preview", className)}>
      <div className="preview-toolbar">
        <TabsList variant="underline" aria-label="Component presentation">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="preview" className="preview-panel">
        <div className="preview-specimen">{preview}</div>
      </TabsContent>
      <TabsContent value="code" className="preview-code-panel">
        <CodeBlock code={code} />
      </TabsContent>
    </Tabs>
  )
}
