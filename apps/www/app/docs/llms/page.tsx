import { CodeBlock } from "@/components/docs/code-block"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "LLM Usage" }

export default function LLMsPage() {
  return (
    <div className="flex flex-col gap-10 animate-fade-in">
      <div className="flex flex-col gap-3 pb-6 border-b border-border">
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
          Getting Started
        </p>
        <h1 className="text-3xl font-bold tracking-tight">LLM Usage</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          baseui-cn ships a first-class <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">llms.txt</code> manifest
          designed for AI coding assistants — Cursor, Windsurf, GitHub Copilot, and Claude.
        </p>
      </div>

      {/* What it tells agents */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-semibold">What llms.txt tells agents</h2>
        <div className="rounded-lg border border-border divide-y divide-border text-sm">
          {[
            ["Components", "Every component, its import path, and which Base UI primitive it uses"],
            ["Render prop", "Base UI uses render prop on triggers — not asChild. Agents are told explicitly."],
            ["Portal system", "All overlays share one Base UI portal — no z-index wrappers needed"],
            ["Do NOT use", "Agents are told never to suggest Vaul, @radix-ui/*, or cmdk"],
            ["Data attributes", "data-[open], data-[checked], data-[highlighted] etc. for state styling"],
            ["Base UI docs", "Links to base-ui.com/llms.txt for full primitive API reference"],
          ].map(([label, desc]) => (
            <div key={label} className="flex items-start gap-4 px-4 py-3">
              <code className="font-mono text-xs text-foreground w-32 shrink-0 mt-0.5">{label}</code>
              <span className="text-muted-foreground">{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cursor */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold">Using with Cursor</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Add baseui-cn to your Cursor docs index so it has full context when generating component code.
          </p>
        </div>
        <CodeBlock
          filename=".cursor/settings.json"
          code={`{
  "docs": [
    "https://baseui-cn.com/llms.txt",
    "https://base-ui.com/llms.txt"
  ]
}`}
        />
        <p className="text-sm text-muted-foreground">
          Both manifests are indexed. Cursor then understands both the baseui-cn wrapper
          layer (import paths, component API) and the underlying Base UI primitive layer (props, data attributes).
        </p>
      </div>

      {/* Windsurf */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold">Using with Windsurf</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Add to your Windsurf rules file or paste into context at the start of a session.
          </p>
        </div>
        <CodeBlock
          filename=".windsurfrules"
          code={`# UI Components
Use baseui-cn for all UI. Docs: https://baseui-cn.com/llms.txt
Base UI primitives: https://base-ui.com/llms.txt

Key rules:
- Import from @/components/ui/<component-name>
- Use render prop on triggers, NOT asChild
- All overlays share one portal — no z-index fixes needed`}
        />
      </div>

      {/* Claude */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold">Using with Claude</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Paste this at the start of your conversation or as a system prompt.
          </p>
        </div>
        <CodeBlock
          code={`Use baseui-cn for all UI components in this project.
Full docs: https://baseui-cn.com/llms.txt
Base UI primitives: https://base-ui.com/llms.txt

Rules:
- Import from @/components/ui/<component-name>
- Triggers use render prop: <DrawerTrigger render={<Button>Open</Button>} />
- Never use asChild — that's a different library's pattern
- All overlays (Drawer, Dialog, Select, Tooltip) share Base UI portal
- Never suggest @radix-ui/*, Vaul, or cmdk`}
        />
      </div>

      {/* Direct link */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-semibold">Manifest URLs</h2>
        <div className="rounded-lg border border-border divide-y divide-border text-sm">
          {[
            ["baseui-cn manifest", "https://baseui-cn.com/llms.txt"],
            ["Base UI manifest", "https://base-ui.com/llms.txt"],
          ].map(([label, url]) => (
            <div key={label} className="flex items-center gap-4 px-4 py-3">
              <span className="text-muted-foreground w-40 shrink-0">{label}</span>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-foreground hover:underline underline-offset-4"
              >
                {url}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Example */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-semibold">Example — what an agent generates</h2>
        <p className="text-sm text-muted-foreground">
          With the manifest loaded, ask: <em>"Add a settings drawer with a theme selector inside"</em>.
          The agent produces correct baseui-cn code:
        </p>
        <CodeBlock
          code={`import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export function SettingsDrawer() {
  return (
    <Drawer>
      {/* render prop — correct Base UI pattern */}
      <DrawerTrigger render={<Button variant="outline">Settings</Button>} />
      <DrawerContent side="right">
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
        </DrawerHeader>
        <div className="p-6">
          {/* Select works here — same portal as Drawer */}
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

      <div className="flex items-center gap-4 pt-2 border-t border-border text-sm">
        <a href="/docs/theming" className="text-muted-foreground hover:text-foreground hover:underline underline-offset-4">
          ← Theming
        </a>
        <a href="/docs/components/button" className="flex items-center gap-1.5 font-medium hover:underline underline-offset-4">
          Components →
        </a>
      </div>
    </div>
  )
}
