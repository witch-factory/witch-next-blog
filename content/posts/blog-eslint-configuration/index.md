---
title: 블로그에 ESLint 9 적용, 그 삽질과 설정의 기록
date: "2025-01-05T01:00:00Z"
description: "블로그에 ESLint 9를 적용하면서 겪었던 시행착오들과 ESLint를 이용한 코드 포매팅, 설정 등등"
tags: ["blog", "front", "study", "web"]
---

# 시작

블로그 프로젝트에 새로운 라이브러리를 깔 일이 있었다. 그래서 pnpm으로 새로운 라이브러리를 설치하다 보니, 원래 사용하고 있던 eslint 8이 deprecated되었다는 다음과 같은 경고가 나왔다.

```bash
WARN  deprecated eslint@8.47.0: This version is no longer supported. Please see https://eslint.org/version-support for other options.
```

이제 eslint 8은 더 이상 지원되지 않으니 최신 버전을 깔라는 메시지다. eslint 9가 나온 건 알고 있었지만 바꾸려면 해야 할 것도 많고 자료도 얼마 없어서 그냥 놔뒀었는데 이번에는 eslint 9로 업그레이드를 해보기로 했다.

# eslint 9 설치와 마이그레이션 시작

먼저 eslint 9를 설치한다. 나는 pnpm을 사용하고 있기 때문에 다음과 같이 설치했다.

```bash
# 2025년 1월 현재 eslint 최신 버전은 9.17.0이므로 
# eslint@latest를 설치해도 된다
pnpm install eslint@9
```

이제 설정 파일을 바꿔야 한다. eslint 9부터는 기존의 설정 파일 형식이 deprecated되었고, flat config라는 새로운 형식의 설정 파일을 써야 한다.

