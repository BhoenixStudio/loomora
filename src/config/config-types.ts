import { Locale } from 'date-fns'
import { ButtonHTMLAttributes, ElementType, ReactNode } from 'react'
import { ButtonCorner, ButtonSize, ButtonVariant } from '../components'
import { CountryProps, CountryType, SocialPlatform, SocialType, TimezoneProps, TimezoneType } from '../database'
import { MQ, TWColorName, TWGap, TWPadding, TWTextSize } from '../types'

/** Recursively optional configuration values accepted by a provider. */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends readonly unknown[] ? T[K] : T[K] extends object ? DeepPartial<T[K]> : T[K]
}

/** Fully resolved Loomora configuration. */
export type LoomoraConfig = {
  // Utils
  socials?: Partial<Record<SocialType, Pick<SocialPlatform, 'name' | 'placeholder'>>>
  countries?: Partial<Record<CountryType, Pick<CountryProps, 'name'>>>
  timezones?: Partial<Record<Exclude<TimezoneType, 'none'>, Pick<TimezoneProps, 'name' | 'region'>>>
  // Hooks
  useDates?: {
    locales?: Record<string, Locale>
    months?: Record<
      'JAN' | 'FEB' | 'MAR' | 'APR' | 'MAY' | 'JUN' | 'JUL' | 'AUG' | 'SEP' | 'OCT' | 'NOV' | 'DEC',
      { name: string; shortName: string }
    >
  }
  // Components
  LinkType?: ElementType
  button?: {
    defaultType?: ButtonHTMLAttributes<HTMLButtonElement>['type']
    defaultColor?: string
    defaultLoadingTitle?: ReactNode
    colors?: Partial<
      Record<
        Exclude<ButtonVariant, 'none'>,
        Record<string, Partial<Record<'text' | 'border' | 'background', TWColorName<string>>>>
      >
    >
    corners?: Partial<Record<ButtonCorner, MQ<'rounded' | `rounded-${string}`>[]>>
    sizes?: Partial<
      Record<
        ButtonSize,
        Partial<
          Record<
            Exclude<ButtonVariant, 'none'>,
            {
              textSize?: TWTextSize[] | ''
              textWeight?: MQ<'font-normal' | 'font-medium' | 'font-bold'>[] | ''
              gap?: TWGap[] | ''
              padding?: TWPadding[] | ''
            }
          >
        >
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
    textEditor?: {
      menuTranslation?: Partial<Record<'menusEdit' | 'menusView' | 'menusInsert' | 'menusFormat', string>>
    }
  }
  // Others
  settings?: {
    isRtl?: boolean
    locale?: string
  }
}

/** Partial configuration accepted by `LoomoraProvider`. */
export type LoomoraConfigInput = DeepPartial<LoomoraConfig>
