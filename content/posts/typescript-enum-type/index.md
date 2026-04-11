---
title: TS 탐구생활 - TS의 enum 타입
date: "2023-10-16T00:00:00Z"
description: "TS의 enum type에 대해 알아보자"
tags: ["typescript"]
---

# 1. enum 타입 기본

## 1.1. 기본적인 타입 선언

`enum` 타입은 ts에는 없지만 ts에서 사용되는 값이다. 몇몇 다른 언어에서의 열거형과 같이 여러 상수를 묶어서 하나의 타입으로 정의할 수 있다. 이렇게 하면 Red는 0, Green은 1, Blue는 2와 같이 자동 매핑되어 사용할 수 있다. 이런 식으로 실제 값이 숫자인 enum을 숫자형 enum이라고 한다.

```ts
enum Color {
  Red,
  Green,
  Blue,
}
```

문자열 enum도 있는데 이는 enum의 각 멤버들을 문자열 리터럴 혹은 다른 문자열 enum의 멤버로 상수 초기화해야 한다. 이렇게 하면 디버깅 시 좀 더 확실하고 의미있는 값을 볼 수 있다는 장점이 있다.

```ts
enum Color {
  Red="RED",
  Green="GREEN",
  Blue="BLUE",
}
```

다른 상수를 직접 enum 값으로 매핑할 수도 있다. 만약 숫자를 매핑한 경우 뒤따르는 멤버들은 자동으로 1씩 증가된 값을 매핑받는다. 만약 문자열을 매핑한 경우에는 그 다음 멤버부터는 직접 매핑해야 한다.

```ts
enum Color {
  Red=1,
  Green, // 2
  Blue, // 3
}

enum Direction {
  Up="UP",
  Down="DOWN",
  // 만약 여기서 갑자기 Left, 만 쓰면 "DOWN"다음에 자동 매핑이 일어나지 않으므로 에러가 발생한다
  Left="LEFT",
  Right="RIGHT",
}
```

하지만 이전에 문자열 매핑을 했더라도 이후에 숫자 매핑을 하게 되면 그 이후 멤버는 다시 문자열을 직접 매핑해 줄 때까지 자동으로 숫자 매핑된다. 이런 식으로 문자열과 숫자를 섞어서 쓰는 것을 이종 enum(heterogeneous enum)이라고 하는데 이는 특별히 그렇게 할 이유가 없는 경우 권장되지 않는다.

```ts
// 이종 enum의 예시
enum Test{
    T1=1,
    T2, // 2
    T3="TEMP",
    T4=3,
    T5, // 4
}
```

## 1.2. 계산된 값 넣기

이후 다루겠지만 enum은 결국 JS 객체이다. 때문에 상수뿐 아니라 계산된 값을 넣을 수도 있다.

```ts
enum Color {
  Red=getRed(),
  Green=getGreen(),
  Blue=getBlue(),
}
```

그럼 어떤 경우에 계산된 값으로 취급될까? 상수가 아닐 경우 enum은 계산된 값으로 취급되는데 이 상수란 다음과 같은 것들이다.

1. 리터럴(문자, 숫자)
2. 다른 상수 enum 멤버의 참조
3. 괄호로 묶인 상수 표현식
4. 상수 표현식에 단항 연산자 `+`, `-`, `~`가 붙은 경우
5. 상수 표현식을 이항 연산자 `+`, `-`, `*`, `/`, `%`, `<<`, `>>`, `>>>`, `&`, `|`, `^`의 피연산자로 쓴 경우

즉 위와 같은 값들이 아닌 경우 enum의 멤버는 계산된 값으로 취급되고 이후에 볼 const enum에서도 쓸 수 없다.

```ts
enum Example {
  // 상수 멤버
  Foo=1 + 2,
  Bar=Foo * 2,
  // 계산된 값
  Calc='123'.length
}
```

## 1.3. 사용

enum 타입은 다음과 같이 값 대신으로 사용할 수 있다.

```ts
enum Color {
  Red,
  Green,
  Blue,
}

let c: Color = Color.Green;
```

혹은 함수 인수로 특정 값만 강제하도록 해야 할 때 사용할 수 있다. 이렇게 하면 `changeColor` 함수 내부에서 `color`에는 `Color` 타입의 값만 들어올 수 있다.

```ts
function changeColor(color: Color) {
  console.log(color);
  // ...
}

changeColor(Color.Red);
```

`Color`의 key로 접근해서 실제 enum 멤버의 이름을 얻어낼 수도 있다. 이를 역 매핑이라고 한다.

