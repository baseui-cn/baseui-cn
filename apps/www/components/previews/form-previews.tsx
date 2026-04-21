"use client"

import * as React from "react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Form } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { ToastProvider, useToast } from "@/components/ui/toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const profileSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
})

function FormPreview() {
  const [errors, setErrors] = React.useState<Record<string, string | string[]>>({})
  const [saved, setSaved] = React.useState(false)

  return (
    <Form
      className="max-w-sm"
      errors={errors}
      onFormSubmit={async (formValues) => {
        setSaved(false)
        const result = profileSchema.safeParse(formValues)

        if (!result.success) {
          setErrors(z.flattenError(result.error).fieldErrors)
          return
        }

        setErrors({})
        setSaved(true)
      }}
    >
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <Input type="email" placeholder="you@example.com" />
        <FieldError />
      </Field>
      <Button type="submit" className="w-full">
        Save profile
      </Button>
      {saved ? <p className="text-sm text-success">Saved with Base UI Form.</p> : null}
    </Form>
  )
}

function FormBuiltWithFieldPreviewInner() {
  const [loading, setLoading] = React.useState(false)
  const toast = useToast()

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Form Built with Field</CardTitle>
      </CardHeader>
      <CardContent>
        <Form<{
          fullName: string
          email: string
          role?: string
          newsletter?: boolean
        }>
          className="w-full max-w-sm"
          onFormSubmit={async (formValues) => {
            const role = typeof formValues.role === "string" ? formValues.role : "Not provided"
            const newsletter = Boolean(formValues.newsletter)

            setLoading(true)
            await new Promise((resolve) => setTimeout(resolve, 800))
            setLoading(false)

            toast.add({
              title: "Form submitted",
              description: `Full name: ${formValues.fullName || ""}\nEmail: ${formValues.email || ""}\nRole: ${role}\nNewsletter: ${newsletter ? "Subscribed" : "Not subscribed"}`,
              type: "success",
              timeout: 4000,
            })
          }}
        >
          <Field name="fullName">
            <FieldLabel>
              Full Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input placeholder="John Doe" required type="text" />
            <FieldError match="valueMissing">Please enter your full name.</FieldError>
          </Field>

          <Field name="email">
            <FieldLabel>
              Email <span className="text-destructive">*</span>
            </FieldLabel>
            <Input placeholder="john@example.com" required type="email" />
            <FieldError match="valueMissing">Please enter your email.</FieldError>
            <FieldError match="typeMismatch">Please enter a valid email.</FieldError>
          </Field>

          <Field name="role">
            <FieldLabel>Role</FieldLabel>
            <Select
              name="role"
              items={[
                { label: "Select your role", value: null },
                { label: "Developer", value: "developer" },
                { label: "Designer", value: "designer" },
                { label: "Manager", value: "manager" },
                { label: "Other", value: "other" },
              ]}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="designer">Designer</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FieldDescription>This is optional, but helps personalize your setup.</FieldDescription>
          </Field>

          <Field name="newsletter">
            <div className="flex items-center gap-2">
              <Checkbox name="newsletter" />
              <FieldLabel className="cursor-pointer">Subscribe to newsletter</FieldLabel>
            </div>
          </Field>

          <Button loading={loading} type="submit">
            Submit
          </Button>
        </Form>
      </CardContent>
    </Card>
  )
}

function FormBuiltWithFieldPreview() {
  return (
    <ToastProvider>
      <FormBuiltWithFieldPreviewInner />
    </ToastProvider>
  )
}

export const formPreviewMap: Record<string, React.ComponentType> = {
  form: FormPreview,
  "form-demo": FormPreview,
  "form-built-with-field": FormBuiltWithFieldPreview,
}
