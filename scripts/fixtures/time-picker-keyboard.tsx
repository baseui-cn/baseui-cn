import * as React from "react"
import { createRoot } from "react-dom/client"
import { TimePicker, TimePickerDialog, TimePickerInput } from "@/components/ui/time-picker"
import type { TimePickerProps } from "@/components/ui/time-picker"
import { DatePickerInput } from "@/components/ui/date-picker"
import "@/styles/globals.css"

const params = new URLSearchParams(location.search)
const scenario = params.get("case") ?? "disabled-selection"
const surface = params.get("surface") ?? "static"
const cases: Record<string, Partial<TimePickerProps>> = {
  "disabled-selection": { value: "09:30", minTime: "10:00" },
  enabled: { value: "09:30" },
  minute: { value: "10:15", minTime: "10:30", maxTime: "10:45" },
  seconds: {
    value: "10:30:10",
    showSeconds: true,
    secondStep: 5,
    minTime: "10:30:20",
    maxTime: "10:30:40",
  },
  predicate: { value: "09:30", disabledTimes: (value) => Number(value.slice(0, 2)) < 11 },
  range: { value: "10:30", disabledTimes: { from: "10:00", to: "10:35" } },
  all: { value: "09:30", disabledTimes: () => true },
  clock: { value: "09:30", pickerMode: "clock" },
}

function Fixture() {
  const [changes, setChanges] = React.useState<(string | null)[]>([])
  const [external, setExternal] = React.useState<string | null>(null)
  const props: TimePickerProps = {
    format: params.get("format") === "12h" ? "12h" : "24h",
    pickerMode: "list",
    actions: { showOk: false, showCancel: true, showPrecisionControls: false },
    ...cases[scenario],
    ...(external === null ? {} : { value: external }),
    onValueChange: (value) => setChanges((values) => [...values, value]),
  }
  return (
    <main style={{ padding: 32 }}>
      <button id="before" type="button">
        Before picker
      </button>
      {scenario === "date" ? (
        <DatePickerInput label="Regression date" defaultValue="2026-10-25" />
      ) : surface === "popover" ? (
        <TimePickerInput {...props} label="Test time" clearable={false} />
      ) : surface === "dialog" ? (
        <TimePickerDialog {...props} label="Test time" clearable={false} />
      ) : (
        <TimePicker {...props} />
      )}
      <button id="after" type="button">
        After picker
      </button>
      <button id="external" type="button" onClick={() => setExternal("08:15")}>
        External value update
      </button>
      <output id="changes">{JSON.stringify(changes)}</output>
      <output id="external-value">{props.value}</output>
    </main>
  )
}

document.documentElement.classList.toggle("dark", params.get("theme") === "dark")
createRoot(document.getElementById("root")!).render(<Fixture />)
