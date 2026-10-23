import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import { createHash } from "node:crypto"
import { componentMeta, REPO_ROOT, UI_DIR } from "./registry-meta.mjs"

const dirs = ["packages/registry/registry", "apps/www/public/registry", "packages/cli/registry"]
let occurrences = 0
for (const [name, meta] of Object.entries(componentMeta)) {
  const copies = await Promise.all(
    dirs.map((dir) => fs.readFile(path.join(REPO_ROOT, dir, name + ".json")))
  )
  const hash = (bytes) => createHash("sha256").update(bytes).digest("hex")
  assert.ok(
    copies.every((bytes) => hash(bytes) === hash(copies[0])),
    `${name}: copies differ`
  )
  const entry = JSON.parse(copies[0])
  assert.deepEqual(entry.dependencies.required, meta.deps, `${name}: dependency metadata differs`)
  assert.deepEqual(
    entry.registryDependencies,
    meta.registryDeps,
    `${name}: registry dependency metadata differs`
  )
  for (const file of entry.files) {
    if (file.type === "style") continue
    for (const [, style] of file.content.matchAll(/import "@\/styles\/([^"]+)"/g)) {
      assert.ok(
        entry.files.some((item) => item.path === `styles/${style}` && item.type === "style"),
        `${name}: unshipped stylesheet ${style}`
      )
    }
  }
  for (const file of meta.files) {
    const source = path.join(
      /^(apps|packages|scripts)\//.test(file.sourcePath) ? REPO_ROOT : UI_DIR,
      file.sourcePath
    )
    const embedded = entry.files.find((item) => item.path === file.targetPath)
    assert.ok(embedded, `${name}: missing ${file.targetPath}`)
    assert.equal(
      embedded.content,
      await fs.readFile(source, "utf8"),
      `${name}: stale ${file.targetPath}`
    )
    occurrences++
  }
}
for (const name of ["index.json"]) {
  const copies = await Promise.all(
    dirs.map((dir) => fs.readFile(path.join(REPO_ROOT, dir, name), "utf8"))
  )
  assert.ok(
    copies.every((content) => content === copies[0]),
    "registry indexes differ"
  )
}
console.log(
  `PASS ${Object.keys(componentMeta).length} installables, ${occurrences} source occurrences, three identical registry copies`
)
