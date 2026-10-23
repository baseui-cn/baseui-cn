# Design System V2 — Phase 2 implementation report

October 19, 2026. **Phase 2 implemented, behavior-reviewed and validated for its approved checkpoint** on `feature/design-system-v2`. Checkpoint parent: `2106fe8b1eee7da75708586c0a73e8cc90b8b0b1`. The final commit SHA and post-commit clean-tree result are recorded in the checkpoint handoff, outside this self-contained report.

Before editing, the working tree was clean, the branch matched, and all three handoff commits were verified as ancestors of HEAD: Base UI v1.9 `7c6fcf5996421c25a2a21d14221d4156611e1c1d`, V2 specification `776cd43117cb908a66891817bacbad1a9119546e`, and Phase 1 `2106fe8b1eee7da75708586c0a73e8cc90b8b0b1`. Both V2 documents were read in full and the committed token, control, action, surface, and consumer-install implementations were inspected before edits. No checkpoint was amended.

## Requested acceptance report

| # | Item | Result |
| --- | --- | --- |
| 1 | Files changed | 65 files: twelve wrappers, six local anatomy stylesheets, three preview sources, two component documents, two generated documentation files, three registry/fixture scripts, 36 registry copies, and this report. Exact inventory below. |
| 2 | Shared-token changes | **None.** No public `--cn-*` token added or changed. Canonical theme definition, generated theme outputs, global CSS, Phase 1 anatomy styles, and Phase 1 component sources remain unchanged. No foundation contract defect required a shared modification. |
| 3 | Field / Form / Fieldset | 6px label/control/helper/error spacing, 16px field rhythm and 24px section rhythm; 14/20 labels and 12/18 helper/error text. Error copy uses `--cn-status-destructive-text`. Required indication is explicit accessible label content, demonstrated as `(required)`, with a local `field-required` slot hook. Fieldset legend sizes/border variant remain. Disabled grouping follows Base UI's Field ownership and native Fieldset semantics. Primitive aliases, validation, IDs, descriptions, render props, refs, and generic Form submission API are preserved. Native required validation and successful structured/native submission values pass. |
| 4 | Checkbox | 16px border box, 4px corners, 12px check/minus. Checked and indeterminate fills remain distinct from unchecked hover/press. Explicit disabled/checked-disabled roles replace opacity. Invalid border retains the common blue focus contour. Label clicks and Space work. |
| 5 | CheckboxGroup | Shared 8px option rhythm and real label rows; existing group state/form behavior retained. The specimen uses FieldItem + FieldLabel so each option has its own accessible name inside the labeled group. Direct group-disabled rendering and submitted array values pass. |
| 6 | RadioGroup | 16px circular shell and 12px persistent dot. The dot uses primary against the surface, avoiding the ambiguous hollow appearance of an oversized on-primary dot. Hover keeps the selected dot recognizable. Arrow navigation, disabled selection, invalid+focus, and read-only rejection of a different option pass. |
| 7 | Switch | 36×20 track, 16px thumb, 2px inset; checked position is explicit without animation. No scale/stretch effects. Checkbox-style semantic states and real associated label targets. Keyboard toggling, read-only behavior, checked-disabled rendering, and form values pass. |
| 8 | NumberField | Uses Phase 1 control geometry/type/radius vocabulary with local composite state selectors. 32/36/40px sizes retained, including per-part size props. Input owns the outer focus contour; independently tabbable steppers have an inset 2px contour with no second outer ring. `tabIndex={0}` is set only by the **decrement and increment wrappers**, before caller props. Neither the NumberField root nor Group has a default tabIndex. The final review confirms exactly three enabled tab stops (decrement → input → increment), with no fourth wrapper stop. Base UI input keyboard behavior remains intact. Disabled-at-boundary steppers do not disable or mute the input shell. Read-only, disabled, invalid, invalid+disabled, invalid+read-only, controlled/uncontrolled values, keyboard and ref cases pass. Coarse side-by-side shell is 46px; the existing stacked-stepper composition reserves 94px for two 44px actions. |
| 9 | Slider | 4px track, 16px thumb, 24px fine-pointer / 44px coarse control region. No expanded thumb pseudo-targets. Horizontal scalar, controlled range, range endpoint keyboard behavior, vertical keyboard/mouse drag, mouse drag, emulated touch drag, disabled and invalid+focus pass. Each generated thumb has an explicit index for range SSR. Thumb count now follows the authoritative scalar/array value; a scalar previously generated two thumbs. Root aria-label is forwarded to thumb accessible labels, with endpoint suffixes for a range. |
| 10 | OTPField | Exact sm/default/lg slots of 36×40, 40×44, 44×48; 16/18/20px mono. Paste, keyboard flow, controlled value, existing auto-submit-on-completion, and input refs pass. Invalid borders retain dimensions/common focus; disabled opacity remains 1. `cn-otp-wrap` explicitly uses two rows of three. Optional container-based `cn-otp-container` + `cn-otp-responsive` rearranges full-size slots at narrow widths. The connected single-row example scrolls inside its container. No automatic size reduction. |
| 11 | Toggle | Reuses Button geometry, size classes and action styles. Persistent selected fill **plus an inset bottom marker** distinguish selected from hover/press. sm/default/lg remain 32/36/40px with no responsive shrinking; coarse actions reserve at least 44px. Selected+focus, selected+disabled, invalid+selected+focus and neighboring unselected hover remain distinguishable. |
| 12 | ToggleGroup | Existing value/size/variant/orientation APIs preserved. Outline groups retain joined corners/boundaries, focus stacking, optional separators and vertical composition. Real adjacent boxes have no negative-margin or pseudo-target overlap. Keyboard arrows/selection and disabled group rendering pass. Separator registry dependency is now declared. |
| 13 | State matrix | PASS for the representative rendered matrix and combined-state assertions described below. 58 primary browser assertions, 11 additional edge assertions and two stacked-stepper target assertions passed. Unsupported read-only/loading APIs were not invented. |
| 14 | Coarse / touch targets | PASS under Chromium CDP coarse-pointer/touch emulation at 320, 390, 768 and 1440px. Associated choice labels reach at least 44px; number actions are independent 44px targets; horizontal Slider interaction region is 44px with a 16px thumb; joined toggles have nonoverlapping real boxes. Stacked number steppers are each 44px in a 94px shell at 390/1440px. Adjacent action touch taps leave the vertical Slider unchanged. Bare choice indicators intentionally retain compact geometry and require the demonstrated associated label composition. OTP retains its separately approved slot geometry. |
| 15 | Light / dark | PASS in the consolidated docs specimen and independent copied consumer. All eight protected Phase 1 families also received light/dark browser smoke review. Error text/page contrast measured 6.15:1 light and 9.41:1 dark; focus/selected surface 4.24:1 and 5.32:1. These measured pairs are not a library-wide accessibility certification. |
| 16 | OS / app disagreement | PASS for both app-light/OS-dark and app-dark/OS-light. Persisted next-themes choices in the production docs produce identical control styles under either OS preference. Consumer class-based themes also pass both directions. No component `prefers-color-scheme` overrides added. |
| 17 | Consumer / CLI fixtures | PASS: twelve sequential Phase 2 additions over a fresh Phase 1 theme; existing customized values/source/anatomy CSS; partial installations and reverse order; repeated add/init; installed component/style import closure. Existing Phase 1 sequential-install and eight theme-merge/idempotence fixtures remain passing. Copied sources compile with strict TypeScript and render without website globals at a normal 16px root; a 20px root scales regular NumberField to 45px and default OTP to 50×55. Dependency package installation is stubbed offline and workspace-installed modules supply the browser fixture. No published-registry/network package-install claim. |
| 18 | Phase 1 regression | PASS: Button, Input, Textarea, InputGroup, Badge, Avatar, Card and Frame rendered/smoke-reviewed in light/dark production docs and together in the consumer. Ref checks, loading Button rendering, and the Input/Button visual rhythm remain intact. Foundation component and anatomy files are byte-unchanged from HEAD. |
| 19 | Date Picker | PASS: exact captured protected geometry and existing heading anchors. Caption/nav 24.5px, July caption width 88.125px, 7px insets, 5.25px gap, 12.25px chevron, 28px days, 33.25px year/month buttons. Complete 2px/2px caption outline remains; year/month navigation and range continuity pass. TSX/styles unchanged. |
| 20 | Time Picker | PASS: exact captured input/clock/list/action geometry and heading anchors. Default input remains 33.5px, clock 238px. Draft preview, Cancel rollback, OK commit and mobile Dialog relationship pass (390px viewport). TSX/styles unchanged. Surrounding Field typography/spacing intentionally follows this phase. |
| 21 | TypeScript | PASS: actual `tsc --noEmit` in www and CLI workspaces, strict copied-consumer TypeScript, and production-build type checking. |
| 22 | Lint | PASS: `pnpm lint`, with no warnings or errors in the final run. |
| 23 | Builds | PASS: official `pnpm build:all`, CLI CJS/declaration build, and final Next.js production build (60 generated pages). No package/dependency/version changes. |
| 24 | Registry consistency | PASS: 54 installables, 91 embedded source/style occurrences, source equality, SHA-256/byte equality among all public/package/CLI copies and index equality. Required/registry dependency metadata and shipped stylesheet imports are checked. Each of 54 production-served registry JSON responses also equals its checked-in public file byte-for-byte. |
| 25 | Routes / docs | PASS: 117 production HTTP checks covering 54 component routes, 54 registry routes and nine public/docs/metadata routes. Official output contains 54 markdown documents and 309 preview sources. Existing heading anchors are preserved; Field adds System specimen and OTP adds Narrow six-slot layouts. No route, catalog, navigation, SEO or website redesign. |
| 26 | Browser QA | Desktop Chromium: consolidated family review, representative individual docs pages, standalone consumer matrix, 320/390/768/1440px, keyboard traversal (21 actual tab stops in the specimen), hover/press/focus, native validation/submission, copyable read-only fields, coarse/touch emulation, range/vertical dragging, reduced motion, forced colors, RTL and 200% CSS-zoom reflow. Evidence paths below. Disabled Radio items retain Base UI's focusable aria-disabled behavior; no primitive semantics were replaced to change it. |
| 27 | Physical-device limits | Physical iOS/Safari, physical touch, native virtual keyboards and browser-chrome zoom were not available or claimed. CDP touch emulation and CSS zoom are explicitly simulations. |
| 28 | Plan deviations / implementation choices | No scope or public-foundation deviation. Local composite selectors avoid treating a boundary-disabled stepper as a disabled NumberField. Inset stepper focus is a containment exception. The scalar Slider thumb-count correction supports its existing API. OTP compact layout is explicit and does not resize slots. The optional next-dev-loop skill requires Next ≥16.3; the pinned 16.1.7 repository was preserved and supported production/browser tooling used instead. No Phase 3 work. |
| 29 | Whitespace | PASS: `git diff --check`, including the report and final generated outputs. |
| 30 | Git status | All 65 Phase 2 files reviewed and included in the single authorized checkpoint, `feat: implement Design System V2 form controls`, on `feature/design-system-v2`. The parent remains the Phase 1 checkpoint; no prior checkpoint is amended. Final SHA and post-commit clean-tree verification are reported in the checkpoint handoff. No push, merge, publish, deploy, version bump or Phase 3 work. |

