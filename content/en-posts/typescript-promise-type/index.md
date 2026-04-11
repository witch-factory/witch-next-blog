---
title: Exploring TS - Definition of TS Promise Type
date: "2023-11-01T00:00:00Z"
description: "How are Promise-related types defined in TS?"
tags: ["typescript"]
---

# Introduction

The Promise in JS is undoubtedly a very important concept, and naturally, TS also defines related types well. Let's take a look at this. This document aims to reveal the process of exploration rather than being a perfectly organized article.

# 1. Beginning of Exploration

Promise first appeared in ES2015. So, after finding TypeScript in `node_modules`, let's explore files starting with `lib.es2015`. There is a file named `lib.es2015.promise.d.ts`.

Inside this file, the `PromiseConstructor` type is defined.

```ts
interface PromiseConstructor {
    /**
     * A reference to the prototype.
     */
    readonly prototype: Promise<any>;
    /* Content omitted for now; will be covered later */
}

declare var Promise: PromiseConstructor;
```

Since Promise is an existing object, the declare statement uses an ambient type for just attaching the type. However, if we observe carefully, the PromiseConstructor defined here is not the type of the Promise instance we are familiar with. The Promise type here refers to the Promise constructor itself, which has methods like `Promise.all`.

So where is the type of the Promise instance defined? This can be found in `lib.es5.d.ts`, where other types related to Promise are also defined. Let’s examine these one by one and then return to this Promise constructor.

# 2. Promise Related Types in lib.es5.d.ts

I will start by examining types that do not depend on any other types. Let's begin with `PromiseLike`, which does not depend on any other type.

## 2.1. PromiseLike

`PromiseLike` in `lib.es5.d.ts` is defined as follows. It is an interface that defines just the `then` method.

```ts
interface PromiseLike<T> {
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of whichever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null
  ): PromiseLike<TResult1 | TResult2>;
}
```

