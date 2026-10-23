# Design System V2 — Phase 4 implementation report

## DARK BORDER / FOCUS CRISPNESS CORRECTION

This targeted polish pass is the current visual acceptance record. It retains the approved neutral Graphite + Iris palette, simplified rows, integrated Command composition, public APIs and Base UI behavior. It supersedes only the border/divider and scroll-viewport focus details in the preceding visual simplification record. No commit or Phase 5 work was performed.

1. **Previous / final dark structural border:** `#303034` → **`#3D3D43`**. The only rendered comparison was the previous value against the requested preferred candidate. `#3A3A40` and `#404047` were unnecessary: the preferred candidate already gave a quiet continuous edge. All other dark theme values and the complete light palette remain unchanged. There are still 26 generic public variables and no public `--cn-*` vocabulary or new tokens.
2. **Why this value:** the previous edge nearly disappeared beside the popup and card, particularly around rounded corners. In the family review, the new 1px edge remains visible at the top, sides and bottom, against both the page and a card, without resembling a form-control outline. For context, border-to-popover contrast changes from approximately 1.29:1 to 1.58:1; border-to-card changes from 1.36:1 to 1.66:1. These decorative perimeters deliberately do not target 3:1.
3. **Popup / card result:** Command, DropdownMenu, Menubar, Select, Combobox, Popover and PreviewCard inherit the stronger structural edge through existing `border-border` styling. Outline/elevated Card, CardFrame and FramePanel inherit it where they already own a perimeter. No border was added to borderless Card/Frame variants. Popup radii, row geometry, collision/available dimensions, positioning transforms, portals and z-order are unchanged.
4. **Input result:** dark `--input` remains **`#6C6C75`**. Input, Select and Combobox retain their stronger 1px control boundary. Focus does not change border thickness or geometry; paired focused/resting Inputs have identical heights and border colors. The popup perimeter continues using `--border`, not `--input`.
5. **Focus rendering:** dark `--ring` remains **`#9699D6`**. Existing Phase 1–4 shell focus owners already use `outline: 2px solid var(--ring)` with `outline-offset: 2px`; their inner inputs do not draw another outline or focus shadow. The approved Command search retains its single ring-colored bottom separator, with no boxed InputGroup or outer palette outline. The remaining Tailwind ring treatment in ScrollArea's viewport was replaced with explicit `focus-visible:outline-solid`, `outline-2`, `outline-ring` and **inset `-outline-offset-2`**. The inset is necessary inside Command's clipped scroll container; an external outline would be clipped. Explicit solid style is necessary because Tailwind's resting `outline-none` otherwise leaves the focused outline hidden. Render assertions confirm a solid 2px line and `box-shadow: none`, including forced colors. No focus handlers or focus ownership logic changed. Future-phase component styles and protected Date/Time styles were audited but not modernized.
6. **Shadows:** no shadow adjustment was needed. The existing dark selection/overlay elevation remains `0 6px 18px rgb(0 0 0 / .2)`, directed downward. Command retains `shadow-lg/5` (5% black downward layers); dark Card/Frame elevation remains absent. The actual 1px border supplies edge definition independently of the shadow. No inset highlight, glow, extra border, pseudo-element or colored shadow was introduced. Date/Time's protected outer framing remains unchanged.
7. **Separators:** dark menu and selection separators, plus the resting Command search separator, use the existing border at 60% via local `color-mix`. This keeps internal dividers quieter than the new perimeter. Command's footer already used `border-border/60` and stays unchanged. Focus overrides the resting search separator with the ring color; forced colors uses Highlight. Light separator styling is unchanged. The standalone Separator component was not changed in this pass.
8. **Screenshots / visual review:** [before, dark](/private/tmp/baseui-v2-crispness/family-before-dark.png), [preferred candidate](/private/tmp/baseui-v2-crispness/family-candidate-dark.png), [final dark family](/private/tmp/baseui-v2-crispness/family-dark.png), [final light family](/private/tmp/baseui-v2-crispness/family-light.png), [actual dark Command dialog](/private/tmp/baseui-v2-crispness/command-dark.png), [focused overflow viewport](/private/tmp/baseui-v2-crispness/command-viewport-focus.png). The 1440 × 1280 family includes Command, DropdownMenu, Menubar, Select, Combobox, focused/resting Inputs, Popover over Card, CardFrame/FramePanel and PreviewCard. It uses real wrappers and an inline Command with the palette boundary for simultaneous family review; the separate Command capture uses the actual dialog. The final fresh CLI consumer uses a normal 16px root without website CSS. Captures and runnable harnesses are local review artifacts under `/private/tmp/baseui-v2-crispness`, not published assets.
9. **Behavior / visual regressions:** 26 focused border/focus assertions; 34 Command assertions; 100 Phase 4 menu/submenu/overlay assertions; 76 selection assertions; 23 supplementary overlay assertions; 58 control assertions; 11 supplementary control assertions. These exercise rendered geometry/state and real keyboard/pointer interaction, not class-string matching. Coverage includes filtering, IME guard, 100-command scrolling/footer, checkbox/radio persistence, disabled rejection, typeahead, submenu ArrowRight/Left and pointer corridor, focus return, nested Select/Combobox/Menu in Popover, actual 160/100ms lifecycle, reduced motion, forced colors, app/OS theme disagreement, RTL, 320/390/768/1440 widths and coarse targets. Production smoke results cover all three earlier phases and the Phase 4 docs; exact Date/Time popup geometry remains equal to the saved baselines. Time draft/Cancel/OK and the 390px mobile Dialog also pass. The existing 200% document-CSS-zoom positioning limitation is reproduced and recorded separately, not counted as a pass. Physical Safari/iOS/Android, native pinch/browser zoom and manual assistive-technology use are not certified by this desktop emulation.
10. **Tooling / consumer checks:** website and CLI TypeScript, strict consumer TypeScript, lint, theme generation/check and all eight theme fixture families, official registry/docs/preview generation, registry consistency (54 installables, 100 source occurrences, three identical copies), CLI build, CLI install fixtures, `build:all`, production build, and all **117 production HTTP routes** pass. Served registry bytes match generated files. CLI fixtures cover customized themes, partial/reverse installs and repeated init/add. Reinitialization correctly preserved the comparison fixture's old customized border; a separate fresh CSS init was checked to receive `#3D3D43`. No CLI preservation behavior was weakened to force the new default into existing themes. `git diff --check` passes.
11. **Scope / git:** 38 files changed relative to this pass's intake: four authored implementation sources (`scripts/theme-definition.json`, `scroll-area.tsx`, `overlay.styles.css`, `selection.styles.css`), this report, three generated theme outputs, and 30 officially generated registry copies (ten installables across three locations). [Exact list](/private/tmp/baseui-v2-crispness/correction-files.json). AST comparison confirms ScrollArea changed only JSX visual classes; 62 other protected files, including all other UI wrappers, Date/Time styles, package manifests, lockfile and `cn()`, match intake hashes. Current branch is `feature/design-system-v2`; HEAD is unchanged at `8b5735079694ada47671a0cfbbfd490f6ed81ae4`, with all five checkpoint commits in history. Total accumulated uncommitted state: **173 paths — 170 modified, 3 untracked, 0 staged**. The four additional dirty paths relative to the 169-path intake are ScrollArea and its three generated registry copies. [Full status](/private/tmp/baseui-v2-crispness/git-status.txt). Nothing was committed, pushed, merged, published or deployed.

## VISUAL SIMPLIFICATION CORRECTION

This is the preceding visual simplification record. The dark border/focus correction above updates its perimeter and scroll-viewport focus details. It supersedes the earlier visual treatments in this report while retaining the generic public theme, Base UI 1.9 APIs/behavior, accessibility fixes, class-based themes, copy-and-own distribution and current component geometry outside the explicitly corrected Command composition. All work remains **uncommitted** on `feature/design-system-v2`; HEAD remains `8b5735079694ada47671a0cfbbfd490f6ed81ae4`.

### Problem and reference review

The first V2 treatment combined too many signals: slate popup surfaces, stronger boundaries, selected fills, left navigation rails, a boxed Command InputGroup and the older Command panel/pseudo-element layers. Command consequently read as multiple nested controls. Its full-surface pseudo-element also washed out the non-positioned footer. The earlier V2 refinement did not remove that inherited layering.

The Command and DropdownMenu implementations at `6498255d5903f37225ba765fbd7e6c3c892717c9` were inspected and rebuilt in an isolated comparison. This is an actual checkpoint-source reproduction using the installed Base UI 1.9 runtime, not a blind source restoration or a claim of an original historical browser capture. The three comparisons use the same 900 × 700 viewport, 560px Command width, content, dark mode and keyboard-focused search. No additional palette A/B/C architecture experiment was introduced.

