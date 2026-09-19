'use client'

import { GlobalElementEssentials } from '../types'
import { ElementType, useEffect } from 'react'

type UseDocumentAttsProps = { html?: GlobalElementEssentials<'html'>; body?: GlobalElementEssentials<'body'> }

function applyAtts<T extends ElementType>(el: HTMLElement, atts: GlobalElementEssentials<T>) {
  if (atts.className) {
    if (atts.clearDefaultClassName) el.className = atts.className
    else el.className = `${el.className} ${atts.className}`.trim()
  } else if (atts.clearDefaultClassName) {
    el.className = ''
  }
  if (atts.id) el.id = atts.id
  if (atts.style) Object.assign(el.style, atts.style)
  if (atts.attributes) Object.entries(atts.attributes).forEach(([k, v]) => el.setAttribute(k, v as string))
}

function snapshotAtts(el: HTMLElement) {
  return Object.fromEntries(Array.from(el.attributes).map(({ name, value }) => [name, value])) as Record<string, string>
}

function restoreAtts(el: HTMLElement, snapshot: Record<string, string>) {
  Array.from(el.attributes).forEach(({ name }) => el.removeAttribute(name))
  Object.entries(snapshot).forEach(([name, value]) => el.setAttribute(name, value))
}

/**
 * File: `DocumentAtts.ts`
 *
 * ## File overview
 * Client-only hook for applying selected attributes, classes, IDs, styles, and raw HTML attributes to
 * `document.documentElement` and `document.body`.
 *
 * Confirmed: the hook applies the supplied configuration in a `useEffect`, snapshots the target element's
 * existing attributes before applying it, and restores that snapshot when the effect is cleaned up.
 * It also returns an imperative `Set` function for updates that do not come from the hook's effect props.
 * This file does not update ordinary React elements, persist changes, perform network requests, or manage
 * class names through `classList`.
 *
 * ## When to use
 * - Use `useDocumentAtts({ html: ... })` for document-wide settings such as the HTML element's `lang` or
 *   `dir` attributes.
 * - Use `useDocumentAtts({ body: ... })` for temporary page-level classes, styles, IDs, or attributes such
 *   as a modal scroll lock.
 * - Use the returned `Set` function when an event handler must imperatively update either target.
 * - Prefer normal JSX props for attributes on component-owned elements; this hook only targets the HTML and
 *   body elements exposed by `document`.
 *
 * ## Developer guide
 * Import the hook directly from `@hooks` or from `src/hooks/DocumentAtts.ts` when a direct module import is
 * needed. The file contains the internal `UseDocumentAttsProps` shape below; the hook accepts an optional
 * object with `html` and/or `body` configurations.
 *
 * Each target configuration is based on `GlobalElementEssentials<T>`:
 *
 * | Field | Confirmed behavior |
 * | --- | --- |
 * | `className` | Appends a truthy value to the current class name by default. With `clearDefaultClassName: true`, replaces the current class name. |
 * | `clearDefaultClassName` | Clears the class name when true and no truthy `className` is supplied; otherwise controls replacement versus appending. |
 * | `id` | Assigns the ID only when the value is truthy. |
 * | `style` | Passed to `Object.assign(el.style, style)`, so only supplied style properties are assigned. |
 * | `attributes` | Each entry is passed to `setAttribute`. Use this field for attributes such as `dir` and `lang`. |
 *
 * The shared type also exposes `ref` and top-level `dir`, but `applyAtts` does not read either field. They are
 * therefore accepted by the type but have no effect in this implementation. `attributes` values are cast to
 * strings for `setAttribute`; there is no runtime validation, filtering, or automatic attribute removal during
 * a subsequent application.
 *
 * ### Effect lifecycle
 * 1. On the client, the effect snapshots all existing attributes for each configured target.
 * 2. It calls `Set({ html, body })` to apply the current configuration.
 * 3. When `html` or `body` changes by reference, or when the component unmounts, cleanup removes the target's
 *    current attributes and restores the snapshot captured for that effect run.
 * 4. If only one target is configured, the other target is left untouched by the effect and cleanup.
 *
 * The returned `Set` function applies immediately on the client and returns `undefined`. It does not create a
 * snapshot or provide automatic cleanup for its own changes. On the server it returns before accessing the DOM.
 *
 * ### Usage examples
 *
 * The following illustrative examples assume a client component that imports `useDocumentAtts` from `@hooks`.
 *
 * Minimal automatic application:
 *
 * ```tsx
 * function LocaleAttributes({ locale }: { locale: 'ar' | 'en' }) {
 *   useDocumentAtts({
 *     html: {
 *       attributes: { dir: locale === 'ar' ? 'rtl' : 'ltr', lang: locale },
 *     },
 *   })
 *   return null
 * }
 * ```
 *
 * Practical temporary body configuration:
 *
 * ```tsx
 * function Modal({ open }: { open: boolean }) {
 *   useDocumentAtts({
 *     body: {
 *       className: open ? 'modal-open' : undefined,
 *       style: { overflow: open ? 'hidden' : '' },
 *     },
 *   })
 *   return open ? <div className='modal'>...</div> : null
 * }
 * ```
 *
 * Imperative event-driven application:
 *
 * ```tsx
 * function LanguageSwitcher({ locale }: { locale: 'ar' | 'en' }) {
 *   const { Set } = useDocumentAtts()
 *   return (
 *     <button
 *       onClick={() =>
 *         Set({
 *           html: { attributes: { dir: locale === 'ar' ? 'rtl' : 'ltr', lang: locale } },
 *         })
 *       }
 *     >
 *       Apply
 *     </button>
 *   )
 * }
 * ```
 *
 * `Set` is the action, not an event-handler factory, so call it inside the event callback as shown above.
 *
 * ## Errors, edge cases, and limitations
 * - The hook is client-only because the file begins with `'use client'` and the implementation accesses `document`.
 * - `Set` and the effect return early when `document` is unavailable. There is no separate error or retry state.
 * - The implementation does not explicitly check that `document.documentElement` or `document.body` exists before
 *   applying attributes; call the hook in a browser lifecycle where the document targets are available.
 * - A new `html` or `body` object reference causes the effect to clean up and reapply, even when its values are
 *   equivalent. Imperative changes made with `Set` can consequently be overwritten by a later effect cleanup or run.
 * - Cleanup restores the complete attribute snapshot. Changes made by other code after the snapshot was taken can
 *   be removed when cleanup runs.
 * - A configuration with `clearDefaultClassName: true` can clear the target class name, including when `className`
 *   is omitted or falsy. The previous class name is restored only by effect cleanup.
 *
 * ## AI agent guide
 * - Preserve the `'use client'` directive, the exported name `useDocumentAtts`, and the returned `{ Set }` shape.
 * - Reuse `GlobalElementEssentials` and the existing `applyAtts`, `snapshotAtts`, and `restoreAtts` helpers when
 *   extending behavior. Do not introduce `attrs` or `classList` as alternative API names without changing the
 *   public contract intentionally.
 * - Keep the snapshot/restore invariant intact: an effect-owned update must restore the target's attributes to the
 *   state captured before that effect run.
 * - Check `src/@types/Global.ts`, `src/hooks/index.ts`, and in-project consumers before changing the accepted
 *   fields or import surface. The inspected search found no direct in-project consumer beyond this hook's barrel
 *   export.
 * - The file appears manually maintained; no generated-file marker is present. Project checks available in
 *   `package.json` include `pnpm type:check`, `pnpm lint`, and `pnpm format:check`.
 * - Changing cleanup semantics, the `Set` contract, or the currently typed-but-ignored top-level `dir` and `ref`
 *   fields requires an explicit behavior decision rather than a documentation-only change.
 *
 * ## Related references
 * - `src/@types/Global.ts`: defines `GlobalElementEssentials` and `CSSProps` used by this hook.
 * - `src/@types/index.ts`: re-exports the global types available through the `@types` alias.
 * - `src/hooks/index.ts`: re-exports `useDocumentAtts` through the `@hooks` alias.
 * - `tsconfig.json`: confirms the `@hooks` and `@types` path aliases.
 * - `instructions/code-rules.md`: applicable TypeScript and React project guidance.
 *
 * @param props Optional initial configuration for the `html` and `body` targets.
 * @returns An object containing `Set`, an imperative function that applies a target configuration immediately
 *   in the browser and returns `undefined`.
 *
 * @see `GlobalElementEssentials` in `src/@types/Global.ts` for the shared target field type.
 */
