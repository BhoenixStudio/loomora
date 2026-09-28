import { ComponentPropsWithRef, CSSProperties, ElementType } from 'react'

export type CSSProps = CSSProperties & Record<`--${string}`, string | undefined>

export type GlobalElement<T extends ElementType> = ComponentPropsWithRef<T> & {
  style?: CSSProps
  clearDefaultClassName?: boolean
}

export type GlobalElementEssentials<T extends ElementType> = {
  className?: string
  clearDefaultClassName?: boolean
  style?: CSSProps
  ref?: ComponentPropsWithRef<T>['ref']
  id?: string
  dir?: 'ltr' | 'rtl'
  attributes?: Omit<ComponentPropsWithRef<T>, 'className' | 'style' | 'ref' | 'id'>
}

export type GlobalElementMinimal<T extends ElementType> = Pick<
  GlobalElementEssentials<T>,
  'className' | 'style' | 'ref' | 'id'
>

export type SingleOrArray<T> = T | T[]

export type SpaceSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type MQ<T extends string> = `${SpaceSize}:${T}` | T

export type WrapperSize = MQ<`grid-cols-${number}`>
export type ChildSize = MQ<`col-span-${number}`>

export type TWTextSize = MQ<
  | 'text-xs'
  | 'text-sm'
  | 'text-base'
  | 'text-lg'
  | `text-${'' | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}xl`
  | `text-[${CSSProps['fontSize']}]`
  | `text-(length:--${string})`
>

type TWGapFn<D extends '-' | '-x' | '-y' = '-'> = `gap${D}${number}` | `gap${D}[${CSSProps['gap']}]`

type DirectionPrefix = '-' | 'x-' | 'y-' | 'l-' | 'r-' | 's-' | 'e-' | 't-' | 'b-'
type TWSpaceFn<T extends 'p' | 'm', D extends DirectionPrefix = DirectionPrefix> =
  `${T}${D}${number}` | `${T}${D}[${T extends 'p' ? CSSProps['padding'] : CSSProps['margin']}]`

export type TWGap = MQ<TWGapFn<'-'> | TWGapFn<'-x'> | TWGapFn<'-y'>>

export type TWPadding = MQ<
  | TWSpaceFn<'p', '-'>
  | TWSpaceFn<'p', 'x-'>
  | TWSpaceFn<'p', 'y-'>
  | TWSpaceFn<'p', 't-'>
  | TWSpaceFn<'p', 't-'>
  | TWSpaceFn<'p', 'l-'>
  | TWSpaceFn<'p', 'r-'>
  | TWSpaceFn<'p', 's-'>
  | TWSpaceFn<'p', 'e-'>
>

export type TWMargin = MQ<
  | TWSpaceFn<'m', '-'>
  | TWSpaceFn<'m', 'x-'>
  | TWSpaceFn<'m', 'y-'>
  | TWSpaceFn<'m', 't-'>
  | TWSpaceFn<'m', 't-'>
  | TWSpaceFn<'m', 'l-'>
  | TWSpaceFn<'m', 'r-'>
  | TWSpaceFn<'m', 's-'>
  | TWSpaceFn<'m', 'e-'>
>

export type Enumerate<N extends number, E extends number[] = [], T extends number[] = []> = T['length'] extends N
  ? Exclude<T[number], E[number]>
  : Enumerate<N, E, [...T, T['length']]>

export type Neverify<T> = { [K in keyof T]?: never }

export type NestedKeyOf<ObjectType> = ObjectType extends null | undefined
  ? never
  : ObjectType extends object
    ? {
        [Key in keyof ObjectType & (string | number)]: NonNullable<ObjectType[Key]> extends object
          ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
          : `${Key}`
      }[keyof ObjectType & (string | number)]
    : never

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>

export type PageParams<P extends object, Ex = unknown> = Readonly<{ params: Promise<P> } & Ex>
export type PageQueries<S extends object, Ex = unknown> = Readonly<{ searchParams: Promise<S> } & Ex>
export type PageParamsQueries<P extends object, S extends object, Ex = unknown> = Readonly<
  { params: Promise<P>; searchParams: Promise<S> } & Ex
>

export type TWColorOpacity<V extends string = ''> =
  V | `${V}/${0 | 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50 | 55 | 60 | 65 | 70 | 75 | 80 | 85 | 90 | 95 | 100}`
export type TWColorSName<
  T extends
    | 'text'
    | 'bg'
    | 'decoration'
    | 'border'
    | 'outline'
    | 'shadow'
    | 'inset-shadow'
    | 'ring'
    | 'inset-ring'
    | 'accent'
    | 'caret'
    | 'fill'
    | 'stroke',
> = MQ<`${T}-${string}` | TWColorOpacity<`${T}-${string}`>>
export type TWColorName =
  | TWColorSName<'text'>
  | TWColorSName<'bg'>
  | TWColorSName<'border'>
  | TWColorSName<'caret'>
  | TWColorSName<'decoration'>
  | TWColorSName<'fill'>
  | TWColorSName<'inset-ring'>
  | TWColorSName<'inset-shadow'>
  | TWColorSName<'outline'>
  | TWColorSName<'ring'>
  | TWColorSName<'shadow'>
  | TWColorSName<'stroke'>
  | TWColorSName<'text'>
