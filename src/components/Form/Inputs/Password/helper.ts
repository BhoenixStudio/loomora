'use client'

import { InputHTMLAttributes, ReactNode, useMemo } from 'react'
import { useLoomoraConfig } from '../../../../config'
import { TextFieldProps } from '../TextField'

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

export type PasswordValidationProps = {
  useLength?: boolean
  minLength?: number
  useUppercase?: boolean
  uppercaseLength?: number
  useLowercase?: boolean
  lowercaseLength?: number
  useNumbers?: boolean
  numbersLength?: number
  useSpecialChars?: boolean
  specialCharsLength?: number
}
export type PasswordValidationItem = {
  message: string | undefined
  excerpt: string | undefined
  valid: boolean
  icon: ReactNode
}
export type PasswordValidationReturn = {
  strength: number
  note: string
  textColor: `text-${string}` | `text-${string}/${number}`
  progressColor: `bg-${string}` | `bg-${string}/${number}`
  items: PasswordValidationItem[]
  valid: boolean
}

export interface PasswordFieldProps extends Omit<TextFieldProps, 'properties'> {
  properties?: InputProps

  hasCopy?: boolean

  hasShow?: boolean
  onShow?: (shown: boolean) => void

  hasGenerate?: boolean
  generateText?: string
  generateLength?: number
  onGenerate?: (password: string) => void

  hasValidation?: boolean
  showValidationProgress?: boolean
  showValidationsList?: boolean
  validationSettings?: PasswordValidationProps
  onValidate?: (valid: boolean) => void

  asConfirm?: boolean
  confirmValue?: InputProps['value']
  matchText?: ReactNode
  mismatchText?: ReactNode
  showConfirmIcon?: boolean
  onConfirm?: (matched: boolean) => void
}

