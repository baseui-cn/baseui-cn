# Design System V2 — Phase 3 implementation report

October 19, 2026. **Selection/search implemented, reviewed and validated for its approved Phase 3 checkpoint** on `feature/design-system-v2`. Checkpoint parent: `6498255d5903f37225ba765fbd7e6c3c892717c9`. The final commit SHA and post-commit clean-tree result are recorded in the checkpoint handoff.

Before editing, the branch and clean working tree were verified and all four supplied checkpoints were confirmed as ancestors: Base UI `7c6fcf5996421c25a2a21d14221d4156611e1c1d`, specification `776cd43117cb908a66891817bacbad1a9119546e`, Phase 1 `2106fe8b1eee7da75708586c0a73e8cc90b8b0b1`, and Phase 2 `6498255d5903f37225ba765fbd7e6c3c892717c9`. The plan and both implementation reports were read, and committed foundation/control/surface/form anatomy, theme generation and registry/CLI installation were inspected. Checkpoints are unchanged. Installed Base UI and registry metadata remain exactly **1.9.0**.

## Requested acceptance report

| # | Item | Result |
| --- | --- | --- |
| 1 | Files changed | 26 files: four selection wrappers, one shared local stylesheet, three previews, Select MDX, two generated documentation files, twelve registry copies, two registry/fixture scripts, and this report. Complete inventory below. |
| 2 | Shared token changes | **None.** Public theme definition, generated theme outputs, global CSS, Phase 1/2 palette, geometry and focus recipes are unchanged. Local `--selection-*`, `--chips-height` and `--chip-height` variables describe anatomy only. |
| 3 | Shared selection anatomy | `selection.styles.css` ships with all four installables. Controls reuse Phase 1 text-entry composition or its existing semantic roles. Rows, indicator/text slots, metadata, labels, separators, status/empty content, actions, scrolling and lifecycle transitions share visual rules without a new runtime abstraction. |
| 4 | Select | Existing exports, size props, Root alias, ItemText, groups, placeholder, controlled/uncontrolled values, native form behavior, refs, trigger composition, portal, positioning defaults and scroll arrows remain. sm/default/lg measure 32/36/40px, with 6px corners and one 2px/2px trigger focus outline. Default item-aligned positioning remains available; it does not receive scale animation that would distort its measurements. |
| 5 | Autocomplete | Keeps the existing native Input render composition and primitive InputGroup. InputGroup owns the sole text focus contour; addon/actions occupy real flex slots. Clear is independently tabbable and named, with its own inset contour. Filtering, free text, async replacement, selection, clearing, Escape, blur/refocus, refs and controlled values pass. Popup styling now belongs to the primitive Popup itself. |
| 6 | Combobox | Single/multiple Root and filter APIs remain unchanged; no `createItems` migration. Native InputGroupInput rendering fixes an observed nested-input composition defect that dropped the native disabled attribute. Primitive InputGroup now registers the complete existing shell as the popup anchor. Controlled updates, callbacks, selection, filtering, async results, clear, refs, form values and read-only behavior pass. |
| 7 | Multi-value/chips | Flexible 32/36/40px base rows; content can grow. Chips use selected roles, 4px corners, wrapping text and a separate remove slot. Simple text or the chip's accessible label supplies `Remove <value>`; `removeProps` overrides remain supported for complex content. Primitive roving chip focus and Backspace removal remain intact. Long values wrap without covering the action; coarse remove targets are real 44px boxes. |
| 8 | Command list/input work | Delegates to Autocomplete anatomy for input, rows, group labels, empty state and scrolling. Metadata/shortcuts use a full-opacity semantic muted role. Filtering, arrow navigation, callbacks, groups and empty state pass. There is no separate Command chip API to modernize; the supported multi-value chip anatomy is owned by Combobox. Dialog popup/backdrop/viewport, Panel and Footer implementations are unchanged. Existing dialog focus entry and Escape focus return pass. A 100-command fixture scrolls within the existing shell. |
| 9 | Popup treatment | 10px radius through the existing surface radius role; semantic popup surface and 1px border; restrained popup elevation; 4px list gutter; anchor width, available width/height and transform origin stay primitive-owned. Maximum height is bounded by available height and 368 scaled units. Internal scroll owners remain authoritative. No generic Popover/Menu/Tooltip/PreviewCard changes. |
| 10 | Option-row treatment | Minimum 32px desktop / 44px coarse, 14/20 type, 8px inline inset and gap, 4px corners. Text/icon and check slots use flex layout without negative icon margins or indicator overlays. Multiline text can grow. Left/right Combobox indicator positions both remain supported. |
| 11 | Selected vs highlighted | Real `data-selected`, `data-highlighted`, `data-disabled` and ARIA attributes are inspected. Select/Combobox retain selected fill plus a persistent check. Highlight uses transient hover fill plus an inset navigation edge; selected+highlighted retains selected fill/check and gains the edge. Autocomplete/Command have no persistent selection state in their primitive contract, so none is fabricated. Selection survives pointer movement, navigation and reopening. |
| 12 | Disabled/read-only/invalid | Explicit disabled roles avoid opacity stacking. Invalid boundaries keep the shared blue focus contour; disabled wins in combined invalid+disabled cases. Root disabled reaches the actual native Combobox input after the composition correction. Read-only values remain readable and unchanged by attempted selection/clear. Select's focusable `aria-disabled` options remain navigable; Enter cannot select them. |
| 13 | Async behavior | Local timer-backed Autocomplete and Combobox specimens exercise initial pending, rapid query changes, result replacement, empty results, active descendants, selection, clear and reopening. Primitive highlight management is retained. Empty live-region elements stay mounted; their children change while loading. Existing Autocomplete async docs no longer announce “No packages found” during loading. Status accepts caller-provided error text; there is no dedicated network/error API or real network request in these examples, and no request cancellation/business logic was added. |
| 14 | Large-list review | 500-item Select and Combobox mount, navigate, scroll the highlighted final row into view and select successfully. An additional 500-result Autocomplete confirms bounded internal scrolling. Command is also checked with 100 rows. No virtualization, collection abstraction or performance claim was added; recorded local elapsed time includes automation overhead and is not a benchmark. |
| 15 | Keyboard behavior | Select Tab, Enter/Space, arrows, Home/End, typeahead, Escape and disabled-option rejection pass. Editable controls support typing, arrows, Enter, Tab/clear and chip navigation/removal. Command filtering/callbacks and existing modal focus return pass. Base UI's closed editable-control Escape clearing behavior is preserved; Escape is not redefined to only dismiss popups. No new manual DOM focus management. |
| 16 | Accessibility/name/active descendant | DOM/AX snapshots confirm Field labels, accessible input/trigger names, named clear/remove actions, native disabled/read-only/required state, selected semantics and live status regions. Async navigation references a real option through `aria-activedescendant`. Required Select blocks native submission; successful form values preserve Select/Combobox names and values. This is browser/DOM evidence, not a manual screen-reader certification. |
| 17 | IME/composition | Synthetic compositionstart/compositionend and composing Enter (`which` 229) checks pass for Autocomplete, Combobox and Command without premature selection/command execution or unexpected clearing. Primitive composition handlers remain intact. Native language IMEs, predictive keyboards and platform-specific Escape/composition sequences are not certified. |
| 18 | Coarse/touch | Chromium coarse-pointer emulation passes at 320/390/768/1440px: rows and clear/remove actions reach 44px, editable composites with actions reserve 52px, and input/action boxes do not overlap. A CDP touch tap clears through the primitive and returns focus to the input. No invisible overlapping target expansion or automatic Drawer conversion. |
| 19 | Responsive behavior | Copied consumer and production specimen fit 320/390/768px and desktop. Popups stay inside the viewport and lists scroll internally. Long chips wrap intentionally; a compact chip row remains 32px. RTL indicator containment, 200% CSS-zoom reflow and a 20px-root consumer scaling regular controls to 45px pass. CSS zoom is an approximation of browser zoom. |
| 20 | Light/dark | Consolidated family and consumer reviewed in both class-based themes. Resting controls, borders, selected checks, highlighted rows, disabled values and invalid/focus combinations remain distinct. No palette changes or component `prefers-color-scheme` overrides. |
| 21 | OS/app disagreement | Consumer checks cover all four OS/app combinations. Production persisted app-light/OS-dark and app-dark/OS-light checks retain expected surfaces, control geometry and native color-scheme. |
| 22 | Consumer/CLI fixtures | Fresh Phase 1+2 theme, customized existing theme, partial install, reverse order and repeated add/init pass. Recursive source/helper/style closure covers Input/InputGroup, Field consumers and Command → Autocomplete → Input. Shared stylesheet and custom source/token values are preserved. Copied sources compile with strict TypeScript and render at a normal 16px root without website globals. Dependency package installation is stubbed offline and workspace modules supply runtime dependencies; this is not a published-registry/network install claim. |
| 23 | Phase 1 regression | Button, Input, Textarea, InputGroup, Badge, Avatar, Card and Frame pass light/dark production smoke review. Their source and anatomy files are byte-unchanged from HEAD. |
| 24 | Phase 2 regression | Field, Form, Fieldset, Checkbox, Radio, Switch, NumberField, Slider, OTP, Toggle and ToggleGroup pass light/dark production smoke review (22 checks), plus consolidated Field/OTP geometry and responsive review. Phase 2 sources/styles are unchanged. |
| 25 | Date Picker regression | Exact protected geometry/anchors match the captured baseline: caption/nav 24.5px, July caption width 88.125px, 7px insets, 5.25px gap, 12.25px chevron, 28px days and 33.25px month/year buttons. Complete 2px/2px caption focus and range continuity pass. Picker TSX/styles are unchanged. |
| 26 | Time Picker regression | Exact protected input/clock/list/action geometry and anchors match baseline: default input 33.5px, clock 238px. Draft preview, Cancel rollback, OK commit and mobile Dialog relationship at 390px pass. Picker TSX/styles are unchanged. |
| 27 | TypeScript | PASS: actual `tsc --noEmit` in www and CLI, strict copied-consumer compilation, and production build type checking. |
| 28 | Lint | PASS: repository `pnpm lint`, no warnings/errors in the final run. |
| 29 | Builds | PASS: `build:all`, CLI CJS/declaration build and final Next.js production build (60 generated pages). No package/version/dependency changes. |
| 30 | Registry consistency | PASS: 54 installables, 95 embedded source/style occurrences, canonical-source equality and identical public/package/CLI copies. All four entries ship selection CSS; Autocomplete now declares its previously missing Input dependency. All 54 production registry responses also equal checked-in files byte-for-byte. |
| 31 | Routes/docs | PASS: 117 production HTTP checks, including 54 component routes, 54 registry routes and nine public/docs/metadata routes. Output contains 54 Markdown documents and 310 preview sources. Existing Select headings/anchors are retained; only System specimen is added. Component URLs, SEO, navigation and catalog structure are unchanged. |
| 32 | Browser QA | 74 primary selection assertions plus 22 additional contract/layout/touch assertions pass. Production family review, Phase 1/2 smoke checks and picker checks provide separate evidence. Assertions inspect real rendered state, values, focus, bounds, scroll dimensions and computed styles, rather than class strings. Reduced motion, forced colors and RTL are included. |
| 33 | Physical-device limitations | No physical iOS/Safari/Android, real touch hardware, virtual keyboards, native language IMEs, native browser-chrome zoom or manual assistive-technology certification. CDP pointer/touch/media emulation is explicitly simulated. |
| 34 | Approved-plan deviations | No family, public-token, palette or modal-shell scope deviation. Evidence-driven wrapper corrections are detailed below. Generic popup and ScrollArea modernization remain deferred; only selection instances receive bounded layout styles. The pinned Next 16.1.7 is preserved and verified through production/browser tooling; no framework upgrade is introduced. |
| 35 | git diff --check | PASS, including final generated outputs and this report. |
| 36 | git status | The approved checkpoint includes exactly the 26 Phase 3 files listed below, on the original feature branch with Phase 2 as its parent. Four earlier checkpoints remain ancestors. Final SHA and clean-tree verification are recorded in the checkpoint handoff. No push, merge, publish, deploy, package version bump or Phase 4 work. |

