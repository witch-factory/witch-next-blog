---
title: TS 탐구생활 - 객체 메서드와 함수 타입의 문제
date: "2023-09-22T00:00:00Z"
description: "타입스크립트의 함수 타입에는 공변성이라는 개념이 작용한다"
tags: ["typescript"]
---

> TypeScript의 타입 시스템은 JavaScript의 런타임 동작을 모델링하는 타입 시스템을 갖고 있다.
>
> Pozafly님의 블로그 글 https://pozafly.github.io/typescript/why-can-typescript-return-any-value-using-void/

[pozafly님의 왜 TypeScript는 void 타입을 사용해도 값을 return 할 수 있을까?](https://pozafly.github.io/typescript/why-can-typescript-return-any-value-using-void/)를 참고하였습니다.

# 1. 시작

타입스크립트의 묘한 동작은 여러 가지가 있는데 여기서는 그 중 2가지에 대해 알아볼 것이다. 

[조현영 님의 책인 타입스크립트 교과서](https://search.shopping.naver.com/book/catalog/41736307631?cat_id=50010881&frm=PBOKMOD&query=%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8+%EA%B5%90%EA%B3%BC%EC%84%9C&NaPm=ct%3Dlmuda1cg%7Cci%3Dadc8d2352090d77aaa594ba99a7f726152a4dc12%7Ctr%3Dboknx%7Csn%3D95694%7Chk%3D73d6a40144625374c787e06c0d9d7bdfd7647e8d)에 첫번째 예시가 있다.

함수의 리턴 타입을 void로 정의했는데 해당 함수에서 값을 리턴할 시 에러가 발생한다.

```ts
const foo = ():void=>3; // Error : Type 'number' is not assignable to type 'void'
```

하지만 어떤 함수가 void를 리턴하는 함수 타입으로 정의되었을 경우 해당 함수에서 값을 리턴해도 에러가 발생하지 않는다. 

```ts
const foo:()=>void = ()=>3;
```

그리고 다음과 같은 예시를 보자. `num`은 never타입이므로 당연히 아무것도 할당할 수 없다.

```ts
const num:never=3; // Type 'number' is not assignable to type 'never'.
```

하지만 밑의 `foo` 함수를 보면 인자가 never 타입임에도 불구하고 number를 인수로 받는 함수를 할당 가능하다!

```ts
type funcType=(a:never)=>number;
const foo:funcType=(a:number)=>a+1;
```

이 2가지 동작은 왜 발생하는 걸까? 이 2가지 동작은 결국 TS가 JS의 런타임 동작을 타입으로 모델링하는 것을 목표로 하기 때문에 생기는 예시이다. 더 자세히 한번 알아보자.

# 2. void

> void는 값을 반환하지 않는 함수의 반환 값을 의미한다. 함수에 return문이 없거나, 명시적으로 값을 반환하지 않을 때, 추론되는 타입이다. -- [타입스크립트 공식 문서](https://www.typescriptlang.org/ko/docs/handbook/2/functions.html#void)
>

## 2.1. void 타입 기초

예를 들어서 다음 함수들의 리턴타입이 바로 void로 추론된다.

```ts
function foo(){
  return;
}

function foo2(){
  console.log('foo2');
}
```

물론 위 함수들은 실제로는 undefined를 반환한다. 하지만 위의 공식 문서 정의에 따라 해당 함수들의 타입은 `()=>void`로 추론되게 된다.

물론 이것이 `()=>void`가 `()=>undefined`와 같다는 뜻은 아니다. JS에서 명시적인 리턴이 없는 함수도 무조건 undefined를 리턴하도록 하기 때문에 이를 수용하기 위해서 `()=>void`타입 함수라도 undefined 리턴을 허용할 뿐이다.

```ts
// ()=>undefined로 추론됨
function foo(){
  return undefined;
}

function bar():void{
    return undefined;
}
```

그런데 우리가 위에서 보았듯이 void 리턴 함수에서 다른 값을 리턴할 수도 있다. 다음과 같은 코드에서 에러가 뜨지 않는 것을 우리는 이미 보았다.

```ts
const foo:()=>void = ()=>3;
```

사실 void 리턴 타입은 함수가 명시적으로 반환을 하지 않을 것을 강제하는 것이 아니다! 즉 어떤 값이든 반환될 수 있지만 이는 무시된다는 것이다. 예를 들어 다음과 같은 코드에서 `test`함수의 반환값은 void로 추론되어 사실상 아무것도 할 수 없게 된다.

```ts
type VoidReturnFunc=()=>void;

const test:VoidReturnFunc=()=>3;
const n=test()+1; // Operator '+' cannot be applied to types 'void' and 'number'
```

## 2.2. 이런 동작의 이유

즉 `void를 리턴하는 함수 타입`의 함수는 어떤 값이든 반환해도 되고, `함수의 리턴 타입이 void`이면 undefind만 반환 가능하다. 그럼 왜 void는 이런 동작을 하게 되었을까? 앞서 말했듯이 JS의 동작을 모델링하기 위해서이다.

JS에서는 콜백 함수를 인수로 받는 메서드들이 몇 개 있다. `Array.prototype.forEach` 같은 함수들이 그 예시이다.

```ts
const arr=[1,2,3];

arr.forEach((v,i)=>{
  console.log(i,v);
});
```

이 메서드들은 콜백으로 받는 함수의 리턴값을 전혀 사용하지 않는다. console.log의 리턴은 undefined이기는 하지만 만약 다른 값을 리턴한다고 해도 전혀 사용되지 않는다. 따라서 이런 메서드들은 콜백 함수의 리턴 타입을 void로 정의해야 하고 실제로도 그렇게 정의되어 있다.

```ts
Array<T>.forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void
```

그런데 만약 void를 리턴하는 함수 타입이 함수의 반환을 금지한다면 어떨까? 다음 코드를 보자.

```ts
const arr:Array<number>=[1,2,3];
const res:Array<number>=[];

// res.push는 배열의 길이 즉 number 타입을 리턴하지만 전혀 사용되지 않음
arr.forEach(elem=>res.push(elem));
```

위와 같은 코드는 안티패턴도 아니고 `elem=>{ res.push(elem) }`와 같이 쓰는 것보다 간결하기 때문에 많이 보이는 방식이다. 

하지만 만약 void를 리턴하는 함수 타입이 함수의 명시적 반환(undefined 제외)을 금지한다면 이 코드는 에러가 발생하게 된다. 왜냐하면 `res.push`는 number를 리턴하기 때문이다.

이런 이유로 TS는 void를 반환하는 함수 타입에 대해 반환값을 허용한다.


# 참고

우연히 보게 된 어떤 트위터 스레드 https://twitter.com/_a6g_/status/1678987111893200896

왜 TypeScript는 void 타입을 사용해도 값을 return 할 수 있을까? https://pozafly.github.io/typescript/why-can-typescript-return-any-value-using-void/

타입스크립트 공식 문서의 void https://www.typescriptlang.org/ko/docs/handbook/2/functions.html#void