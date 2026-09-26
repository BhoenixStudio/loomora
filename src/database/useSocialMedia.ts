'use client'

import { useLoomoraConfig } from '../config/config-context'

/**
 * Configurable social-platform metadata and filtered lookup helpers.
 *
 * The internal `Socials` catalog defines icon identifiers, brand colors, and
 * URL prefixes. Names and placeholders come from the effective Loomora config,
 * allowing a consuming project to provide translated values. `useSocials`
 * exposes a list lookup and a single-platform lookup with typed shallow
 * extensions, inclusion filters, and exclusion filters.
 *
 * Minimal example:
 *
 * ```tsx
 * const { getSocial } = useSocials()
 * const github = getSocial('github')
 * ```
 *
 * `getSocials({ only: ['github', 'youtube'] })` is the observed filtered
 * list shape. This module does not build final profile URLs, render icons, or
 * validate an account identifier; callers use the returned `prefix`,
 * `placeholder`, and other metadata for those concerns.
 */

function Socials() {
  const platforms = {
    behance: {
      icon: 'uim:behance',
      color: '#1769FF',
      prefix: 'https://behance.net/',
    },
    discord: {
      icon: 'ic:baseline-discord',
      color: '#5865F2',
      prefix: 'https://discord.gg/',
    },
    dribbble: {
      icon: 'mingcute:dribbble-fill',
      color: '#EA4C89',
      prefix: 'https://dribbble.com/',
    },
    facebook: {
      icon: 'ic:baseline-facebook',
      color: '#1877F2',
      prefix: 'https://facebook.com/',
    },
    github: {
      icon: 'mdi:github',
      color: '#181717',
      prefix: 'https://github.com/',
    },
    instagram: {
      icon: 'mdi:instagram',
      color: '#E4405F',
      prefix: 'https://instagram.com/',
    },
    linkedin: {
      icon: 'mdi:linkedin',
      color: '#0A66C2',
      prefix: 'https://linkedin.com/',
    },
    pinterest: {
      icon: 'mdi:pinterest',
      color: '#BD081C',
      prefix: 'https://pinterest.com/',
    },
    snapchat: {
      icon: 'mingcute:snapchat-fill',
      color: '#FFFC00',
      prefix: 'https://snapchat.com/',
    },
    spotify: {
      icon: 'mdi:spotify',
      color: '#1DB954',
      prefix: 'https://spotify.com/',
    },
    telegram: {
      icon: 'ic:baseline-telegram',
      color: '#26A5E4',
      prefix: 'https://telegram.org/',
    },
    threads: {
      icon: 'mingcute:threads-line',
      color: '#000000',
      prefix: 'https://threads.net/',
    },
    tiktok: {
      icon: 'ic:baseline-tiktok',
      color: '#FF0050',
      prefix: 'https://tiktok.com/',
    },
    wechat: {
      icon: 'ic:baseline-wechat',
      color: '#07C160',
      prefix: 'https://wechat.com/',
    },
    whatsapp: {
      icon: 'ic:baseline-whatsapp',
      color: '#25D366',
      prefix: 'https://wa.me/',
    },
    x: {
      icon: 'prime:twitter',
      color: '#000000',
      prefix: 'https://x.com/',
    },
    youtube: {
      icon: 'mdi:youtube',
      color: '#FF0000',
      prefix: 'https://youtube.com/',
    },
  } as const

  return platforms
}

type SocialsProps = ReturnType<typeof Socials>
export type SocialType = keyof SocialsProps

/** A social-platform record with its catalog key attached. */
export type SocialPlatform = SocialsProps[SocialType] & {
  key: SocialType
  name: string
  placeholder?: string
}

/** Filters and optional shallow additions accepted by social lookups. */
export type GetSocials<T extends object = object> = {
  extra?: Partial<Record<SocialType, T>>
  only?: SocialType[]
  except?: SocialType[]
}

/**
 * Returns configurable social-platform lookup helpers.
 *
 * @returns `getSocials` and `getSocial`.
 * @remarks `getSocials` preserves catalog order, applies `only` first and
 * `except` second, and shallow-merges `extra` into each platform. `getSocial`
 * performs the same shallow merge for one typed platform key.
 */
export function useSocials() {
  const socials = Socials()
  const { socials: socialConfig } = useLoomoraConfig()

  const getSocials = <T extends object = object>(props?: GetSocials<T>): (SocialPlatform & T)[] => {
    const { extra = {}, only = [], except = [] } = props ?? {}

    let socialsList = Object.entries(socials).map(([key, social]) => ({
      key: key as SocialType,
      ...social,
      ...socialConfig[key as SocialType],
      ...extra?.[key as SocialType],
    })) as (SocialPlatform & T)[]

    if (only.length > 0) socialsList = socialsList.filter(({ key }) => only.includes(key))
    if (except.length > 0) socialsList = socialsList.filter(({ key }) => !except.includes(key))

    return socialsList
  }

  const getSocial = <T extends object = object>(
    platform: SocialType,
    props?: Pick<GetSocials<T>, 'extra'>
  ): SocialPlatform & T =>
    ({
      key: platform,
      ...socials[platform],
      ...socialConfig[platform],
      ...props?.extra?.[platform],
    }) as SocialPlatform & T

  return { getSocials, getSocial }
}

/**
 * Documentation metadata:
 * - Last documentation update: 2026-09-18
 * - Documentation audience: Developers and AI agents
 * - Evidence basis: Attached file + verified project context
 * - Documentation coverage: Complete
 * - Validation: Passed focused configuration tests, Prettier, ESLint, and the package build.
 * - Known limitations: Some platforms intentionally have no `placeholder` field, and the typed platform key has no runtime validation for untyped input.
 */
