'use client'

import { DragEvent, ElementType, MouseEvent, ReactNode, useState } from 'react'
import { useLoomoraConfig } from '../../../../config'
import { cn, UseToggle } from '../../../../hooks'
import { Button, ButtonProps, Dialog, DialogProps } from '../../../UI'
import { FileProps, UploaderFieldProperties, UploaderFieldProps, UploaderValidation, useUploaderHelper } from './helper'
import { Loader } from '../../../Partials'

type UBase<T extends string | number> = Pick<UploaderFieldProps<T>, 'wrapper' | 'prefix' | 'suffix' | 'loading'>
type PropertiesBase<T extends string | number> = Pick<UploaderFieldProperties<T>, 'showProgress' | 'progressAttrs'>

type ModuleFileProps<T extends string | number = number> = {
  previews: FileProps<T>[]
  emptyState?: ReactNode
  showOnly?: number
}

type GetImageProps<T extends string | number = number> = {
  preview: FileProps<T>
  icon: ReactNode
  width: number
  height: number
  className: string
  iconClassName: string
  hasDim?: boolean
  dimClassName?: string
  hasImageAssigned: boolean
}

export type UploaderDialogProps<T extends string | number = number> = {
  dialog?: DialogProps
  button: ButtonProps
  items: FileProps<T>[]
  emptyState?: ReactNode
  onRemove?: (file: FileProps<T>) => void
  loading?: boolean
  extensions?: UploaderValidation['accept']
}

interface ModuleProps<T extends string | number = number> extends UBase<T>, PropertiesBase<T>, ModuleFileProps<T> {
  label?: ReactNode
  error?: ReactNode
  rules?: string[]
  allowance?: string[]
  hasFiles?: boolean
  progress: number
  isDragging: boolean
  disabled?: boolean
  extensions?: UploaderValidation['accept']
  onClick: (e: MouseEvent<HTMLDivElement> | MouseEvent<HTMLButtonElement>) => void
  onDragOver: (e: DragEvent<HTMLDivElement>) => void
  onDragLeave: (e: DragEvent<HTMLDivElement>) => void
  onDrop: (e: DragEvent<HTMLDivElement>) => void
  onMouseEnter: (e: MouseEvent<HTMLDivElement>) => void
  onMouseLeave: (e: MouseEvent<HTMLDivElement>) => void
  onRemove?: (file: FileProps<T>) => void
}

