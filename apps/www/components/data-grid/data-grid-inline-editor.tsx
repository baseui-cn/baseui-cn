"use client"

import { useEffect, useId, useRef, useState } from "react"
import { isDataGridComposing } from "./data-grid-utils"
import type { KeyboardEvent as ReactKeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { formatDataGridDate, parseDataGridDate } from "./data-grid-filter-client"
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
  disabled?: boolean
}

export interface DataGridInlineEditorProps<TValue> {
  error?: string | null
  value: TValue
  editorType?: DataGridInlineEditorKind
  options?: readonly DataGridInlineEditorOption<TValue>[]
  placeholder?: string
  label?: string
  "aria-labelledby"?: string
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


function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Invalid value."
}

export function DataGridInlineEditor<TValue>({
  value,
  editorType = "text",
  options = [],
  placeholder,
  label = "Edit value",
  "aria-labelledby": labelledBy,
  disabled = false,
  error: externalError,
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
  const draftRef = useRef(initialDraft ?? formatValue(value))
  const committedDraft = useRef<string | undefined>(undefined)
  const mounted = useRef(true)
  const [error, setError] = useState<string | null>(null)
  const errorId = useId()
  const displayError = externalError ?? error
  const editorRef = useRef<HTMLDivElement>(null)
  const isCommitting = useRef(false)
  const popupOpen = useRef(false)

  useEffect(() => {
    mounted.current = true
    const focusable = editorRef.current?.querySelector<HTMLElement>(
      'input, button, select, [tabindex]:not([tabindex="-1"])'
    )
    focusable?.focus()
    return () => { mounted.current = false }
  }, [])

  const resolveValue = (raw: string): TValue => {
    if (editorType === "date" && !parseDataGridDate(raw)) throw new Error("Please enter a valid date.")
    if (editorType === "select") {
      const option = options.find((option) => formatDefaultValue(option.value) === raw)
      if (!option || (option.disabled && !Object.is(option.value, value))) throw new Error("Choose an available option.")
      return parseValue ? parseValue(raw) : option.value
    }
    if (parseValue) return parseValue(raw)
    if (editorType === "number") {
      const number = Number(raw)
      if (!raw.trim() || !Number.isFinite(number)) {
        throw new Error("Please enter a valid number.")
      }
      return number as TValue
    }
    return raw as TValue
  }

  const commit = async (nextDraft = draftRef.current, direction?: DataGridInlineEditorNavigation) => {
    if (isCommitting.current || disabled || !mounted.current) return
    if (committedDraft.current === nextDraft) { if (direction) onNavigate?.(direction); return }
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
      committedDraft.current = nextDraft
      if (direction) onNavigate?.(direction)
    } catch (commitError) {
      setError(errorMessage(commitError))
    } finally {
      isCommitting.current = false
    }
  }

  const changeDraft = (nextDraft: string) => {
    draftRef.current = nextDraft
    setDraft(nextDraft)
    onDraftChange?.(nextDraft)
    setError(null)
  }

  const commitOption = (raw: string) => {
    const option = options.find(({ value: optionValue }) => formatDefaultValue(optionValue) === raw)
    if (!option || option.disabled) {
      setError("Choose an available option.")
      return
    }
    changeDraft(raw)
    void commit(raw)
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (isDataGridComposing(event)) return
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
          value={`value:${draft}`}
          disabled={disabled}
          onValueChange={(nextValue) => nextValue !== null && commitOption(nextValue.slice(6))}
          onOpenChange={(open) => {
            popupOpen.current = open
            if (!open) handlePopupBlur()
          }}
        >
          <SelectTrigger
            aria-label={labelledBy ? undefined : label}
            aria-labelledby={labelledBy}
            aria-invalid={!!displayError}
            aria-describedby={displayError ? errorId : undefined}
            size="sm"
            className={cn("h-7 w-full rounded-none border-0 px-2 text-sm shadow-none", className)}
            onKeyDown={handleKeyDown}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent align="start">
            {options.map((option) => (
              <SelectItem key={formatDefaultValue(option.value)} value={`value:${formatDefaultValue(option.value)}`} disabled={option.disabled}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {displayError && <div id={errorId} role="alert" className="px-2 text-[10px] font-medium text-destructive">{displayError}</div>}
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
          label={label}
          value={parseDataGridDate(draft)}
          onValueChange={(nextValue) => {
            const nextDraft = formatDataGridDate(nextValue)
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
        {displayError && <div id={errorId} role="alert" className="px-2 text-[10px] font-medium text-destructive">{displayError}</div>}
      </div>
    )
  }

  return (
    <div ref={editorRef} className="relative flex min-h-[28px] w-full items-center">
      <Input
        aria-label={labelledBy ? undefined : label}
        aria-labelledby={labelledBy}
        aria-invalid={!!displayError}
        aria-describedby={displayError ? errorId : undefined}
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
      {displayError && (
        <div id={errorId} role="alert" className="absolute start-0 top-full z-10 px-2 text-[10px] font-medium text-destructive">
          {displayError}
        </div>
      )}
    </div>
  )
}
