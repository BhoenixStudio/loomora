'use client'

import { useMemo } from 'react'
import { useLoomora } from '../../../../../config'
import { cx } from '../../../../../hooks'
import {
  CalendarView,
  getMonthGrid,
  isDateDisabled,
  isDateInRange,
  isSameDay,
} from '../helper'

export type CalendarProps = {
  viewDate: Date
  selectedDate?: Date | null
  range?: [Date | null, Date | null]
  hoverDate?: Date | null
  onSelectDate: (date: Date) => void
  onHoverDate?: (date: Date | null) => void
  onViewDateChange: (date: Date) => void
  view: CalendarView
  onViewChange: (view: CalendarView) => void
  isRange?: boolean
  firstDayOfWeek?: 0 | 1 | 6
  minDate?: Date | string
  maxDate?: Date | string
  disabledDates?: (date: Date) => boolean
  disabledDaysOfWeek?: number[]
  yearRange: [number, number]
}

export function Calendar(props: Readonly<CalendarProps>) {
  const { form, translations } = useLoomora()
  const {
    viewDate,
    selectedDate = null,
    range = [null, null],
    hoverDate = null,
    onSelectDate,
    onHoverDate,
    onViewDateChange,
    view,
    onViewChange,
    isRange = false,
    firstDayOfWeek = form?.dateField?.firstDayOfWeek ?? 0,
    minDate,
    maxDate,
    disabledDates,
    disabledDaysOfWeek,
    yearRange,
  } = props

  const today = useMemo(() => new Date(), [])

  // Weekday column headers
  const weekDayLabels = useMemo(() => {
    const defaultShortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const tDays = translations?.dateField?.shortWeekDays
    const days = [
      tDays?.sun ?? defaultShortDays[0],
      tDays?.mon ?? defaultShortDays[1],
      tDays?.tue ?? defaultShortDays[2],
      tDays?.wed ?? defaultShortDays[3],
      tDays?.thu ?? defaultShortDays[4],
      tDays?.fri ?? defaultShortDays[5],
      tDays?.sat ?? defaultShortDays[6],
    ]
    // Rotate by firstDayOfWeek
    return [...days.slice(firstDayOfWeek), ...days.slice(0, firstDayOfWeek)]
  }, [firstDayOfWeek, translations])

  // Grid days
  const gridDays = useMemo(
    () => getMonthGrid(viewDate.getFullYear(), viewDate.getMonth(), firstDayOfWeek),
    [viewDate, firstDayOfWeek]
  )

  // 12 Months names
  const monthList = useMemo(() => {
    const keys = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'] as const
    return keys.map((key, index) => ({
      index,
      name:
        translations?.dates?.months?.[key]?.shortName ??
        translations?.dates?.months?.[key]?.name ??
        new Date(2024, index, 1).toLocaleString('default', { month: 'short' }),
    }))
  }, [translations])

  // 12 Years decade list
  const yearList = useMemo(() => {
    const years: number[] = []
    for (let y = yearRange[0]; y <= yearRange[1] + 1; y++) {
      years.push(y)
    }
    return years
  }, [yearRange])

  if (view === 'months') {
    return (
      <div className="grid grid-cols-3 gap-2 p-3 w-64 select-none">
        {monthList.map(({ index, name }) => {
          const isCurrent = viewDate.getMonth() === index
          return (
            <button
              key={index}
              type="button"
              onClick={() => {
                const next = new Date(viewDate)
                next.setMonth(index)
                onViewDateChange(next)
                onViewChange('days')
              }}
              className={cx([
                'py-2.5 px-1 rounded-lg text-xs font-medium text-center transition-colors cursor-pointer',
                isCurrent
                  ? 'bg-primary text-white font-semibold shadow-sm'
                  : 'text-title-2 hover:bg-second hover:text-title-1',
              ])}
            >
              {name}
            </button>
          )
        })}
        <div className="col-span-3 pt-2 border-t border-body-3/20">
          <button
            type="button"
            onClick={() => onViewChange('days')}
            className="w-full py-1 px-2 rounded-md text-xs font-medium text-body-2 hover:text-primary hover:bg-second transition-colors cursor-pointer text-center"
          >
            ‹ Return to Calendar
          </button>
        </div>
      </div>
    )
  }

  if (view === 'years') {
    return (
      <div className="grid grid-cols-3 gap-2 p-3 w-64 select-none">
        {yearList.map((y) => {
          const isCurrent = viewDate.getFullYear() === y
          return (
            <button
              key={y}
              type="button"
              onClick={() => {
                const next = new Date(viewDate)
                next.setFullYear(y)
                onViewDateChange(next)
                onViewChange('months')
              }}
              className={cx([
                'py-2.5 px-1 rounded-lg text-xs font-medium text-center transition-colors cursor-pointer',
                isCurrent
                  ? 'bg-primary text-white font-semibold shadow-sm'
                  : 'text-title-2 hover:bg-second hover:text-title-1',
              ])}
            >
              {y}
            </button>
          )
        })}
        <div className="col-span-3 pt-2 border-t border-body-3/20 flex gap-2">
          <button
            type="button"
            onClick={() => onViewChange('months')}
            className="flex-1 py-1 px-2 rounded-md text-xs font-medium text-body-2 hover:text-primary hover:bg-second transition-colors cursor-pointer text-center"
          >
            ‹ Months
          </button>
          <button
            type="button"
            onClick={() => onViewChange('days')}
            className="flex-1 py-1 px-2 rounded-md text-xs font-medium text-body-2 hover:text-primary hover:bg-second transition-colors cursor-pointer text-center"
          >
            Calendar
          </button>
        </div>
      </div>
    )
  }

  // Days View
  const [rangeStart, rangeEnd] = range

  return (
    <div className="p-2 w-64 select-none">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1 text-center">
        {weekDayLabels.map((lbl, idx) => (
          <div key={idx} className="text-[11px] font-semibold text-body-3 py-1">
            {lbl}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {gridDays.map(({ date, isCurrentMonth }, i) => {
          const disabled = isDateDisabled(date, { minDate, maxDate, disabledDates, disabledDaysOfWeek })
          const isToday = isSameDay(date, today)
          const isSingleSelected = !isRange && isSameDay(date, selectedDate)

          const isStart = Boolean(isRange && rangeStart && isSameDay(date, rangeStart))
          const isEnd = Boolean(isRange && rangeEnd && isSameDay(date, rangeEnd))
          const isBoth = isStart && isEnd

          const inSelectedRange =
            Boolean(isRange && rangeStart && rangeEnd && isDateInRange(date, rangeStart, rangeEnd))
          const inHoverRange =
            Boolean(isRange && rangeStart && !rangeEnd && hoverDate && isDateInRange(date, rangeStart, hoverDate))
          const inRange = inSelectedRange || inHoverRange

          return (
            <div
              key={i}
              className={cx([
                'relative flex items-center justify-center p-0.5',
                { value: 'bg-primary/15', condition: Boolean(inRange && !isStart && !isEnd && !disabled) },
                { value: 'rounded-s-md', condition: Boolean(inRange && isStart && !isEnd) },
                { value: 'rounded-e-md', condition: Boolean(inRange && isEnd && !isStart) },
              ])}
            >
              <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && onSelectDate(date)}
                onMouseEnter={() => !disabled && onHoverDate?.(date)}
                onMouseLeave={() => !disabled && onHoverDate?.(null)}
                className={cx([
                  'w-8 h-8 flex items-center justify-center text-xs font-medium transition-all duration-150',
                  {
                    value: 'cursor-not-allowed opacity-30 text-body-3',
                    condition: disabled,
                  },
                  {
                    value: 'cursor-pointer',
                    condition: !disabled,
                  },
                  // Text color based on current month
                  {
                    value: 'text-body-3/60',
                    fallback: 'text-title-1',
                    condition: !isCurrentMonth && !disabled,
                  },
                  // Single selection
                  {
                    value: 'bg-primary text-white rounded-md font-semibold shadow-sm',
                    condition: isSingleSelected && !disabled,
                  },
                  // Range Start / End
                  {
                    value: 'bg-primary text-white font-semibold rounded-md shadow-sm',
                    condition: isBoth && !disabled,
                  },
                  {
                    value: 'bg-primary text-white font-semibold rounded-s-md rounded-e-none shadow-sm',
                    condition: isStart && !isBoth && !disabled,
                  },
                  {
                    value: 'bg-primary text-white font-semibold rounded-e-md rounded-s-none shadow-sm',
                    condition: isEnd && !isBoth && !disabled,
                  },
                  // In range (middle days)
                  {
                    value: 'text-primary font-medium hover:bg-primary/25 rounded-none',
                    condition: Boolean(inRange && !isStart && !isEnd && !disabled),
                  },
                  // Normal day hover
                  {
                    value: 'hover:bg-second rounded-md',
                    condition: Boolean(!inRange && !isSingleSelected && !isStart && !isEnd && !disabled),
                  },
                  // Today marker (subtle ring if not selected)
                  {
                    value: 'ring-1 ring-primary/40 rounded-md font-bold',
                    condition: isToday && !isSingleSelected && !isStart && !isEnd,
                  },
                ])}
              >
                {date.getDate()}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
