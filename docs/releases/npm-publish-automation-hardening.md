# npm release automation hardening

## Current operation — November 10, 2026

The remainder of this document preserves the November 2 engineering checkpoint,
including its then-unqualified OIDC status and transitional setup instructions.
OIDC Trusted Publishing subsequently published 1.4.2 and 1.5.0 successfully. See the
[final 1.5.0 release receipt](./1.5.0-release-receipt.md) and
[post-release housekeeping audit](./1.5.0-housekeeping.md).

`publish-cli.yml` now has one unconditional OIDC publish step after the unchanged
annotated-tag, stored-artifact, hash, source, version-availability and remote-tag
checks. It publishes the reviewed `package.tgz` directly, without rebuilding or
repacking. It supplies no npm token and has no publication retry or alternate
authentication step. An OIDC failure fails the job. The old
`NPM_TRUSTED_PUBLISHING_ENABLED` variable no longer selects an authentication path.

Owner-side cleanup remains separate from code cleanup. GitHub's repository secret
listing on November 10 still contains `NPM_TOKEN`; its value was not read. The
repository variable listing still contains `NPM_TRUSTED_PUBLISHING_ENABLED=true`.
After this cleanup reaches main, remove the obsolete GitHub secret and variable;
revoke the corresponding npm write token in the owner account after checking for
other consumers. Inspect organization/environment secrets for any inherited copies.
No secret, token, repository variable or npm setting was deleted or changed here.
The current npm account token inventory and package policy were not inspected.

