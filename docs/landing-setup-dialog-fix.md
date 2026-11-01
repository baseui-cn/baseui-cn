# Landing setup Drawer viewport fix

**Current disposition:** combined landing fixes are approved for one checkpoint commit and push. The approved checkpoint section below supersedes the historical uncommitted review gates. Merge and deployment remain unapproved.

## Review state and baseline

**Website fix prepared; STOP for review. All changes are uncommitted and unstaged. No deployment, merge, push, tag, package publication, or version change.**

- Repository: `baseui-cn/baseui-cn`.
- Public main fetched before editing and verified exactly as `975eb8d8ffec35de9a2a9b3b4237eed84396a740`.
- Isolated worktree: `/private/tmp/baseui-cn-landing-setup-fix`; branch: `fix/landing-setup-viewport`; HEAD remains the public baseline above.
- Initial source checkout was clean on `integration/data-grid-v9` at `aa3744d329621fb1d6e70d68d396e1e6c3d051a6`. It remains clean at that SHA and was not used for implementation.
- npm's published `baseui-cn@1.4.1` and production registry version were verified before editing. Final read-only verification also confirms all 55 hosted registry JSON bodies match the public 1.4.1 release manifest and production still advertises 1.4.1. Public main was rechecked remotely at completion.
- Base UI remains **1.9.0**. CLI remains **1.4.1**. Public main retains TanStack Table **8.21.3**. No Pro repository was accessed or changed.

Evidence root: `/private/tmp/baseui-landing-evidence/`. Before and after are real `next build` / `next start` captures, using unchanged production source for the baseline. Browser acceptance uses the final production build on `http://127.0.0.1:3142`.

## Root cause

The landing page uses the same canonical V2 **right Drawer at every width**, rather than switching between separate Dialog and Drawer roots. Its shared shell already constrains its outer rectangle correctly.

The website composition placed configuration in a shrinking `.setup-body` scroll region, but kept the entire `.setup-output` outside that region with `flex-shrink: 0`. That output contains an unbounded generated command, actions, and expandable follow-up text. Long valid workspace paths and opening the follow-up grow this fixed region beyond the available height. The outer Drawer hides overflow, so actions and follow-up content can become unreachable while the configuration collapses to a few pixels. Even the default landscape layout leaves only 93px for configuration.

Reproduction: open setup, choose Existing project and Monorepo, enter `apps/` plus 35 repetitions of `long-workspace-`, and expand the follow-up using Enter. At **844×390**, the original action row is **y=398–440**, below the viewport, and the output ends at **y=704**. At **320×740**, configuration shrinks to **36px** and output ends at **y=992**. This is valid input; command generation is unchanged.

Two related page-composition problems were also addressed:

- A late mobile CSS override forced 90px side labels beside controls even at 320px. Removing that override restores stacked labels and full-width choices on mobile.
- The existing native follow-up disclosure failed pointer activation because Drawer swipe handling captured its pointer. Base UI 1.9.0's existing `data-base-ui-swipe-ignore` marker restores click activation locally. The same marker on command text allows pointer text selection. Keyboard disclosure behavior remains intact. No shared primitive was patched.

## Implementation and files changed

1. `apps/www/components/shared/setup-builder.tsx`
   - One labelled, keyboard-focusable `.setup-scroll` region contains configuration, generated command, validation, and follow-up text.
   - Copy command and Done sit outside that region in a compact, stable footer. Command text is reached by scrolling; Copy remains available throughout.
   - A page-local callback ref tracks `visualViewport.height` and `offsetTop`, with resize/scroll listener cleanup on unmount. CSS retains a `100dvh` fallback.
   - Existing Base UI swipe-ignore markers protect command text and the disclosure from pointer capture.
2. `apps/www/styles/landing.css`
   - Sizes only this landing Drawer to the visual viewport; preserves the responsive 500px/full-width presentation.
   - Keeps a single content scrollbar, with header/actions outside it. Content ends above the footer; no sticky overlay conceals the last item.
   - Applies safe-area padding once at the relevant edges, including the 320px override; reduces header/footer padding in short viewports.
   - Restores stacked mobile controls and gives key controls 44px coarse-pointer targets.
3. `scripts/check-landing-setup-browser.mjs`
   - Repeatable production-site browser regression harness; no new dependencies. Loopback targets only.
   - Uses computed rectangles, actual clipboard contents, real keyboard events and real rendered onboarding controls.
4. `docs/landing-setup-dialog-fix.md`
   - This report.

