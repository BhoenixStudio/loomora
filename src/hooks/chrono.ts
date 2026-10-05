'use client'

import {
  addDays as add,
  differenceInDays,
  differenceInHours,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
  format as formatDate,
  formatDistance,
  isValid as isDateValid,
  isSameDay,
  isSameHour,
  isSameMonth,
  isSameWeek,
  isSameYear,
  subDays as sub,
} from 'date-fns'
import { useLoomora } from '../config'

export type MonthKey = keyof ReturnType<typeof Months>
export type MonthItem = ReturnType<typeof Months>[MonthKey]
export type GetMonths<T extends object = object> = {
  extra?: Partial<Record<MonthKey, T>>
  only?: MonthKey[]
  except?: MonthKey[]
}

export type DateType = string | Date | undefined | null
export type FormatDateType =
  | 'number'
  | 'fullYear'
  | 'smallYear'
  | 'month'
  | 'day'
  | 'dayName'
  | 'shortDayName'
  | 'fullTime12'
  | 'fullTime24'
  | 'time12'
  | 'time24'
  | 'hour'
  | 'minutes'
  | 'seconds'
  | 'relative'
  | 'custom'

export type FormatDate =
  { type?: Exclude<FormatDateType, 'custom'>; format?: never } | { type: 'custom'; format: string }

export type CompareDateType = 'before' | 'after'
export type CompareDate = { type?: CompareDateType; addDays?: number; removeDays?: number }
export type DateRangeType = 'sameHour' | 'sameDay' | 'sameWeek' | 'sameMonth' | 'sameYear' | 'dynamic'
export type DateRange = { first: DateType; second: DateType }
export type DateRangeResult = { match: boolean; range: string; fallback: string }
type RelativeDateProps = { earlierDate?: DateType; locale?: string }

const INVALID_DATES = new Set([
  'undefined',
  'null',
  '',
  '0000:00:00',
  '0000:00:00 00:00:00',
  '0000-00-00',
  '0000-00-00 00:00:00',
  '0000/00/00',
  '0000/00/00 00:00:00',
])

function Months() {
  return {
    JAN: { order: 1 },
    FEB: { order: 2 },
    MAR: { order: 3 },
    APR: { order: 4 },
    MAY: { order: 5 },
    JUN: { order: 6 },
    JUL: { order: 7 },
    AUG: { order: 8 },
    SEP: { order: 9 },
    OCT: { order: 10 },
    NOV: { order: 11 },
    DEC: { order: 12 },
  } as const
}

