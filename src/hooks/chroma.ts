'use client'

import { useCallback, useEffect, useState } from 'react'

export type HueFormat = 'HEX' | 'RGB' | 'HSL'
export type HueOptions = { format?: HueFormat; opacity?: number }

export function useHue<T extends string = ''>() {
  const [tick, setTick] = useState(0)

  // Functions
  const hex2rgb = (hex: string): [number, number, number] => {
    let c = hex.replace('#', '').trim()
    if (c.length === 3)
      c = c
        .split('')
        .map((char) => char + char)
        .join('')
    if (c.length !== 6) return [0, 0, 0]
    return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]
  }
  const rgb2hex = (r: number, g: number, b: number): string => {
    const toHex = (c: number) =>
      Math.round(Math.max(0, Math.min(255, c)))
        .toString(16)
        .padStart(2, '0')
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }
  const rgb2hsl = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b)
    const l = (max + min) / 2
    let h = 0,
      s = 0

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
      else if (max === g) h = ((b - r) / d + 2) / 6
      else h = ((r - g) / d + 4) / 6
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
  }
  const hsl2rgb = (h: number, s: number, l: number): [number, number, number] => {
    s /= 100
    l /= 100
    const k = (n: number) => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))]
  }
  const hex2hsl = (hex: string): [number, number, number] => {
    const [r, g, b] = hex2rgb(hex)
    return rgb2hsl(r, g, b)
  }
  const hsl2hex = (h: number, s: number, l: number): string => {
    const [r, g, b] = hsl2rgb(h, s, l)
    return rgb2hex(r, g, b)
  }
  const isDark = (hex: string): boolean => {
    const [r, g, b] = hex2rgb(hex)
    return (r * 299 + g * 587 + b * 114) / 1000 < 128
  }

  const getHue = useCallback(
    (color: T, options: HueOptions = {}): string => {
      if (typeof window === 'undefined') return ''

      const { format = 'HEX', opacity = 100 } = options
      if (opacity < 0 || opacity > 100) throw new Error('Opacity must be 0-100')

      const raw = getComputedStyle(document.documentElement).getPropertyValue(`--color-${color}`).trim()
      if (!raw) return ''

      const [r, g, b] = hex2rgb(raw)
      const alpha = opacity / 100

      if (format === 'RGB') return alpha < 1 ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgb(${r}, ${g}, ${b})`

      if (format === 'HSL') {
        const [h, s, l] = rgb2hsl(r, g, b)
        return alpha < 1 ? `hsla(${h}, ${s}%, ${l}%, ${alpha})` : `hsl(${h}, ${s}%, ${l}%)`
      }

      if (alpha < 1) {
        const baseHex = rgb2hex(r, g, b)
        const alphaHex = Math.round(alpha * 255)
          .toString(16)
          .padStart(2, '0')
        return `${baseHex}${alphaHex}`
      }

      return raw
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tick]
  )

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      if (mutations.some((m) => m.attributeName === 'class')) {
        setTick((t) => t + 1)
      }
    })

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return { getHue, hex2rgb, rgb2hex, rgb2hsl, hsl2rgb, hex2hsl, hsl2hex, isDark }
}
