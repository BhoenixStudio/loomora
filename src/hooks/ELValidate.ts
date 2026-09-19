'use client'

import { ConsoleDebug } from './index'
import { DependencyList, Dispatch, ReactNode, SetStateAction, useMemo } from 'react'

/**
 * `ELValidate.ts` contains client-side validation result helpers.
 *
 * ## File overview
 *
 * This file exports the `ElVal` hook-like selector and the `FormError` side-effect
 * helper, together with the types that describe their inputs and results. `ElVal`
 * receives a caller-computed valid value and an ordered list of rules, then
 * returns either the valid value or the first matching rule's metadata and props.
 * `FormError` marks a form as submitted, shows an error toast, and can select a
 * tab. The file is responsible for selecting and shaping these results; it does
 * not calculate validation conditions, display `ElVal`'s `toastMessage`, or
 * perform schema validation.
 *
 * ## When to use
 *
 * Use `ElVal` inside a client component or custom hook when the caller already
 * knows the boolean conditions that represent validation failures and needs a
 * consistent valid/invalid result. Rules are ordered, so put the highest-priority
 * failure first. Use `FormError` from a submit or other event handler when an
 * error must also mark submission state and optionally move the user to a tab.
 *
 * Prefer `Validate` from `src/hooks/Validate.ts` when the requirement is to
 * validate typed field values, nested objects, or collections and collect field
 * error messages. `ElVal` does not inspect values or aggregate errors. If an
 * invalid result only needs to be rendered, handle its returned `title` and
 * `props` directly; `ElVal` does not automatically show its `toastMessage`.
 *
 * ## Developer guide
 *
 * This module has a `'use client'` directive and `ElVal` calls React's
 * `useMemo`, so treat `ElVal` like a hook: call it unconditionally from a client
 * component or another hook, not from a conditional branch or event callback.
 * The confirmed barrel import is `import { ElVal, FormError } from '@hooks'`;
 * `src/hooks/index.ts` re-exports this module and `tsconfig.json` defines the
 * `@hooks` alias.
 *
 * A typical `ElVal` flow is:
 *
 * 1. Pass the valid `title` and optional valid `props` as the first argument.
 * 2. Pass ordered `rules` as the second argument. Each rule supplies a boolean
 *    `condition` and may supply `title`, partial `props`, and `toastMessage`.
 * 3. Optionally pass `sharedRuleProps`; these props are applied to an invalid
 *    result before the matching rule's own props, so rule props win on conflicts.
 * 4. Read `isValid`, `props`, `title`, and the optional `toastMessage` from the
 *    result. No matching rule returns the valid argument with `isValid: true`;
 *    a matching rule returns `isValid: false`.
 * 5. If `debug` is true, the function logs the inputs and result through the
 *    existing `ConsoleDebug` helper. The debug flag does not display a toast.
 *
 * `FormError` accepts a required error string and optional React state setters.
 * Each invocation immediately calls `setSubmitted(true)` when supplied, calls
 * `toast.error(error)`, and calls `setTab(tab)` only when `tab` is truthy and a
 * setter is supplied. It returns `void`, so it should be invoked from an event
 * handler or another controlled side-effect boundary rather than as a render
 * expression. The inspected client layout provides a `ToastContainer`; this
 * helper itself does not configure one.
 *
 * ## AI agent guide
 *
 * - Preserve the `'use client'` directive, the exported names, generic
 *   signatures, and the `src/hooks/index.ts` barrel export.
 * - Preserve first-match rule selection, the valid-result shape, the invalid
 *   shallow merge order (`sharedRuleProps` followed by rule `props`), and the
 *   `isValid` values.
 * - Reuse `ConsoleDebug` for the existing `debug` behavior and `toast.error`
 *   for `FormError`; do not silently make `ElVal` display `toastMessage`.
 * - Check `src/hooks/index.ts`, `src/hooks/Consoles.ts`, and
 *   `src/components/Layouts/Client.tsx` before changing imports, debug output,
 *   or toast integration. No `ElVal` or `FormError` consumer outside this file
 *   was found in the inspected `src` tree.
 * - The file appears manually maintained and has no generated-file marker.
 *   Changes to rule precedence, memoization dependencies, returned props, or
 *   immediate side effects require confirmation because they change the public
 *   contract.
 * - Confirmed project checks relevant to this TypeScript file are
 *   `pnpm type:check`, `pnpm lint`, and `pnpm format:check` from `package.json`.
 *   No test files matching the inspected project test search were found.
 *
 * ## Usage examples
 *
 * ### Minimal `ElVal` example
 *
 * ```tsx
 * function useEmailValidation(email: string) {
 *   return ElVal<{ disabled: boolean }>(
 *     { title: 'Ready', props: { disabled: false } },
 *     {
 *       rules: [
 *         {
 *           condition: email.length === 0,
 *           title: 'Email is required',
 *           props: { disabled: true },
 *           toastMessage: 'Enter an email address',
 *         },
 *       ],
 *     }
 *   )
 * }
 * ```
 *
 * Illustrative example: the surrounding client component decides how to render
 * `title`, apply `props`, or pass `toastMessage` to an error handler. When
 * `email` is empty, the returned result is invalid and uses the rule props.
 * Otherwise, it returns the valid props and `isValid: true`.
 *
 * ### Shared invalid props and rule composition
 *
 * ```tsx
 * function useWizardValidation(isBlocked: boolean, currentTab: string) {
 *   return ElVal<{ disabled: boolean; tab: string }>(
 *     { title: 'Continue', props: { disabled: false, tab: currentTab } },
 *     {
 *       sharedRuleProps: { disabled: true },
 *       rules: [
 *         {
 *           condition: isBlocked,
 *           title: 'Complete the required fields',
 *           props: { tab: 'details' },
 *           toastMessage: 'Complete the required fields first',
 *         },
 *       ],
 *       debug: false,
 *     }
 *   )
 * }
 * ```
 *
 * Illustrative example: for an active rule, the result has `disabled: true`
 * from `sharedRuleProps` and `tab: 'details'` from the rule. With no active
 * rule, `sharedRuleProps` is not applied; the valid `props` are returned instead.
 *
 * ### Handling an invalid result
 *
 * ```tsx
 * function handleSubmitError(message: string) {
 *   FormError({ error: message, setSubmitted, tab: 'details', setTab })
 * }
 * ```
 *
 * Illustrative example: `setSubmitted` and `setTab` are assumed to be React
 * state setters in the surrounding client component. Calling this handler marks
 * the form submitted, shows `message`, and selects the `details` tab.
 *
 * ### First matching rule
 *
 * ```tsx
 * const result = ElVal(
 *   { title: 'Valid', props: { disabled: false } },
 *   {
 *     rules: [
 *       { condition: true, title: 'First failure', props: { disabled: true } },
 *       { condition: true, title: 'Second failure', props: { disabled: false } },
 *     ],
 *   }
 * )
 * // The first rule is selected; result.title is 'First failure'.
 * ```
 *
 * Illustrative example: place this call inside a client component or custom
 * hook. `rules.find` selects only the first truthy condition, so later matching
 * rules are ignored.
 *
 * ## Errors, edge cases, and limitations
 *
 * - `ElVal`'s TypeScript API requires `valid` and `rules`, although the runtime
 *   destructuring defaults a missing `rules` value to an empty array. The
 *   explicit empty-result guard is reached only when both `valid` and `rules`
 *   are falsy at runtime; it returns `{ isValid: false, props: {} }`.
 * - If no rule has a truthy `condition`, `ElVal` returns the `valid` argument
 *   with `isValid: true`. `sharedRuleProps` is ignored in this branch.
 * - If a rule matches, only the first match is used. Invalid props are merged
 *   shallowly, with rule `props` overriding duplicate keys from
 *   `sharedRuleProps`; nested objects are not deep-merged.
 * - The return type declares `props: T`, but invalid rule props are optional
 *   partial values at input time. Callers should ensure their rule and shared
 *   props together satisfy the runtime shape they consume.
 * - `toastMessage` is returned as metadata only. `ElVal` never calls
 *   `toast.error`; `FormError` is the export in this file that emits a toast.
 * - `ElVal` builds `useMemo` dependencies with `JSON.stringify`. The serialized
 *   rule dependency includes only each rule's `condition` and `toastMessage`,
 *   not its `title` or `props`; changing those omitted fields while the
 *   serialized dependencies stay the same can leave a memoized result stale.
 *   Serialization is not caught, and values that serialize identically do not
 *   invalidate the memo.
 * - `debug` logs `valid`, `rules`, `sharedRuleProps`, and the result through
 *   `ConsoleDebug` without redaction. Do not pass secrets or sensitive values
 *   when debugging.
 * - `FormError` does not validate or normalize `error`, does not catch toast or
 *   state-setter failures, and performs its side effects on every invocation.
 *   A numeric `tab` value of `0` or an empty-string tab is falsy and therefore
 *   does not call `setTab`.
 * - This module has no loading, retry, network, persistence, authentication, or
 *   schema-validation behavior. Toast visibility depends on the application's
 *   `react-toastify` setup outside this file.
 *
 * ## Related references
 *
 * - `src/hooks/index.ts` re-exports `ElVal`, `FormError`, and their types for
 *   the `@hooks` import path.
 * - `src/hooks/Consoles.ts` defines the `ConsoleDebug` helper used by `ElVal`.
 * - `src/hooks/Validate.ts` is the inspected value/schema validation helper to
 *   prefer when field-level validation and error aggregation are required.
 * - `src/components/Layouts/Client.tsx` mounts the inspected
 *   `react-toastify` `ToastContainer` used by the client layout.
 * - `tsconfig.json` confirms the `@hooks` path alias.
 * - `instructions/code-rules.md` supplies the verified TypeScript and comment
 *   conventions applied here.
 * - `package.json` confirms the available type-check, lint, and formatting
 *   commands and the `react-toastify` dependency.
 */