## State review and ownership

The matrix covers resting, hover, momentary press, focus-visible, invalid, checked/selected, selected+focus, invalid+focus, disabled, checked+disabled, group-disabled, and read-only where the primitive supports it. Persistent check/dot/position/marker survives transient feedback. Disabled roles suppress hover/press and avoid nested opacity. Invalid controls keep a status boundary while focus remains the normal blue contour. Loading is exercised only through the existing Phase 1 Button contract.

Field, FieldItem, Form and the primitives retain validation/label/description ownership. The specimen's group options use separate FieldItem label contexts, rather than allowing the group label to replace each option's name. Fieldset examples wrap controls in Field so Base UI's existing disabled context reaches custom controls. Styling does not enforce behavior.

NumberField deliberately consumes Phase 1's `cn-input-control`/`cn-input` anatomy and semantic vocabulary without applying the text-only shell's broad descendant-disabled/read-only selectors to its buttons. Side-by-side and stacked actions occupy layout space; their contained focus outlines avoid clipping and a duplicate outer ring. Caller refs, render props, events and stepper `tabIndex` overrides still flow through.

## Final behavior review and checkpoint audit

### NumberField root tab stop: no extra stop exists

The pre-Phase-2 source at `2106fe8` and the final `components/ui/number-field.tsx` both spread caller props onto Root without supplying a default `tabIndex`. The same is true of Group. Base UI 1.9's `number-field/root/NumberFieldRoot.js` renders a normal `div` without a default tabIndex or root keyboard handler. Its separate hidden form/autofill input has `tabIndex: -1`; focusing that hidden input delegates to the editable input. NumberField input keyboard handling is implemented in `number-field/input/NumberFieldInput.js`, and the steppers preserve their primitive button actions.

