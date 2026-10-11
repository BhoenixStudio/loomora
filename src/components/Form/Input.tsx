'use client'

import { ReactNode } from 'react'
import { cx } from '../../hooks'
import {
  AutocompleteField,
  AutocompleteFieldProps,
  CheckField,
  CheckFieldProps,
  InputProps,
  InputsWrapperProps,
  Label,
  LabelProps,
  PasswordField,
  PasswordFieldProps,
  PhoneInput,
  PhoneFieldProps,
  PinField,
  PinFieldProps,
  RangeField,
  RangeFieldProps,
  SearchField,
  SearchFieldProps,
  SelectField,
  SelectProps,
  TextareaField,
  TextareaFieldProps,
  TextEditorField,
  TextEditorFieldProps,
  TextField,
  TextFieldProps,
  UploaderField,
  UploaderFieldProps,
} from '../index'

export function Input(props: Readonly<InputProps>) {
  const { type = 'text', ...rest } = props

  // Configs
  const types: Record<Exclude<InputProps['type'], undefined>, ReactNode> = {
    text: <TextField {...(rest as TextFieldProps)} />,
    textarea: <TextareaField {...(rest as TextareaFieldProps)} />,
    textEditor: <TextEditorField {...(rest as TextEditorFieldProps)} />,
    label: <Label {...(rest as LabelProps)} />,
    search: <SearchField {...(rest as SearchFieldProps)} />,
    phone: <PhoneInput {...(rest as PhoneFieldProps)} />,
    password: <PasswordField {...(rest as PasswordFieldProps)} />,
    select: <SelectField {...(rest as SelectProps)} />,
    autocomplete: <AutocompleteField {...(rest as AutocompleteFieldProps)} />,
    file: <UploaderField {...(rest as UploaderFieldProps)} />,
    check: <CheckField {...(rest as CheckFieldProps)} />,
    otp: <PinField {...(rest as PinFieldProps)} />,
    range: <RangeField {...(rest as RangeFieldProps)} />,
    custom: (rest as { element: ReactNode }).element,
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
    <div className={cx(['grid', ...size, className])} {...attributes} {...attrs}>
      {fInputs}
    </div>
  )
}
