"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

export function DocsContentTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div key={pathname} className="animate-docs-route-enter">
      {children}
    </div>
  )
}
