---
title: JS 탐구생활 - NaN은 왜 자기 자신과도 다를까?
date: "2024-08-18T00:00:00Z"
description: "NaN은 자기 자신과도 다르다. 이 이유는 CS에 닿아 있다."
tags: ["javascript", "CS"]
---

![썸네일](./thumbnail.png)

# 요약

- `NaN`은 "Not a Number"의 약자로 숫자 타입의 특수한 값이며 자기 자신과도 다르다는 특이한 특성이 있다.
- 이런 NaN의 특성은 부동 소수점 표준인 IEEE 754에서 정의한 것이다.
- IEEE 754에서 이런 결정을 한 이유는 당시에 isNaN이 없었기에 NaN을 감지할 수 있는 방법이 필요했기 때문이다.

# NaN

## 개요

`NaN`은 "Not a Number"의 약자로, 숫자가 아님을 나타내는 특수한 값이다. Javascript에서는 숫자를 파싱하는 데에 실패했을 경우, 수학적으로 제대로 수행될 수 없는 연산을 수행했을 경우 등등에 `NaN`이 반환된다.

```js
Math.sqrt(-1); // NaN
parseInt('hello'); // NaN
```

NaN이 나올 수 있는 더 많은 경우들은 [MDN의 NaN 공식 문서](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN)에서 볼 수 있다.

## 특이한 특성

NaN에는 여러 특이한 특성들이 있다. 그런데 그 중 가장 유명하고 특이한 특성은 바로 자기 자신과도 다르다는 것이다.

```js
const x = NaN;
x === NaN; // false
```

이렇게 자기 자신과 다른 값은 NaN 뿐이기 때문에 NaN인지 확인할 때 이 특성을 이용할 수도 있다.

```js
function checkIsNaN(value) {
  return value !== value;
}
```

# 왜 이렇게 되었을까?

