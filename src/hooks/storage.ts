'use client'

export type StoreOptions<T> = { json?: boolean; fallback?: T }
export type CookieOptions = { days?: number; path?: string; json?: boolean }

// --- Internal Factory for Web Storage ---
function createStore(type: 'local' | 'session') {
  const getStore = () => (typeof window !== 'undefined' ? window[`${type}Storage`] : null)

  return {
    get: <T = string>(key: string, options: StoreOptions<T> = {}): T => {
      const { json = false, fallback } = options

      const store = getStore()

      if (!store) return fallback as T
      const val = store.getItem(key)
      if (val === null) return fallback as T

      if (!json) return val as unknown as T
      try {
        return JSON.parse(val) as T
      } catch {
        return fallback as T
      }
    },

    set: <T = string>(key: string, value: T, options: Omit<StoreOptions<T>, 'fallback'> = {}) => {
      const { json = false } = options
      const store = getStore()

      if (!store) return
      store.setItem(key, json ? JSON.stringify(value) : String(value))
    },

    del: (key: string) => {
      getStore()?.removeItem(key)
    },
  }
}

export const local = createStore('local')
export const session = createStore('session')

export const cookie = {
  get: <T = string>(key: string, options: StoreOptions<T> = {}): T => {
    const { json = false, fallback } = options
    if (typeof document === 'undefined') return fallback as T

    const match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'))
    const val = match ? decodeURIComponent(match[2]) : null

    if (val === null) return fallback as T

    if (!json) return val as unknown as T
    try {
      return JSON.parse(val) as T
    } catch {
      return fallback as T
    }
  },

  set: <T = string>(key: string, value: T, options: CookieOptions = {}) => {
    const { days = 7, path = '/', json = false } = options
    if (typeof document === 'undefined') return

    const expires = new Date(Date.now() + days * 864e5).toUTCString()
    const data = json ? JSON.stringify(value) : String(value)

    document.cookie = `${key}=${encodeURIComponent(data)}; expires=${expires}; path=${path}`
  },

  del: (key: string, path: string = '/') => {
    if (typeof document === 'undefined') return
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`
  },
}