/**
 * One ordered validation rule consumed by `ElVal`.
 *
 * `condition` is evaluated by the caller. When it is the first truthy condition
 * in the `rules` array, the rule's `title`, `props`, and `toastMessage` become
 * the invalid result metadata. `props` is partial because it is merged with
 * `sharedRuleProps`.
 */
export interface ElValItem<T> {
  /** Optional renderable title or message associated with this rule. */
  title?: ReactNode | ReactNode[]
  /** Optional props contributed by this rule when it is selected. */
  props?: Partial<T>
  /** Caller-computed flag indicating whether this rule is active. */
  condition: boolean
  /** Optional message returned as metadata; it is not toasted by `ElVal`. */
  toastMessage?: string
}

/**
 * Configuration accepted by `ElVal`.
 *
 * `rules` are evaluated in array order. `sharedRuleProps` is used only for an
 * invalid result, and `debug` enables one `ConsoleDebug` call per invocation.
 */
export interface ElValProps<T> {
  /** Props included in every invalid result before the selected rule's props. */
  sharedRuleProps?: Partial<ElValItem<T>['props']>
  /** Ordered rules; the first rule whose `condition` is truthy wins. */
  rules: ElValItem<T>[]
  /** Enables debug logging of inputs and the computed result. */
  debug?: boolean
}

