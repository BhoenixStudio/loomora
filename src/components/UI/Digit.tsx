/**
 * `src/components/UI/Digit.tsx` provides numeric display helpers for formatted
 * values.
 *
 * ## Overview
 * `Digit` renders a number as a root element (a `span` by default), with
 * optional start/end units and fractional digits in a nested `small` element.
 * `UseDigit` exposes the same number formatting as a plain string. This module
 * formats with `en-US` grouping and does not choose, translate, or validate a
 * currency unit.
 *
 * ## When to use
 * - Use `Digit` when the value needs markup, per-part attributes, a fallback
 *   React node, or the built-in loading placeholder.
 * - Use `UseDigit` when a plain string is needed outside JSX or in text-only
 *   output. It accepts string units only and has no loading representation.
 *
 * ## Developer guide
 * 1. Pass the numeric value through `value`.
 * 2. Set `decimalsMin` and `decimalsMax` when the number of fractional digits
 *    matters; `decimalsMax` defaults to `3`.
 * 3. Pass display-only content through `startUnit` or `endUnit` and configure
 *    their nested `small` elements with the matching `*Props` field.
 * 4. Set `loading` on `Digit` while the value is being loaded, or provide a
 *    `fallback` for an explicitly `null` value.
 *
 * The component is available from `src/components/index.ts` through the
 * `@components` barrel. `NumberElement` is a verified consumer that composes
 * `Digit` with a responsive label.
 *
 * ## AI agent guide
 * Preserve the shared formatter, the `en-US` locale, the difference between
 * `null` and `undefined` in `Digit`, and the falsy-value fallback behavior in
 * `UseDigit`. Reuse `GlobalElementEssentials` for element attributes and
 * `LoaderProps` for loading configuration. Check `NumberElement` and the
 * barrel export before changing public names or prop shapes. This file is
 * manually maintained; no generated marker is present.
 *
 * ## Examples
 * The JSX snippets are illustrative examples and assume a React component
 * context with the verified `@components` barrel import.
 * ```tsx
 * <Digit value={12345.678} endUnit="OMR" />
 * ```
 *
 * ```tsx
 * <Digit
 *   value={1250}
 *   decimalsMin={2}
 *   decimalsMax={2}
 *   startUnit="OMR"
 *   loading={true}
 * />
 * ```
 *
 * ```ts
 * UseDigit(1234.5, { decimalsMin: 2, decimalsMax: 2, endUnit: 'OMR' })
 * // "1,234.50 OMR"
 * ```
 *
 * ## Errors, edge cases, and limitations
 * - `Digit` returns `fallback` directly only when `value === null`.
 * - An `undefined` `Digit` value is formatted as empty numeric content inside
 *   the root element because the source checks only for `null` before return.
 * - `UseDigit` returns its fallback for every falsy value, including `0`,
 *   `null`, `undefined`, and `NaN`; therefore `UseDigit(0)` does not return
 *   the formatted string `"0"`.
 * - `decimalSeparator` changes only the rendered separator; numeric grouping
 *   is produced by `toLocaleString('en-US')` and the generated comma is
 *   replaced with `thousandSeparator`.
 * - Invalid `Intl.NumberFormat` fraction options are not caught here and can
 *   propagate an exception from `toLocaleString`.
 *
 * ## Related references
 * - `src/@types/Global.ts`: `GlobalElementEssentials` used by the root and
 *   nested element props.
 * - `src/components/Partials/Loader.tsx`: `Loader` and `LoaderProps` used for
 *   the loading state.
 * - `src/components/Partials/Elements/Modules/Number.tsx`: verified consumer.
 * - `src/components/index.ts`: barrel export for `Digit` and `UseDigit`.
 */
import { Loader, LoaderProps } from '../../components'
import { cn } from '../../hooks'
import { GlobalElementEssentials } from '../../types'
import { ElementType, ReactNode } from 'react'

/**
 * Describes the intended presentation kind of a currency unit.
 *
 * This exported alias is not consumed by `DigitProps` or runtime formatting in
 * this file; callers must still pass the actual unit through `startUnit` or
 * `endUnit`.
 */
export type DigitCurrencySymbolType = 'code' | 'symbol' | 'icon'

