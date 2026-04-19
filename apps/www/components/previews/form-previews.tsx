"use client"

import * as React from "react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Form } from "@/components/ui/form"

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

export const formPreviewMap: Record<string, React.ComponentType> = {
  form: FormPreview,
  "form-demo": FormPreview,
}
