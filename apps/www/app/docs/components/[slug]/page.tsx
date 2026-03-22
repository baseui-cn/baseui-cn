import fs from "fs"
import path from "path"
import { notFound } from "next/navigation"
import { getComponent, components } from "@/lib/registry"
import { CodeBlock } from "@/components/docs/code-block"
import { PropsTable } from "@/components/docs/props-table"
import { ComponentPreviewWrapper } from "@/components/docs/component-preview-wrapper"
import type { Metadata } from "next"
import { InstallTabs } from "@/components/docs/install-tabs"

export function generateStaticParams() {
  return components.map((c) => ({ slug: c.name }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const comp = getComponent(slug)
  if (!comp) return {}
  return {
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    description: comp.description,
  }
}

// ── Per-component docs ─────────────────────────────────────────────────────

const componentDocs: Record<string, {
  addCmd: string
  manualDeps: string
  usage: string
  primitive?: string
  renderNote?: string
  notes?: string
  examples?: Array<{ title: string; description: string; code: string }>
  props?: Array<{ name: string; type: string; default?: string; description: string; required?: boolean }>
}> = {
  button: {
    addCmd: "npx baseui-cn add button",
    manualDeps: "npm install @base-ui/react class-variance-authority",
    usage: `import { Button } from "@/components/ui/button"

export function Example() {
  return <Button variant="default">Click me</Button>
}`,
    examples: [
      {
        title: "Variants",
        description: "All available button variants.",
        code: `<div className="flex flex-wrap gap-2">
  <Button variant="default">Default</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="destructive">Destructive</Button>
  <Button variant="link">Link</Button>
</div>`,
      },
      {
        title: "Sizes",
        description: "Buttons in all available sizes.",
        code: `<div className="flex items-center gap-2">
  <Button size="xs">Extra Small</Button>
  <Button size="sm">Small</Button>
  <Button size="default">Default</Button>
  <Button size="lg">Large</Button>
  <Button size="icon"><PlusIcon /></Button>
</div>`,
      },
    ],
    props: [
      { name: "variant", type: '"default" | "secondary" | "outline" | "ghost" | "destructive" | "link"', default: '"default"', description: "Visual style" },
      { name: "size", type: '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"', default: '"default"', description: "Size variant" },
      { name: "disabled", type: "boolean", default: "false", description: "Disables the button" },
    ],
  },
  input: {
    addCmd: "npx baseui-cn add input",
    manualDeps: "npm install @base-ui/react",
    usage: `import { Input } from "@/components/ui/input"

export function Example() {
  return <Input label="Email" placeholder="you@example.com" type="email" />
}`,
    examples: [
      {
        title: "With label and helper text",
        description: "Input with a label and supporting description.",
        code: `<Input label="Username" placeholder="johndoe" helperText="Only letters and numbers." />`,
      },
      {
        title: "Error state",
        description: "Input showing a validation error.",
        code: `<Input label="Password" type="password" error="Password must be at least 8 characters." />`,
      },
    ],
    props: [
      { name: "label", type: "string", description: "Label rendered above the input" },
      { name: "helperText", type: "string", description: "Helper text shown below" },
      { name: "error", type: "string", description: "Error message — sets aria-invalid too" },
    ],
  },
  drawer: {
    addCmd: "npx baseui-cn add drawer",
    manualDeps: "npm install @base-ui/react",
    primitive: "Base UI Drawer (stable v1.3.0+)",
    renderNote: "DrawerTrigger and DrawerClose use the render prop — not asChild.",
    usage: `import {
  Drawer, DrawerTrigger, DrawerContent,
  DrawerHeader, DrawerTitle, DrawerDescription,
  DrawerFooter, DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline">Open</Button>} />
      <DrawerContent side="right">
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerDescription>Manage your preferences.</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 p-6">Content here.</div>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline" className="w-full">Close</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}`,
    examples: [
      {
        title: "Bottom sheet",
        description: "Drawer from the bottom — ideal for mobile.",
        code: `<Drawer>
  <DrawerTrigger render={<Button variant="outline">Open sheet</Button>} />
  <DrawerContent side="bottom">
    <DrawerHeader>
      <DrawerTitle>Share</DrawerTitle>
    </DrawerHeader>
    <div className="p-6">Sheet content here.</div>
  </DrawerContent>
</Drawer>`,
      },
      {
        title: "With nested Select",
        description: "Select works inside Drawer — same Base UI portal system.",
        code: `<Drawer>
  <DrawerTrigger render={<Button variant="outline">Open</Button>} />
  <DrawerContent side="right">
    <div className="p-6">
      <Select>
        <SelectTrigger placeholder="Choose theme..." />
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </DrawerContent>
</Drawer>`,
      },
    ],
    notes: "Built on Base UI Drawer stable (v1.3.0+, March 2026). Select, Combobox, and Tooltip all work correctly inside it — same portal system.",
    props: [
      { name: "side", type: '"right" | "left" | "bottom" | "top"', default: '"right"', description: "Which edge the drawer slides from" },
    ],
  },
  dialog: {
    addCmd: "npx baseui-cn add dialog",
    manualDeps: "npm install @base-ui/react",
    primitive: "Base UI Dialog",
    renderNote: "DialogTrigger and DialogClose use the render prop — not asChild.",
    usage: `import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Open</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}`,
    props: [],
  },
  avatar: {
    addCmd: "npx baseui-cn add avatar",
    manualDeps: "npm install @base-ui/react",
    primitive: "Base UI Avatar",
    usage: `import {
  Avatar, AvatarImage, AvatarFallback,
  AvatarBadge, AvatarGroup, AvatarGroupCount,
} from "@/components/ui/avatar"

export function Example() {
  return (
    <Avatar>
      <AvatarImage src="/photo.jpg" alt="Aria Chen" />
      <AvatarFallback>AC</AvatarFallback>
    </Avatar>
  )
}`,
    examples: [
      {
        title: "With status badge",
        description: "Show online, busy, away, or offline status.",
        code: `<Avatar>
  <AvatarFallback>MO</AvatarFallback>
  <AvatarBadge className="bg-green-500" />
</Avatar>`,
      },
      {
        title: "Avatar group",
        description: "Stack multiple avatars with an overflow count.",
        code: `<AvatarGroup>
  <Avatar><AvatarFallback>AC</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>MO</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>PN</AvatarFallback></Avatar>
  <AvatarGroupCount>+4</AvatarGroupCount>
</AvatarGroup>`,
      },
    ],
    props: [
      { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Avatar size" },
    ],
  },
  badge: {
    addCmd: "npx baseui-cn add badge",
    manualDeps: "npm install @base-ui/react class-variance-authority",
    usage: `import { Badge } from "@/components/ui/badge"

export function Example() {
  return <Badge variant="success">Active</Badge>
}`,
    examples: [
      {
        title: "All variants",
        description: "Every color variant available.",
        code: `<div className="flex flex-wrap gap-2">
  <Badge>Default</Badge>
  <Badge variant="secondary">Secondary</Badge>
  <Badge variant="outline">Outline</Badge>
  <Badge variant="destructive">Destructive</Badge>
  <Badge variant="success">Success</Badge>
  <Badge variant="warning">Warning</Badge>
  <Badge variant="info">Info</Badge>
</div>`,
      },
      {
        title: "Pill shape",
        description: "Fully rounded pill variant.",
        code: `<Badge shape="pill" variant="success">Active</Badge>`,
      },
    ],
    props: [
      { name: "variant", type: '"default" | "secondary" | "outline" | "destructive" | "success" | "warning" | "info" | "ghost"', default: '"default"', description: "Color variant" },
      { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Size" },
      { name: "shape", type: '"default" | "pill"', default: '"default"', description: "Border radius style" },
    ],
  },
  select: {
    addCmd: "npx baseui-cn add select",
    manualDeps: "npm install @base-ui/react",
    primitive: "Base UI Select",
    usage: `import {
  Select, SelectTrigger, SelectContent,
  SelectItem, SelectGroup, SelectLabel,
} from "@/components/ui/select"

export function Example() {
  return (
    <Select>
      <SelectTrigger placeholder="Select a framework..." className="w-64" />
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Frameworks</SelectLabel>
          <SelectItem value="next">Next.js</SelectItem>
          <SelectItem value="remix">Remix</SelectItem>
          <SelectItem value="astro">Astro</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}`,
    props: [],
  },
  combobox: {
    addCmd: "npx baseui-cn add combobox",
    manualDeps: "npm install @base-ui/react",
    primitive: "Base UI Combobox",
    notes: "No cmdk dependency. Works inside Drawer and Dialog without z-index conflicts.",
    usage: `import { Combobox } from "@/components/ui/combobox"

const options = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
]

export function Example() {
  const [value, setValue] = React.useState("")
  return (
    <Combobox
      options={options}
      value={value}
      onValueChange={setValue}
      placeholder="Select framework..."
    />
  )
}`,
    props: [
      { name: "options", type: "{ value: string; label: string; disabled?: boolean }[]", required: true, description: "Options to display" },
      { name: "value", type: "string", description: "Controlled value" },
      { name: "onValueChange", type: "(value: string) => void", description: "Called on selection" },
      { name: "placeholder", type: "string", default: '"Select an option..."', description: "Trigger placeholder" },
      { name: "searchPlaceholder", type: "string", default: '"Search..."', description: "Search placeholder" },
      { name: "emptyText", type: "string", default: '"No results found."', description: "Empty state text" },
    ],
  },
  tooltip: {
    addCmd: "npx baseui-cn add tooltip",
    manualDeps: "npm install @base-ui/react",
    primitive: "Base UI Tooltip",
    renderNote: "TooltipTrigger uses the render prop — not asChild.",
    usage: `import {
  TooltipProvider, Tooltip,
  TooltipTrigger, TooltipContent,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
        <TooltipContent>Save document (⌘S)</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}`,
    notes: "Wrap multiple tooltips in one TooltipProvider for instant switching between them — no delay gap.",
    props: [
      { name: "side", type: '"top" | "bottom" | "left" | "right"', default: '"top"', description: "Placement side" },
      { name: "showArrow", type: "boolean", default: "true", description: "Show directional arrow" },
    ],
  },
  tabs: {
    addCmd: "npx baseui-cn add tabs",
    manualDeps: "npm install @base-ui/react",
    primitive: "Base UI Tabs",
    usage: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export function Example() {
  return (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account settings.</TabsContent>
      <TabsContent value="password">Password settings.</TabsContent>
    </Tabs>
  )
}`,
    props: [],
  },
  accordion: {
    addCmd: "npx baseui-cn add accordion",
    manualDeps: "npm install @base-ui/react",
    primitive: "Base UI Accordion",
    usage: `import {
  Accordion, AccordionItem,
  AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion"

export function Example() {
  return (
    <Accordion>
      <AccordionItem value="q1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. Full ARIA and keyboard support via Base UI.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}`,
    props: [],
  },
  checkbox: {
    addCmd: "npx baseui-cn add checkbox",
    manualDeps: "npm install @base-ui/react",
    primitive: "Base UI Checkbox",
    usage: `import { Checkbox } from "@/components/ui/checkbox"

export function Example() {
  return (
    <Checkbox
      label="Accept terms of service"
      description="You agree to our terms."
    />
  )
}`,
    props: [
      { name: "label", type: "string", description: "Label text" },
      { name: "description", type: "string", description: "Supporting description" },
    ],
  },
  switch: {
    addCmd: "npx baseui-cn add switch",
    manualDeps: "npm install @base-ui/react",
    primitive: "Base UI Switch",
    usage: `import { Switch } from "@/components/ui/switch"

export function Example() {
  return (
    <Switch
      label="Email notifications"
      description="Receive updates via email"
    />
  )
}`,
    props: [
      { name: "label", type: "string", description: "Label text" },
      { name: "description", type: "string", description: "Description below label" },
    ],
  },
  "radio-group": {
    addCmd: "npx baseui-cn add radio-group",
    manualDeps: "npm install @base-ui/react",
    primitive: "Base UI RadioGroup + Radio",
    usage: `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function Example() {
  return (
    <RadioGroup label="Select a plan" defaultValue="pro">
      <RadioGroupItem value="free" label="Free" description="Up to 3 projects" />
      <RadioGroupItem value="pro" label="Pro" description="Unlimited projects" />
    </RadioGroup>
  )
}`,
    props: [],
  },
  progress: {
    addCmd: "npx baseui-cn add progress",
    manualDeps: "npm install @base-ui/react",
    primitive: "Base UI Progress",
    usage: `import { Progress } from "@/components/ui/progress"

export function Example() {
  return <Progress value={65} label="Uploading" showValue />
}`,
    examples: [
      {
        title: "Indeterminate",
        description: "Omit value for an indeterminate loading state.",
        code: `<Progress label="Loading..." />`,
      },
    ],
    props: [
      { name: "value", type: "number | null", description: "0–100. Omit for indeterminate" },
      { name: "label", type: "string", description: "Label above the bar" },
      { name: "showValue", type: "boolean", default: "false", description: "Show percentage" },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Bar height" },
    ],
  },
  "dropdown-menu": {
    addCmd: "npx baseui-cn add dropdown-menu",
    manualDeps: "npm install @base-ui/react",
    primitive: "Base UI Menu",
    renderNote: "DropdownMenuTrigger uses the render prop — not asChild.",
    usage: `import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">Open</Button>} />
      <DropdownMenuContent>
        <DropdownMenuItem>Edit <DropdownMenuShortcut>⌘E</DropdownMenuShortcut></DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`,
    props: [],
  },
  toast: {
    addCmd: "npx baseui-cn add toast",
    manualDeps: "npm install @base-ui/react class-variance-authority",
    primitive: "Base UI Toast",
    usage: `// 1. Wrap your app once in layout.tsx
import { ToastProvider } from "@/components/ui/toast"
export default function Layout({ children }) {
  return <ToastProvider>{children}</ToastProvider>
}

// 2. Use anywhere
import { useToast, Toast } from "@/components/ui/toast"

export function Example() {
  const { add } = useToast()
  return (
    <Button onClick={() =>
      add(<Toast title="Saved!" description="Changes saved." />, { timeout: 3000 })
    }>
      Save
    </Button>
  )
}`,
    props: [
      { name: "title", type: "string", description: "Toast heading" },
      { name: "description", type: "string", description: "Supporting text" },
      { name: "variant", type: '"default" | "success" | "error" | "warning"', default: '"default"', description: "Color variant" },
    ],
  },
  "alert-dialog": {
    addCmd: "npx baseui-cn add alert-dialog",
    manualDeps: "npm install @base-ui/react",
    primitive: "Base UI AlertDialog",
    renderNote: "AlertDialogTrigger and AlertDialogClose use the render prop — not asChild.",
    notes: "Cannot be dismissed by clicking the backdrop. Use for destructive or irreversible actions only.",
    usage: `import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent,
  AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogClose,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive">Delete</Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button variant="destructive">Delete</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}`,
    props: [],
  },
  collapsible: {
    addCmd: "npx baseui-cn add collapsible",
    manualDeps: "npm install @base-ui/react",
    primitive: "Base UI Collapsible",
    usage: `import {
  Collapsible, CollapsibleTrigger, CollapsibleContent,
} from "@/components/ui/collapsible"

export function Example() {
  return (
    <Collapsible className="rounded-lg border border-border px-4">
      <CollapsibleTrigger>Can I use this in my project?</CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pb-4">
          Yes — run npx baseui-cn add collapsible and the file is yours.
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}`,
    notes: "Use Accordion for multiple collapsible panels with shared state. Collapsible is for a single standalone section.",
    props: [],
  },
  skeleton: {
    addCmd: "npx baseui-cn add skeleton",
    manualDeps: "",
    usage: `import { Skeleton } from "@/components/ui/skeleton"

export function Example() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  )
}`,
    props: [],
  },
  separator: {
    addCmd: "npx baseui-cn add separator",
    manualDeps: "",
    usage: `import { Separator } from "@/components/ui/separator"

export function Example() {
  return (
    <div>
      <p>Above</p>
      <Separator className="my-4" />
      <p>Below</p>
    </div>
  )
}`,
    props: [
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Direction" },
      { name: "decorative", type: "boolean", default: "true", description: "When true, hidden from accessibility tree" },
    ],
  },
  label: {
    addCmd: "npx baseui-cn add label",
    manualDeps: "npm install @base-ui/react",
    primitive: "Base UI Field.Label",
    usage: `import { Label } from "@/components/ui/label"

export function Example() {
  return <Label htmlFor="email" required>Email address</Label>
}`,
    props: [
      { name: "required", type: "boolean", default: "false", description: "Shows a red asterisk" },
    ],
  },
  textarea: {
    addCmd: "npx baseui-cn add textarea",
    manualDeps: "npm install @base-ui/react",
    primitive: "Base UI Field",
    usage: `import { Textarea } from "@/components/ui/textarea"

export function Example() {
  return (
    <Textarea
      label="Message"
      placeholder="Write something..."
      helperText="Max 500 characters."
      autoResize
    />
  )
}`,
    props: [
      { name: "label", type: "string", description: "Label above textarea" },
      { name: "helperText", type: "string", description: "Helper text below" },
      { name: "error", type: "string", description: "Error message" },
      { name: "autoResize", type: "boolean", default: "false", description: "Grows with content" },
    ],
  },
  popover: {
    addCmd: "npx baseui-cn add popover",
    manualDeps: "npm install @base-ui/react",
    primitive: "Base UI Popover",
    renderNote: "PopoverTrigger uses the render prop — not asChild.",
    usage: `import {
  Popover, PopoverTrigger, PopoverContent,
  PopoverHeading, PopoverDescription,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline">Open</Button>} />
      <PopoverContent>
        <PopoverHeading>Settings</PopoverHeading>
        <PopoverDescription>Adjust your preferences.</PopoverDescription>
      </PopoverContent>
    </Popover>
  )
}`,
    props: [
      { name: "side", type: '"top" | "bottom" | "left" | "right"', default: '"bottom"', description: "Preferred side" },
      { name: "align", type: '"start" | "center" | "end"', default: '"center"', description: "Alignment" },
      { name: "showArrow", type: "boolean", default: "true", description: "Show directional arrow" },
    ],
  },
  table: {
    addCmd: "npx baseui-cn add table",
    manualDeps: "",
    usage: `import {
  Table, TableHeader, TableBody,
  TableHead, TableRow, TableCell,
} from "@/components/ui/table"

export function Example() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Aria Chen</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}`,
    props: [],
  },
  breadcrumb: {
    addCmd: "npx baseui-cn add breadcrumb",
    manualDeps: "",
    usage: `import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem,
  BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function Example() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbLink href="/settings">Settings</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbPage>Profile</BreadcrumbPage></BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}`,
    props: [],
  },
  pagination: {
    addCmd: "npx baseui-cn add pagination",
    manualDeps: "",
    usage: `import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationPrevious, PaginationNext,
} from "@/components/ui/pagination"

export function Example() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
        <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
        <PaginationItem><PaginationNext href="#" /></PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}`,
    props: [],
  },
  "empty-state": {
    addCmd: "npx baseui-cn add empty-state",
    manualDeps: "",
    usage: `import { EmptyState, EmptyStateIcons } from "@/components/ui/blocks"
import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <EmptyState
      icon={EmptyStateIcons.inbox}
      title="No messages yet"
      description="When you receive messages, they'll appear here."
      action={<Button size="sm">Compose</Button>}
    />
  )
}`,
    props: [
      { name: "title", type: "string", required: true, description: "Main heading" },
      { name: "description", type: "string", description: "Supporting text" },
      { name: "icon", type: "React.ReactNode", description: "Icon above title" },
      { name: "action", type: "React.ReactNode", description: "CTA button or link" },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Controls padding" },
    ],
  },
  login: {
    addCmd: "npx baseui-cn add login",
    manualDeps: "",
    usage: `import { LoginBlock } from "@/components/ui/blocks"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginBlock
        onSubmit={async ({ email, password }) => {
          await signIn(email, password)
        }}
        onGoogleLogin={() => signInWithGoogle()}
        signUpHref="/register"
      />
    </div>
  )
}`,
    props: [
      { name: "onSubmit", type: "(data: { email: string; password: string }) => void | Promise<void>", description: "Form submit handler" },
      { name: "onGoogleLogin", type: "() => void", description: "Shows Google button when provided" },
      { name: "onGithubLogin", type: "() => void", description: "Shows GitHub button when provided" },
      { name: "isLoading", type: "boolean", default: "false", description: "Loading state on submit" },
      { name: "error", type: "string", description: "Global error shown above form" },
    ],
  },
  command: {
    addCmd: "npx baseui-cn add command",
    manualDeps: "npm install @base-ui/react",
    notes: "No cmdk dependency. Built on Base UI Dialog + native React state. Arrow key navigation built in.",
    usage: `import { Command } from "@/components/ui/command"

export function Example() {
  return (
    <Command
      items={[
        { id: "1", label: "New File", shortcut: "⌘N", group: "File" },
        { id: "2", label: "Open",     shortcut: "⌘O", group: "File" },
        { id: "3", label: "Settings",              group: "View" },
      ]}
      placeholder="Type a command..."
    />
  )
}`,
    props: [
      { name: "items", type: "CommandItem[]", required: true, description: "Array of command items" },
      { name: "placeholder", type: "string", description: "Search input placeholder" },
      { name: "emptyText", type: "string", description: "Text when no results" },
      { name: "onSelect", type: "(item: CommandItem) => void", description: "Called when item is selected" },
    ],
  },
  autocomplete: {
    addCmd: "npx baseui-cn add autocomplete",
    manualDeps: "npm install @base-ui/react",
    primitive: "Base UI Autocomplete",
    usage: `import { Autocomplete } from "@/components/ui/autocomplete"

const countries = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
]

export function Example() {
  const [value, setValue] = React.useState("")
  return (
    <Autocomplete
      options={countries}
      value={value}
      onValueChange={setValue}
      label="Country"
      placeholder="Search countries..."
    />
  )
}`,
    notes: "Differs from Combobox: the input is always visible and editable. Type to filter, select to fill.",
    props: [
      { name: "options", type: "{ value: string; label: string; disabled?: boolean }[]", required: true, description: "Options" },
      { name: "value", type: "string", description: "Controlled value" },
      { name: "onValueChange", type: "(value: string) => void", description: "Called on selection" },
      { name: "placeholder", type: "string", description: "Input placeholder" },
    ],
  },
  "app-shell": {
    addCmd: "npx baseui-cn add app-shell",
    manualDeps: "npm install @base-ui/react",
    notes: "Mobile sidebar uses Base UI Drawer — overlays inside the page work correctly. Desktop sidebar collapses to icon-only.",
    usage: `import { AppShell } from "@/components/ui/blocks"

const nav = [
  { id: "dashboard", label: "Dashboard", href: "/" },
  { id: "settings",  label: "Settings",  href: "/settings" },
]

export default function Layout({ children }) {
  return (
    <AppShell
      nav={nav}
      activeId="dashboard"
      logo={<span className="font-bold text-sm">MyApp</span>}
    >
      {children}
    </AppShell>
  )
}`,
    props: [
      { name: "nav", type: "NavItem[]", required: true, description: "Navigation items" },
      { name: "activeId", type: "string", description: "Currently active item ID" },
      { name: "logo", type: "React.ReactNode", description: "Logo content" },
      { name: "header", type: "React.ReactNode", description: "Top header content" },
      { name: "defaultCollapsed", type: "boolean", default: "false", description: "Start collapsed on desktop" },
    ],
  },
}

// ── Page ───────────────────────────────────────────────────────────────────

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const comp = getComponent(slug)
  if (!comp) notFound()

  const doc = componentDocs[slug] ?? {
    addCmd: `npx baseui-cn add ${slug}`,
    manualDeps: "npm install @base-ui/react",
    usage: `import { } from "@/components/ui/${slug}"`,
  }

  // Read actual component source for the Manual install tab
  let componentSource = doc.usage
  try {
    componentSource = fs.readFileSync(
      path.join(process.cwd(), "components/ui", `${slug}.tsx`),
      "utf-8"
    )
  } catch {
    // file not found — fall back to usage snippet
  }

  const title = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())

  return (
    <div className="flex flex-col gap-12 animate-fade-in">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            {comp.type === "block" ? "Block" : "Component"}
          </p>
          {comp.badge && (
            <span className="text-[10px] font-semibold bg-foreground text-background rounded px-1.5 py-0.5 leading-none">
              {comp.badge}
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-lg text-muted-foreground">{comp.description}</p>
        {doc.primitive && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span>Primitive:</span>
            <code className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
              {doc.primitive}
            </code>
          </div>
        )}
      </div>

      {/* ── Preview ────────────────────────────────────────────────────── */}
      <div>
        <ComponentPreviewWrapper slug={slug} code={doc.usage} />
      </div>

      {/* ── Installation ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Installation</h2>
        <InstallTabs addCmd={doc.addCmd} manualDeps={doc.manualDeps} manualCode={componentSource} slug={slug} />
      </div>

      {/* ── render prop note ───────────────────────────────────────────── */}
      {doc.renderNote && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20 p-4">
          <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-1">
            Base UI render prop
          </p>
          <p className="text-sm text-amber-800 dark:text-amber-300/80">{doc.renderNote}</p>
        </div>
      )}

      {/* ── Notes ─────────────────────────────────────────────────────── */}
      {doc.notes && (
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <p className="text-sm font-medium mb-1">Note</p>
          <p className="text-sm text-muted-foreground">{doc.notes}</p>
        </div>
      )}

      {/* ── Usage ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Usage</h2>
        <CodeBlock language="tsx" code={doc.usage} />
      </div>

      {/* ── Examples ──────────────────────────────────────────────────── */}
      {doc.examples && doc.examples.length > 0 && (
        <div className="flex flex-col gap-8">
          <h2 className="text-xl font-semibold">Examples</h2>
          {doc.examples.map((example) => (
            <div key={example.title} className="flex flex-col gap-3">
              <div>
                <h3 className="text-base font-semibold">{example.title}</h3>
                {example.description && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {example.description}
                  </p>
                )}
              </div>
              <CodeBlock language="tsx" code={example.code} />
            </div>
          ))}
        </div>
      )}

      {/* ── Props ─────────────────────────────────────────────────────── */}
      {doc.props && doc.props.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Props</h2>
          <PropsTable props={doc.props} />
        </div>
      )}

      {/* ── Tags ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap pt-4 border-t border-border">
        <span className="text-xs text-muted-foreground">Tags:</span>
        {comp.tags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
