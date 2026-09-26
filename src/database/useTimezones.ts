'use client'

import { useLoomoraConfig } from '../config/config-context'
import { CountryProps, CountryType, useCountries } from './index'

type TimezonesProps = ReturnType<typeof Timezones>
type TimezoneKey = keyof TimezonesProps
type TimezoneDefinition = TimezonesProps[TimezoneKey]

/** Keys available in the timezone catalog, plus `none` for optional form values. */
export type TimezoneType = TimezoneKey | 'none'

/** Region keys represented by the timezone catalog. */
export type TimeZoneRegionType = TimezoneDefinition['regionKey']

/** Alias using the conventional `Timezone` capitalization. */
export type TimezoneRegionType = TimeZoneRegionType

/** A timezone record enriched with its country and display labels. */
export type TimezoneProps = {
  key: TimezoneType
  name: string
  regionKey: TimeZoneRegionType
  region: string
  offset: number
  country: CountryProps
  fullName: string
  fullNameWithCountry: string
}

/** Timezones grouped by geographic region. */
export type TimezoneGroupedProps = {
  regionKey: TimeZoneRegionType
  region: string
  zones: TimezoneProps[]
}

/** Filters and optional shallow additions accepted by `getTimezones`. */
export type GetTimezones<T extends object = object> = {
  extra?: Partial<Record<TimezoneKey, T>>
  only?: TimezoneType[]
  except?: TimezoneType[]
}

/** Criteria accepted by the single-timezone lookup. */
export type TimezoneLookupProps = {
  key?: TimezoneType
  name?: string
  offset?: number
  countryCode?: CountryType
  returnError?: boolean
}

