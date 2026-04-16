import catalogJson from "@/lib/__generated__/catalog.json"

export type ComponentType = "component" | "block"

export interface ComponentMeta {
  name: string
  type: ComponentType
  section: string
  label: string
  description: string
  tags: string[]
  exportName: string
  installedPath: string
  version: string
  baseUIPrimitive?: string
  badge?: string
}

export interface NavSection {
  title: string
  items: { name: string; href: string; label: string; badge?: string }[]
}

interface GeneratedCatalog {
  version: string
  components: ComponentMeta[]
  sections: {
    title: string
    items: { name: string; label: string; badge?: string }[]
  }[]
}

const catalog = catalogJson as GeneratedCatalog

export const components = catalog.components

export const navSections: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { name: "introduction", href: "/docs", label: "Introduction" },
      { name: "installation", href: "/docs/installation", label: "Installation" },
      { name: "theming", href: "/docs/theming", label: "Theming" },
      { name: "llms", href: "/docs/llms", label: "LLM Usage" },
    ],
  },
  ...catalog.sections.map((section) => ({
    title: section.title,
    items: section.items.map((item) => ({
      name: item.name,
      href: `/docs/components/${item.name}`,
      label: item.label,
      ...(item.badge ? { badge: item.badge } : {}),
    })),
  })),
]

export function getComponent(name: string): ComponentMeta | undefined {
  return components.find((component) => component.name === name)
}