export function useChrono() {
  const monthList = Months()

  const { translations } = useLoomora()

  // Functions
  const listMonths = <T extends object = object>(props?: GetMonths<T>): (MonthItem & T)[] => {
    const { only = [], extra, except = [] } = props ?? {}

    let months = Object.entries(monthList).map(([key, month]) => ({
      key: key as MonthKey,
      ...month,
      ...translations?.useDates?.months?.[key as MonthKey],
      ...extra?.[key as MonthKey],
    }))

    if (only.length > 0) months = months.filter(({ key }) => only.includes(key))
    if (except.length > 0) months = months.filter(({ key }) => !except.includes(key))

    return months.sort((a, b) => a.order - b.order)
  }
  const pickMonth = <T extends object = object>(key: MonthKey, props?: Pick<GetMonths<T>, 'extra'>): MonthItem & T => ({
    key,
    ...monthList[key],
    ...translations?.useDates?.months?.[key as MonthKey],
    ...props?.extra?.[key],
  })

  const isDate = (date: DateType): boolean => {
    if (!date || INVALID_DATES.has(String(date))) return false
    return isDateValid(new Date(date))
  }

  const diff = (first: DateType, second: DateType, props?: CompareDate) => {
    const { type = 'before', addDays = 0, removeDays = 0 } = props ?? {}

    if (!isDate(first) || !isDate(second)) {
      return {
        match: false,
        differenceInHours: null,
        differenceInDays: null,
        differenceInWeeks: null,
        differenceInMonths: null,
        differenceInYears: null,
      }
    }

    const firstDate = new Date(first!)
    let secondDate = new Date(second!)

    if (addDays) secondDate = add(secondDate, addDays)
    if (removeDays) secondDate = sub(secondDate, removeDays)

    if (type === 'before')
      return {
        match: firstDate < secondDate,
        differenceInHours: differenceInHours(secondDate, firstDate),
        differenceInDays: differenceInDays(secondDate, firstDate),
        differenceInWeeks: differenceInWeeks(secondDate, firstDate),
        differenceInMonths: differenceInMonths(secondDate, firstDate),
        differenceInYears: differenceInYears(secondDate, firstDate),
      }

    if (type === 'after')
      return {
        match: firstDate > secondDate,
        differenceInHours: differenceInHours(firstDate, secondDate),
        differenceInDays: differenceInDays(firstDate, secondDate),
        differenceInWeeks: differenceInWeeks(firstDate, secondDate),
        differenceInMonths: differenceInMonths(firstDate, secondDate),
        differenceInYears: differenceInYears(firstDate, secondDate),
      }

    return {
      match: false,
      differenceInHours: null,
      differenceInDays: null,
      differenceInWeeks: null,
      differenceInMonths: null,
      differenceInYears: null,
    }
  }

  const timeSpan = (dates: DateRange, type: DateRangeType = 'dynamic') => {
    const { first, second } = dates

    if (!isDate(first) || !isDate(second)) return { match: false, range: '', fallback: '' }

    const firstDate = new Date(first!)
    const secondDate = new Date(second!)

    const sameHour = isSameHour(firstDate, secondDate)
    const sameDay = isSameDay(firstDate, secondDate)
    const sameWeek = isSameWeek(firstDate, secondDate)
    const sameMonth = isSameMonth(firstDate, secondDate)
    const sameYear = isSameYear(firstDate, secondDate)

    // Formatted on single lines to prevent template literal whitespace bugs in the UI
    const types: Record<Exclude<DateRangeType, 'dynamic'>, DateRangeResult> = {
      sameHour: {
        match: sameHour,
        range: `${stamp(first, { type: 'custom', format: 'HH:mm' })} - ${stamp(second, { type: 'custom', format: 'HH:mm dd-MM-yyyy' })}`,
        fallback: `${stamp(first, { type: 'custom', format: 'HH:mm dd-MM-yyyy' })} - ${stamp(second, { type: 'custom', format: 'HH:mm dd-MM-yyyy' })}`,
      },
      sameDay: {
        match: sameDay,
        range: `${stamp(first, { type: 'custom', format: 'dd' })} - ${stamp(second, { type: 'custom', format: 'dd-MM-yyyy' })}`,
        fallback: `${stamp(first, { type: 'custom', format: 'dd-MM-yyyy' })} - ${stamp(second, { type: 'custom', format: 'dd-MM-yyyy' })}`,
      },
      sameWeek: {
        match: sameWeek,
        range: `${stamp(first, { type: 'custom', format: 'dd MMM' })} - ${stamp(second, { type: 'custom', format: 'dd MMM yyyy' })}`,
        fallback: `${stamp(first, { type: 'custom', format: 'dd MMM yyyy' })} - ${stamp(second, { type: 'custom', format: 'dd MMM yyyy' })}`,
      },
      sameMonth: {
        match: sameMonth,
        range: `${stamp(first, { type: 'custom', format: 'dd MMM' })} - ${stamp(second, { type: 'custom', format: 'dd MMM yyyy' })}`,
        fallback: `${stamp(first, { type: 'custom', format: 'dd MMM yyyy' })} - ${stamp(second, { type: 'custom', format: 'dd MMM yyyy' })}`,
      },
      sameYear: {
        match: sameYear,
        range: `${stamp(first, { type: 'custom', format: 'dd MMM' })} - ${stamp(second, { type: 'custom', format: 'dd MMM yyyy' })}`,
        fallback: `${stamp(first, { type: 'custom', format: 'dd MMM yyyy' })} - ${stamp(second, { type: 'custom', format: 'dd MMM yyyy' })}`,
      },
    }

    if (type === 'dynamic') {
      if (sameHour) return types.sameHour
      if (sameDay) return types.sameDay
      if (sameWeek) return types.sameWeek
      if (sameMonth) return types.sameMonth
      if (sameYear) return types.sameYear
      return { match: false, range: '', fallback: '' }
    }

    return types[type]
  }

  const forward = (date: DateType, days: number): Date | null => {
    if (!isDate(date)) return null
    return add(new Date(date!), days)
  }

  const rewind = (date: DateType, days: number): Date | null => {
    if (!isDate(date)) return null
    return sub(new Date(date!), days)
  }

  const relative = (date: DateType, props?: RelativeDateProps): string => {
    const { earlierDate, locale = 'en' } = props ?? {}

    if (!isDate(date)) return ''

    let baseDate = new Date()
    if (earlierDate) {
      if (!isDate(earlierDate)) return ''
      baseDate = new Date(earlierDate)
    }

    return formatDistance(new Date(date!), baseDate, {
      addSuffix: true,
      includeSeconds: true,
      locale: translations?.useDates?.locales?.[locale],
    })
  }

  const stamp = (date: DateType, props?: FormatDate): string | number | null => {
    const { type = 'custom', format = 'yyyy-MM-dd HH:mm:ss' } = props ?? {}

    if (!isDate(date)) return null

    const sanitizedDate = new Date(date!)
    const types: Record<FormatDateType, string | number> = {
      number: Number(formatDate(sanitizedDate, 'yyyyMMdd')),
      fullYear: sanitizedDate.getFullYear(),
      smallYear: formatDate(sanitizedDate, 'yy'),
      month: formatDate(sanitizedDate, 'MM'),
      day: formatDate(sanitizedDate, 'dd'),
      dayName: formatDate(sanitizedDate, 'EEEE'),
      shortDayName: formatDate(sanitizedDate, 'EEE'),
      fullTime24: formatDate(sanitizedDate, 'HH:mm:ss'),
      fullTime12: formatDate(sanitizedDate, 'hh:mm:ss aa'),
      time24: formatDate(sanitizedDate, 'HH:mm'),
      time12: formatDate(sanitizedDate, 'hh:mm aa'),
      hour: sanitizedDate.getHours(),
      minutes: sanitizedDate.getMinutes(),
      seconds: sanitizedDate.getSeconds(),
      relative: relative(sanitizedDate),
      custom: formatDate(sanitizedDate, format),
    }

    return types[type]
  }

  return {
    listMonths,
    pickMonth,
    isDate,
    stamp,
    diff,
    timeSpan,
    forward,
    rewind,
    relative,
  }
}
