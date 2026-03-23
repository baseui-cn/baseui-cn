"use client"

import * as React from "react"

import { Field, FieldContent, FieldDescription, FieldLabel } from "../ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

function RadioGroupPreview() {
  return (
    <RadioGroup defaultValue="comfortable" className="w-fit">
      <Field orientation="horizontal">
        <RadioGroupItem value="default" id="r1" />
        <FieldLabel htmlFor="r1">Default</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="comfortable" id="r2" />
        <FieldLabel htmlFor="r2">Comfortable</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="compact" id="r3" />
        <FieldLabel htmlFor="r3">Compact</FieldLabel>
      </Field>
    </RadioGroup>
  )
}

function RadioGroupBasicPreview() {
  return (
    <RadioGroup defaultValue="a" className="w-fit">
      {["a", "b", "c"].map((v) => (
        <Field key={v} orientation="horizontal">
          <RadioGroupItem value={v} id={`rg-basic-${v}`} />
          <FieldLabel htmlFor={`rg-basic-${v}`}>Option {v.toUpperCase()}</FieldLabel>
        </Field>
      ))}
    </RadioGroup>
  )
}

function RadioGroupWithLabelsPreview() {
  return (
    <RadioGroup defaultValue="comfortable" className="w-fit">
      {[
        { v: "default", label: "Default", desc: "Standard spacing" },
        { v: "comfortable", label: "Comfortable", desc: "More breathing room" },
        { v: "compact", label: "Compact", desc: "Tight spacing" },
      ].map(({ v, label, desc }) => (
        <Field key={v} orientation="horizontal">
          <RadioGroupItem value={v} id={`rg-lbl-${v}`} />
          <FieldContent>
            <FieldLabel htmlFor={`rg-lbl-${v}`}>{label}</FieldLabel>
            <FieldDescription>{desc}</FieldDescription>
          </FieldContent>
        </Field>
      ))}
    </RadioGroup>
  )
}

function RadioGroupHorizontalPreview() {
  return (
    <RadioGroup defaultValue="xs" className="flex flex-row gap-4">
      {["xs", "sm", "md", "lg"].map((v) => (
        <Field key={v} orientation="horizontal">
          <RadioGroupItem value={v} id={`rg-h-${v}`} />
          <FieldLabel htmlFor={`rg-h-${v}`}>{v.toUpperCase()}</FieldLabel>
        </Field>
      ))}
    </RadioGroup>
  )
}

function RadioGroupDisabledPreview() {
  return (
    <RadioGroup defaultValue="a" className="w-fit">
      <Field orientation="horizontal">
        <RadioGroupItem value="a" id="rg-d-a" />
        <FieldLabel htmlFor="rg-d-a">Enabled</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="b" id="rg-d-b" disabled />
        <FieldLabel htmlFor="rg-d-b">Disabled</FieldLabel>
      </Field>
    </RadioGroup>
  )
}

export const radioGroupPreviewMap: Record<string, React.ComponentType> = {
  "radio-group": RadioGroupPreview,
  "radio-group-demo": RadioGroupPreview,
  "radio-group-basic": RadioGroupBasicPreview,
  "radio-group-with-labels": RadioGroupWithLabelsPreview,
  "radio-group-horizontal": RadioGroupHorizontalPreview,
  "radio-group-disabled": RadioGroupDisabledPreview,
}
