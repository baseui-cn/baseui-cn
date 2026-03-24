"use client"

import * as React from "react"

import { buttonPreviewMap } from "@/components/previews/button-previews"
import { checkboxPreviewMap } from "@/components/previews/checkbox-previews"
import { switchPreviewMap } from "@/components/previews/switch-previews"
import { radioGroupPreviewMap } from "@/components/previews/radio-group-previews"
import { inputPreviewMap } from "@/components/previews/input-previews"
import { textareaPreviewMap } from "@/components/previews/textarea-previews"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@/components/ui/autocomplete"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupPreview,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

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

interface Item {
  id: string
  value: string
}

const items: Item[] = [
  { id: "t1", value: "feature" },
  { id: "t2", value: "fix" },
  { id: "t3", value: "bug" },
  { id: "t4", value: "docs" },
  { id: "t5", value: "internal" },
  { id: "t6", value: "mobile" },
  { id: "c-accordion", value: "component: accordion" },
  { id: "c-alert-dialog", value: "component: alert dialog" },
  { id: "c-autocomplete", value: "component: autocomplete" },
  { id: "c-avatar", value: "component: avatar" },
  { id: "c-checkbox", value: "component: checkbox" },
  { id: "c-checkbox-group", value: "component: checkbox group" },
  { id: "c-collapsible", value: "component: collapsible" },
  { id: "c-combobox", value: "component: combobox" },
  { id: "c-context-menu", value: "component: context menu" },
  { id: "c-dialog", value: "component: dialog" },
  { id: "c-field", value: "component: field" },
  { id: "c-fieldset", value: "component: fieldset" },
  { id: "c-filterable-menu", value: "component: filterable menu" },
  { id: "c-form", value: "component: form" },
  { id: "c-input", value: "component: input" },
  { id: "c-menu", value: "component: menu" },
  { id: "c-menubar", value: "component: menubar" },
  { id: "c-meter", value: "component: meter" },
  { id: "c-navigation-menu", value: "component: navigation menu" },
  { id: "c-number-field", value: "component: number field" },
  { id: "c-popover", value: "component: popover" },
  { id: "c-preview-card", value: "component: preview card" },
  { id: "c-progress", value: "component: progress" },
  { id: "c-radio", value: "component: radio" },
  { id: "c-scroll-area", value: "component: scroll area" },
  { id: "c-select", value: "component: select" },
  { id: "c-separator", value: "component: separator" },
  { id: "c-slider", value: "component: slider" },
  { id: "c-switch", value: "component: switch" },
  { id: "c-tabs", value: "component: tabs" },
  { id: "c-toast", value: "component: toast" },
  { id: "c-toggle", value: "component: toggle" },
  { id: "c-toggle-group", value: "component: toggle group" },
  { id: "c-toolbar", value: "component: toolbar" },
  { id: "c-tooltip", value: "component: tooltip" },
]

function AutocompletePreview() {
  const [value, setValue] = React.useState<string>("")
  const filteredItems = items.filter((item) => item.value.toLowerCase().includes(value.toLowerCase()))

  return (
    <div className="w-full max-w-xs">
      <Autocomplete
        value={value}
        onValueChange={setValue}
        items={filteredItems}
        itemToStringValue={(item: unknown) => (item as Item).value}
      >
        <AutocompleteInput placeholder="e.g. feature" showTrigger showClear />
        <AutocompleteContent>
          <AutocompleteEmpty>No items found.</AutocompleteEmpty>
          <AutocompleteList>
            {(item) => (
              <AutocompleteItem key={item.id} value={item}>
                {item.value}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  )
}

function SliderPreview() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-xs">
      <Slider defaultValue={[40]} />
      <Slider defaultValue={[20, 80]} />
    </div>
  )
}

function FieldPreview() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <Field>
        <FieldLabel>Username</FieldLabel>
        <Input placeholder="johndoe" />
        <FieldDescription>Your public display name.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel>
          Email <span className="text-destructive">*</span>
        </FieldLabel>
        <Input type="email" placeholder="you@example.com" />
      </Field>
    </div>
  )
}

function InputGroupDemoPreview() {
  return <InputGroupPreview />
}

function SelectBasicPreview() {
  return (
    <Select>
      <SelectTrigger className="w-48"><SelectValue placeholder="Pick one..." /></SelectTrigger>
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
      <SelectTrigger className="w-56"><SelectValue placeholder="Select framework..." /></SelectTrigger>
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
      <SelectTrigger className="w-48"><SelectValue placeholder="Disabled select" /></SelectTrigger>
      <SelectContent><SelectItem value="x">Item</SelectItem></SelectContent>
    </Select>
  )
}

