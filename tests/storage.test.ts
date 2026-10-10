import { act, renderHook } from '@testing-library/react'
import { cookie, localStore, localStorage, sessionStore, sessionStorage, useStorageState } from '../src/hooks'

afterEach(() => {
  vi.restoreAllMocks()
  window.localStorage.clear()
  window.sessionStorage.clear()
})

describe('localStore and sessionStore', () => {
  it('round-trips strings and JSON values', () => {
    localStore.set('name', 'loomora')
    localStore.set('config', { a: 1 }, { json: true })

    expect(localStore.get('name')).toBe('loomora')
    expect(localStore.get<{ a: number }>('config', { json: true })).toEqual({ a: 1 })
  })

  it('returns the fallback for missing keys and malformed JSON', () => {
    window.localStorage.setItem('broken', '[object Object]')

    expect(localStore.get('missing', { fallback: 'x' })).toBe('x')
    expect(localStore.get('broken', { json: true, fallback: 'safe' })).toBe('safe')
  })

  it('serializes objects as JSON even without json option', () => {
    localStore.set('obj', { start: '06:00' })

    expect(window.localStorage.getItem('obj')).toBe('{"start":"06:00"}')
  })

  it('returns the fallback when storage access throws', () => {
    vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError')
    })

    expect(localStore.get('any', { fallback: 'fb' })).toBe('fb')
    expect(localStore.set('any', 'v')).toBe(false)
  })

  it('reports quota errors from setItem as false', () => {
    const quotaStorage = {
      getItem: () => null,
      removeItem: () => undefined,
      setItem: () => {
        throw new DOMException('full', 'QuotaExceededError')
      },
    } as unknown as Storage
    vi.spyOn(window, 'sessionStorage', 'get').mockReturnValue(quotaStorage)

    expect(sessionStore.set('k', 'v')).toBe(false)
  })

  it('keeps the deprecated aliases pointing to the same stores', () => {
    expect(localStorage).toBe(localStore)
    expect(sessionStorage).toBe(sessionStore)
  })
})

describe('cookie', () => {
  it('returns the fallback for a malformed encoded value', () => {
    document.cookie = 'bad=%E0%A4%A; path=/'

    expect(cookie.get('bad', { fallback: 'fb' })).toBe('fb')
  })

  it('matches keys containing regex metacharacters literally', () => {
    cookie.set('a.b+c', 'value')

    expect(cookie.get('a.b+c')).toBe('value')
    expect(cookie.get('aXb+c', { fallback: 'none' })).toBe('none')
  })
})

describe('useStorageState', () => {
  it('re-renders when the value is set', () => {
    const { result } = renderHook(() => useStorageState<string>('theme', { fallback: 'LIGHT' }))

    expect(result.current[0]).toBe('LIGHT')

    act(() => result.current[1]('DARK'))

    expect(result.current[0]).toBe('DARK')
  })

  it('updates when another tab fires a storage event', () => {
    const { result } = renderHook(() => useStorageState<string>('theme', { fallback: 'LIGHT' }))

    act(() => {
      window.localStorage.setItem('theme', 'DARK')
      window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: 'DARK' }))
    })

    expect(result.current[0]).toBe('DARK')
  })

  it('removes the value and returns to the fallback', () => {
    const { result } = renderHook(() => useStorageState<string>('theme', { fallback: 'LIGHT' }))

    act(() => result.current[1]('DARK'))
    act(() => result.current[2]())

    expect(result.current[0]).toBe('LIGHT')
  })
})
