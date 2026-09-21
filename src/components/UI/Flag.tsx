'use client'

import { cn } from '../../hooks'
import { HTMLAttributes, ReactNode, useState } from 'react'
import { CountryType } from '../../database'

/**
 * ## Flag
 *
 * Confirmed: this client component renders a country-code flag image from the
 * public `/flags` directory inside a sized `span`. It reports image load or
 * error status through `setIsExist` and renders a fallback when the image
 * cannot be loaded.
 *
 * ### File overview
 *
 * `FlagProps` defines the required `CountryType` code, the calculated size and
 * ratio options, an optional fallback node, and an optional image-status
 * callback. It also accepts native `HTMLAttributes<HTMLSpanElement>` values
 * except `children`; those attributes are forwarded to the wrapper span.
 *
 * This file is responsible only for rendering the flag asset and its fallback.
 * It does not look up country names, select countries, translate labels, or
 * validate that a flag asset exists before the browser requests it.
 *
 * ### When to use
 *
 * - Use `Flag` when an existing country code should be represented by its
 *   corresponding flag asset, such as the country prefix in `PhoneInput`.
 * - Use `fallback` when the UI needs a deliberate value if the static SVG is
 *   unavailable; without one, the uppercase country code is rendered.
 * - Use `setIsExist` when surrounding UI needs to react to the image load or
 *   error result.
 * - Prefer `PhoneInput` when the requirement is country selection, searching,
 *   phone-code formatting, or phone-value validation rather than flag display.
 *
 * ### Developer guide
 *
 * Import `Flag` from the verified `@components` barrel and provide a
 * `CountryType` value. The component follows this flow:
 *
 * 1. A truthy country code is uppercased and used to request
 *    `/flags/<COUNTRY_CODE>.svg`.
 * 2. The wrapper span receives `width={size}` and a height calculated from
 *    `ratio`; a caller's `style.width` or `style.height` can override those
 *    calculated values.
 * 3. The image fills the wrapper, uses the uppercase code as its `alt` value,
 *    and disables pointer events on the image.
 * 4. `onLoad` calls `setIsExist(true)` when the callback is provided.
 * 5. `onError` hides the failed image, calls `setIsExist(false)`, and renders
 *    `fallback` or the uppercase code.
 *
 * `size` defaults to `20` and `ratio` defaults to `'3x2'`. The supported ratios
 * are `'3x2'` and `'1x1'`. The wrapper always includes the `inline-block` class;
 * a supplied `className` is composed with it through `cn`.
 *
 * ### Usage examples
 *
 * Minimal example:
 *
 * ```tsx
 * import { Flag } from '@components'
 *
 * export function CountryMarker() {
 *   return <Flag country='OM' />
 * }
 * ```
 *
 * Practical example with sizing, a failure fallback, and the same spacing
 * class used by the phone-input consumer:
 *
 * ```tsx
 * import { Flag } from '@components'
 *
 * export function CountryPrefix() {
 *   return (
 *     <Flag
 *       country='OM'
 *       size={24}
 *       ratio='1x1'
 *       fallback='OM'
 *       className='me-1'
 *     />
 *   )
 * }
 * ```
 *
 * The country code and corresponding public flag asset used in these examples
 * are present in the verified country data and `public/flags` directory.
 *
 * ### AI agent guide
 *
 * - Preserve the `'use client'` directive, the exported `FlagProps` and
 *   `Flag` names, and the `CountryType` input contract.
 * - Preserve the `/flags/<uppercase code>.svg` URL convention, the calculated
 *   wrapper dimensions, the image `alt` value, and the load/error callback
 *   semantics.
 * - Reuse `cn` for wrapper class composition and check `CountryType` plus the
 *   `public/flags` assets before adding or changing country support.
 * - Check `src/components/Forms/Inputs/Phone/helper.tsx` and
 *   `src/components/Forms/Inputs/Phone/index.tsx` before changing the public
 *   contract; both consume this component.
 * - This source appears manually maintained. A documentation-only request
 *   must not change rendering logic, props, imports, or event behavior.
 * - Project rule: `instructions/code-rules.md` prefers Next.js optimized image
 *   components when applicable. Before replacing the current native `img`,
 *   verify that its `onLoad`, `onError`, and failed-image hiding behavior stay
 *   intact.
 * - Confirm the focused project checks with `pnpm type:check`,
 *   `pnpm lint`, or `pnpm format:check` after source changes.
 *
 * ### Errors, edge cases, and limitations
 *
 * - `country` is required by TypeScript, but the runtime still has a falsy
 *   guard. A falsy value returns `fallback` or the original value without
 *   rendering a wrapper, image, or status callback.
 * - There is no runtime validation for a value that bypasses the
 *   `CountryType` contract. A missing `/flags/<code>.svg` asset triggers the
 *   image error path instead of throwing a component error.
 * - `fallback` is not a loading placeholder. It is shown after an image error,
 *   except that it is returned immediately for a falsy country.
 * - The fallback state is not cleared on a later successful load or when the
 *   `country` prop changes. Reusing one mounted instance for different country
 *   codes can therefore retain an earlier fallback node.
 * - `size` and `ratio` are not runtime-validated. The ratio union keeps normal
 *   TypeScript callers within the two supported values.
 * - The image `alt` is the uppercase country code, not a localized country
 *   name. The component has no dedicated accessible-name or translation prop;
 *   native span attributes can still be forwarded through the wrapper.
 * - No loading indicator, retry mechanism, authentication, persistence, or
 *   separate network-error message is handled here. The browser performs the
 *   image request.
 * - No dedicated `Flag` test file was found in the inspected project tree.
 *
 * ### Related references
 *
 * - `src/@data/useCountries.ts`: defines `CountryType` and the country-code
 *   data used by this component.
 * - `src/@data/index.ts`: re-exports the country data through `@data`.
 * - `src/hooks/classNames.ts` and `src/hooks/index.ts`: define and re-export
 *   the `cn` helper used for wrapper classes.
 * - `src/components/index.ts`: re-exports `Flag` through `@components`.
 * - `src/components/Forms/Inputs/Phone/helper.tsx`: renders a flag beside a
 *   phone prefix.
 * - `src/components/Forms/Inputs/Phone/index.tsx`: renders flags in country
 *   options and the selected-country value.
 * - `public/flags/*.svg`: static flag assets addressed by the component.
 * - `instructions/code-rules.md` and `package.json`: applicable React rules
 *   and confirmed validation scripts.
 */

