"use client"

import * as React from "react"

// ── Real component imports ─────────────────────────────────────────────────
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldContent, FieldDescription } from "../ui/field"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import {
  Avatar,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
} from "@/components/ui/popover"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { ToastProvider, useToast } from "@/components/ui/toast"
import { Command } from "@/components/ui/command"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import { EmptyState, EmptyStateIcons, LoginBlock } from "@/components/ui/blocks"
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxEmpty,
  ComboboxItem,
} from "@/components/ui/combobox"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@/components/ui/autocomplete"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useState } from "react"

// ─── Button ────────────────────────────────────────────────────────────────
export function ButtonPreview() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div className="flex flex-wrap gap-2">
        <Button variant="default">Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="xs">XSmall</Button>
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" variant="outline" aria-label="Add">
          <svg className="size-4" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3v10M3 8h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </Button>
      </div>
      <div className="flex gap-2">
        <Button disabled>Disabled</Button>
        <Button variant="outline" disabled>
          Disabled outline
        </Button>
      </div>
    </div>
  )
}

// ─── Input ─────────────────────────────────────────────────────────────────
export function InputPreview() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldContent>
          <Input placeholder="you@example.com" type="email" />
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel>Username</FieldLabel>
        <FieldContent>
          <Input placeholder="johndoe" />
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel>Password</FieldLabel>
        <FieldContent>
          <Input type="password" placeholder="••••••••" />
        </FieldContent>
      </Field>
    </div>
  )
}

// ─── Textarea ──────────────────────────────────────────────────────────────
export function TextareaPreview() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <Field>
        <FieldLabel>Message</FieldLabel>
        <Textarea placeholder="Write your message here..." />
      </Field>
      <Field>
        <FieldLabel>Notes</FieldLabel>
        <Textarea placeholder="Add notes..." />
      </Field>
    </div>
  )
}

// ─── Label ─────────────────────────────────────────────────────────────────
export function LabelPreview() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email-demo">Email address</Label>
        <Input id="email-demo" placeholder="you@example.com" type="email" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="company-demo">Company name</Label>
        <Input id="company-demo" placeholder="Acme Inc." />
      </div>
    </div>
  )
}

// ─── Checkbox ──────────────────────────────────────────────────────────────
export function CheckboxPreview() {
  return (
    <div className="flex flex-col gap-3">
      <Field orientation="horizontal" className="w-auto max-w-xs">
        <Checkbox id="terms-2" defaultChecked />
        <FieldContent>
          <FieldLabel htmlFor="terms-2">Accept terms and conditions</FieldLabel>
          <FieldDescription>
            This checkbox is used to accept the terms and conditions.
          </FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal" className="w-auto">
        <Checkbox id="terms" />
        <FieldLabel htmlFor="terms">Basic checkbox</FieldLabel>
      </Field>
      <Field orientation="horizontal" className="w-auto">
        <Checkbox id="terms-3" disabled />
        <FieldLabel htmlFor="terms-3">Disabled</FieldLabel>
      </Field>
    </div>
  )
}

// ─── Switch ────────────────────────────────────────────────────────────────
export function SwitchPreview() {
  return (
    <div className="flex flex-col gap-4">
      <Switch label="Email notifications" />
      <Switch
        label="Push notifications"
        description="Receive alerts on your device"
        defaultChecked
      />
      <Switch label="Disabled" disabled />
    </div>
  )
}

// ─── Radio Group ───────────────────────────────────────────────────────────
export function RadioGroupPreview() {
  return (
    <RadioGroup defaultValue="comfortable" className="w-fit">
      <Field orientation="horizontal">
        <RadioGroupItem value="default" id="r1" />
        <FieldLabel htmlFor="r1">Default</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="comfortable" id="r2" />
        <FieldLabel htmlFor="r2">Comfortable</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="compact" id="r3" />
        <FieldLabel htmlFor="r3">Compact</FieldLabel>
      </Field>
    </RadioGroup>
  )
}

// ─── Badge ─────────────────────────────────────────────────────────────────
export function BadgePreview() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="info">Info</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge size="sm">Small</Badge>
        <Badge size="default">Default</Badge>
        <Badge size="lg">Large</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge shape="pill">Pill</Badge>
        <Badge shape="pill" variant="secondary">
          Secondary pill
        </Badge>
        <Badge shape="pill" variant="success">
          Active
        </Badge>
      </div>
    </div>
  )
}

// ─── Skeleton ──────────────────────────────────────────────────────────────
export function SkeletonPreview() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <div className="flex items-center gap-4">
        <Skeleton className="size-12 rounded-full" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-20 w-full rounded-lg" />
    </div>
  )
}

