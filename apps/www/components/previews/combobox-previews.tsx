"use client"

import * as React from "react"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

function ComboboxPreview() {
  const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]

  return (
    <Combobox items={frameworks} defaultValue={frameworks[0]}>
      <ComboboxInput placeholder="Select a framework" showClear />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function ComboboxBasicPreview() {
  const opts = ["React", "Vue", "Angular", "Svelte"]
  return (
    <Combobox items={opts}>
      <ComboboxInput placeholder="Pick a framework..." />
      <ComboboxContent>
        <ComboboxEmpty>No results.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function ComboboxWithGroupsPreview() {
  const frontend = ["React", "Vue", "Svelte"]
  const backend = ["Node.js", "Django", "Rails"]
  return (
    <Combobox items={[...frontend, ...backend]}>
      <ComboboxInput placeholder="Select stack..." />
      <ComboboxContent>
        <ComboboxEmpty>No results.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function ComboboxAsyncPreview() {
  const opts = ["Feature", "Bug", "Docs", "Refactor", "Test"]
  return (
    <Combobox items={opts}>
      <ComboboxInput placeholder="Search labels..." showClear />
      <ComboboxContent>
        <ComboboxEmpty>No results.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function ComboboxMultiSelectWithChipsPreview() {
  return <ComboboxPreview />
}

export const comboboxPreviewMap: Record<string, React.ComponentType> = {
  combobox: ComboboxPreview,
  "combobox-demo": ComboboxPreview,
  "combobox-basic": ComboboxBasicPreview,
  "combobox-async": ComboboxAsyncPreview,
  "combobox-multi-select-with-chips": ComboboxMultiSelectWithChipsPreview,
  "combobox-with-groups": ComboboxWithGroupsPreview,
}
