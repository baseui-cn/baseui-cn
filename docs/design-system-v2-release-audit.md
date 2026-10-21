# Design System V2 — final CLI and release acceptance

## Final 1.4.0 release preparation — October 21, 2026

**RELEASE CANDIDATE READY — awaiting hosted registry deployment/alignment before npm publication.** This is a locally validated candidate; the release is not live. No merge, push, deployment, npm publication, tag creation, or template development was performed.

Preflight verified clean `feature/design-system-v2` at exactly `c835e74239be20e775acf266f592ab5daf51e310` (`fix: harden CLI release distribution`). This is the approved remediation checkpoint. The earlier NO-GO, remediation findings, and their then-current 1.3.3 evidence below are retained unchanged as historical records. This section supersedes their current-version and release-preparation status.

### Version inventory and scope

| Kind                              | Location / result                                                                                                                                                                                                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Authored generator version source | `packages/cli/package.json`: **1.3.3 → 1.4.0**. `scripts/build-registry.mjs` reads this manifest.                                                                                                                                                                        |
| Authored CLI banner               | `packages/cli/src/index.ts`: `.version("1.4.0")`; built and installed packed binaries both report **1.4.0**.                                                                                                                                                             |
| Authored site release metadata    | `apps/www/lib/site-config.ts`: CLI **1.4.0**, with stale Base UI metadata aligned to **1.9.0**.                                                                                                                                                                          |
| Generated distributions           | 55 JSONs each in `apps/www/public/registry/`, `packages/registry/registry/`, and `packages/cli/registry/`: 54 installables plus index. Every release version is **1.4.0**, all three distributions byte-equal.                                                           |
| Generated package index / catalog | `packages/registry/index.json` and `apps/www/lib/__generated__/catalog.json`, including catalog entry versions, are **1.4.0**. Total: **167 generated version files**.                                                                                                   |
| Other generation                  | Official `pnpm build:all` regenerates registry, 313 preview sources, 54 Markdown exports, and theme outputs. Preview/docs/theme bytes do not change. No generated file was hand-edited.                                                                                  |
| Changelog                         | New dated **October 21, 2026 / 1.4.0 Design System V2** entry in `apps/www/lib/changelog.ts`, above the retained October 19 compatibility-only entry. Only the new entry is marked Latest.                                                                               |
| Release convention                | `.github/workflows/publish-cli.yml` accepts `cli-v*` tags and manual dispatch; tagged version must match the CLI manifest. No workflow or tag changed. Updated the packaged README to document the complete deployment/alignment gate for both publishing paths.         |
| Independent packages              | Root, website, and private registry package versions remain **0.1.0**. Lockfile unchanged: SHA-256 `258edea91e371e54449b9b316270d6d7a9c47911f8e8f1942c381a92c4e8c5ef`.                                                                                                   |
| Historical versions               | Earlier audit evidence and unrelated dependency versions remain intact. No stale 1.3.3 release metadata remains in the current CLI, site config, indexes, catalog, or distributions.                                                                                     |
| Protected implementation          | All **251** tracked component, style, content, and CLI source files other than the version banner remain byte-identical to the approved checkpoint. Every generated registry/catalog diff is solely replacement of version fields. No component/design or template work. |

### Final local acceptance

Evidence root: `/private/tmp/baseui-cn-1.4.0-rc/`. The clean verification checkout is a fresh archive of the exact approved checkpoint with the reviewed release edits applied; it started without modules. The packed consumer is separately created and uses its own real npm installation, not workspace modules.

| Check                    | Result                                                                                                                                                                                                                                                                                                     |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frozen install           | **PASS**, `CI=true pnpm install --frozen-lockfile`, pnpm 9.0.0 / Node 22.22.3, 633 packages, resolution skipped, unchanged lockfile. Also completed in the working checkout. Initial sandbox network restrictions required a network-enabled retry.                                                        |
| TypeScript               | **PASS**, CLI and website. Website standalone check follows Fumadocs generation/production build. Packed consumer strict checks pass grid-only, final, and after recovery.                                                                                                                                 |
| Lint                     | **PASS**, zero errors and exactly one existing Data Grid `react-hooks/exhaustive-deps` warning at `data-grid-table-virtual.tsx:368:9` (effect at line 395). Warning left unchanged.                                                                                                                        |
| Theme                    | **PASS**, `pnpm theme:check` and all eight `pnpm theme:fixtures` families. Public theme remains 26 generic variables, zero public `--cn-*` variables.                                                                                                                                                      |
| Generation / registry    | **PASS**, `pnpm build:all` and `pnpm registry:check`: 54 installables, 119 embedded source/style occurrences, three identical distributions. Generated output also equals the working checkout.                                                                                                            |
| CLI build / fixtures     | **PASS**, CJS and declarations; full `pnpm cli:fixtures`, including complete re-add, sibling/style/dependency recovery, interrupted family, interactive reuse, overwrite, update, interactive replacement, and nonzero write-failure behavior. Fixtures stub npm; the packed consumer below uses real npm. |
| Next.js production build | **PASS**, 60 generated pages. The sandbox attempt was stopped while waiting on build/network work; the normal network-enabled production build and subsequent website TypeScript check pass. No product changes were needed.                                                                               |
| Production endpoints     | **PASS 119/119**, including all 54 component documentation routes, every registry response, docs, RSS, sitemap, robots, and llms exports. All **55 served registry JSONs** equal approved local bytes. This is local production-server proof, not public-host proof.                                       |
| Diff / scope             | **PASS**, `git diff --check`; 167 generated files change only version fields, five authored release/changelog/README files plus this audit. No lockfile, workflow, generator, component, style, preview, or template implementation change.                                                                |

### Actual local npm package

`npm pack --dry-run --json` and actual `npm pack --json` pass with matching shasum and file lists. The actual tarball is `/private/tmp/baseui-cn-1.4.0-rc/baseui-cn-1.4.0.tgz`.

