---
title: JS 탐구생활 - JS의 값은 힙에 저장된다.
date: "2024-02-10T01:00:00Z"
description: "JS가 원시값을 다루는 방식"
tags: ["javascript"]
---

# 이 글은 작성 중입니다.

이 글은 [파차님의 트윗](https://twitter.com/finalchildmc/status/1751818395669106722)을 보고 작성하였습니다.

# 시작

String, Number, Null 등의 원시 타입을 갖는 단순 변수들은 스택에 값으로 저장되고 객체는 그 참조가 힙에 저장된다는 설명이 흔하다.

정말 많은 글에서 이렇게 설명하고 있으며 [여기](https://github.com/leonardomso/33-js-concepts?tab=readme-ov-file#3-value-types-and-reference-types)서 그런 설명을 한 글들을 볼 수 있다. [이런 글](https://www.javascripttutorial.net/javascript-primitive-vs-reference-values/)등이 있다.

하지만 이런 설명은 틀렸다. JS에서는 원시값을 포함한 대부분의 값들이 힙에 저장된다. 이게 왜 그런지 알아보자.

# 1. 의문

원시값이 직접적으로 스택에 저장된다고 하자. 그러면 변수에 얼만큼의 메모리를 할당해야 할까? JS는 동적 타입 언어이기 때문에 변수에 할당되는 값의 타입이 언제든지 바뀔 수 있고 어떤 값이 저장될지 변수 선언 시점에 알 수도 없다.

또 JS는 실행 컨텍스트 생성 시점에 모든 변수 선언을 최상단으로 끌어올리고 메모리 할당 작업을 하기 때문에 얼만큼의 메모리를 할당해야 하는지 아는 것은 더 힘들어진다(`let`, `const`도 변수 초기화 작업을 하지 않을 뿐 선언은 끌어올려진다).

```js
let a = 1;

A();
B();

a="hello";
let b="very very long string";
```

위 코드에서 `a`는 처음에는 숫자 1을 가리키다가 문자열 "hello"를 가리키게 된다. `a`에는 얼만큼의 메모리를 할당해 놓아야 하는가? 또 `b`는 실행 컨텍스트 생성 시점에는 선언만 되어 있지만 이후 매우 긴 문자열을 할당받는다. 얼만큼의 메모리를 할당해야 하는가?

이런 문제로 변수를 스택에 저장하는 건 쉽지 않다.


---

# 참고

이 글의 시작이 된 파차님의 트윗 https://twitter.com/finalchildmc/status/1751818395669106722

관련해서 파차님이 푸신 타래 https://twitter.com/finalchildmc/status/1664895964115607556

33 JS Concepts에 파차님이 올리신 이슈 https://github.com/leonardomso/33-js-concepts/issues/481

Y combinator 해커뉴스에 V8 개발자가 쓴 댓글 https://news.ycombinator.com/item?id=33006653