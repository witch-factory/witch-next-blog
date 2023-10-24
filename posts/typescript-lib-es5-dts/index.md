---
title: TS 탐구생활 - lib.es5.d.ts 분석
date: "2023-10-22T00:00:00Z"
description: "TS의 enum type에 대해 알아보자"
tags: ["typescript"]
---

`lib.es5.d.ts`에는 TS에서 제공하는 기본적인 타입들이 들어 있다. 이 파일을 한번 분석해보자. 물론 `lib.es2015.core.d.ts`등 다른 파일들도 있지만 어쨌든 기본적인 타입들의 선언을 제공한다는 점에서는 마찬가지다.

# 1. 객체 유틸리티 타입

## 1.1. Partial

`Partial<T>`는 T의 모든 프로퍼티를 optional로 만든 타입이다. 다음과 같이 사용할 수 있다.

```ts
type Person={
    name:string,
    age:number,
}

/*
{
    name?:string,
    age?:number,
}
*/
type P=Partial<Person>
```

그리고 이런 식으로 선언되어 있다.

```ts
type Partial<T> = {
    [P in keyof T]?: T[P] | undefined;
};
```

## 1.2. Required

`Required<T>`는 T의 모든 프로퍼티를 required로 만든 타입이다. 다음과 같이 사용할 수 있다.

```ts
type Person={
    name?:string,
    age?:number,
}

// 모든 속성이 Required로 바뀐다.
type P=Required<Person>
```

그리고 이런 식으로 선언되어 있다. `T`의 모든 요소들에 대해서 `?`를 제거한 것이다.

```ts
type Required<T> = {
    [P in keyof T]-?: T[P];
};
```

## 1.3. Readonly

`Readonly<T>`는 T의 모든 프로퍼티를 readonly로 만든 타입이다. 다음과 같이 사용할 수 있다. 위와 비슷하게 이렇게 선언되어 있다.

```ts
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};
```

## 1.4. Pick

`Pick<T, K>`는 T의 프로퍼티 중 K에 해당하는 프로퍼티만을 가지는 타입이다. 다음과 같이 사용할 수 있다.

```ts
type Person={
    name:string,
    age:number,
}

type P=Pick<Person, "name">
```

이렇게 선언되어 있다.

```ts
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
```

`K extends keyof T`라는 제약이 있어 `K`는 `T`의 프로퍼티 이름들 중 하나여야 한다. 여담이지만 이를 극복하려면 컨디셔널 타입을 사용할 수 있다.

다음과 같이 하면 `Pick`에 주어진 K에서 `T`의 프로퍼티 이름이 아닌 것들을 제거하고 `Pick`을 실행할 수 있다.

```ts
type CustomPick<T, K>={
    [P in (K extends keyof T ? K :never)]: T[P];
}
```

그런데 이렇게 하면 만약 `K`가 `T`의 프로퍼티 이름이 아닌 것들로만 이루어져 있다면 결과는 `{}`가 되어서 `Object`타입으로 동작하게 된다. 따라서 null, undefined를 제외한 모든 것을 넣을 수 있는 타입이 되어버리는 문제가 있다.

## 1.5. Record

`Record<K, T>`는 프로퍼티가 `K타입 : T타입`인 타입을 만들어준다. 다음과 같이 선언되어 있다.

```ts
type Record<K extends keyof any, T> = {
    [P in K]: T;
};

type Color="Red" | "Green" | "Blue";
type ColorRecord=Record<Color, number>;
```

## 1.6. Exclude, Extract

`Exclude<T, U>`는 `T`에서 `U`에 해당하는 타입을 제거한 타입을 만들어준다. 다음과 같이 선언되어 있다.

```ts
type Exclude<T, U> = T extends U ? never : T;
```

반대로 `Extract<T, U>`는 `T`에서 `U`에 해당하는 타입만을 추출한 타입을 만들어준다. 다음과 같이 선언되어 있다.

```ts
type Extract<T, U> = T extends U ? T : never;
```

## 1.7. Omit

`Omit<T, K>`는 `T`에서 `K`에 해당하는 프로퍼티를 제거한 타입을 만들어준다. 이런 식으로 사용한다.

```ts
type Person={
    name:string,
    age:number,
    address:string,
}

/* 
{
    name:string,
    age:number,
}
*/
type P=Omit<Person, "address">
```

이렇게 선언되어 있다.

