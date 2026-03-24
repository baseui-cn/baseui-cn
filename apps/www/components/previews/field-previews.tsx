"use client"

import * as React from "react"
import {
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { ToastProvider, useToast } from "@/components/ui/toast"

function useFormSubmit(onValid: (data: FormData) => void) {
  return (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
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
        <FieldControl required placeholder="Enter your name" />
        <FieldError match="valueMissing">Please enter your name.</FieldError>
        <FieldDescription>Your full name as it appears on your ID.</FieldDescription>
      </Field>
      <Button type="submit" size="sm">Submit</Button>
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
        <FieldControl type="email" required placeholder="you@example.com" />
        <FieldError match="valueMissing">Please enter your email address.</FieldError>
        <FieldError match="typeMismatch">Please enter a valid email address.</FieldError>
        <FieldDescription>We&apos;ll never share your email.</FieldDescription>
      </Field>
      <Button type="submit" size="sm">Submit</Button>
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
        <FieldControl
          required
          pattern="^[a-z0-9_-]{3,16}$"
          placeholder="your_username"
        />
        <FieldError match="valueMissing">Username is required.</FieldError>
        <FieldError match="patternMismatch">
          3–16 characters, lowercase letters, numbers, hyphens and underscores only.
        </FieldError>
        <FieldDescription>This will be your public display name.</FieldDescription>
      </Field>
      <Button type="submit" size="sm">Submit</Button>
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
      <FieldControl placeholder="disabled@example.com" />
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
          const v = String(value)
          if (v.length > 0 && v.length < 8) return "Password must be at least 8 characters."
          return null
        }}
        validationMode="onChange"
        validationDebounceTime={300}
      >
        <FieldLabel>Password</FieldLabel>
        <FieldControl type="password" required placeholder="••••••••" />
        <FieldError match="valueMissing">Please enter a password.</FieldError>
        <FieldError match="customError" />
        <FieldDescription>Minimum 8 characters. Validated on change.</FieldDescription>
      </Field>
      <Button type="submit" size="sm">Submit</Button>
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
    const bio = data.get("bio") as string
    toast.add({
      title: "Bio updated",
      description: bio.length > 50 ? `${bio.slice(0, 50)}…` : bio,
      type: "success",
      timeout: 4000,
    })
  })

  return (
    <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit} noValidate>
      <Field name="bio">
        <FieldLabel>Bio</FieldLabel>
        <FieldControl
          render={<textarea />}
          required
          className="min-h-20 resize-y py-2"
          placeholder="Tell us about yourself..."
        />
        <FieldError match="valueMissing">Please write a short bio.</FieldError>
        <FieldDescription>A brief description for your profile.</FieldDescription>
      </Field>
      <Button type="submit" size="sm">Submit</Button>
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

export const fieldPreviewMap: Record<string, React.ComponentType> = {
  field: FieldPreview,
  "field-demo": FieldPreview,
  "field-with-error": FieldWithErrorPreview,
  "field-with-pattern": FieldWithPatternPreview,
  "field-disabled": FieldDisabledPreview,
  "field-custom-validation": FieldCustomValidationPreview,
  "field-textarea": FieldTextareaPreview,
}
