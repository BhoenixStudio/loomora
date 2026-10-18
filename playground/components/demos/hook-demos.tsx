'use client'

import {
  Button,
  CountryType,
  LoomoraProvider,
  SocialType,
  useChrono,
  useContextMenu,
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
import { useRef, useState, type MouseEvent } from 'react'
import {
  ControlInput,
  ControlRange,
  ControlSelect,
  ControlToggle,
  InteractiveLayout,
} from './interactive-controls'

export function UseChronoDemo() {
  const { stamp, relative, diff } = useChrono()
  const [dateInput, setDateInput] = useState(() => new Date().toISOString().slice(0, 10))
  const [compareInput, setCompareInput] = useState(() =>
    new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 10)
  )

  const selectedDate = new Date(dateInput)
  const compareDate = new Date(compareInput)

  const reset = () => {
    setDateInput(new Date().toISOString().slice(0, 10))
    setCompareInput(new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 10))
  }

  const delta = diff(selectedDate, compareDate)

  return (
    <InteractiveLayout
      title="Chrono Controls"
      reset={reset}
      controls={
        <>
          <ControlInput
            label="Target Date"
            value={dateInput}
            type="date"
            onChange={setDateInput}
          />
          <ControlInput
            label="Comparison Date"
            value={compareInput}
            type="date"
            onChange={setCompareInput}
          />
        </>
      }
    >
      <div className="flex flex-col items-center w-full max-w-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-body-3">Calculated Output</span>
        <h3 className="mt-2 text-2xl font-bold text-primary">{relative(selectedDate)}</h3>
        <p className="mt-1 font-mono text-xs text-body-2">
          {String(stamp(selectedDate, { type: 'fullYear' }))}
        </p>

        <div className="mt-6 grid w-full grid-cols-2 gap-2.5 text-start">
          <div className="rounded-xl border border-third bg-second p-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-body-3">Difference</span>
            <p className="mt-1 font-mono text-sm font-bold text-title-1">{delta.differenceInDays} days</p>
          </div>
          <div className="rounded-xl border border-third bg-second p-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-body-3">Total Hours</span>
            <p className="mt-1 font-mono text-sm font-bold text-title-1">{delta.differenceInHours} hrs</p>
          </div>
        </div>
      </div>
    </InteractiveLayout>
  )
}

export function UseResponsiveDemo() {
  const resp = useResponsive()

  return (
    <InteractiveLayout
      title="Breakpoint Status"
      controls={
        <div className="space-y-2">
          <ControlToggle label="isMobile (< 640px)" checked={resp.isMobile} onChange={() => {}} />
          <ControlToggle label="isTablet (768px)" checked={resp.isTablet} onChange={() => {}} />
          <ControlToggle label="isDesktop (1024px+)" checked={resp.isDesktop} onChange={() => {}} />
          <ControlToggle label="isUltra (1920px+)" checked={resp.isUltra} onChange={() => {}} />
        </div>
      }
    >
      <div className="flex flex-col items-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-body-3">Window Dimensions</span>
        <p className="mt-2 text-4xl font-extrabold text-primary sm:text-5xl">
          {resp.windowSize.width} <span className="text-2xl font-normal text-body-3">×</span> {resp.windowSize.height}
          <span className="text-sm font-normal text-body-2 ms-1">px</span>
        </p>
        <p className="mt-3 text-xs text-body-2 max-w-xs">
          Resize your browser window to observe breakpoints update reactively.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-1.5">
          {(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const).map((sz) => {
            const active = Boolean(resp[`is${sz.charAt(0).toUpperCase() + sz.slice(1)}` as keyof typeof resp])
            return (
              <span
                key={sz}
                className={`rounded-lg px-2.5 py-1 font-mono text-xs font-semibold transition ${
                  active
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-second text-body-3 border border-third'
                }`}
              >
                {sz}
              </span>
            )
          })}
        </div>
      </div>
    </InteractiveLayout>
  )
}

