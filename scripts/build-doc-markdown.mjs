/**
 * Builds a JSON map of component docs markdown:
 * { "badge": "---\\ntitle: Badge\\n..." }
 *
 * Usage: node scripts/build-doc-markdown.mjs
 */

import { mkdir, readdir, readFile, writeFile } from "fs/promises"
import path from "path"

const DOCS_DIR = path.resolve("apps/www/content/docs/components")
const OUTPUT_FILE = path.resolve("apps/www/lib/__generated__/docs-markdown.json")

async function main() {
  const entries = await readdir(DOCS_DIR, { withFileTypes: true })
  const markdownMap = {}

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".mdx")) {
      continue
    }

    const slug = entry.name.slice(0, -4)
    const filePath = path.join(DOCS_DIR, entry.name)
    markdownMap[slug] = await readFile(filePath, "utf-8")
  }

  await mkdir(path.dirname(OUTPUT_FILE), { recursive: true })
  await writeFile(OUTPUT_FILE, `${JSON.stringify(markdownMap, null, 2)}\n`)

  console.log(
    `Built docs markdown for ${Object.keys(markdownMap).length} pages -> ${path.relative(process.cwd(), OUTPUT_FILE)}`
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
