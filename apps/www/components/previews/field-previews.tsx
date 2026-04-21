"use client"

import * as React from "react"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ToastProvider, useToast } from "@/components/ui/toast"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Form } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function useFormSubmit(onValid: (data: FormData) => void) {
  return (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget

    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    onValid(new FormData(form))
  }
}

function FieldPreviewInner() {
  const toast = useToast()
  const handleSubmit = useFormSubmit((data) => {
    toast.add({
      title: "Submitted",
      description: `Hello, ${data.get("name")}!`,
      type: "success",
      timeout: 4000,
    })
  })

  return (
    <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit} noValidate>
      <Field name="name">
        <FieldLabel>Name</FieldLabel>
        <Input placeholder="John Doe" required type="text" />
        <FieldError match="valueMissing">Please enter your name.</FieldError>
        <FieldDescription>Your full name as it appears on your ID.</FieldDescription>
      </Field>
      <Button type="submit" size="sm">
        Submit
      </Button>
    </form>
  )
}

function FieldPreview() {
  return (
    <ToastProvider>
      <FieldPreviewInner />
    </ToastProvider>
  )
}

function FieldWithErrorInner() {
  const toast = useToast()
  const handleSubmit = useFormSubmit((data) => {
    toast.add({
      title: "Email saved",
      description: `${data.get("email")}`,
      type: "success",
      timeout: 4000,
    })
  })

  return (
    <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit} noValidate>
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <Input type="email" required placeholder="you@example.com" />
        <FieldError match="valueMissing">Please enter your email address.</FieldError>
        <FieldError match="typeMismatch">Please enter a valid email address.</FieldError>
        <FieldDescription>We&apos;ll never share your email.</FieldDescription>
      </Field>
      <Button type="submit" size="sm">
        Submit
      </Button>
    </form>
  )
}

function FieldWithErrorPreview() {
  return (
    <ToastProvider>
      <FieldWithErrorInner />
    </ToastProvider>
  )
}

function FieldWithPatternInner() {
  const toast = useToast()
  const handleSubmit = useFormSubmit((data) => {
    toast.add({
      title: "Username registered",
      description: `@${data.get("username")} is yours!`,
      type: "success",
      timeout: 4000,
    })
  })

  return (
    <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit} noValidate>
      <Field name="username">
        <FieldLabel>Username</FieldLabel>
        <Input pattern="^[a-z0-9_-]{3,16}$" required placeholder="your_username" />
        <FieldError match="valueMissing">Username is required.</FieldError>
        <FieldError match="patternMismatch">
          3-16 characters, lowercase letters, numbers, hyphens and underscores only.
        </FieldError>
        <FieldDescription>This will be your public display name.</FieldDescription>
      </Field>
      <Button type="submit" size="sm">
        Submit
      </Button>
    </form>
  )
}

function FieldWithPatternPreview() {
  return (
    <ToastProvider>
      <FieldWithPatternInner />
    </ToastProvider>
  )
}

function FieldDisabledPreview() {
  return (
    <Field disabled className="w-full max-w-sm">
      <FieldLabel>Email</FieldLabel>
      <Input placeholder="disabled@example.com" disabled />
      <FieldDescription>This field is disabled.</FieldDescription>
    </Field>
  )
}

function FieldCustomValidationInner() {
  const toast = useToast()
  const handleSubmit = useFormSubmit(() => {
    toast.add({
      title: "Password set",
      description: "Your password has been saved securely.",
      type: "success",
      timeout: 4000,
    })
  })

  return (
    <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit} noValidate>
      <Field
        name="password"
        validate={(value) => {
          const nextValue = String(value)

          if (nextValue.length > 0 && nextValue.length < 8) {
            return "Password must be at least 8 characters."
          }

          return null
        }}
        validationMode="onChange"
        validationDebounceTime={300}
      >
        <FieldLabel>Password</FieldLabel>
        <Input type="password" required placeholder="Enter at least 8 characters" />
        <FieldError match="valueMissing">Please enter a password.</FieldError>
        <FieldError match="customError" />
        <FieldDescription>Minimum 8 characters. Validated on change.</FieldDescription>
      </Field>
      <Button type="submit" size="sm">
        Submit
      </Button>
    </form>
  )
}

function FieldCustomValidationPreview() {
  return (
    <ToastProvider>
      <FieldCustomValidationInner />
    </ToastProvider>
  )
}

function FieldTextareaInner() {
  const toast = useToast()
  const handleSubmit = useFormSubmit((data) => {
    const bio = String(data.get("bio") ?? "")

    toast.add({
      title: "Bio updated",
      description: bio.length > 50 ? `${bio.slice(0, 50)}...` : bio,
      type: "success",
      timeout: 4000,
    })
  })

  return (
    <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit} noValidate>
      <Field name="bio">
        <FieldLabel>Bio</FieldLabel>
        <Textarea placeholder="Tell us about yourself..." required />
        <FieldError match="valueMissing">Please write a short bio.</FieldError>
        <FieldDescription>A brief description for your profile.</FieldDescription>
      </Field>
      <Button type="submit" size="sm">
        Submit
      </Button>
    </form>
  )
}

function FieldTextareaPreview() {
  return (
    <ToastProvider>
      <FieldTextareaInner />
    </ToastProvider>
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

export const fieldPreviewMap: Record<string, React.ComponentType> = {
  field: FieldPreview,
  "field-demo": FieldPreview,
  "field-with-error": FieldWithErrorPreview,
  "field-with-pattern": FieldWithPatternPreview,
  "field-disabled": FieldDisabledPreview,
  "field-custom-validation": FieldCustomValidationPreview,
  "field-textarea": FieldTextareaPreview,
  "field-form-built-with-field": FormBuiltWithFieldPreview,
}
