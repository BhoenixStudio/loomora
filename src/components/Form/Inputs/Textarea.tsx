'use client'

import { forwardRef, TextareaHTMLAttributes, useEffect, useState } from 'react'
import { useLoomoraConfig } from '../../../config'
import { cn, isThisProps } from '../../../hooks'
import { GlobalElementEssentials } from '../../../types'
import { ConditionalWrapper } from '../../Helper'
import { InputBase, InputFieldset, InputFocus, InputHelperAndError, InputLabel } from '../helper'
import { InputHelper } from '../Modules/Helper'
import { Label, LabelProps } from '../Modules/Label'

type InputProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export interface TextareaProps extends InputBase, InputFieldset, InputLabel, InputHelperAndError {
  wrapper?: GlobalElementEssentials<'div'>
  active?: boolean
  properties?: InputProps
}

export const TextField = forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
  const {
    size = [],
    properties,
    fieldset,
    fieldsetPrefix,
    fieldsetSuffix,
    wrapper,
    label = '',
    inputHelper,
    error = false,
    errorHelper,
    active: forceActive = false,
    loading = false,
    condition,
  } = props

  const { form } = useLoomoraConfig()

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
    className = form?.textarea?.className,
    required,
    disabled,
    rows = form?.textarea?.defaultRows,
    ...restProperties
  } = properties ?? {}

  // States
  const [active, setActive] = useState<boolean>(false)

  // Configs
  const isActive: boolean = forceActive || active

  let labelClass: string = '',
    restLabel: LabelProps = { children: '' }
  if (isThisProps(label, 'children')) {
    const { className: lCN, ...restOfLabel } = label ?? {}
    labelClass = lCN ?? ''
    restLabel = restOfLabel
  }

  const labelClassName = cn([
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
      className={cn(['flex flex-col flex-nowrap relative', ...size, fieldsetClass])}
      {...fieldsetAttrs}
      {...restFieldset}
    >
      {fieldsetPrefix}

      <div
        className={cn([
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
          {isThisProps(label, 'children') ? (
            <Label className={labelClassName} {...{ required, ...restLabel }} />
          ) : (
            <Label className={labelClassName} {...{ required }}>
              {label}
            </Label>
          )}
        </ConditionalWrapper>

        <textarea
          ref={ref}
          className={cn([
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
