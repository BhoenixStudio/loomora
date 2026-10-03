'use client'

import dynamic from 'next/dynamic'

const ComponentDemo = dynamic(() => import('./ComponentDemo').then(({ ComponentDemo }) => ComponentDemo), {
  ssr: false,
  loading: () => <div className="min-h-48 animate-pulse rounded-2xl border border-third bg-second" />,
})

export function PlaygroundDemo({ demo }: { demo: string }) {
  return <ComponentDemo demo={demo} />
}