/** Static timezone metadata. Display names and region labels come from Loomora configuration. */
function Timezones() {
  return {
    // Africa
    'africa/cairo': { regionKey: 'africa', offset: 2, countryCode: 'EG' },
    'africa/casablanca': { regionKey: 'africa', offset: 1, countryCode: 'MA' },
    'africa/johannesburg': { regionKey: 'africa', offset: 2, countryCode: 'ZA' },
    'africa/lagos': { regionKey: 'africa', offset: 1, countryCode: 'NG' },
    'africa/nairobi': { regionKey: 'africa', offset: 3, countryCode: 'KE' },
    // America
    'america/new_york': { regionKey: 'america', offset: -5, countryCode: 'US' },
    'america/chicago': { regionKey: 'america', offset: -6, countryCode: 'US' },
    'america/denver': { regionKey: 'america', offset: -7, countryCode: 'US' },
    'america/los_angeles': { regionKey: 'america', offset: -8, countryCode: 'US' },
    'america/anchorage': { regionKey: 'america', offset: -9, countryCode: 'US' },
    'america/honolulu': { regionKey: 'america', offset: -10, countryCode: 'US' },
    'america/sao_paulo': { regionKey: 'america', offset: -3, countryCode: 'BR' },
    'america/argentina/buenos_aires': { regionKey: 'america', offset: -3, countryCode: 'AR' },
    'america/mexico_city': { regionKey: 'america', offset: -6, countryCode: 'MX' },
    'america/toronto': { regionKey: 'america', offset: -5, countryCode: 'CA' },
    'america/caracas': { regionKey: 'america', offset: -4.5, countryCode: 'VE' },
    'america/st_johns': { regionKey: 'america', offset: -3.5, countryCode: 'CA' },
    // Asia
    'asia/singapore': { regionKey: 'asia', offset: 8, countryCode: 'SG' },
    'asia/kuala_lumpur': { regionKey: 'asia', offset: 8, countryCode: 'MY' },
    'asia/bangkok': { regionKey: 'asia', offset: 7, countryCode: 'TH' },
    'asia/jakarta': { regionKey: 'asia', offset: 7, countryCode: 'ID' },
    'asia/manila': { regionKey: 'asia', offset: 8, countryCode: 'PH' },
    'asia/hong_kong': { regionKey: 'asia', offset: 8, countryCode: 'HK' },
    'asia/shanghai': { regionKey: 'asia', offset: 8, countryCode: 'CN' },
    'asia/tokyo': { regionKey: 'asia', offset: 9, countryCode: 'JP' },
    'asia/seoul': { regionKey: 'asia', offset: 9, countryCode: 'KR' },
    'asia/pyongyang': { regionKey: 'asia', offset: 8.5, countryCode: 'KP' },
    'asia/kolkata': { regionKey: 'asia', offset: 5.5, countryCode: 'IN' },
    'asia/dhaka': { regionKey: 'asia', offset: 6, countryCode: 'BD' },
    'asia/karachi': { regionKey: 'asia', offset: 5, countryCode: 'PK' },
    'asia/kabul': { regionKey: 'asia', offset: 4.5, countryCode: 'AF' },
    'asia/dubai': { regionKey: 'asia', offset: 4, countryCode: 'AE' },
    'asia/tehran': { regionKey: 'asia', offset: 3.5, countryCode: 'IR' },
    'asia/riyadh': { regionKey: 'asia', offset: 3, countryCode: 'SA' },
    'asia/damascus': { regionKey: 'asia', offset: 2, countryCode: 'SY' },
    'asia/kathmandu': { regionKey: 'asia', offset: 5.75, countryCode: 'NP' },
    'asia/yangon': { regionKey: 'asia', offset: 6.5, countryCode: 'MM' },
    'asia/almaty': { regionKey: 'asia', offset: 6, countryCode: 'KZ' },
    'asia/tashkent': { regionKey: 'asia', offset: 5, countryCode: 'UZ' },
    'asia/baku': { regionKey: 'asia', offset: 4, countryCode: 'AZ' },
    'asia/yerevan': { regionKey: 'asia', offset: 4, countryCode: 'AM' },
    'asia/tbilisi': { regionKey: 'asia', offset: 4, countryCode: 'GE' },
    // Australia
    'australia/sydney': { regionKey: 'australia', offset: 10, countryCode: 'AU' },
    'australia/melbourne': { regionKey: 'australia', offset: 10, countryCode: 'AU' },
    'australia/brisbane': { regionKey: 'australia', offset: 10, countryCode: 'AU' },
    'australia/perth': { regionKey: 'australia', offset: 8, countryCode: 'AU' },
    'australia/adelaide': { regionKey: 'australia', offset: 9.5, countryCode: 'AU' },
    'australia/darwin': { regionKey: 'australia', offset: 9.5, countryCode: 'AU' },
    'australia/eucla': { regionKey: 'australia', offset: 8.75, countryCode: 'AU' },
    'australia/lord_howe': { regionKey: 'australia', offset: 10.5, countryCode: 'AU' },
    // Europe
    'europe/london': { regionKey: 'europe', offset: 0, countryCode: 'GB' },
    'europe/paris': { regionKey: 'europe', offset: 1, countryCode: 'FR' },
    'europe/berlin': { regionKey: 'europe', offset: 1, countryCode: 'DE' },
    'europe/rome': { regionKey: 'europe', offset: 1, countryCode: 'IT' },
    'europe/madrid': { regionKey: 'europe', offset: 1, countryCode: 'ES' },
    'europe/amsterdam': { regionKey: 'europe', offset: 1, countryCode: 'NL' },
    'europe/brussels': { regionKey: 'europe', offset: 1, countryCode: 'BE' },
    'europe/zurich': { regionKey: 'europe', offset: 1, countryCode: 'CH' },
    'europe/vienna': { regionKey: 'europe', offset: 1, countryCode: 'AT' },
    'europe/prague': { regionKey: 'europe', offset: 1, countryCode: 'CZ' },
    'europe/warsaw': { regionKey: 'europe', offset: 1, countryCode: 'PL' },
    'europe/stockholm': { regionKey: 'europe', offset: 1, countryCode: 'SE' },
    'europe/oslo': { regionKey: 'europe', offset: 1, countryCode: 'NO' },
    'europe/helsinki': { regionKey: 'europe', offset: 2, countryCode: 'FI' },
    'europe/athens': { regionKey: 'europe', offset: 2, countryCode: 'GR' },
    'europe/bucharest': { regionKey: 'europe', offset: 2, countryCode: 'RO' },
    'europe/istanbul': { regionKey: 'europe', offset: 3, countryCode: 'TR' },
    'europe/moscow': { regionKey: 'europe', offset: 3, countryCode: 'RU' },
    'europe/kiev': { regionKey: 'europe', offset: 2, countryCode: 'UA' },
    'europe/minsk': { regionKey: 'europe', offset: 3, countryCode: 'BY' },
    'europe/dublin': { regionKey: 'europe', offset: 0, countryCode: 'IE' },
    'europe/lisbon': { regionKey: 'europe', offset: 0, countryCode: 'PT' },
    'europe/reykjavik': { regionKey: 'europe', offset: 0, countryCode: 'IS' },
    // Pacific
    'pacific/auckland': { regionKey: 'pacific', offset: 12, countryCode: 'NZ' },
    'pacific/fiji': { regionKey: 'pacific', offset: 12, countryCode: 'FJ' },
    'pacific/tahiti': { regionKey: 'pacific', offset: -10, countryCode: 'PF' },
    'pacific/marquesas': { regionKey: 'pacific', offset: -9.5, countryCode: 'PF' },
    'pacific/gambier': { regionKey: 'pacific', offset: -9, countryCode: 'PF' },
    'pacific/easter': { regionKey: 'pacific', offset: -6, countryCode: 'CL' },
    'pacific/galapagos': { regionKey: 'pacific', offset: -6, countryCode: 'EC' },
    'pacific/guadalcanal': { regionKey: 'pacific', offset: 11, countryCode: 'SB' },
    'pacific/noumea': { regionKey: 'pacific', offset: 11, countryCode: 'NC' },
    'pacific/port_moresby': { regionKey: 'pacific', offset: 10, countryCode: 'PG' },
    'pacific/guam': { regionKey: 'pacific', offset: 10, countryCode: 'GU' },
    'pacific/saipan': { regionKey: 'pacific', offset: 10, countryCode: 'MP' },
    'pacific/palau': { regionKey: 'pacific', offset: 9, countryCode: 'PW' },
    'pacific/chatham': { regionKey: 'pacific', offset: 12.75, countryCode: 'NZ' },
    'pacific/kiritimati': { regionKey: 'pacific', offset: 14, countryCode: 'KI' },
    'pacific/apia': { regionKey: 'pacific', offset: 13, countryCode: 'WS' },
    'pacific/tongatapu': { regionKey: 'pacific', offset: 13, countryCode: 'TO' },
    // Atlantic
    'atlantic/azores': { regionKey: 'atlantic', offset: -1, countryCode: 'PT' },
    'atlantic/cape_verde': { regionKey: 'atlantic', offset: -1, countryCode: 'CV' },
    'atlantic/canary': { regionKey: 'atlantic', offset: 0, countryCode: 'ES' },
    'atlantic/reykjavik': { regionKey: 'atlantic', offset: 0, countryCode: 'IS' },
    'atlantic/south_georgia': { regionKey: 'atlantic', offset: -2, countryCode: 'GS' },
    // Indian
    'indian/maldives': { regionKey: 'indian', offset: 5, countryCode: 'MV' },
    'indian/mauritius': { regionKey: 'indian', offset: 4, countryCode: 'MU' },
    'indian/reunion': { regionKey: 'indian', offset: 4, countryCode: 'RE' },
    'indian/seychelles': { regionKey: 'indian', offset: 4, countryCode: 'SC' },
    'indian/comoro': { regionKey: 'indian', offset: 3, countryCode: 'KM' },
    'indian/madagascar': { regionKey: 'indian', offset: 3, countryCode: 'MG' },
    'indian/mayotte': { regionKey: 'indian', offset: 3, countryCode: 'YT' },
    'indian/cocos': { regionKey: 'indian', offset: 6.5, countryCode: 'CC' },
    'indian/christmas': { regionKey: 'indian', offset: 7, countryCode: 'CX' },
  } as const
}

