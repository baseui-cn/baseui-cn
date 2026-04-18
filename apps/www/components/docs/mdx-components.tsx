import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { CodeBlock } from "@/components/docs/code-block"
import { InstallTabs } from "@/components/docs/install-tabs"
import { ComponentPreviewWrapper } from "@/components/docs/component-preview-wrapper"
import { CodeTabs } from "@/components/docs/code-tabs"
import { ComponentSource } from "@/components/docs/component-source"
import { ComponentPreviewMdx } from "@/components/docs/component-preview-mdx"
import { PackageManagerTabs } from "@/components/docs/package-manager-tabs"
import { TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// ── Typography ─────────────────────────────────────────────────────────────

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .trim()
}

const h1 = ({ className, ...props }: React.ComponentProps<"h1">) => (
  <h1
    className={cn(
      "mt-2 scroll-mt-24 text-3xl font-bold tracking-tight",
      className
    )}
    {...props}
  />
)

const h2 = ({ className, children, ...props }: React.ComponentProps<"h2">) => {
  const id = typeof children === "string" ? slugify(children) : undefined
  return (
    <h2
      id={id}
      className={cn(
        "mt-10 scroll-mt-24 text-xl font-semibold tracking-tight first:mt-0",
        "border-b border-border pb-2",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

const h3 = ({ className, children, ...props }: React.ComponentProps<"h3">) => {
  const id = typeof children === "string" ? slugify(children) : undefined
  return (
    <h3
      id={id}
      className={cn(
        "mt-8 scroll-mt-24 text-base font-semibold tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

const h4 = ({ className, children, ...props }: React.ComponentProps<"h4">) => {
  const id = typeof children === "string" ? slugify(children) : undefined
  return (
    <h4
      id={id}
      className={cn("mt-6 scroll-mt-24 text-sm font-semibold", className)}
      {...props}
    >
      {children}
    </h4>
  )
}

const p = ({ className, ...props }: React.ComponentProps<"p">) => (
  <p
    className={cn("leading-relaxed not-first:mt-5 text-sm", className)}
    {...props}
  />
)

const a = ({ className, ...props }: React.ComponentProps<"a">) => (
  <a
    className={cn(
      "font-medium underline underline-offset-4 hover:text-foreground transition-colors",
      className
    )}
    target={props.href?.startsWith("http") ? "_blank" : undefined}
    rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
    {...props}
  />
)

const ul = ({ className, ...props }: React.ComponentProps<"ul">) => (
  <ul className={cn("my-4 ml-5 list-disc space-y-1 text-sm", className)} {...props} />
)

const ol = ({ className, ...props }: React.ComponentProps<"ol">) => (
  <ol className={cn("my-4 ml-5 list-decimal space-y-1 text-sm", className)} {...props} />
)

const li = ({ className, ...props }: React.ComponentProps<"li">) => (
  <li className={cn("leading-relaxed", className)} {...props} />
)

const blockquote = ({ className, ...props }: React.ComponentProps<"blockquote">) => (
  <blockquote
    className={cn("mt-6 border-l-2 border-border pl-4 italic text-muted-foreground text-sm", className)}
    {...props}
  />
)

const hr = (props: React.ComponentProps<"hr">) => (
  <hr className="my-8 border-border" {...props} />
)

// ── Code ───────────────────────────────────────────────────────────────────

const InlineCode = ({ className, ...props }: React.ComponentProps<"code">) => (
  <code
    className={cn(
      "relative rounded bg-muted px-[0.35rem] py-[0.15rem] font-mono text-[0.8rem] text-foreground",
      className
    )}
    {...props}
  />
)

// Fenced code block - rendered via rehype-pretty-code
const pre = ({ className, children, ...props }: React.ComponentProps<"pre">) => (
  <pre
    className={cn(
      "scrollbar-hidden relative my-4 overflow-x-auto rounded-lg border border-border bg-[#0a0a0a] p-4 text-sm text-[#e4e4e7]",
      className
    )}
    {...props}
  >
    {children}
  </pre>
)

// ── Table ──────────────────────────────────────────────────────────────────

const table = ({ className, ...props }: React.ComponentProps<"table">) => (
  <div className="my-6 w-full overflow-auto rounded-lg border border-border">
    <table
      className={cn("w-full text-sm border-collapse", className)}
      {...props}
    />
  </div>
)

const tr = ({ className, ...props }: React.ComponentProps<"tr">) => (
  <tr className={cn("border-b border-border last:border-0 m-0", className)} {...props} />
)

const th = ({ className, ...props }: React.ComponentProps<"th">) => (
  <th
    className={cn("border-b border-border bg-muted/40 px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground", className)}
    {...props}
  />
)

const td = ({ className, ...props }: React.ComponentProps<"td">) => (
  <td
    className={cn(
      "px-4 py-2.5 text-sm align-top",
      "[&>code]:rounded [&>code]:bg-muted [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:font-mono [&>code]:text-xs [&>code]:text-foreground",
      className
    )}
    {...props}
  />
)

// ── Callout ────────────────────────────────────────────────────────────────

type CalloutVariant = "default" | "warning" | "danger" | "info" | "tip"

const calloutConfig: Record<CalloutVariant, { iconClass: string; containerClass: string }> = {
  default: {
    iconClass: "text-foreground",
    containerClass: "border-foreground/15 bg-foreground/5",
  },
  info: {
    iconClass: "text-blue-500",
    containerClass: "border-blue-500/20 bg-blue-500/5",
  },
  warning: {
    iconClass: "text-amber-500",
    containerClass: "border-amber-500/20 bg-amber-500/5",
  },
  danger: {
    iconClass: "text-destructive",
    containerClass: "border-destructive/20 bg-destructive/5",
  },
  tip: {
    iconClass: "text-green-500",
    containerClass: "border-green-500/20 bg-green-500/5",
  },
}

function CalloutIcon({ variant, className }: { variant: CalloutVariant; className?: string }) {
  const cls = cn("size-4 shrink-0", className)
  switch (variant) {
    case "info":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
        </svg>
      )
    case "warning":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" />
        </svg>
      )
    case "danger":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />
        </svg>
      )
    case "tip":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" />
        </svg>
      )
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" />
        </svg>
      )
  }
}

export function Callout({
  variant = "default",
  title,
  children,
  className,
}: {
  variant?: CalloutVariant
  title?: string
  children: React.ReactNode
  className?: string
}) {
  const config = calloutConfig[variant]
  return (
    <div className={cn("my-5 rounded-lg border p-4", config.containerClass, className)}>
      <div className="flex gap-3">
        <CalloutIcon variant={variant} className={cn("mt-0.5", config.iconClass)} />
        <div className="flex flex-col gap-1 text-sm min-w-0">
          {title && <p className="font-semibold text-foreground">{title}</p>}
          <div className="text-muted-foreground [&>p]:mt-0">{children}</div>
        </div>
      </div>
    </div>
  )
}

// ── Steps ──────────────────────────────────────────────────────────────────

export function Steps({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "steps my-6 ml-3 border-l border-border pl-6 [counter-reset:step]",
        className
      )}
    >
      {children}
    </div>
  )
}

export function Step({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-step
      className={cn(
        "step relative mb-3 mt-8 first:mt-0 font-semibold text-sm tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ── PropsTable from MDX ────────────────────────────────────────────────────

export function PropRow({
  name,
  type,
  defaultValue,
  required,
  children,
}: {
  name: string
  type: string
  defaultValue?: string
  required?: boolean
  children?: React.ReactNode
}) {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-2.5 align-top">
        <div className="flex items-center gap-1.5">
          <code className="font-mono text-xs text-foreground">{name}</code>
          {required && (
            <span className="text-[10px] font-semibold text-destructive">required</span>
          )}
        </div>
      </td>
      <td className="px-4 py-2.5 align-top">
        <code className="font-mono text-xs text-muted-foreground">{type}</code>
      </td>
      <td className="px-4 py-2.5 align-top">
        {defaultValue ? (
          <code className="font-mono text-xs text-muted-foreground">{defaultValue}</code>
        ) : (
          <span className="text-xs text-muted-foreground/50">—</span>
        )}
      </td>
      <td className="px-4 py-2.5 align-top text-xs text-muted-foreground">{children}</td>
    </tr>
  )
}

export function PropsTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 overflow-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide w-36">Prop</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide w-28">Default</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Description</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

// ── ComponentPreview MDX wrapper ───────────────────────────────────────────

export function Preview({ slug }: { slug: string }) {
  return <ComponentPreviewWrapper slug={slug} code="" />
}

function InstallTabsMdx(props: React.ComponentProps<typeof InstallTabs>) {
  return <InstallTabs {...props} />
}

function CodeBlockMdx(props: React.ComponentProps<typeof CodeBlock>) {
  return <CodeBlock {...props} />
}

function PackageManagerTabsMdx(props: React.ComponentProps<typeof PackageManagerTabs>) {
  return <PackageManagerTabs {...props} />
}

function CodeTabsMdx(props: React.ComponentProps<typeof CodeTabs>) {
  return <CodeTabs {...props} />
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

function ComponentPreviewMdxWrapper(props: React.ComponentProps<typeof ComponentPreviewMdx>) {
  return <ComponentPreviewMdx {...props} />
}

function ComponentSourceMdxWrapper(props: React.ComponentProps<typeof ComponentSource>) {
  return <ComponentSource {...props} />
}


// ── Export map for use with next-mdx-remote or @next/mdx ──────────────────

export const mdxComponents = {
  // HTML elements
  h1,
  h2,
  h3,
  h4,
  p,
  a,
  ul,
  ol,
  li,
  blockquote,
  hr,
  pre,
  table,
  tr,
  th,
  td,
  // Inline code — MDX sends inline code as <code> without a parent <pre>
  code: ({ className, ...props }: React.ComponentProps<"code">) => {
    const isBlock = className?.includes("language-")
    if (isBlock) return <code className={className} {...props} />
    return <InlineCode className={className} {...props} />
  },
  // Custom components available in .mdx files
  Callout,
  Steps,
  Step,
  PropsTable,
  PropRow,
  Preview,
  InstallTabs: InstallTabsMdx,
  CodeBlock: CodeBlockMdx,
  PackageManagerTabs: PackageManagerTabsMdx,
  // CodeTabs pattern (used in existing hand-written MDX files)
  CodeTabs: CodeTabsMdx,
  TabsList: TabsListMdx,
  TabsTrigger: TabsTriggerMdx,
  TabsContent: TabsContentMdx,
  // ComponentPreview with name prop (e.g. name="button-demo")
  ComponentPreview: ComponentPreviewMdxWrapper,
  // ComponentSource with name + optional title props
  ComponentSource: ComponentSourceMdxWrapper,
  Link: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link
      className={cn("font-medium underline underline-offset-4", className)}
      {...props}
    />
  ),
}

// Re-export individual components for direct use
export { h1, h2, h3, h4, p, a, ul, ol, li, blockquote, hr, pre, table, tr, th, td, InlineCode }
