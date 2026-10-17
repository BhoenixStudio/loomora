'use client'

import {
  forwardRef,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { hasError, InputErrorMessage, InputHelper, InputHelperProps, Label, LabelProps } from '../../..'
import { useLoomora } from '../../../../config'
import { cx, hasProps } from '../../../../hooks'
import { useResponsive } from '../../../../utils'
import { ConditionalWrapper } from '../../../Helper'
import {
  CalendarView,
  DateFieldMode,
  DateFieldProps,
  DateFieldRangeProperties,
  DateFieldSingleProperties,
  DateFieldValue,
  DatePreset,
  DateRangeValue,
  formatDisplay,
  formatTimePart,
  getDefaultPresets,
  parseDate,
  parseDateRange,
} from './helper'
import { Calendar, Footer, Header, Presets, TimeSpinner } from './Modules'

function useSafeResponsive() {
  try {
    return useResponsive()
  } catch {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isUltra: false,
    }
  }
}

type PopoverCoords = {
  top: number
  left: number
  placementV: 'top' | 'bottom'
}

export const DateField = forwardRef<HTMLInputElement, DateFieldProps>((props, ref) => {
  const { form, translations, t } = useLoomora()
  const responsive = useSafeResponsive()
  const [windowWidth, setWindowWidth] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleResize = () => setWindowWidth(window.innerWidth)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = windowWidth !== null ? windowWidth < 768 : responsive.isMobile

  const {
    size = [],
    properties,
    fieldset,
    fieldsetPrefix,
    fieldsetSuffix,
    wrapper,
    label = '',
    prefix,
    suffix,
    inputHelper,
    errors,
    active: forceActive = false,
    loading = false,
    condition,
  } = props

  const error = hasError(errors)

  const {
    className: fieldsetClass = form?.fieldset?.className,
    attributes: fieldsetAttrs,
    ...restFieldset
  } = fieldset ?? {}
  const { className: wrapperClass, attributes: wrapperAttrs, ...restWrapper } = wrapper ?? {}

  const mode: DateFieldMode = properties?.mode ?? 'date'
  const isRangeMode = mode === 'dateRange' || mode === 'timeRange' || mode === 'dateTimeRange'
  const isTimeMode = mode === 'time' || mode === 'timeRange'

  const {
    name,
    placeholder,
    required,
    disabled = false,
    readOnly = false,
    allowInput = false,
    allowClear = form?.dateField?.allowClear ?? true,
    hour12 = form?.dateField?.hour12 ?? true,
    showSeconds = form?.dateField?.showSeconds ?? false,
    minuteStep = form?.dateField?.minuteStep ?? 1,
    secondStep = form?.dateField?.secondStep ?? 1,
    minDate,
    maxDate,
    disabledDates,
    disabledDaysOfWeek,
    firstDayOfWeek = form?.dateField?.firstDayOfWeek ?? 0,
    showPresets = true,
    presets: customPresets,
    showFooter = true,
    onOpen,
    onClose,
    onClear,
  } = properties ?? {}

  const openOnInputClick =
    properties?.openOnInputClick ??
    (properties?.manualInput !== undefined ? !properties.manualInput : undefined) ??
    (properties?.editManual !== undefined ? !properties.editManual : undefined) ??
    form?.dateField?.openOnInputClick ??
    (form?.dateField?.manualInput !== undefined ? !form.dateField.manualInput : false)

  const isManualEdit =
    properties?.manualInput ??
    properties?.editManual ??
    form?.dateField?.manualInput ??
    form?.dateField?.editManual ??
    !openOnInputClick

  // Props for single vs range
  const singleProps = !isRangeMode ? (properties as DateFieldSingleProperties | undefined) : undefined
  const rangeProps = isRangeMode ? (properties as DateFieldRangeProperties | undefined) : undefined

  // Controlled values
  const controlledSingle = !isRangeMode ? singleProps?.value : undefined
  const controlledRange = isRangeMode ? rangeProps?.value : undefined
  const defaultSingle = !isRangeMode ? singleProps?.defaultValue : undefined
  const defaultRange = isRangeMode ? rangeProps?.defaultValue : undefined

  // Internal state for uncontrolled usage
  const [internalSingle, setInternalSingle] = useState<DateFieldValue>(() => defaultSingle ?? null)
  const [internalRange, setInternalRange] = useState<DateRangeValue>(() =>
    Array.isArray(defaultRange) ? defaultRange : [null, null]
  )

  const currentSingle = useMemo<DateFieldValue>(() => {
    if (isRangeMode) return null
    if (controlledSingle !== undefined) return controlledSingle
    return internalSingle
  }, [isRangeMode, controlledSingle, internalSingle])

  const currentRange = useMemo<DateRangeValue>(() => {
    if (!isRangeMode) return [null, null]
    if (Array.isArray(controlledRange)) return controlledRange
    return internalRange
  }, [isRangeMode, controlledRange, internalRange])

  const rangeDates: [Date | null, Date | null] = useMemo(() => {
    if (isRangeMode && Array.isArray(currentRange)) {
      return [parseDate(currentRange[0]), parseDate(currentRange[1])]
    }
    return [null, null]
  }, [currentRange, isRangeMode])

  // Popover state
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<PopoverCoords>({
    top: 0,
    left: 0,
    placementV: 'bottom',
  })
  const [hoverDate, setHoverDate] = useState<Date | null>(null)

  // Navigation Calendar View state
  const initialViewDate = useMemo(() => {
    const singleParsed = !isRangeMode && currentSingle ? parseDate(currentSingle) : null
    if (singleParsed) return singleParsed

    const rangeStart = isRangeMode && Array.isArray(currentRange) ? currentRange[0] : null
    const rangeStartParsed = rangeStart ? parseDate(rangeStart) : null
    if (rangeStartParsed) return rangeStartParsed

    return new Date()
  }, [currentSingle, currentRange, isRangeMode])

  const [viewDate, setViewDate] = useState<Date>(initialViewDate)
  const [view, setView] = useState<CalendarView>('days')

  // Time components state for datetime / time modes
  const [timeState, setTimeState] = useState<{ hours: number; minutes: number; seconds: number }>(() => {
    const initDate = parseDate(currentSingle) ?? new Date()
    return { hours: initDate.getHours(), minutes: initDate.getMinutes(), seconds: initDate.getSeconds() }
  })

  // Time components for range mode
  const [startTimeState, setStartTimeState] = useState<{ hours: number; minutes: number; seconds: number }>(() => {
    const initDate =
      isRangeMode && Array.isArray(currentRange) ? (parseDate(currentRange[0]) ?? new Date()) : new Date()
    return { hours: initDate.getHours(), minutes: initDate.getMinutes(), seconds: initDate.getSeconds() }
  })
  const [endTimeState, setEndTimeState] = useState<{ hours: number; minutes: number; seconds: number }>(() => {
    const initDate =
      isRangeMode && Array.isArray(currentRange) ? (parseDate(currentRange[1]) ?? new Date()) : new Date()
    return { hours: initDate.getHours(), minutes: initDate.getMinutes(), seconds: initDate.getSeconds() }
  })

  const timeStateRef = useRef(timeState)
  timeStateRef.current = timeState

  const startTimeStateRef = useRef(startTimeState)
  startTimeStateRef.current = startTimeState

  const endTimeStateRef = useRef(endTimeState)
  endTimeStateRef.current = endTimeState

  // Text input value (when allowInput is enabled)
  const [inputText, setInputText] = useState('')

  // Refs
  const rootRef = useRef<HTMLFieldSetElement>(null)
  const iconButtonRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDialogElement>(null)

  const isDisabled = disabled || loading || readOnly

  // Presets list
  const presetsList = useMemo<DatePreset[]>(() => {
    if (!showPresets) return []
    if (customPresets) return customPresets
    const pConfig = form?.dateField?.presets
    const configPresets =
      mode === 'datetime'
        ? (pConfig?.datetime ?? pConfig?.dateTime)
        : mode === 'date'
          ? pConfig?.date
          : mode === 'dateRange'
            ? pConfig?.dateRange
            : mode === 'time'
              ? pConfig?.time
              : mode === 'timeRange'
                ? pConfig?.timeRange
                : mode === 'dateTimeRange'
                  ? pConfig?.dateTimeRange
                  : undefined

    if (configPresets && configPresets.length > 0) {
      return (configPresets as Array<{ title: string; date: DateFieldValue | DateRangeValue }>).map((item) => ({
        title: item.title,
        label: item.title,
        date: item.date,
        value: item.date,
      }))
    }
    return getDefaultPresets(mode, t)
  }, [showPresets, customPresets, form?.dateField?.presets, mode, t])

  // Calculated Second Month for dual-month display on desktop
  const secondMonthDate = useMemo(() => {
    return new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)
  }, [viewDate])

  // Year decade bounds for year jump view
  const yearRange = useMemo<[number, number]>(() => {
    const startYear = Math.floor(viewDate.getFullYear() / 10) * 10
    return [startYear, startYear + 9]
  }, [viewDate])

  // Sync formatted display into inputText
  useEffect(() => {
    const formatted = formatDisplay(isRangeMode ? currentRange : currentSingle, mode, { hour12, showSeconds })
    setInputText(formatted)
  }, [currentSingle, currentRange, isRangeMode, mode, hour12, showSeconds])

  // Commit Single Value
  const commitSingle = useCallback(
    (nextDate: Date | null, overrideTime?: { hours: number; minutes: number; seconds: number }) => {
      if (!nextDate && controlledSingle === undefined) setInternalSingle(null)
      if (!nextDate) {
        singleProps?.onChange?.(null, null)
        return
      }

      const t = overrideTime ?? timeStateRef.current
      let finalVal: DateFieldValue = nextDate

      if (mode === 'time') {
        finalVal = formatTimePart(
          nextDate.getHours(),
          nextDate.getMinutes(),
          nextDate.getSeconds(),
          hour12,
          showSeconds
        )
      } else if (mode === 'datetime') {
        const d = new Date(nextDate)
        d.setHours(t.hours, t.minutes, t.seconds)
        finalVal = d
      }

      if (controlledSingle === undefined) {
        setInternalSingle(finalVal)
      }
      singleProps?.onChange?.(finalVal, nextDate)
    },
    [mode, hour12, showSeconds, controlledSingle, singleProps]
  )

  // Commit Range Value
  const commitRange = useCallback(
    (
      nextRange: [Date | null, Date | null],
      overrideTimes?: {
        start?: { hours: number; minutes: number; seconds: number }
        end?: { hours: number; minutes: number; seconds: number }
      }
    ) => {
      const [start, end] = nextRange
      const sT = overrideTimes?.start ?? startTimeStateRef.current
      const eT = overrideTimes?.end ?? endTimeStateRef.current

      let finalRange: DateRangeValue = [start, end]

      if (mode === 'timeRange') {
        const sStr = start
          ? formatTimePart(start.getHours(), start.getMinutes(), start.getSeconds(), hour12, showSeconds)
          : null
        const eStr = end
          ? formatTimePart(end.getHours(), end.getMinutes(), end.getSeconds(), hour12, showSeconds)
          : null
        finalRange = [sStr, eStr]
      } else if (mode === 'dateTimeRange') {
        const sDate = start
          ? new Date(start.getFullYear(), start.getMonth(), start.getDate(), sT.hours, sT.minutes, sT.seconds)
          : null
        const eDate = end
          ? new Date(end.getFullYear(), end.getMonth(), end.getDate(), eT.hours, eT.minutes, eT.seconds)
          : null
        finalRange = [sDate, eDate]
      }

      if (controlledRange === undefined) {
        setInternalRange(finalRange)
      }
      rangeProps?.onChange?.(finalRange, [start, end])
    },
    [mode, hour12, showSeconds, controlledRange, rangeProps]
  )

  // Clear handler
  const handleClear = useCallback(() => {
    if (isRangeMode) {
      commitRange([null, null])
    } else {
      commitSingle(null)
    }
    onClear?.()
  }, [isRangeMode, commitRange, commitSingle, onClear])

  const closeOnSelect = useCallback(
    (shouldClose: boolean) => {
      if (!shouldClose) return
      setOpen(false)
      onClose?.()
    },
    [onClose]
  )

  // Select day handler
  const handleDaySelect = useCallback(
    (selected: Date) => {
      if (!isRangeMode) {
        commitSingle(selected)
        closeOnSelect(mode === 'date')
        return
      }

      const [start, end] = rangeDates
      const isStartingNewRange = !start || Boolean(start && end)

      if (isStartingNewRange) {
        commitRange([selected, null])
        return
      }

      const nextRange: [Date, Date] = selected < start ? [selected, start] : [start, selected]
      commitRange(nextRange)
      closeOnSelect(mode === 'dateRange')
    },
    [isRangeMode, rangeDates, commitRange, commitSingle, mode, closeOnSelect]
  )

  // Presets handler
  const handlePresetSelect = useCallback(
    (presetVal: DatePreset['value'] | DatePreset['date']) => {
      const resolved =
        typeof presetVal === 'function' ? (presetVal as () => DateFieldValue | DateRangeValue)() : presetVal

      const isRangePreset = isRangeMode && Array.isArray(resolved)
      const isSinglePreset = !isRangeMode && !Array.isArray(resolved)

      if (isRangePreset) {
        const [s, e] = resolved
        const sD = parseDate(s)
        const eD = parseDate(e)
        commitRange([sD, eD])
        setViewDate(sD ?? new Date())
        setOpen(false)
        onClose?.()
        return
      }

      if (isSinglePreset) {
        const d = parseDate(resolved)
        commitSingle(d)
        setViewDate(d ?? new Date())
        setOpen(false)
        onClose?.()
        return
      }

      setOpen(false)
      onClose?.()
    },
    [isRangeMode, commitRange, commitSingle, onClose]
  )

  // Today / Now Action
  const handleTodayOrNow = useCallback(() => {
    const now = new Date()
    if (isRangeMode) {
      commitRange([now, now])
    } else {
      commitSingle(now)
    }
    setViewDate(now)
    closeOnSelect(mode === 'date')
  }, [isRangeMode, commitRange, commitSingle, mode, closeOnSelect])

  // Navigation Handlers
  const handlePrev = useCallback(() => {
    const next = new Date(viewDate)
    if (view === 'days') next.setMonth(next.getMonth() - 1)
    if (view === 'months') next.setFullYear(next.getFullYear() - 1)
    if (view === 'years') next.setFullYear(next.getFullYear() - 10)
    setViewDate(next)
  }, [viewDate, view])

  const handleNext = useCallback(() => {
    const next = new Date(viewDate)
    if (view === 'days') next.setMonth(next.getMonth() + 1)
    if (view === 'months') next.setFullYear(next.getFullYear() + 1)
    if (view === 'years') next.setFullYear(next.getFullYear() + 10)
    setViewDate(next)
  }, [viewDate, view])

  // Calculate popover fixed position on desktop
  const updatePosition = useCallback(() => {
    const triggerEl = iconButtonRef.current ?? rootRef.current
    if (!triggerEl) return

    const triggerRect = triggerEl.getBoundingClientRect()
    const popoverEl = popoverRef.current

    const popoverWidth = popoverEl ? popoverEl.offsetWidth : 320
    const popoverHeight = popoverEl ? popoverEl.offsetHeight : 380

    const winWidth = window.innerWidth
    const winHeight = window.innerHeight

    const GAP = 8
    const PADDING = 10

    const spaceBelow = winHeight - triggerRect.bottom - GAP
    const spaceAbove = triggerRect.top - GAP
    const shouldPlaceTop = spaceBelow < popoverHeight && spaceAbove > spaceBelow

    const placementV: 'top' | 'bottom' = shouldPlaceTop ? 'top' : 'bottom'
    const rawTop = shouldPlaceTop ? triggerRect.top - popoverHeight - GAP : triggerRect.bottom + GAP

    const top = Math.max(PADDING, Math.min(rawTop, Math.max(PADDING, winHeight - popoverHeight - PADDING)))

    const isRtl = document.documentElement.dir === 'rtl' || document.body.dir === 'rtl'
    const rawLeft = isRtl ? triggerRect.right - popoverWidth : triggerRect.left

    const maxLeft = Math.max(PADDING, winWidth - popoverWidth - PADDING)
    const left = Math.max(PADDING, Math.min(rawLeft, maxLeft))

    setCoords((prev) =>
      prev.top === top && prev.left === left && prev.placementV === placementV ? prev : { top, left, placementV }
    )
  }, [])

  // Position updates on scroll / resize / view change
  useEffect(() => {
    if (!open || isMobile) return

    updatePosition()

    const handleScrollOrResize = () => updatePosition()
    window.addEventListener('resize', handleScrollOrResize)
    window.addEventListener('scroll', handleScrollOrResize, true)

    const frameId = requestAnimationFrame(updatePosition)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleScrollOrResize)
      window.removeEventListener('scroll', handleScrollOrResize, true)
    }
  }, [open, isMobile, updatePosition, view])

  // Lock mobile body scroll when dialog is open
  useEffect(() => {
    if (!open || !isMobile) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [open, isMobile])

  // Outside click & Escape closing (including portal ref)
  useEffect(() => {
    if (!open) return

    const handleOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node
      const isInsideRoot = rootRef.current?.contains(target)
      const isInsidePopover = popoverRef.current?.contains(target)
      const isInsideIcon = iconButtonRef.current?.contains(target)

      if (isInsideRoot || isInsidePopover || isInsideIcon) return

      setOpen(false)
      onClose?.()
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      onClose?.()
    }

    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, onClose])

  const handleToggleOpen = () => {
    if (isDisabled) return

    if (open) {
      setOpen(false)
      onClose?.()
      return
    }

    setOpen(true)
    onOpen?.()
  }

  // Label configuration
  let labelClass = ''
  let restLabel: LabelProps = { children: '' }
  if (hasProps(label, 'children')) {
    const { className: lCN, ...restOfLabel } = (label ?? {}) as LabelProps
    labelClass = lCN ?? ''
    restLabel = restOfLabel
  }
  const isActive = forceActive || open || Boolean(inputText)
  const labelClassName = cx([
    form?.label?.stateSharedClassName,
    {
      value: form?.label?.activeClassName,
      fallback: form?.label?.inactiveClassName,
      condition: isActive,
    },
    labelClass,
  ])

  // Default Icons
  const defaultIcon = isTimeMode ? (form?.dateField?.clockIcon ?? '🕒') : (form?.dateField?.calendarIcon ?? '📅')

  // Default Placeholder
  const defaultPlaceholder = useMemo(() => {
    if (placeholder) return placeholder
    if (mode === 'date') return translations?.dateField?.selectDate ?? 'YYYY-MM-DD'
    if (mode === 'time') return translations?.dateField?.selectTime ?? (hour12 ? 'hh:mm AM' : 'HH:mm')
    if (mode === 'datetime') return translations?.dateField?.selectDate ?? 'YYYY-MM-DD HH:mm'
    if (mode === 'dateRange') return translations?.dateField?.selectRange ?? 'Start date  →  End date'
    if (mode === 'timeRange') return 'Start time  →  End time'
    if (mode === 'dateTimeRange') return 'Start date & time  →  End date & time'
    return ''
  }, [placeholder, mode, hour12, translations])

  const hasValue = Boolean(inputText)

  if (condition === false) return null

  // Native serialized value for hidden input
  const hiddenValue = isRangeMode
    ? JSON.stringify(currentRange)
    : currentSingle instanceof Date
      ? currentSingle.toISOString()
      : (currentSingle ?? '')

  // Time change helpers
  const handleSingleTimeChange = (next: { hours: number; minutes: number; seconds: number }) => {
    setTimeState(next)
    const base = parseDate(currentSingle) ?? new Date()
    const d = new Date(base)
    d.setHours(next.hours, next.minutes, next.seconds)
    commitSingle(d, next)
  }

  const handleStartTimeChange = (next: { hours: number; minutes: number; seconds: number }) => {
    setStartTimeState(next)
    const [start, end] = rangeDates
    const base = start ?? new Date()
    const newStart = new Date(base)
    newStart.setHours(next.hours, next.minutes, next.seconds)
    commitRange([newStart, end], { start: next })
  }

  const handleEndTimeChange = (next: { hours: number; minutes: number; seconds: number }) => {
    setEndTimeState(next)
    const [start, end] = rangeDates
    const base = end ?? new Date()
    const newEnd = new Date(base)
    newEnd.setHours(next.hours, next.minutes, next.seconds)
    commitRange([start, newEnd], { end: next })
  }

  const handleInputChange = (val: string) => {
    setInputText(val)

    if (!isRangeMode) {
      const parsed = parseDate(val)
      if (parsed) commitSingle(parsed)
      return
    }

    const range = parseDateRange(val)
    if (range?.[0] && range?.[1]) commitRange(range)
  }

  const modalTitle = isTimeMode
    ? (translations?.dateField?.selectTime ?? 'Select Time')
    : isRangeMode
      ? (translations?.dateField?.selectRange ?? 'Select Date Range')
      : (translations?.dateField?.selectDate ?? 'Select Date')

  // Picker Main Content Fragment
  const pickerMainContent = (
    <div className="flex flex-col flex-1">
      {/* If it's pure time mode */}
      {isTimeMode && (
        <div className="flex flex-wrap p-3 items-center justify-center">
          {mode === 'time' && (
            <TimeSpinner
              hours={timeState.hours}
              minutes={timeState.minutes}
              seconds={timeState.seconds}
              onChange={handleSingleTimeChange}
              hour12={hour12}
              showSeconds={showSeconds}
              minuteStep={minuteStep}
              secondStep={secondStep}
            />
          )}
          {mode === 'timeRange' && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <TimeSpinner
                label={translations?.dateField?.startTime ?? 'Start Time'}
                hours={startTimeState.hours}
                minutes={startTimeState.minutes}
                seconds={startTimeState.seconds}
                onChange={handleStartTimeChange}
                hour12={hour12}
                showSeconds={showSeconds}
                minuteStep={minuteStep}
                secondStep={secondStep}
              />
              <span className="hidden sm:inline-block text-body-3 font-bold text-lg select-none">→</span>
              <TimeSpinner
                label={translations?.dateField?.endTime ?? 'End Time'}
                hours={endTimeState.hours}
                minutes={endTimeState.minutes}
                seconds={endTimeState.seconds}
                onChange={handleEndTimeChange}
                hour12={hour12}
                showSeconds={showSeconds}
                minuteStep={minuteStep}
                secondStep={secondStep}
              />
            </div>
          )}
        </div>
      )}

      {/* If it's Date or DateTime or DateRange or DateTimeRange */}
      {!isTimeMode && (
        <div className="flex flex-col">
          {/* Calendar Header */}
          <Header
            viewDate={viewDate}
            secondMonthDate={secondMonthDate}
            isDualMonth={!isMobile && isRangeMode && view === 'days'}
            view={view}
            onViewChange={setView}
            onPrev={handlePrev}
            onNext={handleNext}
            yearRange={yearRange}
          />

          {/* Main Calendar Area */}
          <div className={cx(['flex flex-wrap items-start justify-center', { value: 'gap-1', condition: !isMobile }])}>
            {/* Primary Calendar (Month 1) */}
            <Calendar
              viewDate={viewDate}
              selectedDate={parseDate(currentSingle)}
              range={rangeDates}
              hoverDate={hoverDate}
              onSelectDate={handleDaySelect}
              onHoverDate={setHoverDate}
              onViewDateChange={setViewDate}
              view={view}
              onViewChange={setView}
              isRange={isRangeMode}
              firstDayOfWeek={firstDayOfWeek}
              minDate={minDate}
              maxDate={maxDate}
              disabledDates={disabledDates}
              disabledDaysOfWeek={disabledDaysOfWeek}
              yearRange={yearRange}
            />

            {/* Secondary Calendar (Month 2 for dual-month on desktop) */}
            {!isMobile && isRangeMode && view === 'days' && (
              <div className="border-s border-body-3/20">
                <Calendar
                  viewDate={secondMonthDate}
                  selectedDate={null}
                  range={rangeDates}
                  hoverDate={hoverDate}
                  onSelectDate={handleDaySelect}
                  onHoverDate={setHoverDate}
                  onViewDateChange={(d) => {
                    const prev = new Date(d)
                    prev.setMonth(prev.getMonth() - 1)
                    setViewDate(prev)
                  }}
                  view="days"
                  onViewChange={setView}
                  isRange={true}
                  firstDayOfWeek={firstDayOfWeek}
                  minDate={minDate}
                  maxDate={maxDate}
                  disabledDates={disabledDates}
                  disabledDaysOfWeek={disabledDaysOfWeek}
                  yearRange={yearRange}
                />
              </div>
            )}

            {/* Time selection for datetime */}
            {mode === 'datetime' && (
              <div className="p-2 border-s border-body-3/20">
                <TimeSpinner
                  hours={timeState.hours}
                  minutes={timeState.minutes}
                  seconds={timeState.seconds}
                  onChange={handleSingleTimeChange}
                  hour12={hour12}
                  showSeconds={showSeconds}
                  minuteStep={minuteStep}
                  secondStep={secondStep}
                />
              </div>
            )}

            {mode === 'dateTimeRange' && (
              <div className="flex flex-col sm:flex-row gap-2 p-2 border-s border-body-3/20">
                <TimeSpinner
                  label={translations?.dateField?.startTime ?? 'Start Time'}
                  hours={startTimeState.hours}
                  minutes={startTimeState.minutes}
                  seconds={startTimeState.seconds}
                  onChange={handleStartTimeChange}
                  hour12={hour12}
                  showSeconds={showSeconds}
                  minuteStep={minuteStep}
                  secondStep={secondStep}
                />
                <TimeSpinner
                  label={translations?.dateField?.endTime ?? 'End Time'}
                  hours={endTimeState.hours}
                  minutes={endTimeState.minutes}
                  seconds={endTimeState.seconds}
                  onChange={handleEndTimeChange}
                  hour12={hour12}
                  showSeconds={showSeconds}
                  minuteStep={minuteStep}
                  secondStep={secondStep}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Footer */}
      {showFooter && (
        <Footer
          mode={mode}
          onClear={allowClear ? handleClear : undefined}
          onToday={handleTodayOrNow}
          onCancel={() => {
            setOpen(false)
            onClose?.()
          }}
          onApply={() => {
            setOpen(false)
            onClose?.()
          }}
        />
      )}
    </div>
  )

  // Floating Popover Portal Content
  const portalContent =
    mounted &&
    open &&
    !isDisabled &&
    typeof document !== 'undefined' &&
    createPortal(
      isMobile ? (
        <dialog
          ref={popoverRef}
          aria-modal="true"
          aria-label="Date and time picker"
          className="fixed inset-0 z-9999 w-full h-dvh bg-main flex flex-col justify-between overflow-hidden animate-in fade-in select-none"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-body-3/20 shrink-0 bg-second/10">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-title-1">
                {typeof label === 'string' && label ? label : modalTitle}
              </span>
              <span className="text-xs text-body-3">{defaultPlaceholder}</span>
            </div>
            <button
              type="button"
              aria-label="Close picker"
              onClick={() => {
                setOpen(false)
                onClose?.()
              }}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-second text-title-2 hover:text-title-1 hover:bg-second/80 transition-colors cursor-pointer text-sm font-semibold"
            >
              ✕
            </button>
          </div>

          {showPresets && presetsList.length > 0 && (
            <Presets presets={presetsList} onSelect={handlePresetSelect} isMobile />
          )}

          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-start py-3 px-2">
            {pickerMainContent}
          </div>
        </dialog>
      ) : (
        <dialog
          ref={popoverRef}
          aria-modal="true"
          aria-label="Date and time picker"
          style={{
            position: 'fixed',
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            minWidth: mode === 'dateTimeRange' ? '780px' : isRangeMode ? '560px' : '300px',
          }}
          className={cx([
            'fixed z-9999 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-body-3/30',
            'bg-main shadow-2xl backdrop-blur flex flex-col overflow-hidden animate-in fade-in select-none',
          ])}
        >
          <div className="flex">
            {showPresets && presetsList.length > 0 && (
              <Presets presets={presetsList} onSelect={handlePresetSelect} isMobile={false} />
            )}

            {pickerMainContent}
          </div>
        </dialog>
      ),
      document.body
    )

  return (
    <fieldset
      ref={rootRef}
      className={cx(['flex flex-col flex-nowrap relative', ...size, fieldsetClass])}
      {...fieldsetAttrs}
      {...restFieldset}
    >
      {fieldsetPrefix}

      <div
        onClick={openOnInputClick && !isDisabled ? handleToggleOpen : undefined}
        className={cx([
          'flex flex-nowrap items-center relative border bg-inherit rounded gap-2 transition-colors',
          { value: 'ps-3', condition: Boolean(prefix) },
          { value: 'pe-3', condition: Boolean(suffix) },
          { value: 'border-error/70', fallback: 'border-body-3/40', condition: error },
          { value: 'opacity-60 cursor-not-allowed', condition: isDisabled },
          { value: 'cursor-pointer', condition: !isDisabled && openOnInputClick },
          wrapperClass,
        ])}
        {...wrapperAttrs}
        {...restWrapper}
      >
        <ConditionalWrapper childrenCondition={Boolean(label)}>
          {hasProps(label, 'children') ? (
            <Label className={labelClassName} {...{ required, ...restLabel }} />
          ) : (
            <Label className={labelClassName} {...{ required }}>
              {label as ReactNode}
            </Label>
          )}
        </ConditionalWrapper>

        {prefix}

        <button
          ref={iconButtonRef}
          type="button"
          tabIndex={-1}
          disabled={isDisabled}
          aria-label={isTimeMode ? 'Open time picker' : 'Open date picker'}
          onClick={(e) => {
            e.stopPropagation()
            handleToggleOpen()
          }}
          className={cx([
            'shrink-0 flex items-center justify-center p-1.5 ms-2 text-body-3 text-sm transition-colors rounded select-none',
            {
              value: 'cursor-not-allowed opacity-50',
              fallback: 'cursor-pointer hover:text-primary hover:bg-second/70 active:scale-95',
              condition: isDisabled,
            },
          ])}
        >
          {defaultIcon}
        </button>

        <input
          ref={ref}
          type="text"
          readOnly={isDisabled || (!allowInput && !isManualEdit && openOnInputClick)}
          value={inputText}
          placeholder={defaultPlaceholder}
          disabled={isDisabled}
          required={required}
          onClick={() => {
            if (openOnInputClick) handleToggleOpen()
          }}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={(e: ReactKeyboardEvent<HTMLInputElement>) => {
            if (e.key !== 'Enter') return
            e.preventDefault()
            handleToggleOpen()
          }}
          className={cx([
            'flex-1 bg-transparent outline-none py-3 font-normal text-sm',
            { value: 'cursor-not-allowed', condition: isDisabled },
            { value: 'cursor-pointer', condition: !isDisabled && openOnInputClick },
            'pe-2',
            {
              value: 'placeholder:opacity-70',
              fallback: 'placeholder:opacity-0',
              condition: isActive || !label,
            },
          ])}
        />

        {/* Clear Button */}
        {allowClear && hasValue && !isDisabled && (
          <button
            type="button"
            aria-label="Clear date"
            onClick={(e) => {
              e.stopPropagation()
              handleClear()
            }}
            className="shrink-0 p-1 me-2 text-body-3 hover:text-error transition-colors cursor-pointer text-sm"
          >
            {form?.dateField?.clearIcon ?? '✕'}
          </button>
        )}

        {name && <input type="hidden" name={name} value={hiddenValue} />}

        {suffix}
      </div>

      {fieldsetSuffix}

      <ConditionalWrapper childrenCondition={Boolean(inputHelper)}>
        {hasProps(inputHelper, 'children') ? (
          <InputHelper {...(inputHelper as InputHelperProps)} />
        ) : (
          <InputHelper>{inputHelper as ReactNode}</InputHelper>
        )}
      </ConditionalWrapper>

      <InputErrorMessage {...{ errors }} />

      {portalContent}
    </fieldset>
  )
})

export const DatePickerField = DateField