| Version                      | Visual conclusion                                                                                                                                                                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pre-Phase-3 reference        | Cleaner neutral rows and no highlight rails. Its reproduced search was narrow/boxed on focus, and its inherited footer remained too dim; those weaknesses were not restored.                                                                      |
| First V2 / correction intake | Larger slate surfaces, a full-width boxed search with its own outline, an independently bordered/rounded result panel, and left rails made the layering more conspicuous.                                                                         |
| Corrected                    | One continuous neutral surface, integrated full-width search, plain highlighted rows and a readable footer. It is closer to the reference's clean row language while retaining V2 type/spacing and improving its search/focus/footer composition. |

Dark Command captures: [reference](/private/tmp/baseui-v2-correction/command-old-dark.png), [first V2](/private/tmp/baseui-v2-correction/command-first-v2-dark.png), [corrected](/private/tmp/baseui-v2-correction/command-corrected-dark.png). Matching DropdownMenu captures: [reference](/private/tmp/baseui-v2-correction/menu-old-dark.png), [first V2](/private/tmp/baseui-v2-correction/menu-first-v2-dark.png), [corrected](/private/tmp/baseui-v2-correction/menu-corrected-dark.png).

### Command correction

- Removed the result panel's extra border, background, rounded sub-card, shadow, negative-margin construction and decorative pseudo-element classes. It is now a transparent flex body within the palette.
- Removed the popup's full-surface pseudo-element. Its existing outer boundary/radius remain the single frame; the footer is no longer visually covered by that layer.
- Reused the existing Command search scope to remove the nested InputGroup border, background, corner rounding, outline and shadow. The input remains an Autocomplete input with its existing filtering, refs and autofocus behavior.
- The existing search-row separator changes to `ring` when the native input is focus-visible. This is the sole search focus cue: no inner rounded ring and no additional outer palette outline. Forced colors uses system Highlight on that same separator. The search row remains 56px in the tested 16px consumer.
- Normal row highlight is only `bg-muted`; there is no rail, inset outline, shadow, underline or persistent chromatic state. Group labels stay small/muted, labels use normal foreground, and shortcuts remain readable muted metadata.
- Footer text uses full-opacity `muted-foreground`, with one subtle separator and no obscuring overlay. Its measured text contrast is **5.79:1 light / 7.37:1 dark**. Search focus contrast against the palette is **4.05:1 / 6.33:1**. These are specific tested pairs, not a library-wide certification.

Backdrop/viewport behavior, primitive Root/Portal/Popup APIs, controlled/uncontrolled state, filtering, keyboard handlers, focus return, nesting transforms and existing modal timing remain. The changed Command TSX differs only in JSX visual classes and formatting; no logic/prop/API change is hidden in the correction. The body flex adjustment preserves internal list scrolling and a reachable footer with 100 commands. No Dialog/AlertDialog/Drawer modernization or other Phase 5 work is included.

### Menus and selection correction

DropdownMenu and Menubar items have no normal-state left rail, including destructive highlight and submenu-open states. A normal highlighted/open row uses a simple neutral background with normal foreground. Menu checkbox/radio items retain their real persistent check and Iris marker color; their resting accent fill is removed. A checked highlighted row combines that check with the same neutral highlight. Destructive text and its restrained destructive highlight remain, without a rail. Menu labels use regular readable weight; desktop/coarse row geometry is unchanged.

Select and Combobox likewise use the persistent check as their main selected signal. Removed the selected tint, selected bold treatment and navigation rail. Selected plus highlighted is a check on the ordinary neutral highlight. Autocomplete and Command retain transient-only highlighting. Menubar's open-trigger Iris underline and submenu-open chromatic chevron treatment are removed. No replacement marker, state bar, pseudo-element or public token is added.

Checkbox, Radio, Switch and Toggle retain their useful small-control Iris persistence. Their control geometry, behavior and targets are unchanged. Existing forced-color keyboard outlines are retained where neutral background differences are unavailable; the old forced-color selected-option left border is removed, with the native persistent check remaining.

### Neutral dark hierarchy

The existing generic variables are tuned directly. Surface channel differences are now small, rather than a pervasive blue-gray tint. Accent is restrained and primarily used by small persistent controls, chips and check indicators; transient rows do not use it.

| Variable                           | First V2 dark         | Corrected dark        |
| ---------------------------------- | --------------------- | --------------------- |
| `background`                       | `#111318`             | `#101011`             |
| `card`                             | `#191C23`             | `#171718`             |
| `popover`                          | `#252A34`             | `#1C1C1F`             |
| `muted`                            | `#272C35`             | `#29292D`             |
| `secondary`                        | `#303746`             | `#303034`             |
| `border`                           | `#414957`             | `#303034`             |
| `input`                            | `#788497`             | `#6C6C75`             |
| `foreground` / surface foregrounds | `#EEF0F5`             | `#EEEEEF`             |
| `muted-foreground`                 | `#A9B1C0`             | `#AAAAB3`             |
| `primary` / foreground             | `#E6E8EE` / `#191C23` | `#E7E7EA` / `#18181A` |
| `accent`                           | `#2C304B`             | `#25252E`             |
| `accent-foreground`                | `#A8AEFF`             | unchanged             |
| `ring`                             | `#AAB5FF`             | `#9699D6`             |

Light hover becomes neutral `#F4F4F5`, with a quieter `#DEDEE3` structural border. Light primary, accent/check and focus colors otherwise remain. The theming example is updated to the actual corrected dark defaults. There are still **26 familiar public theme variables and zero public `--cn-*` variables**; `cn()` is unchanged.

### Visual review

The required five-component review was performed in [dark](/private/tmp/baseui-v2-correction/family-dark.png) and [light](/private/tmp/baseui-v2-correction/family-light.png). These use real existing components with minimal, unbordered specimen framing; only the Command's actual palette container has its necessary boundary. Additional corrected [light Command](/private/tmp/baseui-v2-correction/command-corrected-light.png) and [light DropdownMenu](/private/tmp/baseui-v2-correction/menu-corrected-light.png) captures are retained.

The corrected set is simpler to scan, uses fewer simultaneous signals, and has a neutral dark hierarchy. Command reads as one integrated palette. Keyboard highlight is visible through a plain background; persistent checks distinguish values without tint/rail combinations. There are no normal row rails or state bars. No gradients, glass, glows, colored shadows, decorative dots, animated bars or oversized pills were introduced. The existing backdrop and popup motion mechanics are preserved.

All comparison sources/entries/styles remain under `/private/tmp/baseui-v2-correction/`; none is a shipping route, component or registry experiment. The original Phase 4 specimen and existing documentation examples inherit the corrected components.

### Validation and scope

| Validation                | Result                                                                                                                                                                                                                                                                                                                                                          |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Focused Command           | **34 PASS**: integrated transparent search, single focus cue, neutral undecorated highlight, footer contrast, filtering/group replacement, Enter callback, empty/query clearing, arrows/active descendant, IME guard, Escape/focus return/reopening, 320/390/768/1440px fine/coarse geometry, forced colors and 100-command keyboard scroll/footer containment. |
| Selection/search          | **76 PASS**, including controlled/async/filter/clear/chip/form/IME behavior, persistent checks, plain transient highlight, large-list navigation and the independent Autocomplete frame.                                                                                                                                                                        |
| Phase 4                   | **100 PASS**: menu choices, typeahead, nested submenus, Menubar switching, focus return, legitimate nested controls, class/OS themes and responsive/coarse targets.                                                                                                                                                                                             |
| Runtime/motion            | **23 PASS**: actual 160ms/100ms lifecycle events, delay-provider handoff, pointer corridors, interactive PreviewCard/long content, touch submenu entry, available-size bounds and forced-color navigation. The pre-existing document CSS-zoom limitation remains separately documented; no workaround is added.                                                 |
| Earlier controls          | **58 + 11 PASS**: control states, keyboard/native form behavior, exact size aliases, loading visibility, joined controls and real coarse targets.                                                                                                                                                                                                               |
| Production browser review | Light/dark and persisted OS/app disagreement checks pass, with retained heading anchors and Phase 1–4 smoke review.                                                                                                                                                                                                                                             |
| Date Picker               | Exact protected geometry, caption outline, month/year switching and range continuity pass; popup remains 245 × 272.5px in the captured baseline.                                                                                                                                                                                                                |
| Time Picker               | Exact input/clock/list/action geometry, draft preview, Cancel rollback, OK commit and mobile Dialog relationship pass; popup remains 252 × 418.75px.                                                                                                                                                                                                            |
| Repository checks         | PASS: theme check/fixtures, www and CLI TypeScript, strict fresh-consumer TypeScript, lint, official registry/docs generation, registry consistency, CLI fixtures, CLI build and production build.                                                                                                                                                              |
| Routes/docs               | **117 PASS**, with served registry/source byte parity, 54 installables / 100 embedded occurrences, 54 docs and 311 previews. No URLs/catalog/SEO restructuring.                                                                                                                                                                                                 |
| Source scope              | **58 protected files** are byte-unchanged, including all other UI wrappers, `cn()`, picker styles, package manifests and lockfile. All five changed wrappers have identical normalized behavior ASTs after excluding JSX `className` attributes and formatting. Runtime checks independently cover the affected behavior.                                       |
| Whitespace/status         | `git diff --check` PASS. 40 files changed in this correction; 169 total current uncommitted files. Nothing staged or committed. Branch/HEAD and all checkpoint history remain unchanged.                                                                                                                                                                        |

