# Design System V2 — Phase 7 implementation report

Date: October 20, 2026. Status: implementation and validation complete. All changes remain uncommitted.

Dedicated worktree: `/private/tmp/baseui-cn-phase7`. Branch: `feature/design-system-v2-phase7`. Starting and final HEAD: `f73d65dbcc4c663342363bcf5fefbf0ccf2a86c9` (`feat: implement Design System V2 modal surfaces`). Before editing, the exact SHA, phase branch and empty porcelain status were verified. The primary checkout was not edited; no Phase 6 changes were imported. No commit, amend, merge, cherry-pick, push, release, deployment, dependency change or subsequent phase is included.

## Acceptance record

| Area | Result |
| --- | --- |
| Feedback | Alert uses neutral Card surfaces, semantic status icons and restrained status boundaries. Description/action placement works with and without media at narrow widths. Toast uses semantic success/warning/info/destructive colors, one neutral popup frame, restrained elevation, visible close controls, 2px keyboard outlines, bounded width and coarse targets. Existing manager, timeout, stacking and swipe formulas remain. |
| Progress / Skeleton / Spinner | Base UI owns determinate values, labelling and completion state. Progress transitions only width; indeterminate progress has a restrained indicator. Reduced motion stops progress, skeleton and spinner animation while preserving accessible status/value content. Spinner keeps its loading label. |
| Item | Retains polymorphic composition, exports, variants and size APIs. One solid 2px outline replaces the translucent ring; long content can shrink; neutral muted/hover presentation replaces compounded opacity. |
| ScrollArea | **Source and all three registry copies are byte-identical to the approved checkpoint.** Solid 2px inset viewport outline, no box-shadow, overflow/gutter behavior and native Base UI scrolling remain. The separate Data Grid viewport receives the same crisp inset focus classes; no scrolling code is replaced. |
| Table | Structural borders use the consumer theme without the website border reset. Removed the Frame-specific nested background, corner and shadow construction. Header/body/footer hierarchy and restrained row selection/hover remain; outer Frame owns composition. No new card wrapper. |
| Data Grid | Preserves public props, density/spacing definitions, estimate size, column widths, measurement refs, pinning/resizing contracts, pagination and DnD engines. Neutral header/pinned surfaces replace translucent/blurred layers. Inline focus is contained inside clipped cells; NumberField has one focus owner. Native filter buttons add keyboard activation and pressed state. Pagination exposes current page and wraps its coarse page controls at narrow widths. Pending/error rendering remains with the editing hook; errors expose alert semantics. |
| Rating | Remains bundled with Data Grid. Retains controlled value/callback API, sizes, fractional clipping and pointer preview. Semantic warning replaces hard-coded yellow. Native star buttons add Enter/Space, arrows, Home/End, RTL navigation and crisp focus. Read-only stars have a labelled image group. Coarse targets expand outside measured grid tables; inline grid stars retain their existing dimensions. |
| Canonical Empty State | Registry still resolves to `blocks.tsx`, with all props/exports retained. Quiet media treatment, explicit type hierarchy, wrapping and approved Button composition. Decorative built-in icons are hidden from assistive technology. Documentation now describes this block's actual props rather than the unrelated local composable API. |
| Login / Signup | Existing Card/Input/Form/Button/Checkbox/Alert/Toast composition remains. Removed ad hoc Button heights; sm/md/lg now map to matching native primitive sizes. Password visibility controls retain their behavior with input-owned trailing spacing. Quiet Card/media/terms composition, restrained entry motion and concise default copy. Callback, validation, loading, social-action and success-toast APIs remain. |
| Local Empty / Kbd | Reviewed all imports. `empty.tsx` supports the Command AI preview; `empty-state.tsx` has no current imports. Both public local export sets are retained. Added wrapping/min-width consistency without consolidation. Kbd keeps its API and matches the approved small metadata size/radius; Command remains its consumer. |
| Public theme | No palette, theme definition, public variable, CLI theme merge or `cn()` changes. Existing customized theme values survive repeated installs. |
| Distribution | New `feedback.styles.css`, `data.styles.css` and `blocks.styles.css` are explicitly bundled by each owning installable. No website CSS is required. Official generation owns all changed JSONs. 54 installables / 113 embedded source/style occurrences / three identical registry distributions. |

## Demonstrated virtualizer defect and narrow correction

The exact checkpoint reproduced an empty virtual window with both its own scroll owner and the existing Base UI scroll-area composition. Supplying a public `initialRect` in the disposable investigation made initial rows appear, but scrolling still retained those same rows. The cause was `useMemo(() => virtualizer.getVirtualItems(), [isVirtualizationEnabled, virtualizer])`: the virtualizer instance remains stable while its visible window changes. The memo therefore retained the initial empty/stale array.

