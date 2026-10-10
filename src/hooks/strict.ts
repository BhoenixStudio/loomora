type V<T> = T | null | undefined
type ArrayElement<T> = T extends (infer U)[] ? U : T

const ARRAY_TYPES: Types[] = ['numbers', 'strings', 'booleans', 'enums', 'files']

function isNumberValue(value: unknown, isEmptyValid: boolean): boolean {
  if (typeof value !== 'number' || Number.isNaN(value)) return false
  return isEmptyValid ? value >= 0 : value > 0
}

function isStringValue(value: unknown, isEmptyValid: boolean): boolean {
  if (typeof value !== 'string') return false
  return isEmptyValid || value.length > 0
}

function scalarValid(
  type: Types,
  value: unknown,
  { isEmptyValid, allowedValues }: { isEmptyValid: boolean; allowedValues: Enum[] }
): boolean {
  const checks: Partial<Record<Types, () => boolean>> = {
    number: () => isNumberValue(value, isEmptyValid),
    numbers: () => isNumberValue(value, isEmptyValid),
    string: () => isStringValue(value, isEmptyValid),
    strings: () => isStringValue(value, isEmptyValid),
    boolean: () => typeof value === 'boolean',
    booleans: () => typeof value === 'boolean',
    enum: () => allowedValues.includes(value as Enum),
    enums: () => allowedValues.includes(value as Enum),
    file: () => typeof File !== 'undefined' && value instanceof File,
    files: () => typeof File !== 'undefined' && value instanceof File,
  }
  return checks[type]?.() ?? false
}

// Types
type VNum = { type: 'number'; value: V<number>; fallback?: V<number>; isEmptyValid?: boolean }
type VNums = { type: 'numbers'; value: V<number[]>; fallback?: V<number[]>; isEmptyValid?: boolean }

type VStr = { type: 'string'; value: V<string>; fallback?: V<string>; isEmptyValid?: boolean }
type VStrs = { type: 'strings'; value: V<string[]>; fallback?: V<string[]>; isEmptyValid?: boolean }

type VBool = { type: 'boolean'; value: V<boolean>; fallback?: V<boolean>; isEmptyValid?: boolean }
type VBools = { type: 'booleans'; value: V<boolean[]>; fallback?: V<boolean[]>; isEmptyValid?: boolean }

type Enum = string | number
type VEnum = { type: 'enum'; value: V<Enum>; fallback?: V<Enum>; allowedValues: Enum[] }
type VEnums = { type: 'enums'; value: V<Enum[]>; fallback?: V<Enum[]>; allowedValues: Enum[] }

type VFile = { type: 'file'; value: V<File>; fallback?: V<File> }
type VFiles = { type: 'files'; value: V<File[]>; fallback?: V<File[]> }

type VObj<T extends Record<string, unknown> = Record<string, unknown>> = {
  type: 'object'
  value: V<T>
  fallback?: V<T>
  isEmptyValid?: boolean
  schema: Record<string, unknown>
}
type VObjs<T extends Record<string, unknown> = Record<string, unknown>> = {
  type: 'objects'
  value: V<T[]>
  fallback?: V<T[]>
  isEmptyValid?: boolean
  schema: (item: T) => Record<string, unknown>
}

// Main types
type Types = UseStrictRules[number]['type']
export type UseStrictRules<T extends object = Record<string, unknown>> = {
  [K in keyof T]: { condition?: boolean; errorMessage?: string; required?: boolean } & (
    | VNum
    | VNums
    | VStr
    | VStrs
    | VBool
    | VBools
    | VEnum
    | VEnums
    | VFile
    | VFiles
    | VObj<T[K] & Record<string, unknown>>
    | VObjs<ArrayElement<T[K]> & Record<string, unknown>>
  )
}

export type UseStrictResult<T = Record<string, unknown>> = {
  isValid: boolean
  isRequiredValid: boolean
  variables: T
  errors: string[]
}

