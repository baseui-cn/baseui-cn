"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"

function BadgePreview() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Badge variant="default">Default</Badge>
        <Badge variant="primary">Primary</Badge>
        <Badge variant="primary-outline">Primary outline</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="info">Info</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="success-outline">Success outline</Badge>
        <Badge variant="warning-outline">Warning outline</Badge>
        <Badge variant="info-outline">Info outline</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge size="sm">Small</Badge>
        <Badge size="default">Default</Badge>
        <Badge size="lg">Large</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge shape="pill">Pill</Badge>
        <Badge shape="pill" variant="secondary">
          Secondary pill
        </Badge>
        <Badge shape="pill" variant="success">
          Active
        </Badge>
      </div>
    </div>
  )
}

function BadgeVariantsPreview() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Badge variant="default">Default</Badge>
        <Badge variant="primary">Primary</Badge>
        <Badge variant="primary-outline">Primary outline</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="success">Success</Badge>
        <Badge variant="success-outline">Success outline</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="warning-outline">Warning outline</Badge>
        <Badge variant="info">Info</Badge>
        <Badge variant="info-outline">Info outline</Badge>
      </div>
    </div>
  )
}

function BadgePillPreview() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge shape="pill">Default pill</Badge>
      <Badge shape="pill" variant="success">Active</Badge>
      <Badge shape="pill" variant="warning">Pending</Badge>
      <Badge shape="pill" variant="destructive">Failed</Badge>
    </div>
  )
}

function BadgeSizesPreview() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge size="sm">Small</Badge>
      <Badge size="default">Default</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  )
}

export const badgePreviewMap: Record<string, React.ComponentType> = {
  badge: BadgePreview,
  "badge-demo": BadgePreview,
  "badge-variants": BadgeVariantsPreview,
  "badge-pill": BadgePillPreview,
  "badge-sizes": BadgeSizesPreview,
}
