import { notFound } from "next/navigation"
import type React from "react"
import { readFile } from "fs/promises"
import { join } from "path"
import { mdxComponents, Callout } from "@/components/docs/mdx-components"
import { CodeBlock } from "@/components/docs/code-block"
import { CodeTabs } from "@/components/docs/code-tabs"
import { InstallTabs } from "@/components/docs/install-tabs"
import { PackageManagerTabs } from "@/components/docs/package-manager-tabs"
import { ComponentPreviewWrapper } from "@/components/docs/component-preview-wrapper"
import { DocsToc } from "@/components/docs/docs-toc"
import { DocsTocDropdown } from "@/components/docs/docs-toc"
import { getComponent } from "@/lib/registry"
import { getRegistryFileContent } from "@/lib/registry-server"
import { ComponentPreviewMdx } from "@/components/docs/component-preview-mdx"
import { ComponentSource } from "@/components/docs/component-source"
import { DocsActionsMenu } from "@/components/docs/docs-actions-menu"
import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"
import { TrackComponentView } from "@/components/shared/track-page-view"
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { source } from "@/lib/source"

const PREVIEW_SOURCES_PATH = join(process.cwd(), "lib/__generated__/preview-sources.json")
const DOCS_MARKDOWN_PATH = join(process.cwd(), "lib/__generated__/docs-markdown.json")

type TocItem = { title: string; url: string; depth: number; items?: TocItem[] }
type DocsPageData = {
  title?: string
  description?: string
  toc?: unknown
  body: React.ComponentType<{ components?: Record<string, unknown> }>
}

