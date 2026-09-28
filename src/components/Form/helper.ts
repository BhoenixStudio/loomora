import { Dispatch, ElementType, FocusEvent, ReactNode, SetStateAction } from 'react'
import { ChildSize, GlobalElementEssentials, WrapperSize } from '../../types'
import {
  AutocompleteProps,
  ButtonProps,
  CheckFieldProps,
  InputHelperProps,
  LabelProps,
  OtpFieldProps,
  PasswordFieldProps,
  PhoneInputProps,
  RangeFieldProps,
  SearchFieldProps,
  SelectProps,
  TextareaProps,
  TextEditorProps,
  TextFieldProps,
  UploaderFieldProps,
} from '../index'

export type InputBase = { size?: ChildSize[]; condition?: boolean; loading?: boolean }
export type InputProps = InputBase &
  (
    | ({ type?: 'text' } & TextFieldProps)
    | ({ type: 'textarea' } & TextareaProps)
    | ({ type: 'textEditor' } & TextEditorProps)
    | ({ type: 'label' } & LabelProps)
    | ({ type: 'search' } & SearchFieldProps)
    | ({ type: 'phone' } & PhoneInputProps)
    | ({ type: 'password' } & PasswordFieldProps)
    | ({ type: 'select' } & SelectProps)
    | ({ type: 'autocomplete' } & AutocompleteProps)
    | ({ type: 'file' } & UploaderFieldProps)
    | ({ type: 'check' } & CheckFieldProps)
    | ({ type: 'otp' } & OtpFieldProps)
    | ({ type: 'range' } & RangeFieldProps)
    | ({ type: 'custom'; element: ReactNode } & Pick<InputBase, 'condition'>)
  )

export type InputFieldset = {
  fieldset?: GlobalElementEssentials<'fieldset'>
  fieldsetPrefix?: ReactNode
  fieldsetSuffix?: ReactNode
}

export type InputLabel = { label?: ReactNode | Omit<LabelProps, 'required'> }

export type InputHelperAndError = {
  inputHelper?: ReactNode | Omit<InputHelperProps, 'asError'>
  error?: boolean
  errorHelper?: ReactNode | Omit<InputHelperProps, 'asError'>
}

export type InputsWrapperProps = {
  inputs?: InputProps[]
  wrapper?: GlobalElementEssentials<'div'> & { size?: WrapperSize[] }
  empty?: ReactNode
}

export type FormProps<T extends ElementType = 'form'> = Omit<GlobalElementEssentials<T>, 'clearDefaultClassName'> & {
  as?: T
  inputs?: InputsWrapperProps['inputs']
  inputsWrapper?: InputsWrapperProps['wrapper']
  prefix?: ReactNode
  suffix?: ReactNode
  actionsPrefix?: ReactNode
  actionsSuffix?: ReactNode
  actions?: ButtonProps[]
  actionWrapper?: GlobalElementEssentials<'div'>
  empty?: InputsWrapperProps['empty']
  loading?: boolean
  condition?: boolean
}

export type InputFocusProps<T> = {
  onFocus: (e: FocusEvent<T>) => void
  onBlur: (e: FocusEvent<T>) => void
}
export function InputFocus<T = HTMLInputElement>(
  setActive: Dispatch<SetStateAction<boolean>>,
  props: Partial<InputFocusProps<T>>,
  value: boolean
): InputFocusProps<T> {
  const { onFocus, onBlur } = props

  return {
    onFocus: (e: FocusEvent<T>) => {
      setActive(true)
      onFocus?.(e)
    },
    onBlur: (e: FocusEvent<T>) => {
      setActive(value)
      onBlur?.(e)
    },
  }
}
