---
title: 메이플 분배금 계산기 프로젝트 세팅
date: "2023-09-18T00:00:00Z"
description: "메이플 분배금 계산기 프로젝트를 시작해 보자"
tags: ["web", "front", "react"]
---

요즘은 마음에 여유가 줄어들어서 거의 접속을 못 하고 있지만 메이플스토리를 열심히 했던 적이 잠깐 있었는데 그때 알게 된 분들이 메이플 보스 보상금 분배 시 쓸 수 있는 분배금 계산기를 만들자고 제안해 주셔서 프론트를 맡게 되었다.

react를 기본으로 하고 그리고 shadcn-ui와 같은 라이브러리를 팍팍 사용해서 일단 작동하도록 만들어 보고자 한다. shadcn-ui는 radix ui 기반으로 접근성까지 잘 챙기고 있으므로 내가 직접 접근성 등의 요소들을 조율해 주는 것보다 훨 나을 것이다.

# 1. 프로젝트 생성, 세팅

vite로 간단히 생성하자.

```bash
yarn create vite maple-share --template react-ts
```

그리고 포매팅을 위한 툴들을 설치한다. 이번에는 다른 사람들도 코드를 볼 수도 있으니 더욱 강력한 포매팅을 할 것이다.

```bash
yarn add -D prettier eslint-config-prettier eslint-plugin-prettier
```

`@typescript-eslint/parser`랑 `@typescript-eslint/eslint-plugin`는 기본적으로 설치되어 있었다.

