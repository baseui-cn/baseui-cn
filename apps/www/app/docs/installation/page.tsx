import { CodeBlock } from "@/components/docs/code-block"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Installation" }

export default function InstallationPage() {
  return (
    <div className="flex flex-col gap-10 animate-fade-in">
      <div className="flex flex-col gap-3 pb-6 border-b border-border">
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
          Getting Started
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Installation</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Set up baseui-cn in your Next.js or React project in two commands.
          Works with pnpm, npm, yarn, and bun.
        </p>
      </div>

      {/* Requirements */}
      <div>
        <h2 className="text-base font-semibold mb-3">Requirements</h2>
        <div className="rounded-lg border border-border divide-y divide-border text-sm">
          {[
            ["Node.js", "18.0 or later"],
            ["React", "18.0 or later"],
            ["Next.js", "15+ with App Router (recommended) or any React 18+ project"],
            ["Tailwind CSS", "v4 (CSS-first config)"],
            ["@base-ui/react", "Installed automatically by init"],
          ].map(([dep, note]) => (
            <div key={dep} className="flex items-center gap-4 px-4 py-3">
              <code className="font-mono text-xs text-foreground w-32 shrink-0">{dep}</code>
              <span className="text-muted-foreground">{note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1 */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold">Step 1 — Initialize</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Run this in your project root. It auto-detects your structure and sets everything up.
          </p>
        </div>
        <CodeBlock code="npx baseui-cn init" />
        <div className="rounded-lg border border-border divide-y divide-border text-sm">
          {[
            ["Detects project", "Finds Next.js, src/ dir, App Router vs Pages Router automatically"],
            ["Installs deps", "@base-ui/react · clsx · tailwind-merge · class-variance-authority"],
            ["CSS variables", "Injects HSL design tokens into globals.css"],
            ["Utils", "Creates lib/utils.ts with the cn() helper"],
            ["Config", "Writes baseui-cn.json with your resolved paths"],
          ].map(([label, desc]) => (
            <div key={label} className="flex items-start gap-4 px-4 py-3">
              <code className="font-mono text-xs text-foreground w-28 shrink-0 mt-0.5">{label}</code>
              <span className="text-muted-foreground">{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 2 */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold">Step 2 — Add components</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Each component is copied directly into your project. You own the code.
          </p>
        </div>
        <CodeBlock code={`# Add one
npx baseui-cn add button

# Add several at once
npx baseui-cn add dialog drawer select combobox

# Interactive picker — choose what you want
npx baseui-cn add

# Add everything
npx baseui-cn add --all`} />
      </div>

      {/* Step 3 */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold">Step 3 — Import and use</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Components land in <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">components/ui/</code>.
            Import and use immediately.
          </p>
        </div>
        <CodeBlock
          filename="app/page.tsx"
          code={`import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"

export default function Page() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline">Open</Button>} />
      <DrawerContent side="right">
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
        </DrawerHeader>
        <div className="p-6">
          <Input label="Display name" placeholder="Aria Chen" />
        </div>
      </DrawerContent>
    </Drawer>
  )
}`}
        />
      </div>

      {/* Config file */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold">baseui-cn.json</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Created at your project root by <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">init</code>.
            Edit to change where components and utils are placed.
          </p>
        </div>
        <CodeBlock
          filename="baseui-cn.json"
          code={`{
  "componentsPath": "src/components/ui",
  "utilsPath": "src/lib/utils",
  "globalCss": "src/app/globals.css",
  "tailwind": true,
  "rsc": true
}`}
        />
      </div>

      {/* Manual install */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold">Manual installation</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Prefer to set things up yourself? Install the dependencies and copy components manually.
          </p>
        </div>
        <CodeBlock code="pnpm add @base-ui/react class-variance-authority clsx tailwind-merge" />
        <p className="text-sm text-muted-foreground">
          Then add the CSS variables from the{" "}
          <a href="/docs/theming" className="underline underline-offset-4 hover:text-foreground">
            Theming page
          </a>{" "}
          to your globals.css and create{" "}
          <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">lib/utils.ts</code>:
        </p>
        <CodeBlock
          filename="lib/utils.ts"
          code={`import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`}
        />
      </div>

      <div className="rounded-lg border border-border bg-muted/20 p-5">
        <p className="text-sm font-medium mb-1">Already have a design system?</p>
        <p className="text-sm text-muted-foreground">
          baseui-cn uses the same CSS variable naming convention as other registry-style systems.
          If you already have{" "}
          <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">--background</code>,{" "}
          <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">--primary</code>, etc.
          in your globals.css, components will pick them up automatically.
        </p>
      </div>

      <div className="flex items-center gap-4 pt-2 border-t border-border text-sm">
        <a href="/docs/theming" className="flex items-center gap-1.5 font-medium hover:underline underline-offset-4">
          Theming →
        </a>
        <a href="/docs/llms" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:underline underline-offset-4">
          LLM usage →
        </a>
      </div>
    </div>
  )
}
