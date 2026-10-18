import { loomoraDefaults } from '../../../src/config/defaults'
import { configSectionId, configSectionKey } from './config-ids'
import { describeConfig, sectionDescriptions, sectionTitles } from './config-descriptions'

/** One row of the configuration reference table. All fields are plain strings so rows can cross the server/client boundary. */
export type ConfigRow = {
  path: string
  type: string
  value: string
  /** Pretty-printed full value for collapsed objects / long values. */
  detail?: string
  description: string
}

export type ConfigSection = {
  key: string
  id: string
  title: string
  description: string
  rows: ConfigRow[]
}

/** Objects at these paths are shown as a single expandable row instead of one row per leaf. */
const COLLAPSED_PATHS = new Set([
  'button.colors',
  'button.corners',
  'button.sizes',
  'form.dateField.presets',
  'form.colorField.presets',
])
/** Objects with more direct keys than this are collapsed automatically (country / timezone lists, ...). */
const MAX_INLINE_KEYS = 25
const MAX_DETAIL_LENGTH = 4000

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Set)
}

function typeOf(value: unknown): string {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  if (value instanceof Set) return 'Set'
  return typeof value
}

function stringify(value: unknown, space?: number): string {
  const text = JSON.stringify(
    value,
    (_key, v) => {
      if (v instanceof Set) return [...v]
      if (typeof v === 'function') return '[function]'
      return v
    },
    space
  )
  return text ?? 'undefined'
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}…` : text
}

function previewOf(value: unknown): string {
  if (typeof value === 'function') return '() => …'
  if (value === undefined) return 'undefined'
  return truncate(stringify(value), 90)
}

function collect(path: string, value: unknown, rows: ConfigRow[]) {
  if (isPlainObject(value)) {
    const keys = Object.keys(value)
    if (keys.length === 0) {
      rows.push({ path, type: 'object', value: '{}', description: describeConfig(path) })
      return
    }
    if (COLLAPSED_PATHS.has(path) || keys.length > MAX_INLINE_KEYS) {
      rows.push({
        path,
        type: 'object',
        value: `{ ${keys.length} entries }`,
        detail: truncate(stringify(value, 2), MAX_DETAIL_LENGTH),
        description: describeConfig(path),
      })
      return
    }
    for (const key of keys) collect(`${path}.${key}`, value[key], rows)
    return
  }

  const long = Array.isArray(value) || value instanceof Set
  rows.push({
    path,
    type: typeOf(value),
    value: previewOf(value),
    detail: long ? truncate(stringify(value, 2), MAX_DETAIL_LENGTH) : undefined,
    description: describeConfig(path),
  })
}

/** Builds the configuration reference from the library defaults, grouped into sections. */
export function buildConfigSections(): ConfigSection[] {
  const rows: ConfigRow[] = []
  for (const [key, value] of Object.entries(loomoraDefaults)) collect(key, value, rows)

  const sections = new Map<string, ConfigSection>()
  for (const row of rows) {
    const key = configSectionKey(row.path)
    let section = sections.get(key)
    if (!section) {
      section = {
        key,
        id: configSectionId(row.path),
        title: sectionTitles[key] ?? key,
        description: sectionDescriptions[key] ?? '',
        rows: [],
      }
      sections.set(key, section)
    }
    section.rows.push(row)
  }
  return [...sections.values()]
}
