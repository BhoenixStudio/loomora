import type { LoomoraConfig } from "./config-types";

/** Built-in values used when no provider or override is supplied. */
export const defaultConfig = {
  socials: {
    behance: { name: "Behance", placeholder: "ex: username" },
    discord: { name: "Discord", placeholder: "ex: username" },
    dribbble: { name: "Dribbble", placeholder: "ex: username" },
    facebook: { name: "Facebook", placeholder: "ex: username" },
    github: { name: "GitHub", placeholder: "ex: username" },
    instagram: { name: "Instagram", placeholder: "ex: username" },
    linkedin: { name: "LinkedIn", placeholder: "ex: username" },
    pinterest: { name: "Pinterest", placeholder: "ex: username" },
    snapchat: { name: "Snapchat", placeholder: "ex: username" },
    spotify: { name: "Spotify", placeholder: "ex: username" },
    telegram: { name: "Telegram", placeholder: "ex: username" },
    threads: { name: "Threads", placeholder: "ex: username" },
    tiktok: { name: "TikTok", placeholder: "ex: username" },
    wechat: { name: "WeChat", placeholder: "ex: 123456789" },
    whatsapp: { name: "WhatsApp", placeholder: "ex: 123456789" },
    x: { name: "X (Twitter)", placeholder: "ex: username" },
    youtube: { name: "YouTube", placeholder: "ex: channel name" },
  },
} satisfies LoomoraConfig;
