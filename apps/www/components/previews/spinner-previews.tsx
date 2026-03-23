"use client"

import * as React from "react"

import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"

function SpinnerPreview() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-6">
        <Spinner className="size-4" />
        <Spinner className="size-5" />
        <Spinner className="size-6" />
        <Spinner className="size-8" />
      </div>
      <div className="flex gap-3">
        <Button disabled>
          <Spinner className="mr-2" />
          Loading...
        </Button>
        <Button variant="outline" disabled>
          <Spinner className="mr-2" />
          Please wait
        </Button>
      </div>
    </div>
  )
}

function SpinnerBasicPreview() {
  return <Spinner />
}

function SpinnerSizesPreview() {
  return (
    <div className="flex items-center gap-6">
      {["size-3", "size-4", "size-5", "size-6", "size-8"].map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Spinner className={size} />
          <span className="text-[10px] text-muted-foreground">{size.replace("size-", "")}</span>
        </div>
      ))}
    </div>
  )
}

function SpinnerWithButtonPreview() {
  const [loading, setLoading] = React.useState(false)
  return (
    <Button
      disabled={loading}
      onClick={() => {
        setLoading(true)
        setTimeout(() => setLoading(false), 2000)
      }}
    >
      {loading ? (
        <>
          <Spinner className="mr-2" />
          Saving...
        </>
      ) : (
        "Save changes"
      )}
    </Button>
  )
}

export const spinnerPreviewMap: Record<string, React.ComponentType> = {
  spinner: SpinnerPreview,
  "spinner-demo": SpinnerPreview,
  "spinner-basic": SpinnerBasicPreview,
  "spinner-sizes": SpinnerSizesPreview,
  "spinner-with-button": SpinnerWithButtonPreview,
}
