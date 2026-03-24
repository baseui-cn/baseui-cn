"use client"

import * as React from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

function CheckboxPreview() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-2">
        <Checkbox id="terms-2" defaultChecked />
        <div className="flex flex-col gap-1 leading-snug">
          <Label htmlFor="terms-2">Accept terms and conditions</Label>
          <p className="text-sm text-muted-foreground">
            This checkbox is used to accept the terms and conditions.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Basic checkbox</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="terms-3" disabled />
        <Label htmlFor="terms-3">Disabled</Label>
      </div>
    </div>
  )
}

function CheckboxBasicPreview() {
  return <Checkbox id="cb-basic" />
}

function CheckboxWithLabelPreview() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="cb-label-1" defaultChecked />
        <Label htmlFor="cb-label-1">Accept terms</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-label-2" />
        <Label htmlFor="cb-label-2">Subscribe to updates</Label>
      </div>
    </div>
  )
}

function CheckboxDisabledPreview() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="cb-dis-1" disabled />
        <Label htmlFor="cb-dis-1">Disabled unchecked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-dis-2" disabled defaultChecked />
        <Label htmlFor="cb-dis-2">Disabled checked</Label>
      </div>
    </div>
  )
}

function CheckboxIndeterminatePreview() {
  const [checked, setChecked] = React.useState(false)
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="cb-indet" indeterminate checked={checked} onCheckedChange={(v) => setChecked(v)} />
      <Label htmlFor="cb-indet">Indeterminate (click to toggle)</Label>
    </div>
  )
}

export const checkboxPreviewMap: Record<string, React.ComponentType> = {
  checkbox: CheckboxPreview,
  "checkbox-demo": CheckboxPreview,
  "checkbox-basic": CheckboxBasicPreview,
  "checkbox-with-label": CheckboxWithLabelPreview,
  "checkbox-disabled": CheckboxDisabledPreview,
  "checkbox-indeterminate": CheckboxIndeterminatePreview,
}
