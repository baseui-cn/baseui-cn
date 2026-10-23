"use client"

import * as React from "react"
import * as Tabs from "@/components/ui/tabs"
import * as Accordion from "@/components/ui/accordion"
import * as Collapsible from "@/components/ui/collapsible"
import * as Navigation from "@/components/ui/navigation-menu"
import * as Breadcrumb from "@/components/ui/breadcrumb"
import * as Pagination from "@/components/ui/pagination"
import * as Menubar from "@/components/ui/menubar"
import { Button } from "@/components/ui/button"

export function Phase6SystemPreview() {
  const [tab, setTab] = React.useState<string | number | null>("overview")
  const [open, setOpen] = React.useState(false)
  const [page, setPage] = React.useState(2)

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <Breadcrumb.Breadcrumb>
        <Breadcrumb.BreadcrumbList>
          <Breadcrumb.BreadcrumbItem>
            <Breadcrumb.BreadcrumbLink href="#system-specimen">Workspace</Breadcrumb.BreadcrumbLink>
          </Breadcrumb.BreadcrumbItem>
          <Breadcrumb.BreadcrumbSeparator />
          <Breadcrumb.BreadcrumbItem>
            <Breadcrumb.BreadcrumbPage>Project settings</Breadcrumb.BreadcrumbPage>
          </Breadcrumb.BreadcrumbItem>
        </Breadcrumb.BreadcrumbList>
      </Breadcrumb.Breadcrumb>

      <Tabs.Tabs value={tab} onValueChange={setTab}>
        <Tabs.TabsList variant="line" aria-label="Project settings">
          <Tabs.TabsTab value="overview">Overview</Tabs.TabsTab>
          <Tabs.TabsTab value="activity">Activity</Tabs.TabsTab>
          <Tabs.TabsTab value="archived" disabled>
            Archived
          </Tabs.TabsTab>
        </Tabs.TabsList>
        <Tabs.TabsPanel value="overview" className="py-2 text-sm">
          Project overview and preferences.
        </Tabs.TabsPanel>
        <Tabs.TabsPanel value="activity" className="py-2 text-sm">
          Recent project activity.
        </Tabs.TabsPanel>
      </Tabs.Tabs>

      <Accordion.Accordion className="w-full" defaultValue={["access"]}>
        <Accordion.AccordionItem value="access">
          <Accordion.AccordionTrigger>Who can access this project?</Accordion.AccordionTrigger>
          <Accordion.AccordionPanel>
            Only invited workspace members can view this project.
          </Accordion.AccordionPanel>
        </Accordion.AccordionItem>
        <Accordion.AccordionItem value="history">
          <Accordion.AccordionTrigger>Where is project history?</Accordion.AccordionTrigger>
          <Accordion.AccordionPanel>
            Open Activity to review recent changes.
          </Accordion.AccordionPanel>
        </Accordion.AccordionItem>
        <Accordion.AccordionItem value="locked" disabled>
          <Accordion.AccordionTrigger>Organization policy (unavailable)</Accordion.AccordionTrigger>
          <Accordion.AccordionPanel>Contact an administrator.</Accordion.AccordionPanel>
        </Accordion.AccordionItem>
      </Accordion.Accordion>

      <Collapsible.Collapsible open={open} onOpenChange={setOpen}>
        <Collapsible.CollapsibleTrigger render={<Button variant="ghost" size="sm" />}>
          {open ? "Hide" : "Show"} project details
        </Collapsible.CollapsibleTrigger>
        <Collapsible.CollapsiblePanel>
          <p className="py-3 text-sm text-muted-foreground">
            Created by the Design team. Changes are saved automatically.
          </p>
        </Collapsible.CollapsiblePanel>
      </Collapsible.Collapsible>

      <Navigation.NavigationMenu aria-label="Project navigation">
        <Navigation.NavigationMenuList>
          <Navigation.NavigationMenuItem>
            <Navigation.NavigationMenuTrigger>Project</Navigation.NavigationMenuTrigger>
            <Navigation.NavigationMenuContent>
              <ul className="w-64">
                <li>
                  <Navigation.NavigationMenuLink href="#system-specimen" active>
                    Overview
                  </Navigation.NavigationMenuLink>
                </li>
                <li>
                  <Navigation.NavigationMenuLink href="#examples" closeOnClick>
                    Examples
                  </Navigation.NavigationMenuLink>
                </li>
              </ul>
            </Navigation.NavigationMenuContent>
          </Navigation.NavigationMenuItem>
          <Navigation.NavigationMenuItem>
            <Navigation.NavigationMenuTrigger>Resources</Navigation.NavigationMenuTrigger>
            <Navigation.NavigationMenuContent>
              <ul className="w-64">
                <li>
                  <Navigation.NavigationMenuLink href="/docs">
                    Documentation
                  </Navigation.NavigationMenuLink>
                </li>
                <li>
                  <Navigation.NavigationMenuLink href="/docs/installation">
                    Installation
                  </Navigation.NavigationMenuLink>
                </li>
              </ul>
            </Navigation.NavigationMenuContent>
          </Navigation.NavigationMenuItem>
        </Navigation.NavigationMenuList>
      </Navigation.NavigationMenu>

      <Pagination.Pagination aria-label="Activity pages">
        <Pagination.PaginationContent>
          {[1, 2, 3].map((number) => (
            <Pagination.PaginationItem key={number}>
              <Pagination.PaginationLink
                href="#system-specimen"
                isActive={page === number}
                aria-label={`Page ${number}`}
                onClick={(event) => {
                  event.preventDefault()
                  setPage(number)
                }}
              >
                {number}
              </Pagination.PaginationLink>
            </Pagination.PaginationItem>
          ))}
        </Pagination.PaginationContent>
      </Pagination.Pagination>

      <Menubar.Menubar aria-label="Project commands">
        <Menubar.MenubarMenu>
          <Menubar.MenubarTrigger>File</Menubar.MenubarTrigger>
          <Menubar.MenubarContent>
            <Menubar.MenubarItem>New project</Menubar.MenubarItem>
            <Menubar.MenubarItem disabled>Export (unavailable)</Menubar.MenubarItem>
          </Menubar.MenubarContent>
        </Menubar.MenubarMenu>
        <Menubar.MenubarMenu>
          <Menubar.MenubarTrigger>Edit</Menubar.MenubarTrigger>
          <Menubar.MenubarContent>
            <Menubar.MenubarItem>Undo</Menubar.MenubarItem>
          </Menubar.MenubarContent>
        </Menubar.MenubarMenu>
      </Menubar.Menubar>
    </div>
  )
}
