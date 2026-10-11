'use client'

import { ReactNode } from 'react'
import { cx, hasProps } from '../../../hooks'
import { GlobalElement } from '../../../types'

export type InputHelperProps = GlobalElement<'span'> & {
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
      className={cx([
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

export type InputError = { condition: boolean; helper: ReactNode | Omit<InputHelperProps, 'asError'> }
export type InputErrorMessageProps = { errors?: InputError[] }

export function hasError(errors?: InputError[]): boolean {
  return Array.isArray(errors) && errors.some((item) => item?.condition === true)
}

export function resolveErrorHelper(errors?: InputError[]): InputError['helper'] | undefined {
  if (!Array.isArray(errors)) return undefined
  const match = errors.find((item) => item?.condition === true)
  if (match?.helper === undefined || match.helper === null || match.helper === false) return undefined
  return match.helper
}

export function InputErrorMessage(props: Readonly<InputErrorMessageProps>) {
  const { errors } = props
  const helper = resolveErrorHelper(errors)

  if (helper === undefined) return null
  if (hasProps(helper, 'children')) return <InputHelper {...helper} asError />
  return <InputHelper asError>{helper}</InputHelper>
}
