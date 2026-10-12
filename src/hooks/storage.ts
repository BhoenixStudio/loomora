'use client'

import { useMemo, useSyncExternalStore } from 'react'

export type StoreOptions<T> = { json?: boolean; fallback?: T }
export type CookieOptions = { days?: number; path?: string; json?: boolean }
export type StorageType = 'local' | 'session'
export type StorageStateOptions<T> = StoreOptions<T> & { type?: StorageType }

type Listener = () => void

const storageNames: Record<StorageType, 'localStorage' | 'sessionStorage'> = {
  local: 'localStorage',
  session: 'sessionStorage',
}

function getWebStorage(type: StorageType): Storage | null {
  if (typeof window === 'undefined') return null
  try {
    const storage = window[storageNames[type]]
    if (storage && typeof storage.getItem === 'function') return storage
    return null
  } catch {
    return null
  }
}

function serialize<T>(value: T, json: boolean): string {
  return json || typeof value === 'object' ? JSON.stringify(value) : String(value)
}

function parseValue<T>(val: string, json: boolean, fallback: T | undefined): T {
  if (!json) return val as unknown as T
  try {
    return JSON.parse(val) as T
  } catch {
    return fallback as T
  }
}

// --- Internal Factory for Web Storage ---
function createStore(type: StorageType) {
  const listeners = new Set<Listener>()
  const notify = () => listeners.forEach((listener) => listener())

  return {
    read: (key: string): string | null => {
      try {
        return getWebStorage(type)?.getItem(key) ?? null
      } catch {
        return null
      }
    },

    get: <T = string>(key: string, options: StoreOptions<T> = {}): T => {
      const { json = false, fallback } = options
      const val = getWebStorage(type)?.getItem(key) ?? null
      if (val === null) return fallback as T

      return parseValue(val, json, fallback)
    },

    set: <T = string>(key: string, value: T, options: Omit<StoreOptions<T>, 'fallback'> = {}): boolean => {
      const { json = false } = options
      const storage = getWebStorage(type)
      if (!storage) return false

      try {
        storage.setItem(key, serialize(value, json))
      } catch {
        return false
      }
      notify()
      return true
    },

    del: (key: string): boolean => {
      const storage = getWebStorage(type)
      if (!storage) return false

      try {
        storage.removeItem(key)
      } catch {
        return false
      }
      notify()
      return true
    },

    subscribe: (listener: Listener) => {
      listeners.add(listener)
      if (type === 'local') window.addEventListener('storage', listener)

      return () => {
        listeners.delete(listener)
        if (type === 'local') window.removeEventListener('storage', listener)
      }
    },
  }
}

const localStore = createStore('local')
const sessionStore = createStore('session')
const stores: Record<StorageType, ReturnType<typeof createStore>> = { local: localStore, session: sessionStore }

// --- Cookie helpers ---
function readCookie(key: string): string | null {
  if (typeof document === 'undefined') return null
  const entry = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${key}=`))

  return entry ? entry.slice(key.length + 1) : null
}

function decodeCookie(val: string): string | null {
  try {
    return decodeURIComponent(val)
  } catch {
    return null
  }
}

export const cookie = {
  get: <T = string>(key: string, options: StoreOptions<T> = {}): T => {
    const { json = false, fallback } = options
    const val = readCookie(key)
    const decoded = val === null ? null : decodeCookie(val)
    if (decoded === null) return fallback as T

    return parseValue(decoded, json, fallback)
  },

  set: <T = string>(key: string, value: T, options: CookieOptions = {}) => {
    const { days = 7, path = '/', json = false } = options
    if (typeof document === 'undefined') return

    const expires = new Date(Date.now() + days * 864e5).toUTCString()

    document.cookie = `${key}=${encodeURIComponent(serialize(value, json))}; expires=${expires}; path=${path}`
  },

  del: (key: string, path: string = '/') => {
    if (typeof document === 'undefined') return
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`
  },
}

// --- Reactive hook ---
export function useStorageState<T = string>(key: string, options: StorageStateOptions<T> = {}) {
  const { type = 'local', json = false, fallback } = options
  const store = stores[type]

  const raw = useSyncExternalStore(
    store.subscribe,
    () => store.read(key),
    () => null
  )
  const value = useMemo(() => (raw === null ? (fallback as T) : parseValue(raw, json, fallback)), [raw, json, fallback])

  const setValue = (next: T) => store.set(key, next, { json })
  const removeValue = () => store.del(key)

  return [value, setValue, removeValue] as const
}

export { localStore, sessionStore }
