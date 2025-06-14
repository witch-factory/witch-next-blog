---
title: Exploring TypeScript - Forgotten Keywords and Syntax, const Generics, Variance Control, Override Control, Asserts
date: "2025-06-05T00:00:00Z"
description: "Encounter forgotten syntax in TypeScript. Keywords like const generics, in/out variance parameters, override control, and asserts that are used in limited scenarios."
tags: ["typescript"]
---

# Introduction

While studying TypeScript, I learned about many keywords and their uses. From common interview questions like `type`, `interface`, and `enum` to useful keywords like `satisfies`, `infer`, and `declare`. There are many discussions around these keywords, and I have much more to study.

However, I have occasionally come across keywords or syntax in TypeScript that are almost forgotten. These aren't typically encountered while studying TypeScript thoroughly. They are rarely used in practice. I found them while studying other languages or concepts and wondering, "Does TypeScript have something like this?" or "Is such functionality possible?"

Therefore, the topics covered here are mostly limited in documentation and used in restricted situations. The subjects mentioned are almost forgotten, making them less practical from readability and collaboration perspectives.

Nonetheless, these are valid syntax forms that serve a purpose. Even if I do not use them in coding, I believe it is beneficial to explore these ideas. In this article, I will discuss the forgotten syntax of TypeScript that I have encountered.

# Generics

## const Generic Type Parameters

I discovered this while researching the `as const` syntax. TypeScript usually infers the type of objects or arrays as generically as possible. For example, in the following case, `words` is inferred as `string[]` type.

```ts
const words = ["Apple", "Banana", "Cherry"];
```

The same applies to inferring types of generic type parameters. In the following example, `T` is inferred as `string`, and `halfWords` is also inferred as `string[]`.

```ts
function getHalf<T>(arr: T[]): T[] {
  return arr.slice(0, arr.length / 2);
}

const halfWords = getHalf(["Apple", "Banana", "Cherry"]); // string[]
```

Since `halfWords` may be modified later, this inference is quite reasonable. However, there are times when we want the type inference of generic type parameters to be stricter. For instance, we want `T` to be inferred as `"Apple" | "Banana" | "Cherry"`.

In this case, you can use `as const`. By calling `getHalf` like this, it will work as desired.

```ts
const halfWords = getHalf(["Apple", "Banana", "Cherry"] as const);
```

However, this can be cumbersome, and there is a risk of forgetting to use `as const`. Thus, starting from TypeScript 5.0, you can add `const` to generic type parameters. When you add `const`, `T` is inferred as a string literal type.

```ts
function getHalf<const T>(arr: T[]): T[] {
  return arr.slice(0, arr.length / 2);
}

const halfWords = getHalf(["Apple", "Banana", "Cherry"]); // ("Apple" | "Banana" | "Cherry")[]
```

This allows for stricter type inference of generic type parameters without using `as const`.

Note that this function only works when the type is inferred directly as a function argument. If the type has already been inferred beforehand, it does not narrow the type. For example, in this case, `words` is already inferred as `string[]`, so `T` is still inferred as `string`.

```ts
const words = ["Apple", "Banana", "Cherry"];

function getHalf<const T extends string>(arr: T[]): T[] {
  return arr.slice(0, arr.length / 2);
}

const halfWords = getHalf(words); // string[]
```

Initially, when this syntax was introduced, the inferred types were limited to `readonly` arrays/objects, causing issues when mutable types (like `Array<type>`) were passed as `T`.

However, it has been improved to infer types as constant types as long as allowed by type constraints. For related issues, you can refer to various resources.

You may find this syntax useful when you often need to pass arguments in `as const` form.

## NoInfer Utility Type

I occasionally look for additional information regarding `infer` since I have written about it before. While doing so, I stumbled upon something.

Starting from TypeScript 5.4, the `NoInfer` utility type was introduced. This type helps prevent type inference on the provided argument within a generic function. This feature allows for more precise control over type inference in generic functions.

In TypeScript, the type determination of a generic type usually relies on type inference. However, when a generic type parameter is used in multiple places, it can lead to multiple candidate types, causing unintended type inference.

Let's look at the following code. Assume we have a function that takes an array and one of its elements to perform some operations.

