# Create project, appearance and typography — implementation review

2026-11-02. **Engineering implementation and validation approved for a checkpoint commit and push on `fix/create-project-theme-typography`. Production release remains blocked.** No merge, deployment, npm publication, version bump or release tag is authorized. Proposed release: **1.4.2**, before the separate Data Grid 1.5.0 work.

## Baseline and isolation

Fetched origin before edits and again at completion. Exact `origin/main` remains `2842bf1300760c3daf7befb4edb98893549f0eef`. Created clean worktree `/private/tmp/baseui-cn-create-theme`, branch `fix/create-project-theme-typography`, from that SHA. That SHA is the checkpoint base; the checkpoint commit is confined to the feature branch.

The supplied checkout was already on `integration/data-grid-v9` with an existing modified publish workflow and untracked preparation/release files. Those files were preserved. Protected refs and worktrees remain:

| Boundary                                       | Final HEAD                                 | Result                                    |
| ---------------------------------------------- | ------------------------------------------ | ----------------------------------------- |
| `integration/data-grid-v9` / original checkout | `aa3744d329621fb1d6e70d68d396e1e6c3d051a6` | Same ref, same pre-existing status        |
| `chore/npm-release-hardening` / its worktree   | `74d3fbe62dd25b50b6dafd01ac543e9cef754204` | Same ref; clean                           |
| Private Pro checkout                           | `4754ac8d292436ee1b74989584dad81cf285fbc4` | Read-only status/HEAD verification; clean |

No Data Grid source, public component/registry entry, Pro source, GitHub workflow, release configuration or trusted-publishing configuration changed. Public main retains `@tanstack/react-table ^8.21.3`; registry fixtures confirm the v8 dependency specification. Package versions and CLI help version remain 1.4.1.

## Exact wrong-command reproduction and root cause

**The original `setupCommand()` new-project branch was already correct. There is no reproduced case where actual `projectMode=new` emits init.** The demonstrated defect was an implicit UI mode transition combined with misleading operation context.

On the untouched baseline, in real Chrome:

1. Open the landing “Create your project” Drawer: Next.js, New project.
2. Select pnpm and Monorepo.
3. Select **Existing React** in Framework. The handler silently changes Project to Existing.
4. Select **Next.js** again. The handler retains the previous Existing mode.
5. The Drawer title still says **Create your project**. Enter `my-app-online` in Workspace.
6. Copy command. The exact displayed and clipboard value is:

```sh
pnpm dlx baseui-cn@latest init --workspace my-app-online
```

[Captured UI/copy state](evidence/create-project-theme-typography/before.json), [baseline screenshot](evidence/create-project-theme-typography/before-wrong-command.png).

Also reproduced the original CLI failure against **public npm latest 1.4.1**, in an empty external directory. It exits nonzero with `--workspace requires a workspace root (package.json workspaces or pnpm-workspace.yaml).` [Published CLI evidence](evidence/create-project-theme-typography/published-misuse.txt).

The historical user's click sequence is unavailable; the sequence above is a verified way to produce the exact reported outcome. Explicitly selecting Existing + Monorepo also produces that command, but the static creation title obscured its meaning. The demonstrated categories are an implicit mode transition, retained local draft state, and misleading operation context—not a projectName-to-workspace assignment.

Audit findings:

- The landing CTAs share one Drawer and one SetupBuilder. Neither CTA resets a retained Existing draft. Close/reopen preserves React state; no URL/localStorage/sessionStorage project-mode persistence was found.
- Responsive changes alter geometry, not state ownership or command generation.
- Project name and Workspace already had separate state fields and conditional rendering. The generator did not read projectName as a workspace path.
- Installation PackageManagerTabs only prefixes its supplied command; it does not convert create into init. Existing workspace examples were valid in their stated context.
- QuickInstall explicitly targets an existing React/Tailwind app. No other production stateful generator for this setup flow was found.
- Public code/docs and onboarding/browser scripts were searched for setupCommand, init --workspace, create, workspace and projectName. Historical reports contain existing-app examples, not another live creation generator.

## Command contract and UI changes

The new-project framework menu contains only actual create adapters. Existing React is offered only after the user explicitly selects Existing project. Framework selection no longer changes Project implicitly. Switching Existing React back to New selects Next.js explicitly through the tested mode transition function.

The Drawer title/description now identify **Create new project** or **Initialize existing project**. New shows Project name; only Existing + Monorepo shows Workspace (optional), example `apps/web`, with **“Run this from the existing workspace root.”**

