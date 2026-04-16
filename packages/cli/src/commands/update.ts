import { installComponents } from "./add"

export async function update(
  components: string[],
  options: {
    yes: boolean
    all: boolean
    css?: string
    path?: string
  }
) {
  return installComponents(components, {
    ...options,
    mode: "update",
    overwrite: true,
  })
}
