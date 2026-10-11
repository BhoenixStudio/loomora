import {
  DeepPartial,
  LoomoraAutocompleteField,
  LoomoraAutocompleteT,
  LoomoraBase,
  LoomoraBreadCrumb,
  LoomoraButton,
  LoomoraCheckField,
  LoomoraColorField,
  LoomoraCountriesT,
  LoomoraFormBase,
  LoomoraFormT,
  LoomoraLabel,
  LoomoraNumberField,
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
    textEditorField: LoomoraTextEditorT
    searchField: LoomoraSearchT
    passwordField: LoomoraPasswordT
    phoneField: LoomoraPhoneT
    autoCompleteField: LoomoraAutocompleteT
    uploaderField: LoomoraUploaderT
    settings: LoomoraThemeT
  }
  // Components
  button: LoomoraButton
  breadcrumbs: LoomoraBreadCrumb
  form: LoomoraFormBase & {
    label: LoomoraLabel
    textareaField: LoomoraTextArea
    searchField: LoomoraSearchField
    selectField: LoomoraSelectField
    checkField: LoomoraCheckField
    passwordField: LoomoraPasswordField
    pinField: LoomoraOtpField
    rangeField: LoomoraRangeField
    colorField: LoomoraColorField
    phoneField: LoomoraPhoneField
    autoCompleteField: LoomoraAutocompleteField
    uploaderField: LoomoraUploaderField
    numberField: LoomoraNumberField
  }
  theme: LoomoraTheme
  responsive: LoomoraResponsive
  settings: LoomoraSettings
}

export type LoomoraConfigP = DeepPartial<LoomoraConfig>
