'use client'

/**
 * Client-side theme context for light, dark, system-detected, and time-based
 * dynamic themes.
 *
 * `ThemeProvider` persists the selected theme under the `theme` local-storage
 * key and persists the dynamic range under `theme-dynamic-range`. The default
 * theme is `LIGHT`; the default dynamic range is `06:00` through `18:00`.
 * Provider effects apply `dark` or `light` to `document.documentElement`,
 * listen for system color-scheme changes in `SYSTEM` mode, and re-evaluate
 * every minute in `DYNAMIC` mode.
 *
 * The provider also creates translated theme options and time-input configs
 * from the `theme` next-intl namespace. It does not provide CSS tokens or
 * render a theme switcher; consuming components use `useTheme` for those
 * concerns.
 */

import { IconType, InputProps } from '@components'
import { AddLocalStorage, UseLocalStorage } from '@hooks'
import { useTranslations } from 'next-intl'
import { createContext, MouseEvent, ReactNode, useContext, useEffect, useMemo, useState } from 'react'

/** Theme values accepted by the provider and its update helpers. */
export type ThemeType = 'LIGHT' | 'DARK' | 'SYSTEM' | 'DYNAMIC'

type ThemeOption = { title: string; description?: string; icon: IconType; value: ThemeType }

type ThemeContextProps = {
  theme: ThemeType
  toggleTheme: (e?: MouseEvent<HTMLButtonElement>) => void
  updateTheme: (newTheme: ThemeType) => void
  detectSystemTheme: (fallback?: ThemeType) => ThemeType
  initTheme: (theme: ThemeType) => void
  setDynamicTime: (start: string, end: string) => void
  dynamicTime: { start: string; end: string }
  themeResponsive: <T>(light: T, dark: T) => T
  dynamicTimeInputs: InputProps[]
  themeOptions: ThemeOption[]
}

// Defaults
const dTheme: ThemeType = 'LIGHT'
const dStartTime = '06:00'
const dEndTime = '18:00'

