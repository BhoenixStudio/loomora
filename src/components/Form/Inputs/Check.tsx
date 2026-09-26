'use client'

import { ElementType, InputHTMLAttributes, ReactNode, useRef } from 'react'
import { cn, isThisProps } from '../../../hooks'
import { InputBase, InputFieldset, InputHelperAndError, InputLabel } from '../helper'
import { useLoomoraConfig } from '../../../config'
import { Label, LabelProps } from '../Modules/Label'
import { ConditionalWrapper } from '../../Helper'
import { InputHelper } from '../Modules/Helper'

export type CheckFieldType = 'checkbox' | 'radio' | 'switch'

export interface CheckFieldProps
  extends InputBase, Omit<InputFieldset, 'fieldsetPrefix' | 'fieldsetSuffix'>, InputLabel, InputHelperAndError {
  color?: `text-${string}` | `text-${string}/${number}`
  activeColor?: `text-${string}` | `text-${string}/${number}`
  properties?: Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value'> & { type?: CheckFieldType }
}

function CheckIcon() {
  return (
    <svg
      width="0.85em"
      height="0.85em"
      viewBox="0 0 28 28"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
    >
      <path d="M4 14l8 7L24 7" strokeDashoffset={31} strokeDasharray="30 31"></path>
    </svg>
  )
}

