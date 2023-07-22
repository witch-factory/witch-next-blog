---
title: JS의 require와 import, 그리고 JS의 모듈 시스템
date: "2023-07-22T00:00:00Z"
description: "require와 import 탐구"
tags: ["javascript"]
---

어디선가 import와 require의 차이에 관한 질문을 받았다. 원래는 require가 commonJS에서 쓰이는 문법이고 import가 ES6부터 도입되었다는 정도만 알고 있었기에 제대로 답변하지 못했다. 

그래서 이참에 예전에 들어 보기만 하고 묻어 두었던 관련 글들을 꺼내서 읽어보고 정리해보았다. 차근차근 깊이 들어가는 글이 되려고 노력하였다.

# 1. 기초

먼저 각자의 문법과 아주 기본적인 차이부터 시작해 보자. require와 import는 모두 외부 모듈의 코드를 불러오는 작업을 수행하는 데에 쓰인다.

## 1.1. require

모듈을 불러올 때는 `require` 키워드만 사용하면 된다.

```javascript
const express = require('express');
```

모듈을 내보낼 때는 `exports`와 `module.exports` 2가지의 방법이 있다. 사용하는 방식은 다음과 같다.

1. 여러 객체를 내보낼 때는 exports의 속성으로 할당한다.
2. 하나의 객체를 내보낼 때는 module.exports에 할당한다.

```javascript
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

모듈에서 내보내지는 데이터를 담고 있는 객체가 exports이기 때문에 이렇게 해주는 것이다.

불러올 때는 어떤 방식으로 모듈을 내보냈건 상관없이 `require`를 사용한다. 이렇게 해서 다른 파일의 exports 객체를 불러와 사용할 수 있다.

```javascript
const obj = require('./obj');

console.log(obj.a); // 1

// 각각 불러오기
const { a, b, c } = require('./obj');
```

### 1.1.1. exports와 module.exports

약간 의문이 생길 수 있는 지점이 있다. 왜 exports와 module.exports를 따로 쓰는 것일까? 한마디로만 말하면 [exports는 module.exports의 shortcut이기 때문이다.](https://nodejs.org/api/modules.html#exports-shortcut)

`module.exports` 변수는 모듈에서 내보내기를 할 객체를 가리킨다. 그리고 편의성을 위해서 모듈 내부에서는 `exports`를 통해서도 `module.exports`에 접근할 수 있다.

따라서 `exports.attr=1`과 같이 내보낼 객체의 속성을 추가하는 것은 `module.exports.attr=1`과 같은 표현이다. 편의성을 위해 `exports`만 쓰는 것 뿐이다.

그런데 하나의 객체만 내보내고 싶을 때는 `module.exports`에 할당해야 한다. `exports`는 shortcut일 뿐이기 때문에 `exports=obj`와 같이 할당하게 되면 `module.exports`에도 똑같이 할당되는 것이 아니라 새로운 지역 변수 `exports`에 할당하게 되기 때문이다.

반면 `module.exports`에 할당하면 `exports`에도 같은 값이 들어간다. 모듈이 평가되기 전, `exports` 변수에는 모듈의 `module.exports` 변수의 값이 할당되기 때문이다.

nodejs에서는 `require`의 작동 방식을 간략화한 코드를 통해서 이를 설명하고 있다.

```javascript
function require(/* ... */) {
  /* 기본 모듈 객체 */
  const module = { exports: {} };
  /* 즉시 실행 함수 */
  ((module, exports) => {
    // someFunc은 모듈에서 내보내는 함수
    function someFunc() {}
    /* exports에 모듈 할당 */
    exports = someFunc;
    /* 이제 exports는 module.exports의 shortcut이 아니며 module에서 내보내는 객체는 여전히 모듈 시스템이 만든 기본 객체 */
    module.exports = someFunc;
    /* 이제 모듈은 someFunc을 내보낸다 */
  })(module, module.exports);
  return module.exports;
} 
```

참고로 `modules.exports`에 대한 할당은 콜백 함수 등으로 이루어지면 안 된다. 이벤트 기반이 아니라 즉각적으로 할당되어야 한다.

```javascript
// 이렇게 하면 안 된다.
setTimeout(() => {
  module.exports = { a: 1 };
}, 1000);
```

## 1.2. import

ES6에서 새로 도입된 키워드인 import를 사용해서 모듈을 불러올 수 있다. 이때 불러오는 방식은 내보내기를 한 방식에 따라 달라진다.

내보내는 방식은 named export와 default export가 있다. named export는 여러 객체를 내보낼 때 사용하고 default export는 하나의 객체만 내보낼 때 사용한다.

```javascript
// named export
export const a = 1;
export const b = 2;
export const c = 3;

// default export
const obj = {
    a: 1,
    b: 2,
    c: 3
};

