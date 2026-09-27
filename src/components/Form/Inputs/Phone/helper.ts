'use client'

import {
  ClipboardEvent,
  Dispatch,
  FocusEvent,
  InputEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  ReactNode,
  SetStateAction,
} from 'react'
import { CountryPhoneCodeType, CountryProps, CountryType } from '../../../../database'
import { TextFieldProps } from '../TextField'

export type PhonePrefix = '+' | '00' | null | undefined

type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | 'type'
  | 'size'
  | 'prefix'
  | 'maxLength'
  | 'minLength'
  | 'max'
  | 'min'
  | 'onInput'
  | 'onBlur'
  | 'onKeyDown'
  | 'onPaste'
  | 'onChange'
> & {
  onInput?: (props: PhoneValue, e: InputEvent<HTMLInputElement>) => void
  onPaste?: (props: PhoneValue, e: ClipboardEvent<HTMLInputElement>) => void
  setValue: (props: PhoneValue) => void
  onBlur?: (props: PhoneValue, e: FocusEvent<HTMLInputElement>) => void
  onKeyDown?: (props: PhoneValue, e: KeyboardEvent<HTMLInputElement>) => void
  country?: CountryType
  defaultCountry?: CountryType
  onCountryChange?: (country: CountryType | undefined) => void
}

export interface PhoneInputProps extends Omit<TextFieldProps, 'properties'> {
  worldwide?: boolean
  selectedCountriesOnly?: CountryType[]
  showCountriesFlags?: boolean
  showCountriesName?: boolean
  codePrefix?: PhonePrefix
  properties?: InputProps
}

type GetPhoneTitleProps = {
  country?: CountryProps
  showCountriesFlags: boolean
  codePrefix: PhonePrefix
  worldwide?: boolean
  defaultTitle: string
  render: (props: Pick<GetPhoneTitleProps, 'country' | 'codePrefix' | 'showCountriesFlags'>) => ReactNode
}

type AssignPhoneProps = {
  country?: CountryProps
  codePrefix: PhonePrefix
  setValue?: (props: PhoneValue) => void
  setValueError: (error: ReactNode) => void
  startError: ReactNode
}

type SetPhoneProps = {
  onInput?: InputProps['onInput']
  isPasting: boolean
  setIsPasting: Dispatch<SetStateAction<boolean>>
} & AssignPhoneProps

type PastePhoneProps = {
  onPaste?: InputProps['onPaste']
  setIsPasting: Dispatch<SetStateAction<boolean>>
} & AssignPhoneProps

export type PhoneValue = {
  codePrefix: PhonePrefix
  code: CountryPhoneCodeType | undefined
  value: string
  final: string
}
export const phoneFallBackValue: PhoneValue = {
  codePrefix: null,
  code: undefined,
  value: '',
  final: '',
}

export function usePhoneHelper() {
  const CleanPhone = (phone: string, code: CountryPhoneCodeType): string => {
    if (!phone || !code) return ''

    const codeStr = String(code)
    let cleaned = phone.replaceAll(/[^\d+]/g, '').replaceAll(/(?!^)\+/g, '')
    if (cleaned.startsWith('+')) cleaned = cleaned.slice(1)
    else if (cleaned.startsWith('00')) cleaned = cleaned.slice(2)
    if (cleaned.startsWith(codeStr)) cleaned = cleaned.slice(codeStr.length)
    return cleaned
  }

  const GetPhoneTitle = (props: GetPhoneTitleProps) => {
    const { country, showCountriesFlags, codePrefix, worldwide, defaultTitle, render } = props

    const title = country?.phone?.code && render({ country, showCountriesFlags, codePrefix })
    if (worldwide) return title ?? defaultTitle
    return title ?? ''
  }

  const AssignPhone = (phone: string, props: AssignPhoneProps) => {
    const { codePrefix, country, setValue, setValueError, startError } = props

    const numberRegex = /^\d+$/
    const cleaned = country?.phone?.code ? CleanPhone(phone, country.phone.code) : phone

    if (!cleaned || cleaned.trim() === '') {
      setValue?.({ codePrefix: null, code: undefined, value: '', final: '' })
      setValueError('')
    } else if (!country?.phone?.start?.includes(Number(cleaned?.substring(0, 1)))) {
      setValue?.({ codePrefix: null, code: undefined, value: '', final: '' })
      setValueError(startError)
    } else if (numberRegex.test(cleaned)) {
      setValue?.({
        codePrefix,
        code: country?.phone?.code,
        value: cleaned,
        final: `${codePrefix ?? ''}${country?.phone?.code ?? ''}${cleaned}`,
      })
      setValueError('')
    }
  }

  const SetPhone = (e: InputEvent<HTMLInputElement>, props: SetPhoneProps) => {
    const { onInput, isPasting, setIsPasting, codePrefix, country, ...setPhoneRest } = props

    const newValue: string = e.currentTarget.value

    onInput?.(
      {
        codePrefix,
        code: country?.phone?.code,
        value: newValue,
        final: `${codePrefix ?? ''}${country?.phone?.code ?? ''}${newValue}`,
      },
      e
    )
    if (isPasting) setIsPasting(false)
    else AssignPhone(newValue, { codePrefix, country, ...setPhoneRest })
  }

  const PhonePaste = (e: ClipboardEvent<HTMLInputElement>, props: PastePhoneProps) => {
    const { onPaste, setIsPasting, codePrefix, country, ...phoneStartRest } = props

    setIsPasting(true)
    const pastedText = e.clipboardData.getData('text')

    let updatedText = pastedText.replaceAll(/[^\d+]/g, '').replaceAll(/(?!^)\+/g, '')
    const codeLength = String(country?.phone?.code ?? '').length
    const maxLength = country?.phone?.length?.max ?? 11

    if (updatedText.startsWith('+') || updatedText.startsWith('0')) updatedText = updatedText.slice(1)
    else if (updatedText.startsWith('00')) updatedText = updatedText.slice(2)

    if (updatedText.startsWith(String(country?.phone?.code ?? '')))
      updatedText = updatedText.slice(codeLength, codeLength + maxLength)
    else updatedText = updatedText.slice(0, maxLength)

    onPaste?.(
      {
        codePrefix,
        code: country?.phone?.code,
        value: updatedText,
        final: `${codePrefix ?? ''}${country?.phone?.code ?? ''}${updatedText}`,
      },
      e
    )

    AssignPhone(updatedText, { codePrefix, country, ...phoneStartRest })
  }

  return { CleanPhone, GetPhoneTitle, SetPhone, PhonePaste }
}
