---
title: TS 탐구생활 - TS의 잊혀진 키워드와 문법들, const 제네릭, 가변성 제어, override 제어, asserts 등
date: "2025-06-05T00:00:00Z"
description: "TS의 잊혀진 문법들을 마주치다. const 제네릭, in/out 가변성 인자, override 제어, asserts등 제한적으로 사용되는 문법들"
tags: ["typescript"]
---

# 시작

TS를 공부하면서 여러 키워드와 그 활용을 공부했었다. TS 관련 면접 단골 질문인 `type`과 `interface`, `enum`과 같은 것부터 `satisfies`, `infer`, `declare`와 같이 상황에 따라 유용하게 쓰일 수 있는 키워드들까지. 이런 키워드들에 대해서도 할 수 있는 이야기가 당연히 많고 내가 더 공부해야 하는 부분도 많다.

하지만 우연한 기회로 TS의 거의 잊혀진 키워드나 문법들을 접하게 될 때가 몇 번 있었다. 정석적으로 TS를 공부하다가 마주친 건 아니다. 실질적으로 거의 사용되지 않는 것들이기 때문이다. 주로 내가 다른 언어나 개념들을 공부하다가 'TS에는 이런 게 없을까?' 혹은 '이런 동작도 가능할까?' 하고 찾아보면서 알게 된 것들이다.

그래서 여기 나오는 내용들은 자료도 많지 않고 제한된 상황에서만 사용하는 것들이 대부분이다. 여기 나온 내용들은 거의 잊혀졌기 때문에 가독성이나 협업의 관점에서도 실제로는 사용하지 않는 게 좋다.

하지만 분명 존재하는 문법들이며 어쨌거나 나온 목적이 있다. 이걸 활용해서 코드를 짜지는 않더라도 생각의 흐름을 따라가 보는 건 유용하리라 믿는다. 그래서 이번 글에서는 내가 마주했던 TS의 잊혀진 문법들에 대해서 알아보려고 한다.

# 제네릭

## const 제네릭 타입 매개변수

`as const` 문법을 사용하며 찾아보다가 발견하였다. TS는 보통 객체나 배열의 타입을 추론할 때 최대한 일반적인 타입으로 추론한다. 예를 들어 다음의 경우 `words`는 `string[]` 타입으로 추론된다.

```ts
const words = ["Apple", "Banana", "cherry"];
```

이건 제네릭 타입 매개변수의 타입을 추론할 때도 마찬가지다. 다음의 경우 `T`는 `string` 타입으로 추론되고 `halfWords`의 타입도 `string[]`이 된다.

```ts
function getHalf<T>(arr: T[]): T[] {
  return arr.slice(0, arr.length / 2);
}

const halfWords = getHalf(["Apple", "Banana", "Cherry"]); // string[]
```

이후에 `halfWords`에 변경이 일어날 수도 있으므로 이런 추론은 꽤 적절하다고 볼 수 있다. 하지만 제네릭 타입 매개변수의 타입 추론이 좀 더 엄격하게 이루어지도록 해야 하는 경우도 있다. 위의 코드에서 `T`가 `"Apple" | "Banana" | "Cherry"`와 같이 문자열 리터럴 타입으로 추론되도록 하고 싶다는 뜻이다.

이럴 때 `as const`를 사용하면 된다. 다음과 같이 `getHalf`를 호출하면 원하는 대로 동작하게 된다.

```ts
const halfWords = getHalf(["Apple", "Banana", "Cherry"] as const);
```

하지만 이렇게 하면 번거롭고 `as const`를 사용하는 걸 잊어버릴 위험도 있다. 따라서 TS 5.0부터는 제네릭 타입 매개변수에 `const`를 붙일 수 있게 되었다. 다음과 같이 `const`를 붙이면 `T`가 문자열 리터럴 타입으로 추론된다.

```ts
function getHalf<const T>(arr: T[]): T[] {
  return arr.slice(0, arr.length / 2);
}

const halfWords = getHalf(["Apple", "Banana", "Cherry"]); // ("Apple" | "Banana" | "cherry")[]
```

이렇게 하면 `as const`를 사용하지 않아도 제네릭 타입 매개변수의 타입을 좀 더 엄격하게 추론할 수 있다.

