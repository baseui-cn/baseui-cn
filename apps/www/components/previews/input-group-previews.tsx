"use client"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupPreview,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"

function InputGroupDemoPreview() {
  return <InputGroupPreview />
}

function InputGroupTextareaPreview() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupAddon data-align="block-start">
        <InputGroupText>Note</InputGroupText>
      </InputGroupAddon>
      <InputGroupTextarea placeholder="Enter a note..." rows={3} />
    </InputGroup>
  )
}

function InputGroupWithBothAddonsPreview() {
  return (
    <InputGroup className="max-w-xs">
      <InputGroupAddon data-align="inline-start">
        <InputGroupText>$</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="0.00" />
      <InputGroupAddon data-align="inline-end">
        <InputGroupText>USD</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  )
}

function InputGroupWithPrefixPreview() {
  return (
    <InputGroup className="max-w-xs">
      <InputGroupAddon data-align="inline-start">
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="example.com" />
    </InputGroup>
  )
}

function InputGroupWithSuffixButtonPreview() {
  return (
    <InputGroup className="max-w-xs">
      <InputGroupInput placeholder="Search..." />
      <InputGroupButton>Go</InputGroupButton>
    </InputGroup>
  )
}

export const inputGroupPreviewMap: Record<string, React.ComponentType> = {
  "input-group": InputGroupDemoPreview,
  "input-group-demo": InputGroupDemoPreview,
  "input-group-textarea": InputGroupTextareaPreview,
  "input-group-with-both-addons": InputGroupWithBothAddonsPreview,
  "input-group-with-prefix": InputGroupWithPrefixPreview,
  "input-group-with-suffix-button": InputGroupWithSuffixButtonPreview,
}
