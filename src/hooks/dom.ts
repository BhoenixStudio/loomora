'use client'

import { RefObject, useEffect, useRef, useState } from 'react'

export type FloatPos = { v: 'top' | 'bottom'; h: 'start' | 'end' }

export function useOverlay(open: boolean, wrapperRef: RefObject<HTMLElement | null>) {
  const useClickAway = (callback: () => void) => {
    const callbackRef = useRef(callback)

    useEffect(() => {
      callbackRef.current = callback
    }, [callback])

    useEffect(() => {
      if (!open) return

      const handleClick = (event: MouseEvent | TouchEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
          callbackRef.current()
        }
      }

      document.addEventListener('mousedown', handleClick)
      document.addEventListener('touchstart', handleClick)

      return () => {
        document.removeEventListener('mousedown', handleClick)
        document.removeEventListener('touchstart', handleClick)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])
  }

  const useFloatPos = (menuRef: RefObject<HTMLElement | null>): FloatPos => {
    const [pos, setPos] = useState<FloatPos>({ v: 'bottom', h: 'end' })

    useEffect(() => {
      if (!open) return

      const calc = () => {
        if (!wrapperRef.current || !menuRef.current) return

        let v: 'top' | 'bottom' = 'bottom'
        let h: 'start' | 'end' = 'end'

        const wrap = wrapperRef.current.getBoundingClientRect()
        const menuHeight = menuRef.current.offsetHeight
        const menuWidth = menuRef.current.offsetWidth

        const spaceBelow = window.innerHeight - wrap.bottom
        const spaceAbove = wrap.top

        if (spaceBelow < menuHeight && spaceAbove > spaceBelow) v = 'top'

        const isRtl = document.documentElement.dir === 'rtl' || document.body.dir === 'rtl'
        const spaceTowardsStart = isRtl ? window.innerWidth - wrap.left : wrap.right
        const spaceTowardsEnd = isRtl ? wrap.right : window.innerWidth - wrap.left

        if (spaceTowardsStart < menuWidth && spaceTowardsEnd > spaceTowardsStart) h = 'start'

        setPos((prev) => (prev.v === v && prev.h === h ? prev : { v, h }))
      }

      window.addEventListener('resize', calc)
      window.addEventListener('scroll', calc, true)
      requestAnimationFrame(calc)

      return () => {
        window.removeEventListener('resize', calc)
        window.removeEventListener('scroll', calc, true)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, menuRef])

    return pos
  }

  return { useClickAway, useFloatPos }
}