async function loadPreviewSources(): Promise<Record<string, string>> {
  try {
    const raw = await readFile(PREVIEW_SOURCES_PATH, "utf-8")
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

async function loadDocsMarkdown(): Promise<Record<string, string>> {
  try {
    const raw = await readFile(DOCS_MARKDOWN_PATH, "utf-8")
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function normalizeToc(toc: unknown): TocItem[] {
  if (!Array.isArray(toc)) return []

  return toc.flatMap((item) => {
    const title = readTocTitle(item)

    if (
      !item ||
      typeof item !== "object" ||
      !title ||
      typeof item.url !== "string"
    ) {
      return []
    }

    return [
      {
        title,
        url: item.url,
        depth: typeof item.depth === "number" ? item.depth : 2,
        items: normalizeToc("items" in item ? item.items : undefined),
      },
    ]
  })
}

function readTocTitle(value: unknown): string | null {
  if (!value || typeof value !== "object" || !("title" in value)) return null

  return readTocTitleNode(value.title)
}

function readTocTitleNode(value: unknown): string | null {
  if (typeof value === "string" || typeof value === "number") {
    const title = String(value).trim()
    return title.length > 0 ? title : null
  }

  if (Array.isArray(value)) {
    const title = value
      .map((item) => readTocTitleNode(item) ?? "")
      .join("")
      .trim()

    return title.length > 0 ? title : null
  }

  if (value && typeof value === "object" && "props" in value) {
    const props = value.props as { children?: unknown } | undefined
    return readTocTitleNode(props?.children)
  }

  return null
}

export async function generateStaticParams() {
  return source
    .generateParams()
    .filter((params) => Array.isArray(params.slug) && params.slug.length === 1)
    .map((params) => ({ slug: params.slug[0]! }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = source.getPage([slug])
  const comp = getComponent(slug)
  const title =
    page?.data.title ??
    comp?.label ??
    slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  const description = page?.data.description ?? comp?.description ?? `${title} component for Base UI.`
  const url = `${siteConfig.url}/docs/components/${slug}`

  return {
    title,
    description,
    openGraph: {
      title: `${title} - ${siteConfig.name}`,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - baseui-cn`,
      description,
      images: ["/opengraph-image"],
    },
    alternates: {
      canonical: url,
    },
  }
}

function CodeBlockMdx(props: React.ComponentProps<typeof CodeBlock>) {
  return <CodeBlock {...props} />
}

function CodeTabsMdx(props: React.ComponentProps<typeof CodeTabs>) {
  return <CodeTabs {...props} />
}

function PackageManagerTabsMdx(props: React.ComponentProps<typeof PackageManagerTabs>) {
  return <PackageManagerTabs {...props} />
}

function TabsListMdx(props: React.ComponentProps<typeof TabsList>) {
  return <TabsList {...props} />
}

function TabsTriggerMdx(props: React.ComponentProps<typeof TabsTrigger>) {
  return <TabsTrigger {...props} />
}

function TabsContentMdx(props: React.ComponentProps<typeof TabsContent>) {
  return <TabsContent {...props} />
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = source.getPage([slug])

  if (!page) notFound()
  const docsPage = page as typeof page & { data: DocsPageData }

  const comp = getComponent(slug)
  const [registryData, previewSources, docsMarkdown] = await Promise.all([
    getRegistryFileContent(slug),
    loadPreviewSources(),
    loadDocsMarkdown(),
  ])
  const sourceCode = registryData?.code ?? ""
  const title =
    docsPage.data.title ??
    comp?.label ??
    slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  const description = docsPage.data.description ?? comp?.description
  const markdown = docsMarkdown[slug] ?? ""
  const pageUrl = `${siteConfig.url}/docs/components/${slug}`
  const toc = normalizeToc(docsPage.data.toc)
  const MDX = docsPage.data.body

  const components = {
    ...mdxComponents,
    Preview: ({ slug: previewSlug }: { slug: string }) => (
      <ComponentPreviewWrapper
        slug={previewSlug}
        code={sourceCode}
        previewCode={previewSources[`${previewSlug}-demo`] ?? previewSources[previewSlug] ?? ""}
      />
    ),
    ComponentPreview: ({ name }: { name: string }) => (
      <ComponentPreviewMdx
        name={name}
        code={sourceCode}
        previewCode={previewSources[name] ?? ""}
      />
    ),
    ComponentSource: ({ name, title: componentTitle }: { name: string; title?: string }) => (
      <ComponentSource
        name={name}
        title={getComponent(name)?.installedPath ?? componentTitle}
        code={sourceCode}
      />
    ),
    InstallTabs: (props: React.ComponentProps<typeof InstallTabs>) => (
      <InstallTabs {...props} installedPath={getComponent(props.slug)?.installedPath} />
    ),
    CodeBlock: CodeBlockMdx,
    CodeTabs: CodeTabsMdx,
    PackageManagerTabs: PackageManagerTabsMdx,
    TabsList: TabsListMdx,
    TabsTrigger: TabsTriggerMdx,
    TabsContent: TabsContentMdx,
    Callout,
  }

  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_13rem] xl:gap-10">
      <article className="mx-auto w-full max-w-3xl min-w-0">
        <TrackComponentView component={slug} />

        {toc.length > 0 && (
          <div className="mb-6 xl:hidden">
            <DocsTocDropdown toc={toc} />
          </div>
        )}

        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="mb-2 text-3xl font-bold tracking-tight">{title}</h1>
              {description ? <p className="text-base text-muted-foreground">{description}</p> : null}
            </div>
            <DocsActionsMenu markdown={markdown} pageUrl={pageUrl} title={title} />
          </div>
          {comp?.type === "block" && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded bg-muted px-2 py-1 font-mono">{comp.installedPath}</span>
              <span>export</span>
              <span className="rounded bg-muted px-2 py-1 font-mono">
                {registryData?.exportName ?? comp.exportName}
              </span>
            </div>
          )}
          {comp && (comp.badge || comp.tags?.length) && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {comp.badge ? (
                <span className="rounded bg-foreground px-1.5 py-0.5 text-[10px] font-semibold text-background">
                  {comp.badge}
                </span>
              ) : null}
              {comp.tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <MDX components={components} />

        {comp?.baseUIPrimitive && !comp.baseUIPrimitive.startsWith("native") && (
          <div className="mt-12 rounded-lg border border-border bg-muted/30 p-5">
            <h2 className="mb-1.5 text-sm font-semibold">API Reference</h2>
            <p className="text-sm text-muted-foreground">
              See the{" "}
              <a
                href={`https://base-ui.com/react/components/${slug}#api-reference`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80"
              >
                Base UI {comp.baseUIPrimitive} documentation
              </a>{" "}
              for the full API reference, including all props, data attributes, and CSS classes.
            </p>
          </div>
        )}
      </article>

      {toc.length > 0 && (
        <aside className="sticky top-20 hidden self-start xl:block">
          <DocsToc toc={toc} />
        </aside>
      )}
    </div>
  )
}
