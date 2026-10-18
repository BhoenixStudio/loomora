'use client'

import {
  Button,
  CountryType,
  SocialType,
  useChrono,
  useCountries,
  useHue,
  useLoomora,
  useResponsive,
  useSocials,
  useStorageState,
  useStrict,
  useTheme,
  useTimezones,
} from 'loomora'
import { useRef, useState } from 'react'

export function UseChronoDemo() {
  const { stamp, relative, diff } = useChrono()
  const [dateInput, setDateInput] = useState(() => new Date().toISOString().slice(0, 10))
  const [compareInput, setCompareInput] = useState(() => new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 10))

  const selectedDate = new Date(dateInput)
  const compareDate = new Date(compareInput)

  const reset = () => {
    setDateInput(new Date().toISOString().slice(0, 10))
    setCompareInput(new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 10))
  }

  const delta = diff(selectedDate, compareDate)

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-third bg-main p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-body-2">Target Date</span>
            <input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full rounded-xl border border-third bg-second px-3 py-2 text-xs text-title-1 outline-none focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-body-2">Comparison Date</span>
            <input
              type="date"
              value={compareInput}
              onChange={(e) => setCompareInput(e.target.value)}
              className="w-full rounded-xl border border-third bg-second px-3 py-2 text-xs text-title-1 outline-none focus:border-primary"
            />
          </label>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-third bg-second p-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-body-3">Relative from now</span>
            <p className="mt-1 font-semibold text-title-1">{relative(selectedDate)}</p>
          </div>
          <div className="rounded-xl border border-third bg-second p-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-body-3">Formatted stamp</span>
            <p className="mt-1 font-semibold text-title-1">{String(stamp(selectedDate, { type: 'fullYear' }))}</p>
          </div>
          <div className="rounded-xl border border-third bg-second p-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-body-3">Difference in days</span>
            <p className="mt-1 font-semibold text-title-1">{delta.differenceInDays} days</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-third bg-second p-4">
        <p className="text-xs text-body-2">Tested in real time via native browser Intl engine.</p>
        <button type="button" onClick={reset} className="text-xs font-semibold text-primary hover:underline">
          Reset to today
        </button>
      </div>
    </div>
  )
}

export function UseResponsiveDemo() {
  const resp = useResponsive()

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-third bg-main p-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-body-3">Current Window Dimensions</p>
        <p className="mt-2 text-4xl font-extrabold text-primary">
          {resp.windowSize.width} <span className="text-xl font-normal text-body-3">×</span> {resp.windowSize.height}
          <span className="text-sm font-normal text-body-2 ms-1">px</span>
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          <span
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
              resp.isMobile ? 'bg-primary text-white shadow-md' : 'border border-third bg-second text-body-3'
            }`}
          >
            isMobile {resp.isMobile ? '✓' : ''}
          </span>
          <span
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
              resp.isTablet ? 'bg-primary text-white shadow-md' : 'border border-third bg-second text-body-3'
            }`}
          >
            isTablet {resp.isTablet ? '✓' : ''}
          </span>
          <span
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
              resp.isDesktop ? 'bg-primary text-white shadow-md' : 'border border-third bg-second text-body-3'
            }`}
          >
            isDesktop {resp.isDesktop ? '✓' : ''}
          </span>
          <span
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
              resp.isUltra ? 'bg-primary text-white shadow-md' : 'border border-third bg-second text-body-3'
            }`}
          >
            isUltra {resp.isUltra ? '✓' : ''}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-third bg-second p-4 text-xs text-body-2">
        Resize your browser window to observe breakpoints update reactively.
      </div>
    </div>
  )
}

