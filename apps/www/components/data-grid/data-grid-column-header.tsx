"use client"

import { type HTMLAttributes, memo, type ReactNode, useCallback, useMemo, useState } from "react"
import { getColumnHeaderLabel, useDataGrid } from "@/components/data-grid/data-grid"
import { DataGridFilterMenu } from "@/components/data-grid/data-grid-filter-menu"
import type { ExcelFilterType } from "@/types/data-grid-filter"
import { type RowData } from "@tanstack/react-table"
import type { DataGridColumn } from "@/components/data-grid/table-features"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowLeftToLineIcon,
  ArrowRightIcon,
  ArrowRightToLineIcon,
  ArrowUpIcon,
  CheckIcon,
  ChevronsUpDownIcon,
  PinOffIcon,
  Settings2Icon,
} from "lucide-react"

interface DataGridColumnHeaderProps<
  TData extends RowData,
  TValue,
> extends HTMLAttributes<HTMLDivElement> {
  column: DataGridColumn<TData, TValue>
  /** When omitted, uses `column.columnDef.meta.headerTitle`, then a string `columnDef.header`, then `column.id`. */
  title?: string
  icon?: ReactNode
  pinnable?: boolean
  filter?: ReactNode
  filterType?: ExcelFilterType
  visibility?: boolean
}

