'use client'

import {
  Accordion,
  Button,
  CheckField,
  ColorField,
  DateField,
  Dialog,
  Dropdown,
  NumberField,
  PasswordField,
  PinField,
  ProgressBar,
  RangeField,
  RatingField,
  SearchField,
  SelectField,
  TextField,
  TextareaField,
  fade,
} from 'loomora'
import { useState } from 'react'
import {
  ControlInput,
  ControlRange,
  ControlSelect,
  ControlToggle,
  InteractiveLayout,
} from './interactive-controls'

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
    <InteractiveLayout
      reset={reset}
      controls={
        <>
          <ControlInput label="Title text" value={title} onChange={setTitle} />
          <ControlSelect
            label="Variant"
            value={variant}
            onChange={setVariant}
            options={[
              { value: 'fill', label: 'fill (default)' },
              { value: 'outline', label: 'outline' },
              { value: 'text', label: 'text' },
              { value: 'none', label: 'none' },
            ]}
          />
          <ControlSelect
            label="Color"
            value={color}
            onChange={setColor}
            options={[
              { value: 'primary', label: 'primary (default)' },
              { value: 'info', label: 'info' },
              { value: 'success', label: 'success' },
              { value: 'warning', label: 'warning' },
              { value: 'error', label: 'error' },
              { value: 'second', label: 'second' },
            ]}
          />
          <ControlSelect
            label="Size"
            value={size}
            onChange={setSize}
            options={[
              { value: 'tiny', label: 'tiny' },
              { value: 'small', label: 'small' },
              { value: 'default', label: 'default' },
              { value: 'large', label: 'large' },
              { value: 'extreme', label: 'extreme' },
            ]}
          />
          <div className="pt-2 border-t border-third/60 space-y-2">
            <ControlToggle label="loading" checked={loading} onChange={setLoading} />
            <ControlToggle label="disabled" checked={disabled} onChange={setDisabled} />
            <ControlToggle label="startIcon" checked={withIcon} onChange={setWithIcon} />
            <ControlToggle label="condition" checked={condition} onChange={setCondition} />
          </div>
        </>
      }
    >
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
        Clicked: <strong className="font-semibold text-title-1">{clickedCount}</strong> time
        {clickedCount === 1 ? '' : 's'}
      </p>
    </InteractiveLayout>
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

  return (
    <InteractiveLayout
      reset={reset}
      controls={
        <>
          <ControlSelect
            label="Picker Mode / Shape"
            value={shape}
            onChange={setShape}
            options={[
              { value: 'date', label: 'Date (default)' },
              { value: 'datetime', label: 'Date & Time' },
              { value: 'time', label: 'Time' },
              { value: 'dateRange', label: 'Date Range' },
              { value: 'timeRange', label: 'Time Range' },
              { value: 'dateTimeRange', label: 'Date-Time Range' },
            ]}
          />
          <div className="pt-2 border-t border-third/60 space-y-2">
            <ControlToggle label="allowClear" checked={allowClear} onChange={setAllowClear} />
            {(shape === 'datetime' || shape === 'time' || shape === 'timeRange' || shape === 'dateTimeRange') && (
              <ControlToggle
                label="hour12 (12h vs 24h)"
                checked={hour12}
                onChange={setHour12}
              />
            )}
            <ControlToggle label="inputHelper" checked={hasHelper} onChange={setHasHelper} />
            <ControlToggle label="errors (invalid state)" checked={hasError} onChange={setHasError} />
            <ControlToggle label="disabled" checked={disabled} onChange={setDisabled} />
          </div>
        </>
      }
    >
      <div className="w-full max-w-sm text-start">
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
          <code className="font-mono text-primary break-all">
            {shape === 'date' && (dateVal ? String(dateVal) : 'null')}
            {shape === 'datetime' && (dateTimeVal ? String(dateTimeVal) : 'null')}
            {shape === 'time' && (timeVal ? String(timeVal) : 'null')}
            {shape === 'dateRange' && JSON.stringify(dateRangeVal)}
            {shape === 'timeRange' && JSON.stringify(timeRangeVal)}
            {shape === 'dateTimeRange' && JSON.stringify(dateTimeRangeVal)}
          </code>
        </div>
      </div>
    </InteractiveLayout>
  )
}

