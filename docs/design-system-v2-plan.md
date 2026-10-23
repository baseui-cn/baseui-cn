# baseui-cn Design System V2: foundation audit and migration plan

Date: October 19, 2026. Status: **proposed direction for review; implementation has not begun**.

Baseline: `7c6fcf5996421c25a2a21d14221d4156611e1c1d` — `chore: upgrade Base UI to v1.9.0`.
Work branch: `feature/design-system-v2`.

## 1. Scope, evidence, and outcome

At intake, `HEAD` and `main` both resolved exactly to the baseline and `git status --short` was empty. The feature branch was created before any repository edit. The checkpoint was not amended or otherwise changed.

This deliverable proposes a visual system and an implementation sequence. It changes only this document. No component, CSS, token, example, dependency, generated registry, route, or SEO source has been modified. No experimental source changes were necessary. No template product, marketplace, release, push, or deployment is included.

The audit combines source inspection across every installable family with a representative rendered review of the existing local production build. Browser review covered the homepage, Button in light/dark modes, Input and keyboard focus, mobile documentation/search, Select documentation/popup, and Date Picker's mobile input/popup. Desktop used the existing browser viewport (approximately 1470 × 950); mobile used a temporary 390 × 844 viewport, subsequently reset. This is a visual foundation audit, not a repeat of the checkpoint's full interaction acceptance or a physical-device accessibility certification.

A non-mutating registry check independently verified all **54 installables**, all **70 embedded file occurrences** against their source, and byte-equivalent SHA-256 hashes across the public, package, and CLI registry copies. The catalog contains **51 components and 3 blocks**. Counts describe installables, not unique TSX files.

Recommendation: establish a quiet graphite identity with a clear cool-blue keyboard focus signal, exact border-box geometry, differentiated surface radii, readable type, and restrained elevation. Preserve the current composition model and the carefully designed Date Picker. The largest work is shared state styling and distribution consistency, followed by selection/search, overlays, and Data Grid integration.

## 2. Current visual architecture

### Ownership and distribution

| Layer                  | Current implementation                                                                                          | Consequence for V2                                                                                           |
| ---------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Global theme           | `apps/www/styles/globals.css`; raw OKLCH variables mapped through Tailwind v4 `@theme inline`                   | Keep semantic theme hooks; no Tailwind JS config was found or is needed                                      |
| Scale                  | `:root { font-size: 14px; --spacing: .25rem }`; custom text sizes                                               | A spacing unit is 3.5px on the site; copied components in a typical 16px-root application render differently |
| Styling                | Tailwind strings in `components/ui/*.tsx`, CVA on selected components, `cn()`/tailwind-merge, `data-slot` hooks | Existing variants and override escape hatches can survive; component anatomy should own state styling        |
| Behavior               | Base UI 1.9 wrappers, `mergeProps`/`useRender`; local Date/Time composition; DayPicker calendar                 | Keep primitive semantics, refs, props, portals, focus ownership, validation and event behavior               |
| Calendar styles        | Separate `date-picker.styles.css` and `time-picker.styles.css` imported by their modules                        | Good precedent for semantic-to-local token aliases and explicit geometry                                     |
| Website                | Next.js 16.1.7 App Router, Fumadocs MDX, Inter via `next/font/google`, native monospace stacks                  | Keep Inter initially; distinguish documentation chrome from copied component styles                          |
| Theme switching        | `next-themes`, `.dark`, default dark, system option, storage key `querycanvas-theme`                            | Retain user choice; any storage-key cleanup requires a compatibility read/migration                          |
| Registry               | `scripts/registry-meta.mjs` declares canonical source files; `build-registry.mjs` embeds source                 | Edit source and regenerate; never style JSON copies directly                                                 |
| Consumer theme         | `packages/cli/src/utils/ensure-styles.ts`, invoked by init; merges missing variables                            | V2 must work after fresh install and incremental install without overwriting existing custom values          |
| Documentation examples | Preview maps, generated preview-source JSON, generated docs markdown, MDX                                       | Examples must demonstrate the actual API and theme; site-only CSS cannot be a hidden dependency              |

There are currently several visual approaches rather than one complete system:

- Button/Input/Textarea/Checkbox/Toggle use inset pseudo-element highlights, low-opacity outer shadows, 64% disabled opacity and detailed dark surface rules.
- Select/Combobox/Dropdown Menu use different popup radii, ring borders and larger generic shadows; their row geometry and highlight selectors differ.
- Autocomplete uses a border and subtle shadow, smaller list-item radii, explicit transition properties and Input composition.
- Card/Frame/Command have deliberate nested surface construction, but some larger radii remain Tailwind defaults outside the root radius hierarchy.
- Date/Time have their own local visual token maps. Date Picker has the most explicit geometry contract.

### Existing values and inconsistency map

Values below are source values unless explicitly labeled as browser measurements. `h-9` means 31.5px at the current root, not 36px. Border-box measurements include wrapper borders.

| Dimension           | Current evidence                                                                                                            | Inconsistency / consequence                                                                            | V2 decision                                                                                  |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| 1. Radius           | Root `.625rem` = 8.75px; sm 4.75px, md 6.75px, lg 8.75px, xl 12.75px; `rounded-2xl` remains 1rem = 14px                     | Larger radii do not all derive from the root; InputGroup is xl while Input is lg                       | Semantic radii: indicator 4, item/badge 4, control 6, card/popup 10, dialog/outer frame 12px |
| 2. Heights          | Button default 31.5px; Input default inner 31.5px / outer 33.5px; Select h-9; Input lg shrinks to h-8.5 at sm               | Equal size labels do not mean equal external height; lg can become shorter than md                     | Set total border-box height once at the outer control; no breakpoint reversal                |
| 3. Inline padding   | Button `3 × spacing - 1px` = 9.5px; Input md `2.5 × spacing - 1px` = 7.75px; Select px-3 = 10.5px                           | Same nominal size produces different text insets                                                       | Common 8/10/12/14px size insets; composite icon slots have explicit widths                   |
| 4. Type scale       | lg 16.8px, base 15.4px, sm 13.72px, xs 12.04px; date day .8125rem = 11.375px                                                | Fractional scale, mobile editable text below 16px, component/site coupling                             | Semantic 12/13/14/16/18/24/32 type scale; mobile editable text 16px                          |
| 5. Weights          | 400, 500, 600, 700; OTP uses mono/600, homepage mono/700                                                                    | Heading/control hierarchy varies by file                                                               | Body 400; controls 500; headings 600; mono only where useful                                 |
| 6. Borders          | Light border and input both OKLCH .922; dark border white/10%, input white/15%; ring borders on popups                      | Structural separators and identifiable control boundaries share weak defaults                          | Separate structural, control, hover, active and invalid boundaries                           |
| 7. Surfaces         | Page/card/popover all white in light and all .141 in dark                                                                   | Flat token hierarchy; shadow and component-specific overlays must do the work                          | Separate page/surface/raised/popup roles, especially in dark mode                            |
| 8. Muted surfaces   | Secondary/muted/accent all .967 light, .269 dark; components add /30, /50, /64, /72                                         | Semantic roles are conflated; opacity depends on underlying surface                                    | Dedicated muted and interaction surface values; opaque baselines                             |
| 9. Hover            | Accent, accent/50, primary/90, input/64, or opacity change                                                                  | Variable feedback strength; light input/select hover is sparse                                         | Explicit hover surface/border; use hover-capable media conditions                            |
| 10. Pressed         | Button native active plus data-pressed; Toggle persistent data-pressed; Switch thumb stretches                              | Momentary press and persistent toggle state need distinct rules                                        | Separate press feedback from persistent checked/pressed selection                            |
| 11. Selected        | Primary fill on checked controls; accent list highlights; table muted/10; tab indicator                                     | Selected rows can look the same as hover; list focus and selection are conflated                       | Persistent indicator plus selected surface; highlight remains transient                      |
| 12. Focus           | Button 2px ring + 1px offset; Input 3px ring/24%; Select 3px/50%; Radio 3px/50%; caption 2px outline + 2px offset           | Focus varies in thickness, strength, trigger and ownership                                             | One opaque 2px focus outline, 2px offset; one owner per control                              |
| 13. Error           | Destructive borders at 36/64%; invalid Select ring always present; `FieldError` uses destructive-foreground                 | Error copy uses the color intended for text on a destructive fill; nearly white on white in light mode | Dedicated status-text tokens; invalid border + message; focus stays recognizable             |
| 14. Disabled        | 40% date, 50% Radio/Slider/Select/Number Field, 64% Button/Input/Checkbox/Switch/Autocomplete                               | Uneven legibility; nested Autocomplete/Input opacity can compound                                      | Explicit disabled foreground/surface/border; apply once at owner                             |
| 15. Shadows         | none, xs/5, xs, sm/5, md, lg/5, lg, xl, 2xl plus custom inset highlights                                                    | Too many recipes for similar jobs                                                                      | Four elevation roles, with controls flat by default                                          |
| 16. Popup elevation | Select xl; Combobox/Popover 2xl; Menu md; Autocomplete lg/5; Preview Card md                                                | Similar popup surfaces look unrelated                                                                  | Shared popup border/radius/shadow; separate modal role                                       |
| 17. Spacing         | 3.5px unit, half-steps, px exceptions, 1px border subtraction; gap-2 vs 2.5 vs 1.5                                          | No shared alignment contract for labels, icons, indicators or menus                                    | 4px rhythm with 2px optical steps; local slots for composites                                |
| 18. Icons           | Typically size-4 (14px here), mobile 4.5 (15.75px), badge 3 (10.5px), raw 16px theme icon                                   | Mixed units and negative margins make alignment fragile                                                | 12px indicator, 16px standard, 20px prominent; fixed flex slots                              |
| 19. Duration        | 100ms popup classes; 150ms switch; 160ms calendar; 200ms accordion/tabs; 300ms drawer; 350ms nav; 450ms reveal; 30s marquee | Too many motion systems; reduced motion is partial                                                     | 100/160/220ms roles, existing calendar 160ms retained                                        |
| 20. Easing          | ease, ease-out, ease-in-out, custom .22/1/.36/1, Motion easeOut                                                             | Different spatial character                                                                            | Shared enter/exit/standard curves; no elastic/bouncy defaults                                |
| 21. Backdrops       | Dialog black/30 + 4px blur; Alert Dialog black/10 + blur-xs; Drawer black/50; Command black/32 + blur-sm                    | Similar modality produces very different page suppression                                              | Shared scrim, 32% light / 48% dark, no default blur                                          |
| 22. Touch           | Button/Toggle/Number Field coarse min-h-11 pseudo-targets = 38.5px here; many other controls lack equivalent targets        | A class that looks like 44px is smaller here; expansion can overlap neighbors                          | True 44px coarse targets with layout room, not overlapping invisible extensions              |

