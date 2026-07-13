"use client"

import * as React from "react"

import {
  DatePicker,
  DatePickerInput,
  DateRangePicker,
  DateRangePickerInput,
  formatDateRangeValue,
  formatDateValue,
  type DateRangeValue,
} from "@/components/ui/date-picker"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { ToastProvider, useToast } from "@/components/ui/toast"

const july2026 = new Date(2026, 6, 13)
const julyRange: DateRangeValue = {
  from: new Date(2026, 6, 8),
  to: new Date(2026, 6, 16),
}

function DatePickerPreview() {
  return <DatePicker defaultValue={july2026} />
}

function DatePickerInputPreview() {
  return <DatePickerInput label="Start date" defaultValue={july2026} />
}

function DateRangePickerPreview() {
  return <DateRangePicker defaultValue={julyRange} numberOfMonths={2} />
}

function DateRangePickerInputPreview() {
  return (
    <DateRangePickerInput
      label="Travel dates"
      startLabel="Departure date"
      endLabel="Return date"
      startPlaceholder="Departure"
      endPlaceholder="Return"
      defaultValue={julyRange}
    />
  )
}

function DateRangePickerPresetsPreview() {
  return (
    <DateRangePickerInput
      label="Reporting period"
      defaultValue={julyRange}
      showPresets
      showFooter
      className="max-w-md"
    />
  )
}

function DatePickerSizesPreview() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <DatePickerInput size="sm" placeholder="Small date picker" />
      <DatePickerInput size="md" placeholder="Medium date picker" />
      <DatePickerInput size="lg" placeholder="Large date picker" />
    </div>
  )
}

function DatePickerFormatPreview() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <DatePickerInput label="Short" defaultValue={july2026} formatPreset="short" />
      <DatePickerInput label="Long" defaultValue={july2026} formatPreset="long" />
      <DatePickerInput label="Custom" defaultValue={july2026} displayFormat="dd MMM yyyy" />
    </div>
  )
}

function DateRangePickerFormatPreview() {
  return (
    <DateRangePickerInput
      label="Billing period"
      defaultValue={julyRange}
      formatPreset="short"
      showPresets={false}
    />
  )
}

function DatePickerConstraintsPreview() {
  return (
    <DatePicker
      defaultValue={july2026}
      minDate={new Date(2026, 6, 5)}
      maxDate={new Date(2026, 6, 25)}
      disabledDates={{ dayOfWeek: [0, 6] }}
    />
  )
}

function DatePickerSwitcherPreview() {
  return (
    <DatePicker
      defaultValue={july2026}
      startMonth={new Date(2020, 0, 1)}
      endMonth={new Date(2030, 11, 1)}
      enableYearMonthPicker
    />
  )
}

function DatePickerControlledPreview() {
  const [value, setValue] = React.useState<Date | undefined>(july2026)

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <DatePickerInput value={value} onValueChange={setValue} />
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => setValue(july2026)}>
          Reset
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setValue(undefined)}>
          Clear
        </Button>
      </div>
    </div>
  )
}

function DatePickerFormPreviewContent() {
  const [value, setValue] = React.useState<Date | undefined>()
  const [error, setError] = React.useState("")
  const toast = useToast()

  return (
    <Form
      className="w-full max-w-sm"
      onFormSubmit={async () => {
        if (!value) {
          setError("Select a start date.")
          return
        }

        setError("")
        toast.add({
          title: "Date submitted",
          description: formatDateValue(value, { formatPreset: "long" }),
          type: "success",
          timeout: 4000,
        })
      }}
    >
      <DatePickerInput
        label="Start date"
        value={value}
        onValueChange={(nextValue) => {
          setValue(nextValue)
          if (nextValue) setError("")
        }}
      />
      <input type="hidden" name="startDate" value={value?.toISOString() ?? ""} />
      {error ? (
        <p role="alert" className="text-destructive-foreground text-xs">
          {error}
        </p>
      ) : null}
      <Button type="submit">Submit date</Button>
    </Form>
  )
}

function DatePickerFormPreview() {
  return (
    <ToastProvider>
      <DatePickerFormPreviewContent />
    </ToastProvider>
  )
}

function DateRangePickerFormPreviewContent() {
  const [value, setValue] = React.useState<DateRangeValue | undefined>()
  const [error, setError] = React.useState("")
  const toast = useToast()

  return (
    <Form
      className="w-full max-w-md"
      onFormSubmit={async () => {
        if (!value?.from || !value.to) {
          setError("Select both a start and end date.")
          return
        }

        setError("")
        toast.add({
          title: "Date range submitted",
          description: formatDateRangeValue(value, { formatPreset: "long" }),
          type: "success",
          timeout: 4000,
        })
      }}
    >
      <div className="grid w-full max-w-sm gap-4">
        <DateRangePickerInput
          label="Project window"
          value={value}
          onValueChange={(nextValue) => {
            setValue(nextValue)
            if (nextValue?.from && nextValue.to) setError("")
          }}
          showPresets={false}
        />
        <input type="hidden" name="rangeStart" value={value?.from?.toISOString() ?? ""} />
        <input type="hidden" name="rangeEnd" value={value?.to?.toISOString() ?? ""} />
        {error ? (
          <p role="alert" className="text-destructive-foreground text-xs">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="w-full">
          Submit range
        </Button>
      </div>
    </Form>
  )
}

function DateRangePickerFormPreview() {
  return (
    <ToastProvider>
      <DateRangePickerFormPreviewContent />
    </ToastProvider>
  )
}

export const datePickerPreviewMap: Record<string, React.ComponentType> = {
  "date-picker-demo": DatePickerInputPreview,
  "date-picker-inline": DatePickerPreview,
  "date-picker-input": DatePickerInputPreview,
  "date-range-picker-inline": DateRangePickerPreview,
  "date-range-picker-input": DateRangePickerInputPreview,
  "date-range-picker-presets": DateRangePickerPresetsPreview,
  "date-picker-sizes": DatePickerSizesPreview,
  "date-picker-format": DatePickerFormatPreview,
  "date-range-picker-format": DateRangePickerFormatPreview,
  "date-picker-constraints": DatePickerConstraintsPreview,
  "date-picker-switcher": DatePickerSwitcherPreview,
  "date-picker-controlled": DatePickerControlledPreview,
  "date-picker-form": DatePickerFormPreview,
  "date-range-picker-form": DateRangePickerFormPreview,
}
