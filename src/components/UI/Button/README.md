# Button UI Unit

## Overview

`src/components/UI/Button` is the shared client-side button unit for actions,
localized navigation links, loading states, icon composition, tooltips, and
optional dialog triggers.

The folder contains three connected files:

| File         | Responsibility                                                                                                                                                                                            |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.tsx`  | Defines the `Button` component, its prop unions, size/corner class maps, and the public button API. It chooses the rendered element, builds classes, composes content, and attaches the optional tooltip. |
| `Action.tsx` | Defines `Action`, a `Button` wrapper with internal open/show state for an optional `Dialog`.                                                                                                              |
| `Colors.ts`  | Defines the semantic color maps used by `Button` and exposes helpers for resolving the mapped Tailwind classes.                                                                                           |

`src/components/index.ts` re-exports all three files, so the normal project
entry point is `@components` rather than a relative import into this folder.

This unit is responsible for button presentation and interaction composition.
It does not perform network requests, persistence, form submission logic,
authentication, or asynchronous loading management. A `loading` prop changes
the rendered button content; it does not automatically set `disabled` or
cancel an existing action.

## When To Use

Use `Button` when a control needs one or more of the following:

- A semantic project color, variant, size, corner style, or shared animation.
- A native button action with a typed `onClick`, `disabled`, and `type`.
- Localized client-side navigation through the project's `@i18n` `Link`.
- A native anchor for downloads or an explicitly requested hard reload.
- A loading icon/title, leading or trailing Iconify icon, or tooltip.
- Conditional rendering through `condition`.

Use `Action` when the button should open and close a `Dialog` using internal
state. Use `Button` directly when the parent already owns dialog state or when
the control is not a dialog trigger.

Use `variant="custom"` when the caller must supply the visual classes itself.
Use the normal variants when the shared semantic styling should remain intact.

Prefer another component when the control is not a button or link action. For
example, do not use `Action` merely to render a normal button when no dialog is
needed.

## Developer Guide

### Prerequisites

All files in this folder are client components or are consumed by a client
component. `Button` calls `useTranslations('common')`, and `ButtonColors`
calls `useTheme()`. The component therefore needs the project's active
`NextIntlClientProvider` and `ThemeProvider` contexts.

The standard `ClientLayout` already supplies these providers in this order:
`NextIntlClientProvider`, `ResponsiveProvider`, `ThemeProvider`, then the
application libraries and children. `useTheme()` throws when no
`ThemeProvider` is present.

The component also relies on the shared `Icon`, `Tooltip`, `Dialog`, `cn`, and
the i18n-aware `Link` exports. The TypeScript aliases used by the source are
configured in `tsconfig.json`.

### Import

```tsx
import { Button } from '@components'
```

Import `Action` or the color helpers from the same barrel when needed:

```tsx
import { Action, ButtonColors, ButtonColorsClass } from '@components'
```

### Basic usage

Illustrative example. The surrounding component must be a client component
inside the providers described above.

```tsx
'use client'

import { Button } from '@components'
import { useTranslations } from 'next-intl'

export function ExampleAction() {
  const b = useTranslations('common.buttons')

  return <Button title={b('form')} onClick={() => undefined} />
}
```

`type` defaults to `button`, so a regular `Button` does not submit a form unless
the caller sets `type="submit"`.

### Navigation usage

When `href` is present and neither `download` nor `hardReload` is true, the
component renders the project's `@i18n` `Link`. When either `download` or
`hardReload` is true, it renders a native `<a>` instead.

Illustrative example:

```tsx
<Button href="/account" title={b('form')} />
<Button href="/files/report.pdf" download title={b('form')} />
<Button href="/account" hardReload title={b('form')} />
```

The exact route and translation key must exist in the application context. The
`locale`, `target`, `referrerPolicy`, `onClick`, and `download` props are
forwarded according to the selected link/anchor mode.

### Icons, loading, and tooltips

`startIcon`, `endIcon`, and `loaderIcon` accept the shared `IconType`, which is
an Iconify icon string or Iconify icon object. Their associated `*Props`
values are forwarded to `Icon`.

Content precedence is fixed:

1. `loading` renders `loaderIcon` and, only when `title` is truthy, `loaderTitle`
   or the `common.loading` translation.
2. Otherwise, if `title`, `startIcon`, or `endIcon` is provided, the component
   renders the icon/title composition.
3. Otherwise, it renders `children`.

`title` is the component's displayed content prop. It is not the native HTML
`title` attribute. Use the relevant `attributes` object when a native title or
ARIA label is needed.

Tooltips are enabled by default. With `showTooltip` true, the button/link gets
the generated tooltip data attributes and a `Tooltip` instance is rendered.
Set `showTooltip={false}` when no tooltip instance or tooltip data attributes
should be created. `tooltip` is the tooltip content, and `tooltipProps` customizes
the rendered `Tooltip` except for its `content` prop.

Illustrative example:

```tsx
<Button
  title={b('formClose')}
  startIcon="zondicons:close-outline"
  tooltip={b('formClose')}
  color="third"
  onClick={() => undefined}
