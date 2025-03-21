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
  {
    ignores: ['.next/*', 'node_modules/*', '!src/**/*'],
  },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  stylisticJs.configs.customize({
    arrowParens: true,
    indent: 2,
    semi: true,
    commaDangle: 'always-multiline',
  }),
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      '@stylistic': stylisticJs,
      'unused-imports': unusedImports,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'], // 인터페이스 사용
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowNumber: true, // 숫자 허용
        },
      ], // 함수 반환 타입 명시
      'import/order': [
        'error',
        {
          'alphabetize': {
            order: 'asc', // 알파벳 순 정렬
            caseInsensitive: true, // 대소문자 구분 안 함
          },
          'groups': [
            'builtin',
            'external',
            ['internal', 'parent'],
            'sibling',
            'index',
          ],
          'newlines-between': 'always', // 그룹 간 공백 추가
        },
      ],
      'import/no-unresolved': 'error', // 해결되지 않은 모듈 경고
      'import/default': 'error', // 기본 임포트 검사
      'import/namespace': 'error', // 네임스페이스 임포트 검사
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
      'no-useless-escape': 'off',
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],
    },
  },
  ...compat.config({
    extends: ['next', 'next/core-web-vitals'],
  }),
  {
    files: ['**/*.js', '**/*.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
