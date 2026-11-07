import { useEffect, useMemo, useState } from "react"
import { useTable } from "@tanstack/react-table"
import AcceptanceApp from "./data-grid-v9"
import GeometryFixture from "./data-grid-inline-geometry"
import { DataGrid, DataGridContainer, type DataGridColumnEditor } from "@/components/data-grid/data-grid"
import { DataGridTable } from "@/components/data-grid/data-grid-table"
import { DataGridTableVirtual } from "@/components/data-grid/data-grid-table-virtual"
import { DataGridEditableCell, DataGridEditDialog } from "@/components/data-grid/data-grid-editing"
import { DataGridInlineEditor } from "@/components/data-grid/data-grid-inline-editor"
import { dataGridFeatures, type DataGridCell, type DataGridColumnDef } from "@/components/data-grid/table-features"
import { useEditableDataGrid } from "@/hooks/use-editable-data-grid"
import { createMockStaffDataSource, type StaffMember } from "@/hooks/data-grid-features-data"
import { DataGridFeaturesPreview } from "@/components/previews/data-grid/c-data-grid-features"

type RecordRow = { id: string; a: string; b: string; c: string; age: number; status: string | null }
const seed: RecordRow = { id: "one", a: "Alpha", b: "Beta", c: "Gamma", age: 42, status: "Active" }
const editors: Record<string, DataGridColumnEditor<RecordRow, unknown>> = {
  a: { kind: "text", label: "A" }, b: { kind: "text", label: "B" }, c: { kind: "text", label: "C" },
  age: { kind: "number", label: "Age", min: 20, max: 500 },
  status: { kind: "select", label: "Status", options: [
    { label: "Active", value: "Active" }, { label: "Unavailable", value: "Away", disabled: true }, { label: "No status", value: null },
  ] },
}
const renderCounts = { cells: 0 }
function CountedCell({ cell }: { cell: DataGridCell<RecordRow, unknown> }) {
  renderCounts.cells++
  return <DataGridEditableCell cell={cell} />
}

function DynamicGrid({ mode }: { mode: string }) {
  const [rows, setRows] = useState([seed])
  const [variant, setVariant] = useState(false)
  const [delay, setDelay] = useState(0)
  const [reject, setReject] = useState(false)
  const [rtl, setRtl] = useState(false)
  const [resizeMode, setResizeMode] = useState<"onEnd" | "onChange">("onEnd")
  const [savedDrafts, setSavedDrafts] = useState<Partial<RecordRow>[]>([])
  const columns = useMemo<DataGridColumnDef<RecordRow>[]>(() => {
    const keys = mode === "options" ? ["age", "status"] : ["a", "b", ...(variant ? ["c"] : [])]
    return keys.map((id, index) => ({
      id, accessorKey: id, header: editors[id].label, size: (index + 1) * 100, minSize: 20, maxSize: 500,
      meta: { editor: editors[id], headerTitle: editors[id].label }, cell: ({ cell }) => <CountedCell cell={cell} />,
    }))
  }, [variant, mode])
  const editing = useEditableDataGrid({
    data: rows, setData: setRows, getRowId: (row) => row.id,
    editorColumns: columns.map((column) => ({ id: column.id!, editor: editors[column.id!] })),
    onSaveCell: async ({ nextRow }) => { await new Promise((resolve) => setTimeout(resolve, delay)); if (reject) throw Error("Save rejected"); return nextRow },
    onSaveRow: async ({ nextRow, draft }) => {
      setSavedDrafts((value) => [...value, draft])
      await new Promise((resolve) => setTimeout(resolve, delay))
      if (reject) throw Error("Dialog rejected")
      return nextRow
    },
  })
  const options = { features: dataGridFeatures, data: rows, columns, getRowId: (row: RecordRow) => row.id,
    meta: { editing }, columnResizeDirection: rtl ? "rtl" as const : "ltr" as const }
  const table = useTable(mode === "frozen" ? Object.freeze(options) : options)
  useEffect(() => { Object.assign(window, { regressionGrid: { table, editing, rows, setRows, setVariant, setDelay, setReject, setRtl, setResizeMode, savedDrafts, renderCounts } }) })
  return <div dir={rtl ? "rtl" : "ltr"}>
    <DataGridContainer><DataGrid table={table} recordCount={rows.length} tableLayout={{ columnsResizable: true, columnsPinnable: true, columnsResizeMode: resizeMode }}>
      {mode === "virtual-disabled" ? <DataGridTableVirtual virtualizerOptions={{ enabled: false }} /> : <DataGridTable />}
      <DataGridEditDialog table={table} />
    </DataGrid></DataGridContainer>
  </div>
}

function Standalone({ text = false, date = false }: { text?: boolean; date?: boolean }) {
  const [value, setValue] = useState<string | null>(date ? "2026-10-29" : text ? "Alpha" : "Active")
  const [cancels, setCancels] = useState(0)
  const [commits, setCommits] = useState(0)
  useEffect(() => { Object.assign(window, { regressionInline: { value, cancels, commits } }) })
  return <DataGridInlineEditor value={value} label={date ? "Standalone date" : text ? "Standalone text" : "Standalone status"}
    editorType={date ? "date" : text ? "text" : "select"}
    options={[{ label: "Active", value: "Active" }, { label: "Unavailable", value: "Away", disabled: true }, { label: "No status", value: null }]}
    onCommit={(nextValue) => { setCommits(count => count + 1); setValue(nextValue) }}
    onCancel={() => setCancels(count => count + 1)} />
}

interface PendingCall { value: unknown; resolve: () => void; reject: (error: Error) => void }
function Preferences() {
  const [version, setVersion] = useState(0)
  const probe = useMemo(() => ({ columns: [] as PendingCall[], pinning: [] as PendingCall[], reorder: [] as PendingCall[] }), [])
  const base = useMemo(() => createMockStaffDataSource(), [])
  const source = useMemo(() => {
    const pause = (calls: PendingCall[], value: unknown) => new Promise<void>((resolve, reject) => calls.push({ value, resolve, reject }))
    return { ...base,
      async saveColumnState(value: Parameters<typeof base.saveColumnState>[0]) { await pause(probe.columns, value); await base.saveColumnState(value) },
      async saveRowPinning(value: Parameters<typeof base.saveRowPinning>[0]) { await pause(probe.pinning, value); await base.saveRowPinning(value) },
      async reorderRows(value: Parameters<typeof base.reorderRows>[0]) { await pause(probe.reorder, value); await base.reorderRows(value) },
    }
    // A new adapter identity explicitly exercises the source-change boundary.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, probe, version])
  useEffect(() => { Object.assign(window, { preferenceProbe: { ...probe, reloadSource: () => setVersion((v) => v + 1), updateRow: (id: string, row: StaffMember) => base.updateRow(id, row) } }) })
  return <DataGridFeaturesPreview dataSource={source} />
}

export default function RegressionApp() {
  const mode = new URLSearchParams(window.location.search).get("mode") ?? "acceptance"
  if (mode === "acceptance") return <AcceptanceApp />
  if (mode === "geometry") return <GeometryFixture />
  return <main><h1>Data Grid regression verification</h1>
    {mode === "preferences" ? <Preferences /> : mode.startsWith("inline") ? <Standalone text={mode === "inline-text"} date={mode === "inline-date"} /> : <DynamicGrid mode={mode} />}
  </main>
}
