'use client'

import { AnimationEvent, MouseEvent, ReactNode, useRef, useState } from 'react'
import { cx, useOverlay } from '../../hooks'
import { GlobalElement } from '../../types'
import { Button, ButtonProps } from '../index'

export type DropdownProps = {
  trigger: ReactNode
  children: (close: () => void) => ReactNode
  wrapperProps?: Omit<GlobalElement<'div'>, 'children'>
  triggerProps?: Omit<Extract<ButtonProps, { href?: never }>, 'children' | 'title' | 'icon' | 'href'>
  menuClassName?: string
  onToggle?: (opened: boolean) => void
  staticPosition?: boolean
  position?:
    'TOP_START' | 'TOP_END' | 'TOP_LEFT' | 'TOP_RIGHT' | 'BOTTOM_START' | 'BOTTOM_END' | 'BOTTOM_LEFT' | 'BOTTOM_RIGHT'
}

export function Dropdown(props: Readonly<DropdownProps>) {
  const {
    wrapperProps,
    trigger,
    triggerProps,
    children,
    menuClassName = 'w-56 rounded-2xl border border-third bg-main p-2 shadow-lg',
    onToggle,
    staticPosition = false,
    position: sPosition = 'TOP_START',
  } = props

  const { className = '', ...wrapperRestProps } = wrapperProps ?? {}
  const { onClick, ...triggerRestProps } = triggerProps ?? {}

  // Refs
  const wrapperRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // States
  const [open, setOpen] = useState(false)
  const [menuMounted, setMenuMounted] = useState(false)

  // Functions
  const handleToggle = (newState: boolean) => {
    setOpen(newState)
    if (newState) setMenuMounted(true)
    onToggle?.(newState)
  }
  const handleMenuAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.animationName === 'loomora-dropdown-exit' && !open && event.target === event.currentTarget)
      setMenuMounted(false)
  }
  const getStaticPosition = (pos: DropdownProps['position']) => {
    if (!pos) pos = sPosition
    return {
      v: (pos.startsWith('TOP_') ? 'top' : 'bottom') as 'top' | 'bottom',
      h: (pos.endsWith('_START') ? 'start' : 'end') as 'start' | 'end',
    }
  }

  // Hooks
  const { useClickAway, useFloatPos } = useOverlay(open, wrapperRef)
  useClickAway(() => handleToggle(false))
  const calculatedPosition = useFloatPos(menuRef)
  const position = staticPosition ? getStaticPosition(sPosition) : calculatedPosition

  return (
    <div ref={wrapperRef} className={cx(['relative', className])} {...wrapperRestProps}>
      <Button
        onClick={(e: MouseEvent<HTMLButtonElement>) => {
          handleToggle(!open)
          onClick?.(e)
        }}
        {...triggerRestProps}
      >
        {trigger}
      </Button>

      {menuMounted && (
        <div
          ref={menuRef}
          onAnimationEnd={handleMenuAnimationEnd}
          className={cx([
            'loomora-dropdown absolute z-50',
            open ? 'loomora-dropdown--enter' : 'loomora-dropdown--exit',
            position.v === 'top' ? 'loomora-dropdown--top bottom-full mb-2' : 'loomora-dropdown--bottom top-full mt-2',
            position.h === 'start' ? 'inset-s-0' : 'inset-e-0',
            menuClassName,
          ])}
        >
          {typeof children === 'function' ? children(() => handleToggle(false)) : children}
        </div>
      )}
    </div>
  )
}
