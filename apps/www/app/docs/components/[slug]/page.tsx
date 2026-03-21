import { notFound } from "next/navigation"
import { getComponent, components } from "@/lib/registry"
import { CodeBlock } from "@/components/docs/code-block"
import { PropsTable } from "@/components/docs/props-table"
import { ComponentPreviewWrapper } from "@/components/docs/component-preview-wrapper"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

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

// ── Per-component docs data ────────────────────────────────────────────────

const componentDocs: Record<string, {
  addCmd: string
  usage: string
  primitive?: string
  notes?: string
  renderNote?: string
  props?: Array<{ name: string; type: string; default?: string; description: string; required?: boolean }>
}> = {
  button: {
    addCmd: "npx baseui-cn add button",
    usage: `import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button size="sm">Small</Button>
      <Button size="lg">Large</Button>
      <Button disabled>Disabled</Button>
    </div>
  )
}`,
    props: [
      { name: "variant", type: '"default" | "secondary" | "outline" | "ghost" | "destructive" | "link"', default: '"default"', description: "Visual style" },
      { name: "size", type: '"default" | "sm" | "lg" | "icon"', default: '"default"', description: "Size variant" },
      { name: "disabled", type: "boolean", default: "false", description: "Disables the button" },
    ],
  },
  input: {
    addCmd: "npx baseui-cn add input",
    usage: `import { Input } from "@/components/ui/input"

export function Example() {
  return (
    <div className="flex flex-col gap-4 w-80">
      <Input label="Email" placeholder="you@example.com" type="email" />
      <Input label="Username" helperText="Letters and numbers only" />
      <Input label="Password" type="password" error="Password is required" />
    </div>
  )
}`,
    props: [
      { name: "label", type: "string", description: "Label rendered above the input" },
      { name: "helperText", type: "string", description: "Helper text below the input" },
      { name: "error", type: "string", description: "Error message — also sets aria-invalid" },
    ],
  },
  textarea: {
    addCmd: "npx baseui-cn add textarea",
    usage: `import { Textarea } from "@/components/ui/textarea"

export function Example() {
  return (
    <Textarea
      label="Message"
      placeholder="Write your message..."
      helperText="Max 500 characters."
      autoResize
    />
  )
}`,
    props: [
      { name: "label", type: "string", description: "Label above the textarea" },
      { name: "helperText", type: "string", description: "Helper text below" },
      { name: "error", type: "string", description: "Error message" },
      { name: "autoResize", type: "boolean", default: "false", description: "Grows with content" },
    ],
  },
  label: {
    addCmd: "npx baseui-cn add label",
    usage: `import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function Example() {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="email" required>Email address</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  )
}`,
    props: [
      { name: "required", type: "boolean", default: "false", description: "Shows a red asterisk" },
    ],
  },
  checkbox: {
    addCmd: "npx baseui-cn add checkbox",
    primitive: "Base UI Checkbox",
    usage: `import { Checkbox } from "@/components/ui/checkbox"

export function Example() {
  return (
    <div className="flex flex-col gap-3">
      <Checkbox label="Accept terms of service" />
      <Checkbox
        label="Email notifications"
        description="Receive updates via email"
        defaultChecked
      />
      <Checkbox label="Disabled" disabled />
    </div>
  )
}`,
    props: [
      { name: "label", type: "string", description: "Label text" },
      { name: "description", type: "string", description: "Supporting description text" },
    ],
  },
  switch: {
    addCmd: "npx baseui-cn add switch",
    primitive: "Base UI Switch",
    usage: `import { Switch } from "@/components/ui/switch"

export function Example() {
  return (
    <div className="flex flex-col gap-3">
      <Switch label="Email notifications" />
      <Switch
        label="Push notifications"
        description="Receive alerts on your device"
        defaultChecked
      />
    </div>
  )
}`,
    props: [
      { name: "label", type: "string", description: "Label text" },
      { name: "description", type: "string", description: "Description below label" },
    ],
  },
  "radio-group": {
    addCmd: "npx baseui-cn add radio-group",
    primitive: "Base UI RadioGroup + Radio",
    usage: `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function Example() {
  return (
    <RadioGroup label="Select a plan" defaultValue="pro">
      <RadioGroupItem value="free" label="Free" description="Up to 3 projects" />
      <RadioGroupItem value="pro" label="Pro" description="Unlimited projects" />
      <RadioGroupItem value="team" label="Team" description="Collaboration tools" />
    </RadioGroup>
  )
}`,
    props: [
      { name: "label", type: "string", description: "Group label" },
      { name: "defaultValue", type: "string", description: "Initially selected value" },
    ],
  },
  badge: {
    addCmd: "npx baseui-cn add badge",
    usage: `import { Badge } from "@/components/ui/badge"

export function Example() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
    </div>
  )
}`,
    props: [
      { name: "variant", type: '"default" | "secondary" | "outline" | "destructive" | "success" | "warning"', default: '"default"', description: "Color variant" },
    ],
  },
  skeleton: {
    addCmd: "npx baseui-cn add skeleton",
    usage: `import { Skeleton } from "@/components/ui/skeleton"

export function Example() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
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
    usage: `import { Separator } from "@/components/ui/separator"

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">Above the line</p>
      <Separator />
      <p className="text-sm text-muted-foreground">Below the line</p>

      {/* Vertical */}
      <div className="flex items-center gap-3 h-5">
        <span className="text-sm">Left</span>
        <Separator orientation="vertical" />
        <span className="text-sm">Right</span>
      </div>
    </div>
  )
}`,
    props: [
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Direction of the separator" },
      { name: "decorative", type: "boolean", default: "true", description: "When true, hidden from accessibility tree" },
    ],
  },
  avatar: {
    addCmd: "npx baseui-cn add avatar",
    usage: `import { Avatar, AvatarGroup } from "@/components/ui/avatar"

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <Avatar src="/photo.jpg" alt="Aria Chen" size="md" status="online" />
      <AvatarGroup max={3}>
        <Avatar fallback="AC" />
        <Avatar fallback="MO" />
        <Avatar fallback="PN" />
        <Avatar fallback="JD" />
      </AvatarGroup>
    </div>
  )
}`,
    props: [
      { name: "src", type: "string", description: "Image URL" },
      { name: "alt", type: "string", description: "Alt text — first 2 chars used as fallback initials" },
      { name: "fallback", type: "string", description: "Explicit fallback text (overrides alt-derived initials)" },
      { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: "Avatar size" },
      { name: "status", type: '"online" | "offline" | "busy" | "away"', description: "Status indicator dot" },
    ],
  },
  progress: {
    addCmd: "npx baseui-cn add progress",
    primitive: "Base UI Progress",
    usage: `import { Progress } from "@/components/ui/progress"

