"use client"

import * as React from "react"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis-end", totalPages]
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis-start", totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, "ellipsis-start", currentPage - 1, currentPage, currentPage + 1, "ellipsis-end", totalPages]
}

function StandardPaginationPreview() {
  const [page, setPage] = React.useState(3)
  const totalPages = 7

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(event) => {
              event.preventDefault()
              setPage((currentPage) => Math.max(1, currentPage - 1))
            }}
            aria-disabled={page === 1}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((value) => (
          <PaginationItem key={value}>
            <PaginationLink
              href="#"
              isActive={value === page}
              onClick={(event) => {
                event.preventDefault()
                setPage(value)
              }}
            >
              {value}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(event) => {
              event.preventDefault()
              setPage((currentPage) => Math.min(totalPages, currentPage + 1))
            }}
            aria-disabled={page === totalPages}
            className={page === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

function PaginationWithEllipsisPreview() {
  const [page, setPage] = React.useState(8)
  const totalPages = 18
  const visiblePages = getVisiblePages(page, totalPages)

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(event) => {
              event.preventDefault()
              setPage((currentPage) => Math.max(1, currentPage - 1))
            }}
            aria-disabled={page === 1}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        {visiblePages.map((value, index) => (
          <PaginationItem key={`${value}-${index}`}>
            {typeof value === "number" ? (
              <PaginationLink
                href="#"
                isActive={value === page}
                onClick={(event) => {
                  event.preventDefault()
                  setPage(value)
                }}
              >
                {value}
              </PaginationLink>
            ) : (
              <PaginationEllipsis />
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(event) => {
              event.preventDefault()
              setPage((currentPage) => Math.min(totalPages, currentPage + 1))
            }}
            aria-disabled={page === totalPages}
            className={page === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

function CompactPaginationPreview() {
  const [page, setPage] = React.useState(2)
  const totalPages = 5

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3 rounded-xl border border-border/60 bg-muted/20 p-4">
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">Compact navigation</p>
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>
      </div>
      <Pagination className="justify-center">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(event) => {
                event.preventDefault()
                setPage((currentPage) => Math.max(1, currentPage - 1))
              }}
              aria-disabled={page === 1}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive render={<span />}>
              {page}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(event) => {
                event.preventDefault()
                setPage((currentPage) => Math.min(totalPages, currentPage + 1))
              }}
              aria-disabled={page === totalPages}
              className={page === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export const paginationPreviewMap: Record<string, React.ComponentType> = {
  pagination: StandardPaginationPreview,
  "pagination-demo": StandardPaginationPreview,
  "pagination-with-ellipsis": PaginationWithEllipsisPreview,
  "pagination-compact": CompactPaginationPreview,
}
