"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { ChevronRight, MoreHorizontal } from "lucide-react"
import type * as React from "react"
import { cn } from "@/lib/utils"

import "@/styles/navigation.styles.css"

export function Breadcrumb({ ...props }: React.ComponentProps<"nav">): React.ReactElement {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />
}

export function BreadcrumbList({
  className,
  ...props
}: React.ComponentProps<"ol">): React.ReactElement {
  return (
    <ol
      className={cn(
        "breadcrumb-list-layout flex flex-wrap items-center text-muted-foreground",
        className
      )}
      data-slot="breadcrumb-list"
      {...props}
    />
  )
}

export function BreadcrumbItem({
  className,
  ...props
}: React.ComponentProps<"li">): React.ReactElement {
  return (
    <li
      className={cn("breadcrumb-item-layout inline-flex items-center", className)}
      data-slot="breadcrumb-item"
      {...props}
    />
  )
}

export function BreadcrumbLink({
  className,
  render,
  ...props
}: useRender.ComponentProps<"a">): React.ReactElement {
  const defaultProps = {
    className: cn("breadcrumb-link-layout [@media(hover:hover)]:hover:text-foreground", className),
    "data-slot": "breadcrumb-link",
  }

  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(defaultProps, props),
    render,
  })
}

export function BreadcrumbPage({
  className,
  ...props
}: React.ComponentProps<"span">): React.ReactElement {
  return (
    <span
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      data-slot="breadcrumb-page"
      {...props}
    />
  )
}

export function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">): React.ReactElement {
  return (
    <li
      aria-hidden="true"
      className={cn("breadcrumb-separator-layout", className)}
      data-slot="breadcrumb-separator"
      role="presentation"
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  )
}

export function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">): React.ReactElement {
  return (
    <span
      aria-hidden="true"
      className={className}
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  )
}
