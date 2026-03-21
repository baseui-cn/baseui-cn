import { existsSync } from "fs"
import path from "path"

type PackageManager = "pnpm" | "yarn" | "npm"

export async function detectPackageManager(): Promise<PackageManager> {
  if (existsSync(path.resolve("pnpm-lock.yaml"))) return "pnpm"
  if (existsSync(path.resolve("yarn.lock"))) return "yarn"
  return "npm"
}
