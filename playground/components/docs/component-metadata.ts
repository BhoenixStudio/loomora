import { configHref } from './config-ids'

export type NonNativeProp = {
  name: string
  type: string
  description: string
  why?: string
}

export type RelatedConfig = {
  key: string
  href: string
}

const COMMON_NON_NATIVE_PROPS: Record<string, NonNativeProp> = {
  condition: {
    name: 'condition',
    type: 'boolean',
    description: 'When false, the component renders null without requiring JSX ternary operators.',
    why: 'Replaces noisy {condition ? <Comp /> : null} with clean <Comp condition={...} />.',
  },
  labelFloating: {
    name: 'labelFloating',
    type: 'boolean',
    description: 'Enables smooth floating label animation on focus or when input has content.',
    why: 'Provides modern floating labels without third-party form animation libraries.',
  },
  helper: {
    name: 'helper / inputHelper',
    type: 'ReactNode',
    description: 'Accessible supporting hint text displayed beneath the control.',
    why: 'Automatically associated via aria-describedby for accessibility.',
  },
  error: {
    name: 'error',
    type: 'ReactNode',
    description: 'Validation error message that automatically activates invalid styling.',
    why: 'Eliminates repetitive manual error-state class toggling.',
  },
  isInvalid: {
    name: 'isInvalid',
    type: 'boolean',
    description: 'Forces the invalid error border and theme styling even before touch.',
    why: 'Direct integration with external form validation libraries like React Hook Form or Zod.',
  },
  iconStart: {
    name: 'iconStart / iconEnd',
    type: 'ReactNode',
    description: 'Places adornment icons inside the control with calibrated design-system spacing.',
    why: 'No manual flex wrappers or absolute position math needed.',
  },
}

export const COMPONENT_CONFIGS: Record<string, string[]> = {
  accordion: ['accordion'],
  button: ['button', 'form.submitButton'],
  dialog: ['dialog'],
  digit: ['translations.digit'],
  dropdown: ['dropdown'],
  breadcrumbs: ['breadcrumbs'],
  flag: ['flag'],
  loader: ['loader'],
  'progress-bar': ['progressBar'],
  'check-field': ['form.checkField'],
  'color-field': ['form.colorField'],
  'date-field': ['form.dateField', 'translations.dateField'],
  'number-field': ['form.numberField'],
  'password-field': ['form.passwordField'],
  'phone-input': ['form.phoneInput'],
  'pin-field': ['form.pinField'],
  'range-field': ['form.rangeField'],
  'rating-field': ['form.ratingField'],
  'search-field': ['form.searchField'],
  'select-field': ['form.selectField'],
  'text-editor-field': ['form.textEditorField'],
  'text-field': ['form.textField'],
  'textarea-field': ['form.textareaField'],
  'autocomplete-field': ['form.autocompleteField'],
  form: ['form'],
  input: ['form.input'],
  label: ['form.label'],
  'input-helper': ['form.inputHelper'],
  inputs: ['form'],
  copyrights: ['copyrights'],
}

