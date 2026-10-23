"use client"

import * as React from "react"
import { CopyIcon, DownloadIcon, TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PreviewCard, PreviewCardContent, PreviewCardTrigger } from "@/components/ui/preview-card"
import * as Menu from "@/components/ui/dropdown-menu"
import * as Bar from "@/components/ui/menubar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

function ActionMenu({
  nested = false,
  onAction,
}: {
  nested?: boolean
  onAction: (action: string) => void
}) {
  const [checked, setChecked] = React.useState(true)
  const [density, setDensity] = React.useState("comfortable")
  return (
    <Menu.DropdownMenu>
      <Menu.DropdownMenuTrigger
        id={nested ? "p4-nested-menu" : "p4-menu"}
        render={<Button variant="outline" />}
      >
        {nested ? "Form actions" : "Project actions"}
      </Menu.DropdownMenuTrigger>
      <Menu.DropdownMenuContent className="w-[280px]" aria-label="Project actions">
        <Menu.DropdownMenuGroup>
          <Menu.DropdownMenuLabel>Project</Menu.DropdownMenuLabel>
          <Menu.DropdownMenuItem onClick={() => onAction("Opened project")}>
            Open project <Menu.DropdownMenuShortcut>⌘O</Menu.DropdownMenuShortcut>
          </Menu.DropdownMenuItem>
          <Menu.DropdownMenuItem onClick={() => onAction("Copied link")}>
            <CopyIcon aria-hidden="true" />
            <span data-slot="menu-item-text">
              Copy link<span data-slot="menu-item-description">Share with your team</span>
            </span>
            <Menu.DropdownMenuShortcut>⌘⇧C</Menu.DropdownMenuShortcut>
          </Menu.DropdownMenuItem>
          <Menu.DropdownMenuItem disabled onClick={() => onAction("Disabled action fired")}>
            Export archive <Menu.DropdownMenuShortcut>⌘E</Menu.DropdownMenuShortcut>
          </Menu.DropdownMenuItem>
        </Menu.DropdownMenuGroup>
        <Menu.DropdownMenuSeparator />
        <Menu.DropdownMenuCheckboxItem
          checked={checked}
          onCheckedChange={setChecked}
          closeOnClick={false}
        >
          Show activity
        </Menu.DropdownMenuCheckboxItem>
        <Menu.DropdownMenuGroup>
          <Menu.DropdownMenuLabel>Density</Menu.DropdownMenuLabel>
          <Menu.DropdownMenuRadioGroup value={density} onValueChange={setDensity}>
            <Menu.DropdownMenuRadioItem value="comfortable" closeOnClick={false}>
              Comfortable
            </Menu.DropdownMenuRadioItem>
            <Menu.DropdownMenuRadioItem value="compact" closeOnClick={false}>
              Compact
            </Menu.DropdownMenuRadioItem>
          </Menu.DropdownMenuRadioGroup>
        </Menu.DropdownMenuGroup>
        <Menu.DropdownMenuSeparator />
        <Menu.DropdownMenuSub>
          <Menu.DropdownMenuSubTrigger>Share</Menu.DropdownMenuSubTrigger>
          <Menu.DropdownMenuSubContent aria-label="Share project">
            <Menu.DropdownMenuItem onClick={() => onAction("Invited teammate")}>
              Invite teammate
            </Menu.DropdownMenuItem>
            <Menu.DropdownMenuSub>
              <Menu.DropdownMenuSubTrigger>Download</Menu.DropdownMenuSubTrigger>
              <Menu.DropdownMenuSubContent aria-label="Download format">
                <Menu.DropdownMenuItem onClick={() => onAction("Downloaded PDF")}>
                  <DownloadIcon aria-hidden="true" />
                  PDF
                </Menu.DropdownMenuItem>
                <Menu.DropdownMenuItem onClick={() => onAction("Downloaded CSV")}>
                  CSV
                </Menu.DropdownMenuItem>
              </Menu.DropdownMenuSubContent>
            </Menu.DropdownMenuSub>
          </Menu.DropdownMenuSubContent>
        </Menu.DropdownMenuSub>
        <Menu.DropdownMenuSub>
          <Menu.DropdownMenuSubTrigger disabled>
            Unavailable integrations
          </Menu.DropdownMenuSubTrigger>
          <Menu.DropdownMenuSubContent>
            <Menu.DropdownMenuItem>Connect</Menu.DropdownMenuItem>
          </Menu.DropdownMenuSubContent>
        </Menu.DropdownMenuSub>
        <Menu.DropdownMenuSeparator />
        <Menu.DropdownMenuItem variant="destructive" onClick={() => onAction("Deleted draft")}>
          <TrashIcon aria-hidden="true" />
          Delete draft
        </Menu.DropdownMenuItem>
      </Menu.DropdownMenuContent>
    </Menu.DropdownMenu>
  )
}

