'use client'

import { ReactNode } from 'react'
import { cx } from '../../hooks'
import {
  AutocompleteField,
  AutocompleteFieldProps,
  CheckField,
  CheckFieldProps,
  ColorField,
  ColorFieldProps,
  CustomInputProps,
  DateField,
  DateFieldProps,
  DividerInputProps,
  EmptyInputProps,
  InputProps,
  InputsWrapperProps,
  Label,
  LabelProps,
  NumberField,
  NumberFieldProps,
  PasswordField,
  PasswordFieldProps,
  PhoneFieldProps,
  PhoneInput,
  PinField,
  PinFieldProps,
  RangeField,
  RangeFieldProps,
  RatingField,
  RatingFieldProps,
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
  const { type = 'text', condition, ...rest } = props

  if (condition === false) return null

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
    pin: <PinField {...(rest as PinFieldProps)} />,
    range: <RangeField {...(rest as RangeFieldProps)} />,
    rating: <RatingField {...(rest as RatingFieldProps)} />,
    number: <NumberField {...(rest as NumberFieldProps)} />,
    color: <ColorField {...(rest as ColorFieldProps)} />,
    date: <DateField {...(rest as DateFieldProps)} />,
    datePicker: <DateField {...(rest as DateFieldProps)} />,
    divider: (() => {
      const { size = ['col-span-12'], className, attributes, ...attrs } = rest as DividerInputProps
      return <hr className={cx(['border-t border-third w-full my-2', ...size, className])} {...attributes} {...attrs} />
    })(),
    empty: (() => {
      const { size = [], className, attributes, ...attrs } = rest as EmptyInputProps
      return <div className={cx([...size, className])} aria-hidden="true" {...attributes} {...attrs} />
    })(),
    custom: (() => {
      const { element, size = [], className, attributes, ...attrs } = rest as CustomInputProps
      if (size.length > 0 || className || attributes || Object.keys(attrs).length > 0) {
        return (
          <div className={cx([...size, className])} {...attributes} {...attrs}>
            {element}
          </div>
        )
      }
      return element
    })(),
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
