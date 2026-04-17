import path from "path"
import fs from "fs-extra"

const REGISTRY_BASE = "https://baseui-cn.com/registry"
const BUNDLED_REGISTRY_DIR = path.resolve(__dirname, "../registry")
const REGISTRY_FETCH_TIMEOUT_MS = 4000

let remoteRegistryAvailable: boolean | null = null
let registryIndexPromise: Promise<RegistryIndex> | null = null
const componentPromises = new Map<string, Promise<ComponentEntry>>()

export interface RegistryListEntry {
  name: string
  type: string
  description: string
  tags?: string[]
  badge?: string
}

export interface RegistryIndex {
  version: string
  components: RegistryListEntry[]
}

export interface ComponentEntry {
  name: string
  type: string
  description: string
  version: string
  label?: string
  section?: string
  exportName?: string
  installedPath?: string
  files: Array<{
    path: string
    content: string
    type: string
  }>
  dependencies: {
    required: string[]
    peer: string[]
  }
  registryDependencies: string[]
}

async function loadBundledJson<T>(fileName: string): Promise<T> {
  return fs.readJson(path.join(BUNDLED_REGISTRY_DIR, fileName)) as Promise<T>
}

async function fetchRemoteJson<T>(fileName: string): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REGISTRY_FETCH_TIMEOUT_MS)

  try {
    const res = await fetch(`${REGISTRY_BASE}/${fileName}`, {
      signal: controller.signal,
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

    return res.json() as Promise<T>
  } finally {
    clearTimeout(timeoutId)
  }
}

async function fetchWithBundledFallback<T>(fileName: string): Promise<T> {
  if (remoteRegistryAvailable !== false) {
    try {
      const json = await fetchRemoteJson<T>(fileName)
      remoteRegistryAvailable = true
      return json
    } catch {
      remoteRegistryAvailable = false
    }
  }

  return loadBundledJson<T>(fileName)
}

export async function fetchRegistry(): Promise<RegistryIndex> {
  if (!registryIndexPromise) {
    registryIndexPromise = fetchWithBundledFallback<RegistryIndex>("index.json")
  }

  return registryIndexPromise
}

export async function fetchComponent(name: string): Promise<ComponentEntry> {
  const existingPromise = componentPromises.get(name)
  if (existingPromise) {
    return existingPromise
  }

  const promise = fetchWithBundledFallback<ComponentEntry>(`${name}.json`).catch(() => {
    throw new Error(
      `Component "${name}" not found in registry.\nRun npx baseui-cn list to see all available components.`
    )
  })

  componentPromises.set(name, promise)
  return promise
}

export async function resolveComponentDependencies(
  components: string[]
): Promise<string[]> {
  const resolved = new Set<string>()
  const queue = [...components]

  while (queue.length) {
    const name = queue.shift()!
    if (resolved.has(name)) continue
    resolved.add(name)

    try {
      const component = await fetchComponent(name)
      const deps = component.registryDependencies ?? []
      for (const dep of deps) {
        if (dep !== "utils" && !resolved.has(dep)) {
          queue.push(dep)
        }
      }
    } catch {
      // Not a registry component, skip dependency resolution.
    }
  }

  return [...resolved]
}
