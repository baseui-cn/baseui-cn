# Free Time Picker keyboard entry fix

October 26, 2026. **Reviewed and approved for checkpoint; held for a future 1.4.1 patch release.** The approved eight-file scope below is unchanged. Focused tests (15/15), website/CLI TypeScript, lint, registry consistency, Chromium keyboard and Date/Time smoke (22/22), and `git diff --check` were rerun successfully. Lint retains only the existing Data Grid warning. The browser rerun also reconfirmed unchanged geometry and focus boundaries against the pre-fix parent. Fresh evidence: `/private/tmp/baseui-free-time-picker-checkpoint-browser/` and `/private/tmp/baseui-free-time-picker-checkpoint-*.log`.

Checkpoint message: `fix: restore Time Picker keyboard entry for disabled selection`. Version stays **1.4.0**; the future patch release is not performed by this checkpoint. No push, merge to main, deployment, version bump, npm publication, or tag is authorized or performed.

The following records the original October 25 implementation-review snapshot, including its then-uncommitted status and pre-fix HEAD.

October 25, 2026. **PASS — uncommitted for review.** Branch `feature/design-system-v2`; HEAD remains `42d0b0c184093904a8574156edaa720e4582e721`. Initial working tree was clean.

`TimePickerListColumn` assigned `tabIndex=0` solely from selection, including disabled selected buttons. There is no separate focused-option state in the list. The fix derives enabled options once per render: an enabled selected option keeps entry; otherwise the first enabled option receives entry; an empty enabled list has no entry. Selection, disabled availability, and the existing Arrow/Home/End and native Enter/Space handlers retain their behavior. No focus fallback writes state or invokes a value callback.

For the exact controlled `09:30`, `minTime="10:00"`, list/immediate reproduction, hour `10` now receives keyboard entry. Hour `09` remains selected and disabled. Every minute in the current `09` hour is unavailable, so the minute column correctly has no entry. The external value remains `09:30` until the caller changes it. Explicit activation still emits `10:30` without overriding that controlled value.

| Validation                                         | Result                                                                                    |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `node --test scripts/check-time-picker.mjs`        | 15/15 pass; original HEAD fails 11 of these cases                                         |
| Real Chromium fixture                              | 22/22 checks pass; zero runtime errors                                                    |
| Website and CLI `tsc --noEmit`                     | Pass                                                                                      |
| `pnpm lint`                                        | Pass; existing Data Grid exhaustive-deps warning at line 368 remains                      |
| `pnpm build:all`                                   | Pass; official generator changed only the three Time Picker JSON copies                   |
| `pnpm registry:check`                              | Pass; 54 installables, 119 source occurrences, three identical distributions              |
| Date/Time regression                               | Clock render/navigation/activation and Date Picker keyboard open/Escape/focus return pass |
| `git diff --check` and changed-file Prettier check | Pass                                                                                      |

Render tests cover enabled and disabled selection in 12h/24h, unavailable minutes in the current hour, all disabled, globally disabled, missing step options, seconds, min/max, disabled exact/predicate/range matchers, and no callback from fallback rendering. Browser tests additionally verify no callback from mounting, focus, navigation, or a subsequent unavailable controlled-value update.

Keyboard-only list QA covers **static, Popover, and Dialog × light/dark × 12h/24h** using the exact reproduction: visible entry, all four arrows, wrapping, Home/End, Enter/Space, and unchanged controlled selection. Before/after rectangles, fonts, padding, and border widths match for the shell, list, columns, and options in all 12 combinations. Dialog forward/reverse focus containment and Escape return match HEAD; Popover preserves HEAD's existing Tab-out/close behavior and Escape return. Base UI's Dialog focus sentinels are allowed to redirect before containment is checked.

Evidence: [browser results](/private/tmp/baseui-free-time-picker-keyboard/results.json), 12 `*-entry.png` screenshots and 12 `*-geometry.json` comparisons in `/private/tmp/baseui-free-time-picker-keyboard/`. Representative screenshots were visually inspected: [static/light/12h](/private/tmp/baseui-free-time-picker-keyboard/static-light-12h-entry.png), [Popover/light/24h](/private/tmp/baseui-free-time-picker-keyboard/popover-light-24h-entry.png), [Dialog/dark/24h](/private/tmp/baseui-free-time-picker-keyboard/dialog-dark-24h-entry.png). Command logs use `/private/tmp/baseui-free-time-picker-*.log`. This is local Chromium component-fixture evidence, not hosted, screen-reader, or physical-device acceptance.

Repeat browser QA with an available Playwright installation and Chromium executable:

```sh
PLAYWRIGHT_MODULE=/absolute/path/to/playwright-core/index.mjs \
CHROME_PATH=/absolute/path/to/chrome \
TIME_PICKER_EVIDENCE=/private/tmp/baseui-free-time-picker-keyboard \
node scripts/check-time-picker-browser.mjs --compare-head
```

Use `--compare-head` only while HEAD contains the pre-fix implementation; omit it for normal post-commit regression runs. The fixture uses the real Free components and repository styles. No dependency or Next.js upgrade was needed.

Generated Time Picker distributions are byte-identical and embed the exact canonical TSX/CSS. SHA-256 for each JSON: `be35b2927fd262b9689407732f4eaa657a5674a77a7deb6dc58ee0c54f32a8a5`. Version remains **1.4.0**. Pro source, Date Picker, styles, clock logic, public API, CLI source, theme, website routes/previews, package manifests, and lockfile are unchanged.

Final file scope and `git status --short --untracked-files=all`:

```text
 M apps/www/components/ui/time-picker.tsx
 M apps/www/public/registry/time-picker.json
 M packages/cli/registry/time-picker.json
 M packages/registry/registry/time-picker.json
?? docs/free-time-picker-keyboard-report.md
?? scripts/check-time-picker-browser.mjs
?? scripts/check-time-picker.mjs
?? scripts/fixtures/time-picker-keyboard.tsx
```

Nothing staged or committed. No push, merge, version bump, publication, or deployment. **STOP for review.**
