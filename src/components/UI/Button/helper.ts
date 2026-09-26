'use client'

import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { CSSProps } from '../../../types'

export type ButtonVariant = 'fill' | 'outline' | 'text' | 'none'
export type ButtonSize = 'tiny' | 'small' | 'default' | 'large' | 'larger' | 'huge' | 'extreme' | 'none'
export type ButtonCorner = 'small' | 'default' | 'large' | 'circle' | 'full' | 'sharp'

export type ButtonBaseProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  color?: string
  corner?: ButtonCorner
  borderThick?: number
  animate?: boolean

  className?: string
  style?: CSSProps

  title?: ReactNode
  startIcon?: ReactNode
  endIcon?: ReactNode

  loading?: boolean
  loaderTitle?: ReactNode
  loaderStartIcon?: ReactNode
  loaderEndIcon?: ReactNode

  children?: ReactNode
  condition?: boolean
}

export type LinkButtonProps = {
  ref?: Ref<HTMLAnchorElement>
  href: AnchorHTMLAttributes<HTMLAnchorElement>['href'] | undefined
  attributes?: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'id' | 'href' | 'style' | 'className' | 'target'>
} & Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'id' | 'target' | 'referrerPolicy' | 'onClick' | 'download'> &
  Partial<Record<'disabled' | 'type', never>>

export type RegularButtonProps = {
  ref?: Ref<HTMLButtonElement>
  href?: never
  attributes?: Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'id' | 'disabled' | 'onClick' | 'type' | 'style' | 'className'
  >
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'id' | 'disabled' | 'onClick' | 'type'> &
  Partial<Record<'target' | 'referrerPolicy' | 'locale', never>>

export type ButtonProps = ButtonBaseProps & (RegularButtonProps | LinkButtonProps)
