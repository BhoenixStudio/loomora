'use client'

import { DependencyList, ReactNode, useMemo } from 'react'
import { echo } from './index'

export interface Variant<T> {
  title?: ReactNode
  props?: Partial<T>
  condition: boolean
  message?: string
}

export interface AdaptOptions<T> {
  rules: Variant<T>[]
  shared?: Partial<Variant<T>['props']>
  debug?: boolean
}

export type AdaptedResult<T> = Partial<Omit<Variant<T>, 'condition' | 'props'>> & { props: T; isValid: boolean }

export function useAdapt<T = unknown>(
  base: Pick<Variant<T>, 'title' | 'props'>,
  options: AdaptOptions<T>
): AdaptedResult<T> {
  const { shared = {}, rules = [], debug = false } = options

  const strProps = JSON.stringify(rules?.map(({ condition, message }) => ({ condition, message })))
  const strShared = JSON.stringify(shared)
  const strValid = JSON.stringify(base)
  const deps: DependencyList = [strValid, strProps, strShared]

  const rule = useMemo(() => {
    if (!base && !rules) return { isValid: false, props: {} as T }

    const {
      title,
      props,
      message,
      condition: ruleFound,
    } = rules.find(({ condition }) => condition) ?? ({} as Variant<T>)

    if (!ruleFound) return { ...base, isValid: true }
    return { title, props: { ...shared, ...props }, message, isValid: false }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  if (debug) echo('Adapt', { base, rules, shared, result: rule })

  return rule as AdaptedResult<T>
}