The previous acceptance row's “wrapper default” wording referred to the two **stepper wrappers**, not the root. It has been corrected above. Base UI defaults its stepper buttons to `tabIndex: -1` because input arrows can operate the value. Phase 2 explicitly opts each independent action into the tab sequence with `tabIndex={0}`, while allowing callers to override it through the existing props. That choice satisfies the approved independent-action requirement and does not add root focus.

Fresh SSR and hydrated-browser evidence confirms:

- Default root: no `tabindex` attribute, DOM `tabIndex === -1`. Group and hidden form input are also absent from sequential keyboard navigation.
- Forward sequence: before-action → decrement → editable input → increment → after-action. Reverse traversal is the exact reverse. There is no extra root/group stop.
- In both light/dark modes, input focus draws the outer contour; stepper focus draws only that action's inset contour. No duplicate outer ring.
- Root focus is not needed for ArrowUp, Home/End, min/max, controlled state, uncontrolled state, pointer stepping, Enter/Space stepper activation, or any ref contract.
- Root, Group, editable input, hidden inputRef, decrement and increment refs all resolve to their expected DOM elements. Caller-supplied root `tabIndex={0}` and stepper `tabIndex={-1}` remain supported as before.

**Conclusion: no NumberField component code change was required during the final review.** There was no default root tabIndex to remove. An additional default root tab stop would be unnecessary and is not part of this implementation or its accessibility contract.

