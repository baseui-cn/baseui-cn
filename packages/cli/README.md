# baseui-cn

Add Base UI components to your app, one command at a time.

`baseui-cn` is the CLI for the `baseui-cn` component library. It installs Tailwind-styled React components built exclusively on [Base UI](https://base-ui.com) primitives, with no Radix or Vaul dependency layer in between.

## Quick start

Use whichever package runner matches your setup:

```bash
npx baseui-cn init
npx baseui-cn add button
```

```bash
pnpm dlx baseui-cn init
pnpm dlx baseui-cn add button
```

```bash
bunx baseui-cn init
bunx baseui-cn add button
```

## Core workflow

1. Initialize the project once with `init`.
2. Add the components or blocks you want with `add`.
3. Run `update` later to replace previously installed files with the latest registry versions.

The CLI can also detect existing component files and prompt before replacing them. If you already know you want to replace matching files, use `--overwrite` with `add` or use `update`, which replaces installed files by default.

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
npx baseui-cn add command data-grid
npx baseui-cn add login signup
npx baseui-cn add otp-field --css src/styles.css
npx baseui-cn add button --overwrite
npx baseui-cn add --all
```

### `update`

Replace existing installed components with the latest registry versions.

```bash
npx baseui-cn update button
npx baseui-cn update data-grid command
npx baseui-cn update login signup
npx baseui-cn update --all
```

### `list`

List every currently supported installable in the registry.

```bash
npx baseui-cn list
npx baseui-cn list --json
```

## Installable families

Some installables write a single file, while others install a small family of related files.

- `empty-state` installs into `components/ui/blocks.tsx`
- `login` and `signup` install into `components/ui/auth.tsx`
- `data-grid` installs the full reusable data-grid family under `components/data-grid/*` plus its supporting hook

That means consumers can still run one command such as `baseui-cn add data-grid`, but receive the full grouped implementation instead of a single demo file.

## Available installables

Display: `button`, `badge`, `avatar`, `card`, `item`, `separator`, `scroll-area`, `skeleton`, `spinner`, `progress`, `toggle`, `toggle-group`

Form: `input`, `textarea`, `label`, `field`, `checkbox`, `switch`, `radio-group`, `select`, `combobox`, `autocomplete`, `slider`, `number-field`, `otp-field`, `input-group`

Overlays: `dialog`, `alert-dialog`, `drawer`, `popover`, `tooltip`, `preview-card`, `dropdown-menu`, `toast`, `command`

Layout: `collapsible`, `accordion`, `tabs`

Navigation & Data: `table`, `data-grid`, `breadcrumb`, `pagination`, `menubar`, `navigation-menu`

Blocks: `empty-state`, `login`, `signup`

## Requirements

- React 18+
- Tailwind CSS v4
- Next.js 13+ with the App Router recommended, or any React framework with a compatible Tailwind setup

## Docs

- Website: [https://baseui-cn.com](https://baseui-cn.com)
- Component docs: [https://baseui-cn.com/docs/components](https://baseui-cn.com/docs/components)

## Maintainer release flow

Package publishing can be automated from git with the included GitHub Actions workflow.

1. Bump `packages/cli/package.json` to the release version you want.
2. Commit and push that change to `main`.
3. Create and push a matching git tag in the format `cli-v<version>`.

```bash
git tag cli-v1.0.3
git push origin cli-v1.0.3
```

The workflow will install dependencies, build the generated registry artifacts, verify the CLI package, and publish `baseui-cn` to npm using the repository `NPM_TOKEN` secret.
