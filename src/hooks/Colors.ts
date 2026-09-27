'use client'

/**
 * Browser-side color-token resolution and color conversion utilities.
 *
 * ## File overview
 *
 * Confirmed: this client module exposes `useColors`, which reads the current
 * `--color-${color}` custom property from `document.documentElement` and
 * returns the value as HEX, RGB, or HSL with optional opacity. It also returns
 * the two conversion helpers used by the resolver. It does not define CSS
 * variables or change the active theme class.
 *
 * The supported token names come from `ColorName`. Their CSS custom properties
 * are defined in `public/css/globals.css`; the `.dark:root` rules provide the
 * dark-theme overrides. The hook observes class changes on the root element so
 * a component that calls `getColor` during render can react to theme changes.
 *
 * ## When to use
 *
 * - Use `useColors` in a client component or custom hook when a JavaScript API
 *   or inline style needs a resolved color string.
 * - Use the returned `hexToRgb` or `rgbToHsl` helpers when numeric color
 *   channels are needed from a known color value.
 * - Project rule: prefer the semantic Tailwind color utilities when a color can
 *   remain in markup. Use this hook when the consumer needs a runtime string.
 *
 * ## Developer guide
 *
 * 1. Import `useColors` from `@hooks` or directly from this file.
 * 2. Call it only from a React function component or another custom hook.
 * 3. Call `getColor` with a `ColorName` and optional `GetColorProps`.
 * 4. Pass the returned string to the JavaScript consumer, inline style, or
 *    color-processing code that needs it.
 *
 * `getColor` defaults to `type: 'HEX'` and `opacity: 100`. RGB and HSL output
 * use `rgb()`/`rgba()` and `hsl()`/`hsla()` respectively. HEX opacity is
 * represented by appending a two-digit alpha value to the source hex.
 * Opacity values below 0 or above 100 throw an `Error`.
 *
 * ## AI agent guide
 *
 * Preserve the `'use client'` directive and the browser-only access to
 * `document`, `getComputedStyle`, and `MutationObserver`. Reuse `ColorName`
 * and the CSS custom properties instead of adding per-consumer hex values.
 * When adding a supported token, update both `colorNames` in
 * `src/@types/Global.ts` and its CSS custom property in
 * `public/css/globals.css`, including any theme override that is required.
 * Keep the observer cleanup, conversion tuple shapes, opacity behavior, and
 * format defaults intact unless the public contract is intentionally changed.
 * Check `src/contexts/Theme.tsx` before changing theme-refresh behavior.
 *
 * ## Usage examples
 *
 * Minimal example (illustrative: the surrounding component is omitted):
 *
 * ```tsx
 * const { getColor } = useColors()
 * const primaryHex = getColor('primary')
 * ```
 *
 * Practical example (illustrative: the surrounding component is omitted):
 *
 * ```tsx
 * const { getColor } = useColors()
 * const translucentPrimary = getColor('primary', { type: 'RGB', opacity: 50 })
 * const lightSecondary = getColor('secondary', { type: 'HSL', opacity: 80 })
 * ```
 *
 * Edge-case example (illustrative):
 *
 * ```tsx
 * getColor('primary', { opacity: 101 }) // throws: opacity must be 0..100
 * ```
 *
 * ## Errors, edge cases, and limitations
 *
 * - `getColor` returns an empty string when the requested CSS custom property
 *   is not present in the computed styles.
 * - The resolver expects the CSS value to be a six-digit hex color. The
 *   conversion helpers do not validate or clamp their input channels.
 * - `useColors` requires a browser DOM. It is not suitable for server-side
 *   execution, and CSS custom properties must already be available when the
 *   value is read.
 * - Only root-element class mutations trigger the hook's refresh render. A
 *   custom-property change without a root class mutation is not observed.
 *
 * ## Related references
 *
 * - `src/@types/Global.ts`: `ColorName` and the `colorNames` token list.
 * - `src/hooks/index.ts`: barrel export for this hook and its public types.
 * - `public/css/globals.css`: light and dark `--color-*` custom properties.
 * - `src/contexts/Theme.tsx`: root `dark`/`light` class management.
 * - `package.json`: `type:check` and `lint` validation scripts.
 */

