/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { ChangeEvent, HTMLAttributes, ReactNode } from 'react'
import { GlobalElementEssentials } from '../../../../types'
import { ButtonBaseProps } from '../../../UI'
import { InputBase, InputFieldset, InputHelperAndError, InputLabel } from '../../helper'

export type AutocompleteValue = string | number | undefined

export type AutocompleteOption<T = any> = {
  value: AutocompleteValue
  label: ReactNode
  disabled?: boolean
  className?: string
  selectedClassName?: string
  notSelectedClassName?: string
  attributes?: Omit<HTMLAttributes<HTMLLIElement>, 'value' | 'disabled'>
  variables?: T
}

export type AutocompleteSingle<T = any> = {
  value?: AutocompleteValue
  onChange: (value: AutocompleteValue, selected: AutocompleteOption<T>) => void
  renderValue?: (option: AutocompleteOption<T>) => ReactNode
  renderOption?: (option: AutocompleteOption<T>) => ReactNode
  renderTag?: never
  min?: never
  max?: never
}

export type AutocompleteMultiple<T = any> = {
  value?: AutocompleteValue[]
  onChange: (values: AutocompleteValue[], selected: AutocompleteOption<T>[]) => void
  renderValue?: (options: AutocompleteOption<T>[]) => ReactNode
  renderOption?: (option: AutocompleteOption<T>) => ReactNode
  renderTag?: (option: AutocompleteOption<T>) => ReactNode
  min?: number
  max?: number
}

type InputProps<T = any> = (
  ({ multiple?: false } & AutocompleteSingle<T>) | ({ multiple: true } & AutocompleteMultiple<T>)
) & {
  onClear?: () => void
  disabled?: boolean
  required?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  onSearch?: (e: ChangeEvent<HTMLInputElement>) => void
  searchViaLabel?: boolean
  showClearSearch?: boolean
}

export interface AutocompleteProps<T = any>
  extends InputBase, Pick<InputFieldset, 'fieldset'>, InputLabel, InputHelperAndError {
  wrapper?: GlobalElementEssentials<'div'>
  prefix?: ReactNode
  suffix?: ReactNode
  active?: boolean
  properties?: InputProps<T>
  options: AutocompleteOption<T>[]
  optionsMenu?: GlobalElementEssentials<'ul'>
  loadingState?: ReactNode
  emptyState?: ReactNode
  showTrigger?: boolean
  trigger?: ReactNode | (Pick<ButtonBaseProps, 'variant' | 'color' | 'corner'> & { icon: ReactNode })
  onToggle?: (opened: boolean) => void
}
