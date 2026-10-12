/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useLoomora } from '../../../../config'
import { copy, cx } from '../../../../hooks'
import { ProgressBar } from '../../../Partials'
import { Button } from '../../../UI'
import { TextField } from '../TextField'
import { PasswordFieldProps, usePasswordHelper } from './helper'

export function PasswordField(props: Readonly<PasswordFieldProps>) {
  const { t, form } = useLoomora()

  const {
    prefix,
    suffix,
    properties,
    hasCopy = form?.passwordField?.hasCopy,
    hasGenerate = form?.passwordField?.hasGenerate,
    hasValidation = form?.passwordField?.hasValidation,
    asConfirm = false,
    hasShow = form?.passwordField?.hasShow,
    validationSettings,
    showValidationProgress = form?.passwordField?.showValidationProgress,
    showValidationsList = form?.passwordField?.showValidationsList,
    onValidate,
    confirmValue = '',
    matchText = t('passwordField.confirmMismatch'),
    mismatchText = t('passwordField.confirmMatch'),
    showConfirmIcon,
    onConfirm,
    onShow,
    generateLength = form?.passwordField?.length,
    onGenerate,
    generateText,
    ...inputRest
  } = props

  const { GeneratePassword, ValidatePassword } = usePasswordHelper()

  const { value = '', placeholder = t('passwordField.placeholder'), ...inputProps } = properties ?? {}
  const { items, textColor, progressColor, strength, note, valid } = ValidatePassword(value, validationSettings)

  // States
  const [show, setShow] = useState<boolean>(false)

  // Configs
  const confirmed = String(confirmValue) === String(value) && confirmValue !== ''

  let confirmedSuffix: ReactNode = null
  if (confirmValue !== '') confirmedSuffix = confirmed ? matchText : mismatchText

  const validationList: ReactNode = showValidationsList && (
    <ul
      className={cx([
        'flex flex-col flex-nowrap overflow-hidden',
        'transition-all duration-300 ease-in-out',
        { value: 'max-h-[unset]', fallback: 'max-h-0', condition: valid },
        'gap-1 p-3',
      ])}
    >
      {items?.map(({ icon, message, valid: isValid }, i: number) => (
        <li
          key={i}
          className={cx([
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
      className={cx([{ value: 'self-end', condition: hasGenerate && !hasValidation }])}
      onClick={HandleGenerate}
    >
      {generateText ?? t('passwordField.generate', { length: form?.passwordField?.length })}
    </Button>
  )

  let validation: ReactNode = null
  if (hasGenerate && !hasValidation) validation = generateButton
  if (!hasGenerate && hasValidation) validation = validationList
  if (hasGenerate && hasValidation)
    validation = (
      <div
        className={cx([
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
          {showConfirmIcon && (
            <>{asConfirm ? form?.passwordField?.confirmingMainIcon : form?.passwordField?.confirmMainIcon}</>
          )}
        </>
      }
      suffix={
        <>
          {suffix}

          {hasShow && (show ? form?.passwordField?.hideIcon : form?.passwordField?.showIcon)}

          {hasCopy && Boolean(value) && (
            <Button onClick={() => copy(String(value))}>{form?.passwordField?.copyIcon}</Button>
          )}

          {(asConfirm || (hasValidation && note)) && (
            <p
              className={cx([
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
