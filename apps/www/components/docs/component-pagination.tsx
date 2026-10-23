import Link from "next/link"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { navSections } from "@/lib/registry"

export function ComponentPagination({ slug }: { slug: string }) {
  const items = navSections
    .flatMap((section) => section.items)
    .filter((item) => item.href.startsWith("/docs/components/"))
  const index = items.findIndex((item) => item.name === slug)
  if (index < 0) return null
  const previous = items[index - 1]
  const next = items[index + 1]
  return (
    <nav aria-label="Component pagination" className="component-pagination">
      {previous ? (
        <Link href={previous.href}>
          <span>
            <ArrowLeftIcon size={16} aria-hidden="true" /> Previous
          </span>
          {previous.label}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.href} className="text-right">
          <span className="justify-end">
            Next <ArrowRightIcon size={16} aria-hidden="true" />
          </span>
          {next.label}
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}
