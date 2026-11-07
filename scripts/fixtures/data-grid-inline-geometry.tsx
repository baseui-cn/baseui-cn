import { useEffect, useMemo, useRef, useState } from "react"
import { DirectionProvider } from "@base-ui/react/direction-provider"
import { useTable } from "@tanstack/react-table"
import { DataGrid, DataGridContainer, type DataGridColumnEditor } from "@/components/data-grid/data-grid"
import { DataGridEditableCell } from "@/components/data-grid/data-grid-editing"
import { DataGridTable } from "@/components/data-grid/data-grid-table"
import { DataGridTableVirtual } from "@/components/data-grid/data-grid-table-virtual"
import { DataGridTableDndCombined } from "@/components/data-grid/data-grid-table-dnd-combined"
import { DataGridScrollArea } from "@/components/data-grid/data-grid-scroll-area"
import { dataGridFeatures, type DataGridColumnDef } from "@/components/data-grid/table-features"
import { useEditableDataGrid } from "@/hooks/use-editable-data-grid"
import { Input } from "@/components/ui/input"

type RecordRow = { id: string; name: string; age: number; status: string; date: string; enabled: boolean; checked: boolean; custom: string }
const seed = (): RecordRow[] => Array.from({ length: 3 }, (_, i) => ({ id: `record-${i}`, name: `Record ${i}`, age: 10 + i, status: "Active", date: "2026-10-29", enabled: false, checked: true, custom: "Custom value" }))
const editors: Record<string, DataGridColumnEditor<RecordRow, unknown>> = {
  name: { kind: "text", label: "Name", required: true },
  age: { kind: "number", label: "Age", min: 0, max: 100, required: true },
  status: { kind: "select", label: "Status", options: [{ label: "Active", value: "Active" }, { label: "Away", value: "Away" }] },
  date: { kind: "date", label: "Date" },
  enabled: { kind: "switch", label: "Enabled" },
  checked: { kind: "checkbox", label: "Checked" },
  custom: { kind: "text", label: "Custom", renderInline: (props) => props.isEditing
    ? <Input aria-label="Custom" autoFocus className="h-24 min-h-24" value={String(props.value)}
        onChange={event => props.setValue(event.target.value)} onKeyDown={event => { if (event.key === "Escape") props.cancel() }} />
    : <button className="px-2 py-1" onClick={() => props.table.options.meta?.editing?.startCellEdit(props.row, props.columnId)}>Custom value</button> },
}

export default function GeometryFixture() {
  const query = new URLSearchParams(window.location.search)
  const rtl = query.get("rtl") === "1", dark = query.get("dark") === "1"
  const shape = query.get("shape") ?? "default", renderer = query.get("renderer") ?? "basic"
  const late = query.get("late") === "1"
  const [editingEnabled, setEditingEnabled] = useState(!late)
  const [rows, setRows] = useState(seed)
  const gate = useRef({ hold: false, reject: false, release: [] as (() => void)[] })
  const editing = useEditableDataGrid({ data: rows, setData: setRows, getRowId: row => row.id,
    editorColumns: Object.entries(editors).map(([id, editor]) => ({ id, editor })),
    onSaveCell: async ({ nextRow }) => {
      if (gate.current.hold) await new Promise<void>(resolve => gate.current.release.push(resolve))
      if (gate.current.reject) throw Error("Server rejected this edit")
      return nextRow
    },
  })
  const columns = useMemo<DataGridColumnDef<RecordRow>[]>(() => {
    const definitions: DataGridColumnDef<RecordRow>[] = [
    ...Object.entries(editors).map(([id, editor]): DataGridColumnDef<RecordRow> => ({
      id, accessorKey: id, header: editor.label, size: id === "date" ? 210 : id === "enabled" || id === "checked" ? 110 : 180,
      meta: { editor, headerTitle: editor.label, cellClassName: shape === "padded" ? "py-3" : undefined },
      cell: ({ cell }) => <DataGridEditableCell cell={cell} />,
    })),
    { id: "consumer", header: "Consumer geometry", size: 180, cell: () => <div style={{ minHeight: shape === "tall" ? 64 : undefined, whiteSpace: "normal" }}>{shape === "wrapped" ? "Consumer content wraps over several lines and owns the row geometry." : "Reference"}</div> },
    ]
    return late ? definitions.filter(column => column.id === "name") : definitions
  }, [shape, late])
  const table = useTable({ features: dataGridFeatures, data: rows, columns, getRowId: row => row.id,
    columnResizeDirection: rtl ? "rtl" : "ltr", meta: { editing: editingEnabled ? editing : undefined },
  })
  useEffect(() => {
    document.documentElement.dir = rtl ? "rtl" : "ltr"
    document.documentElement.classList.toggle("dark", dark)
    Object.assign(window, { geometryGrid: { table, editing, rows,
      enableEditing: () => setEditingEnabled(true),
      hold: (reject = false) => { gate.current.hold = true; gate.current.reject = reject },
      release: () => { gate.current.hold = false; gate.current.release.splice(0).forEach(resolve => resolve()) },
      accept: () => { gate.current.reject = false },
    } })
  })
  return <DirectionProvider direction={rtl ? "rtl" : "ltr"}><main className="min-w-0 p-3">
    <h1 className="mb-3 text-xl font-semibold">Shared inline editor geometry</h1>
    <DataGridContainer><DataGrid table={table} recordCount={rows.length}
      loadingMode={query.get("loading") === "spinner" ? "spinner" : "skeleton"}
      tableLayout={{ columnsResizable: true, dense: shape === "dense" }}>
      <DataGridScrollArea className="h-[420px]">
        {renderer === "virtual" ? <DataGridTableVirtual height={420} /> : renderer === "combined" ? <DataGridTableDndCombined /> : <DataGridTable />}
      </DataGridScrollArea>
    </DataGrid></DataGridContainer>
  </main></DirectionProvider>
}
