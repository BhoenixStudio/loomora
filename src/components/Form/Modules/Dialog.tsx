'use client'

import { ElementType, ReactNode } from 'react'
import { UseToggle } from '../../../hooks'
import { useResponsive } from '../../../utils'
import { Button, Dialog, DialogProcess, DialogProps } from '../../UI'
import { FormProps } from '../helper'
import { useLoomoraConfig } from '../../../config'

export type DialogFormProps<T extends ElementType = 'form'> = FormProps<T> &
  DialogProcess & { dialog?: DialogProps; title?: ReactNode }

export function DialogForm(props: DialogFormProps) {
  const { t } = useLoomoraConfig()

  const { title = t('form.dialogTitle'), open, setOpen, show, setShow, dialog, condition } = props

  const { isMobile } = useResponsive()

  const {
    position = 'end',
    width = isMobile ? '90vw' : '45vw',
    className = 'bg-main rounded-xl p-6',
    onClose,
    ...restDialog
  } = dialog ?? {}

  if (condition === false) return null
  return (
    <Dialog {...{ open, setOpen, show, setShow, position, width, className, onClose, ...restDialog }}>
      <div className="flex flex-nowrap items-center justify-between text-title-1 font-semibold mb-6">
        {title}

        <Button
          color="third"
          variant="text"
          startIcon="zondicons:close-outline"
          attributes={{ 'aria-label': t('form.dialogCloseTitle') }}
          onClick={() => {
            UseToggle('close', { open, setOpen, setShow })
            onClose?.()
          }}
        />
      </div>

      {/* <Form {...form} /> */}
    </Dialog>
  )
}
