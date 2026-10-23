# Design System V2 — Phase 1 implementation report

October 19, 2026. Phase 1 is implemented and locally validated, with changes left uncommitted on `feature/design-system-v2`.

Pre-flight passed before edits: clean working tree, branch verified, both `7c6fcf5996421c25a2a21d14221d4156611e1c1d` and `776cd43117cb908a66891817bacbad1a9119546e` in history, and the complete approved plan read. HEAD remains the approved specification checkpoint. Neither checkpoint was amended. No dependency or package version changed.

## Requested acceptance report

| #   | Item                        | Result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Files changed               | Full inventory below. Component source, local anatomy CSS, theme generation/distribution, CLI safety, specimens, generated registry/docs, and this report.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 2   | Canonical architecture      | `scripts/theme-definition.json`, schema version 2, owns serializable public defaults and Tailwind mappings. `build-theme.mjs` generates docs CSS, CLI TypeScript data, and the theming example JSON. It validates undefined/circular aliases. Registry generation also refreshes theme outputs.                                                                                                                                                                                                                                                                                                                                                                                              |
| 3   | Public tokens               | 54 `--cn-*` roles, listed below. All existing compatibility hooks and Tailwind mappings remain. Fresh consumers use the approved palette; existing consumer values remain authoritative.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 4   | Local tokens                | Button, text-control, badge, avatar and surface anatomy variables remain local to their CSS classes. They are not added to the public theme schema.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 5   | Dark mode                   | Generated `@custom-variant dark (&:where(.dark, .dark *));` ships to docs and consumers. Native color-scheme follows the class. `querycanvas-theme` is unchanged.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 6   | Motion                      | Owned `cn-spin`/`cn-loading` definitions support Button loading. Color/border interaction transitions use 100ms; shared 160/220ms and easing roles are ready for later families. Reduced motion removes Phase 1 transitions and spinner rotation while retaining its accessible status. No animation dependency added.                                                                                                                                                                                                                                                                                                                                                                       |
| 7   | Button                      | Preserved all eight variants, eleven size names, default/md alias, icon aliases, loading/disabled semantics and useRender composition. Exact border boxes, graphite primary, semantic warning, explicit icon dimensions, flat surfaces, capable-pointer hover, pressed precedence and one outline. Coarse actions reserve a real 44px box.                                                                                                                                                                                                                                                                                                                                                   |
| 8   | Input                       | Preserved props, refs, primitive/native composition and numeric native size. Outer shell alone sets 32/36/40px geometry; default/md are equal. Inner field fills the box. Full-opacity placeholder, explicit disabled/read-only treatment, stable invalid border, and blue focus contour without a ring.                                                                                                                                                                                                                                                                                                                                                                                     |
| 9   | Textarea                    | 80/96/112px minimum border boxes; 14/20 typography, mobile editable text 16/24. Content sizing and vertical resize retained; InputGroup's existing non-resizable textarea policy retained. A twelve-line fixture grows to 260px without clipping. Ref behavior passes.                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 10  | InputGroup                  | One border box and 6px radius; explicit addon/action space replaces negative margins. Text input focus belongs to the group; independent addon actions retain their own contour. Keyboard action and coarse-target clearance pass.                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 11  | Label                       | Native label/useRender semantics retained, with 14/20 typography and 6px gap. Input examples now have associated labels.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 12  | Badge                       | Existing variants, sizes and pill option retained. Heights are 18/22/26px, with status text/surface/on-solid roles. Static badges remain compact. Interactive focus uses one outline.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 13  | Avatar                      | 24/32/40/48px sizes, circular default, fallback typography and status separation. Base UI Image/Fallback delegation is unchanged. Valid local image and failed-image fallback pass in the consumer.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 14  | Separator                   | Same primitive/orientation behavior, 1px geometry, semantic subtle border color.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| 15  | Card/Frame                  | Card radius 10px, outer Frame/CardFrame 12px, physically nested FramePanel corners derived from inset. Flat/outline/elevated/ghost variants, joined edges, clipping, table containment, nesting and render composition retained. Restrained elevation and differentiated dark surfaces.                                                                                                                                                                                                                                                                                                                                                                                                      |
| 16  | Plan adjustments            | No palette or approved geometry deviation. The docs keep legacy compatibility defaults and resolve V2 roles separately during this partial migration. Narrow picker adapters preserve existing rem geometry. A caption-only chevron margin replaces the inherited Button SVG margin: removing it otherwise widened the caption by 3.5px. CLI shared-style collision handling was corrected so sequential installs work without replacing consumer CSS. These are implementation safeguards within the approved direction.                                                                                                                                                                    |
| 17  | Multi-field border review   | Reviewed ten text-entry controls together with labels/helpers, invalid/read-only/disabled states, buttons and nested Card/Frame surfaces in both themes. The hierarchy is balanced; approved resting swatches `#7d8797` / `#788497` remain unchanged. Computed control/surface contrast: 3.63:1 light, 4.50:1 dark.                                                                                                                                                                                                                                                                                                                                                                          |
| 18  | Light/dark                  | Representative before/after captures cover Button, Input, Textarea, InputGroup, Badge, Avatar, Card, Frame and Date/Time pickers. Current geometry/state specimens pass in both themes. Status on-solid text contrast is 6.43–6.82:1 light and 8.98–10.52:1 dark. These are measured pairs, not a library-wide conformance claim.                                                                                                                                                                                                                                                                                                                                                            |
| 19  | OS/application disagreement | Both OS-dark/app-light and OS-light/app-dark pass. Real persisted next-themes choices produce identical computed Select styles regardless of OS preference. An isolated consumer also verifies actual class-based dark utilities in both disagreement directions.                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 20  | Consumer/CLI                | Fresh theme creation, missing-token upgrade, custom themes, repeated init/add, grouped/repeated/indented/layered CSS, comments/quoted examples, and byte idempotence pass. Existing root semantic overrides are not shadowed by newly added dark defaults. Sequential Input → Textarea → InputGroup → Card → Frame and the reverse shared-surface order pass, including customized stylesheet/source preservation. Copied source compiles and renders independently of site CSS at a 16px root. CLI dependency installation is stubbed in disposable fixtures; installed workspace dependencies supply the rendered fixture. No published-registry or network package-install claim is made. |
| 21  | Date Picker regression      | Caption/nav both 24.5px; caption inset 7px, declared gap 5.25px, chevron 12.25px, and original optical margin preserved. Caption width remains 88.125px in the July specimen. Day buttons remain 28px; year/month buttons measure 33.25px. Caption's intentional 2px outline/2px offset remains without a ring. Desktop comparisons match captured baseline dimensions; year/month navigation and range continuity pass. Picker TSX is unchanged.                                                                                                                                                                                                                                            |
| 22  | Time Picker regression      | Captured shell, clock, list, navigation and input geometry retained through local adapters. Default input remains 33.5px on docs; clock remains 238px. Draft preview, Cancel rollback, OK commit and the explicit mobile Dialog relationship pass. Time Picker source/styles are unchanged. Input-derived surface colors follow V2.                                                                                                                                                                                                                                                                                                                                                          |
| 23  | TypeScript                  | PASS: actual `tsc --noEmit` in the www and CLI workspaces, plus production-build type checking.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 24  | Lint                        | PASS: `pnpm lint` / repository ESLint task.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 25  | Builds                      | PASS: `pnpm build:all`; Next production build (60 generated pages); CLI CJS and declaration builds. No new runtime dependencies.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| 26  | Registry consistency        | PASS: all 54 installables, 78 embedded source/style occurrences, source equality and SHA-256/byte equality across public/package/CLI copies. Shared anatomy CSS is included in relevant registry manifests. Existing missing dependency metadata for Card/Avatar/InputGroup is corrected.                                                                                                                                                                                                                                                                                                                                                                                                    |
| 27  | Routes/docs                 | PASS: 117 production HTTP checks covering 54 component routes, 54 registry routes and nine public/docs/metadata routes. Generated 54 markdown documents and 308 preview sources. All captured heading anchors retained across ten representative pages; Input adds only the System specimen heading. Theming defaults derive from canonical output; bare HSL-channel examples are corrected to complete colors.                                                                                                                                                                                                                                                                              |
| 28  | Browser coverage/limits     | Desktop Chromium: keyboard focus, hover/press, disabled/read-only/invalid/loading, light/dark, OS disagreement, 320/390/768/1440px, reduced motion, forced colors, RTL addon containment and 200% CSS-zoom reflow. Coarse-pointer CDP emulation verifies real 44px actions and 52px composite action shells at 390px and 1440px. A 20px consumer root scales regular Input to 45px. Physical iOS/Safari, virtual keyboards, physical touch and native browser-chrome zoom are unverified. CSS zoom is explicitly an approximation. Unmigrated Select, Autocomplete, Combobox, Checkbox, Dialog and Data Grid received smoke review; their family migrations remain out of scope.             |
| 29  | Whitespace/final diff       | `git diff --check` passes; source/generated diff reviewed. Approved plan and checkpoints untouched.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 30  | Git status/scope            | 69 changed/new files including this report, all uncommitted, on `feature/design-system-v2`; HEAD `776cd43117cb908a66891817bacbad1a9119546e`. No push, merge, publish, deploy, version bump or later-phase implementation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