- **60 files**, **189,944 bytes compressed**, **1,040,717 bytes unpacked**.
- Contains LICENSE (equal to root license), README, `dist/index.js`, `dist/index.d.ts`, all 55 registry JSONs, and package metadata.
- Contains no temporary files, QA fixtures, node_modules, private artifacts, or unrelated historical tarballs.
- Package metadata and the installed `node_modules/.bin/baseui-cn --version` both report **1.4.0**. Installed registry and dist bytes equal approved local outputs; installed LICENSE is present and byte-equal.
- SHA-256: `7f3a24f57d1eb799824c654c3679116c91782628d50c1e317c1c3a3016883ea4`.
- npm shasum: `dc172a38354a4c8ce9aab359b7d2b67099e3ef31`.

### Packed 1.4.0 consumer and interrupted-family recovery

**PASS.** A fresh Next 16.1.7 / React 19.2.4 / Tailwind 4.2.2 app installs the actual local tarball and runs its installed CLI for `init`, `add data-grid`, `add button`, `add select`, `add dialog`, `add date-picker`, and `add time-picker`. A test-only fetch-failure preload forces deterministic bundled-registry fallback; npm remains real and unrestricted. Production remote-first code is unchanged.

Data Grid automatically installs **`@tanstack/react-table@8.21.3`**, with consumer manifest **`^8.21.3`**. No dependency correction or generated source edit is needed. Grid-only and final strict TypeScript/production builds pass; all **48** installed source/style/utility files have complete local import closure, and the CLI-generated theme is preserved.

Recovery then customizes valid Data Grid and Button source, shared Button CSS, and theme values; removes `data-grid-table.tsx`, `data-grid-table-virtual.tsx`, `styles/data.styles.css`, and dependency `input.tsx`; and re-runs ordinary packed `add data-grid -y`. All four missing files are restored while surviving customized files and theme remain byte-identical. Repeated add/init is byte-idempotent, with strict TypeScript and production build passing afterward.

Six Chromium runtime assertions pass on the recovered packed consumer: **13 of 500** initial real rows; scroll updates the first visible row from `Person 0000` to `Person 0344` with 17 rows in the virtual window; application data updates produce `Updated Person 0344`; keyboard sorting changes the window content; and light/dark class checks at 320px preserve the custom primary color without horizontal document overflow. The first harness run expected the default primary after recovery had deliberately customized it; its corrected expectation passes, with no product change. These are local browser interaction checks, not physical-device, screen-reader, or general performance certification.

Principal evidence: `checks/`, `scope-integrity.json`, `pack-dry-run.json`, `pack.json`, `package-audit.json`, `packed-install.log`, `packed-consumer-results.json`, `packed-recovery-results.json`, `routes/rc-routes.json`, and `browser/virtual-results.json` with screenshots. Temporary harnesses and consumers remain outside the repository and package.

### Public release-note section — prepared for GitHub/npm announcement

**baseui-cn 1.4.0**

Highlights:

- Base UI 1.9 foundation, upgraded from 1.6.0 with existing public component APIs preserved.
- Design System V2 with Graphite and restrained Iris styling and improved dark mode.
- Simpler theming with 26 familiar generic variables and zero public `--cn-*` theming vocabulary.
- Improved focus, accessibility, touch, selection/search, overlays/menus, modal surfaces, navigation/disclosure, feedback, Table, and Data Grid interactions; corrected Date Picker reduced-motion behavior.
- Refreshed CLI distribution: compatible TanStack Table v8 installation, included license text, and repeated add that restores missing files while preserving customized source and shared styles.
- Refreshed website and documentation.

This text is prepared release material. Publication remains gated below; it does not announce a live release.

### Mandatory hosted registry release gate — not executed

1. Approve/merge the release code through the authorized process.
2. Deploy **baseui-cn.com** containing the V2 website and final **1.4.0** registry from the approved code.
3. Verify hosted registry **version AND bytes** against that approved local output. Prefer full comparison of all **55** JSON files; at minimum compare `index.json`, `button.json`, `data-grid.json`, `select.json` (shared selection CSS), `dialog.json` (modal CSS), `date-picker.json`, and `time-picker.json`. Parse each version, compare the complete response body, and fail on non-2xx, missing files, stale content, or byte differences. An index version alone does not pass this gate.
4. Only after alignment, create/push **`cli-v1.4.0`** and publish npm through the approved release process. Manual workflow dispatch is also publication and must obey this order.
5. Run an ordinary **remote-first** fresh consumer of published 1.4.0, without fallback hooks, and verify the installed V2 component/style bytes and runtime behavior.
6. Only then mark the release complete.

**Current operational gate: OPEN. RELEASE CANDIDATE READY — awaiting hosted registry deployment/alignment before npm publication.** No public deployment/alignment or published-package verification is claimed.

---

## Historical remediation and initial audit — retained records

October 21, 2026. **Current code/package decision: GO — conditional on hosted registry deployment/alignment before npm publication.** P0-1, P1-1 and P1-2 are resolved by the uncommitted remediation below. **P1-3 remains an OPEN OPERATIONAL RELEASE GATE.** Nothing is authorized for deployment or publication by this decision.

Baseline HEAD remains `257d99f90b95ac54f6f88673b99499523b3858b8` on `feature/design-system-v2`. The website and component implementation are unchanged. Current CLI version remains **1.3.3**; recommended release remains **1.4.0**. No version, tag, merge, publish, deploy, push, or template work was performed.

## Remediation acceptance — current results

The initial NO-GO audit and its original findings are retained below as historical evidence. This section supersedes their open/resolved status and final disposition.

