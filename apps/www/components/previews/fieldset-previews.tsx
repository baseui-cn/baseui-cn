"use client"

import * as React from "react"
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Fieldset, FieldsetLegend } from "@/components/ui/fieldset"

function FieldsetPreview() {
  return (
    <Fieldset className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-border p-4">
      <FieldsetLegend>Billing details</FieldsetLegend>
      <Field>
        <FieldLabel>Company</FieldLabel>
        <FieldControl placeholder="Acme Inc." />
      </Field>
      <Field>
        <FieldLabel>Tax ID</FieldLabel>
        <FieldControl placeholder="US-123456789" />
      </Field>
    </Fieldset>
  )
}

function FieldsetHelperPreview() {
  return (
    <Fieldset className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-border p-4">
      <FieldsetLegend>Profile</FieldsetLegend>
      <Field>
        <FieldLabel>Display name</FieldLabel>
        <FieldControl defaultValue="Base UI Builder" />
        <FieldDescription>This name appears in collaborative spaces.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldControl defaultValue="hello@baseui-cn.com" type="email" />
      </Field>
    </Fieldset>
  )
}

export const fieldsetPreviewMap: Record<string, React.ComponentType> = {
  fieldset: FieldsetPreview,
  "fieldset-demo": FieldsetPreview,
  "fieldset-helper": FieldsetHelperPreview,
}
