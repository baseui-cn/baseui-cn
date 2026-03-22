import * as React from "react"
import { notFound } from "next/navigation"
import { DocsSidebar } from "@/components/docs/docs-sidebar"
import { SiteHeader } from "@/components/shared/site-header"
import { DocsToc } from "@/components/docs/docs-toc"
import { cn } from "@/lib/utils"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex flex-1">
        {/* Left sidebar */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r border-border lg:block">
          <DocsSidebar />
        </aside>

        {/* Main content */}
        <main className="flex flex-1 min-w-0 justify-center">
          <div className="w-full max-w-3xl px-6 py-10 lg:px-10">
            {children}
          </div>
        </main>

        {/* Right TOC — rendered per-page via slot or global pattern */}
        {/* TOC is injected by each page component — see [slug]/page.tsx */}
      </div>
    </div>
  )
}
