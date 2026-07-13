"use client"

import * as React from "react"
import {
  DayPicker,
  type ClassNames,
  type CustomComponents,
  type DateRange,
  type Matcher,
  type PropsBase,
} from "@daypicker/react"
import {
  addMonths,
  differenceInCalendarMonths,
  endOfMonth,
  format,
  isSameDay,
  isValid,
  startOfDay,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
} from "date-fns"
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import "@/styles/date-picker.styles.css"

type PickerView = "days" | "months" | "years"

export type DatePickerSize = "sm" | "md" | "lg"
export type DatePickerMonthTransition = "slide" | "fade" | "none"
export type DatePickerViewTransition = "fade" | "scale" | "none"
export type DateFormatPreset =
  | "short"
  | "medium"
  | "long"
  | "full"
  | "iso"
  | "numeric"
  | "compact"
  | "monthDayYear"
  | "dayMonthYear"
export type DateRangeValue = { from?: Date; to?: Date }

export type DateFormatOptions = {
  formatPreset?: DateFormatPreset
  displayFormat?: string
}

export type DateRangeFormatOptions = DateFormatOptions & {
  rangeSeparator?: string
  startPlaceholder?: string
  endPlaceholder?: string
}

export type DateRangePreset = {
  label: string
  getValue: () => { from: Date; to: Date }
}

type SafeCalendarProps = Omit<
  PropsBase,
  | "animate"
  | "className"
  | "classNames"
  | "defaultMonth"
  | "disabled"
  | "endMonth"
  | "mode"
  | "month"
  | "numberOfMonths"
  | "onMonthChange"
  | "required"
  | "startMonth"
>

type SharedPickerProps = {
  className?: string
  classNames?: Partial<ClassNames>
  size?: DatePickerSize
  formatPreset?: DateFormatPreset
  displayFormat?: string
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  disabledDates?: Matcher | Matcher[]
  enableYearMonthPicker?: boolean
  animated?: boolean
  monthTransition?: DatePickerMonthTransition
  viewTransition?: DatePickerViewTransition
  animationDuration?: number
  month?: Date
  defaultMonth?: Date
  onMonthChange?: (month: Date) => void
  startMonth?: Date
  endMonth?: Date
  calendarProps?: SafeCalendarProps
}

type SingleDatePickerProps = SharedPickerProps & {
  mode?: "single"
  value?: Date
  defaultValue?: Date
  onValueChange?: (date: Date | undefined) => void
}

export type MultipleDatePickerProps = SharedPickerProps & {
  mode: "multiple"
  value?: Date[]
  defaultValue?: Date[]
  onValueChange?: (dates: Date[] | undefined) => void
}

export type DatePickerProps = SingleDatePickerProps | MultipleDatePickerProps

