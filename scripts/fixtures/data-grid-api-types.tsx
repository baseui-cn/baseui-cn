import { useTable, type PaginationState, type SortingState, type ColumnFiltersState } from "@tanstack/react-table"
import { dataGridFeatures, type DataGridColumnDef, type DataGridTable } from "@/components/data-grid/table-features"
import type { DataGridTableVirtualizerOptions } from "@/components/data-grid/data-grid-table-virtual"
import type { DataGridTableDndCombinedProps } from "@/components/data-grid/data-grid-table-dnd-combined"
import type { DataGridInlineEditorOption } from "@/components/data-grid/data-grid-inline-editor"
type Person = { id: string; name: string }
export const disabled: DataGridTableVirtualizerOptions<Person> = { enabled: false }
export const overscan: DataGridTableVirtualizerOptions<Person> = { overscan: 3 }
export const measured: DataGridTableVirtualizerOptions<Person> = { estimateSize: (_index, row) => row.original.name.length + 30 }
export const dnd: DataGridTableDndCombinedProps = { onRowDragEnd: () => {} }
export const options: DataGridInlineEditorOption<string | null>[] = [{ label: "Unavailable", value: "blocked", disabled: true }, { label: "Empty", value: null }]
export function useServerMigrationExample(data: Person[], columns: DataGridColumnDef<Person>[], pagination: PaginationState, sorting: SortingState, columnFilters: ColumnFiltersState): DataGridTable<Person> {
  return useTable({ features: dataGridFeatures, data, columns, getRowId: row => row.id, rowCount: 100,
    state: { pagination, sorting, columnFilters }, manualPagination: true, manualSorting: true, manualFiltering: true })
}
