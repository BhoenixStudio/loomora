'use client'

import { ReactNode } from 'react'
import { GlobalElementEssentials } from '../../../types'
import { InputBase } from '../helper'
import { useLoomoraConfig } from '../../../config'
import { cn } from '../../../hooks'
import { Loader } from '../../Partials'

export type LabelProps = Omit<GlobalElementEssentials<'label'>, 'assignDefaultClass' | 'clearDefaultClassName'> & {
  children: ReactNode
  required?: boolean
  showRequiredIndicator?: boolean
  suffix?: ReactNode
}

export function Label(props: Readonly<InputBase & LabelProps>) {
  const { form } = useLoomoraConfig()

  const {
    size = [],
    children,
    className = form?.label?.className,
    required,
    showRequiredIndicator = form?.label?.showRequiredIndicator ?? true,
    loading,
    condition,
    attributes,
    ...attrs
  } = props

  if (condition === false) return
  if (loading) return <Loader height={20} className={cn([...size])} />
  return (
    <label className={cn(['flex', ...size, className])} {...attributes} {...attrs}>
      {children}
      {required && showRequiredIndicator && <span className="text-[1.2em]">*</span>}
    </label>
  )
}