Physical Safari/iOS/Android, virtual keyboards, physical touch, native browser-chrome zoom and manual assistive-technology certification remain unverified. CDP touch/media tests are simulations. No push, merge, publish, deploy, version bump or Phase 5 work occurred.

Evidence is retained at `/private/tmp/baseui-v2-correction/`: checkpoint/current comparison sources and captures, `comparison-results.json`, `command-results.json`, `browser-results.json`, `selection-evidence/`, `controls-evidence/`, `extra-results.json`, production/picker logs and JSON, `routes.json`, `scope-review.json`, `correction-files.json`, and final type/lint/theme/CLI/registry/build logs. The fresh CLI consumer is separate from the docs-root comparison fixtures and imports no website globals. npm installation is stubbed offline, with installed workspace dependencies supplying runtime modules; this is not a published-registry/network install claim.

Files changed in this correction, relative to its 169-file intake:

- `apps/www/app/docs/theming/page.tsx`
- `apps/www/components/ui/combobox.tsx`
- `apps/www/components/ui/command.tsx`
- `apps/www/components/ui/dropdown-menu.tsx`
- `apps/www/components/ui/menubar.tsx`
- `apps/www/components/ui/select.tsx`
- `apps/www/lib/__generated__/theme.json`
- `apps/www/public/registry/autocomplete.json`
- `apps/www/public/registry/combobox.json`
- `apps/www/public/registry/command.json`
- `apps/www/public/registry/dropdown-menu.json`
- `apps/www/public/registry/menubar.json`
- `apps/www/public/registry/popover.json`
- `apps/www/public/registry/preview-card.json`
- `apps/www/public/registry/select.json`
- `apps/www/public/registry/tooltip.json`
- `apps/www/styles/overlay.styles.css`
- `apps/www/styles/selection.styles.css`
- `apps/www/styles/theme.generated.css`
- `docs/design-system-v2-phase4-report.md`
- `packages/cli/registry/autocomplete.json`
- `packages/cli/registry/combobox.json`
- `packages/cli/registry/command.json`
- `packages/cli/registry/dropdown-menu.json`
- `packages/cli/registry/menubar.json`
- `packages/cli/registry/popover.json`
- `packages/cli/registry/preview-card.json`
- `packages/cli/registry/select.json`
- `packages/cli/registry/tooltip.json`
- `packages/cli/src/utils/theme.generated.ts`
- `packages/registry/registry/autocomplete.json`
- `packages/registry/registry/combobox.json`
- `packages/registry/registry/command.json`
- `packages/registry/registry/dropdown-menu.json`
- `packages/registry/registry/menubar.json`
- `packages/registry/registry/popover.json`
- `packages/registry/registry/preview-card.json`
- `packages/registry/registry/select.json`
- `packages/registry/registry/tooltip.json`
- `scripts/theme-definition.json`

The following earlier visual-refinement record is historical. Its architecture/theme simplification remains valid; its selected-fill, rail, focus and palette descriptions are superseded by the correction above.

## VISUAL STATE + PUBLIC THEME REFINEMENT

This section records the authorized refinement after the original Phase 4 implementation. It **supersedes the original record's theme, source-readability, file-count and validation descriptions** below. All work remains uncommitted on `feature/design-system-v2`; HEAD remains `8b5735079694ada47671a0cfbbfd490f6ed81ae4`. No prior checkpoint, package version, dependency, lockfile, or later-phase component implementation is changed.

### 1. A/B/C comparison and selection

**Selected: A — Graphite + Iris.** Six matching 1440 × 1200 captures were made before changing production theme defaults. The isolated consumer used real Button/Input, Checkbox/Radio/Switch/Toggle/ToggleGroup, Select/Combobox/chips/Command, and DropdownMenu/Menubar wrappers. Persistent states use real controlled values; transient highlight/open attributes are projected in this temporary visual lab to hold matching comparison states. Actual interaction acceptance is separate and uses real keyboard, pointer and touch events.

A keeps the graphite primary and quiet neutral hover while making persistent selection recognizable through a soft Iris tint and precise marker. B is clear and accessible but reads more conventionally blue. C is calm but its nearly neutral selected surface is too close to highlight, particularly in dark menus. A best matches the requested preference without filling ordinary actions with chromatic color.

| Evaluation criterion            | Comparison and decision                                                                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modern without trend dependence | A uses restrained state details; no gradient, glow, bright pill or animated ornament.                                                             |
| Recognizable identity           | A's Iris check/marker differentiates persistent state more than B's conventional blue or C's neutral fill.                                        |
| SaaS suitability                | A combines readable dense rows with neutral primary actions.                                                                                      |
| Dense dashboard suitability     | C is quietest, but A communicates simultaneous checked/highlighted states more clearly.                                                           |
| Marketing/product suitability   | A's small colored details coexist with graphite actions and neutral form surfaces.                                                                |
| Graphite primary compatibility  | All three work; A adds identity without changing primary to purple.                                                                               |
| Selected versus highlighted     | A's selected tint plus marker separates them better than C. B is also clear.                                                                      |
| Focus versus selection          | A uses independent `ring` and `accent-foreground`, with a complete focus contour versus a persistent check/marker.                                |
| Dark-mode quality               | A retains popup hierarchy without muddy full-row saturation; C's selected fill is too similar to neutral highlight.                               |
| Accessibility                   | Initial A/C light markers measured 4.29:1 / 4.25:1 on their fills; B measured 4.91:1. A's foreground was deepened slightly to reach 4.60:1.       |
| Calmness at high density        | A remains restrained across simultaneous menu, selection, toggle and form states.                                                                 |
| Avoid obvious derivation        | A's graphite/Iris balance provides a coherent identity beyond a primary-colored default theme. This is a visual judgment, not a uniqueness claim. |
| Easy normal-variable theming    | The final implementation uses the same generic variables for all directions; no palette subsystem is required.                                    |
| Future template suitability     | A supports neutral dashboards and product/marketing composition without source forks. Future components adopt it in their own phases.             |

Comparison captures: [A light](/private/tmp/baseui-v2-refinement/study-A-light.png), [A dark](/private/tmp/baseui-v2-refinement/study-A-dark.png), [B light](/private/tmp/baseui-v2-refinement/study-B-light.png), [B dark](/private/tmp/baseui-v2-refinement/study-B-dark.png), [C light](/private/tmp/baseui-v2-refinement/study-C-light.png), [C dark](/private/tmp/baseui-v2-refinement/study-C-dark.png). Each includes a realistic form/menu/select composition with multiple states visible. The final implementation is captured separately in [light](/private/tmp/baseui-v2-refinement/final-iris-light.png) and [dark](/private/tmp/baseui-v2-refinement/final-iris-dark.png).

### 2. Final palette and state language

The supplied starting palette is retained except for the light persistent foreground, deepened from `#5E65D8` to `#5961CF` after contrast measurement. Colors remain complete hex values, consistent with the existing canonical theme-definition format.

| Role / public variable                         | Light     | Dark      |
| ---------------------------------------------- | --------- | --------- |
| Neutral hover/highlight — `--muted`            | `#F3F5F9` | `#272C35` |
| Stronger neutral feedback — `--secondary`      | `#E8ECF4` | `#303746` |
| Persistent selection — `--accent`              | `#EFF0FF` | `#2C304B` |
| Persistent marker/text — `--accent-foreground` | `#5961CF` | `#A8AEFF` |
| Independent keyboard focus — `--ring`          | `#6673E8` | `#AAB5FF` |
| Graphite primary — `--primary`                 | `#25272C` | `#E6E8EE` |
| Primary foreground                             | `#FFFFFF` | `#191C23` |

Checkbox uses a soft accent fill with Iris border/check. Radio uses an Iris dot/boundary. Switch uses an Iris track with a contrasting neutral thumb; its small track is the deliberate solid-color exception. Toggle/ToggleGroup use accent fill/text plus a precise inset marker. Select/Combobox retain neutral selected text and an Iris check. Chips keep neutral text on the soft tint. Menu choices use soft tint plus Iris checks; normal action highlight stays neutral. Menubar's open trigger remains quiet, with a small Iris underline rather than a filled bright pill. Destructive states use only destructive red roles.

Selected plus highlighted retains selected fill/marker and the neutral navigation edge. Autocomplete/Command expose transient highlight only; no persistent value, checked flag or selected attribute is fabricated. Focus uses the complete independent `ring` contour. Disabled persistent states keep their real indicator but use neutral disabled treatment.

### 3. Final public theme contract

**Public `--cn-*` variables: 54 before → 0 after. Category C: empty.** The final schema has 26 variables: the requested 20 familiar hooks plus the existing six success/warning/info hooks. There is no selection-specific public token and no replacement branded color namespace.

