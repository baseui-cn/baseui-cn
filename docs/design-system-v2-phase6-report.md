# Design System V2 — Phase 6: navigation and disclosure

October 20, 2026. **Implemented and locally validated; intentionally uncommitted.**

## Isolation and scope

- Worktree: `/private/tmp/baseui-cn-phase6`.
- Branch: `feature/design-system-v2-phase6`.
- Starting and final HEAD: `f73d65dbcc4c663342363bcf5fefbf0ccf2a86c9` (`feat: implement Design System V2 modal surfaces`). HEAD, the dedicated branch and an empty worktree status were verified before editing.
- The primary `feature/design-system-v2` checkout was read only. Its HEAD still matches the checkpoint and its status is clean at final review. No Phase 7 work was imported. No commit, amend, staging, merge, cherry-pick, push, publication, deployment or later phase was performed.
- Read the V2 plan, current Phase 4 correction/acceptance sections and Phase 5 report. The latest neutral Graphite/Iris correction governs this implementation. Palette, borders, radii, focus vocabulary, theme API and active-state philosophy are preserved; zero new public theme tokens and zero public `--cn-*` variables.

## Component acceptance

| Family         | Result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tabs           | Retains `default`, `underline`, `line`, all exported aliases, controlled state, manual/automatic activation and both orientations. The existing primitive width/height/left/bottom indicator formula is unchanged. Default is a quiet neutral rectangle without a tray or shadow; only the existing underline uses restrained Iris. Actions use 36px minimum height and 44px coarse targets. Keyboard tab and panel focus use one opaque 2px outline with 2px offset. Native disabled tabs remain focusable by arrows and cannot activate.                                                                                                                                      |
| Accordion      | Keeps primitive Root/Item/Header/Trigger/Panel composition, expanded/controlled/multiple semantics and native measured-height lifecycle. Plain headings, existing structural separators, readable disabled text, 160ms height/chevron motion and clear focus. Dynamic content returns to the primitive's `auto` height after transition. Base UI 1.9's ordinary Tab navigation is preserved; deprecated arrow roving is not reintroduced.                                                                                                                                                                                                                                       |
| Collapsible    | Keeps the primitive aliases and measured-height transitions, including nested disclosures and exit unmounting. Adds a clear focus owner to plain triggers and 44px coarse targets. Composed Button triggers retain their size/variant geometry (32px small in the standalone consumer); no panel frame or new behavior is added.                                                                                                                                                                                                                                                                                                                                                |
| NavigationMenu | Keeps Root/List/Item, Portal/Positioner/Popup/Viewport composition, positioning props/defaults, native content handoff directions and geometry variables. Uses the approved opaque popup, 1px structural border, 10px radius and restrained downward shadow. Current links use a neutral surface/weight with native `aria-current`. Removes inherited link-focus suppression; links have a 2px inset outline inside the clipped viewport. Opening, root arrows, Tab entry, Escape/focus return, close-on-click links, popup reuse, long-list scrolling and narrow bounds pass. No decorative gradient/glass/glow; the old example gradient is replaced with neutral muted fill. |
| Breadcrumb     | Aligns 14/20 typography, logical spacing, 12px separators and focus. Keeps navigation/list structure, `aria-current="page"`, hidden decorative separators and `render` composition. Long current names wrap; separators reverse in RTL. Coarse links occupy real 44px targets.                                                                                                                                                                                                                                                                                                                                                                                                  |
| Pagination     | Reuses existing Button/action geometry and size APIs. The current page retains its outline plus medium emphasis and `aria-current="page"`; no selected pill. Groups wrap to keep coarse targets valid. Existing custom-render styling ownership remains intact.                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Menubar        | Implementation and Phase 4 internals/styles are byte-unchanged. Combined specimen checks root switching File ↔ Edit, disabled action state, Escape and focus return. Existing neutral popup/row language remains.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

All six edited wrappers compare equal to HEAD after removing visual class expressions and the added stylesheet import from their ASTs. Exports, primitive props, event handlers, refs, data slots, render composition and runtime logic are unchanged. The result is recorded in `scope-review.json`.

## CLI, registry and documentation

