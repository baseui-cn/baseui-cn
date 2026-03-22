"use client"

import * as React from "react"
import { ComponentPreview } from "./component-preview"
import { previewMap } from "@/components/previews/component-previews"

interface ComponentPreviewWrapperProps {
  slug: string
  registrySlug?: string
  code: string
}

export function ComponentPreviewWrapper({ slug, registrySlug, code }: ComponentPreviewWrapperProps) {
  const [source, setSource] = React.useState(code)
  const fetchSlug = registrySlug ?? slug

  React.useEffect(() => {
    if (code) return
    const url = `https://raw.githubusercontent.com/baseui-cn/baseui-cn/main/packages/registry/registry/${fetchSlug}.json`
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const content = data?.files?.[0]?.content
        if (content) setSource(content)
      })
      .catch(() => {})
  }, [fetchSlug, code])

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
      code={source}
    />
  )
}
