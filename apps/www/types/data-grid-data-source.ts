import type { RowPinningState } from "@tanstack/react-table"
import type { DataGridQuery } from "@/components/data-grid/data-grid-filter-server"

export type { DataGridQuery } from "@/components/data-grid/data-grid-filter-server"

export interface DataGridPage<TData> {
  rows: TData[]
  total: number
}

export interface DataGridColumnPreference {
  columnId: string
  orderRank: number
  pinPosition: "start" | "end" | null
}

export interface DataGridRowMove {
  rowId: string
  previousRowId: string | null
  nextRowId: string | null
}

export interface DataGridFeatureDataSource<TData extends { id: string }> {
  mode: "client" | "server"
  getRows: (query: DataGridQuery) => Promise<DataGridPage<TData>>
  getRowPinning: () => Promise<RowPinningState>
  getColumnState: () => Promise<DataGridColumnPreference[]>
  updateRow: (rowId: string, nextRow: TData) => Promise<void>
  reorderRows: (move: DataGridRowMove) => Promise<void>
  saveRowPinning: (state: RowPinningState) => Promise<void>
  saveColumnState: (state: readonly DataGridColumnPreference[]) => Promise<void>
}