Mode changes clear Workspace, reset the project-name draft, and clear explicit appearance consent. New-project preview preferences remain available, but never silently become init flags. Same-mode close/reopen preserves the draft. Structure-hidden fields are ignored by generation. Invalid enums, preset IDs, names and paths suppress the command and Copy.

| Actual configuration | Before: generator behavior                       | After: guaranteed operation                                       |
| -------------------- | ------------------------------------------------ | ----------------------------------------------------------------- |
| New + single         | create, but framework could silently switch mode | `create <name> --framework <f> --package-manager <pm>`            |
| New + monorepo       | create + --monorepo when actual mode was New     | Same + `--monorepo`; never --workspace                            |
| Existing + single    | init                                             | `init`; never project name/workspace                              |
| Existing + monorepo  | init + optional workspace                        | `init [--workspace apps/web]`, explicitly an existing root/member |

Appearance flags follow these operations. New includes all four selected/default dimensions. Existing includes only explicitly selected dimensions. [Exact examples generated by setupCommand](evidence/create-project-theme-typography/command-examples.json):

```sh
pnpm dlx baseui-cn@latest create my-app-online --framework next --package-manager pnpm --color iris --radius lg --body-font inter --heading-font space-grotesk

pnpm dlx baseui-cn@latest create my-app-online --framework next --package-manager pnpm --monorepo --color iris --radius lg --body-font inter --heading-font space-grotesk

pnpm dlx baseui-cn@latest init --color iris --radius lg --body-font inter --heading-font space-grotesk

pnpm dlx baseui-cn@latest init --workspace apps/web --color iris --radius lg --body-font inter --heading-font space-grotesk
```

Without explicit appearance choices, the existing commands are simply `pnpm dlx baseui-cn@latest init` and `pnpm dlx baseui-cn@latest init --workspace apps/web`.

Runners remain npm → npx, pnpm → pnpm dlx, Yarn 2+ → yarn dlx, Bun → bunx. Fully specified framework/package-manager create commands default deterministically to single-app structure; bare create retains guided setup. Direct init misuse still fails before project mutation, now with existing-monorepo semantics and new-project/new-monorepo create examples. Create continues rejecting --workspace.

## Complete theme application and real bugs found

All seven existing colors and four radii remain. The authored identity colors are unchanged. Generation now expands each preset to its complete palette using the canonical shared light/dark values. Explicit --color replaces the selected palette, including background/foreground, semantic colors, primary/accent, **border, input and ring**. Omitted init color preserves existing values. Radius is independent and continues driving --radius-sm/md/lg/xl and component controls.

There was no independent border-style/width selection in SetupInput, its UI, or the theme schema. Border color belongs to the palette. No border CLI flag was added.

The real rendered matrix found two issues that token-string tests alone missed:

1. **Dark cascade:** existing stylesheet initialization could merge dark tokens into the foundation's layered `.dark { color-scheme: dark }`. An unlayered light :root then won. Foundation is now appended after palette integration; explicit selections require an unlayered dark palette, including when a consumer already has a layered .dark block. This has a named regression test and rendered dark proof in every final consumer.
2. **Heading specificity:** the current Vite starter has an ordinary `h1, h2 { font-family: var(--heading) }` rule. A zero-specificity :where heading default lost. Explicit heading selection now appends ordinary h1–h6 semantics, overriding that starter rule without targeting inputs/code/icons.

Representative final consumer values (Emerald, Extra):

| Token     | Light   | Dark    |
| --------- | ------- | ------- |
| --primary | #066348 | #6fdbb5 |
| --border  | #dedee3 | #3d3d43 |
| --input   | #7d8797 | #6c6c75 |
| --ring    | #149671 | #6abc9f |
| --radius  | 1rem    | 1rem    |

