#!/usr/bin/env node
/**
 * Builds the installable registry from scripts/registry-meta.mjs and writes:
 *   1. packages/registry/registry/   - source registry JSON
 *   2. apps/www/public/registry/     - live docs registry
 *   3. packages/cli/registry/        - bundled CLI fallback registry
 *   4. packages/registry/index.json  - package manifest index
 *   5. apps/www/lib/__generated__/catalog.json - docs catalog metadata
 */
import { mkdir, readFile, readdir, rm, writeFile } from "fs/promises"
import { basename, dirname, join } from "path"
import {
  CLI_PACKAGE_FILE,
  CLI_REGISTRY_DIR,
  PUBLIC_REGISTRY_DIR,
  REPO_ROOT,
  REGISTRY_DIR,
  REGISTRY_PACKAGE_INDEX,
  SITE_CATALOG_FILE,
  UI_DIR,
  buildCatalog,
  buildEntry,
  componentMeta,
} from "./registry-meta.mjs"

const OUTPUT_DIRS = [REGISTRY_DIR, PUBLIC_REGISTRY_DIR, CLI_REGISTRY_DIR]
const REGISTRY_URL = "https://raw.githubusercontent.com/baseui-cn/baseui-cn/main/packages/registry/registry"

async function readCliVersion() {
  const pkg = JSON.parse(await readFile(CLI_PACKAGE_FILE, "utf-8"))
  return pkg.version
}

async function ensureCleanOutput(dir, allowedFiles) {
  await mkdir(dir, { recursive: true })
  const existing = await readdir(dir)
  await Promise.all(
    existing
      .filter(
        (file) =>
          ((file.endsWith(".json") && !allowedFiles.has(file)) || file.endsWith(".bak"))
      )
      .map((file) => rm(join(dir, file), { force: true }).catch(() => null))
  )
}

async function removeBackupVariants(filePath) {
  const parentDir = dirname(filePath)
  const targetName = basename(filePath)
  const existing = await readdir(parentDir)

  await Promise.all(
    existing
      .filter((file) => file === `${targetName}.bak` || file.startsWith(`${targetName}.`))
      .filter((file) => file.endsWith(".bak"))
      .map((file) => rm(join(parentDir, file), { force: true }).catch(() => null))
  )
}

async function writeOutputFile(filePath, content) {
  await rm(filePath, { force: true })
  await writeFile(filePath, content)
}

function resolveSourceFilePath(sourcePath) {
  const normalizedPath = sourcePath.replaceAll("\\", "/")

  if (
    normalizedPath.startsWith("apps/") ||
    normalizedPath.startsWith("packages/") ||
    normalizedPath.startsWith("scripts/")
  ) {
    return join(REPO_ROOT, ...normalizedPath.split("/"))
  }

  return join(UI_DIR, sourcePath)
}

const version = await readCliVersion()
const catalog = buildCatalog(version)
const indexEntries = []
const fileNames = new Set(["index.json"])

for (const meta of Object.values(componentMeta)) {
  const files = await Promise.all(
    meta.files.map(async (file) => ({
      path: file.targetPath,
      type: file.type,
      content: await readFile(resolveSourceFilePath(file.sourcePath), "utf-8"),
    }))
  )
  const entry = buildEntry(meta.name, files, meta, version)
  const json = JSON.stringify(entry, null, 2)
  const fileName = `${meta.name}.json`

  fileNames.add(fileName)
  indexEntries.push({
    name: entry.name,
    type: entry.type,
    description: entry.description,
    tags: entry.tags ?? [],
    ...(entry.badge ? { badge: entry.badge } : {}),
  })

  await Promise.all(
    OUTPUT_DIRS.map(async (dir) => {
      await mkdir(dir, { recursive: true })
      await writeOutputFile(join(dir, fileName), json)
    })
  )

  console.log(`ok ${meta.name} -> ${basename(meta.sourcePath)}`)
}

for (const dir of OUTPUT_DIRS) {
  await ensureCleanOutput(dir, fileNames)
}

const registryIndex = {
  version,
  components: indexEntries,
}
const registryIndexJson = JSON.stringify(registryIndex, null, 2)

await Promise.all(
  OUTPUT_DIRS.map((dir) => writeOutputFile(join(dir, "index.json"), registryIndexJson))
)

const packageIndex = {
  version,
  homepage: "https://baseui-cn.com",
  registry: REGISTRY_URL,
  baseUIVersion: ">=1.3.0",
  components: indexEntries,
}
await writeOutputFile(REGISTRY_PACKAGE_INDEX, JSON.stringify(packageIndex, null, 2))
await removeBackupVariants(REGISTRY_PACKAGE_INDEX)

await mkdir(dirname(SITE_CATALOG_FILE), { recursive: true })
await writeOutputFile(SITE_CATALOG_FILE, JSON.stringify(catalog, null, 2))
await removeBackupVariants(SITE_CATALOG_FILE)

console.log(`\nBuilt ${indexEntries.length} registry entries.`)
