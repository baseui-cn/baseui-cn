"use client"

import * as React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export function HomeShowcase() {
  const [saved, setSaved] = React.useState(false)
  return (
    <div className="home-showcase" aria-label="Interactive V2 component showcase">
      <div className="home-showcase-heading">
        <span>Make it yours</span>
        <Badge variant="outline">Design System V2</Badge>
      </div>
      <div className="grid gap-[20px]">
        <Field>
          <FieldLabel htmlFor="showcase-name">Project name</FieldLabel>
          <Input
            id="showcase-name"
            defaultValue="My next project"
            onChange={() => setSaved(false)}
          />
        </Field>
        <Field>
          <FieldLabel>Framework</FieldLabel>
          <Select
            defaultValue="next"
            items={{ next: "Next.js", remix: "Remix", vite: "Vite" }}
            onValueChange={() => setSaved(false)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="next">Next.js</SelectItem>
              <SelectItem value="remix">Remix</SelectItem>
              <SelectItem value="vite">Vite</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <label className="flex min-h-[44px] items-center justify-between gap-[16px] text-[14px]">
          <span>Email notifications</span>
          <Switch defaultChecked onCheckedChange={() => setSaved(false)} />
        </label>
        <div className="flex flex-wrap items-center gap-[12px]">
          <Button onClick={() => setSaved(true)}>Try the components</Button>
          <Button variant="ghost" render={<Link href="/docs/components/field" />}>
            View source
          </Button>
        </div>
        <p role="status" className="text-[12px] leading-[18px] text-muted-foreground">
          {saved
            ? "All yours. This preview stays in your browser."
            : "Real components. Edit, select and toggle to explore."}
        </p>
      </div>
    </div>
  )
}