### Slider scalar thumb count: retain the legitimate correction

The existing wrapper's public props are `SliderPrimitive.Root.Props`, which already accept `number | readonly number[]` for controlled `value` and uncontrolled `defaultValue`. Base UI 1.9's `slider/root/SliderRoot.js` chooses controlled `value`, otherwise `defaultValue ?? min`, and normalizes a scalar into one internal value. Array values remain arrays. The local docs/examples demonstrate `[50]` for a one-thumb slider and `[20, 80]` for a two-thumb range; they contain no contract giving a scalar two thumbs.

The old wrapper counted thumbs with `Array.isArray(value)`, then `Array.isArray(defaultValue)`, otherwise `[min, max]`. Therefore `defaultValue={35}` incorrectly created **two controls for the same scalar value 35**. It did not create a meaningful min/max range. A controlled scalar paired with an array default could also incorrectly take its thumb count from the ignored default.

A fresh server-render comparison against the actual pre-Phase-2 wrapper proves that old `defaultValue={35}` yields two duplicate range inputs, while the final wrapper and a native Base UI scalar composition each yield one. The final implementation follows the authoritative `value ?? defaultValue ?? min`, maps a scalar to one value, and supplies explicit thumb indices for array SSR. It does not change the public prop/value/callback API.

The final SSR + hydration/browser fixture checks eleven cases: controlled scalar, uncontrolled scalar, zero scalar, omitted value using min, one-element array, controlled two-value range, uncontrolled two-value range, three-value array, controlled scalar overriding an array default, controlled array overriding a scalar default, and a Field-labeled scalar. Every case has the exact expected initial values and thumb count before and after hydration. Keyboard updates and external controlled updates retain scalar numeric callbacks or array callbacks as appropriate; changing an array endpoint leaves other values intact. No hydration recoverable errors occurred.

Accessible names also pass: an explicitly labeled scalar keeps its name, range/array thumbs receive numbered names, and the existing Field label association remains intact when no explicit aria-label is supplied. Existing unlabeled usage still requires a consumer-provided accessible label; no name is fabricated from an unrelated string.

**Conclusion: retain the Phase 2 Slider fix. No additional Slider component code change was required during the final review.** Scalars render exactly one thumb; arrays render one thumb per supported value. Reverting this would restore duplicated controls for a scalar and would not preserve a valid API contract.

### Final checks and scope

The complete Phase 2 source/style/preview/docs/fixture diff was reviewed. The 36 generated registry files are verified against canonical source, metadata and the three identical distribution copies. Generated markdown changes only Field/OTP; generated preview changes only the new Field specimen and OTP previews. An exact allowlist confirms all **65 files** belong to Phase 2.

The canonical shared theme definition, generated theme outputs, Phase 1 foundation sources/styles, Date/Time sources/styles, all package manifests and lockfiles are unchanged from the checkpoint parent. All three handoff commits remain intact in history. Registry dependency metadata only declares pre-existing Fieldset/CVA and ToggleGroup/Separator imports for complete copied installations; no runtime package, installed dependency or version is added or upgraded. No Phase 3 component implementation is present.

Final review evidence is retained at `/private/tmp/baseui-v2-phase2-checkpoint/`: `ssr-results.json`, `browser-results.json`, `browser-review.log`, `reviewed-files.json` and the SSR/consumer fixture scripts. **38 fresh targeted browser assertions pass**, including NumberField tab/focus/ref/action behavior and hydrated Slider scalar/range contracts. The required TypeScript, lint, theme/CLI fixtures, registry consistency, `build:all`, production build, route and whitespace checks pass again for the checkpoint. Component code was unchanged by this review; this report clarifies the findings.

## Reproducible checks and evidence

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