## Theme contract

Fresh consumer `--cn-unit` is `.0625rem`. Docs use the temporary `calc(1rem / 14)` bridge and retain the 14px root. Existing global `--radius` and legacy utility geometry remain untouched on docs; V2 consumes semantic radius roles. New consumers get `--radius: calc(6 * var(--cn-unit))`. Existing consumers retain their radius and palette, and may deliberately override the new semantic roles to adopt the new appearance.

Public roles are:

- Scale/radius: `--cn-unit`, `--cn-radius-control`, `--cn-radius-item`, `--cn-radius-card`, `--cn-radius-frame`.
- Motion: `--cn-duration-fast`, `--cn-duration-popup`, `--cn-duration-spatial`, `--cn-ease-standard`, `--cn-ease-enter`, `--cn-ease-exit`.
- Surfaces: `--cn-surface-page`, `--cn-surface`, `--cn-surface-raised`, `--cn-surface-popup`, `--cn-surface-muted`, `--cn-surface-hover`, `--cn-surface-pressed`, `--cn-surface-selected`, `--cn-surface-disabled`.
- Text/action: `--cn-text`, `--cn-text-muted`, `--cn-text-disabled`, `--cn-primary`, `--cn-primary-foreground`, `--cn-primary-hover`, `--cn-primary-pressed`.
- Boundaries/focus: `--cn-border-subtle`, `--cn-border`, `--cn-border-control`, `--cn-border-hover`, `--cn-border-active`, `--cn-border-disabled`, `--cn-focus-color`.
- Status: `--cn-status-{destructive,success,warning,info}-{text,border,surface,foreground}`. The foreground role is the on-solid pair; status text is separate.
- Elevation: `--cn-shadow-control`, `--cn-shadow-card`, `--cn-shadow-popup`, `--cn-shadow-modal`.

