/**
 * # ProgressBar
 *
 * `ProgressBar.tsx` provides a small visual progress indicator with optional
 * label and percentage text. It exports the prop contracts for the two display
 * modes and the `ProgressBar` component itself.
 *
 * ## File overview
 *
 * - `ProgressBarWithLabelProps` describes the `showValueAsText: true` mode.
 * - `ProgressBarProps` combines the required numeric input with track, bar,
 *   sizing, and optional label-wrapper configuration.
 * - `ProgressBar` clamps the calculated percentage to the 0-100 range, renders
 *   a track and filled bar, and optionally wraps them with a label row.
 *
 * In bar-only mode the component returns a fragment containing the track. In
 * text mode it returns a flex-column wrapper, an optional label, a rounded
 * percentage, and the same track. It does not decide whether a caller is
 * loading, fetch data, validate a value, or expose progress semantics through
 * ARIA attributes.
 *
 * ## When to use
 *
 * Use `ProgressBar` for a visual completion or strength indicator when the
 * caller already owns the underlying numeric state. Use `showValueAsText` when
 * a visible rounded percentage and optional label should accompany the bar.
 * The verified `PasswordField` composition uses the bar-only mode for password
 * validation strength.
 *
 * Prefer a semantic progress implementation or an accessible wrapper when the
 * progress value must be announced to assistive technology; this component
 * only renders styled `div` elements and does not add `role`, `aria-valuenow`,
 * `aria-valuemin`, or `aria-valuemax`.
 *
 * ## Developer guide
 *
 * Import the named export from the verified `@components` barrel. `value` and
 * `outOf` are required by the TypeScript contract, while the implementation
 * falls back to `0` and `100` if untyped runtime input omits them. `height`
 * defaults to `10`, semantic track and bar colors default to `bg-third` and
 * `bg-info`, and the track defaults to `rounded-full`.
 *
 * The rendering flow is:
 *
 * 1. Calculate `(value / outOf) * 100`.
 * 2. Clamp ordinary numeric results to 0 through 100.
 * 3. Apply the clamped result to the inner bar width.
 * 4. When `showValueAsText` is true, render `Math.round(percent)` followed by
 *    `%` and optionally render `label` before the bar.
 *
 * `trackColor` and `barColor` accept the project's semantic `bg-*` tokens with
 * the supported opacity suffixes. `trackClassName` and `barClassName` are
 * appended through `cn`. `size` is used as the track's class list only in text
 * mode; bar-only mode uses a `w-full` fallback. `wrapper` supplies the text
 * mode wrapper's class and other top-level wrapper properties, with `gap-2` as
 * its default class.
 *
 * This module has no client directive, hooks, network calls, persistence,
 * authentication, or browser API side effects. It relies on `cn` and the
 * shared global type contracts for class composition and CSS values.
 *
 * ## Usage examples
 *
 * Minimal bar-only usage:
 *
 * ```tsx
 * import { ProgressBar } from '@components'
 *
 * <ProgressBar value={40} outOf={100} />
 * ```
 *
 * Practical labeled usage with semantic colors:
 *
 * ```tsx
 * import { ProgressBar } from '@components'
 *
 * <ProgressBar
 *   value={3}
 *   outOf={5}
 *   height={6}
 *   trackColor='bg-third'
 *   barColor='bg-success'
 *   showValueAsText
 *   label='Completion'
 *   wrapper={{ className: 'gap-1' }}
 * />
 * ```
 *
 * Edge-case example: a value above `outOf` is visually capped at 100%:
 *
 * ```tsx
 * <ProgressBar value={125} outOf={100} showValueAsText label='Complete' />
 * ```
 *
 * These examples use only the verified exports and props. The surrounding
 * component remains responsible for supplying live state and accessible text
 * when the visual bar alone is insufficient.
 *
 * ## AI agent guide
 *
 * - Preserve the exported names, the `showValueAsText: true` discriminant, and
 *   the `Readonly<ProgressBarProps>` component contract.
 * - Preserve the percentage calculation and clamping behavior. Do not silently
 *   normalize `outOf`, change rounding, or convert the component into a stateful
 *   progress source.
 * - Reuse `cn`, `CSSProps`, `ColorName`, `ChildSize`, and
 *   `GlobalElementEssentials` rather than introducing parallel color or sizing
 *   contracts.
 * - Keep the bar-only and text-mode output distinction, including the default
 *   classes and inline height/width styles.
 * - Check `src/components/index.ts`, the direct `PasswordField` composition,
 *   `src/hooks/classNames.ts`, and `src/@types/Global.ts` before changing the
 *   public contract.
 * - This is manually maintained source; no generated marker or dedicated
 *   ProgressBar test was found in the inspected tree. Documentation-only
 *   changes must not alter imports, values, JSX, exports, or control flow.
 * - Project rule: the inspected UI guidance requires semantic accessibility
 *   consideration for interactive or informative UI. If ARIA progress
 *   semantics are added later, review callers and the visual state together.
 *
 * ## Errors, edge cases, and limitations
 *
 * - There is no runtime prop validation. `value` and `outOf` are compile-time
 *   requirements only; missing untyped values use the destructuring fallbacks.
 * - `outOf <= 0`, `NaN`, and non-finite values are not rejected. For example,
 *   `value={0}` with `outOf={0}` produces a `NaN` percentage, while a positive
 *   value with `outOf={0}` clamps to 100. The resulting text or inline width can
 *   therefore be invalid or surprising.
 * - A falsy `label` is not rendered, but the percentage text is always rendered
 *   in text mode. `showValueAsText` is a type-level boolean branch and is not
 *   runtime-validated.
 * - When text mode is enabled and `size` remains its default empty array, the
 *   current class composition contributes no `w-full` fallback. Supply a
 *   suitable width class through `size`, the wrapper, or surrounding layout when
 *   that width is required.
 * - `wrapper.attributes` is not unpacked into individual DOM attributes by the
 *   current implementation; it remains inside the spread wrapper object. Use
 *   the supported top-level wrapper fields only unless this behavior is
 *   intentionally corrected and its callers are reviewed.
 * - The component does not render loading, empty, error, retry, network,
 *   authentication, persistence, keyboard, focus, or responsive-state logic.
 *   `height` and color strings are passed to the rendered styles/classes
 *   without runtime CSS-token validation.
 *
 * ## Related references
 *
 * - `src/components/index.ts`: verified `@components` barrel export.
 * - `src/components/Forms/Inputs/Password/index.tsx`: verified direct usage
 *   with `strength ?? 0`, `outOf={100}`, `height={5}`, and a track color.
 * - `src/hooks/classNames.ts`: implementation of the `cn` conditional class
 *   behavior used by the bar and its wrapper.
 * - `src/@types/Global.ts`: source of `CSSProps`, `ColorName`, `ChildSize`, and
 *   `GlobalElementEssentials` used by the public prop types.
 * - `package.json`: verified `pnpm type:check`, `pnpm lint`, and formatter
 *   scripts available for validation.
 * - `instructions/attached-file-documentation-architect.md`: documentation
 *   scope, evidence, example, metadata, and behavior-preservation rules.
 * - `instructions/code-rules.md` and `instructions/UI-UX skill.md`: verified
 *   TypeScript, semantic color, responsive, and accessibility guidance relevant
 *   to documenting this visual component.
 *
 * ## Assumptions and unknowns
 *
 * The inspected source confirms the public barrel and the password-field
 * consumer, but does not establish every external consumer, the rendered CSS
 * for semantic tokens, or a project-wide accessible progress convention. Those
 * concerns remain with the caller and application styles.
 */
