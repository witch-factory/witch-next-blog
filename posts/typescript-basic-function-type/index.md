---
title: TS 탐구생활 - TS의 함수 관련 타입과 그 역사
date: "2023-11-20T00:00:00Z"
description: "TS의 Function.prototype에 속한 타입에 대해 알아보자"
tags: ["typescript"]
---

타입스크립트 교과서를 읽다가 TS의 `lib.es5.d.ts`를 직접 열어보게 되었다. 그리고 `Function.prototype`에 속해 있는 `call`, `apply`, `bind` 메서드의 타입을 보았는데 흥미로운 부분이 있어서 글을 쓰게 되었다. 보충할 수 있는 내용이 많겠지만 일단 지금 할 수 있는 만큼 정리해보았다.

# 1. this 유틸리티 타입

글에서 다룰 타입에 쓰이는 this 관련 유틸리티 타입을 먼저 보고 넘어가자. 실제 파일에서는 `Function`타입 다음에 정의되어 있기는 하지만 처음으로 이걸 적는 게 구성상 더 좋다고 생각했다.

## 1.1. ThisParameterType

`ThisParameterType<T>`는 `T` 함수의 `this` 매개변수 타입을 추출한다. `T`의 `this` 매개변수 타입 추론이 실패할 시 unknown이 된다.

```ts
type ThisParameterType<T> = T extends (this: infer U, ...args: never) => any ? U : unknown;
```

