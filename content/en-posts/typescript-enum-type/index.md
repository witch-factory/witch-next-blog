---
title: Exploring TS - TS's Enum Type
date: "2023-10-16T00:00:00Z"
description: "Understanding the enum type in TS"
tags: ["typescript"]
---

# 1. Basics of the Enum Type

## 1.1. Basic Type Declaration

The `enum` type does not exist in TS itself but is a value used within TS. It allows grouping multiple constants into a single type, similar to enums in other languages. This enables automatic mapping like Red as 0, Green as 1, and Blue as 2. Enums with actual numeric values are referred to as numeric enums.

```ts
enum Color {
  Red,
  Green,
  Blue,
}
```

String enums require that each member be initialized with a string literal or a member from another string enum. This provides the advantage of more clear and meaningful values during debugging.

```ts
enum Color {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE",
}
```

You can also directly map to other constants as enum values. In the case of numeric mapping, following members are automatically incremented by 1. For string mapping, subsequent members must be manually mapped.

```ts
enum Color {
  Red = 1,
  Green, // 2
  Blue, // 3
}

enum Direction {
  Up = "UP",
  Down = "DOWN",
  // If we suddenly only use Left here, automatic mapping will not occur after "DOWN," resulting in an error.
  Left = "LEFT",
  Right = "RIGHT",
}
```

However, even if string mapping is done beforehand, if numeric mapping is done afterward, members will be automatically numerically mapped until manual string mapping is applied again. Mixing strings and numbers in this way is referred to as heterogeneous enums and is generally discouraged unless there is a specific reason to do so.

```ts
// Example of a heterogeneous enum
enum Test {
  T1 = 1,
  T2, // 2
  T3 = "TEMP",
  T4 = 3,
  T5, // 4
}
```

## 1.2. Adding Computed Values

As will be discussed later, enums are ultimately JavaScript objects. Thus, not only constants but also computed values can be inserted.

```ts
enum Color {
  Red = getRed(),
  Green = getGreen(),
  Blue = getBlue(),
}
```

When are values treated as computed? Enum members are treated as computed values if they are not constants, where constants include the following:

1. Literals (characters, numbers)
2. References to other constant enum members
3. Constant expressions enclosed in parentheses
4. When a unary operator `+`, `-`, `~` is applied to a constant expression
5. When constant expressions are used as operands for binary operators `+`, `-`, `*`, `/`, `%`, `<<`, `>>`, `>>>`, `&`, `|`, `^`

Thus, if values are not of the types mentioned above, enum members are considered computed values and cannot be used in const enums that will be viewed later.

```ts
enum Example {
  // Constant members
  Foo = 1 + 2,
  Bar = Foo * 2,
  // Computed values
  Calc = '123'.length
}
```

## 1.3. Usage

The enum type can be used as a substitute for values, as shown below.

```ts
enum Color {
  Red,
  Green,
  Blue,
}

let c: Color = Color.Green;
```

Alternatively, it can be used for function arguments to enforce specific values. This way, only `Color` type values can be passed to `color` within the `changeColor` function.

```ts
function changeColor(color: Color) {
  console.log(color);
  // ...
}

changeColor(Color.Red);
```

You can access the actual names of enum members using the keys of `Color`. This is referred to as reverse mapping.

```ts
function changeColor(color: Color) {
  console.log(Color[color]);
  // ...
}
```

Overall, enums can be used when there's a need to restrict a value to a specific category.

One may wonder if similar functionality could be implemented using union types, as shown below.

```ts
type Color = "Red" | "Green" | "Blue";
```

So, what advantages does the enum type offer? In conclusion, there are no tremendous practical advantages, but let's first understand the principle of enums before moving on.

# 2. Functionality of Enum Types

Generally, type declarations and usages are not converted to JS code and disappear. However, enums are different. Declaring an enum will result in JS code output.

## 2.1. JS Conversion of Enum Types

```ts
enum Color {
  Red,
  Green,
  Blue,
}
```

This type declaration can be seen transformed into an IIFE as follows:

```js
"use strict";
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {}));
```

This essentially creates an object that maps `0` to `"Red"`, `1` to `"Green"`, and `2` to `"Blue"`.

```js
var Color = {
  0: "Red",
  1: "Green",
  2: "Blue",
  Red: 0,
  Green: 1,
  Blue: 2,
}
```

Since JS does not originally support enums, this tricky method is used to create an object that can be used at runtime in a similar way to an enum.

Is it possible to avoid creating such objects? Yes, by using `const enum`.

## 2.2. Const Enum

When using `const enum`, it does not convert to JS code and is simply treated as a value.

```ts
// When converted to JS, the const enum declaration is removed. Therefore, Red is simply replaced with 0.
const enum Color {
  Red,
  Green,
  Blue,
}
```

For numeric enums, reverse mapping to obtain the enum member through numbers is originally possible. However, with const enums, reverse mapping is not possible because const enums disappear at compile time.

# 3. Applications of Enum Types

## 3.1. Using as Union Types

Enums can be used as values, but are generally utilized as types. This can be illustrated as follows.

```ts
enum Color {
  Red,
  Green,
  Blue,
}

function changeColor(color: Color) {
  console.log(color);
  // ...
}
```

## 3.2. Utilization as Branding Properties

Enums can also act as branding properties. Branding properties are attributes used to differentiate between objects. Enum members can be used as branding properties.

```ts
enum Species {
    PERSON,
    DOG,
}

type Person = {
    type: Species.PERSON;
    name: string;
    age: number;
}

type Dog = {
    type: Species.DOG;
    name: string;
    age: number;
}

function act(param: Person | Dog) {
    if (param.type == Species.PERSON) {
        console.log("Hi");
    } else {
        console.log("Bark");
    }
}
```

It is crucial to note that the same enum members must be used to ensure differentiation. If `PERSON` and `DOG` are defined in different enums, they will both be treated as `0`, making them indistinguishable.

```ts
enum Species {
    PERSON,
}

enum Species2 {
    DOG,
}
```

Of course, if values are explicitly defined, they will be distinct.

When using `const enum`, it does not convert to JS code and is simply treated as a value.

```ts
// When converted to JS, there is no code. When used, PERSON becomes 0, and DOG becomes 1.
const enum Species {
    PERSON,
    DOG,
}
```

# References

TS Handbook - Enums https://www.typescriptlang.org/ko/docs/handbook/enums.html

TypeScript enums vs. types: Enhancing code readability https://blog.logrocket.com/typescript-enums-vs-types/#using-enums-reverse-mapping