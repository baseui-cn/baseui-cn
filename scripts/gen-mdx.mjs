#!/usr/bin/env node
/**
 * Generates MDX docs for each component.
 * Output: apps/www/content/docs/components/<name>.mdx
 */
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

await mkdir("apps/www/content/docs/components", { recursive: true }).catch(() => {})

const components = [
  {
    name: "accordion",
    title: "Accordion",
    description: "A vertically stacked set of interactive headings that each reveal a section of content.",
    link: "https://base-ui.com/react/components/accordion",
    deps: "npm install @base-ui/react",
    imports: `import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"`,
    usage: `<Accordion defaultValue={["item-1"]}>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. Built on Base UI with full ARIA and keyboard support.
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
    examples: [
      { name: "Basic", desc: "A single-open accordion. The first item is open by default." },
      { name: "Multiple", desc: "Use the `multiple` prop to allow multiple items open at once." },
      { name: "Disabled", desc: "Use the `disabled` prop on `AccordionItem` to disable individual items." },
    ],
  },
  {
    name: "alert-dialog",
    title: "Alert Dialog",
    description: "A modal dialog that interrupts the user with important content and expects a response.",
    link: "https://base-ui.com/react/components/alert-dialog",
    deps: "npm install @base-ui/react",
    imports: `import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"`,
    usage: `<AlertDialog>
  <AlertDialogTrigger>Delete account</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,
    note: "AlertDialog cannot be dismissed by clicking the backdrop. Use for destructive or irreversible actions only. Use Dialog for non-critical interactions.",
    examples: [
      { name: "Basic", desc: "A standard confirmation dialog." },
      { name: "Destructive", desc: "A destructive confirmation with a warning tone." },
    ],
  },
  {
    name: "autocomplete",
    title: "Autocomplete",
    description: "An input with a list of filtered options that appear as the user types.",
    link: "https://base-ui.com/react/components/autocomplete",
    deps: "npm install @base-ui/react lucide-react",
    imports: `import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteList,
  AutocompleteItem,
  AutocompleteEmpty,
} from "@/components/ui/autocomplete"`,
    usage: `<Autocomplete>
  <AutocompleteInput placeholder="Search..." showTrigger showClear />
  <AutocompleteContent>
    <AutocompleteList>
      <AutocompleteItem value="next">Next.js</AutocompleteItem>
      <AutocompleteItem value="remix">Remix</AutocompleteItem>
      <AutocompleteEmpty>No results.</AutocompleteEmpty>
    </AutocompleteList>
  </AutocompleteContent>
</Autocomplete>`,
    note: "Autocomplete differs from Combobox: the input is always editable and typing filters the list. Built on Base UI's Autocomplete primitive.",
    examples: [
      { name: "Basic", desc: "A simple autocomplete with static options." },
      { name: "With clear button", desc: "Use `showClear` to show a clear button." },
      { name: "Async", desc: "Fetch options dynamically as the user types." },
    ],
  },
  {
    name: "avatar",
    title: "Avatar",
    description: "An image element with a fallback for representing the user.",
    link: "https://base-ui.com/react/components/avatar",
    deps: "npm install @base-ui/react",
    imports: `import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar"`,
    usage: `<Avatar>
  <AvatarImage src="/photo.jpg" alt="Aria Chen" />
  <AvatarFallback>AC</AvatarFallback>
</Avatar>`,
    examples: [
      { name: "Basic", desc: "An avatar with image and fallback initials." },
      { name: "With badge", desc: "Show online, busy, away, or offline status." },
      { name: "Group", desc: "Stack multiple avatars with an overflow count." },
      { name: "Sizes", desc: "Avatars in sm, default, and lg sizes." },
    ],
  },
  {
    name: "badge",
    title: "Badge",
    description: "A small status descriptor for UI elements.",
    link: null,
    deps: "npm install class-variance-authority",
    imports: `import { Badge } from "@/components/ui/badge"`,
    usage: `<Badge variant="success">Active</Badge>`,
    examples: [
      { name: "Variants", desc: "All available color variants." },
      { name: "Sizes", desc: "sm, default, and lg sizes." },
      { name: "Pill", desc: "Use `shape=\"pill\"` for fully rounded badges." },
    ],
  },
  {
    name: "button",
    title: "Button",
    description: "A clickable element that triggers an action.",
    link: "https://base-ui.com/react/components/button",
    deps: "npm install @base-ui/react class-variance-authority",
    imports: `import { Button } from "@/components/ui/button"`,
    usage: `<Button variant="default">Click me</Button>`,
    examples: [
      { name: "Variants", desc: "All available button variants." },
      { name: "Sizes", desc: "From xs to lg, plus icon sizes." },
      { name: "Loading", desc: "Show a loading state while an action is in progress." },
      { name: "With icon", desc: "Combine icons with button text." },
    ],
  },
  {
    name: "checkbox",
    title: "Checkbox",
    description: "A control that allows the user to toggle between checked and unchecked states.",
    link: "https://base-ui.com/react/components/checkbox",
    deps: "npm install @base-ui/react lucide-react",
    imports: `import { Checkbox } from "@/components/ui/checkbox"`,
    usage: `<Checkbox />`,
    examples: [
      { name: "Basic", desc: "A simple checkbox." },
      { name: "With label", desc: "Pair with a Field and Label." },
      { name: "Indeterminate", desc: "Use the indeterminate state for partial selections." },
      { name: "Disabled", desc: "A disabled checkbox." },
    ],
  },
  {
    name: "collapsible",
    title: "Collapsible",
    description: "An interactive component which expands/collapses a panel.",
    link: "https://base-ui.com/react/components/collapsible",
    deps: "npm install @base-ui/react",
    imports: `import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"`,
    usage: `<Collapsible>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Content here.</CollapsibleContent>
</Collapsible>`,
    note: "Use Accordion for multiple collapsible panels with shared state. Collapsible is for a single standalone section.",
    examples: [
      { name: "Basic", desc: "A simple collapsible." },
      { name: "Controlled", desc: "Control open state externally." },
    ],
  },
  {
    name: "combobox",
    title: "Combobox",
    description: "An input combined with a listbox for selecting from a list of options.",
    link: "https://base-ui.com/react/components/combobox",
    deps: "npm install @base-ui/react lucide-react",
    imports: `import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox"`,
    usage: `<Combobox>
  <ComboboxInput placeholder="Select framework..." showTrigger />
  <ComboboxContent>
    <ComboboxList>
      <ComboboxItem value="next">Next.js</ComboboxItem>
      <ComboboxItem value="remix">Remix</ComboboxItem>
      <ComboboxEmpty>No results.</ComboboxEmpty>
    </ComboboxList>
  </ComboboxContent>
</Combobox>`,
    examples: [
      { name: "Basic", desc: "A simple combobox." },
      { name: "Multi-select with chips", desc: "Use `ComboboxChips` for multi-select." },
      { name: "With groups", desc: "Group options with `ComboboxGroup`." },
      { name: "Async", desc: "Load options asynchronously." },
    ],
  },
  {
    name: "dialog",
    title: "Dialog",
    description: "A window overlaid on either the primary window or another dialog window.",
    link: "https://base-ui.com/react/components/dialog",
    deps: "npm install @base-ui/react lucide-react class-variance-authority",
    imports: `import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"`,
    usage: `<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description.</DialogDescription>
    </DialogHeader>
    <DialogBody>Content here.</DialogBody>
    <DialogFooter showCloseButton>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
    examples: [
      { name: "Basic", desc: "A standard dialog." },
      { name: "Sizes", desc: "Dialog in xs through 8xl sizes." },
      { name: "Fullscreen", desc: "Use `variant=\"fullscreen\"` for a full-screen dialog." },
      { name: "No close button", desc: "Use `showCloseButton={false}` to hide the X button." },
      { name: "Scrollable", desc: "A dialog with scrollable content." },
    ],
  },
  {
    name: "drawer",
    title: "Drawer",
    description: "A panel that slides in from the edge of the screen.",
    link: "https://base-ui.com/react/components/drawer",
    deps: "npm install @base-ui/react",
    imports: `import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"`,
    usage: `<Drawer>
  <DrawerTrigger>Open Drawer</DrawerTrigger>
  <DrawerContent side="right">
    <DrawerHeader>
      <DrawerTitle>Settings</DrawerTitle>
      <DrawerDescription>Manage your preferences.</DrawerDescription>
    </DrawerHeader>
    <div className="flex-1 p-6">Content here.</div>
    <DrawerFooter>
      <DrawerClose>Close</DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>`,
    note: "Built on Base UI Drawer (stable v1.3.0, March 2026). All other Base UI overlays — Select, Combobox, Tooltip — work correctly inside it, sharing the same portal system.",
    examples: [
      { name: "Right", desc: "Default — slides in from the right." },
      { name: "Bottom sheet", desc: "Use `side=\"bottom\"` for a mobile bottom sheet." },
      { name: "Left", desc: "Slides in from the left." },
      { name: "With form", desc: "A drawer containing a form." },
      { name: "Nested Select", desc: "Select inside a Drawer — no z-index issues." },
    ],
  },
  {
    name: "dropdown-menu",
    title: "Dropdown Menu",
    description: "Displays a menu to the user triggered by a button.",
    link: "https://base-ui.com/react/components/menu",
    deps: "npm install @base-ui/react lucide-react",
    imports: `import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"`,
    usage: `<DropdownMenu>
  <DropdownMenuTrigger>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
    examples: [
      { name: "Basic", desc: "A standard dropdown menu." },
      { name: "With shortcuts", desc: "Show keyboard shortcuts with `DropdownMenuShortcut`." },
      { name: "Checkboxes", desc: "Use `DropdownMenuCheckboxItem` for toggleable items." },
      { name: "Radio group", desc: "Use `DropdownMenuRadioGroup` for single-select items." },
      { name: "Submenu", desc: "Nested menus with `DropdownMenuSub`." },
    ],
  },
  {
    name: "field",
    title: "Field",
    description: "A form field layout component with label, description, and error support.",
    link: null,
    deps: "npm install class-variance-authority",
    imports: `import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSet,
  FieldLegend,
  FieldContent,
  FieldTitle,
  FieldSeparator,
} from "@/components/ui/field"`,
    usage: `<Field>
  <FieldLabel>Email</FieldLabel>
  <Input type="email" placeholder="you@example.com" />
  <FieldDescription>We'll never share your email.</FieldDescription>
