// External-consumer acceptance harness. Copy as src/App.tsx after real CLI init/add.
import { useEffect, useMemo, useState } from "react"
import { DirectionProvider } from "@base-ui/react/direction-provider"
import { useTable, type ColumnOrderState, type ColumnPinningState, type RowPinningState } from "@tanstack/react-table"
import { arrayMove } from "@dnd-kit/sortable"
import type { DragEndEvent } from "@dnd-kit/core"
import { DataGrid, DataGridContainer } from "@/components/data-grid/data-grid"
import type { DataGridColumnEditor } from "@/components/data-grid/data-grid"
import { dataGridFeatures, type DataGridColumnDef } from "@/components/data-grid/table-features"
import { DataGridColumnHeader } from "@/components/data-grid/data-grid-column-header"
import { DataGridActiveFilters } from "@/components/data-grid/data-grid-filter-menu"
import { createExcelFilterFn } from "@/components/data-grid/data-grid-filter-client"
import { DataGridEditableCell, DataGridEditDialog } from "@/components/data-grid/data-grid-editing"
import { DataGridTable, DataGridTableRowPin, DataGridTableRowSelect, DataGridTableRowSelectAll } from "@/components/data-grid/data-grid-table"
import { DataGridTableVirtual } from "@/components/data-grid/data-grid-table-virtual"
import { DataGridTableDndCombined, DataGridTableDndCombinedRowHandle } from "@/components/data-grid/data-grid-table-dnd-combined"
import { DataGridTableDnd } from "@/components/data-grid/data-grid-table-dnd"
import { DataGridTableDndRows, DataGridTableDndRowHandle } from "@/components/data-grid/data-grid-table-dnd-rows"
import { DataGridPagination } from "@/components/data-grid/data-grid-pagination"
import { DataGridScrollArea } from "@/components/data-grid/data-grid-scroll-area"
import { DataGridColumnVisibility } from "@/components/data-grid/data-grid-column-visibility"
import { useEditableDataGrid } from "@/hooks/use-editable-data-grid"
import { useDataGridFeatureData } from "@/hooks/use-data-grid-feature-data"
import type { DataGridFeatureDataSource, DataGridQuery } from "@/types/data-grid-data-source"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

type Person = { id: string; name: string; age: number; status: string; date: string; active: boolean; enabled: boolean; rating: number; notes: string }
type Mode = "basic" | "virtual" | "combined" | "rows" | "columns"
const seed = (count: number): Person[] => Array.from({ length: count }, (_, index) => ({
  // Deliberately collide a row ID with a column ID to exercise combined DnD namespaces.
  id: index === 0 ? "name" : `row-${index}`, name: `Person ${String(index).padStart(4, "0")}`,
  age: index, status: index % 2 ? "Active" : "Away", date: index % 2 ? "2024-02-29" : "2026-10-29",
  active: true, enabled: false, rating: 3, notes: "Dialog-only notes",
}))
const editors: Record<string, DataGridColumnEditor<Person, unknown>> = {
  name: { kind: "text", label: "Name", required: true },
  age: { kind: "number", label: "Age", min: 0, max: 1000, required: true },
  status: { kind: "select", label: "Status", options: [{ label: "Active", value: "Active" }, { label: "Away", value: "Away" }] },
  date: { kind: "date", label: "Date" },
  active: { kind: "checkbox", label: "Active" }, enabled: { kind: "switch", label: "Enabled" },
  rating: { kind: "rating", label: "Rating" },
  notes: { kind: "textarea", label: "Notes", dialogOnly: true },
}

const initialSource: DataGridFeatureDataSource<{ id: string }> = {
  mode: "client", getRows: async () => ({ rows: [], total: 0 }),
  getColumnState: async () => [], getRowPinning: async () => ({ top: [], bottom: [] }),
  updateRow: async () => {}, reorderRows: async () => {},
  saveColumnState: async () => {}, saveRowPinning: async () => {},
}