export function UseThemeDemo() {
  const { theme, toggleTheme, themeOptions } = useTheme()

  return (
    <InteractiveLayout
      title="Theme Controls"
      controls={
        <>
          <div className="rounded-xl border border-third bg-main p-3 text-xs">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium text-body-2">Current Theme</span>
              <span className="font-mono font-semibold text-primary">{theme}</span>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="w-full rounded-lg bg-primary py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              Toggle theme mode
            </button>
          </div>
          <div className="pt-2 border-t border-third/60 space-y-2">
            {themeOptions.map((opt) => (
              <div
                key={opt.value}
                className={`flex items-center justify-between rounded-xl border p-2.5 text-xs transition ${
                  theme === opt.value
                    ? 'border-primary/50 bg-primary/10 text-primary font-semibold'
                    : 'border-third bg-main text-body-2'
                }`}
              >
                <span>{opt.title}</span>
                <span className="font-mono text-[11px]">{opt.value === theme ? 'active' : opt.value}</span>
              </div>
            ))}
          </div>
        </>
      }
    >
      <div className="flex flex-col items-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-body-3">Theme Preview</span>
        <h3 className="mt-2 text-3xl font-bold text-title-1">{theme} Mode</h3>
        <p className="mt-2 text-xs text-body-2 max-w-xs">
          Synchronized reactively with <code className="font-mono text-primary">&lt;html data-theme="{theme}"&gt;</code> and local storage.
        </p>
        <div className="mt-6 flex flex-wrap justify-center items-center gap-2.5">
          <Button variant="fill" color="primary">Primary</Button>
          <Button variant="outline" color="info">Outline</Button>
          <Button variant="text" color="second">Text</Button>
        </div>
      </div>
    </InteractiveLayout>
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
    <InteractiveLayout
      title="Storage Controls"
      reset={reset}
      controls={
        <>
          <ControlInput
            label="Draft Value"
            value={draft}
            onChange={setDraft}
            placeholder="Type value to persist..."
          />
          <div className="flex gap-2 pt-1">
            <Button
              className="flex-1"
              size="small"
              color="primary"
              onClick={() => setValue(draft)}
            >
              Save value
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
        </>
      }
    >
      <div className="flex flex-col items-center w-full max-w-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-body-3">Stored in localStorage</span>
        <h3 className="mt-2 font-mono text-2xl font-bold text-primary break-all">
          {value || '(empty)'}
        </h3>
        <p className="mt-3 text-xs text-body-2">
          Key: <code className="font-mono text-primary font-semibold">loomora_playground_state</code>
        </p>
        <p className="mt-1 text-[11px] text-body-3">
          Synchronized across browser tabs via <code className="font-mono">useSyncExternalStore</code>.
        </p>
      </div>
    </InteractiveLayout>
  )
}

export function UseCountriesDemo() {
  const { getCountries, getCountry } = useCountries()
  const [query, setQuery] = useState('OM')

  const countries = getCountries()
  const country = getCountry((query.toUpperCase() as CountryType) || 'OM') || countries[0]

  const popularCountries: { value: string; label: string }[] = [
    { value: 'OM', label: 'Oman (OM)' },
    { value: 'US', label: 'United States (US)' },
    { value: 'GB', label: 'United Kingdom (GB)' },
    { value: 'FR', label: 'France (FR)' },
    { value: 'DE', label: 'Germany (DE)' },
    { value: 'JP', label: 'Japan (JP)' },
    { value: 'AE', label: 'United Arab Emirates (AE)' },
    { value: 'SA', label: 'Saudi Arabia (SA)' },
  ]

  return (
    <InteractiveLayout
      title="Country Lookup"
      controls={
        <>
          <ControlInput
            label="ISO Code"
            value={query}
            onChange={(val) => setQuery(val.toUpperCase())}
            placeholder="e.g. OM, US, GB"
          />
          <ControlSelect
            label="Popular presets"
            value={query}
            onChange={setQuery}
            options={popularCountries}
          />
        </>
      }
    >
      <div className="flex flex-col items-center w-full max-w-sm">
        <span className="font-mono text-4xl font-extrabold text-primary">{country.code}</span>
        <h3 className="mt-2 text-2xl font-bold text-title-1">{country.name}</h3>

        <div className="mt-6 grid w-full grid-cols-2 gap-2.5 text-start">
          <div className="rounded-xl border border-third bg-second p-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-body-3">Calling Code</span>
            <p className="mt-1 font-mono text-sm font-bold text-primary">+{country.phone?.code || '—'}</p>
          </div>
          <div className="rounded-xl border border-third bg-second p-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-body-3">Currency</span>
            <p className="mt-1 font-mono text-sm font-bold text-title-1">
              {country.currency?.international} ({country.currency?.symbol})
            </p>
          </div>
        </div>
      </div>
    </InteractiveLayout>
  )
}