`navigation.styles.css` is imported by each of the six components and shipped through the existing official `componentStyles` metadata map as a style file. No CLI implementation or generated JSON was hand-edited. It works in a fresh CLI-copied consumer at a normal 16px root with generated consumer theme CSS and no website globals. Website anatomy uses the existing component unit.

The expanded existing CLI fixtures cover eleven Phase 6 scenarios: incremental, custom theme, partial, reverse, and each of the seven requested families independently. They verify recursive local import closure, shared CSS/source customization preservation and repeated init/add. The full earlier fixture suite also passes. Dependency installation is stubbed in these offline fixtures; installed workspace packages supply the runtime. This is not a published-network-install result.

The Tabs docs add one combined navigation/disclosure specimen. All six component docs explain manual stylesheet copying; existing headings/anchors remain. Existing explicit custom Tabs examples remain supported. Official generation produces 54 installables, 110 embedded source/style occurrences, three identical registry distributions, 54 Markdown documents and 313 previews. All 117 production HTTP routes pass, with served registry responses equal to generated source bytes.

## Validation and regression evidence

| Check                   | Result                                                                                                                                                                                                                                                                                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| TypeScript              | PASS: website and CLI `tsc --noEmit`, strict copied-consumer compilation including edge/render fixtures, and production build type checking.                                                                                                                                                                                                                 |
| Lint                    | PASS: `pnpm lint`, no warnings/errors.                                                                                                                                                                                                                                                                                                                       |
| Theme                   | PASS: `theme:check` and all eight `theme:fixtures` scenarios. Theme definition, generated theme outputs and CLI theme implementation are byte-unchanged.                                                                                                                                                                                                     |
| Generation/distribution | PASS: `build:all`, `registry:check`, CLI build (CJS and declarations), full `cli:fixtures`.                                                                                                                                                                                                                                                                  |
| Production              | PASS: Next.js 16.1.7 optimized build, 60 generated pages; final 117 route/registry HTTP checks. Package manifests, versions and lockfile are unchanged.                                                                                                                                                                                                      |
| Phase 6 browser         | PASS: 88 primary checks and eight supplementary checks; 34 final production documentation checks. Covers keyboard/focus, default/line/vertical indicator geometry, native disabled policy, measured/nested/dynamic disclosure behavior, long NavigationMenu scrolling, popup handoff, anchor semantics, current-page controls and Button render composition. |
| Responsive/themes       | PASS: 320/390/768/1440px, fine/coarse pointers and light/dark with opposing OS theme, 44px coarse targets, reduced motion, forced colors and RTL layout. A 200% document-CSS-zoom NavigationMenu bounds specimen passes. Screenshots were visually inspected in light/dark at desktop and 320px, plus default/vertical Tabs and focused popup links.         |
| Rendered contrast       | PASS: against the consumer page, focus 3.85:1 light / 7.09:1 dark; Iris underline 4.94:1 / 9.20:1; body text 14.76:1 / 16.40:1; muted text 5.49:1 / 8.25:1. These are specific rendered pairs, not a library-wide accessibility certification.                                                                                                               |
| Phase 1/2               | PASS: 28 production foundation/specimen/picker-baseline checks and 22 control-family smoke checks.                                                                                                                                                                                                                                                           |
| Phase 3/4               | PASS: 16 production selection checks, 34 focused Command checks (including filtering, IME guard, 100-command scroll/footer, focus and responsive targets), and 34 overlay/menu checks with exact picker popup comparisons. Select/Combobox, Popover/Menu, Tooltip, PreviewCard and Menubar remain protected.                                                 |
| Phase 5                 | PASS: 33 production modal checks for Dialog/Alert/Drawer/Command shells and focus return, including exact mobile Time Picker frame. This is regression coverage, not a rerun of every historical Drawer gesture/nesting test.                                                                                                                                |
| Date/Time               | PASS: baseline geometry and retained anchors; Date caption/nav 24.5px, 7px caption inset, 5.25px gap, 12.25px chevron, 28px days, 33.25px year/month controls, 2px/2px caption focus and range continuity. Time draft/Cancel/OK pass; popup frames remain baseline-equal. Mobile Time dialog remains 308 × 491.6875px at 390px.                              |
| Scope/diff              | PASS: 100 protected files are byte-identical to the checkpoint, including other UI families/styles, Menubar, Date/Time, theme ownership/distribution, CLI source, package files, lockfile, `cn()` and prior V2 reports. `git diff --check` passes.                                                                                                           |