### Foundation defects to resolve before broad migration

1. **Class/media theme disagreement.** Global `.dark` variables respond to next-themes, but no `@custom-variant dark` is defined. The existing production CSS places `dark:` utilities inside `prefers-color-scheme: dark`, with no `.dark` variant selector. This can mix light variables with dark utility overrides, or the reverse, when user choice differs from OS preference. Define the class variant explicitly in the future theme foundation and CLI output. Test both disagreement directions.
2. **Undefined animation utilities.** Several wrappers use `animate-in/out`, `fade-in/out`, `zoom-in/out`, and slide utilities. No matching animation package/import or enter/exit keyframes was found in source/compiled CSS. Duration classes alone do not implement these animations. Use owned CSS transitions with actual Base UI starting/ending lifecycle attributes. Do not add a large animation dependency to preserve undeclared class behavior.
3. **Mixed state syntax.** `data-open`, `data-popup-open`, `data-[state=open]`, `focus:` and `data-highlighted` coexist. Badge uses `data-[state=open]`; Dialog similarly uses state strings, while other Base UI wrappers use presence attributes. Confirm rendered attributes per primitive before migration; do not mechanically rename everything.
4. **Theme drift after installation.** CLI and theming docs define `--radius: .5rem`, versus `.625rem` on the site. CLI output does not reproduce the site's root/font/spacing overrides. V2 requires a shared source for public theme defaults and a consumer fixture.
5. **Unimplemented style hooks.** `cn-popover-header/title/description`, `cn-font-heading`, and `cn-menu-translucent` have no corresponding definitions in the inspected styles. Decide which are intentional extension hooks; implement documented defaults or remove misleading assumptions during the owning family's migration.
6. **Example/API disagreement.** Input's Sizes demo changes wrapper height through className without using the size prop; measured inner height remains 31.5px while wrappers become 28/38.5px. Input accepts `default`, but only md receives h-9; Autocomplete forwards default. Align supported aliases and demonstrate real props. Early Input preview labels also lack explicit label association; use Field or htmlFor/id in the example refresh.
7. **Color format drift in docs.** Theming examples contain bare HSL channels even though variables are consumed as raw colors, and a legacy SVG helper uses `hsl(var(--background))`. Correct examples to complete color values; do not change public theme formats silently.

## 3. Actual component families and migration matrix

All 54 registry names appear below exactly once. The grouping is a migration model, not a proposal to change existing URLs or sidebar taxonomy now. Risk is visual/composition migration effort, not a claim of a behavioral regression.

| Family / installables                                                                            | Existing visual pattern and mismatch                                                                                                                     | Migration work / risk                                                                                                                                      |
| ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Basic action: **button**                                                                         | Rich variants, inset effects, responsive xs/xl/icon dimensions, 2px focus; hard-coded amber warning                                                      | Common geometry/state tokens; retain every size/variant/loading contract; medium                                                                           |
| Text entry: **input, textarea, input-group**                                                     | Wrapper vs inner height mismatch; InputGroup xl vs Input lg radius; 3px translucent focus; placeholder opacity; no common read-only appearance           | Shared outer control anatomy, alias rules, focus owner, borders, placeholder/status text; high                                                             |
| Identity/status: **badge, avatar, separator**                                                    | Badge 17.5px default/6.75px radius; Avatar circular 21/28/35/42px and shadow; separator clean 1px                                                        | Retain shapes/variants; token and icon alignment; mostly low                                                                                               |
| Surface shells: **card, frame**                                                                  | Card/Frame 2xl outer, xl nested; several layered pseudo-element borders/clips                                                                            | Preserve nesting and variants, rationalize surface/radius roles before dependent families; medium                                                          |
| Form semantics: **label, field, fieldset, form**                                                 | Good composability; Field gap-2 vs Form gap-4; field error foreground problem; legend has own size/weight scale                                          | Typography/error/spacing only; preserve validation ownership, labels and IDs; medium                                                                       |
| Boolean choice: **checkbox, checkbox-group, radio-group, switch**                                | Checkbox 15.75/14px, Radio 14px, Switch changes thumb size at sm; focus/disabled styles differ                                                           | Align visible indicators and full label targets; preserve native inputs, keyboard and form semantics; medium                                               |
| Numeric/security entry: **slider, number-field, otp-field**                                      | Slider tiny thumb/white fill and hover ring; Number Field md radius/focus-within; OTP xl radius and independent cells                                    | Local geometry exceptions, accessible group focus and touch targets, status parity; medium/high                                                            |
| Persistent action: **toggle, toggle-group**                                                      | Close to Button but default height shrinks at sm; joined controls suppress some hit expansion                                                            | Reuse action geometry; keep persistent pressed selection; protect joined edges and focus stacking; medium                                                  |
| Selection/search: **select, combobox, autocomplete, command**                                    | Different popup shadows/radii/rows/checkmark alignment; chips composed through InputGroup; Command uses Autocomplete with modal shell                    | Common control/popup/row vocabulary; async, empty, multiple-chip and focus states; high. Command rows migrate here, final modal shell in modal phase       |
| Anchored overlays: **popover, tooltip, preview-card**                                            | xl vs md/lg radii; 2xl vs none/md shadow; tooltip inverted; default tooltip delay zero                                                                   | Shared elevation/motion; preserve positioning, anchor sizing, collision and trigger semantics; medium                                                      |
| Action menus: **dropdown-menu, menubar**                                                         | Shared primitive and recipes, row padding smaller than Select; different submenu elevation and checkmark side                                            | One item anatomy with label/icon/indicator/shortcut slots; retain menu behavior and Menubar root; high                                                     |
| Modal surfaces: **dialog, alert-dialog, drawer**                                                 | Three backdrop recipes, different padding/width constraints, 100–300ms styles, different focus/lifecycle selectors                                       | Common surface/frame, safe-area/viewport rules, explicit scroll owner and focus restoration; high                                                          |
| Navigation/disclosure: **tabs, accordion, collapsible, navigation-menu, breadcrumb, pagination** | Tabs indicator already uses primitive geometry; Accordion/Collapsible height transitions; nav has 350ms motion and multiple focus treatments             | Token and interaction alignment; preserve indicator/height geometry, orientations and anchor semantics; medium                                             |
| Feedback: **alert, toast, progress, skeleton, spinner**                                          | Alert semantic tokens good; Toast uses raw green/yellow/blue, own action/close styling and timers/transforms; Progress/Skeleton simple                   | Status token pairs, consistent focus/targeting and reduced motion; preserve Toast manager/timers/swipe mechanics; medium                                   |
| Data/list/layout: **table, data-grid, item, scroll-area**                                        | Frame-aware table borders; very faint selected rows; grid has separate editors, header/filter/pagination recipes; ScrollArea separate scrollbar geometry | Row density/selection/focus; editor shell integration, DnD/virtual row measurement; high for Data Grid, low/medium elsewhere                               |
| Calendar/time: **date-picker, time-picker**                                                      | Explicit local tokens; date caption/nav geometry and complete ring intentional; time draft/commit and safe-area dialog intentional                       | Preserve local geometry, adapt aliases only after foundations stabilize; review touch/range layouts independently; high regression cost, low redesign need |
| Existing blocks: **empty-state, login, signup**                                                  | Registry empty-state points to blocks.tsx; auth shares auth.tsx with size overrides and composed feedback                                                | Adapt to approved primitives late; protect form behavior; no new template work; medium                                                                     |

