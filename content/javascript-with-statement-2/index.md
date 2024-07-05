---
title: JS 탐구생활 - 말썽쟁이 with문과 Symbol.unscopables 연대기
date: "2024-07-05T01:00:00Z"
description: "with문이 실제로 문제를 일으킨 적이 있었다. 그 이유와 그 이후에 대해 알아보자."
tags: ["javascript"]
---

![썸네일](./thumbnail.png)

# 이 글은 작성 중입니다.

`with`문은 Javascript 1.0부터 있었던 오래된 문법이다. Javascript의 예전 자료들을 보다 보면 "권장되지 않는다"는 문구로 자주 등장한다. 그래서 [이전 글](https://witch.work/posts/javascript-with-statement)에서 `with`가 대체 어떻게 동작하는 녀석이고 무엇이 문제였는지 간단히 알아보았다.

그런데 이 `with`문이 실제로도 문제를 일으킨 적이 있었다. 이 문제가 상대적으로 최근인 `Symbol.unscopables`라는 심볼이 등장하게 되는 계기가 되기도 했다. Javascript 1.0부터 있었던 이 문법이 어떻게 ES6에서 나온 잘 알려진 심볼까지 만들게 한 것인지 궁금했다.

따라서 이전 글에 이어, 이제는 자료조차 찾기 힘들게 된 `with`문이 어디서 시작해서 어떻게 문제가 되었고 그 이후에는 어떤 일이 있었는지, 샅샅이 알아보았다.

# 발단

2012년 11월 TC39(Javascript 표준을 제작하는 기술 위원회)회의에서 기존의 Map, Set, Array등에 이터레이터 API를 어떻게 적용할지에 대한 논의가 있었다. 그 과정에서 `Array`, `Map`, `Set`의 프로토타입에 `values`, `keys`, `entries` 메서드를 추가하기로 결정되었다. [해당 회의록](https://github.com/rwaldron/tc39-notes/blob/master/meetings/2012-11/nov-29.md#collection-apis-review)

```js
.keys()
.values()
.entries()
    -> Array
    -> Map
    -> Set
```

그래서 Firefox 브라우저는 [2012년 12월 `Map.prototype`에 `keys`, `values`, `entries` 메서드를 추가했다.](https://bugzilla.mozilla.org/show_bug.cgi?id=817368) 2013년 5월 23일에는 [`Set.prototype`에 해당 메서드들이 추가되었다.](https://bugzilla.mozilla.org/show_bug.cgi?id=869996)

같은 날인 2013년 5월 23일 [`Array.prototype`에도 해당 메서드들을 추가하려는 시도가 있었다.](https://bugzilla.mozilla.org/show_bug.cgi?id=875433) TC39에서 논의 중에 구현한 것이기 때문에 지금과 이터레이터 API 형태는 약간 달랐지만 동작은 비슷했다. 이렇게 구현된 Array 메서드들은 Firefox 24 nightly 버전에 포함되었다.

# 문제

## 문제의 발견

그런데 이렇게 배포된 Firefox 24 nightly 버전에서 문제가 발생하기 시작했다.

[2013년 6월 11일 Firefox 24 nightly 버전에서, DCU라는 은행의 홈페이지에서 로그인을 했을 때 원래는 계좌의 목록이 나와야 하는데 나오지 않는다는 버그가 제보되었다.](https://bugzilla.mozilla.org/show_bug.cgi?id=881782)

[이어 2013년 6월 17일에는 같은 버전에서 TYPO3라는 컨텐츠 관리 시스템(CMS)의 대시보드가 제대로 동작하지 않는다는 버그가 제보되었다.](https://bugzilla.mozilla.org/show_bug.cgi?id=883914) 대시보드 헤더만 나오고 대시보드의 컨텐츠가 나오지 않았다고 한다.

이 버그들의 공통점은 Sencha라는 곳에서 만든 ExtJS라는 Javascript 프레임워크의 코드에서 발생한 문제였다는 것이다.

그리고 사람들의 연구로 `Array.prototype.values()` 메서드가 추가됨으로 인해서 발생한 문제였다는 것도 알려졌다. 해당 메서드를 추가하는 코드를 주석 처리하거나 그 코드에서 `values`를 다른 이름으로 바꾸면 문제가 해결되었기 때문이다. [Brandon Benvie가 이를 확정지었다.](https://bugzilla.mozilla.org/show_bug.cgi?id=883914#c13)

## 문제의 원인 탐구

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

이는 라이브러리 코드이므로 배포될 때는 코드 압축(minification)이 되어 있었다. [하지만 `with`문 내부에서는 식별자가 변수를 참조하는지 아니면 with에 주어진 객체 속성을 참조하는지를 오로지 런타임에만 판단할 수 있기 때문에](https://witch.work/posts/javascript-with-statement#33-%EC%BD%94%EB%93%9C-%EC%95%95%EC%B6%95-%EB%B6%88%EA%B0%80) 위 코드에서 `values`라는 변수명은 압축되지 않았다. [ExtJS의 압축된 코드](https://cdn.sencha.com/ext/commercial/4.2.1/ext-all.js)를 보아도 `with(values)` 부분은 압축되지 않은 것을 확인할 수 있다.

물론 해당 함수가 만들어진 기반이 문자열이기 때문에 원래부터 압축될 수 없었기는 하다. 하지만 만약 함수가 이미 구성된 형태로 쓰였다고 해도 `with(values)`는 압축될 수 없었을 것이다.

문제는 당시에 배열 메서드 `Array.prototype.values()`가 Firefox에 새로 추가되었다는 것이다. `with`문의 특성상 `with`문 블럭에서는 `values`를 사용하는 코드가 다음과 같이 쓰였을 것이다.

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

[해당 라이브러리의 관련자에 의하면 `with`문은 템플릿 관련 클래스에서 사용자가 정의한 하위 표현식을 처리하기 위해 딱 한 군데에서 사용되었기에 모든 패치를 감수하면서까지 `with`를 제거하는 게 크게 의미가 없어 보였다고 한다.](https://bugzilla.mozilla.org/show_bug.cgi?id=883914#c15) 하지만 그 작은 부분에서 `with` 하나가 쓰였다고 이렇게 버그가 터져 버렸다.

# 문제의 해결 - @@unscopables

[이 버그는 Firefox에서 `Array.prototype.values()`를 제거함으로써 일단 해결되었다.](https://bugzilla.mozilla.org/show_bug.cgi?id=875433#c17) 하지만 `Array.prototype.values()`는 ES6에서 정식으로 추가된 메서드였기 때문에 이를 영원히 만들지 않을 수는 없었다.

## 초기의 논의

> [I blame 'with'. So, ex-Borland people at Netscape. And so, ultimately, myself. - Brandan Eich](https://esdiscuss.org/topic/array-prototype-values-compatibility-hazard)

[이는 2023년 6월 17일에 바로 Javascript 문법과 기능에 대해 논의하는 메일링 리스트인 es-discuss에 올라간다.](https://esdiscuss.org/topic/array-prototype-values-compatibility-hazard)

해당 스레드에서는 먼저 다음과 같은 핫픽스 코드가 제안되었다. `with`문의 문법상 객체뿐 아니라 표현식도 주어질 수 있으므로 `with(values)`가 쓰이는 부분을 다음과 같이 바꾸는 건 문제를 일시적으로나마 해결한다. `with(values)`의 본문 내부에서 `values`에 접근할 시 `values.values`에 접근하게 되는 게 문제였는데 이렇게 하면 둘이 같은 값을 갖게 되기 때문이다.

```js
with(values.values=values){
  // values를 사용하는 코드
}
```

하지만 이는 근본적인 문제 해결이 아니었다. 라이브러리 코드에 쓰인 `with`문 때문에 새로운 메서드가 적용된 브라우저에서는 해당 라이브러리를 쓰는 사이트가 제대로 동작하지 않는 게 문제였기 때문이다. 따라서 이번에는 핫픽스를 적용한다고 해도 새로운 배열 혹은 이터레이터 메서드가 추가될 때마다 같은 문제가 반복될 수 있었다.

또한 그렇다고 일반성을 위해 "with에 `values`(혹은 어떤 새로운 메서드 이름)라는 객체가 주어지면 `values.values`를 참조하게 하라"는 식으로 표준을 수정하는 것도 이상했다.

## TC39 회의

[ExtJS에서 `with`문을 사용하는 코드가 `Array.prototype.values`메서드에서 문제를 일으켰다는 것은 2013년 7월 23일 TC39 회의의 안건으로 올라간다.](https://github.com/rwaldron/tc39-notes/blob/master/meetings/2013-07/july-23.md#43-arrayprototypevalues) ExtJS에서 해당 이슈를 수정하였지만 해당 프레임워크를 유료로 이용하는 고객들에게 업데이트를 시키고 있는 중이고, 업데이트가 전부 완료될 때까지 `Array.prototype.values`의 추가는 여러 대규모 사이트를 망가뜨릴 수 있다는 것이다.

그런데 `with`문처럼 deprecated된 문법으로 인한 문제 때문에 `values`같은 흔히 쓰일 만한 이름들을 객체의 새로운 메서드로 추가할 수 없어지는 것은 좋지 않았다. 새로운 객체 메서드는 당연히 그 동작을 나타낼 수 있는 적절한 이름을 갖는 게 좋고 이는 상식적으로 흔히 쓰일 만한 이름일 가능성이 높기 때문이다.

따라서 Brandon Eich는 다음과 같이 새로운 `Array.prototype` 메서드들을 잘 알려진 심볼 기반으로 바꾸거나,

```js
values() -> @@values();
keys() -> @@keys();
entries() -> @@entries();
```

혹은 모듈을 기반으로 사용하도록 하는 것을 제안했다. 이렇게 할 경우 메서드가 아니라 함수가 될 것이었다.

```js
values() -> values([]);
keys() -> keys([]);
entries() -> entries([]);
```

이때 Alex Russell이 메타 속성(`configurable`과 같이 속성 자체가 갖는 속성) `[[withinvisible]]`을 통해 해당 속성이 `with`문에 노출되는지 결정하는 것을 제안한다. 이 아이디어는 큰 지지를 받는다. 하지만 객체의 모든 속성에 이 메타 속성을 추가하기보다는 `with`문에 잡히지 않는 이름들의 작은 리스트를 만드는 것이 더 낫다는 논의 또한 진행되었다.

그래서 잘 알려진 심볼 `@@withinvisible`을 만들고 여기 안에 `values`, `keys`, `entries`를 넣는 것이 좋겠다는 중간 결론이 있었다. 그런데 이렇게 스코프에 잡히지 않는 식별자들의 목록을 만드는 것은 단순히 `with`문 관련으로만이 아니라 DOM의 이벤트 핸들러 등 여러 다른 곳에서도 사용될 수 있기 때문에 좀 더 일반적인 이름을 사용하는 것이 좋겠다는 의견이 나왔다.

Dave Herman이 `@@unscopeable`라는 이름을 제안했고 박수(회의록에는 4명이나 박수를 쳤다고 한다)와 함께 채택되었다. 그리고 [2013년 9월 17일의 TC39 회의](https://github.com/rwaldron/tc39-notes/blob/master/meetings/2013-09/sept-17.md#53-unscopeable)에서는 이게 배열 대신 Set이 되어야 한다고 결정되었고 [2014년 7월 29일 회의](https://github.com/rwaldron/tc39-notes/blob/master/meetings/2014-07/jul-29.md#46-unscopables)에서는 `@@unscopeable`가 실제로는 객체로 구현되는 걸로 결정되었다.

이외에 프록시, 전역 객체 등 관련된 이슈들에 대한 자세한 논의가 있었는데 이는 위에 링크된 회의록 그리고 [unscopables의 구체적인 동작과 관련된 이슈가 있는 pdf문서](https://github.com/rwaldron/tc39-notes/blob/master/meetings/2014-07/es6-unscopables.pdf)등을 참고할 수 있다.

## @@unscopables 구현과 해결

2014년 8월 17일, [잘 알려진 심볼 `@@unscopables`가 Firefox nightly에 구현되었다.](https://bugzilla.mozilla.org/show_bug.cgi?id=1054759) 다른 브라우저에서도 비슷한 시기였을 것이다. 

그러나 이때의 구현에는 `Array.prototype[@@unscopables]`가 아직 구현되어 있지 않았다. 이는 [2016년 3월 19일 제보된 에어비앤비 사이트의 일부가 제대로 동작하지 않는 버그의 원인이 되었다.](https://bugzilla.mozilla.org/show_bug.cgi?id=1258140#c4) `Array.prototype[@@unscopables]`은 ES6 명세에 이미 반영되어서 [es6-shim](https://www.npmjs.com/package/es6-shim) 등 호환성 관련 라이브러리에 이미 쓰이고 있었는데 Firefox에서는 아직 구현되어 있지 않았기 때문이다.

따라서 `Array.prototype[@@unscopables]`의 미구현은 에어비앤비 사이트뿐 아니라 [es6-shim](https://www.npmjs.com/package/es6-shim)이라는 호환성 관련 라이브러리를 사용하는 모든 사이트를 망가뜨릴 수 있는 잠재적 위험이 있었다.

이로 인해 2016년 3월 19일 당장 문제점이 롤백되었고, [버그 제보로부터 몇 시간 지나지 않아 `Array.prototype[@@unscopables]`가 구현되었다.](https://bugzilla.mozilla.org/show_bug.cgi?id=1258163) 그리고 이게 포함된 버전이 2016년 4월 4일 Firefox 48로 출시되었다.




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