export type HookCategory = 'State & Context' | 'DOM & Layout' | 'Data & Utilities' | 'Validation'

export type HookParam = {
  name: string
  type: string
  optional?: boolean
  description: string
}

export type HookReturn = {
  name: string
  type: string
  description: string
}

export type HookDoc = {
  slug: string
  name: string
  category: HookCategory
  summary: string
  description: string
  importName: string
  code: string
  params: HookParam[]
  returns: HookReturn[]
  relatedConfigs: string[]
  features: { title: string; description: string }[]
  notes: string[]
}

export const hookCategories: HookCategory[] = [
  'State & Context',
  'DOM & Layout',
  'Data & Utilities',
  'Validation',
]

export const hookCatalog: HookDoc[] = [
  {
    slug: 'use-chrono',
    name: 'useChrono',
    category: 'Data & Utilities',
    summary: 'High-performance date and time operations: relative times, stamps, deltas, and month listings.',
    description:
      'Intl-backed date manipulation hook operating with zero external date libraries. Supports 15 preset format patterns, multi-language relative phrases, bidirectional time difference math, and calendar month listings.',
    importName: 'useChrono',
    code: `import { useChrono } from 'loomora'

export function Example() {
  const { stamp, relative, diff, forward, rewind } = useChrono()

  const formatted = stamp(new Date(), { preset: 'fullYear' })
  const fromNow = relative(new Date(Date.now() - 3600000))
  const delta = diff(new Date(), new Date(Date.now() + 86400000))

  return (
    <div>
      <p>Formatted: {formatted}</p>
      <p>Relative: {fromNow}</p>
      <p>Days ahead: {delta.differenceInDays}</p>
    </div>
  )
}`,
    params: [],
    returns: [
      {
        name: 'stamp(date, options)',
        type: '(date: DateType, props?: FormatDate) => string | number | null',
        description: 'Formats dates using 15 presets or custom token patterns with locale awareness.',
      },
      {
        name: 'relative(date, options)',
        type: '(date: DateType, props?: RelativeDateProps) => string',
        description: 'Calculates humanized relative time strings using Loomora translations or Intl.RelativeTimeFormat.',
      },
      {
        name: 'diff(first, second, options)',
        type: '(first: DateType, second: DateType, props?: CompareDate) => DiffResult',
        description: 'Directional difference calculation across hours, days, weeks, months, and years.',
      },
      {
        name: 'timeSpan(dates, type)',
        type: '(dates: DateRange, type?: DateRangeType) => DateRangeResult',
        description: 'Evaluates if two dates fall within the same interval and formats range strings.',
      },
      {
        name: 'forward(date, days)',
        type: '(date: DateType, days: number) => Date | null',
        description: 'Advances date by specified days handling leap years and month boundaries.',
      },
      {
        name: 'rewind(date, days)',
        type: '(date: DateType, days: number) => Date | null',
        description: 'Rewinds date backward by specified days.',
      },
      {
        name: 'listMonths(options)',
        type: '<T>(props?: GetMonths<T>) => (MonthItem & T)[]',
        description: 'Returns localized 1-12 list of months enriched with Loomora localization translations.',
      },
      {
        name: 'pickMonth(key, options)',
        type: '<T>(key: MonthKey, props?: GetMonths<T>) => MonthItem & T',
        description: 'Retrieves localized metadata for a specific month key (JAN through DEC).',
      },
    ],
    relatedConfigs: ['translations.dates'],
    features: [
      {
        title: 'Zero External Dependencies',
        description: 'Fully runs on native Date, Intl.DateTimeFormat, and Intl.RelativeTimeFormat without Moment or Day.js.',
      },
      {
        title: 'Loomora Translation Sync',
        description: 'Relative time labels automatically sync with LoomoraProvider translations.dates.relative.',
      },
    ],
    notes: [
      'Accepts Date instances, ISO date strings, or millisecond timestamps.',
      'Supports BCP-47 locale tags directly in stamp and relative methods.',
    ],
  },
  {
    slug: 'use-responsive',
    name: 'useResponsive',
    category: 'DOM & Layout',
    summary: 'Reactive viewport breakpoint detection and window sizing context.',
    description:
      'Inspects active viewport dimensions and calculates semantic breakpoint states (isMobile, isTablet, isDesktop, isUltra) and granular scale checks (isSm, isMd, isLg, etc.).',
    importName: 'useResponsive',
    code: `import { useResponsive } from 'loomora'

export function Example() {
  const { isMobile, isTablet, isDesktop, windowSize } = useResponsive()

  return (
    <div>
      <p>Device: {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}</p>
      <p>Viewport: {windowSize.width} × {windowSize.height}px</p>
    </div>
  )
}`,
    params: [],
    returns: [
      {
        name: 'isMobile',
        type: 'boolean',
        description: 'True when viewport is below the tablet breakpoint (ltSm).',
      },
      {
        name: 'isTablet',
        type: 'boolean',
        description: 'True when viewport matches the tablet range (md).',
      },
      {
        name: 'isDesktop',
        type: 'boolean',
        description: 'True when viewport is desktop size or larger (lg).',
      },
      {
        name: 'isUltra',
        type: 'boolean',
        description: 'True when viewport is ultra-wide (2xl+).',
      },
      {
        name: 'windowSize',
        type: '{ width: number; height: number }',
        description: 'Current window inner width and height in pixels.',
      },
      {
        name: 'UseResponsive(sizes, fallback)',
        type: '<T>(sizes: Partial<Record<ScreenSize, T>>, fallback?: T) => T',
        description: 'Selects the value matching the current screen breakpoint.',
      },
    ],
    relatedConfigs: ['settings'],
    features: [
      {
        title: 'Coordinated Breakpoints',
        description: 'Breakpoints (xs, sm, md, lg, xl, 2xl, 3xl) match Tailwind CSS and LoomoraProvider config.',
      },
      {
        title: 'SSR Safe',
        description: 'Gracefully initialises during server-side rendering before browser hydration.',
      },
    ],
    notes: [
      'Wrapped inside LoomoraProvider by default.',
      'Listening is debounced to avoid layout thrashing during browser resizes.',
    ],
  },
  {
    slug: 'use-theme',
    name: 'useTheme',
    category: 'State & Context',
    summary: 'Theme mode state management (light, dark, system) with HTML dataset sync.',
    description:
      'Provides reactive access to current theme mode, allows toggling between light, dark, and system preferences, and synchronizes the document data-theme attribute and localStorage persistence.',
    importName: 'useTheme',
    code: `import { useTheme } from 'loomora'

export function ThemeSwitcher() {
  const { theme, setTheme, isDark } = useTheme()

  return (
    <button onClick={() => setTheme(isDark ? 'light' : 'dark')}>
      Current: {theme} ({isDark ? 'Dark Mode' : 'Light Mode'})
    </button>
  )
}`,
    params: [],
    returns: [
      {
        name: 'theme',
        type: "'light' | 'dark' | 'system'",
        description: 'The current active theme mode setting.',
      },
      {
        name: 'setTheme',
        type: "(mode: 'light' | 'dark' | 'system') => void",
        description: 'Updates the active theme mode and persists it.',
      },
      {
        name: 'isDark',
        type: 'boolean',
        description: 'True if dark theme is active (including system dark preference).',
      },
    ],
    relatedConfigs: ['settings'],
    features: [
      {
        title: 'System Preference Detection',
        description: 'Automatically respects prefers-color-scheme media query when in "system" mode.',
      },
      {
        title: 'DOM Synchronization',
        description: 'Updates document.documentElement attributes so CSS variables update instantly.',
      },
    ],
    notes: [
      'Included automatically within LoomoraProvider.',
      'ThemeProvider integrates with next-intl for localized theme labels if configured.',
    ],
  },
  {
    slug: 'use-storage-state',
    name: 'useStorageState',
    category: 'State & Context',
    summary: 'Reactive state hook synchronized with localStorage, sessionStorage, or cookies.',
    description:
      'A useState-like hook that persists state to web storage or cookies, handles cross-tab storage event updates, and serializes/deserializes JSON objects automatically.',
    importName: 'useStorageState',
    code: `import { useStorageState } from 'loomora'

export function Example() {
  const [user, setUser, removeUser] = useStorageState('user_profile', {
    type: 'local',
    json: true,
    fallback: { name: 'Guest' },
  })

  return (
    <div>
      <p>Hello, {user.name}!</p>
      <button onClick={() => setUser({ name: 'Alex' })}>Log In</button>
      <button onClick={removeUser}>Clear</button>
    </div>
  )
}`,
    params: [
      {
        name: 'key',
        type: 'string',
        description: 'The storage item key name in browser storage.',
      },
      {
        name: 'options',
        type: 'StorageStateOptions<T>',
        optional: true,
        description: 'Configuration options: type ("local" | "session"), json (boolean), fallback default value.',
      },
    ],
    returns: [
      {
        name: '[0] value',
        type: 'T',
        description: 'Current stored value or fallback.',
      },
      {
        name: '[1] setValue',
        type: '(next: T) => void',
        description: 'Updates the stored value across memory and browser storage.',
      },
      {
        name: '[2] removeValue',
        type: '() => void',
        description: 'Deletes the key from browser storage and resets to fallback.',
      },
    ],
    relatedConfigs: [],
    features: [
      {
        title: 'Cross-Tab Synchronization',
        description: 'Listens for window storage events so multiple tabs remain in sync without polling.',
      },
      {
        title: 'useSyncExternalStore',
        description: 'Built on React 18/19 useSyncExternalStore for zero tearing and SSR hydration safety.',
      },
    ],
    notes: [
      'Companion storage utilities localStore, sessionStore, and cookie are also exported directly for non-hook usage.',
    ],
  },
  {
    slug: 'use-context-menu',
    name: 'useContextMenu',
    category: 'DOM & Layout',
    summary: 'Right-click context menu hook that opens at the cursor position and stays inside viewport bounds.',
    description:
      'A hook that returns trigger props for the target element and a portaled menu element. Open state is managed internally by default and can also be controlled from outside.',
    importName: 'useContextMenu',
    code: `import { useContextMenu } from 'loomora'

export function ContextMenuExample() {
  const { triggerProps, menu } = useContextMenu({
    children: (close) => (
      <div className="grid min-w-44 gap-1 p-2">
        <button onClick={close}>Copy</button>
        <button onClick={close}>Delete</button>
      </div>
    ),
  })

  return (
    <>
      <div {...triggerProps}>Right-click inside this area</div>
      {menu}
    </>
  )
}`,
    params: [
      {
        name: 'options.children',
        type: 'ReactNode | ((close: () => void) => ReactNode)',
        description: 'Menu content. A function receives a close callback.',
      },
      {
        name: 'options.open',
        type: 'boolean',
        optional: true,
        description: 'Controls the open state from outside the hook.',
      },
      {
        name: 'options.setOpen',
        type: '(open: boolean) => void',
        optional: true,
        description: 'Notified whenever the menu opens or closes (including outside clicks and Escape).',
      },
      {
        name: 'options.menuClassName',
        type: 'string',
        optional: true,
        description: 'Custom classes applied to the portaled menu surface.',
      },
    ],
    returns: [
      {
        name: 'triggerProps',
        type: '{ onContextMenu: (e: MouseEvent) => void }',
        description: 'Event handler props to spread onto the right-click trigger element.',
      },
      {
        name: 'menu',
        type: 'ReactNode',
        description: 'The portaled context menu element positioned at the cursor coordinates.',
      },
      {
        name: 'open',
        type: 'boolean',
        description: 'Current boolean open state of the context menu.',
      },
      {
        name: 'openAt',
        type: '(x: number, y: number) => void',
        description: 'Programmatically opens the menu at specific viewport x/y coordinates.',
      },
      {
        name: 'close',
        type: '() => void',
        description: 'Closes the context menu.',
      },
    ],
    relatedConfigs: [],
    features: [
      {
        title: 'Viewport-Constrained Positioning',
        description: 'Automatically clamps menu coordinates to stay fully visible inside viewport boundaries.',
      },
      {
        title: 'Uncontrolled & Controlled Modes',
        description: 'Works zero-config with internal state or connects to external state via open and setOpen.',
      },
      {
        title: 'Accessible Dismissal',
        description: 'Automatically closes on outside click, Escape key press, window resize, or scroll.',
      },
    ],
    notes: [
      'Spread triggerProps onto the element that should trigger the menu on right-click.',
      'Render the returned menu node once inside your component JSX.',
      'Item clicks do not automatically close the menu unless you invoke the close() callback.',
    ],
  },
  {
    slug: 'use-click-away',
    name: 'useClickAway',
    category: 'DOM & Layout',
    summary: 'Detects pointer interactions outside a targeted container element.',
    description:
      'Registers mouse and touch event listeners on document to trigger a callback whenever a click occurs outside the specified element ref. Essential for dismissing dropdowns, popovers, and dialogs.',
    importName: 'useClickAway',
    code: `import { useRef, useState } from 'react'
import { useClickAway } from 'loomora'

export function DropdownMenu() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useClickAway(open, menuRef, () => setOpen(false))

  return (
    <div>
      <button onClick={() => setOpen(!open)}>Toggle</button>
      {open && <div ref={menuRef}>Menu Content</div>}
    </div>
  )
}`,
    params: [
      {
        name: 'open',
        type: 'boolean',
        description: 'Active condition. Listeners are only attached when open is true.',
      },
      {
        name: 'wrapperRef',
        type: 'RefObject<HTMLElement | null>',
        description: 'React ref to the element considered "inside".',
      },
      {
        name: 'callback',
        type: '() => void',
        description: 'Function invoked when a click or tap occurs outside wrapperRef.',
      },
    ],
    returns: [],
    relatedConfigs: [],
    features: [
      {
        title: 'Zero Overhead When Inactive',
        description: 'Document event listeners are only attached when the open flag is true.',
      },
      {
        title: 'Touch & Mouse Coordinated',
        description: 'Handles both mousedown and touchstart to ensure instant dismissal on mobile devices.',
      },
    ],
    notes: [
      'Ensure the element ref is attached to the outermost container of the popup.',
    ],
  },
  {
    slug: 'use-float-pos',
    name: 'useFloatPos',
    category: 'DOM & Layout',
    summary: 'Calculates viewport boundary-aware popover and dropdown anchor placement.',
    description:
      'Dynamically checks remaining viewport space above, below, and towards document edges to invert floating placement (e.g. flipping from bottom to top when near the screen edge).',
    importName: 'useFloatPos',
    code: `import { useRef } from 'react'
import { useFloatPos } from 'loomora'

export function FloatingTooltip({ open }: { open: boolean }) {
  const anchorRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const pos = useFloatPos(open, anchorRef, menuRef, { v: 'bottom', h: 'end' })

  return (
    <div>
      <button ref={anchorRef}>Hover me</button>
      {open && (
        <div ref={menuRef} className={\`pos-\${pos.v}-\${pos.h}\`}>
          Tooltip content
        </div>
      )}
    </div>
  )
}`,
    params: [
      {
        name: 'open',
        type: 'boolean',
        description: 'Active state of the floating menu.',
      },
      {
        name: 'wrapperRef',
        type: 'RefObject<HTMLElement | null>',
        description: 'Anchor trigger element ref.',
      },
      {
        name: 'menuRef',
        type: 'RefObject<HTMLElement | null>',
        description: 'Floating content element ref.',
      },
      {
        name: 'preferred',
        type: 'FloatPos',
        optional: true,
        description: 'Default target placement { v: "bottom" | "top", h: "start" | "end" }.',
      },
    ],
    returns: [
      {
        name: 'v',
        type: "'top' | 'bottom'",
        description: 'Computed vertical orientation based on available viewport space.',
      },
      {
        name: 'h',
        type: "'start' | 'end'",
        description: 'Computed horizontal orientation respecting RTL and screen edges.',
      },
    ],
    relatedConfigs: ['dropdown'],
    features: [
      {
        title: 'RTL Responsive',
        description: 'Calculates horizontal start and end alignments respecting document direction.',
      },
      {
        title: 'Scroll and Resize Aware',
        description: 'Re-evaluates placement on window resize and scroll events.',
      },
    ],
    notes: [
      'Used internally by Loomora Dropdown, AutocompleteField, and DateField components.',
    ],
  },
  {
    slug: 'use-countries',
    name: 'useCountries',
    category: 'Data & Utilities',
    summary: 'Static metadata lookup for international countries, calling codes, currencies, and flags.',
    description:
      'Access Loomora’s comprehensive international ISO-3166 database. Look up countries by code, get localized country names, phone dial codes, currency formats, and country flag SVGs.',
    importName: 'useCountries',
    code: `import { useCountries } from 'loomora'

export function CountryInfo({ code }: { code: string }) {
  const { countries, getCountry, getPhoneCode, getCurrency } = useCountries()

  const country = getCountry(code)
  const dialCode = getPhoneCode(code)

  return (
    <div>
      <h3>{country?.name} ({code})</h3>
      <p>Dial Code: +{dialCode}</p>
    </div>
  )
}`,
    params: [],
    returns: [
      {
        name: 'countries',
        type: 'Country[]',
        description: 'Full array of all 240+ countries with metadata.',
      },
      {
        name: 'getCountry(code)',
        type: '(code: string) => Country | undefined',
        description: 'Look up a country by ISO alpha-2 code.',
      },
      {
        name: 'getPhoneCode(code)',
        type: '(code: string) => string | undefined',
        description: 'Retrieve the international dial code for a country.',
      },
      {
        name: 'getCurrency(code)',
        type: '(code: string) => CountryCurrency | undefined',
        description: 'Retrieve official currency symbol and ISO currency code.',
      },
    ],
    relatedConfigs: ['translations.countries'],
    features: [
      {
        title: 'Translation Enriched',
        description: 'Country names reflect translations configured in LoomoraProvider translations.countries.',
      },
      {
        title: 'Zero Network Requests',
        description: 'Static embedded dataset with instant synchronous lookups.',
      },
    ],
    notes: [
      'Used by Loomora PhoneInput and Flag components.',
    ],
  },
  {
    slug: 'use-timezones',
    name: 'useTimezones',
    category: 'Data & Utilities',
    summary: 'IANA timezone database query and UTC offset helpers.',
    description:
      'Provides querying and region-grouping for global IANA timezones, formatted UTC offset strings, and localized city descriptors.',
    importName: 'useTimezones',
    code: `import { useTimezones } from 'loomora'

export function TimezoneSelect() {
  const { timezones, getTimezone } = useTimezones()

  const current = getTimezone('Asia/Muscat')

  return (
    <div>
      <p>Timezone: {current?.name}</p>
      <p>Offset: {current?.offset}</p>
    </div>
  )
}`,
    params: [],
    returns: [
      {
        name: 'timezones',
        type: 'Timezone[]',
        description: 'List of all standard IANA timezones with region metadata.',
      },
      {
        name: 'getTimezone(name)',
        type: '(name: string) => Timezone | undefined',
        description: 'Retrieves metadata for a specific timezone key.',
      },
    ],
    relatedConfigs: ['translations.timezones'],
    features: [
      {
        title: 'Region Grouping',
        description: 'Organized by geographic regions (America, Europe, Asia, Pacific, etc.).',
      },
    ],
    notes: [
      'Synchronized with Loomora DateField timezone selectors.',
    ],
  },
  {
    slug: 'use-socials',
    name: 'useSocials',
    category: 'Data & Utilities',
    summary: 'Social media platform metadata, brand colors, and URL patterns.',
    description:
      'Lookup social media platforms, platform titles, brand identity colors, handle placeholders, and URL profile templates.',
    importName: 'useSocials',
    code: `import { useSocials } from 'loomora'

export function SocialLinks() {
  const { socials, getSocial } = useSocials()

  const github = getSocial('github')

  return (
    <div>
      <p>Platform: {github?.name}</p>
      <p>Placeholder: {github?.placeholder}</p>
    </div>
  )
}`,
    params: [],
    returns: [
      {
        name: 'socials',
        type: 'Social[]',
        description: 'List of supported social platforms with brand metadata.',
      },
      {
        name: 'getSocial(key)',
        type: '(key: string) => Social | undefined',
        description: 'Lookup platform metadata by key (github, x, instagram, etc.).',
      },
    ],
    relatedConfigs: ['translations.socials'],
    features: [
      {
        title: 'Customizable Translations',
        description: 'Profile placeholders and brand labels respect translations.socials.',
      },
    ],
    notes: [
      'Used by Loomora SocialField and profile input forms.',
    ],
  },
  {
    slug: 'use-hue',
    name: 'useHue',
    category: 'Data & Utilities',
    summary: 'Color space conversion and chroma manipulation hook.',
    description:
      'Provides color conversion between Hex, RGB, HSL, and HSVA formats, calculates alpha transparency channels, and formats values for color picker inputs.',
    importName: 'useHue',
    code: `import { useHue } from 'loomora'

export function ColorDisplay({ hex }: { hex: string }) {
  const { toHsva, toRgb, toHex } = useHue()

  const hsva = toHsva(hex)

  return (
    <div>
      <p>Hex: {hex}</p>
      <p>HSVA: H:{hsva.h} S:{hsva.s} V:{hsva.v} A:{hsva.a}</p>
    </div>
  )
}`,
    params: [],
    returns: [
      {
        name: 'toHsva(color)',
        type: '(color: string) => Hsva',
        description: 'Converts any color string to HSVA object.',
      },
      {
        name: 'toHex(hsva)',
        type: '(hsva: Hsva) => string',
        description: 'Converts HSVA values to Hex string (with alpha if applicable).',
      },
      {
        name: 'toRgb(color)',
        type: '(color: string) => { r: number; g: number; b: number; a: number }',
        description: 'Converts color string to RGBA object.',
      },
    ],
    relatedConfigs: ['form.colorField'],
    features: [
      {
        title: 'Full Alpha Channel Support',
        description: 'Seamless 8-digit hex and rgba transparency calculations.',
      },
    ],
    notes: [
      'Powers Loomora ColorField and theme color picker controls.',
    ],
  },
  {
    slug: 'use-strict',
    name: 'useStrict',
    category: 'Validation',
    summary: 'Declarative schema validator with type checking and error reporting.',
    description:
      'A declarative validation engine supporting numbers, strings, booleans, enums, files, objects, and arrays. Evaluates required rules, type bounds, and custom regex validation with live error messages.',
    importName: 'useStrict',
    code: `import { useStrict } from 'loomora'

export function FormValidator() {
  const { check } = useStrict()

  const result = check({
    email: { type: 'string', value: 'user@example.com', required: true },
    age: { type: 'number', value: 25, required: true },
  })

  return (
    <div>
      <p>Is Valid: {result.isValid ? 'Yes' : 'No'}</p>
      <p>Errors: {result.errors.join(', ')}</p>
    </div>
  )
}`,
    params: [],
    returns: [
      {
        name: 'check(schema)',
        type: '(rules: UseStrictRules) => { isValid: boolean; isRequiredValid: boolean; variables: any; errors: string[] }',
        description: 'Evaluates rules against values and returns structured validity report.',
      },
    ],
    relatedConfigs: ['form.passwordField'],
    features: [
      {
        title: 'Deep Nested Validation',
        description: 'Supports nested object and array item schema evaluation.',
      },
    ],
    notes: [
      'Useful for validating form models before API dispatch.',
    ],
  },
  {
    slug: 'use-loomora',
    name: 'useLoomora',
    category: 'State & Context',
    summary: 'Direct access to resolved Loomora configuration and context utilities.',
    description:
      'Returns the recursively merged configuration of the closest LoomoraProvider parent, including theme tokens, responsive breakpoints, component defaults, and translation helpers.',
    importName: 'useLoomora',
    code: `import { useLoomora } from 'loomora'

export function ConfigInspector() {
  const { button, settings, t } = useLoomora()

  return (
    <div>
      <p>Default Button Color: {button?.defaultColor}</p>
      <p>Locale: {settings?.locale}</p>
    </div>
  )
}`,
    params: [],
    returns: [
      {
        name: 'button',
        type: 'ButtonConfig',
        description: 'Default colors, sizes, corners, and loader titles for Button.',
      },
      {
        name: 'form',
        type: 'FormConfig',
        description: 'Global defaults for all form fields and inputs.',
      },
      {
        name: 'settings',
        type: 'SettingsConfig',
        description: 'Locale, RTL, and translation strategy settings.',
      },
      {
        name: 'translations',
        type: 'TranslationsConfig',
        description: 'All localized strings for countries, socials, dates, and form labels.',
      },
      {
        name: 't',
        type: 'TranslateFn',
        description: 'Translation lookup function that checks provider overrides.',
      },
    ],
    relatedConfigs: ['general', 'settings', 'translations'],
    features: [
      {
        title: 'Recursive Inheritance',
        description: 'Nested providers merge seamlessly over parent configurations.',
      },
      {
        title: 'Built-in Fallbacks',
        description: 'Always returns full default values even if no LoomoraProvider wraps the tree.',
      },
    ],
    notes: [
      'Call this hook inside custom application components to reuse shared styling tokens.',
    ],
  },
]

export function getHookDoc(slug: string) {
  return hookCatalog.find((entry) => entry.slug === slug || (slug === 'context-menu' && entry.slug === 'use-context-menu'))
}
