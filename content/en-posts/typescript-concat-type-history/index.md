---
title: Exploring TS - The Evolution of Array.concat Method Types
date: "2023-12-12T00:00:00Z"
description: "The type of TS Array.prototype.concat is not as straightforward as it seems."
tags: ["typescript"]
---

---

This article delves into a topic that branched out from my research on mutability. I enjoy studying the history and reasoning behind different language features, but I find that it can often lack practical efficiency relative to the time invested, so I usually hold back. Nevertheless, writing these kinds of articles is enjoyable!

# Thumbnail

![Concat Issue Image](./concat-issue.png)

# 1. Array.prototype.concat

I was investigating `Array<T>` from one of TS's core type files, `lib.es5.d.ts`. I noticed that the type for `concat` was defined in a rather unique way.

While there are basic types like `Array<T>` and the read-only type `ReadonlyArray<T>`, they defined and used a new type called `ConcatArray<T>`. The type definitions are as follows:

```ts
interface Array<T> {
  concat(...items: ConcatArray<T>[]): T[];
  concat(...items: (T | ConcatArray<T>)[]): T[];
}
```

Thus, I explored why the type of `Array.prototype.concat()` is represented in this unintuitive manner and found some interesting aspects worthy of discussion.

## 1.1. What is Array.prototype.concat?

In JS, the `concat()` method is defined on `Array.prototype`. This method takes a new array as a parameter to be merged with the existing array, returning a new merged array. It can also accept multiple arrays as parameters. The following code snippet, taken from MDN, illustrates the usage of `concat()`:

```js
const array1 = ["a", "b", "c"];
const array2 = ["d", "e", "f"];
const array3 = array1.concat(array2);
// expected array3 : Array ["a", "b", "c", "d", "e", "f"]

concat();
concat(value0);
concat(value0, value1);
concat(value0, value1, /* …, */ valueN);
```

If no parameters are provided, `concat` returns a shallow copy of the existing array.

## 1.2. Thoughts on the concat Type

Looking at the type of `concat`, I noticed it utilizes the newly defined type `ConcatArray<T>`. However, couldn’t we simply use `Array<T>` as the parameter type directly?

Considering that `concat` can accept multiple arrays or a single item, how about this shape? This was actually a type that TS once introduced.

```ts
interface Array<T> {
  // ...
  concat(...items: (T | T[])[]): T[];
}
```

However, the above type clearly had issues. Additionally, several issues and PRs led to the defined necessity for the new type `ConcatArray<T>`. It's worth noting that the intuitive type for `concat` proposed above was problematic and led to its removal. A spoiler alert: the issue was that you could not pass a `ReadonlyArray<T>` type into `concat`.

Let us examine how the type definition for `concat` evolved into its current form.

# 2. Changes Due to Union Types

## 2.1. The Earliest concat Type

The earliest type for `concat` can be found in an issue from September 2014. At that time, the type for the `Array.concat` method was as follows:

```ts
interface Array<T> {
  concat<U extends T[]>(...items: U[]): T[];
  concat(...items: T[]): T[];
}
```

In the first overload, since `U` extends `T[]`, accepting `U[]` as a parameter conceptually corresponds to accepting `T[][]`. Therefore, this aligns with the concept of `concat` in JS, which takes multiple arrays as parameters for merging.

Furthermore, as `concat` can accept individual elements as parameters, as seen in `[1, 2, 3].concat(4, 5, 6)`, the second overload is justified.

## 2.2. Improvements

The JS `concat` method originally allows mixing individual elements and arrays as parameters.

```js
[1, 2, 3].concat(4, [5, 6], 7, [8]) // [1,2,3,4,5,6,7,8]
```

However, the `concat` type seen earlier could not model such behavior. This was pointed out in an issue from January 2016. A subsequent PR in January 2016 amended this.

The comments from that issue stated that the previous `concat` type definition was written before the introduction of union types and relied on generic constraints (`U extends T[]`) for various historical reasons. However, union types had been introduced by then, leading to a revision of the `concat` type as follows:

