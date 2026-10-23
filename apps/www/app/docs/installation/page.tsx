import { CodeBlock } from "@/components/docs/code-block"
import { PackageManagerTabs } from "@/components/docs/package-manager-tabs"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Installation" }

export default function InstallationPage() {
  return (
    <div className="docs-guide mx-auto w-full max-w-[72ch] flex flex-col gap-10">
      <div className="flex flex-col gap-3 pb-6 border-b border-border">
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
          Getting Started
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Installation</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Create a new app or initialize an existing React project. First-class setup for Next.js,
          TanStack Start, React Router and Vite, with npm, pnpm, Yarn and Bun.
        </p>
      </div>

      <section id="new-project" className="flex flex-col gap-4">
        <h2>Start a new project</h2>
        <p className="text-muted-foreground">
          The create command runs your framework’s official scaffolder, installs dependencies and
          initializes baseui-cn. Run it without flags for guided setup.
        </p>
        <PackageManagerTabs command="baseui-cn@latest create my-app --framework next" />
        <CodeBlock
          code={`# Choose your framework
npx baseui-cn@latest create my-app --framework tanstack-start
npx baseui-cn@latest create my-app --framework react-router
npx baseui-cn@latest create my-app --framework vite

# Choose a package manager and workspace structure
npx baseui-cn@latest create my-app --framework next --package-manager pnpm --monorepo
# Your application lives in my-app/apps/web`}
          language="bash"
        />
        <p className="text-sm text-muted-foreground">
          Install the chosen package manager first. Yarn runners require Yarn 2+. New projects use
          current upstream scaffolders; Node.js 22.12+ is recommended, and upstream runtime
          requirements apply. Existing/custom React apps use init with their own Tailwind CSS v4
          pipeline and @/* source alias.
        </p>
      </section>
      <p className="text-sm text-muted-foreground">
        New apps retain strict TypeScript checks and match the registry’s compiler policy:
        noUnusedLocals and noUnusedParameters are disabled. Existing compiler settings stay yours;
        Data Grid contains two unused bindings to clean up locally if those options are enabled.
      </p>
      <section id="setup-theme" className="flex flex-col gap-4">
        <h2>Choose a theme</h2>
        <p className="text-sm text-muted-foreground">
          Fresh setup defaults to Iris and Rounded. Create and init accept --color and --radius.
          Existing themes are preserved unless you explicitly pass those flags or choose new values
          interactively.
        </p>
        <CodeBlock
          code={`npx baseui-cn@latest create my-app --framework next --color emerald --radius xl
npx baseui-cn@latest init --color iris --radius lg`}
          language="bash"
        />
        <a href="/docs/theming#theme-presets" className="underline underline-offset-4">
          View color and radius presets
        </a>
      </section>
      <section id="workspaces" className="flex flex-col gap-4">
        <h2>Existing apps and monorepos</h2>
        <p className="text-muted-foreground">
          Run init inside your app or at your workspace root. The CLI detects frameworks, lockfiles,
          packageManager declarations and common workspace configurations. A single app is selected
          automatically; multiple apps prompt for a target. Noninteractive runs with multiple apps
          require --workspace.
        </p>
        <CodeBlock
          code={`npx baseui-cn@latest init

# Paths are relative to the workspace root
npx baseui-cn@latest init --workspace apps/web
npx baseui-cn@latest add button --workspace apps/web
npx baseui-cn@latest update button --workspace apps/web

# Choose custom component, utils and CSS paths
npx baseui-cn@latest init --customize`}
          language="bash"
        />
        <p className="text-sm text-muted-foreground">
          Component files, utilities, configuration and dependencies belong to the selected app.
          Shared packages/ui generation is not included. Custom workspace globs with braces/extglobs
          or application layouts that cannot be detected should be initialized from inside the
          application.
        </p>
      </section>

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
        <PackageManagerTabs command="baseui-cn init" />
        <p className="text-xs text-muted-foreground mt-2">
          Prefer a specific stylesheet? Pass{" "}
          <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
            --css src/styles.css
          </code>{" "}
          and baseui-cn will use that path instead of guessing.
        </p>
        <div className="rounded-lg border border-border divide-y divide-border text-sm">
          {[
            [
              "Detects project",
              "Finds Next.js, TanStack Start, React Router, Vite, React and application source directories",
            ],
            ["Installs deps", "@base-ui/react · clsx · tailwind-merge · class-variance-authority"],
            [
              "CSS variables",
              "Prompts for your stylesheet and injects theme tokens, including destructive, success, warning, and info",
            ],
            ["Utils", "Creates lib/utils.ts with the cn() helper"],
            ["Config", "Writes baseui-cn.json with your resolved paths"],
          ].map(([label, desc]) => (
            <div key={label} className="flex items-start gap-4 px-4 py-3">
              <code className="font-mono text-xs text-foreground w-28 shrink-0 mt-0.5">
                {label}
              </code>
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
        <PackageManagerTabs command="baseui-cn add button" />
        <p className="text-xs text-muted-foreground mt-2 mb-1">Add several at once:</p>
        <PackageManagerTabs command="baseui-cn add dialog drawer select combobox" />
        <p className="text-xs text-muted-foreground mt-2 mb-1">Or add everything:</p>
        <PackageManagerTabs command="baseui-cn add --all" />
      </div>

      {/* Step 3 */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold">Step 3 — Import and use</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Components land in{" "}
            <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">components/ui/</code>
            . Import and use immediately.
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
            Created at your project root by{" "}
            <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">init</code>. Edit to
            change where components, utils, and theme styles are placed.
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
          to your main stylesheet and create{" "}
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
          baseui-cn uses the same CSS variable naming convention as other registry-style systems. If
          you already have{" "}
          <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">--background</code>,{" "}
          <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">--primary</code>, etc.
          in your stylesheet, components will pick them up automatically.
        </p>
      </div>

      <div className="flex items-center gap-4 pt-2 border-t border-border text-sm">
        <a
          href="/docs/theming"
          className="flex items-center gap-1.5 font-medium hover:underline underline-offset-4"
        >
          Theming →
        </a>
        <a
          href="/docs/llms"
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:underline underline-offset-4"
        >
          LLM usage →
        </a>
      </div>
    </div>
  )
}
