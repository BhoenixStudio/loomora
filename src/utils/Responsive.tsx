'use client'

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { useLoomoraConfig } from '../config'

type RangePrefix = '' | 'gt' | 'lt'
type WidowSize = { width: number; height: number }

export type ScreenSizeCondition = '<' | '<=' | '=' | '>=' | '>'
export type ScreenSizeValue = number | `${number}rem`
export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

type BuildKey<P extends string, S extends string> = P extends '' ? S : `${P}${Capitalize<S>}`
type Responsive = { [K in ScreenSize as BuildKey<RangePrefix, K>]: boolean }
type ResponsiveReturn = Record<
  `is${Capitalize<keyof Responsive>}` | 'isMobile' | 'isTablet' | 'isDesktop' | 'isUltra',
  boolean
>

type NonEditableResponsive = {
  windowSize: WidowSize
  UseMQ: (size: ScreenSize) => ScreenSizeValue
  UseResponsive: <T = unknown>(props: Partial<Record<ScreenSize, T>>, defaultValue?: T) => T
}

type ResponsiveContext = ResponsiveReturn & NonEditableResponsive
const Context = createContext<ResponsiveContext | undefined>(undefined)

export function ResponsiveProvider({ children }: Readonly<{ children: ReactNode }>) {
  const { responsive: responsiveSettings } = useLoomoraConfig()

  const {
    xs = 0,
    sm = '40rem',
    md = '48rem',
    lg = '64rem',
    xl = '80rem',
    '2xl': xl2 = '96rem',
    '3xl': xl3 = '120rem',
  } = responsiveSettings ?? {}

  // States
  const [windowSize, setWindowSize] = useState<WidowSize>({ width: 0, height: 0 })

  // Return
  const value: ResponsiveContext = useMemo(() => {
    // Configs
    const sizes: Record<ScreenSize, ScreenSizeValue> = { xs, sm, md, lg, xl, '2xl': xl2, '3xl': xl3 }

    const conditions = (Object.keys(sizes) as ScreenSize[]).reduce((acc, size) => {
      const capSize = size.charAt(0).toUpperCase() + size.slice(1)

      acc[`is${capSize}` as keyof ResponsiveReturn] = UseAgent(size as keyof Responsive)
      acc[`isLt${capSize}` as keyof ResponsiveReturn] = UseAgent(`lt${capSize}` as keyof Responsive)
      acc[`isGt${capSize}` as keyof ResponsiveReturn] = UseAgent(`gt${capSize}` as keyof Responsive)

      return acc
    }, {} as Partial<ResponsiveReturn>) as ResponsiveReturn
    conditions.isMobile = UseAgent('gtSm')
    conditions.isTablet = UseAgent('md')
    conditions.isDesktop = UseAgent('lg')
    conditions.isUltra = UseAgent('2xl')

    // Helper Functions
    const UseMQ = (size: ScreenSize): ScreenSizeValue => sizes[size] || 0
    const UseCondition = (size: ScreenSize, condition: ScreenSizeCondition = '<=') =>
      eval(`${windowSize?.width} ${condition} ${UseMQ(size)}`)

    // Functions
    function UseAgent(agent: keyof Responsive): boolean {
      const agents: Record<keyof Responsive, boolean> = {
        ltXs: UseCondition('xs', '<='),
        xs: UseCondition('xs', '='),
        gtXs: UseCondition('xs', '>='),
        ltSm: UseCondition('sm', '<='),
        sm: UseCondition('sm', '='),
        gtSm: UseCondition('sm', '>='),
        ltMd: UseCondition('md', '<='),
        md: UseCondition('md', '='),
        gtMd: UseCondition('md', '>='),
        ltLg: UseCondition('lg', '<='),
        lg: UseCondition('lg', '='),
        gtLg: UseCondition('lg', '>='),
        ltXl: UseCondition('xl', '<='),
        xl: UseCondition('xl', '='),
        gtXl: UseCondition('xl', '>='),
        lt2xl: UseCondition('2xl', '<='),
        '2xl': UseCondition('2xl', '='),
        gt2xl: UseCondition('2xl', '>='),
        lt3xl: UseCondition('3xl', '<='),
        '3xl': UseCondition('3xl', '='),
        gt3xl: UseCondition('3xl', '>='),
      }
      return agents[agent]
    }
    function UseResponsive<T = unknown>(sizes: Partial<Record<keyof Responsive, T>>, fallback?: T): T {
      const match = Object.entries(sizes).find(([size]) => UseAgent(size as keyof Responsive))
      return match !== undefined ? (match[1] as T) : (fallback as T)
    }

    return { windowSize, UseMQ, UseResponsive, ...conditions }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowSize, responsiveSettings])

  useEffect(() => {
    const resize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', resize)
    resize()
    return () => window.removeEventListener('resize', resize)
  }, [])

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export const useResponsive = () => {
  const context = useContext(Context)
  if (!context) throw new Error('useResponsive must be used within a ResponsiveProvider')

  return context
}
