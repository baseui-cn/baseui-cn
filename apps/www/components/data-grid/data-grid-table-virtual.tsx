"use client"

import {
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useDataGrid } from "@/components/data-grid/data-grid"
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
  DataGridTable,
} from "@/components/data-grid/table-features"
import {
  useVirtualizer,
  type VirtualItem,
  type Virtualizer,
  type VirtualizerOptions,
} from "@tanstack/react-virtual"

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

type DataGridTableVirtualizerOptions<TData extends RowData> = Omit<
  VirtualizerOptions<HTMLElement, HTMLTableRowElement>,
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
  table: DataGridTable<TData>
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
}: {
  children: ReactNode
  className?: string
  columnCount: number
}) {
  return (
    <tr>
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
  table,
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
}: VirtualBodyProps<TData>) {
  const totalRows = topRows.length + centerRows.length + bottomRows.length

  if (!totalRows) return <DataGridTableEmpty />

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
      renderedRows.push(<DataGridTableRenderedRow key={row.id} row={row} />)
    })
  }

  if (showFetchingRow) {
    renderedRows.push(
      <DataGridTableVirtualStatusRow
        key="virtual-status-loading"
        columnCount={columnCount}
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
const MemoizedVirtualBody = memo(
  DataGridTableVirtualBody,
  (_prev, next) => !!next.table.store.state.columnResizing.isResizingColumn
) as typeof DataGridTableVirtualBody

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
  const { table, props, scrollToRowRef } = useDataGrid<TData>()
  const { topRows, centerRows, bottomRows } = getDataGridTableRowSections(
    table,
    props.tableLayout?.rowsPinnable
  )
  const columnCount =
    table.getVisibleFlatColumns().length +
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const virtualItems = isVirtualizationEnabled ? virtualizer.getVirtualItems() : []
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
      <DataGridTableBase>
        {renderHeader && (
          <DataGridTableHead>
            {table
              .getHeaderGroups()
              .map((headerGroup: DataGridHeaderGroup<TData>, index: number) => (
                <DataGridTableHeadRow headerGroup={headerGroup} key={index}>
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
          <MemoizedVirtualBody
            table={table}
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
