import type { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table"
import { isColumnFilterState } from "./data-grid-filter-client"
import type { ColumnFilterState } from "@/types/data-grid-filter"

export interface DataGridQuery {
  pagination: PaginationState
  sorting: SortingState
  columnFilters: ColumnFiltersState
}

export interface SerializedDataGridQuery extends Omit<DataGridQuery, "columnFilters"> {
  columnFilters: Array<{ id: string; value: ColumnFilterState }>
}

/** JSON transport contract for Excel filters. The server must validate it again. */
export function serializeDataGridQuery(query: DataGridQuery): string {
  const { pageIndex, pageSize } = query.pagination
  if (!Number.isSafeInteger(pageIndex) || pageIndex < 0 ||
      !Number.isSafeInteger(pageSize) || pageSize < 1) {
    throw new Error("Invalid grid pagination.")
  }
  const sorting = query.sorting.map(({ id, desc }) => {
    if (!id || typeof id !== "string" || typeof desc !== "boolean") {
      throw new Error("Invalid grid sorting.")
    }
    return { id, desc }
  })
  const columnFilters = query.columnFilters.map(({ id, value }) => {
    if (!id || typeof id !== "string" || !isColumnFilterState(value)) {
      throw new Error(`Invalid grid filter: ${id}.`)
    }
    const filter: ColumnFilterState = value.type === "date"
      ? { type: "date", operator: value.operator, value: value.value.trim(),
          ...(value.operator === "between" ? { secondValue: value.secondValue!.trim() } : {}) }
      : { type: value.type, operator: value.operator, value: value.value.trim() } as ColumnFilterState
    return { id, value: filter }
  })
  const payload: SerializedDataGridQuery = {
    pagination: { pageIndex, pageSize }, sorting, columnFilters,
  }
  return JSON.stringify(payload)
}
