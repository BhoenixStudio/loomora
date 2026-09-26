/**
 * @fileoverview CSS class name utility functions for conditional styling.
 *
 * File overview:
 * - Role: manually maintained TypeScript utility module for class name composition.
 * - Responsibility: normalize class name strings and resolve conditional entries
 *   with optional fallbacks into one string.
 * - Boundary: this module does not render components, deduplicate class tokens,
 *   resolve style conflicts, or provide a variadic/object-map API like some
 *   class name libraries.
 *
 * When to use:
 * - Use `cn` when a component combines fixed classes, optional `className`
 *   values, or conditional classes. This is the pattern used by components such
 *   as `Button` and `Tabs` in this project.
 * - Prefer a direct class string when no conditional composition is needed.
 * - Although this file is under `src/hooks`, `cn` is a utility function, not a
 *   React hook. It does not require a provider or a client component.
 *
 * Developer guide:
 * 1. Import `cn` from `@hooks` (the barrel re-exports this module) or from this
 *    module's direct path.
 * 2. Pass one string, `undefined`, or an array containing class strings and
 *    conditional entries. Conditional `value` and `fallback` fields may use
 *    the same supported shapes recursively.
 * 3. Assign the returned string to a `className` prop or another CSS class
 *    consumer.
 *
 * Side effects and runtime:
 * - Confirmed: the implementation is synchronous and has no React, browser,
 *   network, persistence, authentication, or logging side effects.
 * - The output only normalizes whitespace; it does not remove repeated class
 *   names or determine which CSS utility should win.
 *
 * AI agent guide:
 * - Preserve the single-input `cn(inputs): string` contract and the recursive
 *   conditional `value`/`fallback` behavior.
 * - Reuse `cn` instead of creating component-specific class concatenation for
 *   the same conditional pattern.
 * - Keep conditional objects inside an array passed to `cn`; the current
 *   runtime assumes every non-string input is array-like and calls `.map`.
 * - This file appears manually maintained; no generated or machine-managed
 *   marker was observed.
 * - Check `src/hooks/index.ts` and existing consumers before changing the
 *   exported type or normalization behavior. Run the project type check and
 *   relevant lint/format checks after source changes.
 *
 * Related references inspected:
 * - `src/hooks/index.ts` re-exports `cn` and `CNType` through `@hooks`.
 * - `src/components/UI/Button/index.tsx` shows production composition with
 *   fixed classes, conditional entries, fallbacks, and a custom class name.
 * - `src/components/Partials/Tabs.tsx` shows conditional directional classes
 *   and conditional animation classes.
 * - `instructions/code-rules.md` and `package.json` provide applicable TypeScript
 *   style and validation commands.
 */

/**
 * Internal shape for one conditional class entry.
 *
 * When `condition` is truthy, `value` is evaluated. Otherwise, `fallback` is
 * evaluated; an omitted fallback contributes no class. Both branches accept
 * `CNType`, so nested conditional entries are supported.
 *
 * Runtime guidance: put this object inside an array passed to `cn`. The public
 * `CNType` alias exposes the object shape structurally, but the implementation's
 * non-string branch expects an array and calls `.map`.
 *
 * @interface ConditionalClass
 */
type ConditionalClass = string | undefined | { value: CNType; condition: boolean; fallback?: CNType }

/**
 * Type-level input shape for the `cn` function.
 *
 * Normal runtime usage is a string, `undefined`, or an array of strings,
 * `undefined` values, and conditional class objects. Conditional `value` and
 * `fallback` fields can contain another supported `CNType` value.
 *
 * Important limitation: because `ConditionalClass` is part of this alias, a
 * direct conditional object is representable at the type level. `cn` does not
 * safely process that direct object at runtime; wrap it in an array instead.
 *
 * @example
 * ```typescript
 * const isActive = true
 * const classes: CNType = [
 *   'btn',
 *   { value: 'btn-active', condition: isActive },
 * ]
 * ```
 */
export type CNType = string | undefined | ConditionalClass | ConditionalClass[]

