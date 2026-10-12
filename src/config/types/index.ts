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
  LoomoraDates,
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
  LoomoraRatingField,
  LoomoraResponsive,
  LoomoraSearchField,
  LoomoraSearchT,
  LoomoraSelectField,
  LoomoraSettings,
  LoomoraSocialT,
  LoomoraTextArea,
  LoomoraTextEditorT,
  LoomoraTextField,
  LoomoraTheme,
  LoomoraThemeT,
  LoomoraTimezonesT,
  LoomoraUploaderField,
  LoomoraUploaderT,
  LoomoraDatesT,
} from './helper'

/** Fully resolved Loomora configuration. */
export interface LoomoraConfig extends LoomoraBase {
  translations: {
    socials: LoomoraSocialT
    countries: LoomoraCountriesT
    timezones: LoomoraTimezonesT
    dates: LoomoraDatesT
    form: LoomoraFormT
    textEditorField: LoomoraTextEditorT
    searchField: LoomoraSearchT
    passwordField: LoomoraPasswordT
    phoneField: LoomoraPhoneT
    autoCompleteField: LoomoraAutocompleteT
    uploaderField: LoomoraUploaderT
    settings: LoomoraThemeT
  }
  // Hooks
  dates: LoomoraDates
  // Components
  button: LoomoraButton
  breadcrumbs: LoomoraBreadCrumb
  form: LoomoraFormBase & {
    label: LoomoraLabel
    textField: LoomoraTextField
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
    ratingField: LoomoraRatingField
  }
  theme: LoomoraTheme
  responsive: LoomoraResponsive
  settings: LoomoraSettings
}

export type LoomoraConfigP = DeepPartial<LoomoraConfig>
