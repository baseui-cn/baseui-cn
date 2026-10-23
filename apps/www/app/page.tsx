import type { Metadata } from "next"
import "@/styles/landing.css"
import Link from "next/link"
import { SiteHeader } from "@/components/shared/site-header"
import { SiteFooter } from "@/components/shared/site-footer"
import { HomeShowcase } from "@/components/shared/home-showcase"
import { SetupBuilder, QuickInstall, CreateProjectTrigger } from "@/components/shared/setup-builder"
import { HomeThemeProvider } from "@/components/shared/home-theme-provider"
import { HomeThemePreview } from "@/components/shared/home-theme-preview"
import { latestChangelogEntry } from "@/lib/changelog"
import { components } from "@/lib/registry"
import { siteConfig } from "@/lib/site-config"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/blocks"
import {
  ArrowRightIcon,
  CheckIcon,
  ArrowUpRightIcon,
  BracesIcon,
  CodeIcon,
  CommandIcon,
  FileCodeIcon,
  FolderIcon,
  GitBranchIcon,
  KeyboardIcon,
  LayersIcon,
} from "lucide-react"

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
    <HomeThemeProvider>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="home-page flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData) }}
        />
        <section className="home-section home-hero-section">
          <div className="home-container home-hero">
            <div className="home-hero-copy">
              <span className="home-eyebrow">
                <span className="home-iris-mark" /> BASE UI · COPY-AND-OWN REACT COMPONENTS
              </span>
              <h1>
                <span className="hero-title-line">Accessible React components.</span>
                <span>Own the source. Build your system.</span>
              </h1>
              <p className="home-description">
                An accessible, copy-and-own React component library built with Base UI and Tailwind
                CSS. Bring editable source into your project and make every detail yours.
              </p>
              <div className="home-hero-actions">
                <CreateProjectTrigger />
                <Button
                  size="xl"
                  variant="outline"
                  render={<Link href="/docs/components/button" />}
                >
                  Browse components
                </Button>
              </div>
            </div>
          </div>
          <div className="home-framework-strip">
            <div className="home-container">
              <span>WORKS WITH</span>
              <span>Next.js</span>
              <span>TanStack Start</span>
              <span>React Router</span>
              <span>Vite</span>
              <span>React</span>
            </div>
          </div>
        </section>
        <section className="home-section home-showcase-section">
          <div className="home-container">
            <div className="home-grid-heading">
              <div>
                <span className="home-eyebrow">01 / BUILT TO WORK TOGETHER</span>
                <h2>Your next interface, taking shape.</h2>
                <p className="home-description">
                  Filter work, pick a date, edit a task. Real components, working together.
                </p>
              </div>
              <Link className="home-text-link" href="/docs/components/data-grid">
                Explore data components <ArrowUpRightIcon size={15} aria-hidden="true" />
              </Link>
            </div>
            <HomeShowcase />
          </div>
        </section>
        <section className="home-section">
          <div className="home-container home-install">
            <div>
              <span className="home-eyebrow">02 / FROM ZERO TO COMPONENT</span>
              <h2>
                Less setup.
                <br />
                More building.
              </h2>
              <p className="home-description">
                Initialize once. Add what you need. Framework-aware setup finds your app, your
                package manager and your workspace.
              </p>
              <Link className="home-text-link" href="/docs/installation">
                Follow the installation guide <ArrowRightIcon size={15} aria-hidden="true" />
              </Link>
            </div>
            <QuickInstall />
          </div>
        </section>
        <section className="home-section home-source-section">
          <div className="home-container home-install">
            <div>
              <span className="home-eyebrow">03 / OWN EVERY LINE</span>
              <h2>The source is the point.</h2>
              <p className="home-description">
                The CLI brings components into your project. Change the markup, adjust the styles,
                or build something entirely new. Updates happen on your terms.
              </p>
              <ul className="home-source-points">
                <li>
                  <CheckIcon size={15} aria-hidden="true" /> Editable TypeScript and CSS
                </li>
                <li>
                  <CheckIcon size={15} aria-hidden="true" /> No baseui-cn runtime package to depend
                  on
                </li>
                <li>
                  <CheckIcon size={15} aria-hidden="true" /> Base UI handles the behavior underneath
                </li>
              </ul>
              <Link className="home-text-link" href="/docs">
                How copy-and-own works <ArrowRightIcon size={15} aria-hidden="true" />
              </Link>
            </div>
            <div className="source-exhibit">
              <div className="source-exhibit-heading">
                <CodeIcon size={14} aria-hidden="true" /> CLI{" "}
                <ArrowRightIcon size={13} aria-hidden="true" /> your project{" "}
                <ArrowRightIcon size={13} aria-hidden="true" /> your source
              </div>
              <div className="source-tree">
                <span>
                  <FolderIcon size={14} aria-hidden="true" /> my-app
                </span>
                <span>
                  <FolderIcon size={14} aria-hidden="true" /> components / ui
                </span>
                <span>
                  <FileCodeIcon size={14} aria-hidden="true" /> button.tsx{" "}
                  <span>YOURS TO EDIT</span>
                </span>
              </div>
              <div className="source-file-label">
                <FileCodeIcon size={14} aria-hidden="true" /> components/ui/button.tsx
              </div>
              <pre tabIndex={0} role="region" aria-label="Editable component source example">
                <code>
                  <span className="source-comment">{"// Your component. Your decisions."}</span>
                  {"\n"}
                  <span className="source-keyword">import</span> {"{ Button as ButtonPrimitive }"}
                  {"\n"} <span className="source-keyword">from</span>{" "}
                  <span className="source-string">{'"@base-ui/react/button"'}</span>
                  {"\n\n"}
                  <span className="source-keyword">export function</span> Button(props) {"{"}
                  {"\n"} <span className="source-keyword">return</span> &lt;ButtonPrimitive{" "}
                  {"{...props}"} /&gt;{"\n"}
                  {"}"}
                </code>
              </pre>
              <div className="source-exhibit-footer">
                <GitBranchIcon size={14} aria-hidden="true" /> Tracked in your repo. Shipped with
                your app.
              </div>
            </div>
            <div className="home-source-faq">
              {homeFaqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section className="home-section">
          <div className="home-container">
            <div className="home-grid-heading">
              <div>
                <span className="home-eyebrow">04 / YOUR DESIGN LANGUAGE</span>
                <h2>A theme that speaks your language.</h2>
                <p className="home-description">
                  26 familiar CSS variables. Light and dark, considered together.
                  <br className="hidden sm:block" /> No proprietary --cn-* names to learn. Just your
                  design decisions.
                </p>
              </div>
              <Link href="/docs/theming" className="home-text-link">
                Explore theming <ArrowRightIcon size={15} aria-hidden="true" />
              </Link>
            </div>
            <HomeThemePreview />
          </div>
        </section>
        <section className="home-section">
          <div className="home-container">
            <div className="home-grid-heading">
              <div>
                <span className="home-eyebrow">05 / THE COMPONENT LIBRARY</span>
                <h2>
                  Good foundations.
                  <br />
                  All the way down.
                </h2>
              </div>
              <Link href="/docs/components/button" className="home-text-link">
                Browse all {componentCount} components{" "}
                <ArrowRightIcon size={15} aria-hidden="true" />
              </Link>
            </div>
            <div className="home-catalog">
              {[
                {
                  title: "Inputs & choices",
                  icon: CommandIcon,
                  names: ["input", "select", "combobox", "command", "date-picker", "time-picker"],
                },
                {
                  title: "Layers & focus",
                  icon: LayersIcon,
                  names: ["dialog", "drawer", "popover", "dropdown-menu", "tooltip", "toast"],
                },
                {
                  title: "Structure & data",
                  icon: BracesIcon,
                  names: ["tabs", "accordion", "table", "data-grid", "card", "scroll-area"],
                },
              ].map((group) => (
                <div key={group.title}>
                  <h3>
                    <group.icon size={18} aria-hidden="true" /> {group.title}
                  </h3>
                  {group.names.map((name) => {
                    const c = components.find((item) => item.name === name)
                    return c ? (
                      <Link key={name} href={`/docs/components/${name}`}>
                        <span>{c.label}</span>
                        <ArrowUpRightIcon size={14} aria-hidden="true" />
                      </Link>
                    ) : null
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="home-section home-foundation-section">
          <div className="home-container">
            <div className="home-foundation-heading">
              <span className="home-eyebrow">06 / WHY BASE UI</span>
              <h2>
                The details you notice.
                <br />
                The foundations you trust.
              </h2>
              <p className="home-description">
                Built on Base UI, the unstyled React component library from the creators of Material
                UI and Radix. A shared behavior layer for interfaces that hold together.
              </p>
            </div>
            <div className="home-foundations">
              {[
                {
                  icon: KeyboardIcon,
                  title: "Keyboard & focus",
                  text: "Keyboard navigation, focus management and accessible semantics built into the primitives.",
                },
                {
                  icon: LayersIcon,
                  title: "Layers that cooperate",
                  text: "Positioning, portals and dismiss behavior designed to work across menus, dialogs and popovers.",
                },
                {
                  icon: CodeIcon,
                  title: "Room to compose",
                  text: "Unstyled primitives underneath. Your markup, styling and component composition on top.",
                },
              ].map((item) => (
                <div key={item.title}>
                  <item.icon size={20} aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
            <a
              href="https://base-ui.com/react/overview/about"
              className="home-text-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Meet Base UI <ArrowUpRightIcon size={14} aria-hidden="true" />
            </a>
          </div>
        </section>
        <section className="home-section home-blocks-section">
          <div className="home-container">
            <div className="home-grid-heading">
              <div>
                <span className="home-eyebrow">07 / SKIP THE BLANK CANVAS</span>
                <h2>A few pieces, already together.</h2>
                <p className="home-description">
                  {blockCount} real blocks. The same components, composed into useful starting
                  points.
                </p>
              </div>
            </div>
            <div className="home-blocks">
              <div className="block-live-preview">
                <span className="source-file-label">Empty State / live block preview</span>
                <EmptyState
                  icon={<LayersIcon size={20} aria-hidden="true" />}
                  title="Make room for your next idea."
                  description="A clear next step, even when there's nothing to show."
                  action={
                    <Button variant="outline" render={<Link href="/docs/components/empty-state" />}>
                      Explore this block <ArrowRightIcon size={14} aria-hidden="true" />
                    </Button>
                  }
                />
              </div>
              <div className="home-block-list">
                {components
                  .filter((c) => c.type === "block")
                  .map((block) => (
                    <Link key={block.name} href={`/docs/components/${block.name}`}>
                      <div>
                        <h3>{block.label}</h3>
                        <p>{block.description}</p>
                        <code>{block.installedPath}</code>
                      </div>
                      <ArrowUpRightIcon size={17} aria-hidden="true" />
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </section>
        <section className="home-section">
          <div className="home-container home-resource-strip">
            <Link href={`/docs/changelog#${latestChangelogEntry.slug}`}>
              <div>
                <span className="home-eyebrow">IN THE REPO</span>
                <h3>{latestChangelogEntry.title}</h3>
                <p>Follow the latest changes.</p>
              </div>
              <ArrowUpRightIcon size={18} aria-hidden="true" />
            </Link>
            <Link href="/docs/llms">
              <div>
                <span className="home-eyebrow">IN YOUR EDITOR</span>
                <h3>Documentation for your workflow.</h3>
                <p>Examples, API references and Markdown exports.</p>
              </div>
              <ArrowUpRightIcon size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>
        <section className="home-final">
          <div className="home-container">
            <span className="home-eyebrow">START WITH A STRONG FOUNDATION</span>
            <h2>
              Build with components
              <br />
              you actually own.
            </h2>
            <div className="home-hero-actions">
              <CreateProjectTrigger />
              <Button size="xl" variant="outline" render={<Link href="/docs/components/button" />}>
                Browse components
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <SetupBuilder />
    </HomeThemeProvider>
  )
}
