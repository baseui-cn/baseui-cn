import path from "path"
import fs from "fs-extra"

const CONFIG_FILE = "baseui-cn.json"

export interface Config {
  componentsPath: string
  utilsPath: string
  globalCss: string
  tailwind: boolean
  rsc: boolean
}

export async function getConfig(): Promise<Config | null> {
  const configPath = path.resolve(CONFIG_FILE)
  if (!(await fs.pathExists(configPath))) return null
  return fs.readJson(configPath)
}

export async function writeConfig(config: Config): Promise<void> {
  const configPath = path.resolve(CONFIG_FILE)
  await fs.writeJson(configPath, config, { spaces: 2 })
}
