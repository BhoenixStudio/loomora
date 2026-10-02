/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useLoomoraConfig } from '../../../../config'
import { cn, CopyToClipboard } from '../../../../hooks'
import { ProgressBar } from '../../../Partials'
import { Button } from '../../../UI'
import { TextField } from '../TextField'
import { PasswordFieldProps, usePasswordHelper } from './helper'

export function PasswordField(props: PasswordFieldProps) {
  const { t, form } = useLoomoraConfig()

  const {
    prefix,
    suffix,
    properties,
    hasCopy = form?.password?.hasCopy,
    hasGenerate = form?.password?.hasGenerate,
    hasValidation = form?.password?.hasValidation,
    asConfirm = false,
    hasShow = form?.password?.hasShow,
    validationSettings,
    showValidationProgress = form?.password?.showValidationProgress,
    showValidationsList = form?.password?.showValidationsList,
    onValidate,
    confirmValue = '',
    matchText = t('password.confirmMismatch'),
    mismatchText = t('password.confirmMatch'),
    showConfirmIcon,
    onConfirm,
    onShow,
    generateLength = form?.password?.length,
    onGenerate,
    generateText,
    ...inputRest
  } = props

  const { GeneratePassword, ValidatePassword } = usePasswordHelper()

  const { value = '', placeholder = t('password.placeholder'), ...inputProps } = properties ?? {}
  const { items, textColor, progressColor, strength, note, valid } = ValidatePassword(value, validationSettings)

  // States
  const [show, setShow] = useState<boolean>(false)

  // Configs
  const confirmed = String(confirmValue) === String(value) && confirmValue !== ''

  let confirmedSuffix: ReactNode = null
  if (confirmValue !== '') confirmedSuffix = confirmed ? matchText : mismatchText

  const validationList: ReactNode = showValidationsList && (
    <ul
      className={cn([
        'flex flex-col flex-nowrap overflow-hidden',
        'transition-all duration-300 ease-in-out',
        { value: 'max-h-[unset]', fallback: 'max-h-0', condition: valid },
        'gap-1 p-3',
      ])}
    >
      {items?.map(({ icon, message, valid: isValid }, i: number) => (
        <li
          key={i}
          className={cn([
            'flex flex-nowrap text-sm font-medium items-center',
            { value: 'text-body-2/70', fallback: 'text-body-1', condition: isValid },
          ])}
        >
          {icon}
          {message}
        </li>
      ))}
    </ul>
  )
  const generateButton = hasGenerate && (
    <Button
      variant="text"
      color="second"
      size="tiny"
      className={cn([{ value: 'self-end', condition: hasGenerate && !hasValidation }])}
      onClick={HandleGenerate}
    >
      {generateText ?? t('password.generate')}
    </Button>
  )

  let validation: ReactNode = null
  if (hasGenerate && !hasValidation) validation = generateButton
  if (!hasGenerate && hasValidation) validation = validationList
  if (hasGenerate && hasValidation)
    validation = (
      <div
        className={cn([
          'flex flex-nowrap items-start mt-1',
          { value: 'justify-between', fallback: 'justify-end', condition: Boolean(validationList) },
        ])}
      >
        {validationList}
        {generateButton}
      </div>
    )

  // Functions
  function HandleGenerate() {
    const generated = GeneratePassword(generateLength)
    onGenerate?.(generated)
    setShow(true)
  }

  useEffect(() => onValidate?.(valid), [valid])
  useEffect(() => onShow?.(!show), [show])
  useEffect(() => onConfirm?.(confirmed), [confirmed])

  return (
    <TextField
      prefix={
        <>
          {prefix}
          {showConfirmIcon && <>{asConfirm ? form?.password?.confirmingMainIcon : form?.password?.confirmMainIcon}</>}
        </>
      }
      suffix={
        <>
          {suffix}

          {hasShow && (show ? form?.password?.hideIcon : form?.password?.showIcon)}

          {hasCopy && Boolean(value) && (
            <Button onClick={() => CopyToClipboard(String(value))}>{form?.password?.copyIcon}</Button>
          )}

          {(asConfirm || (hasValidation && note)) && (
            <p
              className={cn([
                'text-sm text-uppercase font-medium',
                {
                  value: { value: 'text-success', fallback: 'text-body-1', condition: confirmed },
                  fallback: textColor,
                  condition: asConfirm,
                },
              ])}
            >
              {asConfirm ? confirmedSuffix : note}
            </p>
          )}
        </>
      }
      fieldsetSuffix={
        !asConfirm && (
          <>
            {hasValidation && showValidationProgress && Boolean(value) && (
              <ProgressBar
                height={5}
                outOf={100}
                value={strength ?? 0}
                trackColor={progressColor}
                trackClassName="rounded-b-full"
              />
            )}

            {validation}
          </>
        )
      }
      properties={{ type: show ? 'text' : 'password', value, placeholder, ...inputProps }}
      {...inputRest}
    />
  )
}