export const COMPONENT_NON_NATIVE_PROPS: Record<string, NonNativeProp[]> = {
  button: [
    COMMON_NON_NATIVE_PROPS.condition,
    {
      name: 'variant',
      type: "'fill' | 'outline' | 'text' | 'none'",
      description: 'Design system visual hierarchy treatment without utility class clutter.',
      why: 'Standardizes primary action vs secondary subtle button styling across the entire app.',
    },
    {
      name: 'color',
      type: 'SemanticColor',
      description: 'Theme semantic token (primary, info, success, warning, error, second) configured in LoomoraProvider.',
      why: 'Changes with theme and provider configuration automatically.',
    },
    {
      name: 'size',
      type: "'tiny' | 'small' | 'default' | 'large' | 'extreme' | 'none'",
      description: 'Proportionally scales padding, typography, radius, and embedded icon sizes.',
      why: 'Ensures consistent height and optical balance across all surfaces.',
    },
    {
      name: 'loading',
      type: 'boolean',
      description: 'Replaces button content with an animated spinner while locking interaction and maintaining dimensions.',
      why: 'Eliminates layout shifts and manual loading state markup in async forms.',
    },
    {
      name: 'loadingTitle',
      type: 'ReactNode',
      description: 'Custom text shown alongside or in place of the spinner during loading.',
      why: 'Defaults to config.button.defaultLoadingTitle, customizable per button.',
    },
    COMMON_NON_NATIVE_PROPS.iconStart,
    {
      name: 'badge',
      type: 'ReactNode',
      description: 'Displays a notification count or pill badge on the button.',
      why: 'Avoids custom relative-positioned badge wrappers.',
    },
    {
      name: 'tooltip',
      type: 'ReactNode',
      description: 'Integrated tooltip displayed on hover and keyboard focus.',
      why: 'No separate TooltipProvider or wrapper needed.',
    },
    {
      name: 'as / href',
      type: 'ElementType / string',
      description: 'Polymorphically renders as an anchor <a> or Next.js Link with identical visual styles.',
      why: 'Keeps semantic HTML for navigation without CSS divergence.',
    },
  ],
  'date-field': [
    COMMON_NON_NATIVE_PROPS.condition,
    {
      name: 'mode',
      type: "'date' | 'datetime' | 'time' | 'dateRange' | 'timeRange' | 'dateTimeRange'",
      description: 'Switches the picker shape between single date, full date-time, time-only, or paired ranges. Default is "date".',
      why: 'One unified component API covers all scheduling and date selection requirements.',
    },
    {
      name: 'presets',
      type: 'DatePreset[]',
      description: 'Quick-pick shortcuts (Today, Last 7 Days, This Month, etc.) with localized strings.',
      why: 'Accelerates common date selections without custom range calculations.',
    },
    {
      name: 'allowClear',
      type: 'boolean',
      description: 'Renders an accessible clear button to reset the selected value back to null.',
      why: 'Built-in clear behavior without manual value-reset handlers.',
    },
    {
      name: 'hour12',
      type: 'boolean',
      description: 'Toggles between 12-hour AM/PM spinner and 24-hour military clock.',
      why: 'Respects locale and user preference seamlessly.',
    },
    COMMON_NON_NATIVE_PROPS.labelFloating,
    COMMON_NON_NATIVE_PROPS.helper,
    COMMON_NON_NATIVE_PROPS.error,
  ],
  'text-field': [
    COMMON_NON_NATIVE_PROPS.condition,
    COMMON_NON_NATIVE_PROPS.labelFloating,
    COMMON_NON_NATIVE_PROPS.helper,
    COMMON_NON_NATIVE_PROPS.error,
    COMMON_NON_NATIVE_PROPS.isInvalid,
    COMMON_NON_NATIVE_PROPS.iconStart,
    {
      name: 'properties',
      type: 'InputHTMLAttributes',
      description: 'Raw HTML input attributes (value, onChange, placeholder, disabled, etc.) passed cleanly.',
      why: 'Prevents prop name collisions between Loomora container abstractions and native DOM attributes.',
    },
  ],
  'password-field': [
    COMMON_NON_NATIVE_PROPS.condition,
    {
      name: 'hasShow',
      type: 'boolean',
      description: 'Built-in toggle button that reveals/masks password characters.',
      why: 'Eliminates repetitive show/hide password state handling.',
    },
    {
      name: 'hasGenerate',
      type: 'boolean',
      description: 'Generates cryptographically random secure passwords on demand.',
      why: 'Assists users in registration and credential reset workflows.',
    },
    {
      name: 'hasValidation & showValidationsList',
      type: 'boolean',
      description: 'Live rule evaluation (length, numbers, uppercase, special characters) with visual checklist.',
      why: 'Instant user feedback before form submission.',
    },
    {
      name: 'showValidationProgress',
      type: 'boolean',
      description: 'Colored password strength meter bar showing overall security score.',
      why: 'Modern security UX with zero extra code.',
    },
    COMMON_NON_NATIVE_PROPS.labelFloating,
    COMMON_NON_NATIVE_PROPS.helper,
    COMMON_NON_NATIVE_PROPS.error,
  ],
  'check-field': [
    COMMON_NON_NATIVE_PROPS.condition,
    {
      name: 'type',
      type: "'checkbox' | 'radio' | 'switch'",
      description: 'Polymorphic toggle rendering as standard checkbox, radio item, or animated iOS toggle switch.',
      why: 'One component handles all binary and radio group selections.',
    },
    COMMON_NON_NATIVE_PROPS.helper,
    COMMON_NON_NATIVE_PROPS.error,
  ],
  'phone-input': [
    COMMON_NON_NATIVE_PROPS.condition,
    {
      name: 'defaultCountry',
      type: 'CountryCode',
      description: 'ISO-2 country code selecting flag, dial code, and formatting mask.',
      why: 'Backed by Loomora country metadata with instant dial code matching.',
    },
    {
      name: 'formatAsYouType',
      type: 'boolean',
      description: 'Formats phone digits dynamically to national conventions as the user types.',
      why: 'Improves readability and eliminates invalid phone formatting.',
    },
    COMMON_NON_NATIVE_PROPS.labelFloating,
    COMMON_NON_NATIVE_PROPS.helper,
    COMMON_NON_NATIVE_PROPS.error,
  ],
  'pin-field': [
    COMMON_NON_NATIVE_PROPS.condition,
    {
      name: 'length',
      type: 'number',
      description: 'Number of individual digit boxes (e.g. 4 or 6 for 2FA verification codes).',
      why: 'Handles multi-box arrow navigation, backspace rewinding, and paste splitting automatically.',
    },
    {
      name: 'mask',
      type: 'boolean',
      description: 'Conceals typed digits with dots for sensitive PIN security.',
      why: 'Shields codes in public environments.',
    },
    COMMON_NON_NATIVE_PROPS.helper,
    COMMON_NON_NATIVE_PROPS.error,
  ],
  accordion: [
    COMMON_NON_NATIVE_PROPS.condition,
    {
      name: 'initialCollapsed',
      type: 'boolean',
      description: 'Initial disclosure state; component manages local expansion smoothly with CSS grid animation.',
      why: 'No boilerplate state management required for simple disclosure sections.',
    },
    {
      name: 'allTitleClickable',
      type: 'boolean',
      description: 'Makes the entire header bar trigger the toggle, not just the chevron icon.',
      why: 'Improves touch target size on mobile screens.',
    },
    {
      name: 'setOpen',
      type: '(collapsed: boolean) => void',
      description: 'Callback notifying parent when section expands or collapses.',
      why: 'Enables external monitoring and analytics without forcing controlled mode.',
    },
  ],
  dialog: [
    COMMON_NON_NATIVE_PROPS.condition,
    {
      name: 'open & show',
      type: 'boolean',
      description: 'Coordinated mount and animation states that power smooth fade/scale transitions.',
      why: 'Prevents instant DOM unmount before exit animations finish.',
    },
    {
      name: 'usePortal',
      type: 'boolean',
      description: 'Mounts the dialog directly into document.body to avoid parent overflow clipping and z-index issues.',
      why: 'Guarantees the modal always sits above all layout containers.',
    },
  ],
  'progress-bar': [
    COMMON_NON_NATIVE_PROPS.condition,
    {
      name: 'value & outOf',
      type: 'number',
      description: 'Calculates percentage automatically from fraction values.',
      why: 'No manual percentage math in application code.',
    },
    {
      name: 'showValueAsText',
      type: 'boolean',
      description: 'Renders localized percentage or ratio label.',
      why: 'Built-in accessible text description.',
    },
  ],
  'rating-field': [
    COMMON_NON_NATIVE_PROPS.condition,
    {
      name: 'step',
      type: '0.5 | 1',
      description: 'Allows half-star precision rating values.',
      why: 'Enables granular feedback scores.',
    },
    {
      name: 'labels',
      type: 'string[]',
      description: 'Displays corresponding descriptive sentiment (e.g. Poor, Good, Excellent) dynamically on hover.',
      why: 'Enhances user clarity during rating submissions.',
    },
  ],
}

export function getComponentConfigs(slug: string): RelatedConfig[] {
  const keys = COMPONENT_CONFIGS[slug] ?? []
  return keys.map((key) => ({
    key,
    href: configHref(key),
  }))
}

export function getComponentNonNativeProps(slug: string): NonNativeProp[] {
  if (COMPONENT_NON_NATIVE_PROPS[slug]) return COMPONENT_NON_NATIVE_PROPS[slug]
  // Fallback defaults for form inputs or general components
  if (slug.endsWith('-field') || slug === 'input' || slug === 'select') {
    return [
      COMMON_NON_NATIVE_PROPS.condition,
      COMMON_NON_NATIVE_PROPS.labelFloating,
      COMMON_NON_NATIVE_PROPS.helper,
      COMMON_NON_NATIVE_PROPS.error,
      COMMON_NON_NATIVE_PROPS.isInvalid,
    ]
  }
  return [COMMON_NON_NATIVE_PROPS.condition]
}
