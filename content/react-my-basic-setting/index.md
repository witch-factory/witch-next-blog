---
title: 기본적인 React 프로젝트 세팅
date: "2024-07-10T00:00:00Z"
description: "프로젝트를 하다 보면 비슷한 초기 세팅이 반복되고는 한다. 이 내용을 정리해보았다."
tags: ["web", "front", "react"]
---

연습용, 혹은 소규모 프로젝트를 시작하려 할 때마다 비슷한 세팅들을 반복하게 된다. 대부분 가장 유명한 기술 스택들을 택하고 필요에 따라 몇 가지 라이브러리만 추가되기 때문이다.

그래서 React, Typescript, 코드 포매터, react-router-dom 정도를 기본적으로 사용하는 프로젝트를 시작할 때 필요한 것들을 정리했다. 그대로 따라하기만 하면 되도록 말이다.

# 1. 프로젝트 생성

React 공식 문서에서는 프레임워크를 사용해서 시작할 것을 권장하고 있지만 현재로서는 React만 사용하는 것이 가장 일반적이라고 생각한다.

create-react-app이 좋은 보일러플레이트를 제공하고 있었으나 유지보수가 안된다. 요즘은 React 프로젝트 시작에 Vite가 정배다.

그러니 React + Typescript 템플릿을 제공하는 Vite로 프로젝트를 생성한다. 경험상 패키지 매니저들 중 pnpm이 가장 속도도 빠르고 안정적이었기 때문에 pnpm을 사용한다(yarn berry도 좋지만 아직은 pnpm이 더 안정적인 것 같다).

```bash
pnpm create vite 프로젝트명 --template react-ts
```

# 2. 코드 포매터

ESLint + Prettier, 그리고 떠오르는 라이브러리 Biome가 포매팅을 위해 쓰일 수 있다.

## 2.1. ESLint + Prettier

포매팅을 위한 툴들을 설치한다. Prettier를 ESLint 규칙에 맞게 동작시켜 주는 라이브러리다. `@typescript-eslint/parser`랑 `@typescript-eslint/eslint-plugin`는 기본적으로 설치되어 있었다.

```bash
pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier
```

