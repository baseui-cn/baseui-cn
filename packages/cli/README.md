# baseui-cn

Add Base UI components to your app, one command at a time.

Tailwind-styled components built exclusively on [Base UI](https://base-ui.com) primitives. No Radix. No Vaul. One primitive layer.

## Quick start

```bash
npx baseui-cn init
npx baseui-cn add button
```

## Commands

### `init`

Set up your project. This installs required dependencies, creates `lib/utils.ts`, and injects theme variables into the stylesheet you choose during setup.

```bash
npx baseui-cn init
npx baseui-cn init --css src/styles.css
```

### `add`

Add one or more installables. If the project is not initialized yet, `add` will run `init` first.

```bash
npx baseui-cn add button
npx baseui-cn add button --css src/styles.css
npx baseui-cn add button input select
npx baseui-cn add --all
```

### `list`

List every currently supported installable in the registry.

```bash
npx baseui-cn list
npx baseui-cn list --json
```

## Available installables

Display: `button`, `badge`, `avatar`, `card`, `item`, `separator`, `scroll-area`, `skeleton`, `spinner`, `progress`, `toggle`, `toggle-group`

Form: `input`, `textarea`, `label`, `field`, `checkbox`, `switch`, `radio-group`, `select`, `combobox`, `autocomplete`, `slider`, `number-field`, `input-group`

Overlays: `dialog`, `alert-dialog`, `drawer`, `popover`, `tooltip`, `preview-card`, `dropdown-menu`, `toast`, `command`

Layout: `collapsible`, `accordion`, `tabs`

Navigation & Data: `table`, `breadcrumb`, `pagination`, `menubar`, `navigation-menu`

Blocks: `empty-state`, `login`, `signup`

`empty-state` is installed into `components/ui/blocks.tsx`.

`login` and `signup` are installed into `components/ui/auth.tsx`.

## Requirements

- React 18+
- Tailwind CSS v4
- Next.js 13+ (App Router recommended) or any React framework

## Docs

[https://baseui-cn.com](https://baseui-cn.com)
