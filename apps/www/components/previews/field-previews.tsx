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

function FieldPreview() {
  return (
    <Field className="w-full max-w-sm">
      <FieldLabel>Name</FieldLabel>
      <FieldControl placeholder="Enter your name" />
      <FieldDescription>Your full name as it appears on your ID.</FieldDescription>
    </Field>
  )
}

function FieldWithErrorPreview() {
  return (
    <form
      className="w-full max-w-sm space-y-4"
      noValidate
      onSubmit={(e) => e.preventDefault()}
    >
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldControl type="email" required placeholder="you@example.com" />
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

function FieldWithPatternPreview() {
  return (
    <form
      className="w-full max-w-sm space-y-4"
      noValidate
      onSubmit={(e) => e.preventDefault()}
    >
      <Field>
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
      <Button type="submit" size="sm">
        Submit
      </Button>
    </form>
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

function FieldCustomValidationPreview() {
  return (
    <form
      className="w-full max-w-sm space-y-4"
      noValidate
      onSubmit={(e) => e.preventDefault()}
    >
      <Field
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
      <Button type="submit" size="sm">
        Submit
      </Button>
    </form>
  )
}

function FieldTextareaPreview() {
  return (
    <Field className="w-full max-w-sm">
      <FieldLabel>Bio</FieldLabel>
      <FieldControl
        render={<textarea />}
        className="min-h-20 resize-y py-2"
        placeholder="Tell us about yourself..."
      />
      <FieldDescription>A brief description for your profile.</FieldDescription>
    </Field>
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
