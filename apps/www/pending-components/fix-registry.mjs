#!/usr/bin/env node

/**
 * Fix all registry JSON files:
 * 1. Replace @base-ui-components/react → @base-ui/react everywhere
 * 2. Fix blocks component paths (empty-state and login now live in blocks.tsx)
 * 3. Update dependencies list in each component
 *
 * Run from repo root:
 *   node scripts/fix-registry.mjs
 */

import { readdir, readFile, writeFile } from "fs/promises"
import { join } from "path"

const REGISTRY_DIR = "packages/registry/registry"

const files = await readdir(REGISTRY_DIR)
let fixedCount = 0

for (const file of files) {
  if (!file.endsWith(".json")) continue

  const filePath = join(REGISTRY_DIR, file)
  let content = await readFile(filePath, "utf-8")
  const original = content

  // Fix 1: Package name
  content = content.replaceAll(
    "@base-ui-components/react",
    "@base-ui/react"
  )

  // Fix 2: blocks component path
  // empty-state.json and login.json — update file path to blocks.tsx
  if (file === "empty-state.json") {
    content = content.replace(
      /"path": "blocks\/empty-state\.tsx"/,
      '"path": "blocks.tsx"'
    )
  }
  if (file === "login.json") {
    content = content.replace(
      /"path": "blocks\/login\.tsx"/,
      '"path": "blocks.tsx"'
    )
  }

  if (content !== original) {
    await writeFile(filePath, content)
    fixedCount++
    console.log(`✓ Fixed ${file}`)
  }
}

// Fix index.json too
const indexPath = "packages/registry/index.json"
let indexContent = await readFile(indexPath, "utf-8")
if (indexContent.includes("@base-ui-components/react")) {
  indexContent = indexContent.replaceAll("@base-ui-components/react", "@base-ui/react")
  await writeFile(indexPath, indexContent)
  console.log("✓ Fixed index.json")
  fixedCount++
}

console.log(`\nDone. Fixed ${fixedCount} files.`)
