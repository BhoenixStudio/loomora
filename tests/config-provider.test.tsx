import { renderHook } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { LoomoraProvider } from '../src/config'
import { useResponsive, useTheme } from '../src/utils'

describe('LoomoraProvider inner providers', () => {
  it('applies the theme default from config', () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <LoomoraProvider config={{ theme: { default: 'DARK' } }}>{children}</LoomoraProvider>
    )
    const { result } = renderHook(() => useTheme(), { wrapper })

    expect(result.current.theme).toBe('DARK')
  })

  it('applies responsive overrides from config', () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <LoomoraProvider config={{ responsive: { md: '100rem' } }}>{children}</LoomoraProvider>
    )
    const { result } = renderHook(() => useResponsive(), { wrapper })

    expect(result.current.UseMQ('md')).toBe('100rem')
  })

  it('translates theme option titles from config translations', () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <LoomoraProvider config={{ translations: { settings: { darkMode: 'Mode sombre' } } }}>{children}</LoomoraProvider>
    )
    const { result } = renderHook(() => useTheme(), { wrapper })

    expect(result.current.themeOptions.find((o) => o.value === 'DARK')?.title).toBe('Mode sombre')
  })
})
