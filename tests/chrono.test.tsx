import { renderHook } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { describe, expect, it } from 'vitest'
import { LoomoraProvider } from '../src/config'
import { useChrono } from '../src/hooks/chrono'

describe('useChrono hook (native without date-fns)', () => {
  const wrapper = ({ children }: PropsWithChildren) => <LoomoraProvider>{children}</LoomoraProvider>

  describe('isDate', () => {
    it('returns true for valid Date instances and valid date strings', () => {
      const { result } = renderHook(() => useChrono(), { wrapper })
      expect(result.current.isDate(new Date())).toBe(true)
      expect(result.current.isDate('2026-10-12')).toBe(true)
      expect(result.current.isDate('2026-10-12T15:30:00Z')).toBe(true)
    })

    it('returns false for null, undefined, empty, and invalid strings', () => {
      const { result } = renderHook(() => useChrono(), { wrapper })
      expect(result.current.isDate(null)).toBe(false)
      expect(result.current.isDate(undefined)).toBe(false)
      expect(result.current.isDate('')).toBe(false)
      expect(result.current.isDate('   ')).toBe(false)
      expect(result.current.isDate('not-a-date')).toBe(false)
      expect(result.current.isDate('Invalid Date')).toBe(false)
      expect(result.current.isDate('NaN')).toBe(false)
      expect(result.current.isDate('0')).toBe(false)
      expect(result.current.isDate('false')).toBe(false)
    })

    it('returns false for sentinel zero-dates', () => {
      const { result } = renderHook(() => useChrono(), { wrapper })
      expect(result.current.isDate('0000-00-00')).toBe(false)
      expect(result.current.isDate('0000-00-00 00:00:00')).toBe(false)
      expect(result.current.isDate('0000-00-00 00:00:00.000')).toBe(false)
      expect(result.current.isDate('0000-00-00T00:00:00Z')).toBe(false)
      expect(result.current.isDate('0000/00/00')).toBe(false)
      expect(result.current.isDate('0000:00:00')).toBe(false)
      expect(result.current.isDate('00:00:00')).toBe(false)
    })
  })

  describe('forward & rewind', () => {
    it('advances dates forward by given days', () => {
      const { result } = renderHook(() => useChrono(), { wrapper })
      const base = new Date('2026-01-10T12:00:00Z')
      const advanced = result.current.forward(base, 5)
      expect(advanced).not.toBeNull()
      expect(advanced?.getDate()).toBe(15)
    })

    it('rewinds dates backward by given days', () => {
      const { result } = renderHook(() => useChrono(), { wrapper })
      const base = new Date('2026-01-10T12:00:00Z')
      const rewound = result.current.rewind(base, 5)
      expect(rewound).not.toBeNull()
      expect(rewound?.getDate()).toBe(5)
    })

    it('returns null when input date is invalid', () => {
      const { result } = renderHook(() => useChrono(), { wrapper })
      expect(result.current.forward('invalid', 5)).toBeNull()
      expect(result.current.rewind('0000-00-00', 5)).toBeNull()
    })
  })

  describe('diff', () => {
    it('computes before diff correctly', () => {
      const { result } = renderHook(() => useChrono(), { wrapper })
      const first = new Date('2026-01-01T00:00:00Z')
      const second = new Date('2026-01-03T06:00:00Z')

      const res = result.current.diff(first, second, { type: 'before' })
      expect(res.match).toBe(true)
      expect(res.differenceInDays).toBe(2)
      expect(res.differenceInHours).toBe(54)
    })

    it('computes after diff correctly', () => {
      const { result } = renderHook(() => useChrono(), { wrapper })
      const first = new Date('2026-01-03T00:00:00Z')
      const second = new Date('2026-01-01T00:00:00Z')

      const res = result.current.diff(first, second, { type: 'after' })
      expect(res.match).toBe(true)
      expect(res.differenceInDays).toBe(2)
    })

    it('applies addDays and removeDays to the second date', () => {
      const { result } = renderHook(() => useChrono(), { wrapper })
      const first = new Date('2026-01-01T00:00:00Z')
      const second = new Date('2026-01-02T00:00:00Z')

      const res = result.current.diff(first, second, { type: 'before', addDays: 2 })
      expect(res.differenceInDays).toBe(3)
    })

    it('returns match false with null differences for invalid inputs', () => {
      const { result } = renderHook(() => useChrono(), { wrapper })
      const res = result.current.diff('bad', new Date())
      expect(res.match).toBe(false)
      expect(res.differenceInDays).toBeNull()
    })
  })

  describe('timeSpan', () => {
    it('detects sameDay correctly', () => {
      const { result } = renderHook(() => useChrono(), { wrapper })
      const d1 = new Date('2026-05-10T08:00:00')
      const d2 = new Date('2026-05-10T14:30:00')

      const res = result.current.timeSpan({ first: d1, second: d2 }, 'sameDay')
      expect(res.match).toBe(true)
      expect(res.range).toContain('10')
    })

    it('detects sameMonth and sameYear', () => {
      const { result } = renderHook(() => useChrono(), { wrapper })
      const d1 = new Date('2026-05-10T08:00:00')
      const d2 = new Date('2026-05-25T14:30:00')

      const resMonth = result.current.timeSpan({ first: d1, second: d2 }, 'sameMonth')
      expect(resMonth.match).toBe(true)

      const d3 = new Date('2026-08-10T08:00:00')
      const resYear = result.current.timeSpan({ first: d1, second: d3 }, 'sameYear')
      expect(resYear.match).toBe(true)
    })
  })

  describe('stamp', () => {
    it('formats preset types accurately', () => {
      const { result } = renderHook(() => useChrono(), { wrapper })
      const date = new Date('2026-04-15T09:30:25')

      expect(result.current.stamp(date, { type: 'fullYear' })).toBe(2026)
      expect(result.current.stamp(date, { type: 'smallYear' })).toBe('26')
      expect(result.current.stamp(date, { type: 'month' })).toBe('04')
      expect(result.current.stamp(date, { type: 'day' })).toBe('15')
      expect(result.current.stamp(date, { type: 'number' })).toBe(20260415)
      expect(result.current.stamp(date, { type: 'fullTime24' })).toBe('09:30:25')
      expect(result.current.stamp(date, { type: 'time24' })).toBe('09:30')
      expect(result.current.stamp(date, { type: 'hour' })).toBe(9)
      expect(result.current.stamp(date, { type: 'minutes' })).toBe(30)
      expect(result.current.stamp(date, { type: 'seconds' })).toBe(25)
    })

    it('formats custom token strings', () => {
      const { result } = renderHook(() => useChrono(), { wrapper })
      const date = new Date('2026-04-15T14:05:09')

      expect(result.current.stamp(date, { type: 'custom', format: 'yyyy-MM-dd HH:mm:ss' })).toBe('2026-04-15 14:05:09')
      expect(result.current.stamp(date, { type: 'custom', format: 'HH:mm' })).toBe('14:05')
      expect(result.current.stamp(date, { type: 'custom', format: 'dd' })).toBe('15')
    })

    it('returns null for invalid dates', () => {
      const { result } = renderHook(() => useChrono(), { wrapper })
      expect(result.current.stamp('invalid')).toBeNull()
    })
  })

  describe('relative', () => {
    it('formats relative sentences using Loomora translations', () => {
      const { result } = renderHook(() => useChrono(), { wrapper })
      const now = new Date()
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)

      const rel = result.current.relative(fiveMinutesAgo, { earlierDate: now })
      expect(rel).toBe('5 minutes ago')

      const justNow = new Date(now.getTime() - 2000)
      expect(result.current.relative(justNow, { earlierDate: now })).toBe('just now')

      const yesterday = new Date(now.getTime() - 24 * 3600 * 1000)
      expect(result.current.relative(yesterday, { earlierDate: now })).toBe('yesterday')
    })

    it('allows overriding relative translations via LoomoraProvider', () => {
      const customWrapper = ({ children }: PropsWithChildren) => (
        <LoomoraProvider
          config={{
            translations: {
              dates: {
                justNow: 'الآن',
                minutesAgo: 'منذ {count} دقائق',
              },
            },
          }}
        >
          {children}
        </LoomoraProvider>
      )

      const { result } = renderHook(() => useChrono(), { wrapper: customWrapper })
      const now = new Date()
      const threeMinAgo = new Date(now.getTime() - 3 * 60 * 1000)

      expect(result.current.relative(threeMinAgo, { earlierDate: now })).toBe('منذ 3 دقائق')
      expect(result.current.relative(now, { earlierDate: now })).toBe('الآن')
    })
  })

  describe('listMonths & pickMonth', () => {
    it('lists 12 sorted months', () => {
      const { result } = renderHook(() => useChrono(), { wrapper })
      const months = result.current.listMonths()
      expect(months).toHaveLength(12)
      expect(months[0].key).toBe('JAN')
      expect(months[0].order).toBe(1)
      expect(months[11].key).toBe('DEC')
      expect(months[11].order).toBe(12)
    })

    it('picks a specific month', () => {
      const { result } = renderHook(() => useChrono(), { wrapper })
      const march = result.current.pickMonth('MAR')
      expect(march.key).toBe('MAR')
      expect(march.order).toBe(3)
      expect(march.name).toBe('March')
      expect(march.shortName).toBe('Mar')
    })
  })
})
