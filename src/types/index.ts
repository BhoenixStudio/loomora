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

export type PageParams<P extends object, Ex = unknown> = Readonly<{ params: Promise<P> } & Ex>
export type PageQueries<S extends object, Ex = unknown> = Readonly<{ searchParams: Promise<S> } & Ex>
export type PageParamsQueries<P extends object, S extends object, Ex = unknown> = Readonly<
  { params: Promise<P>; searchParams: Promise<S> } & Ex
>

export type ColorName<T extends string> = T
export type TWColorOpacity<T extends string> =
  T | `${T}/${0 | 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50 | 55 | 60 | 65 | 70 | 75 | 80 | 85 | 90 | 95 | 100}`
export type TWColorName<T extends string> = MQ<
  | `bg-${T}`
  | TWColorOpacity<`bg-${T}`>
  | `text-${T}`
  | TWColorOpacity<`text-${T}`>
  | `decoration-${T}`
  | TWColorOpacity<`decoration-${T}`>
  | `border-${T}`
  | TWColorOpacity<`border-${T}`>
  | `outline-${T}`
  | TWColorOpacity<`outline-${T}`>
  | `shadow-${T}`
  | TWColorOpacity<`shadow-${T}`>
  | `inset-shadow-${T}`
  | TWColorOpacity<`inset-shadow-${T}`>
  | `ring-${T}`
  | TWColorOpacity<`ring-${T}`>
  | `inset-ring-${T}`
  | TWColorOpacity<`inset-ring-${T}`>
  | `accent-${T}`
  | TWColorOpacity<`accent-${T}`>
  | `caret-${T}`
  | TWColorOpacity<`caret-${T}`>
  | `fill-${T}`
  | TWColorOpacity<`fill-${T}`>
  | `stroke-${T}`
  | TWColorOpacity<`stroke-${T}`>
>