export function useUploaderModules<T extends string | number = number>(props: Readonly<ModuleProps<T>>) {
  const { t, form } = useLoomoraConfig()

  const {
    previews = [],
    wrapper,
    label,
    error,
    prefix,
    suffix,
    rules = [],
    allowance = [],
    hasFiles = false,
    showProgress,
    progress,
    progressAttrs,
    loading,
    disabled = false,
    extensions,
    onClick,
    onDragOver,
    onDragLeave,
    onDrop,
    onMouseEnter,
    onMouseLeave,
    onRemove,
    isDragging,
    emptyState,
    showOnly,
  } = props

  const { className: wrapperClass = `${form?.uploader?.minBlockHeight} p-3`, ...restWrapper } = wrapper ?? {}
  const { className: progressClass = 'w-full', color = form?.uploader?.progressColor } = progressAttrs ?? {}

  const { getIcon, calcFileSize } = useUploaderHelper()

  // Configs
  const As: ElementType = 'div'
  const preview = previews?.[0]
  const thumbs = showOnly ? previews.slice(0, showOnly) : previews
  const hasMoreThumbs = showOnly ? previews.length - showOnly > 0 : false
  const list = showOnly ? previews.slice(0, showOnly) : previews
  const hasMoreList = showOnly ? previews.length - showOnly > 0 : false

  const { icon, hasImageAssigned = false } = getIcon({ file: preview, extensions })

  const rulesComp = rules.length > 0 && (
    <div
      className={cn([
        'flex flex-col items-center text-[10px] text-body-2 gap-0.5 mt-1 pointer-events-none',
        { value: 'text-white', fallback: 'text-body-1', condition: hasFiles },
      ])}
    >
      {rules.map((rule, i) => (
        <span key={i}>{rule}</span>
      ))}
    </div>
  )
  const allowanceComp = allowance.length > 0 && (
    <div
      className={cn([
        'flex flex-col flex-nowrap items-center gap-1 text-[10px] text-body-3 mt-2 pointer-events-none',
        { value: 'text-white', fallback: 'text-body-2', condition: hasFiles },
      ])}
    >
      {allowance.join(', ')}
    </div>
  )
  const progressComp = showProgress && loading && (
    <div
      className={cn([
        'bg-third rounded-full pointer-events-none h-1 overflow-hidden',
        { value: color, fallback: 'text-body-1', condition: Boolean(color) },
        progressClass,
      ])}
    >
      <div className="h-full bg-current transition-all duration-300 ease-in-out" style={{ width: `${progress}%` }} />
    </div>
  )
  const dropFilesNote = isDragging && (
    <div className="flex flex-col flex-nowrap absolute inset-0 z-20 w-full h-full bg-second rounded-[inherit] justify-center items-center text-lg font-medium text-title-1 pointer-events-none gap-1">
      {t('uploader.dropFilesHere.title')}
      <p className="font-normal text-sm text-body-2">{t('uploader.dropFilesHere.description')}</p>
    </div>
  )
  const updateButton = (
    <Button
      type="button"
      title={t('uploader.actions.update')}
      startIcon="ph:upload"
      color="second"
      size="small"
      corner="small"
      onClick={onClick}
    />
  )
  const viewButton = (
    <Button
      attributes={{ 'aria-label': t('uploader.actions.view') }}
      startIcon="icon-park-twotone:preview-open"
      color="second"
      size="small"
      corner="small"
      href={preview.url}
      target="_blank"
      referrerPolicy="no-referrer"
    />
  )
  const deleteButton = onRemove && (
    <Button
      type="button"
      attributes={{ 'aria-label': t('uploader.actions.removeFile') }}
      startIcon="qlementine-icons:trash-16"
      color="second"
      size="small"
      corner="small"
      onClick={() => onRemove(preview)}
    />
  )

  // Functions
  const getImage = (props: GetImageProps<T>) => {
    const {
      preview,
      icon,
      width,
      height,
      className,
      iconClassName,
      hasImageAssigned,
      hasDim = false,
      dimClassName,
    } = props
    if (hasImageAssigned && preview)
      return (
        <>
          <img src={preview.url} alt={String(preview.name)} {...{ width, height, className }} />
          {hasDim && <span className={dimClassName} />}
        </>
      )
    return <span className={iconClassName}>{icon}</span>
  }

  // Modules
  const UploaderDialog = (props: Readonly<UploaderDialogProps<T>>) => {
    const { dialog, button, items, extensions, emptyState, onRemove, loading } = props

    const { onClick, ...restButton } = button ?? {}
    const { position = 'end', ...restDialog } = dialog ?? {}

    // States
    const [open, setOpen] = useState<boolean>(false)
    const [show, setShow] = useState<boolean>(false)

    // Configs
    let content: ReactNode = items.map((file, i: number) => {
      const { id, name = t('uploader.item.number', { number: i + 1 }), size, ext, url } = file
      const { icon, hasImageAssigned } = getIcon({ file, extensions })

      const data: { label: string; condition: boolean }[] = [
        { label: t('uploader.item.id', { id: String(id) }), condition: Boolean(id) },
        { label: t('uploader.item.size', { size: calcFileSize(Number(size)) }), condition: Boolean(size) },
        { label: t('uploader.item.ext', { ext: String(ext) }), condition: Boolean(ext) },
      ]
      const actions: ButtonProps[] = [
        {
          startIcon: 'qlementine-icons:eye-16',
          attributes: { 'aria-label': t('uploader.actions.view') },
          href: url,
          target: '_blank',
          referrerPolicy: 'no-referrer',
        },
        {
          startIcon: 'qlementine-icons:trash-16',
          attributes: { 'aria-label': t('uploader.actions.removeFile') },
          color: 'error',
          onClick: () => onRemove?.(file),
          condition: Boolean(onRemove),
        },
      ]

      return (
        <li key={i} className="flex flex-nowrap items-center gap-3">
          <div className="flex flex-nowrap relative rounded-lg overflow-hidden w-20 h-20 shrink-0">
            {getImage({
              width: 256,
              height: 256,
              className: 'absolute inset-0 w-full h-full object-cover',
              iconClassName:
                'absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[75%] h-[75%] opacity-10 pointer-events-none z-[-1]',
              hasImageAssigned,
              preview: file,
              icon,
            })}
          </div>

          <div className="flex flex-col w-full">
            <p className="text-sm text-title-1 font-medium mb-1">{name}</p>
            {data
              .filter(({ condition }) => condition)
              .map(({ label }, j: number) => (
                <p key={j} className="text-xs text-body-2">
                  {label}
                </p>
              ))}
          </div>
          {actions.map((action, k) => (
            <Button key={k} {...action} />
          ))}
        </li>
      )
    })
    if (loading)
      content = (
        <li>
          <Loader counts={4} height={60} />
        </li>
      )
    else if (items.length === 0) content = <li>{emptyState}</li>

    return (
      <>
        <Button
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick={(e: any) => {
            UseToggle('toggle', { open, setOpen, setShow })
            onClick?.(e)
          }}
          {...restButton}
        />

        <Dialog {...{ open, setOpen, show, setShow, position, ...restDialog }}>
          <p className="text-lg font-medium text-title-2 mb-5">{t('uploader.dialogTitle')}</p>
          <ul className="flex flex-nowrap flex-col gap-3">{content}</ul>
        </Dialog>
      </>
    )
  }

  const UploaderBackground = () => (
    <>
      <As
        className={cn([
          'flex flex-col flex-nowrap items-center relative isolate overflow-hidden w-full',
          { value: 'cursor-not-allowed', fallback: 'cursor-pointer', condition: disabled },
          wrapperClass,
        ])}
        {...{ onDragOver, onDragLeave, onDrop, onMouseEnter, onMouseLeave, ...restWrapper }}
      >
        <button
          type="button"
          title="uploader"
          className="absolute inset-0 w-full h-full z-[-1] cursor-pointer"
          {...{ onClick }}
        />

        {getImage({
          width: 256,
          height: 256,
          hasDim: true,
          className: 'absolute inset-0 w-full h-full object-cover z-[-3] pointer-events-none',
          dimClassName: 'absolute inset-0 w-full h-full bg-black/30 object-cover z-[-2] pointer-events-none',
          iconClassName:
            'absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[75%] h-[75%] opacity-10 pointer-events-none z-[-1]',
          hasImageAssigned,
          preview,
          icon,
        })}

        {label}
        {prefix}
        {rulesComp}
        {allowanceComp}
        {progressComp}
        {dropFilesNote}
        {suffix}

        {preview?.url && (
          <div className="flex flex-nowrap items-center gap-2 mt-3">
            {updateButton}
            {viewButton}
            {deleteButton}
          </div>
        )}
      </As>

      {error}
    </>
  )

  const UploaderProfilePicture = () => (
    <As
      className={cn(['flex flex-nowrap items-center justify-center relative isolate w-full gap-3', wrapperClass])}
      {...{ onDragOver, onDragLeave, onDrop, onMouseEnter, onMouseLeave, ...restWrapper }}
    >
      <As
        className={cn([
          'flex flex-nowrap relative isolate overflow-hidden rounded-full w-30 h-30 border-4 border-third',
          { value: 'cursor-not-allowed', fallback: 'cursor-pointer', condition: disabled },
        ])}
        {...{ onClick }}
      >
        {getImage({
          width: 256,
          height: 256,
          className: 'absolute inset-0 w-full h-full object-cover',
          iconClassName:
            'absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[75%] h-[75%] opacity-10 pointer-events-none z-[-1]',
          hasImageAssigned,
          preview,
          icon,
        })}
      </As>
      <div className="flex flex-col flex-nowrap items-start">
        {label}
        {prefix}
        {rulesComp}
        {allowanceComp}
        {progressComp}
        {suffix}

        <div className="flex flex-nowrap items-center gap-2 mt-1">
          {updateButton}
          {preview?.url && (
            <>
              {viewButton}
              {deleteButton}
            </>
          )}
        </div>
        {error}
      </div>
      {dropFilesNote}
    </As>
  )

  const UploaderThumbs = () => (
    <>
      <As
        className={cn([
          'flex flex-col flex-nowrap items-center relative isolate overflow-hidden w-full',
          { value: 'cursor-not-allowed', fallback: 'cursor-pointer', condition: disabled },
          wrapperClass,
        ])}
        {...{ onDragOver, onDragLeave, onDrop, onMouseEnter, onMouseLeave, onClick, ...restWrapper }}
      >
        <span
          className={cn([
            'absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[75%] h-[75%] opacity-10 pointer-events-none z-[-1]',
          ])}
        >
          {icon}
        </span>

        {label}
        {prefix}
        {rulesComp}
        {allowanceComp}
        {progressComp}
        {dropFilesNote}
        {suffix}
      </As>
      {error}

      {previews.length > 0 && (
        <ul className="flex flex-wrap items-center gap-2">
          {thumbs.map((file, i) => {
            const { url } = file
            const { icon, hasImageAssigned } = getIcon({ file, extensions })
            return (
              <li key={i} className="flex flex-nowrap relative rounded-lg overflow-hidden w-20 h-20">
                <Button
                  variant="none"
                  attributes={{ 'aria-label': t('uploader.actions.view') }}
                  href={url}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="w-full h-full"
                >
                  {getImage({
                    width: 256,
                    height: 256,
                    className: 'absolute inset-0 w-full h-full object-cover',
                    iconClassName:
                      'absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[75%] h-[75%] opacity-10 pointer-events-none',
                    hasImageAssigned,
                    preview: file,
                    icon,
                  })}
                </Button>
                {onRemove && (
                  <Button
                    type="button"
                    color="error"
                    size="tiny"
                    attributes={{ 'aria-label': t('uploader.actions.removeFile') }}
                    startIcon="qlementine-icons:trash-16"
                    className="absolute top-1 inset-e-1"
                    onClick={() => onRemove(file)}
                  />
                )}
              </li>
            )
          })}
          {hasMoreThumbs && (
            <li className="flex flex-nowrap relative rounded-lg w-20 h-20">
              <UploaderDialog
                button={{ type: 'button', title: `+${previews.length - (showOnly ?? 0)}` }}
                items={previews}
                {...{ onRemove, emptyState, extensions, loading }}
              />
            </li>
          )}
        </ul>
      )}
    </>
  )

  const UploaderList = () => (
    <>
      <As
        className={cn([
          'flex flex-col flex-nowrap items-center relative isolate overflow-hidden w-full',
          { value: 'cursor-not-allowed', fallback: 'cursor-pointer', condition: disabled },
          wrapperClass,
        ])}
        {...{ onDragOver, onDragLeave, onDrop, onMouseEnter, onMouseLeave, onClick, ...restWrapper }}
      >
        <span
          className={cn([
            'absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[75%] h-[75%] opacity-10 pointer-events-none z-[-1]',
          ])}
        >
          {icon}
        </span>

        {label}
        {prefix}
        {rulesComp}
        {allowanceComp}
        {progressComp}
        {dropFilesNote}
        {suffix}
      </As>
      {error}

      {previews.length > 0 && (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
          {list.map((file, i) => {
            const { id, name = t('uploader.item.number', { number: i + 1 }), size, ext, url } = file
            const { icon, hasImageAssigned } = getIcon({ file, extensions })

            const data: { label: string; condition: boolean }[] = [
              { label: t('uploader.item.id', { id: String(id) }), condition: Boolean(id) },
              { label: t('uploader.item.size', { size: calcFileSize(Number(size)) }), condition: Boolean(size) },
              { label: t('uploader.item.ext', { ext: String(ext) }), condition: Boolean(ext) },
            ]
            const actions: ButtonProps[] = [
              {
                startIcon: 'qlementine-icons:eye-16',
                attributes: { 'aria-label': t('uploader.actions.view') },
                href: url,
                target: '_blank',
                referrerPolicy: 'no-referrer',
              },
              {
                type: 'button',
                startIcon: 'qlementine-icons:trash-16',
                attributes: { 'aria-label': t('uploader.actions.removeFile') },
                color: 'error',
                onClick: () => onRemove?.(file),
                condition: Boolean(onRemove),
              },
            ]

            return (
              <li key={i} className="flex flex-nowrap items-start bg-second py-1 px-2 rounded-lg gap-3">
                <div className="flex flex-nowrap relative rounded-lg overflow-hidden w-15 h-15 shrink-0">
                  {getImage({
                    width: 256,
                    height: 256,
                    className: 'absolute inset-0 w-full h-full object-cover',
                    iconClassName:
                      'absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[75%] h-[75%] opacity-10 pointer-events-none',
                    hasImageAssigned,
                    preview: file,
                    icon,
                  })}
                </div>
                <div className="flex flex-col w-full">
                  <p className="text-sm text-title-1 font-medium mb-1 truncate">{name}</p>
                  {data
                    .filter(({ condition }) => condition)
                    .map(({ label }, j: number) => (
                      <p key={j} className="text-xs text-body-2">
                        {label}
                      </p>
                    ))}
                </div>
                {actions
                  .filter(({ condition }) => condition !== false)
                  .map(({ size = 'tiny', ...action }, k) => (
                    <Button key={k} {...{ size, ...action }} />
                  ))}
              </li>
            )
          })}
          {hasMoreList && (
            <li className="md:col-span-2 flex flex-nowrap relative">
              <UploaderDialog
                button={{ type: 'button', title: `+${previews.length - (showOnly ?? 0)}`, className: 'w-full' }}
                items={previews}
                {...{ onRemove, emptyState, extensions, loading }}
              />
            </li>
          )}
        </ul>
      )}
    </>
  )

  return { UploaderBackground, UploaderProfilePicture, UploaderThumbs, UploaderList }
}
