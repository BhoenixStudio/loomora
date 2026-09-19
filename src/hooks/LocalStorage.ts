/**
 * LocalStorage.ts
 *
 * File overview
 * -------------
 * Provides small, synchronous wrappers around the browser `localStorage` API.
 * The module reads, writes, and removes one key at a time, with optional JSON
 * serialization and an SSR-safe browser check. It does not manage React state,
 * subscribe to storage changes, validate schemas, expire values, or encrypt data.
 *
 * When to use
 * -----------
 * Use these utilities when a component or context needs a direct local-storage
 * read/write/remove operation, such as persisting the selected theme. Prefer a
 * state or context abstraction when the UI must react automatically to storage
 * changes; these functions do not trigger re-renders or provide subscriptions.
 *
 * Developer guide
 * ---------------
 * This project re-exports the functions from `@hooks` through
 * `src/hooks/index.ts`; the direct source module is `src/hooks/LocalStorage.ts`.
 *
 * 1. Choose a stable storage key.
 * 2. Read with `UseLocalStorage`, optionally providing `defaultValue`.
 * 3. Use the same `isJson` setting when writing and reading structured values.
 * 4. Call `RemoveLocalStorage` when the key should be deleted.
 *
 * `isJson` defaults to `false`. In that mode, reads return the stored string
 * and writes use `String(value)`. Set it to `true` for JSON-compatible values;
 * the value is then passed through `JSON.stringify` on write and `JSON.parse`
 * on read. The option is not stored with the value, so callers must keep the
 * setting consistent for a given key.
 *
 * Usage examples
 * --------------
 * Minimal string example:
 *
 * ```ts
 * import { AddLocalStorage, UseLocalStorage } from '@hooks'
 *
 * const theme = UseLocalStorage<'LIGHT' | 'DARK'>('theme', { defaultValue: 'LIGHT' })
 * AddLocalStorage('theme', 'DARK')
 * ```
 *
 * JSON object example:
 *
 * ```ts
 * type DynamicTimeRange = { start: string; end: string }
 *
 * const range = UseLocalStorage<DynamicTimeRange>('theme-dynamic-range', {
 *   isJson: true,
 *   defaultValue: { start: '06:00', end: '18:00' },
 * })
 *
 * AddLocalStorage('theme-dynamic-range', { start: '07:00', end: '19:00' }, { isJson: true })
 * ```
 *
 * To delete the value, call `RemoveLocalStorage('theme')`.
 * These examples use the exports, keys, and theme values verified in this
 * module and its inspected `Theme.tsx` consumer.
 *
 * Errors, edge cases, and limitations
 * ------------------------------------
 * - When `window` is unavailable, `UseLocalStorage` returns `defaultValue`
 *   (or `undefined` when no default is supplied); the write and remove helpers
 *   return without doing anything.
 * - A missing key produces `null` from `getItem`; `UseLocalStorage` returns
 *   `defaultValue` for that result. A parsed JSON `null` also falls back because
 *   the final result uses nullish coalescing.
 * - `UseLocalStorage` does not catch invalid JSON. With `isJson: true`, invalid
 *   stored text can make `JSON.parse` throw; storage access errors also propagate.
 * - `AddLocalStorage` does not catch serialization or storage errors. Without
 *   `isJson: true`, objects are converted with `String(value)` rather than
 *   stored as structured data.
 * - The generic type parameter is compile-time guidance only; stored strings
 *   and parsed JSON are not runtime-validated against `T`.
 * - The inspected `Theme.tsx` consumer writes the `theme-dynamic-range` object
 *   without `isJson: true`. That observed call uses the helper's string mode and
 *   should be reviewed before relying on structured persistence; this file does
 *   not change that existing behavior.
 *
 * AI agent guide
 * --------------
 * - Preserve the three exported names, their parameter order, the `isJson`
 *   default of `false`, the server-side guards, and the nullish fallback.
 * - Reuse these wrappers for local-storage access instead of bypassing them when
 *   modifying a known consumer. Check `src/hooks/index.ts` and `src/contexts/Theme.tsx`
 *   before changing a key or serialization mode.
 * - Safe extensions should preserve the existing raw-string and JSON modes and
 *   explicitly document any new persistence semantics. Do not add React state
 *   or side effects that would change the synchronous contract without approval.
 * - This is a manually maintained source file, not generated output. Behavioral
 *   changes, including correcting existing object serialization, require review
 *   of affected consumers and confirmation before implementation.
 * - The project exposes `pnpm type:check` and `pnpm lint`; no test script is
 *   declared in the inspected `package.json`.
 *
 * Related references
 * ------------------
 * - `src/hooks/index.ts` - barrel export for this module.
 * - `src/contexts/Theme.tsx` - inspected direct consumer and theme persistence.
 * - `tsconfig.json` - confirms the `@hooks` path alias.
 * - `package.json` - confirms available validation scripts and no test script.
 * - `instructions/code-rules.md` - applicable TypeScript project rules.
 */