NaN의 이런 특성은 MDN의 공식 문서나 꽤 유명한 [Javascript 튜토리얼 사이트](https://ko.javascript.info/number)에도 나와 있는 나름 널리 알려진 사실이다. 그런데 `NaN`은 어쩌다 이렇게 되었을까?

## IEEE 754 표준

그건 부동 소수점의 비트 표현을 정의하는 표준인 IEEE 754에서 그렇게 지정했기 때문이다. [인터넷에서 찾을 수 있는 IEEE 754 문서](https://iremi.univ-reunion.fr/IMG/pdf/ieee-754-2008.pdf)를 찾아서 보면 이렇게 자기 자신과도 다른 NaN의 동작이 잘 정의되어 있다.

IEEE 754-2008의 섹션 5.11 "Details of comparison predicates"에는 다음과 같은 내용이 있다.

> 다음 네 가지 상호 배타적인 관계가 가능하다: less than, equal, greater than, unordered. 마지막 경우는 적어도 하나의 피연산자가 NaN일 때 발생한다. NaN은 어떤 값과 비교해도 순서가 없으며 이는 그 자신에 대해서도 적용된다.

그리고 Javascript의 숫자는 모두 IEEE 754의 64비트 부동 소수점 숫자이기 때문에 이 표준을 따라야 한다. 따라서 모든 관계 연산자(`<`, `>`, `<=`, `>=`)에 대해 `NaN`이 피연산자로 사용될 경우 결과는 `false`가 된다. 또한 `NaN`은 모든 비교 연산자(`==`, `===`, `!=`, `!==`)에 대해 자기 자신을 포함한 모든 값과 같지 않다. 이 문구에 의해 `NaN === NaN`은 `false`가 된다.

물론 대부분의 Javascript 엔진에서는 내부적으로 부동 소수점 숫자와 정수를 구별하는 최적화를 한다. 하지만 공식적으로는 Javascript의 모든 숫자가 IEEE 754의 부동 소수점이기 때문에 NaN이 자기 자신과 다르다는 IEEE 754의 정의를 따라야 한다.

## IEEE 754에서 이렇게 결정한 이유

Javascript에서 NaN이 자기 자신과 같지 않다고 정의한 건 IEEE 754 때문이다. 그럼 IEEE 754에서는 왜 NaN이 자기 자신과 같지 않다고 정의했을까?

이에 대해서는 IEEE 754 위원 중 한 명이었던 [Stephen Canon이 스택오버플로우에 남긴 답변](https://stackoverflow.com/a/1573715) 그리고 [IEEE 754에 관한 Kahan의 강의 노트](https://faculty.cc.gatech.edu/~hyesoon/spr09/ieee754.pdf)를 참고할 수 있다.

이런 문서들을 보면 이렇게 된 이유는 2가지가 있다고 한다.

1. `x == y`의 결과는 `x - y == 0`과 가능하면 같아야 한다.

이는 수학적으로 당연히 맞는 말이다. 하지만 IEEE 754 위원회는 표준을 정의하면서 몇몇 수학적인 규칙들을 포기해야 했는데(예를 들어 덧셈의 결합법칙), 이 규칙은 지키려고 했다.

수학적인 이유 때문만은 아니고 하드웨어에 비교를 구현할 때 공간 최적화를 위해서 그랬다고 한다. 표준 개발 당시에는 하드웨어 최적화가 매우 중요한 문제였다.

`NaN - NaN == 0`은 `NaN == 0`이 되어 false이기 때문에 위의 규칙에 따르면 `NaN == NaN`은 false가 되어야 한다. 단 이 규칙에는 다른 예외들이 이미 있었기 때문에 제일 큰 이유는 아니었다고 한다.

2. `isNaN`의 정의 없이도 NaN을 감지해서 계산을 멈출 수 있는 방법이 필요했다.

> NaN들을 제거할 방법이 없다면 그건 CRAY의 Indefinite 값만큼이나 쓸모가 없을 것이다(당시 존재하던 CRAY라는 프로세서 계열에 존재하던 값인 듯 하다). NaN을 만나는 순간, 확실하지 않은 결과에 도달하기 위해 무한정 계산을 계속하기보다는 계산을 멈추는 것이 최선일 것이다. 이러한 이유로 NaN에 대한 어떤 연산은 NaN이 아닌 결과를 반환해야 한다. 어떤 연산을 그 용도로 쓸 것인가?
> (중략)
> 선택된 예외는 C의 구문 `x == x`와 `x != x`이다. 이들은 모든 무한을 포함하는 모든 숫자 `x`에 대해 각각 1과 0이지만 x가 Not a Number(NaN)일 때는 반대의 결과가 된다. 이들은 NaN과 IsNaN(x) 구문이 없는 언어에서도 NaN과 숫자를 구분하는 단순한 방법을 제공한다.
>
> William Kahan, Lecture Notes on the Status of IEEE 754, Page 8

수학적인 연산 시 NaN이 피연산자로 사용될 경우 결과는 `NaN ** 0`(`**`연산자가 있는 Javascript 기준)을 제외하고는 모두 NaN이 된다. 따라서 연속적으로 계산을 할 경우 NaN 값은 계속 전파된다. 하지만 이렇게 NaN을 계속 전파하면서 계산하는 것보다는 NaN이 감지될 시 계산을 멈추는 것이 더 효율적이다.

따라서 어떤 구문이나 함수가 있어서, NaN을 연산했을 때 NaN을 전파하는 대신 NaN이 아닌 어떤 결과를 내놓아서 계산 과정에서 NaN을 감지할 수 있도록 해야 했다.

그런데 당시에 IEEE 754의 토대가 된 Intel 8087 프로세서 설계상의 수학적인 모델에서는 NaN을 감지할 수 있는 `isNaN`이 없었다. `isNaN`을 표준에 포함시킬 수도 있었지만 그렇게 표준을 만들고 모든 언어와 프로세서에서 이를 구현하도록 하는 데에는 오랜 시간이 걸릴 것이었다.

따라서 IEEE 754 위원회에서는 프로그래밍 언어가 `isNaN`을 지원하는지 여부에 상관없이 NaN을 감지할 수 있는 방법이 필요했다.

이를 위해서 택해진 게 `x == x`와 `x != x`였다. 일반적으로 모든 값은 자기 자신과 같으므로 `x == x`는 true, `x != x`는 false가 된다. 그런데 NaN에서는 이를 반대로 정의하여 `x == x`는 false, `x != x`는 true가 되는 유일한 값이 되게 했고 이를 통해 NaN을 감지할 수 있게 했다.

물론 이상적으로는 표준에 `isNaN`을 포함시키는 것이 좋았겠지만 그렇게 되면 실용화까지 너무 오래 걸리리라는 판단이 있었다고 한다.

# 추가적인 정보

## NaN의 특이한 특성

NaN에는 여러 특이한 특성이 있다. MDN의 공식 문서에서 NaN의 연산과 관련된 부분만 가져오면 다음과 같다.

- NaN이 비트 연산을 제외한 수학적인 연산의 피연산자가 될 경우 결과는 일반적으로 NaN이다.(`NaN ** 0` 제외)
- NaN이 관계 연산자(`<`, `>`, `<=`, `>=`)의 피연산자가 될 경우 결과는 언제나 `false`이다.
- NaN은 모든 비교 연산자(`==`, `===`, `!=`, `!==`)에 대해 자기 자신을 포함한 모든 값과 같지 않다.

세번째 특성에 따라 `NaN === NaN`은 `false`가 된다. 즉 NaN은 Javascript에서 자기 자신과도 다른 유일한 값이다.

첫번째 특성의 경우 오류를 발생시키지 않고 NaN을 전파하도록 한다. 이는 NaN의 원래 목적이 연산 중에 잘못된 게 있을 때 오류를 바로 발생시키는 대신 NaN을 전파하는 것이었기 때문이다. 그래서 요즘은 거의 쓰이지 않지만 원래는 연산에서 NaN이 처음 발생한 시점에 INVALID OPERATION 플래그를 세우도록 하는 부분도 표준에 있었다.

두번째 특성의 경우 NaN이 피연산자로 사용된 비교는 늘 unordered이기 때문에 나왔다. 가령 `NaN < x`의 경우 x가 어떤 값이든, NaN이 그보다 작다고 할 수 없기 때문이다. 마찬가지로 어떤 값에 대해서든 NaN이 그보다 크다고 할 수도 없다. 그래서 이런 비교는 언제나 `false`가 된다.

## NaN의 확인 방법들

Javascript에서 연산을 하다가 어떤 값이 NaN인지 확인해야 한다면, `x === NaN`으로 확인할 수는 없다. 앞서 보았듯이 NaN은 자기 자신과도 같지 않기 때문이다.

```js
const x = NaN;
x === NaN; // false
```

대신 `Number.isNaN`이나 `isNaN`을 사용해야 한다. 주의할 점은 이 둘의 동작 방식이 다르다는 것이다.

`isNaN`은 주어진 값을 숫자로 형변환한 후 `NaN`인지 확인한다. 그래서 숫자가 아닌 값에 대해서는 직관적이지 않은 결과를 낼 수 있다. 숫자로 변환했을 때 `NaN`이면 `true`를 반환하기 때문이다.

```js
isNaN(NaN); // true
isNaN("witch"); // true
isNaN(undefined); // true
isNaN({}); // true
```

반면 `Number.isNaN`은 주어진 값이 현재 `NaN`인지 확인하여 좀 더 정확한 결과를 낸다.

```js
Number.isNaN(NaN); // true
Number.isNaN("witch"); // false
Number.isNaN(undefined); // false
Number.isNaN({}); // false
```

혹은 앞서 본 것처럼 자기 자신과 같지 않은 유일한 값이라는 특성을 이용해 `x !== x`로도 확인할 수 있다. ES2015 이전의 Javascript에서는 `Number.isNaN`이 없었으므로 이 방법이 많이 쓰였다.

```js
function checkIsNaN(value) {
  return value !== value;
}
```

## NaN의 비트 패턴

NaN은 IEEE 754 상에서 지수부 `0x7ff`와 모두 0은 아닌 가수부로 이루어진 값으로 정의된다. 일반적으로 가수부의 첫번째 비트만 1인 값이 대부분 언어에서 NaN으로 쓰인다. 따라서 typed 배열을 이용하면 다른 값을 가진 NaN을 만들 수도 있다. 이건 MDN 문서의 코드를 가져온 것이다.

```js
const float2bit = (x) => new Uint8Array(new Float64Array([x]).buffer);
const bit2float = (x) => new Float64Array(new Uint8Array(x).buffer)[0];

const nan1 = float2bit(NaN);

// 가수부의 첫번째 비트를 1로 바꾸면 비트 패턴은 다르지만 여전히 NaN이다.
nan1[0] = 1;
const nan2 = bit2float(nan1);
console.log(nan2); // NaN
```

하지만 Javascript에서는 `NaN`을 위해 하나의 값(지수부 `0x7ff`, 가수부 `0x8000000000000`)만 사용한다. [따라서 NaN의 기준을 만족하는 비트 패턴이 많이 남는데 이를 이용해서 다른 값들을 저장하는 NaN boxing이라는 기법도 있다.](https://witch.work/posts/javascript-trip-of-js-value-tagged-pointer-nan-boxing#4-nan-boxing-%EA%B0%9C%EC%9A%94)

# 참고

악셀 라우슈마이어 지음, 한선용 옮김, "자바스크립트를 말하다", 한빛미디어

IEEE Std 754-2008, "IEEE Standard for Floating-Point Arithmetic"

[William Kahan, "Lecture Notes on the Status of IEEE 754"](https://faculty.cc.gatech.edu/~hyesoon/spr09/ieee754.pdf)

MDN, "NaN"

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN

Why is NaN not equal to NaN?

https://stackoverflow.com/questions/10034149/why-is-nan-not-equal-to-nan

What is the rationale for all comparisons returning false for IEEE754 NaN values?

https://stackoverflow.com/questions/1565164/what-is-the-rationale-for-all-comparisons-returning-false-for-ieee754-nan-values

The stupid thing about IEEE NaN is that it's not equal to itself

https://news.ycombinator.com/item?id=9060796