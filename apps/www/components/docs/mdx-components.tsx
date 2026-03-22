import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { CodeBlock } from "@/components/docs/code-block"
import { InstallTabs } from "@/components/docs/install-tabs"
import { ComponentPreviewWrapper } from "@/components/docs/component-preview-wrapper"
import { CodeTabs } from "@/components/docs/code-tabs"
import { ComponentSource } from "@/components/docs/component-source"
import { ComponentPreviewMdx } from "@/components/docs/component-preview-mdx"
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
      "relative my-4 overflow-x-auto rounded-lg border border-border bg-[#0a0a0a] p-4 text-sm text-[#e4e4e7]",
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
      className={cn("w-full text-sm border-none", className)}
      {...props}
    />
  </div>
)

const tr = ({ className, ...props }: React.ComponentProps<"tr">) => (
  <tr className={cn("border-b border-border last:border-0 m-0", className)} {...props} />
)

const th = ({ className, ...props }: React.ComponentProps<"th">) => (
  <th
    className={cn("border-b border-border bg-muted/50 px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide", className)}
    {...props}
  />
)

const td = ({ className, ...props }: React.ComponentProps<"td">) => (
  <td className={cn("px-4 py-2.5 text-sm align-top", className)} {...props} />
)

// ── Callout ────────────────────────────────────────────────────────────────

type CalloutVariant = "default" | "warning" | "danger" | "info" | "tip"

const calloutConfig: Record<CalloutVariant, { icon: string; classes: string }> = {
  default: {
    icon: "💡",
    classes: "border-border bg-muted/30",
  },
  info: {
    icon: "ℹ️",
    classes: "border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/20",
  },
  warning: {
    icon: "⚠️",
    classes: "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20",
  },
  danger: {
    icon: "🚨",
    classes: "border-destructive/30 bg-destructive/5",
  },
  tip: {
    icon: "✅",
    classes: "border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/20",
  },
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
    <div className={cn("my-5 rounded-lg border p-4", config.classes, className)}>
      <div className="flex gap-3">
        <span className="mt-0.5 text-base leading-none shrink-0" role="img">{config.icon}</span>
        <div className="flex flex-col gap-1 text-sm">
          {title && <p className="font-semibold">{title}</p>}
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
        "my-6 ml-3 border-l border-border pl-6 [counter-reset:step]",
        "[&>h3]:before:counter-increment:step",
        "[&>h3]:before:content-[counter(step)]",
        "[&>h3]:before:absolute [&>h3]:before:-left-10.25",
        "[&>h3]:before:flex [&>h3]:before:size-7 [&>h3]:before:items-center [&>h3]:before:justify-center",
        "[&>h3]:before:rounded-full [&>h3]:before:border [&>h3]:before:border-border [&>h3]:before:bg-background",
        "[&>h3]:before:text-xs [&>h3]:before:font-semibold [&>h3]:before:text-muted-foreground",
        "[&>h3]:relative [&>h3]:mb-3 [&>h3]:mt-0",
        className
      )}
    >
      {children}
    </div>
  )
}

export function Step({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn("font-semibold text-sm tracking-tight", className)}
      {...props}
    />
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
  InstallTabs,
  CodeBlock,
  // CodeTabs pattern (used in existing hand-written MDX files)
  CodeTabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  // ComponentPreview with name prop (e.g. name="button-demo")
  ComponentPreview: ComponentPreviewMdx,
  // ComponentSource with name + optional title props
  ComponentSource,
  Link: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link
      className={cn("font-medium underline underline-offset-4", className)}
      {...props}
    />
  ),
}

// Re-export individual components for direct use
export { h1, h2, h3, h4, p, a, ul, ol, li, blockquote, hr, pre, table, tr, th, td, InlineCode }
