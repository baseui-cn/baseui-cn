# Data Grid v9 integration review

Status: final integration approved; checkpoint validation completed October 30, 2026. Original integration review date: October 29, 2026.

## 1. PR #3 audit

Source: https://github.com/baseui-cn/baseui-cn/pull/3, verified open and unmerged at `ea960b03fd7e74beedf2db4c4bd52bbf5369badd`. The PR has 16 commits and 201 changed files. No merge, rebase, rewrite, or commit of that branch is authorized or performed.

## 2. Rejected stale/regressive changes

Do not copy PR manifests, generated distributions, root package-lock, Fumadocs/collections/source.ts changes, CLI add changes, unrelated tsconfig formatting, version metadata, or shared Menu animation removal. Reconcile only the Data Grid source, its previews/contracts/docs and authoritative registry metadata. Generate outputs using current-main generators.

## 3. Current-main baseline

Fetched `origin/main`: `ce69919a4e7eb2ed32df3211e03681b36d375220`. Integration branch: `integration/data-grid-v9`, created from this exact commit with a clean starting tree. The previous local `feature/design-system-v2` branch is preserved. Current main includes the released V2/1.4.0 work; the local future Time Picker checkpoint is outside this integration.

Preservation gates: Base UI exactly 1.9.0; CLI/site 1.4.0; 26 generic public variables and no public `--cn-*`; Graphite/Iris and Iris/Rounded defaults; all four frameworks; workspace init/add/update; color/radius options; recovery; LICENSE; landing/docs/routes/anchors; current registry metadata.

## 4. Pre-implementation comparison and TanStack v9 migration

This source comparison was recorded before implementation changes. Existing capabilities must survive; the final acceptance column will be updated with measured results.

| Capability | Current main | PR #3 | Reconciliation/acceptance requirement |
| --- | --- | --- | --- |
| Basic table | Shared viewport/table/body/header/footer primitives | Migrated generic types | Preserve composition and V2 classes |
| Sorting | Client and controlled sorting | v9 model/features | Register sort functions; exercise sort |
| Pagination | Client/manual, size controls | v9 state access | Preserve controls and manual total |
| Row selection | Header/row checkboxes | v9 types | Preserve indeterminate/page selection |
| Column visibility | Header submenu and visibility component | v9 types | Preserve hide/show and labels |
| Resizing | onEnd/onChange, live indicator, sticky cells | v9 columnResizing state | Preserve resize mode authority and both modes |
| Sticky headers | Table/virtual viewport | Retained | Preserve approved V2 geometry |
| Column pinning | Physical left/right v8 | Logical start/end v9 | Migrate state and RTL placement |
| Row pinning | Top/center/bottom render helpers | New row pin menu | Preserve sections and prohibit pinned row drag |
| Virtualization | Direct per-render getVirtualItems; measured rows | v9 types, direct read retained | No cached window or blank body |
| Infinite/fetch more | Threshold, pending/status/error/retry | Retained | Exercise new rows and retry |
| Row DnD | Separate row renderer, pinned exclusion | v9 types | Retain and test pin combinations |
| Column DnD | Separate renderer, body alignment | v9 types/pinning changes | Retain and test logical boundaries |
| Combined DnD | Separate renderers only | New combined renderer | Prevent ID collisions, wrong axis/target |
| Editing | Metadata driven text/email/textarea/number/select/radio/checkbox/switch/rating | Existing editor enhanced; second editor adds date | Retain canonical primitives, dialog fields, validation |
| Generated edit dialog | Metadata fields, validation, save/error | Retained | Preserve dialogOnly/inlineOnly |
| Async optimistic edits | Shared useEditableDataGrid hook | Unchanged hook | Preserve pending/success/rollback/error/stale protection |
| Keyboard | Enter commit, Escape cancel, select document listener | Tab/Shift+Tab added; second editor differs on Enter | One consistent commit/navigation contract |
| Narrow containment | Shared scroll viewport; V2 data styles | Styling drift and collision options | Keep V2 classes; scope positioning API |
| RTL | Logical spacing, resize direction; v8 physical pin state | Logical pin API, physical labels/preferences | Use logical start/end consistently |
| Excel/text/number/date filters | Faceted filter component | New typed operators/menu/labels | Strict dates, blank handling, validated server payload |
| Feature controls | Consumer composition | Grouped feature checkboxes | Canonical menu checkbox semantics and keyboard |
| Persistence/data source | Consumer-owned | New interface, hook and demo localStorage source | Install contract closure; reject stale async responses |

