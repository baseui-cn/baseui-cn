import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Docs",
}

export default function DocsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Documentation</h1>
      <p className="text-muted-foreground">Welcome to the baseui-cn docs.</p>
    </div>
  )
}
