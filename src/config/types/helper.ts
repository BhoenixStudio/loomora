import { Locale } from 'date-fns'
import { ButtonHTMLAttributes, ElementType, ReactNode } from 'react'
import { LoomoraConfig } from '.'
import { ButtonCorner, ButtonSize, ButtonVariant, FileExtType, PhonePrefix } from '../../components'
import { Country, CountryType, Social, SocialType, Timezone, TimezoneType } from '../../database'
import {
  CSSProps,
  MQ,
  NestedKeyOf,
  PartialRecord as PR,
  TWColorName,
  TWColorSName,
  TWGap,
  TWPadding,
  TWTextSize,
} from '../../types'
import { ScreenSize, ScreenSizeValue, ThemeType } from '../../utils'

// Main
export type LoomoraBase = {
  hasTranslationStrategy: boolean
  LinkType: ElementType
  flagResource: `${string}{key}${string}`
}

// Data
export type LoomoraSocialT = Record<SocialType, Pick<Social, 'name' | 'placeholder'>>
export type LoomoraCountriesT = Record<CountryType, Pick<Country, 'name'>>
export type LoomoraTimezonesT = Record<Exclude<TimezoneType, 'none'>, Pick<Timezone, 'name' | 'region'>>

// Components
export type LoomoraButtonSize = {
  textSize: TWTextSize[] | ''
  textWeight: MQ<'font-normal' | 'font-medium' | 'font-bold'>[] | ''
  gap: TWGap[] | ''
  padding: TWPadding[] | ''
}
export type LoomoraButton = {
  defaultType: ButtonHTMLAttributes<HTMLButtonElement>['type']
  defaultColor: string
  defaultLoadingTitle: ReactNode
  colors: Record<
    Exclude<ButtonVariant, 'none'>,
    Record<string, Partial<Record<'text' | 'border' | 'background', TWColorName>>>
  >
  corners: Record<ButtonCorner, MQ<'rounded' | `rounded-${string}`>[]>
  sizes: Record<Exclude<ButtonSize, 'none'>, Record<Exclude<ButtonVariant, 'none'>, LoomoraButtonSize>>
}
export type LoomoraBreadCrumb = { defaultSeparator: ReactNode }

// Form
export type LoomoraFormT = Record<'dialogCloseTitle' | 'dialogTitle', string>
export type LoomoraFormBase = {
  fieldset: { className: string }
  textfield: { className: string }
}
export type LoomoraLabel = {
  as: 'label' | 'legend'
  showRequiredIndicator: boolean
  className: string
  stateSharedClassName: string
  inactiveClassName: string
  activeClassName: string
}
export type LoomoraTextArea = { className: string; defaultRows: number }
export type LoomoraTextEditorT = Record<'menusEdit' | 'menusView' | 'menusInsert' | 'menusFormat', string>
export type LoomoraSearchT = Record<'searchButtonTitle' | 'clearSearchTitle', string>
export type LoomoraSearchField = { searchIcon: ReactNode; clearIcon: ReactNode }
export type LoomoraSelectField = { triggerIcon: ReactNode; optionClassName: string; optionGroupClassName: string }
export type LoomoraCheckField = { color: TWColorSName<'text'>; activeColor: TWColorSName<'text'> }

export type LoomoraPasswordT = Record<
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
  validation: Record<'medium' | 'strong' | 'weak', string> &
    Record<'lowercase' | 'minLength' | 'number' | 'special' | 'uppercase', Record<'short' | 'long', string>>
}
export type LoomoraPasswordLength = Record<
  'length' | 'maxLength' | 'uppercaseLength' | 'lowercaseLength' | 'numbersLength' | 'specialCharsLength',
  number | undefined
>
export type LoomoraPasswordBoolean = Record<
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
>
export type LoomoraPasswordIcon = Record<
  'validIcon' | 'invalidIcon' | 'showIcon' | 'hideIcon' | 'confirmMainIcon' | 'confirmingMainIcon' | 'copyIcon',
  ReactNode
>
export type LoomoraPasswordField = LoomoraPasswordLength &
  LoomoraPasswordBoolean &
  LoomoraPasswordIcon & {
    colors: Record<0 | 20 | 40 | 60 | 80 | 100, Record<'textColor' | 'progressColor', string>>
  }

