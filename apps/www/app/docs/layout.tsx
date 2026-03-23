import type { Metadata } from "next"
import { SiteHeader } from "@/components/shared/site-header"
import { DocsSidebar } from "@/components/docs/docs-sidebar"

export const metadata: Metadata = {
  title: {
    default: "Docs",
    template: "%s — baseui-cn",
  },
  description:
    "Documentation for baseui-cn. Installation, theming, " +
    "and component reference for all 36 Base UI components.",
  openGraph: {
    title: "Docs — baseui-cn",
    description: "Component docs, installation guide, and theming reference.",
    url: "https://baseui-cn.com/docs",
  },
  alternates: {
    canonical: "https://baseui-cn.com/docs",
  },
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="mx-auto w-full max-w-screen-2xl flex-1">
        <div className="flex">
          <DocsSidebar />
          <main className="flex-1 min-w-0 border-l border-border">
            <div className="px-6 py-10 md:px-10 md:py-12">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
