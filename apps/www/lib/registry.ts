export type ComponentType = "component" | "block" | "util"

export interface ComponentMeta {
  name: string
  type: ComponentType
  description: string
  tags: string[]
  baseUIPrimitive?: string
  version?: string
  badge?: string
}

export interface NavSection {
  title: string
  items: { name: string; href: string; label: string; badge?: string }[]
}

export const components: ComponentMeta[] = [
  // Primitives
  { name: "button", type: "component", description: "Accessible button with size and variant support.", tags: ["form", "primitive"], baseUIPrimitive: "native button" },
  { name: "input", type: "component", description: "Text input with label, helper text, and error state.", tags: ["form", "primitive"], baseUIPrimitive: "native input" },
  { name: "textarea", type: "component", description: "Multi-line input with optional auto-resize.", tags: ["form", "primitive"], baseUIPrimitive: "native textarea" },
  { name: "label", type: "component", description: "Accessible form label with required indicator.", tags: ["form", "primitive"], baseUIPrimitive: "native label" },
  { name: "separator", type: "component", description: "Visual divider, horizontal or vertical.", tags: ["display", "primitive"] },
  { name: "scroll-area", type: "component", description: "Custom scrollable area with styled scrollbars.", tags: ["display", "primitive"], baseUIPrimitive: "ScrollArea", badge: "New" },
  { name: "badge", type: "component", description: "Status badge with variant support.", tags: ["display", "primitive"] },
  { name: "skeleton", type: "component", description: "Loading placeholder with pulse animation.", tags: ["display", "feedback"] },
  { name: "avatar", type: "component", description: "User avatar with image, fallback initials, and status indicator.", tags: ["display", "primitive"], baseUIPrimitive: "native img" },
  { name: "progress", type: "component", description: "Progress bar with determinate and indeterminate states.", tags: ["display", "feedback"], baseUIPrimitive: "Progress" },

  // Form
  { name: "checkbox", type: "component", description: "Checkbox with indeterminate state support.", tags: ["form", "interactive"], baseUIPrimitive: "Checkbox" },
  { name: "switch", type: "component", description: "Toggle switch.", tags: ["form", "interactive"], baseUIPrimitive: "Switch" },
  { name: "radio-group", type: "component", description: "Radio group with keyboard navigation.", tags: ["form", "interactive"], baseUIPrimitive: "RadioGroup + Radio" },
  { name: "select", type: "component", description: "Custom select — no native element.", tags: ["form", "overlay", "interactive"], baseUIPrimitive: "Select" },
  { name: "combobox", type: "component", description: "Searchable select with filter. Works inside Drawer.", tags: ["form", "overlay", "interactive"], baseUIPrimitive: "Select" },
  { name: "autocomplete", type: "component", description: "Text input with filtered suggestions list. Type to search, select to fill.", tags: ["form", "overlay", "interactive"], baseUIPrimitive: "Combobox", badge: "New" },
  { name: "slider", type: "component", description: "An input where the user selects a value from within a given range.", tags: ["form", "interactive"], baseUIPrimitive: "Slider" },

  // Overlays
  { name: "dialog", type: "component", description: "Modal dialog.", tags: ["overlay", "interactive"], baseUIPrimitive: "Dialog" },
  { name: "alert-dialog", type: "component", description: "Confirmation dialog that requires explicit user action. No backdrop dismiss.", tags: ["overlay", "interactive"], baseUIPrimitive: "AlertDialog", badge: "New" },
  { name: "drawer", type: "component", description: "Slide-in panel. Stable since Base UI v1.3.0.", tags: ["overlay", "interactive", "mobile"], baseUIPrimitive: "Drawer", badge: "New" },
  { name: "popover", type: "component", description: "Floating popover with arrow support.", tags: ["overlay", "interactive"], baseUIPrimitive: "Popover" },
  { name: "tooltip", type: "component", description: "Tooltip with delay group support.", tags: ["overlay", "interactive"], baseUIPrimitive: "Tooltip" },
  { name: "dropdown-menu", type: "component", description: "Dropdown menu with checkboxes and radio items.", tags: ["overlay", "interactive"], baseUIPrimitive: "Menu" },
  { name: "toast", type: "component", description: "Toast notifications. Portal-based, auto-dismiss.", tags: ["overlay", "feedback"], baseUIPrimitive: "Toast" },
  { name: "command", type: "component", description: "Command palette. No cmdk dependency.", tags: ["overlay", "navigation"] },
  { name: "collapsible", type: "component", description: "Single collapsible panel controlled by a trigger button.", tags: ["disclosure", "interactive"], baseUIPrimitive: "Collapsible", badge: "New" },

  // Navigation & Data
  { name: "tabs", type: "component", description: "Tab navigation.", tags: ["navigation", "interactive"], baseUIPrimitive: "Tabs" },
  { name: "accordion", type: "component", description: "Collapsible accordion.", tags: ["disclosure", "interactive"], baseUIPrimitive: "Accordion" },
  { name: "table", type: "component", description: "Semantic table primitives.", tags: ["data", "display"] },
  { name: "breadcrumb", type: "component", description: "Breadcrumb navigation with ellipsis.", tags: ["navigation", "display"] },
  { name: "pagination", type: "component", description: "Page navigation.", tags: ["navigation", "interactive"] },

  // Blocks
  { name: "empty-state", type: "block", description: "Empty state with icon, title, description, action.", tags: ["block", "feedback"] },
  { name: "login", type: "block", description: "Login form with social auth buttons.", tags: ["block", "form", "auth"] },
  { name: "app-shell", type: "block", description: "App shell with collapsible sidebar. Mobile-responsive.", tags: ["block", "layout"] },
]

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
  {
    title: "Primitives",
    items: [
      { name: "button", href: "/docs/components/button", label: "Button" },
      { name: "input", href: "/docs/components/input", label: "Input" },
      { name: "textarea", href: "/docs/components/textarea", label: "Textarea" },
      { name: "label", href: "/docs/components/label", label: "Label" },
      { name: "separator", href: "/docs/components/separator", label: "Separator" },
      { name: "scroll-area", href: "/docs/components/scroll-area", label: "Scroll Area", badge: "New" },
      { name: "badge", href: "/docs/components/badge", label: "Badge" },
      { name: "skeleton", href: "/docs/components/skeleton", label: "Skeleton" },
      { name: "avatar", href: "/docs/components/avatar", label: "Avatar", badge: "New" },
      { name: "progress", href: "/docs/components/progress", label: "Progress", badge: "New" },
    ],
  },
  {
    title: "Form",
    items: [
      { name: "checkbox", href: "/docs/components/checkbox", label: "Checkbox" },
      { name: "switch", href: "/docs/components/switch", label: "Switch" },
      { name: "radio-group", href: "/docs/components/radio-group", label: "Radio Group" },
      { name: "select", href: "/docs/components/select", label: "Select" },
      { name: "combobox", href: "/docs/components/combobox", label: "Combobox" },
      { name: "autocomplete", href: "/docs/components/autocomplete", label: "Autocomplete", badge: "New" },
      { name: "slider", href: "/docs/components/slider", label: "Slider" },
    ],
  },
  {
    title: "Overlays",
    items: [
      { name: "dialog", href: "/docs/components/dialog", label: "Dialog" },
      { name: "alert-dialog", href: "/docs/components/alert-dialog", label: "Alert Dialog", badge: "New" },
      { name: "drawer", href: "/docs/components/drawer", label: "Drawer", badge: "New" },
      { name: "popover", href: "/docs/components/popover", label: "Popover" },
      { name: "tooltip", href: "/docs/components/tooltip", label: "Tooltip" },
      { name: "dropdown-menu", href: "/docs/components/dropdown-menu", label: "Dropdown Menu" },
      { name: "toast", href: "/docs/components/toast", label: "Toast" },
      { name: "command", href: "/docs/components/command", label: "Command" },
      { name: "collapsible", href: "/docs/components/collapsible", label: "Collapsible", badge: "New" },
    ],
  },
  {
    title: "Navigation & Data",
    items: [
      { name: "tabs", href: "/docs/components/tabs", label: "Tabs" },
      { name: "accordion", href: "/docs/components/accordion", label: "Accordion" },
      { name: "table", href: "/docs/components/table", label: "Table" },
      { name: "breadcrumb", href: "/docs/components/breadcrumb", label: "Breadcrumb" },
      { name: "pagination", href: "/docs/components/pagination", label: "Pagination" },
    ],
  },
  {
    title: "Blocks",
    items: [
      { name: "empty-state", href: "/docs/components/empty-state", label: "Empty State" },
      { name: "login", href: "/docs/components/login", label: "Login" },
      { name: "app-shell", href: "/docs/components/app-shell", label: "App Shell" },
    ],
  },
]

export function getComponent(name: string): ComponentMeta | undefined {
  return components.find((c) => c.name === name)
}
