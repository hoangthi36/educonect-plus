import js from '@eslint/js'
import react from 'eslint-plugin-react'
import globals from 'globals'

export default [
  {
    ignores: ['client/dist/**', 'node_modules/**', 'coverage/**', 'kem-ban-demo/**', 'reference/**'],
  },
  js.configs.recommended,
  {
    files: ['client/src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { react },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'react/jsx-uses-vars': 'error',
    },
  },
  {
    files: ['server/**/*.{js,mjs}', 'scripts/**/*.mjs', '*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
]