`extends`나 `overrides` 등의 설정이 없어지고 최신 JS를 사용하며 설정을 이루는 객체들을 1차원 배열에 넣는 방식이다. 이 글의 메인 주제는 아니지만 flag config에 대한 더 자세한 소개에 대해서는 [flat config에 대한 eslint의 소개 글](https://eslint.org/blog/2022/08/new-config-system-part-2/)을 참고할 수 있다.

따라서 eslint 9 사용을 위해서는 기존의 eslint 설정 파일을 flat config 형식의 `eslint.config.mjs` 파일로 바꿔야 한다. 나는 원래 `.eslintrc.json` 파일을 사용하고 있었으므로 이를 바꾸기로 했다.

[기존의 설정 파일 형식을 flat config로 바꾸는 도구](https://www.npmjs.com/package/@eslint/migrate-config)가 있기 때문에 이걸로 새로운 설정 파일의 기초를 잡을 수 있다. 나는 기존에 `.eslintrc.json` 설정 파일을 사용하고 있었기 때문에 다음과 같이 실행했다.

```bash
# .json이 아니라 .yml 등의 파일도 가능
# 단 이 글을 작성하고 있는 시점에 .eslintrc.js 파일에 대해서는 작동하지 않는다고 한다
# https://eslint.org/docs/latest/use/configure/migration-guide
npx @eslint/migrate-config .eslintrc.json
```

이 명령어를 실행하면 다음과 같은 메시지와 함께 기존의 설정 파일을 flat config로 변환한 `eslint.config.mjs`이 자동으로 생긴다. 다행히 기존 파일이 삭제되지는 않는다.

```bash 
Migrating .eslintrc.json

Wrote new config to ./eslint.config.mjs

You will need to install the following packages to use the new config:
- @eslint/js
- @eslint/eslintrc

You can install them using the following command:

npm install @eslint/js @eslint/eslintrc -D
```

flat config는 ESM 형식으로 모듈을 불러오는 걸 권장하고 있기에 자동으로 생성된 파일의 `.mjs` 확장자를 그대로 사용하자. 만약 CJS를 사용하고 싶다면 [설정 파일의 `languageOptions.sourceType` 속성](https://eslint.org/blog/2022/08/new-config-system-part-2/#setting-sourcetype-in-flat-config)을 바꾸면 된다.

그리고 위의 변환 완료 메시지에 따라 `@eslint/js`와 `@eslint/eslintrc`을 pnpm으로 설치하자.

```bash
pnpm install @eslint/js @eslint/eslintrc
```

프로젝트 루트에 `eslint.config.mjs` 파일이 다음과 같이 생성되었다. JSON에서 문자열 형식으로 플러그인을 사용하던 게 import로 바뀌었고 객체의 배열 형태로 설정이 들어가게 된 것을 볼 수 있다.

```js
// eslint.config.mjs
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import unusedImports from "eslint-plugin-unused-imports";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends("next", "next/core-web-vitals", "prettier"), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
        "unused-imports": unusedImports,
    },
    rules: {
      // 원래 사용하던 eslint 규칙들...
    },
}];
```

이렇게 했다고 해서 바로 그대로 작동하는 것은 아니다. 제대로 바꿔야 할 내용도 있고 작동 방식이 조금 바뀐 플러그인들도 설정 파일에서 적절히 변경해 줘야 하기 때문이다. 그래도 이제 첫걸음을 뗐다. 설정 파일들을 좀 더 살펴보고 추가하거나 수정할 부분들을 수정하자.

# 기존 플러그인 수정

기존의 eslint 설정 파일을 보면 export하는 객체의 `plugins` 속성에서 문자열 기반으로 플러그인을 로드하고, `extends` 속성으로 외부 설정을 로드한다.

반면 flat config에서는 플러그인을 JavaScript 객체로 나타내며, CommonJS의 `require()`나 ESM의 `import` 구문을 사용하여 외부 파일에서 플러그인을 로드한다. 그렇게 로드한 객체를 `plugins` 속성에 추가하면 `rules`에서 해당 플러그인의 규칙을 사용할 수 있다. 따라서 먼저 사용하던 플러그인들 중 수정이 필요한 것들을 수정하겠다.

## typescript-eslint

`@typescript-eslint/eslint-plugin` 등은 새로운 `typescript-eslint` 패키지로 합쳐졌으니 먼저 이를 설치한다.

```bash
pnpm add -D typescript-eslint
# 기존 패키지 삭제
pnpm remove @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

[`typescript-eslint`에서는 eslint 설정을 위한 `config` 헬퍼 함수를 제공한다. 임의의 개수의 flat config 객체를 받아들이고 이를 그대로 반환하는 함수이다.](https://typescript-eslint.io/packages/typescript-eslint#config) 이 헬퍼 함수를 이용하면 자동완성을 이용하면서 좀 더 편하게 설정을 작성할 수 있다. 그러니 기존의 플러그인과 설정들을 `tseslint.config` 함수를 이용해서 다시 구성할 것이다.

내가 `@typescript-eslint` 플러그인에서 사용하던 린터 설정들은 찾아보니 다 `typescript-eslint`의 recommended 설정에 들어 있었기에 그냥 해당 설정을 사용하기로 했다.

이때 recommended 설정들을 불러올 때 위에서는 `FlatCompat`의 `recommendedConfig` 속성을 사용했다. 하지만 `typescript-eslint`에서 이러한 설정을 제공하기 때문에 `FlatCompat`에서 `recommendedConfig`를 빼고 바로 `tseslint.config` 함수에 넣어주기로 했다. 즉 설정 파일이 이렇게 바뀌었다.

```js
// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins:{
      'unused-imports': unusedImports,
    },
    rules:{
      // ...
    }
  },
  // ...
);
```

## Next.js eslint

내 블로그는 next.js로 되어 있는데 next는 자체적인 eslint 플러그인(eslint-plugin-next)을 제공한다. 앞서 보았던 자동 변환된 설정 파일에서도 `compat.extends("next", "next/core-web-vitals")`로 next와 관련된 설정을 불러왔었다.

하지만 [ESLint Plugin에 관한 Next.js 공식 문서](https://nextjs.org/docs/app/api-reference/config/eslint)대로 다시 설정해 주겠다.

먼저 `compat.extends`대신 `compat.config`를 사용하고, `extends` 속성에 기존에 있던 next와 next/core-web-vitals를 넣어주면 된다. prettier는 이후에 다른 것으로 대체할 것이므로 지워주었다. 이렇게 하면 next의 eslint 플러그인을 사용할 수 있다.

```js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
});

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins:{
      'unused-imports': unusedImports,
    },
    rules:{
      // ...
    }
  },
  // ...
  ...compat.config({
    extends:['next', "next/core-web-vitals"],
    rules:{
      // 추가할 rule이 있으면 이곳에
    }
  }),
);
```

여기서 주의할 점이 있다. `next`의 린터 설정을 위해 사용하는 `eslint-config-next`는 `parser`, `plugins`, `settings` 속성값을 설정해 버린다. 따라서 혹시 있을지도 모를 다른 설정들을 덮어쓰지 않도록 주의해야 한다. 나는 이런 설정들이 뭔가 순서대로 실행될 것 같아서 next의 eslint 관련 설정을 했던 `compat.config()`를 `tseslint.config` 함수의 거의 마지막 인수로 넣어주었다.

## Next.js eslint with TypeScript

Next.js에 TypeScript를 함께 사용하는 프로젝트도 많은데 [이런 프로젝트를 위한 eslint 설정도 이미 next에서 제공하고 있다.](https://nextjs.org/docs/app/api-reference/config/eslint#with-typescript) 위에서 `extends`하고 있는 목록에 `next/typescript`를 추가하면 된다.

```js
export default tseslint.config(
  ...compat.config({
    extends:["next", "next/core-web-vitals", "next/typescript"],
    rules:{
      // 추가할 rule이 있으면 이곳에
    }
  }),
  // ...
);
```

주의할 점이 있다. 이건 typescript-eslint에서 제공하는 추천 설정과 함께 사용하면 안 된다. 왜냐 하면 이 `next/typescript`에서 제공하는 규칙들이 바로 typescript-eslint의 추천 설정 기반이기 때문이다. 공식 문서에서도 이를 언급하고 있으며 `eslint-config-next`의 코드를 보아도 이를 확인할 수 있다.

```js
// next.js/packages/eslint-config-next/typescript.js
// https://github.com/vercel/next.js/blob/canary/packages/eslint-config-next/typescript.js
module.exports = {
  extends: ['plugin:@typescript-eslint/recommended'],
}
```

따라서 이렇게 next에서 제공하는 `next/typescript` 규칙과 typescript-eslint에서 제공하는 추천 설정을 함께 사용하면 typescript-eslint 플러그인을 재정의할 수 없다는 에러가 발생한다.

나는 이미 앞서서 `tseslint.configs.recommended`를 통해 typescript-eslint의 추천 설정을 사용하고 있기 때문에 `next/typescript`를 사용하면 앞서 언급한 플러그인 재정의에 관한 에러가 발생했다. 그래서 나는 이 설정을 사용하지 않기로 했다.

물론 typescript-eslint를 굳이 직접 사용하지 않아도 되는 프로젝트라면 `next/typescript`를 사용하는 것도 좋은 선택이 될 수 있다. 나는 단순한 recommended 규칙뿐 아니라 typescript-eslint에서 제공하는 더 엄격한 규칙 세트를 사용하고 싶었기 때문에 이걸 사용하지 않았다.

# ESLint Stylistic을 이용한 코드 포매팅

## ESLint Stylistic 사용 이유

기존에 나는 prettier 그리고 eslint-config-prettier, eslint-plugin-prettier를 사용하여 eslint와 prettier를 함께 사용하고 있었다.

그런데 내가 사용하던 기존의 eslint 설정 파일은 eslint에서 스타일 관련 규칙들이 deprecated되기 전에 작성한 것이다. 따라서 `semi` 등 스타일과 관련된 설정들이 많이 들어 있었다. 여기에 prettier 설정까지 들어가니까 자동 수정이 꼬일 때가 많았다. 자동으로 마이그레이션한 flat config 설정 파일도 이 설정을 그대로 가져왔기에 같은 문제가 발생했다.

이를 고치기 위해서는 eslint에서 스타일 관련 규칙을 삭제하는 방법도 있다. eslint에서 스타일 관련 규칙들이 deprecate되었으니 그것도 괜찮은 선택이다. 하지만 eslint에 있던 스타일 관련 규칙들을 가져온 ESLint Stylistic이라는 것을 찾아서 이를 사용하기로 했다. prettier 대신 eslint만으로 스타일 관련 규칙들까지 적용하는 것이다.

이렇게 하는 이유는 2가지가 있다. 첫째는 내가 원래부터 eslint 하나만으로 자동 수정을 하는 걸 좋아하기 때문이다. 기존의 eslint 설정 파일에 스타일 관련 규칙들이 많이 들어가 있었던 것도 그래서 그렇다. 둘째 이유는 typescript-eslint에서 제공하는 `tseslint.configs.stylistic`이라는 ts 스타일 규칙들의 집합을 제공하는데 이걸 사용하고 싶어서였다.

그래서 prettier를 한번 더 쓰기보다는 ESLint Stylistic을 사용해서 eslint에 스타일 관련 설정까지 다 맡겨버리기로 했다.

## ESLint Stylistic 사용하기

사용은 매우 간단하다. 먼저 ESLint Stylistic을 설치한다. [ESLint Stylistic은 총 4개의 플러그인으로 구성되어 있는데](https://eslint.style/guide/getting-started#packages) 이걸 통합한 플러그인이 `@stylistic/eslint-plugin`이다. 이 플러그인을 설치한다.

```bash
pnpm i -D @stylistic/eslint-plugin
```

그리고 설정 파일의 플러그인에 추가한다.

```js
// eslint.config.mjs의 config 객체
import stylisticJs from '@stylistic/eslint-plugin';