export function TextFieldInteractiveDemo() {
  const [val, setVal] = useState('Loomora Input')
  const [hasHelper, setHasHelper] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [labelFloating, setLabelFloating] = useState(false)

  const reset = () => {
    setVal('Loomora Input')
    setHasHelper(true)
    setHasError(false)
    setDisabled(false)
    setLabelFloating(false)
  }

  return (
    <InteractiveLayout
      reset={reset}
      controls={
        <>
          <ControlInput label="Field value" value={val} onChange={setVal} />
          <div className="pt-2 border-t border-third/60 space-y-2">
            <ControlToggle label="inputHelper" checked={hasHelper} onChange={setHasHelper} />
            <ControlToggle label="errors (invalid state)" checked={hasError} onChange={setHasError} />
            <ControlToggle label="labelFloating" checked={labelFloating} onChange={setLabelFloating} />
            <ControlToggle label="disabled" checked={disabled} onChange={setDisabled} />
          </div>
        </>
      }
    >
      <div className="w-full max-w-sm text-start">
        <TextField
          label="Display name"
          labelFloating={labelFloating}
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
    </InteractiveLayout>
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
    <InteractiveLayout
      reset={reset}
      controls={
        <div className="space-y-2">
          <ControlToggle
            label="initialCollapsed"
            checked={initialCollapsed}
            onChange={(checked) => {
              setInitialCollapsed(checked)
              setKey((k) => k + 1)
            }}
          />
          <ControlToggle
            label="allTitleClickable"
            checked={allTitleClickable}
            onChange={setAllTitleClickable}
          />
          <ControlToggle label="condition" checked={condition} onChange={setCondition} />
        </div>
      }
    >
      <div className="w-full max-w-md text-start">
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
          <p className="mt-3 text-xs italic text-body-3">(Accordion rendered null because condition is false)</p>
        )}
      </div>
    </InteractiveLayout>
  )
}

export function CheckFieldInteractiveDemo() {
  const [type, setType] = useState<'checkbox' | 'radio' | 'switch'>('checkbox')
  const [checked, setChecked] = useState(true)
  const [disabled, setDisabled] = useState(false)
  const [hasHelper, setHasHelper] = useState(true)

  const reset = () => {
    setType('checkbox')
    setChecked(true)
    setDisabled(false)
    setHasHelper(true)
  }

  return (
    <InteractiveLayout
      reset={reset}
      controls={
        <>
          <ControlSelect
            label="Type shape"
            value={type}
            onChange={setType}
            options={[
              { value: 'checkbox', label: 'checkbox (default)' },
              { value: 'switch', label: 'switch (toggle)' },
              { value: 'radio', label: 'radio' },
            ]}
          />
          <div className="pt-2 border-t border-third/60 space-y-2">
            <ControlToggle label="checked" checked={checked} onChange={setChecked} />
            <ControlToggle label="disabled" checked={disabled} onChange={setDisabled} />
            <ControlToggle label="inputHelper" checked={hasHelper} onChange={setHasHelper} />
          </div>
        </>
      }
    >
      <div className="w-full max-w-sm text-start">
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
        <p className="mt-4 text-xs text-body-2">
          Current state: <strong className="font-semibold text-title-1">{checked ? 'ON / Checked' : 'OFF / Unchecked'}</strong>
        </p>
      </div>
    </InteractiveLayout>
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
    <InteractiveLayout
      reset={reset}
      controls={
        <>
          <ControlRange label="Progress value" value={value} suffix="%" onChange={setValue} />
          <div className="pt-2 border-t border-third/60 space-y-2">
            <ControlToggle label="showValueAsText" checked={showText} onChange={setShowText} />
          </div>
        </>
      }
    >
      <div className="w-full max-w-md text-start">
        <ProgressBar
          value={value}
          outOf={100}
          showValueAsText={showText}
          label="Task completion"
          barColor="bg-primary"
        />
      </div>
    </InteractiveLayout>
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
    <InteractiveLayout
      reset={reset}
      controls={
        <>
          <ControlRange
            label="Score"
            value={rating}
            min={0}
            max={5}
            step={0.5}
            suffix=" / 5"
            onChange={setRating}
          />
          <div className="pt-2 border-t border-third/60 space-y-2">
            <ControlToggle label="readOnly" checked={readOnly} onChange={setReadOnly} />
          </div>
        </>
      }
    >
      <div className="w-full max-w-sm text-start">
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
    </InteractiveLayout>
  )
}

