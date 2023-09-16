---
title: TS 탐구생활 - Object vs object, Number vs number
date: "2023-09-16T00:00:00Z"
description: "number, object는 되고 Number, Object는 쓰면 안 되는 이유"
tags: ["typescript", "javascript"]
---

# 1. 왜 object는 되고 Object는 안 되는 걸까?

TS를 사용하다 보면 내장 객체들의 타입을 사용하게 될 때가 있다. 가령 다음과 같이 말이다.

```ts
const date:Date = new Date();
```

또한 `[]`를 이용한 표기도 있기 때문에 취향 차이긴 하지만 `Array`라는 내장 객체 타입도 사용할 수 있다.

```ts
const arr:Array<number> = [1,2,3];
```

그러면 비슷하게 `Number`나 `String` 같은 타입도 있을 거라는 생각이 든다. 실제로 있다. 하지만 TS를 처음 배우게 되면 알다시피 숫자를 나타내는 원시값 타입은 `number`이다. 

또한 `Object`타입도 있는데, `Object`대신 `object`를 쓰라고 한다. 우리가 써야 하는 다른 원시값 타입들도 소문자로 쓰여 있기는 마찬가지다. 무슨 차이가 있는 걸까?

# 2. Object

JS에서는 모든 것이 객체이다. 모든 객체는 결국 `Object` 생성자 함수의 `Object.prototype`를 프로토타입으로 가지며 이것을 이유로 우리는 `Object.prototype`에 정의된 메서드를 사용할 수 있다. 즉 모든 객체는 `Object`를 확장한다고 볼 수 있는 것이다.

그리고 `Object`타입은 바로 이 `Object`생성자의 프로토타입 체인에 있는 모든 생성자 함수를 통해 생성된 모든 객체를 의미한다. 그런데 JS의 모든 생성자 함수들은 `Object`를 상속받는다. 따라서 타입스크립트의 타입 특성상 `Object`에는 null, undefined 외에 모든 JS 객체가 들어갈 수 있다. 함수도 물론 가능하다.

```ts
const foo:Object=(a:number)=>a+1;
```

## 2.1. Object 타입 정의

그럼 `Object`타입은 어떻게 정의되어 있을까? `Object`타입은 `node_modules/typescript/lib/lib.es5.d.ts`에 다음과 같이 정의되어 있다. `Object`생성자를 통해 만들어진 객체들이 가져야 할 모든 메서드를 담고 있다.

```ts
interface Object {
    /** The initial value of Object.prototype.constructor is the standard built-in Object constructor. */
    constructor: Function;

    /** Returns a string representation of an object. */
    toString(): string;

    /** Returns a date converted to a string using the current locale. */
    toLocaleString(): string;

    /** Returns the primitive value of the specified object. */
    valueOf(): Object;

    /**
     * Determines whether an object has a property with the specified name.
     * @param v A property name.
     */
    hasOwnProperty(v: PropertyKey): boolean;

    /**
     * Determines whether an object exists in another object's prototype chain.
     * @param v Another object whose prototype chain is to be checked.
     */
    isPrototypeOf(v: Object): boolean;

    /**
     * Determines whether a specified property is enumerable.
     * @param v A property name.
     */
    propertyIsEnumerable(v: PropertyKey): boolean;
}
```

## 2.2. Object 생성자 타입

그런데 `Object.keys()`처럼 Object 생성자 함수 자체에 정적으로 정의된 메서드들도 있지 않은가? 이는 생성자 함수를 나타내는 `ObjectConstructor`라는 인터페이스에 정의되어 있다. `new`와 함께 호출하면 `Object`타입 객체를 생성한다.