Canonical V2 Drawer, Input, Button, Select, Badge and existing form semantics remain in use. No new visible native controls, custom modal engine, component APIs, framework adapters, command rules, presets, or onboarding state transitions were introduced.

## Before/after geometry

Coordinates are CSS pixels. Default comparison captures use the same mouse-pointer environment in both phases; light and dark have matching geometry. The after column is the **whole footer**, including its padding; baseline is the **button row**. Full rectangles are in `before/geometry.json` and `after/geometry.json`.

| Viewport | Before configuration scroll height | Before buttons y | After footer y | Light / dark result |
| -------- | ---------------------------------: | ---------------- | -------------- | ------------------- |
| 1440×900 |                                603 | 801–843          | 826–899        | PASS / PASS         |
| 1024×768 |                                471 | 669–711          | 694–767        | PASS / PASS         |
| 768×1024 |                                727 | 925–967          | 950–1023       | PASS / PASS         |
| 430×932  |                                643 | 831–875          | 856–931        | PASS / PASS         |
| 390×844  |                                555 | 743–787          | 768–843        | PASS / PASS         |
| 320×740  |                                411 | 639–683          | 664–739        | PASS / PASS         |
| 844×390  |                                 93 | 291–333          | 330–389        | PASS / PASS         |

The final acceptance matrix additionally enables coarse-pointer/mobile emulation at mobile sizes. The stress comparison below uses the same long valid workspace and expanded follow-up; after values use coarse-pointer targets, which account for the 2px landscape footer difference above.

| Stress viewport       | Before configuration height | Before output bottom | Before buttons y       | After scroll height | After buttons y        |
| --------------------- | --------------------------: | -------------------: | ---------------------- | ------------------: | ---------------------- |
| 320×740               |                          36 |                  992 | 504–548                |                 557 | 677–721                |
| 390×844               |                          67 |                  843 | 475–519                |                 681 | 781–825                |
| 844×390               |                          40 |                  704 | **398–440, offscreen** |                 253 | **337–381, reachable** |
| 320×390, extra stress |                          36 |                  992 | **504–548, offscreen** |                 233 | **337–381, reachable** |

Long text and expanded follow-up no longer change footer geometry. Their entire contents remain reachable in the one scroll region. There is no horizontal document overflow or clipped outer control rectangle. Text inputs retain their normal internal horizontal text scrolling for long values.

## Responsive and accessibility acceptance

Each of the seven requested sizes passes in **light and dark**, including open, content top/middle/bottom, footer reachability, framework Select placement, exact command copying, Escape, close button, trigger focus return, and Tab/Shift+Tab containment.

- **1,008 settled keyboard moves**: 36 Tab and 36 Shift+Tab at each size/theme, all inside the Drawer. The harness allows Base UI's focus guards to redirect focus before asserting containment; it does not replace focus handling.
- Escape closes the open framework Select first, retains the Drawer, and returns focus to its trigger. A subsequent Escape closes the Drawer.
- Both landing CTA triggers return focus correctly; close button and Done also pass. Body scrolling is locked while open and restored on close.
- All five framework options × four package managers are exercised in each theme. Seven color presets, four radii, preview mode, CSS copying, monorepo inputs, a maximum valid 100-character new-project name, and invalid-name copy suppression pass.
- Expanded follow-up supports pointer and keyboard activation. Draft values persist across close/reopen.
- Open-state resizing between 320px, 390px, 768px, 844px landscape and 1440px preserves values, focus containment and footer reachability. There is one Drawer root throughout; no responsive remount is required.
- Real touch events move the content scroll position from **0 to 215px** at 390×844.
- Coarse pointer and reduced-motion media queries are asserted in the focused light/dark runs.
- Synthetic visual-viewport height **300px**, panned **40px**, keeps the Drawer and actions contained. This verifies the local viewport subscription; it is not physical keyboard certification.
- Nonzero safe areas are simulated by substituting CSS environment values: top 20px, right/left 44px, bottom 34px. At 320×740 and 844×390, close/actions respect those edges. Desktop Chromium reports actual device safe-area values as zero, and its CDP safe-area override is unavailable; the simulation method is recorded explicitly in `qa/safe-area.json`.
- Zero browser runtime page errors in the final acceptance run. This is Chromium emulation and visual/keyboard QA; no physical device, Safari/WebKit, assistive-technology or formal WCAG certification is claimed.

## Validation and impact

