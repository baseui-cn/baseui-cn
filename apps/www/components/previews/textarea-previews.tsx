"use client"

import { ArrowUpIcon, PlusIcon } from "lucide-react"
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field"
import { Form } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import {
  Popover,
  PopoverDescription,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

function TextareaPreview() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-medium">Message</Label>
        <Textarea placeholder="Write your message here..." />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-medium">Notes (disabled)</Label>
        <Textarea placeholder="Add notes..." disabled />
      </div>
    </div>
  )
}

function TextareaBasicPreview() {
  return <Textarea placeholder="Write something..." className="max-w-xs" />
}

function TextareaWithFieldPreview() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <Field>
        <FieldLabel>
          Message <span className="text-destructive">*</span>
        </FieldLabel>
        <Textarea placeholder="Type your message here" required />
        <FieldError>Please fill out this field.</FieldError>
      </Field>
    </div>
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

function TextareaPopoverFormPreview() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>Open Popover</PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="mb-4">
          <PopoverTitle className="text-base">Send us feedback</PopoverTitle>
          <PopoverDescription>Let us know how we can improve.</PopoverDescription>
        </div>
        <Form className="flex w-full flex-col gap-4">
          <Field>
            <Textarea aria-label="Send feedback" id="feedback" placeholder="How can we improve?" />
          </Field>
          <Button type="submit">Send feedback</Button>
        </Form>
      </PopoverContent>
    </Popover>
  )
}

function TextareaWithInputGroup() {
  return (
    <InputGroup>
      <InputGroupTextarea placeholder="Ask, Search or Chat…" />
      <InputGroupAddon align="block-end">
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger
              render={
                <DropdownMenuTrigger
                  render={
                    <Button
                      aria-label="Add files"
                      className="rounded-full"
                      size="icon-sm"
                      variant="ghost"
                    />
                  }
                >
                  <PlusIcon />
                </DropdownMenuTrigger>
              }
            />
            <TooltipContent>Add files and more</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="start" className="w-full">
            <DropdownMenuGroup>
              <DropdownMenuItem>Add photos &amp; files</DropdownMenuItem>
              <DropdownMenuItem>Create image</DropdownMenuItem>
              <DropdownMenuItem>Thinking</DropdownMenuItem>
              <DropdownMenuItem>Deep research</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <InputGroupText className="ml-auto">78% used</InputGroupText>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button aria-label="Send" className="rounded-full" size="icon-sm" variant="default">
                <ArrowUpIcon />
              </Button>
            }
          />
          <TooltipContent>Send</TooltipContent>
        </Tooltip>
      </InputGroupAddon>
    </InputGroup>
  )
}

export const textareaPreviewMap: Record<string, React.ComponentType> = {
  textarea: TextareaPreview,
  "textarea-demo": TextareaPreview,
  "textarea-basic": TextareaBasicPreview,
  "textarea-with-field": TextareaWithFieldPreview,
  "textarea-popover-form": TextareaPopoverFormPreview,
  "textarea-auto-resize": TextareaAutoResizePreview,
  "textarea-with-input-group": TextareaWithInputGroup,
}
