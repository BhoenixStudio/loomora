'use client'

import { ChangeEvent, FocusEvent, InputHTMLAttributes, KeyboardEvent, SyntheticEvent, useEffect, useState } from 'react'
import { TextField, TextFieldProps, UseDigit, UseDigitProps } from '../../'
import { useLoomora } from '../../../config'

type properties = InputHTMLAttributes<HTMLInputElement>
type NumberEventKey = 'onChange' | 'onBlur' | 'onKeyDown' | 'onKeyUp'
type NumberTarget = Omit<HTMLInputElement, 'value'> & { value: number | undefined }
type NumberEvent = { target: NumberTarget; currentTarget: NumberTarget }

export interface NumberFieldProps
  extends
    Omit<TextFieldProps, 'properties'>,
    Pick<UseDigitProps, 'decimalSeparator' | 'decimalsMax' | 'decimalsMin' | 'thousandSeparator'> {
  properties?: Omit<properties, 'type' | 'value' | NumberEventKey> & {
    value?: number | null
    onChange?: (e: Omit<ChangeEvent<HTMLInputElement>, 'target' | 'currentTarget'> & NumberEvent) => void
    onBlur?: (e: Omit<FocusEvent<HTMLInputElement>, 'target' | 'currentTarget'> & NumberEvent) => void
    onKeyDown?: (e: Omit<KeyboardEvent<HTMLInputElement>, 'target' | 'currentTarget'> & NumberEvent) => void
    onKeyUp?: (e: Omit<KeyboardEvent<HTMLInputElement>, 'target' | 'currentTarget'> & NumberEvent) => void
  }
  allowNegative?: boolean
  allowTelSymbols?: boolean
}

function wrapElement(element: HTMLInputElement, value: number | undefined): NumberTarget {
  return new Proxy(element, {
    get(target, prop) {
      if (prop === 'value') return value
      const member = Reflect.get(target, prop, target)
      return typeof member === 'function' ? member.bind(target) : member
    },
  }) as unknown as NumberTarget
}

function wrapEvent<E extends SyntheticEvent<HTMLInputElement>>(
  event: E,
  value: number | undefined
): Omit<E, 'target' | 'currentTarget'> & NumberEvent {
  const target = wrapElement(event.target as HTMLInputElement, value)
  const currentTarget = wrapElement(event.currentTarget, value)

  return new Proxy(event, {
    get(source, prop) {
      if (prop === 'target') return target
      if (prop === 'currentTarget') return currentTarget
      const member = Reflect.get(source, prop, source)
      return typeof member === 'function' ? member.bind(source) : member
    },
  }) as unknown as Omit<E, 'target' | 'currentTarget'> & NumberEvent
}

export function NumberField(props: Readonly<NumberFieldProps>) {
  const { form } = useLoomora()

  const {
    allowTelSymbols = form?.numberField?.allowTelSymbols ?? false,
    decimalSeparator = form?.numberField?.decimalSeparator ?? '.',
    decimalsMax = form?.numberField?.decimalsMax ?? 3,
    decimalsMin = form?.numberField?.decimalsMin ?? 0,
    thousandSeparator = form?.numberField?.thousandSeparator ?? ',',
    properties,
    ...inputRest
  } = props

  const { value, onChange, onBlur, onKeyDown, onKeyUp, ...restProperties } = properties ?? {}

  // States
  const [text, setText] = useState<string>(() => format(value))

  // Functions
  function format(n: number | null | undefined): string {
    if (n === null || n === undefined || Number.isNaN(n)) return ''
    if (allowTelSymbols) return String(n)
    return UseDigit(n, { decimalSeparator, decimalsMax, decimalsMin, thousandSeparator, fallback: '' })
  }
  function sanitize(text: string): string {
    if (allowTelSymbols) return text.replace(/[^0-9+\-()\s]/g, '')

    const negative = text.trimStart().startsWith('-')
    let integer = ''
    let decimals = ''
    let hasSeparator = false

    for (const char of text) {
      if (/\d/.test(char)) {
        if (hasSeparator) decimals += char
        else integer += char
      } else if (char === decimalSeparator && !hasSeparator && decimalsMax > 0) hasSeparator = true
    }

    integer = integer.replace(/^0+(?=\d)/, '').replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)
    decimals = decimals.slice(0, decimalsMax)

    return `${negative ? '-' : ''}${integer}${hasSeparator ? decimalSeparator + decimals : ''}`
  }
  function toNumber(text: string | undefined): number | undefined {
    if (!text) return undefined

    if (allowTelSymbols) {
      const onlyDigits = text.replace(/\D/g, '')
      return onlyDigits ? Number(onlyDigits) : undefined
    }

    const negative = text.trimStart().startsWith('-')
    const [integer = '', decimals = ''] = text
      .replace(/[^\d]/g, (c) => (c === decimalSeparator ? c : ''))
      .split(decimalSeparator)
    const parsed = Number.parseFloat(`${integer || '0'}.${decimals || '0'}`)
    if (Number.isNaN(parsed) || (!integer && !decimals)) return undefined

    return negative ? -parsed : parsed
  }

  useEffect(() => {
    if (value === undefined) return
    if ((value ?? undefined) !== toNumber(text)) setText(format(value))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <TextField
      properties={{
        inputMode: allowTelSymbols ? 'tel' : 'decimal',
        ...restProperties,
        value: text,
        onChange: (e) => {
          const clean = sanitize(e.target.value)
          e.target.value = clean
          setText(clean)
          onChange?.(wrapEvent(e, toNumber(clean)))
        },
        onBlur: (e) => {
          const number = toNumber(e.currentTarget.value)
          setText(format(number))
          onBlur?.(wrapEvent(e, number))
        },
        onKeyDown: (e) => onKeyDown?.(wrapEvent(e, toNumber(e.currentTarget.value))),
        onKeyUp: (e) => onKeyUp?.(wrapEvent(e, toNumber(e.currentTarget.value))),
      }}
      {...inputRest}
    />
  )
}
