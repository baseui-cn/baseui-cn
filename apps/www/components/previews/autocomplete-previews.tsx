"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"
import {
  Autocomplete,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
} from "@/components/ui/autocomplete"
import { Spinner } from "@/components/ui/spinner"

interface LabelItem {
  id: string
  value: string
}

const labelItems: LabelItem[] = [
  { id: "t1", value: "feature" },
  { id: "t2", value: "fix" },
  { id: "t3", value: "bug" },
  { id: "t4", value: "docs" },
  { id: "t5", value: "internal" },
  { id: "t6", value: "mobile" },
  { id: "c-autocomplete", value: "component: autocomplete" },
  { id: "c-combobox", value: "component: combobox" },
  { id: "c-dialog", value: "component: dialog" },
  { id: "c-field", value: "component: field" },
  { id: "c-form", value: "component: form" },
  { id: "c-input", value: "component: input" },
  { id: "c-select", value: "component: select" },
  { id: "c-tabs", value: "component: tabs" },
  { id: "c-toast", value: "component: toast" },
]

const fruits = [
  "Apple",
  "Apricot",
  "Banana",
  "Blueberry",
  "Cherry",
  "Coconut",
  "Date",
  "Fig",
  "Grape",
  "Guava",
  "Kiwi",
  "Lemon",
  "Lime",
  "Mango",
  "Melon",
  "Orange",
  "Papaya",
  "Peach",
  "Pear",
  "Pineapple",
  "Plum",
  "Raspberry",
  "Strawberry",
  "Watermelon",
]

const npmPackages = [
  "react",
  "react-dom",
  "react-router",
  "react-query",
  "react-hook-form",
  "next",
  "nuxt",
  "vue",
  "vue-router",
  "svelte",
  "typescript",
  "ts-node",
  "tsup",
  "tailwindcss",
  "tailwind-merge",
  "tailwind-variants",
  "zod",
  "valibot",
  "yup",
  "axios",
  "swr",
  "tanstack-query",
  "framer-motion",
  "motion",
  "gsap",
  "lucide-react",
  "radix-ui",
  "base-ui",
]

function AutocompletePreview() {
  const [value, setValue] = React.useState<string>("")
  const filtered = labelItems.filter((item) =>
    item.value.toLowerCase().includes(value.toLowerCase())
  )

  return (
    <div className="w-full max-w-xs">
      <Autocomplete
        value={value}
        onValueChange={setValue}
        items={filtered}
        itemToStringValue={(item: unknown) => (item as LabelItem).value}
      >
        <AutocompleteInput placeholder="Filter labels..." showTrigger showClear />
        <AutocompletePopup>
          <AutocompleteEmpty>No labels found.</AutocompleteEmpty>
          <AutocompleteList>
            {(item) => (
              <AutocompleteItem key={item.id} value={item}>
                {item.value}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompletePopup>
      </Autocomplete>
    </div>
  )
}

function AutocompleteBasicPreview() {
  const [value, setValue] = React.useState("")
  const filtered = fruits.filter((f) => f.toLowerCase().includes(value.toLowerCase()))

  return (
    <div className="w-full max-w-xs">
      <Autocomplete
        value={value}
        onValueChange={setValue}
        items={filtered}
        itemToStringValue={(item: unknown) => item as string}
      >
        <AutocompleteInput placeholder="Search fruits..." />
        <AutocompletePopup>
          <AutocompleteEmpty>No fruits found.</AutocompleteEmpty>
          <AutocompleteList>
            {(item) => (
              <AutocompleteItem key={item} value={item}>
                {item}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompletePopup>
      </Autocomplete>
    </div>
  )
}

function AutocompleteWithClearButtonPreview() {
  const [value, setValue] = React.useState("")
  const filtered = labelItems.filter((item) =>
    item.value.toLowerCase().includes(value.toLowerCase())
  )

  return (
    <div className="w-full max-w-xs">
      <Autocomplete
        value={value}
        onValueChange={setValue}
        items={filtered}
        itemToStringValue={(item: unknown) => (item as LabelItem).value}
      >
        <AutocompleteInput placeholder="Search labels..." showClear startAddon={<SearchIcon />} />
        <AutocompletePopup>
          <AutocompleteEmpty>No labels found.</AutocompleteEmpty>
          <AutocompleteList>
            {(item) => (
              <AutocompleteItem key={item.id} value={item}>
                {item.value}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompletePopup>
      </Autocomplete>
    </div>
  )
}

function AutocompleteAsyncPreview() {
  const [value, setValue] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [results, setResults] = React.useState(npmPackages.slice(0, 8))

  React.useEffect(() => {
    if (!value.trim()) {
      setResults(npmPackages.slice(0, 8))
      setLoading(false)
      return
    }
    setLoading(true)
    setResults([])
    const timer = window.setTimeout(() => {
      setResults(npmPackages.filter((p) => p.includes(value.toLowerCase())))
      setLoading(false)
    }, 400)
    return () => window.clearTimeout(timer)
  }, [value])

  return (
    <div className="w-full max-w-xs">
      <Autocomplete
        value={value}
        onValueChange={setValue}
        items={results}
        itemToStringValue={(item: unknown) => item as string}
      >
        <AutocompleteInput
          placeholder="Search npm packages..."
          showClear
          startAddon={loading ? <Spinner /> : <SearchIcon />}
        />
        <AutocompletePopup>
          <AutocompleteEmpty>No packages found.</AutocompleteEmpty>
          <AutocompleteList>
            {(item) => (
              <AutocompleteItem key={item} value={item}>
                {item}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompletePopup>
      </Autocomplete>
    </div>
  )
}

export const autocompletePreviewMap: Record<string, React.ComponentType> = {
  autocomplete: AutocompletePreview,
  "autocomplete-demo": AutocompletePreview,
  "autocomplete-basic": AutocompleteBasicPreview,
  "autocomplete-async": AutocompleteAsyncPreview,
  "autocomplete-with-clear-button": AutocompleteWithClearButtonPreview,
}