export type LoomoraOtpField = { length: number; className: string }
export type LoomoraRangeField = {
  step: number
  showValue: boolean
  showMinMax: boolean
  valuePrefix: ReactNode
  valueSuffix: ReactNode
  className: string
}

export type LoomoraPhoneT = Record<'startPlaceholder' | 'startPlaceholderOne' | 'defaultTitle' | 'startError', string>
export type LoomoraPhoneField = {
  worldwide: boolean
  codePrefix: PhonePrefix
  showCountriesName: boolean
  showCountriesFlags: boolean
  selectedCountriesOnly: CountryType[]
}

export type LoomoraAutocompleteT = Record<'loadingState' | 'emptyState' | 'searchPlaceholder' | 'selectedCount', string>
export type LoomoraAutocompleteField = {
  triggerIcon: ReactNode
  triggerWrapperClassName: string
  searchable: boolean
  multiple: boolean
  searchViaLabel: boolean
  showClearSearch: boolean
  ClearSearchIcon: ReactNode
  multipleTagsCloseIcon: ReactNode
}

export type LoomoraUploaderT = Record<
  | 'allCatAccepted'
  | 'extsAccepted'
  | 'duplicateFileRule'
  | 'minFilesRule'
  | 'maxFilesRule'
  | 'acceptRule'
  | 'minSizeRule'
  | 'maxSizeRule'
  | 'minFilesSizeRule'
  | 'maxFilesSizeRule'
  | 'uploadError'
  | 'dialogTitle'
  | 'placeholder'
  | 'pasteAndDragAndDropSupportRule'
  | 'pasteSupportRule'
  | 'dragAndDropSupportRule',
  string
> & {
  dropFilesHere: Record<'title' | 'description', string>
  actions: Record<'update' | 'view' | 'removeFile', string>
  item: Record<'number' | 'id' | 'size' | 'ext', string>
}
export type LoomoraUploaderIcon = Record<
  | 'fileIcon'
  | 'filesIcon'
  | 'imageIcon'
  | 'imagesIcon'
  | 'videoIcon'
  | 'videosIcon'
  | 'audioIcon'
  | 'audiosIcon'
  | 'textIcon'
  | 'textsIcon'
  | 'applicationIcon'
  | 'applicationsIcon'
  | 'executableIcon'
  | 'executablesIcon',
  ReactNode
>
export type LoomoraUploaderField = LoomoraUploaderIcon & {
  defaultFileCategory: FileExtType[]
  onDetectErrors: (error: string[]) => void
  minBlockHeight: `min-h-[${CSSProps['minHeight']}]`
  showProgress: boolean
  progressColor: TWColorSName<'text'>
  minFiles: number | undefined
  maxFiles: number | undefined
  minSize: number | undefined
  maxSize: number | undefined
  minFilesSize: number | undefined
  maxFilesSize: number | undefined
  allowPaste: boolean
  allowDragAndDrop: boolean
}

// Hooks
export type LoomoraUseDateT = {
  locales: Record<string, Locale>
  months: Record<
    'JAN' | 'FEB' | 'MAR' | 'APR' | 'MAY' | 'JUN' | 'JUL' | 'AUG' | 'SEP' | 'OCT' | 'NOV' | 'DEC',
    { name: string; shortName: string }
  >
}

// Other
export type LoomoraThemeT = Record<
  | 'lightMode'
  | 'darkMode'
  | 'systemDetection'
  | 'systemDetectionDescription'
  | 'dynamicMode'
  | 'dynamicModeDescription'
  | 'darkModeStartTime'
  | 'darkModeEndTime',
  string
>
export type LoomoraTheme = {
  default: ThemeType
  switchingAnimation: boolean
  themeStorageKey: string
  themeRangeStorageKey: string
  themeDynamicStartTime: string
  themeDynamicEndTime: string
  lightModeIcon: ReactNode
  darkModeIcon: ReactNode
  systemDetectionIcon: ReactNode
  dynamicModeIcon: ReactNode
}
export type LoomoraResponsive = Record<ScreenSize, ScreenSizeValue>
export type LoomoraSettings = { isRtl: boolean; locale: string }

// Helpers
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends readonly unknown[] ? T[K] : T[K] extends object ? DeepPartial<T[K]> : T[K]
}

export type TranslateFn = <K extends NestedKeyOf<LoomoraConfig['translations']>>(
  key: K,
  vars?: PR<string, string | number | undefined | null>
) => string
