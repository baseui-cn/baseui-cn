"use client"

import * as React from "react"
import { Field } from "@base-ui/react/field"
import { cn } from "@/lib/utils"

export interface InputProps extends Omit<React.ComponentPropsWithoutRef<typeof Field.Root>, 'onChange'> {
  label?: string
  helperText?: string
  error?: string
  inputClassName?: string
  type?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  id?: string
  defaultValue?: string
  value?: string
  autoComplete?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

function Input({
  className,
  label,
  helperText,
  error,
  inputClassName,
  type = "text",
  placeholder,
  disabled,
  required,
  id,
  defaultValue,
  value,
  autoComplete,
  onChange,
  ...props
}: InputProps) {
  return (
    <Field.Root
      data-slot="field"
      invalid={!!error}
      disabled={disabled}
      className={cn("flex flex-col gap-1.5 w-full", className)}
      {...props}
    >
      {label && (
        <Field.Label className="text-sm font-medium text-foreground data-disabled:opacity-50">
          {label}
          {required && <span className="ml-1 text-destructive" aria-hidden>*</span>}
        </Field.Label>
      )}
      <Field.Control
        render={
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            defaultValue={defaultValue}
            value={value}
            autoComplete={autoComplete}
            onChange={onChange}
            className={cn(
              "flex h-9 w-full rounded-lg border border-input bg-input/30 dark:bg-input/50 px-3 py-1 text-sm shadow-xs",
              "placeholder:text-muted-foreground text-foreground",
              "transition-[color,box-shadow]",
              "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:ring-3",
              inputClassName,
            )}
          />
        }
      />
      {error ? (
        <Field.Error className="text-xs text-destructive">{error}</Field.Error>
      ) : helperText ? (
        <Field.Description className="text-xs text-muted-foreground">{helperText}</Field.Description>
      ) : null}
    </Field.Root>
  )
}

export { Input }
