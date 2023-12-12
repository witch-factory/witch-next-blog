---
title: TS 탐구생활 - Array.prototype.concat 타입의 여행
date: "2023-12-12T00:00:00Z"
description: "TS의 Array.prototype.concat 타입은 쉽게 쓰여진 게 아니다"
tags: ["typescript"]
---

![concat 이슈 사진 하나](./concat-issue.png)

# 1. Array.prototype.concat

TS의 기본 타입 파일 중 하나인 `lib.es5.d.ts`의 `Array<T>`를 살펴보고 있었는데 `concat`의 타입이 그냥 보기에 특이하게 정의되어 있었다. 그래서 이 타입이 왜 이렇게 되었는지 알아보았다. 그 과정에서 꽤 흥미로운 부분들이 있었기에 여기 적는다.

## 1.1. Array.prototype.concat이란?

JS에서 `Array.prototype`에는 `concat()`메서드가 정의되어 있다. 이 메서드는 기존 배열에 병합할 새 배열을 인수로 받아서 병합한 새 배열을 반환한다. 여러 개의 배열을 인수로 받아 병합하는 것도 가능하다. 다음은 MDN에서 가져온 `concat()`의 예제 구문이다.

```js
concat()
concat(value0)
concat(value0, value1)
concat(value0, value1, /* …, */ valueN)
```

만약 매개변수가 하나도 없을 경우 `concat`은 기존 배열의 얕은 복사본을 반환한다.

## 1.2. concat의 타입

그런데 `Array<T>`에서 해당 메서드의 타입을 보면 좀 낯선 구조가 있다.

```ts
interface Array<T> {
    concat(...items: ConcatArray<T>[]): T[];
    concat(...items: (T | ConcatArray<T>)[]): T[];
}
```

그리고 `ConcatArray<T>`는 다음과 같이 정의되어 있다.

```ts
interface ConcatArray<T> {
    readonly length: number;
    readonly [n: number]: T;
    join(separator?: string): string;
    slice(start?: number, end?: number): T[];
}
```

그냥 `Array<T>`를 인수 타입으로 그대로 써도 될 것 같은데 `ConcatArray<T>`라는 새로운 타입을 굳이 정의하고 있다. 왜 그런지 알아보니 이것도 꽤나 많은 논의를 거쳐서 이렇게 된 거였다. 그 과정을 알아보자.

# 2. 첫번째 개선 - union 허용

## 2.1. 가장 초기의 concat 타입