/>
```

### Dialog action usage

`Action` accepts all `ButtonProps` plus an optional `dialog`. When the `dialog`
property is present, its `content` field is passed as the dialog children. A
click first toggles the internal dialog state and then invokes the caller's
`onClick`, if supplied.

Illustrative example:

```tsx
<Action
  title={b('form')}
  dialog={{
    content: <div>{b('form')}</div>,
    position: 'center',
  }}
  onClick={() => undefined}
/>
```

`Action` defaults its button color to `second`. The wrapped `Dialog` otherwise
uses its own defaults, including portal rendering, an overlay, Escape closing,
and overlay-click closing. The `Dialog` component owns the actual close
transition and portal rendering.

Avoid passing `dialog={undefined}` when no dialog is intended. `Action` checks
whether the property exists with `Object.hasOwn`, so an explicitly present but
undefined `dialog` is still treated as a dialog-enabled action.

## Public API

### `Button` and shared types

`ButtonProps` is the intersection of `ButtonBaseProps` with a discriminated
element-prop union. A regular button uses `RegularButtonProps`; a link uses
`LinkButtonProps`.

| Prop/type                         | Accepted values or shape                                                                                              | Default/behavior                                                                                      |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `variant`                         | `fill`, `outline`, `text`, `custom`                                                                                   | `fill`; `custom` leaves generated variant styling to `className`.                                     |
| `color`                           | `primary`, `secondary`, `success`, `error`, `warning`, `info`, `main`, `second`, `third`, `black`, `white`, `inherit` | `primary`; `inherit` adds `text-inherit bg-inherit` instead of a mapped semantic color.               |
| `size`                            | `tiny`, `small`, `default`, `large`, `larger`, `huge`, `extreme`, `none`                                              | `default`; `none` retains the base gap but omits generated text/font/space classes.                   |
| `corner`                          | `small`, `large`, `circle`, `full`, `sharp`                                                                           | `small`.                                                                                              |
| `borderThick`                     | `number`                                                                                                              | `1`; only affects `outline`, which uses `border` for `1` and `border-{number}` for larger values.     |
| `animate`                         | `boolean`                                                                                                             | `true`; enables hover/focus transform classes for non-loading, non-disabled `fill`/`outline` buttons. |
| `className`                       | `string`                                                                                                              | Appended to the generated class list.                                                                 |
| `style`                           | `CSSProps`                                                                                                            | Inline CSS and custom properties forwarded to the rendered element.                                   |
| `tooltip`                         | `string` or `null`                                                                                                    | Optional tooltip content.                                                                             |
| `showTooltip`                     | `boolean`                                                                                                             | `true`; controls tooltip data attributes and the rendered `Tooltip`.                                  |
| `tooltipProps`                    | Partial `TooltipProps` without `content`                                                                              | Passed to `Tooltip`; a supplied `id` overrides the generated ID.                                      |
| `loading`                         | `boolean`                                                                                                             | When truthy, replaces normal content with the loader composition. It does not disable the control.    |
| `loaderTitle`                     | `ReactNode` or `ReactNode[]`                                                                                          | Used during loading only when `title` is truthy; otherwise `common.loading` is used.                  |
| `loaderIcon`                      | `IconType`                                                                                                            | `eos-icons:bubble-loading`.                                                                           |
| `loaderIconProps`                 | `IconProps`                                                                                                           | Forwarded to the loader `Icon`.                                                                       |
| `title`                           | `ReactNode` or `ReactNode[]`                                                                                          | Display content used before `children`.                                                               |
| `startIcon` / `endIcon`           | `IconType`                                                                                                            | Optional leading/trailing icon.                                                                       |
| `startIconProps` / `endIconProps` | `IconProps`                                                                                                           | Forwarded to the matching `Icon`; default font size is `1.25em`.                                      |
| `children`                        | `ReactNode` or `ReactNode[]`                                                                                          | Rendered only when not loading and no title/icon composition is active.                               |
| `condition`                       | `boolean`                                                                                                             | When exactly `false`, `Button` renders nothing.                                                       |

`buttonSizes` is the exported size-to-class map. Its entries expose `text`,
`font`, and `space` class groups. `buttonCorners` is the exported corner-to-
class map.

`RegularButtonProps` adds:

- `ref?: Ref<HTMLButtonElement>`.
- `disabled`, `onClick`, and `type` from `ButtonHTMLAttributes`.
- `attributes`, which accepts remaining button attributes while excluding
  `disabled`, `onClick`, `type`, `style`, and `className`.

`LinkButtonProps` adds:

- `ref?: Ref<HTMLAnchorElement>` and `href`.
- `hardReload?: boolean`.
- `target`, `referrerPolicy`, `onClick`, `locale`, and `download`.
- `attributes`, which excludes the component-managed link fields and retains
  `title` and `aria-label` from anchor attributes.

The link and regular-button prop shapes intentionally do not allow the
element-specific props on the other element. For example, a link-shaped
`Button` cannot receive `disabled` or `type` through the public type contract.

### `Action` and `ActionProps`

`ActionProps` is `ButtonProps` plus:

| Prop     | Shape                                                                    | Behavior                                                                                                                       |
| -------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `dialog` | Optional `DialogProps` plus required `content: ReactNode \| ReactNode[]` | When the property is present, `Action` toggles internal `open`/`show` state and passes the remaining dialog props to `Dialog`. |

`Action` does not expose its internal `open`, `show`, or state setters. Use
`Button` with `Dialog` directly when the parent must control those values.

### `ButtonColors` and color types

`ButtonColors(color, variant)` returns a partial object containing `border`,
`background`, and/or `text` Tailwind semantic classes. The supported mapped
variants are `fill`, `outline`, and `text`; `custom` is intentionally not a
color-map variant.

The mapped semantic colors are `primary`, `secondary`, `success`, `error`,
`warning`, `info`, `main`, `second`, `third`, `black`, and `white`. The
`inherit` button color is handled directly by `Button` and returns no entry
from the map.

Examples of confirmed mappings:

```ts
ButtonColors('primary', 'outline')
// { border: 'border-primary', text: 'text-primary' }

