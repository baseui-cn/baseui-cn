"use client"

import * as React from "react"

import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

function InputPreview() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Email</label>
        <Input placeholder="you@example.com" type="email" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Username</label>
        <Input placeholder="johndoe" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Password</label>
        <Input type="password" placeholder="••••••••" />
      </div>
    </div>
  )
}

function InputBasicPreview() {
  return <Input placeholder="Enter text..." className="max-w-xs" />
}

function InputWithFieldPreview() {
  return (
    <Field className="w-full max-w-xs">
      <FieldLabel>Email</FieldLabel>
      <Input type="email" placeholder="you@example.com" />
      <FieldDescription>We&apos;ll never share your email.</FieldDescription>
    </Field>
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