```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

`Pick`을 이용해서 `T`에서 `Exclude<keyof T, K>` 즉 `T`의 프로퍼티 이름 중 `K`에 해당하는 것을 제외한 것들을 추출하는 방식이다.

## 1.8. NonNullable

`NonNullable<T>`는 `T`에서 `null`과 `undefined`를 제거한 타입을 만들어준다. 다음과 같이 선언할 수 있다. 분배법칙을 이용해서 `T`에서 null이나 undefined에 해당하는 타입을 제거한다.

```ts
type NonNullable<T> = T extends null | undefined ? never : T;
```

최신 버전에서는 이게 좀더 간결하게 변했다. 인터섹션 타입을 사용한다.

```ts
type NonNullable<T>=T & {};
```

## 1.9. 예시

이를 조합해서 사용하면 일부 속성만 옵셔널로 만드는 타입을 만들어 볼 수 있다.

```ts
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
```

# 2. 유틸리티 타입

[infer](https://blog.witch.work/posts/typescript-infer-usage)를 활용한 유틸리티 타입들이 있다. 위 글에서 infer에 대해 자세히 다루었으므로 활용 코드만 보고 넘어간다. 이들은 `lib.es5.d.ts`에 선언되어 있다.

추상 클래스의 생성자 함수까지 포괄하기 위해 `abstract new (...args: any) => any`를 쓴 것 정도가 신기하다.

```ts
/**
 * 함수 타입의 파라미터를 튜플 타입으로 추출
 */
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

/**
 * 생성자 함수의 파라미터를 튜플 타입으로 추출
 */
type ConstructorParameters<T extends abstract new (...args: any) => any> = T extends abstract new (...args: infer P) => any ? P : never;

/**
 * 함수 타입의 반환 타입을 추출
 */
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

/**
 * 생성자 함수의 인스턴스 타입(즉 생성자 함수의 리턴 타입이다)을 추출
 */
type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer R ? R : any;
```

# 3. ThisType

`ThisType<T>`는 `T`를 `this`로 간주하는 타입을 만들어준다. 다음 예제를 보자. 이 코드에서는 `this`에 `balance`가 없다고 에러가 난다.

```ts
const account={
    data:{
        balance:1000,
        interest:0.05,
    },

    methods:{
        deposit(amount:number){
            this.balance+=amount;
        },
        calculate(){
            this.balance+=this.balance * this.interest;
        }
    }
}
```

`this`에 타입을 지정하여 이를 해결할 수 있다. `this`를 `account`객체가 아니라 `Data & Methods`타입으로 간주하여 `balance`가 있다고 간주하게 만든다.

```ts
type Data={
    balance:number;
    interest:number;
}

type Methods={
    deposit(this:Data & Methods, amount:number):void;
    calculate(this:Data & Methods):void;
}

type Account={
    data:Data,
    methods:Methods,
}

const account:Account={
    data:{
        balance:1000,
        interest:0.05,
    },

    methods:{
        deposit(amount:number){
            this.balance+=amount;
        },
        calculate(){
            this.balance+=this.balance * this.interest;
        }
    }
}
```

이런 식으로 하면 모든 메서드에 `this`인수를 전부 타이핑해야 하므로 번거롭다. 이를 해결하기 위해 `ThisType<T>`를 사용할 수 있다. `ThisType<T>`는 `T`를 `this`로 간주하는 타입을 만들어준다. 다음과 같이 사용할 수 있다.

이렇게 `Methods`, `Account`타입을 바꾸면 `Methods` 타입의 메서드들의 `this`가 `Data & Methods`를 간주된다.

```ts
type Methods={
    deposit(amount:number):void;
    calculate():void;
}

