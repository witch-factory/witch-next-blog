---
title: The Practical Use of the TS infer Keyword
date: "2023-09-30T00:00:00Z"
description: "Utilization of the TS infer Keyword"
tags: ["typescript"]
---

# 1. What is the infer Keyword?

## 1.1. Introduction

TypeScript provides several utility types. Commonly used ones include `Record<Keys, Type>` and `Omit<Type, Keys>`.

Among these is a utility type called `ReturnType<Type>`, which extracts the return type of a function. This utility type is specifically for extracting the return type of a function.

For clarity, let's refer to an example from the [TS Handbook](https://www.typescriptlang.org/docs/handbook/utility-types.html).

```ts
// type T0 = string
type T0 = ReturnType<() => string>;

// type T1 = number
type T1 = ReturnType<(s: string) => number>;

// type T2 = unknown
type T2 = ReturnType<<T>() => T>;
```

How does this magical utility type work? It operates using the `infer` keyword. The actual definition of `ReturnType` is as follows:

```ts
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
```

Breaking down this complex declaration, `T` is a function type and the return type is annotated with the `infer` keyword. This indicates that `R` is a type variable that will be assigned the inferred return type of `T`. Consequently, `R` becomes the return type of `ReturnType`.

Through this process, `ReturnType` becomes a utility type that infers the return type of a function and returns it.

## 1.2. Usage

The `infer` keyword must be used in conjunction with conditional types. Using it on its own would result in the following error message:

```
'infer' declarations are only permitted in the 'extends' clause of a conditional type.
```

In conditional types, you can use the `infer` keyword and type variables in places where you want TypeScript to perform inference.

> Such inferred type variables may be referenced in the true branch of the conditional type.
>
> TS Official Documentation, Conditional Types section

Type variables inferred with `infer` can only be used in the true branch of conditional types. Attempting to use them in the false branch will result in an error.

This is logical upon consideration. If type inference is possible via `infer`, it leads to the true branch; if not, it leads to the false branch. Consequently, it is necessary to use the type variables created through `infer` only in the true branch where type inference can be established.

```ts
// Works correctly.
type Element<T> = T extends (infer U)[] ? U : T;
// Cannot find name 'U'
type Element<T> = T extends (infer U)[] ? T : U;
```

In other cases, simply create the part you wish to infer using `infer`.

```ts
// Getting array element type
type Elem<T> = T extends (infer U)[] ? U : T;

type A = Elem<string[]>; // string

// Getting function parameter type
type Param<T> = T extends (...args: infer P) => any ? P : never;

type B = Param<(a: string, b: number) => void>; // [string, number]
```

## 1.3. Multiple infer

You can use multiple `infer` statements with a single type variable.

```ts
// Infers parameter type and return type and returns them in a tuple.
type ParamAndReturn<T> = T extends (...args: infer P) => infer R ? [P, R] : never;
```

On the other hand, the same `infer` type variable can be used in multiple places. By default, type variables with the same name will be unioned. However, contravariance, such as with parameters, will result in intersections. This will be addressed in future discussions regarding covariance.

```ts
// The types of a and b are combined and returned.
type InferUnion<T> = T extends { a: infer U; b: infer U } ? U : never;
// The intersection of the types of a and b is returned, as parameters exhibit contravariance.
type InferIntersection<T> = T extends { a: (x: infer U) => void; b: (y: infer U) => void } ? U : never;
```

Now let’s explore where `infer` can be utilized.

# 2. Function Argument Type Inference

Where can we use `infer`? As demonstrated with the type `Param<T>`, it enables us to obtain the argument types of a function. This is one of the simpler applications of `infer`.

## 2.1. Method for Function Argument Type Inference

Using `infer`, as shown above, we can infer the argument types of a function or specific argument types.

```ts
type GetArgumentType<T> = T extends (...args: infer U) => any ? U : never;

type GetFirstArgumentType<T> = T extends (arg: infer U, ...args: any) => any ? U : never;
```