/**
 * Reads one value from browser local storage.
 *
 * @typeParam T - Expected application type; the stored value is not runtime-validated against it.
 * @param key - Storage key passed to `localStorage.getItem`.
 * @param props - Optional read settings and fallback value.
 * @param props.isJson - When `true`, parse stored text with `JSON.parse`; defaults to `false`.
 * @param props.defaultValue - Value returned when the result is `null` or when `window` is unavailable.
 * @returns The stored string, parsed JSON value, or `defaultValue` when the result is nullish.
 * @remarks Storage and JSON parsing errors are not caught by this helper.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function UseLocalStorage<T = any>(key: string, props?: { isJson?: boolean; defaultValue?: T }): T {
  const { defaultValue, isJson = false } = props ?? {}

  if (typeof window === 'undefined') return defaultValue as T

  const value = window.localStorage.getItem(key)
  const result = isJson ? (JSON.parse(String(value)) as T) : (value as unknown as T)

  return result ?? (defaultValue as T)
}

/**
 * Writes one value to browser local storage.
 *
 * @typeParam T - Compile-time type of `value`; it does not validate persisted data.
 * @param key - Storage key passed to `localStorage.setItem`.
 * @param value - Value to persist. It is stringified with `String` by default.
 * @param props - Optional write settings.
 * @param props.isJson - When `true`, serialize `value` with `JSON.stringify`; defaults to `false`.
 * @returns Nothing. In a server environment, the function exits without writing.
 * @remarks Storage and JSON serialization errors are not caught by this helper.
 */
export function AddLocalStorage<T = string>(key: string, value: T, props?: { isJson?: boolean }): void {
  const { isJson = false } = props ?? {}

  if (typeof window === 'undefined') return

  const data = isJson ? JSON.stringify(value) : String(value)
  window.localStorage.setItem(key, data)
}

/**
 * Removes one key from browser local storage.
 *
 * @param key - Storage key passed to `localStorage.removeItem`.
 * @returns Nothing. In a server environment, the function exits without removing anything.
 * @remarks Storage access errors are not caught by this helper.
 */
export function RemoveLocalStorage(key: string): void {
  if (typeof window === 'undefined') return

  window.localStorage.removeItem(key)
}

/**
 * Documentation metadata
 * ----------------------
 * Last documentation update: 2026-09-18
 * Documentation audience: Developers and AI agents
 * Evidence basis: Attached file + verified project context
 * Documentation coverage: Complete; public APIs, usage, limitations, and inspected references are covered.
 * Validation:
 * - `pnpm exec eslint src/hooks/LocalStorage.ts` passed.
 * - `pnpm exec prettier --check src/hooks/LocalStorage.ts` passed with a non-blocking Node module-type warning.
 * - `pnpm type:check` passed.
 * Known limitations: The inspected theme consumer omits `isJson` for an object value; storage and JSON errors propagate.
 */
