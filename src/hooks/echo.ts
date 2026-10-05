/* eslint-disable @typescript-eslint/no-explicit-any */

export type EchoItem = string | { label: string; color: string }
export type EchoOptions = { style?: string }

export function echo(items: EchoItem | EchoItem[], data?: any, options: EchoOptions = {}) {
  const isServer = typeof window === 'undefined'

  const { style = 'color: white; font-size: 10px; font-weight: 500; padding: 2px 6px; border-radius: 2px;' } = options

  const arrayItems = Array.isArray(items) ? items : [items]

  if (isServer) {
    const text = arrayItems.map((item) => (typeof item === 'string' ? `[${item}]` : `[${item.label}]`)).join(' ')
    if (data !== undefined) console.log(text, data)
    else console.log(text)

    return
  }

  const formats = arrayItems.map((item) => {
    const label = typeof item === 'string' ? item : item.label
    return `%c${label}`
  })

  const styles = arrayItems.map((item, i) => {
    const bg = typeof item === 'string' ? '#303f4a' : item.color
    const margin = i < arrayItems.length - 1 ? 'margin-right: 4px;' : ''
    return `background: ${bg}; ${style} ${margin}`
  })

  if (data !== undefined) console.log(formats.join(''), ...styles, data)
  else console.log(formats.join(''), ...styles)
}
