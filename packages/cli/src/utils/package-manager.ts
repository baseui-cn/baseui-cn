import { existsSync } from "fs"
import path from "path"
import { readManifest } from "./project"

export const packageManagers = ["npm", "pnpm", "yarn", "bun"] as const
export type PackageManager = (typeof packageManagers)[number]
export async function detectPackageManager(cwd = process.cwd()): Promise<PackageManager> {
  let dir = path.resolve(cwd)
  while (true) {
    const manifest = await readManifest(dir)
    const declared = manifest.packageManager?.split("@")[0]
    if (packageManagers.includes(declared as PackageManager)) return declared as PackageManager
    for (const [file, pm] of [
      ["pnpm-lock.yaml", "pnpm"],
      ["yarn.lock", "yarn"],
      ["bun.lock", "bun"],
      ["bun.lockb", "bun"],
      ["package-lock.json", "npm"],
      ["npm-shrinkwrap.json", "npm"],
    ] as const) {
      if (existsSync(path.join(dir, file))) return pm
    }
    if (existsSync(path.join(dir, "pnpm-workspace.yaml"))) return "pnpm"
    const parent = path.dirname(dir)
    if (parent === dir) return "npm"
    dir = parent
  }
}
export function runner(pm: PackageManager, pkg: string, args: string[]) {
  return pm === "npm"
    ? { command: "npx", args: ["--yes", pkg, ...args] }
    : pm === "bun"
      ? { command: "bunx", args: [pkg, ...args] }
      : { command: pm, args: ["dlx", pkg, ...args] }
}
