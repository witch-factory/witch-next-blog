---
title: JS 탐구생활 - with문에 대하여
date: "2024-07-03T01:00:00Z"
description: "JS에서 eval과 함께 절대 쓰면 안된다는 with문, 대체 무엇일까?"
tags: ["javascript"]
---

![썸네일](./thumbnail.png)

Javascript를 배우다 보면 `eval()`을 절대 쓰지 말라는 말을 듣게 된다. 그런데 그보다는 빈도가 적지만 역시 쓰면 안 된다고 나오는 문법으로 `with`문이 있다. 물론 deprecated된 문법이고 엄격 모드에서는 금지되기도 해서 실질적으로 사용되는 일은 거의 없다. 하지만 Javascript의 역사이기도 하고 `Symbol.unscopables`와 같은 새로운 문법과 연관이 있기에 2개의 글을 통해 `with`문에 대해 알아보려 한다.

이 글에서는 `with`문이 어떻게 등장했고 어떻게 쓰이며, 뭐가 문제고 어떻게 대체할 수 있었는지 알아본다. 다음 글에서는 `with`가 실제로 일으켰던 문제와 그 이후에 대해서 알아볼 예정이다.

# 1. with문의 등장

1996년 Javascript 1.0이 만들어질 때의 문법은 C언어의 문법을 기본으로 했다. `if`, `for`, `while`, `return`, 중괄호 문장 블록 등등이 모두 C에서 영향을 받은 것이다.

그리고 여기에 객체 자료형의 속성에 접근하기 위한 2가지 문법이 추가되었다. 하나는 AWK의 영향을 받은 `for...in` 문이었고 나머지 하나가 바로 `with` 문이었다. 

Javascript를 만든 Brandan Eich는 당시 넷스케이프 소속이었는데 넷스케이프 LiveWire 팀의 요청으로 인해 `with`문을 추가한 것이다. 객체의 속성에 좀 더 편리하게 접근하기 위함이었다.

# 2. 기본적인 개념

`with`문의 기본적인 형태는 다음과 같다.

```js
with (expression) {
  statement
}
```

`with`문은 내부 본문을 평가할 때 주어진 표현식을 스코프 체인의 맨 앞에 추가하도록 한다.

## 2.1. 동작

Javascript는 식별자에 해당하는 데이터를 찾을 때 특정 객체에 속한 식별자가 아니라면 해당 식별자가 위치한 곳의 스코프 체인을 검색한다. 그런데 `with`문 내부에서 식별자를 평가할 경우에는 `with`에 주어진 객체의 프로토타입 체인을 먼저 검색하게 된다.

즉 `with`문의 본문 내에서는 `test` 객체에서 접근할 수 있는 속성들을 모두 지역 변수인 것처럼 쓸 수 있다는 것이다. 식별자의 데이터를 가져오기 위해 스코프 체인을 검색하기 전에 먼저 `with`에 주어진 객체를 `in`을 통해 검색한다.

```js
// 이런 식으로 쓸 수 있다.
// with문의 내부에서 test 객체의 프로퍼티에 바로 접근할 수 있다.
var test={firstName:"John", lastName:"Doe"};
with (test) {
  console.log(firstName + " " + lastName);
  // John Doe
}
```

`in`을 사용한다는 것은 `with`문에 주어진 객체의 프로토타입 체인에 있는 속성도 지역 변수처럼 사용할 수 있다는 것을 뜻한다.

```js
var parent = {myName: "witch"};
var child = Object.create(parent);

with (child) {
  console.log(myName);
  // witch
}
```

`with`문에 주어진 객체의 메서드를 `with`문 내에서 조회할 경우 `with`문에 주어진 객체를 `this`로 하여 호출된다.

```js
var obj = {
  toString: function() {
    return "It's witch's object";
  }
};

with (obj) {
  console.log(toString());
  // It's witch's object
}
```

## 2.2. 목적

`with`문은 원래 중첩된 객체에 접근하는 번거로움을 피하기 위해 만들어졌다. 예를 들어 이런 방식으로 사용하는 것이다.

