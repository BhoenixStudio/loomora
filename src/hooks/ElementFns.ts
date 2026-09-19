'use client'

/**
 * # ElementFns
 *
 * Browser-only React hooks for dismissing an open element when interaction
 * occurs outside its wrapper and for choosing a menu placement from the
 * available viewport space.
 *
 * ## File overview
 *
 * - `UseClickOutside` attaches document-level mouse and touch listeners while
 *   an overlay is open and invokes the supplied callback for outside events.
 * - `UseCalculatePosition` measures a wrapper and its menu while open and
 *   returns logical vertical and horizontal placement tokens.
 * - Confirmed: this module manages event listeners, measurements, and hook
 *   state; it does not render markup, close UI by itself, or apply CSS classes.
 *
 * ## When to use
 *
 * Use `UseClickOutside` for an open dropdown or another wrapper-owned overlay
 * that should close on `mousedown` or `touchstart` outside that wrapper. Use
 * `UseCalculatePosition` when a menu needs to choose above/below and logical
 * start/end placement from its measured size. The verified `Dropdown` consumer
 * composes both hooks for this purpose.
 *
 * When placement is intentionally fixed, prefer the caller's fixed-position
 * branch instead of relying on the calculated result. `Dropdown` does this
 * when its `staticPosition` prop is enabled.
 *
 * ## Developer guide
 *
 * 1. Create refs for the wrapper and, when using `UseCalculatePosition`, the
 *    rendered menu element.
 * 2. Call the hooks unconditionally during component render, as required for
 *    React hooks, and pass the current open state.
 * 3. Use the returned `{ v, h }` values to choose the caller's vertical and
 *    logical horizontal layout.
 *
 * The confirmed project import path is `@hooks`, which re-exports this file.
 * The hooks only access `document` and `window` inside effects, but the module
 * is marked `'use client'` because the APIs are browser-facing React hooks.
 *
 * Minimal usage:
 *
 * ```tsx
 * UseClickOutside(open, wrapperRef, () => setOpen(false))
 * const position = UseCalculatePosition(open, wrapperRef, menuRef)
 * ```
 *
 * Practical composition, matching the verified `Dropdown` consumer:
 *
 * ```tsx
 * UseClickOutside(open, wrapperRef, () => handleToggle(false))
 * const calculatedPosition = UseCalculatePosition(open, wrapperRef, menuRef)
 * const position = staticPosition ? getStaticPosition(sPosition) : calculatedPosition
 * ```
 *
 * The second example is illustrative outside `Dropdown`; `handleToggle`,
 * `getStaticPosition`, `staticPosition`, and `sPosition` are local to that
 * consumer rather than exports from this file.
 *
 * ## AI agent guide
 *
 * - Preserve both exported names, their parameter order, the `open` gating,
 *   and the `{ v, h }` return shape. `src/hooks/index.ts` re-exports them.
 * - Reuse the existing refs and callbacks at the consumer rather than adding
 *   parallel document or viewport listeners.
 * - Safe extension points are the documented listener or measurement behavior,
 *   but any change should keep cleanup paired with registration and retain
 *   logical RTL-aware placement.
 * - Inspect `src/components/UI/Dropdown.tsx` before changing these contracts;
 *   it is the verified consumer and relies on the exact placement tokens.
 * - This file appears manually maintained. The project provides `pnpm type:check`,
 *   `pnpm lint`, and `pnpm format:check` for validation.
 *
 * ## Errors, edge cases, and limitations
 *
 * - No input validation or error handling is implemented. Callback and DOM
 *   measurement errors are not caught by these hooks.
 * - `UseClickOutside` does not invoke the callback while `open` is false, when
 *   the wrapper ref is null, or for events whose target is inside the wrapper.
 *   It does not handle keyboard Escape, focus changes, or portal content
 *   outside the wrapper.
 * - `UseCalculatePosition` starts with `{ v: 'bottom', h: 'end' }`. If either
 *   ref is unavailable when the calculation runs, it keeps that fallback.
 *   If the preferred side lacks space but the opposite side does not have
 *   more room, the default direction remains selected; the chosen side is not
 *   required to fit the menu completely.
 * - Horizontal placement treats the document as RTL when either
 *   `document.documentElement.dir` or `document.body.dir` is `'rtl'`; otherwise
 *   it uses LTR calculations. The returned values are logical tokens, not CSS.
 * - Recalculation occurs on the initial animation frame after opening and on
 *   window resize or captured scroll. Content-size or ref changes alone are
 *   not observed, and the effects depend on `open` rather than callback or ref
 *   identity changes.
 *
 * ## Related references
 *
 * - `src/hooks/index.ts` - barrel export for both hooks.
 * - `src/components/UI/Dropdown.tsx` - verified consumer and placement mapping.
 * - `instructions/code-rules.md` - applicable TypeScript and React project rules.
 * - `tsconfig.json` - confirms the `@hooks` path alias.
 */
