import { Dispatch, isValidElement, ReactNode, SetStateAction } from 'react'

export function fade(
  action: 'toggle' | 'in' | 'out',
  states: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>>; setShow?: Dispatch<SetStateAction<boolean>> },
  props?: { period?: number; closePeriod?: number }
) {
  const { open, setOpen, setShow } = states
  const { period = 100, closePeriod = 100 } = props ?? {}
  let timer: ReturnType<typeof setTimeout> | undefined

  // Functions
  const cancel = () => clearTimeout(timer)
  function fadeIn() {
    cancel()
    setShow?.(true)
    timer = setTimeout(() => setOpen(true), period)
  }
  function fadeOut() {
    cancel()
    setOpen(false)
    timer = setTimeout(() => setShow?.(false), closePeriod)
  }

  if (action === 'out') fadeOut()
  else if (action === 'in') fadeIn()
  else if (open === undefined) console.error('"open" parameter is required as boolean value!')
  else if (open) fadeOut()
  else fadeIn()

  return cancel
}

export function snip(text: string, max: number): string {
  return text?.length > max ? text?.substring(0, max) + '...' : text
}

export function digits(value: string, allowTel?: boolean): string {
  return value.replace(allowTel ? /[^0-9+\-()\s]/g : /[^0-9.,]/g, '')
}

export type CopyProps = { disabled?: boolean; message?: string; onCopy?: (message: string) => void }
export async function copy(text: string, props?: CopyProps): Promise<boolean> {
  const { disabled, message, onCopy } = props ?? {}
  if (disabled) return false

  try {
    if (!navigator?.clipboard) throw new Error('Clipboard API not available in this context')

    await navigator.clipboard.writeText(text)
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }

  onCopy?.(message ?? `"${text}" successfully copied to clipboard`)
  return true
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
