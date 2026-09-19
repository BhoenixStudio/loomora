'use client'

/**
 * Localized country metadata and lookup helpers.
 *
 * The internal `Countries` function contains the static country-code catalog,
 * phone-prefix rules, phone-number start digits and lengths, currency data,
 * icon identifiers, and country names. `useCountries` exposes a
 * sorted list lookup and a single-country lookup while preserving optional
 * caller-provided fields through its generic `extra` option.
 *
 * Country names are stored directly in the catalog. The country code union is
 * derived from the catalog, and the `@data` barrel re-exports the public types
 * and hook.
 *
 * Minimal example:
 *
 * ```tsx
 * const { getCountry } = useCountries()
 * const oman = getCountry('OM')
 * ```
 *
 * `getAllCountries({ only: ['OM', 'SA'] })` is the observed filtered-list
 * shape used when a caller needs a smaller country selector. This module does
 * not validate user phone input or render flags; `PhoneInput` and its helper
 * consume the returned metadata for those concerns.
 */

/** Currency-code union derived from catalog entries that provide an international code. */
export type CountryCurrencyInternationalType = Extract<
  ExtractedCountryCurrency,
  { international: string }
>['international']

/** Currency-symbol union derived from catalog entries that provide a symbol. */
export type CountryCurrencySymbolType = Extract<ExtractedCountryCurrency, { symbol: string }>['symbol']

/** Currency metadata returned for a country. */
export type CountryCurrencyProps = {
  international: CountryCurrencyInternationalType
  symbol: CountryCurrencySymbolType
  icon: string
}

/** International dialing-code union derived from the country catalog. */
export type CountryPhoneCodeType = Extract<ExtractedCountryPhoneProps, { code: number }>['code']

/** Phone-prefix and local-number constraints returned for a country. */
export type CountryPhoneProps = {
  code: CountryPhoneCodeType
  start: number[]
  length: { min: number; max: number }
}

/** Complete country metadata returned by the lookup helpers. */
export type CountryProps = {
  code: CountryType
  name: string
  phone: CountryPhoneProps
  currency: CountryCurrencyProps
}

