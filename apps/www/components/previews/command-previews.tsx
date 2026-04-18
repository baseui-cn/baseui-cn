"use client"

import type * as React from "react"
import CommandPalettePreview from "@/components/previews/command/p-command-1"
import { CCommand1 as CommandAiPreview } from "@/components/previews/command/p-command-2"

export const commandPreviewMap: Record<string, React.ComponentType> = {
  command: CommandPalettePreview,
  "command-demo": CommandPalettePreview,
  "command-ai-demo": CommandAiPreview,
}
