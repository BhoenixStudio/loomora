import { renderHook } from '@testing-library/react'
import type { PropsWithChildren, ReactNode } from 'react'
import { LoomoraProvider, loomoraDefaults, useLoomora } from '../src/config'
import { mergeConfig } from '../src/config/helper'
import { useSocials } from '../src/database/socials'

function TestLink({ href, children }: { href: string; children?: ReactNode }) {
  return <a href={href}>{children}</a>
}

describe('Loomora configuration', () => {
  it('returns built-in defaults without a provider', () => {
    const { result } = renderHook(() => useLoomora())

    expect(result.current.translations.socials.github).toEqual({ name: 'GitHub', placeholder: 'ex: username' })
    expect(result.current.LinkType).toBe('a')
  })

  it('accepts a consumer-provided link component', () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <LoomoraProvider config={{ LinkType: TestLink }}>{children}</LoomoraProvider>
    )
    const { result } = renderHook(() => useLoomora(), { wrapper })

    expect(result.current.LinkType).toBe(TestLink)
  })

  it('applies partial overrides without resetting sibling values', () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <LoomoraProvider config={{ translations: { socials: { github: { name: 'Git traduit' } } } }}>
        {children}
      </LoomoraProvider>
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
      <LoomoraProvider config={{ translations: { socials: { github: { name: 'Git parent' } } } }}>
        <LoomoraProvider config={{ translations: { socials: { github: { placeholder: 'identifiant' } } } }}>
          {children}
        </LoomoraProvider>
      </LoomoraProvider>
    )
    const { result } = renderHook(() => useSocials(), { wrapper })

    expect(result.current.getSocial('github')).toMatchObject({
      name: 'Git parent',
      placeholder: 'identifiant',
    })
  })

  it('does not mutate the base or override objects while merging', () => {
    const override = { translations: { socials: { github: { name: 'Git traduit' } } } } as const
    const merged = mergeConfig(loomoraDefaults, override)

    expect(merged.translations.socials.github).toEqual({ name: 'Git traduit', placeholder: 'ex: username' })
    expect(loomoraDefaults.translations.socials.github).toEqual({ name: 'GitHub', placeholder: 'ex: username' })
    expect(override).toEqual({ translations: { socials: { github: { name: 'Git traduit' } } } })
  })
})