The final correction reads `virtualizer.getVirtualItems()` on each render. The implementation diff in `data-grid-table-virtual.tsx` consists only of replacing that memo and adding its explanatory comment. It does not replace the virtualizer, observer, row measurement, item keys, overscan, spacers, pending states, infinite-fetch contract or public API. The final fixtures use the default viewport initialization, without `initialRect` or custom observer workarounds. Geometry is unchanged; the visible window can now initialize and follow scrolling.

The final coarse-pointer check also demonstrated pagination overflow: 44px page controls in a non-wrapping group forced a 380px minimum width at a 390px viewport with page insets. The page-button group now wraps using the existing gap. Row density, page selection, page sizing and desktop spacing remain. Responsive assertions compare scroll width against `documentElement.clientWidth`, so mobile layout-viewport expansion cannot hide the defect.

## Geometry and behavior evidence

The copied-consumer specimen is installed through the real built CLI, compiled with strict TypeScript and rendered at a normal 16px root without website globals. Its comparison bundle imports actual checkpoint source exported through `git archive`, not reconstructed components. The fixture specifies 48px rows and exercises 300 records. Desktop/390px with fine/coarse pointers compare identical row heights, header dimensions, star dimensions and viewport height. Coarse Rating expansion explicitly excludes all measured Data Grid table descendants.

Browser assertions cover native virtual scrolling, bounded render windows, row/column dragging, 48px drag rows, column resizing, row selection, pagination, cell draft cancellation, optimistic pending skeletons, successful commit, rejected-save rollback, Select/Rating keyboard commits, filter activation, generated Dialog entry/dismissal, Toast actions/close/timers, reduced motion, forced-color ScrollArea focus and responsive light/dark rendering. The additional 18 checks cover single-owner text/number focus, number commit, dialog save/rejection, header sorting, column visibility, independent virtual scrolling, RTL Rating and auth validation/pending/success. All 60 primary checks pass. Eight additional natural-density comparisons remove the fixture row-height constraint and confirm checkpoint equality at 14px/16px roots, 390/1440px and fine/coarse pointers. Natural 16px-root rows remain 37px fine / 45px coarse. Twenty-seven Toast checks cover all six positions in light/dark at 320/1440px, native swipe dismissal and timer hover pause/resume.

Protected production regressions separately exercise Phase 1 controls/surfaces, Phase 2 form/control specimens, app/OS theme disagreement, Phase 4 overlays/menus and Phase 5 modals with focus return. Date Picker retains 24.5px caption/nav, 7px caption inset, 5.25px gap, 12.25px chevron, 28px days and 33.25px year/month buttons. Date/Time popup frames match saved baselines; Time draft/Cancel/OK and its 308 × 491.6875px mobile Dialog pass. These are current rendered checks in addition to source equality, not an assertion that every historical test was rerun.

## Validation

| Check | Result |
| --- | --- |
| Website / CLI / strict copied-consumer TypeScript | PASS |
| `pnpm lint` | PASS |
| Theme check + all eight theme-fixture families | PASS |
| `pnpm build:all` | PASS: 54 registry entries, 54 Markdown pages, 312 previews |
| `pnpm registry:check` | PASS: 54 installables, 113 source occurrences, three identical copies |
| CLI CJS/declaration build | PASS |
| CLI fixtures | PASS: Phases 1–5 plus Phase 7 individual fresh, incremental, reverse, partial, customized, repeated init/add, recursive import/style closure and source/style/theme preservation |
| Next.js production build | PASS: final optimized production build, TypeScript, 60 generated pages |
| Production routes/docs | PASS: 117 production HTTP routes; all 54 served registries equal generated bytes |
| Browser behavior / responsive / regressions | PASS: 60 primary, 18 supplementary, 8 natural-geometry comparisons, 27 Toast checks; 28 Phase 1/form/picker, 22 Phase 2, 34 Phase 4, 33 modal and 16 affected-family production checks; separate picker interaction sequence |
| Protected-file review | 81 protected files byte-identical; theme, Date/Time, ScrollArea, DnD engines, editing hook and Phases 1–5 source/style ownership retained |
| `git diff --check` | PASS |

Reproduction commands:

```sh
pnpm theme:check
pnpm theme:fixtures
pnpm build:all
pnpm --filter @baseui-cn/www exec tsc --noEmit
pnpm --filter baseui-cn exec tsc --noEmit
pnpm lint
pnpm registry:check
pnpm --filter baseui-cn build
pnpm cli:fixtures
pnpm --filter @baseui-cn/www build
git diff --check
```

Local evidence and runnable browser/consumer scripts are retained under `/private/tmp/baseui-v2-phase7/`. `geometry.json`, `scope-review.json`, `browser-results.json`, `extra-results.json`, `natural-geometry.json`, `toast-results.json`, production regression JSONs and build/fixture logs distinguish consumer, baseline and production proof. Screenshots include `feedback-320-dark.png`, `auth-390-dark.png`, `toast-390.png` and production modal/picker captures. This directory is local QA evidence, not a deployment.

