# Design System V2 — Phase 9: website polish and V2 presentation

October 20, 2026. **Local acceptance: PASS, with the existing lint and device limitations below. Intentionally uncommitted.**

Preflight independently verified `feature/design-system-v2`, exact HEAD `a3dd434b8a41b336e752fe53166d2e0cb4150a84` (`fix: respect reduced motion in Date Picker`), and an empty working tree. The V2 plan, current Phase 4 border/focus and visual-simplification corrections, and Phase 5–8 reports were reviewed. Historical branch/status statements in those reports are historical evidence. No prior checkpoint was amended.

Baseline desktop/mobile light/dark screenshots and an HTTP route/anchor/metadata inventory were captured before website edits. All evidence and disposable scripts are under `/private/tmp/baseui-v2-phase9/`.

## 1. Files changed

30 paths: 24 modified website sources, five new website modules/styles, and this report. No component-family source, component stylesheet, theme definition/output, catalog, MDX document, generated export, registry, CLI source, manifest or lockfile changed. A hash comparison verifies **392 protected tracked files** against HEAD.

- `apps/www/components/docs/component-pagination.tsx`
- `apps/www/components/docs/docs-mobile-nav.tsx`
- `apps/www/components/shared/home-showcase.tsx`
- `apps/www/components/shared/site-footer.tsx`
- `apps/www/styles/website.css`
- `apps/www/app/docs/changelog/page.tsx`
- `apps/www/app/docs/components/[slug]/page.tsx`
- `apps/www/app/docs/installation/page.tsx`
- `apps/www/app/docs/layout.tsx`
- `apps/www/app/docs/llms/page.tsx`
- `apps/www/app/docs/page.tsx`
- `apps/www/app/docs/theming/page.tsx`
- `apps/www/app/page.tsx`
- `apps/www/components/docs/code-block.tsx`
- `apps/www/components/docs/component-preview.tsx`
- `apps/www/components/docs/component-source.tsx`
- `apps/www/components/docs/docs-content-transition.tsx`
- `apps/www/components/docs/docs-sidebar.tsx`
- `apps/www/components/docs/docs-toc.tsx`
- `apps/www/components/docs/install-tabs.tsx`
- `apps/www/components/docs/mdx-components.tsx`
- `apps/www/components/docs/package-manager-tabs.tsx`
- `apps/www/components/shared/components-grid.tsx`
- `apps/www/components/shared/copy-button.tsx`
- `apps/www/components/shared/landing-reveal.tsx`
- `apps/www/components/shared/site-header.tsx`
- `apps/www/components/shared/site-search.tsx`
- `apps/www/components/theme/theme-toggle.tsx`
- `apps/www/styles/globals.css`
- `docs/design-system-v2-phase9-report.md`

## 2. Header

An opaque Graphite header retains the brand, documentation/components navigation, Search, theme toggle and desktop npm/GitHub links. The inner shell is 56px high (57px including its bottom border). Desktop active navigation uses a quiet underline and `aria-current`; mobile header actions have real 44px boxes. A keyboard skip link targets the focusable main element. Theme-specific marks use the existing class-based dark variant.

Blocks links to the first actual block from the canonical catalog, retaining its `/docs/components/…` URL. No Templates destination is exposed because no product route exists. No floating pill, glass, gradient or glow is introduced.

## 3. Mobile documentation navigation

The existing V2 Drawer supplies the mobile Browse documentation control on both the homepage and docs. Its accessible trigger and close button are 44px. Shared `DocsNavigation` renders the same 59 links (five guides and 54 installables), groups and current-page state as desktop. Links are at least 44px high. The Drawer popup owns scrolling; the last group remains reachable, keyboard focus stays inside, Escape restores the trigger, and selecting a link navigates and dismisses it. Crossing the desktop breakpoint closes an open mobile drawer.

Existing Drawer viewport bounds and safe-area environment padding remain; navigation adds bottom inset clearance. Checks cover 320/390px in light/dark. Nonzero physical notch insets were not simulated.

## 4. Sidebar

240px desktop column, sticky below the header, with the existing ScrollArea. Section labels are 12/18px, links 14/20px, and badges 11/16px. Neutral current-item fill, readable spacing and crisp 2px keyboard focus replace stronger pills/tiny metadata. The nonfunctional “More coming soon…” `#` link is removed. Catalog groups and URLs are unchanged.

