'use client'

import { forwardRef, KeyboardEvent, MouseEvent, useRef, useState } from 'react'
import { Button, ButtonProps } from '../../UI'
import { TextField, TextFieldProps } from './TextField'
import { useLoomoraConfig } from '../../../config'

export interface SearchFieldProps extends Omit<TextFieldProps, 'properties'> {
  properties?: TextFieldProps['properties'] & {
    onClear?: (clearedValue: string) => void
    onSearch?: (value: string) => void
    onEnter?: (value: string) => void
  }
  showSearchIcon?: boolean
  searchIconProps?: Pick<ButtonProps, 'variant' | 'color' | 'corner'>
  showClearIcon?: boolean
  clearIconProps?: Pick<ButtonProps, 'variant' | 'color' | 'corner'>
}

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>((props) => {
  const {
    showSearchIcon = true,
    searchIconProps,
    showClearIcon = true,
    clearIconProps,
    prefix,
    suffix,
    properties,
    wrapper,
    ...inputRest
  } = props

  const { translations, form } = useLoomoraConfig()

  const { attributes: wrapperAttrs, ...restWrapperProps } = wrapper ?? {}
  const { onMouseEnter, onMouseLeave, ...restWrapperAttrs } = wrapperAttrs ?? {}

  const { onClear, onSearch, onEnter, onKeyDown, ...inputAttrs } = properties ?? {}
  const { color: sColor = 'second', corner: sCorner = 'small', variant: sVariant = 'text' } = searchIconProps ?? {}
  const { color: cColor = 'second', corner: cCorner = 'small', variant: cVariant = 'text' } = clearIconProps ?? {}

  const searchRef = useRef<HTMLInputElement>(null)

  // States
  const [isHovered, setIsHovered] = useState<boolean>(false)

  // Functions
  function handleClearClick() {
    if (!searchRef.current) return

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
    if (!nativeInputValueSetter) return
    nativeInputValueSetter.call(searchRef.current, '')

    const changeEvent = new Event('input', { bubbles: true })
    searchRef.current.dispatchEvent(changeEvent)
    searchRef.current.focus()

    setIsHovered(false)
    onClear?.(searchRef.current.value)
  }
  function handleSearchClick() {
    if (!searchRef.current) return
    onSearch?.(searchRef.current.value)
  }

  return (
    <TextField
      ref={searchRef}
      properties={{
        type: 'text',
        onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') onEnter?.(searchRef.current?.value ?? '')
          onKeyDown?.(e)
        },
        ...inputAttrs,
      }}
      wrapper={{
        attributes: {
          onMouseEnter: (e: MouseEvent<HTMLDivElement>) => {
            setIsHovered(true)
            onMouseEnter?.(e)
          },
          onMouseLeave: (e: MouseEvent<HTMLDivElement>) => {
            setIsHovered(false)
            onMouseLeave?.(e)
          },
          ...restWrapperAttrs,
        },
        ...restWrapperProps,
      }}
      prefix={
        <>
          {showSearchIcon && (
            <Button
              variant={sVariant}
              color={sColor}
              corner={sCorner}
              onClick={handleSearchClick}
              attributes={{ 'aria-label': translations?.searchField?.searchButtonTitle }}
            >
              {form?.searchField?.searchIcon}
            </Button>
          )}
          {prefix}
        </>
      }
      suffix={
        <>
          {showClearIcon && isHovered && (
            <Button
              variant={cVariant}
              color={cColor}
              corner={cCorner}
              onClick={handleClearClick}
              attributes={{ 'aria-label': translations?.searchField?.clearSearchTitle }}
            >
              {form?.searchField?.clearIcon}
            </Button>
          )}
          {suffix}
        </>
      }
      {...inputRest}
    />
  )
})
