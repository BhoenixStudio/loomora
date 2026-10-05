type ClassRule = { value: CXValue; condition: boolean | undefined; fallback?: CXValue }

export type CXValue = string | undefined | ClassRule | CXValue[]

export function cx(inputs: CXValue): string {
  const resolve = (val: CXValue): string => {
    if (!val) return ''

    if (typeof val === 'string') return val
    if (Array.isArray(val)) return val.map(resolve).filter(Boolean).join(' ')
    if (typeof val === 'object' && 'condition' in val) return val.condition ? resolve(val.value) : resolve(val.fallback)

    return ''
  }

  return resolve(inputs).replace(/\s+/g, ' ').trim()
}
