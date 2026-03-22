import { CodeBlock } from "@/components/docs/code-block"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Introduction" }

export default function DocsPage() {
  return (
    <div className="flex flex-col gap-10 animate-fade-in">
      <div className="flex flex-col gap-3 pb-6 border-b border-border">
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
          Getting Started
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Introduction</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          baseui-cn is a Base UI-first open component registry with a
          shadcn-style developer experience. Copy components into your project,
          own the code, style with Tailwind.
        </p>
      </div>

      {/* What it is */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-semibold">What it is</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Every interactive component — dialogs, drawers, selects, tooltips,
          menus — is built on{" "}
          <a
            href="https://base-ui.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Base UI
          </a>
          . One library, one overlay system, one portal. No conflicts when
          composing components inside each other.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Base UI&apos;s Drawer became stable in v1.3.0 (March 2026). That
          closed the last gap — so Select, Combobox, Tooltip, and Drawer all
          share the same portal system. Nesting floating components inside a
          Drawer just works.
        </p>
      </div>

      {/* Core principles */}
      <div className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">Core principles</h2>
        <div className="rounded-lg border border-border divide-y divide-border text-sm">
          {[
            [
              "Base UI only",
              "Every interactive primitive is from @base-ui/react. One library, one overlay system.",
            ],
            [
              "Tailwind CSS",
              "Styled with Tailwind v4. No CSS-in-JS, no runtime style injection.",
            ],
            [
              "You own the code",
              "Components are copied into your project. Edit freely. No version lock-in.",
            ],
            [
              "shadcn-compatible tokens",
              "Same CSS variable names — --background, --primary, etc. Themes transfer directly.",
            ],
            [
              "RSC-aware",
              '"use client" only where required. Works with Next.js App Router.',
            ],
            [
              "LLM-ready",
              "First-class llms.txt for AI coding assistants. Works with Cursor, Windsurf, and Claude.",
            ],
          ].map(([label, desc]) => (
            <div key={label} className="flex items-start gap-4 px-4 py-3">
              <code className="font-mono text-xs text-foreground w-40 shrink-0 mt-0.5">
                {label}
              </code>
              <span className="text-muted-foreground">{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick start */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-semibold">Quick start</h2>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              1. Initialize baseui-cn in your project:
            </p>
            <CodeBlock code="npx baseui-cn init" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              2. Add components:
            </p>
            <CodeBlock code="npx baseui-cn add button drawer select" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              3. Or add everything at once:
            </p>
            <CodeBlock code="npx baseui-cn add --all" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              4. Import and use:
            </p>
            <CodeBlock
              language="tsx"
              code={`import { Button } from "@/components/ui/button"
import {
  Drawer, DrawerTrigger, DrawerContent,
  DrawerHeader, DrawerTitle,
} from "@/components/ui/drawer"
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"

export function Example() {
  return (
    <Drawer>
      {/* render prop — Base UI pattern, not asChild */}
      <DrawerTrigger render={<Button variant="outline">Settings</Button>} />
      <DrawerContent side="right">
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
        </DrawerHeader>
        <div className="p-6">
          {/* Select works here — same Base UI portal as Drawer */}
          <Select>
            <SelectTrigger placeholder="Select theme..." />
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </DrawerContent>
    </Drawer>
  )
}`}
            />
          </div>
        </div>
      </div>

      {/* render prop callout */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20 p-5">
        <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-1">
          Base UI uses the render prop, not asChild
        </p>
        <p className="text-sm text-amber-800 dark:text-amber-300/80 mb-3">
          If you&apos;re coming from Radix UI or shadcn, the trigger pattern is
          different. Base UI uses a{" "}
          <code className="font-mono text-xs bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5 rounded">
            render
          </code>{" "}
          prop instead of{" "}
          <code className="font-mono text-xs bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5 rounded">
            asChild
          </code>
          .
        </p>
        <CodeBlock
          code={`// ❌ Radix / shadcn pattern — does not work with Base UI
<DialogTrigger asChild>
  <Button>Open</Button>
</DialogTrigger>

// ✅ Base UI pattern — always use this
<DialogTrigger render={<Button variant="outline">Open</Button>} />`}
        />
      </div>

      <div className="flex items-center gap-4 pt-2 border-t border-border text-sm">
        <a
          href="/docs/installation"
          className="flex items-center gap-1.5 font-medium hover:underline underline-offset-4"
        >
          Installation →
        </a>
        <a
          href="/docs/components/button"
          className="text-muted-foreground hover:text-foreground hover:underline underline-offset-4"
        >
          Components →
        </a>
      </div>
    </div>
  )
}
