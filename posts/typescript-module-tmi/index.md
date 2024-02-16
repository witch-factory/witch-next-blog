---
title: TS 탐구생활 - TS의 모듈
date: "2024-02-17T00:00:00Z"
description: "TS에서 모듈 시스템에 약간 추가된 점"
tags: ["typescript"]
---

ES2015부터 JS에서는 import/export를 이용하는 모듈 시스템을 정식으로 지원한다ㅣ TS에서도 당연히 이를 공유하는데 TS에서 다른 점들을 몇 가지 알아보자. JS에서의 모듈에 대해서는 [JS 탐구생활 - require와 import 그리고 JS의 모듈 시스템](https://witch.work/posts/import-and-require)을 참고할 수 있다.

# 1. export

JS의 다른 객체들과 같이 타입도 export할 수 있다. 이는 다른 파일에서 import하여 사용할 수 있다.

```ts
// types.ts
export type Person = {
  name: string;
  age: number;
};
```

```ts
// index.ts
import { Person } from "./types";
```

`*`를 이용하면 모듈 전체를 불러와서 마치 모듈의 내용을 복사한 것처럼 사용할 수 있다. 다음 예시에서는 `types.ts`를 import해서 `types`라는 이름으로 사용한다.

```ts
// index.ts
import * as types from "./types";

const person: types.Person = {
  name: "witch",
  age: 20,
};
```

이렇게 하면 서로 다른 모듈에 같은 이름의 인터페이스나 네임스페이스가 있어도 병합되지 않고 충돌을 일으키지 않는다는 장점이 있다.

## 1.1. type export

그리고 import/export하는 대상이 값이 아닌 타입이라는 것을 type 키워드를 이용해서 명시할 수 있다. 이를 type import/export라고 한다.

```ts
// types.ts
type Person = {
  name: string;
  age: number;
};

export type { Person };
```

```ts
// index.ts
import type { Person } from "./types";
```

일반적으로는 TS가 import/export되는 값이 타입인지 여부를 알고 있기 때문에 이를 사용할 필요가 없다. 하지만 몇몇 경우에 필요하고 이점이 있으니 도입된 개념인데 이에 대해서는 따로 글을 작성할 예정이다.

## 1.2. export all

`export *`를 이용하면 모듈의 모든 export를 다른 모듈에서 사용할 수 있다.

```ts
export * as types from "./types";
```

이렇게 import해서 사용할 수 있다.

```ts
import { types } from "./types";
```

# 2. export =

## 2.1. commonjs export

commonJS에서는 exports 객체를 이용해서 파일 내에서 export할 수 있는 값들을 정의한다.

```js
// commonJS
// 여러 객체를 내보낼 때
exports.a = 1;
exports.b = 2;
exports.c = 3;

// 하나의 객체를 내보낼 때
const obj = {
    a: 1,
    b: 2,
    c: 3
};

module.exports = obj;
```

이런 exports 객체와 비슷한 es2015 문법은 default export이다. 그런데 둘이 호환되지는 않는다. cjs 스타일로 export하고 es2015 스타일로 import할 수는 없다.

## 2.2. export = 문법

이 부분을 해결하기 위해서 ts에서는 `export =`라는 문법을 이용해서 모듈에서 export되는 단일 객체를 지정할 수 있도록 한다. 만약 라이브러리의 `index.d.ts`등에 들어갔는데 `export = ...`가 써있다면 그 라이브러리는 commonJS 모듈 시스템을 따르는데 import를 사용하기 위해서 이렇게 export를 해놓은 것이다. 

```ts
// types.ts
class Person {
  name: string;
  age: number;
}

export = Person;
```

이를 가져오기 위해서는 import와 require가 묘하게 섞인 문법이 사용된다. 여기서는 같은 이름인 Person을 사용했지만 `./types`파일에서 내보낸 객체는 하나뿐이므로 다른 이름을 사용해서 import해도 된다.

```ts
import Person = require("./types");
```

이렇게 모듈을 사용한 코드는 컴파일러에 의해 commonjs, AMD, ES6 모듈 문법 등으로 알아서 컴파일된다. 이 모듈은 컴파일 커맨드에서 `--module`키워드를 사용해 지정할 수 있다.

```bash
tsc --module commonjs index.ts
```

## 2.3. esModuleInterop

그런데 위와 같이 import를 하려면 import와 require를 동시에 써야 해서 어색하다. 이럴 때 tsconfig.json에서 `esModuleInterop`을 true로 설정하면 import와 require를 동시에 사용할 수 있다.

```json
{
  "compilerOptions": {
    "esModuleInterop": true
  }
}
```

이렇게 설정하면 위의 import 코드를 다음과 같이 작성할 수 있다. 두 가지 모듈 방식을 섞어서 사용할 수 있게 되는 것이다.

```ts
import Person from "./types";
```

이렇게 되는 원리에 대해서는 [ES모듈방식과 CommonJS 모듈 방식을 섞어 사용하기(esModuleInterop)](https://simsimjae.medium.com/es%EB%AA%A8%EB%93%88%EB%B0%A9%EC%8B%9D%EA%B3%BC-commonjs-%EB%AA%A8%EB%93%88-%EB%B0%A9%EC%8B%9D%EC%9D%84-%EC%84%9E%EC%96%B4-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0-esmoduleinterop-65529471948e)를 참고할 수 있다.

# 3. 스크립트 파일과 모듈 파일

파일 내부의 최상위 스코프에 `import`, `export` 키워드가 없으면 현재 파일의 타입 정의를 전역으로 사용할 수 있게 되는 스크립트 파일로 인식된다. 반면 `import`, `export` 키워드가 있을 시 모듈 파일이다.

```ts
// 스크립트 파일
interface Person {
  name: string;
  age: number;
}
```

반면 이런 식으로 `export`를 하면 모듈 파일이 된다. 주의할 점은 `export`가 최상위 스코프에 있는 게 아니라 네임스페이스 내에 있는 등 최상위가 아닌 다른 스코프에 있다면 스크립트 파일이라는 점이다.

```ts
// 모듈 파일
export interface Person {
  name: string;
  age: number;
}
```

스크립트 파일에 있는 타입과 같은 이름의 타입이 다른 모듈 파일에 있다면 주의해야 한다. 해당 타입을 그냥 사용할 때와 import해서 사용할 때의 타입 내용이 달라질 수 있기 때문이다.

예를 들어서 `Person`이라는 타입이 스크립트 파일에 있다면 이를 import하지 않고도 사용할 수 있다. 그런데 `person.ts`라는 모듈 파일에서도 `Person`타입을 export하고 있다면 Person 타입을 그냥 사용할 때와 import해서 사용할 때의 타입 내용이 달라질 수 있다.

# 참고

https://www.typescriptlang.org/ko/docs/handbook/modules.html

조현영 - 타입스크립트 교과서