export type DatePickerInputProps = Omit<SingleDatePickerProps, "className" | "mode"> & {
  label?: string
  className?: string
  calendarClassName?: string
  triggerClassName?: string
  popoverClassName?: string
  clearable?: boolean
  closeOnSelect?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export type DateRangePickerProps = SharedPickerProps & {
  value?: DateRangeValue
  defaultValue?: DateRangeValue
  onValueChange?: (range: DateRangeValue | undefined) => void
  presets?: DateRangePreset[]
  showPresets?: boolean
  showFooter?: boolean
  closeOnSelect?: boolean
  numberOfMonths?: number
  onApply?: (range: DateRangeValue | undefined) => void
  onCancel?: () => void
}

export type DateRangePickerInputProps = Omit<
  DateRangePickerProps,
  "className" | "onApply" | "onCancel"
> & {
  label?: string
  startLabel?: string
  endLabel?: string
  startPlaceholder?: string
  endPlaceholder?: string
  rangeSeparator?: string
  className?: string
  calendarClassName?: string
  triggerClassName?: string
  popoverClassName?: string
  clearable?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const

const DATE_FORMAT_PRESETS: Record<DateFormatPreset, string> = {
  short: "MM/dd/yyyy",
  medium: "MMM d, yyyy",
  long: "MMMM d, yyyy",
  full: "EEEE, MMMM d, yyyy",
  iso: "yyyy-MM-dd",
  numeric: "M/d/yyyy",
  compact: "MM/dd/yy",
  monthDayYear: "MMMM d, yyyy",
  dayMonthYear: "d MMMM yyyy",
}

export const defaultDateRangePresets: DateRangePreset[] = [
  {
    label: "Today",
    getValue: () => {
      const today = startOfDay(new Date())
      return { from: today, to: today }
    },
  },
  {
    label: "Yesterday",
    getValue: () => {
      const yesterday = subDays(startOfDay(new Date()), 1)
      return { from: yesterday, to: yesterday }
    },
  },
  {
    label: "Last 7 days",
    getValue: () => {
      const today = startOfDay(new Date())
      return { from: subDays(today, 6), to: today }
    },
  },
  {
    label: "Last 30 days",
    getValue: () => {
      const today = startOfDay(new Date())
      return { from: subDays(today, 29), to: today }
    },
  },
  {
    label: "This month",
    getValue: () => {
      const today = startOfDay(new Date())
      return { from: startOfMonth(today), to: startOfDay(endOfMonth(today)) }
    },
  },
  {
    label: "Last month",
    getValue: () => {
      const previousMonth = subMonths(startOfDay(new Date()), 1)
      return {
        from: startOfMonth(previousMonth),
        to: startOfDay(endOfMonth(previousMonth)),
      }
    },
  },
  {
    label: "Year to date",
    getValue: () => {
      const today = startOfDay(new Date())
      return { from: startOfYear(today), to: today }
    },
  },
]

export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && isValid(value)
}

export function normalizeMonth(date: Date, minDate?: Date, maxDate?: Date): Date {
  const normalized = new Date(date.getFullYear(), date.getMonth(), 1)
  const minimum = minDate ? new Date(minDate.getFullYear(), minDate.getMonth(), 1) : undefined
  const maximum = maxDate ? new Date(maxDate.getFullYear(), maxDate.getMonth(), 1) : undefined

  if (minimum && normalized < minimum) return minimum
  if (maximum && normalized > maximum) return maximum
  return normalized
}

function normalizeVisibleMonth(
  date: Date,
  startMonth: Date | undefined,
  endMonth: Date | undefined,
  numberOfMonths: number
) {
  const normalized = normalizeMonth(date)
  const latestStart = endMonth ? subMonths(endMonth, numberOfMonths - 1) : undefined
  const effectiveEnd =
    startMonth && latestStart && latestStart < startMonth ? startMonth : latestStart

  return normalizeMonth(normalized, startMonth, effectiveEnd)
}

function getPanelBoundaries(
  startMonth: Date | undefined,
  endMonth: Date | undefined,
  numberOfMonths: number,
  displayIndex: number
) {
  return {
    startMonth: startMonth ? addMonths(startMonth, displayIndex) : undefined,
    endMonth: endMonth ? subMonths(endMonth, numberOfMonths - displayIndex - 1) : undefined,
  }
}

export function getDateFormat(
  formatPreset: DateFormatPreset = "medium",
  displayFormat?: string
): string {
  return displayFormat || DATE_FORMAT_PRESETS[formatPreset]
}

export function formatDate(date: Date | undefined, displayFormat = "MMM d, yyyy"): string {
  if (!isValidDate(date)) return ""

  try {
    return format(date, displayFormat)
  } catch {
    return date.toLocaleDateString()
  }
}

export function formatDateValue(
  date: Date | undefined,
  { formatPreset = "medium", displayFormat }: DateFormatOptions = {}
): string {
  return formatDate(date, getDateFormat(formatPreset, displayFormat))
}

export function formatDateRangeValue(
  range: DateRangeValue | undefined,
  {
    formatPreset = "medium",
    displayFormat,
    rangeSeparator = "\u2013",
    startPlaceholder = "Start date",
    endPlaceholder = "End date",
  }: DateRangeFormatOptions = {}
): string {
  if (!range?.from && !range?.to) return ""

  const formatOptions = { formatPreset, displayFormat }
  const from = formatDateValue(range?.from, formatOptions)
  const to = formatDateValue(range?.to, formatOptions)

  return `${from || startPlaceholder} ${rangeSeparator} ${to || endPlaceholder}`
}

export function formatDateRange(
  range: DateRangeValue | undefined,
  displayFormat = "MMM d, yyyy"
): string {
  return formatDateRangeValue(range, { displayFormat })
}

function getSelectionAnchor(
  selection: Date | Date[] | DateRangeValue | undefined
): Date | undefined {
  if (isValidDate(selection)) return selection
  if (Array.isArray(selection)) return selection.find(isValidDate)
  if (!selection) return undefined
  return isValidDate(selection.from)
    ? selection.from
    : isValidDate(selection.to)
      ? selection.to
      : undefined
}

function getEffectiveBoundaries({
  minDate,
  maxDate,
  startMonth,
  endMonth,
}: Pick<SharedPickerProps, "minDate" | "maxDate" | "startMonth" | "endMonth">) {
  const starts = [minDate, startMonth].filter(isValidDate).map((date) => normalizeMonth(date))
  const ends = [maxDate, endMonth].filter(isValidDate).map((date) => normalizeMonth(date))

  const effectiveStart = starts.length
    ? new Date(Math.max(...starts.map((date) => date.getTime())))
    : undefined
  const effectiveEnd = ends.length
    ? new Date(Math.min(...ends.map((date) => date.getTime())))
    : undefined

  if (effectiveStart && effectiveEnd && effectiveStart > effectiveEnd) {
    return { startMonth: effectiveStart, endMonth: effectiveStart }
  }

  return { startMonth: effectiveStart, endMonth: effectiveEnd }
}

function getDisabledMatchers(
  disabled: boolean,
  disabledDates: Matcher | Matcher[] | undefined,
  minDate: Date | undefined,
  maxDate: Date | undefined
): Matcher[] {
  const matchers: Matcher[] = []
  if (disabled) matchers.push(true)
  if (disabledDates !== undefined) {
    matchers.push(...(Array.isArray(disabledDates) ? disabledDates : [disabledDates]))
  }
  if (isValidDate(minDate)) matchers.push({ before: minDate })
  if (isValidDate(maxDate)) matchers.push({ after: maxDate })
  return matchers
}

function isSameRange(a: DateRangeValue | undefined, b: DateRangeValue | undefined) {
  const fromMatches = a?.from && b?.from ? isSameDay(a.from, b.from) : a?.from === b?.from
  const toMatches = a?.to && b?.to ? isSameDay(a.to, b.to) : a?.to === b?.to
  return fromMatches && toMatches
}

function isCompleteRange(range: DateRangeValue | undefined): range is { from: Date; to: Date } {
  return isValidDate(range?.from) && isValidDate(range?.to)
}

function useControllableValue<T>(
  controlledValue: T | undefined,
  defaultValue: T | undefined,
  onValueChange: ((value: T | undefined) => void) | undefined
) {
  const [internalValue, setInternalValue] = React.useState<T | undefined>(defaultValue)
  const wasControlled = React.useRef(controlledValue !== undefined)

  React.useEffect(() => {
    if (controlledValue !== undefined || wasControlled.current) {
      setInternalValue(controlledValue)
    }
    wasControlled.current = controlledValue !== undefined
  }, [controlledValue])

  const value = controlledValue !== undefined ? controlledValue : internalValue
  const setValue = React.useCallback(
    (nextValue: T | undefined) => {
      setInternalValue(nextValue)
      onValueChange?.(nextValue)
    },
    [onValueChange]
  )

  return [value, setValue] as const
}

function useControllableOpen(
  controlledOpen: boolean | undefined,
  defaultOpen: boolean,
  onOpenChange: ((open: boolean) => void) | undefined
) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const open = controlledOpen ?? internalOpen

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      setInternalOpen(nextOpen)
      onOpenChange?.(nextOpen)
    },
    [onOpenChange]
  )

  return [open, setOpen] as const
}

