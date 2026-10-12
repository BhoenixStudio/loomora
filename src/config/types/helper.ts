import { Locale } from 'date-fns'
import { ButtonHTMLAttributes, ElementType, ReactNode } from 'react'
import { LoomoraConfig } from '.'
import { ButtonCorner, ButtonSize, ButtonVariant, FileExtType, PhonePrefix } from '../../components'
import { Country, CountryType, Social, SocialType, TimezoneType } from '../../database'
import {
  CSSProps,
  MQ,
  NestedKeyOf,
  PartialRecord,
  TWColorName,
  TWColorSName,
  TWGap,
  TWPadding,
  TWTextSize,
} from '../../types'
import { ScreenSize, ScreenSizeValue, ThemeType } from '../../utils'

// Helpers
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends readonly unknown[] | ReadonlySet<unknown>
    ? T[K]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K]
}

export type TranslateFn = <K extends NestedKeyOf<LoomoraConfig['translations']>>(
  key: K,
  vars?: PartialRecord<string, string | number | undefined | null>
) => string

export type RequireKeys<Keys extends string[]> = Keys extends []
  ? string
  : Keys extends [infer SingleKey extends string]
    ? `${string}{${SingleKey}}${string}`
    : Keys extends [infer First extends string, ...infer Rest extends string[]]
      ? `${string}{${First}}${RequireKeys<Rest>}`
      : string

// Main
export type LoomoraBase = {
  hasTranslationStrategy: boolean
  LinkType: ElementType
  flagResource: `${string}{key}${string}`
}

// Data
export type LoomoraSocialT = Record<SocialType, Pick<Social, 'name' | 'placeholder'>>
export type LoomoraCountriesT = Record<CountryType, Pick<Country, 'name'>>
export type LoomoraTimezonesT = Record<Exclude<TimezoneType, 'none'>, string> & {
  regions: {
    africa: string
    america: string
    asia: string
    australia: string
    europe: string
    pacific: string
    atlantic: string
    indian: string
  }
}

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
export type LoomoraFormT = { dialogCloseTitle: string; dialogTitle: string }
export type LoomoraFormBase = { fieldset: { className: string } }
export type LoomoraLabel = {
  as: 'label' | 'legend'
  showRequiredIndicator: boolean
  className: string
  stateSharedClassName: string
  inactiveClassName: string
  activeClassName: string
}
export type LoomoraTextField = { className: string }

export type LoomoraTextArea = { className: string; defaultRows: number }

export type LoomoraTextEditorT = { menusEdit: string; menusView: string; menusInsert: string; menusFormat: string }

export type LoomoraSearchT = { searchButtonTitle: string; clearSearchTitle: string }
export type LoomoraSearchField = { searchIcon: ReactNode; clearIcon: ReactNode }

export type LoomoraSelectField = { triggerIcon: ReactNode; optionClassName: string; optionGroupClassName: string }

export type LoomoraCheckField = { checkIcon: ReactNode; color: TWColorSName<'text'>; activeColor: TWColorSName<'text'> }

export type LoomoraPasswordT = {
  copyTooltip: RequireKeys<['password']>
  generate: RequireKeys<['length', 'password']>
  hideTooltip: RequireKeys<['password']>
  label: RequireKeys<['password']>
  showTooltip: RequireKeys<['password']>
  placeholder: string
  confirmMatch: string
  confirmMismatch: string
  missing: string
  missingButton: string
  validation: {
    medium: string
    strong: string
    weak: string
    minLength: { short: RequireKeys<['length']>; long: RequireKeys<['maxLength']> }
    lowercase: { short: RequireKeys<['lowercaseLength']>; long: RequireKeys<['lowercaseLength']> }
    uppercase: { short: RequireKeys<['uppercaseLength']>; long: RequireKeys<['uppercaseLength']> }
    number: { short: RequireKeys<['numbersLength']>; long: RequireKeys<['numbersLength']> }
    special: { short: RequireKeys<['specialCharsLength']>; long: RequireKeys<['specialCharsLength']> }
  }
}
export type LoomoraPasswordLength = {
  length: number | undefined
  maxLength: number | undefined
  uppercaseLength: number | undefined
  lowercaseLength: number | undefined
  numbersLength: number | undefined
  specialCharsLength: number | undefined
}
export type LoomoraPasswordBoolean = {
  useLength: boolean
  useUppercase: boolean
  useLowercase: boolean
  useNumbers: boolean
  useSpecialChars: boolean
  hasCopy: boolean
  hasGenerate: boolean
  hasValidation: boolean
  hasShow: boolean
  showValidationProgress: boolean
  showValidationsList: boolean
}
export type LoomoraPasswordIcon = {
  validIcon: ReactNode
  invalidIcon: ReactNode
  showIcon: ReactNode
  hideIcon: ReactNode
  confirmMainIcon: ReactNode
  confirmingMainIcon: ReactNode
  copyIcon: ReactNode
}
export type LoomoraPasswordField = {
  colors: Record<0 | 20 | 40 | 60 | 80 | 100, { textColor: string; progressColor: string }>
} & LoomoraPasswordLength &
  LoomoraPasswordBoolean &
  LoomoraPasswordIcon

