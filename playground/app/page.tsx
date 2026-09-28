'use client'

import {
  Accordion,
  AddLocalStorage,
  Autocomplete,
  Breadcrumbs,
  Button,
  CheckField,
  CheckSlug,
  CopyToClipboard,
  ConditionalWrapper,
  Content,
  Copyrights,
  Dialog,
  Digit,
  Dropdown,
  ElVal,
  Flag,
  Form,
  Input,
  InputHelper,
  Inputs,
  Label,
  Loader,
  LoomoraProvider,
  OtpField,
  ProgressBar,
  PasswordField,
  PhoneInput,
  RangeField,
  SearchField,
  Select,
  TextField,
  TextareaField,
  UploaderField,
  RemoveLocalStorage,
  TextEditor,
  UseToggle,
  UseConvertCase,
  UseDigit,
  UseLocalStorage,
  UseTruncate,
  Validate,
  cn,
  onlyNumberAllowed,
  isThisProps,
  useColors,
  useColorsString,
  useCountries,
  useDates,
  useDocumentAtts,
  useSocials,
  useTheme,
  useTimezones,
  useContent,
  useResponsive,
  useTextEditorData,
  useExtractHeadingsFromHtml,
  usePhoneHelper,
  usePasswordHelper,
  useUploaderHelper,
  ConsoleDebug,
  useContextFns,
} from 'loomora'
import { DialogForm } from '../../src/components/Form/Modules/Dialog'
import type { CountryType, MonthKey, TWColorName } from 'loomora'
import { useState, type MouseEvent, type ReactNode } from 'react'

const classOptions = [
  { value: 'accordion', label: 'Accordion' },
  { value: 'autocomplete', label: 'Autocomplete' },
  { value: 'database', label: 'Database hooks' },
  { value: 'form', label: 'Form fields' },
  { value: 'hooks', label: 'Hooks' },
  { value: 'ui', label: 'UI components' },
]

