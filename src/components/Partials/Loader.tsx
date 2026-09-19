/**
 * # Loader
 *
 * Reusable animated skeleton placeholder for blocks, text lines, circles, and square media areas.
 * The component only renders the placeholder requested by its props; the consuming component owns
 * the loading condition and replaces the placeholder with real content when appropriate.
 *
 * ## When to use
 *
 * Use `Loader` when a consuming component needs a lightweight placeholder that preserves a known
 * width and height during loading. Use `variant="text"` for multiple text lines, and use a
 * feature-specific loader when the loading state must reproduce a larger component structure.
 *
 * ## Developer guide
 *
 * `Loader` is available as both a named and default export. `height` is required by
 * `LoaderProps`; `width`, `counts`, `duration`, `variant`, and class names are optional. The
 * `as` element is rendered once per block. The `text` variant additionally renders a wrapper
 * using `wrapperAs` and `wrapperClassName`; all other variants return the blocks in a fragment.
 *
 * The rendered blocks use `animate-pulse bg-gray-300 dark:bg-gray-700`. The animation duration is
 * applied through the inline `animationDuration` style in seconds. This component does not add
 * loading, success, empty, or error state handling, accessibility attributes, network calls,
 * persistence, hooks, or browser API side effects.
 *
 * ### Usage flow
 *
 * 1. Let the consuming component decide whether its content is loading.
 * 2. Render `Loader` with the dimensions and shape that match the reserved content area.
 * 3. Render the actual content instead of `Loader` when the consuming state is ready.
 *
 * ## AI agent guide
 *
 * Preserve the required `height` prop, the five `variant` values, the default values in
 * `LoaderProps`, and the distinction between fragment output and the `text` wrapper. Reuse this
 * component instead of creating another generic skeleton block. When changing a variant or its
 * width behavior, check the direct consumers in `src/components/UI/Digit.tsx`,
 * `src/components/Partials/Table/Modules.tsx`, `src/components/Forms/Inputs/Uploader/Modules.tsx`,
 * and `src/components/Forms/Inputs/TextEditor/index.tsx`, as well as the barrel export in
 * `src/components/index.ts`. The component is manually maintained; no component-specific test
 * file was found during inspection.
 *
 * ## Errors, edge cases, and limitations
 *
 * - `counts` is passed to `Array.from` without runtime validation; use a finite non-negative number.
 * - For `variant="text"` with more than one block, the final block is rendered at 80% of `width`.
 *   String widths should begin with a numeric value and an optional unit, such as `12rem` or `100%`.
 * - `wrapperAs` and `wrapperClassName` affect only the `text` variant.
 * - A falsy runtime `height` is not assigned to the inline style even though the TypeScript prop is
 *   required. Use a positive height value for predictable layout reservation.
 * - The component does not forward arbitrary element attributes, provide accessible status text,
 *   or handle reduced-motion preferences itself.
 *
 * ## Related references
 *
 * - `src/components/index.ts`: re-exports `Loader` and `LoaderProps` through `@components`.
 * - `instructions/loader-structure.md`: project rules for composing feature-specific loaders.
 * - `src/components/UI/Digit.tsx`: uses `Loader` while a digit is loading.
 * - `src/components/Partials/Table/Modules.tsx`: uses `Loader` for loading table cells.
 * - `src/components/Forms/Inputs/Uploader/Modules.tsx`: renders four loading blocks for uploader items.
 * - `src/components/Forms/Inputs/TextEditor/index.tsx`: composes rounded blocks for editor loading.
 */
import React, { ElementType } from 'react'

/**
 * Configuration accepted by {@link Loader}.
 *
 * Defaults are applied inside `Loader`: `as="span"`, `wrapperAs="div"`, `counts=1`,
 * `duration=2.5`, `width="100%"`, `variant="rounded"`, `className=""`, and `wrapperClassName="gap-1"`.
 * `height` has no default and is required by the type contract.
 *
 * @example
 * ```tsx
 * <Loader height={20} width="6rem" variant="rounded" />
 * ```
 */
export interface LoaderProps {
  /** Element or component used for each skeleton block. */
  as?: ElementType
  /** Element or component used around text blocks; ignored for other variants. */
  wrapperAs?: ElementType
  /** Number of blocks to render. */
  counts?: number
  /** Pulse animation cycle duration in seconds. */
  duration?: number
  /** Width applied to every block, except the shortened final text block. */
  width?: number | string
  /** Required height applied to each block when truthy at runtime. */
  height: number | string
  /** Shape and layout treatment applied to each block. */
  variant?: 'rounded' | 'circle' | 'sharp' | 'square' | 'text'
  /** Additional classes appended to every block. */
  className?: string
  /** Additional classes appended to the text wrapper. */
  wrapperClassName?: string
}

/**
 * Renders one or more animated skeleton blocks.
 *
 * Non-text variants return the blocks inside a React fragment. The `text` variant returns the
 * blocks inside a flex column wrapper and shortens the final block to 80% of the requested width
 * when more than one block is rendered.
 *
 * @param props Loader configuration.
 * @returns Skeleton block markup with no loading-state side effects.
 *
 * @example Minimal rounded block
 * ```tsx
 * <Loader height={20} />
 * ```
 *
 * @example Practical group of loading blocks
 * ```tsx
 * <Loader counts={4} height={60} />
 * ```
 *
 * @example Illustrative multi-line text placeholder
 * The surrounding component decides when to render this placeholder.
 * ```tsx
 * <Loader variant="text" counts={3} height="1rem" width="12rem" wrapperClassName="gap-2" />
 * ```
 */
export function Loader(props: Readonly<LoaderProps>) {
  const {
    as: As = 'span',
    wrapperAs: Wrapper = 'div',
    counts = 1,
    duration = 2.5,
    width = '100%',
    height,
    variant = 'rounded',
    className = '',
    wrapperClassName = 'gap-1',
  } = props

  const baseClasses = 'animate-pulse bg-gray-300 dark:bg-gray-700'

  const variantClasses = {
    rounded: 'rounded',
    circle: 'rounded-full',
    sharp: '',
    square: 'aspect-square',
    text: 'h-4 rounded',
  }

  const getWidth = (index: number) => {
    if (variant === 'text' && counts > 1 && index === counts - 1) {
      const numWidth = typeof width === 'number' ? width : Number.parseFloat(width)
      const unit = typeof width === 'string' ? width.replace(/[\d.]+/, '') : 'px'
      return `${numWidth * 0.8}${unit}`
    }
    return width
  }

  const loaders = Array.from({ length: counts }).map((_, i) => {
    const style: React.CSSProperties = { animationDuration: `${duration}s` }
    if (height) style.height = height
    style.width = getWidth(i)

    return <As key={i} className={`${baseClasses} ${variantClasses[variant]} ${className}`} style={style} />
  })

  if (variant === 'text')
    return <Wrapper className={`flex flex-col flex-nowrap ${wrapperClassName}`}>{loaders}</Wrapper>

  return <>{loaders}</>
}

export default Loader

/**
 * Documentation metadata
 *
 * - Last documentation update: 2026-09-18
 * - Documentation audience: Developers and AI agents
 * - Evidence basis: Attached file + verified project context
 * - Documentation coverage: Complete
 * - Validation: Passed `pnpm exec prettier --check src/components/Partials/Loader.tsx`, `pnpm exec eslint src/components/Partials/Loader.tsx`, and `pnpm type:check`.
 * - Known limitations: Runtime validation and component-specific tests are not present.
 */
