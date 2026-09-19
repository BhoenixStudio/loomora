// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CTXType<T = 'SetAll', K = any> = { type?: T; payload?: K }
export type CTXAction<K> = CTXType<'Set', K> | CTXType<'Update', Partial<K>> | CTXType<'Reset'>
export function useContextFns<K>(initial: K) {
  const reducer = (state: K, action: CTXAction<K>): K => {
    const actions: Record<'Set' | 'Update' | 'Reset', K> = {
      Set: { ...initial, ...action.payload },
      Update: { ...state, ...action.payload },
      Reset: initial,
    }

    return actions[action.type ?? 'Set']
  }

  return { reducer }
}

export * from './Responsive'
export * from './Theme'