export function CheckField(props: Readonly<CheckFieldProps>) {
  const { form } = useLoomoraConfig()

  const {
    size = [],
    properties,
    fieldset,
    label,
    inputHelper,
    error = false,
    errorHelper,
    color = form?.check?.color,
    activeColor = form?.check?.activeColor,
    loading = false,
    condition,
  } = props

  const { className: fieldsetClass = 'gap-3', attributes: fieldsetAttrs, ...restFieldset } = fieldset ?? {}
  const { type = 'checkbox', checked, required, disabled, className, ...inputProps } = properties ?? {}

  const inputRef = useRef<HTMLInputElement>(null)

  // Configs
  let labelClass: string = '',
    restLabel: LabelProps = { children: '' }
  if (isThisProps(label, 'children')) {
    const { className: lCN, ...restOfLabel } = label ?? {}
    labelClass = lCN ?? ''
    restLabel = restOfLabel
  }
  const { attributes: labelAttrs, ...restLabelRest } = restLabel ?? {}
  const { onClick, ...restAttributes } = labelAttrs ?? {}

  const labelClassName = cn([
    'flex-nowrap items-center',
    { value: 'cursor-not-allowed', fallback: 'cursor-pointer', condition: disabled || loading },
    labelClass,
  ])

  const Comp: ElementType = 'span'
  const types: Record<CheckFieldType, ReactNode> = {
    checkbox: (
      <Comp
        className={cn([
          'flex relative border items-center justify-center rounded',
          'w-(--checkbox-size) h-(--checkbox-size) shadow-[0_0_0_0_--theme(--color-primary/15)]',
          'after:content-[""] after:absolute after:top-[calc(var(--checkbox-size)/2)] after:left-[calc(var(--checkbox-size)/2)] after:w-[calc(var(--checkbox-size)/4)] after:h-[calc(var(--checkbox-size)/4)]',
          'after:-translate-x-1/2 after:-translate-y-1/2 after:opacity-0 after:rounded-[inherit]',
          'transition-[stroke-dashoffset] duration-[calc(var(--checkbox-speed)/2)] ease-in',
          { value: 'cursor-not-allowed', fallback: 'cursor-pointer', condition: disabled || loading },
          'border-current after:bg-[color-mix(in_oklab,currentColor_15%,transparent)]',
          { value: activeColor, fallback: color, condition: Boolean(checked) },
          {
            value: [
              'after:animate-[checkbox-ripple_calc(var(--checkbox-speed)*3)_cubic-bezier(0.11,0.29,0.18,0.98)]',
              '[&>svg_path]:transition-[stroke-dashoffset]',
              '[&>svg_path]:duration-(--checkbox-speed)',
              '[&>svg_path]:ease-[cubic-bezier(0.11,0.29,0.18,0.98)]',
              '[&>svg_path]:[stroke-dashoffset:0]',
            ],
            condition: Boolean(checked),
          },
        ])}
        onClick={() => fireInput()}
      >
        <CheckIcon />
      </Comp>
    ),
    radio: (
      <Comp
        className={cn([
          'flex relative border items-center justify-center rounded-full',
          'w-(--checkbox-size) h-(--checkbox-size) shadow-[0_0_0_0_--theme(--color-primary/15)]',
          'after:content-[""] after:absolute after:top-[calc(var(--checkbox-size)/2)] after:left-[calc(var(--checkbox-size)/2)] after:w-[calc(var(--checkbox-size)/4)] after:h-[calc(var(--checkbox-size)/4)]',
          'after:-translate-x-1/2 after:-translate-y-1/2 after:bg-primary/15 after:opacity-0 after:rounded-[inherit]',
          'transition-[stroke-dashoffset] duration-[calc(var(--checkbox-speed)/2)] ease-in',
          { value: 'cursor-not-allowed', fallback: 'cursor-pointer', condition: disabled || loading },
          'border-current after:bg-[color-mix(in_oklab,currentColor_15%,transparent)]',
          { value: activeColor, fallback: color, condition: Boolean(checked) },
          {
            value: [
              'after:animate-[checkbox-ripple_calc(var(--checkbox-speed)*3)_cubic-bezier(0.11,0.29,0.18,0.98)]',
              '[&>svg_path]:transition-[stroke-dashoffset]',
              '[&>svg_path]:duration-(--checkbox-speed)',
              '[&>svg_path]:ease-[cubic-bezier(0.11,0.29,0.18,0.98)]',
              '[&>svg_path]:[stroke-dashoffset:0]',
            ],
            condition: Boolean(checked),
          },
        ])}
        onClick={() => fireInput()}
      >
        <CheckIcon />
      </Comp>
    ),
    switch: (
      <Comp
        className={cn([
          'flex',
          { value: 'cursor-not-allowed', fallback: 'cursor-pointer', condition: disabled || loading },
        ])}
        onClick={() => fireInput()}
      >
        <span
          className={cn([
            'border-2 rounded-full items-center h-(--switch-size) w-[calc(var(--switch-size)*2)] bg-second',
            'shadow-[inset_0_0_calc(var(--switch-size)/2)_0_rgba(0,0,0,0.25)] overflow-hidden transition-all duration-(--switch-speed) p-(--switch-padding)',
            'before:content-[""] before:block before:h-full before:aspect-square before:rounded-[inherit] before:shadow-[0_0_calc(var(--switch-size)/2)_calc(var(--switch-size)/10)_rgba(0,0,0,0.25)] before:transition-[width] before:duration-(--switch-speed) before:ease-linear',
            'border-current before:bg-current',
            { value: activeColor, fallback: color, condition: Boolean(checked) },
            {
              value: 'before:ms-auto before:animate-[switch-slider_var(--switch-speed)_linear_forwards]',
              fallback: 'before:animate-[switch-slider-reverse_var(--switch-speed)_linear_forwards]',
              condition: Boolean(checked),
            },
          ])}
        />
      </Comp>
    ),
  }
  const component = types[type ?? 'checkbox'] ?? types.checkbox

  const labelComponent = (
    <ConditionalWrapper childrenCondition={Boolean(label)}>
      {isThisProps(label, 'children') ? (
        <Label
          className={labelClassName}
          attributes={{
            onClick: (e) => {
              onClick?.(e)
              fireInput()
            },
            ...restAttributes,
          }}
          {...{ required, ...restLabelRest }}
        />
      ) : (
        <Label className={labelClassName} {...{ required }}>
          {label}
        </Label>
      )}
    </ConditionalWrapper>
  )

  let content: ReactNode = labelComponent
  if ((inputHelper || errorHelper) && label)
    content = (
      <div className="flex flex-col flex-nowrap">
        {labelComponent}
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
      </div>
    )

  // Functions
  function fireInput() {
    if (!inputRef?.current || loading || disabled) return
    inputRef.current.click()
  }

  if (condition === false) return null
  return (
    <fieldset
      className={cn([
        'check-input inline-flex flex-nowrap relative',
        'transition-all duration-(--switch-speed) ease-in-out',
        { value: 'opacity-70', condition: disabled || loading },
        ...size,
        fieldsetClass,
      ])}
      {...fieldsetAttrs}
      {...restFieldset}
    >
      <input
        ref={inputRef}
        type={type === 'switch' ? 'checkbox' : type}
        className={cn(['absolute w-0 border-none online-none invisible overflow-hidden', className])}
        disabled={disabled || loading}
        {...{ checked, required, ...inputProps }}
      />
      {component}
      {content}
    </fieldset>
  )
}