| # | Release-critical result | Evidence / disposition |
| --- | --- | --- |
| 1 | P0-1 — **RESOLVED** | Data Grid declares a compatible v8 npm spec. Both fresh consumers automatically install v8 and pass compilation, production build and virtual-row runtime checks. |
| 2 | Final Table declaration | `@tanstack/react-table@^8.21.3` in `scripts/registry-meta.mjs` and all three generated Data Grid JSONs. CLI passes this complete string directly as an npm argument; no new dependency parser is needed. Website already uses `^8.21.3`, locked to 8.21.3. |
| 3 | Real fresh Data Grid | **PASS**: fresh Next 16.1.7 / React 19.2.4 / Tailwind 4.2.2 consumer, built CLI `init` then `add data-grid -y`, real npm, installed **8.21.3** with manifest **`^8.21.3`**, strict TypeScript and production build before adding more installables. No manual dependency correction or generated-source edit. |
| 4 | Real `add --all` | **PASS** after individual `add button`, `select`, `dialog`, `date-picker`, `time-picker`. All 54 installables compile and production-build with real dependencies; Table remains 8.21.3. Recursive closure covers 87 source/style/utility files. Own CLI-generated global theme is preserved. |
| 5 | P1-1 — **RESOLVED** | Ordinary add/reuse preserves every existing target file and writes missing files across the resolved component/dependency closure. Complete existing components remain byte-idempotent. Explicit overwrite, update and interactive replacement retain their replacement behavior. Component file-write failures now exit nonzero without printing successful completion. |
| 6 | Interrupted family | **PASS**, including a separate real-npm test through the installed packed binary. Removed `data-grid-table.tsx`, `data-grid-table-virtual.tsx`, `styles/data.styles.css` and dependency `input.tsx`; ordinary add restored all four while preserving customized `data-grid.tsx`, Button source, shared Button CSS and theme. Repeated add/init preserved all 46 installed source/style/utility files. Strict TypeScript/build pass after recovery. |
| 7 | P1-2 — **RESOLVED** | Added `packages/cli/LICENSE`, exactly equal to root LICENSE. No license terms or package version changed. npm automatically includes this conventional package-level file. |
| 8 | npm pack | **PASS** dry-run and actual local pack: **60 entries**, **189,495 bytes compressed**, **1,039,623 bytes unpacked**. LICENSE, README, dist, all 55 registry JSONs and package metadata present; no private/temp files, dependencies directory, fixtures or old tarballs included. |
| 9 | Packed consumer Data Grid | **PASS**: a second fresh Next consumer installs the actual `.tgz`, uses its installed binary for init and Data Grid/Button/Select/Dialog/Date Picker adds, receives Table 8.21.3 automatically, and passes grid-only and final strict TypeScript/production builds. Installed registry/dist bytes equal local output; packed LICENSE equals root text. |
| 10 | P1-3 — **OPEN OPERATIONAL RELEASE GATE** | Remote-first architecture is unchanged. Deployment and publication order is mandatory; see the five-step gate below. Local consumer tests do not certify current public hosting. |
| 11 | TypeScript | **PASS**: CLI and website; standalone website check follows generated Fumadocs collections. Fresh built, packed, all-installable and post-recovery consumers pass strict TypeScript. |
| 12 | Lint | **PASS**, zero errors and the same existing Data Grid `react-hooks/exhaustive-deps` warning at `data-grid-table-virtual.tsx:368:9`, referring to effect line 395. Unchanged and not fixed. |
| 13 | Builds / frozen install | **PASS** frozen pnpm 9.0.0 install in a fresh exact-baseline archive with the remediation overlay, lockfile unchanged, 633 packages. Official `build:all`, CLI CJS/declarations and production website builds pass. Fresh snapshot's first production attempt hit the known generated-`collections` prerequisite/race; an identical retry after generation passes, with 60 generated pages. Both logs are retained. |
| 14 | Registry | **PASS**: 54 installables, 119 embedded source/style occurrences, three byte-equal registry copies and matching indexes. Only Data Grid's required npm dependency string changes; all embedded component/source/style bytes remain unchanged. All 54 transitive closures pass; all-installable consumer TypeScript now verifies current dependency compatibility as well. |
| 15 | CLI fixtures | **PASS** complete original suite plus ten new release scenarios: complete re-add, sibling recovery, stylesheet recovery, dependency recovery, interrupted family, interactive reuse, overwrite, update, interactive replacement, and write failure. Existing incremental/reverse scenarios remain passing; an additional all-54 reverse incremental run also passes. These filesystem fixtures stub npm; separate fresh/packed/recovery consumers above use real npm. |
| 16 | Routes / anchors | **PASS**, 119/119 endpoint checks, served registry bytes equal remediated generated bytes, metadata unchanged. All 485 legacy anchors remain; final stable path/ID count remains 545 including Phase 9's 60 skip targets. |
| 17 | Files changed | Nine paths, listed below: seven tracked modifications plus the untracked audit and package LICENSE. No website/component implementation, CSS, theme, package manifest, lockfile, CLI version source, remote registry utility or indexes changed. |
| 18 | `git diff --check` | **PASS**, including separate whitespace validation of the two new files. |
| 19 | Git status | HEAD/branch unchanged, nothing staged, all remediation uncommitted. Seven `M` paths and two `??` paths as listed below. |
| 20 | Updated decision | **GO — conditional on hosted registry deployment/alignment before npm publication**, subject to final release approval. This is local code/package readiness, not an executed release or verified hosted rollout. |
| 21 | Version recommendation | Remains **1.4.0**. No breaking public component API change was introduced; no version or tag was edited. |

## Current implementation and recovery semantics

The registry's existing `dependencies.required` format is an array of npm install arguments. Its values are passed unchanged to `execa(pm, [..., ...uniqueDeps])`, so the supported representation is the ordinary scoped npm version spec `@tanstack/react-table@^8.21.3`. Official generation updates the three Data Grid registry copies. No generated JSON was hand-edited, and no component was adapted to Table v9.

The CLI still uses its existing requested/dependency conflict prompts. It first records the components explicitly selected for replacement, then includes incomplete families for repair. Reused families skip each existing file and write missing ones; shared CSS receives the same protection. Declining replacement can therefore preserve surviving customizations while completing missing siblings. Explicit `--overwrite`, `update`, and affirmative interactive replacement still refresh their selected files. A component write error is rethrown before the success message. README describes the ordinary missing-file recovery behavior.

