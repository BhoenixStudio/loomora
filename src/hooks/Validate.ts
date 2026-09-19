/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Synchronous schema-driven validation for keyed values.
 *
 * ## File overview
 *
 * - File: `src/hooks/Validate.ts`.
 * - Confirmed responsibility: describe values with `ValidateProps<T>`, validate each entry, and return accepted
 *   variables together with aggregate validity flags and configured error messages.
 * - Confirmed exports: `ValidateProps`, `ValidationFormResult`, and `Validate`.
 * - Boundary: this utility does not perform network requests, authentication, persistence, UI rendering, or exception
 *   handling for caller-provided schema callbacks.
 *
 * ## When to use
 *
 * Use `Validate` when a form, filter object, or similar record can be represented as a keyed validation schema. A
 * direct project example composes product-filter validation for the products API query; see
 * `src/@api/Queries/Products/client.ts`.
 *
 * Prefer a caller-specific validator when the required rule is not represented by the supported entry types, such as
 * requiring every element of an array to pass, preserving strict runtime types after coercion, or applying a custom
 * cross-field rule. Those behaviors are not implemented here.
 *
 * ## Developer guide
 *
 * `Validate` is re-exported from `src/hooks/index.ts`, so the verified project import is:
 *
 * ```ts
 * import { Validate } from '@hooks'
 * ```
 *
 * Provide one entry for each key in `T`. Each entry has a `type`, a `value`, and optionally a `fallback`,
 * `condition`, `errorMessage`, `isEmptyValid`, `allowedValues`, or nested `schema`, depending on its type.
 * `value ?? fallback` is used, so a fallback applies only when `value` is `null` or `undefined`.
 * `condition: false` omits the entry without adding an error.
 *
 * Supported entry types:
 *
 * - `number`: validates `Number(value)` as greater than zero by default, or greater than or equal to zero when
 *   `isEmptyValid` is true.
 * - `numbers`: accepts an array when at least one element passes the number check. The original array is retained;
 *   invalid elements are not removed. An empty array is not accepted by this branch.
 * - `string`: validates `String(value)`, requiring a non-empty string by default. The literal strings `null` and
 *   `undefined` are rejected unless `isEmptyValid` is true.
 * - `strings`: accepts an array when at least one element passes the string check. The original array is retained and
 *   an empty array is not accepted by this branch.
 * - `boolean`: accepts `true` and `false`.
 * - `booleans`: accepts an array when at least one element is a boolean. The original array is retained and an empty
 *   array is not accepted by this branch.
 * - `enum`: compares `String(value)` with `allowedValues` and requires a truthy value after the final entry check.
 * - `enums`: applies the same enum check to array elements and accepts the array when at least one element matches.
 *   The original array is retained.
 * - `object`: validates a non-array object with the nested `schema`. A nullish value is accepted as `{}` only when
 *   `isEmptyValid` is true.
 * - `objects`: validates each non-null, non-array item using the schema returned by `schema(item)`. It returns only
 *   items whose nested result is fully valid and considers the collection valid when at least one item is valid.
 *   With `isEmptyValid: true`, non-array values and empty arrays are accepted as an empty result.
 *
 * The returned `variables` contains only accepted top-level entries. Scalar values are stored in their original form
 * after the validation check, not as the coerced value used by the check. `errors` contains configured
 * `errorMessage` values for invalid top-level entries and errors propagated by an invalid nested validation.
 *
 * Typical flow:
 *
 * 1. Define the target record type and a matching `ValidateProps<T>` object.
 * 2. Supply current values and optional fallbacks.
 * 3. Check `isAllValidate` before using `variables` when every schema entry is required.
 * 4. Use `errors` for configured user-facing or caller-facing messages.
 *
 * ## AI agent guide
 *
 * - Preserve the public names, entry discriminators, result keys, and generic shape when modifying this file.
 * - Reuse `Validate` for the existing schema format instead of duplicating its checks in consumers.
 * - Treat `value ?? fallback`, `condition: false`, scalar coercion, partial array acceptance, and the distinction
 *   between `isValidate` and `isAllValidate` as observable behavior.
 * - Safe documentation or type-comment changes do not require logic changes. Any change to coercion, accepted values,
 *   filtering, error propagation, or result flags requires checking the direct consumer and should be confirmed before
 *   being treated as a behavior change.
 * - The file appears manually maintained; no generated-file marker is present.
 * - Direct references inspected for this documentation are `src/hooks/index.ts`,
 *   `src/@api/Queries/Products/client.ts`, `instructions/code-rules.md`, and the validation scripts in
 *   `package.json`.
 *
 * ## Usage examples
 *
 * Minimal example:
 *
 * ```ts
 * const result = Validate<{ page: number; limit: number }>({
 *   page: { type: 'number', value: 1 },
 *   limit: { type: 'number', value: 50 },
 * })
 *
 * // result.isValidate === true
 * // result.isAllValidate === true
 * // result.variables === { page: 1, limit: 50 }
 * // result.errors === []
 * ```
 *
 * Practical example (illustrative): this mirrors the verified product-filter composition in
 * `src/@api/Queries/Products/client.ts`. The `ProductsFilters` definition and the caller-provided `filters` values
 * are supplied by that consumer and are not defined in this file.
 *
 * ```ts
 * import { Validate } from '@hooks'
 * import type { ProductsFilters } from '@API'
 *
 * const result = Validate<ProductsFilters>({
 *   page: { type: 'number', value: filters?.page, fallback: fallbacks?.page },
 *   limit: { type: 'number', value: filters?.limit, fallback: fallbacks?.limit },
 *   productIds: { type: 'numbers', value: filters?.productIds, fallback: fallbacks?.productIds },
 * })
 * ```
 *
 * Edge-case example:
 *
 * ```ts
 * const result = Validate({
 *   status: {
 *     type: 'enum',
 *     value: 1,
 *     allowedValues: [1],
 *     errorMessage: 'status is invalid',
 *   },
 * })
 *
 * // The entry is invalid: the implementation compares String(1) with [1].
 * // result.isValidate === false
 * // result.isAllValidate === false
 * // result.errors === ['status is invalid']
 * ```
 *
 * ## Errors, edge cases, and limitations
 *
 * - Invalid primitive entries produce no error text unless `errorMessage` is provided.
 * - Invalid entries are omitted from `variables`; values are not normalized or mutated.
 * - The final validity check requires `Boolean(value) || value === false`. Consequently, `0` and `''` are not
 *   retained even when `isEmptyValid` makes the helper check pass, while boolean `false` is retained.
 * - Number and string checks coerce their input for validation, but retain the original input in `variables`.
 * - Enum checks stringify values before `allowedValues.includes(...)`; numeric `allowedValues` therefore do not match
 *   the corresponding stringified numeric input.
 * - Array checks require at least one valid element, not every element. Invalid elements remain in the accepted array.
 * - `isValidate` is true when at least one variable is accepted. `isAllValidate` is true only when at least one
 *   variable is accepted and the number of accepted variables equals the number of form entries. An empty form, or a
 *   form with skipped or invalid entries, is not fully valid.
 * - For `objects`, invalid items are excluded from `variables`. Errors from invalid items are returned by the helper,
 *   but a parent entry discards those errors when at least one item makes the collection valid.
 * - There is no loading, retry, authentication, browser, or server-runtime behavior in this file. Exceptions thrown
 *   by a caller-supplied `schema(item)` callback are not caught here.
 *
 * ## Related references
 *
 * - `src/hooks/index.ts` re-exports this module through the `@hooks` alias.
 * - `src/@api/Queries/Products/client.ts` uses `Validate<ProductsFilters>` for product filter values and fallbacks.
 * - `instructions/code-rules.md` is the verified TypeScript guidance applied to this project file.
 */

