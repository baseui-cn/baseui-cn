# baseui-cn

**A Base UI-first component registry with shadcn-style developer experience.**

One primitive layer. One command. Your code.

```bash
npx baseui-cn init
npx baseui-cn add drawer
```

---

## Why

shadcn/ui mixes Radix UI, Vaul, and other libraries depending on the component. This works, but it creates friction: Select and Combobox come from Radix, Drawer comes from Vaul (now unmaintained), and floating elements from different systems can conflict with each other.

baseui-cn uses **Base UI exclusively** — every interactive primitive is from `@base-ui-components/react`. This means:

- Select, Combobox, Tooltip, and Drawer all share one portal and overlay system
- No z-index conflicts from mixing overlay libraries
- No Vaul. Base UI's own Drawer became stable in v1.3.0 (March 12, 2026)
- One dependency to update, one API to learn

## Quick start

```bash
# 1. Initialize (installs deps, sets up CSS variables and utils)
npx baseui-cn init

# 2. Add components
npx baseui-cn add button
npx baseui-cn add drawer select combobox
npx baseui-cn add --all
```

## Components

| Component     | Type      | Base UI Primitive            |
| ------------- | --------- | ---------------------------- |
| button        | component | native `<button>`            |
| input         | component | native `<input>`             |
| textarea      | component | native `<textarea>`          |
| label         | component | native `<label>`             |
| checkbox      | component | `Checkbox`                   |
| switch        | component | `Switch`                     |
| radio-group   | component | `RadioGroup`                 |
| select        | component | `Select`                     |
| combobox      | component | `Select` + filter            |
| dialog        | component | `Dialog`                     |
| **drawer**    | component | **`Drawer` (stable v1.3.0)** |
| popover       | component | `Popover`                    |
| tooltip       | component | `Tooltip`                    |
| dropdown-menu | component | `Menu`                       |
| command       | component | `Select` + search            |
| toast         | component | `Toast`                      |
| tabs          | component | `Tabs`                       |
| accordion     | component | `Accordion`                  |
| table         | component | native `<table>`             |
| badge         | component | —                            |
| breadcrumb    | component | —                            |
| pagination    | component | —                            |
| separator     | component | —                            |
| skeleton      | component | —                            |
| empty-state   | block     | —                            |
| login         | block     | form primitives              |
| app-shell     | block     | —                            |

## Theming

CSS variables follow the same naming convention as shadcn/ui. If you're migrating, your theme transfers directly:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  /* ... same as shadcn */
}
```

## For AI agents

See [`llms.txt`](./llms.txt) for a structured manifest optimized for AI coding assistants and agents.

## Stack

- [Base UI](https://base-ui.com) `>=1.3.0` — primitives
- [Tailwind CSS](https://tailwindcss.com) — styling
- [class-variance-authority](https://cva.style) — variants
- [tailwind-merge](https://github.com/dcastil/tailwind-merge) — class merging
- React 18+ / Next.js 13+

## License

MIT