export function UseSocialsDemo() {
  const { getSocials, getSocial } = useSocials()
  const [selected, setSelected] = useState<SocialType>('github')

  const socials = getSocials()
  const platform = getSocial(selected) || socials[0]

  return (
    <InteractiveLayout
      title="Platform Selector"
      controls={
        <ControlSelect
          label="Social Platform"
          value={selected}
          onChange={(val) => setSelected(val as SocialType)}
          options={socials.map((s) => ({ value: s.key, label: s.name }))}
        />
      }
    >
      <div className="flex flex-col items-center w-full max-w-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-body-3">Platform Identity</span>
        <h3 className="mt-2 text-3xl font-bold text-title-1">{platform.name}</h3>
        <span className="mt-1 rounded-md bg-second px-2.5 py-0.5 font-mono text-xs font-bold text-primary border border-third">
          {platform.key}
        </span>
        <div className="mt-6 w-full rounded-xl border border-third bg-second p-4 text-start">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-body-3">Placeholder handle</span>
          <p className="mt-1 font-mono text-sm text-primary">{platform.placeholder}</p>
        </div>
      </div>
    </InteractiveLayout>
  )
}

export function UseTimezonesDemo() {
  const { getTimezones } = useTimezones()
  const [search, setSearch] = useState('Muscat')

  const timezones = getTimezones()
  const matched = timezones
    .filter(
      (tz) =>
        tz.name.toLowerCase().includes(search.toLowerCase()) ||
        tz.region.toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, 6)

  return (
    <InteractiveLayout
      title="Timezone Search"
      controls={
        <>
          <ControlInput
            label="Search Query"
            value={search}
            onChange={setSearch}
            placeholder="e.g. Muscat, London, Tokyo..."
          />
          <ControlSelect
            label="Common Cities"
            value={search}
            onChange={setSearch}
            options={[
              { value: 'Muscat', label: 'Muscat (UTC+4)' },
              { value: 'London', label: 'London (UTC+0)' },
              { value: 'Tokyo', label: 'Tokyo (UTC+9)' },
              { value: 'New York', label: 'New York (UTC-5)' },
              { value: 'Cairo', label: 'Cairo (UTC+2)' },
            ]}
          />
        </>
      }
    >
      <div className="w-full max-w-md text-start">
        <span className="text-xs font-semibold uppercase tracking-wider text-body-3 block text-center mb-4">
          Matched Timezones ({matched.length})
        </span>
        <div className="grid gap-2.5">
          {matched.map((tz) => (
            <div key={tz.key} className="flex items-center justify-between rounded-xl border border-third bg-second p-3">
              <div>
                <p className="font-semibold text-title-1 text-sm">{tz.name}</p>
                <span className="text-[11px] text-body-3">Region: {tz.region}</span>
              </div>
              <span className="font-mono text-xs font-bold text-primary rounded-md bg-main px-2 py-1 border border-third">
                {tz.offset}
              </span>
            </div>
          ))}
        </div>
      </div>
    </InteractiveLayout>
  )
}

export function UseHueDemo() {
  const { hex2hsva, hex2rgb } = useHue()
  const [color, setColor] = useState('#6366f1')

  const hsva = hex2hsva(color)
  const rgb = hex2rgb(color) || [99, 102, 241]

  return (
    <InteractiveLayout
      title="Color Controls"
      controls={
        <>
          <ControlInput label="Hex Value" value={color} onChange={setColor} />
          <div className="rounded-xl border border-third bg-main p-3 text-xs">
            <span className="mb-2 block font-medium text-body-2">Visual Picker</span>
            <input
              type="color"
              value={color.slice(0, 7)}
              onChange={(e) => setColor(e.target.value)}
              className="h-9 w-full cursor-pointer rounded-lg border border-third bg-transparent"
            />
          </div>
        </>
      }
    >
      <div className="flex flex-col items-center w-full max-w-sm">
        <div
          className="h-20 w-20 rounded-2xl border-2 border-third shadow-lg mb-4"
          style={{ backgroundColor: color }}
        />
        <h3 className="font-mono text-xl font-bold text-title-1">{color}</h3>

        <div className="mt-6 grid w-full grid-cols-2 gap-2.5 text-start">
          <div className="rounded-xl border border-third bg-second p-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-body-3">HSVA</span>
            <p className="mt-1 font-mono text-xs text-primary">
              {Math.round(hsva.h)}°, {Math.round(hsva.s)}%, {Math.round(hsva.v)}%
            </p>
          </div>
          <div className="rounded-xl border border-third bg-second p-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-body-3">RGB</span>
            <p className="mt-1 font-mono text-xs text-primary">
              {rgb[0]}, {rgb[1]}, {rgb[2]}
            </p>
          </div>
        </div>
      </div>
    </InteractiveLayout>
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
    <InteractiveLayout
      title="Validation Inputs"
      controls={
        <>
          <ControlInput label="Email field" value={email} onChange={setEmail} />
          <ControlRange label="Age field" value={age} min={0} max={100} onChange={setAge} />
        </>
      }
    >
      <div className="flex flex-col items-center w-full max-w-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-body-3">Validation Status</span>
        <span
          className={`mt-2 rounded-full px-4 py-1 font-mono text-sm font-bold ${
            result.isValid ? 'bg-success/15 text-success' : 'bg-error/15 text-error'
          }`}
        >
          {result.isValid ? 'VALID' : 'INVALID'}
        </span>
        <div className="mt-6 w-full rounded-xl border border-third bg-second p-4 text-start">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-body-3">Result details</span>
          {result.errors.length > 0 ? (
            <p className="mt-1 text-xs text-error font-medium">{result.errors.join(', ')}</p>
          ) : (
            <p className="mt-1 text-xs text-body-2">All field types and rules pass.</p>
          )}
        </div>
      </div>
    </InteractiveLayout>
  )
}