```ts
function foo<T extends string>(arr: T[], item: T) {
  // ...
}
```

What happens when we call this function like this?

```ts
foo(["Apple", "Banana", "Cherry"], "Grape");
```

To reflect our intent in the type, we want `T` to be inferred as `"Apple" | "Banana" | "Cherry"` and ensure that `item` checks whether it belongs to the `T` type. However, since `item` is also declared as `T`, it affects the type inference of `T`. Hence, in this case, `T` is inferred as `"Apple" | "Banana" | "Cherry" | "Grape"`, thereby not checking if `item` belongs to the array's type.

One way to make this work as intended is to declare another type parameter. For example:

```ts
function foo<T extends string, Item extends T>(arr: T[], item: Item) {
  // ...
}

/* Error: Argument of type '"Grape"' is not assignable to parameter of type '"Apple" | "Banana" | "Cherry"' */
foo(["Apple", "Banana", "Cherry"], "Grape");
```

This works correctly, but it feels somewhat awkward to declare an additional type parameter purely for the `Item` type.

In such cases, the `NoInfer` utility type can be employed. By wrapping the type in `NoInfer<>`, you instruct the TypeScript compiler not to perform type inference based on that type. Therefore, you can modify the `foo` function as follows:

```ts
function foo<T extends string>(arr: T[], item: NoInfer<T>) {
  // ...
}
```

Aside from preventing type inference based on that type, `NoInfer` has no other functions. Thus, in all other contexts, `T` and `NoInfer<T>` are treated the same. This type is processed at compile time, and unlike types like `Pick<T, K>`, the compiler does not grasp its principle.

## in, out Variance Parameters

While reading the book "Robustly Typed Flexible Variance," I came across the concept of variance. I've previously written articles about it. While looking for TypeScript support for variance features, I discovered this information.

In TypeScript, `in` is commonly used to narrow types by checking object properties (`if (x in obj) {}`). However, `in` is also used alongside the `out` keyword to specify the variance of generics.

Variance is the concept of how a generic type treats subtype relationships among given types. If the generic type preserves the subtype relationship, it is covariant; if it reverses it, it is contravariant; if both, it is bivariant; and if the subtype relationship is ignored, it is invariant.

For example, if `U` belongs to type `T`, then `Array<U>` naturally also belongs to type `Array<T>`. In this case, `Array` is covariant. However, if the type is a function parameter, `(x: T) => void` belongs to `(x: U) => void` because any function that can accept `T` can also accept `U`. Hence, function parameters are contravariant.

This interaction between subtypes and generics is known as variance. Since this article's core does not delve deeply into this topic, I've explained it briefly. For more details, refer to my previous article on variance.

TypeScript does not support strong type inheritance like Java; instead, it uses structural typing. Subtype relationships are determined structurally. This approach allows TypeScript to generally apply the principle that outputs are covariant, and inputs are contravariant regarding variance.

However, in complex cases such as circular types, there are rare instances when explicit variance specification may be needed. In such cases, you would use the `in` and `out` keywords.

`in` indicates that the type parameter is contravariant, while `out` indicates it is covariant. This is intuitive since input in function parameters should generally be contravariant, whereas output in return values should be covariant. If you use `in out`, it indicates that the type parameter is invariant.

However, such variance parameters should be used sparingly and only when you truly need to control structural variance. In most structural type comparisons, they have no effect. Using `in` does not necessarily treat a type as contravariant—this syntax can only be specified when the variance of a type parameter is ambiguous.

In very few cases where variance may be ambiguous, you might hope for a slight performance improvement by using these keywords. Also, except in a few cases, TypeScript's structural type variance works effectively, meaning there is rarely a need to use these keywords.

If you are curious about where variance becomes an issue, you can refer to the `bivarianceHack` used in React.

# Class Related Syntax

## Override

In Java, there is an `@Override` annotation that tells the compiler that the method overrides a method from the superclass. If a method with the `@Override` annotation is not defined in the superclass, a compile error occurs.

```java
class Animal {
    public void makeSound() {
        System.out.println("Animal sound");
    }
}

class Dog extends Animal {
    // A typo like makeAound will result in an error
    @Override
    public void makeSound() {
        System.out.println("Bark!");
    }
}
```

