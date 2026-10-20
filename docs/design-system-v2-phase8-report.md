# Design System V2 — Phase 8: Date + Time final consistency sign-off

October 20, 2026. **Local sign-off: PASS, with the compact-touch and physical-device limitations below. Intentionally uncommitted.**

Branch `feature/design-system-v2`, exact HEAD `8d32f05b6cb422a6c1f0513208edb4e5837666ce`, and an empty working-tree status were verified before editing. The integrated V2 plan, current Phase 4 border/focus and visual-simplification corrections, and Phase 5–7 reports were reviewed. The current corrections govern palette/state acceptance; older reports' historical branch/status statements are not current checkout evidence.

This is a consistency review. One demonstrated reduced-motion cascade defect was corrected. Date/Time component implementations, geometry, APIs, theme architecture and normal motion remain unchanged. Phase 9 has not started. Session model settings were not changed.

## 1. Files changed

Five paths, none staged:

- `apps/www/styles/date-picker.styles.css`
- `apps/www/public/registry/date-picker.json`
- `packages/cli/registry/date-picker.json`
- `packages/registry/registry/date-picker.json`
- `docs/design-system-v2-phase8-report.md`

The stylesheet adds one explanatory comment and makes its two existing reduced-motion `animation: none` declarations important. All three registry copies were regenerated using official commands. There are no component TSX, Time Picker CSS, theme, dependency, version, preview, website or CLI implementation changes. Disposable QA scripts/consumers remain outside the repository under `/private/tmp/baseui-v2-phase8/`.

## 2. Date Picker visual consistency

PASS. Existing local aliases resolve to the approved popover, foreground, muted, primary, secondary, border and ring roles. Selected dates retain their useful primary marker; today uses muted fill and medium emphasis; range interiors remain continuous secondary surfaces. Outside/disabled dates stay subordinate. Navigation/caption hover and keyboard focus remain visible. Light/dark screenshots were inspected.

No generic popup perimeter or scale is applied to the protected date frame: the rendered popup retains zero border, its existing radius, padding, typography and clipping. Static calendars retain their own structural border. Input shells use the stronger input boundary; invalid Field composition reaches the destructive boundary. Existing specialized input focus treatment is retained, alongside the protected crisp calendar outlines. No palette, selected-fill redesign or decorative treatment was added.

## 3. Date Picker geometry

PASS. Fresh final-production measurements at the website's unchanged 14px root:

| Protected item                           | Rendered result                            |
| ---------------------------------------- | ------------------------------------------ |
| Caption / nav height                     | 24.5px / 24.5px                            |
| Caption inline inset / label-chevron gap | 7px / 5.25px                               |
| Chevron                                  | 12.25px                                    |
| July 2026 caption width                  | 88.125px                                   |
| Day button                               | 28 × 28px                                  |
| Month / year button height               | 33.25px                                    |
| Complete caption focus                   | 2px outline / 2px offset; no shadow        |
| Popup                                    | 245 × 272.5px; zero border; 12.75px radius |

Fine/coarse media preserve these dimensions. A normal 16px-root copied consumer intentionally follows the existing rem geometry: caption/nav 28px, inset 8px, gap 6px, chevron 14px, days 32px, month/year 38px and popup 276 × 308px. This is existing root scaling, not a new adapter or a website root rebase. Tabular numerals remain.

## 4. Date Picker behavior

PASS. Rendered checks cover day/month/year switching, year-grid arrows, inner Escape returning focus to the caption, day arrows and Enter selection, previous/next navigation, controlled value callbacks, uncontrolled examples, disabled constraints, outside/today/multiple states, range continuity, portal ownership, popup dismissal and trigger focus return. Existing controlled hidden-input form composition submits canonical date/time values. The public Date Picker input does not gain an invented native `name`, validation or ref API.

All component sources are byte-identical to HEAD. Exports, existing prop/ref contracts, controlled/open-state ownership, range/preset/footer logic and primitive composition are retained. This review does not claim a repeat of every historical Date Picker behavioral permutation.

## 5. Date Picker coarse/touch review

