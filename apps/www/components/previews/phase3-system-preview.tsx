"use client"

import * as React from "react"
import { FileTextIcon, SearchIcon, UsersIcon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Autocomplete,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
  AutocompleteStatus,
} from "@/components/ui/autocomplete"
import {
  Combobox,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxStatus,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import { Field, FieldLabel } from "@/components/ui/field"

const teams = ["Design systems", "Engineering", "Customer research", "Archived workspace"]
const people = [
  "Amara Okafor",
  "Dev Patel",
  "Elena García",
  "Jun Tanaka",
  "Maya Chen",
  "Sam Taylor",
]
const labels = [
  "Accessibility",
  "Design review",
  "Ready for implementation",
  "Research",
  "A deliberately long value that wraps without hiding its remove action",
]
const projects = Array.from({ length: 500 }, (_, i) => `Project ${String(i + 1).padStart(3, "0")}`)
const commandGroups = [
  { label: "Workspace", items: ["Open project", "Invite teammate"] },
  { label: "Tools", items: ["Search documentation", "Export report"] },
]

function AsyncPeople({ kind }: { kind: "autocomplete" | "combobox" }) {
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<string[]>([])
  const [pending, setPending] = React.useState(true)
  React.useEffect(() => {
    // A deterministic local async example, with the same timer cleanup as existing demos.
    const timer = window.setTimeout(() => {
      setResults(people.filter((person) => person.toLowerCase().includes(query.toLowerCase())))
      setPending(false)
    }, 450)
    return () => window.clearTimeout(timer)
  }, [query])
  const changeQuery = (value: string) => {
    setQuery(value)
    setPending(true)
    setResults([])
  }
  const status = pending ? "Searching teammates…" : `${results.length} teammates found`
  if (kind === "autocomplete")
    return (
      <Autocomplete items={results} value={query} onValueChange={changeQuery} autoHighlight>
        <AutocompleteInput
          id="p3-autocomplete"
          showClear
          showTrigger
          startAddon={<SearchIcon />}
          placeholder="Find a teammate"
        />
        <AutocompletePopup>
          <AutocompleteStatus>{status}</AutocompleteStatus>
          <AutocompleteEmpty>{pending ? null : "No teammates found."}</AutocompleteEmpty>
          <AutocompleteList aria-busy={pending}>
            {(item) => (
              <AutocompleteItem key={item} value={item}>
                {item}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompletePopup>
      </Autocomplete>
    )
  return (
    <Combobox items={results} inputValue={query} onInputValueChange={changeQuery}>
      <ComboboxInput
        id="p3-async-combo"
        className="w-full"
        autoFocus={false}
        showClear
        placeholder="Search teammates"
        aria-label="Async teammate"
      />
      <ComboboxContent>
        <ComboboxStatus>{status}</ComboboxStatus>
        <ComboboxEmpty>{pending ? null : "No teammates found."}</ComboboxEmpty>
        <ComboboxList aria-busy={pending}>
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

export function Phase3SystemPreview() {
  const anchor = useComboboxAnchor()
  const [lastCommand, setLastCommand] = React.useState("No command executed")
  return (
    <div id="phase3-system" className="grid w-full min-w-0 gap-6">
      <p className="text-sm text-muted-foreground">
        Workspace settings · Persistent checks identify selected values; the inset edge identifies
        the highlighted row.
      </p>
      <div className="grid min-w-0 gap-5 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="p3-select">Workspace</FieldLabel>
          <Select defaultValue={teams[0]} name="workspace">
            <SelectTrigger id="p3-select" className="w-full">
              <SelectValue placeholder="Choose workspace" />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              <SelectGroup>
                <SelectLabel>Active workspaces</SelectLabel>
                {teams.map((team, i) => (
                  <SelectItem key={team} value={team} disabled={i === 3}>
                    <UsersIcon aria-hidden="true" />
                    {team}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="p3-invalid">Approval queue (invalid)</FieldLabel>
          <Select>
            <SelectTrigger id="p3-invalid" aria-invalid="true" className="w-full">
              <SelectValue placeholder="Choose a queue" />
            </SelectTrigger>
            <SelectContent>
              {["Design", "Engineering"].map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="p3-disabled">Workspace (disabled)</FieldLabel>
          <Select disabled defaultValue={teams[0]}>
            <SelectTrigger id="p3-disabled" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={teams[0]}>{teams[0]}</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="p3-autocomplete">Autocomplete · async teammates</FieldLabel>
          <AsyncPeople kind="autocomplete" />
        </Field>
        <Field>
          <FieldLabel htmlFor="p3-loading">Autocomplete · loading specimen</FieldLabel>
          <Autocomplete inline open items={[]}>
            <AutocompleteInput id="p3-loading" placeholder="Searching teammates" />
            <AutocompleteStatus>Searching teammates…</AutocompleteStatus>
            <AutocompleteList aria-busy="true" />
          </Autocomplete>
        </Field>
        <Field>
          <FieldLabel htmlFor="p3-empty">Autocomplete · empty specimen</FieldLabel>
          <Autocomplete inline open items={[]}>
            <AutocompleteInput id="p3-empty" placeholder="No matches" />
            <AutocompleteEmpty>No teammates found. Try another name.</AutocompleteEmpty>
            <AutocompleteList />
          </Autocomplete>
        </Field>
        <Field>
          <FieldLabel htmlFor="p3-combo">Primary project label</FieldLabel>
          <Combobox items={labels} defaultValue={labels[0]}>
            <ComboboxInput id="p3-combo" className="w-full" autoFocus={false} showClear />
            <ComboboxContent>
              <ComboboxEmpty>No labels found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>
        <Field>
          <FieldLabel htmlFor="p3-async-combo">Combobox · async teammates</FieldLabel>
          <AsyncPeople kind="combobox" />
        </Field>
        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="p3-chips">Review labels · multiple values</FieldLabel>
          <div ref={anchor} className="w-full min-w-0">
            <Combobox multiple items={labels} defaultValue={[labels[0], labels[1]]}>
              <ComboboxChips>
                <ComboboxValue>
                  {(values: string[]) =>
                    values.map((item) => (
                      <ComboboxChip key={item} aria-label={item}>
                        {item}
                      </ComboboxChip>
                    ))
                  }
                </ComboboxValue>
                <ComboboxChipsInput id="p3-chips" placeholder="Add a label" />
              </ComboboxChips>
              <ComboboxContent anchor={anchor}>
                <ComboboxEmpty>No labels found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem checkPosition="left" key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
        </Field>
        <Field>
          <FieldLabel htmlFor="p3-large">Large list · 500 projects</FieldLabel>
          <Select
            items={projects.map((value) => ({ value, label: value }))}
            defaultValue={projects[0]}
          >
            <SelectTrigger id="p3-large" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              {projects.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="p3-readonly">Review label (read-only)</FieldLabel>
          <Combobox readOnly items={labels} defaultValue={labels[0]}>
            <ComboboxInput autoFocus={false} id="p3-readonly" className="w-full" showClear />
            <ComboboxContent>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>
      </div>
      <section
        aria-label="Command content specimen"
        className="min-w-0 rounded-lg border bg-popover"
      >
        <Command items={commandGroups}>
          <CommandInput
            id="p3-command"
            aria-label="Search workspace commands"
            autoFocus={false}
            placeholder="Search workspace commands"
          />
          <CommandEmpty>No commands found.</CommandEmpty>
          <CommandList>
            {(group) => (
              <CommandGroup key={group.label} items={group.items}>
                <CommandGroupLabel>{group.label}</CommandGroupLabel>
                {group.items.map((item: string, i: number) => (
                  <CommandItem key={item} value={item} onClick={() => setLastCommand(item)}>
                    <FileTextIcon aria-hidden="true" />
                    <span className="min-w-0 flex-1">{item}</span>
                    <CommandShortcut>⌘ {i + 1}</CommandShortcut>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
        <output className="block border-t p-3 text-xs text-muted-foreground" aria-live="polite">
          {lastCommand}
        </output>
      </section>
    </div>
  )
}