```ts
function changeColor(color: Color) {
  console.log(Color[color]);
  // ...
}
```

전반적으로 어떤 값의 범주로 제한해야 할 때 사용할 수 있다.

그런데 이런 생각이 들 수 있다. 우리는 이미 이런 기능을 유니언 타입으로 구현할 수 있지 않았나? 다음과 같이 말이다.

```ts
type Color = "Red" | "Green" | "Blue";
```

그렇다면 enum 타입은 어떤 장점이 있을까? 사실 결론부터 말하면 실용적인 엄청난 장점은 없다. 하지만 일단 enum의 원리부터 알아보고 그쪽으로 넘어가 보자.

# 2. enum 타입의 동작

일반적으로 타입 선언과 사용들은 모두 JS 코드로 변환되지 않고 사라졌다. 하지만 enum은 다르다. 다음과 같이 enum을 선언하면 JS 코드로 변환되어 남는다.

## 2.1. enum 타입의 JS 변환

```ts
enum Color {
  Red,
  Green,
  Blue,
}
```

위 타입 선언은 다음과 같이 IIFE로 변환되는 것을 볼 수 있다.

```js
"use strict";
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {}));
```

이는 실제로는 다음과 같은 객체를 만들어서 `0`과 `"Red"`, `1`과 `"Green"`, `2`와 `"Blue"`를 매핑해 놓은 것과 같다.

```js
var Color={
  0: "Red",
  1: "Green",
  2: "Blue",
  Red: 0,
  Green: 1,
  Blue: 2,
}
```

JS에서는 enum을 원래 지원하지 않는데 런타임에 사용할 수 있는 enum과 같은 객체를 만들기 위해서 이런 트리키한 방법이 사용되었다고 생각한다.

그럼 이런 객체를 실제로는 만들지 않도록 할 수는 없을까? `const enum`을 쓰면 가능하다.

## 2.2. const enum

`const enum`을 쓸 시 JS 코드로 변환되지 않고 그냥 값으로 쓰이게 된다.

```ts
// js로 변환 시 const enum 선언은 사라진다. 그리고 이를 사용 시 그냥 Red는 0으로, Blue는 1로 치환되어 사용된다.
const enum Color {
  Red,
  Green,
  Blue,
}
```

숫자 enum의 경우 숫자를 통해서도 해당 enum 멤버를 얻어낼 수 있는 역 매핑이 원래는 가능했다. 하지만 const enum의 경우 이 역 매핑이 불가능하다. 이는 const enum이 컴파일 시점에 사라지기 때문이다.

# 3. enum 타입의 활용

## 3.1. 유니언 타입처럼 사용하기

enum은 값으로 사용할 수도 있지만 일반적으로 타입으로 사용된다. 이는 다음과 같이 사용할 수 있다.

```ts
enum Color {
  Red,
  Green,
  Blue,
}

function changeColor(color: Color) {
  console.log(color);
  // ...
}
```

## 3.2. 브랜딩 속성으로 활용

enum은 브랜딩 속성으로 활용할 수 있다. 브랜딩 속성이란 객체의 구분을 위한 속성을 말한다. 이렇게 브랜드 속성으로 enum 멤버를 쓸 수 있다.

```ts
enum Species{
    PERSON,
    DOG,
}

type Person={
    type:Species.PERSON;
    name:string;
    age:number;
}

type Dog={
    type:Species.DOG;
    name:string;
    age:number;
}

function act(param:Person | Dog){
    if(param.type==Species.PERSON){
        console.log("Hi");
    }
    else{
        console.log("Bark");
    }
}
```

주의할 점은 같은 enum 멤버를 사용해야 확실히 구분할 수 있다는 점이다. 다음과 같이 `PERSON`과 `DOG`가 다른 enum에서 정의되면 둘 다 실제 값은 `0`으로 취급될 것이라서 구분할 수 없다.

```ts
enum Species{
    PERSON,
}

enum Species2{
    DOG,
}
```

물론 직접 값을 정의해 준 경우에는 구분될 것이다.

`const enum`을 쓸 시 JS 코드로 변환되지 않고 그냥 값으로 쓰이게 된다.

```ts
// js로 변환 시 아무 코드도 없다. 그리고 이를 사용 시 그냥 PERSON은 0으로, DOG는 1로 치환되어 사용된다.
const enum Species{
    PERSON,
    DOG,
}
```

# 참고

ts handbook - Enums https://www.typescriptlang.org/ko/docs/handbook/enums.html

TypeScript enums vs. types: Enhancing code readability
https://blog.logrocket.com/typescript-enums-vs-types/#using-enums-reverse-mapping