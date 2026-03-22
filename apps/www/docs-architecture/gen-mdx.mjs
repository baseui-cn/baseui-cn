#!/usr/bin/env node

/**
 * gen-mdx.mjs
 *
 * Generates MDX documentation files for all components.
 * Run from repo root: node scripts/gen-mdx.mjs
 *
 * Reads from: packages/registry/registry/*.json
 * Writes to:  apps/www/content/docs/components/*.mdx
 *
 * Existing MDX files with hand-written content are SKIPPED unless --force is passed.
 * Only generates a file if it doesn't exist OR if --force flag is used.
 */

import { readdir, readFile, writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import { join } from "path"

const REGISTRY_DIR = "packages/registry/registry"
const OUTPUT_DIR = "apps/www/content/docs/components"
const FORCE = process.argv.includes("--force")

// Per-component doc config — primitive, render note, notes, examples, props
const componentConfig = {
  button: {
    description: "A clickable element that triggers an action.",
    primitive: "@base-ui/react/button",
    examples: [
      { title: "Variants", code: `<div className="flex flex-wrap gap-2">\n  <Button>Default</Button>\n  <Button variant="outline">Outline</Button>\n  <Button variant="secondary">Secondary</Button>\n  <Button variant="ghost">Ghost</Button>\n  <Button variant="destructive">Destructive</Button>\n  <Button variant="link">Link</Button>\n</div>` },
      { title: "Sizes", code: `<div className="flex items-center gap-2">\n  <Button size="xs">XSmall</Button>\n  <Button size="sm">Small</Button>\n  <Button size="default">Default</Button>\n  <Button size="lg">Large</Button>\n</div>` },
    ],
    props: [
      { name: "variant", type: '"default" | "outline" | "secondary" | "ghost" | "destructive" | "link"', defaultValue: '"default"', desc: "Visual style variant" },
      { name: "size", type: '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"', defaultValue: '"default"', desc: "Size variant" },
      { name: "disabled", type: "boolean", defaultValue: "false", desc: "Disables the button" },
    ],
  },
  input: {
    description: "A text input field with label, helper text, and error state support.",
    primitive: "@base-ui/react/field",
    examples: [
      { title: "With error", code: `<Input label="Email" type="email" error="Enter a valid email address." />` },
      { title: "With helper text", code: `<Input label="Username" helperText="Only letters and numbers allowed." />` },
    ],
    props: [
      { name: "label", type: "string", desc: "Label rendered above the input" },
      { name: "helperText", type: "string", desc: "Helper text shown below when no error" },
      { name: "error", type: "string", desc: "Error message — sets aria-invalid" },
      { name: "required", type: "boolean", defaultValue: "false", desc: "Marks field as required" },
    ],
  },
  textarea: {
    description: "A multiline text input with optional auto-resize.",
    primitive: "@base-ui/react/field",
    examples: [
      { title: "Auto-resize", code: `<Textarea label="Message" placeholder="It grows as you type..." autoResize />` },
    ],
    props: [
      { name: "label", type: "string", desc: "Label above the textarea" },
      { name: "helperText", type: "string", desc: "Helper text" },
      { name: "error", type: "string", desc: "Error message" },
      { name: "rows", type: "number", defaultValue: "3", desc: "Initial row count" },
      { name: "autoResize", type: "boolean", defaultValue: "false", desc: "Grows with content" },
    ],
  },
  checkbox: {
    description: "A control that allows the user to toggle between checked and unchecked.",
    primitive: "@base-ui/react/checkbox",
    props: [
      { name: "label", type: "string", desc: "Label text" },
      { name: "description", type: "string", desc: "Supporting description below label" },
      { name: "checked", type: "boolean", desc: "Controlled checked state" },
      { name: "onCheckedChange", type: "(checked: boolean) => void", desc: "Called when value changes" },
      { name: "disabled", type: "boolean", defaultValue: "false", desc: "Disables the checkbox" },
    ],
  },
  switch: {
    description: "A toggle control for binary on/off states.",
    primitive: "@base-ui/react/switch",
    props: [
      { name: "label", type: "string", desc: "Label text" },
      { name: "description", type: "string", desc: "Supporting description" },
      { name: "checked", type: "boolean", desc: "Controlled checked state" },
      { name: "onCheckedChange", type: "(checked: boolean) => void", desc: "Called when value changes" },
    ],
  },
  "radio-group": {
    description: "A group of radio buttons for single selection from multiple options.",
    primitive: "@base-ui/react/radio-group",
    props: [
      { name: "label", type: "string", desc: "Group label" },
      { name: "value", type: "string", desc: "Controlled selected value" },
      { name: "onValueChange", type: "(value: string) => void", desc: "Called on selection" },
    ],
  },
  select: {
    description: "A dropdown for selecting a single value from a list.",
    primitive: "@base-ui/react/select",
    props: [
      { name: "value", type: "string", desc: "Controlled selected value" },
      { name: "onValueChange", type: "(value: string) => void", desc: "Called on selection" },
      { name: "disabled", type: "boolean", defaultValue: "false", desc: "Disables the select" },
    ],
  },
  combobox: {
    description: "A searchable select — type to filter, click to choose.",
    primitive: "@base-ui/react/combobox",
    notes: "No cmdk dependency. Works inside Drawer and Dialog without z-index issues — same Base UI portal.",
    props: [
      { name: "options", type: "{ value: string; label: string; disabled?: boolean }[]", required: true, desc: "Options to display" },
      { name: "value", type: "string", desc: "Controlled value" },
      { name: "onValueChange", type: "(value: string) => void", desc: "Called on selection" },
      { name: "placeholder", type: "string", defaultValue: '"Select an option..."', desc: "Trigger placeholder" },
      { name: "searchPlaceholder", type: "string", defaultValue: '"Search..."', desc: "Search input placeholder" },
      { name: "emptyText", type: "string", defaultValue: '"No results found."', desc: "Empty state text" },
    ],
  },
  autocomplete: {
    description: "A free-text input that suggests options as you type.",
    primitive: "@base-ui/react/autocomplete",
    notes: "Differs from Combobox: the input is always visible and directly editable.",
    props: [
      { name: "options", type: "{ value: string; label: string; disabled?: boolean }[]", required: true, desc: "Options to suggest" },
      { name: "value", type: "string", desc: "Controlled value" },
      { name: "onValueChange", type: "(value: string) => void", desc: "Called on selection" },
      { name: "placeholder", type: "string", desc: "Input placeholder" },
    ],
  },
  slider: {
    description: "An input for selecting a numeric value within a range.",
    primitive: "@base-ui/react/slider",
    examples: [
      { title: "Range slider", code: `<Slider defaultValue={[20, 80]} min={0} max={100} />` },
      { title: "Vertical", code: `<Slider orientation="vertical" defaultValue={[50]} className="h-40" />` },
    ],
    props: [
      { name: "value", type: "number[]", desc: "Controlled values" },
      { name: "defaultValue", type: "number[]", desc: "Uncontrolled initial values" },
      { name: "min", type: "number", defaultValue: "0", desc: "Minimum value" },
      { name: "max", type: "number", defaultValue: "100", desc: "Maximum value" },
      { name: "step", type: "number", defaultValue: "1", desc: "Step increment" },
      { name: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"', desc: "Slider orientation" },
      { name: "disabled", type: "boolean", defaultValue: "false", desc: "Disables the slider" },
    ],
  },
  dialog: {
    description: "A modal window that overlays the main content.",
    primitive: "@base-ui/react/dialog",
    renderNote: "DialogTrigger and DialogClose use the render prop — not asChild.",
    props: [
      { name: "open", type: "boolean", desc: "Controlled open state" },
      { name: "onOpenChange", type: "(open: boolean) => void", desc: "Called when open changes" },
    ],
  },
  "alert-dialog": {
    description: "A modal that requires an explicit user action. Cannot be dismissed by clicking outside.",
    primitive: "@base-ui/react/alert-dialog",
    renderNote: "AlertDialogTrigger and AlertDialogClose use the render prop — not asChild.",
    notes: "Use for destructive or irreversible actions where the user must explicitly confirm.",
    props: [
      { name: "open", type: "boolean", desc: "Controlled open state" },
      { name: "onOpenChange", type: "(open: boolean) => void", desc: "Called when open changes" },
    ],
  },
  popover: {
    description: "A floating panel anchored to a trigger element.",
    primitive: "@base-ui/react/popover",
    renderNote: "PopoverTrigger uses the render prop — not asChild.",
    props: [
      { name: "side", type: '"top" | "bottom" | "left" | "right"', defaultValue: '"bottom"', desc: "Preferred side" },
      { name: "align", type: '"start" | "center" | "end"', defaultValue: '"center"', desc: "Alignment along the side" },
      { name: "showArrow", type: "boolean", defaultValue: "true", desc: "Show directional arrow" },
    ],
  },
  tooltip: {
    description: "A short description that appears when hovering or focusing an element.",
    primitive: "@base-ui/react/tooltip",
    renderNote: "TooltipTrigger uses the render prop — not asChild.",
    notes: "Wrap multiple tooltips in one TooltipProvider for instant switching — no delay gap between them.",
    props: [
      { name: "side", type: '"top" | "bottom" | "left" | "right"', defaultValue: '"top"', desc: "Preferred placement" },
      { name: "sideOffset", type: "number", defaultValue: "6", desc: "Distance from trigger in px" },
      { name: "showArrow", type: "boolean", defaultValue: "true", desc: "Show directional arrow" },
    ],
  },
  "dropdown-menu": {
    description: "A menu that opens from a trigger, showing a list of actions.",
    primitive: "@base-ui/react/menu",
    renderNote: "DropdownMenuTrigger uses the render prop — not asChild.",
    props: [],
  },
  toast: {
    description: "Temporary notifications that appear in the bottom-right corner.",
    primitive: "@base-ui/react/toast",
    notes: "Wrap your app in ToastProvider once in layout.tsx, then call useToast() from any component.",
    props: [
      { name: "title", type: "string", desc: "Toast heading" },
      { name: "description", type: "string", desc: "Supporting text" },
      { name: "variant", type: '"default" | "success" | "error" | "warning"', defaultValue: '"default"', desc: "Color variant" },
    ],
  },
  collapsible: {
    description: "A single expandable/collapsible section.",
    primitive: "@base-ui/react/collapsible",
    notes: "For multiple expandable sections with shared state, use Accordion instead.",
    props: [
      { name: "open", type: "boolean", desc: "Controlled open state" },
      { name: "onOpenChange", type: "(open: boolean) => void", desc: "Called when open changes" },
      { name: "defaultOpen", type: "boolean", defaultValue: "false", desc: "Initial open state" },
    ],
  },
  accordion: {
    description: "Multiple expandable sections with keyboard navigation.",
    primitive: "@base-ui/react/accordion",
    props: [
      { name: "openMultiple", type: "boolean", defaultValue: "false", desc: "Allow multiple open at once" },
    ],
  },
  tabs: {
    description: "Tabbed interface for switching between related content panels.",
    primitive: "@base-ui/react/tabs",
    props: [
      { name: "defaultValue", type: "string", desc: "Initially active tab" },
      { name: "value", type: "string", desc: "Controlled active tab" },
      { name: "onValueChange", type: "(value: string) => void", desc: "Called when tab changes" },
      { name: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"', desc: "Tab layout direction" },
    ],
  },
  progress: {
    description: "A bar showing completion percentage or an indeterminate loading state.",
    primitive: "@base-ui/react/progress",
    examples: [
      { title: "Indeterminate", code: `<Progress label="Loading..." />` },
      { title: "Sizes", code: `<div className="space-y-3">\n  <Progress value={60} size="sm" label="Small" />\n  <Progress value={60} label="Default" />\n  <Progress value={60} size="lg" label="Large" />\n</div>` },
    ],
    props: [
      { name: "value", type: "number | null", desc: "0–100. Omit or pass null for indeterminate" },
      { name: "label", type: "string", desc: "Label above the bar" },
      { name: "showValue", type: "boolean", defaultValue: "false", desc: "Show percentage text" },
      { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', desc: "Bar height" },
    ],
  },
  badge: {
    description: "A small label for status, categories, or counts.",
    primitive: "@base-ui/react/use-render",
    examples: [
      { title: "All variants", code: `<div className="flex flex-wrap gap-2">\n  <Badge>Default</Badge>\n  <Badge variant="secondary">Secondary</Badge>\n  <Badge variant="success">Success</Badge>\n  <Badge variant="warning">Warning</Badge>\n  <Badge variant="destructive">Destructive</Badge>\n  <Badge variant="info">Info</Badge>\n  <Badge variant="outline">Outline</Badge>\n</div>` },
      { title: "Pill shape", code: `<Badge shape="pill" variant="success">Active</Badge>` },
    ],
    props: [
      { name: "variant", type: '"default" | "secondary" | "outline" | "destructive" | "success" | "warning" | "info" | "ghost"', defaultValue: '"default"', desc: "Color variant" },
      { name: "size", type: '"sm" | "default" | "lg"', defaultValue: '"default"', desc: "Size" },
      { name: "shape", type: '"default" | "pill"', defaultValue: '"default"', desc: "Border radius style" },
    ],
  },
  avatar: {
    description: "An image element with a fallback for representing the user.",
    primitive: "@base-ui/react/avatar",
    examples: [
      { title: "With status badge", code: `<Avatar>\n  <AvatarFallback>MO</AvatarFallback>\n  <AvatarBadge className="bg-green-500" />\n</Avatar>` },
      { title: "Group", code: `<AvatarGroup>\n  <Avatar><AvatarFallback>AC</AvatarFallback></Avatar>\n  <Avatar><AvatarFallback>MO</AvatarFallback></Avatar>\n  <AvatarGroupCount>+4</AvatarGroupCount>\n</AvatarGroup>` },
    ],
    props: [
      { name: "size", type: '"sm" | "default" | "lg"', defaultValue: '"default"', desc: "Avatar dimensions" },
    ],
  },
  skeleton: {
    description: "A placeholder to show while content is loading.",
    props: [],
  },
  separator: {
    description: "A visual divider between sections of content.",
    props: [
      { name: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"', desc: "Direction" },
      { name: "decorative", type: "boolean", defaultValue: "true", desc: "Hides from accessibility tree when true" },
    ],
  },
  label: {
    description: "An accessible label for form controls.",
    primitive: "@base-ui/react/field",
    props: [
      { name: "required", type: "boolean", defaultValue: "false", desc: "Shows a red asterisk" },
    ],
  },
  table: {
    description: "A table for displaying structured data.",
    props: [],
  },
  breadcrumb: {
    description: "A navigation trail showing the user's current location.",
    props: [],
  },
  pagination: {
    description: "Controls for navigating between pages of content.",
    props: [],
  },
  command: {
    description: "A searchable command palette with keyboard navigation.",
    notes: "No cmdk dependency. Built on Base UI Dialog + native React state. Arrow key navigation built in.",
    props: [
      { name: "items", type: "CommandItem[]", required: true, desc: "Array of command items" },
      { name: "placeholder", type: "string", desc: "Search input placeholder" },
      { name: "emptyText", type: "string", desc: "Text when no results found" },
      { name: "onSelect", type: "(item: CommandItem) => void", desc: "Called when item is selected" },
    ],
  },
  "empty-state": {
    description: "A placeholder UI for when a section has no content.",
    props: [
      { name: "title", type: "string", required: true, desc: "Main heading" },
      { name: "description", type: "string", desc: "Supporting text" },
      { name: "icon", type: "React.ReactNode", desc: "Icon above the title" },
      { name: "action", type: "React.ReactNode", desc: "CTA button or link" },
      { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', desc: "Controls padding and text size" },
    ],
  },
  login: {
    description: "A ready-to-use sign-in form with validation and social login options.",
    props: [
      { name: "onSubmit", type: "(data: { email: string; password: string }) => void | Promise<void>", desc: "Form submission handler" },
      { name: "onGoogleLogin", type: "() => void", desc: "Shows Google button when provided" },
      { name: "onGithubLogin", type: "() => void", desc: "Shows GitHub button when provided" },
      { name: "isLoading", type: "boolean", defaultValue: "false", desc: "Shows loading state" },
      { name: "error", type: "string", desc: "Global error message above form" },
    ],
  },
  "app-shell": {
    description: "A full-page layout with collapsible sidebar and top header.",
    notes: "Mobile sidebar uses Base UI Drawer so overlays inside the page work correctly.",
    props: [
      { name: "nav", type: "NavItem[]", required: true, desc: "Navigation items" },
      { name: "activeId", type: "string", desc: "Currently active nav item ID" },
      { name: "logo", type: "React.ReactNode", desc: "Logo area content" },
      { name: "defaultCollapsed", type: "boolean", defaultValue: "false", desc: "Start sidebar collapsed" },
    ],
  },
}

// ── MDX template ──────────────────────────────────────────────────────────

function buildMdx(slug, config = {}) {
  const {
    description = `The ${slug} component.`,
    primitive,
    renderNote,
    notes,
    examples = [],
    props = [],
    installDeps = "npm install @base-ui/react",
  } = config

  const lines = []

  // Frontmatter
  lines.push("---")
  lines.push(`title: ${slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}`)
  lines.push(`description: ${description}`)
  if (primitive) lines.push(`primitive: "${primitive}"`)
  lines.push("---")
  lines.push("")

  // Preview
  lines.push(`<Preview slug="${slug}" />`)
  lines.push("")

  // Notes callout
  if (notes) {
    lines.push(`<Callout variant="info">`)
    lines.push(`  ${notes}`)
    lines.push(`</Callout>`)
    lines.push("")
  }

  // render prop callout
  if (renderNote) {
    lines.push(`<Callout variant="warning" title="render prop, not asChild">`)
    lines.push(`  ${renderNote}`)
    lines.push(`</Callout>`)
    lines.push("")
  }

  // Installation
  lines.push("## Installation")
  lines.push("")
  lines.push(`<InstallTabs`)
  lines.push(`  addCmd="npx baseui-cn add ${slug}"`)
  if (installDeps) lines.push(`  manualDeps="${installDeps}"`)
  lines.push(`  slug="${slug}"`)
  lines.push(`/>`)
  lines.push("")

  // Examples
  if (examples.length > 0) {
    lines.push("## Examples")
    lines.push("")
    for (const example of examples) {
      lines.push(`### ${example.title}`)
      lines.push("")
      if (example.description) {
        lines.push(example.description)
        lines.push("")
      }
      lines.push("```tsx")
      lines.push(example.code)
      lines.push("```")
      lines.push("")
    }
  }

  // Props
  if (props.length > 0) {
    lines.push("## Props")
    lines.push("")
    lines.push("<PropsTable>")
    for (const prop of props) {
      const reqAttr = prop.required ? " required" : ""
      const defAttr = prop.defaultValue ? ` defaultValue="${prop.defaultValue}"` : ""
      lines.push(`  <PropRow name="${prop.name}" type="${prop.type}"${defAttr}${reqAttr}>`)
      lines.push(`    ${prop.desc}`)
      lines.push(`  </PropRow>`)
    }
    lines.push("</PropsTable>")
    lines.push("")
  }

  return lines.join("\n")
}

// ── Run ───────────────────────────────────────────────────────────────────

await mkdir(OUTPUT_DIR, { recursive: true })

const registryFiles = await readdir(REGISTRY_DIR)
  .then(files => files.filter(f => f.endsWith(".json") && f !== "index.json"))

let generated = 0
let skipped = 0

for (const file of registryFiles) {
  const slug = file.replace(".json", "")
  const outPath = join(OUTPUT_DIR, `${slug}.mdx`)

  // Skip if exists and not forcing
  if (!FORCE && existsSync(outPath)) {
    console.log(`  ⏭  ${slug} (already exists — use --force to overwrite)`)
    skipped++
    continue
  }

  const config = componentConfig[slug] ?? {}
  const mdx = buildMdx(slug, config)
  await writeFile(outPath, mdx)
  console.log(`  ✓  ${slug}.mdx`)
  generated++
}

console.log(`\nDone. Generated ${generated}, skipped ${skipped}.`)
console.log("Hand-edit any .mdx file to add richer examples — they won't be overwritten.")
