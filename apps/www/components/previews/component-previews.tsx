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
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
  InputGroupPreview,
} from "@/components/ui/input-group"
import { ToastProvider, useToast } from "@/components/ui/toast"
import type { ToastPosition } from "@/components/ui/toast"
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
    <div className="flex flex-wrap gap-2">
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
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          add({
            title: "Success!",
            description: "Your changes have been saved.",
            type: "success",
            timeout: 3000,
          })
        }
      >
        Success
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
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          add({
            title: "Warning",
            description: "Please review your settings.",
            type: "warning",
            timeout: 3000,
          })
        }
      >
        Warning
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

function ToastWithActionDemo() {
  const { add } = useToast()
  return (
    <Button
      variant="outline"
      onClick={() =>
        add({
          title: "Message sent",
          description: "Your message has been delivered.",
          timeout: 5000,
          actionProps: {
            children: "Undo",
            onClick: () => { /* undo action */ },
          },
        })
      }
    >
      Toast with action
    </Button>
  )
}

function ToastWithActionPreview() {
  return (
    <ToastProvider>
      <ToastWithActionDemo />
    </ToastProvider>
  )
}

function ToastPromiseDemo() {
  const toastManager = useToast()
  return (
    <Button
      variant="outline"
      onClick={() =>
        toastManager.promise(
          new Promise<string>((resolve, reject) => {
            const shouldSucceed = Math.random() > 0.3
            setTimeout(() => {
              shouldSucceed ? resolve("Data loaded") : reject(new Error("Request failed"))
            }, 2000)
          }),
          {
            loading: "Loading data…",
            success: (data: string) => `${data} successfully.`,
            error: (err: Error) => `Error: ${err.message}`,
          }
        )
      }
    >
      Run promise
    </Button>
  )
}

function ToastPromisePreview() {
  return (
    <ToastProvider>
      <ToastPromiseDemo />
    </ToastProvider>
  )
}

function ToastCustomDemo() {
  const toastManager = useToast()
  return (
    <Button
      variant="outline"
      onClick={() =>
        toastManager.add({
          title: "New follower",
          description: "jane_doe started following you.",
          data: { userId: "123" },
        })
      }
    >
      Custom data toast
    </Button>
  )
}

function ToastCustomPreview() {
  return (
    <ToastProvider>
      <ToastCustomDemo />
    </ToastProvider>
  )
}

function ToastVariantsDemo() {
  const { add } = useToast()
  const variants = [
    { type: undefined, label: "Default", title: "Info", desc: "This is a default toast." },
    { type: "success" as const, label: "Success", title: "Success!", desc: "Operation completed." },
    { type: "error" as const, label: "Error", title: "Error", desc: "Something went wrong." },
    { type: "warning" as const, label: "Warning", title: "Warning", desc: "Please be careful." },
  ]
  return (
    <div className="flex flex-wrap gap-2">
      {variants.map((v) => (
        <Button
          key={v.label}
          variant="outline"
          onClick={() => add({ title: v.title, description: v.desc, type: v.type, timeout: 3000 })}
        >
          {v.label}
        </Button>
      ))}
    </div>
  )
}

function ToastVariantsPreview() {
  return (
    <ToastProvider>
      <ToastVariantsDemo />
    </ToastProvider>
  )
}

function ToastPositionsDemo() {
  const positions: { pos: ToastPosition; label: string }[] = [
    { pos: "top-left", label: "Top Left" },
    { pos: "top-center", label: "Top Center" },
    { pos: "top-right", label: "Top Right" },
    { pos: "bottom-left", label: "Bottom Left" },
    { pos: "bottom-center", label: "Bottom Center" },
    { pos: "bottom-right", label: "Bottom Right" },
  ]
  const [selected, setSelected] = React.useState<ToastPosition>("bottom-right")

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2">
        {positions.map(({ pos, label }) => (
          <Button
            key={pos}
            variant={selected === pos ? "default" : "outline"}
            size="sm"
            onClick={() => setSelected(pos)}
          >
            {label}
          </Button>
        ))}
      </div>
      <ToastProvider position={selected}>
        <ToastPositionTrigger position={selected} />
      </ToastProvider>
    </div>
  )
}

function ToastPositionTrigger({ position }: { position: ToastPosition }) {
  const { add } = useToast()
  return (
    <Button
      variant="outline"
      onClick={() =>
        add({
          title: `Toast — ${position}`,
          description: `This toast appears at the ${position.replace("-", " ")} of the screen.`,
          timeout: 3000,
        })
      }
    >
      Show toast
    </Button>
  )
}

function ToastTopLeftPreview() {
  return (
    <ToastProvider position="top-left">
      <ToastPositionButton position="top-left" />
    </ToastProvider>
  )
}
function ToastTopCenterPreview() {
  return (
    <ToastProvider position="top-center">
      <ToastPositionButton position="top-center" />
    </ToastProvider>
  )
}
function ToastTopRightPreview() {
  return (
    <ToastProvider position="top-right">
      <ToastPositionButton position="top-right" />
    </ToastProvider>
  )
}
function ToastBottomLeftPreview() {
  return (
    <ToastProvider position="bottom-left">
      <ToastPositionButton position="bottom-left" />
    </ToastProvider>
  )
}
function ToastBottomCenterPreview() {
  return (
    <ToastProvider position="bottom-center">
      <ToastPositionButton position="bottom-center" />
    </ToastProvider>
  )
}

