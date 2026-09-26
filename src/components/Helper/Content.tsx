/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * # Content helpers
 *
 * `Content.tsx` provides three related exports for rendering data-dependent
 * React content: `useContent` resolves loading, empty, conditional, and final
 * states; `Content` renders the resolved `content` state; and
 *
 * ## File overview
 *
 * - `UseContentProps<T>` is a discriminated input type. Its default `ARRAY`
 *   branch renders a collection, while the explicit `SINGLE` branch renders
 *   one item or an empty state.
 * - `UseContentReturn` exposes every calculated state as a `ReactNode`, not
 *   only the state selected for the current render.
 * - `useContent` performs no data loading itself. Callers provide data,
 *   loading content, empty content, and render callbacks.
 * - `Content` is the convenience component for callers that only need the
 *   selected state.
 *
 * The module is not responsible for fetching data, authentication,
 * persistence, retries, error messages, translation, or accessibility markup
 * inside caller-supplied nodes. It also does not add a wrapper around the
 * output of `Content`.
 *
 * ## When to use
 *
 * - Use `Content` for the common case where a list or single record should
 *   choose between loading, empty, a matching conditional renderer, and normal
 *   rendered content.
 * - Use `useContent` when the caller needs to place `loadingState`,
 *   `emptyState`, `conditionalState`, or `finalState` independently, or needs
 *   to compose the selected `content` with other JSX.
 * - Prefer ordinary JSX conditionals when no shared state precedence or
 *   conditional wrapper behavior is needed.
 *
 * ## Developer guide
 *
 * Import the public exports from the verified `@components` barrel. For array
 * mode, provide `data: T[]` and an item renderer. `type` is optional because
 * it defaults to `ARRAY`; `loaderCount` controls how many copies of the
 * supplied `loader` are returned in the calculated loading state.
 *
 * For single-item mode, set `type: 'SINGLE'`, provide `data: T | undefined`,
 * and provide a renderer accepting one item. `loaderCount` is not allowed by
 * the TypeScript type in this branch. Both branches accept `renderConditions`,
 * whose first truthy `condition` wins and whose renderer replaces the normal
 * renderer while that condition is selected.
 *
 * Shared options are:
 *
 * - `loading`: when truthy, selects `loadingState`.
 * - `loader`: the `ReactNode` repeated for `loaderCount` in array mode. If it
 *   is omitted, the loading state renders nothing.
 * - `empty`: a direct `ReactNode`, or `NoDataProps`. An object is passed to
 *   `NoData` only when at least one of its `title`, `description`, or
 *   `children` values is truthy.
 *
 * State selection has this precedence:
 *
 * 1. `loading` selects `loadingState`.
 * 2. An empty array, or a falsy single `data` value, selects `emptyState`.
 * 3. The first truthy `renderConditions` entry selects `conditionalState`.
 * 4. Otherwise, `finalState` is selected.
 *
 * `useContent` calculates render nodes before selecting the final state, so
 * supplied render callbacks should be pure and safe to call during loading or
 * empty-state renders. In array mode, `finalState` and a selected conditional
 * state contain one result per data item. In single mode, a truthy data value
 * is passed to the normal renderer once and to the selected conditional
 * renderer once when a matching condition exists.
 *
 * is truthy, it renders the chosen element with the original `children` and
 * forwards the remaining extra props. When `condition` is falsy, it renders
 * no parent element and returns `fallback` when it is not `null` or
 * `undefined`; otherwise it returns `children` when `childrenCondition` is
 * truthy.
 *
 * ## Usage examples
 *
 * Minimal array rendering:
 *
 * ```tsx
 * import { Content } from '@components'
 *
 * <Content
 *   data={['First', 'Second']}
 *   render={(item) => <p key={item}>{item}</p>}
 * />
 * ```
 *
 * Illustrative example: loading and empty content for a typed array. The
 * surrounding component supplies the real `loading` value and data source.
 *
 * ```tsx
 * import { Content } from '@components'
 *
 * const rows = [{ id: 'one', label: 'First' }]
 * const loading = false
 *
 * <Content
 *   loading={loading}
 *   loader={<span>Loading...</span>}
 *   loaderCount={3}
 *   data={rows}
 *   empty={{ title: 'No rows', description: 'Nothing is available.' }}
 *   render={(row) => <div key={row.id}>{row.label}</div>}
 * />
 * ```
 *
 * Illustrative example: use the individual states from single-item mode and
 * provide a conditional renderer. The example assumes `isCompact` is supplied
 * by the surrounding component.
 *
 * ```tsx
 * import { useContent } from '@components'
 *
 * const isCompact = true
 * const { content } = useContent({
 *   type: 'SINGLE',
 *   data: 'Details',
 *   render: (value) => <span>{value}</span>,
 *   renderConditions: [
 *     { condition: isCompact, render: (value) => <strong>{value}</strong> },
 *   ],
 * })
 *
 * <>{content}</>
 * ```
 *
 * Conditional parent rendering:
 *
 * Illustrative example: `isVisible` is supplied by the surrounding component.
 *
 *
 * ## AI agent guide
 *
 * - Preserve the `ARRAY`/`SINGLE` discriminated contract, the exported names,
 *   and all five keys returned by `useContent`.
 * - Preserve state precedence: loading, empty, first matching condition, then
 *   final content. Do not use all matching conditions unless the public
 *   contract is intentionally changed.
 * - Keep array callback arguments in the order `(item, index, array)` and keep
 *   the single callback argument as `(item)`.
 * - Reuse `NoData` through the existing `empty` input instead of adding a
 *   second empty-state abstraction. Check `src/components/Partials/NoData.tsx`
 *   before changing the accepted empty configuration.
 * - Treat caller render callbacks as render-time callbacks. Do not add side
 *   effects to this module or assume that a callback runs only for the state
 *   ultimately returned as `content`.
 * - This is manually maintained source. No generated marker was observed, and
 *   documentation-only changes must not alter imports, values, exports, or
 *   control flow.
 * - Check `src/components/index.ts`, `src/components/Partials/NoData.tsx`,
 *   `tsconfig.json`, and direct consumers before changing the public contract.
 *   The inspected `src` tree contains the barrel export but no direct consumer
 *   of these three exports.
 * - Run the focused formatter and linter checks plus the project type check
 *   after source changes when they are available.
 *
 * ## Related references
 *
 * - `src/components/index.ts`: verified `@components` barrel export.
 * - `src/components/Partials/NoData.tsx`: source of `NoDataProps` and the
 *   `NoData` rendering behavior used by `empty`.
 * - `tsconfig.json`: verified `@components` path alias and strict TypeScript
 *   configuration.
 * - `package.json`: verified `pnpm type:check`, `pnpm lint`, and formatter
 *   scripts used for validation.
 * - `instructions/attached-file-documentation-architect.md`: documentation
 *   scope, evidence, and preservation requirements applied to this file.
 * - `instructions/code-rules.md` and `instructions/UI-UX skill.md`: verified
 *   TypeScript, React, accessibility, and shared-component guidance relevant
 *   to documenting this rendering utility.
 *
 * ## Assumptions and unknowns
 *
 * The inspected project context does not identify runtime data schemas, the
 * application loading design, or external consumers of these exports. Those
 * decisions remain with callers. The examples therefore use only the verified
 * prop names and local placeholder values.
 */