type Account={
    data:Data,
    methods:Methods & ThisType<Data & Methods>,
}
```

이 타입을 `lib.es5.d.ts`에서 찾아보면 다음과 같이 선언되어 있다.

```ts
interface ThisType<T> { }
```

타입스크립트 코드로 구현되어 있지 않고 뭔가 특수한 내부 로직을 통해서 `this`의 타이핑을 해주는 것 같다.

# 4. 배열 메서드 타이핑

`lib.es5.d.ts`에는 배열 메서드들의 타입이 선언되어 있다. 이를 보면서 배열 메서드들의 타입을 알아보자.

## 4.1. forEach

`forEach`는 다음과 같이 선언되어 있다. 물론 다른 형태의 배열 타입에도 선언되어 있지만 `Array<T>`에 있는 것을 알아보자. 다른 배열 타입에도 똑같은 형태로 선언되어 있기 때문이다.

`forEach`의 콜백 함수 매개변수는 배열의 각 요소 값, 인덱스, 원본 배열이다. 각각은 배열의 요소 값인 제네릭 `T`를 이용해서 타이핑되어 있다.

```ts
interface Array<T> {
    /**
     * Performs the specified action for each element in an array.
     * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
     * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
}
```

그리고 2번째 매개변수인 `thisArg`가 이다. 콜백 함수 선언문에서 `this`값을 직접 바꿀 수 있게 하는 부분이다. 바꾸지 않으면 브라우저에서는 this가 window, node에서는 global이 된다.

문제는 `this`의 타입이 제대로 추론되지 않는다. 가령 다음과 같은 코드에서는 `this`가 `number[]`로 추론되는 게 맞다.

```ts
[1,2,3].forEach(function(){
    console.log(this);
});
```

이를 제대로 타이핑되게 수정하면 이렇게 된다. 인터페이스 병합을 위해서는 `Array<T>`형태를 사용해야 하기 때문에 `K`는 `customForEach`자리에 제네릭으로 선언한다. `thisArg`에 인수를 넣게 되면 해당 인수 타입을 추론해서 `this`의 타입인 `K`에 넣어준다.

```ts
interface Array<T> {
  customForEach<K = Window>(
    callbackfn: (this: K, value: T, index: number, array: T[]) => void,
    thisArg?: K
  ): void;
}
```

## 4.2. map

`map`은 다음과 같이 선언되어 있다. 배열의 각 원소를 나타내는 제네릭 `T`를 사용하고 `(value, index, array)`를 인수로 가진다는 점에서 `forEach`와 비슷하다. 또한 실행 환경에 따라 `thisArg`는 달라지므로 `any`로 선언되었다.

다른 점은 `U`제네릭이 도입되었다는 것이다. 이는 `map`의 반환값 타입이 배열 요소 타입과 다를 수 있기 때문이다. 그런데 `map`특성상 이는 콜백 함수 반환값과 같으므로 콜백 함수 반환값을 통해 `U`를 추론하고 이를 `map`의 반환 배열 요소 타입으로 한다.

```ts
interface Array<T> {
  // ...
    /**
     * Calls a defined callback function on each element of an array, and returns an array that contains the results.
     * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];
}
```

이 또한 `thisArg`의 타이핑이 제대로 되지 않는 문제가 있는데 위에서 한 것처럼 제네릭을 이용해서 `thisArg`의 타이핑을 할 수도 있다.

## 4.3. filter

`lib.es5.d.ts`에서 `Array<T>`의 filter 메서드를 찾아보면 다음과 같이 선언되어 있다.

```ts
interface Array<T> {
  // ...
    /**
     * Returns the elements of an array that meet the condition specified in a callback function.
     * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
     */
    filter<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[];
    /**
     * Returns the elements of an array that meet the condition specified in a callback function.
     * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
     */
    filter(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): T[];
}
```

전반적으로 위와 비슷한데 오버로딩이 된 것을 볼 수 있다. 일단 위쪽 타입부터 살펴보자. `filter`의 리턴 타입은 원래 배열 요소의 타입과 다를 수도 있으므로 filter의 반환 배열의 요소 타입이 될 `S`를 도입했다. 이때 `S`는 `T`에 대입할 수는 있어야 하기 때문에 `S extends T`로 제한했다.

그런데 `predicate`콜백이 true를 반환할 시 filter의 반환 배열에 포함되는데 이렇게 반환 배열에 포함되는 요소의 타입은 `S`가 되어야 한다. 그래서 `predicate`의 반환 타입을 `value is S`로 하였다. 여기까지 완성한 것이 바로 위쪽 타입이다.

```ts
filter<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[];
```

그럼 먼저 이 타입이 잘 동작하는지 확인해보자.

```ts
interface Array<T>{
    customFilter<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[];
}
// Signature '(v: number): boolean' must be a type predicate
const r1=[1,2,3].customFilter((v)=>v<2);
```

customFilter에 넘긴 콜백 함수가 타입 predicate가 아니라서 오류가 발생한다. 이를 해결하기 위해서는 콜백 함수를 type predicate로 만들어줘야 한다.

```ts
const r1=[1,2,3].customFilter((v):v is number=>v<2);
```

또한 type predicate 특성상 boolean이 아닌 다른 타입을 반환하면 오류가 발생한다.

```ts
// 이렇게 하면 오류
const r1=[1,2,3].customFilter((v):v is number=>v%2);
// 이렇게 해야 한다
const r1=[1,2,3].customFilter((v):v is number=>v%2===1);
```

즉 2가지 문제가 있다. 먼저 콜백 함수의 반환값을 type predicate로 직접 타이핑해줘야 한다. 그리고 콜백 함수 반환값이 boolean이 아니면 오류가 발생한다.

이런 제한을 해제하여 콜백이 type predicate가 아니라도, 또 콜백의 리턴값이 boolean이 아니라도 잘 동작하게 하기 위해서 위와 같은 오버로딩을 한 것이다. 실제 `filter`메서드와 똑같은 타이핑을 하면 이렇게 된다. type predicate 함수가 아닌 콜백 함수를 넘기는 게 둘 중 아래 타입이다. 꼭 콜백이 boolean을 리턴할 필요는 없기 때문에 콜백의 리턴타입은 unknown으로 선언되어 있다.

```ts
interface Array<T>{
    customFilter<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[];
    customFilter(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): T[];
}
```

단 실제 배열에 `customFilter`메서드는 없기 때문에 만약 `[1,2,3].customFilter((v)=>v%2);`과 같은 코드를 실행하고자 하면 에러가 발생한다. TS에서 타입 에러가 없다고 해서 무조건 오류가 없는 코드인 건 아니다.

## 4.4. reduce

배열의 reduce 메서드는 배열 전체의 값을 순회하면서 특정 값을 만들어 리턴하는 메서드다. 다음과 같은 형태를 가진다. 콜백함수는 누적값, 현재값, 인덱스, 원본 배열을 인수로 받는다. 

콜백 함수의 누적값 `accumulator`는 `initialValue` 인수가 주어지면 `initialValue`로 시작하고 아니면 배열의 첫번째 요소로 시작한다. 콜백 함수에서 누적값에 현재 값 등등을 이용해서 어떤 조작을 가해 리턴하면 그 값이 다음 인덱스 요소의 누적값이 되고 마지막 인덱스까지 처리를 마치면 reduce 함수가 리턴되는 식이다.

```ts
reduce(callbackFn)
reduce(callbackFn, initialValue)
// callbackFn은 이런 형태
callbackFn(accumulator, currentValue, currentIndex, array){
  return ...
}

