"use client"

import { Button } from "@/components/ui/button"
import {
  EmptyState,
  EmptyStateContent,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateMedia,
  EmptyStateTitle,
} from "@/components/ui/empty-state"
import { FolderCode, CloudUpload, ArrowUpRight } from "lucide-react"

function EmptyStatePreview() {
  return (
    <EmptyState>
      <EmptyStateHeader>
        <EmptyStateMedia variant="icon">
          <FolderCode />
        </EmptyStateMedia>
        <EmptyStateTitle>No Projects Yet</EmptyStateTitle>
        <EmptyStateDescription>
          You haven&apos;t created any projects yet. Get started by creating
          your first project.
        </EmptyStateDescription>
      </EmptyStateHeader>
      <EmptyStateContent className="flex-row justify-center gap-2">
        <Button>Create Project</Button>
        <Button variant="outline">Import Project</Button>
      </EmptyStateContent>
      <a
        href="#"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Learn More <ArrowUpRight className="size-3.5" />
      </a>
    </EmptyState>
  )
}

function EmptyStateOutlinePreview() {
  return (
    <EmptyState className="border border-dashed">
      <EmptyStateHeader>
        <EmptyStateMedia variant="icon">
          <CloudUpload />
        </EmptyStateMedia>
        <EmptyStateTitle>Cloud Storage Empty</EmptyStateTitle>
        <EmptyStateDescription>
          Upload files to your cloud storage to access them anywhere.
        </EmptyStateDescription>
      </EmptyStateHeader>
      <EmptyStateContent>
        <Button variant="outline" size="sm">
          Upload Files
        </Button>
      </EmptyStateContent>
    </EmptyState>
  )
}

export const emptyStatePreviewMap: Record<string, React.ComponentType> = {
  "empty-state": EmptyStatePreview,
  "empty-state-demo": EmptyStatePreview,
  "empty-state-outline": EmptyStateOutlinePreview,
  "empty-state-outline-demo": EmptyStateOutlinePreview,
}
