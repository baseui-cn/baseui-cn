"use client"

import * as React from "react"
import { AlertCircle, Info, TriangleAlert } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

function AlertPreview() {
  return (
    <Alert>
      <Info className="size-4" />
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>
        Use alerts to surface persistent status messages inside forms, settings, and empty states.
      </AlertDescription>
    </Alert>
  )
}

function AlertVariantsPreview() {
  return (
    <div className="grid gap-3">
      <Alert>
        <Info className="size-4 text-info" />
        <AlertTitle>Informational message</AlertTitle>
        <AlertDescription>
          This is a neutral inline message that keeps the current flow moving.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertTitle>Action required</AlertTitle>
        <AlertDescription>
          Something needs attention before the user can continue.
        </AlertDescription>
      </Alert>
    </div>
  )
}

function AlertWithActionPreview() {
  return (
    <Alert>
      <TriangleAlert className="size-4 text-warning" />
      <AlertTitle>Provider not configured</AlertTitle>
      <AlertDescription>
        Add the missing environment variable and redeploy to enable sign-in for this tenant.
      </AlertDescription>
    </Alert>
  )
}

export const alertPreviewMap: Record<string, React.ComponentType> = {
  alert: AlertPreview,
  "alert-demo": AlertPreview,
  "alert-variants": AlertVariantsPreview,
  "alert-with-action": AlertWithActionPreview,
}
