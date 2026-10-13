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
import {
  hasError,
  InputErrorMessage,
  InputHelper,
  InputHelperProps,
  Label,
  LabelProps,
} from '../../..'
import { ConditionalWrapper } from '../../../Helper'
import { useLoomora } from '../../../../config'
import { cx, hasProps } from '../../../../hooks'
import { useResponsive } from '../../../../utils'
import {
  CalendarView,
  DateFieldMode,
  DateFieldProperties,
  DateFieldProps,
  DateFieldRangeProperties,
  DateFieldSingleProperties,
  DateFieldValue,
  DatePreset,
  DateRangeValue,
  formatDisplay,
  formatTimePart,
  getDefaultPresets,
  isDateDisabled,
  isSameDay,
  padZero,
  parseDate,
  parseDateRange,
  parseTime,
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

export const DateField = forwardRef<HTMLInputElement, DateFieldProps>((props, ref) => {
  const { form, translations, t } = useLoomora()
  const responsive = useSafeResponsive()
  const [windowWidth, setWindowWidth] = useState<number | null>(null)

  useEffect(() => {
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
    minTime,
    maxTime,
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
  const [internalRange, setInternalRange] = useState<DateRangeValue>(
    () => (Array.isArray(defaultRange) ? defaultRange : [null, null])
  )

  const currentSingle: DateFieldValue = !isRangeMode
    ? (controlledSingle !== undefined ? controlledSingle : internalSingle)
    : null

  const currentRange: DateRangeValue = isRangeMode
    ? (Array.isArray(controlledRange) ? controlledRange : internalRange)
    : [null, null]

  const rangeDates: [Date | null, Date | null] = useMemo(() => {
    if (isRangeMode && Array.isArray(currentRange)) {
      return [parseDate(currentRange[0]), parseDate(currentRange[1])]
    }
    return [null, null]
  }, [currentRange, isRangeMode])

  // Popover state
  const [open, setOpen] = useState(false)
  const [popoverPosition, setPopoverPosition] = useState<'bottom' | 'top'>('bottom')
  const [hoverDate, setHoverDate] = useState<Date | null>(null)

  // Navigation Calendar View state
  const initialViewDate = useMemo(() => {
    if (!isRangeMode && currentSingle) {
      const d = parseDate(currentSingle)
      if (d) return d
    }
    if (isRangeMode && Array.isArray(currentRange) && currentRange[0]) {
      const d = parseDate(currentRange[0])
      if (d) return d
    }
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
    const initDate = isRangeMode && Array.isArray(currentRange) ? parseDate(currentRange[0]) ?? new Date() : new Date()
    return { hours: initDate.getHours(), minutes: initDate.getMinutes(), seconds: initDate.getSeconds() }
  })
  const [endTimeState, setEndTimeState] = useState<{ hours: number; minutes: number; seconds: number }>(() => {
    const initDate = isRangeMode && Array.isArray(currentRange) ? parseDate(currentRange[1]) ?? new Date() : new Date()
    return { hours: initDate.getHours(), minutes: initDate.getMinutes(), seconds: initDate.getSeconds() }
  })

  // Text input value (when allowInput is enabled)
  const [inputText, setInputText] = useState('')

  // Refs
  const rootRef = useRef<HTMLFieldSetElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

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
      return (configPresets as Array<{ title: string; date: any }>).map((item) => ({
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
    (nextDate: Date | null) => {
      let finalVal: DateFieldValue = nextDate
      if (nextDate && mode === 'time') {
        finalVal = formatTimePart(nextDate.getHours(), nextDate.getMinutes(), nextDate.getSeconds(), hour12, showSeconds)
      } else if (nextDate && mode === 'datetime') {
        const d = new Date(nextDate)
        d.setHours(timeState.hours, timeState.minutes, timeState.seconds)
        finalVal = d
      }

      if (controlledSingle === undefined) {
        setInternalSingle(finalVal)
      }
      singleProps?.onChange?.(finalVal, nextDate)
    },
    [mode, hour12, showSeconds, timeState, controlledSingle, singleProps]
  )

  // Commit Range Value
  const commitRange = useCallback(
    (nextRange: [Date | null, Date | null]) => {
      const [start, end] = nextRange
      let finalRange: DateRangeValue = [start, end]

      if (mode === 'timeRange') {
        const sStr = start ? formatTimePart(start.getHours(), start.getMinutes(), start.getSeconds(), hour12, showSeconds) : null
        const eStr = end ? formatTimePart(end.getHours(), end.getMinutes(), end.getSeconds(), hour12, showSeconds) : null
        finalRange = [sStr, eStr]
      } else if (mode === 'dateTimeRange') {
        const sDate = start ? new Date(start) : null
        const eDate = end ? new Date(end) : null
        if (sDate) sDate.setHours(startTimeState.hours, startTimeState.minutes, startTimeState.seconds)
        if (eDate) eDate.setHours(endTimeState.hours, endTimeState.minutes, endTimeState.seconds)
        finalRange = [sDate, eDate]
      }

      if (controlledRange === undefined) {
        setInternalRange(finalRange)
      }
      rangeProps?.onChange?.(finalRange, [start, end])
    },
    [mode, hour12, showSeconds, startTimeState, endTimeState, controlledRange, rangeProps]
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

  // Select day handler
  const handleDaySelect = useCallback(
    (selected: Date) => {
      if (isRangeMode) {
        const [start, end] = rangeDates
        if (!start || (start && end)) {
          // New range start
          commitRange([selected, null])
        } else {
          // Range end selected
          if (selected < start) {
            commitRange([selected, start])
          } else {
            commitRange([start, selected])
          }
          if (mode === 'dateRange') {
            setOpen(false)
            onClose?.()
          }
        }
      } else {
        // Single mode
        commitSingle(selected)
        if (mode === 'date') {
          setOpen(false)
          onClose?.()
        }
      }
    },
    [isRangeMode, currentRange, commitRange, commitSingle, mode, onClose]
  )

  // Presets handler
  const handlePresetSelect = useCallback(
    (presetVal: DatePreset['value'] | DatePreset['date']) => {
      const resolved = typeof presetVal === 'function' ? (presetVal as () => any)() : presetVal
      if (isRangeMode && Array.isArray(resolved)) {
        const [s, e] = resolved
        const sD = parseDate(s)
        const eD = parseDate(e)
        commitRange([sD, eD])
        if (sD) setViewDate(sD)
      } else if (!isRangeMode && !Array.isArray(resolved)) {
        const d = parseDate(resolved)
        commitSingle(d)
        if (d) setViewDate(d)
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
    if (mode === 'date') {
      setOpen(false)
      onClose?.()
    }
  }, [isRangeMode, commitRange, commitSingle, mode, onClose])

  // Navigation Handlers
  const handlePrev = useCallback(() => {
    const next = new Date(viewDate)
    if (view === 'days') {
      next.setMonth(next.getMonth() - 1)
    } else if (view === 'months') {
      next.setFullYear(next.getFullYear() - 1)
    } else if (view === 'years') {
      next.setFullYear(next.getFullYear() - 10)
    }
    setViewDate(next)
  }, [viewDate, view])

  const handleNext = useCallback(() => {
    const next = new Date(viewDate)
    if (view === 'days') {
      next.setMonth(next.getMonth() + 1)
    } else if (view === 'months') {
      next.setFullYear(next.getFullYear() + 1)
    } else if (view === 'years') {
      next.setFullYear(next.getFullYear() + 10)
    }
    setViewDate(next)
  }, [viewDate, view])

  // Outside click & Escape closing
  useEffect(() => {
    if (!open) return

    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
        onClose?.()
      }
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        onClose?.()
      }
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

  // Calculate popover flip position
  const calculatePosition = useCallback(() => {
    if (!rootRef.current) return
    const rect = rootRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const neededSpace = 380
    if (spaceBelow < neededSpace && rect.top > neededSpace) {
      setPopoverPosition('top')
    } else {
      setPopoverPosition('bottom')
    }
  }, [])

  const handleToggleOpen = () => {
    if (isDisabled) return
    if (!open) {
      calculatePosition()
      setOpen(true)
      onOpen?.()
    } else {
      setOpen(false)
      onClose?.()
    }
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
  const defaultIcon = isTimeMode
    ? form?.dateField?.clockIcon ?? '🕒'
    : form?.dateField?.calendarIcon ?? '📅'

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
  const hiddenValue = isRangeMode ? JSON.stringify(currentRange) : (currentSingle instanceof Date ? currentSingle.toISOString() : (currentSingle ?? ''))

  return (
    <fieldset
      ref={rootRef}
      className={cx(['flex flex-col flex-nowrap relative', ...size, fieldsetClass])}
      {...fieldsetAttrs}
      {...restFieldset}
    >
      {fieldsetPrefix}

      <div
        onClick={openOnInputClick ? handleToggleOpen : undefined}
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

        {/* Calendar / Clock Trigger Icon (before input) */}
        <button
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

        {/* Input display field */}
        <input
          ref={ref}
          type="text"
          readOnly={isDisabled || (!allowInput && !isManualEdit && openOnInputClick)}
          value={inputText}
          placeholder={defaultPlaceholder}
          disabled={isDisabled}
          required={required}
          onClick={() => {
            if (openOnInputClick) {
              handleToggleOpen()
            }
          }}
          onChange={(e) => {
            setInputText(e.target.value)
            if (isRangeMode) {
              const range = parseDateRange(e.target.value)
              if (range && range[0] && range[1]) {
                commitRange(range)
              }
            } else {
              const parsed = parseDate(e.target.value)
              if (parsed) commitSingle(parsed)
            }
          }}
          onKeyDown={(e: ReactKeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleToggleOpen()
            }
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

      {/* Floating Popover Picker */}
      {open && !isDisabled && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-modal="true"
          aria-label="Date and time picker"
          className={cx([
            'absolute z-300 max-w-[calc(100vw-2rem)] rounded-xl border border-body-3/40',
            'bg-main shadow-2xl backdrop-blur flex flex-col overflow-hidden animate-in fade-in',
            {
              value: 'bottom-full mb-1',
              fallback: 'top-full mt-1',
              condition: popoverPosition === 'top',
            },
            {
              value: 'w-auto max-w-full',
              condition: isMobile,
            },
          ])}
          style={{
            minWidth: isMobile
              ? '280px'
              : mode === 'dateTimeRange'
              ? '780px'
              : isRangeMode
              ? '560px'
              : '300px',
          }}
        >
          {/* Mobile Presets Bar */}
          {isMobile && showPresets && presetsList.length > 0 && (
            <Presets presets={presetsList} onSelect={handlePresetSelect} isMobile />
          )}

          <div className={cx(['flex', { value: 'flex-col', condition: isMobile }])}>
            {/* Desktop Presets Sidebar */}
            {!isMobile && showPresets && presetsList.length > 0 && (
              <Presets presets={presetsList} onSelect={handlePresetSelect} isMobile={false} />
            )}

            <div className="flex flex-col flex-1">
              {/* If it's pure time mode */}
              {isTimeMode && (
                <div className="flex flex-wrap p-3 items-center justify-center">
                  {mode === 'time' && (
                    <TimeSpinner
                      hours={timeState.hours}
                      minutes={timeState.minutes}
                      seconds={timeState.seconds}
                      onChange={(next) => {
                        setTimeState(next)
                        const d = parseDate(currentSingle) ?? new Date()
                        d.setHours(next.hours, next.minutes, next.seconds)
                        commitSingle(d)
                      }}
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
                        onChange={(next) => {
                          setStartTimeState(next)
                          const startD = parseDate(currentRange[0]) ?? new Date()
                          startD.setHours(next.hours, next.minutes, next.seconds)
                          const endD = parseDate(currentRange[1])
                          commitRange([startD, endD])
                        }}
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
                        onChange={(next) => {
                          setEndTimeState(next)
                          const startD = parseDate(currentRange[0])
                          const endD = parseDate(currentRange[1]) ?? new Date()
                          endD.setHours(next.hours, next.minutes, next.seconds)
                          commitRange([startD, endD])
                        }}
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
                          onChange={(next) => {
                            setTimeState(next)
                            const d = parseDate(currentSingle)
                            if (d) {
                              d.setHours(next.hours, next.minutes, next.seconds)
                              commitSingle(d)
                            }
                          }}
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
                          onChange={(next) => {
                            setStartTimeState(next)
                            const [sD, eD] = rangeDates
                            if (sD) sD.setHours(next.hours, next.minutes, next.seconds)
                            commitRange([sD, eD])
                          }}
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
                          onChange={(next) => {
                            setEndTimeState(next)
                            const [sD, eD] = rangeDates
                            if (eD) eD.setHours(next.hours, next.minutes, next.seconds)
                            commitRange([sD, eD])
                          }}
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
          </div>
        </div>
      )}
    </fieldset>
  )
})

export const DatePickerField = DateField