export function ColorFieldInteractiveDemo() {
  const [color, setColor] = useState('#6366f1')
  const [alpha, setAlpha] = useState(true)
  const [allowEmpty, setAllowEmpty] = useState(true)
  const [disabled, setDisabled] = useState(false)

  const reset = () => {
    setColor('#6366f1')
    setAlpha(true)
    setAllowEmpty(true)
    setDisabled(false)
  }

  return (
    <InteractiveLayout
      reset={reset}
      controls={
        <>
          <ControlInput label="Hex / RGBA value" value={color} onChange={setColor} />
          <div className="pt-2 border-t border-third/60 space-y-2">
            <ControlToggle label="alpha (transparency)" checked={alpha} onChange={setAlpha} />
            <ControlToggle label="allowEmpty (clearable)" checked={allowEmpty} onChange={setAllowEmpty} />
            <ControlToggle label="disabled" checked={disabled} onChange={setDisabled} />
          </div>
        </>
      }
    >
      <div className="w-full max-w-sm text-start">
        <ColorField
          label="Accent color"
          alpha={alpha}
          allowEmpty={allowEmpty}
          disabled={disabled}
          properties={{ value: color, setValue: setColor }}
        />
        <p className="mt-3 text-xs text-body-2">
          Hex/RGBA value: <code className="font-mono text-primary">{color || '(empty)'}</code>
        </p>
      </div>
    </InteractiveLayout>
  )
}

export function RangeFieldInteractiveDemo() {
  const [value, setValue] = useState(65)
  const [showValue, setShowValue] = useState(true)
  const [showMinMax, setShowMinMax] = useState(true)
  const [disabled, setDisabled] = useState(false)

  const reset = () => {
    setValue(65)
    setShowValue(true)
    setShowMinMax(true)
    setDisabled(false)
  }

  return (
    <InteractiveLayout
      reset={reset}
      controls={
        <>
          <ControlRange label="Slider value" value={value} suffix="%" onChange={setValue} />
          <div className="pt-2 border-t border-third/60 space-y-2">
            <ControlToggle label="showValue" checked={showValue} onChange={setShowValue} />
            <ControlToggle label="showMinMax" checked={showMinMax} onChange={setShowMinMax} />
            <ControlToggle label="disabled" checked={disabled} onChange={setDisabled} />
          </div>
        </>
      }
    >
      <div className="w-full max-w-md text-start">
        <RangeField
          label="Volume level"
          disabled={disabled}
          properties={{
            value,
            setValue,
            min: 0,
            max: 100,
            step: 5,
            showValue,
            showMinMax,
            valueSuffix: '%',
          }}
        />
        <p className="mt-3 text-xs text-body-2">
          Parent value: <strong className="font-semibold text-title-1">{value}%</strong>
        </p>
      </div>
    </InteractiveLayout>
  )
}

export function PasswordFieldInteractiveDemo() {
  const [password, setPassword] = useState('')
  const [hasShow, setHasShow] = useState(true)
  const [hasGenerate, setHasGenerate] = useState(true)
  const [hasValidation, setHasValidation] = useState(true)
  const [showValidationProgress, setShowValidationProgress] = useState(true)
  const [showValidationsList, setShowValidationsList] = useState(true)
  const [disabled, setDisabled] = useState(false)

  const reset = () => {
    setPassword('')
    setHasShow(true)
    setHasGenerate(true)
    setHasValidation(true)
    setShowValidationProgress(true)
    setShowValidationsList(true)
    setDisabled(false)
  }

  return (
    <InteractiveLayout
      reset={reset}
      controls={
        <>
          <ControlInput
            label="Password value"
            value={password}
            type="password"
            placeholder="Type or generate..."
            onChange={setPassword}
          />
          <div className="pt-2 border-t border-third/60 space-y-2">
            <ControlToggle label="hasShow" checked={hasShow} onChange={setHasShow} />
            <ControlToggle label="hasGenerate" checked={hasGenerate} onChange={setHasGenerate} />
            <ControlToggle label="hasValidation" checked={hasValidation} onChange={setHasValidation} />
            <ControlToggle
              label="showValidationProgress"
              checked={showValidationProgress}
              onChange={setShowValidationProgress}
            />
            <ControlToggle
              label="showValidationsList"
              checked={showValidationsList}
              onChange={setShowValidationsList}
            />
            <ControlToggle label="disabled" checked={disabled} onChange={setDisabled} />
          </div>
        </>
      }
    >
      <div className="w-full max-w-md text-start">
        <PasswordField
          label="Account password"
          hasShow={hasShow}
          hasGenerate={hasGenerate}
          hasValidation={hasValidation}
          showValidationProgress={showValidationProgress}
          showValidationsList={showValidationsList}
          onGenerate={setPassword}
          properties={{
            value: password,
            onChange: (event) => setPassword(event.target.value),
            autoComplete: 'new-password',
            disabled,
          }}
        />
        <p className="mt-3 text-xs text-body-2">
          Current length: <strong className="font-semibold text-title-1">{password.length}</strong> chars
        </p>
      </div>
    </InteractiveLayout>
  )
}

