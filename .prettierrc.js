export default {
  trailingComma: 'es5',
  bracketSpacing: true,
  tabWidth: 2,
  printWidth: 120,
  semi: false,
  singleQuote: true,

  overrides: [{ files: ['*.scss', '*.sass'], options: { trailingComma: 'none' } }],
}
