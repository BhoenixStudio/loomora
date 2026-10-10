'use client'

import { RefObject, useEffect, useRef, useState } from 'react'

export type FloatPos = { v: 'top' | 'bottom'; h: 'start' | 'end' }

export function useClickAway(open: boolean, wrapperRef: RefObject<HTMLElement | null>, callback: () => void) {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (!open) return

    const handleClick = (event: MouseEvent | TouchEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) callbackRef.current()
    }

    document.addEventListener('mousedown', handleClick)
    document.addEventListener('touchstart', handleClick)

    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('touchstart', handleClick)
    }
  }, [open, wrapperRef])
}

export function useFloatPos(
  open: boolean,
  wrapperRef: RefObject<HTMLElement | null>,
  menuRef: RefObject<HTMLElement | null>,
  preferred: FloatPos = { v: 'bottom', h: 'end' }
): FloatPos {
  const [pos, setPos] = useState<FloatPos>(preferred)

  useEffect(() => {
    if (!open) return

    const calc = () => {
      if (!wrapperRef.current || !menuRef.current) return

      let { v, h } = preferred

      const wrap = wrapperRef.current.getBoundingClientRect()
      const menuHeight = menuRef.current.offsetHeight
      const menuWidth = menuRef.current.offsetWidth

      const spaceBelow = window.innerHeight - wrap.bottom
      const spaceAbove = wrap.top

      if (v === 'bottom' && spaceBelow < menuHeight && spaceAbove > spaceBelow) v = 'top'
      else if (v === 'top' && spaceAbove < menuHeight && spaceBelow > spaceAbove) v = 'bottom'

      const isRtl = document.documentElement.dir === 'rtl' || document.body.dir === 'rtl'
      const spaceTowardsStart = isRtl ? window.innerWidth - wrap.left : wrap.right
      const spaceTowardsEnd = isRtl ? wrap.right : window.innerWidth - wrap.left

      if (h === 'end' && spaceTowardsStart < menuWidth && spaceTowardsEnd > spaceTowardsStart) h = 'start'
      else if (h === 'start' && spaceTowardsEnd < menuWidth && spaceTowardsStart > spaceTowardsEnd) h = 'end'

      setPos((prev) => (prev.v === v && prev.h === h ? prev : { v, h }))
    }

    window.addEventListener('resize', calc)
    window.addEventListener('scroll', calc, true)
    const frame = requestAnimationFrame(calc)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', calc)
      window.removeEventListener('scroll', calc, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, wrapperRef, menuRef, preferred.v, preferred.h])

  return pos
}

/** Backward-compatible wrapper. Prefer the top-level `useClickAway` and `useFloatPos` hooks. */
export function useOverlay(open: boolean, wrapperRef: RefObject<HTMLElement | null>) {
  return {
    useClickAway: (callback: () => void) => useClickAway(open, wrapperRef, callback),
    useFloatPos: (menuRef: RefObject<HTMLElement | null>) => useFloatPos(open, wrapperRef, menuRef),
  }
}
