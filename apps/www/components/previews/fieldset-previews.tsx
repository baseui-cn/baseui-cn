"use client"

import * as React from "react"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Fieldset, FieldsetLegend } from "@/components/ui/fieldset"
import { Input } from "@/components/ui/input"

function FieldsetPreview() {
  return (
    <Fieldset className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-border p-4">
      <FieldsetLegend>Billing details</FieldsetLegend>
      <Field>
        <FieldLabel>Company</FieldLabel>
        <Input placeholder="Acme Inc." />
      </Field>
      <Field>
        <FieldLabel>Tax ID</FieldLabel>
        <Input placeholder="US-123456789" />
      </Field>
    </Fieldset>
  )
}

function FieldsetHelperPreview() {
  return (
    <Fieldset className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-border p-4">
      <FieldsetLegend variant="border">Profile</FieldsetLegend>
      <Field>
        <FieldLabel>Display name</FieldLabel>
        <Input defaultValue="Base UI Builder" />
        <FieldDescription>This name appears in collaborative spaces.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input defaultValue="hello@baseui-cn.com" type="email" />
      </Field>
    </Fieldset>
  )
}

function FieldsetDisabledPreview() {
  return (
    <Fieldset
      disabled
      className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-border p-4"
    >
      <FieldsetLegend>Workspace access</FieldsetLegend>
      <Field>
        <FieldLabel>Workspace name</FieldLabel>
        <Input defaultValue="Base UI Team" />
        <FieldDescription>
          This section is locked for users without admin permissions.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel>Invite email</FieldLabel>
        <Input defaultValue="teammate@example.com" type="email" />
      </Field>
    </Fieldset>
  )
}

function FieldsetAddressPreview() {
  return (
    <Fieldset className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-border p-4">
      <FieldsetLegend>Shipping address</FieldsetLegend>
      <Field>
        <FieldLabel>Street</FieldLabel>
        <Input placeholder="123 Market St" />
      </Field>
      <Field>
        <FieldLabel>City</FieldLabel>
        <Input placeholder="San Francisco" />
      </Field>
      <Field>
        <FieldLabel>Postal code</FieldLabel>
        <Input placeholder="94103" />
      </Field>
    </Fieldset>
  )
}

export const fieldsetPreviewMap: Record<string, React.ComponentType> = {
  fieldset: FieldsetPreview,
  "fieldset-demo": FieldsetPreview,
  "fieldset-helper": FieldsetHelperPreview,
  "fieldset-disabled": FieldsetDisabledPreview,
  "fieldset-address": FieldsetAddressPreview,
}
