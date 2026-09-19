/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

/**
 * `Consoles.ts` contains the project's small, styled console-debugging utility.
 *
 * ## File overview
 *
 * This file exports the `ConsoleTitle` and `ConsoleProps` input types and the
 * `ConsoleDebug` function. The function writes one `console.log` entry with
 * one or more CSS-styled title badges followed by an optional data value.
 * It is responsible for building the console format and does not provide
 * persistence, filtering, error handling, redaction, or a logging transport.
 *
 * ## When to use
 *
 * Use `ConsoleDebug` for temporary or development-oriented diagnostics where
 * a readable label and structured value are useful, such as the existing
 * `AuthGuard`, validation, and query debugging calls. Use a direct
 * `console.*` call when CSS badges are not useful, and use a dedicated logging
 * abstraction when output needs filtering, persistence, transport, or
 * production-safe redaction.
 *
 * ## Developer guide
 *
 * Import the named export from the hooks barrel when the `@hooks` alias is
 * available, or import it directly from `src/hooks/Consoles`. Call
 * `ConsoleDebug(titles, data?, props?)`:
 *
 * No provider, React hook invocation, or extra configuration is required; the
 * only runtime prerequisite is an environment that provides `console.log`.
 *
 * - `titles` is one string or an array of strings and colored title objects.
 *   String titles use `#303f4a`; object titles use their `color` value.
 * - `data` is optional and is passed to `console.log` as the final argument.
 * - `props.badgeStyle` is an optional CSS declaration string. When omitted,
 *   it uses the default white, 10px, medium-weight badge with 2px by 6px
 *   padding and a 2px border radius. A supplied value replaces that default.
 *
 * The function creates a `%c` placeholder for every title and a matching
 * style string for every placeholder. The first title also receives a
 * `margin-right: 5px` declaration. It then performs one `console.log` call;
 * there is no loading, success, retry, or error state.
 *
 * A typical usage flow is: import the named export, prepare a diagnostic
 * value, optionally choose one or more title colors, and call `ConsoleDebug`
 * only at the diagnostic point that should be visible in the console.
 *
 * ## AI agent guide
 *
 * - Preserve the public names and signatures of `ConsoleTitle`, `ConsoleProps`,
 *   and `ConsoleDebug`; they are re-exported by `src/hooks/index.ts`.
 * - Reuse `ConsoleDebug` rather than duplicating its `%c` badge construction
 *   in callers. Safe extension points are additional documentation or a
 *   deliberately expanded, typed option only when its console behavior is
 *   specified and existing calls remain valid.
 * - Preserve the one-log-call behavior, title order, default string-title
 *   color, first-title spacing, and pass-through data semantics.
 * - Check the direct consumers in `src/components/AuthGuard.tsx`,
 *   `src/hooks/ELValidate.ts`, and `src/@api/UseQuery` before changing output
 *   formatting or the public contract.
 * - The file appears manually maintained; it has no generated-file marker.
 *   Confirm public API or output-format changes before making them because
 *   callers use the current badge and data conventions.
 * - Confirmed project checks for relevant changes are `pnpm type:check`,
 *   `pnpm lint`, and `pnpm format:check` from `package.json`.
 *
 * ## Usage examples
 *
 * ### Minimal example
 *
 * ```ts
 * import { ConsoleDebug } from '@hooks'
 *
 * ConsoleDebug('ELValidate', { valid, rules, sharedRuleProps, result: sRule })
 * ```
 *
 * This matches the observed validation call; `valid`, `rules`,
 * `sharedRuleProps`, and `sRule` are values from that caller's scope.
 *
 * ### Multiple styled titles
 *
 * ```ts
 * ConsoleDebug(['UseQuery', { title: 'Debug', color: '#4a3030' }, as], fetchDebug)
 * ```
 *
 * This matches the observed query-debug composition: each title becomes a
 * badge, and `fetchDebug` is logged after the title styles are applied.
 *
 * ## Errors, edge cases, and limitations
 *
 * - TypeScript constrains colored title values to strings beginning with `#`,
 *   but the function performs no runtime validation of titles, colors, CSS, or
 *   data.
 * - An empty title array is accepted and still results in one `console.log`
 *   call, with no title placeholders or title styles.
 * - `data` may be omitted; the current implementation still passes its value
 *   to `console.log`, so the final logged argument can be `undefined`.
 * - `badgeStyle` is inserted into each style string and is not merged with the
 *   default when provided. Callers are responsible for supplying valid CSS.
 * - The helper has no client/server directive and no console fallback. Its
 *   runtime behavior therefore depends on the caller's environment providing
 *   `console.log`; it does not redact sensitive data before logging.
 *
 * ## Related references
 *
 * - `src/hooks/index.ts` re-exports this file for the `@hooks` import path.
 * - `src/components/AuthGuard.tsx` uses a string title and an object payload.
 * - `src/hooks/ELValidate.ts` uses the minimal single-title form.
 * - `src/@api/UseQuery/useServerQuery.ts`, `useQuery.ts`, and `useLazyQuery.ts`
 *   use multiple titles and query-debug payloads.
 * - `instructions/code-rules.md` is the verified TypeScript/commenting context.
 * - `package.json` confirms the available type, lint, and formatting commands.
 */

/**
 * A title rendered as one styled console badge.
 *
 * Strings use the default `#303f4a` background. Object titles provide their
 * own `#`-prefixed color; the type does not validate whether that value is a
 * browser-supported color.
 */
export type ConsoleTitle = string | { title: string; color: `#${string}` }

/**
 * Optional styling applied to every console title badge.
 *
 * `badgeStyle` is a CSS declaration string appended after the generated
 * background declaration. When omitted, the function uses
 * `color: white; font-size: 10px; font-weight: 500; padding: 2px 6px; border-radius: 2px;`.
 */
export type ConsoleProps = { badgeStyle?: string }

/**
 * Logs a single debug entry with CSS-styled title badges.
 *
 * The number and order of `%c` placeholders match the supplied titles. The
 * first title gets an additional 5px right margin, and `data` is forwarded as
 * the final `console.log` argument. This function returns `void` and does not
 * catch console errors or transform the data value.
 *
 * @param titles One title or an ordered list of titles to display.
 * @param data Optional value written after the title placeholders and styles.
 * @param props Optional badge CSS configuration.
 * @returns `void`.
 */
export function ConsoleDebug(titles: ConsoleTitle | ConsoleTitle[], data?: any, props: ConsoleProps = {}) {
  const { badgeStyle = 'color: white; font-size: 10px; font-weight: 500; padding: 2px 6px; border-radius: 2px;' } =
    props

  const arrayTitles = Array.isArray(titles) ? titles : [titles]
  const badges = arrayTitles.map((title) => {
    const main = typeof title === 'string' ? title : title.title
    return `%c${main}`
  })
  const styles = arrayTitles.map((title, i: number) => {
    const color = typeof title === 'string' ? '#303f4a' : title.color
    return `background: ${color}; ${badgeStyle} ${i === 0 ? 'margin-right: 5px;' : ''}`
  })

  console.log(`${badges.join('')}`, ...styles, data)
}

/**
 * Documentation metadata:
 * - Last documentation update: 2026-09-18
 * - Documentation audience: Developers and AI agents
 * - Evidence basis: Attached file + verified project context
 * - Documentation coverage: Complete
 * - Validation: Passed `pnpm type:check`, `pnpm exec eslint src/hooks/Consoles.ts`,
 *   `pnpm exec prettier --check src/hooks/Consoles.ts`, and `git diff --check`.
 * - Known limitations: No runtime input validation; output is console-only.
 */
