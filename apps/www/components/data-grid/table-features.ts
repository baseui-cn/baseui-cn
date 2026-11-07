import {
  columnFacetingFeature,
  columnFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createExpandedRowModel,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  globalFilteringFeature,
  filterFns,
  sortFns,
  rowExpandingFeature,
  rowPaginationFeature,
  rowPinningFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  type Cell,
  type CellData,
  type Column,
  type ColumnDef,
  type Header,
  type HeaderGroup,
  type Row,
  type RowData,
  type Table,
} from "@tanstack/react-table"

export const dataGridFeatures = tableFeatures({
  columnFacetingFeature,
  columnFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  globalFilteringFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowPinningFeature,
  rowSelectionFeature,
  rowSortingFeature,
  expandedRowModel: createExpandedRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  // Preserve the built-in auto/named sorting and filtering supported by v8.
  filterFns,
  sortFns,
})

export type DataGridFeatures = typeof dataGridFeatures

export type DataGridTable<TData extends RowData> = Table<DataGridFeatures, TData>
export type DataGridColumn<TData extends RowData, TValue = unknown> = Column<
  DataGridFeatures,
  TData,
  TValue
>
export type DataGridColumnDef<TData extends RowData, TValue extends CellData = CellData> =
  ColumnDef<DataGridFeatures, TData, TValue>
export type DataGridCell<TData extends RowData, TValue extends CellData = CellData> = Cell<
  DataGridFeatures,
  TData,
  TValue
>
export type DataGridRow<TData extends RowData> = Row<DataGridFeatures, TData>
export type DataGridHeader<TData extends RowData, TValue extends CellData = CellData> = Header<
  DataGridFeatures,
  TData,
  TValue
>
export type DataGridHeaderGroup<TData extends RowData> = HeaderGroup<DataGridFeatures, TData>