```js
foo.bar.baz.a = 1;
foo.bar.baz.b = 2;

// with문을 사용하면
with (foo.bar.baz) {
  a = 1;
  b = 2;
}
```

## 2.3. 현재

현재는 `with`문을 금지하는 엄격 모드가 거의 기본이 되었다. 따라서 `with`문은 현재 자료를 찾기도 힘들 정도로 사장되었다. Javascript의 아주 초기를 지난 다음에 `with`문이 일반적으로 권장되었던 적은 단 한 순간도 없지만 다음과 같은 트릭 정도는 가능했다고 한다.

`var` 변수 선언이 함수 스코프를 가진다는 것은 유명하다. 다음과 같은 코드는 해당 사실을 보여주는 예시로 널리 쓰인다.

```js
for(var i=0; i<10; i++) {
  setTimeout(function() {
    console.log(i);
  }, 10);
}
// 10이 10번 출력된다.
```

따라서 블록 스코프를 가지는 `let`, `const`가 ES6에서 나왔다. 하지만 ES6가 널리 퍼지기 전에는 `with`문을 사용하여 이런 블록 스코프를 흉내낼 수 있었다고 한다.

```js
for(var i=0; i<10; i++) {
  with({temp: i}) {
    setTimeout(function() {
      console.log(temp);
    }, 10);
  }
}
```

다만 당연히 이는 권장되지는 않았다. 현실적으로는 아래 소개할 IIFE를 이용한 방법이 더 많이 쓰였고 안전했다. 최근에는 아예 `Array.prototype.with()`와 새로운 배열 메서드도 만들어진 걸로 보아 `with`문이 쓰일 일은 앞으로는 없을 것으로 보인다.

# 3. with문의 문제점