ButtonColorsClass('primary', 'outline')
// 'border-primary text-primary'
```

Some `fill` text classes use `themeResponsive`, so the returned text class can
change with the active light/dark theme. For example, the `fill`/`primary`
mapping uses `bg-primary`, `border-primary`, and `text-white` in light mode or
`text-black` in dark mode.

`ButtonColorsReturnProps` describes the partial class object.
`ButtonColorsMapProps` describes the complete `fill`/`outline`/`text` map
shape.

## Rendering And State Rules

| Situation                                     | Result                                                                                                |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| No truthy `href`                              | Native `<button>` with the regular-button props.                                                      |
| Truthy `href`, no `download`, no `hardReload` | i18n-aware `Link` from `@i18n`.                                                                       |
| Truthy `href` plus `download` or `hardReload` | Native `<a>`.                                                                                         |
| `condition === false`                         | No wrapper or tooltip is returned.                                                                    |
| `disabled === true`                           | Native button disabled state is applied only in button mode; link mode does not accept this prop.     |
| `loading === true`                            | Loader content and a not-allowed cursor are rendered, but no automatic disabled attribute is applied. |
| `showTooltip === false`                       | No tooltip data attributes are attached and no `Tooltip` is rendered.                                 |
| `variant === 'custom'`                        | Shared base classes remain, while generated size, corner, and mapped variant classes are omitted.     |

`ButtonColors` always calls `useTheme`, including when a custom variant is
requested. A `ThemeProvider` is therefore still required for custom buttons.

## Errors, Edge Cases, And Limitations

- No error state or retry behavior is implemented. Errors from a caller's
  `onClick` or from a surrounding operation are not caught by this unit.
- `loading` is visual/content state only. Disable the regular button separately
  when repeated activation must be prevented. For links, implement any
  equivalent guard in the caller's handler or surrounding state.
- `condition` only suppresses rendering when it is exactly `false`; omitted or
  otherwise truthy values render normally.
- Passing `title` changes the content source and prevents `children` from being
  used. This is different from setting an HTML `title` attribute.
- `borderThick` is converted into a Tailwind class for values greater than `1`.
  The class must exist in the project's generated CSS for the visual result to
  appear.
- `ButtonColors` does not define a mapped result for `inherit` or `custom`.
  `Button` handles `inherit` separately and custom styling belongs in
  `className`.
- An unmapped color/variant combination returns an empty color map. The public
  TypeScript types prevent most unsupported combinations, but runtime casts can
  still reach this fallback.
- `Action` uses the presence of the `dialog` property, not the truthiness of
  its value, to decide whether a click toggles dialog state.
- `Action` relies on `Dialog`'s client-side portal behavior when its defaults
  are used. It is not a server-only component.
- No Button-specific test files were found during the folder review. The
  available project validation scripts are `pnpm type:check`, `pnpm lint`, and
  `pnpm format:check`.

## AI Agent Guide

### Contract to preserve

- Keep the `'use client'` directives and provider requirements intact.
- Preserve the public exports from `src/components/index.ts` and the current
  prop unions that distinguish button and link rendering.
- Preserve the content precedence of loading, title/icon composition, and
  children.
- Preserve the `href` selection rules for `Link` versus native `<a>`.
- Preserve the `condition === false` no-render behavior and tooltip default.
- Preserve `Action`'s click order: toggle dialog state first, then invoke the
  supplied `onClick`.
- Preserve the `ButtonColors` map's semantic Tailwind tokens and its theme-aware
  text behavior.

### Safe extension points

- Add a new shared button size only by updating the public size type and the
  matching `buttonSizes` entry together.
- Add or change a corner style by updating `buttonCorners` and its public union
  together.
- Add a semantic color only after checking `colorNames`, the global Tailwind
  design tokens, the `ButtonColor` exclusion, and all `fill`/`outline`/`text`
  map entries.
- Extend dialog behavior through the existing `DialogProps` contract rather
  than duplicating portal, overlay, or close-state logic in `Action`.
- Reuse `Icon`, `Tooltip`, `Link`, `cn`, and `UseToggle`; do not introduce a
  second icon, routing, tooltip, or class-composition abstraction for this unit.

### Files and consumers to check before changes

- `src/components/index.ts` for the public barrel exports.
- `src/components/UI/Dialog.tsx` and `src/hooks/Helpers.ts` before changing
  `Action` state or close behavior.
- `src/components/UI/Icon.tsx` and `src/components/UI/Tooltip.tsx` before
  changing icon or tooltip props.
- `src/contexts/Theme.tsx`, `src/@types/Global.ts`, and the global CSS tokens
  before changing colors or theme behavior.
- Existing consumers such as `Dropdown.tsx`, `Image.tsx`, and `Forms/Dialog.tsx`
  before changing defaults or element-specific props.
- `instructions/code-rules.md` and the project scripts in `package.json` before
  changing TypeScript or validation behavior.

The folder contains manually maintained source files; no generated marker was
observed. Changes to public types, defaults, translation keys, route behavior,
or dialog semantics should be treated as API changes and reviewed with their
consumers.

## Related References

- `src/components/UI/Button/index.tsx`
- `src/components/UI/Button/Action.tsx`
- `src/components/UI/Button/Colors.ts`
- `src/components/index.ts`
- `src/components/Layouts/Client.tsx`
- `src/components/UI/Dialog.tsx`
- `src/components/UI/Icon.tsx`
- `src/components/UI/Tooltip.tsx`
- `src/components/UI/Dropdown.tsx`
- `src/components/UI/Image.tsx`
- `src/components/Forms/Dialog.tsx`
- `src/contexts/Theme.tsx`
- `src/hooks/Helpers.ts`
- `src/hooks/classNames.ts`
- `src/@types/Global.ts`
- `src/i18n/index.ts`
- `tsconfig.json`
- `instructions/code-rules.md`
- `package.json`

## Documentation Metadata

- Last documentation update: 2026-09-18
- Documentation audience: Developers and AI agents
- Evidence basis: Attached folder files + verified project context
- Documentation coverage: Complete
- Validation: Passed `pnpm exec prettier --check src/components/UI/Button/README.md` and `pnpm type:check`; `git diff --check` completed without errors. Prettier emitted the repository's existing Node module-type warning, and Git emitted an LF-to-CRLF warning for `pnpm-lock.yaml`.
- Known limitations: No Button-specific automated tests were found; runtime behavior was documented from source and inspected consumers.
