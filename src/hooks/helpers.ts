import { Dispatch, isValidElement, ReactNode, SetStateAction } from 'react'

export function fade(
  action: 'toggle' | 'in' | 'out',
  states: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>>; setShow?: Dispatch<SetStateAction<boolean>> },
  props?: { period?: number; closePeriod?: number }
) {
  const { open, setOpen, setShow } = states
  const { period = 100, closePeriod = 100 } = props ?? {}

  // Functions
  function fadeIn() {
    setShow?.(true)
    setTimeout(() => setOpen(true), period)
  }
  function fadeOut() {
    setOpen(false)
    setTimeout(() => setShow?.(false), closePeriod)
  }

  if (['out']?.includes(action)) fadeOut()
  else if (['in']?.includes(action)) fadeIn()
  else if (['toggle']?.includes(action)) {
    if (open === undefined) return console.error('"open" parameter is required as boolean value!')
    else if (open) fadeOut()
    else fadeIn()
  }
}

export function snip(text: string, max: number): string {
  return text?.length > max ? text?.substring(0, max) + '...' : text
}

export function digits(value: string, allowTel?: boolean): string {
  return value.replace(allowTel ? /[^0-9+\-()\s]/g : /[^0-9.,]/g, '')
}

export type CopyProps = { disabled?: boolean; message?: string; onCopy?: (message: string) => void }
export async function Copy(text: string, props?: CopyProps) {
  const { disabled, message, onCopy } = props ?? {}
  if (disabled) return

  try {
    if (!navigator?.clipboard) throw new Error('Clipboard API not available in this context')

    await navigator.clipboard.writeText(text)
    onCopy?.(message ?? `"${text}" successfully copied to clipboard`)
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
  }
}

export function hasProps<T extends object>(element: ReactNode | T, keyToSearch: keyof T): element is T {
  return (
    typeof element === 'object' &&
    element !== null &&
    !Array.isArray(element) &&
    !isValidElement(element) &&
    keyToSearch in element
  )
}
