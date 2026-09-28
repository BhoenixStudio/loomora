/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { ChangeEvent, isValidElement, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLoomoraConfig } from '../../../../config'
import { cn, isThisProps } from '../../../../hooks'
import { ConditionalWrapper } from '../../../Helper'
import { Button, ButtonBaseProps } from '../../../UI'
import { InputHelper } from '../../Modules/Helper'
import { Label, LabelProps } from '../../Modules/Label'
import {
  AutocompleteMultiple,
  AutocompleteMultipleProps,
  AutocompleteOption,
  AutocompleteProps,
  AutocompleteSingle,
  AutocompleteSingleProps,
} from './helper'

export function Autocomplete<T = any>(props: Readonly<AutocompleteMultipleProps<T>>): ReactNode
export function Autocomplete<T = any>(props: Readonly<AutocompleteSingleProps<T>>): ReactNode
export function Autocomplete<T = any>(props: Readonly<AutocompleteProps<T>>) {
  const { t, form } = useLoomoraConfig()

  const {
    size = [],
    properties,
    fieldset,
    wrapper,
    label = '',
    prefix,
    suffix,
    inputHelper,
    error = false,
    errorHelper,
    active: forceActive = false,
    condition,
    loading = false,
    options = [],
    optionsMenu,
    emptyState = t('autoComplete.emptyState'),
    loadingState = t('autoComplete.loadingState'),
    showTrigger,
    trigger: dTrigger,
    onToggle,
  } = props

  const {
    className: fieldsetClass = form?.fieldset?.className,
    attributes: fieldsetAttrs,
    ...restFieldset
  } = fieldset ?? {}
  const { className: wrapperClass, attributes: wrapperAttrs, ...restWrapper } = wrapper ?? {}

  const {
    onClear,
    multiple = form?.autoComplete?.multiple ?? false,
    required,
    disabled,
    searchable = form?.autoComplete?.searchable ?? true,
    onSearch,
    searchPlaceholder = t('autoComplete.searchPlaceholder'),
    searchViaLabel = form?.autoComplete?.searchViaLabel ?? true,
    showClearSearch = form?.autoComplete?.showClearSearch ?? true,
  } = properties ?? {}

  const {
    value: singleValue,
    onChange: singleChange,
    renderValue: singleRenderValue,
    renderOption: singleRenderOption,
  } = (properties ?? {}) as AutocompleteSingle<T>

  const {
    value: multiValue = [],
    onChange: multiChange,
    renderValue: multiRenderValue,
    renderOption: multiRenderOption,
    renderTag,
    min,
    max,
  } = (properties ?? {}) as AutocompleteMultiple<T>

  // Refs
  const fieldsetRef = useRef<HTMLFieldSetElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // States
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [active, setActive] = useState(false)
  const [selected, setSelected] = useState<AutocompleteOption<T>[]>([])
  const [menuPosition, setMenuPosition] = useState<'bottom' | 'top'>('bottom')

  // Configs
  const isActive = forceActive || active || open
  const hasSelectionError = (min !== undefined && selected.length < min) || (max !== undefined && selected.length > max)

  const filteredOptions = useMemo(() => {
    if (!search.trim() || !searchViaLabel || !searchable) return options
    const s = search.toLowerCase().trim()
    return options.filter((opt) => {
      const text = ExtractOptionText(opt.label)
      const fallback = JSON.stringify({ v: opt.value, var: opt.variables })
      return text.toLowerCase().includes(s) || fallback.toLowerCase().includes(s)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, search, searchViaLabel, searchable])

  const triggerContent = useMemo(() => {
    if (multiple) {
      if (selected.length === 0) return null
      return multiRenderValue?.(selected) ?? t('autoComplete.selectedCount', { count: selected.length })
    }
    const current = selected[0]
    if (!current) return null
    return singleRenderValue?.(current) ?? current.label
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, singleRenderValue, multiRenderValue, multiple])

  let labelClass: string = '',
    restLabel: LabelProps = { children: '' }
  if (isThisProps(label, 'children')) {
    const { className: lCN, ...restOfLabel } = label ?? {}
    labelClass = lCN ?? ''
    restLabel = restOfLabel
  }
  const labelClassName = cn([
    form?.label?.stateSharedClassName,
    {
      value: form?.label?.activeClassName,
      fallback: form?.label?.inactiveClassName,
      condition: isActive,
    },
    labelClass,
  ])

  let restTrigger: Pick<ButtonBaseProps, 'variant' | 'color' | 'corner'> & { icon: ReactNode } = {
    icon: form?.select?.triggerIcon,
    color: 'second',
    corner: 'small',
    variant: 'text',
  }
  if (isThisProps(dTrigger, 'icon')) {
    const {
      color: tColor = 'second',
      corner: tCorner = 'small',
      variant: tVariant = 'text',
      ...triggerRest
    } = dTrigger ?? {}
    restTrigger = { color: tColor, corner: tCorner, variant: tVariant, ...triggerRest }
  }

  let trigger: ReactNode = triggerContent
  if (searchable && triggerContent && !open)
    trigger = (
      <button
        type="button"
        onClick={toggleMenu}
        disabled={disabled}
        className={cn([
          'flex items-center bg-transparent outline-none text-start cursor-pointer w-full disabled:cursor-not-allowed pe-3',
          { value: 'ps-2', fallback: 'ps-3', condition: Boolean(prefix) },
          { value: 'pt-3', fallback: 'py-3', condition: multiple && selected.length > 0 },
          form?.autoComplete?.triggerWrapperClassName,
        ])}
      >
        {triggerContent}
      </button>
    )
  else if (searchable)
    trigger = (
      <input
        ref={searchRef}
        type="text"
        value={search}
        onChange={handleSearch}
        onFocus={() => {
          if (open) return
          setOpen(true)
          onToggle?.(true)
        }}
        placeholder={searchPlaceholder}
        disabled={disabled}
        className={cn([
          'bg-transparent outline-none w-full disabled:cursor-not-allowed pe-3',
          { value: 'ps-2', fallback: 'ps-3', condition: Boolean(prefix) || (multiple && selected.length > 0) },
          { value: 'pt-3', fallback: 'py-3', condition: multiple && selected.length > 0 },
          form?.autoComplete?.triggerWrapperClassName,
        ])}
      />
    )

  // Functions
  function ExtractOptionText(node: ReactNode): string {
    if (typeof node === 'string' || typeof node === 'number') return String(node)
    if (Array.isArray(node)) return node.map(ExtractOptionText).join(' ')
    if (isValidElement<{ children?: ReactNode }>(node)) return ExtractOptionText(node.props.children)
    return ''
  }
  function toggleMenu() {
    if (disabled) return
    const next = !open
    setOpen(next)
    onToggle?.(next)
    if (next && searchable) setTimeout(() => searchRef.current?.focus(), 0)
  }
  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value)
    onSearch?.(e)
    if (open) return
    setOpen(true)
    onToggle?.(true)
  }
  function handleSelect(option: AutocompleteOption<T>) {
    if (option.disabled) return

    if (multiple) {
      const isAlreadySelected = selected.some((s) => s.value === option.value)
      let next: AutocompleteOption<T>[]

      if (isAlreadySelected) {
        next = selected.filter((s) => s.value !== option.value)
      } else {
        if (max !== undefined && selected.length >= max) return
        next = [...selected, option]
      }

      setSelected(next)
      multiChange?.(
        next.map(({ value }) => value),
        next
      )
    } else {
      setSelected([option])
      singleChange?.(option.value, option)
      setOpen(false)
      onToggle?.(false)
      setSearch('')
    }
  }
  function handleRemoveTag(option: AutocompleteOption<T>) {
    const next = selected.filter((s) => s.value !== option.value)
    setSelected(next)
    multiChange?.(
      next.map(({ value }) => value),
      next
    )
  }
  function handleClear() {
    setSelected([])
    setSearch('')
    if (multiple) multiChange?.([], [])
    else singleChange?.(undefined, {} as AutocompleteOption<T>)
    onClear?.()
  }
  function calculateMenuPosition() {
    if (!fieldsetRef.current) return
    const rect = fieldsetRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    setMenuPosition(spaceBelow < 240 && spaceAbove > spaceBelow ? 'top' : 'bottom')
  }
  function renderOptionLabel(option: AutocompleteOption<T>) {
    if (multiple && multiRenderOption) return multiRenderOption(option)
    if (!multiple && singleRenderOption) return singleRenderOption(option)
    return option.label
  }
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (!fieldsetRef.current || fieldsetRef.current.contains(e.target as Node)) return
      setOpen(false)
      onToggle?.(false)
    },
    [onToggle]
  )
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      onToggle?.(false)
    },
    [onToggle]
  )

  useEffect(() => setActive(Boolean(singleValue || multiValue.length)), [singleValue, multiValue])
  useEffect(() => {
    if (multiple) {
      const matched = options.filter((o) => multiValue.includes(o.value))
      setSelected((prev) => {
        const prevValues = prev.map((p) => p.value)
        const nextValues = matched.map((m) => m.value)
        if (prevValues.length === nextValues.length && prevValues.every((v, i) => v === nextValues[i])) return prev
        return matched
      })
    } else {
      const matched = options.find((o) => o.value === singleValue)
      setSelected((prev) => {
        if (prev[0]?.value === matched?.value) return prev
        return matched ? [matched] : []
      })
    }
  }, [singleValue, multiValue, multiple, options])
  useEffect(() => {
    if (!open) return
    calculateMenuPosition()
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [open, handleClickOutside, handleEsc])

  if (condition === false) return null
  return (
    <fieldset
      ref={fieldsetRef}
      className={cn(['flex flex-col flex-nowrap relative', ...size, fieldsetClass])}
      {...fieldsetAttrs}
      {...restFieldset}
    >
      <div
        className={cn([
          'flex flex-wrap items-center relative',
          {
            value: wrapperClass,
            fallback: [
              'border bg-inherit rounded gap-1',
              { value: 'ps-3', condition: Boolean(prefix) },
              { value: 'pe-3', condition: Boolean(suffix) },
              { value: 'border-error/70', fallback: 'border-body-3/40', condition: error || hasSelectionError },
            ],
            condition: Boolean(wrapperClass),
          },
        ])}
        {...wrapperAttrs}
        {...restWrapper}
      >
        <ConditionalWrapper childrenCondition={Boolean(label)}>
          {isThisProps(label, 'children') ? (
            <Label className={labelClassName} {...{ required, ...restLabel }} />
          ) : (
            <Label className={labelClassName} {...{ required }}>
              {label}
            </Label>
          )}
        </ConditionalWrapper>

        <div className="flex flex-nowrap items-center gap-1 w-full">
          {prefix}
          {trigger}

          {showClearSearch && selected.length > 0 && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
              className="text-body-2 hover:text-error transition-colors cursor-pointer pe-1"
              aria-label="Clear"
            >
              {form?.autoComplete?.ClearSearchIcon}
            </button>
          )}

          {showTrigger && (
            <Button
              type="button"
              {...restTrigger}
              className="absolute top-1/2 end-3 -translate-y-1/2 pointer-events-none transition-all duration-150 ease-in-out peer-focus:rotate-180"
            >
              {restTrigger?.icon}
            </Button>
          )}

          {suffix}
        </div>

        {multiple && selected.length > 0 && (
          <div className="flex flex-wrap gap-1 py-1 ps-2">
            {selected.map((opt) => (
              <span
                key={String(opt.value)}
                className="inline-flex items-center gap-1 rounded bg-second px-2 py-0.5 text-xs text-title-2"
              >
                {renderTag ? renderTag(opt) : opt.label}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveTag(opt)
                  }}
                  className="text-body-2 hover:text-error transition-colors cursor-pointer"
                  aria-label="Remove"
                >
                  {form?.autoComplete?.multipleTagsCloseIcon}
                </button>
              </span>
            ))}
          </div>
        )}

        {open && (
          <ul
            ref={menuRef}
            role="listbox"
            className={cn([
              'absolute z-300 inset-s-0 inset-e-0 max-h-60 overflow-y-auto list-none p-1',
              'border border-body-3/40 bg-main rounded-lg shadow-lg',
              {
                value: 'bottom-full loomora-autocomplete-animate-in-top mb-1',
                fallback: 'top-full loomora-autocomplete-animate-in-bottom mt-1',
                condition: menuPosition === 'top',
              },
              optionsMenu?.className,
            ])}
          >
            {loading && <li className="px-3 py-2 text-sm text-body-2">{loadingState}</li>}

            {!loading && filteredOptions.length === 0 && (
              <li className="px-3 py-2 text-sm text-body-2">{emptyState}</li>
            )}

            {!loading &&
              filteredOptions.map((option) => {
                const isSelected = multiple
                  ? selected.some((s) => s.value === option.value)
                  : selected[0]?.value === option.value

                return (
                  <li
                    key={String(option.value)}
                    role="option"
                    tabIndex={0}
                    aria-selected={isSelected}
                    className={cn([
                      'px-3 py-2 text-sm cursor-pointer rounded transition-colors',
                      'hover:bg-second',
                      {
                        value: option.selectedClassName ?? 'bg-second font-medium',
                        fallback: option.notSelectedClassName,
                        condition: isSelected,
                      },
                      { value: 'opacity-50 pointer-events-none', condition: Boolean(option.disabled) },
                      option.className,
                    ])}
                    onClick={() => handleSelect(option)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleSelect(option)
                      }
                    }}
                    {...option.attributes}
                  >
                    {renderOptionLabel(option)}
                  </li>
                )
              })}
          </ul>
        )}
      </div>

      <ConditionalWrapper childrenCondition={Boolean(inputHelper)}>
        {isThisProps(inputHelper, 'children') ? (
          <InputHelper {...inputHelper} />
        ) : (
          <InputHelper>{inputHelper}</InputHelper>
        )}
      </ConditionalWrapper>

      <ConditionalWrapper childrenCondition={Boolean(errorHelper) && error}>
        {isThisProps(errorHelper, 'children') ? (
          <InputHelper {...errorHelper} asError />
        ) : (
          <InputHelper asError>{errorHelper}</InputHelper>
        )}
      </ConditionalWrapper>
    </fieldset>
  )
}
