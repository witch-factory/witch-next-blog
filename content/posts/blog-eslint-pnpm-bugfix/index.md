---
title: pnpm을 사용하는 Next.js 프로젝트에서 eslint-config-next가 죽는 이유와 해결법
date: "2025-04-15T01:00:00Z"
description: "Next.js 프로젝트에서 eslint-config-next가 Failed to load plugin 오류를 내뱉는다면"
tags: ["blog", "front", "study", "eslint"]
---

# 시작

Next.js, pnpm, eslint는 하나하나가 주류라고 할 만한 기술들이다. 당연히 이 세 가지를 조합해서 사용하는 경우도 많다. `create-next-app`에서 지원하는 `--use-pnpm` 플래그를 사용해서 프로젝트를 생성하기만 해도 위 조합이 사용된다.

```bash
npx create-next-app@latest --use-pnpm
```

이 블로그도 처음에 이렇게 생성한 프로젝트다.

하지만 pnpm v10 이상의 버전을 사용하고 있다면 이렇게 프로젝트를 시작한 후 vscode로 실행했을 때 eslint가 제대로 작동하지 않는다. 이리저리 확인해 보다가 `output` 패널을 열어 보면 다음과 같은 에러가 우리를 반긴다.

![eslint 에러 발생](./eslint-error.png)

vscode의 eslint 관련 설정에 문제가 있다거나 하는 등, 다른 문제일 수도 있다. 하지만 그런 경우를 제외하더라도 위와 같은 에러가 발생한다. 나도 블로그에서 eslint가 갑자기 동작하지 않는 걸 알고 이러한 에러를 최근에 마주했기 때문에 이를 해결하고 글로 남긴다.

