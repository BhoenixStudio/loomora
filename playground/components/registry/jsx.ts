/** Small helpers that turn plain prop objects into JSX / TypeScript snippets for the "how to call" box. */

export type Raw = { __raw: string }

/** Marks a string as literal code that must be emitted as-is. */
export function raw(code: string): Raw {
  return { __raw: code }
}

function isRaw(value: unknown): value is Raw {
  return typeof value === 'object' && value !== null && '__raw' in value
}

/** Formats a value as a TypeScript expression (single-quoted strings, unquoted keys). */
export function formatValue(value: unknown): string {
  if (isRaw(value)) return value.__raw
  if (typeof value === 'string') return `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (Array.isArray(value)) return `[${value.map(formatValue).join(', ')}]`
  if (typeof value === 'object') {
    const entries = Object.entries(value).filter(([, v]) => v !== undefined)
    if (entries.length === 0) return '{}'
    return `{ ${entries.map(([k, v]) => `${k}: ${formatValue(v)}`).join(', ')} }`
  }
  return String(value)
}

function formatAttribute(name: string, value: unknown): string {
  if (value === true) return name
  if (typeof value === 'string') return `${name}="${value.replaceAll('"', '&quot;')}"`
  return `${name}={${formatValue(value)}}`
}

const MAX_LINE = 80

/** Builds a JSX element. Props whose value is `undefined` are skipped. */
export function toJsx(name: string, props: Record<string, unknown>, children?: string): string {
  const attrs = Object.entries(props)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => formatAttribute(key, value))

  const oneLine = [name, ...attrs].join(' ')
  const open = oneLine.length + 2 <= MAX_LINE ? `<${oneLine}` : `<${name}\n${attrs.map((a) => `  ${a}`).join('\n')}\n`

  if (children === undefined) return `${open}${open.endsWith('\n') ? '' : ' '}/>`
  const indented = children
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n')
  return `${open}>\n${indented}\n</${name}>`
}
