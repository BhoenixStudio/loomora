'use client'

/**
 * Controlled, client-only dialog primitive with optional overlay, transitions,
 * positional layouts, and portal rendering.
 *
 * ## File overview
 *
 * `Dialog.tsx` exports the `Dialog` component and the `DialogPosition`,
 * `DialogProcess`, `DialogProps`, and `DialogPropsFull` types. The component
 * renders a native `<dialog>` element and, by default, mounts the complete
 * dialog content into `document.body` through `createPortal`.
 *
 * Confirmed responsibilities:
 * - Compose the dialog and optional full-screen overlay.
 * - Apply open/closed opacity and position classes.
 * - Close through Escape or overlay clicks when those options are enabled.
 * - Keep the content mounted during the close transition when `show` and
 *   `setShow` are supplied.
 *
 * This file does not provide a close button inside the dialog, focus trapping,
 * focus restoration, scroll locking, validation, loading states, network calls,
 * or persistence. Consumers provide their own content and close controls.
 *
 * ## When to use
 *
 * Use `Dialog` for a controlled modal, side panel, image preview, or other
 * transient content that needs the shared overlay and position transitions.
 * Use `DialogForm` when the content is a `Form` with the project's standard
 * title and close-button structure. Use `Action` when a button should own the
 * dialog state and render a supplied `content` value.
 *
 * ## Developer guide
 *
 * Import the component from the `@components` barrel. Supply the required
 * `open` and `setOpen` values. For the normal animated mount/unmount flow,
 * also supply `show` and `setShow`; `show` is optional in the type only because
 * `renderInBackground` can keep the dialog rendered without it. When
 * `renderInBackground` is false and `show` is falsy or omitted, the component
 * returns `null`.
 *
 * Opening and closing can use `UseToggle`, which sets `show` before opening and
 * hides it after the close delay. The built-in close path passes a 300 ms
 * `closePeriod`; `open` closes immediately and `show` is hidden after that
 * delay when `setShow` is supplied.
 * `onClose` is called only after this component's overlay or Escape close path
 * invokes `HandleClose`; a consumer that closes through its own button should
 * call `UseToggle` and `onClose` as needed.
 *
 * `attributes` accepts native `<dialog>` attributes. Its `onKeyDown` handler
 * is preserved and is called after Escape handling when `closeOnEsc` is true.
 * `usePortal={false}` keeps the rendered fragment at the call site instead of
 * appending it to `document.body`.
 *
 * ## AI agent guide
 *
 * Preserve the controlled-state contract, the `show`/`open` distinction, the
 * 300 ms close delay, the default position and class values, and the portal
 * default when extending this component. Reuse `UseToggle` rather than adding
 * a second state-transition implementation. Check `DialogForm`, `Action`, and
 * `Image` consumers before changing close behavior, positioning, or portal
 * assumptions. This is manually maintained source, not generated output.
 *
 * Safe extension points are the documented props, `attributes`, child content,
 * and the existing position class overrides. Changes to the state contract,
 * default classes, close timing, or accessibility behavior require consumer
 * review because they affect shared UI primitives.
 *
 * ## Usage examples
 *
 * ### Minimal controlled dialog
 *
 * Illustrative example. The surrounding component and its state are not part
 * of this file, but every component, prop, and helper shown is verified against
 * the project exports and this component's contract.
 *
 * ```tsx
 * import { useState } from 'react'
 * import { Dialog } from '@components'
 * import { UseToggle } from '@hooks'
 *
 * function Example() {
 *   const [open, setOpen] = useState(false)
 *   const [show, setShow] = useState(false)
 *
 *   return (
 *     <>
 *       <button type='button' onClick={() => UseToggle('toggle', { open, setOpen, setShow })}>
 *         Open
 *       </button>
 *       <Dialog open={open} setOpen={setOpen} show={show} setShow={setShow}>
 *         <h2 id='example-dialog-title'>Dialog content</h2>
 *         <button type='button' onClick={() => UseToggle('close', { open, setOpen, setShow })}>
 *           Close
 *         </button>
 *       </Dialog>
 *     </>
 *   )
 * }
 * ```
 *
 * ### Positioned panel with native attributes
 *
 * Illustrative example. The `open`, `setOpen`, `show`, and `setShow` values
 * must come from the consuming component's state.
 *
 * ```tsx
 * <Dialog
 *   open={open}
 *   setOpen={setOpen}
 *   show={show}
 *   setShow={setShow}
 *   position='end'
 *   width='45vw'
 *   minWidth='20rem'
 *   closeOnOverlayClick={false}
 *   attributes={{ 'aria-labelledby': 'settings-dialog-title' }}
 * >
 *   <h2 id='settings-dialog-title'>Settings</h2>
 *   <div>Settings content and a consumer-owned close control.</div>
 * </Dialog>
 * ```
 *
 * ## Errors, edge cases, and limitations
 *
 * - `open` and `setOpen` are required by `DialogProcess`; no runtime fallback
 *   is provided for missing state setters.
 * - With the default `renderInBackground={false}`, a missing or false `show`
 *   prevents all dialog and overlay markup from rendering.
 * - `open` controls classes and close behavior; it is not used to call the
 *   native `HTMLDialogElement.showModal()` or `close()` methods.
 * - `closeOnEsc={false}` leaves the supplied `attributes.onKeyDown` handler
 *   unchanged. With the default `closeOnEsc={true}`, Escape closes first and
 *   then invokes that handler.
 * - `closeOnOverlayClick={false}` removes the overlay click handler but the
 *   visible overlay remains present while open, so it can still cover the page.
 * - `onClose` receives no event and is not called when a consumer changes
 *   `open` or `show` directly.
 * - No explicit focus management, focus trap, focus restoration, dialog title,
 *   or description is added. Supply suitable native attributes and accessible
 *   content through the consumer.
 * - `style` is spread after the `width` and `minWidth` props, so explicit
 *   `style.width` or `style.minWidth` values take precedence.
 * - `clearDefaultClassName` is accepted through `GlobalElementEssentials`, but
 *   this component does not inspect it; `baseClassName` and `className` remain
 *   part of the rendered class list.
 *
 * ## Related references
 *
 * - `src/components/index.ts`: re-exports this component and its types through
 *   `@components`.
 * - `src/hooks/Helpers.ts`: defines the `UseToggle` transition helper used by
 *   this component.
 * - `src/@types/Global.ts`: defines `CSSProps` and `GlobalElementEssentials`.
 * - `src/components/Forms/Dialog.tsx`: composes `Dialog` with `Form`.
 * - `src/components/UI/Button/Action.tsx`: owns dialog state for button actions.
 * - `src/components/UI/Image.tsx`: uses `Dialog` for an image preview.
 *
 * ## Assumptions and unknowns
 *
 * - Confirmed: the component is exported from the UI barrel and is consumed by
 *   the inspected form, action, and image implementations.
 * - Unknown: the repository does not expose a dedicated Dialog test in the
 *   inspected context, so consumer-specific focus and browser behavior are not
 *   validated here.
 */
