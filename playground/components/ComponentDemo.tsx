'use client'

import type { FileProps } from 'loomora'
import {
  Accordion,
  AutocompleteField,
  Breadcrumbs,
  Button,
  CheckField,
  ColorField,
  ConditionalWrapper,
  Content,
  Copyrights,
  DateField,
  Dialog,
  Digit,
  Dropdown,
  Flag,
  Form,
  Input,
  InputHelper,
  Inputs,
  Label,
  Loader,
  LoomoraProvider,
  NumberField,
  PasswordField,
  PhoneInput,
  PinField,
  ProgressBar,
  RangeField,
  RatingField,
  SearchField,
  SelectField,
  TextEditorField,
  TextField,
  TextareaField,
  fade,
  useChrono,
  useContextMenu,
} from 'loomora'
import { useState, type MouseEvent } from 'react'
import {
  AccordionInteractiveDemo,
  ButtonInteractiveDemo,
  CheckFieldInteractiveDemo,
  ColorFieldInteractiveDemo,
  DateFieldInteractiveDemo,
  DialogInteractiveDemo,
  DropdownInteractiveDemo,
  NumberFieldInteractiveDemo,
  PasswordFieldInteractiveDemo,
  PinFieldInteractiveDemo,
  ProgressBarInteractiveDemo,
  RangeFieldInteractiveDemo,
  RatingFieldInteractiveDemo,
  SearchFieldInteractiveDemo,
  SelectFieldInteractiveDemo,
  TextFieldInteractiveDemo,
  TextareaFieldInteractiveDemo,
} from './demos/interactive-demos'

const options = [
  { value: 'button', label: 'Button' },
  { value: 'input', label: 'Input' },
  { value: 'accordion', label: 'Accordion' },
  { value: 'dialog', label: 'Dialog' },
]

function ContextMenuDemo() {
  const [controlledOpen, setControlledOpen] = useState(false)
  const [lastAction, setLastAction] = useState('none')

  const uncontrolled = useContextMenu({
    children: (close) => (
      <div className="grid min-w-44 gap-1">
        <button
          className="rounded-lg px-3 py-2 text-start text-sm hover:bg-second"
          onClick={() => {
            setLastAction('Copied (uncontrolled)')
            close()
          }}
        >
          Copy text
        </button>
        <button
          className="rounded-lg px-3 py-2 text-start text-sm hover:bg-second"
          onClick={() => {
            setLastAction('Renamed (uncontrolled)')
            close()
          }}
        >
          Rename
        </button>
      </div>
    ),
  })

  const controlled = useContextMenu({
    open: controlledOpen,
    setOpen: setControlledOpen,
    children: (
      <div className="grid min-w-44 gap-1">
        <button
          className="rounded-lg px-3 py-2 text-start text-sm hover:bg-second"
          onClick={() => {
            setLastAction('Deleted (controlled)')
            setControlledOpen(false)
          }}
        >
          Delete item
        </button>
      </div>
    ),
  })

  return (
    <div className="max-w-xl space-y-6">
      <div
        {...uncontrolled.triggerProps}
        className="flex h-28 items-center justify-center rounded-xl border border-dashed border-third text-sm text-body-2 select-none"
      >
        Right-click this area
      </div>
      {uncontrolled.menu}

      <div className="space-y-3">
        <Button
          variant="outline"
          color="info"
          onClick={(event: MouseEvent<HTMLButtonElement>) => {
            const rect = event.currentTarget.getBoundingClientRect()
            controlled.openAt(rect.left, rect.bottom)
          }}
        >
          Open controlled menu
        </Button>
        <div
          {...controlled.triggerProps}
          className="flex h-16 items-center justify-center rounded-xl border border-third text-sm text-body-2 select-none"
        >
          Right-click or use the button above
        </div>
        {controlled.menu}
      </div>

      <p aria-live="polite" className="text-xs text-body-2">
        Last action: {lastAction}. Controlled menu open: {controlledOpen ? 'yes' : 'no'}.
      </p>
    </div>
  )
}

