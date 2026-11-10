# Data Grid v9 migration

Update the copied Grid source and TanStack Table major version together. Review customized
files before choosing replacement with `baseui-cn update data-grid`. Repeated add/update
preserves consumer source unless replacement is explicitly selected.

## Runtime and dependencies

Data Grid add/update requires Node 20+ and an ES2022-capable application toolchain.
The CLI itself remains available on Node 18 for other components. Mixed selections,
transitive Grid dependencies and `--all` reject atomically on Node 18.

Use `@tanstack/react-table@^9.2.8`, including for manual installation. The integration
lockfile resolves 9.3.1. Do not install an unbounded future major with this source.

## Hooks and generic types

```tsx
// Before: TanStack Table v8
import { getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"

const columns: ColumnDef<Person>[] = [/* column definitions */]
const table = useReactTable({
  data, columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
})
```

```tsx
// After: the v9 Grid contract
import { useTable } from "@tanstack/react-table"
import { dataGridFeatures, type DataGridColumnDef, type DataGridTable } from "@/components/data-grid/table-features"

const columns: DataGridColumnDef<Person>[] = [/* column definitions */]
const table: DataGridTable<Person> = useTable({ features: dataGridFeatures, data, columns })
```

`DataGridTable<Person>` binds v9's leading feature generic and corresponds to
`Table<typeof dataGridFeatures, Person>`. `DataGridColumnDef<Person, Value>` similarly
binds `ColumnDef<typeof dataGridFeatures, Person, Value>`. Use the exported Grid aliases
in wrappers rather than v8's generic arity. Row models and built-in filter/sort functions
are registered on `dataGridFeatures`, replacing v8 row-model options.

Read `table.store.state` instead of `table.getState()`, or use v9 selectors/Subscribe for
narrow subscriptions. `columnSizingInfo`/`setColumnSizingInfo` become
`columnResizing`/`setColumnResizing`; sizes remain in `columnSizing`. The Grid's resize
mode is configured with `tableLayout.columnsResizeMode`; it does not mutate the options
object supplied to `useTable`.

## Persisted pinning

V9 uses logical start/end positions. Convert a legacy physical-side preference once at
the storage boundary, with an explicit direction:

```ts
function migratePinning(saved: { left?: string[]; right?: string[] }, direction: "ltr" | "rtl") {
  return direction === "rtl"
    ? { start: saved.right ?? [], end: saved.left ?? [] }
    : { start: saved.left ?? [], end: saved.right ?? [] }
}
```

Persist a new preference schema version, such as `{ version: 2, columns, rowPinning }`,
to avoid converting it repeatedly. Use `column.pin("start" | "end" | false)`;
row pinning remains top/bottom. Column preference records use `orderRank` and
`pinPosition: "start" | "end" | null`.

## Editing and keyboard behavior

Keep stable `getRowId` values. Editing IDs address direct record properties; computed
accessors and nested keys need custom parse/render/save adapters. A display column ID
is not a nested write path.

Enter commits after text composition ends. Escape cancels. Tab/Shift+Tab commits then
moves through visible editable columns and rows without materializing virtual cells.
A delayed save can navigate only while its originating edit session still owns the
action. Pending number controls are disabled.

Dialog `onSaveRow` receives a `draft` containing only changed fields and a `nextRow`
merged against the latest record. Untouched refreshed fields survive; concurrent
changes to a dirty field require reopening the record. Use conditional/versioned
backend writes for conflicts after the request starts.

Standalone `DataGridInlineEditor` accepts `label`, `aria-labelledby`, `error`, and
disabled options. Metadata editors use their label or column ID. Select values should
be primitives with unique serialized forms; one null/empty choice is supported.
`DataGridTableDndCombinedProps` no longer takes its unused row generic; the component
itself still accepts a row generic.

## Server queries and mutation ownership

Memoize the data source and query. Use server processing for pagination, sorting and
filtering together, and supply the server's row total:

