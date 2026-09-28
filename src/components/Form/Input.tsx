'use client'

import { ReactNode } from 'react'
import { cn } from '../../hooks'
import {
  Autocomplete,
  AutocompleteProps,
  CheckField,
  CheckFieldProps,
  InputProps,
  InputsWrapperProps,
  Label,
  LabelProps,
  OtpField,
  OtpFieldProps,
  PasswordField,
  PasswordFieldProps,
  PhoneInput,
  PhoneInputProps,
  RangeField,
  RangeFieldProps,
  SearchField,
  SearchFieldProps,
  Select,
  SelectProps,
  TextareaField,
  TextareaProps,
  TextEditor,
  TextEditorProps,
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
    textarea: <TextareaField {...(rest as TextareaProps)} />,
    textEditor: <TextEditor {...(rest as TextEditorProps)} />,
    label: <Label {...(rest as LabelProps)} />,
    search: <SearchField {...(rest as SearchFieldProps)} />,
    phone: <PhoneInput {...(rest as PhoneInputProps)} />,
    password: <PasswordField {...(rest as PasswordFieldProps)} />,
    select: <Select {...(rest as SelectProps)} />,
    autocomplete: <Autocomplete {...(rest as AutocompleteProps)} />,
    file: <UploaderField {...(rest as UploaderFieldProps)} />,
    check: <CheckField {...(rest as CheckFieldProps)} />,
    otp: <OtpField {...(rest as OtpFieldProps)} />,
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
    <div className={cn(['grid', ...size, className])} {...attributes} {...attrs}>
      {fInputs}
    </div>
  )
}
