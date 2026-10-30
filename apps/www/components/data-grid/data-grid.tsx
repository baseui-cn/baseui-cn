"use client"

import { createContext, type ReactNode, useContext, useMemo, useRef } from "react"
import {
  type CellData,
  type ColumnFiltersState,
  type RowData,
  type SortingState,
  type TableFeatures,
} from "@tanstack/react-table"
import { ChevronDownIcon, CircleHelpIcon, Settings2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

import "@/styles/data.styles.css"
import type { DataGridColumn, DataGridTable } from "@/components/data-grid/table-features"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type DataGridEditorKind =
  | "text"
  | "email"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "radio"
  | "checkbox"
  | "switch"
  | "rating"

export interface DataGridEditorOption<TValue = unknown> {
  label: string
  value: TValue
  description?: string
  disabled?: boolean
}

export interface DataGridColumnEditorRenderProps<
  TData extends RowData = RowData,
  TValue = unknown,
> {
  table: DataGridTable<TData>
  row: TData
  rowId: string
  columnId: string
  value: TValue
  setValue: (value: TValue) => void
  commit: (value?: TValue) => Promise<boolean>
  cancel: () => void
  navigate?: (direction: "next" | "previous") => void
  isEditing: boolean
  isPending: boolean
  error?: string | null
  editor: DataGridColumnEditor<TData, TValue>
}

export interface DataGridColumnEditor<TData extends RowData = RowData, TValue = unknown> {
  kind: DataGridEditorKind
  label?: string
  placeholder?: string
  description?: string
  options?: DataGridEditorOption<TValue>[]
  required?: boolean
  min?: number
  max?: number
  step?: number
  dialogOnly?: boolean
  inlineOnly?: boolean
  parse?: (value: unknown, row: TData) => TValue
  validate?: (value: TValue, row: TData) => string | null | undefined
  renderInline?: (props: DataGridColumnEditorRenderProps<TData, TValue>) => ReactNode
  renderDialog?: (props: DataGridColumnEditorRenderProps<TData, TValue>) => ReactNode
}

export interface DataGridEditingTableMeta<TData extends RowData = RowData> {
  activeCell: { rowId: string; columnId: string } | null
  dialogOpen: boolean
  dialogRow: TData | null
  dialogRowId: string | null
  dialogDraft: Partial<TData> | null
  dialogErrors: Record<string, string | undefined>
  dialogMessage: string | null
  startCellEdit: (row: TData, columnId: string) => void
  cancelCellEdit: (rowId?: string, columnId?: string) => void
  updateCellDraft: (rowId: string, columnId: string, value: unknown) => void
  commitCellEdit: (row: TData, columnId: string, value?: unknown) => Promise<boolean>
  isCellEditing: (rowId: string, columnId: string) => boolean
  isCellPending: (rowId: string, columnId: string) => boolean
  getCellDraftValue: (row: TData, columnId: string) => unknown
  getCellError: (rowId: string, columnId: string) => string | undefined
  openDialog: (row: TData) => void
  closeDialog: () => void
  updateDialogDraft: (columnId: string, value: unknown) => void
  saveDialog: () => Promise<boolean>
  getDialogValue: (columnId: string) => unknown
  getDialogError: (columnId: string) => string | undefined
  clearDialogMessage: () => void
  isRowPending: (rowId: string) => boolean
  isGridPending: () => boolean
}

declare module "@tanstack/react-table" {
  interface ColumnMeta<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  > {
    headerTitle?: string
    headerClassName?: string
    cellClassName?: string
    skeleton?: ReactNode
    expandedContent?: (row: TData) => ReactNode
    editor?: DataGridColumnEditor<TData, TValue>
  }

  interface TableMeta<TFeatures extends TableFeatures, TData extends RowData> {
    editing?: DataGridEditingTableMeta<TData>
  }
}

/** Label for headers / column visibility: `meta.headerTitle`, string `columnDef.header`, or `column.id`. */
export function getColumnHeaderLabel<TData extends RowData, TValue>(
  column: DataGridColumn<TData, TValue>
): string {
  const meta = column.columnDef.meta as { headerTitle?: string } | undefined
  if (typeof meta?.headerTitle === "string") return meta.headerTitle
  const defHeader = column.columnDef.header
  if (typeof defHeader === "string") return defHeader
  return String(column.id)
}

export function getDataGridColumnEditor<TData extends RowData, TValue>(
  column: DataGridColumn<TData, TValue>
): DataGridColumnEditor<TData, TValue> | undefined {
  return column.columnDef.meta?.editor as DataGridColumnEditor<TData, TValue> | undefined
}

export type DataGridApiFetchParams = {
  pageIndex: number
  pageSize: number
  sorting?: SortingState
  filters?: ColumnFiltersState
  searchQuery?: string
}

export type DataGridApiResponse<T> = {
  data: T[]
  empty: boolean
  pagination: {
    total: number
    page: number
  }
}

export interface DataGridContextProps<TData extends RowData> {
  props: Omit<DataGridProps<TData>, "featureControls">
  table: DataGridTable<TData>
  recordCount: number
  isLoading: boolean
  scrollToRowRef: { current: ((rowId: string) => void) | null }
}

export type DataGridRequestParams = {
  pageIndex: number
  pageSize: number
  sorting?: SortingState
  columnFilters?: ColumnFiltersState
}

export interface DataGridFeatureControl<TFeature extends string = string> {
  id: TFeature
  label: string
  checked: boolean
}

export interface DataGridFeatureControlsConfig<TFeature extends string = string> {
  features: readonly DataGridFeatureControl<TFeature>[]
  onFeatureChange: (feature: TFeature, checked: boolean) => void
  label?: string
  helpText?: string
  className?: string
}

export interface DataGridProps<TData extends RowData, TFeature extends string = string> {
  className?: string
  table?: DataGridTable<TData>
  recordCount: number
  children?: ReactNode
  featureControls?: DataGridFeatureControlsConfig<TFeature>
  onRowClick?: (row: TData) => void
  isLoading?: boolean
  loadingMode?: "skeleton" | "spinner"
  loadingMessage?: ReactNode | string
  fetchingMoreMessage?: ReactNode | string
  allRowsLoadedMessage?: ReactNode | string
  emptyMessage?: ReactNode | string
  tableLayout?: {
    dense?: boolean
    cellBorder?: boolean
    rowBorder?: boolean
    rowRounded?: boolean
    stripped?: boolean
    headerBackground?: boolean
    headerBorder?: boolean
    headerSticky?: boolean
    width?: "auto" | "fixed"
    columnsVisibility?: boolean
    columnsResizable?: boolean
    columnsResizeMode?: "onChange" | "onEnd"
    columnsPinnable?: boolean
    columnsMovable?: boolean
    columnsDraggable?: boolean
    rowsDraggable?: boolean
    rowsPinnable?: boolean
  }
  tableClassNames?: {
    base?: string
    header?: string
    headerRow?: string
    headerSticky?: string
    body?: string
    bodyRow?: string
    footer?: string
    edgeCell?: string
  }
}

// The generic data type is rebound by useDataGrid at the context boundary.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ErasedDataGridContextProps = DataGridContextProps<any>
type ErasedDataGridRowData = ErasedDataGridContextProps["table"] extends DataGridTable<
  infer TData
>
  ? TData
  : never

const DataGridContext = createContext<ErasedDataGridContextProps | undefined>(undefined)

/** Internal bridge for keyboard navigation into an unmounted virtual row. */
export function useDataGridNavigation() {
  const context = useContext(DataGridContext)
  return { scrollToRowRef: context?.scrollToRowRef, rowsPinnable: context?.props.tableLayout?.rowsPinnable }
}

function useDataGrid<TData extends RowData = ErasedDataGridRowData>(): DataGridContextProps<TData> {
  const context = useContext(DataGridContext)
  if (!context) {
    throw new Error("useDataGrid must be used within a DataGridProvider")
  }
  return context as DataGridContextProps<TData>
}

function DataGridProvider<TData extends RowData>({
  children,
  table,
  ...props
}: Omit<DataGridProps<TData>, "featureControls"> & { table: DataGridTable<TData> }) {
  const scrollToRowRef = useRef<((rowId: string) => void) | null>(null)
  // Keep the Grid resize mode authoritative, including after consumer option updates.
  if (props.tableLayout?.columnsResizable) {
    const columnResizeMode = props.tableLayout.columnsResizeMode ?? "onEnd"
    table.setOptions((options) => ({ ...options, columnResizeMode }))
    table.options.columnResizeMode = columnResizeMode
  }
  const tableState = table.store.state
  const tableLayoutKey = JSON.stringify(props.tableLayout)
  const tableClassNamesKey = JSON.stringify(props.tableClassNames)

  // Memoize context value so consumers don't re-render during column resize.
  // Column sizing state is intentionally excluded from deps -- CSS variables
  // on the <table> element handle width updates without React re-renders.
  const value = useMemo(
    () => ({
      props,
      table,
      recordCount: props.recordCount,
      isLoading: props.isLoading || false,
      scrollToRowRef,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      table,
      props.recordCount,
      props.isLoading,
      props.loadingMode,
      props.loadingMessage,
      props.fetchingMoreMessage,
      props.allRowsLoadedMessage,
      props.emptyMessage,
      props.onRowClick,
      props.className,
      tableLayoutKey,
      tableClassNamesKey,
      tableState.sorting,
      tableState.pagination,
      tableState.columnFilters,
      tableState.rowSelection,
      tableState.expanded,
      tableState.columnVisibility,
      tableState.columnOrder,
      tableState.columnPinning,
      tableState.rowPinning,
      table.options.data,
      table.options.meta,
      tableState.globalFilter,
    ]
  )

  return (
    <DataGridContext.Provider value={value as ErasedDataGridContextProps}>
      {children}
    </DataGridContext.Provider>
  )
}

function DataGrid<TData extends RowData, TFeature extends string = string>({
  children,
  table,
  ...props
}: DataGridProps<TData, TFeature>) {
  const defaultProps: Partial<DataGridProps<TData, TFeature>> = {
    loadingMode: "skeleton",
    tableLayout: {
      dense: false,
      cellBorder: false,
      rowBorder: true,
      rowRounded: false,
      stripped: false,
      headerSticky: false,
      headerBackground: true,
      headerBorder: true,
      width: "fixed",
      columnsVisibility: false,
      columnsResizable: false,
      columnsResizeMode: "onEnd",
      columnsPinnable: false,
      columnsMovable: false,
      columnsDraggable: false,
      rowsDraggable: false,
      rowsPinnable: false,
    },
    tableClassNames: {
      base: "",
      header: "",
      headerRow: "",
      headerSticky: "sticky top-0 z-15 bg-background",
      body: "",
      bodyRow: "",
      footer: "",
      edgeCell: "",
    },
  }

  const mergedProps: DataGridProps<TData, TFeature> = {
    ...defaultProps,
    ...props,
    tableLayout: {
      ...defaultProps.tableLayout,
      ...(props.tableLayout || {}),
    },
    tableClassNames: {
      ...defaultProps.tableClassNames,
      ...(props.tableClassNames || {}),
    },
  }

  // Ensure table is provided
  if (!table) {
    throw new Error('DataGrid requires a "table" prop')
  }

  const { featureControls, ...providerProps } = mergedProps

  return (
    <DataGridProvider table={table} {...providerProps}>
      {featureControls && <DataGridFeatureControls {...featureControls} />}
      {children}
    </DataGridProvider>
  )
}

function DataGridFeatureControls<TFeature extends string>({
  features,
  onFeatureChange,
  label = "Table features",
  helpText = "Enable or disable features to customize the table.",
  className,
}: DataGridFeatureControlsConfig<TFeature>) {
  const featureGroups = [
    { label: "Filtering", ids: ["excelFilters"] },
    { label: "Rows", ids: ["rowPinning", "rowReordering"] },
    { label: "Columns", ids: ["columnPinning", "columnReordering", "columnDragAndDrop"] },
    { label: "Editing", ids: ["inlineEditing"] },
  ]
  const groupedFeatures = featureGroups
    .map((group) => ({
      ...group,
      features: features.filter((feature) => group.ids.includes(feature.id)),
    }))
    .filter((group) => group.features.length > 0)
  const groupedIds = new Set(
    groupedFeatures.flatMap((group) => group.features.map((feature) => feature.id))
  )
  const ungroupedFeatures = features.filter((feature) => !groupedIds.has(feature.id))

  return (
    <div className={cn("flex items-center gap-1.5 border-b px-4 py-3", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="sm">
              <Settings2Icon aria-hidden="true" />
              {label}
              <ChevronDownIcon aria-hidden="true" />
            </Button>
          }
        />
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-2 pb-1">
              <span>{label}</span>
            </DropdownMenuLabel>
            {groupedFeatures.map((group, index) => (
              <div key={group.label}>
                {index > 0 && <DropdownMenuSeparator />}
                <div className="px-2 pb-1 pt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {group.label}
                </div>
                <div className="space-y-0.5">
                  {group.features.map((feature) => (
                    <DropdownMenuCheckboxItem
                      key={feature.id}
                      checked={feature.checked}
                      onSelect={(event) => event.preventDefault()}
                      onCheckedChange={(checked) => onFeatureChange(feature.id, checked)}
                    >
                      {feature.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
              </div>
            ))}
            {ungroupedFeatures.length > 0 && (
              <>
                {groupedFeatures.length > 0 && <DropdownMenuSeparator />}
                <div className="space-y-0.5 pt-1">
                  {ungroupedFeatures.map((feature) => (
                    <DropdownMenuCheckboxItem
                      key={feature.id}
                      checked={feature.checked}
                      onSelect={(event) => event.preventDefault()}
                      onCheckedChange={(checked) => onFeatureChange(feature.id, checked)}
                    >
                      {feature.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
              </>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button variant="ghost" size="icon-sm" aria-label={`About ${label.toLowerCase()}`}>
                <CircleHelpIcon aria-hidden="true" />
              </Button>
            }
          />
          <TooltipContent>{helpText}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

function DataGridContainer({
  children,
  className,
  border = true,
}: {
  children: ReactNode
  className?: string
  border?: boolean
}) {
  return (
    <div
      data-slot="data-grid"
      className={cn(
        "w-full overflow-hidden",
        border && "border-border rounded-[var(--radius)] border",
        className
      )}
    >
      {children}
    </div>
  )
}

export { useDataGrid, DataGridProvider, DataGrid, DataGridContainer }
