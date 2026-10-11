'use client'

import { forwardRef, TextareaHTMLAttributes, useEffect, useState } from 'react'
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
} from '../..'
import { useLoomora } from '../../../config'
import { cx, hasProps } from '../../../hooks'
import { GlobalElement } from '../../../types'
import { ConditionalWrapper } from '../../Helper'

type InputProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export interface TextareaFieldProps extends InputBase, InputFieldset, InputLabel, InputHelperAndError {
  wrapper?: GlobalElement<'div'>
  active?: boolean
  properties?: InputProps
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>((props, ref) => {
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
    active: forceActive = false,
    loading = false,
    condition,
  } = props

  const error = hasError(errors)

  const { form } = useLoomora()

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
    className = form?.textareaField?.className,
    required,
    disabled,
    rows = form?.textareaField?.defaultRows,
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

        <textarea
          ref={ref}
          className={cx([
            'flex-1 bg-transparent outline-none disabled:cursor-not-allowed py-3',
            'transition-all duration-300 ease-in-out',
            { value: 'placeholder:opacity-70', fallback: 'placeholder:opacity-0', condition: isActive || !label },
            className,
          ])}
          disabled={disabled || loading}
          {...InputFocus<HTMLTextAreaElement>(setActive, { onFocus, onBlur }, Boolean(value))}
          {...{ value, required, rows, ...restProperties }}
        />
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
