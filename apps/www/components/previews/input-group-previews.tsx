"use client"

import { SearchIcon, BoldIcon, ItalicIcon, LinkIcon } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"

function InputGroupDemoPreview() {
  return (
    <InputGroup>
      <InputGroupInput aria-label="Search" placeholder="Search" type="search" />
      <InputGroupAddon>
        <SearchIcon aria-hidden="true" />
      </InputGroupAddon>
    </InputGroup>
  )
}

function InputGroupTextareaPreview() {
  return (
    <InputGroup>
      <InputGroupTextarea placeholder="Tell us about yourself…" />
      <InputGroupAddon align="block-start" className="gap-1 rounded-t-lg border-b bg-muted/72 p-2!">
        <Toggle aria-label="Toggle bold" size="sm">
          <BoldIcon aria-hidden="true" />
        </Toggle>
        <Toggle aria-label="Toggle italic" size="sm">
          <ItalicIcon aria-hidden="true" />
        </Toggle>
        <Button aria-label="Link" size="icon-sm" variant="ghost">
          <LinkIcon aria-hidden="true" />
        </Button>
      </InputGroupAddon>
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
      <Button size="icon-xs" variant="ghost">
        Go
      </Button>
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
