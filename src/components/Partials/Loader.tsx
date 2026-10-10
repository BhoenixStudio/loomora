import React, { ElementType } from 'react'

export interface LoaderProps {
  as?: ElementType
  wrapperAs?: ElementType
  counts?: number
  duration?: number
  width?: number | string
  height: number | string
  variant?: 'rounded' | 'circle' | 'sharp' | 'square' | 'text'
  className?: string
  wrapperClassName?: string
}

export function Loader(props: Readonly<LoaderProps>) {
  const {
    as: As = 'span',
    wrapperAs: Wrapper = 'div',
    counts = 1,
    duration = 2.5,
    width = '100%',
    height,
    variant = 'rounded',
    className = '',
    wrapperClassName = 'gap-1',
  } = props

  const baseClasses = 'animate-pulse bg-gray-300 dark:bg-gray-700'

  const variantClasses = {
    rounded: 'rounded',
    circle: 'rounded-full',
    sharp: '',
    square: 'aspect-square',
    text: 'h-4 rounded',
  }

  const getWidth = (index: number) => {
    if (variant === 'text' && counts > 1 && index === counts - 1) {
      if (typeof width === 'number') return `${Math.round(width * 0.8 * 1000) / 1000}px`
      const match = width.match(/^(-?\d*\.?\d+)([a-z%]*)$/i)
      if (!match) return `calc(${width} * 0.8)`
      const scaled = Math.round(Number.parseFloat(match[1]) * 0.8 * 1000) / 1000
      return `${scaled}${match[2] || 'px'}`
    }
    return width
  }

  const loaders = Array.from({ length: counts }).map((_, i) => {
    const style: React.CSSProperties = { animationDuration: `${duration}s` }
    if (height) style.height = height
    style.width = getWidth(i)

    return <As key={i} className={`${baseClasses} ${variantClasses[variant]} ${className}`} style={style} />
  })

  if (variant === 'text')
    return <Wrapper className={`flex flex-col flex-nowrap ${wrapperClassName}`}>{loaders}</Wrapper>

  return <>{loaders}</>
}