가장 초기의 `concat`타입은 [2014년 9월의 이슈](https://github.com/microsoft/TypeScript/issues/738)에서 확인할 수 있다. 당시 `Array.concat`메서드의 타입은 이랬다.

```ts
interface Array<T> {
    /**
      * Combines two or more arrays.
      * @param items Additional items to add to the end of array1.
      */
    concat<U extends T[]>(...items: U[]): T[];
    /**
      * Combines two or more arrays.
      * @param items Additional items to add to the end of array1.
      */
    concat(...items: T[]): T[];
}
```

첫번째 오버로딩을 보면 `U`가 `T[]`를 상속하고 있으므로 `U[]`인수를 받는다는 건 개념상 `T[][]`를 받는다는 것과 같다. 따라서 병합할 여러 배열들을 인수로 받는다는 JS의 `concat`의 개념과 일치한다.

그리고 `concat`은 `[1,2,3].concat(4,5,6)`과 같이 배열이 아니라 개별 원소들도 인수로 받을 수 있기 때문에 두번째 오버로딩도 합당하다.

## 2.2. 개선

JS의 `concat`은 원래 개별 원소들과 배열을 혼합해서 인수로 받는 것이 가능하다.

```js
[1,2,3].concat(4,[5,6],7,[8]) // [1,2,3,4,5,6,7,8]
```

하지만 앞에서 본 타입의 경우 위와 같은 동작을 모델링할 수 없다. 이는 [2016년 1월의 이슈](https://github.com/microsoft/TypeScript/issues/6594)로 인한 [역시 2016년 1월의 PR](https://github.com/microsoft/TypeScript/pull/6629)을 통해 수정되었다.

해당 이슈의 코멘트를 보면, 앞서 본 concat의 타입 정의는 유니온 타입이 도입되기 전에 작성되었고 몇몇 역사적 이유 때문에 제네릭 제한 타입(`U extends T[]`)을 사용했다고 한다. 하지만 당시에는 유니온 타입이 도입되어 있었. 그래서 다음과 같이 `concat`의 타입이 수정되었다.

```ts
interface Array<T> {
    // ...
    concat(...items: (T | T[])[]): T[];
}
```

사실 `concat`의 인수는 중첩된 배열도 가능한데 그런 동작은 타입 추론에 안 좋은 영향을 미치게 되기 때문에 도입되지 못했지만 그래도 좀 더 유연하고 직관적이기까지 한 타입이 되었다.

# 3. 두번째 개선 - 오버로딩 추가

## 3.1. 이슈

그리고 2016년 7월 [TS 이슈](https://github.com/microsoft/TypeScript/issues/9901)가 제기된다. `concat`에서 타입 추론이 제대로 이루어지지 않는다는 것이다. 문제의 코드는 이렇다.

```ts
// concat-bug.ts
var a : Array<[number, number]>= [[1, 2]];

// Typescript detects these first two tuples as arrays of numbers (`number[]`) instead of `[number, number]`
// error TS2345: Argument of type '[number[], number[], [number, number]]' is not assignable to parameter of type '[number, number] | [number, number][]'.
a.concat([[3, 4], [5, 6], [7, 8]]);
```

에러 메시지를 읽어 보면 `concat`의 인수 타입은 `[number, number] | [number, number][]`이어야 하는데 `concat`에 넘어간 인수가 다른 타입이라는 에러이다.

## 3.2. 분석

요약하자면 인수 배열의 첫 두 원소가 튜플이 아니라 `number[]`로 추론되는 것이 문제였다. 그럼 왜 이런 문제가 발생했을까?

당시 `concat`의 타입은 위에서 정의된 그대로였다. 이는 `concat`이 `T[]` 혹은 `T` 둘 다 인수로 받을 수 있었다는 뜻이다. 그런데 이렇게 하면 `concat`의 인수 타입을 추론하는데 문제가 생긴다.

```ts
interface Array<T> {
    // ...
    concat(...items: (T | T[])[]): T[];
}
```

이때 만약 `#2`의 예시처럼 `array.concat(1, [2, 3], 4)`와 같이 중첩 레벨이 섞여서 들어온다면 1, 4는 top-level argument `T`, `[2, 3]`은 list-wrapped argument `T[]`로 그리고 `T`는 `number`로 쉽게 추론될 수 있다.

하지만 위처럼 `[[3, 4], [5, 6], [7, 8]]`같은 것이 `concat`의 인수로 들어오면 컴파일러 입장에서는 어떻게 타입 추론을 해야 하는지 모호해진다.

먼저 `[[3, 4], [5, 6], [7, 8]]` 자체를 top-level argument 즉 단일 인수로 추론할 수 있다. `[[3, 4], [5, 6], [7, 8]]` 자체가 `T`타입이라고 보는 것이다. 그럴 경우 인수를 통해 추론된 `T` 타입은 `number[][]`이거나 `[number, number][]`이다.

아니면 컴파일러는 `[[3, 4], [5, 6], [7, 8]]`이 list-wrapped argument라고 생각할 수 있다. 이 경우 `[[3, 4], [5, 6], [7, 8]]`은 `T[]`타입이 되고 거기서 추론된 `T`타입은 `number[]` 혹은 `[number, number]`이다.

만약 후자로 추론된다면 위의 이슈는 없었겠지만 안타깝게도 TS는 전자로 추론했다. 그래서 `concat`에서 추론된 `T` 타입은 `number[][]`가 되었다. 이는 `a`의 타입인 `Array<[number, number]>`의 `T=[number, number]`와 호환되지 않았다. 그래서 에러가 뜬 것이다.

## 3.3. 해결

#2에서 사라졌던 오버로딩이 있을 때는 이런 문제가 없었다. 그 이유는 `concat`의 인수 타입이 `T[][]`로, 정확히는 `T[]`의 서브타입인 `U`에 대해서 `U[]`로 우선적으로 추론되었기 때문이다.

```ts
// 당시 사라졌던 concat의 오버로딩
concat<U extends T[]>(...items: U[]): T[];
```

해당 오버로딩을 없앨 당시에는 이런 문제가 없었지만 이슈가 제기되고 나서는 다시 도입되었다. 완전히 똑같은 형태는 아니고 `T[][]`를 받는 오버로딩이 우선적으로 적용되도록 추가함으로써 이를 해결했다. 

```ts
interface Array<T> {
    concat(...items: T[][]): T[];
    concat(...items: (T | T[])[]): T[];
}
```

이렇게 하면 인수 타입을 `T[][]`으로 추론하는 오버로딩이 우선적으로 적용되기 때문에 위의 추론 문제가 해결된다.

## 3.4. ReadonlyArray와의 싱크

`ReadonlyArray`는 읽기 전용 배열(`push`, `pop`등이 빠진)이므로 `Array`의 슈퍼타입이다. 그런데 [`Array.concat`의 오버로딩 변경이 `ReadonlyArray`에는 적용되지 않아서 `ReadonlyArray`에 `Array`를 할당할 수 없게 되어버린 이슈가 있었다.](https://github.com/microsoft/TypeScript/issues/10368)

따라서 [2016년 8월의 PR에서 `ReadonlyArray`에도 `concat`의 오버로딩 변경이 적용되도록 수정되었다.](https://github.com/microsoft/TypeScript/pull/10374)

```ts
interface ReadonlyArray<T> {
    concat(...items: T[][]): T[];
    concat(...items: (T | T[])[]): T[];
}
```

# 4. 인수를 ReadonlyArray로 변경

원리상 `ReadonlyArray`도 `concat`을 할 수 있어야 맞다. [그런데 기존의 오버로딩에서는 인수를 `T[][]` 등 어쨌든 배열, 즉 `Array` 타입으로 추론하기 때문에 `ReadonlyArray`끼리는 `concat`을 제대로할 수 없다는 이슈가 있었다.](https://github.com/microsoft/TypeScript/issues/17076)

따라서 [2017년 8월 `concat`의 인수가 되는 배열을 기본적으로 `ReadonlyArray`로 추론하도록 수정되었다.](https://github.com/microsoft/TypeScript/pull/17806)

```ts
interface ReadonlyArray<T> {
    concat(...items: ReadonlyArray<T>[]): T[];
    concat(...items: (T | ReadonlyArray<T>)[]): T[];
}

interface Array<T> {
    concat(...items: ReadonlyArray<T>[]): T[];
    concat(...items: (T | ReadonlyArray<T>)[]): T[];
}
```

# 5. 가장 최신의 개선

## 5.1. 이슈

[다음과 같은 코드 이슈가 있었다.](https://github.com/microsoft/TypeScript/issues/20268)

```ts
// Error:(3, 28) TS2345:Argument of type 'Processor[]' is not assignable to parameter of type 'Processor | ReadonlyArray<Processor>'.
type Processor<T extends object> = <T1 extends T>(subj: T1) => T1

function doStuff<T extends object, T1 extends T>(parentProcessors: Array<Processor<T>>, childProcessors : Array<Processor<T1>>) {
    childProcessors.concat(parentProcessors);
}
```

일단 이 코드를 한 번 살펴보자. `Processor<T>` 제네릭은 객체를 상속하는 타입 `T`를 사용하는데, `T`를 상속한 `T1`타입을 인수로 받아 같은 타입을 반환하는 함수 타입이다.

그리고 `doStuff`는 `childProcessors`에 `parentProcessors`를 병합하는 함수이다. `parentProcessors`는 `Processor<T>`의 배열이고 `childProcessors`는 `Processor<T1>`의 배열이다. `T1`은 `T`의 서브타입이다. 그런데 이 동작은 에러가 발생했다고 한다.

## 5.2. 분석

왜 이런 에러가 발생했는지에 대해 TS 리드 아키텍트인 [Anders Hejlsberg](https://github.com/ahejlsberg)가 남긴 [코멘트가 있다.](https://github.com/microsoft/TypeScript/issues/20268#issuecomment-362614906) 이를 해석해 보면 된다.

여기에는 가변성이라는 개념이 들어가는데 거기에 대해서는 [이전 글인 TS 탐구생활 - 가변성(Variance)이란 무엇인가](https://witch.work/posts/typescript-covariance-theory)를 참고할 수 있다.

### 5.2.1. 콜백의 인수로 쓰인 제네릭은 공변으로

일단 [콜백의 인수 타입으로 쓰인 제네릭을 공변으로 타입 체킹하도록 변경한 PR](https://github.com/microsoft/TypeScript/pull/15104)을 보자. 이 당시에는 함수 인수 타입을 반변으로 동작하도록 하는 `--strictFunctionTypes` 옵션이 없었고 따라서 함수 파라미터는 언제나 양변이었다. 물론 함수 파라미터는 반변으로 동작하는 것이 자연스럽지만 이는 제네릭을 기본적으로 공변으로 동작하도록 만들기 위한 타협이었다.

TODO : 왜 TS에서 제네릭을 기본적으로 공변으로 하는 타협이 있었는지에 대한 내용이 포함된 글은 작성 중이다. 추후 링크 추가예정

그런데 콜백 함수의 인수 타입은 어떨까? 콜백 함수의 형태를 생각해볼 때, 콜백 함수의 인수 타입으로만 쓰이는 제네릭 타입은 공변인 게 자연스럽다. 일반적으로 콜백 함수의 인수는 마치 리턴 타입과 같이 출력에 해당한다고 볼 수 있기 때문이다. 그렇게 타입 체킹하도록 변경한 것이 바로 이 PR이다.

예시로 보면 더 이해가 쉽다. 이런 제네릭의 대표적인 예시로는 `Promise<T>`가 있다. `T`는 `Promise<T>`에서 콜백함수의 인수 타입으로밖에 쓰이지 않는다. 용법을 생각해 보아도, `Dog`이 `Animal`의 서브타입이라면 `Promise<Dog>`는 `Promise<Animal>`의 서브타입인 게 자연스럽다.

이를 일반화하여 콜백 함수의 인수의 타입으로 쓰이는 제네릭 타입 인자를 공변으로 타입 체킹하도록 한 게 바로 위 PR이다. 따라서 `T`가 콜백함수 인자 타입으로 쓰일 때 `T`는 공변이다. 해당 PR의 원문에 가면 더 많은 예시를 볼 수도 있다. 이는 메서드가 콜백 함수를 받을 때도 마찬가지로 적용되어 메서드의 콜백 함수 인자도 공변이다. `Promise.then()`등의 메서드의 용법을 생각해 보면 합리적인 선택이다.

### 5.2.2. 위 코드의 구조 분석

다시 위의 코드로 돌아가보자.

```ts
// Error:(3, 28) TS2345: Argument of type 'Processor[]' is not assignable to parameter of type 'Processor | ReadonlyArray<Processor>'.
type Processor<T extends object> = <T1 extends T>(subj: T1) => T1

function doStuff<T extends object, T1 extends T>(parentProcessors: Array<Processor<T>>, childProcessors : Array<Processor<T1>>) {
    childProcessors.concat(parentProcessors);
}
```

분석에 직접적으로 연관이 있는 건 아니지만 `Processor<T>`는 반변이다. 이유는 다음과 같다. 해당 제네릭 타입은 `T1`을 타입 인수로 받아서 같은 타입을 리턴하는 함수이고 이 `T1`은 `T`의 서브타입으로 제한(constraint)되어 있다. 그리고 그 `T1`은 함수 매개변수로 쓰이는데 함수 매개변수는 반변이다. 따라서 `Processor<T>`는 반변이다.

그리고 당시의 `Array.concat` 타입을 보자.

```ts
interface Array<T> {
    concat(...items: ReadonlyArray<T>[]): T[];
    concat(...items: (T | ReadonlyArray<T>)[]): T[];
}
```

이 상황에서 `doStuff`의 `concat`에서 에러가 나지 않으려면 `parentProcessors`의 타입인 `Array<Processor<T>>`가 `ReadonlyArray<Processor<T1>>`의 서브타입이어야 한다. 그럴 수 있을까? 결론부터 말하면 그럴 수 없다.

이 구조적 타입 비교에서는 `Array<T>`의 모든 멤버가 `ReadonlyArray<T>`의 멤버에 대입될 수 있는지를 검사한다. 그런데 그중 `Array.indexOf()`메서드의 검사에서 `searchElement`인수가 [Covariant checking for callback parameters PR 변경사항](https://github.com/microsoft/TypeScript/pull/15104)으로 인해 콜백함수의 인수로 추론된다. 이로 인해 `T`는 공변으로 타입 검사된다.

이때 `Array.indexOf()`메서드의 타입은 다음과 같다.

```ts
interface Array<T> {
    // ...
    indexOf(searchElement: T, fromIndex?: number): number;
    // ...
}
```

그러니 `childProcessors.concat`의 입장에서는 다음과 같은 형태를 생각하고 `.indexOf`를 콜백 함수로, `searchElement`를 콜백함수 인수로 취급하게 된 것이다.

```ts
childProcessors.concat(parentProcessors.indexOf(searchElement, ...))
```

따라서 구조적 타입 비교에서도 `indexOf`의 `searchElement`인수를 콜백 인자로 생각하고 공변으로 타입 검사하게 된다.

그런데 `Array.indexOf`에서는 `T` 타입이 메서드 인수로 쓰이고 있으므로 `T`는 반변이다. 즉 `concat`의 관점에서는 콜백 메서드인 `indexOf`로 인해 콜백 메서드 인자 타입인 `T`가 공변이고 `Array<T>`의 관점에서는 메서드 인자 타입인 `T`가 반변이다. 따라서 `Array<T>`는 온전히 공변도 반변도 아니기에 불변이 된다.

[TS에서 이런 일은 이미 `push`등의 배열 메서드에 의해 예견되어 왔고 TS팀은 메서드 매개변수를 늘 양변으로 취급하는 타협을 통해서 이 문제를 회피해 왔다. 여기에 관해서는 이현섭 님의 '공변성이란 무엇인가'를 참고할 수 있다.](https://seob.dev/posts/%EA%B3%B5%EB%B3%80%EC%84%B1%EC%9D%B4%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80)

따라서 [이후에 콜백 함수 인수를 반변으로 타입 체킹하는 PR](https://github.com/microsoft/TypeScript/pull/18976)이 머지된 이후에도 메서드 인수의 타입은 여전히 양변인 구멍으로 남아 있었다. [PR의 댓글](https://github.com/microsoft/TypeScript/pull/18976#issuecomment-334623422)에도 콜백의 타입이 메서드가 아닐 때만 콜백 함수에 대한 엄격한 타입 체킹이 일어난다고 되어 있다.

> I suppose we could say that a callback parameter check occurs only if the callback type isn't declared as method.

[메서드의 콜백 함수 타입에 대해 엄격한 타입 체킹이 일어나지 않는 이유는 콜백 함수의 리턴타입에 의존하는 타입이 많았기 때문이다. 예를 들어 `reduce`같은 메서드가 있었다.](https://github.com/microsoft/TypeScript/issues/18963#issuecomment-334586832)

```ts
/* 만약 reduce의 콜백을 엄격하게 타입 체킹했다면 `T`는 함수 인수 타입이기도 하므로 반변인데 콜백 인수이기도 하므로 공변이다. 따라서 이렇게 하면 Array<T>의 공변은 불가능해져 버린다 */
interface Array<T> {
    // ...
    reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue?: T): T;
    // ...
}
```

하지만 [앞서 보았던 PR의 변경사항](https://github.com/microsoft/TypeScript/pull/15104)은 적용되는 것으로 보인다. 메서드가 콜백 함수로 쓰이게 된 경우 해당 콜백의 인수 타입이 공변으로 검사되는 것이다.

> where T is used only in callback parameter positions, will be co-variant (as opposed to bi-variant) with respect to T, ...

즉 TS에서는 원래 메서드 매개변수 타입(앞서와 같이 `T`라고 하자)을 양변으로 취급한다. 그런데 `Array.indexOf`가 `concat`의 입장에서 콜백으로 취급되면서 `T`가 양변으로 타입 검사되지 않는다. 이 타입 검사 결과 `T`는 공변일 수도 반변일 수도 없으므로 불변이 되어버린다. 이는 해당 상황에서 `Array`가 `ReadonlyArray`의 서브타입이 아니도록 하였고 그로 인해 위에서 본 코드에서 `parentProcessors`의 타입이 `childProcessors`의 타입의 서브타입이 아니게 된다. 고로 에러가 발생한다.

이외에도 `--strictFunctionTypes` 하에서 `ReadonlyArray`와 `Array`를 구조적으로 비교하는 건 둘을 불변으로 만드는 문제가 있다는 건 [다른 이슈 댓글](https://github.com/microsoft/TypeScript/issues/20454#issuecomment-406453517)에서도 볼 수 있다.

고로 `doStuff`의 `concat`은 실패한다.

참고로 `indexOf`등을 공변으로 동작하게 하는 등의 해결책이 논의되었지만 많은 제한을 두거나 `any`타입을 사용하게 되는 문제가 있었다고 한다. 따라서 `concat`의 타입을 그대로 두면 이런 문제가 발생할 수밖에 없었다.

## 5.3. 쉬운 해결책

결국 문제는 `Array<T>`가 `ReadonlyArray<T>`의 서브타입이 아니라는 데에서 발생했다.

이를 고치기 위해서는 아주 간단한 방법이 있는데, `concat`의 인수 타입을 `ReadonlyArray<T>`뿐 아니라 `Array<T>`도 포함된 유니언으로 바꾸면 된다. [그렇게 한 PR](https://github.com/microsoft/TypeScript/pull/20455)에서는 다음과 같은 오버로딩으로 `concat`의 타입을 수정하였다.

```ts
interface Array<T> {
    concat(...items: (T[] | ReadonlyArray<T>)[]): T[];
    concat(...items: (T | T[] | ReadonlyArray<T>)[]): T[];
}
```

[당시의 댓글에는 이런 제안도 있었다. 콜백 내에서 배열을 수정하는 건 당연히 좋은 일이 아니므로 `Array<T>`의 메서드 내의 모든 콜백 함수 타입이 `ReadonlyArray<T>`를 사용하게 하면 깔끔하게 해결된다는 것이다. 하지만 이는 당연히 breaking change가 된다. 따라서 다음 섹션에서 살펴볼 해결책이 등장하였다.](https://github.com/microsoft/TypeScript/pull/20455#issuecomment-362371634)

## 5.4. 구조적 타이핑 기반의 해결책

[2018년이 되어서 현재와 같은 타입의 PR이 나오게 되는데](https://github.com/microsoft/TypeScript/pull/21462)그 과정은 다음과 같다. 먼저 `Array.concat`의 기존 타입이 `ReadonlyArray<T>`와의 유니언을 받는 것이 컴파일 속도를 느리게 만들었고 따라서 다음과 같이 오버로딩이 수정되었다.

```ts
interface Array<T> {
    concat(...items: T[][]): T[];
    concat(...items: ReadonlyArray<T>[]): T[];
    concat(...items: (T | T[])[]): T[];
    concat(...items: (T | ReadonlyArray<T>)[]): T[];
}
```

하지만 오버로딩이 이렇게 많은 게 좋지 않다고 본 [Anders Hejlsberg](https://github.com/ahejlsberg)는 `concat`의 인수 역할을 할 새로운 타입을 도입하자는 제안을 한다. `Array<T>` 혹은 `ReadonlyArray<T>` 타입이 인수로 들어왔을 때 구조적 타이핑 검사를 통과할 수 있고 또한 구조적 타입 검사에서 `Array<T>`나 `ReadonlyArray<T>`를 불변으로 취급되게 할 `indexOf`등의 메서드를 모두 제거한 `InputArray<T>`이었다.

```ts
interface InputArray<T> {
    readonly length: number;
    readonly [n: number]: T;
    join(separator?: string): string;
}
```

`join`은 `string` 혹은 배열과 비슷하게 보일 수 있는 다른 객체와 겹치는 상황을 피하기 위해 남겨둔 메서드였다. 그리고 `concat`을 이렇게 바꾸길 제안한다.

```ts
interface Array<T> {
    concat(...items: InputArray<T>[]): T[];
    concat(...items: (T | InputArray<T>)[]): T[];
}
```

이는 `ReadonlyArray<T>`를 사용하는 것에 비해 약간 덜 타입 안전하다고 할 수 있다. `InputArray<T>` 조건을 만족하는 배열이 아닌 객체가 `concat`의 인수로 들어올 수 있기 때문이다. 하지만 그렇게까지 위험해지는 건 아니고, 오버로딩도 줄어들고, `Array<T>`와 `ReadonlyArray<T>`를 구조적으로 비교할 때 불변으로 취급되는 문제도 해결되며 컴파일 속도도 10% 빨라졌다고 한다(이 컴파일 속도 향상에 대해서는 이견이 있는 듯 하지만 어쨌든 느려지지는 않았다고 한다).

그러나 위의 `InputArray<T>`정의는 `length`프로퍼티와 `join(string): string`메서드만 있으면 되기에 너무 쉽게 겹칠 수 있다는 이야기가 나왔다. 따라서 `slice`메서드를 추가하고 이름을 `ConcatArray`로 바꾼 다음 타입이 등장했다.

```ts
interface ConcatArray<T> {
    readonly length: number;
    readonly [n: number]: T;
    join(separator?: string): string;
    slice(start?: number, end?: number): T[];
}
```

그리고 `concat`의 오버로딩은 다음과 같이 바뀌었다. 이게 현재의 `concat`의 타입이다.

```ts
interface Array<T> {
    concat(...items: ConcatArray<T>[]): T[];
    concat(...items: (T | ConcatArray<T>)[]): T[];
}
```

# 6. 앞으로

지금은 2023년 12월이고, `concat`에 관한 마지막 PR이 머지된 지 5년이 지났다. 그 사이에 많은 이슈 보고가 있었다. [예를 들어서 빈 배열은 `concat`의 target이 될 수 없는 문제 등이 있다.](https://github.com/microsoft/TypeScript/issues/26976)

```ts
// No overload matches this call.
let a1 = [].concat(['a']);
```

[이를 수정하기 위한 PR](https://github.com/microsoft/TypeScript/pull/33645)도 있었지만 [배열 타입에 어떤 변화를 만들기 힘든 상황이기 때문에 긴 시간 반영되지 못하고 있다.](https://github.com/microsoft/TypeScript/pull/33645#issuecomment-1058376819)

새롭게 제시된 `concat`의 오버로딩도 있다. `ConcatArray<T>` 타입은 아까와 같다.

```ts
interface Array<T> {
    concat(...items: ConcatArray<T>[]): T[];
    concat<U extends any[]>(...items: U): (T | Flatten<U[number]>)[];
}

type Flatten<T> = T extends undefined ? T : T extends ConcatArray<infer U> ? U : T;
```

이 오버로딩은 빈 배열도 `concat`의 target이 될 수 있게 하고 서로 다른 타입 간에도 `concat`이 가능하게 하는 등 여러 이슈를 해결한다.

따라서 해당 PR을 잘 반영해서 배열 타입을 수정해 보기 위해 [TS팀은 배열 메서드가 기대하는 대로 동작하지 않는 예시들을 모으는 PR을 현재 열어 놓은 상태이다.](https://github.com/microsoft/TypeScript/issues/36554) 언젠가 위의 개선안이 받아들여져서 `concat` 타입의 발전이 있었으면 좋겠다.


# 참고

[Anders Hejlsberg](https://github.com/ahejlsberg)의 얼굴을 이슈에서 너무 많이 보아서 이제 내적 친밀감이 생겨 버렸다.

MDN의 `Array.prototype.concat()` 문서 https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/concat

weird Array.concat declaration and associated LanguageService/typeChecker issues https://github.com/microsoft/TypeScript/issues/738

Union types and array.concat problem https://github.com/microsoft/TypeScript/issues/4216

Confusing type error message in concat https://github.com/microsoft/TypeScript/issues/6594

Update Array.concat type signature to fix #6594 https://github.com/microsoft/TypeScript/pull/6629

Tuple types get incorrect contextual type https://github.com/microsoft/TypeScript/issues/9901

Re-add strict concat signature https://github.com/microsoft/TypeScript/pull/9997

Array not assignable to ReadonlyArray with subclass items https://github.com/microsoft/TypeScript/issues/10368

Improve `ReadonlyArray<T>.concat` to match `Array<T>` https://github.com/microsoft/TypeScript/pull/10374

Can't concat ReadonlyArray https://github.com/microsoft/TypeScript/issues/17076

Array arguments to concat should be ReadonlyArrays https://github.com/microsoft/TypeScript/pull/17806

polymorphic arguments validation error https://github.com/microsoft/TypeScript/issues/20268

Generic parameters not fully type-checked (e.g., Promise) https://github.com/microsoft/TypeScript/issues/14770

Covariant checking for callback parameters https://github.com/microsoft/TypeScript/pull/15104

Array of generic functions not assignable to ReadonlyArray #20454 의 댓글 https://github.com/microsoft/TypeScript/issues/20454#issuecomment-406453517

Hack to allow concat to work even when an Array isn't assignable to ReadonlyArray https://github.com/microsoft/TypeScript/pull/20455

strictFunctionTypes has different behavior with parameter types and return types #18963 https://github.com/microsoft/TypeScript/issues/18963

Strictly check callback parameters #18976 https://github.com/microsoft/TypeScript/pull/18976

Overloads in Array.concat now handle ReadonlyArray https://github.com/microsoft/TypeScript/pull/21462

Add additional overloads to Array.prototype.concat #26976 https://github.com/microsoft/TypeScript/issues/26976

Better typings for Array.concat(), etc. https://github.com/microsoft/TypeScript/pull/33645

Array method definition revamp: Use case collection https://github.com/microsoft/TypeScript/issues/36554

공변성이란 무엇인가 https://seob.dev/posts/%EA%B3%B5%EB%B3%80%EC%84%B1%EC%9D%B4%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80