export function UseClickAwayDemo() {
  const [isOpen, setIsOpen] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const boxRef = useRef<HTMLDivElement>(null)

  return (
    <InteractiveLayout
      title="Click Away Controls"
      controls={
        <>
          <ControlToggle label="Container open" checked={isOpen} onChange={setIsOpen} />
          <div className="rounded-xl border border-third bg-main p-3 text-xs">
            <span className="font-medium text-body-2 block mb-1">Dismissals Captured</span>
            <span className="font-mono text-lg font-bold text-primary">{clickCount}</span>
          </div>
        </>
      }
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-dashed border-third bg-second p-8 text-center select-none"
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
            className="mt-6 rounded-xl border border-primary bg-main p-5 shadow-xl text-start"
          >
            <h4 className="font-bold text-title-1 text-sm">Targeted Container Active</h4>
            <p className="mt-2 text-xs text-body-2">
              Clicks inside here do not dismiss. Clicks outside trigger the away callback.
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
    </InteractiveLayout>
  )
}

export function UseFloatPosDemo() {
  const [vertical, setVertical] = useState<'bottom' | 'top'>('bottom')
  const [horizontal, setHorizontal] = useState<'end' | 'start'>('end')

  return (
    <InteractiveLayout
      title="Float Orientation"
      controls={
        <>
          <ControlSelect
            label="Vertical Position"
            value={vertical}
            onChange={setVertical}
            options={[
              { value: 'bottom', label: 'bottom' },
              { value: 'top', label: 'top' },
            ]}
          />
          <ControlSelect
            label="Horizontal Position"
            value={horizontal}
            onChange={setHorizontal}
            options={[
              { value: 'end', label: 'end' },
              { value: 'start', label: 'start' },
            ]}
          />
        </>
      }
    >
      <div className="flex flex-col items-center justify-center p-8">
        <div className="relative">
          <button
            type="button"
            className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-md"
          >
            Anchor Target
          </button>
          <div
            className={`absolute z-10 w-44 rounded-xl border border-third bg-second p-3 text-xs shadow-lg ${
              vertical === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'
            } ${horizontal === 'end' ? 'start-0' : 'end-0'}`}
          >
            <p className="font-semibold text-title-1">Floating Box</p>
            <p className="text-[11px] text-body-2">
              pos: <code className="font-mono text-primary font-bold">{vertical}-{horizontal}</code>
            </p>
          </div>
        </div>
      </div>
    </InteractiveLayout>
  )
}

