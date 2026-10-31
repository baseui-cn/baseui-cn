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

## Create a new app

```bash
npx baseui-cn@latest create my-app
npx baseui-cn@latest create my-app --framework tanstack-start --package-manager pnpm
npx baseui-cn@latest create my-app --framework next --monorepo
```

Supported frameworks: `next`, `tanstack-start`, `react-router`, `vite`. The CLI delegates to the current official scaffolder, installs dependencies and initializes baseui-cn. No framework templates are maintained here. Install your selected npm, pnpm, Yarn (2+), or Bun first. Current upstream runtime requirements apply; Node 22.12+ is recommended for new projects. `-y` uses defaults for unspecified framework, package manager and structure; provide a project name for noninteractive use. Existing directories are never overwritten. Failed scaffolds are retained for inspection.

`--monorepo` creates the framework app under `apps/web` and a minimal workspace root. It does not create a shared UI package.

## Existing apps and workspaces

`init` detects Next.js, TanStack Start, React Router, Vite or generic React, plus package-manager declarations and lockfiles. At a workspace root it selects one candidate app automatically, prompts when there are multiple, and refuses ambiguous noninteractive installs. Component source, CSS, utils, config and dependencies resolve inside the app.

```bash
npx baseui-cn@latest init --workspace apps/web
npx baseui-cn@latest add button --workspace apps/web
npx baseui-cn@latest update button --workspace apps/web
npx baseui-cn@latest init --customize
```

Use `--customize` to choose paths and RSC settings. Detected settings use defaults without unnecessary confirmation; multiple possible stylesheets still prompt. Repeated init preserves configured paths, custom CSS and existing utils. Existing/custom apps must already configure Tailwind CSS v4 and their `@/*` source alias; init preserves their build configuration. New scaffolds receive alias and Tailwind integration where needed. They retain strict TypeScript checking while disabling upstream `noUnusedLocals`/`noUnusedParameters` compiler lint options to match the approved registry source contract. Existing app compiler settings are not changed; Data Grid currently needs those two unused-symbol checks disabled or local cleanup of unused bindings.

Workspace patterns support literal paths, `*`, `**`, and exclusions in package.json workspaces or pnpm-workspace.yaml. Brace/extglob patterns, symlink targets, shared UI generation and custom nonstandard app detection are outside automated workspace selection; run directly inside a custom app.

## Theme color and radius

Iris and Rounded (`lg`, `0.75rem`) are the defaults for fresh setup. New interactive setup asks for both. All presets write ordinary generic CSS variables; no proprietary public variables are added.

```bash
npx baseui-cn@latest create my-app --framework next --color emerald --radius xl
npx baseui-cn@latest init --color blue --radius md
```

Colors: `iris`, `blue`, `violet`, `emerald`, `orange`, `rose`, `neutral`. Radius: `sm` (Sharp), `md` (Medium), `lg` (Rounded), `xl` (Extra).

An existing theme is preserved unless you pass a theme flag or explicitly choose a new value interactively. Repeated noninteractive init without flags preserves custom CSS. `--color` only changes primary/accent/ring identity pairs; `--radius` only changes radius. Graphite surfaces and semantic status colors are preserved. Interactive reinitialization offers Keep existing values first.

## Core workflow

1. Initialize the project once with `init`.
2. Add the components or blocks you want with `add`.
3. Run `update` later to replace previously installed files with the latest registry versions.

The CLI detects existing requested and dependency component files before writing. Existing dependencies can be reused, replaced, or cancelled with reuse selected by default. If you already know you want to replace every matching requested and dependency file, use `--overwrite` with `add` or use `update`, which replaces installed files by default.

With `add -y` or dependency reuse, existing source and shared styles are preserved, and missing files are restored. This also completes an interrupted multi-file installation without replacing your customizations.

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

The publish workflow accepts tags named `cli-v<version>` and supports manual dispatch. A matching tag must equal `packages/cli/package.json`. Both paths publish to npm; run them only after the hosted registry gate passes.

1. Synchronize the CLI package version, CLI `--version` banner, and site release metadata. Run `pnpm build:all` to generate registry versions from the CLI manifest; leave private workspace package versions independent.
2. Validate and approve/merge the release code, including the changelog, package, and packed consumer.
3. Deploy baseui-cn.com with the approved website and all three registry distributions generated from that release code.
4. Verify the hosted registry version **and bytes** against the approved local output, preferably every registry JSON. At minimum compare `index.json`, `button.json`, `data-grid.json`, a shared-CSS component such as `select.json`, a modal such as `dialog.json`, and `date-picker.json` / `time-picker.json`.
5. Only after alignment, create/push the matching `cli-v<version>` tag and publish through the approved workflow. For 1.4.1, the tag is `cli-v1.4.1`.
6. Run an ordinary remote-first fresh consumer using the published package. Mark the release complete only after it passes.

The workflow installs frozen dependencies, generates registry artifacts, checks and builds the CLI, then publishes `baseui-cn` using the repository `NPM_TOKEN`. It does not deploy or verify the hosted registry. Because the CLI is remote-first, index version equality alone cannot establish alignment; component source and shared styles must match too.
