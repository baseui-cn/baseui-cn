# Rebuild registry (after editing components or registry-meta)

node scripts/build-registry.mjs

# Rebuild preview sources (after editing preview files)

node scripts/build-preview-sources.mjs

# Both at once

node scripts/build-registry.mjs; node scripts/build-preview-sources.mjs
