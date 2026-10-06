'use client'

import { Dispatch, KeyboardEvent, ReactNode, SetStateAction } from 'react'
import { createPortal } from 'react-dom'
import { cx, fade } from '../../hooks'
import { CSSProps, GlobalElementEssentials } from '../../types'

export type DialogPosition = 'center' | 'top' | 'bottom' | 'left' | 'right' | 'start' | 'end'

export type DialogProcess = {
  show?: boolean
  setShow?: Dispatch<SetStateAction<boolean>>
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export type DialogProps = GlobalElementEssentials<'dialog'> & {
  position?: DialogPosition
  width?: CSSProps['width']
  minWidth?: CSSProps['minWidth']
  onClose?: () => void
  hasOverlay?: boolean
  baseClassName?: string
  overlayClassName?: string
  positionInActiveClassName?: string
  positionActiveClassName?: string
  closeOnOverlayClick?: boolean
  closeOnEsc?: boolean
  renderInBackground?: boolean
  usePortal?: boolean
}

export type DialogPropsFull = DialogProps & { children: ReactNode } & DialogProcess

export function Dialog(props: Readonly<DialogPropsFull>) {
  const {
    open,
    setOpen,
    show,
    setShow,
    position = 'center',
    baseClassName = 'flex-col flex-nowrap',
    className = 'bg-main rounded-lg p-3',
    usePortal = true,
    closeOnEsc = true,
    hasOverlay = true,
    overlayClassName = 'bg-black/50 backdrop-blur-sm',
    positionInActiveClassName,
    positionActiveClassName,
    closeOnOverlayClick = true,
    renderInBackground = false,
    minWidth,
    width,
    onClose,
    attributes,
    children,
    style,
    ...attrs
  } = props

  const { onKeyDown, ...restAttrs } = attributes ?? {}

  // Configs
  const positions: Record<DialogPosition, string> = {
    center: cx([
      'inset-x-0 mx-auto max-w-[95%] max-h-[95%] ease-[cubic-bezier(0,2.5,1,1)]',
      {
        value: positionActiveClassName ?? 'top-1/2 -translate-y-1/2',
        fallback: positionInActiveClassName ?? 'top-[75%]',
        condition: open,
      },
    ]),
    top: cx([
      'inset-x-0 mx-auto ease-in-out',
      {
        value: positionActiveClassName ?? 'top-0',
        fallback: positionInActiveClassName ?? 'top-[-150%]',
        condition: open,
      },
    ]),
    bottom: cx([
      'inset-x-0 mx-auto ease-in-out',
      {
        value: positionActiveClassName ?? 'bottom-0',
        fallback: positionInActiveClassName ?? 'bottom-[-150%]',
        condition: open,
      },
    ]),
    left: cx([
      'top-0 inset-r-[unset] h-[100dvh] ease-in-out',
      {
        value: positionActiveClassName ?? 'left-0',
        fallback: positionInActiveClassName ?? 'left-[-100%] ',
        condition: open,
      },
    ]),
    right: cx([
      'top-0 left-[unset] h-[100dvh] ease-in-out',
      {
        value: positionActiveClassName ?? 'right-0',
        fallback: positionInActiveClassName ?? 'right-[-100%]',
        condition: open,
      },
    ]),
    start: cx([
      'top-0 inset-e-[unset] h-[100dvh] ease-in-out',
      {
        value: positionActiveClassName ?? 'inset-s-0',
        fallback: positionInActiveClassName ?? 'inset-s-[-100%]',
        condition: open,
      },
    ]),
    end: cx([
      'top-0 inset-s-[unset] h-[100dvh] ease-in-out',
      {
        value: positionActiveClassName ?? 'inset-e-0',
        fallback: positionInActiveClassName ?? 'inset-e-[-100%]',
        condition: open,
      },
    ]),
  }
  const sPro = positions[position ?? 'center'] ?? positions.center

  // Functions
  function HandleClose() {
    fade('out', { open, setOpen, setShow }, { closePeriod: 300 })
    onClose?.()
  }

  if (!renderInBackground && !show) return null

  const dialogContent = (
    <>
      {hasOverlay && (
        <button
          type="button"
          aria-label="Close Dialog"
          {...(closeOnOverlayClick && { onClick: HandleClose })}
          className={cx([
            'fixed inset-0 z-1900',
            'transition-opacity duration-300 ease-in-out',
            { value: 'opacity-100', fallback: 'opacity-0 pointer-events-none', condition: open },
            { value: 'cursor-pointer', condition: closeOnOverlayClick },
            overlayClassName,
          ])}
        />
      )}

      <dialog
        className={cx([
          'flex fixed z-2000 overflow-y-auto m-0',
          baseClassName,
          'transition-all duration-250',
          { value: 'opacity-100', fallback: 'opacity-0 pointer-events-none', condition: open },
          sPro,
          className,
        ])}
        style={{ ...(width && { width }), ...(minWidth && { minWidth }), ...style }}
        {...(closeOnEsc
          ? {
              onKeyDown: (e: KeyboardEvent<HTMLDialogElement>) => {
                if (e.key === 'Escape') HandleClose()
                onKeyDown?.(e)
              },
            }
          : { onKeyDown })}
        {...restAttrs}
        {...attrs}
      >
        {children}
      </dialog>
    </>
  )

  if (usePortal) return createPortal(dialogContent, document.body)
  return dialogContent
}