type ValueType<T> = T | null | undefined

type VEntryType =
  'number' | 'numbers' | 'string' | 'strings' | 'boolean' | 'booleans' | 'enum' | 'enums' | 'object' | 'objects'
type VNumber = { type: 'number'; value: ValueType<number>; fallback?: ValueType<number>; isEmptyValid?: boolean }
type VNumbers = { type: 'numbers'; value: ValueType<number[]>; fallback?: ValueType<number[]>; isEmptyValid?: boolean }
type VString = { type: 'string'; value: ValueType<string>; fallback?: ValueType<string>; isEmptyValid?: boolean }
type VStrings = { type: 'strings'; value: ValueType<string[]>; fallback?: ValueType<string[]>; isEmptyValid?: boolean }
type VBoolean = { type: 'boolean'; value: ValueType<boolean>; fallback?: ValueType<boolean>; isEmptyValid?: boolean }
type VBooleans = {
  type: 'booleans'
  value: ValueType<boolean[]>
  fallback?: ValueType<boolean[]>
  isEmptyValid?: boolean
}
type VEnum = {
  type: 'enum'
  value: ValueType<string | number>
  fallback?: ValueType<string | number>
  allowedValues: (string | number)[]
}
type VEnums = {
  type: 'enums'
  value: ValueType<(string | number)[]>
  fallback?: ValueType<(string | number)[]>
  allowedValues: (string | number)[]
}
type VObject<T extends Record<string, any> = Record<string, any>> = {
  type: 'object'
  value: ValueType<T>
  fallback?: ValueType<T>
  isEmptyValid?: boolean
  schema: Record<string, any>
}
type VObjects<T extends Record<string, any> = Record<string, any>> = {
  type: 'objects'
  value: ValueType<T[]>
  fallback?: ValueType<T[]>
  isEmptyValid?: boolean
  schema: (item: T) => Record<string, any>
}

