"use client"

import * as React from "react"

import { Switch } from "@/components/ui/switch"

function SwitchPreview() {
  return (
    <div className="flex flex-col gap-4">
      <Switch label="Email notifications" />
      <Switch
        label="Push notifications"
        description="Receive alerts on your device"
        defaultChecked
      />
      <Switch label="Disabled" disabled />
    </div>
  )
}

function SwitchBasicPreview() {
  return <Switch />
}

function SwitchWithLabelAndDescriptionPreview() {
  return (
    <div className="flex flex-col gap-4">
      <Switch label="Email notifications" description="Receive alerts about your account" defaultChecked />
      <Switch label="Marketing emails" description="Get tips, news, and offers" />
    </div>
  )
}

function SwitchControlledPreview() {
  const [on, setOn] = React.useState(false)
  return (
    <div className="flex flex-col gap-3">
      <Switch label={on ? "Enabled" : "Disabled"} checked={on} onCheckedChange={setOn} />
      <p className="text-xs text-muted-foreground">State: {on ? "on" : "off"}</p>
    </div>
  )
}

function SwitchDisabledPreview() {
  return (
    <div className="flex flex-col gap-3">
      <Switch label="Disabled off" disabled />
      <Switch label="Disabled on" disabled defaultChecked />
    </div>
  )
}

export const switchPreviewMap: Record<string, React.ComponentType> = {
  switch: SwitchPreview,
  "switch-demo": SwitchPreview,
  "switch-basic": SwitchBasicPreview,
  "switch-with-label-and-description": SwitchWithLabelAndDescriptionPreview,
  "switch-controlled": SwitchControlledPreview,
  "switch-disabled": SwitchDisabledPreview,
}
