import { dirname, join } from "path"
import { fileURLToPath } from "url"

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))

export const REPO_ROOT = join(SCRIPT_DIR, "..")
export const UI_DIR = join(REPO_ROOT, "apps", "www", "components", "ui")
export const REGISTRY_DIR = join(REPO_ROOT, "packages", "registry", "registry")
export const PUBLIC_REGISTRY_DIR = join(REPO_ROOT, "apps", "www", "public", "registry")
export const CLI_REGISTRY_DIR = join(REPO_ROOT, "packages", "cli", "registry")
export const REGISTRY_PACKAGE_INDEX = join(REPO_ROOT, "packages", "registry", "index.json")
export const SITE_CATALOG_FILE = join(REPO_ROOT, "apps", "www", "lib", "__generated__", "catalog.json")
export const CLI_PACKAGE_FILE = join(REPO_ROOT, "packages", "cli", "package.json")

export const SECTION_ORDER = [
  "Display",
  "Form",
  "Overlays",
  "Layout",
  "Navigation & Data",
  "Blocks",
]

const COMPONENT_BADGE = "New"

function slugToLabel(name) {
  return name.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function slugToExportName(name) {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}

function defineEntry(name, meta) {
  const targetPath = meta.targetPath ?? `${name}.tsx`
  const files =
    meta.files?.map((file) => ({
      sourcePath: file.sourcePath,
      targetPath: file.targetPath,
      type: file.type ?? meta.type ?? "component",
    })) ?? [
      {
        sourcePath: meta.sourcePath ?? `${name}.tsx`,
        targetPath,
        type: meta.type ?? "component",
      },
    ]

  return {
    name,
    type: meta.type ?? "component",
    label: meta.label ?? slugToLabel(name),
    section: meta.section,
    description: meta.description,
    tags: meta.tags,
    deps: meta.deps ?? [],
    registryDeps: meta.registryDeps ?? [],
    sourcePath: files[0].sourcePath,
    targetPath: files[0].targetPath,
    files,
    installedPath: meta.installedPath ?? `components/ui/${targetPath}`,
    exportName: meta.exportName ?? slugToExportName(name),
    badge: meta.badge,
    baseUIPrimitive: meta.baseUIPrimitive,
  }
}

export const componentMeta = {
  // Display
  "button": defineEntry("button", {
    section: "Display",
    description: "A clickable element that triggers an action.",
    tags: ["form", "primitive"],
    baseUIPrimitive: "Button",
    deps: ["@base-ui/react", "class-variance-authority"],
    registryDeps: ["utils", "spinner"],
  }),
  "badge": defineEntry("badge", {
    section: "Display",
    description: "A small status descriptor for UI elements.",
    tags: ["display", "primitive"],
    deps: ["@base-ui/react", "class-variance-authority"],
    registryDeps: ["utils"],
  }),
  "alert": defineEntry("alert", {
    section: "Display",
    description: "A semantic feedback container for errors, warnings, and status messaging.",
    tags: ["display", "feedback"],
    deps: ["class-variance-authority"],
    registryDeps: ["utils"],
  }),
  "avatar": defineEntry("avatar", {
    section: "Display",
    description: "An image element with a fallback for representing the user.",
    tags: ["display", "primitive"],
    baseUIPrimitive: "Avatar",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  }),
  "card": defineEntry("card", {
    section: "Display",
    description: "A container for grouping related content and actions.",
    tags: ["display", "layout"],
    registryDeps: ["utils"],
  }),
  "item": defineEntry("item", {
    section: "Display",
    description: "A flexible list item component with media, content, actions, and variants.",
    tags: ["display", "layout", "list"],
    deps: ["@base-ui/react", "class-variance-authority"],
    registryDeps: ["utils", "separator"],
  }),
  "separator": defineEntry("separator", {
    section: "Display",
    description: "Visually or semantically separates content.",
    tags: ["display", "primitive"],
    baseUIPrimitive: "Separator",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  }),
  "scroll-area": defineEntry("scroll-area", {
    section: "Display",
    description: "Augments native scroll functionality for custom, cross-browser styling.",
    tags: ["display", "layout"],
    baseUIPrimitive: "ScrollArea",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  }),
  "skeleton": defineEntry("skeleton", {
    section: "Display",
    description: "Loading placeholder with pulse animation.",
    tags: ["display", "feedback"],
    registryDeps: ["utils"],
  }),
  "spinner": defineEntry("spinner", {
    section: "Display",
    description: "An animated loading spinner indicator.",
    tags: ["display", "feedback"],
    deps: ["lucide-react"],
    registryDeps: ["utils"],
  }),
  "progress": defineEntry("progress", {
    section: "Display",
    description: "Displays an indicator showing the completion progress of a task.",
    tags: ["display", "feedback"],
    badge: COMPONENT_BADGE,
    baseUIPrimitive: "Progress",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  }),
  "toggle": defineEntry("toggle", {
    section: "Display",
    description: "A two-state button that can be toggled on or off.",
    tags: ["form", "primitive", "interactive"],
    badge: COMPONENT_BADGE,
    baseUIPrimitive: "Toggle",
    deps: ["@base-ui/react", "class-variance-authority"],
    registryDeps: ["utils"],
  }),
  "toggle-group": defineEntry("toggle-group", {
    section: "Display",
    description: "A set of two-state buttons grouped together.",
    tags: ["form", "primitive", "interactive"],
    badge: COMPONENT_BADGE,
    baseUIPrimitive: "ToggleGroup",
    deps: ["@base-ui/react", "class-variance-authority"],
    registryDeps: ["utils", "toggle"],
  }),

  // Form
  "input": defineEntry("input", {
    section: "Form",
    description: "A text input field.",
    tags: ["form", "primitive"],
    baseUIPrimitive: "Input",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  }),
  "textarea": defineEntry("textarea", {
    section: "Form",
    description: "A multi-line text input field.",
    tags: ["form", "primitive"],
    registryDeps: ["utils"],
  }),
  "label": defineEntry("label", {
    section: "Form",
    description: "Accessible form label with required indicator.",
    tags: ["form", "primitive"],
    registryDeps: ["utils"],
  }),
  "field": defineEntry("field", {
    section: "Form",
    description: "A form field component that provides labeling, description, and validation for form controls.",
    tags: ["form", "layout"],
    baseUIPrimitive: "Field",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  }),
  "form": defineEntry("form", {
    section: "Form",
    description: "A Base UI form wrapper for submission handling, validation wiring, and consistent layout.",
    tags: ["form", "layout", "validation"],
    baseUIPrimitive: "Form",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  }),
  "fieldset": defineEntry("fieldset", {
    section: "Form",
    description: "A semantic form section wrapper with a legend for grouped inputs.",
    tags: ["form", "layout", "semantic"],
    badge: COMPONENT_BADGE,
    baseUIPrimitive: "Fieldset",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  }),
  "checkbox": defineEntry("checkbox", {
    section: "Form",
    description: "A control that allows the user to toggle between checked and unchecked states.",
    tags: ["form", "interactive"],
    baseUIPrimitive: "Checkbox",
    deps: ["@base-ui/react", "lucide-react"],
    registryDeps: ["utils"],
  }),
  "switch": defineEntry("switch", {
    section: "Form",
    description: "A control that allows the user to toggle between checked and not checked.",
    tags: ["form", "interactive"],
    baseUIPrimitive: "Switch",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  }),
  "radio-group": defineEntry("radio-group", {
    section: "Form",
    description: "A set of checkable buttons where no more than one can be checked at a time.",
    tags: ["form", "interactive"],
    baseUIPrimitive: "RadioGroup + Radio",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  }),
  "select": defineEntry("select", {
    section: "Form",
    description: "Displays a list of options for the user to pick from, triggered by a button.",
    tags: ["form", "overlay", "interactive"],
    baseUIPrimitive: "Select",
    deps: ["@base-ui/react", "lucide-react"],
    registryDeps: ["utils"],
  }),
  "combobox": defineEntry("combobox", {
    section: "Form",
    description: "An input combined with a listbox for selecting from a list of options.",
    tags: ["form", "overlay", "interactive"],
    badge: COMPONENT_BADGE,
    baseUIPrimitive: "Combobox",
    deps: ["@base-ui/react", "lucide-react"],
    registryDeps: ["utils", "button", "input-group"],
  }),
  "autocomplete": defineEntry("autocomplete", {
    section: "Form",
    description: "An input with a list of filtered options that appear as the user types.",
    tags: ["form", "overlay", "interactive"],
    badge: COMPONENT_BADGE,
    baseUIPrimitive: "Autocomplete",
    deps: ["@base-ui/react", "lucide-react"],
    registryDeps: ["utils", "scroll-area"],
  }),
  "slider": defineEntry("slider", {
    section: "Form",
    description: "An input where the user selects a value from within a given range.",
    tags: ["form", "interactive"],
    badge: COMPONENT_BADGE,
    baseUIPrimitive: "Slider",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  }),
  "number-field": defineEntry("number-field", {
    section: "Form",
    description: "A numeric input with increment and decrement buttons.",
    tags: ["form", "primitive", "interactive"],
    badge: COMPONENT_BADGE,
    baseUIPrimitive: "NumberField",
    deps: ["@base-ui/react", "class-variance-authority", "lucide-react"],
    registryDeps: ["utils", "label"],
  }),
  "otp-field": defineEntry("otp-field", {
    section: "Form",
    description: "A one-time password input composed of individual character slots.",
    tags: ["form", "primitive", "interactive"],
    badge: "Preview",
    baseUIPrimitive: "OTPFieldPreview",
    deps: ["@base-ui/react", "class-variance-authority"],
    registryDeps: ["utils"],
  }),
  "input-group": defineEntry("input-group", {
    section: "Form",
    description: "A composite input component with addons, icons, and buttons.",
    tags: ["form", "composite"],
    registryDeps: ["utils", "button", "input", "textarea"],
  }),

  // Overlays
  "dialog": defineEntry("dialog", {
    section: "Overlays",
    description: "A window overlaid on either the primary window or another dialog window.",
    tags: ["overlay", "interactive"],
    baseUIPrimitive: "Dialog",
    deps: ["@base-ui/react", "lucide-react", "class-variance-authority"],
    registryDeps: ["utils", "button"],
  }),
  "alert-dialog": defineEntry("alert-dialog", {
    section: "Overlays",
    description: "A modal dialog that interrupts the user with important content and expects a response.",
    tags: ["overlay", "interactive"],
    baseUIPrimitive: "AlertDialog",
    deps: ["@base-ui/react"],
    registryDeps: ["utils", "button"],
  }),
  "drawer": defineEntry("drawer", {
    section: "Overlays",
    description: "A panel that slides in from the edge of the screen.",
    tags: ["overlay", "interactive", "mobile"],
    badge: COMPONENT_BADGE,
    baseUIPrimitive: "Drawer",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  }),
  "popover": defineEntry("popover", {
    section: "Overlays",
    description: "Displays rich content in a portal, triggered by a button.",
    tags: ["overlay", "interactive"],
    baseUIPrimitive: "Popover",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  }),
  "tooltip": defineEntry("tooltip", {
    section: "Overlays",
    description: "A popup that displays information related to an element when focused or hovered.",
    tags: ["overlay", "interactive"],
    baseUIPrimitive: "Tooltip",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  }),
  "preview-card": defineEntry("preview-card", {
    section: "Overlays",
    description: "A card that appears on hover to preview linked content.",
    tags: ["overlay", "display"],
    badge: COMPONENT_BADGE,
    baseUIPrimitive: "PreviewCard",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  }),
  "dropdown-menu": defineEntry("dropdown-menu", {
    section: "Overlays",
    description: "Displays a menu to the user, such as a set of actions or functions, triggered by a button.",
    tags: ["overlay", "interactive", "navigation"],
    baseUIPrimitive: "Menu",
    deps: ["@base-ui/react", "lucide-react"],
    registryDeps: ["utils"],
  }),
  "toast": defineEntry("toast", {
    section: "Overlays",
    description: "A succinct message that is displayed temporarily.",
    tags: ["overlay", "feedback"],
    badge: COMPONENT_BADGE,
    baseUIPrimitive: "Toast",
    deps: ["@base-ui/react", "lucide-react"],
    registryDeps: ["utils"],
  }),
  "command": defineEntry("command", {
    section: "Overlays",
    description: "A command palette component for searching and executing actions.",
    tags: ["overlay", "navigation"],
    badge: COMPONENT_BADGE,
    registryDeps: ["utils", "autocomplete"],
  }),

  // Layout
  "collapsible": defineEntry("collapsible", {
    section: "Layout",
    description: "An interactive component which expands or collapses a panel.",
    tags: ["disclosure", "interactive"],
    baseUIPrimitive: "Collapsible",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  }),
  "accordion": defineEntry("accordion", {
    section: "Layout",
    description: "A vertically stacked set of interactive headings that each reveal a section of content.",
    tags: ["disclosure", "interactive"],
    baseUIPrimitive: "Accordion",
    deps: ["@base-ui/react", "lucide-react"],
    registryDeps: ["utils"],
  }),
  "frame": defineEntry("frame", {
    section: "Layout",
    description: "A layered panel shell for grouping sections, headers, and supporting content.",
    tags: ["layout", "display"],
    badge: COMPONENT_BADGE,
    registryDeps: ["utils"],
  }),
  "tabs": defineEntry("tabs", {
    section: "Layout",
    description: "A set of layered sections of content known as tab panels that are displayed one at a time.",
    tags: ["navigation", "interactive"],
    baseUIPrimitive: "Tabs",
    deps: ["@base-ui/react", "class-variance-authority"],
    registryDeps: ["utils"],
  }),

  // Navigation & Data
  "table": defineEntry("table", {
    section: "Navigation & Data",
    description: "Semantic table primitives for displaying data.",
    tags: ["data", "display"],
    registryDeps: ["utils"],
  }),
  "data-grid": defineEntry("data-grid", {
    section: "Navigation & Data",
    description: "A composable TanStack data grid family with editing, virtualization, drag-and-drop, and Base UI-friendly controls.",
    tags: ["data", "table", "interactive"],
    badge: COMPONENT_BADGE,
    installedPath: "components/data-grid/*",
    exportName: "DataGrid",
    deps: [
      "@dnd-kit/core",
      "@dnd-kit/modifiers",
      "@dnd-kit/sortable",
      "@dnd-kit/utilities",
      "@tanstack/react-table",
      "@tanstack/react-virtual",
      "class-variance-authority",
      "lucide-react",
    ],
    registryDeps: [
      "utils",
      "badge",
      "button",
      "card",
      "checkbox",
      "dialog",
      "dropdown-menu",
      "field",
      "input",
      "label",
      "number-field",
      "popover",
      "radio-group",
      "scroll-area",
      "select",
      "separator",
      "skeleton",
      "spinner",
      "switch",
      "textarea",
    ],
    files: [
      {
        sourcePath: "apps/www/components/data-grid/data-grid.tsx",
        targetPath: "components/data-grid/data-grid.tsx",
      },
      {
        sourcePath: "apps/www/components/data-grid/data-grid-column-filter.tsx",
        targetPath: "components/data-grid/data-grid-column-filter.tsx",
      },
      {
        sourcePath: "apps/www/components/data-grid/data-grid-column-header.tsx",
        targetPath: "components/data-grid/data-grid-column-header.tsx",
      },
      {
        sourcePath: "apps/www/components/data-grid/data-grid-column-visibility.tsx",
        targetPath: "components/data-grid/data-grid-column-visibility.tsx",
      },
      {
        sourcePath: "apps/www/components/data-grid/data-grid-editing.tsx",
        targetPath: "components/data-grid/data-grid-editing.tsx",
      },
      {
        sourcePath: "apps/www/components/data-grid/data-grid-pagination.tsx",
        targetPath: "components/data-grid/data-grid-pagination.tsx",
      },
      {
        sourcePath: "apps/www/components/data-grid/data-grid-scroll-area.tsx",
        targetPath: "components/data-grid/data-grid-scroll-area.tsx",
      },
      {
        sourcePath: "apps/www/components/data-grid/data-grid-table.tsx",
        targetPath: "components/data-grid/data-grid-table.tsx",
      },
      {
        sourcePath: "apps/www/components/data-grid/data-grid-table-dnd.tsx",
        targetPath: "components/data-grid/data-grid-table-dnd.tsx",
      },
      {
        sourcePath: "apps/www/components/data-grid/data-grid-table-dnd-rows.tsx",
        targetPath: "components/data-grid/data-grid-table-dnd-rows.tsx",
      },
      {
        sourcePath: "apps/www/components/data-grid/data-grid-table-virtual.tsx",
        targetPath: "components/data-grid/data-grid-table-virtual.tsx",
      },
      {
        sourcePath: "apps/www/hooks/use-editable-data-grid.ts",
        targetPath: "hooks/use-editable-data-grid.ts",
      },
      {
        sourcePath: "apps/www/components/ui/rating.tsx",
        targetPath: "components/ui/rating.tsx",
      },
    ],
  }),
  "breadcrumb": defineEntry("breadcrumb", {
    section: "Navigation & Data",
    description: "Displays the path to the current resource using a hierarchy of links.",
    tags: ["navigation", "display"],
    deps: ["@base-ui/react", "lucide-react"],
    registryDeps: ["utils"],
  }),
  "pagination": defineEntry("pagination", {
    section: "Navigation & Data",
    description: "Page navigation with first, last, next, and previous buttons.",
    tags: ["navigation", "interactive"],
    deps: ["lucide-react"],
    registryDeps: ["utils", "button"],
  }),
  "menubar": defineEntry("menubar", {
    section: "Navigation & Data",
    description: "A visually persistent menu common in desktop applications providing quick access to commands.",
    tags: ["navigation", "interactive", "overlay"],
    baseUIPrimitive: "Menubar",
    deps: ["@base-ui/react", "lucide-react"],
    registryDeps: ["utils", "dropdown-menu"],
  }),
  "navigation-menu": defineEntry("navigation-menu", {
    section: "Navigation & Data",
    description: "A collection of navigation links with sub-menus that appear on hover.",
    tags: ["navigation", "interactive", "overlay"],
    baseUIPrimitive: "NavigationMenu",
    deps: ["@base-ui/react", "class-variance-authority", "lucide-react"],
    registryDeps: ["utils"],
  }),

  // Blocks
  "empty-state": defineEntry("empty-state", {
    section: "Blocks",
    type: "block",
    description: "Empty state with icon, title, description, and action.",
    tags: ["block", "feedback"],
    sourcePath: "blocks.tsx",
    targetPath: "blocks.tsx",
    exportName: "EmptyState",
    registryDeps: ["utils"],
  }),
  "login": defineEntry("login", {
    section: "Blocks",
    type: "block",
    description: "Card-based login form built with Base UI Form, alerts, and toast success states.",
    tags: ["block", "form", "auth"],
    deps: ["lucide-react", "zod"],
    files: [
      {
        sourcePath: "auth.tsx",
        targetPath: "auth.tsx",
        type: "block",
      },
      {
        sourcePath: "apps/www/components/shared/icons.tsx",
        targetPath: "components/shared/icons.tsx",
        type: "component",
      },
    ],
    installedPath: "components/ui/auth.tsx",
    exportName: "LoginBlock",
    registryDeps: ["utils", "alert", "button", "card", "checkbox", "field", "form", "input", "toast"],
  }),
  "signup": defineEntry("signup", {
    section: "Blocks",
    type: "block",
    label: "Sign Up",
    description: "Card-based signup form built with Base UI Form, password rules, alerts, and success toasts.",
    tags: ["block", "form", "auth"],
    deps: ["lucide-react", "zod"],
    files: [
      {
        sourcePath: "auth.tsx",
        targetPath: "auth.tsx",
        type: "block",
      },
      {
        sourcePath: "apps/www/components/shared/icons.tsx",
        targetPath: "components/shared/icons.tsx",
        type: "component",
      },
    ],
    installedPath: "components/ui/auth.tsx",
    exportName: "SignupBlock",
    registryDeps: ["utils", "alert", "button", "card", "checkbox", "field", "form", "input", "toast"],
  }),
}

export function buildEntry(name, files, meta, version) {
  return {
    name,
    type: meta.type,
    label: meta.label,
    section: meta.section,
    description: meta.description,
    version,
    baseUIVersion: ">=1.3.0",
    files,
    dependencies: {
      required: meta.deps,
      peer: [],
    },
    registryDependencies: meta.registryDeps,
    tags: meta.tags,
    exportName: meta.exportName,
    installedPath: meta.installedPath,
    ...(meta.badge ? { badge: meta.badge } : {}),
    ...(meta.baseUIPrimitive ? { baseUIPrimitive: meta.baseUIPrimitive } : {}),
  }
}

export function buildCatalog(version) {
  const components = Object.values(componentMeta).map((meta) => ({
    name: meta.name,
    type: meta.type,
    section: meta.section,
    label: meta.label,
    description: meta.description,
    tags: meta.tags,
    version,
    exportName: meta.exportName,
    installedPath: meta.installedPath,
    ...(meta.badge ? { badge: meta.badge } : {}),
    ...(meta.baseUIPrimitive ? { baseUIPrimitive: meta.baseUIPrimitive } : {}),
  }))

  const sections = SECTION_ORDER.map((title) => ({
    title,
    items: components
      .filter((component) => component.section === title)
      .map((component) => ({
        name: component.name,
        label: component.label,
        ...(component.badge ? { badge: component.badge } : {}),
      })),
  })).filter((section) => section.items.length > 0)

  return {
    version,
    components,
    sections,
  }
}
