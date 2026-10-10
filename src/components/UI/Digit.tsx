import { ElementType, ReactNode } from 'react'
import { Loader, LoaderProps } from '../../components'
import { cx } from '../../hooks'
import { GlobalElement } from '../../types'

export type DigitProps<T extends ElementType = 'span'> = GlobalElement<T> & {
  as?: T
  value: number | null | undefined
  valueProps?: GlobalElement<'span'>
  subProps?: GlobalElement<'small'>
  fallback?: ReactNode
  startUnit?: ReactNode
  startUnitProps?: GlobalElement<'small'>
  endUnit?: ReactNode
  endUnitProps?: GlobalElement<'small'>
  decimalsMin?: number
  decimalsMax?: number
  thousandSeparator?: string
  decimalSeparator?: string
  loading?: boolean
  loaderProps?: Omit<LoaderProps, 'counts' | 'wrapperClassName'>
}

function extractPrice(
  props: Pick<DigitProps, 'value' | 'decimalsMin' | 'decimalsMax' | 'thousandSeparator'>
): [string, string?] {
  const { value, decimalsMin, decimalsMax, thousandSeparator } = props
  if (value === null || value === undefined) return ['', '']

  const clamp = (n: number) => Math.min(100, Math.max(0, Math.trunc(n)))
  const maxDigits = clamp(decimalsMax ?? 3)
  const minDigits = Math.min(clamp(decimalsMin ?? 0), maxDigits)
  const formatted = value.toLocaleString('en-US', {
    maximumFractionDigits: maxDigits,
    minimumFractionDigits: minDigits,
  })
  const [main, sub] = formatted.split('.')
  const number = main.split(',').join(thousandSeparator)

  return [number, sub]
}

export function Digit<T extends ElementType = 'span'>(props: Readonly<DigitProps<T>>) {
  const {
    as: As = 'span',
    value,
    valueProps,
    subProps,
    fallback = '-',
    startUnit,
    startUnitProps,
    endUnit,
    endUnitProps,
    decimalsMin,
    decimalsMax = 3,
    decimalSeparator = '.',
    thousandSeparator = ',',
    className = 'gap-0.5',
    dir = 'ltr',
    attributes,
    loading,
    loaderProps,
    ...attrs
  } = props

  const { className: sUClass = 'font-normal leading-none', attributes: sUAttrs, ...sURest } = startUnitProps ?? {}
  const { className: eUClass = 'font-normal leading-none', attributes: eUAttrs, ...eURest } = endUnitProps ?? {}

  const { className: vClass = 'font-medium leading-none items-end', attributes: vAttrs, ...vRest } = valueProps ?? {}
  const { className: sClass = 'font-normal leading-none', attributes: sAttrs, ...sRest } = subProps ?? {}

  // Configs
  const [main, sub] = extractPrice({ value, decimalsMin, decimalsMax, thousandSeparator })

  let content: ReactNode = <Loader height={20} className={className} {...loaderProps} />
  if (!loading)
    content = (
      <>
        {startUnit && (
          <small className={sUClass} {...sUAttrs} {...sURest}>
            {startUnit}
          </small>
        )}
        <span className={cx(['flex flex-nowrap text-nowrap', vClass])} {...vAttrs} {...vRest}>
          {main}
          {sub && (
            <small className={sClass} {...sAttrs} {...sRest}>
              {decimalSeparator}
              {sub}
            </small>
          )}
        </span>
        {endUnit && (
          <small className={eUClass} {...eUAttrs} {...eURest}>
            {endUnit}
          </small>
        )}
      </>
    )

  if (!loading && (value === null || value === undefined)) return fallback
  return (
    <As className={cx(['inline-flex flex-nowrap items-end', className])} {...{ dir, ...attributes }} {...attrs}>
      {content}
    </As>
  )
}

export type UseDigitProps = Pick<
  DigitProps,
  'decimalsMin' | 'decimalsMax' | 'thousandSeparator' | 'decimalSeparator'
> & { fallback?: string; startUnit?: string; endUnit?: string; subSeparator?: boolean }

export function UseDigit(value: DigitProps['value'], props: UseDigitProps = {}): string {
  const {
    fallback = '-',
    startUnit,
    endUnit,
    decimalsMin,
    decimalsMax = 3,
    thousandSeparator = ',',
    decimalSeparator = '.',
    subSeparator = true,
  } = props

  // Configs
  const [main, sub] = extractPrice({ value, decimalsMin, decimalsMax, thousandSeparator })

  const parts = []
  if (startUnit) parts.push(startUnit)
  const formattedNumber = sub === undefined ? main : `${main}${decimalSeparator}${sub}`
  parts.push(formattedNumber)
  if (endUnit) parts.push(endUnit)

  if (value === null || value === undefined) return fallback
  return subSeparator ? parts.join(' ') : parts.join('')
}