export function useStrict() {
  // Functions
  function num(value: unknown, isEmptyValid?: boolean): boolean {
    return typeof value === 'number' && !Number.isNaN(value) && (isEmptyValid ? value >= 0 : value > 0)
  }
  function str(value: unknown, isEmptyValid?: boolean): boolean {
    return typeof value === 'string' && (isEmptyValid ? value.length >= 0 : value.length > 0)
  }
  function bool(value: unknown): boolean {
    return typeof value === 'boolean'
  }
  function enumVal(value: VEnum['value'], allowedValues: VEnum['allowedValues']): boolean {
    return (
      Array.isArray(allowedValues) &&
      value !== null &&
      value !== undefined &&
      allowedValues.includes(value as number | string)
    )
  }
  function file(value: unknown): boolean {
    return typeof File !== 'undefined' && value instanceof File
  }
  function obj<T extends Record<string, unknown> = Record<string, unknown>>(
    value: unknown,
    schema: VObj<T>['schema'],
    isEmptyValid?: boolean
  ): UseStrictResult<T> {
    if (value == null)
      return { isValid: !!isEmptyValid, isRequiredValid: !!isEmptyValid, variables: {} as T, errors: [] }

    if (typeof value !== 'object' || Array.isArray(value))
      return { isValid: false, isRequiredValid: false, variables: {} as T, errors: [] }

    return check<T>(schema as UseStrictRules<T>)
  }
  function objs<T extends Record<string, unknown> = Record<string, unknown>>(
    value: unknown,
    schema: VObjs<T>['schema'],
    isEmptyValid?: boolean
  ): Omit<UseStrictResult<T>, 'variables'> & { variables: Record<string, unknown>[] } {
    if (!Array.isArray(value) || value.length === 0) {
      return { isValid: !!isEmptyValid, isRequiredValid: !!isEmptyValid, variables: [], errors: [] }
    }

    const allErrors: string[] = []
    const validItems: Record<string, unknown>[] = []
    let isRequiredValid = true

    value.forEach((item) => {
      if (typeof item !== 'object' || item === null || Array.isArray(item)) {
        allErrors.push('Invalid item in collection')
        isRequiredValid = false
        return
      }
      const itemSchema = schema(item as T)
      const result = check(itemSchema as UseStrictRules<T>)

      if (result.isValid) validItems.push(result.variables)
      if (!result.isRequiredValid) isRequiredValid = false
      allErrors.push(...result.errors)
    })

    return {
      isValid: validItems.length > 0,
      isRequiredValid,
      variables: validItems,
      errors: allErrors,
    }
  }

  // Main function
  function check<T extends object = Record<string, unknown>>(vars: UseStrictRules<T>): UseStrictResult<T> {
    const variables: T = {} as T
    const errors: string[] = []
    let isRequiredValid = true

    const entries: [keyof T, UseStrictRules<T>[keyof T]][] = Object.entries(vars) as [
      keyof T,
      UseStrictRules<T>[keyof T],
    ][]

    entries.forEach(([key, { type, condition, value, fallback, errorMessage, required, ...rest }]) => {
      const v = value ?? fallback

      const { isEmptyValid = false } = rest as { isEmptyValid?: boolean }
      const { allowedValues = [] } = rest as { allowedValues?: Enum[] }

      if (['object', 'objects'].includes(type)) {
        if (condition === false) return

        const { schema } = rest as VObj<T[keyof T] & Record<string, unknown>>
        const { schema: itemSchema } = rest as VObjs<ArrayElement<T[keyof T]> & Record<string, unknown>>

        const result =
          type === 'object'
            ? obj(v as VObj<T[keyof T] & Record<string, unknown>>['value'], schema, isEmptyValid)
            : objs(v as VObjs<ArrayElement<T[keyof T]> & Record<string, unknown>>['value'], itemSchema, isEmptyValid)

        if (result.isValid) variables[key] = result.variables as T[keyof T]
        else {
          if (errorMessage) errors.push(errorMessage)
          errors.push(...result.errors)
        }
        if ((result.isValid && !result.isRequiredValid) || (required && !result.isValid)) isRequiredValid = false

        return
      }

      if (condition === false) return

      const keepItem = (item: unknown) => scalarValid(type, item, { isEmptyValid, allowedValues })
      const isArrayType = ARRAY_TYPES.includes(type)
      const storedValue = isArrayType && Array.isArray(v) ? v.filter(keepItem) : v
      const isValid = isArrayType
        ? Array.isArray(storedValue) && storedValue.length > 0
        : keepItem(v) && (Boolean(v) || v === false || isEmptyValid)

      if (isValid) variables[key] = storedValue as T[keyof T]
      else if (errorMessage) errors.push(errorMessage)

      if (required && !isValid) isRequiredValid = false
    })

    const isValid = Object.keys(variables).length > 0

    return { isValid, isRequiredValid, variables, errors }
  }

  return { num, str, bool, enumVal, file, obj, objs, check }
}