```ts
interface Array<T> {
  // ...
  concat(...items: (T | T[])[]): T[];
}
```

While it's true that `concat` parameters can contain nested arrays, attempts to model that behavior through type restrictions were not adopted as it negatively impacted type inference.

Nonetheless, now that it can accept both individual elements and arrays as parameters, the type became more flexible and intuitive than previously.

# 3. Overloading Leads to Changes in Type Inference Logic

## 3.1. The Issue

In July 2016, a TS issue was raised concerning improper type inference in `concat`. The following code highlighted the problem:

```ts
// concat-bug.ts
var a: Array<[number, number]> = [[1, 2]];

// TypeScript detects these first two tuples as arrays of numbers (`number[]`) instead of `[number, number]`
// error TS2345: Argument of type '[number[], number[], [number, number]]' is not assignable to parameter of type '[number, number] | [number, number][]'.
a.concat([
  [3, 4],
  [5, 6],
  [7, 8],
]);
```

Reading the error message, it's clear that the parameter type for `concat` should be `[number, number] | [number, number][]`, but there is an error indicating that the parameters provided have incompatible types.

## 3.2. Analysis

In summary, the issue arises from the first two elements of the parameter array being inferred as tuples rather than `[number, number]`. What caused this problem?

As stated above, the type of `concat` was as defined and allowed `T[]` or `T` to both be accepted as parameters. However, issues emerged in inferring the parameter type for `concat`.

```ts
interface Array<T> {
  // ...
  concat(...items: (T | T[])[]): T[];
}
```

Using the example from #2, if `array.concat(1, [2, 3], 4)` is applied with mixed nesting levels, `1` and `4` would be inferred as the top-level argument type `T`, while `[2, 3]` could be inferred as `T[]`, with `T` easily resolvable to `number`.

However, if something like `[[3, 4], [5, 6], [7, 8]]` is passed to `concat`, the compiler faces ambiguity in how to infer the type.

First, `[[3, 4], [5, 6], [7, 8]]` could be inferred as a top-level single parameter, interpreted as the type `T`. In that case, `T` would yield `number[][]` or `[number, number][]`.

Alternatively, the compiler could consider `[[3, 4], [5, 6], [7, 8]]` as a list-wrapped argument. In that case, it would be treated as `T[]`, resulting in `T` potentially being inferred as `number[]` or `[number, number]`.

Had it been inferred as the latter, the issue would not have occurred, but unfortunately, TypeScript inferred it as the former. Thus, the inferred `T` type became `number[][]`, which was incompatible with `a`'s type of `Array<[number, number]>`, resulting in an error.

## 3.3. Resolution

When the previously removed overload was available, these problems vanished. The reason being that the parameter type for `concat` was `T[][]`, allowing it to be prioritized for inference as a subtype of `T[]`.

```ts
// The previously removed concat overload
concat<U extends T[]>(...items: U[]): T[];
```

While removing this overload resulted in issues, it was reintroduced after this issue was reported. It added back an overload for `T[][]` to primarily apply it for parameter type inference.

```ts
interface Array<T> {
  concat(...items: T[][]): T[];
  concat(...items: (T | T[])[]): T[];
}
```

This ensured that the parameter type was inferred as `T[][]`, resolving the previous inference issues.

## 3.4. Sync with ReadonlyArray

