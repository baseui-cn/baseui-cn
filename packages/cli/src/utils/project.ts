import fs from "fs-extra"
import path from "path"
import prompts from "prompts"

export const frameworks = ["next", "tanstack-start", "react-router", "vite", "react"] as const
export type Framework = (typeof frameworks)[number]
export const frameworkLabels: Record<Framework | "unknown", string> = {
  next: "Next.js",
  "tanstack-start": "TanStack Start",
  "react-router": "React Router",
  vite: "Vite",
  react: "React",
  unknown: "Unknown React setup",
}
export async function detectFramework(cwd = process.cwd()): Promise<Framework | "unknown"> {
  const manifest = await readManifest(cwd)
  const deps = { ...manifest.dependencies, ...manifest.devDependencies }
  if (deps.next) return "next"
  if (deps["@tanstack/react-start"]) return "tanstack-start"
  if (deps["@react-router/dev"] || deps["react-router"] || deps["react-router-dom"])
    return "react-router"
  if (deps.vite && deps.react) return "vite"
  if (deps.react) return "react"
  for (const ext of ["js", "ts", "mjs", "cjs"]) {
    if (await fs.pathExists(path.join(cwd, `next.config.${ext}`))) return "next"
  }
  return "unknown"
}
export interface Manifest {
  name?: string
  packageManager?: string
  workspaces?: string[] | { packages?: string[] }
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}
export async function readManifest(cwd: string): Promise<Manifest> {
  const file = path.join(cwd, "package.json")
  return (await fs.pathExists(file)) ? fs.readJson(file) : {}
}
export async function workspacePatterns(cwd: string): Promise<string[]> {
  const manifest = await readManifest(cwd)
  const patterns = Array.isArray(manifest.workspaces)
    ? manifest.workspaces
    : (manifest.workspaces?.packages ?? [])
  const yaml = path.join(cwd, "pnpm-workspace.yaml")
  if (!(await fs.pathExists(yaml))) return patterns
  const content = await fs.readFile(yaml, "utf8")
  const block = content.match(/^packages:\s*\n((?:[ \t]+.*\n?|\s*\n)*)/m)?.[1] ?? ""
  return [
    ...patterns,
    ...[...block.matchAll(/^\s+-\s+['"]?([^'"\s#]+)['"]?\s*(?:#.*)?$/gm)].map((m) => m[1]!),
  ]
}
export async function findWorkspaceRoot(cwd = process.cwd()): Promise<string | null> {
  let dir = path.resolve(cwd)
  while (true) {
    if ((await workspacePatterns(dir)).length) return dir
    const parent = path.dirname(dir)
    if (parent === dir) return null
    dir = parent
  }
}
export async function applicationWorkspaces(root: string): Promise<string[]> {
  const patterns = await workspacePatterns(root)
  const positives = patterns.filter((p) => !p.startsWith("!"))
  const negatives = patterns.filter((p) => p.startsWith("!")).map((p) => p.slice(1))
  const matches = (name: string, pattern: string) => {
    const escaped = pattern
      .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\*\*/g, "\u0000")
      .replace(/\*/g, "[^/]*")
      .replace(/\u0000/g, ".*")
    return new RegExp(`^${escaped.replace(/\/$/, "")}$`).test(name)
  }
  const found: string[] = []
  async function walk(dir: string, depth: number) {
    if (depth > 8) return
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      if (
        !entry.isDirectory() ||
        entry.name.startsWith(".") ||
        ["node_modules", "dist", "build"].includes(entry.name)
      )
        continue
      const full = path.join(dir, entry.name),
        relative = path.relative(root, full).split(path.sep).join("/")
      if (negatives.some((p) => matches(relative, p))) continue
      if (
        positives.some((p) => matches(relative, p)) &&
        (await fs.pathExists(path.join(full, "package.json")))
      ) {
        const framework = await detectFramework(full)
        // Generic React libraries (packages/ui) are not silently treated as apps.
        if (
          ["next", "tanstack-start", "react-router", "vite"].includes(framework) ||
          (framework === "react" && /^(apps|applications)\//.test(relative))
        )
          found.push(relative)
      }
      await walk(full, depth + 1)
    }
  }
  await walk(root, 0)
  return found.sort()
}
export class CancelledError extends Error {
  constructor() {
    super("Setup cancelled. No further changes made.")
  }
}
export const promptOptions = {
  onCancel: () => {
    throw new CancelledError()
  },
}
export async function resolveProjectTarget(
  options: { workspace?: string; yes?: boolean; defaults?: boolean },
  cwd = process.cwd()
): Promise<string> {
  const root = await findWorkspaceRoot(cwd)
  if (options.workspace) {
    if (!root)
      throw new Error(
        "--workspace requires a workspace root (package.json workspaces or pnpm-workspace.yaml)."
      )
    const target = path.resolve(root, options.workspace)
    const relative = path.relative(root, target)
    const candidates = await applicationWorkspaces(root)
    if (!candidates.includes(relative.split(path.sep).join("/")))
      throw new Error(
        `Invalid application workspace: ${options.workspace}. Choose ${candidates.join(", ") || "an application declared in your workspace configuration"}.`
      )
    if ((await fs.realpath(target)) !== path.resolve(await fs.realpath(root), relative))
      throw new Error(
        "Symlinked workspaces are not supported. Run init directly inside the application."
      )
    return target
  }
  if (!root || path.resolve(cwd) !== root) return cwd
  const candidates = await applicationWorkspaces(root)
  console.log("✓ Detected monorepo")
  if (!candidates.length)
    throw new Error(
      "No application workspaces detected. Run init inside your React application; repository-root installation was skipped."
    )
  if (candidates.length === 1) return resolveProjectTarget({ workspace: candidates[0] }, cwd)
  if (options.yes || options.defaults || !process.stdin.isTTY)
    throw new Error(
      `Multiple application workspaces. Specify --workspace <path>: ${candidates.join(", ")}`
    )
  const { workspace } = await prompts(
    {
      type: "select",
      name: "workspace",
      message: "Which workspace should receive baseui-cn?",
      choices: candidates.map((value) => ({ title: value, value })),
    },
    promptOptions
  )
  if (!workspace) throw new CancelledError()
  return resolveProjectTarget({ workspace }, cwd)
}
// Existing modules resolve from cwd. Keep that contract local to one awaited
// command and restore it even on cancellation or write failures.
export async function inProject<T>(
  options: { workspace?: string; yes?: boolean; defaults?: boolean },
  action: () => Promise<T>
): Promise<T> {
  const previous = process.cwd()
  const target = await resolveProjectTarget(options)
  if (target !== previous) console.log(`✓ Workspace ${path.relative(previous, target)}`)
  process.chdir(target)
  try {
    return await action()
  } finally {
    process.chdir(previous)
  }
}