function ToastPositionButton({ position }: { position: ToastPosition }) {
  const { add } = useToast()
  return (
    <Button
      variant="outline"
      onClick={() =>
        add({
          title: `Toast — ${position}`,
          description: `Appearing at ${position.replace("-", " ")}.`,
          timeout: 3000,
        })
      }
    >
      {position.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
    </Button>
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

// ─── Button variants ────────────────────────────────────────────────────────
function ButtonVariantsPreview() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  )
}
function ButtonSizesPreview() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="xs">XSmall</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" variant="outline" aria-label="Add">
        <svg className="size-4" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
      </Button>
    </div>
  )
}
function ButtonLoadingPreview() {
  const [loading, setLoading] = React.useState(false)
  return (
    <div className="flex gap-2">
      <Button disabled={loading} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 2000) }}>
        {loading ? (
          <><svg className="mr-2 size-4 animate-spin" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10"/></svg>Loading...</>
        ) : "Click to load"}
      </Button>
    </div>
  )
}
function ButtonWithIconPreview() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button>
        <svg className="mr-2 size-4" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        New item
      </Button>
      <Button variant="outline">
        <svg className="mr-2 size-4" viewBox="0 0 16 16" fill="none"><path d="M2 8l3.5 3.5L13 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Confirm
      </Button>
      <Button variant="destructive">
        <svg className="mr-2 size-4" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        Delete
      </Button>
    </div>
  )
}

// ─── Badge variants ─────────────────────────────────────────────────────────
function BadgeVariantsPreview() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  )
}
function BadgePillPreview() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge shape="pill">Default pill</Badge>
      <Badge shape="pill" variant="success">Active</Badge>
      <Badge shape="pill" variant="warning">Pending</Badge>
      <Badge shape="pill" variant="destructive">Failed</Badge>
    </div>
  )
}
function BadgeSizesPreview() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge size="sm">Small</Badge>
      <Badge size="default">Default</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  )
}