export function SelectFieldInteractiveDemo() {
  const options = [
    { value: 'button', label: 'Button component' },
    { value: 'input', label: 'Input field' },
    { value: 'accordion', label: 'Accordion disclosure' },
    { value: 'dialog', label: 'Dialog modal' },
  ]
  const [selected, setSelected] = useState('button')
  const [disabled, setDisabled] = useState(false)
  const [hasHelper, setHasHelper] = useState(true)
  const [hasError, setHasError] = useState(false)

  const reset = () => {
    setSelected('button')
    setDisabled(false)
    setHasHelper(true)
    setHasError(false)
  }

  return (
    <InteractiveLayout
      reset={reset}
      controls={
        <>
          <ControlSelect
            label="Selected value"
            value={selected}
            onChange={setSelected}
            options={options}
          />
          <div className="pt-2 border-t border-third/60 space-y-2">
            <ControlToggle label="disabled" checked={disabled} onChange={setDisabled} />
            <ControlToggle label="inputHelper" checked={hasHelper} onChange={setHasHelper} />
            <ControlToggle label="errors (invalid state)" checked={hasError} onChange={setHasError} />
          </div>
        </>
      }
    >
      <div className="w-full max-w-sm text-start">
        <SelectField
          label="Component selection"
          options={options}
          inputHelper={hasHelper ? 'Choose a component from the list.' : undefined}
          errors={hasError ? [{ condition: true, helper: 'Selection is required.' }] : undefined}
          properties={{
            value: selected,
            onChange: (e) => setSelected(e.target.value),
            disabled,
          }}
        />
        <p className="mt-3 text-xs text-body-2">
          Active selection: <code className="font-mono text-primary font-semibold">{selected}</code>
        </p>
      </div>
    </InteractiveLayout>
  )
}

export function TextareaFieldInteractiveDemo() {
  const [val, setVal] = useState('Edit this example text.')
  const [rows, setRows] = useState(4)
  const [disabled, setDisabled] = useState(false)
  const [hasHelper, setHasHelper] = useState(true)
  const [hasError, setHasError] = useState(false)

  const reset = () => {
    setVal('Edit this example text.')
    setRows(4)
    setDisabled(false)
    setHasHelper(true)
    setHasError(false)
  }

  return (
    <InteractiveLayout
      reset={reset}
      controls={
        <>
          <ControlInput label="Content text" value={val} onChange={setVal} />
          <ControlRange label="Rows" value={rows} min={2} max={10} onChange={setRows} />
          <div className="pt-2 border-t border-third/60 space-y-2">
            <ControlToggle label="disabled" checked={disabled} onChange={setDisabled} />
            <ControlToggle label="inputHelper" checked={hasHelper} onChange={setHasHelper} />
            <ControlToggle label="errors (invalid state)" checked={hasError} onChange={setHasError} />
          </div>
        </>
      }
    >
      <div className="w-full max-w-md text-start">
        <TextareaField
          label="Description"
          inputHelper={hasHelper ? 'Enter a detailed description.' : undefined}
          errors={hasError ? [{ condition: true, helper: 'Description cannot be empty.' }] : undefined}
          properties={{
            value: val,
            onChange: (e) => setVal(e.target.value),
            rows,
            maxLength: 240,
            disabled,
          }}
        />
        <p className="mt-2 text-end text-xs text-body-2">{val.length} / 240</p>
      </div>
    </InteractiveLayout>
  )
}

