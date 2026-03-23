"use client"

import * as React from "react"

import { EmptyState, EmptyStateIcons, LoginBlock } from "@/components/ui/blocks"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

function EmptyStatePreview() {
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

function LoginPreview() {
  return (
    <LoginBlock
      title="Welcome back"
      description="Sign in to your account"
      showSocial={false}
      onSubmit={async () => {}}
    />
  )
}

function AppShellPreview() {
  const [active, setActive] = React.useState("dashboard")
  const nav = [
    { id: "dashboard", label: "Dashboard", href: "#" },
    { id: "projects", label: "Projects", href: "#" },
    { id: "team", label: "Team", href: "#" },
    { id: "settings", label: "Settings", href: "#" },
  ]
  return (
    <div className="w-full rounded-lg border border-border overflow-hidden h-64 flex">
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
              className={`flex items-center rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors text-left w-full ${active === item.id
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
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

export const blocksPreviewMap: Record<string, React.ComponentType> = {
  "empty-state": EmptyStatePreview,
  "empty-state-demo": EmptyStatePreview,
  login: LoginPreview,
  "login-demo": LoginPreview,
  "app-shell": AppShellPreview,
  "app-shell-demo": AppShellPreview,
}
