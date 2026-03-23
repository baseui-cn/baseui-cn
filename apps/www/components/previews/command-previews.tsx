"use client"

import * as React from "react"

import { Command } from "@/components/ui/command"

function CommandPreview() {
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

export const commandPreviewMap: Record<string, React.ComponentType> = {
  command: CommandPreview,
  "command-demo": CommandPreview,
}
