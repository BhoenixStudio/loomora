# Changelog

All notable changes to Loomora will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-10-31

### Added

- **Core Configuration & Provider (`LoomoraProvider`, `useLoomora`, `loomoraDefaults`, `mergeConfig`)**:
  - Recursive deep-merge configuration context with built-in defaults (`loomoraDefaults`) so all components and hooks work out of the box with or without a provider.
  - Support for nested `LoomoraProvider` instances that inherit from their parent provider and override only specified keys.
  - Built-in translation dictionary (`config.translations`) and `t(key, vars)` template interpolation helper covering dates, countries, timezones, social platforms, form fields, and theme settings.
- **Theme & Responsive Contexts (`ThemeProvider`, `useTheme`, `ResponsiveProvider`, `useResponsive`)**:
  - `ThemeProvider` and `useTheme` with `LIGHT`, `DARK`, `SYSTEM`, and time-based `DYNAMIC` theme modes, View Transitions circular reveal animation support, `themeResponsive(light, dark)` helper, and `localStorage` persistence.
  - `ResponsiveProvider` and `useResponsive` providing reactive viewport dimensions (`windowSize`), breakpoint booleans (`isXs`..`is3xl`, `isLt*`, `isGt*`), device aliases (`isMobile`, `isTablet`, `isDesktop`, `isUltra`), and `UseResponsive` value selector.
- **UI Components**:
  - `Accordion`: Accessible disclosure section with staggered entrance animation, configurable trigger area, and motion-reduction support.
  - `Button`: Polymorphic button and link control (`LinkType` integration) with semantic variants (`fill`, `outline`, `text`, `none`), theme colors, sizes (`tiny` to `extreme`), corner presets, loading state, and icon slots.
  - `Dialog`: Modal and slide-over surface with portal rendering, directional placement (`center`, `top`, `bottom`, `left`, `right`, `start`, `end`), backdrop overlay, and Escape/outside-click dismissal.
  - `Digit` & `UseDigit`: Locale-aware number, currency, percentage, and unit formatter component and utility.
  - `Dropdown`: Trigger-anchored floating menu with automatic viewport collision flipping and click-away dismissal.
  - `Flag`: Country flag SVG component with aspect ratio presets (`3x2`, `1x1`), configurable resource URL template (`flagResource`), and country-code fallback.
- **Form Composition & Input Fields**:
  - `Form`, `Inputs`, and `Input`: Declarative form and grid-based field dispatcher supporting 16 input types, action buttons, and conditional rendering.
  - `Label`, `InputHelper`, and `InputErrorMessage`: Reusable floating label and validation feedback primitives.
  - `TextField`, `SearchField`, `TextareaField`, `NumberField`: Text and numeric inputs with floating labels, prefix/suffix slots, thousand/decimal formatting, and search/clear triggers.
  - `SelectField` & `AutocompleteField`: Native grouped select and searchable single/multi-select combobox with tag chips and custom option rendering.
  - `CheckField`: Unified `checkbox`, `radio`, and animated `switch` control.
  - `PasswordField`: Password input with visibility toggle, copy-to-clipboard, strength progress bar, rule checklist, and random password generator (`usePasswordHelper`).
  - `PinField`: Multi-cell OTP / verification code input with automatic focus advancement and clipboard paste distribution.
  - `PhoneInput`: International phone number input with searchable country calling-code selector, flag display, and prefix validation (`usePhoneHelper`).
  - `DateField` (`DatePickerField`): 6-mode picker (`date`, `datetime`, `time`, `dateRange`, `timeRange`, `dateTimeRange`) with dual-month desktop calendar, time spinners, quick presets, and min/max/weekday constraints.
  - `ColorField`: Custom HSVA color picker popover with saturation/hue canvas, alpha channel slider, hex input, and preset swatches.
  - `RangeField` & `RatingField`: Custom range slider with track marks and accessible star rating input with half-step and keyboard support.
  - `UploaderField`: Drag-and-drop and clipboard-paste file uploader with category/extension/size validation and `list`, `thumbs`, `background`, and `pfp` preview layouts (`useUploaderHelper`).
  - `TextEditorField`: Rich-text editor powered by `@tinymce/tinymce-react` with skeleton loading state and heading extraction helpers (`useTextEditorData`, `useExtractHeadingsFromHtml`).
- **Partials & Helper Components**:
  - `Breadcrumbs` (`Breadcrumb`), `Copyrights`, `Loader` (skeleton placeholders), `ProgressBar`, `ConditionalWrapper`, and `Content` (`useContent`).
- **Hooks & Utilities**:
  - `useChrono`: Zero-dependency `Intl`-powered date formatting (`stamp`), relative time (`relative`), directional diffs (`diff`), date ranges (`timeSpan`), `forward`/`rewind`, and month metadata (`listMonths`, `pickMonth`).
  - `useStorageState`, `localStore`, `sessionStore`, and `cookie`: SSR-safe storage primitives powered by `useSyncExternalStore` with cross-tab synchronization and JSON serialization.
  - `useContextMenu`: Viewport-clamped right-click context menu hook with portal rendering.
  - `useClickAway`, `useFloatPos`, and `useOverlay`: Pointer outside-click detection and viewport-aware floating placement hooks.
  - `useHue`: Hex, RGB/RGBA, and HSVA color conversion utility hook.
  - `useStrict` & `useAdapt`: Declarative schema/type validation and rule-based prop adaptation hooks.
  - String, class, and DOM helpers: `cx`, `UseCase`, `IsValidSlug`, `echo`, `fade`, `snip`, `digits`, `copy`, and `hasProps`.
- **Static Metadata Databases**:
  - `useCountries` (240+ ISO-3166 countries with dial codes, currencies, and localized names), `useSocials` (17 social platforms with icons and placeholders), and `useTimezones` (region-grouped IANA timezones with live UTC offsets).
- **Standalone & Tailwind CSS Support**:
  - Pre-compiled standalone stylesheet (`loomora/dist/index.css`, `loomora/index.css`, `loomora/styles/index.css`) with `--loomora-*` light/dark CSS custom properties, component keyframes, and scoped box-sizing without global preflight resets, alongside full Tailwind CSS v3 and v4 compatibility.