import { cn } from '../../hooks'
import { ChildSize, CSSProps, GlobalElementEssentials } from '../../types'
import { ReactNode } from 'react'

/**
 * Additional props for the labeled progress mode.
 *
 * Setting `showValueAsText` to `true` enables the label row and percentage
 * output. `wrapper` controls the outer text-mode `div`.
 */
export type ProgressBarWithLabelProps = {
  showValueAsText: true
  label?: ReactNode
  labelClassName?: string
  valueClassName?: string
  wrapper?: GlobalElementEssentials<'div'>
}

/**
 * Configuration accepted by `ProgressBar`.
 *
 * The `showValueAsText` union distinguishes bar-only mode from the mode that
 * accepts a label and wrapper configuration.
 */
export type ProgressBarProps = {
  value: number
  outOf: number
  height?: CSSProps['height']
  trackColor?: `bg-${string}` | `bg-${string}/${number}`
  trackClassName?: string
  barColor?: `bg-${string}` | `bg-${string}/${number}`
  barClassName?: string
  size?: ChildSize[]
} & ({ showValueAsText?: false } | ProgressBarWithLabelProps)

/**
 * Renders a clamped visual progress bar and, optionally, its percentage text.
 *
 * @param props Numeric progress and visual configuration. `value` is measured
 *   against `outOf`; ordinary finite results are clamped to 0-100.
 * @returns A bar-only fragment or a labeled wrapper containing the bar.
 */
export function ProgressBar(props: Readonly<ProgressBarProps>) {
  const {
    value = 0,
    outOf = 100,
    height = 10,
    trackColor = 'bg-third',
    trackClassName = 'rounded-full',
    barColor = 'bg-info',
    barClassName,
    showValueAsText = false,
    size = [],
  } = props
  const {
    label,
    labelClassName = 'text-sm text-title-2 font-medium',
    valueClassName = 'text-xs text-body-1',
    wrapper,
  } = props as ProgressBarWithLabelProps
  const { className: wrapperClassName = 'gap-2', ...wrapperRest } = wrapper ?? {}

  // Configs
  const percent = Math.min(Math.max((value / outOf) * 100, 0), 100)

  const bar = (
    <div
      className={cn([
        'overflow-hidden',
        { value: size, fallback: 'w-full', condition: showValueAsText },
        trackColor,
        trackClassName,
      ])}
      style={{ height }}
    >
      <div
        className={cn(['pointer-events-none h-full transition-all duration-300 ease-in-out', barColor, barClassName])}
        style={{ width: `${percent}%` }}
      />
    </div>
  )

  if (showValueAsText)
    return (
      <div className={cn(['flex flex-col flex-nowrap', wrapperClassName])} {...wrapperRest}>
        <div className="flex flex-nowrap items-end justify-between w-full">
          {label && <span className={labelClassName}>{label}</span>}
          <span className={valueClassName}>{Math.round(percent)}%</span>
        </div>
        {bar}
      </div>
    )
  return <>{bar}</>
}

/**
 * Documentation metadata
 *
 * - Last documentation update: 2026-09-18
 * - Documentation audience: Developers and AI agents
 * - Evidence basis: Attached file + verified project context
 * - Documentation coverage: Complete
 * - Validation: Passed `pnpm exec prettier --check src/components/Partials/ProgressBar.tsx`,
 *   `pnpm exec eslint src/components/Partials/ProgressBar.tsx`, `pnpm type:check`,
 *   and `git diff --check` for the edited targets.
 * - Known limitations: No ARIA progress semantics; invalid numeric inputs and
 *   text-mode width behavior are documented above.
 */
