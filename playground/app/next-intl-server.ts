import type { ReactNode } from 'react'

export function getRequestConfig<T>(callback: () => T): () => T {
  return callback
}

export function NextIntlClientProvider({ children }: { children: ReactNode }) {
  return children
}
