export type ConvertCase = 'NORMAL' | 'SMALL' | 'CAMEL' | 'SNAKE' | 'SCREAM' | 'PASCAL' | 'SLUG' | 'KEBAB'

export function UseCase(input: string, format: ConvertCase = 'NORMAL'): string {
  const words = input
    .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase to spaces
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // XMLData to XML Data
    .replace(/([a-zA-Z])(\d)/g, '$1 $2') // text1 to text 1
    .replace(/[^a-zA-Z0-9_-]/g, ' ') // Replace punctuation/special chars with spaces
    .trim()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase())

  // Functions
  function cap(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  switch (format) {
    case 'NORMAL':
      return words.map((w, i) => (i === 0 ? cap(w) : w)).join(' ')
    case 'SMALL':
      return words.join(' ')
    case 'CAMEL':
      return words.map((w, i) => (i === 0 ? w : cap(w))).join('')
    case 'PASCAL':
      return words.map(cap).join('')
    case 'SNAKE':
      return words.join('_')
    case 'SCREAM':
      return words.join('_').toUpperCase()
    case 'SLUG':
    case 'KEBAB':
      return words.join('-')
    default:
      return input
  }
}

export function IsValidSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
}
