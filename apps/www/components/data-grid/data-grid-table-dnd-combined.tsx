"use client"

import {
  createContext,
  type CSSProperties,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"
import { useDataGrid } from "@/components/data-grid/data-grid"
import {
  DataGridTableBase,
  DataGridTableBody,
  DataGridTableBodyRow,
  DataGridTableBodyRowCell,
  DataGridTableBodyRowExpandded,
  DataGridTableBodyRowSkeleton,
  DataGridTableBodyRowSkeletonCell,
  DataGridTableEmpty,
  DataGridTableFoot,
  DataGridTableHead,
  DataGridTableHeadRow,
  DataGridTableHeadRowCell,
  DataGridTableHeadRowCellResize,
  DataGridTableRowSpacer,
  DataGridTableViewport,
  getDataGridTableResolvedRows,
} from "@/components/data-grid/data-grid-table"
import { Button } from "@/components/ui/button"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  type Modifier,
  MouseSensor,
  TouchSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { flexRender, type RowData } from "@tanstack/react-table"
import type {
  DataGridCell,
  DataGridHeader,
  DataGridHeaderGroup,
  DataGridRow,
} from "@/components/data-grid/table-features"
import { GripHorizontalIcon, GripVerticalIcon } from "lucide-react"

type DragType = "column" | "row"
type SortableContextValue = ReturnType<typeof useSortable>

const SortableRowContext = createContext<Pick<
  SortableContextValue,
  "attributes" | "listeners" | "isDragging"
> & { disabled: boolean } | null>(null)

export interface DataGridTableDndCombinedProps<TData extends RowData> {
  onRowDragEnd?: (event: DragEndEvent) => void
  onColumnDragEnd?: (event: DragEndEvent) => void
  footerContent?: ReactNode
}

function DataGridTableDndCombinedRowHandle({ disabled = false }: { disabled?: boolean }) {
  const context = useContext(SortableRowContext)

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="size-7 cursor-grab opacity-70 hover:bg-transparent hover:opacity-100 active:cursor-grabbing"
      aria-label="Drag to reorder row"
      disabled={disabled || !context || context.disabled}
      {...context?.attributes}
      {...context?.listeners}
    >
      <GripHorizontalIcon />
    </Button>
  )
}

function DataGridTableDndCombinedHeader<TData extends RowData>({
  header,
  enabled,
}: {
  header: DataGridHeader<TData, unknown>
  enabled: boolean
}) {
  const { props } = useDataGrid()
  const { column } = header
  const canOrder =
    enabled &&
    !header.isPlaceholder &&
    !column.getIsPinned() &&
    (column.columnDef as { enableColumnOrdering?: boolean }).enableColumnOrdering !== false
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id: `column:${column.id}`,
    disabled: !canOrder,
    data: { dndType: "column" satisfies DragType, originalId: column.id },
  })

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: isDragging ? "grabbing" : undefined,
    whiteSpace: "nowrap",
    width: props.tableLayout?.columnsResizable
      ? `calc(var(--header-${header.id}-size) * 1px)`
      : header.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <DataGridTableHeadRowCell header={header} dndStyle={style} dndRef={setNodeRef}>
      <div className="flex items-center justify-start gap-0.5">
        {canOrder && (
          <Button
            size="icon-sm"
            variant="ghost"
            className={`-ms-2 size-6 ${isDragging ? "cursor-grabbing" : "cursor-grab active:cursor-grabbing"}`}
            {...attributes}
            {...listeners}
            aria-label="Drag to reorder column"
          >
            <GripVerticalIcon className="opacity-60 hover:opacity-100" aria-hidden="true" />
          </Button>
        )}
        <span className="min-w-3 grow truncate">
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
        </span>
        {props.tableLayout?.columnsResizable && column.getCanResize() && (
          <DataGridTableHeadRowCellResize header={header} />
        )}
      </div>
    </DataGridTableHeadRowCell>
  )
}

function DataGridTableDndCombinedRow<TData extends RowData>({
  row,
  pinnedBoundary,
  enabled,
}: {
  row: DataGridRow<TData>
  pinnedBoundary?: "top" | "bottom"
  enabled: boolean
}) {
  const { props } = useDataGrid()
  const { transform, transition, setNodeRef, isDragging, attributes, listeners } = useSortable({
    id: `row:${row.id}`,
    disabled: !enabled || (props.tableLayout?.rowsPinnable === true && Boolean(row.getIsPinned())),
    data: { dndType: "row" satisfies DragType, originalId: row.id },
  })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative",
    cursor: isDragging ? "grabbing" : undefined,
  }

  return (
    <SortableRowContext.Provider value={{ attributes, listeners, isDragging, disabled: !enabled || Boolean(row.getIsPinned()) }}>
      <DataGridTableBodyRow
        row={row}
        pinnedBoundary={pinnedBoundary}
        dndRef={setNodeRef}
        dndStyle={style}
      >
        {row.getVisibleCells().map((cell: DataGridCell<TData, unknown>) => (
          <DataGridTableBodyRowCell cell={cell} key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </DataGridTableBodyRowCell>
        ))}
      </DataGridTableBodyRow>
      {row.getIsExpanded() && <DataGridTableBodyRowExpandded row={row} />}
    </SortableRowContext.Provider>
  )
}

function getActiveDragType(event: DragEndEvent): DragType | undefined {
  const type = event.active.data.current?.dndType
  return type === "column" || type === "row" ? type : undefined
}

