/**
 * Extracts preview function source code from preview files and builds
 * a JSON map: { "preview-name": "source code" }
 *
 * This lets the component docs Code tab show the actual example code
 * rather than the full component source from the registry.
 *
 * Usage: node scripts/build-preview-sources.mjs
 */

import { readdir, readFile, writeFile, mkdir } from "fs/promises"
import { join } from "path"

const PREVIEWS_DIR = "apps/www/components/previews"
const OUTPUT_FILE = "apps/www/lib/__generated__/preview-sources.json"

function extractFunctions(source) {
  const functions = []
  const lines = source.split("\n")
  let i = 0

  while (i < lines.length) {
    const match = lines[i].match(/^function\s+(\w+)\s*\(/)
    if (match) {
      const name = match[1]
      const startLine = i
      let braceCount = 0
      let started = false
      let endLine = i

      for (let j = i; j < lines.length; j++) {
        for (const ch of lines[j]) {
          if (ch === "{") { braceCount++; started = true }
          if (ch === "}") braceCount--
        }
        if (started && braceCount === 0) {
          endLine = j
          break
        }
      }

      functions.push({
        name,
        source: lines.slice(startLine, endLine + 1).join("\n"),
      })
      i = endLine + 1
    } else {
      i++
    }
  }

  return functions
}

function extractExportMap(source) {
  const mapMatch = source.match(
    /export\s+const\s+\w+PreviewMap\s*:\s*Record<[^>]+>\s*=\s*\{([^}]+)\}/s
  )
  if (!mapMatch) return {}

  const entries = {}
  const re = /["']([^"']+)["']\s*:\s*(\w+)/g
  let m
  while ((m = re.exec(mapMatch[1])) !== null) {
    entries[m[1]] = m[2]
  }
  return entries
}

function extractImports(source) {
  const lines = source.split("\n")
  const imports = []
  for (const line of lines) {
    if (line.startsWith("import ")) imports.push(line)
    else if (line.trim() === "" && imports.length > 0) continue
    else if (imports.length > 0 && !line.startsWith("import ")) break
  }
  return imports
}

async function main() {
  const files = await readdir(PREVIEWS_DIR)
  const previewFiles = files.filter((f) => f.endsWith("-previews.tsx"))

  const previewSources = {}

  for (const file of previewFiles) {
    const filePath = join(PREVIEWS_DIR, file)
    const source = await readFile(filePath, "utf-8")

    const imports = extractImports(source)
    const functions = extractFunctions(source)
    const exportMap = extractExportMap(source)

    const funcByName = {}
    for (const fn of functions) {
      funcByName[fn.name] = fn.source
    }

    for (const [previewName, funcName] of Object.entries(exportMap)) {
      const funcSource = funcByName[funcName]
      if (!funcSource) continue

      const usedImports = imports.filter((imp) => {
        if (imp.includes('"use client"') || imp.includes("'use client'")) return false
        const importedNames = imp.match(/\{([^}]+)\}/)?.[1]
        if (!importedNames) {
          const defaultMatch = imp.match(/import\s+(\w+)/)
          return defaultMatch && funcSource.includes(defaultMatch[1])
        }
        return importedNames.split(",").some((n) => funcSource.includes(n.trim().split(" as ")[0].trim()))
      })

      const code = [...usedImports, "", funcSource].join("\n").trim()
      previewSources[previewName] = code
    }
  }

  const outputDir = join(OUTPUT_FILE, "..")
  await mkdir(outputDir, { recursive: true })
  await writeFile(OUTPUT_FILE, JSON.stringify(previewSources, null, 2))
  console.log(`Built preview sources for ${Object.keys(previewSources).length} previews → ${OUTPUT_FILE}`)
}

main().catch(console.error)
