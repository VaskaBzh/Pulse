import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'prisma/migrations']),
  {
    files: ['**/*.ts'],
    extends: [js.configs.recommended, tseslint.configs.recommended, prettier],
    languageOptions: {
      globals: globals.node,
      sourceType: 'module',
    },
    rules: {
      // TypeScript strict — mirror the web workspace conventions.
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // NestJS modules are decorator-only classes; empty classes are intentional.
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },
  {
    // Jest specs (unit) and e2e tests run in a Node + Jest environment.
    files: ['**/*.spec.ts', 'test/**/*.ts'],
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
    },
  },
]);
