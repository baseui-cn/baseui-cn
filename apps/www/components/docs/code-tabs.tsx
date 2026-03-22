"use client"

import * as React from "react"
import { Tabs } from "@/components/ui/tabs"

export function CodeTabs({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6">
      <Tabs defaultValue="cli">{children}</Tabs>
    </div>
  )
}
