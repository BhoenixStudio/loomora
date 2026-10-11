import { ElementType, FormHTMLAttributes } from 'react'
import { cx } from '../../hooks'
import { Button, FormProps, Inputs } from '../index'

export { InputFocus } from './helper'
export type {
  FormProps,
  InputBase,
  InputFieldset,
  InputFocusProps,
  InputHelperAndError,
  InputLabel,
  InputProps,
  InputsWrapperProps,
} from './helper'

export { Input, Inputs } from './Input'

// Modules
export { hasError, InputErrorMessage, InputHelper, resolveErrorHelper } from './Modules/Helper'
export type { InputError, InputErrorMessageProps, InputHelperProps } from './Modules/Helper'

export { Label } from './Modules/Label'
export type { LabelProps } from './Modules/Label'

// Inputs
export { Autocomplete } from './Inputs/Autocomplete'
export type { AutocompleteOption, AutocompleteProps, AutocompleteValue } from './Inputs/Autocomplete/helper'

export { CheckField } from './Inputs/Check'
export type { CheckFieldProps, CheckFieldType } from './Inputs/Check'

export { OtpField } from './Inputs/Otp'
export type { OtpFieldProps } from './Inputs/Otp'

export { PasswordField } from './Inputs/Password'
export { usePasswordHelper } from './Inputs/Password/helper'
export type { PasswordFieldProps, PasswordValidationProps } from './Inputs/Password/helper'

export { PhoneInput } from './Inputs/Phone'
export { phoneFallBackValue, usePhoneHelper } from './Inputs/Phone/helper'
export type { PhoneInputProps, PhonePrefix, PhoneValue } from './Inputs/Phone/helper'

export { RangeField } from './Inputs/Range'
export type { RangeFieldProps, RangeMark } from './Inputs/Range'

export { SearchField } from './Inputs/SearchField'
export type { SearchFieldProps } from './Inputs/SearchField'

export { Select } from './Inputs/Select'
export type { SelectProps, SelectOption } from './Inputs/Select'

export { TextareaField } from './Inputs/Textarea'
export type { TextareaProps } from './Inputs/Textarea'

export { TextEditor } from './Inputs/TextEditor'
export type { TextEditorProps } from './Inputs/TextEditor'

export { useTextEditorData, useExtractHeadingsFromHtml } from './Inputs/TextEditor/helper'
export type { TextEditorDataReturn, UseTextEditorDataProps } from './Inputs/TextEditor/helper'

export { TextField } from './Inputs/TextField'
export type { TextFieldProps } from './Inputs/TextField'

export { UploaderField } from './Inputs/Uploader'
export { EXT_CATEGORIES, useUploaderHelper } from './Inputs/Uploader/helper'
export type {
  FileProps,
  FileCategoryType,
  FileExtType,
  GetFileIconProps,
  UploadFilesProps,
  UploaderFieldProps,
  UploaderFieldViewType,
  UploaderValidation,
  UseUploaderOptions,
  UploaderFieldProperties,
} from './Inputs/Uploader/helper'
export { useUploaderModules } from './Inputs/Uploader/Modules'
export type { UploaderDialogProps } from './Inputs/Uploader/Modules'

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
    <As className={cx(['flex flex-col flex-nowrap', className])} {...{ encType, ...attributes, ...attrs }}>
      {prefix}
      <Inputs {...{ inputs, inputsWrapper, empty }} />
      {suffix}
      {fActions.length > 0 && (
        <div className={cx(['flex flex-wrap', AWClass])} {...AWAttributes} {...AWAttrs}>
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