export function Phase4SystemPreview() {
  const [action, setAction] = React.useState("No action yet")
  const [status, setStatus] = React.useState(true)
  const [view, setView] = React.useState("list")
  return (
    <div id="phase4-system" className="flex w-full min-w-0 flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Popover>
          <PopoverTrigger id="p4-popover" render={<Button variant="outline" />}>
            Edit project
          </PopoverTrigger>
          <PopoverContent id="p4-form" align="start">
            <PopoverHeader>
              <PopoverTitle>Project details</PopoverTitle>
              <PopoverDescription>Changes stay in this local specimen.</PopoverDescription>
            </PopoverHeader>
            <Field>
              <FieldLabel htmlFor="p4-name">Name</FieldLabel>
              <Input id="p4-name" defaultValue="Design system" />
            </Field>
            <Field>
              <FieldLabel id="p4-team-label">Team</FieldLabel>
              <Select
                defaultValue="Design"
                items={{ Design: "Design", Engineering: "Engineering" }}
              >
                <SelectTrigger id="p4-select" aria-labelledby="p4-team-label" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="p4-owner">Owner</FieldLabel>
              <Combobox items={["Amara", "Dev", "Jun"]}>
                <ComboboxInput
                  id="p4-owner"
                  className="w-full"
                  autoFocus={false}
                  placeholder="Find a teammate"
                  showClear
                />
                <ComboboxContent>
                  <ComboboxList>
                    {(person) => (
                      <ComboboxItem key={person} value={person}>
                        {person}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>
            <ActionMenu nested onAction={setAction} />
            <Button id="p4-save" onClick={() => setAction("Saved project")}>
              Save changes
            </Button>
          </PopoverContent>
        </Popover>
        <TooltipProvider delay={300}>
          <Tooltip>
            <TooltipTrigger id="p4-tooltip" render={<Button variant="outline" />}>
              Export help
            </TooltipTrigger>
            <TooltipContent>Export a copy of this project.</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <PreviewCard>
          <PreviewCardTrigger
            id="p4-preview"
            href="#phase4-system"
            delay={300}
            closeDelay={300}
            className="underline underline-offset-4"
          >
            About this project
          </PreviewCardTrigger>
          <PreviewCardContent id="p4-preview-content">
            <strong>Design System V2</strong>
            <p>
              A shared vocabulary for focused product work. This preview keeps longer informational
              content readable within the available viewport.
            </p>
            <a href="#phase4-system" className="underline underline-offset-4">
              Read project notes
            </a>
          </PreviewCardContent>
        </PreviewCard>
        <ActionMenu onAction={setAction} />
      </div>
      <Bar.Menubar aria-label="Project menu">
        <Bar.MenubarMenu>
          <Bar.MenubarTrigger id="p4-file">File</Bar.MenubarTrigger>
          <Bar.MenubarContent aria-label="File">
            <Bar.MenubarItem onClick={() => setAction("New project")}>
              New project<Bar.MenubarShortcut>⌘N</Bar.MenubarShortcut>
            </Bar.MenubarItem>
            <Bar.MenubarItem disabled>Open recent</Bar.MenubarItem>
            <Bar.MenubarSub>
              <Bar.MenubarSubTrigger>Export</Bar.MenubarSubTrigger>
              <Bar.MenubarSubContent aria-label="Export">
                <Bar.MenubarItem onClick={() => setAction("Exported PDF")}>PDF</Bar.MenubarItem>
                <Bar.MenubarItem>CSV</Bar.MenubarItem>
              </Bar.MenubarSubContent>
            </Bar.MenubarSub>
            <Bar.MenubarSeparator />
            <Bar.MenubarItem variant="destructive" onClick={() => setAction("Closed project")}>
              Close project
            </Bar.MenubarItem>
          </Bar.MenubarContent>
        </Bar.MenubarMenu>
        <Bar.MenubarMenu>
          <Bar.MenubarTrigger id="p4-view">View</Bar.MenubarTrigger>
          <Bar.MenubarContent aria-label="View">
            <Bar.MenubarGroup>
              <Bar.MenubarLabel>Workspace</Bar.MenubarLabel>
              <Bar.MenubarCheckboxItem
                checked={status}
                onCheckedChange={setStatus}
                closeOnClick={false}
              >
                Status bar
              </Bar.MenubarCheckboxItem>
            </Bar.MenubarGroup>
            <Bar.MenubarRadioGroup value={view} onValueChange={setView}>
              <Bar.MenubarRadioItem value="list" closeOnClick={false}>
                List
              </Bar.MenubarRadioItem>
              <Bar.MenubarRadioItem value="grid" closeOnClick={false}>
                Grid
              </Bar.MenubarRadioItem>
            </Bar.MenubarRadioGroup>
          </Bar.MenubarContent>
        </Bar.MenubarMenu>
      </Bar.Menubar>
      <output className="text-sm text-muted-foreground" aria-live="polite">
        {action}
      </output>
    </div>
  )
}
