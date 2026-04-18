# Fumadocs Migration Plan

## Recommendation

Yes, `apps/www` is a good candidate for Fumadocs, but this should be treated as a docs-platform migration rather than a renderer swap.

The current docs experience is built on a custom pipeline:

- MDX files live in `apps/www/content/docs/components`
- pages are rendered with `next-mdx-remote/rsc`
- TOC is generated manually in `apps/www/app/docs/components/[slug]/page.tsx`
- custom MDX components power previews, install tabs, source tabs, and callouts
- navigation/catalog data comes from generated registry metadata

Fumadocs can replace the content loading and TOC/content-source parts cleanly, while we keep the existing Base UI-specific preview/install/source components.

## Why it fits

- The docs app already uses Next 16 and Tailwind 4, which aligns with the current Fumadocs setup guidance.
- Fumadocs MDX gives us a typed content source and generated document metadata instead of manually reading files from disk.
- It is a better long-term fit for richer docs authoring, reusable docs primitives, and markdown-first content.
- It makes exposing raw markdown/MDX much easier because the content source becomes a first-class part of the app instead of an ad hoc file read inside page routes.

## What changes

### Replace

- `next-mdx-remote`
- manual file reads in `apps/www/app/docs/components/[slug]/page.tsx`
- manual TOC extraction regex

### Keep

- `apps/www/components/docs/install-tabs.tsx`
- `apps/www/components/docs/component-preview-wrapper.tsx`
- `apps/www/components/docs/component-source.tsx`
- the generated preview source pipeline
- generated registry/catalog metadata in `apps/www/lib/registry.ts`

### Add

- `fumadocs-mdx`
- `fumadocs-core`
- `@types/mdx`
- `source.config.ts`
- `lib/source.ts`
- a Fumadocs-compatible MDX component bridge

## Repo-specific migration steps

1. Convert `apps/www/next.config.ts` to `apps/www/next.config.mjs`.
   Fumadocs MDX is ESM-first, so this is the first structural change.

2. Add Fumadocs content-source config.
   Create `apps/www/source.config.ts` pointing at `content/docs`.

3. Add a source loader.
   Create `apps/www/lib/source.ts` and load docs from the generated Fumadocs collections output.

4. Replace the current component docs page loader.
   Update `apps/www/app/docs/components/[slug]/page.tsx` to resolve docs from Fumadocs instead of `readFile` + `MDXRemote`.

5. Port the current MDX component map.
   Move the existing custom components from `apps/www/components/docs/mdx-components.tsx` into a Fumadocs-compatible `getMDXComponents` shape.

6. Preserve the current docs product features.
   Rebind `InstallTabs`, `ComponentPreview`, `ComponentSource`, callouts, code tabs, and package manager tabs so current docs content does not regress.

7. Hook docs navigation into the existing generated catalog.
   Keep `apps/www/lib/registry.ts` as the product source for component nav labels/sections and layer Fumadocs page resolution on top.

8. Add raw markdown access.
   Expose a route or action that returns the original MDX file contents so users can copy/download the component docs as markdown.

9. Migrate incrementally.
   Start with `docs/components/[slug]`, then move shared docs pages like installation/theming only after the component docs path is stable.

## Risks to plan for

- We currently rely on generated preview source JSON and registry metadata; those need to stay wired into the MDX layer.
- The current docs page mixes product metadata, analytics, and content rendering in one route. That needs to be split more cleanly during migration.
- Search/navigation should keep using the generated catalog, otherwise we risk drifting from the registry-backed component inventory.
- Converting `next.config.ts` to `.mjs` is required before the Fumadocs MDX plugin can be wired the documented way.

## Suggested rollout

### Phase 1

- install Fumadocs dependencies
- add config and source loader
- migrate one component route end-to-end

### Phase 2

- migrate all component docs pages
- add raw markdown copy/download support
- remove `next-mdx-remote`

### Phase 3

- migrate installation/theming/general docs
- adopt more Fumadocs-native page chrome only if it improves the site

## Success criteria

- component docs still render previews, source tabs, and install tabs
- current generated component catalog remains the nav source of truth
- docs pages can expose raw markdown/MDX cleanly
- `next-mdx-remote` is fully removed after parity is reached