export function UseLoomoraDemo() {
  const config = useLoomora()

  return (
    <InteractiveLayout
      title="Context Overview"
      controls={
        <div className="space-y-2">
          <div className="rounded-xl border border-third bg-main p-3 text-xs flex justify-between items-center">
            <span className="text-body-2">Button Color:</span>
            <span className="font-mono text-primary font-semibold">{config.button?.defaultColor ?? 'default'}</span>
          </div>
          <div className="rounded-xl border border-third bg-main p-3 text-xs flex justify-between items-center">
            <span className="text-body-2">Active Locale:</span>
            <span className="font-mono text-primary font-semibold">{config.settings?.locale ?? 'en'}</span>
          </div>
          <div className="rounded-xl border border-third bg-main p-3 text-xs flex justify-between items-center">
            <span className="text-body-2">RTL Direction:</span>
            <span className="font-mono text-primary font-semibold">{String(config.settings?.isRtl ?? false)}</span>
          </div>
        </div>
      }
    >
      <div className="flex flex-col items-center w-full max-w-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-body-3">Loomora Context</span>
        <h3 className="mt-2 text-2xl font-bold text-title-1">LoomoraProvider</h3>
        <p className="mt-2 text-xs text-body-2 text-center">
          Access configuration, translation helpers, and component defaults from anywhere in your tree.
        </p>
        <div className="mt-6 flex gap-2">
          <Button variant="fill" color="primary">Themed Button</Button>
          <Button variant="outline" color="info">Outline</Button>
        </div>
      </div>
    </InteractiveLayout>
  )
}

export function UseContextMenuDemo() {
  const [controlledOpen, setControlledOpen] = useState(false)
  const [lastAction, setLastAction] = useState('none')

  const uncontrolled = useContextMenu({
    children: (close) => (
      <div className="grid min-w-44 gap-1 rounded-xl border border-third bg-second p-1.5 text-xs shadow-lg">
        <button
          type="button"
          className="rounded-lg px-3 py-2 text-start text-xs hover:bg-main transition"
          onClick={() => {
            setLastAction('Copied text')
            close()
          }}
        >
          📋 Copy text
        </button>
        <button
          type="button"
          className="rounded-lg px-3 py-2 text-start text-xs hover:bg-main transition"
          onClick={() => {
            setLastAction('Renamed item')
            close()
          }}
        >
          ✏️ Rename item
        </button>
        <button
          type="button"
          className="rounded-lg px-3 py-2 text-start text-xs text-error hover:bg-error/10 transition"
          onClick={() => {
            setLastAction('Deleted item')
            close()
          }}
        >
          🗑️ Delete item
        </button>
      </div>
    ),
  })

  const controlled = useContextMenu({
    open: controlledOpen,
    setOpen: setControlledOpen,
    children: (close) => (
      <div className="grid min-w-44 gap-1 rounded-xl border border-third bg-second p-1.5 text-xs shadow-lg">
        <button
          type="button"
          className="rounded-lg px-3 py-2 text-start text-xs hover:bg-main transition"
          onClick={() => {
            setLastAction('Controlled action executed')
            close()
          }}
        >
          ⚡ Controlled action
        </button>
      </div>
    ),
  })

  return (
    <InteractiveLayout
      title="Context Menu Controls"
      controls={
        <>
          <ControlToggle
            label="Controlled open"
            checked={controlledOpen}
            onChange={setControlledOpen}
          />
          <div className="rounded-xl border border-third bg-main p-3 text-xs">
            <span className="font-medium text-body-2 block mb-1">Last Action Taken</span>
            <span className="font-mono text-xs font-semibold text-primary">{lastAction}</span>
          </div>
          <Button
            size="small"
            variant="outline"
            color="info"
            className="w-full"
            onClick={(event: MouseEvent<HTMLButtonElement>) => {
              const rect = event.currentTarget.getBoundingClientRect()
              controlled.openAt(rect.left, rect.bottom + 8)
            }}
          >
            Open at button position
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center w-full max-w-sm">
        <div
          {...uncontrolled.triggerProps}
          className="w-full flex h-36 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/40 bg-second/60 p-6 text-center select-none hover:border-primary transition cursor-context-menu"
        >
          <span className="text-sm font-semibold text-title-1">Right-click this area</span>
          <span className="text-xs text-body-3 mt-1">Context menu opens at cursor coordinates</span>
        </div>
        {uncontrolled.menu}
        {controlled.menu}

        <p className="mt-4 text-xs text-body-2">
          Controlled state: <strong className="font-mono text-primary font-semibold">{controlledOpen ? 'open' : 'closed'}</strong>
        </p>
      </div>
    </InteractiveLayout>
  )
}

export function HookDemoDispatcher({ slug }: { slug: string }) {
  return (
    <LoomoraProvider>
      <HookDemoContent slug={slug} />
    </LoomoraProvider>
  )
}

function HookDemoContent({ slug }: { slug: string }) {
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
    case 'use-context-menu':
    case 'context-menu':
      return <UseContextMenuDemo />
    case 'use-float-pos':
      return <UseFloatPosDemo />
    case 'use-loomora':
      return <UseLoomoraDemo />
    default:
      return <UseChronoDemo />
  }
}
