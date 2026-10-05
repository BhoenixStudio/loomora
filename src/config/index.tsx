'use client'

import { createContext, type ReactNode, useContext, useMemo } from 'react'
import { ResponsiveProvider, ThemeProvider } from '../utils'
import { loomoraDefaults } from './defaults'
import { mergeConfig } from './helper'
import { LoomoraConfig, LoomoraConfigP } from './types'
import { TranslateFn } from './types/helper'

import '../styles/index.css'

const ConfigContext = createContext<Required<LoomoraConfig> & { t: TranslateFn }>({ ...loomoraDefaults, t: () => '' })

export function LoomoraProvider({ children, config }: Readonly<{ children: ReactNode; config?: LoomoraConfigP }>) {
  const parentConfig = useContext(ConfigContext)
  const resolved = useMemo(() => mergeConfig(parentConfig, config), [parentConfig, config])

  // Functions
  const t: TranslateFn = (key, vars) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let template: any = resolved.translations
    for (const k of (key as string).split('.')) {
      template = template?.[k]
    }
    if (typeof template === 'function') template = template()

    const strTemplate = template !== undefined ? String(template) : (key as string)
    if (resolved.hasTranslationStrategy || !vars) return strTemplate

    return strTemplate.replace(/\{([^}]+)\}/g, (match, varName) =>
      varName in vars && vars[varName] !== undefined && vars[varName] !== null ? String(vars[varName]) : match
    )
  }

  return (
    <ResponsiveProvider>
      <ThemeProvider>
        <ConfigContext.Provider value={{ ...resolved, t }}>{children}</ConfigContext.Provider>
      </ThemeProvider>
    </ResponsiveProvider>
  )
}

export function useLoomora() {
  return useContext(ConfigContext)
}

export * from './defaults'
export * from './helper'
export * from './types'