function Section({
  id,
  number,
  title,
  description,
  children,
}: {
  id: string
  number: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className="demo-section" id={id}>
      <div className="section-heading">
        <span className="section-number">{number}</span>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

function Panel({
  title,
  description,
  children,
  className = '',
}: {
  title: string
  description?: string
  children: ReactNode
  className?: string
}) {
  return (
    <article className={`panel ${className}`}>
      <div className="panel-heading">
        <div>
          <h3>{title}</h3>
          {description && <p>{description}</p>}
        </div>
      </div>
      {children}
    </article>
  )
}

function Result({ children }: { children: ReactNode }) {
  return (
    <pre className="result" aria-live="polite">
      {children}
    </pre>
  )
}

function Playground() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogShow, setDialogShow] = useState(false)
  const [dialogFormOpen, setDialogFormOpen] = useState(false)
  const [dialogFormShow, setDialogFormShow] = useState(false)
  const [agree, setAgree] = useState(false)
  const [choice, setChoice] = useState('')
  const [multiChoice, setMultiChoice] = useState<string[]>([])
  const [otp, setOtp] = useState<string[]>([])
  const [range, setRange] = useState(65)
  const [search, setSearch] = useState('')
  const [savedNote, setSavedNote] = useState(() =>
    UseLocalStorage('playground-note', { isJson: true, defaultValue: '' })
  )
  const [note, setNote] = useState(String(savedNote))
  const [attributeMessage, setAttributeMessage] = useState('Document attributes are untouched.')
  const [validationInput, setValidationInput] = useState('')
  const [toggleOpen, setToggleOpen] = useState(false)
  const [toggleShow, setToggleShow] = useState(false)
  const [contextDemo, setContextDemo] = useState({ clicks: 0, label: 'Initial context' })
  const [clipboardMessage, setClipboardMessage] = useState('')
  const { reducer: contextReducer } = useContextFns({ clicks: 0, label: 'Initial context' })
  const [selectedCountry, setSelectedCountry] = useState<CountryType>('OM')
  const [dataMode, setDataMode] = useState<'countries' | 'socials' | 'timezones'>('countries')

  const { getCountries, getCountry } = useCountries()
  const { getSocial, getSocials } = useSocials()
  const { getTimezone, getTimezones, getTimezonesGrouped, convertTime } = useTimezones()
  const { GetMonths, GetMonth, format, compare, dateRange, addDays, subDays, niceDate, isValid } = useDates()
  const { getColor, hexToRgb, rgbToHsl } = useColors<TWColorName>()
  const { Set: setDocumentAtts } = useDocumentAtts()
  const { theme, updateTheme, toggleTheme, detectSystemTheme, themeResponsive, dynamicTime, setDynamicTime } =
    useTheme()
  const { UseWindow, UseMQ, UseAgent, UseResponsive, isMobile, isTablet, isDesktop } = useResponsive()
  const { CleanPhone } = usePhoneHelper()
  const { GeneratePassword, ValidatePassword } = usePasswordHelper()
  const { acceptRules, calcFileSize } = useUploaderHelper()

  const countries = getCountries()
  const country = getCountry(selectedCountry)
  const socials = getSocials({ only: ['github', 'instagram', 'youtube'] })
  const timezones = getTimezones({ only: ['asia/dubai', 'europe/london', 'america/new_york'] })
  const groupedTimezones = getTimezonesGrouped({ only: ['asia/dubai', 'europe/london', 'america/new_york'] })
  const timezone = getTimezone('asia/dubai')
  const passwordPreview = ValidatePassword('Loomora123!')
  const uploaderRules = acceptRules(['image', '.pdf'])
  const formattedDate = format(new Date('2026-09-29T14:30:00'), {
    type: 'custom',
    format: 'EEEE, MMMM do yyyy · HH:mm',
  })
  const monthSeptember = GetMonth('SEP' as MonthKey)
  const validation = Validate<{ name: string; age: number }>({
    name: { type: 'string', value: validationInput, errorMessage: 'Enter a name to pass validation.' },
    age: { type: 'number', value: 21, errorMessage: 'Age must be greater than zero.' },
  })
  const elementValidation = ElVal<{ disabled: boolean }>(
    { title: 'Ready to continue', props: { disabled: false } },
    { rules: [{ condition: validationInput.length === 0, title: 'Name is required', props: { disabled: true } }] }
  )
  const contentStates = useContent({
    data: ['Button', 'Input', 'Accordion'],
    render: (item) => (
      <span className="tag" key={item}>
        {item}
      </span>
    ),
    renderConditions: [
      {
        condition: validationInput.length > 0,
        render: (item) => (
          <span className="tag" key={item}>
            Filtered: {item}
          </span>
        ),
      },
    ],
    empty: <span className="muted">No components to show.</span>,
  })
  const editorContent =
    '<h2>Editorial preview</h2><p>Explore the <strong>rich-text editor</strong> and heading extraction helpers from the playground.</p>'
  const editorData = useTextEditorData(editorContent, {}, [editorContent])
  const headingData = useExtractHeadingsFromHtml(editorContent)

  const conversion = UseConvertCase('LoomoraPlayground', 'KEBAB')
  const truncation = UseTruncate('A compact preview of a longer sentence generated by the utility hook.', 42)
  const timezoneConverted = convertTime(new Date('2026-09-29T09:00:00'), -4, timezone.offset)
  const getCurrentThemeColor = () => getColor('text-primary', { type: 'RGB', opacity: 85 })

  const saveNote = () => {
    AddLocalStorage('playground-note', note, { isJson: true })
    setSavedNote(note)
  }

  const resetNote = () => {
    RemoveLocalStorage('playground-note')
    setNote('')
    setSavedNote('')
  }

  return (
    <div className="app-shell">
      <aside className="side-rail" aria-label="Playground navigation">
        <a className="brand" href="#top" aria-label="Loomora Playground home">
          <span className="brand-mark">L</span>
          <span>
            loomora<span className="brand-dot">.</span>
            <small>COMPONENT LAB</small>
          </span>
        </a>
        <span className="nav-caption">LIBRARY</span>
        <nav className="side-nav">
          <a href="#components">
            <span>01</span> Components
          </a>
          <a href="#forms">
            <span>02</span> Form fields
          </a>
          <a href="#database">
            <span>03</span> Database
          </a>
          <a href="#hooks">
            <span>04</span> Hooks
          </a>
          <a href="#utilities">
            <span>05</span> Utilities
          </a>
        </nav>
        <div className="rail-footer">
          <span className="status-dot" /> Live playground <span>0.1</span>
        </div>
      </aside>

      <main className="main-content" id="top">
        <header className="topbar">
          <span>
            <span className="breadcrumb-muted">Workspace</span>
            <span className="breadcrumb-slash">/</span> Playground
          </span>
          <div className="topbar-actions">
            <span className="live-pill">
              <span className="status-dot" /> CLIENT RENDERED
            </span>
            <button
              className="theme-control"
              type="button"
              onClick={toggleTheme}
              aria-label={`Current theme ${theme}; toggle light or dark`}
            >
              <span className="theme-orbit">{theme === 'DARK' ? '☾' : '☼'}</span>
              {theme}
            </button>
          </div>
        </header>

        <div className="page-content">
          <section className="hero">
            <div className="hero-copy">
              <span className="eyebrow">
                <span /> PRIVATE DEVELOPMENT SPACE
              </span>
              <h1>
                Build, inspect,
                <br />
                <span>repeat.</span>
              </h1>
              <p>
                A working catalog of Loomora components, hooks, and data helpers. Tweak the controls and see every piece
                in action.
              </p>
              <div className="hero-meta">
                <span className="meta-icon">⌘</span> Changes in <code>src/</code> refresh automatically
              </div>
            </div>
            <div className="hero-card" aria-label="Playground overview">
              <div className="hero-card-top">
                <span>LIBRARY COVERAGE</span>
                <span className="sparkle">✳</span>
              </div>
              <div className="coverage-number">
                28<span>+</span>
              </div>
              <p>
                components &amp; utilities
                <br />
                ready to explore
              </p>
              <div className="coverage-rule">
                <span />
              </div>
              <div className="coverage-footer">
                <span>FORM</span>
                <span>UI</span>
                <span>HOOKS</span>
                <span>DATA</span>
              </div>
            </div>
            <div className="hero-decoration decoration-one" />
            <div className="hero-decoration decoration-two" />
          </section>

          <div className="quick-stats" aria-label="Library areas">
            <div>
              <span className="stat-index">A</span>
              <span>
                <strong>Components</strong>
                <small>UI · Forms · Partials</small>
              </span>
              <span className="stat-arrow">↗</span>
            </div>
            <div>
              <span className="stat-index">B</span>
              <span>
                <strong>Hooks</strong>
                <small>State · DOM · Validation</small>
              </span>
              <span className="stat-arrow">↗</span>
            </div>
            <div>
              <span className="stat-index">C</span>
              <span>
                <strong>Data helpers</strong>
                <small>Countries · Zones · Socials</small>
              </span>
              <span className="stat-arrow">↗</span>
            </div>
          </div>

          <Section
            id="components"
            number="01"
            title="UI components"
            description="Composed primitives and display components, ready to interact with."
          >
            <div className="demo-grid two-columns">
              <Panel title="Buttons" description="Variants, sizes, and loading states">
                <div className="button-showcase">
                  <Button color="info">Primary action</Button>
                  <Button variant="outline" color="info">
                    Outline
                  </Button>
                  <Button variant="text" color="info">
                    Text button
                  </Button>
                  <Button color="success" loading loaderTitle="Saving...">
                    Save changes
                  </Button>
                  <Button variant="fill" color="warning" size="small">
                    Small
                  </Button>
                </div>
              </Panel>

              <Panel title="Display & feedback" description="Number formatting, progress, and skeletons">
                <div className="stack-md">
                  <div className="digit-sample">
                    <span className="muted">Monthly revenue</span>
                    <Digit value={12845.75} decimalsMin={2} decimalsMax={2} endUnit="USD" />
                  </div>
                  <div className="digit-sample">
                    <span className="muted">Utility string · UseDigit</span>
                    <code>{UseDigit(1234.5, { decimalsMin: 2, decimalsMax: 2, endUnit: 'OMR' })}</code>
                  </div>
                  <ProgressBar value={7} outOf={10} showValueAsText label="Build progress" barColor="bg-success" />
                  <div className="loader-row">
                    <Loader height={40} width={40} variant="circle" />
                    <Loader height={12} width="78%" variant="text" counts={3} />
                    <Loader height={44} width={60} variant="square" />
                  </div>
                </div>
              </Panel>

              <Panel title="Accordion & dropdown" description="Expand a section or open the anchored action menu">
                <div className="stack-md">
                  <Accordion title="Accordion example" initialCollapsed>
                    <p className="component-copy">
                      This panel demonstrates the animated disclosure and preserves its child content while collapsed.
                    </p>
                  </Accordion>
                  <Dropdown
                    trigger="More actions"
                    staticPosition
                    position="BOTTOM_START"
                    triggerProps={{ variant: 'outline', color: 'info' }}
                  >
                    {(close) => (
                      <div className="dropdown-items">
                        <button type="button" onClick={close}>
                          Inspect component
                        </button>
                        <button type="button" onClick={close}>
                          Copy example
                        </button>
                        <button type="button" onClick={close}>
                          Reset state
                        </button>
                      </div>
                    )}
                  </Dropdown>
                </div>
              </Panel>

              <Panel title="Breadcrumbs & country flag" description="Navigation trail and the flag asset fallback">
                <Breadcrumbs
                  items={[
                    { title: 'Library', href: '#components' },
                    { title: 'Components', href: '#components' },
                    { title: 'Preview', active: true },
                  ]}
                />
                <div className="flag-preview">
                  <Flag country={selectedCountry} size={30} />
                  <span>{country.name}</span>
                  <code>{country.code}</code>
                </div>
                <Copyrights
                  className="copyright-preview"
                  startYear={2024}
                  sponsor="Bhoenix Studio"
                  sponsorLink="https://example.com"
                  copyrights=" · Crafted for the web"
                />
              </Panel>

              <Panel title="Content states & wrappers" description="Loading, empty, and conditional content helpers">
                <div className="stack-sm">
                  <div className="tag-row">{contentStates.content}</div>
                  <ConditionalWrapper fallback={{ as: 'div', attributes: { className: 'wrapper-preview' } }}>
                    ConditionalWrapper keeps children composable.
                  </ConditionalWrapper>
                  <p className="muted">Type in the validation section to activate the conditional rendering example.</p>
                  <Content
                    data={['Ready', 'Responsive', 'Composable']}
                    render={(item) => (
                      <span className="tag" key={item}>
                        {item}
                      </span>
                    )}
                  />
                </div>
              </Panel>

              <Panel title="Text editor" description="Rich text editing and content analysis helpers">
                <div className="stack-md">
                  <TextEditor label="Rich text editor" properties={{ initialValue: editorContent, height: 260 }} />
                  <div className="tag-row">
                    <span className="tag">Words: {editorData.wordCount}</span>
                    <span className="tag">Characters: {editorData.characterCount}</span>
                    <span className="tag">Read time: {editorData.readTime} min</span>
                  </div>
                  <Result>Heading sections: {JSON.stringify(headingData.sections, null, 2)}</Result>
                </div>
              </Panel>

              <Panel title="Dialog" description="Controlled modal with overlay and Escape handling">
                <Button
                  color="info"
                  onClick={() => {
                    setDialogShow(true)
                    setTimeout(() => setDialogOpen(true), 100)
                  }}
                >
                  Open dialog
                </Button>
                <Dialog
                  open={dialogOpen}
                  setOpen={setDialogOpen}
                  show={dialogShow}
                  setShow={setDialogShow}
                  usePortal={false}
                >
                  <div className="dialog-content">
                    <span className="eyebrow">
                      <span /> INTERACTIVE PREVIEW
                    </span>
                    <h3>Dialog component</h3>
                    <p>Close with Escape, the backdrop, or the button below.</p>
                    <Button
                      variant="outline"
                      color="info"
                      onClick={() => {
                        setDialogOpen(false)
                        setTimeout(() => setDialogShow(false), 300)
                      }}
                    >
                      Close dialog
                    </Button>
                  </div>
                </Dialog>
                <div className="dialog-form-trigger">
                  <Button
                    variant="outline"
                    color="info"
                    onClick={() => {
                      setDialogFormShow(true)
                      setTimeout(() => setDialogFormOpen(true), 100)
                    }}
                  >
                    Open DialogForm
                  </Button>
                </div>
                <DialogForm
                  open={dialogFormOpen}
                  setOpen={setDialogFormOpen}
                  show={dialogFormShow}
                  setShow={setDialogFormShow}
                  dialog={{ usePortal: false }}
                  title="DialogForm composition"
                  inputs={[{ type: 'text', label: 'Dialog field', properties: { placeholder: 'Interactive Form' } }]}
                />
              </Panel>
            </div>
          </Section>

          <Section
            id="forms"
            number="02"
            title="Form fields"
            description="The Input dispatcher plus direct field examples. Change values and try the interactions."
          >
            <Panel
              title="Input dispatcher & form"
              description="Text, select, checks, and range are composed through Form"
            >
              <Form
                className="playground-form"
                inputs={[
                  {
                    type: 'text',
                    label: 'Your name',
                    properties: { placeholder: 'Ada Lovelace', autoComplete: 'name' },
                    inputHelper: 'Standard floating-label text field',
                  },
                  {
                    type: 'search',
                    label: 'Search the library',
                    properties: { placeholder: 'Search components', onSearch: (value) => setSearch(value) },
                  },
                  { type: 'textarea', label: 'Notes', properties: { rows: 3, placeholder: 'Write a quick note...' } },
                  {
                    type: 'select',
                    label: 'Select a country',
                    properties: {
                      value: selectedCountry,
                      onChange: (event) => setSelectedCountry(event.target.value as CountryType),
                    },
                    options: countries.slice(0, 9).map(({ code, name }) => ({ value: code, label: name })),
                  },
                  {
                    type: 'check',
                    label: 'Accept the example terms',
                    properties: { checked: agree, onChange: (event) => setAgree(event.target.checked) },
                  },
                  {
                    type: 'range',
                    label: 'Range field',
                    properties: {
                      value: range,
                      min: 0,
                      max: 100,
                      step: 5,
                      setValue: setRange,
                      showValue: true,
                      showMinMax: true,
                      valueSuffix: '%',
                    },
                  },
                  { type: 'label', children: 'Form input variants share the same config, labels, and helper styles.' },
                  {
                    type: 'custom',
                    element: (
                      <div className="form-value">
                        Current form state · terms {agree ? 'accepted' : 'not accepted'} · range {range}%
                      </div>
                    ),
                  },
                ]}
                actions={[
                  {
                    children: 'Submit example',
                    color: 'info',
                    onClick: (event: MouseEvent<HTMLButtonElement>) => {
                      event.preventDefault()
                      setSearch('Form submitted')
                    },
                  },
                ]}
              />
              <p className="inline-feedback" aria-live="polite">
                {search}
              </p>
            </Panel>

            <div className="demo-grid two-columns form-grid">
              <Panel title="Autocomplete · single & multi" description="Search and select from a local option list">
                <div className="stack-md">
                  <Autocomplete
                    label="Choose a component"
                    options={classOptions}
                    properties={{ value: choice, onChange: (value) => setChoice(String(value ?? '')) }}
                  />
                  <Autocomplete
                    label="Choose several"
                    options={classOptions}
                    properties={{
                      multiple: true,
                      value: multiChoice,
                      onChange: (values) => setMultiChoice(values.map(String)),
                      min: 1,
                      max: 3,
                    }}
                  />
                  <Result>
                    Single: {choice || 'none'} · Multiple: {multiChoice.join(', ') || 'none'}
                  </Result>
                </div>
              </Panel>

              <Panel title="Direct fields" description="Phone, password, OTP, and check-field variants">
                <div className="stack-md">
                  <Input
                    type="phone"
                    label="Phone number"
                    properties={{
                      defaultCountry: selectedCountry,
                      value: '',
                      setValue: (value) => setSearch(value.final),
                    }}
                  />
                  <Input
                    type="password"
                    label="Password strength"
                    hasShow
                    hasGenerate
                    hasValidation
                    showValidationProgress
                    showValidationsList
                    properties={{ placeholder: 'Try a password' }}
                  />
                  <div className="tag-row">
                    <span className="tag">Password strength: {passwordPreview.strength}%</span>
                    <span className="tag">Generated preview: {GeneratePassword(10, { useSpecialChars: false })}</span>
                    <span className="tag">Clean phone: {CleanPhone('+968 9123 4567', 968)}</span>
                    <span className="tag">Uploader accepts: {uploaderRules.accept}</span>
                    <span className="tag">1MB = {calcFileSize(1024 * 1024, 'MB')}</span>
                  </div>
                  <OtpField label="One-time code" length={4} properties={{ value: otp, onChange: setOtp }} />
                  <div className="option-list">
                    <CheckField label="Checkbox" properties={{ type: 'checkbox' }} />
                    <CheckField label="Radio option" properties={{ type: 'radio', name: 'direct-radio' }} />
                    <CheckField label="Switch" properties={{ type: 'switch' }} />
                  </div>
                  <Input
                    type="file"
                    label="Upload files"
                    inputHelper="Drop or choose a file to preview uploader states."
                    properties={{ accept: ['image', '.pdf'], multiple: true, maxFiles: 3 }}
                  />
                </div>
              </Panel>

              <Panel
                title="Select, label & helper"
                description="Direct public exports for smaller form building blocks"
              >
                <div className="stack-md">
                  <Label required>Required label example</Label>
                  <Input
                    type="select"
                    label="Preferred timezone"
                    options={timezones.map(({ key, fullName }) => ({ value: key, label: fullName }))}
                    properties={{ defaultValue: timezones[0]?.key }}
                  />
                  <Input
                    type="text"
                    label="Field with error"
                    error
                    errorHelper="This is a local demonstration error message."
                    properties={{ placeholder: 'Invalid value' }}
                  />
                  <InputHelper>InputHelper can be composed independently with form elements.</InputHelper>
                  <div className="tag-row">
                    <span className="tag">Social records: {socials.length}</span>
                    <span className="tag">Timezone result: {timezone.name}</span>
                    <span className="tag">Grouped regions: {groupedTimezones.length}</span>
                    <span className="tag">Month helper: {monthSeptember.order}</span>
                  </div>
                </div>
              </Panel>

              <Panel
                title="Individual field exports"
                description="Direct component exports are also available without the Input dispatcher"
              >
                <div className="stack-md">
                  <TextField label="TextField" properties={{ placeholder: 'Direct TextField export' }} />
                  <SearchField label="SearchField" properties={{ placeholder: 'Direct SearchField export' }} />
                  <TextareaField
                    label="TextareaField"
                    properties={{ rows: 2, placeholder: 'Direct TextareaField export' }}
                  />
                  <Select
                    label="Select"
                    options={countries.slice(0, 4).map(({ code, name }) => ({ value: code, label: name }))}
                    properties={{ defaultValue: 'OM' }}
                  />
                  <RangeField
                    label="RangeField"
                    properties={{ value: range, min: 0, max: 100, setValue: setRange, showValue: true }}
                  />
                  <PasswordField label="PasswordField" properties={{ placeholder: 'Direct PasswordField export' }} />
                  <PhoneInput
                    label="PhoneInput"
                    properties={{ defaultCountry: 'OM', value: '', setValue: () => undefined }}
                  />
                  <UploaderField label="UploaderField" properties={{ accept: ['image'] }} />
                  <Inputs
                    inputs={[
                      { type: 'text', label: 'Inputs wrapper', properties: { placeholder: 'Direct Inputs export' } },
                    ]}
                  />
                </div>
              </Panel>
            </div>
          </Section>

          <Section
            id="database"
            number="03"
            title="Database hooks"
            description="Explore the bundled catalogs, filters, lookups, groupings, and conversion helpers."
          >
            <Panel
              title="Countries · socials · timezones"
              description="Synchronous catalog access from the public data hooks"
            >
              <div className="segmented-control" role="tablist" aria-label="Select a data catalog">
                {(['countries', 'socials', 'timezones'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    role="tab"
                    aria-selected={dataMode === mode}
                    className={dataMode === mode ? 'selected' : ''}
                    onClick={() => setDataMode(mode)}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              {dataMode === 'countries' && (
                <div className="catalog-layout">
                  <label className="field-label" htmlFor="country-picker">
                    Choose a country
                  </label>
                  <select
                    id="country-picker"
                    className="native-select"
                    value={selectedCountry}
                    onChange={(event) => setSelectedCountry(event.target.value as CountryType)}
                  >
                    {countries.map(({ code, name }) => (
                      <option value={code} key={code}>
                        {name} · {code}
                      </option>
                    ))}
                  </select>
                  <div className="data-card">
                    <Flag country={country.code} size={34} />
                    <div>
                      <strong>{country.name}</strong>
                      <small>
                        {country.code} · +{country.phone.code}
                      </small>
                    </div>
                    <span className="currency-chip">
                      {country.currency.symbol} {country.currency.international ?? 'No ISO currency'}
                    </span>
                  </div>
                  <Result>
                    getCountry('{selectedCountry}')\n
                    {JSON.stringify(
                      { code: country.code, name: country.name, phone: country.phone, currency: country.currency },
                      null,
                      2
                    )}
                  </Result>
                </div>
              )}
              {dataMode === 'socials' && (
                <div className="catalog-layout">
                  <div className="social-cards">
                    {socials.map((social) => (
                      <div className="social-card" key={social.key}>
                        <span className="social-swatch" style={{ backgroundColor: social.color }} />
                        <span>
                          <strong>{social.name}</strong>
                          <small>{social.prefix}</small>
                        </span>
                        <code>{social.key}</code>
                      </div>
                    ))}
                  </div>
                  <Result>getSocial('github')\n{JSON.stringify(getSocial('github'), null, 2)}</Result>
                </div>
              )}
              {dataMode === 'timezones' && (
                <div className="catalog-layout">
                  <div className="timezone-cards">
                    {timezones.map((zone) => (
                      <div className="timezone-card" key={zone.key}>
                        <span className="timezone-clock">◷</span>
                        <div>
                          <strong>{zone.fullNameWithCountry}</strong>
                          <small>
                            {zone.region} · {zone.country.name}
                          </small>
                        </div>
                        <code>
                          GMT{zone.offset >= 0 ? '+' : ''}
                          {zone.offset}
                        </code>
                      </div>
                    ))}
                  </div>
                  <Result>
                    Regions grouped:{' '}
                    {groupedTimezones.map(({ regionKey, zones }) => `${regionKey} (${zones.length})`).join(' · ')}\nNew
                    York 09:00 → Muscat {format(timezoneConverted, { type: 'time24' })}
                  </Result>
                </div>
              )}
            </Panel>
          </Section>

          <Section
            id="hooks"
            number="04"
            title="Hooks & live state"
            description="Test browser-aware providers, controlled state, and commonly used hook outputs."
          >
            <div className="demo-grid two-columns">
              <Panel title="Responsive context" description="Resize the browser to see breakpoint changes">
                <div className="responsive-display">
                  <span>
                    {UseWindow().width}
                    <small>WIDTH</small>
                  </span>
                  <span>
                    {UseWindow().height}
                    <small>HEIGHT</small>
                  </span>
                  <span>
                    {UseMQ('lg')}
                    <small>LG BREAKPOINT</small>
                  </span>
                </div>
                <div className="tag-row">
                  <span className={`tag ${isMobile ? 'tag-active' : ''}`}>Mobile {isMobile ? '✓' : '—'}</span>
                  <span className={`tag ${isTablet ? 'tag-active' : ''}`}>Tablet {isTablet ? '✓' : '—'}</span>
                  <span className={`tag ${isDesktop ? 'tag-active' : ''}`}>Desktop {isDesktop ? '✓' : '—'}</span>
                  <span className="tag">UseAgent desktop: {String(UseAgent('desktop'))}</span>
                  <span className="tag">
                    Responsive: {UseResponsive({ mobile: 'compact', desktop: 'wide' }, 'tablet')}
                  </span>
                </div>
              </Panel>
              <Panel title="Theme context" description="Change theme modes and dynamic range">
                <div className="theme-options">
                  {(['LIGHT', 'DARK', 'SYSTEM', 'DYNAMIC'] as const).map((value) => (
                    <button
                      type="button"
                      className={theme === value ? 'theme-option selected' : 'theme-option'}
                      key={value}
                      onClick={() => updateTheme(value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <div className="stack-sm">
                  <p className="muted">
                    System detection: {detectSystemTheme()} · Theme-aware value:{' '}
                    {themeResponsive('light surface', 'dark surface')}
                  </p>
                  <p className="muted">
                    Dynamic range: {dynamicTime.start}–{dynamicTime.end}
                  </p>
                  <div className="time-inputs">
                    <label>
                      Day starts
                      <input
                        type="time"
                        value={dynamicTime.start}
                        onChange={(event) => setDynamicTime(event.target.value, dynamicTime.end)}
                      />
                    </label>
                    <label>
                      Day ends
                      <input
                        type="time"
                        value={dynamicTime.end}
                        onChange={(event) => setDynamicTime(dynamicTime.start, event.target.value)}
                      />
                    </label>
                  </div>
                  <div className="color-row">
                    <span className="color-swatch" />
                    <code>getColor('primary') → {getCurrentThemeColor() || 'theme token unavailable'}</code>
                    <code>hexToRgb → {hexToRgb('#b9694e').join(', ')}</code>
                    <code>rgbToHsl → {rgbToHsl(185, 105, 78).join(', ')}</code>
                  </div>
                </div>
              </Panel>
              <Panel title="Date & calendar helpers" description="Formatting, comparisons, ranges, and month data">
                <div className="stack-sm">
                  <div className="feature-value">{formattedDate}</div>
                  <div className="tag-row">
                    <span className="tag">Valid: {String(isValid('2026-09-29'))}</span>
                    <span className="tag">Months: {GetMonths().length}</span>
                    <span className="tag">Month order: {monthSeptember.order}</span>
                  </div>
                  <Result>
                    addDays → {format(addDays(new Date('2026-09-29'), 7), { type: 'dayName' })},{' '}
                    {format(addDays(new Date('2026-09-29'), 7), { type: 'custom', format: 'MMM d' })}\nsubDays →{' '}
                    {format(subDays(new Date('2026-09-29'), 7), { type: 'custom', format: 'MMM d' })}\nniceDate →{' '}
                    {niceDate(new Date(Date.now() - 60_000))}\ncompare →{' '}
                    {JSON.stringify(compare('2026-09-29', '2026-10-01'))}\ndateRange →{' '}
                    {JSON.stringify(dateRange({ first: '2026-09-29', second: '2026-09-30' }, 'sameMonth'))}
                  </Result>
                </div>
              </Panel>
              <Panel
                title="Browser storage & document"
                description="Persist a local note and apply / restore temporary document attributes"
              >
                <div className="stack-sm">
                  <label className="field-label" htmlFor="storage-note">
                    Persisted note
                  </label>
                  <textarea
                    id="storage-note"
                    className="native-textarea"
                    rows={2}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="This note is stored in localStorage"
                  />
                  <div className="button-row">
                    <Button size="small" color="info" onClick={saveNote}>
                      Save note
                    </Button>
                    <Button size="small" variant="outline" color="info" onClick={resetNote}>
                      Remove note
                    </Button>
                  </div>
                  <Result>Stored: {String(savedNote || '(empty)')}</Result>
                  <Button
                    size="small"
                    variant="outline"
                    color="info"
                    onClick={() => {
                      setDocumentAtts({
                        html: { className: 'playground-document-test', attributes: { lang: 'en' } },
                        body: { attributes: { title: 'Loomora playground document attributes' } },
                      })
                      setAttributeMessage('Attributes applied; unmount the page to restore the originals.')
                    }}
                  >
                    Apply document attributes
                  </Button>
                  <p className="muted" aria-live="polite">
                    {attributeMessage}
                  </p>
                </div>
              </Panel>
            </div>
          </Section>

          <Section
            id="utilities"
            number="05"
            title="Utility helpers"
            description="Small pure helpers and validation results, shown with their current output."
          >
            <div className="demo-grid two-columns">
              <Panel title="Validation" description="Validate schemas and inspect ElVal rule selection">
                <div className="stack-sm">
                  <label className="field-label" htmlFor="validation-name">
                    Name value
                  </label>
                  <input
                    className="native-input"
                    id="validation-name"
                    value={validationInput}
                    onChange={(event) => setValidationInput(event.target.value)}
                    placeholder="Enter a name to pass validation"
                  />
                  <div className={`validation-badge ${validation.isAllValidate ? 'valid' : 'invalid'}`}>
                    {validation.isAllValidate
                      ? 'All fields valid'
                      : `${validation.errors.length} validation message(s)`}
                  </div>
                  <Result>
                    Validate → {JSON.stringify(validation, null, 2)}\nElVal → {JSON.stringify(elementValidation)}
                  </Result>
                </div>
              </Panel>
              <Panel title="String & class helpers" description="Case conversion, truncation, and class composition">
                <div className="stack-sm">
                  <div className="utility-row">
                    <span>UseConvertCase</span>
                    <code>{conversion}</code>
                  </div>
                  <div className="utility-row">
                    <span>UseTruncate</span>
                    <code>{truncation}</code>
                  </div>
                  <div className="utility-row">
                    <span>UseDigit</span>
                    <code>{UseDigit(1234.5, { decimalsMin: 2, decimalsMax: 2, endUnit: 'OMR' })}</code>
                  </div>
                  <div className="utility-row">
                    <span>cn</span>
                    <code>{cn(['px-3', 'rounded', { value: 'text-primary', condition: true }])}</code>
                  </div>
                  <div className="utility-row">
                    <span>useColorsString</span>
                    <code>{useColorsString(['text-primary', 'bg-main'])}</code>
                  </div>
                  <div className="utility-row">
                    <span>CheckSlug</span>
                    <code>
                      {UseConvertCase('Loomora Playground', 'SLUG')} · {String(CheckSlug(conversion))}
                    </code>
                  </div>
                  <div className="utility-row">
                    <span>onlyNumberAllowed</span>
                    <code>{onlyNumberAllowed('+1 (555) 234-0000', true)}</code>
                  </div>
                  <div className="button-row">
                    <Button
                      size="small"
                      variant="outline"
                      color="info"
                      onClick={() => {
                        void CopyToClipboard('Loomora Playground', {
                          onCopy: setClipboardMessage,
                        }).catch(() => setClipboardMessage('Clipboard access is unavailable in this browser context.'))
                      }}
                    >
                      CopyToClipboard
                    </Button>
                    <span className="muted" aria-live="polite">
                      {clipboardMessage}
                    </span>
                  </div>
                  <div className="utility-row">
                    <span>isThisProps</span>
                    <code>{String(isThisProps({ children: 'label' }, 'children'))}</code>
                  </div>
                  <div className="button-row">
                    <Button
                      size="small"
                      variant="outline"
                      color="info"
                      onClick={() =>
                        UseToggle('toggle', { open: toggleOpen, setOpen: setToggleOpen, setShow: setToggleShow })
                      }
                    >
                      UseToggle · {toggleOpen ? 'close' : 'open'}
                    </Button>
                    <span className="tag">
                      {toggleShow ? 'Shown' : 'Hidden'} / {toggleOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  <div className="button-row">
                    <Button
                      size="small"
                      variant="outline"
                      color="info"
                      onClick={() => {
                        setContextDemo(
                          contextReducer(contextDemo, {
                            type: 'Update',
                            payload: { clicks: contextDemo.clicks + 1, label: 'Updated context' },
                          })
                        )
                        ConsoleDebug('Playground context', contextDemo)
                      }}
                    >
                      useContextFns · update
                    </Button>
                    <Button
                      size="small"
                      variant="text"
                      color="info"
                      onClick={() => setContextDemo(contextReducer(contextDemo, { type: 'Reset' }))}
                    >
                      reset
                    </Button>
                    <span className="tag">
                      {contextDemo.label} · {contextDemo.clicks}
                    </span>
                  </div>
                  <p className="muted">
                    Explore all exports in <code>src/hooks</code>: toggle, clipboard, storage, case conversion,
                    validation, dates, colors, document attributes, DOM positioning, and console helpers.
                  </p>
                </div>
              </Panel>
            </div>
          </Section>

          <footer className="page-footer">
            <span>
              <span className="brand-mark mini">L</span> Loomora Playground
            </span>
            <span>
              Built for the details. <span className="footer-sparkle">✳</span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default function HomePage() {
  return (
    <LoomoraProvider>
      <Playground />
    </LoomoraProvider>
  )
}
