import { ReactNode } from 'react'
import { cx } from '../../hooks'
import { ChildSize, CSSProps, GlobalElement } from '../../types'

type ProgressBarWithLabelProps = {
  showValueAsText: true
  label?: ReactNode
  labelClassName?: string
  valueClassName?: string
  wrapper?: GlobalElement<'div'>
}

export type ProgressBarProps = {
  value: number
  outOf: number
  height?: CSSProps['height']
  trackColor?: `bg-${string}` | `bg-${string}/${number}`
  trackClassName?: string
  barColor?: `bg-${string}` | `bg-${string}/${number}`
  barClassName?: string
  size?: ChildSize[]
} & ({ showValueAsText?: false } | ProgressBarWithLabelProps)

export function ProgressBar(props: Readonly<ProgressBarProps>) {
  const {
    value = 0,
    outOf = 100,
    height = 10,
    trackColor = 'bg-third',
    trackClassName = 'rounded-full',
    barColor = 'bg-info',
    barClassName,
    showValueAsText = false,
    size = [],
  } = props
  const {
    label,
    labelClassName = 'text-sm text-title-2 font-medium',
    valueClassName = 'text-xs text-body-1',
    wrapper,
  } = props as ProgressBarWithLabelProps
  const { className: wrapperClassName = 'gap-2', ...wrapperRest } = wrapper ?? {}

  // Configs
  const percent = Math.min(Math.max((value / outOf) * 100, 0), 100)

  const bar = (
    <div
      className={cx([
        'overflow-hidden',
        { value: size, fallback: 'w-full', condition: showValueAsText },
        trackColor,
        trackClassName,
      ])}
      style={{ height }}
    >
      <div
        className={cx(['pointer-events-none h-full transition-all duration-300 ease-in-out', barColor, barClassName])}
        style={{ width: `${percent}%` }}
      />
    </div>
  )

  if (showValueAsText)
    return (
      <div className={cx(['flex flex-col flex-nowrap', wrapperClassName])} {...wrapperRest}>
        <div className="flex flex-nowrap items-end justify-between w-full">
          {label && <span className={labelClassName}>{label}</span>}
          <span className={valueClassName}>{Math.round(percent)}%</span>
        </div>
        {bar}
      </div>
    )
  return <>{bar}</>
}
