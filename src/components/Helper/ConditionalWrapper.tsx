import { ElementType, ReactNode } from 'react'

type WrapperOption = { condition: boolean | undefined; as: ElementType; attributes?: Record<string, unknown> }

export type ConditionalWrapperProps = {
  children?: ReactNode
  childrenCondition?: boolean
  conditions?: WrapperOption[]
  sharedAttributes?: Record<string, unknown>
  fallback?: Partial<WrapperOption>
}

export function ConditionalWrapper(props: Readonly<ConditionalWrapperProps>) {
  const { conditions = [], children = null, childrenCondition = true, fallback, sharedAttributes } = props

  const { condition: fallbackCondition = true, as: FAs = 'div', attributes: FAttrs = {} } = fallback ?? {}

  if (conditions.length > 0) {
    const { as: As = 'div', attributes } = conditions.find(({ condition }) => condition) ?? {}
    return (
      <As {...sharedAttributes} {...attributes}>
        {children}
      </As>
    )
  }

  if (fallbackCondition)
    return (
      <FAs {...sharedAttributes} {...FAttrs}>
        {children}
      </FAs>
    )
  return childrenCondition ? children : null
}
