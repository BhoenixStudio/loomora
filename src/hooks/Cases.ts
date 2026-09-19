/**
 * # Cases.ts
 *
 * ## File overview
 *
 * This manually maintained utility module converts strings between common word
 * cases and checks whether a value is an ASCII lowercase slug. It is
 * responsible only for deterministic string transformation and validation; it
 * does not perform I/O, persistence, localization, or network requests.
 *
 * ## When to use
 *
 * - Use `UseConvertCase` when a known string must be displayed or stored in
 *   one of the supported case formats.
 * - Use `CheckSlug` when an already-produced value must be checked against the
 *   module's lowercase, hyphen-separated slug format.
 * - Prefer a locale-aware or Unicode-aware text utility when punctuation,
 *   non-ASCII letters, or language-specific word boundaries must be preserved;
 *   this module lowercases words and `CheckSlug` accepts only `[a-z0-9]`.
 *
 * ## Developer guide
 *
 * Import the public exports from `@hooks` (the project alias configured in
 * `tsconfig.json`) or directly from `src/hooks/Cases`. A caller supplies a
 * string to `UseConvertCase` and may omit `caseType` to use `NORMAL`. The
 * `ConvertCaseType` union lists every accepted case name. `CheckSlug` accepts a
 * string and returns a boolean without changing the input.
 *
 * `UseConvertCase` first trims the input, splits on whitespace, `_`, `-`, and
 * lower-to-upper camel-case boundaries, removes empty words, and lowercases
 * each word. It then joins or capitalizes those words according to the chosen
 * case. Punctuation is not a word separator. `SLUG` additionally removes
 * every character outside `a-z` and `0-9` from each word before joining with
 * hyphens.
 *
 * Supported outputs are:
 *
 * | Case | Output shape |
 * | --- | --- |
 * | `NORMAL` | First word capitalized, remaining words separated by spaces |
 * | `SMALL` | Lowercase words separated by spaces |
 * | `CAMEL` | Lowercase first word, subsequent words capitalized and joined |
 * | `SNAKE` | Lowercase words joined with `_` |
 * | `SCREAM` | Uppercase words joined with `_` |
 * | `PASCAL` | Every word capitalized and joined |
 * | `SLUG` | ASCII-alphanumeric words joined with `-` |
 * | `KEBAB` | Lowercase words joined with `-` |
 *
 * A typical flow is: normalize a source label with `UseConvertCase`, then
 * validate the resulting value with `CheckSlug` when the output is intended to
 * be used as a slug.
 *
 * ## AI agent guide
 *
 * Preserve the exported names, the `ConvertCaseType` members, the default
 * `NORMAL` behavior, and the exact `CheckSlug` acceptance rule. Reuse these
 * functions rather than duplicating case conversion or slug validation in a
 * consumer. If adding a case, update both the union and the lookup object and
 * inspect the `src/hooks/index.ts` barrel and all consumers before changing
 * the public output. Changes to separators, punctuation handling, or the slug
 * regular expression require explicit review because they change existing
 * results. This file has no generated marker and appears manually maintained.
 *
 * ## Usage examples
 *
 * Minimal example:
 *
 * ```ts
 * import { CheckSlug, UseConvertCase } from '@hooks'
 *
 * const slug = UseConvertCase('NizwaWaqf', 'SLUG') // 'nizwa-waqf'
 * const valid = CheckSlug(slug) // true
 * ```
 *
 * Practical example:
 *
 * ```ts
 * const title = UseConvertCase('waqf_project', 'NORMAL') // 'Waqf project'
 * const apiKey = UseConvertCase('waqf project', 'SNAKE') // 'waqf_project'
 * ```
 *
 * Edge-case example:
 *
 * ```ts
 * UseConvertCase('Hello, World!', 'SLUG') // 'hello-world'
 * CheckSlug('Hello-world') // false
 * CheckSlug('hello--world') // false
 * ```
 *
 * ## Errors, edge cases, and limitations
 *
 * - An empty string, whitespace-only string, or input containing only supported
 *   separators converts to an empty string. `CheckSlug` returns `false` for an
 *   empty string.
 * - `CheckSlug` does not normalize its input. It rejects uppercase letters,
 *   spaces, underscores, leading or trailing hyphens, consecutive hyphens,
 *   and non-ASCII characters.
 * - `SLUG` removes unsupported characters from each word and can therefore
 *   produce an empty result or join characters that were separated by
 *   punctuation. Other case modes retain punctuation present in a word.
 * - `caseType` is checked by TypeScript through `ConvertCaseType`; there is no
 *   runtime guard for a value outside that union.
 *
 * ## Related references
 *
 * - `src/hooks/index.ts`: re-exports this module for the `@hooks` alias.
 * - `tsconfig.json`: defines the `@hooks` path alias.
 * - `instructions/code-rules.md`: applicable TypeScript documentation and
 *   formatting guidance.
 * - `package.json`: provides the project's `type:check`, `lint`, and
 *   `format:check` scripts.
 */

/** The case formats supported by `UseConvertCase`. */
export type ConvertCaseType = 'NORMAL' | 'SMALL' | 'CAMEL' | 'SNAKE' | 'SCREAM' | 'PASCAL' | 'SLUG' | 'KEBAB'

/**
 * Converts a string to one of the supported case formats.
 *
 * @param word Source text to normalize.
 * @param caseType Target format. Defaults to `NORMAL`.
 * @returns The converted string. Empty or separator-only input returns an
 *   empty string.
 *
 * @example
 * ```ts
 * UseConvertCase('NizwaWaqf', 'KEBAB') // 'nizwa-waqf'
 * UseConvertCase('nizwa-waqf') // 'Nizwa waqf'
 * ```
 */
export function UseConvertCase(word: string, caseType: ConvertCaseType = 'NORMAL'): string {
  const toWords = (str: string) =>
    str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .trim()
      .split(/[\s_-]+/)
      .filter(Boolean)
      .map((w) => w.toLowerCase())
  const cap = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

  // Configs
  const words = toWords(word)
  const cases: Record<ConvertCaseType, string> = {
    NORMAL: words.map((w, i) => (i === 0 ? cap(w) : w)).join(' '),
    SMALL: words.join(' '),
    CAMEL: words.map((w, i) => (i === 0 ? w : cap(w))).join(''),
    SNAKE: words.join('_'),
    SCREAM: words.join('_').toUpperCase(),
    PASCAL: words.map(cap).join(''),
    SLUG: words
      .map((w) => w.replace(/[^a-z0-9]/g, ''))
      .filter(Boolean)
      .join('-'),
    KEBAB: words.join('-'),
  }

  return cases[caseType]
}

/**
 * Checks whether a value is a lowercase ASCII slug with single hyphen
 * separators.
 *
 * @param value Value to validate.
 * @returns `true` only for one or more lowercase ASCII letters or digits,
 *   optionally followed by additional non-empty segments separated by `-`.
 *
 * @example
 * ```ts
 * CheckSlug('nizwa-waqf') // true
 * CheckSlug('Nizwa-waqf') // false
 * ```
 */
export function CheckSlug(value: string): boolean {
  if (!value) return false

  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
}

/**
 * Documentation metadata
 *
 * - Last documentation update: 2026-09-18
 * - Documentation audience: Developers and AI agents
 * - Evidence basis: Attached file + verified project context
 * - Documentation coverage: Complete
 * - Validation: `pnpm exec prettier --check src/hooks/Cases.ts`, `pnpm exec eslint src/hooks/Cases.ts`, and `pnpm type:check` passed.
 * - Known limitations: No automated tests for this utility were found in the inspected tree.
 */