생성자 함수답게 `Object.prototype`으로 `Object`를 정의하고 있는 부분도 볼 수 있다. 그렇게 해야 해당 생성자로 생성된 객체들이 프로토타입으로 `Object`를 가지게 되기 때문이다. 이런 프로토타입 상속에 관해서 지식이 필요하다면 [JS 탐구생활 - 프로토타입 문법](https://witch.work/posts/javascript-prototype-grammar)에서 다루었다.

```ts
interface ObjectConstructor {
    new(value?: any): Object;
    (): any;
    (value: any): any;

    /** A reference to the prototype for a class of objects. */
    readonly prototype: Object;

    /* 다른 메서드들은 길이 관계상 생략 */

    /**
     * Returns the names of the enumerable string properties and methods of an object.
     * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
     */
    keys(o: object): string[];
}
```

# 3. 래퍼 객체 타입

그럼 `Number`, `String` 같은 타입들은 뭘까? 비슷하게 해당 생성자로 생성된 모든 객체들(래퍼 객체로 쓰이는)을 대표하는 타입이다. 생성자 함수는 `NumberConstructor`와 같은 타입으로 정의되어 있다.

## 3.1. 래퍼 객체

잠시 JS로 돌아가 보자. JS를 하다 보면 분명 원시값에 없는 메서드나 프로퍼티인데 쓸 수 있는 경우가 있다. `"hello"`같은 문자열의 경우 그냥 문자열 값인데도 `length`나 `indexOf`같은 메서드를 사용할 수 있지 않은가? 그러면 이것들은 어디서 온 것일까?

이를 가능하게 해 주는 것이 바로 래퍼 객체다. 객체나 리터럴에 접근해서 프로퍼티나 메서드를 참조하려고 하면 해당 객체의 생성자를 호출하여 래퍼 객체를 만들어 준다. 이 래퍼 객체는 해당 객체의 프로퍼티나 메서드를 가지고 있기 때문에 사용할 수 있는 것이다.

예를 들어 다음과 같은 코드가 있다고 하면, `str.length`에 접근할 때 JS는 `new String(str)`을 호출하여 래퍼 객체를 만들어 준다. 그리고 이 래퍼 객체를 참조하여 문자열의 길이 5를 가져온다.

```js
const str = "hello";
console.log(str.length); // 5
```

이런 래퍼 객체는 `String`, `Number`, `BigInt`, `Boolean`, `Symbol`의 5종류가 있다. 각각이 `new String(~~)`과 같은 생성자 함수를 통해 만들어지는 객체이다.

## 3.2. 래퍼 객체 타입의 문제

앞에서 보았던 `Number`나 `String`같은 타입들은 모두 래퍼 객체의 타입이다. 정확히는 해당 생성자로 만들어진 모든 객체의 타입이라고 할 수 있겠다. 예를 들어 `Number`같은 경우 `new Number(숫자)`로 만들어진 모든 숫자 래퍼 객체를 대표하는 타입이다. 이에 대해서는 다음 섹션에서 더 자세히 다루겠다.

그럼 왜 이런 래퍼 객체 타입을 사용하면 안 되는 걸까? 래퍼 객체 타입을 사용하면 다음과 같은 문제가 발생한다.

그런데 우리가 일반적으로 변수 등을 통해 원시값을 사용할 때는 그 래퍼 객체를 사용하는 것이 아니라 원시값의 데이터를 사용하고 싶은 것이기 때문이다.

만약 타입을 이런 래퍼 객체 타입으로 지정하면 아주 기본적인 연산조차 할 수가 없어진다. 둘 다 숫자의 래퍼 객체 타입인데 래퍼 객체 간에는 더하기가 있을 수 없기 때문이다.

```ts
// Operator '+' cannot be applied to types 'Number' and 'Number'.
const a:Number=3, b:Number=4;
console.log(a+b);
```

반면 `Number`의 래퍼 객체에 있는 메서드, `toString`같은 건 잘 사용할 수 있다.

```ts
const a:Number=3;
console.log(a.toString());
```

하지만 우리가 원시값을 대입한 변수를 사용할 때 해당 래퍼 객체가 필요한 경우는 거의 없고, 있더라도 원시값 타입으로 지정해 주어도 어차피 래퍼 객체가 필요한 경우 알아서 잘 사용된다. 이런 이유로 제한만 더해지고 필요한 동작은 더 이상 사용할 수 없는 래퍼 객체 타입을 사용하는 것은 좋지 않다.

# 4. 래퍼 객체 보기

일반적으로 `node_modules`에 위치한 타입스크립트의 타입 정의 파일에 가면 이 타입들을 직접 보고 `Number`와 같은 타입들이 해당 객체 생성자로 만들어진 객체들을 포괄하는 타입임을 확인할 수 있다.

## 4.1. 타입 정의

예를 들어 `Number`타입은 `node_modules/typescript/lib/lib.es2020.number.d.ts`에 다음과 같이 정의되어 있다.

```ts
interface Number {
    /**
     * Converts a number to a string by using the current or specified locale.
     * @param locales A locale string, array of locale strings, Intl.Locale object, or array of Intl.Locale objects that contain one or more language or locale tags. If you include more than one locale string, list them in descending order of priority so that the first entry is the preferred locale. If you omit this parameter, the default locale of the JavaScript runtime is used.
     * @param options An object that contains one or more properties that specify comparison options.
     */
    toLocaleString(locales?: Intl.LocalesArgument, options?: Intl.NumberFormatOptions): string;
}
```

우리가 아는 다른 숫자형의 메서드, `toFixed`같은 것은 또 같은 위치에 `lib.es5.d.ts`에 정의되어 있다.

문자열의 경우 버전에 따른 변경사항도 기능도 많아서 그런지 더 여러 파일에 나누어져 있는데 아까 보았던 `lib.es5.d.ts`에 보면 우리가 아는 많은 문자열 메서드들이 타입으로 정의되어 있다. 사실 이외에도 꽤 많은데 어쨌건 우리가 아는 문자열 메서드들이 대부분 정의되어 있다.

```js
interface String {
    /** Returns a string representation of a string. */
    toString(): string;

    /* (생략) */

    /**
     * Returns the position of the first occurrence of a substring.
     * @param searchString The substring to search for in the string
     * @param position The index at which to begin searching the String object. If omitted, search starts at the beginning of the string.
     */
    indexOf(searchString: string, position?: number): number;

    /* 생략 */

    /** Returns the length of a String object. */
    readonly length: number;

    /* 생략 */

    readonly [index: number]: string;
}
```

그리고 es2015 변경사항들이 있는 `lib.es2015.core.d.ts`, 반복자 타입에 대해 정의된 `lib.es2015.iterable.d.ts`, 잘 알려진 심볼들이 정의된 `lib.es2015.symbol.wellknown.d.ts`등에도 문자열 래퍼 객체와 관련된 속성들이 타입으로 정의되어 있다.

## 4.2. 생성자 함수 타입

생성자 함수들의 타입도 `lib.es5.d.ts`에 정의되어 있다. `NumberConstructor`의 경우 다음과 같다. 위의 `ObjectConstructor`처럼 new와 함께 호출시 `Number`를 반환하고, `MAX_VALUE`와 같이 `Number`생성자 함수(타입 말고)에 정적으로 정의되어 있는 속성들도 확인할 수 있다.

개인적으로는 `NaN`이 여기에 속성으로 정의된 게 신기한 점이다.

```ts
interface NumberConstructor {
    new(value?: any): Number;
    (value?: any): number;
    readonly prototype: Number;

    /** The largest number that can be represented in JavaScript. Equal to approximately 1.79E+308. */
    readonly MAX_VALUE: number;

    /** The closest number to zero that can be represented in JavaScript. Equal to approximately 5.00E-324. */
    readonly MIN_VALUE: number;

    /**
     * A value that is not a number.
     * In equality comparisons, NaN does not equal any value, including itself. To test whether a value is equivalent to NaN, use the isNaN function.
     */
    readonly NaN: number;

    /* 이하 생략 */
}
```

# 5. 정리

`Number`나 `Object`처럼 대문자로 시작하는 내장 객체들의 이름 타입들은 해당 생성자로 생성된 객체들을 모두 포괄하는 타입이다. 

그런데 `Number`와 같은 원시값은 래퍼 객체 자체가 목적으로 쓰일 때가 얼마 없고, `Object`는 모든 객체 생성자가 원래 `Object` 생성자 함수를 상속받기 때문에 너무 모든 타입을 포괄할 수 있다. 따라서 우리는 목적에 맞게 원시값, 혹은 오직 객체만을 포괄하는 `number`, `object`를 사용한다.

## 5.1. 다른 내장 객체 타입

위에서 보았던 `Array`나 `Date`같은 다른 내장 객체들은 원래 객체이고, 객체를 목적으로 쓰이기 때문에 해당 생성자들이 생성한 객체들을 포괄하는 타입으로 써도 상관없다. 그래서 `array`같은 타입이 따로 없는 것이다.

`lib.es5.d.ts`를 찾아봐도 `Array`는 `ArrayConstructor`라는 생성자 함수가 생성한 객체들을 포괄하는 타입으로, 또 `Date`는 `DateConstructor`라는 생성자 함수가 생성한 객체들을 포괄하는 타입이다. 하지만 여기서는 그게 전혀 문제가 되지 않는다. `new Array`로 생성한 배열 객체는 어떤 래퍼 같은 게 아니라 그 자체가 목적이 되는 객체이기 때문이다.