다만 함수 호출 이전에 이미 타입이 추론된 경우에는 타입을 더 좁혀 주지는 않는다는 점에 주의하자. 함수 인수로 직접 들어가서 추론될 때만 동작하는 기능이다. 예를 들어 다음과 같은 경우에는 이미 `words`의 타입이 `string[]`으로 추론된 상태에서 `getHalf`를 호출하기 때문에 `T`는 여전히 `string`으로 추론된다.

```ts
const words = ["Apple", "Banana", "cherry"];

function getHalf<const T extends string>(arr: T[]): T[] {
  return arr.slice(0, arr.length / 2);
}

const halfWords = getHalf(words); // string[]
```

이 문법이 처음 나올 당시에는 추론되는 타입이 `readonly` 배열/객체로만 제한되어서 mutable한 타입(예를 들어 `Array<type>`)이 `T`로 들어오면 제대로 동작하지 않는 문제가 있었던 듯 하다.

하지만 [이후 타입 제약이 허용하는 한 최대한 상수 타입으로 추론하는 방향으로 개선](https://github.com/microsoft/TypeScript/pull/55229)되었다. 관련해서 발생한 이슈에 대해서는 [const Generic type parameter not inferred as const when using conditional type](https://stackoverflow.com/questions/76995805/const-generic-type-parameter-not-inferred-as-const-when-using-conditional-type)등을 참고할 수 있다.

`as const` 형태로 인수를 넣어야 할 때가 많은 경우 사용할 수 있을 것 같다.

## NoInfer 제네릭

`infer` 관련해서는 [이전에 글을 쓴 적도 있기에](https://witch.work/ko/posts/typescript-infer-usage) 가끔 추가적인 정보를 찾아본다. 그러던 중에 우연히 알게 되었다.

TS 5.4부터 제네릭 함수 내에서 주어진 인자에 대해서 타입 추론을 하지 않도록 하는 `NoInfer` 유틸리티 타입이 추가되었다.  언뜻 들으면 어떤 기능인지 감이 오지 않을 수 있다. 이 기능은 제네릭 함수의 타입 추론을 좀 더 세밀하게 제어할 수 있게 해준다.

TS에서 제네릭 타입이 어떤 타입으로 결정될지는 보통 타입 추론에 따라 결정된다. 하지만 제네릭 타입 매개변수를 여러 위치에서 사용하는 경우 제네릭 타입의 후보가 될 수 있는 타입이 여러 개가 될 수도 있고 의도와 다르게 추론될 수도 있다.

예를 들어 다음과 같은 코드를 보자. 배열과 배열의 원소 중 하나를 받아서 어떤 연산을 하는 함수라고 가정한다.

```ts
function foo<T extends string>(arr: T[], item: T) {
  // ...
}
```

그럼 다음과 같이 함수를 호출하면 `T`는 어떻게 추론될까?

```ts
foo(["Apple", "Banana", "Cherry"], "Grape")
```

우리의 의도가 타입에 반영되려면 `T`가 `"Apple" | "Banana" | "Cherry"`로 추론되고 `item`이 해당 `T` 타입에 속하는지 검사해야 한다. 하지만 `item` 인수도 `T`로 선언되었으므로 이 또한 `T`의 타입 추론에 영향을 준다. 그래서 이 경우 `T`는 `"Apple" | "Banana" | "Cherry" | "Grape"`로 추론된다. 즉 `item`이 `arr`의 타입에 속하는지 검사하지 않는다.

이걸 우리의 의도대로 작동하게 하려면 다른 타입 매개변수를 하나 더 선언하는 방법도 있다. 다음처럼 말이다.

```ts
function foo<T extends string, Item extends T>(arr: T[], item: Item) {
  // ...
}

/* Error: Argument of type '"Grape"' is not assignable to parameter of type '"Apple" | "Banana" | "Cherry"' */
foo(["Apple", "Banana", "Cherry"], "Grape")
```

제대로 동작하지만 뭔가 어색하다. `Item` 타입 매개변수가 `T[]`의 원소 기능 이외에는 전혀 쓰이지 않는데도 타입 매개변수를 하나 더 선언했기 때문이다. 이럴 때 `NoInfer` 유틸리티 타입을 사용할 수 있다.

`NoInfer<>`로 타입을 감싸면 TS 컴파일러에게 해당 타입을 기반으로는 타입 추론을 하지 말라고 지시한다. 그래서 앞서 만든 `foo` 함수의 코드를 다음과 같이 수정할 수 있다.

```ts
function foo<T extends string>(arr: T[], item: NoInfer<T>) {
  // ...
}
```

해당 타입을 이용해 타입 추론을 하는 걸 막는 것 이외에 `NoInfer`의 다른 기능은 없다. 따라서 다른 모든 맥락에서 `T`와 `NoInfer<T>`는 동일한 타입으로 취급된다. 또한 이 타입은 컴파일러에서 처리되며 `Pick<T, K>`같은 타입과는 달리 TS상에서 원리를 파악할 수는 없다.

## in, out 가변성 인자

[타입으로 견고하게 다형성으로 유연하게](https://product.kyobobook.co.kr/detail/S000210397750)라는 책을 읽다가 가변성(variance)이라는 개념을 접했다. 관련해서 글도 쓴 적이 있다. [TS 탐구생활 - 가변성(Variance)가 무엇인가](https://witch.work/ko/posts/typescript-covariance-theory)라는 글이다. 당연히 TS에서도 가변성 관련 기능을 지원하는지 찾아보던 중 이 내용을 알게 되었다.

TS에서 `in`은 흔히 객체 속성을 확인하여 타입을 좁힐 때(`if (x in obj) {}`) 사용한다. 하지만 `in`은 `out` 키워드와 함께 제네릭의 가변성을 지정할 때도 사용된다.

가변성은 제네릭 타입이 주어진 타입들 간에 서브타입 관계를 어떻게 취급하는지에 대한 개념이다. 제네릭 타입이 서브타입 관계를 보존하면 공변(covariant), 역전시키면 반변(contravariant), 둘 다이면 양변(bivariant), 서브타입 관계를 무시하면 불변(invariant)이라고 한다.

예를 들어 `U`가 `T`에 속하는 타입이라고 하자. 그럼 `Array<U>`도 `Array<T>`에 속하는 타입임이 자연스럽다. 이 경우 `Array`는 공변이다. 하지만 해당 타입이 함수 매개변수라면 `(x: T) => void` 는 `(x: U) => void`에 속한다. `T`를 인수로 받을 수 있는 함수는 `U`도 받을 수 있기 때문이다. 따라서 함수 매개변수는 반변이다.

이런 식으로 서브타입과 제네릭이 상호작용하는 방식이 가변성이다. 이 글의 핵심은 아니기 때문에 간단하게만 설명했다. 더 자세한 개념에 대해서는 내가 이전에 작성한 [TS 탐구생활 - 가변성(Variance)이란 무엇인가](https://witch.work/ko/posts/typescript-covariance-theory)를 참고하자.

TS는 Java처럼 강력한 타입 상속을 지원하지 않고 구조적 타이핑을 사용한다. 서브타입도 구조적으로 결정된다. 이런 방식 덕분에 가변성 또한 TS에서는 출력은 공변, 입력은 반변이라는 원칙 정도로 일반적으로 충분하다.

하지만 순환 타입(circular type)과 같은 복잡한 타입을 다루는 경우에는 아주 드물게 가변성을 명시적으로 지정해야 할 때가 있다. 이때 `in`과 `out` 키워드를 사용한다.

`in`은 해당 타입 매개변수가 반변임을 나타낸다. `out`은 공변임을 나타낸다. 함수 매개변수처럼 입력에 사용될 경우 반변이어야 하고 반환값처럼 출력에 사용될 경우 공변이어야 함을 생각하면 직관적이다. 그리고 `in out`을 쓰면 해당 타입 매개변수가 불변임을 나타낸다.

다만 이런 가변성 인자는 실제로 구조적 가변성을 제어해야 하는 경우에만 드물게 사용해야 하며 대부분의 구조적 타입 비교에서는 아무 효과도 없다. `in`을 사용한다고 해서 어떤 타입이 반변으로 무조건 취급되는 게 아니다. 이건 타입 검사를 강제할 수 있는 문법이 아니라 타입 매개변수의 가변성이 모호할 경우에만 지정해 줄 수 있는 문법이기 때문이다.

아주 일부의 경우 가변성이 모호하여 가변성 추론을 하기 위한 타입 검사에 시간이 오래 걸릴 경우 이 키워드를 이용해 약간의 성능 향상을 기대할 수도 있다고 한다. 또한 일부의 경우를 제외하면 TS의 구조적 타입 가변성은 아주 잘 동작하기 때문에 실제로 이 키워드를 사용해야 할 일은 거의 없다.

가변성이 이슈가 되는 부분이 궁금하다면 React에서 사용하는 `bivarianceHack` 등을 참고할 수 있다.

# 클래스 관련 문법

## override

Java에서는 해당 메서드가 슈퍼클래스의 메서드를 오버라이드한다는 걸 컴파일러에게 알려주는 `@Override` 어노테이션이 있다. 만약 `@Override` 어노테이션이 붙은 메서드가 슈퍼클래스에 정의되어 있지 않으면 컴파일 에러가 발생한다.

```java
class Animal {
    public void makeSound() {
        System.out.println("Animal sound");
    }
}

class Dog extends Animal {
    // 만약 makeAound처럼 메서드에 오타가 있을 경우 에러가 발생한다
    @Override
    public void makeSound() {
        System.out.println("Bark!");
    }
}
```

Java를 배우면서 이 기능이 상당히 유용하다고 생각했다. 그래서 TS에도 비슷한 기능이 있나 찾아보니 TS도 TS 4.3부터 `override` 키워드를 지원하고 있었다. 위 java 코드와 같은 기능을 하는 TS 코드는 다음과 같이 `override`를 이용해 쓸 수 있다.

```ts
class Animal {
  makeSound() {
    console.log("Animal sound");
  }
}

class Dog extends Animal {
  // 만약 makeSound에 오타가 있을 경우 override 키워드 덕분에 타입 에러가 발생한다
  override makeSound() {
    console.log("Bark!");
  }
}
```

하지만 `override` 키워드를 쓰지 않고 사용자가 그냥 메서드를 오버라이드하면 어떻게 될까? 위의 `Dog` 클래스를 다음과 같이 작성하는 것이다.

```ts
class Dog extends Animal {
  makeSound() {
    console.log("Bark!");
  }
}
```

기본적으로는 이렇게 해도 아무런 에러도 발생하지 않는다. 하지만 이렇게 하면 여러 사람이 협업할 때 문제가 발생할 수 있다. 인지하지 못한 채 다른 사람이 작성한 슈퍼클래스의 메서드를 오버라이딩해버릴 수도 있기 때문이다.

그래서 TS에서는 tsconfig의 `noImplicitOverride` 옵션을 제공한다. 이 옵션을 켰을 경우 `override` 키워드 없이 슈퍼클래스의 메서드를 오버라이드하는 경우 에러가 발생한다.

다만 이 기능도 많이 쓰이지는 않는 걸로 보인다. TS 계열 언어로 개발할 때 클래스 상속을 많이 사용하지도 않고 TS가 구조적 타이핑을 사용하기 때문에 오버라이딩을 통해서 타입을 변경하기보다는 클래스를 위한 인터페이스 타입을 따로 정의하고 인터페이스 병합을 통해서 타입을 확장하는 게 더 일반적이기 때문으로 보인다. 그리고 Java등 다른 언어에서의 기능과 달리 추상 메서드에 대한 지원을 하지 않는 등 제대로 알고 사용하기도 쉽지 않을 듯 하다.

## accessor

이건 뭔가 재미있는 게 없을까 하고 TS 릴리즈 노트를 뒤지다가 발견했다. TS 4.9부터 `accessor` 키워드가 추가되었다. 이 키워드는 ECMAScript의 [Stage 3 Proposal인 Decorators](https://github.com/tc39/proposal-decorators)의 일부이다.

이 기능을 사용하려면 일반적인 클래스 속성을 선언하는 것처럼 하면서 `accessor` 키워드를 붙이면 된다. 예를 들어 다음과 같이 작성할 수 있다. 릴리즈 노트에 있는 예시 그대로이다.

```ts
class Person {
    accessor name: string;
    constructor(name: string) {
        this.name = name;
    }
}
```

이렇게 하면 `name` 속성에 대응하는 private 속성이 생기고 그에 대한 getter와 setter가 자동으로 생성된다. 즉 위의 코드는 다음 코드와 똑같이 동작한다. `accessor`는 그러니까 일종의 문법적 설탕이다.

```ts
class Person {
    #__name: string;
    get name() {
        return this.#__name;
    }
    set name(value: string) {
        this.#__name = value;
    }
    constructor(name: string) {
        this.name = name;
    }
}
```

그런데 왜 이런 문법적 설탕이 필요할까? 물론 `get`과 `set`은 같이 쓰일 때가 많은 게 사실이다. 하지만 사실 `get`, `set`을 주로 이용하는 경우를 생각해 보면 속성 접근에 어떤 기능을 추가하고 싶을 때이다. 가령 로그를 찍는다든지 새로 설정하려는 속성 값을 검증한다든지 하는 것들 말이다.

그래서 단순히 속성 접근만 `get`, `set`을 통해 정의하는 이 `accessor` 키워드는 그다지 유용하지 않을 것 같다는 생각을 할 수 있다. 문법적 설탕이라기에는 특별히 편해지는 부분도 없고 기능도 제한적이다.

하지만 이건 단순히 `get`, `set`을 정의하는 게 아니라 Decorators Proposal의 일부로서 `accessor` 내용을 미리 구현한 것이다. 해당 제안에서는 클래스 속성과 `accessor`로 선언된 속성을 구분한다. 그리고 `accessor`로 선언된 속성의 경우 데코레이터가 해당 속성의 값을 인자로 받아서 새로운 기능을 하도록 만들 수 있다고 한다.

하지만 Decorators Proposal 전체가 구현된 게 아니라 `accessor`에 대한 부분만 구현된 상태이기 때문에 쓸모없는 문법적 설탕처럼 보이는 것이다. 그래서 릴리즈 노트에서도 부실하게 적혀 있다. 필요하다면 [해당 PR](https://github.com/microsoft/TypeScript/pull/49705)과 [Decorators Proposal](https://github.com/tc39/proposal-decorators)을 참고할 수 있다.

# 기타

## asserts

예외 처리 관련 내용을 찾다가 발견한 내용이다.

많은 언어들에는 예상치 못한 상황이 발생했을 때 예외를 던지는 함수들이 있다. 이런 걸 assertion 함수라고 한다. Node.js에도 `assert` 함수가 있다. 여기서 `assert` 함수는 `value`가 1이 아니면 예외를 던진다.

```js
assert(value === 1);
```

그런데 JavaScript에서는 이런 assertion 함수를 기본적으로 지원하지 않으므로 직접 구현해서 써야 한다. 앞서 언급한 `assert`도 Node.js에서 제공하는 모듈이다.

이렇게 직접 구현한 assertion 함수는 타입 좁히기를 제대로 수행하지 못하는 경우가 많았다. 이런 식이다.

```ts
function foo(str: unknown) {
  assert(typeof str === "string");
  // str이 string 타입인 경우에만 아래 내용이 실행된다
  // 하지만 str은 string 타입으로 좁혀지지 않는다
  console.log(str.toLowerCase());
}
```

TS는 `assert` 함수가 예외를 던지는지 알 수 없기 때문에 이런 결과가 나온다. 이걸 해결하기 위해  TS 3.7부터는 assertion 함수가 특정 타입을 보장한다는 걸 컴파일러에게 알려주는 `asserts` 키워드를 도입했다. 이걸 쓰는 방법은 2가지가 있다. 하나는 조건을 명시하는 방법이고 다른 하나는 type predicate처럼 특정 변수의 타입을 지정하는 방법이다.

먼저 조건을 명시하는 방법을 보자. 이런 식으로 `condition`에 `asserts` 키워드를 쓰게 되면 스코프의 이후 코드에 대해서 `condition` 매개변수로 전달되는 모든 것이 참임을 보장한다. 거기에 따르는 타입 좁히기도 잘 이루어진다.

`assert` 함수 작성에는 이렇게 이용할 수 있다. 아래 코드는 토스의 es-toolkit 라이브러리의 내부 코드다.

```ts
export function assert(condition: unknown, message: string | Error): asserts condition {
  if (condition) { return; }

  if (typeof message === 'string') { throw new Error(message); }

  throw message;
}
```

이렇게 작성된 `assert` 함수는 다음과 같이 사용할 수 있다. 스코프의 나머지 부분에서 `assert`의 `condition` 조건이 참임이 보장됨에 따라 타입이 좁혀지는 걸 볼 수 있다.

```ts
function foo(str: unknown) {
  assert(typeof str === "string", "str must be a string");
  // str은 string 타입으로 좁혀진다
  console.log(str.toLowerCase());
}
```

또 다른 방법은 `asserts` 키워드를 이용해 속성이나 변수의 타입을 지정하는 것이다. [type predicate](https://jake-seo-dev.tistory.com/695)와 비슷한 방식이다. 이걸 이용하면 스코프의 나머지 부분에서 어떤 변수에 대해 타입을 보장할 수 있다.

```ts
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("value must be a string");
  }
}
```

이 함수의 호출 이후에는 `value`가 `string` 타입임이 보장된다. 따라서 다음과 같이 사용할 수 있다.

```ts
function foo(value: unknown) {
  assertIsString(value);
  // value는 string 타입으로 좁혀진다
  console.log(value.toLowerCase());
}
```

제네릭 유틸리티 타입을 이용해서 `asserts` 키워드를 이용한 타입 좁히기를 좀 더 세밀하게 제어할 수도 있다. `assertNotNil`이 호출된 이후에는 `value`가 `null`이나 `undefined`가 아님이 보장된다. 즉 `NonNullable<T>` 타입으로 좁혀진다.

```ts
function assertNotNil<T>(value: T): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error("value must not be null or undefined");
  }
}
```

그럼 작은 의문이 생길 수 있다. `never` 를 리턴하는 함수에 대한 타입 추론을 사용하면 어떨까? 가령 이렇게 작성할 수 있지 않을까 생각할 수 있다.

```ts
function assertIsString<T>(value: T): T extends string ? void : never
```

일단 이건 현재 TS 상에서 제대로 타입을 좁혀 주지 못한다. `assertIsString` 함수 호출 이후에는 `value`가 `string` 타입임을 보장해 주어야 하는데 컴파일러가 그러지 못하기 때문이다. 하지만 [asserts의 원본 PR](https://github.com/microsoft/TypeScript/pull/32695#issuecomment-518009682)을 보면 같은 제안이 있었다.

하지만 이건 메인테이너가 답변한 내용처럼 `T` 하나를 기준으로 `value`의 타입을 확정할 수 없는 경우가 있기 때문에 거부되었다. 예를 들어서 사용자가 `T`를 명시적으로 지정한 경우, 또 `T`의 타입 추론 단서가 될 수 있는 매개변수가 여러 개인 경우, `T`가 다른 타입의 일부인 경우 등이 있겠다. 이런 걸 고려하면 `asserts` 키워드를 이용한 타입 좁히기가 더 간결하고 유용하다고 한다.

# 참고

TypeScript, Generics

https://www.typescriptlang.org/docs/handbook/2/generics.html

TypeScript 5.0 릴리즈 노트, `const` Type Parameters

https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html

Typescript 5.0 and the new const modifier on type parameters

https://xebia.com/blog/typescript-5-0-and-the-new-const-modifier-on-type-parameters/

const modifier on type parameters, TypeScript #51865

https://github.com/microsoft/TypeScript/pull/51865

Only infer readonly tuples for const type parameters when constraints permit, TypeScript #55229

https://github.com/microsoft/TypeScript/pull/55229

const Generic type parameter not inferred as const when using conditional type

https://stackoverflow.com/questions/76995805/const-generic-type-parameter-not-inferred-as-const-when-using-conditional-type

TypeScript 5.4 릴리즈 노트, The `NoInfer` Utility Type

https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-4.html#the-noinfer-utility-type

Total TypeScript, NoInfer: TypeScript 5.4's New Utility Type

https://www.totaltypescript.com/noinfer

Add `NoInfer<T>` intrinsic represented as special substitution type, TypeScript #56794

https://github.com/microsoft/TypeScript/pull/56794

Intrinsic string types, TypeScript #40580

https://github.com/microsoft/TypeScript/pull/40580

TypeScript, Generics

https://www.typescriptlang.org/docs/handbook/2/generics.html

[tsconfig의 모든 것] Compiler options / Type Checking

https://evan-moon.github.io/2021/08/08/tsconfig-compiler-options-type-check/

TypeScript 4.3 릴리즈 노트, `override` and the `--noImplicitOverride` Flag

https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html#override-and-the---noimplicitoverride-flag

noImplicitOverride does not complain on abstract methods, TypeScript #44457

https://github.com/microsoft/TypeScript/issues/44457

TypeScript 4.9 릴리즈 노트, Auto-Accessors in Classes

https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#auto-accessors-in-classes

Support for auto-accessor fields from the Stage 3 Decorators proposal, TypeScript #49705

https://github.com/microsoft/TypeScript/pull/49705

TypeScript 3.7 릴리즈 노트, Assertion Functions

https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions

Javascript 어서션(assertion)

https://jcloud.pro/javascript-assertion

What does the TypeScript asserts operator do?

https://stackoverflow.com/questions/71624824/what-does-the-typescript-asserts-operator-do

Assertions in control flow analysis, TypeScript #32695

https://github.com/microsoft/TypeScript/pull/32695