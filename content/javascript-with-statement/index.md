---
title: JS 탐구생활 - with문에 대하여
date: "2024-06-27T01:00:00Z"
description: "JS에서 eval과 함께 절대 쓰면 안된다는 with문"
tags: ["javascript"]
---

# with문 문법

`with`문의 문법은 다음과 같다. `with`에 전달된 객체의 속성을 내부 블록의 스코프 로컬 변수로 가져온다.

```js
with (object) {
  statement
}

// 이런 식으로 쓸 수 있다
var test={firstName:"John", lastName:"Doe"};
with (test) {
  console.log(firstName + " " + lastName);
}
```

`with`문은 중첩된 객체에 접근하는 번거로움을 피하기 위해 만들어졌다. 예를 들어 이런 것이다.

```js
foo.bar.baz.a = 1;
foo.bar.baz.b = 2;

// with문을 사용하면
with (foo.bar.baz) {
  a = 1;
  b = 2;
}
```

# with문의 문제점

> [I blame 'with'. So, ex-Borland people at Netscape. And so, ultimately, myself. - Brendan Eich](https://esdiscuss.org/topic/array-prototype-values-compatibility-hazard#content-7)

하지만 with문은 지금 일반적으로 사용하지 않기를 권한다. ES5에서 나온 strict mode는 아예 with문을 금지한다. 이는 with문이 코드를 읽기 어렵게 만들고, 성능을 저하시키기 때문이다. 브랜든 아이크에 의하면 with 폐기는 성능이 아니라 프로그램 분석의 어려움 때문이라고 한다.

> [with문은 문법적 스코프를 위반하기 때문에 보안 등을 위한 프로그램 분석을 어렵거나 불가능하게 만든다.](https://twitter.com/BrendanEich/status/68001466471817216)

예를 들어 다음과 같은 코드를 본다.

```js
function logit(msg, obj) {
  with (obj) {
    console.log(msg);
  }
}

logit("hello", {msg: "my object"}); // "my object"
logit("hello", {}); // "hello"
```

여기서 만약 `obj`에 `msg` 프로퍼티가 있다면 `with` 문 내의 `console.log`는 매개변수 `msg`가 아니라 `obj.msg`를 참조한다. 이런 식으로 with는 식별자가 무엇을 참조하고 있는지 판단하기 어렵게 만든다.

## with가 만드는 코드 취약점

`with`는 코드를 변경에 취약하게 만들 수 있다. 악셀 라우슈마이어의 "자바스크립트를 말하다"에는 다음과 같은 예시 코드가 있다.

```js
function foo(someArray) {
  var values=...;
  with (someArray) {
    values.someMethod(...);
    // 이후 코드...
  }
}

foo(myArray);
```

이때 `myArray`에 접근하지 않더라도 함수 호출을 제대로 안 되게 할 수 있다. `Array.prototype.values`를 추가하면 된다.

```js
Array.prototype.values = function() {
  // 새로운 코드...
};
```

이제 `foo` 함수 내부의 `with` 본문 블럭은 앞서 정의된 `values`가 아니라 `someArray.values`를 사용하게 되고 따라서 우리가 정의한 `Array.prototype.values`를 호출하게 된다. 이런 식으로 `with`문은 코드를 취약하게 만들 수 있다.

이는 단순한 예시가 아니고 배열 메서드 `values()`가 Firefox에 추가되면서 실제로 발생한 문제이다. 이에 대한 자세한 내용은 아래에서 다루겠다.

## minification과 코드 취약점

JS의 코드 압축 도구들은 변수 이름을 짧게 바꾸는 등의 최적화로 코드를 압축한다. 이 때 with문을 사용하면 변수 이름을 바꿀 수가 없다. with문 내부에서는 이름이 변수를 참조하는지 아니면 with의 대상 객체의 프로퍼티를 참조하는지를 오로지 런타임에만 판단할 수 있기 때문이다.

단순히 변수명으로 인해 코드 길이가 늘어나는 건 큰 문제가 아니다. 하지만 이런 것들이 얽히면 문제를 발생시킬 수 있다.

2013년 웹에서 작동하는 TYPO3이라는 컨텐츠 관리 시스템(CMS)의 화면이 Firefox 24에서 제대로 동작하지 않는다는 버그가 제보되었다. 이는 JS 프레임워크 중 하나인 Sencha ExtJS의 코드에서 발생했다. 해당 라이브러리 코드에는 다음과 같은 `with`문을 사용하는 함수를 생성하는 내용이 있었다.

```js
me.definitions.push('function ' + name + '(' + me.fnArgs + ') {',
    ' try { with(values) {',
    '  ' + action,
    ' }} catch(e) {',
    '}',
    '}');
```

이 코드의 문자열을 통해 만들어지는 함수는 다음과 같은 형태가 된다.

```js
function functionName(arg1, arg2, ...) {
  try {
    with(values) {
      // action
      // 아마 values를 사용하는 동작
    }
  } catch(e) {
  }
}
```

이때 생성된 함수의 `with`문에 쓰인 `values`는 다른 변수명으로 치환될 수 없다. 물론 해당 함수가 만들어진 기반이 문자열이기 때문에 원래부터 압축될 수 없었지만, 만약 함수가 이미 구성된 형태로 쓰였다고 해도 `with(values)`는 압축될 수 없었을 것이다.

문제는 당시에 배열 메서드 `Array.prototype.values()`가 Firefox에 새로 추가되었다는 것이다. `with`문의 특성상 `with`문 블럭에서는 `values`를 사용하는 코드가 다음과 같이 쓰였을 것이다.

```js
function functionName(arg1, arg2, ...) {
  try {
    with(values) {
      // 대충 values를 사용하는 동작
      values.a=1;
      values.forEach(function() {});
    }
  } catch(e) {
  }
}
```

그런데 만약 `values`가 배열이었다면 `with`의 본문 블럭에서 `values`를 쓰는 건 원래 의도했던 `values`가 아니라 `values`배열의 프로토타입 체인에 존재하는 `Array.prototype.values()`를 참조하게 된다. 따라서 의도하지 않은 결과가 나타나서 화면이 제대로 동작하지 않게 된 것이다.

해당 라이브러리의 관련자에 의하면 `with`문은 템플릿 관련 클래스에서 사용자가 정의한 하위 표현식을 처리하기 위해 딱 한 군데에서 사용되었기에 모든 패치를 감수하면서까지 `with`를 제거하는 게 크게 의미가 없어 보였다고 한다. 하지만 그 작은 부분에서 `with` 하나가 쓰였다고 이렇게 버그가 터지게 된 것이다..






# with문의 대체

위와 같이 중첩 객체에 접근할 때는 다음과 같이 임시 변수를 사용하는 것이 권장된다.

```js
var b = foo.bar.baz;
b.a = 1;
b.b = 2;
```

현재 스코프에 임시 변수 `b`를 생성하는 것이 싫을 수 있는데 그럴 땐 IIFE 패턴을 사용할 수 있다.

```js
(function() {
  var b = foo.bar.baz;
  b.a = 1;
  b.b = 2;
})();

// 혹은 이런 식으로 IIFE의 매개변수를 이용할 수 있다
(function(b) {
  b.a = 1;
  b.b = 2;
})(foo.bar.baz);
```

# 참고

악셀 라우슈마이어 지음, 한선용 옮김, "자바스크립트를 말하다", 한빛미디어, 244~248

TYPO3 compatibility regression in Nightly

https://bugzilla.mozilla.org/show_bug.cgi?id=883914#c13

DCU Bank fails to display any accounts on "Accounts" page, in Nightly

https://bugzilla.mozilla.org/show_bug.cgi?id=881782

Array.prototype.values() compatibility hazard

https://esdiscuss.org/topic/array-prototype-values-compatibility-hazard

MDN Web docs, "with"

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/with