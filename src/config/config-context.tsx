'use client'

import { createContext, type ReactNode, useContext, useMemo } from 'react'
import { NestedKeyOf, PartialRecord as PR } from '../types'
import { ResponsiveProvider, ThemeProvider } from '../utils'
import type { LoomoraConfig, LoomoraConfigInput } from './config-types'
import { defaultConfig } from './default-config'
import { mergeConfig } from './merge-config'

import '../styles/index.css'

export type TranslateFn = <K extends NestedKeyOf<LoomoraConfig['translations']>>(
  key: K,
  vars?: PR<string, string>
) => string

const ConfigContext = createContext<Required<LoomoraConfig> & { t: TranslateFn }>({ ...defaultConfig, t: () => '' })

/** Provides optional project or section-level Loomora configuration overrides. */
export function LoomoraProvider({ children, config }: Readonly<{ children: ReactNode; config?: LoomoraConfigInput }>) {
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

/** Reads the fully resolved Loomora configuration, including built-in defaults. */
export function useLoomoraConfig() {
  return useContext(ConfigContext)
}