## 2.2. Third-Party Library Function Argument Type Inference

This can be particularly useful when using third-party libraries that do not properly provide the argument types of their functions.

For example, consider a library function defined as follows:

```ts
function introduce(person: {
    name: string;
    age: number;
    hobbies: [string, string];
}) {
    return `${person.name} is ${person.age} years old and enjoys ${person.hobbies.join(" and ")}.`;
}
```

If the library does not provide a `Person` type for the `introduce` function's arguments, even with a properly structured object, type checking may fail.

```ts
const me = {
    name: "Kim Type",
    age: 26,
    hobbies: ["JS", "TS"],
}
// The type of me.hobbies is inferred as string[] and a type error occurs.
introduce(me);
```

In this case, we can resolve the issue by creating a utility type using `infer` to correctly declare the type of `me`.

```ts
type GetFirstArgumentType<T> = T extends (arg: infer U, ...args: any) => any ? U : never;

const me: GetFirstArgumentType<typeof introduce> = {
    name: "Kim Type",
    age: 26,
    hobbies: ["JS", "TS"],
}

introduce(me);
```

Although it is also possible to define a new `Person` type, understanding the entire code of the third-party library to create a new type can be challenging. In such cases, we can easily infer the function argument type using a type like `GetFirstArgumentType<T>` with `infer`.

This application of `infer` is not limited to argument types. It can also be used for constructor parameter types or instance types when third-party libraries fail to provide them correctly.

## 2.3. React Component Props Type Inference

This is also useful when a React-related library does not properly provide the props types for components.

```ts
type InferProps<T> = T extends React.ComponentType<infer P> ? P : never;

// Inferring the props type of LibComponent
type MyProps = InferProps<typeof LibComponent>;
```

In React, a more advanced utility type called `ComponentProps` is also provided. If `T` is a JSX element creator (i.e., a React component type), `ComponentProps<T>` infers the props type for the element. If it is not, it checks if it is an HTML intrinsic element (like `<div>` or `<button>`) and infers the props type accordingly.

If it is neither a JSX element creator nor an HTML intrinsic element, it returns a type that accepts all types except null or undefined, which is `{}`.

```ts
// @types/react/index.d.ts
type ComponentProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
    T extends JSXElementConstructor<infer P>
        ? P
        : T extends keyof JSX.IntrinsicElements
            ? JSX.IntrinsicElements[T]
            : {};
```

# 3. Recursive Type Inference

The `infer` keyword can be highly beneficial for advanced type operations, particularly in recursive types, as its characteristics allow for selective extraction from used types.

This recursive type feature is available in TypeScript version 4.1.0 and above.

Let’s explore this utility through several examples.

## 3.1. Example - Flattening Type

Consider the following code, which demonstrates typing for a function that flattens nested arrays. The recursive nature of the typing for `flatRecurisve` parallels the process of flattening the function itself.

```ts
// Represents the type of an array that has been flattened
type Flatten<T extends readonly unknown[]> = T extends unknown[] ? _Flatten<T>[] : readonly _Flatten<T>[];
// Auxiliary type to flatten T; returns T if it is not an array, otherwise returns the elements of the array.
// Essentially returns a union of all flattened elements of the array.
type _Flatten<T> = T extends readonly (infer U)[] ? _Flatten<U> : T;

// Function that returns the flattened type of T
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

Notably, the type `Flatten<T>` returns the type of an array that has been flattened. This is constructed using `_Flatten`, representing a recursive type. If `T` is an array type, it recursively flattens its elements represented by `U`, and returns `T` otherwise.

Using this, `_Flatten<T>` will generate a type that flattens the array type `T`. For example, `_Flatten<['apple', ['hi', 100], [[4, [true]]]]>` results in the union type `true | "hi" | 100 | 4 | "apple"` with all elements flattened.

## 3.2. Example - Promise Return Type

The `infer` keyword can also be used to infer the return type of a Promise.

```ts
type PromiseReturnType<T> = T extends Promise<infer Return> ? Return : T;

