'use client'

import { forwardRef, InputHTMLAttributes, ReactNode, useEffect, useState } from 'react'
import {
  hasError,
  InputBase,
  InputErrorMessage,
  InputFieldset,
  InputFocus,
  InputHelper,
  InputHelperAndError,
  InputLabel,
  Label,
  LabelProps,
} from '../../'
import { useLoomora } from '../../../config'
import { cx, hasProps } from '../../../hooks'
import { GlobalElement } from '../../../types'
import { ConditionalWrapper } from '../../Helper'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export interface TextFieldProps extends InputBase, InputFieldset, InputLabel, InputHelperAndError {
  wrapper?: GlobalElement<'div'>
  prefix?: ReactNode
  suffix?: ReactNode
  active?: boolean
  properties?: Omit<InputProps, 'type'> & { type?: Exclude<InputProps['type'], 'file' | 'image'> }
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
  const { form } = useLoomora()

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
    errors,
    active: forceActive = false,
    loading = false,
    condition,
  } = props

  const error = hasError(errors)

  const {
    className: fieldsetClass = form?.fieldset?.className,
    attributes: fieldsetAttrs,
    ...restFieldset
  } = fieldset ?? {}
  const { className: wrapperClass, attributes: wrapperAttrs, ...restWrapper } = wrapper ?? {}

  const {
    value = '',
    onFocus,
    onBlur,
    className = form?.textfield?.className,
    required,
    disabled,
    ...restProperties
  } = properties ?? {}

  // States
  const [active, setActive] = useState<boolean>(false)

  // Configs
  const isActive: boolean = forceActive || active

  let labelClass: string = '',
    restLabel: LabelProps = { children: '' }
  if (hasProps(label, 'children')) {
    const { className: lCN, ...restOfLabel } = label ?? {}
    labelClass = lCN ?? ''
    restLabel = restOfLabel
  }

  const labelClassName = cx([
    form?.label?.stateSharedClassName,
    {
      value: form?.label?.activeClassName,
      fallback: form?.label?.inactiveClassName,
      condition: isActive,
    },
    labelClass,
  ])

  useEffect(() => setActive(Boolean(value)), [value])

  if (condition === false) return null
  return (
    <fieldset
      className={cx(['flex flex-col flex-nowrap relative', ...size, fieldsetClass])}
      {...fieldsetAttrs}
      {...restFieldset}
    >
      {fieldsetPrefix}

      <div
        className={cx([
          'flex flex-nowrap items-center relative',
          {
            value: wrapperClass,
            fallback: [
              'border bg-inherit rounded gap-2',
              { value: 'ps-3', condition: Boolean(prefix) },
              { value: 'pe-3', condition: Boolean(suffix) },
              { value: 'border-error/70', fallback: 'border-body-3/40', condition: error },
            ],
            condition: Boolean(wrapperClass),
          },
        ])}
        {...wrapperAttrs}
        {...restWrapper}
      >
        <ConditionalWrapper childrenCondition={Boolean(label)}>
          {hasProps(label, 'children') ? (
            <Label className={labelClassName} {...{ required, ...restLabel }} />
          ) : (
            <Label className={labelClassName} {...{ required }}>
              {label}
            </Label>
          )}
        </ConditionalWrapper>

        {prefix}
        <input
          ref={ref}
          className={cx([
            'flex-1 bg-transparent outline-none disabled:cursor-not-allowed py-3',
            { value: 'ps-2', fallback: 'ps-3', condition: Boolean(prefix) },
            { value: 'pe-2', fallback: 'pe-3', condition: Boolean(suffix) },
            'transition-all duration-300 ease-in-out',
            {
              value: 'placeholder:opacity-70',
              fallback: 'placeholder:opacity-0',
              condition: isActive || !label,
            },
            className,
          ])}
          disabled={disabled || loading}
          {...InputFocus<HTMLInputElement>(setActive, { onFocus, onBlur }, Boolean(value))}
          {...{ value, required, ...restProperties }}
        />
        {suffix}
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
