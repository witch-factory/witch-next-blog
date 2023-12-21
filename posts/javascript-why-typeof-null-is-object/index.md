---
title: JS의 typeof null은 왜 object일까?
date: "2023-12-21T00:00:00Z"
description: "자바스크립트의 typeof 연산자가 null을 object로 판단하는 이유"
tags: ["javascript"]
---

# 이 글은 현재 작성 중입니다.

# 1. 시작

Javascript에는 `null`과 `undefined`라는 2가지 특수한 값이 있다. 이 둘은 각각 하나씩의 값(각각 null, undefined)밖에 가질 수 없는 주제에 원시값 타입에서 한자리씩을 차지하고 있다. 그리고 이 둘은 둘 다 데이터 값이 없다는 의미를 비슷하게 나타내기 때문에 면접의 단골 질문 중 하나다.

그 둘의 의미와 차이에 대해서는 이미 많은 글이 있고, 참고 섹션에 링크를 넣어놓은 'JavaScript의 타입과 자료구조'에도 아주 잘 설명되어 있으므로 넘어가겠다. 이 글에서는 하나의 궁금증에 대해 다룬다. 왜 `typeof null`은 `object`일까?

`typeof null`이 `object`라는 걸 알게 된 지는 꽤 오래되었지만 어디를 보아도 대부분 역사적인 이유라고만 했다. 제대로 된 설명은 [“typeof null”의 역사](https://github.com/FEDevelopers/tech.description/wiki/%E2%80%9Ctypeof-null%E2%80%9D%EC%9D%98-%EC%97%AD%EC%82%AC)와 그 원문에서 정도만 찾을 수 있었다.

그래서 위의 글에 새로 알게 된 점 몇 개를 더해 이 글을 쓰게 되었다.

# 2. null, undefined의 등장

Javascript가 처음 나오던 1995년 시절, Javascript 1.0에는 의미있는 데이터값이 없다는 의미를 나타내는 데에 쓰이는 2가지 값이 있었다. 첫번째는 undefined였다. undefined는 초기화되지 않은 변수의 값으로 쓰였다. 그리고 객체에 존재하지 않는 속성의 값에 접근하려고 할 때도 undefined가 반환되었다. 이는 현재의 JS에서도 그대로 유지되고 있다.

```javascript
var a;
console.log(a); // undefined

var obj = {};
console.log(obj.a); // undefined
```

null은 객체 값이 기대되는 맥락에서 "객체가 없다"는 것을 나타내기 위해 쓰였다. 이는 Java의 `null`을 따온 것이다. Java로 구현된 객체와 Javascript의 통합을 용이하게 해주었다. 당시 Java로 만들어진 웹 컴포넌트들을 조립하는 데 사용하는 것도 Javascript의 주요 목적 중 하나였기에 이는 괜찮았다. 더 자세한 Javascript의 역사에 대해서는 다른 글(현재 작성 중)을 참고할 수 있다.

# 3. typeof의 등장

Javascript 1.1에서 typeof 연산자가 등장했다. 이는 피연산자의 원시형 타입을 문자열로 반환하는 연산자다. 이 연산자는 현재의 JS에서도 그대로 유지되고 있는데, 결과로 가능한 값은 다음과 같다. Javascript 1.1 당시에는 `symbol`과 `bigint`가 없었다.

- "undefined"
- "boolean"
- "number"
- "string"
- "object"
- "function"
- "symbol"(ES6에서 추가)
- "bigint"(ES2020에서 추가)

그런데 이 `typeof` 연산자는 null에 대해서는 `"object"`를 반환한다. 이는 Javascript 1.1에서도 그랬고 현재도 마찬가지다.

물론 이는 Java와의 일관성이라고도 할 수 있다. Java에서 모든 값은 객체이고 `null`은 "객체가 없다"는 뜻의 객체니까, 'Java와 비슷해야 한다'는 요구사항이 있었던 Javascript에서도 `null`은 객체다! 라고 주장할 수도 있겠다.

하지만 문제는 Java에는 `typeof`와 대응되는 무언가가 없었고 `null`을 초기화되지 않은 변수의 기본값으로 사용했다는 것이다. 나름대로 배경이 있는 구현이기는 했으나 실제로 맞는 구현은 아니었다.

브랜든 아이크는 이 `typeof null`의 값은 Mocha(Javascript의 극초기 코드네임) 구현의 [Leaky Abstraction](http://rapapa.net/?p=3266)이었다고 회상하기도 한다.


당시 typeof 연산자의 구현은 값의 내부에 들어 있는 어떤 태그 값을 읽어오는 식이었다. 그런데 `null`의 태그 값은 객체의 타입을 나타내는 것과 같은 내부 태그값을 가졌었다. 따라서 typeof는 어떤 특별한 처리 로직 없이 null에 대해서 "object"를 반환하게 되었다.

모두 알다시피 이는 typeof 연산자를 통해서 값이 실제 객체인지를 알아보고 싶어하는 사람들에게 큰 혼란을 주었다. `typeof obj === "object"`라는 코드는 `obj`가 `null`일 때도 `true`를 반환하기 때문이다. 그리고 null의 프로퍼티 접근은 런타임 에러다.



# 임시 내용

아주 맨 처음 JS가 Mocha였던 시절 값들은 C의 discriminated union으로 표기되고 있었다. 그러나 1996년 기술 부채를 청산하는 작업을 하는 동안 값을 표현하는 방식을 원시값 그대로를 포함하는 tagged pointer로 변경했다. 그것이 위의 구현이다. 이외에도 중첩 함수, 함수 표현식, switch와 같은 문법들이 추가되었고 이 새로운 엔진은 'SpiderMonkey'라는 이름으로 출시되었다.



# 참고

“typeof null”의 역사 https://github.com/FEDevelopers/tech.description/wiki/%E2%80%9Ctypeof-null%E2%80%9D%EC%9D%98-%EC%97%AD%EC%82%AC

NaN and Infinity in JavaScript https://2ality.com/2012/02/nan-infinity.html

The history of “typeof null”(그리고 댓글의 브랜든 아이크의 첨언) https://2ality.com/2013/10/typeof-null.html

JavaScript의 타입과 자료구조 https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures

JavaScript: the first 20 years https://dl.acm.org/doi/10.1145/3386327 12~13페이지

개발에서의 Leaky Abstraction http://rapapa.net/?p=3266

C/C++ Tagged/Discriminated Union https://medium.com/@almtechhub/c-c-tagged-discriminated-union-ecd5907610bf