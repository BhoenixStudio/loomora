# Loomora

Composable React inputs, UI components, hooks, and shared defaults for product teams.

The public API is exported from the package root:

```tsx
import { Button, TextInput } from 'loomora'
```

## Development

Install dependencies from the repository root:

```bash
npm install
```

Run the private Next.js playground with library watch mode:

```bash
npm run dev
```

## Configuration

The configuration provider is optional. Without it, the hooks use Loomora's
built-in defaults. Projects can override social names and placeholders once,
which is useful when those values come from an application's translation layer:

```tsx
import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { LoomoraProvider } from 'loomora'

function AppProviders({ children }: { children: ReactNode }) {
  const t = useTranslations('common.data.socials')

  return (
    <LoomoraProvider
      config={{
        socials: {
          github: {
            name: t('github.name'),
            placeholder: t('github.placeholder'),
          },
        },
      }}
    >
      {children}
    </LoomoraProvider>
  )
}
```

Provider configuration is recursively merged with the defaults, so an
override for one platform does not remove the other platform values. Nested
providers inherit and extend the configuration from their parent.

The playground is only for local development and is not included in the npm package. See `LIBRARY_PLAN.md` for the package architecture, configuration provider, release process, and publishing requirements.

Before the first release, replace the GitHub username placeholders in `package.json` and confirm the package name, author, license, and npm publishing account.

## License

MIT
