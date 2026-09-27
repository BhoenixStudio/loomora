import { Locale } from 'date-fns'
import { ButtonHTMLAttributes, ElementType, ReactNode } from 'react'
import { ButtonCorner, ButtonSize, ButtonVariant } from '../components'
import { CountryProps, CountryType, SocialPlatform, SocialType, TimezoneProps, TimezoneType } from '../database'
import { MQ, PartialRecord as PR, TWColorName, TWColorSName, TWGap, TWPadding, TWTextSize } from '../types'

/** Recursively optional configuration values accepted by a provider. */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends readonly unknown[] ? T[K] : T[K] extends object ? DeepPartial<T[K]> : T[K]
}

/** Fully resolved Loomora configuration. */
export type LoomoraConfig = {
  // Translations
  translations?: {
    socials?: PR<SocialType, Pick<SocialPlatform, 'name' | 'placeholder'>>
    countries?: PR<CountryType, Pick<CountryProps, 'name'>>
    timezones?: PR<Exclude<TimezoneType, 'none'>, Pick<TimezoneProps, 'name' | 'region'>>
    useDates?: {
      locales?: PR<string, Locale>
      months?: PR<
        'JAN' | 'FEB' | 'MAR' | 'APR' | 'MAY' | 'JUN' | 'JUL' | 'AUG' | 'SEP' | 'OCT' | 'NOV' | 'DEC',
        { name: string; shortName: string }
      >
    }
    textEditor?: PR<'menusEdit' | 'menusView' | 'menusInsert' | 'menusFormat', string>
    searchField?: PR<'searchButtonTitle' | 'clearSearchTitle', string>
    password?: PR<
      | 'placeholder'
      | 'confirmMatch'
      | 'confirmMismatch'
      | 'copyTooltip'
      | 'generate'
      | 'hideTooltip'
      | 'label'
      | 'missing'
      | 'missingButton'
      | 'showTooltip',
      string
    > & {
      validation?: PR<'medium' | 'strong' | 'weak', string> &
        PR<'lowercase' | 'minLength' | 'number' | 'special' | 'uppercase', PR<'short' | 'long', string>>
    }
  }
  // Hooks
  // Components
  button?: {
    defaultType?: ButtonHTMLAttributes<HTMLButtonElement>['type']
    defaultColor?: string
    defaultLoadingTitle?: ReactNode
    colors?: PR<
      Exclude<ButtonVariant, 'none'>,
      Record<string, Partial<Record<'text' | 'border' | 'background', TWColorName>>>
    >
    corners?: PR<ButtonCorner, MQ<'rounded' | `rounded-${string}`>[]>
    sizes?: PR<
      ButtonSize,
      PR<
        Exclude<ButtonVariant, 'none'>,
        {
          textSize?: TWTextSize[] | ''
          textWeight?: MQ<'font-normal' | 'font-medium' | 'font-bold'>[] | ''
          gap?: TWGap[] | ''
          padding?: TWPadding[] | ''
        }
      >
    >
  }
  breadcrumbs?: { defaultSeparator?: ReactNode }
  form?: {
    label?: {
      as?: 'label' | 'legend'
      showRequiredIndicator?: boolean
      className?: string
      stateSharedClassName?: string
      inactiveClassName?: string
      activeClassName?: string
    }
    fieldset?: { className?: string }
    textfield?: { className?: string }
    textarea?: { className?: string; defaultRows?: number }
    searchField?: { searchIcon?: ReactNode; clearIcon?: ReactNode }
    select?: { triggerIcon?: ReactNode; optionClassName?: string; optionGroupClassName?: string }
    check?: { color?: TWColorSName<'text'>; activeColor?: TWColorSName<'text'> }
    password?: PR<
      'length' | 'maxLength' | 'uppercaseLength' | 'lowercaseLength' | 'numbersLength' | 'specialCharsLength',
      number
    > &
      PR<
        | 'useLength'
        | 'useUppercase'
        | 'useLowercase'
        | 'useNumbers'
        | 'useSpecialChars'
        | 'hasCopy'
        | 'hasGenerate'
        | 'hasValidation'
        | 'hasShow'
        | 'showValidationProgress'
        | 'showValidationsList',
        boolean
      > &
      PR<
        'validIcon' | 'invalidIcon' | 'showIcon' | 'hideIcon' | 'confirmMainIcon' | 'confirmingMainIcon' | 'copyIcon',
        ReactNode
      > & { colors?: PR<0 | 20 | 40 | 60 | 80 | 100, PR<'textColor' | 'progressColor', string>> }
  }
  // Others
  LinkType?: ElementType
  settings?: { isRtl?: boolean; locale?: string }
}

/** Partial configuration accepted by `LoomoraProvider`. */
export type LoomoraConfigInput = DeepPartial<LoomoraConfig>
