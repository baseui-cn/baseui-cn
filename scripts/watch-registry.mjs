#!/usr/bin/env node
/**
 * Watches apps/www/components/ui/ for changes and rebuilds the generated registry outputs.
 */
import { watch } from "fs"
import { spawn } from "child_process"
import { REPO_ROOT, UI_DIR } from "./registry-meta.mjs"

let activeBuild = null
let queuedBuild = false

async function runBuild() {
  if (activeBuild) {
    queuedBuild = true
    return
  }

  activeBuild = new Promise((resolve, reject) => {
    const child = spawn("node", ["scripts/build-registry.mjs"], {
      cwd: REPO_ROOT,
      stdio: "inherit",
    })

    child.on("exit", (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`build-registry exited with code ${code}`))
      }
    })

    child.on("error", reject)
  })

  try {
    await activeBuild
  } catch (error) {
    console.error("x Registry build failed:", error)
  } finally {
    activeBuild = null
    if (queuedBuild) {
      queuedBuild = false
      await runBuild()
    }
  }
}

console.log("Watching registry sources...")
console.log(`${UI_DIR}\n`)

watch(UI_DIR, { recursive: false }, (_eventType, fileName) => {
  if (!fileName || !fileName.endsWith(".tsx")) return
  void runBuild()
})