import { useCallback, useEffect, useState } from 'react'
import { TWColorName } from '../types'
import { cn } from './ClassNames'

/** Output format accepted by `getColor`. */
export type GetColorType = 'HEX' | 'RGB' | 'HSL'

/**
 * Optional output controls for `getColor`.
 *
 * @property type Output format. Defaults to `'HEX'`.
 * @property opacity Alpha percentage from 0 through 100. Defaults to `100`.
 *   Values outside that range throw an `Error`.
 */
export type GetColorProps = { type?: GetColorType; opacity?: number }

/**
 * Convert a six-digit hex color string into red, green, and blue channels.
 *
 * @param hex A six-digit hex value, with or without a leading `#`.
 * @returns The numeric `[red, green, blue]` tuple, with channels in the
 *   inclusive 0-255 range when the input is a valid six-digit hex value.
 */
function hexToRgb(hex: string): [number, number, number] {
  const cleaned = hex.replace('#', '')
  const r = Number.parseInt(cleaned.slice(0, 2), 16)
  const g = Number.parseInt(cleaned.slice(2, 4), 16)
  const b = Number.parseInt(cleaned.slice(4, 6), 16)
  return [r, g, b]
}

/**
 * Convert red, green, and blue channels into a rounded HSL tuple.
 *
 * @param r Red channel, expected to be in the 0-255 range.
 * @param g Green channel, expected to be in the 0-255 range.
 * @param b Blue channel, expected to be in the 0-255 range.
 * @returns The `[hue, saturation, lightness]` tuple in degrees and
 *   percentages: hue 0-360, saturation 0-100, and lightness 0-100 for valid
 *   RGB channel inputs.
 */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  let s = 0

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

/** Resolve one CSS color token into the requested CSS color notation. */
function resolveColor<T extends string = ''>(color: T, props: GetColorProps = {}): string {
  const { type = 'HEX', opacity = 100 } = props

  if (opacity < 0 || opacity > 100) throw new Error('Opacity must be between 0 and 100')

  const raw = getComputedStyle(document.documentElement).getPropertyValue(`--color-${color}`).trim()
  if (!raw) return ''

  const [r, g, b] = hexToRgb(raw)
  const alpha = opacity / 100

  if (type === 'RGB') return alpha < 1 ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgb(${r}, ${g}, ${b})`

  if (type === 'HSL') {
    const [h, s, l] = rgbToHsl(r, g, b)
    return alpha < 1 ? `hsla(${h}, ${s}%, ${l}%, ${alpha})` : `hsl(${h}, ${s}%, ${l}%)`
  }

  if (alpha < 1) {
    const alphaHex = Math.round(alpha * 255)
      .toString(16)
      .padStart(2, '0')
    return `${raw}${alphaHex}`
  }

  return raw
}

/**
 * Read theme-aware CSS color tokens and expose conversion helpers.
 *
 * @returns An object containing:
 *   - `getColor(color, props?)`: resolves a `ColorName` from computed CSS.
 *   - `hexToRgb(hex)`: converts a six-digit hex value into RGB channels.
 *   - `rgbToHsl(r, g, b)`: converts RGB channels into an HSL tuple.
 *
 * `getColor` reads computed styles when it is called, so it uses the current
 * value of the CSS custom property. A `MutationObserver` watches the root
 * element's `class` attribute and causes the hook to refresh when the theme
 * class changes. The observer is disconnected when the component unmounts.
 */
export function useColors<T extends string = ''>() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'class') {
          setTick((t) => t + 1)
          break
        }
      }
    })

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const getColor = useCallback((color: T, props: GetColorProps = {}) => resolveColor(color, props), [tick])

  return { getColor, hexToRgb, rgbToHsl }
}

export function useColorsString(colors: TWColorName[]): string {
  return cn(colors)
}

/**
 * Documentation metadata
 *
 * Last documentation update: 2026-09-18
 * Documentation audience: Developers and AI agents
 * Evidence basis: Attached file + verified project context
 * Documentation coverage: Complete
 * Validation: `pnpm exec prettier --check src/hooks/Colors.ts`,
 *   `pnpm exec eslint src/hooks/Colors.ts`, and `pnpm type:check` passed
 * Known limitations: Browser DOM and matching CSS custom properties are required
 */