```css
--background; --foreground;
--card; --card-foreground;
--popover; --popover-foreground;
--primary; --primary-foreground;
--secondary; --secondary-foreground;
--muted; --muted-foreground;
--accent; --accent-foreground;
--destructive; --destructive-foreground;
--border; --input; --ring; --radius;
--success; --success-foreground;
--warning; --warning-foreground;
--info; --info-foreground;
```

`cn()` is unchanged. Existing generic theme hooks remain compatible. The unpublished V2 aliases and their generated defaults are removed. Theme installation preserves existing declarations, including unknown consumer properties, rather than deleting or overwriting them. Root overrides are not silently shadowed by newly injected dark defaults.

Private geometry is not advertised as theme API. The docs retain a 14px root and their legacy picker radius through the private `--component-unit` / `--control-radius` adapters. Consumer styles default directly to `.0625rem` units and the public `--radius`; those private adapters are not emitted by CLI theme generation. Item/card/frame corners are local calculations. Popup elevation is local to the popup stylesheet, including its class-driven dark value. Durations/easing are owned CSS constants. Unused spatial/modal/control tokens are deleted rather than retained speculatively.

The audit below classifies every old public V2 variable. A means replacement by an existing semantic hook, standard utility or removal of an unused role. B means the public role is removed and its necessary geometry/elevation remains local implementation. There are 12 B classifications and 42 A classifications. No public V2-specific hook remains. Contextual source uses `card-foreground` / `popover-foreground` when it owns those surfaces, rather than blindly substituting global foreground everywhere.

| Old public token                     | Class | Final destination                                                                            |
| ------------------------------------ | ----- | -------------------------------------------------------------------------------------------- |
| `--cn-border`                        | A     | `var(--border)`                                                                              |
| `--cn-border-active`                 | A     | `color-mix(in oklab, var(--input) 60%, var(--foreground))`                                   |
| `--cn-border-control`                | A     | `var(--input)`                                                                               |
| `--cn-border-disabled`               | A     | `var(--border)`                                                                              |
| `--cn-border-hover`                  | A     | `color-mix(in oklab, var(--input) 75%, var(--foreground))`                                   |
| `--cn-border-subtle`                 | A     | `var(--border)`                                                                              |
| `--cn-duration-fast`                 | B     | `100ms`                                                                                      |
| `--cn-duration-popup`                | B     | `160ms`                                                                                      |
| `--cn-duration-spatial`              | A     | Removed; unused                                                                              |
| `--cn-ease-enter`                    | B     | `cubic-bezier(.16,1,.3,1)`                                                                   |
| `--cn-ease-exit`                     | B     | `cubic-bezier(.4,0,1,1)`                                                                     |
| `--cn-ease-standard`                 | B     | `cubic-bezier(.2,0,0,1)`                                                                     |
| `--cn-focus-color`                   | A     | `var(--ring)`                                                                                |
| `--cn-primary`                       | A     | `var(--primary)`                                                                             |
| `--cn-primary-foreground`            | A     | `var(--primary-foreground)`                                                                  |
| `--cn-primary-hover`                 | A     | `hover:bg-primary/90` and local semantic mixes                                               |
| `--cn-primary-pressed`               | A     | `active:bg-primary/95` and neutral interaction utilities                                     |
| `--cn-radius-card`                   | B     | `max(0px, calc(var(--control-radius, var(--radius)) + 4 * var(--component-unit, .0625rem)))` |
| `--cn-radius-control`                | B     | `var(--control-radius, var(--radius))`                                                       |
| `--cn-radius-frame`                  | B     | `max(0px, calc(var(--control-radius, var(--radius)) + 6 * var(--component-unit, .0625rem)))` |
| `--cn-radius-item`                   | B     | `max(0px, calc(var(--control-radius, var(--radius)) - 2 * var(--component-unit, .0625rem)))` |
| `--cn-shadow-card`                   | B     | `0 1px 2px rgb(17 24 39 / .04)`                                                              |
| `--cn-shadow-control`                | A     | Removed; unused                                                                              |
| `--cn-shadow-modal`                  | A     | Removed; unused (no Phase 5 implementation)                                                  |
| `--cn-shadow-popup`                  | B     | `var(--popup-shadow)`                                                                        |
| `--cn-status-destructive-border`     | A     | `var(--destructive)`                                                                         |
| `--cn-status-destructive-foreground` | A     | `var(--destructive-foreground)`                                                              |
| `--cn-status-destructive-surface`    | A     | `bg-destructive/10` / local mixes of `--destructive`                                         |
| `--cn-status-destructive-text`       | A     | `var(--destructive)`                                                                         |
| `--cn-status-info-border`            | A     | `var(--info)`                                                                                |
| `--cn-status-info-foreground`        | A     | `var(--info-foreground)`                                                                     |
| `--cn-status-info-surface`           | A     | `color-mix(in srgb, var(--info) 10%, var(--card))`                                           |
| `--cn-status-info-text`              | A     | `var(--info)`                                                                                |
| `--cn-status-success-border`         | A     | `var(--success)`                                                                             |
| `--cn-status-success-foreground`     | A     | `var(--success-foreground)`                                                                  |
| `--cn-status-success-surface`        | A     | `color-mix(in srgb, var(--success) 10%, var(--card))`                                        |
| `--cn-status-success-text`           | A     | `var(--success)`                                                                             |
| `--cn-status-warning-border`         | A     | `var(--warning)`                                                                             |
| `--cn-status-warning-foreground`     | A     | `var(--warning-foreground)`                                                                  |
| `--cn-status-warning-surface`        | A     | `color-mix(in srgb, var(--warning) 10%, var(--card))`                                        |
| `--cn-status-warning-text`           | A     | `var(--warning)`                                                                             |
| `--cn-surface`                       | A     | `var(--card)`                                                                                |
| `--cn-surface-disabled`              | A     | `var(--muted)`                                                                               |
| `--cn-surface-hover`                 | A     | `var(--muted)`                                                                               |
| `--cn-surface-muted`                 | A     | `var(--muted)`                                                                               |
| `--cn-surface-page`                  | A     | `var(--background)`                                                                          |
| `--cn-surface-popup`                 | A     | `var(--popover)`                                                                             |
| `--cn-surface-pressed`               | A     | `var(--secondary)`                                                                           |
| `--cn-surface-raised`                | A     | `var(--card)`                                                                                |
| `--cn-surface-selected`              | A     | `var(--accent)`                                                                              |
| `--cn-text`                          | A     | `var(--foreground)`                                                                          |
| `--cn-text-disabled`                 | A     | `var(--muted-foreground)`                                                                    |
| `--cn-text-muted`                    | A     | `var(--muted-foreground)`                                                                    |
| `--cn-unit`                          | B     | `var(--component-unit, .0625rem)`                                                            |

### 4. Affected families and readable copied sources

| Family  | Affected implementation                                                                                                                                                                                                                                                         |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phase 1 | Button, Input, Textarea, InputGroup, Label, Badge, Avatar, Separator, Card and Frame. Theme consumers move to generic roles; action/input colors are visible in source. Sizes, aliases, refs, loading, composite focus and nested surface geometry remain.                      |
| Phase 2 | Field/Form/Fieldset, Checkbox/CheckboxGroup, Radio, Switch, NumberField, Slider, OTP and Toggle/ToggleGroup. Persistent choice colors change intentionally; validation, native values, readonly/disabled rejection, scalar/range behavior, OTP flow and target geometry remain. |
| Phase 3 | Select, Autocomplete, Combobox and Command content. Selection tint/checks are distinct from transient highlight; chip geometry and async/filter/form behavior remain. Autocomplete explicitly declares its popup surface/boundary. Command's modal shell is unchanged.          |
| Phase 4 | Popover, Tooltip, PreviewCard, DropdownMenu and Menubar. Source-visible frames and menu states replace ordinary color indirection. Positioning, description wiring, lifecycle, delays, nesting and keyboard mechanics remain.                                                   |

Representative review:

| Copied source | Main styling now visible there                                                                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Button        | CVA variants use `bg-primary`, `text-primary-foreground`, `border-input`, neutral hover/press and semantic destructive/warning utilities. CSS owns measured sizes/icons/focus containment. |
| Input         | `border-input bg-background text-foreground`; shared CSS owns complex parent/child validation, disabled/readonly and the sole input-focus contour.                                         |
| Checkbox      | Explicit checked/indeterminate accent, invalid, disabled and focus utilities. Combined-state precedence is visible rather than hidden behind global theme aliases.                         |
| Toggle        | `data-[pressed]:bg-accent`, accent foreground and inset marker; joined geometry stays CSS-owned.                                                                                           |
| Select        | Visible trigger colors, neutral highlight, accent selection and accent check; item-aligned geometry exception remains.                                                                     |
| Combobox      | Visible row/chip colors and real indicator slots; input composition, async callbacks, filtering and chips remain primitive-owned.                                                          |
| Popover       | `border-border bg-popover text-popover-foreground`; shared CSS owns bounds, frame geometry and lifecycle motion.                                                                           |
| DropdownMenu  | Visible highlight/checked/destructive/disabled utilities and marker roles; CSS owns row/slot geometry and navigation containment.                                                          |