## Limitations

Chromium viewport, touch/coarse media, forced colors and reduced-motion checks are emulation. Physical iOS/Safari/Android, hardware swipe velocity, native software keyboards, browser-chrome zoom and manual screen-reader certification are not claimed. Existing Phase 4 anchored-popup document-CSS-zoom limitations remain outside this phase.

CLI fixtures execute real bundled init/add but stub dependency installation; installed locked workspace modules supply consumer runtime dependencies. This is not a published-network-install acceptance. The repository remains on pinned Next.js 16.1.7; its installed package has no `dist/docs` guide directory. The optional [next-dev-loop skill](/Users/jaspreet/.codex/skills/next-dev-loop/SKILL.md) requires Next.js 16.3+, so it was not applied or used to justify an upgrade. Validation uses the production build and real browser instead. Host model settings were not changed.

## Git status and complete file inventory

Final HEAD remains the exact checkpoint on the dedicated Phase 7 branch. Nothing is staged. All listed changes remain uncommitted. The primary checkout and Phase 6 remain outside this worktree's implementation.

Changed paths: **70** — 21 component sources, three anatomy stylesheets, nine component documents, two registry/fixture scripts, one generated Markdown map, 33 generated registry copies and this report.

```text
 M apps/www/components/data-grid/data-grid-column-filter.tsx
 M apps/www/components/data-grid/data-grid-column-header.tsx
 M apps/www/components/data-grid/data-grid-editing.tsx
 M apps/www/components/data-grid/data-grid-pagination.tsx
 M apps/www/components/data-grid/data-grid-scroll-area.tsx
 M apps/www/components/data-grid/data-grid-table-virtual.tsx
 M apps/www/components/data-grid/data-grid-table.tsx
 M apps/www/components/data-grid/data-grid.tsx
 M apps/www/components/ui/alert.tsx
 M apps/www/components/ui/auth.tsx
 M apps/www/components/ui/blocks.tsx
 M apps/www/components/ui/empty-state.tsx
 M apps/www/components/ui/empty.tsx
 M apps/www/components/ui/item.tsx
 M apps/www/components/ui/kbd.tsx
 M apps/www/components/ui/progress.tsx
 M apps/www/components/ui/rating.tsx
 M apps/www/components/ui/skeleton.tsx
 M apps/www/components/ui/spinner.tsx
 M apps/www/components/ui/table.tsx
 M apps/www/components/ui/toast.tsx
 M apps/www/content/docs/components/alert.mdx
 M apps/www/content/docs/components/data-grid.mdx
 M apps/www/content/docs/components/empty-state.mdx
 M apps/www/content/docs/components/item.mdx
 M apps/www/content/docs/components/login.mdx
 M apps/www/content/docs/components/progress.mdx
 M apps/www/content/docs/components/signup.mdx
 M apps/www/content/docs/components/table.mdx
 M apps/www/content/docs/components/toast.mdx
 M apps/www/lib/__generated__/docs-markdown.json
 M apps/www/public/registry/alert.json
 M apps/www/public/registry/data-grid.json
 M apps/www/public/registry/empty-state.json
 M apps/www/public/registry/item.json
 M apps/www/public/registry/login.json
 M apps/www/public/registry/progress.json
 M apps/www/public/registry/signup.json
 M apps/www/public/registry/skeleton.json
 M apps/www/public/registry/spinner.json
 M apps/www/public/registry/table.json
 M apps/www/public/registry/toast.json
 M packages/cli/registry/alert.json
 M packages/cli/registry/data-grid.json
 M packages/cli/registry/empty-state.json
 M packages/cli/registry/item.json
 M packages/cli/registry/login.json
 M packages/cli/registry/progress.json
 M packages/cli/registry/signup.json
 M packages/cli/registry/skeleton.json
 M packages/cli/registry/spinner.json
 M packages/cli/registry/table.json
 M packages/cli/registry/toast.json
 M packages/registry/registry/alert.json
 M packages/registry/registry/data-grid.json
 M packages/registry/registry/empty-state.json
 M packages/registry/registry/item.json
 M packages/registry/registry/login.json
 M packages/registry/registry/progress.json
 M packages/registry/registry/signup.json
 M packages/registry/registry/skeleton.json
 M packages/registry/registry/spinner.json
 M packages/registry/registry/table.json
 M packages/registry/registry/toast.json
 M scripts/check-cli-install-fixtures.mjs
 M scripts/registry-meta.mjs
?? apps/www/styles/blocks.styles.css
?? apps/www/styles/data.styles.css
?? apps/www/styles/feedback.styles.css
?? docs/design-system-v2-phase7-report.md
```
