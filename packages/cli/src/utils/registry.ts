const REGISTRY_BASE = "https://baseui-cn.com/registry"

export async function fetchRegistry() {
  try {
    const res = await fetch(`${REGISTRY_BASE}/index.json`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json() as Promise<{
      version: string
      components: Array<{ name: string; type: string; description: string; tags?: string[] }>
    }>
  } catch {
    // Fallback to bundled registry for offline / dev
    const { default: index } = await import("../../../registry/index.json", {
      assert: { type: "json" },
    })
    return index as {
      version: string
      components: Array<{ name: string; type: string; description: string; tags?: string[] }>
    }
  }
}

export async function fetchComponent(name: string): Promise<ComponentEntry> {
  const res = await fetch(`${REGISTRY_BASE}/${name}.json`)
  if (!res.ok) {
    throw new Error(
      `Component "${name}" not found in registry.\nRun npx baseui-cn list to see all available components.`
    )
  }
  return res.json() as Promise<ComponentEntry>
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
      // Not a registry component — skip dependency resolution
    }
  }

  return [...resolved]
}

interface ComponentEntry {
  name: string
  type: string
  description: string
  version: string
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