/**
 * Props for {@link Digit}.
 *
 * @typeParam T - Root element type selected by `as`; defaults to `span`.
 * @property as - Root element rendered by `Digit`; defaults to `span`.
 * @property value - Number to format. It is required at the type level but may
 *   be `null` or `undefined`.
 * @property valueProps - Shared element options for the inner value `span`.
 *   Its default class name is `font-medium leading-none items-end`.
 * @property subProps - Shared element options for the fractional `small`
 *   element. Its default class name is `font-normal leading-none`.
 * @property fallback - React node returned directly when `value` is exactly
 *   `null`; defaults to `-`.
 * @property startUnit - Truthy React node rendered before the value in a
 *   `small` element.
 * @property startUnitProps - Shared element options for the start-unit
 *   `small`; its default class name is `font-normal leading-none`.
 * @property endUnit - Truthy React node rendered after the value in a `small`
 *   element.
 * @property endUnitProps - Shared element options for the end-unit `small`;
 *   its default class name is `font-normal leading-none`.
 * @property decimalsMin - Minimum fraction digits passed to the `en-US`
 *   `toLocaleString` call.
 * @property decimalsMax - Maximum fraction digits passed to formatting;
 *   defaults to `3`.
 * @property thousandSeparator - Replacement for the commas generated by
 *   `en-US` formatting; defaults to `,`.
 * @property decimalSeparator - Separator rendered between the main and
 *   fractional parts; defaults to `.`.
 * @property loading - When true, renders `Loader` content instead of the
 *   formatted value, unless the early `null` fallback return applies.
 * @property loaderProps - Additional `Loader` options except `counts` and
 *   `wrapperClassName`. The inherited `LoaderProps` type still requires
 *   `height`, although the component supplies `height={20}` at runtime. The
 *   root `className` is also supplied before these options are spread, so a
 *   matching field in `loaderProps` overrides that default.
 * @property className - Root class name; defaults to `gap-0.5`.
 * @property dir - Root text direction; defaults to `ltr`.
 * @property attributes - Native attributes and event handlers forwarded to
 *   the root element. `className`, `style`, `ref`, and `id` are configured by
 *   their dedicated shared fields instead.
 */
export type DigitProps<T extends ElementType = 'span'> = GlobalElementEssentials<T> & {
  as?: T
  value: number | null | undefined
  valueProps?: GlobalElementEssentials<'span'>
  subProps?: GlobalElementEssentials<'small'>
  fallback?: ReactNode
  startUnit?: ReactNode
  startUnitProps?: GlobalElementEssentials<'small'>
  endUnit?: ReactNode
  endUnitProps?: GlobalElementEssentials<'small'>
  decimalsMin?: number
  decimalsMax?: number
  thousandSeparator?: string
  decimalSeparator?: string
  loading?: boolean
  loaderProps?: Omit<LoaderProps, 'counts' | 'wrapperClassName'>
}

function extractPrice(
  props: Pick<DigitProps, 'value' | 'decimalsMin' | 'decimalsMax' | 'thousandSeparator'>
): [string, string?] {
  const { value, decimalsMin, decimalsMax, thousandSeparator } = props
  if (value === null || value === undefined) return ['', '']

  const formatted = value.toLocaleString('en-US', {
    maximumFractionDigits: decimalsMax,
    minimumFractionDigits: decimalsMin,
  })
  const [main, sub] = formatted.split('.')
  const number = main.split(',').join(thousandSeparator)

  return [number, sub]
}

/**
 * Render a formatted number with optional units, fractional markup, and a
 * loading state.
 *
 * The number is first formatted with `value.toLocaleString('en-US', ...)`.
 * The integer part is rendered as the main value, while the fractional part
 * is rendered in a nested `small` preceded by `decimalSeparator`. Unit content
 * is caller-provided and is not interpreted as a currency by this component.
 *
 * @typeParam T - Root element type selected by `DigitProps['as']`.
 * @param props - Formatting, display, loading, and root-element options.
 * @returns The configured root element, or `fallback` directly when `value`
 *   is exactly `null`.
 *
 * @example Illustrative example: minimal display inside a React component
 * ```tsx
 * <Digit value={9876543.21} />
 * ```
 *
 * @example Illustrative example: fixed precision and a display unit
 * ```tsx
 * <Digit value={1250} decimalsMin={2} decimalsMax={2} endUnit="OMR" />
 * ```
 *
 * @example Illustrative example: explicit null fallback
 * ```tsx
 * <Digit value={null} fallback="Not available" />
 * ```
 *
 * @remarks
 * `startUnit` and `endUnit` render only when their values are truthy. A custom
 * `decimalSeparator` affects the rendered fractional separator but not the
 * locale formatter itself. The root receives `dir="ltr"` by default, while
 * nested value/unit elements do not receive a direction automatically.
 */
