"use client"

import * as React from "react"
import { Field } from "@base-ui/react/field"
import { cn } from "@/lib/utils"

export interface TextareaProps extends Omit<React.ComponentPropsWithoutRef<typeof Field.Root>, 'onChange'> {
  label?: string
  helperText?: string
  error?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  rows?: number
  autoResize?: boolean
  defaultValue?: string
  value?: string
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>
  textareaClassName?: string
}

function Textarea({
  className,
  label,
  helperText,
  error,
  placeholder,
  disabled,
  required,
  rows = 3,
  autoResize = false,
  defaultValue,
  value,
  onChange,
  textareaClassName,
  ...props
}: TextareaProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = "auto"
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      }
      onChange?.(e)
    },
    [autoResize, onChange]
  )

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
          <textarea
            ref={textareaRef}
            rows={rows}
            placeholder={placeholder}
            defaultValue={defaultValue}
            value={value}
            onChange={handleChange}
            className={cn(
              "flex min-h-20 w-full rounded-lg border border-input bg-input/30 dark:bg-input/50 px-3 py-2 text-sm shadow-xs",
              "placeholder:text-muted-foreground text-foreground",
              "transition-[color,box-shadow]",
              "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:ring-3",
              autoResize ? "resize-none overflow-hidden" : "resize-y",
              textareaClassName
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

export { Textarea }
