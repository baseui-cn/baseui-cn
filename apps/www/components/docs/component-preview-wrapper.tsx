"use client"

import * as React from "react"
import { ComponentPreview } from "./component-preview"

interface ComponentPreviewWrapperProps {
  slug: string
  registrySlug?: string
  code: string
  previewCode?: string
}

type PreviewComponent = React.ComponentType<Record<string, never>>

function resolvePreviewComponent(
  previewMap: Record<string, React.ComponentType>,
  slug: string
): PreviewComponent | null {
  let candidate = slug

  while (candidate) {
    const preview = previewMap[candidate]
    if (preview) {
      return preview as PreviewComponent
    }

    const lastHyphen = candidate.lastIndexOf("-")
    if (lastHyphen === -1) {
      break
    }

    candidate = candidate.slice(0, lastHyphen)
  }

  return null
}

class PreviewErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidUpdate(prevProps: { children: React.ReactNode }) {
    if (prevProps.children !== this.props.children && this.state.hasError) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

export function ComponentPreviewWrapper({
  slug,
  registrySlug: _registrySlug,
  code,
  previewCode,
}: ComponentPreviewWrapperProps) {
  const displayCode = previewCode || code
  const [Preview, setPreview] = React.useState<PreviewComponent | null>(null)
  const [status, setStatus] = React.useState<"loading" | "ready" | "missing" | "error">(
    "loading"
  )

  React.useEffect(() => {
    let cancelled = false

    async function loadPreview() {
      setStatus("loading")

      try {
        const module = await import("@/components/previews/component-previews-map")
        if (cancelled) {
          return
        }

        const resolvedPreview = resolvePreviewComponent(module.previewMap, slug)
        setPreview(() => resolvedPreview)
        setStatus(resolvedPreview ? "ready" : "missing")
      } catch {
        if (!cancelled) {
          setPreview(null)
          setStatus("error")
        }
      }
    }

    void loadPreview()

    return () => {
      cancelled = true
    }
  }, [slug])

  const fallback = (
    <div className="text-sm text-muted-foreground">
      {status === "loading" ? "Loading preview..." : "Preview unavailable"}
    </div>
  )

  return (
    <ComponentPreview
      preview={
        Preview ? (
          <PreviewErrorBoundary fallback={fallback}>
            <Preview />
          </PreviewErrorBoundary>
        ) : (
          fallback
        )
      }
      code={displayCode}
    />
  )
}