| Check                                 | Result                                                                                                                                                                            |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Website TypeScript                    | PASS — `pnpm --filter @baseui-cn/www exec tsc --noEmit`                                                                                                                           |
| Lint                                  | PASS — zero errors; one pre-existing protected Data Grid exhaustive-deps warning at `data-grid-table-virtual.tsx:368`                                                             |
| Production build                      | PASS — `pnpm --filter @baseui-cn/www build`, Next.js 16.1.7                                                                                                                       |
| Landing browser regression            | PASS — **93/93 check groups**, final matrix and focused checks; results and screenshots in `qa/`                                                                                  |
| Existing onboarding                   | PASS — **59/59** via `pnpm cli:onboarding`                                                                                                                                        |
| Registry consistency                  | PASS — 54 installables, 119 embedded source occurrences, three identical distributions                                                                                            |
| Production-equivalent local endpoints | PASS — **173/173**, including docs, preview routes, metadata and 55 exact registry bodies                                                                                         |
| Hosted release baseline               | PASS — **55/55** hosted registry bodies match the 1.4.1 SHA manifest; npm 1.4.1 verified                                                                                          |
| Protected-byte comparison             | PASS — **295 tracked files** byte-identical to baseline, including packages, CLI/registry, shared UI and styles, Data Grid, website command/theme helpers, manifests and lockfile |
| Whitespace                            | PASS — `git diff --check`                                                                                                                                                         |

Fresh-worktree setup required generating the ignored Fumadocs collections map before the successful baseline build. Initial onboarding execution lacked the ignored CLI bundle; building it with `pnpm --filter baseui-cn exec tsup` resolved the prerequisite and all 59 checks passed. Neither operation changed tracked generated source. The installed Next.js package does not ship the guide directory mentioned in the website AGENTS file; no Next.js API or configuration was changed.

Shared Dialog/Drawer/Field/Button/Select implementations, modal/selection styles, all registry copies, CLI source/version, Base UI dependency, lockfile, Data Grid v9 branch and Pro are unchanged. No registry generation or broad shared-component modification was needed. The stop gate for broad shared changes was therefore not crossed.

## Screenshots and evidence

Representative review links:

| View                      | Before                                                                                       | After                                                                                        |
| ------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Desktop light, top        | [1440×900](/private/tmp/baseui-landing-evidence/before/1440x900-light-top.png)               | [1440×900](/private/tmp/baseui-landing-evidence/qa/1440x900-light-top.png)                   |
| Tablet dark, middle       | [768×1024](/private/tmp/baseui-landing-evidence/before/768x1024-dark-middle.png)             | [768×1024](/private/tmp/baseui-landing-evidence/qa/768x1024-dark-middle.png)                 |
| Mobile light, bottom      | [390×844](/private/tmp/baseui-landing-evidence/before/390x844-light-bottom.png)              | [390×844](/private/tmp/baseui-landing-evidence/qa/390x844-light-bottom.png)                  |
| Narrow light, top         | [320×740](/private/tmp/baseui-landing-evidence/before/320x740-light-top.png)                 | [320×740](/private/tmp/baseui-landing-evidence/qa/320x740-light-top.png)                     |
| Narrow dark, bottom       | [320×740](/private/tmp/baseui-landing-evidence/before/320x740-dark-bottom.png)               | [320×740](/private/tmp/baseui-landing-evidence/qa/320x740-dark-bottom.png)                   |
| Landscape light, top      | [844×390](/private/tmp/baseui-landing-evidence/before/844x390-light-top.png)                 | [844×390](/private/tmp/baseui-landing-evidence/qa/844x390-light-top.png)                     |
| Long workspace, landscape | [Offscreen actions](/private/tmp/baseui-landing-evidence/before/844x390-stress-existing.png) | [Reachable actions](/private/tmp/baseui-landing-evidence/qa/844x390-dark-long-workspace.png) |

Complete captures: `before/` and `qa/`, named by viewport, theme and scroll position. Extra safe-area images are `qa/320x740-synthetic-safe-area.png` and `qa/844x390-synthetic-safe-area.png`. Geometry, browser results, logs, endpoint receipts and integrity manifest remain under the evidence root, outside the commit scope.

Re-run the browser harness after serving a production build:

```sh
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs \
CHROME_PATH='/absolute/path/to/Chrome' \
LANDING_ORIGIN=http://127.0.0.1:3142 \
LANDING_EVIDENCE=/private/tmp/landing-setup-review \
node scripts/check-landing-setup-browser.mjs
```