The real packed recovery scenario deliberately customized valid installed source and CSS, then removed four files to represent an interrupted installation. It needed no overwrite flag, manual dependency edit, or source replacement. Theme values and every surviving file remained byte-identical. The ten repository fixture scenarios and real-npm recovery test provide complementary evidence.

## Real consumer and package proof

Evidence root: `/private/tmp/baseui-v2-release-remediation/`.

Both consumers start as independent fresh Next projects with their own npm-installed modules, not a workspace node_modules symlink. No website globals or preview helper is imported. Data Grid's canonical source is installed by the CLI; the disposable app supplies only its own 500-row specimen and normal application composition.

The built consumer exercises the unchanged **remote-first success path** against the local production registry through a test-only URL forwarding hook. It maps registry requests to local port 3180 and leaves npm installation untouched. The packed consumer and its recovery test exercise the **bundled fallback** through a test-only fetch failure. These hooks are outside the repository and do not change the CLI's remote-first implementation. No consumer needed a manual Table version correction. Actual public-host verification remains in P1-3.

The initial Data Grid-only install is type-checked and production-built before the rest of the journey. The built consumer then runs the requested six component adds and `add --all`; the packed consumer runs Data Grid and the four additional required packed-flow adds. Each final consumer is type-checked and production-built again. Twelve final Chromium assertions cover both consumers: initial virtual window, scroll-driven window update, application data update, keyboard sort, and independent light/dark themes at 320px. For each consumer, the initial window renders 13 of 500 rows; scrolling changes the first visible row from `Person 0000` to `Person 0344`, application updates change it to `Updated Person 0344`, and sorting changes it again. This is virtual-row correctness evidence, not a performance or physical-device certification.

Actual tarball SHA-256: `89c2895d0c2771436e90bafd1f5cff9a71b2ab7bdd6ba610e8b567c0b516a1fa`.

Dry-run and actual pack shasum: `f16b5df84ee8a45d3b12cada8e4bdd10391e0d8c`. The installed tarball's dist and registry files are byte-equal to approved local output. LICENSE text is byte-equal across root, package and installed tarball. CLI package and binary both remain 1.3.3. The private root/website/registry packages remain 0.1.0.

Principal current evidence:

- `consumer-results.json`, `consumer-acceptance.log`, `consumer-journey.log`, and grid-only/final consumer TypeScript/build logs.
- `packed-consumer-results.json`, `packed-acceptance.log`, `packed-consumer-journey.log`, and grid-only/final packed consumer logs.
- `packed-recovery-results.json`, `packed-recovery-add.log`, `packed-recovery-repeat.log`, and recovery TypeScript/build logs.
- `browser/virtual-results.json`, `browser/virtual-qa-accepted.log` and built/packed screenshots. The initial harness attempt lacked its geometry helper; it is retained separately, with no product code change required.
- `pack-dry-run.json`, `pack.json`, `package-audit.json`, the actual `.tgz`, and `packed-install.log`.
- `clean-frozen-install.log`, `clean-checks/`, `checks-final.json`, `closure-results.json`, `order-results.json`, `source-integrity.json`, and `routes/`.

## P1-3 — required operational release order

1. Release code approved/merged.
2. Deploy website/registry containing the final V2 registry.
3. Verify hosted registry bytes/version equal the approved local output.
4. Publish/tag CLI **1.4.0** through the normal release process.
5. Verify an ordinary remote-first fresh CLI consumer.

The future approved release commit must synchronize package, hardcoded CLI and generated registry versions before the matching tag/publication. Current remediation intentionally keeps them at 1.3.3. Hosted alignment cannot be satisfied by version equality alone: component bytes must also match. Do not change to bundled-first to bypass this gate. No step in this release sequence was executed by this remediation task.

## Release-note draft additions

Add these concise distribution notes to the existing undated/unversioned V2 draft retained below:

- Data Grid installations now constrain TanStack Table to the supported v8 release line.
- Re-running component installation restores missing files while preserving customized source and shared styles.

No dated/versioned changelog entry was published. P2 Fumadocs setup, inherited SEO completeness, the existing lint warning, physical-device certification, compact picker targets, and document-CSS-zoom limitations remain follow-ups/known limitations; no related code changes were made.

## Current scope and git status

```text
 M apps/www/public/registry/data-grid.json
 M packages/cli/README.md
 M packages/cli/registry/data-grid.json
 M packages/cli/src/commands/add.ts
 M packages/registry/registry/data-grid.json
 M scripts/check-cli-install-fixtures.mjs
 M scripts/registry-meta.mjs
?? docs/design-system-v2-release-audit.md
?? packages/cli/LICENSE
```

All 519 other tracked files are unchanged. The fresh remediation snapshot matches the working checkout's tracked files exactly after generation. The three changed registry JSONs differ only in the Table dependency string, with identical embedded sources. Package manifests, lockfile, hardcoded CLI version, registry indexes, remote-first implementation, all component/style/theme sources and prior phase reports remain unchanged. Root lockfile SHA-256 remains `258edea91e371e54449b9b316270d6d7a9c47911f8e8f1942c381a92c4e8c5ef`.

The original acceptance record below is historical. Its failed fresh-install, incomplete-family and missing-license findings are preserved rather than erased; their **current status is resolved** as documented above.

---

## Initial release audit — retained historical record

October 21, 2026. **Release decision: NO-GO.** Repository builds and production website acceptance pass, but a real fresh CLI consumer fails compilation after installing Data Grid. No implementation, design, version, or release changes were made. This report, including the release-note draft below, is intentionally uncommitted.

### Acceptance record

