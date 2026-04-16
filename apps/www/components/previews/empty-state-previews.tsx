"use client"

import { Button } from "@/components/ui/button"
import { EmptyState, EmptyStateIcons } from "@/components/ui/blocks"

function EmptyStateOutlinePreview() {
  return (
    <EmptyState
      className="border border-dashed"
      icon={EmptyStateIcons.folder}
      title="Cloud storage empty"
      description="Upload files to your cloud storage to access them anywhere."
      action={
        <Button variant="outline" size="sm">
          Upload files
        </Button>
      }
    />
  )
}

export const emptyStatePreviewMap: Record<string, React.ComponentType> = {
  "empty-state-outline": EmptyStateOutlinePreview,
  "empty-state-outline-demo": EmptyStateOutlinePreview,
}