// ─── Scroll Area ───────────────────────────────────────────────────────────
export function ScrollAreaPreview() {
  return (
    <ScrollArea className="h-48 w-64 rounded-md border border-border p-4">
      {Array.from({ length: 20 }, (_, i) => (
        <p key={i} className="text-sm py-1 text-muted-foreground">
          Item {i + 1}
        </p>
      ))}
    </ScrollArea>
  )
}

// ─── Separator ─────────────────────────────────────────────────────────────
export function SeparatorPreview() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <div>
        <p className="text-sm font-medium">Section A</p>
        <Separator className="my-3" />
        <p className="text-sm text-muted-foreground">Content below the separator.</p>
      </div>
      <div className="flex items-center gap-4 h-5">
        <span className="text-sm">Left</span>
        <Separator orientation="vertical" />
        <span className="text-sm">Center</span>
        <Separator orientation="vertical" />
        <span className="text-sm">Right</span>
      </div>
    </div>
  )
}

// ─── Avatar ────────────────────────────────────────────────────────────────
export function AvatarPreview() {
  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="flex items-end gap-4">
        {(["sm", "default", "lg"] as const).map((size) => (
          <div key={size} className="flex flex-col items-center gap-1.5">
            <Avatar size={size}>
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <span className="text-[10px] text-muted-foreground">{size}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4">
        {[
          { bg: "bg-green-500", label: "Online" },
          { bg: "bg-destructive", label: "Busy" },
          { bg: "bg-yellow-500", label: "Away" },
          { bg: "bg-muted-foreground", label: "Offline" },
        ].map(({ bg, label }) => (
          <div key={label} className="flex flex-col items-center gap-1.5">
            <Avatar>
              <AvatarFallback>MO</AvatarFallback>
              <AvatarBadge className={bg} />
            </Avatar>
            <span className="text-[10px] text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
      <AvatarGroup>
        {["AC", "MO", "PN", "JD"].map((initials) => (
          <Avatar key={initials}>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        ))}
        <AvatarGroupCount>+4</AvatarGroupCount>
      </AvatarGroup>
    </div>
  )
}

// ─── Progress ──────────────────────────────────────────────────────────────
export function ProgressPreview() {
  const [value, setValue] = React.useState(40)

  const [downloadProgress, setDownloadProgress] = useState(0)
  // Get status message based on progress
  const getStatusMessage = (progress: number) => {
    if (progress < 5) return "Initializing download..."
    if (progress < 15) return "Setting up environment..."
    if (progress < 25) return "Connecting to server..."
    if (progress < 35) return "Verifying permissions..."
    if (progress < 50) return "Downloading core files..."
    if (progress < 65) return "Downloading assets..."
    if (progress < 80) return "Downloading dependencies..."
    if (progress < 90) return "Extracting files..."
    if (progress < 95) return "Validating integrity..."
    if (progress < 100) return "Finalizing installation..."
    return "Download complete!"
  }
  React.useEffect(() => {
    // Download simulation
    const downloadTimer = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          return 0 // Reset for continuous loop
        }
        return prev + Math.random() * 3 + 1 // Random increment 1-4
      })
    }, 150)
    return () => {
      clearInterval(downloadTimer)
    }
  }, [])

  return (
    <div className="flex flex-col gap-5 w-full max-w-xs">
      <Progress value={56}>
        <ProgressLabel>Uploading</ProgressLabel>
        <ProgressValue />
      </Progress>
      <div className="w-full max-w-xs space-y-2">
        <Progress value={downloadProgress}>
          <ProgressLabel>Workspace Setup</ProgressLabel>
          <ProgressValue />
        </Progress>
        <div className="text-muted-foreground text-xs">{getStatusMessage(downloadProgress)}</div>
      </div>
    </div>
  )
}

