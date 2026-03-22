import { notFound } from "next/navigation"
import { readFile, readdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { MDXRemote } from "next-mdx-remote/rsc"
import { mdxComponents, Callout } from "@/components/docs/mdx-components"
import { InstallTabs } from "@/components/docs/install-tabs"
import { ComponentPreviewWrapper } from "@/components/docs/component-preview-wrapper"
import { DocsToc } from "@/components/docs/docs-toc"
import { DocsTocDropdown } from "@/components/docs/docs-toc"
import { getComponent } from "@/lib/registry"
import { getRegistryFileContent } from "@/lib/registry-server"
import { ComponentPreviewMdx } from "@/components/docs/component-preview-mdx"
import { ComponentSource } from "@/components/docs/component-source"
import type { Metadata } from "next"

const CONTENT_DIR = join(process.cwd(), "content/docs/components")

export async function generateStaticParams() {
  try {
    const files = await readdir(CONTENT_DIR)
    return files.filter((f) => f.endsWith(".mdx")).map((f) => ({ slug: f.replace(".mdx", "") }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const comp = getComponent(slug)
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  return {
    title,
    description: comp?.description ?? `${title} component for Base UI.`,
  }
}

function extractToc(source: string) {
  const toc: { title: string; url: string; depth: number }[] = []
  const headingRe = /^(#{2,4})\s+(.+)$/gm
  let match: RegExpExecArray | null
  while ((match = headingRe.exec(source)) !== null) {
    const depth = match[1].length
    const title = match[2].trim()
    const url =
      "#" +
      title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
    toc.push({ title, url, depth })
  }
  return toc
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const mdxPath = join(CONTENT_DIR, `${slug}.mdx`)

  if (!existsSync(mdxPath)) notFound()

  const source = await readFile(mdxPath, "utf-8")
  const toc = extractToc(source)
  const comp = getComponent(slug)
  const registryData = await getRegistryFileContent(slug)
  const sourceCode = registryData?.code ?? ""

  // Derive display title from slug
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

  const components = {
    ...mdxComponents,
    Preview: ({ slug: s }: { slug: string }) => <ComponentPreviewWrapper slug={s} code={sourceCode} />,
    ComponentPreview: ({ name }: { name: string }) => (
      <ComponentPreviewMdx name={name} code={sourceCode} />
    ),
    ComponentSource: ({ name, title: t }: { name: string; title?: string }) => (
      <ComponentSource name={name} title={t} code={sourceCode} />
    ),
    InstallTabs: (props: React.ComponentProps<typeof InstallTabs>) => <InstallTabs {...props} />,
    Callout,
  }

  return (
    <div className="flex gap-10">
      {/* MDX content */}
      <article className="flex-1 min-w-0 max-w-none">
        {/* Mobile TOC */}
        {toc.length > 0 && (
          <div className="mb-6 xl:hidden">
            <DocsTocDropdown toc={toc} />
          </div>
        )}

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">{title}</h1>
          {comp?.description && (
            <p className="text-muted-foreground text-base">{comp.description}</p>
          )}
          {comp && (comp.badge || comp.tags?.length) && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {comp.badge && (
                <span className="text-[10px] font-semibold bg-foreground text-background rounded px-1.5 py-0.5">
                  {comp.badge}
                </span>
              )}
              {comp.tags?.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[11px] bg-muted px-2 py-0.5 rounded text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* MDX body — frontmatter stripped via parseFrontmatter */}
        <MDXRemote
          source={source}
          components={components}
          options={{ parseFrontmatter: true }}
        />
      </article>

      {/* Desktop TOC */}
      {toc.length > 0 && (
        <aside className="sticky top-20 hidden xl:block w-52 shrink-0 self-start">
          <DocsToc toc={toc} />
        </aside>
      )}
    </div>
  )
}
