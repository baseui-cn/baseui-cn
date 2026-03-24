"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function SelectPreview() {
  return (
    <Select>
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Select a framework..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Frameworks</SelectLabel>
          <SelectItem value="next">Next.js</SelectItem>
          <SelectItem value="remix">Remix</SelectItem>
          <SelectItem value="astro">Astro</SelectItem>
          <SelectItem value="nuxt">Nuxt</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

function SelectBasicPreview() {
  return (
    <Select>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Pick one..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">Option A</SelectItem>
        <SelectItem value="b">Option B</SelectItem>
        <SelectItem value="c">Option C</SelectItem>
      </SelectContent>
    </Select>
  )
}

function SelectWithGroupsPreview() {
  return (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select framework..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>React</SelectLabel>
          <SelectItem value="next">Next.js</SelectItem>
          <SelectItem value="remix">Remix</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Vue</SelectLabel>
          <SelectItem value="nuxt">Nuxt</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

function SelectDisabledPreview() {
  return (
    <Select disabled>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Disabled select" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="x">Item</SelectItem>
      </SelectContent>
    </Select>
  )
}

function SelectControlledPreview() {
  const [val, setVal] = React.useState("next")
  return (
    <div className="flex flex-col gap-2">
      <Select value={val} onValueChange={(v) => v && setVal(v)}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="next">Next.js</SelectItem>
          <SelectItem value="remix">Remix</SelectItem>
          <SelectItem value="astro">Astro</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">Selected: {val}</p>
    </div>
  )
}

function SelectSizesPreview() {
  return (
    <div className="flex flex-col gap-2">
      <Select>
        <SelectTrigger size="sm" className="w-48">
          <SelectValue placeholder="Small" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
          <SelectItem value="b">Option B</SelectItem>
          <SelectItem value="c">Option C</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Default" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
          <SelectItem value="b">Option B</SelectItem>
          <SelectItem value="c">Option C</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger size="lg" className="w-48">
          <SelectValue placeholder="Large" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
          <SelectItem value="b">Option B</SelectItem>
          <SelectItem value="c">Option C</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export const selectPreviewMap: Record<string, React.ComponentType> = {
  select: SelectPreview,
  "select-demo": SelectPreview,
  "select-basic": SelectBasicPreview,
  "select-with-groups": SelectWithGroupsPreview,
  "select-sizes": SelectSizesPreview,
  "select-disabled": SelectDisabledPreview,
  "select-controlled": SelectControlledPreview,
}