## Git status and stop gate

Expected combined review worktree status; all six paths are unstaged:

```text
 M apps/www/components/shared/home-showcase.tsx
 M apps/www/components/shared/setup-builder.tsx
 M apps/www/styles/landing.css
?? docs/landing-setup-dialog-fix.md
?? scripts/check-landing-add-task-browser.mjs
?? scripts/check-landing-setup-browser.mjs
```

The original Data Grid worktree remains clean on its original branch/SHA. The fix worktree remains at public main with zero staged files. **KEEP UNCOMMITTED. STOP FOR REVIEW.**

## Landing Add Task Dialog

### Root cause and screenshot review

The supplied screenshot was reproduced against the existing production build before editing. At 1440×900 the Add task Dialog measured **448×250px**, with only **1px** from the actual input bottom to the button row, then **49px** from the buttons to the Dialog bottom.

The landing demo placed a plain `<form>` between `DialogContent` and its `DialogBody`/`DialogFooter`. Canonical V2 provides the section gap on the popup's direct children, and its `noPadding={false}` mode removes section padding only for direct children. The nested body/footer therefore missed both composition rules: no gap separated field/actions, their inline padding indented them beyond the header, and the nested footer's 24px bottom padding accumulated with the popup's 24px bottom padding. No fixed height, min-height, grid expansion or absolute action positioning caused this issue.

### Exact composition change

Only the landing demo's Add task composition changed:

- `DialogContent` uses its existing `render` API to render the form itself. The original submit handler is preserved, including trimming, task insertion, clearing, close and toast behavior.
- `DialogHeader`, `DialogBody`, and `DialogFooter` are direct children of that form/popup. Canonical V2 now supplies the section gap and resets their nested padding correctly.
- The field uses canonical `Field`, `FieldLabel`, and `Input`. The input's ID, required state, placeholder, value handling and autocomplete behavior are preserved.
- Standard `size="sm"` reduces desktop width from 448px to 336px. No width/height overrides, new positioning rules, minimum heights, or extra landing CSS were added.
- This simple body's `overflow-visible` utility keeps the Input focus outline intact inside the popup's existing padding. Visual review caught outline clipping in the intermediate composition; the final harness asserts the outline against all clipping ancestors.
- Canonical footer behavior is preserved: Cancel/Add task align to the right on desktop and stack using V2's responsive order on narrow screens.

The Dialog sizes from its actual content. The narrower desktop description wraps onto two lines, so desktop height is 266px rather than 250px; the width and footprint are smaller, while the field/footer spacing is now balanced. Mobile height falls from 334px to 330px. These are measured consequences of canonical layout, not fixed height targets.

New paths for this continuation are `apps/www/components/shared/home-showcase.tsx` and `scripts/check-landing-add-task-browser.mjs`; this report is updated. The previous setup implementation, landing CSS and setup browser harness remain **byte-identical** to the directionally approved fix.

### Before/after geometry

All values below are actual CSS-pixel rectangles from the production browser. The action row is the union of the **buttons**, measured separately from the footer container so its padding cannot conceal unused space.

| Viewport | Before Dialog W×H | After Dialog W×H | Input → actions, before/after | Actions → bottom, before/after | Light / dark |
| -------- | ----------------- | ---------------- | ----------------------------- | ------------------------------ | ------------ |
| 1440×900 | 448×250           | 336×266          | 1 / 25                        | 49 / 25                        | PASS / PASS  |
| 1024×768 | 448×250           | 336×266          | 1 / 25                        | 49 / 25                        | PASS / PASS  |
| 768×1024 | 448×250           | 336×266          | 1 / 25                        | 49 / 25                        | PASS / PASS  |
| 430×932  | 398×334           | 398×330          | 1 / 25                        | 49 / 25                        | PASS / PASS  |
| 390×844  | 358×334           | 358×330          | 1 / 25                        | 49 / 25                        | PASS / PASS  |
| 320×740  | 288×334           | 288×330          | 1 / 25                        | 49 / 25                        | PASS / PASS  |
| 844×390  | 448×258           | 336×274          | 1 / 25                        | 49 / 25                        | PASS / PASS  |

Representative 1440×900 light rectangles, expressed as **x, y, width, height**:

| Element       | Before                  | After                   |
| ------------- | ----------------------- | ----------------------- |
| Dialog        | 496, 325, 448, 250      | 552, 317, 336, 266      |
| Title         | 521, 350, 362, 24       | 577, 342, 250, 24       |
| Description   | 521, 380, 362, 20       | 577, 372, 250, 40       |
| Field label   | 545, 424, 350, 20       | 577, 436, 72.20, 20     |
| Input         | 546, 455, 348, 34       | 578, 463, 284, 34       |
| Action row    | 729.52, 490, 165.48, 36 | 697.52, 522, 165.48, 36 |
| Dialog bottom | y=575                   | y=583                   |

The final gap from the control shell to the actions is the existing **24px V2 section gap**. Measuring from the inner input adds its shell's 1px border. Bottom clearance is the existing **24px popup padding + 1px border**. Assertions derive those values from computed V2 spacing rather than hardcoding a dialog height. The height equals the measured header/body/footer plus canonical gaps, padding and borders; no unaccounted growing body region remains.

Every title, description, field, input, action row and close-button rectangle is contained. No horizontal document overflow or clipped focus outline was detected. Full unrounded geometry for all 14 views is retained in `add-task/before/results.json` and `add-task/after/results.json` under the evidence root.

### Visual evidence

| View            | Before                                                                              | After                                                                              |
| --------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Desktop dark    | [1440×900](/private/tmp/baseui-landing-evidence/add-task/before/1440x900-dark.png)  | [1440×900](/private/tmp/baseui-landing-evidence/add-task/after/1440x900-dark.png)  |
| Desktop light   | [1440×900](/private/tmp/baseui-landing-evidence/add-task/before/1440x900-light.png) | [1440×900](/private/tmp/baseui-landing-evidence/add-task/after/1440x900-light.png) |
| Tablet dark     | [768×1024](/private/tmp/baseui-landing-evidence/add-task/before/768x1024-dark.png)  | [768×1024](/private/tmp/baseui-landing-evidence/add-task/after/768x1024-dark.png)  |
| Mobile light    | [390×844](/private/tmp/baseui-landing-evidence/add-task/before/390x844-light.png)   | [390×844](/private/tmp/baseui-landing-evidence/add-task/after/390x844-light.png)   |
| Narrow dark     | [320×740](/private/tmp/baseui-landing-evidence/add-task/before/320x740-dark.png)    | [320×740](/private/tmp/baseui-landing-evidence/add-task/after/320x740-dark.png)    |
| Landscape light | [844×390](/private/tmp/baseui-landing-evidence/add-task/before/844x390-light.png)   | [844×390](/private/tmp/baseui-landing-evidence/add-task/after/844x390-light.png)   |

Complete before/after images cover all seven required sizes in both themes. Representative desktop, mobile, narrow and landscape captures were visually inspected in addition to computed geometry.

### Keyboard, form and regression results

**Add task: 29/29 browser check groups pass**, covering all 14 viewport/theme combinations and zero runtime page errors. Each view verifies:

- Entire Dialog and controls are visible; field/actions have canonical spacing and buttons remain reachable.
- Empty and whitespace-only values disable Add task; a valid title enables it.
- Twelve Tab and twelve Shift+Tab moves remain in the Dialog: **336 focus-containment moves** total.
- Escape, Cancel and close button dismiss and return focus to New task. Cancel does not create a task.
- Both Enter and Add task create exactly one visible task with the trimmed title, clear the input, close the Dialog and return focus. Reopening shows an empty, disabled Add task state. This exercises **28 actual local task creations** across the matrix.
- Coarse-pointer and reduced-motion media states are enabled and asserted for mobile/landscape views.

**Setup Drawer regression: 93/93 groups pass again on the final combined production build**, including one scrolling region, visual-viewport resize/pan handling, action reachability, stacked mobile controls, long-workspace/follow-up stress, disclosure pointer activation, copy, responsive resizing and keyboard/focus behavior. Fresh touch events scroll the content from **0 to 216px**. Synthetic nonzero safe-area tests pass again at 320×740 and 844×390; the previously documented simulation and physical-device limitations apply.

Fresh validation for the combined build:

| Check                              | Result                                                       |
| ---------------------------------- | ------------------------------------------------------------ |
| Website TypeScript                 | PASS                                                         |
| Lint                               | PASS, zero errors; same existing protected Data Grid warning |
| Production build                   | PASS                                                         |
| Add task browser                   | PASS, 29/29 groups                                           |
| Setup Drawer browser               | PASS, 93/93 groups                                           |
| Onboarding                         | PASS, 59/59                                                  |
| Local endpoints                    | PASS, 173/173; 55 registry bodies byte-identical             |
| Registry consistency               | PASS                                                         |
| Shared/component/package integrity | PASS, all 295 protected baseline files unchanged             |
| Previous setup source/CSS/harness  | PASS, identical to the prior review hashes                   |
| Formatting and whitespace          | PASS                                                         |