// ...
{
  plugins: {
    '@stylistic': stylisticJs,
  },
  rules: {
    // ...
  }
}
```

원래 사용하던 prettier 설정 파일은 다음과 같았다.

```json
{
  "singleQuote": true,
  "jsxSingleQuote": false,
  "semi": true,
  "tabWidth": 2,
  "useTabs": false,
  "trailingComma": "all",
  "printWidth": 80,
  "arrowParens": "always"
}
```

이 prettier 설정 파일에 몇 가지를 더 추가하여 다음과 같이 규칙 객체를 만들고 `tseslint.config`에 인수로 전달했다.

```js
// eslint.config.mjs
export default tseslint.config(
  // ...
  {
    plugins: {
      '@stylistic': stylisticJs,
    },
    rules: {
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
    },
  },
)
```

## 설정 팩토리 함수 사용

`stylistic.configs.customize`라고 해서 이런 rule들 중 추천할 만한 규칙들을 제공하고 약간의 커스텀을 가능하게 해주는 팩토리 함수가 있다. [Shared Configurations](https://eslint.style/guide/config-presets) 문서를 참고해서 다음과 같이 사용하였다. 이렇게 하면 `@stylistic/member-delimiter-style` 규칙만 제외하고 위에서 설정한 모든 규칙들이 적용된다. 덤으로 앞서 언급했던 ts 관련 스타일 규칙들의 집합인 `tseslint.configs.stylistic`도 적용했다.

```js
// eslint.config.mjs
export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  stylisticJs.configs.customize({
    arrowParens: true,
    indent: 2,
    semi: true,
    commaDangle: 'always-multiline',
  }),
  // ...
);
```

이렇게 하고 prettier 관련 라이브러리들은 삭제했다.

```bash
pnpm remove prettier eslint-config-prettier eslint-plugin-prettier
```

이제 eslint만으로 코드 포매팅까지 된다.

# Typed Linting

typescript-eslint에서는 typescript 프로젝트에서 타입에 관련한 더 강력한 코드 분석 기능을 제공한다. 이에 대해 알아보자.

## 기본 설정

앞서서 `tseslint.configs.recommended`로 기본적인 추천 규칙들을 설정했었다. 그런데 그 대신 `tseslint.configs.recommendedTypeChecked`등을 사용하면 더 강력한 타입 관련 분석 규칙들을 사용할 수 있다.

이를 적용하기 위해서는 먼저 파서에 TSConfig을 제공하기 위한 `languageOptions` 을 설정해주어야 한다. [Linting with Type Information](https://typescript-eslint.io/getting-started/typed-linting) 문서를 참고하여 다음과 같이 `languageOptions`이 설정된 객체를 `tseslint.config` 함수에 넣어주었다.

```js
export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
```

그리고 `tseslint.configs.recommended` 대신 타입 관련 규칙들을 제공하는 규칙 세트를 사용하면 된다. typescript-eslint에서 제공하는 이런 규칙 세트들은 더 하위의 규칙들을 포함하므로 두 번 설정할 필요는 없다. 나는 가장 엄격한 검사 기능을 제공하는 `tseslint.configs.strictTypeChecked`를 사용하기로 했다. 더 자세한 관련 설정은 [typescript-eslint의 Shared Configs 문서](https://typescript-eslint.io/users/configs)를 참고할 수 있다.

eslint stylistic에 대해서도 타입 관련 규칙들을 제공하는 `tseslint.configs.stylisticTypeChecked`를 사용한다. 그래서 설정 파일은 다음과 같이 바뀌었다.

```js
// eslint.config.mjs
export default tseslint.config(
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
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // ...
);
```

## 트러블슈팅 - tsconfig의 파일 포함 문제 해결

여기까지 하고 `npx eslint [파일경로]`를 하면 eslint가 동작한다. 그런데 몇몇 파일에서 다음과 같은 에러가 발생할 수 있다. 나 같은 경우 `eslint.config.mjs`와 `next.config.js` 등의 파일에서 그랬다.

```bash 
... was not found by the project service. Consider either including it in the tsconfig.json or including it in allowDefaultProject
```

이 오류는 [typescript-eslint 공식 문서의 트러블슈팅 항목](https://typescript-eslint.io/troubleshooting/typed-linting/#i-get-errors-telling-me--was-not-found-by-the-project-service-consider-either-including-it-in-the-tsconfigjson-or-including-it-in-allowdefaultproject)에 잘 나와 있다. 가장 가까운 프로젝트의 `tsconfig.json`에 포함되지 않은 파일을 타입 관련해서 린팅하려고 할 때 발생하는 오류이다.

내 경우로 설명한다면, 내 `tsconfig.json`의 `include` 속성은 다음과 같이 되어 있다.

```json
{
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
  ],
}
```

typed linting에서 사용하는 `@typescript-eslint/parser`는 tsconfig.json 파일을 읽어서 타입 정보를 가져오는데 이때 앞서 언급한 `eslint.config.mjs`와 같은 파일들은 tsconfig.json에 포함되어 있지 않아서 발생하는 문제다. 이를 해결하기 위해서 물론 tsconfig.json에 직접 포함시키는 방법도 있다. 이런 식으로 말이다.

```json
{
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    "eslint.config.mjs",
    "next.config.js",
  ],
}
``` 

하지만 `.js` 류의 파일을 tsconfig에 포함시키는 것도 적절하지 않다고 보이고 `.js` 파일에 타입 관련 린팅을 할 것도 아니다. 그러므로 eslint 설정에서 특정 파일에 대해 type-checked linting을 하지 않도록 설정하는 방법을 사용하기로 했다.

```js
// eslint.config.mjs

