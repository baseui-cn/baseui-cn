import type { Metadata } from "next"
import Link from "next/link"
import { LandingReveal } from "@/components/shared/landing-reveal"
import { SiteHeader } from "@/components/shared/site-header"
import { LandingTerminalDemo } from "@/components/shared/terminal"
export const dynamic = "force-dynamic"
import { CopyButton } from "@/components/shared/copy-button"
import { ComponentsGrid } from "@/components/shared/components-grid"
import { TrackCTALink } from "@/components/shared/track-page-view"
import { latestChangelogEntry } from "@/lib/changelog"
import { components } from "@/lib/registry"
import { siteConfig } from "@/lib/site-config"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, DotIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const homeKeywords = [
  "base ui components",
  "base ui react components",
  "shadcn base ui components",
  "shadcn style base ui",
  "base ui component library",
  "tailwind css components",
  "nextjs ui components",
]

export const metadata: Metadata = {
  alternates: {
    canonical: siteConfig.url,
  },
  title: "Base UI Components for React - shadcn-style Registry",
  description:
    "Shadcn-style Base UI components for React and Next.js. Copy accessible components into your project, keep the code, and avoid mixed-library overlay bugs.",
  keywords: homeKeywords,
  openGraph: {
    title: "Base UI Components for React - shadcn-style Registry",
    description:
      "Shadcn-style Base UI components for React and Next.js. Copy accessible components into your project, keep the code, and avoid mixed-library overlay bugs.",
    url: siteConfig.url,
    images: ["/baseui-cn-og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Base UI Components for React - shadcn-style Registry",
    description:
      "Shadcn-style Base UI components for React and Next.js. Copy accessible components into your project, keep the code, and avoid mixed-library overlay bugs.",
    images: ["/baseui-cn-og.png"],
  },
}

const componentCount = components.filter((c) => c.type === "component").length
const blockCount = components.filter((c) => c.type === "block").length
const homeFaqs = [
  {
    question: "Is baseui-cn a shadcn-style registry for Base UI components?",
    answer:
      "Yes. baseui-cn gives you the same copy-and-own developer experience people expect from shadcn-style tools, but the components are built on Base UI primitives instead of a mixed stack.",
  },
  {
    question: "Why use Base UI components instead of mixing Radix, Vaul, Sonner, and cmdk?",
    answer:
      "Because overlays compose more reliably when they share one primitive layer. baseui-cn keeps drawers, dialogs, selects, comboboxes, and toasts on Base UI so focus, portals, and layering stay consistent.",
  },
  {
    question: "Do I keep the code after installing a component?",
    answer:
      "Yes. Components are copied directly into your project, so you can edit the code, theme it with Tailwind CSS, and ship it without depending on a runtime component package.",
  },
]

export default function HomePage() {
  const homeStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Base UI Components for React",
        url: siteConfig.url,
        description:
          "Shadcn-style Base UI components for React and Next.js with copy-and-own installation.",
        keywords: homeKeywords.join(", "),
      },
      {
        "@type": "FAQPage",
        mainEntity: homeFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      {
        "@type": "ItemList",
        name: "baseui-cn components",
        numberOfItems: componentCount + blockCount,
        itemListElement: components.slice(0, 8).map((component, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: component.label,
          url: `${siteConfig.url}/docs/components/${component.name}`,
        })),
      },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(homeStructuredData),
          }}
        />
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-4 lg:px-0 py-8 md:py-32">
            <LandingReveal className="max-w-3xl">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                All Base UI primitives covered · one primitive library for your app
              </div>

              {/* Headline */}
              <h1 className="font-mono text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl leading-[1.1]">
                Base UI components for React.
                <br />
                <span className="text-muted-foreground">shadcn-style install.</span>
              </h1>

              <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
                An open-source registry of shadcn-style Base UI components for React and Next.js.
                Copy accessible components into your project, own the code, and build forms,
                fields, drawers, dialogs, selects, and the rest of your application on one
                primitive library with Tailwind CSS.
              </p>

              {/* Install command */}
              <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3 h-10 font-mono text-sm">
                  <span className="text-muted-foreground select-none">$</span>
                  <span className="text-foreground">npx baseui-cn init</span>
                  <CopyButton text="npx baseui-cn init " />
                </div>
                <Button size="lg" render={<Link href="/docs" />}>
                  Read docs
                  <ArrowRightIcon className="size-4" />
                </Button>
                <TrackCTALink
                  cta="star_github"
                  href={siteConfig.github}
                  external
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium hover:bg-accent transition-colors"
                />
              </div>

              {/* Stats */}
              <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground flex-wrap">
                <span>
                  <strong className="text-foreground">{componentCount}</strong> components
                </span>
                <span className="text-border">|</span>
                <span>
                  <strong className="text-foreground">{blockCount}</strong> blocks
                </span>
                <span className="text-border">|</span>
                <span>
                  <strong className="text-foreground">1</strong> primitive library for the whole app
                </span>
                <span className="text-border">|</span>
                <span>MIT license</span>
              </div>
            </LandingReveal>
          </div>
        </section>

        {/* ── No more broken interactions ─────────────────────── */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              No more broken interactions
            </h2>
            <p className="text-2xl font-semibold text-foreground mb-2 max-w-2xl">
              One overlay system. Everything composes.
            </p>
            <p className="text-muted-foreground mb-10 max-w-xl">
              If you are searching for shadcn Base UI components, baseui-cn gives you the same
              copy-and-own workflow while staying fully on Base UI primitives. That means one
              portal system, one focus model, and fewer overlay bugs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Before */}
              <div className="rounded-lg border border-border p-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive/10 text-destructive text-xs">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4 4l8 8M12 4l-8 8"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    Mixed libraries (Radix + Vaul + Sonner)
                  </span>
                </div>
                <div className="space-y-3">
                  {[
                    "Select inside Drawer breaks focus",
                    "Closing toast dismisses the Drawer",
                    "Combobox portal renders behind overlay",
                    "z-index hacks between libraries",
                  ].map((text) => (
                    <div key={text} className="flex items-start gap-2.5">
                      <span className="mt-0.5 text-destructive/70 shrink-0">
                        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M4 4l8 8M12 4l-8 8"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                      <span className="text-sm text-muted-foreground">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* After */}
              <div className="rounded-lg border border-foreground/20 bg-foreground/2 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10 text-green-500 text-xs">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8.5l3.5 3.5L13 5"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    baseui-cn (Base UI only)
                  </span>
                </div>
                <div className="space-y-3">
                  {[
                    "Select inside Drawer works correctly",
                    "Close toast — Drawer stays open",
                    "Combobox inside any overlay, no workaround",
                    "One portal system, zero z-index conflicts",
                  ].map((text) => (
                    <div key={text} className="flex items-start gap-2.5">
                      <span className="mt-0.5 text-green-500 shrink-0">
                        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M3 8.5l3.5 3.5L13 5"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="text-sm text-foreground">{text}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-xs font-medium text-muted-foreground">
                  Built for real apps, not just demos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Component preview strip ──────────────────────────── */}
        <section className="border-b border-border overflow-hidden py-10 relative">
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-background to-transparent" />

          <div className="flex animate-marquee w-max">
            {[
              {
                name: "Button",
                preview: (
                  <div className="flex flex-col gap-2">
                    <div className="inline-flex items-center justify-center rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background">
                      Button
                    </div>
                    <div className="inline-flex items-center justify-center rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground">
                      Outline
                    </div>
                  </div>
                ),
              },
              {
                name: "Badge",
                preview: (
                  <div className="flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center rounded-full bg-foreground px-2 py-0.5 text-[10px] font-semibold text-background">
                      Default
                    </span>
                    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground">
                      Secondary
                    </span>
                    <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-foreground">
                      Outline
                    </span>
                  </div>
                ),
              },
              {
                name: "Input",
                preview: (
                  <div className="flex flex-col gap-1.5 w-36">
                    <div className="text-[10px] font-medium text-foreground">Email</div>
                    <div className="flex h-8 w-full items-center rounded-md border border-border bg-background px-2.5 text-[11px] text-muted-foreground">
                      you@example.com
                    </div>
                  </div>
                ),
              },
              {
                name: "Select",
                preview: (
                  <div className="flex flex-col gap-1.5 w-36">
                    <div className="text-[10px] font-medium text-foreground">Framework</div>
                    <div className="flex h-8 w-full items-center justify-between rounded-md border border-border bg-background px-2.5 text-[11px] text-muted-foreground">
                      <span>Next.js</span>
                      <svg className="h-3 w-3 opacity-50" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M4 6l4 4 4-4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                ),
              },
              {
                name: "Avatar",
                preview: (
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                      JD
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
                      AB
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/60 text-xs font-semibold text-muted-foreground">
                      +3
                    </div>
                  </div>
                ),
              },
              {
                name: "Checkbox",
                preview: (
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-4 w-4 items-center justify-center rounded-sm border border-border bg-background"></div>
                      <span className="text-xs text-muted-foreground">Option A</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-foreground">
                        <svg
                          className="h-2.5 w-2.5 text-background"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M3 8l4 4 6-6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="text-xs text-foreground">Option B</span>
                    </div>
                  </div>
                ),
              },
              {
                name: "Switch",
                preview: (
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="relative flex h-5 w-9 items-center rounded-full bg-muted px-0.5">
                        <div className="h-4 w-4 rounded-full bg-background shadow-sm" />
                      </div>
                      <span className="text-xs text-muted-foreground">Off</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="relative flex h-5 w-9 items-center justify-end rounded-full bg-foreground px-0.5">
                        <div className="h-4 w-4 rounded-full bg-background shadow-sm" />
                      </div>
                      <span className="text-xs text-foreground">On</span>
                    </div>
                  </div>
                ),
              },
              {
                name: "Progress",
                preview: (
                  <div className="flex flex-col gap-2 w-36">
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>Loading…</span>
                      <span>68%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full w-[68%] rounded-full bg-foreground" />
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full w-[32%] rounded-full bg-muted-foreground" />
                    </div>
                  </div>
                ),
              },
            ]
              .concat([
                {
                  name: "Button",
                  preview: (
                    <div className="flex flex-col gap-2">
                      <div className="inline-flex items-center justify-center rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background">
                        Button
                      </div>
                      <div className="inline-flex items-center justify-center rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground">
                        Outline
                      </div>
                    </div>
                  ),
                },
                {
                  name: "Badge",
                  preview: (
                    <div className="flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center rounded-full bg-foreground px-2 py-0.5 text-[10px] font-semibold text-background">
                        Default
                      </span>
                      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground">
                        Secondary
                      </span>
                      <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-foreground">
                        Outline
                      </span>
                    </div>
                  ),
                },
                {
                  name: "Input",
                  preview: (
                    <div className="flex flex-col gap-1.5 w-36">
                      <div className="text-[10px] font-medium text-foreground">Email</div>
                      <div className="flex h-8 w-full items-center rounded-md border border-border bg-background px-2.5 text-[11px] text-muted-foreground">
                        you@example.com
                      </div>
                    </div>
                  ),
                },
                {
                  name: "Select",
                  preview: (
                    <div className="flex flex-col gap-1.5 w-36">
                      <div className="text-[10px] font-medium text-foreground">Framework</div>
                      <div className="flex h-8 w-full items-center justify-between rounded-md border border-border bg-background px-2.5 text-[11px] text-muted-foreground">
                        <span>Next.js</span>
                        <svg className="h-3 w-3 opacity-50" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M4 6l4 4 4-4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  ),
                },
                {
                  name: "Avatar",
                  preview: (
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                        JD
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
                        AB
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/60 text-xs font-semibold text-muted-foreground">
                        +3
                      </div>
                    </div>
                  ),
                },
                {
                  name: "Checkbox",
                  preview: (
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-2">
                        <div className="flex h-4 w-4 items-center justify-center rounded-sm border border-border bg-background"></div>
                        <span className="text-xs text-muted-foreground">Option A</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-foreground">
                          <svg
                            className="h-2.5 w-2.5 text-background"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M3 8l4 4 6-6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <span className="text-xs text-foreground">Option B</span>
                      </div>
                    </div>
                  ),
                },
                {
                  name: "Switch",
                  preview: (
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="relative flex h-5 w-9 items-center rounded-full bg-muted px-0.5">
                          <div className="h-4 w-4 rounded-full bg-background shadow-sm" />
                        </div>
                        <span className="text-xs text-muted-foreground">Off</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="relative flex h-5 w-9 items-center justify-end rounded-full bg-foreground px-0.5">
                          <div className="h-4 w-4 rounded-full bg-background shadow-sm" />
                        </div>
                        <span className="text-xs text-foreground">On</span>
                      </div>
                    </div>
                  ),
                },
                {
                  name: "Progress",
                  preview: (
                    <div className="flex flex-col gap-2 w-36">
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>Loading…</span>
                        <span>68%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full w-[68%] rounded-full bg-foreground" />
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full w-[32%] rounded-full bg-muted-foreground" />
                      </div>
                    </div>
                  ),
                },
              ])
              .map((item, i) => (
                <div
                  key={`${item.name}-${i}`}
                  className="mx-3 flex w-[200px] shrink-0 flex-col gap-3 rounded-lg border border-border bg-background p-4"
                >
                  <div className="flex min-h-[80px] items-center justify-center">
                    {item.preview}
                  </div>
                  <p className="text-center font-mono text-[11px] text-muted-foreground">
                    {item.name}
                  </p>
                </div>
              ))}
          </div>
        </section>

        {/* ── Core principles ──────────────────────────────────── */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8">
              Built differently
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
              {[
                {
                  title: "Single primitive layer",
                  body: "Every interactive component — dialogs, drawers, selects, tooltips, toasts, menus — is built on Base UI. One library, one overlay system, one portal. No conflicts when composing.",
                  icon: "⬡",
                },
                {
                  title: "Drawer & Toast without workarounds",
                  body: "Base UI Drawer (stable v1.3.0) and Toast share the same portal system as Select, Combobox, and Dialog. Nest them freely — no Vaul, no Sonner, no event conflicts.",
                  icon: "◫",
                },
                {
                  title: "Your code, fewer deps",
                  body: "Components are copied directly into your project — one primitive library instead of four or five. No Radix, no Vaul, no Sonner, no cmdk. Lighter installs, smaller bundles, one API to learn.",
                  icon: "◻",
                },
              ].map((item) => (
                <div key={item.title} className="bg-background p-8">
                  <div className="mb-4 font-mono text-2xl text-muted-foreground">{item.icon}</div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────── */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
            <h2 className="font-mono text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-8">
              How it works
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <LandingReveal className="flex flex-col gap-6">
                {[
                  {
                    step: "01",
                    cmd: "npx baseui-cn init",
                    desc: "Auto-detects your project. Installs deps, writes CSS variables, creates lib/utils.ts.",
                  },
                  {
                    step: "02",
                    cmd: "npx baseui-cn add drawer",
                    desc: "Fetches the component from the registry and copies it into your project.",
                  },
                  {
                    step: "03",
                    cmd: "import { Drawer } from '@/components/ui/drawer'",
                    desc: "Use it. Edit it. It's your code now.",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-5">
                    <Badge size="sm" className="font-mono rounded-full shrink-0 mt-1.5">
                      {item.step}
                    </Badge>
                    <div>
                      <code className="font-mono text-sm text-foreground">{item.cmd}</code>
                      <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}

                <div className="mt-4 flex flex-col">
                  <h2 className="font-mono text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                    Works with your stack
                  </h2>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                    <span>Next.js</span>
                    <DotIcon className="size-6 text-muted-foreground" />
                    <span>Vite</span>
                    <DotIcon className="size-6 text-muted-foreground" />
                    <span>Remix</span>
                    <DotIcon className="size-6 text-muted-foreground" />
                    <span>Astro</span>
                    <DotIcon className="size-6 text-muted-foreground" />
                    <span>Any React project</span>
                  </div>
                </div>
              </LandingReveal>

              {/* Terminal mockup */}
              <LandingTerminalDemo />
              <div className="hidden rounded-lg border border-border bg-[#0a0a0a] overflow-hidden">
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10">
                  <span className="h-3 w-3 rounded-full bg-white/10" />
                  <span className="h-3 w-3 rounded-full bg-white/10" />
                  <span className="h-3 w-3 rounded-full bg-white/10" />
                  <span className="ml-2 font-mono text-xs text-white/30">terminal</span>
                </div>
                <div className="p-5 font-mono text-sm space-y-2">
                  <div className="flex gap-3">
                    <span className="text-white/30">$</span>
                    <span className="text-zinc-200">npx baseui-cn init</span>
                  </div>
                  <div className="text-zinc-500 pl-6">Detecting project structure...</div>
                  <div className="text-green-400 pl-6">✓ @base-ui/react installed</div>
                  <div className="text-green-400 pl-6">
                    ✓ CSS variables added to your selected stylesheet
                  </div>
                  <div className="text-green-400 pl-6">✓ lib/utils.ts created</div>
                  <div className="mt-3 flex gap-3">
                    <span className="text-white/30">$</span>
                    <span className="text-zinc-200">npx baseui-cn add drawer select combobox</span>
                  </div>
                  <div className="text-zinc-500 pl-6">Resolving dependencies...</div>
                  <div className="text-green-400 pl-6">✓ drawer → components/ui/drawer.tsx</div>
                  <div className="text-green-400 pl-6">✓ select → components/ui/select.tsx</div>
                  <div className="text-green-400 pl-6">✓ combobox → components/ui/combobox.tsx</div>
                  <div className="text-zinc-400 pl-6 pt-1">
                    Done. Components are yours — edit freely.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Components grid ──────────────────────────────────── */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Components
              </h2>
              <Link
                href="/docs/components/button"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                View all docs →
              </Link>
            </div>
            <ComponentsGrid components={components} />
          </div>
        </section>

        {/* ── LLM / AI agents ──────────────────────────────────── */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                  AI-ready
                </h2>
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  Works with Cursor, Windsurf, and Claude
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  baseui-cn ships a first-class{" "}
                  <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">llms.txt</code>{" "}
                  manifest. AI agents read it to understand every component, its import path, usage
                  patterns, and which dependencies belong to this project.
                </p>
                <Link
                  href="/llms.txt"
                  target="_blank"
                  className="inline-flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
                >
                  View llms.txt
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-5 font-mono text-sm space-y-1.5">
                <p className="text-muted-foreground text-xs mb-3">In Cursor or Claude:</p>
                <p className="text-foreground">&quot;Add a drawer with a combobox inside&quot;</p>
                <p className="text-muted-foreground text-xs mt-3 mb-1">
                  Agent reads llms.txt, knows:
                </p>
                <p className="text-zinc-500 text-xs">→ Drawer from @/components/ui/drawer</p>
                <p className="text-zinc-500 text-xs">→ Combobox from @/components/ui/combobox</p>
                <p className="text-zinc-500 text-xs">
                  → Both share Base UI portal — no z-index fix needed
                </p>
                <p className="text-zinc-500 text-xs">→ Use render prop, not asChild</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-muted/20 p-6 md:flex-row md:items-start md:justify-between md:p-8">
              <div className="max-w-2xl">
                <p className="font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Latest release
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">
                  {latestChangelogEntry.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{latestChangelogEntry.date}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {latestChangelogEntry.summary}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
                  <Link
                    href="/docs/changelog"
                    className="text-foreground underline underline-offset-4"
                  >
                    Read the changelog
                  </Link>
                  <a
                    href="/docs/changelog/rss.xml"
                    className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
                  >
                    Subscribe via RSS
                  </a>
                </div>
              </div>

              <div className="grid gap-3 md:max-w-md">
                {latestChangelogEntry.notes.slice(0, 3).map((note) => (
                  <div
                    key={note}
                    className="rounded-xl border border-border/60 bg-background px-4 py-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    {note}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
            <div className="max-w-3xl">
              <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Common questions
              </h2>
              <p className="text-2xl font-semibold text-foreground mb-4">
                What teams ask when they want Base UI components
              </p>
              <p className="text-muted-foreground mb-10 max-w-2xl">
                baseui-cn is a Base UI-first component registry with a shadcn-style workflow.
                Start with the{" "}
                <Link href="/docs" className="text-foreground underline underline-offset-4">
                  documentation
                </Link>
                , install with{" "}
                <code className="font-mono text-xs rounded bg-muted px-1.5 py-0.5">
                  npx baseui-cn init
                </code>
                , and browse components like{" "}
                <Link
                  href="/docs/components/drawer"
                  className="text-foreground underline underline-offset-4"
                >
                  Drawer
                </Link>{" "}
                and{" "}
                <Link
                  href="/docs/components/select"
                  className="text-foreground underline underline-offset-4"
                >
                  Select
                </Link>
                .
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {homeFaqs.map((faq) => (
                <article
                  key={faq.question}
                  className="rounded-xl border border-border bg-background p-6"
                >
                  <h3 className="text-base font-semibold text-foreground">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section>
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-28 text-center">
            <h2 className="font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Start building
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              One command to initialize. One command per component. Everything else is yours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="flex items-center gap-3 rounded-lg border border-border h-10 bg-muted/30 px-4 py-3 font-mono text-sm">
                <span className="text-muted-foreground select-none">$</span>
                <span>npx baseui-cn init</span>
                <CopyButton text="npx baseui-cn init" />
              </div>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-lg h-10 bg-foreground text-background px-5 py-3 text-sm font-medium hover:bg-foreground/80 transition-colors"
              >
                Read the docs
                <ArrowRightIcon className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-mono text-xs">
            <svg
              width="20"
              height="20"
              viewBox="0 0 32 32"
              fill="none"
              className="text-foreground shrink-0"
            >
              <rect
                x="7"
                y="7"
                width="22"
                height="22"
                rx="4"
                stroke="currentColor"
                strokeWidth="1.75"
              />
              <rect
                x="1"
                y="1"
                width="22"
                height="22"
                rx="4"
                fill="hsl(var(--background))"
                stroke="currentColor"
                strokeWidth="1.75"
              />
              <rect x="6" y="7" width="12" height="4" rx="1.25" fill="currentColor" />
              <rect x="6" y="14" width="8" height="4" rx="1.25" fill="currentColor" />
            </svg>
            baseui-cn · MIT
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="https://base-ui.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Base UI
            </Link>
            <Link
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </Link>
            <a href="/llms.txt" target="_blank" className="hover:text-foreground transition-colors">
              llms.txt
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
