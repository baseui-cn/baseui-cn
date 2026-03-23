# baseui-cn

**Base UI components. One command install.**

A component registry built exclusively on [`@base-ui/react`](https://base-ui.com) with shadcn-style developer experience. 40+ accessible, Tailwind-styled components — copy into your project and own the code.

```bash
npx baseui-cn init
npx baseui-cn add drawer select combobox
```

[Documentation](https://baseui-cn.com) · [Component list](https://baseui-cn.com/docs/components/button) · [llms.txt](https://baseui-cn.com/llms.txt)

---

## Why

shadcn/ui mixes Radix UI, Vaul, Sonner, and cmdk — different portal and focus systems that conflict when composed. Select inside a Drawer breaks focus. Closing a Sonner toast dismisses the Drawer. Combobox portals render behind overlays.

baseui-cn uses **Base UI exclusively**. Every overlay, floating element, and interactive primitive shares one system:

- **Select inside Drawer** → works correctly
- **Toast inside Drawer/Dialog** → closing toast doesn't close the parent
- **Combobox inside any overlay** → no workaround needed
- **One dependency** to update, one API to learn, smaller bundles

## Quick start

```bash
# Initialize — installs deps, sets up CSS variables and utils
npx baseui-cn init

# Add components
npx baseui-cn add button
npx baseui-cn add dialog drawer toast
npx baseui-cn add --all
```

Works with **Next.js**, **Vite**, **Remix**, **Astro**, and any React project.

## Components

### Display
`button` · `badge` · `avatar` · `card` · `item` · `separator` · `scroll-area` · `skeleton` · `spinner` · `progress` · `toggle` · `toggle-group`

### Form
`input` · `textarea` · `label` · `checkbox` · `switch` · `radio-group` · `select` · `combobox` · `autocomplete` · `slider` · `number-field` · `field` · `input-group`

### Overlays
`dialog` · `alert-dialog` · `drawer` · `popover` · `tooltip` · `preview-card` · `dropdown-menu` · `toast` · `command` · `collapsible`

### Navigation & Data
`tabs` · `accordion` · `table` · `breadcrumb` · `pagination` · `menubar` · `navigation-menu`

### Blocks
`empty-state`

All overlay components share the same Base UI portal system — they compose safely without extra wrappers or z-index fixes.

## Theming

CSS variables follow the same naming convention as shadcn/ui. If you're migrating, your theme transfers directly:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0 0);
  --primary: oklch(0.21 0 0);
  --primary-foreground: oklch(0.985 0 0);
  /* ... same token names as shadcn */
}
```

Tailwind classes like `bg-primary`, `text-muted-foreground`, `border-border` work out of the box.

## Stack

- [@base-ui/react](https://base-ui.com) `>=1.3.0` — primitives
- [Tailwind CSS](https://tailwindcss.com) v4 — styling
- [class-variance-authority](https://cva.style) — variants
- [tailwind-merge](https://github.com/dcastil/tailwind-merge) — class merging
- React 18+ / Next.js 13+

## For AI agents

baseui-cn ships a [`llms.txt`](https://baseui-cn.com/llms.txt) manifest. AI agents (Cursor, Windsurf, Claude, etc.) read it to understand every component, its import path, usage patterns, and which dependencies belong to this project.

## Project structure

```
apps/www/          → Documentation site (Next.js)
packages/cli/      → CLI tool (npx baseui-cn)
packages/registry/ → Component registry JSON files
scripts/           → Build scripts for registry and previews
```

## Contributing

Contributions are welcome. To get started:

```bash
# Clone and install
git clone https://github.com/baseui-cn/baseui-cn.git
cd baseui-cn
pnpm install

# Start the docs site
pnpm dev --filter www

# Build the registry after editing components
node scripts/build-registry.mjs

# Build preview sources
node scripts/build-preview-sources.mjs
```

When adding or updating a component:

1. Edit/create the component in `apps/www/components/ui/`
2. Add metadata in `scripts/registry-meta.mjs`
3. Run `node scripts/build-registry.mjs` to regenerate registry JSON
4. Create previews in `apps/www/components/previews/`
5. Create/update the MDX doc in `apps/www/content/docs/components/`

## License

MIT