```tsx
import { useMemo } from "react"
import { useTable } from "@tanstack/react-table"
import { dataGridFeatures } from "@/components/data-grid/table-features"
import { useDataGridFeatureData } from "@/hooks/use-data-grid-feature-data"
import { serializeDataGridQuery } from "@/components/data-grid/data-grid-filter-server"
import type { DataGridQuery, DataGridPage } from "@/types/data-grid-data-source"

const query = useMemo(() => ({ pagination, sorting, columnFilters }), [pagination, sorting, columnFilters])
const source = useMemo(() => ({
  mode: "server" as const,
  async getRows(query: DataGridQuery) {
    const response = await fetch(`/api/people?query=${encodeURIComponent(serializeDataGridQuery(query))}`)
    if (!response.ok) throw new Error("Unable to load people")
    return response.json() as Promise<DataGridPage<Person>>
  },
  ...preferenceAndMutationMethods,
}), [preferenceAndMutationMethods])
const result = useDataGridFeatureData({ dataSource: source, query })
const table = useTable({
  features: dataGridFeatures, data: result.rows, columns, getRowId: (row) => row.id,
  state: { pagination, sorting, columnFilters },
  onPaginationChange: setPagination, onSortingChange: setSorting, onColumnFiltersChange: setColumnFilters,
  manualPagination: true, manualSorting: true, manualFiltering: true,
  rowCount: result.total,
})
```

Implement and memoize `preferenceAndMutationMethods` with get/saveRowPinning,
get/saveColumnState, updateRow and reorderRows. Authenticate requests and validate
column allowlists, operators, values, pagination limits and record revisions on the
server. The client's all-rows query is not a server page-size recommendation. Excel
filters use the provided serializer; existing facet arrays need their own server
contract.

The feature example serializes preference and reorder writes. Initial reads, refreshes
and Strict Mode effect replay establish a baseline without writing it back. A failed
reorder restores only its still-owned optimistic ordering and retains current field
values, additions and deletions. A newer reorder or completed refresh invalidates an
older rollback. Durable preferences and backend concurrency remain adapter-owned.

## Virtualization and accessibility

`virtualizerOptions={{ enabled: false }}` and `{ overscan: 5 }` do not require the React
adapter's default observer/scroll functions. Virtual table indices include headers,
detail/status rows and the current page offset. Unknown infinite totals use
`aria-rowcount=-1`; sorting is exposed on headers. The Grid retains native table
semantics rather than claiming the full ARIA grid keyboard model.

Column resize separators support Left/Right (10 px), Shift+Left/Right (50 px),
Home/End (declared bounds), and Enter (reset), with RTL-aware direction. Name action
columns and custom controls. Keep screen-reader and physical IME acceptance in the
consumer's accessibility qualification.

Virtual DnD remains unsupported: use the nonvirtual row, column or combined renderer.
Unpin a column before dragging it; pinned rows cannot be reordered. When preferred
pinned columns fill a narrow viewport, the Grid temporarily scrolls them with the table
instead of overlapping them. Pin preferences remain intact and become sticky again when space permits. Virtual detail-row
measurement and unusual nested header/expansion combinations need consumer testing.

## CSS and upgrade verification

Load the Tailwind entry stylesheet before component imports so its layer order is
established before separately bundled component CSS:

```tsx
import "./index.css"
import App from "./App"
```

The CLI preserves existing CSS. Selecting `--color` deliberately replaces the complete light/dark semantic palette;
ordinary init preserves custom values and `--radius` remains independent. Explicit
theme selection must produce an unlayered dark palette when a layered foundation also defines `.dark`. The narrow merge fix
does not remove custom root styles or unlayered demo `h1` rules. Verify both a merged
Vite stylesheet and a clean explicit CSS destination, including computed dark colors
and dialog typography; adapt conflicting consumer CSS deliberately.

The following release checklist was recorded at the pre-release fix checkpoint; see
the [final 1.5.0 release receipt](./releases/1.5.0-release-receipt.md) for the completed
publication and production verification, with physical acceptance still pending.

Before a release, qualify a real packed CLI in fresh Next/Vite consumers, exact/minimum
Table versions, customized-source preservation, three browser engines, responsive/RTL
combinations, and coordinated hosted registry/package delivery. This fix checkpoint
does not itself publish 1.5.0.
