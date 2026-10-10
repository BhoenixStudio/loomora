'use client'

import { ForwardedRef, forwardRef, MouseEvent, ReactNode } from 'react'
import { useLoomora } from '../../../config'
import { cx } from '../../../hooks'
import { CSSProps } from '../../../types'
import { ButtonProps, ButtonVariant, LinkButtonProps, RegularButtonProps } from './helper'

function ButtonInner(props: Readonly<ButtonProps>, forwardedRef: ForwardedRef<HTMLButtonElement | HTMLAnchorElement>) {
  const { LinkType, button } = useLoomora()

  const { defaultType, defaultColor, defaultLoadingTitle, sizes, colors, corners } = button ?? {}

  const {
    id,
    variant = 'fill',
    size = 'default',
    color,
    corner = 'default',
    borderThick = 1,
    animate = true,
    className: customClass = '',
    style: customStyle,
    title,
    startIcon,
    endIcon,
    loading,
    loaderTitle,
    loaderStartIcon,
    loaderEndIcon,
    children,
    condition,
  } = props

  const {
    href,
    referrerPolicy,
    target,
    onClick: linkClick,
    attributes: linkAttrs,
    download = false,
  } = props as LinkButtonProps

  const {
    onClick: buttonClick,
    type = defaultType,
    attributes: buttonAttrs,
    disabled = false,
  } = props as RegularButtonProps

  // Configs
  const sVariant = variant as Exclude<ButtonVariant, 'none'>
  const { border, background, text } = colors?.[sVariant]?.[color ?? defaultColor ?? ''] ?? {}
  const sizeConfig = size === 'none' ? undefined : sizes?.[size]

  const className = cx([
    // Core
    'loomora-btn select-none transition-all duration-200 ease-in-out whitespace-nowrap',
    { value: 'inline-flex', condition: !/^d-(flex|block|grid|inline)/.test(customClass) },
    {
      value: 'justify-center',
      condition: !/^justify-(center|start|end|between|around|evenly)/.test(customClass),
    },
    // Sizes
    {
      value: [
        ...sanitizeItem(sizeConfig?.fill?.textSize),
        ...sanitizeItem(sizeConfig?.fill?.textWeight),
        ...sanitizeItem(sizeConfig?.fill?.gap),
        ...sanitizeItem(sizeConfig?.fill?.padding),
      ],
      condition: ['fill'].includes(variant),
    },
    {
      value: [
        ...sanitizeItem(sizeConfig?.outline?.textSize),
        ...sanitizeItem(sizeConfig?.outline?.textWeight),
        ...sanitizeItem(sizeConfig?.outline?.gap),
        ...sanitizeItem(sizeConfig?.outline?.padding),
      ],
      condition: ['outline'].includes(variant),
    },
    {
      value: [
        ...sanitizeItem(sizeConfig?.text?.textSize),
        ...sanitizeItem(sizeConfig?.text?.textWeight),
        ...sanitizeItem(sizeConfig?.text?.gap),
        ...sanitizeItem(sizeConfig?.text?.padding),
      ],
      condition: ['text'].includes(variant),
    },
    // Colors
    {
      value: [
        { value: String(border), condition: Boolean(border) },
        { value: String(background), condition: Boolean(background) },
        { value: String(text), condition: Boolean(text) },
      ],
      fallback: [
        { value: 'bg-inherit', condition: variant === 'fill' },
        { value: 'border-inherit text-inherit', condition: variant === 'outline' },
        { value: 'text-inherit', condition: variant === 'text' },
      ],
      condition: color !== 'inherit',
    },
    // Corners
    { value: corners?.[corner], condition: !['none'].includes(variant) },
    // Others
    { value: 'cursor-not-allowed', fallback: 'cursor-pointer', condition: loading || disabled },
    {
      value:
        'hover:transform hover:-translate-y-[3px] hover:scale-[0.99] focus:transform focus:-translate-y-[3px] focus:scale-[0.99]',
      condition: !loading && !disabled && !['none', 'text'].includes(variant) && animate,
    },
    customClass,
  ])

  const style: CSSProps = {
    ...customStyle,
    ...(variant === 'outline' && { borderWidth: borderThick }),
  }

  // Components
  let content: ReactNode = children
  if (loading)
    content = (
      <>
        {loaderStartIcon}
        {title && (loaderTitle ?? defaultLoadingTitle)}
        {loaderEndIcon}
      </>
    )
  else if (title || startIcon || endIcon)
    content = (
      <>
        {startIcon}
        {title}
        {endIcon}
      </>
    )

  const isBlocked = loading === true
  const stateAttrs = { 'aria-busy': loading ? true : undefined, 'aria-disabled': isBlocked || undefined }

  let wrapper: ReactNode = (
    <button
      ref={forwardedRef as ForwardedRef<HTMLButtonElement>}
      id={id}
      onClick={buttonClick}
      type={type}
      {...{ className, disabled: disabled || loading, style, ...stateAttrs, ...buttonAttrs }}
    >
      {content}
    </button>
  )
  if (href)
    wrapper = (
      <LinkType
        ref={forwardedRef}
        id={id}
        href={String(href)}
        onClick={(e: MouseEvent<HTMLAnchorElement>) => {
          if (isBlocked) return e.preventDefault()
          linkClick?.(e)
        }}
        {...{ className, target, referrerPolicy, download, style, ...stateAttrs, ...linkAttrs }}
      >
        {content}
      </LinkType>
    )

  // Functions
  function sanitizeItem<T>(item: '' | T | undefined) {
    if (!item) return []
    if (typeof item === 'string') return [item]
    return item
  }

  if (condition === false) return null
  return <>{wrapper}</>
}

export const Button = forwardRef(ButtonInner)
Button.displayName = 'Button'
