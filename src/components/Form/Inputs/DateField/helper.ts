'use client'

import { ReactNode } from 'react'
import { InputBase, InputFieldset, InputHelperAndError, InputLabel } from '../../..'
import { TranslateFn } from '../../../../config/types/helper'
import { GlobalElement } from '../../../../types'

export type DateFieldMode = 'date' | 'datetime' | 'time' | 'dateRange' | 'timeRange' | 'dateTimeRange'

export type DateFieldValue = Date | string | null
export type DateRangeValue = [DateFieldValue, DateFieldValue]

export type DatePreset = {
  title?: ReactNode
  label?: ReactNode
  date?: DateFieldValue | DateRangeValue | (() => DateFieldValue | DateRangeValue)
  value?: DateFieldValue | DateRangeValue | (() => DateFieldValue | DateRangeValue)
}

export type CalendarView = 'days' | 'months' | 'years'

export type DateFieldBaseProperties = {
  name?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  allowInput?: boolean
  allowClear?: boolean
  format?: string
  hour12?: boolean
  timeFormat?: '12' | '24' | '12h' | '24h'
  openOnInputClick?: boolean
  manualInput?: boolean
  editManual?: boolean
  showSeconds?: boolean
  minuteStep?: number
  secondStep?: number
  minDate?: Date | string
  maxDate?: Date | string
  minTime?: string
  maxTime?: string
  disabledDates?: (date: Date) => boolean
  disabledDaysOfWeek?: number[]
  firstDayOfWeek?: 0 | 1 | 6
  showPresets?: boolean
  presets?: DatePreset[]
  showFooter?: boolean
  onOpen?: () => void
  onClose?: () => void
  onClear?: () => void
}

export type DateFieldSingleProperties = DateFieldBaseProperties & {
  mode?: 'date' | 'datetime' | 'time'
  value?: DateFieldValue
  defaultValue?: DateFieldValue
  onChange?: (value: DateFieldValue, date: Date | null) => void
}

export type DateFieldRangeProperties = DateFieldBaseProperties & {
  mode: 'dateRange' | 'timeRange' | 'dateTimeRange'
  value?: DateRangeValue
  defaultValue?: DateRangeValue
  onChange?: (value: DateRangeValue, dates: [Date | null, Date | null]) => void
}

export type DateFieldProperties = DateFieldSingleProperties | DateFieldRangeProperties

export interface DateFieldProps extends InputBase, InputFieldset, InputLabel, InputHelperAndError {
  wrapper?: GlobalElement<'div'>
  prefix?: ReactNode
  suffix?: ReactNode
  active?: boolean
  properties?: DateFieldProperties
}

// Utility Functions
export function padZero(num: number, digits = 2): string {
  return String(num).padStart(digits, '0')
}

export function parseDate(val: DateFieldValue | undefined): Date | null {
  if (!val) return null
  if (val instanceof Date) return Number.isNaN(val.getTime()) ? null : new Date(val.getTime())
  if (typeof val !== 'string') return null

  const trimmed = val.trim()
  if (!trimmed) return null

  // If it's pure time format HH:mm or HH:mm:ss
  const timeMatch = /^(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s*(AM|PM))?$/i.exec(trimmed)
  if (timeMatch) {
    const rawH = Number.parseInt(timeMatch[1], 10)
    const minutes = Number.parseInt(timeMatch[2], 10)
    const seconds = timeMatch[3] ? Number.parseInt(timeMatch[3], 10) : 0
    const ampm = timeMatch[4]?.toUpperCase()
    const hours = ampm === 'PM' && rawH < 12 ? rawH + 12 : ampm === 'AM' && rawH === 12 ? 0 : rawH
    const d = new Date()
    d.setHours(hours, minutes, seconds, 0)
    return d
  }

  const d = new Date(trimmed)
  return Number.isNaN(d.getTime()) ? null : d
}

export function parseTime(val: DateFieldValue | undefined): { hours: number; minutes: number; seconds: number } | null {
  const d = parseDate(val)
  if (!d) return null
  return { hours: d.getHours(), minutes: d.getMinutes(), seconds: d.getSeconds() }
}

export function parseDateRange(val: string | undefined): [Date | null, Date | null] | null {
  if (!val || typeof val !== 'string') return null
  const trimmed = val.trim()
  if (!trimmed) return null

  const separators = ['→', ' - ', ' to ', '~']
  for (const sep of separators) {
    if (!trimmed.includes(sep)) continue
    const [startStr, endStr] = trimmed.split(sep)
    const start = parseDate(startStr)
    const end = parseDate(endStr)
    return [start, end]
  }
  return null
}

export function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function isSameMonth(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

export function isDateInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime()
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime()
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  const [min, max] = s <= e ? [s, e] : [e, s]
  return d >= min && d <= max
}

export function isDateDisabled(
  date: Date,
  options: {
    minDate?: Date | string
    maxDate?: Date | string
    disabledDates?: (d: Date) => boolean
    disabledDaysOfWeek?: number[]
  }
): boolean {
  const { minDate, maxDate, disabledDates, disabledDaysOfWeek } = options

  if (disabledDaysOfWeek?.includes(date.getDay())) return true
  if (disabledDates?.(date)) return true

  const dayTime = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()

  const minD = minDate ? parseDate(minDate) : null
  const minTime = minD ? new Date(minD.getFullYear(), minD.getMonth(), minD.getDate()).getTime() : null
  if (minTime !== null && dayTime < minTime) return true

  const maxD = maxDate ? parseDate(maxDate) : null
  const maxTime = maxD ? new Date(maxD.getFullYear(), maxD.getMonth(), maxD.getDate()).getTime() : null
  if (maxTime !== null && dayTime > maxTime) return true

  return false
}

