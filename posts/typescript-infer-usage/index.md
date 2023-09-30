---
title: TS 탐구생활 - TS infer 키워드의 활용
date: "2023-09-30T00:00:00Z"
description: "TS infer 키워드의 활용"
tags: ["typescript"]
---

# 1. infer 키워드란?

## 1.1. 소개

TS에서는 몇 가지 유틸리티 타입을 제공한다. `Record<Keys,Type>`이나 `Omit<Type, Keys>`와 같은 것들은 꽤나 흔히 쓰인다.

그런데 이중 함수를 받아서 해당 함수의 리턴 타입을 추출하는 `ReturnType<Type>`이라는 유틸리티 타입이 있다. 이것은 함수의 리턴 타입을 추출하는 것이다.

[TS 핸드북의 예시를 가져와 보면 이해가 쉽다.](https://www.typescriptlang.org/ko/docs/handbook/utility-types.html)

```ts
// type T0 = string
type T0 = ReturnType<() => string>;

// type T1 = number
type T1 = ReturnType<(s: string) => number>;

// type T2 = unknown
type T2 = ReturnType<<T>() => T>;
```

이런 마법같은 유틸리티 타입은 어떻게 동작하는 것일까? 이것은 바로 `infer` 키워드를 사용해서 동작한다. 실제 `ReturnType`의 정의를 보면 다음과 같다.

```ts
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
```

복잡해 보이는 위 선언을 잘 뜯어보면, `T`는 함수 타입이고 리턴 타입에 `infer`키워드가 붙어 있다. 이는 `T`의 리턴 타입을 추론해서 `R`이라는 타입 변수에 할당하겠다는 의미이다. 그리고 이 `R`은 `ReturnType`의 리턴 타입이 된다.

그런 과정을 거쳐서 `ReturnType`은 함수의 리턴 타입을 추론해서 리턴하는 유틸리티 타입이 된다.

## 1.2. 사용법

`infer` 키워드는 컨디셔널 타입과 함께 사용되어야만 한다. 만약 그냥 쓸 시 다음과 같은 에러 메시지를 마주하게 된다.

```
'infer' declarations are only permitted in the 'extends' clause of a conditional type.
```

컨디셔널 타입에서 타입스크립트에 추론을 맡기고 싶은 부분에 `infer` 키워드와 타입 변수를 사용하면 된다.

> Such inferred type variables may be referenced in the true branch of the conditional type.
>
> TS 공식 문서의 Conditional Types section

컨디셔널 타입의 참 부분에만 `infer`된 타입 변수를 사용할 수 있다. 거짓 부분에서 쓰려고 하면 에러가 발생한다.

```ts
// 잘 작동한다.
type Element<T>=T extends (infer U)[] ? U : T;
// Cannot find name 'U'
type Element<T>=T extends (infer U)[] ? T : U;
```

나머지는 그냥 추론하려는 부분을 `infer`로 만들기만 하면 된다.

```ts
// 배열 요소 타입 얻기
type Elem<T>=T extends (infer U)[] ? U : T;

type A=Elem<string[]>; // string

// 함수 파라미터 타입 얻기
type Param<T>=T extends (...args: infer P) => any ? P : never;

type B=Param<(a: string, b: number) => void>; // [string, number]
```

## 1.3. 여러 개의 infer

하나의 타입 변수에 여러 개의 `infer`를 사용할 수도 있다.

```ts
// 매개변수 타입과 리턴 타입을 추론해서 튜플에 담아 리턴해 준다.
type ParamAndReturn<T>=T extends (...args: infer P) => infer R ? [P, R] : never;
```

반면 같은 `infer` 타입 변수를 여러 곳에 사용할 수도 있다. 기본적으로는 같은 이름의 타입 변수들은 유니온으로 합쳐진다. 하지만 반공변성을 갖는, 이를테면 매개변수와 같은 것들은 인터섹션이 되어 리턴된다. 이 부분에 대해서는 추후 공변성에 관한 글에서 다루도록 하겠다.

```ts
// a의 타입과 b의 타입이 합쳐져서 리턴된다. 
type InferUnion<T> = T extends { a: infer U; b: infer U } ? U : never;
// a의 타입과 b의 타입의 intersection이 리턴된다. 매개변수는 반공변성을 가지고 있기 때문이다
type InferIntersection<T> = T extends { a: (x: infer U) => void; b: (y: infer U) => void } ? U : never;
```

그럼 이제 이 `infer`가 어디에 쓰일 수 있는지 알아보자.

# 2. 함수 인자 타입 추론

그럼 이런 `infer`를 어디에 사용할 수 있을까? 위에서 `Param<T>`와 같은 타입으로 함수 타입의 인자 타입을 얻어오는 것이 가능하다는 것을 보았다. 이를 이용해 함수 인수 타입을 따로 가져오는 것이 `infer`의 단순한 활용법 중 하나다.

## 2.1. 함수 인자 타입 추론 방법

`infer`를 이용하면 위에서 보았듯이 함수의 인자 타입, 혹은 함수의 특정 인자 타입을 추론할 수 있다.

```ts
type GetArgumentType<T> = T extends (...args: infer U) => any ? U : never;

type GetFirstArgumentType<T> = T extends (arg: infer U, ...args:any) => any ? U : never;
```

## 2.2. 서드파티 라이브러리 함수 인자 타입 추론

이는 서드파티 라이브러리를 사용할 때 유용하게 쓰일 수 있다. 함수 인자의 타입을 제대로 제공하지 않는 라이브러리가 있을 때, 이를 보완할 수 있는 것이다.

예를 들어 다음과 같이 정의된 라이브러리 함수가 있다고 하자.

```ts
function introduce(person:{
    name:string;
    age:number;
    hobbies:[string, string];
}){
    return `${person.name}은 ${person.age}살이고 ${person.hobbies.join(" 와 ")}가 취미입니다.`
}
```

라이브러리에서 `introduce`의 인자를 위한 `Person`타입 같은 걸 제공하지 않는다면 이 함수의 인자를 알맞게 만들어도 타입 검사를 통과하지 못할 수 있다.

```ts
const me={
    name:"김타입",
    age:26,
    hobbies:["JS", "TS"],
}
// me.hobbies의 타입이 string[]으로 추론되어 타입 에러 발생
introduce(me);
```

이때 `infer`를 사용한 유틸리티 타입을 만들어서 다음과 같이 해결할 수 있다. `me`의 타입을 제대로 선언해 주는 것이다.

```ts
type GetFirstArgumentType<T> = T extends (arg: infer U, ...args:any) => any ? U : never;

const me:GetFirstArgumentType<typeof introduce>={
    name:"김타입",
    age:26,
    hobbies:["JS", "TS"],
}

introduce(me);
```

그냥 `Person` 타입을 새로 정의해 주는 방법도 있겠지만 서드파티 라이브러리의 코드를 다 파악해서 타입을 새로 정의하는 것은 쉽지 않다. 이런 경우 `infer`를 사용한 `GetFirstArgumentType<T>`와 같은 타입으로 쉽게 함수 인자 타입을 추론해 줄 수 있다.

이런 활용은 꼭 함수 인자 타입에만 한정된 것은 아니다. 생성자 매개변수 타입이라든지 인스턴스 타입이라든지 하는 것들을 제대로 제공해 주지 않는 서드파티 라이브러리가 있다면 `infer`를 사용해서 혼내줄 수 있다.

## 2.3. 리액트 컴포넌트 props 타입 추론

이는 리액트 관련 라이브러리에서 컴포넌트의 props 타입을 제대로 제공하지 않을 때도 유용하게 쓰일 수 있다.

```ts
type InferProps<T> = T extends React.ComponentType<infer P> ? P : never;

// LibComponent의 props 타입을 추론
type MyProps = InferProps<typeof LibComponent>;
```

React에서는 이를 좀 더 발전시킨 `ComponentProps` 유틸리티 타입을 제공하고 있다. 만약 `T`가 JSX 엘리먼트 생성자라면 즉 리액트 컴포넌트 타입이라면 `ComponentProps<T>`는 해당 엘리먼트의 props 타입을 추론한다. 만약 그렇지 않다면 HTML 내장 요소, `<div>` 나  `<button>`과 같은 `IntrinsicElements`인지 확인하고 그렇다면 해당 요소의 props 타입을 추론한다.

만약 JSX 엘리먼트 생성자도 아니고 HTML 내장 요소도 아니라면 null이나 undefined외에 모든 타입을 허용하는 `{}` 타입을 리턴한다.

```ts
// @types/react/index.d.ts
type ComponentProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
    T extends JSXElementConstructor<infer P>
        ? P
        : T extends keyof JSX.IntrinsicElements
            ? JSX.IntrinsicElements[T]
            : {};
```

# 3. 재귀적 타입 추론

`infer`는 매우 심화된 타입 작업을 할 때에 많이 사용된다고 한다. 그 대표적인 예시가 재귀적 타입인데, 사용된 타입에서 특정 부분만 뽑아내어서 사용할 수 있게 해주는 `infer`타입의 특성 덕분이다.

이 재귀적 타입은 TS 4.1.0 이상 버전에서만 동작한다.

아무튼 몇 가지 예시를 통해서 이런 활용법을 알아보자.

## 3.1. 예시 - 평탄화 타입

다음과 같은 코드를 보자. 다음은 중첩 배열을 평탄화하는 함수에 대한 타이핑을 한 것이다. `flatRecurisve`에서 재귀적으로 함수를 flatten하는 과정과 비슷하게 타입도 재귀적으로 정의할 수 있다는 사실을 관찰할 수 있는 코드이다.

```ts
// 배열 T를 flat한 배열의 타입을 나타낸다
type Flatten<T extends readonly unknown[]> = T extends unknown[] ? _Flatten<T>[] : readonly _Flatten<T>[];
// T 타입을 flat 하기 위한 보조 타입. T가 배열이 아니라면 T를 리턴하고 배열이면 배열의 요소를 리턴한다.
// 즉 배열의 요소들을 모두 평탄화해 유니언한 타입을 리턴한다.
type _Flatten<T> = T extends readonly (infer U)[] ? _Flatten<U> : T;

// T를 평탄화한 배열의 타입 Flatten<T> 타입을 리턴한다
function flatRecurisve<T extends readonly unknown[]>(xs: T): Flatten<T> {
  const result: unknown[] = [];

  function flattenArray(arr: readonly unknown[]) {
    for (const item of arr) {
      if (Array.isArray(item)) {
        flattenArray(item);
      } else {
        result.push(item);
      }
    }
  }

  flattenArray(xs);

  return result as Flatten<T>;
}

const t1 = flatRecurisve(['apple', ['orange', 100], [[4, [true]]]] as const);
```

여기서 주의깊게 봐야 할 점은 `T`를 평탄화한 배열의 타입을 리턴하는 `Flatten<T>` 타입이다. 이 타입은 `_Flatten`을 이용해서 만들어지는데 이게 바로 재귀적 타입이다. `T`가 만약 배열 타입이라면 배열의 요소를 나타내는 `U`를 재귀적으로 flatten한다. 그리고 배열 타입이 아니라면 그대로 `T`를 리턴한다.

이를 이용하면 `_Flatten<T>`는 배열 타입 `T`를 평탄화한 타입이 될 것이다. 가령 `_Flatten<['apple', ['hi', 100], [[4, [true]]]]>`는 `true | "hi" | 100 | 4 | "apple"`과 같이 배열의 모든 요소가 flatten되어 유니온된 타입이다.

## 3.2. 예시 - Promise return 타입

`infer`는 Promise의 리턴타입을 추론하는 데에도 쓰일 수 있다.

```ts
type PromiseReturnType<T> = T extends Promise<infer Return> ? Return : T

type t = PromiseReturnType<Promise<string>> // string 
```

하지만 제대로 된 Promise의 리턴타입을 추론하려면 중첩된 Promise도 제대로 처리할 수 있어야 하겠다. 이런 것을 잘 해주는 유틸리티 타입이 이미 있다. `Awaited<T>`가 그것이다.

```ts
let promise = Promise.resolve([1, 2, 3]); // Promise<number[]>

type A=Awaited<typeof promise>; // number[]
```

`lib.es5.d.ts`에 정의된 이 `Awaited` 타입의 원형을 보면 다음과 같이 재귀적으로 타입이 정의되어 있는 것을 볼 수 있다. 재귀적으로 Promise를 unwrap하여 결과물을 리턴한다. JSdoc에 나와 있듯이 이는 `await`의 동작을 모방한 것이다.

```ts
// lib.es5.d.ts
/**
 * Recursively unwraps the "awaited type" of a type. Non-promise "thenables" should resolve to `never`. This emulates the behavior of `await`.
 */
type Awaited<T> =
    // `--strictNullChecks` mode가 아닐 때 T가 null이나 undefined라면 T를 리턴한다
    T extends null | undefined ? T :
    // T가 호출 가능한 then 메서드를 가진 thenable이라면 await이 unwrap한다. 아니라면 T를 리턴한다.
        T extends object & { then(onfulfilled: infer F, ...args: infer _): any } ?
        // F는 then 메서드의 첫번째 인자 타입이다. 만약 이게 callable이라면 재귀적으로 unwrap한다. 이는 thenable 내부 값의 awaited type도 unwrap하는 역할을 한다.
            F extends ((value: infer V, ...args: infer _) => any) ?
                Awaited<V> : // recursively unwrap the value
                // 만약 then 메서드의 첫 번째 매개변수 F가 호출 가능한 함수가 아니라면
                // thenable이 제대로 처리되지 않은 것이므로 never 리턴
                never : 
        T; // T is non-object or non-thenable
```

## 3.3. 예시 - 경로 검증 타입

Reddit의 한 스레드에서 찾은 좀 더 복잡한 재귀 타입의 예시로 `infer`의 활용은 마무리하고자 한다. 이는 객체의 중첩된 경로에서 값을 안전하게 가져오는 데 사용될 수 있는 타입이다.

객체와 객체에서 접근할 경로(`.`으로 구분된)을 받아서 해당 경로에 접근하는데 만약 객체 타입 `T`내부에 `K`경로에 해당하는 값이 없다면 `never`타입이 되어 오류를 발생시킨다.

따라서 `get`함수를 사용하면 객체의 특정 경로에 안전하게 접근할 수 있게 된다.

이 구체적인 동작에 대한 자세한 설명이 궁금한 사람은 [playground 링크](https://www.typescriptlang.org/play?#code/PQKhCgAIUgZBJAQgJQILIJpRMc5jCQCiAHgC4BOAhgMZkDOkZAFgKaQAmA9mQLQB2PKmQCWXfpAAOw5pABuVADYBXdmQCek1uA1bIABRkA1JaoA8AFQA0kANKRW5Vvw6N6lEfwDmAPkgBeKEhggkgAMS4KJjZIClYAWypPDlYorgAzaPYacQ4RUXElJk1WGwB3VgByOXYqenoRL35WDkgqSHplACN3Ck8vJi5IZC4eYGRWd0hlBu9IAANPdNT5gDogkMILZhFGGioJFmdILtr+JXUALxaT9SzIHPjJEUVU1cgAdXzmLmUyaN25XYZV+ig4-Eq-1ObS6r0GDnI1DowAUihEHGEahiAGtWOp6OtgsF7I4yM5XAsACQAbyWqWGozIAF9VjS6VEJu4mfNIAB+DZEzaQeCZEY8SC7NqQXF3YQAxivGqKSAZe5cLoAK1YdBseQGnjIQyOkGa5EgitYineIpNPBsjnysW1ygoDXEkDK3wWzRqFHmAsFYv+pPJjBlqosfIMxlMrEsAG0gwBdGycsh+ABcJtYvoFoS6dWyhazADkhtwGBLDjFev0JU9FOo6-lKox2obJOac5bpXj3nnCIKh8EAMJsGjYiWZFuMG0zqUylXV9jqrV0NouJhUXH3VGqYKRByKejsefKFysdKeFqEolZgAUJKcLjDeIjUYs8dsScgWfPKSvZoOAASjwUIbWNaQWAlRhUXRGw4jIF1lykGQdBKSATDRDEyQ4QwWEsKwnzJF8Og8bw-H8aMWCw8xrFsPwQ1In16V5bNfV-OwAG4wLAbBIFQGgaEmNsJFXbV-jkER2grAQhAKCRa28bBcHSc86DECQvFYMhLAREiKXEnU7H00MyL6Cj72cUQNCzaxUJYLMsPRTE8JkQiGOArN8OYWi43ovxqQFRDkIc5hVnoSQ0TIe8ACJVli4DVjiDhlGE+971oGgswOdQbGxYCAj8LL42xFMHH4Gz1GAnimV4-iAFUAGUiGQXhYFQEsABEBP0fQEBHVALHgAB5Et+P4wRRGE6I5WNGZ6WYOoIX+ADr1aXLij0A5WklOJGzrd1dFPfhljifhhMJGAy2aFVMmNdIuEURQuE9OYQWUMETnYSQuHqERYWBb5fn+RZTpWK7cDAwgJhoF03QkSQKC4YT6mo3zYzMalHq4LNqROKgKCzfhlHiU4KCZJkbFinHYp8fBCCaslOwARjsgJIGx0Y8YLImTVJ8nKZsewqJp0Z4sgMtOB4RhPAWWx5hseghnobERE7Q0CZPB5iwZ4d9YNw2jeHHNTExLN5mIszw0ySM2M-b9OP-S91p5ModhoWQQoofhGHmfHeeJgX6W5Bm9ecnCWh8rGcYzAPCYzEmyZDqnIDFrg6Y5-3A-55OKZ5bhJhW0zN3mFi-SVoZvYkeZ09i+YeJyX3JNjFnQB5hPc8F6BgCo7SYvx2POYJvmWcgJlx+p2mauh4ZnVdTSpGR1HGB8vyY+54ec6T8nx9T9PVl5w+qEuOmMz1pnWFZ9mqMHzf475neU+FjmD6PgtT5sdkGXFUXaa-8GHJJj-FFu-E+sUbCfmTBzB+Qc87jwvszSAAAmG+W9O5PyiKnA2Is05gM-kOb+QZX68wgVWM6c8pigPATYQUUDGQ-iopgxBV9IAAGY0GYNocbIcuDYofzIQbQQ0tKxy0torDoRoYgdgeLkfIi90hJGPBuVoFQOhqw1kMAs2t9gnnPqEHhhijHGOCKbFQ5t5YlwpDbSAdtbFfh-H+C8gEWj+gMSYjxnjBT8PAdLIukIES7H+O6eYNjMESOVh6dg1dpjOPWusAg4clAuVwtHLmuN0GP2Dlg-eONj4UGPqfSiCxnYuI4AXLg-jgzPlaGXbsFdJESn+NXRgb9CaFPiuAJuUw9ysGQe3Up60cAc37veO+GTYGQDHhPXJox8kdJnnrWG8NF5IxRiJdG690l4xHnA3eQs055PwasFg-R6BnxYdfWxMDIBD0mZgveL8-5zOOac7w5yAEUOIc8jOnz6RphIe0j+JydjvLIfQngjDMl7JDpclBaD7nZMnobPhrzQVeA+YQwBP8QF4MJmQohwDAWXBBWcwRRIIVkChcw0Il9OwcOuUw7J3DjGopPqSsFLKsVfMZMSgl2KAWizeRiiBesvHiolUSMxygLHzGIUxaxb5bZRjXpjSl5U0yZnYisMVkq9UeJ8afPx9Bi4OimCEsJ2SIlDDUTEupvo1hh1CBHVyaS7m7K7s-Q5LygXsuFec4p9qVhWL9uXa1USnRIR9t6epPIdqQH7iqF0VYDI3FSMjApXTxA9NjGw9u5dhl9x0mM2598PXTORW0gpwL-WJS4pAUI2xJQfS+ktGo31jjtAoOeUQ8R2DpsPGo-YEhBBlB1mQT2bR-iPGeHCXtrB1hAA)를 참고해볼 수 있다.

```ts
// 제공된 객체 T에서 문자열 경로 K의 값을 가져올 때 사용하는 타입
type PathValue<T, K extends string> =
    // K가 점으로 구분된 문자열이라면 점 앞쪽 문자열을 Root, 점 뒤쪽 문자열을 Rest로 할당한다.
    K extends `${infer Root}.${infer Rest}` ?
        // Root가 T의 key 중 하나라면 재귀적으로 타입을 추론한다. 만약 Root가 T의 key 중 하나가 아니라면 never를 리턴하여 재귀 탈출
        Root extends keyof T ? PathValue<T[Root], Rest> : never
    // K가 더 이상 점으로 구분되지 않는 경우이다. 이때는 top level key라는 것이므로 T의 key 중 하나인지 확인하고 그 값을 가져오기를 시도한다
    : (K extends keyof T ? T[K] : undefined)

// 이 타입은 경로 K가 유효한지 확인한다. 유효한 경로라면 K를 반환, 그렇지 않다면 never를 반환
type ValidatedPath<T, K extends string> = PathValue<T, K> extends never ? never : K;

/**
 * Access an object via dot-notation string
 */
// 객체 entity와 점으로 분할된 경로 path를 받아서 해당 경로의 값을 리턴한다.
// PathValue의 정의상 만약 T에 K경로 값이 존재하지 않는다면 리턴타입이 never가 되어 오류가 발생한다
function get<T extends object, K extends string>(entity: T, path: ValidatedPath<T, K>): PathValue<T, K> {
  // path를 점으로 분할하여 entity 내의 해당 경로에 접근하여 값을 반환
    return path.split(".").reduce((acc: any, k) => acc[k], entity);
}
```

# 4. 마치며

`infer` 타입은 사실 TS를 하면서 자주 마주할 일은 없는 타입이다. 자주 사용한다면 오히려 뭔가 코드가 이상해지고 있다는 이야기일지도 모른다.

하지만 외부 함수를 사용할 때 함수의 인자나 리턴 타입 추론, 재귀적인 타입 추론 등 다른 타입에서 어떤 일부 타입을 뽑아서 사용해야 할 때 매우 유용하게 사용할 수 있다. 이런 활용법을 알아두면 나중에 유용하게 쓸 수 있을 것이다.

# 참고

조현영 님의 `타입스크립트 교과서`

Understanding infer in TypeScript
https://blog.logrocket.com/understanding-infer-typescript/

Infer keyword in TypeScript https://dev.to/0ro/infer-keyword-in-typescript-3nig

TypeScript Infer keyword Explained https://javascript.plainenglish.io/typescript-infer-keyword-explained-76f4a7208cb0

Reddit의 Typescript 게시판의 한 스레드, `Can someone explain the purpose of infer keyword?` https://www.reddit.com/r/typescript/comments/msr4vk/can_someone_explain_the_purpose_of_infer_keyword/