| # | Requirement | Result |
| --- | --- | --- |
| 1 | Final HEAD | `257d99f90b95ac54f6f88673b99499523b3858b8`, `feat: polish Design System V2 website`. This remains the authoritative final V2 implementation baseline. |
| 2 | Repository status | Preflight: exact `feature/design-system-v2`, exact HEAD, empty `git status --short`. Clean checkpoint archive and working checkout also compared byte-for-byte across all 526 tracked files after generation/builds: no differences. |
| 3 | Base UI | Website manifest, lockfile, installed package, and registry metadata: exactly **1.9.0**. Fresh CLI npm installation resolves 1.9.0 but writes `^1.9.0`; registry `baseUIVersion` metadata does not constrain npm installation. |
| 4 | Current versions | Root `baseui-cn`: **0.1.0**, private. Website `@baseui-cn/www`: **0.1.0**, private. `@baseui-cn/registry`: **0.1.0**, private. Publishable CLI `baseui-cn`: **1.3.3**; built and packed binaries report 1.3.3. |
| 5 | Recommended release | **CLI 1.4.0**, subject to approval and blocker remediation. No version changed. See version decision below. |
| 6 | Frozen install | **PASS** in a new archive of the exact checkpoint with no preexisting modules: `CI=true pnpm install --frozen-lockfile`, 633 packages, resolution skipped, lockfile unchanged. pnpm **9.0.0**, lockfile format **9.0**, Node **22.22.3**. Workflow uses Node 20. |
| 7 | TypeScript | CLI: **PASS**. Website: **PASS after Fumadocs generation** and within production build. Bare `tsc --noEmit` immediately after fresh install fails on missing generated `collections`; see P2-1. Fresh consumer with ordinary CLI dependencies: **FAIL** on Table v9. Changing only Table to 8.21.3 in the disposable consumer makes strict TypeScript pass. Packed small consumer: **PASS**. |
| 8 | Lint | **PASS with one existing warning**, zero errors. Clean checkout ran uncached. `apps/www/components/data-grid/data-grid-table-virtual.tsx:368:9`, `react-hooks/exhaustive-deps`: the `virtualItems` conditional can change dependencies of the effect at line 395. No warning fix was made. |
| 9 | Builds | **PASS**: `build:all`, CLI CJS/declarations, and actual Next.js 16.1.7 production build in both checkouts, including **60 generated pages**. `build:all` produces 54 registry entries, 313 preview sources, and 54 Markdown documents. Independent consumer production build passes with diagnostic Table v8 constraint; packed small consumer also builds. |
| 10 | Theme checks | **PASS**: `theme:check` verifies all three generated outputs; all eight theme fixture families pass. Canonical public theme contains **26 generic variables**, zero public `--cn-*` variables. Approved Graphite and restrained Iris defaults are intact. |
| 11 | Registry checks | **PASS**: 54 installables, 119 embedded source/style occurrences, and byte-equal public/package/CLI registry copies, including indexes. Production HTTP registry responses equal generated public bytes. |
| 12 | CLI fixtures | **PASS**, complete supported `pnpm cli:fixtures` in both checkouts. These fixtures deliberately stub npm installation; they prove filesystem/theme behavior, not compatibility with currently resolved npm versions. |
| 13 | Fresh CLI consumer | **Qualified FAIL**: real npm installation and every requested built-CLI command complete, with no manual component copying. Strict compilation then fails for Data Grid because the CLI installs Table 9.3.1. Other copied source compiles after only that dependency is changed to 8.21.3. |
| 14 | Mixed install order | **PASS** for fresh `add --all`, all 54 in reverse incremental order, and customized partial prior component sets expanded to all 54. Each results in 86 unique registry files. Repeated init/add is byte-idempotent. Interrupted files within one multi-file installable expose P1-1. |
| 15 | Customized theme preservation | **PASS**: existing primary, accent, ring, border, input, background, popover, radius, dark values, and unrelated consumer CSS remain intact. Missing defaults merge additively. Repeated init/add preserves resulting CSS bytes. |
| 16 | Customized source preservation | **PASS** under ordinary `add -y`: customized component source, utilities, and shared CSS survive dependency reuse, incremental/reverse installs, repeated add, and init. Explicit `--overwrite`, affirmative replacement, and `update` have documented replacement semantics and were not used on customized sources. |
| 17 | Local pack / dry-run | **PASS with packaging finding P1-2**: dry-run and actual local CLI pack have matching shasum, 59 entries, 188,545 compressed / 1,038,119 unpacked bytes. Required dist, README, metadata, and all 55 registry JSON files are present. No private/temp files or the tracked historical 1.0.2 tarball are included. MIT metadata is present; LICENSE text is absent. Other workspace packages are private. |
| 18 | Packed consumer | **PASS**: installed local `baseui-cn-1.3.3.tgz` into a separate fresh Next consumer, ran its installed binary's version/init/add flow with real npm installs, then strict TypeScript and production build. Installed dist and registry bytes equal the inspected package. See registry selection qualification below. |
| 19 | All 54 installable closure | **Structural PASS; dependency-version FAIL for Data Grid.** Independently traversed every registry closure, resolved local imports and stylesheet imports, checked npm package names against init plus transitive registry declarations, and verified actual full-install files. All source/styles are distributed; no unshipped website helper/global is required. Unbounded Table installation prevents an overall runtime-closure PASS. |
| 20 | Browser release acceptance | **PASS for final locked production website**: 195 component assertions, nine additional picker behavior checks, six supplementary keyboard checks, 139 website assertions, 15 supplementary website checks, and four search/theme/coarse assertions. Independent consumer has 11 generic-theme/responsive assertions. All final recorded assertions pass. |
| 21 | Date Picker | **PASS**: month/year/day navigation, keyboard caption focus, range continuity, bounded popup, LTR/RTL normal animation, and no view/month animation events with reduced motion. Protected caption/nav 24.5px, day 28px, caption inset 7px/gap 5.25px, chevron 12.25px, year/month buttons 33.25px, popup 245 × 272.5px. Compact touch exception remains. |
| 22 | Time Picker | **PASS**: draft changes, lossless Cancel, OK commit, Escape, desktop popup, explicit mobile dialog, and responsive bounds. Input 33.5px; desktop clock 238px; mobile dialog 308 × 491.6875px at 390px; 299px width/231px clock at 320px. No native software keyboard certification. |
| 23 | Data Grid | Locked website: **PASS** for responsive render and keyboard sort/pagination with visible row updates. Compatible standalone consumer renders two actual rows without website CSS. Normal fresh CLI dependency install: **FAIL**, P0-1. Existing lint warning remains separate from that blocker. |
| 24 | Routes | **119/119 expected production HTTP checks PASS**, including 54 component docs, 54 component registries, registry index, home, five guides, RSS, sitemap, robots, and llms.txt. This is an endpoint acceptance count, not Next's generated-page count. |
| 25 | Stable anchors | **485/485 legacy stable path/ID anchors preserved**. Final output has **545** stable path/ID occurrences: the original 485 plus 60 `main-content` skip-link targets introduced by Phase 9. Generated React/Base UI IDs are excluded. Exact final-checkpoint inventory is preserved. |
| 26 | SEO / metadata | **Baseline preservation PASS**, including canonical, description, OpenGraph and Twitter tags. Sitemap has 60 page URLs; robots, RSS, llms.txt, retained icons, and all 54 byte-equal Markdown exports pass. Completeness has inherited P2-2 gaps; preservation is not a claim of perfect SEO. |
| 27 | Changelog readiness | Existing latest entry accurately describes the earlier compatibility-only Base UI upgrade, but does not announce completed V2. A complete, unversioned release-note draft is prepared below. No live changelog/date/version was changed. |
| 28 | Blockers | **P0-1**: fresh Data Grid dependency incompatibility. **P1-1**: incomplete multi-file install recovery. **P1-2**: missing packed LICENSE. **P1-3**: hosted-registry alignment is an outstanding operational release gate. |
| 29 | Known limitations | Physical iOS/Safari/Android, WebKit, native software keyboard, real touch hardware, and manual screen-reader certification not performed. Existing anchored-popup document-CSS-zoom simulation limitation and compact picker touch targets remain. Existing Data Grid lint warning remains. |
| 30 | Version recommendation | **1.4.0**, not applied: substantial features/style improvements without intended breaking public component APIs. Private 0.1.0 package versions do not establish a public V2 major-version convention. |
| 31 | `git diff --check` | **PASS**, including final report whitespace validation. |
| 32 | Final git status | HEAD and branch unchanged; only `?? docs/design-system-v2-release-audit.md`. Nothing staged or committed. No publish, deploy, merge, tag, push, version bump, or template work. |

