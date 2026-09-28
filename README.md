# Loomora

Loomora is a TypeScript React library of reusable form inputs, UI components, hooks, and shared defaults for product teams. Its public API is exported from the package root, `loomora`.

> This repository is prepared for an npm release. A published release is not guaranteed; check npm for current package availability.

## Features

- UI components such as `Accordion`, `Button`, `Dialog`, `Dropdown`, and `Flag`.
- Form building blocks and inputs, including `Form`, `TextField`, `Select`, `Password`, `Phone`, `Autocomplete`, `TextEditor`, and `Uploader`.
- React hooks for dates, validation, local storage, responsive state, and country, social-platform, and timezone metadata.
- `LoomoraProvider` for optional, recursively merged configuration overrides and built-in defaults.
- ESM, CommonJS, and TypeScript declaration build outputs.

## Requirements

- Node.js `>=20.19.0`.
- React and React DOM `>=18.2.0 <20`.
- Install the package's declared peer dependencies for the features your application uses: `@tinymce/tinymce-react` `>=6.3.0` and `date-fns` `>=4.4.0`, in addition to React and React DOM.
- A React application with a bundler that can consume package CSS when using `LoomoraProvider` (the provider imports Loomora's stylesheet).

The supported peer dependency ranges are defined in [`package.json`](./package.json). When using `LoomoraProvider`, also install and configure a compatible `next-intl` version: Loomora's theme provider imports it and uses its `theme` translation namespace, but `next-intl` is not currently declared as a package peer dependency. Place `LoomoraProvider` beneath the application's `NextIntlClientProvider`.

## Install

Install Loomora and its peer dependencies with your package manager:

```sh
# npm
npm install loomora react react-dom @tinymce/tinymce-react date-fns

# pnpm
pnpm add loomora react react-dom @tinymce/tinymce-react date-fns

# Yarn
yarn add loomora react react-dom @tinymce/tinymce-react date-fns
```

React and React DOM are peer dependencies, so use versions compatible with the supported range. If your application does not use a feature that needs TinyMCE or date-fns, check your package manager's peer dependency behavior and install the required peers as appropriate.

## Use

Import components, hooks, types, and configuration exports from the package root:

```tsx
'use client'

import { Accordion, Button, TextField, useCountries } from 'loomora'

export function Example() {
  const { getCountry } = useCountries()
  const country = getCountry('OM')

  return (
    <>
      <Button title="Save" onClick={() => {}} />
      <Accordion title="Country">{country.name}</Accordion>
      <TextField label="Name" properties={{ name: 'name' }} />
    </>
  )
}
```

Hooks that read Loomora configuration can use built-in defaults without `LoomoraProvider`. Use the provider when you need to override defaults for a subtree. Configuration is recursively merged: partial overrides preserve unmentioned default values, and nested providers extend their parent's resolved configuration.

```tsx
import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { LoomoraProvider } from 'loomora'

// Render this beneath the application's NextIntlClientProvider.
export function AppProviders({ children }: { children: ReactNode }) {
  const t = useTranslations('common.data.socials')

  return (
    <LoomoraProvider
      config={{
        translations: {
          socials: {
            github: {
              name: t('github.name'),
              placeholder: t('github.placeholder'),
            },
          },
        },
      }}
    >
      {children}
    </LoomoraProvider>
  )
}
```

`LoomoraProvider` includes Loomora's stylesheet. Ensure the application build handles CSS imports from dependencies. Loomora components also use utility-class names; applications should provide the styling setup required by their chosen CSS workflow.

## Develop in this repository

The repository includes the library and a private Next.js playground. The checked-in lockfile is `pnpm-lock.yaml`; use pnpm for reproducible repository installs. npm and Yarn install and run commands are included below for contributors who prefer those tools. Avoid committing additional lockfiles unless the project intentionally changes its package-manager policy.

```sh
# Install from the repository root
pnpm install
# or
npm install
# or
yarn install

# Build the library
pnpm run build
npm run build
yarn run build

# Start the library watch build and private Next.js playground
pnpm run dev
npm run dev
yarn run dev
```

The root development command runs the library build in watch mode alongside the playground. The playground is private and is not included in the published package.

## Scripts

| Script                    | Purpose                                                                     |
| ------------------------- | --------------------------------------------------------------------------- |
| `build`                   | Build ESM, CommonJS, source maps, and TypeScript declarations into `dist/`. |
| `build:watch`             | Rebuild the library when source files change.                               |
| `dev`                     | Run the library watch build and playground development server together.     |
| `dev:playground`          | Start the playground's Next.js development server.                          |
| `test`                    | Start Vitest in watch mode.                                                 |
| `test:run`                | Run the complete test suite once.                                           |
| `lint`                    | Run ESLint.                                                                 |
| `format` / `format:check` | Format files / check formatting with Prettier.                              |
| `typecheck`               | Type-check the library with TypeScript.                                     |
| `check`                   | Run lint, typecheck, tests, build, and an npm pack dry run.                 |
| `check:playground`        | Type-check, lint, and build the private playground.                         |
| `pack:dry`                | Preview the files that would be included in an npm package.                 |

Run scripts with your package manager, for example `pnpm run test:run`, `npm run test:run`, or `yarn run test:run`. The package's `prepublishOnly` script runs `check` before publishing.

## Repository layout

| Path              | Contents                                                              |
| ----------------- | --------------------------------------------------------------------- |
| `src/components/` | Public UI, form, helper, and partial components.                      |
| `src/config/`     | Provider, configuration types, built-in defaults, and merge behavior. |
| `src/database/`   | Country, social-platform, and timezone data hooks.                    |
| `src/hooks/`      | General-purpose React hooks and helpers.                              |
| `src/styles/`     | Stylesheet imported by the configuration provider.                    |
| `src/types/`      | Shared public TypeScript types.                                       |
| `tests/`          | Vitest tests and test setup.                                          |
| `playground/`     | Private Next.js consumer app for local development.                   |
| `dist/`           | Generated package build output; not hand-maintained.                  |

## Package contents and compatibility

The package root exports from `src/index.ts`; package consumers should import from `loomora` rather than from internal source paths. The build produces `dist/index.js` (ESM), `dist/index.cjs` (CommonJS), and `dist/index.d.ts` (TypeScript declarations). The published file allowlist is configured in `package.json` and currently includes `dist`, this README, the changelog, and the license.

The components use React client hooks and browser APIs in places. Use client boundaries appropriate to your React framework for components or hooks that require them. The package does not document a separate server-only entry point.

## Release notes

See [`CHANGELOG.md`](./CHANGELOG.md). Before the first release, replace the GitHub username placeholders in `package.json` and confirm the package name, author, license, repository details, and npm publishing account.

## License

MIT. See [`LICENSE`](./LICENSE).
