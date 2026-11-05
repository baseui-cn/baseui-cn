"use client"

import {
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { canSkipDataGridBodyRender, DataGridBodySnapshot, type DataGridContextProps, useDataGrid } from "@/components/data-grid/data-grid"
import {
  DataGridTableBase,
  DataGridTableBody,
  DataGridTableEmpty,
  DataGridTableFoot,
  DataGridTableHead,
  DataGridTableHeadRow,
  DataGridTableHeadRowCell,
  DataGridTableHeadRowCellResize,
  DataGridTableRenderedRow,
  DataGridTableRowSpacer,
  DataGridTableViewport,
  getDataGridTableRowSections,
} from "@/components/data-grid/data-grid-table"
import { flexRender, type RowData } from "@tanstack/react-table"
import type {
  DataGridHeaderGroup,
  DataGridRow,
} from "@/components/data-grid/table-features"
import {
  useVirtualizer,
  type VirtualItem,
  type Virtualizer,
  type VirtualizerOptions,
} from "@tanstack/react-virtual"

import { getDataGridVisibleColumns } from "./data-grid-utils"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

type DataGridTableVirtualScrollElements = {
  containerElement: HTMLDivElement | null
  scrollElement: HTMLElement | null
}

type DataGridTableVirtualizerInstance = Virtualizer<
  HTMLElement,
  HTMLTableRowElement
>

const EMPTY_VIRTUAL_ITEMS: VirtualItem[] = []

type DataGridTableVirtualizerOptions<TData extends RowData> = Omit<
  Partial<VirtualizerOptions<HTMLElement, HTMLTableRowElement>>,
  "count" | "estimateSize" | "getItemKey" | "getScrollElement"
> & {
  estimateSize?: (index: number, row: DataGridRow<TData>) => number
  getItemKey?: (index: number, row: DataGridRow<TData>) => string | number
  getScrollElement?: (
    elements: DataGridTableVirtualScrollElements
  ) => HTMLElement | null
}

interface DataGridTableVirtualProps<TData extends RowData> {
  height?: number | string
  estimateSize?: number
  overscan?: number
  footerContent?: ReactNode
  renderHeader?: boolean
  onFetchMore?: () => void
  isFetchingMore?: boolean
  hasMore?: boolean
  fetchMoreOffset?: number
  virtualizerOptions?: DataGridTableVirtualizerOptions<TData>
}

interface VirtualBodyProps<TData extends RowData> {
  grid: DataGridContextProps<TData>
  columnCount: number
  topRows: DataGridRow<TData>[]
  centerRows: DataGridRow<TData>[]
  bottomRows: DataGridRow<TData>[]
  virtualItems: VirtualItem[]
  totalSize: number
  isVirtualizationEnabled: boolean
  isInfiniteMode: boolean
  isFetchingMore: boolean
  hasMore?: boolean
  loadingMoreMessage: ReactNode
  allRowsLoadedMessage: ReactNode
  indexAttribute: string
  measureRowRef?: (element: HTMLTableRowElement | null) => void
  rowIndices: ReadonlyMap<string, number>
  statusRowIndex: number
}

function DataGridTableVirtualSpacer({
  columnCount,
  height,
}: {
  columnCount: number
  height: number
}) {
  if (height <= 0) return null

  return (
    <tr aria-hidden="true">
      <td colSpan={columnCount} style={{ height, padding: 0 }} />
    </tr>
  )
}

function DataGridTableVirtualStatusRow({
  children,
  className,
  columnCount,
  rowIndex,
}: {
  children: ReactNode
  className?: string
  columnCount: number
  rowIndex: number
}) {
  return (
    <tr aria-rowindex={rowIndex}>
      <td
        colSpan={columnCount}
        className={cn(
          "text-muted-foreground py-4 text-center text-sm",
          className
        )}
      >
        {children}
      </td>
    </tr>
  )
}

function DataGridTableVirtualBody<TData extends RowData>({
  columnCount,
  topRows,
  centerRows,
  bottomRows,
  virtualItems,
  totalSize,
  isVirtualizationEnabled,
  isInfiniteMode,
  isFetchingMore,
  hasMore,
  loadingMoreMessage,
  allRowsLoadedMessage,
  measureRowRef,
  indexAttribute,
  rowIndices,
  statusRowIndex,
}: VirtualBodyProps<TData>) {
  const totalRows = topRows.length + centerRows.length + bottomRows.length

  if (!totalRows) return <DataGridTableEmpty rowIndex={statusRowIndex} />

  const hasCenterRows = centerRows.length > 0
  const showFetchingRow = isInfiniteMode && isFetchingMore
  const showCompleteRow = isInfiniteMode && hasMore === false && totalRows > 0
  const hasMiddleSection = hasCenterRows || showFetchingRow || showCompleteRow
  const leadingSpacerHeight =
    isVirtualizationEnabled && hasCenterRows && virtualItems.length > 0
      ? (virtualItems[0]?.start ?? 0)
      : 0
  const trailingSpacerHeight =
    isVirtualizationEnabled && hasCenterRows && virtualItems.length > 0
      ? Math.max(
          0,
          totalSize - (virtualItems[virtualItems.length - 1]?.end ?? 0)
        )
      : 0

  const renderedRows: ReactNode[] = []

  topRows.forEach((row, index) => {
    renderedRows.push(
      <DataGridTableRenderedRow
        key={row.id}
        row={row}
        rowIndex={rowIndices.get(row.id)}
        pinnedBoundary={
          index === topRows.length - 1 && hasMiddleSection ? "top" : undefined
        }
      />
    )
  })

  if (isVirtualizationEnabled) {
    if (leadingSpacerHeight > 0) {
      renderedRows.push(
        <DataGridTableVirtualSpacer
          key="virtual-spacer-start"
          columnCount={columnCount}
          height={leadingSpacerHeight}
        />
      )
    }

    virtualItems.forEach((virtualRow) => {
      const row = centerRows[virtualRow.index]

      if (!row) return

      renderedRows.push(
        <DataGridTableRenderedRow
          key={row.id}
          row={row}
          rowIndex={rowIndices.get(row.id)}
          rowRef={measureRowRef ? (element) => {
            if (element) element.setAttribute(indexAttribute, String(virtualRow.index))
            measureRowRef(element)
          } : undefined}
        />
      )
    })

    if (trailingSpacerHeight > 0) {
      renderedRows.push(
        <DataGridTableVirtualSpacer
          key="virtual-spacer-end"
          columnCount={columnCount}
          height={trailingSpacerHeight}
        />
      )
    }
  } else {
    centerRows.forEach((row) => {
      renderedRows.push(<DataGridTableRenderedRow key={row.id} row={row} rowIndex={rowIndices.get(row.id)} />)
    })
  }

  if (showFetchingRow) {
    renderedRows.push(
      <DataGridTableVirtualStatusRow
        key="virtual-status-loading"
        columnCount={columnCount}
        rowIndex={statusRowIndex}
      >
        <div className="flex items-center justify-center gap-2">
          <Spinner className="size-4 opacity-60" />
          {loadingMoreMessage}
        </div>
      </DataGridTableVirtualStatusRow>
    )
  }

  if (showCompleteRow) {
    renderedRows.push(
      <DataGridTableVirtualStatusRow
        key="virtual-status-complete"
        columnCount={columnCount}
        rowIndex={statusRowIndex + Number(showFetchingRow)}
        className="py-3 text-xs"
      >
        {allRowsLoadedMessage}
      </DataGridTableVirtualStatusRow>
    )
  }

  bottomRows.forEach((row, index) => {
    renderedRows.push(
      <DataGridTableRenderedRow
        key={row.id}
        row={row}
        rowIndex={rowIndices.get(row.id)}
        pinnedBoundary={
          index === 0 && (topRows.length > 0 || hasMiddleSection)
            ? "bottom"
            : undefined
        }
      />
    )
  })

  return <>{renderedRows}</>
}

/**
 * Memoized virtual body: skip re-renders during active column resize.
 * Column widths update via CSS variables on the <table> element,
 * so the browser handles width changes without React re-renders.
 */
function DataGridTableVirtualBodySnapshot<TData extends RowData>(props: VirtualBodyProps<TData>) {
  return <DataGridBodySnapshot value={props.grid}><DataGridTableVirtualBody {...props} /></DataGridBodySnapshot>
}

const MemoizedVirtualBody = memo(DataGridTableVirtualBodySnapshot,
  (previous, next) => canSkipDataGridBodyRender(previous.grid, next.grid) &&
    previous.virtualItems === next.virtualItems && previous.totalSize === next.totalSize &&
    previous.rowIndices === next.rowIndices && previous.isFetchingMore === next.isFetchingMore &&
    previous.hasMore === next.hasMore && previous.isVirtualizationEnabled === next.isVirtualizationEnabled
) as typeof DataGridTableVirtualBodySnapshot

function DataGridTableVirtualBodyAdapter<TData extends RowData>(props: Omit<VirtualBodyProps<TData>, "grid">) {
  const grid = useDataGrid<TData>()
  return <MemoizedVirtualBody {...props} grid={grid} />
}

function DataGridTableVirtual<TData extends RowData>({
  height,
  estimateSize = 48,
  overscan = 10,
  footerContent,
  renderHeader = true,
  onFetchMore,
  isFetchingMore = false,
  hasMore,
  fetchMoreOffset = 0,
  virtualizerOptions,
}: DataGridTableVirtualProps<TData>) {
  const grid = useDataGrid<TData>()
  const { table, props, scrollToRowRef } = grid
  const rows = table.getRowModel().rows
  const prePaginationRows = table.getPrePaginatedRowModel().rows
  const coreRows = table.getCoreRowModel().rows
  const rowPinning = table.store.state.rowPinning
  const expanded = table.store.state.expanded
  // v9 row-section methods allocate arrays. Cache against their actual inputs,
  // rather than the render-facing table wrapper or sizing-only state.
  const { topRows, centerRows, bottomRows } = useMemo(
    () => getDataGridTableRowSections(table, props.tableLayout?.rowsPinnable),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table.store, rows, prePaginationRows, coreRows, rowPinning, expanded, table.options.keepPinnedRows, props.tableLayout?.rowsPinnable]
  )
  const columnCount =
    getDataGridVisibleColumns(table).length +
    (props.tableLayout?.columnsResizable ? 1 : 0)
  const isInfiniteMode = typeof onFetchMore === "function"
  const [viewportElements, setViewportElements] =
    useState<DataGridTableVirtualScrollElements>({
      containerElement: null,
      scrollElement: null,
    })

  const {
    estimateSize: customEstimateSize,
    getItemKey: customGetItemKey,
    getScrollElement: customGetScrollElement,
    measureElement: customMeasureElement,
    overscan: customOverscan,
    ...virtualizerOptionsRest
  } = virtualizerOptions ?? {}

  const isVirtualizationEnabled = virtualizerOptions?.enabled !== false
  const loadingMoreMessage =
    props.fetchingMoreMessage || props.loadingMessage || "Loading..."
  const allRowsLoadedMessage =
    props.allRowsLoadedMessage || "All records loaded"
  const headerRowCount = renderHeader ? table.getHeaderGroups().length : 0
  const pageOffset = table.store.state.pagination.pageIndex * table.store.state.pagination.pageSize
  const statusRowCount = Number(isInfiniteMode && isFetchingMore) + Number(isInfiniteMode && hasMore === false)
  const rowAccessibility = useMemo(() => {
    const indices = new Map<string, number>()
    let index = headerRowCount + pageOffset + 1
    let expandedCount = 0
    const addRow = (row: DataGridRow<TData>) => {
      indices.set(row.id, index++)
      if (row.getIsExpanded()) { index++; expandedCount++ }
    }
    topRows.forEach(addRow)
    centerRows.forEach(addRow)
    const statusRowIndex = index
    index += statusRowCount
    bottomRows.forEach(addRow)
    return { indices, statusRowIndex, lastIndex: indices.size ? index - 1 : index, expandedCount }
    // Expanded changes affect the additional detail rows' indices.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topRows, centerRows, bottomRows, headerRowCount, pageOffset, expanded, statusRowCount])
  const availableRows = table.options.manualPagination ? props.recordCount : table.getPrePaginatedRowModel().rows.length
  const accessibleRowCount = isInfiniteMode && hasMore !== false ? -1 : Math.max(
    rowAccessibility.lastIndex,
    headerRowCount + availableRows + rowAccessibility.expandedCount + statusRowCount
  )

  const handleViewportRef = useCallback((node: HTMLDivElement | null) => {
    setViewportElements({
      containerElement: node,
      scrollElement:
        (node?.closest(
          '[data-slot="scroll-area-viewport"]'
        ) as HTMLElement | null) ?? node,
    })
  }, [])

  const usesExternalScrollArea =
    viewportElements.scrollElement !== null &&
    viewportElements.scrollElement !== viewportElements.containerElement

  const resolveScrollElement = useCallback(() => {
    if (customGetScrollElement) {
      return customGetScrollElement(viewportElements)
    }

    return viewportElements.scrollElement
  }, [customGetScrollElement, viewportElements])

  const resolveItemKey = useCallback(
    (index: number) => {
      const row = centerRows[index]

      if (!row) return index

      return customGetItemKey?.(index, row) ?? row.id ?? index
    },
    [centerRows, customGetItemKey]
  )

  const resolveEstimateSize = useCallback(
    (index: number) => {
      const row = centerRows[index]

      return row
        ? (customEstimateSize?.(index, row) ?? estimateSize)
        : estimateSize
    },
    [centerRows, customEstimateSize, estimateSize]
  )

  const virtualizer = useVirtualizer({
    count: centerRows.length,
    getScrollElement: resolveScrollElement,
    getItemKey: resolveItemKey,
    estimateSize: resolveEstimateSize,
    overscan: customOverscan ?? overscan,
    measureElement: customMeasureElement,
    ...virtualizerOptionsRest,
  }) as DataGridTableVirtualizerInstance

  // The instance is stable while its visible window changes on scroll.
  // Intentionally read the live window: memoizing by instance reintroduces stale rows.
  const virtualItems = isVirtualizationEnabled ? virtualizer.getVirtualItems() : EMPTY_VIRTUAL_ITEMS
  useEffect(() => {
    const scrollToRow = (rowId: string) => {
      const index = centerRows.findIndex((row) => row.id === rowId)
      if (index >= 0) virtualizer.scrollToIndex(index, { align: "auto" })
    }
    scrollToRowRef.current = scrollToRow
    return () => {
      if (scrollToRowRef.current === scrollToRow) scrollToRowRef.current = null
    }
  }, [centerRows, scrollToRowRef, virtualizer])
  const totalSize = isVirtualizationEnabled ? virtualizer.getTotalSize() : 0
  const measureRowRef =
    isVirtualizationEnabled
      ? virtualizer.measureElement
      : undefined
  const resolvedFetchMoreOffset = useMemo(
    () => Math.max(0, fetchMoreOffset),
    [fetchMoreOffset]
  )

  useEffect(() => {
    if (
      !isVirtualizationEnabled ||
      !isInfiniteMode ||
      hasMore === false ||
      isFetchingMore
    ) {
      return
    }

    const lastItem = virtualItems[virtualItems.length - 1]
    if (!lastItem) return

    if (lastItem.index >= centerRows.length - 1 - resolvedFetchMoreOffset) {
      onFetchMore?.()
    }
  }, [
    centerRows.length,
    hasMore,
    isFetchingMore,
    isInfiniteMode,
    isVirtualizationEnabled,
    onFetchMore,
    resolvedFetchMoreOffset,
    virtualItems,
  ])

  return (
    <DataGridTableViewport
      viewportRef={handleViewportRef}
      className={!usesExternalScrollArea ? "block" : undefined}
      style={
        usesExternalScrollArea
          ? undefined
          : { height, overflow: "auto", position: "relative" }
      }
    >
      <DataGridTableBase rowCount={accessibleRowCount}>
        {renderHeader && (
          <DataGridTableHead>
            {table
              .getHeaderGroups()
              .map((headerGroup: DataGridHeaderGroup<TData>, index: number) => (
                <DataGridTableHeadRow headerGroup={headerGroup} key={index} rowIndex={index + 1}>
                  {headerGroup.headers.map((header, hIndex) => {
                    const { column } = header

                    return (
                      <DataGridTableHeadRowCell header={header} key={hIndex}>
                        {header.isPlaceholder ? null : props.tableLayout
                            ?.columnsResizable && column.getCanResize() ? (
                          <div className="truncate">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )
                        )}
                        {props.tableLayout?.columnsResizable &&
                          column.getCanResize() && (
                            <DataGridTableHeadRowCellResize header={header} />
                          )}
                      </DataGridTableHeadRowCell>
                    )
                  })}
                </DataGridTableHeadRow>
              ))}
          </DataGridTableHead>
        )}

        {renderHeader &&
          (props.tableLayout?.stripped || !props.tableLayout?.rowBorder) && (
            <DataGridTableRowSpacer />
          )}

        <DataGridTableBody>
          <DataGridTableVirtualBodyAdapter
            columnCount={columnCount}
            topRows={topRows}
            centerRows={centerRows}
            bottomRows={bottomRows}
            virtualItems={virtualItems}
            totalSize={totalSize}
            isVirtualizationEnabled={isVirtualizationEnabled}
            isInfiniteMode={isInfiniteMode}
            isFetchingMore={isFetchingMore}
            hasMore={hasMore}
            loadingMoreMessage={loadingMoreMessage}
            allRowsLoadedMessage={allRowsLoadedMessage}
            indexAttribute={virtualizer.options.indexAttribute}
            measureRowRef={measureRowRef}
            rowIndices={rowAccessibility.indices}
            statusRowIndex={rowAccessibility.statusRowIndex}
          />
        </DataGridTableBody>

        {footerContent && (
          <DataGridTableFoot>{footerContent}</DataGridTableFoot>
        )}
      </DataGridTableBase>
    </DataGridTableViewport>
  )
}

export { DataGridTableVirtual }
export type {
  DataGridTableVirtualProps,
  DataGridTableVirtualScrollElements,
  DataGridTableVirtualizerOptions,
}