### Findings and release gates

#### P0-1 — ordinary fresh Data Grid installation installs incompatible Table v9

`scripts/registry-meta.mjs` declares `@tanstack/react-table` without a supported version range. `packages/cli/src/commands/add.ts` passes those names directly to npm. The real consumer received **9.3.1**, whereas the website uses **8.21.3**. The distributed grid calls the v8 table API.

Reproduction from the disposable Next.js 16.1.7 / React 19.2.4 / Tailwind 4.2.2 consumer:

```sh
node <built-cli>/dist/index.js init -y --css app/globals.css
node <built-cli>/dist/index.js add data-grid -y
npx tsc --noEmit
```

For deterministic final-V2 distribution acceptance, the tests force the CLI's existing bundled-registry fallback; npm installation itself runs normally. The current public registry was tested separately below. The generated files were never copied manually.

Representative errors include `TData does not satisfy the constraint TableFeatures`, `Table requires 2 type arguments`, and missing `getFilterValue`, `toggleSorting`, and other v8 methods. The failing package manifest and npm lockfile are preserved. Running `npm install @tanstack/react-table@8.21.3 --save-exact` in that consumer, with no component-source edits, makes all installed source pass strict TypeScript and the production build. This diagnostic constraint was not applied to the repository or called a successful ordinary fresh install.

Before release, declare and install a compatible Table range, regenerate all registry copies, and repeat the real fresh and packed Data Grid journeys. An offline dependency-install stub cannot certify this gate.

Evidence: `/private/tmp/baseui-v2-release-audit/consumer-types.log`, `consumer-failing-package.json`, `consumer-failing-package-lock.json`, `consumer-types-table-v8.log`, `consumer-build.log`, and `journey-results.json`.

#### P1-1 — interrupted multi-file installation cannot safely complete missing files

A separate fixture starts with only a customized surviving `components/data-grid/data-grid.tsx`. Running `add data-grid -y` preserves that file, but leaves `data-grid-table.tsx` absent and prints “Done. Components are yours”. Partitioning treats any existing non-style file as a collision for the entire installable.

Ordinary partial prior *sets of components* pass; an interrupted *family of files* does not repair. Current README semantics explain skipping existing targets and explicitly replacing with `--overwrite`/`update`; those commands can replace consumer edits. No customized file was overwritten during this audit. Provide a safe missing-file recovery path or an explicit incomplete-install diagnostic and reviewed recovery instructions before claiming full partial-install recovery.

Evidence: `orders/interrupted-family/`, `partial-family-add.log`, and `order-results.json` under the audit evidence directory.

#### P1-2 — CLI package omits the license text

The root repository has `LICENSE`, and the packed CLI declares `license: MIT`, but the actual 59-file package contains no LICENSE file. The package's explicit file list includes dist, registry and README; npm does not import the monorepo root license into this package. Include the expected license text in the release package and rerun pack inspection. README, executable mode, metadata, dependency declarations and dist are otherwise correct.

#### P1-3 — remote-first CLI still receives older hosted registry source

The CLI first fetches `https://baseui-cn.com/registry`, then falls back to its bundled registry on failure. Live read-only checks return index version 1.3.3, but hosted Button and Data Grid JSON differ from final V2 local bytes. A separate unmodified packed CLI init/add journey, without any registry hook, confirms its installed Button differs from final V2.

This is an expected predeployment state, not evidence that the V2 bundle is corrupt. However, publishing a new CLI alone does not guarantee consumers receive its V2 component source. After separate release approval, coordinate hosted registry deployment with package publication and verify actual remote source equality and consumer installation. No deployment/publication was performed here. Deterministic bundled tests and the existing-hosting smoke are reported separately.

