"use client"

import * as React from "react"
import {
  NumberField,
  NumberFieldGroup,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
} from "@/components/ui/number-field"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

function NumberFieldPreview() {
  return (
    <div className="w-full max-w-48">
      <NumberField defaultValue={25} min={0} max={100}>
        <NumberFieldScrubArea label="Amount" />
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
    </div>
  )
}

function NumberFieldBasicPreview() {
  return (
    <div className="w-full max-w-48">
      <NumberField defaultValue={0}>
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
    </div>
  )
}

function NumberFieldSizesPreview() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <NumberField defaultValue={10} size="sm">
        <NumberFieldScrubArea label="Small" />
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
      <NumberField defaultValue={25} size="default">
        <NumberFieldScrubArea label="Default" />
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
      <NumberField defaultValue={50} size="lg">
        <NumberFieldScrubArea label="Large" />
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
    </div>
  )
}

function NumberFieldMinMaxPreview() {
  return (
    <div className="w-full max-w-48">
      <NumberField defaultValue={5} min={0} max={10} step={1}>
        <NumberFieldScrubArea label="Quantity (0-10)" />
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
    </div>
  )
}

function NumberFieldStepPreview() {
  return (
    <div className="w-full max-w-48">
      <NumberField defaultValue={0} step={0.25} min={0} max={5}>
        <NumberFieldScrubArea label="Rating (step 0.25)" />
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
    </div>
  )
}

function NumberFieldDisabledPreview() {
  return (
    <div className="w-full max-w-48">
      <NumberField defaultValue={42} disabled>
        <NumberFieldScrubArea label="Disabled" />
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
    </div>
  )
}

function NumberFieldFormatPreview() {
  return (
    <div className="w-full max-w-48">
      <NumberField
        defaultValue={1250}
        step={100}
        format={{ style: "currency", currency: "USD" }}
      >
        <NumberFieldScrubArea label="Price" />
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
    </div>
  )
}

function NumberFieldWithSpinnerButtonsPreview() {
  return (
    <div className="w-full max-w-48">
      <NumberField defaultValue={5} min={0} max={100}>
        <NumberFieldScrubArea label="Amount" />
        <NumberFieldGroup>
          <NumberFieldInput className="text-start" />
          <div className="border-input bg-muted/30 rounded-md m-px flex shrink-0 flex-col overflow-hidden border">
            <NumberFieldIncrement className="border-input hover:bg-accent focus-visible:bg-accent flex h-3.5 w-full flex-1 shrink-0 items-center rounded-none! border-b px-1.5 leading-none">
              <ChevronUpIcon className="size-3.5" />
            </NumberFieldIncrement>
            <NumberFieldDecrement className="hover:bg-accent focus-visible:bg-accent flex h-3.5 w-full flex-1 shrink-0 items-center rounded-none! px-1.5 leading-none">
              <ChevronDownIcon className="size-3.5" />
            </NumberFieldDecrement>
          </div>
        </NumberFieldGroup>
      </NumberField>
    </div>
  )
}

export const numberFieldPreviewMap: Record<string, React.ComponentType> = {
  "number-field": NumberFieldPreview,
  "number-field-demo": NumberFieldPreview,
  "number-field-basic": NumberFieldBasicPreview,
  "number-field-sizes": NumberFieldSizesPreview,
  "number-field-min-max": NumberFieldMinMaxPreview,
  "number-field-step": NumberFieldStepPreview,
  "number-field-disabled": NumberFieldDisabledPreview,
  "number-field-format": NumberFieldFormatPreview,
  "number-field-with-spinner-buttons": NumberFieldWithSpinnerButtonsPreview,
}