type t = PromiseReturnType<Promise<string>>; // string 
```

However, accurately inferring the return type of a Promise requires nested Promises to be handled properly as well. A utility type that does this efficiently is the existing `Awaited<T>`.

```ts
let promise = Promise.resolve([1, 2, 3]); // Promise<number[]>

type A = Awaited<typeof promise>; // number[]
```

Examining the definition of this `Awaited` type, as found in `lib.es5.d.ts`, reveals a recursive definition that unwraps the Promise type to return its result. As noted in the JSdoc, this mimics the behavior of `await`.

```ts
// lib.es5.d.ts
/**
 * Recursively unwraps the "awaited type" of a type. Non-promise "thenables" should resolve to `never`. This emulates the behavior of `await`.
 */
type Awaited<T> =
    // If T is null or undefined when `--strictNullChecks` mode is not enabled, it returns T
    T extends null | undefined ? T :
    // If T is an object with a callable then method, it unwraps the Promise using await. Otherwise returns T.
        T extends object & { then(onfulfilled: infer F, ...args: infer _): any } ?
        // F is the first parameter type of the then method. If callable, it recursively unwraps. This unwrapping serves to unwrap the awaited type of the thenable's inner value.
            F extends ((value: infer V, ...args: infer _) => any) ?
                Awaited<V> : // recursively unwrap the value
                // If the first parameter F of the then method is not a callable function
                // thenable is mishandled, thus return never
                never : 
        T; // T is non-object or non-thenable