/**
 * Public properties for `Flag`.
 *
 * Native span attributes such as `id`, `title`, event handlers, and `aria-*`
 * values are accepted through `HTMLAttributes<HTMLSpanElement>` and forwarded
 * to the wrapper. `children` is intentionally omitted because the component
 * controls the image and fallback content.
 *
 * @property country Required country code from `CountryType`. It is uppercased
 *   when constructing the `/flags/<code>.svg` image URL.
 * @property size Wrapper width in pixels and the base used to calculate height;
 *   defaults to `20`.
 * @property ratio Supported width-to-height ratio used for the calculated
 *   wrapper height; defaults to `'3x2'`.
 * @property fallback React content shown after an image error, or returned
 *   immediately when `country` is falsy. If omitted after an image error, the
 *   uppercase country code is shown.
 * @property setIsExist Optional callback called with `true` on image load and
 *   `false` on image error. It is not called by the falsy-country early return.
 */
export interface FlagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  country: CountryType
  size?: number
  ratio?: '3x2' | '1x1'
  fallback?: ReactNode
  setIsExist?: (isExist: boolean) => void
}

/**
 * Renders a country flag image with a size ratio and an image-error fallback.
 *
 * @param props Flag configuration and native wrapper span attributes.
 * @returns A wrapper `span` containing the flag image and any error fallback,
 *   or the fallback/original value directly when `country` is falsy.
 * @remarks The image source is a root-relative URL under `/flags`, so the
 *   corresponding public SVG must be available to the browser at runtime.
 */
export function Flag(props: Readonly<FlagProps>) {
  const { country, size = 20, ratio = '3x2', fallback: fb, className, style, setIsExist, ...attrs } = props

  // States
  const [fallback, setFallback] = useState<ReactNode>()

  if (!country) return fb ?? country

  // Configs
  const flagKey = country?.toUpperCase() ?? ''
  const [widthRatio, heightRatio] = ratio.split('x')
  const height = (size * Number.parseInt(heightRatio, 10)) / Number.parseInt(widthRatio, 10)

  const flag = (
    <img
      src={`/flags/${flagKey}.svg`}
      alt={flagKey}
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      onLoad={() => setIsExist?.(true)}
      onError={(e) => {
        const target = e.target as HTMLImageElement
        target.style.display = 'none'
        setFallback(fb ?? flagKey)
        setIsExist?.(false)
      }}
    />
  )

  return (
    <span className={cn(['inline-block', className])} style={{ width: size, height, ...style }} {...attrs}>
      {flag}
      {fallback}
    </span>
  )
}

/**
 * Documentation metadata
 * - Last documentation update: 2026-09-18
 * - Documentation audience: Developers and AI agents
 * - Evidence basis: Attached file + verified project context
 * - Documentation coverage: Complete
 * - Validation: Passed `pnpm exec prettier --check src/components/UI/Flag.tsx`,
 *   `pnpm exec eslint src/components/UI/Flag.tsx`, and `pnpm type:check`.
 * - Known limitations: Fallback state is not reset when the country prop
 *   changes; no dedicated Flag test file was found.
 */
