"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon, Clock3Icon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import "@/styles/time-picker.styles.css"

export type TimeValue = string
export type TimeFormat = "12h" | "24h"
export type TimeFormatPreset = "short" | "medium" | "full" | "iso"
export type TimePickerView = "hours" | "minutes" | "seconds"
export type TimePickerMode = "clock" | "list"
export type TimePickerVariant = "desktop" | "mobile" | "static"
export type TimePickerOrientation = "portrait" | "landscape"
export type TimePickerTouchPrecision = "minute" | "step"
export type TimePickerSize = "sm" | "md" | "lg"

export type TimePickerActionConfig = {
  showNow?: boolean
  showClear?: boolean
  showReset?: boolean
  showCancel?: boolean
  showOk?: boolean
  showPrecisionControls?: boolean
}

export type TimeValueParts = {
  hour: number
  minute: number
  second: number
}

export type TimeMatcher =
  | TimeValue
  | { from?: TimeValue; to?: TimeValue }
  | ((value: TimeValue) => boolean)

export type TimePickerClassNames = Partial<{
  root: string
  header: string
  display: string
  clock: string
  clockOption: string
  list: string
  listColumn: string
  listOption: string
  viewControls: string
  footer: string
}>

export type TimeFormatOptions = {
  format?: TimeFormat
  formatPreset?: TimeFormatPreset
  displayFormat?: string
  showSeconds?: boolean
}

type TimeStep = 1 | 5 | 10 | 15 | 30

export type TimePickerProps = {
  value?: TimeValue | null
  defaultValue?: TimeValue | null
  onValueChange?: (value: TimeValue | null) => void
  format?: TimeFormat
  formatPreset?: TimeFormatPreset
  displayFormat?: string
  minuteStep?: TimeStep
  showSeconds?: boolean
  secondStep?: TimeStep
  minTime?: TimeValue
  maxTime?: TimeValue
  disabledTimes?: TimeMatcher | TimeMatcher[]
  variant?: TimePickerVariant
  pickerMode?: TimePickerMode
  orientation?: TimePickerOrientation
  touchPrecision?: TimePickerTouchPrecision
  autoAdvance?: boolean
  closeOnSelect?: boolean
  actions?: TimePickerActionConfig
  disabled?: boolean
  size?: TimePickerSize
  className?: string
  classNames?: TimePickerClassNames
  initialView?: TimePickerView
  onAccept?: (value: TimeValue | null) => void
  onCancel?: () => void
}

export type TimePickerInputProps = Omit<
  TimePickerProps,
  "className" | "onAccept" | "onCancel" | "variant"
> & {
  label?: string
  placeholder?: string
  clearable?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  pickerClassName?: string
  triggerClassName?: string
  popoverClassName?: string
}

export type TimePickerDialogProps = Omit<
  TimePickerProps,
  "className" | "onAccept" | "onCancel" | "variant"
> & {
  label?: string
  placeholder?: string
  title?: string
  description?: string
  clearable?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  pickerClassName?: string
  triggerClassName?: string
  dialogClassName?: string
}

const HOURS_12 = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const HOURS_24 = Array.from({ length: 24 }, (_, index) => index)

function pad(value: number): string {
  return String(value).padStart(2, "0")
}

function partsToSeconds(parts: TimeValueParts): number {
  return parts.hour * 3600 + parts.minute * 60 + parts.second
}

function serializeTime(parts: TimeValueParts, showSeconds: boolean): TimeValue {
  const value = `${pad(parts.hour)}:${pad(parts.minute)}`
  return showSeconds ? `${value}:${pad(parts.second)}` : value
}

function shiftMinutes(parts: TimeValueParts, direction: -1 | 1): TimeValueParts {
  const secondsPerDay = 24 * 60 * 60
  const shiftedSeconds = (partsToSeconds(parts) + direction * 60 + secondsPerDay) % secondsPerDay
  return {
    hour: Math.floor(shiftedSeconds / 3600),
    minute: Math.floor((shiftedSeconds % 3600) / 60),
    second: shiftedSeconds % 60,
  }
}

function stepTimeParts(
  parts: TimeValueParts,
  minuteStep: TimeStep,
  secondStep: TimeStep,
  showSeconds: boolean
): TimeValueParts {
  let hour = parts.hour
  let minute = parts.minute
  let second = showSeconds ? Math.round(parts.second / secondStep) * secondStep : 0

  if (second >= 60) {
    second = 0
    minute += 1
  }

  minute = Math.round(minute / minuteStep) * minuteStep
  if (minute >= 60) {
    minute = 0
    hour = (hour + 1) % 24
  }

  return { hour, minute, second }
}

function hasSeconds(value: TimeValue | null | undefined): boolean {
  return Boolean(value && value.trim().split(":").length === 3)
}

export function parseTimeValue(value: TimeValue | null | undefined): TimeValueParts | null {
  if (!value) return null
  const match = value.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/)
  if (!match) return null

  const hour = Number(match[1])
  const minute = Number(match[2])
  const second = match[3] ? Number(match[3]) : 0
  if (hour > 23 || minute > 59 || second > 59) return null
  return { hour, minute, second }
}

export function isValidTimeValue(value: unknown): value is TimeValue {
  return typeof value === "string" && parseTimeValue(value) !== null
}

export function compareTimeValues(left: TimeValue, right: TimeValue): -1 | 0 | 1 {
  const leftParts = parseTimeValue(left)
  const rightParts = parseTimeValue(right)
  if (!leftParts || !rightParts) {
    throw new TypeError("compareTimeValues requires valid 24-hour time strings")
  }

  const difference = partsToSeconds(leftParts) - partsToSeconds(rightParts)
  return difference === 0 ? 0 : difference < 0 ? -1 : 1
}