export function UseThemeDemo() {
  const { theme, toggleTheme, themeOptions } = useTheme()

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-third bg-main p-6 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-body-3">Active Theme State</span>
        <h3 className="mt-2 text-2xl font-bold text-title-1">{theme} Mode</h3>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-md transition hover:-translate-y-0.5"
          >
            Toggle Theme ({theme})
          </button>
        </div>

        <div className="mt-6 grid gap-2 sm:grid-cols-3 max-w-lg mx-auto text-xs text-start">
          {themeOptions.map((opt) => (
            <div
              key={opt.value}
              className={`rounded-xl border p-3 ${
                theme === opt.value ? 'border-primary bg-primary/10 text-primary' : 'border-third bg-second'
              }`}
            >
              <span className="font-semibold">{opt.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-third bg-second p-4 text-xs text-body-2">
        Synchronized with HTML root data-theme attribute and localStorage.
      </div>
    </div>
  )
}

export function UseStorageStateDemo() {
  const [value, setValue, removeValue] = useStorageState('loomora_playground_state', {
    type: 'local',
    json: false,
    fallback: 'Hello Loomora',
  })
  const [draft, setDraft] = useState(value)

  const reset = () => {
    setValue('Hello Loomora')
    setDraft('Hello Loomora')
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-third bg-main p-6">
        <label className="block max-w-md">
          <span className="mb-1 block text-xs font-medium text-body-2">Update stored value in localStorage</span>
          <div className="flex gap-2">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="flex-1 rounded-xl border border-third bg-second px-3 py-2 text-xs text-title-1 outline-none focus:border-primary"
            />
            <Button
              size="small"
              color="primary"
              onClick={() => setValue(draft)}
            >
              Save
            </Button>
            <Button
              size="small"
              variant="outline"
              color="error"
              onClick={() => {
                removeValue()
                setDraft('')
              }}
            >
              Clear
            </Button>
          </div>
        </label>

        <div className="mt-4 rounded-xl border border-third bg-second p-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-body-3">Active Reactive Value</span>
          <p className="mt-1 font-mono text-sm font-semibold text-primary">{value || '(empty)'}</p>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-third bg-second p-4">
        <p className="text-xs text-body-2">Synced using useSyncExternalStore across all open browser tabs.</p>
        <button type="button" onClick={reset} className="text-xs font-semibold text-primary hover:underline">
          Reset to default
        </button>
      </div>
    </div>
  )
}

export function UseCountriesDemo() {
  const { getCountries, getCountry } = useCountries()
  const [query, setQuery] = useState('OM')

  const countries = getCountries()
  const country = getCountry((query.toUpperCase() as CountryType) || 'OM') || countries[0]

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-third bg-main p-6">
        <label className="block max-w-xs">
          <span className="mb-1 block text-xs font-medium text-body-2">Lookup by ISO alpha-2 code</span>
          <input
            type="text"
            maxLength={2}
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            placeholder="e.g. OM, US, GB, FR, JP"
            className="w-full rounded-xl border border-third bg-second px-3 py-2 text-xs font-mono font-bold text-title-1 outline-none focus:border-primary"
          />
        </label>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-third bg-second p-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-body-3">Country Name</span>
            <p className="mt-1 text-base font-bold text-title-1">{country.name}</p>
            <span className="text-xs font-mono text-body-3">ISO: {country.code}</span>
          </div>

          <div className="rounded-xl border border-third bg-second p-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-body-3">Calling Dial Code</span>
            <p className="mt-1 text-base font-bold text-primary">+{country.phone?.code || '—'}</p>
          </div>

          <div className="rounded-xl border border-third bg-second p-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-body-3">Official Currency</span>
            <p className="mt-1 text-base font-bold text-title-1">
              {country.currency?.international} ({country.currency?.symbol})
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-third bg-second p-4 text-xs text-body-2">
        Querying {countries.length} static country datasets without network overhead.
      </div>
    </div>
  )
}

export function UseSocialsDemo() {
  const { getSocials, getSocial } = useSocials()
  const [selected, setSelected] = useState<SocialType>('github')

  const socials = getSocials()
  const platform = getSocial(selected) || socials[0]

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-third bg-main p-6">
        <div className="flex flex-wrap gap-2">
          {socials.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSelected(s.key)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                selected === s.key
                  ? 'bg-primary text-white shadow-xs'
                  : 'border border-third bg-second text-title-1 hover:bg-third'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-third bg-second p-5">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-title-1">{platform.name}</h4>
            <span className="rounded-md bg-main px-2 py-0.5 font-mono text-xs text-primary">{platform.key}</span>
          </div>
          <p className="mt-2 text-xs text-body-2">
            Example handle placeholder: <code className="rounded bg-main px-1.5 py-0.5 text-primary">{platform.placeholder}</code>
          </p>
        </div>
      </div>
    </div>
  )
}

export function UseTimezonesDemo() {
  const { getTimezones } = useTimezones()
  const [search, setSearch] = useState('Muscat')

  const timezones = getTimezones()
  const matched = timezones
    .filter((tz) => tz.name.toLowerCase().includes(search.toLowerCase()) || tz.region.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 6)

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-third bg-main p-6">
        <label className="block max-w-sm">
          <span className="mb-1 block text-xs font-medium text-body-2">Search Timezone or Region</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g. Muscat, London, Tokyo, New York"
            className="w-full rounded-xl border border-third bg-second px-3 py-2 text-xs text-title-1 outline-none focus:border-primary"
          />
        </label>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {matched.map((tz) => (
            <div key={tz.key} className="rounded-xl border border-third bg-second p-3.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-semibold text-title-1 text-sm">{tz.name}</span>
                <span className="font-mono text-xs font-bold text-primary">{tz.offset}</span>
              </div>
              <p className="mt-1 text-xs text-body-3">Region: {tz.region}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function UseHueDemo() {
  const { hex2hsva, hex2rgb } = useHue()
  const [color, setColor] = useState('#6366f1')

  const hsva = hex2hsva(color)
  const rgb = hex2rgb(color) || [99, 102, 241]

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-third bg-main p-6">
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={color.slice(0, 7)}
            onChange={(e) => setColor(e.target.value)}
            className="h-12 w-12 cursor-pointer rounded-xl border border-third bg-transparent"
          />
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="rounded-xl border border-third bg-second px-3 py-2 font-mono text-xs text-title-1 outline-none focus:border-primary"
          />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-third bg-second p-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-body-3">HSVA Color Space</span>
            <p className="mt-1 font-mono text-xs text-title-1">
              H: {Math.round(hsva.h)}° · S: {Math.round(hsva.s)}% · V: {Math.round(hsva.v)}% · A: {hsva.a}
            </p>
          </div>
          <div className="rounded-xl border border-third bg-second p-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-body-3">RGB Color Space</span>
            <p className="mt-1 font-mono text-xs text-title-1">
              rgb({rgb[0]}, {rgb[1]}, {rgb[2]})
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function UseStrictDemo() {
  const { check } = useStrict()
  const [email, setEmail] = useState('developer@loomora.dev')
  const [age, setAge] = useState(25)

  const result = check({
    email: { type: 'string', value: email, required: true },
    age: { type: 'number', value: age, required: true },
  })

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-third bg-main p-6">
        <div className="grid gap-4 sm:grid-cols-2 max-w-lg">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-body-2">Email Address</span>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-third bg-second px-3 py-2 text-xs text-title-1 outline-none focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-body-2">Age</span>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full rounded-xl border border-third bg-second px-3 py-2 text-xs text-title-1 outline-none focus:border-primary"
            />
          </label>
        </div>

        <div className="mt-6 rounded-xl border border-third bg-second p-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-body-3">Validation Result:</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                result.isValid ? 'bg-success/15 text-success' : 'bg-error/15 text-error'
              }`}
            >
              {result.isValid ? 'Valid' : 'Invalid'}
            </span>
          </div>
          {result.errors.length > 0 ? (
            <p className="mt-2 text-xs text-error">{result.errors.join(', ')}</p>
          ) : (
            <p className="mt-2 text-xs text-body-2">All fields satisfy validation rules.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export function UseClickAwayDemo() {
  const [isOpen, setIsOpen] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const boxRef = useRef<HTMLDivElement>(null)

  return (
    <div className="space-y-6">
      <div
        className="rounded-2xl border border-dashed border-third bg-main p-8 text-center"
        onClick={() => {
          if (isOpen) {
            setClickCount((c) => c + 1)
            setIsOpen(false)
          }
        }}
      >
        <p className="text-xs text-body-2 mb-4">Clicking outside the modal card automatically dismisses it.</p>
        <Button
          color="primary"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation()
            setIsOpen(true)
          }}
        >
          Open Targeted Container
        </Button>

        {isOpen && (
          <div
            ref={boxRef}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="mx-auto mt-6 max-w-sm rounded-2xl border border-primary bg-second p-6 shadow-xl"
          >
            <h4 className="font-bold text-title-1">Inside Container</h4>
            <p className="mt-2 text-xs text-body-2">
              Clicks inside here do not trigger the away callback. Clicks anywhere outside will dismiss this.
            </p>
            <Button
              className="mt-4"
              size="small"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Close Manually
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-third bg-second p-4 text-xs text-body-2">
        Outside dismissals captured: <strong className="text-title-1">{clickCount}</strong>
      </div>
    </div>
  )
}

export function UseFloatPosDemo() {
  const [vertical, setVertical] = useState<'bottom' | 'top'>('bottom')
  const [horizontal, setHorizontal] = useState<'end' | 'start'>('end')

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center rounded-2xl border border-third bg-main p-12">
        <div className="relative">
          <button className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-md">
            Anchor Target
          </button>
          <div
            className={`absolute z-10 w-44 rounded-xl border border-third bg-second p-3 text-xs shadow-lg ${
              vertical === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'
            } ${horizontal === 'end' ? 'start-0' : 'end-0'}`}
          >
            <p className="font-semibold text-title-1">Floating Box</p>
            <p className="text-[11px] text-body-2">pos: {vertical}-{horizontal}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-third bg-second p-4 text-xs">
        <label className="flex items-center gap-2">
          <span>Vertical Orientation:</span>
          <select
            value={vertical}
            onChange={(e) => setVertical(e.target.value as any)}
            className="rounded-lg border border-third bg-main px-2 py-1 text-xs outline-none"
          >
            <option value="bottom">bottom</option>
            <option value="top">top</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <span>Horizontal Alignment:</span>
          <select
            value={horizontal}
            onChange={(e) => setHorizontal(e.target.value as any)}
            className="rounded-lg border border-third bg-main px-2 py-1 text-xs outline-none"
          >
            <option value="end">end</option>
            <option value="start">start</option>
          </select>
        </label>
      </div>
    </div>
  )
}

export function UseLoomoraDemo() {
  const config = useLoomora()

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-third bg-main p-6">
        <h4 className="text-sm font-semibold text-title-1">Active Loomora Context Defaults</h4>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-third bg-second p-3.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-body-3">Button Default Color</span>
            <p className="mt-1 font-mono text-xs font-bold text-primary">{config.button?.defaultColor ?? 'default'}</p>
          </div>
          <div className="rounded-xl border border-third bg-second p-3.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-body-3">Active Locale / RTL</span>
            <p className="mt-1 font-mono text-xs font-bold text-title-1">
              locale: {config.settings?.locale ?? 'en'} · isRtl: {String(config.settings?.isRtl ?? false)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function HookDemoDispatcher({ slug }: { slug: string }) {
  switch (slug) {
    case 'use-chrono':
      return <UseChronoDemo />
    case 'use-responsive':
      return <UseResponsiveDemo />
    case 'use-theme':
      return <UseThemeDemo />
    case 'use-storage-state':
      return <UseStorageStateDemo />
    case 'use-countries':
      return <UseCountriesDemo />
    case 'use-socials':
      return <UseSocialsDemo />
    case 'use-timezones':
      return <UseTimezonesDemo />
    case 'use-hue':
      return <UseHueDemo />
    case 'use-strict':
      return <UseStrictDemo />
    case 'use-click-away':
      return <UseClickAwayDemo />
    case 'use-float-pos':
      return <UseFloatPosDemo />
    case 'use-loomora':
      return <UseLoomoraDemo />
    default:
      return <UseChronoDemo />
  }
}