**Protected compact exception, not a 44px-target compliance claim.** At the site root, day buttons are 28px in 32px cell pitches; caption/nav controls are 24.5px. A 44px invisible target would overlap adjacent day targets by 12px. Seven actual 44px columns already require 308px before panel padding; preserving the current 21px total padding would require 329px, beyond a 320px viewport. Existing clear buttons are also compact.

No safe 44px enlargement fits the protected frame without changing its layout or targets. Desktop geometry and range continuity are preserved. Existing range containers retain their bounded horizontal scrolling; no grid shrink or overlapping hit extension was introduced. A future opt-in coarse calendar layout may allocate real space and deliberately handle narrow widths and multiple months. It remains optional, unimplemented work.

## 6. Time Picker visual consistency

PASS. Clock/list content uses opaque neutral Graphite surfaces, readable foreground/muted labels, restrained primary selection and existing structural separators. Selected clock/list options remain distinct from hover. Input boundaries use `--input`; invalid Field composition and disabled controls remain distinguishable. Existing small option type and tabular numerals are retained. Light/dark screenshots show readable clock numerals, list columns and footer actions.

Protected Popover/Dialog compatibility scopes continue to prevent generic popup borders, typography, padding and scale from replacing picker geometry. No Time Picker implementation or style adjustment was needed.

## 7. Time Picker geometry

PASS. Production baseline remains: default input 33.5px, desktop clock 238px, desktop list popup 252 × 418.75px, and explicit mobile Dialog **308 × 491.6875px at 390px**. The existing narrow breakpoint produces a 415.25px-high list popup and a 231px mobile clock; it is not a regression.

The 16px-root copied consumer preserves its existing proportional geometry: 38px input, 272px desktop clock, 288 × 478px desktop list popup, and 352 × 554.59375px mobile Dialog at 390px with a 264px clock. No attempt was made to force website pixel dimensions into a normal-root consumer.

## 8. Time Picker behavior

PASS. List selection previews a draft without firing the controlled committed-value change. Cancel restores the committed value; OK commits the preview and closes. Keyboard list navigation, Enter selection, Escape rollback and focus return pass. Disabled inputs and unavailable constrained options remain disabled. Static clock/list and seconds examples render. A real emulated touch on the mobile clock changes the preview; mobile Cancel and OK pass independently.

Opening after Cancel retains the existing active clock view. The QA harness was corrected to respect that behavior. No draft, Cancel, OK, pointer-capture, keyboard, controlled/uncontrolled, ref or public-API logic changed.

## 9. Time Picker mobile/touch review

PASS for preserved layout/interaction, with compact targets recorded. Clock option boxes remain 31.5px at the site root / 36px at a normal 16px root. The whole clock face handles angular touch selection, including space between labels; an emulated face tap previews correctly. This does not certify every individual option as a 44px target.

List rows and footer buttons remain 28px high at the site root / 32px in the normal-root consumer. Footer action groups wrap using existing rules. These are explicit remaining touch limitations; enlarging them would alter the protected popup/Dialog baseline and was deferred.

The copied mobile landscape Dialog fits 320 × 390, 568 × 320, 667 × 320 and 768 × 390 viewports. Horizontal overflow is zero in these specimens; vertical scrolling reaches OK/Cancel. Existing dynamic-height bounds, safe-area environment declarations and overscroll behavior remain. Nonzero physical notch insets and real software keyboards were not tested.

## 10. Dark mode

PASS. Current public dark values remain `#101011` background, `#171718` card, `#1C1C1F` popover, `#29292D` muted, `#303034` secondary, `#3D3D43` border, `#6C6C75` input and `#9699D6` ring. There are still **26 generic public variables and zero public `--cn-*` variables**.

Settled rendered date states retain dark selected `#E7E7EA` with `#18181A` text, today `#29292D` with `#EEEEEF` text, and ordinary foreground `#EEEEEF`. Caption focus retains the approved ring. Both app/OS disagreement directions pass; Date popup, Time popup and Time Dialog computed styles are identical for the same app theme under either OS preference. Customized consumer light/dark surfaces also reach both picker families through their aliases.

