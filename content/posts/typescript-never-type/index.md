---
title: TS 탐구생활 - TS의 never 타입
date: "2023-10-14T00:00:00Z"
description: "TS의 never 타입은 왜 존재하며 어디에 쓰일까?"
tags: ["typescript"]
---

# 1. TS의 never 타입

TS의 never 타입은 어떤 타입도 대입할 수 없으며 집합으로 치면 공집합과 같은 역할을 한다. 이를테면 유니언 타입에서 모든 타입이 배제되었을 때 never 타입이 된다.

```ts
function foo(param:string | number){
    if(typeof param==='string'){
        console.log("문자열입니다.");
    }
    else if(typeof param==='number'){
        console.log("숫자입니다.");
    }
    else{
        // 이때 param은 never타입
        param;
    }
}
```

혹은 에러를 발생시키거나 무한 루프를 도는 함수의 리턴타입으로도 쓰인다. 단 함수 선언문으로 그런 함수가 선언되었을 경우 그 함수의 리턴 타입은 void이고 함수 표현식으로 그런 함수가 선언되었을 때만 리턴타입이 never가 된다.

```ts
const errorFunc=()=>{
    throw new Error("테스트 에러");
}

const infFunc=()=>{
    while(true){}
}

// foo1, foo2는 never타입
const foo1=errorFunc();
const foo2=infFunc();
```

따라서 함수 선언문으로 선언된 함수가 에러를 발생시키는 함수일 경우 리턴 타입을 never로 명시해주는 것이 좋다.

```ts
function errorFunc():never{
    throw new Error("테스트 에러");
}
```

또한 tsconfig에서 `noImplicitAny`를 체크 해제시(혹은 false로 설정) 빈 배열이 `never[]`타입으로 추론된다.

그럼 이런 타입은 왜 존재하며, 어디에 쓰이는 걸까?

# 2. never 타입의 존재 이유

타입은 프로그램에 존재할 수 있는 값들을 그 능력에 따라 분류한 것이다. 예를 들어 정수 타입은 사칙연산에 사용할 수 있을 것이고 문자열 타입은 문자열을 조작하는 메서드를 사용할 수 있을 것이다. 이는 일종의 집합 같은 느낌이라 생각할 수 있다. 어떤 능력을 가진 값들을 모두 묶은 집합이 타입이 되는 것이다.

그럼 우리는 타입을 다루면서, 각 값들이 어떤 집합에 속해 있는지를 분류하게 된다. Typescript 기준으로 생각한다면 string 타입 집합에 `'ab'`같은 값들이 속하고 number 타입 집합에 `1`같은 값들이 속하는 것이다. 이때 never 타입 집합은 아무것도 포함하지 않는다.

왜 이런 타입이 존재하는 것일까? 이런 경우를 생각해 보자.

다음과 같은 함수가 있다고 생각해보자. 메시지를 출력하고 바로 에러를 던져서 프로그램을 종료시키는 함수이다. 이 함수의 리턴타입은 무엇이 되어야 할까? `???`으로 일단 표기하겠다.

```ts
function throwError(string msg): ??? {
  console.log(msg);
  throw new Error(msg);
}
```

이 함수를 다른 곳에서 사용한다고 생각해 보면 이렇게 생각할 수 있다.

```ts
function divide(x:number, y:number): ??? {
  if(y===0){
    throwError("0으로 나눌 수 없습니다.");
  }
  return x/y;
}
```

그런데 이때 `divide`에서 `y`가 0일 시 아예 리턴을 하지 않고 함수가 종료되어 버린다. 에러가 발생하기 때문이다. 그렇지 않을 때는 계산이 무사히 완료되어 `x/y`가 리턴되므로 `divide`의 리턴타입은 `x/y`의 타입 즉 number가 된다.

그러면 `throwError`의 리턴타입도 number가 되는 게 합리적으로 보인다. 어차피 `throwError`는 함수 내용을 제대로 끝내지 못하고 종료되고, 나머지 경우에 `divide`는 number를 리턴하므로 `throwError`의 리턴타입도 똑같이 number로 하는 것이다.

하지만 이럴 경우 `throwError`가 다른 리턴타입을 가진 함수 내에서 쓰일 경우 문제가 생긴다. 예를 들어 다음과 같은 것이다.

```ts
function concat(x:string, y:string): string {
  if(x.length+y.length>10){
    throwError("문자열이 너무 길어요!");
  }
  return x+y;
}
```

이럴 경우 `concat`의 리턴타입은 `throwError`의 리턴타입인 number가 되어야 하는데, 이는 에러가 발생하지 않았을 때 `concat`이 리턴하는 string타입과는 다르다. 그래서 `throwError`의 리턴타입을 number로 하는 것은 좋지 않다.