**Additional local/support surfaces:** `rating.tsx` is bundled inside Data Grid, not a standalone registry entry; review its star color, keyboard/focus treatment and hit areas with Data Grid. `kbd.tsx` supports website/Command metadata. Local `empty.tsx` and `empty-state.tsx` are separate composable implementations; neither is the canonical registry `empty-state` block. Inventory consumers before consolidating anything; retain exports and avoid an accidental API deletion. `auth.tsx` and `blocks.tsx` are the actual block styling sources. There is **no Context Menu installable**, standalone Calendar, or template catalog to migrate. Context Menu remains future scope.

## 4. Proposed visual principles

1. **Precision is the identity.** Align control baselines, text insets, indicators and border boxes. Make neighboring controls feel designed together before adding detail.
2. **Graphite surfaces, one clear focus accent.** Neutral primary actions work in product and marketing contexts. Cool-blue focus distinguishes keyboard location without turning every surface into a branded decoration. Product brands may override semantic colors.
3. **Quiet resting state, definite interaction.** Flat controls, visible boundaries, modest hover, a stronger press, and a persistent selected marker. Focus is never inferred from hover.
4. **Hierarchy through type and spacing.** Inter 400/500/600, measured line heights, generous section structure and compact usable controls. Use mono for code/identifiers, not all product headings.
5. **Independent parts, cohesive rules.** A checkbox, calendar cell and dialog do not share a single radius or height. They share state semantics, contrast rules, rhythm and token ownership.
6. **Designed dark mode and touch from the start.** Dark layers separate by luminance and borders. Coarse targets consume real layout space. Motion supports orientation and respects reduced motion.

The recognizable combination is squared-but-soft 6px controls, 10px floating panels, exact 36px regular geometry, measured icon slots, graphite primary actions and a crisp blue focus contour. It does not depend on gradients, transparent glass, large pills, heavy shadows or decorative motion.

## 5. Proposed token architecture and rollout boundary

### Three levels

| Level           | Role                                                                   | Example                                                                                                |
| --------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Reference       | Small primitive scale; not used directly for semantic component states | `--cn-unit`, neutral palette, `--cn-duration-fast`                                                     |
| Semantic        | Public roles usable by every family and product brand                  | `--cn-surface-popup`, `--cn-border-control`, `--cn-focus-color`, `--cn-text-disabled`                  |
| Component/local | Anatomy and exceptions; defaults alias semantic roles                  | `--cn-control-height`, `--cn-control-padding-inline`, `--rdp-caption-button-height`, `--tp-clock-size` |

Use the existing CSS-variable + Tailwind v4 model. Do not introduce a styling runtime or duplicate behavior abstraction. Add focused geometry/state helpers only after two real consumers show the same anatomy; keep CSS selectors and data-slot hooks inspectable. Do not generate a universal state class that accidentally flattens calendar, menu and input semantics.

**Proposed ownership, after approval:** one checked-in, serializable theme definition under `scripts/` owns public defaults and mappings; its generated CSS is consumed by docs and its generated data by the CLI. Theme examples are generated or checked against it. Name/path can follow existing generator conventions, but both outputs must derive from one definition. All needed tokens, mappings, animation rules and class-based dark behavior must ship to consumers; no registry component may rely only on website globals. Add a documented token schema/version for a future CLI upgrade; do not bump package versions during this plan.

### Scale strategy: avoid an accidental global resize

All proposed pixel dimensions below describe the default 16px-browser setting. Express scale tokens through `--cn-unit: .0625rem` so user font preferences can scale them. For example, regular height is `calc(36 * var(--cn-unit))`, label type `calc(14 * var(--cn-unit))`, line height `calc(20 * var(--cn-unit))`. A 1px hairline may remain a CSS pixel.

The current docs root stays 14px during component migrations. Its **temporary V2-only bridge** is `--cn-unit: calc(1rem / 14)`, giving migrated components the intended geometry without resizing untouched components. Consumer default remains `.0625rem`; docs must also test that normal consumer environment in an isolated fixture. Replace migrated hard-coded spacing/type utilities with role tokens where necessary; defining a unit alone does not normalize existing utility strings.

A later website rebase to `html { font-size: 100% }` removes the temporary bridge. It is gated on explicit Date/Time geometry adapters, a full site layout comparison and browser font-preference testing. Existing `.rdp-*` and `.tp-*` rem lengths must not be resized indirectly by changing html first. Preserve their measured dimensions through reviewed local token conversion, or defer the root rebase if that proof is incomplete. Do not attach font-size overrides to arbitrary nested containers and assume rem will follow them.

### Compatibility aliases