## 11. Reduced motion

PASS after the only authored implementation correction. Before correction, the copied intake consumer matched `prefers-reduced-motion: reduce` but still computed `0.16s ease-out both rdp-view-fade`. The existing reduced-motion rules lost to more specific animated-view and directional month selectors, including later source rules. This was a pre-existing cascade defect exposed by the requested motion review; it is not attributed to a new palette change.

Giving the two existing reduced-motion suppression declarations priority fixes that exact failure without changing ordinary animation definitions. Real animation-event checks in final production retain normal 160ms view fade and directional month slide in LTR/RTL, and record no view/month animation starts under reduced motion. Copied-consumer checks additionally cover scale-view/fade-month hooks at 14px/16px roots in both directions. Time clock-hand transitions stop under reduced motion. Picker surfaces retain `scale: none`; no generic modal/popup scale leaks into them.

## 12. V2 integration observations

The existing Button/Input geometry adapters and Popover/Dialog exceptions are intentional shipped compatibility rules. They remain necessary while the website uses a 14px root and consumers commonly use 16px. The stronger generic input boundary and class-based theme work with the specialized picker anatomy. Generic coarse Button expansion correctly excludes picker descendants. No root-scale, palette, theme API, focus-ownership or modal composition rewrite was justified.

## 13. Changes made and why

Only the reduced-motion cascade correction described above, its three generated distribution copies, and this report. Normal CSS geometry is provably identical: removing the new comment and the two `!important` annotations reproduces the exact HEAD stylesheet. Each generated registry differs only in that stylesheet's embedded content. A scope check confirms **197 protected component/style/theme/CLI/package files** remain byte-identical, including both picker implementations and Time Picker CSS.

## 14. Deferred optional enhancements

- An explicit, opt-in coarse-calendar layout with real nonoverlapping targets and deliberate narrow/multi-month containment.
- A separately reviewed Time Picker touch-density option for list rows, period controls, footer and clear actions, with baseline comparisons.
- Physical mobile safe-area, keyboard, assistive-technology and hardware-touch acceptance.

No responsive redesign, automatic mode switch, root rebase or website polish is included.

## 15. CLI / copied-consumer result

PASS. Six new disposable real-CLI scenarios cover Date alone, Time alone, both together, reverse order, both after Dialog/Popover, and a customized theme. Recursive source/style imports and registry dependencies resolve. Repeated add/init preserve every customized source/style and the theme. All six copied consumers pass strict TypeScript and standalone JS/CSS builds; independent Date and Time consumers render without website globals. Combined, reverse, post-overlay and custom consumers render at a normal 16px root.

Date ships its dedicated stylesheet with Button/Field/Input/Popover closure and required DayPicker/date-fns packages. Time ships its dedicated stylesheet with Dialog/Popover/Button/Field/Input closure. Official shared styles remain in that closure. CLI stays **1.3.3**. Dependency installation was stubbed for offline fixtures; installed locked workspace modules supplied runtime packages. This is not a published-network-install claim.

## 16. Phase 1–7 focused regression

PASS on the final production build. This is a focused smoke pass, not every historical phase's full acceptance suite.

| Phase | Current evidence                                                                                                         |
| ----- | ------------------------------------------------------------------------------------------------------------------------ |
| 1     | Button, Input and Card plus the retained foundation set in light/dark; included in 28 foundation/form/picker checks      |
| 2     | Field, Checkbox/Switch and NumberField plus the retained control set; 22 light/dark checks                               |
| 3     | Select keyboard commit, Combobox filtering and Command empty filtering                                                   |
| 4     | Popover and DropdownMenu plus retained overlay examples, collision bounds and picker popup comparisons; 34 checks        |
| 5     | Dialog/Drawer and retained modal shells, dismissal/focus return, exact Time Dialog; 33 checks                            |
| 6     | Tabs and NavigationMenu plus retained navigation/disclosure examples, responsive fit and popup bounds; 34 checks         |
| 7     | Table and Data Grid render in light/dark among 16 family checks; Toast creation and close interaction checked separately |