import { Fragment, ReactNode } from "react";

type RenderConditionArray<T> = {
  condition: boolean | undefined;
  render: (item: T, i: number, array: T[]) => ReactNode;
};
type RenderConditionSingle<T> = { condition: boolean | undefined; render: (item: T) => ReactNode };

type UseContentArray<T> = {
  type?: "ARRAY";
  data: T[];
  render: (item: T, i: number, array: T[]) => ReactNode;
  renderConditions?: RenderConditionArray<T>[];
  loaderCount?: number;
};
type UseContentSingle<T> = {
  type: "SINGLE";
  data: T | undefined;
  render: (item: T) => ReactNode;
  renderConditions?: RenderConditionSingle<T>[];
  loaderCount?: never;
};

/**
 * Props for `useContent` and `Content`.
 *
 * The default branch is array mode (`type` omitted or `'ARRAY'`). Set
 * `type: 'SINGLE'` to use the single-item branch and its renderer signature.
 *
 * @typeParam T The item or record type supplied to the render callbacks.
 */
export type UseContentProps<T> = { loading?: boolean; loader?: ReactNode; empty?: ReactNode } & (
  UseContentArray<T> | UseContentSingle<T>
);

/**
 * All render states calculated by `useContent`.
 *
 * `content` is the state selected by the current props. The other fields are
 * exposed so callers can compose or inspect the individual states directly.
 */
