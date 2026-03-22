# baseui-cn

Add Base UI components to your app — one command at a time.

Tailwind-styled components built exclusively on [Base UI](https://base-ui.com) primitives. No Radix. No Vaul. One primitive layer.

## Quick start

```bash
npx baseui-cn init
npx baseui-cn add button
```

## Commands

### `init`

Set up your project — installs dependencies, creates `lib/utils.ts`, and injects CSS variables into your global stylesheet.

```bash
npx baseui-cn init
```

### `add`

Add one or more components. Automatically runs `init` if the project isn't set up yet.

```bash
npx baseui-cn add button
npx baseui-cn add button input select
npx baseui-cn add --all
```

### `list`

List all available components.

```bash
npx baseui-cn list
npx baseui-cn list --json
```

## Available components

| Component | Description |
|-----------|-------------|
| `button` | Accessible button with size and variant support |
| `input` | Text input with label, helper text, and error state |
| `textarea` | Multi-line input with optional auto-resize |
| `label` | Accessible form label with required indicator |
| `checkbox` | Checkbox with indeterminate state support |
| `switch` | Toggle switch |
| `radio-group` | Radio group with keyboard navigation |
| `select` | Custom select — no native element |
| `combobox` | Searchable select with filter |
| `autocomplete` | Text input with filtered suggestions |
| `dialog` | Modal dialog |
| `alert-dialog` | Confirmation dialog |
| `drawer` | Slide-in panel |
| `popover` | Floating popover |
| `tooltip` | Tooltip with delay group support |
| `dropdown-menu` | Dropdown menu |
| `toast` | Toast notifications |
| `command` | Command palette |
| `collapsible` | Collapsible panel |
| `tabs` | Tab navigation |
| `accordion` | Collapsible accordion |
| `badge` | Status badge with variant support |
| `avatar` | User avatar with status indicator |
| `progress` | Progress bar |
| `skeleton` | Loading placeholder |
| `separator` | Visual divider |
| `scroll-area` | Custom scrollable area |
| `table` | Semantic table primitives |
| `breadcrumb` | Breadcrumb navigation |
| `pagination` | Page navigation |
| `empty-state` | Empty state block |
| `login` | Login form block |
| `app-shell` | App shell block |

## Requirements

- React 18+
- Tailwind CSS v4
- Next.js 13+ (App Router recommended) or any React framework

## Docs

[https://baseui-cn.com](https://baseui-cn.com)
