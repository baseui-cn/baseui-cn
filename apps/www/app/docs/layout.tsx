import { SiteHeader } from "@/components/shared/site-header"
import { DocsSidebar } from "@/components/docs/docs-sidebar"

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="mx-auto w-full max-w-screen-2xl flex-1">
        <div className="flex">
          <DocsSidebar />
          <main className="flex-1 min-w-0 border-l border-border">
            <div className="mx-auto max-w-4xl px-6 py-10 md:px-8 md:py-12">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