function ChronoDemo() {
  const { stamp, diff, relative, forward, rewind, timeSpan, listMonths } = useChrono()
  const [activeTab, setActiveTab] = useState<'relative' | 'stamp' | 'diff' | 'step' | 'months'>('relative')
  const [baseDate, setBaseDate] = useState(() => new Date().toISOString().slice(0, 16))
  const [stepDays, setStepDays] = useState(7)
  const [customFormat, setCustomFormat] = useState('EEEE, d MMMM yyyy HH:mm')
  const [selectedPreset, setSelectedPreset] = useState<string>('fullTime24')
  const [selectedLocale, setSelectedLocale] = useState('en')
  const [compareDate, setCompareDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - 3)
    return d.toISOString().slice(0, 16)
  })

  const dateObj = new Date(baseDate)
  const compareObj = new Date(compareDate)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-third pb-3">
        {(
          [
            ['relative', 'Relative Time'],
            ['stamp', 'Formatting (stamp)'],
            ['diff', 'Date Diff & TimeSpan'],
            ['step', 'Forward & Rewind'],
            ['months', 'Month Catalog'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activeTab === key
                ? 'bg-primary text-white shadow-sm'
                : 'border border-third bg-second text-title-2 hover:border-primary/50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-body-2">Primary Date</span>
          <input
            type="datetime-local"
            value={baseDate}
            onChange={(e) => setBaseDate(e.target.value)}
            className="w-full rounded-xl border border-third bg-second px-3 py-2 text-sm text-title-1 outline-none focus:border-primary"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-body-2">Locale</span>
          <select
            value={selectedLocale}
            onChange={(e) => setSelectedLocale(e.target.value)}
            className="w-full rounded-xl border border-third bg-second px-3 py-2 text-sm text-title-1 outline-none focus:border-primary"
          >
            <option value="en">English (en)</option>
            <option value="ar">Arabic (ar)</option>
            <option value="fr">French (fr)</option>
            <option value="es">Spanish (es)</option>
            <option value="de">German (de)</option>
            <option value="ja">Japanese (ja)</option>
          </select>
        </label>
      </div>

      {activeTab === 'relative' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-third bg-second p-4">
            <p className="text-xs uppercase tracking-wider text-body-3">Result of relative(date)</p>
            <p className="mt-2 text-2xl font-bold text-primary">
              {relative(dateObj, { locale: selectedLocale }) || '(invalid date)'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="self-center text-xs text-body-2">Quick Presets:</span>
            {[
              { label: 'Now', offsetSec: 0 },
              { label: '-5 min', offsetSec: -300 },
              { label: '-2 hours', offsetSec: -7200 },
              { label: 'Yesterday', offsetSec: -86400 },
              { label: '+3 days', offsetSec: 259200 },
              { label: '-3 months', offsetSec: -7776000 },
              { label: '+1 year', offsetSec: 31536000 },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  const d = new Date(Date.now() + p.offsetSec * 1000)
                  setBaseDate(d.toISOString().slice(0, 16))
                }}
                className="rounded-lg border border-third bg-main px-2.5 py-1 text-xs hover:border-primary/50"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'stamp' && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-body-2">Preset Type</span>
              <select
                value={selectedPreset}
                onChange={(e) => setSelectedPreset(e.target.value)}
                className="w-full rounded-xl border border-third bg-second px-3 py-2 text-sm text-title-1 outline-none focus:border-primary"
              >
                <option value="custom">custom (token pattern)</option>
                <option value="number">number (yyyyMMdd)</option>
                <option value="fullYear">fullYear (yyyy)</option>
                <option value="smallYear">smallYear (yy)</option>
                <option value="month">month (MM)</option>
                <option value="day">day (dd)</option>
                <option value="dayName">dayName (weekday long)</option>
                <option value="shortDayName">shortDayName (weekday short)</option>
                <option value="fullTime24">fullTime24 (HH:mm:ss)</option>
                <option value="fullTime12">fullTime12 (hh:mm:ss aa)</option>
                <option value="time24">time24 (HH:mm)</option>
                <option value="time12">time12 (hh:mm aa)</option>
                <option value="relative">relative</option>
              </select>
            </label>
            {selectedPreset === 'custom' && (
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-body-2">Custom Pattern Tokens</span>
                <input
                  type="text"
                  value={customFormat}
                  onChange={(e) => setCustomFormat(e.target.value)}
                  placeholder="e.g. yyyy-MM-dd HH:mm:ss"
                  className="w-full rounded-xl border border-third bg-second px-3 py-2 text-sm text-title-1 outline-none focus:border-primary"
                />
              </label>
            )}
          </div>
          <div className="rounded-xl border border-third bg-second p-4">
            <p className="text-xs uppercase tracking-wider text-body-3">Formatted Output</p>
            <p className="mt-2 font-mono text-2xl font-bold text-primary">
              {String(
                (selectedPreset === 'custom'
                  ? stamp(dateObj, { type: 'custom', format: customFormat, locale: selectedLocale })
                  : stamp(dateObj, { type: selectedPreset as any, locale: selectedLocale })) ?? 'null'
              )}
            </p>
          </div>
        </div>
      )}

      {activeTab === 'diff' && (
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-body-2">Compare Target Date</span>
            <input
              type="datetime-local"
              value={compareDate}
              onChange={(e) => setCompareDate(e.target.value)}
              className="w-full rounded-xl border border-third bg-second px-3 py-2 text-sm text-title-1 outline-none focus:border-primary"
            />
          </label>
          {(() => {
            const diffResult = diff(dateObj, compareObj, { type: 'before' })
            const spanResult = timeSpan({ first: dateObj, second: compareObj }, 'dynamic')
            return (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-third bg-second p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-body-3">diff() Calculations</p>
                  <ul className="space-y-1 font-mono text-xs text-body-1">
                    <li>
                      Match (first &lt; second):{' '}
                      <span className="font-bold text-title-1">{String(diffResult.match)}</span>
                    </li>
                    <li>
                      Hours: <span className="font-bold text-title-1">{diffResult.differenceInHours}</span>
                    </li>
                    <li>
                      Days: <span className="font-bold text-title-1">{diffResult.differenceInDays}</span>
                    </li>
                    <li>
                      Weeks: <span className="font-bold text-title-1">{diffResult.differenceInWeeks}</span>
                    </li>
                    <li>
                      Months: <span className="font-bold text-title-1">{diffResult.differenceInMonths}</span>
                    </li>
                    <li>
                      Years: <span className="font-bold text-title-1">{diffResult.differenceInYears}</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-xl border border-third bg-second p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-body-3">
                    timeSpan() Dynamic Window
                  </p>
                  <ul className="space-y-1 font-mono text-xs text-body-1">
                    <li>
                      Match: <span className="font-bold text-title-1">{String(spanResult.match)}</span>
                    </li>
                    <li>
                      Range: <span className="font-bold text-title-1">{spanResult.range || 'none'}</span>
                    </li>
                    <li>
                      Fallback: <span className="font-bold text-title-1">{spanResult.fallback || 'none'}</span>
                    </li>
                  </ul>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {activeTab === 'step' && (
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-body-2">Days to Step</span>
            <input
              type="number"
              value={stepDays}
              onChange={(e) => setStepDays(Number(e.target.value))}
              className="w-full rounded-xl border border-third bg-second px-3 py-2 text-sm text-title-1 outline-none focus:border-primary"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-third bg-second p-4">
              <p className="text-xs uppercase tracking-wider text-body-3">forward(date, {stepDays})</p>
              <p className="mt-2 font-mono text-lg font-bold text-title-1">
                {forward(dateObj, stepDays)?.toLocaleDateString(selectedLocale, { dateStyle: 'full' }) ?? 'null'}
              </p>
            </div>
            <div className="rounded-xl border border-third bg-second p-4">
              <p className="text-xs uppercase tracking-wider text-body-3">rewind(date, {stepDays})</p>
              <p className="mt-2 font-mono text-lg font-bold text-title-1">
                {rewind(dateObj, stepDays)?.toLocaleDateString(selectedLocale, { dateStyle: 'full' }) ?? 'null'}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'months' && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {listMonths().map((m) => (
            <div key={m.key} className="rounded-xl border border-third bg-second p-3 text-center">
              <span className="block text-[10px] font-semibold uppercase tracking-widest text-primary">#{m.order}</span>
              <p className="text-sm font-semibold text-title-1">{m.name ?? m.key}</p>
              <span className="text-xs text-body-3">{m.shortName ?? m.key}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function ComponentDemo({ demo }: Readonly<{ demo: string }>) {
  return (
    <LoomoraProvider>
      <DemoContent demo={demo} />
    </LoomoraProvider>
  )
}

function DemoContent({ demo }: Readonly<{ demo: string }>) {
  const [text, setText] = useState('Loomora')
  const [search, setSearch] = useState('')
  const [textarea, setTextarea] = useState('Edit this example text.')
  const [selected, setSelected] = useState('button')
  const [multiSelected, setMultiSelected] = useState<string[]>([])
  const [checked, setChecked] = useState(false)
  const [range, setRange] = useState(65)
  const [rating, setRating] = useState(3.5)
  const [amount, setAmount] = useState<number | undefined>(1234.5)
  const [color, setColor] = useState('#6366f1')
  const [colorAlpha, setColorAlpha] = useState('#ec489980')
  const [pin, setPin] = useState<string[]>([])
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [files, setFiles] = useState<FileProps[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogShow, setDialogShow] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [editor, setEditor] = useState('<p>Edit <strong>rich text</strong> in the editor.</p>')
  const [dateVal, setDateVal] = useState<Date | string | null>(new Date())
  const [dateTimeVal, setDateTimeVal] = useState<Date | string | null>(new Date())
  const [timeVal, setTimeVal] = useState<Date | string | null>('14:30')
  const [dateRangeVal, setDateRangeVal] = useState<[Date | string | null, Date | string | null]>([
    new Date(),
    new Date(Date.now() + 6 * 86400000),
  ])
  const [timeRangeVal, setTimeRangeVal] = useState<[Date | string | null, Date | string | null]>(['09:00', '17:30'])
  const [dateTimeRangeVal, setDateTimeRangeVal] = useState<[Date | string | null, Date | string | null]>([
    new Date(),
    new Date(Date.now() + 3 * 86400000),
  ])

  const demos: Record<string, React.ReactNode> = {
    accordion: <AccordionInteractiveDemo />,
    button: <ButtonInteractiveDemo />,
    dialog: <DialogInteractiveDemo />,
    digit: (
      <div className="flex flex-wrap items-baseline gap-4">
        <Digit value={12845.75} decimalsMin={2} decimalsMax={2} endUnit="USD" />
        <span className="text-sm text-body-2">Formatted amount · 2 decimal places</span>
      </div>
    ),
    dropdown: <DropdownInteractiveDemo />,
    flag: (
      <div className="flex items-center gap-4">
        <Flag country="OM" size={48} />
        <span>
          <strong className="block">Oman</strong>
          <small className="text-body-2">Country flag · 3:2 ratio</small>
        </span>
      </div>
    ),
    breadcrumbs: (
      <Breadcrumbs
        items={[
          { title: 'Library', href: '/' },
          { title: 'Components', href: '/' },
          { title: 'Breadcrumbs', active: true },
        ]}
      />
    ),
    copyrights: (
      <Copyrights
        startYear={2024}
        sponsor="Bhoenix Studio"
        sponsorLink="https://example.com"
        copyrights=" · Crafted for the web"
      />
    ),
    loader: (
      <div className="max-w-xs space-y-3">
        <Loader variant="text" counts={3} height="1rem" width="16rem" wrapperClassName="gap-2" />
        <Loader height={40} width={40} variant="circle" />
      </div>
    ),
    'progress-bar': <ProgressBarInteractiveDemo />,
    label: (
      <div className="max-w-sm">
        <Label required>Email address</Label>
        <TextField
          label="Email address"
          properties={{
            type: 'email',
            value: email,
            onChange: (event) => setEmail(event.target.value),
            autoComplete: 'email',
          }}
        />
      </div>
    ),
    'input-helper': (
      <div className="grid max-w-md gap-4">
        <div>
          <Label>Password</Label>
          <TextField
            label="Password"
            properties={{ value: password, onChange: (event) => setPassword(event.target.value) }}
          />
          <InputHelper>Use at least 12 characters.</InputHelper>
        </div>
        <InputHelper asError attributes={{ role: 'alert' }}>
          This message shows the error style.
        </InputHelper>
      </div>
    ),
    'text-field': <TextFieldInteractiveDemo />,
    'search-field': <SearchFieldInteractiveDemo />,
    'textarea-field': <TextareaFieldInteractiveDemo />,
    select: <SelectFieldInteractiveDemo />,
    'check-field': <CheckFieldInteractiveDemo />,
    'pin-field': <PinFieldInteractiveDemo />,
    'password-field': <PasswordFieldInteractiveDemo />,
    'phone-input': (
      <div className="max-w-lg">
        <PhoneInput
          label="Phone number"
          properties={{ defaultCountry: 'OM', value: phone, setValue: ({ value }) => setPhone(value) }}
        />
        <p className="mt-3 text-xs text-body-2">Local number: {phone || '(empty)'}</p>
      </div>
    ),
    'range-field': <RangeFieldInteractiveDemo />,
    'rating-field': <RatingFieldInteractiveDemo />,
    'number-field': <NumberFieldInteractiveDemo />,
    'color-field': <ColorFieldInteractiveDemo />,
    'date-field': <DateFieldInteractiveDemo />,
    autocomplete: (
      <div className="grid max-w-lg gap-4">
        <AutocompleteField
          label="Choose a component"
          options={options}
          properties={{ value: selected, onChange: (value) => setSelected(String(value ?? '')) }}
        />
        <AutocompleteField
          label="Choose multiple"
          options={options}
          properties={{
            multiple: true,
            value: multiSelected,
            onChange: (values) => setMultiSelected(values.map(String)),
            min: 1,
            max: 3,
          }}
        />
        <p className="text-xs text-body-2">
          Single selection: {selected} · Multiple: {multiSelected.join(', ') || 'none'}
        </p>
      </div>
    ),
    'uploader-field': (
      <div className="max-w-xl">
        <Input
          type="file"
          label="Attachments"
          inputHelper="Choose image or PDF files. Preview state is controlled."
          properties={{
            multiple: true,
            value: files,
            onChange: (next) => setFiles(next),
            accept: ['image', '.pdf'],
            maxFiles: 3,
          }}
        />
        <p className="mt-3 text-xs text-body-2">{files.length} file preview(s) selected.</p>
      </div>
    ),
    'text-editor': (
      <div className="max-w-3xl">
        <TextEditorField label="Article body" properties={{ value: editor, onChange: setEditor, height: 300 }} />
        <p className="mt-3 text-xs text-body-2">Editor content length: {editor.length} characters.</p>
      </div>
    ),
    form: (
      <div className="max-w-2xl">
        <Form
          className="gap-4"
          inputs={[
            {
              type: 'text',
              label: 'Name',
              properties: { value: text, onChange: (event) => setText(event.target.value) },
            },
            {
              type: 'select',
              label: 'Favorite component',
              options,
              properties: { value: selected, onChange: (event) => setSelected(event.target.value) },
            },
            {
              type: 'check',
              label: 'Subscribe to updates',
              properties: { type: 'checkbox', checked, onChange: (event) => setChecked(event.target.checked) },
            },
          ]}
          actions={[
            {
              children: 'Save example',
              color: 'info',
              onClick: (event: MouseEvent<HTMLButtonElement>) => {
                event.preventDefault()
                setSubmitted(true)
              },
            },
          ]}
        />
        <p aria-live="polite" className="mt-3 text-xs text-body-2">
          {submitted ? 'Form action handled by the playground.' : 'All fields are controlled by this page.'}
        </p>
      </div>
    ),
    input: (
      <div className="max-w-md">
        <Input
          type="text"
          label="Display name"
          properties={{ value: text, onChange: (event) => setText(event.target.value) }}
        />
        <p className="mt-3 text-xs text-body-2">Dispatched value: {text || '(empty)'}</p>
      </div>
    ),
    inputs: (
      <div className="max-w-2xl">
        <Inputs
          inputs={[
            {
              type: 'text',
              label: 'First name',
              properties: { value: text, onChange: (event) => setText(event.target.value) },
            },
            {
              type: 'textarea',
              label: 'Short bio',
              properties: { value: textarea, onChange: (event) => setTextarea(event.target.value), rows: 2 },
            },
          ]}
        />
        <p className="mt-3 text-xs text-body-2">Both fields are controlled by this page.</p>
      </div>
    ),
    'conditional-wrapper': (
      <div className="max-w-md space-y-3">
        <ConditionalWrapper
          childrenCondition={checked}
          fallback={{
            as: 'div',
            attributes: { className: 'rounded-xl border border-dashed border-third p-4 text-sm text-body-2' },
          }}
        >
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
            The conditional wrapper is active.
          </div>
        </ConditionalWrapper>
        <CheckField
          label="Enable wrapper styling"
          properties={{ type: 'checkbox', checked, onChange: (event) => setChecked(event.target.checked) }}
        />
      </div>
    ),
    'context-menu': <ContextMenuDemo />,
    chrono: <ChronoDemo />,
    content: (
      <Content
        data={['Button', 'Input', 'Accordion']}
        render={(item) => (
          <span key={item} className="rounded-lg border border-third bg-main px-3 py-2 text-sm">
            {item}
          </span>
        )}
        empty={<p className="text-sm text-body-2">No components found.</p>}
      />
    ),
  }

  return (
    <div className="[&_fieldset]:max-w-full">
      {demos[demo] ?? <p className="text-sm text-body-2">No live example is available for this component yet.</p>}
    </div>
  )

  function setSubmittedQuery(value: string) {
    setSearch(value)
    setSubmitted(true)
  }
}