export function clampTimeToStep(
  value: TimeValue,
  minuteStep: TimeStep = 1,
  secondStep: TimeStep = 1
): TimeValue | null {
  const parts = parseTimeValue(value)
  if (!parts) return null
  return serializeTime(
    stepTimeParts(parts, minuteStep, secondStep, hasSeconds(value)),
    hasSeconds(value)
  )
}

function getDisplayPattern({
  format = "12h",
  formatPreset = "medium",
  displayFormat,
  showSeconds = false,
}: TimeFormatOptions): string {
  if (displayFormat) return displayFormat
  if (formatPreset === "iso") return showSeconds ? "HH:mm:ss" : "HH:mm"
  if (formatPreset === "full") return format === "12h" ? "hh:mm:ss a" : "HH:mm:ss"

  const seconds = showSeconds ? ":ss" : ""
  if (formatPreset === "short") {
    return format === "12h" ? `h:mm${seconds} a` : `H:mm${seconds}`
  }
  return format === "12h" ? `hh:mm${seconds} a` : `HH:mm${seconds}`
}

export function formatTimeValue(
  value: TimeValue | null | undefined,
  options: TimeFormatOptions = {}
): string {
  const parts = parseTimeValue(value)
  if (!parts) return ""

  const hour12 = parts.hour % 12 || 12
  const tokens: Record<string, string> = {
    HH: pad(parts.hour),
    H: String(parts.hour),
    hh: pad(hour12),
    h: String(hour12),
    mm: pad(parts.minute),
    ss: pad(parts.second),
    a: parts.hour >= 12 ? "PM" : "AM",
  }
  return getDisplayPattern(options).replace(/HH|hh|mm|ss|H|h|a/g, (token) => tokens[token])
}

function normalizeStep(step: TimeStep | undefined): TimeStep {
  return step ?? 1
}

function stepOptions(step: TimeStep): number[] {
  return Array.from({ length: Math.ceil(60 / step) }, (_, index) => index * step).filter(
    (value) => value < 60
  )
}

function normalizeCanonicalValue(
  value: TimeValue | null | undefined,
  showSeconds: boolean,
  minuteStep: TimeStep,
  secondStep: TimeStep
): TimeValue | null {
  const parts = parseTimeValue(value)
  if (!parts) return null
  return serializeTime(stepTimeParts(parts, minuteStep, secondStep, showSeconds), showSeconds)
}

function normalizeTimeShape(
  value: TimeValue | null | undefined,
  showSeconds: boolean
): TimeValue | null {
  const parts = parseTimeValue(value)
  return parts ? serializeTime(parts, showSeconds) : null
}

function nowValue(showSeconds: boolean, minuteStep: TimeStep, secondStep: TimeStep): TimeValue {
  const now = new Date()
  return (
    normalizeCanonicalValue(
      serializeTime(
        { hour: now.getHours(), minute: now.getMinutes(), second: now.getSeconds() },
        showSeconds
      ),
      showSeconds,
      minuteStep,
      secondStep
    ) ?? (showSeconds ? "00:00:00" : "00:00")
  )
}

function matcherMatches(value: TimeValue, matcher: TimeMatcher): boolean {
  if (typeof matcher === "function") return matcher(value)
  if (typeof matcher === "string") {
    const left = parseTimeValue(value)
    const right = parseTimeValue(matcher)
    return Boolean(left && right && partsToSeconds(left) === partsToSeconds(right))
  }

  const valueParts = parseTimeValue(value)
  const from = parseTimeValue(matcher.from)
  const to = parseTimeValue(matcher.to)
  if (!valueParts) return false

  const seconds = partsToSeconds(valueParts)
  return (!from || seconds >= partsToSeconds(from)) && (!to || seconds <= partsToSeconds(to))
}

function isUnavailable(
  value: TimeValue,
  minTime: TimeValue | undefined,
  maxTime: TimeValue | undefined,
  disabledTimes: TimeMatcher | TimeMatcher[] | undefined
): boolean {
  const parts = parseTimeValue(value)
  if (!parts) return true

  const seconds = partsToSeconds(parts)
  const min = parseTimeValue(minTime)
  const max = parseTimeValue(maxTime)
  if (min && seconds < partsToSeconds(min)) return true
  if (max && seconds > partsToSeconds(max)) return true

  const matchers = disabledTimes
    ? Array.isArray(disabledTimes)
      ? disabledTimes
      : [disabledTimes]
    : []
  return matchers.some((matcher) => matcherMatches(value, matcher))
}

function getSelectableValue(
  preferred: TimeValueParts,
  showSeconds: boolean,
  minuteStep: TimeStep,
  secondStep: TimeStep,
  minTime: TimeValue | undefined,
  maxTime: TimeValue | undefined,
  disabledTimes: TimeMatcher | TimeMatcher[] | undefined,
  allowMinuteFallback = true,
  allowSecondFallback = true
): TimeValue | null {
  const minutes = allowMinuteFallback
    ? [preferred.minute, ...stepOptions(minuteStep).filter((value) => value !== preferred.minute)]
    : [preferred.minute]
  const seconds = showSeconds
    ? allowSecondFallback
      ? [preferred.second, ...stepOptions(secondStep).filter((value) => value !== preferred.second)]
      : [preferred.second]
    : [0]

  for (const minute of minutes) {
    for (const second of seconds) {
      const candidate = serializeTime({ hour: preferred.hour, minute, second }, showSeconds)
      if (!isUnavailable(candidate, minTime, maxTime, disabledTimes)) return candidate
    }
  }
  return null
}

