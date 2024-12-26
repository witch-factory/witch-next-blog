import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import unusedImports from 'eslint-plugin-unused-imports';
import ts from 'typescript-eslint';
import prettierConfigRecommended from "eslint-plugin-prettier/recommended";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

const config  = [...compat.extends('next', 'next/core-web-vitals', 'prettier'), 
  ...ts.configs.recommended,
  prettierConfigRecommended,
  {
    ignores: [".next/*"],
  },
  {
  plugins: {
    '@typescript-eslint': typescriptEslint,
    'unused-imports': unusedImports,
  },

  rules: {
    'no-unused-vars': 'off',
    'max-len': 'off',
    'object-curly-spacing': ['error', 'always'],
    indent: ['error', 2],
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',

    'import/order': ['warn', {
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

      pathGroups: [{
        pattern: '~/**',
        group: 'internal',
      }],

      'newlines-between': 'always',
    }],

    'jsx-quotes': ['error', 'prefer-single'],
    'keyword-spacing': 'error',

    quotes: ['error', 'single', {
      avoidEscape: true,
    }],

    'react/jsx-filename-extension': ['warn', {
      extensions: ['.tsx'],
    }],

    'no-console': ['warn', {
      allow: ['warn', 'error'],
    }],

    'react/no-unescaped-entities': 'warn',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    semi: 'off',
    'space-before-blocks': 'error',
    'space-infix-ops': 'error',
    'no-shadow': 'off',
  },
}];

export default config;