이 글은 eslint에 대한 자세한 설정을 다루는 글은 아니다. eslint 설정을 완료했는데도 `eslint-config-next`에 관한, 위 스크린샷처럼 발생하는 에러를 해결하기 위한 글이다. eslint를 설정하는 과정에 대해서는 내가 eslint 설정을 하며 쓴 [블로그에 ESLint 9 적용, 그 삽질과 설정의 기록](https://witch.work/ko/posts/blog-eslint-configuration)을 참고할 수 있다.

## 사용한 환경

나와 비슷한 문제를 마주한 사람들에게 도움이 될까 싶어 내가 글을 쓰며 사용한 환경을 밝힌다.

이 글에서 사용하는 프로젝트 코드는 위에서 언급한 `npx create-next-app@latest --use-pnpm`로 생성한 프로젝트를 기준으로 한다. 라이브러리들의 버전은 다음과 같다.

- MacOS 14.0.0
- Node.js 22.11.0
- npm 10.9.0
- pnpm 10.8.0
- Next.js 15.3.0
- eslint 9.24.0
- @eslint/eslintrc 3.3.1
- eslint-config-next: 15.3.0
- react: 19.1.0
- react-dom: 19.1.0
- typescript: 5.8.3

# 땜질식 해결

## 오류를 내는 라이브러리 설치

에러 메시지를 잘 읽어 보자.

```
Error: Failed to load plugin 'react-hooks' declared in ' » eslint-config-next/core-web-vitals » /Desktop/projects/eslint-next-test/node_modules/.pnpm/eslint-config-next@15.3.0_eslint@9.24.0_typescript@5.8.3/node_modules/eslint-config-next/index.js': Cannot find module 'eslint-plugin-react-hooks'
```

이 에러는 `eslint-config-next`에서 사용하는 `eslint-plugin-react-hooks`를 찾지 못해서 발생하는 에러라고 한다. 그러니 이를 설치해주자.

```bash
pnpm add -D eslint-plugin-react-hooks
```

설치 후 다시 vscode를 실행해보자. 이번에는 이런 에러가 발생한다.

```
Error: Failed to load plugin '@next/next' declared in ' » eslint-config-next/core-web-vitals » /Desktop/projects/eslint-next-test/node_modules/.pnpm/eslint-config-next@15.3.0_eslint@9.24.0_typescript@5.8.3/node_modules/eslint-config-next/index.js': Cannot find module '@next/eslint-plugin-next'
```

비슷하다. `@next/eslint-plugin-next` 플러그인을 찾지 못했다고 한다. 고로 설치해 주자.

```bash
pnpm add -D @next/eslint-plugin-next
```

다시 vscode를 실행해보자. 이제 잘 실행되는 걸 확인할 수 있다.

```
ESLint library loaded from: /Desktop/projects/eslint-next-test/node_modules/.pnpm/eslint@9.24.0/node_modules/eslint/lib/api.js
```

## 의문

하지만 이렇게 라이브러리를 전부 설치하는 게 맞는 걸까 의문이 든다. 왜냐 하면 이 라이브러리들은 `eslint-config-next`의 의존성이기 때문에 알아서 설치되어야 하기 때문이다.

Next.js의 [ESLint Plugin 공식 문서](https://nextjs.org/docs/app/api-reference/config/eslint)에서도 이 패키지들이 포함되어 있다고 되어 있다. [`eslint-config-next` 패키지의 `package.json`을](https://github.com/vercel/next.js/blob/canary/packages/eslint-config-next/package.json) 확인해봐도 오류를 발생시킨 패키지들이 `dependencies`에 명시되어 있다.

마찬가지로 우리 프로젝트의 `pnpm-lock.yaml` 파일에서도 이를 확인할 수 있다. `node_modules/.pnpm`디렉토리에도 이 패키지들이 설치되어 있다!

```yaml
eslint-config-next@15.3.0(eslint@9.24.0)(typescript@5.8.3):
    dependencies:
      '@next/eslint-plugin-next': 15.3.0
      '@rushstack/eslint-patch': 1.11.0
      '@typescript-eslint/eslint-plugin': 8.29.1(@typescript-eslint/parser@8.29.1(eslint@9.24.0)(typescript@5.8.3))(eslint@9.24.0)(typescript@5.8.3)
      '@typescript-eslint/parser': 8.29.1(eslint@9.24.0)(typescript@5.8.3)
      eslint: 9.24.0
      eslint-import-resolver-node: 0.3.9
      eslint-import-resolver-typescript: 3.10.0(eslint-plugin-import@2.31.0)(eslint@9.24.0)
      eslint-plugin-import: 2.31.0(@typescript-eslint/parser@8.29.1(eslint@9.24.0)(typescript@5.8.3))(eslint-import-resolver-typescript@3.10.0)(eslint@9.24.0)
      eslint-plugin-jsx-a11y: 6.10.2(eslint@9.24.0)
      eslint-plugin-react: 7.37.5(eslint@9.24.0)
      eslint-plugin-react-hooks: 5.2.0(eslint@9.24.0)
    optionalDependencies:
      typescript: 5.8.3
    transitivePeerDependencies:
      - eslint-import-resolver-webpack
      - eslint-plugin-import-x
      - supports-color
```

무엇보다, npm이나 yarn으로 Next.js 프로젝트를 생성했을 경우 이런 문제가 발생하지 않는다. 그럼 왜 하필 pnpm을 사용할 때만 이런 문제가 발생하는 걸까? 원인이 무엇이고 어떻게 이런 문제를 깔끔하게 해결할 수 있을까?

# 근본적인 해결

이 문제가 근본적으로 왜 일어나며 어떻게 해야 좀더 근본적으로 해결할 수 있을지를 알아보자.

## 원인

[pnpm의 한 이슈](https://github.com/pnpm/pnpm/issues/8878)에서 답을 찾을 수 있었다.

매우 요약해 설명해보면 이렇다. 원래 eslint의 플러그인은 eslint 설정 파일에 따라 eslint가 로딩했다. 이를 pnpm에서 하기 위해 필요한 설정이 있었는데 이게 pnpm v10부터 기본 설정에서 없어졌다. 그래서 eslint가 플러그인들을 찾지 못하게 되었고 이런 버그가 발생했다.

여전히 어렵기 때문에 이 섹션에서는 이를 조금 더 풀어서 설명한다.

eslint의 플러그인들은 원래 직접 로딩되지 않았다. 대신 eslint 설정 파일에 플러그인을 문자열로 명시하면 eslint가 해당 플러그인들을 로드해 주는 방식이었다. eslint에서 flat config를 사용하기 전 형식의 설정 파일을 보면 이런 식이었다. 이건 `.eslintrc.json` 파일을 사용할 경우의 예시다.

```json 
// 출처: eslint의 Configuration Files (Deprecated), Using a configuration from a plugin 섹션
// https://eslint.org/docs/latest/use/configure/configuration-files-deprecated
{
	"plugins": ["react"],
	"extends": ["eslint:recommended", "plugin:react/recommended"],
	"rules": {
		"react/no-set-state": "off"
	}
}
```

`plugins` 배열에 명시된 문자열은 해당 문자열 앞에 `eslint-plugin-`가 붙은 패키지를 로드하는 설정을 의미한다. 예를 들어 `react`라고 명시하면 eslint는 `eslint-plugin-react`라는 패키지를 로드한다. 이때 eslint는 `node_modules` 디렉토리에서 해당 패키지를 찾는다. 또한 `extends` 배열과 `rules`에 명시된 대로 플러그인에 있는 규칙들을 찾아 로드한다.

그런데 이걸 위해서는 eslint가 플러그인들을 찾을 수 있어야 한다. 어디서? `node_modules` 디렉토리에서. 그 말은 eslint가 제대로 동작하려면 설정 파일에 쓰인 플러그인 패키지들이 `node_modules`의 최상위에 공개적으로 존재해야 한다는 뜻이다.

하지만 pnpm은 성능을 위해 패키지들을 `node_modules`의 최상위에 설치하지 않는다. 대신 `node_modules/.pnpm` 디렉토리에 저장한 뒤 각 패키지에 필요한 것만 symlink로 연결한다.[^1] 이런 구조에서는 플러그인 패키지들이 `node_modules`의 최상위에 존재하지 않을 수 있다.

eslint는 아주 많이 쓰이는 라이브러리였기에 pnpm 진영에서도 이를 알고 있었다. 따라서 pnpm v9까지는 eslint와 prettier(보통 eslint와 함께 쓰이는 라이브러리) 관련 패키지들은 `node_modules`의 최상위에 존재하도록 하는 설정이 기본값이었다. `node_modules` 루트에 설치될 패키지를 설정하는 `public-hoist-pattern` 설정값을 이용했다.

대략 이렇게 `.npmrc`파일을 만든 것이다. (물론 `pnpm-workspace.yaml` 형식으로도 같은 설정이 가능하다. 거기에 대해서는 [`publicHoistPattern` 문서](https://pnpm.io/settings#publichoistpattern) 참고)

```json
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*
```

그러나 eslint 9에서 flat config가 도입되었다. eslint 플러그인들은 이제 설정 파일들을 통해서가 아니라 직접 로딩된다. 예를 들어 내 블로그의 eslint flat config 설정 파일에서 플러그인을 불러오는 부분을 보자. 각 플러그인들이 어디에 위치하는지 명시적으로 적어주고 import하고 있다.

```js
import eslint from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      '@stylistic': stylisticJs,
      'unused-imports': unusedImports,
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      // ...
    },
  },
})
```

따라서 flat config를 사용하면 eslint가 플러그인들을 찾기 위해 `node_modules`의 최상위에 존재할 필요가 없다. [그래서 pnpm v10에서는 `public-hoist-pattern`의 기본값에 들어 있던 `*eslint*`, `*prettier*`를 없앴다.](https://github.com/pnpm/pnpm/issues/8378) 즉 이제 pnpm의 기본 설정에서는 eslint 관련 패키지들이 `node_modules`의 최상위에 존재하지 않게 되었다.

그러나 [Next.js의 eslint 설정 패키지인 `eslint-config-next`에서는 여전히(2025/04/15 기준) flat config를 사용하지 않고 기존의 eslint 설정 형식을 사용하고 있다.](https://github.com/vercel/next.js/blob/canary/packages/eslint-config-next/index.js) 따라서 `eslint-config-next`를 사용하는 프로젝트에서는 eslint가 `node_modules`의 최상위에서 플러그인들을 찾게 된다!

이로 인해 `eslint-config-next`를 pnpm v10 이후 버전의 환경에서 사용하면 문제가 생긴다. `eslint-config-next`의 내부적으로 사용하는 eslint 설정 파일에서는 flat config 이전의 방식으로 플러그인들을 로드하는데 이를 위해서는 pnpm v10부터 없어진 설정이 필요하기 때문이다.

그리고 npm이나 yarn에서 이런 문제가 발생하지 않았던 이유는 npm과 yarn은 기본적으로 `node_modules`의 최상위에 패키지들을 설치하기 때문이다. 따라서 eslint가 늘 플러그인들을 찾을 수 있다.

## 추가 설명

혹시 조금 더 자세한 설명이 필요할까 싶어 추가 설명을 한다. pnpm으로 Next.js 프로젝트를 시작하면 생기는 eslint 설정 파일은 다음과 같다.

```js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // js로 설정해서 프로젝트를 생성했을 경우 "next/typescript"는 없다
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
```

애초에 여기서 사용하는 `FlatCompat` 자체가 flat config 이전의 설정 형식인 eslintrc 형식 설정을 flat config에서 호환하기 위한 라이브러리 함수이다. 

그럼 여기서 로드하고 있는 `next/core-web-vitals`는 어떻게 되어 있는지 보자. `eslint-config-next` 패키지의 `core-web-vitals.js`에서 찾을 수 있다.

```js
// next.js/packages/eslint-config-next/core-web-vitals.js
module.exports = {
  extends: [require.resolve('.'), 'plugin:@next/next/core-web-vitals'],
}
```

여기서 이미 eslintrc 방식으로 설정을 불러오고 있으므로 pnpm v10에서는 여기부터 에러가 발생할 것이다. 또한 여기서 `require.resolve('.')`로 불러오고 있는 `eslint-config-next` 패키지의 `index.js`에서도 기존 eslint 설정 방식을 쓴다.

```js
// next.js/packages/eslint-config-next/index.js
// 기본값 설정을 위한 복잡한 코드들은 생략
module.exports = {
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@next/next/recommended',
  ],
  plugins: ['import', 'react', 'jsx-a11y'],
  rules: {
    'import/no-anonymous-default-export': 'warn',
    // ...
  },
  // ...
}
```

따라서 `eslint-config-next` 패키지에서 사용하는 설정 파일들은 flat config를 사용하지 않고 기존의 eslintrc 형식으로 되어 있다. 이로 인해 pnpm v10부터 기본적으로 `public-hoist-pattern` 설정이 없어진 상태에서는 eslint가 플러그인들을 찾지 못하게 된다.

## 해결

문제의 원인을 정확하게 파악하기 위해 길게 설명했지만 해결 방법은 간단하다. 문제는 `public-hoist-pattern` 설정이 없어진 것에서 시작했으므로 이를 다시 추가해 주면 된다. 프로젝트 루트에 `.npmrc` 파일을 만들고 다음과 같이 추가해 주자.

```json
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*
```

`node_modules`와 `pnpm-lock.yaml` 파일을 삭제한 뒤 다시 패키지를 설치해 주자.

```bash
rm -rf node_modules
rm -rf pnpm-lock.yaml
pnpm install
```

그럼 이제 `node_modules`의 최상위에 eslint 관련 패키지들이 존재하게 된다. 따라서 eslint가 플러그인들을 찾을 수 있게 되어 에러가 발생하지 않는다.

사실 이런 문제는 `eslint-config-next` 패키지에서 flat config를 사용한다면 발생하지 않을 것이다. flat config는 플러그인들이 eslint를 통해서가 아니라 직접 로드되기 때문이다.

하지만 이건 `eslint-config-next` 에서 의존성으로 사용하는 플러그인들 중 아직 flat config를 지원하지 않는 것들이 많아 당분간은 힘들 수도 있어 보인다. 따라서 위와 같은 설정을 일단은 사용하도록 하자.

# 결론

eslint 플러그인은 원래 eslint의 설정 파일에 문자열 형태로 명시된 플러그인들을 eslint가 로딩하는 방식으로 동작했다. 이를 위해서는 eslint가 플러그인들을 찾을 수 있어야 한다. pnpm은 이를 위해서 eslint 관련 플러그인 패키지들이 호이스팅되는 게(node_modules의 최상위에 위치하도록) 기본 설정으로 만들었다.

하지만 eslint flat config가 도입되면서 pnpm은 v10부터 이런 기본 호이스팅 설정을 없앴다. 그런데 `eslint-config-next`는 여전히 eslint flat config를 사용하지 않고 기존의 eslint 설정 파일을 사용하고 있다. 그래서 eslint가 플러그인들을 찾지 못하게 된 것이다.

그러니 이를 해결하려면 eslint 관련 패키지들이 `node_modules`의 최상위에 위치하도록 `public-hoist-pattern` 설정을 해주면 된다.


# 참고

Next.js 문서 create-next-app

https://nextjs.org/docs/app/api-reference/cli/create-next-app

Next.js 문서 ESLint Plugin

https://nextjs.org/docs/app/api-reference/config/eslint

Next.js eslint-config-next 패키지 코드

https://github.com/vercel/next.js/tree/canary/packages/eslint-config-next

Next.js issue #64114, New ESLint "flat" configuration file does not work with next/core-web-vitals

https://github.com/vercel/next.js/issues/64114

Next.js issue #73968, Failed to load plugin 'react-hooks' declared in ' » eslint-config-next/core-web-vitals » Cannot find module 'eslint-plugin-react-hooks'

https://github.com/vercel/next.js/issues/73968

pnpm 문서, Settings (pnpm-workspace.yaml)

https://pnpm.io/settings#publichoistpattern

pnpm issue #8378, Remove the default option `*eslint*` and `*prettier*` from public-hoist-pattern option in next major version

https://github.com/pnpm/pnpm/issues/8378

pnpm issue #8878, Using public-hoist-pattern breaks ESLint extension?!

https://github.com/pnpm/pnpm/issues/8878

eslint의 Configuration Files (Deprecated) 문서

https://eslint.org/docs/latest/use/configure/configuration-files-deprecated

Introducing ESLint Compatibility Utilities

https://eslint.org/blog/2024/05/eslint-compatibility-utilities/

@eslint/eslintrc의 README

https://github.com/eslint/eslintrc

npm, yarn, pnpm 비교해보기

https://yceffort.kr/2022/05/npm-vs-yarn-vs-pnpm

Performant NPM - PNPM

https://kdydesign.github.io/2023/09/25/pnpm-tutorial/

ESLint는 어떻게 코드를 분석할까요?

https://1lsang.vercel.app/posts/eslint-01

[^1]: https://yceffort.kr/2022/05/npm-vs-yarn-vs-pnpm#pnpm-%EB%B9%A0%EB%A5%B4%EA%B3%A0-%ED%9A%A8%EC%9C%A8%EC%A0%81%EC%9D%B8-%EB%94%94%EC%8A%A4%ED%81%AC-%EA%B4%80%EB%A6%AC