Keep the qualified npm Trusted Publisher for `baseui-cn/baseui-cn`, workflow filename
`publish-cli.yml`, with direct publish permission and no GitHub Environment binding.
The owner should review npm's package publishing policy to restrict token-based
publishing after migration, following [npm's trusted-publishing guidance](https://docs.npmjs.com/trusted-publishers/).
Future releases still require explicit approval of the exact prepared artifact and
annotated tag; this housekeeping is not release authorization.

## Historical engineering checkpoint

Review checkpoint — 2026-11-02. Uncommitted; no release authorized by this document.

## 1. Scope and 1.4.1 incident

Public `main` was verified remotely as `2842bf1300760c3daf7befb4edb98893549f0eef`. Public npm latest remains `baseui-cn@1.4.1`. The seven approved release-engineering paths are now isolated on `chore/npm-release-hardening` in `/private/tmp/baseui-cn-npm-release-hardening`, based on that exact public-main SHA. The separate Data Grid checkout remains at `aa3744d329621fb1d6e70d68d396e1e6c3d051a6`. Initial builds/install/packing ran in disposable copies of public main; integration validation ran from the isolated main-lineage worktree. No component, registry, website, package version, Data Grid, Pro, secret, or production changes are included.

The failed [1.4.1 workflow run](https://github.com/baseui-cn/baseui-cn/actions/runs/41189256262) used source `975eb8d8ffec35de9a2a9b3b4237eed84396a740`. Install, registry generation, typecheck, and CLI build passed; npm PUT returned E404. The approved candidate had SHA-256 `929569083c0caf3aea2b01189bcb9cedd013b8d065e50c432bcb96f39bc4a6a7`, but CI reported package SHA-1 `8bc3222f1048faaf9283c5af21681d6f89b13a8a`. Retained evidence records owner-authenticated manual publication of the preserved approved tarball. The resulting public artifact matched the approved bytes.

Retained local evidence: `/private/tmp/baseui-cn-1.4.1-release-execution/{baseui-cn-1.4.1.tgz,baseui-cn-1.4.1-public.tgz,pack.json,publish-failure.log,publish-run.json,published-identity.json,registry-manifest.json}`. Historical CI uploaded no artifact (API returned zero artifacts). Full workflow logs were retrieved read-only into `/private/tmp/baseui-npm-hardening/ci-1.4.1.log`. No secret values were printed or copied into this report.

## 2. Exact previous workflow and lifecycle

`publish-cli.yml` is identical at the supplied public-main baseline and the working checkout before this task. It has `cli-v*` push and unrestricted `workflow_dispatch`, `ubuntu-latest`, `contents: read`, checkout v4, pnpm action v4 (root pins pnpm 9.0.0), setup-node v4/Node 20 with registry authentication configuration, frozen install, a tag-only version comparison, `build:all`, CLI typecheck, CLI build, and `pnpm publish --access public --no-git-checks` with `NODE_AUTH_TOKEN: secrets.NPM_TOKEN`.

`build:all` runs registry/theme generation, preview source generation, and documentation Markdown generation. The CLI `build` script runs the registry generator again, followed by tsup. Its only package scripts are `build`, `dev`, and `clean`; there are no prepare/prepack/prepublish hooks. Thus publication did **not** secretly rerun the build through a lifecycle hook. It did silently create a different archive through pnpm's packer.

[pnpm 9 publish source](https://github.com/pnpm/pnpm/blob/v9.0.0/releasing/plugin-commands-publishing/src/publish.ts) shows directory publishing invokes available prepublishOnly/prepublish hooks, calls pnpm pack, and passes that temporary tarball to npm with `--ignore-scripts`; successful publication then runs publish/postpublish hooks. pnpm pack invokes available prepack/prepare/postpack hooks. None exists here. `--no-git-checks` skips branch, cleanliness and remote-history checks; it is not an artifact-approval check. [npm lifecycle documentation](https://docs.npmjs.com/cli/v11/using-npm/scripts/) describes npm's related lifecycle behavior.

## 3. E404 and authentication analysis

The old workflow depends on a long-lived write credential with externally managed identity, package permissions, expiry/revocation, and publishing/2FA policy. A secret existing in GitHub does not prove it is a usable publishing credential. Masked logs do not prove token validity or ownership. The workflow neither bound package bytes to approval nor qualified its npm publishing identity.

Cause categories consistent with the evidence include an absent/invalid/expired/revoked credential, a valid credential for the wrong identity or with insufficient package scope, and package publishing/2FA policy incompatibility. Incorrect registry/auth configuration is another category, although the logged PUT used the intended public registry endpoint. The owner successfully publishing the preserved package narrows the investigation toward authentication/authorization, but **E404 alone does not identify which category occurred**. We did not inspect the token, account, npm settings, or private npm debug log, and do not assert an exact credential failure.

Rebuilding/repacking after approval replaces the reviewed object. A green build and matching package version do not authorize newly generated bytes. Authentication remediation must not publish the CI replacement just because its build passed.

## 4. Package byte-drift root cause — reproduced

[Machine-readable member-by-member evidence](./1.4.1-package-drift.json) includes both archive identities, all 60 member hashes, modes/metadata comparisons, ordering, gzip headers, decompressed-tar hashes, and representative raw tar-header fields.

| Artifact                           |  Bytes | SHA-1                                      | SHA-256                                                            |
| ---------------------------------- | -----: | ------------------------------------------ | ------------------------------------------------------------------ |
| Approved / public / local npm pack | 198149 | `6efe42b5ac183f42a7f855bd7978caa66eae8084` | `929569083c0caf3aea2b01189bcb9cedd013b8d065e50c432bcb96f39bc4a6a7` |
| Local pnpm 9 pack, macOS           | 199634 | `c648b869c06f510d4e1caf35ec297351316f0b88` | `90ddcc22a80b10533672e2894f407fcba262a37fe288ced6d0fdec55b3a5addd` |
| Reconstructed Linux pnpm pack      | 199634 | `8bc3222f1048faaf9283c5af21681d6f89b13a8a` | `8d7b9f51101cd874410be9b5c200a82c848efe237969d2379f730808276b752e` |

The third row is a reconstruction, not a recovered CI tarball: changing **only gzip OS byte 9 from macOS `0x13` to Linux `0x03`** in the locally produced pnpm archive reproduces CI's complete logged SHA-1 exactly. No compressed payload, tar header, or member was edited in this reconstruction.

Findings:

- All 55 registry JSON members match, including generated registry source strings. Both dist files, README, and LICENSE also match byte-for-byte. Source package/build inputs are unchanged between the incident commit and current public main; the intervening changes are landing UI/report/browser-check files.
- Only `package/package.json` member bytes differ: npm preserves its 1036-byte text; pnpm's exportable manifest is 1035 bytes, moves `scripts` after dependency fields and removes the final newline. Parsed JSON is equal. This is member content drift, even though metadata semantics are unchanged.
- Both archives contain the same 60 names in the same order. Modes match: `dist/index.js` is 0755, all others 0644. Semantic tar fields match: uid/gid 0, empty owner/group names, fixed mtime 499162500 (`1985-10-26T08:15:00Z`), regular files, no PAX metadata. Nevertheless, all 60 raw 512-byte headers differ, including numeric encoding/checksum formatting.
- Gzip headers are npm `1f8b08000000000002ff` and reconstructed Linux pnpm `1f8b0800000000000003`: both have zero mtime/no filename; npm uses its high-compression/platform-neutral encoding, while pnpm uses its default compression and host OS marker. Decompressed tar hashes also differ, so gzip metadata alone cannot explain the incident.
- CI logs record Node 20.20.2, npm 10.8.2, pnpm 9.0.0, tsup 8.5.1. Reproduction used Node 22.22.3/npm 10.9.8/pnpm 9.0.0. A second build/pack under Node 24.22.2/npm 11.16.0 also produced the **exact approved SHA-256**. The original approved pack's precise historical Node/npm versions were not retained; they are not inferred.

Classification: **B + F** (package.json text difference and different npm versus pnpm packing implementations), with additional archive header/compression differences. **A (metadata only) is insufficient because a member changed. C and D are not observed; E is not the demonstrated cause.** The exact CI SHA-1 reproduction explains the incident without alleging generated-content or build nondeterminism. [pnpm 9 pack source](https://github.com/pnpm/pnpm/blob/v9.0.0/releasing/plugin-commands-publishing/src/pack.ts) confirms its separate tar-stream/zlib packing path and manifest serialization.

Reproduction command after building the public-main disposable source and packing it once with each package manager:

```sh
python3 scripts/releases/audit-pack-drift.py \
  --approved /private/tmp/baseui-cn-1.4.1-release-execution/baseui-cn-1.4.1.tgz \
  --npm-pack /private/tmp/baseui-npm-hardening/npm-pack/baseui-cn-1.4.1.tgz \
  --pnpm-pack /private/tmp/baseui-npm-hardening/pnpm-pack/baseui-cn-1.4.1.tgz \
  --ci-sha1 8bc3222f1048faaf9283c5af21681d6f89b13a8a
```

## 5. Chosen authority model

**The tarball that is reviewed is the tarball that is published.** Use preparation workflow + immutable Actions artifact + an approved annotated tag. Reproducibility is useful evidence, but publication does not depend on successful reproduction.

1. Owner dispatches `prepare-cli.yml` from a ref whose exact HEAD equals the full `commit` input, with explicit stable version. This identity check is essential: Actions run `head_sha` describes the dispatch ref, not an arbitrary checkout input.
2. Preparation checks out that commit, installs frozen dependencies, generates/checks registry, typechecks/builds CLI, and calls pinned **npm pack once**, with lifecycle scripts disabled. The clean tracked/untracked source check rejects unexpected generated drift. Output lives outside the checkout.
3. Upload `package.tgz` and `release-manifest.json`, without overwrite, for 30 days. The manifest records source commit/version, tarball SHA-256, independent per-registry-file SHA-256 map, full member hashes/lengths/modes and toolchain versions.
4. The summary provides a JSON tag-message proposal containing exact run ID, artifact ID, version, source commit, tarball SHA-256, release-manifest SHA-256 and separately computed registry-manifest SHA-256. These are proposals until the owner downloads/reviews the artifact and approves those exact values.
5. Following separate release approval, an **annotated** `cli-vX.Y.Z` tag must have immediate tag-object headers `object <approved-source-commit>`, `type commit`, and `tag cli-vX.Y.Z`, and contain only that reviewed JSON as its message. The immediate target must actually be a Git commit object; recursively peeling a tag chain is not approval authority. A lightweight tag or ordinary prose annotation fails. The tag carries approval outside the source tree, avoiding a circular commit hash or a second source commit just to add an approval file. No tag was made in this repository during this task.
6. Publisher validates the tag annotation, successful preparation workflow/run/repository/HEAD, artifact ID/name/expiry/run binding, and all package gates. It downloads the exact artifact by ID. There is no install, build or pack step in publication.
7. It runs `npm publish /absolute/path/package.tgz --access public --ignore-scripts --registry=https://registry.npmjs.org` from an empty directory, avoiding the working-directory manifest substitution documented in pnpm's implementation. npm receives the preserved file; its [publication implementation](https://github.com/npm/cli/blob/v11.16.0/workspaces/libnpmpublish/lib/publish.js) builds attachment/integrity metadata from those tarball bytes.

This is stronger than rebuilding and comparing a hash because it removes an entire build/pack trust transition from the publishing job. It is smaller than adding an approval service or configuring an environment: the existing reviewed release tag is the approval boundary. Only authorized release owners should be able to create/update `cli-v*` tags; configure repository tag rules accordingly before adoption. Anyone permitted to rewrite both release code and approval tags remains inside the trust boundary. Approval hashes are independent of the uploaded bundle, not accepted merely because a bundle contains its own checksum.

## 6. Trusted publishing design and current action versions

Release jobs use GitHub-hosted Ubuntu, Node 24, npm 11.16.0. npm documents a minimum of npm 11.5.1 and Node 22.14.0 for trusted publishing. The publishing job grants `contents: read`, `actions: read` for cross-run artifact retrieval, and `id-token: write`; preparation has only `contents: read`. [Official npm requirements](https://docs.npmjs.com/trusted-publishers/).

This release runtime does not redefine the CLI's documented Node support. No engines/package metadata was changed. npm 11.16.0's own engines allow Node `^20.17.0 || >=22.9.0`; the selected Node 24 also satisfies npm's higher documented trusted-publishing runtime floor.

Official release tags/commit refs were verified read-only on 2026-11-01. Each use is pinned to a complete commit SHA, annotated with its release:

| Action                                                                                        | Verified supported release | Pinned commit                              |
| --------------------------------------------------------------------------------------------- | -------------------------- | ------------------------------------------ |
| [actions/checkout](https://github.com/actions/checkout/releases/tag/v7.0.1)                   | v7.0.1                     | `3d3c42e5aac5ba805825da76410c181273ba90b1` |
| [actions/setup-node](https://github.com/actions/setup-node/releases/tag/v7.1.0)               | v7.1.0                     | `949feb2413d6458794dcd2491c4babbbce0c15c1` |
| [pnpm/action-setup](https://github.com/pnpm/action-setup/releases/tag/v6.1.0)                 | v6.1.0                     | `d9184bf108216479bc5a137cc391f4d7b14c870b` |
| [actions/upload-artifact](https://github.com/actions/upload-artifact/releases/tag/v7.0.2)     | v7.0.2                     | `cf430e030ddbb5b0abf93d22962f4752f3646cd9` |
| [actions/download-artifact](https://github.com/actions/download-artifact/releases/tag/v8.0.2) | v8.0.2                     | `9000827ccba6bdab643e8b6fd33ac0654aef8333` |

pnpm remains 9.0.0 from the unchanged root packageManager field. Actions input schemas were checked; automatic package-manager/store caching is disabled. No application dependency modernization is included.

Until npm-side setup is confirmed, the existing `NPM_TOKEN` path remains as an explicit transitional branch of publication, subject to the same artifact gates. Owner-controlled repository variable `NPM_TRUSTED_PUBLISHING_ENABLED=true` selects token-free npm OIDC publication. A failed OIDC publish does **not** fall back to the token. No variable, secret, account setting, or environment was changed here.

## 7. npm owner setup checklist

Owner action only, when ready for the first separately approved release:

- On npmjs.com, open package **baseui-cn → Settings → Trusted Publisher** (management navigation also calls this **Trusted publishing**); choose **Add trusted publisher / Select your publisher → GitHub Actions**.
- **Organization or user:** `baseui-cn`; **Repository:** `baseui-cn`; **Workflow filename:** `publish-cli.yml` (filename only).
- **Environment name:** leave blank; this design intentionally uses no GitHub Environment.
- **Allowed actions:** enable direct **npm publish**. `npm stage publish` is always allowed by current npm; no `npm dist-tag` permission is needed.
- Verify exact spelling, then save. Configure close to the release: npm currently requires the first successful publish within **2 days** of creating the connection; recreate an expired connection.
- After setup, set the GitHub repository variable `NPM_TRUSTED_PUBLISHING_ENABLED` to the exact string `true`. Do not delete/revoke `NPM_TOKEN` yet.

These field names, allowed-action rules, and expiry are from [npm's current trusted-publisher documentation](https://docs.npmjs.com/trusted-publishers/). npm does not validate the connection at save time. No credentials or tokens need to be provided to this agent.

## 8. Provenance

For public-package publication from a public repository using GitHub OIDC, npm automatically supplies provenance; no `--provenance` flag is required. Users can inspect the npm package's provenance indicator/details to trace source commit and workflow/build context. It is an attestation, not a code audit or proof that a maintainer reviewed the contents. [npm provenance guidance](https://docs.npmjs.com/generating-provenance-statements/).

The attestation concerns the publishing run/commit. Preparation is a different run, so preserve its ID and content manifest in the approval annotation; do not claim npm automatically attests the entire preparation/review process. Provenance attaches alongside registry metadata, not by editing/repacking the approved `.tgz`. The SHA gate stays authoritative. Automatic provenance/OIDC behavior still requires a real release to confirm end-to-end.

## 9. Publication gates

Before any publish command, fail closed on:

- Stable tag syntax `cli-vX.Y.Z` (no prerelease, leading-zero, or partial version); the release ref itself must be an annotated tag object. Parse its raw header before the annotation separator: require a unique `object <40-hex-sha>`, `type commit`, and `tag <expected-release-tag>`; reject malformed or duplicate header fields. The immediate object SHA must equal the checkout/event SHA and approved source SHA, and its actual Git object type must be commit. Nested tags, tag-object targets, lightweight release refs, tree/blob targets, wrong internal tag names, and forged type headers fail closed. The annotation must be pure JSON, without trailing prose or signature blocks. The remote tag object must still equal the checked tag object immediately before publication.
- Exact source package version/name/repository/license/bin metadata; packed package.json bytes equal source, which also independently ties artifact version to tag.
- Successful `prepare-cli.yml` workflow_dispatch run in this repository at that same source SHA, and the exact nonexpired artifact ID/name associated with that run.
- Tarball SHA-256 and release-manifest SHA-256 equal the reviewed values in the tag. Separately verify the approved registry-manifest hash.
- Every bundled registry member equals its approved hash and tagged source bytes; all three tagged-source registry copies match; registry index inventories/versions, CLI source version, site release version and Base UI metadata match. Existing source consistency checker independently checks embedded component source/style/dependency relationships.
- Exact package inventory: README, LICENSE, package.json, dist/index.js, dist/index.d.ts, and precisely the source registry's JSON inventory. No extra file, omitted file, duplicate path, traversal path, symlink, or unexpected mode. No workspace/file/link/local dependency specifier or package publishConfig override. Full member byte hashes must match the approved manifest.
- A successful unauthenticated GET of the public package's full npm metadata with the expected identity and a versions map, in which the target version is absent. A timeout, E404, invalid JSON, permission/server failure, or malformed metadata stops publication; it is never treated as version absence. npm remains the final guard against a publish race.

## 10. workflow_dispatch policy

Remove workflow_dispatch from `publish-cli.yml`. Manual dispatch exists only for **nonpublishing preparation**, with explicit full commit and version plus equality to the dispatch ref's SHA. Publication requires a reviewed annotated release tag; main cannot be published by clicking Run workflow. No environment approval is added. The owner must approve artifact bytes, not merely copy a generated summary into a tag without inspection.

## 11. Token retirement

After the first successful OIDC release, verify npm's public tarball SHA-256 against the approved candidate and inspect provenance. Then remove the transitional token step and its NPM_TOKEN reference from this workflow, and have the owner revoke/remove the obsolete write token and GitHub secret. If private installation ever requires a token, use a separate read-only granular token. npm recommends restricting traditional publishing tokens after migration; retain owner account recovery access. Do not remove the current token before trusted publishing is configured and qualified. [npm migration guidance](https://docs.npmjs.com/trusted-publishers/).

## 12. Safe validation and negative tests

Original investigation evidence root: `/private/tmp/baseui-npm-hardening`. Integration evidence: `/private/tmp/baseui-cn-release-hardening-checkpoint`; fresh direct-target-fix evidence: its `direct-target-fix/` directory. Earlier build, install, pack, and live-network results below are retained historical evidence; this fix reran the helper suites, supplemental gates, exact-artifact verification, actionlint/ShellCheck, local offline npm dry-run, and whitespace/preservation checks. Broad website/component tests were not rerun because product source is untouched. No real publish, source-repository tag, version bump, deployment, push, secret mutation, or npm account action occurred. Ephemeral test Git repositories exercise tag parsing without touching this repository's refs.

| Check                                                                  | Result                                                                                                                                                                                                                                                                                               |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Remote public main / Data Grid branch SHAs, npm latest and 1.4.1 SHA-1 | PASS, expected values                                                                                                                                                                                                                                                                                |
| `actionlint` on both workflows, including shellcheck                   | PASS                                                                                                                                                                                                                                                                                                 |
| Official Action release refs and changed input schemas                 | PASS, versions above                                                                                                                                                                                                                                                                                 |
| Frozen pnpm install against public main                                | PASS, unchanged lockfile                                                                                                                                                                                                                                                                             |
| `build:all`, CLI typecheck/build, registry consistency                 | PASS under Node 22.22.3 and Node 24.22.2                                                                                                                                                                                                                                                             |
| Registry consistency                                                   | PASS: 54 installables, 119 embedded source occurrences, three copies                                                                                                                                                                                                                                 |
| npm 10.9.8 pack and Node 24/npm 11.16.0 pack                           | PASS: both exactly equal approved tarball                                                                                                                                                                                                                                                            |
| pnpm 9/Linux-header reconstruction                                     | PASS: exact historical CI SHA-1 reproduced                                                                                                                                                                                                                                                           |
| Clean public-main checkout → prepare helper → manifest → approval JSON | PASS; version/commit/source gates exercised                                                                                                                                                                                                                                                          |
| ZIP upload/download shape simulation                                   | PASS: tarball and manifest bytes preserved                                                                                                                                                                                                                                                           |
| Positive exact-artifact verifier                                       | PASS with real approved 1.4.1 package                                                                                                                                                                                                                                                                |
| Negative gates                                                         | PASS: wrong SHA/version/commit, missing artifact, wrong manifest/registry SHA, registry bytes, package.json version, extra/missing member, mode, shebang, local/workspace package bytes, README bytes, unsafe tags/paths/links/duplicates, invalid artifact IDs, wrong/expired artifact/run/workflow |
| Immediate approval-tag target and annotation | PASS: valid direct tag accepted; nested tag, lightweight ref, wrong commit/name, non-commit target, malformed headers/annotation rejected; remote tag-object equality preserved |
| Public npm existing-version check                                      | PASS: 1.4.1 rejected; malformed/offline/error metadata also rejected                                                                                                                                                                                                                                 |
| npm 11 `publish --dry-run --ignore-scripts` with retained tarball      | Local no-network dry-run returned matching pack identity; online dry-run rejected the existing 1.4.1 version as expected                                                                                                                                                                             |
| Hosted Actions upload/download + OIDC + automatic provenance           | NOT RUN; requires reviewed committed workflows and a separately authorized release                                                                                                                                                                                                                   |

29 test methods pass both with self-contained fixtures and with the real approved package. Ten focused tag tests cover direct approval, nested/intermediary tag rejection, lightweight release refs, wrong commits/internal names, non-commit targets (including forged `type commit` headers), malformed/duplicate headers, malformed annotations, and remote tag-object equality. The nested-tag test first failed against the old helper because no rejection occurred, then passed with the fix. All tag creation and remote-ref simulation use temporary Git repositories only. The supplemental verifier also passes all 37 negative cases, including the previously accepted nested tag. Methods include multiple negative subcases. Re-run without historical files:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s scripts/releases -p 'test_*.py' -v
```

To additionally use real release evidence, set `RELEASE_TEST_SOURCE` to a public-main source directory and `RELEASE_TEST_ARTIFACT` to the approved 1.4.1 tarball before that command. The 1.4.1 regression fixture intentionally binds the baseline version/commit. `npm publish --dry-run` does not test OIDC, publisher authorization, or provenance. A local ZIP roundtrip does not test GitHub artifact service permissions/retention behavior.

## 13. Files changed

- `.github/workflows/publish-cli.yml`: approved-artifact publication, OIDC migration branch, no dispatch/build/repack.
- `.github/workflows/prepare-cli.yml`: nonpublishing exact-source builder and immutable artifact upload.
- `scripts/releases/cli-artifact.py`: standard-library-only identity/content/npm/API/tag gates and manifest/approval generation.
- `scripts/releases/test_cli_artifact.py`: positive/negative regression and annotation parsing tests.
- `scripts/releases/audit-pack-drift.py`: reproducible archive/member comparison and CI SHA-1 reconstruction.
- `docs/releases/1.4.1-package-drift.json`: retained per-member forensic results and toolchain annotations.
- `docs/releases/npm-publish-automation-hardening.md`: this report and owner handoff.

## 14. Known limitations

The old CI tarball was not retained; its identity was reconstructed against the logged SHA-1. Original approved-pack runtime versions are unavailable. We do not know the exact NPM_TOKEN failure. Current npm-side trusted-publisher configuration is uninspected. Hosted artifact transfer/OIDC/provenance have not been qualified. The artifact expires after 30 days; expiry or deletion requires preparing and reviewing a new candidate, never rebuilding silently during publication. Annotated approval messages must be pure JSON; this parser does not accept a prose message or a trailing GPG signature block. Protect release tags and main against unauthorized rewrites. Future intentional package inventory/layout changes require reviewed gate updates.

Final checkpoint: all seven release-engineering paths remain unstaged and uncommitted on `chore/npm-release-hardening`, with HEAD/base `2842bf1300760c3daf7befb4edb98893549f0eef`. The direct-target trust-boundary defect is fixed; it is no longer an open architecture gap. This fix changes only `cli-artifact.py`, its focused tests, and this report within the existing seven-file scope. Before/after snapshots confirm the Data Grid checkout and Pro are untouched. Component source, registry bytes, website, package manifests, lockfile, and CLI 1.4.1 are unchanged. No npm Trusted Publisher connection, repository variable/secret, source-repository release tag, publish, deployment, commit, or push was made. Hosted Actions transfer/OIDC/provenance remain unqualified as described above. Stop here for final release-automation review; do not merge the Data Grid branch.

## 15. Exact next step for the first OIDC release

Review this uncommitted patch first. The release-engineering paths are already isolated on public-main lineage. After separate final review and integration approval, commit and merge only these seven paths. For the next separately approved unpublished stable version, select an exact source commit containing the hardening and that version, dispatch preparation **on a ref at that same commit**, download/review the exact artifact, and retain its tag-message proposal. Configure npm as above near release time and enable the repository variable; protect the release-tag namespace. Only after owner GO for that exact artifact/commit/hash should the owner create/push the annotated tag with the reviewed JSON. On success, compare the public npm tarball bytes/SHA-256 to the approved artifact, verify provenance, then retire the legacy token path. Do not reuse or republish 1.4.1.