import { RefObject, useEffect, useState } from 'react'

/**
 * Calls a callback when an open wrapper receives a mouse or touch start outside
 * its DOM subtree.
 *
 * While `open` is true, the hook registers `mousedown` and `touchstart`
 * listeners on `document`. It removes both listeners when `open` becomes false
 * or the consuming component unmounts.
 *
 * @param open Whether outside-event listening is active.
 * @param wrapperRef Ref for the element that owns the interactive region.
 * @param callback Function invoked for an outside event; it receives no arguments.
 * @example
 * ```tsx
 * UseClickOutside(open, wrapperRef, () => setOpen(false))
 * ```
 */
export function UseClickOutside(open: boolean, wrapperRef: RefObject<HTMLElement | null>, callback: () => void) {
  useEffect(() => {
    if (!open) return
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) callback()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [open])
}

/**
 * Chooses a menu placement from the wrapper's viewport position and the menu's
 * measured dimensions.
 *
 * The vertical result is `top` when the menu does not fit below and there is
 * more room above; otherwise it is `bottom`. The horizontal result is `start`
 * when the logical start side does not fit and the opposite side has more room;
 * otherwise it is `end`. RTL calculations are selected when either the root or
 * body `dir` attribute is `'rtl'`.
 *
 * @param open Whether measurement and viewport listeners are active.
 * @param wrapperRef Ref for the element whose position anchors the menu.
 * @param menuRef Ref for the menu element whose `offsetWidth` and `offsetHeight`
 *   are measured.
 * @returns An object with logical placement tokens: `{ v: 'top' | 'bottom', h: 'start' | 'end' }`.
 * @example
 * ```tsx
 * const position = UseCalculatePosition(open, wrapperRef, menuRef)
 * const verticalClass = position.v === 'top' ? 'bottom-full' : 'top-full'
 * ```
 *
 * The example shows how the returned value can drive caller-owned layout; the
 * CSS class names are also used by the verified `Dropdown` consumer.
 */
export function UseCalculatePosition(
  open: boolean,
  wrapperRef: RefObject<HTMLElement | null>,
  menuRef: RefObject<HTMLElement | null>
): { v: 'top' | 'bottom'; h: 'start' | 'end' } {
  const [position, setPosition] = useState<{ v: 'top' | 'bottom'; h: 'start' | 'end' }>({ v: 'bottom', h: 'end' })

  useEffect(() => {
    if (!open) return
    const calcPosition = () => {
      let v: 'top' | 'bottom' = 'bottom'
      let h: 'start' | 'end' = 'end'

      if (!wrapperRef.current || !menuRef.current) return setPosition({ v, h })

      const wrapperRect = wrapperRef.current.getBoundingClientRect()
      const menuHeight = menuRef.current.offsetHeight
      const menuWidth = menuRef.current.offsetWidth

      const spaceBelow = window.innerHeight - wrapperRect.bottom
      const spaceAbove = wrapperRect.top

      if (spaceBelow < menuHeight && spaceAbove > spaceBelow) v = 'top'

      const isRtl = document.documentElement.dir === 'rtl' || document.body.dir === 'rtl'
      const spaceTowardsStart = isRtl ? window.innerWidth - wrapperRect.left : wrapperRect.right
      const spaceTowardsEnd = isRtl ? wrapperRect.right : window.innerWidth - wrapperRect.left

      if (spaceTowardsStart < menuWidth && spaceTowardsEnd > spaceTowardsStart) h = 'start'

      setPosition({ v, h })
    }

    window.addEventListener('resize', calcPosition)
    window.addEventListener('scroll', calcPosition, true)

    requestAnimationFrame(calcPosition)

    return () => {
      window.removeEventListener('resize', calcPosition)
      window.removeEventListener('scroll', calcPosition, true)
    }
  }, [open])

  return position
}

/**
 * Documentation metadata:
 * - Last documentation update: 2026-09-18
 * - Documentation audience: Developers and AI agents
 * - Evidence basis: Attached file + verified project context
 * - Documentation coverage: Complete
 * - Validation: `pnpm exec prettier --check src/hooks/ElementFns.ts`, `pnpm exec eslint src/hooks/ElementFns.ts`, and `pnpm type:check` passed.
 * - Known limitations: No dedicated test file was found; browser layout behavior is not unit-tested.
 */