function Countries() {

  return {
    AF: {
      name: 'Afghanistan',
      phone: { code: 93, start: [7], length: { min: 9, max: 9 } },
      currency: { international: 'AFN', symbol: '؋', icon: 'tabler:currency-afghani' },
    },
    AL: {
      name: 'Albania',
      phone: { code: 355, start: [6], length: { min: 9, max: 9 } },
      currency: { international: 'ALL', symbol: 'L', icon: 'tabler:currency-lek' },
    },
    DZ: {
      name: 'Algeria',
      phone: { code: 213, start: [5, 6, 7], length: { min: 9, max: 9 } },
      currency: { international: 'DZD', symbol: 'د.ج', icon: 'tabler:currency-dinar' },
    },
    AS: {
      name: 'American Samoa',
      phone: { code: 1684, start: [7], length: { min: 7, max: 7 } },
      currency: { international: 'USD', symbol: '$', icon: 'mdi:currency-usd' },
    },
    AD: {
      name: 'Andorra',
      phone: { code: 376, start: [3, 6], length: { min: 6, max: 9 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    AO: {
      name: 'Angola',
      phone: { code: 244, start: [9], length: { min: 9, max: 9 } },
      currency: { international: 'AOA', symbol: 'Kz', icon: 'tabler:currency-kwanza' },
    },
    AI: {
      name: 'Anguilla',
      phone: { code: 1264, start: [2, 5], length: { min: 7, max: 7 } },
      currency: { international: 'XCD', symbol: '$', icon: 'mdi:currency-usd' },
    },
    AQ: { name: 'Antarctica', phone: { code: 1, start: [0], length: { min: 10, max: 10 } }, currency: { symbol: '—' } },
    AR: {
      name: 'Argentina',
      phone: { code: 54, start: [9], length: { min: 10, max: 11 } },
      currency: { international: 'ARS', symbol: '$', icon: 'tabler:currency-peso' },
    },
    AM: {
      name: 'Armenia',
      phone: { code: 374, start: [4, 7, 9], length: { min: 8, max: 8 } },
      currency: { international: 'AMD', symbol: '֏', icon: 'tabler:currency-dram' },
    },
    AW: {
      name: 'Aruba',
      phone: { code: 297, start: [5, 7], length: { min: 7, max: 7 } },
      currency: { international: 'AWG', symbol: 'ƒ', icon: 'tabler:currency-florin' },
    },
    AU: {
      name: 'Australia',
      phone: { code: 61, start: [4], length: { min: 9, max: 9 } },
      currency: { international: 'AUD', symbol: 'A$', icon: 'mdi:currency-usd' },
    },
    AT: {
      name: 'Austria',
      phone: { code: 43, start: [6], length: { min: 10, max: 13 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    AZ: {
      name: 'Azerbaijan',
      phone: { code: 994, start: [4, 5, 7], length: { min: 9, max: 9 } },
      currency: { international: 'AZN', symbol: '₼', icon: 'tabler:currency-manat' },
    },
    BS: {
      name: 'Bahamas',
      phone: { code: 1242, start: [3, 4], length: { min: 7, max: 7 } },
      currency: { international: 'BSD', symbol: '$', icon: 'mdi:currency-usd' },
    },
    BH: {
      name: 'Bahrain',
      phone: { code: 973, start: [3], length: { min: 8, max: 8 } },
      currency: { international: 'BHD', symbol: '.د.ب', icon: 'tabler:currency-bahraini' },
    },
    BD: {
      name: 'Bangladesh',
      phone: { code: 880, start: [1], length: { min: 10, max: 10 } },
      currency: { international: 'BDT', symbol: '৳', icon: 'mdi:currency-bdt' },
    },
    BB: {
      name: 'Barbados',
      phone: { code: 1246, start: [2], length: { min: 7, max: 7 } },
      currency: { international: 'BBD', symbol: 'Bds$', icon: 'mdi:currency-usd' },
    },
    BY: {
      name: 'Belarus',
      phone: { code: 375, start: [2, 3, 4], length: { min: 9, max: 9 } },
      currency: { international: 'BYN', symbol: 'Br', icon: 'tabler:currency-rubel' },
    },
    BE: {
      name: 'Belgium',
      phone: { code: 32, start: [4], length: { min: 9, max: 9 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    BZ: {
      name: 'Belize',
      phone: { code: 501, start: [6], length: { min: 7, max: 7 } },
      currency: { international: 'BZD', symbol: 'BZ$', icon: 'mdi:currency-usd' },
    },
    BJ: {
      name: 'Benin',
      phone: { code: 229, start: [4, 6], length: { min: 8, max: 8 } },
      currency: { international: 'XOF', symbol: 'CFA', icon: 'tabler:currency-frank' },
    },
    BM: {
      name: 'Bermuda',
      phone: { code: 1441, start: [2, 3], length: { min: 7, max: 7 } },
      currency: { international: 'BMD', symbol: '$', icon: 'mdi:currency-usd' },
    },
    BT: {
      name: 'Bhutan',
      phone: { code: 975, start: [1, 2], length: { min: 8, max: 8 } },
      currency: { international: 'BTN', symbol: 'Nu.' },
    },
    BO: {
      name: 'Bolivia',
      phone: { code: 591, start: [6, 7], length: { min: 8, max: 8 } },
      currency: { international: 'BOB', symbol: 'Bs.', icon: 'tabler:currency-boliviano' },
    },
    BA: {
      name: 'Bosnia and Herzegovina',
      phone: { code: 387, start: [6], length: { min: 8, max: 9 } },
      currency: { international: 'BAM', symbol: 'KM' },
    },
    BW: {
      name: 'Botswana',
      phone: { code: 267, start: [7], length: { min: 8, max: 8 } },
      currency: { international: 'BWP', symbol: 'P', icon: 'tabler:currency-pula' },
    },
    BR: {
      name: 'Brazil',
      phone: { code: 55, start: [1, 2], length: { min: 10, max: 11 } },
      currency: { international: 'BRL', symbol: 'R$', icon: 'mdi:currency-brl' },
    },
    IO: {
      name: 'British Indian Ocean Territory',
      phone: { code: 1246, start: [2], length: { min: 7, max: 7 } },
      currency: { international: 'USD', symbol: '$', icon: 'mdi:currency-usd' },
    },
    VG: {
      name: 'British Virgin Islands',
      phone: { code: 1284, start: [2, 3], length: { min: 7, max: 7 } },
      currency: { international: 'USD', symbol: '$', icon: 'mdi:currency-usd' },
    },
    BN: {
      name: 'Brunei Darussalam',
      phone: { code: 673, start: [7, 8], length: { min: 7, max: 7 } },
      currency: { international: 'BND', symbol: 'B$', icon: 'mdi:currency-usd' },
    },
    BG: {
      name: 'Bulgaria',
      phone: { code: 359, start: [8, 9], length: { min: 8, max: 9 } },
      currency: { international: 'BGN', symbol: 'лв', icon: 'tabler:currency-lev' },
    },
    BF: {
      name: 'Burkina Faso',
      phone: { code: 226, start: [6, 7], length: { min: 8, max: 8 } },
      currency: { international: 'XOF', symbol: 'CFA', icon: 'tabler:currency-frank' },
    },
    BI: {
      name: 'Burundi',
      phone: { code: 257, start: [7, 8], length: { min: 8, max: 8 } },
      currency: { international: 'BIF', symbol: 'FBu', icon: 'tabler:currency-frank' },
    },
    KH: {
      name: 'Cambodia',
      phone: { code: 855, start: [1, 2], length: { min: 8, max: 9 } },
      currency: { international: 'KHR', symbol: '៛', icon: 'tabler:currency-riel' },
    },
    CM: {
      name: 'Cameroon',
      phone: { code: 237, start: [6], length: { min: 9, max: 9 } },
      currency: { international: 'XAF', symbol: 'FCFA', icon: 'tabler:currency-frank' },
    },
    CA: {
      name: 'Canada',
      phone: { code: 1, start: [2, 3, 4, 5, 6, 7, 8, 9], length: { min: 10, max: 10 } },
      currency: { international: 'CAD', symbol: 'C$', icon: 'mdi:currency-usd' },
    },
    CV: {
      name: 'Cape Verde',
      phone: { code: 238, start: [5, 9], length: { min: 7, max: 7 } },
      currency: { international: 'CVE', symbol: '$', icon: 'tabler:currency-escudo' },
    },
    KY: {
      name: 'Cayman Islands',
      phone: { code: 1345, start: [3, 4], length: { min: 7, max: 7 } },
      currency: { international: 'KYD', symbol: '$', icon: 'mdi:currency-usd' },
    },
    CF: {
      name: 'Central African Republic',
      phone: { code: 236, start: [7], length: { min: 8, max: 8 } },
      currency: { international: 'XAF', symbol: 'FCFA', icon: 'tabler:currency-frank' },
    },
    TD: {
      name: 'Chad',
      phone: { code: 235, start: [6], length: { min: 8, max: 8 } },
      currency: { international: 'XAF', symbol: 'FCFA', icon: 'tabler:currency-frank' },
    },
    CL: {
      name: 'Chile',
      phone: { code: 56, start: [9], length: { min: 9, max: 9 } },
      currency: { international: 'CLP', symbol: '$', icon: 'tabler:currency-peso' },
    },
    CN: {
      name: 'China',
      phone: { code: 86, start: [1], length: { min: 11, max: 11 } },
      currency: { international: 'CNY', symbol: '¥', icon: 'mdi:currency-cny' },
    },
    CX: {
      name: 'Christmas Island',
      phone: { code: 61, start: [4], length: { min: 9, max: 9 } },
      currency: { international: 'AUD', symbol: 'A$', icon: 'mdi:currency-usd' },
    },
    CC: {
      name: 'Cocos (Keeling) Islands',
      phone: { code: 61, start: [4], length: { min: 9, max: 9 } },
      currency: { international: 'AUD', symbol: 'A$', icon: 'mdi:currency-usd' },
    },
    CO: {
      name: 'Colombia',
      phone: { code: 57, start: [3], length: { min: 10, max: 10 } },
      currency: { international: 'COP', symbol: '$', icon: 'tabler:currency-peso' },
    },
    KM: {
      name: 'Comoros',
      phone: { code: 269, start: [3, 7], length: { min: 7, max: 7 } },
      currency: { international: 'KMF', symbol: 'CF', icon: 'tabler:currency-frank' },
    },
    CG: {
      name: 'Congo',
      phone: { code: 242, start: [0, 5, 6], length: { min: 9, max: 9 } },
      currency: { international: 'XAF', symbol: 'FCFA', icon: 'tabler:currency-frank' },
    },
    CD: {
      name: 'Congo (Democratic Republic)',
      phone: { code: 243, start: [8, 9], length: { min: 9, max: 9 } },
      currency: { international: 'CDF', symbol: 'FC', icon: 'tabler:currency-frank' },
    },
    CK: {
      name: 'Cook Islands',
      phone: { code: 2682, start: [5], length: { min: 5, max: 5 } },
      currency: { international: 'NZD', symbol: 'NZ$', icon: 'mdi:currency-usd' },
    },
    CR: {
      name: 'Costa Rica',
      phone: { code: 506, start: [8], length: { min: 8, max: 8 } },
      currency: { international: 'CRC', symbol: '₡', icon: 'tabler:currency-colon' },
    },
    CI: {
      name: 'Cote-d-Ivoire',
      phone: { code: 225, start: [0, 4, 5, 6], length: { min: 10, max: 10 } },
      currency: { international: 'XOF', symbol: 'CFA', icon: 'tabler:currency-frank' },
    },
    HR: {
      name: 'Croatia',
      phone: { code: 385, start: [9], length: { min: 8, max: 9 } },
      currency: { international: 'HRK', symbol: 'kn', icon: 'tabler:currency-kuna' },
    },
    CU: {
      name: 'Cuba',
      phone: { code: 53, start: [5], length: { min: 8, max: 8 } },
      currency: { international: 'CUP', symbol: '₱', icon: 'tabler:currency-peso' },
    },
    CW: {
      name: 'Curaçao',
      phone: { code: 599, start: [9], length: { min: 7, max: 7 } },
      currency: { international: 'ANG', symbol: 'ƒ', icon: 'tabler:currency-florin' },
    },
    CY: {
      name: 'Cyprus',
      phone: { code: 357, start: [9], length: { min: 8, max: 8 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    CZ: {
      name: 'Czech Republic',
      phone: { code: 420, start: [6], length: { min: 9, max: 9 } },
      currency: { international: 'CZK', symbol: 'Kč', icon: 'tabler:currency-krone-czech' },
    },
    DK: {
      name: 'Denmark',
      phone: { code: 45, start: [2, 3], length: { min: 8, max: 8 } },
      currency: { international: 'DKK', symbol: 'kr', icon: 'tabler:currency-krone-danish' },
    },
    DJ: {
      name: 'Djibouti',
      phone: { code: 253, start: [7], length: { min: 8, max: 8 } },
      currency: { international: 'DJF', symbol: 'Fdj', icon: 'tabler:currency-frank' },
    },
    DM: {
      name: 'Dominica',
      phone: { code: 1767, start: [2, 3], length: { min: 7, max: 7 } },
      currency: { international: 'XCD', symbol: '$', icon: 'mdi:currency-usd' },
    },
    DO: {
      name: 'Dominican Republic',
      phone: { code: 1809, start: [8], length: { min: 10, max: 10 } },
      currency: { international: 'DOP', symbol: 'RD$', icon: 'tabler:currency-peso' },
    },
    EC: {
      name: 'Ecuador',
      phone: { code: 593, start: [9], length: { min: 9, max: 9 } },
      currency: { international: 'USD', symbol: '$', icon: 'mdi:currency-usd' },
    },
    EG: {
      name: 'Egypt',
      phone: { code: 20, start: [1], length: { min: 10, max: 11 } },
      currency: { international: 'EGP', symbol: '£', icon: 'tabler:currency-pound' },
    },
    SV: {
      name: 'El Salvador',
      phone: { code: 503, start: [7], length: { min: 8, max: 8 } },
      currency: { international: 'USD', symbol: '$', icon: 'mdi:currency-usd' },
    },
    GQ: {
      name: 'Equatorial Guinea',
      phone: { code: 240, start: [2], length: { min: 9, max: 9 } },
      currency: { international: 'XAF', symbol: 'FCFA', icon: 'tabler:currency-frank' },
    },
    ER: {
      name: 'Eritrea',
      phone: { code: 291, start: [7], length: { min: 7, max: 7 } },
      currency: { international: 'ERN', symbol: 'Nfk', icon: 'tabler:currency-nakfa' },
    },
    EE: {
      name: 'Estonia',
      phone: { code: 372, start: [5], length: { min: 7, max: 8 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    SZ: {
      name: 'Eswatini',
      phone: { code: 268, start: [7], length: { min: 8, max: 8 } },
      currency: { international: 'SZL', symbol: 'E', icon: 'tabler:currency-lilangeni' },
    },
    ET: {
      name: 'Ethiopia',
      phone: { code: 251, start: [9], length: { min: 9, max: 9 } },
      currency: { international: 'ETB', symbol: 'Br' },
    },
    FK: {
      name: 'Falkland Islands',
      phone: { code: 500, start: [5], length: { min: 5, max: 5 } },
      currency: { international: 'FKP', symbol: '£', icon: 'tabler:currency-pound' },
    },
    FO: {
      name: 'Faroe Islands',
      phone: { code: 298, start: [2], length: { min: 6, max: 6 } },
      currency: { international: 'DKK', symbol: 'kr', icon: 'tabler:currency-krone-danish' },
    },
    FJ: {
      name: 'Fiji',
      phone: { code: 679, start: [7, 9], length: { min: 7, max: 7 } },
      currency: { international: 'FJD', symbol: 'FJ$', icon: 'mdi:currency-usd' },
    },
    FI: {
      name: 'Finland',
      phone: { code: 358, start: [4, 5], length: { min: 9, max: 10 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    FR: {
      name: 'France',
      phone: { code: 33, start: [6], length: { min: 10, max: 10 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    GF: {
      name: 'French Guiana',
      phone: { code: 594, start: [6], length: { min: 10, max: 10 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    PF: {
      name: 'French Polynesia',
      phone: { code: 689, start: [8], length: { min: 8, max: 8 } },
      currency: { international: 'XPF', symbol: '₣', icon: 'tabler:currency-frank' },
    },
    GA: {
      name: 'Gabon',
      phone: { code: 241, start: [6], length: { min: 7, max: 8 } },
      currency: { international: 'XAF', symbol: 'FCFA', icon: 'tabler:currency-frank' },
    },
    GM: {
      name: 'Gambia',
      phone: { code: 220, start: [7, 9], length: { min: 7, max: 7 } },
      currency: { international: 'GMD', symbol: 'D', icon: 'tabler:currency-dalasi' },
    },
    GE: {
      name: 'Georgia',
      phone: { code: 995, start: [5], length: { min: 9, max: 9 } },
      currency: { international: 'GEL', symbol: '₾', icon: 'tabler:currency-lari' },
    },
    DE: {
      name: 'Germany',
      phone: { code: 49, start: [1], length: { min: 10, max: 11 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    GH: {
      name: 'Ghana',
      phone: { code: 233, start: [2], length: { min: 9, max: 9 } },
      currency: { international: 'GHS', symbol: 'GH₵', icon: 'tabler:currency-cedi' },
    },
    GI: {
      name: 'Gibraltar',
      phone: { code: 350, start: [5], length: { min: 8, max: 8 } },
      currency: { international: 'GIP', symbol: '£', icon: 'tabler:currency-pound' },
    },
    GR: {
      name: 'Greece',
      phone: { code: 30, start: [6], length: { min: 10, max: 10 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    GL: {
      name: 'Greenland',
      phone: { code: 299, start: [2, 5], length: { min: 6, max: 6 } },
      currency: { international: 'DKK', symbol: 'kr', icon: 'tabler:currency-krone-danish' },
    },
    GD: {
      name: 'Grenada',
      phone: { code: 1473, start: [4], length: { min: 7, max: 7 } },
      currency: { international: 'XCD', symbol: '$', icon: 'mdi:currency-usd' },
    },
    GP: {
      name: 'Guadeloupe',
      phone: { code: 590, start: [6], length: { min: 10, max: 10 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    GU: {
      name: 'Guam',
      phone: { code: 1671, start: [6, 7], length: { min: 7, max: 7 } },
      currency: { international: 'USD', symbol: '$', icon: 'mdi:currency-usd' },
    },
    GG: {
      name: 'Guernsey',
      phone: { code: 44, start: [1], length: { min: 10, max: 10 } },
      currency: { international: 'GBP', symbol: '£', icon: 'tabler:currency-pound' },
    },
    GT: {
      name: 'Guatemala',
      phone: { code: 502, start: [4, 5], length: { min: 8, max: 8 } },
      currency: { international: 'GTQ', symbol: 'Q', icon: 'tabler:currency-quetzal' },
    },
    GN: {
      name: 'Guinea',
      phone: { code: 224, start: [6], length: { min: 9, max: 9 } },
      currency: { international: 'GNF', symbol: 'FG', icon: 'tabler:currency-frank' },
    },
    GW: {
      name: 'Guinea-Bissau',
      phone: { code: 245, start: [5, 6], length: { min: 7, max: 7 } },
      currency: { international: 'XOF', symbol: 'CFA', icon: 'tabler:currency-frank' },
    },
    GY: {
      name: 'Guyana',
      phone: { code: 592, start: [6], length: { min: 7, max: 7 } },
      currency: { international: 'GYD', symbol: 'G$', icon: 'mdi:currency-usd' },
    },
    HT: {
      name: 'Haiti',
      phone: { code: 509, start: [3, 4], length: { min: 8, max: 8 } },
      currency: { international: 'HTG', symbol: 'G', icon: 'tabler:currency-gourde' },
    },
    HM: {
      name: 'Heard Island and McDonald Islands',
      phone: { code: 61, start: [4], length: { min: 9, max: 9 } },
      currency: { international: 'AUD', symbol: 'A$', icon: 'mdi:currency-usd' },
    },
    VA: {
      name: 'Holy See',
      phone: { code: 3906, start: [6], length: { min: 8, max: 11 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    HN: {
      name: 'Honduras',
      phone: { code: 504, start: [9], length: { min: 8, max: 8 } },
      currency: { international: 'HNL', symbol: 'L', icon: 'tabler:currency-lempira' },
    },
    HK: {
      name: 'Hong Kong',
      phone: { code: 852, start: [5, 6, 9], length: { min: 8, max: 8 } },
      currency: { international: 'HKD', symbol: 'HK$', icon: 'mdi:currency-usd' },
    },
    HU: {
      name: 'Hungary',
      phone: { code: 36, start: [2, 3], length: { min: 8, max: 9 } },
      currency: { international: 'HUF', symbol: 'Ft', icon: 'tabler:currency-forint' },
    },
    IS: {
      name: 'Iceland',
      phone: { code: 354, start: [6], length: { min: 7, max: 7 } },
      currency: { international: 'ISK', symbol: 'kr' },
    },
    IM: {
      name: 'Isle of Man',
      phone: { code: 44, start: [1], length: { min: 10, max: 10 } },
      currency: { international: 'GBP', symbol: '£', icon: 'tabler:currency-pound' },
    },
    IN: {
      name: 'India',
      phone: { code: 91, start: [6, 7, 8, 9], length: { min: 10, max: 10 } },
      currency: { international: 'INR', symbol: '₹', icon: 'mdi:currency-inr' },
    },
    ID: {
      name: 'Indonesia',
      phone: { code: 62, start: [8], length: { min: 9, max: 12 } },
      currency: { international: 'IDR', symbol: 'Rp', icon: 'tabler:currency-rupee' },
    },
    IR: {
      name: 'Iran',
      phone: { code: 98, start: [9], length: { min: 10, max: 10 } },
      currency: { international: 'IRR', symbol: '﷼', icon: 'tabler:currency-riyal' },
    },
    IQ: {
      name: 'Iraq',
      phone: { code: 964, start: [7], length: { min: 10, max: 10 } },
      currency: { international: 'IQD', symbol: 'ع.د', icon: 'tabler:currency-dinar' },
    },
    IE: {
      name: 'Ireland',
      phone: { code: 353, start: [8], length: { min: 9, max: 9 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    IT: {
      name: 'Italy',
      phone: { code: 39, start: [3], length: { min: 9, max: 11 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    JM: {
      name: 'Jamaica',
      phone: { code: 1876, start: [8], length: { min: 7, max: 7 } },
      currency: { international: 'JMD', symbol: 'J$', icon: 'mdi:currency-usd' },
    },
    JP: {
      name: 'Japan',
      phone: { code: 81, start: [7, 8, 9], length: { min: 10, max: 11 } },
      currency: { international: 'JPY', symbol: '¥', icon: 'mdi:currency-jpy' },
    },
    JE: {
      name: 'Jersey',
      phone: { code: 44, start: [1], length: { min: 10, max: 10 } },
      currency: { international: 'GBP', symbol: '£', icon: 'tabler:currency-pound' },
    },
    JO: {
      name: 'Jordan',
      phone: { code: 962, start: [7], length: { min: 9, max: 9 } },
      currency: { international: 'JOD', symbol: 'د.ا', icon: 'tabler:currency-dinar' },
    },
    KZ: {
      name: 'Kazakhstan',
      phone: { code: 7, start: [7], length: { min: 10, max: 10 } },
      currency: { international: 'KZT', symbol: '₸', icon: 'mdi:currency-kzt' },
    },
    KE: {
      name: 'Kenya',
      phone: { code: 254, start: [7], length: { min: 9, max: 9 } },
      currency: { international: 'KES', symbol: 'KSh', icon: 'tabler:currency-shilling' },
    },
    KI: {
      name: 'Kiribati',
      phone: { code: 686, start: [7], length: { min: 8, max: 8 } },
      currency: { international: 'AUD', symbol: 'A$', icon: 'mdi:currency-usd' },
    },
    KP: {
      name: 'North Korea',
      phone: { code: 850, start: [1], length: { min: 8, max: 12 } },
      currency: { international: 'KPW', symbol: '₩', icon: 'tabler:currency-won' },
    },
    KR: {
      name: 'South Korea',
      phone: { code: 82, start: [1], length: { min: 9, max: 10 } },
      currency: { international: 'KRW', symbol: '₩', icon: 'mdi:currency-krw' },
    },
    KW: {
      name: 'Kuwait',
      phone: { code: 965, start: [5, 6, 9], length: { min: 8, max: 8 } },
      currency: { international: 'KWD', symbol: 'د.ك', icon: 'tabler:currency-dinar' },
    },
    KG: {
      name: 'Kyrgyzstan',
      phone: { code: 996, start: [5, 7], length: { min: 9, max: 9 } },
      currency: { international: 'KGS', symbol: 'с', icon: 'tabler:currency-som' },
    },
    LA: {
      name: 'Laos',
      phone: { code: 856, start: [2], length: { min: 8, max: 10 } },
      currency: { international: 'LAK', symbol: '₭', icon: 'tabler:currency-kip' },
    },
    LV: {
      name: 'Latvia',
      phone: { code: 371, start: [2], length: { min: 8, max: 8 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    LB: {
      name: 'Lebanon',
      phone: { code: 961, start: [3, 7], length: { min: 7, max: 8 } },
      currency: { international: 'LBP', symbol: 'ل.ل', icon: 'tabler:currency-pound' },
    },
    LS: {
      name: 'Lesotho',
      phone: { code: 266, start: [5], length: { min: 8, max: 8 } },
      currency: { international: 'LSL', symbol: 'M', icon: 'tabler:currency-loti' },
    },
    LR: {
      name: 'Liberia',
      phone: { code: 231, start: [7], length: { min: 7, max: 8 } },
      currency: { international: 'LRD', symbol: 'L$', icon: 'mdi:currency-usd' },
    },
    LY: {
      name: 'Libya',
      phone: { code: 218, start: [9], length: { min: 10, max: 10 } },
      currency: { international: 'LYD', symbol: 'ل.د', icon: 'tabler:currency-dinar' },
    },
    LI: {
      name: 'Liechtenstein',
      phone: { code: 423, start: [7], length: { min: 7, max: 7 } },
      currency: { international: 'CHF', symbol: 'CHF', icon: 'tabler:currency-frank' },
    },
    LT: {
      name: 'Lithuania',
      phone: { code: 370, start: [6], length: { min: 8, max: 8 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    LU: {
      name: 'Luxembourg',
      phone: { code: 352, start: [6], length: { min: 9, max: 9 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    MO: {
      name: 'Macau',
      phone: { code: 853, start: [6], length: { min: 8, max: 8 } },
      currency: { international: 'MOP', symbol: 'MOP$' },
    },
    MP: {
      name: 'Northern Mariana Islands',
      phone: { code: 1670, start: [2, 3, 4, 5, 6, 7, 8, 9], length: { min: 10, max: 10 } },
      currency: { international: 'USD', symbol: '$', icon: 'mdi:currency-usd' },
    },
    MK: {
      name: 'North Macedonia',
      phone: { code: 389, start: [7], length: { min: 8, max: 8 } },
      currency: { international: 'MKD', symbol: 'ден' },
    },
    MG: {
      name: 'Madagascar',
      phone: { code: 261, start: [3], length: { min: 9, max: 10 } },
      currency: { international: 'MGA', symbol: 'Ar' },
    },
    MW: {
      name: 'Malawi',
      phone: { code: 265, start: [8, 9], length: { min: 9, max: 9 } },
      currency: { international: 'MWK', symbol: 'MK', icon: 'tabler:currency-kwacha' },
    },
    MY: {
      name: 'Malaysia',
      phone: { code: 60, start: [1], length: { min: 9, max: 10 } },
      currency: { international: 'MYR', symbol: 'RM' },
    },
    MV: {
      name: 'Maldives',
      phone: { code: 960, start: [7, 9], length: { min: 7, max: 7 } },
      currency: { international: 'MVR', symbol: 'Rf', icon: 'tabler:currency-rufiyaa' },
    },
    ML: {
      name: 'Mali',
      phone: { code: 223, start: [6, 7], length: { min: 8, max: 8 } },
      currency: { international: 'XOF', symbol: 'CFA', icon: 'tabler:currency-frank' },
    },
    MT: {
      name: 'Malta',
      phone: { code: 356, start: [7, 9], length: { min: 8, max: 8 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    MH: {
      name: 'Marshall Islands',
      phone: { code: 692, start: [4], length: { min: 7, max: 7 } },
      currency: { international: 'USD', symbol: '$', icon: 'mdi:currency-usd' },
    },
    MQ: {
      name: 'Martinique',
      phone: { code: 596, start: [6], length: { min: 10, max: 10 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    MR: {
      name: 'Mauritania',
      phone: { code: 222, start: [3, 4], length: { min: 8, max: 8 } },
      currency: { international: 'MRU', symbol: 'UM' },
    },
    MU: {
      name: 'Mauritius',
      phone: { code: 230, start: [5], length: { min: 8, max: 8 } },
      currency: { international: 'MUR', symbol: '₨', icon: 'tabler:currency-rupee' },
    },
    YT: {
      name: 'Mayotte',
      phone: { code: 269, start: [3], length: { min: 9, max: 9 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    MX: {
      name: 'Mexico',
      phone: { code: 52, start: [1], length: { min: 10, max: 10 } },
      currency: { international: 'MXN', symbol: '$', icon: 'tabler:currency-peso' },
    },
    FM: {
      name: 'Micronesia',
      phone: { code: 691, start: [3], length: { min: 7, max: 7 } },
      currency: { international: 'USD', symbol: '$', icon: 'mdi:currency-usd' },
    },
    MD: {
      name: 'Moldova',
      phone: { code: 373, start: [6, 7], length: { min: 8, max: 8 } },
      currency: { international: 'MDL', symbol: 'L', icon: 'tabler:currency-leu' },
    },
    MC: {
      name: 'Monaco',
      phone: { code: 377, start: [6], length: { min: 8, max: 9 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    MN: {
      name: 'Mongolia',
      phone: { code: 976, start: [8, 9], length: { min: 8, max: 8 } },
      currency: { international: 'MNT', symbol: '₮', icon: 'tabler:currency-tugrik' },
    },
    ME: {
      name: 'Montenegro',
      phone: { code: 382, start: [6], length: { min: 8, max: 8 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    MS: {
      name: 'Montserrat',
      phone: { code: 1664, start: [4], length: { min: 7, max: 7 } },
      currency: { international: 'XCD', symbol: '$', icon: 'mdi:currency-usd' },
    },
    MA: {
      name: 'Morocco',
      phone: { code: 212, start: [6], length: { min: 9, max: 9 } },
      currency: { international: 'MAD', symbol: 'د.م.', icon: 'tabler:currency-dirham' },
    },
    MZ: {
      name: 'Mozambique',
      phone: { code: 258, start: [8], length: { min: 9, max: 9 } },
      currency: { international: 'MZN', symbol: 'MT' },
    },
    MM: {
      name: 'Myanmar',
      phone: { code: 95, start: [9], length: { min: 8, max: 10 } },
      currency: { international: 'MMK', symbol: 'Ks' },
    },
    NA: {
      name: 'Namibia',
      phone: { code: 264, start: [8], length: { min: 9, max: 9 } },
      currency: { international: 'NAD', symbol: 'N$', icon: 'mdi:currency-usd' },
    },
    NR: {
      name: 'Nauru',
      phone: { code: 687, start: [5], length: { min: 7, max: 7 } },
      currency: { international: 'AUD', symbol: 'A$', icon: 'mdi:currency-usd' },
    },
    NP: {
      name: 'Nepal',
      phone: { code: 977, start: [9], length: { min: 10, max: 10 } },
      currency: { international: 'NPR', symbol: '₨', icon: 'tabler:currency-rupee' },
    },
    NL: {
      name: 'Netherlands',
      phone: { code: 31, start: [6], length: { min: 9, max: 9 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    NC: {
      name: 'New Caledonia',
      phone: { code: 687, start: [7, 8], length: { min: 6, max: 6 } },
      currency: { international: 'XPF', symbol: '₣', icon: 'tabler:currency-frank' },
    },
    NZ: {
      name: 'New Zealand',
      phone: { code: 64, start: [2], length: { min: 8, max: 10 } },
      currency: { international: 'NZD', symbol: 'NZ$', icon: 'mdi:currency-usd' },
    },
    NI: {
      name: 'Nicaragua',
      phone: { code: 505, start: [8], length: { min: 8, max: 8 } },
      currency: { international: 'NIO', symbol: 'C$' },
    },
    NE: {
      name: 'Niger',
      phone: { code: 227, start: [9], length: { min: 8, max: 8 } },
      currency: { international: 'XOF', symbol: 'CFA', icon: 'tabler:currency-frank' },
    },
    NG: {
      name: 'Nigeria',
      phone: { code: 234, start: [7, 8, 9], length: { min: 10, max: 11 } },
      currency: { international: 'NGN', symbol: '₦', icon: 'mdi:currency-ngn' },
    },
    NU: {
      name: 'Niue',
      phone: { code: 683, start: [4], length: { min: 4, max: 4 } },
      currency: { international: 'NZD', symbol: 'NZ$', icon: 'mdi:currency-usd' },
    },
    NF: {
      name: 'Norfolk Island',
      phone: { code: 61, start: [4], length: { min: 9, max: 9 } },
      currency: { international: 'AUD', symbol: 'A$', icon: 'mdi:currency-usd' },
    },
    NO: {
      name: 'Norway',
      phone: { code: 47, start: [4], length: { min: 8, max: 8 } },
      currency: { international: 'NOK', symbol: 'kr' },
    },
    OM: {
      name: 'Oman',
      phone: { code: 968, start: [9], length: { min: 8, max: 8 } },
      currency: { international: 'OMR', symbol: 'ر.ع.', icon: 'tabler:currency-riyal' },
    },
    PK: {
      name: 'Pakistan',
      phone: { code: 92, start: [3], length: { min: 10, max: 10 } },
      currency: { international: 'PKR', symbol: '₨', icon: 'tabler:currency-rupee' },
    },
    PW: {
      name: 'Palau',
      phone: { code: 680, start: [7], length: { min: 7, max: 7 } },
      currency: { international: 'USD', symbol: '$', icon: 'mdi:currency-usd' },
    },
    PS: {
      name: 'Palestine',
      phone: { code: 970, start: [5], length: { min: 9, max: 9 } },
      currency: { international: 'ILS', symbol: '₪', icon: 'mdi:currency-ils' },
    },
    PA: {
      name: 'Panama',
      phone: { code: 507, start: [6], length: { min: 8, max: 8 } },
      currency: { international: 'USD', symbol: '$', icon: 'mdi:currency-usd' },
    },
    PG: {
      name: 'Papua New Guinea',
      phone: { code: 675, start: [7], length: { min: 8, max: 8 } },
      currency: { international: 'PGK', symbol: 'K' },
    },
    PY: {
      name: 'Paraguay',
      phone: { code: 595, start: [9], length: { min: 9, max: 9 } },
      currency: { international: 'PYG', symbol: '₲', icon: 'tabler:currency-guarani' },
    },
    PE: {
      name: 'Peru',
      phone: { code: 51, start: [9], length: { min: 9, max: 9 } },
      currency: { international: 'PEN', symbol: 'S/', icon: 'tabler:currency-sol' },
    },
    PH: {
      name: 'Philippines',
      phone: { code: 63, start: [9], length: { min: 10, max: 10 } },
      currency: { international: 'PHP', symbol: '₱', icon: 'mdi:currency-php' },
    },
    PL: {
      name: 'Poland',
      phone: { code: 48, start: [5], length: { min: 9, max: 9 } },
      currency: { international: 'PLN', symbol: 'zł', icon: 'tabler:currency-zloty' },
    },
    PT: {
      name: 'Portugal',
      phone: { code: 351, start: [9], length: { min: 9, max: 9 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    PR: {
      name: 'Puerto Rico',
      phone: { code: 1787, start: [7], length: { min: 10, max: 10 } },
      currency: { international: 'USD', symbol: '$', icon: 'mdi:currency-usd' },
    },
    QA: {
      name: 'Qatar',
      phone: { code: 974, start: [3, 5, 6, 7], length: { min: 8, max: 8 } },
      currency: { international: 'QAR', symbol: 'ر.ق', icon: 'tabler:currency-riyal' },
    },
    RE: {
      name: 'Réunion',
      phone: { code: 262, start: [6], length: { min: 10, max: 10 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    RO: {
      name: 'Romania',
      phone: { code: 40, start: [7], length: { min: 9, max: 9 } },
      currency: { international: 'RON', symbol: 'lei', icon: 'tabler:currency-leu' },
    },
    RU: {
      name: 'Russia',
      phone: { code: 7, start: [9], length: { min: 10, max: 10 } },
      currency: { international: 'RUB', symbol: '₽', icon: 'mdi:currency-rub' },
    },
    RW: {
      name: 'Rwanda',
      phone: { code: 250, start: [7], length: { min: 9, max: 9 } },
      currency: { international: 'RWF', symbol: 'FRw', icon: 'tabler:currency-frank' },
    },
    BL: {
      name: 'Saint Barthélemy',
      phone: { code: 590, start: [6], length: { min: 10, max: 10 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    SH: {
      name: 'Saint Helena',
      phone: { code: 290, start: [4], length: { min: 4, max: 4 } },
      currency: { international: 'SHP', symbol: '£', icon: 'tabler:currency-pound' },
    },
    KN: {
      name: 'Saint Kitts and Nevis',
      phone: { code: 1869, start: [6], length: { min: 7, max: 7 } },
      currency: { international: 'XCD', symbol: '$', icon: 'mdi:currency-usd' },
    },
    LC: {
      name: 'Saint Lucia',
      phone: { code: 1758, start: [5, 7], length: { min: 7, max: 7 } },
      currency: { international: 'XCD', symbol: '$', icon: 'mdi:currency-usd' },
    },
    MF: {
      name: 'Saint Martin',
      phone: { code: 590, start: [6], length: { min: 10, max: 10 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    PM: {
      name: 'Saint Pierre and Miquelon',
      phone: { code: 508, start: [4], length: { min: 6, max: 6 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    VC: {
      name: 'Saint Vincent and the Grenadines',
      phone: { code: 1784, start: [4], length: { min: 7, max: 7 } },
      currency: { international: 'XCD', symbol: '$', icon: 'mdi:currency-usd' },
    },
    WS: {
      name: 'Samoa',
      phone: { code: 684, start: [7], length: { min: 7, max: 7 } },
      currency: { international: 'WST', symbol: 'T' },
    },
    SM: {
      name: 'San Marino',
      phone: { code: 378, start: [3], length: { min: 6, max: 10 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    SA: {
      name: 'Saudi Arabia',
      phone: { code: 966, start: [5], length: { min: 9, max: 9 } },
      currency: { international: 'SAR', symbol: 'ر.س', icon: 'lucide:saudi-riyal' },
    },
    SN: {
      name: 'Senegal',
      phone: { code: 221, start: [7], length: { min: 9, max: 9 } },
      currency: { international: 'XOF', symbol: 'CFA', icon: 'tabler:currency-frank' },
    },
    RS: {
      name: 'Serbia',
      phone: { code: 381, start: [6], length: { min: 8, max: 9 } },
      currency: { international: 'RSD', symbol: 'дин.', icon: 'tabler:currency-dinar' },
    },
    SC: {
      name: 'Seychelles',
      phone: { code: 248, start: [2], length: { min: 7, max: 7 } },
      currency: { international: 'SCR', symbol: '₨', icon: 'tabler:currency-rupee' },
    },
    SL: {
      name: 'Sierra Leone',
      phone: { code: 232, start: [7, 9], length: { min: 8, max: 8 } },
      currency: { international: 'SLE', symbol: 'Le' },
    },
    SG: {
      name: 'Singapore',
      phone: { code: 65, start: [8, 9], length: { min: 8, max: 8 } },
      currency: { international: 'SGD', symbol: 'S$', icon: 'mdi:currency-usd' },
    },
    SX: {
      name: 'Sint Maarten',
      phone: { code: 599, start: [5], length: { min: 7, max: 7 } },
      currency: { international: 'ANG', symbol: 'ƒ', icon: 'tabler:currency-florin' },
    },
    SK: {
      name: 'Slovakia',
      phone: { code: 421, start: [9], length: { min: 9, max: 9 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    SI: {
      name: 'Slovenia',
      phone: { code: 386, start: [3, 4], length: { min: 8, max: 8 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    SB: {
      name: 'Solomon Islands',
      phone: { code: 677, start: [7], length: { min: 7, max: 7 } },
      currency: { international: 'SBD', symbol: 'SI$', icon: 'mdi:currency-usd' },
    },
    SO: {
      name: 'Somalia',
      phone: { code: 252, start: [6], length: { min: 8, max: 9 } },
      currency: { international: 'SOS', symbol: 'S', icon: 'tabler:currency-shilling' },
    },
    ZA: {
      name: 'South Africa',
      phone: { code: 27, start: [6, 7, 8], length: { min: 9, max: 9 } },
      currency: { international: 'ZAR', symbol: 'R', icon: 'tabler:currency-rand' },
    },
    GS: {
      name: 'South Georgia and the South Sandwich Islands',
      phone: { code: 400, start: [0], length: { min: 5, max: 5 } },
      currency: { international: 'GBP', symbol: '£', icon: 'tabler:currency-pound' },
    },
    ES: {
      name: 'Spain',
      phone: { code: 34, start: [6], length: { min: 9, max: 9 } },
      currency: { international: 'EUR', symbol: '€', icon: 'mdi:currency-eur' },
    },
    LK: {
      name: 'Sri Lanka',
      phone: { code: 94, start: [7], length: { min: 9, max: 9 } },
      currency: { international: 'LKR', symbol: 'Rs', icon: 'tabler:currency-rupee' },
    },
    SD: {
      name: 'Sudan',
      phone: { code: 249, start: [9], length: { min: 9, max: 9 } },
      currency: { international: 'SDG', symbol: 'ج.س.', icon: 'tabler:currency-pound' },
    },
    SR: {
      name: 'Suriname',
      phone: { code: 597, start: [7, 8], length: { min: 7, max: 7 } },
      currency: { international: 'SRD', symbol: '$', icon: 'mdi:currency-usd' },
    },
    ST: {
      name: 'São Tomé and Príncipe',
      phone: { code: 239, start: [2], length: { min: 7, max: 7 } },
      currency: { international: 'STN', symbol: 'Db' },
    },
    SJ: {
      name: 'Svalbard and Jan Mayen',
      phone: { code: 47, start: [4], length: { min: 8, max: 8 } },
      currency: { international: 'NOK', symbol: 'kr' },
    },
    SE: {
      name: 'Sweden',
      phone: { code: 46, start: [7], length: { min: 9, max: 9 } },
      currency: { international: 'SEK', symbol: 'kr', icon: 'tabler:currency-krone-swedish' },
    },
    CH: {
      name: 'Switzerland',
      phone: { code: 41, start: [7], length: { min: 9, max: 9 } },
      currency: { international: 'CHF', symbol: 'CHF', icon: 'tabler:currency-frank' },
    },
    SY: {
      name: 'Syria',
      phone: { code: 963, start: [9], length: { min: 9, max: 9 } },
      currency: { international: 'SYP', symbol: 'ل.س', icon: 'tabler:currency-pound' },
    },
    TW: {
      name: 'Taiwan',
      phone: { code: 886, start: [9], length: { min: 9, max: 9 } },
      currency: { international: 'TWD', symbol: 'NT$', icon: 'mdi:currency-twd' },
    },
    TJ: {
      name: 'Tajikistan',
      phone: { code: 992, start: [9], length: { min: 9, max: 9 } },
      currency: { international: 'TJS', symbol: 'SM' },
    },
    TZ: {
      name: 'Tanzania',
      phone: { code: 255, start: [7], length: { min: 9, max: 9 } },
      currency: { international: 'TZS', symbol: 'TSh', icon: 'tabler:currency-shilling' },
    },
    TH: {
      name: 'Thailand',
      phone: { code: 66, start: [8, 9], length: { min: 9, max: 9 } },
      currency: { international: 'THB', symbol: '฿', icon: 'mdi:currency-thb' },
    },
    TL: {
      name: 'Timor-Leste',
      phone: { code: 670, start: [7], length: { min: 8, max: 8 } },
      currency: { international: 'USD', symbol: '$', icon: 'mdi:currency-usd' },
    },
    TG: {
      name: 'Togo',
      phone: { code: 228, start: [9], length: { min: 8, max: 8 } },
      currency: { international: 'XOF', symbol: 'CFA', icon: 'tabler:currency-frank' },
    },
    TK: {
      name: 'Tokelau',
      phone: { code: 690, start: [7], length: { min: 4, max: 4 } },
      currency: { international: 'NZD', symbol: 'NZ$', icon: 'mdi:currency-usd' },
    },
    TO: {
      name: 'Tonga',
      phone: { code: 676, start: [7], length: { min: 7, max: 7 } },
      currency: { international: 'TOP', symbol: 'T$', icon: 'tabler:currency-paanga' },
    },
    TT: {
      name: 'Trinidad and Tobago',
      phone: { code: 1868, start: [7], length: { min: 7, max: 7 } },
      currency: { international: 'TTD', symbol: 'TT$', icon: 'mdi:currency-usd' },
    },
    TN: {
      name: 'Tunisia',
      phone: { code: 216, start: [2, 9], length: { min: 8, max: 8 } },
      currency: { international: 'TND', symbol: 'د.ت', icon: 'tabler:currency-dinar' },
    },
    TR: {
      name: 'Turkey',
      phone: { code: 90, start: [5], length: { min: 10, max: 10 } },
      currency: { international: 'TRY', symbol: '₺', icon: 'mdi:currency-try' },
    },
    TM: {
      name: 'Turkmenistan',
      phone: { code: 993, start: [6], length: { min: 8, max: 8 } },
      currency: { international: 'TMT', symbol: 'm', icon: 'tabler:currency-manat' },
    },
    TC: {
      name: 'Turks and Caicos Islands',
      phone: { code: 1649, start: [2, 3], length: { min: 7, max: 7 } },
      currency: { international: 'USD', symbol: '$', icon: 'mdi:currency-usd' },
    },
    TV: {
      name: 'Tuvalu',
      phone: { code: 688, start: [7], length: { min: 7, max: 7 } },
      currency: { international: 'AUD', symbol: 'A$', icon: 'mdi:currency-usd' },
    },
    UG: {
      name: 'Uganda',
      phone: { code: 256, start: [7], length: { min: 9, max: 9 } },
      currency: { international: 'UGX', symbol: 'USh', icon: 'tabler:currency-shilling' },
    },
    UA: {
      name: 'Ukraine',
      phone: { code: 380, start: [5, 6, 7, 9], length: { min: 9, max: 9 } },
      currency: { international: 'UAH', symbol: '₴', icon: 'mdi:currency-uah' },
    },
    AE: {
      name: 'United Arab Emirates',
      phone: { code: 971, start: [5], length: { min: 9, max: 9 } },
      currency: { international: 'AED', symbol: 'د.إ', icon: 'tabler:currency-dirham' },
    },
    GB: {
      name: 'United Kingdom',
      phone: { code: 44, start: [7], length: { min: 10, max: 10 } },
      currency: { international: 'GBP', symbol: '£', icon: 'tabler:currency-pound' },
    },
    US: {
      name: 'United States',
      phone: { code: 1, start: [2, 3, 4, 5], length: { min: 10, max: 10 } },
      currency: { international: 'USD', symbol: '$', icon: 'mdi:currency-usd' },
    },
    UY: {
      name: 'Uruguay',
      phone: { code: 598, start: [9], length: { min: 8, max: 9 } },
      currency: { international: 'UYU', symbol: '$U', icon: 'tabler:currency-peso' },
    },
    UZ: {
      name: 'Uzbekistan',
      phone: { code: 998, start: [9], length: { min: 9, max: 9 } },
      currency: { international: 'UZS', symbol: "so'm", icon: 'tabler:currency-som' },
    },
    VU: {
      name: 'Vanuatu',
      phone: { code: 678, start: [5, 7], length: { min: 7, max: 7 } },
      currency: { international: 'VUV', symbol: 'Vt' },
    },
    VE: {
      name: 'Venezuela',
      phone: { code: 58, start: [4], length: { min: 10, max: 11 } },
      currency: { international: 'VES', symbol: 'Bs.S' },
    },
    VN: {
      name: 'Vietnam',
      phone: { code: 84, start: [3, 5, 7, 8, 9], length: { min: 9, max: 10 } },
      currency: { international: 'VND', symbol: '₫', icon: 'mdi:currency-vnd' },
    },
    WF: {
      name: 'Wallis and Futuna',
      phone: { code: 681, start: [7], length: { min: 6, max: 6 } },
      currency: { international: 'XPF', symbol: '₣', icon: 'tabler:currency-frank' },
    },
    EH: {
      name: 'Western Sahara',
      phone: { code: 212, start: [6], length: { min: 9, max: 9 } },
      currency: { international: 'MAD', symbol: 'د.م.', icon: 'tabler:currency-dirham' },
    },
    YE: {
      name: 'Yemen',
      phone: { code: 967, start: [7], length: { min: 9, max: 9 } },
      currency: { international: 'YER', symbol: '﷼', icon: 'tabler:currency-riyal' },
    },
    ZM: {
      name: 'Zambia',
      phone: { code: 260, start: [9], length: { min: 9, max: 9 } },
      currency: { international: 'ZMW', symbol: 'ZK', icon: 'tabler:currency-kwacha' },
    },
    ZW: {
      name: 'Zimbabwe',
      phone: { code: 263, start: [7], length: { min: 9, max: 10 } },
      currency: { international: 'ZWL', symbol: 'Z$', icon: 'mdi:currency-usd' },
    },
  } as const
}

type CountriesProps = ReturnType<typeof Countries>

/** ISO-like country-code keys present in the static catalog. */
export type CountryType = keyof CountriesProps
type ExtractedCountryCurrency = CountriesProps[CountryType]['currency']
type ExtractedCountryPhoneProps = CountriesProps[CountryType]['phone']

/**
 * Filters and optional additions accepted by the country lookup helpers.
 *
 * `only` is applied before `except`; both filters use country-code values.
 * `extra` is shallow-merged into each returned country object.
 */
export type GetCountries<T extends object = object> = {
  extra?: Partial<Record<CountryType, T>>
  only?: CountryType[]
  except?: CountryType[]
}

/**
 * Returns country lookup helpers.
 *
 * @returns `getAllCountries` and `getCountry`.
 * @remarks `getAllCountries` returns all catalog entries sorted by name unless
 * filtered. `getCountry` returns an empty cast object when its key is nullish
 * and otherwise returns the selected country plus optional extras. Both
 * helpers are synchronous.
 */
export function useCountries() {
  const countries = Countries()

  const getAllCountries = <T extends object = object>(props?: GetCountries<T>): (CountryProps & T)[] => {
    const { only = [], extra, except = [] } = props ?? {}

    let countriesList = Object.entries(countries).map(([code, country]) => ({
      code: code as CountryType,
      ...country,
      ...extra?.[code as CountryType],
    })) as (CountryProps & T)[]

    if (only.length > 0) countriesList = countriesList.filter(({ code }) => only.includes(code))
    if (except.length > 0) countriesList = countriesList.filter(({ code }) => !except.includes(code))

    return countriesList.sort((a, b) => String(a.name).localeCompare(String(b.name)))
  }

  const getCountry = <T extends object = object>(
    key: CountryType | undefined | null,
    props?: Pick<GetCountries<T>, 'extra'>
  ): CountryProps & T => {
    if (!key) return {} as CountryProps & T
    return { code: key, ...countries[key], ...props?.extra?.[key] } as CountryProps & T
  }

  return { getAllCountries, getCountry }
}

/**
 * Documentation metadata:
 * - Last documentation update: 2026-09-18
 * - Documentation audience: Developers and AI agents
 * - Evidence basis: Attached file + verified project context
 * - Documentation coverage: Complete
 * - Validation: Passed `git diff --check`, targeted Prettier, targeted ESLint, and `pnpm type:check`.
 * - Known limitations: Some catalog entries omit `currency.icon` at runtime even though `CountryCurrencyProps` declares it; phone rules are static metadata rather than complete validation.
 */