function useControllableValue(
  controlledValue: TimeValue | null | undefined,
  defaultValue: TimeValue | null | undefined,
  onValueChange: ((value: TimeValue | null) => void) | undefined
) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<TimeValue | null>(
    defaultValue ?? null
  )
  const controlled = controlledValue !== undefined
  const value = controlled ? controlledValue : uncontrolledValue

  const setValue = React.useCallback(
    (nextValue: TimeValue | null) => {
      if (!controlled) setUncontrolledValue(nextValue)
      onValueChange?.(nextValue)
    },
    [controlled, onValueChange]
  )
  return [value, setValue] as const
}

function useControllableOpen(
  controlledOpen: boolean | undefined,
  defaultOpen: boolean,
  onOpenChange: ((open: boolean) => void) | undefined
) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const controlled = controlledOpen !== undefined
  const open = controlled ? controlledOpen : uncontrolledOpen

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!controlled) setUncontrolledOpen(nextOpen)
      onOpenChange?.(nextOpen)
    },
    [controlled, onOpenChange]
  )
  return [open, setOpen] as const
}

function focusRelativeOption(event: React.KeyboardEvent<HTMLButtonElement>, direction: number) {
  const group = event.currentTarget.closest('[role="listbox"]')
  const options = Array.from(
    group?.querySelectorAll<HTMLButtonElement>('[role="option"]:not(:disabled)') ?? []
  )
  const index = options.indexOf(event.currentTarget)
  if (index < 0 || options.length === 0) return

  event.preventDefault()
  options[(index + direction + options.length) % options.length]?.focus()
}

function handleOptionKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
  if (event.key === "ArrowRight" || event.key === "ArrowDown") focusRelativeOption(event, 1)
  if (event.key === "ArrowLeft" || event.key === "ArrowUp") focusRelativeOption(event, -1)
  if (event.key === "Home") {
    event.preventDefault()
    event.currentTarget
      .closest('[role="listbox"]')
      ?.querySelector<HTMLButtonElement>('[role="option"]:not(:disabled)')
      ?.focus()
  }
  if (event.key === "End") {
    event.preventDefault()
    const options = event.currentTarget
      .closest('[role="listbox"]')
      ?.querySelectorAll<HTMLButtonElement>('[role="option"]:not(:disabled)')
    options?.[options.length - 1]?.focus()
  }
}

function shortestAngleDelta(from: number, to: number): number {
  return ((to - from + 540) % 360) - 180
}

type ResolvedActions = Required<TimePickerActionConfig>

function resolveActions(
  variant: TimePickerVariant,
  actions: TimePickerActionConfig | undefined
): ResolvedActions {
  const overlayDefaults = variant !== "static"
  return {
    showNow: false,
    showClear: false,
    showReset: false,
    showCancel: overlayDefaults,
    showOk: overlayDefaults,
    showPrecisionControls: false,
    ...actions,
  }
}

type TimePickerContextValue = {
  committedValue: TimeValue | null
  draftValue: TimeValue | null
  parts: TimeValueParts
  activeView: TimePickerView
  views: TimePickerView[]
  format: TimeFormat
  formatPreset: TimeFormatPreset
  displayFormat?: string
  minuteStep: TimeStep
  secondStep: TimeStep
  minuteOptions: number[]
  secondOptions: number[]
  showSeconds: boolean
  pickerMode: TimePickerMode
  variant: TimePickerVariant
  orientation: TimePickerOrientation
  touchPrecision: TimePickerTouchPrecision
  autoAdvance: boolean
  disabled: boolean
  size: TimePickerSize
  actions: ResolvedActions
  classNames?: TimePickerClassNames
  setActiveView: (view: TimePickerView) => void
  moveView: (direction: -1 | 1) => void
  adjustMinute: (direction: -1 | 1) => void
  canAdjustMinute: (direction: -1 | 1) => boolean
  selectUnit: (unit: number, view: TimePickerView, options?: { complete?: boolean }) => boolean
  completeSelection: (view: TimePickerView) => void
  setPeriod: (period: "AM" | "PM") => void
  optionDisabled: (unit: number, view: TimePickerView) => boolean
  clear: () => void
  clearCommitted: () => void
  reset: () => void
  selectNow: () => void
  cancel: () => void
  commit: () => void
}

const TimePickerContext = React.createContext<TimePickerContextValue | null>(null)

function useTimePickerContext(): TimePickerContextValue {
  const context = React.useContext(TimePickerContext)
  if (!context) throw new Error("Time Picker parts must be used inside TimePickerProvider")
  return context
}

type TimePickerProviderProps = {
  committedValue: TimeValue | null
  onCommittedValueChange: (value: TimeValue | null) => void
  onRequestClose?: () => void
  onAccept?: (value: TimeValue | null) => void
  onCancel?: () => void
  children: React.ReactNode
} & Pick<
  TimePickerProps,
  | "format"
  | "formatPreset"
  | "displayFormat"
  | "minuteStep"
  | "showSeconds"
  | "secondStep"
  | "minTime"
  | "maxTime"
  | "disabledTimes"
  | "variant"
  | "pickerMode"
  | "orientation"
  | "touchPrecision"
  | "autoAdvance"
  | "closeOnSelect"
  | "actions"
  | "disabled"
  | "size"
  | "classNames"
  | "initialView"
>

