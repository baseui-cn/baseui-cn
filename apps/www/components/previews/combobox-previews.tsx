"use client"

import * as React from "react"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxTrigger,
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
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { SearchIcon } from "lucide-react"

const languages = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Rust",
  "Go",
  "Java",
  "C#",
  "Swift",
  "Kotlin",
  "Ruby",
  "Zig",
]

const countries = [
  "Australia",
  "Brazil",
  "Canada",
  "Denmark",
  "Egypt",
  "France",
  "Germany",
  "India",
  "Japan",
  "Kenya",
  "Mexico",
  "Netherlands",
  "Norway",
  "Portugal",
  "Singapore",
]

const technologies = [
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Svelte", value: "svelte" },
  { label: "Solid", value: "solid" },
  { label: "Angular", value: "angular" },
  { label: "Tanstack Start", value: "tanstack" },
]

const teammates = [
  "Alice Johnson",
  "Bob Martinez",
  "Carol White",
  "David Chen",
  "Eva Rodriguez",
  "Frank Kim",
  "Grace Lee",
  "Henry Patel",
  "Isla Scott",
  "James Walker",
]

const issueLabels = [
  "bug",
  "enhancement",
  "documentation",
  "good first issue",
  "help wanted",
  "invalid",
  "question",
  "wontfix",
  "duplicate",
  "security",
  "performance",
  "breaking change",
]

