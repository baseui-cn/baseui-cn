"use client"

import {
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  type DataGridColumnEditor,
  type DataGridColumnEditorRenderProps,
  getDataGridColumnEditor,
  useDataGridNavigation,
} from "@/components/data-grid/data-grid"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field"
import { Rating } from "@/components/ui/rating"
import type { RowData } from "@tanstack/react-table"
import type { DataGridCell, DataGridTable } from "@/components/data-grid/table-features"

import { cn } from "@/lib/utils"
import { DataGridInlineEditor } from "./data-grid-inline-editor"
import { DataGridInlineError, useDataGridInlineLayout } from "./data-grid-inline-layout"
import { findAdjacentDataGridEditor, isDataGridComposing } from "./data-grid-utils"
import { formatDataGridDate, parseDataGridDate } from "./data-grid-filter-client"
import { DatePickerInput } from "@/components/ui/date-picker"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

type EditableRow = RowData

interface DataGridEditableCellProps<TData extends EditableRow, TValue = unknown> {
  cell: DataGridCell<TData, TValue>
  className?: string
  emptyLabel?: string
}

interface DataGridEditDialogProps<TData extends EditableRow> {
  table: DataGridTable<TData>
  title?: string
  description?: string
  submitLabel?: string
}

function normalizeOptionValue(value: unknown) {
  return value === null || value === undefined ? "" : String(value)
}

function getOptionValue<TData extends EditableRow>(
  editor: DataGridColumnEditor<TData, unknown>,
  value: string
) {
  const matchedOption = editor.options?.find(
    (option) => normalizeOptionValue(option.value) === value
  )

  return matchedOption ? matchedOption.value : value
}

function getOptionLabel<TData extends EditableRow>(
  editor: DataGridColumnEditor<TData, unknown>,
  value: unknown
) {
  return editor.options?.find(
    (option) => normalizeOptionValue(option.value) === normalizeOptionValue(value)
  )?.label
}

function getDisplayValue(value: unknown, emptyLabel = "Click to edit") {
  if (typeof value === "string") {
    return value.trim().length > 0 ? value : emptyLabel
  }

  if (typeof value === "number") {
    return new Intl.NumberFormat("en-US").format(value)
  }

  if (typeof value === "boolean") {
    return value ? "Enabled" : "Disabled"
  }

  if (value === null || value === undefined) {
    return emptyLabel
  }

  return String(value)
}

function getEditorDisplayValue<TData extends EditableRow>(
  editor: DataGridColumnEditor<TData, unknown>,
  value: unknown,
  emptyLabel = "Click to edit"
) {
  return getOptionLabel(editor, value) ?? getDisplayValue(value, emptyLabel)
}

function getDefaultInlineEditorProps<TData extends EditableRow>(
  table: DataGridTable<TData>,
  row: TData,
  rowId: string,
  columnId: string,
  editor: DataGridColumnEditor<TData, unknown>,
  value: unknown,
  setValue: (value: unknown) => void,
  commit: (value?: unknown) => Promise<boolean>,
  cancel: () => void,
  navigate: ((direction: "next" | "previous") => void) | undefined,
  isEditing: boolean,
  isPending: boolean,
  error?: string | null
): DataGridColumnEditorRenderProps<TData, unknown> {
  return {
    table,
    row,
    rowId,
    columnId,
    value,
    setValue,
    commit,
    cancel,
    navigate,
    isEditing,
    isPending,
    error,
    editor,
  }
}

