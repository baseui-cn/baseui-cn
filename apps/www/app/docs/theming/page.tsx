import { CodeBlock } from "@/components/docs/code-block"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Theming" }

export default function ThemingPage() {
  return (
    <div className="mx-auto w-full max-w-3xl flex flex-col gap-10 animate-fade-in">
      <div className="flex flex-col gap-3 pb-6 border-b border-border">
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
          Getting Started
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Theming</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          baseui-cn uses CSS custom properties for theming. Tokens are defined as raw color values
          and mapped into Tailwind utilities through{" "}
          <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">@theme</code>, so
          utility classes like{" "}
          <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">bg-primary/50</code>.
        </p>
      </div>

      {/* CSS variables */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold">CSS variables</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Added to your configured stylesheet, such as <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">app/globals.css</code> or <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">src/styles.css</code>, by{" "}
            <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">npx baseui-cn init</code>.
          </p>
        </div>
        <CodeBlock
          filename="app/globals.css"
          code={`@layer base {
  :root {
    --background: oklch(1 0 0);
    --foreground: oklch(0.141 0 0);
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.141 0 0);
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.141 0 0);
    --primary: oklch(0.21 0 0);
    --primary-foreground: oklch(0.985 0 0);
    --secondary: oklch(0.967 0 0);
    --secondary-foreground: oklch(0.21 0 0);
    --muted: oklch(0.967 0 0);
    --muted-foreground: oklch(0.552 0 0);
    --accent: oklch(0.967 0 0);
    --accent-foreground: oklch(0.21 0 0);
    --destructive: oklch(0.577 0.245 27.325);
    --destructive-foreground: oklch(0.985 0 0);
    --success: oklch(0.627 0.154 144.33);
    --success-foreground: oklch(0.985 0 0);
    --warning: oklch(0.769 0.188 70.08);
    --warning-foreground: oklch(0.21 0 0);
    --info: oklch(0.623 0.188 259.81);
    --info-foreground: oklch(0.985 0 0);
    --border: oklch(0.922 0 0);
    --input: oklch(0.922 0 0);
    --ring: oklch(0.708 0 0);
    --radius: 0.5rem;
  }

  .dark {
    --background: oklch(0.141 0 0);
    --foreground: oklch(0.985 0 0);
    --card: oklch(0.141 0 0);
    --card-foreground: oklch(0.985 0 0);
    --popover: oklch(0.141 0 0);
    --popover-foreground: oklch(0.985 0 0);
    --primary: oklch(0.985 0 0);
    --primary-foreground: oklch(0.21 0 0);
    --secondary: oklch(0.269 0 0);
    --secondary-foreground: oklch(0.985 0 0);
    --muted: oklch(0.269 0 0);
    --muted-foreground: oklch(0.708 0 0);
    --accent: oklch(0.269 0 0);
    --accent-foreground: oklch(0.985 0 0);
    --destructive: oklch(0.396 0.141 25.723);
    --destructive-foreground: oklch(0.985 0 0);
    --success: oklch(0.525 0.118 145.16);
    --success-foreground: oklch(0.985 0 0);
    --warning: oklch(0.645 0.149 69.84);
    --warning-foreground: oklch(0.21 0 0);
    --info: oklch(0.546 0.147 258.34);
    --info-foreground: oklch(0.985 0 0);
    --border: oklch(1 0 0 / 10%);
    --input: oklch(1 0 0 / 15%);
    --ring: oklch(0.552 0 0);
  }
}`}
        />
        <div className="rounded-lg border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
          `destructive`, `success`, `warning`, and `info` are all first-class semantic tokens. Use
          them for badges, toasts, alerts, and status-heavy surfaces instead of hard-coding raw
          color values inside components.
        </div>
      </div>

      {/* Tailwind v4 mapping */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold">Tailwind v4 theme mapping</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Add this <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">@theme</code> block
            so utilities like <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">bg-primary</code> and{" "}
            <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">text-muted-foreground</code> resolve to your variables.
          </p>
        </div>
        <CodeBlock
          filename="app/globals.css"
          code={`@import "tailwindcss";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}`}
        />
      </div>

      {/* Customization */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold">Customizing your theme</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Override any variable in your <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">:root</code>.
            Changes propagate to every component automatically.
          </p>
        </div>
        <CodeBlock
          code={`/* Blue primary */
:root {
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
}

/* Rounder corners */
:root {
  --radius: 0.75rem;
}

/* Green brand */
:root {
  --primary: 142.1 76.2% 36.3%;
  --primary-foreground: 355.7 100% 97.3%;
}

/* Custom status colors */
:root {
  --success: oklch(0.7 0.16 150);
  --success-foreground: oklch(0.985 0 0);
  --warning: oklch(0.8 0.16 80);
  --warning-foreground: oklch(0.21 0 0);
  --info: oklch(0.68 0.14 250);
  --info-foreground: oklch(0.985 0 0);
}`}
        />
      </div>

      {/* Dark mode */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold">Dark mode</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Uses the <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">.dark</code> class strategy.
            Add the class to your <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">&lt;html&gt;</code> element.
            We recommend <a href="https://github.com/pacocoursey/next-themes" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-foreground">next-themes</a> for automatic system preference detection.
          </p>
        </div>
        <CodeBlock
          filename="app/layout.tsx"
          code={`import { ThemeProvider } from "next-themes"

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}`}
        />
        <CodeBlock code="pnpm add next-themes" />
      </div>

      {/* Data attributes */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold">Base UI data attributes</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Base UI applies these attributes to components. Use them in Tailwind for state-based styling.
          </p>
        </div>
        <div className="rounded-lg border border-border divide-y divide-border text-sm font-mono">
          {[
            ["data-[open]", "Overlay or disclosure is open"],
            ["data-[closed]", "Overlay is closed — use for exit animations"],
            ["data-[checked]", "Checkbox, switch, or radio is checked"],
            ["data-[indeterminate]", "Checkbox is indeterminate"],
            ["data-[disabled]", "Component is disabled"],
            ["data-[highlighted]", "List item is focused/highlighted"],
            ["data-[selected]", "Select item is selected"],
            ["data-[starting-style]", "Entry animation start state"],
            ["data-[side=top|bottom|left|right]", "Floating element placement"],
          ].map(([attr, desc]) => (
            <div key={attr} className="flex items-start gap-4 px-4 py-2.5">
              <code className="text-xs text-foreground w-56 shrink-0">{attr}</code>
              <span className="text-xs text-muted-foreground font-sans">{desc}</span>
            </div>
          ))}
        </div>
        <CodeBlock
          code={`/* Use data attributes for state-based Tailwind classes */
className="data-open:opacity-100 data-closed:opacity-0 transition-opacity"
className="data-checked:bg-primary data-checked:border-primary"
className="data-highlighted:bg-accent data-highlighted:text-accent-foreground"`}
        />
      </div>

      {/* Accordion animation */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold">Accordion & Collapsible animations</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Add these keyframes to your main stylesheet for smooth height transitions.
          </p>
        </div>
        <CodeBlock
          filename="app/globals.css"
          code={`@layer utilities {
  @keyframes accordion-down {
    from { height: 0; opacity: 0; }
    to { height: var(--accordion-content-height); opacity: 1; }
  }
  @keyframes accordion-up {
    from { height: var(--accordion-content-height); opacity: 1; }
    to { height: 0; opacity: 0; }
  }

  .animate-accordion-down {
    animation: accordion-down 0.2s ease-out;
  }
  .animate-accordion-up {
    animation: accordion-up 0.2s ease-out;
  }
}`}
        />
      </div>

      <div className="flex items-center gap-4 pt-2 border-t border-border text-sm">
        <a href="/docs/installation" className="text-muted-foreground hover:text-foreground hover:underline underline-offset-4">
          ← Installation
        </a>
        <a href="/docs/llms" className="flex items-center gap-1.5 font-medium hover:underline underline-offset-4">
          LLM usage →
        </a>
      </div>
    </div>
  )
}
