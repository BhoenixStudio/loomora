import { Fragment, ReactNode } from 'react'

type RenderConditionArray<T> = {
  condition: boolean | undefined
  render: (item: T, i: number, array: T[]) => ReactNode
}
type RenderConditionSingle<T> = { condition: boolean | undefined; render: (item: T) => ReactNode }

type UseContentArray<T> = {
  type?: 'ARRAY'
  data: T[]
  render: (item: T, i: number, array: T[]) => ReactNode
  renderConditions?: RenderConditionArray<T>[]
  loaderCount?: number
}
type UseContentSingle<T> = {
  type: 'SINGLE'
  data: T | undefined
  render: (item: T) => ReactNode
  renderConditions?: RenderConditionSingle<T>[]
  loaderCount?: never
}

export type UseContentProps<T> = { loading?: boolean; loader?: ReactNode; empty?: ReactNode } & (
  UseContentArray<T> | UseContentSingle<T>
)

export type UseContentReturn = Record<
  'loadingState' | 'emptyState' | 'finalState' | 'conditionalState' | 'content',
  ReactNode
>

export function useContent<T>(props: UseContentProps<T>): UseContentReturn {
  const { type = 'ARRAY', loading, loader, empty = null, renderConditions = [] } = props

  const { loaderCount = 1, data: arrayData = [], render: arrayRender } = props as UseContentArray<T>
  const { data: singleData, render: singleRender } = props as UseContentSingle<T>

  // Configs
  const singleDataProcess = singleData ? singleRender(singleData) : null

  // Content
  const loadingState =
    loader && Array.from({ length: loaderCount }).map((_, i) => <Fragment key={i}>{loader}</Fragment>)
  const emptyState = empty
  const finalState =
    type === 'ARRAY' ? arrayData.map((item, i, array) => arrayRender(item, i, array)) : singleDataProcess

  const matchingCondition = renderConditions.find(({ condition }) => condition)
  const renderConditionsState: ReactNode =
    type === 'ARRAY'
      ? arrayData.map((item, i, array) => (matchingCondition as RenderConditionArray<T>)?.render(item, i, array))
      : singleData
        ? (matchingCondition as RenderConditionSingle<T>)?.render(singleData)
        : null

  let content: ReactNode = finalState
  if (loading) content = loadingState
  else if (!loading && (type === 'ARRAY' ? arrayData.length === 0 : !singleData)) content = emptyState as ReactNode
  else if (matchingCondition) content = renderConditionsState

  return { loadingState, emptyState, conditionalState: renderConditionsState, finalState, content }
}

export function Content<T>(props: Readonly<UseContentProps<T>>) {
  const { content } = useContent(props)
  return <>{content}</>
}
