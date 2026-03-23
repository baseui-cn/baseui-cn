"use client"

import * as React from "react"

import { Field, FieldContent, FieldDescription, FieldLabel } from "../ui/field"
import { Input } from "@/components/ui/input"

function InputPreview() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldContent>
          <Input placeholder="you@example.com" type="email" />
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel>Username</FieldLabel>
        <FieldContent>
          <Input placeholder="johndoe" />
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel>Password</FieldLabel>
        <FieldContent>
          <Input type="password" placeholder="••••••••" />
        </FieldContent>
      </Field>
    </div>
  )
}

function InputBasicPreview() {
  return <Input placeholder="Enter text..." className="max-w-xs" />
}

function InputWithFieldPreview() {
  return (
    <div className="flex flex-col gap-3 w-full max-w-xs">
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldContent><Input type="email" placeholder="you@example.com" /></FieldContent>
        <FieldDescription>We&apos;ll never share your email.</FieldDescription>
      </Field>
    </div>
  )
}

function InputSizesPreview() {
  return (
    <div className="flex flex-col gap-2 w-full max-w-xs">
      <Input placeholder="Small" className="h-8 text-xs" />
      <Input placeholder="Default" />
      <Input placeholder="Large" className="h-11 text-base" />
    </div>
  )
}

function InputDisabledPreview() {
  return (
    <div className="flex flex-col gap-2 w-full max-w-xs">
      <Input placeholder="Disabled input" disabled />
      <Input defaultValue="Disabled with value" disabled />
    </div>
  )
}

export const inputPreviewMap: Record<string, React.ComponentType> = {
  input: InputPreview,
  "input-demo": InputPreview,
  "input-basic": InputBasicPreview,
  "input-with-field": InputWithFieldPreview,
  "input-sizes": InputSizesPreview,
  "input-disabled": InputDisabledPreview,
}
