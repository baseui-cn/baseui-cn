# Landing experience and CLI onboarding — approved implementation checkpoint

**Current state — October 23, 2026:** visual/product approval has been received for the landing experience, real V2 right setup Drawer, theme/radius configuration and CLI onboarding. Section **55** records the final approved implementation checkpoint and exact 32-file commit scope. The commit containing this report supersedes `761f948ba3e913164bd0c88e89f79926ffe08779` as the implementation baseline for the next release candidate. **Release remains PAUSED pending new RC validation/approval and hosted-registry version/complete-byte alignment.**

Sections 1–54 retain dated implementation and review evidence. Their references to pending visual approval, unchanged HEAD or uncommitted work describe those earlier checkpoints and are superseded by section 55; no evidence has been removed.

October 22, 2026. **Implemented locally; RELEASE PAUSED. Everything is uncommitted.** Visual/product approval and a new approved release-candidate checkpoint are still required. No merge, deploy, tag, publish, push or template work was performed.

## 1. Baseline SHA

Verified before edits: branch `feature/design-system-v2`, exact clean HEAD `761f948ba3e913164bd0c88e89f79926ffe08779` (`chore: prepare baseui-cn 1.4.0 release`). Reviewed the release audit, Phase 9 report, homepage, init/add/config/style/registry code, registry generator, manifests, README and publication workflow. That RC is now superseded for review. HEAD remains unchanged.

## 2. Homepage problems identified

The hero had weak hierarchy, a flat pale canvas and a project/notification form without meaningful outcomes. Install commands repeated with little context; the long card catalog dominated the story. The page under-explained editable source, framework onboarding and Base UI's behavior foundation.

## 3. Hero redesign

New message: “Accessible React components. Own the source. Build your system.” An enlarged, deliberate type scale, clear two-action area and restrained Iris setup selection create a stronger first screen. Supporting copy naturally retains React, Base UI, Tailwind CSS, accessible, copy-and-own, editable source and component library. No fake signup/configuration controls remain.

## 4. Before/after visual direction

Before: documentation-like two-column form and repeated command boxes. After: editorial product introduction and a useful terminal setup workbench, followed by an actual component composition and varied neutral surfaces. Graphite, neutral borders and restrained Iris stay within approved V2. There are no gradients, glass effects, marquees, floating ornaments or animation-dependent reveals. Manual review finds the first screen substantially clearer and more distinctive; user visual approval is still pending.

## 5. Setup builder

Framework, new/existing project, single/monorepo and npm/pnpm/Yarn/Bun choices produce a real command. Name is shown only for new apps; optional workspace only for existing monorepos. Custom React switches to existing-project mode and offers no unsupported create flow. Invalid names/workspace paths suppress Copy and show a useful error. Existing framework selection explains auto-detection; it does not add a fake framework flag to init.

## 6. Command-generation logic

`apps/www/lib/setup-command.ts` owns typed inputs, supported choices, runner mapping, primary command, follow-up and description. npm → `npx`, pnpm → `pnpm dlx`, Yarn → `yarn dlx`, Bun → `bunx`. Create includes explicit framework/manager and optional `--monorepo`; init/add can include implemented `--workspace`. No shell fragments from unvalidated input are interpolated. Automated tests cross-check all 16 create combinations; browser checks exercise their actual controls.

## 7. Homepage sections

Hero/setup; real component install planner; concise two-command installation; CLI → project → editable file source story; compact grouped component directory; Base UI behavior/positioning/keyboard/composition foundation; actual generic CSS tokens and light/dark preview; existing Empty State/Login/Sign Up blocks with a live shared EmptyState and canonical docs; changelog/editor/AI exports; retained FAQ; final CTA. The former giant grid remains available as an existing shared module but is no longer the landing page's presentation.

## 8. Responsive behavior

Production captures/checks cover **1440, 1280, 1024, 768, 390 and 320px**, light/dark. The hero stacks below 1024; controls stack at mobile widths; code wraps or scrolls internally; table overflow belongs to its wrapper. All 12 width/theme checks have no document overflow. Full mobile builder captures confirm readable controls, complete output and reachable 44px Copy. Both 390px and 320px CTAs remain on one row without clipping.

## 9. Dark mode

Uses existing Graphite variables and restrained Iris, with crisp surface boundaries and quiet depth. All required dark screenshots were visually inspected. Local theme preview switches its own actual variables while respecting the site's existing theme system. No public theme definition or component-family stylesheet changed.

## 10. Accessibility

Shared Button/Input/Select/Checkbox/Switch/Tabs/Table/Dialog/Toast are used. Controls have labels and pressed/checked states; command regions are keyboard accessible; Copy announces actual success/failure. Skip-link, keyboard Select dismissal, Dialog focus return and reduced-motion emulation pass. The planner reuses the root Toast provider. Final axe light/dark: **zero violations**, one incomplete contrast check for the pre-existing ⌘ shortcut glyph. Small picker controls retain approved geometry; no physical-device or screen-reader certification is claimed.

## 11. Framework support matrix

| Framework            | Existing init detection                           | Official new-project adapter             | Real acceptance                                                                  |
| -------------------- | ------------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------- |
| Next.js              | Yes, dependency/config plus src/app detection     | `create-next-app@latest`                 | npm create + Button/Input/Dialog + types/build; npm monorepo repeat/add/build    |
| TanStack Start       | Yes, `@tanstack/react-start`, ahead of Vite       | `@tanstack/cli@latest create`            | npm create + Button/Input/Dialog + types/build                                   |
| React Router         | Yes, framework/router dependencies, ahead of Vite | `create-react-router@latest`             | npm create + Button/Input/Dialog + route typegen/typecheck/build                 |
| Vite                 | Yes, Vite + React                                 | `create-vite@latest --template react-ts` | npm create + components + types/build; pnpm monorepo; final packed create + Grid |
| Custom/generic React | Yes, React or truthful unknown fallback           | Existing-project init only               | Detection and existing CLI fixtures; user's Tailwind v4/alias pipeline required  |

