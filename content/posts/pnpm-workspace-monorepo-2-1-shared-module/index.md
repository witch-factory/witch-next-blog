---
title: 장난감 모노레포 삽질기 - 2-1. 공유 폴더의 모듈 제대로 세팅하기
date: "2024-12-09T00:00:00Z"
description: "pnpm workspace의 공유 폴더가 CJS/ESM을 완벽히 지원하도록 해보자."
tags: ["web", "study", "javascript", "monorepo"]
---

# 시작

[이전 글](https://witch.work/posts/pnpm-workspace-monorepo-2-basic-todolist)에서는 모노레포를 이용해서 todolist를 기본적으로 세팅해 보고 공유 폴더를 만들었다. 이번 글에서는 공유 폴더의 모듈을 제대로 세팅해보자.


# 공유 폴더 cjs/esm 지원 세팅 시도

[이전 글](https://witch.work/posts/pnpm-workspace-monorepo-1-setting#%EA%B3%B5%EC%9C%A0-%ED%8F%B4%EB%8D%94-%EB%A7%8C%EB%93%A4%EA%B8%B0)에서는 공유 폴더인 `libs/shared`를 세팅하고 코드를 모노레포 프로젝트 전반에 걸쳐 공유 사용할 수 있도록 했다. 그리고 이 글에서는 타입을 공유 폴더에 생성하고 사용도 해보았다.

이제는 공유 폴더의 코드를 CJS/ESM 두 방식 모두로 불러올 수 있도록 설정해보자. 두 모듈 방식의 차이와 둘 모두 지원하는 것의 이점에 대해서는 이후에 다른 글로 다루겠지만, 그전에 [토스 블로그의 CommonJS와 ESM에 모두 대응하는 라이브러리 개발하기: exports field](https://toss.tech/article/commonjs-esm-exports-field) 등의 좋은 글을 참고할 수 있다.

## 구상

공유 폴더의 코드를 CJS/ESM 두 방식 모두로 불러올 수 있도록 하기 위해서는 package.json 파일의 `exports` 필드를 사용한다. 이를 이용하면 ESM과 CJS 중 어떤 방식으로 패키지를 가져다 사용했는지에 따라 다른 파일을 불러오도록 함으로써 두 방식을 모두 지원하게 할 수 있다.

그러기 위해서는 ESM을 위한 파일과 CJS를 위한 파일을 따로 생성해 줘야 한다. rollup, tsup 등의 설정 파일을 사용하면(토스의 es-toolkit 등의 코드에서 볼 수 있다) 더 복잡한 처리도 가능하고 중복도 줄일 수 있지만 여기서는 번들러를 사용하지 않고 ESM/CJS 모듈을 따로 생성하는 방식으로 설정해보겠다.

가장 가까운 package.json의 설정에 따라 다른 모듈 로더가 사용될 것이므로, 서로 다른 모듈 로더가 설정된 2개의 빌드 결과물을 만들고 둘이 다른 모듈 설정의 package.json을 사용하도록 하면 된다.

## 폴더 세팅

먼저 CJS 모듈을 위한 파일과 ESM 모듈을 위한 파일을 따로 만들기 위해 다음과 같이 폴더를 만들자.

```shell
# libs/shared 폴더에서 실행
mkdir cjs
mkdir esm
```

그리고 `libs/shared`의 `tsconfig.json`을 다음과 같이 수정한다. `.d.ts` 파일이 생성될 위치를 정하는 `declarationDir` 옵션은 각 모듈 폴더에서 지정하도록 하기 위해 `declarationDir` 옵션을 제거하였다.

```json
// libs/shared/tsconfig.json
{
	"extends": "../../tsconfig.json",
	"compilerOptions": {
		"outDir": "./dist",
		"rootDir": "./src",
		"declaration": true, // .d.ts 파일 생성
		"declarationMap": true, // 소스맵 생성 (선택사항)
		"declarationDir": "./dist" // .d.ts 파일이 생성될 위치
	},
	"include": ["src"],
	"exclude": ["node_modules", "dist"]
}
```

그리고 cjs 폴더에 `tsconfig.json`과 `package.json` 파일을 다음과 같이 작성한다.

```json
// libs/shared/cjs/tsconfig.json
{
	"extends": "../tsconfig.json",
	"compilerOptions": {
		"module": "CommonJS",
		"moduleResolution": "node",
		"outDir": "./",
		"declarationDir": "./types" // .d.ts 파일이 생성될 위치
	}
}

// libs/shared/cjs/package.json
{
	"type": "commonjs"
}
```

비슷하게 esm 폴더에도 `tsconfig.json`과 `package.json` 파일을 다음과 같이 작성한다. `module` 옵션만 제외하고는 cjs 폴더와 동일하다.

```json
{
	"extends": "../tsconfig.json",
	"compilerOptions": {
		"module": "ES2020",
		"moduleResolution": "node",
		"outDir": "./",
		"declarationDir": "./types" // .d.ts 파일이 생성될 위치
	}
}

// libs/shared/esm/package.json
{
  "type": "module"
}
```

그리고 다음과 같이 `libs/shared`의 `package.json` 파일을 수정한다. `exports` 필드를 이용하여 ESM 모듈과 CJS 모듈을 각각 지정한다. 이때 `exports` 필드는 `package.json` 파일의 최상단에 위치해야 한다.

```json
{
	"name": "@toy-monorepo/shared",
	"version": "1.0.0",
	"description": "",
	"main": "./cjs/index.js",
	"module": "./esm/index.js",
	"types": "./cjs/index.d.ts",
	"exports": {
		".": {
			"require": {
				"types": "./cjs/index.d.ts",
				"default": "./cjs/index.js"
			},
			"import": {
				"types": "./esm/index.d.ts",
				"default": "./esm/index.js"
			}
		}
	},
	"scripts": {
		"build:cjs": "tsc --p ./cjs/tsconfig.json",
		"build:esm": "tsc --p ./esm/tsconfig.json",
		"build": "pnpm run build:esm && pnpm run build:cjs",
		"dev": "tsc -w"
	}
}
```

이제 다음과 같이 빌드를 실행하면 cjs와 esm 폴더에 각각 빌드 결과물이 생성된다.

```shell
# libs/shared 폴더에서 실행
pnpm run build
```

이렇게 하면 cjs와 esm 모듈을 모두 지원하는 공유 폴더가 생성된다.

## 트러블슈팅 - ESM 모듈과 확장자

간단한 프로젝트 코드를 생성하여 이를 실험해볼 수 있다. 다음과 같이 `apps/test` 폴더를 만들고 이 안에 `index.js 파일을 만들어서 공유 폴더의 코드를 불러와 보자.

```shell
# 프로젝트 루트에서 실행
mkdir apps/test
cd apps/test
pnpm init
```

생성된 package.json의 의존성에 공유 폴더를 추가하고 `index.js`를 실행하는 명령어를 추가한다.

```json
{
  // ...
	"scripts": {
		"start": "node index.js"
	},
	"dependencies": {
		"@toy-monorepo/shared": "workspace:*"
	}
}
```

프로젝트 루트에서 `pnpm i`를 실행하여 공유 폴더를 설치한다. 그리고 모듈을 정상적으로 불러오는지, 어떤 모듈에서 불러오는지를 알기 위해 공유 폴더의 빌드 결과물에 코드를 조금 추가해보자.

```js
// 다음 코드를 각 경로의 파일에 추가한다.
// libs/shared/cjs/index.js
exports.hello = "CJS Hello World!";

// libs/shared/esm/index.js
export const hello = "ESM Hello World!";
```

그리고 `apps/test/index.js` 파일에 다음과 같이 코드를 작성한다. `apps/test/package.json` 파일에 따로 모듈 형식(`"type":"module"`과 같이 지정)을 지정하지 않았기 때문에 CJS 모듈 로더가 사용될 것이다. 그러니 CJS 모듈을 불러오는 코드를 작성한다.

```js
const { hello } = require("@toy-monorepo/shared");

console.log(hello);
```

이제 `apps/test` 폴더에서 `pnpm start`를 실행하면 `CJS Hello World!`가 출력된다. 이제 ESM 모듈 로더를 사용해서 공유 폴더 코드를 불러와보자. `apps/test/package.json` 파일에 `"type":"module"`을 추가하여 ESM 모듈 로더를 사용하도록 한다.

```json
// apps/test/package.json
{
  "type": "module",
  // ...
}
```

그리고 `apps/test/index.js` 파일을 다음과 같이 수정한다.

```js
import { hello } from "@toy-monorepo/shared";

console.log(hello);
```

이렇게 하고 `apps/test`에서 `pnpm start`를 실행하면 다음과 같은 에러가 발생한다.

```shell
$ pnpm start
> test@1.0.0 start 모노레포파일경로/toy-monorepo/apps/test
> node index.js

node:internal/modules/esm/resolve:257
    throw new ERR_MODULE_NOT_FOUND(
          ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '모노레포파일경로/toy-monorepo/libs/shared/esm/schema' imported from 모노레포파일경로/toy-monorepo/libs/shared/esm/index.js
    at finalizeResolution (node:internal/modules/esm/resolve:257:11)
    at moduleResolve (node:internal/modules/esm/resolve:913:10)
    at defaultResolve (node:internal/modules/esm/resolve:1037:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:650:12)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:599:25)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:582:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:241:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:132:49) {
  code: 'ERR_MODULE_NOT_FOUND',
  url: '모노레포파일경로/toy-monorepo/libs/shared/esm/schema'
}
```

하지만 `index.js`의 hello import 경로를 추적해 보면 import하고 있는 경로에 대한 참조는 잘 되고 있다. 뭐가 문제일까?

CJS와 ESM 모듈의 차이 때문이다. CJS 모듈 로더는 확장자를 생략하고 모듈을 불러올 수 있지만 ESM 모듈 로더는 확장자를 생략할 수 없다. 그런데 ESM 모듈 로더가 불러오고 있을 파일, 그러니까 공유 폴더의 빌드 결과물 중 `esm/index.js` 파일을 보자.

```js 
export * from "./schema";
export function add(a, b) {
	return a + b;
}
export function subtract(a, b) {
	return a - b;
}
// 로딩되는 모듈을 확인하기 위해 임시로 추가한 코드
export const hello = "ESM Hello World!";
```

문제는 이 부분이다. 이 부분을 공유 폴더의 `esm/index.js` 파일에서 지우면 정상적으로 동작한다.

```js
export * from "./schema";
```

그럼 이 문제는 왜 발생했을까?

이건 앞서서 공유 폴더의 `schema.ts`에 자동 생성한 타입을 프로젝트 전반에 걸쳐 공유할 수 있도록 하기 위해 `index.ts`에 포함시키려고 넣은 코드이다. 문제는 ESM 모듈 로더는 확장자를 생략할 수 없다는 것이다. 그런데 타입스크립트 트랜스파일러는 ts -> js 트랜스파일링을 할 때 확장자를 달아줄 수 없다.

이를 해결하는 rollup 등의 옵션도 있겠지만, 일단 문제를 찾았고 또 ESM 모듈 로더를 완벽하게 지원하는 게 중요한 문제가 아니기 때문에 조금 우회적인 방법으로 해결하겠다. 이에 대해서는 이후 좀 더 심화된 글을 작성할 예정이다.

일단 나는 타입을 공유하는 게 목적이었기 때문에 꼭 `schema.ts`와 `index.ts` 파일이 어울릴 필요는 없다. 따라서 `package.json`의 exports 필드의 types를 `schema.ts`의 변환 결과 파일로 따로 지정해 준다. `index.ts`의 `export`문은 지운다.

```json
{
  // ...
	"main": "./cjs/index.js",
	"module": "./esm/index.js",
	"types": "./cjs/types/schema.d.ts",
	"exports": {
		".": {
			"require": {
				"types": "./cjs/types/schema.d.ts",
				"default": "./cjs/index.js"
			},
			"import": {
				"types": "./esm/types/schema.d.ts",
				"default": "./esm/index.js"
			}
		}
	},
  // ...
}
```

이렇게 하고 위에서 만들었던 `apps/test`에서 `pnpm start`를 실행하면 정상적으로 `ESM Hello World!`가 출력된다. 약간 우회적인 방법이긴 하지만 일단은 문제를 해결했다.

정말로 CJS/ESM을 모두 지원하는 방법과 이론은 모노레포와 별개로 다른 글에서 다루려고 한다.