export function formatTimePart(
  hours: number,
  minutes: number,
  seconds: number,
  hour12 = false,
  showSeconds = false
): string {
  let h = hours
  let suffix = ''
  if (hour12) {
    suffix = h >= 12 ? ' PM' : ' AM'
    h = h % 12 || 12
  }
  const hStr = padZero(h)
  const mStr = padZero(minutes)
  const sStr = showSeconds ? `:${padZero(seconds)}` : ''
  return `${hStr}:${mStr}${sStr}${suffix}`
}

export function formatDateValue(
  date: Date | null,
  mode: DateFieldMode,
  options?: { customFormat?: string; hour12?: boolean; showSeconds?: boolean }
): string {
  if (!date) return ''
  const { hour12 = false, showSeconds = false } = options ?? {}

  const year = date.getFullYear()
  const month = padZero(date.getMonth() + 1)
  const day = padZero(date.getDate())
  const dateStr = `${year}-${month}-${day}`

  if (mode === 'date') return dateStr
  if (mode === 'time') {
    return formatTimePart(date.getHours(), date.getMinutes(), date.getSeconds(), hour12, showSeconds)
  }
  if (mode === 'datetime') {
    const timeStr = formatTimePart(date.getHours(), date.getMinutes(), date.getSeconds(), hour12, showSeconds)
    return `${dateStr} ${timeStr}`
  }

  return dateStr
}

export function formatDisplay(
  value: DateFieldValue | DateRangeValue | undefined,
  mode: DateFieldMode,
  options?: { hour12?: boolean; showSeconds?: boolean; customFormat?: string }
): string {
  if (value === undefined || value === null) return ''

  const isRange = mode === 'dateRange' || mode === 'timeRange' || mode === 'dateTimeRange'
  if (isRange && !Array.isArray(value)) return ''

  if (isRange && Array.isArray(value)) {
    const [startVal, endVal] = value
    const start = parseDate(startVal)
    const end = parseDate(endVal)
    const singleMode = mode === 'timeRange' ? 'time' : mode === 'dateTimeRange' ? 'datetime' : 'date'
    const sStr = formatDateValue(start, singleMode, options)
    const eStr = formatDateValue(end, singleMode, options)
    if (!sStr && !eStr) return ''
    if (sStr && !eStr) return `${sStr}  →  `
    return `${sStr}  →  ${eStr}`
  }

  const date = parseDate(value as DateFieldValue)
  return formatDateValue(date, mode, options)
}

export function getMonthGrid(
  year: number,
  month: number,
  firstDayOfWeek = 0
): { date: Date; isCurrentMonth: boolean }[] {
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()

  // Calculate day of week index offset (0 to 6)
  let startOffset = firstDayOfMonth.getDay() - firstDayOfWeek
  if (startOffset < 0) startOffset += 7

  const days: { date: Date; isCurrentMonth: boolean }[] = []

  // Preceding month trailing days
  const prevMonthLastDate = new Date(year, month, 0).getDate()
  for (let i = startOffset - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthLastDate - i),
      isCurrentMonth: false,
    })
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({
      date: new Date(year, month, d),
      isCurrentMonth: true,
    })
  }

  // Next month leading days to complete grid (total 35 or 42 cells)
  const remainingCells = (7 - (days.length % 7)) % 7
  for (let n = 1; n <= remainingCells; n++) {
    days.push({
      date: new Date(year, month + 1, n),
      isCurrentMonth: false,
    })
  }

  return days
}

export function getDefaultPresets(mode: DateFieldMode, t: TranslateFn): DatePreset[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (mode === 'date') {
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return [
      { label: t('dateField.today') || 'Today', value: new Date(today) },
      { label: t('dateField.yesterday') || 'Yesterday', value: yesterday },
      { label: t('dateField.tomorrow') || 'Tomorrow', value: tomorrow },
    ]
  }

  if (mode === 'dateRange' || mode === 'dateTimeRange') {
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const last7 = new Date(today)
    last7.setDate(last7.getDate() - 6)

    const last30 = new Date(today)
    last30.setDate(last30.getDate() - 29)

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)

    const startOfYear = new Date(today.getFullYear(), 0, 1)
    const endOfYear = new Date(today.getFullYear(), 11, 31)

    return [
      { label: t('dateField.today') || 'Today', value: [new Date(today), new Date(today)] },
      { label: t('dateField.yesterday') || 'Yesterday', value: [yesterday, yesterday] },
      { label: t('dateField.last7Days') || 'Last 7 days', value: [last7, new Date(today)] },
      { label: t('dateField.last30Days') || 'Last 30 days', value: [last30, new Date(today)] },
      { label: t('dateField.thisMonth') || 'This month', value: [startOfMonth, endOfMonth] },
      { label: t('dateField.lastMonth') || 'Last month', value: [startOfLastMonth, endOfLastMonth] },
      { label: t('dateField.thisYear') || 'This year', value: [startOfYear, endOfYear] },
    ]
  }

  if (mode === 'time') {
    return [
      { label: t('dateField.now') || 'Now', value: new Date() },
      { label: '09:00', value: '09:00' },
      { label: '12:00', value: '12:00' },
      { label: '15:00', value: '15:00' },
      { label: '18:00', value: '18:00' },
    ]
  }

  if (mode === 'timeRange') {
    return [
      { label: 'Morning (09:00 - 12:00)', value: ['09:00', '12:00'] },
      { label: 'Afternoon (13:00 - 17:00)', value: ['13:00', '17:00'] },
      { label: 'Business Day (09:00 - 18:00)', value: ['09:00', '18:00'] },
    ]
  }

  return []
}
