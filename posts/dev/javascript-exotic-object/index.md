---
title: JS 탐구생활 - exotic object
date: "2023-08-01T00:00:00Z"
description: "JS의 exotic object는 무엇일까?"
tags: ["javascript"]
---

# 1. 시작

`Object.create`는 인수로 받은 객체를 프로토타입으로 하는 객체를 생성하여 리턴한다.

그리고 Array 객체는 `Array.prototype`이 프로토타입인 객체이다. 그러면 다음 출력 결과는 어떻게 될까?

```js
console.log(Array.isArray(Object.create(Array.prototype)));
```

`Array.prototype`을 상속한 객체가 Array인지 판별하는 것이므로 true가 아닐까? 하지만 답은 false이다.

이유는 exotic object 때문이다. 뭔가 객체의 고유한 내부 동작이 있어서 쉽게 상속 등을 할 수 없는 것이다. 바로 위의 `Array`가 대표적인 exotic object이다.

# 2. JS object

JS에서 객체는 ordinary object와 exotic object로 나뉜다. ordinary object 즉 일반 객체란 우리가 보는 흔한 객체, 그러니까 다음과 같은 것들이다.

```js
{
  a: 1,
  b: 2,
  c: 3
}
```

exotic object, 특수 객체는 이런 일반 객체의 동작과는 다른 동작을 가지고 있는 객체이다. `Array`도 `length`속성이 일반 객체와 다르게 동작하기 때문에 특수 객체이다.

위의 `Array`도 exotic object이고 `Proxy`, `String`, `Arguments` 객체 등이 exotic object이다.

그래서 대체 앞서 말했던 exotic object가 무엇인가? 명세에 의하면 이는 ordinary object가 아닌 객체이므로 ordinary object부터 알아야 한다.

## 2.1. ordinary object

[명세의 ordinary object에 대한 정의를 정리하면 다음과 같다.](https://tc39.es/ecma262/#ordinary-object)

모든 객체에는 필수적으로 구현되어야 하는 essential internal method가 있다. 그리고 어떤 객체든지 이 essential internal method들에 대해서는 구현하고 있어야 한다. 이때 모든 객체가 이런 essential internal method들을 같은 알고리즘으로 구현하고 있을 필요는 없다.

- `[[GetPrototypeOf]]`
- `[[SetPrototypeOf]]`
- `[[IsExtensible]]`
- `[[PreventExtensions]]`
- `[[GetOwnProperty]]`
- `[[DefineOwnProperty]]`
- `[[HasProperty]]`
- `[[Get]]`
- `[[Set]]`
- `[[Delete]]`
- `[[OwnPropertyKeys]]`

그리고 함수 객체들은 다음과 같은 essential internal method들을 구현해야 한다.

- `[[Call]]`
- `[[Construct]]`

ordinary object란 이런 essential internal method들을 특정 기준에 따라 구현한 객체를 말한다. [이 기준들은 모두 명세에 나와 있다.](https://tc39.es/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots)

그리고 이런 기준을 만족하는 객체의 essential internal method는 보통 해당 메서드 이름 앞에 `Ordinary`를 붙인 식으로 정의된다. 예를 들어 [ordinary object의 `[[GetPrototypeOf]]`는 `OrdinaryGetPrototypeOf`로 정의된다.](https://tc39.es/ecma262/#sec-ordinarygetprototypeof)

## 2.2. exotic object

exotic object란 바로 위에서 설명한 ordinary object가 아닌 객체이다. 그런데 위에서 말하기를 essential internal method들은 모든 객체에서 구현되어 있어야 한다고 했다. 

그 말인즉, exotic object에도 해당 메서드들은 구현되어 있지만 ordinary object에서 쓰이는 것과 다른 방식으로 구현되어 있다는 뜻이다.

예를 들어서 [Array Exotic Object](https://tc39.es/ecma262/#array-exotic-object)의 경우 array index를 프로퍼티 키로 가지는 프로퍼티들을 특별하게 취급하며 `length`라는 특별한 속성을 갖는 특수 객체이다. 이 말인 즉슨 나머지는 모두 ordinary object과 같고 `[[DefineOwnProperty]]`내부 메서드의 구현이 다르다는 뜻이다.






그리고 이런 특별한 내부 구현은 사용자가 임의로 조작할 수 없다. 우리는 위에서 `Array.prototype`을 상속하는 것만으로는 `Array.isArray`를 통과할 수 없는 것을 이미 보았다. 

그럼 이런 exotic object를 만들기 위해서는 어떤 방법이 있을까? `new` 혹은 `class` 키워드를 사용해서 exotic object 객체의 인스턴스를 만들었을 경우에 JS엔진이 해당 인스턴스에 exotic object 내부 구현을 연결해준다. 이 부분은 JS 엔진 내부에서 일어나는 동작이기 때문에 이외의 방법은 없다.



# 참고

https://blog.bitsrc.io/exotic-objects-understanding-why-javascript-behaves-so-moody-5f55e867354f

https://ui.toast.com/posts/ko_20221116_1

https://forum.kirupa.com/t/js-tip-of-the-day-exotic-objects/643152

ECMA262 명세 https://tc39.es/ecma262/