## Evidence-driven implementation details

The original Combobox nested an ordinary Base UI Input under Combobox.Input and supplied `disabled={false}` to the render target by default. In the browser, the resulting input had `data-disabled` but lacked native `disabled` under a disabled root. Reusing the existing native InputGroupInput path leaves behavior with Combobox.Input and correctly renders the native state. The disabled prop remains optional and flows to the owning primitive.

A measured default Combobox shell was 207px wide while its popup measured 171px, matching only the editable input and excluding the action slot. Registering the existing shell through `ComboboxPrimitive.InputGroup` resolves that actual anchor problem; the final specimen's full-width control and popup both measure 440px. This is a targeted use of an existing primitive, without changing the wrapper's public API or adding a sizing offset hack.

The large Autocomplete fixture exposed a 16,008px scroll viewport clipped inside a 290px popup. Selection-local column flex and inherited height bounds constrain the viewport to 288px, with real internal scrolling. An explicit automatic height on selection ScrollArea instances also avoids unresolved percentage height in inline Command content. Both inline containment and a 100-row dialog viewport are checked. The generic ScrollArea implementation and Command shell are unchanged.

Compact action and chip focus uses the foundation's same 2px color/thickness with an **inset** offset to keep the complete contour inside composite boundaries. Input focus belongs to the outer shell; a separately focused clear action does not leave a second outer contour. Rows use navigation highlight, rather than an extra popup-wide focus outline.

