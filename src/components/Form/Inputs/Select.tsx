'use client'

import {
  forwardRef,
  Fragment,
  OptgroupHTMLAttributes,
  OptionHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  useEffect,
  useState,
} from 'react'
import { useLoomoraConfig } from '../../../config'
import { cn, isThisProps } from '../../../hooks'
import { GlobalElementEssentials } from '../../../types'
import { ConditionalWrapper } from '../../Helper'
import { Button, ButtonBaseProps } from '../../UI'
import { InputBase, InputFieldset, InputFocus, InputHelperAndError, InputLabel } from '../helper'
import { InputHelper } from '../Modules/Helper'
import { Label, LabelProps } from '../Modules/Label'

export type OptionItem = { isGroup?: false } & OptionHTMLAttributes<HTMLOptionElement>
export type OptionGroupItem = { isGroup: true } & OptgroupHTMLAttributes<HTMLOptGroupElement>
export type SelectOption = { label?: ReactNode } & (OptionItem | OptionGroupItem)

export interface SelectProps extends InputBase, InputFieldset, InputLabel, InputHelperAndError {
  wrapper?: GlobalElementEssentials<'div'>
  prefix?: ReactNode
  suffix?: ReactNode
  active?: boolean
  properties?: SelectHTMLAttributes<HTMLSelectElement>
  options: SelectOption[]
  showTrigger?: boolean
  trigger?: ReactNode | (Pick<ButtonBaseProps, 'variant' | 'color' | 'corner'> & { icon: ReactNode })
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
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
    active: forceActive = false,
    options = [],
    showTrigger = true,
    trigger = form?.select?.triggerIcon,
    loading = false,
    condition,
  } = props

  const {
    className: fieldsetClass = form?.fieldset?.className,
    attributes: fieldsetAttrs,
    ...restFieldset
  } = fieldset ?? {}
  const { className: wrapperClass, attributes: wrapperAttrs, ...restWrapper } = wrapper ?? {}
  const { value = '', onFocus, onBlur, className = 'text-sm', required, disabled, ...selectProps } = properties ?? {}

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

  let restTrigger: Pick<ButtonBaseProps, 'variant' | 'color' | 'corner'> & { icon: ReactNode } = {
    icon: form?.select?.triggerIcon,
    color: 'second',
    corner: 'small',
    variant: 'text',
  }
  if (isThisProps(trigger, 'icon')) {
    const {
      color: tColor = 'second',
      corner: tCorner = 'small',
      variant: tVariant = 'text',
      ...triggerRest
    } = trigger ?? {}
    restTrigger = { color: tColor, corner: tCorner, variant: tVariant, ...triggerRest }
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
          'flex flex-nowrap items-center',
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
          wrapperClass,
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

        {prefix}
        <select
          ref={ref}
          className={cn([
            'flex-1 bg-transparent outline-none disabled:cursor-not-allowed py-3',
            { value: 'ps-2', fallback: 'ps-3', condition: Boolean(prefix) },
            { value: 'pe-2', fallback: 'pe-3', condition: Boolean(suffix) },
            'transition-all duration-300 ease-in-out',
            'relative cursor-pointer peer',
            className,
          ])}
          disabled={disabled || loading}
          {...InputFocus<HTMLSelectElement>(setActive, { onFocus, onBlur }, Boolean(value))}
          {...{ value, required, ...selectProps }}
        >
          {options?.map(({ isGroup, ...option }, i: number) => {
            const { label, value, className = form?.select?.optionClassName, ...op } = option as OptionItem
            const {
              label: gLabel,
              children,
              className: gClass = form?.select?.optionGroupClassName,
              ...gOp
            } = option as OptionGroupItem

            let element: ReactNode = <option {...{ value, className, ...op }}>{label}</option>
            if (isGroup)
              element = (
                <optgroup label={gLabel} className={gClass} {...gOp}>
                  {children}
                </optgroup>
              )

            return <Fragment key={i}>{element}</Fragment>
          })}
        </select>

        {showTrigger && (
          <Button
            type="button"
            {...restTrigger}
            className="absolute top-1/2 end-3 -translate-y-1/2 pointer-events-none transition-all duration-150 ease-in-out peer-focus:rotate-180"
          >
            {restTrigger?.icon}
          </Button>
        )}
        {suffix}
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
