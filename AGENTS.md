# Loomora agent instructions

## Project overview

Loomora is a TypeScript React component and utility library intended for consumption from the `loomora` package root. Its current public surface includes UI and form components, hooks, country/social/timezone metadata, configuration, shared types, and helpers. The repository also contains a private Next.js playground that consumes the library during development; it is not part of the published package.

The package is at version `0.1.0` and is prepared for npm publishing. Do not assume it has already been published. Package metadata contains placeholder GitHub username values that must be replaced before a real release.

## Technology and package contract

- TypeScript with React and JSX; ESM source (`"type": "module"`).
- Node.js `>=20.19.0` and npm `>=10.0.0` are recorded in `package.json`.
- React and React DOM peer range: `>=18.2.0 <20`.
- Other declared peer dependencies: `@tinymce/tinymce-react >=6.3.0` and `date-fns >=4.4.0`.
- Build: tsup, from `src/index.ts` to `dist/`, in ESM and CJS formats with declarations and source maps; React and React DOM are external.
- Tests: Vitest with jsdom and Testing Library. Lint: ESLint with TypeScript and React Hooks rules. Formatting: Prettier.
- The checked-in dependency lockfile is `pnpm-lock.yaml`. Repository installs should use pnpm to honor it. npm and Yarn commands are usable for scripts, but their installs do not use this lockfile; do not create or update another lockfile as a side effect.
- `package.json` declares the `playground` npm workspace. The playground is a private Next.js app configured to consume the local library source while developing.

`LoomoraProvider` imports `src/styles/index.css` and includes the theme provider. `src/utils/Theme.tsx` imports `next-intl`, and `ThemeProvider` uses the `theme` translation namespace. `next-intl` is not listed in the package's peer dependencies. Keep this integration and its current dependency declaration discrepancy in mind when modifying provider integration or documentation; do not silently broaden the package contract.

## Repository structure

