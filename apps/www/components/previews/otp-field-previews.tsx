"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Form } from "@/components/ui/form"
import { OTPField, OTPFieldInput, OTPFieldSeparator } from "@/components/ui/otp-field"
import { ToastProvider, useToast } from "@/components/ui/toast"

function OTPFieldPreview() {
  const [value, setValue] = React.useState("")

  return (
    <Field className="max-w-sm">
      <FieldLabel>Verification code</FieldLabel>
      <FieldDescription>Enter the 6-digit code we sent to your device.</FieldDescription>
      <OTPField length={6} value={value} onValueChange={setValue}>
        {Array.from({ length: 6 }, (_, index) => (
          <OTPFieldInput
            key={index}
            aria-label={index === 0 ? undefined : `Character ${index + 1} of 6`}
          />
        ))}
      </OTPField>
      <p className="text-sm text-muted-foreground">
        Current value: <span className="font-mono text-foreground">{value || "------"}</span>
      </p>
    </Field>
  )
}

function OTPFieldFormPreview() {
  const [errors, setErrors] = React.useState<Record<string, string | string[]>>({})
  const [submittedCode, setSubmittedCode] = React.useState("")

  return (
    <Form<{ verificationCode: string }>
      className="max-w-sm"
      errors={errors}
      onFormSubmit={async (formValues) => {
        const code = String(formValues.verificationCode ?? "")

        if (code.length !== 6) {
          setSubmittedCode("")
          setErrors({ verificationCode: "Enter the full 6-digit code before continuing." })
          return
        }

        setErrors({})
        setSubmittedCode(code)
      }}
    >
      <Field name="verificationCode">
        <FieldLabel>Two-factor code</FieldLabel>
        <FieldDescription>
          This works inside the Base UI Form wrapper and submits as a single value.
        </FieldDescription>
        <div className="flex justify-center">
          <OTPField length={6} name="verificationCode" className="mx-auto w-fit">
            {Array.from({ length: 6 }, (_, index) => (
              <OTPFieldInput
                key={index}
                aria-label={index === 0 ? undefined : `Character ${index + 1} of 6`}
              />
            ))}
          </OTPField>
        </div>
        <FieldError />
      </Field>
      <Button type="submit" className="w-full">
        Verify code
      </Button>
      {submittedCode ? (
        <p className="text-sm text-success">
          Submitted code: <span className="font-mono">{submittedCode}</span>
        </p>
      ) : null}
    </Form>
  )
}

function OTPFieldAlphanumericPreview() {
  const [value, setValue] = React.useState("")

  return (
    <Field className="max-w-sm">
      <FieldLabel>Recovery code</FieldLabel>
      <FieldDescription>Use letters and numbers for backup codes such as A7C9XZ.</FieldDescription>
      <OTPField length={6} validationType="alphanumeric" value={value} onValueChange={setValue}>
        {Array.from({ length: 6 }, (_, index) => (
          <OTPFieldInput
            key={index}
            aria-label={index === 0 ? undefined : `Character ${index + 1} of 6`}
          />
        ))}
      </OTPField>
      <p className="text-sm text-muted-foreground">
        Sanitized value: <span className="font-mono text-foreground">{value || "------"}</span>
      </p>
    </Field>
  )
}

function OTPFieldGroupedPreview() {
  return (
    <Field className="max-w-sm">
      <FieldLabel>Verification code</FieldLabel>
      <FieldDescription>
        Group the slots visually when you want a 3-3 layout such as 123-456.
      </FieldDescription>
      <OTPField length={6}>
        <div className="flex gap-2">
          {Array.from({ length: 3 }, (_, index) => (
            <OTPFieldInput
              key={index}
              aria-label={index === 0 ? undefined : `Character ${index + 1} of 6`}
            />
          ))}
        </div>
        <OTPFieldSeparator aria-hidden="true">-</OTPFieldSeparator>
        <div className="flex gap-2">
          {Array.from({ length: 3 }, (_, index) => (
            <OTPFieldInput key={index + 3} aria-label={`Character ${index + 4} of 6`} />
          ))}
        </div>
      </OTPField>
    </Field>
  )
}

function OTPFieldConnectedPreview() {
  return (
    <Field className="max-w-sm">
      <FieldLabel>Connected slots</FieldLabel>
      <FieldDescription>
        Some verification flows use a single connected control with shared borders.
      </FieldDescription>
      <OTPField length={6} className="gap-0">
        {Array.from({ length: 6 }, (_, index) => (
          <OTPFieldInput
            key={index}
            className="rounded-none border-r-0 first:rounded-s-xl last:rounded-e-xl last:border-r"
            aria-label={index === 0 ? undefined : `Character ${index + 1} of 6`}
          />
        ))}
      </OTPField>
    </Field>
  )
}

function OTPFieldAutoSubmitPreview() {
  function AutoSubmitDemo() {
    const toast = useToast()
    const [loading, setLoading] = React.useState(false)
    const [errors, setErrors] = React.useState<Record<string, string | string[]>>({})
    const [lastVerifiedCode, setLastVerifiedCode] = React.useState("")

    return (
      <Form<{ verificationCode: string }>
        className="max-w-sm"
        errors={errors}
        onFormSubmit={async (formValues) => {
          const code = String(formValues.verificationCode ?? "")
          setErrors({})
          setLoading(true)

          await new Promise((resolve) => setTimeout(resolve, 5000))

          setLoading(false)
          setLastVerifiedCode(code)
          toast.add({
            title: "Code verified",
            description: `Verification completed for ${code}.`,
            type: "success",
            timeout: 3000,
          })
        }}
      >
        <Field name="verificationCode">
          <FieldLabel>Auto-submit verification </FieldLabel>
          <FieldDescription>
            When all 6 slots are filled, the form submits automatically and shows success feedback.
          </FieldDescription>
          <div className="flex justify-center mx-auto w-fit">
            <OTPField length={6} name="verificationCode" autoSubmit className="w-fit">
              {Array.from({ length: 6 }, (_, index) => (
                <OTPFieldInput
                  key={index}
                  aria-label={index === 0 ? undefined : `Character ${index + 1} of 6`}
                />
              ))}
            </OTPField>
          </div>
          <FieldError />
        </Field>
        <Button type="submit" className="w-full" loading={loading}>
          {loading ? "Verifying..." : "Auto submit enabled"}
        </Button>
        {lastVerifiedCode ? (
          <p className="text-sm text-success">
            Last verified: <span className="font-mono">{lastVerifiedCode}</span>
          </p>
        ) : null}
      </Form>
    )
  }

  return (
    <ToastProvider>
      <AutoSubmitDemo />
    </ToastProvider>
  )
}

export const otpFieldPreviewMap: Record<string, React.ComponentType> = {
  "otp-field": OTPFieldPreview,
  "otp-field-demo": OTPFieldPreview,
  "otp-field-form": OTPFieldFormPreview,
  "otp-field-alphanumeric": OTPFieldAlphanumericPreview,
  "otp-field-grouped": OTPFieldGroupedPreview,
  "otp-field-connected": OTPFieldConnectedPreview,
  "otp-field-auto-submit": OTPFieldAutoSubmitPreview,
}