Evidence: `hosted-registry.json`, `hosted-cli-result.json`, and `hosted-consumer/`.

#### P2-1 — clean website TypeScript requires generated Fumadocs collections

The first direct website TypeScript command in the fresh checkout fails with `lib/source.ts(2,22): TS2307 Cannot find module 'collections'`. Next's configured Fumadocs integration generates `.source/index.ts` when the build starts; the production build and a subsequent identical TypeScript command pass. This is a reproducible setup prerequisite, not an unresolved TypeScript implementation failure. Document the generation prerequisite or add a supported preparation command in a future maintenance change.

The initial primary-checkout frozen install attempt encountered sandbox DNS failure and an interactive modules-reinstall prompt, and was not counted as success. The separate clean-checkout frozen install above genuinely completed. Sandboxed production builds were terminated and rerun successfully with the access needed for font fetching/build workers. Initial attempt logs are retained.

#### P2-2 — inherited metadata completeness gaps

Exact baseline metadata comparison passes for all expected pages. A separate completeness inventory finds:

- `/docs/installation`, `/docs/theming`, and `/docs/llms` inherit canonical and OpenGraph URL `/docs`; 57 of the 60 sitemap pages are self-canonical.
- 58 pages have no explicit `og:image` tag.
- All 54 component pages retain Twitter image URL `/opengraph-image`, which returns **404** in the local production output. `/baseui-cn-og.png` and retained icon assets return 200.

These values already exist in the pre-Phase-9 metadata snapshot. No SEO source was changed during this acceptance pass. They are acceptable follow-ups for this audit, not newly introduced V2 visual regressions. Evidence: `seo-results.json`, `metadata-assets.json`, and `browser/route-comparison.json`.

### Consumer and theme evidence

The real consumer was created from scratch outside the workspace, with Next **16.1.7**, React/React DOM **19.2.4**, TypeScript **5.9.3**, and Tailwind/PostCSS **4.2.2**. It uses its own `app/globals.css` generated by CLI init. It does not import website globals, previews, or runtime dependencies through a workspace node_modules symlink.

The built CLI ran these actual supported commands, each individually, with real npm installation:

```text
init -y --css app/globals.css
add button -y
add input -y
add field -y
add checkbox -y
add select -y
add combobox -y
add command -y
add popover -y
add dropdown-menu -y
add dialog -y
add drawer -y
add tabs -y
add navigation-menu -y
add alert -y
add toast -y
add table -y
add data-grid -y
add date-picker -y
add time-picker -y
add login -y
add --all -y
```

The last command expands coverage to all 51 components and three blocks. The full repository fixtures plus additional fresh/reverse/custom-partial tests exercise A–G and prior component-set installation under H. The interrupted-family exception under H is recorded above. Additional broad order fixtures intentionally stub npm; the separate real consumer is the dependency-resolution evidence.

All 54 independent transitive closure analyses include init-owned `cn()`/npm dependencies, component-local imports, grouped source families, shared icons, hooks, and CSS. Shared icons are shipped with auth and are not an unshipped website-only helper. Registry source/style occurrence count is 119; actual union of installed registry file paths is 86, plus init's utility/config/global stylesheet.

The ordinary variables `--primary`, `--accent`, `--ring`, `--border`, `--input`, `--background`, `--popover`, and `--radius` were checked through actual computed consumer styles. Tests cover defaults, custom primary, custom accent, keyboard ring, a complete 26-variable green theme, both app themes under opposing OS preferences, and 320/390/768/1440px fit. Input assertions target the styled shell and checkbox assertions target the rendered checkbox root, rather than native hidden inputs. All 11 final assertions pass. These runtime tests use the diagnostic compatible Table dependency and do not erase P0-1.

`apps/www/lib/utils.ts` is byte-identical to the pre-V2 Base UI upgrade checkpoint; the init-generated `cn()` retains the same `twMerge(clsx(inputs))` implementation. Active components, CSS, current docs, generated theme, and all distributed registries have no obsolete `--cn-*` references. Repository-wide matches remain in historical phase reports and the negative theme fixture assertion; those are historical/test text, not a public theming requirement.

### Package and release workflow

The sole publishable package is `packages/cli`. Its documented flow is to choose/bump the CLI version, commit/push to main, and push a matching `cli-v<version>` tag. `.github/workflows/publish-cli.yml` also supports manual dispatch; it freezes dependencies, builds generated artifacts, checks the CLI, builds it, and publishes to npm. This audit did not invoke that workflow.

Local commands used:

```sh
npm pack --dry-run --json
npm pack --json --pack-destination /private/tmp/baseui-v2-release-audit
```

The packed CLI includes `dist/index.js`, `dist/index.d.ts`, README, package metadata, 54 component registries and their index. All external requires in dist are covered by CLI dependencies. No env files, caches, node_modules, fixtures, private/temp files, or historical tarball are packed. Size is sensible for the complete bundled fallback registry.

Tarball SHA-256: `3bf0bd6cd0fc935d60eec71ecbb8e0c9ea130ef2837e30a99e641002a0e84a55`.

The separate packed consumer installs this exact tarball with npm, executes the installed binary's init and `add button select dialog date-picker -y`, compiles all installed source, and builds production output. Its bundled-registry fallback is selected deliberately; real npm dependency installation is not stubbed. A further ordinary remote-first packed flow is the hosted-registry evidence above. No npm network publication occurred.

**Version decision: recommend 1.4.0.** V2 is materially more than a patch: Base UI 1.6 to 1.9, substantial component/website modernization, simpler generic theming, dark-mode, interaction and accessibility improvements. Existing public component APIs are intentionally preserved, so a major CLI version is not justified solely by the design-system name “V2”. The release convention requires a human-selected version; it does not make a bump automatic. A future approved release commit must synchronize `packages/cli/package.json`, the hardcoded CLI `.version()` in `src/index.ts`, generated registry/catalog version fields, and the matching tag. Keep private package versions separate unless a new convention is approved.

### Prepared release-note draft

