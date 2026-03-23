"use client"

import { Field, FieldDescription, FieldLabel } from "../ui/field"
import { Textarea } from "@/components/ui/textarea"

function TextareaPreview() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <Field>
        <FieldLabel>Message</FieldLabel>
        <Textarea placeholder="Write your message here..." />
      </Field>
      <Field>
        <FieldLabel>Notes</FieldLabel>
        <Textarea placeholder="Add notes..." />
      </Field>
    </div>
  )
}

function TextareaBasicPreview() {
  return <Textarea placeholder="Write something..." className="max-w-xs" />
}

function TextareaWithFieldPreview() {
  return (
    <Field className="max-w-xs">
      <FieldLabel>Message</FieldLabel>
      <Textarea placeholder="Enter your message..." />
      <FieldDescription>Up to 500 characters.</FieldDescription>
    </Field>
  )
}

function TextareaAutoResizePreview() {
  return (
    <div className="flex flex-col gap-2 max-w-xs w-full">
      <p className="text-xs text-muted-foreground">This textarea grows as you type.</p>
      <Textarea placeholder="Start typing to see it grow..." rows={2} />
    </div>
  )
}

function TextareaDisabledPreview() {
  return <Textarea placeholder="Disabled textarea" disabled className="max-w-xs" />
}

export const textareaPreviewMap: Record<string, React.ComponentType> = {
  textarea: TextareaPreview,
  "textarea-demo": TextareaPreview,
  "textarea-basic": TextareaBasicPreview,
  "textarea-with-field": TextareaWithFieldPreview,
  "textarea-auto-resize": TextareaAutoResizePreview,
  "textarea-disabled": TextareaDisabledPreview,
}
