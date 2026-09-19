'use client'

/**
 * Client-side viewport context for breakpoint checks and responsive value
 * selection.
 *
 * `ResponsiveProvider` listens to browser resize events and exposes the
 * current window dimensions, breakpoint conversion, breakpoint comparisons,
 * named screen flags, and `UseResponsive` through `useResponsive`. The
 * initial dimensions are `{ width: 0, height: 0 }` until the first client
 * effect measures the browser window.
 *
 * The configured thresholds are `xs: 0`, `sm: 576`, `md: 678`, `lg: 992`,
 * `xl: 1200`, and `xxl: 1400`. Named agents intentionally use the following
 * comparisons: mobile `<= md`, tablet `< lg`, desktop `>= lg`, xl desktop
 * `>= xl`, and xxl desktop `>= xxl`.
 *
 * This module does not apply CSS, render layout blocks, or persist viewport
 * state. Components must be rendered under `ResponsiveProvider` before they
 * call `useResponsive`.
 */

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'

/** Named responsive agents supported by `UseAgent` and `UseResponsive`. */
export type ScreenSize = 'mobile' | 'tablet' | 'desktop' | 'xlDesktop' | 'xxlDesktop'

/** Optional values keyed by the named responsive agents. */
export type UseResponsiveProps<T = unknown> = Partial<Record<ScreenSize, T>>
type WidowSize = { width: number; height: number }

type ResponsiveContextProps = {
  UseMQ: (size: string) => number
  UseWindow: () => { width: number; height: number }
  UseWindowSize: (condition: string, size: string, dimension?: string) => boolean
  UseAgent: (agent: ScreenSize) => boolean
  UseResponsive: <T = unknown>(props: Partial<Record<ScreenSize, T>>, defaultValue?: T) => T
} & Record<'isMobile' | 'isTablet' | 'isDesktop' | 'isXlDesktop' | 'isXxlDesktop', boolean>

const Context = createContext<ResponsiveContextProps | undefined>(undefined)

/**
 * Provides viewport-derived responsive helpers to descendant components.
 *
 * @param children React subtree that may consume `useResponsive`.
 * @remarks The provider reads `window.innerWidth` and `window.innerHeight`
 * after mounting and updates its value on every browser `resize` event. The
 * resize listener is removed when the provider unmounts.
 */
export function ResponsiveProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [windowSize, setWindowSize] = useState<WidowSize>({ width: 0, height: 0 })

  useEffect(() => {
    const resize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', resize)
    resize()
    return () => window.removeEventListener('resize', resize)
  }, [])

  const value = useMemo(() => {
    function UseMQ(size: string) {
      const sizeValues = { xs: 0, sm: 576, md: 678, lg: 992, xl: 1200, xxl: 1400 }
      return (sizeValues as { [key: string]: number })[size] || 0
    }

    const UseWindow = () => windowSize

    function UseWindowSize(condition: string, size: string, dimension: string = 'width') {
      if (!size) return false
      return eval(`${windowSize?.[dimension as keyof typeof windowSize]} ${condition || '<='} ${UseMQ(size)}`)
    }

    function UseAgent(agent: ScreenSize) {
      const agents: Record<ScreenSize, boolean> = {
        mobile: UseWindowSize('<=', 'md'),
        tablet: UseWindowSize('<', 'lg'),
        desktop: UseWindowSize('>=', 'lg'),
        xlDesktop: UseWindowSize('>=', 'xl'),
        xxlDesktop: UseWindowSize('>=', 'xxl'),
      }
      return agents[agent]
    }

    function UseResponsive<T = unknown>(props: UseResponsiveProps<T>, defaultValue?: T): T {
      const { mobile, tablet, desktop, xlDesktop, xxlDesktop } = props ?? {}
      const agents = [
        UseAgent('mobile') && mobile,
        UseAgent('tablet') && tablet,
        UseAgent('desktop') && desktop,
        UseAgent('xlDesktop') && xlDesktop,
        UseAgent('xxlDesktop') && xxlDesktop,
      ]

      return (agents.find(Boolean) ?? defaultValue) as T
    }

    return {
      UseMQ,
      UseWindow,
      UseWindowSize,
      UseAgent,
      UseResponsive,
      isMobile: UseAgent('mobile'),
      isTablet: UseAgent('tablet'),
      isDesktop: UseAgent('desktop'),
      isXlDesktop: UseAgent('xlDesktop'),
      isXxlDesktop: UseAgent('xxlDesktop'),
    }
  }, [windowSize])

  return <Context.Provider value={value}>{children}</Context.Provider>
}

/**
 * Reads the responsive context.
 *
 * @returns `UseMQ`, `UseWindow`, `UseWindowSize`, `UseAgent`, `UseResponsive`,
 * and the `isMobile`/`isTablet`/`isDesktop`/`isXlDesktop`/`isXxlDesktop`
 * flags.
 * @throws Error when called outside a `ResponsiveProvider`.
 * @remarks `UseResponsive` checks agents in source order, so the first truthy
 * selected value wins. Falsy selected values are skipped and the optional
 * default value is used when no truthy value is found.
 */
export function useResponsive() {
  const context = useContext(Context)
  if (!context) throw new Error('useResponsive must be used within a ResponsiveProvider')

  return context
}

/**
 * Documentation metadata:
 * - Last documentation update: 2026-09-18
 * - Documentation audience: Developers and AI agents
 * - Evidence basis: Attached file + verified project context
 * - Documentation coverage: Complete
 * - Validation: Passed `git diff --check`, targeted Prettier, targeted ESLint, and `pnpm type:check`.
 * - Known limitations: The initial zero dimensions make `isMobile` true until the first client measurement; `UseWindowSize` evaluates its caller-supplied condition string.
 */
