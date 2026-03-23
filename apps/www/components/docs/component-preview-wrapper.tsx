"use client"

import * as React from "react"
import { ComponentPreview } from "./component-preview"
import { previewMap } from "@/components/previews/component-previews-map"

interface ComponentPreviewWrapperProps {
  slug: string
  registrySlug?: string
  code: string
  previewCode?: string
}

export function ComponentPreviewWrapper({ slug, registrySlug, code, previewCode }: ComponentPreviewWrapperProps) {
  const displayCode = previewCode || code
  const Preview = previewMap[slug]

  return (
    <ComponentPreview
      preview={
        Preview ? (
          <Preview />
        ) : (
          <div className="text-sm text-muted-foreground">Preview coming soon</div>
        )
      }
      code={displayCode}
    />
  )
}