| Path                                                                                         | Purpose and change guidance                                                                                                                                                              |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/index.ts`                                                                               | Package root barrel. Public exports flow through this file; maintain it when adding or removing public modules.                                                                          |
| `src/components/`                                                                            | UI, form, helper, and partial components, re-exported from `src/components/index.ts`. Keep component-specific behavior and types in their feature areas.                                 |
| `src/config/`                                                                                | Configuration types, defaults, context/provider, and recursive merge logic. Preserve partial-override behavior and nested provider inheritance.                                          |
| `src/database/`                                                                              | Static country, social-platform, and timezone metadata plus lookup hooks.                                                                                                                |
| `src/hooks/`                                                                                 | General React hooks and helpers; exported by its barrel.                                                                                                                                 |
| `src/utils/`                                                                                 | Theme and responsive providers and context helpers.                                                                                                                                      |
| `src/styles/`                                                                                | Library CSS imported from the configuration context.                                                                                                                                     |
| `src/types/`                                                                                 | Shared public TypeScript types.                                                                                                                                                          |
| `tests/`                                                                                     | Vitest tests (`*.test.tsx`) and test setup. Add or update focused tests for behavior changes.                                                                                            |
| `playground/`                                                                                | Private Next.js consumer app; it is useful for integration checks and excluded from the root TypeScript and ESLint source checks.                                                        |
| `dist/`                                                                                      | Generated build output; excluded from Git and the root lint/type-check inputs. Do not edit by hand.                                                                                      |
| `package.json`, `pnpm-lock.yaml`                                                             | Package contract/scripts/dependencies and pnpm dependency graph, respectively. Change dependency declarations deliberately and keep the lockfile consistent when modifying dependencies. |
| `tsup.config.ts`, `tsconfig.json`, `vitest.config.ts`, `eslint.config.mjs`, `.prettierrc.js` | Build, TypeScript, tests, lint, and formatting configuration.                                                                                                                            |
| `README.md`, `CHANGELOG.md`, `LICENSE`                                                       | Consumer documentation, release notes, and MIT license. The package manifest includes them in the published-file allowlist.                                                              |

Source files are maintained by hand unless a file is explicitly marked otherwise. Build artifacts under `dist/` are generated by `pnpm run build` (or the equivalent package script) and must not be used as the source of truth.

## Instructions directory and files

- `AGENTS.md` (this file): root-wide coding-agent guidance for the library, tests, package contract, and playground. Read it before making repository changes.
- `Reports/instructions/project-documentation-architect.md`: documentation workflow for generating or updating project-level `AGENTS.md`, README, and optional design documentation. Use it when the user requests that documentation workflow or explicitly points to it. It does not define runtime code conventions. `Reports/*` is ignored by `.gitignore`, so treat its files as local workflow material rather than release content.
- `Reports/instructions/attached-file-documentation-architect.md`: documentation workflow for an explicitly attached file or folder. Use it only when the user requests that workflow or provides it for the task; its scope is documentation of the provided attachment.
- `src/components/UI/Button/README.md`: detailed component-level documentation for the Button unit. Read it before changing Button behavior, types, or exports. Its guidance applies to that unit and does not replace the root instructions.
- `src/components/UI/Button/README.md` contains older references to APIs and repository paths that may differ from the current source; verify those names against source before relying on them in code changes.
- No nested `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, or other dedicated code-agent rules files were found during repository inspection. No dedicated code instruction directory was found. If scoped agent instructions are added later, follow the most specific applicable instructions for their subtree alongside this root guidance; a narrower scope does not override unrelated root requirements.

Task-specific instructions supplied by the user apply within their stated task scope. Resolve conflicts by following the more specific applicable instruction where possible; ask if requirements remain incompatible.

## Development workflow

### Install dependencies

The committed lockfile is pnpm's:

```sh
pnpm install
```

The scripts can also be invoked with npm or Yarn:

```sh
npm install
yarn install
```

These latter installs do not use `pnpm-lock.yaml`. Do not check in a competing lockfile without an explicit package-manager policy change.

### Build, run, and validate

```sh
pnpm run build             # package ESM, CJS, and declaration output
pnpm run dev               # library watch build plus playground
pnpm run test:run          # complete Vitest suite once
pnpm run lint              # ESLint
pnpm run format:check      # Prettier check
pnpm run typecheck         # TypeScript check
pnpm run check             # lint, typecheck, tests, build, and npm pack dry run
pnpm run check:playground  # playground typecheck, lint, and build
```

Use the corresponding `npm run <script>` or `yarn run <script>` form if needed. The defined root scripts also include `test` for Vitest watch mode, `build:watch`, `dev:playground`, `format` (writes formatting changes), and `pack:dry` (`npm pack --dry-run`). `prepublishOnly` invokes `check`. Run the smallest relevant checks while iterating, then run `pnpm run check` for changes that affect the package contract or release readiness. Run `pnpm run check:playground` when an integration change could affect the playground.

## Public API and compatibility

- Package consumers import from `loomora`. Preserve root-barrel re-exports and the declared package entry points unless a deliberate public API change is requested.
- `tsup.config.ts` defines output as `dist/index.js`, `dist/index.cjs`, and `dist/index.d.ts`, referenced by `package.json` fields and exports.
- Keep React and React DOM external to the library build and within the declared peer range.
- Treat exported component props, hooks, types, defaults, configuration keys, and component behavior as public API. Favor backward-compatible additions. For removals or behavior/type changes, check in-repository consumers, tests, and the README; document intentional compatibility changes in `CHANGELOG.md` when appropriate.
- Configuration is recursively merged from defaults. Do not replace an entire default subtree when an override only intends to change one nested value; preserve nested-provider inheritance and avoid mutating either merge input.
- React hooks and components that use browser APIs or client hooks must retain correct client-component boundaries. Avoid adding server-only assumptions to their public contract.
- The provider imports the package stylesheet. Preserve this import and CSS behavior when changing provider entry points or build packaging, and validate that package contents still include all files needed at runtime.
- The package `files` allowlist currently includes `dist`, `README.md`, `CHANGELOG.md`, and `LICENSE`. If adding required runtime files, update the allowlist and verify them with the pack dry run.

## Coding conventions

Confirmed project conventions:

- Use TypeScript and follow the existing feature-folder and barrel-export structure.
- Match nearby formatting: two-space indentation, single quotes, no semicolons, trailing commas where supported, and Prettier's configured 120-column print width.
- Preserve React Hooks rules; `react-hooks/rules-of-hooks` is an error and exhaustive dependency issues are warnings.
- Keep public types close to their implementation and export them through existing barrels when they are part of the public API.
- Use the existing configuration, shared helpers, and component patterns where applicable rather than duplicating them.
- These are observed tool settings and source patterns. Recommendations in this file are agent guidance, not additional automated lint rules.

## Testing expectations

- Tests are under `tests/` and named `*.test.tsx` in the inspected suite. Vitest includes `tests/**/*.{test,spec}.{ts,tsx}`, runs with jsdom, and loads `tests/setup.ts`.
- Use Testing Library for React behavior where suitable. Add focused coverage for changed behavior and regression cases; update tests alongside changed public behavior.
- Run `pnpm run test:run` for a one-time complete suite or `pnpm run test -- <pattern>` for a focused Vitest run. The root `test` script starts Vitest watch mode.
- Use `pnpm run typecheck`, `pnpm run lint`, `pnpm run format:check`, and `pnpm run build` as applicable. Do not claim checks passed unless they were run.
- The currently inspected tests cover configuration merging/provider behavior and timezone utilities; do not infer coverage for untested components.

## Security, dependencies, and release

- Do not commit credentials, tokens, private keys, or local environment files. No required environment variables or secret-bearing environment files were found in the inspected manifests.
- Keep user-controlled content, browser storage, and file handling changes scoped and explicit; do not log sensitive user values.
- Add dependencies only when needed. Update `package.json` and the pnpm lockfile together using the repository's package manager. Keep runtime imports externalized or bundled intentionally according to the package contract, and distinguish peer dependencies from development-only dependencies.
- Do not publish, change npm access, alter repository identity, or release versions unless requested. Before a first release, verify package/repository identity, the GitHub placeholders, author/license metadata, peer dependencies, built outputs, and packed files. Publishing is configured public and `prepublishOnly` runs the full package check.
- No database, migration, deployment, or application service setup is defined in the project manifests.

## Agent operating procedure

1. Read this file and any applicable scoped guidance or component documentation.
2. Inspect the relevant implementation, public barrels, types, tests, and package configuration before editing.
3. Preserve established feature and export patterns; make the smallest complete change.
4. Update meaningful tests and developer/release documentation when public behavior or package usage changes.
5. Run the focused test, lint, type, format, or build checks relevant to the change; broaden to `pnpm run check` when appropriate.
6. Review `git diff` for accidental generated output, lockfile churn, missing exports, broken examples, or unintended public API changes.
7. Report what changed, the checks actually run, and any relevant limitations or unknowns.
