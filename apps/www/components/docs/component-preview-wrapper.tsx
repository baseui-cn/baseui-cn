"use client"

import * as React from "react"
import { ComponentPreview } from "./component-preview"
import { previewMap } from "@/components/previews/component-previews"

interface ComponentPreviewWrapperProps {
  slug: string
  code: string
}

export function ComponentPreviewWrapper({ slug, code }: ComponentPreviewWrapperProps) {
  const Preview = previewMap[slug]

  return (
    <ComponentPreview
      preview={
        Preview ? (
          <Preview />
        ) : (
          <div className="text-sm text-muted-foreground">
            Preview coming soon
          </div>
        )
      }
      code={code}
    />
  )
}