While learning Java, I found this feature very useful. I wondered if TypeScript had a similar feature, and indeed, starting from TypeScript 4.3, the `override` keyword is supported. The following TypeScript code offers the same functionality as the Java code, utilizing `override`.

```ts
class Animal {
  makeSound() {
    console.log("Animal sound");
  }
}

class Dog extends Animal {
  // If there is a typo in makeSound, a type error occurs thanks to the override keyword
  override makeSound() {
    console.log("Bark!");
  }
}
```

But what happens if you use the superclass method without the `override` keyword? You might write the `Dog` class like this:

```ts
class Dog extends Animal {
  makeSound() {
    console.log("Bark!");
  }
}
```

Essentially, this would not produce an error. However, this can cause issues during collaboration among multiple developers. A developer might inadvertently override a method written by someone else in a superclass without realizing it.

That’s why TypeScript provides the `noImplicitOverride` option in the tsconfig. When enabled, it causes an error if a method is overridden without the `override` keyword.

Yet, this feature does not seem to be widely utilized. It appears that when developing in TypeScript and its related languages, class inheritance is often not heavily used. Also, due to TypeScript's structural typing, it is generally more common to define separate interface types for classes and extend types through interface merging, rather than changing types via overriding. Additionally, unlike in other languages like Java, TypeScript does not support abstract methods, making this feature challenging to use effectively.

## Accessor

I discovered something interesting while searching through TS release notes. In TypeScript 4.9, the `accessor` keyword was added. This keyword is part of the ECMAScript Stage 3 Proposal on Decorators.

To use this feature, you declare a property like a normal class property and attach the `accessor` keyword. For example, it can be written as follows, taken directly from the release notes.

```ts
class Person {
    accessor name: string;
    constructor(name: string) {
        this.name = name;
    }
}
```

This creates a private property corresponding to `name`, along with automatically generated getter and setter methods. Therefore, the above code functions the same as this code:

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

But why is this syntactic sugar necessary? While it is true that `get` and `set` are often used together, they are primarily used when you want to add functionality to property access, such as logging or validating new property values.

Thus, one might find the `accessor` keyword, which merely defines property access with `get` and `set`, to be less useful. It doesn’t seem to greatly simplify things, and its functionality is limited.

However, this is not just about defining `get` and `set`, but rather a preliminary implementation as part of the Decorators Proposal. The proposal distinguishes between class properties and properties declared with `accessor`. For properties declared as `accessor`, decorators can accept the property value as an argument to introduce new functionality.

Since the total implementation of the Decorators Proposal is not complete and only the `accessor` part is implemented, it may appear to be unnecessary syntactic sugar. Therefore, the release notes may have been insufficiently described. If needed, you can refer to the related PR and the Decorators Proposal.

# Miscellaneous

## Asserts

I came across another point related to exception handling.

Many languages have functions that throw exceptions when unexpected situations arise. These are known as assertion functions. Node.js also has an `assert` function that throws exceptions if `value` is not 1.

```js
assert(value === 1);
```

However, JavaScript does not inherently support assertion functions, so they must be implemented manually. The above mentioned `assert` is a module provided by Node.js.

Assertion functions that are manually implemented often do not narrow types properly. For example:

```ts
function foo(str: unknown) {
  assert(typeof str === "string");
  // The following code will execute only if str is of type string
  // However, str is not narrowed to string type
  console.log(str.toLowerCase());
}
```

TypeScript cannot know if the `assert` function throws exceptions, leading to these results. To address this, TypeScript 3.7 introduced the `asserts` keyword, which tells the compiler that the assertion function guarantees a specific type. There are two ways to use this: stating conditions or specifying the type of certain variables like a type predicate.

First, let’s examine the condition specification method. By including the `asserts` keyword with the `condition`, it guarantees that everything passed to the `condition` parameter is true in later code scopes, allowing type narrowing.

You can use this for creating an `assert` function. The following code is taken from the internal code of Toss's es-toolkit library.

```ts
export function assert(condition: unknown, message: string | Error): asserts condition {
  if (condition) { return; }

  if (typeof message === 'string') { throw new Error(message); }

  throw message;
}
```

