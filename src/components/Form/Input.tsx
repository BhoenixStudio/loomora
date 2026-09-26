'use client'

import { ReactNode } from 'react'
import { InputProps, InputsWrapperProps } from './helper'
import { cn } from '../../hooks'

export function Input(props: Readonly<InputProps>) {
  const { type = 'text' } = props

  // Configs
  const types: Record<Exclude<InputProps['type'], undefined>, ReactNode> = {
    text: '',
    textarea: '',
    textEditor: '',
    label: '',
    search: '',
    phone: '',
    password: '',
    select: '',
    autocomplete: '',
    file: '',
    check: '',
    otp: '',
    range: '',
    custom: '',
  }

  return types[type ?? 'text'] ?? types.text
}

export function Inputs(props: Readonly<InputsWrapperProps>) {
  const { inputs = [], wrapper, empty } = props

  const { size = ['grid-cols-12'], className = 'items-start gap-3 w-full', attributes, ...attrs } = wrapper ?? {}

  // Configs
  const fInputs = inputs
    ?.filter(({ condition }) => condition !== false)
    ?.map((input, i: number) => <Input key={i} {...input} />)

  if (fInputs.length === 0) return empty
  return (
    <div className={cn(['grid', ...size, className])} {...attributes} {...attrs}>
      {fInputs}
    </div>
  )
}
