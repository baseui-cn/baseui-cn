"use client"

import * as React from "react"
import { AlertCircle, CircleCheckIcon, Info, InfoIcon, TriangleAlertIcon } from "lucide-react"

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

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
      <Alert variant="success">
        <CircleCheckIcon />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>Describe what can be done about it here.</AlertDescription>
      </Alert>
      <Alert>
        <Info className="size-4 text-info" />
        <AlertTitle>Informational message</AlertTitle>
        <AlertDescription>
          This is a neutral inline message that keeps the current flow moving.
        </AlertDescription>
      </Alert>
      <Alert variant="warning">
        <TriangleAlertIcon />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>Describe what can be done about it here.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertTitle>Action required</AlertTitle>
        <AlertDescription>Something needs attention before the user can continue.</AlertDescription>
      </Alert>
    </div>
  )
}

function AlertWithActionPreview() {
  return (
    <Alert>
      <InfoIcon />
      <AlertTitle>Provider not configured.</AlertTitle>
      <AlertDescription>Add the missing environment variable and redeploy.</AlertDescription>
      <AlertAction>
        <Button size="xs" variant="ghost">
          Dismiss
        </Button>
        <Button size="xs">Ok</Button>
      </AlertAction>
    </Alert>
  )
}

export const alertPreviewMap: Record<string, React.ComponentType> = {
  alert: AlertPreview,
  "alert-demo": AlertPreview,
  "alert-variants": AlertVariantsPreview,
  "alert-with-action": AlertWithActionPreview,
}
