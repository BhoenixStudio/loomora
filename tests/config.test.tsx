import { renderHook } from '@testing-library/react'
import type { PropsWithChildren, ReactNode } from 'react'
import { LoomoraProvider, useLoomoraConfig } from '../src/config/config-context'
import { defaultConfig } from '../src/config/default-config'
import { mergeConfig } from '../src/config/merge-config'
import { useSocials } from '../src/database/useSocialMedia'

function TestLink({ href, children }: { href: string; children?: ReactNode }) {
  return <a href={href}>{children}</a>
}

describe('Loomora configuration', () => {
  it('returns built-in defaults without a provider', () => {
    const { result } = renderHook(() => useLoomoraConfig())

    expect(result.current.socials.github).toEqual({ name: 'GitHub', placeholder: 'ex: username' })
    expect(result.current.linkType).toBe('a')
  })

  it('accepts a consumer-provided link component', () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <LoomoraProvider config={{ linkType: TestLink }}>{children}</LoomoraProvider>
    )
    const { result } = renderHook(() => useLoomoraConfig(), { wrapper })

    expect(result.current.linkType).toBe(TestLink)
  })

  it('applies partial overrides without resetting sibling values', () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <LoomoraProvider config={{ socials: { github: { name: 'Git traduit' } } }}>{children}</LoomoraProvider>
    )
    const { result } = renderHook(() => useSocials(), { wrapper })

    expect(result.current.getSocial('github')).toMatchObject({
      name: 'Git traduit',
      placeholder: 'ex: username',
      icon: 'mdi:github',
    })
    expect(result.current.getSocial('youtube').name).toBe('YouTube')
  })

  it('inherits parent values in nested providers', () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <LoomoraProvider config={{ socials: { github: { name: 'Git parent' } } }}>
        <LoomoraProvider config={{ socials: { github: { placeholder: 'identifiant' } } }}>{children}</LoomoraProvider>
      </LoomoraProvider>
    )
    const { result } = renderHook(() => useSocials(), { wrapper })

    expect(result.current.getSocial('github')).toMatchObject({
      name: 'Git parent',
      placeholder: 'identifiant',
    })
  })

  it('does not mutate the base or override objects while merging', () => {
    const override = { socials: { github: { name: 'Git traduit' } } } as const
    const merged = mergeConfig(defaultConfig, override)

    expect(merged.socials.github).toEqual({ name: 'Git traduit', placeholder: 'ex: username' })
    expect(defaultConfig.socials.github).toEqual({ name: 'GitHub', placeholder: 'ex: username' })
    expect(override).toEqual({ socials: { github: { name: 'Git traduit' } } })
  })
})