All fresh logs, geometry, screenshots and receipts are under `/private/tmp/baseui-landing-evidence/add-task/`. Re-run Add task QA with the same browser environment variables as the setup harness, adding `ADD_TASK_EVIDENCE=/private/tmp/add-task-review`, then execute `node scripts/check-landing-add-task-browser.mjs`. `--before` is a capture-only mode for a server running the pre-fix composition.

### Shared-component impact and final gate

Shared Dialog, Field, Input, Button, modal styles, registry bytes, CLI 1.4.1, Base UI 1.9.0 and dependency versions remain unchanged. The Data Grid v9 worktree remains clean at `aa3744d329621fb1d6e70d68d396e1e6c3d051a6`; Pro was not accessed. No broad shared defect was demonstrated or shared modification required.

Combined status is the six unstaged paths listed above. HEAD remains `975eb8d8ffec35de9a2a9b3b4237eed84396a740` on `fix/landing-setup-viewport`. **All landing fix work remains uncommitted and unstaged. No checkpoint or deployment. STOP for final landing-page review.**

## Approved checkpoint — November 1, 2026

The combined Setup Drawer viewport/scroll composition and Add Task Dialog V2 section composition are approved for **one website-only commit and push** on `fix/landing-setup-viewport`, with required parent `975eb8d8ffec35de9a2a9b3b4237eed84396a740`. This section supersedes the earlier review hold instructions. **Do not merge or deploy.**

The approved implementation and both browser harnesses are byte-identical to the final reviewed hashes. Only this report was updated during checkpoint preparation to record the approval and fresh validation. The exact six-path commit scope is:

- `apps/www/components/shared/setup-builder.tsx`
- `apps/www/styles/landing.css`
- `apps/www/components/shared/home-showcase.tsx`
- `scripts/check-landing-setup-browser.mjs`
- `scripts/check-landing-add-task-browser.mjs`
- `docs/landing-setup-dialog-fix.md`

Fresh checkpoint acceptance uses a new production build of the approved source:

| Check                      | Result                                                                                  |
| -------------------------- | --------------------------------------------------------------------------------------- |
| Exact branch and parent    | PASS, `fix/landing-setup-viewport` at the required parent before commit                 |
| Public main drift          | PASS, fetched `origin/main` and remote main match the required parent                   |
| Scope and review hashes    | PASS, exactly six paths; all five implementation/harness files match approval           |
| Website TypeScript         | PASS                                                                                    |
| Lint                       | PASS, zero errors; only the existing protected Data Grid exhaustive-deps warning        |
| Production build           | PASS                                                                                    |
| Add Task browser           | PASS, 29/29 check groups                                                                |
| Setup Drawer browser       | PASS, 93/93 check groups                                                                |
| Onboarding                 | PASS, 59/59                                                                             |
| Local production endpoints | PASS, 173/173; 55 served registry bodies match repository bytes                         |
| Registry consistency       | PASS, 54 installables, 119 embedded source occurrences, three identical copies          |
| Protected files            | PASS, all 542 tracked files outside the approved scope match the parent byte-for-byte   |
| Versions and dependencies  | CLI/registry 1.4.1, Base UI 1.9.0, manifests and lockfile unchanged                     |
| Data Grid v9               | Original checkout clean at `aa3744d329621fb1d6e70d68d396e1e6c3d051a6`; branch unchanged |
| Pro                        | Read-only git metadata comparison; no source access or mutation                         |
| Formatting and whitespace  | PASS                                                                                    |

Shared V2 Dialog/Drawer/Field/Input/Button/Select, shared styles, all registry bytes, CLI source, package versions, manifests and lockfile remain unchanged. No Data Grid v9 integration, Pro work, release-version change, merge, or deployment is part of this checkpoint.

Fresh logs, browser screenshots/results, exact source/protected-file manifests, staged-scope verification, commit/push receipts, and final clean-tree/remote-parity evidence are retained in `/private/tmp/baseui-landing-checkpoint-20261101/`. The commit containing this section is the approved checkpoint; its SHA and final remote SHA are recorded in the external receipt to avoid a self-referential report edit.

**Stop after the approved branch push. Merge and site deployment require a separate instruction.**