// ─── Avatar variants ─────────────────────────────────────────────────────────
function AvatarBasicPreview() {
  return (
    <div className="flex gap-3">
      <Avatar><AvatarFallback>AC</AvatarFallback></Avatar>
      <Avatar><AvatarFallback>MO</AvatarFallback></Avatar>
      <Avatar><AvatarFallback>JD</AvatarFallback></Avatar>
    </div>
  )
}
function AvatarWithBadgePreview() {
  return (
    <div className="flex gap-4">
      {[
        { bg: "bg-green-500", label: "Online" },
        { bg: "bg-destructive", label: "Busy" },
        { bg: "bg-yellow-500", label: "Away" },
        { bg: "bg-muted-foreground", label: "Offline" },
      ].map(({ bg, label }) => (
        <div key={label} className="flex flex-col items-center gap-1.5">
          <Avatar><AvatarFallback>MO</AvatarFallback><AvatarBadge className={bg} /></Avatar>
          <span className="text-[10px] text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  )
}
function AvatarGroupPreview() {
  return (
    <AvatarGroup>
      {["AC", "MO", "PN", "JD"].map((i) => <Avatar key={i}><AvatarFallback>{i}</AvatarFallback></Avatar>)}
      <AvatarGroupCount>+4</AvatarGroupCount>
    </AvatarGroup>
  )
}
function AvatarSizesPreview() {
  return (
    <div className="flex items-end gap-4">
      {(["sm", "default", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-1.5">
          <Avatar size={size}><AvatarFallback>AC</AvatarFallback></Avatar>
          <span className="text-[10px] text-muted-foreground">{size}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Checkbox variants ───────────────────────────────────────────────────────
function CheckboxBasicPreview() {
  return <Checkbox id="cb-basic" />
}
function CheckboxWithLabelPreview() {
  return (
    <div className="flex flex-col gap-3">
      <Field orientation="horizontal" className="w-auto">
        <Checkbox id="cb-label-1" defaultChecked /><FieldLabel htmlFor="cb-label-1">Accept terms</FieldLabel>
      </Field>
      <Field orientation="horizontal" className="w-auto">
        <Checkbox id="cb-label-2" /><FieldLabel htmlFor="cb-label-2">Subscribe to updates</FieldLabel>
      </Field>
    </div>
  )
}
function CheckboxDisabledPreview() {
  return (
    <div className="flex flex-col gap-3">
      <Field orientation="horizontal" className="w-auto">
        <Checkbox id="cb-dis-1" disabled /><FieldLabel htmlFor="cb-dis-1">Disabled unchecked</FieldLabel>
      </Field>
      <Field orientation="horizontal" className="w-auto">
        <Checkbox id="cb-dis-2" disabled defaultChecked /><FieldLabel htmlFor="cb-dis-2">Disabled checked</FieldLabel>
      </Field>
    </div>
  )
}
function CheckboxIndeterminatePreview() {
  const [checked, setChecked] = React.useState(false)
  return (
    <Field orientation="horizontal" className="w-auto">
      <Checkbox id="cb-indet" indeterminate checked={checked} onCheckedChange={(v) => setChecked(v)} />
      <FieldLabel htmlFor="cb-indet">Indeterminate (click to toggle)</FieldLabel>
    </Field>
  )
}

// ─── Switch variants ──────────────────────────────────────────────────────────
function SwitchBasicPreview() {
  return <Switch />
}
function SwitchWithLabelAndDescriptionPreview() {
  return (
    <div className="flex flex-col gap-4">
      <Switch label="Email notifications" description="Receive alerts about your account" defaultChecked />
      <Switch label="Marketing emails" description="Get tips, news, and offers" />
    </div>
  )
}
function SwitchControlledPreview() {
  const [on, setOn] = React.useState(false)
  return (
    <div className="flex flex-col gap-3">
      <Switch label={on ? "Enabled" : "Disabled"} checked={on} onCheckedChange={setOn} />
      <p className="text-xs text-muted-foreground">State: {on ? "on" : "off"}</p>
    </div>
  )
}
function SwitchDisabledPreview() {
  return (
    <div className="flex flex-col gap-3">
      <Switch label="Disabled off" disabled />
      <Switch label="Disabled on" disabled defaultChecked />
    </div>
  )
}

// ─── RadioGroup variants ──────────────────────────────────────────────────────
function RadioGroupBasicPreview() {
  return (
    <RadioGroup defaultValue="a" className="w-fit">
      {["a", "b", "c"].map((v) => (
        <Field key={v} orientation="horizontal">
          <RadioGroupItem value={v} id={`rg-basic-${v}`} />
          <FieldLabel htmlFor={`rg-basic-${v}`}>Option {v.toUpperCase()}</FieldLabel>
        </Field>
      ))}
    </RadioGroup>
  )
}
function RadioGroupWithLabelsPreview() {
  return (
    <RadioGroup defaultValue="comfortable" className="w-fit">
      {[
        { v: "default", label: "Default", desc: "Standard spacing" },
        { v: "comfortable", label: "Comfortable", desc: "More breathing room" },
        { v: "compact", label: "Compact", desc: "Tight spacing" },
      ].map(({ v, label, desc }) => (
        <Field key={v} orientation="horizontal">
          <RadioGroupItem value={v} id={`rg-lbl-${v}`} />
          <FieldContent>
            <FieldLabel htmlFor={`rg-lbl-${v}`}>{label}</FieldLabel>
            <FieldDescription>{desc}</FieldDescription>
          </FieldContent>
        </Field>
      ))}
    </RadioGroup>
  )
}
function RadioGroupHorizontalPreview() {
  return (
    <RadioGroup defaultValue="xs" className="flex flex-row gap-4">
      {["xs", "sm", "md", "lg"].map((v) => (
        <Field key={v} orientation="horizontal">
          <RadioGroupItem value={v} id={`rg-h-${v}`} />
          <FieldLabel htmlFor={`rg-h-${v}`}>{v.toUpperCase()}</FieldLabel>
        </Field>
      ))}
    </RadioGroup>
  )
}
function RadioGroupDisabledPreview() {
  return (
    <RadioGroup defaultValue="a" className="w-fit">
      <Field orientation="horizontal">
        <RadioGroupItem value="a" id="rg-d-a" /><FieldLabel htmlFor="rg-d-a">Enabled</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="b" id="rg-d-b" disabled /><FieldLabel htmlFor="rg-d-b">Disabled</FieldLabel>
      </Field>
    </RadioGroup>
  )
}

// ─── Input variants ───────────────────────────────────────────────────────────
function InputBasicPreview() {
  return <Input placeholder="Enter text..." className="max-w-xs" />
}
function InputWithFieldPreview() {
  return (
    <div className="flex flex-col gap-3 w-full max-w-xs">
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldContent><Input type="email" placeholder="you@example.com" /></FieldContent>
        <FieldDescription>We'll never share your email.</FieldDescription>
      </Field>
    </div>
  )
}
function InputSizesPreview() {
  return (
    <div className="flex flex-col gap-2 w-full max-w-xs">
      <Input placeholder="Small" className="h-8 text-xs" />
      <Input placeholder="Default" />
      <Input placeholder="Large" className="h-11 text-base" />
    </div>
  )
}
function InputDisabledPreview() {
  return (
    <div className="flex flex-col gap-2 w-full max-w-xs">
      <Input placeholder="Disabled input" disabled />
      <Input defaultValue="Disabled with value" disabled />
    </div>
  )
}

// ─── Textarea variants ────────────────────────────────────────────────────────
function TextareaBasicPreview() {
  return <Textarea placeholder="Write something..." className="max-w-xs" />
}
function TextareaWithFieldPreview() {
  return (
    <Field className="max-w-xs">
      <FieldLabel>Message</FieldLabel>
      <Textarea placeholder="Enter your message..." />
      <FieldDescription>Up to 500 characters.</FieldDescription>
    </Field>
  )
}
function TextareaAutoResizePreview() {
  return (
    <div className="flex flex-col gap-2 max-w-xs w-full">
      <p className="text-xs text-muted-foreground">This textarea grows as you type.</p>
      <Textarea placeholder="Start typing to see it grow..." rows={2} />
    </div>
  )
}
function TextareaDisabledPreview() {
  return <Textarea placeholder="Disabled textarea" disabled className="max-w-xs" />
}

// ─── Select variants ──────────────────────────────────────────────────────────
function SelectBasicPreview() {
  return (
    <Select>
      <SelectTrigger className="w-48"><SelectValue placeholder="Pick one..." /></SelectTrigger>
      <SelectContent>
        <SelectItem value="a">Option A</SelectItem>
        <SelectItem value="b">Option B</SelectItem>
        <SelectItem value="c">Option C</SelectItem>
      </SelectContent>
    </Select>
  )
}
function SelectWithGroupsPreview() {
  return (
    <Select>
      <SelectTrigger className="w-56"><SelectValue placeholder="Select framework..." /></SelectTrigger>
      <SelectContent>
        <SelectGroup><SelectLabel>React</SelectLabel>
          <SelectItem value="next">Next.js</SelectItem>
          <SelectItem value="remix">Remix</SelectItem>
        </SelectGroup>
        <SelectGroup><SelectLabel>Vue</SelectLabel>
          <SelectItem value="nuxt">Nuxt</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
function SelectDisabledPreview() {
  return (
    <Select disabled>
      <SelectTrigger className="w-48"><SelectValue placeholder="Disabled select" /></SelectTrigger>
      <SelectContent><SelectItem value="x">Item</SelectItem></SelectContent>
    </Select>
  )
}
function SelectControlledPreview() {
  const [val, setVal] = React.useState("next")
  return (
    <div className="flex flex-col gap-2">
      <Select value={val} onValueChange={(v) => v && setVal(v)}>
        <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="next">Next.js</SelectItem>
          <SelectItem value="remix">Remix</SelectItem>
          <SelectItem value="astro">Astro</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">Selected: {val}</p>
    </div>
  )
}
function SelectSizesPreview() {
  return (
    <div className="flex flex-col gap-2">
      <Select>
        <SelectTrigger className="w-48 h-8 text-xs"><SelectValue placeholder="Small" /></SelectTrigger>
        <SelectContent><SelectItem value="a">Option A</SelectItem></SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-48"><SelectValue placeholder="Default" /></SelectTrigger>
        <SelectContent><SelectItem value="a">Option A</SelectItem></SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-48 h-11 text-base"><SelectValue placeholder="Large" /></SelectTrigger>
        <SelectContent><SelectItem value="a">Option A</SelectItem></SelectContent>
      </Select>
    </div>
  )
}

// ─── Combobox variants ────────────────────────────────────────────────────────
function ComboboxBasicPreview() {
  const opts = ["React", "Vue", "Angular", "Svelte"]
  return (
    <Combobox items={opts}>
      <ComboboxInput placeholder="Pick a framework..." />
      <ComboboxContent>
        <ComboboxEmpty>No results.</ComboboxEmpty>
        <ComboboxList>{(item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}</ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
function ComboboxWithGroupsPreview() {
  const frontend = ["React", "Vue", "Svelte"]
  const backend = ["Node.js", "Django", "Rails"]
  return (
    <Combobox items={[...frontend, ...backend]}>
      <ComboboxInput placeholder="Select stack..." />
      <ComboboxContent>
        <ComboboxEmpty>No results.</ComboboxEmpty>
        <ComboboxList>{(item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}</ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
function ComboboxAsyncPreview() {
  const opts = ["Feature", "Bug", "Docs", "Refactor", "Test"]
  return (
    <Combobox items={opts}>
      <ComboboxInput placeholder="Search labels..." showClear />
      <ComboboxContent>
        <ComboboxEmpty>No results.</ComboboxEmpty>
        <ComboboxList>{(item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}</ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
function ComboboxMultiSelectWithChipsPreview() {
  return <ComboboxPreview />
}

// ─── Autocomplete variants ─────────────────────────────────────────────────────
function AutocompleteBasicPreview() {
  const [value, setValue] = React.useState("")
  const opts = items.filter(i => i.value.toLowerCase().includes(value.toLowerCase()))
  return (
    <div className="w-full max-w-xs">
      <Autocomplete value={value} onValueChange={setValue} items={opts} itemToStringValue={(i: unknown) => (i as typeof items[0]).value}>
        <AutocompleteInput placeholder="Type to search..." />
        <AutocompleteContent>
          <AutocompleteEmpty>No results.</AutocompleteEmpty>
          <AutocompleteList>{(item) => <AutocompleteItem key={item.id} value={item}>{item.value}</AutocompleteItem>}</AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  )
}
function AutocompleteWithClearButtonPreview() {
  const [value, setValue] = React.useState("")
  const opts = items.filter(i => i.value.toLowerCase().includes(value.toLowerCase()))
  return (
    <div className="w-full max-w-xs">
      <Autocomplete value={value} onValueChange={setValue} items={opts} itemToStringValue={(i: unknown) => (i as typeof items[0]).value}>
        <AutocompleteInput placeholder="Search..." showTrigger showClear />
        <AutocompleteContent>
          <AutocompleteEmpty>No results.</AutocompleteEmpty>
          <AutocompleteList>{(item) => <AutocompleteItem key={item.id} value={item}>{item.value}</AutocompleteItem>}</AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  )
}

// ─── Dialog variants ─────────────────────────────────────────────────────────
function DialogBasicPreview() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Open</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Basic Dialog</DialogTitle>
          <DialogDescription>This is a simple dialog example.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Close</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
function DialogNoCloseButtonPreview() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Open (no × button)</Button>} />
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>No close button</DialogTitle>
          <DialogDescription>This dialog has no × in the corner.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button>Dismiss</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
function DialogScrollablePreview() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Scrollable</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Long content</DialogTitle>
          <DialogDescription>Scroll to see more content inside this dialog.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
          {Array.from({ length: 10 }, (_, i) => (
            <p key={i} className="text-sm text-muted-foreground">Paragraph {i + 1}: Lorem ipsum dolor sit amet consectetur.</p>
          ))}
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Close</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
function DialogFullscreenPreview() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Fullscreen</Button>} />
      <DialogContent className="max-w-full h-full rounded-none m-0">
        <DialogHeader>
          <DialogTitle>Fullscreen dialog</DialogTitle>
          <DialogDescription>Takes up the full viewport.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Close</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
function DialogSizesPreview() {
  return (
    <div className="flex flex-wrap gap-2">
      {(["sm", "default", "lg"] as const).map((size) => (
        <Dialog key={size}>
          <DialogTrigger render={<Button variant="outline" size="sm">{size}</Button>} />
          <DialogContent className={size === "sm" ? "max-w-sm" : size === "lg" ? "max-w-2xl" : ""}>
            <DialogHeader>
              <DialogTitle>{size.toUpperCase()} dialog</DialogTitle>
              <DialogDescription>A {size} sized dialog window.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Close</Button>} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  )
}

// ─── Alert Dialog variants ───────────────────────────────────────────────────
function AlertDialogBasicPreview() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline">Open</Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm action</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to proceed?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel render={<Button variant="outline">Cancel</Button>} />
          <Button>Continue</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
function AlertDialogDestructivePreview() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive">Delete</Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete permanently?</AlertDialogTitle>
          <AlertDialogDescription>This cannot be undone. All data will be lost.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel render={<Button variant="outline">Cancel</Button>} />
          <Button variant="destructive">Delete</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ─── Drawer variants ─────────────────────────────────────────────────────────
function DrawerRightPreview() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline">Open right</Button>} />
      <DrawerContent side="right">
        <DrawerHeader><DrawerTitle>Right drawer</DrawerTitle></DrawerHeader>
        <div className="flex-1 px-6 py-4 text-sm text-muted-foreground">Content goes here.</div>
        <DrawerFooter><DrawerClose render={<Button variant="outline" className="w-full">Close</Button>} /></DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
function DrawerLeftPreview() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline">Open left</Button>} />
      <DrawerContent side="left">
        <DrawerHeader><DrawerTitle>Left drawer</DrawerTitle></DrawerHeader>
        <div className="flex-1 px-6 py-4 text-sm text-muted-foreground">Navigation or sidebar content.</div>
        <DrawerFooter><DrawerClose render={<Button variant="outline" className="w-full">Close</Button>} /></DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
function DrawerBottomSheetPreview() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline">Open bottom sheet</Button>} />
      <DrawerContent side="bottom">
        <DrawerHeader><DrawerTitle>Bottom sheet</DrawerTitle><DrawerDescription>Slides up from the bottom.</DrawerDescription></DrawerHeader>
        <div className="px-6 pb-6 text-sm text-muted-foreground">Ideal for mobile-style overlays.</div>
      </DrawerContent>
    </Drawer>
  )
}
function DrawerWithFormPreview() {
  return <DrawerPreview />
}
function DrawerNestedSelectPreview() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline">Drawer + Select</Button>} />
      <DrawerContent side="right">
        <DrawerHeader><DrawerTitle>Settings</DrawerTitle></DrawerHeader>
        <div className="flex-1 px-6 space-y-4">
          <Field><FieldLabel>Theme</FieldLabel><FieldContent>
            <Select>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select theme" /></SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </FieldContent></Field>
        </div>
        <DrawerFooter><DrawerClose render={<Button variant="outline" className="w-full">Close</Button>} /></DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

// ─── Popover variants ─────────────────────────────────────────────────────────
function PopoverBasicPreview() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline">Open popover</Button>} />
      <PopoverContent><p className="text-sm">Simple popover content.</p></PopoverContent>
    </Popover>
  )
}
function PopoverPlacementPreview() {
  return (
    <div className="flex gap-2">
      {(["top", "bottom", "left", "right"] as const).map((side) => (
        <Popover key={side}>
          <PopoverTrigger render={<Button variant="outline" size="sm">{side}</Button>} />
          <PopoverContent side={side}><p className="text-sm">Placed on {side}</p></PopoverContent>
        </Popover>
      ))}
    </div>
  )
}
function PopoverWithFormPreview() {
  return <PopoverPreview />
}

// ─── Tooltip variants ─────────────────────────────────────────────────────────
function TooltipBasicPreview() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
        <TooltipContent>This is a tooltip</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
function TooltipPlacementPreview() {
  return (
    <TooltipProvider>
      <div className="flex gap-2">
        {(["top", "bottom", "left", "right"] as const).map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger render={<Button variant="outline" size="sm">{side}</Button>} />
            <TooltipContent side={side}>{side}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
function TooltipDelayGroupPreview() {
  return (
    <TooltipProvider delay={300}>
      <div className="flex gap-2">
        {["Save", "Share", "Copy"].map((label) => (
          <Tooltip key={label}>
            <TooltipTrigger render={<Button variant="outline" size="sm">{label}</Button>} />
            <TooltipContent>{label} action</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
function TooltipWithShortcutPreview() {
  return (
    <TooltipProvider>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" size="sm">Save</Button>} />
          <TooltipContent>Save document <kbd className="ml-2 rounded bg-muted px-1 py-0.5 text-[10px] font-mono">⌘S</kbd></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" size="sm">Undo</Button>} />
          <TooltipContent>Undo last action <kbd className="ml-2 rounded bg-muted px-1 py-0.5 text-[10px] font-mono">⌘Z</kbd></TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

// ─── Dropdown Menu variants ───────────────────────────────────────────────────
function DropdownMenuBasicPreview() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">Open menu</Button>} />
      <DropdownMenuContent>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
function DropdownMenuWithShortcutsPreview() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">Actions</Button>} />
      <DropdownMenuContent>
        <DropdownMenuItem>New file <DropdownMenuShortcut>⌘N</DropdownMenuShortcut></DropdownMenuItem>
        <DropdownMenuItem>Save <DropdownMenuShortcut>⌘S</DropdownMenuShortcut></DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Find <DropdownMenuShortcut>⌘F</DropdownMenuShortcut></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
function DropdownMenuCheckboxesPreview() {
  const [toolbar, setToolbar] = React.useState(true)
  const [statusBar, setStatusBar] = React.useState(false)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">View options</Button>} />
      <DropdownMenuContent>
        <DropdownMenuLabel>Toggle panels</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={toolbar} onCheckedChange={setToolbar}>Toolbar</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={statusBar} onCheckedChange={setStatusBar}>Status bar</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
function DropdownMenuRadioGroupPreview() {
  const [position, setPosition] = React.useState("bottom")
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">Position: {position}</Button>} />
      <DropdownMenuContent>
        <DropdownMenuLabel>Panel position</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
function DropdownMenuSubmenuPreview() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">More options</Button>} />
      <DropdownMenuContent>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Share</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Email</DropdownMenuItem>
            <DropdownMenuItem>Slack</DropdownMenuItem>
            <DropdownMenuItem>Copy link</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── Collapsible variants ─────────────────────────────────────────────────────
function CollapsibleBasicPreview() {
  return (
    <Collapsible className="w-full max-w-sm rounded-lg border border-border px-4">
      <CollapsibleTrigger>Show details</CollapsibleTrigger>
      <CollapsibleContent><div className="pb-4 text-sm text-muted-foreground">Hidden content revealed on click.</div></CollapsibleContent>
    </Collapsible>
  )
}
function CollapsibleControlledPreview() {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="flex flex-col gap-3 w-full max-w-sm">
      <Collapsible open={open} onOpenChange={setOpen} className="rounded-lg border border-border px-4">
        <CollapsibleTrigger>{open ? "Hide" : "Show"} details</CollapsibleTrigger>
        <CollapsibleContent><div className="pb-4 text-sm text-muted-foreground">Controlled open state: {String(open)}</div></CollapsibleContent>
      </Collapsible>
      <Button variant="outline" size="sm" onClick={() => setOpen((v) => !v)}>Toggle externally</Button>
    </div>
  )
}

// ─── Tabs variants ────────────────────────────────────────────────────────────
function TabsBasicPreview() {
  return (
    <Tabs defaultValue="tab1" className="w-full max-w-sm">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className="p-3 text-sm text-muted-foreground">Content for Tab 1</TabsContent>
      <TabsContent value="tab2" className="p-3 text-sm text-muted-foreground">Content for Tab 2</TabsContent>
      <TabsContent value="tab3" className="p-3 text-sm text-muted-foreground">Content for Tab 3</TabsContent>
    </Tabs>
  )
}
function TabsLinePreview() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-md">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="p-3 text-sm text-muted-foreground">Overview content with line-style indicator.</TabsContent>
      <TabsContent value="analytics" className="p-3 text-sm text-muted-foreground">Analytics dashboard.</TabsContent>
      <TabsContent value="reports" className="p-3 text-sm text-muted-foreground">Reports and summaries.</TabsContent>
    </Tabs>
  )
}
function TabsVerticalPreview() {
  return (
    <Tabs defaultValue="profile" orientation="vertical" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="p-3 text-sm text-muted-foreground">Profile settings</TabsContent>
      <TabsContent value="account" className="p-3 text-sm text-muted-foreground">Account settings</TabsContent>
      <TabsContent value="billing" className="p-3 text-sm text-muted-foreground">Billing details</TabsContent>
    </Tabs>
  )
}
function TabsVerticalLinePreview() {
  return (
    <Tabs defaultValue="general" orientation="vertical" className="w-full max-w-md">
      <TabsList variant="line">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="general" className="p-3 text-sm text-muted-foreground">General settings</TabsContent>
      <TabsContent value="security" className="p-3 text-sm text-muted-foreground">Security options</TabsContent>
      <TabsContent value="notifications" className="p-3 text-sm text-muted-foreground">Notification preferences</TabsContent>
    </Tabs>
  )
}
function TabsPillStylePreview() {
  return (
    <Tabs defaultValue="all" className="w-full max-w-sm">
      <TabsList className="bg-transparent gap-1 p-0">
        {["all", "active", "archived"].map((v) => (
          <TabsTrigger key={v} value={v} className="rounded-full border border-border data-active:bg-foreground data-active:text-background capitalize">{v}</TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="all" className="pt-3 text-sm text-muted-foreground">All items</TabsContent>
      <TabsContent value="active" className="pt-3 text-sm text-muted-foreground">Active items only</TabsContent>
      <TabsContent value="archived" className="pt-3 text-sm text-muted-foreground">Archived items</TabsContent>
    </Tabs>
  )
}
function TabsWithIconsPreview() {
  return (
    <Tabs defaultValue="profile" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="profile">
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Profile
        </TabsTrigger>
        <TabsTrigger value="settings">
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          Settings
        </TabsTrigger>
        <TabsTrigger value="notifications">
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          Notifications
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="p-3 text-sm text-muted-foreground">Manage your profile.</TabsContent>
      <TabsContent value="settings" className="p-3 text-sm text-muted-foreground">Adjust your preferences.</TabsContent>
      <TabsContent value="notifications" className="p-3 text-sm text-muted-foreground">Configure notifications.</TabsContent>
    </Tabs>
  )
}
function TabsDisabledPreview() {
  return (
    <Tabs defaultValue="active" className="w-full max-w-sm">
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
        <TabsTrigger value="other">Other</TabsTrigger>
      </TabsList>
      <TabsContent value="active" className="p-3 text-sm text-muted-foreground">Active tab content.</TabsContent>
      <TabsContent value="disabled" className="p-3 text-sm text-muted-foreground">This tab is disabled.</TabsContent>
      <TabsContent value="other" className="p-3 text-sm text-muted-foreground">Other tab content.</TabsContent>
    </Tabs>
  )
}

// ─── Accordion variants ───────────────────────────────────────────────────────
function AccordionBasicPreview() {
  return (
    <Accordion className="w-full max-w-sm">
      <AccordionItem value="a1"><AccordionTrigger>What is it?</AccordionTrigger><AccordionContent>A collapsible content section.</AccordionContent></AccordionItem>
      <AccordionItem value="a2"><AccordionTrigger>How does it work?</AccordionTrigger><AccordionContent>Click a trigger to expand or collapse the panel.</AccordionContent></AccordionItem>
    </Accordion>
  )
}
function AccordionMultiplePreview() {
  return (
    <Accordion multiple className="w-full max-w-sm">
      <AccordionItem value="m1"><AccordionTrigger>Section one</AccordionTrigger><AccordionContent>Both sections can be open at once.</AccordionContent></AccordionItem>
      <AccordionItem value="m2"><AccordionTrigger>Section two</AccordionTrigger><AccordionContent>Try opening both!</AccordionContent></AccordionItem>
      <AccordionItem value="m3"><AccordionTrigger>Section three</AccordionTrigger><AccordionContent>Multiple panels open simultaneously.</AccordionContent></AccordionItem>
    </Accordion>
  )
}
function AccordionDisabledPreview() {
  return (
    <Accordion className="w-full max-w-sm">
      <AccordionItem value="d1"><AccordionTrigger>Enabled section</AccordionTrigger><AccordionContent>This one works normally.</AccordionContent></AccordionItem>
      <AccordionItem value="d2" disabled><AccordionTrigger>Disabled section</AccordionTrigger><AccordionContent>You can't see this.</AccordionContent></AccordionItem>
    </Accordion>
  )
}

// ─── Progress variants ────────────────────────────────────────────────────────
function ProgressBasicPreview() {
  return (
    <div className="w-full max-w-xs space-y-3">
      <Progress value={25} />
      <Progress value={60} />
      <Progress value={90} />
    </div>
  )
}
function ProgressIndeterminatePreview() {
  return (
    <div className="w-full max-w-xs">
      <Progress value={null} />
      <p className="mt-2 text-xs text-muted-foreground">Indeterminate — pass null or omit value</p>
    </div>
  )
}
function ProgressWithLabelAndValuePreview() {
  return (
    <div className="w-full max-w-xs space-y-3">
      <Progress value={72}>
        <ProgressLabel>Uploading files</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={45}>
        <ProgressLabel>Processing</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  )
}

// ─── Slider variants ──────────────────────────────────────────────────────────
function SliderPreview() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-xs">
      <Slider defaultValue={[40]} />
      <Slider defaultValue={[20, 80]} />
    </div>
  )
}
function SliderBasicPreview() {
  return <Slider defaultValue={[50]} className="max-w-xs" />
}
function SliderRangePreview() {
  const [value, setValue] = React.useState([20, 80])
  return (
    <div className="flex flex-col gap-2 max-w-xs w-full">
      <Slider value={value} onValueChange={(v) => setValue(Array.isArray(v) ? [...v] : [v])} />
      <p className="text-xs text-muted-foreground">Range: {value[0]} – {value[1]}</p>
    </div>
  )
}
function SliderVerticalPreview() {
  return (
    <div className="flex gap-6 h-32 items-center">
      <Slider defaultValue={[30]} orientation="vertical" />
      <Slider defaultValue={[60]} orientation="vertical" />
      <Slider defaultValue={[80]} orientation="vertical" />
    </div>
  )
}
function SliderWithStepsPreview() {
  const [value, setValue] = React.useState([25])
  return (
    <div className="flex flex-col gap-2 max-w-xs w-full">
      <Slider value={value} onValueChange={(v) => setValue(Array.isArray(v) ? [...v] : [v])} step={25} min={0} max={100} />
      <p className="text-xs text-muted-foreground">Step: 25 · Value: {value[0]}</p>
    </div>
  )
}
function SliderDisabledPreview() {
  return <Slider defaultValue={[50]} disabled className="max-w-xs" />
}

// ─── Separator variants ───────────────────────────────────────────────────────
function SeparatorHorizontalPreview() {
  return (
    <div className="w-full max-w-xs">
      <p className="text-sm font-medium">Above</p>
      <Separator className="my-3" />
      <p className="text-sm text-muted-foreground">Below</p>
    </div>
  )
}
function SeparatorVerticalPreview() {
  return (
    <div className="flex items-center gap-3 h-6">
      <span className="text-sm">Left</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Center</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Right</span>
    </div>
  )
}

// ─── Field variants ───────────────────────────────────────────────────────────
function FieldPreview() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <Field>
        <FieldLabel>Username</FieldLabel>
        <FieldContent><Input placeholder="johndoe" /></FieldContent>
        <FieldDescription>Your public display name.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel>Email <span className="text-destructive">*</span></FieldLabel>
        <FieldContent><Input type="email" placeholder="you@example.com" /></FieldContent>
      </Field>
    </div>
  )
}
function FieldVerticalPreview() {
  return (
    <Field className="max-w-xs">
      <FieldLabel>Full name</FieldLabel>
      <FieldContent><Input placeholder="Aria Chen" /></FieldContent>
      <FieldDescription>As it appears on your ID.</FieldDescription>
    </Field>
  )
}
function FieldHorizontalPreview() {
  return (
    <Field orientation="horizontal" className="max-w-sm items-center">
      <FieldLabel className="w-24 shrink-0">Name</FieldLabel>
      <FieldContent><Input placeholder="Aria Chen" /></FieldContent>
    </Field>
  )
}
function FieldWithErrorPreview() {
  return (
    <Field className="max-w-xs" data-invalid="true">
      <FieldLabel>Email</FieldLabel>
      <FieldContent><Input type="email" defaultValue="not-an-email" /></FieldContent>
      <FieldDescription>Enter a valid email address.</FieldDescription>
    </Field>
  )
}
function FieldFieldsetPreview() {
  return (
    <fieldset className="max-w-sm space-y-3 rounded-lg border border-border p-4">
      <legend className="px-1 text-sm font-medium -mt-7 bg-background">Contact</legend>
      <Field>
        <FieldLabel>Name</FieldLabel>
        <FieldContent><Input placeholder="Your name" /></FieldContent>
      </Field>
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldContent><Input type="email" placeholder="you@example.com" /></FieldContent>
      </Field>
    </fieldset>
  )
}

// ─── InputGroup variants ──────────────────────────────────────────────────────
function InputGroupDemoPreview() {
  return <InputGroupPreview />
}
function InputGroupTextareaPreview() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupAddon data-align="block-start">
        <InputGroupText>Note</InputGroupText>
      </InputGroupAddon>
      <InputGroupTextarea placeholder="Enter a note..." rows={3} />
    </InputGroup>
  )
}
function InputGroupWithBothAddonsPreview() {
  return (
    <InputGroup className="max-w-xs">
      <InputGroupAddon data-align="inline-start"><InputGroupText>$</InputGroupText></InputGroupAddon>
      <InputGroupInput placeholder="0.00" />
      <InputGroupAddon data-align="inline-end"><InputGroupText>USD</InputGroupText></InputGroupAddon>
    </InputGroup>
  )
}
function InputGroupWithPrefixPreview() {
  return (
    <InputGroup className="max-w-xs">
      <InputGroupAddon data-align="inline-start">
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="example.com" />
    </InputGroup>
  )
}
function InputGroupWithSuffixButtonPreview() {
  return (
    <InputGroup className="max-w-xs">
      <InputGroupInput placeholder="Search..." />
      <InputGroupButton>Go</InputGroupButton>
    </InputGroup>
  )
}

// ─── Export map ────────────────────────────────────────────────────────────
export const previewMap: Record<string, React.ComponentType> = {
  // Base keys (existing)
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
  "toast-demo": ToastPreview,
  "toast-with-action": ToastWithActionPreview,
  "toast-promise": ToastPromisePreview,
  "toast-custom-data": ToastCustomPreview,
  "toast-variants": ToastVariantsPreview,
  "toast-positions": ToastPositionsDemo,
  "toast-top-left": ToastTopLeftPreview,
  "toast-top-center": ToastTopCenterPreview,
  "toast-top-right": ToastTopRightPreview,
  "toast-bottom-left": ToastBottomLeftPreview,
  "toast-bottom-center": ToastBottomCenterPreview,
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
  slider: SliderPreview,
  field: FieldPreview,
  "input-group": InputGroupDemoPreview,
  // Named variant keys
  "button-demo": ButtonPreview,
  "button-variants": ButtonVariantsPreview,
  "button-sizes": ButtonSizesPreview,
  "button-loading": ButtonLoadingPreview,
  "button-with-icon": ButtonWithIconPreview,
  "badge-demo": BadgePreview,
  "badge-variants": BadgeVariantsPreview,
  "badge-pill": BadgePillPreview,
  "badge-sizes": BadgeSizesPreview,
  "avatar-demo": AvatarPreview,
  "avatar-basic": AvatarBasicPreview,
  "avatar-with-badge": AvatarWithBadgePreview,
  "avatar-group": AvatarGroupPreview,
  "avatar-sizes": AvatarSizesPreview,
  "checkbox-demo": CheckboxPreview,
  "checkbox-basic": CheckboxBasicPreview,
  "checkbox-with-label": CheckboxWithLabelPreview,
  "checkbox-disabled": CheckboxDisabledPreview,
  "checkbox-indeterminate": CheckboxIndeterminatePreview,
  "switch-demo": SwitchPreview,
  "switch-basic": SwitchBasicPreview,
  "switch-with-label-and-description": SwitchWithLabelAndDescriptionPreview,
  "switch-controlled": SwitchControlledPreview,
  "switch-disabled": SwitchDisabledPreview,
  "radio-group-demo": RadioGroupPreview,
  "radio-group-basic": RadioGroupBasicPreview,
  "radio-group-with-labels": RadioGroupWithLabelsPreview,
  "radio-group-horizontal": RadioGroupHorizontalPreview,
  "radio-group-disabled": RadioGroupDisabledPreview,
  "input-demo": InputPreview,
  "input-basic": InputBasicPreview,
  "input-with-field": InputWithFieldPreview,
  "input-sizes": InputSizesPreview,
  "input-disabled": InputDisabledPreview,
  "input-group-demo": InputGroupDemoPreview,
  "input-group-textarea": InputGroupTextareaPreview,
  "input-group-with-both-addons": InputGroupWithBothAddonsPreview,
  "input-group-with-prefix": InputGroupWithPrefixPreview,
  "input-group-with-suffix-button": InputGroupWithSuffixButtonPreview,
  "textarea-demo": TextareaPreview,
  "textarea-basic": TextareaBasicPreview,
  "textarea-with-field": TextareaWithFieldPreview,
  "textarea-auto-resize": TextareaAutoResizePreview,
  "textarea-disabled": TextareaDisabledPreview,
  "select-demo": SelectPreview,
  "select-basic": SelectBasicPreview,
  "select-with-groups": SelectWithGroupsPreview,
  "select-sizes": SelectSizesPreview,
  "select-disabled": SelectDisabledPreview,
  "select-controlled": SelectControlledPreview,
  "combobox-demo": ComboboxPreview,
  "combobox-basic": ComboboxBasicPreview,
  "combobox-async": ComboboxAsyncPreview,
  "combobox-multi-select-with-chips": ComboboxMultiSelectWithChipsPreview,
  "combobox-with-groups": ComboboxWithGroupsPreview,
  "autocomplete-demo": AutocompletePreview,
  "autocomplete-basic": AutocompleteBasicPreview,
  "autocomplete-async": AutocompletePreview,
  "autocomplete-with-clear-button": AutocompleteWithClearButtonPreview,
  "dialog-demo": DialogPreview,
  "dialog-basic": DialogBasicPreview,
  "dialog-no-close-button": DialogNoCloseButtonPreview,
  "dialog-scrollable": DialogScrollablePreview,
  "dialog-fullscreen": DialogFullscreenPreview,
  "dialog-sizes": DialogSizesPreview,
  "alert-dialog-demo": AlertDialogPreview,
  "alert-dialog-basic": AlertDialogBasicPreview,
  "alert-dialog-destructive": AlertDialogDestructivePreview,
  "drawer-demo": DrawerPreview,
  "drawer-right": DrawerRightPreview,
  "drawer-left": DrawerLeftPreview,
  "drawer-bottom-sheet": DrawerBottomSheetPreview,
  "drawer-with-form": DrawerWithFormPreview,
  "drawer-nested-select": DrawerNestedSelectPreview,
  "popover-demo": PopoverPreview,
  "popover-basic": PopoverBasicPreview,
  "popover-placement": PopoverPlacementPreview,
  "popover-with-form": PopoverWithFormPreview,
  "tooltip-demo": TooltipPreview,
  "tooltip-basic": TooltipBasicPreview,
  "tooltip-placement": TooltipPlacementPreview,
  "tooltip-delay-group": TooltipDelayGroupPreview,
  "tooltip-with-shortcut": TooltipWithShortcutPreview,
  "dropdown-menu-demo": DropdownMenuPreview,
  "dropdown-menu-basic": DropdownMenuBasicPreview,
  "dropdown-menu-with-shortcuts": DropdownMenuWithShortcutsPreview,
  "dropdown-menu-checkboxes": DropdownMenuCheckboxesPreview,
  "dropdown-menu-radio-group": DropdownMenuRadioGroupPreview,
  "dropdown-menu-submenu": DropdownMenuSubmenuPreview,
  "collapsible-demo": CollapsiblePreview,
  "collapsible-basic": CollapsibleBasicPreview,
  "collapsible-controlled": CollapsibleControlledPreview,
  "tabs-demo": TabsPreview,
  "tabs-basic": TabsBasicPreview,
  "tabs-line": TabsLinePreview,
  "tabs-vertical": TabsVerticalPreview,
  "tabs-vertical-line": TabsVerticalLinePreview,
  "tabs-pill-style": TabsPillStylePreview,
  "tabs-with-icons": TabsWithIconsPreview,
  "tabs-disabled": TabsDisabledPreview,
  "accordion-demo": AccordionPreview,
  "accordion-basic": AccordionBasicPreview,
  "accordion-multiple": AccordionMultiplePreview,
  "accordion-disabled": AccordionDisabledPreview,
  "progress-demo": ProgressPreview,
  "progress-basic": ProgressBasicPreview,
  "progress-indeterminate": ProgressIndeterminatePreview,
  "progress-with-label-and-value": ProgressWithLabelAndValuePreview,
  "slider-demo": SliderPreview,
  "slider-basic": SliderBasicPreview,
  "slider-range": SliderRangePreview,
  "slider-vertical": SliderVerticalPreview,
  "slider-with-steps": SliderWithStepsPreview,
  "slider-disabled": SliderDisabledPreview,
  "separator-demo": SeparatorPreview,
  "separator-horizontal": SeparatorHorizontalPreview,
  "separator-vertical": SeparatorVerticalPreview,
  "field-demo": FieldPreview,
  "field-vertical": FieldVerticalPreview,
  "field-horizontal": FieldHorizontalPreview,
  "field-with-error": FieldWithErrorPreview,
  "field-fieldset": FieldFieldsetPreview,
}