Private anatomy includes `--button-*`, `--control-*`, `--textarea-*`, `--badge-*`, `--avatar-*`, `--card-padding`, and the retained CardFrame clip variables. They are implementation details, not promised theme APIs.

## Reproducible checks and evidence

New targeted checks use Node and existing build dependencies, without a new test runner:

```sh
pnpm theme:check
pnpm theme:fixtures
pnpm registry:check
pnpm --filter baseui-cn build
pnpm cli:fixtures
pnpm --filter @baseui-cn/www exec tsc --noEmit
pnpm --filter baseui-cn exec tsc --noEmit
pnpm lint
pnpm build:all
pnpm --filter @baseui-cn/www build
git diff --check
```

Local browser evidence and disposable fixtures are retained at `/private/tmp/baseui-v2-phase1/`:

- `baseline/`: light/dark screenshots and geometry captured before visual edits.
- `after/`: matching current representative pages and geometry.
- `review-0.png` through `review-4.png`: baseline/current light/current dark comparison sheets.
- `qa/`: consumer behavior, custom-theme and contrast JSON; production route results; responsive form, picker, coarse-pointer, reduced-motion, forced-color and zoom screenshots.
- `consumer/`: actual CLI-copied components/styles, standalone browser bundle and CLI log. It does not import site globals.
- `date-picker-comparison.json` and `time-picker-comparison.json`: measured baseline/current geometry comparisons.