## 5. Dependency/version decision

**PASS.** Website manifest and authoritative registry dependency both use `@tanstack/react-table@^9.2.8`. The pnpm lockfile resolves **9.3.1**, including table-core 9.3.1 and its required Store packages. A fresh real pnpm consumer resolves 9.3.1; the range excludes v10. A separate real consumer also installs, type-checks, builds and runs the browser suite on **9.2.8**, verifying the lower bound rather than merely checking its existence.

Evidence: `pnpm view @tanstack/react-table@9.2.8 version engines dependencies dist.integrity --json` and the equivalent 9.3.1 query; real lockfiles and `review-table-version.json`. Published package metadata declares Node >=20 for both versions. Only Table and its necessary transitive dependencies changed in the repository lockfile. Fumadocs/collections and every unrelated package remain unchanged.

Primary references: [v9 migration](https://tanstack.com/table/latest/docs/framework/react/guide/migrating), [explicit feature configuration](https://tanstack.com/table/latest/docs/guide/features), [9.2.8 package metadata](https://registry.npmjs.org/@tanstack%2freact-table/9.2.8), [9.3.1 package metadata](https://registry.npmjs.org/@tanstack%2freact-table/9.3.1).

## 6. Node compatibility decision — corrected before checkpoint

**CLI compatibility is retained.** The published CLI now declares **Node >=18**, while repository/website development retains **Node >=20.9.0** for the existing Next.js/tooling baseline. **Only Data Grid v9 requires Node >=20** and an ES2022-capable application runtime. The previous integration-wide CLI >=20 decision is superseded; it must not remove access to unrelated components.

The shared add/update installer selects components (explicit, interactive or `--all`) and checks the Node major before init, config/style selection or any project write. It also resolves the read-only dependency closure and repeats the check, covering a component that transitively includes Data Grid. Rejection includes the actual Node version, the reason (TanStack Table v9), and an actionable upgrade/retry command. Both `add --all` and `update --all` reject the **whole operation** when the effective catalog/closure includes Data Grid; nothing is silently skipped. Named compatible components remain available on Node 18. An all-operation whose catalog excludes Grid remains allowed.

Example from actual Node 18.20.8:

```text
Data Grid requires Node.js 20 or newer because it uses TanStack Table v9.
Current Node.js: v18.20.8

Upgrade Node.js and run:
  baseui-cn add data-grid
```

Update rejection uses `baseui-cn update data-grid`. Init/list/create have no Grid runtime gate; create still respects the selected upstream scaffolder's independent requirements.

**Node 18.20.8: PASS.** Actual built and packed CLI binaries pass 20 compatibility cases: startup/version, create command availability, list, init, ordinary add/update, direct/mixed/interactive/transitive Grid rejection, fresh projects, workspace targeting, config/CSS/path overrides, shipped `--all` rejection and a catalog excluding Grid. Every rejection fixture hashes the complete project tree and verifies no new directories/files or dependency-install invocation. A separate **real pnpm** consumer passes init, Button/Dialog add and unrelated Button update; its four Grid add/update/all rejections preserve all 17 project/config/source/style/manifest/lock/installed-lock paths. The packed CLI itself installs under Node 18 with `engines.node >=18`.

**Node 20.20.2: PASS.** The corrected actual tarball is installed into a fresh external Vite app. Real packed CLI init/add/update installs Table 9.3.1 with real pnpm dependencies, passes strict TypeScript/production build and **9/9 focused production browser groups** (filters, editing/rollback, virtualization and combined DnD, with zero runtime errors). Registry reads alone use the local packed fallback; no dependency installation is stubbed. The previous full Grid browser acceptance remains applicable because all approved Grid source, styles, previews, fixtures and registry bytes are unchanged.

**Node 22.22.3: PASS.** CLI TypeScript/build, 60 existing CLI fixture groups, 59 onboarding tests, website TypeScript, lint, frozen install, registry consistency and the Next production build are rerun successfully. CLI build also passes under Node 20.

**Versioning:** preserving global CLI Node 18 compatibility keeps the approved Data Grid feature work suitable for a future **1.5.0** release. A future intentional Node 18 drop for the entire CLI requires its own explicit compatibility/versioning decision. This correction does not bump version 1.4.0, merge, publish or deploy.

Correction evidence: `/private/tmp/baseui-grid-v9-node-compat/`, including `node18-fixtures.log`, `node18-packed-fixtures.log`, `node18-real-results.json`, real Node 18 install logs, Node 20 packed install/add/update/build/smoke logs and `preservation.json`. The deterministic Node 18 fixture suite uses install tripwires/stubs solely to prove rejection atomicity; real Node 18 and Node 20 consumer installs are separate, unstubbed evidence.

### Migration implementation

`table-features.ts` explicitly composes filtering/faceting, ordering, logical pinning, sizing/resizing, visibility, global filtering, expanding, pagination, row pinning, selection and sorting. It registers the corresponding row models **and built-in filter/sort function registries**; omitting the latter would silently break automatic sorting/filtering. `DataGridTable`, Column/ColumnDef/Cell/Row/Header/HeaderGroup aliases bind v9's feature generic consistently. All previews migrate to `useTable`. State/resize APIs migrate to v9; the Grid's resize-mode authority is retained through the core options setter.

V2 imports, row/filter/editor classes, focus styles, pagination containment and existing accessibility semantics were reconciled against current main rather than inherited from the old PR. Both shared overlay components remain byte-identical to main.

## 7. Old/new feature parity

**No released capability was intentionally removed.** The pre-implementation checklist above is retained as the audit record. Final evidence:

| Existing capability | Result |
| --- | --- |
| Basic table, composition, sticky header/footer | PASS: website renders all four Grid previews; original basic/demo aliases and headings remain |
| Sorting, client/manual pagination | PASS: registered auto sort, filters/page model, production browser order/size assertions |
| Selection and column visibility | PASS: model and browser tests; row selection disabled state and select-all indeterminate semantics retained/restored |
| Resizing | PASS: pinned virtual resize, resize-mode authority and V2 CSS variables; onEnd and live onChange behavior both browser-verified |
| Column pinning, row pinning | PASS: logical start/end sticky placement, top/center/bottom sections, no duplicate pinned virtual row |
| Virtualization and fetch-more | PASS: populated initial window, 6000px scroll/window change, measurement indices, sorting/filtering/pagination/selection/editing, fetch-more/all-loaded |
| Separate row and column DnD | PASS: renderers retained, pin exclusions checked; combined renderer added |
| Metadata editing and generated dialog | PASS: text/number/select/date/checkbox/switch/rating, dialog-only notes, inline-only exclusion retained |
| Async optimistic editing | PASS: pending/success/error, validation, duplicate submit guard, rollback, stale refresh/deletion protection, dialog retry |
| Keyboard, containment, RTL | PASS: Enter/Escape/Tab/Shift+Tab, validation focus, virtual target scrolling and boundaries; responsive/RTL matrix |

## 8. New features

Typed Excel text/number/date filtering, operator menus, active labels/remove/clear controls, grouped canonical menu-checkbox feature controls, row top/bottom pin menu, combined row/column DnD, logical pin preferences, data-source contracts/loading hook, standalone date-capable inline editor and enhanced keyboard navigation. Existing custom inline/dialog renderers remain supported. The feature preview is additive; existing preview aliases still resolve to their previous basic/editing examples.

## 9. Filters

**PASS 50 model/contract tests plus browser acceptance.** Text supports contains/notContains/equals/notEquals/startsWith/endsWith/blank/notBlank, trims and ignores case. Blank includes null/undefined/whitespace; zero is not blank. Blank operators discard an obsolete draft.

Number supports =, >, <, >=, <=. Empty numeric values/queries, null, booleans, arrays, objects, NaN and infinity do not become zero. Date validation uses numeric calendar fields, not locale parsing; leap years include the 1900/2000 century cases. Invalid row dates as well as invalid filter dates are rejected. Before/after are exclusive; on matches the day; between includes both ends and rejects reversed/missing bounds. ISO timestamp row values compare their written calendar date; Date objects use local calendar fields.

Apply validates before updating state. Individual removal and Clear all remove the column filter. Browser tests exercise text/number/date application, empty-number rejection, blank transition and active labels/clear behavior. The old facet component remains keyboard-accessible and available.

`serializeDataGridQuery` validates and serializes pagination, sorting and typed Excel filters, strips unrelated fields and never sends functions. The manual-processing model preserves server-provided rows rather than applying a second client filter. This is a transport contract, not a backend implementation; servers must validate allowlisted columns, authorization and limits again. Existing facet arrays need their own server adapter.

## 10. Editing

**PASS.** Existing metadata/dialog API and all editor kinds remain. Date is additive. Canonical Input/NumberField/Select/DatePicker/Checkbox/Switch/Rating controls are used. Enter commits, Escape cancels, Tab commits then advances, Shift+Tab commits then reverses. Invalid/failed saves retain the editor; pending submits cannot advance or submit twice. Navigation excludes dialog-only and pending cells, follows pin/center order, scrolls virtual targets into view and restores focus at sequence boundaries, including when consumer column renderers remount.

Immediate checkbox/switch/rating behavior remains. An active inline editor stays mounted while pending; row skeletons remain for dialog/other row operations. Optimistic updates show pending/success/error/rollback; synchronous row locks prevent pre-render duplicate writes. Parse exceptions and invalid numeric/date values become field errors. Completion/rollback only replaces the original optimistic row object; refreshed/replaced/deleted rows survive stale responses. Dialog-only notes are saved through the generated dialog, including server failure, rollback and retry.

## 11. Virtualization

**PASS.** The old PR reintroduced memoization of `getVirtualItems()` by stable instance identity. That regression is rejected: each render reads the current window. A documented lint suppression protects that deliberate live read; the focused scroll test would fail if the stale cache returned.

Default/custom measurement receives the configured index attribute with the **virtual center index**, including after sorting/filtering/pinning. Pinned rows render separately from the measured center body. Tests cover initial population, changed scroll window, measurements, pinning, selection, sorting, filtering, pagination, resizing, editing, virtual keyboard navigation, fetch-more and all-loaded state. No blank virtual body occurred. DnD uses its separate nonvirtual renderers.

## 12. DnD

**PASS.** Existing row/column renderers are migrated and retained. The combined renderer namespaces internal IDs (`row:` / `column:`), so a row named `name` cannot collide with a column named `name`. Consumer callbacks receive original IDs. Collision detection only accepts the matching row/column kind, movement stays on the matching axis, and sortable keyboard coordinates support actual keyboard reorder. Combined row/column and RTL keyboard DnD are tested; standalone pin combinations are also covered. Pinned columns must be unpinned before dragging; pinned row handles are disabled.

## 13. Pinning

**PASS.** Column API/state/preferences use v9 logical start/end throughout; physical left/right preference values and labels from PR #3 are rejected. Sticky cells use insetInlineStart/insetInlineEnd and logical boundary selectors. Pinning wins over DnD's relative positioning. Row pin menu supports top/bottom/unpin and remains unavailable when pinning is disabled. Pinned virtual rows are unique and excluded from the virtual center; pinned drag handles are unavailable. Pinning and width survive data refresh. Responsive tests also verify horizontal scrolling leaves the logically pinned column in place.

## 14. Persistence/data-source contract

The installable includes `types/data-grid-data-source.ts`, typed filter/query contracts and `useDataGridFeatureData`. Source methods cover page/total, update, neighbor-based row moves, row pins and ordered column preferences with logical pinPosition. Client mode requests all rows; server mode forwards the supplied query. Query/source/refresh changes invalidate obsolete load completions. Readiness waits for preferences; independent preference/row/mutation error channels prevent a successful rows read from hiding failed preferences. Browser tests reproduce late server responses and delayed/failed preference reads.

The preview's in-memory source retains state across rerender/data refresh for that source instance. Durable reload persistence, authorization, storage, write ordering/conflict versions and backend execution belong to the supplied source; none is falsely presented as implemented infrastructure.

## 15. Accessibility

**PASS within Chromium/axe scope.** Canonical menu checkbox items provide feature-menu roving focus and Space/Enter behavior. Filter popup uses PopoverTitle for its accessible name; operators and values have labels; errors are announced. Visibility uses the existing render API rather than nesting buttons. Page size has a label; selection retains indeterminate/disabled states; pin and drag actions have accessible labels/disabled behavior. Inline validation/pending states retain focus and announcements. Keyboard acceptance and axe run with filter/editor/feature surfaces and across the responsive theme/direction matrix. Final results contain no violations or page runtime errors.

## 16. Responsive/RTL

**PASS:** 320, 390, 768, 1280px × light/dark × LTR/RTL, sixteen combinations per supported Table version. The suite asserts actual computed theme tokens, document width, logical sticky position after horizontal scroll, filter collision bounds and axe results; screenshots are saved for every combination. Website Grid docs additionally pass all four widths, original anchors, all four previews and zero runtime errors. See section 22 for the separate retained upstream Vite/demo CSS edge and canonical-theme setup.

## 17. Shared Popover/Menu impact

**No shared component changes.** Current main already provides `positionerProps`; the Grid passes only its needed collision boundary/padding/avoidance through that API. Both Popover and Dropdown Menu source/styles/generated entries are byte-identical to main. All global V2 animation, focus and visual behavior remains. PR #3's global Menu animation removal and default-positioning changes are rejected. Filter/menu placement is exercised in all sixteen responsive/theme/direction combinations; no shared-overlay replacement or new global configuration was needed.

## 18. Registry closure

**PASS:** authoritative Data Grid source/meta only, followed by official `pnpm build:all` / CLI generator. All three distributions contain **55 JSON files / 54 installables**, all version 1.4.0 and byte-identical. Registry check reports **128 embedded source/style occurrences**. Only `data-grid.json` changes in each distribution; current index/catalog/version metadata and unrelated registry entries remain unchanged. Preview-source and docs-markdown generated changes correspond only to the intentional Grid work. No generated JSON was hand-edited, no CRLF-only/all-component rewrite, no 1.3.3 or Base UI ^1.6 metadata.

Fresh consumer testing independently found `types/` files installed under components/ui/types. The narrow one-line CLI path resolver addition is justified by that actual TypeScript failure and is covered by the existing recovery/closure fixtures. No old CLI behavior from the PR was copied wholesale.

## 19. Real fresh CLI consumer

**PASS with real pnpm installation, no package-install stubs.** Built and packed CLI 1.4.0 creates the clean external Vite app `consumer-review`, then the installed tarball executes init/add under Node 20.20.2. Only registry reads are forced to the packed fallback, because this uncommitted candidate is not deployed; npm-registry dependency installation remains real. This is local packed delivery proof, not hosted registry/publication proof.

The initial Grid install resolves Table **9.3.1**, installs **22 registry entries / 55 closure source/style files**, including both types contracts and the source hook, and passes strict TypeScript and production build. All 55 packed registry JSONs match the generated website bytes and LICENSE matches the repository. Two repeated adds and repeated init preserve customized Grid source, data CSS and theme byte-for-byte. The acceptance App imports a clean canonical stylesheet created using the real CLI's supported `init -y --css src/grid.css` option; the original Vite demo stylesheet is retained. A final real add/init rerun also preserves both stylesheets and customized source byte-for-byte. Representative filters, all editor kinds, virtualization, pinning/DnD and keyboard behavior run in the built app.

The separate external consumer is explicitly installed at Table **9.2.8**, builds and runs the same production acceptance suite. That earlier full Grid artifact is retained as historical evidence. The **current corrected CLI artifact** is `/private/tmp/baseui-grid-v9-node-compat/package/baseui-cn-1.4.0.tgz`, SHA-256 `f4b690c30a48bf9b539d5e4a678fb2906ceb2345f74fba518f5cc06c7242425d`. It declares CLI Node >=18 and is verified with a fresh real Node 20 consumer at `/private/tmp/baseui-grid-v9-node-compat/consumer-node20`. The actual packed CLI performs init/add/update with real pnpm installation, resolves Table 9.3.1 and passes TypeScript/production build. Focused browser smoke passes **9/9 groups** covering filters/editing/virtualization/DnD without repeating the approved responsive matrices. The fresh packed consumer verifies 22 registry entries / 55 installed closure files, all 55 registry byte matches, LICENSE and exact built-versus-packed CLI binary equality. It remains an uncommitted local review artifact, not a release.

## 20. TypeScript/lint/build

The CLI compatibility correction reruns CLI TypeScript/build, all 60 existing CLI fixture groups, all 59 onboarding tests, Node 18 built/packed compatibility suites (20/20 each), real Node 18 init/add/update and atomicity, a fresh real Node 20 packed Grid install/update/build/focused browser smoke, website TypeScript/lint and Node 22 production build, frozen installation, registry consistency and whitespace checks. The large Grid/browser/theme matrices below remain the approved earlier evidence; they were not repeated for a CLI-only guard. Approved runtime source and registry bytes are preserved.

| Required check | Result |
| --- | --- |
| frozen pnpm install | PASS, final lockfile up to date |
| website TypeScript / CLI TypeScript | PASS |
| pnpm lint | PASS, zero errors/warnings |
| theme:check / theme fixtures | PASS, original families + 28 color/radius matrices and contrast/focus checks |
| pnpm build:all / registry:check | PASS, 54 installables / 128 occurrences / three byte-identical copies |
| CLI build | PASS, Node 20 and Node 22 |
| CLI fixtures | PASS, 60 scenario groups rerun after correction; separate Node 18 built/packed suites pass 20/20 each |
| CLI onboarding | PASS, 59/59 rerun after correction |
| Next production build | PASS on Node 20.20.2 previously; rerun PASS on Node 22.22.3 after correction; retained Next 16.1.7 |
| Production endpoints | PASS 119/119, including 55 complete registry byte comparisons |
| Data Grid model/contract suite | PASS 50/50, also run on Node 20 |
| Consumer TypeScript/production builds | PASS, Table 9.2.8 and 9.3.1; fresh packed consumer on Node 20 |
| git diff --check | PASS |

The sandboxed initial build stalled and a concurrent retry hit its lock; that process was stopped and the final network/process-enabled Node 20 build passed. Those attempts are not product failures or claimed passes. Initial failing model/consumer/browser checks led to the documented migration, closure, measurement and accessibility fixes; retained intermediate logs are historical.

## 21. Production browser QA

Compatibility-correction scope: approved Grid runtime source is unchanged. The prior 35/35 groups per Table version and twenty axe audits per version remain the full acceptance record. A focused production smoke is rerun on the new real Node 20 packed consumer; the huge theme/width/browser matrices are intentionally not repeated for a CLI-only guard.

Reproducible harness: `scripts/fixtures/data-grid-v9.tsx`, `scripts/check-data-grid-browser.mjs`; model suite: `node scripts/check-data-grid.mjs`. Browser runner uses an isolated pnpm project containing Playwright and axe-core via BASEUI_TEST_TOOLS, a production URL via GRID_CONSUMER_URL and an evidence directory via EVIDENCE_DIR. It launches headless Chrome. Both consumer builds use real installed registry code.

**PASS 35/35 browser groups on 9.2.8 and 35/35 on the clean packed 9.3.1 consumer.** Final acceptance includes 35 browser groups per version, twenty axe audits per version (filter, editing, generated dialog, feature menu and sixteen responsive combinations), actual light/dark computed tokens, horizontal/virtual scroll, keyboard and async assertions. Website browser acceptance separately checks existing anchors, four previews, seven real feature controls, landing and document containment. Local review URLs (while the local servers run): http://127.0.0.1:3189/docs/components/data-grid and http://127.0.0.1:4180/. Evidence root: `/private/tmp/baseui-grid-v9-review/`; final JSON/screen captures are under `browser-packed-final/` and `browser-minimum-final/`, plus `site-browser.json` and `site-grid-*.png`. Intermediate browser directories/logs are superseded by those final outputs.

## 22. Known limitations

- Virtual DnD is not supported; use the separate combined/row/column nonvirtual renderer. This preserves the existing separation rather than claiming unsupported combinations.
- The demo source is in-memory. Durable persistence, authenticated backend filtering/mutations and conflict/version handling remain consumer responsibilities; the typed interfaces and cancellation/error behavior are tested.
- Incoming dates use documented calendar-day semantics, not timezone conversion of arbitrary locale strings. Facet arrays and Excel filters have separate server serialization contracts.
- **Existing CLI/upstream Vite CSS edge:** the retained demo stylesheet includes unlayered heading rules and semantic root variables. Keeping it as the acceptance stylesheet overrides layered overlay styles; the existing merge can also put dark defaults in the foundation layer, which loses against unlayered root declarations on a `.dark` root. Those CLI/theme files are byte-identical to main and this integration does not fix that separate baseline issue. Acceptance uses a clean stylesheet generated by the real CLI's explicit CSS option, with the original demo stylesheet preserved. Visual inspection caught this harness problem; final dark claims require real computed-color assertions, not a class name or screenshot filename.
- Browser coverage is Chromium with responsive emulation and axe/keyboard acceptance, not physical mobile, Safari/WebKit or screen-reader certification. Local consumers do not establish hosted registry alignment.
- The CLI retains Node >=18 support. Data Grid add/update (including `--all` when Grid is included) requires Node >=20 and rejects atomically on older runtimes. Repository/website development requires Node >=20.9.0. Current Fumadocs peer warnings about the already-retained Next version remain unchanged; production build passes.

## 23. Files changed

The correction itself changes exactly six files:

- `packages/cli/package.json`: published CLI engine >=18.
- `packages/cli/src/commands/add.ts`: shared add/update preflight, including selection/closure before mutation.
- `scripts/check-cli-node-compat.mjs`: real Node 18 built/packed compatibility and rejection-atomicity fixtures.
- `README.md`: separated CLI / development / Grid requirements and all-operation policy.
- `packages/cli/README.md`: the same user-facing runtime and future-version policy.
- `docs/data-grid-v9-integration-report.md`: corrected policy and fresh evidence.

All **550 other pre-correction repository files** are byte-identical, including every approved Grid/runtime/generated-registry file; see the saved pre-correction SHA-256 manifest. Exact cumulative uncommitted inventory follows. Generated changes are limited to the Grid distribution and its docs/preview outputs. **115 protected current-main files** (shared UI/styles, CLI source except the justified add path fix, routes/landing/source configuration/theme definitions/generators/LICENSE) were independently compared byte-for-byte with main and match.

- `README.md`
- `apps/www/components/data-grid/data-grid-column-filter.tsx`
- `apps/www/components/data-grid/data-grid-column-header.tsx`
- `apps/www/components/data-grid/data-grid-column-visibility.tsx`
- `apps/www/components/data-grid/data-grid-editing.tsx`
- `apps/www/components/data-grid/data-grid-filter-client.ts`
- `apps/www/components/data-grid/data-grid-filter-menu.tsx`
- `apps/www/components/data-grid/data-grid-filter-server.ts`
- `apps/www/components/data-grid/data-grid-inline-editor.tsx`
- `apps/www/components/data-grid/data-grid-pagination.tsx`
- `apps/www/components/data-grid/data-grid-table-dnd-combined.tsx`
- `apps/www/components/data-grid/data-grid-table-dnd-rows.tsx`
- `apps/www/components/data-grid/data-grid-table-dnd.tsx`
- `apps/www/components/data-grid/data-grid-table-virtual.tsx`
- `apps/www/components/data-grid/data-grid-table.tsx`
- `apps/www/components/data-grid/data-grid.tsx`
- `apps/www/components/data-grid/table-features.ts`
- `apps/www/components/previews/data-grid-previews.tsx`
- `apps/www/components/previews/data-grid/c-data-grid-1.tsx`
- `apps/www/components/previews/data-grid/c-data-grid-2.tsx`
- `apps/www/components/previews/data-grid/c-data-grid-3.tsx`
- `apps/www/components/previews/data-grid/c-data-grid-features.tsx`
- `apps/www/content/docs/components/data-grid.mdx`
- `apps/www/hooks/data-grid-feature-config.ts`
- `apps/www/hooks/data-grid-features-data.ts`
- `apps/www/hooks/use-data-grid-feature-data.ts`
- `apps/www/hooks/use-editable-data-grid.ts`
- `apps/www/lib/__generated__/docs-markdown.json`
- `apps/www/lib/__generated__/preview-sources.json`
- `apps/www/package.json`
- `apps/www/public/registry/data-grid.json`
- `apps/www/tsconfig.json`
- `apps/www/types/data-grid-data-source.ts`
- `apps/www/types/data-grid-filter.ts`
- `docs/data-grid-v9-integration-report.md`
- `package.json`
- `packages/cli/README.md`
- `packages/cli/package.json`
- `packages/cli/registry/data-grid.json`
- `packages/cli/src/commands/add.ts`
- `packages/registry/registry/data-grid.json`
- `pnpm-lock.yaml`
- `scripts/check-cli-install-fixtures.mjs`
- `scripts/check-cli-node-compat.mjs`
- `scripts/check-data-grid-browser.mjs`
- `scripts/check-data-grid.mjs`
- `scripts/fixtures/data-grid-v9.tsx`
- `scripts/registry-meta.mjs`

## 24. Final integration checkpoint — October 30, 2026

Final review has approved the Data Grid integration and corrected Node policy. This approval supersedes the earlier instructions to keep the integration uncommitted and stop for review. The exact approved scope is **48 files** on `integration/data-grid-v9`, with required parent `ce69919a4e7eb2ed32df3211e03681b36d375220`.

Final checkpoint checks all pass: frozen pnpm install; website and CLI TypeScript; uncached lint; official build:all; registry:check; CLI build; **60 CLI fixture groups**; **59 onboarding tests**; **20 Node 18 compatibility cases**; **50 Data Grid model/contract tests**; and git diff --check. All three registries remain byte-identical, with only their Data Grid JSON changed. Base UI 1.9.0, CLI/site 1.4.0, Table ^9.2.8 resolved to 9.3.1, shared overlays, theme, unrelated dependencies and onboarding/workspace capabilities remain preserved.

The accepted Node 20 packed consumer evidence remains applicable: the CLI tarball rebuild is **byte-identical** to the accepted corrected artifact, SHA-256 `f4b690c30a48bf9b539d5e4a678fb2906ceb2345f74fba518f5cc06c7242425d`. Official generation is byte-idempotent, and no runtime Grid source changed during the checkpoint. Earlier temporary consumer receipts are no longer on disk; the accepted results remain recorded in sections 6/19/21, and the matching artifact has been recreated. The approved full browser matrix was not repeated.

Checkpoint evidence is refreshed under `/private/tmp/baseui-grid-v9-checkpoint-20261030/`, including the literal approved-path manifest, source SHA-256 preflight, fresh validation logs and rebuilt tarball. Read-only remote checks still show main at the required parent and PR #3 at `ea960b03fd7e74beedf2db4c4bd52bbf5369badd`.

Authorized checkpoint action: commit exactly these 48 files with `feat: upgrade Data Grid to TanStack Table v9`, then push only `origin/integration/data-grid-v9`. This report records validation before the commit; the resulting commit/remote SHA, divergence and clean-tree receipt are returned after the push. Main merge, PR #3 mutation/merge, version bump, deployment, npm publication and tagging remain outside scope.