## 5. Documentation typography

MDX prose/list text uses 16/26px; long paragraphs are bounded at 72ch. Guides use a 72ch wrapper and component references an 80ch wrapper to accommodate specimens/API tables. Page headings use 600 weight, with consistent section spacing and readable 13px inline code. Reference tables remain denser and scroll within their wrappers. Heading offsets clear the sticky header; the API anchor is checked in the browser.

These styles target website prose and navigation. The 14px root, component unit bridge, component geometry and picker compatibility scopes remain unchanged. Callout colors now use the existing semantic status colors.

## 6. Component-page hierarchy

Title/description/actions precede the mobile table of contents and preview, then existing Installation, Usage/examples and API sections retain their MDX order and anchors. The secondary upstream API note has simpler framing. Previous/Next links derive from the canonical catalog navigation order, including its existing blocks; the first/last boundaries are checked. No MDX, Markdown export or AI action is rewritten.

## 7. Preview and code presentation

Preview/Code and package-manager controls now use actual shared V2 Tabs, including their native arrow-focus and Enter/Space activation behavior. Installation integration also uses shared Tabs. Preview panels have 16px mobile / 24px desktop padding plus a small 4px internal focus clearance. A 140px minimum specimen region replaces the oversized generic preview minimum; taller examples grow naturally. Wide specimens/code remain internally scrollable.

One themed CodeBlock supplies previews, fenced MDX code, install commands and source views. Shared Button copy actions show visible success only after the clipboard write resolves, announce status, and display a truthful failure state. Source panels retain expand/collapse controls. Code uses 13/21px monospace with keyboard-accessible horizontal scrolling and no fading edge masks. Manual source requests use the site's current registry rather than unrelated `main` source. Actual copied source and fenced code text are verified.

## 8. Search

Existing Command filtering, grouped results, keyboard shortcut and selection/navigation remain. Its trigger is a shared V2 Button; the popup internals use the approved Command without another redesign. Empty-state copy and shortcut type are more readable. Touch results remain 44px, desktop results 32px, with bounded popup geometry. Click dismissal restores the Search trigger; shortcut dismissal restores the original focused input. Filtering, empty state, shortcut, Enter navigation and focus return are tested.

## 9. Homepage

The first heading retains “Base UI components for React”; the new second line communicates copy-and-own. Hero copy retains accessible React components, Base UI, Tailwind CSS, shadcn-style and component-library concepts. Existing metadata, structured data and FAQ content remain exact.

A real interactive V2 Input/Field/Select/Switch/Button/Badge composition replaces the decorative component-lookalike marquee. Primary Explore components and Installation actions are clear. Installation commands, catalog browsing, current changelog, LLM documentation and FAQ remain, with tighter rhythm and less repetitive positioning copy. Catalog filters use ordinary V2 Buttons with pressed state; redundant nested promo cards and hover lifts are removed. Showcase interactions are local demonstrations, with no account or product persistence.

No marketplace, checkout, Blocks product route, Templates product, pricing or paid-product work is included.

## 10. Footer

A shared restrained SiteFooter serves home and docs. Docs uses its compact form. Docs, Components, GitHub, npm, Changelog and License are retained/available; home also retains Base UI and llms.txt. Links wrap and have 44px mobile/coarse-friendly rows. No large marketing footer is added to reference pages.

## 11. Motion and reduced motion

LandingReveal renders content immediately, route entrance/reveal dependence is removed, and the perpetual marquee and its CSS are removed. Root scrolling is immediate; explicit TOC scrolling respects reduced motion. No large animation is added. Existing V2 component motion stays under its owning styles. Reduced-motion checks include website content and actual Date view/month animation events in LTR/RTL.

## 12. Responsive results

PASS at 320, 390, 768 and 1440px. The website matrix exercises home, installation, Button, Data Grid, Date and Time in both themes. Every one of the 54 catalog docs is additionally rendered at 320px with no document overflow or unavailable preview. Assertions compare document scroll width with `documentElement.clientWidth`.

