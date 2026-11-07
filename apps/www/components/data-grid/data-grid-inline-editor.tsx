"use client"

import { useEffect, useId, useRef, useState } from "react"
import { isDataGridComposing } from "./data-grid-utils"
import type { KeyboardEvent as ReactKeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { formatDataGridDate, parseDataGridDate } from "./data-grid-filter-client"
import { cn } from "@/lib/utils"
import { DatePicker } from "@/components/ui/date-picker"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { DataGridInlineError } from "./data-grid-inline-layout"
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
  errorId?: string
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
  errorId: externalErrorId,
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
  const generatedErrorId = useId()
  const errorId = externalErrorId ?? generatedErrorId
  const displayError = externalError ?? error
  const editorRef = useRef<HTMLDivElement>(null)
  const isCommitting = useRef(false)
  const popupOpen = useRef(false)
  const dateEscapeClosing = useRef(false)
  const datePopupSession = useRef<{ terminal: "cancel" | "commit" | null }>({ terminal: null })
  const [dateOpen, setDateOpen] = useState(false)

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
    // The calendar button owns Enter/Space. Escape from an open popup is
    // handled by the Popover so its close/focus lifecycle runs exactly once.
    if (editorType === "date") {
      if (event.key === "Enter" || event.key === " ") return
      if (event.key === "Tab" && (popupOpen.current || datePopupSession.current.terminal)) return
      if (event.key === "Escape" && (dateEscapeClosing.current || datePopupSession.current.terminal || popupOpen.current || !editorRef.current?.contains(event.target as Node))) return
    }
    if (event.key === "Escape") {
      event.preventDefault()
      if (editorType === "date") {
        datePopupSession.current.terminal = "cancel"
        dateEscapeClosing.current = true
      }
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
    const session = editorType === "date" ? datePopupSession.current : null
    window.setTimeout(() => {
      if (disabled || popupOpen.current || (session && (session !== datePopupSession.current || session.terminal))) return
      const activeElement = document.activeElement
      if (activeElement instanceof HTMLElement && editorRef.current?.contains(activeElement)) {
        return
      }
      if (session) session.terminal = "commit"
      void commit()
    }, 0)
  }

  if (editorType === "select") {
    return (
      <div ref={editorRef} className="data-grid-inline-editor-layout">
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
            className={cn("data-grid-inline-control-layout h-full w-full rounded-none border-0 px-2 text-sm shadow-none", className)}
            onKeyDown={handleKeyDown}
          >
            <SelectValue placeholder={placeholder}>
              {options.find(option => formatDefaultValue(option.value) === draft)?.label ?? placeholder ?? draft}
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="start">
            {options.map((option) => (
              <SelectItem key={formatDefaultValue(option.value)} value={`value:${formatDefaultValue(option.value)}`} disabled={option.disabled}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DataGridInlineError error={externalErrorId && externalError ? null : displayError} id={errorId} anchor={editorRef} />
      </div>
    )
  }

  if (editorType === "date") {
    return (
      <div
        ref={editorRef}
        className="data-grid-inline-editor-layout"
        onBlurCapture={handlePopupBlur}
        onKeyDown={handleKeyDown}
      >
        <Popover open={dateOpen}
          onOpenChange={(open, details) => {
            if (open) {
              // Duplicate open notifications share ownership. Only a new
              // closed-to-open session can clear a terminal close decision.
              if (!popupOpen.current) {
                datePopupSession.current = { terminal: null }
                dateEscapeClosing.current = false
              }
            } else if (datePopupSession.current.terminal) return

            setDateOpen(open)
            popupOpen.current = open
            if (!open && details.reason === "escape-key") {
              datePopupSession.current.terminal = "cancel"
              dateEscapeClosing.current = true
              setError(null)
              onCancel?.()
            } else if (!open) handlePopupBlur()
          }}>
          <PopoverTrigger disabled={disabled} render={
            <Button type="button" variant="ghost" disabled={disabled}
              aria-label={labelledBy ? undefined : `${draft ? "Change" : "Choose"} ${label}${draft ? `: ${draft}` : ""}`}
              aria-labelledby={labelledBy} aria-invalid={Boolean(displayError)}
              aria-describedby={displayError ? errorId : undefined}
              className={cn("data-grid-inline-date-trigger-layout data-grid-inline-control-layout h-full w-full justify-start rounded-none border-0 px-2 text-sm shadow-none", className)}>
              <CalendarIcon className="size-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{draft || placeholder || "Select date"}</span>
            </Button>
          } />
          <PopoverContent align="start" sideOffset={4} initialFocus={(openType) => openType === "keyboard"}
            className="rdp-popover_content">
            <DatePicker size="sm" disabled={disabled} value={parseDataGridDate(draft)}
              onValueChange={(nextValue) => {
                if (datePopupSession.current.terminal) return
                if (nextValue) datePopupSession.current.terminal = "commit"
                const nextDraft = formatDataGridDate(nextValue)
                changeDraft(nextDraft)
                void commit(nextDraft)
                if (nextValue) {
                  setDateOpen(false)
                  popupOpen.current = false
                }
              }} />
          </PopoverContent>
        </Popover>
        <DataGridInlineError error={externalErrorId && externalError ? null : displayError} id={errorId} anchor={editorRef} />
      </div>
    )
  }

  return (
    <div ref={editorRef} className="data-grid-inline-editor-layout">
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
          "data-grid-inline-control-layout box-border h-full w-full min-w-0 border-0 bg-transparent px-2 text-sm text-foreground shadow-none",
          className
        )}
        onChange={(event) => changeDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (!popupOpen.current) void commit()
        }}
      />
      <DataGridInlineError error={externalErrorId && externalError ? null : displayError} id={errorId} anchor={editorRef} />
    </div>
  )
}
