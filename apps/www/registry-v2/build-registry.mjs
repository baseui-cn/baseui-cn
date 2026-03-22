#!/usr/bin/env node
/**
 * Reads component source files from apps/www/components/ui/
 * and writes registry JSON entries to packages/registry/registry/
 * 
 * Run from repo root: node scripts/build-registry.mjs
 */
import { readFile, writeFile, readdir } from "fs/promises"
import { join } from "path"

const UI_DIR = "apps/www/components/ui"
const REGISTRY_DIR = "packages/registry/registry"

// Per-component metadata
const componentMeta = {
  "accordion": {
    description: "A vertically stacked set of interactive headings that each reveal a section of content.",
    tags: ["disclosure", "interactive"],
    baseUIPrimitive: "Accordion",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  },
  "alert-dialog": {
    description: "A modal dialog that interrupts the user with important content and expects a response.",
    tags: ["overlay", "interactive"],
    baseUIPrimitive: "AlertDialog",
    deps: ["@base-ui/react"],
    registryDeps: ["utils", "button"],
  },
  "autocomplete": {
    description: "An input with a list of filtered options that appear as the user types.",
    tags: ["form", "overlay", "interactive"],
    baseUIPrimitive: "Autocomplete",
    deps: ["@base-ui/react", "lucide-react"],
    registryDeps: ["utils", "scroll-area"],
  },
  "avatar": {
    description: "An image element with a fallback for representing the user.",
    tags: ["display", "primitive"],
    baseUIPrimitive: "Avatar",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  },
  "badge": {
    description: "A small status descriptor for UI elements.",
    tags: ["display", "primitive"],
    deps: ["@base-ui/react", "class-variance-authority"],
    registryDeps: ["utils"],
  },
  "button": {
    description: "A clickable element that triggers an action.",
    tags: ["form", "primitive"],
    baseUIPrimitive: "Button",
    deps: ["@base-ui/react", "class-variance-authority"],
    registryDeps: ["utils"],
  },
  "checkbox": {
    description: "A control that allows the user to toggle between checked and unchecked states.",
    tags: ["form", "interactive"],
    baseUIPrimitive: "Checkbox",
    deps: ["@base-ui/react", "lucide-react"],
    registryDeps: ["utils"],
  },
  "collapsible": {
    description: "An interactive component which expands/collapses a panel.",
    tags: ["disclosure", "interactive"],
    baseUIPrimitive: "Collapsible",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  },
  "combobox": {
    description: "An input combined with a listbox for selecting from a list of options.",
    tags: ["form", "overlay", "interactive"],
    baseUIPrimitive: "Combobox",
    deps: ["@base-ui/react", "lucide-react"],
    registryDeps: ["utils", "button", "input-group"],
  },
  "dialog": {
    description: "A window overlaid on either the primary window or another dialog window.",
    tags: ["overlay", "interactive"],
    baseUIPrimitive: "Dialog",
    deps: ["@base-ui/react", "lucide-react", "class-variance-authority"],
    registryDeps: ["utils", "button"],
  },
  "drawer": {
    description: "A panel that slides in from the edge of the screen.",
    tags: ["overlay", "interactive", "mobile"],
    baseUIPrimitive: "Drawer",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  },
  "dropdown-menu": {
    description: "Displays a menu to the user — such as a set of actions or functions — triggered by a button.",
    tags: ["overlay", "interactive", "navigation"],
    baseUIPrimitive: "Menu",
    deps: ["@base-ui/react", "lucide-react"],
    registryDeps: ["utils"],
  },
  "field": {
    description: "A form field layout component with label, description, and error support.",
    tags: ["form", "layout"],
    deps: ["class-variance-authority"],
    registryDeps: ["utils", "label", "separator"],
  },
  "input": {
    description: "A text input field.",
    tags: ["form", "primitive"],
    baseUIPrimitive: "Input",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  },
  "input-group": {
    description: "A composite input component with addons, icons, and buttons.",
    tags: ["form", "composite"],
    deps: [],
    registryDeps: ["utils", "button", "input", "textarea"],
  },
  "popover": {
    description: "Displays rich content in a portal, triggered by a button.",
    tags: ["overlay", "interactive"],
    baseUIPrimitive: "Popover",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  },
  "progress": {
    description: "Displays an indicator showing the completion progress of a task.",
    tags: ["display", "feedback"],
    baseUIPrimitive: "Progress",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  },
  "radio-group": {
    description: "A set of checkable buttons where no more than one can be checked at a time.",
    tags: ["form", "interactive"],
    baseUIPrimitive: "RadioGroup + Radio",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  },
  "scroll-area": {
    description: "Augments native scroll functionality for custom, cross-browser styling.",
    tags: ["display", "layout"],
    baseUIPrimitive: "ScrollArea",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  },
  "select": {
    description: "Displays a list of options for the user to pick from — triggered by a button.",
    tags: ["form", "overlay", "interactive"],
    baseUIPrimitive: "Select",
    deps: ["@base-ui/react", "lucide-react"],
    registryDeps: ["utils"],
  },
  "separator": {
    description: "Visually or semantically separates content.",
    tags: ["display", "primitive"],
    baseUIPrimitive: "Separator",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  },
  "slider": {
    description: "An input where the user selects a value from within a given range.",
    tags: ["form", "interactive"],
    baseUIPrimitive: "Slider",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  },
  "switch": {
    description: "A control that allows the user to toggle between checked and not checked.",
    tags: ["form", "interactive"],
    baseUIPrimitive: "Switch",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  },
  "tabs": {
    description: "A set of layered sections of content — known as tab panels — that are displayed one at a time.",
    tags: ["navigation", "interactive"],
    baseUIPrimitive: "Tabs",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  },
  "textarea": {
    description: "A multi-line text input field.",
    tags: ["form", "primitive"],
    deps: [],
    registryDeps: ["utils"],
  },
  "toast": {
    description: "A succinct message that is displayed temporarily.",
    tags: ["overlay", "feedback"],
    baseUIPrimitive: "Toast",
    deps: ["@base-ui/react", "class-variance-authority"],
    registryDeps: ["utils"],
  },
  "tooltip": {
    description: "A popup that displays information related to an element when focused or hovered.",
    tags: ["overlay", "interactive"],
    baseUIPrimitive: "Tooltip",
    deps: ["@base-ui/react"],
    registryDeps: ["utils"],
  },
}

const files = await readdir(UI_DIR)
let built = 0

for (const file of files) {
  if (!file.endsWith(".tsx") || file.startsWith("_")) continue
  const name = file.replace(".tsx", "")
  const meta = componentMeta[name]
  if (!meta) {
    console.log(`⚠ No metadata for ${name} — skipping`)
    continue
  }

  const content = await readFile(join(UI_DIR, file), "utf-8")
  
  const entry = {
    name,
    type: "component",
    description: meta.description,
    version: "0.1.0",
    baseUIVersion: ">=1.3.0",
    files: [{
      path: `${name}.tsx`,
      type: "component",
      content,
    }],
    dependencies: {
      required: meta.deps,
      peer: [],
    },
    registryDependencies: meta.registryDeps,
    tags: meta.tags,
    ...(meta.baseUIPrimitive ? { baseUIPrimitive: meta.baseUIPrimitive } : {}),
  }

  await writeFile(
    join(REGISTRY_DIR, `${name}.json`),
    JSON.stringify(entry, null, 2)
  )
  built++
  console.log(`✓ ${name}`)
}

console.log(`\nBuilt ${built} registry entries.`)