export default obj;
```

그리고 가져올 때, named export는 `{}`를 사용하며 불러오며 내보낼 때 사용한 이름과 동일한 이름을 사용해야 한다. 식별자 충돌을 피하기 위해서 named export를 별칭으로 할 수도 있다.

```js
export { myFunction as function1, myVariable as variable };
```

반면 default export는 `{}`를 사용하지 않고 내보낼 때 사용한 이름과 다른 이름을 사용할 수 있다. 어떤 이름을 사용하든 언제나 default export된 객체만을 가져온다.

따라서 당연히 default export는 모듈당 딱 하나만 있어야 한다.

```javascript
/* named export 가져오기 */
import { a, b, c } from './obj';

/* named export를 별칭으로 가져오기 */
import { a as a1, b as b1, c as c1 } from './obj';

/* 모듈 전체 가져오기. named export된 것들을 *로 한번에 묶고 가져와서 as로 별칭을 줘서, default export된 객체처럼 사용 가능 */
import * as obj from './obj';

/* default export 가져오기 */
import obj from './obj';
```

변수 바인딩 없이 특정 모듈을 불러와서 실행만 하려 한다면 import만 사용하는 것이 낫다.

```javascript
import './obj.js';
```

이때 이렇게 가져와진 모듈은 여러 곳에서 사용되더라도 최초 호출 시 단 한 번만 실행된다. 그리고 실행된 모듈은 필요한 곳에 공유되기 때문에 어느 한 모듈에서 객체를 수정하면 다른 모듈에서도 변경사항을 확인할 수 있다.

## 1.3. dynamic import

이후에 자세히 설명하겠지만 commonJS의 require는 런타임에 모듈을 읽어 온다. 반면 import는 정적으로 모듈을 불러오기 때문에 import문이 파일의 최상단에 있어야 했고 따라서 동적으로 모듈을 사용할 수 없다는 문제가 있었다.

예를 들어서 함수 호출의 결과값을 경로로 사용하거나 조건부로 모듈을 불러올 수 없었다.

```javascript
// 불가능한 구문들
import { something } from getModuleName();

if (condition) {
    import { something } from './something';
}
```

이런 문제를 해결하기 위해 dynamic import가 도입되었다. 이를 사용하면 런타임에 모듈을 불러올 수 있다. `import(module)` 표현식은 모듈을 읽고, 모듈이 export하는 모든 것을 포함하는 promise를 반환한다.

```javascript
import(module).then((module) => {
    // 모듈 객체 사용
});

// async/await 사용(당연히 async 함수 안에서만 사용 가능)
const module = await import(module);
/* default export된 객체를 사용하려면 module.default를 사용 */
console.log(module.default);
```

단 이는 함수 호출과는 다른 특수한 문법이기 때문에 import를 변수에 복사하거나 call/apply를 쓰는 것이 불가능하다. 그리고 이는 일반 스크립트에서도 동작한다. script 태그에 type="module"을 추가하지 않아도 된다.

## 1.4. 브라우저에서 모듈 사용하기

브라우저에서는 import를 사용하기 위해서는 script 태그에 `type="module"`을 추가해야 한다. 그렇지 않으면 import를 사용할 수 없다. 모듈은 특수한 키워드 등을 통해서 사용되기 때문이다.

```html
<script type="module" src="main.js"></script>
```

이렇게 선언한 모듈은 각 파일의 독립적인 스코프를 가지기 때문에 모듈 내부에서 정의한 변수나 함수는 `import`없이 다른 스크립트에서 접근할 수 없다. 예를 들어 다음과 같이 쓴다고 하자.

```html
<script type="module" src="A.js"></script>
<script type="module" src="B.js"></script>
```

A.js와 B.js는 같은 HTML 파일에 있는 모듈이지만 서로의 스코프에 접근할 수 없다.


그리고 이렇게 선언된 스크립트는 언제나 지연 실행된다. 모듈이 언제 로딩이 완료되건 간에 HTML 문서가 완전히 준비되고 나서야 실행되는 것이다.

만약 HTML 문서가 처리되길 기다리지 않고 모듈이 바로 실행되길 원한다면 `async` 속성을 태그에 추가하면 된다.

```html
<script type="module" src="main.js" async></script>
```

## 1.5. 차이 - 기본

문법적인 차이만 알아보면 다음과 같다.

1. require는 commonJS에서 사용하는 문법이고 import는 ES6에서 사용하는 문법이다.
2. require는 파일의 어느 부분에나 사용할 수 있지만 import는 파일의 최상단에만 사용할 수 있다.(dynamic import는 제외)
3. 하나의 파일에서 import와 require를 동시에 사용할 수 없다.

그리고 일반 스크립트에서의 this가 전역 객체인 것과 달리 모듈에서의 최상위 레벨 this는 `undefined`이다.

```html
<script>
  alert(this); // 브라우저 환경이라면 window
</script>

<script type="module">
  alert(this); // undefined
</script>
```

# 2. 역사

이제 좀 깊이 들어가 보자.

가장 먼저 의문이 생기는 건, 왜 commonJS같은 게 존재하며 아직도 꽤 사용되는가? import가 새로운 흐름이며 더 좋은 방식이라면 왜 commonJS는 아직도 도태되지 않았으며 import와 require의 차이가 프론트의 빈출 면접 질문인가?

내가 개발을 처음 제대로 시작한 것은 2021년이었고 이미 ES6가 메이저였다. 그래서 `import`를 쓰려고 하는 것이 당연했고 nodeJS를 쓸 때도 package.json에 `"type":"module"`을 추가해서 import를 사용하는 것이 당연한 줄 알았다.

하지만 2023년 7월 22일 지금도 nodeJS의 공식 문서에서는 require를 사용하고 있다.

```js
/* nodeJS 공식 문서의 코드 */
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