export function useDocumentAtts(props?: UseDocumentAttsProps) {
  const { html, body } = props ?? {}

  function Set({ html, body }: UseDocumentAttsProps) {
    if (typeof document === 'undefined') return

    if (html) applyAtts(document.documentElement, html)
    if (body) applyAtts(document.body, body)
  }

  useEffect(() => {
    if (typeof document === 'undefined') return

    const htmlElement = document.documentElement
    const bodyElement = document.body
    const htmlSnapshot = html ? snapshotAtts(htmlElement) : null
    const bodySnapshot = body ? snapshotAtts(bodyElement) : null

    Set({ html, body })

    return () => {
      if (htmlSnapshot) restoreAtts(htmlElement, htmlSnapshot)
      if (bodySnapshot) restoreAtts(bodyElement, bodySnapshot)
    }
  }, [html, body])

  return { Set }
}

/**
 * Documentation metadata:
 * - Last documentation update: 2026-09-18
 * - Documentation audience: Developers and AI agents
 * - Evidence basis: Attached file + verified project context
 * - Documentation coverage: Complete
 * - Validation: `pnpm exec prettier --check`, `pnpm exec eslint`, and `pnpm type:check` passed.
 * - Known limitations: Top-level `dir` and `ref` are typed but ignored; no dedicated test was found.
 */