export type LoomoraOtpField = { length: number; className: string }
export type LoomoraRangeField = {
  step: number
  showValue: boolean
  showMinMax: boolean
  valuePrefix: ReactNode
  valueSuffix: ReactNode
  className: string
}

export type LoomoraRatingField = {
  max: number
  step: 1 | 0.5
  allowClear: boolean
  className: string
  activeClassName: string
  iconSize: number
  icon: ReactNode | undefined
  emptyIcon: ReactNode | undefined
}

export type LoomoraColorField = { presets: Set<string>; alpha?: boolean; allowEmpty?: boolean }

export type LoomoraPhoneT = {
  startPlaceholder: RequireKeys<['start']>
  startPlaceholderOne: RequireKeys<['start']>
  defaultTitle: string
  startError: RequireKeys<['start', 'country']>
}
export type LoomoraPhoneField = {
  worldwide: boolean
  codePrefix: PhonePrefix
  showCountriesName: boolean
  showCountriesFlags: boolean
  selectedCountriesOnly: CountryType[]
}

export type LoomoraAutocompleteT = {
  loadingState: string
  emptyState: string
  searchPlaceholder: string
  selectedCount: RequireKeys<['count']>
}
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

export type LoomoraUploaderT = {
  allCatAccepted: RequireKeys<['cat']>
  extsAccepted: RequireKeys<['exts']>
  duplicateFileRule: string
  minFilesRule: RequireKeys<['min']>
  maxFilesRule: RequireKeys<['max']>
  acceptRule: RequireKeys<['rules']>
  minSizeRule: RequireKeys<['min']>
  maxSizeRule: RequireKeys<['max']>
  minFilesSizeRule: RequireKeys<['min']>
  maxFilesSizeRule: RequireKeys<['max']>
  uploadError: string
  dialogTitle: string
  placeholder: string
  pasteAndDragAndDropSupportRule: string
  pasteSupportRule: string
  dragAndDropSupportRule: string
  dropFilesHere: { title: string; description: string }
  actions: { update: string; view: string; removeFile: string }
  item: {
    id: RequireKeys<['id']>
    number: RequireKeys<['number']>
    size: RequireKeys<['size']>
    ext: RequireKeys<['ext']>
  }
}
export type LoomoraUploaderField = {
  fileIcon: ReactNode
  filesIcon: ReactNode
  imageIcon: ReactNode
  imagesIcon: ReactNode
  videoIcon: ReactNode
  videosIcon: ReactNode
  audioIcon: ReactNode
  audiosIcon: ReactNode
  textIcon: ReactNode
  textsIcon: ReactNode
  applicationIcon: ReactNode
  applicationsIcon: ReactNode
  executableIcon: ReactNode
  executablesIcon: ReactNode
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

export type LoomoraNumberField = {
  allowTelSymbols: boolean
  decimalSeparator: string
  decimalsMax: number
  decimalsMin: number
  thousandSeparator: string
}

// Hooks
export type LoomoraDatesT = {
  months: {
    JAN: { name: string; shortName: string }
    FEB: { name: string; shortName: string }
    MAR: { name: string; shortName: string }
    APR: { name: string; shortName: string }
    MAY: { name: string; shortName: string }
    JUN: { name: string; shortName: string }
    JUL: { name: string; shortName: string }
    AUG: { name: string; shortName: string }
    SEP: { name: string; shortName: string }
    OCT: { name: string; shortName: string }
    NOV: { name: string; shortName: string }
    DEC: { name: string; shortName: string }
  }
}
export type LoomoraDates = { locales: Record<string, Locale> }

// Other
export type LoomoraThemeT = {
  lightMode: string
  darkMode: string
  systemDetection: string
  systemDetectionDescription: string
  dynamicMode: string
  dynamicModeDescription: string
  darkModeStartTime: string
  darkModeEndTime: string
}
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