import { cn, UseToggle } from '../../hooks'
import { CSSProps, GlobalElementEssentials } from '../../types'
import { Dispatch, KeyboardEvent, ReactNode, SetStateAction } from 'react'
import { createPortal } from 'react-dom'

/** Positions supported by the dialog's built-in transition classes. */
export type DialogPosition = 'center' | 'top' | 'bottom' | 'left' | 'right' | 'start' | 'end'

/**
 * Controlled state required by `Dialog`.
 *
 * `open` controls the active position and opacity classes. `show` controls
 * whether the markup is mounted; it is optional for background rendering, but
 * normal animated use should provide both values and setters.
 */
export type DialogProcess = {
  show?: boolean
  setShow?: Dispatch<SetStateAction<boolean>>
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

/**
 * Public configuration for `Dialog`, including shared dialog-element fields.
 *
 * @property position Placement and transition direction; defaults to `center`.
 * `start` and `end` use logical inline-side classes for RTL-compatible layouts.
 * @property className Shared dialog classes; defaults to
 * `bg-main rounded-lg p-3`.
 * @property width Optional inline width applied to the dialog.
 * @property minWidth Optional inline minimum width applied to the dialog.
 * @property onClose Callback invoked by the built-in Escape and overlay close
 * paths after the state close request; it receives no event.
 * @property hasOverlay Whether to render the fixed overlay; defaults to `true`.
 * @property baseClassName Classes applied before transition and position classes;
 * defaults to `flex-col flex-nowrap`.
 * @property overlayClassName Classes applied to the overlay; defaults to
 * `bg-black/50 backdrop-blur-sm`.
 * @property positionInActiveClassName Position classes used while `open` is
 * false. The component supplies a position-specific inactive fallback when
 * this is omitted.
 * @property positionActiveClassName Position classes used while `open` is true.
 * The component supplies a position-specific active fallback when omitted.
 * @property closeOnOverlayClick Whether an open overlay closes the dialog when
 * clicked; defaults to `true`.
 * @property closeOnEsc Whether Escape invokes the close path; defaults to `true`.
 * @property renderInBackground When true, render even when `show` is falsy;
 * defaults to `false`.
 * @property usePortal When true, render through `createPortal` into
 * `document.body`; defaults to `true`.
 * @property attributes Additional native `<dialog>` attributes. Its
 * `onKeyDown` handler is composed with the component's Escape handling.
 */
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

/** Complete `Dialog` props: configuration, required children, and controlled state. */
export type DialogPropsFull = DialogProps & { children: ReactNode } & DialogProcess

/**
 * Renders a controlled dialog with an optional overlay and portal.
 *
 * The component renders nothing until `show` is truthy unless
 * `renderInBackground` is enabled. While mounted, `open` selects the active
 * opacity and position classes. Overlay clicks and Escape call `UseToggle` with
 * a 300 ms close period; `onClose` is invoked immediately afterward when
 * supplied.
 *
 * @param props Dialog configuration, children, and controlled state.
 * @returns The dialog fragment, optionally portaled to `document.body`, or
 * `null` when it is not mounted.
 */
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
    center: cn([
      'inset-x-0 mx-auto max-w-[95%] max-h-[95%] ease-[cubic-bezier(0,2.5,1,1)]',
      {
        value: positionActiveClassName ?? 'top-1/2 -translate-y-1/2',
        fallback: positionInActiveClassName ?? 'top-[75%]',
        condition: open,
      },
    ]),
    top: cn([
      'inset-x-0 mx-auto ease-in-out',
      {
        value: positionActiveClassName ?? 'top-0',
        fallback: positionInActiveClassName ?? 'top-[-150%]',
        condition: open,
      },
    ]),
    bottom: cn([
      'inset-x-0 mx-auto ease-in-out',
      {
        value: positionActiveClassName ?? 'bottom-0',
        fallback: positionInActiveClassName ?? 'bottom-[-150%]',
        condition: open,
      },
    ]),
    left: cn([
      'top-0 inset-r-[unset] h-[100dvh] ease-in-out',
      {
        value: positionActiveClassName ?? 'left-0',
        fallback: positionInActiveClassName ?? 'left-[-100%] ',
        condition: open,
      },
    ]),
    right: cn([
      'top-0 left-[unset] h-[100dvh] ease-in-out',
      {
        value: positionActiveClassName ?? 'right-0',
        fallback: positionInActiveClassName ?? 'right-[-100%]',
        condition: open,
      },
    ]),
    start: cn([
      'top-0 inset-e-[unset] h-[100dvh] ease-in-out',
      {
        value: positionActiveClassName ?? 'inset-s-0',
        fallback: positionInActiveClassName ?? 'inset-s-[-100%]',
        condition: open,
      },
    ]),
    end: cn([
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
    UseToggle('close', { open, setOpen, setShow }, { closePeriod: 300 })
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
          className={cn([
            'fixed inset-0 z-1900',
            'transition-opacity duration-300 ease-in-out',
            { value: 'opacity-100', fallback: 'opacity-0 pointer-events-none', condition: open },
            { value: 'cursor-pointer', condition: closeOnOverlayClick },
            overlayClassName,
          ])}
        />
      )}

      <dialog
        className={cn([
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

/**
 * Documentation metadata:
 * - Last documentation update: 2026-09-18
 * - Documentation audience: Developers and AI agents
 * - Evidence basis: Attached file + verified project context
 * - Documentation coverage: Complete
 * - Validation: `pnpm exec prettier --check src/components/UI/Dialog.tsx`,
 *   `pnpm exec eslint src/components/UI/Dialog.tsx`, `pnpm type:check`, and
 *   `git diff --check` passed.
 * - Known limitations: Consumer-specific focus and browser behavior were not validated.
 */