export function Digit<T extends ElementType = 'span'>(props: Readonly<DigitProps<T>>) {
  const {
    as: As = 'span',
    value,
    valueProps,
    subProps,
    fallback = '-',
    startUnit,
    startUnitProps,
    endUnit,
    endUnitProps,
    decimalsMin,
    decimalsMax = 3,
    decimalSeparator = '.',
    thousandSeparator = ',',
    className = 'gap-0.5',
    dir = 'ltr',
    attributes,
    loading,
    loaderProps,
    ...attrs
  } = props

  const { className: sUClass = 'font-normal leading-none', attributes: sUAttrs, ...sURest } = startUnitProps ?? {}
  const { className: eUClass = 'font-normal leading-none', attributes: eUAttrs, ...eURest } = endUnitProps ?? {}

  const { className: vClass = 'font-medium leading-none items-end', attributes: vAttrs, ...vRest } = valueProps ?? {}
  const { className: sClass = 'font-normal leading-none', attributes: sAttrs, ...sRest } = subProps ?? {}

  // Configs
  const [main, sub] = extractPrice({ value, decimalsMin, decimalsMax, thousandSeparator })

  let content: ReactNode = <Loader height={20} className={className} {...loaderProps} />
  if (!loading)
    content = (
      <>
        {startUnit && (
          <small className={sUClass} {...sUAttrs} {...sURest}>
            {startUnit}
          </small>
        )}
        <span className={cn(['flex flex-nowrap text-nowrap', vClass])} {...vAttrs} {...vRest}>
          {main}
          {sub && (
            <small className={sClass} {...sAttrs} {...sRest}>
              {decimalSeparator}
              {sub}
            </small>
          )}
        </span>
        {endUnit && (
          <small className={eUClass} {...eUAttrs} {...eURest}>
            {endUnit}
          </small>
        )}
      </>
    )

  if (value === null) return fallback
  return (
    <As className={cn(['inline-flex flex-nowrap items-end', className])} {...{ dir, ...attributes }} {...attrs}>
      {content}
    </As>
  )
}

/**
 * Options accepted by {@link UseDigit}.
 *
 * @property fallback - String returned for any falsy `value`; defaults to `-`.
 * @property startUnit - Truthy string placed before the formatted number.
 * @property endUnit - Truthy string placed after the formatted number.
 * @property decimalsMin - Minimum fraction digits; passed to the shared
 *   `en-US` formatter.
 * @property decimalsMax - Maximum fraction digits; defaults to `3`.
 * @property thousandSeparator - Replacement for formatter-generated commas;
 *   defaults to `,`.
 * @property decimalSeparator - String placed before fractional digits;
 *   defaults to `.`.
 * @property subSeparator - Joins present units and the number with spaces when
 *   true (the default), or concatenates them without spaces when false.
 */
export type UseDigitProps = Pick<
  DigitProps,
  'decimalsMin' | 'decimalsMax' | 'thousandSeparator' | 'decimalSeparator'
> & { fallback?: string; startUnit?: string; endUnit?: string; subSeparator?: boolean }

/**
 * Format a numeric value as plain text using the same internal formatter as
 * {@link Digit}.
 *
 * @param value - Number to format. The runtime fallback check treats every
 *   falsy value as missing, including `0`, `null`, `undefined`, and `NaN`.
 * @param props - Optional precision, separators, string units, and fallback.
 * @returns A formatted string. With `subSeparator` true (the default), present
 *   units and the formatted value are joined with spaces; with it false, they
 *   are concatenated without spaces.
 *
 * @example Illustrative example
 * ```ts
 * const label = UseDigit(1234.5, {
 *   decimalsMin: 2,
 *   decimalsMax: 2,
 *   endUnit: 'OMR',
 * })
 * // "1,234.50 OMR"
 * ```
 *
 * @example Illustrative example: falsy-value behavior
 * ```ts
 * UseDigit(0) // "-" (the default fallback)
 * ```
 *
 * @remarks
 * This helper accepts string units only and cannot represent the React-node
 * units, nested attributes, or loading UI supported by `Digit`.
 */
export function UseDigit(value: DigitProps['value'], props: UseDigitProps = {}): string {
  const {
    fallback = '-',
    startUnit,
    endUnit,
    decimalsMin,
    decimalsMax = 3,
    thousandSeparator = ',',
    decimalSeparator = '.',
    subSeparator = true,
  } = props

  // Configs
  const [main, sub] = extractPrice({ value, decimalsMin, decimalsMax, thousandSeparator })

  const parts = []
  if (startUnit) parts.push(startUnit)
  const formattedNumber = sub === undefined ? main : `${main}${decimalSeparator}${sub}`
  parts.push(formattedNumber)
  if (endUnit) parts.push(endUnit)

  if (!value) return fallback
  return subSeparator ? parts.join(' ') : parts.join('')
}

/**
 * Documentation metadata
 * - Last documentation update: 2026-09-18
 * - Documentation audience: Developers and AI agents
 * - Evidence basis: Attached file + verified project context
 * - Documentation coverage: Complete
 * - Validation: Passed `pnpm exec prettier --check src/components/UI/Digit.tsx`,
 *   `pnpm exec eslint src/components/UI/Digit.tsx`, `pnpm type:check`, and
 *   `git diff --check -- src/components/UI/Digit.tsx`.
 * - Known limitations: `Digit` and `UseDigit` intentionally preserve their
 *   different falsy/null handling described above.
 */
