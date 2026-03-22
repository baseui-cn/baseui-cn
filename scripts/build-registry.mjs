#!/usr/bin/env node
/**
 * Reads component source files from apps/www/components/ui/
 * and writes registry JSON entries to packages/registry/registry/
 * 
 * Run from repo root: node scripts/build-registry.mjs
 * Or via:              pnpm registry:build
 */
import { readFile, writeFile, readdir } from "fs/promises"
import { join } from "path"
import { componentMeta, buildEntry, UI_DIR, REGISTRY_DIR } from "./registry-meta.mjs"

const files = await readdir(UI_DIR)
let built = 0

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

  await writeFile(
    join(REGISTRY_DIR, `${name}.json`),
    JSON.stringify(entry, null, 2)
  )
  built++
  console.log(`✓ ${name}`)
}

console.log(`\nBuilt ${built} registry entries.`)
