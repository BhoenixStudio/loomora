import { defineConfig, globalIgnores } from 'eslint/config'
import nextTs from 'eslint-config-next/typescript'
import nextVitals from 'eslint-config-next/core-web-vitals'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    settings: {
      react: {
        version: '19',
      },
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'public/**', 'next-env.d.ts']),
])
