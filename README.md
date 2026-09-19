# Loomora

Composable React inputs, UI components, hooks, and shared defaults for product teams.

The public API is exported from the package root:

```tsx
import { Button, TextInput } from "loomora";
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

The playground is only for local development and is not included in the npm package. See `LIBRARY_PLAN.md` for the package architecture, configuration provider, release process, and publishing requirements.

Before the first release, replace the GitHub username placeholders in `package.json` and confirm the package name, author, license, and npm publishing account.

## License

MIT
