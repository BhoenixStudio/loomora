/**
 * Shared, dependency-free helpers for addressing sections of the configuration reference (`/usage`).
 * Used by the server-side config flattener and by component docs that link to their related configs.
 */

/** Top-level scalar keys that do not belong to a group; they are listed together under "General". */
export const GENERAL_CONFIG_KEYS = ['hasTranslationStrategy', 'flagResource', 'LinkType'] as const

/** Returns the section key (e.g. `button`, `form.textField`, `translations.dateField`, `general`) for a config path. */
export function configSectionKey(path: string): string {
  const parts = path.split('.')
  if ((GENERAL_CONFIG_KEYS as readonly string[]).includes(parts[0]) && parts.length === 1) return 'general'
  if ((parts[0] === 'form' || parts[0] === 'translations') && parts.length > 1) return parts.slice(0, 2).join('.')
  return parts[0]
}

/** DOM id of the configuration section that contains `path`. */
export function configSectionId(path: string): string {
  return `config-${configSectionKey(path).replaceAll('.', '-')}`
}

/** Link to the configuration reference section that contains `path`. */
export function configHref(path: string): string {
  return `/usage#${configSectionId(path)}`
}