type ArrayElement<T> = T extends (infer U)[] ? U : T

/**
 * Validation schema keyed by the fields of `T`.
 *
 * Each field selects one of the supported `type` discriminators and supplies its value. `condition: false` skips the
 * field, `fallback` is used only for a nullish value, and `errorMessage` is appended when the field is invalid. Object
 * entries use a nested schema; object-collection entries receive each item so they can build an item schema.
 */
export type ValidateProps<T extends Record<string, any> = Record<string, any>> = {
  [K in keyof T]: {
    condition?: boolean
    errorMessage?: string
  } & (
    | VNumber
    | VNumbers
    | VString
    | VStrings
    | VBoolean
    | VBooleans
    | VEnum
    | VEnums
    | VObject<T[K] & Record<string, any>>
    | VObjects<ArrayElement<T[K]> & Record<string, any>>
  )
}

/**
 * Result returned by `Validate`.
 *
 * `variables` contains accepted values only. `isValidate` reports whether at least one entry was accepted, while
 * `isAllValidate` also requires the accepted-entry count to equal the form-entry count. `errors` contains configured
 * top-level messages and applicable nested validation messages.
 */
export type ValidationFormResult<T = Record<string, unknown>> = {
  isValidate: boolean
  isAllValidate: boolean
  variables: T
  errors: string[]
}

function isNumberValid(value: VNumber['value'], isEmptyValid?: VNumber['isEmptyValid']): boolean {
  return typeof value === 'number' && !Number.isNaN(value) && (isEmptyValid ? value >= 0 : value > 0)
}
function isStringValid(value: VString['value'], isEmptyValid?: VString['isEmptyValid']): boolean {
  return (
    typeof value === 'string' &&
    (isEmptyValid ? value.length >= 0 : value.length > 0 && !['null', 'undefined'].includes(value))
  )
}
function isBooleanValid(value: VBoolean['value']): boolean {
  return typeof value === 'boolean'
}
function isEnumValid(value: VEnum['value'], allowedValues: VEnum['allowedValues']): boolean {
  return Array.isArray(allowedValues) && Boolean(value) && allowedValues.includes(value as number | string)
}
function isObjectValid(
  value: VObject['value'],
  schema: VObject['schema'],
  isEmptyValid?: VObject['isEmptyValid']
): { isValid: boolean; variables: Record<string, any>; errors: string[] } {
  if (value === null || value === undefined) {
    if (isEmptyValid) return { isValid: true, variables: {}, errors: [] }
    return { isValid: false, variables: {}, errors: [] }
  }
  if (typeof value !== 'object' || Array.isArray(value)) {
    return { isValid: false, variables: {}, errors: [] }
  }
  const result = Validate(schema)
  return { isValid: result.isAllValidate, variables: result.variables, errors: result.errors }
}
function isObjectsValid(
  value: VObjects['value'],
  schema: VObjects['schema'],
  isEmptyValid?: VObjects['isEmptyValid']
): { isValid: boolean; variables: Record<string, any>[]; errors: string[] } {
  if (!Array.isArray(value)) {
    if (isEmptyValid) return { isValid: true, variables: [], errors: [] }
    return { isValid: false, variables: [], errors: [] }
  }
  if (value.length === 0) {
    if (isEmptyValid) return { isValid: true, variables: [], errors: [] }
    return { isValid: false, variables: [], errors: [] }
  }
  const allErrors: string[] = []
  const validItems: Record<string, any>[] = []
  value.forEach((item) => {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) {
      allErrors.push('Invalid item in collection')
      return
    }
    const itemSchema = schema(item as any)
    const result = Validate(itemSchema)
    if (result.isAllValidate) {
      validItems.push(result.variables)
    }
    allErrors.push(...result.errors)
  })
  return { isValid: validItems.length > 0, variables: validItems, errors: allErrors }
}

