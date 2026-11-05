import type { RowData } from "@tanstack/react-table"
import type { DataGridRow, DataGridTable } from "./table-features"

/** Keep colgroups, navigation and cells in the same logical pinning order. */
export function getDataGridVisibleColumns<TData extends RowData>(table: DataGridTable<TData>) {
  return [
    ...table.getStartVisibleLeafColumns(),
    ...table.getCenterVisibleLeafColumns(),
    ...table.getEndVisibleLeafColumns(),
  ]
}

export function isDataGridComposing(event: {
  nativeEvent?: { isComposing?: boolean; keyCode?: number }
  isComposing?: boolean
  keyCode?: number
}) {
  return event.nativeEvent?.isComposing || event.isComposing ||
    event.nativeEvent?.keyCode === 229 || event.keyCode === 229
}

/** Locate neighbours without creating cell objects for unmounted virtual rows. */
export function findAdjacentDataGridEditor<TData extends RowData>({
  table, rowId, columnId, direction, rowsPinnable, isPending,
}: {
  table: DataGridTable<TData>
  rowId: string
  columnId: string
  direction: "next" | "previous"
  rowsPinnable?: boolean
  isPending: (rowId: string, columnId: string) => boolean
}) {
  const sections: DataGridRow<TData>[][] = rowsPinnable
    ? [table.getTopRows(), table.getRowModel().rows, table.getBottomRows()]
    : [table.getRowModel().rows]
  const columns = getDataGridVisibleColumns(table)
  const pins = table.store.state.rowPinning
  let sectionIndex = rowsPinnable
    ? pins.top?.includes(rowId) ? 0 : pins.bottom?.includes(rowId) ? 2 : 1
    : 0
  let rowIndex = sections[sectionIndex].findIndex((row) => row.id === rowId)
  if (rowIndex < 0) return null
  let columnIndex = columns.findIndex((column) => column.id === columnId)
  if (columnIndex < 0) return null
  const step = direction === "next" ? 1 : -1
  while (sectionIndex >= 0 && sectionIndex < sections.length) {
    columnIndex += step
    if (columnIndex < 0 || columnIndex >= columns.length) {
      rowIndex += step
      columnIndex = step === 1 ? 0 : columns.length - 1
    }
    while (rowIndex < 0 || rowIndex >= sections[sectionIndex].length) {
      sectionIndex += step
      if (sectionIndex < 0 || sectionIndex >= sections.length) return null
      rowIndex = step === 1 ? 0 : sections[sectionIndex].length - 1
    }
    const row = sections[sectionIndex][rowIndex]
    if (rowsPinnable && sectionIndex === 1 && row.getIsPinned()) {
      rowIndex += step
      columnIndex = step === 1 ? -1 : columns.length
      continue
    }
    const column = columns[columnIndex]
    const editor = column?.columnDef.meta?.editor
    if (editor && !editor.dialogOnly && !isPending(row.id, column.id)) return { row, column }
  }
  return null
}
