"use client"

import * as React from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldDescription, FieldLabel } from "../ui/field"

function CheckboxPreview() {
  return (
    <div className="flex flex-col gap-3">
      <Field orientation="horizontal" className="w-auto max-w-xs">
        <Checkbox id="terms-2" defaultChecked />
        <FieldContent>
          <FieldLabel htmlFor="terms-2">Accept terms and conditions</FieldLabel>
          <FieldDescription>
            This checkbox is used to accept the terms and conditions.
          </FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal" className="w-auto">
        <Checkbox id="terms" />
        <FieldLabel htmlFor="terms">Basic checkbox</FieldLabel>
      </Field>
      <Field orientation="horizontal" className="w-auto">
        <Checkbox id="terms-3" disabled />
        <FieldLabel htmlFor="terms-3">Disabled</FieldLabel>
      </Field>
    </div>
  )
}

function CheckboxBasicPreview() {
  return <Checkbox id="cb-basic" />
}

function CheckboxWithLabelPreview() {
  return (
    <div className="flex flex-col gap-3">
      <Field orientation="horizontal" className="w-auto">
        <Checkbox id="cb-label-1" defaultChecked />
        <FieldLabel htmlFor="cb-label-1">Accept terms</FieldLabel>
      </Field>
      <Field orientation="horizontal" className="w-auto">
        <Checkbox id="cb-label-2" />
        <FieldLabel htmlFor="cb-label-2">Subscribe to updates</FieldLabel>
      </Field>
    </div>
  )
}

function CheckboxDisabledPreview() {
  return (
    <div className="flex flex-col gap-3">
      <Field orientation="horizontal" className="w-auto">
        <Checkbox id="cb-dis-1" disabled />
        <FieldLabel htmlFor="cb-dis-1">Disabled unchecked</FieldLabel>
      </Field>
      <Field orientation="horizontal" className="w-auto">
        <Checkbox id="cb-dis-2" disabled defaultChecked />
        <FieldLabel htmlFor="cb-dis-2">Disabled checked</FieldLabel>
      </Field>
    </div>
  )
}

function CheckboxIndeterminatePreview() {
  const [checked, setChecked] = React.useState(false)
  return (
    <Field orientation="horizontal" className="w-auto">
      <Checkbox id="cb-indet" indeterminate checked={checked} onCheckedChange={(v) => setChecked(v)} />
      <FieldLabel htmlFor="cb-indet">Indeterminate (click to toggle)</FieldLabel>
    </Field>
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