All four create adapters construct npm/pnpm/Yarn/Bun runner commands. **Real Yarn/Bun creation/install is not claimed.** Yarn requires 2+; Yarn Classic fails with an npm/upgrade fallback. Existing apps keep their compiler/build configuration. New apps retain strict TypeScript but match the approved registry's unused-symbol policy (see sections 23/28).

Official references checked before implementation: [Next CLI](https://nextjs.org/docs/app/api-reference/cli/create-next-app), [TanStack Start CLI entry](https://tanstack.com/start/latest/docs/framework/react/getting-started), [React Router installation](https://reactrouter.com/start/framework/installation), [Vite scaffolding](https://vite.dev/guide/). Actual current `--help` output is retained as `*-help-live.txt` in the evidence root. These live commands/options, rather than remembered syntax, informed the adapters.

## 12. Next.js support

Official TypeScript/App Router/src/Tailwind/alias scaffold, selected manager, skip upstream install and git, then app/workspace installation and baseui init. Real generated app used Next **16.4.2** (the repository remains **16.1.7**). App config resolves to `src/components/ui`, `src/lib/utils`, `src/app/globals.css`, RSC true. Real npm single-app and monorepo builds pass.

## 13. TanStack Start support

First-class choice throughout. Uses the current unified TanStack CLI, React framework, no install/git/intent/example/toolchain prompts and noninteractive mode. Standard upstream Start scaffold supplies Tailwind. Generated Start **1.169.3** app uses `src/styles.css`, `src/components/ui`, aliases and RSC false. Real npm install, TypeScript and production client/server build pass.

## 14. React Router support

Current official scaffolder with explicit package manager and no install/git/agent-skills prompts. Real generated Router **8.5.0** app revealed its `app/` source convention. Detection now targets `app/components/ui`, `app/lib/utils` and the actually imported `app/app.css`. `@/*` is added alongside upstream `~/*` for new apps. Official typecheck generates route types before tsc; both typecheck and production build pass. An initial raw tsc run without route typegen failed and is retained as harness evidence; the supported check passes.

## 15. Vite support

Official React/TypeScript scaffold, then Tailwind CSS v4 Vite plugin, `vite-tsconfig-paths`, `@/*` TS paths and the imported `src/index.css`. No private app template. Real Vite **8.3.5** builds pass for npm single-app and pnpm monorepo. Final installed-tarball create produces a fresh Vite app that installs Grid and builds without manual compiler edits.

## 16. Generic React support

React dependency detection and unknown fallback remain compatible with config-light existing consumers. Theme/utils/config initialization continues. Custom apps require their own working Tailwind CSS v4 pipeline and `@/*` source alias; init does not overwrite a custom bundler configuration. `--customize` exposes component/utils/RSC/CSS settings. Generic React is never offered as an unsupported new scaffold.

## 17. New-project create flow

`create [name]`, optional `--framework`, `--package-manager`, `--monorepo`, `-y`. Missing choices prompt; fully specified flows run without confirmation. Project names are constrained to safe lowercase directory/package names. Existing destinations are refused. The chosen manager is checked before workspace creation. Official scaffolder output is verified as the expected framework, integrated, installed and initialized; failures stop with a nonzero exit and retained path. Useful cd/dev/add next steps follow success only.

## 18. Existing-project detection

Dependency detection orders Next, Start, Router, Vite and generic React, with config-only Next fallback retained. Known framework/manager/source values are printed rather than reconfirmed. Ambiguous stylesheets still prompt; explicit `--customize` allows path/RSC choices. Repeated init preserves prior configuration, custom theme and existing utils. Dependency installation failure propagates instead of reporting successful setup.

## 19. Package-manager detection

npm, pnpm, Yarn and Bun: nearest packageManager field first, then local lockfiles (including bun.lock/bun.lockb), then ancestors; pnpm workspace configuration supplies pnpm when no lock exists. No packageManager/lock evidence falls back to npm, preserving prior usage. All four detection and inherited-workspace cases are automated.

## 20. Monorepo detection

Ascends for package.json workspaces arrays/object packages or pnpm-workspace.yaml packages. Supports common literal/star/double-star/exclusion patterns, skips node_modules/build/hidden directories and avoids symlink traversal. New monorepos have a private root, `apps/web`, basic dev/build forwarding, pnpm workspace YAML where needed and Yarn node-modules linking. No shared UI package is generated.

## 21. Workspace target selection

Root resolves actual app candidates, excluding generic packages/ui from automatic selection. One candidate auto-selects; multiple prompt, or fail noninteractively with `--workspace` guidance. Invalid/root/escaping targets fail before writes. init/add/update resolve files, CSS, utils, config and package installation from the selected app and restore cwd even on errors. Real npm and deterministic four-manager fixtures confirm root safety.

## 22. Backward compatibility

Version remains 1.4.0. Existing init/add/add --all/update/overwrite, source/style reuse, missing-family recovery, custom theme preservation, remote-first registry with bundled fallback, MIT LICENSE and compatible Table v8 declaration remain. Full existing fixture suite passes. No approved V2 component source, API, theme or registry byte changed. Init's smarter defaults replace routine questions; `--customize` retains explicit choices. Install failures now fail truthfully.

## 23. Real scaffold/consumer tests

All four official npm scaffolds were actually run, then initialized and given Button/Input/Dialog and production/type checks. Real npm Next monorepo and pnpm Vite monorepo pass. Actual tarball install/create on fresh Vite installs Grid with `@tanstack/react-table@^8.21.3`, preserves customized source/theme and builds. Six production-browser Grid checks verify 13/500 initial rows, scroll to Person 0345, data updates, keyboard sorting, and custom theme/no overflow at 320px in both modes.

The packed Grid test initially exposed two pre-existing unused bindings under Vite's noUnused compiler flags. To preserve protected component source, create configures those two lint-like flags off while retaining strict typechecking, matching the registry's compiler contract. Existing project configs stay unchanged; their users must disable those flags or clean up their locally owned source. This explicit tradeoff is part of the requested product review.

Real Yarn/Bun execution was not performed. Network-enabled acceptance is local; published npm/hosted registry acceptance remains gated. Disposable consumers and all initial failures/corrected harness runs are retained.

## 24. CLI fixtures

**PASS `pnpm cli:fixtures`**, including incremental/reverse/partial families, shared style closure, source/theme preservation, recovery, overwrite/update/interactive replacement and nonzero write failure. **PASS `pnpm cli:onboarding`: 54/54**. New tests include framework/lockfile/manager detection, workspace variants, one/multiple/invalid/root targeting, 16 scaffolder command combinations, name/destination/cancel/failure handling, successful init follow-up, four built-CLI monorepo fixtures, Yarn Classic rejection and strict compiler policy. These deterministic installation fixtures stub the package executables; section 23 uses real package managers.

## 25. Registry integrity

Official `pnpm build:all` and `pnpm registry:check` pass: **54 installables, 119 embedded source/style occurrences, three byte-identical distributions**. No generated output was hand-edited or changed. Packed tarball contains LICENSE and all registry JSONs; remote-first implementation remains unchanged. Test-only preload forces local fallback for reproducible consumer source.

## 26. Component regressions

**33 production checks**: all requested families render in light/dark, plus Select commit, protected 245 × 272.5 Date popup/28px days, Date reduced motion, protected 252px Time popup and Toast create/close. Website planner exercises real shared controls and Dialog focus return. Six separate packed Grid runtime checks pass. **264 protected tracked paths byte-identical** to HEAD; all generated/source parity checks pass. These are focused smokes, not a replay of every historical behavior case.

## 27. Routes/anchors/SEO

**119/119 local production endpoints pass**, including all 54 docs/registry entries, sitemap, robots, RSS, AI export and guides. All baseline stable IDs and canonical/description/OpenGraph/Twitter metadata preserved; new installation guide anchors are additive. Homepage structured data and FAQ retained. Markdown/registry URLs remain canonical. No public-host/deployment proof is claimed.

## 28. TypeScript

PASS website `tsc --noEmit`, CLI `tsc --noEmit`, website build check, four real scaffold consumers (Router via route typegen), packed Grid consumer and real monorepos. New-app strict checking is retained; the registry contract does not enable noUnusedLocals/noUnusedParameters. A focused automated test ensures strict remains true even when those upstream lint flags are disabled. Existing project compiler configs are not changed.

## 29. Lint

PASS `pnpm lint`: zero errors and the one pre-existing protected `react-hooks/exhaustive-deps` warning at `data-grid-table-virtual.tsx:368`. No warning-free claim. All new website errors found during development were fixed.

## 30. Builds

PASS network-enabled `CI=true pnpm install --frozen-lockfile`, theme check, eight theme fixture families, build:all, registry check, CLI build/declarations, full old/new CLI fixtures and Next **16.1.7** production build (60 static generated pages plus dynamic routes). Lockfile SHA-256 unchanged: `258edea91e371e54449b9b316270d6d7a9c47911f8e8f1942c381a92c4e8c5ef`. Sandbox-only install could not resolve npm; the required frozen install completed with network access.

## 31. Screenshots/evidence

Evidence root: `/private/tmp/baseui-landing-onboarding/`.

- `before/home-{1440,1280,1024,768,390,320}-{light,dark}.png`: fresh baseline captures before edits.
- `after/home-*`: matching final captures; all eight required views and 1280/1024 manually inspected.
- `before/full-*`, `after/full-*`: full-page 1440/390 light/dark.
- `after/builder-{390,320}-{light,dark}.png`: complete mobile setup surfaces, manually inspected.
- `after/home-showcase-section-dark.png`, `theme-exhibit-dark.png`, `home-blocks-section-dark.png`: composed sections manually inspected.
- `after/browser-results.json`: 45 passing checks; `component-results.json`: 33; `a11y-light.json`/`a11y-dark.json`: zero violations.
- `checks/`: frozen install, types/lint/theme/generation/registry/CLI/build/browser/route logs and protected hashes.
- `scaffolds/`: actual official apps, exact framework logs and real monorepo evidence.
- `package/`: actual tarball, pack/install/create/results and six runtime checks/screenshots.

Final tarball: **60 files / 195,487 compressed bytes**, SHA-256 `1304ffc9994a6e4441e8fe6d03411ab076be97a2a39501e34b8c183d66dd60c8`. No fixture/temp/module/private payloads included. This local test artifact is not an approved RC or publication.

## 32. Known limitations

Yarn/Bun live installs are untested; their commands and detection/workspace behavior have deterministic coverage only. Upstream latest scaffolders can change and have their own Node/network constraints. Custom existing apps need Tailwind v4/alias integration. Complex workspace glob dialects, symlink targets, shared UI generation and automatic custom-app discovery outside common layouts are not supported. New-app unused-symbol policy is explicit above. Chromium emulation covers neither physical devices/Safari nor screen-reader certification. Axe leaves the existing shortcut glyph for manual contrast review. No deployment/published acceptance occurred.

The optional next-dev-loop skill requires Next 16.3+ while this repo pins 16.1.7. It was not applied; no Next upgrade was made. Production Next/Chromium checks supplied runtime evidence. Host model/session configuration was not changed.

## 33. Release/version impact

**1.4.0 retained; release intentionally paused.** Changelog marks this as Unreleased and includes framework-aware setup, first-class Start/Next/Router/Vite support, new create and workspace-aware initialization. Updated audit explicitly supersedes the old RC's ready status. Requires visual approval, onboarding acceptance, audit review and a newly approved checkpoint before any release work. Hosted complete-byte/version alignment remains a later gate. Everything stays uncommitted.

## 34. Files changed

Authored website: `app/page.tsx`, `app/docs/installation/page.tsx`, `components/shared/home-showcase.tsx`, new `setup-builder.tsx`, new `home-theme-preview.tsx`, new `lib/setup-command.ts`, `lib/changelog.ts`, new `styles/landing.css` (under `apps/www/`).

CLI: `src/index.ts`, `src/commands/init.ts`, new `src/commands/create.ts`, new `src/utils/project.ts`, `src/utils/package-manager.ts`, `src/utils/style-file.ts`, and README (under `packages/cli/`).

Root: package.json adds `cli:onboarding`; new `scripts/check-cli-onboarding.mjs`; release audit updated; this report added. No lockfile, workflow, approved component source, theme output, registry, Markdown export or template changes.

## 35. git diff --check

PASS. Final exact status/paths and protected integrity are recorded under `checks/`. No files staged.

## 36. Git status and stop gate

Branch remains `feature/design-system-v2`; HEAD remains `761f948ba3e913164bd0c88e89f79926ffe08779`. **19 authored paths changed, all uncommitted; zero staged paths.** Final porcelain inventory is retained at `checks/final-status.txt`.

**STOPPED FOR VISUAL/PRODUCT REVIEW.** No commit, merge, deploy, tag, publish, push or template work. The baseline release candidate is intentionally superseded and 1.4.0 remains paused.

---

# Final theme color and radius polish — latest review snapshot

October 22, 2026. This refinement continues the existing uncommitted implementation. **Sections 37–46 describe the current candidate and supersede earlier default-theme, file-count and current-artifact statements. Sections 1–36 and their original evidence remain historical onboarding evidence.** Release version is still **1.4.0**, intentionally paused for visual/product approval and a new approved checkpoint.

## 37. Canonical color presets

The sole authored definition is `scripts/theme-definition.json`. Its presets contain **Iris, Blue, Violet, Emerald, Orange, Rose and Neutral**; generated website JSON and CLI TypeScript carry the same IDs, labels, defaults, light/dark colors and radius values. The website imports its own generated data; the packed CLI bundles its generated constants. Neither runtime depends on the other package.

Color selection changes only `--primary`, `--primary-foreground`, `--accent`, `--accent-foreground` and `--ring`. Graphite background/card/popover variables and semantic success/warning/info/destructive pairs remain independent and unchanged. The fresh public variable union remains **26**, with **zero public --cn-* variables**. Schema validation rejects identity keys outside those five; all preset modes are checked for missing/circular variable references.

## 38. Default Iris identity

Iris now supplies a restrained visible primary CTA, selected states, focus and small accents. Default light primary is defined once in the canonical preset, and dark primary uses its corresponding readable foreground. Neutral surfaces remain Graphite; there are no gradients, glows or saturated page backgrounds.

All seven presets have readable primary and selected-state foreground pairs. Final review also tested the shared Button's 90% primary hover state: Blue, Emerald and Orange light primaries were darkened to maintain contrast. The planner's count now uses full foreground opacity. These changes stay in preset data and landing composition; approved component source is unchanged.

## 39. Radius presets and new default

| ID | UI label | Public --radius |
| --- | --- | --- |
| sm | Sharp | 0.25rem |
| md | Medium | 0.5rem |
| **lg** | **Rounded — default** | **0.75rem** |
| xl | Extra | 1rem |

The generator now owns the website default as well as the consumer default. The old website 0.625rem override was removed. The website's existing `--control-radius` scale adapter now follows `--radius`; it no longer freezes controls at 6px. Landing panels/segmented controls derive their rectangular corners from that same variable. Existing V2 formulas carry radius into Button, Input, Select, surfaces, navigation and overlays. Circular swatches, switches, avatars and pills retain their deliberate geometry. Picker sizing, typography, unit scale and component anatomy remain unchanged.

## 40. CLI flags and interactive flow

Both commands support explicit `--color <preset>` and `--radius <preset>`:

```bash
pnpm dlx baseui-cn@latest create my-app --framework next --package-manager pnpm --color iris --radius lg
npx baseui-cn@latest init --color emerald --radius xl
npx baseui-cn@latest init --workspace apps/web --color blue --radius md
```

New interactive setup asks Theme color and Radius using canonical labels, with Iris/Rounded defaults. `create -y` resolves those defaults without questions. Fresh init also uses them unless chosen otherwise. Invalid preset IDs, including empty or prototype-property names, fail before theme mutation. Theme flags combined with disabled CSS initialization fail truthfully rather than pretending the values were applied.

The command-generation model includes both theme flags for new projects. Existing-project commands omit them until an explicit color/radius choice. Preserve existing theme clears those explicit requests; switching back to new-project mode still uses the current live preview values. Copy writes the exact supported single-line shell command, regardless of visual wrapping.

## 41. Existing-theme preservation

Init detects color/radius declarations in the chosen stylesheet. Interactive existing themes offer **Keep existing color values / Keep existing radius** first. Noninteractive init without theme flags preserves customized values, even when no baseui config existed before. No Commander defaults silently turn omitted init flags into a theme replacement.

An explicit color choice updates the five requested identity variables in root/dark declarations; an explicit radius choice updates radius only. Repeated/grouped/layered declarations, comments, strings, unrelated selectors, semantic overrides and surviving source remain protected. Existing !important priority is retained for intentionally replaced values. Missing variables still receive the established additive recovery behavior. Repeated init, including repeated explicit choices, is byte-idempotent for theme CSS.

No color/radius metadata can drift from locally edited CSS: the ordinary generic variables in the user's stylesheet are the actual configuration.

## 42. Visual before/after and live preview

The accepted landing structure remains intact. New compact swatches and radius choices fit between package manager and project name. The desktop hero stays balanced; the full first-screen setup and framework strip remain contained at 1440px. Softer theme-derived corners replace rigid repeated boundaries, with restrained Iris primary identity.

Selection updates the homepage, header, real install planner and theming exhibit. Temporary body attributes include Base UI's portalled Select/Dialog/Toast surfaces in the preview. Cleanup restores prior attributes on client navigation; no color/radius is stored in localStorage. Light/dark remains an independent site preference. The theming exhibit shows actual selected light/dark CSS values and the selected radius, rather than a second palette definition.

Fresh baseline source/screenshot evidence for the original 19-path state is preserved under `/private/tmp/baseui-theme-polish/before/`, including hashes and a complete worktree diff. Original `/private/tmp/baseui-landing-onboarding/` evidence is untouched.

## 43. Responsive, non-default and accessibility QA

New default captures cover **1440, 768, 390 and 320px, light and dark**, with additional 1280/1024 captures. Final captures use the actual site theme toggle, wait for hydration, and record rendered mode/font/preset state in `after/capture-state.json`; this avoids a manual-class screenshot harness race. All eight required views were manually inspected. Complete mobile setup-builder captures were also inspected to verify all swatches/radius choices, the wrapped command and Copy. No horizontal document overflow occurs. An additional 24-case layout matrix verifies the actual Inter font, real light/dark toggle and both Iris/Rounded and Emerald/Extra at all six widths (`after/actual-font-layout.json`).

**Emerald + Extra** is captured in light/dark at 1440/390/320px, including full builders, and manually inspected. Its six-width/two-mode browser matrix passes. The same shared components and token relationships respond in each mode.

Swatches have explicit accessible names, native title labels, visible selected check/border and keyboard activation; radius buttons expose pressed state. Keyboard selection, focus return, reduced-motion emulation and clipboard feedback pass. Final settled-theme axe audits cover Iris and Emerald, light/dark: **zero violations**. The existing shortcut glyph and, in some runs, the single-digit planner count remain automated contrast incompletes; direct token contrast assertions and visual inspection cover the actual colors. This is not screen-reader/physical-device certification.

## 44. Tests, real flows and final validation

| Check | Result |
| --- | --- |
| New/old onboarding tests | **59/59 PASS**. Includes real prompt injection, default/explicit/preserve choices, invalid flags and exact commands across **448 new + 448 existing** framework/manager/color/radius combinations. |
| Theme fixtures | Original eight preservation families **PASS**; all **28 color/radius** generated-CSS combinations **PASS**, both modes, 26-variable union, no public --cn-*, semantic/neutral preservation, explicit replacement boundaries and repeated-init idempotence. |
| Contrast | Every primary/accent text pair meets **4.5:1**; every focus ring meets **3:1** against its base background; all **14 preset/mode shared primary hover states meet 4.5:1**. |
| Live theme QA | **40 PASS**: every color/mode, actual radii on controls/panel, portalled Select/Dialog, actual CSS exhibit values, exact clipboard command, preservation/mode switching, keyboard, non-default responsive matrix, route cleanup and reduced motion. |
| Existing browser/component QA | **45 homepage checks + 33 component smokes PASS**. Picker dimensions remain protected; all requested component families render in both modes. |
| Fresh Next.js | Real official scaffold with default Iris/Rounded; components installed; standalone strict TypeScript and production build **PASS**. |
| Fresh TanStack Start | Real official scaffold with explicit Emerald/Extra; components installed; standalone strict TypeScript and production build **PASS**. Final canonical color values rechecked through explicit init and rebuild. |
| Monorepo | Real pnpm/Vite create with Blue/Medium under apps/web; explicit workspace init, correct dependency/config/CSS placement, root safety and strict build **PASS**. |
| Existing/customized consumers | All three real consumers preserve customized source/theme without flags; explicit re-theming changes requested values, preserves semantic override/source, and repeats without CSS changes. **PASS**. |
| Packed CLI | Actual local tarball installed outside the repo, version/help/LICENSE checked; installed CLI creates a new Rose/Sharp Vite app, installs components, and passes strict TypeScript/production build. Installed dist matches the working build. **PASS**. |
| Full regressions | Theme generation/check, official build:all, three registry distributions, existing complete CLI fixtures, CLI/website TypeScript, lint and final Next production build **PASS**. Lint retains the one existing protected Grid warning. |
| Routes and SEO | **119/119** local production endpoints; baseline anchors and canonical/description/OpenGraph/Twitter metadata retained. Additive theming/install anchors only; registry bytes equal generated output. |
| Integrity | **260 selected protected component/style/registry/license/lock paths unchanged** from HEAD. Only the three intended theme outputs are regenerated. All original 19 work paths retained. |

Current tarball: `/private/tmp/baseui-theme-polish/package/baseui-cn-1.4.0.tgz`, **60 files / 198,086 compressed bytes**, SHA-256 **`4ec6e392cdcf587ae8fb866b6532ee28aaf1e2f237fbd090d9d74e92d6ccacbd`**. This is a disposable test artifact, not a published or approved RC.

## 45. Release impact

Version remains **1.4.0**. These are additive configuration/onboarding capabilities in the unpublished candidate. Changelog and release audit include selectable color/radius, Iris/Rounded defaults, live preview and preservation guarantees. No new public component API or proprietary theme variable is introduced.

**Release remains PAUSED.** Homepage visual approval, onboarding acceptance, updated audit review and a new approved checkpoint are still required. Later hosted registry version/complete-byte alignment gates remain. No commit, merge, push, deploy, tag, publish or template work occurred. Earlier Yarn/Bun live-install and platform limitations remain; this refinement does not claim new live coverage for them.

## 46. Final files, evidence and review gate

The cumulative uncommitted change set is **31 paths**, with **zero staged files**. Branch remains `feature/design-system-v2`; HEAD remains `761f948ba3e913164bd0c88e89f79926ffe08779`. `git diff --check` passes.

Additional refinement paths beyond the retained 19 are: theming guide; globals; three generated theme outputs; canonical theme definition; theme generator; theme fixtures; CLI theme-options and ensure-styles helpers; homepage theme provider; and website preset helper. Existing setup/init/create/command model/tests/docs were extended in place. No approved component family source or registry bytes changed.

Evidence root: `/private/tmp/baseui-theme-polish/`. `checks/` contains final logs, status and integrity; `consumers/` contains actual scaffold/build/preservation proof; `package/` contains final packed acceptance and earlier package iteration evidence. `before/` retains the prior implementation; `after/` contains the complete new visual matrix, accessibility JSON, 40 theme assertions, 45 homepage checks and 33 component checks.

Visual approval entry points:

- [Iris / Rounded — 1440 light](/private/tmp/baseui-theme-polish/after/home-1440-light.png)
- [Iris / Rounded — 1440 dark](/private/tmp/baseui-theme-polish/after/home-1440-dark.png)
- [Emerald / Extra — 1440 light](/private/tmp/baseui-theme-polish/after/emerald-extra-1440-light.png)
- [Emerald / Extra — 1440 dark](/private/tmp/baseui-theme-polish/after/emerald-extra-1440-dark.png)
- [Complete 320px builder — light](/private/tmp/baseui-theme-polish/after/builder-320-light.png)
- [Complete 320px builder — dark](/private/tmp/baseui-theme-polish/after/builder-320-dark.png)

**STOPPED FOR FINAL VISUAL/PRODUCT REVIEW. Everything remains uncommitted.**

---

# Final hero and setup Drawer refinement — October 23, 2026

**Latest presentation review: sections 47–54 supersede earlier inline-builder and whole-page theme-preview descriptions. All prior implementation and evidence above are retained. CLI capabilities, canonical presets, command generation and release gates remain unchanged.**

## 47. Why the inline builder changed

The configuration-heavy hero made framework/package/theme decisions compete with the product message. Setup is now an intentional next step after the developer understands baseui-cn. The previous 31-path implementation and screenshots were preserved at `/private/tmp/baseui-hero-drawer/before/`, including source copies, hashes, status and a binary worktree diff. No approved capability was discarded.

## 48. New hero architecture and page flow

The hero is a focused, centered composition: Base UI/copy-and-own eyebrow, a deliberate two-line desktop headline, supporting React/Base UI/Tailwind CSS/accessibility/local-source copy, **Create your project** and **Browse components**. A quiet noninteractive framework row follows the actions. There is no inline configuration on desktop or mobile.

The primary action opens actual setup; the secondary keeps its canonical component-docs URL. The final CTA uses the same setup Drawer. Iris is limited to the primary action, small identity marker, focus and useful selected states. Graphite surfaces and Rounded brand geometry remain.

Page flow is hero/support → working release workspace → install/framework story → own the source → theme customization → component catalog → Why Base UI → existing blocks → compact changelog/editor resources → final CTA/footer. Existing FAQ answers remain in compact native disclosures alongside the source story, preserving structured-data content. The desktop full page is approximately **6,560px**, down from **7,398px** in the preceding presentation; the stronger hero occupies about 590px including the header rather than a full configuration screen.

## 49. Right Drawer setup experience

Uses the unchanged real V2 `Drawer`, with native Trigger/Content/Title/Description/Close and rightward swipe direction. Desktop width is **500px**; mobile is full width. No custom modal/focus/gesture engine was introduced.

Groups: **Configuration** (framework/project/structure/manager), **Appearance** (seven named swatches/four radii and preview), and **Your project / Workspace** only when relevant. All approved choices remain: Next.js, first-class TanStack Start, React Router, Vite, Existing React; new/existing; single/monorepo; npm/pnpm/Yarn/Bun; seven colors; four radius presets; Iris/Rounded defaults.

The configuration region scrolls independently. The generated command and **Copy command / Done** actions sit outside that scrolling region and stay visible at the bottom. Follow-up commands remain available. Invalid input suppresses copying; existing-project choices preserve custom themes unless explicitly requested. No fake Run action was added. The central command-generation model and all CLI source are byte-identical to the preceding approved capabilities.

## 50. Theme-preview behavior

Selections no longer set body attributes or recolor the marketing page, header, application showcase or main theming section. The provider now retains only local draft state. Marketing stays Iris/Rounded, with its independent persisted light/dark preference.

A compact **real Input + Button + Badge** preview inside the Drawer receives the chosen canonical color/radius values through scoped CSS variables. Its local light/dark toggle does not change the site mode. **Copy theme CSS** copies the actual generic light/dark identity variables and radius. The selected values also update the supported CLI command. Closing/reopening retains the local setup draft; nothing is written to color/radius browser storage or to the user's project.

The main theming exhibit demonstrates the site's default Iris/Rounded identity and remains independent from setup selections. Core preset definitions, generated theme outputs, theme tests and customization-preservation logic were not changed.

## 51. Working application showcase

The former install-inventory presentation is replaced by a cohesive **release workspace**. Useful local sample tasks combine real V2 Table, Input, Select, Tabs, Checkbox, Switch, Badge, Avatar, Progress, Date Picker, Dialog and Toast. The sidebar, summary and table form one application surface with restrained borders and Graphite/Iris hierarchy.

Every interaction has an outcome: search/owner/status filters alter rows; completion changes readiness and status; New task creates a local work item; details read/edit shared task state; Date Picker updates the target; reset restores the sample. Toasts announce actual changes. The example explicitly says changes stay in this page. No backend persistence, marketplace, fake external metrics, nonfunctional product settings or copied framework templates are implied.

## 52. Responsive screenshots and manual visual review

Closed/open states captured at **1440, 1280, 1024, 768, 390 and 320px**, light/dark. The capture harness uses the site's real mode toggle, preserves Inter, verifies the rendered mode and checks closed-page document width. All requested hero/Drawer/showcase views and representative additional widths were manually inspected.

Required approval captures:

| View | Light | Dark |
| --- | --- | --- |
| Hero, 1440 | [Light](/private/tmp/baseui-hero-drawer/after/hero-1440-light.png) | [Dark](/private/tmp/baseui-hero-drawer/after/hero-1440-dark.png) |
| Drawer, 1440 | [Light](/private/tmp/baseui-hero-drawer/after/drawer-1440-light.png) | [Dark](/private/tmp/baseui-hero-drawer/after/drawer-1440-dark.png) |
| Hero, 390 | [Light](/private/tmp/baseui-hero-drawer/after/hero-390-light.png) | [Dark](/private/tmp/baseui-hero-drawer/after/hero-390-dark.png) |
| Drawer, 390 | [Light](/private/tmp/baseui-hero-drawer/after/drawer-390-light.png) | [Dark](/private/tmp/baseui-hero-drawer/after/drawer-390-dark.png) |
| Application showcase | [Light](/private/tmp/baseui-hero-drawer/after/showcase-light.png) | [Dark](/private/tmp/baseui-hero-drawer/after/showcase-dark.png) |

Additional `hero-*`/`drawer-*` files cover the complete six-width matrix; `drawer-emerald-*` demonstrates scoped Emerald/Extra preview. Full-page desktop/mobile captures retain the complete story. The closed mobile hero contains no setup controls. Commands wrap within the Drawer, and Copy remains reachable while the configuration scrolls.

## 53. Accessibility and validation

**43 focused production-browser assertions PASS**, including all 16 framework/manager selections, scoped color/radius and light/dark preview, exact command/CSS copying, existing-workspace preservation, generic React restrictions, validation, nested Select dismissal, 40 successive trapped Tab moves, Escape and focus return to both native triggers, six-width footer/overflow checks, actual workspace search/filter/create/complete/detail/date operations, reduced motion and zero runtime page errors.

Touch-emulated Chromium scrolling moves the 390 × 844 configuration from scrollTop **0 to 282px** while the command footer stays stationary and visible. This tests actual touch events, not only programmatic scroll assignment.

Six axe runs cover closed page, default Drawer and Emerald/Extra Drawer in light/dark: **zero violations**. Native Base UI inert background/focus guards and contrast glyph/overlap items remain automated incompletes; they were reviewed against the successful keyboard trap/focus tests and visual captures. No physical mobile, Safari/WebKit or screen-reader certification is claimed.

Other results:

- Website TypeScript, lint and production build **PASS**. Lint retains the one existing protected Data Grid exhaustive-deps warning.
- Existing onboarding tests **59/59 PASS**. Nineteen approved CLI/preset/generator/test/model paths are byte-identical to the preceding work. Expensive real scaffolds were not rerun because their implementation did not change; earlier acceptance evidence is retained.
- **119/119** production endpoint/registry checks **PASS**, with exact baseline canonical/description/OpenGraph/Twitter metadata and docs anchors. Homepage `framework-label` and `setup-project` are intentionally emitted only after the Drawer opens; they are internal form labels, not removed public docs destinations. The updated comparison records those two deliberate moves and no unexpected removals.
- Approved V2 component-family source/styles, registry bytes, lockfile, CLI version and license remain unchanged. No new dependencies or public URLs.
- `git diff --check` **PASS**; zero staged files.

Evidence root: `/private/tmp/baseui-hero-drawer/`. `after/qa-results.json`, `touch-results.json`, `capture-results.json`, `a11y-*.json`, `checks/`, the route comparison and integrity/status inventories retain individual results and source authority. All earlier evidence directories remain untouched.

## 54. Historical visual disposition and stop gate — before user approval

Manual review finds the closed hero substantially clearer and stronger: it introduces the product and ownership benefit before asking for configuration. Setup now follows an intentional CTA, and the application composition provides useful visual proof immediately below it. Final visual/product approval remains the user's decision.

Today's presentation scope: homepage composition, setup UI, theme provider/exhibit behavior, application showcase, landing CSS, website CopyButton labels/variants and this report/audit. All original 31 work paths remain; the cumulative uncommitted change set is **32 paths**, with **zero staged files**. Branch remains `feature/design-system-v2`; HEAD remains exactly `761f948ba3e913164bd0c88e89f79926ffe08779`.

**1.4.0 remains PAUSED. STOPPED FOR VISUAL APPROVAL.** No commit, merge, deploy, tag, publish, push or template work occurred. Approved CLI capabilities are intact, and the later release/checkpoint/hosted-byte gates remain in force.


## 55. Approved implementation checkpoint — October 23, 2026

The user has approved the final landing, setup Drawer, theme/radius configuration and onboarding capabilities, and authorized one checkpoint commit: `feat: add framework-aware onboarding experience`. The commit containing this section is the approved implementation baseline for the next release candidate. Its parent is `761f948ba3e913164bd0c88e89f79926ffe08779` on `feature/design-system-v2`; that previous RC is superseded. No design or implementation changes were made during this checkpoint; only this report and the release audit were updated to record approval and fresh checks.

### Final approved product state

- Focused hero retains “Accessible React components. Own the source. Build your system.” Primary action is **Create your project**, secondary **Browse components**. The framework support row is quiet, noninteractive text.
- Setup configuration exists only inside the real V2 right Drawer, including its reachable command footer. There is no fake Run action. Marketing stays **Iris + Rounded**; alternate color/radius/light/dark preview remains scoped to the compact Drawer preview. The application showcase uses real baseui-cn components with working local interactions.
- Next.js, first-class TanStack Start, React Router, Vite and existing/custom React support remain unchanged. Custom React uses existing-project init; the four supported frameworks have official new-project adapters. Single-app/monorepo, npm/pnpm/Yarn/Bun command generation, seven colors and four radii remain intact. Existing customized themes are preserved unless explicitly changed.
- Defaults remain **Iris / lg (Rounded, 0.75rem)**. The theme contract remains **26 generic public variables**, **zero public `--cn-*` variables**. Semantic status colors and Graphite surfaces remain independent of identity presets.
- **Base UI 1.9.0**, **CLI 1.4.0** and Data Grid's **`@tanstack/react-table@^8.21.3`** constraint are unchanged. No framework templates or template work were added.

### Fresh checkpoint checks

| Check | Result |
| --- | --- |
| Website TypeScript | PASS — `pnpm --filter @baseui-cn/www exec tsc --noEmit`, after production build |
| CLI TypeScript | PASS — `pnpm --filter baseui-cn exec tsc --noEmit` |
| Lint | PASS — zero errors; only the accepted existing Data Grid exhaustive-deps warning |
| Theme | PASS — `pnpm theme:check`, all three generated outputs match the canonical source |
| Registry | PASS — `pnpm registry:check`, 54 installables, 119 source occurrences, three byte-identical distributions |
| CLI onboarding | PASS — `pnpm cli:onboarding`, **59/59 tests**, including customized-theme preservation, explicit updates and idempotence |
| Production build | PASS — `pnpm --filter @baseui-cn/www build`, Next.js 16.1.7 |
| Production endpoints | PASS — **119/119**; exact local served registry bytes, baseline SEO metadata and docs anchors; only the two previously approved homepage form IDs reside inside the closed Drawer |
| Whitespace | PASS — `git diff --check`; staged diff also checked before commit |
| Scope/integrity | Exact **32 approved paths**; all 30 implementation/configuration paths unchanged during this checkpoint. Nineteen onboarding/preset/generator/test/model paths match the preceding approved capabilities. 234 selected component/style/registry/license/lock paths match parent HEAD. |

No implementation drift was detected. Expensive real framework scaffolds were not rerun; the real-consumer results and Yarn/Bun limitations in sections 11–23 and 43–46 remain the applicable evidence. Approved screenshots, keyboard/focus/accessibility and responsive review in sections 47–54 remain applicable because their implementation is unchanged.

Fresh logs, exact path/hash manifests, final scope review and route comparison are retained under `/private/tmp/baseui-final-checkpoint/`. Post-commit SHA, parent, committed-path and clean-tree results are recorded there and returned with the checkpoint. The commit does not contain its own SHA to avoid a self-referential hash or a follow-up dirty report edit.

### Files in this checkpoint

The complete cumulative approved scope is these 32 paths:

- `apps/www/app/docs/installation/page.tsx`
- `apps/www/app/docs/theming/page.tsx`
- `apps/www/app/page.tsx`
- `apps/www/components/shared/copy-button.tsx`
- `apps/www/components/shared/home-showcase.tsx`
- `apps/www/components/shared/home-theme-preview.tsx`
- `apps/www/components/shared/home-theme-provider.tsx`
- `apps/www/components/shared/setup-builder.tsx`
- `apps/www/lib/__generated__/theme.json`
- `apps/www/lib/changelog.ts`
- `apps/www/lib/setup-command.ts`
- `apps/www/lib/theme-presets.ts`
- `apps/www/styles/globals.css`
- `apps/www/styles/landing.css`
- `apps/www/styles/theme.generated.css`
- `docs/design-system-v2-release-audit.md`
- `docs/landing-cli-onboarding-report.md`
- `package.json`
- `packages/cli/README.md`
- `packages/cli/src/commands/create.ts`
- `packages/cli/src/commands/init.ts`
- `packages/cli/src/index.ts`
- `packages/cli/src/utils/ensure-styles.ts`
- `packages/cli/src/utils/package-manager.ts`
- `packages/cli/src/utils/project.ts`
- `packages/cli/src/utils/style-file.ts`
- `packages/cli/src/utils/theme-options.ts`
- `packages/cli/src/utils/theme.generated.ts`
- `scripts/build-theme.mjs`
- `scripts/check-cli-onboarding.mjs`
- `scripts/check-theme-fixtures.mjs`
- `scripts/theme-definition.json`

### Release disposition

Visual/product approval is complete and this checkpoint is the approved implementation baseline. **This is not release authorization.** CLI remains **1.4.0**, unpublished. A new RC validation/approval and hosted-registry **version plus complete-byte alignment** are still required. The previous RC and historical tarballs do not authorize publication of this implementation. No merge, deploy, publish, tag, push or template work was performed. Stop after the single checkpoint commit.