Phase 4 may consider reusing the popup/row visual vocabulary after its own behavior review. Phase 3 does not extract a generic popup runtime component or refactor any generic overlay/menu.

## Approved checkpoint review

The complete 26-file diff was reviewed again before staging. The literal path manifest excludes every later family. A fresh comparison confirms **76 protected source/style/theme/package files** and the Command modal shell sections are byte-unchanged from the Phase 2 parent. No public `--cn-*` definitions, dependency versions, package manifests or lockfiles changed.

Official regeneration reproduces the reviewed docs/registry outputs byte-for-byte. Registry/source equality, theme checks, CLI installation fixtures, www TypeScript, lint, 22 focused selection browser assertions and whitespace checks pass again. The component source and shared anatomy are unchanged by this checkpoint review; only this report records approval. Fresh evidence is retained in `/private/tmp/baseui-v2-phase3-checkpoint/`.

## Reproduction and retained artifacts

```sh
pnpm theme:check
pnpm theme:fixtures
pnpm --filter @baseui-cn/www exec tsc --noEmit
pnpm --filter baseui-cn exec tsc --noEmit
pnpm lint
pnpm build:all
pnpm registry:check
pnpm --filter baseui-cn build
pnpm cli:fixtures
pnpm --filter @baseui-cn/www build
git diff --check
```