According to the [MDN's Promise.prototype.then() documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then), this method is defined in a similar manner.

```ts
then(onFulfilled)
then(onFulfilled, onRejected)
```

`onfulfilled` is the method executed when the Promise is resolved, while `onrejected` is executed when it is rejected. Both are optional.

Returning to the PromiseLike type, when interpreting the generics, `onfulfilled` returns the same type as the received object or another `PromiseLike`. Since `onrejected` is the callback executed when the Promise is rejected, it may return another Promise or the explicitly defined return type.

Examples of Promise usage readily show the nesting of then calls, so it is reasonable for the similarly structured type `PromiseLike` to be defined recursively.

```ts
fetch("https://jsonplaceholder.typicode.com/todos/1")
  .then((response) => response.json())
  .then((json) => console.log(json));
```

There is also a type called `PromiseConstructorLike`, which literally represents a constructor-like type for Promise.

```ts
declare type PromiseConstructorLike = new <T>(
  executor: (
    resolve: (value: T | PromiseLike<T>) => void,
    reject: (reason?: any) => void
  ) => void
) => PromiseLike<T>;
```

It receives an executor function that takes `resolve` and `reject` as parameters. One can see that this type is reminiscent of the Promise constructor based on its usage in actual Promise generation.

```ts
// Example of actual Promise constructor usage
new Promise((resolve, reject) => {
  resolve(1);
});
```

It is natural that the type of the value received by `resolve` returns a `PromiseLike`, because when `resolve(1)` is called, the Promise resolves with 1, resulting in a return type of `PromiseLike<number>`.

```ts
new Promise((resolve, reject) => {
  resolve(1);
});
```

## 2.2. Promise

Now, let's probe the actual Promise instance type based on this.

```ts
// lib.es5.d.ts
/**
 * Represents the completion of an asynchronous operation
 */
interface Promise<T> {
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of whichever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null
  ): Promise<TResult1 | TResult2>;

  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(
    onrejected?:
      | ((reason: any) => TResult | PromiseLike<TResult>)
      | undefined
      | null
  ): Promise<T | TResult>;
}
```

In terms of `then`, it is similar to PromiseLike, but the return type has changed from PromiseLike to Promise.

A `catch` method has been added, which registers a callback to be executed when the Promise is rejected. [This also returns a Promise, allowing for further chaining of Promises, as seen with `Promise.prototype.catch()`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)

## 2.3. Awaited

Now let's understand the `Awaited<T>` which unwraps asynchronous types. If it is not a Promise, it yields never; if it is a Promise, it yields the type of the value resolved by the Promise. This corresponds to the `await` behavior in JS.

```ts
/**
 * Recursively unwraps the "awaited type" of a type. Non-promise "thenables" should resolve to `never`. This emulates the behavior of `await`.
 */
type Awaited<T> = T extends null | undefined
  ? T // special case for `null | undefined` when not in `--strictNullChecks` mode
  : T extends object & { then(onfulfilled: infer F, ...args: infer _): any } // `await` only unwraps object types with a callable `then`. Non-object types are not unwrapped
  ? F extends (value: infer V, ...args: infer _) => any // if the argument to `then` is callable, extracts the first argument
    ? Awaited<V> // recursively unwrap the value
    : never // the argument to `then` was not callable
  : T; // non-object or non-thenable
```

Illustrating this complex ternary operator yields a diagram as follows.

![awaited](./awaited-type.png)

The portion that returns `T` when `T` is `null` or `undefined` is straightforward. The crux lies in the next step.

Next, we check if `T` is an object with a `then` method, i.e., whether it is thenable. If it fails this check, it returns `T` as is. Thus, if `T` is not thenable, `Awaited<T>` remains `T`.

```ts
type A = Awaited<string>; // string remains as is
type B = Awaited<'hello' | number>; // 'hello' | number remains as is
type O = Awaited<{A: 1}> // {A: 1} remains as is
```

If it passes all these checks, `T` is guaranteed to be a thenable type. We then infer the type of the first argument from the `then` method as `F`, and check if this parameter is a callable function type. If `F` is not callable, `never` is returned. Below demonstrates the cases where the first argument to the `then` method is non-callable and shows that `Awaited` results in `never`.

```ts
type FooThenable = {
    then: (value: number) => any;
};

type F = Awaited<FooThenable>; // never
```

If the first argument type `F` of `then` is callable, it infers the first argument type `V` and recursively passes it to `Awaited`, returning the result. This logic can be understood through actual usage of the `then` method within Promises.

```ts
// Here, the type of Awaited<fetch(...)> is the type of response, the first argument of the function passed to then.
fetch("https://jsonplaceholder.typicode.com/todos/1")
  .then((response) => response.json());
```

The `fetch` returns a Promise, and when applying await, what should emerge is the value of `response`, which is the first parameter passed to the callback of the first argument of the then method. This aligns with the type `Awaited` infers.

Now let’s consider what happens when this type enters `Awaited` in terms of the Promise type. If there is `Awaited<Promise<T>>`, the `Awaited` type would infer the type of the first callback, namely the first parameter in the `onfulfilled`, which can be found to be `T`.

```ts
interface Promise<T> {
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of whichever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null
  ): Promise<TResult1 | TResult2>;

  /* ... */
}
```

Thus, the inferred type of the first parameter callback function ends up being fed back into `Awaited` recursively, resulting in `Awaited<Promise<T>>` equating to `Awaited<T>`.

This mechanism also helps in deducing the types of chained Promises, a topic well-explained in [Choi Hyun-Young's TypeScript textbook](https://search.shopping.naver.com/book/catalog/41736307631?cat_id=50010881&frm=PBOKPRO&query=%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8+%EA%B5%90%EA%B3%BC%EC%84%9C&NaPm=ct%3Dloiqkizs%7Cci%3Da227a8b9f5020f34f7fa025e7249ade5ad19b261%7Ctr%3Dboknx%7Csn%3D95694%7chk%3D20f6e1c8ee1437ed56121f5ca6fb361bbe23d5c0).

### 2.3.1. A Slight Issue

This kind of inference can potentially lead to an infinite loop. This occurs when the `thenable` structure leads to everlasting recursion.

```ts
type RecursiveThenable = {
  then: (callback: (value: RecursiveThenable) => void) => void;
};

// Type instantiation is excessively deep and possibly infinite.
type Unwrapped = Awaited<RecursiveThenable>; 
```

# 3. PromiseConstructor

Returning to `lib.es2015.promise.d.ts`, let’s review the PromiseConstructor again. As the type of the Promise constructor, it is worth examining due to the definition of methods like `Promise.all`.

```ts
interface PromiseConstructor {
    /**
     * A reference to the prototype.
     */
    readonly prototype: Promise<any>;

    /**
     * Creates a new Promise.
     * @param executor A callback used to initialize the promise. This callback is passed two arguments:
     * a resolve callback used to resolve the promise with a value or the result of another promise,
     * and a reject callback used to reject the promise with a provided reason or error.
     */
    new <T>(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T>;

    /**
     * Creates a Promise that is resolved with an array of results when all of the provided Promises
     * resolve, or rejected when any Promise is rejected.
     * @param values An array of Promises.
     * @returns A new Promise.
     */
    all<T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]: Awaited<T[P]> }>;

    // see: lib.es2015.iterable.d.ts
    // all<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>[]>;

    /**
     * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
     * or rejected.
     * @param values An array of Promises.
     * @returns A new Promise.
     */
    race<T extends readonly unknown[] | []>(values: T): Promise<Awaited<T[number]>>;

    // see: lib.es2015.iterable.d.ts
    // race<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>>;

    /**
     * Creates a new rejected promise for the provided reason.
     * @param reason The reason the promise was rejected.
     * @returns A new rejected Promise.
     */
    reject<T = never>(reason?: any): Promise<T>;

    /**
     * Creates a new resolved promise.
     * @returns A resolved promise.
     */
    resolve(): Promise<void>;
    /**
     * Creates a new resolved promise for the provided value.
     * @param value A promise.
     * @returns A promise whose internal state matches the provided promise.
     */
    resolve<T>(value: T): Promise<Awaited<T>>;
    /**
     * Creates a new resolved promise for the provided value.
     * @param value A promise.
     * @returns A promise whose internal state matches the provided promise.
     */
    resolve<T>(value: T | PromiseLike<T>): Promise<Awaited<T>>;
}

declare var Promise: PromiseConstructor;
```

## 3.1. Promise.all

```ts
/**
     * Creates a Promise that is resolved with an array of results when all of the provided Promises
     * resolve, or rejected when any Promise is rejected.
     * @param values An array of Promises.
     * @returns A new Promise.
     */
    all<T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]: Awaited<T[P]> }>;
```

`Promise.all` accepts an array containing multiple Promises and returns an array of resolved values when all the Promises resolve. If any Promise rejects, it returns the reason for the rejection. Hence, the generics are constrained to array types.

The return type is a Promise encapsulating an array of types that place each element of `T` into `Awaited`. This corresponds with the functionality of `Promise.all`, which resolves all Promises and returns the results.

## 3.2. Promise.race

```ts
    /**
     * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
     * or rejected.
     * @param values An array of Promises.
     * @returns A new Promise.
     */
    race<T extends readonly unknown[] | []>(values: T): Promise<Awaited<T[number]>>;
```

`Promise.race` receives an array of Promises similar to `Promise.all`. However, unlike all, which returns all results, race returns the result of the first resolved or rejected Promise.

Thus, the return type of this function is a Promise that wraps the Awaited type of a single possible type from `T`, accessed by a numeric index, in the form of `Awaited<T[number]>`.

## 3.3. resolve, reject, finally

The types for `resolve` and `reject` are straightforward, so I'll skip the interpretation. Similarly, `lib.es2018.promise.d.ts` defines the `finally` method of the Promise:

```ts
// lib.es2018.promise.d.ts
interface Promise<T> {
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>
}
```

## 3.4. Types for Promise Iterable

ES2015 introduced a new iterable form for collections. Detailed descriptions are available in [a write-up on the use of symbols](https://witch.work/posts/javascript-symbol-usage#6.4.-Symbol.iterator). This involves iterating by calling `Symbol.iterator` until reaching the end of the iterator. TypeScript also defines this type, accessible in `lib.es2015.iterable.d.ts`.

```ts
// lib.es2015.iterable.d.ts
interface Iterator<T, TReturn = any, TNext = undefined> {
    // NOTE: 'next' is defined using a tuple to ensure we report the correct assignability errors in all places.
    next(...args: [] | [TNext]): IteratorResult<T, TReturn>;
    return?(value?: TReturn): IteratorResult<T, TReturn>;
    throw?(e?: any): IteratorResult<T, TReturn>;
}

interface Iterable<T> {
    [Symbol.iterator](): Iterator<T>;
}
```

Interpreting this type requires understanding the iterator protocol, which might lead to a lengthy explanation; thus, I will omit it here. The key takeaway is that new iterable objects beyond arrays emerged, and methods like `Promise.all` that handle Promise collections must support these.

Consequently, `lib.es2015.iterable.d.ts` defines additional forms of the `all` and `race` methods that will merge with the existing `PromiseConstructor` interface.

```ts
interface PromiseConstructor {
    /**
     * Creates a Promise that is resolved with an array of results when all of the provided Promises
     * resolve, or rejected when any Promise is rejected.
     * @param values An iterable of Promises.
     * @returns A new Promise.
     */
    all<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>[]>;

    /**
     * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
     * or rejected.
     * @param values An iterable of Promises.
     * @returns A new Promise.
     */
    race<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>>;
}
```

Here, whereas `T` was constrained to an array type, it now receives iterable types. Thus, the return type of the `Promise.all` method wraps `T` in Awaited to yield an array.

## 3.5. any

Since iterables were already established in ES2020, the Promise-related types starting from this release consider iterables from the outset. In `lib.es2021.promise.d.ts`, the `Promise.any` method is defined, which returns the result of the first fulfilled Promise from a received Promise array or the reasons for rejection if all fail.

I will omit a detailed explanation here as the types are nearly identical to those discussed earlier, serving as examples to illustrate how these subsequent types incorporate iterables from the beginning.

```ts
// lib.es2021.promise.d.ts
interface PromiseConstructor {
    any<T extends readonly unknown[] | []>(values: T): Promise<Awaited<T[number]>>;

    any<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>>;
}
```

## 3.6. allSettled

Defined in `lib.es2020.promise.d.ts` is the `allSettled` method. Unlike Promise.all, which halts when a Promise is rejected, allSettled waits until all Promises complete. For more details, refer to [Promise.allSettled() - JavaScript | MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled).

In any case, new types are defined here as it must return objects containing the `status` and either `value` or the rejection reason.

```ts
// lib.es2020.promise.d.ts
interface PromiseFulfilledResult<T> {
    status: "fulfilled";
    value: T;
}

interface PromiseRejectedResult {
    status: "rejected";
    reason: any;
}

type PromiseSettledResult<T> = PromiseFulfilledResult<T> | PromiseRejectedResult;

interface PromiseConstructor {
    /**
     * Creates a Promise that is resolved with an array of results when all
     * of the provided Promises resolve or reject.
     * @param values An array of Promises.
     * @returns A new Promise.
     */
    allSettled<T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]: PromiseSettledResult<Awaited<T[P]>> }>;

    /**
     * Creates a Promise that is resolved with an array of results when all
     * of the provided Promises resolve or reject.
     * @param values An array of Promises.
     * @returns A new Promise.
     */
    allSettled<T>(values: Iterable<T | PromiseLike<T>>): Promise<PromiseSettledResult<Awaited<T>>[]>;
}
```

The interpretation of `PromiseSettledResult` is simple enough if one understands the states of a Promise. It simply groups the types for when the Promise is fulfilled and when it is rejected into a union.

The `allSettled` method similarly receives an array or iterable of Promises (though it will function well even if they are not Promises, this is the general expectation). It wraps each Promise with `Awaited` to obtain the result when it fulfills, wrapping it with `PromiseSettledResult` on return, where the value type of `PromiseFulfilledResult` matches the type resolved by the Promise.

```
The input Promise array's type is inferred as T -> The type of the fulfillment result in T is inferred with `Awaited` -> The type of `PromiseSettledResult` value becomes Awaited<T>
```