`ReadonlyArray` is a read-only array type (lacking `push`, `pop`, etc.), thus serving as a supertype of `Array`. However, a problem arose where [changes to the overload of `Array.concat` were not applied to `ReadonlyArray`, preventing `Array` from being assigned to `ReadonlyArray`.](https://github.com/microsoft/TypeScript/issues/10368)

Consequently, [in August 2016, a PR was made to ensure `ReadonlyArray` mirrors the overload changes of `Array.concat`.](https://github.com/microsoft/TypeScript/pull/10374)

```ts
interface ReadonlyArray<T> {
  concat(...items: T[][]): T[];
  concat(...items: (T | ReadonlyArray<T>)[]): T[];
}
```

# 4. Changing Parameters to ReadonlyArray

In principle, `ReadonlyArray` should also be compatible with `concat`. There’s no reason a read-only array wouldn’t be usable in `concat`.

[However, the existing overloads inferred parameters as `T[][]`, causing an issue where `ReadonlyArray` types could not be concatenated properly.](https://github.com/microsoft/TypeScript/issues/17076)

Thus, [in August 2017, the parameters for `concat` were modified to generally infer as `ReadonlyArray`.](https://github.com/microsoft/TypeScript/pull/17806)

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

# 5. Introduction of ConcatArray - Background

The issue leading to the introduction of `ConcatArray` is documented in a comment by TS lead architect [Anders Hejlsberg](https://github.com/ahejlsberg). This is interpreted and explained further here.

From this point, the concept of variance is deeply relevant. For more details on variance, refer to my previous article, TS Exploration - What is Variance?.

In this document, the terms covariance, contravariance, invariance, and bivariance are adopted in accordance with the translation of Jaemin Hong’s concept of “solid typing with flexible polymorphism.” Note that invariance refers to its strict type definition rather than immutability.

## 5.1. Issue Details

[There was an issue about a lack of type validation for parameters.](https://github.com/microsoft/TypeScript/issues/20268)

```ts
// Error:(3, 28) TS2345: Argument of type 'Processor[]' is not assignable to parameter of type 'Processor | ReadonlyArray<Processor>'.
type Processor<T extends object> = <T1 extends T>(subj: T1) => T1;

function doStuff<T extends object, T1 extends T>(
  parentProcessors: Array<Processor<T>>,
  childProcessors: Array<Processor<T1>>
) {
  childProcessors.concat(parentProcessors);
}
```

First, let’s examine the code. The `Processor<T>` generic accepts a type `T`, which is constrained by `object`, and parameters of type `T1`, which extends `T`, with the function returning `T1`.

The function `doStuff` is intended to merge `parentProcessors` into `childProcessors`. Here, `parentProcessors` is an array of `Processor<T>`, while `childProcessors` is made of `Processor<T1>`, where `T1` is a subtype of `T`.

For there to be no type error in the `concat` invocation within `doStuff`, it must hold that `Array<Processor<T>>` is a subtype of `ReadonlyArray<Processor<T1>>`.

```ts
interface Array<T> {
  concat(...items: ReadonlyArray<T>[]): T[];
  concat(...items: (T | ReadonlyArray<T>)[]): T[];
}
```

This is reasonable for the following reasons:

1. `Processor<T>` exhibits contravariance, as the type accepts `T1`, which is restricted to be a subtype of `T`, thus reflecting a contravariant behavior.
2. Consequently, when `T1` is a subtype of `T`, `Processor<T>` is a subtype of `Processor<T1>`.
3. Since `Array<T>` is a subtype of `ReadonlyArray<T>` and is covariant, when `T1` is a subtype of `T`, `Array<Processor<T>>` should be a subtype of `ReadonlyArray<Processor<T1>>`.

This operation threw an error at that time. The reason behind this was that `Array` could not structurally be a subtype of `ReadonlyArray`.

The complexities involved are quite intricate and necessitate a background review of TS changes.

## 5.2. Background of the Issue - Generic Callback Parameters

To accurately pinpoint the root of issues like the aforementioned, one must examine the [PR that enabled generic types used in callback parameter positions to undergo covariance type checking](https://github.com/microsoft/TypeScript/pull/15104).

At the time, there were no options like `--strictFunctionTypes` enforcing contravariance on function parameter types; therefore, function parameter types were always treated as bivariant.

(Note: An article detailing the rationale behind generics defaulting to covariance in TS is currently in progress and will provide context on this later.)

The upcoming sections elaborate further on this, but basically, the goal was to enable generic types such as `Array<T>` to exhibit covariance functionality. Notably, function parameters naturally require contravariance, which was later realized through the [Strict Function Types PR](https://github.com/microsoft/TypeScript/pull/18654).

During this time when function parameters were always treated as bivariant, how did types only applied to generic callback function parameters fare? Since callbacks are functions, they were similarly considered bivariant. However, the callback function parameter types in object types like `Promise<T>` failed to conduct proper type checks.

```ts
// Both a and b restrict Promise's T type to {foo: "bar"},
// but the actual types passed to a and b differ.
// Thus, no error is thrown as the callback’s parameter was treated as bivariant.
const a: Promise<{ foo: "bar" }> = Promise.resolve({ foo: "typo" });
const b: Promise<{ foo: "bar" }> = Promise.resolve({});
```

Theoretically, it is intuitive that generic types serving as callback parameters should be covariant. Thinking about the usage of callback functions makes it reasonable to view callback function parameters as outputs akin to return types.

To illustrate further, take the common example of `Promise<T>`. The type `T` is exclusively used as a parameter type for the callback function.

For a deeper look into how `Promise` is defined in TS, you can reference the article, TS Exploration - The Definition of TS Promise Type.

Returning to the main topic, it's expected that generic types like `Promise<T>` can be used in a covariant manner while serving as callback parameters, which ultimately lead to changing how callback parameters are type-checked.

## 5.3. Deep Analysis of the Issue

Let’s return and examine why [the aforementioned issue](https://github.com/microsoft/TypeScript/issues/20268) presented itself in the code. Here’s a second look at the code snippet:

```ts
// Error:(3, 28) TS2345: Argument of type 'Processor[]' is not assignable to parameter of type 'Processor | ReadonlyArray<Processor>'.
type Processor<T extends object> = <T1 extends T>(subj: T1) => T1;

function doStuff<T extends object, T1 extends T>(parentProcessors: Array<Processor<T>>, childProcessors: Array<Processor<T1>>) {
  childProcessors.concat(parentProcessors);
}
```

And the earlier `Array.concat` type:

```ts
interface Array<T> {
  concat(...items: ReadonlyArray<T>[]): T[];
  concat(...items: (T | ReadonlyArray<T>)[]): T[];
}
```

As previously mentioned, for no error to occur within `doStuff`, it must hold true that `Array<Processor<T>>` becomes a subtype of `ReadonlyArray<Processor<T1>>`, which seems plausible in theory.

But it turned out not to be the case due to complications arising from structural type checking, particularly with the `indexOf` method's type checking.

For `Array<T>` to be a subtype of `ReadonlyArray<T>`, every member of `Array<T>` must be assignable to every member of `ReadonlyArray<T>`. Now let’s inspect the type of `indexOf` in `Array<T>`.

```ts
interface Array<T> {
  indexOf(searchElement: T, fromIndex?: number): number;
}
```

In the context of our issue, since `Processor<T>` is a subtype of `Processor<T1>`, could `Processor<T>`'s `indexOf` type be assigned to `ReadonlyArray<Processor<T1>>`'s `indexOf` method?

No, it cannot. For this to occur, `Array`’s generics must be covariant. However, at this stage, the "strict function types" change had been implemented, leading the `indexOf` parameter type `T` to be treated as contravariant.

Thus, in this situation, `Array`'s generics could not behave covariantly, leading to the incompatibility with `ReadonlyArray`.

## 5.4. Possible Questions

### 5.4.1. Why did method parameters behave non-covariantly?

[TS has been anticipating this through methods like `push`, and the TS team has avoided such issues through an earlier compromise of always treating method parameters as bivariant. For more information, refer to Hyunseob Lee's article "What is Covariance?".](https://seob.dev/posts/%EA%B3%B5%EB%B3%80%EC%84%B1%EC%9D%B4%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80)

In light of that, one may wonder why the `indexOf` method didn’t operate as bivariant.

That query is addressed within the comments of the issue, clarifying that method parameters are typically treated bivariantly; however, in this case, generics were considered in relation to callback functions’ parameter types.

```ts
childProcessors.concat(parentProcessors);
```

Looking at the snippet, for `childProcessors.concat`, one could conceptualize a scenario where `parentProcessors.indexOf` acts as the callback function while treating `searchElement` as a callback function parameter (not necessarily functioning in the exact operational code, but illustrating the inference process).

Thus, the changes from the earlier PR apply to callbacks when the type is not declared as a method.

> “Where T is used only in callback parameter positions, will be co-variant (as opposed to bi-variant) concerning T.”

Consequently, the type for `T` in `Array` (i.e., parameter type of `indexOf`) did not undergo bivariant type checking.

However, needless to say, `Array<T>` holds methods that consume `T` as input parameters, such as `indexOf`, alongside methods like `shift`, which deal with outputs. Likewise, methods like `reduce` can do both.

```ts
interface Array<T> {
  indexOf(searchElement: T, fromIndex?: number): number;
  shift(): T | undefined;
  // The various overloads of reduce are irrelevant here, omitted for clarity
  reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T;
}
```

Thus, due to these nuances, both `Array<T>` and similarly `ReadonlyArray<T>` behaved invariantly.

### 5.4.2. Why wasn’t strict type checking for callback parameters applied?

By the time of resolving the issue, [a PR focusing on enforcing strict typing for callback parameters](https://github.com/microsoft/TypeScript/pull/18976) had been merged. One might wonder why this strict type checking wasn't enforced on callback functions.

The answer lies in the fact that method parameters still operated under bivariance. The [PR comments](https://github.com/microsoft/TypeScript/pull/18976#issuecomment-334623422) noted that strict callback parameter checking applies only when those parameters aren't declared as method types.

> "We suppose we could say that a callback parameter check occurs only if the callback type isn't declared as a method."

The reason strict type checking wasn’t applied to method parameters results from the myriad types reliant on the return types of callbacks. For instance, methods like `reduce` can complicate this scenario further. 

```ts
// If reduce's callback was strictly type-checked, 
// T becomes a parameter type for the function, thus contravariant and 
// as a callback parameter, covariant.
// This would consequently render Array<T> invariant as seen in the earlier issue context.
interface Array<T> {
  reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue?: T): T;
}
```

Nonetheless, when a method uses a callback function, the previously mentioned changes do take effect. In cases where a method borrows callback parameters, these are treated covariantly.

> “Where T is used only in callback parameter positions, will be co-variant (as opposed to bi-variant) concerning T.”

## 5.5. Summary

![Type Structure of the Issue](./type-structure.png)

The invariance regarding `ReadonlyArray<T>` and `Array<T>` stemmed from the following associated issues:

- [#15104(Covariant checking for callback parameters)](https://github.com/microsoft/TypeScript/pull/15104) 

This change allowed callback parameter types for arrays to behave covariantly, which meant that `Array.indexOf`'s argument type was treated covariantly.

- [#18654(Strict function types)](https://github.com/microsoft/TypeScript/pull/18654) 

The function's parameter types were transitioned to contravariance, making method parameters exceptions to become bivariant. However, because of issue #15104, `Array.indexOf`'s parameter type was seen as a callback type in the `concat` method and thus was not strictly scrutinized - leaving its type in a contradictory scenario.

- [#18976(Strictly check callback parameters)](https://github.com/microsoft/TypeScript/pull/18976) became ineffective

This PR sought to enforce stringent checks on callback function arguments, but it ultimately proved insignificant as method parameters retained their non-strict treatment.

As a result, `Array<T>` and `ReadonlyArray<T>` turned invariant, subsequently hampering `Array<T>` and `ReadonlyArray<T>` structural comparisons to maintain that invariance. Consequently, in issue-related scenario, `parentProcessors`'s type could not be a subtype of `childProcessors`, thereby resulting in an error.

Additionally, the issue of structurally comparing `ReadonlyArray` and `Array` under `--strictFunctionTypes` resulted in similar invariance problems as highlighted by comments in [another issue discussion](https://github.com/microsoft/TypeScript/issues/20454#issuecomment-406453517).

Notably, while there were discussions on making types like `indexOf` behave covariantly to resolve such issues, they often led to limiting solutions or reliance on `any` types pervading scenarios. Thus, the existing overloadization in `concat` types proved fraught with issues.

# 6. Introduction of ConcatArray

## 6.1. Simple Resolution of Previous Issues

Ultimately, the core challenge we outlined previously stems from `Array<T>` not being a subtype of `ReadonlyArray<T>`.

To rectify this is remarkably straightforward: one could simply adjust the `concat` parameter types to encompass both `ReadonlyArray<T>` and `Array<T>` within a union. A PR addressing this [implemented the following overloads to modify the type for `concat`](https://github.com/microsoft/TypeScript/pull/20455):

```ts
interface Array<T> {
  concat(...items: (T[] | ReadonlyArray<T>)[]): T[];
  concat(...items: (T | T[] | ReadonlyArray<T>)[]): T[];
}
```

Some comments at that time advocated that it's generally unwise to mutate the arrays within callbacks, suggesting the practice of using `ReadonlyArray<T>` for all callback types in `Array<T>` methods would elegantly solve matters. However, this would lead to significant breaking changes, motivating the exploration of the next solutions discussed.

## 6.2. Structural Typing Based Solution

[In 2018, the current type as a PR emerged](https://github.com/microsoft/TypeScript/pull/21462). The change involved the following: the existing type for `Array.concat`, which accepted `T[]` and a union of `ReadonlyArray<T>`, was seen as a bottleneck for compilation performance. Thus, the overloads were streamlined as follows:

```ts
interface Array<T> {
  concat(...items: T[][]): T[];
  concat(...items: ReadonlyArray<T>[]): T[];
  concat(...items: (T | T[])[]): T[];
  concat(...items: (T | ReadonlyArray<T>)[]): T[];
}
```

However, this multitude of overloads was perceived as suboptimal by [Anders Hejlsberg](https://github.com/ahejlsberg), who proposed the introduction of a new type, `InputArray`, which would serve similar functions under the hood - allowing structural type checking to pass for `Array<T>` or `ReadonlyArray<T>` while relegating methods like `indexOf` that require invariance.

```ts
interface InputArray<T> {
  readonly length: number;
  readonly [n: number]: T;
  join(separator?: string): string;
}
```

The `join` method was retained to prevent overlap with similar objects that may mimic arrays. With that, the `concat` method was proposed to be amended as follows:

```ts
interface Array<T> {
  concat(...items: InputArray<T>[]): T[];
  concat(...items: (T | InputArray<T>)[]): T[];
}
```

This approach is slightly less type-safe than utilizing `ReadonlyArray<T>`, as `InputArray<T>` could accommodate non-array parameter types conforming to its structure. Still, the risk was minimal since the number of overlapping cases would not likely escalate significantly, while reducing overload count, treating both `Array<T>` and `ReadonlyArray<T>` as structurally compliant and enhancing compile speed by approximately 10%. (Although there seems to be some disagreement regarding the impact of compile speed, it was generally agreed that it didn't worsen.)

However, criticism arose regarding the overly permissive definition of `InputArray<T>` being defined solely by `length` and `join`—leading to concerns over unwanted overlaps. This birthed a discussion to include a `slice` method and rename the type to `ConcatArray`.

```ts
interface ConcatArray<T> {
  readonly length: number;
  readonly [n: number]: T;
  join(separator?: string): string;
  slice(start?: number, end?: number): T[];
}
```

Thus, the overloads for `concat` were finalized as follows, establishing the `current` type:

```ts
interface Array<T> {
  concat(...items: ConcatArray<T>[]): T[];
  concat(...items: (T | ConcatArray<T>)[]): T[];
}
```

# 7. Looking Ahead

As of December 2023, it has been five years since the last PR concerning `concat` was merged. Throughout that time, numerous issues have emerged, including [the concern that empty arrays can't be targeted by `concat`.](https://github.com/microsoft/TypeScript/issues/26976)

```ts
// No overload matches this call.
let a1 = [].concat(["a"]);
```

A subsequent PR [aimed to remedy this issue](https://github.com/microsoft/TypeScript/pull/33645), but has remained unaddressed for a significant time due to the challenge in altering array types.

A newly proposed type for `concat` exists, suggesting the `ConcatArray<T>` type remain as noted previously.

```ts
interface Array<T> {
  concat(...items: ConcatArray<T>[]): T[];
  concat<U extends any[]>(...items: U): (T | Flatten<U[number]>)[];
}

type Flatten<T> = T extends undefined ? T : T extends ConcatArray<infer U> ? U : T;
```

This overload accommodates targeting empty arrays and enables concatenation of distinct types, thereby addressing multiple issues at once.

Therefore, in hopes of reflecting the improvements on array types, the TS team has initiated [an open PR collecting examples of array methods not functioning as expected.](https://github.com/microsoft/TypeScript/issues/36554) It is my hope that these enhancements will someday be adopted, leading to further advancements in the `concat` types. 

# References

Seeing Anders Hejlsberg's name repeatedly has led to a sense of familiarity. His comments on GitHub issues and PRs have been invaluable.

Hong, Jaemin, Solid typing with flexible polymorphism, https://product.kyobobook.co.kr/detail/S000210397750

MDN's Documentation on `Array.prototype.concat()` https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/concat

Weird Array.concat Declaration and Associated LanguageService/TypeChecker Issues https://github.com/microsoft/TypeScript/issues/738

Union Types and Array.concat Problem https://github.com/microsoft/TypeScript/issues/4216

Confusing Type Error Message in Concat https://github.com/microsoft/TypeScript/issues/6594

Update Array.concat Type Signature to Fix #6594 https://github.com/microsoft/TypeScript/pull/6629

Tuple Types Get Incorrect Contextual Type https://github.com/microsoft/TypeScript/issues/9901

Re-add Strict Concat Signature https://github.com/microsoft/TypeScript/pull/9997

Array Not Assignable to ReadonlyArray with Subclass Items https://github.com/microsoft/TypeScript/issues/10368

Improve `ReadonlyArray<T>.concat` to Match `Array<T>` https://github.com/microsoft/TypeScript/pull/10374

Can't Concat ReadonlyArray https://github.com/microsoft/TypeScript/issues/17076

Array Arguments to Concat Should Be ReadonlyArrays https://github.com/microsoft/TypeScript/pull/17806

Polymorphic Arguments Validation Error https://github.com/microsoft/TypeScript/issues/20268

Generic Parameters Not Fully Type-Checked (e.g., Promise) https://github.com/microsoft/TypeScript/issues/14770

Covariant Checking for Callback Parameters https://github.com/microsoft/TypeScript/pull/15104

Array of Generic Functions Not Assignable to ReadonlyArray #20454 Comments https://github.com/microsoft/TypeScript/issues/20454#issuecomment-406453517

Hack to Allow Concat to Work Even When an Array Isn't Assignable to ReadonlyArray https://github.com/microsoft/TypeScript/pull/20455

StrictFunctionTypes Has Different Behavior with Parameter Types and Return Types #18963 https://github.com/microsoft/TypeScript/issues/18963

Strictly Check Callback Parameters #18976 https://github.com/microsoft/TypeScript/pull/18976

Overloads in Array.concat Now Handle ReadonlyArray https://github.com/microsoft/TypeScript/pull/21462

Add Additional Overloads to Array.prototype.concat #26976 https://github.com/microsoft/TypeScript/pull/26976

Better Typings for Array.concat(), etc. https://github.com/microsoft/TypeScript/pull/33645

Array Method Definition Revamp: Use Case Collection https://github.com/microsoft/TypeScript/issues/36554

Strict Function Types #18654 https://github.com/microsoft/TypeScript/pull/18654

What is Covariance? https://seob.dev/posts/%EA%B3%B5%EB%B3%80%EC%84%B1%EC%9D%B4%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80

TypeScript FAQ - Why are Function Parameters Bivariant? https://github.com/Microsoft/TypeScript/wiki/FAQ#why-are-function-parameters-bivariant