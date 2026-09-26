import { Dispatch, ElementType, FocusEvent, ReactNode, SetStateAction } from 'react'
import { ChildSize, GlobalElementEssentials, WrapperSize } from '../../types'
import { InputHelperProps } from './Modules/Helper'
import { LabelProps } from './Modules/Label'

export type InputBase = { size?: ChildSize[]; condition?: boolean; loading?: boolean }
export type InputProps = InputBase &
  (
    | { type?: 'text' }
    | { type: 'textarea' }
    | { type: 'textEditor' }
    | { type: 'label' }
    | { type: 'search' }
    | { type: 'phone' }
    | { type: 'password' }
    | { type: 'select' }
    | { type: 'autocomplete' }
    | { type: 'file' }
    | { type: 'check' }
    | { type: 'otp' }
    | { type: 'range' }
    | { type: 'custom' }
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

export type FormProps<T extends ElementType = 'form'> = GlobalElementEssentials<T> & {
  inputs?: InputsWrapperProps['inputs']
  inputsWrapper?: InputsWrapperProps['wrapper']
  prefix?: ReactNode
  suffix?: ReactNode
  actionsPrefix?: ReactNode
  actionsSuffix?: ReactNode
  // actions?: ActionProps[];
  actionWrapper?: GlobalElementEssentials<'div'>
  empty?:
    | InputsWrapperProps['empty']
    | ((
        prefix?: ReactNode,
        suffix?: ReactNode,
        actionsPrefix?: ReactNode,
        actionsSuffix?: ReactNode
      ) => InputsWrapperProps['empty'])
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
