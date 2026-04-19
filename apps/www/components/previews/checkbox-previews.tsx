"use client"

import * as React from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CheckboxGroup } from "@/components/ui/checkbox-group"

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

function CheckboxCardStylePreview() {
  return (
    <Label className="flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">
      <Checkbox defaultChecked />
      <div className="flex flex-col gap-1">
        <p>Enable notifications</p>
        <p className="text-muted-foreground text-xs">
          You can enable or disable notifications at any time.
        </p>
      </div>
    </Label>
  )
}

function CheckboxIndeterminatePreview() {
  const [checked, setChecked] = React.useState(false)
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id="cb-indet"
        indeterminate
        checked={checked}
        onCheckedChange={(v) => setChecked(v)}
      />
      <Label htmlFor="cb-indet">Indeterminate</Label>
    </div>
  )
}

function CheckboxGroupPreview() {
  return (
    <CheckboxGroup aria-label="Select components" defaultValue={["baseui"]}>
      <Label>
        <Checkbox value="baseui" />
        base-ui
      </Label>
      <Label>
        <Checkbox value="mui" />
        MUI
      </Label>
      <Label>
        <Checkbox value="baseui-cn" />
        Baseui-cn
      </Label>
    </CheckboxGroup>
  )
}

export const checkboxPreviewMap: Record<string, React.ComponentType> = {
  checkbox: CheckboxPreview,
  "checkbox-demo": CheckboxPreview,
  "checkbox-with-label": CheckboxWithLabelPreview,
  "checkbox-card-style": CheckboxCardStylePreview,
  "checkbox-group": CheckboxGroupPreview,
  "checkbox-indeterminate": CheckboxIndeterminatePreview,
}