function ComboboxPreview() {
  return (
    <div className="w-full max-w-sm flex items-center justify-center">
      <Combobox items={languages} defaultValue="TypeScript">
        <ComboboxInput placeholder="Select a language" showTrigger showClear />
        <ComboboxContent>
          <ComboboxEmpty>No languages found.</ComboboxEmpty>
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
    <div className="w-full max-w-sm flex items-center justify-center">
      <Combobox items={countries}>
        <ComboboxInput showClear placeholder="Select country..." />
        <ComboboxContent>
          <ComboboxEmpty>No country found.</ComboboxEmpty>
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

function ComboboxWithTriggerPreview() {
  const anchor = useComboboxAnchor()

  return (
    <div className="w-full max-w-sm flex items-center justify-center">
      <div ref={anchor} className="w-full">
        <Combobox items={technologies}>
          <ComboboxTrigger
            render={
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between font-normal"
              />
            }
          >
            <ComboboxValue placeholder="Select a technology" />
          </ComboboxTrigger>
          <ComboboxContent className="max-w-(--anchor-width) min-w-(--anchor-width)">
            <div className="border-b p-2">
              <ComboboxInput
                autoFocus={false}
                className="w-full"
                data-slot="combobox-content"
                showTrigger={false}
                showClear={true}
                placeholder="Search..."
                startAddon={<SearchIcon className="size-4" />}
              />
            </div>
            <ComboboxEmpty>No results.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    </div>
  )
}

function ComboboxMultiSelectWithChipsPreview() {
  const [selected, setSelected] = React.useState<string[]>(["bug", "enhancement"])
  const anchor = useComboboxAnchor()

  return (
    <div className="w-full max-w-md flex items-center justify-center">
      <div ref={anchor} className="w-full">
        <Combobox
          multiple
          items={issueLabels}
          value={selected}
          onValueChange={(val) => setSelected(Array.isArray(val) ? val : [])}
        >
          <ComboboxChips startAddon={<SearchIcon />}>
            <ComboboxValue>
              {(selectedItems: string[]) => (
                <>
                  {selectedItems.map((item) => (
                    <ComboboxChip aria-label={item} key={item}>
                      {item}
                    </ComboboxChip>
                  ))}
                  <ComboboxChipsInput
                    aria-label="Select a item"
                    placeholder={selectedItems.length > 0 ? undefined : "Select a item..."}
                  />
                </>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent anchor={anchor}>
            <ComboboxEmpty>No labels found.</ComboboxEmpty>
            <ComboboxList className="max-h-none">
              {issueLabels.map((item) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    </div>
  )
}

function ComboboxMultiSelectOverflowPreview() {
  const MAX_CHIPS = 2
  const [selected, setSelected] = React.useState<string[]>([
    "bug",
    "enhancement",
    "documentation",
    "security",
  ])
  const [expanded, setExpanded] = React.useState(false)
  const anchor = useComboboxAnchor()

  return (
    <div className="w-full max-w-md flex items-center justify-center">
      <div ref={anchor} className="w-full">
        <Combobox
          multiple
          items={issueLabels}
          value={selected}
          onValueChange={(val) => setSelected(Array.isArray(val) ? val : [])}
        >
          <ComboboxValue>
            {(selectedItems: string[]) => {
              const overflow = Math.max(0, selectedItems.length - MAX_CHIPS)
              const visible =
                expanded || overflow === 0 ? selectedItems : selectedItems.slice(0, MAX_CHIPS)
              return (
                <ComboboxChips startAddon={<SearchIcon />}>
                  {visible.map((item) => (
                    <ComboboxChip key={item}>{item}</ComboboxChip>
                  ))}
                  {!expanded && overflow > 0 && (
                    <span
                      role="button"
                      tabIndex={0}
                      className="inline-flex h-[calc(--spacing(5.5))] cursor-pointer items-center rounded-md bg-muted-foreground/10 px-2 text-xs font-medium hover:bg-muted-foreground/20"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setExpanded(true)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          setExpanded(true)
                        }
                      }}
                    >
                      +{overflow} more
                    </span>
                  )}
                  {expanded && overflow > 0 && (
                    <span
                      role="button"
                      tabIndex={0}
                      className="inline-flex h-[calc(--spacing(5.5))] cursor-pointer items-center rounded-md px-2 text-xs text-muted-foreground hover:text-foreground"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setExpanded(false)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          setExpanded(false)
                        }
                      }}
                    >
                      Show less
                    </span>
                  )}
                  <ComboboxChipsInput placeholder="" />
                </ComboboxChips>
              )
            }}
          </ComboboxValue>
          <ComboboxContent anchor={anchor}>
            <ComboboxEmpty>No labels found.</ComboboxEmpty>
            <ComboboxList className="max-h-none">
              {issueLabels.map((item) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    </div>
  )
}

function ComboboxAsyncPreview() {
  const [inputValue, setInputValue] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [results, setResults] = React.useState(teammates.slice(0, 6))

  React.useEffect(() => {
    setIsLoading(true)
    const timer = window.setTimeout(() => {
      const q = inputValue.trim().toLowerCase()
      setResults(q ? teammates.filter((t) => t.toLowerCase().includes(q)) : teammates.slice(0, 6))
      setIsLoading(false)
    }, 300)
    return () => window.clearTimeout(timer)
  }, [inputValue])

  return (
    <div className="w-full max-w-md flex items-center justify-center">
      <Combobox items={results} inputValue={inputValue} onInputValueChange={setInputValue}>
        <ComboboxInput
          placeholder="Assign to teammate..."
          showClear={!!inputValue}
          showTrigger={!inputValue}
        />
        <ComboboxContent>
          <div className="flex items-center gap-2 border-b border-border px-3 py-2 text-xs text-muted-foreground">
            {isLoading && <Spinner className="size-3" />}
            {isLoading
              ? "Searching..."
              : `${results.length} teammate${results.length === 1 ? "" : "s"}`}
          </div>
          <ComboboxEmpty>No teammates found.</ComboboxEmpty>
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

export const comboboxPreviewMap: Record<string, React.ComponentType> = {
  combobox: ComboboxPreview,
  "combobox-demo": ComboboxPreview,
  "combobox-basic": ComboboxBasicPreview,
  "combobox-multi-select-with-chips": ComboboxMultiSelectWithChipsPreview,
  "combobox-multi-select-overflow": ComboboxMultiSelectOverflowPreview,
  "combobox-with-trigger": ComboboxWithTriggerPreview,
  "combobox-async": ComboboxAsyncPreview,
}
