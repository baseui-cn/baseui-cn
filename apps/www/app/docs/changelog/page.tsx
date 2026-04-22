import type { Metadata } from "next"
import { ChevronDownIcon } from "lucide-react"
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@/components/ui/collapsible"
import { changelogEntries } from "@/lib/changelog"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Product updates, new component releases, docs improvements, and installability changes across baseui-cn.",
  alternates: {
    canonical: `${siteConfig.url}/docs/changelog`,
  },
  openGraph: {
    title: `Changelog - ${siteConfig.name}`,
    description:
      "Product updates, new component releases, docs improvements, and installability changes across baseui-cn.",
    url: `${siteConfig.url}/docs/changelog`,
    images: ["/baseui-cn-og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: `Changelog - ${siteConfig.name}`,
    description:
      "Product updates, new component releases, docs improvements, and installability changes across baseui-cn.",
    images: ["/baseui-cn-og.png"],
  },
}

export default function ChangelogPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 animate-fade-in">
      <div className="flex flex-col gap-3 border-b border-border pb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Recent Releases
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Changelog</h1>
        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
          Short release notes you can scan quickly. Open any update for the implementation details,
          then jump into the component docs to use the new patterns in your own UI.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2 text-sm">
          <a
            href="/docs/components/button"
            className="text-foreground underline underline-offset-4"
          >
            Browse components
          </a>
          <a
            href="/docs/changelog/rss.xml"
            className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            RSS feed
          </a>
        </div>
      </div>

      <div className="grid gap-5">
        {changelogEntries.map((release, index) => (
          <section
            key={release.slug}
            id={release.slug}
            className="rounded-2xl border border-border bg-background p-6 shadow-xs/5"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {release.date}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-foreground">{release.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {release.summary}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
                  {release.badge}
                </span>
                <span className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground">
                  Release {String(changelogEntries.length - index).padStart(2, "0")}
                </span>
              </div>
            </div>

            {release.examples?.length ? (
              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {release.examples.map((example) => (
                  <a
                    key={example.href + example.label}
                    href={example.href}
                    className="rounded-xl border border-border/60 bg-muted/20 px-4 py-4 transition-colors hover:bg-muted/35"
                  >
                    <p className="text-sm font-medium text-foreground">{example.label}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {example.description}
                    </p>
                  </a>
                ))}
              </div>
            ) : null}

            <Collapsible className="mt-5 rounded-xl border border-border/60 bg-muted/10">
              <CollapsibleTrigger className="data-panel-open:[&_svg]:rotate-180 flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-medium text-foreground">
                More details
                <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-200" />
              </CollapsibleTrigger>
              <CollapsiblePanel>
                <div className="grid gap-3 border-t border-border/60 px-4 py-4">
                  {release.notes.map((note) => (
                    <div
                      key={note}
                      className="rounded-xl border border-border/60 bg-background px-4 py-3 text-sm leading-relaxed text-muted-foreground"
                    >
                      {note}
                    </div>
                  ))}

                  {release.links?.length ? (
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-sm">
                      {release.links.map((link) => (
                        <a
                          key={link.href + link.label}
                          href={link.href}
                          className="text-foreground underline underline-offset-4"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              </CollapsiblePanel>
            </Collapsible>
          </section>
        ))}
      </div>
    </div>
  )
}