**Design System V2 — version and publication date pending approval**

- Upgraded the Base UI foundation from v1.6.0 to exactly v1.9.0 and refreshed the distributed registry.
- Refreshed components with the approved Graphite and restrained Iris visual system while preserving public component APIs.
- Simplified theming around 26 familiar generic variables, including primary, accent, ring, surface, border and radius values; fresh installs require no public `--cn-*` vocabulary. Existing customized themes remain authoritative during additive initialization.
- Improved application-controlled dark-mode consistency, keyboard focus visibility, and touch/accessibility behavior across supported component families. Physical-device and screen-reader certification remains outside this local acceptance.
- Refined selection and search states in Select, Autocomplete, Combobox and Command.
- Improved popup/menu surfaces and focus treatments while retaining Base UI positioning and interaction ownership.
- Refined Dialog, Alert Dialog and Drawer modal surfaces; Drawer uses the native Viewport composition.
- Improved Tabs, navigation and disclosure presentation while preserving native indicator, orientation and disclosure behavior.
- Refined feedback, table and grid presentation, including Data Grid visible-row updates and compact pagination wrapping.
- Refreshed website navigation, docs hierarchy, previews, code, search, homepage and footer while retaining component URLs, Markdown/AI exports and all 485 legacy anchors.
- Corrected Date Picker view/month animation behavior for reduced-motion preferences in LTR and RTL, preserving existing picker geometry and behavior.

This draft is not a publication announcement. Do not add claims that the preview Menu filtering API or speculative `createItems` APIs were adopted; they were intentionally not adopted. Do not claim warning-free lint, universal 44px picker targets, screen-reader certification, physical mobile certification, or a successful ordinary fresh Data Grid install until its blocker is resolved. The existing Base UI-only changelog entry can remain as historical release information; the approved V2 entry should be added above it in the release commit.

### Browser scope and known limitations

Final locked production coverage includes Button/Input, Field/form controls, Select/Combobox, Command, Menu/Popover, Dialog/Drawer, Tabs/NavigationMenu, Toast, Table/Data Grid, Date Picker and Time Picker. Light/dark, opposing OS/application themes, 320/390/768/1440px, keyboard, reduced motion and emulated coarse/touch media are covered. Every one of the 54 docs additionally fits at 320px without document overflow or failed previews. Keyboard checks include actual Data Grid menu sorting and pagination with changed visible rows, component Tabs, checkbox toggling, menu dismissal/focus return, selection/search, and modal focus return. Representative desktop/mobile website and standalone-theme screenshots were visually inspected.

The accepted browser logs total 195 component checks, nine picker behavior checks, six supplemental component keyboard checks, 139 website checks, 15 supplementary website checks, four search/theme/coarse assertions, and 11 standalone consumer theme/fit assertions. Earlier harness attempts are retained: asynchronous preview readiness, actual rendered native/hidden-input anatomy, menu-based grid sorting, pagination accessible labels, and close-transition timing required harness corrections. No production code was changed to satisfy those checks.

Known limitations remain:

- No physical iOS/Safari/Android or WebKit-engine certification.
- No native software keyboard/IME, physical gesture velocity, real safe-area/notch, or hardware touch certification.
- No manual screen-reader certification.
- Anchored-popup document-CSS-zoom simulation limitation remains; native browser zoom is not certified.
- Date/Time retain approved compact touch targets; Date days are 28px and some Time list/footer controls are also compact.
- The existing Data Grid lint warning is retained.
- Bundled-registry acceptance is distinct from current public hosting and from postpublication verification.

### Reproduction and evidence

Evidence root: `/private/tmp/baseui-v2-release-audit/`. All consumers, dependency installs, tarballs, screenshots and diagnostic scripts are disposable local artifacts outside the repository.

Supported repository checks were run against the initial clean checkpoint and repeated in `clean-checkout/` after the real frozen install:

```sh
pnpm install --frozen-lockfile
pnpm --filter ./apps/www exec tsc --noEmit
pnpm --filter ./packages/cli exec tsc --noEmit
pnpm lint
pnpm theme:check
pnpm theme:fixtures
pnpm build:all
pnpm registry:check
pnpm --filter ./packages/cli build
pnpm cli:fixtures
pnpm --filter ./apps/www build
pnpm --filter ./apps/www exec tsc --noEmit
git diff --check
git status --short
```

The final website TypeScript command verifies generated collections. Production builds requiring sandbox-external font/native-worker access have separate successful `build-production-network.log` files. The original canceled attempts and the first clean TypeScript failure remain visible in `checks.json`; `check-results-final.json` records their qualified final outcomes.

Principal evidence:

- `clean-frozen-install.log`, `clean-checks/`, `check-results-final.json`, `source-integrity.json` and `foundation.json`.
- `journey-results.json`, `journey-add-*.log`, both failing consumer manifests/lockfiles and consumer TypeScript/build logs.
- `closure-results.json`, `order-results.json`, `orders.log`, `partial-family-add.log`.
- `pack-dry-run.json`, `pack.json`, `package-audit.json`, `packed-journey.log`, `packed-types.log`, `packed-build.log`.
- `hosted-registry.json`, `hosted-cli-result.json`, `seo-results.json`, `metadata-assets.json`.
- `browser/*results.json`, `browser/regressions.log`, `browser/regressions-remaining.log`, `browser/keyboard-extra-accepted.log`, website/visual logs, before/after route inventories and `route-comparison.json`.
- `theme/results.json`, `theme/qa-corrected.log`, and final light/dark/responsive website and consumer screenshots.

Final disposition: **stop for release review; do not publish or deploy this baseline as accepted until P0-1 is resolved and P1 findings are addressed or explicitly dispositioned.** Only this audit document is left uncommitted. No release approval has been inferred.

---

**Current disposition after remediation: GO — conditional on hosted registry deployment/alignment before npm publication. P0-1, P1-1 and P1-2 are resolved; P1-3 remains open. Stop for final release approval. All changes remain uncommitted; recommended version remains 1.4.0.**
