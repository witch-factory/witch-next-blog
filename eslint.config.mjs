import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import unusedImports from 'eslint-plugin-unused-imports';
import ts from 'typescript-eslint';
import stylisticJs from '@stylistic/eslint-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const config = [
  ...compat.extends('next', 'next/core-web-vitals', 'prettier'),
  ...ts.configs.recommended,
  {
    ignores: ['.next/*', 'node_modules/*', '!src/**/*'],
  },
  {
    plugins: {
      '@stylistic': stylisticJs,
      'unused-imports': unusedImports,
      prettier: prettierConfig,
    },

    rules: {
      'no-unused-vars': 'off',
      'max-len': 'off',
      'object-curly-spacing': ['error', 'always'],
      indent: ['error', 2],
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

      '@stylistic/jsx-quotes': ['error'],
      '@stylistic/arrow-parens': ['error', 'as-needed'],
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

      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
        },
      ],

      'react/jsx-filename-extension': [
        'warn',
        {
          extensions: ['.tsx'],
        },
      ],

      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],

      'react/no-unescaped-entities': 'warn',
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
    },
  },
];

export default config;