function renderSelectField<TData extends EditableRow>({
  editor,
  value,
  setValue,
  isPending,
  isInline = false,
  open,
  onOpenChange,
  triggerAutoFocus,
  onTriggerKeyDown,
  label,
  error,
  errorId,
}: {
  editor: DataGridColumnEditor<TData, unknown>
  value: unknown
  setValue: (value: unknown) => void
  isPending: boolean
  isInline?: boolean
  label?: string
  error?: string | null
  errorId?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  triggerAutoFocus?: boolean
  onTriggerKeyDown?: (event: ReactKeyboardEvent<HTMLButtonElement>) => void
}) {
  const normalizedValue = normalizeOptionValue(value)

  return (
    <Select
      value={`value:${normalizedValue}`}
      onValueChange={(nextValue) => { if (nextValue !== null) setValue(getOptionValue(editor, nextValue.slice(6))) }}
      disabled={isPending}
      open={open}
      onOpenChange={onOpenChange}
    >
      <SelectTrigger
        aria-label={isInline ? label ?? editor.label ?? "Edit selection" : undefined}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "w-full px-4",
          isInline && "data-grid-inline-control-layout rounded-none border-0 bg-transparent shadow-none"
        )}
        autoFocus={triggerAutoFocus}
        onKeyDown={onTriggerKeyDown}
      >
        <SelectValue placeholder={editor.placeholder ?? "Select an option"}>
          {getEditorDisplayValue(editor, value, editor.placeholder ?? "Select an option")}
        </SelectValue>
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        {(editor.options ?? []).map((option) => {
          const optionValue = normalizeOptionValue(option.value)
          return (
            <SelectItem key={`${optionValue || "empty"}-${option.label}`} value={`value:${optionValue}`} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
function DataGridInlineSelectEditor<TData extends EditableRow>(
  props: DataGridColumnEditorRenderProps<TData, unknown> & { errorId: string }
) {
  const {
    table,
    row,
    columnId,
    editor,
    value,
    setValue,
    commit,
    cancel,
    navigate,
    isEditing,
    isPending,
    errorId,
  } = props
  const [open, setOpen] = useState(false)
  const ignoreCloseCancelRef = useRef(false)

  useEffect(() => {
    if (isEditing && !isPending) {
      setOpen(true)
      ignoreCloseCancelRef.current = false
      return
    }

    setOpen(false)
  }, [isEditing, isPending])

  useEffect(() => {
    if (isEditing && !open && !isPending) {
      ignoreCloseCancelRef.current = false
    }
  }, [isEditing, open, isPending])

  if (!isEditing) {
    return (
      <button
        type="button"
        className={cn(
          "data-grid-edit-trigger-layout text-foreground flex min-h-9 w-full items-center rounded-md px-2 py-1 text-left transition-colors",
          !value && "text-muted-foreground"
        )}
        onClick={() => table.options.meta?.editing?.startCellEdit(row, columnId)}
        disabled={isPending}
      >
        {getEditorDisplayValue(editor, value, editor.placeholder ?? "Select an option")}
      </button>
    )
  }

  // eslint-disable-next-line react-hooks/refs
  return renderSelectField({
    editor,
    label: editor.label ?? columnId,
    error: props.error,
    errorId,
    value,
    setValue: (nextValue) => {
      ignoreCloseCancelRef.current = true
      setValue(nextValue)
      void commit(nextValue)
    },
    isPending,
    isInline: true,
    open,
    onOpenChange: (nextOpen) => {
      setOpen(nextOpen)

      if (!nextOpen && !isPending) {
        if (ignoreCloseCancelRef.current) {
          ignoreCloseCancelRef.current = false
          return
        }

        cancel()
      }
    },
    triggerAutoFocus: true,
    onTriggerKeyDown: (event) => {
      if (isDataGridComposing(event)) return
      if (event.key === "Escape") {
        event.preventDefault()
        cancel()
      } else if (event.key === "Tab") {
        event.preventDefault()
        void commit(value).then((saved) => {
          if (saved) navigate?.(event.shiftKey ? "previous" : "next")
        })
      }
    },
  })
}

function DataGridInlineCellEditor<TData extends EditableRow>({
  table,
  row,
  rowId,
  columnId,
  editor,
  value,
  setValue,
  commit,
  cancel,
  navigate,
  isEditing,
  isPending,
  error,
  errorId,
  restoreDisplayFocus,
}: DataGridColumnEditorRenderProps<TData, unknown> & { errorId: string; restoreDisplayFocus: () => void }) {
  if (editor.renderInline) {
    return editor.renderInline(
      getDefaultInlineEditorProps(
        table,
        row,
        rowId,
        columnId,
        editor,
        value,
        setValue,
        commit,
        cancel,
        navigate,
        isEditing,
        isPending,
        error
      )
    )
  }

  const handleTextKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (isDataGridComposing(event)) return
    if (event.key === "Enter") {
      event.preventDefault()
      void commit()
    }

    if (event.key === "Tab") {
      event.preventDefault()
      void commit().then((saved) => {
        if (saved) navigate?.(event.shiftKey ? "previous" : "next")
      })
    }

    if (event.key === "Escape") {
      event.preventDefault()
      cancel()
    }
  }

  if (editor.kind === "text" || editor.kind === "email") {
    if (!isEditing) {
      return (
        <button
          type="button"
          className={cn(
            "data-grid-edit-trigger-layout text-foreground flex w-full items-center rounded-md px-2 py-1 text-left transition-colors",
            !value && "text-muted-foreground"
          )}
          onClick={() => table.options.meta?.editing?.startCellEdit(row, columnId)}
          disabled={isPending}
        >
          {getDisplayValue(value)}
        </button>
      )
    }

    return (
      <Input
        aria-label={editor.label ?? columnId}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        autoFocus
        type={editor.kind}
        value={typeof value === "string" ? value : value == null ? "" : String(value)}
        onChange={(event) => setValue(event.target.value)}
        onBlur={() => void commit()}
        onKeyDown={handleTextKeyDown}
        placeholder={editor.placeholder ?? "Enter a value"}
        disabled={isPending}
        className="data-grid-inline-control-layout rounded-none"
      />
    )
  }

  if (editor.kind === "date") {
    if (!isEditing) return (
      <button type="button" disabled={isPending}
        className={cn("data-grid-edit-trigger-layout data-grid-date-edit-trigger-layout text-foreground flex w-full items-center rounded-md px-2 py-1 text-left transition-colors", !value && "text-muted-foreground")}
        onClick={(event) => {
          const root = event.currentTarget.closest<HTMLElement>('[data-slot="data-grid-editable-cell"]')
          const detail = event.detail
          const currentEditing = table.options.meta?.editing
          currentEditing?.startCellEdit(row, columnId)
          const ownsActivation = currentEditing?.captureCellNavigation?.()
          // Forward this activation only after the editor exists, within this
          // cell and edit session. Tab navigation never takes this click path.
          requestAnimationFrame(() => {
            if (!root?.isConnected || (ownsActivation && !ownsActivation())) return
            const focused = root.ownerDocument.activeElement
            if (focused && focused !== root.ownerDocument.body && !root.contains(focused)) return
            const current = table.options.meta?.editing
            if (!current?.isCellEditing(rowId, columnId) || current.isCellPending(rowId, columnId)) return
            root.querySelector<HTMLButtonElement>(".data-grid-inline-date-trigger-layout")
              ?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, detail }))
          })
        }}>
        {getDisplayValue(value)}
      </button>
    )
    return <DataGridInlineEditor value={value} editorType="date" disabled={isPending}
      label={editor.label ?? columnId} error={error} errorId={errorId} onDraftChange={setValue} onCommit={commit}
      onCancel={() => { cancel(); restoreDisplayFocus() }} onNavigate={navigate} />
  }

  if (editor.kind === "number") {
    if (!isEditing) {
      return (
        <button
          type="button"
          className={cn(
            "data-grid-edit-trigger-layout text-foreground flex w-full items-center rounded-md px-2 py-1 text-left transition-colors",
            value == null && "text-muted-foreground"
          )}
          onClick={() => table.options.meta?.editing?.startCellEdit(row, columnId)}
          disabled={isPending}
        >
          {getDisplayValue(value)}
        </button>
      )
    }

    return (
      <NumberField
        disabled={isPending}
        value={typeof value === "number" ? value : undefined}
        onValueChange={(nextValue) => setValue(nextValue)}
        min={editor.min}
        max={editor.max}
        step={editor.step}
        className="rounded-none"
      >
        <NumberFieldGroup
          className="data-grid-inline-control-layout rounded-none border-0 bg-transparent shadow-none"
          aria-invalid={Boolean(error)}
        >
          <NumberFieldDecrement />
          <NumberFieldInput
            aria-label={editor.label ?? columnId}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            autoFocus
            onBlur={() => void commit()}
            onKeyDown={(event) => {
              if (isDataGridComposing(event)) return
              if (event.key === "Tab") {
                event.preventDefault()
                void commit().then((saved) => {
                  if (saved) navigate?.(event.shiftKey ? "previous" : "next")
                })
              }

              if (event.key === "Enter") {
                event.preventDefault()
                void commit()
              }

              if (event.key === "Escape") {
                event.preventDefault()
                cancel()
              }
            }}
          />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
    )
  }

  if (editor.kind === "select") {
    return (
      <DataGridInlineSelectEditor
        table={table}
        row={row}
        rowId={rowId}
        columnId={columnId}
        editor={editor}
        value={value}
        setValue={setValue}
        commit={commit}
        cancel={cancel}
        navigate={navigate}
        isEditing={isEditing}
        isPending={isPending}
        error={error}
        errorId={errorId}
      />
    )
  }

  if (editor.kind === "radio") {
    return (
      <RadioGroup
        aria-label={editor.label ?? columnId}
        aria-describedby={error ? errorId : undefined}
        value={normalizeOptionValue(value)}
        onValueChange={(nextValue) => {
          const parsedValue = getOptionValue(editor, nextValue)
          setValue(parsedValue)
          void commit(parsedValue)
        }}
        className="flex flex-wrap gap-3"
      >
        {(editor.options ?? []).map((option) => {
          const optionValue = normalizeOptionValue(option.value) || option.label
          const optionId = `${rowId}-${columnId}-${optionValue}`

          return (
            <div key={optionId} className="flex items-center gap-2">
              <RadioGroupItem
                value={optionValue}
                id={optionId}
                disabled={isPending || option.disabled}
              />
              <Label htmlFor={optionId} className="text-xs">
                {option.label}
              </Label>
            </div>
          )
        })}
      </RadioGroup>
    )
  }

  if (editor.kind === "checkbox") {
    return (
      <div className="flex min-h-9 items-center justify-center">
        <Checkbox
          aria-label={editor.label ?? columnId}
          aria-describedby={error ? errorId : undefined}
          checked={value === true}
          onCheckedChange={(nextChecked) => void commit(nextChecked === true)}
          disabled={isPending}
        />
      </div>
    )
  }

  if (editor.kind === "switch") {
    return (
      <div className="flex min-h-9 items-center">
        <Switch
          aria-label={editor.label ?? columnId}
          aria-describedby={error ? errorId : undefined}
          checked={value === true}
          onCheckedChange={(nextChecked) => void commit(nextChecked === true)}
          disabled={isPending}
        />
      </div>
    )
  }

  if (editor.kind === "rating") {
    return (
      <div className="flex min-h-9 items-center">
        <Rating
          rating={typeof value === "number" ? value : 0}
          aria-label={editor.label ?? columnId}
          editable={!isPending}
          onRatingChange={(nextRating) => void commit(nextRating)}
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      className={cn(
        "data-grid-edit-trigger-layout text-foreground flex w-full items-center rounded-md px-2 py-1 text-left transition-colors",
        !value && "text-muted-foreground"
      )}
      onClick={() => table.options.meta?.editing?.startCellEdit(row, columnId)}
      disabled={isPending}
    >
      {getDisplayValue(value)}
    </button>
  )
}

function renderDialogField<TData extends EditableRow>({
  table,
  row,
  rowId,
  columnId,
  editor,
  value,
  setValue,
  commit,
  cancel,
  isEditing,
  isPending,
  error,
}: DataGridColumnEditorRenderProps<TData, unknown>) {
  if (editor.renderDialog) {
    return editor.renderDialog({
      table,
      row,
      rowId,
      columnId,
      value,
      setValue,
      commit,
      cancel,
      isEditing,
      isPending,
      error,
      editor,
    })
  }

  if (editor.kind === "text" || editor.kind === "email") {
    return (
      <Input
        type={editor.kind}
        value={typeof value === "string" ? value : value == null ? "" : String(value)}
        onChange={(event) => setValue(event.target.value)}
        placeholder={editor.placeholder ?? "Enter a value"}
        disabled={isPending}
      />
    )
  }

  if (editor.kind === "date") {
    return <DatePickerInput label={editor.label ?? columnId}
      value={parseDataGridDate(typeof value === "string" ? value : "")}
      onValueChange={(date) => setValue(formatDataGridDate(date))}
      formatPreset="iso" disabled={isPending} />
  }

  if (editor.kind === "textarea") {
    return (
      <Textarea
        value={typeof value === "string" ? value : value == null ? "" : String(value)}
        onChange={(event) => setValue(event.target.value)}
        placeholder={editor.placeholder ?? "Add details"}
        disabled={isPending}
        className="min-h-24"
      />
    )
  }

  if (editor.kind === "number") {
    return (
      <NumberField
        disabled={isPending}
        value={typeof value === "number" ? value : undefined}
        onValueChange={(nextValue) => setValue(nextValue)}
        min={editor.min}
        max={editor.max}
        step={editor.step}
      >
        <NumberFieldGroup aria-invalid={Boolean(error)}>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
    )
  }

  if (editor.kind === "select") {
    return renderSelectField({ editor, value, setValue, isPending, isInline: false })
  }

  if (editor.kind === "radio") {
    return (
      <RadioGroup
        value={normalizeOptionValue(value)}
        onValueChange={(nextValue) => setValue(getOptionValue(editor, nextValue))}
        className="grid gap-2"
      >
        {(editor.options ?? []).map((option) => {
          const optionValue = normalizeOptionValue(option.value) || option.label
          const optionId = `dialog-${rowId}-${columnId}-${optionValue}`

          return (
            <Label
              key={optionId}
              htmlFor={optionId}
              className={cn(
                "border-input hover:bg-muted flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                normalizeOptionValue(value) === optionValue && "bg-muted border-primary"
              )}
            >
              <RadioGroupItem
                id={optionId}
                disabled={isPending || option.disabled}
                value={optionValue}
                className="mt-0.5"
              />
              <div className="grid gap-0.5">
                <span className="font-medium">{option.label}</span>
                {option.description ? (
                  <span className="text-muted-foreground text-sm">{option.description}</span>
                ) : null}
              </div>
            </Label>
          )
        })}
      </RadioGroup>
    )
  }

  if (editor.kind === "checkbox") {
    const controlId = `dialog-${rowId}-${columnId}`

    return (
      <Label
        htmlFor={controlId}
        className="flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50"
      >
        <Checkbox
          id={controlId}
          onCheckedChange={(nextChecked) => setValue(nextChecked === true)}
          checked={value === true}
          disabled={isPending}
        />
        <div className="flex flex-col gap-1">
          <p>{editor.label ?? "Enable notifications"}</p>
          {editor.description ? (
            <p className="text-muted-foreground text-xs">{editor.description}</p>
          ) : null}
        </div>
      </Label>
    )
  }

  if (editor.kind === "switch") {
    const controlId = `dialog-${rowId}-${columnId}`

    return (
      <Label
        htmlFor={controlId}
        className="flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50"
      >
        <Switch
          id={controlId}
          onCheckedChange={(nextChecked) => setValue(nextChecked === true)}
          checked={value === true}
          disabled={isPending}
        />
        <div className="flex flex-col gap-1">
          <p>{editor.label ?? "Enable notifications"}</p>
          {editor.description ? (
            <p className="text-muted-foreground text-xs">{editor.description}</p>
          ) : null}
        </div>
      </Label>
    )
  }

  if (editor.kind === "rating") {
    return (
      <div className="flex items-center gap-3">
        <Rating
          rating={typeof value === "number" ? value : 0}
          editable
          showValue
          onRatingChange={(nextRating) => setValue(nextRating)}
        />
      </div>
    )
  }

  return (
    <Input
      value={typeof value === "string" ? value : value == null ? "" : String(value)}
      onChange={(event) => setValue(event.target.value)}
      placeholder={editor.placeholder ?? "Enter a value"}
      disabled={isPending}
    />
  )
}

function renderStaticCellValue<TData extends EditableRow, TValue>(
  cell: DataGridCell<TData, TValue>,
  emptyLabel: string
) {
  const renderedValue = cell.getValue()

  if (typeof renderedValue === "string") {
    return renderedValue.trim().length > 0 ? renderedValue : emptyLabel
  }

  if (renderedValue === null || renderedValue === undefined) {
    return emptyLabel
  }

  return String(renderedValue)
}

export function DataGridEditableCell<TData extends EditableRow, TValue = unknown>({
  cell,
  className,
  emptyLabel = "Click to edit",
}: DataGridEditableCellProps<TData, TValue>) {
  const editorRef = useRef<HTMLDivElement>(null)
  const ownerTableRef = useRef<HTMLTableElement | null>(null)
  const navigationGuard = useRef<(() => boolean) | undefined>(undefined)
  const committing = useRef(false)
  const { scrollToRowRef, rowsPinnable } = useDataGridNavigation()
  const table = cell.getContext().table
  const editing = table.options.meta?.editing
  const editor = getDataGridColumnEditor(cell.column) as
    DataGridColumnEditor<TData, unknown> | undefined

  const active = editing?.isCellEditing(cell.row.id, cell.column.id) ?? false
  const pending = editing?.isCellPending(cell.row.id, cell.column.id) ?? false
  const error = editing?.getCellError(cell.row.id, cell.column.id)
  const errorId = useId()
  const layoutActive = active || pending || Boolean(error)
  useDataGridInlineLayout(editorRef, layoutActive, Boolean(editing && editor && !editor.dialogOnly))
  useEffect(() => {
    if (editorRef.current) ownerTableRef.current = editorRef.current.closest("table")
    if (active && !pending) {
      const root = editorRef.current
      const control = root?.querySelector<HTMLElement>('input:not([type="hidden"]), textarea')
        ?? root?.querySelector<HTMLElement>('button:not(:disabled), [role="radio"][tabindex="0"]')
      control?.focus()
    }
  }, [active, pending])

  if (!editing || !editor || editor.dialogOnly) {
    return <div className={className}>{renderStaticCellValue(cell, emptyLabel)}</div>
  }

  const row = cell.row.original
  const rowId = cell.row.id
  const columnId = cell.column.id
  const isEditing = editing.isCellEditing(rowId, columnId)
  const isPending = editing.isCellPending(rowId, columnId)
  const value = editing.getCellDraftValue(row, columnId)
  const commit = async (nextValue?: unknown) => {
    if (committing.current) return false
    committing.current = true
    navigationGuard.current = editing.captureCellNavigation?.()
    try { return await editing.commitCellEdit(row, columnId, nextValue) }
    finally { committing.current = false }
  }
  const navigate = (direction: "next" | "previous") => {
    if (navigationGuard.current && !navigationGuard.current()) return
    const currentEditing = table.options.meta?.editing
    if (!currentEditing) return
    const nextCell = findAdjacentDataGridEditor({
      table, rowId, columnId, direction, rowsPinnable, isPending: currentEditing.isCellPending,
    })

    if (nextCell) {
      scrollToRowRef?.current?.(nextCell.row.id)
      currentEditing.startCellEdit(nextCell.row.original, nextCell.column.id)
    } else {
      // Keep the start/end boundary reachable after its editor unmounts on commit.
      let frames = 0
      const focusTrigger = () => {
        if (navigationGuard.current && !navigationGuard.current()) return
        // Column renderers can remount during a save. Retain the owning table,
        // then locate this cell's replacement without crossing into another Grid.
        const owner = ownerTableRef.current
        if (!owner?.isConnected) return
        const trigger = owner.querySelector<HTMLElement>(
          `[data-row-id="${CSS.escape(rowId)}"][data-column-id="${CSS.escape(columnId)}"] button:not(:disabled)`
        )
        if (trigger) trigger.focus()
        else if (++frames < 10) requestAnimationFrame(focusTrigger)
      }
      requestAnimationFrame(focusTrigger)
    }
  }

  const restoreDisplayFocus = () => {
    const ownsClose = table.options.meta?.editing?.captureCellNavigation?.()
    const root = editorRef.current
    requestAnimationFrame(() => {
      if (!root?.isConnected || (ownsClose && !ownsClose())) return
      if (table.options.meta?.editing?.activeCell) return
      const focused = root.ownerDocument.activeElement
      if (focused && focused !== root.ownerDocument.body && !root.contains(focused)) return
      root.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus()
    })
  }

  return (
    <div ref={editorRef} data-row-id={rowId} data-column-id={columnId} data-slot="data-grid-editable-cell" aria-busy={isPending || undefined}
      data-inline-editor-active={layoutActive || undefined}
      role={error ? "group" : undefined} aria-label={error ? editor.label ?? columnId : undefined}
      aria-describedby={error ? errorId : undefined}
      onKeyDown={(event) => {
        if (isDataGridComposing(event)) return
        if (!isEditing || !["checkbox", "switch", "rating", "radio"].includes(editor.kind)) return
        if (event.key === "Tab" || event.key === "Enter") {
          event.preventDefault()
          if (!isPending) void commit().then((saved) => {
            if (saved && event.key === "Tab") navigate(event.shiftKey ? "previous" : "next")
          })
        } else if (event.key === "Escape") {
          event.preventDefault()
          if (!isPending) editing.cancelCellEdit(rowId, columnId)
        }
      }} className={cn("data-grid-editable-cell-layout", className)}>
      <div data-slot="data-grid-inline-editor-content">
        <DataGridInlineCellEditor
          table={table} row={row} rowId={rowId} columnId={columnId} editor={editor} value={value}
          setValue={(nextValue) => editing.updateCellDraft(rowId, columnId, nextValue)}
          commit={commit}
          cancel={() => editing.cancelCellEdit(rowId, columnId)} navigate={navigate}
          isEditing={isEditing} isPending={isPending} error={error} errorId={errorId} restoreDisplayFocus={restoreDisplayFocus}
        />
      </div>
      {isPending ? (
        <span role="status" className="sr-only">Saving {editor.label ?? columnId}</span>
      ) : null}
      <DataGridInlineError error={error} id={errorId} anchor={editorRef} />
    </div>
  )
}

export function DataGridEditDialog<TData extends EditableRow>({
  table,
  title = "Edit record",
  description = "Update the fields below and save your changes.",
  submitLabel = "Save changes",
}: DataGridEditDialogProps<TData>) {
  const editing = table.options.meta?.editing

  const editableColumns = useMemo(
    () =>
      table.getAllLeafColumns().filter((column) => {
        const editor = getDataGridColumnEditor(column)
        return Boolean(editor && !editor.inlineOnly)
      }),
    [table]
  )

  if (!editing) {
    return null
  }

  const dialogRow = editing.dialogRow
  const dialogRowId = editing.dialogRowId

  return (
    <Dialog
      open={editing.dialogOpen}
      onOpenChange={(open) => {
        if (!open) {
          editing.closeDialog()
        }
      }}
    >
      <DialogContent className="p-0 sm:max-w-2xl">
        <DialogHeader className="px-5 py-4 border-b border-border">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-200px)]">
          <div className="px-5 py-4">
            {editing.dialogMessage ? (
              <div className="bg-destructive/10 text-destructive mb-4 rounded-lg border px-3 py-2 text-sm">
                {editing.dialogMessage}
              </div>
            ) : null}

            {dialogRow && dialogRowId ? (
              <div className="flex flex-col gap-4">
                {editableColumns.map((column) => {
                  const editor = getDataGridColumnEditor(column) as
                    DataGridColumnEditor<TData, unknown> | undefined

                  if (!editor) {
                    return null
                  }

                  const columnId = column.id
                  const error = editing.getDialogError(columnId)
                  const value = editing.getDialogValue(columnId)
                  const isPending = editing.isRowPending(dialogRowId)
                  const renderedField = renderDialogField({
                    table,
                    row: dialogRow,
                    rowId: dialogRowId,
                    columnId,
                    editor,
                    value,
                    setValue: (nextValue) => editing.updateDialogDraft(columnId, nextValue),
                    commit: () => editing.saveDialog(),
                    cancel: editing.closeDialog,
                    isEditing: true,
                    isPending,
                    error,
                  })

                  if (editor.kind === "checkbox" || editor.kind === "switch") {
                    return (
                      <Field key={columnId} invalid={Boolean(error)}>
                        {renderedField}
                        {error ? <FieldError match>{error}</FieldError> : null}
                      </Field>
                    )
                  }

                  return (
                    <Field key={columnId} invalid={Boolean(error)}>
                      <FieldLabel>{editor.label ?? column.id}</FieldLabel>
                      {editor.description ? (
                        <FieldDescription>{editor.description}</FieldDescription>
                      ) : null}
                      {renderedField}
                      {error ? <FieldError match>{error}</FieldError> : null}
                    </Field>
                  )
                })}
              </div>
            ) : null}
          </div>
        </ScrollArea>

        <DialogFooter className="px-5 py-2 border-t border-border">
          <Button
            variant="outline"
            onClick={editing.closeDialog}
            disabled={Boolean(dialogRowId && editing.isRowPending(dialogRowId))}
          >
            Cancel
          </Button>
          <Button
            onClick={() => void editing.saveDialog()}
            disabled={Boolean(dialogRowId && editing.isRowPending(dialogRowId))}
          >
            {dialogRowId && editing.isRowPending(dialogRowId) ? (
              <>
                <Spinner />
                Saving
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