export function Example() {
  return (
    <div className="flex flex-col gap-4 w-80">
      {/* Determinate */}
      <Progress value={65} label="Uploading" showValue />

      {/* Indeterminate (value omitted) */}
      <Progress label="Loading..." />
    </div>
  )
}`,
    props: [
      { name: "value", type: "number | null", description: "0–100. Omit for indeterminate state" },
      { name: "label", type: "string", description: "Label above the bar" },
      { name: "showValue", type: "boolean", default: "false", description: "Show percentage next to label" },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Bar height" },
    ],
  },
  select: {
    addCmd: "npx baseui-cn add select",
    primitive: "Base UI Select",
    usage: `import {
  Select, SelectTrigger, SelectContent,
  SelectItem, SelectGroup, SelectLabel,
} from "@/components/ui/select"

export function Example() {
  return (
    <Select>
      <SelectTrigger
        placeholder="Select a framework..."
        className="w-64"
      />
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
    primitive: "Base UI Select + filter",
    usage: `import { Combobox } from "@/components/ui/combobox"

const options = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "nuxt", label: "Nuxt" },
]

export function Example() {
  const [value, setValue] = React.useState("")

  return (
    <Combobox
      options={options}
      value={value}
      onValueChange={setValue}
      placeholder="Select framework..."
      searchPlaceholder="Search..."
    />
  )
}`,
    notes: "No cmdk dependency. Built on Base UI Select with inline filter. Works inside Drawer and Dialog without z-index conflicts — same portal system.",
    props: [
      { name: "options", type: "{ value: string; label: string; disabled?: boolean }[]", required: true, description: "Options to display" },
      { name: "value", type: "string", description: "Controlled value" },
      { name: "onValueChange", type: "(value: string) => void", description: "Called on selection change" },
      { name: "placeholder", type: "string", default: '"Select an option..."', description: "Trigger placeholder" },
      { name: "searchPlaceholder", type: "string", default: '"Search..."', description: "Search input placeholder" },
      { name: "emptyText", type: "string", default: '"No results found."', description: "Empty state text" },
    ],
  },
  autocomplete: {
    addCmd: "npx baseui-cn add autocomplete",
    primitive: "Base UI Combobox",
    usage: `import { Autocomplete } from "@/components/ui/autocomplete"

const countries = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
]

export function Example() {
  return (
    <Autocomplete
      options={countries}
      label="Country"
      placeholder="Search countries..."
      onValueChange={(val) => console.log(val)}
    />
  )
}`,
    notes: "Autocomplete differs from Combobox: the input is always visible and editable — users type to filter and select to fill the input value. Built on Base UI's Combobox primitive (not the same as our Select-based Combobox component).",
    props: [
      { name: "options", type: "AutocompleteOption[]", required: true, description: "Options to display" },
      { name: "value", type: "string", description: "Controlled value" },
      { name: "onValueChange", type: "(value: string) => void", description: "Called on selection change" },
      { name: "placeholder", type: "string", default: '"Search..."', description: "Input placeholder" },
      { name: "label", type: "string", description: "Label above the input" },
      { name: "error", type: "string", description: "Error message" },
    ],
  },
  dialog: {
    addCmd: "npx baseui-cn add dialog",
    primitive: "Base UI Dialog",
    renderNote: "Base UI uses the render prop pattern instead of asChild. Pass any element to render={} on DialogTrigger and DialogClose — Base UI applies all the correct ARIA and event handlers to it.",
    usage: `import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <Dialog>
      {/* render prop — Base UI applies ARIA/events to your element */}
      <DialogTrigger render={<Button variant="outline">Open Dialog</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>
            This action cannot be undone.
          </DialogDescription>
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
  "alert-dialog": {
    addCmd: "npx baseui-cn add alert-dialog",
    primitive: "Base UI AlertDialog",
    renderNote: "AlertDialogTrigger and AlertDialogClose use the render prop pattern. Pass any element to render={}.",
    usage: `import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent,
  AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogClose,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive">Delete account</Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your account and all your data.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button variant="destructive">Delete account</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}`,
    notes: "AlertDialog intentionally cannot be closed by clicking the backdrop or pressing Escape without an explicit cancel button. Use for destructive actions that require deliberate confirmation. Use Dialog for non-destructive interactions.",
    props: [],
  },
  drawer: {
    addCmd: "npx baseui-cn add drawer",
    primitive: "Base UI Drawer (stable v1.3.0+)",
    renderNote: "Base UI uses the render prop pattern instead of asChild. Pass any element to render={} on DrawerTrigger and DrawerClose.",
    usage: `import {
  Drawer, DrawerTrigger, DrawerContent,
  DrawerHeader, DrawerTitle, DrawerDescription,
  DrawerFooter, DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"

export function Example() {
  return (
    <Drawer>
      {/* render prop — no asChild in Base UI */}
      <DrawerTrigger render={<Button variant="outline">Open Drawer</Button>} />
      <DrawerContent side="right">
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerDescription>Manage your preferences.</DrawerDescription>
        </DrawerHeader>
        <div className="p-6 flex-1">
          {/* Combobox works here — same Base UI portal */}
          <Combobox options={options} placeholder="Select option..." />
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline" className="w-full">Close</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}`,
    notes: "Built on Base UI Drawer stable (v1.3.0+, March 2026). All other Base UI overlays — Select, Combobox, Tooltip, DropdownMenu — work correctly inside it because they share the same portal system.",
    props: [
      { name: "side", type: '"right" | "left" | "bottom" | "top"', default: '"right"', description: "Which edge the drawer slides from" },
    ],
  },
  popover: {
    addCmd: "npx baseui-cn add popover",
    primitive: "Base UI Popover",
    renderNote: "PopoverTrigger uses the render prop. Pass a button, icon, or any element to render={}.",
    usage: `import {
  Popover, PopoverTrigger, PopoverContent,
  PopoverHeading, PopoverDescription,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline">Open Popover</Button>} />
      <PopoverContent side="bottom" align="start">
        <PopoverHeading>Dimensions</PopoverHeading>
        <PopoverDescription>Set the layer dimensions.</PopoverDescription>
      </PopoverContent>
    </Popover>
  )
}`,
    props: [
      { name: "side", type: '"top" | "bottom" | "left" | "right"', default: '"bottom"', description: "Preferred side" },
      { name: "align", type: '"start" | "center" | "end"', default: '"center"', description: "Alignment along the side" },
      { name: "showArrow", type: "boolean", default: "true", description: "Show directional arrow" },
    ],
  },
  tooltip: {
    addCmd: "npx baseui-cn add tooltip",
    primitive: "Base UI Tooltip",
    renderNote: "TooltipTrigger uses the render prop. Pass any element — button, icon, span — to render={}.",
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
    notes: "Wrap multiple tooltips in a single TooltipProvider for instant switching with no delay gap when moving between triggers.",
    props: [
      { name: "side", type: '"top" | "bottom" | "left" | "right"', default: '"top"', description: "Tooltip placement" },
      { name: "showArrow", type: "boolean", default: "true", description: "Show directional arrow" },
    ],
  },
  "dropdown-menu": {
    addCmd: "npx baseui-cn add dropdown-menu",
    primitive: "Base UI Menu",
    renderNote: "DropdownMenuTrigger uses the render prop — pass a button, icon button, or any element.",
    usage: `import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">Open Menu</Button>} />
      <DropdownMenuContent>
        <DropdownMenuItem>
          Edit <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
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
    <Button
      onClick={() =>
        add(
          <Toast title="Saved!" description="Your changes were saved." />,
          { timeout: 3000 }
        )
      }
    >
      Show Toast
    </Button>
  )
}`,
    props: [
      { name: "title", type: "string", description: "Toast heading" },
      { name: "description", type: "string", description: "Supporting text" },
      { name: "variant", type: '"default" | "success" | "error" | "warning"', default: '"default"', description: "Color variant" },
      { name: "action", type: "React.ReactNode", description: "Optional action button" },
    ],
  },
  tabs: {
    addCmd: "npx baseui-cn add tabs",
    primitive: "Base UI Tabs",
    usage: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export function Example() {
  return (
    <Tabs defaultValue="account" className="w-96">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="p-4 text-sm text-muted-foreground">
        Manage your account details.
      </TabsContent>
      <TabsContent value="password" className="p-4 text-sm text-muted-foreground">
        Change your password.
      </TabsContent>
      <TabsContent value="billing" className="p-4 text-sm text-muted-foreground">
        Manage billing and invoices.
      </TabsContent>
    </Tabs>
  )
}`,
    props: [],
  },
  accordion: {
    addCmd: "npx baseui-cn add accordion",
    primitive: "Base UI Accordion",
    usage: `import {
  Accordion, AccordionItem,
  AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion"

export function Example() {
  return (
    <Accordion type="single" collapsible className="w-96">
      <AccordionItem value="q1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. Full ARIA and keyboard support via Base UI Accordion.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="q2">
        <AccordionTrigger>Can it be controlled?</AccordionTrigger>
        <AccordionContent>
          Yes — use value and onValueChange props for controlled mode.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}`,
    notes: "Add accordion-down and accordion-up keyframes to your tailwind config for height animation. See theming docs.",
    props: [],
  },
  collapsible: {
    addCmd: "npx baseui-cn add collapsible",
    primitive: "Base UI Collapsible",
    usage: `import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"

export function Example() {
  return (
    <Collapsible className="w-80 rounded-md border border-border px-4">
      <CollapsibleTrigger>Can I add this to my project?</CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pb-3">
          Yes — run npx baseui-cn add collapsible and the file is yours to edit.
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}`,
    notes: "For multiple collapsible panels with shared state, use Accordion instead. Collapsible is for a single standalone expandable section.",
    props: [],
  },
  table: {
    addCmd: "npx baseui-cn add table",
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
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Aria Chen</TableCell>
          <TableCell className="text-muted-foreground">Admin</TableCell>
          <TableCell><Badge variant="success">Active</Badge></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}`,
    props: [],
  },
  breadcrumb: {
    addCmd: "npx baseui-cn add breadcrumb",
    usage: `import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem,
  BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function Example() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Profile</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}`,
    props: [],
  },
  pagination: {
    addCmd: "npx baseui-cn add pagination",
    usage: `import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationPrevious, PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination"

export function Example() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
        <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
        <PaginationItem><PaginationEllipsis /></PaginationItem>
        <PaginationItem><PaginationNext href="#" /></PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}`,
    props: [],
  },
  "empty-state": {
    addCmd: "npx baseui-cn add empty-state",
    usage: `import { EmptyState, EmptyStateIcons } from "@/components/ui/blocks/empty-state"
import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <EmptyState
      icon={EmptyStateIcons.inbox}
      title="No messages yet"
      description="When you receive messages, they'll appear here."
      action={<Button size="sm">Compose message</Button>}
    />
  )
}`,
    props: [
      { name: "title", type: "string", required: true, description: "Main heading" },
      { name: "description", type: "string", description: "Supporting text" },
      { name: "icon", type: "React.ReactNode", description: "Icon displayed above title" },
      { name: "action", type: "React.ReactNode", description: "CTA button or link" },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Controls padding and text size" },
    ],
  },
  login: {
    addCmd: "npx baseui-cn add login",
    usage: `import { LoginBlock } from "@/components/ui/blocks/login"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginBlock
        onSubmit={async ({ email, password }) => {
          await signIn(email, password)
        }}
        onGoogleLogin={() => signInWithGoogle()}
        signUpHref="/register"
        forgotPasswordHref="/forgot"
      />
    </div>
  )
}`,
    props: [
      { name: "onSubmit", type: "(data: { email: string; password: string }) => void | Promise<void>", description: "Form submit handler" },
      { name: "onGoogleLogin", type: "() => void", description: "Google OAuth handler — shows button when provided" },
      { name: "onGithubLogin", type: "() => void", description: "GitHub OAuth handler — shows button when provided" },
      { name: "isLoading", type: "boolean", default: "false", description: "Shows loading state on submit button" },
      { name: "error", type: "string", description: "Global error message shown above form" },
    ],
  },
  command: {
    addCmd: "npx baseui-cn add command",
    usage: `import { Command, CommandDialog } from "@/components/ui/command"
import { Button } from "@/components/ui/button"

const items = [
  { id: "1", label: "New File", shortcut: "⌘N", group: "File", onSelect: () => {} },
  { id: "2", label: "Open Folder", shortcut: "⌘O", group: "File", onSelect: () => {} },
  { id: "3", label: "Find in Files", shortcut: "⌘⇧F", group: "Edit", onSelect: () => {} },
]

// Inline command panel
export function InlineExample() {
  return <Command items={items} placeholder="Search commands..." />
}

// ⌘K dialog
export function PaletteExample() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [])

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      items={items}
    />
  )
}`,
    notes: "No cmdk dependency. Built on Base UI Dialog + native React state. Arrow key navigation and Enter to select are built in.",
    props: [
      { name: "items", type: "CommandItem[]", required: true, description: "Array of command items" },
      { name: "placeholder", type: "string", description: "Search input placeholder" },
      { name: "emptyText", type: "string", description: "Text when no results" },
      { name: "onSelect", type: "(item: CommandItem) => void", description: "Called when an item is selected" },
    ],
  },
  "app-shell": {
    addCmd: "npx baseui-cn add app-shell",
    usage: `import { AppShell } from "@/components/ui/blocks/app-shell"

const nav = [
  { id: "dashboard", label: "Dashboard", href: "/" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "settings", label: "Settings", href: "/settings" },
]

export default function Layout({ children }) {
  return (
    <AppShell
      nav={nav}
      activeId="dashboard"
      logo={<span className="font-bold text-sm">MyApp</span>}
      header={<h1 className="text-sm font-medium">Dashboard</h1>}
    >
      {children}
    </AppShell>
  )
}`,
    notes: "Mobile sidebar uses Base UI Drawer — all overlays inside the page content work correctly. Desktop sidebar collapses to icon-only. Fully responsive.",
    props: [
      { name: "nav", type: "NavItem[]", required: true, description: "Navigation items" },
      { name: "activeId", type: "string", description: "Currently active nav item ID" },
      { name: "logo", type: "React.ReactNode", description: "Logo/brand in sidebar header" },
      { name: "header", type: "React.ReactNode", description: "Content for the top header bar" },
      { name: "defaultCollapsed", type: "boolean", default: "false", description: "Start with sidebar collapsed on desktop" },
    ],
  },
}

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
    usage: `import { } from "@/components/ui/${slug}"`,
  }

  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

  return (
    <div className="flex flex-col gap-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-3 pb-6 border-b border-border">
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
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Primitive:</span>
            <code className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{doc.primitive}</code>
          </div>
        )}
      </div>

      {/* Live preview + code */}
      <div>
        <h2 className="text-base font-semibold mb-3">Preview</h2>
        <ComponentPreviewWrapper slug={slug} code={doc.usage} />
      </div>

      {/* render prop note */}
      {doc.renderNote && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20 p-4">
          <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-1">Base UI render prop</p>
          <p className="text-sm text-amber-800 dark:text-amber-300/80">{doc.renderNote}</p>
        </div>
      )}

      {/* Install */}
      <div>
        <h2 className="text-base font-semibold mb-3">Installation</h2>
        <CodeBlock code={doc.addCmd} />
      </div>

      {/* Usage code */}
      <div>
        <h2 className="text-base font-semibold mb-3">Usage</h2>
        <CodeBlock language="tsx" code={doc.usage} />
      </div>

      {/* Notes */}
      {doc.notes && (
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <p className="text-sm font-medium mb-1">Note</p>
          <p className="text-sm text-muted-foreground">{doc.notes}</p>
        </div>
      )}

      {/* Props */}
      {doc.props && doc.props.length > 0 && (
        <div>
          <h2 className="text-base font-semibold mb-3">Props</h2>
          <PropsTable props={doc.props} />
        </div>
      )}

      {/* Tags */}
      <div className="flex items-center gap-2 flex-wrap pt-4 border-t border-border">
        <span className="text-xs text-muted-foreground">Tags:</span>
        {comp.tags.map((tag) => (
          <span key={tag} className="font-mono text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
