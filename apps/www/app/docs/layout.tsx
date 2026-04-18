import type { Metadata } from "next"
import { SiteHeader } from "@/components/shared/site-header"
// import { AppHeader } from "@/components/shared/app-header"
import { DocsSidebar } from "@/components/docs/docs-sidebar"
import { DocsContentTransition } from "@/components/docs/docs-content-transition"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: {
    default: "Docs",
    template: `%s — ${siteConfig.name}`,
  },
  description:
    `Documentation for ${siteConfig.name}. Installation, theming, ` +
    "and component reference for all Base UI components.",
  openGraph: {
    title: `Docs — ${siteConfig.name}`,
    description: "Component docs, installation guide, and theming reference.",
    url: `${siteConfig.url}/docs`,
  },
  alternates: {
    canonical: `${siteConfig.url}/docs`,
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
              <DocsContentTransition>{children}</DocsContentTransition>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
