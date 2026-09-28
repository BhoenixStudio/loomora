import { ElementType, FormHTMLAttributes } from 'react'
import { cn } from '../../hooks'
import { Button, FormProps, Inputs } from '../index'

export * from './helper'
export * from './Input'

// Modules
export * from './Modules/Helper'
export * from './Modules/Label'

// Inputs
export * from './Inputs/Autocomplete'
export * from './Inputs/Autocomplete/helper'
export * from './Inputs/Check'
export * from './Inputs/Otp'
export * from './Inputs/Password'
export * from './Inputs/Password/helper'
export * from './Inputs/Phone'
export * from './Inputs/Phone/helper'
export * from './Inputs/Range'
export * from './Inputs/SearchField'
export * from './Inputs/Select'
export * from './Inputs/Textarea'
export * from './Inputs/TextEditor'
export * from './Inputs/TextEditor/helper'
export * from './Inputs/TextField'
export * from './Inputs/Uploader'
export * from './Inputs/Uploader/helper'
export * from './Inputs/Uploader/Modules'

export function Form<T extends ElementType = 'form'>(props: Readonly<FormProps<T>>) {
  const {
    as: As = 'form',
    prefix,
    suffix,
    inputs = [],
    inputsWrapper,
    className = 'gap-2',
    attributes,
    actions = [],
    actionWrapper,
    loading,
    condition,
    actionsPrefix,
    actionsSuffix,
    empty,
    ...attrs
  } = props

  const {
    className: AWClass = 'items-center justify-end gap-3',
    attributes: AWAttributes,
    ...AWAttrs
  } = actionWrapper ?? {}

  const { encType = 'multipart/form-data' } = (attributes ?? {}) as FormHTMLAttributes<HTMLFormElement>

  // Configs
  const fActions = actions?.filter(({ condition }) => condition !== false)

  if (condition === false) return null
  return (
    <As className={cn(['flex flex-col flex-nowrap', className])} {...{ encType, ...attributes, ...attrs }}>
      {prefix}
      <Inputs {...{ inputs, inputsWrapper, empty }} />
      {suffix}
      {fActions.length > 0 && (
        <div className={cn(['flex flex-wrap', AWClass])} {...AWAttributes} {...AWAttrs}>
          {actionsPrefix}
          {fActions.map(({ color = 'second', loading: bLoading, ...rest }, i: number) => (
            <Button key={i} {...{ color, ...rest }} loading={bLoading ?? loading} />
          ))}
          {actionsSuffix}
        </div>
      )}
    </As>
  )
}
