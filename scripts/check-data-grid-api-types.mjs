import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const www = path.join(root, "apps/www")
const temp = await fs.mkdtemp(path.join(www, ".grid-regression-types-"))
try {
  for (const name of ["data-grid-api-types.tsx", "data-grid-regressions.tsx", "data-grid-v9.tsx"]) {
    await fs.copyFile(path.join(root, "scripts/fixtures", name), path.join(temp, name))
  }
  await fs.writeFile(path.join(temp, "tsconfig.json"), JSON.stringify({ extends: "../tsconfig.json", compilerOptions: { incremental: false, noUnusedLocals: true, noUnusedParameters: true }, include: ["*.tsx"] }))
  const result = spawnSync(process.execPath, [path.join(root, "node_modules/typescript/bin/tsc"), "-p", path.join(temp, "tsconfig.json")], { cwd: root, encoding: "utf8" })
  process.stdout.write(result.stdout); process.stderr.write(result.stderr)
  if (result.status !== 0) throw Error(`Grid API/consumer noUnused type fixture failed (${result.status})`)
  console.log("PASS F10/F14/F15/F17: minimal virtual options, disabled/null options, migration generics, consumer fixtures, noUnused Grid closure")
  if (process.env.EVIDENCE_DIR) {
    await fs.mkdir(process.env.EVIDENCE_DIR, { recursive: true })
    await fs.writeFile(path.join(process.env.EVIDENCE_DIR, "api-types.json"), JSON.stringify({ findings: ["F10", "F14", "F15", "F17"], passed: true, noUnusedLocals: true, noUnusedParameters: true, fixtures: 3 }, null, 2))
  }
} finally { await fs.rm(temp, { recursive: true, force: true }) }
