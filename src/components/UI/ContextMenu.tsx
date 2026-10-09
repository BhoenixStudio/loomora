'use client'

import { AnimationEvent, MouseEvent, ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../../hooks'

export type ContextMenuChildren = ReactNode | ((close: () => void) => ReactNode)

export type UseContextMenuOptions = {
  children: ContextMenuChildren
  open?: boolean
  setOpen?: (open: boolean) => void
  menuClassName?: string
}

export type ContextMenuTriggerProps = { onContextMenu: (event: MouseEvent<Element>) => void }

export type UseContextMenuResult = {
  triggerProps: ContextMenuTriggerProps
  menu: ReactNode
  isOpen: boolean
  openAt: (x: number, y: number) => void
  close: () => void
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export function useContextMenu(options: Readonly<UseContextMenuOptions>): UseContextMenuResult {
  const {
    children,
    open,
    setOpen,
    menuClassName = 'min-w-44 rounded-2xl border border-third bg-main p-2 shadow-lg',
  } = options

  // Refs
  const menuRef = useRef<HTMLDivElement>(null)
  const setOpenRef = useRef(setOpen)

  // States
  const [innerOpen, setInnerOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [point, setPoint] = useState({ x: 0, y: 0 })

  // Configs
  const isControlled = open !== undefined
  const isOpen = open ?? innerOpen

  // Functions
  const changeOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInnerOpen(next)
      setOpenRef.current?.(next)
    },
    [isControlled]
  )
  const close = useCallback(() => changeOpen(false), [changeOpen])
  const openAt = useCallback(
    (x: number, y: number) => {
      setPoint({ x, y })
      changeOpen(true)
    },
    [changeOpen]
  )
  const onContextMenu = useCallback(
    (event: MouseEvent<Element>) => {
      event.preventDefault()
      openAt(event.clientX, event.clientY)
    },
    [openAt]
  )
  const handleAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.animationName === 'loomora-dropdown-exit' && !isOpen && event.target === event.currentTarget)
      setMounted(false)
  }

  if (isOpen && !mounted) setMounted(true)
  useIsomorphicLayoutEffect(() => {
    const element = menuRef.current
    if (!isOpen || !element) return

    element.style.left = '0px'
    element.style.top = '0px'

    const { offsetWidth: width, offsetHeight: height } = element
    const { innerWidth: viewportWidth, innerHeight: viewportHeight } = window

    const flipX = point.x + width > viewportWidth
    const flipY = point.y + height > viewportHeight

    const left = flipX ? point.x - width : point.x
    const top = flipY ? point.y - height : point.y

    element.style.left = `${Math.max(0, Math.min(left, viewportWidth - width))}px`
    element.style.top = `${Math.max(0, Math.min(top, viewportHeight - height))}px`
    element.style.setProperty('--loomora-dropdown-offset', flipY ? '-8px' : '8px')
  }, [isOpen, mounted, point])

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: Event) => {
      if (!menuRef.current?.contains(event.target as Node)) close()
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    const handleDismiss = (event: Event) => {
      if (event.target instanceof Node && menuRef.current?.contains(event.target)) return
      close()
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleDismiss)
    window.addEventListener('scroll', handleDismiss, true)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleDismiss)
      window.removeEventListener('scroll', handleDismiss, true)
    }
  }, [isOpen, close])

  useEffect(() => {
    setOpenRef.current = setOpen
  }, [setOpen])

  const menu =
    mounted &&
    typeof document !== 'undefined' &&
    createPortal(
      <div
        ref={menuRef}
        role="menu"
        onAnimationEnd={handleAnimationEnd}
        onContextMenu={(event) => {
          event.preventDefault()
          event.stopPropagation()
        }}
        className={cx([
          'loomora-dropdown loomora-dropdown--bottom fixed z-50',
          isOpen ? 'loomora-dropdown--enter' : 'loomora-dropdown--exit pointer-events-none',
          menuClassName,
        ])}
      >
        {typeof children === 'function' ? children(close) : children}
      </div>,
      document.body
    )

  return { triggerProps: { onContextMenu }, menu, isOpen, openAt, close }
}
