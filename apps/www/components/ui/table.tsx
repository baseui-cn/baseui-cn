import type * as React from "react"
import { cn } from "@/lib/utils"

import "@/styles/data.styles.css"

export type TableProps = React.ComponentProps<"table"> & {
  /**
   * When true, render only the `<table>` (no inner overflow wrapper).
   * Use when the parent already provides scrolling so sticky headers work and you avoid nested scrollbars.
   */
  disableScrollContainer?: boolean
}

export function Table({
  className,
  disableScrollContainer,
  ...props
}: TableProps): React.ReactElement {
  const tableClass = cn("table-layout w-full caption-bottom text-sm", className)
  if (disableScrollContainer) {
    return <table className={tableClass} data-slot="table" {...props} />
  }
  return (
    <div className="relative w-full overflow-x-auto" data-slot="table-container">
      <table className={tableClass} data-slot="table" {...props} />
    </div>
  )
}

export function TableHeader({
  className,
  ...props
}: React.ComponentProps<"thead">): React.ReactElement {
  return (
    <thead
      className={cn(
        "[&_tr]:border-b in-data-[slot=frame]:**:[th]:h-9 in-data-[slot=frame]:*:[tr]:border-none in-data-[slot=frame]:*:[tr]:hover:bg-transparent",
        className
      )}
      data-slot="table-header"
      {...props}
    />
  )
}

export function TableBody({
  className,
  ...props
}: React.ComponentProps<"tbody">): React.ReactElement {
  return (
    <tbody
      className={cn("[&_tr:last-child]:border-0", className)}
      data-slot="table-body"
      {...props}
    />
  )
}

export function TableFooter({
  className,
  ...props
}: React.ComponentProps<"tfoot">): React.ReactElement {
  return (
    <tfoot
      className={cn(
        "border-t border-border bg-muted font-medium [&>tr]:last:border-b-0",
        className
      )}
      data-slot="table-footer"
      {...props}
    />
  )
}

export function TableRow({ className, ...props }: React.ComponentProps<"tr">): React.ReactElement {
  return (
    <tr
      className={cn(
        "table-row-layout border-b border-border transition-colors duration-100 motion-reduce:transition-none data-[state=selected]:bg-muted",
        className
      )}
      data-slot="table-row"
      {...props}
    />
  )
}

export function TableHead({ className, ...props }: React.ComponentProps<"th">): React.ReactElement {
  return (
    <th
      className={cn(
        "h-10 whitespace-nowrap px-2.5 text-left align-middle font-medium text-muted-foreground leading-none has-[[role=checkbox]]:w-px has-[[role=checkbox]]:pe-0",
        className
      )}
      data-slot="table-head"
      {...props}
    />
  )
}

export function TableCell({ className, ...props }: React.ComponentProps<"td">): React.ReactElement {
  return (
    <td
      className={cn(
        "whitespace-nowrap p-2.5 align-middle leading-none in-data-[slot=frame]:first:p-[calc(--spacing(2.5)-1px)] in-data-[slot=frame]:last:p-[calc(--spacing(2.5)-1px)] has-[[role=checkbox]]:pe-0",
        className
      )}
      data-slot="table-cell"
      {...props}
    />
  )
}

export function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">): React.ReactElement {
  return (
    <caption
      className={cn("in-data-[slot=frame]:my-4 mt-4 text-muted-foreground text-sm", className)}
      data-slot="table-caption"
      {...props}
    />
  )
}
