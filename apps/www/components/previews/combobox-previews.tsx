"use client"

import * as React from "react"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxValue,
} from "@/components/ui/combobox"

const frameworks = ["Next.js", "React Router", "Remix", "Astro", "Nuxt", "SvelteKit"]

const groupedStacks = {
  Frontend: ["React", "Vue", "Solid", "Svelte"],
  Backend: ["Node.js", "Laravel", "Rails", "Django"],
} as const

const reviewers = [
  "Ava Thompson",
  "Liam Carter",
  "Mia Patel",
  "Noah Garcia",
  "Sophia Kim",
  "Ethan Brown",
]

function ComboboxPreview() {
  return (
    <div className="w-full max-w-sm">
      <Combobox items={frameworks} defaultValue="Next.js">
        <ComboboxInput placeholder="Select a framework" showClear />
        <ComboboxContent>
          <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

function ComboboxBasicPreview() {
  return (
    <div className="w-full max-w-sm">
      <Combobox items={frameworks}>
        <ComboboxInput placeholder="Pick a framework..." showClear />
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
    </div>
  )
}

function ComboboxWithGroupsPreview() {
  return (
    <div className="w-full max-w-sm">
      <Combobox>
        <ComboboxInput placeholder="Select your stack..." showClear />
        <ComboboxContent>
          <ComboboxEmpty>No results.</ComboboxEmpty>
          <ComboboxList>
            <ComboboxGroup>
              <ComboboxLabel>Frontend</ComboboxLabel>
              {groupedStacks.Frontend.map((item) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
            <ComboboxSeparator />
            <ComboboxGroup>
              <ComboboxLabel>Backend</ComboboxLabel>
              {groupedStacks.Backend.map((item) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

function ComboboxAsyncPreview() {
  const [inputValue, setInputValue] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [results, setResults] = React.useState(reviewers.slice(0, 4))

  React.useEffect(() => {
    setIsLoading(true)

    const timeout = window.setTimeout(() => {
      const query = inputValue.trim().toLowerCase()

      setResults(
        query
          ? reviewers.filter((reviewer) => reviewer.toLowerCase().includes(query))
          : reviewers.slice(0, 4)
      )
      setIsLoading(false)
    }, 350)

    return () => window.clearTimeout(timeout)
  }, [inputValue])

  return (
    <div className="w-full max-w-sm">
      <Combobox
        items={results}
        inputValue={inputValue}
        onInputValueChange={setInputValue}
      >
        <ComboboxInput placeholder="Search reviewers..." showClear />
        <ComboboxContent>
          <div className="border-b border-border px-3 py-2 text-xs text-muted-foreground">
            {isLoading ? "Searching..." : `${results.length} reviewer${results.length === 1 ? "" : "s"}`}
          </div>
          <ComboboxEmpty>No reviewers found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

function ComboboxMultiSelectWithChipsPreview() {
  const [selected, setSelected] = React.useState<string[]>(["React", "Svelte"])

  return (
    <div className="w-full max-w-sm">
      <Combobox
        multiple
        items={[...groupedStacks.Frontend, ...groupedStacks.Backend]}
        value={selected}
        onValueChange={(value) => setSelected(Array.isArray(value) ? value : [])}
      >
        <ComboboxValue>
          {(selectedItems: string[]) => (
            <ComboboxChips>
              {selectedItems.map((item) => (
                <ComboboxChip key={item}>{item}</ComboboxChip>
              ))}
              <ComboboxChipsInput placeholder="Add technologies..." />
            </ComboboxChips>
          )}
        </ComboboxValue>
        <ComboboxContent>
          <ComboboxEmpty>No technologies found.</ComboboxEmpty>
          <ComboboxList>
            {[...groupedStacks.Frontend, ...groupedStacks.Backend].map((item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

export const comboboxPreviewMap: Record<string, React.ComponentType> = {
  combobox: ComboboxPreview,
  "combobox-demo": ComboboxPreview,
  "combobox-basic": ComboboxBasicPreview,
  "combobox-async": ComboboxAsyncPreview,
  "combobox-multi-select-with-chips": ComboboxMultiSelectWithChipsPreview,
  "combobox-with-groups": ComboboxWithGroupsPreview,
}
