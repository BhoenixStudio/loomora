'use client'

import {
  Accordion,
  Button,
  CheckField,
  ColorField,
  DateField,
  ProgressBar,
  RatingField,
  TextField,
} from 'loomora'
import { useState } from 'react'

export function ButtonInteractiveDemo() {
  const [title, setTitle] = useState('Save changes')
  const [variant, setVariant] = useState<'fill' | 'outline' | 'text' | 'none'>('fill')
  const [color, setColor] = useState<'primary' | 'info' | 'success' | 'warning' | 'error' | 'second'>('primary')
  const [size, setSize] = useState<'tiny' | 'small' | 'default' | 'large' | 'extreme'>('default')
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [condition, setCondition] = useState(true)
  const [withIcon, setWithIcon] = useState(false)
  const [clickedCount, setClickedCount] = useState(0)

  const reset = () => {
    setTitle('Save changes')
    setVariant('fill')
    setColor('primary')
    setSize('default')
    setLoading(false)
    setDisabled(false)
    setCondition(true)
    setWithIcon(false)
    setClickedCount(0)
  }

  return (
    <div className="space-y-6">
      {/* Live Stage */}
      <div className="flex min-h-36 flex-col items-center justify-center rounded-2xl border border-third bg-main p-8 text-center">
        <Button
          condition={condition}
          variant={variant}
          color={color}
          size={size}
          loading={loading}
          disabled={disabled}
          onClick={() => setClickedCount((c) => c + 1)}
          startIcon={withIcon ? <span aria-hidden="true">★</span> : undefined}
        >
          {title}
        </Button>
        {!condition && (
          <p className="mt-3 text-xs italic text-body-3">
            (Button rendered null because <code className="font-mono">condition=&#123;false&#125;</code>)
          </p>
        )}
        <p className="mt-4 text-xs text-body-2">
          Clicked: <strong className="font-semibold text-title-1">{clickedCount}</strong> time{clickedCount === 1 ? '' : 's'}
        </p>
      </div>

      {/* Control Panel */}
      <div className="rounded-2xl border border-third bg-second p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-third pb-3">
          <h3 className="text-sm font-semibold text-title-1">Interactive Prop Controls</h3>
          <button
            type="button"
            onClick={reset}
            className="text-xs font-semibold text-primary transition hover:underline"
          >
            Reset to defaults
          </button>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-body-2">Title text</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-third bg-main px-3 py-1.5 text-xs text-title-1 outline-none transition focus:border-primary"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-body-2">Variant</span>
            <select
              value={variant}
              onChange={(e) => setVariant(e.target.value as any)}
              className="w-full rounded-xl border border-third bg-main px-3 py-1.5 text-xs text-title-1 outline-none transition focus:border-primary"
            >
              <option value="fill">fill (default)</option>
              <option value="outline">outline</option>
              <option value="text">text</option>
              <option value="none">none</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-body-2">Color</span>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value as any)}
              className="w-full rounded-xl border border-third bg-main px-3 py-1.5 text-xs text-title-1 outline-none transition focus:border-primary"
            >
              <option value="primary">primary (default)</option>
              <option value="info">info</option>
              <option value="success">success</option>
              <option value="warning">warning</option>
              <option value="error">error</option>
              <option value="second">second</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-body-2">Size</span>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as any)}
              className="w-full rounded-xl border border-third bg-main px-3 py-1.5 text-xs text-title-1 outline-none transition focus:border-primary"
            >
              <option value="tiny">tiny</option>
              <option value="small">small</option>
              <option value="default">default</option>
              <option value="large">large</option>
              <option value="extreme">extreme</option>
            </select>
          </label>
        </div>

        {/* Toggles */}
        <div className="mt-4 flex flex-wrap gap-4 border-t border-third/60 pt-3 text-xs">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={loading}
              onChange={(e) => setLoading(e.target.checked)}
              className="rounded border-third text-primary focus:ring-primary"
            />
            <span>loading</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
              className="rounded border-third text-primary focus:ring-primary"
            />
            <span>disabled</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={withIcon}
              onChange={(e) => setWithIcon(e.target.checked)}
              className="rounded border-third text-primary focus:ring-primary"
            />
            <span>startIcon</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={condition}
              onChange={(e) => setCondition(e.target.checked)}
              className="rounded border-third text-primary focus:ring-primary"
            />
            <span>condition</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export function DateFieldInteractiveDemo() {
  const [shape, setShape] = useState<'date' | 'datetime' | 'time' | 'dateRange' | 'timeRange' | 'dateTimeRange'>('date')
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

  // Prop toggles
  const [allowClear, setAllowClear] = useState(true)
  const [hour12, setHour12] = useState(true)
  const [disabled, setDisabled] = useState(false)
  const [hasHelper, setHasHelper] = useState(true)
  const [hasError, setHasError] = useState(false)

  const reset = () => {
    setShape('date')
    setDateVal(new Date())
    setAllowClear(true)
    setHour12(true)
    setDisabled(false)
    setHasHelper(true)
    setHasError(false)
  }

  const shapes = [
    { id: 'date', label: 'Date (Default)' },
    { id: 'datetime', label: 'Date & Time' },
    { id: 'time', label: 'Time' },
    { id: 'dateRange', label: 'Date Range' },
    { id: 'timeRange', label: 'Time Range' },
    { id: 'dateTimeRange', label: 'Date-Time Range' },
  ] as const

  return (
    <div className="space-y-6">
      {/* Shape / Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-third pb-3">
        <div className="flex flex-wrap gap-1.5">
          {shapes.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setShape(s.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                shape === s.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-main text-body-1 hover:bg-second hover:text-title-1'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={reset}
          className="text-xs font-semibold text-primary transition hover:underline"
        >
          Reset to default shape
        </button>
      </div>

      {/* Live Stage */}
      <div className="max-w-xl rounded-2xl border border-third bg-main p-6">
        {shape === 'date' && (
          <DateField
            label="Date picker"
            inputHelper={hasHelper ? 'Pick a date or click calendar icon.' : undefined}
            errors={hasError ? [{ condition: true, helper: 'A valid date is required.' }] : undefined}
            properties={{
              mode: 'date',
              value: dateVal,
              onChange: (val) => setDateVal(val),
              allowClear,
              disabled,
            }}
          />
        )}
        {shape === 'datetime' && (
          <DateField
            label="Date & Time"
            inputHelper={hasHelper ? 'Select both date and hour/minute.' : undefined}
            errors={hasError ? [{ condition: true, helper: 'Invalid timestamp.' }] : undefined}
            properties={{
              mode: 'datetime',
              value: dateTimeVal,
              onChange: (val) => setDateTimeVal(val),
              hour12,
              allowClear,
              disabled,
            }}
          />
        )}
        {shape === 'time' && (
          <DateField
            label="Time picker"
            inputHelper={hasHelper ? 'Select time of day.' : undefined}
            errors={hasError ? [{ condition: true, helper: 'Invalid time.' }] : undefined}
            properties={{
              mode: 'time',
              value: timeVal,
              onChange: (val) => setTimeVal(val),
              hour12,
              allowClear,
              disabled,
            }}
          />
        )}
        {shape === 'dateRange' && (
          <DateField
            label="Date range"
            inputHelper={hasHelper ? 'Select start and end dates.' : undefined}
            errors={hasError ? [{ condition: true, helper: 'Invalid range.' }] : undefined}
            properties={{
              mode: 'dateRange',
              value: dateRangeVal,
              onChange: (val) => setDateRangeVal(val),
              allowClear,
              disabled,
            }}
          />
        )}
        {shape === 'timeRange' && (
          <DateField
            label="Time range"
            inputHelper={hasHelper ? 'Select start and end times.' : undefined}
            errors={hasError ? [{ condition: true, helper: 'Invalid time range.' }] : undefined}
            properties={{
              mode: 'timeRange',
              value: timeRangeVal,
              onChange: (val) => setTimeRangeVal(val),
              hour12,
              allowClear,
              disabled,
            }}
          />
        )}
        {shape === 'dateTimeRange' && (
          <DateField
            label="Date-Time range"
            inputHelper={hasHelper ? 'Select full range timestamps.' : undefined}
            errors={hasError ? [{ condition: true, helper: 'Invalid timestamp range.' }] : undefined}
            properties={{
              mode: 'dateTimeRange',
              value: dateTimeRangeVal,
              onChange: (val) => setDateTimeRangeVal(val),
              hour12,
              allowClear,
              disabled,
            }}
          />
        )}

        <div className="mt-4 rounded-xl border border-third/60 bg-second p-3 text-xs">
          <span className="font-semibold text-title-2">Active value: </span>
          <code className="font-mono text-primary">
            {shape === 'date' && (dateVal ? String(dateVal) : 'null')}
            {shape === 'datetime' && (dateTimeVal ? String(dateTimeVal) : 'null')}
            {shape === 'time' && (timeVal ? String(timeVal) : 'null')}
            {shape === 'dateRange' && JSON.stringify(dateRangeVal)}
            {shape === 'timeRange' && JSON.stringify(timeRangeVal)}
            {shape === 'dateTimeRange' && JSON.stringify(dateTimeRangeVal)}
          </code>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="rounded-2xl border border-third bg-second p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-body-3">Toggles & Modifiers</p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={allowClear}
              onChange={(e) => setAllowClear(e.target.checked)}
              className="rounded border-third text-primary focus:ring-primary"
            />
            <span>allowClear</span>
          </label>
          {(shape === 'datetime' || shape === 'time' || shape === 'timeRange' || shape === 'dateTimeRange') && (
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={hour12}
                onChange={(e) => setHour12(e.target.checked)}
                className="rounded border-third text-primary focus:ring-primary"
              />
              <span>hour12 (12h vs 24h)</span>
            </label>
          )}
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={hasHelper}
              onChange={(e) => setHasHelper(e.target.checked)}
              className="rounded border-third text-primary focus:ring-primary"
            />
            <span>inputHelper</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={hasError}
              onChange={(e) => setHasError(e.target.checked)}
              className="rounded border-third text-primary focus:ring-primary"
            />
            <span>errors (validation state)</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
              className="rounded border-third text-primary focus:ring-primary"
            />
            <span>disabled</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export function TextFieldInteractiveDemo() {
  const [val, setVal] = useState('Loomora Input')
  const [hasHelper, setHasHelper] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const reset = () => {
    setVal('Loomora Input')
    setHasHelper(true)
    setHasError(false)
    setDisabled(false)
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="rounded-2xl border border-third bg-main p-6">
        <TextField
          label="Display name"
          inputHelper={hasHelper ? 'Controlled input value with helper text.' : undefined}
          errors={hasError ? [{ condition: true, helper: 'This field contains an error.' }] : undefined}
          properties={{
            value: val,
            onChange: (e) => setVal(e.target.value),
            disabled,
          }}
        />
        <p className="mt-3 text-xs text-body-2">
          Current value: <code className="font-mono text-primary">{val || '(empty)'}</code>
        </p>
      </div>

      <div className="rounded-2xl border border-third bg-second p-4 sm:p-5">
        <div className="flex items-center justify-between border-b border-third pb-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-body-3">Toggles & Controls</p>
          <button type="button" onClick={reset} className="text-xs font-semibold text-primary transition hover:underline">
            Reset to defaults
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={hasHelper}
              onChange={(e) => setHasHelper(e.target.checked)}
              className="rounded border-third text-primary focus:ring-primary"
            />
            <span>inputHelper</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={hasError}
              onChange={(e) => setHasError(e.target.checked)}
              className="rounded border-third text-primary focus:ring-primary"
            />
            <span>errors (validation state)</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
              className="rounded border-third text-primary focus:ring-primary"
            />
            <span>disabled</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export function AccordionInteractiveDemo() {
  const [initialCollapsed, setInitialCollapsed] = useState(false)
  const [allTitleClickable, setAllTitleClickable] = useState(true)
  const [condition, setCondition] = useState(true)
  const [key, setKey] = useState(0)

  const reset = () => {
    setInitialCollapsed(false)
    setAllTitleClickable(true)
    setCondition(true)
    setKey((k) => k + 1)
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="rounded-2xl border border-third bg-main p-6">
        <Accordion
          key={key}
          title="Account security settings"
          initialCollapsed={initialCollapsed}
          allTitleClickable={allTitleClickable}
          condition={condition}
        >
          <div className="py-2 text-sm leading-6 text-body-1">
            Two-factor authentication and single sign-on options are managed here. The disclosure animates smoothly
            using CSS transitions.
          </div>
        </Accordion>
        {!condition && (
          <p className="text-xs italic text-body-3">(Accordion rendered null because condition is false)</p>
        )}
      </div>

      <div className="rounded-2xl border border-third bg-second p-4 sm:p-5">
        <div className="flex items-center justify-between border-b border-third pb-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-body-3">Toggles & Controls</p>
          <button type="button" onClick={reset} className="text-xs font-semibold text-primary transition hover:underline">
            Reset to defaults
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={initialCollapsed}
              onChange={(e) => {
                setInitialCollapsed(e.target.checked)
                setKey((k) => k + 1)
              }}
              className="rounded border-third text-primary focus:ring-primary"
            />
            <span>initialCollapsed</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={allTitleClickable}
              onChange={(e) => setAllTitleClickable(e.target.checked)}
              className="rounded border-third text-primary focus:ring-primary"
            />
            <span>allTitleClickable</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={condition}
              onChange={(e) => setCondition(e.target.checked)}
              className="rounded border-third text-primary focus:ring-primary"
            />
            <span>condition</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export function CheckFieldInteractiveDemo() {
  const [type, setType] = useState<'checkbox' | 'radio' | 'switch'>('switch')
  const [checked, setChecked] = useState(true)
  const [disabled, setDisabled] = useState(false)
  const [hasHelper, setHasHelper] = useState(true)

  const reset = () => {
    setType('switch')
    setChecked(true)
    setDisabled(false)
    setHasHelper(true)
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="rounded-2xl border border-third bg-main p-6">
        <CheckField
          label="Push notifications"
          inputHelper={hasHelper ? 'Receive immediate alerts for important account events.' : undefined}
          properties={{
            type,
            checked,
            onChange: (e) => setChecked(e.target.checked),
            disabled,
          }}
        />
        <p className="mt-3 text-xs text-body-2">
          State: <strong className="text-title-1">{checked ? 'ON / Checked' : 'OFF / Unchecked'}</strong>
        </p>
      </div>

      <div className="rounded-2xl border border-third bg-second p-4 sm:p-5">
        <div className="flex items-center justify-between border-b border-third pb-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-body-3">Toggles & Controls</p>
          <button type="button" onClick={reset} className="text-xs font-semibold text-primary transition hover:underline">
            Reset to defaults
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
          <label className="flex items-center gap-2">
            <span className="font-medium text-body-2">Type shape:</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="rounded-lg border border-third bg-main px-2.5 py-1 text-xs text-title-1 outline-none transition focus:border-primary"
            >
              <option value="switch">switch (default toggle)</option>
              <option value="checkbox">checkbox</option>
              <option value="radio">radio</option>
            </select>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
              className="rounded border-third text-primary focus:ring-primary"
            />
            <span>disabled</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={hasHelper}
              onChange={(e) => setHasHelper(e.target.checked)}
              className="rounded border-third text-primary focus:ring-primary"
            />
            <span>inputHelper</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export function ProgressBarInteractiveDemo() {
  const [value, setValue] = useState(65)
  const [showText, setShowText] = useState(true)

  const reset = () => {
    setValue(65)
    setShowText(true)
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="rounded-2xl border border-third bg-main p-6">
        <ProgressBar
          value={value}
          outOf={100}
          showValueAsText={showText}
          label="Task completion"
          barColor="bg-primary"
        />
      </div>

      <div className="rounded-2xl border border-third bg-second p-4 sm:p-5">
        <div className="flex items-center justify-between border-b border-third pb-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-body-3">Toggles & Controls</p>
          <button type="button" onClick={reset} className="text-xs font-semibold text-primary transition hover:underline">
            Reset to defaults
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
          <label className="flex items-center gap-2">
            <span>Value ({value}%):</span>
            <input
              type="range"
              min={0}
              max={100}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="h-1.5 cursor-pointer accent-primary"
            />
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={showText}
              onChange={(e) => setShowText(e.target.checked)}
              className="rounded border-third text-primary focus:ring-primary"
            />
            <span>showValueAsText</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export function RatingFieldInteractiveDemo() {
  const [rating, setRating] = useState(3.5)
  const [readOnly, setReadOnly] = useState(false)

  const reset = () => {
    setRating(3.5)
    setReadOnly(false)
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="rounded-2xl border border-third bg-main p-6">
        <RatingField
          label="Experience rating"
          properties={{
            value: rating,
            setValue: setRating,
            max: 5,
            step: 0.5,
            readOnly,
            name: 'experience',
            labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Exceptional'],
          }}
        />
        <p className="mt-3 text-xs text-body-2">
          Current Score: <strong className="font-semibold text-title-1">{rating} / 5</strong>
        </p>
      </div>

      <div className="rounded-2xl border border-third bg-second p-4 sm:p-5">
        <div className="flex items-center justify-between border-b border-third pb-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-body-3">Toggles & Controls</p>
          <button type="button" onClick={reset} className="text-xs font-semibold text-primary transition hover:underline">
            Reset to defaults
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={readOnly}
              onChange={(e) => setReadOnly(e.target.checked)}
              className="rounded border-third text-primary focus:ring-primary"
            />
            <span>readOnly</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export function ColorFieldInteractiveDemo() {
  const [color, setColor] = useState('#6366f1')
  const [alpha, setAlpha] = useState(true)
  const [allowEmpty, setAllowEmpty] = useState(true)

  const reset = () => {
    setColor('#6366f1')
    setAlpha(true)
    setAllowEmpty(true)
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="rounded-2xl border border-third bg-main p-6">
        <ColorField
          label="Accent color"
          alpha={alpha}
          allowEmpty={allowEmpty}
          properties={{ value: color, setValue: setColor }}
        />
        <p className="mt-3 text-xs text-body-2">
          Hex/RGBA value: <code className="font-mono text-primary">{color || '(empty)'}</code>
        </p>
      </div>

      <div className="rounded-2xl border border-third bg-second p-4 sm:p-5">
        <div className="flex items-center justify-between border-b border-third pb-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-body-3">Toggles & Controls</p>
          <button type="button" onClick={reset} className="text-xs font-semibold text-primary transition hover:underline">
            Reset to defaults
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={alpha}
              onChange={(e) => setAlpha(e.target.checked)}
              className="rounded border-third text-primary focus:ring-primary"
            />
            <span>alpha (transparency)</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={allowEmpty}
              onChange={(e) => setAllowEmpty(e.target.checked)}
              className="rounded border-third text-primary focus:ring-primary"
            />
            <span>allowEmpty (clearable)</span>
          </label>
        </div>
      </div>
    </div>
  )
}
