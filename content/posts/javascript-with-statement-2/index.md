---
title: JS 탐구생활 - 말썽쟁이 with문과 Symbol.unscopables 연대기
date: "2024-07-05T01:00:00Z"
description: "with문이 실제로 문제를 일으킨 적이 있었다. 그 이유와 그 이후에 대해 알아보자."
tags: ["javascript"]
---

![썸네일](./thumbnail.png)

# 시작

`with`문은 Javascript 1.0부터 있었던 오래된 문법이다. Javascript의 예전 자료들을 보다 보면 "권장되지 않는다"는 문구로 자주 등장한다. 그래서 [이전 글](https://witch.work/posts/javascript-with-statement)에서 `with`가 대체 어떤 문법이며 무엇이 문제였는지 간단히 알아보았다.

그런데 [이 `with`문의 약점](https://witch.work/posts/javascript-with-statement#32-%EC%BD%94%EB%93%9C%EC%9D%98-%EC%B7%A8%EC%95%BD%EC%84%B1)이 실제로 문제가 된 적이 있었다. 이 문제가 ES6가 되어서야 나온 '잘 알려진 심볼'중 하나인 `Symbol.unscopables`라는 심볼이 등장하게 되는 계기였다. 

Javascript 1.0부터 있었던 `with`는 Javascript의 극초기 이후에는 단 한순간도 권장되었던 적이 없음에도, 이렇게 나온지 10년이 넘게 지나서 영향을 미치게 된 것이다! 정말 신기한 일이었다. 따라서 `with`에 대해 대략적으로 알아본 이전 글에 이어서 이제는 자료조차 찾기 힘들게 된 `with`문이 어떻게 문제가 되었고 그 이후에 어떤 일이 있었는지, 좀 더 자세히 알아보았다.

# 1. 발단 - keys, values, entries 메서드의 등장

[2012년 11월 TC39(Javascript 표준을 제작하는 기술 위원회)회의](https://github.com/rwaldron/tc39-notes/blob/master/meetings/2012-11/nov-29.md#collection-apis-review)에서 기존의 `Array`, `Map`, `Set`등 컬렉션을 나타내는 자료구조들에 반복자(iterator) API를 어떻게 적용할지에 대한 논의가 있었다. 

그 논의에서 `Array`, `Map`, `Set`의 프로토타입에 `values`, `keys`, `entries` 메서드를 추가하자는 결정이 내려졌고 Allen Wirfs-Brock이 명세에 이를 반영하기로 했다.

```js
.keys()
.values()
.entries()
    -> Array
    -> Map
    -> Set
```

그래서 Firefox는 nightly 버전에 [2012년 12월 `Map.prototype`에 `keys`, `values`, `entries` 메서드를 추가했다.](https://bugzilla.mozilla.org/show_bug.cgi?id=817368) 2013년 5월 23일에는 [`Set.prototype`에 해당 메서드들이 추가되었다.](https://bugzilla.mozilla.org/show_bug.cgi?id=869996)

같은 날인 2013년 5월 23일 [`Array.prototype`에도 해당 메서드들을 추가하려는 시도가 있었다.](https://bugzilla.mozilla.org/show_bug.cgi?id=875433) TC39에서 논의 중에 구현한 것이기 때문에 지금과 반복자 API 형태는 약간 달랐지만 동작은 비슷했다. 이렇게 구현된 Array 메서드들은 Firefox 24 nightly 버전에 포함되었다.

# 2. 문제 - ExtJS와 `Array.prototype.values()`

## 2.1. 문제의 발견

그런데 이렇게 배포된 Firefox 24 nightly 버전에서 문제가 발생하기 시작했다.

[2013년 6월 11일 Firefox 24 nightly 버전에서, DCU라는 은행의 홈페이지에서 로그인을 했을 때 원래는 계좌의 목록이 나와야 하는데 나오지 않는다는 버그가 제보되었다.](https://bugzilla.mozilla.org/show_bug.cgi?id=881782)

[이어 2013년 6월 17일에는 같은 버전에서 TYPO3라는 컨텐츠 관리 시스템(CMS)의 대시보드가 제대로 동작하지 않는다는 버그가 제보되었다.](https://bugzilla.mozilla.org/show_bug.cgi?id=883914) 대시보드 헤더만 나오고 대시보드의 컨텐츠가 나오지 않았다고 한다.

이 버그들의 공통점은 Sencha라는 곳에서 만든 ExtJS라는 Javascript 프레임워크의 코드에서 발생한 문제였다는 것이다.

그리고 사람들의 연구로 `Array.prototype.values()` 메서드가 추가됨으로 인해서 발생한 문제였다는 것도 알려졌다. 해당 메서드를 추가하는 코드를 주석 처리하거나 그 코드에서 `values`를 다른 이름으로 바꾸면 문제가 해결되었기 때문이다. [Brandon Benvie가 이를 확정지었다.](https://bugzilla.mozilla.org/show_bug.cgi?id=883914#c13)

## 2.2. 문제의 원인 탐구

그럼 왜 ExtJS에서 `Array.prototype.values()` 메서드가 문제가 되었을까? 이게 바로 `with`문 때문이었다. [ExtJS의 코드](https://cdn.sencha.com/ext/commercial/4.2.1/ext-all-debug.js) 중에 다음과 같이 `with`문을 사용하는 함수를 생성하는 내용이 있었다.

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
      // action 코드
      // 아마 values를 사용하는 동작
    }
  } catch(e) {
  }
}
```

이 코드가 배포될 때는 코드 압축(minification)이 되어 있었다. 하지만 해당 함수가 만들어진 기반이 문자열을 코드로 변환하는 방식이었기 때문에 `with(values)`의 `values`는 압축되지 않았다. [ExtJS의 압축된 코드](https://cdn.sencha.com/ext/commercial/4.2.1/ext-all.js)를 보면 이를 확인할 수 있다.

[물론 `with`문 내부에서는 식별자가 변수를 참조하는지 아니면 with에 주어진 객체 속성을 참조하는지를 오로지 런타임에만 판단할 수 있기 때문에](https://witch.work/posts/javascript-with-statement#33-%EC%BD%94%EB%93%9C-%EC%95%95%EC%B6%95-%EB%B6%88%EA%B0%80) 문자열 형태로 주어진 코드가 함수로 변환되는 게 아니라 Javascript 코드로 직접 작성된 함수였다고 해도 `with(values)`는 압축될 수 없었을 것이다.

문제는 당시에 배열 메서드 `Array.prototype.values()`가 명세에 새로 추가되었고 Firefox에도 구현되었다는 것이다. 그럼 `with`문 블럭에서는 `values`를 사용하는 코드가 다음과 같이 쓰였을 것이다.

```js
function functionName(arg1, arg2, ...) {
  try {
    with(values) {
      // 대충 values를 사용하는 동작 예시
      values.a=1;
      values.forEach(function() {
        // ...
      });
    }
  } catch(e) {
  }
}
```

그런데 만약 `values`가 배열이었다면 `with`의 본문 블럭에서 `values`를 쓰는 건 원래 의도했던 `values`가 아니라 `values`배열의 프로토타입 체인에 존재하는 `Array.prototype.values()`(즉 `values.values`)를 참조하게 된다. 따라서 의도하지 않은 결과가 나타나서 화면이 제대로 동작하지 않게 된 것이다.

[해당 프레임워크 관련자에 의하면 `with`문은 템플릿 관련 클래스에서 사용자가 정의한 하위 표현식을 처리하기 위해 딱 한 군데에서 사용되었다. 이 프레임워크는 상업용 소프트웨어이기 때문에 모든 고객들에게 패치를 하도록 하는 비용을 감수하면서까지 `with`를 제거하는 게 크게 의미가 없어 보였다고 한다.](https://bugzilla.mozilla.org/show_bug.cgi?id=883914#c15)

하지만 그 작은 부분에서 `with` 하나가 쓰였고 또 거기 쓰인 변수명 `values`가 새로운 메서드로 추가된 상황이 생겨서 이렇게 버그가 터져 버린 것이다.

# 3. 해결 - @@unscopables

[이 버그는 Firefox에서 `Array.prototype.values()`를 제거함으로써 일단 해결되었다.](https://bugzilla.mozilla.org/show_bug.cgi?id=875433#c17) 하지만 `Array.prototype.values()`는 ES6 명세에 추가된 메서드였기 때문에 이를 영원히 만들지 않을 수는 없었다.

그리고 다른 브라우저들도 `Array.prototype.values()`를 구현해야 하는 상황이었고 ExtJS는 상당히 많이 쓰이는 프레임워크였기 때문에 다른 브라우저에서도 얼마든지 이런 문제가 발생할 수 있었다. 

조사 과정에서 다른 브라우저에서 해당 에러가 발생했다는 기록을 찾지는 못했다. 하지만 es-discuss에서 토론이 활발하게 진행된 점, TC39 회의에까지 관련 안건이 올라갔으며 다른 브라우저를 대변하는 TC39의 다른 참석자들도 큰 이의 없이 문제에 대한 논의를 진행했다는 점 등을 볼 때 이는 충분히 일반성이 있는 문제였다고 보인다.

## 3.1. 초기의 논의

> [I blame 'with'. So, ex-Borland people at Netscape. And so, ultimately, myself. - Brandan Eich](https://esdiscuss.org/topic/array-prototype-values-compatibility-hazard)

[이 문제는 2023년 6월 17일에 바로 Javascript 문법과 기능에 대해 논의하는 메일링 리스트인 es-discuss에 올라간다.](https://esdiscuss.org/topic/array-prototype-values-compatibility-hazard)

해당 스레드에서는 먼저 다음과 같은 핫픽스 코드가 제안되었다. `with`문의 문법상 객체뿐 아니라 표현식도 주어질 수 있으므로 `with(values)`가 쓰이는 부분을 다음과 같이 바꾸는 건 문제를 일시적으로나마 해결한다. `with(values)`의 본문 내부에서 `values`에 접근할 시 `values.values`에 접근하게 되는 게 문제였는데 이렇게 하면 둘이 같은 값을 갖게 되기 때문이다.

```js
with(values.values=values){
  // values를 사용하는 코드
}
```

하지만 이는 근본적인 문제 해결이 아니었다. 프레임워크 코드에 쓰인 `with`문 때문에 새로운 메서드가 적용된 브라우저에서는 해당 프레임워크를 쓰는 사이트가 제대로 동작하지 않는 게 문제였기 때문이다. 따라서 이번에는 핫픽스를 적용한다고 해도 새로운 배열 혹은 반복자 관련 메서드가 추가될 때마다 같은 문제가 반복될 수 있었다.

또한 그렇다고 일반성을 위해 "`with`에 `values`라는 객체가 주어지면 `values.values`를 참조하게 하라(혹은 어떤 새로운 메서드에 대해서도 같은 방식으로 적용)"는 식으로 표준을 수정하는 것도 이상했다.

## 3.2. TC39 회의

[ExtJS에서 `with`문을 사용하는 코드가 `Array.prototype.values`메서드에서 문제를 일으켰다는 것은 2013년 7월 23일 TC39 회의의 안건으로 올라간다.](https://github.com/rwaldron/tc39-notes/blob/master/meetings/2013-07/july-23.md#43-arrayprototypevalues) ExtJS에서는 해당 이슈를 수정하였지만 해당 프레임워크를 유료로 이용하는 고객들에게 업데이트를 시키고 있는 중이고, 업데이트가 전부 완료될 때까지 `Array.prototype.values()`의 추가는 여러 대규모 사이트를 망가뜨릴 수 있기 때문이었다.

또한 Javascript에는 계속 내장 객체 메서드가 추가될 것이다. 그런데 이런 식으로 `with` 내부에 메서드와 겹치는 변수명이 있을 수 있다는 이유로 `values`같은 흔히 쓰일 만하면서 직관적인 이름들을 객체의 새로운 메서드로 추가할 수 없다면 명백히 좋지 않은 일이었다.심지어 `with`는 deprecated되었는데!

따라서 Brandan Eich는 다음과 같이 새로운 `Array.prototype` 메서드들을 잘 알려진 심볼 기반으로 바꾸거나,

```js
values() -> @@values();
keys() -> @@keys();
entries() -> @@entries();
```

혹은 모듈을 기반으로 import해서 사용하도록 하는 것을 제안했다. 이렇게 할 경우 해당 동작들은 메서드가 아니라 함수가 될 것이었다.

```js
values() -> values([]);
keys() -> keys([]);
entries() -> entries([]);
```

이때 Alex Russell이 메타 속성(`configurable`과 같이 속성 자체가 갖는 속성) `[[withinvisible]]`을 통해 해당 속성이 `with`문에 노출될지 결정하도록 하자고 제안한다. 이 아이디어는 큰 지지를 받는다. 하지만 객체의 모든 속성에 이 메타 속성을 추가하기보다는 `with`문에 잡히지 않는 이름들의 작은 리스트(일명 'blacklist')를 만드는 것이 더 낫다는 논의 또한 진행되었다.

그래서 잘 알려진 심볼로 `@@withinvisible`을 만들고 여기 안에 `values`, `keys`, `entries`를 넣는 것이 좋겠다는 중간 결론이 있었다.

그런데 이렇게 스코프에 잡히지 않는 식별자들의 목록을 만드는 것은 단순히 `with`문 관련해서만이 아니라 DOM의 이벤트 핸들러 등 여러 다른 곳에서도 사용될 수 있기 때문에 좀 더 일반적인 이름을 사용하는 것이 좋겠다는 의견이 나왔다.

Dave Herman이 `@@unscopeable`라는 이름을 제안했고 박수(회의록에는 4명이나 박수를 쳤다고 한다)와 함께 채택되었다.

그리고 [2013년 9월 17일의 TC39 회의](https://github.com/rwaldron/tc39-notes/blob/master/meetings/2013-09/sept-17.md#53-unscopeable)에서는 이게 배열 대신 Set이 되어야 한다고 결정되었다. 여기서의 Set은 Javascript의 Set 자료구조와 같이 어떤 구체적인 자료구조를 칭했다기보다는 배열처럼 특정 원소를 찾기 위해 전체를 순회해야 하는 자료구조가 아니라 특정 원소를 빠르게 찾을 수 있는 자료구조를 일반적으로 칭한 것으로 보인다(이후 구현 등을 고려하면 실질적으로는 `Object.create(null)`과 같이 프로토타입이 없는 객체로 추정).

[2014년 7월 29일 회의](https://github.com/rwaldron/tc39-notes/blob/master/meetings/2014-07/jul-29.md#46-unscopables)에서는 `@@unscopeable`가 실제로는 객체로 구현되는 걸로 확실히 결정되었다. 이외에 프록시, 전역 객체 등 관련된 이슈들에 대한 자세한 논의가 있었는데 이는 위에 링크된 회의록 그리고 [unscopables의 구체적인 동작과 관련된 이슈가 있는 pdf문서](https://github.com/rwaldron/tc39-notes/blob/master/meetings/2014-07/es6-unscopables.pdf)등을 참고할 수 있다.

## 3.3. @@unscopables 구현

2014년 8월 17일, [잘 알려진 심볼 `@@unscopables`가 Firefox nightly에 구현되었다.](https://bugzilla.mozilla.org/show_bug.cgi?id=1054759) 다른 브라우저에서도 비슷한 시기였을 것이다. 

그러나 이때의 구현에는 `Array.prototype[@@unscopables]`가 아직 구현되어 있지 않았다. 이는 [2016년 3월 19일 제보된 에어비앤비 사이트의 일부가 제대로 동작하지 않는 버그의 원인이 되었다.](https://bugzilla.mozilla.org/show_bug.cgi?id=1258140#c4) `Array.prototype[@@unscopables]`은 ES6 명세에 이미 반영되어서 [es6-shim](https://www.npmjs.com/package/es6-shim) 등 호환성 관련 라이브러리에 이미 쓰이고 있었는데 Firefox에서는 아직 구현되어 있지 않았기 때문이다.

따라서 `Array.prototype[@@unscopables]`의 미구현은 에어비앤비 사이트뿐 아니라 [es6-shim](https://www.npmjs.com/package/es6-shim)같은 호환성 관련 라이브러리를 사용하는 모든 사이트를 망가뜨릴 수 있는 잠재적 위험이 있었다.

이로 인해 2016년 3월 19일 당장 문제점이 롤백되었고, [버그 제보로부터 몇 시간 지나지 않아 `Array.prototype[@@unscopables]`가 구현되었다.](https://bugzilla.mozilla.org/show_bug.cgi?id=1258163) 그리고 이게 포함된 버전이 2016년 4월 4일 Firefox 48로 출시되었다.

# 4. 결론

그렇게 1996년 나온 Javascript 1.0부터 있던[^1] `with`문은 만들어진 지 20년 가까이 지나 2013년 `Array.prototype.values()` 메서드의 추가로 인해 문제를 만들었고, 그로부터 또 3년 정도가 지나 2016년 `@@unscopables`가 구현됨으로써 문제가 해결되었다.

한번도 권장된 적 없던 오래된 문법이 이렇게 문제를 일으켰고, 심볼이라는 꽤 최근의 개념을 통해 해결되었다. 이는 Javascript의 역사와 표준화, 또 호환성 문제가 해결되는 과정에 대한 굉장히 흥미로운 사례였다.

# 참고

악셀 라우슈마이어 지음, 한선용 옮김, "자바스크립트를 말하다", 한빛미디어, 244~248p

JavaScript’s with statement and why it’s deprecated

https://2ality.com/2011/06/with-statement.html

TYPO3 compatibility regression in Nightly

https://bugzilla.mozilla.org/show_bug.cgi?id=883914#c13

DCU Bank fails to display any accounts on "Accounts" page, in Nightly

https://bugzilla.mozilla.org/show_bug.cgi?id=881782

`Array.prototype[@@iterator]` should be the same function object as Array.prototype.values

https://bugzilla.mozilla.org/show_bug.cgi?id=875433#c4

Map.prototype.{keys,values,entries}

https://bugzilla.mozilla.org/show_bug.cgi?id=817368

Set.prototype.{keys, values, entries}

https://bugzilla.mozilla.org/show_bug.cgi?id=869996

Convert Array.prototype.@@iterator to use new iteration protocol

https://bugzilla.mozilla.org/show_bug.cgi?id=919948

Implement ES6 Symbol.unscopables

https://bugzilla.mozilla.org/show_bug.cgi?id=1054759

Airbnb "+ More" links jump to top of page instead of showing more content, in recent nightlies (with "TypeError: Array.prototype[W.unscopables] is undefined" appearing in error console)

https://bugzilla.mozilla.org/show_bug.cgi?id=1258140#c4


Implement `Array.prototype[@@unscopables]`

https://bugzilla.mozilla.org/show_bug.cgi?id=1258163


Firefox 20 for developers

https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/20#javascript

Firefox 24 for developers

https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/24#javascript

Firefox 48 for developers

https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/48#javascript

Array.prototype.values() compatibility hazard

https://esdiscuss.org/topic/array-prototype-values-compatibility-hazard

MDN Web docs, "with"

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/with

ECMA, TC39 Meeting Notes, November 29, 2012 Meeting Notes

https://github.com/rwaldron/tc39-notes/blob/master/meetings/2012-11/nov-29.md

ECMA, TC39 Meeting Notes, July 23, 2013 Meeting Notes

https://github.com/rwaldron/tc39-notes/blob/master/meetings/2013-07/july-23.md

ECMA, TC39 Meeting Notes, September 17, 2013 Meeting Notes

https://github.com/rwaldron/tc39-notes/blob/master/meetings/2013-09/sept-17.md#53-unscopeable

ECMA, TC39 Meeting Notes, July 29, 2014 Meeting Notes

https://github.com/rwaldron/tc39-notes/blob/master/meetings/2014-07/jul-29.md#46-unscopables

[^1]: Javascript는 매우 급하게 만들어져서 언어의 첫 구현(Mocha라고 불렸다)은 고작 10일만에 이루어졌다. 그리고 Javascript 1.0 이전까지 몇 달 간 넷스케이프 네비게이터에 넣기 위한 재정비의 시간이 있었는데 `with`는 이때 들어갔다. 따라서 Javascript 1.0부터 있었다고 해서 `with`가 Javascript의 '완전한 처음부터' 있었다는 말은 적절하지 않을 수 있다.