const Chevron: CustomComponents["Chevron"] = ({ orientation, ...props }) => {
  if (orientation === "left") {
    return <ChevronLeftIcon className={cn("size-4", props.className)} {...props} />
  }
  if (orientation === "right") {
    return <ChevronRightIcon className={cn("size-4", props.className)} {...props} />
  }
  return <ChevronDownIcon className={cn("size-4", props.className)} {...props} />
}

type GridNavigationOptions = {
  columns: number
  onEscape: () => void
}

function useGridNavigation(itemCount: number, { columns, onEscape }: GridNavigationOptions) {
  const gridRef = React.useRef<HTMLDivElement>(null)
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([])

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const currentIndex = itemRefs.current.findIndex((item) => item === document.activeElement)
      if (event.key === "Escape") {
        event.preventDefault()
        onEscape()
        return
      }
      if (currentIndex < 0) return

      const offsets: Record<string, number> = {
        ArrowLeft: -1,
        ArrowRight: 1,
        ArrowUp: -columns,
        ArrowDown: columns,
      }
      const offset = offsets[event.key]
      if (!offset) return

      event.preventDefault()
      let nextIndex = currentIndex + offset
      while (nextIndex >= 0 && nextIndex < itemCount && itemRefs.current[nextIndex]?.disabled) {
        nextIndex += offset
      }
      const nextItem = itemRefs.current[nextIndex]
      nextItem?.focus({ preventScroll: true })

      const grid = gridRef.current
      if (grid && nextItem) {
        const itemTop = nextItem.offsetTop
        const itemBottom = itemTop + nextItem.offsetHeight

        if (itemTop < grid.scrollTop) grid.scrollTop = itemTop
        if (itemBottom > grid.scrollTop + grid.clientHeight) {
          grid.scrollTop = itemBottom - grid.clientHeight
        }
      }
    },
    [columns, itemCount, onEscape]
  )

  return { gridRef, itemRefs, onKeyDown }
}

type CaptionToggleProps = {
  label: string
  expanded: boolean
  onClick: () => void
  ariaLabel: string
}

function CaptionToggle({ label, expanded, onClick, ariaLabel }: CaptionToggleProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="rdp-caption_label rdp-caption_label--button"
      onClick={onClick}
      aria-expanded={expanded}
      aria-label={ariaLabel}
    >
      <span>{label}</span>
      <ChevronDownIcon
        className={cn("rdp-caption_chevron size-3.5", expanded && "rdp-caption_chevron--expanded")}
        aria-hidden="true"
      />
    </Button>
  )
}

type PickerHeaderProps = CaptionToggleProps & {
  showNav?: boolean
  onPrevious?: () => void
  onNext?: () => void
  previousDisabled?: boolean
  nextDisabled?: boolean
}