```

## 3.3. Example - Path Validation Type

As a final illustrative use of `infer`, let’s consider a more complex recursive type example found in a Reddit thread that shows how to safely access values along nested paths in objects.

This type allows for receiving an object and a string path (delimited by `.`) and safely returns the values along that path, producing a `never` type if the specified path does not exist within the object type `T`.

As a result, using the `get` function allows for safe access to specific paths within an object.

For a more detailed explanation of its functionalities, refer to the [playground link](https://www.typescriptlang.org/play?#code/PQKhCgAIUgZBJAQgJQILIJpRMc5jCQCiAHgC4BOAhgMZkDOkZAFgKaQAmA9mQLQB2PKmQCWXfpAAOw5pABuVADYBXdmQCek1uA1bIABRkA1JaoA8AFQA0kANKRW5Vvw6N6lEfwDmAPkgBeKEhggkgAMS4KJjZIClYAWypPDlYorgAzaPYacQ4RUXElJk1WGwB3VgByOXYqenoRL35WDkgqSHplACN3Ck8vJi5IZC4eYGRWd0hlBu9IAANPdNT5gDogkMILZhFGGioJFmdILtr+JXUALxaT9SzIHPjJEUVU1cgAdXzmLmUyaN25XYZV+ig4-Eq-1ObS6r0GDnI1DowAUihEHGEahiAGtWOp6OtgsF7I4yM5XAsACQAbyWqWGozIAF9VjS6VEJu4mfNIAB+DZEzaQeCZEY8SC7NqQXF3YQAxivGqKSAZe5cLoAK1YdBseQGnjIQyOkGa5EgitYineIpNPBsjnysW1ygoDXEkDK3wWzRqFHmAsFYv+pPJjBlqosfIMxlMrEsAG0gwBdGycsh+ABcJtYvoFoS6dWyhazADkhtwGBLDjFev0JU9FOo6-lKox2obJOac5bpXj3nnCIKh8EAMJsGjYiWZFuMG0zqUylXV9jqrV0NouJhUXH3VGqYKRByKejsefKFysdKeFqEolZgAUJKcLjDeIjUYs8dsScgWfPKSvZoOAASjwUIbWNaQWAlRhUXRGw4jIF1lykGQdBKSATDRDEyQ4QwWEsKwnzJF8Og8bw-H8aMWCw8xrFsPwQ1In16V5bNfV-OwAG4wLAbBIFQGgaEmNsJFXbV-jkER2grAQhAKCRa28bBcHSc86DECQvFYMhLAREiKXEnU7H00MyL6Cj72cUQNCzaxUJYLMsPRTE8JkQiGOArN8OYWi43ovxqQFRDkIc5hVnoSQ0TIe8ACJVli4DVjiDhlGE+971oGgswOdQbGxYCAj8LL42xFMHH4Gz1GAnimV4-iAFUAGUiGQXhYFQEsABEBP0fQEBHVALHgAB5Et+P4wRRGE6I5WNGZ6WYOoIX+ADr1aXLij0A5WklOJGzrd1dFPfhljifhhMJGAy2aFVMmNdIuEURQuE9OYQWUMETnYSQuHqERYWBb5fn+RZTpWK7cDAwgJhoF03QkSQKC4YT6mo3zYzMalHq4LNqROKgKCzfhlHiU4KCZJkbFinHYp8fBCCaslOwARjsgJIGx0Y8YLImTVJ8nKZsewqJp0Z4sgMtOB4RhPAWWx5hseghnobERE7Q0CZPB5iwZ4d9YNw2jeHHNTExLN5mIszw0ySM2M-b9OP-S91p5ModhoWQQoofhGHmfHeeJgX6W5Bm9ecnCWh8rGcYzAPCYzEmyZDqnIDFrg6Y5-3A-55OKZ5bhJhW0zN3mFi-SVoZvYkeZ09i+YeJyX3JNjFnQB5hPc8F6BgCo7SYvx2POYJvmWcgJlx+p2mauh4ZnVdTSpGR1HGB8vyY+54ec6T8nx9T9PVl5w+qEuOmMz1pnWFZ9mqMHzf475neU+FjmD6PgtT5sdkGXFUXaa-8GHJJj-FFu-E+sUbCfmTBzB+Qc87jwvszSAAAmG+W9O5PyiKnA2Is05gM-kOb+QZX68wgVWM6c8pigPATYQUUDGQ-iopgxBV9IAAGY0GYNocbIcuDYofzIQbQQ0tKxy0torDoRoYgdgeLkfIi90hJGPBuVoFQOhqw1kMAs2t9gnnPqEHhhijHGOCKbFQ5t5YlwpDbSAdtbFfh-H+C8gEWj+gMSYjxnjBT8PAdLIukIES7H+O6eYNjMESOVh6dg1dpjOPWusAg4clAuVwtHLmuN0GP2Dlg-eONj4UGPqfSiCxnYuI4AXLg-jgzPlaGXbsFdJESn+NXRgb9CaFPiuAJuUw9ysGQe3Up60cAc37veO+GTYGQDHhPXJox8kdJnnrWG8NF5IxRiJdG690l4xHnA3eQs055PwasFg-R6BnxYdfWxMDIBD0mZgveL8-5zOOac7w5yAEUOIc8jOnz6RphIe0j+JydjvLIfQngjDMl7JDpclBaD7nZMnobPhrzQVeA+YQwBP8QF4MJmQohwDAWXBBWcwRRIIVkChcw0Il9OwcOuUw7J3DjGopPqSsFLKsVfMZMSgl2KAWizeRiiBesvHiolUSMxygLHzGIUxaxb5bZRjXpjSl5U0yZnYisMVkq9UeJ8afPx9Bi4OimCEsJ2SIlDDUTEupvo1hh1CBHVyaS7m7K7s-Q5LygXsuFec4p9qVhWL9uXa1USnRIR9t6epPIdqQH7iqF0VYDI3FSMjApXTxA9NjGw9u5dhl9x0mM2598PXTORW0gpwL-WJS4pAUI2xJQfS+ktGo31jjtAoOeUQ8R2DpsPGo-YEhBBlB1mQT2bR-iPGeHCXtrB1hAA)를 참고해볼 수 있다.

```ts
// Type used to extract the value of the provided object T based on the string path K
type PathValue<T, K extends string> =
    // If K is a dot-separated string, separate into Root (before the dot) and Rest (after the dot)
    K extends `${infer Root}.${infer Rest}` ?
        // If Root is one of the keys in T, recursively infer the type; if not, return never to escape recursion
        Root extends keyof T ? PathValue<T[Root], Rest> : never
    // If K is no longer dot-separated, it refers to a top-level key, we attempt to retrieve its value from T
    : (K extends keyof T ? T[K] : undefined)

