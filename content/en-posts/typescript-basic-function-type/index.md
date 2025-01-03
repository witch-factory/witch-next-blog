---
title: Exploring TS - A Study of the Types of bind, call, and apply Methods in TS
date: "2023-11-20T00:00:00Z"
description: "Let's explore the method types belonging to Function.prototype in TS."
tags: ["typescript"]
---

While reading a TypeScript textbook, I opened `lib.es5.d.ts` to investigate the types of the `call`, `apply`, and `bind` methods belonging to `Function.prototype`. I found some intriguing aspects that prompted me to write this article. Although there are numerous points to elaborate on, I've organized what I can for now.

# 1. this Utility Types

Let's first look at the this-related utility types that will be used in the types discussed in this article. Although they are defined after the `Function` type in the actual file, I believe it is better to introduce them here first for clarity.

## 1.1. ThisParameterType

`ThisParameterType<T>` extracts the type of the `this` parameter from the function `T`. If the inference of `T`'s `this` parameter type fails, it resolves to `unknown`.

```ts
type ThisParameterType<T> = T extends (this: infer U, ...args: never) => any ? U : unknown;
```

Since function parameter types have contravariant behavior, having `...args` as `never` means that a function with any parameters will not be filtered out by the extends constraint on the type. [In fact, the original `...args` type was `any[]`, but it was changed to `never` for a more general type, which is documented in a commit.](https://github.com/microsoft/TypeScript/commit/66dba1331ba0a9a27cc35f2901253766ef20d0c5)

## 1.2. OmitThisParameter

Using the previously examined `ThisParameterType`, there is a utility type to remove the `this` type from a function.

```ts
/**
 * Removes the 'this' parameter from a function type.
 */
type OmitThisParameter<T> = unknown extends ThisParameterType<T> ? T : T extends (...args: infer A) => infer R ? (...args: A) => R : T;
```

If `ThisParameterType<T>` resolves to `unknown`, it means that the function does not have a `this` type, so `T` is returned as is. Conversely, if the function has a `this` type, we move onto this definition:

```ts
T extends (...args: infer A) => infer R ? (...args: A) => R : T;
```

By applying type inference to the parameters, the function type is rebuilt without `this`, creating a type that omits `this`.

# 2. Function

TypeScript defines three function types: `Function`, `CallableFunction`, and `NewableFunction`. Each of these defines its respective method types. Let’s explore their distinctions, history, and the details of each method type.

Types like `CallableFunction` and `NewableFunction` employ quite complex types for strict type definitions, which I will also explain in the next sections. However, let’s first examine the most basic type, `Function`.

## 2.1. Function Interface

`Function` is the interface defining the most general function type. As we will see, if the `strictBindCallApply` compiler option in `tsconfig.json` is set to false, the types of the `bind`, `call`, and `apply` methods applied to functions are derived from this interface. The default value of this option is true, so this type is generally not used very often.

```ts
// 
function add(a: number, b: number): number {
    return a + b;
}

// When strictBindCallApply:false, the apply type of the Function interface is used
// When strictBindCallApply:true, the apply type of the CallableFunction interface is used
const addTest = add.apply(null, [1, 2]);
```

The method types of this interface are defined as follows. The parameters `thisArg` (which becomes the new `this`) and `argArray` are simply defined as `any`. The return type is also `any`.

```ts
interface Function {
    apply(this: Function, thisArg: any, argArray?: any): any;
    call(this: Function, thisArg: any, ...argArray: any[]): any;
    bind(this: Function, thisArg: any, ...argArray: any[]): any;
    toString(): string;
    prototype: any;
    readonly length: number;

    // Non-standard extensions
    arguments: any;
    caller: Function;
}

interface FunctionConstructor {
    new(...args: string[]): Function;
    (...args: string[]): Function;
    readonly prototype: Function;
}

declare var Function: FunctionConstructor;
```

When `strictBindCallApply:false`, `bind`, `call`, and `apply` will all make use of the method types defined here. As all `thisArg`, parameters, and return types are `any`, it does not matter how the original function's parameter types were defined; `call`, `apply`, etc. can be applied without causing type errors.

```ts
// When strictBindCallApply:false
function fn(x: string) {
  return parseInt(x);
}
// Even though fn's argument is string, apply's argument is boolean. However, apply's argArray is any, so no type error occurs.
const n = fn.call(undefined, false);

// Passing more arguments than originally required for fn does not cause a type error
fn.call("hi", 1, 2, 3, 4, 5, 6, 7);
```

On the other hand, if the `strictBindCallApply` option is set to true, the method types from `CallableFunction` will apply to ordinary functions, and the `NewableFunction` type will apply to constructor functions, meaning that the method types from this interface will not be used very often.

## 2.2. Usage of Function Type

Then, are there any scenarios where this type is used when the `strictBindCallApply` option is true? Through the `FunctionConstructor` type, it can be inferred that there are such cases. Experimental results confirmed this suspicion; functions created with `new Function()` possess the `Function` interface type.

Although this syntax is not commonly used, functions can be created through the function constructor like `new Function(...)`. For detailed syntax, refer to [the new Function syntax](https://ko.javascript.info/new-function). In any case, if such a function is created and then `bind`, `call`, or `apply` is applied, the method types from the `Function` type are utilized even with the `strictBindCallApply` option set to true.

```ts
const sum = new Function("a", "b", "return a + b");

// sumApply, sumCall, sumBind will all have any type due to the return type of the Function interface's methods
// Moreover, if we navigate to the applied type definition, we will see the methods of the Function interface.
const sumApply = sum.apply("global", [1, 2]);
const sumCall = sum.call("global", 1, 2);
const sumBind = sum.bind("global", 1, 2);
```

## 2.3. Why is This Type So Lax?

However, it seems that there is little that can be done with this type. Why does such a lax type exist, which does not offer much in terms of type checking? I have some speculations on that.

[When the overloaded types for apply, call, and bind were initially introduced, they were not this lax. The original commit history is still accessible. At that time, they were not in es5.d.ts but rather in core.d.ts.](https://github.com/microsoft/TypeScript/commit/5fe84781592a08b5294e01a2fbf42d1def07111d)

```ts
interface Function {
    apply<T,U>(this: (this: T, ...argArray: any[]) => U, thisArg: T, argArray?: any): U;
    apply(this: Function, thisArg: any, argArray?: any): any;
    call<T,U>(this: (this: T, ...argArray: any[]) => U, thisArg: T, ...argArray: any[]): U;
    call(this: Function, thisArg: any, ...argArray: any[]): any;
    bind<T, U>(this: (this: T, ...argArray: any[]) => U, thisArg: T, ...argArray: any[]): (...argArray: any[]) => U;
    bind(this: Function, thisArg: any, ...argArray: any[]): any;

    prototype: any;
    readonly length: number;

    // Non-standard extensions
    arguments: any;
    caller: Function;
}
```

Using generics, we can see how the thisArg type required was harmonized with the return type of the original function. 

There are certainly still weaknesses in this structure. For instance, the parameter type is sloppily defined as `any[]`. It is speculated that stricter syntax for parameter type checks did not exist at the time. [The feature for inferring rest parameters as tuple types was introduced in June 2018.](https://github.com/microsoft/TypeScript/pull/24897) Additionally, [the concept of covariance was not properly introduced until the TS 2.6 release in 2017.](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-6.html)

It is evident to anyone that the previous version of the Function interface provided much better checks than the current one. However, those generic definitions for the call, apply, and bind methods ultimately disappeared without notice, while the Function type has become as lax as it is now.

Moreover, in [September 2018, the CallableFunction and NewableFunction interfaces, along with more rigorous definitions of the call, apply, and bind types, were introduced.](https://github.com/microsoft/TypeScript/pull/27028)

Since that PR, the use cases for this lax Function type have been limited to cases involving `new Function` or the rarely used scenario where the `strictBindCallApply` option is disabled. It is speculated that such infrequent occurrences led to the lack of significant modifications in the type.

# 3. CallableFunction

CallableFunction is utilized when the `strictBindCallApply` compiler option is set to true. The types of the bind, call, and apply methods for the callable functions we typically use are strictly defined using generic rest parameter types.

[This feature emerged due to the release of the generic mechanism for inferring the rest parameters as tuple types, which was mentioned as enabling better type checking for bind, call, and apply in the PR for this feature.](https://github.com/microsoft/TypeScript/pull/24897)

```ts
interface CallableFunction extends Function {
    apply<T, R>(this: (this: T) => R, thisArg: T): R;
    apply<T, A extends any[], R>(this: (this: T, ...args: A) => R, thisArg: T, args: A): R;
    call<T, A extends any[], R>(this: (this: T, ...args: A) => R, thisArg: T, ...args: A): R;
    bind<T>(this: T, thisArg: ThisParameterType<T>): OmitThisParameter<T>;
    bind<T, A extends any[], B extends any[], R>(this: (this: T, ...args: [...A, ...B]) => R, thisArg: T, ...args: A): (...args: B) => R;
}
```

## 3.1. apply, call

Looking at the method types for apply and call in the above interface, they are defined as follows.

```ts
apply<T, R>(this: (this: T) => R, thisArg: T): R;
apply<T, A extends any[], R>(this: (this: T, ...args: A) => R, thisArg: T, args: A): R;
call<T, A extends any[], R>(this: (this: T, ...args: A) => R, thisArg: T, ...args: A): R;
```

Although they appear complex, let's consider how apply and call are actually invoked and relate that to the types.

```ts
fn.apply(thisArg, [arg1, arg2, ...]);
fn.call(thisArg, arg1, arg2, ...);
```

In this case, `this` corresponds to the function `fn` on which apply or call is invoked, and the type of `thisArg` is `T`, while the list of parameters `arg1`, `arg2...` forms a tuple type represented by `A`. The return type `R` is defined to match the original `this`’s `this` type, parameter types, and return type.

This ensures that the new function created by the method respects the original function's `this`, parameter, and return types; otherwise, a type error would occur.

```ts
// When strictBindCallApply:true
function add(a: number, b: number): number {
  return a + b;
}

const addTest = add.apply(null, [1, '2']); // A type error occurs because string cannot be assigned to the number parameter.
```

## 3.2. bind

The type for `bind` is defined as follows.

```ts
bind<T>(this: T, thisArg: ThisParameterType<T>): OmitThisParameter<T>;
bind<T, A extends any[], B extends any[], R>(this: (this: T, ...args: [...A, ...B]) => R, thisArg: T, ...args: A): (...args: B) => R;
```

### 3.2.1. First Overload

```ts
bind<T>(this: T, thisArg: ThisParameterType<T>): OmitThisParameter<T>;
```

The `bind` function returns a bound function with a special internal property `[[BoundThis]]` that holds the object to be used as `this`. Therefore, this returned function no longer needs to regard `this`. Hence, it returns a type where `this` has been removed, as established by `OmitThisParameter`.

If `this` were not omitted, an error would occur. By altering this definition in `lib.es5.d.ts` from `OmitThisParameter<T>` to `T`, one can experiment. Even in a simple piece of code, an error arises.

```ts
function add(this: number, a = 0, b = 0) {
  return this + a + b;
}

const addCustomBind = add.bind(1);
addCustomBind(2, 3); // The 'this' context of type 'void' is not assignable to method's 'this' of type 'number'
```

The context for `addCustomBind` is already defined as the number 1, but here it tries to apply the global context, leading to an error. Assigning a return type that omits `this` via `OmitThisParameter<T>` resolves this issue.

### 3.2.2. Second Overload - Previous Version

Looking back at the [PR where `CallableFunction` was first introduced](https://github.com/microsoft/TypeScript/pull/27028), the bind type definition used to be structured as follows.

```ts
interface CallableFunction extends Function {
    /* apply, call type definitions omitted */

    bind<T, A extends any[], R>(this: (this: T, ...args: A) => R, thisArg: T): (...args: A) => R;
    bind<T, A0, A extends any[], R>(this: (this: T, arg0: A0, ...args: A) => R, thisArg: T, arg0: A0): (...args: A) => R;
    bind<T, A0, A1, A extends any[], R>(this: (this: T, arg0: A0, arg1: A1, ...args: A) => R, thisArg: T, arg0: A0, arg1: A1): (...args: A) => R;
    bind<T, A0, A1, A2, A extends any[], R>(this: (this: T, arg0: A0, arg1: A1, arg2: A2, ...args: A) => R, thisArg: T, arg0: A0, arg1: A1, arg2: A2): (...args: A) => R;
    bind<T, A0, A1, A2, A3, A extends any[], R>(this: (this: T, arg0: A0, arg1: A1, arg2: A2, arg3: A3, ...args: A) => R, thisArg: T, arg0: A0, arg1: A1, arg2: A2, arg3: A3): (...args: A) => R;
    bind<T, AX, R>(this: (this: T, ...args: AX[]) => R, thisArg: T, ...args: AX[]): (...args: AX[]) => R;
}
```

The first overload was modified in the [commit to improve typing of the 'bind' method on function types](https://github.com/microsoft/TypeScript/commit/9cc997fca76d0befe9ba42803a6be9263f2b24dc) into the form seen in section 3.2.1. The other overloads were improved later on, [in April of this year.](https://github.com/microsoft/TypeScript/commit/33ab6fd0d5eceb7715000398382b60d64dde1c67) However, the previous form is still worth examining.

The first overload has a similar structure to what we observed earlier, so let’s focus on the second overload.

```ts
bind<T, A0, A extends any[], R>(this: (this: T, arg0: A0, ...args: A) => R, thisArg: T, arg0: A0): (...args: A) => R;
```

`A0` is the type of the first parameter, and `A` becomes the tuple type of the remaining parameter types. So essentially, the `bind` function captures and splits the original parameters' types into the first parameter and the rest.

The parameters and return type of the bound function generated by `bind` are determined by the original function's parameters. When using the `bind` function, the first argument is `'hi'`, meaning `T` becomes `string`, with `arg0` as `2`, thus `A0` is of type number. The types of the remaining parameters and return are inferred from the `add` function:

```ts
function add(a: number, b: number) {
  return a + b;
}

add.bind('hi', 2);
```

This process also reflects the other overloads, where the original function's parameter types are segregated to define how many parameters are removed by `bind`.

The last overload adopts a different structure:

```ts
bind<T, AX, R>(this: (this: T, ...args: AX[]) => R, thisArg: T, ...args: AX[]): (...args: AX[]) => R;
```

This type isn't too complex. Unlike the earlier overloads that define the original number of parameters while omitting some, this defines the parameters from the original function and the bound function as `AX[]`.

Realistically, this restricts the number of overloads for `bind` to four since it's not feasible to define the overloads for an arbitrary number of parameters that can be passed to `bind`.

> Note that the overloads of bind include up to four bound arguments beyond the this argument. (In the real-world code we inspected during the research for this PR, practically all uses of bind supplied only the this argument, and a few cases supplied one regular argument. No cases with more arguments were observed.)

According to the findings in the [Strict bind, call, and apply methods on functions PR](https://github.com/microsoft/TypeScript/pull/27028), it was observed that almost all code examined used `bind` with only the `thisArg` argument, with just a few instances using one regular argument. It seems reasonable to limit overloads up to four parameters in this case. This was later improved, but still, this limitation makes practical sense.

### 3.2.3. Improved Second Overload

In the current version of TypeScript's `lib.es5.d.ts`, the second overload of bind is defined as follows:

```ts
bind<T, A extends any[], B extends any[], R>(this: (this: T, ...args: [...A, ...B]) => R, thisArg: T, ...args: A): (...args: B) => R;
```

It appears that the TypeScript compiler was enhanced to handle multiple generics in tuple forms, which led to these improvements. 

In this case, all parameter types following `thisArg` are aggregated into a single tuple type `A`, removing them from the original function's parameter types, which are now represented as `B`. 

Both the `this` type for the function and the return type for the bound function are defined by `T` and `R`, respectively, ensuring consistency.

# 4. NewableFunction

`NewableFunction` includes the method types for `bind`, `call`, and `apply` that are applicable to constructor functions.

```ts
interface NewableFunction extends Function {
    apply<T>(this: new () => T, thisArg: T): void;
    apply<T, A extends any[]>(this: new (...args: A) => T, thisArg: T, args: A): void;
    call<T, A extends any[]>(this: new (...args: A) => T, thisArg: T, ...args: A): void;
    bind<T>(this: T, thisArg: any): T;
    bind<A extends any[], B extends any[], R>(this: new (...args: [...A, ...B]) => R, thisArg: any, ...args: A): new (...args: B) => R;
}
```

## 4.1. apply, call

In general, the format is quite similar to `CallableFunction`.

```ts
// apply, call in CallableFunction
apply<T, R>(this: (this: T) => R, thisArg: T): R;
apply<T, A extends any[], R>(this: (this: T, ...args: A) => R, thisArg: T, args: A): R;
call<T, A extends any[], R>(this: (this: T, ...args: A) => R, thisArg: T, ...args: A): R;

// apply, call in NewableFunction
apply<T>(this: new () => T, thisArg: T): void;
apply<T, A extends any[]>(this: new (...args: A) => T, thisArg: T, args: A): void;
call<T, A extends any[]>(this: new (...args: A) => T, thisArg: T, ...args: A): void;
```

The treatment of parameters as 'A' generics is almost identical, so nothing particularly noteworthy arises here. The essence is that the arguments required by the constructor functions are also forwarded to the call and apply methods.

What is interesting is why the function types include the `new` keyword, and why the this type has transitioned from the function's `this` type to the return type of that function.

The application of this typing overload is most easily understood by examining the scenarios in which it is used. A slightly modified version of the code from the [PR that introduced these typings](https://github.com/microsoft/TypeScript/pull/27028) provides clarity.

This is the case where the apply and call method types of `NewableFunction` are employed.

```ts
class Person {
  constructor(public name: string, public age: number) {
    this.name = name;
    this.age = age;
  }
}

declare let p: Person;

let pBind = Person.bind({}, "Mark");
let pCall = Person.call(p, "Mark", 39);
let pApply = Person.apply(p, ["Mark", 39]);
```

It's evident that this typing applies to class constructor functions when called similarly to `new Person()`. In this instance, the `this` for the call or apply method type corresponds to the class constructor function. The constructor function yields an instance of the Person class when called with `new`.

However, the `thisArg` that must be accepted in `call` and `apply` corresponds to the instance type created by that constructor function, reflecting the underlying mechanics of classes. Therefore, the `this` parameter becomes the constructor function that returns an instance's type.

## 4.2. bind

```ts
bind<T>(this: T, thisArg: any): T;
bind<A extends any[], B extends any[], R>(this: new (...args: [...A, ...B]) => R, thisArg: any, ...args: A): new (...args: B) => R;
```

In the first overload, it is noticeable that neither `ThisParameterType` nor `OmitThisParameter` is used. This is because JS ignores the `this` binding in classes, rendering it unnecessary to remove it from the type of the argument. Furthermore, since it is disregarded, `thisArg` can conveniently be defined as `any`.

Nevertheless, the bound arguments function as expected. For instance, the type of `pBind` is `new (age: number) => Person`, reflecting the behavior of constructor functions accurately, hence the typing retains the `new` keyword.

```ts
class Person {
  constructor(public name: string, public age: number) {
    this.name = name;
    this.age = age;
  }
}

// this is bound to null but ignored, and retains typeof Person
let p0 = Person.bind(null);
// The bound arguments function correctly outputs pBind: new (age: number) => Person type.
let pBind = Person.bind({}, "Mark");
```

The behavior implementing this is precisely the second overload of `bind` in `NewableFunction`, with `thisArg` remaining as `any`. Yet, like `CallableFunction`, the parameters derived from the current operation are passed to define the types for the parameters of the bound function.

# 5. Issues with Generics and Overloads

According to the [release notes for TS 3.2](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-2.html), there remain issues in this type. The overloads for bind, call, and apply do not effectively model generic function types.

[An issue regarding this was raised in the initial PR introducing `strictBindCallApply`.](https://github.com/Microsoft/TypeScript/pull/27028) The code presented in the issue is as follows:

```ts
function foo<T>(name: string, arg: T): T {
  return arg;
}

// fooFunction: (arg: unknown) => unknown
let fooFunction = foo.bind(undefined, "Matt");
// fooResult: unknown
let fooResult = foo.bind(undefined, "Matt")("TypeScript");

function bar(name: string, arg: number): number;
function bar(name: string, arg: string): string;
function bar(name: string, arg: string | number) {
  console.log(name);
  return typeof arg === "number" ? arg + 1 : arg + "1";
}

// Error: Argument of type 'number' is not assignable to parameter of type 'string'.
let barResult = bar.bind(undefined, "Matt")(5);
```

In the code above, `fooFunction` should ideally be typed as `(arg: T) => T`. However, the type parameter is lost and replaced with `unknown`. Furthermore, in `fooResult`, the string parameter intended for `T` should resolve to `string`, yet it becomes `unknown`.

For reference, this was previously `{}` type until before TS 3.5, but it changed to `unknown` due to [the shift in default type parameters.](https://github.com/Microsoft/TypeScript/pull/30637)

Similarly, in the case of `bar`, the `bind` operation should apply to the first overload, but it unexpectedly targets the wrong overload, leading to a type error.

[This issue has been reopened in 2023.](https://github.com/microsoft/TypeScript/issues/54707) [However, according to a response from a TS contributor on StackOverflow, there are no immediate plans for improvement at this time.](https://stackoverflow.com/questions/76924554/why-doesnt-typescript-correctly-infer-this-type)

## 5.1. Workaround

One workaround to partially address these issues at this point is to explicitly provide types for the generic arguments in the function type, eliminating the generics altogether. For instance, `fooResult` can be redefined as follows:

```ts
let fooResult = (foo<string>).bind(undefined, "Matt")("TypeScript");
```

By specifying a type for `foo` in this manner, it becomes an [Instantiation Expression](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#instantiation-expressions), and thus, no longer regarded as a generic function type. Consequently, the risk of losing a type parameter is mitigated.

Here, `foo<string>` resolves to `(name: string, arg: string) => string` type, and through following the bind type definitions, the result for `fooResult` is `string`.

However, this does diminish the benefits of defining the function as generic, so it is not a comprehensive solution. Still, it is a better scenario than facing the issue of the lack of any workaround regarding the overload problem.

# References

Jo Hyun-young - TypeScript Textbook

What is the NewableFunction interface used for? https://stackoverflow.com/questions/74368378/what-is-the-newablefunction-interface-used-for

bind(), call(), and apply() are untyped https://github.com/microsoft/TypeScript/issues/212

Tuples in rest parameters and spread expressions https://github.com/microsoft/TypeScript/pull/24897

TypeScript PR, Strict bind, call, and apply methods on functions https://github.com/microsoft/TypeScript/pull/27028

Proposal: Variadic Kinds -- Give specific types to variadic functions https://github.com/microsoft/TypeScript/issues/5453

lib Fix Part 5/6 – Function.{apply, bind} https://github.com/microsoft/TypeScript/pull/50453

TypeScript 3.2 release note https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-2.html

Strict Bind Call Apply - strictBindCallApply https://www.typescriptlang.org/tsconfig#strictBindCallApply

Generics are lost during Function.prototype.bind() and Function.prototype.call() https://github.com/microsoft/TypeScript/issues/54707

Why doesn't TypeScript correctly infer `this` type? https://stackoverflow.com/questions/76924554/why-doesnt-typescript-correctly-infer-this-type

Change the default type parameter constraints and defaults to unknown from {} https://github.com/Microsoft/TypeScript/pull/30637