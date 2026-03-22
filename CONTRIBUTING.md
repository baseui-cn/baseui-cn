# Contributing to baseui-cn

Thank you for your interest in contributing. baseui-cn is a Base UI-first component registry — every component is built exclusively on `@base-ui/react` primitives with Tailwind CSS styling.

## Before you start

Read these rules carefully. PRs that don't follow them will be asked to revise before review.

---

## Core rules — non-negotiable

### 1. Base UI only
Every interactive primitive **must** come from `@base-ui/react`. No Radix UI, no Vaul, no cmdk, no other headless UI library. If Base UI doesn't have the primitive you need, open an issue first to discuss before building a workaround.

### 2. render prop, not asChild
Base UI uses `render` prop on trigger and close sub-components — not `asChild`.

```tsx
// ❌ Wrong — Radix UI pattern
<DialogTrigger asChild><Button>Open</Button></DialogTrigger>

// ✅ Correct — Base UI pattern
<DialogTrigger render={<Button variant="outline">Open</Button>} />
```

This applies to: `DialogTrigger`, `DialogClose`, `DrawerTrigger`, `DrawerClose`, `AlertDialogTrigger`, `AlertDialogClose`, `PopoverTrigger`, `PopoverClose`, `TooltipTrigger`, `DropdownMenuTrigger`.

### 3. Tailwind CSS only
Style with Tailwind utility classes only. No CSS modules, no styled-components, no inline style objects (except for dynamic values that can't be expressed as utilities).

### 4. `cn()` for conditional classes
Always use the `cn()` helper from `@/lib/utils` for conditional className logic.

```tsx
import { cn } from "@/lib/utils"

className={cn("base-classes", conditional && "conditional-class", className)}
```

### 5. CSS variables for colors
Use `hsl(var(--primary))` / `bg-primary` / `text-muted-foreground` etc. Never hardcode color hex values. The full token list is in `globals.css`.

### 6. `"use client"` where required
Add `"use client"` at the top of any component that uses React hooks, event handlers, or browser APIs. Components that are purely structural (no state, no events) can remain as server components.

---

## Adding a new component

### Requirements
- The component must be built on a Base UI primitive (check [base-ui.com](https://base-ui.com) first)
- It must work correctly when nested inside other Base UI overlays (e.g. a Select inside a Drawer)
- It must support dark mode via the `.dark` class and CSS variables
- It must be accessible — keyboard navigation and ARIA attributes handled by Base UI

### File structure
```
packages/registry/registry/<name>.json    ← registry entry (JSON with embedded source)
apps/www/components/ui/<name>.tsx         ← component source for the docs site
apps/www/components/previews/             ← update component-previews.tsx
apps/www/lib/registry.ts                  ← add to components array + navSections
```

### Component file template

```tsx
"use client"

import * as React from "react"
import { ComponentName as ComponentPrimitive } from "@base-ui/react/component-name"
import { cn } from "@/lib/utils"

// Props interface
export interface ComponentNameProps
  extends React.ComponentPropsWithoutRef<typeof ComponentPrimitive.Root> {
  // your props
}

// Component
const ComponentName = React.forwardRef<
  React.ElementRef<typeof ComponentPrimitive.Root>,
  ComponentNameProps
>(({ className, ...props }, ref) => (
  <ComponentPrimitive.Root
    ref={ref}
    className={cn("your-base-classes", className)}
    {...props}
  />
))
ComponentName.displayName = "ComponentName"

export { ComponentName }
```

### Registry JSON template

```json
{
  "name": "component-name",
  "type": "component",
  "description": "One sentence description.",
  "version": "0.1.0",
  "baseUIVersion": ">=1.3.0",
  "files": [
    {
      "path": "component-name.tsx",
      "type": "component",
      "content": "... full component source as a string ..."
    }
  ],
  "dependencies": {
    "required": ["@base-ui/react", "clsx", "tailwind-merge"],
    "peer": []
  },
  "registryDependencies": ["utils"],
  "tags": ["category", "tag"]
}
```

### Adding a preview

In `apps/www/components/previews/component-previews.tsx`:

1. Import your real component at the top
2. Add a `ComponentNamePreview` function that renders a realistic demo
3. Add it to the `previewMap` export at the bottom

The preview must use the real component — not fake HTML that mimics it.

### Updating registry.ts

In `apps/www/lib/registry.ts`, add your component to:
1. The `components` array (with name, type, description, tags, baseUIPrimitive)
2. The correct section in `navSections`

---

## Fixing an existing component

1. Fix the component in `apps/www/components/ui/<name>.tsx`
2. Update the `"content"` field in `packages/registry/registry/<name>.json` to match
3. If the fix changes the API, update the docs in `apps/www/app/docs/components/[slug]/page.tsx`

---

## Pull request checklist

Before submitting:

- [ ] Component uses `@base-ui/react` only — no other primitive libraries
- [ ] Uses `render` prop on triggers, not `asChild`
- [ ] All classes use `cn()` from `@/lib/utils`
- [ ] Colors use CSS variables (`bg-primary`, `text-muted-foreground`, etc.)
- [ ] Works in dark mode
- [ ] Accessible — keyboard navigation works
- [ ] `pnpm --filter @baseui-cn/www type-check` passes with no errors
- [ ] `pnpm --filter @baseui-cn/www build` succeeds
- [ ] Preview renders the real component (not fake HTML)
- [ ] Registry JSON `"content"` matches the component source
- [ ] Added to `lib/registry.ts` components array and navSections
- [ ] `grep -r "asChild" apps/www/components/ui/` returns zero results
- [ ] `grep -r "@base-ui-components/react" .` returns zero results

---

## Development setup

```bash
# Clone the repo
git clone https://github.com/baseui-cn/baseui-cn.git
cd baseui-cn

# Install dependencies
pnpm install

# Start the docs site
pnpm --filter @baseui-cn/www dev

# Build the CLI
pnpm --filter @baseui-cn/cli build

# Type check
pnpm --filter @baseui-cn/www type-check
```

The docs site runs at `http://localhost:3000`.

---

## Questions

Open an issue or start a discussion on GitHub. For quick questions, the `llms.txt` at [baseui-cn.com/llms.txt](https://baseui-cn.com/llms.txt) has full context about the project's conventions.
