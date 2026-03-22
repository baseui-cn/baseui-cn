"use client"

import { previewMap } from "@/components/previews/component-previews"
import { ComponentPreviewWrapper } from "@/components/docs/component-preview-wrapper"

// Resolve "button-demo" / "button-variants" → previewMap key
// e.g. "button-variants" → "button-variants" (exact), "alert-dialog-demo" → "alert-dialog"
function resolvePreviewSlug(name: string): string {
  let candidate = name
  while (candidate) {
    if (previewMap[candidate]) return candidate
    const lastHyphen = candidate.lastIndexOf("-")
    if (lastHyphen === -1) break
    candidate = candidate.slice(0, lastHyphen)
  }
  return name
}

// Find the base/shortest previewMap key to use as the registry slug for source fetching
// e.g. "button-variants" → "button", "dropdown-menu-basic" → "dropdown-menu"
function resolveRegistrySlug(name: string): string {
  let candidate = name
  let lastMatch = ""
  while (candidate) {
    if (previewMap[candidate]) lastMatch = candidate
    const lastHyphen = candidate.lastIndexOf("-")
    if (lastHyphen === -1) break
    candidate = candidate.slice(0, lastHyphen)
  }
  return lastMatch || name
}

export function ComponentPreviewMdx({ name, code }: { name: string; code?: string }) {
  const slug = resolvePreviewSlug(name)
  const registrySlug = resolveRegistrySlug(name)
  return <ComponentPreviewWrapper slug={slug} registrySlug={registrySlug} code={code ?? ""} />
}
