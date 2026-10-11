'use client'

import { useCallback, useEffect, useState } from 'react'

export type HueFormat = 'HEX' | 'RGB' | 'HSL'
export type HueOptions = { format?: HueFormat; opacity?: number }
export type Hsva = { h: number; s: number; v: number; a: number }

export function useHue<T extends string = ''>() {
  const [tick, setTick] = useState(0)

  // Functions
  const hex2rgb = (hex: string): [number, number, number] | null => {
    let c = hex.replace('#', '').trim()
    if (c.length === 3 || c.length === 4)
      c = c
        .split('')
        .map((char) => char + char)
        .join('')
    if (c.length !== 6 && c.length !== 8) return null
    if (!/^[0-9a-f]+$/i.test(c)) return null
    return [Number.parseInt(c.slice(0, 2), 16), Number.parseInt(c.slice(2, 4), 16), Number.parseInt(c.slice(4, 6), 16)]
  }
  const rgb2hex = (r: number, g: number, b: number): string => {
    const toHex = (c: number) => {
      const safe = Number.isFinite(c) ? c : 0
      return Math.round(Math.max(0, Math.min(255, safe)))
        .toString(16)
        .padStart(2, '0')
    }
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

    return [Math.round(h * 360) % 360, Math.round(s * 100), Math.round(l * 100)]
  }
  const hsl2rgb = (h: number, s: number, l: number): [number, number, number] => {
    const hue = ((h % 360) + 360) % 360
    s /= 100
    l /= 100
    const k = (n: number) => (n + hue / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))]
  }
  const hex2hsl = (hex: string): [number, number, number] | null => {
    const rgb = hex2rgb(hex)
    if (!rgb) return null
    return rgb2hsl(...rgb)
  }
  const hsl2hex = (h: number, s: number, l: number): string => {
    const [r, g, b] = hsl2rgb(h, s, l)
    return rgb2hex(r, g, b)
  }
  const isDark = (hex: string): boolean => {
    const rgb = hex2rgb(hex)
    if (!rgb) return false
    const [r, g, b] = rgb
    return (r * 299 + g * 587 + b * 114) / 1000 < 128
  }

  const normalizeHex = useCallback((input: string, alpha = false): string | null => {
    let hex = input.trim().replace(/^#/, '').toLowerCase()
    if (!/^[0-9a-f]+$/.test(hex)) return null
    if (hex.length === 3 || hex.length === 4) hex = [...hex].map((c) => c + c).join('')
    if (hex.length !== 6 && hex.length !== 8) return null
    if (hex.length === 8 && !alpha) hex = hex.slice(0, 6)
    if (hex.length === 8 && hex.endsWith('ff')) hex = hex.slice(0, 6)
    return `#${hex}`
  }, [])
  const hex2hsva = useCallback(
    (hex: string): Hsva => {
      const n = normalizeHex(hex, true) ?? '#000000'
      const r = Number.parseInt(n.slice(1, 3), 16) / 255
      const g = Number.parseInt(n.slice(3, 5), 16) / 255
      const b = Number.parseInt(n.slice(5, 7), 16) / 255
      const a = n.length === 9 ? Number.parseInt(n.slice(7, 9), 16) / 255 : 1
      const max = Math.max(r, g, b)
      const d = max - Math.min(r, g, b)
      let h = 0
      if (d !== 0) {
        if (max === r) h = ((g - b) / d) % 6
        else if (max === g) h = (b - r) / d + 2
        else h = (r - g) / d + 4
        h = (h * 60 + 360) % 360
      }
      return { h, s: max === 0 ? 0 : d / max, v: max, a }
    },
    [normalizeHex]
  )
  const hsva2hex = useCallback(({ h, s, v, a }: Hsva, alpha = false): string => {
    const f = (n: number) => {
      const k = (n + h / 60) % 6
      return v - v * s * Math.max(0, Math.min(k, 4 - k, 1))
    }
    const part = (x: number) =>
      Math.round(x * 255)
        .toString(16)
        .padStart(2, '0')
    const base = `#${part(f(5))}${part(f(3))}${part(f(1))}`
    return alpha && a < 1 ? `${base}${part(a)}` : base
  }, [])

  const getHue = useCallback(
    (color: T, options: HueOptions = {}): string => {
      if (typeof window === 'undefined') return ''

      const { format = 'HEX', opacity = 100 } = options
      const safeOpacity = Math.min(100, Math.max(0, opacity))
      if (safeOpacity !== opacity) console.warn(`Opacity ${opacity} is outside 0-100 and was clamped.`)

      const raw = getComputedStyle(document.documentElement).getPropertyValue(`--color-${color}`).trim()
      if (!raw) return ''

      const rgb = hex2rgb(raw)
      if (!rgb) return ''
      const [r, g, b] = rgb
      const alpha = safeOpacity / 100

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

  return { getHue, hex2rgb, rgb2hex, rgb2hsl, hsl2rgb, hex2hsl, hsl2hex, isDark, normalizeHex, hex2hsva, hsva2hex }
}