Local disposable fixtures, QA scripts, logs, measurements and screenshots are retained in `/private/tmp/baseui-v2-phase2/`. The consolidated specimen is in [Field documentation](http://localhost:3103/docs/components/field#system-specimen). The copied consumer is served at [localhost:3104](http://localhost:3104/).

- [Independent consumer, light](/private/tmp/baseui-v2-phase2/consumer-light.png) and [dark](/private/tmp/baseui-v2-phase2/consumer-dark.png).
- [Docs specimen, desktop dark](/private/tmp/baseui-v2-phase2/docs-system-1440-dark.png), [320px light](/private/tmp/baseui-v2-phase2/docs-system-320-light.png), and [320px continuation](/private/tmp/baseui-v2-phase2/docs-system-320-light-bottom.png). Additional 390/768px and coarse-pointer captures are in the same directory.
- `browser-results.json`, `extra-results.json`, `stacked-target-results.json`, `docs-results.json`, `routes.json`, `date-picker-geometry.json` and `time-picker-geometry.json` contain assertion/geometry results. Browser scripts use rendered attributes, values, geometry and computed styles, not class-string expectations.
- `consumer/` contains actual CLI-copied code/theme/styles, browser fixture and CLI log. No website CSS is imported.
- `picker-qa.log`, `build-all.log`, `build-cli.log`, `build-production.log`, `theme-fixtures.log` and `cli-fixtures.log` retain reproducible output. Registry and theme fixtures also retain their temporary directories as printed in the logs.

## Complete file inventory

- `apps/www/components/previews/field-previews.tsx`
- `apps/www/components/previews/otp-field-previews.tsx`
- `apps/www/components/previews/phase2-system-preview.tsx`
- `apps/www/components/ui/checkbox-group.tsx`
- `apps/www/components/ui/checkbox.tsx`
- `apps/www/components/ui/field.tsx`
- `apps/www/components/ui/fieldset.tsx`
- `apps/www/components/ui/form.tsx`
- `apps/www/components/ui/number-field.tsx`
- `apps/www/components/ui/otp-field.tsx`
- `apps/www/components/ui/radio-group.tsx`
- `apps/www/components/ui/slider.tsx`
- `apps/www/components/ui/switch.tsx`
- `apps/www/components/ui/toggle-group.tsx`
- `apps/www/components/ui/toggle.tsx`
- `apps/www/content/docs/components/field.mdx`
- `apps/www/content/docs/components/otp-field.mdx`
- `apps/www/lib/__generated__/docs-markdown.json`
- `apps/www/lib/__generated__/preview-sources.json`
- `apps/www/public/registry/checkbox-group.json`
- `apps/www/public/registry/checkbox.json`
- `apps/www/public/registry/field.json`
- `apps/www/public/registry/fieldset.json`
- `apps/www/public/registry/form.json`
- `apps/www/public/registry/number-field.json`
- `apps/www/public/registry/otp-field.json`
- `apps/www/public/registry/radio-group.json`
- `apps/www/public/registry/slider.json`
- `apps/www/public/registry/switch.json`
- `apps/www/public/registry/toggle-group.json`
- `apps/www/public/registry/toggle.json`
- `apps/www/styles/choice-control.styles.css`
- `apps/www/styles/form.styles.css`
- `apps/www/styles/number-field.styles.css`
- `apps/www/styles/otp-field.styles.css`
- `apps/www/styles/slider.styles.css`
- `apps/www/styles/toggle.styles.css`
- `docs/design-system-v2-phase2-report.md`
- `packages/cli/registry/checkbox-group.json`
- `packages/cli/registry/checkbox.json`
- `packages/cli/registry/field.json`
- `packages/cli/registry/fieldset.json`
- `packages/cli/registry/form.json`
- `packages/cli/registry/number-field.json`
- `packages/cli/registry/otp-field.json`
- `packages/cli/registry/radio-group.json`
- `packages/cli/registry/slider.json`
- `packages/cli/registry/switch.json`
- `packages/cli/registry/toggle-group.json`
- `packages/cli/registry/toggle.json`
- `packages/registry/registry/checkbox-group.json`
- `packages/registry/registry/checkbox.json`
- `packages/registry/registry/field.json`
- `packages/registry/registry/fieldset.json`
- `packages/registry/registry/form.json`
- `packages/registry/registry/number-field.json`
- `packages/registry/registry/otp-field.json`
- `packages/registry/registry/radio-group.json`
- `packages/registry/registry/slider.json`
- `packages/registry/registry/switch.json`
- `packages/registry/registry/toggle-group.json`
- `packages/registry/registry/toggle.json`
- `scripts/check-cli-install-fixtures.mjs`
- `scripts/check-registry-consistency.mjs`
- `scripts/registry-meta.mjs`
