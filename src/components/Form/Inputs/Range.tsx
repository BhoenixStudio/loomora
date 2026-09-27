'use client'

import { forwardRef, InputHTMLAttributes, ReactNode, useMemo } from 'react'
import { useLoomoraConfig } from '../../../config'
import { cn, isThisProps } from '../../../hooks'
import { GlobalElementEssentials } from '../../../types'
import { ConditionalWrapper } from '../../Helper'
import { InputBase, InputFieldset, InputHelperAndError, InputLabel } from '../helper'
import { InputHelper } from '../Modules/Helper'
import { Label, LabelProps } from '../Modules/Label'

export type RangeMark = number | { value: number; label?: string }
type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'defaultValue' | 'min' | 'max' | 'step'
> & {
  defaultValue?: number
  value: number
  setValue: (value: number) => void
  min: number
  max: number
  step?: number
  showValue?: boolean
  showMinMax?: boolean
  valuePrefix?: ReactNode
  valueSuffix?: ReactNode
  marks?: RangeMark[]
  formatValue?: (value: number) => ReactNode
}

export interface RangeFieldProps extends InputBase, InputFieldset, InputLabel, InputHelperAndError {
  wrapper?: GlobalElementEssentials<'div'>
  prefix?: ReactNode | ReactNode[]
  suffix?: ReactNode | ReactNode[]
  properties?: InputProps
}

export const RangeField = forwardRef<HTMLInputElement, RangeFieldProps>((props, ref) => {
  const { form } = useLoomoraConfig()

  const {
    size = [],
    properties,
    fieldset,
    fieldsetPrefix,
    fieldsetSuffix,
    wrapper,
    label = '',
    prefix,
    suffix,
    inputHelper,
    error = false,
    errorHelper,
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
    defaultValue = 0,
    value = 0,
    setValue,
    min = 0,
    max = 0,
    step = form?.range?.step ?? 1,
    showValue = form?.range?.showValue,
    showMinMax = form?.range?.showMinMax,
    valuePrefix = form?.range?.valuePrefix,
    valueSuffix = form?.range?.valueSuffix,
    marks = [],
    formatValue,
    className = form?.range?.className,
    required,
    disabled,
    ...inputProps
  } = properties ?? {}

  const nValue = value ?? defaultValue ?? min
  const clamped = Math.min(Math.max(nValue ?? min, min), max)
  const percent = max > min ? ((clamped - min) / (max - min)) * 100 : 0

  const formattedValue = useMemo(() => {
    if (formatValue) return formatValue(clamped)
    const v = step >= 1 ? Math.round(clamped) : Number(clamped.toFixed(2))
    return `${valuePrefix}${v}${valueSuffix}`
  }, [clamped, step, valuePrefix, valueSuffix, formatValue])

  const markList = useMemo(() => {
    if (!marks) return []
    return marks.map((m) => (typeof m === 'number' ? { value: m, label: undefined } : m))
  }, [marks])

  let labelClass: string = '',
    restLabel: LabelProps = { children: '' }
  if (isThisProps(label, 'children')) {
    const { className: lCN, ...restOfLabel } = label ?? {}
    labelClass = lCN ?? ''
    restLabel = restOfLabel
  }

  const labelClassName = cn([form?.label?.stateSharedClassName, labelClass])
  const labelValue = showValue && (
    <span
      className={cn([
        'rounded-md text-center text-xs font-semibold tabular-nums ms-auto',
        'bg-primary/10 text-primary px-2 py-0.5',
      ])}
    >
      {formattedValue}
    </span>
  )

  if (condition === false) return null
  return (
    <fieldset
      className={cn(['flex flex-col w-full gap-3', ...(size ?? []), fieldsetClass])}
      {...fieldsetAttrs}
      {...restFieldset}
    >
      {fieldsetPrefix}

      <ConditionalWrapper childrenCondition={Boolean(label)}>
        {isThisProps(label, 'children') ? (
          <Label className={labelClassName} {...{ required, ...restLabel }}>
            {label?.children}
            {labelValue}
          </Label>
        ) : (
          <Label className={labelClassName} {...{ required }}>
            {label}
            {labelValue}
          </Label>
        )}
      </ConditionalWrapper>

      <div
        className={cn([
          'group range-field relative flex w-full flex-nowrap items-center select-none',
          { value: 'opacity-50 cursor-not-allowed pointer-events-none', condition: Boolean(disabled) },
          wrapperClass,
        ])}
        {...wrapperAttrs}
        {...restWrapper}
      >
        <div className="range-field__track relative h-2 w-full overflow-hidden rounded-full bg-third">
          <div
            className="range-field__fill absolute inset-y-0 inset-s-0 rounded-full bg-primary transition-all duration-150 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>

        {prefix}
        <input
          ref={ref}
          type="range"
          className={cn([
            'range-field__input absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none bg-transparent',
            'outline-none disabled:cursor-not-allowed m-0 p-0',
            'transition-all duration-300 ease-in-out',
            className,
          ])}
          disabled={disabled || loading}
          {...{ value, required, min, max, step, ...inputProps }}
        />
        {suffix}

        {markList.length > 0 && (
          <div className="absolute inset-x-0 top-full mb-2 h-5">
            {markList.map((m) => {
              const p = max > min ? ((m.value - min) / (max - min)) * 100 : 0
              const isActive = clamped === m.value
              return (
                <button
                  key={m.value}
                  type="button"
                  className={cn([
                    'flex absolute -bottom-1 -translate-x-1/2',
                    'text-[10px] leading-none font-medium tabular-nums whitespace-nowrap cursor-pointer',
                    'px-1.5 py-0.5 rounded-md transition-all duration-150 ease-out',
                    {
                      value: 'text-primary bg-primary/10 scale-110',
                      fallback: 'text-body-3 bg-main/60 backdrop-blur-sm',
                      condition: isActive,
                    },
                  ])}
                  onClick={() => setValue?.(m.value)}
                  style={{ insetInlineStart: `${p}%` }}
                >
                  {m.label ?? m.value}
                </button>
              )
            })}
          </div>
        )}

        <div
          className="range-field__thumb pointer-events-none absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ insetInlineStart: `${percent}%` }}
        >
          <span
            className={cn([
              'block h-5 w-5 rounded-full border-2 border-second bg-primary',
              'shadow-[0_2px_8px_-2px] shadow-primary/40',
              'transition-transform duration-150 ease-out',
              'group-hover:scale-110 group-active:scale-125',
            ])}
          />
        </div>
      </div>

      {showMinMax && (
        <div className="flex items-center justify-between text-[10px] font-medium text-body-3">
          <span className="tabular-nums">
            {valuePrefix}
            {min}
            {valueSuffix}
          </span>
          <span className="tabular-nums">
            {valuePrefix}
            {max}
            {valueSuffix}
          </span>
        </div>
      )}

      {fieldsetSuffix}

      <ConditionalWrapper childrenCondition={Boolean(inputHelper)}>
        {isThisProps(inputHelper, 'children') ? (
          <InputHelper {...inputHelper} />
        ) : (
          <InputHelper>{inputHelper}</InputHelper>
        )}
      </ConditionalWrapper>

      <ConditionalWrapper childrenCondition={Boolean(errorHelper) && error}>
        {isThisProps(errorHelper, 'children') ? (
          <InputHelper {...errorHelper} asError />
        ) : (
          <InputHelper asError>{errorHelper}</InputHelper>
        )}
      </ConditionalWrapper>
    </fieldset>
  )
})
