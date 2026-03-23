import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/shared/site-header"

export const dynamic = "force-dynamic"
import { CopyButton } from "@/components/shared/copy-button"
import { components } from "@/lib/registry"

export const metadata: Metadata = {
  alternates: {
    canonical: "https://baseui-cn.com",
  },
  title: "baseui-cn — Base UI components. One command install.",
  description:
    "A Base UI-first open component registry. 36 components " +
    "built exclusively on @base-ui/react. shadcn-style install. " +
    "No Vaul. No Radix. Tailwind styled. You own the code.",
}

const componentCount = components.filter((c) => c.type === "component").length
const blockCount = components.filter((c) => c.type === "block").length

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl py-24 md:py-32">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Base UI Drawer stable · v1.3.0 · March 2026
              </div>

              {/* Headline */}
              <h1 className="font-mono text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl leading-[1.1]">
                Base UI components.
                <br />
                <span className="text-muted-foreground">One command install.</span>
              </h1>

              <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
                A registry of beautifully styled, accessible components built exclusively on Base UI
                primitives. Copy into your project, own the code, style with Tailwind.
              </p>

              {/* Install command */}
              <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3 font-mono text-sm">
                  <span className="text-muted-foreground select-none">$</span>
                  <span className="text-foreground">npx baseui-cn init</span>
                  <CopyButton text="npx baseui-cn init" />
                </div>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium hover:bg-accent transition-colors"
                >
                  Read docs
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
                  <strong className="text-foreground">1</strong> primitive library
                </span>
                <span className="text-border">|</span>
                <span>MIT license</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Component preview strip ──────────────────────────── */}
        <section className="border-b border-border overflow-hidden py-10 relative">
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

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
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                      <div className="flex h-4 w-4 items-center justify-center rounded-sm border border-border bg-background">
                      </div>
                      <span className="text-xs text-muted-foreground">Option A</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-foreground">
                        <svg className="h-2.5 w-2.5 text-background" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
              .concat(
                [
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
                            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                          <div className="flex h-4 w-4 items-center justify-center rounded-sm border border-border bg-background">
                          </div>
                          <span className="text-xs text-muted-foreground">Option A</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-foreground">
                            <svg className="h-2.5 w-2.5 text-background" viewBox="0 0 16 16" fill="none">
                              <path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
              )
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
                  body: "Every interactive component — dialogs, drawers, selects, tooltips, menus — is built on Base UI. One library, one overlay system, one portal. No conflicts when composing.",
                  icon: "⬡",
                },
                {
                  title: "Stable Drawer built in",
                  body: "Base UI's Drawer became stable in v1.3.0. It uses the same portal system as Select, Combobox, and Tooltip — so nesting floating components inside a Drawer just works.",
                  icon: "◫",
                },
                {
                  title: "Your code, your rules",
                  body: "Components are copied directly into your project. No runtime library to update, no breaking changes to absorb. Edit the source, change the styles, make it yours.",
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
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8">
              How it works
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="flex flex-col gap-6">
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
                    <span className="font-mono text-xs text-muted-foreground/50 mt-0.5 w-6 shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <code className="font-mono text-sm text-foreground">{item.cmd}</code>
                      <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Terminal mockup */}
              <div className="rounded-lg border border-border bg-[#0a0a0a] overflow-hidden">
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
                  <div className="text-green-400 pl-6">✓ CSS variables added to globals.css</div>
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
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-px bg-border">
              {components.map((comp) => (
                <Link
                  key={comp.name}
                  href={`/docs/components/${comp.name}`}
                  className="group bg-background p-4 hover:bg-accent/50 transition-colors"
                >
                  {comp.name === "app-shell" && (
                    <div className="mb-3 flex h-[80px] w-full overflow-hidden rounded border border-border">
                      {/* Mini sidebar */}
                      <div className="flex w-[22%] flex-col gap-1.5 border-r border-border bg-muted/60 p-1.5">
                        <div className="h-2 w-full rounded-sm bg-muted-foreground/30" />
                        <div className="h-1.5 w-full rounded-sm bg-muted-foreground/20" />
                        <div className="h-1.5 w-full rounded-sm bg-muted-foreground/20" />
                        <div className="h-1.5 w-3/4 rounded-sm bg-muted-foreground/20" />
                      </div>
                      {/* Main content */}
                      <div className="flex flex-1 flex-col gap-1.5 p-2">
                        <div className="h-2 w-2/3 rounded-sm bg-muted-foreground/25" />
                        <div className="h-1.5 w-full rounded-sm bg-muted-foreground/15" />
                        <div className="h-1.5 w-5/6 rounded-sm bg-muted-foreground/15" />
                      </div>
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-sm text-foreground">{comp.name}</span>
                    {comp.badge && (
                      <span className="shrink-0 text-[9px] font-semibold bg-foreground text-background rounded px-1 py-0.5 leading-none">
                        {comp.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {comp.description}
                  </p>
                  {comp.baseUIPrimitive && (
                    <p className="mt-2 text-[10px] font-mono text-muted-foreground/40">
                      {comp.baseUIPrimitive}
                    </p>
                  )}
                </Link>
              ))}
            </div>
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
                <a
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
                </a>
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
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3 font-mono text-sm">
                <span className="text-muted-foreground select-none">$</span>
                <span>npx baseui-cn init</span>
                <CopyButton text="npx baseui-cn init" />
              </div>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-5 py-3 text-sm font-medium hover:bg-foreground/90 transition-colors"
              >
                Read the docs
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
            <a
              href="https://base-ui.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Base UI
            </a>
            <a
              href="https://github.com/baseui-cn/baseui-cn"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a href="/llms.txt" target="_blank" className="hover:text-foreground transition-colors">
              llms.txt
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
