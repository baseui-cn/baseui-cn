"use client"

import { useEffect, useRef, useState } from "react"
import type { KeyboardEvent as ReactKeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { parseDataGridDate } from "./data-grid-filter-client"
import { cn } from "@/lib/utils"
import { DatePickerInput } from "@/components/ui/date-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type DataGridInlineEditorKind = "text" | "number" | "select" | "date"
export type DataGridInlineEditorNavigation = "next" | "previous"

export interface DataGridInlineEditorOption<TValue> {
  label: string
  value: TValue
}

export interface DataGridInlineEditorProps<TValue> {
  value: TValue
  editorType?: DataGridInlineEditorKind
  options?: readonly DataGridInlineEditorOption<TValue>[]
  placeholder?: string
  disabled?: boolean
  className?: string
  initialDraft?: string
  parseValue?: (raw: string) => TValue
  formatValue?: (value: TValue) => string
  validate?: (value: TValue) => string | null
  onDraftChange?: (draft: string) => void
  onCommit: (value: TValue) => boolean | void | Promise<boolean | void>
  onCancel?: () => void
  onNavigate?: (direction: DataGridInlineEditorNavigation) => void
}

function formatDefaultValue<TValue>(value: TValue) {
  return value === null || value === undefined ? "" : String(value)
}


function formatDate(value: Date | undefined) {
  if (!value) return ""
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(
    value.getDate()
  ).padStart(2, "0")}`
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Invalid value."
}

export function DataGridInlineEditor<TValue>({
  value,
  editorType = "text",
  options = [],
  placeholder,
  disabled = false,
  className,
  initialDraft,
  parseValue,
  formatValue = formatDefaultValue,
  validate,
  onDraftChange,
  onCommit,
  onCancel,
  onNavigate,
}: DataGridInlineEditorProps<TValue>) {
  const [draft, setDraft] = useState(initialDraft ?? formatValue(value))
  const [error, setError] = useState<string | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const isCommitting = useRef(false)
  const popupOpen = useRef(false)

  useEffect(() => {
    const focusable = editorRef.current?.querySelector<HTMLElement>(
      'input, button, select, [tabindex]:not([tabindex="-1"])'
    )
    focusable?.focus()
  }, [])

  const resolveValue = (raw: string): TValue => {
    if (editorType === "date" && !parseDataGridDate(raw)) throw new Error("Please enter a valid date.")
    if (parseValue) return parseValue(raw)
    if (editorType === "number") {
      const number = Number(raw)
      if (!raw.trim() || !Number.isFinite(number)) {
        throw new Error("Please enter a valid number.")
      }
      return number as TValue
    }
    if (editorType === "date" && !parseDataGridDate(raw)) throw new Error("Please enter a valid date.")
    if (editorType === "select") {
      const option = options.find((option) => String(option.value) === raw)
      if (!option) throw new Error("Choose a valid option.")
      return option.value
    }
    return raw as TValue
  }

  const commit = async (nextDraft = draft, direction?: DataGridInlineEditorNavigation) => {
    if (isCommitting.current || disabled) return
    isCommitting.current = true

    try {
      const nextValue = resolveValue(nextDraft)
      const validationError = validate?.(nextValue)
      if (validationError) {
        editorRef.current?.querySelector<HTMLElement>("input, button")?.focus()
        setError(validationError)
        return
      }

      setError(null)
      const saved = await onCommit(nextValue)
      if (saved === false) {
        editorRef.current?.querySelector<HTMLElement>("input, button")?.focus()
        return
      }
      if (direction) onNavigate?.(direction)
    } catch (commitError) {
      setError(errorMessage(commitError))
    } finally {
      isCommitting.current = false
    }
  }

  const changeDraft = (nextDraft: string) => {
    setDraft(nextDraft)
    onDraftChange?.(nextDraft)
    setError(null)
  }

  const commitOption = (raw: string) => {
    const option = options.find(({ value: optionValue }) => String(optionValue) === raw)
    if (!option) {
      setError("Choose a valid option.")
      return
    }
    changeDraft(raw)
    void commit(raw)
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.preventDefault()
      setError(null)
      onCancel?.()
    } else if (event.key === "Enter" && !popupOpen.current) {
      event.preventDefault()
      void commit(draft)
    } else if (event.key === "Tab") {
      event.preventDefault()
      void commit(draft, event.shiftKey ? "previous" : "next")
    }
  }

  const handlePopupBlur = () => {
    window.setTimeout(() => {
      if (disabled || popupOpen.current) return
      const activeElement = document.activeElement
      if (activeElement instanceof HTMLElement && editorRef.current?.contains(activeElement)) {
        return
      }
      void commit()
    }, 0)
  }

  if (editorType === "select") {
    return (
      <div ref={editorRef} className="relative flex h-full min-h-8 w-full items-center">
        <Select
          value={draft}
          disabled={disabled}
          onValueChange={(nextValue) => nextValue && commitOption(nextValue)}
          onOpenChange={(open) => {
            popupOpen.current = open
            if (!open) handlePopupBlur()
          }}
        >
          <SelectTrigger
            size="sm"
            className={cn("h-7 w-full rounded-none border-0 px-2 text-sm shadow-none", className)}
            onKeyDown={handleKeyDown}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent align="start">
            {options.map((option) => (
              <SelectItem key={String(option.value)} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <div role="alert" className="px-2 text-[10px] font-medium text-destructive">{error}</div>}
      </div>
    )
  }

  if (editorType === "date") {
    return (
      <div
        ref={editorRef}
        className="relative flex h-full min-h-8 w-full items-center"
        onBlurCapture={handlePopupBlur}
        onKeyDown={handleKeyDown}
      >
        <DatePickerInput
          label={placeholder ?? "Edit date"}
          value={parseDataGridDate(draft)}
          onValueChange={(nextValue) => {
            const nextDraft = formatDate(nextValue)
            changeDraft(nextDraft)
            void commit(nextDraft)
          }}
          onOpenChange={(open) => {
            popupOpen.current = open
            if (!open) handlePopupBlur()
          }}
          formatPreset="iso"
          size="sm"
          placeholder={placeholder ?? "Select date"}
          clearable={false}
          triggerClassName={cn(
            "h-full min-h-7 w-full rounded-none border-0 px-2 text-sm shadow-none",
            className
          )}
          className="w-full"
        />
        {error && <div role="alert" className="px-2 text-[10px] font-medium text-destructive">{error}</div>}
      </div>
    )
  }

  return (
    <div ref={editorRef} className="relative flex min-h-[28px] w-full items-center">
      <Input
        aria-label={placeholder ?? "Edit value"}
        aria-invalid={!!error}
        type={editorType === "number" ? "number" : "text"}
        value={draft}
        disabled={disabled}
        placeholder={placeholder}
        step={editorType === "number" ? "any" : undefined}
        className={cn(
          "box-border h-auto w-full min-w-0 border-0 bg-transparent px-2 text-sm text-foreground outline-none shadow-none ring-0 focus:border-0 focus:outline-none focus:ring-0",
          className
        )}
        onChange={(event) => changeDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (!popupOpen.current) void commit()
        }}
      />
      {error && (
        <div role="alert" className="absolute start-0 top-full z-10 px-2 text-[10px] font-medium text-destructive">
          {error}
        </div>
      )}
    </div>
  )
}
