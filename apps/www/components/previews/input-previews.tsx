"use client"

import * as React from "react"

import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardPanel,
  CardFooter,
} from "@/components/ui/card"
import { Frame, FramePanel } from "@/components/ui/frame"
import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

function InputPreview() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="input-demo-email">Email</Label>
        <Input id="input-demo-email" placeholder="you@example.com" type="email" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="input-demo-username">Username</Label>
        <Input id="input-demo-username" placeholder="johndoe" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="input-demo-password">Password</Label>
        <Input id="input-demo-password" type="password" placeholder="••••••••" />
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
      <Input placeholder="Small" size="sm" />
      <Input placeholder="Default" size="default" />
      <Input placeholder="Large" size="lg" />
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

export function InputSystemPreview() {
  const [loading, setLoading] = React.useState(false)
  const [searches, setSearches] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)
  return (
    <Frame className="w-full max-w-2xl" data-testid="foundation-specimen">
      <FramePanel className="p-[calc(8*var(--component-unit,.0625rem))]">
        <Card variant="outline">
          <CardHeader>
            <CardTitle>Workspace settings</CardTitle>
            <CardDescription>Manage the details your team sees.</CardDescription>
          </CardHeader>
          <CardPanel>
            <div className="grid gap-[calc(16*var(--component-unit,.0625rem))] sm:grid-cols-2">
              <div className="space-y-[calc(6*var(--component-unit,.0625rem))]">
                <Label htmlFor="system-name">Workspace name</Label>
                <Input id="system-name" ref={inputRef} defaultValue="Acme Studio" size="default" />
              </div>
              <div className="space-y-[calc(6*var(--component-unit,.0625rem))]">
                <Label htmlFor="system-owner">Owner</Label>
                <Input id="system-owner" defaultValue="Morgan Chen" size="md" nativeInput />
              </div>
              <div className="space-y-[calc(6*var(--component-unit,.0625rem))]">
                <Label htmlFor="system-email">Contact email</Label>
                <Input
                  id="system-email"
                  type="email"
                  placeholder="team@example.com"
                  aria-describedby="system-email-help"
                />
                <p
                  id="system-email-help"
                  className="text-[length:calc(12*var(--component-unit,.0625rem))] text-muted-foreground"
                >
                  Used for workspace notifications.
                </p>
              </div>
              <div className="space-y-[calc(6*var(--component-unit,.0625rem))]">
                <Label htmlFor="system-slug">Public handle</Label>
                <Input
                  id="system-slug"
                  defaultValue="acme studio"
                  aria-invalid="true"
                  aria-describedby="system-slug-error"
                />
                <p
                  id="system-slug-error"
                  className="text-[length:calc(12*var(--component-unit,.0625rem))] text-destructive"
                >
                  Use letters, numbers and hyphens.
                </p>
              </div>
              <div className="space-y-[calc(6*var(--component-unit,.0625rem))]">
                <Label htmlFor="system-website">Website</Label>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>https://</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput id="system-website" placeholder="example.com" />
                </InputGroup>
              </div>
              <div className="space-y-[calc(6*var(--component-unit,.0625rem))]">
                <Label htmlFor="system-budget">Monthly budget</Label>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>$</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput id="system-budget" inputMode="decimal" placeholder="0.00" />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>USD</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </div>
              <div className="space-y-[calc(6*var(--component-unit,.0625rem))]">
                <Label htmlFor="system-id">Workspace ID</Label>
                <Input id="system-id" value="ws_01920" readOnly />
              </div>
              <div className="space-y-[calc(6*var(--component-unit,.0625rem))]">
                <Label htmlFor="system-limit">Managed seat limit</Label>
                <Input id="system-limit" defaultValue="25 seats" disabled />
              </div>
              <div className="space-y-[calc(6*var(--component-unit,.0625rem))] sm:col-span-2">
                <Label htmlFor="system-description">Description</Label>
                <Textarea id="system-description" placeholder="What is your team working on?" />
              </div>
              <div className="space-y-[calc(6*var(--component-unit,.0625rem))] sm:col-span-2">
                <Label htmlFor="system-search">Find a teammate</Label>
                <InputGroup>
                  <InputGroupAddon>
                    <SearchIcon aria-hidden="true" />
                  </InputGroupAddon>
                  <InputGroupInput id="system-search" placeholder="Name or email" />
                  <InputGroupAddon align="inline-end">
                    <Button size="xs" variant="secondary" onClick={() => setSearches(searches + 1)}>
                      Find
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
                <p
                  role="status"
                  className="text-[length:calc(12*var(--component-unit,.0625rem))] text-muted-foreground"
                >
                  {searches ? `Search requested ${searches} time(s).` : "Search workspace members."}
                </p>
              </div>
            </div>
          </CardPanel>
          <CardFooter className="flex-wrap gap-[calc(8*var(--component-unit,.0625rem))]">
            <Button
              loading={loading}
              onClick={() => {
                setLoading(true)
                setTimeout(() => setLoading(false), 1200)
              }}
            >
              Save changes
            </Button>
            <Button variant="outline" onClick={() => inputRef.current?.focus()}>
              Edit name
            </Button>
            <Button variant="ghost" disabled>
              Archive workspace
            </Button>
          </CardFooter>
        </Card>
      </FramePanel>
    </Frame>
  )
}

export const inputPreviewMap: Record<string, React.ComponentType> = {
  input: InputPreview,
  "input-system": InputSystemPreview,
  "input-demo": InputPreview,
  "input-basic": InputBasicPreview,
  "input-with-field": InputWithFieldPreview,
  "input-sizes": InputSizesPreview,
  "input-disabled": InputDisabledPreview,
}
