'use client'

import { DragEvent, InputHTMLAttributes, MouseEvent, ReactNode, useEffect, useId, useRef, useState } from 'react'
import { useLoomoraConfig } from '../../../../config'
import { cn, isThisProps } from '../../../../hooks'
import { ConditionalWrapper } from '../../../Helper'
import { InputHelper } from '../../Modules/Helper'
import { Label, LabelProps } from '../../Modules/Label'
import {
  FileProps,
  UploaderFieldMultipleProps,
  UploaderFieldProps,
  UploaderFieldSingleProps,
  UploaderFieldViewType,
  useUploaderHelper,
} from './helper'
import { useUploaderModules } from './Modules'

export function UploaderField<T extends string | number = number>(props: Readonly<UploaderFieldProps<T>>) {
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
    error,
    errorHelper,
    loading,
    condition,
  } = props

  const { className: fieldsetClass = 'self-stretch', attributes: fieldsetAttrs, ...restFieldsetAttrs } = fieldset ?? {}
  const {
    id,
    name,
    placeholder = '',
    onClick: onClickEvent,
    onMouseEnter: onMouseEnterEvent,
    onMouseLeave: onMouseLeaveEvent,
    onRemove,
    accept: extensions = form?.uploader?.defaultFileCategory ?? ['all'],
    minFiles = form?.uploader?.minFiles,
    maxFiles = form?.uploader?.maxFiles,
    minSize = form?.uploader?.minSize,
    maxSize = form?.uploader?.maxSize,
    minFilesSize = form?.uploader?.minFilesSize,
    maxFilesSize = form?.uploader?.maxFilesSize,
    required,
    disabled,
    multiple = false,
    showProgress = form?.uploader?.showProgress ?? true,
    progressAttrs,
    allowPaste = form?.uploader?.allowPaste ?? true,
    allowDragAndDrop = form?.uploader?.allowDragAndDrop ?? true,
  } = properties ?? {}

  const {
    value: preview,
    viewType: viewTypeSingle = 'background',
    onChange: onChangeSingle,
    onDragOver: onDragOverSingle,
    onDragLeave: onDragLeaveSingle,
    onDrop: onDropSingle,
    onPaste: onPasteSingle,
  } = (properties ?? {}) as UploaderFieldSingleProps<T>
  const {
    value: previews = [],
    viewType: viewTypeMultiple = 'thumbs',
    onChange: onChangeMultiple,
    onDragOver: onDragOverMultiple,
    onDragLeave: onDragLeaveMultiple,
    onDrop: onDropMultiple,
    onPaste: onPasteMultiple,
    emptyState,
    showOnly,
  } = (properties ?? {}) as UploaderFieldMultipleProps<T>

  const inputRef = useRef<HTMLInputElement>(null)
  const generatedName = `uploader-${useId().replaceAll(':', '')}`

  const { acceptRules, calcFileSize, upload } = useUploaderHelper()

  // States
  const [value, setValue] = useState<InputHTMLAttributes<HTMLInputElement>['value']>('')
  const [loadingFiles, setLoadingFiles] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [errors, setErrors] = useState<string[]>([])
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  // Configs
  const { accept, rules } = acceptRules(extensions)
  const dView = multiple ? viewTypeMultiple : viewTypeSingle

  const fReviews = Array.isArray(previews) ? previews.filter(({ url }) => Boolean(url)) : []
  const hasFiles = multiple ? fReviews.length > 0 : Boolean(preview?.url)
  const aRules: string[] = [
    ...(rules?.map((r) => ({ rule: r, condition: !extensions.includes('all') })) ?? []),
    {
      rule: t('uploader.minSizeRule', { min: calcFileSize(Number(minSize), 'MB') }),
      condition: Boolean(Number(minSize) > 0),
    },
    {
      rule: t('uploader.maxSizeRule', { max: calcFileSize(Number(maxSize), 'MB') }),
      condition: Boolean(Number(maxSize) > 0),
    },
    {
      rule: t('uploader.minFilesSizeRule', { min: calcFileSize(Number(minFilesSize), 'MB') }),
      condition: Boolean(Number(minFilesSize) > 0) && multiple,
    },
    {
      rule: t('uploader.maxFilesSizeRule', { max: calcFileSize(Number(maxFilesSize), 'MB') }),
      condition: Boolean(Number(maxFilesSize) > 0) && multiple,
    },
    {
      rule: t('uploader.minFilesRule', { min: Number(minFiles) }),
      condition: Boolean(Number(minFiles) > 0) && multiple,
    },
    {
      rule: t('uploader.maxFilesRule', { max: Number(maxFiles) }),
      condition: Boolean(Number(maxFiles) > 0) && multiple,
    },
  ]
    .filter(({ condition }) => condition !== false)
    .map(({ rule }) => rule)
  const allowance: string[] = [
    { sentence: t('uploader.pasteAndDragAndDropSupportRule'), condition: allowPaste && allowDragAndDrop },
    { sentence: t('uploader.pasteSupportRule'), condition: allowPaste && !allowDragAndDrop },
    { sentence: t('uploader.dragAndDropSupportRule'), condition: allowDragAndDrop && !allowPaste },
  ]
    .filter(({ condition }) => condition !== false)
    .map(({ sentence }) => sentence)

  const typesOption: Record<UploaderFieldViewType, { labelInactiveClass: string; labelActiveClass: string }> = {
    thumbs: { labelInactiveClass: '', labelActiveClass: '' },
    list: { labelInactiveClass: '', labelActiveClass: '' },
    background: { labelInactiveClass: 'text-body-1', labelActiveClass: 'text-white' },
    profilePicture: { labelInactiveClass: '', labelActiveClass: '' },
  }
  const { labelInactiveClass, labelActiveClass } = typesOption[dView]

  let labelClass: string = '',
    restLabel: LabelProps = { children: '' }
  if (isThisProps(label, 'children')) {
    const { className: lCN, ...restOfLabel } = label ?? {}
    labelClass = lCN ?? ''
    restLabel = restOfLabel
  }
  const labelClassName = cn([
    form?.label?.stateSharedClassName,
    { value: labelActiveClass, fallback: labelInactiveClass, condition: hasFiles },
    labelClass,
  ])

  const labelC: ReactNode = (
    <ConditionalWrapper childrenCondition={Boolean(label)}>
      {isThisProps(label, 'children') ? (
        <Label className={labelClassName} {...{ required, ...restLabel }}>
          {restLabel?.children}
          {placeholder}
        </Label>
      ) : (
        <Label className={labelClassName} {...{ required }}>
          {label}
          {placeholder}
        </Label>
      )}
    </ConditionalWrapper>
  )

  const errorC: ReactNode = (
    <>
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
    </>
  )

  const { UploaderBackground, UploaderList, UploaderProfilePicture, UploaderThumbs } = useUploaderModules<T>({
    previews: multiple ? previews : [preview as FileProps<T>],
    loading,
    prefix,
    suffix,
    wrapper,
    extensions,
    rules: aRules,
    allowance,
    hasFiles,
    progress,
    showProgress,
    progressAttrs,
    isDragging,
    disabled: disabled || loading || loadingFiles,
    onClick,
    onDragOver,
    onDragLeave,
    onDrop,
    onMouseEnter,
    onMouseLeave,
    onRemove,
    emptyState,
    error: errorC,
    label: labelC,
    showOnly,
  })
  const types: Record<UploaderFieldViewType, ReactNode> = {
    thumbs: <UploaderThumbs />,
    list: <UploaderList />,
    background: <UploaderBackground />,
    profilePicture: <UploaderProfilePicture />,
  }

  // Functions
  function handleChange(files: FileList | null) {
    upload<T>(files, {
      validation: { accept: extensions, maxSize, minSize, maxFiles, minFiles, multiple },
      setErrors,
      setValue,
      setProgress,
      setLoading: setLoadingFiles,
      ...(multiple ? { previews: fReviews, setFiles: onChangeMultiple } : { preview, setFile: onChangeSingle }),
    })
  }
  function onClick(e: MouseEvent<HTMLDivElement> | MouseEvent<HTMLButtonElement>) {
    onClickEvent?.(e as MouseEvent<HTMLDivElement>)
    if (!disabled && !loading && !loadingFiles) inputRef.current?.click()
  }
  function onDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()

    if (multiple) onDragOverMultiple?.(previews, Array.from(e.dataTransfer?.files ?? []), true)
    else if (preview) onDragOverSingle?.(preview, Array.from(e.dataTransfer?.files ?? [])?.[0], true)

    if (!disabled && !loading && !loadingFiles && allowDragAndDrop) setIsDragging(true)
  }
  function onDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()

    if (multiple) onDragLeaveMultiple?.(previews, Array.from(e.dataTransfer?.files ?? []), true)
    else if (preview) onDragLeaveSingle?.(preview, Array.from(e.dataTransfer?.files ?? [])?.[0], true)

    if (!disabled && !loading && !loadingFiles && allowDragAndDrop) setIsDragging(false)
  }
  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()

    if (multiple) onDropMultiple?.(previews, Array.from(e.dataTransfer?.files ?? []), true)
    else if (preview) onDropSingle?.(preview, Array.from(e.dataTransfer?.files ?? [])?.[0], true)

    if (disabled || loading || loadingFiles || !allowDragAndDrop) return
    setIsDragging(false)
    handleChange(e.dataTransfer?.files)
  }
  function onMouseEnter(e: MouseEvent<HTMLDivElement>) {
    onMouseEnterEvent?.(e)
    if (allowPaste) setIsHovered(true)
  }
  function onMouseLeave(e: MouseEvent<HTMLDivElement>) {
    onMouseLeaveEvent?.(e)
    if (allowPaste) setIsHovered(false)
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  function onPaste(e: ClipboardEvent) {
    e.preventDefault()

    if (multiple) onPasteMultiple?.(previews, Array.from(e.clipboardData?.files ?? []), true)
    else if (preview) onPasteSingle?.(preview, Array.from(e.clipboardData?.files ?? [])?.[0], true)

    if (!disabled && !loading && e?.clipboardData?.files?.length) handleChange(e.clipboardData.files)
  }

  useEffect(() => {
    if (errors.length === 0) return
    const errorTranslated = {
      duplicateFileRule: t('uploader.duplicateFileRule'),
      minFilesRule: t('uploader.minFilesRule', { min: Number(minFiles) }),
      maxFilesRule: t('uploader.maxFilesRule', { max: Number(maxFiles) }),
      acceptRule: t('uploader.acceptRule', { rules: rules.join(', ') }),
      minSizeRule: t('uploader.minSizeRule', { min: Number(minSize) }),
      maxSizeRule: t('uploader.maxSizeRule', { max: Number(maxSize) }),
      minFilesSizeRule: t('uploader.minFilesSizeRule', { min: Number(minFilesSize) }),
      maxFilesSizeRule: t('uploader.maxFilesSizeRule', { max: Number(maxFilesSize) }),
      uploadError: t('uploader.uploadError'),
    }
    form?.uploader?.onDetectErrors?.(
      Object.entries(errorTranslated)
        .filter(([key]) => errors.includes(key))
        .map(([, value]) => value)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors])

  useEffect(() => {
    if (!isHovered) return
    document.addEventListener('paste', onPaste)
    return () => document.removeEventListener('paste', onPaste)
  }, [isHovered, disabled, loading, allowPaste, onPaste])

  if (condition === false) return null
  return (
    <fieldset
      className={cn([
        'flex flex-col flex-nowrap items-center',
        ...size,
        'border bg-inherit rounded gap-2 p-1',
        { value: 'border-error/70', fallback: 'border-body-3/40', condition: Boolean(error) },
        fieldsetClass,
      ])}
      {...fieldsetAttrs}
      {...restFieldsetAttrs}
    >
      <input
        ref={inputRef}
        type="file"
        name={name ?? generatedName}
        className="hidden"
        onChange={(e) => {
          setValue(e.target.value)
          handleChange(e.target.files)
        }}
        disabled={disabled || loading || loadingFiles}
        {...{ id, value, accept, multiple }}
      />

      {types[dView]}
    </fieldset>
  )
}
