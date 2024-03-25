---
title: TS 탐구생활 - void 함수의 리턴에 대하여
date: "2023-09-22T00:00:00Z"
description: "TS는 void 리턴타입 함수에서 리턴하는 것을 막지 않는다. 왜?"
tags: ["typescript"]
---

> TypeScript의 타입 시스템은 JavaScript의 런타임 동작을 모델링하는 타입 시스템을 갖고 있다.
>
> Pozafly님의 블로그 글 https://pozafly.github.io/typescript/why-can-typescript-return-any-value-using-void/

[pozafly님의 왜 TypeScript는 void 타입을 사용해도 값을 return 할 수 있을까?](https://pozafly.github.io/typescript/why-can-typescript-return-any-value-using-void/)를 보고 이해한 대로 간단히 요약하였습니다.

# 1. 시작

타입스크립트의 묘한 동작은 여러 가지가 있는데 여기서는 그 중 void 리턴 타입에 대한 동작에 대해 알아보려고 한다.

[조현영 님의 책인 타입스크립트 교과서](https://search.shopping.naver.com/book/catalog/41736307631?cat_id=50010881&frm=PBOKMOD&query=%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8+%EA%B5%90%EA%B3%BC%EC%84%9C&NaPm=ct%3Dlmuda1cg%7Cci%3Dadc8d2352090d77aaa594ba99a7f726152a4dc12%7Ctr%3Dboknx%7Csn%3D95694%7Chk%3D73d6a40144625374c787e06c0d9d7bdfd7647e8d)에 예시가 있다.

함수의 리턴 타입을 void로 정의했는데 해당 함수에서 값을 리턴할 시 에러가 발생한다.

```ts
const foo = ():void=>3; // Error : Type 'number' is not assignable to type 'void'
```

하지만 어떤 함수가 void를 리턴하는 함수 타입으로 정의되었을 경우 해당 함수에서 값을 리턴해도 에러가 발생하지 않는다.

```ts
const foo:()=>void = ()=>3;
```

이런 동작은 왜 발생하는 걸까? 이 2가지 동작은 결국 TS가 JS의 런타임 동작을 타입으로 모델링하는 것을 목표로 하기 때문에 생기는 예시이다. 더 자세히 한번 알아보자.

# 2. void란?

> void는 값을 반환하지 않는 함수의 반환 값을 의미한다. 함수에 return문이 없거나, 명시적으로 값을 반환하지 않을 때, 추론되는 타입이다. 
> 
> [타입스크립트 공식 문서](https://www.typescriptlang.org/ko/docs/handbook/2/functions.html#void)

예를 들어서 다음 함수들의 리턴타입이 void로 추론된다.

```ts
function foo(){
  return;
}

function foo2(){
  console.log('foo2');
}
```

물론 위 함수들은 JS 문법상 실제로는 undefined를 반환한다. 하지만 위의 TS 공식 문서 정의에 따라 해당 함수들의 타입은 `()=>void`로 추론되게 된다.

물론 이것이 `()=>void`가 `()=>undefined`와 같다는 뜻은 아니다.

JS에서 명시적인 리턴이 없는 함수도 무조건 undefined를 리턴하도록 하기 때문에 이를 수용하기 위해서 `()=>void`타입 함수라도 undefined 리턴을 허용할 뿐이다.

```ts
// ()=>undefined로 추론됨
function foo(){
  return undefined;
}

function bar():void{
    return undefined;
}
```

```
tsconfig.json의 strictNullChecks 옵션을 false로 주면 void 리턴타입 함수의 리턴 값으로 undefined 뿐 아니라 null도 허용한다.
```

# 3. void 리턴타입의 리턴 허용

그런데 우리가 위에서 보았듯이 void 리턴 함수 타입인 `()=>void`로 정의된 함수에서 다른 값을 리턴할 수도 있다. 다음과 같은 코드에서 에러가 뜨지 않는 것을 우리는 이미 보았다.

```ts
const foo:()=>void = ()=>3;
```

사실 void 리턴 타입은 함수가 명시적으로 반환을 하지 않을 것을 강제하는 것이 아니다!

> `void` 반환 타입으로의 문맥적 타이핑은 함수를 아무것도 반환하지 않도록 강제하지 않습니다.이를 설명하는 또 다른 방법은, `void` 반환 타입을 가지는 문맥적 함수 타입(`type vf = () => void`)가 구현되었을 때, 아무값이나 반환될 수 있지만, 무시됩니다.
>
> [TS 공식 문서 - 함수의 할당 가능성](https://www.typescriptlang.org/ko/docs/handbook/2/functions.html#%ED%95%A8%EC%88%98%EC%9D%98-%ED%95%A0%EB%8B%B9%EA%B0%80%EB%8A%A5%EC%84%B1)

즉 어떤 값이든 반환될 수 있지만 이는 무시된다는 것이다. 예를 들어 다음과 같은 코드에서 `test`함수의 반환값은 void로 추론되어 무시되기 때문에 사실상 아무것도 할 수 없게 된다. 물론 타입 단언을 통해 이를 해결할 수는 있지만 권장되지 않는다.

```ts
type VoidReturnFunc=()=>void;

const test:VoidReturnFunc=()=>3;
const n=test()+1; // Operator '+' cannot be applied to types 'void' and 'number'

// 이렇게 타입 단언을 통해 어떻게든 할 수 있기는 하다.
const n=(test() as unknown as number)+1; 
```

메서드에서도 이는 마찬가지다. `void`를 명시적으로 리턴타입으로 지정할 시 메서드에서는 undefined를 제외하고 명시적인 반환을 할 수 없지만 `void`를 리턴타입으로 추론할 시 명시적인 반환을 할 수 있다.

```ts
type Person={
  greeting:()=>void;
}

const person:Person={
  // void를 리턴하는 함수 타입의 함수에서는 반환을 할 수 있다.
  greeting(){
      return "Hi";
  }
}

const person2={
  // Type 'string' is not assignable to type 'void'.
  greeting():void{
      return "Hi";
  }
}
```

[이를 정리해 보면 다음과 같다.](https://pozafly.github.io/typescript/why-can-typescript-return-any-value-using-void/#void%EC%9D%98-2%EA%B0%80%EC%A7%80-%ED%98%95%ED%83%9C)

1. 함수 자체에 리턴 타입으로 붙어 있는 void값(`:void`와 같은)은 리턴값이 존재하면 안된다.
2. 함수 타입에 리턴값으로 붙어 있거나(`()=>void` 타입) 선언과 할당이 따로 나뉘어 있는 void값은 값이 존재할 수 있다. 다만 무시된다.

즉 `void를 리턴하는 함수 타입(()=>void 타입)`의 함수는 어떤 값이든 반환해도 되고, `함수의 리턴 타입이 void`이면 undefind 외에는 명시적 반환이 불가능하다. 그럼 왜 void는 이런 동작을 하게 되었을까?

# 4. 이런 동작의 이유

TS가 이런 동작을 허용하는 이유는 앞서 말했듯이 JS의 런타임 동작을 모델링하기 위해서이다.

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

왜 TypeScript는 void 타입을 사용해도 값을 return 할 수 있을까? https://pozafly.github.io/typescript/why-can-typescript-return-any-value-using-void/

타입스크립트 공식 문서, void https://www.typescriptlang.org/ko/docs/handbook/2/functions.html#void

타입스크립트 공식 문서, 함수의 할당 가능성
https://www.typescriptlang.org/ko/docs/handbook/2/functions.html#%ED%95%A8%EC%88%98%EC%9D%98-%ED%95%A0%EB%8B%B9%EA%B0%80%EB%8A%A5%EC%84%B1

공변성이란 무엇인가 https://seob.dev/posts/%EA%B3%B5%EB%B3%80%EC%84%B1%EC%9D%B4%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80

우연히 보게 된 공변성에 관한 트위터 스레드 https://twitter.com/_a6g_/status/1678987111893200896