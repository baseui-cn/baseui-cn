import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/shared/site-header"
import { SiteFooter } from "@/components/shared/site-footer"
import { HomeShowcase } from "@/components/shared/home-showcase"
import { PackageManagerTabs } from "@/components/docs/package-manager-tabs"
import { ComponentsGrid } from "@/components/shared/components-grid"
import { latestChangelogEntry } from "@/lib/changelog"
import { components } from "@/lib/registry"
import { siteConfig } from "@/lib/site-config"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "lucide-react"

export const dynamic = "force-dynamic"

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
    "Copy-paste React components built with Base UI and Tailwind CSS, including buttons, forms, data display, OTP fields, and production-ready date and time pickers.",
  keywords: homeKeywords,
  openGraph: {
    title: "Base UI Components for React - shadcn-style Registry",
    description:
      "Copy-paste React components built with Base UI and Tailwind CSS, including buttons, forms, data display, OTP fields, and production-ready date and time pickers.",
    url: siteConfig.url,
    images: ["/baseui-cn-og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Base UI Components for React - shadcn-style Registry",
    description:
      "Copy-paste React components built with Base UI and Tailwind CSS, including buttons, forms, data display, OTP fields, and production-ready date and time pickers.",
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
          "Copy-paste React components built with Base UI and Tailwind CSS, including production-ready date and time pickers.",
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
      <main id="main-content" tabIndex={-1} className="home-page flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData) }}
        />
        <section className="home-section">
          <div className="home-container home-hero">
            <div>
              <Link href="/docs/changelog" className="home-eyebrow">
                baseui-cn · Design System V2{" "}
                <ArrowRightIcon className="inline size-[14px]" aria-hidden="true" />
              </Link>
              <h1>
                Base UI components for React.
                <br />
                <span className="text-muted-foreground">Copy. Own. Build.</span>
              </h1>
              <p className="home-description">
                Accessible React components built with Base UI and Tailwind CSS. A shadcn-style
                component library that puts the source in your project, ready to make your own.
              </p>
              <div className="mt-[28px] flex flex-wrap items-center gap-[12px]">
                <Button size="xl" render={<Link href="/docs/components/button" />}>
                  Explore components <ArrowRightIcon size={16} aria-hidden="true" />
                </Button>
                <Button size="xl" variant="outline" render={<Link href="/docs/installation" />}>
                  Installation
                </Button>
              </div>
              <div className="home-stats">
                <span>{componentCount} components</span>
                <span>{blockCount} blocks</span>
                <span>Open source · MIT</span>
              </div>
            </div>
            <HomeShowcase />
          </div>
        </section>
        <section className="home-section">
          <div className="home-container home-install">
            <div>
              <span className="home-eyebrow">Your code, from the first command</span>
              <h2>
                A component library.
                <br />
                Without the lock-in.
              </h2>
              <p className="home-description">
                Initialize your project, then add only what you need. The CLI copies editable source
                and styles into your app. Build forms, dialogs, drawers and data views on one Base
                UI primitive layer.
              </p>
              <div className="mt-[24px] flex flex-wrap items-center gap-[20px] text-[14px]">
                <Link href="/docs" className="underline underline-offset-4">
                  Read the docs
                </Link>
                <Link href="/docs/theming" className="underline underline-offset-4">
                  Theming guide
                </Link>
              </div>
            </div>
            <div className="grid min-w-0 gap-[16px]">
              <PackageManagerTabs command="baseui-cn init" />
              <PackageManagerTabs command="baseui-cn add button input dialog" />
              <p className="text-[13px] leading-[20px] text-muted-foreground">
                React · Next.js · Tailwind CSS v4 · TypeScript
              </p>
            </div>
          </div>
        </section>
        <section className="home-section">
          <div className="home-container">
            <div className="home-grid-heading">
              <div>
                <span className="home-eyebrow">The building blocks</span>
                <h2>Find your next component</h2>
              </div>
              <Link
                href="/docs/components/button"
                className="text-[14px] underline underline-offset-4"
              >
                View documentation
              </Link>
            </div>
            <ComponentsGrid components={components} />
          </div>
        </section>
        <section className="home-section">
          <div className="home-container home-install">
            <div>
              <span className="home-eyebrow">Latest update</span>
              <h2>{latestChangelogEntry.title}</h2>
              <p className="home-description">{latestChangelogEntry.summary}</p>
              <Link
                href={`/docs/changelog#${latestChangelogEntry.slug}`}
                className="mt-[20px] inline-flex min-h-[44px] items-center gap-[8px] text-[14px] underline underline-offset-4"
              >
                Read the changelog <ArrowRightIcon size={16} aria-hidden="true" />
              </Link>
            </div>
            <div>
              <span className="home-eyebrow">Documentation for your workflow</span>
              <h2>
                Readable by you.
                <br />
                Ready for your tools.
              </h2>
              <p className="home-description">
                Use component examples, API references and Markdown exports to work with your editor
                or AI assistant.
              </p>
              <Link
                href="/docs/llms"
                className="mt-[20px] inline-flex min-h-[44px] items-center gap-[8px] text-[14px] underline underline-offset-4"
              >
                LLM usage guide <ArrowRightIcon size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
        <section>
          <div className="home-container">
            <h2>Working with Base UI components</h2>
            <div className="home-faq">
              {homeFaqs.map((faq) => (
                <article key={faq.question}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
