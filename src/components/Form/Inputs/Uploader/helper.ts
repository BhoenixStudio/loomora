'use client'

import {
  ChangeEvent,
  Dispatch,
  DragEvent,
  InputHTMLAttributes,
  MouseEvent,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useLoomoraConfig } from '../../../../config'
import { GlobalElementEssentials, TWColorSName } from '../../../../types'
import { InputBase, InputFieldset, InputHelperAndError, InputLabel } from '../../helper'

export const EXT_CATEGORIES = {
  all: ['all'],
  image: ['image', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.ico', '.bmp', '.tiff', '.avif'],
  text: ['text', '.txt', '.csv', '.md', '.html', '.css', '.js', '.json', '.xml'],
  files: ['files', '.pdf', '.zip', '.rar', '.7z', '.tar', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'],
  video: ['video', '.mp4', '.webm', '.mov', '.mkv', '.avi', '.flv'],
  audio: ['audio', '.mp3', '.wav', '.ogg', '.aac', '.m4a'],
  executable: ['apk', 'exe', 'msi'],
  application: [
    'application',
    'json-app',
    'xml-app',
    'pdf-app',
    'zip-app',
    'msword',
    'docx-app',
    'xlsx-app',
    'pptx-app',
  ],
} as const

export type FileCategoryType = keyof typeof EXT_CATEGORIES
export type FileExtType = (typeof EXT_CATEGORIES)[keyof typeof EXT_CATEGORIES][number]

export type FileProps<T extends string | number = number> = {
  id?: T
  url: string
  name?: string
  ext?: string
  size?: number | string
  type?: string
}

export type UploaderValidation = { accept?: FileExtType[] } & Partial<
  Record<'minFilesSize' | 'maxFilesSize' | 'maxSize' | 'minSize' | 'maxFiles' | 'minFiles', number>
>

export type UploaderFieldViewType = 'thumbs' | 'list' | 'background' | 'profilePicture'

export type UploaderFieldSingleProps<T extends string | number = number> = Partial<
  Record<'maxFiles' | 'minFiles' | 'minFilesSize' | 'maxFilesSize', never>
> & {
  multiple?: false
  value?: FileProps<T>
  onChange?: (file: FileProps<T>, nativeFile: File, valid: boolean) => void
  onDragOver?: (file: FileProps<T>, nativeFile: File, valid: boolean) => void
  onDragLeave?: (file: FileProps<T>, nativeFile: File, valid: boolean) => void
  onDrop?: (file: FileProps<T>, nativeFile: File, valid: boolean) => void
  onPaste?: (file: FileProps<T>, nativeFile: File, valid: boolean) => void
  viewType?: Extract<UploaderFieldViewType, 'background' | 'profilePicture'>
  emptyState?: never
}
export type UploaderFieldMultipleProps<T extends string | number = number> = Pick<
  UploaderValidation,
  'maxFiles' | 'minFiles' | 'minFilesSize' | 'maxFilesSize'
> & {
  multiple: true
  value?: FileProps<T>[]
  onChange?: (files: FileProps<T>[], nativeFiles: File[], valid: boolean) => void
  onDragOver?: (files: FileProps<T>[], nativeFiles: File[], valid: boolean) => void
  onDragLeave?: (files: FileProps<T>[], nativeFiles: File[], valid: boolean) => void
  onDrop?: (files: FileProps<T>[], nativeFiles: File[], valid: boolean) => void
  onPaste?: (files: FileProps<T>[], nativeFiles: File[], valid: boolean) => void
  viewType?: Extract<UploaderFieldViewType, 'thumbs' | 'list'>
  emptyState?: ReactNode
  showOnly?: number
}

export type UploadFilesProps<T extends string | number = number> = {
  preview?: FileProps<T>
  previews?: FileProps<T>[]
  setValue: Dispatch<SetStateAction<InputHTMLAttributes<HTMLInputElement>['value']>>
  setLoading: Dispatch<SetStateAction<boolean>>
  setFile?: UploaderFieldSingleProps<T>['onChange']
  setFiles?: UploaderFieldMultipleProps<T>['onChange']
  setErrors: Dispatch<SetStateAction<string[]>>
  setProgress: Dispatch<SetStateAction<number>>
  validation?: UploaderValidation & { multiple?: boolean }
}

export type GetFileIconProps<T extends string | number = number> = {
  file?: FileProps<T>
  extensions: UploaderValidation['accept']
  length?: number
}
export type GetFileIconReturn = { icon: ReactNode; hasImageAssigned: boolean }

export type UseUploaderOptions<T extends string | number = number> = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  'name' | 'disabled' | 'required' | 'id' | 'placeholder'
> &
  Pick<UploaderValidation, 'accept' | 'maxSize' | 'minSize'> & {
    showProgress?: boolean
    allowPaste?: boolean
    allowDragAndDrop?: boolean
    onRemove?: (file: FileProps<T>) => void
    onError?: (errors: string[]) => void
  } & (UploaderFieldSingleProps<T> | UploaderFieldMultipleProps<T>)

export type UseUploaderReturn<T extends string | number = number> = {
  inputRef: React.RefObject<HTMLInputElement | null>
  inputProps: InputHTMLAttributes<HTMLInputElement>
  click: (e?: MouseEvent<HTMLElement>) => void
  files: FileProps<T>[]
  file: FileProps<T> | undefined
  removeFile: (target: FileProps<T>) => void
  setFiles: Dispatch<SetStateAction<FileProps<T>[]>>
  setFile: Dispatch<SetStateAction<FileProps<T> | undefined>>
  isLoading: boolean
  isDragging: boolean
  progress: number
  errors: string[]
  handleChange: (files: FileList | null) => void
  handleDragOver: (e: DragEvent<HTMLElement>) => void
  handleDragLeave: (e: DragEvent<HTMLElement>) => void
  handleDrop: (e: DragEvent<HTMLElement>) => void
  handleMouseEnter: () => void
  handleMouseLeave: () => void
}

export type UploaderFieldProperties<T extends string | number = number> = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  'name' | 'disabled' | 'required' | 'id' | 'placeholder'
> &
  Pick<UploaderValidation, 'accept' | 'maxSize' | 'minSize'> & {
    showProgress?: boolean
    progressAttrs?: { color?: TWColorSName<'text'>; className?: string }
    allowPaste?: boolean
    allowDragAndDrop?: boolean
    onClick?: (e: MouseEvent<HTMLDivElement>) => void
    onMouseEnter?: (e: MouseEvent<HTMLDivElement>) => void
    onMouseLeave?: (e: MouseEvent<HTMLDivElement>) => void
    onRemove?: (file: FileProps<T>) => void
  } & (UploaderFieldSingleProps<T> | UploaderFieldMultipleProps<T>)

export interface UploaderFieldProps<T extends string | number = number>
  extends InputBase, Pick<InputFieldset, 'fieldset'>, InputLabel, InputHelperAndError {
  wrapper?: Omit<GlobalElementEssentials<'div'>, 'attributes'>
  prefix?: ReactNode | ReactNode[]
  suffix?: ReactNode | ReactNode[]
  properties?: UploaderFieldProperties<T>
}

export function useUploaderHelper() {
  const { t, form } = useLoomoraConfig()

  // Functions
  const acceptRules = (exts: FileExtType[] = form?.uploader?.defaultFileCategory ?? ['all']) => {
    if (exts.includes('all')) return { accept: '*/*', rules: [] }

    const isCategory = (val: string): val is FileCategoryType => Object.keys(EXT_CATEGORIES).includes(val)

    const categories = exts.filter(isCategory) as FileCategoryType[]
    const extensions = exts.filter((e) => !isCategory(e))

    if (categories.length === 1 && extensions.length === 0) {
      const cat = categories[0]
      if (cat === 'image' || cat === 'video' || cat === 'audio')
        return { accept: `${cat}/*`, rules: [t('uploader.allCatAccepted', { cat })] }
      else {
        const catExts = EXT_CATEGORIES[cat].filter((e) => e.startsWith('.'))
        return { accept: catExts.join(','), rules: [t('uploader.allCatAccepted', { cat })] }
      }
    }

    let acceptArr: string[] = []
    const rulesArr: string[] = []

    categories.forEach((cat) => {
      acceptArr.push(...EXT_CATEGORIES[cat].filter((e) => e.startsWith('.')))
      rulesArr.push(t('uploader.allCatAccepted', { cat }))
    })

    if (extensions.length > 0) {
      acceptArr.push(...extensions)
      rulesArr.push(t('uploader.extsAccepted', { exts: extensions.join(', ') }))
    }

    acceptArr = Array.from(new Set(acceptArr))
    return { accept: acceptArr.join(','), rules: rulesArr }
  }

  const validateAccept = (file: File, exts: FileExtType[]): boolean =>
    !exts || exts.includes('all') || exts.some((ext) => file?.name?.toLowerCase().endsWith(ext.toLowerCase()))

  const calcFileSize = (size: number, unit: 'B' | 'KB' | 'MB' | 'GB' | 'TB' = 'B'): string => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    const startIndex = units.indexOf(unit)
    const i = Math.floor(Math.log(size) / Math.log(1024))
    const adjustedIndex = Math.min(startIndex + i, units.length - 1)
    const value = Number.parseFloat((size / Math.pow(1024, i)).toFixed(2))
    return `${value}${units[adjustedIndex]}`
  }

  const validateSize = (file: File, formula: '<' | '<=' | '>' | '>=', request: number): boolean => {
    const formulas: Record<'<' | '<=' | '>' | '>=', (fileSize: number, request: number) => boolean> = {
      '<': (fileSize, request) => fileSize < request,
      '<=': (fileSize, request) => fileSize <= request,
      '>': (fileSize, request) => fileSize > request,
      '>=': (fileSize, request) => fileSize >= request,
    }
    return formulas[formula](file.size / (1024 * 1024), request)
  }

  const isFileExists = <T extends string | number = number>(file: File, previewFile: FileProps<T>): boolean => {
    const fileObj = {
      name: file?.name?.split('.')[0],
      ext: file?.name?.split('.').pop(),
      size: calcFileSize(file.size),
      type: file.type,
    }

    return Object.keys(fileObj).every(
      (key) => fileObj[key as keyof typeof fileObj] === previewFile[key as keyof FileProps<T>]
    )
  }

  const isSameFile = <T extends string | number = number>(a: FileProps<T>, b: FileProps<T>): boolean =>
    a?.url === b?.url && a?.name === b?.name && a?.size === b?.size

  const isEqual = <T extends string | number = number>(
    a: FileProps<T> | undefined,
    b: FileProps<T> | undefined
  ): boolean => {
    if (a === b) return true
    if (!a || !b) return false
    return isSameFile(a, b)
  }

  const areEqual = <T extends string | number = number>(a: FileProps<T>[], b: FileProps<T>[]): boolean => {
    if (a === b) return true
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) if (!isSameFile(a[i], b[i])) return false
    return true
  }

  const getCategory = (extensions: FileExtType[]): FileCategoryType => {
    if (!extensions || extensions.length === 0 || extensions.includes('all')) return 'all'

    for (const category in EXT_CATEGORIES) {
      if (extensions.includes(category as FileExtType)) return category as FileCategoryType

      const catExts = EXT_CATEGORIES[category as FileCategoryType] as readonly FileExtType[]
      if (extensions.every((ext) => catExts.includes(ext))) return category as FileCategoryType
    }

    return 'all'
  }

  const getIcon = <T extends string | number = number>(props: GetFileIconProps<T>): GetFileIconReturn => {
    const { file, extensions = [], length = 1 } = props

    const category = getCategory(extensions)

    const icons: Record<FileCategoryType, ReactNode> = {
      all: length > 1 ? form?.uploader?.filesIcon : form?.uploader?.fileIcon,
      image: length > 1 ? form?.uploader?.imagesIcon : form?.uploader?.imageIcon,
      video: length > 1 ? form?.uploader?.videosIcon : form?.uploader?.videoIcon,
      audio: length > 1 ? form?.uploader?.audiosIcon : form?.uploader?.audioIcon,
      text: length > 1 ? form?.uploader?.textsIcon : form?.uploader?.textIcon,
      files: length > 1 ? form?.uploader?.filesIcon : form?.uploader?.fileIcon,
      application: length > 1 ? form?.uploader?.applicationsIcon : form?.uploader?.applicationIcon,
      executable: length > 1 ? form?.uploader?.executablesIcon : form?.uploader?.executableIcon,
    }

    return { icon: icons[category], hasImageAssigned: category === 'image' && Boolean(file?.url) }
  }

  // Main functions
  const upload = async <T extends string | number = number>(files: FileList | null, props: UploadFilesProps<T>) => {
    if (!files || files.length === 0) return

    const {
      preview = {} as FileProps<T>,
      previews = [],
      setValue,
      setLoading,
      setFile,
      setFiles,
      setErrors,
      setProgress,
      validation,
    } = props
    const {
      accept,
      maxSize,
      minSize,
      maxFiles,
      minFiles,
      maxFilesSize,
      minFilesSize,
      multiple = false,
    } = validation ?? {}

    setLoading(true)
    setProgress(0)
    setValue('')

    const isMulti = multiple && Array.isArray(previews)

    let hasErrors = false
    const errorCodes: string[] = []
    const allFiles = Array.from(files || [])
    const validFiles = allFiles.filter((file) => {
      const errors = [
        {
          code: 'duplicateFileRule',
          condition: isMulti
            ? !previews.some((previewFile) => isFileExists(file, previewFile))
            : !isFileExists(file, preview),
        },
        { code: 'acceptRule', condition: accept ? validateAccept(file, accept) : true },
        { code: 'minSizeRule', condition: minSize ? validateSize(file, '>=', minSize) : true },
        { code: 'maxSizeRule', condition: maxSize ? validateSize(file, '<=', maxSize) : true },
      ].filter(({ condition }) => condition === false)
      if (!errors.length) return true
      hasErrors = true
      errorCodes.push(...errors.map(({ code }) => code))
      return false
    })

    if (isMulti) {
      const selectionErrors = [
        { code: 'minFilesRule', condition: minFiles ? validFiles.length > minFiles : true },
        { code: 'maxFilesRule', condition: maxFiles ? validFiles.length <= maxFiles : true },
        {
          code: 'minFilesSizeRule',
          condition: minFilesSize ? validFiles.reduce((a, b) => a + b.size, 0) / (1024 * 1024) > minFilesSize : true,
        },
        {
          code: 'maxFilesSizeRule',
          condition: maxFilesSize ? validFiles.reduce((a, b) => a + b.size, 0) / (1024 * 1024) <= maxFilesSize : true,
        },
      ].filter(({ condition }) => condition === false)

      if (selectionErrors.length) {
        hasErrors = true
        errorCodes.push(...selectionErrors.map(({ code }) => code))
      }
    }

    if (hasErrors && errorCodes.length) {
      setFiles?.(previews, allFiles, false)
      setFile?.(preview, allFiles[0], false)
      setLoading(false)
      setProgress(0)
      setErrors((prev) => [...prev, ...errorCodes])
      return
    }

    try {
      const uploadedFiles: FileProps<T>[] = []
      const total = validFiles.length

      for (let i = 0; i < total; i++) {
        const file = validFiles[i]
        await new Promise((res) => setTimeout(res, 80))
        setProgress(Math.round(((i + 1) / total) * 100))
        uploadedFiles.push({
          name: file.name,
          ext: file.name.split('.').pop(),
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
        })
      }

      if (multiple) {
        setFiles?.([...previews, ...uploadedFiles], allFiles, true)
        setFile?.(uploadedFiles[0], allFiles[0], true)
      } else {
        setFiles?.(uploadedFiles, allFiles, true)
        setFile?.(uploadedFiles[0], allFiles[0], true)
      }
      setErrors([])
    } catch (error) {
      console.error(error)
      setFiles?.(previews, allFiles, false)
      setFile?.(preview, allFiles[0], false)
      setProgress(0)
      setErrors((prev) => [...prev, 'uploadError'])
    } finally {
      setLoading(false)
    }
  }

  const useUploader = <T extends string | number = number>(
    options: UseUploaderOptions<T> = {} as UseUploaderOptions<T>
  ): UseUploaderReturn<T> => {
    const {
      id,
      name,
      disabled,
      accept: extensions = form?.uploader?.defaultFileCategory ?? ['all'],
      minSize,
      maxSize,
      minFiles,
      maxFiles,
      minFilesSize,
      maxFilesSize,
      allowPaste = true,
      allowDragAndDrop = true,
      onRemove,
      onError,
      multiple = false,
    } = options ?? {}

    const singleOptions = (options ?? {}) as UploaderFieldSingleProps<T>
    const multiOptions = (options ?? {}) as UploaderFieldMultipleProps<T>

    const hasControlledValue = multiple
      ? 'value' in multiOptions && multiOptions.value !== undefined
      : 'value' in singleOptions && singleOptions.value !== undefined
    const preview = singleOptions.value
    const onChangeSingle = singleOptions.onChange
    const previews = multiOptions.value ?? []
    const onChangeMultiple = multiOptions.onChange

    const { accept, rules } = acceptRules(extensions)

    // Refs
    const inputRef = useRef<HTMLInputElement>(null)

    // States
    const [value, setValue] = useState<InputHTMLAttributes<HTMLInputElement>['value']>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [progress, setProgress] = useState<number>(0)
    const [errors, setErrors] = useState<string[]>([])
    const [isHovered, setIsHovered] = useState<boolean>(false)
    const [isDragging, setIsDragging] = useState<boolean>(false)
    const [files, setFiles] = useState<FileProps<T>[]>(Array.isArray(previews) ? previews : [])
    const [file, setFile] = useState<FileProps<T> | undefined>(preview)

    useEffect(() => {
      if (!hasControlledValue) return
      if (multiple) {
        const next = Array.isArray(previews) ? previews : []
        if (areEqual(files, next)) return
        setFiles(next)
      } else {
        if (isEqual(file, preview)) return
        setFile(preview)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasControlledValue, multiple, preview, previews])

    // Functions
    const handleChange = (incoming: FileList | null) =>
      upload<T>(incoming, {
        validation: { accept: extensions, maxSize, minSize, maxFiles, minFiles, multiple },
        setErrors,
        setValue,
        setProgress,
        setLoading: setIsLoading,
        ...(multiple
          ? {
              previews: files,
              setFiles: (next, native, valid) => {
                setFiles(next)
                onChangeMultiple?.(next, native, valid)
              },
            }
          : {
              preview: file ?? ({} as FileProps<T>),
              setFile: (next, native, valid) => {
                setFile(next)
                onChangeSingle?.(next, native, valid)
              },
            }),
      })

    function click(e?: MouseEvent<HTMLElement>) {
      e?.stopPropagation()
      if (disabled || isLoading) return
      inputRef.current?.click()
    }
    function removeFile(target: FileProps<T>) {
      if (multiple) {
        const next = files.filter((f) => !isSameFile(f, target))
        setFiles(next)
        onChangeMultiple?.(next, [], true)
      } else {
        setFile(undefined)
        onChangeSingle?.({} as FileProps<T>, new File([], ''), true)
      }
      onRemove?.(target)
    }
    function handleDragOver(e: DragEvent<HTMLElement>) {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled && !isLoading && allowDragAndDrop) setIsDragging(true)
    }
    function handleDragLeave(e: DragEvent<HTMLElement>) {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled && !isLoading && allowDragAndDrop) setIsDragging(false)
    }
    function handleDrop(e: DragEvent<HTMLElement>) {
      e.preventDefault()
      e.stopPropagation()
      if (disabled || isLoading || !allowDragAndDrop) return
      setIsDragging(false)
      handleChange(e.dataTransfer?.files)
    }

    const handleMouseEnter = () => allowPaste && setIsHovered(true)
    const handleMouseLeave = () => allowPaste && setIsHovered(false)

    function handlePaste(e: globalThis.ClipboardEvent) {
      e.preventDefault()
      if (!disabled && !isLoading && e.clipboardData?.files?.length) handleChange(e.clipboardData.files)
    }

    useEffect(() => {
      if (errors.length === 0) return
      onError?.(errors)
      const errorTranslated: Record<string, string> = {
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
      document.addEventListener('paste', handlePaste)
      return () => document.removeEventListener('paste', handlePaste)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isHovered, disabled, isLoading, allowPaste])

    return {
      inputRef,
      inputProps: {
        type: 'file',
        name: name ?? `uploader-${Math.random().toString(36).substring(2, 11)}`,
        className: 'hidden',
        disabled: disabled || isLoading,
        ...(id ? { id } : {}),
        value,
        accept,
        multiple,
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          setValue(e.target.value)
          handleChange(e.target.files)
        },
      },
      click,
      files,
      file,
      removeFile,
      setFiles,
      setFile,
      isLoading,
      isDragging,
      progress,
      errors,
      handleChange,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      handleMouseEnter,
      handleMouseLeave,
    }
  }

  return {
    acceptRules,
    validateAccept,
    calcFileSize,
    validateSize,
    isFileExists,
    isSameFile,
    isEqual,
    areEqual,
    getCategory,
    getIcon,
    upload,
    useUploader,
  }
}
