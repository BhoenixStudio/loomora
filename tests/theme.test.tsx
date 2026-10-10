import { act, renderHook, waitFor } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { LoomoraProvider } from '../src/config'
import { useTheme } from '../src/utils'

type MediaListener = () => void

function mockMatchMedia(initialDark: boolean) {
  const listeners = new Set<MediaListener>()
  const media = {
    matches: initialDark,
    addEventListener: (_: string, listener: MediaListener) => listeners.add(listener),
    removeEventListener: (_: string, listener: MediaListener) => listeners.delete(listener),
  }
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => media)
  )
  return {
    setDark(value: boolean) {
      media.matches = value
      listeners.forEach((listener) => listener())
    },
  }
}

function wrapperWith(config?: Parameters<typeof LoomoraProvider>[0]['config']) {
  return function Wrapper({ children }: PropsWithChildren) {
    return <LoomoraProvider config={config}>{children}</LoomoraProvider>
  }
}

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  window.localStorage.clear()
})

describe('ThemeProvider storage', () => {
  it('ignores a corrupted dynamic range and uses defaults', () => {
    window.localStorage.setItem('theme-dynamic-range', '[object Object]')
    mockMatchMedia(false)

    const { result } = renderHook(() => useTheme(), { wrapper: wrapperWith() })

    expect(result.current.dynamicTime).toEqual({ start: '06:00', end: '18:00' })
  })

  it('persists a dynamic range as JSON and restores it after remount', async () => {
    mockMatchMedia(false)
    const first = renderHook(() => useTheme(), { wrapper: wrapperWith() })

    act(() => first.result.current.setDynamicTime('20:00', '07:30'))

    expect(window.localStorage.getItem('theme-dynamic-range')).toBe('{"start":"20:00","end":"07:30"}')

    first.unmount()
    const second = renderHook(() => useTheme(), { wrapper: wrapperWith() })

    await waitFor(() => expect(second.result.current.dynamicTime).toEqual({ start: '20:00', end: '07:30' }))
  })

  it('rejects an invalid dynamic range without writing it', () => {
    mockMatchMedia(false)
    const { result } = renderHook(() => useTheme(), { wrapper: wrapperWith() })

    act(() => result.current.setDynamicTime('25:99', 'nope'))

    expect(result.current.dynamicTime).toEqual({ start: '06:00', end: '18:00' })
    expect(window.localStorage.getItem('theme-dynamic-range')).toBeNull()
  })

  it('restores a stored theme after mount', async () => {
    window.localStorage.setItem('theme', 'DARK')
    mockMatchMedia(false)

    const { result } = renderHook(() => useTheme(), { wrapper: wrapperWith() })

    await waitFor(() => expect(result.current.theme).toBe('DARK'))
  })
})

describe('ThemeProvider modes', () => {
  it('setTheme changes the active theme and persists it', () => {
    mockMatchMedia(false)
    const { result } = renderHook(() => useTheme(), { wrapper: wrapperWith() })

    act(() => result.current.setTheme('SYSTEM'))

    expect(result.current.theme).toBe('SYSTEM')
    expect(window.localStorage.getItem('theme')).toBe('SYSTEM')
  })

  it('setTheme ignores unknown values', () => {
    mockMatchMedia(false)
    const { result } = renderHook(() => useTheme(), { wrapper: wrapperWith() })

    act(() => result.current.setTheme('NEON' as never))

    expect(result.current.theme).toBe('LIGHT')
  })

  it('SYSTEM mode follows prefers-color-scheme changes', () => {
    const media = mockMatchMedia(false)
    const { result } = renderHook(() => useTheme(), { wrapper: wrapperWith() })

    act(() => result.current.setTheme('SYSTEM'))
    expect(result.current.themeResponsive('light', 'dark')).toBe('light')

    act(() => media.setDark(true))

    expect(result.current.themeResponsive('light', 'dark')).toBe('dark')
  })

  it('DYNAMIC mode switches at the configured boundary', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 1, 17, 59, 0))
    mockMatchMedia(false)
    const { result } = renderHook(() => useTheme(), { wrapper: wrapperWith() })

    act(() => result.current.setTheme('DYNAMIC'))
    expect(result.current.getDynamicTheme()).toBe('LIGHT')

    act(() => {
      vi.advanceTimersByTime(60_000)
    })

    expect(result.current.getDynamicTheme()).toBe('DARK')
    expect(result.current.themeResponsive('light', 'dark')).toBe('dark')
  })
})

describe('ThemeProvider view transitions', () => {
  it('does not throw when the view transition is skipped', async () => {
    mockMatchMedia(false)
    const skipped = { ready: Promise.reject(new Error('skipped')), finished: Promise.resolve() }
    document.startViewTransition = vi.fn((cb: () => void) => {
      cb()
      return skipped as unknown as ViewTransition
    }) as unknown as Document['startViewTransition']
    const { result } = renderHook(() => useTheme(), { wrapper: wrapperWith({ theme: { switchingAnimation: true } }) })

    expect(() => act(() => result.current.toggleTheme())).not.toThrow()
    await act(() => Promise.resolve())

    expect(result.current.theme).toBe('DARK')
    delete (document as Partial<Document>).startViewTransition
  })
})

describe('ThemeProvider options', () => {
  it('keeps themeOptions identity across re-renders with the same inputs', () => {
    mockMatchMedia(false)
    const { result, rerender } = renderHook(() => useTheme(), { wrapper: wrapperWith() })
    const first = result.current.themeOptions

    rerender()

    expect(result.current.themeOptions).toBe(first)
  })
})