function DataGridTableDndCombined<TData extends RowData>({
  onRowDragEnd,
  onColumnDragEnd,
  footerContent,
}: DataGridTableDndCombinedProps<TData>) {
  const { table, isLoading, props } = useDataGrid()
  const pagination = table.store.state.pagination
  const viewportRef = useRef<HTMLDivElement>(null)
  const [draggingType, setDraggingType] = useState<DragType | null>(null)
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )
  const columnOrder = table.store.state.columnOrder.length
    ? table.store.state.columnOrder
    : table.getAllLeafColumns().map((column) => column.id)
  const resolvedRows = getDataGridTableResolvedRows(table, props.tableLayout?.rowsPinnable)
  const rowIds = resolvedRows
    .filter(({ row }) => !props.tableLayout?.rowsPinnable || !row.getIsPinned())
    .map(({ row }) => `row:${row.id}`)

  const restrictDragAxis: Modifier = ({ active, transform }) => {
    return active?.data.current?.dndType === "column"
      ? { ...transform, y: 0 }
      : { ...transform, x: 0 }
  }

  const collisionDetection: CollisionDetection = (args) => {
    const type = args.active.data.current?.dndType
    if (type !== "column" && type !== "row") {
      return closestCenter(args)
    }

    const matchingContainers = args.droppableContainers.filter(
      (container) => container.data.current?.dndType === type
    )
    return closestCenter({ ...args, droppableContainers: matchingContainers })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setDraggingType(null)
    const type = getActiveDragType(event)
    if (!event.over || event.over.data.current?.dndType !== type) return
    const activeId = event.active.data.current?.originalId
    const overId = event.over.data.current?.originalId
    if (typeof activeId !== "string" || typeof overId !== "string") return
    // Namespace internal IDs; preserve consumer callback IDs and event API.
    const resolvedEvent = { ...event, active: { ...event.active, id: activeId }, over: { ...event.over, id: overId } }
    if (type === "row") {
      onRowDragEnd?.(resolvedEvent)
    } else if (type === "column") {
      onColumnDragEnd?.(resolvedEvent)
    }
  }

  useEffect(() => {
    if (!draggingType) return

    const { body, documentElement } = document
    const previousBodyCursor = body.style.cursor
    const previousDocumentCursor = documentElement.style.cursor
    body.style.cursor = "grabbing"
    documentElement.style.cursor = "grabbing"

    return () => {
      body.style.cursor = previousBodyCursor
      documentElement.style.cursor = previousDocumentCursor
    }
  }, [draggingType])

  return (
    <DndContext
      id={useId()}
      collisionDetection={collisionDetection}
      modifiers={[restrictDragAxis]}
      onDragCancel={() => setDraggingType(null)}
      onDragEnd={handleDragEnd}
      onDragStart={({ active }) => {
        const type = active.data.current?.dndType
        setDraggingType(type === "row" || type === "column" ? type : null)
      }}
      sensors={sensors}
    >
      <DataGridTableViewport
        viewportRef={viewportRef}
        className={draggingType ? "relative cursor-grabbing [&_*]:cursor-grabbing!" : "relative"}
      >
        <DataGridTableBase>
          <DataGridTableHead>
            {table.getHeaderGroups().map((headerGroup: DataGridHeaderGroup<TData>) => (
              <DataGridTableHeadRow headerGroup={headerGroup} key={headerGroup.id}>
                <SortableContext
                  items={columnOrder.filter((id) => !table.getColumn(id)?.getIsPinned()).map((id) => `column:${id}`) as UniqueIdentifier[]}
                  strategy={horizontalListSortingStrategy}
                >
                  {headerGroup.headers.map((header) => (
                    <DataGridTableDndCombinedHeader
                      header={header}
                      enabled={props.tableLayout?.columnsDraggable === true}
                      key={header.id}
                    />
                  ))}
                </SortableContext>
              </DataGridTableHeadRow>
            ))}
          </DataGridTableHead>

          {(props.tableLayout?.stripped || !props.tableLayout?.rowBorder) && (
            <DataGridTableRowSpacer />
          )}

          <DataGridTableBody>
            {props.loadingMode === "skeleton" && isLoading && pagination?.pageSize ? (
              Array.from({ length: pagination.pageSize }).map((_, rowIndex) => (
                <DataGridTableBodyRowSkeleton key={rowIndex}>
                  {table.getVisibleFlatColumns().map((column, columnIndex) => (
                    <DataGridTableBodyRowSkeletonCell column={column} key={columnIndex}>
                      {column.columnDef.meta?.skeleton}
                    </DataGridTableBodyRowSkeletonCell>
                  ))}
                </DataGridTableBodyRowSkeleton>
              ))
            ) : resolvedRows.length ? (
              <SortableContext
                items={rowIds as UniqueIdentifier[]}
                strategy={verticalListSortingStrategy}
              >
                {resolvedRows.map(({ row, pinnedBoundary }) => (
                  <DataGridTableDndCombinedRow
                    row={row}
                    pinnedBoundary={pinnedBoundary}
                    enabled={props.tableLayout?.rowsDraggable === true}
                    key={row.id}
                  />
                ))}
              </SortableContext>
            ) : (
              <DataGridTableEmpty />
            )}
          </DataGridTableBody>

          {footerContent && <DataGridTableFoot>{footerContent}</DataGridTableFoot>}
        </DataGridTableBase>
      </DataGridTableViewport>
    </DndContext>
  )
}

export { DataGridTableDndCombined, DataGridTableDndCombinedRowHandle }