/**
 * Result returned by `ElVal`.
 *
 * `isValid` is always present. `props` is statically typed as `T`; `title` and
 * `toastMessage` are optional because the valid and invalid branches do not
 * guarantee the same metadata fields.
 */
export type ElValReturn<T> = Partial<Omit<ElValItem<T>, 'condition' | 'props'>> & { props: T; isValid: boolean }

/**
 * Selects the valid value or the first active validation rule.
 *
 * This function uses `useMemo` and must be called from a client component or
 * custom hook in a stable, unconditional position. It does not evaluate the
 * meaning of a condition; it selects the first rule whose `condition` is true.
 *
 * @param valid Valid-branch metadata and props returned when no rule matches.
 * @param props Rule configuration, optional shared invalid props, and debug flag.
 * @returns The valid argument with `isValid: true`, or the selected rule's
 *   metadata with shallowly merged invalid props and `isValid: false`.
 */
export function ElVal<T = unknown>(valid: Pick<ElValItem<T>, 'title' | 'props'>, props: ElValProps<T>): ElValReturn<T> {
  const { sharedRuleProps = {}, rules = [], debug = false } = props

  const strProps = JSON.stringify(rules?.map(({ condition, toastMessage }) => ({ condition, toastMessage })))
  const strSharedRuleProps = JSON.stringify(sharedRuleProps)
  const strValid = JSON.stringify(valid)
  const deps: DependencyList = [strValid, strProps, strSharedRuleProps]

  const sRule = useMemo(() => {
    if (!valid && !rules) return { isValid: false, props: {} as T }

    const {
      title,
      props,
      toastMessage,
      condition: ruleFound,
    } = rules.find(({ condition }) => condition) ?? ({} as ElValItem<T>)

    if (!ruleFound) return { ...valid, isValid: true }
    return { title, props: { ...sharedRuleProps, ...props }, toastMessage, isValid: false }
  }, deps)

  if (debug) ConsoleDebug('ELValidate', { valid, rules, sharedRuleProps, result: sRule })

  return sRule as ElValReturn<T>
}

/**
 * Inputs for `FormError`.
 *
 * The setters are optional. `tab` is applied only when it is truthy, so valid
 * string or number values such as `''` and `0` do not trigger `setTab`.
 */
export type FormErrorProps<T extends string | number = string> = {
  setSubmitted?: Dispatch<SetStateAction<boolean>>
  error: string
  tab?: T
  setTab?: Dispatch<SetStateAction<T>>
}

/**
 * Documentation metadata:
 * - Last documentation update: 2026-09-18
 * - Documentation audience: Developers and AI agents
 * - Evidence basis: Attached file + verified project context
 * - Documentation coverage: Complete
 * - Validation: Passed `pnpm exec prettier --check src/hooks/ELValidate.ts`,
 *   `pnpm exec eslint src/hooks/ELValidate.ts`, `pnpm type:check`, and
 *   `git diff --check -- src/hooks/ELValidate.ts`.
 * - Known limitations: `ElVal` uses a partial serialized dependency projection
 *   for rules, so changes to a rule's title or props can be missed by `useMemo`.
 */