The matrix asserts the full source palette, dependency/import contracts, and production computed primary/border/input/ring/radius values in both modes. Theme fixtures cover all 28 color/radius pairs and the canonical derived radii. The site independently exercises all seven colors/four radii in light/dark. Iris/Rounded examples retain their original values (light primary #5b55c9, dark primary #a8aeff, radius 0.75rem).

## Typography architecture and licensing

`scripts/typography-definition.json` is the canonical curated manifest. The existing theme generator distributes it to the website and CLI; CLI validation, prompts, dependency planning and the website consume those definitions.

Body presets: **system, inter, geist, manrope, roboto**. Heading presets: **system, inter, geist, manrope, montserrat, poppins, space-grotesk**. New defaults are system/system. New CLI flags: **--body-font** and **--heading-font**, documented in both help commands and installation/README examples.

Verified npm availability, package metadata, font-face CSS and distributed LICENSE files on 2026-11-02:

| Preset        | Package, version                         | Imported normal face                | License             |
| ------------- | ---------------------------------------- | ----------------------------------- | ------------------- |
| system        | None                                     | OS sans-serif stack                 | No distributed font |
| inter         | @fontsource-variable/inter 5.3.0         | Variable, 100–900                   | OFL-1.1             |
| geist         | @fontsource-variable/geist 5.3.0         | Variable, 100–900                   | OFL-1.1             |
| manrope       | @fontsource-variable/manrope 5.3.0       | Variable, 200–800                   | OFL-1.1             |
| roboto        | @fontsource-variable/roboto 5.3.0        | Variable, 100–900                   | OFL-1.1             |
| montserrat    | @fontsource-variable/montserrat 5.3.0    | Variable, 100–900                   | OFL-1.1             |
| poppins       | @fontsource/poppins 5.3.0                | Static 400, 500, 600, 700, 800, 900 | OFL-1.1             |
| space-grotesk | @fontsource-variable/space-grotesk 5.3.0 | Variable, 300–700                   | OFL-1.1             |

Poppins metadata says variable=false; @fontsource-variable/poppins returns npm E404, so the static package is deliberate. The packages' OFL terms permit use/bundling/redistribution with their license conditions. Installed packages retain their notices. [Fontsource installation guidance](https://fontsource.org/docs/getting-started/install) and [Poppins family/license information](https://fontsource.org/fonts/poppins/about) support this strategy.

Non-system dependencies are installed in the consumer application with exact version saving (npm/pnpm --save-exact, Yarn/Bun --exact), separately from the unchanged standard dependency install. Matching body/heading selections deduplicate both installation and CSS imports. System adds no Fontsource dependency/import. Existing font packages/imports are never removed.

The selected package CSS is imported at the beginning of the app's actual global stylesheet. Relative package font URLs become app-owned build assets. No arbitrary binaries are checked into source; no selected font depends on baseui-cn.com or Google Fonts runtime URLs. Unicode-range faces are provided by the packages. Additional italics/weights can be added by consumers. Official Next starters retain their own upstream next/font integration; the selected public tokens override body/heading typography.

The app owns generic **--font-body** and **--font-heading** tokens, defined consistently for :root/.dark. Body uses the body token; semantic h1–h6 use the heading token. Tailwind's sans alias follows explicit body selection. No --cn-\* variable was introduced. Heading selection does not target inputs, code, monospace content or icons; rendered Next code retains its separate Geist Mono family.

The same CSS/package installation path works in all four frameworks. No framework-specific typography adapter was added.

## Existing-project preservation and framework/manager integration

Omitting both font flags never injects/replaces typography. Interactive init offers **Keep existing typography** first for each dimension, even when custom setup cannot be detected. Noninteractive/default init preserves it. Explicit body-only changes leave heading rules alone and vice versa. Managed blocks update idempotently; unrelated consumer CSS is retained. Theme flags with skipped CSS initialization fail before installation.

Real repeated init after app customization preserved the stylesheet byte-for-byte in every final matrix cell. The initializer retains existing font imports/dependencies instead of destructively removing an application's setup.

Two practical onboarding adjustments are included:

- New apps record their selected package manager; fresh Yarn apps use node-modules linking, including single apps.
- Current TanStack's official single-app pnpm scaffold declares packages: ["."]. Workspace detection now accepts an explicitly self-listed root only when it is a recognized application framework. Empty roots/library roots remain protected. Explicit member validation and symlink checks remain.

## Real generated-command acceptance

**8/8 final flows pass**, including production builds, mounted semantic sample pages, rendered selected font faces, locally served font responses, light/dark palette/radius checks and repeated init preservation.

Each primary command was produced by setupCommand and executed unchanged by /bin/sh using the real selected runner. A loopback npm registry served the packed, unpublished candidate under baseui-cn@latest; other package/scaffolder requests used public npm. It did not publish or rewrite the command into node/local-CLI equivalents. Framework scaffolders/installers/builds were real; only existing-app fixture preparation and representative sample mounting were harness-owned.

Final candidate tarball SHA-256: **d61de9e84944584fc0ca45429f6bcaffa4b97794a6f327d6511ba496db9f065a**. CLI executable SHA-256: **5d59f70b66ea01b6f8d31ad7e1185f943f5e267a9dd6a0adb04acaa90eb3ea6c**.

| Flow                        | Framework                               | Manager      | Body / heading        | Final result                              |
| --------------------------- | --------------------------------------- | ------------ | --------------------- | ----------------------------------------- |
| New single                  | Next 16.4.4                             | pnpm 10.12.1 | Inter / Space Grotesk | PASS                                      |
| New single                  | Next 16.4.4                             | npm 10.9.8   | Geist / Manrope       | PASS                                      |
| New single                  | TanStack Start 1.169.4                  | pnpm 10.12.1 | Roboto / Montserrat   | PASS                                      |
| New single                  | React Router 8.5.1                      | Yarn 4.18.1  | Manrope / Poppins     | PASS                                      |
| New single                  | Vite, official current React TS starter | Bun 1.4.4    | System / Inter        | PASS                                      |
| New monorepo, apps/web      | Vite, official current React TS starter | pnpm 10.12.1 | Inter / Inter         | PASS, one font package/import             |
| Existing single             | Next 16.4.4                             | npm 10.9.8   | System / System       | PASS, no Fontsource dependency            |
| Existing monorepo, apps/web | Next 16.4.4                             | npm 10.9.8   | Inter / Space Grotesk | PASS, root has no app dependencies/config |

[Full final command/config/computed-style/font-response evidence](evidence/create-project-theme-typography/consumer-results.json) retains each exact command, consumer path, log path and font manifest. This is representative matrix coverage, not every framework × manager × structure permutation.

Qualification history is retained outside the repo under `/private/tmp/baseui-create-theme-evidence`. Earlier runs exposed the real Vite specificity and dark cascade defects above. Harness assertions were corrected for Chrome's normalization of BlinkMacSystemFont and quoting, and for Next's named Geist Mono family. Yarn's synthetic candidate metadata needed publication time for its age gate. Finally, Bun reused an older executable for the unchanged test version: its final cell was rerun with isolated cache/temp directories and a preload that rejects any CLI bytes differing from the final candidate. The seven passing `consumers-complete` cells plus `consumers-bun-final` use the **same tarball SHA**; the aggregate evidence records both runs. The reusable harness now isolates Bun and attests candidate CLI execution.

## Validation and screenshots

| Check                                    | Result                                                                                                                                                                                                         |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CLI TypeScript                           | PASS                                                                                                                                                                                                           |
| Website TypeScript                       | PASS                                                                                                                                                                                                           |
| Lint                                     | PASS; one pre-existing, unchanged Data Grid exhaustive-deps warning                                                                                                                                            |
| build:all, registry:check, theme:check   | PASS                                                                                                                                                                                                           |
| Theme fixtures/contrast/hover checks     | PASS; 28 preset pairs, preservation, explicit ownership, repeat idempotence                                                                                                                                    |
| Existing CLI install fixtures            | PASS, including v8 dependency and source/style preservation cases                                                                                                                                              |
| Existing onboarding suite                | **59/59 PASS**; 448 new + 448 existing color/radius command combinations                                                                                                                                       |
| New setup contract suite                 | **62/62 PASS**; all runner/mode/structure combinations, hidden fields, direct misuse, 35 font pairs, actual CLI parser/create-plan/CSS round-trip, preservation and named regressions                          |
| Real consumers                           | **8/8 PASS**, 16 rendered light/dark states plus production builds                                                                                                                                             |
| Production endpoints                     | **173/173 PASS**, 55 registry response bodies byte-identical to local files                                                                                                                                    |
| Final landing Setup Drawer browser suite | **93/93 PASS**                                                                                                                                                                                                 |
| Font-selector browser suite              | PASS at 1440×900 and 320×740, each light/dark; all 12 curated dimension choices, font loading, keyboard focus/navigation, popup bounds, palettes/radii, exact command/CSS copy, mode transitions, close/reopen |
| git diff --check                         | PASS                                                                                                                                                                                                           |

Drawer coverage includes seven desktop/tablet/mobile/landscape sizes, 72 Tab/Shift+Tab containment moves per size/theme, popup Escape, Drawer Escape/close/Done focus return, scrolling and synthetic visual-viewport resize/pan. Zero runtime page errors were recorded. This is automated desktop Chrome/emulated viewport evidence, not physical-device or screen-reader testing.

- [Before: exact wrong copied command](evidence/create-project-theme-typography/before-wrong-command.png)
- [Desktop light](evidence/create-project-theme-typography/desktop-light.png), [desktop dark](evidence/create-project-theme-typography/desktop-dark.png)
- [Mobile light](evidence/create-project-theme-typography/mobile-light.png), [mobile dark](evidence/create-project-theme-typography/mobile-dark.png)
- [Font/browser result summary](evidence/create-project-theme-typography/typography-browser-results.json)

Full browser screenshots, app screenshots, help output, endpoint hashes, package/license inspection archives and logs remain in the external evidence directory. The repository evidence subset contains only five useful screenshots, four compact JSON records and one small published-CLI failure transcript. Temporary logs, build output, package archives and external consumers remain outside the commit; the duplicate ignored failure log was removed during inventory review.

## Release impact and remaining limits

Public npm latest was verified as 1.4.1 and does **not** yet provide these font flags. The tested artifact is the unpublished candidate. **RELEASE BLOCKER: production baseui-cn.com must not expose commands containing --body-font or --heading-font until npm baseui-cn@1.4.2 is publicly available and verified.** A checkpoint branch push does not authorize website exposure. Proposed release is 1.4.2; no version was changed here.

Official create adapters intentionally use latest upstream scaffolders; upstream versions/runtime requirements can change. Node 22.22.3 was used for this qualification. Custom existing CSS with more-specific selectors or !important can intentionally override generic typography/theme defaults; the initializer preserves custom setup rather than destructively rewriting arbitrary application CSS. Additional italic styles are consumer-owned. Physical keyboard/assistive-technology testing is not claimed.

Only the approved feature-branch checkpoint commit and push are authorized. No merge, publication, deployment, version bump, tag or trusted-publishing change is authorized. Stop after the engineering checkpoint.

## Engineering checkpoint review

The complete 44-file inventory was reviewed again. No disposable artifacts are included. The root package.json change is a test-script entry only, so it is classified as test/harness; the website manifest and lockfile are dependency changes.

Final focused checks passed for this checkpoint: CLI/website TypeScript, lint, build:all, registry:check, setup contract (62), onboarding (59), local production Drawer browser checks (93), real-consumer evidence integrity (8), and git diff --check. The final real consumers are not recreated because approved implementation bytes have not changed since their successful qualification; the tested CLI SHA and durable consumer evidence are rechecked.

The prior lint warning remains outside this scope in unchanged Data Grid source. Protected refs/worktree status, package versions and release tags were rechecked without changes. Fresh checkpoint logs and all 93 Drawer results are retained under `/private/tmp/baseui-create-theme-checkpoint-20261102`, outside the commit.

## Final categorized file inventory

### A. implementation (16)

- `apps/www/components/shared/home-theme-provider.tsx`
- `apps/www/components/shared/setup-builder.tsx`
- `apps/www/lib/setup-command.ts`
- `apps/www/lib/typography-presets.ts`
- `apps/www/styles/globals.css`
- `apps/www/styles/landing.css`
- `packages/cli/src/commands/create.ts`
- `packages/cli/src/commands/init.ts`
- `packages/cli/src/index.ts`
- `packages/cli/src/program.ts`
- `packages/cli/src/utils/ensure-styles.ts`
- `packages/cli/src/utils/project.ts`
- `packages/cli/src/utils/theme-options.ts`
- `packages/cli/src/utils/typography.ts`
- `scripts/build-theme.mjs`
- `scripts/typography-definition.json`

### B. generated required output (5)

- `apps/www/lib/__generated__/theme.json`
- `apps/www/lib/__generated__/typography.json`
- `apps/www/styles/theme.generated.css`
- `packages/cli/src/utils/theme.generated.ts`
- `packages/cli/src/utils/typography.generated.ts`

### C. test/harness (8)

- `package.json`
- `scripts/check-cli-onboarding.mjs`
- `scripts/check-create-consumers.mjs`
- `scripts/check-landing-setup-browser.mjs`
- `scripts/check-setup-contract.mjs`
- `scripts/check-setup-typography-browser.mjs`
- `scripts/check-theme-fixtures.mjs`
- `scripts/consumer-appearance.mjs`

### D. documentation/evidence (13)

- `apps/www/app/docs/installation/page.tsx`
- `docs/create-project-theme-typography-report.md`
- `docs/evidence/create-project-theme-typography/before-wrong-command.png`
- `docs/evidence/create-project-theme-typography/before.json`
- `docs/evidence/create-project-theme-typography/command-examples.json`
- `docs/evidence/create-project-theme-typography/consumer-results.json`
- `docs/evidence/create-project-theme-typography/desktop-dark.png`
- `docs/evidence/create-project-theme-typography/desktop-light.png`
- `docs/evidence/create-project-theme-typography/mobile-dark.png`
- `docs/evidence/create-project-theme-typography/mobile-light.png`
- `docs/evidence/create-project-theme-typography/published-misuse.txt`
- `docs/evidence/create-project-theme-typography/typography-browser-results.json`
- `packages/cli/README.md`

### E. dependency/lockfile (2)

- `apps/www/package.json`
- `pnpm-lock.yaml`