Browse navigation, preview/code, search, wide source, reference tables and footer have separate interaction or visual coverage. A source code panel scrolls 882px horizontally without document overflow. Emulated touch/coarse media is distinguished from physical-device evidence.

## 13. Light/dark and OS/app disagreement

PASS. Header, current sidebar item, preview, code and footer compute identical styles for a given application theme under either OS preference. Actual persisted theme switching also passes. Both themes use the approved neutral palette. Search surfaces and responsive captures cover light/dark. No website blue/slate surface palette is introduced.

## 14. SEO, routes, anchors and exports

PASS: **119 HTTP checks**, including all 54 docs and 54 registry responses, plus `/`, the five guide routes, RSS, sitemap, robots, llms.txt and registry index. Served registry bytes equal generated bytes. All **485 stable baseline IDs/anchors** remain. Generated React/Base UI runtime IDs are excluded from stable-anchor comparison. Canonical, description and OpenGraph/Twitter metadata compare exactly with the baseline.

All 54 generated Markdown documents remain byte-identical. The existing Copy as Markdown action copies the exact generated Button export (2,631 characters); manual source equals the current registry. AI actions and export generation are retained. No URL migration or empty route is introduced.

## 15. Component regressions

PASS: 195 focused production assertions: 28 picker/selection/Command/Toast checks; 28 foundation, persisted-theme and scoped picker-anatomy checks; 22 form/control family renders; 34 overlay/menu checks; 33 modal/focus-return checks; 34 navigation/disclosure checks; and 16 feedback/data/auth renders. A separate Date/Time interaction sequence passes.

Coverage includes Button/Input, Form, Select/Combobox, Command, Menu/Popover, Dialog/Drawer, Tabs/NavigationMenu, Toast/Table/Data Grid, Date and Time. Select commits, Combobox filtering, Command empty filtering, overlay bounds, dismissal/focus return and Toast create/close receive actual interaction coverage. Form/data/auth checks here are representative render/geometry smoke rather than a repeat of all previous submission/editing permutations.

Source/style hashes independently establish that protected UI wrappers, Data Grid, hooks, the theme, picker styles, registry and CLI have not changed. This is representative regression coverage, not every historical phase's complete behavior suite.

## 16. Date/Time

Protected production Date geometry remains: 24.5px caption/nav, 7px inset, 5.25px gap, 12.25px chevron, 28px days, and a 245 × 272.5px borderless popup. Month/year controls, range continuity, captions and existing useful anchors remain. Normal 160ms animation events remain; reduced motion emits no view/month animation events in LTR/RTL.

Time retains its 33.5px input, 238px desktop clock, existing list geometry, draft/Cancel/OK behavior and trigger focus return. The explicit mobile dialog remains 308 × 491.6875px at 390px. At 320px it uses the existing 299px width/231px clock. Date's compact days/navigation and Time's compact list/footer targets remain the approved exceptions; no 44px-picker certification is claimed.

## 17. TypeScript

PASS: website and CLI `tsc --noEmit`, plus the production build's type check. No package/component API was changed.

## 18. Lint

PASS: `pnpm lint`, zero errors and **one existing warning** in `apps/www/components/data-grid/data-grid-table-virtual.tsx:368` (`react-hooks/exhaustive-deps`, `virtualItems`). The protected file matches HEAD. This is not a warning-free claim.

## 19. Builds

PASS: `theme:check` (three outputs), all eight theme-fixture families, `build:all` (54 registry entries, 313 preview sources, 54 Markdown documents), and final Next.js 16.1.7 production build (60 generated pages). All generated outputs remain unchanged. No framework/dependency upgrade was performed.

## 20. Registry and CLI

PASS: `registry:check` verifies 54 installables, 119 embedded source/style occurrences and three identical registry copies. CLI CJS/declarations build and the complete existing `cli:fixtures` suite pass. Its recursive imports, incremental/reverse/partial installs and customization-preservation checks remain intact. CLI remains 1.3.3; no version bump or publication.

Fixtures use the existing offline dependency-install stub and locked workspace runtime modules; this is not a published-network-install claim.

## 21. Browser QA and evidence

