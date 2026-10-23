# Base UI v1.9.0 compatibility audit

Audit date: October 19, 2026. Branch: `main`. Starting commit: `a71163f2be2ad2523b41175dbd2e9cbb23726c9e`.

## Scope and outcome

The docs workspace moves from resolved `@base-ui/react@1.6.0` (manifest `^1.6.0`) to an exact `1.9.0` pin. Registry `baseUIVersion` metadata also records `1.9.0`. No component implementation, example, public export, CSS selector, token, or stylesheet was changed. No wrapper compatibility patch was required by TypeScript or the exercised browser flows. CLI version remains `1.3.3`; private workspace versions remain `0.1.0`. No release, commit, push, merge, publication, or deployment is part of this audit.

## Repository baseline

- Clean working tree on `main` before changes; Node `22.22.3`, pnpm `9.0.0`, `pnpm-lock.yaml` only.
- Four workspace projects: root, docs (`apps/www`), CLI (`packages/cli`), and registry (`packages/registry`). Only `apps/www/package.json` declares Base UI.
- Direct runtime imports occur in 42 UI component files and `components/data-grid/data-grid-scroll-area.tsx`. Additional references occur in documentation, registry metadata, generated entries, and CLI installation strings. Date Picker and Time Picker use local wrappers rather than direct Base UI imports.
- Official generation: `pnpm build:all` runs registry, preview-source, and docs-markdown generators. `pnpm registry:build` regenerates the registry alone. Sources are owned by `apps/www/components`, `apps/www/styles`, and `scripts/registry-meta.mjs`.
- Changelog convention: typed entries in `apps/www/lib/changelog.ts`, consumed by the existing changelog page and RSS feed. No package version bump is required by this workflow.
- No test files, test runner, test script, dedicated docs validator, registry checksum command, or typecheck script exists. The CONTRIBUTING guide's `type-check` command is unavailable; actual installed `tsc --noEmit` was used for both TypeScript projects.

## Official release review and impact map

