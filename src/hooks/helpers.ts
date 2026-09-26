import { Dispatch, isValidElement, ReactNode, SetStateAction } from 'react'

/**
 * Applies an open/show or close/hide transition through React state setters.
 * @param action Transition to apply; `toggle` requires `states.open`.
 * @param states Open state setter and optional rendered/show state setter.
 * @param props Delay in milliseconds; `period` defaults to `100`, and close uses it by default.
 * @remarks Opening shows immediately then opens after the delay; closing closes immediately then hides after the delay.
 * Timers are not cancelled by this helper.
 * @example `UseToggle('close', { open, setOpen, setShow }, { closePeriod: 300 })`
 */
export function UseToggle(
  action: 'toggle' | 'open' | 'close' | 'show' | 'hide',
  states: {
    open?: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    setShow?: Dispatch<SetStateAction<boolean>>
  },
  props?: { period?: number; closePeriod?: number }
) {
  const { open, setOpen, setShow } = states
  const { period = 100, closePeriod } = props ?? {}

  function handleOpen() {
    setShow?.(true)
    setTimeout(() => setOpen(true), period)
  }
  function handleClose() {
    setOpen(false)
    setTimeout(() => setShow?.(false), closePeriod ?? period)
  }

  if (['hide', 'close']?.includes(action)) handleClose()
  else if (['show', 'open']?.includes(action)) handleOpen()
  else if (['toggle']?.includes(action)) {
    if (open === undefined) return console.error('"open" parameter is required as boolean value!')
    else if (open) handleClose()
    else handleOpen()
  }
}

/**
 * Truncates text when it exceeds the requested length and appends `...`.
 * @param text Source text.
 * @param maxLength Maximum source-text length; defaults to `50`.
 * @returns Original text when it fits, otherwise the truncated text with an ellipsis.
 */
export function UseTruncate(text: string, maxLength: number = 50): string {
  return text?.length > maxLength ? text?.substring(0, maxLength) + '...' : text
}

/**
 * Keeps only characters accepted by the selected numeric-input mode.
 * @param value Input value to filter.
 * @param allowTel When true, allows digits, `+`, and `#`; otherwise allows digits and commas.
 * @returns Filtered value with all other characters removed.
 */
export function onlyNumberAllowed(value: string, allowTel?: boolean): string {
  return value.replace(allowTel ? /[^0-9+#]/g : /[^0-9,]/g, '')
}

/** Optional behavior for `CopyToClipboard`. */
export type CopyProps = { disabled?: boolean; message?: string; onCopy?: (message: string) => void }

/**
 * Shows a success toast and writes text to the browser clipboard unless disabled.
 * @param text Text to copy.
 * @param props Optional disabled flag and success message.
 * @returns A promise that rejects if the Clipboard API write fails; this helper does not catch it.
 * @remarks The success toast is shown before the clipboard write completes, so this is browser-only.
 */
export async function CopyToClipboard(text: string, props?: CopyProps) {
  const { disabled, message, onCopy } = props ?? {}
  if (disabled) return

  onCopy?.(message ?? `"${text}" successfully copied to clipboard`)
  await navigator.clipboard.writeText(text)
}

export function isThisProps<T extends object>(element: ReactNode | T, keyToSearch: keyof T): element is T {
  return typeof element === 'object' && element !== null && !isValidElement(element) && keyToSearch in element
}

/**
 * Documentation metadata
 * - Last documentation update: 2026-09-18
 * - Documentation audience: Developers and AI agents
 * - Evidence basis: Attached file + verified project context
 * - Documentation coverage: Complete
 * - Validation: Passed `pnpm type:check`, `pnpm exec prettier --check src/hooks/Helpers.ts`, and `pnpm exec eslint src/hooks/Helpers.ts`; Prettier emitted a Node module-type warning.
 * - Known limitations: Browser APIs and timer cleanup remain caller/environment concerns.
 */