export function usePasswordHelper() {
  const { t, form } = useLoomoraConfig()

  const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
  const NUMBERS = '0123456789'
  const SPECIAL_CHARS = '!@#$%^&*()-_=+[]{}|;:,.<>?'

  // Configs
  const reqLength = form?.password?.length ?? 8
  const specialCharsRegex = /[!@#$%^&*()\-_=+\\[\]{}|;:,.<>?]/

  const colors: Record<
    number,
    {
      note: string
      textColor: PasswordValidationReturn['textColor']
      progressColor: PasswordValidationReturn['progressColor']
    }
  > = {
    0: { note: t('password.validation.weak') ?? '', textColor: 'text-error', progressColor: 'bg-error' },
    20: { note: t('password.validation.weak') ?? '', textColor: 'text-error', progressColor: 'bg-error' },
    40: { note: t('password.validation.medium') ?? '', textColor: 'text-warning', progressColor: 'bg-warning' },
    60: { note: t('password.validation.medium') ?? '', textColor: 'text-info', progressColor: 'bg-info' },
    80: { note: t('password.validation.strong') ?? '', textColor: 'text-primary', progressColor: 'bg-primary' },
    100: { note: t('password.validation.strong') ?? '', textColor: 'text-success', progressColor: 'bg-success' },
  }

  // Functions
  const GeneratePassword = (
    length: number = reqLength,
    props?: Omit<PasswordValidationProps, 'useLength' | 'minLength'>
  ): string => {
    const {
      useLowercase = form?.password?.useLowercase ?? true,
      lowercaseLength = form?.password?.lowercaseLength ?? 1,
      useUppercase = form?.password?.useUppercase ?? true,
      uppercaseLength = form?.password?.uppercaseLength ?? 1,
      useNumbers = form?.password?.useNumbers ?? true,
      numbersLength = form?.password?.numbersLength ?? 1,
      useSpecialChars = form?.password?.useSpecialChars ?? true,
      specialCharsLength = form?.password?.specialCharsLength ?? 1,
    } = props ?? {}

    const getRandom = (chars: string) => chars[Math.floor(Math.random() * chars.length)]

    const password: string[] = []
    let allowedChars = ''

    // 1. Add required characters and build the allowed character pool
    if (useUppercase) {
      allowedChars += UPPERCASE
      for (let i = 0; i < uppercaseLength; i++) password.push(getRandom(UPPERCASE))
    }

    if (useLowercase) {
      allowedChars += LOWERCASE
      for (let i = 0; i < lowercaseLength; i++) password.push(getRandom(LOWERCASE))
    }

    if (useNumbers) {
      allowedChars += NUMBERS
      for (let i = 0; i < numbersLength; i++) password.push(getRandom(NUMBERS))
    }

    if (useSpecialChars) {
      allowedChars += SPECIAL_CHARS
      for (let i = 0; i < specialCharsLength; i++) password.push(getRandom(SPECIAL_CHARS))
    }

    // Fallback in case all 'use' flags were passed as false
    if (!allowedChars) return ''

    // 2. Fill the remaining length with random characters from the allowed pool
    for (let i = password.length; i < length; i++) {
      password.push(getRandom(allowedChars))
    }

    // 3. Shuffle the array so the required characters aren't always at the beginning
    return password.toSorted(() => Math.random() - 0.5).join('')
  }

  const ValidatePassword = (
    password: InputProps['value'],
    props?: PasswordValidationProps
  ): PasswordValidationReturn => {
    const {
      useLength = form?.password?.useLength ?? true,
      minLength = form?.password?.maxLength ?? 8,
      useLowercase = form?.password?.useLowercase ?? true,
      lowercaseLength = form?.password?.lowercaseLength ?? 1,
      useUppercase = form?.password?.useUppercase ?? true,
      uppercaseLength = form?.password?.uppercaseLength ?? 1,
      useNumbers = form?.password?.useNumbers ?? true,
      numbersLength = form?.password?.numbersLength ?? 1,
      useSpecialChars = form?.password?.useSpecialChars ?? true,
      specialCharsLength = form?.password?.specialCharsLength ?? 1,
    } = props ?? {}

    return useMemo(() => {
      if (!password)
        return { strength: 0, note: '', textColor: 'text-error', progressColor: 'bg-error', items: [], valid: false }

      const passwordStr = String(password)
      const validations = [
        {
          message: t('password.validation.minLength.long', { length: minLength }),
          excerpt: t('password.validation.minLength.short', { length: minLength }),
          valid: passwordStr.length >= minLength,
          condition: useLength,
        },
        {
          message: t('password.validation.lowercase.long', { length: lowercaseLength }),
          excerpt: t('password.validation.lowercase.short', { length: lowercaseLength }),
          valid:
            /[a-z]/.test(passwordStr) ||
            (useLowercase && (passwordStr.match(/[a-z]/g) || []).length >= lowercaseLength),
          condition: useLowercase,
        },
        {
          message: t('password.validation.uppercase.long', { length: uppercaseLength }),
          excerpt: t('password.validation.uppercase.short', { length: uppercaseLength }),
          valid:
            /[A-Z]/.test(passwordStr) ||
            (useUppercase && (passwordStr.match(/[A-Z]/g) || []).length >= uppercaseLength),
          condition: useUppercase,
        },
        {
          message: t('password.validation.number.long', { length: numbersLength }),
          excerpt: t('password.validation.number.short', { length: numbersLength }),
          valid:
            /[0-9]/.test(passwordStr) || (useNumbers && (passwordStr.match(/[0-9]/g) || []).length >= numbersLength),
          condition: useNumbers,
        },
        {
          message: t('password.validation.special.long', { length: specialCharsLength }),
          excerpt: t('password.validation.special.short', { length: specialCharsLength }),
          valid:
            specialCharsRegex.test(passwordStr) ||
            (useSpecialChars &&
              (passwordStr.match(new RegExp(specialCharsRegex.source, 'g')) || []).length >= specialCharsLength),
          condition: useSpecialChars,
        },
      ]?.filter(({ condition }) => condition !== false)

      const strength = validations.length > 0 ? 100 / validations.length : 0
      const validCount = validations.filter((v) => v.valid).length
      const totalStrength = Math.min(100, validCount * strength)
      const roundedStrength = Math.round(totalStrength / 20) * 20

      return {
        strength: totalStrength,
        note: colors[roundedStrength].note,
        textColor: colors[roundedStrength].textColor,
        progressColor: colors[roundedStrength].progressColor,
        valid: validCount === validations.length,
        items: validations.map(({ valid: isValid, ...rest }) => ({
          ...rest,
          valid: isValid,
          icon: isValid ? form?.password?.validIcon : form?.password?.invalidIcon,
        })),
      }
    }, [
      password,
      minLength,
      useLength,
      useUppercase,
      uppercaseLength,
      useLowercase,
      lowercaseLength,
      useNumbers,
      numbersLength,
      useSpecialChars,
      specialCharsLength,
    ])
  }

  return { GeneratePassword, ValidatePassword }
}