function TimePickerProvider({
  committedValue,
  onCommittedValueChange,
  onRequestClose,
  onAccept,
  onCancel,
  format = "12h",
  formatPreset = "medium",
  displayFormat,
  minuteStep: minuteStepProp = 1,
  showSeconds = false,
  secondStep: secondStepProp = 1,
  minTime,
  maxTime,
  disabledTimes,
  variant = "static",
  pickerMode = "clock",
  orientation = "portrait",
  touchPrecision = "minute",
  autoAdvance = true,
  closeOnSelect = false,
  actions: actionConfig,
  disabled = false,
  size = "md",
  classNames,
  initialView = "hours",
  children,
}: TimePickerProviderProps) {
  const minuteStep = normalizeStep(minuteStepProp)
  const secondStep = normalizeStep(secondStepProp)
  const actions = resolveActions(variant, actionConfig)
  const deferred = actions.showOk
  const [draftState, setDraftState] = React.useState<TimeValue | null>(committedValue)
  const [activeView, setActiveView] = React.useState<TimePickerView>(
    initialView === "seconds" && !showSeconds ? "minutes" : initialView
  )
  const draftValue = deferred ? draftState : committedValue
  const selectedValue =
    normalizeTimeShape(draftValue, showSeconds) ?? nowValue(showSeconds, minuteStep, secondStep)
  const parts = parseTimeValue(selectedValue) ?? { hour: 0, minute: 0, second: 0 }
  const draftValueRef = React.useRef(draftValue)
  React.useEffect(() => {
    draftValueRef.current = draftValue
  }, [draftValue])
  const views: TimePickerView[] = showSeconds
    ? ["hours", "minutes", "seconds"]
    : ["hours", "minutes"]
  const minuteOptions = stepOptions(minuteStep)
  const secondOptions = stepOptions(secondStep)

  const setDraftValue = (nextValue: TimeValue | null) => {
    draftValueRef.current = nextValue
    setDraftState(nextValue)
    if (!deferred) onCommittedValueChange(nextValue)
  }

  const finishWithValue = (nextValue: TimeValue | null) => {
    setDraftState(nextValue)
    onCommittedValueChange(nextValue)
    onAccept?.(nextValue)
    onRequestClose?.()
  }

  const candidateFor = (nextParts: TimeValueParts, view: TimePickerView) =>
    getSelectableValue(
      nextParts,
      showSeconds,
      minuteStep,
      secondStep,
      minTime,
      maxTime,
      disabledTimes,
      view === "hours",
      view !== "seconds"
    )

  const completeSelection = (view: TimePickerView, value = draftValueRef.current) => {
    const viewIndex = views.indexOf(view)
    const nextView = views[viewIndex + 1]
    if (autoAdvance && nextView) setActiveView(nextView)
    else if (!nextView && closeOnSelect) finishWithValue(value)
  }

  const selectUnit = (unit: number, view: TimePickerView, options: { complete?: boolean } = {}) => {
    let nextParts = parts
    if (view === "hours") {
      const periodOffset = parts.hour >= 12 ? 12 : 0
      const hour = format === "12h" ? ((unit % 12) + periodOffset) % 24 : unit
      nextParts = { ...parts, hour }
    } else if (view === "minutes") nextParts = { ...parts, minute: unit }
    else nextParts = { ...parts, second: unit }

    const candidate = candidateFor(nextParts, view)
    if (!candidate) return false
    setDraftValue(candidate)
    if (options.complete !== false) completeSelection(view, candidate)
    return true
  }

  const setPeriod = (period: "AM" | "PM") => {
    const hour =
      period === "PM"
        ? parts.hour < 12
          ? parts.hour + 12
          : parts.hour
        : parts.hour >= 12
          ? parts.hour - 12
          : parts.hour
    const candidate = candidateFor({ ...parts, hour }, "hours")
    if (candidate) setDraftValue(candidate)
  }

  const optionDisabled = (unit: number, view: TimePickerView) => {
    let nextParts = parts
    if (view === "hours") {
      const periodOffset = parts.hour >= 12 ? 12 : 0
      const hour = format === "12h" ? ((unit % 12) + periodOffset) % 24 : unit
      nextParts = { ...parts, hour }
    } else if (view === "minutes") nextParts = { ...parts, minute: unit }
    else nextParts = { ...parts, second: unit }
    return !candidateFor(nextParts, view)
  }

  const moveView = (direction: -1 | 1) => {
    const index = views.indexOf(activeView)
    const nextIndex = (index + direction + views.length) % views.length
    setActiveView(views[nextIndex])
  }

  const adjustedMinuteValue = (direction: -1 | 1) => {
    const currentParts = parseTimeValue(draftValueRef.current) ?? parts
    const candidate = serializeTime(shiftMinutes(currentParts, direction), showSeconds)
    return isUnavailable(candidate, minTime, maxTime, disabledTimes) ? null : candidate
  }
  const canAdjustMinute = (direction: -1 | 1) => adjustedMinuteValue(direction) !== null
  const adjustMinute = (direction: -1 | 1) => {
    const candidate = adjustedMinuteValue(direction)
    if (candidate) setDraftValue(candidate)
  }

  const clear = () => setDraftValue(null)
  const clearCommitted = () => {
    setDraftState(null)
    onCommittedValueChange(null)
  }
  const reset = () => setDraftValue(committedValue)
  const selectNow = () => {
    const nextValue = nowValue(showSeconds, minuteStep, secondStep)
    if (!isUnavailable(nextValue, minTime, maxTime, disabledTimes)) setDraftValue(nextValue)
  }
  const cancel = () => {
    setDraftState(committedValue)
    onCancel?.()
    onRequestClose?.()
  }
  const commit = () => finishWithValue(draftValue)

  return (
    <TimePickerContext.Provider
      value={{
        committedValue,
        draftValue,
        parts,
        activeView,
        views,
        format,
        formatPreset,
        displayFormat,
        minuteStep,
        secondStep,
        minuteOptions,
        secondOptions,
        showSeconds,
        pickerMode,
        variant,
        orientation,
        touchPrecision,
        autoAdvance,
        disabled,
        size,
        actions,
        classNames,
        setActiveView,
        moveView,
        adjustMinute,
        canAdjustMinute,
        selectUnit,
        completeSelection,
        setPeriod,
        optionDisabled,
        clear,
        clearCommitted,
        reset,
        selectNow,
        cancel,
        commit,
      }}
    >
      {children}
    </TimePickerContext.Provider>
  )
}