export function SearchFieldInteractiveDemo() {
  const [query, setQuery] = useState('')
  const [disabled, setDisabled] = useState(false)
  const [hasHelper, setHasHelper] = useState(true)
  const [lastSubmitted, setLastSubmitted] = useState('')

  const reset = () => {
    setQuery('')
    setDisabled(false)
    setHasHelper(true)
    setLastSubmitted('')
  }

  return (
    <InteractiveLayout
      reset={reset}
      controls={
        <>
          <ControlInput label="Query text" value={query} onChange={setQuery} />
          <div className="pt-2 border-t border-third/60 space-y-2">
            <ControlToggle label="disabled" checked={disabled} onChange={setDisabled} />
            <ControlToggle label="inputHelper" checked={hasHelper} onChange={setHasHelper} />
          </div>
        </>
      }
    >
      <div className="w-full max-w-md text-start">
        <SearchField
          label="Search components"
          inputHelper={hasHelper ? 'Type query and press Enter.' : undefined}
          properties={{
            value: query,
            onChange: (e) => setQuery(e.target.value),
            onSearch: (q) => setLastSubmitted(q),
            disabled,
          }}
        />
        <p className="mt-3 text-xs text-body-2">
          Submitted query: <code className="font-mono text-primary font-semibold">{lastSubmitted || '(none)'}</code>
        </p>
      </div>
    </InteractiveLayout>
  )
}

export function NumberFieldInteractiveDemo() {
  const [val, setVal] = useState('1234.5')
  const [decimalsMax, setDecimalsMax] = useState(2)
  const [disabled, setDisabled] = useState(false)
  const [hasHelper, setHasHelper] = useState(true)

  const reset = () => {
    setVal('1234.5')
    setDecimalsMax(2)
    setDisabled(false)
    setHasHelper(true)
  }

  return (
    <InteractiveLayout
      reset={reset}
      controls={
        <>
          <ControlInput label="Number value" value={val} onChange={setVal} />
          <ControlRange label="decimalsMax" value={decimalsMax} min={0} max={6} onChange={setDecimalsMax} />
          <div className="pt-2 border-t border-third/60 space-y-2">
            <ControlToggle label="disabled" checked={disabled} onChange={setDisabled} />
            <ControlToggle label="inputHelper" checked={hasHelper} onChange={setHasHelper} />
          </div>
        </>
      }
    >
      <div className="w-full max-w-sm text-start">
        <NumberField
          label="Amount"
          decimalsMax={decimalsMax}
          inputHelper={hasHelper ? `Allows up to ${decimalsMax} decimal places.` : undefined}
          properties={{
            value: val,
            onChange: (e) => setVal(e.target.value),
            disabled,
          }}
        />
        <p className="mt-3 text-xs text-body-2">
          Numeric value: <code className="font-mono text-primary font-semibold">{val || '(empty)'}</code>
        </p>
      </div>
    </InteractiveLayout>
  )
}

export function PinFieldInteractiveDemo() {
  const [pin, setPin] = useState<string[]>([])
  const [length, setLength] = useState(6)
  const [disabled, setDisabled] = useState(false)

  const reset = () => {
    setPin([])
    setLength(6)
    setDisabled(false)
  }

  return (
    <InteractiveLayout
      reset={reset}
      controls={
        <>
          <ControlRange label="Pin Length" value={length} min={4} max={8} onChange={(l) => { setLength(l); setPin([]); }} />
          <div className="pt-2 border-t border-third/60 space-y-2">
            <ControlToggle label="disabled" checked={disabled} onChange={setDisabled} />
          </div>
        </>
      }
    >
      <div className="w-full max-w-md text-start">
        <PinField
          key={length}
          label="Verification code"
          length={length}
          disabled={disabled}
          properties={{ value: pin, onChange: setPin }}
        />
        <p className="mt-4 text-xs text-body-2">
          Code: <strong className="font-mono text-primary font-semibold">{pin.join('') || '(empty)'}</strong>
        </p>
      </div>
    </InteractiveLayout>
  )
}

