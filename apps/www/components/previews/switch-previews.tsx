"use client"

import * as React from "react"
import { useId } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Form } from "@/components/ui/form"
import { ToastProvider, useToast } from "@/components/ui/toast"

function SwitchPreview() {
  return (
    <Label>
      <Switch />
      Enable notifications
    </Label>
  )
}

function SwitchBasicPreview() {
  return <Switch />
}

function SwitchWithLabelAndDescriptionPreview() {
  const id = useId()
  return (
    <Label
      className="flex items-center gap-6 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50"
      htmlFor={id}
    >
      <div className="flex flex-col gap-1">
        <p>Enable notifications</p>
        <p className="text-muted-foreground text-xs">
          You can enable or disable notifications at any time.
        </p>
      </div>
      <Switch defaultChecked id={id} />
    </Label>
  )
}

function SwitchWithFormPreview() {
  const [loading, setLoading] = React.useState(false)
  const toast = useToast()
  const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    console.log(formData.get("pushNotifications"))
    const enabled = formData.get("pushNotifications")
    toast.add({
      title: "Submitted",
      description: `Push notifications: ${enabled}`,
      type: "success",
      timeout: 4000,
    })
  }

  return (
    <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <Field name="pushNotifications">
        <FieldLabel>
          <Switch defaultChecked name="pushNotifications" />
          Enable push notifications
        </FieldLabel>
      </Field>
      <Button loading={loading} type="submit">
        Submit
      </Button>
    </Form>
  )
}

function SwitchDisabledPreview() {
  return (
    <div className="flex flex-col gap-3">
      <Label>
        <Switch disabled />
        Disabled Switch
      </Label>
      <Label>
        <Switch disabled checked />
        Disabled Switch (Checked)
      </Label>
      <SwitchWithFormPreview />
    </div>
  )
}

export const switchPreviewMap: Record<string, React.ComponentType> = {
  switch: SwitchPreview,
  "switch-demo": SwitchPreview,
  "switch-basic": SwitchBasicPreview,
  "switch-with-label-and-description": SwitchWithLabelAndDescriptionPreview,
  "switch-with-form": SwitchWithFormPreview,
  "switch-disabled": SwitchDisabledPreview,
}