이때 함수 매개변수 타입은 반공변성을 가지기 때문에 `...args`가 never가 된다는 건 어떤 매개변수를 가지는 함수라도 매개변수 때문에 해당 타입의 extends 조건으로 걸러지지 않는다는 뜻이다. [실제로 원래 `...args`타입은 `any[]`였는데 더 일반적인 타입을 위해서 never로 고친 커밋이 존재한다.](https://github.com/microsoft/TypeScript/commit/66dba1331ba0a9a27cc35f2901253766ef20d0c5)

## 1.2. OmitThisParameter

앞서 본 `ThisParameterType`을 이용해서 함수의 this 타입을 제거하는 유틸리티 타입이 있다.

```ts
/**
 * Removes the 'this' parameter from a function type.
 */
type OmitThisParameter<T> = unknown extends ThisParameterType<T> ? T : T extends (...args: infer A) => infer R ? (...args: A) => R : T;
```

`ThisParameterType<T>`가 unknown이라는 것은 정의상 함수에 this 타입이 존재하지 않는다는 뜻이므로 그대로 T를 반환하면 된다. 반면 함수에 this 타입이 존재한다면 이 정의로 넘어가게 된다.

```ts
T extends (...args: infer A) => infer R ? (...args: A) => R : T;
```

매개변수들에 타입 추론을 적용할 시 this가 빠진다는 점을 이용해서 infer를 이용해 매개변수들의 타입과 리턴타입을 추론한다. 그리고 그것들을 이용해 다시 함수 타입을 구축하는 방식으로 this가 빠진 타입을 만든다.

# 2. Function

TS에서는 3가지 함수 타입을 정의하고 있다. `Function`, `CallableFunction`, `NewableFunction`이다. 이들은 모두 각각의 메서드 타입들을 정의하고 있는데 이들의 구분과 역사, 그리고 각각의 메서드 타입들에 대해서 알아보자.

`CallableFunction`, `NewableFunction`같은 경우에는 엄격한 타입 정의를 위해서 상당히 복잡한 타입을 사용하고 있다. 이 또한 다음 섹션에서 설명해 보려 한다. 하지만 그전에 먼저 가장 기본형인 Function 타입부터 보도록 하자.

## 2.1. Function 인터페이스

`Function`은 가장 일반적인 함수의 타입을 정의하는 인터페이스이다. 이후 보겠지만 tsconfig.json에서 `strictBindCallApply` 컴파일러 옵션이 false로 설정되어 있을 경우 함수에 적용하는 bind, call, apply 메서드의 타입이 해당 인터페이스의 것으로 적용된다. 해당 옵션의 기본값은 true이므로 일반적으로는 별로 쓰일 일이 없는 타입이다.

```ts
// 
function add(a: number, b: number): number {
    return a + b;
}

// strictBindCallApply:false일 경우 Function 인터페이스의 apply 타입이 적용된다
// strictBindCallApply:true일 경우 CallableFunction 인터페이스의 apply 타입이 적용된다
const addTest = add.apply(null, [1, 2]);
```

해당 인터페이스의 메서드 타입들은 다음과 같이 정의되어 있다. 새로운 this가 될 thisArg 인수와 argArray 인수가 그냥 any로 정의되어 있다. 리턴타입도 any다.

```ts
interface Function {
    apply(this: Function, thisArg: any, argArray?: any): any;
    call(this: Function, thisArg: any, ...argArray: any[]): any;
    bind(this: Function, thisArg: any, ...argArray: any[]): any;
    toString(): string;
    prototype: any;
    readonly length: number;

    // Non-standard extensions
    arguments: any;
    caller: Function;
}

interface FunctionConstructor {
    new(...args: string[]): Function;
    (...args: string[]): Function;
    readonly prototype: Function;
}

declare var Function: FunctionConstructor;
```

`strictBindCallApply:false`일 때 bind, call, apply는 여기의 메서드 타입들을 사용하게 된다. 모두 thisArg, 매개변수, 리턴타입 모두 any이므로 원래 함수의 매개변수 타입이 어땠든 상관없이 call, apply 등을 적용할 수 있다.

```ts
// strictBindCallApply:false일 경우
function fn(x: string) {
  return parseInt(x);
}
// fn의 인수는 string이지만 apply의 인수는 boolean이다. 하지만 apply의 argArray가 any이므로 타입 에러가 발생하지 않는다.
const n = fn.call(undefined, false);

// 원래 fn의 인자보다 많은 수를 넘겨줘도 타입 에러가 발생하지 않는다
fn.call("hi",1,2,3,4,5,6,7);
```

반면 `strictBindCallApply`옵션이 true라면 일반 함수에는 `CallableFunction`의 메서드 타입이, 생성자 함수에는 `NewableFunction`타입이 적용되어 이 인터페이스의 메서드 타입이 쓰이게 되는 일은 잘 없다.

## 2.2. Function 타입의 사용

그럼 `strictBindCallApply` 옵션이 true일 경우 이 타입이 쓰이는 경우는 없을까? `FunctionConstructor`타입을 통해서 그런 경우가 있다는 것을 추측할 수 있었다. 그리고 실험 결과 실제로 그랬다. `new Function()`으로 만들어진 함수가 Function 인터페이스 타입을 가진다.

자주 쓰이는 문법은 아니지만 `new Function(...)`와 같이 함수 생성자를 통해서도 함수를 만들 수 있다. 자세한 문법은 [new Function 문법](https://ko.javascript.info/new-function)을 참고하자. 아무튼 이런 식으로 함수를 생성한 후 bind, call, apply를 적용하면 `strictBindCallApply` 옵션이 true이더라도 Function 타입의 메서드 타입이 적용된다.

```ts
const sum = new Function("a", "b", "return a + b");

// sumApply, sumCall, sumBind는 Function 인터페이스 메서드의 리턴타입에 따라 모두 any 타입이 된다
// 또한 적용된 타입 정의로 이동해 보면 Function 인터페이스의 메서드가 나타난다
const sumApply = sum.apply("global", [1, 2]);
const sumCall = sum.call("global", 1, 2);
const sumBind = sum.bind("global", 1, 2);
```

## 2.3. 이 타입은 왜 이렇게 허술할까?

그런데 이 타입으로 할 수 있는 게 별로 없어 보인다. 별로 타입 검사에 사용될 것도 없는 이런 허술한 타입이 왜 존재하는 것일까? 나름 추측을 해보았다.

[apply, call, bind의 오버로드 타입이 처음 생길 때는 이렇게 허술하지 않았다. 원본 커밋 내역은 아직도 볼 수 있다. 그때는 이런 모습이었다. es5.d.ts도 아니고 core.d.ts에 있었다.](https://github.com/microsoft/TypeScript/commit/5fe84781592a08b5294e01a2fbf42d1def07111d)

```ts
interface Function {
    apply<T,U>(this: (this: T, ...argArray: any[]) => U, thisArg: T, argArray?: any): U;
    apply(this: Function, thisArg: any, argArray?: any): any;
    call<T,U>(this: (this: T, ...argArray: any[]) => U, thisArg: T, ...argArray: any[]): U;
    call(this: Function, thisArg: any, ...argArray: any[]): any;
    bind<T, U>(this: (this: T, ...argArray: any[]) => U, thisArg: T, ...argArray: any[]): (...argArray: any[]) => U;
    bind(this: Function, thisArg: any, ...argArray: any[]): any;

    prototype: any;
    readonly length: number;

    // Non-standard extensions
    arguments: any;
    caller: Function;
}
```

제네릭을 이용해서 thisArg 타입과 원래 함수의 리턴타입을 맞춰 주는 것을 볼 수 있다. 

물론 이 역시 허술한 부분들이 있다. 가령 매개변수 타입은 `any[]`로 허술하게 되어 있는 걸 볼 수 있다. 아마 매개변수의 타입을 엄격하게 검사하기 위한 문법이 아직 없었기 때문이라고 추측한다. [나머지 매개변수를 튜플 타입으로 추론해 주는 기능은 2018년 6월에 나왔다.](https://github.com/microsoft/TypeScript/pull/24897) 또한 [공변성 개념도 2017년 TS 2.6 릴리즈 때서야 제대로 도입되었다.](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-6.html)

하지만 지금의 Function 인터페이스에 비해서는 훨씬 잘 검사해 주는 편이라는 건 누가 보아도 알 수 있다. 그런데 해당 제네릭을 이용한 Function 타입의 call, apply, bind는 어느 날 소리소문없이 사라졌고 Function 타입은 지금처럼 허술해졌다.

그리고 [2018년 9월에 CallableFunction과 NewableFunction 그리고 더 엄격한 call, apply, bind의 타입 정의가 나왔다.](https://github.com/microsoft/TypeScript/pull/27028)

해당 PR 이후 이 허술한 Function 타입이 쓰이는 경우는 앞서 보았던 new Function을 쓰는 경우 혹은 매우 마이너한 `strictBindCallApply` 옵션을 끄는 경우밖에 없어졌다. 이 두 경우 모두 잘 발생하지 않기에 특별한 수정이 없었던 게 아닐까 추측한다.

# 3. CallableFunction

CallableFunction은 `strictBindCallApply` 컴파일러 옵션이 true일 경우에 쓰인다. 우리가 일반적으로 사용하는 호출 가능한 함수에 대한 bind, call, apply 메서드 타입을 제네릭 나머지 매개변수 타입을 이용해서 엄격하게 정의한 것이다.

[앞서 보았던 제네릭 형태의 나머지 매개변수를 튜플 타입으로 추론해 주는 기능의 릴리즈로 인해 나올 수 있었던 기능이다. 해당 기능의 PR에서도 bind, call, apply에 대한 더 강력한 타입 검사를 가능하게 하는 기능이라고 언급하고 있다.](https://github.com/microsoft/TypeScript/pull/24897)

```ts
interface CallableFunction extends Function {
    apply<T, R>(this: (this: T) => R, thisArg: T): R;
    apply<T, A extends any[], R>(this: (this: T, ...args: A) => R, thisArg: T, args: A): R;
    call<T, A extends any[], R>(this: (this: T, ...args: A) => R, thisArg: T, ...args: A): R;
    bind<T>(this: T, thisArg: ThisParameterType<T>): OmitThisParameter<T>;
    bind<T, A extends any[], B extends any[], R>(this: (this: T, ...args: [...A, ...B]) => R, thisArg: T, ...args: A): (...args: B) => R;
}
```

## 3.1. apply, call

위 인터페이스에서 apply, call 메서드의 타입을 보면 다음과 같이 정의되어 있다.

```ts
apply<T, R>(this: (this: T) => R, thisArg: T): R;
apply<T, A extends any[], R>(this: (this: T, ...args: A) => R, thisArg: T, args: A): R;
call<T, A extends any[], R>(this: (this: T, ...args: A) => R, thisArg: T, ...args: A): R;
```

복잡해 보이지만 apply, call이 실제로 어떻게 호출되는지를 생각해 보고 거기에 대응시켜 보자.

```ts
fn.apply(thisArg, [arg1, arg2, ...]);
fn.call(thisArg, arg1, arg2, ...);
```

그러면 this는 apply, call이 적용되는 함수 `fn`이고 thisArg 타입이 T이고 매개변수들인 arg1, arg2...들을 담은 튜플 타입이 A이다. [`...`을 이용해 형성한 나머지 매개변수는 그것들이 묶인 튜플 타입을 가진다.](https://github.com/microsoft/TypeScript/pull/24897) 마지막으로 R은 리턴타입인데 이들은 각각 원래 this의 this타입, 매개변수 타입, 리턴타입과 같도록 선언되어 있다.

즉 여기의 call, apply에서는 해당 메서드가 만들어 리턴하는 새로운 함수가 원래 함수의 this, 매개변수, 리턴 타입을 그대로 따르도록 타입을 정의한 것이다. 그렇지 않으면 타입 에러가 발생한다.

```ts
// strictBindCallApply:true일 경우
function add(a: number, b: number): number {
  return a + b;
}

const addTest = add.apply(null, [1, '2']); // string이 number자리에 들어갈 수 없다는 타입 에러
```

## 3.2. bind

`bind`타입은 이렇게 정의되어 있다.

```ts
bind<T>(this: T, thisArg: ThisParameterType<T>): OmitThisParameter<T>;
bind<T, A extends any[], B extends any[], R>(this: (this: T, ...args: [...A, ...B]) => R, thisArg: T, ...args: A): (...args: B) => R;
```

### 3.2.1. 첫번째 오버로딩

```ts
bind<T>(this: T, thisArg: ThisParameterType<T>): OmitThisParameter<T>;
```

bind 함수는 this로 쓰일 객체를 내부 특수 속성 `[[BoundThis]]`로 가지고 있는 bound function을 리턴한다. 따라서 해당 함수에는 더 이상 this가 필요 없다. 그러니 `OmitThisParameter`를 통해 this를 제거한 타입을 리턴 타입에 부여한다.

만약 this를 생략해 주지 않으면 에러가 발생한다. `lib.es5.d.ts`의 해당 정의에서 `OmitThisParameter<T>`를 그냥 T로 바꿈으로써 실험해 볼 수 있다. 다음과 같은 간단한 코드에서조차 에러가 발생한다.

```ts
function add(this: number, a = 0, b = 0) {
  return this + a + b;
}

const addCustomBind = add.bind(1);
addCustomBind(2, 3); // the 'this' context of type 'void' is not assignable to method's 'this' of type 'number'
```

`addCustomBind`의 this 맥락은 이미 1 즉 number 타입으로 정의되었는데 여기에 기본적으로 할당되는 전역 this 맥락이 들어가려고 해서 에러가 발생하는 것이다. `OmitThisParameter<T>`를 통해 this를 제거한 타입을 리턴 타입에 부여해야 이런 오류를 해결할 수 있다.

### 3.2.2. 두번째 오버로딩 - 이전 버전

[`CallableFunction`이 처음 들어왔던 PR](https://github.com/microsoft/TypeScript/pull/27028)로 가면 예전의 `bind`타입 정의는 다음과 같이 되어 있었다.

```ts
interface CallableFunction extends Function {
    /* apply, call 타입 정의 생략*/

    bind<T, A extends any[], R>(this: (this: T, ...args: A) => R, thisArg: T): (...args: A) => R;
    bind<T, A0, A extends any[], R>(this: (this: T, arg0: A0, ...args: A) => R, thisArg: T, arg0: A0): (...args: A) => R;
    bind<T, A0, A1, A extends any[], R>(this: (this: T, arg0: A0, arg1: A1, ...args: A) => R, thisArg: T, arg0: A0, arg1: A1): (...args: A) => R;
    bind<T, A0, A1, A2, A extends any[], R>(this: (this: T, arg0: A0, arg1: A1, arg2: A2, ...args: A) => R, thisArg: T, arg0: A0, arg1: A1, arg2: A2): (...args: A) => R;
    bind<T, A0, A1, A2, A3, A extends any[], R>(this: (this: T, arg0: A0, arg1: A1, arg2: A2, arg3: A3, ...args: A) => R, thisArg: T, arg0: A0, arg1: A1, arg2: A2, arg3: A3): (...args: A) => R;
    bind<T, AX, R>(this: (this: T, ...args: AX[]) => R, thisArg: T, ...args: AX[]): (...args: AX[]) => R;
}
```

여기서 첫번째 오버로딩은 [Improve typing of 'bind' method on function types](https://github.com/microsoft/TypeScript/commit/9cc997fca76d0befe9ba42803a6be9263f2b24dc)커밋에서 `3.2.1`에서 본 형태로 바뀐다. 그 외의 오버로딩은 좀 더 지나서 [올해 4월이 되어서야 발전한 형태로 바뀌게 된다.](https://github.com/microsoft/TypeScript/commit/33ab6fd0d5eceb7715000398382b60d64dde1c67) 하지만 예전 형태도 한번쯤 볼 가치가 있다.

첫번째 오버로딩은 앞서 더 개선된 버전을 보았으니 두번째 오버로딩부터 한번 살펴보자.(사실 첫번째 오버로딩도 여기서는 비슷한 구조다) 잘 보면 마지막 것만 빼고 다 비슷한 구조라는 것을 알 수 있다.

```ts
bind<T, A0, A extends any[], R>(this: (this: T, arg0: A0, ...args: A) => R, thisArg: T, arg0: A0): (...args: A) => R;
```

`A0`은 첫번째 매개변수 타입이고 `A`는 나머지 매개변수 타입들의 튜플 타입이 된다. 따라서 원래 bind의 this가 받는 매개변수들을 첫번째 매개변수와 나머지로 쪼개서 정의하고 bind는 첫번째 매개변수 타입을 받도록 한 것이다.

그리고 bind의 this의 나머지 매개변수들과 리턴 타입은 bind가 리턴하는 bounded function의 매개변수와 리턴 타입으로 정의된다. 그리고 `T`를 이용해서 bind의 this일 함수의 this 타입을 정의한다.

다음과 같이 쓴다고 하면 bind의 thisArg가 `'hi'`가 되므로 `T`는 string이 되고 arg0은 2이므로 `A0`은 number다. 나머지 매개변수 A와 리턴타입 R은 add의 타입으로부터 추론되어 this는 `(this:string, args_0:number, b:number)=>number`가 되고 만들어지는 bounded function은 `(b:number)=>number`가 된다.

```ts
function add(a: number, b: number) {
  return a + b;
}

add.bind('hi', 2);
```

비슷하게 bind에 매개변수가 4개인 것까지의 오버로딩도 이와 비슷한 느낌이다. 기존 함수의 매개변수 타입에서 n개의 매개변수 타입들을 떼어내고 나머지 매개변수들을 bounded function 매개변수 타입으로 넘겨주는 식으로 되어 있다. 마지막 오버로딩만 조금 다른데 다시 한번 옮기면 bind의 마지막 오버로딩은 이런 타입이다.

```ts
bind<T, AX, R>(this: (this: T, ...args: AX[]) => R, thisArg: T, ...args: AX[]): (...args: AX[]) => R;
```

그렇게 어려운 타입은 아니다. 하지만 앞선 오버로딩들이 원래 매개변수 갯수에서 몇 개를 빼는 방식으로 정의된 것과 달리 이는 원래 함수와 bounded function(bind의 리턴값)의 매개변수 타입이 `AX[]`로 같다.

이는 bind에 제공되는 인수 개수에 따른 모든 오버로딩을 만들 수 없기 때문에 현실적으로 bind가 제대로 매개변수 갯수에 대한 타이핑을 할 수 있는 매개변수 갯수를 4개로 제한한 것이다.

> Note that the overloads of bind include up to four bound arguments beyond the this argument. (In the real world code we inspected in researching this PR, practically all uses of bind supplied only the this argument, and a few cases supplied one regular argument. No cases with more arguments were observed.)

[Strict bind, call, and apply methods on functions PR](https://github.com/microsoft/TypeScript/pull/27028)을 보면 조사 결과 bind가 실용적으로 사용된 코드 중 거의 전부가 `thisArg` 인수만 사용했으며 몇몇 경우에 하나의 bind argument를 사용했다고 한다. 그 이상의 매개변수를 bind에 넘겨주는 경우는 없었다고 한다. 따라서 이렇게 4개의 bind 인수까지만 오버로딩한 것은 괜찮아 보인다. 물론 이조차도 이후 개선된다.

### 3.2.3. 두번째 오버로딩 - 개선된 버전

지금 버전의 타입스크립트의 `lib.es5.d.ts`에 들어가면 bind의 2번째 오버로딩이 이렇게 정의되어 있다.

```ts
bind<T, A extends any[], B extends any[], R>(this: (this: T, ...args: [...A, ...B]) => R, thisArg: T, ...args: A): (...args: B) => R;
```

[검사기가 여러 개의 제네릭으로 이루어진 튜플을 검사할 수 있게 되어서 개선하게 되었다고 한다.](https://github.com/microsoft/TypeScript/pull/50453)

이는 bind가 받은 thisArg 이후의 매개변수 타입들을 모두 모아서 하나의 튜플 타입 `A`로 정의하고 원래 bind의 this로 되어 있는 함수의 매개변수에서 앞쪽부터 `A`튜플 타입들을 뺀 나머지 매개변수 타입들을 `B`튜플 타입으로 정의한 것이다. this의 함수 타입의 `args` 가 `[...A, ...B]`타입인 건 그런 의미이다.

또한 원래의 this 타입과 thisArg의 타입을 T로, 원래의 리턴타입과 bounded function의 리턴타입을 R 타입으로 정의해서 맞춰준 것도 볼 수 있다.

# 4. NewableFunction

`NewableFunction`은 생성자 함수에 적용되는 bind, call, apply메서드 타입을 포함하는 타입이다.

```ts
interface NewableFunction extends Function {
    apply<T>(this: new () => T, thisArg: T): void;
    apply<T, A extends any[]>(this: new (...args: A) => T, thisArg: T, args: A): void;
    call<T, A extends any[]>(this: new (...args: A) => T, thisArg: T, ...args: A): void;
    bind<T>(this: T, thisArg: any): T;
    bind<A extends any[], B extends any[], R>(this: new (...args: [...A, ...B]) => R, thisArg: any, ...args: A): new (...args: B) => R;
}
```

## 4.1. apply, call

전반적으로 `CallableFunction` 에서와 형태가 비슷하다.

```ts
// CallableFunction의 apply, call
apply<T, R>(this: (this: T) => R, thisArg: T): R;
apply<T, A extends any[], R>(this: (this: T, ...args: A) => R, thisArg: T, args: A): R;
call<T, A extends any[], R>(this: (this: T, ...args: A) => R, thisArg: T, ...args: A): R;

// NewableFunction의 apply, call
apply<T>(this: new () => T, thisArg: T): void;
apply<T, A extends any[]>(this: new (...args: A) => T, thisArg: T, args: A): void;
call<T, A extends any[]>(this: new (...args: A) => T, thisArg: T, ...args: A): void;
```

매개변수를 `A`제네릭으로 처리하는 방식은 거의 똑같아서 특별히 볼 게 없다. 그냥 생성자 함수에 들어가야 할 인수들을 그대로 call, apply에도 넘겨줘야 하도록 한 것이다.

볼 만한 건 왜 함수 타입에 `new`가 붙었으며 this의 타입은 this함수의 this 타입에서 this 함수의 리턴타입으로 바뀌었는지 정도다.

그건 해당 메서드 타입 오버로딩이 어떤 경우에 쓰이는지 보면 쉽게 알 수 있다. [해당 타이핑이 도입된 PR](https://github.com/microsoft/TypeScript/pull/27028)의 코드를 약간 변형했다.

이런 경우 NewableFunction의 apply, call 메서드 타입이 쓰인다.

```ts
class Person {
  constructor(public name: string, public age: number) {
    this.name = name;
    this.age = age;
  }
}

declare let p: Person;

let pBind = Person.bind({}, "Mark");
let pCall = Person.call(p, "Mark", 39);
let pApply = Person.apply(p, ["Mark", 39]);
```

해당 타입이 `new Person()`과 같은 방식으로 호출될 때 쓰이는 클래스 생성자 함수에 적용되는 call, apply라는 것을 알 수 있다. 따라서 call, apply의 첫번째 인자로 오는 this가 되는 것은 클래스 생성자 함수이다. 위의 경우 `Person`이 call의 this이다. 이 생성자 함수는 new와 함께 호출되었을 경우 Person의 인스턴스를 리턴한다.

그런데 call, apply에서 thisArg로 받아야 하는 것은 클래스의 동작 원리상 Person의 인스턴스와 같은 타입을 가져야 한다. 생성자 함수 실행시 this로 빈 객체가 생성되고 거기에 인스턴스 프로퍼티들이 들어가는 방식으로 작동하기 때문이다. 위에서도 인수로 Person 인스턴스 타입을 갖는 p를 넘겨줬다.

즉 call, apply의 인수 this는 생성자 함수인데 생성자 함수에 제공해야 할 this는 생성자 함수로 만드는 인스턴스 타입이다. 따라서 제네릭을 이용해서 인수 this가 반환하는 인스턴스 타입을 T로 정의한 후 이를 thisArg로 받은 것이다.

## 4.2. bind

```ts
bind<T>(this: T, thisArg: any): T;
bind<A extends any[], B extends any[], R>(this: new (...args: [...A, ...B]) => R, thisArg: any, ...args: A): new (...args: B) => R;
```

첫번째 오버로딩에서 `ThisParameterType`, `OmitThisParameter`를 쓰지 않은 것을 볼 수 있다. 이는 JS에서 클래스가 this bind를 무시하기 때문에 굳이 this를 인수 타입에서 제거해 줄 필요가 없기 때문이다. 또한 어차피 무시되기 때문에 thisArg도 any로 할 수 있다.

단 bind된 인수는 정상적으로 작동한다. 예를 들어 `pBind`의 타입은 `new (age: number) => Person`이다. bind한 결과물 역시 생성자 함수이기 때문에 `new`가 붙었다.

```ts
class Person {
  constructor(public name: string, public age: number) {
    this.name = name;
    this.age = age;
  }
}

let pBind = Person.bind({}, "Mark");
```

이런 동작을 구현하는 게 바로 NewableFunction의 bind의 두번째 오버로딩이다. 역시 thisArg는 any이다. 하지만 CallableFunction에서와 같은 원리로 bind에서 받은 인수를 제거한 인수들을 bounded function의 매개변수 타입으로 정의한다.

# 5. 제네릭과 오버로딩의 문제

[TS 3.2 릴리즈 노트](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-2.html)에 보면 아직 이 타입에 문제가 남아 있다고 한다. bind, call, apply의 오버로드가 제네릭 함수 타입을 제대로 모델링하지 못한다는 것이다.

[strictBindCallApply가 처음 도입된 PR에 이미 이슈가 올라와 있다.](https://github.com/Microsoft/TypeScript/pull/27028) 거기서 제시한 문제의 코드는 다음과 같다.

```ts
function foo<T>(name: string, arg: T): T {
  return arg;
}

// fooFunction: (arg: unknown) => unknown
let fooFunction = foo.bind(undefined, "Matt");
// fooResult: unknown
let fooResult = foo.bind(undefined, "Matt")("TypeScript");

function bar(name: string, arg: number): number;
function bar(name: string, arg: string): string;
function bar(name: string, arg: string | number) {
  console.log(name);
  return typeof arg === "number" ? arg + 1 : arg + "1";
}

// Error: Argument of type 'number' is not assignable to parameter of type 'string'.
let barResult = bar.bind(undefined, "Matt")(5);
```

위 코드에서 `fooFunction`은 사실 `(arg: T) => T`타입이 되는 게 맞다. 하지만 타입 인수는 사라지고 `unknown`타입으로 바뀌어 버린다. 또한 `fooResult`의 경우 `T`를 위한 string 타입 매개변수가 바로 들어갔으니 `unknown`이 아니라 `string`이 되어야 한다. 하지만 `unknown`이 된다.

참고로 이는 TS 3.5 이전까지는 원래 `{}`타입이었지만 [타입 인수의 기본값이 `unknown`으로 바뀌면서](https://github.com/Microsoft/TypeScript/pull/30637) `unknown`으로 바뀌었다.

비슷하게 bar의 경우에도 위처럼 하면 bind가 첫번째 오버로딩에 적용되어야 한다. 하지만 엉뚱한 오버로딩에 적용되어 타입 에러가 발생하는 것을 볼 수 있다.

[여기에 대한 이슈가 올해에도 개설되어 있다.](https://github.com/microsoft/TypeScript/issues/54707) [하지만 스택오버플로우에 TS 컨트리뷰터 중 한 명의 답변에 의하면 당장 개선 예정은 없다고 한다.](https://stackoverflow.com/questions/76924554/why-doesnt-typescript-correctly-infer-this-type)

## 5.1. 임시방편

이를 지금 시점에서 어느 정도 해결하는 방법은 함수 타입 제네릭 인자에 직접 타입을 넘겨서 더 이상 제네릭이 아니게 만드는 것이다. fooResult의 경우에는 다음과 같이 하면 된다.

```ts
let fooResult = (foo<string>).bind(undefined, "Matt")("TypeScript");
```

이런 식으로 타입 제네릭 인자에 타입을 넘겨주면 [Instantiation Expressions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#instantiation-expressions)이 되어서 더 이상 함수가 제네릭 타입으로 취급되지 않는다. 따라서 타입 제네릭 인자가 사라지는 문제가 발생할 가능성이 없어진다.

`foo<string>`은 `(name: string, arg: string) => string`타입이 되고 이런 식으로 bind 타입 정의를 따라가 보면 `fooResult`의 타입은 `string`이 된다.

하지만 이렇게 하면 함수를 제네릭으로 선언한 이점이 많이 사라질 수 있어서 완전한 해결책은 물론 아니다. 그래도 임시방편조차 없는 오버로딩 문제에 비하면 나은 듯 하다.

# 참고

조현영 - 타입스크립트 교과서

What is the NewableFunction interface used for? https://stackoverflow.com/questions/74368378/what-is-the-newablefunction-interface-used-for

bind(), call(), and apply() are untyped https://github.com/microsoft/TypeScript/issues/212

Tuples in rest parameters and spread expressions https://github.com/microsoft/TypeScript/pull/24897

타입스크립트 PR, Strict bind, call, and apply methods on functions https://github.com/microsoft/TypeScript/pull/27028

Proposal: Variadic Kinds -- Give specific types to variadic functions https://github.com/microsoft/TypeScript/issues/5453

lib Fix Part 5/6 – Function.{apply, bind} https://github.com/microsoft/TypeScript/pull/50453

TypeScript 3.2 release note https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-2.html

Strict Bind Call Apply - strictBindCallApply https://www.typescriptlang.org/tsconfig#strictBindCallApply

Generics are lost during Function.prototype.bind() and Function.prototype.call() https://github.com/microsoft/TypeScript/issues/54707

Why doesn't TypeScript correctly infer `this` type? https://stackoverflow.com/questions/76924554/why-doesnt-typescript-correctly-infer-this-type

Change the default type parameter constraints and defaults to unknown from {} https://github.com/Microsoft/TypeScript/pull/30637