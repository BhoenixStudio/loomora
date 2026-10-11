'use client'

import { forwardRef, KeyboardEvent, ReactNode, useState } from 'react'
import {
  ConditionalWrapper,
  InputBase,
  InputErrorMessage,
  InputFieldset,
  InputHelper,
  InputHelperAndError,
  InputLabel,
  Label,
  LabelProps,
} from '../..'
import { useLoomora } from '../../../config'
import { cx, hasProps } from '../../../hooks'
import { GlobalElement } from '../../../types'

export interface RatingFieldProps extends InputBase, InputFieldset, InputLabel, InputHelperAndError {
  wrapper?: GlobalElement<'div'>
  properties?: {
    value?: number
    setValue?: (value: number) => void
    max?: number
    step?: 1 | 0.5
    allowClear?: boolean
    readOnly?: boolean
    disabled?: boolean
    required?: boolean
    name?: string
    className?: string
    activeClassName?: string
    icon?: ReactNode
    emptyIcon?: ReactNode
    iconSize?: number
    labels?: string[]
  }
}

function StarIcon({ size }: Readonly<{ size: number }>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96L12 2.5z" />
    </svg>
  )
}

export const RatingField = forwardRef<HTMLInputElement, RatingFieldProps>((props, ref) => {
  const { form } = useLoomora()

  const {
    size = [],
    properties,
    fieldset,
    fieldsetPrefix,
    fieldsetSuffix,
    wrapper,
    label = '',
    inputHelper,
    errors,
    loading = false,
    condition,
  } = props

  const {
    className: fieldsetClass = form?.fieldset?.className,
    attributes: fieldsetAttrs,
    ...restFieldset
  } = fieldset ?? {}
  const { className: wrapperClass, attributes: wrapperAttrs, ...restWrapper } = wrapper ?? {}
  const {
    value = 0,
    setValue,
    max = form?.ratingField?.max ?? 5,
    step = form?.ratingField?.step ?? 1,
    allowClear = form?.ratingField?.allowClear ?? true,
    readOnly,
    disabled,
    required,
    name,
    className = form?.ratingField?.className ?? 'text-body-3',
    activeClassName = form?.ratingField?.activeClassName ?? 'text-amber-400',
    icon = form?.ratingField?.icon,
    emptyIcon = form?.ratingField?.emptyIcon,
    iconSize = form?.ratingField?.iconSize ?? 24,
    labels,
  } = properties ?? {}

  const [hover, setHover] = useState<number | null>(null)

  const inactive = Boolean(disabled || readOnly || loading)
  const current = hover ?? value
  const count = Math.max(1, Math.floor(max))
  const clampValue = (n: number) => Math.min(Math.max(n, 0), count)

  const select = (n: number) => {
    if (inactive) return
    setValue?.(allowClear && n === value ? 0 : n)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (inactive) return
    const keys: Record<string, number> = {
      ArrowRight: value + step,
      ArrowUp: value + step,
      ArrowLeft: value - step,
      ArrowDown: value - step,
      Home: 0,
      End: count,
    }
    if (!(e.key in keys)) return
    e.preventDefault()
    setValue?.(clampValue(keys[e.key]))
  }

  let labelClass: string = '',
    restLabel: LabelProps = { children: '' }
  if (hasProps(label, 'children')) {
    const { className: lCN, ...restOfLabel } = label ?? {}
    labelClass = lCN ?? ''
    restLabel = restOfLabel
  }
  const labelClassName = cx(['flex-nowrap items-center px-3 py-1', labelClass])

  const valueLabel = labels?.[Math.ceil(current) - 1]

  if (condition === false) return null
  return (
    <fieldset
      className={cx(['flex flex-col w-full gap-3', ...(size ?? []), fieldsetClass])}
      {...fieldsetAttrs}
      {...restFieldset}
    >
      {fieldsetPrefix}

      <ConditionalWrapper childrenCondition={Boolean(label)}>
        {hasProps(label, 'children') ? (
          <Label className={labelClassName} {...{ required, ...restLabel }}>
            {label?.children}
          </Label>
        ) : (
          <Label className={labelClassName} {...{ required }}>
            {label}
          </Label>
        )}
      </ConditionalWrapper>

      <div
        className={cx([
          'rating-field flex items-center gap-3 select-none',
          { value: 'opacity-50 cursor-not-allowed', condition: Boolean(disabled || loading) },
          wrapperClass,
        ])}
        {...wrapperAttrs}
        {...restWrapper}
      >
        <div
          role="slider"
          tabIndex={inactive ? -1 : 0}
          aria-label={typeof label === 'string' && label ? label : 'Rating'}
          aria-valuemin={0}
          aria-valuemax={count}
          aria-valuenow={value}
          aria-valuetext={labels?.[Math.ceil(value) - 1] ?? `${value} of ${count}`}
          aria-readonly={readOnly}
          aria-disabled={disabled || loading}
          className={cx([
            'flex items-center gap-1 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary',
          ])}
          onKeyDown={onKeyDown}
          onMouseLeave={() => setHover(null)}
          onTouchEnd={() => setHover(null)}
          onTouchCancel={() => setHover(null)}
        >
          {Array.from({ length: count }, (_, i) => {
            const index = i + 1
            const fill = Math.min(Math.max(current - i, 0), 1)
            return (
              <span
                key={index}
                className={cx([
                  'relative inline-flex items-center justify-center transition-transform duration-150',
                  { value: 'cursor-pointer hover:scale-110', condition: !inactive },
                ])}
                style={{ width: iconSize, height: iconSize }}
              >
                <span
                  aria-hidden="true"
                  className={cx(['absolute inset-0 flex items-center justify-center pointer-events-none', className])}
                >
                  {emptyIcon ?? icon ?? <StarIcon size={iconSize} />}
                </span>
                <span
                  aria-hidden="true"
                  className={cx(['absolute inset-y-0 inset-s-0 overflow-hidden pointer-events-none', activeClassName])}
                  style={{ width: `${fill * 100}%` }}
                >
                  <span
                    className="flex items-center justify-center shrink-0"
                    style={{ width: iconSize, height: iconSize, minWidth: iconSize }}
                  >
                    {icon ?? <StarIcon size={iconSize} />}
                  </span>
                </span>
                {step === 0.5 && (
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-label={`${index - 0.5} of ${count}`}
                    disabled={inactive}
                    className="absolute inset-y-0 inset-s-0 z-10 w-1/2 cursor-pointer border-0 bg-transparent p-0 outline-none disabled:cursor-not-allowed"
                    onMouseEnter={() => !inactive && setHover(index - 0.5)}
                    onTouchStart={() => !inactive && setHover(index - 0.5)}
                    onClick={() => select(index - 0.5)}
                  />
                )}
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={`${index} of ${count}`}
                  disabled={inactive}
                  className={cx([
                    'absolute inset-y-0 inset-e-0 z-10 cursor-pointer border-0 bg-transparent p-0 outline-none disabled:cursor-not-allowed',
                    step === 0.5 ? 'w-1/2' : 'w-full',
                  ])}
                  onMouseEnter={() => !inactive && setHover(index)}
                  onTouchStart={() => !inactive && setHover(index)}
                  onClick={() => select(index)}
                />
              </span>
            )
          })}
        </div>
        {valueLabel && <span className="text-xs font-medium text-body-2">{valueLabel}</span>}
        <input ref={ref} type="hidden" name={name} value={value} />
      </div>

      {fieldsetSuffix}

      <ConditionalWrapper childrenCondition={Boolean(inputHelper)}>
        {hasProps(inputHelper, 'children') ? (
          <InputHelper {...inputHelper} />
        ) : (
          <InputHelper>{inputHelper}</InputHelper>
        )}
      </ConditionalWrapper>

      <InputErrorMessage {...{ errors }} />
    </fieldset>
  )
})

RatingField.displayName = 'RatingField'
