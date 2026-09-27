'use client'

import { ClipboardEvent, Dispatch, InputHTMLAttributes, KeyboardEvent, SetStateAction, useEffect, useRef } from 'react'
import { useLoomoraConfig } from '../../../config'
import { cn, isThisProps } from '../../../hooks'
import { GlobalElementEssentials } from '../../../types'
import { ConditionalWrapper } from '../../Helper'
import { InputBase, InputFieldset, InputHelperAndError, InputLabel } from '../helper'
import { InputHelper } from '../Modules/Helper'
import { Label, LabelProps } from '../Modules/Label'

export interface OtpFieldProps extends InputBase, Pick<InputFieldset, 'fieldset'>, InputLabel, InputHelperAndError {
  wrapper?: GlobalElementEssentials<'div'>
  length?: number
  properties?: Pick<
    InputHTMLAttributes<HTMLInputElement>,
    'name' | 'className' | 'required' | 'disabled' | 'autoFocus'
  > & { value?: string[]; onChange?: Dispatch<SetStateAction<string[]>> }
}

export function OtpField(props: Readonly<OtpFieldProps>) {
  const { form } = useLoomoraConfig()

  const {
    size = [],
    properties,
    condition,
    fieldset,
    wrapper,
    label,
    inputHelper,
    error = false,
    errorHelper,
    loading = false,
    length = form?.otp?.length ?? 6,
  } = props

  const { className: fieldsetClass, attributes: fieldsetAttrs, ...restFieldset } = fieldset ?? {}
  const { className: wrapperClass, attributes: wrapperAttrs, ...restWrapper } = wrapper ?? {}
  const { value = [], onChange, required, disabled, className, autoFocus = true } = properties ?? {}

  // Refs
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Configs
  const otp = value.length === length ? value : new Array<string>(length).fill('')

  let labelClass: string = '',
    restLabel: LabelProps = { children: '' }
  if (isThisProps(label, 'children')) {
    const { className: lCN, ...restOfLabel } = label ?? {}
    labelClass = lCN ?? ''
    restLabel = restOfLabel
  }

  const labelClassName = cn([form?.label?.stateSharedClassName, labelClass])

  // Functions
  function handleChange(index: number, inputValue: string) {
    if (!/^\d*$/.test(inputValue)) return
    const next = [...otp]
    next[index] = inputValue.slice(-1)
    onChange?.(next)
    if (inputValue && index < length - 1) inputRefs.current[index + 1]?.focus()
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus()
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    const next = [...otp]
    pasted.split('').forEach((char, i) => {
      next[i] = char
    })
    onChange?.(next)
    const focusIndex = Math.min(pasted.length, length - 1)
    inputRefs.current[focusIndex]?.focus()
  }

  useEffect(() => {
    if (autoFocus) inputRefs.current[0]?.focus()
  }, [autoFocus])

  if (condition === false) return null
  return (
    <fieldset
      className={cn(['flex flex-col flex-nowrap', ...size, fieldsetClass])}
      {...fieldsetAttrs}
      {...restFieldset}
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

      <div
        className={cn(['flex flex-1 gap-3 w-full flex-wrap justify-center', wrapperClass])}
        {...{ ...wrapperAttrs, dir: 'ltr', ...restWrapper }}
      >
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={disabled || loading}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className={cn([
              { value: 'w-13 h-13', fallback: 'w-15 h-15', condition: length > 6 },
              'border bg-second outline-none transition-colors aspect-square',
              { value: 'cursor-not-allowed opacity-60', condition: disabled || loading },
              { value: 'border-error/70', fallback: 'border-third', condition: error },
              'focus:border-primary',
              className,
            ])}
          />
        ))}
      </div>

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
}