export default tseslint.config(
  // ... the rest of your config ...
  {
    files: ['*.js', '*.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
```

또한 설정한 규칙들이 `.ts`, `.tsx` 파일에만 적용되도록 하기 위해서 `files` 속성을 사용했다. 이 속성은 해당 파일들에만 설정을 적용하도록 하는 속성이다. 그리고 `ignores` 속성을 사용하여 `node_modules` 폴더를 무시하고, `src` 폴더에 속한 게 아닌 파일들을 무시하도록 했다. 긴 설정 규칙들을 생략하고 이렇게 완성된 설정을 간략히만 보면 다음과 같다.

```js
// eslint.config.mjs
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
      // 규칙들...
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
```

# 기타

## vscode 저장 시 자동 포매팅

나는 vscode를 사용하고 있기 때문에 vscode 설정에서 자동 저장 시에 eslint가 동작하도록 설정을 바꿔주었다. 프로젝트의 `.vscode/settings.json` 파일에 다음과 같이 추가한다. 스타일 또한 eslint에서 stylistic 플러그인을 통해 포매팅을 하기로 했으므로 defaultFormatter도 eslint로 설정한다.

```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "dbaeumer.vscode-eslint",
  "editor.codeActionsOnSave": {
    "source.fixAll": "always", // 저장 시 모든 문제 해결
    "source.fixAll.eslint": "always" // ESLint를 저장 시 실행
  },
  "editor.formatOnSave": true, // 저장 시 포맷팅 실행
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

# 참고

ESLint Configuration Migration Guide

https://eslint.org/docs/latest/use/configure/migration-guide

ESLint 9 Flat Config + Prettier 설정 (TypeScript, React)

https://romantech.net/1286

typescript-eslint Getting Started

https://typescript-eslint.io/getting-started/

typescript-eslint의 해당 패키지 문서

https://typescript-eslint.io/packages/typescript-eslint/

typescript-eslint shared config

https://typescript-eslint.io/users/configs

nextjs ESLint Plugin(특히 With TypeScript 이후)

https://nextjs.org/docs/app/api-reference/config/eslint

ESLint Stylistic Migration

https://eslint.style/guide/migration

ESLint Stylistic Shared Configurations

https://eslint.style/guide/config-presets

typescript-eslint Linting with Type Information

https://typescript-eslint.io/getting-started/typed-linting

I get errors telling me "... was not found by the project service. Consider either including it in the tsconfig.json or including it in allowDefaultProject"

https://typescript-eslint.io/troubleshooting/typed-linting/#i-get-errors-telling-me--was-not-found-by-the-project-service-consider-either-including-it-in-the-tsconfigjson-or-including-it-in-allowdefaultproject

How do I disable type-checked linting for a file?

https://typescript-eslint.io/troubleshooting/typed-linting/#how-do-i-disable-type-checked-linting-for-a-file

Eslint 9 & Next.js 14 — Setup Guide

https://blog.linotte.dev/eslint-9-next-js-935c2b6d0371