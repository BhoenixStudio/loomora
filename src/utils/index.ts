import { Context, useContext } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CTXType<T = 'SET', K = any> = { type?: T; payload?: K }
export type CTXAction<K> = CTXType<'SET', K> | CTXType<'UPDATE', Partial<K>> | CTXType<'RESET'>
export type CTXActions<P> = {
  state: P
  set: (payload: P) => void
  update: (payload: Partial<P>) => void
  reset: () => void
}

export function useContextSharedFns<P>(dispatch: (action: CTXAction<P>) => void) {
  const set = (payload: P) => dispatch({ type: 'SET', payload })
  const update = (payload: Partial<P>) => dispatch({ type: 'UPDATE', payload })
  const reset = () => dispatch({ type: 'RESET' })

  return { set, update, reset }
}

export function useContextFns<K>(initial: K) {
  const reducer = (state: K, action: CTXAction<K>): K => {
    const actions: Record<'SET' | 'UPDATE' | 'RESET', K> = {
      SET: { ...initial, ...action.payload },
      UPDATE: { ...state, ...action.payload },
      RESET: initial,
    }

    return actions[action.type ?? 'SET']
  }

  return { reducer }
}

export function useContextData<P, C>(
  name: string,
  providerName: string,
  Context: Context<(CTXActions<P> & C) | undefined>
) {
  const context = useContext(Context)
  if (!context) throw new Error(`${name} must be used within a ${providerName}`)

  const { state, ...rest } = context
  return { ...state, state, ...rest }
}

export * from './Responsive'
export * from './Theme'
