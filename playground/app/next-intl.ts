import type { ReactNode } from 'react'

type PlaygroundTranslations = (key: string, values?: Record<string, string | number | undefined | null>) => string

/** Minimal local translations for the component playground's library provider. */
export function useTranslations(namespace = ''): PlaygroundTranslations {
  return (key, values) => {
    const fullKey = namespace ? `${namespace}.${key}` : key
    const messages: Record<string, string> = {
      'theme.lightMode': 'Light mode',
      'theme.darkMode': 'Dark mode',
      'theme.systemDetection': 'System detection',
      'theme.systemDetectionDescription': 'Follow the device appearance',
      'theme.dynamicMode': 'Dynamic mode',
      'theme.dynamicModeDescription': 'Change appearance by time of day',
      'theme.darkModeStartTime': 'Day starts',
      'theme.darkModeEndTime': 'Day ends',
    }
    const message = messages[fullKey] ?? fullKey
    if (!values) return message
    return message.replace(/\{([^}]+)\}/g, (match, name: string) =>
      name in values && values[name] !== undefined && values[name] !== null ? String(values[name]) : match
    )
  }
}

export default function NextIntlPluginStub({ children }: { children: ReactNode }) {
  return children
}
