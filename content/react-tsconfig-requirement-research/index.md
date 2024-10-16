---
title: React 프로젝트에서 필요한 tsconfig 설정에 대하여
date: "2024-10-16T01:00:00Z"
description: "React 프로젝트에서 필요한 tsconfig 설정에 대하여 알아보자"
tags: ["react", "typescript"]
---

React 문서를 보다가 tsconfig.json의 `lib`과 `jsx` 설정에 관한 내용이 있었다. 두 가지 속성에 관해 파헤쳐 보았다.

# 1. React에 필요한 tsconfig 설정

React와 TypeScript를 함께 사용하는 건 아주 흔한 일이다. 그래서 React 공식 문서에도 ["TypeScript 사용하기"](https://react.dev/learn/typescript)라는 문서가 있다.

이중 ["기존 React 프로젝트에 TypeScript 추가하기"](https://react.dev/learn/typescript#adding-typescript-to-an-existing-react-project)에 따르면 기존 프로젝트에 TypeScript를 추가하는 과정은 다음과 같다.

먼저 `@types/react`와 `@types/react-dom`을 설치하라고 한다. 리액트는 공식 타입이 없고 `DefinitelyTyped`라는 타입 정의 저장소를 통해 타입을 제공한다는 점을 알고 있었기에 이해가 갔다.

문제는 다음에 나오는 `tsconfig.json` 설정이었다. 필요한 설정은 다음과 같다.

> 1. dom은 lib에 포함되어야 합니다(주의: lib 옵션이 지정되지 않으면, 기본적으로 dom이 포함됩니다).
> 2. jsx를 유효한 옵션 중 하나로 설정해야 합니다. 대부분의 애플리케이션에서는 preserve로 충분합니다. 라이브러리를 게시하는 경우 어떤 값을 선택해야 하는지 jsx 설명서를 참조하세요.

그런데 이게 대체 무슨 뜻일까? 조사한 내용을 요약하면 `lib` 옵션의 `"dom"`은 React 타입에 필요한 브라우저 DOM의 타입 정의 파일을 포함한다. 그리고 `jsx` 옵션은 JSX 문법을 어떻게 처리할지를 설정하는 것이다. 나는 이 문서를 통해 이 두 가지 옵션을 처음 접했기 때문에 자세히 알아보았다.

# 2. tsconfig - lib 옵션

tsconfig.json의 lib 옵션은 타입스크립트 컴파일러가 사용할 타입 정의 파일을 지정하는 옵션이다.

예를 들어 `create-next-app`으로 생성한 프로젝트의 `tsconfig.json`을 가보면 다음과 같이 `lib`이 정의되어 있다.

```json
{
  "compilerOptions": {
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    // ...
  }
}
```

이게 무슨 뜻인지 좀 더 자세히 알아보자.

## 2.1. lib.d.ts

타입스크립트는 기본적으로 `Array` 같은 JS 내장 객체나 브라우저 환경에 있는 `document`와 같은 것들의 타입 정의를 포함한다.

그럼 그 타입 정의들은 어디에 있을까? 타입스크립트를 설치하면 따라오는 `node_modules/typescript/lib` 폴더의 `lib.d.ts`라는 파일에 있다. 이는 타입스크립트가 컴파일될 때 자동으로 추가되는 파일이다.

해당 파일에 들어가 보면 [트리플 슬래시 지시자](https://www.typescriptlang.org/ko/docs/handbook/triple-slash-directives.html)를 통해서 내장 라이브러리 파일들을 포함하고 있는 걸 볼 수 있다. 이러한 `///`는 파일 맨 위에 위치할 때 컴파일러에게 컴파일에 도움이 될 만한 정보를 제공하는 데 사용된다.

```typescript
// lib.d.ts
/// <reference no-default-lib="true"/>

/// <reference lib="es5" />
/// <reference lib="dom" />
/// <reference lib="webworker.importscripts" />
/// <reference lib="scripthost" />
```

해당 파일들(예를 들어 es5에 해당하는 파일은 `lib.es5.d.ts`)은 특정 버전의 기능에 대한 타입 정의를 포함하고 있다. 이때 추가되는 파일들은 타입스크립트 컴파일 과정에서 `target`과 `lib` 옵션에 따라 결정되는데, 파일을 로드하는 과정은 [tsconfig.json의 lib](https://norux.me/59)에서 더 자세히 볼 수 있다. 예를 들어 `Map`의 타입 정의는 `target`이 `es6` 이상일 때 포함된다.

## 2.2. lib 옵션

`lib.d.ts`에 어떤 내장 타입 정의 파일이 포함될지는 기본적으로 `tsconfig.json`의 `target` 옵션(타입스크립트가 어떤 버전의 자바스크립트로 컴파일될지를 결정)에 따라 달라진다. 그런데 어떤 내장 타입 정의 파일을 사용할지를 변경하고 싶을 수 있다. [타입스크립트 사이트](https://www.typescriptlang.org/tsconfig/#lib)에서는 다음과 같은 경우를 제시하고 있다.

- 프로그램이 브라우저 환경에서 실행되지 않기 때문에 "dom" 타입 정의가 필요없는 경우
- 런타임 플랫폼이 폴리필을 통해 특정 JavaScript 객체를 제공하지만 해당 ECMAScript 버전의 전체 문법을 지원하지 않는 경우
- 더 높은 ECMAScript 버전의 폴리필이나 네이티브 구현이 있는 경우

예를 들어 사용하고 있는 JS 런타임이 ES5 버전이라면 tsconfig.json의 `target`은 `es5`로 설정되어 있을 것이다. 이런 상황에서 `Promise`의 폴리필을 사용하고 있다면 `lib` 옵션에 `ES2015.Promise`를 추가함으로써 `Promise`의 타입 정의를 사용할 수 있다.

제공되는 라이브러리 목록은 [타입스크립트 홈페이지](https://www.typescriptlang.org/tsconfig/#lib)에서 확인할 수 있다.

## 2.3. lib 옵션과 react

지금까지 알아낸 걸 기억하면서 다시 돌아가면, 기존 프로젝트의 `tsconfig.json`에 `lib` 옵션을 추가하는 이유는 당연하다. react에서 브라우저 DOM의 타입 정의를 사용하기 때문이다. 

당장 [@types/react-dom의 타입 정의 파일 index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-dom/index.d.ts)만 들어가봐도 `lib.dom.d.ts`에 정의된 타입들(예를 들면 `Element`)이 엄청나게 많이 쓰이고 있다.

## 2.4. noLib

tsconfig.json에 `"noLib"` 옵션을 true로 설정하거나 커맨드라인에 `--noLib` 플래그를 명시하면 타입스크립트 컴파일 시 `lib.d.ts`가 추가되고 사용되는 걸 막을 수 있다. 이렇게 하면 `Array`를 비롯한 JS 내장 객체의 타입 정의들을 사용할 수 없다.

표준 브라우저 환경과 상당히 다른 어떤 커스텀 환경에서 작업하거나 하는 등의 이유로 `Array`, `Date`, `Map` 등의 내장 객체 그리고 객체 메서드들의 타입 정의를 직접 작성하고 싶을 경우 사용할 수 있다. 일반적으로는 `lib.d.ts`를 사용하므로 이 옵션을 사용할 경우 다른 사람들과 프로젝트 공유가 어려워지고 또한 다른 사람이 짠 코드를 사용하기도 어려워지기 때문에 권장되지 않는다.

## 2.5. Supporting lib from node_modules

https://devblogs.microsoft.com/typescript/announcing-typescript-4-5-beta/#supporting-lib-from-node_modules

# 3. tsconfig - jsx 옵션

> jsx를 유효한 옵션 중 하나로 설정해야 합니다. 대부분의 애플리케이션에서는 preserve로 충분합니다. 라이브러리를 게시하는 경우 어떤 값을 선택해야 하는지 jsx 설명서를 참조하세요. - React 공식 문서

이 설정은 JSX 구조가 어떻게 JS 파일로 변환되는지를 설정한다.

## 3.1. JSX

JSX는 JavaScript의 확장 문법으로, 렌더링 로직과 마크업이 함께 있는 코드를 작성할 수 있게 해준다. HTML과 비슷한 문법을 사용하면서도 JavaScript의 기능을 그대로 사용할 수 있어서 리액트에서 많이 사용된다.

## 3.2. tsconfig의 jsx 옵션

JSX가 JavaScript 확장 문법이기는 하지만 결국 실행될 때는 JavaScript로 변환되어야 한다. 이때 `jsx` 옵션을 통해 JSX를 어떻게 변환할지를 설정할 수 있다.

[typescript 사이트의 tsconfig jsx 옵션](https://www.typescriptlang.org/tsconfig/#jsx)에 의하면 다음과 같은 옵션이 있다. 해당 링크에서 예시도 확인할 수 있다.

- react-jsx: JSX가 프로덕션에 최적화된 `_jsx` 호출로 변환된 형태의 `.js`파일을 생성한다.
- react-jsxdev: JSX가 개발을 위한 `_jsxDEV` 호출로 변환된 형태의 `.js`파일을 생성한다.
- preserve: JSX를 변환하지 않고 그대로 둔다. `.jsx` 파일을 생성한다.
- react-native: JSX를 그대로 둔 채로 `.js` 파일을 생성한다.
- react: JSX가 같은 의미의 `React.createElement` 호출로 변환된 형태의 `.js` 파일을 생성한다.

React 공식 문서에서 쓰는 `preserve` 옵션을 사용할 경우 JSX를 변환하지 않고 그대로 둔다. 이럴 경우 Babel에서 JSX를 변환하는 작업을 하게 된다.

# 4. 결론

React 프로젝트에서 tsconfig.json에 `lib`과 `jsx` 옵션을 설정하는 이유를 알아보았다.

`lib` 옵션은 타입스크립트 컴파일러가 사용할 타입 정의 파일을 지정하는 옵션이다. 브라우저 DOM의 타입을 사용하기 위해 `lib` 옵션에 `"dom"`을 추가한다.

`jsx` 옵션은 React에서 사용하는 JSX 구조가 어떻게 JS 파일로 변환되는지를 설정하는 옵션이다. 유효한 옵션 중 하나로 설정해야 React의 JSX가 올바르게 변환된다.

# 참고

Using TypeScript

https://react.dev/learn/typescript

TSConfig Reference의 lib/noLib 옵션, jsx 옵션

https://www.typescriptlang.org/ko/tsconfig

tsconfig.json의 lib

https://norux.me/59

lib.d.ts

https://radlohead.gitbook.io/typescript-deep-dive/type-system/lib.d.ts

TypeScript 트리플 슬래시 지시어 (Triple-Slash Directives)

https://it-eldorado.com/posts/efa883af-7dd4-4680-a5bb-c09184883ae1

https://www.typescriptlang.org/ko/docs/handbook/triple-slash-directives.html

Supporting lib from node_modules

https://devblogs.microsoft.com/typescript/announcing-typescript-4-5-beta/#supporting-lib-from-node_modules

타입스크립트 핸드북, JSX

https://www.typescriptlang.org/ko/docs/handbook/jsx.html

JSX로 마크업 작성하기

https://ko.react.dev/learn/writing-markup-with-jsx