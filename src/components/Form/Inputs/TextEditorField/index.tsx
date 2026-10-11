'use client'

import { Editor, IAllProps } from '@tinymce/tinymce-react'
import { useId, useRef, useState } from 'react'
import {
  InputBase,
  InputErrorMessage,
  InputFieldset,
  InputHelper,
  InputHelperAndError,
  InputLabel,
  Label,
  LabelProps,
  Loader,
} from '../../..'
import { useLoomora } from '../../../../config'
import { cx, hasProps } from '../../../../hooks'
import { ConditionalWrapper } from '../../../Helper'

type TinyMCEEditor = Parameters<NonNullable<IAllProps['onInit']>>[1]
type InitOptions = NonNullable<IAllProps['init']>

type InputProps = {
  initialValue?: string
  value?: string
  onChange?: (content: string) => void
  onBlur?: (content: string) => void
  required?: boolean
  disabled?: boolean
  height?: InitOptions['height']
  menubar?: InitOptions['menubar']
  plugins?: InitOptions['plugins']
  toolbar?: InitOptions['toolbar']
  dir?: InitOptions['directionality']
  language?: InitOptions['language']
}

export interface TextEditorFieldProps
  extends InputBase, Omit<InputFieldset, 'fieldsetPrefix' | 'fieldsetSuffix'>, InputLabel, InputHelperAndError {
  properties?: InputProps
}

export function TextEditorField(props: Readonly<TextEditorFieldProps>) {
  const { size = [], properties, fieldset, label, inputHelper, errors, loading = false, condition } = props

  const editorRef = useRef<TinyMCEEditor | null>(null)
  const editorId = `loomora-editor-${useId().replaceAll(':', '')}`

  const { t, form, settings } = useLoomora()

  const {
    className: fieldsetClass = form?.fieldset?.className,
    style: fieldsetStyle,
    attributes: fieldsetAttrs,
    ...restFieldset
  } = fieldset ?? {}
  const {
    initialValue,
    value,
    onChange,
    onBlur,
    height = 420,
    menubar = 'edit view insert format',
    plugins = [
      'advlist',
      'autolink',
      'lists',
      'link',
      'image',
      'charmap',
      'preview',
      'anchor',
      'pagebreak',
      'searchreplace',
      'visualblocks',
      'code',
      'fullscreen',
      'wordcount',
      'visualchars',
      'nonbreaking',
      'insertdatetime',
      'media',
      'table',
      'save',
      'directionality',
      'emoticons',
    ],
    toolbar = 'fontfamily | fontsize | h2 h3 h4 | bold italic forecolor backcolor alignleft aligncenter alignright alignjustify bullist numlist | link image media table emoticons blockquote | outdent indent | ltr rtl removeformat | fullscreen preview',
    dir = settings?.isRtl ? 'rtl' : 'ltr',
    language = settings?.locale,
    required,
    disabled,
  } = properties ?? {}

  // States
  const [initLoading, setInitLoading] = useState<boolean>(true)

  let labelClass: string = '',
    restLabel: LabelProps = { children: '' }
  if (hasProps(label, 'children')) {
    const { className: lCN, ...restOfLabel } = label ?? {}
    labelClass = lCN ?? ''
    restLabel = restOfLabel
  }
  const labelClassName = cx(['flex-nowrap items-center px-3 py-1', labelClass])

  if (condition === false) return null
  return (
    <fieldset
      className={cx(['text-editor-field flex flex-col flex-nowrap relative', ...size, fieldsetClass])}
      style={{ ...((loading || initLoading) && { height }), ...fieldsetStyle }}
      {...fieldsetAttrs}
      {...restFieldset}
    >
      <ConditionalWrapper childrenCondition={Boolean(label)}>
        {hasProps(label, 'children') ? (
          <Label className={labelClassName} {...{ required, ...restLabel }} />
        ) : (
          <Label className={labelClassName} {...{ required }}>
            {label}
          </Label>
        )}
      </ConditionalWrapper>

      {(loading || initLoading) && (
        <div className="flex flex-col flex-nowrap bg-main gap-1 p-3">
          <Loader height={40} variant="rounded" />
          <Loader height={40} variant="rounded" />
          <Loader height="100%" variant="rounded" />
          <Loader height={30} variant="rounded" />
        </div>
      )}

      <Editor
        id={editorId}
        tinymceScriptSrc="/js/tinymce/tinymce.min.js"
        licenseKey="gpl"
        onInit={(_, editor) => {
          setInitLoading(false)
          editorRef.current = editor
        }}
        initialValue={initialValue}
        value={value}
        onEditorChange={(content) => onChange?.(content)}
        onBlur={(_, editor) => onBlur?.(editor.getContent())}
        init={{
          height,
          menubar,
          plugins,
          toolbar,
          language,
          directionality: dir,
          promotion: false,
          relative_urls: false,
          browser_spellcheck: true,
          menu: {
            edit: {
              title: t('textEditorField.menusEdit') ?? '',
              items:
                'searchreplace spellchecker spellcheckerlanguage a11ycheck | undo redo | cut copy paste pastetext | selectall',
            },
            view: {
              title: t('textEditorField.menusView') ?? '',
              items:
                'code wordcount | preview fullscreen | visualaid visualchars visualblocks | showcomments | export print | restoredraft deleteallconversations',
            },
            insert: {
              title: t('textEditorField.menusInsert') ?? '',
              items:
                'image link media codesample | charmap emoticons | hr pagebreak nonbreaking anchor tableofcontents | insertdatetime',
            },
            format: {
              title: t('textEditorField.menusFormat') ?? '',
              items:
                'underline strikethrough superscript subscript codeformat lineheight | blocks | language | removeformat',
            },
          },
        }}
        disabled={disabled || loading}
      />

      <ConditionalWrapper childrenCondition={Boolean(inputHelper)}>
        {hasProps(inputHelper, 'children') ? (
          <InputHelper {...inputHelper} />
        ) : (
          <InputHelper>{inputHelper}</InputHelper>
        )}
      </ConditionalWrapper>

      <InputErrorMessage {...{ errors }} />
    </fieldset>
  )
}
