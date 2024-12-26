// @ts-check

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.stylistic,
  compat.config({
    extends: ['next', 'next/core-web-vitals', 'next/typescript'],
  }),
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['.next/*', 'node_modules/*', '!src/**/*'],
  },
  {
    plugins: {
      '@stylistic': stylisticJs,
      'unused-imports': unusedImports,
    },
    rules: {
      // TODO: import 플러그인 설치/사용
      'import/extensions': 'off',
      'import/prefer-default-export': 'off',

      'import/order': [
        'warn',
        {
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },

          groups: [
            'builtin',
            'external',
            ['parent', 'internal'],
            'sibling',
            ['unknown', 'index', 'object'],
          ],
          pathGroups: [
            {
              pattern: '~/**',
              group: 'internal',
            },
          ],

          'newlines-between': 'always',
        },
      ],

      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/arrow-parens': ['error'],
      '@stylistic/quotes': [
        'error',
        'single',
        {
          allowTemplateLiterals: true,
        },
      ],
      '@stylistic/jsx-quotes': ['error'],
      '@stylistic/semi': ['error'],
      '@stylistic/max-len': ['error', { code: 80, tabWidth: 2 }],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/keyword-spacing': ['error'],
      '@stylistic/space-before-blocks': ['error'],
      '@stylistic/space-infix-ops': ['error'],
      '@stylistic/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'comma', // 쉼표 사용
            requireLast: true,
          },
          singleline: {
            delimiter: 'comma', // 단일 라인에서도 쉼표 사용
            requireLast: false,
          },
        },
      ],
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],
    },
  },
);
