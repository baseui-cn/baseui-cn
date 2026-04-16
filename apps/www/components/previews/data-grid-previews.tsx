"use client"

import * as React from "react"
import { ToastProvider } from "@/components/ui/toast"
import { Pattern as DataGridBasicPreview } from "@/components/previews/data-grid/c-data-grid-1"
import { PatternEdit1 as DataGridEditingPreview } from "@/components/previews/data-grid/c-data-grid-2"
import { PatternEdit2 as DataGridAsyncEditingPreview } from "@/components/previews/data-grid/c-data-grid-3"

function DataGridEditingToastPreview() {
  return (
    <ToastProvider>
      <DataGridEditingPreview />
    </ToastProvider>
  )
}

function DataGridAsyncEditingToastPreview() {
  return (
    <ToastProvider>
      <DataGridAsyncEditingPreview />
    </ToastProvider>
  )
}

export const dataGridPreviewMap: Record<string, React.ComponentType> = {
  "data-grid": DataGridBasicPreview,
  "data-grid-demo": DataGridBasicPreview,
  "data-grid-basic": DataGridBasicPreview,
  "data-grid-editing": DataGridEditingToastPreview,
  "data-grid-async-editing": DataGridAsyncEditingToastPreview,
}