function DataGridColumnHeaderInner<TData extends RowData, TValue>({
  column,
  title,
  icon,
  className,
  filter,
  filterType,
  visibility = false,
}: DataGridColumnHeaderProps<TData, TValue>) {
  const { isLoading, table, props, recordCount } = useDataGrid()
  const [collisionBoundary, setCollisionBoundary] = useState<HTMLElement | null>(null)

  const headerRef = useCallback((node: HTMLDivElement | null) => {
    const viewport = node?.closest<HTMLElement>('[data-slot="scroll-area-viewport"]') ?? null

    setCollisionBoundary((current) => (current === viewport ? current : viewport))
  }, [])
  const resolvedTitle = title ?? getColumnHeaderLabel(column)

  const columnOrder = table.store.state.columnOrder.length
    ? table.store.state.columnOrder
    : table.getAllLeafColumns().map((column) => column.id)
  const columnVisibilityKey = JSON.stringify(table.store.state.columnVisibility)
  const isSorted = column.getIsSorted()
  const isPinned = column.getIsPinned()
  const canSort = column.getCanSort()
  const canPin = column.getCanPin()
  const canResize = column.getCanResize()

  const columnIndex = columnOrder.indexOf(column.id)
  const canMoveLeft = columnIndex > 0
  const canMoveRight = columnIndex < columnOrder.length - 1

  const handleSort = () => {
    if (isSorted === "asc") {
      column.toggleSorting(true)
    } else if (isSorted === "desc") {
      column.clearSorting()
    } else {
      column.toggleSorting(false)
    }
  }

  const headerLabelClassName = cn(
    "text-muted-foreground inline-flex h-full items-center gap-1.5 font-normal [&_svg]:opacity-60 text-[0.8125rem] leading-[calc(1.125/0.8125)] [&_svg]:size-3.5",
    className
  )

  const headerButtonClassName = cn(
    "text-muted-foreground hover:bg-muted data-popup-open:bg-muted hover:text-foreground data-popup-open:text-foreground -ms-2 px-2 font-medium h-6 rounded-md",
    className
  )

  const sortIcon =
    canSort &&
    (isSorted === "desc" ? (
      <ArrowDownIcon className="size-3.25" />
    ) : isSorted === "asc" ? (
      <ArrowUpIcon className="size-3.25" />
    ) : (
      <ChevronsUpDownIcon className="mt-px size-3.25" />
    ))

  const filterControl = filterType ? (
    <DataGridFilterMenu column={column} type={filterType} title={resolvedTitle} />
  ) : null

  const hasControls =
    props.tableLayout?.columnsMovable ||
    (props.tableLayout?.columnsVisibility && visibility) ||
    (props.tableLayout?.columnsPinnable && canPin) ||
    filter

  const menuItems = useMemo(() => {
    const items: ReactNode[] = []
    let hasPreviousSection = false

    // Filter section
    if (filter) {
      items.push(
        <DropdownMenuGroup key="group-filter">
          <DropdownMenuLabel key="filter">{filter}</DropdownMenuLabel>
        </DropdownMenuGroup>
      )
      hasPreviousSection = true
    }

    // Sort section
    if (canSort) {
      if (hasPreviousSection) {
        items.push(<DropdownMenuSeparator key="sep-sort" />)
      }
      items.push(
        <DropdownMenuItem
          key="sort-asc"
          onClick={() => {
            if (isSorted === "asc") {
              column.clearSorting()
            } else {
              column.toggleSorting(false)
            }
          }}
          disabled={!canSort}
        >
          <ArrowUpIcon className="size-3.5!" />
          <span className="grow">Asc</span>
          {isSorted === "asc" && <CheckIcon className="text-primary size-4 opacity-100!" />}
        </DropdownMenuItem>,
        <DropdownMenuItem
          key="sort-desc"
          onClick={() => {
            if (isSorted === "desc") {
              column.clearSorting()
            } else {
              column.toggleSorting(true)
            }
          }}
          disabled={!canSort}
        >
          <ArrowDownIcon className="size-3.5!" />
          <span className="grow">Desc</span>
          {isSorted === "desc" && <CheckIcon className="text-primary size-4 opacity-100!" />}
        </DropdownMenuItem>
      )
      hasPreviousSection = true
    }

    // Pin section
    if (props.tableLayout?.columnsPinnable && canPin) {
      if (hasPreviousSection) {
        items.push(<DropdownMenuSeparator key="sep-pin" />)
      }
      items.push(
        <DropdownMenuItem
          key="pin-left"
          onClick={() => column.pin(isPinned === "start" ? false : "start")}
        >
          <ArrowLeftToLineIcon className="size-3.5!" aria-hidden="true" />
          <span className="grow">Pin to start</span>
          {isPinned === "start" && <CheckIcon className="text-primary size-4 opacity-100!" />}
        </DropdownMenuItem>,
        <DropdownMenuItem
          key="pin-right"
          onClick={() => column.pin(isPinned === "end" ? false : "end")}
        >
          <ArrowRightToLineIcon className="size-3.5!" aria-hidden="true" />
          <span className="grow">Pin to end</span>
          {isPinned === "end" && <CheckIcon className="text-primary size-4 opacity-100!" />}
        </DropdownMenuItem>
      )
      hasPreviousSection = true
    }

    // Move section
    if (props.tableLayout?.columnsMovable) {
      if (hasPreviousSection) {
        items.push(<DropdownMenuSeparator key="sep-move" />)
      }
      items.push(
        <DropdownMenuItem
          key="move-left"
          onClick={() => {
            if (columnIndex > 0) {
              const newOrder = [...columnOrder]
              const [movedColumn] = newOrder.splice(columnIndex, 1)
              newOrder.splice(columnIndex - 1, 0, movedColumn)
              table.setColumnOrder(newOrder)
            }
          }}
          disabled={!canMoveLeft || isPinned !== false}
        >
          <ArrowLeftIcon className="size-3.5!" aria-hidden="true" />
          <span>Move toward start</span>
        </DropdownMenuItem>,
        <DropdownMenuItem
          key="move-right"
          onClick={() => {
            if (columnIndex < columnOrder.length - 1) {
              const newOrder = [...columnOrder]
              const [movedColumn] = newOrder.splice(columnIndex, 1)
              newOrder.splice(columnIndex + 1, 0, movedColumn)
              table.setColumnOrder(newOrder)
            }
          }}
          disabled={!canMoveRight || isPinned !== false}
        >
          <ArrowRightIcon className="size-3.5!" aria-hidden="true" />
          <span>Move toward end</span>
        </DropdownMenuItem>
      )
      hasPreviousSection = true
    }

    // Visibility section
    if (props.tableLayout?.columnsVisibility && visibility) {
      if (hasPreviousSection) {
        items.push(<DropdownMenuSeparator key="sep-visibility" />)
      }
      items.push(
        <DropdownMenuSub key="visibility">
          <DropdownMenuSubTrigger>
            <Settings2Icon className="size-3.5!" />
            <span>Columns</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {table
              .getAllColumns()
              .filter((col) => col.getCanHide())
              .map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={col.getIsVisible()}
                  onSelect={(event) => event.preventDefault()}
                  onCheckedChange={(value) => col.toggleVisibility(!!value)}
                  className="capitalize"
                >
                  {getColumnHeaderLabel(col)}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      )
    }

    return items
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filter,
    canSort,
    isSorted,
    column,
    props.tableLayout?.columnsPinnable,
    props.tableLayout?.columnsMovable,
    props.tableLayout?.columnsVisibility,
    canPin,
    isPinned,
    canMoveLeft,
    canMoveRight,
    visibility,
    table,
    columnIndex,
    columnOrder,
    columnVisibilityKey, // Needed to update checkbox states when visibility changes
  ])

  if (hasControls) {
    return (
      <div ref={headerRef} className="flex h-full min-w-0 items-center justify-between gap-1.5">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  className={cn(
                    headerButtonClassName,
                    "min-w-0 flex-1 shrink justify-start overflow-hidden"
                  )}
                  disabled={isLoading || recordCount === 0}
                />
              }
            >
              {icon && icon}
              <span className="min-w-0 truncate">{resolvedTitle}</span>
              {sortIcon}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-40"
              align="start"
              positionerProps={{
          collisionBoundary: collisionBoundary ?? "clipping-ancestors",
          collisionPadding: 8,
          collisionAvoidance: { side: "flip", align: "shift" },
        }}
            >
              {menuItems}
            </DropdownMenuContent>
          </DropdownMenu>
          {filterControl}
        </div>
        {props.tableLayout?.columnsPinnable && canPin && isPinned && (
          <Button
            size="icon-xs"
            variant="ghost"
            className="-me-1 size-7 shrink-0 rounded-md"
            onClick={() => column.pin(false)}
            aria-label={`Unpin ${resolvedTitle} column`}
            title={`Unpin ${resolvedTitle} column`}
          >
            <PinOffIcon className="size-3.5! opacity-50!" aria-hidden="true" />
          </Button>
        )}
      </div>
    )
  }

  if (canSort || (props.tableLayout?.columnsResizable && canResize)) {
    return (
      <div className="flex h-full items-center gap-1">
        <Button
          variant="ghost"
          className={headerButtonClassName}
          disabled={isLoading || recordCount === 0}
          onClick={handleSort}
        >
          {icon && icon}
          {resolvedTitle}
          {sortIcon}
        </Button>
        {filterControl}
      </div>
    )
  }

  return (
    <div className="flex h-full w-full items-center justify-between gap-1">
      <div className={headerLabelClassName}>
        {icon && icon}
        {resolvedTitle}
      </div>
      {filterControl}
    </div>
  )
}

const DataGridColumnHeader = memo(DataGridColumnHeaderInner) as typeof DataGridColumnHeaderInner

export { DataGridColumnHeader, type DataGridColumnHeaderProps }