For example, Select previously required reading `cn-selection-item` → shared CSS → `--cn-surface-selected` → generated values. It now shows the normal roles directly:

```tsx
// Before
className={cn("cn-selection-item", className)}

// After: layout is private; ordinary state colors are familiar.
className={cn(
  "selection-item-layout group/option text-popover-foreground",
  "data-[highlighted]:bg-muted data-[selected]:bg-accent",
  "data-[selected]:data-[highlighted]:bg-accent",
  className
)}
// Its check slot uses text-accent-foreground.
```

Defined migrated anatomy classes now describe layout and contain no `cn-*` styling prefix. Unused markers on default variants, Autocomplete, Menubar and Command content are removed. No universal runtime popup/state abstraction is added. The existing `cn()` implementation and its public utility path are byte-unchanged. Private layout names avoid Tailwind color-family names so class merging does not discard the input shell. Browser checks specifically verify that shell's focus ownership.

### 5. Theme/CLI and documentation simplification

The canonical generator now distributes the generic defaults directly to docs, CLI and the generated theming example. Redundant aliases, public radii/elevation/motion roles and V2-only matrices are gone. The theming page teaches `accent`/foreground for persistent selection, `ring` for focus and `primary`/foreground for actions, with independent light/dark examples.

All 33 affected registry installables are regenerated in their public/package/CLI copies, including the two picker stylesheets' neutral-hover safeguards. Recursive stylesheet/component/helper closure remains valid. Real CLI fixtures pass fresh/reverse, customized, partial, incremental and repeated add/init scenarios. Normal 16px-root consumers render without website globals. Generic `--accent`, `--ring` and `--primary` changes are browser-verified independently, followed by a complete custom green palette; [custom consumer capture](/private/tmp/baseui-v2-refinement/consumer-custom-generic.png).

npm installation remains stubbed offline in these distribution fixtures, with existing workspace modules providing runtime dependencies. These results do not claim a published-registry/network installation. No package or schema-version bump is introduced.

### 6. Rendered contrast and theme evidence

| Measured pair                           | Light   | Dark    |
| --------------------------------------- | ------- | ------- |
| Accent foreground / accent              | 4.60:1  | 6.23:1  |
| Selected neutral text / accent          | 13.76:1 | 11.29:1 |
| Toggle selected text / accent           | 4.60:1  | 6.23:1  |
| Focus / input surface                   | 3.85:1  | 9.52:1  |
| Focus / accent surface                  | 3.58:1  | 6.60:1  |
| Checked-disabled marker / muted surface | 5.30:1  | 6.50:1  |
| Destructive text / resting popup        | 6.48:1  | 7.29:1  |
| Destructive text / highlighted surface  | 5.53:1  | 6.01:1  |

Values come from real computed styles; alpha destructive fills are composited through browser canvas pixels. Dark accent/popup luminance separation is intentionally subtle (1.12:1); persistent markers/checks, neutral text, boundaries and the navigation edge carry the state distinction. No minimum text-contrast claim is assigned to a decorative fill alone. These measurements are specific tested pairs, not a library-wide WCAG certification.

Both app-light/OS-dark and app-dark/OS-light pass, including actual persisted production theme choices. No component `prefers-color-scheme` rule is introduced. Reduced motion and forced-color navigation remain supported. Primary actions remain independent of the Iris selection palette.

### 7. Regression and final validation

| Check             | Result                                                                                                                                                                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Phase 1           | Light/dark production smoke for all requested families; all eleven Button aliases retain exact height/square icon geometry; loading spinner remains visible and disabled treatment remains readable.                                                               |
| Phase 2           | 58 control assertions and 11 supplementary geometry/state assertions pass: validation/native submission, checked/readonly/disabled behavior, keyboard traversal, scalar/range Slider, NumberField, OTP, toggles, joined separators and coarse targets.             |
| Phase 3           | 76 selection/search assertions pass, including the explicit Autocomplete frame check, controlled/async/filter/clear/chip/form/IME guards, 500-item navigation and bounded scrolling. No persistent Autocomplete/Command selection is added.                        |
| Phase 4           | 100 primary assertions and 23 supplementary runtime checks pass: described Tooltip, delay-group handoff, PreviewCard pointer travel/long content, menus/submenus, Menubar, focus return, nested controls, actual 160ms enter/100ms exit events and reduced motion. |
| Final theme       | 16 additional rendered theme/contrast/customization assertions pass.                                                                                                                                                                                               |
| Responsive/coarse | 320/390/768px and desktop pass. Real 44px actions/rows, chip remove targets and independent joined boxes remain. Actual CDP touch events open bounded submenus; no Drawer conversion.                                                                              |
| Date Picker       | Exact caption/nav 24.5px, July width 88.125px, 7px insets, 5.25px gap, 12.25px chevron, 28px days and 33.25px month/year buttons; complete 2px/2px caption focus, view switching and range continuity pass. Popup remains 245 × 272.5px.                           |
| Time Picker       | Exact protected input/clock/list/action geometry, 33.5px default input and 238px clock; draft preview, Cancel rollback, OK commit and 390px mobile Dialog relationship pass. Popup remains 252 × 418.75px.                                                         |
| Picker scope      | Picker TSX and Dialog source are byte-unchanged. Local hover/current aliases stay neutral instead of inheriting Iris accent. Generic foundation colors intentionally flow through the existing picker theme hooks; no geometry or selection-model redesign.        |
| TypeScript/lint   | PASS: www and CLI `tsc --noEmit`, strict copied-consumer compilation, production type checking and lint with no warnings/errors.                                                                                                                                   |
| Theme/consumer    | PASS: generated theme check, eight merge/idempotence fixtures, full CLI fixtures, custom values and direct generic-variable browser tests.                                                                                                                         |
| Registry/builds   | PASS: official `build:all`, CLI CJS/declaration build, production build (60 pages), 54 installables / 100 embedded occurrences and identical source/public/package/CLI registry content.                                                                           |
| Routes/docs       | PASS: 117 HTTP checks, registry-byte parity, retained heading anchors, 54 generated docs and 311 preview sources.                                                                                                                                                  |
| Protected scope   | 34 protected files, including all 25 unmigrated UI wrappers, package manifests/lockfile, `cn()` and earlier V2 documents, are byte-unchanged. Command modal shell/panel/footer sections are byte-unchanged.                                                        |
| Whitespace/status | PASS: `git diff --check`. 162 files changed in this refinement; 169 total current uncommitted files. Original branch/HEAD/checkpoints remain. No stage/commit/push/merge/publish/deploy/version bump/Phase 5.                                                      |

The earlier document CSS-zoom positioning limitation remains documented and reproduces after refinement; no speculative workaround is added. Native browser-chrome zoom, physical iOS/Safari/Android, virtual keyboards, real touch hardware and manual assistive-technology certification remain unverified. Emulated touch/media and CSS zoom are explicitly simulations.

### 8. Evidence, cleanup and changed-file inventory

All comparison components/styles/entries exist only under `/private/tmp/baseui-v2-refinement/`; **no temporary route, component, comparison stylesheet or experimental palette ships in the repository or registry**. Existing useful Input/Field/Select/Popover system specimens remain. The six A/B/C captures, final family captures and reproducible lab/consumer scripts are retained there.

Key evidence: `token-audit.json`, `token-consumers-before.json`, `study-results.json`, `theme-browser-results.json`, `controls-evidence/`, `selection-evidence/`, `browser-results.json`, `extra-results.json`, `docs-qa-final.log`, picker geometry/baselines, `routes.json`, `protected-files.json`, `refinement-files.json`, and the final build/type/lint/theme/CLI/registry logs. The final family captures are generated from real installed components with layout-only temporary framing; they do not apply comparison color overrides.