The ten-control specimen is available in Input documentation under **System specimen**. Representative captures: [light](/private/tmp/baseui-v2-phase1/system-light.png), [dark](/private/tmp/baseui-v2-phase1/system-dark.png), [320px docs](/private/tmp/baseui-v2-phase1/qa/docs-system-320-light.png), and [standalone consumer](/private/tmp/baseui-v2-phase1/qa/consumer-1440-light.png).

## Complete file inventory

- `apps/www/app/docs/theming/page.tsx`
- `apps/www/components/previews/input-previews.tsx`
- `apps/www/components/ui/avatar.tsx`
- `apps/www/components/ui/badge.tsx`
- `apps/www/components/ui/button.tsx`
- `apps/www/components/ui/card.tsx`
- `apps/www/components/ui/frame.tsx`
- `apps/www/components/ui/input-group.tsx`
- `apps/www/components/ui/input.tsx`
- `apps/www/components/ui/label.tsx`
- `apps/www/components/ui/separator.tsx`
- `apps/www/components/ui/textarea.tsx`
- `apps/www/content/docs/components/input.mdx`
- `apps/www/lib/__generated__/docs-markdown.json`
- `apps/www/lib/__generated__/preview-sources.json`
- `apps/www/lib/__generated__/theme.json`
- `apps/www/public/registry/avatar.json`
- `apps/www/public/registry/badge.json`
- `apps/www/public/registry/button.json`
- `apps/www/public/registry/card.json`
- `apps/www/public/registry/date-picker.json`
- `apps/www/public/registry/frame.json`
- `apps/www/public/registry/input-group.json`
- `apps/www/public/registry/input.json`
- `apps/www/public/registry/label.json`
- `apps/www/public/registry/separator.json`
- `apps/www/public/registry/textarea.json`
- `apps/www/styles/avatar.styles.css`
- `apps/www/styles/badge.styles.css`
- `apps/www/styles/button.styles.css`
- `apps/www/styles/date-picker.styles.css`
- `apps/www/styles/globals.css`
- `apps/www/styles/surface.styles.css`
- `apps/www/styles/text-control.styles.css`
- `apps/www/styles/theme.generated.css`
- `docs/design-system-v2-phase1-report.md`
- `package.json`
- `packages/cli/registry/avatar.json`
- `packages/cli/registry/badge.json`
- `packages/cli/registry/button.json`
- `packages/cli/registry/card.json`
- `packages/cli/registry/date-picker.json`
- `packages/cli/registry/frame.json`
- `packages/cli/registry/input-group.json`
- `packages/cli/registry/input.json`
- `packages/cli/registry/label.json`
- `packages/cli/registry/separator.json`
- `packages/cli/registry/textarea.json`
- `packages/cli/src/commands/add.ts`
- `packages/cli/src/utils/ensure-styles.ts`
- `packages/cli/src/utils/theme.generated.ts`
- `packages/registry/registry/avatar.json`
- `packages/registry/registry/badge.json`
- `packages/registry/registry/button.json`
- `packages/registry/registry/card.json`
- `packages/registry/registry/date-picker.json`
- `packages/registry/registry/frame.json`
- `packages/registry/registry/input-group.json`
- `packages/registry/registry/input.json`
- `packages/registry/registry/label.json`
- `packages/registry/registry/separator.json`
- `packages/registry/registry/textarea.json`
- `scripts/build-registry.mjs`
- `scripts/build-theme.mjs`
- `scripts/check-cli-install-fixtures.mjs`
- `scripts/check-registry-consistency.mjs`
- `scripts/check-theme-fixtures.mjs`
- `scripts/registry-meta.mjs`
- `scripts/theme-definition.json`
