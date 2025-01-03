---
title: Exploring TS - The never Type in TS
date: "2023-10-14T00:00:00Z"
description: "Why does TS's never type exist and where is it used?"
tags: ["typescript"]
---

# 1. The never Type in TS

The never type in TS cannot be assigned any value and functions as an empty set. For example, in a union type where all types are excluded, it becomes the never type.

```ts
function foo(param: string | number) {
    if (typeof param === 'string') {
        console.log("It's a string.");
    }
    else if (typeof param === 'number') {
        console.log("It's a number.");
    }
    else {
        // At this point, param is of type never
        param;
    }
}
```

It is also used as the return type for functions that throw errors or enter infinite loops. However, when such a function is declared as a function declaration, its return type is void, while if declared as a function expression, the return type becomes never.

```ts
const errorFunc = () => {
    throw new Error("Test error");
}

const infFunc = () => {
    while (true) {}
}

// foo1 and foo2 are of type never
const foo1 = errorFunc();
const foo2 = infFunc();
```

Therefore, it is advisable to explicitly declare the return type as never for a function that throws an error when declared as a function declaration.

```ts
function errorFunc(): never {
    throw new Error("Test error");
}
```

Additionally, when the `noImplicitAny` check is disabled in tsconfig (or set to false), an empty array is inferred as type `never[]`.

So why does this type exist and where is it utilized?

# 2. The Reason for the Existence of the never Type

Types categorize the values that can exist in a program based on their capabilities. For instance, the integer type can be used for arithmetic operations, while the string type can utilize string manipulation methods. This can be thought of as a kind of set; a type is a collection of values with certain capabilities.

When dealing with types, we classify which set each value belongs to. According to TypeScript, values like `'ab'` belong to the string type set, and values like `1` belong to the number type set. The never type set contains nothing.

Why does such a type exist? Consider the following function. It outputs a message and immediately throws an error to terminate the program. What should the return type of this function be? I will denote it as `???`.

```ts
function throwError(msg: string): ??? {
  console.log(msg);
  throw new Error(msg);
}
```

If we think about using this function elsewhere, it can be viewed as follows.

```ts
function divide(x: number, y: number): ??? {
  if (y === 0) {
    throwError("Cannot divide by 0.");
  }
  return x / y;
}
```

In this case, if `y` is 0, there is no return from the `divide` function, as it terminates due to the error. If not, the calculation completes and returns `x / y`. Thus, the return type of `divide` is number.

It seems reasonable for the return type of `throwError` to also be number. After all, `throwError` does not complete properly and exits, while `divide` returns a number, so `throwError`'s return type should be number as well.

However, this creates problems when `throwError` is used within another function with a different return type. For example:

```ts
function concat(x: string, y: string): string {
  if (x.length + y.length > 10) {
    throwError("The string is too long!");
  }
  return x + y;
}
```

In this case, the return type of `concat` should be the return type of `throwError`, which is number, but this differs from the string return type of `concat` when there is no error. Therefore, making the return type of `throwError` number is not ideal.

The core issue is that the return type of `throwError` will never be used, as calling `throwError` leads to an error terminating the program. Therefore, in fact, the return type of `throwError` can be anything. It just has to pass type checking.

This is where the never type comes in. It can be used anywhere, but indicates that a function returning this type cannot complete, signifying a type that will never be employed.

The most appropriate representation in terms of sets would be a type defined as an empty set. It can be a subtype of all types and any declaration regarding it results in vacuous truth.

Thus, the return type of `throwError` becomes never.

```ts
function throwError(msg: string): never {
  console.log(msg);
  throw new Error(msg);
}
```

Likewise, the return type for a function that enters an infinite loop also becomes never, as this function will never return.

```ts
function infLoop(): never {
  while (true) {}
}
```

For reference, the behavior of never is quite similar to that of an empty set; any union with it yields no meaningful result, and any intersection with any value also infers to never.

# 3. Uses of never

## 3.1. Disallow Structural Typing

Assume an object may only possess property `a` or property `b`. The type can be defined as follows.

```ts
type AorB = {
    a: string;
} | {
    b: number;
}
```

However, this type allows for structural typing. For instance, the following object satisfies the above type, as it possesses both properties a and b.

```ts
const obj: AorB = {
    a: "hello",
    b: 3,
}
```

If we want to ensure that an object can only have one of properties a or b, we can use never. By defining `AorB` as follows, the previous object will fail type checking.

```ts
type AorB = {
    a: string;
    b?: never;
} | {
    a?: never;
    b: number;
}
```

## 3.2. Indicate Inaccessibility of Conditional Statements

When using `infer` to create a variable for other types within a conditional type, you must address all branches generated by the conditional type. However, there may be cases where you need to add an inaccessible type. This is where never can be applied.

For example, to obtain the parameter type of a function, the following code is used. `never` is employed when `P` cannot be inferred.

```ts
type Param<T> = T extends (...args: infer P) => any ? P : never;
```

## 3.3. Member Filtering

While filtering something, the distribution law and never type can be utilized.

By employing the union distribution law, unions can be filtered. In this case, the unwanted type is set to never, allowing only the types that meet specific criteria to remain in the union.

Consider the following utility type that extracts types from a union type where `name` is of type string.

```ts
type FilterName<T> = T extends { name: string } ? T : never;

type Person = {
    name: string;
    age: number;
}

type Dog = {
    name: string;
    bark: () => string;
}

type Account = {
    balance: number;
    interest: number;
}

// Person | Dog
type Foo = FilterName<Person | Dog | Account>;
/*
type Foo = FilterName<Person> | FilterName<Dog> | FilterName<Account>;
-> Foo = Person | Dog | never;
-> Foo = Person | Dog;
*/
```

In filtering, the never type is used for properties that do not pass the filter, thereby excluding them from the union.

Moreover, this can be further developed to filter the keys of an object type. The following example extracts only the keys of type `ValueType` from the `Obj` type.

```ts
type Filter<Obj extends Object, ValueType> = {
  [Key in keyof Obj as ValueType extends Obj[Key] ? Key : never]: Obj[Key]
}
```

# References

Hong Jae-min, 'Type in Programming Languages' Chapter 2.2 Set-Theoretic Types - Minimal Types https://blog.hjaem.info/18

Understanding the TypeScript never Type in Detail https://yceffort.kr/2022/03/understanding-typescript-never