/** Returns timezone list, lookup, grouping, and conversion helpers. */
export function useTimezones() {
  const timezones = Timezones()
  const { timezones: timezoneConfig } = useLoomoraConfig()

  const { getCountry } = useCountries()

  const formatOffset = (offset: number) => `GMT${offset >= 0 ? '+' : ''}${offset}`

  const filterTimezones = <T extends object = object>(props?: GetTimezones<T>): (TimezoneProps & T)[] => {
    const { extra = {}, only = [], except = [] } = props ?? {}

    let list = Object.entries(timezones).map(([key, value]) => {
      const timezone = {
        key: key as TimezoneKey,
        ...value,
        ...timezoneConfig[key as TimezoneKey],
        country: getCountry(value.countryCode),
        ...extra[key as TimezoneKey],
      }

      return {
        ...timezone,
        fullName: `${timezone.region}/${timezone.name} ${formatOffset(timezone.offset)}`,
        fullNameWithCountry: `${timezone.country.name} (${timezone.region}/${timezone.name}) ${formatOffset(timezone.offset)}`,
      } as unknown as TimezoneProps & T
    })

    if (only.length > 0) list = list.filter(({ key }) => only.includes(key))
    if (except.length > 0) list = list.filter(({ key }) => !except.includes(key))

    function sortList(items: (TimezoneProps & T)[]) {
      return items.sort((a, b) => {
        if (a.regionKey !== b.regionKey) return a.regionKey.localeCompare(b.regionKey)
        return a.offset - b.offset
      })
    }

    return sortList(list)
  }

  const getTimezones = <T extends object = object>(props?: GetTimezones<T>): (TimezoneProps & T)[] =>
    filterTimezones(props)

  const getTimezonesGrouped = (props?: GetTimezones): TimezoneGroupedProps[] => {
    const list = filterTimezones(props)

    return Object.entries(
      list.reduce(
        (acc, timezone) => {
          if (!acc[timezone.regionKey]) acc[timezone.regionKey] = []
          acc[timezone.regionKey].push(timezone)
          return acc
        },
        {} as Record<string, TimezoneProps[]>
      )
    ).map(([regionKey, items]) => ({
      regionKey: regionKey as TimeZoneRegionType,
      region: items[0].region,
      zones: items,
    }))
  }

  const getTimezone = <T extends object = object>(
    criteria?: TimezoneType | TimezoneLookupProps | null,
    props?: Pick<GetTimezones<T>, 'extra'>
  ): TimezoneProps & T => {
    const lookup = typeof criteria === 'string' ? { key: criteria } : (criteria ?? {})

    if (!lookup.key && !lookup.name && lookup.offset === undefined && !lookup.countryCode)
      return {} as TimezoneProps & T

    const timezone = getTimezones(props).find((item) => {
      if (lookup.key && item.key === lookup.key) return true
      if (lookup.name && item.name.toLowerCase() === lookup.name.toLowerCase()) return true
      if (lookup.offset !== undefined && item.offset === lookup.offset) return true
      if (lookup.countryCode && item.country.code === lookup.countryCode) return true
      return false
    })

    if (!timezone && 'returnError' in lookup && lookup.returnError)
      throw new Error(`Timezone not found with provided criteria: ${JSON.stringify(criteria)}`)

    return timezone ?? ({} as TimezoneProps & T)
  }

  const convertTime = (
    timeToCalc: Date,
    tz1Offset: TimezoneProps['offset'],
    tz2Offset: TimezoneProps['offset']
  ): Date => {
    if (!timeToCalc || tz1Offset === undefined || tz2Offset === undefined)
      return new Date(timeToCalc?.getTime?.() ?? NaN)

    const resultDate = new Date(timeToCalc.getTime())
    resultDate.setTime(resultDate.getTime() + (tz2Offset - tz1Offset) * 60 * 60 * 1000)
    return resultDate
  }

  return { getTimezones, getTimezonesGrouped, getTimezone, convertTime }
}
