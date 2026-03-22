#!/usr/bin/env node
/**
 * Watches apps/www/components/ui/ for changes and auto-syncs
 * the corresponding registry JSON in packages/registry/registry/
 *
 * Run from repo root: node scripts/watch-registry.mjs
 * Or via:              pnpm registry:watch
 */
import { watch } from "fs"
import { readFile, writeFile } from "fs/promises"
import { join } from "path"
import { componentMeta, buildEntry, UI_DIR, REGISTRY_DIR } from "./registry-meta.mjs"

async function syncFile(fileName) {
  if (!fileName.endsWith(".tsx") || fileName.startsWith("_")) return

  const name = fileName.replace(".tsx", "")
  const meta = componentMeta[name]
  if (!meta) {
    console.log(`⚠ No metadata for ${name} — skipping`)
    return
  }

  const content = await readFile(join(UI_DIR, fileName), "utf-8")
  const entry = buildEntry(name, content, meta)
  const outPath = join(REGISTRY_DIR, `${name}.json`)

  await writeFile(outPath, JSON.stringify(entry, null, 2))
  console.log(`✓ Synced ${name}`)
}

console.log(`Loaded metadata for ${Object.keys(componentMeta).length} components`)
console.log(`Watching ${UI_DIR} for changes…\n`)

const debounceMap = new Map()

watch(UI_DIR, { recursive: false }, (eventType, fileName) => {
  if (!fileName || !fileName.endsWith(".tsx")) return

  if (debounceMap.has(fileName)) clearTimeout(debounceMap.get(fileName))

  debounceMap.set(
    fileName,
    setTimeout(async () => {
      debounceMap.delete(fileName)
      try {
        await syncFile(fileName)
      } catch (err) {
        console.error(`✗ Error syncing ${fileName}:`, err.message)
      }
    }, 200)
  )
})