This `assert` function can then be used as follows. After calling `assert`, it is guaranteed that the `condition` is true in the rest of the scope, leading to successful type narrowing.

```ts
function foo(str: unknown) {
  assert(typeof str === "string", "str must be a string");
  // str is narrowed to string type
  console.log(str.toLowerCase());
}
```

Another way utilizes the `asserts` keyword to specify the type of properties or variables. This is similar to a type predicate. The following example guarantees that a variable will be of type string in the remaining scope.

```ts
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("value must be a string");
  }
}
```

After calling this function, `value` is guaranteed to be of type string. Hence, you can use it like this:

```ts
function foo(value: unknown) {
  assertIsString(value);
  // value is narrowed to string type
  console.log(value.toLowerCase());
}
```

You can also use generic utility types to control type narrowing with the `asserts` keyword more precisely. After calling `assertNotNil`, you can ensure that `value` is neither `null` nor `undefined`, meaning it is narrowed to `NonNullable<T>` type.

```ts
function assertNotNil<T>(value: T): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error("value must not be null or undefined");
  }
}
```

A small question may arise: what happens when we use a function that returns `never` for type inference? For example, one might think about writing it like this.

```ts
function assertIsString<T>(value: T): T extends string ? void : never
```

Currently, this does not narrow the type as expected in TypeScript. After calling the `assertIsString` function, the type of `value` should be guaranteed as string, but the compiler fails to do so. However, there was a similar proposal in the original PR for `asserts`.

As the maintainer mentioned, this was rejected because it would not be possible to definitively establish the type of `value` using only `T`. Some reasons include cases where the user explicitly specifies `T`, where multiple parameters can be type inference hints for `T`, and where `T` may be part of a different type. Given these considerations, using the `asserts` keyword for type narrowing is said to be more concise and useful. 

# References

TypeScript, Generics

https://www.typescriptlang.org/docs/handbook/2/generics.html

TypeScript 5.0 Release Notes, const Type Parameters

https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html

Typescript 5.0 and the new const modifier on type parameters

https://xebia.com/blog/typescript-5-0-and-the-new-const-modifier-on-type-parameters/

const modifier on type parameters, TypeScript #51865

https://github.com/microsoft/TypeScript/pull/51865

Only infer readonly tuples for const type parameters when constraints permit, TypeScript #55229

https://github.com/microsoft/TypeScript/pull/55229

const Generic type parameter not inferred as const when using conditional type

https://stackoverflow.com/questions/76995805/const-generic-type-parameter-not-inferred-as-const-when-using-conditional-type

TypeScript 5.4 Release Notes, The NoInfer Utility Type

https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-4.html#the-noinfer-utility-type

Total TypeScript, NoInfer: TypeScript 5.4's New Utility Type

https://www.totaltypescript.com/noinfer

Add NoInfer<T> intrinsic represented as special substitution type, TypeScript #56794

https://github.com/microsoft/TypeScript/pull/56794

Intrinsic string types, TypeScript #40580

https://github.com/microsoft/TypeScript/pull/40580

TypeScript, Generics

https://www.typescriptlang.org/docs/handbook/2/generics.html

[tsconfig's Everything] Compiler options / Type Checking

https://evan-moon.github.io/2021/08/08/tsconfig-compiler-options-type-check/

TypeScript 4.3 Release Notes, override and the --noImplicitOverride Flag

https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html#override-and-the---noimplicitoverride-flag

noImplicitOverride does not complain on abstract methods, TypeScript #44457

https://github.com/microsoft/TypeScript/issues/44457

TypeScript 4.9 Release Notes, Auto-Accessors in Classes

https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#auto-accessors-in-classes

Support for auto-accessor fields from the Stage 3 Decorators proposal, TypeScript #49705

https://github.com/microsoft/TypeScript/pull/49705

TypeScript 3.7 Release Notes, Assertion Functions

https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions

JavaScript Assertion

https://jcloud.pro/javascript-assertion

What does the TypeScript asserts operator do?

https://stackoverflow.com/questions/71624824/what-does-the-typescript-asserts-operator-do

Assertions in control flow analysis, TypeScript #32695

https://github.com/microsoft/TypeScript/pull/32695