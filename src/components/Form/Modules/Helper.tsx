'use client'

import { ReactNode } from 'react'
import { cn } from '../../../hooks'
import { GlobalElementEssentials } from '../../../types'

export type InputHelperProps = GlobalElementEssentials<'span'> & {
  children: ReactNode
  errorClassName?: string
  asError?: boolean
}

export function InputHelper(props: Readonly<InputHelperProps>) {
  const {
    children,
    className = 'text-xs text-title-2 gap-1 mt-1',
    errorClassName = 'text-xs text-error gap-1 mt-1',
    asError = false,
    attributes,
    ...attrs
  } = props

  return (
    <span
      className={cn([
        'flex flex-nowrap items-center',
        { value: errorClassName, fallback: className, condition: asError },
      ])}
      {...attributes}
      {...attrs}
    >
      {children}
    </span>
  )
}