The local production specimen is [Popover → System specimen](http://localhost:3111/docs/components/popover#system-specimen); the simplified theme documentation is [Theming](http://localhost:3111/docs/theming). These are review servers, not deployments.

Files changed **during this refinement** (relative to the 32-file Phase 4 intake):

- `apps/www/app/docs/theming/page.tsx`
- `apps/www/components/previews/input-previews.tsx`
- `apps/www/components/previews/otp-field-previews.tsx`
- `apps/www/components/previews/phase2-system-preview.tsx`
- `apps/www/components/ui/autocomplete.tsx`
- `apps/www/components/ui/avatar.tsx`
- `apps/www/components/ui/badge.tsx`
- `apps/www/components/ui/button.tsx`
- `apps/www/components/ui/card.tsx`
- `apps/www/components/ui/checkbox-group.tsx`
- `apps/www/components/ui/checkbox.tsx`
- `apps/www/components/ui/combobox.tsx`
- `apps/www/components/ui/command.tsx`
- `apps/www/components/ui/dropdown-menu.tsx`
- `apps/www/components/ui/field.tsx`
- `apps/www/components/ui/fieldset.tsx`
- `apps/www/components/ui/form.tsx`
- `apps/www/components/ui/frame.tsx`
- `apps/www/components/ui/input-group.tsx`
- `apps/www/components/ui/input.tsx`
- `apps/www/components/ui/label.tsx`
- `apps/www/components/ui/menubar.tsx`
- `apps/www/components/ui/number-field.tsx`
- `apps/www/components/ui/otp-field.tsx`
- `apps/www/components/ui/popover.tsx`
- `apps/www/components/ui/preview-card.tsx`
- `apps/www/components/ui/radio-group.tsx`
- `apps/www/components/ui/select.tsx`
- `apps/www/components/ui/separator.tsx`
- `apps/www/components/ui/slider.tsx`
- `apps/www/components/ui/switch.tsx`
- `apps/www/components/ui/textarea.tsx`
- `apps/www/components/ui/toggle-group.tsx`
- `apps/www/components/ui/toggle.tsx`
- `apps/www/components/ui/tooltip.tsx`
- `apps/www/content/docs/components/otp-field.mdx`
- `apps/www/lib/__generated__/docs-markdown.json`
- `apps/www/lib/__generated__/preview-sources.json`
- `apps/www/lib/__generated__/theme.json`
- `apps/www/public/registry/autocomplete.json`
- `apps/www/public/registry/avatar.json`
- `apps/www/public/registry/badge.json`
- `apps/www/public/registry/button.json`
- `apps/www/public/registry/card.json`
- `apps/www/public/registry/checkbox-group.json`
- `apps/www/public/registry/checkbox.json`
- `apps/www/public/registry/combobox.json`
- `apps/www/public/registry/command.json`
- `apps/www/public/registry/date-picker.json`
- `apps/www/public/registry/dropdown-menu.json`
- `apps/www/public/registry/field.json`
- `apps/www/public/registry/fieldset.json`
- `apps/www/public/registry/form.json`
- `apps/www/public/registry/frame.json`
- `apps/www/public/registry/input-group.json`
- `apps/www/public/registry/input.json`
- `apps/www/public/registry/label.json`
- `apps/www/public/registry/menubar.json`
- `apps/www/public/registry/number-field.json`
- `apps/www/public/registry/otp-field.json`
- `apps/www/public/registry/popover.json`
- `apps/www/public/registry/preview-card.json`
- `apps/www/public/registry/radio-group.json`
- `apps/www/public/registry/select.json`
- `apps/www/public/registry/separator.json`
- `apps/www/public/registry/slider.json`
- `apps/www/public/registry/switch.json`
- `apps/www/public/registry/textarea.json`
- `apps/www/public/registry/time-picker.json`
- `apps/www/public/registry/toggle-group.json`
- `apps/www/public/registry/toggle.json`
- `apps/www/public/registry/tooltip.json`
- `apps/www/styles/avatar.styles.css`
- `apps/www/styles/badge.styles.css`
- `apps/www/styles/button.styles.css`
- `apps/www/styles/choice-control.styles.css`
- `apps/www/styles/date-picker.styles.css`
- `apps/www/styles/form.styles.css`
- `apps/www/styles/globals.css`
- `apps/www/styles/number-field.styles.css`
- `apps/www/styles/otp-field.styles.css`
- `apps/www/styles/overlay.styles.css`
- `apps/www/styles/selection.styles.css`
- `apps/www/styles/slider.styles.css`
- `apps/www/styles/surface.styles.css`
- `apps/www/styles/text-control.styles.css`
- `apps/www/styles/theme.generated.css`
- `apps/www/styles/time-picker.styles.css`
- `apps/www/styles/toggle.styles.css`
- `docs/design-system-v2-phase4-report.md`
- `packages/cli/registry/autocomplete.json`
- `packages/cli/registry/avatar.json`
- `packages/cli/registry/badge.json`
- `packages/cli/registry/button.json`
- `packages/cli/registry/card.json`
- `packages/cli/registry/checkbox-group.json`
- `packages/cli/registry/checkbox.json`
- `packages/cli/registry/combobox.json`
- `packages/cli/registry/command.json`
- `packages/cli/registry/date-picker.json`
- `packages/cli/registry/dropdown-menu.json`
- `packages/cli/registry/field.json`
- `packages/cli/registry/fieldset.json`
- `packages/cli/registry/form.json`
- `packages/cli/registry/frame.json`
- `packages/cli/registry/input-group.json`
- `packages/cli/registry/input.json`
- `packages/cli/registry/label.json`
- `packages/cli/registry/menubar.json`
- `packages/cli/registry/number-field.json`
- `packages/cli/registry/otp-field.json`
- `packages/cli/registry/popover.json`
- `packages/cli/registry/preview-card.json`
- `packages/cli/registry/radio-group.json`
- `packages/cli/registry/select.json`
- `packages/cli/registry/separator.json`
- `packages/cli/registry/slider.json`
- `packages/cli/registry/switch.json`
- `packages/cli/registry/textarea.json`
- `packages/cli/registry/time-picker.json`
- `packages/cli/registry/toggle-group.json`
- `packages/cli/registry/toggle.json`
- `packages/cli/registry/tooltip.json`
- `packages/cli/src/utils/ensure-styles.ts`
- `packages/cli/src/utils/theme.generated.ts`
- `packages/registry/registry/autocomplete.json`
- `packages/registry/registry/avatar.json`
- `packages/registry/registry/badge.json`
- `packages/registry/registry/button.json`
- `packages/registry/registry/card.json`
- `packages/registry/registry/checkbox-group.json`
- `packages/registry/registry/checkbox.json`
- `packages/registry/registry/combobox.json`
- `packages/registry/registry/command.json`
- `packages/registry/registry/date-picker.json`
- `packages/registry/registry/dropdown-menu.json`
- `packages/registry/registry/field.json`
- `packages/registry/registry/fieldset.json`
- `packages/registry/registry/form.json`
- `packages/registry/registry/frame.json`
- `packages/registry/registry/input-group.json`
- `packages/registry/registry/input.json`
- `packages/registry/registry/label.json`
- `packages/registry/registry/menubar.json`
- `packages/registry/registry/number-field.json`
- `packages/registry/registry/otp-field.json`
- `packages/registry/registry/popover.json`
- `packages/registry/registry/preview-card.json`
- `packages/registry/registry/radio-group.json`
- `packages/registry/registry/select.json`
- `packages/registry/registry/separator.json`
- `packages/registry/registry/slider.json`
- `packages/registry/registry/switch.json`
- `packages/registry/registry/textarea.json`
- `packages/registry/registry/time-picker.json`
- `packages/registry/registry/toggle-group.json`
- `packages/registry/registry/toggle.json`
- `packages/registry/registry/tooltip.json`
- `scripts/build-theme.mjs`
- `scripts/check-cli-install-fixtures.mjs`
- `scripts/check-theme-fixtures.mjs`
- `scripts/theme-definition.json`

## Original Phase 4 implementation record

The following record and its 32-file inventory describe the initial Phase 4 implementation before this authorized refinement. Its historical token/file counts are superseded by the section above.

October 19, 2026. Anchored overlays and menus are implemented on `feature/design-system-v2`, with all work **uncommitted**. HEAD remains `8b5735079694ada47671a0cfbbfd490f6ed81ae4`. Required repository checks and primary behavior coverage pass. One **pre-existing document CSS-zoom positioning limitation** is reproduced and retained below; physical-device and native browser-zoom acceptance remain unverified.

Before editing, the branch and clean working tree were verified. All five supplied commits were verified as ancestors: Base UI `7c6fcf5996421c25a2a21d14221d4156611e1c1d`, specification `776cd43117cb908a66891817bacbad1a9119546e`, Phase 1 `2106fe8b1eee7da75708586c0a73e8cc90b8b0b1`, Phase 2 `6498255d5903f37225ba765fbd7e6c3c892717c9`, and Phase 3 `8b5735079694ada47671a0cfbbfd490f6ed81ae4`. The plan and all three reports were read, and committed foundation, control, surface, form and selection implementations were inspected. No checkpoint is amended.

## Requested acceptance report

| #   | Item                        | Result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Files changed               | 32 files: five wrappers, shared overlay CSS, two preview files, four component documents, two generated docs files, fifteen registry copies, two registry/fixture scripts, and this report. Complete inventory below.                                                                                                                                                                                                                                                                                                                                                                 |
| 2   | Public/shared token changes | **None.** Canonical theme defaults, generated theme outputs, global CSS and existing public `--cn-*` roles are unchanged. Local `--menu-gap` and `--menu-indicator` describe layout only.                                                                                                                                                                                                                                                                                                                                                                                             |
| 3   | Shared overlay anatomy      | `overlay.styles.css` ships with all five installables. It owns an anchored frame, lifecycle motion, compact Tooltip treatment, menu rows and Menubar shell. No generic popup runtime component or positioning implementation was introduced.                                                                                                                                                                                                                                                                                                                                          |
| 4   | Popover                     | Semantic interactive frame, 16px padding/gaps, bounded internal scrolling, header/title/description defaults and a 2px/2px trigger focus contour. Existing exports, Root state, modal prop, Popup refs/render/focus props, portals and positioning convenience props remain. Controlled external opening/closing, interactive content, ref forwarding, custom anchor alignment and focus return pass.                                                                                                                                                                                 |
| 5   | Tooltip                     | Compact inverted 12/18 text, 6px corners, 6px/8px padding, small positioned arrow and no popup shadow. Provider delay remains unchanged, including its existing default of zero. Keyboard description, focus/blur, Escape, pointer opening and instant provider handoff pass. A focused action does not depend on tooltip text for its accessible name. Tooltip-specific accessible-description wiring corrects the observed installed-primitive gap described below.                                                                                                                 |
| 6   | PreviewCard                 | Uses the common frame with 16px padding, 12px content rhythm and a 320-unit preferred width. Link semantics, hover/focus opening, caller delays, pointer tolerance, portals and interactive content remain primitive-owned. Keyboard focus stays on the trigger. Pointer entry into the popup, interactive link use, dismissal and long-content internal scrolling pass.                                                                                                                                                                                                              |
| 7   | DropdownMenu                | Existing exports and primitive hierarchy retained: Root, Trigger, Portal, Content, Item, choices, groups/labels, separators, shortcuts and nested submenus. Common rows replace subtype-specific padding and absolute indicators. Controlled APIs remain forwarded; no normal-action selected state is fabricated. Keyboard/typeahead, callbacks, disabled rejection and focus return pass.                                                                                                                                                                                           |
| 8   | Menubar                     | Quiet bordered root, distinct trigger highlight/open/focus states, and the same menu Popup/items/submenus as DropdownMenu. Checkbox/radio wrappers now reuse the existing corresponding DropdownMenu wrappers. Native menubar semantics and top-level left/right, down/open, menu switching, submenu arrows, Escape and focus return pass.                                                                                                                                                                                                                                            |
| 9   | Popup frame                 | 10px semantic surface radius, opaque popup surface, 1px semantic boundary and restrained shared elevation. Base UI owns available dimensions, anchor width, collision placement and transform origin. Menu height is bounded by available height and 368 units; Popover/PreviewCard use available height and their own padding rhythm. Tooltip is intentionally smaller. Protected picker frames retain their legacy treatment.                                                                                                                                                       |
| 10  | Menu row anatomy            | Minimum 32px desktop / 44px coarse; 14/20 text, 8px gap/insets, 4px corners and 4px popup gutter. A flexible content region contains optional 16px icon, label/description and metadata; a separate trailing 16px slot contains a 12px check or submenu chevron. Normal items reserve the same trailing slot. No negative icon margin or absolutely overlaid indicator. Long action names wrap.                                                                                                                                                                                       |
| 11  | Submenu behavior            | Two nested levels pass ArrowRight/ArrowLeft, child focus, return to each parent trigger, pointer corridor travel, pointer return, portal stacking and collision placement. Coarse touch taps open reachable submenus at 320/390/768px; available-space collision can place them below the trigger. Submenu alignment offset changes from -3 to -4px with the new gutter. Existing positioner isolation/z-index 50 is preserved; no global z-index escalation.                                                                                                                         |
| 12  | Checkbox/radio menu states  | Real `data-checked` / `aria-checked` drive selected fill and persistent checks. Highlight adds the navigation edge while retaining the check and selected surface. Checkbox toggling, radio replacement and reopen persistence pass. `closeOnClick={false}` is used explicitly in the specimen; primitive close policy remains configurable.                                                                                                                                                                                                                                          |
| 13  | Destructive state           | Semantic destructive text at rest, transparent resting background, destructive subtle surface/boundary on highlight. Actual rendered highlighted text contrast is 5.86:1 light and 7.47:1 dark. No permanent red filled row.                                                                                                                                                                                                                                                                                                                                                          |
| 14  | Highlight/focus behavior    | Actual primitive highlighted/open attributes drive menu navigation. Triggers use the foundation's opaque 2px outline with 2px offset. Disabled rows retain full opacity with semantic disabled text and cannot execute; checked-disabled rows have their own disabled surface. Keyboard highlight does not add a second popup-wide contour. Forced-color navigation remains visible.                                                                                                                                                                                                  |
| 15  | Motion                      | Actual transition events prove 160ms opacity + `.98` to `1` scale on click-open menus and 100ms ending transitions. Independent CSS `scale` acts on Popup, leaving Positioner transforms intact; transform origin comes from Base UI. No displacement or undefined animation utility. Group/trigger handoffs stay instant. Tooltip focus/delay handoffs and PreviewCard focus opening remain instant. Primitive attributes/state are unchanged.                                                                                                                                       |
| 16  | Reduced motion              | Generic popup transitions and scale are removed under reduced motion. Tooltip never scales. Browser-computed reduced-motion state passes; dismissal behavior remains intact.                                                                                                                                                                                                                                                                                                                                                                                                          |
| 17  | Nesting                     | Select and Combobox inside Popover filter/select without closing the parent. Their first Escape closes the child. Menu inside Popover closes before its parent; clicking the visible Popover frame outside the menu dismisses the child and leaves form controls usable. Tooltip composed onto a Menu trigger retains description, menu keyboard entry and focus return. No unsupported Popover-from-menu example was invented.                                                                                                                                                       |
| 18  | Keyboard                    | Popover Enter/Space, content Tab, Escape/focus return; Tooltip focus/blur/Escape; PreviewCard keyboard focus/dismissal; Menu Enter/Space, arrows, Home/End, typeahead, Enter action, checkbox/radio changes, disabled rejection, nested submenu arrows and focus return; Menubar top-level and submenu navigation pass. Space during an active typeahead buffer remains Base UI's text-search behavior; tests use Enter to activate a typeahead result.                                                                                                                               |
| 19  | Touch/coarse pointer        | Chromium coarse-pointer emulation at 320/390/768/1440px confirms real >=44px menu rows and trigger boxes without invisible overlapping hit areas. Informational preview links also consume actual target space. CDP touch events open collision-bounded submenus at 320/390/768px. No Drawer conversion.                                                                                                                                                                                                                                                                              |
| 20  | Responsive behavior         | Consumer and production family fit 320/390/768px and desktop in light/dark. Long rows preserve check/shortcut containment; menus and long previews scroll internally. RTL slots/chevrons and 20px-root scaling pass. The document CSS-zoom simulation has the separately reproduced baseline limitation below; it is not claimed as passing browser zoom.                                                                                                                                                                                                                             |
| 21  | Light/dark                  | Shared frame and family reviewed together and individually. Dark separation uses the existing popup surface, border and restrained shadow. Rendered Tooltip contrast is 14.76:1 light / 16.30:1 dark; menu metadata is 5.79:1 / 6.67:1. These pairs are not a library-wide accessibility certification.                                                                                                                                                                                                                                                                               |
| 22  | OS/app disagreement         | All four class/OS combinations pass in the copied consumer. Real persisted app-light/OS-dark and app-dark/OS-light production checks preserve expected popup surfaces and native color-scheme. No component-level `prefers-color-scheme`.                                                                                                                                                                                                                                                                                                                                             |
| 23  | Consumer/CLI                | Real bundled CLI fixtures pass incremental Phase 2 theme, customized theme, partial install and fresh reverse order, repeated add/init, recursive component/helper/style closure and customization preservation. All five ship the shared style. A CLI-copied consumer renders and compiles with strict TypeScript at a 16px root without website globals; custom popup surface/radius and font scaling pass. npm dependency installation is stubbed offline and existing workspace modules supply runtime dependencies. This is not a published-registry/network installation claim. |
| 24  | Phase 1 regression          | Button, Input, Textarea, InputGroup, Badge, Avatar, Card and Frame receive light/dark production smoke review. Foundation sources/styles are byte-unchanged.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 25  | Phase 2 regression          | Field/Form/Fieldset/Checkbox/Radio/Switch/NumberField/Slider/OTP/Toggle/ToggleGroup receive 22 light/dark production smoke checks; the consolidated form specimen's responsive/OTP geometry checks pass. Phase 2 source/styles are unchanged.                                                                                                                                                                                                                                                                                                                                         |
| 26  | Phase 3 regression          | Consolidated selection specimen, selected/highlight distinction, responsive fit, retained headings and Autocomplete/Combobox/Command content pass production review. Selection CSS, Select/Combobox and Command modal shell are byte-unchanged. Phase 4 selectors do not match their popup classes.                                                                                                                                                                                                                                                                                   |
| 27  | Date Picker regression      | Exact protected baseline matches: caption/nav 24.5px, July caption width 88.125px, 7px insets, 5.25px gap, 12.25px chevron, 28px days and 33.25px month/year buttons. Complete 2px/2px caption focus, view switching and range continuity pass. Popup box remains 245 × 272.5px with zero border, 12.75px radius and original typography/padding. Picker source/styles remain unchanged.                                                                                                                                                                                              |
| 28  | Time Picker regression      | Exact protected input/clock/list/action geometry and heading anchors match; default input 33.5px and clock 238px. Draft preview, Cancel rollback, OK commit and explicit 390px mobile Dialog relationship pass. Popup box remains 252 × 418.75px with original zero border/radius/type/padding. Time Picker and Dialog sources/styles are unchanged.                                                                                                                                                                                                                                  |
| 29  | TypeScript                  | PASS: actual www and CLI `tsc --noEmit`, strict copied-consumer compilation and production build type checking.                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 30  | Lint                        | PASS: `pnpm lint`, no warnings/errors in the final run.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 31  | Builds                      | PASS: `build:all`, CLI CJS/declaration build and final Next.js production build (60 generated pages). No package/version/dependency changes.                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 32  | Registry                    | PASS: 54 installables, 100 embedded source/style occurrences, canonical source equality and identical public/package/CLI copies. Only the five Phase 4 entries gain a shared stylesheet file.                                                                                                                                                                                                                                                                                                                                                                                         |
| 33  | Routes/docs                 | PASS: 117 production HTTP checks including 54 component and 54 registry routes; all served registry responses equal source bytes. Existing headings/anchors on all five Phase 4 pages and protected picker/selection pages remain. Popover adds System specimen; four docs describe the additive native `positionerProps` pass-through. Generated output: 54 markdown pages and 311 previews. No routes/catalog/SEO restructuring.                                                                                                                                                    |
| 34  | Browser QA                  | 100 primary consumer assertions and 27 supplemental passing checks, plus 34 production Phase 4 comparisons. Separate production Phase 1–3 and picker regression evidence is retained. Tests inspect real focus, state, values, bounds, scrolling, computed styles, actual transition events and accessible descriptions. One supplemental document CSS-zoom observation fails viewport fit and is classified with a committed-baseline reproduction below.                                                                                                                            |
| 35  | Physical-device limitations | No physical iOS/Safari/Android, real touch hardware, virtual keyboards, native browser-chrome zoom or manual screen-reader certification. CDP media/touch tests are simulations. CSS zoom is not native browser zoom.                                                                                                                                                                                                                                                                                                                                                                 |
| 36  | Deviations                  | No later-family, public-token, palette or package-version scope expansion. Additive Positioner option forwarding, Tooltip description correction, picker compatibility rules and the preserved CSS-zoom limitation are detailed below. The pinned Next 16.1.7 is retained; the optional next-dev-loop workflow requires >=16.3, so production/browser tooling is used. Host model selection was not changed by this work.                                                                                                                                                             |
| 37  | git diff --check            | PASS, including generated outputs and this report.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 38  | git status                  | 32 modified/new Phase 4 files, all uncommitted, on the original feature branch. HEAD and all five checkpoints are unchanged. No push, merge, publish, deploy, version bump or Phase 5 work.                                                                                                                                                                                                                                                                                                                                                                                           |

## Implementation decisions and boundaries

`positionerProps` is an optional pass-through to each wrapper's existing native Positioner; it also reaches Menubar and submenu content through their existing DropdownMenu composition. It exposes anchors, collision options, positioning method, refs and caller overrides without reimplementing positioning. Existing convenience props and exports remain supported. Options in `positionerProps` take precedence. The controlled consumer fixture verifies a separate anchor with the preserved 4px side offset.

The installed Base UI Tooltip was observed rendering no `role="tooltip"`, popup ID or trigger `aria-describedby` relationship. The wrapper supplies a stable popup ID/role and a Tooltip-specific context that registers the description while its popup is mounted. It appends to caller descriptions and removes its relationship after unmount. This state tracks description registration only: Base UI continues to own open state, delays, provider grouping, hover/focus events, Escape, portals and positioning. Direct root/trigger/content composition and Tooltip-on-Menu-trigger composition are browser-verified. Detached handle-backed triggers outside the wrapper's description context still require an explicitly linked caller-provided ID/description; no private primitive store is used.

The form specimen sets its nested Combobox's existing `autoFocus={false}` option so it does not steal mount focus from the first field. Combobox implementation and default behavior are unchanged.

Date/Time use PopoverContent but have protected local geometry. A narrowly scoped rule in overlay CSS preserves their existing borderless 12.75px outer frame, legacy elevation/type, padding/height ownership and non-scaled lifecycle. Their own styles remain authoritative. This avoids a 2px outer-box change from the new generic border and prevents this phase from redesigning their popup. The exception is intentionally limited to the existing `.rdp-popover_content` and `.tp-popover_content` classes.

Click-open motion is intentionally enabled even when the primitive reports `data-instant="click"`; the approved V2 enter/exit vocabulary owns those visual transitions. `group`/`trigger-change` handoffs remain immediate, as do compact Tooltip instant phases and PreviewCard keyboard focus. Base UI's initial placement frame temporarily disables transitions; actual transitionrun/transitionend events then prove the 160ms opacity/scale lifecycle. Positioner transforms, available-size variables and lifecycle attributes are untouched.

### Reproduced baseline limitation: document CSS zoom

Setting `document.documentElement.style.zoom = "2"` produces an out-of-viewport positioned menu in both the **actual committed HEAD wrappers** and the Phase 4 wrappers, bundled separately in an isolated copied consumer. At a 1440px viewport, both positioners place the doubled-width menu at x=1522px with right edge 2082px. Both fit normally at zoom 1. The baseline menu height is 335px versus the new bounded 368px, confirming the comparison uses distinct wrapper implementations.

This is a failed CSS-zoom simulation, **not** passing browser zoom acceptance. No popup-coordinate workaround, ancestor transform or Base UI patch is introduced. Normal viewport reflow and 20px-root font scaling pass; native browser-chrome zoom remains untested. Reproduction is retained in `zoom-comparison.json`, `zoom-comparison.py`, and the separate `consumer/legacy/` bundle. The final supplementary script reports this as one baseline limitation, separately from its 27 passing checks.

## Reproduction and evidence

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

Evidence is retained at `/private/tmp/baseui-v2-phase4/`:

- `browser-qa.mjs`, `browser-qa-final.log`, `browser-results.json`: 100 primary behavior/theme/nesting/geometry checks.
- `extra-qa.mjs`, `extra-qa-final.log`, `extra-results.json`: lifecycle events, provider handoff, pointer corridor, actual emulated touch submenu entry, long PreviewCard scrolling, custom theme, contrast, forced colors and the separately classified CSS-zoom limitation.
- `docs-driver.mjs`, production review scripts, `regression-qa-final.log`, `phase4-docs-results.json`, `docs-results.json`, `phase2-smoke-results.json`, `docs-final-results.json`: final production family and regression review.
- Picker baseline/current JSON, geometry JSON and captures: protected popup frames and exact calendar/time contracts.
- `consumer/`, setup/build scripts, strict consumer type-check log: actual CLI-copied sources/theme/anatomy and standalone runtime. Extra and committed-baseline fixtures are disposable QA only.
- Build/theme/CLI/registry/lint/type logs and `routes.json`: required repository and 117 route checks. `scope-review.json` confirms **76 protected files** are byte-unchanged, including themes, other UI families, picker files, package manifests/lockfile and earlier V2 documents.

The local specimen is [Popover → System specimen](http://localhost:3107/docs/components/popover#system-specimen). The standalone copied consumer is [localhost:3108](http://localhost:3108/). Representative captures: [light menu](/private/tmp/baseui-v2-phase4/docs-menu-light.png), [dark Popover](/private/tmp/baseui-v2-phase4/docs-popover-dark.png), and [390px coarse dark menu](/private/tmp/baseui-v2-phase4/menu-390-true-true.png). These are local review servers, not deployments.

## Complete file inventory

- `apps/www/components/previews/phase4-system-preview.tsx`
- `apps/www/components/previews/popover-previews.tsx`
- `apps/www/components/ui/dropdown-menu.tsx`
- `apps/www/components/ui/menubar.tsx`
- `apps/www/components/ui/popover.tsx`
- `apps/www/components/ui/preview-card.tsx`
- `apps/www/components/ui/tooltip.tsx`
- `apps/www/content/docs/components/dropdown-menu.mdx`
- `apps/www/content/docs/components/popover.mdx`
- `apps/www/content/docs/components/preview-card.mdx`
- `apps/www/content/docs/components/tooltip.mdx`
- `apps/www/lib/__generated__/docs-markdown.json`
- `apps/www/lib/__generated__/preview-sources.json`
- `apps/www/public/registry/dropdown-menu.json`
- `apps/www/public/registry/menubar.json`
- `apps/www/public/registry/popover.json`
- `apps/www/public/registry/preview-card.json`
- `apps/www/public/registry/tooltip.json`
- `apps/www/styles/overlay.styles.css`
- `docs/design-system-v2-phase4-report.md`
- `packages/cli/registry/dropdown-menu.json`
- `packages/cli/registry/menubar.json`
- `packages/cli/registry/popover.json`
- `packages/cli/registry/preview-card.json`
- `packages/cli/registry/tooltip.json`
- `packages/registry/registry/dropdown-menu.json`
- `packages/registry/registry/menubar.json`
- `packages/registry/registry/popover.json`
- `packages/registry/registry/preview-card.json`
- `packages/registry/registry/tooltip.json`
- `scripts/check-cli-install-fixtures.mjs`
- `scripts/registry-meta.mjs`