Keep existing public names (`--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, status foregrounds, `--border`, `--input`, `--ring`, `--radius`). Retain the `--color-*` mappings for their utilities. Add `--cn-*` roles without deleting those hooks.

For colors, prefer `--cn-surface-popup: var(--popover)` and `--cn-focus-color: var(--ring)` so existing overrides still work. Existing names continue to hold complete color values. New roles such as raised surface, selected surface, control border and status text have independent defaults; document the extra overrides a custom theme may need. Do not create circular aliases or assume one overridden `--primary` can generate accessible foregrounds automatically.

Keep `--radius` as the control compatibility hook; derive semantic radii with nonnegative bounds. Avoid changing the meaning of every Tailwind `rounded-*` utility globally during a partial migration. Components consume semantic radius roles directly. Scope new defaults to approved V2 consumers until all families and install paths are ready. No bulk rewrite of user CSS through `ensureThemeCSS`.

## 6. Proposed color, border and surface system

These sRGB hex values are concrete initial values for review, not implemented tokens. They can be serialized as equivalent OKLCH values later without changing the reference colors. Normal text and essential boundary/focus combinations must pass contrast validation on their actual composited backgrounds before acceptance. Do not approve transparency variants based on an opaque swatch alone.

| Semantic role / proposed token       | Light                 | Dark                  | Usage                                                             |
| ------------------------------------ | --------------------- | --------------------- | ----------------------------------------------------------------- |
| `--cn-surface-page` / background     | `#f8f9fb`             | `#111318`             | App/page canvas                                                   |
| `--cn-surface` / card                | `#ffffff`             | `#191c23`             | Content regions and cards                                         |
| `--cn-surface-raised`                | `#ffffff`             | `#21252e`             | Nested raised region                                              |
| `--cn-surface-popup` / popover       | `#ffffff`             | `#252a34`             | Floating lists, dialogs and popovers                              |
| `--cn-surface-muted` / muted         | `#f0f2f6`             | `#20242c`             | Quiet grouping and read-only fields                               |
| `--cn-surface-hover` / accent        | `#e9edf4`             | `#303744`             | Transient interactive highlight                                   |
| `--cn-surface-pressed`               | `#dfe5ef`             | `#3a4353`             | Momentary pressed feedback                                        |
| `--cn-surface-selected`              | `#e8edf9`             | `#303d5c`             | Persistent selection, with marker/text                            |
| `--cn-text` / foreground             | `#20242c`             | `#eef0f5`             | Body/control text                                                 |
| `--cn-text-muted` / muted-foreground | `#5e6674`             | `#a9b1c0`             | Metadata, helper and placeholder text, at full opacity            |
| Primary / primary-foreground         | `#25272c` / `#ffffff` | `#e6e8ee` / `#191c23` | Solid primary action                                              |
| Primary hover / pressed              | `#353942` / `#17191e` | `#ffffff` / `#cbd0db` | Explicit state values; retain foreground contrast                 |
| `--cn-border-subtle`                 | `#e4e7ed`             | `#2c323e`             | Decorative separators only                                        |
| `--cn-border` / border               | `#d5d9e1`             | `#414957`             | Structural boundaries; never the sole weak indication of an input |
| `--cn-border-control` / input        | `#7d8797`             | `#788497`             | Essential resting control boundary                                |
| `--cn-border-hover`                  | `#667184`             | `#9aa7bd`             | Hovered control boundary                                          |
| `--cn-border-active`                 | `#454f60`             | `#bbc6d9`             | Pressed/open control boundary                                     |
| `--cn-focus-color` / ring            | `#4668d7`             | `#9bb4ff`             | Opaque focus contour                                              |
| `--cn-text-disabled`                 | `#7d8592`             | `#77808f`             | Disabled content; no opacity stacking                             |
| `--cn-surface-disabled`              | `#f0f2f6`             | `#20242c`             | Disabled control fill                                             |
| `--cn-border-disabled`               | `#d5d9e1`             | `#363d49`             | Disabled control boundary                                         |

Use 1px borders at rest, hover, invalid and focus; do not change thickness and move layout. Controls have no default outer shadow. Filled primary actions may use their fill as the boundary. Structural and subtle borders have a different job from essential control boundaries; do not demand or claim 3:1 for every decorative divider.

### Status tokens

| Status      | Text / border / solid fill, light | Text / border / solid fill, dark | Subtle fill light / dark | On-solid foreground light / dark |
| ----------- | --------------------------------- | -------------------------------- | ------------------------ | -------------------------------- |
| Destructive | `#b02a3b`                         | `#ff9da8`                        | `#fff0f1` / `#39212a`    | `#ffffff` / `#271217`            |
| Success     | `#22673f`                         | `#92ddb0`                        | `#edf7f0` / `#1b3227`    | `#ffffff` / `#12251a`            |
| Warning     | `#875300`                         | `#f4c876`                        | `#fff5df` / `#382e1c`    | `#ffffff` / `#281d0c`            |
| Info        | `#2457b2`                         | `#a4c4ff`                        | `#edf3ff` / `#20314e`    | `#ffffff` / `#13213b`            |

Create `--cn-status-{name}-text`, `-border`, `-surface` and use the existing status and status-foreground names for solid fill/foreground compatibility. Alias text/border to the same swatch initially; split later only if evidence requires it. Error text uses the status-text role, never the on-solid foreground on a plain background. Toast, Badge, Alert, Field and destructive Menu items use the same roles. Provide icon/text as well as color. Warning must no longer hard-code amber in Button while other families use semantic warning.

Initial sRGB relative-luminance checks on these proposed opaque swatches produced the following ratios. These calculations validate the listed pairs only; final CSS, compositing, states and focus placement still need rendered verification.

| Checked pair                                                  | Contrast ratio                       |
| ------------------------------------------------------------- | ------------------------------------ |
| Light control boundary / white surface                        | 3.63:1                               |
| Light control boundary / muted surface                        | 3.24:1                               |
| Dark control boundary / popup surface                         | 3.80:1                               |
| Light muted text / hover surface                              | 4.93:1                               |
| Light focus / selected surface                                | 4.24:1                               |
| Dark focus / pressed surface                                  | 4.92:1                               |
| Status text / matching subtle surface, all four statuses      | 5.86–6.22:1 light; 7.40–8.61:1 dark  |
| On-solid status text / matching solid fill, all four statuses | 6.43–6.82:1 light; 8.98–10.52:1 dark |

## 7. Control sizing and spacing rules

Every height is the **complete visible border box**. Inner fields fill that box; they must not add a second height or border. Use `box-sizing: border-box`, min-width:0 and explicit line heights. Default is regular; compact sizes are deliberate variants, not incidental screen-width changes.

| Visual size              | Outer height | Inline text inset | Type / line height | Icon | Text/icon gap |
| ------------------------ | ------------ | ----------------- | ------------------ | ---- | ------------- |
| xs                       | 28px         | 8px               | 12px / 16px        | 12px | 4px           |
| sm                       | 32px         | 10px              | 13px / 18px        | 16px | 6px           |
| default / md             | 36px         | 12px              | 14px / 20px        | 16px | 6px           |
| lg                       | 40px         | 14px              | 14px / 20px        | 20px | 8px           |
| xl, existing Button only | 44px         | 16px              | 16px / 24px        | 20px | 8px           |

The inset is measured from the outer edge to text without an icon. Account for the 1px border inside that total; do not subtract it independently in several nested layers. Addons use a 16/20px icon slot plus the size's gap. Trailing clear/trigger actions reserve their own nonoverlapping slot; text cannot extend under them.

### Existing API mapping (no new blanket size APIs)

| Component                  | Mapping / exception                                                                                                                                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Button                     | Keep xs/sm/default/md/lg/xl and all icon aliases. md aliases default. icon-xs 28, icon-sm 32, icon 36, icon-lg 40, icon-xl 44px square. No automatic sm-breakpoint shrink                                          |
| Input                      | Keep sm/default/md/lg and numeric native-size behavior. default and md both map to regular. Numeric size changes native character hint, not the visual scale                                                       |
| Textarea                   | Keep sm/default/lg and numeric compatibility. Minimum border-box height 80/96/112px; block padding 8/10/12px; text 14/20, mobile 16/24. Preserve content sizing/resizing contract; no fixed line-count clipping    |
| SelectTrigger, NumberField | Keep sm/default/lg mapping; NumberField buttons share the external height and have their own focused identity                                                                                                      |
| Autocomplete / Combobox    | Follow existing supported size props through their Input/InputGroup composition; do not invent xs/lg props on primitives that do not expose them. Chips may grow in height; base row minimum follows selected size |
| Toggle/ToggleGroup         | Keep sm/default/lg. Joined geometry shares action sizes. Selection treatment stays persistent                                                                                                                      |
| Badge                      | Keep sm/default/lg: 18/22/26px height, 6/8/10px padding, 11/12/12px type. Static badges are not touch controls; interactive render targets need full target area                                                   |
| Avatar                     | Keep xs/sm/md/lg: 24/32/40/48px, fallback 11/12/14/16px. Circle remains the default; status markers 6/8px with a surface separation stroke                                                                         |
| Checkbox/Radio             | No new size prop. 16px visible shape, 12px indicator; associated label row supplies target area. Checkbox corner 4px; Radio circle                                                                                 |
| Switch                     | No new size prop. 36 × 20px visible track, 16px thumb with 2px inset; label row gives a 44px coarse target                                                                                                         |
| Slider                     | No new size prop. 4px track, 16px thumb, 44px coarse interaction region; keep horizontal/vertical and range semantics                                                                                              |
| OTP                        | Keep sm/default/lg. 36×40 / 40×44 / 44×48px width×height, 16/18/20px mono type, 8px slot gaps; six-slot layout must fit narrow screens through an explicit compact layout                                          |
| Menu/option rows           | Minimum 32px desktop / 44px coarse; text 14/20; 8px inline inset; 4px popup gutter. Multiline rows grow, never truncate essential action names                                                                     |
| Table/Grid                 | Regular rows minimum 40px, compact rows 32px only where supported; coarse interactive rows/actions 44px. Do not silently add a density prop across all components                                                  |
| Date/Time                  | Existing local size APIs and geometry remain authoritative until their dedicated review; generic control sizes do not replace calendar cells or clock geometry                                                     |

Spacing reference: **2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64px**. Common roles: label-to-control 6px, control-to-help/error 6px, field-to-field 16px, form section 24px, panel padding 16px, card padding 20px, dialog padding 24px. Use logical inline/block spacing. Grouped checkbox/radio options have at least 8px between target boxes. A row with helper text expands from its minimum height.

## 8. Radius rules

| Role          | Default | Rule                                                                       |
| ------------- | ------- | -------------------------------------------------------------------------- |
| Indicator     | 4px     | Checkbox and compact status tile; do not round radio indicators            |
| Item / badge  | 4px     | Menu/option/metadata, nested under a 10px popup                            |
| Control       | 6px     | Button, Input, Textarea, Select, Number Field, OTP slots                   |
| Card / popup  | 10px    | Card, popover, menus, selection popup, toast                               |
| Large surface | 12px    | Dialog, outer Frame, exposed drawer corners                                |
| Pill / circle | 9999px  | Explicit Badge pill, Avatar, Switch, slider thumb; not a universal default |

Set `--radius` to the proposed control radius for new V2 defaults. Semantic defaults can derive control-minus-2 / control-plus-4 / control-plus-6, clamped at zero. Nested surfaces derive inner corners from outer radius minus inset when physically nested. Keep edge-attached Drawer corners square at the viewport edge. Preserve Date Picker's own radius aliases until reviewed; avoid a global variable edit that silently changes it before then.

## 9. Typography and icon rules

| Role                        | Type / line height                          | Weight / treatment                                   |
| --------------------------- | ------------------------------------------- | ---------------------------------------------------- |
| Body                        | 14/22px product UI; 16/26px prose/marketing | 400                                                  |
| Control label and menu item | 14/20px regular                             | 500 label/action; 400 option text                    |
| Editable mobile control     | 16/24px                                     | 400; never disable browser zoom                      |
| Metadata / helper / error   | 12/18px; 13/20px for longer help            | 400; full-opacity semantic color                     |
| Placeholder                 | Same size/line height as entered value      | 400, muted text token; never a replacement label     |
| Section heading             | 18/26px                                     | 600                                                  |
| Page heading                | 32/40px desktop, 28/36px narrow             | 600, modest -0.02em tracking                         |
| Secondary heading           | 24/32px                                     | 600                                                  |
| Display heading             | 48/54px desktop, 32/38px mobile             | Marketing-only; keep readable line length            |
| Code / identifiers          | 13/20px mono                                | 400; tabular numbers for time, date and numeric data |

Retain Inter; no font download or licensing dependency is needed for V2. Keep control text naturally cased. Uppercase tracking is limited to short optional section eyebrows. Avoid 9–10px essential labels and strong tracking on long navigation labels.

Icon roles: indicator 12px; standard control/menu 16px; prominent lg action 20px; standalone feedback media 24px. Lucide remains the default source; retain consistent stroke width (2) except purpose-drawn checkbox indicators, which may use optical tuning. Decorative icons are aria-hidden. Icon-only actions require accessible names and matching square geometry. Use flex slots and align-items:center instead of broad negative SVG margins. Muted icon color remains legible; do not compound opacity on already muted parents. A persistent checkmark must not disappear into a selected surface.

## 10. Common interaction vocabulary

| State                 | Visual contract                                                     | Semantic / ownership rule                                                                               |
| --------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Default               | Flat surface, stable 1px boundary, normal text                      | Preserve native/Base UI semantics                                                                       |
| Hover                 | Hover surface/border, no geometry change                            | Only capable pointers; do not latch hover on touch                                                      |
| Pressed               | Pressed fill/border; no physical scale/bounce                       | Native :active for momentary actions; data-pressed is persistent on Toggle                              |
| Selected / checked    | Stable marker/check + selected fill or primary indicator            | Use actual primitive checked/selected state; not hover or DOM order                                     |
| Expanded / open       | Active boundary; optional chevron rotation; trigger remains legible | Read rendered data-popup-open/data-open or aria-expanded per primitive                                  |
| Highlighted option    | Shared hover surface and text                                       | Respect focus-managed or aria-activedescendant list behavior; do not move browser focus manually        |
| Focus-visible         | Single opaque focus contour                                         | Keyboard-visible owner; no second nested ring                                                           |
| Disabled              | Explicit disabled text/fill/border; suppress hover/press            | Preserve true disabled/aria-disabled behavior and Base UI data-disabled; never use color as enforcement |
| Read-only             | Normal readable text, muted surface; selectable/copyable value      | Keep focus/copy where allowed; do not style as disabled or block allowed Autocomplete browsing          |
| Invalid / destructive | Status border, error copy/icon                                      | Invalid is field validation; destructive is action intent. They share color roles, not behavior         |
| Loading / pending     | Stable dimensions, spinner/status and clear interaction affordance  | Retain Button's disabling/loading contract and async grid/toast semantics                               |

State precedence: disabled suppresses hover/press; persistent selection survives hover; invalid border survives selection/open; focus-visible is drawn last and remains the same recognizable color. A focused invalid field combines a destructive border with the common focus contour. Loading inherits the owning component's disabled policy. Test combined states explicitly, including selected+disabled and open+invalid+focus.

## 11. Focus treatment

Proposed standard: **2px opaque outline in `--cn-focus-color`, 2px offset**, following the visible control contour. Do not simultaneously apply a Tailwind ring and an outline. Border thickness stays unchanged; borders may keep their state color. The outline is a focus indicator, not popup elevation.

- Button, Toggle, checkbox/radio/switch, standalone actions and tabs: focus-visible on the actual interactive element.
- Input/Textarea: the outer visible shell draws the contour through `:has(input:focus-visible)` / `:has(textarea:focus-visible)`; inner input outline is suppressed only because that shell owns the visible focus.
- Composite controls: exactly one contour for the text-entry owner. Independently focusable clear/stepper/addon actions need their own visible contour; parent input focus must not remain drawn around them. Multi-chip controls must expose which chip/remove action is focused.
- Menu/listbox active descendants: use the primitive's highlighted item treatment. A clipped compact row may use a 2px **inset** contour where necessary; same color/thickness, documented containment exception. Avoid adding a ring to every highlighted item and the popup simultaneously.
- ScrollArea viewport: retain keyboard focus visibility; scrollbar/thumb focus treatment must not obscure content.
- Date Picker: retain the complete caption outline and its 2px offset. Calendar day inset focus is an intentional containment exception. Never replace the caption with a tiny chevron ring.
- In forced colors, use a system Highlight outline and preserve native visibility. Do not disable forced-color adjustment globally. Ensure sticky headers, clipping, adjacent controls and nested surfaces do not obscure focus.

Acceptance target: all interactive focus visible, not obscured, and at least 3:1 against adjacent surfaces. Aim additionally for the 2 CSS-pixel perimeter area and focused/unfocused contrast requirements of WCAG 2.4.13 (AAA); this is a design target, not a current conformance claim. Normal text targets 4.5:1; essential non-text control boundaries/indicators target 3:1. See the primary references below for criteria and exceptions.

## 12. Shadows, layering and backdrop

| Role / proposed token           | Light                                                            | Dark                                  |
| ------------------------------- | ---------------------------------------------------------------- | ------------------------------------- |
| Control / `--cn-shadow-control` | `none`                                                           | `none`                                |
| Card / `--cn-shadow-card`       | `0 1px 2px rgb(17 24 39 / .04)`                                  | `none` (surface + border do the work) |
| Popup / `--cn-shadow-popup`     | `0 4px 12px rgb(17 24 39 / .08), 0 1px 3px rgb(17 24 39 / .06)`  | `0 6px 18px rgb(0 0 0 / .20)`         |
| Modal / `--cn-shadow-modal`     | `0 12px 32px rgb(17 24 39 / .12), 0 2px 6px rgb(17 24 39 / .06)` | `0 16px 40px rgb(0 0 0 / .28)`        |

Cards use the existing flat/bordered/elevated variants intentionally; flat stays flat. Popups use a real 1px boundary rather than repurposing a focus ring as border. Dark elevation depends primarily on the lighter popup surface, not a broad black shadow. Remove redundant decorative pseudo-element highlights only after comparing the intended resting finish; preserve nested CardFrame clipping behavior.

Use shared modal scrim `rgb(0 0 0 / .32)` light and `.48` dark. No default blur; an application may opt into it. Dialog, Alert Dialog, Drawer and Command use the same role; notification/popup primitives do not gain a scrim. Keep correct portal/stack ownership; do not solve nested overlay behavior by raising every element to a larger z-index. Define site chrome 40, base overlay 50, notification 60 roles only where compatible with Base UI's nesting; nested modal/popups must be tested rather than overridden by a flat global z-index ladder.

## 13. Motion

| Role                        | Enter / interaction                                     | Exit              | Easing                                                                |
| --------------------------- | ------------------------------------------------------- | ----------------- | --------------------------------------------------------------------- |
| Hover/press color or border | 100ms                                                   | 100ms             | `cubic-bezier(.2,0,0,1)`                                              |
| Popup opacity / scale       | 160ms; scale .98 → 1; optional displacement ≤4px        | 100ms             | Enter `cubic-bezier(.16,1,.3,1)`; exit `cubic-bezier(.4,0,1,1)`       |
| Dialog / disclosure         | 220ms; dialog scale .98 → 1, disclosure measured height | 160ms             | Standard/enter curve                                                  |
| Drawer                      | 220ms translation                                       | 160ms             | Standard; direct gesture follows pointer without added transition lag |
| Calendar view               | Existing 160ms                                          | Existing behavior | Preserve current purposeful transitions                               |

Tokenize durations/curves; transition only properties that change. Preserve Base UI transform-origin, available dimensions, starting/ending attributes, retained popup lifecycle and swipe movement variables. Do not animate out of bounds or replace gesture transforms with an unrelated generic transform. Do not change event timing/dismissal semantics as a styling shortcut.

Reduced motion removes scale, translation, rotation, height interpolation, marquees and scroll reveals. Render content immediately; use no transition or ≤80ms opacity only. Determinate progress changes immediately. Skeleton becomes static; loading retains an accessible text/status indication even if spinner motion stops. Toast dismissals/timers still work. Honor reduced motion in JavaScript scroll/reveal behavior as well as CSS; current TOC smooth scrolling and LandingReveal need this review.

## 14. Mobile and touch rules

- Product target: 44×44 CSS px minimum for coarse-pointer actions, with at least 8px between neighboring target boxes where practical. Desktop compact actions must meet the 24px minimum or a documented applicable spacing/exception rule. The 44px target is our ergonomic goal; WCAG AA 2.5.8 has a 24px baseline with exceptions, while 2.5.5's 44px requirement is AAA.
- Prefer a real larger label row/control at coarse pointer to transparent pseudo-elements. If hit expansion is used, reserve the space, prove no overlap, and ensure it does not intercept clear/trigger/stepper neighbors. Test touch-capable wide devices; width alone is not a pointer classifier.
- Editable text uses at least 16px in mobile form contexts. Preserve browser zoom. Field labels/helpers wrap; error messages never overflow narrow forms.
- Menus and selection lists have ≥44px coarse rows, bounded width/height, internal scrolling and overscroll containment. Keep Base UI collision handling and virtual-keyboard behavior. No automatic select-to-drawer replacement in this foundation.
- Drawers use dynamic viewport limits, safe-area padding, a single scrolling body and reachable close/actions. Preserve Root swipe direction versus styled side contract; do not change gestures incidentally. A drag handle is visual support, not the only close method.
- Dialogs retain viewport margins (at least 16px, safe areas permitting), max-height based on `100dvh`, and an accessible internal scroll owner. Confirm the primary action remains reachable with the virtual keyboard open.
- Date Picker's desktop geometry stays protected. Its small navigation controls and 28px baseline day buttons need a **separate coarse-pointer layout** review. Aim for larger calendar targets through an intentional full-width layout/density option, not overlapping 44px invisible boxes in a seven-column grid. Preserve day/year/month/range alignment and caption proportions in that review. Multi-month ranges need a bounded scroll or deliberate single-column presentation; never shrink labels until they fit.
- Time Picker's existing explicit mobile Dialog and safe-area rules are good foundations. Review clock/list option targets, footer and narrow landscape layouts; preserve draft/OK/Cancel semantics.
- Data tables scroll horizontally within their container, not the entire page. Essential row actions remain available on touch; no hover-only commands. Test 320/390/768px, landscape, 200% zoom, and keyboard focus at narrow width.

## 15. Dark mode rules

Current dark mode includes thoughtful component-specific surface adjustments and status values; it is more than a simple filter inversion. It is incomplete as a shared hierarchy: page/card/popover share one dark value, translucencies vary, and class/media theme disagreement can apply the wrong overrides.

V2 rules:

1. Explicit `.dark` class variant in both docs and consumer CSS; test dark choice on light OS and light choice on dark OS. Include native `color-scheme` and the existing next-themes behavior in the verification.
2. Independent opaque dark page, surface, raised and popup values as specified. Borders distinguish adjacent layers even with shadows disabled.
3. Softer foreground than pure white; full-opacity muted text with measured contrast. No stacking text opacity on muted tokens.
4. Light, high-contrast focus blue; avoid thin low-opacity gray halos. Invalid border and common focus remain distinct.
5. Explicit disabled roles applied once. Retain legible values and recognizable structure; read-only remains normally readable.
6. Status text and on-solid foregrounds are separate pairs. Check selected, hovered, invalid and disabled combinations on every dark layer.
7. No translucent white input recipes reused by accident from OS media state. Shared surfaces and borders replace arbitrary white/input opacity stacks as families migrate.
8. Custom brand themes must supply foreground pairs and pass the same state checks. Do not promise automatic accessible colors from arbitrary brand inputs.

## 16. Strong existing work to preserve

| Component / pattern                    | Preserve                                                                                                                                                                                                     | Allowed later review                                                                                            |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| Date Picker                            | Caption height equals nav size; 0.5rem caption inset, .375rem label/chevron gap, .875rem chevron; complete outline; hover/expanded; stable day/month/year/range model; tabular numerals and range continuity | Semantic color/elevation aliases, dedicated touch treatment, explicit root-scale adapter; no wholesale redesign |
| Time Picker                            | Local visual roles, clock/list modes, landscape composition, explicit mobile Dialog, safe areas, draft/commit/cancel separation                                                                              | Shared control states, focus and target dimensions                                                              |
| Button                                 | Variant/size contracts, stable loading overlay, composition and coarse-target intent                                                                                                                         | Reduce surface recipes; align geometry, colors and focus                                                        |
| Input/Field/Form                       | Wrapper composition, unstyled/nativeInput escape hatches, Base UI validation and label wiring                                                                                                                | Correct external geometry, error text, read-only and focus styling                                              |
| Tabs                                   | Primitive-derived active indicator geometry, line/default variants, orientation handling                                                                                                                     | Token/contrast/motion consistency                                                                               |
| Accordion/Collapsible                  | Measured primitive panel heights and minimal structure                                                                                                                                                       | Focus/reduced motion; no new visual ornament                                                                    |
| Separator, Progress, Skeleton, Spinner | Simple anatomy and semantic role                                                                                                                                                                             | Tokens and reduced motion only                                                                                  |
| Card/Frame/Table                       | Useful layered panel composition and context-aware borders                                                                                                                                                   | Semantic radii/surfaces; preserve joined edges and clipping                                                     |
| ScrollArea                             | Overflow ownership, gutter behavior and primitive delegation                                                                                                                                                 | Focus, thumb visibility/targeting; no new scrolling implementation                                              |

The mobile popup audit measured a **24.5px caption and 24.5px navigation button**, and 28px day buttons at the current 14px root. These are current baselines, not proposed coarse-target values. Protect complete caption geometry through every early Button/Input/Popover change. Color or radius aliases can affect calendars without editing their files: include them in each dependent-family regression check.

## 17. Website audit and modernization recommendations

Treat site chrome, product component styling and demo framing as separate layers. Improve the site after component vocabulary is stable; fix any actual accessibility blockers earlier in a narrow, separately reviewable change.

| Area                      | Current finding                                                                                                                                                                                                  | Recommended change / priority                                                                                                                                                                                                                   |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header                    | Active SiteHeader is a restrained sticky border header; docs and homepage share it. Height h-14 renders 49px plus border, while unused global header-height says 56px. Search/theme/npm/GitHub actions are small | Retain its useful structure; tokenized 56px shell, 44px mobile actions, clear active nav and focus; keep utility actions secondary. Avoid adopting unused AppHeader's pill/gradient/glass recipe                                                |
| Product navigation        | Docs/Components exist; main nav hidden below md; sidebar hidden below md                                                                                                                                         | Add a named mobile navigation drawer/browse control. Search is useful but should not be the only global docs navigation. Later distinguish Components and existing Blocks; Templates only when a real product exists                            |
| Homepage                  | Large mono headline, generous empty hero area, repeated comparative copy, decorative noninteractive component marquee and repeated sections                                                                      | Lead with a precise baseui-cn identity and real interactive component composition; one primary install/docs action; tighter section rhythm, less repeated positioning. Preserve search intent and useful educational copy through an SEO review |
| Docs sidebar              | 60 spacing units = 210px; 11px section labels, 9px badges; active background but no aria-current in source; placeholder '#' link                                                                                 | Explicit 240px token; readable section labels and 12px metadata; aria-current; remove placeholder navigation when editing; retained scroll position and keyboard access                                                                         |
| Docs typography           | Inter and sensible max-w-3xl, but prose uses 13.72px, many boxed snippets, mixed heading weights                                                                                                                 | 16/26px long prose, 14/22px compact reference text; ≤72ch readable content; 600 headings; systematic anchor offsets and spacing                                                                                                                 |
| Component pages           | Strong MDX/registry architecture, installation, examples, API and TOC; Markdown/AI actions prominent; little sequential component navigation                                                                     | Preserve content and anchors; establish one summary/preview/installation/API hierarchy; unobtrusive Previous/Next links from canonical catalog order; keep Markdown/AI tooling accessible                                                       |
| Preview framing           | Generic min-h-55 + p-8 (192.5px minimum and 28px padding here), nested bordered panes; button tabs custom rather than shared semantic tab anatomy                                                                | Adaptive preview padding 16 mobile / 24 desktop, purposeful minimum sizes, containment tests, one consistent toolbar. Preserve state when switching preview/code where appropriate; semantic tabs and keyboard focus                            |
| Examples                  | Input size demo changes the wrapper only; basic input labels unassociated; homepage showcases hand-drawn lookalikes                                                                                              | Demonstrate supported size/state APIs; use real components, associated labels and deterministic loading/error data. Add a comparative state specimen when implementation begins                                                                 |
| Code                      | Fixed black code panels in both themes, several custom renderers/gradients/copy controls, font 13px; inline syntax sometimes remains boxed within black snippets                                                 | Unify code surface/type/copy behavior; deliberate dark code theme may remain in light docs if contrast is consistent. Horizontal scroll stays within code pane; visible copy feedback; no decorative edge gradient hiding code                  |
| Search                    | Good Base UI Command/Autocomplete composition, keyboard shortcut, groups, mobile bounded popup; only component/nav label filtering; shortcut shown as Mac symbol                                                 | Preserve behavior; clearer result hierarchy, platform-aware hint, focus return, 44px touch rows, explicit empty state. Search content expansion can be separate scope                                                                           |
| Footer                    | Homepage has a restrained inline footer; docs layout has no equivalent footer or sequential navigation                                                                                                           | Shared small footer with docs/GitHub/license/changelog links; avoid a large marketing footer inside reference pages                                                                                                                             |
| Mobile                    | Input page and search fit 390px; text/content readable but controls/header small; sidebar disappears; calendar popup fits                                                                                        | Prioritize browse/navigation, touch sizing, preview padding, wide range/grid containment and safe-area dialogs. Fit at one width is not device/touch acceptance                                                                                 |
| Motion                    | Route enter 320ms, reveal 450ms, perpetual 30s marquee; reduced-motion handling incomplete                                                                                                                       | Remove default marquee and reveal dependence; short optional state transitions, immediate reduced-motion content                                                                                                                                |
| Theme plumbing            | Class/media disagreement, legacy theme storage name, unused ActiveTheme helper/alternative toggles                                                                                                               | Consolidate actual mounted path after consumer inventory; preserve saved choices when renaming storage; avoid unrelated cleanup in component phases                                                                                             |
| Documentation correctness | Bare HSL channel examples, root radius drift, generated API link assumes slug matches Base UI (Date Picker currently labels Popover but links date-picker)                                                       | Correct token examples and explicit upstream primitive links when docs are refreshed; preserve local component URLs                                                                                                                             |

### URL, SEO and docs protections

Keep `/`, `/docs`, `/docs/installation`, `/docs/theming`, `/docs/changelog`, RSS, `/docs/llms`, all **54** `/docs/components/{slug}` URLs, registry URLs, Markdown/AI exports and current heading anchors. Do not move existing Blocks out of their component documentation URLs for a navigation redesign. Keep canonical, Open Graph/Twitter, sitemap, robots and structured content behavior stable; audit any copy/heading changes separately. Snapshot current route/anchor lists before implementation and compare after each docs phase. No new `/templates` route, checkout, entitlement, marketplace or paid catalog in this effort.

## 18. Readiness for future template products

The free SaaS Starter and Agency/Studio, and premium SaaS Pro and AI Workspace, can share this foundation without looking identical. Brand/product themes may change primary color, typography emphasis and section spacing through semantic roles. Interaction, accessibility, density and state contracts remain shared. Do not fork the component source for each product.

| Product area                | Existing foundation to reuse                                          | Foundation requirement / future gap                                                                           |
| --------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Marketing / agency          | Button, Badge, Avatar, Card, Accordion, Navigation Menu               | Prose/display type and spacious layouts; same states; future marketing blocks are separate work               |
| Dashboards / tables         | Frame, Card, Table, Data Grid, Tabs, Menu                             | Clear data density, selected rows, toolbar alignment and robust editors                                       |
| Authentication / onboarding | Login/Signup blocks, Field/Form, OTP, Progress, Dialog                | Readable errors, password helpers, touch sizing, stable pending states                                        |
| Pricing / billing           | Card, Table, Badge, Switch/ToggleGroup, Alert Dialog                  | Currency alignment, plan selection, status semantics; no payment or business logic added                      |
| Settings / forms            | Input family, choice controls, selection family, Date/Time            | Shared geometry, read-only/invalid/disabled differentiation and helper spacing                                |
| AI/chat                     | Command, Textarea/InputGroup, ScrollArea, Menu, Spinner, Alert, Toast | Multi-line composer sizing, long text, streaming/pending/stopped/error states; no invented chat component now |

Missing template-specific shells, charts or conversation blocks should be assessed in their product projects. Do not expand V2's component catalog to satisfy hypothetical templates during foundation work.

## 19. Exact recommended implementation order

This plan is Phase 0. Every later phase is a separate reviewable change after direction approval. The Date/Time protection checks run throughout; placing their final review late does not defer regression protection.

| Phase                                      | Exact order / scope                                                                                                                                                                            | Why / exit checkpoint                                                                                                                                                                                                                  |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **0 — Direction and baseline**             | Review this specification; capture current geometry/state images and route/anchor inventory; agree palette, density and focus                                                                  | No broad styling edits. Agree defaults and the temporary docs scale bridge before implementing                                                                                                                                         |
| **1 — Tokens and basic anatomy**           | Shared theme source + consumer distribution + class-based dark variant + owned motion definitions → Button → Input → Textarea → InputGroup → Label → Badge → Avatar → Separator → Card → Frame | InputGroup/Label move early because selection depends on them; Card/Frame move early because they establish surface vocabulary. Validate exact border boxes, aliases, nesting and fresh/custom consumer install. No global html rebase |
| **2 — Forms and persistent controls**      | Field/error text → Form → Fieldset → Checkbox → CheckboxGroup → RadioGroup → Switch → NumberField → Slider → OTPField → Toggle → ToggleGroup                                                   | Complete shared validation/disabled/touch semantics before selection. Verify native submission, controlled/uncontrolled state, label clicks, keyboard and combined states                                                              |
| **3 — Selection and search**               | Select → Autocomplete → Combobox → Command list/input/chips                                                                                                                                    | Autocomplete precedes Command because Command delegates to it. Unify option rows and chip actions; preserve async filtering, empty/status, multi-select, clear and anchor sizing. Command modal shell waits for Phase 5                |
| **4 — Anchored overlays and menus**        | Popover → Tooltip → PreviewCard → DropdownMenu → Menubar popup/items/submenus                                                                                                                  | One popup frame and item anatomy; Menubar stays with its shared menu styling. Verify nested/collision/available-size behavior and keyboard highlight; no new Context Menu                                                              |
| **5 — Modal surfaces**                     | Dialog → AlertDialog → Drawer → Command modal shell                                                                                                                                            | Shared scrim and modal frame, scroll bounds, safe areas, focus return and nesting. Exercise Select/Combobox/Toast inside Drawer/Dialog; do not alter gesture mechanics                                                                 |
| **6 — Navigation and disclosure**          | Tabs → Accordion → Collapsible → NavigationMenu → Breadcrumb → Pagination → Menubar root integration check                                                                                     | Preserve geometry-driven indicators/panels; align focus/spacing, orientations and anchors. Menu internals already stable                                                                                                               |
| **7 — Feedback, data and existing blocks** | Alert → Toast → Progress → Skeleton → Spinner → Item → ScrollArea → Table → Data Grid (including Rating) → canonical Empty State block → Login → Signup → local Empty/Kbd consumer consistency | Data Grid requires stable form/menu/modal layers first. Verify virtual/DnD geometry, editor pending/failure/rollback, row selection, action reachability; adapt blocks only after their dependencies                                   |
| **8 — Date/Time consistency review**       | Date Picker aliases/focus protection and narrow ranges → dedicated coarse calendar geometry review → Time Picker aliases/targets → cross-family state/contrast sweep                           | Preserve caption/nav equality, complete focus ring, all calendar views and ranges; preserve time draft/commit/cancel. Prepare root-scale adapter only with measured proof; keep geometry if uncertain                                  |
| **9 — Website polish**                     | Header/mobile browse → docs sidebar/type/content width → component pages/preview/code/search → homepage → footer → SEO/route/anchor verification                                               | Apply approved component language to chrome. Rebase docs root to 100% only after Phase 8 proof; remove temporary unit bridge and compare consumer/site parity. No marketplace/templates                                                |

If a shared token tweak changes an unmigrated dependency, isolate it behind the V2 boundary or include the dependent component's explicit regression review. Do not silently widen a phase into a repository rewrite.

### Definition of done for each implementation phase

1. Record the intended component/state diffs, supported aliases and any documented exceptions. Preserve exports, props, refs, slots, data attributes, controlled behavior and render composition unless separately approved.
2. Compare actual rendered geometry and state specimens in light/dark, with user theme opposite OS theme, keyboard/pointer, disabled/read-only/invalid/selected/open/loading combinations and reduced motion. Measure focus/contrast on the final composited surface, not only tokens.
3. Check 320/390/768px and desktop, 200% zoom, long labels/localized content, RTL where supported, overflow and forced colors. Later mobile acceptance includes physical iOS/Safari, virtual keyboard and touch gestures; desktop emulation is insufficient for those claims.
4. Protect Date Picker caption/nav/day/year/month/range geometry and Time Picker commit semantics whenever Button/Input/Popover/Dialog/tokens change. Protect Data Grid row/editor dimensions when forms/menus change.
5. Run available TypeScript projects, lint, official generation and production builds for source changes. This repository has no existing test runner/typecheck script; use actual installed `tsc --noEmit` through each workspace rather than inventing a command. Add targeted meaningful regression coverage for state/lifecycle risks; do not generate tests that merely repeat class strings.
6. Run `pnpm build:all` when source/examples/docs require it; verify embedded source and byte/checksum parity across all three registry locations. Validate fresh CLI install, missing-token merge, preserved custom themes and repeated init idempotence in disposable consumer fixtures. Never overwrite user theme values to obtain visual parity.
7. Confirm all component routes and retained anchors/metadata still work; inspect final diff and `git diff --check`. Each family should be independently reviewable/revertible on the feature branch. No release/deployment is implied.

## 20. Risks and mitigations

| Risk                                                 | Impact                                                                                      | Mitigation                                                                                                                                        |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Root/spacing/font change                             | Silent whole-site and Date/Time resize; responsive breakpoint behavior changes              | Keep 14px root during migrations; V2 unit bridge; isolated consumer fixture; gated final rebase                                                   |
| Shared token alias change                            | Untouched calendars/blocks acquire new geometry/colors early                                | Explicit V2 boundary, local legacy adapters and dependent-family checks; no mass radius edit                                                      |
| Theme class/media mismatch                           | User-selected theme contains wrong per-component styles                                     | Fix the strategy at foundation level; test opposite OS/user settings and generated consumer CSS                                                   |
| Token explosion                                      | Harder theming and inconsistent custom overrides                                            | Three levels, small role vocabulary, two-consumer evidence before helper abstraction; document aliases                                            |
| Copied-code consumers                                | New component assumes unshipped tokens/utilities; CLI preserves outdated existing variables | Fresh and partial-install fixtures; canonical defaults/mappings; documented additive upgrade and fallbacks; no automatic custom-value replacement |
| State selector changes                               | Invisible focus/animation/disabled states despite successful compilation                    | Inspect rendered Base UI attributes for each primitive; targeted runtime QA; no copied Radix state assumptions                                    |
| New colors                                           | Attractive swatches fail text/indicator/selected/focus contrast                             | Verify actual composites and every state pair; separate status text from on-fill text; record ratios                                              |
| Hit target enlargement                               | Invisible hit areas steal neighboring controls/chips/stepper taps                           | Real layout targets; no overlap; touch tests at narrow and wide widths                                                                            |
| Overlay/motion changes                               | Transforms conflict with gestures, nested focus or popup lifecycle                          | Keep primitive contracts and positioning variables; transition owned properties; nesting/device QA                                                |
| Data Grid density                                    | Virtual row measurements, drag overlays or editor shells drift                              | Preserve measurement contracts, verify virtual/DnD/edit states after form/menu work                                                               |
| Duplicate Empty implementations / support components | Wrong source edited, hidden exports removed                                                 | Follow metadata and consumer imports; retain all public surfaces until explicit consolidation scope                                               |
| Website repositioning                                | SEO/anchors/routes or copy-and-own clarity lost                                             | Keep URLs/catalog, snapshot metadata/anchors, review copy changes separately                                                                      |
| Scope creep into templates                           | Foundation delayed by product work                                                          | Readiness matrix only; no template catalog, checkout, marketplace or new product pages                                                            |

## 21. Files examined and validation boundary

Sources were inspected in full or by targeted style/anatomy/state extraction; registry verification reads source content but does not constitute a behavioral audit of every function.

- Foundation/configuration: root and workspace `package.json` files, `pnpm-workspace.yaml`, `apps/www/AGENTS.md`, `apps/www/postcss.config.mjs`, `styles/globals.css`, both Date/Time stylesheets, `app/layout.tsx`, the theme provider/toggle/active-theme/index modules, and `docs/base-ui-v1.9.0-audit.md`.
- Component styling: **all 56 TSX files** under `apps/www/components/ui/`: accordion, alert-dialog, alert, auth, autocomplete, avatar, badge, blocks, breadcrumb, button, card, checkbox-group, checkbox, collapsible, combobox, command, date-picker, dialog, drawer, dropdown-menu, empty-state, empty, field, fieldset, form, frame, input-group, input, item, kbd, label, menubar, navigation-menu, number-field, otp-field, pagination, popover, preview-card, progress, radio-group, rating, scroll-area, select, separator, skeleton, slider, spinner, switch, table, tabs, textarea, time-picker, toast, toggle-group, toggle, tooltip. The authoritative file count should follow the directory inventory rather than treating this list as installable count.
- Data family: `components/data-grid/*.tsx`, including editing, filtering, header, visibility, pagination, scrolling, virtual and drag-and-drop table variants; metadata's editable-grid hook dependency was checked by source/registry equality rather than a new logic review.
- Distribution: `scripts/registry-meta.mjs`, `scripts/build-registry.mjs`, registry JSONs in `packages/registry/registry`, `apps/www/public/registry`, `packages/cli/registry`, `packages/registry/index.json`, generated catalog, and CLI `commands/init.ts` / `utils/ensure-styles.ts`.
- Website: `app/page.tsx`, `app/docs/layout.tsx`, `app/docs/theming/page.tsx`, `app/docs/components/[slug]/page.tsx`, shared SiteHeader/AppHeader/SiteSearch/ComponentsGrid/LandingReveal; docs sidebar, TOC, MDX typography, preview/wrapper/MDX adapter, and CodeBlock.
- Examples: targeted Input, Date Picker, Select and other family preview styling; component MDX inventory and dynamic page/source wiring. Not every one of the generated preview examples was interactively exercised.
- Rendered evidence: existing `.next/static/chunks/*.css` for theme/animation generation; browser measurements/screenshots of the representative pages described in section 1. Existing build was reused, not freshly rebuilt as proof of V2 source behavior.

Validation for this document-only change: baseline/branch/clean-tree checks, source-backed inventory, non-mutating 54-entry/70-file registry comparison, representative local browser inspection, document formatting/link/coverage review, and final whitespace/scope/status checks. TypeScript, lint, full generation and production build are **not rerun for this prose-only change**; their baseline results remain the checkpoint report's evidence, not new results in this session. New V2 colors and accessibility targets are proposed; only explicitly reported measurements/checks are completed evidence.

### Primary references consulted

- [Tailwind CSS: class-driven dark mode](https://tailwindcss.com/docs/dark-mode) — verifies the need to override the default media-driven dark variant for a `.dark` strategy.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) — text/non-text contrast, focus visibility/obscuration and target-size criteria. AA and AAA targets are distinguished above.
- [W3C: Understanding Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance) — rationale for the proposed 2px opaque focus treatment; no claim of current library-wide compliance.
- [W3C: Understanding Target Size](https://www.w3.org/WAI/WCAG21/Understanding/target-size) — 44px target and exceptions; used as an ergonomic target, alongside WCAG 2.2's AA minimum.

### Review decision

Approve or revise the concrete palette, 36px regular/44px touch geometry, 6/10/12px radius hierarchy, opaque 2px focus treatment, token compatibility/distribution strategy and migration order before applying V2 across families. This document is ready for direction review; it does not represent approved or implemented visual changes.