그럼 이제 eslint 플러그인들을 설치하자. 이전에 프로젝트를 할 때 사용했던 플러그인들을 집대성하고 `eslint-config-airbnb`를 더한 것이다. `eslint-config-airbnb`는 [airbnb의 JS 스타일 가이드](https://github.com/airbnb/javascript)를 자동으로 적용해 준다.

```bash
pnpm add -D eslint-plugin-import eslint-plugin-react eslint-plugin-unused-imports eslint-config-airbnb eslint-plugin-jsx-a11y
```

그리고 다음과 같이 포매팅 규칙을 적은 `.eslintrc.cjs`를 작성한다. 이 룰은 [이창희](https://xo.dev/)님의 블로그에 있는 lint 파일과 내가 개인적으로 개발하면서 썼던 airbnb 룰 몇 가지를 적절히 섞은 것이다.

```js
// .eslintrc.cjs
module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		"airbnb",
		"airbnb/hooks",
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"plugin:react/jsx-runtime",
		"plugin:react-hooks/recommended",
		"plugin:import/recommended",
	],
	ignorePatterns: ["dist", ".eslintrc.cjs", "vite.config.ts"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		project: true,
		tsconfigRootDir: __dirname,
	},
	plugins: ["react-refresh", "unused-imports"],
	rules: {
		"arrow-parens": ["warn", "as-needed"], // 화살표 함수의 파라미터가 하나일때 괄호 생략
		"comma-dangle": ["error", "always-multiline"],
		"consistent-return": "warn",
		"eol-last": ["error", "always"],
		indent: ["error", 2],
		"jsx-a11y/click-events-have-key-events": "off", // onClick 사용하기 위해서 onKeyUp,onKeyDown,onKeyPress 하나 이상 사용
		"jsx-quotes": ["error", "prefer-single"],
		"keyword-spacing": "error",
		"no-alert": ["off"], // alert를 쓰면 에러가 나던 규칙 해제
		"no-console": [
			"warn",
			{
				allow: ["warn", "error"],
			},
		],
		"no-duplicate-imports": "error",
		"no-extra-semi": "error",
		"no-param-reassign": "error",
		"no-shadow": "off",
		"no-trailing-spaces": "error",
		"object-curly-spacing": ["error", "always"],
		"padding-line-between-statements": [
			"error",
			{ blankLine: "always", prev: "*", next: "return" },
			{ blankLine: "always", prev: ["const", "let", "var"], next: "*" },
			{
				blankLine: "any",
				prev: ["const", "let", "var"],
				next: ["const", "let", "var"],
			},
		],
		"prefer-const": "error",
		"prefer-template": "error",
		quotes: [
			"error",
			"single",
			{
				avoidEscape: true,
			},
		],
		semi: "off",
		"space-before-blocks": "error",
		"unused-imports/no-unused-imports": "error",
		"import/extensions": "off",
		"import/no-named-as-default": "off",
		"import/no-unresolved": "off",
		"import/order": [
			"warn",
			{
				alphabetize: {
					order: "asc",
					caseInsensitive: true,
				},
				groups: [
					"builtin",
					"external",
					["parent", "internal"],
					"sibling",
					["unknown", "index", "object"],
				],
				pathGroups: [
					{
						pattern: "~/**",
						group: "internal",
					},
				],
				"newlines-between": "always",
			},
		],
		"import/prefer-default-export": "off",
		"react-hooks/exhaustive-deps": ["warn"], // hooks의 의존성배열이 충분하지 않을때 강제로 의존성을 추가하는 규칙을 완화
		"react/jsx-boolean-value": "off",
		"react/jsx-curly-brace-presence": [
			"error",
			{ props: "never", children: "never" },
		],
		"react/jsx-filename-extension": [
			"warn",
			{
				extensions: [".js", ".ts", ".jsx", ".tsx"], // 확장자로 js와 jsx ts tsx 허용
			},
		],
		"react/jsx-no-bind": "off",
		"react/jsx-no-useless-fragment": "warn",
		"react/jsx-props-no-spreading": "off",
		"react/no-array-index-key": "off",
		"react/no-unescaped-entities": "warn",
		"react/prop-types": "off",
		"react/require-default-props": "off",
		"react/self-closing-comp": "warn", // 셀프 클로징 태그 가능하면 적용
		"react-refresh/only-export-components": [
			"warn",
			{ allowConstantExport: true },
		],
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/no-explicit-any": "warn",
		"@typescript-eslint/no-misused-promises": [
			"error",
			{
				checksVoidReturn: false,
			},
		],
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/no-shadow": ["error"],
		"@typescript-eslint/no-unsafe-assignment": "warn",
		"@typescript-eslint/no-unused-vars": "error",
		"@typescript-eslint/semi": ["error"],
		"@typescript-eslint/type-annotation-spacing": [
			"error",
			{
				before: false,
				after: true,
				overrides: {
					colon: {
						before: false,
						after: true,
					},
					arrow: {
						before: true,
						after: true,
					},
				},
			},
		],
	},
};
```

그런데 이 상태에서는 제대로 자동 수정이 되지 않는다. `tsconfig.json`에 해당 eslint 파일이 포함되어 있지 않기 때문이라고 한다. 이를 수정하기 위해서는 다음과 같이 `tsconfig.app.json`의 `include`항목을 수정해 주어야 한다. 이 파일은 `tsconfig.json`에서 참조해서 컴파일 시에 사용한다.

```json
{
  /* compilerOptions 생략 */
  "include": ["src", "vite.config.ts", ".eslintrc.cjs"],
}
```

그런데 이렇게 해도 eslint.json을 제대로 인식하지 못할 수 있다. 이는 Vite에서 `tsconfig.app.json`을 사용하게 되었기 때문이다. eslint의 `parserOptions`를 변경해서 해결할 수 있다.

```js
// .eslintrc.cjs
module.exports = {
  // 생략
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    // 이렇게 tsconfig의 경로를 명시해주면 된다.
    project: "./tsconfig.app.json",
    tsconfigRootDir: __dirname,
  },
  // 생략
}
```

그리고 prettier 설정 파일은 다음과 같이 만들어준다. 프로젝트 루트에 `.prettierrc.json`을 만들어 다음과 같이 작성한다.

```js
{
  "singleQuote": true,
  "semi": true,
  "useTabs": false,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 120,
  "arrowParens": "avoid"
}
```

# 3. 다른 코드 포매터 - Biome

## 3.1. 사용계기

다른 옵션으로 [Biome](https://biomejs.dev/)라는 새로나온 lint 라이브러리도 사용할 수 있다.

2024년 7월 9일, 새로운 프로젝트를 세팅하고 있었다. 위에 적은 대로 하다가 [eslint-plugin-unused-imports](https://github.com/sweepline/eslint-plugin-unused-imports)를 pnpm으로 설치하는데 다음과 같은 경고가 떴다.

```js
Issues with peer dependencies found
.
└─┬ eslint-plugin-unused-imports 4.0.0
  ├── ✕ unmet peer @typescript-eslint/eslint-plugin@8: found 7.16.0
  └── ✕ unmet peer eslint@9: found 8.57.0
```

그래서 [해당 레포지토리 이슈](https://github.com/sweepline/eslint-plugin-unused-imports/issues/82)에 들어가 보니 플러그인 제작자가 Biome라는 라이브러리를 회사에서 쓰게 되었다며 해당 라이브러리를 사용하라고 권장하고 있었다. 더 이상 플러그인이 활발하게 유지보수되지 않을 것 같다는 말과 함께.

그래서 Biome를 사용해 보기로 했다. Biome는 eslint와 prettier를 한 번에 설정해주는 라이브러리다. 대략적인 역사는 [Biome: 차세대 JS Linter와 Formatter](https://teamdable.github.io/techblog/biome-js-linter-and-formatter)에서 볼 수 있다.

그럼 공식 문서를 따라서 설치하자.

## 3.2. 설치와 적용

```bash
pnpm add --save-dev --save-exact @biomejs/biome
```

다음 명령으로 설정 파일을 생성하고 초기화한다.

```bash
pnpm biome init
```

그리고 [vscode Biome 플러그인](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)을 설치하자. 이 플러그인은 Biome 설정 파일을 읽어서 자동으로 코드를 수정해준다.

설정에서 default formatter를 Biome으로 설정하면 된다. 그런데 아직 Biome가 널리 퍼진 툴은 아니므로 다른 프로젝트에서는 여전히 ESLint + Prettier를 사용하고 있을 것이다. 따라서 vscode의 default formatter를 아예 Biome로 바꾸는 건 부담일 수 있다.

따라서 프로젝트 내부에 `.vscode` 폴더를 만들고 그 안에 `settings.json`을 만들어 다음과 같이 설정한다.

```json
{
  "editor.defaultFormatter": "biomejs.biome"
}
```

[앞선 eslint, prettier 설정 파일은 커맨드 명령으로 쉽게 Biome로 마이그레이션할 수 있다.](https://biomejs.dev/guides/migrate-eslint-prettier/) 다음 명령을 실행하면 알아서 `biome.json` 파일에 eslint, prettier 설정이 마이그레이션되어서 들어간다.

```bash
pnpm biome migrate eslint --write
pnpm biome migrate prettier --write
```

이렇게 하면 위에서 했던 `vite-tsconfig-paths`와 같은 설정들, 여러 eslint 플러그인들, `.eslintrc`, `.prettierrc` 파일 등이 모두 필요없어진다. 전부 삭제하면 깔끔해진 `package.json`이 될 것이다.

Biome를 사용하는 후기는 이후에 다른 글로 작성할 예정이다.

# 4. 이외의 설정

## 4.1. import alias

먼저 `vite.config.ts`에서 tsconfig 파일의 path alias를 인식하도록 하기 위해 `vite-tsconfig-paths`를 설치한다.

```bash
pnpm add -D vite-tsconfig-paths
```

그리고 `vite.config.ts`를 다음과 같이 수정한다.

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
});
```

import alias를 통해 `@/`로 시작하는 경로로 import해올 수 있도록 하자. `tsconfig.app.json`의 `compilerOptions`에 다음과 같이 `paths`를 추가한다.

```json
{
  "compilerOptions": {
    /* 생략 */
    "paths": {
      "@/*": ["./src/*"]
    }
  }
  /* 생략 */
}
```

## 4.2. react-router-dom

기본적인 라우팅을 위해서 `react-router-dom`을 설치하자.

```bash
pnpm add react-router-dom
```

그리고 `src/main.tsx`에 다음과 같이 기본적인 라우터를 설정한다.

```tsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/about",
    element: <div>about</div>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

이제 개발 환경을 실행하고 `/about`라우터에 들어가면 작게 about이라는 글씨가 뜨는 페이지가 나오는 것을 볼 수 있다. 라우팅이 잘 설정된 것이다.

## 4.3. vanilla extract

tailwind나 styled-components 같이 다른 CSS-in-JS 라이브러리를 사용할 때도 많다. 하지만 기본적인 방식은 모두 똑같으므로 `@vanilla-extract/css`를 설치할 수 있다.

```bash
pnpm add @vanilla-extract/css
```

vanilla extract 공식 문서의 [Integration - Vite](https://vanilla-extract.style/documentation/integrations/vite/)를 보고 따라하자. 먼저 플러그인을 설치한다.
  
```bash
pnpm add -D @vanilla-extract/vite-plugin
```

그리고 `vite.config.ts`에 다음과 같이 플러그인을 추가한다.

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), vanillaExtractPlugin()],
});
```

# 참고

eslint airbnb 사용하기 https://hayjo.tistory.com/111

shadcn ui 공식 문서 https://ui.shadcn.com/

Biome 공식 문서 https://biomejs.dev/