Evidence is retained in `/private/tmp/baseui-v2-phase3/`:

- `browser-qa.mjs`, `browser-results.json`, `browser-qa.log`: 74 assertions plus one local timing observation; `extra-qa.mjs`, `extra-results.json`, `extra-qa.log`: 22 additional assertions.
- `consumer/`, setup/build scripts and logs: actual CLI-copied source, shared anatomy and generated consumer theme. No website CSS import.
- `docs-results.json`, `phase2-smoke-results.json`, `docs-final-results.json`, associated Python/driver scripts and logs: separate production docs/foundation/family review.
- `date-picker-geometry.json`, `time-picker-geometry.json` and picker captures: exact protected baseline comparison and behavioral review.
- `routes.json`, `routes.log`, build/type/lint/theme/CLI/registry logs: reproducible repository and route checks. `scope-review.json` confirms 47 protected files and Command shell sections are byte-unchanged.
- Complete final family captures: [light](/private/tmp/baseui-v2-phase3/review-light.png) and [dark](/private/tmp/baseui-v2-phase3/review-dark.png). `capture-review.log` also records inline Command containment in both themes.

The consolidated specimen is [Select → System specimen](http://localhost:3105/docs/components/select#system-specimen). The standalone copied consumer is [localhost:3106](http://localhost:3106/). Local servers are review aids, not deployment.

## Complete file inventory

- `apps/www/components/previews/autocomplete-previews.tsx`
- `apps/www/components/previews/phase3-system-preview.tsx`
- `apps/www/components/previews/select-previews.tsx`
- `apps/www/components/ui/autocomplete.tsx`
- `apps/www/components/ui/combobox.tsx`
- `apps/www/components/ui/command.tsx`
- `apps/www/components/ui/select.tsx`
- `apps/www/content/docs/components/select.mdx`
- `apps/www/lib/__generated__/docs-markdown.json`
- `apps/www/lib/__generated__/preview-sources.json`
- `apps/www/public/registry/autocomplete.json`
- `apps/www/public/registry/combobox.json`
- `apps/www/public/registry/command.json`
- `apps/www/public/registry/select.json`
- `apps/www/styles/selection.styles.css`
- `docs/design-system-v2-phase3-report.md`
- `packages/cli/registry/autocomplete.json`
- `packages/cli/registry/combobox.json`
- `packages/cli/registry/command.json`
- `packages/cli/registry/select.json`
- `packages/registry/registry/autocomplete.json`
- `packages/registry/registry/combobox.json`
- `packages/registry/registry/command.json`
- `packages/registry/registry/select.json`
- `scripts/check-cli-install-fixtures.mjs`
- `scripts/registry-meta.mjs`