function PickerHeader({
  label,
  expanded,
  onClick,
  ariaLabel,
  showNav = false,
  onPrevious,
  onNext,
  previousDisabled,
  nextDisabled,
}: PickerHeaderProps) {
  return (
    <div className="rdp-picker_header">
      <CaptionToggle label={label} expanded={expanded} onClick={onClick} ariaLabel={ariaLabel} />
      {showNav ? (
        <div className="rdp-picker_nav" role="group" aria-label="Navigate year">
          <button
            type="button"
            className="rdp-button_previous"
            onClick={onPrevious}
            disabled={previousDisabled}
            aria-label="Previous year"
          >
            <ChevronLeftIcon className="rdp-chevron size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="rdp-button_next"
            onClick={onNext}
            disabled={nextDisabled}
            aria-label="Next year"
          >
            <ChevronRightIcon className="rdp-chevron size-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  )
}

type YearGridProps = {
  years: number[]
  selectedYear: number
  currentYear: number
  onSelect: (year: number) => void
  onEscape: () => void
}

function YearGrid({ years, selectedYear, currentYear, onSelect, onEscape }: YearGridProps) {
  const selectedIndex = Math.max(0, years.indexOf(selectedYear))
  const { gridRef, itemRefs, onKeyDown } = useGridNavigation(years.length, {
    columns: 3,
    onEscape,
  })

  React.useLayoutEffect(() => {
    const grid = gridRef.current
    const selectedItem = itemRefs.current[selectedIndex]
    if (!grid || !selectedItem) return

    const centeredTop = selectedItem.offsetTop - (grid.clientHeight - selectedItem.offsetHeight) / 2
    grid.scrollTop = Math.max(0, Math.min(centeredTop, grid.scrollHeight - grid.clientHeight))
    selectedItem?.focus({ preventScroll: true })
  }, [gridRef, itemRefs, selectedIndex])

  return (
    <div
      ref={gridRef}
      className="rdp-year_grid"
      role="listbox"
      aria-label="Choose year"
      onKeyDown={onKeyDown}
    >
      {years.map((year, index) => {
        const isSelected = year === selectedYear
        const isCurrent = year === currentYear
        return (
          <Button
            key={year}
            ref={(element) => {
              itemRefs.current[index] = element
            }}
            type="button"
            role="option"
            tabIndex={index === selectedIndex ? 0 : -1}
            aria-selected={isSelected}
            size="sm"
            variant="ghost"
            className={cn(
              "rdp-grid_button",
              isSelected && "rdp-grid_button--selected",
              isCurrent && !isSelected && "rdp-grid_button--current"
            )}
            onClick={() => onSelect(year)}
          >
            {year}
          </Button>
        )
      })}
    </div>
  )
}

type MonthGridProps = {
  year: number
  displayMonth: number
  selectedMonth: number
  selectedYear: number
  currentMonth: number
  currentYear: number
  startMonth?: Date
  endMonth?: Date
  onSelect: (monthIndex: number) => void
  onEscape: () => void
}

function MonthGrid({
  year,
  displayMonth,
  selectedMonth,
  selectedYear,
  currentMonth,
  currentYear,
  startMonth,
  endMonth,
  onSelect,
  onEscape,
}: MonthGridProps) {
  const preferredIndex = year === selectedYear ? selectedMonth : displayMonth
  const { gridRef, itemRefs, onKeyDown } = useGridNavigation(MONTH_LABELS.length, {
    columns: 3,
    onEscape,
  })

  React.useLayoutEffect(() => {
    const preferred = itemRefs.current[preferredIndex]
    const firstEnabled = itemRefs.current.find((item) => item && !item.disabled)
    ;(preferred?.disabled ? firstEnabled : preferred)?.focus({ preventScroll: true })
  }, [itemRefs, preferredIndex, year])

  return (
    <div
      ref={gridRef}
      className="rdp-month_picker_grid"
      role="listbox"
      aria-label="Choose month"
      onKeyDown={onKeyDown}
    >
      {MONTH_LABELS.map((label, monthIndex) => {
        const candidate = new Date(year, monthIndex, 1)
        const disabled = Boolean(
          (startMonth && candidate < startMonth) || (endMonth && candidate > endMonth)
        )
        const isSelected = year === selectedYear && monthIndex === selectedMonth
        const isCurrent = year === currentYear && monthIndex === currentMonth

        return (
          <Button
            key={label}
            ref={(element) => {
              itemRefs.current[monthIndex] = element
            }}
            type="button"
            role="option"
            tabIndex={!disabled && monthIndex === preferredIndex ? 0 : -1}
            aria-selected={isSelected}
            disabled={disabled}
            size="sm"
            variant="ghost"
            className={cn(
              "rdp-grid_button",
              isSelected && "rdp-grid_button--selected",
              isCurrent && !isSelected && "rdp-grid_button--current"
            )}
            onClick={() => onSelect(monthIndex)}
          >
            {label}
          </Button>
        )
      })}
    </div>
  )
}

type CalendarSurfaceProps = SharedPickerProps & {
  mode: "single" | "multiple" | "range"
  selection: Date | Date[] | DateRangeValue | undefined
  onSelect: (value: Date | Date[] | DateRangeValue | undefined) => void
  numberOfMonths?: number
}

type CalendarSurfaceContextValue = {
  enableYearMonthPicker: boolean
  panelViews: Record<number, PickerView>
  now: Date
  startMonth?: Date
  endMonth?: Date
  numberOfMonths: number
  setPanelView: (displayIndex: number, view: PickerView) => void
  setPanelMonth: (displayIndex: number, month: Date) => void
  returnPanelToDays: (displayIndex: number) => void
}

const CalendarSurfaceContext = React.createContext<CalendarSurfaceContextValue | null>(null)

function useCalendarSurfaceContext() {
  const context = React.useContext(CalendarSurfaceContext)
  if (!context) throw new Error("Date picker panel must be rendered inside CalendarSurface")
  return context
}

const CalendarMonth: CustomComponents["Month"] = ({
  calendarMonth,
  displayIndex,
  className,
  children,
  ...props
}) => {
  const context = useCalendarSurfaceContext()
  const view = context.panelViews[displayIndex] ?? "days"

  if (view === "days") {
    return (
      <div {...props} className={className} data-rdp-panel={displayIndex}>
        {children}
      </div>
    )
  }

  const panelMonth = calendarMonth.date
  const panelYear = panelMonth.getFullYear()
  const panelMonthIndex = panelMonth.getMonth()
  const panelBoundaries = getPanelBoundaries(
    context.startMonth,
    context.endMonth,
    context.numberOfMonths,
    displayIndex
  )
  const fromYear = panelBoundaries.startMonth?.getFullYear() ?? context.now.getFullYear() - 100
  const toYear = panelBoundaries.endMonth?.getFullYear() ?? context.now.getFullYear() + 20
  const years = Array.from({ length: toYear - fromYear + 1 }, (_, index) => fromYear + index)
  const previousYearMonth = new Date(panelYear - 1, panelMonthIndex, 1)
  const nextYearMonth = new Date(panelYear + 1, panelMonthIndex, 1)
  const previousDisabled = Boolean(
    panelBoundaries.startMonth && previousYearMonth < panelBoundaries.startMonth
  )
  const nextDisabled = Boolean(panelBoundaries.endMonth && nextYearMonth > panelBoundaries.endMonth)

  return (
    <div
      {...props}
      className={cn(className, "rdp-month--picker")}
      data-panel-view={view}
      data-rdp-panel={displayIndex}
    >
      {view === "years" ? (
        <>
          <PickerHeader
            label={format(panelMonth, "MMMM yyyy")}
            expanded
            onClick={() => context.returnPanelToDays(displayIndex)}
            ariaLabel={`Close year picker for ${format(panelMonth, "MMMM yyyy")}`}
          />
          <div key={`years-${displayIndex}`} className="rdp-view_panel">
            <YearGrid
              years={years}
              selectedYear={panelYear}
              currentYear={context.now.getFullYear()}
              onEscape={() => context.returnPanelToDays(displayIndex)}
              onSelect={(year) => {
                context.setPanelMonth(displayIndex, new Date(year, panelMonthIndex, 1))
                context.setPanelView(displayIndex, "months")
              }}
            />
          </div>
        </>
      ) : (
        <>
          <PickerHeader
            label={String(panelYear)}
            expanded
            onClick={() => context.setPanelView(displayIndex, "years")}
            ariaLabel={`Select year for panel ${displayIndex + 1}`}
            showNav
            onPrevious={() => context.setPanelMonth(displayIndex, previousYearMonth)}
            onNext={() => context.setPanelMonth(displayIndex, nextYearMonth)}
            previousDisabled={previousDisabled}
            nextDisabled={nextDisabled}
          />
          <div key={`months-${displayIndex}`} className="rdp-view_panel">
            <MonthGrid
              year={panelYear}
              displayMonth={panelMonthIndex}
              selectedMonth={panelMonthIndex}
              selectedYear={panelYear}
              currentMonth={context.now.getMonth()}
              currentYear={context.now.getFullYear()}
              startMonth={panelBoundaries.startMonth}
              endMonth={panelBoundaries.endMonth}
              onEscape={() => context.setPanelView(displayIndex, "years")}
              onSelect={(monthIndex) => {
                context.setPanelMonth(displayIndex, new Date(panelYear, monthIndex, 1))
                requestAnimationFrame(() => context.returnPanelToDays(displayIndex))
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}

const CalendarMonthCaption: CustomComponents["MonthCaption"] = ({
  calendarMonth,
  displayIndex,
  className,
  children,
  ...props
}) => {
  const context = useCalendarSurfaceContext()

  if (!context.enableYearMonthPicker) {
    return (
      <div {...props} className={className}>
        {children}
      </div>
    )
  }

  return (
    <div {...props} className={className}>
      <CaptionToggle
        label={format(calendarMonth.date, "MMMM yyyy")}
        expanded={false}
        onClick={() => context.setPanelView(displayIndex, "years")}
        ariaLabel={`Select year and month. Currently ${format(calendarMonth.date, "MMMM yyyy")}`}
      />
    </div>
  )
}

function CalendarSurface({
  mode,
  selection,
  onSelect,
  className,
  classNames,
  size = "md",
  disabled = false,
  minDate,
  maxDate,
  disabledDates,
  enableYearMonthPicker = true,
  animated = true,
  monthTransition = "slide",
  viewTransition = "fade",
  animationDuration = 160,
  month: controlledMonth,
  defaultMonth,
  onMonthChange,
  startMonth,
  endMonth,
  numberOfMonths = 1,
  calendarProps,
}: CalendarSurfaceProps) {
  const [now] = React.useState(() => new Date())
  const boundaries = getEffectiveBoundaries({ minDate, maxDate, startMonth, endMonth })
  const requestedMonthCount = Number.isFinite(numberOfMonths) ? Math.round(numberOfMonths) : 1
  const availableMonthCount =
    boundaries.startMonth && boundaries.endMonth
      ? differenceInCalendarMonths(boundaries.endMonth, boundaries.startMonth) + 1
      : requestedMonthCount
  const monthCount = Math.min(3, Math.max(1, requestedMonthCount), Math.max(1, availableMonthCount))
  const [internalMonth, setInternalMonth] = React.useState(() => {
    const candidate =
      (isValidDate(controlledMonth) && controlledMonth) ||
      (isValidDate(defaultMonth) && defaultMonth) ||
      getSelectionAnchor(selection) ||
      now
    return normalizeVisibleMonth(candidate, boundaries.startMonth, boundaries.endMonth, monthCount)
  })
  const [panelViews, setPanelViews] = React.useState<Record<number, PickerView>>({})
  const shellRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setPanelViews((current) => {
      const entries = Object.entries(current).filter(
        ([displayIndex]) => enableYearMonthPicker && Number(displayIndex) < monthCount
      )
      if (entries.length === Object.keys(current).length) return current
      return Object.fromEntries(entries)
    })
  }, [enableYearMonthPicker, monthCount])

  const displayMonth = normalizeVisibleMonth(
    (isValidDate(controlledMonth) && controlledMonth) || internalMonth,
    boundaries.startMonth,
    boundaries.endMonth,
    monthCount
  )
  const resolvedAnimationDuration = Number.isFinite(animationDuration)
    ? Math.max(0, animationDuration)
    : 160
  const effectiveMonthTransition = animated ? monthTransition : "none"
  const effectiveViewTransition = animated ? viewTransition : "none"
  const visiblePanelViews = Array.from(
    { length: monthCount },
    (_, displayIndex) => panelViews[displayIndex] ?? "days"
  )
  const hasOpenPanelPicker = visiblePanelViews.some((view) => view !== "days")

  function setDisplayMonth(nextMonth: Date) {
    const normalized = normalizeVisibleMonth(
      nextMonth,
      boundaries.startMonth,
      boundaries.endMonth,
      monthCount
    )
    if (!isValidDate(controlledMonth)) setInternalMonth(normalized)
    onMonthChange?.(normalized)
  }

  function setPanelView(displayIndex: number, view: PickerView) {
    setPanelViews((current) => ({ ...current, [displayIndex]: view }))
  }

  function setPanelMonth(displayIndex: number, nextPanelMonth: Date) {
    setDisplayMonth(subMonths(nextPanelMonth, displayIndex))
  }

  function returnPanelToDays(displayIndex: number) {
    setPanelView(displayIndex, "days")
    requestAnimationFrame(() => {
      shellRef.current
        ?.querySelector<HTMLButtonElement>(
          `[data-rdp-panel="${displayIndex}"] .rdp-caption_label--button`
        )
        ?.focus({ preventScroll: true })
    })
  }

  const disabledMatchers = getDisabledMatchers(disabled, disabledDates, minDate, maxDate)
  const rootClassName = cn("rdp-root rdp-root--embedded", classNames?.root, className)
  const contextValue: CalendarSurfaceContextValue = {
    enableYearMonthPicker,
    panelViews,
    now,
    startMonth: boundaries.startMonth,
    endMonth: boundaries.endMonth,
    numberOfMonths: monthCount,
    setPanelView,
    setPanelMonth,
    returnPanelToDays,
  }

  const commonDayPickerProps = {
    showOutsideDays: true,
    fixedWeeks: true,
    navLayout: "after" as const,
    ...calendarProps,
    // DayPicker clones month DOM for its slide animation. Custom picker panels do not
    // contain DayPicker's animation markers, so only animate complete day calendars.
    animate: effectiveMonthTransition !== "none" && !hasOpenPanelPicker,
    month: displayMonth,
    onMonthChange: setDisplayMonth,
    startMonth: boundaries.startMonth,
    endMonth: boundaries.endMonth,
    numberOfMonths: monthCount,
    disabled: disabledMatchers,
    classNames: { ...classNames, root: rootClassName },
    components: {
      Chevron,
      ...calendarProps?.components,
      Month: CalendarMonth,
      MonthCaption: CalendarMonthCaption,
    },
  }

  const daysView =
    mode === "single" ? (
      <DayPicker
        {...commonDayPickerProps}
        mode="single"
        selected={selection as Date | undefined}
        onSelect={(date) => onSelect(date)}
      />
    ) : mode === "multiple" ? (
      <DayPicker
        {...commonDayPickerProps}
        mode="multiple"
        selected={selection as Date[] | undefined}
        onSelect={(dates) => onSelect(dates)}
      />
    ) : (
      <DayPicker
        {...commonDayPickerProps}
        mode="range"
        selected={selection as DateRange | undefined}
        onSelect={(range) => onSelect(range)}
      />
    )

  return (
    <CalendarSurfaceContext.Provider value={contextValue}>
      <div
        ref={shellRef}
        className="rdp-shell"
        data-animated={animated ? "true" : "false"}
        data-disabled={disabled || undefined}
        data-month-transition={effectiveMonthTransition}
        data-months={monthCount}
        data-picker-view={hasOpenPanelPicker ? "mixed" : "days"}
        data-size={size}
        data-view-transition={effectiveViewTransition}
        style={
          {
            "--rdp-animation-duration": `${resolvedAnimationDuration}ms`,
          } as React.CSSProperties
        }
      >
        {daysView}
      </div>
    </CalendarSurfaceContext.Provider>
  )
}

export function DatePicker({
  mode = "single",
  value: controlledValue,
  defaultValue,
  onValueChange,
  ...props
}: DatePickerProps) {
  const [value, setValue] = useControllableValue<Date | Date[]>(
    controlledValue,
    defaultValue,
    onValueChange as ((value: Date | Date[] | undefined) => void) | undefined
  )

  return (
    <CalendarSurface
      {...props}
      mode={mode}
      selection={value}
      onSelect={(nextValue) => setValue(nextValue as Date | Date[] | undefined)}
    />
  )
}

DatePicker.displayName = "DatePicker"

type DatePickerPresetsProps = {
  presets?: DateRangePreset[]
  value?: DateRangeValue
  onValueChange: (range: DateRangeValue) => void
  className?: string
}

export function DatePickerPresets({
  presets = defaultDateRangePresets,
  value,
  onValueChange,
  className,
}: DatePickerPresetsProps) {
  return (
    <div className={cn("rdp-presets", className)} role="group" aria-label="Date range presets">
      {presets.map((preset) => {
        const presetValue = preset.getValue()
        return (
          <Button
            key={preset.label}
            type="button"
            variant="ghost"
            size="sm"
            className="rdp-preset_button"
            aria-pressed={isSameRange(value, presetValue)}
            onClick={() => onValueChange(preset.getValue())}
          >
            {preset.label}
          </Button>
        )
      })}
    </div>
  )
}

function DateRangePickerFooter({
  value,
  onClear,
  onCancel,
  onApply,
}: {
  value?: DateRangeValue
  onClear: () => void
  onCancel: () => void
  onApply: () => void
}) {
  return (
    <div className="rdp-picker_footer">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onClear}
        disabled={!value?.from}
        aria-label="Clear date range"
      >
        Clear
      </Button>
      <div className="rdp-picker_footer_actions">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          aria-label="Cancel date range changes"
        >
          Cancel
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={onApply}
          disabled={Boolean(value?.from && !value?.to)}
          aria-label="Apply date range"
        >
          Apply
        </Button>
      </div>
    </div>
  )
}

export function DateRangePicker({
  value: controlledValue,
  defaultValue,
  onValueChange,
  presets = defaultDateRangePresets,
  showPresets = false,
  showFooter = false,
  closeOnSelect = false,
  numberOfMonths = 2,
  onApply,
  onCancel,
  ...props
}: DateRangePickerProps) {
  const [value, setValue] = useControllableValue(controlledValue, defaultValue, onValueChange)

  return (
    <div
      className="rdp-range_picker"
      data-framed={showPresets || showFooter || undefined}
      data-with-presets={showPresets || undefined}
    >
      {showPresets ? (
        <DatePickerPresets presets={presets} value={value} onValueChange={setValue} />
      ) : null}
      <div className="rdp-range_picker_main">
        <CalendarSurface
          {...props}
          mode="range"
          numberOfMonths={numberOfMonths}
          selection={value}
          onSelect={(nextValue) => {
            const nextRange = nextValue as DateRangeValue | undefined
            setValue(nextRange)
            if (closeOnSelect && isCompleteRange(nextRange)) onApply?.(nextRange)
          }}
        />
        {showFooter ? (
          <DateRangePickerFooter
            value={value}
            onClear={() => setValue(undefined)}
            onCancel={() => onCancel?.()}
            onApply={() => onApply?.(value)}
          />
        ) : null}
      </div>
    </div>
  )
}

DateRangePicker.displayName = "DateRangePicker"

function DatePickerTrigger({
  controlId,
  value,
  placeholder,
  ariaLabel,
  disabled,
  clearable,
  size,
  triggerClassName,
  onClear,
  clearLabel,
}: {
  controlId: string
  value: string
  placeholder: string
  ariaLabel: string
  disabled: boolean
  clearable: boolean
  size: DatePickerSize
  triggerClassName?: string
  onClear: () => void
  clearLabel: string
}) {
  const hasValue = Boolean(value)

  return (
    <div className="rdp-input_control" data-size={size} data-disabled={disabled || undefined}>
      <CalendarIcon className="rdp-input_icon" aria-hidden="true" />
      <Input
        aria-hidden="true"
        className={cn("rdp-input_surface", triggerClassName)}
        disabled={disabled}
        placeholder={placeholder}
        readOnly
        size={size}
        tabIndex={-1}
        value={value}
      />
      <PopoverTrigger
        disabled={disabled}
        render={
          <button
            id={controlId}
            type="button"
            className="rdp-input_trigger"
            aria-label={ariaLabel}
          />
        }
      />
      {clearable && hasValue ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="rdp-input_clear"
          disabled={disabled}
          aria-label={clearLabel}
          onClick={onClear}
        >
          <XIcon aria-hidden="true" />
        </Button>
      ) : null}
    </div>
  )
}

function PickerInputContainer({
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
  if (!label) return <div className={cn("rdp-input", className)}>{children}</div>

  return (
    <Field className={cn("rdp-input", className)}>
      <FieldLabel htmlFor={controlId}>{label}</FieldLabel>
      {children}
    </Field>
  )
}

export function DatePickerInput({
  value: controlledValue,
  defaultValue,
  onValueChange,
  label,
  formatPreset = "medium",
  displayFormat,
  placeholder = "Select date",
  disabled = false,
  size = "md",
  closeOnSelect = true,
  clearable = true,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  className,
  calendarClassName,
  triggerClassName,
  popoverClassName,
  calendarProps,
  ...props
}: DatePickerInputProps) {
  const [value, setValue] = useControllableValue(controlledValue, defaultValue, onValueChange)
  const [open, setOpen] = useControllableOpen(controlledOpen, defaultOpen, onOpenChange)
  const controlId = React.useId()
  const formattedValue = formatDateValue(value, { formatPreset, displayFormat })
  const triggerAriaLabel = formattedValue
    ? `Change ${label || "date"}: ${formattedValue}`
    : `Choose ${label || "date"}`

  return (
    <PickerInputContainer label={label} controlId={controlId} className={className}>
      <Popover open={open} onOpenChange={(nextOpen) => setOpen(nextOpen)}>
        <DatePickerTrigger
          controlId={controlId}
          value={formattedValue}
          placeholder={placeholder}
          ariaLabel={triggerAriaLabel}
          disabled={disabled}
          clearable={clearable}
          size={size}
          triggerClassName={triggerClassName}
          clearLabel="Clear date"
          onClear={() => setValue(undefined)}
        />
        <PopoverContent
          align="start"
          sideOffset={8}
          initialFocus={(openType) => openType === "keyboard"}
          className={cn("rdp-popover_content", popoverClassName)}
        >
          <DatePicker
            {...props}
            className={calendarClassName}
            size={size}
            disabled={disabled}
            value={value}
            onValueChange={(nextValue) => {
              setValue(nextValue)
              if (nextValue && closeOnSelect) setOpen(false)
            }}
            calendarProps={calendarProps}
          />
        </PopoverContent>
      </Popover>
    </PickerInputContainer>
  )
}

DatePickerInput.displayName = "DatePickerInput"

export function DateRangePickerInput({
  value: controlledValue,
  defaultValue,
  onValueChange,
  label,
  startLabel = "Start date",
  endLabel = "End date",
  formatPreset = "medium",
  displayFormat,
  placeholder = "Select date range",
  startPlaceholder = "Start date",
  endPlaceholder = "End date",
  rangeSeparator = "\u2013",
  disabled = false,
  size = "md",
  closeOnSelect = false,
  clearable = true,
  showPresets = true,
  showFooter = true,
  presets = defaultDateRangePresets,
  numberOfMonths = 2,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  className,
  calendarClassName,
  triggerClassName,
  popoverClassName,
  calendarProps,
  ...props
}: DateRangePickerInputProps) {
  const [value, setValue] = useControllableValue(controlledValue, defaultValue, onValueChange)
  const [draft, setDraft] = React.useState<DateRangeValue | undefined>(value)
  const [open, setOpen] = useControllableOpen(controlledOpen, defaultOpen, onOpenChange)
  const controlId = React.useId()
  const displayedRange = open ? draft : value
  const formattedRange = formatDateRangeValue(displayedRange, {
    formatPreset,
    displayFormat,
    rangeSeparator,
    startPlaceholder,
    endPlaceholder,
  })
  const formatOptions = { formatPreset, displayFormat }
  const formattedStart = formatDateValue(displayedRange?.from, formatOptions)
  const formattedEnd = formatDateValue(displayedRange?.to, formatOptions)
  const triggerAriaLabel = `${label || "Date range"}. ${startLabel}: ${
    formattedStart || startPlaceholder
  }. ${endLabel}: ${formattedEnd || endPlaceholder}`

  React.useEffect(() => {
    if (!open) setDraft(value)
  }, [open, value])

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) setDraft(value)
    if (!nextOpen) setDraft(value)
    setOpen(nextOpen)
  }

  const handleDraftChange = (nextRange: DateRangeValue | undefined) => {
    setDraft(nextRange)
    if (!showFooter) setValue(nextRange)
    if (closeOnSelect && isCompleteRange(nextRange)) {
      setValue(nextRange)
      setOpen(false)
    }
  }

  return (
    <PickerInputContainer label={label} controlId={controlId} className={className}>
      <Popover open={open} onOpenChange={(nextOpen) => handleOpenChange(nextOpen)}>
        <DatePickerTrigger
          controlId={controlId}
          value={formattedRange}
          placeholder={placeholder}
          ariaLabel={triggerAriaLabel}
          disabled={disabled}
          clearable={clearable}
          size={size}
          triggerClassName={triggerClassName}
          clearLabel="Clear date range"
          onClear={() => {
            setDraft(undefined)
            setValue(undefined)
          }}
        />
        <PopoverContent
          align="start"
          sideOffset={8}
          initialFocus={(openType) => openType === "keyboard"}
          className={cn("rdp-popover_content rdp-popover_content--range", popoverClassName)}
        >
          <DateRangePicker
            {...props}
            className={calendarClassName}
            size={size}
            disabled={disabled}
            value={draft}
            onValueChange={handleDraftChange}
            presets={presets}
            showPresets={showPresets}
            showFooter={showFooter}
            numberOfMonths={numberOfMonths}
            calendarProps={calendarProps}
            onCancel={() => {
              setDraft(value)
              setOpen(false)
            }}
            onApply={(nextRange) => {
              setValue(nextRange)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </PickerInputContainer>
  )
}

DateRangePickerInput.displayName = "DateRangePickerInput"