function TimePickerPeriodToggle() {
  const { parts, format, disabled, setPeriod } = useTimePickerContext()
  if (format !== "12h") return null
  const period = parts.hour >= 12 ? "PM" : "AM"

  return (
    <div className="tp-period" aria-label="Select AM or PM">
      {(["AM", "PM"] as const).map((option) => (
        <button
          key={option}
          type="button"
          className="tp-period_button"
          data-selected={period === option || undefined}
          aria-pressed={period === option}
          disabled={disabled}
          onClick={() => setPeriod(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

function TimePickerDisplay() {
  const { parts, format, showSeconds, activeView, disabled, setActiveView, moveView, classNames } =
    useTimePickerContext()
  const hour = format === "12h" ? parts.hour % 12 || 12 : parts.hour

  const segment = (view: TimePickerView, value: number) => (
    <button
      type="button"
      className="tp-display_segment"
      data-active={activeView === view || undefined}
      aria-pressed={activeView === view}
      disabled={disabled}
      onClick={() => setActiveView(view)}
    >
      {pad(value)}
    </button>
  )

  return (
    <div className={cn("tp-display", classNames?.header, classNames?.display)}>
      <div className="tp-display_row">
        <div className="tp-display_time" aria-label="Selected time">
          {segment("hours", hour)}
          <span aria-hidden="true">:</span>
          {segment("minutes", parts.minute)}
          {showSeconds ? (
            <>
              <span aria-hidden="true">:</span>
              {segment("seconds", parts.second)}
            </>
          ) : null}
        </div>
        <TimePickerPeriodToggle />
      </div>
      <div className={cn("tp-view_controls", classNames?.viewControls)}>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Select previous time unit"
          disabled={disabled}
          onClick={() => moveView(-1)}
        >
          <ChevronLeftIcon aria-hidden="true" />
        </Button>
        <span className="tp-view_label" aria-live="polite">
          {activeView}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Select next time unit"
          disabled={disabled}
          onClick={() => moveView(1)}
        >
          <ChevronRightIcon aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}

function TimePickerClockFace() {
  const {
    parts,
    activeView,
    format,
    minuteStep,
    secondStep,
    touchPrecision,
    disabled,
    selectUnit,
    completeSelection,
    optionDisabled,
    classNames,
  } = useTimePickerContext()
  const selectedUnit =
    activeView === "hours"
      ? format === "12h"
        ? parts.hour % 12 || 12
        : parts.hour
      : activeView === "minutes"
        ? parts.minute
        : parts.second
  const step = activeView === "minutes" ? minuteStep : secondStep
  const targetHandAngle = activeView === "hours" ? (selectedUnit % 12) * 30 : selectedUnit * 6
  const [handAngle, setHandAngle] = React.useState(targetHandAngle)
  React.useEffect(() => {
    setHandAngle((currentAngle) => currentAngle + shortestAngleDelta(currentAngle, targetHandAngle))
  }, [targetHandAngle])
  const gestureStateRef = React.useRef<{
    active: boolean
    pointerId: number | null
    startedAtX: number
    startedAtY: number
    moved: boolean
    activeViewAtStart: TimePickerView
    lastSelectedUnit: number | null
  }>({
    active: false,
    pointerId: null,
    startedAtX: 0,
    startedAtY: 0,
    moved: false,
    activeViewAtStart: activeView,
    lastSelectedUnit: null,
  })
  const options =
    activeView === "hours"
      ? format === "12h"
        ? HOURS_12
        : HOURS_24
      : step === 1
        ? Array.from({ length: 12 }, (_, index) => index * 5)
        : stepOptions(step)

  const getUnitFromPointer = (
    event: React.PointerEvent<HTMLDivElement>,
    view: TimePickerView
  ): number => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left - rect.width / 2
    const y = event.clientY - rect.top - rect.height / 2
    const degrees = (Math.atan2(x, -y) * 180) / Math.PI
    const normalizedDegrees = (degrees + 360) % 360

    if (view === "hours") {
      let hour = Math.round(normalizedDegrees / 30) % 12
      if (format === "12h") hour = hour === 0 ? 12 : hour
      else if (Math.sqrt(x * x + y * y) < Math.min(rect.width, rect.height) * 0.37) hour += 12
      return hour
    }

    const raw = Math.round(normalizedDegrees / 6) % 60
    const viewStep = view === "minutes" ? minuteStep : secondStep
    return view === "minutes" && touchPrecision === "minute"
      ? raw
      : (Math.round(raw / viewStep) * viewStep) % 60
  }

  const selectFromPointer = (
    event: React.PointerEvent<HTMLDivElement>,
    gestureState: typeof gestureStateRef.current
  ) => {
    const unit = getUnitFromPointer(event, gestureState.activeViewAtStart)
    if (gestureState.lastSelectedUnit === unit) return true
    const selected = selectUnit(unit, gestureState.activeViewAtStart, { complete: false })
    if (selected) gestureState.lastSelectedUnit = unit
    return selected
  }

  const selectLiteralUnit = (unit: number, gestureState: typeof gestureStateRef.current) => {
    if (gestureState.lastSelectedUnit === unit) return true
    const selected = selectUnit(unit, gestureState.activeViewAtStart, { complete: false })
    if (selected) gestureState.lastSelectedUnit = unit
    return selected
  }

  const releasePointer = (element: HTMLDivElement, pointerId: number) => {
    gestureStateRef.current = {
      active: false,
      pointerId: null,
      startedAtX: 0,
      startedAtY: 0,
      moved: false,
      activeViewAtStart: activeView,
      lastSelectedUnit: null,
    }
    if (element.hasPointerCapture(pointerId)) element.releasePointerCapture(pointerId)
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || !event.isPrimary || event.button !== 0 || gestureStateRef.current.active) return

    const option = (event.target as HTMLElement).closest<HTMLButtonElement>(".tp-clock_option")
    const literalUnit = option?.dataset.unit ? Number(option.dataset.unit) : null
    if (option && event.pointerType === "mouse") option.focus({ preventScroll: true })
    event.preventDefault()
    const gestureState = {
      active: true,
      pointerId: event.pointerId,
      startedAtX: event.clientX,
      startedAtY: event.clientY,
      moved: false,
      activeViewAtStart: activeView,
      lastSelectedUnit: null,
    }
    gestureStateRef.current = gestureState
    event.currentTarget.setPointerCapture(event.pointerId)
    if (literalUnit === null || Number.isNaN(literalUnit)) {
      selectFromPointer(event, gestureState)
    } else {
      selectLiteralUnit(literalUnit, gestureState)
    }
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const gestureState = gestureStateRef.current
    if (!gestureState.active || gestureState.pointerId !== event.pointerId) return
    event.preventDefault()
    const distance = Math.hypot(
      event.clientX - gestureState.startedAtX,
      event.clientY - gestureState.startedAtY
    )
    if (distance < 4) return
    gestureState.moved = true
    selectFromPointer(event, gestureState)
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const gestureState = gestureStateRef.current
    if (!gestureState.active || gestureState.pointerId !== event.pointerId) return
    event.preventDefault()
    const selected = gestureState.moved
      ? selectFromPointer(event, gestureState)
      : gestureState.lastSelectedUnit !== null
    const shouldComplete = selected && !gestureState.moved
    const completedView = gestureState.activeViewAtStart
    releasePointer(event.currentTarget, event.pointerId)
    if (shouldComplete) completeSelection(completedView)
  }

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!gestureStateRef.current.active || gestureStateRef.current.pointerId !== event.pointerId) {
      return
    }
    releasePointer(event.currentTarget, event.pointerId)
  }

  const handleLostPointerCapture = (event: React.PointerEvent<HTMLDivElement>) => {
    if (gestureStateRef.current.pointerId !== event.pointerId) return
    gestureStateRef.current = {
      active: false,
      pointerId: null,
      startedAtX: 0,
      startedAtY: 0,
      moved: false,
      activeViewAtStart: activeView,
      lastSelectedUnit: null,
    }
  }

  return (
    <div
      className={cn("tp-clock", classNames?.clock)}
      role="listbox"
      aria-label={`Select ${activeView}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onLostPointerCapture={handleLostPointerCapture}
    >
      <span
        className="tp-clock_hand"
        style={
          {
            "--tp-hand-angle": `${handAngle}deg`,
            "--tp-hand-length": `${
              activeView === "hours" && format === "24h" && selectedUnit >= 12 ? 31 : 43
            }%`,
          } as React.CSSProperties
        }
        aria-hidden="true"
      />
      {options.map((option, index) => {
        const inner = activeView === "hours" && format === "24h" && option >= 12
        const angle = activeView === "hours" ? (option % 12) * 30 : option * 6
        const radians = (angle * Math.PI) / 180
        const radius = inner ? 31 : 43
        const selected = selectedUnit === option
        return (
          <button
            key={`${activeView}-${option}`}
            type="button"
            role="option"
            aria-selected={selected}
            disabled={disabled || optionDisabled(option, activeView)}
            tabIndex={selected || (!options.includes(selectedUnit) && index === 0) ? 0 : -1}
            className={cn("tp-clock_option", classNames?.clockOption)}
            data-selected={selected || undefined}
            data-unit={option}
            style={
              {
                "--tp-option-x": `${50 + Math.sin(radians) * radius}%`,
                "--tp-option-y": `${50 - Math.cos(radians) * radius}%`,
              } as React.CSSProperties
            }
            onKeyDown={handleOptionKeyDown}
            onClick={(event) => {
              event.stopPropagation()
              if (event.detail !== 0) {
                event.preventDefault()
                return
              }
              selectUnit(option, activeView)
            }}
          >
            {activeView === "hours" && format === "12h" ? option : pad(option)}
          </button>
        )
      })}
    </div>
  )
}

function TimePickerListColumn({
  label,
  view,
  options,
  selected,
}: {
  label: string
  view: TimePickerView
  options: number[]
  selected: number
}) {
  const { format, disabled, selectUnit, optionDisabled, classNames } = useTimePickerContext()
  return (
    <div className={cn("tp-list_column", classNames?.listColumn)}>
      <div className="tp-list_label">{label}</div>
      <div className="tp-list_options" role="listbox" aria-label={`Select ${label.toLowerCase()}`}>
        {options.map((option) => {
          const isSelected = selected === option
          return (
            <button
              key={`${view}-${option}`}
              type="button"
              role="option"
              aria-selected={isSelected}
              disabled={disabled || optionDisabled(option, view)}
              tabIndex={isSelected ? 0 : -1}
              className={cn("tp-list_option", classNames?.listOption)}
              data-selected={isSelected || undefined}
              onKeyDown={handleOptionKeyDown}
              onClick={() => selectUnit(option, view)}
            >
              {view === "hours" && format === "12h" ? option : pad(option)}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function TimePickerListSelector() {
  const { parts, format, minuteOptions, secondOptions, showSeconds, classNames } =
    useTimePickerContext()
  const hour = format === "12h" ? parts.hour % 12 || 12 : parts.hour
  return (
    <div className={cn("tp-list", classNames?.list)}>
      <TimePickerListColumn
        label="Hour"
        view="hours"
        options={format === "12h" ? HOURS_12 : HOURS_24}
        selected={hour}
      />
      <TimePickerListColumn
        label="Minute"
        view="minutes"
        options={minuteOptions}
        selected={parts.minute}
      />
      {showSeconds ? (
        <TimePickerListColumn
          label="Second"
          view="seconds"
          options={secondOptions}
          selected={parts.second}
        />
      ) : null}
    </div>
  )
}

function TimePickerActions() {
  const {
    draftValue,
    committedValue,
    disabled,
    actions,
    clear,
    reset,
    selectNow,
    adjustMinute,
    canAdjustMinute,
    cancel,
    commit,
    classNames,
  } = useTimePickerContext()
  const hasSecondary =
    actions.showNow || actions.showClear || actions.showReset || actions.showPrecisionControls
  const hasPrimary = actions.showCancel || actions.showOk
  if (!hasSecondary && !hasPrimary) return null

  return (
    <div className={cn("tp-footer", classNames?.footer)}>
      {hasSecondary ? (
        <div className="tp-footer_secondary">
          {actions.showNow ? (
            <Button type="button" variant="ghost" size="sm" disabled={disabled} onClick={selectNow}>
              Now
            </Button>
          ) : null}
          {actions.showClear ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled || !draftValue}
              onClick={clear}
            >
              Clear
            </Button>
          ) : null}
          {actions.showReset ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled || draftValue === committedValue}
              onClick={reset}
            >
              Reset
            </Button>
          ) : null}
          {actions.showPrecisionControls ? (
            <div className="tp-minute_controls" role="group" aria-label="Adjust minute precisely">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="tp-minute_control"
                aria-label="Subtract one minute"
                disabled={disabled || !canAdjustMinute(-1)}
                onClick={() => adjustMinute(-1)}
              >
                -1m
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="tp-minute_control"
                aria-label="Add one minute"
                disabled={disabled || !canAdjustMinute(1)}
                onClick={() => adjustMinute(1)}
              >
                +1m
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
      <div className="tp-footer_primary">
        {actions.showCancel ? (
          <Button type="button" variant="ghost" size="sm" onClick={cancel}>
            Cancel
          </Button>
        ) : null}
        {actions.showOk ? (
          <Button type="button" size="sm" disabled={disabled} onClick={commit}>
            OK
          </Button>
        ) : null}
      </div>
    </div>
  )
}

function TimePickerSurface({
  className,
  header,
}: {
  className?: string
  header?: React.ReactNode
}) {
  const { pickerMode, variant, orientation, showSeconds, disabled, size, classNames } =
    useTimePickerContext()
  const surface = variant === "desktop" ? "popover" : variant === "mobile" ? "dialog" : "static"
  return (
    <div
      className={cn("tp-shell", classNames?.root, className)}
      data-surface={surface}
      data-size={size}
      data-variant={variant}
      data-mode={pickerMode}
      data-orientation={orientation}
      data-seconds={showSeconds || undefined}
      data-disabled={disabled || undefined}
    >
      <div className="tp-picker_layout">
        <div className="tp-picker_lead">
          {header}
          <TimePickerDisplay />
        </div>
        <div className="tp-picker_body">
          {pickerMode === "clock" ? <TimePickerClockFace /> : <TimePickerListSelector />}
        </div>
      </div>
      <TimePickerActions />
    </div>
  )
}

export function TimePicker({
  value: controlledValue,
  defaultValue,
  onValueChange,
  variant = "static",
  className,
  onAccept,
  onCancel,
  ...props
}: TimePickerProps) {
  const [value, setValue] = useControllableValue(controlledValue, defaultValue, onValueChange)
  return (
    <TimePickerProvider
      key={props.actions?.showOk ? `static-${value ?? "empty"}` : "static"}
      {...props}
      variant={variant}
      committedValue={value}
      onCommittedValueChange={setValue}
      onAccept={onAccept}
      onCancel={onCancel}
    >
      <TimePickerSurface className={className} />
    </TimePickerProvider>
  )
}

TimePicker.displayName = "TimePicker"

function TimePickerInputTrigger({
  kind,
  controlId,
  label,
  placeholder,
  clearable,
  triggerClassName,
}: {
  kind: "popover" | "dialog"
  controlId: string
  label?: string
  placeholder: string
  clearable: boolean
  triggerClassName?: string
}) {
  const {
    draftValue,
    format,
    formatPreset,
    displayFormat,
    showSeconds,
    disabled,
    size,
    clearCommitted,
  } = useTimePickerContext()
  const formattedValue = formatTimeValue(draftValue, {
    format,
    formatPreset,
    displayFormat,
    showSeconds,
  })
  const trigger = (
    <button
      id={controlId}
      type="button"
      className="tp-input_trigger"
      aria-label={
        formattedValue
          ? `Change ${label || "time"}: ${formattedValue}`
          : `Choose ${label || "time"}`
      }
    />
  )

  return (
    <div className="tp-input_control" data-size={size} data-disabled={disabled || undefined}>
      <Clock3Icon className="tp-input_icon" aria-hidden="true" />
      <Input
        aria-hidden="true"
        className={cn("tp-input_surface", triggerClassName)}
        disabled={disabled}
        placeholder={placeholder}
        readOnly
        size={size}
        tabIndex={-1}
        value={formattedValue}
      />
      {kind === "popover" ? (
        <PopoverTrigger disabled={disabled} render={trigger} />
      ) : (
        <DialogTrigger disabled={disabled} render={trigger} />
      )}
      {clearable && formattedValue ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="tp-input_clear"
          disabled={disabled}
          aria-label="Clear time"
          onClick={clearCommitted}
        >
          <XIcon aria-hidden="true" />
        </Button>
      ) : null}
    </div>
  )
}

function TimeInputContainer({
  label,
  controlId,
  className,
  children,
}: {
  label?: string
  controlId: string
  className?: string
  children: React.ReactNode
}) {
  if (!label) return <div className={cn("tp-input", className)}>{children}</div>
  return (
    <Field className={cn("tp-input", className)}>
      <FieldLabel htmlFor={controlId}>{label}</FieldLabel>
      {children}
    </Field>
  )
}

type TimePickerOverlayRootProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  controlId: string
  label?: string
  placeholder: string
  clearable: boolean
  pickerClassName?: string
  triggerClassName?: string
}

function TimePickerPopoverRoot({
  open,
  onOpenChange,
  controlId,
  label,
  placeholder,
  clearable,
  pickerClassName,
  triggerClassName,
  popoverClassName,
}: TimePickerOverlayRootProps & { popoverClassName?: string }) {
  const { reset } = useTimePickerContext()

  return (
    <Popover
      modal
      open={open}
      onOpenChange={(nextOpen, eventDetails) => {
        if (!nextOpen && eventDetails.reason === "outside-press") {
          eventDetails.cancel()
          return
        }
        if (!nextOpen) reset()
        onOpenChange(nextOpen)
      }}
    >
      <TimePickerInputTrigger
        kind="popover"
        controlId={controlId}
        label={label}
        placeholder={placeholder}
        clearable={clearable}
        triggerClassName={triggerClassName}
      />
      <PopoverContent
        side="bottom"
        align="start"
        sideOffset={8}
        initialFocus={(openType) => openType === "keyboard"}
        className={cn("tp-popover_content", popoverClassName)}
      >
        <TimePickerSurface className={pickerClassName} />
      </PopoverContent>
    </Popover>
  )
}

export function TimePickerInput({
  value: controlledValue,
  defaultValue,
  onValueChange,
  label,
  placeholder = "Select time",
  clearable = true,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  className,
  pickerClassName,
  triggerClassName,
  popoverClassName,
  pickerMode = "list",
  orientation = "portrait",
  ...props
}: TimePickerInputProps) {
  const [value, setValue] = useControllableValue(controlledValue, defaultValue, onValueChange)
  const [open, setOpen] = useControllableOpen(controlledOpen, defaultOpen, onOpenChange)
  const controlId = React.useId()
  const deferred = props.actions?.showOk ?? true

  return (
    <TimeInputContainer label={label} controlId={controlId} className={className}>
      <TimePickerProvider
        key={deferred ? (value ?? "empty") : "immediate"}
        {...props}
        variant="desktop"
        pickerMode={pickerMode}
        orientation={orientation}
        committedValue={value}
        onCommittedValueChange={setValue}
        onRequestClose={() => setOpen(false)}
      >
        <TimePickerPopoverRoot
          open={open}
          onOpenChange={setOpen}
          controlId={controlId}
          label={label}
          placeholder={placeholder}
          clearable={clearable}
          pickerClassName={pickerClassName}
          triggerClassName={triggerClassName}
          popoverClassName={popoverClassName}
        />
      </TimePickerProvider>
    </TimeInputContainer>
  )
}

TimePickerInput.displayName = "TimePickerInput"

function TimePickerDialogContent({
  title,
  description,
  pickerClassName,
  dialogClassName,
}: {
  title: string
  description: string
  pickerClassName?: string
  dialogClassName?: string
}) {
  const { orientation } = useTimePickerContext()
  const heading = (
    <div className="tp-dialog_heading">
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription>{description}</DialogDescription>
    </div>
  )
  return (
    <DialogContent
      size={orientation === "landscape" ? "lg" : "xs"}
      showCloseButton={false}
      className={cn("tp-dialog_content", dialogClassName)}
      data-orientation={orientation}
    >
      <TimePickerSurface className={pickerClassName} header={heading} />
    </DialogContent>
  )
}

function TimePickerDialogRoot({
  open,
  onOpenChange,
  controlId,
  label,
  placeholder,
  clearable,
  pickerClassName,
  triggerClassName,
  title,
  description,
  dialogClassName,
}: TimePickerOverlayRootProps & {
  title: string
  description: string
  dialogClassName?: string
}) {
  const { reset } = useTimePickerContext()

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) reset()
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <TimePickerInputTrigger
        kind="dialog"
        controlId={controlId}
        label={label}
        placeholder={placeholder}
        clearable={clearable}
        triggerClassName={triggerClassName}
      />
      <TimePickerDialogContent
        title={title}
        description={description}
        pickerClassName={pickerClassName}
        dialogClassName={dialogClassName}
      />
    </Dialog>
  )
}

export function TimePickerDialog({
  value: controlledValue,
  defaultValue,
  onValueChange,
  label,
  placeholder = "Select time",
  title = "Select time",
  description = "Choose an hour and minute, then confirm your selection.",
  clearable = true,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  className,
  pickerClassName,
  triggerClassName,
  dialogClassName,
  pickerMode = "clock",
  orientation = "portrait",
  ...props
}: TimePickerDialogProps) {
  const [value, setValue] = useControllableValue(controlledValue, defaultValue, onValueChange)
  const [open, setOpen] = useControllableOpen(controlledOpen, defaultOpen, onOpenChange)
  const controlId = React.useId()
  const deferred = props.actions?.showOk ?? true

  return (
    <TimeInputContainer label={label} controlId={controlId} className={className}>
      <TimePickerProvider
        key={deferred ? (value ?? "empty") : "immediate"}
        {...props}
        variant="mobile"
        pickerMode={pickerMode}
        orientation={orientation}
        committedValue={value}
        onCommittedValueChange={setValue}
        onRequestClose={() => setOpen(false)}
      >
        <TimePickerDialogRoot
          open={open}
          onOpenChange={setOpen}
          controlId={controlId}
          label={label}
          placeholder={placeholder}
          clearable={clearable}
          pickerClassName={pickerClassName}
          triggerClassName={triggerClassName}
          title={title}
          description={description}
          dialogClassName={dialogClassName}
        />
      </TimePickerProvider>
    </TimeInputContainer>
  )
}

TimePickerDialog.displayName = "TimePickerDialog"
