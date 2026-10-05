import {
  DeepPartial,
  LoomoraAutocompleteField,
  LoomoraAutocompleteT,
  LoomoraBase,
  LoomoraBreadCrumb,
  LoomoraButton,
  LoomoraCheckField,
  LoomoraCountriesT,
  LoomoraFormBase,
  LoomoraFormT,
  LoomoraLabel,
  LoomoraOtpField,
  LoomoraPasswordField,
  LoomoraPasswordT,
  LoomoraPhoneField,
  LoomoraPhoneT,
  LoomoraRangeField,
  LoomoraResponsive,
  LoomoraSearchField,
  LoomoraSearchT,
  LoomoraSelectField,
  LoomoraSettings,
  LoomoraSocialT,
  LoomoraTextArea,
  LoomoraTextEditorT,
  LoomoraTheme,
  LoomoraThemeT,
  LoomoraTimezonesT,
  LoomoraUploaderField,
  LoomoraUploaderT,
  LoomoraUseDateT,
} from './helper'

/** Fully resolved Loomora configuration. */
export interface LoomoraConfig extends LoomoraBase {
  translations: {
    socials: LoomoraSocialT
    countries: LoomoraCountriesT
    timezones: LoomoraTimezonesT
    useDates: LoomoraUseDateT
    form: LoomoraFormT
    textEditor: LoomoraTextEditorT
    searchField: LoomoraSearchT
    password: LoomoraPasswordT
    phone: LoomoraPhoneT
    autoComplete: LoomoraAutocompleteT
    uploader: LoomoraUploaderT
    settings: LoomoraThemeT
  }
  // Components
  button: LoomoraButton
  breadcrumbs: LoomoraBreadCrumb
  form: LoomoraFormBase & {
    label: LoomoraLabel
    textarea: LoomoraTextArea
    searchField: LoomoraSearchField
    select: LoomoraSelectField
    check: LoomoraCheckField
    password: LoomoraPasswordField
    otp: LoomoraOtpField
    range: LoomoraRangeField
    phone: LoomoraPhoneField
    autoComplete: LoomoraAutocompleteField
    uploader: LoomoraUploaderField
  }
  theme: LoomoraTheme
  responsive: LoomoraResponsive
  settings: LoomoraSettings
}

export type LoomoraConfigP = DeepPartial<LoomoraConfig>
