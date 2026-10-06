'use client'

import { HTMLAttributes, ReactNode, useState } from 'react'
import { CountryType } from '../../database'
import { cx } from '../../hooks'

export interface FlagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  country: CountryType
  size?: number
  ratio?: '3x2' | '1x1'
  fallback?: ReactNode
  setIsExist?: (isExist: boolean) => void
}

export function Flag(props: Readonly<FlagProps>) {
  const { country, size = 20, ratio = '3x2', fallback: fb, className, style, setIsExist, ...attrs } = props

  // States
  const [fallback, setFallback] = useState<ReactNode>()

  if (!country) return fb ?? country

  // Configs
  const flagKey = country?.toUpperCase() ?? ''
  const [widthRatio, heightRatio] = ratio.split('x')
  const height = (size * Number.parseInt(heightRatio, 10)) / Number.parseInt(widthRatio, 10)

  const flag = (
    <img
      src={`/flags/${flagKey}.svg`}
      alt={flagKey}
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      onLoad={() => setIsExist?.(true)}
      onError={(e) => {
        const target = e.target as HTMLImageElement
        target.style.display = 'none'
        setFallback(fb ?? flagKey)
        setIsExist?.(false)
      }}
    />
  )

  return (
    <span className={cx(['inline-block', className])} style={{ width: size, height, ...style }} {...attrs}>
      {flag}
      {fallback}
    </span>
  )
}