// This type checks if the path K is valid. If valid, it returns K; otherwise returns never
type ValidatedPath<T, K extends string> = PathValue<T, K> extends never ? never : K;

/**
 * Access an object via dot-notation string
 */
// Takes an object entity and a dot-separated path string, returning the value at that path.
// Based on the definition of PathValue, if the K path value doesn’t exist in T, its return type becomes never, causing an error.
function get<T extends object, K extends string>(entity: T, path: ValidatedPath<T, K>): PathValue<T, K> {
  // Splitting the path by dot to access the corresponding value in the entity object
    return path.split(".").reduce((acc: any, k) => acc[k], entity);
}
```

# 4. Conclusion

The `infer` type is not frequently encountered when working with TypeScript. If you find it used often, it may indicate something unusual in your code.

However, it is extremely useful when inferring function argument or return types, or during recursive type inference, especially when extracting specific parts from other types. Understanding these methods will be beneficial for future applications.

(Updated on 2023.10.20)

# 5. Converting Union To Intersection

Using `infer`, you can transform union types into intersection types. How does this work? First, observe that when the same named type variables are used in multiple places, they are combined into unions for covariant types. The properties of value in T are inferred as `U`, leading to unionization.

```ts
type InferUnion<T>=T extends {[key:string]:infer U}?U:never;

// 1 | 2 | 3 | 'a' | 'b'
type R = InferUnion<{a:1|2, b:2|3, c:1|'a'|'b'}>
```

On the other hand, function parameters have contravariance, leading to intersection when inferred. Therefore, all `U` inferred from function parameters return as intersections.

```ts
type InferIntersection<T>=T extends {[key:string]:(p:infer U)=>void}?U:never;

type Foo={
    a(p:1|2|3):void,
    b(p:2|3|4):void
}
// 2|3
type R2 = InferIntersection<Foo>;
```

To convert a union type into an intersection, we can apply generic distribution principles to transform each element of the union into a function parameter, which will then be intersected.

```ts
type UnionToIntersection<U> =
(U extends any ? (param: U) => void : never) extends (param: infer I) => void ? I : never;
```

When this is applied, if `U` is `U1 | U2 | ... | Un`, it will initially become `UnionToIntersection<U1> | ... | UnionToIntersection<Un>` due to generic distribution. Each of these will extend any, thus resulting in `((param: Ui) => void) extends (param: infer I) => void ? I : never`, thereby inferring `I` as `Ui`.

Since these `I` are function parameters, they will intersect, culminating in `UnionToIntersection<U>` resulting as `U1 & ... & Un`.

When used alongside booleans, be cautious as the boolean type gets interpreted as `true | false`. For example, `UnionToIntersection<boolean | true>` becomes `true & false & true`, resulting in `never`.

# References

- Jo Hyun-young's "TypeScript Textbook"
- Understanding infer in TypeScript https://blog.logrocket.com/understanding-infer-typescript/
- Infer keyword in TypeScript https://dev.to/0ro/infer-keyword-in-typescript-3nig
- TypeScript Infer keyword Explained https://javascript.plainenglish.io/typescript-infer-keyword-explained-76f4a7208cb0
- A Reddit thread on Typescript: "Can someone explain the purpose of the infer keyword?" https://www.reddit.com/r/typescript/comments/msr4vk/can_someone_explain_the_purpose_of_infer_keyword/
- https://imygnam.tistory.com/114