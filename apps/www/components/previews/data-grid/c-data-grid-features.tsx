"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { arrayMove } from "@dnd-kit/sortable"
import type { DragEndEvent } from "@dnd-kit/core"
import {
  type ColumnFiltersState,
  type ColumnOrderState,
  type ColumnPinningState,
  type PaginationState,
  type SortingState,
  useTable,
} from "@tanstack/react-table"
import type {
  DataGridCell,
  DataGridColumnDef,
  DataGridRow,
} from "@/components/data-grid/table-features"
import {
  type DataGridFeatures,
  defaultDataGridFeatures,
  dataGridFeatureOptions,
} from "@/hooks/data-grid-feature-config"
import { dataGridFeatures } from "@/components/data-grid/table-features"
import { DataGrid, DataGridContainer } from "@/components/data-grid/data-grid"
import type { DataGridColumnEditor } from "@/components/data-grid/data-grid"
import { DataGridColumnHeader } from "@/components/data-grid/data-grid-column-header"
import { DataGridEditableCell } from "@/components/data-grid/data-grid-editing"
import { DataGridActiveFilters } from "@/components/data-grid/data-grid-filter-menu"
import {
  DataGridInlineEditor,
  type DataGridInlineEditorKind,
} from "@/components/data-grid/data-grid-inline-editor"
import { DataGridPagination } from "@/components/data-grid/data-grid-pagination"
import { DataGridScrollArea } from "@/components/data-grid/data-grid-scroll-area"
import {
  DataGridTableDndCombined,
  DataGridTableDndCombinedRowHandle,
} from "@/components/data-grid/data-grid-table-dnd-combined"
import { DataGridTableRowPin } from "@/components/data-grid/data-grid-table"
import {
  createMockStaffDataSource,
  type StaffMember,
  type StaffStatus,
} from "@/hooks/data-grid-features-data"
import { createExcelFilterFn } from "@/components/data-grid/data-grid-filter-client"
import { useDataGridFeatureData } from "@/hooks/use-data-grid-feature-data"
import type { DataGridColumnPreference } from "@/types/data-grid-data-source"
import { useEditableDataGrid, type EditableDataGridColumn } from "@/hooks/use-editable-data-grid"

type StateUpdater<T> = T | ((previous: T) => T)

const defaultColumnOrder: ColumnOrderState = [
  "rowActions",
  "name",
  "team",
  "title",
  "salary",
  "startDate",
  "status",
]

const statusOptions: Array<{ label: string; value: StaffStatus }> = [
  { label: "Active", value: "Active" },
  { label: "On leave", value: "On leave" },
  { label: "Probation", value: "Probation" },
]

function displayCellValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "—"
  if (typeof value === "number") return `${new Intl.NumberFormat("en-US").format(value)}`
  return String(value)
}

function createInlineRenderer(editorType: DataGridInlineEditorKind) {
  return function renderInlineEditor({
    table,
    row,
    columnId,
    value,
    setValue,
    commit,
    cancel,
    navigate,
    isEditing,
    isPending,
    editor,
  }: Parameters<NonNullable<DataGridColumnEditor<StaffMember, unknown>["renderInline"]>>[0]) {
    const optionLabel = editor.options?.find(
      (option) => String(option.value) === String(value)
    )?.label

    if (!isEditing) {
      return (
        <Button
          variant="ghost"
          type="button"
          className="text-foreground data-grid-edit-trigger-layout h-auto w-full justify-start px-2 py-1 text-left font-normal"
          onClick={() => table.options.meta?.editing?.startCellEdit(row, columnId)}
          disabled={isPending}
        >
          {optionLabel ?? displayCellValue(value)}
        </Button>
      )
    }

    return (
      <DataGridInlineEditor
        value={value}
        editorType={editorType}
        options={editor.options}
        placeholder={editor.placeholder}
        disabled={isPending}
        parseValue={(raw) => {
          if (editorType === "number") {
            const number = Number(raw)
            if (!raw.trim() || !Number.isFinite(number)) {
              throw new Error("Please enter a valid number.")
            }
            return number
          }
          if (editorType === "select") {
            return editor.options?.find((option) => String(option.value) === raw)?.value ?? raw
          }
          return raw
        }}
        validate={(nextValue) => editor.validate?.(nextValue, row) ?? null}
        onDraftChange={setValue}
        onCommit={commit}
        onCancel={cancel}
        onNavigate={navigate}
      />
    )
  }
}

