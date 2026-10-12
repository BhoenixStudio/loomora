'use client'

import { useLoomora } from '../config'

export type MonthKey = keyof ReturnType<typeof Months>
export type MonthItem = ReturnType<typeof Months>[MonthKey] & {
  key: MonthKey
  name?: string
  shortName?: string
}
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
  | { type?: Exclude<FormatDateType, 'custom'>; format?: never; locale?: string }
  | { type: 'custom'; format: string; locale?: string }

export type CompareDateType = 'before' | 'after'
export type CompareDate = { type?: CompareDateType; addDays?: number; removeDays?: number }
export type DateRangeType = 'sameHour' | 'sameDay' | 'sameWeek' | 'sameMonth' | 'sameYear' | 'dynamic'
export type DateRange = { first: DateType; second: DateType }
export type DateRangeResult = { match: boolean; range: string; fallback: string }
export type RelativeDateProps = { earlierDate?: DateType; locale?: string }

const INVALID_DATES = new Set([
  'undefined',
  'null',
  '',
  'nan',
  'invalid date',
  '0',
  'false',
  'true',
  '00:00:00',
  '0000:00:00',
  '0000:00:00 00:00:00',
  '0000-00-00',
  '0000-00-00 00:00:00',
  '0000-00-00 00:00:00.000',
  '0000-00-00 00:00:00.000000',
  '0000-00-00t00:00:00',
  '0000-00-00t00:00:00z',
  '0000-00-00t00:00:00.000z',
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

function pad2(value: number): string {
  return String(value).padStart(2, '0')
}

function getMonthsDiff(start: Date, end: Date): number {
  const yearDiff = end.getFullYear() - start.getFullYear()
  const monthDiff = end.getMonth() - start.getMonth()
  let totalMonths = yearDiff * 12 + monthDiff

  const startDayTime =
    start.getDate() * 86400000 +
    start.getHours() * 3600000 +
    start.getMinutes() * 60000 +
    start.getSeconds() * 1000 +
    start.getMilliseconds()
  const endDayTime =
    end.getDate() * 86400000 +
    end.getHours() * 3600000 +
    end.getMinutes() * 60000 +
    end.getSeconds() * 1000 +
    end.getMilliseconds()

  if (totalMonths > 0 && endDayTime < startDayTime) totalMonths--
  if (totalMonths < 0 && endDayTime > startDayTime) totalMonths++
  return totalMonths
}

function getYearsDiff(start: Date, end: Date): number {
  return Math.trunc(getMonthsDiff(start, end) / 12)
}

function isSameYear(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear()
}

function isSameMonth(a: Date, b: Date): boolean {
  return isSameYear(a, b) && a.getMonth() === b.getMonth()
}

function isSameDay(a: Date, b: Date): boolean {
  return isSameMonth(a, b) && a.getDate() === b.getDate()
}

function isSameHour(a: Date, b: Date): boolean {
  return isSameDay(a, b) && a.getHours() === b.getHours()
}

function isSameWeek(a: Date, b: Date, weekStartsOn: 0 | 1 = 1): boolean {
  const getWeekStart = (date: Date) => {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const day = d.getDay()
    const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn
    d.setDate(d.getDate() - diff)
    d.setHours(0, 0, 0, 0)
    return d.getTime()
  }
  return getWeekStart(a) === getWeekStart(b)
}

function formatCustom(date: Date, pattern: string, locale = 'en'): string {
  const hours24 = date.getHours()
  const hours12 = hours24 % 12 || 12
  const periodUpper = hours24 >= 12 ? 'PM' : 'AM'
  const periodLower = hours24 >= 12 ? 'pm' : 'am'

  const replacements: Record<string, () => string | number> = {
    yyyy: () => date.getFullYear(),
    yy: () => String(date.getFullYear()).slice(-2),
    MMMM: () => date.toLocaleDateString(locale, { month: 'long' }),
    MMM: () => date.toLocaleDateString(locale, { month: 'short' }),
    MM: () => pad2(date.getMonth() + 1),
    M: () => date.getMonth() + 1,
    dd: () => pad2(date.getDate()),
    d: () => date.getDate(),
    EEEE: () => date.toLocaleDateString(locale, { weekday: 'long' }),
    EEE: () => date.toLocaleDateString(locale, { weekday: 'short' }),
    HH: () => pad2(hours24),
    H: () => hours24,
    hh: () => pad2(hours12),
    h: () => hours12,
    mm: () => pad2(date.getMinutes()),
    m: () => date.getMinutes(),
    ss: () => pad2(date.getSeconds()),
    s: () => date.getSeconds(),
    aa: () => periodUpper,
    a: () => periodLower,
  }

  return pattern.replace(/(yyyy|yy|MMMM|MMM|MM|M|dd|d|EEEE|EEE|HH|H|hh|h|mm|m|ss|s|aa|a)/g, (match) => {
    return String(replacements[match] ? replacements[match]() : match)
  })
}

export function useChrono() {
  const monthList = Months()

  const { translations, settings, t } = useLoomora()

  // Functions
  const listMonths = <T extends object = object>(props?: GetMonths<T>): (MonthItem & T)[] => {
    const { only = [], extra, except = [] } = props ?? {}

    let months = Object.entries(monthList).map(([key, month]) => ({
      key: key as MonthKey,
      ...month,
      ...translations?.dates?.months?.[key as MonthKey],
      ...extra?.[key as MonthKey],
    }))

    if (only.length > 0) months = months.filter(({ key }) => only.includes(key))
    if (except.length > 0) months = months.filter(({ key }) => !except.includes(key))

    return months.sort((a, b) => a.order - b.order)
  }

  const pickMonth = <T extends object = object>(key: MonthKey, props?: Pick<GetMonths<T>, 'extra'>): MonthItem & T => ({
    key,
    ...monthList[key],
    ...translations?.dates?.months?.[key as MonthKey],
    ...props?.extra?.[key],
  })

  const isDate = (date: DateType): boolean => {
    if (date === null || date === undefined) return false
    if (date instanceof Date) return !Number.isNaN(date.getTime())
    const str = String(date).trim()
    if (str === '') return false
    const lower = str.toLowerCase()
    if (INVALID_DATES.has(lower)) return false
    if (lower.startsWith('0000-00-00') || lower.startsWith('0000/00/00') || lower.startsWith('0000:00:00')) return false
    const parsed = new Date(date)
    return !Number.isNaN(parsed.getTime())
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
    const secondDate = new Date(second!)

    if (addDays) secondDate.setDate(secondDate.getDate() + addDays)
    if (removeDays) secondDate.setDate(secondDate.getDate() - removeDays)

    if (type === 'before') {
      const diffInMs = secondDate.getTime() - firstDate.getTime()
      const days = Math.trunc(diffInMs / (1000 * 60 * 60 * 24))
      return {
        match: firstDate < secondDate,
        differenceInHours: Math.trunc(diffInMs / (1000 * 60 * 60)),
        differenceInDays: days,
        differenceInWeeks: Math.trunc(days / 7),
        differenceInMonths: getMonthsDiff(firstDate, secondDate),
        differenceInYears: getYearsDiff(firstDate, secondDate),
      }
    }

    if (type === 'after') {
      const diffInMs = firstDate.getTime() - secondDate.getTime()
      const days = Math.trunc(diffInMs / (1000 * 60 * 60 * 24))
      return {
        match: firstDate > secondDate,
        differenceInHours: Math.trunc(diffInMs / (1000 * 60 * 60)),
        differenceInDays: days,
        differenceInWeeks: Math.trunc(days / 7),
        differenceInMonths: getMonthsDiff(secondDate, firstDate),
        differenceInYears: getYearsDiff(secondDate, firstDate),
      }
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

  const forward = (date: DateType, days: number): Date | null => {
    if (!isDate(date)) return null
    const result = new Date(date!)
    result.setDate(result.getDate() + days)
    return result
  }

  const rewind = (date: DateType, days: number): Date | null => {
    if (!isDate(date)) return null
    const result = new Date(date!)
    result.setDate(result.getDate() - days)
    return result
  }

  const relative = (date: DateType, props?: RelativeDateProps): string => {
    const { earlierDate, locale } = props ?? {}

    if (!isDate(date)) return ''

    let baseDate = new Date()
    if (earlierDate) {
      if (!isDate(earlierDate)) return ''
      baseDate = new Date(earlierDate)
    }

    const targetDate = new Date(date!)
    const diffInSeconds = Math.round((targetDate.getTime() - baseDate.getTime()) / 1000)

    // If caller specified an ad-hoc locale different from the configured application locale, use native Intl.RelativeTimeFormat
    if (locale && settings?.locale && locale !== settings.locale) {
      try {
        const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
        const absSeconds = Math.abs(diffInSeconds)
        if (absSeconds < 45) return diffInSeconds >= 0 ? rtf.format(0, 'second') : rtf.format(diffInSeconds, 'second')
        if (absSeconds < 2700) return rtf.format(Math.round(diffInSeconds / 60), 'minute')
        if (absSeconds < 79200) return rtf.format(Math.round(diffInSeconds / 3600), 'hour')
        if (absSeconds < 2419200) return rtf.format(Math.round(diffInSeconds / 86400), 'day')
        if (absSeconds < 29030400) return rtf.format(Math.round(diffInSeconds / 2592000), 'month')
        return rtf.format(Math.round(diffInSeconds / 31536000), 'year')
      } catch {
        // Fallback to configured translations below
      }
    }

    const abs = Math.abs(diffInSeconds)
    const isFuture = diffInSeconds > 0

    if (abs < 10) return t('dates.justNow')
    if (abs < 45) return isFuture ? t('dates.inFewSeconds') : t('dates.fewSecondsAgo')
    if (abs < 60) {
      return isFuture ? t('dates.inSeconds', { count: abs }) : t('dates.secondsAgo', { count: abs })
    }

    const minutes = Math.round(abs / 60)
    if (minutes < 60) {
      if (minutes === 1) return isFuture ? t('dates.inMinute') : t('dates.minuteAgo')
      return isFuture ? t('dates.inMinutes', { count: minutes }) : t('dates.minutesAgo', { count: minutes })
    }

    const hours = Math.round(abs / 3600)
    if (hours < 24) {
      if (hours === 1) return isFuture ? t('dates.inHour') : t('dates.hourAgo')
      return isFuture ? t('dates.inHours', { count: hours }) : t('dates.hoursAgo', { count: hours })
    }

    const days = Math.round(abs / 86400)
    if (days < 30) {
      if (days === 1) return isFuture ? t('dates.tomorrow') : t('dates.yesterday')
      return isFuture ? t('dates.inDays', { count: days }) : t('dates.daysAgo', { count: days })
    }

    const months = Math.round(abs / 2592000)
    if (months < 12) {
      if (months === 1) return isFuture ? t('dates.inMonth') : t('dates.monthAgo')
      return isFuture ? t('dates.inMonths', { count: months }) : t('dates.monthsAgo', { count: months })
    }

    const years = Math.round(abs / 31536000)
    if (years === 1) return isFuture ? t('dates.inYear') : t('dates.yearAgo')
    return isFuture ? t('dates.inYears', { count: years }) : t('dates.yearsAgo', { count: years })
  }

  const stamp = (date: DateType, props?: FormatDate): string | number | null => {
    const { type = 'custom', format = 'yyyy-MM-dd HH:mm:ss', locale } = props ?? {}

    if (!isDate(date)) return null

    const sanitizedDate = new Date(date!)
    const activeLocale = locale || settings?.locale || 'en'

    const types: Record<FormatDateType, string | number> = {
      number: Number(formatCustom(sanitizedDate, 'yyyyMMdd', activeLocale)),
      fullYear: sanitizedDate.getFullYear(),
      smallYear: formatCustom(sanitizedDate, 'yy', activeLocale),
      month: formatCustom(sanitizedDate, 'MM', activeLocale),
      day: formatCustom(sanitizedDate, 'dd', activeLocale),
      dayName: sanitizedDate.toLocaleDateString(activeLocale, { weekday: 'long' }),
      shortDayName: sanitizedDate.toLocaleDateString(activeLocale, { weekday: 'short' }),
      fullTime24: formatCustom(sanitizedDate, 'HH:mm:ss', activeLocale),
      fullTime12: formatCustom(sanitizedDate, 'hh:mm:ss aa', activeLocale),
      time24: formatCustom(sanitizedDate, 'HH:mm', activeLocale),
      time12: formatCustom(sanitizedDate, 'hh:mm aa', activeLocale),
      hour: sanitizedDate.getHours(),
      minutes: sanitizedDate.getMinutes(),
      seconds: sanitizedDate.getSeconds(),
      relative: relative(sanitizedDate, { locale: activeLocale }),
      custom: formatCustom(sanitizedDate, format, activeLocale),
    }

    return types[type]
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
