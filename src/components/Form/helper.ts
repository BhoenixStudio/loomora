import { Dispatch, ElementType, FocusEvent, ReactNode, SetStateAction } from 'react'
import {
  AutocompleteFieldProps,
  ButtonProps,
  CheckFieldProps,
  ColorFieldProps,
  InputError,
  InputHelperProps,
  LabelProps,
  NumberFieldProps,
  PasswordFieldProps,
  PhoneFieldProps,
  PinFieldProps,
  RangeFieldProps,
  SearchFieldProps,
  SelectProps,
  TextareaFieldProps,
  TextEditorFieldProps,
  TextFieldProps,
  UploaderFieldProps,
} from '../'
import { ChildSize, GlobalElement, WrapperSize } from '../../types'

export type InputBase = { size?: ChildSize[]; condition?: boolean; loading?: boolean }
export type InputProps = InputBase &
  (
    | ({ type?: 'text' } & TextFieldProps)
    | ({ type: 'textarea' } & TextareaFieldProps)
    | ({ type: 'textEditor' } & TextEditorFieldProps)
    | ({ type: 'label' } & LabelProps)
    | ({ type: 'search' } & SearchFieldProps)
    | ({ type: 'phone' } & PhoneFieldProps)
    | ({ type: 'password' } & PasswordFieldProps)
    | ({ type: 'select' } & SelectProps)
    | ({ type: 'autocomplete' } & AutocompleteFieldProps)
    | ({ type: 'file' } & UploaderFieldProps)
    | ({ type: 'check' } & CheckFieldProps)
    | ({ type: 'otp' } & PinFieldProps)
    | ({ type: 'range' } & RangeFieldProps)
    | ({ type: 'color' } & ColorFieldProps)
    | ({ type: 'number' } & NumberFieldProps)
    | ({ type: 'custom'; element: ReactNode } & Pick<InputBase, 'condition'>)
  )

export type InputFieldset = {
  fieldset?: GlobalElement<'fieldset'>
  fieldsetPrefix?: ReactNode
  fieldsetSuffix?: ReactNode
}

export type InputLabel = { label?: ReactNode | Omit<LabelProps, 'required'> }

export type InputHelperAndError = { inputHelper?: ReactNode | Omit<InputHelperProps, 'asError'>; errors?: InputError[] }

export type InputsWrapperProps = {
  inputs?: InputProps[]
  wrapper?: GlobalElement<'div'> & { size?: WrapperSize[] }
  empty?: ReactNode
}

export type FormProps<T extends ElementType = 'form'> = Omit<GlobalElement<T>, 'clearDefaultClassName'> & {
  as?: T
  inputs?: InputsWrapperProps['inputs']
  inputsWrapper?: InputsWrapperProps['wrapper']
  prefix?: ReactNode
  suffix?: ReactNode
  actionsPrefix?: ReactNode
  actionsSuffix?: ReactNode
  actions?: ButtonProps[]
  actionWrapper?: GlobalElement<'div'>
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
