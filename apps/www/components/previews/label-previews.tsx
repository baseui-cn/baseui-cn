"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function LabelPreview() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email-demo">Email address</Label>
        <Input id="email-demo" placeholder="you@example.com" type="email" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="company-demo">Company name</Label>
        <Input id="company-demo" placeholder="Acme Inc." />
      </div>
    </div>
  )
}

export const labelPreviewMap: Record<string, React.ComponentType> = {
  label: LabelPreview,
  "label-demo": LabelPreview,
}