// ─── Select ────────────────────────────────────────────────────────────────
export function SelectPreview() {
  return (
    <Select>
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Select a framework..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Frameworks</SelectLabel>
          <SelectItem value="next">Next.js</SelectItem>
          <SelectItem value="remix">Remix</SelectItem>
          <SelectItem value="astro">Astro</SelectItem>
          <SelectItem value="nuxt">Nuxt</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

// ─── Combobox ──────────────────────────────────────────────────────────────
export function ComboboxPreview() {
  const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]

  return (
    <Combobox items={frameworks} defaultValue={frameworks[0]}>
      <ComboboxInput placeholder="Select a framework" showClear />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export function AutocompletePreview() {
  const [value, setValue] = React.useState<string>("")

  const filteredItems = items.filter((item) =>
    item.value.toLowerCase().includes(value.toLowerCase())
  )

  return (
    <div className="w-full max-w-xs">
      <Autocomplete
        value={value}
        onValueChange={setValue}
        items={filteredItems}
        itemToStringValue={(item: unknown) => (item as Item).value}
      >
        <AutocompleteInput placeholder="e.g. feature" showTrigger showClear />
        <AutocompleteContent>
          <AutocompleteEmpty>No items found.</AutocompleteEmpty>
          <AutocompleteList>
            {(item) => (
              <AutocompleteItem key={item.id} value={item}>
                {item.value}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  )
}

interface Item {
  id: string
  value: string
}

const items: Item[] = [
  { id: "t1", value: "feature" },
  { id: "t2", value: "fix" },
  { id: "t3", value: "bug" },
  { id: "t4", value: "docs" },
  { id: "t5", value: "internal" },
  { id: "t6", value: "mobile" },
  { id: "c-accordion", value: "component: accordion" },
  { id: "c-alert-dialog", value: "component: alert dialog" },
  { id: "c-autocomplete", value: "component: autocomplete" },
  { id: "c-avatar", value: "component: avatar" },
  { id: "c-checkbox", value: "component: checkbox" },
  { id: "c-checkbox-group", value: "component: checkbox group" },
  { id: "c-collapsible", value: "component: collapsible" },
  { id: "c-combobox", value: "component: combobox" },
  { id: "c-context-menu", value: "component: context menu" },
  { id: "c-dialog", value: "component: dialog" },
  { id: "c-field", value: "component: field" },
  { id: "c-fieldset", value: "component: fieldset" },
  { id: "c-filterable-menu", value: "component: filterable menu" },
  { id: "c-form", value: "component: form" },
  { id: "c-input", value: "component: input" },
  { id: "c-menu", value: "component: menu" },
  { id: "c-menubar", value: "component: menubar" },
  { id: "c-meter", value: "component: meter" },
  { id: "c-navigation-menu", value: "component: navigation menu" },
  { id: "c-number-field", value: "component: number field" },
  { id: "c-popover", value: "component: popover" },
  { id: "c-preview-card", value: "component: preview card" },
  { id: "c-progress", value: "component: progress" },
  { id: "c-radio", value: "component: radio" },
  { id: "c-scroll-area", value: "component: scroll area" },
  { id: "c-select", value: "component: select" },
  { id: "c-separator", value: "component: separator" },
  { id: "c-slider", value: "component: slider" },
  { id: "c-switch", value: "component: switch" },
  { id: "c-tabs", value: "component: tabs" },
  { id: "c-toast", value: "component: toast" },
  { id: "c-toggle", value: "component: toggle" },
  { id: "c-toggle-group", value: "component: toggle group" },
  { id: "c-toolbar", value: "component: toolbar" },
  { id: "c-tooltip", value: "component: tooltip" },
]

// ─── Tabs ──────────────────────────────────────────────────────────────────
export function TabsPreview() {
  return (
    <Tabs defaultValue="account" className="w-full max-w-sm">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="p-4 text-sm text-muted-foreground">
        Manage your account name, email, and profile picture.
      </TabsContent>
      <TabsContent value="password" className="p-4 text-sm text-muted-foreground">
        Update your password and two-factor authentication.
      </TabsContent>
      <TabsContent value="billing" className="p-4 text-sm text-muted-foreground">
        View invoices and manage your subscription.
      </TabsContent>
    </Tabs>
  )
}

// ─── Accordion ─────────────────────────────────────────────────────────────
export function AccordionPreview() {
  return (
    <Accordion className="w-full max-w-sm">
      <AccordionItem value="q1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. Full ARIA and keyboard support via Base UI Accordion.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="q2">
        <AccordionTrigger>Does it animate?</AccordionTrigger>
        <AccordionContent>
          Yes — smooth height transitions using CSS custom properties.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="q3">
        <AccordionTrigger>Can I nest content?</AccordionTrigger>
        <AccordionContent>Absolutely — any React node works inside the panel.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

// ─── Dialog ────────────────────────────────────────────────────────────────
export function DialogPreview() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Open Dialog</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your project.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button variant="destructive">Delete project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Drawer ────────────────────────────────────────────────────────────────
export function DrawerPreview() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline">Open Drawer</Button>} />
      <DrawerContent side="right">
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerDescription>Manage your preferences below.</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 px-6 space-y-4">
          <Field>
            <FieldLabel>Display name</FieldLabel>
            <FieldContent>
              <Input defaultValue="Aria Chen" />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Email notifications</FieldLabel>
            <FieldContent>
              <Switch defaultChecked />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Theme</FieldLabel>
            <FieldContent>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  <SelectItem value="Light">Light</SelectItem>
                  <SelectItem value="Dark">Dark</SelectItem>
                  <SelectItem value="System">System</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground pt-1">
                Select works inside this Drawer — same Base UI portal system.
              </p>
            </FieldContent>
          </Field>
        </div>
        <DrawerFooter>
          <DrawerClose
            render={
              <Button variant="outline" className="w-full">
                Close
              </Button>
            }
          />
          <Button className="w-full">Save changes</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

// ─── Alert Dialog ──────────────────────────────────────────────────────────
export function AlertDialogPreview() {
  const [deleted, setDeleted] = React.useState(false)
  if (deleted)
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
          <svg className="size-5 text-destructive" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <p className="text-sm text-muted-foreground">Account deleted</p>
        <Button variant="outline" size="sm" onClick={() => setDeleted(false)}>
          Reset demo
        </Button>
      </div>
    )
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive">Delete account</Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your account and all data. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel render={<Button variant="outline">Cancel</Button>} />
          <Button variant="destructive" onClick={() => setDeleted(true)}>
            Delete account
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ─── Popover ───────────────────────────────────────────────────────────────
export function PopoverPreview() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline">Open Popover</Button>} />
      <PopoverContent side="bottom" align="start">
        <PopoverTitle>Dimensions</PopoverTitle>
        <PopoverDescription className="mb-3">Set the layer dimensions.</PopoverDescription>
        <div className="flex flex-col gap-2">
          <Field>
            <FieldLabel>Width</FieldLabel>
            <FieldContent>
              <Input defaultValue="100%" />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Height</FieldLabel>
            <FieldContent>
              <Input defaultValue="25px" />
            </FieldContent>
          </Field>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ─── Tooltip ───────────────────────────────────────────────────────────────
export function TooltipPreview() {
  return (
    <TooltipProvider>
      <div className="flex gap-3">
        {[
          { label: "Save", tip: "Save document (⌘S)" },
          { label: "Share", tip: "Share with team" },
          { label: "Delete", tip: "Delete permanently" },
        ].map(({ label, tip }) => (
          <Tooltip key={label}>
            <TooltipTrigger
              render={
                <Button variant="outline" size="sm">
                  {label}
                </Button>
              }
            />
            <TooltipContent>{tip}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}

// ─── Dropdown Menu ─────────────────────────────────────────────────────────
export function DropdownMenuPreview() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">Open Menu</Button>} />
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Profile</DropdownMenuLabel>
          <DropdownMenuItem>
            Edit <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Duplicate <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Share</DropdownMenuItem>
          <DropdownMenuItem>Export</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── Toast ─────────────────────────────────────────────────────────────────
function ToastDemo() {
  const { add } = useToast()
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() =>
          add({
            title: "Changes saved",
            description: "Your profile has been updated.",
            timeout: 3000,
          })
        }
      >
        Show toast
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          add({
            title: "Error",
            description: "Something went wrong.",
            type: "error",
            timeout: 3000,
          })
        }
      >
        Error toast
      </Button>
    </div>
  )
}

export function ToastPreview() {
  return (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  )
}

// ─── Command ───────────────────────────────────────────────────────────────
export function CommandPreview() {
  return (
    <Command
      className="w-full max-w-sm rounded-lg border border-border shadow-lg"
      items={[
        { id: "1", label: "New File", shortcut: "⌘N", group: "File" },
        { id: "2", label: "Open Folder", shortcut: "⌘O", group: "File" },
        { id: "3", label: "Save", shortcut: "⌘S", group: "File" },
        { id: "4", label: "Find in Files", shortcut: "⌘⇧F", group: "Edit" },
        { id: "5", label: "Toggle Theme", group: "View" },
        { id: "6", label: "Command Palette", shortcut: "⌘⇧P", group: "View" },
      ]}
      placeholder="Type a command..."
    />
  )
}

// ─── Collapsible ───────────────────────────────────────────────────────────
export function CollapsiblePreview() {
  return (
    <Collapsible className="w-full max-w-sm rounded-lg border border-border px-4">
      <CollapsibleTrigger>What is baseui-cn?</CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pb-4">
          A registry of Tailwind-styled components built exclusively on Base UI primitives. Install
          with one command, own the code, style with Tailwind.
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// ─── Table ─────────────────────────────────────────────────────────────────
export function TablePreview() {
  const rows = [
    { name: "Aria Chen", email: "aria@example.com", role: "Admin", status: "Active" },
    { name: "Marcus Osei", email: "marcus@example.com", role: "Editor", status: "Active" },
    { name: "Priya Nair", email: "priya@example.com", role: "Viewer", status: "Inactive" },
  ]
  return (
    <div className="w-full overflow-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.email}>
              <TableCell>
                <div className="font-medium">{row.name}</div>
                <div className="text-xs text-muted-foreground">{row.email}</div>
              </TableCell>
              <TableCell className="text-muted-foreground">{row.role}</TableCell>
              <TableCell>
                <Badge variant={row.status === "Active" ? "success" : "secondary"} shape="pill">
                  {row.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// ─── Breadcrumb ────────────────────────────────────────────────────────────
export function BreadcrumbPreview() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Settings</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Profile</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

// ─── Pagination ────────────────────────────────────────────────────────────
export function PaginationPreview() {
  const [page, setPage] = React.useState(3)
  const total = 7
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setPage((p) => Math.max(1, p - 1))
            }}
            aria-disabled={page === 1}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              href="#"
              isActive={p === page}
              onClick={(e) => {
                e.preventDefault()
                setPage(p)
              }}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setPage((p) => Math.min(total, p + 1))
            }}
            aria-disabled={page === total}
            className={page === total ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

// ─── Empty State ───────────────────────────────────────────────────────────
export function EmptyStatePreview() {
  return (
    <EmptyState
      icon={EmptyStateIcons.inbox}
      title="No messages yet"
      description="When you receive messages, they'll appear here."
      action={
        <Button size="sm" variant="outline">
          Compose message
        </Button>
      }
    />
  )
}

// ─── Login ─────────────────────────────────────────────────────────────────
export function LoginPreview() {
  return (
    <LoginBlock
      title="Welcome back"
      description="Sign in to your account"
      showSocial={false}
      onSubmit={async () => {}}
    />
  )
}

// ─── App Shell ─────────────────────────────────────────────────────────────
export function AppShellPreview() {
  const [active, setActive] = React.useState("dashboard")
  const nav = [
    { id: "dashboard", label: "Dashboard", href: "#" },
    { id: "projects", label: "Projects", href: "#" },
    { id: "team", label: "Team", href: "#" },
    { id: "settings", label: "Settings", href: "#" },
  ]
  return (
    <div className="w-full rounded-lg border border-border overflow-hidden h-64 flex">
      {/* Mini sidebar */}
      <div className="w-44 border-r border-border bg-background shrink-0 flex flex-col">
        <div className="h-11 border-b border-border flex items-center px-3 gap-2">
          <div className="size-5 rounded border border-border bg-foreground flex items-center justify-center">
            <span className="text-background text-[9px] font-bold">B</span>
          </div>
          <span className="font-mono text-xs font-semibold">baseui-cn</span>
        </div>
        <nav className="flex flex-col gap-0.5 p-2 flex-1">
          {nav.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`flex items-center rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors text-left w-full ${
                active === item.id
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <div className="h-11 border-b border-border flex items-center px-4">
          <span className="text-sm font-medium capitalize">{active}</span>
        </div>
        <div className="flex-1 p-4 flex flex-col gap-3">
          <div className="flex gap-3">
            <Skeleton className="h-16 flex-1 rounded-lg" />
            <Skeleton className="h-16 flex-1 rounded-lg" />
            <Skeleton className="h-16 flex-1 rounded-lg" />
          </div>
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

// ─── Export map ────────────────────────────────────────────────────────────
export const previewMap: Record<string, React.ComponentType> = {
  button: ButtonPreview,
  input: InputPreview,
  textarea: TextareaPreview,
  label: LabelPreview,
  checkbox: CheckboxPreview,
  switch: SwitchPreview,
  "radio-group": RadioGroupPreview,
  badge: BadgePreview,
  skeleton: SkeletonPreview,
  "scroll-area": ScrollAreaPreview,
  separator: SeparatorPreview,
  avatar: AvatarPreview,
  progress: ProgressPreview,
  select: SelectPreview,
  combobox: ComboboxPreview,
  autocomplete: AutocompletePreview,
  dialog: DialogPreview,
  "alert-dialog": AlertDialogPreview,
  drawer: DrawerPreview,
  popover: PopoverPreview,
  tooltip: TooltipPreview,
  "dropdown-menu": DropdownMenuPreview,
  toast: ToastPreview,
  command: CommandPreview,
  collapsible: CollapsiblePreview,
  tabs: TabsPreview,
  accordion: AccordionPreview,
  table: TablePreview,
  breadcrumb: BreadcrumbPreview,
  pagination: PaginationPreview,
  "empty-state": EmptyStatePreview,
  login: LoginPreview,
  "app-shell": AppShellPreview,
}
