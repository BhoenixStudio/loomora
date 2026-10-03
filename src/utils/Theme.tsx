'use client'

import { createContext, MouseEvent, ReactNode, useContext, useMemo, useReducer } from 'react'
import { useContextFns, useContextSharedFns } from '.'
import { InputProps } from '../components'
import { useLoomoraConfig } from '../config'
import { AddLocalStorage, UseLocalStorage } from '../hooks'

export type ThemeType = 'LIGHT' | 'DARK' | 'SYSTEM' | 'DYNAMIC'

type Theme = { theme: ThemeType; dynamicTime: { start: string; end: string } }
type NonEditableTheme = {
  dynamicTimeInputs: InputProps[]
  themeOptions: { title: string; description?: string; icon: ReactNode; value: ThemeType }[]
  toggleTheme: (e?: MouseEvent<HTMLButtonElement>) => void
  detectSystemTheme: (fallback?: ThemeType) => ThemeType
  setDynamicTime: (start: string, end: string) => void
  themeResponsive: <T>(light: T, dark: T) => T
}

type ThemeContext = Theme & NonEditableTheme
const Context = createContext<ThemeContext | undefined>(undefined)

export function ThemeProvider({ children }: Readonly<{ children: ReactNode }>) {
  const { t: th, theme: themeSettings } = useLoomoraConfig()

  const {
    default: dTheme = 'LIGHT',
    switchingAnimation,
    themeDynamicStartTime: dStartTime = '06:00',
    themeDynamicEndTime: dEndTime = '18:00',
    lightModeIcon,
    darkModeIcon,
    dynamicModeIcon,
    systemDetectionIcon,
    themeStorageKey: tKey = 'theme',
    themeRangeStorageKey: tRKey = 'theme-dynamic-range',
  } = themeSettings ?? {}

  // Initial Data
  const initialState: Theme = {
    theme: UseLocalStorage<Theme['theme']>(tKey, { defaultValue: dTheme }),
    dynamicTime: UseLocalStorage<Theme['dynamicTime']>(tRKey, { defaultValue: { start: dStartTime, end: dEndTime } }),
  }

  // Context helpers
  const { reducer } = useContextFns<Theme>(initialState)
  const [state, dispatch] = useReducer(reducer, initialState)
  const { update } = useContextSharedFns<Theme>(dispatch)

  // Configs
  const themeOptions: NonEditableTheme['themeOptions'] = [
    { value: 'LIGHT', title: th('settings.lightMode'), icon: lightModeIcon },
    { value: 'DARK', title: th('settings.darkMode'), icon: darkModeIcon },
    {
      value: 'SYSTEM',
      title: th('settings.systemDetection'),
      description: th('settings.systemDetectionDescription'),
      icon: systemDetectionIcon,
    },
    {
      value: 'DYNAMIC',
      title: th('settings.dynamicMode'),
      description: th('settings.dynamicModeDescription'),
      icon: dynamicModeIcon,
    },
  ]
  const dynamicTimeInputs: InputProps[] = []

  // Helpers Functions
  const timeToMinutes = (t: string) => t.split(':').map(Number)[0] * 60 + t.split(':').map(Number)[1]
  const getCurrentMinutes = () => new Date().getHours() * 60 + new Date().getMinutes()
  const updateTheme = (t: ThemeType) => {
    update({ theme: t })
    AddLocalStorage(tKey, t)
  }

  // Functions
  function detectSystemTheme(fallback: ThemeType = dTheme): ThemeType {
    if (typeof window === 'undefined') return fallback
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'DARK' : 'LIGHT'
  }

  function getDynamicTheme(): ThemeType {
    const now = getCurrentMinutes()
    const start = timeToMinutes(state.dynamicTime.start)
    const end = timeToMinutes(state.dynamicTime.end)
    if (start < end) return now >= start && now < end ? 'LIGHT' : 'DARK'
    else return now >= start || now < end ? 'LIGHT' : 'DARK'
  }

  function setDynamicTime(start: string, end: string) {
    update({ dynamicTime: { start, end } })
    AddLocalStorage(tRKey, { start, end })
  }

  function toggleTheme(e?: MouseEvent<HTMLButtonElement>) {
    const newTheme = state.theme === 'LIGHT' ? 'DARK' : 'LIGHT'

    if (!switchingAnimation || !document.startViewTransition) {
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

  function themeResponsive<T = unknown>(light: T, dark: T): T {
    if (state.theme === 'SYSTEM') {
      const systemTheme = detectSystemTheme()
      return systemTheme === 'DARK' ? dark : light
    } else if (state.theme === 'DYNAMIC') {
      const dynamicTheme = getDynamicTheme()
      return dynamicTheme === 'DARK' ? dark : light
    } else return state.theme === 'DARK' ? dark : light
  }

  // Return
  const value: ThemeContext = useMemo(
    () => ({
      ...state,
      themeOptions,
      dynamicTimeInputs,
      detectSystemTheme,
      getDynamicTheme,
      setDynamicTime,
      toggleTheme,
      themeResponsive,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, themeOptions, dynamicTimeInputs]
  )
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export const useTheme = () => {
  const context = useContext(Context)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
