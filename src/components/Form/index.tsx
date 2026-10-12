import { ElementType, FormHTMLAttributes } from 'react'
import { cx } from '../../hooks'
import { Button, FormProps, Inputs } from '../index'

export { InputFocus } from './helper'
export type {
  CustomInputProps,
  DividerInputProps,
  EmptyInputProps,
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
export { AutocompleteField } from './Inputs/AutocompleteField'
export type {
  AutocompleteFieldOption,
  AutocompleteFieldProps,
  AutocompleteFieldValue,
} from './Inputs/AutocompleteField/helper'

export { CheckField } from './Inputs/CheckField'
export type { CheckFieldProps, CheckFieldType } from './Inputs/CheckField'

export { ColorField } from './Inputs/ColorField'
export type { ColorFieldProps } from './Inputs/ColorField'

export { PinField } from './Inputs/PinField'
export type { PinFieldProps } from './Inputs/PinField'

export { PasswordField } from './Inputs/PasswordField'
export { usePasswordHelper } from './Inputs/PasswordField/helper'
export type { PasswordFieldProps, PasswordValidationProps } from './Inputs/PasswordField/helper'

export { PhoneInput } from './Inputs/PhoneField'
export { phoneFallBackValue, usePhoneHelper } from './Inputs/PhoneField/helper'
export type { PhoneFieldProps, PhonePrefix, PhoneValue } from './Inputs/PhoneField/helper'

export { RangeField } from './Inputs/RangeField'
export type { RangeFieldProps, RangeMark } from './Inputs/RangeField'

export { RatingField } from './Inputs/RatingField'
export type { RatingFieldProps } from './Inputs/RatingField'

export { SearchField } from './Inputs/SearchField'
export type { SearchFieldProps } from './Inputs/SearchField'

export { SelectField } from './Inputs/SelectField'
export type { SelectOption, SelectProps } from './Inputs/SelectField'

export { TextareaField } from './Inputs/TextareaField'
export type { TextareaFieldProps } from './Inputs/TextareaField'

export { TextEditorField } from './Inputs/TextEditorField'
export type { TextEditorFieldProps } from './Inputs/TextEditorField'

export { useExtractHeadingsFromHtml, useTextEditorData } from './Inputs/TextEditorField/helper'
export type { TextEditorDataReturn, UseTextEditorDataProps } from './Inputs/TextEditorField/helper'

export { TextField } from './Inputs/TextField'
export type { TextFieldProps } from './Inputs/TextField'

export { NumberField } from './Inputs/NumberField'
export type { NumberFieldProps } from './Inputs/NumberField'

export { UploaderField } from './Inputs/UploaderField'
export { EXT_CATEGORIES, useUploaderHelper } from './Inputs/UploaderField/helper'
export type {
  FileCategoryType,
  FileExtType,
  FileProps,
  GetFileIconProps,
  UploaderFieldProperties,
  UploaderFieldProps,
  UploaderFieldViewType,
  UploaderValidation,
  UploadFilesProps,
  UseUploaderOptions,
} from './Inputs/UploaderField/helper'
export { useUploaderModules } from './Inputs/UploaderField/Modules'
export type { UploaderDialogProps } from './Inputs/UploaderField/Modules'

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
