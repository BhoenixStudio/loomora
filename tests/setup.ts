import '@testing-library/jest-dom/vitest'

// Node 22+ exposes an experimental global `localStorage`/`sessionStorage` that can shadow jsdom's
// implementation and lack `getItem` when no storage file is configured. Install a minimal in-memory
// Storage when the global one is not a working Web Storage, so provider tests stay deterministic.
function createMemoryStorage(): Storage {
  const data = new Map<string, string>()

  return {
    get length() {
      return data.size
    },
    clear: () => data.clear(),
    getItem: (key: string) => (data.has(key) ? (data.get(key) as string) : null),
    key: (index: number) => Array.from(data.keys())[index] ?? null,
    removeItem: (key: string) => {
      data.delete(key)
    },
    setItem: (key: string, value: string) => {
      data.set(key, String(value))
    },
  }
}

for (const name of ['localStorage', 'sessionStorage'] as const) {
  const current = (globalThis as Record<string, unknown>)[name] as Storage | undefined

  if (typeof current?.getItem !== 'function') {
    Object.defineProperty(globalThis, name, {
      configurable: true,
      value: createMemoryStorage(),
    })
  }
}