export type UseContentReturn = Record<
  "loadingState" | "emptyState" | "finalState" | "conditionalState" | "content",
  ReactNode
>;

/**
 * Calculates loading, empty, conditional, and final content for array or
 * single-item data.
 *
 * @typeParam T The item or record type supplied to the render callbacks.
 * @param props Data, renderers, state content, and optional state conditions.
 * @returns Every calculated state plus `content`, which follows the documented
 *   loading, empty, conditional, and final-state precedence.
 */
export function useContent<T>(props: UseContentProps<T>): UseContentReturn {
  const { type = "ARRAY", loading, loader, empty = null, renderConditions = [] } = props;

  const {
    loaderCount = 1,
    data: arrayData = [],
    render: arrayRender,
  } = props as UseContentArray<T>;
  const { data: singleData, render: singleRender } = props as UseContentSingle<T>;

  // Configs
  const singleDataProcess = singleData ? singleRender(singleData) : null;

  // Content
  const loadingState =
    loader &&
    Array.from({ length: loaderCount }).map((_, i) => <Fragment key={i}>{loader}</Fragment>);
  const emptyState = empty;
  const finalState =
    type === "ARRAY"
      ? arrayData.map((item, i, array) => arrayRender(item, i, array))
      : singleDataProcess;

  const matchingCondition = renderConditions.find(({ condition }) => condition);
  const renderConditionsState: ReactNode =
    type === "ARRAY"
      ? arrayData.map((item, i, array) =>
          (matchingCondition as RenderConditionArray<T>)?.render(item, i, array),
        )
      : singleData
        ? (matchingCondition as RenderConditionSingle<T>)?.render(singleData)
        : null;

  let content: ReactNode = finalState;
  if (loading) content = loadingState;
  else if (!loading && (type === "ARRAY" ? arrayData.length === 0 : !singleData))
    content = emptyState as ReactNode;
  else if (matchingCondition) content = renderConditionsState;

  return { loadingState, emptyState, conditionalState: renderConditionsState, finalState, content };
}

/**
 * Renders the state selected by `useContent`.
 *
 * @typeParam T The item or record type supplied to the render callbacks.
 * @param props The same array or single-item configuration accepted by
 *   `useContent`.
 * @returns A fragment containing the selected state. No additional wrapper is
 *   added.
 */
export function Content<T>(props: Readonly<UseContentProps<T>>) {
  const { content } = useContent(props);
  return <>{content}</>;
}

/**
 * Documentation metadata
 * - Last documentation update: 2026-09-18
 * - Documentation audience: Developers and AI agents
 * - Evidence basis: Attached file + verified project context
 * - Documentation coverage: Complete
 * - Validation: Passed `pnpm exec prettier --check src/components/Partials/Content.tsx`,
 *   `pnpm exec eslint src/components/Partials/Content.tsx`, and `pnpm type:check`.
 * - Known limitations: Single-mode presence uses truthiness; empty-state
 *   recognition and loading-state rendering follow the runtime rules described
 *   above.
 */
