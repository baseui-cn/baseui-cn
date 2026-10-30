"use client"

import { type Dispatch, type SetStateAction, useCallback, useMemo, useRef, useState } from "react"
import {
  type DataGridColumnEditor,
  type DataGridEditingTableMeta,
} from "@/components/data-grid/data-grid"
import { isValidDate } from "@/components/data-grid/data-grid-filter-client"
import { type RowData } from "@tanstack/react-table"

type EditableRow = RowData

export interface EditableDataGridColumn<TData extends EditableRow> {
  id: string
  editor: DataGridColumnEditor<TData, unknown>
}

export interface EditableDataGridCellSaveParams<TData extends EditableRow> {
  rowId: string
  columnId: string
  row: TData
  previousValue: unknown
  value: unknown
  nextRow: TData
}

export interface EditableDataGridRowSaveParams<TData extends EditableRow> {
  rowId: string
  row: TData
  draft: Partial<TData>
  nextRow: TData
}

export interface EditableDataGridErrorContext<TData extends EditableRow> {
  source: "cell" | "dialog"
  rowId: string
  columnId?: string
  row: TData
  message: string
}

export interface UseEditableDataGridOptions<TData extends EditableRow> {
  data: TData[]
  setData: Dispatch<SetStateAction<TData[]>>
  getRowId: (row: TData) => string
  editorColumns: EditableDataGridColumn<TData>[]
  onSaveCell?: (
    params: EditableDataGridCellSaveParams<TData>
  ) => Promise<TData | void> | TData | void
  onSaveRow?: (params: EditableDataGridRowSaveParams<TData>) => Promise<TData | void> | TData | void
  onError?: (error: unknown, context: EditableDataGridErrorContext<TData>) => void
}

function getCellKey(rowId: string, columnId: string) {
  return `${rowId}::${columnId}`
}

function humanizeColumnId(columnId: string) {
  return columnId
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (value) => value.toUpperCase())
}

function getRecordValue<TData extends EditableRow>(row: TData, columnId: string) {
  return (row as Record<string, unknown>)[columnId]
}

function setRecordValue<TData extends EditableRow>(row: TData, columnId: string, value: unknown) {
  return {
    ...(row as Record<string, unknown>),
    [columnId]: value,
  } as TData
}

function replaceRow<TData extends EditableRow>(
  rows: TData[],
  rowId: string,
  getRowId: (row: TData) => string,
  nextRow: TData
) {
  return rows.map((row) => (getRowId(row) === rowId ? nextRow : row))
}

function isEmptyValue(value: unknown) {
  if (typeof value === "string") {
    return value.trim().length === 0
  }

  if (Array.isArray(value)) {
    return value.length === 0
  }

  return value === null || value === undefined
}

function normalizeErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  if (typeof error === "string" && error.trim().length > 0) {
    return error
  }

  return fallback
}