## Limits and reproduction

Browser evidence is desktop Chromium with CDP viewport, touch/media and CSS-zoom emulation. Physical iOS/Safari/Android, native virtual keyboards/IME, hardware touch, native browser zoom/pinch and manual screen-reader certification were not performed. The earlier Phase 4 general anchored-popup CSS-zoom limitation remains separately documented; this phase adds no positioning workaround.

Very long nonwrapping Tabs lists still require a consumer-owned scroll container; this phase preserves the public composition API rather than inventing a scrolling control. Custom render/class overrides remain consumer-owned.

The pinned Next.js package has no bundled `dist/docs` guide and is below the `next-dev-loop` skill's 16.3 floor. Runtime acceptance uses the actual production build and browser instead; no framework upgrade was introduced. Session model configuration was not changed. The initial offline dependency install lacked a cached tarball, so installed dependencies were copied into the isolated worktree without editing manifests or lockfiles. Local server/browser permissions were granted for validation.

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

Disposable fixtures, browser scripts/results, screenshots and validation logs are under `/private/tmp/baseui-v2-phase6/`. The copied consumer is served at `http://localhost:3136/consumer/`; final production docs are at `http://localhost:3137/docs/components/tabs#system-specimen`. These are local review servers. Evidence includes `browser-results.json`, `supplement-results.json`, `command-results.json`, `production-phase6-results.json`, `phase4-docs-results.json`, `production-modal-results.json`, picker baseline/geometry files, `routes.json`, `contrast-results.json` and `scope-review.json`.

## Final file inventory and git status

39 changed/new paths: 36 modified tracked paths and three untracked paths (shared stylesheet, system specimen and this report); zero staged. HEAD and branch remain the isolated approved starting checkpoint. Work is intentionally uncommitted and independently reviewable.

- `apps/www/components/previews/navigation-menu-previews.tsx`
- `apps/www/components/previews/tabs-previews.tsx`
- `apps/www/components/ui/accordion.tsx`
- `apps/www/components/ui/breadcrumb.tsx`
- `apps/www/components/ui/collapsible.tsx`
- `apps/www/components/ui/navigation-menu.tsx`
- `apps/www/components/ui/pagination.tsx`
- `apps/www/components/ui/tabs.tsx`
- `apps/www/content/docs/components/accordion.mdx`
- `apps/www/content/docs/components/breadcrumb.mdx`
- `apps/www/content/docs/components/collapsible.mdx`
- `apps/www/content/docs/components/navigation-menu.mdx`
- `apps/www/content/docs/components/pagination.mdx`
- `apps/www/content/docs/components/tabs.mdx`
- `apps/www/lib/__generated__/docs-markdown.json`
- `apps/www/lib/__generated__/preview-sources.json`
- `apps/www/public/registry/accordion.json`
- `apps/www/public/registry/breadcrumb.json`
- `apps/www/public/registry/collapsible.json`
- `apps/www/public/registry/navigation-menu.json`
- `apps/www/public/registry/pagination.json`
- `apps/www/public/registry/tabs.json`
- `packages/cli/registry/accordion.json`
- `packages/cli/registry/breadcrumb.json`
- `packages/cli/registry/collapsible.json`
- `packages/cli/registry/navigation-menu.json`
- `packages/cli/registry/pagination.json`
- `packages/cli/registry/tabs.json`
- `packages/registry/registry/accordion.json`
- `packages/registry/registry/breadcrumb.json`
- `packages/registry/registry/collapsible.json`
- `packages/registry/registry/navigation-menu.json`
- `packages/registry/registry/pagination.json`
- `packages/registry/registry/tabs.json`
- `scripts/check-cli-install-fixtures.mjs`
- `scripts/registry-meta.mjs`
- `apps/www/components/previews/phase6-system-preview.tsx`
- `apps/www/styles/navigation.styles.css`
- `docs/design-system-v2-phase6-report.md`
