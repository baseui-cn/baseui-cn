"use client"

import * as React from "react"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

function RadioGroupPreview() {
  return (
    <RadioGroup defaultValue="comfortable" className="w-fit">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  )
}

function RadioGroupBasicPreview() {
  return (
    <RadioGroup defaultValue="a" className="w-fit">
      {["a", "b", "c"].map((v) => (
        <div key={v} className="flex items-center gap-2">
          <RadioGroupItem value={v} id={`rg-basic-${v}`} />
          <Label htmlFor={`rg-basic-${v}`}>Option {v.toUpperCase()}</Label>
        </div>
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
        <div key={v} className="flex items-center gap-2">
          <RadioGroupItem value={v} id={`rg-lbl-${v}`} />
          <div className="flex flex-col gap-0.5 leading-snug">
            <Label htmlFor={`rg-lbl-${v}`}>{label}</Label>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
        </div>
      ))}
    </RadioGroup>
  )
}

function RadioGroupHorizontalPreview() {
  return (
    <RadioGroup defaultValue="xs" className="flex flex-row gap-4">
      {["xs", "sm", "md", "lg"].map((v) => (
        <div key={v} className="flex items-center gap-2">
          <RadioGroupItem value={v} id={`rg-h-${v}`} />
          <Label htmlFor={`rg-h-${v}`}>{v.toUpperCase()}</Label>
        </div>
      ))}
    </RadioGroup>
  )
}

function RadioGroupDisabledPreview() {
  return (
    <RadioGroup defaultValue="a" className="w-fit">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="a" id="rg-d-a" />
        <Label htmlFor="rg-d-a">Enabled</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="b" id="rg-d-b" disabled />
        <Label htmlFor="rg-d-b">Disabled</Label>
      </div>
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
