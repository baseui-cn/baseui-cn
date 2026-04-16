import { readFile } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

const REGISTRY_DIR = join(process.cwd(), "../../packages/registry/registry")

export async function getRegistryFileContent(name: string): Promise<{
  code: string
  dependencies: string[]
  filePath: string
  exportName?: string
} | null> {
  const filePath = join(REGISTRY_DIR, `${name}.json`)
  if (!existsSync(filePath)) return null
  try {
    const data = JSON.parse(await readFile(filePath, "utf-8"))
    return {
      code: data?.files?.[0]?.content ?? "",
      dependencies: data?.dependencies?.required ?? [],
      filePath: data?.installedPath ?? data?.files?.[0]?.path ?? "",
      exportName: data?.exportName,
    }
  } catch {
    return null
  }
}