const timeToMinutes = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}
const getCurrentMinutes = () => {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

const Context = createContext<ThemeContextProps | undefined>(undefined)

/**
 * Provides persisted theme state and theme-related helpers to descendants.
 *
 * @param children React subtree that may consume `useTheme`.
 * @remarks `ThemeProvider` requires the browser APIs used by its effects and
 * the `theme` translation namespace used to build its options and inputs.
 * `initTheme` only writes a theme when no stored theme exists.
 */
export function ThemeProvider({ children }: Readonly<{ children: ReactNode }>) {
  const th = useTranslations('theme')

  const [theme, setTheme] = useState<ThemeType>(() => UseLocalStorage<ThemeType>('theme', { defaultValue: dTheme }))

  const [dynamicTimeRange, setDynamicTimeRange] = useState<{ start: string; end: string }>(() =>
    UseLocalStorage<{ start: string; end: string }>('theme-dynamic-range', {
      defaultValue: { start: dStartTime, end: dEndTime },
    })
  )

  const detectSystemTheme = (fallback: ThemeType = dTheme): ThemeType => {
    if (typeof window === 'undefined') return fallback
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'DARK' : 'LIGHT'
  }

  const getDynamicTheme = (): ThemeType => {
    const now = getCurrentMinutes()
    const start = timeToMinutes(dynamicTimeRange.start)
    const end = timeToMinutes(dynamicTimeRange.end)
    if (start < end) return now >= start && now < end ? 'LIGHT' : 'DARK'
    else return now >= start || now < end ? 'LIGHT' : 'DARK'
  }
  const setDynamicTime = (start: string, end: string) => {
    setDynamicTimeRange({ start, end })
    AddLocalStorage('theme-dynamic-range', { start, end })
  }

  const updateTheme = (t: ThemeType) => {
    setTheme(t)
    AddLocalStorage('theme', t)
  }

  const toggleLightDarkTheme = (e?: MouseEvent<HTMLButtonElement>) => {
    const newTheme = theme === 'LIGHT' ? 'DARK' : 'LIGHT'

    if (!document.startViewTransition) {
      updateTheme(newTheme)
      return
    }

    const x = e?.clientX ?? window.innerWidth / 2
    const y = e?.clientY ?? window.innerHeight / 2
    const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

    const transition = document.startViewTransition(() => updateTheme(newTheme))
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] },
        { duration: 500, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
      )
    })
  }

  const initTheme = (newTheme: ThemeType) => {
    const stored = UseLocalStorage<ThemeType>('theme')
    if (stored) return
    setTheme(newTheme)
    AddLocalStorage('theme', newTheme)
  }

  const themeResponsive = <T = unknown,>(light: T, dark: T): T => {
    if (theme === 'SYSTEM') {
      const systemTheme = detectSystemTheme()
      return systemTheme === 'DARK' ? dark : light
    } else if (theme === 'DYNAMIC') {
      const dynamicTheme = getDynamicTheme()
      return dynamicTheme === 'DARK' ? dark : light
    } else return theme === 'DARK' ? dark : light
  }

  const themeOptions: ThemeOption[] = [
    { title: th('lightMode'), icon: 'iconoir:sun-light', value: 'LIGHT' },
    { title: th('darkMode'), icon: 'tdesign:mode-dark', value: 'DARK' },
    {
      title: th('systemDetection'),
      description: th('systemDetectionDescription'),
      icon: 'tdesign:device',
      value: 'SYSTEM',
    },
    {
      title: th('dynamicMode'),
      description: th('dynamicModeDescription'),
      icon: 'mdi:theme-light-dark',
      value: 'DYNAMIC',
    },
  ]

  const dynamicTimeInputs: InputProps[] = [
    {
      type: 'text',
      label: th('darkModeStartTime'),
      active: true,
      size: ['col-span-6'],
      properties: {
        type: 'time',
        value: dynamicTimeRange.start,
        onChange: (e) => setDynamicTime(e.target.value, dynamicTimeRange.end),
      },
    },
    {
      type: 'text',
      label: th('darkModeEndTime'),
      active: true,
      size: ['col-span-6'],
      properties: {
        type: 'time',
        value: dynamicTimeRange.end,
        onChange: (e) => setDynamicTime(dynamicTimeRange.start, e.target.value),
      },
    },
  ]

  useEffect(() => {
    let systemListener: MediaQueryList | null = null
    let intervalId: NodeJS.Timeout | null = null

    if (theme === 'SYSTEM') {
      systemListener = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => setTheme('SYSTEM')
      systemListener.addEventListener('change', handler)
      return () => systemListener?.removeEventListener('change', handler)
    }

    if (theme === 'DYNAMIC') {
      intervalId = setInterval(() => setTheme('DYNAMIC'), 60 * 1000)
      return () => {
        if (intervalId) clearInterval(intervalId)
      }
    }

    return undefined
  }, [theme, dynamicTimeRange.start, dynamicTimeRange.end])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'SYSTEM') {
      const systemTheme = detectSystemTheme()
      root.classList.toggle('dark', systemTheme === 'DARK')
      root.classList.toggle('light', systemTheme === 'LIGHT')
    } else if (theme === 'DYNAMIC') {
      const dynamicTheme = getDynamicTheme()
      root.classList.toggle('dark', dynamicTheme === 'DARK')
      root.classList.toggle('light', dynamicTheme === 'LIGHT')
    } else if (theme === 'DARK') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
  }, [theme, dynamicTimeRange.start, dynamicTimeRange.end])

  const providerValue = useMemo(
    () => ({
      theme,
      updateTheme,
      toggleTheme: toggleLightDarkTheme,
      detectSystemTheme,
      initTheme,
      dynamicTime: dynamicTimeRange,
      setDynamicTime,
      dynamicTimeInputs,
      themeResponsive,
      themeOptions,
    }),
    [theme, dynamicTimeRange]
  )

  return <Context.Provider value={providerValue}>{children}</Context.Provider>
}

/**
 * Reads the current theme context.
 *
 * @returns The selected theme, persistence/update methods, system and dynamic
 * detection helpers, theme-aware value selector, translated option list, and
 * dynamic time-input definitions.
 * @throws Error when called outside a `ThemeProvider`.
 * @remarks `toggleTheme` only switches between `LIGHT` and `DARK`; when the
 * selected value is `SYSTEM` or `DYNAMIC`, its next value is `LIGHT`.
 */
export function useTheme() {
  const context = useContext(Context)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')

  return context
}

/**
 * Documentation metadata:
 * - Last documentation update: 2026-09-18
 * - Documentation audience: Developers and AI agents
 * - Evidence basis: Attached file + verified project context
 * - Documentation coverage: Complete
 * - Validation: Passed `git diff --check`, targeted Prettier, targeted ESLint, and `pnpm type:check`.
 * - Known limitations: Dynamic time strings are not runtime-validated, and theme persistence depends on the existing local-storage helpers.
 */