그럼 이제 eslint 플러그인들을 설치하자. 이전에 다른 작은 프로젝트를 할 때 사용했던 플러그인들에 `eslint-config-airbnb`를 더한 것이다. `eslint-config-airbnb`는 [airbnb의 JS 스타일 가이드](https://github.com/airbnb/javascript)를 자동으로 적용해 준다. 이 가이드에 대해서는 추후 더 글을 작성해볼 예정이다.

```bash
yarn add -D eslint-plugin-import eslint-plugin-react eslint-plugin-unused-imports eslint-config-airbnb eslint-plugin-jsx-a11y
```

그리고 다음과 같이 철저한 포매팅을 위한 `.eslintrc.cjs`를 작성한다. 이 룰은 [이창희](https://xo.dev/)님의 블로그에 있는 lint 파일과 내가 개인적으로 개발하면서 썼던 airbnb 룰 몇 가지를 적절히 섞은 것이다.

```js
// .eslintrc.cjs
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: true,
    tsconfigRootDir: __dirname,
  },
  plugins: ['react-refresh', 'unused-imports'],
  rules: {
    'react/prop-types': 'off',
    'react/jsx-filename-extension': [
      'warn',
      {
        'extensions': [
          '.js',
          '.ts',
          '.jsx',
          '.tsx'
        ] // 확장자로 js와 jsx ts tsx 허용
      }
    ],
    'react/no-unescaped-entities': 'warn',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-boolean-value': 'off',
    'react/jsx-no-bind': 'off',
    'react/require-default-props': 'off',
    'react/self-closing-comp': 'warn', // 셀프 클로징 태그 가능하면 적용
    'react/no-array-index-key': 'off',
    'react-hooks/exhaustive-deps': ['warn'], // hooks의 의존성배열이 충분하지 않을때 강제로 의존성을 추가하는 규칙을 완화
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'jsx-a11y/click-events-have-key-events': 'off', // onClick 사용하기 위해서 onKeyUp,onKeyDown,onKeyPress 하나 이상 사용
    'indent':[
      'error',
      2
    ],
    'import/no-named-as-default': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'import/order': [
      'warn',
      {
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': true
        },
        'groups': [
          'builtin',
          'external',
          [
            'parent',
            'internal'
          ],
          'sibling',
          [
            'unknown',
            'index',
            'object'
          ]
        ],
        'pathGroups': [
          {
            'pattern': '~/**',
            'group': 'internal'
          }
        ],
        'newlines-between': 'always'
      }
    ],
    'arrow-parens': ['warn', 'as-needed'], // 화살표 함수의 파라미터가 하나일때 괄호 생략
    'no-console': ['off'], // 콘솔을 쓰면 에러가 나던 규칙 해제
    'no-alert': ['off'], // alert를 쓰면 에러가 나던 규칙 해제
    'jsx-quotes': [
      'error',
      'prefer-single'
    ],
    'keyword-spacing': 'error',
    'quotes': [
      'error',
      'single',
      {
        'avoidEscape': true
      }
    ],
    'no-console': [
      'warn',
      {
        'allow': [
          'warn',
          'error'
        ]
      }
    ],
    'no-extra-semi': 'error',
    'semi': 'off',
    'space-before-blocks': 'error',
    'no-shadow': 'off',
    'unused-imports/no-unused-imports': 'error',
    '@typescript-eslint/no-shadow': [
      'error'
    ],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/semi': [
      'error'
    ],
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        'checksVoidReturn': false
      }
    ],
    '@typescript-eslint/type-annotation-spacing': [
      'error',
      {
        'before': false,
        'after': true,
        'overrides': {
          'colon': {
            'before': false,
            'after': true
          },
          'arrow': {
            'before': true,
            'after': true
          }
        }
      }
    ]
  },
}
```

그런데 이 상태에서는 제대로 자동 수정이 되지 않는다. tsconfig.json에 해당 eslint 파일이 포함되어 있지 않기 때문이라고 한다. 이를 수정하기 위해서는 다음과 같이 tsconfig.json의 `include`항목을 수정해 주어야 한다.

```json
{
  /* compilerOptions 생략 */
  "include": ["src", "vite.config.ts", ".eslintrc.cjs",],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

그리고 `vite.config.ts`에서 이를 인식하도록 하기 위해 `vite-tsconfig-paths`를 설치한다.

```bash
yarn add -D vite-tsconfig-paths
```

그리고 `vite.config.ts`를 다음과 같이 수정한다.

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
})
```

이렇게 하면 자동 수정이 잘 되는 것을 볼 수 있다.

마지막으로 import alias를 통해 절대 경로 비슷하게 import해올 수 있도록 하자. tsconfig.json의 `compilerOptions`에 다음과 같이 `paths`를 추가한다.

```json
{
  "compilerOptions": {
    /* 생략 */
    "paths": {
      "@/*": ["./src/*"],
    },
  },
  /* 생략 */
}
```

# 2. shadcn ui

이 프로젝트에서는 [shadcn ui](https://ui.shadcn.com/)를 사용하기로 했다. 원래 mantine ui를 사용하려 했으나 분배금 계산기 기획 특성상 커스텀을 많이 해야 하는 컴포넌트가 많고 따라서 커스텀이 더 쉬운 이쪽이 더 낫다고 생각했기 때문이다.

shadcn ui가 처음이라 사실 얼마나 장점이 많을지는 모르겠지만, 써본 몇 사람들의 말로는 굉장히 괜찮다고 하여 한번 부딪쳐본다. tailwind도 이전에 써본 적이 있어, 단점도 꽤 있지만 빠르게 무언가를 만들기에 굉장히 좋다는 걸 알고 있기에 이걸 이용하면 상당히 빠르게 프로토타입을 만들 수 있을 거라고 생각한다.

## 2.1. 설치

그럼 [shadcn ui의 vite 설치 가이드](https://ui.shadcn.com/docs/installation/vite)를 따라해 보자. vite 프로젝트 생성하는 부분은 이미 했으므로 건너뛴다.

```bash
yarn add -D tailwindcss postcss autoprefixer
yarn tailwindcss init -p
```

`tsconfig.json`에서 `baseUrl`도 설정해준다.

```json
"baseUrl": ".",
"paths": {
  "@/*": ["./src/*"]
}
```

path를 사용하기 위해 `@types/node` 설치

```bash
yarn add -D @types/node
```

`vite.config.ts`는 다음과 같이 작성

```ts
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

그리고 `shadcn-ui`를 받아온다. 패키지는 아니기 때문에 설치라고 하기는 좀 그렇고...

```bash
npx shadcn-ui@latest init
```

이렇게 하면 여러 문답이 나오는데 적당히 응답한다. 주의할 점은 `Where is your global CSS file?`이라는 질문이 있는데 여기서 기본 응답은 `app/globals.css`이다. 아마 nextJS를 기본으로 생각하고 만든 것 같다. 하지만 이 프로젝트는 vite를 사용하고 있으므로 `src/index.css`로 바꿔줘야 한다.

그렇게 하고 나면 `src/index.css`가 알아서 초기화된다.

## 2.2. 시험

이제 컴포넌트를 받아 와서 사용할 수 있다. 공식 문서에서는 버튼을 하나의 예시로 들고 있다.

```bash
npx shadcn-ui@latest add button
```

이렇게 하면 `src/components/button.tsx`가 생성된다. 이제 이걸 사용해 보자. `src/App.tsx`로 간다. tailwind 클래스를 적용해서 색도 바꿔보자.

```tsx
// src/App.tsx
import { Button } from './components/ui/button';

function App() {
  return (
    <div>
      <h1>메이플 분배금 계산기</h1>
      <Button>버튼</Button>
      <Button className='bg-indigo-500'>버튼</Button>
      <Button className='bg-pink-500'>버튼</Button>
    </div>
  );
}

export default App;
```

이렇게 하면 다음과 같이 각 색의 버튼 3개가 나온다.

![shadcn 버튼들](./shadcn-button.png)

# 참고

eslint airbnb 사용하기 https://hayjo.tistory.com/111

shadcn ui 공식 문서 https://ui.shadcn.com/