대체 commonJS는 뭐길래 이렇게 끈질기게 남아서 사용되고 있는 걸까?

## 2.1. commonJS의 역사

코드를 작성할 때 여러 파일에 나누어서 모듈화를 하는 일은 흔하다. 이렇게 모듈화를 하면 코드의 재사용이 가능해지고, 코드들이 분리되어서 관리와 협업을 하기 쉬워진다. 그리고 코드의 구조화도 더 잘 된다.

하지만 오래전 브라우저에서만 쓰였던 JS에서는 이런 모듈 시스템을 지원하지 않았다. 또한 JS가 만들어진지 얼마 안 되었을 때는 스크립트의 크기가 대부분 그렇게 크지 않았기 때문에 모듈 시스템이 없이도 잘 성장할 수 있었다.

하지만 스크립트 크기가 점차 커지자 JS 코드를 모듈화하는 방법이 필요해졌고, commonJS나 AMD와 같은 다양한 라이브러리가 등장했다.

특정 파일의 변수를 다른 파일에서도 사용하게 하고 싶으면 전역 window객체에 할당하고 다른 파일에서는 window 객체를 통해서 접근해야 했다.

그리고 `index.html`의 script 태그에 모든 파일을 포함하고 브라우저에서 실행시켜야 했다. 이런 방식은 대부분의 코드가 결국 같은 스코프에 있기 때문에 충돌의 위험이 너무 컸다. 또한 재사용성도 떨어졌다.

IIFE를 이용해서 이런 문제를 좀 개선할 수 있었다. IIFE를 활용해서 private member를 만들고 필요한 부분만 노출시키는 것이다. JS classic module pattern이라는 이름으로 간간이 글들이 남아 있다. [더 복잡한 예시는 이 글을 참고할 수 있다.](https://medium.com/@kadir.yavuz/encapsulation-in-javascript-iife-and-revealing-module-pattern-bebf49ddfa14)

```js
const store=(function(){
  let name="김성현";
  let age=26;

  return {
    getName:function(){
      return name;
    },
    getAge:function(){
      return age;
    }
  }
})();

// 김성현
console.log(store.getName());
// undefined
console.log(store.name);
```

이런 방식을 사용하여 전역 객체 window에 들어 있는 전역 변수들을 많이 줄일 수 있었지만 여전히 `index.html`의 script 태그에 모든 파일을 포함시켜야 했다. 또한 불편함을 좀 줄였을 뿐 모듈 시스템이 없다는 근본적인 문제가 해결된 것은 아니었다.

이런 상황에서 commonJS가 등장했다. 각 파일에 module객체를 만들고 module.exports에 내보낼 객체를 할당하면 다른 파일에서 require를 통해서 불러올 수 있게 해주었다.

```js
module.exports={
  name:"김성현",
  age:26
}
```

하지만, NodeJS는 commonJS를 받아들였기 때문에 이를 사용할 수 있었으나 브라우저에서는 아니었다. 그리고 require는 동기적으로 작동하여 성능 문제가 발생할 수 있었다. 

이 문제는 웹팩과 같은 모듈 번들러를 사용하여 여러 모듈을 하나로 묶어서 해결할 수 있었다. 번들러는 역시 IIFE를 이용해서 각 파일의 모듈을 묶어주는 방식으로 동작한다.




# 참고

require와 import의 차이
https://inpa.tistory.com/entry/NODE-%F0%9F%93%9A-require-%E2%9A%94%EF%B8%8F-import-CommonJs%EC%99%80-ES6-%EC%B0%A8%EC%9D%B4-1

import, export 다루기
https://inpa.tistory.com/entry/JS-%F0%9F%93%9A-%EB%AA%A8%EB%93%88-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0-import-export-%EC%A0%95%EB%A6%AC?category=889099#%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80(HTML)%EC%97%90%EC%84%9C_%EB%AA%A8%EB%93%88_%EC%82%AC%EC%9A%A9_%ED%95%98%EA%B8%B0

export의 MDN 문서
https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/export

nodeJS 공식 문서
https://nodejs.org/ko/docs/guides/getting-started-guide

모듈에 대한 소개 https://ko.javascript.info/modules-intro

CommonJS와 JS 모듈의 역사 https://medium.com/@lisa.berteau.smith/commonjs-and-the-history-of-javascript-modularity-63d8518f103e

IIFE 모듈화 패턴
https://medium.com/@kadir.yavuz/encapsulation-in-javascript-iife-and-revealing-module-pattern-bebf49ddfa14

JS의 모듈화를 위한 움직임, commonJS와 AMD
https://d2.naver.com/helloworld/12864


https://devblog.kakaostyle.com/ko/2022-04-09-1-esm-problem/

