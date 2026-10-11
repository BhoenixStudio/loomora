/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { ChangeEvent, HTMLAttributes, ReactNode } from 'react'
import { ButtonProps, InputBase, InputFieldset, InputHelperAndError, InputLabel } from '../../../'
import { GlobalElement } from '../../../../types'

export type AutocompleteFieldValue = string | number | undefined

export type AutocompleteFieldOption<T = any> = {
  value: AutocompleteFieldValue
  label: ReactNode
  disabled?: boolean
  className?: string
  selectedClassName?: string
  notSelectedClassName?: string
  attributes?: Omit<HTMLAttributes<HTMLLIElement>, 'value' | 'disabled'>
  variables?: T
}

export type AutocompleteFieldSingle<T = any> = {
  value?: AutocompleteFieldValue
  onChange: (value: AutocompleteFieldValue, selected: AutocompleteFieldOption<T>) => void
  renderValue?: (option: AutocompleteFieldOption<T>) => ReactNode
  renderOption?: (option: AutocompleteFieldOption<T>) => ReactNode
  renderTag?: never
  min?: never
  max?: never
}

export type AutocompleteFieldMultiple<T = any> = {
  value?: AutocompleteFieldValue[]
  onChange: (values: AutocompleteFieldValue[], selected: AutocompleteFieldOption<T>[]) => void
  renderValue?: (options: AutocompleteFieldOption<T>[]) => ReactNode
  renderOption?: (option: AutocompleteFieldOption<T>) => ReactNode
  renderTag?: (option: AutocompleteFieldOption<T>) => ReactNode
  min?: number
  max?: number
}

type InputSharedProps = {
  onClear?: () => void
  disabled?: boolean
  required?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  onSearch?: (e: ChangeEvent<HTMLInputElement>) => void
  searchViaLabel?: boolean
  showClearSearch?: boolean
}

export type AutocompleteFieldSingleProperties<T = any> = InputSharedProps & {
  multiple?: false
} & AutocompleteFieldSingle<T>

export type AutocompleteFieldMultipleProperties<T = any> = InputSharedProps & {
  multiple: true
} & AutocompleteFieldMultiple<T>

type InputProps<T = any> = AutocompleteFieldSingleProperties<T> | AutocompleteFieldMultipleProperties<T>

export interface AutocompleteFieldProps<T = any>
  extends InputBase, Pick<InputFieldset, 'fieldset'>, InputLabel, InputHelperAndError {
  wrapper?: GlobalElement<'div'>
  prefix?: ReactNode
  suffix?: ReactNode
  active?: boolean
  properties?: InputProps<T>
  options: AutocompleteFieldOption<T>[]
  optionsMenu?: GlobalElement<'ul'>
  loadingState?: ReactNode
  emptyState?: ReactNode
  showTrigger?: boolean
  trigger?: ReactNode | (Pick<ButtonProps, 'variant' | 'color' | 'corner'> & { icon: ReactNode })
  onToggle?: (opened: boolean) => void
}

export type AutocompleteFieldSingleProps<T = any> = Omit<AutocompleteFieldProps<T>, 'properties'> & {
  properties?: AutocompleteFieldSingleProperties<T>
}

export type AutocompleteFieldMultipleProps<T = any> = Omit<AutocompleteFieldProps<T>, 'properties'> & {
  properties?: AutocompleteFieldMultipleProperties<T>
}
