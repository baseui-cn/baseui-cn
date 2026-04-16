"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"

function ButtonPreview() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div className="flex flex-wrap gap-2">
        <Button variant="default">Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="warning">Warning</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="xs">XSmall</Button>
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="xl">XLarge</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" variant="outline" aria-label="Add">
          <svg className="size-4" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3v10M3 8h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </Button>
      </div>
      <div className="flex gap-2">
        <Button disabled>Disabled</Button>
        <Button variant="outline" disabled>
          Disabled outline
        </Button>
      </div>
    </div>
  )
}

function ButtonVariantsPreview() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="destructive-outline">Destructive outline</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="link">Link</Button>
    </div>
  )
}

function ButtonSizesPreview() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="xs">XSmall</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">XLarge</Button>
      <Button size="icon-xs" variant="outline" aria-label="More options">
        <svg className="size-4" viewBox="0 0 16 16" fill="none">
          <path
            d="M3.5 8a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1ZM8 8a.5.5 0 1 0 0 1A.5.5 0 0 0 8 8Zm4 0a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1Z"
            fill="currentColor"
          />
        </svg>
      </Button>
      <Button size="icon" variant="outline" aria-label="Add">
        <svg className="size-4" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </Button>
      <Button size="icon-lg" variant="outline" aria-label="Upload">
        <svg className="size-4" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 11V3M8 3 5.5 5.5M8 3l2.5 2.5M3 12.5h10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
    </div>
  )
}

function ButtonLoadingPreview() {
  const [loading, setLoading] = React.useState(false)
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        loading={loading}
        onClick={() => {
          setLoading(true)
          setTimeout(() => setLoading(false), 2000)
        }}
      >
        Save changes
      </Button>
      <Button variant="outline" loading={loading}>
        Sync project
      </Button>
    </div>
  )
}

function ButtonWithIconPreview() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button>
        <svg className="mr-2 size-4" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        New item
      </Button>
      <Button variant="outline">
        <svg className="mr-2 size-4" viewBox="0 0 16 16" fill="none">
          <path
            d="M2 8l3.5 3.5L13 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Confirm
      </Button>
      <Button variant="destructive">
        <svg className="mr-2 size-4" viewBox="0 0 16 16" fill="none">
          <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Delete
      </Button>
    </div>
  )
}

export const buttonPreviewMap: Record<string, React.ComponentType> = {
  button: ButtonPreview,
  "button-demo": ButtonPreview,
  "button-variants": ButtonVariantsPreview,
  "button-sizes": ButtonSizesPreview,
  "button-loading": ButtonLoadingPreview,
  "button-with-icon": ButtonWithIconPreview,
}