export function DropdownInteractiveDemo() {
  const [position, setPosition] = useState<'BOTTOM_START' | 'BOTTOM_END' | 'TOP_START' | 'TOP_END'>('BOTTOM_START')
  const [variant, setVariant] = useState<'fill' | 'outline'>('outline')
  const [color, setColor] = useState<'primary' | 'info' | 'second'>('info')
  const [lastAction, setLastAction] = useState('none')

  const reset = () => {
    setPosition('BOTTOM_START')
    setVariant('outline')
    setColor('info')
    setLastAction('none')
  }

  return (
    <InteractiveLayout
      reset={reset}
      controls={
        <>
          <ControlSelect
            label="Position"
            value={position}
            onChange={setPosition}
            options={[
              { value: 'BOTTOM_START', label: 'BOTTOM_START' },
              { value: 'BOTTOM_END', label: 'BOTTOM_END' },
              { value: 'TOP_START', label: 'TOP_START' },
              { value: 'TOP_END', label: 'TOP_END' },
            ]}
          />
          <ControlSelect
            label="Trigger variant"
            value={variant}
            onChange={setVariant}
            options={[
              { value: 'outline', label: 'outline' },
              { value: 'fill', label: 'fill' },
            ]}
          />
          <ControlSelect
            label="Trigger color"
            value={color}
            onChange={setColor}
            options={[
              { value: 'info', label: 'info' },
              { value: 'primary', label: 'primary' },
              { value: 'second', label: 'second' },
            ]}
          />
        </>
      }
    >
      <div className="w-full max-w-sm flex flex-col items-center">
        <Dropdown
          trigger="More actions"
          staticPosition
          position={position}
          triggerProps={{ variant, color }}
        >
          {(close) => (
            <div className="grid min-w-44 gap-1 rounded-xl border border-third bg-second p-2 shadow-lg text-start">
              <button
                className="rounded-lg px-3 py-2 text-start text-xs hover:bg-main"
                onClick={() => {
                  setLastAction('Inspected component')
                  close()
                }}
              >
                Inspect component
              </button>
              <button
                className="rounded-lg px-3 py-2 text-start text-xs hover:bg-main"
                onClick={() => {
                  setLastAction('Copied example')
                  close()
                }}
              >
                Copy example
              </button>
            </div>
          )}
        </Dropdown>
        <p className="mt-4 text-xs text-body-2">
          Last action: <strong className="font-semibold text-title-1">{lastAction}</strong>
        </p>
      </div>
    </InteractiveLayout>
  )
}

export function DialogInteractiveDemo() {
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [usePortal, setUsePortal] = useState(false)

  const reset = () => {
    setOpen(false)
    setShow(false)
    setUsePortal(false)
  }

  return (
    <InteractiveLayout
      reset={reset}
      controls={
        <div className="space-y-2">
          <ControlToggle label="usePortal" checked={usePortal} onChange={setUsePortal} />
          <ControlToggle
            label="open state"
            checked={open}
            onChange={(checked) => {
              fade(checked ? 'in' : 'out', { open, setOpen, setShow })
            }}
          />
        </div>
      }
    >
      <div className="flex flex-col items-center gap-3">
        <Button
          color="info"
          onClick={() => fade('in', { open, setOpen, setShow })}
        >
          Open dialog preview
        </Button>
        <Dialog open={open} setOpen={setOpen} show={show} setShow={setShow} usePortal={usePortal}>
          <div className="max-w-md rounded-2xl border border-third bg-second p-6 shadow-xl text-start">
            <h3 className="text-lg font-semibold">Dialog preview</h3>
            <p className="mt-2 text-sm leading-6 text-body-2">
              Test dialog behavior, escape keys, and close buttons.
            </p>
            <Button
              className="mt-5"
              variant="outline"
              color="info"
              onClick={() => fade('out', { open, setOpen, setShow })}
            >
              Close dialog
            </Button>
          </div>
        </Dialog>
        <p className="text-xs text-body-2">
          Modal open: <strong className="font-mono text-primary font-semibold">{open ? 'true' : 'false'}</strong>
        </p>
      </div>
    </InteractiveLayout>
  )
}