> [I blame 'with'. So, ex-Borland people at Netscape. And so, ultimately, myself. - Brendan Eich](https://esdiscuss.org/topic/array-prototype-values-compatibility-hazard#content-7)

잘 알려져 있다시피 `with`문은 현재 전혀 권장되지 않으며 엄격 모드에서는 아예 에러를 발생시킨다. 그런데 `with`문이 왜 문제가 되는지에 대해 좀더 구체적으로 알아보자.

## 3.1. 가독성

`with`문은 코드를 읽기 어렵고 예측하기 힘들게 만든다. 다음과 같은 짧은 코드를 한번 보자. 더글라스 크락포드의 "자바스크립트 핵심 가이드"의 코드이다.

```js
with (obj){
  a=b;
}
```

이는 `obj` 객체가 어떤 프로퍼티를 가지고 있는지에 따라 다른 동작을 하게 된다. 이 동작을 풀어서 쓰면 이런 동작이다.

```js
if(obj.a===undefined){
  a=(obj.b===undefined)?b:obj.b;
} else{
  obj.a=(obj.b===undefined)?b:obj.b;
}
```

a와 b가 둘 다 obj의 속성일 수 있기 때문에 이런 일이 발생한다. 이는 제대로 해석하기 매우 어렵다.

이렇게 `with`에 주어진 객체의 프로퍼티에 따라 동작이 달라지는 코드는 함수 매개변수 등에서도 얼마든지 있다.

```js
function logit(msg, obj) {
  with (obj) {
    console.log(msg);
  }
}

logit("hello", {msg: "my object"}); // "my object"
logit("hello", {}); // "hello"
```

여기서 만약 `obj`에 `msg` 프로퍼티가 있다면 `with` 문 내의 `console.log`는 매개변수 `msg`가 아니라 `obj.msg`를 참조한다. 이런 식으로 with는 식별자가 무엇을 참조하고 있는지 사전에 판단하기 어렵게 만든다. 오로지 런타임에만 제대로 알 수 있다.

## 3.2. 코드의 취약성

> [with문은 문법적 스코프를 위반하기 때문에 보안 등을 위한 프로그램 분석을 어렵거나 불가능하게 만든다. - Brandan Eich](https://twitter.com/BrendanEich/status/68001466471817216)

`with`는 코드를 변경에 취약하게 만들 수 있다. Brandan Eich 또한 `with`문을 폐기하는 이유로 성능이 아니라 프로그램 분석의 문제를 들었다. 악셀 라우슈마이어의 "자바스크립트를 말하다"에서는 다음과 같은 예시 코드를 소개하고 있다.

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

`myArray`에 접근하지 않더라도 함수 호출을 제대로 안 되게 할 수 있다. `Array.prototype.values` 메서드를 추가하면 된다.

```js
Array.prototype.values = function() {
  // 새로운 코드...
};
```

이제 `foo` 함수 내부의 `with` 본문 블럭은 앞서 정의된 `values`가 아니라 `someArray.values`를 사용하게 되고 따라서 우리가 정의한 `Array.prototype.values`를 호출하게 된다. 이런 식으로 `with`문은 코드를 취약하게 만들 수 있다.

이는 단순한 가정이 아니라 Firefox에서 실제로 버그를 발생시킨 적이 있다. 이는 다음 글에서 다룰 예정이다.

## 3.3. 코드 압축 불가

`with`문은 코드 압축 도구들이 코드를 압축하는 데 방해가 된다. 코드 압축 도구들은 변수 이름을 짧게 바꾸는 등의 최적화로 코드를 압축한다. 이 때 `with`문을 사용하면 변수 이름을 바꿀 수가 없다. `with`문 내부에서는 이름이 변수를 참조하는지 아니면 `with`의 대상 객체의 프로퍼티를 참조하는지를 오로지 런타임에만 판단할 수 있기 때문이다.

코드가 압축되지 않으면 코드의 크기가 커지고 성능이 떨어지게 된다. 또한 단순히 코드 크기가 늘어나는 것도 문제지만 일반적으로 쓰이는 `values`같은 이름을 변수로 선언하고 `with`문 내에 썼을 때 변경에 취약해질 수 있다. 이는 다음 글에 설명할 문제의 작은 원인 중 하나가 되기도 했다.

# 4. with문의 대체

그럼 이렇게 권장되지 않는 `with`문을 대체할 수 있는 방법은 무엇일까? 요즘은 아예 `with`문이 거의 쓰이지 않기에 대체라는 말이 적절하지 않을지도 모르지만, 원래 `with`문의 목적을 수행하는 방식은 다음과 같다.

먼저 복잡한 구조의 중첩 객체에 접근할 때는 다음과 같이 임시 변수를 사용하는 것이 권장된다.

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

IIFE는 앞서 보았던, `with`를 이용해 블록 스코프를 흉내내는 것에도 사용할 수 있다.

```js
for(var i=0; i<10; i++) {
  (function(temp) {
    setTimeout(function() {
      console.log(temp);
    }, 10);
  })(i);
}
```

# 참고

[Allen Wirfs-Brock, Brandan Eich, "JavaScript: the first 20 years"](https://dl.acm.org/doi/10.1145/3386327), 11-12p

악셀 라우슈마이어 지음, 한선용 옮김, "자바스크립트를 말하다", 한빛미디어, 244~248p

더글라스 크락포드 지음, 김명신 옮김, "더글라스 크락포드의 자바스크립트 핵심 가이드", 한빛미디어

TYPO3 compatibility regression in Nightly

https://bugzilla.mozilla.org/show_bug.cgi?id=883914#c13

DCU Bank fails to display any accounts on "Accounts" page, in Nightly

https://bugzilla.mozilla.org/show_bug.cgi?id=881782

Array.prototype.values() compatibility hazard

https://esdiscuss.org/topic/array-prototype-values-compatibility-hazard

MDN Web docs, "with"

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/with

Are there legitimate uses for JavaScript's "with" statement?

https://stackoverflow.com/questions/61552/are-there-legitimate-uses-for-javascripts-with-statement

JavaScript’s with statement and why it’s deprecated

https://2ality.com/2011/06/with-statement.html