'use client'

import { useLoomora } from '../config'

export type SocialType = keyof SocialsProps

export type Social = SocialsProps[SocialType] & {
  key: SocialType
  name: string
  placeholder?: string
}

function Socials() {
  return {
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
}
type SocialsProps = ReturnType<typeof Socials>

export type GetSocials<T extends object = object> = {
  extra?: Partial<Record<SocialType, T>>
  only?: SocialType[]
  except?: SocialType[]
}

export function useSocials() {
  const socials = Socials()
  const { translations } = useLoomora()

  const getSocials = <T extends object = object>(props?: GetSocials<T>): (Social & T)[] => {
    const { extra = {}, only = [], except = [] } = props ?? {}

    let socialsList = Object.entries(socials).map(([key, social]) => ({
      key: key as SocialType,
      ...social,
      ...translations?.socials?.[key as SocialType],
      ...extra?.[key as SocialType],
    })) as (Social & T)[]

    if (only.length > 0) socialsList = socialsList.filter(({ key }) => only.includes(key))
    if (except.length > 0) socialsList = socialsList.filter(({ key }) => !except.includes(key))

    return socialsList
  }

  const getSocial = <T extends object = object>(
    platform: SocialType,
    props?: Pick<GetSocials<T>, 'extra'>
  ): Social & T =>
    ({
      key: platform,
      ...socials[platform],
      ...translations?.socials?.[platform],
      ...props?.extra?.[platform],
    }) as Social & T

  return { getSocials, getSocial }
}