</Field>`,
    examples: [
      { name: "Vertical", desc: "Default vertical layout." },
      { name: "Horizontal", desc: "Use `orientation=\"horizontal\"` for inline layout." },
      { name: "With error", desc: "Show validation errors with `FieldError`." },
      { name: "Fieldset", desc: "Group multiple fields with `FieldSet`." },
    ],
  },
  {
    name: "input",
    title: "Input",
    description: "A text input field.",
    link: "https://base-ui.com/react/components/input",
    deps: "npm install @base-ui/react",
    imports: `import { Input } from "@/components/ui/input"`,
    usage: `<Input placeholder="Enter text..." />`,
    examples: [
      { name: "Basic", desc: "A simple text input." },
      { name: "Sizes", desc: "sm, md, and lg variants." },
      { name: "Disabled", desc: "A disabled input." },
      { name: "With Field", desc: "Combine with Field for a labeled input with error handling." },
    ],
  },
  {
    name: "input-group",
    title: "Input Group",
    description: "A composite input with addons, icons, and action buttons.",
    link: null,
    deps: "",
    imports: `import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"`,
    usage: `<InputGroup>
  <InputGroupAddon align="inline-start">
    <InputGroupText>https://</InputGroupText>
  </InputGroupAddon>
  <InputGroupInput placeholder="example.com" />
</InputGroup>`,
    examples: [
      { name: "With prefix", desc: "Text or icon prefix." },
      { name: "With suffix button", desc: "Action button at the end." },
      { name: "With both addons", desc: "Prefix and suffix together." },
      { name: "Textarea", desc: "Use `InputGroupTextarea` for multiline input." },
    ],
  },
  {
    name: "popover",
    title: "Popover",
    description: "Displays rich content in a portal, triggered by a button.",
    link: "https://base-ui.com/react/components/popover",
    deps: "npm install @base-ui/react",
    imports: `import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
} from "@/components/ui/popover"`,
    usage: `<Popover>
  <PopoverTrigger>Open</PopoverTrigger>
  <PopoverContent>
    <PopoverHeader>
      <PopoverTitle>Settings</PopoverTitle>
      <PopoverDescription>Adjust your preferences.</PopoverDescription>
    </PopoverHeader>
  </PopoverContent>
</Popover>`,
    examples: [
      { name: "Basic", desc: "A simple popover." },
      { name: "With form", desc: "A popover containing a form." },
      { name: "Placement", desc: "Popover positioned on different sides." },
    ],
  },
  {
    name: "progress",
    title: "Progress",
    description: "Displays an indicator showing the completion progress of a task.",
    link: "https://base-ui.com/react/components/progress",
    deps: "npm install @base-ui/react",
    imports: `import {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"`,
    usage: `<Progress value={65}>
  <ProgressLabel>Uploading</ProgressLabel>
  <ProgressValue />
</Progress>`,
    examples: [
      { name: "Basic", desc: "A simple progress bar." },
      { name: "With label and value", desc: "Show label and percentage." },
      { name: "Indeterminate", desc: "Omit `value` for an indeterminate state." },
    ],
  },
  {
    name: "radio-group",
    title: "Radio Group",
    description: "A set of checkable buttons where no more than one can be checked at a time.",
    link: "https://base-ui.com/react/components/radio",
    deps: "npm install @base-ui/react",
    imports: `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"`,
    usage: `<RadioGroup defaultValue="default">
  <RadioGroupItem value="default" />
  <RadioGroupItem value="comfortable" />
  <RadioGroupItem value="compact" />
</RadioGroup>`,
    examples: [
      { name: "Basic", desc: "A simple radio group." },
      { name: "With labels", desc: "Pair with Field and Label." },
      { name: "Horizontal", desc: "Horizontal layout." },
      { name: "Disabled", desc: "Disabled items." },
    ],
  },
  {
    name: "select",
    title: "Select",
    description: "Displays a list of options for the user to pick from — triggered by a button.",
    link: "https://base-ui.com/react/components/select",
    deps: "npm install @base-ui/react lucide-react",
    imports: `import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select"`,
    usage: `<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select a framework" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Frameworks</SelectLabel>
      <SelectItem value="next">Next.js</SelectItem>
      <SelectItem value="remix">Remix</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`,
    examples: [
      { name: "Basic", desc: "A simple select." },
      { name: "Controlled", desc: "A controlled select." },
      { name: "With groups", desc: "Group options with `SelectGroup`." },
      { name: "Sizes", desc: "default and sm sizes." },
      { name: "Disabled", desc: "A disabled select and disabled items." },
    ],
  },
  {
    name: "separator",
    title: "Separator",
    description: "Visually or semantically separates content.",
    link: "https://base-ui.com/react/components/separator",
    deps: "npm install @base-ui/react",
    imports: `import { Separator } from "@/components/ui/separator"`,
    usage: `<Separator />`,
    examples: [
      { name: "Horizontal", desc: "A horizontal separator." },
      { name: "Vertical", desc: "Use `orientation=\"vertical\"`." },
    ],
  },
  {
    name: "slider",
    title: "Slider",
    description: "An input where the user selects a value from within a given range.",
    link: "https://base-ui.com/react/components/slider",
    deps: "npm install @base-ui/react",
    imports: `import { Slider } from "@/components/ui/slider"`,
    usage: `<Slider defaultValue={[50]} max={100} step={1} />`,
    examples: [
      { name: "Basic", desc: "A simple slider." },
      { name: "Range", desc: "A range slider with two thumbs." },
      { name: "With steps", desc: "Slider with discrete steps." },
      { name: "Vertical", desc: "A vertical slider." },
      { name: "Disabled", desc: "A disabled slider." },
    ],
  },
  {
    name: "switch",
    title: "Switch",
    description: "A control that allows the user to toggle between checked and not checked.",
    link: "https://base-ui.com/react/components/switch",
    deps: "npm install @base-ui/react",
    imports: `import { Switch } from "@/components/ui/switch"`,
    usage: `<Switch label="Email notifications" />`,
    examples: [
      { name: "Basic", desc: "A simple switch." },
      { name: "With label and description", desc: "Descriptive switch." },
      { name: "Disabled", desc: "A disabled switch." },
      { name: "Controlled", desc: "A controlled switch." },
    ],
  },
  {
    name: "tabs",
    title: "Tabs",
    description: "A set of layered sections of content that are displayed one at a time.",
    link: "https://base-ui.com/react/components/tabs",
    deps: "npm install @base-ui/react",
    imports: `import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"`,
    usage: `<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account settings.</TabsContent>
  <TabsContent value="password">Password settings.</TabsContent>
</Tabs>`,
    examples: [
      { name: "Basic", desc: "Standard tab navigation." },
      { name: "Vertical", desc: "Vertical tab orientation." },
      { name: "Pill style", desc: "Tab triggers styled as pills." },
    ],
  },
  {
    name: "textarea",
    title: "Textarea",
    description: "A multi-line text input field.",
    link: null,
    deps: "",
    imports: `import { Textarea } from "@/components/ui/textarea"`,
    usage: `<Textarea placeholder="Write something..." />`,
    examples: [
      { name: "Basic", desc: "A simple textarea." },
      { name: "Disabled", desc: "A disabled textarea." },
      { name: "With Field", desc: "Combine with Field for labeling and errors." },
      { name: "Auto-resize", desc: "Grows with content using `field-sizing-content`." },
    ],
  },
  {
    name: "tooltip",
    title: "Tooltip",
    description: "A popup that displays information related to an element when focused or hovered.",
    link: "https://base-ui.com/react/components/tooltip",
    deps: "npm install @base-ui/react",
    imports: `import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"`,
    usage: `<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>Save document</TooltipContent>
  </Tooltip>
</TooltipProvider>`,
    note: "Wrap multiple tooltips in one `TooltipProvider` for instant switching between them with no delay gap.",
    examples: [
      { name: "Basic", desc: "A simple tooltip." },
      { name: "Placement", desc: "Tooltips on all four sides." },
      { name: "With shortcut", desc: "Include a keyboard shortcut." },
      { name: "Delay group", desc: "Multiple tooltips sharing one provider." },
    ],
  },
]

for (const comp of components) {
  const mdx = `---
title: ${comp.title}
description: ${comp.description}
component: true${comp.link ? `\nlinks:\n  doc: ${comp.link}` : ""}
---

<ComponentPreview name="${comp.name}-demo" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>

<TabsContent value="cli">

\`\`\`bash
npx baseui-cn add ${comp.name}
\`\`\`

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install dependencies</Step>

${comp.deps ? `\`\`\`bash\n${comp.deps}\n\`\`\`` : "_No additional dependencies required._"}

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="${comp.name}" title="components/ui/${comp.name}.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

\`\`\`tsx
${comp.imports}
\`\`\`

\`\`\`tsx
${comp.usage}
\`\`\`
${comp.note ? `\n> **Note:** ${comp.note}\n` : ""}
## Examples
${comp.examples.map(ex => `
### ${ex.name}

${ex.desc}

<ComponentPreview name="${comp.name}-${ex.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}" />`).join("\n")}
`

  await writeFile(
    join("apps/www/content/docs/components", `${comp.name}.mdx`),
    mdx
  )
  console.log(`✓ ${comp.name}.mdx`)
}

console.log(`\nGenerated ${components.length} MDX files.`)