/**
 * Combines one class name input into a normalized, space-separated string.
 *
 * Confirmed behavior:
 * - A direct non-empty string is trimmed and repeated whitespace is collapsed.
 * - An array evaluates each string or conditional object, omits falsy entries,
 *   and applies `fallback` when a condition is false.
 * - Missing or `undefined` fallbacks contribute an empty string.
 * - Conditional `value` and `fallback` values are evaluated recursively.
 * - Repeated class tokens are preserved; only whitespace is normalized.
 *
 * The function accepts exactly one input. It is not a variadic class name
 * helper, and it does not support object-map syntax such as `{ active: true }`.
 * For normal runtime safety, pass conditional objects inside an array even
 * though the `CNType` alias also exposes the object shape directly.
 *
 * @param inputs - The class name input to process.
 * @returns A trimmed, space-separated string of CSS class names. Empty or
 *   unsupported empty branches return `''`.
 *
 * @example Minimal example:
 * ```typescript
 * cn('btn') // => 'btn'
 * cn(['btn', 'primary']) // => 'btn primary'
 * ```
 *
 * @example Practical conditional composition:
 * ```typescript
 * const isActive = true
 * const isLarge = false
 * const className: string | undefined = undefined
 *
 * cn([
 *   'btn',
 *   { value: 'btn-active', condition: isActive },
 *   { value: 'btn-large', fallback: 'btn-small', condition: isLarge },
 *   className,
 * ])
 * // => 'btn btn-active btn-small'
 * ```
 *
 * @example Nested conditional values:
 * ```typescript
 * const isEnabled = true
 * const isDark = false
 *
 * cn([
 *   'btn',
 *   {
 *     value: { value: 'btn-primary', condition: isDark, fallback: 'btn-light' },
 *     condition: isEnabled,
 *     fallback: 'btn-disabled',
 *   },
 * ])
 * // => 'btn btn-light'
 * ```
 *
 * @example Illustrative component usage:
 * ```typescript
 * import { cn } from '@hooks'
 *
 * const buttonClasses = cn([
 *   'btn',
 *   { value: 'btn-primary', fallback: 'btn-secondary', condition: isPrimary },
 *   { value: 'btn-disabled', condition: isDisabled },
 *   customClassName,
 * ])
 * ```
 * The surrounding component must provide `isPrimary`, `isDisabled`, and
 * `customClassName`; these names are illustrative local values, not exports of
 * this module.
 *
 * @example Edge case:
 * ```typescript
 * cn([{ value: 'btn-active', condition: false }]) // => ''
 * cn([{ value: 'btn-active', fallback: 'btn-idle', condition: false }])
 * // => 'btn-idle'
 * ```
 *
 * Errors and limitations:
 * - Passing a truthy non-string, non-array value is outside the supported
 *   runtime contract and can fail when the implementation calls `.map`.
 * - The function does not validate whether a class token is valid CSS syntax.
 * - It does not deduplicate tokens or resolve framework-specific class
 *   precedence; consumers remain responsible for those concerns.
 */
export function cn(inputs: CNType): string {
  if (!inputs) return ''

  if (typeof inputs === 'string' && inputs) return inputs.replaceAll(/\s+/g, ' ').trim()

  const filtered = (inputs as ConditionalClass[]).map((c) => {
    let value: string = ''

    if (!c) return value
    else if (typeof c === 'string') value = c?.trim()
    else value = c.condition ? cn(isArray(c.value)) : cn(isArray(c.fallback))

    return value
  })

  function isArray(value: CNType) {
    return Array.isArray(value) ? value : [value]
  }

  return filtered.filter(Boolean).join(' ').replaceAll(/\s+/g, ' ').trim()
}

/**
 * Documentation metadata
 * - Last documentation update: 2026-09-18
 * - Documentation audience: Developers and AI agents
 * - Evidence basis: Attached file + verified project context
 * - Documentation coverage: Complete
 * - Validation: Passed `pnpm exec prettier --check src/hooks/classNames.ts`,
 *   `pnpm exec eslint src/hooks/classNames.ts`, and `pnpm type:check`.
 * - Known limitations: Direct conditional objects are type-level but not safe
 *   runtime inputs; class tokens are not deduplicated.
 */