Read the official [v1.7.0](https://base-ui.com/react/overview/releases/v1-7-0), [v1.8.0](https://base-ui.com/react/overview/releases/v1-8-0), and [v1.9.0](https://base-ui.com/react/overview/releases/v1-9-0) notes before upgrading. Risk below describes the review priority, not a discovered regression.

| baseui-cn component or consumer | Base UI layer | Relevant upstream area across 1.7–1.9 | Review result / risk |
| --- | --- | --- | --- |
| Accordion | Accordion | Direction inheritance, trigger attributes, native disabling | No selectors depend on implicit `dir` or trigger index/value; low |
| Alert Dialog, Dialog | AlertDialog, Dialog | Focus/trigger association, outside press, nesting and scroll lock | Existing portal and `render` composition retained; high |
| Drawer; drawer form/select/toast examples | Drawer | Swipe velocity, dismissal, virtual keyboard and scrolling | Root/Popup props pass through; no local snap-point or SwipeArea usage; high, native-device coverage remains limited |
| Select | Select | Disabled inheritance, Safari highlight, retained-popup lifecycle, list mounting | No local `actionsRef` retention or event-reason assumptions; high |
| Combobox | Combobox | Filtering, highlight, async results, list registration and mounting | Existing item arrays, controlled query and multiple selection wrappers retained; high |
| Autocomplete | Autocomplete | Locale filtering, readonly browsing, async highlight, callback event details | No `onItemHighlighted` consumers or manual retention; high |
| Command; documentation search | Autocomplete + Dialog | Inline collection/focus behavior and popup lifecycle | Existing filtering, inline open state, reset keys and dialog handle retained; high |
| Dropdown Menu, Menubar | Menu, Menubar | Submenu focus, accessibility tree, item registration and trigger performance | Existing normal menu composition retained; preview filtering absent; high |
| Context Menu | None | Checked for direct imports, wrappers, examples and registry entries | Not present; no new component added |
| Navigation Menu | NavigationMenu | Trigger focus, disabled state, pointer/positioner behavior | Existing Root/List/Content/Portal/Positioner/Viewport retained; medium |
| Scroll Area, Data Grid scroll area | ScrollArea | Thumb dragging, overscroll, focus and viewport role | No dependence on presentational viewport role; Data Grid's separate vertical scrollbar retained; high |
| Popover, Preview Card, Tooltip | Popover, PreviewCard, Tooltip | Trigger mounting, focus guards, positioning and retained transitions | Existing portals, offsets, available-size variables and render composition retained; high |
| Avatar | Avatar | Fallback timing, optional Image mounting | Image/Fallback props still pass through; no forced `keepMounted`; medium |
| Toast | Toast | Timers, render content, promise/update behavior | Manager passthrough and existing promise/object patterns retained; medium |
| Field, Fieldset, Form, Input, Textarea | Field, Fieldset, Form, Input | Validation ownership, controlled field state, IDs, labels and invalid focus | Existing props and required/disabled behavior delegated to primitives; high |
| Checkbox, Checkbox Group, Radio Group, Switch | Checkbox, CheckboxGroup, Radio, RadioGroup, Switch | Native submission, hidden-input click handling, labels, refs and validation | No custom form serialization or replacement event handlers introduced; medium |
| Number Field | NumberField | Editing, press-and-hold, input selection and scrub clicks | Existing controls and ID context retained; medium |
| Slider | Slider | Ref stability, drag cancellation, touch commit and single-value arrays | Wrapper's existing array/scalar handling and thumb count retained; high |
| Tabs | Tabs | Indicator positioning, refs and function-valued selection | Existing indicator variables and variants retained; medium |
| Date Picker / Date Range Picker | Popover, Field, Input, Button via wrappers; DayPicker calendar | Popup focus/positioning and form integration | Calendar, caption geometry, range logic, navigation, focus rings and stylesheet untouched; high |
| Time Picker | Popover, Dialog, Field, Input, Button via wrappers | Modal scroll lock, dismissal/focus and forms | Draft/commit/cancel, clock pointer logic and mobile Dialog stylesheet untouched; high |
| Collapsible, Progress, OTP Field | Corresponding primitives | Disabled/hidden panels, progress semantics, IME and focus | No incompatible local assumptions found; medium |
| Toggle, Toggle Group, Separator | Corresponding primitives | Shared bundle/store and interaction fixes | Existing wrappers retained; low |
| Button, Badge, Breadcrumb, Card, Item, Label, Pagination | `mergeProps`, `useRender` | Render-element typing, lazy prop/ref merging | Existing source typechecks without casts or API edits; medium |

Shared review also covered popup origin/collision sizing, portal ownership, keyboard and pointer handlers, DOM roles, data attributes, validation/required/disabled semantics, and published types. No deprecated API in the reviewed notes required migration of existing source.

### Intentionally not adopted

- No `Menu.FilterProvider`, `Menu.Input`, menu filtering example, or new menu filtering export. The v1.9 preview remains untouched.
- No migration to Combobox `createItems`; existing collections work without changing their contract.
- No forced Avatar `keepMounted`, functional Toast update rewrite, new Drawer gesture API, or speculative abstraction.
- v1.9 Select/Combobox/Autocomplete no longer use the presence of `actionsRef` to retain closed popups. There are no such consumers here, so no `preventUnmountOnClose()` patch was needed. Consumers using the forwarded upstream props should follow the official release guidance.
- No consumers depend on the changed highlight callback event types/reasons. No new type exports were needed.

## Changes and registry consistency

Hand-edited files are `apps/www/package.json`, both registry generation modules, `README.md`, `CONTRIBUTING.md`, root/public `llms.txt`, the typed changelog, and this report. pnpm owns the lockfile changes. The official generator owns all 162 component registry JSON copies and `packages/registry/index.json`.

The lockfile changes are confined to Base UI and its dependency tree: `@base-ui/utils`, Babel runtime, Floating UI packages, `reselect`, and `use-sync-external-store`. Other direct dependencies and workspace importers are unchanged. These transitive changes satisfy the new upstream dependency requirements.

`pnpm build:all` regenerated 54 registry entries in each of:

- `apps/www/public/registry/`
- `packages/registry/registry/`
- `packages/cli/registry/`

An independent audit script compared every entry with `buildEntry()` and every embedded file with its source, checked SHA-256 equality across the three copies, registry dependency closure (including the CLI's special `utils` handling), all indexes/catalog metadata, and all 54 generated markdown pages. All checks passed both before and after upgrading. Comparing generated JSON with HEAD confirmed the only entry change is `baseUIVersion`; all embedded source content is unchanged. Preview-source and docs-markdown regeneration introduced no changes.

The new dated changelog entry describes inherited upstream improvements and explicitly excludes preview Menu filtering. Existing routes and examples are preserved.

## Validation results

| Check | Baseline 1.6.0 | Upgrade 1.9.0 |
| --- | --- | --- |
| `pnpm install --frozen-lockfile` | Pass | Pass; final offline frozen install also passed |
| `pnpm --filter @baseui-cn/www exec tsc --noEmit` | Pass | Pass; also checked by production build |
| `pnpm --filter ./packages/cli exec tsc --noEmit` | Pass | Pass |
| `pnpm lint --force` | Pass, no lint warnings | Pass, no lint warnings |
| `pnpm build:all` | Pass, reproducible with clean diff | Pass: 54 entries, 307 preview sources, 54 markdown pages |
| Registry/source/checksum consistency | Pass | Pass |
| `pnpm exec turbo run build --force` | Pass, both tasks uncached | Pass, both tasks uncached; CLI JS/declarations and Next.js production build, 60 static pages |
| Tests | No existing test suite | Targeted browser assertions; no unit-test suite to run |
| `git diff --check` | Pass | Pass |

Initial sandbox-only install/build attempts encountered network/store/process restrictions. Authorized runs with package-store/network/local-process access completed successfully. No product code or Next.js dependency was changed to work around tooling.

All 54 component documentation routes, changelog, RSS, installation and registry index returned HTTP 200 from the local production preview (58 routes total). This supplements MDX compilation during the production build; it is not a dedicated docs-lint suite.

## Browser QA and limits

Interactive checks use isolated Chromium through `agent-browser 0.35.1` against the actual production build. Desktop viewport: 1440 × 1000; mobile dimensions: 390 × 844. This is browser automation, not physical-device acceptance.

Completed checks include Select keyboard selection/disabled semantics, Combobox filtering/selection/empty state, Autocomplete controlled filtering/selection/empty state, delayed async results in both Combobox and Autocomplete, Drawer open/focus/Escape/body-scroll restoration with a nested portalled Select, Menu keyboard submenu opening, Menubar and Navigation Menu opening, Popover opening/Escape, Tooltip hover content, Dialog focus containment/return, Alert Dialog cancel, Avatar fallback and successfully loaded images, Checkbox toggling, Radio arrow-key selection, Switch toggling and disabled controls, invalid/valid Form submission with first-invalid focus, Toast promise loading/result updates and explicit close-button dismissal, Slider keyboard and mouse dragging, and Scroll Area thumb dragging.

Date Picker's popup and year/month switchers were checked, including nested Escape behavior. Its day/year/month caption remained 24.5 CSS pixels high in the tested environment, matching the navigation buttons; all six visible captions, including range calendars, matched that height. A screenshot confirmed the retained caption presentation. Time Picker desktop Cancel preserved `09:30` after a draft hour change; OK confirmed the current draft. The explicit mobile TimePickerDialog was centered and bounded inside 390 × 844 (308 × 491.6875, left 41, top 176.15625), and Cancel closed it. The mobile screenshot was visually inspected.

Remaining limits and observations:

- Physical touch, iOS/Safari/WebKit overscroll, virtual keyboards, 120 Hz swipe velocity, screen readers, Shadow DOM and pinch zoom were not verified. No large-list performance benchmark was run. Swipe-to-open and snap points have no local example/implementation to exercise.
- Drawer content side styling and Root swipe-direction configuration remain independent as before; this upgrade does not add gesture styling or a new wrapper contract.
- pnpm reports the existing Fumadocs peer-range mismatch with Next.js 16.1.7 (`fumadocs-core@15.8.5`, `fumadocs-mdx@11.10.1`). These versions and constraints were present before the upgrade.
- The Toast promise demo randomly rejects and leaves the returned promise uncaught in unchanged example source; the browser recorded `Error: Request failed` on that path. The success path displayed `Done! / Data loaded successfully.`. This demo error is distinguished from a Base UI compatibility failure.
- Local preview logs include the expected Vercel Analytics script-unavailable message. No deployment or analytics activation was attempted.
- The optional `next-dev-loop` workflow requires Next.js 16.3+, while this repository uses 16.1.7. That workflow was not applied; validation used production builds and the independent browser workflow without an unrelated Next.js upgrade.

Audit logs, temporary verification scripts and QA screenshots are under `/private/tmp/baseui-190-audit/`. They are local evidence, not release artifacts.