/**
 * Validates the entries in a keyed schema and returns accepted values and validation status.
 *
 * @template T The record shape represented by the schema and returned in `variables`.
 * @param form A `ValidateProps<T>` schema containing one entry per target key.
 * @returns A `ValidationFormResult<T>` containing accepted variables, aggregate flags, and available errors.
 */
export function Validate<T extends Record<string, any> = Record<string, any>>(
  form: ValidateProps<T>
): ValidationFormResult<T> {
  const variables: T = {} as T
  const errors: string[] = []
  const entries: [keyof T, ValidateProps<T>[keyof T]][] = Object.entries(form) as [keyof T, ValidateProps<T>[keyof T]][]

  entries.forEach(([key, { type, condition, value, fallback, errorMessage, ...rest }]) => {
    const v = value ?? fallback

    if (type === 'object') {
      if (condition === false) return
      const { schema, isEmptyValid = false } = rest as VObject
      const result = isObjectValid(v as VObject['value'], schema, isEmptyValid)
      if (result.isValid) {
        variables[key] = result.variables as T[keyof T]
      } else {
        if (errorMessage) errors.push(errorMessage)
        errors.push(...result.errors)
      }
      return
    }

    if (type === 'objects') {
      if (condition === false) return
      const { schema, isEmptyValid = false } = rest as VObjects
      const result = isObjectsValid(v as VObjects['value'], schema, isEmptyValid)
      if (result.isValid) {
        variables[key] = result.variables as T[keyof T]
      } else {
        if (errorMessage) errors.push(errorMessage)
        errors.push(...result.errors)
      }
      return
    }

    const { isEmptyValid = false } = rest as { isEmptyValid?: boolean }
    const { allowedValues = [] } = rest as { allowedValues?: (string | number)[] }

    const types: Record<VEntryType, boolean> = {
      number: isNumberValid(Number(v), isEmptyValid),
      numbers: Array.isArray(v) && v.filter((v) => isNumberValid(Number(v), isEmptyValid))?.length > 0,
      string: isStringValid(String(v), isEmptyValid),
      strings: Array.isArray(v) && v.filter((v) => isStringValid(String(v), isEmptyValid))?.length > 0,
      boolean: isBooleanValid(v as boolean),
      booleans: Array.isArray(v) && v.filter((v) => isBooleanValid(v as boolean))?.length > 0,
      enum: isEnumValid(String(v), allowedValues),
      enums: Array.isArray(v) && v.filter((v) => isEnumValid(String(v), allowedValues))?.length > 0,
      object: false,
      objects: false,
    }

    const isValid = condition !== false && types[type] && (Boolean(v) || v === false)

    if (isValid) variables[key] = v as T[keyof T]
    else if (errorMessage) errors.push(errorMessage)
  })

  const isValidate = Object.keys(variables).length > 0
  const isAllValidate = Object.keys(variables).length > 0 && Object.keys(form).length === Object.keys(variables).length

  return { isValidate, isAllValidate, variables, errors }
}

/**
 * Documentation metadata:
 *
 * - Last documentation update: 2026-09-18
 * - Documentation audience: Developers and AI agents
 * - Evidence basis: Attached file + verified project context
 * - Documentation coverage: Complete
 * - Validation: Passed `pnpm exec prettier --check src/hooks/Validate.ts`, `pnpm exec eslint src/hooks/Validate.ts`,
 *   `pnpm type:check`, and `git diff --check -- src/hooks/Validate.ts`.
 * - Known limitations: Runtime coercion, partial array acceptance, and nested error propagation follow the existing
 *   implementation and are documented rather than changed.
 */
