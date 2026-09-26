import { renderHook } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { useTimezones } from '../src/database/useTimezones'
import { LoomoraProvider } from '../src/config/config-context'

describe('useTimezones', () => {
  it('returns enriched timezone records with country metadata', () => {
    const { result } = renderHook(() => useTimezones())
    const tokyo = result.current.getTimezone('asia/tokyo')

    expect(result.current.getTimezones().length).toBeGreaterThan(80)
    expect(tokyo).toMatchObject({
      key: 'asia/tokyo',
      name: 'Tokyo',
      region: 'Asia',
      offset: 9,
      country: { code: 'JP', name: 'Japan' },
      fullName: 'Asia/Tokyo GMT+9',
      fullNameWithCountry: 'Japan (Asia/Tokyo) GMT+9',
    })
  })

  it('filters, looks up, and groups timezones', () => {
    const { result } = renderHook(() => useTimezones())
    const selected = result.current.getTimezones({
      only: ['europe/london', 'asia/tokyo', 'none'],
    })

    expect(selected.map(({ key }) => key)).toEqual(['asia/tokyo', 'europe/london'])
    expect(result.current.getTimezone({ name: 'tokyo' }).key).toBe('asia/tokyo')
    expect(result.current.getTimezone({ countryCode: 'GB' }).key).toBe('europe/london')

    const grouped = result.current.getTimezonesGrouped()
    const asia = grouped.find(({ regionKey }) => regionKey === 'asia')
    const europe = grouped.find(({ regionKey }) => regionKey === 'europe')

    expect(asia).toMatchObject({ regionKey: 'asia', region: 'Asia' })
    expect(asia?.zones.some(({ key }) => key === 'asia/tokyo')).toBe(true)
    expect(europe).toMatchObject({ regionKey: 'europe', region: 'Europe' })
    expect(europe?.zones.some(({ key }) => key === 'europe/london')).toBe(true)
  })

  it('uses translated labels from the Loomora provider', () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <LoomoraProvider
        config={{
          timezones: { 'asia/tokyo': { name: 'Tokyo translated', region: 'Asia translated' } },
        }}
      >
        {children}
      </LoomoraProvider>
    )
    const { result } = renderHook(() => useTimezones(), { wrapper })

    expect(result.current.getTimezone('asia/tokyo')).toMatchObject({
      name: 'Tokyo translated',
      region: 'Asia translated',
      fullName: 'Asia translated/Tokyo translated GMT+9',
    })
  })

  it('converts offsets across a date boundary without mutating the input', () => {
    const { result } = renderHook(() => useTimezones())
    const input = new Date(2026, 0, 1, 23, 30)
    const converted = result.current.convertTime(input, -5, 1)

    expect(converted).toEqual(new Date(2026, 0, 2, 5, 30))
    expect(input).toEqual(new Date(2026, 0, 1, 23, 30))
  })
})
