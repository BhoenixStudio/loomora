'use client'

import {
  Accordion,
  Autocomplete,
  Breadcrumbs,
  Button,
  CheckField,
  ConditionalWrapper,
  Content,
  Copyrights,
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
  OtpField,
  PasswordField,
  PhoneInput,
  ProgressBar,
  RangeField,
  SearchField,
  Select,
  TextEditor,
  TextField,
  TextareaField,
} from 'loomora'
import type { FileProps } from 'loomora'
import { UseToggle } from 'loomora'
import { useState, type MouseEvent } from 'react'

const options = [
  { value: 'button', label: 'Button' },
  { value: 'input', label: 'Input' },
  { value: 'accordion', label: 'Accordion' },
  { value: 'dialog', label: 'Dialog' },
]

export function ComponentDemo({ demo }: { demo: string }) {
  return (
    <LoomoraProvider>
      <DemoContent demo={demo} />
    </LoomoraProvider>
  )
}

function DemoContent({ demo }: { demo: string }) {
  const [text, setText] = useState('Loomora')
  const [search, setSearch] = useState('')
  const [textarea, setTextarea] = useState('Edit this example text.')
  const [selected, setSelected] = useState('button')
  const [multiSelected, setMultiSelected] = useState<string[]>([])
  const [checked, setChecked] = useState(false)
  const [range, setRange] = useState(65)
  const [otp, setOtp] = useState<string[]>([])
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [files, setFiles] = useState<FileProps[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogShow, setDialogShow] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [editor, setEditor] = useState('<p>Edit <strong>rich text</strong> in the editor.</p>')

  const demos: Record<string, React.ReactNode> = {
    accordion: (
      <div className="max-w-xl rounded-xl border border-third p-4">
        <Accordion title="Account details" initialCollapsed>
          <div className="pb-3 text-sm leading-6 text-body-1">
            Add useful secondary information here. The disclosure keeps the page focused while making details available
            on demand.
          </div>
        </Accordion>
      </div>
    ),
    button: (
      <div className="flex flex-wrap items-center gap-3">
        <Button color="info" onClick={() => setSubmitted(true)}>
          Save changes
        </Button>
        <Button variant="outline" color="info">
          Outline action
        </Button>
        <Button variant="text" color="info">
          Text action
        </Button>
        <p aria-live="polite" className="w-full text-sm text-body-2">
          {submitted ? 'Action triggered.' : 'Click an action to test its event.'}
        </p>
      </div>
    ),
    dialog: (
      <div>
        <Button color="info" onClick={() => UseToggle('open', { setOpen: setDialogOpen, setShow: setDialogShow })}>
          Open dialog
        </Button>
        <Dialog open={dialogOpen} setOpen={setDialogOpen} show={dialogShow} setShow={setDialogShow} usePortal={false}>
          <div className="max-w-md rounded-2xl border border-third bg-second p-6 shadow-xl">
            <h3 className="text-lg font-semibold">Dialog preview</h3>
            <p className="mt-2 text-sm leading-6 text-body-2">
              Test the dialog close button, Escape key, and overlay behavior.
            </p>
            <Button
              className="mt-5"
              variant="outline"
              color="info"
              onClick={() => UseToggle('close', { open: dialogOpen, setOpen: setDialogOpen, setShow: setDialogShow })}
            >
              Close
            </Button>
          </div>
        </Dialog>
      </div>
    ),
    digit: (
      <div className="flex flex-wrap items-baseline gap-4">
        <Digit value={12845.75} decimalsMin={2} decimalsMax={2} endUnit="USD" />
        <span className="text-sm text-body-2">Formatted amount · 2 decimal places</span>
      </div>
    ),
    dropdown: (
      <Dropdown
        trigger="More actions"
        staticPosition
        position="BOTTOM_START"
        triggerProps={{ variant: 'outline', color: 'info' }}
      >
        {(close) => (
          <div className="grid min-w-44 gap-1 rounded-xl border border-third bg-second p-2 shadow-lg">
            <button className="rounded-lg px-3 py-2 text-start text-sm hover:bg-main" onClick={close}>
              Inspect component
            </button>
            <button className="rounded-lg px-3 py-2 text-start text-sm hover:bg-main" onClick={close}>
              Copy example
            </button>
          </div>
        )}
      </Dropdown>
    ),
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
    'progress-bar': (
      <div className="max-w-lg">
        <ProgressBar value={7} outOf={10} showValueAsText label="Build progress" barColor="bg-success" />
      </div>
    ),
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
    'text-field': (
      <div className="max-w-md">
        <TextField
          label="Display name"
          inputHelper="This value is controlled by the page."
          properties={{ value: text, onChange: (event) => setText(event.target.value), autoComplete: 'name' }}
        />
        <p className="mt-3 text-xs text-body-2">
          Current value: <code>{text || '(empty)'}</code>
        </p>
      </div>
    ),
    'search-field': (
      <div className="max-w-lg">
        <SearchField
          label="Search components"
          properties={{
            value: search,
            onChange: (event) => setSearch(event.target.value),
            onSearch: setSubmittedQuery,
          }}
        />
        <p aria-live="polite" className="mt-3 text-xs text-body-2">
          {submitted ? `Submitted: ${search}` : 'Type a query, then activate the search action.'}
        </p>
      </div>
    ),
    'textarea-field': (
      <div className="max-w-lg">
        <TextareaField
          label="Description"
          properties={{
            value: textarea,
            onChange: (event) => setTextarea(event.target.value),
            rows: 4,
            maxLength: 240,
          }}
        />
        <p className="mt-2 text-end text-xs text-body-2">{textarea.length} / 240</p>
      </div>
    ),
    select: (
      <div className="max-w-sm">
        <Select
          label="Component"
          options={options}
          properties={{ value: selected, onChange: (event) => setSelected(event.target.value) }}
        />
        <p className="mt-3 text-xs text-body-2">Selected: {selected}</p>
      </div>
    ),
    'check-field': (
      <div className="space-y-4">
        <CheckField
          label="Enable product updates"
          inputHelper="You can change this preference later."
          properties={{ type: 'checkbox', checked, onChange: (event) => setChecked(event.target.checked) }}
        />
        <CheckField
          label="I agree to the example terms"
          properties={{ type: 'checkbox', checked: submitted, onChange: (event) => setSubmitted(event.target.checked) }}
        />
        <p className="text-xs text-body-2">
          Updates: {checked ? 'enabled' : 'disabled'} · Terms: {submitted ? 'accepted' : 'not accepted'}
        </p>
      </div>
    ),
    'otp-field': (
      <div>
        <OtpField label="Verification code" length={6} properties={{ value: otp, onChange: setOtp }} />
        <p className="mt-3 text-xs text-body-2">Code: {otp.join('') || 'Enter six digits; paste also works.'}</p>
      </div>
    ),
    'password-field': (
      <div className="max-w-md">
        <PasswordField
          label="Account password"
          hasShow
          hasGenerate
          hasValidation
          showValidationProgress
          showValidationsList
          onGenerate={setPassword}
          properties={{
            value: password,
            onChange: (event) => setPassword(event.target.value),
            autoComplete: 'new-password',
          }}
        />
        <p className="mt-2 text-xs text-body-2">
          Password state is controlled; generated values are returned to this page.
        </p>
      </div>
    ),
    'phone-input': (
      <div className="max-w-lg">
        <PhoneInput
          label="Phone number"
          properties={{ defaultCountry: 'OM', value: phone, setValue: ({ value }) => setPhone(value) }}
        />
        <p className="mt-3 text-xs text-body-2">Local number: {phone || '(empty)'}</p>
      </div>
    ),
    'range-field': (
      <div className="max-w-xl">
        <RangeField
          label="Volume"
          properties={{
            value: range,
            setValue: setRange,
            min: 0,
            max: 100,
            step: 5,
            showValue: true,
            showMinMax: true,
            valueSuffix: '%',
          }}
        />
        <p className="mt-3 text-xs text-body-2">Parent value: {range}</p>
      </div>
    ),
    autocomplete: (
      <div className="grid max-w-lg gap-4">
        <Autocomplete
          label="Choose a component"
          options={options}
          properties={{ value: selected, onChange: (value) => setSelected(String(value ?? '')) }}
        />
        <Autocomplete
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
        <TextEditor label="Article body" properties={{ value: editor, onChange: setEditor, height: 300 }} />
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
