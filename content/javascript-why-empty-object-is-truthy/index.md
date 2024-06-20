---
title: JS 탐구생활 - JS는 왜 빈 객체를 참으로 평가할까?
date: "2024-06-19T00:00:00Z"
description: "JS에서 객체가 늘 참인 이유"
tags: ["javascript", "history"]
---

![썸네일](./thumbnail.png)

# 이 글은 퇴고 중입니다.

# 1. 시작

처음에 Javascript를 접하고 코드를 짜다 보면, 빈 객체나 빈 배열이 false로 평가될 거라고 예상하고 코드를 짜다가 원치 않는 결과를 얻을 때가 많다. 가령 API의 응답이 객체로 올 경우 빈 응답을 걸러내기 위해 다음과 같은 코드를 짜는 것이다.

```js
const response = await fetch('https://api.example.com');

if (response.data) {
  // data 객체에 프로퍼티가 있을 때만 실행하려는 의도의 코드
  // 그러나 data가 빈 객체일 때도 실행된다.
}
```

하지만 Javascript는 Boolean값이 오는 맥락에서 객체를 늘 true로 평가한다.

[그건 Javascript에서 다음 값들만을 false로 평가하기 때문이다.](https://developer.mozilla.org/ko/docs/Glossary/Falsy) 물론 Opera 브라우저 등 몇몇 플랫폼에서 예외가 있을 수는 있다.

- `null`
- `undefined`
- `false`
- `NaN`
- `0`(-0, 0n)
- `''` (빈 문자열)
- `document.all`

이외의 값들은 모두 true로 평가된다. 즉 객체는 늘 true로 평가되고 빈 객체(`{}`), 빈 배열(`[]`), 심지어 false의 Boolean 래퍼 객체(`new Boolean(false)`)도 true로 평가된다.

어째서 이런 식으로 정했을까? 빈 객체, 하다못해 false의 Boolean 객체라도 false로 평가하는 것이 더 직관적이지 않을까? 아무리 Javascript가 급하게 만들어진 언어라고 하지만 여기에는 이유가 있다. 이제 그 이유를 알아보자.

# 2. Javascript 객체가 늘 참인 이유

이는 2가지의 관점에서 이야기할 수 있다.

먼저 문법적으로 접근해볼 수 있다. 왜 Javascript 객체는 언제나 참인가? 이는 ECMA-262 명세 상에서 Boolean 형변환은 객체를 원시값으로 변환하는 과정을 거치지 않으며 이 동작을 바꿀 수도 없기 때문이다.

그리고 한 단계 더 내려가서 언어 설계의 관점에서 접근해볼 수 있다. 왜 Javascript는 객체의 Boolean 평가를 이런 식으로 설계하여 사용자가 개입할 수 없게 했을까? 이는 불린 연산자 `&&`과 `||`의 동작의 성능을 위해서였다.

이 두 가지 관점을 차례로 살펴보겠다.

## 2.1. 명세의 정의

Javascript에서 `if`문의 조건절 등 Boolean이 예상되는 위치에서는 주어진 값을 먼저 Boolean으로 형변환한다. [이는 ECMA-262 명세에서 `ToBoolean` 추상 연산으로 다음과 같이 정의되어 있다.](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toboolean)

> 7.1.2 ToBoolean(argument)
>
> The abstract operation ToBoolean takes argument argument (an ECMAScript language value) and returns a Boolean. It converts argument to a value of type Boolean. It performs the following steps when called:
> 
> 1. If argument is a Boolean, return argument.
> 2. If argument is one of **undefined, null, +0𝔽, -0𝔽, NaN, 0ℤ**, or the empty String, return **false**.
> 3. If argument is an Object and argument has an `[[IsHTMLDDA]]` internal slot, return **false**.
> 4. Return **true**.

특정 값들 이외에는 모두 true로 변환한다는 걸 알 수 있다. 또한 여기에는 사용자가 재정의할 수 있는 어떤 형변환 메서드도 없다. 애초에 Boolean 형변환은 객체를 원시값으로 변환하려고 시도하는 과정을 거치지 않는다.

> Note: Unlike other type conversions like string coercion or number coercion, boolean coercion does not attempt to convert objects to primitives.
>
> [MDN Web Docs - Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)

따라서 이러한 명세에 따라 Javascript에서 객체는 모두 true로 평가된다. 물론 앞서 보았던 `document.all`이라는 예외가 있기는 하다. 하지만 이는 브라우저에서만 정의되는 호스트 정의 객체이고 아주 예외적인 경우이다.

## 2.2. 의문

조금 생각해 보면 Javascript에서 객체를 Boolean으로 형변환할 때 값의 변환을 전혀 시도하지 않는 것, 그리고 이러한 동작의 재정의조차 허용하지 않고 "특정 값들 이외에는 모두 true로 형변환"으로 정한 것은 이상한 면이 있다.

Javascript는 원래 암시적 타입 변환으로 유명한 언어 아니었던가? 피연산자 혹은 인수의 타입을 암시적으로 변환해서 사용하는 것에서 나오는 기묘한 동작도 한두 가지가 아니다. 가령 다음 Javascript 코드는 객체를 문자열로 변환하여 `'[object Object]'`를 만들고 사용하여 연산의 결과를 만든다.

```js
const obj = {};
console.log(obj + " and some string"); // [object Object] and some string
```

또한 이렇게 객체를 원시값으로 변환하는 동작은 보통 객체 메서드를 통해 이루어지기 때문에 사용자가 재정의 가능하다. 숫자 혹은 문자열이 예상되는 자리에 객체가 쓰였을 때, 잘 알려진 심볼인 `Symbol.toPrimitive` 혹은 객체의 `valueOf`, `toString` 메서드가 호출되어 객체를 원시값으로 변환한다.

```js
const obj = {
  toString() {
    return "I'm Witch";
  },
}

console.log("Hello, " + obj); // Hello, I'm Witch
```

하지만 Boolean이 예상되는 자리에 객체가 쓰였을 때는 이런 객체 -> 원시값 변환을 시도하지 않는다. Boolean으로의 형변환은 어떠한 형변환 메서드도 호출하지 않으며 주어진 값이 특정 값들 중 하나인지만 확인하고 그에 따라 true나 false를 반환한다.

그래서 명세에 정의된 바에 따라 객체는 무조건 true로 형변환되는 걸로 정해져 있다. 그럼 또 질문이 생긴다. "왜 이렇게 정했는가?"

물론 Javascript는 급하게 만든 언어가 맞고 실제로 설계 실수들도 꽤 있었다. 하지만 적어도 이 동작에 대해서는 이유가 있다.

## 2.3. 언어 동작을 이렇게 정한 이유

Boolean 형변환이 이렇게 정의되고 또한 재정의조차 불가능한 이유는 불린 연산자 `&&`, `||`의 성능 문제 때문이다.

[잘 알려져 있다시피 Javascript의 논리 연산자 `||`과 `&&`는 다른 언어에서와 달리 피연산자의 값을 유지한다.](https://ko.javascript.info/logical-operators) `3 && {} && {a:1}`이라면 true나 false가 아니라 논리 연산자의 결과를 내기 위해 마지막으로 평가된 객체 `{a:1}`이 반환되는 것이다. 

이는 바꿔 말하면 논리 연산자의 결과를 만들기 위해서는 같은 객체가 여러 번 Boolean으로 형변환되어야 한다는 뜻이다.

예를 들어 다음과 같은 연산자의 평가 과정을 생각해 보자. 평가를 위해 `falsyValue`가 여러 번 Boolean으로 형변환되어야 한다.

```js
// falsyValue는 false로 평가되는 임의의 값일 때 다음 연산을 평가한다.
falsyValue && value1 && value2 && ... && valueN
// 평가 과정에서 다음과 같이 falsyValue가 여러 번 Boolean으로 형변환된다.
-> falsyValue && value1을 평가하고 falsyValue를 반환
-> falsyValue && value2를 평가하고 falsyValue를 반환
...
-> falsyValue && valueN을 평가하고 falsyValue를 반환
```

원시값의 경우 이렇게 같은 값을 여러 번 형변환해도 크게 문제가 될 게 없다. 하지만 만약 Boolean 형변환이 숫자나 문자열로의 형변환처럼 객체의 메서드 호출을 통해 객체를 원시값으로 변환하는 과정을 갖는다면 이는 성능 비용을 크게 증가시킬 수 있다.

사용자 정의에 따라 형변환을 위해 호출하는 메서드의 비용은 메서드 정의에 따라 매우 커질 수 있는데 불린 메서드 체이닝에서 이 메서드 호출이 반복적으로 일어날 것이기 때문이다. 따라서 ECMAScript 1에서는 객체가 Boolean으로 형변환될 때 항상 true가 되도록 하고 이 동작을 바꿀 수 없도록 했다.

물론 지금의 문법 같으면 형변환을 위한 메서드를 만들고 나서 사용자 재정의가 불가능하게 할 수도 있을 것이다. `writable`, `configurable` 디스크립터를 설정하는 것과 같이 말이다. 하지만 ECMAScript 1 당시에는 당연히 그런 문법이 없었으므로(`ReadOnly`, `DonDelete` 등의 내부 속성이 있기는 했지만 완전하지 않았다)이런 방식으로 구현했던 것이다.

# 3. 추가적인 정보

## 3.1. 객체의 원시값 형변환

앞서 보았듯이 Boolean 형변환은 예외이지만 원시값이 기대되는 자리에 객체가 오게 되면 보통 Javascript는 객체를 원시값으로 변환하려고 시도한다. 이는 명세에서 `ToPrimitive(input[, preferredType])` 추상 연산으로 정의된다. 

에러 처리 같은 부분을 빼고 핵심 로직만 보면 `ToPrimitive`는 input 인수로 객체가 들어왔을 경우 다음과 같이 동작한다.

1. input 객체의 잘 알려진 심볼 `Symbol.toPrimitive`가 있으면 이를 호출하여 반환값이 원시값이면 반환한다.
2. `preferredType`이 `number`일 때 : `input`의 `valueOf`, `toString` 메서드를 차례로 호출하여 반환값이 원시값이면 반환한다.
3. `preferredType`이 `string`일 때 : `input`의 `toString`, `valueOf` 메서드를 차례로 호출하여 반환값이 원시값이면 반환한다.

여기 쓰이는 `Symbol.toPrimitive`, `valueOf`, `toString` 메서드는 모두 사용자가 재정의할 수 있다. 즉 객체가 원시값으로 변환된 결과를 사용자가 정할 수 있다.

```js
const user = {
  name: "김성현",
  age: 25,

  [Symbol.toPrimitive](hint) {
    console.log(hint);
    return hint == "string" ? `name: "${this.name}"` : this.age;
  },
};

console.log(user);
console.log(Number(user)); // number, 25가 찍힘
console.log(String(user)); // string, name: "김성현"이 찍힘

const numberObject = {
  valueOf() {
    return 13245;
  },
}

console.log(Number(numberObject)); // 13245

const stringObject = {
  toString() {
    return "I'm Witch";
  },
}

console.log(String(stringObject)); // "I'm Witch"
```

심지어 객체를 변환 시 객체의 내용이 바뀔 수도 있다. 이를 이용하면 원시값이 필요한 곳에 객체가 사용될 때마다 객체의 내용을 바꿀 수도 있다.

```js
const obj={
  toString(){
    this.b = "witch";
    return "ho";
  },
  cnt: 0,
  valueOf(){
    this.a = this.cnt++;
    return 123;
  }
};

String(obj); // "ho"
console.log(obj.b); // "witch"

console.log(obj + 1); // 124
console.log(obj.a); // 1
console.log(obj + 2); // 125
console.log(obj.a); // 2
```

이런 방식으로 객체를 원시값으로 변환할 때 쓰이는 사용자가 정의할 수 있기에 객체 -> 원시값 변환의 비용은 사용자가 정하기 나름이라고 할 수 있다. 

하지만 Boolean 형변환 같은 경우 이런 식으로 사용자가 개입할 수 있도록 하면 불린 연산자의 체이닝에서 성능의 낭비가 커질 수 있기 때문에 Boolean 형변환은 사용자가 개입할 수 없도록 정해져 있다.

## 3.2. IsHTMLDDA

앞서 본 명세에서 `[[IsHTMLDDA]]` 내부 슬롯을 가지고 있는 객체는 false로 평가된다고 했다. 그럼 이건 뭘까? 이는 웹 호환성을 위해 남아 있는 매우 일부 호스트 객체에만 존재하는 내부 슬롯이다.

이에 대한 내용은 명세의 [B.3.6 The `[[IsHTMLDDA]]` Internal Slot](https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot)에서 찾아볼 수 있다. 이를 번역해 옮기면 다음과 같다.

> `[[IsHTMLDDA]]` 내부 슬롯은 호스트에서 정의한 객체에 존재할 수 있다. `[[IsHTMLDDA]]` 내부 슬롯을 갖는 객체는 `ToBoolean`, `IsLooselyEqual`(주: `==` 연산자를 뜻한다) 추상 연산, `typeof` 연산자의 피연산자로 사용될 때 undefined와 같이 동작한다.
>
> **NOTE**: `[[IsHTMLDDA]]` 내부 슬롯을 갖는 객체는 절대로 이 명세에 의해 정의되지 않는다. 하지만 웹 브라우저의 `document.all` 객체가 이 슬롯을 가지는 호스트 정의 exotic 객체이며 웹 호환성 목적을 위해 존재한다. 이 내부 슬롯을 갖는 것으로 알려진 다른 예시는 없으며 또한 구현체에서는 `document.all`을 제외하고 이 슬롯을 갖는 객체를 만들어서는 안 된다.

이 `[[IsHTMLDDA]]` 내부 슬롯에 대해서는 연관된 다른 글을 하나 더 작성하고 링크를 걸 예정이다.

# 참고

악셀 라우슈마이어 지음, 한선용 옮김, "자바스크립트를 말하다", 한빛미디어, 171~172쪽

MDN Web Docs - JavaScript data types and data structures

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures

MDN Web Docs - 거짓 같은 값

https://developer.mozilla.org/ko/docs/Glossary/Falsy

MDN Web Docs - Boolean

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean

MDN Web Docs - Type coercion

https://developer.mozilla.org/en-US/docs/Glossary/Type_coercion

Why all objects are truthy in JavaScript

https://2ality.com/2013/08/objects-truthy.html

ECMA-262 7.1.1 ToPrimitive

https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toprimitive

ECMA-262 7.1.2 ToBoolean

https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toboolean

ECMA-262 B.3.6 The `[[IsHTMLDDA]]` Internal Slot

https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot

JS 탐구생활 - 비교 연산 2.3. isHTMLDDA

https://witch.work/posts/javascript-compare-different-types#23-ishtmldda

Why is document.all falsy?

https://stackoverflow.com/questions/10350142/why-is-document-all-falsy