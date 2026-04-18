#!/usr/bin/env node
/**
 * Watches apps/www/components/previews/ for changes and rebuilds the generated preview sources.
 */
import { watch } from "fs"
import { spawn } from "child_process"
import path from "path"

const REPO_ROOT = process.cwd()
const PREVIEWS_DIR = path.resolve(REPO_ROOT, "apps/www/components/previews")

let activeBuild = null
let queuedBuild = false

async function runBuild() {
  if (activeBuild) {
    queuedBuild = true
    return
  }

  activeBuild = new Promise((resolve, reject) => {
    const child = spawn("node", ["scripts/build-preview-sources.mjs"], {
      cwd: REPO_ROOT,
      stdio: "inherit",
    })

    child.on("exit", (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`build-preview-sources exited with code ${code}`))
      }
    })

    child.on("error", reject)
  })

  try {
    await activeBuild
  } catch (error) {
    console.error("x Preview source build failed:", error)
  } finally {
    activeBuild = null
    if (queuedBuild) {
      queuedBuild = false
      await runBuild()
    }
  }
}

console.log("Watching preview sources...")
console.log(`${PREVIEWS_DIR}\n`)

watch(PREVIEWS_DIR, { recursive: true }, (_eventType, fileName) => {
  if (!fileName) return
  if (!fileName.endsWith(".tsx") && !fileName.endsWith(".ts")) return
  void runBuild()
})