하지만 핵심은, 여기서 `throwError`의 리턴타입이 결코 쓰일 일이 없다는 것이다. `throwError`가 호출되면 에러가 발생해 프로그램이 종료되기 때문이다. 따라서 사실 `throwError`의 리턴타입은 무엇이 되어도 상관이 없다. 타입 검사를 통과하기만 하면 된다.

이런 경우를 위해서 `never`타입이 있다. 어디서든 쓰일 수 있고, 하지만 이 타입을 리턴하는 함수가 아예 끝마쳐지지 못한다는 것을 나타내기에 절대로 쓰일 일이 없는 타입으로 말이다.

그리고 여기에 가장 적절한 것은 타입을 집합으로 따졌을 때 공집합으로 정의되는 타입이다. 모든 타입의 서브타입이 될 수 있고, 어떤 서술을 해도 공허참이 되기 때문이다. 

따라서 이 경우 `throwError`의 리턴타입은 never가 된다.

```ts
function throwError(string msg): never {
  console.log(msg);
  throw new Error(msg);
}
```

마찬가지로 무한 루프를 도는 함수의 리턴 타입도 never가 된다. 이 함수는 영원히 리턴하지 않기 때문이다.

```ts
function infLoop(): never {
  while(true){}
}
```

참고로 never의 동작은 정말 공집합과 비슷하여 어떤 값과 union을 해도 의미가 없고, 어떤 값과 intersection을 해도 결과를 never로 추론한다.

# 3. never의 용도

## 3.1. 구조적 타이핑 비허용

어떤 객체가 a속성 혹은 b속성만 가질 수 있다고 하자. 그러면 다음과 같이 타입을 정의할 수 있다.

```ts
type AorB={
    a:string;
} | {
    b:number;
}
```

하지만 이런 타입은 구조적 타이핑을 허용한다. 즉 다음과 같이 정의된 객체는 위 타입을 만족한다. 이 객체는 a속성도 b속성도 가지고 있기 때문이다.

```ts
const obj:AorB={
    a:"hello",
    b:3,
}
```

만약 a속성과 b속성 둘 중 하나만 가지도록 하고 싶다면 never를 사용할 수 있다. 다음과 같이 `AorB`를 정의하면 위와 같은 객체는 `AorB`의 타입 검사를 통과하지 못한다.

```ts
type AorB={
    a:string;
    b?:never;
} | {
    a?:never;
    b:number;
}
```

## 3.2. 조건부 분기문에 도달할 수 없음을 표시

`infer`를 써서 조건부 타입 내에 다른 타입을 변수로 만들 때, 조건부 타입에서 생기는 모든 분기에 타입을 추가해야 한다. 하지만 이론상 도달할 수 없는 타입을 추가해야 하는 경우가 생길 수 있다. 이럴 때 never를 사용하면 된다.

예를 들어서 함수 파라미터 타입을 얻기 위해서는 다음과 같은 코드가 사용된다. `P`를 추론하지 못했을 때 never 타입이 쓰인다.

```ts
type Param<T>=T extends (...args: infer P) => any ? P : never;
```

## 3.3. 멤버 필터링

뭔가를 필터링할 때 분배법칙과 never타입을 이용한다.

유니언의 분배 법칙을 이용해서 유니언을 필터링할 수 있다. 이때 원하지 않는 타입에 대해서는 never 타입이 되도록 해서 유니언에서 특정 조건을 만족하는 타입만 남기는 것이다.

예를 들어서 다음과 같은 유틸리티 타입을 생각해 볼 수 있다. 이 타입은 유니언 타입에서 `name`이 `string`인 타입만 추출한다.

```ts
type FilterName<T>=T extends {name:string} ? T : never;

type Person={
    name:string;
    age:number;
}

type Dog={
    name:string;
    bark:()=>string;
}

type Account={
    balance:number;
    interest:number;
}

// Person | Dog
type Foo=FilterName<Person | Dog | Account>;
/*
type Foo=FilterName<Person> | FilterName<Dog> | FilterName<Account>;
-> Foo=Person | Dog | never;
-> Foo=Person | Dog;
*/
```

위처럼 필터링 시 필터를 통과하지 못하는 속성들에 대해서 never 타입을 사용하여 유니언에서 제외시킬 수 있다.

또한 이를 발전시켜 객체 타입의 키를 필터링할 수도 있다. 다음과 같이 쓰면 `Obj`타입에서 `ValueType`타입의 키만 추출할 수 있다.

```ts
type Filter<Obj extends Object, ValueType> = {
  [Key in keyof Obj as ValueType extends Obj[Key] ? Key : never]: Obj[Key]
}
```


# 참고

홍재민, '프로그래밍 언어 속 타입' 중 2.2 집합론적 타입 - 최소 타입 https://blog.hjaem.info/18

타입스크립트 타입 never 에 대해 자세히 알아보자 https://yceffort.kr/2022/03/understanding-typescript-never