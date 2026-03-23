"use client"

import * as React from "react"
import { useState } from "react"

import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"

function ProgressPreview() {
  const [downloadProgress, setDownloadProgress] = useState(0)
  const getStatusMessage = (progress: number) => {
    if (progress < 5) return "Initializing download..."
    if (progress < 15) return "Setting up environment..."
    if (progress < 25) return "Connecting to server..."
    if (progress < 35) return "Verifying permissions..."
    if (progress < 50) return "Downloading core files..."
    if (progress < 65) return "Downloading assets..."
    if (progress < 80) return "Downloading dependencies..."
    if (progress < 90) return "Extracting files..."
    if (progress < 95) return "Validating integrity..."
    if (progress < 100) return "Finalizing installation..."
    return "Download complete!"
  }

  React.useEffect(() => {
    const downloadTimer = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          return 0
        }
        return prev + Math.random() * 3 + 1
      })
    }, 150)
    return () => {
      clearInterval(downloadTimer)
    }
  }, [])

  return (
    <div className="flex flex-col gap-5 w-full max-w-xs">
      <Progress value={56}>
        <ProgressLabel>Uploading</ProgressLabel>
        <ProgressValue />
      </Progress>
      <div className="w-full max-w-xs space-y-2">
        <Progress value={downloadProgress}>
          <ProgressLabel>Workspace Setup</ProgressLabel>
          <ProgressValue />
        </Progress>
        <div className="text-muted-foreground text-xs">{getStatusMessage(downloadProgress)}</div>
      </div>
    </div>
  )
}

function ProgressBasicPreview() {
  return (
    <div className="w-full max-w-xs space-y-3">
      <Progress value={25} />
      <Progress value={60} />
      <Progress value={90} />
    </div>
  )
}

function ProgressIndeterminatePreview() {
  return (
    <div className="w-full max-w-xs">
      <Progress value={null} />
      <p className="mt-2 text-xs text-muted-foreground">Indeterminate — pass null or omit value</p>
    </div>
  )
}

function ProgressWithLabelAndValuePreview() {
  return (
    <div className="w-full max-w-xs space-y-3">
      <Progress value={72}>
        <ProgressLabel>Uploading files</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={45}>
        <ProgressLabel>Processing</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  )
}

export const progressPreviewMap: Record<string, React.ComponentType> = {
  progress: ProgressPreview,
  "progress-demo": ProgressPreview,
  "progress-basic": ProgressBasicPreview,
  "progress-indeterminate": ProgressIndeterminatePreview,
  "progress-with-label-and-value": ProgressWithLabelAndValuePreview,
}
