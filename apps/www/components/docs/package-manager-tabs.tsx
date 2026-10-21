"use client"

import * as React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CodeBlock } from "./code-block"
import { trackCopyInstallCommand } from "@/lib/events"

const MANAGERS = ["npx", "pnpm dlx", "yarn dlx", "bunx"] as const

export function PackageManagerTabs({ command }: { command: string }) {
  return (
    <Tabs defaultValue="npx" className="package-manager-tabs">
      <TabsList variant="underline" aria-label="Package manager">
        {MANAGERS.map((pm) => (
          <TabsTrigger key={pm} value={pm}>
            {pm}
          </TabsTrigger>
        ))}
      </TabsList>
      {MANAGERS.map((pm) => (
        <TabsContent key={pm} value={pm}>
          <CodeBlock
            code={`${pm} ${command}`}
            language="Terminal"
            onCopied={() => trackCopyInstallCommand(command, pm)}
          />
        </TabsContent>
      ))}
    </Tabs>
  )
}
