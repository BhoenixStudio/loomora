'use client'

import { forwardRef, ReactNode, useEffect, useMemo, useState } from 'react'
import { useLoomoraConfig } from '../../../../config'
import { CountryType, useCountries } from '../../../../database'
import { Flag } from '../../../UI'
import { TextField } from '../TextField'
import { PhoneInputProps, usePhoneHelper } from './helper'
import { Autocomplete } from '../Autocomplete'
import { AutocompleteOption } from '../Autocomplete/helper'

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>((props) => {
  const { t, form } = useLoomoraConfig()

  const {
    worldwide = form?.phone?.worldwide ?? true,
    codePrefix = form?.phone?.codePrefix ?? '+',
    showCountriesName = form?.phone?.showCountriesName ?? true,
    showCountriesFlags = form?.phone?.showCountriesFlags ?? true,
    selectedCountriesOnly = form?.phone?.selectedCountriesOnly ?? [],
    properties,
    inputHelper,
    prefix,
    active: forceActive = true,
    fieldset,
    ...attrs
  } = props

  const { attributes, ...fieldsetProps } = fieldset ?? {}
  const { dir = 'ltr', ...fieldsetAttrs } = attributes ?? {}

  const {
    value,
    setValue,
    defaultCountry,
    country,
    onCountryChange,
    placeholder: ph,
    autoComplete = 'mobile tel',
    onPaste,
    onInput,
    onBlur,
    onKeyDown,
    ...inputProps
  } = properties ?? {}

  const { getCountries, getCountry } = useCountries()
  const { GetPhoneTitle, SetPhone, PhonePaste } = usePhoneHelper()

  // States
  const [isPasting, setIsPasting] = useState<boolean>(false)
  const [selectedCountry, setSelectedCountry] = useState<CountryType>()
  const [valueError, setValueError] = useState<ReactNode>()
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Configs
  const countries = getCountries({ only: selectedCountriesOnly })
  const sCountry = getCountry(country ?? defaultCountry)
  const { name, phone } = sCountry ?? {}

  const startPH =
    Number(phone?.start?.length) > 1
      ? t('phone.startPlaceholder', { start: String(phone?.start?.join(', ')) })
      : t('phone.startPlaceholderOne', { start: String(phone?.start?.[0] ?? '') })
  const placeholder = worldwide && phone?.start?.length ? startPH : (ph ?? startPH)

  const countryTitle = GetPhoneTitle({
    country: sCountry,
    showCountriesFlags,
    codePrefix,
    worldwide,
    defaultTitle: t('phone.defaultTitle') ?? 'Country',
    render: ({ country, showCountriesFlags, codePrefix }) => (
      <>
        {showCountriesFlags && country?.code && <Flag country={country.code} className="me-1" />}
        {codePrefix}
        {country?.phone?.code}
      </>
    ),
  })
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return countries
    const q = searchQuery.toLowerCase().trim()
    return countries.filter(
      (c) => c.name?.toLowerCase().includes(q) || c.code?.toLowerCase().includes(q) || String(c.phone?.code).includes(q)
    )
  }, [countries, searchQuery])
  const countryOptions = useMemo<AutocompleteOption[]>(() => {
    if (!worldwide) return []
    return filteredCountries.map((c) => ({
      value: c.code,
      label: (
        <span className="flex items-center gap-2">
          {showCountriesFlags && <Flag country={c.code} />}
          {showCountriesName && <span className="truncate">{c.name}</span>}
          <span className="ms-auto text-body-2 shrink-0">
            {codePrefix}
            {c.phone?.code}
          </span>
        </span>
      ),
    }))
  }, [worldwide, filteredCountries, showCountriesFlags, showCountriesName, codePrefix])

  const pre = (
    <div className="flex items-center text-sm font-medium gap-1">
      {worldwide ? (
        <></>
      ) : (
        <>
          <Autocomplete
            options={countryOptions}
            wrapper={{ className: 'border-[unset]' }}
            properties={{
              searchable: true,
              onSearch: (e) => setSearchQuery(e.target.value),
              searchViaLabel: false,
              showClearSearch: false,
              value: country ?? selectedCountry,
              onChange: (value) => setSelectedCountry(typeof value === 'string' ? (value as CountryType) : undefined),
              renderValue: (option) => {
                const c = filteredCountries.find((fc) => fc.code === option.value) ?? sCountry
                return (
                  <span className="flex items-center gap-1">
                    {showCountriesFlags && c?.code && <Flag country={c.code} />}
                    <span className="text-body-2 shrink-0">
                      {codePrefix}
                      {c?.phone?.code}
                    </span>
                  </span>
                )
              },
            }}
          />
          {countryTitle}
        </>
      )}
      {prefix}
    </div>
  )

  // Functions
  const phoneValue = (value: string) => ({
    codePrefix,
    code: sCountry?.phone?.code,
    value: value,
    final: `${codePrefix ?? ''}${sCountry?.phone?.code ?? ''}${value}`,
  })

  useEffect(() => {
    if (country) setSelectedCountry(country)
    else if (!defaultCountry) setSelectedCountry(undefined)
    else setSelectedCountry(defaultCountry)
  }, [defaultCountry, country])
  useEffect(() => {
    onCountryChange?.(selectedCountry)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry])

  return (
    <TextField
      fieldset={{ attributes: { dir, ...fieldsetAttrs }, ...fieldsetProps }}
      prefix={pre}
      inputHelper={
        <>
          {valueError && <span>{valueError}</span>}
          {inputHelper}
        </>
      }
      properties={{
        type: 'tel',
        value,
        placeholder,
        minLength: phone?.length?.min ?? 5,
        maxLength: phone?.length?.max ?? 11,
        autoComplete,
        onBlur: (e) => onBlur?.(phoneValue(e.target.value), e),
        onKeyDown: (e) => onKeyDown?.(phoneValue(e.currentTarget.value), e),
        onInput: (e) =>
          SetPhone(e, {
            country: sCountry,
            setValue,
            setValueError,
            startError: t('phone.startError', { country: String(name), start: String(phone?.start?.join(', ')) }),
            onInput,
            isPasting,
            setIsPasting,
            codePrefix,
          }),
        onPaste: (e) =>
          PhonePaste(e, {
            country: sCountry,
            setValue,
            setValueError,
            startError: t('phone.startError', { country: String(name), start: String(phone?.start?.join(', ')) }),
            onPaste,
            setIsPasting,
            codePrefix,
          }),
        ...inputProps,
      }}
      {...{ active: forceActive, ...attrs }}
    />
  )
})