export function useEditableDataGrid<TData extends EditableRow>({
  data,
  setData,
  getRowId,
  editorColumns,
  onSaveCell,
  onSaveRow,
  onError,
}: UseEditableDataGridOptions<TData>): DataGridEditingTableMeta<TData> {
  // Immediate row locks prevent double submits before React renders pending state.
  const pendingOperations = useRef(new Set<string>())
  const [activeCell, setActiveCell] = useState<{
    rowId: string
    columnId: string
  } | null>(null)
  const [cellDrafts, setCellDrafts] = useState<Record<string, unknown>>({})
  const [cellErrors, setCellErrors] = useState<Record<string, string | undefined>>({})
  const [pendingCells, setPendingCells] = useState<Record<string, boolean>>({})
  const [pendingRows, setPendingRows] = useState<Record<string, boolean>>({})
  const [dialogRowId, setDialogRowId] = useState<string | null>(null)
  const [dialogDraft, setDialogDraft] = useState<Partial<TData> | null>(null)
  const [dialogErrors, setDialogErrors] = useState<Record<string, string | undefined>>({})
  const [dialogMessage, setDialogMessage] = useState<string | null>(null)

  const editorMap = useMemo(
    () => new Map(editorColumns.map((column) => [column.id, column.editor])),
    [editorColumns]
  )

  const findRowById = useCallback(
    (rowId: string) => data.find((row) => getRowId(row) === rowId) ?? null,
    [data, getRowId]
  )

  const dialogRow = useMemo(
    () => (dialogRowId ? findRowById(dialogRowId) : null),
    [dialogRowId, findRowById]
  )

  const getEditor = useCallback((columnId: string) => editorMap.get(columnId), [editorMap])

  const parseValue = useCallback(
    (editor: DataGridColumnEditor<TData, unknown>, value: unknown, row: TData) => {
      if (editor.parse) {
        return editor.parse(value, row)
      }

      switch (editor.kind) {
        case "number": {
          if (typeof value === "number") {
            return value
          }

          if (typeof value === "string") {
            const normalizedValue = value.replace(/,/g, "").trim()
            return normalizedValue.length > 0 ? Number(normalizedValue) : undefined
          }

          return value
        }

        case "checkbox":
        case "switch":
          return value === true

        case "rating":
          return typeof value === "number" ? value : Number(value)

        default:
          return value
      }
    },
    []
  )

  const validateValue = useCallback(
    (
      columnId: string,
      editor: DataGridColumnEditor<TData, unknown>,
      value: unknown,
      row: TData
    ) => {
      const fieldLabel = editor.label ?? humanizeColumnId(columnId)

      if (editor.required && isEmptyValue(value)) {
        return `${fieldLabel} is required.`
      }

      if (editor.kind === "date" && !isEmptyValue(value) &&
          (typeof value !== "string" || !isValidDate(value))) return `${fieldLabel} must be a valid date.`

      if (editor.kind === "number" && value !== undefined && value !== null) {
        if (typeof value !== "number" || !Number.isFinite(value)) {
          return `${fieldLabel} must be a valid number.`
        }

        if (typeof editor.min === "number" && value < editor.min) {
          return `${fieldLabel} must be at least ${editor.min}.`
        }

        if (typeof editor.max === "number" && value > editor.max) {
          return `${fieldLabel} must be at most ${editor.max}.`
        }
      }

      if (editor.validate) {
        return editor.validate(value, row) ?? null
      }

      return null
    },
    []
  )

  const clearCellState = useCallback((rowId: string, columnId: string) => {
    const cellKey = getCellKey(rowId, columnId)

    setCellDrafts((currentDrafts) => {
      if (!(cellKey in currentDrafts)) {
        return currentDrafts
      }

      const nextDrafts = { ...currentDrafts }
      delete nextDrafts[cellKey]
      return nextDrafts
    })

    setCellErrors((currentErrors) => {
      if (!(cellKey in currentErrors)) {
        return currentErrors
      }

      const nextErrors = { ...currentErrors }
      delete nextErrors[cellKey]
      return nextErrors
    })
  }, [])

  const startCellEdit = useCallback(
    (row: TData, columnId: string) => {
      const rowId = getRowId(row)
      if (pendingRows[rowId] || pendingOperations.current.has(rowId)) {
        return
      }

      setDialogMessage(null)
      setActiveCell({ rowId, columnId })
      setCellDrafts((currentDrafts) => ({
        ...currentDrafts,
        [getCellKey(rowId, columnId)]: getRecordValue(row, columnId),
      }))
      setCellErrors((currentErrors) => ({
        ...currentErrors,
        [getCellKey(rowId, columnId)]: undefined,
      }))
    },
    [getRowId, pendingRows]
  )

  const cancelCellEdit = useCallback(
    (rowId?: string, columnId?: string) => {
      const target = rowId && columnId ? { rowId, columnId } : activeCell
      if (!target || pendingOperations.current.has(target.rowId)) {
        return
      }

      clearCellState(target.rowId, target.columnId)
      setActiveCell((currentCell) =>
        currentCell?.rowId === target.rowId && currentCell?.columnId === target.columnId
          ? null
          : currentCell
      )
    },
    [activeCell, clearCellState]
  )

  const updateCellDraft = useCallback((rowId: string, columnId: string, value: unknown) => {
    const cellKey = getCellKey(rowId, columnId)

    setCellDrafts((currentDrafts) => ({
      ...currentDrafts,
      [cellKey]: value,
    }))

    setCellErrors((currentErrors) => ({
      ...currentErrors,
      [cellKey]: undefined,
    }))
    setDialogMessage(null)
  }, [])

  const commitCellEdit = useCallback(
    async (row: TData, columnId: string, value?: unknown) => {
      const rowId = getRowId(row)
      const cellKey = getCellKey(rowId, columnId)
      const editor = getEditor(columnId)

      if (!editor || editor.dialogOnly || pendingOperations.current.has(rowId) || pendingRows[rowId] || pendingCells[cellKey]) {
        return false
      }

      const currentRow = findRowById(rowId)
      if (!currentRow) {
        setCellErrors((errors) => ({ ...errors, [cellKey]: "This row is no longer available." }))
        return false
      }
      const rawValue =
        value !== undefined ? value : (cellKey in cellDrafts ? cellDrafts[cellKey] : getRecordValue(currentRow, columnId))
      let parsedValue: unknown
      let validationError: string | null
      try {
        parsedValue = parseValue(editor, rawValue, currentRow)
        validationError = validateValue(columnId, editor, parsedValue, currentRow)
      } catch (error) {
        validationError = normalizeErrorMessage(error, "Invalid value.")
      }

      if (validationError) {
        setCellErrors((currentErrors) => ({
          ...currentErrors,
          [cellKey]: validationError,
        }))
        return false
      }

      const previousValue = getRecordValue(currentRow, columnId)
      const nextRow = setRecordValue(currentRow, columnId, parsedValue)

      if (Object.is(previousValue, parsedValue)) {
        clearCellState(rowId, columnId)
        setActiveCell((currentCell) =>
          currentCell?.rowId === rowId && currentCell?.columnId === columnId ? null : currentCell
        )
        return true
      }

      pendingOperations.current.add(rowId)
      setPendingCells((currentPendingCells) => ({
        ...currentPendingCells,
        [cellKey]: true,
      }))
      setCellErrors((currentErrors) => ({
        ...currentErrors,
        [cellKey]: undefined,
      }))
      setData((currentRows) => replaceRow(currentRows, rowId, getRowId, nextRow))

      try {
        const savedRow =
          (await onSaveCell?.({
            rowId,
            columnId,
            row: currentRow,
            previousValue,
            value: parsedValue,
            nextRow,
          })) ?? nextRow

        setData((currentRows) => currentRows.map((entry) =>
          getRowId(entry) === rowId && entry === nextRow ? savedRow : entry))
        clearCellState(rowId, columnId)
        setActiveCell((currentCell) =>
          currentCell?.rowId === rowId && currentCell?.columnId === columnId ? null : currentCell
        )

        return true
      } catch (error) {
        const message = normalizeErrorMessage(
          error,
          `${editor.label ?? humanizeColumnId(columnId)} could not be saved.`
        )

        setData((currentRows) => currentRows.map((entry) =>
          getRowId(entry) === rowId && entry === nextRow ? currentRow : entry))
        setCellErrors((currentErrors) => ({
          ...currentErrors,
          [cellKey]: message,
        }))
        onError?.(error, {
          source: "cell",
          rowId,
          columnId,
          row: currentRow,
          message,
        })

        return false
      } finally {
        pendingOperations.current.delete(rowId)
        setPendingCells((currentPendingCells) => ({
          ...currentPendingCells,
          [cellKey]: false,
        }))
      }
    },
    [
      cellDrafts,
      clearCellState,
      findRowById,
      getEditor,
      getRowId,
      onError,
      onSaveCell,
      parseValue,
      pendingCells,
      pendingRows,
      setData,
      validateValue,
    ]
  )

  const openDialog = useCallback(
    (row: TData) => {
      const rowId = getRowId(row)
      if (pendingRows[rowId] || pendingOperations.current.has(rowId)) {
        return
      }

      setDialogRowId(rowId)
      setDialogDraft({
        ...(row as Record<string, unknown>),
      } as Partial<TData>)
      setDialogErrors({})
      setDialogMessage(null)
    },
    [getRowId, pendingRows]
  )

  const closeDialog = useCallback(() => {
    if (dialogRowId && pendingRows[dialogRowId]) {
      return
    }

    setDialogRowId(null)
    setDialogDraft(null)
    setDialogErrors({})
    setDialogMessage(null)
  }, [dialogRowId, pendingRows])

  const updateDialogDraft = useCallback((columnId: string, value: unknown) => {
    setDialogDraft(
      (currentDraft) =>
        ({
          ...(currentDraft ?? {}),
          [columnId]: value,
        }) as Partial<TData>
    )
    setDialogErrors((currentErrors) => ({
      ...currentErrors,
      [columnId]: undefined,
    }))
    setDialogMessage(null)
  }, [])

  const getDialogValue = useCallback(
    (columnId: string) => dialogDraft?.[columnId as keyof TData],
    [dialogDraft]
  )

  const saveDialog = useCallback(async () => {
    if (!dialogRowId || !dialogDraft) {
      return false
    }

    const currentRow = findRowById(dialogRowId)
    if (!currentRow || pendingRows[dialogRowId] || pendingOperations.current.has(dialogRowId)) {
      return false
    }

    const nextRow = { ...currentRow } as TData
    const nextErrors: Record<string, string | undefined> = {}

    for (const { id, editor } of editorColumns) {
      if (editor.inlineOnly) {
        continue
      }

      const rawValue = id in dialogDraft ? dialogDraft[id as keyof TData] : getRecordValue(currentRow, id)
      let parsedValue: unknown
      let validationError: string | null
      try {
        parsedValue = parseValue(editor, rawValue, currentRow)
        validationError = validateValue(id, editor, parsedValue, currentRow)
      } catch (error) {
        validationError = normalizeErrorMessage(error, "Invalid value.")
      }

      if (validationError) {
        nextErrors[id] = validationError
      } else {
        ;(nextRow as Record<string, unknown>)[id] = parsedValue
      }
    }

    if (Object.values(nextErrors).some(Boolean)) {
      setDialogErrors(nextErrors)
      return false
    }

    setDialogErrors({})
    setDialogMessage(null)
    pendingOperations.current.add(dialogRowId)
    setPendingRows((currentPendingRows) => ({
      ...currentPendingRows,
      [dialogRowId]: true,
    }))
    setData((currentRows) => replaceRow(currentRows, dialogRowId, getRowId, nextRow))

    try {
      const savedRow =
        (await onSaveRow?.({
          rowId: dialogRowId,
          row: currentRow,
          draft: dialogDraft,
          nextRow,
        })) ?? nextRow

      setData((currentRows) => currentRows.map((entry) =>
        getRowId(entry) === dialogRowId && entry === nextRow ? savedRow : entry))
      setDialogRowId(null)
      setDialogDraft(null)
      setDialogMessage(null)

      return true
    } catch (error) {
      const message = normalizeErrorMessage(error, "The record could not be saved.")

      setData((currentRows) => currentRows.map((entry) =>
        getRowId(entry) === dialogRowId && entry === nextRow ? currentRow : entry))
      setDialogMessage(message)
      onError?.(error, {
        source: "dialog",
        rowId: dialogRowId,
        row: currentRow,
        message,
      })

      return false
    } finally {
      pendingOperations.current.delete(dialogRowId)
      setPendingRows((currentPendingRows) => ({
        ...currentPendingRows,
        [dialogRowId]: false,
      }))
    }
  }, [
    dialogDraft,
    dialogRowId,
    editorColumns,
    findRowById,
    getRowId,
    onError,
    onSaveRow,
    parseValue,
    pendingRows,
    setData,
    validateValue,
  ])

  const isCellEditing = useCallback(
    (rowId: string, columnId: string) =>
      activeCell?.rowId === rowId && activeCell?.columnId === columnId,
    [activeCell]
  )

  const isCellPending = useCallback(
    (rowId: string, columnId: string) =>
      Boolean(pendingRows[rowId] || pendingCells[getCellKey(rowId, columnId)]),
    [pendingCells, pendingRows]
  )

  const isRowPending = useCallback(
    (rowId: string) =>
      Boolean(
        pendingRows[rowId] ||
        Object.entries(pendingCells).some(
          ([cellKey, isPending]) => isPending && cellKey.startsWith(`${rowId}::`)
        )
      ),
    [pendingCells, pendingRows]
  )

  const isGridPending = useCallback(
    () => Object.values(pendingRows).some(Boolean) || Object.values(pendingCells).some(Boolean),
    [pendingCells, pendingRows]
  )

  const getCellDraftValue = useCallback(
    (row: TData, columnId: string) =>
      getCellKey(getRowId(row), columnId) in cellDrafts
        ? cellDrafts[getCellKey(getRowId(row), columnId)] : getRecordValue(row, columnId),
    [cellDrafts, getRowId]
  )

  const getCellError = useCallback(
    (rowId: string, columnId: string) => cellErrors[getCellKey(rowId, columnId)],
    [cellErrors]
  )

  const getDialogError = useCallback((columnId: string) => dialogErrors[columnId], [dialogErrors])

  const clearDialogMessage = useCallback(() => {
    setDialogMessage(null)
  }, [])

  return useMemo(
    () => ({
      activeCell,
      dialogOpen: Boolean(dialogRowId && dialogDraft),
      dialogRow,
      dialogRowId,
      dialogDraft,
      dialogErrors,
      dialogMessage,
      startCellEdit,
      cancelCellEdit,
      updateCellDraft,
      commitCellEdit,
      isCellEditing,
      isCellPending,
      getCellDraftValue,
      getCellError,
      openDialog,
      closeDialog,
      updateDialogDraft,
      saveDialog,
      getDialogValue,
      getDialogError,
      clearDialogMessage,
      isRowPending,
      isGridPending,
    }),
    [
      activeCell,
      cancelCellEdit,
      clearDialogMessage,
      closeDialog,
      commitCellEdit,
      dialogDraft,
      dialogErrors,
      dialogMessage,
      dialogRow,
      dialogRowId,
      getCellDraftValue,
      getCellError,
      getDialogError,
      getDialogValue,
      isCellEditing,
      isCellPending,
      isGridPending,
      isRowPending,
      openDialog,
      saveDialog,
      startCellEdit,
      updateCellDraft,
      updateDialogDraft,
    ]
  )
}