## 17. TypeScript

PASS: website and CLI `tsc --noEmit`, strict TypeScript in all six copied consumers, and production build type checking. No public component type changed.

## 18. Lint

`pnpm lint` succeeds with **zero errors and one existing warning** at `apps/www/components/data-grid/data-grid-table-virtual.tsx:368` (`react-hooks/exhaustive-deps`, `virtualItems` effect dependency). The warning was reproduced before editing and that file remains byte-identical to HEAD. It was not changed during this picker review. This is not a warning-free lint claim.

## 19. Builds

PASS: `theme:check` (three generated outputs), all eight theme-fixture families, `build:all` (54 registry entries, 54 Markdown pages, 313 previews), CLI CJS/declarations, and final Next.js production build (60 generated pages). Existing complete CLI fixtures also pass after regeneration.

The initial sandboxed production build stalled without diagnostics; it was interrupted and the authorized build outside that process sandbox completed. Local Chromium/server execution also used the required environment permissions. These were tooling constraints, not component failures. No dependency/framework upgrade was introduced.

## 20. Registry

PASS: **54 installables, 119 embedded source/style occurrences, three identical distributions**, canonical source equality and served registry byte equality. Only Date Picker's embedded reduced-motion CSS changed. Registry dependencies and shipped styles remain intact.

## 21. Routes / docs

PASS: **117 production HTTP checks**, including all 54 component docs and 54 registry responses, plus site/docs/metadata endpoints. Served registries equal generated bytes. Retained picker and prior-family headings/anchors pass the regression scripts. No docs route, preview, catalog or website CSS was edited.

## 22. Browser QA and evidence

Local Chromium: 89 primary copied-consumer checks and 16 supplementary checks; 28 final production exact-geometry/motion/coarse/state checks; the production regression counts above; and a separate Date/Time interaction sequence. All requested 320/390/768/desktop widths, light/dark, opposing app/OS themes, fine/coarse pointers and reduced motion were exercised.

Evidence is retained under `/private/tmp/baseui-v2-phase8/`: `browser-results.json`, `supplement-results.json`, `production-final-results.json`, `consumer-install-results.json`, `scope-review.json`, `routes.json`, production regression JSONs, command logs, runnable scripts, fresh copied consumers and the pre-correction consumer. Final production logs are `build-production-final.log`, `regressions-final.log`, `smoke-final.log` and `production-final.log`. Screenshots include `date-1440-dark.png`, `date-states-dark.png`, `time-states-dark.png`, `dialog-320-dark.png` and `landscape-568.png`; representative light/dark desktop/mobile images were visually inspected.

Harness assumptions were corrected for retained clock view, sticky-header scrolling, Select's keep-mounted closed content, actual Combobox fixture labels, and settled theme transitions. They did not require component fixes. The final results distinguish these harness issues from the reproduced Date Picker CSS defect.

## 23. Physical-device limitations

No physical iOS/Safari/Android, WebKit engine, native software keyboard/IME, hardware touch/drag velocity, real notch/safe-area, native pinch/browser zoom or manual screen-reader certification. Viewport, touch/coarse media, RTL and reduced-motion checks are desktop Chromium emulation. Existing Phase 4 anchored-popup document-CSS-zoom limitations remain outside this phase. Neither picker is certified as universally satisfying a 44px touch-target goal.

## 24. `git diff --check`

PASS. Official generation produces no unrelated tracked drift. No files are staged.

## 25. Git status and stop gate

Final branch remains `feature/design-system-v2`; HEAD remains exactly `8d32f05b6cb422a6c1f0513208edb4e5837666ce`. Four tracked paths are modified and this report is untracked; zero staged paths. All Phase 8 work remains uncommitted.

```text
 M apps/www/public/registry/date-picker.json
 M apps/www/styles/date-picker.styles.css
 M packages/cli/registry/date-picker.json
 M packages/registry/registry/date-picker.json
?? docs/design-system-v2-phase8-report.md
```

No commit, push, merge, publication, deployment, CLI version bump or Phase 9 work was performed.
