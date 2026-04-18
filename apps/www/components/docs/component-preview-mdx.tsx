"use client"

import { ComponentPreviewWrapper } from "@/components/docs/component-preview-wrapper"

export function ComponentPreviewMdx({
  name,
  code,
  previewCode,
}: {
  name: string
  code?: string
  previewCode?: string
}) {
  return <ComponentPreviewWrapper slug={name} code={code ?? ""} previewCode={previewCode ?? ""} />
}
