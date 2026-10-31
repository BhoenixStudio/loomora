# Loomora

Loomora is a TypeScript React library of composable UI components, form inputs, hooks, metadata databases, and shared configuration defaults for product teams. Everything is exported from the package root, `loomora`.

---

## Table of Contents

1. [Features](#features)
2. [Requirements & Installation](#requirements--installation)
3. [Styling & Setup (Tailwind & Non-Tailwind)](#styling--setup)
4. [Core Concepts & Configuration (`LoomoraProvider`)](#core-concepts--configuration)
5. [UI Components](#ui-components)
   - [`Accordion`](#accordion)
   - [`Button`](#button)
   - [`Dialog`](#dialog)
   - [`Digit` & `UseDigit`](#digit--usedigit)
   - [`Dropdown`](#dropdown)
   - [`Flag`](#flag)
6. [Form Fields](#form-fields)
   - [Shared Form Field Props](#shared-form-field-props)
   - [`Label` & `InputHelper`](#label--inputhelper)
   - [`TextField`](#textfield)
   - [`SearchField`](#searchfield)
   - [`TextareaField`](#textareafield)
   - [`NumberField`](#numberfield)
   - [`SelectField`](#selectfield)
   - [`AutocompleteField`](#autocompletefield)
   - [`CheckField`](#checkfield)
   - [`PinField`](#pinfield)
   - [`PasswordField`](#passwordfield)
   - [`PhoneInput`](#phoneinput)
   - [`DateField` (`DatePickerField`)](#datefield-datepickerfield)
   - [`ColorField`](#colorfield)
   - [`RangeField`](#rangefield)
   - [`RatingField`](#ratingfield)
   - [`UploaderField`](#uploaderfield)
   - [`TextEditorField`](#texteditorfield)
7. [Form Composition (`Form`, `Inputs`, `Input`)](#form-composition)
8. [Partials & Helper Components](#partials--helper-components)
   - [`Breadcrumbs`](#breadcrumbs)
   - [`Copyrights`](#copyrights)
   - [`Loader`](#loader)
   - [`ProgressBar`](#progressbar)
   - [`ConditionalWrapper`](#conditionalwrapper)
   - [`Content` & `useContent`](#content--usecontent)
9. [Hooks & Utilities](#hooks--utilities)
   - [State & Context (`useLoomora`, `useTheme`, `useStorageState`)](#state--context-hooks)
   - [DOM & Layout (`useResponsive`, `useContextMenu`, `useClickAway`, `useFloatPos`)](#dom--layout-hooks)
   - [Data, Formatting & Helpers (`useChrono`, `useHue`, `useAdapt`, `cx`, `UseCase`, etc.)](#data-formatting--helper-utilities)
   - [Validation (`useStrict`)](#validation-hooks)
   - [Static Metadata Databases (`useCountries`, `useTimezones`, `useSocials`)](#static-metadata-databases)
10. [Development & Repository Scripts](#develop-in-this-repository)
11. [License](#license)

---

## Features

- **UI Primitives**: `Accordion`, `Button`, `Dialog`, `Digit`, `Dropdown`, and `Flag`.
- **16 Form Building Blocks**: `Form`, `Inputs`, `Input`, `Label`, `InputHelper`, `TextField`, `SearchField`, `TextareaField`, `NumberField`, `SelectField`, `AutocompleteField`, `CheckField`, `PinField`, `PasswordField`, `PhoneInput`, `DateField`, `ColorField`, `RangeField`, `RatingField`, `UploaderField`, and `TextEditorField`.
- **Partials & Layout Helpers**: `Breadcrumbs`, `Copyrights`, `Loader`, `ProgressBar`, `ConditionalWrapper`, and `Content`.
- **React Hooks & Utilities**: Date formatting and relative time (`useChrono`), viewport breakpoints (`useResponsive`), theme management (`useTheme`), reactive storage (`useStorageState`, `localStore`, `sessionStore`, `cookie`), right-click context menus (`useContextMenu`), floating positioning (`useFloatPos`, `useClickAway`), schema validation (`useStrict`), color space conversion (`useHue`), and string/DOM helpers.
- **Built-in Metadata Databases**: Zero-network synchronous hooks for 240+ countries (`useCountries`), IANA timezones (`useTimezones`), and social platforms (`useSocials`).
- **Recursive Configuration (`LoomoraProvider`)**: Works out of the box with zero configuration, or wrap your app (or any subtree) to override styles, icons, defaults, and translations.
- **Universal Styling**: Ships a pre-compiled standalone stylesheet (`loomora/dist/index.css`) for non-Tailwind projects and supports native class scanning in Tailwind CSS v3 and v4.

---

## Requirements & Installation

### Requirements

- **Node.js**: `>=20.19.0`
- **Peer Dependencies**:
  - `react`: `>=18.2.0 <20`
  - `react-dom`: `>=18.2.0 <20`
  - `@tinymce/tinymce-react`: `>=6.3.0` *(required when using `TextEditorField`)*

### Install

```sh
# npm
npm install loomora

# pnpm
pnpm add loomora

# Yarn
yarn add loomora
```

If your application does not already have the peer dependencies installed:

```sh
pnpm add react react-dom @tinymce/tinymce-react
```

---

## Styling & Setup

Loomora works in both **non-Tailwind** and **Tailwind CSS** projects.

### 1. Non-Tailwind Projects (Vite, Next.js, Remix, Vanilla CSS)

Import Loomora's pre-compiled stylesheet once in your root entry file (`main.tsx`, `index.tsx`, or `app/layout.tsx`). It includes all required utility classes, `--loomora-*` theme variables, and keyframe animations without an aggressive global preflight reset:

```tsx
import 'loomora/dist/index.css'
import { Button, LoomoraProvider } from 'loomora'

export default function App() {
  return (
    <LoomoraProvider>
      <Button title="Get Started" variant="fill" color="info" />
    </LoomoraProvider>
  )
}
```

### 2. Tailwind CSS v4 Projects

Add the `@source` directive in your main CSS file (`globals.css` or `app.css`) so Tailwind scans Loomora's components, and import `loomora/dist/index.css` (or use `LoomoraProvider`, which imports the stylesheet automatically):

```css
@import 'tailwindcss';
@source '../node_modules/loomora';
```

### 3. Tailwind CSS v3 Projects

Add `./node_modules/loomora/**/*.{js,ts,jsx,tsx}` to your `tailwind.config.js` `content` array and import `loomora/dist/index.css` in your root entry file:

```js
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/loomora/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Theme CSS Custom Properties

Override any `--loomora-*` CSS variable in `:root` or `.dark` to customize the palette:

```css
:root {
  --loomora-primary: #f37035;
  --loomora-secondary: #173e58;
  --loomora-success: #1a841f;
  --loomora-error: #c92020;
  --loomora-warning: #efd002;
  --loomora-info: #0c86f2;
  --loomora-star: #cdb001;
  --loomora-main: #f5f7fa;
  --loomora-second: #ffffff;
  --loomora-third: #e7ebf0;
  --loomora-title-1: #18212b;
  --loomora-title-2: #344252;
  --loomora-title-3: #485769;
  --loomora-body-1: #475569;
  --loomora-body-2: #66758a;
  --loomora-body-3: #8390a1;
}
```

---

## Core Concepts & Configuration

Every Loomora component and hook works **without** `LoomoraProvider` by reading [`loomoraDefaults`](./src/config/defaults.ts). Wrap your application (or a specific subtree) with `LoomoraProvider` when you want to override defaults, icons, class names, or translations.

- **Recursive Deep Merge**: Passing `{ button: { defaultColor: 'success' } }` only updates `button.defaultColor`—all other `button` sizes, corners, and colors keep their built-in defaults.
- **Nested Inheritance**: Nested `LoomoraProvider` instances inherit their parent provider's resolved configuration and merge their overrides on top.
- **Included Providers**: `LoomoraProvider` automatically wraps children with `ResponsiveProvider` and `ThemeProvider`.

```tsx
'use client'

import type { ReactNode } from 'react'
import { LoomoraProvider } from 'loomora'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LoomoraProvider
      config={{
        button: { defaultColor: 'success', defaultLoadingTitle: 'Please wait...' },
        settings: { isRtl: false, locale: 'en' },
        translations: {
          socials: {
            github: { name: 'GitHub', placeholder: 'e.g. octocat' },
          },
        },
      }}
    >
      {children}
    </LoomoraProvider>
  )
}
```

### Configuration Sections Overview (`LoomoraConfigP`)

| Config Path               | Purpose                                                                                                    |
| ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `LinkType`                | Custom link component (e.g. Next.js `Link`) used when `Button` renders an `href`. Default: `'a'`.          |
| `flagResource`            | URL template for country flag SVGs. Default: `'https://flagcdn.com/{key}.svg'`.                            |
| `settings`                | Global `{ isRtl: boolean, locale: string }` (`false`, `'en'`).                                             |
| `theme`                   | Default theme mode (`'LIGHT'`), storage keys, dynamic start/end times, view transition flag, mode icons.   |
| `responsive`              | Breakpoint widths (`xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`).                                            |
| `button`                  | `defaultType`, `defaultColor`, `defaultLoadingTitle`, `colors` (`fill`/`outline`/`text`), `corners`, `sizes`. |
| `breadcrumbs`             | `defaultSeparator` (`'|'`).                                                                                |
| `form.label`              | Floating label element (`as`), `showRequiredIndicator`, and active/inactive class names.                   |
| `form.fieldset`           | Default wrapper class names for fieldsets.                                                                 |
| `form.textField`          | Default input class names for `TextField`.                                                                 |
| `form.textareaField`      | Default class names and `defaultRows` (`2`) for `TextareaField`.                                           |
| `form.searchField`        | Default `searchIcon` and `clearIcon`.                                                                      |
| `form.selectField`        | Default `triggerIcon`, `optionClassName`, and `optionGroupClassName`.                                      |
| `form.checkField`         | Default `checkIcon`, `color`, and `activeColor`.                                                           |
| `form.passwordField`      | Length/character validation rules, strength progress colors, action flags (`hasShow`, `hasCopy`, `hasGenerate`), icons. |
| `form.pinField`           | Default cell `length` (`6`) and cell `className`.                                                          |
| `form.rangeField`         | Default `step`, `showMinMax`, `showValue`, `valuePrefix`, `valueSuffix`, and `className`.                  |
| `form.colorField`         | Default `presets` (`Set<string>`), `alpha` (`true`), and `allowEmpty` (`true`).                            |
| `form.phoneField`         | `worldwide`, `codePrefix` (`'+'`), `showCountriesName`, `showCountriesFlags`, `selectedCountriesOnly`.     |
| `form.autoCompleteField`  | `triggerIcon`, `multiple`, `searchable`, `searchViaLabel`, `showClearSearch`, clear/tag icons.             |
| `form.uploaderField`      | Default accepted categories, size/count limits, drag/drop & paste flags, and file category icons.          |
| `form.numberField`        | `decimalSeparator` (`'.'`), `thousandSeparator` (`','`), `decimalsMin` (`0`), `decimalsMax` (`3`).         |
| `form.ratingField`        | `max` (`5`), `step` (`1`), `allowClear` (`true`), `iconSize` (`24`), and active/inactive classes.          |
| `form.dateField`          | `firstDayOfWeek`, `hour12`, `timeFormat`, `showSeconds`, `minuteStep`, `allowClear`, icons, and `presets`. |
| `translations.*`          | Localized strings for `socials`, `countries`, `timezones`, `dates`, `form`, `searchField`, `passwordField`, `phoneField`, `autoCompleteField`, `uploaderField`, `dateField`, `textEditorField`, and `settings`. |

---

## UI Components

### `Accordion`

Animated disclosure section with an accessible title trigger and smooth grid-row collapse transition.

```tsx
import { Accordion } from 'loomora'

<Accordion title="Account details" initialCollapsed hasEffects>
  <p>Content revealed when the section is expanded.</p>
</Accordion>
```

- **Key Props**: `title` (`ReactNode`), `children` (`ReactNode`), `initialCollapsed` (`boolean`, default `false`), `setOpen` (`(collapsed: boolean) => void`), `allTitleClickable` (`boolean`, default `true`), `hasEffects` (`boolean`, default `false`), `index` (`number`, default `1`), `childrenClassName` (`string`), `condition` (`boolean`, default `true`).

### `Button`

Polymorphic action button or link (renders `LinkType` when `href` is passed) with variants, colors, sizes, corners, and loading states.

```tsx
import { Button } from 'loomora'

<Button
  title="Save changes"
  variant="fill"
  color="info"
  size="default"
  corner="default"
  loading={isSaving}
  onClick={() => handleSave()}
/>
```

- **Key Props**:
  - `variant`: `'fill' | 'outline' | 'text' | 'none'` (default `'fill'`)
  - `color`: `'info' | 'success' | 'warning' | 'error' | 'inherit'` or custom config color key (default `button.defaultColor`)
  - `size`: `'tiny' | 'small' | 'default' | 'large' | 'larger' | 'huge' | 'extreme' | 'none'` (default `'default'`)
  - `corner`: `'small' | 'default' | 'large' | 'circle' | 'full' | 'sharp'` (default `'default'`)
  - `title` (`ReactNode`), `startIcon` / `endIcon` (`ReactNode`), `loading` (`boolean`), `loaderTitle` (`ReactNode`), `animate` (`boolean`, default `true`), `borderThick` (`number`, default `1`), `href` (`string`), `disabled` (`boolean`), `type` (`'button' | 'submit' | 'reset'`), `condition` (`boolean`).

### `Dialog`

Modal or slide-over panel with backdrop overlay, Escape/outside-click dismissal, portal rendering, and directional transitions. Use the `fade` helper to coordinate `open` and `show` states cleanly.

```tsx
import { useState } from 'react'
import { Button, Dialog, fade } from 'loomora'

export function ModalExample() {
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)

  return (
    <>
      <Button title="Open Dialog" onClick={() => fade('in', { open, setOpen, setShow })} />
      <Dialog open={open} setOpen={setOpen} show={show} setShow={setShow} position="center" width="420px">
        <div className="p-6">Dialog content</div>
      </Dialog>
    </>
  )
}
```

- **Key Props**: `open` / `setOpen` (required), `show` / `setShow`, `position` (`'center' | 'top' | 'bottom' | 'left' | 'right' | 'start' | 'end'`, default `'center'`), `width` / `minWidth`, `hasOverlay` (`true`), `closeOnOverlayClick` (`true`), `closeOnEsc` (`true`), `usePortal` (`true`), `renderInBackground` (`false`), `onClose` (`() => void`).

### `Digit` & `UseDigit`

Locale-aware numeric formatter component (`Digit`) and string helper (`UseDigit`) for prices, percentages, and measurements.

```tsx
import { Digit, UseDigit } from 'loomora'

<Digit value={12845.75} decimalsMin={2} decimalsMax={2} endUnit="USD" />
// Or get a formatted string directly:
const label = UseDigit({ value: 12845.75, decimalsMin: 2, decimalsMax: 2 })
```

- **Key Props**: `value` (`number | string`), `decimalsMin` (`number`), `decimalsMax` (`number`), `startUnit` / `endUnit` (`ReactNode`), `currency` (`CountryCurrency`), `locale` (`string`), `signDisplay` (`Intl.NumberFormatOptions['signDisplay']`).

### `Dropdown`

Button-anchored menu that flips automatically when near viewport edges and closes on outside clicks.

```tsx
import { Dropdown } from 'loomora'

<Dropdown trigger="More actions" position="BOTTOM_START">
  {(close) => (
    <div className="p-2">
      <button onClick={close}>Edit item</button>
    </div>
  )}
</Dropdown>
```

- **Key Props**: `trigger` (`ReactNode` or `ButtonProps`), `children` (`ReactNode | ((close: () => void) => ReactNode)`), `staticPosition` (`boolean`, default `false`), `position` (`'TOP_START' | 'TOP_END' | 'BOTTOM_START' | 'BOTTOM_END'`), `menuClassName` (`string`), `onToggle` (`(opened: boolean) => void`).

### `Flag`

Country flag image component with aspect ratio presets and automatic country-code fallback if the SVG fails to load.

```tsx
import { Flag } from 'loomora'

<Flag country="OM" size={28} ratio="3x2" />
```

- **Key Props**: `country` (`CountryType`, ISO-3166 alpha-2 code), `size` (`number`, default `20`), `ratio` (`'3x2' | '1x1'`, default `'3x2'`), `fallback` (`ReactNode`), `setIsExist` (`(exists: boolean) => void`).

---

## Form Fields

### Shared Form Field Props

All Loomora form fields share a consistent wrapper and feedback contract:

| Prop                              | Type                                        | Description                                                                                      |
| --------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `label`                           | `ReactNode \| LabelProps`                   | Floating or static field label.                                                                  |
| `inputHelper`                     | `ReactNode \| InputHelperProps`             | Supporting helper message rendered below the field.                                              |
| `errors`                          | `{ condition: boolean; helper: ReactNode }[]` | Validation rules; switches field to error state and displays active error messages when `true`. |
| `loading`                         | `boolean`                                   | Displays a skeleton placeholder and blocks interaction while loading.                            |
| `active`                          | `boolean`                                   | Forces the floating label into its raised state.                                                 |
| `condition`                       | `boolean`                                   | Renders `null` when `false`.                                                                     |
| `size`                            | `ChildSize[]`                               | Responsive grid column spans (e.g. `['col-span-12', 'md:col-span-6']`) inside `Inputs` / `Form`. |
| `fieldset`                        | `GlobalElement<'fieldset'>`                 | Custom attributes/classes for the outer `<fieldset>`.                                            |
| `fieldsetPrefix / fieldsetSuffix` | `ReactNode`                                 | Content placed before or after the input wrapper inside the fieldset.                            |
| `prefix / suffix`                 | `ReactNode`                                 | Content placed inside the input border before or after the control.                              |
| `properties`                      | Component-specific input props              | Native and control-specific attributes (`value`, `onChange`, `placeholder`, `required`, etc.).   |

### `Label` & `InputHelper`

Standalone label and helper/error text primitives used by all form fields.

```tsx
import { InputHelper, Label } from 'loomora'

<Label required>Email address</Label>
<InputHelper>We will never share your email.</InputHelper>
<InputHelper asError role="alert">Invalid email address.</InputHelper>
```

### `TextField`

Floating-label text input with prefix/suffix slots, helper text, and error states.

```tsx
import { TextField } from 'loomora'

<TextField
  label="Full name"
  prefix="@"
  properties={{ value, onChange: (e) => setValue(e.target.value), required: true }}
  errors={[{ condition: !value, helper: 'Name is required.' }]}
/>
```

### `SearchField`

Composes `TextField` with search and clear action buttons plus `onSearch`, `onEnter`, and `onClear` callbacks.

```tsx
import { SearchField } from 'loomora'

<SearchField
  label="Search documentation"
  properties={{
    value: query,
    onChange: (e) => setQuery(e.target.value),
    onSearch: (val) => runSearch(val),
    onEnter: (val) => runSearch(val),
    onClear: () => setQuery(''),
  }}
/>
```

### `TextareaField`

Multiline text input with floating label, helper text, and error handling.

```tsx
import { TextareaField } from 'loomora'

<TextareaField
  label="Bio"
  properties={{ value: bio, onChange: (e) => setBio(e.target.value), rows: 4 }}
/>
```

### `NumberField`

Numeric text input that formats thousand separators, enforces min/max decimal places, and emits a parsed `number | undefined` on `onChange`.

```tsx
import { NumberField } from 'loomora'

<NumberField
  label="Price"
  decimalsMax={2}
  thousandSeparator=","
  allowNegative={false}
  properties={{ value: price, onChange: (e) => setPrice(e.target.value) }}
/>
```

### `SelectField`

Styled native `<select>` supporting flat options, `<optgroup>` groups, and a customizable trigger icon.

```tsx
import { SelectField } from 'loomora'

<SelectField
  label="Role"
  options={[
    { label: 'Developer', value: 'dev' },
    { label: 'Designer', value: 'design' },
  ]}
  properties={{ value: role, onChange: (e) => setRole(e.target.value) }}
/>
```

### `AutocompleteField`

Searchable single- or multi-select combobox with tag chips, selection count constraints, and custom option rendering.

```tsx
import { AutocompleteField } from 'loomora'

<AutocompleteField
  label="Assignees"
  options={[
    { label: 'Alex Rivera', value: 'alex' },
    { label: 'Sam Chen', value: 'sam' },
  ]}
  properties={{
    multiple: true,
    searchable: true,
    value: selected,
    onChange: (next) => setSelected(next),
  }}
/>
```

### `CheckField`

Unified `checkbox`, `radio`, and animated `switch` input control.

```tsx
import { CheckField } from 'loomora'

<CheckField
  label="Enable notifications"
  properties={{
    type: 'switch',
    checked: enabled,
    onChange: (e) => setEnabled(e.target.checked),
  }}
/>
```

### `PinField`

Fixed-length OTP / verification code input split across individual cells with keyboard navigation and clipboard paste distribution.

```tsx
import { PinField } from 'loomora'

<PinField
  label="Verification code"
  length={6}
  properties={{ value: digitsArray, onChange: setDigitsArray }}
/>
```

### `PasswordField`

Password input with show/hide toggle, copy-to-clipboard, random password generation, strength progress bar, and rule checklist.

```tsx
import { PasswordField } from 'loomora'

<PasswordField
  label="Password"
  hasShow
  hasCopy
  hasGenerate
  hasValidation
  onGenerate={(generated) => setPassword(generated)}
  properties={{ value: password, onChange: (e) => setPassword(e.target.value) }}
/>
```

### `PhoneInput`

International phone input combining a searchable country dial-code dropdown (with flags) and localized prefix validation.

```tsx
import { PhoneInput } from 'loomora'

<PhoneInput
  label="Phone number"
  properties={{
    defaultCountry: 'OM',
    value: phone,
    setValue: ({ value, finalValue }) => setPhone(value),
  }}
/>
```

### `DateField` (`DatePickerField`)

Comprehensive date and time picker supporting 6 modes (`date`, `datetime`, `time`, `dateRange`, `timeRange`, `dateTimeRange`), dual-month desktop calendars, time spinners, and quick presets.

```tsx
import { DateField } from 'loomora'

<DateField
  label="Appointment"
  properties={{
    mode: 'datetime',
    value: appointmentDate,
    onChange: (val) => setAppointmentDate(val),
    hour12: true,
    showPresets: true,
  }}
/>
```

### `ColorField`

Custom HSVA color picker popover with saturation/hue canvas, optional opacity slider (`alpha`), hex input, and preset swatches.

```tsx
import { ColorField } from 'loomora'

<ColorField
  label="Brand color"
  alpha
  allowEmpty
  properties={{ value: color, setValue: setColor, name: 'brandColor' }}
/>
```

### `RangeField`

Custom range slider with track fill, optional labeled marks, and min/max/current value readout.

```tsx
import { RangeField } from 'loomora'

<RangeField
  label="Volume"
  showValue
  showMinMax
  properties={{ value: volume, setValue: setVolume, min: 0, max: 100, step: 5 }}
/>
```

### `RatingField`

Accessible star rating control supporting half-star steps (`step: 0.5`), hover previews, keyboard arrow navigation, and native form submission.

```tsx
import { RatingField } from 'loomora'

<RatingField
  label="Quality rating"
  properties={{ value: rating, setValue: setRating, max: 5, step: 0.5, allowClear: true }}
/>
```

### `UploaderField`

Controlled file picker supporting drag-and-drop, clipboard paste, file type/size/count validation, and multiple preview layouts (`list`, `thumbs`, `background`, `pfp`).

```tsx
import { UploaderField } from 'loomora'

<UploaderField
  label="Attachments"
  properties={{
    multiple: true,
    accept: ['image', '.pdf'],
    maxFiles: 3,
    maxSize: 5,
    viewType: 'list',
    value: files,
    onChange: (previewFiles) => setFiles(previewFiles),
  }}
/>
```

### `TextEditorField`

Rich-text HTML editor wrapping `@tinymce/tinymce-react` with skeleton loading state and RTL/locale synchronization. Requires TinyMCE assets served at `/js/tinymce/tinymce.min.js`.

```tsx
import { TextEditorField } from 'loomora'

<TextEditorField
  label="Article content"
  properties={{
    value: html,
    onChange: setHtml,
    height: 360,
  }}
/>
```

---

## Form Composition

### `Form`, `Inputs`, & `Input`

Render single fields (`Input`), responsive 12-column grids of fields (`Inputs`), or complete forms with action buttons (`Form`) from a typed array of field definitions.

```tsx
import { Form } from 'loomora'

<Form
  inputs={[
    {
      type: 'text',
      label: 'First name',
      size: ['col-span-12', 'md:col-span-6'],
      properties: { value: firstName, onChange: (e) => setFirstName(e.target.value), required: true },
    },
    {
      type: 'date',
      label: 'Birth date',
      size: ['col-span-12', 'md:col-span-6'],
      properties: { mode: 'date', value: birthDate, onChange: setBirthDate },
    },
    {
      type: 'check',
      label: 'Accept terms and conditions',
      size: ['col-span-12'],
      properties: { type: 'checkbox', checked: accepted, onChange: (e) => setAccepted(e.target.checked) },
    },
  ]}
  actions={[
    { title: 'Save Profile', type: 'submit', color: 'info' },
  ]}
/>
```

- **Supported `Input` `type` discriminants**: `'text'`, `'search'`, `'textarea'`, `'number'`, `'select'`, `'autoComplete'`, `'check'`, `'pin'`, `'password'`, `'phone'`, `'date'` (or `'datePicker'`), `'color'`, `'range'`, `'rating'`, `'uploader'`, `'textEditor'`, `'divider'`, `'empty'`, and `'custom'`.

---

## Partials & Helper Components

### `Breadcrumbs`

Hierarchical navigation trail rendered with `Button` links and configurable separators.

```tsx
import { Breadcrumbs } from 'loomora'

<Breadcrumbs
  items={[
    { title: 'Home', href: '/' },
    { title: 'Components', href: '/components' },
    { title: 'Button', active: true },
  ]}
/>
```

### `Copyrights`

Dynamic year-range copyright and sponsor attribution line.

```tsx
import { Copyrights } from 'loomora'

<Copyrights startYear={2024} sponsor="Bhoenix Studio" sponsorLink="https://github.com/BhoenixStudio" />
```

### `Loader`

Animated skeleton placeholder blocks with `'rounded' | 'circle' | 'sharp' | 'square' | 'text'` variants.

```tsx
import { Loader } from 'loomora'

<Loader variant="text" counts={3} height="1rem" width="100%" />
```

### `ProgressBar`

Accessible progress bar with optional label and value readout.

```tsx
import { ProgressBar } from 'loomora'

<ProgressBar value={75} outOf={100} label="Upload progress" showValueAsText />
```

### `ConditionalWrapper`

Conditionally wraps children in a primary wrapper or optional fallback element without duplicating child JSX.

```tsx
import { ConditionalWrapper } from 'loomora'

<ConditionalWrapper
  childrenCondition={Boolean(href)}
  wrapper={{ as: 'a', attributes: { href } }}
  fallback={{ as: 'div', attributes: { className: 'opacity-70' } }}
>
  <span>Card content</span>
</ConditionalWrapper>
```

### `Content` & `useContent`

Generic collection renderer with conditional item overrides, loading skeleton support, and empty-state fallback.

```tsx
import { Content } from 'loomora'

<Content
  data={items}
  loading={isLoading}
  render={(item) => <div key={item.id}>{item.title}</div>}
  empty={<p>No items found.</p>}
/>
```

---

## Hooks & Utilities

### State & Context Hooks

- **`useLoomora()`**: Returns the resolved `LoomoraConfig` and the `t(key, vars)` translation helper from the nearest `LoomoraProvider` (or `loomoraDefaults`).
- **`useTheme()`**: Returns `{ theme, dynamicTime, themeOptions, toggleTheme, detectSystemTheme, setDynamicTime, themeResponsive }` for controlling `'LIGHT' | 'DARK' | 'SYSTEM' | 'DYNAMIC'` modes.
- **`useStorageState<T>(key, options)`**: SSR-safe reactive state hook backed by `useSyncExternalStore` for `localStorage` (`type: 'local'`) or `sessionStorage` (`type: 'session'`) with automatic cross-tab updates and `{ json: true, fallback }` support.
- **`localStore`, `sessionStore`, `cookie`**: Direct imperative storage utilities with `.get(key, options)`, `.set(key, value, options)`, and `.del(key)`.

```tsx
import { useStorageState, useTheme } from 'loomora'

const { theme, toggleTheme, themeResponsive } = useTheme()
const [profile, setProfile, clearProfile] = useStorageState('profile', {
  type: 'local',
  json: true,
  fallback: { name: 'Guest' },
})
```

### DOM & Layout Hooks

- **`useResponsive()`**: Reactive viewport hook returning `windowSize` (`{ width, height }`), device booleans (`isMobile`, `isTablet`, `isDesktop`, `isUltra`), breakpoint checks (`isXs`..`is3xl`, `isLtSm`..`isLt3xl`, `isGtXs`..`isGt3xl`), `UseMQ(size)`, and `UseResponsive(map, fallback)`.
- **`useContextMenu(options)`**: Right-click context menu hook returning `{ triggerProps, menu, open, openAt, close }` with automatic viewport boundary clamping and portal rendering.
- **`useClickAway(open, wrapperRef, callback)`**: Attaches `mousedown` and `touchstart` listeners while `open` is `true` and invokes `callback` on outside pointer events.
- **`useFloatPos(open, wrapperRef, menuRef, preferred)`**: Computes collision-aware `{ v: 'top' | 'bottom', h: 'start' | 'end' }` placement respecting viewport edges and RTL direction.

### Data, Formatting & Helper Utilities

- **`useChrono()`**: Zero-dependency `Intl`-powered date utility returning:
  - `stamp(date, options)`: Formats dates using 15 preset patterns or custom tokens.
  - `relative(date, options)`: Humanized relative time strings (e.g. `"5 minutes ago"`, `"in 2 days"`).
  - `diff(first, second, options)`: Directional difference across hours, days, weeks, months, and years.
  - `timeSpan(dates, type)`: Evaluates and formats date ranges.
  - `forward(date, days)` / `rewind(date, days)`: Adds or subtracts days accurately.
  - `listMonths(options)` / `pickMonth(key, options)`: Localized month metadata (`JAN`..`DEC`).
- **`useHue()`**: Color space converter with `toHsva(color)`, `toHex(hsva)`, and `toRgb(color)` supporting full alpha channels.
- **`useAdapt(base, options)`**: Evaluates ordered condition rules and returns adapted `{ title, props, message, isValid }`.
- **`cx(inputs)`**: Concatenates class strings, nested arrays, and conditional `{ value, condition, fallback }` objects.
- **`UseCase(input, format)` & `IsValidSlug(value)`**: Converts strings to `'NORMAL' | 'SMALL' | 'CAMEL' | 'SNAKE' | 'SCREAM' | 'PASCAL' | 'SLUG' | 'KEBAB'` and validates URL slugs.
- **General Helpers**:
  - `fade(action, { open, setOpen, setShow }, options)`: Coordinates mount (`show`) and transition (`open`) states for modals and popovers.
  - `copy(text, options)`: Copies text via the Clipboard API and invokes `onCopy`.
  - `snip(text, max)`: Truncates strings with `...`.
  - `digits(value, allowTel)`: Strips non-numeric characters.
  - `echo(items, data, options)`: Styled badge console logger for client and server.
  - `hasProps(element, key)`: Type guard checking if a value is a plain props object rather than a React element.

### Validation Hooks

- **`useStrict()`**: Declarative schema validator (`check(rules)`) supporting string, number, boolean, enum, file, array, and nested object rules, returning `{ isValid, isRequiredValid, variables, errors }`.

```tsx
import { useStrict } from 'loomora'

const { check } = useStrict()
const result = check({
  email: { type: 'string', value: email, required: true },
  age: { type: 'number', value: age, required: true },
})
```

### Static Metadata Databases

- **`useCountries()`**: Returns `{ countries, getCountry, getPhoneCode, getCurrency }` for 240+ ISO-3166 countries, enriched with `translations.countries`.
- **`useTimezones()`**: Returns `{ timezones, getTimezone }` for IANA timezones grouped by region with UTC offsets, enriched with `translations.timezones`.
- **`useSocials()`**: Returns `{ socials, getSocial }` for 17 social platforms (`github`, `x`, `linkedin`, `instagram`, `youtube`, `discord`, etc.), enriched with `translations.socials`.

---

## Develop in this Repository

The repository contains the library (`src/`) and a private Next.js documentation playground (`playground/`). The checked-in lockfile is `pnpm-lock.yaml`.

```sh
# Install dependencies
pnpm install

# Build the library (CSS + ESM + CJS + TypeScript declarations)
pnpm run build

# Start the private Next.js playground (http://localhost:5001)
pnpm run dev
```

### Scripts

| Script                    | Purpose                                                                          |
| ------------------------- | -------------------------------------------------------------------------------- |
| `build`                   | Build CSS, ESM, CommonJS, source maps, and TypeScript declarations into `dist/`. |
| `build:css`               | Compile Tailwind utilities, theme variables, and keyframes into `src/styles/index.css` and `dist/index.css`. |
| `build:watch`             | Rebuild the library when source files change.                                    |
| `dev` / `dev:playground`  | Start the private Next.js playground development server.                         |
| `test` / `test:run`       | Run Vitest in watch mode or once across the test suite.                          |
| `lint`                    | Run ESLint.                                                                      |
| `format` / `format:check` | Format files or verify formatting with Prettier.                                 |
| `typecheck`               | Type-check the library with TypeScript (`tsc --noEmit`).                         |
| `check`                   | Run `lint`, `typecheck`, `test:run`, `build`, and `pack:dry`.                    |
| `check:playground`        | Type-check, lint, and build the private playground.                              |
| `pack:dry`                | Preview the files included in the published npm tarball (`npm pack --dry-run`).  |

---

## License

MIT © [Bhoenix Studio](https://github.com/BhoenixStudio). See [`LICENSE`](./LICENSE).
