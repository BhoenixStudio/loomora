/**
 * Human-written descriptions for the generated configuration reference on `/usage`.
 *
 * The rows themselves (paths, types, defaults) are generated from `loomoraDefaults`, so they never drift.
 * Only the wording lives here. UPDATE THIS FILE whenever a config key is added, renamed or changes meaning
 * (see the "Playground documentation" section of AGENTS.md).
 *
 * - `sectionDescriptions` is keyed by section key (see `configSectionKey`).
 * - `rowDescriptions` is keyed by full config path; a row falls back to the longest matching path prefix.
 */

export const sectionTitles: Record<string, string> = {
  general: 'General',
  'translations.socials': 'translations.socials',
}

export const sectionDescriptions: Record<string, string> = {
  general: 'Top-level options that affect several components.',
  'translations.socials': 'Display names and input placeholders for every supported social platform.',
  'translations.countries': 'Country names used by country pickers, phone inputs and country hooks.',
  'translations.timezones': 'Timezone display names.',
  'translations.dates': 'Month / weekday names used by the date hooks.',
  'translations.form': 'Generic form strings (validation, actions, empty states).',
  'translations.textEditorField': 'Menu titles shown by the rich-text editor.',
  'translations.searchField': 'Strings used by SearchField.',
  'translations.passwordField': 'Strings used by PasswordField (rules, strength labels, actions).',
  'translations.phoneField': 'Strings used by PhoneInput.',
  'translations.autoCompleteField': 'Strings used by AutocompleteField.',
  'translations.uploaderField': 'Strings used by UploaderField.',
  'translations.dateField': 'Strings used by DateField (labels, presets, weekday names, AM/PM).',
  'translations.settings': 'Strings used by the theme settings UI.',
  dates: 'Options for the date-related hooks (currently no defaults).',
  button: 'Defaults for every Button: type, color, loading title and the Tailwind class sets per variant, size and corner.',
  breadcrumbs: 'Defaults for Breadcrumbs.',
  'form.label': 'Floating label behaviour and class names shared by every field.',
  'form.fieldset': 'Wrapper class applied around every field.',
  'form.textField': 'Defaults for TextField.',
  'form.textareaField': 'Defaults for TextareaField.',
  'form.searchField': 'Icons used by SearchField.',
  'form.selectField': 'Defaults for SelectField.',
  'form.checkField': 'Defaults for CheckField.',
  'form.passwordField': 'Defaults for PasswordField: validation rules, colors per strength and icons.',
  'form.pinField': 'Defaults for PinField.',
  'form.rangeField': 'Defaults for RangeField.',
  'form.colorField': 'Defaults for ColorField (preset swatches, alpha, empty state).',
  'form.phoneField': 'Defaults for PhoneInput.',
  'form.autoCompleteField': 'Defaults for AutocompleteField.',
  'form.uploaderField': 'Defaults for UploaderField: limits, accepted categories and icons.',
  'form.numberField': 'Defaults for NumberField.',
  'form.ratingField': 'Defaults for RatingField.',
  'form.dateField': 'Defaults for DateField: week start, 12/24h clock, steps, icons and presets.',
  theme: 'Theme switching behaviour and icons.',
  responsive: 'Breakpoints used by the responsive provider and hooks.',
  settings: 'Global direction and locale.',
}

export const rowDescriptions: Record<string, string> = {
  hasTranslationStrategy:
    'When true, translation strings are returned untouched and `{variable}` interpolation is left to your own i18n layer.',
  flagResource: 'URL template used by Flag. `{key}` is replaced by the country key.',
  LinkType: 'Element or component used to render links (Button with `href`, Copyrights). Pass your router link, e.g. next/link.',

  'button.defaultType': 'HTML `type` of non-link buttons when no `type` prop is passed.',
  'button.defaultColor': 'Color key used when a Button has no `color` prop. Must exist in `button.colors`.',
  'button.defaultLoadingTitle': 'Text shown instead of the title while `loading` is true.',
  'button.colors': 'Class names per variant (fill / outline / text) and color key: `background`, `border`, `text`.',
  'button.corners': 'Class names per `corner` value.',
  'button.sizes': 'Class lists per `size` and variant: `textSize`, `textWeight`, `gap`, `padding`.',

  'breadcrumbs.defaultSeparator': 'Separator rendered between breadcrumb items.',

  'form.label.as': 'Element used to render labels.',
  'form.label.showRequiredIndicator': 'Show the required marker when the field is `required`.',
  'form.label.className': 'Base class names of the label.',
  'form.label.stateSharedClassName': 'Class names shared by the resting and floating label states.',
  'form.label.inactiveClassName': 'Class names while the label rests inside the input.',
  'form.label.activeClassName': 'Class names while the label floats above the input (focused or filled).',
  'form.fieldset.className': 'Class names applied to the fieldset that wraps a field.',
  'form.textField.className': 'Class names applied to the text input.',
  'form.textareaField.className': 'Class names applied to the textarea.',
  'form.textareaField.defaultRows': 'Rows used when `properties.rows` is not set.',
  'form.selectField.triggerIcon': 'Default content of the select trigger.',
  'form.selectField.optionClassName': 'Class names of each option.',
  'form.selectField.optionGroupClassName': 'Class names of each option group.',
  'form.dateField.firstDayOfWeek': 'First day of the calendar week: 0 = Sunday, 1 = Monday, 6 = Saturday.',
  'form.dateField.hour12': 'Use a 12-hour clock with AM/PM.',
  'form.dateField.timeFormat': 'Clock format: `12` or `24`.',
  'form.dateField.showSeconds': 'Show a seconds column in time pickers.',
  'form.dateField.allowClear': 'Show the clear action.',
  'form.dateField.minuteStep': 'Step of the minutes column.',
  'form.dateField.secondStep': 'Step of the seconds column.',
  'form.dateField.openOnInputClick': 'Open the picker when the input is clicked.',
  'form.dateField.manualInput': 'Allow typing a value directly into the input.',
  'form.dateField.editManual': 'Alias of `manualInput`.',
  'form.dateField.presets': 'Quick-pick presets per mode (`date`, `dateRange`, `time`, ...).',
  'form.colorField.presets': 'Preset swatches offered by the picker.',
  'form.colorField.alpha': 'Allow selecting opacity.',
  'form.colorField.allowEmpty': 'Allow clearing the value.',
  'form.uploaderField.maxSize': 'Maximum size of a single file, in MB.',

  'theme.default': 'Initial theme: LIGHT, DARK, ...',
  'theme.switchingAnimation': 'Animate theme changes.',
  'theme.themeStorageKey': 'localStorage key that stores the chosen theme.',
  'theme.themeRangeStorageKey': 'localStorage key that stores the dynamic-mode time range.',
  'theme.themeDynamicStartTime': 'Dynamic mode: time the dark theme starts (HH:mm).',
  'theme.themeDynamicEndTime': 'Dynamic mode: time the dark theme ends (HH:mm).',

  responsive: 'Breakpoint values, in the same shape as Tailwind screens.',
  'settings.isRtl': 'Render in right-to-left direction (also feeds rich-text editor direction).',
  'settings.locale': 'Locale code (also feeds the rich-text editor language).',
}

/** Description for `path`, falling back to the closest parent path. */
export function describeConfig(path: string): string {
  const parts = path.split('.')
  for (let i = parts.length; i > 0; i--) {
    const found = rowDescriptions[parts.slice(0, i).join('.')]
    if (found) return found
  }
  return ''
}
