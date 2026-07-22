"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { DatePickerInput, formatDateValue } from "@/components/ui/date-picker"
import { Form } from "@/components/ui/form"
import {
  TimePicker,
  TimePickerDialog,
  TimePickerInput,
  formatTimeValue,
} from "@/components/ui/time-picker"
import { ToastProvider, useToast } from "@/components/ui/toast"

function TimePickerInputPreview() {
  return <TimePickerInput label="Start time" defaultValue="09:30" />
}

function TimePicker24HourPreview() {
  return (
    <TimePickerInput label="Departure time" defaultValue="18:45" format="24h" formatPreset="iso" />
  )
}

function TimePickerStepsPreview() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <TimePickerInput label="15 minute intervals" defaultValue="10:30" minuteStep={15} />
      <TimePickerInput
        label="With seconds"
        defaultValue="10:30:15"
        minuteStep={5}
        secondStep={15}
        showSeconds
        formatPreset="full"
      />
    </div>
  )
}

function TimePickerDialogPreview() {
  return <TimePickerDialog label="Reminder time" defaultValue="08:15" />
}

function TimePickerStaticPreview() {
  return <TimePicker defaultValue="10:20" minuteStep={5} pickerMode="clock" />
}

function TimePickerStaticLandscapePreview() {
  return (
    <div className="w-full overflow-x-auto p-1">
      <TimePicker defaultValue="10:20" minuteStep={5} pickerMode="clock" orientation="landscape" />
    </div>
  )
}

function TimePickerDialogLandscapePreview() {
  return (
    <TimePickerDialog
      label="Landscape reminder"
      defaultValue="16:45"
      format="24h"
      orientation="landscape"
    />
  )
}

function TimePickerActionsPreview() {
  return (
    <TimePickerInput
      label="Flexible actions"
      defaultValue="09:30"
      actions={{
        showNow: true,
        showClear: true,
        showReset: true,
        showPrecisionControls: true,
      }}
    />
  )
}

function TimePickerFormatPreview() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <TimePickerInput label="Short" defaultValue="14:05" formatPreset="short" />
      <TimePickerInput label="ISO" defaultValue="14:05" format="24h" formatPreset="iso" />
      <TimePickerInput label="Custom" defaultValue="14:05" format="24h" displayFormat="HH.mm" />
    </div>
  )
}

function TimePickerConstraintsPreview() {
  return (
    <TimePickerInput
      label="Appointment time"
      defaultValue="10:30"
      format="24h"
      minuteStep={15}
      minTime="09:00"
      maxTime="17:00"
      disabledTimes={{ from: "12:00", to: "13:00" }}
    />
  )
}

function TimePickerFormPreviewContent() {
  const [value, setValue] = React.useState<string | null>(null)
  const [error, setError] = React.useState("")
  const toast = useToast()

  return (
    <Form
      className="w-full max-w-sm"
      onFormSubmit={async () => {
        if (!value) {
          setError("Select a meeting time.")
          return
        }

        setError("")
        toast.add({
          title: "Time submitted",
          description: `${formatTimeValue(value, { formatPreset: "medium" })} (${value})`,
          type: "success",
          timeout: 4000,
        })
      }}
    >
      <TimePickerInput
        label="Meeting time"
        value={value}
        onValueChange={(nextValue) => {
          setValue(nextValue)
          if (nextValue) setError("")
        }}
        minuteStep={5}
      />
      <input type="hidden" name="meetingTime" value={value ?? ""} />
      {error ? (
        <p role="alert" className="text-destructive-foreground text-xs">
          {error}
        </p>
      ) : null}
      <Button type="submit">Submit time</Button>
    </Form>
  )
}

function TimePickerFormPreview() {
  return (
    <ToastProvider>
      <TimePickerFormPreviewContent />
    </ToastProvider>
  )
}

function DateTimeFormPreviewContent() {
  const [date, setDate] = React.useState<Date | undefined>()
  const [time, setTime] = React.useState<string | null>(null)
  const [error, setError] = React.useState("")
  const toast = useToast()

  return (
    <Form
      className="w-full max-w-md"
      onFormSubmit={async () => {
        if (!date || !time) {
          setError("Select both a date and time.")
          return
        }

        const datePart = formatDateValue(date, { displayFormat: "yyyy-MM-dd" })
        const combined = `${datePart}T${time}`
        setError("")
        toast.add({
          title: "Schedule submitted",
          description: `${formatDateValue(date, { formatPreset: "long" })} at ${formatTimeValue(time)} (${combined})`,
          type: "success",
          timeout: 4000,
        })
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <DatePickerInput label="Date" value={date} onValueChange={setDate} />
        <TimePickerInput label="Time" value={time} onValueChange={setTime} minuteStep={5} />
      </div>
      <input type="hidden" name="date" value={date?.toISOString() ?? ""} />
      <input type="hidden" name="time" value={time ?? ""} />
      {error ? (
        <p role="alert" className="text-destructive-foreground text-xs">
          {error}
        </p>
      ) : null}
      <Button type="submit">Submit schedule</Button>
    </Form>
  )
}

function DateTimeFormPreview() {
  return (
    <ToastProvider>
      <DateTimeFormPreviewContent />
    </ToastProvider>
  )
}

export const timePickerPreviewMap: Record<string, React.ComponentType> = {
  "time-picker-demo": TimePickerInputPreview,
  "time-picker-input": TimePickerInputPreview,
  "time-picker-24-hour": TimePicker24HourPreview,
  "time-picker-steps": TimePickerStepsPreview,
  "time-picker-dialog": TimePickerDialogPreview,
  "time-picker-static": TimePickerStaticPreview,
  "time-picker-static-landscape": TimePickerStaticLandscapePreview,
  "time-picker-dialog-landscape": TimePickerDialogLandscapePreview,
  "time-picker-actions": TimePickerActionsPreview,
  "time-picker-format": TimePickerFormatPreview,
  "time-picker-constraints": TimePickerConstraintsPreview,
  "time-picker-form": TimePickerFormPreview,
  "date-time-form": DateTimeFormPreview,
}
