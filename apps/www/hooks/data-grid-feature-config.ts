export type DataGridFeatures = {
  excelFilters: boolean
  inlineEditing: boolean
  rowPinning: boolean
  rowReordering: boolean
  columnPinning: boolean
  columnReordering: boolean
  columnDragAndDrop: boolean
}

export const defaultDataGridFeatures: DataGridFeatures = {
  excelFilters: true,
  inlineEditing: true,
  rowPinning: true,
  rowReordering: true,
  columnPinning: true,
  columnReordering: true,
  columnDragAndDrop: true,
}

export const dataGridFeatureOptions: Array<[keyof DataGridFeatures, string]> = [
  ["excelFilters", "Excel-like filters"],
  ["inlineEditing", "Inline editing"],
  ["rowPinning", "Row pinning"],
  ["rowReordering", "Row reordering"],
  ["columnPinning", "Column pinning"],
  ["columnReordering", "Column reordering"],
  ["columnDragAndDrop", "Column drag and drop"],
]
