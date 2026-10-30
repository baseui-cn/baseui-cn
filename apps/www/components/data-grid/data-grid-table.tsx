"use client"

import {
  type CSSProperties,
  Fragment,
  memo,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type TouchEvent as ReactTouchEvent,
  type Ref,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useDataGrid } from "@/components/data-grid/data-grid"
import {
  flexRender,
  type RowData,
} from "@tanstack/react-table"
import type {
  DataGridCell,
  DataGridColumn,
  DataGridHeader,
  DataGridHeaderGroup,
  DataGridRow,
  DataGridTable as DataGridTableInstance,
} from "@/components/data-grid/table-features"
import { cva } from "class-variance-authority"
import { ArrowDownIcon, ArrowUpIcon, PinIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"

const headerCellSpacingVariants = cva("", {
  variants: {
    size: {
      dense: "px-2.5 h-7",
      default: "px-4 h-9",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

const bodyCellSpacingVariants = cva("", {
  variants: {
    size: {
      dense: "px-2.5 py-2",
      default: "px-0 py-0",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

const footerCellSpacingVariants = cva("", {
  variants: {
    size: {
      dense: "px-2.5 py-2",
      default: "px-4 py-2.5",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

function getPinningStyles<TData extends RowData>(column: DataGridColumn<TData>): CSSProperties {
  const isPinned = column.getIsPinned()

  return {
    insetInlineStart: isPinned === "start" ? `${column.getStart("start")}px` : undefined,
    insetInlineEnd: isPinned === "end" ? `${column.getAfter("end")}px` : undefined,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  }
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) return

  if (typeof ref === "function") {
    ref(value)
    return
  }

  ;(ref as { current: T | null }).current = value
}

type DataGridResizeStartEvent = ReactMouseEvent<HTMLDivElement> | ReactTouchEvent<HTMLDivElement>

type DataGridResizeDocumentEvent = globalThis.MouseEvent | globalThis.TouchEvent

function isDataGridTouchEvent(
  event: DataGridResizeStartEvent | DataGridResizeDocumentEvent
): event is ReactTouchEvent<HTMLDivElement> | globalThis.TouchEvent {
  return "touches" in event
}

function getDataGridResizeEventClientX(
  event: DataGridResizeStartEvent | DataGridResizeDocumentEvent
) {
  if (isDataGridTouchEvent(event)) {
    return event.touches[0]?.clientX ?? event.changedTouches[0]?.clientX
  }

  return event.clientX
}

function startDataGridColumnResizeOnEnd<
  THeaderData extends RowData,
  TTableData extends RowData,
>(
  event: DataGridResizeStartEvent,
  header: DataGridHeader<THeaderData, unknown>,
  table: DataGridTableInstance<TTableData>
) {
  const column = table.getColumn(header.column.id)

  if (!column || !column.getCanResize()) return
  if (isDataGridTouchEvent(event) && event.touches.length > 1) return

  event.persist?.()

  const ownerDocument = event.currentTarget.ownerDocument
  const previousBodyCursor = ownerDocument.body.style.cursor
  const previousDocumentCursor = ownerDocument.documentElement.style.cursor
  const startSize = header.getSize()
  const dragStartClientX = getDataGridResizeEventClientX(event)
  const headerCell = event.currentTarget.closest("th")
  const headerRect = headerCell?.getBoundingClientRect()
  const startOffset =
    headerRect &&
    Number.isFinite(
      table.options.columnResizeDirection === "rtl" ? headerRect.left : headerRect.right
    )
      ? table.options.columnResizeDirection === "rtl"
        ? headerRect.left
        : headerRect.right
      : dragStartClientX

  if (typeof dragStartClientX !== "number" || typeof startOffset !== "number") {
    return
  }

  ownerDocument.body.style.cursor = "col-resize"
  ownerDocument.documentElement.style.cursor = "col-resize"

  const columnSizingStart = header
    .getLeafHeaders()
    .map((leafHeader) => [leafHeader.column.id, leafHeader.column.getSize()] as [string, number])
  const directionMultiplier = table.options.columnResizeDirection === "rtl" ? -1 : 1

  const updateOffset = (clientXPos?: number, commit = false) => {
    if (typeof clientXPos !== "number") return

    const nextColumnSizing: Record<string, number> = {}
    const deltaOffset = (clientXPos - dragStartClientX) * directionMultiplier
    const deltaPercentage = Math.max(deltaOffset / startSize, -0.999999)

    columnSizingStart.forEach(([columnId, headerSize]) => {
      nextColumnSizing[columnId] =
        Math.round(Math.max(headerSize + headerSize * deltaPercentage, 0) * 100) / 100
    })

    table.setColumnResizing((old) => ({
      ...old,
      startOffset,
      startSize,
      deltaOffset,
      deltaPercentage,
      columnSizingStart,
      isResizingColumn: column.id,
    }))

    if (commit) {
      table.setColumnSizing((old) => ({
        ...old,
        ...nextColumnSizing,
      }))
    }
  }

  const endResize = (clientXPos?: number) => {
    updateOffset(clientXPos, true)
    table.setColumnResizing((old) => ({
      ...old,
      isResizingColumn: false,
      startOffset: null,
      startSize: null,
      deltaOffset: null,
      deltaPercentage: null,
      columnSizingStart: [],
    }))
    ownerDocument.body.style.cursor = previousBodyCursor
    ownerDocument.documentElement.style.cursor = previousDocumentCursor
  }

  const mouseMoveHandler = (moveEvent: globalThis.MouseEvent) => {
    updateOffset(moveEvent.clientX)
  }
  const mouseUpHandler = (upEvent: globalThis.MouseEvent) => {
    ownerDocument.removeEventListener("mousemove", mouseMoveHandler)
    ownerDocument.removeEventListener("mouseup", mouseUpHandler)
    endResize(upEvent.clientX)
  }
  const touchMoveHandler = (moveEvent: globalThis.TouchEvent) => {
    if (moveEvent.cancelable) {
      moveEvent.preventDefault()
      moveEvent.stopPropagation()
    }

    updateOffset(getDataGridResizeEventClientX(moveEvent))
  }
  const touchEndHandler = (endEvent: globalThis.TouchEvent) => {
    ownerDocument.removeEventListener("touchmove", touchMoveHandler)
    ownerDocument.removeEventListener("touchend", touchEndHandler)

    if (endEvent.cancelable) {
      endEvent.preventDefault()
      endEvent.stopPropagation()
    }

    endResize(getDataGridResizeEventClientX(endEvent))
  }

  const passiveIfSupported = { passive: false } as const

  if (isDataGridTouchEvent(event)) {
    ownerDocument.addEventListener("touchmove", touchMoveHandler, passiveIfSupported)
    ownerDocument.addEventListener("touchend", touchEndHandler, passiveIfSupported)
  } else {
    ownerDocument.addEventListener("mousemove", mouseMoveHandler, passiveIfSupported)
    ownerDocument.addEventListener("mouseup", mouseUpHandler, passiveIfSupported)
  }

  table.setColumnResizing((old) => ({
    ...old,
    startOffset,
    startSize,
    deltaOffset: 0,
    deltaPercentage: 0,
    columnSizingStart,
    isResizingColumn: column.id,
  }))
}

type DataGridTablePinnedBoundary = "top" | "bottom"

function getDataGridTableRowSections<TData extends RowData>(
  table: DataGridTableInstance<TData>,
  rowsPinnable?: boolean
) {
  if (!rowsPinnable) {
    return {
      topRows: [] as DataGridRow<TData>[],
      centerRows: table.getRowModel().rows as DataGridRow<TData>[],
      bottomRows: [] as DataGridRow<TData>[],
    }
  }

  return {
    topRows: table.getTopRows() as DataGridRow<TData>[],
    centerRows: table.getCenterRows() as DataGridRow<TData>[],
    bottomRows: table.getBottomRows() as DataGridRow<TData>[],
  }
}

function getDataGridTableResolvedRows<TData extends RowData>(
  table: DataGridTableInstance<TData>,
  rowsPinnable?: boolean
) {
  const { topRows, centerRows, bottomRows } = getDataGridTableRowSections(table, rowsPinnable)
  const resolvedRows: Array<{
    row: DataGridRow<TData>
    pinnedBoundary?: DataGridTablePinnedBoundary
  }> = []

  topRows.forEach((row, index) => {
    resolvedRows.push({
      row,
      pinnedBoundary:
        index === topRows.length - 1 && (centerRows.length > 0 || bottomRows.length > 0)
          ? "top"
          : undefined,
    })
  })

  centerRows.forEach((row) => {
    resolvedRows.push({ row })
  })

  bottomRows.forEach((row, index) => {
    resolvedRows.push({
      row,
      pinnedBoundary:
        index === 0 && (centerRows.length > 0 || topRows.length > 0) ? "bottom" : undefined,
    })
  })

  return resolvedRows
}

function DataGridTableFillCol() {
  const { props } = useDataGrid()

  if (!props.tableLayout?.columnsResizable) return null

  return (
    <col
      data-slot="data-grid-table-fill-col"
      style={{ width: "var(--data-grid-fill-size, 0px)" }}
    />
  )
}

function DataGridTableFillHeadCell() {
  const { props } = useDataGrid()

  if (!props.tableLayout?.columnsResizable) return null

  return (
    <th
      aria-hidden="true"
      data-slot="data-grid-table-fill-head-cell"
      style={{ width: "var(--data-grid-fill-size, 0px)" }}
      className="p-0"
    />
  )
}

function DataGridTableFillBodyCell() {
  const { props } = useDataGrid()

  if (!props.tableLayout?.columnsResizable) return null

  return (
    <td
      aria-hidden="true"
      data-slot="data-grid-table-fill-body-cell"
      style={{ width: "var(--data-grid-fill-size, 0px)" }}
      className="p-0"
    />
  )
}

function DataGridTableFillFootCell() {
  const { props } = useDataGrid()

  if (!props.tableLayout?.columnsResizable) return null

  return (
    <td
      aria-hidden="true"
      data-slot="data-grid-table-fill-foot-cell"
      style={{ width: "var(--data-grid-fill-size, 0px)" }}
      className="border-t p-0"
    />
  )
}

function DataGridTableBase({ children }: { children: ReactNode }) {
  const { props, table } = useDataGrid()
  const visibleColumns = table.getVisibleLeafColumns()

  /**
   * Compute column widths as CSS custom properties once upfront (memoized).
   * Cells reference these via calc(var(--col-X-size) * 1px) so the browser
   * handles width propagation without per-cell getSize() calls or React
   * re-renders of the body.
   */
  const columnSizeVars = useMemo(() => {
    if (!props.tableLayout?.columnsResizable) return undefined
    const headers = table.getFlatHeaders()
    const colSizes: Record<string, number> = {}
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!
      colSizes[`--header-${header.id}-size`] = header.getSize()
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
    }
    return colSizes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.tableLayout?.columnsResizable,
    table.store.state.columnSizing,
  ])

  return (
    <table
      data-slot="data-grid-table"
      className={cn(
        "text-foreground text-sm caption-bottom text-left align-middle font-normal rtl:text-right",
        props.tableLayout?.columnsResizable ? "min-w-0" : "w-full min-w-full",
        props.tableLayout?.width === "auto" ? "table-auto" : "table-fixed",
        !props.tableLayout?.columnsResizable && "",
        !props.tableLayout?.columnsDraggable && "border-separate border-spacing-0",
        props.tableClassNames?.base
      )}
      style={
        props.tableLayout?.columnsResizable
          ? {
              ...columnSizeVars,
              width: `calc(${table.getTotalSize()}px + var(--data-grid-fill-size, 0px))`,
            }
          : undefined
      }
    >
      <colgroup>
        {visibleColumns.map((column) => (
          <col
            key={column.id}
            style={
              props.tableLayout?.columnsResizable
                ? { width: `calc(var(--col-${column.id}-size) * 1px)` }
                : props.tableLayout?.width === "fixed"
                  ? { width: column.getSize() }
                  : undefined
            }
          />
        ))}
        <DataGridTableFillCol />
      </colgroup>
      {children}
    </table>
  )
}

function DataGridTableViewport({
  children,
  className,
  viewportRef,
  style,
}: {
  children: ReactNode
  className?: string
  viewportRef?: Ref<HTMLDivElement>
  style?: CSSProperties
}) {
  const { props, table } = useDataGrid()
  const [viewportElement, setViewportElement] = useState<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const handleViewportRef = useCallback(
    (node: HTMLDivElement | null) => {
      setViewportElement(node)
      assignRef(viewportRef, node)
    },
    [viewportRef]
  )
  const fillWidth =
    props.tableLayout?.columnsResizable && containerWidth > 0
      ? Math.max(0, containerWidth - table.getTotalSize())
      : 0

  useEffect(() => {
    if (!viewportElement || !props.tableLayout?.columnsResizable) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setContainerWidth(0)
      return
    }

    const scrollViewport =
      (viewportElement.closest('[data-slot="scroll-area-viewport"]') as HTMLElement | null) ??
      viewportElement.parentElement
    const measurementTarget = scrollViewport ?? viewportElement

    const syncContainerWidth = () => {
      setContainerWidth(measurementTarget.clientWidth)
    }

    syncContainerWidth()

    if (typeof ResizeObserver === "undefined") return

    const observer = new ResizeObserver(syncContainerWidth)
    observer.observe(measurementTarget)

    return () => {
      observer.disconnect()
    }
  }, [props.tableLayout?.columnsResizable, viewportElement])

  return (
    <div
      data-slot="data-grid-table-viewport"
      ref={handleViewportRef}
      className={cn("relative min-w-full align-top", className)}
      style={{
        ...(props.tableLayout?.columnsResizable
          ? {
              width: `calc(${table.getTotalSize()}px + var(--data-grid-fill-size, 0px))`,
              ["--data-grid-fill-size" as string]: `${fillWidth}px`,
            }
          : undefined),
        ...style,
      }}
    >
      {children}
      <DataGridTableResizeIndicator viewportElement={viewportElement} />
    </div>
  )
}

function DataGridTableHead({ children }: { children: ReactNode }) {
  const { props } = useDataGrid()

  return (
    <thead
      className={cn(
        props.tableClassNames?.header,
        props.tableLayout?.headerSticky && props.tableClassNames?.headerSticky
      )}
    >
      {children}
    </thead>
  )
}

function DataGridTableHeadRow<TData extends RowData>({
  children,
  headerGroup,
}: {
  children: ReactNode
  headerGroup: DataGridHeaderGroup<TData>
}) {
  const { props } = useDataGrid()

  return (
    <tr
      key={headerGroup.id}
      className={cn(
        "bg-muted",
        props.tableLayout?.headerBorder && "[&>th]:border-b",
        props.tableLayout?.cellBorder && "*:last:border-e-0",
        props.tableLayout?.stripped && "bg-transparent",
        props.tableLayout?.headerBackground === false && "bg-transparent",
        props.tableClassNames?.headerRow
      )}
    >
      {children}
      <DataGridTableFillHeadCell />
    </tr>
  )
}

function DataGridTableHeadRowCell<TData extends RowData>({
  children,
  header,
  dndRef,
  dndStyle,
}: {
  children: ReactNode
  header: DataGridHeader<TData, unknown>
  dndRef?: React.Ref<HTMLTableCellElement>
  dndStyle?: CSSProperties
}) {
  const { props } = useDataGrid()

  const { column } = header
  const isPinned = column.getIsPinned()
  const isLastStartPinned = isPinned === "start" && column.getIsLastColumn("start")
  const isFirstEndPinned = isPinned === "end" && column.getIsFirstColumn("end")
  const isLastVisibleColumn =
    column.getIndex() === header.getContext().table.getVisibleLeafColumns().length - 1
  const headerCellSpacing = headerCellSpacingVariants({
    size: props.tableLayout?.dense ? "dense" : "default",
  })
  const pinningStyles =
    props.tableLayout?.columnsPinnable && column.getCanPin() ? getPinningStyles(column) : undefined

  return (
    <th
      key={header.id}
      ref={dndRef}
      style={{
        ...(props.tableLayout?.width === "fixed" &&
          !props.tableLayout?.columnsResizable && {
            width: header.getSize(),
          }),
        ...pinningStyles,
        ...(props.tableLayout?.columnsResizable && {
          width: `calc(var(--header-${header.id}-size) * 1px)`,
        }),
        ...(dndStyle ? dndStyle : null),
        ...(pinningStyles &&
          isPinned && {
            insetInlineStart: pinningStyles.insetInlineStart,
            insetInlineEnd: pinningStyles.insetInlineEnd,
            position: pinningStyles.position,
            zIndex: Math.max(
              1,
              typeof dndStyle?.zIndex === "number" ? dndStyle.zIndex : 0
            ),
          }),
      }}
      data-pinned={isPinned || undefined}
      data-last-col={isLastStartPinned ? "start" : isFirstEndPinned ? "end" : undefined}
      className={cn(
        "text-muted-foreground h-10 relative text-left align-middle font-normal rtl:text-right [&:has([role=checkbox])]:pe-0",
        headerCellSpacing,
        props.tableLayout?.cellBorder && "border-e",
        props.tableLayout?.columnsResizable && column.getCanResize() && "overflow-visible",
        props.tableLayout?.columnsResizable &&
          column.getCanResize() &&
          isLastVisibleColumn &&
          "pe-8",
        props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          "[&[data-pinned][data-last-col]]:border-border data-pinned:bg-muted [&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0 [&[data-last-col=start]_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=start][data-last-col=start]]:border-e! [&[data-pinned=end]:last-child_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=end][data-last-col=end]]:border-s!",
        header.column.columnDef.meta?.headerClassName,
        column.getIndex() === 0 || column.getIndex() === (header.headerGroup?.headers.length ?? 0) - 1
          ? props.tableClassNames?.edgeCell
          : ""
      )}
    >
      {children}
    </th>
  )
}

function DataGridTableHeadRowCellResize<TData extends RowData>({
  header,
}: {
  header: DataGridHeader<TData, unknown>
}) {
  const { props, table } = useDataGrid()
  const { column } = header
  const isLastVisibleColumn =
    column.getIndex() === header.getContext().table.getVisibleLeafColumns().length - 1
  const isResizeModeOnEnd =
    (props.tableLayout?.columnsResizeMode ?? table.options.columnResizeMode) === "onEnd"

  const handleMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (isResizeModeOnEnd) {
      startDataGridColumnResizeOnEnd(event, header, table)
      return
    }

    header.getResizeHandler()(event)
  }

  const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (isResizeModeOnEnd) {
      startDataGridColumnResizeOnEnd(event, header, table)
      return
    }

    header.getResizeHandler()(event)
  }

  return (
    <div
      {...{
        onDoubleClick: () => column.resetSize(),
        onMouseDown: handleMouseDown,
        onTouchStart: handleTouchStart,
        className: cn(
          "absolute top-0 h-full cursor-col-resize user-select-none touch-none z-10 flex",
          isLastVisibleColumn
            ? "end-0 w-5 justify-end before:hidden"
            : "-end-2 w-5 justify-center before:absolute before:inset-y-0 before:w-px before:-translate-x-px before:bg-border",
          column.getIsResizing() &&
            (isResizeModeOnEnd
              ? "opacity-100"
              : isLastVisibleColumn
                ? "before:absolute before:end-0 before:block before:inset-y-0 before:w-0.5 before:bg-primary opacity-100"
                : "before:block before:bg-primary before:w-0.5 opacity-100")
        ),
      }}
    />
  )
}

function DataGridTableResizeIndicator({
  viewportElement,
}: {
  viewportElement: HTMLDivElement | null
}) {
  const { props, table } = useDataGrid()
  const columnResizing = table.store.state.columnResizing
  const resizingColumnId = columnResizing.isResizingColumn
  const resizeMode = props.tableLayout?.columnsResizeMode ?? table.options.columnResizeMode

  if (!props.tableLayout?.columnsResizable || resizeMode !== "onEnd" || !resizingColumnId) {
    return null
  }

  const resizingHeader = table
    .getFlatHeaders()
    .find((header) => header.column.id === resizingColumnId || header.id === resizingColumnId)

  if (!resizingHeader) return null

  const deltaOffset = columnResizing.deltaOffset ?? 0
  const headerHeight =
    viewportElement?.querySelector('[data-slot="data-grid-table"] thead')?.getBoundingClientRect()
      .height ?? 0
  const indicatorLeft =
    typeof columnResizing.startOffset === "number" && viewportElement
      ? columnResizing.startOffset - viewportElement.getBoundingClientRect().left
      : resizingHeader.getStart() + resizingHeader.getSize()

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 z-20"
      style={{
        left: indicatorLeft,
        transform: `translateX(${deltaOffset}px)`,
      }}
    >
      <div className="bg-primary/85 absolute inset-y-0 left-0 w-px -translate-x-1/2" />
      <div
        className="bg-primary absolute top-0 left-0 -translate-x-1/2 rounded-b-sm shadow-xs"
        style={{
          width: 5,
          height: Math.max(headerHeight, 6),
        }}
      />
    </div>
  )
}

function DataGridTableRowSpacer() {
  return <tbody aria-hidden="true" className="h-2"></tbody>
}

function DataGridTableBody({ children }: { children: ReactNode }) {
  const { props } = useDataGrid()

  return (
    <tbody
      className={cn(
        "[&_tr:last-child]:border-0",
        props.tableLayout?.rowRounded && "[&_td:first-child]:rounded-l-lg",
        props.tableLayout?.rowRounded && "[&_td:last-child]:rounded-r-lg",
        props.tableClassNames?.body
      )}
    >
      {children}
    </tbody>
  )
}

function DataGridTableFoot({ children }: { children: ReactNode }) {
  const { props } = useDataGrid()
  return <tfoot className={cn("border-t", props.tableClassNames?.footer)}>{children}</tfoot>
}

function DataGridTableFootRow({ children }: { children: ReactNode }) {
  const { props } = useDataGrid()
  return (
    <tr
      className={cn(
        "bg-muted",
        props.tableLayout?.cellBorder && "*:last:border-e-0"
      )}
    >
      {children}
      <DataGridTableFillFootCell />
    </tr>
  )
}

function DataGridTableFootRowCell({
  children,
  colSpan,
  className,
}: {
  children?: ReactNode
  colSpan?: number
  className?: string
}) {
  const { props } = useDataGrid()
  const spacing = footerCellSpacingVariants({
    size: props.tableLayout?.dense ? "dense" : "default",
  })
  return (
    <td
      colSpan={colSpan}
      className={cn(
        "text-muted-foreground border-t align-middle font-medium",
        spacing,
        props.tableLayout?.cellBorder && "border-e",
        className
      )}
    >
      {children}
    </td>
  )
}

function DataGridTableBodyRowSkeleton({ children }: { children: ReactNode }) {
  const { table, props } = useDataGrid()

  return (
    <tr
      className={cn(
        "bg-background",
        props.onRowClick && "cursor-pointer",
        !props.tableLayout?.stripped &&
          props.tableLayout?.rowBorder &&
          "border-border border-b [&:not(:last-child)>td]:border-b",
        props.tableLayout?.cellBorder && "*:last:border-e-0",
        props.tableLayout?.stripped && "hover:bg-transparent",
        table.options.enableRowSelection && "*:first:relative",
        props.tableClassNames?.bodyRow
      )}
    >
      {children}
      <DataGridTableFillBodyCell />
    </tr>
  )
}

function DataGridTableBodyRowSkeletonCell<TData extends RowData>({
  children,
  column,
}: {
  children: ReactNode
  column: DataGridColumn<TData>
}) {
  const { props, table } = useDataGrid()
  const bodyCellSpacing = bodyCellSpacingVariants({
    size: props.tableLayout?.dense ? "dense" : "default",
  })

  return (
    <td
      style={
        props.tableLayout?.columnsResizable
          ? { width: `calc(var(--col-${column.id}-size) * 1px)` }
          : undefined
      }
      className={cn(
        "align-middle",
        bodyCellSpacing,
        props.tableLayout?.cellBorder && "border-e",
        props.tableLayout?.columnsResizable && column.getCanResize() && "truncate",
        column.columnDef.meta?.cellClassName,
        props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          "[&[data-pinned][data-last-col]]:border-border data-pinned:bg-background [&[data-pinned=start][data-last-col=start]]:border-e! [&[data-pinned=end][data-last-col=end]]:border-s!",
        column.getIndex() === 0 || column.getIndex() === table.getVisibleFlatColumns().length - 1
          ? props.tableClassNames?.edgeCell
          : ""
      )}
    >
      {children}
    </td>
  )
}

function DataGridTableBodyRow<TData extends RowData>({
  children,
  row,
  pinnedBoundary,
  rowRef,
  dndRef,
  dndStyle,
}: {
  children: ReactNode
  row: DataGridRow<TData>
  pinnedBoundary?: DataGridTablePinnedBoundary
  rowRef?: React.Ref<HTMLTableRowElement>
  dndRef?: React.Ref<HTMLTableRowElement>
  dndStyle?: CSSProperties
}) {
  const { props, table } = useDataGrid()
  const isRowPinned = row.getIsPinned()

  return (
    <tr
      ref={(node) => {
        assignRef(rowRef, node)
        assignRef(dndRef, node)
      }}
      style={{ ...(dndStyle ? dndStyle : null) }}
      data-state={table.options.enableRowSelection && row.getIsSelected() ? "selected" : undefined}
      data-row-pinned={isRowPinned || undefined}
      data-row-pinned-boundary={pinnedBoundary}
      onClick={() => props.onRowClick && props.onRowClick(row.original)}
      className={cn(
        "data-grid-row-layout data-[state=selected]:bg-muted",
        props.onRowClick && "cursor-pointer",
        !props.tableLayout?.stripped &&
          props.tableLayout?.rowBorder &&
          "border-border border-b [&:not(:last-child)>td]:border-b",
        props.tableLayout?.cellBorder && "*:last:border-e-0",
        props.tableLayout?.stripped && "odd:bg-muted/40",
        table.options.enableRowSelection && "*:first:relative",
        props.tableLayout?.rowsPinnable && isRowPinned && "bg-muted",
        pinnedBoundary === "top" && "[&>td]:shadow-[0_2px_0_rgba(0,0,0,0.03)]",
        pinnedBoundary === "bottom" && "[&>td]:shadow-[0_2px_0_rgba(0,0,0,0.03)]",
        props.tableClassNames?.bodyRow
      )}
    >
      {children}
      <DataGridTableFillBodyCell />
    </tr>
  )
}

function DataGridTableBodyRowExpandded<TData extends RowData>({
  row,
}: {
  row: DataGridRow<TData>
}) {
  const { props, table } = useDataGrid()

  return (
    <tr className={cn(props.tableLayout?.rowBorder && "[&:not(:last-child)>td]:border-b")}>
      <td colSpan={row.getVisibleCells().length + (props.tableLayout?.columnsResizable ? 1 : 0)}>
        {table
          .getAllColumns()
          .find((column) => column.columnDef.meta?.expandedContent)
          ?.columnDef.meta?.expandedContent?.(row.original)}
      </td>
    </tr>
  )
}

function DataGridTableBodyRowCell<TData extends RowData>({
  children,
  cell,
  dndRef,
  dndStyle,
}: {
  children: ReactNode
  cell: DataGridCell<TData, unknown>
  dndRef?: React.Ref<HTMLTableCellElement>
  dndStyle?: CSSProperties
}) {
  const { props } = useDataGrid()

  const { column, row } = cell
  const isPinned = column.getIsPinned()
  const isEditing = cell
    .getContext()
    .table.options.meta?.editing?.isCellEditing(row.id, column.id)
  const isLastStartPinned = isPinned === "start" && column.getIsLastColumn("start")
  const isFirstEndPinned = isPinned === "end" && column.getIsFirstColumn("end")
  const bodyCellSpacing = bodyCellSpacingVariants({
    size: props.tableLayout?.dense ? "dense" : "default",
  })
  const pinningStyles =
    props.tableLayout?.columnsPinnable && column.getCanPin() ? getPinningStyles(column) : undefined

  return (
    <td
      key={cell.id}
      ref={dndRef}
      {...(props.tableLayout?.columnsDraggable && !isPinned ? { cell } : {})}
      style={{
        ...pinningStyles,
        ...(props.tableLayout?.columnsResizable && {
          width: `calc(var(--col-${column.id}-size) * 1px)`,
        }),
        ...(dndStyle ? dndStyle : null),
        ...(pinningStyles &&
          isPinned && {
            insetInlineStart: pinningStyles.insetInlineStart,
            insetInlineEnd: pinningStyles.insetInlineEnd,
            position: pinningStyles.position,
            zIndex: Math.max(
              1,
              typeof dndStyle?.zIndex === "number" ? dndStyle.zIndex : 0
            ),
          }),
      }}
      data-pinned={isPinned || undefined}
      data-last-col={isLastStartPinned ? "start" : isFirstEndPinned ? "end" : undefined}
      className={cn(
        "align-middle",
        bodyCellSpacing,
        props.tableLayout?.cellBorder && "border-e",
        props.tableLayout?.columnsResizable && column.getCanResize() && "truncate",
        cell.column.columnDef.meta?.cellClassName,
        isEditing && "outline outline-1 -outline-offset-1 outline-primary",
        props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          "[&[data-pinned][data-last-col]]:border-border data-pinned:bg-background [&[data-pinned=start][data-last-col=start]]:border-e! [&[data-pinned=end][data-last-col=end]]:border-s!",
        column.getIndex() === 0 || column.getIndex() === row.getVisibleCells().length - 1
          ? props.tableClassNames?.edgeCell
          : ""
      )}
    >
      {children}
    </td>
  )
}

function getDataGridTableCellSkeleton<TData extends RowData>(cell: DataGridCell<TData, unknown>) {
  return (
    cell.column.columnDef.meta?.skeleton ?? (
      <div className="bg-muted/70 h-7 w-full animate-pulse rounded-md" />
    )
  )
}

function DataGridTableRenderedRow<TData extends RowData>({
  row,
  pinnedBoundary,
  rowRef,
}: {
  row: DataGridRow<TData>
  pinnedBoundary?: DataGridTablePinnedBoundary
  rowRef?: React.Ref<HTMLTableRowElement>
}) {
  const { props, table } = useDataGrid()
  const isPendingRow =
    props.loadingMode === "skeleton" && Boolean(table.options.meta?.editing?.isRowPending(row.id))

  // Keep an active inline editor mounted so pending/failed saves retain focus and draft.
  // Row skeletons remain available for dialog/other row-level operations.
  if (isPendingRow && table.options.meta?.editing?.activeCell?.rowId !== row.id) {
    return (
      <DataGridTableBodyRowSkeleton>
        {row.getVisibleCells().map((cell: DataGridCell<TData, unknown>) => (
          <DataGridTableBodyRowSkeletonCell column={cell.column} key={cell.id}>
            {getDataGridTableCellSkeleton(cell)}
          </DataGridTableBodyRowSkeletonCell>
        ))}
      </DataGridTableBodyRowSkeleton>
    )
  }

  return (
    <Fragment>
      <DataGridTableBodyRow row={row} pinnedBoundary={pinnedBoundary} rowRef={rowRef}>
        {row.getVisibleCells().map((cell: DataGridCell<TData, unknown>) => (
          <DataGridTableBodyRowCell cell={cell} key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </DataGridTableBodyRowCell>
        ))}
      </DataGridTableBodyRow>
      {row.getIsExpanded() && <DataGridTableBodyRowExpandded row={row} />}
    </Fragment>
  )
}

function DataGridTableEmpty() {
  const { table, props } = useDataGrid()
  const visibleColumnCount =
    table.getVisibleLeafColumns().length + (props.tableLayout?.columnsResizable ? 1 : 0)

  return (
    <tr>
      <td
        colSpan={Math.max(visibleColumnCount, 1)}
        className="text-muted-foreground text-sm py-6 text-center"
      >
        {props.emptyMessage || "No data available"}
      </td>
    </tr>
  )
}

function DataGridTableLoader() {
  const { props } = useDataGrid()

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="text-muted-foreground bg-card rounded-md text-sm shadow-xs flex items-center gap-2 border px-4 py-2 leading-none font-medium">
        <Spinner className="size-5 opacity-60" />
        {props.loadingMessage || "Loading..."}
      </div>
    </div>
  )
}

function DataGridTableRowPin<TData extends RowData>({ row }: { row: DataGridRow<TData> }) {
  const { props } = useDataGrid()
  if (!props.tableLayout?.rowsPinnable || !row.getCanPin()) return null

  const isPinned = row.getIsPinned()
  const label = isPinned ? `Row pinned to ${isPinned}` : "Pin row"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={label}
            title={label}
            className={cn(
              "text-muted-foreground hover:text-foreground",
              isPinned && "text-primary hover:text-primary/80"
            )}
            onClick={(event) => event.stopPropagation()}
          />
        }
      >
        <PinIcon className="size-4" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-36">
        <DropdownMenuItem onClick={() => row.pin("top")}>
          <ArrowUpIcon className="size-3.5" />
          Pin to top
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => row.pin("bottom")}>
          <ArrowDownIcon className="size-3.5" />
          Pin to bottom
        </DropdownMenuItem>
        {isPinned && <DropdownMenuItem onClick={() => row.pin(false)}>Unpin row</DropdownMenuItem>}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function DataGridTableRowSelect<TData extends RowData>({ row }: { row: DataGridRow<TData> }) {
  return (
    <>
      <div
        className={cn(
          "bg-primary absolute inset-s-0 top-0 bottom-0 hidden w-[2px]",
          row.getIsSelected() && "block"
        )}
      ></div>
      <Checkbox
        disabled={!row.getCanSelect()}
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="align-[inherit]"
      />
    </>
  )
}

function DataGridTableRowSelectAll() {
  const { table, recordCount, isLoading } = useDataGrid()

  const isAllSelected = table.getIsAllPageRowsSelected()
  const isSomeSelected = table.getIsSomePageRowsSelected()

  return (
    <Checkbox
      checked={isAllSelected}
      indeterminate={isSomeSelected && !isAllSelected}
      disabled={isLoading || recordCount === 0}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
      className="align-[inherit]"
    />
  )
}

function DataGridTableBodyRows<TData extends RowData>({
  table,
}: {
  table: DataGridTableInstance<TData>
}) {
  const { isLoading, props } = useDataGrid()
  const pagination = table.store.state.pagination

  if (isLoading && props.loadingMode === "skeleton" && pagination?.pageSize) {
    return (
      <>
        {Array.from({ length: pagination.pageSize }).map((_, rowIndex) => (
          <DataGridTableBodyRowSkeleton key={rowIndex}>
            {table.getVisibleFlatColumns().map((column, colIndex) => (
              <DataGridTableBodyRowSkeletonCell column={column} key={colIndex}>
                {column.columnDef.meta?.skeleton}
              </DataGridTableBodyRowSkeletonCell>
            ))}
          </DataGridTableBodyRowSkeleton>
        ))}
      </>
    )
  }

  if (isLoading && props.loadingMode === "spinner") {
    return (
      <tr>
        <td colSpan={table.getVisibleFlatColumns().length} className="p-8">
          <div className="flex items-center justify-center">
            <svg
              className="text-muted-foreground mr-3 -ml-1 h-5 w-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {props.loadingMessage || "Loading..."}
          </div>
        </td>
      </tr>
    )
  }

  const resolvedRows = getDataGridTableResolvedRows(table, props.tableLayout?.rowsPinnable)

  if (!resolvedRows.length) return <DataGridTableEmpty />

  return (
    <>
      {resolvedRows.map(({ row, pinnedBoundary }) => (
        <DataGridTableRenderedRow key={row.id} row={row} pinnedBoundary={pinnedBoundary} />
      ))}
    </>
  )
}

/**
 * Memoized body rows: skip re-renders during active column resize.
 * Column widths update via CSS variables on the <table> element,
 * so the browser handles width changes without React re-renders.
 */
const MemoizedDataGridTableBodyRows = memo(
  DataGridTableBodyRows,
  (_prev, next) => !!next.table.store.state.columnResizing.isResizingColumn
) as typeof DataGridTableBodyRows

function DataGridTableHeader<TData extends RowData>() {
  const { table, props } = useDataGrid()

  return (
    <DataGridTableViewport>
      <DataGridTableBase>
        <DataGridTableHead>
          {table.getHeaderGroups().map((headerGroup: DataGridHeaderGroup<TData>, index) => {
            return (
              <DataGridTableHeadRow headerGroup={headerGroup} key={index}>
                {headerGroup.headers.map((header, index) => {
                  const { column } = header

                  return (
                    <DataGridTableHeadRowCell header={header} key={index}>
                      {header.isPlaceholder ? null : props.tableLayout?.columnsResizable &&
                        column.getCanResize() ? (
                        <div className="truncate">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                      {props.tableLayout?.columnsResizable && column.getCanResize() && (
                        <DataGridTableHeadRowCellResize header={header} />
                      )}
                    </DataGridTableHeadRowCell>
                  )
                })}
              </DataGridTableHeadRow>
            )
          })}
        </DataGridTableHead>
      </DataGridTableBase>
    </DataGridTableViewport>
  )
}

function DataGridTable<TData extends RowData>({
  footerContent,
  renderHeader = true,
}: {
  footerContent?: ReactNode
  renderHeader?: boolean
}) {
  const { table, props } = useDataGrid()

  return (
    <DataGridTableViewport>
      <DataGridTableBase>
        {renderHeader && (
          <DataGridTableHead>
            {table.getHeaderGroups().map((headerGroup: DataGridHeaderGroup<TData>, index) => {
              return (
                <DataGridTableHeadRow headerGroup={headerGroup} key={index}>
                  {headerGroup.headers.map((header, index) => {
                    const { column } = header

                    return (
                      <DataGridTableHeadRowCell header={header} key={index}>
                        {header.isPlaceholder ? null : props.tableLayout?.columnsResizable &&
                          column.getCanResize() ? (
                          <div className="truncate">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </div>
                        ) : (
                          flexRender(header.column.columnDef.header, header.getContext())
                        )}
                        {props.tableLayout?.columnsResizable && column.getCanResize() && (
                          <DataGridTableHeadRowCellResize header={header} />
                        )}
                      </DataGridTableHeadRowCell>
                    )
                  })}
                </DataGridTableHeadRow>
              )
            })}
          </DataGridTableHead>
        )}

        {renderHeader && (props.tableLayout?.stripped || !props.tableLayout?.rowBorder) && (
          <DataGridTableRowSpacer />
        )}

        <DataGridTableBody>
          <MemoizedDataGridTableBodyRows table={table} />
        </DataGridTableBody>

        {footerContent && <DataGridTableFoot>{footerContent}</DataGridTableFoot>}
      </DataGridTableBase>
    </DataGridTableViewport>
  )
}

export {
  DataGridTable,
  DataGridTableBase,
  DataGridTableBody,
  DataGridTableBodyRow,
  DataGridTableBodyRowCell,
  DataGridTableBodyRowExpandded,
  DataGridTableRenderedRow,
  DataGridTableBodyRowSkeleton,
  DataGridTableBodyRowSkeletonCell,
  DataGridTableEmpty,
  DataGridTableFoot,
  DataGridTableFootRow,
  DataGridTableFootRowCell,
  DataGridTableHeader,
  DataGridTableHead,
  DataGridTableHeadRow,
  DataGridTableHeadRowCell,
  DataGridTableHeadRowCellResize,
  DataGridTableLoader,
  DataGridTableRowPin,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
  DataGridTableRowSpacer,
  DataGridTableViewport,
  getDataGridTableResolvedRows,
  getDataGridTableRowSections,
}

export type { DataGridTablePinnedBoundary }
