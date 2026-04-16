"use client"

import * as React from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function TabsPreview() {
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
      <TabsList variant="underline">
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
      <TabsList variant="underline">
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
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          Profile
        </TabsTrigger>
        <TabsTrigger value="settings">
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
          Settings
        </TabsTrigger>
        <TabsTrigger value="notifications">
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
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

export const tabsPreviewMap: Record<string, React.ComponentType> = {
  tabs: TabsPreview,
  "tabs-demo": TabsPreview,
  "tabs-basic": TabsBasicPreview,
  "tabs-line": TabsLinePreview,
  "tabs-vertical": TabsVerticalPreview,
  "tabs-vertical-line": TabsVerticalLinePreview,
  "tabs-pill-style": TabsPillStylePreview,
  "tabs-with-icons": TabsWithIconsPreview,
  "tabs-disabled": TabsDisabledPreview,
}