PASS: 139 primary website checks, 15 supplementary website checks and four final search theme/bounds/coarse assertions, in addition to the component regressions above. All recorded assertion results pass. Supplementary checks cover actual header theme persistence, 16/26 prose, exact fenced-code/Markdown/source text, contained keyboard scrolling, truthful copy failure, sidebar focus, pagination boundaries, skip-link focus, real homepage Select/Switch interaction and both search focus-return paths.

Final captures cover 320/390/768/1440px in light/dark. `website-results.json`, `website-extra-results.json`, `visual-final-results.json` and the component result JSONs retain individual results. `regressions-accepted.log` consolidates successful final-build component runs; earlier failed harness attempts are retained separately. Browser focus emulation stays active in the regression driver so native popup lifecycle frames advance.

Screenshots are under `/private/tmp/baseui-v2-phase9/`: `before-home-*`, `before-button-*`, `final-home-*`, `final-button-*`, `final-search-*`, `final-code-*`, `final-footer-*`, `browse-*`, and retained component regression captures. Representative desktop/mobile home, docs, browse, code, search and footer captures were visually inspected.

Runnable scripts include `website-qa.mjs`, `website-extra.mjs`, `visual-final.mjs`, `snapshot.mjs` and `run-regressions.mjs`. JSON results, protected-file hashes, changed-file inventory and command logs accompany them. Harness corrections respect manual shared-Tabs activation, exclude generated runtime IDs and scope picker geometry away from intentionally changed website buttons/toolbars. No component fix was made to satisfy a stale website snapshot.

## 22. Limitations

Local desktop Chromium with viewport, touch/coarse, OS-media and reduced-motion emulation. No physical iOS/Safari/Android, WebKit, real notch, native virtual keyboard/IME, hardware gesture velocity, browser-chrome pinch/zoom or manual screen-reader certification. Existing Phase 4 anchored-popup document-CSS-zoom limitations remain outside this phase.

The optional next-dev-loop skill requires Next.js 16.3+; the pinned 16.1.7 package has no installed `dist/docs` guide directory. No upgrade was authorized, so production build/browser tooling was used. Host model/session configuration was not changed. No external search service, publication or production deployment is involved.

## 23. `git diff --check`

PASS. No generated distribution drift, staged files or prior-report edits.

## 24. Git status and stop gate

Branch remains `feature/design-system-v2`; HEAD remains exactly `a3dd434b8a41b336e752fe53166d2e0cb4150a84`. **All Phase 9 work is uncommitted.** Final status is recorded below and under the evidence directory.

```text
 M apps/www/app/docs/changelog/page.tsx
 M apps/www/app/docs/components/[slug]/page.tsx
 M apps/www/app/docs/installation/page.tsx
 M apps/www/app/docs/layout.tsx
 M apps/www/app/docs/llms/page.tsx
 M apps/www/app/docs/page.tsx
 M apps/www/app/docs/theming/page.tsx
 M apps/www/app/page.tsx
 M apps/www/components/docs/code-block.tsx
 M apps/www/components/docs/component-preview.tsx
 M apps/www/components/docs/component-source.tsx
 M apps/www/components/docs/docs-content-transition.tsx
 M apps/www/components/docs/docs-sidebar.tsx
 M apps/www/components/docs/docs-toc.tsx
 M apps/www/components/docs/install-tabs.tsx
 M apps/www/components/docs/mdx-components.tsx
 M apps/www/components/docs/package-manager-tabs.tsx
 M apps/www/components/shared/components-grid.tsx
 M apps/www/components/shared/copy-button.tsx
 M apps/www/components/shared/landing-reveal.tsx
 M apps/www/components/shared/site-header.tsx
 M apps/www/components/shared/site-search.tsx
 M apps/www/components/theme/theme-toggle.tsx
 M apps/www/styles/globals.css
?? apps/www/components/docs/component-pagination.tsx
?? apps/www/components/docs/docs-mobile-nav.tsx
?? apps/www/components/shared/home-showcase.tsx
?? apps/www/components/shared/site-footer.tsx
?? apps/www/styles/website.css
?? docs/design-system-v2-phase9-report.md
```

Final state: 24 modified tracked paths, six untracked paths including this report, zero staged paths. No other work is included.

No commit, amend, push, merge, deployment, CLI bump/publication, Templates marketplace or later-phase work was performed. Stop after Phase 9.