// 사용 예시
[1,2,3,4,5].reduce((acc, cur)=>acc+cur); // 15
[1,2,3,4,5].reduce((acc, cur)=>acc+cur, ''); // '12345'
```

이 타입은 `lib.es5.d.ts`에 이렇게 선언되어 있다. 주석으로 `reduce`메서드에 대한 설명도 되어 있다. 3가지 형태로 오버로딩이 되어 있는데, 1, 2번째 오버로딩의 경우 반환값의 타입이 배열 요소와 같을 때에 대한 처리이다.

3번째 오버로딩은 반환값의 타입이 배열 요소와 다를 경우이다. 이런 경우는 `initialValue`가 배열 요소와 다른 타입일 경우(예를 들어 위처럼 배열 요소들은 숫자인데 `initialValue`로 문자열이 주어진 경우)이므로 `initialValue`의 타입을 제네릭 `U`로 선언하여 해결하였다.

```ts
    /**
     * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     */
    // initialValue를 옵셔널로 선언할 시 두 오버로딩을 하나로 합칠 수 있다
    reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T;
    reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T;
    /**
     * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     */
    reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
    /**
```

## 4.5. flat

### 4.5.1. flat 메서드

[MDN의 Array.prototype.flat()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)

`flat`메서드는 es2019에 도입된 메서드로 모든 하위 배열 요소가 지정된 깊이까지 평탄화된 배열을 생성해 반환한다. 평탄화할 깊이를 인수로 받으며 기본값은 1이다. 만약 2를 인수로 받으면 2차원 배열까지 평탄화된 배열을 반환한다. 그리고  평탄화할 수 있는 깊이보다 더 깊은 depth를 인수로 받을 시 1차원 배열까지 평탄화해 반환한다.

```ts
console.log([1, [[2,3], 4],5].flat()); // [1, [2,3], 4, 5]
console.log([1, [[2,3], 4],5].flat(2)); // [1, 2, 3, 4, 5]
console.log([1, [[2,3], 4],5].flat(4)); // [1, 2, 3, 4, 5]
```

그럼 이 메서드의 타이핑은 어떻게 되어 있는 걸까? 이 타입이 정의되어 있는 파일은 `typescript/lib/lib.es2019.array.d.ts`이다. 이 파일에는 es2019에 추가된 `Array<T>`에 대한 타입들이 정의되어 있다. `flat`메서드의 타입은 다음과 같이 선언되어 있다.

```ts
// lib.es2019.array.d.ts
type FlatArray<Arr, Depth extends number> = {
    "done": Arr,
    "recur": Arr extends ReadonlyArray<infer InnerArr>
        ? FlatArray<InnerArr, [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][Depth]>
        : Arr
}[Depth extends -1 ? "done" : "recur"];

// ReadonlyArray<T>는 거의 같으므로 생략

interface Array<T> {
    // flatMap은 생략

    /**
     * Returns a new array with all sub-array elements concatenated into it recursively up to the
     * specified depth.
     *
     * @param depth The maximum recursion depth
     */
    flat<A, D extends number = 1>(
        this: A,
        depth?: D
    ): FlatArray<A, D>[]
}
```

먼저 `flat`를 보자. 이 배열 메서드는 A, D를 받는 제네릭이다. 이때 A는 `this`타입이므로 flat을 호출한 배열을 통해서 자동으로 추론된다. 그리고 D또한 flat에 인수로 주어진 숫자를 통해서 추론되며 number타입임이 강제되는 것을 알 수 있다. 이 flat은 `FlatArray<A, D>`를 리턴한다.

```ts
interface Array<T> {
    flat<A, D extends number = 1>(
        this: A,
        depth?: D
    ): FlatArray<A, D>[]
}
```

그럼 `FlatArray<A, D>`는 뭘까? 이 타입으로 가보면 `FlatArray<Arr, Depth>`타입을 찾을 수 있다.

```ts
type FlatArray<Arr, Depth extends number> = {
    "done": Arr,
    "recur": Arr extends ReadonlyArray<infer InnerArr>
        ? FlatArray<InnerArr, [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][Depth]>
        : Arr
}[Depth extends -1 ? "done" : "recur"];
```

이는 배열 타입 같지만 사실 잘 보면 `done`, `recur` 2개의 key를 갖는 객체 타입에 컨디셔널 타입으로 key를 제공해서 특정 타입을 뽑아 오는 것이다. `Depth`가 -1이면 key는 done이, 아니라면 recur가 된다.

그러면 각 key가 가리키고 있는 타입은 뭘까? done이 key일 경우 그냥 배열 타입 그대로다. 이는 평탄화 작업이 끝났을 경우 현재까지 평탄화된 배열의 타입을 그냥 리턴함을 의미한다.

문제는 key가 recur일 경우이다. 이는 재귀적 타입으로 정의되어 있다. 먼저 모든 배열 타입은 `ReadonlyArray`에 대입 가능하므로 recur 프로퍼티 값의 `extends`는 참이 된다. 그러면 infer를 통해 `InnerArr`의 타입을 추론할 수 있게 되는데 이는 원본 배열의 멤버 타입을 의미한다. 그리고 이를 재귀적으로 `FlatArray`에 대입하게 된다. 그런데 이때 `[-1, 0, 1, ... , 20]`배열의 `Depth`인덱스에 접근해서 재귀 타입의 depth를 정의하게 되는데 배열 인덱스는 0부터 시작하므로 이 과정에서 재귀적으로 정의된 타입의 depth가 1 감소한다. 결국은 depth가 -1까지 줄어들어서 key가 done이 될 것이고 따라서 재귀적으로 정의된 타입이 리턴된다.

이렇게 튜플에 인덱스로 접근하는 것은 타입스크립트에서 숫자 리터럴 타입에 연산을 가할 수 없기 때문에 만들어진 편법이라고 한다.

만약 주어진 depth가 22라서 재귀적 type의 depth가 undefined가 되면 최대한 flat한 타입이 나오게 된다. 이는 타입 추론이 제대로 이루어지지 못한 것이지만 실제로 배열 depth가 22를 넘어갈 일이 거의 없기 때문에 이는 문제가 될 일이 거의 없다.

그리고 flat의 리턴 타입을 잘 보면 이 역시 배열이다. `FlatArray<A, D>`가 아니라 `FlatArray<A, D>[]`이다. 이로써 flat의 리턴 타입은 무조건 최소 1차원 배열임이 보장된다. 예를 들어서 flat을 호출한 배열이 1차원 number타입 배열이라면 이는 `FlatArray`제네릭에 A로 들어가게 된다.

그러면 `InnerArr`은 number로 추론될 테고 이는 `ReadonlyArray`를 extends 하지 않으므로 그대로 number가 된다. 즉 `FlatArray`타입의 결과는 `number`다. 하지만 `flat`의 리턴 타입은 `FlatArray[]`이므로 `flat`의 리턴 타입은 `number[]`가 된다.