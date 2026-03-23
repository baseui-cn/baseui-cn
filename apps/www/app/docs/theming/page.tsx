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
          baseui-cn uses CSS custom properties for theming. Values are HSL channels
          without the <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">hsl()</code> wrapper
          so Tailwind can apply opacity modifiers like{" "}
          <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">bg-primary/50</code>.
        </p>
      </div>

      {/* CSS variables */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold">CSS variables</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Added to your <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">globals.css</code> by{" "}
            <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">npx baseui-cn init</code>.
          </p>
        </div>
        <CodeBlock
          filename="app/globals.css"
          code={`@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
  }
}`}
        />
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

@theme {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
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
            Add these keyframes to your globals.css for smooth height transitions.
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
