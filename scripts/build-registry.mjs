#!/usr/bin/env node
/**
 * Reads component source files from apps/www/components/ui/
 * and writes registry JSON entries to:
 *   1. packages/registry/registry/   (source of truth for the CLI package)
 *   2. apps/www/public/registry/     (served at baseui-cn.com/registry/ for live fetches)
 * 
 * Run from repo root: node scripts/build-registry.mjs
 * Or via:              pnpm registry:build
 */
import { readFile, writeFile, readdir, mkdir } from "fs/promises"
import { join } from "path"
import { componentMeta, buildEntry, UI_DIR, REGISTRY_DIR } from "./registry-meta.mjs"

const PUBLIC_REGISTRY_DIR = join("apps", "www", "public", "registry")
await mkdir(PUBLIC_REGISTRY_DIR, { recursive: true })

const files = await readdir(UI_DIR)
let built = 0
const indexEntries = []

for (const file of files) {
  if (!file.endsWith(".tsx") || file.startsWith("_")) continue
  const name = file.replace(".tsx", "")
  const meta = componentMeta[name]
  if (!meta) {
    console.log(`⚠ No metadata for ${name} — skipping`)
    continue
  }

  const content = await readFile(join(UI_DIR, file), "utf-8")
  const entry = buildEntry(name, content, meta)
  const json = JSON.stringify(entry, null, 2)

  await writeFile(join(REGISTRY_DIR, `${name}.json`), json)
  await writeFile(join(PUBLIC_REGISTRY_DIR, `${name}.json`), json)

  indexEntries.push({
    name: entry.name,
    type: entry.type,
    description: entry.description,
    tags: entry.tags ?? [],
  })

  built++
  console.log(`✓ ${name}`)
}

const index = {
  version: "0.1.0",
  components: indexEntries.sort((a, b) => a.name.localeCompare(b.name)),
}
const indexJson = JSON.stringify(index, null, 2)
await writeFile(join(REGISTRY_DIR, "index.json"), indexJson)
await writeFile(join(PUBLIC_REGISTRY_DIR, "index.json"), indexJson)

console.log(`\nBuilt ${built} registry entries.`)