function SourceHarness() {
  const [source, setSource] = useState(initialSource)
  const [query, setQuery] = useState<DataGridQuery>({ pagination: { pageIndex: 0, pageSize: 10 }, sorting: [], columnFilters: [] })
  const result = useDataGridFeatureData({ dataSource: source, query })
  useEffect(() => { Object.assign(window, { sourceAcceptance: { ...result, setSource, setQuery, initialSource } }) })
  return <output aria-label="Data source state">Source rows {result.rows.length}</output>
}

export default function App() {
  const [rows, setRows] = useState(() => seed(500))
  const [mode, setMode] = useState<Mode>("virtual")
  const [resizeMode, setResizeMode] = useState<"onEnd" | "onChange">("onEnd")
  const [rtl, setRtl] = useState(false)
  const [dark, setDark] = useState(false)
  const [reject, setReject] = useState(false)
  const [delay, setDelay] = useState(80)
  const [fetching, setFetching] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [fetchError, setFetchError] = useState(false)
  const [feature, setFeature] = useState(true)
  const [order, setOrder] = useState<ColumnOrderState>(["actions", "name", "age", "status", "date", "active", "enabled", "rating", "notes"])
  const [pinning, setPinning] = useState<ColumnPinningState>({ start: [], end: [] })
  const [rowPinning, setRowPinning] = useState<RowPinningState>({ top: [], bottom: [] })
  const [events, setEvents] = useState<string[]>([])
  const editing = useEditableDataGrid({ data: rows, setData: setRows, getRowId: (row) => row.id,
    editorColumns: Object.entries(editors).map(([id, editor]) => ({ id, editor })),
    onSaveCell: async ({ nextRow }) => {
      await new Promise((resolve) => setTimeout(resolve, delay))
      if (reject) throw new Error("Server rejected this edit")
      return nextRow
    },
    onSaveRow: async ({ nextRow }) => {
      await new Promise((resolve) => setTimeout(resolve, delay))
      if (reject) throw new Error("Server rejected this record")
      return nextRow
    },
  })
  const columns = useMemo<DataGridColumnDef<Person>[]>(() => [
    { id: "actions", size: 165, enableSorting: false,
      header: () => <DataGridTableRowSelectAll />,
      cell: ({ row }) => <div className="flex items-center gap-1">
        <DataGridTableRowSelect row={row} /><DataGridTableRowPin row={row} />
        {mode === "combined" && <DataGridTableDndCombinedRowHandle />}
        {mode === "rows" && <DataGridTableDndRowHandle />}
        <Button size="sm" variant="ghost" aria-label={`Edit ${row.original.name}`} onClick={() => editing.openDialog(row.original)}>Edit</Button>
      </div>,
    },
    ...Object.entries(editors).map(([id, editor]): DataGridColumnDef<Person> => ({
      id, accessorKey: id, size: id === "name" ? 240 : id === "date" ? 220 : 160,
      header: ({ column }) => <DataGridColumnHeader column={column} title={editor.label} filterType={id === "name" ? "text" : id === "age" ? "number" : id === "date" ? "date" : undefined} visibility />,
      meta: { headerTitle: editor.label, editor }, filterFn: createExcelFilterFn<Person>(),
      cell: ({ cell }) => <DataGridEditableCell cell={cell} />,
    })),
  ], [mode, editing.openDialog])
  const table = useTable({ features: dataGridFeatures, data: rows, columns, getRowId: (row) => row.id,
    initialState: { pagination: { pageIndex: 0, pageSize: 500 } },
    state: { columnOrder: order, columnPinning: pinning, rowPinning },
    onColumnOrderChange: setOrder, onColumnPinningChange: setPinning, onRowPinningChange: setRowPinning,
    columnResizeDirection: rtl ? "rtl" : "ltr", enableRowSelection: true, enableRowPinning: true,
    meta: { editing },
  })
  const rowDrag = ({ active, over }: DragEndEvent) => {
    if (!over) return
    setEvents((value) => [...value, `row:${active.id}->${over.id}`])
    setRows((value) => arrayMove(value, value.findIndex((row) => row.id === active.id), value.findIndex((row) => row.id === over.id)))
  }
  const columnDrag = ({ active, over }: DragEndEvent) => {
    if (!over) return
    setEvents((value) => [...value, `column:${active.id}->${over.id}`])
    setOrder((value) => arrayMove(value, value.indexOf(String(active.id)), value.indexOf(String(over.id))))
  }
  useEffect(() => {
    document.documentElement.dir = rtl ? "rtl" : "ltr"
    document.documentElement.classList.toggle("dark", dark)
  }, [rtl, dark])
  useEffect(() => {
    // Explicit test API for model and async-race assertions; UI is exercised separately.
    Object.assign(window, { gridAcceptance: { table, editing, rows, events, setResizeMode, setRows, setDelay, setReject, setHasMore, setFetching, setFetchError } })
  })
  const loadMore = () => {
    if (fetchError) { setFetching(false); return }
    setFetching(true)
    setTimeout(() => { setRows((value) => [...value, ...seed(50).map((row, index) => ({ ...row, id: `more-${index}`, name: `More ${index}` }))]); setFetching(false); setHasMore(false) }, 100)
  }
  return <DirectionProvider direction={rtl ? "rtl" : "ltr"}>
    <main className="min-w-0 p-3">
      <h1 className="mb-3 text-xl font-semibold">Data Grid v9 consumer acceptance</h1>
      <div className="mb-3 flex flex-wrap gap-2" aria-label="Acceptance controls">
        {(["basic", "virtual", "combined", "rows", "columns"] as Mode[]).map((value) => <Button key={value} variant="outline" onClick={() => { setMode(value); table.setPageSize(value === "virtual" ? 500 : 10) }}>{value}</Button>)}
        <Button onClick={() => setRtl((value) => !value)}>Toggle RTL</Button>
        <Button onClick={() => setDark((value) => !value)}>Toggle dark</Button>
        <Button onClick={() => setRows((value) => value.map((row) => ({ ...row })))}>Refresh data</Button>
        <Button onClick={() => setReject((value) => !value)}>Toggle server error</Button>
        <Popover><PopoverTrigger render={<Button variant="outline">Overlay popover</Button>} /><PopoverContent><Button>Popover action</Button></PopoverContent></Popover>
        <DropdownMenu><DropdownMenuTrigger render={<Button variant="outline">Overlay menu</Button>} /><DropdownMenuContent><DropdownMenuItem>Menu action</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
      </div>
      {fetchError && <div role="alert">Fetch failed <Button onClick={() => { setFetchError(false); loadMore() }}>Retry</Button></div>}
      <DataGridContainer><DataGrid table={table} recordCount={rows.length}
        featureControls={{ features: [{ id: "test", label: "Feature acceptance", checked: feature }], onFeatureChange: (_, value) => setFeature(value) }}
        tableLayout={{ columnsResizeMode: resizeMode, columnsResizable: true, columnsPinnable: true, rowsPinnable: true, columnsDraggable: mode === "combined" || mode === "columns", rowsDraggable: mode === "combined" || mode === "rows", columnsMovable: true, columnsVisibility: true, headerSticky: true }}>
        <DataGridActiveFilters /><DataGridColumnVisibility table={table} trigger={<Button variant="outline">Columns</Button>} />
        <DataGridScrollArea className="h-[420px]">
          {mode === "virtual" ? <DataGridTableVirtual height={420} hasMore={hasMore} isFetchingMore={fetching} onFetchMore={loadMore} /> :
            mode === "combined" ? <DataGridTableDndCombined onRowDragEnd={rowDrag} onColumnDragEnd={columnDrag} /> :
            mode === "rows" ? <DataGridTableDndRows dataIds={rows.map((row) => row.id)} handleDragEnd={rowDrag} /> :
            mode === "columns" ? <DataGridTableDnd handleDragEnd={columnDrag} /> : <DataGridTable />}
        </DataGridScrollArea>
        <DataGridPagination /><DataGridEditDialog table={table} />
      </DataGrid></DataGridContainer>
      <output aria-label="Feature state">Feature {String(feature)}</output>
      <output aria-label="Row count">Rows {rows.length}</output>
      <SourceHarness />
    </main>
  </DirectionProvider>
}