function SelectControlledPreview() {
  const [val, setVal] = React.useState("next")
  return (
    <div className="flex flex-col gap-2">
      <Select value={val} onValueChange={(v) => v && setVal(v)}>
        <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
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
        <SelectTrigger className="w-48 h-8 text-xs"><SelectValue placeholder="Small" /></SelectTrigger>
        <SelectContent><SelectItem value="a">Option A</SelectItem></SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-48"><SelectValue placeholder="Default" /></SelectTrigger>
        <SelectContent><SelectItem value="a">Option A</SelectItem></SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-48 h-11 text-base"><SelectValue placeholder="Large" /></SelectTrigger>
        <SelectContent><SelectItem value="a">Option A</SelectItem></SelectContent>
      </Select>
    </div>
  )
}

function ComboboxBasicPreview() {
  const opts = ["React", "Vue", "Angular", "Svelte"]
  return (
    <Combobox items={opts}>
      <ComboboxInput placeholder="Pick a framework..." />
      <ComboboxContent>
        <ComboboxEmpty>No results.</ComboboxEmpty>
        <ComboboxList>{(item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}</ComboboxList>
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
        <ComboboxList>{(item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}</ComboboxList>
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
        <ComboboxList>{(item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}</ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function ComboboxMultiSelectWithChipsPreview() {
  return <ComboboxPreview />
}

function AutocompleteBasicPreview() {
  const [value, setValue] = React.useState("")
  const opts = items.filter((i) => i.value.toLowerCase().includes(value.toLowerCase()))
  return (
    <div className="w-full max-w-xs">
      <Autocomplete value={value} onValueChange={setValue} items={opts} itemToStringValue={(i: unknown) => (i as Item).value}>
        <AutocompleteInput placeholder="Type to search..." />
        <AutocompleteContent>
          <AutocompleteEmpty>No results.</AutocompleteEmpty>
          <AutocompleteList>{(item) => <AutocompleteItem key={item.id} value={item}>{item.value}</AutocompleteItem>}</AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  )
}

function AutocompleteWithClearButtonPreview() {
  const [value, setValue] = React.useState("")
  const opts = items.filter((i) => i.value.toLowerCase().includes(value.toLowerCase()))
  return (
    <div className="w-full max-w-xs">
      <Autocomplete value={value} onValueChange={setValue} items={opts} itemToStringValue={(i: unknown) => (i as Item).value}>
        <AutocompleteInput placeholder="Search..." showTrigger showClear />
        <AutocompleteContent>
          <AutocompleteEmpty>No results.</AutocompleteEmpty>
          <AutocompleteList>{(item) => <AutocompleteItem key={item.id} value={item}>{item.value}</AutocompleteItem>}</AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  )
}

function SliderBasicPreview() {
  return <Slider defaultValue={[50]} className="max-w-xs" />
}

function SliderRangePreview() {
  const [value, setValue] = React.useState([20, 80])
  return (
    <div className="flex flex-col gap-2 max-w-xs w-full">
      <Slider value={value} onValueChange={(v) => setValue(Array.isArray(v) ? [...v] : [v])} />
      <p className="text-xs text-muted-foreground">Range: {value[0]} - {value[1]}</p>
    </div>
  )
}

function SliderVerticalPreview() {
  return (
    <div className="flex gap-6 h-32 items-center">
      <Slider defaultValue={[30]} orientation="vertical" />
      <Slider defaultValue={[60]} orientation="vertical" />
      <Slider defaultValue={[80]} orientation="vertical" />
    </div>
  )
}

function SliderWithStepsPreview() {
  const [value, setValue] = React.useState([25])
  return (
    <div className="flex flex-col gap-2 max-w-xs w-full">
      <Slider value={value} onValueChange={(v) => setValue(Array.isArray(v) ? [...v] : [v])} step={25} min={0} max={100} />
      <p className="text-xs text-muted-foreground">Step: 25 · Value: {value[0]}</p>
    </div>
  )
}

function SliderDisabledPreview() {
  return <Slider defaultValue={[50]} disabled className="max-w-xs" />
}

function FieldVerticalPreview() {
  return (
    <Field className="max-w-xs">
      <FieldLabel>Full name</FieldLabel>
      <Input placeholder="Aria Chen" />
      <FieldDescription>As it appears on your ID.</FieldDescription>
    </Field>
  )
}

function FieldHorizontalPreview() {
  return (
    <div className="flex max-w-sm items-center gap-3">
      <Label className="w-24 shrink-0">Name</Label>
      <Input placeholder="Aria Chen" />
    </div>
  )
}

function FieldWithErrorPreview() {
  return (
    <Field className="max-w-xs" invalid>
      <FieldLabel>Email</FieldLabel>
      <Input type="email" defaultValue="not-an-email" aria-invalid="true" />
      <FieldDescription>Enter a valid email address.</FieldDescription>
    </Field>
  )
}

function FieldFieldsetPreview() {
  return (
    <fieldset className="max-w-sm space-y-3 rounded-lg border border-border p-4">
      <legend className="px-1 text-sm font-medium -mt-7 bg-background">Contact</legend>
      <Field>
        <FieldLabel>Name</FieldLabel>
        <Input placeholder="Your name" />
      </Field>
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input type="email" placeholder="you@example.com" />
      </Field>
    </fieldset>
  )
}

function InputGroupTextareaPreview() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupAddon data-align="block-start">
        <InputGroupText>Note</InputGroupText>
      </InputGroupAddon>
      <InputGroupTextarea placeholder="Enter a note..." rows={3} />
    </InputGroup>
  )
}

function InputGroupWithBothAddonsPreview() {
  return (
    <InputGroup className="max-w-xs">
      <InputGroupAddon data-align="inline-start"><InputGroupText>$</InputGroupText></InputGroupAddon>
      <InputGroupInput placeholder="0.00" />
      <InputGroupAddon data-align="inline-end"><InputGroupText>USD</InputGroupText></InputGroupAddon>
    </InputGroup>
  )
}

function InputGroupWithPrefixPreview() {
  return (
    <InputGroup className="max-w-xs">
      <InputGroupAddon data-align="inline-start">
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="example.com" />
    </InputGroup>
  )
}

function InputGroupWithSuffixButtonPreview() {
  return (
    <InputGroup className="max-w-xs">
      <InputGroupInput placeholder="Search..." />
      <InputGroupButton>Go</InputGroupButton>
    </InputGroup>
  )
}

export const formPreviewMap: Record<string, React.ComponentType> = {
  ...buttonPreviewMap,
  ...checkboxPreviewMap,
  ...switchPreviewMap,
  ...radioGroupPreviewMap,
  ...inputPreviewMap,
  ...textareaPreviewMap,
  label: LabelPreview,
  "label-demo": LabelPreview,
  select: SelectPreview,
  combobox: ComboboxPreview,
  autocomplete: AutocompletePreview,
  slider: SliderPreview,
  field: FieldPreview,
  "input-group": InputGroupDemoPreview,
  "input-group-demo": InputGroupDemoPreview,
  "input-group-textarea": InputGroupTextareaPreview,
  "input-group-with-both-addons": InputGroupWithBothAddonsPreview,
  "input-group-with-prefix": InputGroupWithPrefixPreview,
  "input-group-with-suffix-button": InputGroupWithSuffixButtonPreview,
  "select-demo": SelectPreview,
  "select-basic": SelectBasicPreview,
  "select-with-groups": SelectWithGroupsPreview,
  "select-sizes": SelectSizesPreview,
  "select-disabled": SelectDisabledPreview,
  "select-controlled": SelectControlledPreview,
  "combobox-demo": ComboboxPreview,
  "combobox-basic": ComboboxBasicPreview,
  "combobox-async": ComboboxAsyncPreview,
  "combobox-multi-select-with-chips": ComboboxMultiSelectWithChipsPreview,
  "combobox-with-groups": ComboboxWithGroupsPreview,
  "autocomplete-demo": AutocompletePreview,
  "autocomplete-basic": AutocompleteBasicPreview,
  "autocomplete-async": AutocompletePreview,
  "autocomplete-with-clear-button": AutocompleteWithClearButtonPreview,
  "slider-demo": SliderPreview,
  "slider-basic": SliderBasicPreview,
  "slider-range": SliderRangePreview,
  "slider-vertical": SliderVerticalPreview,
  "slider-with-steps": SliderWithStepsPreview,
  "slider-disabled": SliderDisabledPreview,
  "field-demo": FieldPreview,
  "field-vertical": FieldVerticalPreview,
  "field-horizontal": FieldHorizontalPreview,
  "field-with-error": FieldWithErrorPreview,
  "field-fieldset": FieldFieldsetPreview,
}
