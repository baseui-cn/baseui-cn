"use client"

import * as React from "react"

import { Skeleton } from "@/components/ui/skeleton"

function SkeletonPreview() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <div className="flex items-center gap-4">
        <Skeleton className="size-12 rounded-full" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-20 w-full rounded-lg" />
    </div>
  )
}

export const skeletonPreviewMap: Record<string, React.ComponentType> = {
  skeleton: SkeletonPreview,
  "skeleton-demo": SkeletonPreview,
}