function EditableFeatureCell({
  cell,
  enabled,
}: {
  cell: DataGridCell<StaffMember, unknown>
  enabled: boolean
}) {
  if (enabled) return <DataGridEditableCell cell={cell} />
  return <div className="px-2 py-1">{displayCellValue(cell.getValue())}</div>
}

function RowActions({
  row,
  reorderingEnabled,
}: {
  row: DataGridRow<StaffMember>
  reorderingEnabled: boolean
}) {
  const pinPosition = row.getIsPinned()

  return (
    <div className="flex items-center gap-1">
      {reorderingEnabled && <DataGridTableDndCombinedRowHandle disabled={Boolean(pinPosition)} />}
      <DataGridTableRowPin row={row} />
    </div>
  )
}

function toColumnPreferences(order: ColumnOrderState, pinning: ColumnPinningState) {
  return order.map((columnId, orderRank): DataGridColumnPreference => ({
    columnId,
    orderRank,
    pinPosition: (pinning.start ?? []).includes(columnId)
      ? "start"
      : (pinning.end ?? []).includes(columnId)
        ? "end"
        : null,
  }))
}

export function DataGridFeaturesPreview() {
  const dataSource = useMemo(() => createMockStaffDataSource(), [])
  const [features, setFeatures] = useState<DataGridFeatures>(() => ({ ...defaultDataGridFeatures }))
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnOrderOverride, setColumnOrder] = useState<ColumnOrderState | null>(null)
  const [columnPinningOverride, setColumnPinning] = useState<ColumnPinningState | null>(null)
  const query = useMemo(
    () => ({
      pagination,
      sorting,
      columnFilters: features.excelFilters ? columnFilters : [],
    }),
    [columnFilters, features.excelFilters, pagination, sorting]
  )
  const sourceData = useDataGridFeatureData({ dataSource, query })
  const {
    rows,
    setRows,
    total,
    rowPinning,
    setRowPinning,
    columnPreferences,
    isLoading,
    error,
    refresh,
    reportError,
    clearError,
  } = sourceData

  const handleRowPinningChange = useCallback(
    (updater: Parameters<typeof setRowPinning>[0]) => {
      setRowPinning(updater)
    },
    [setRowPinning]
  )

  const columns = useMemo<DataGridColumnDef<StaffMember>[]>(
    () => [
      {
        id: "rowActions",
        header: "",
        cell: ({ row }) => (
          <RowActions
            row={row}
            reorderingEnabled={features.rowReordering}
          />
        ),
        size: 88,
        enableSorting: false,
        enableColumnFilter: false,
        enableColumnOrdering: false,
        enableColumnPinning: false,
        enableHiding: false,
        meta: { cellClassName: "relative !p-0" },
      },
      {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Name"
            column={column}
            filterType={features.excelFilters ? "text" : undefined}
          />
        ),
        enablePinning: true,
        filterFn: createExcelFilterFn<StaffMember>(),
        meta: {
          headerTitle: "Name",
          editor: {
            kind: "text",
            label: "Name",
            required: true,
            inlineOnly: true,
            renderInline: createInlineRenderer("text"),
          },
        },
        cell: ({ cell }) => <EditableFeatureCell cell={cell} enabled={features.inlineEditing} />,
      },
      {
        accessorKey: "team",
        id: "team",
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Team"
            column={column}
            filterType={features.excelFilters ? "text" : undefined}
          />
        ),
        enablePinning: true,
        filterFn: createExcelFilterFn<StaffMember>(),
        meta: {
          headerTitle: "Team",
          editor: {
            kind: "select",
            label: "Team",
            options: [
              { label: "Design", value: "Design" },
              { label: "Engineering", value: "Engineering" },
              { label: "Operations", value: "Operations" },
              { label: "Product", value: "Product" },
            ],
            inlineOnly: true,
            renderInline: createInlineRenderer("select"),
          },
        },
        cell: ({ cell }) => <EditableFeatureCell cell={cell} enabled={features.inlineEditing} />,
      },
      {
        accessorKey: "title",
        id: "title",
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Title"
            column={column}
            filterType={features.excelFilters ? "text" : undefined}
          />
        ),
        enablePinning: true,
        filterFn: createExcelFilterFn<StaffMember>(),
        meta: {
          headerTitle: "Title",
          editor: {
            kind: "text",
            label: "Title",
            required: true,
            inlineOnly: true,
            renderInline: createInlineRenderer("text"),
          },
        },
        cell: ({ cell }) => <EditableFeatureCell cell={cell} enabled={features.inlineEditing} />,
      },
      {
        accessorKey: "salary",
        id: "salary",
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Salary"
            column={column}
            filterType={features.excelFilters ? "number" : undefined}
          />
        ),
        enablePinning: true,
        filterFn: createExcelFilterFn<StaffMember>(),
        meta: {
          headerTitle: "Salary",
          editor: {
            kind: "number",
            label: "Salary",
            min: 0,
            step: 1000,
            inlineOnly: true,
            renderInline: createInlineRenderer("number"),
          },
        },
        cell: ({ cell }) => <EditableFeatureCell cell={cell} enabled={features.inlineEditing} />,
      },
      {
        accessorKey: "startDate",
        id: "startDate",
        header: ({ column }) => (
          <DataGridColumnHeader
            title="StartDate"
            column={column}
            filterType={features.excelFilters ? "date" : undefined}
          />
        ),
        enablePinning: true,
        filterFn: createExcelFilterFn<StaffMember>(),
        meta: {
          headerTitle: "Start Date",
          editor: {
            kind: "text",
            label: "Start Date",
            inlineOnly: true,
            renderInline: createInlineRenderer("date"),
          },
        },
        cell: ({ cell }) => <EditableFeatureCell cell={cell} enabled={features.inlineEditing} />,
      },
      {
        accessorKey: "status",
        id: "status",
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Status"
            column={column}
            filterType={features.excelFilters ? "text" : undefined}
          />
        ),
        enablePinning: true,
        filterFn: createExcelFilterFn<StaffMember>(),
        meta: {
          headerTitle: "Status",
          editor: {
            kind: "select",
            label: "Status",
            options: statusOptions,
            inlineOnly: true,
            renderInline: createInlineRenderer("select"),
          },
        },
        cell: ({ cell }) => <EditableFeatureCell cell={cell} enabled={features.inlineEditing} />,
      },
    ],
    [features]
  )

  const savedColumnState = useMemo(() => {
    const savedPreferences = new Map(
      columnPreferences.map((preference) => [preference.columnId, preference])
    )
    const availableIds = columns.flatMap((column) => (column.id ? [column.id] : []))
    const order = [...availableIds].sort((leftId, rightId) => {
      const leftRank = savedPreferences.get(leftId)?.orderRank
      const rightRank = savedPreferences.get(rightId)?.orderRank
      if (leftRank === undefined) return rightRank === undefined ? 0 : 1
      if (rightRank === undefined) return -1
      return leftRank - rightRank
    })
    const start = order.filter((columnId) => savedPreferences.get(columnId)?.pinPosition === "start")
    const end = order.filter((columnId) => savedPreferences.get(columnId)?.pinPosition === "end")

    return {
      order: columnPreferences.length ? order : defaultColumnOrder,
      pinning: { start, end },
    }
  }, [columnPreferences, columns])
  const columnOrder = columnOrderOverride ?? savedColumnState.order
  const columnPinning = columnPinningOverride ?? savedColumnState.pinning

  const handleColumnOrderChange = useCallback(
    (updater: StateUpdater<ColumnOrderState>) => {
      setColumnOrder((currentOrder) =>
        typeof updater === "function" ? updater(currentOrder ?? savedColumnState.order) : updater
      )
    },
    [savedColumnState.order]
  )

  const handleColumnPinningChange = useCallback(
    (updater: StateUpdater<ColumnPinningState>) => {
      setColumnPinning((currentPinning) =>
        typeof updater === "function"
          ? updater(currentPinning ?? savedColumnState.pinning)
          : updater
      )
    },
    [savedColumnState.pinning]
  )

  const editorColumns = useMemo<EditableDataGridColumn<StaffMember>[]>(
    () =>
      columns.flatMap((column) =>
        column.id && column.meta?.editor
          ? [
              {
                id: column.id,
                editor: column.meta.editor as DataGridColumnEditor<StaffMember, unknown>,
              },
            ]
          : []
      ),
    [columns]
  )

  const editing = useEditableDataGrid<StaffMember>({
    data: rows,
    setData: setRows,
    getRowId: (row) => row.id,
    editorColumns,
    onSaveCell: async ({ rowId, nextRow }) => {
      await dataSource.updateRow(rowId, nextRow)
      if (dataSource.mode === "server") refresh()
      return nextRow
    },
    onError: (editError) => reportError(editError),
  })

  const table = useTable({
    features: dataGridFeatures,
    data: rows,
    columns,
    pageCount: Math.ceil(total / pagination.pageSize),
    getRowId: (row) => row.id,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnOrder,
      columnPinning,
      rowPinning,
    },
    meta: { editing },
    enableRowPinning: features.rowPinning,
    enableColumnPinning: features.columnPinning,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnOrderChange: handleColumnOrderChange,
    onColumnPinningChange: handleColumnPinningChange,
    onRowPinningChange: handleRowPinningChange,
    manualFiltering: dataSource.mode === "server" || !features.excelFilters,
    manualSorting: dataSource.mode === "server",
    manualPagination: dataSource.mode === "server",
  })

  useEffect(() => {
    if (isLoading) return
    const save = async () => {
      try {
        await dataSource.saveColumnState(toColumnPreferences(columnOrder, columnPinning))
      } catch (saveError) {
        reportError(saveError)
      }
    }
    void save()
  }, [columnOrder, columnPinning, dataSource, isLoading, reportError])

  useEffect(() => {
    if (isLoading) return
    const save = async () => {
      try {
        await dataSource.saveRowPinning(rowPinning)
      } catch (saveError) {
        reportError(saveError)
      }
    }
    void save()
  }, [dataSource, isLoading, reportError, rowPinning])

  const updateFeature = (feature: keyof DataGridFeatures, checked: boolean) => {
    setFeatures((currentFeatures) => ({ ...currentFeatures, [feature]: checked }))
  }

  const handleRowDragEnd = useCallback(
    async ({ active, over }: DragEndEvent) => {
      if (!features.rowReordering || !over || active.id === over.id) return

      const from = rows.findIndex((row) => row.id === String(active.id))
      const to = rows.findIndex((row) => row.id === String(over.id))
      if (from < 0 || to < 0) return

      const nextRows = arrayMove(rows, from, to)
      const movedRow = nextRows[to]
      const move = {
        rowId: movedRow.id,
        previousRowId: nextRows[to - 1]?.id ?? null,
        nextRowId: nextRows[to + 1]?.id ?? null,
      }
      setRows(nextRows)
      try {
        await dataSource.reorderRows(move)
        clearError()
      } catch (reorderError) {
        setRows(rows)
        reportError(reorderError)
      }
    },
    [clearError, dataSource, features.rowReordering, reportError, rows, setRows]
  )

  const handleColumnDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (!features.columnDragAndDrop || !over || active.id === over.id) return
      handleColumnOrderChange((currentOrder) => {
        const from = currentOrder.indexOf(String(active.id))
        const to = currentOrder.indexOf(String(over.id))
        return from < 0 || to < 0 ? currentOrder : arrayMove(currentOrder, from, to)
      })
    },
    [features.columnDragAndDrop, handleColumnOrderChange]
  )

  return (
    <div className="w-full min-w-0 space-y-4">
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <DataGridContainer>
        <DataGrid
          table={table}
          recordCount={total}
          isLoading={isLoading}
          featureControls={{
            features: dataGridFeatureOptions.map(([id, label]) => ({
              id,
              label,
              checked: features[id],
            })),
            onFeatureChange: updateFeature,
          }}
          tableLayout={{
            columnsResizable: true,
            columnsDraggable: features.columnDragAndDrop,
            columnsPinnable: features.columnPinning,
            columnsMovable: features.columnReordering,
            rowsDraggable: features.rowReordering,
            rowsPinnable: features.rowPinning,
          }}
        >
          <DataGridActiveFilters />
          <DataGridScrollArea className="h-[460px]">
            <DataGridTableDndCombined
              onRowDragEnd={handleRowDragEnd}
              onColumnDragEnd={handleColumnDragEnd}
            />
          </DataGridScrollArea>
          <div className="border-t px-4 py-3">
            <DataGridPagination />
          </div>
        </DataGrid>
      </DataGridContainer>
    </div>
  )
}
