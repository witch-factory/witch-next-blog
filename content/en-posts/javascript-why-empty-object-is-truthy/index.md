---
title: Exploring JavaScript - Why Does JS Evaluate Empty Objects as True?
date: "2024-06-19T00:00:00Z"
description: "Why objects are always considered true in JS"
tags: ["javascript", "history"]
---

![Thumbnail](./thumbnail.png)

# 1. Introduction

When first encountering JavaScript and writing code, many developers expect that empty objects or arrays will be evaluated as false, leading to unintended results in their code. For example, when the response from an API comes as an object, one might write the following code to filter out empty responses:

```js
const response = await fetch('https://api.example.com');

if (response.data) {
  // Intended to execute only when the data object has properties
  // However, it will still execute if data is an empty object.
}
```

However, in JavaScript, objects are always evaluated as true in the context of a Boolean value.

[This is because only the following values are evaluated as false in JavaScript.](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) Of course, there may be exceptions in some platforms like the Opera browser.

- `null`
- `undefined`
- `false`
- `NaN`
- `0` (-0, 0n)
- `''` (empty string)
- `document.all`

All other values are evaluated as true. Therefore, objects are always true, including empty objects (`{}`), empty arrays (`[]`), and even the Boolean wrapper object for false (`new Boolean(false)`).

Why was this decision made? Wouldn't it be more intuitive for even an empty object or a Boolean wrapper for false to evaluate as false? Although JavaScript was developed rapidly, there are reasons for this behavior. Let's explore those reasons.

# 2. Why JavaScript Objects are Always True

This can be discussed from two perspectives.

First, we can approach it from a syntactical perspective. Why are JavaScript objects always evaluated as true? This is because the Boolean conversion in the ECMA-262 specification does not attempt to convert objects to primitive values, and this behavior cannot be altered.

We can also look at this from the perspective of language design. Why did JavaScript design the Boolean evaluation of objects in this way, making it unalterable for users? This decision was made to enhance the performance of the Boolean operators `&&` and `||`.

We will examine these two aspects in turn.

## 2.1. Definition from the Specification

In JavaScript, at locations where a Boolean is expected, such as in the condition of an `if` statement, the given value is first coerced to Boolean. [This is defined in the ECMA-262 specification as the `ToBoolean` abstract operation.](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toboolean)

> 7.1.2 ToBoolean(argument)
>
> The abstract operation ToBoolean takes argument argument (an ECMAScript language value) and returns a Boolean. It converts argument to a value of type Boolean. It performs the following steps when called:
> 
> 1. If argument is a Boolean, return argument.
> 2. If argument is one of **undefined, null, +0𝔽, -0𝔽, NaN, 0ℤ**, or the empty String, return **false**.
> 3. If argument is an Object and argument has an `[[IsHTMLDDA]]` internal slot, return **false**.
> 4. Return **true**.

It can be observed that all values except for certain ones are coerced to true. Furthermore, there are no coercion methods that users can redefine in this case. The Boolean conversion does not attempt to convert objects to primitive values.

> Note: Unlike other type conversions like string coercion or number coercion, boolean coercion does not attempt to convert objects to primitives.
>
> [MDN Web Docs - Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)

Therefore, according to this specification, all objects in JavaScript are evaluated as true. Of course, there is the exception of `document.all` mentioned earlier. However, this is a host-defined object that exists only in the browser and is quite exceptional.

## 2.2. Question

Upon reflection, it seems strange that JavaScript does not attempt to convert objects when coercing to Boolean and does not allow for the redefinition of this behavior, determining that "all values except for certain ones are coerced to true."

Isn't JavaScript a language renowned for implicit type conversion? When an object appears where a primitive value is expected, JavaScript typically attempts to coerce the object to a primitive value using methods like `Symbol.toPrimitive`.

For instance, the following JavaScript code presents an object where a string is expected. Thus, the object is converted to a string, resulting in `'[object Object]'` for the operation's outcome.

```js
const obj = {};
console.log(obj + " and some string"); // [object Object] and some string
```

Moreover, the behavior of converting an object to a primitive value can be redefined by the user through the object methods. When an object is placed where a number or string is expected, the well-known symbols `Symbol.toPrimitive`, or the object's `valueOf` and `toString` methods are called to coerce the object to a primitive value.

```js
const obj = {
  toString() {
    return "I'm a Witch";
  },
}

console.log("Hello, " + obj); // Hello, I'm a Witch
```

However, when an object is placed where a Boolean is expected, there is no attempt to convert the object to a primitive value. The Boolean conversion does not call any coercion methods and simply checks if the given value is one of the specified values, returning true or false accordingly.

Therefore, the specification dictates that objects are always coerced to true. This leads to another question: "Why was this established?"

Certainly, JavaScript was developed in haste, and there were indeed several design mistakes. However, there is a rationale behind this behavior.

## 2.3. Reason for Such Language Behavior

The reason Boolean coercion is defined in this manner and cannot be redefined is related to the performance of the Boolean operators `&&` and `||`.

[It is well-known that JavaScript's logical operators `||` and `&&` preserve the operand values, unlike in other languages.](https://javascript.info/logical-operators) For instance, in the expression `3 && {} && {a:1}`, rather than returning true or false, the expression returns the last evaluated object `{a:1}`.

This implies that to compute the result of the logical operation, the same object needs to be coerced to Boolean multiple times.

Consider the evaluation process in the following operator where `falsyValue` is multiple times coerced to Boolean.

```js
// When falsyValue is any value that evaluates to false, evaluate the following operation.
falsyValue && value1 && value2 && ... && valueN
// The evaluation process results in falsyValue being coerced to Boolean multiple times as follows:
-> Evaluating falsyValue && value1 returns falsyValue
-> Evaluating falsyValue && value2 returns falsyValue
...
-> Evaluating falsyValue && valueN returns falsyValue
```

For primitive values, repeatedly coercing the same value generally does not present issues. However, if Boolean coercion involved converting objects to primitive values via method calls, similar to number or string coercion, this alone could significantly increase performance costs.

Due to user-defined coercion methods, the cost of the method calls can vary greatly, especially considering they would occur repeatedly in Boolean chaining. Therefore, in ECMAScript 1, it was decided that when objects are coerced to Boolean, they would always evaluate to true, and this behavior could not be changed.

Of course, with modern syntax, one could create coercion methods and prevent user redefinitions, similar to how `writable` and `configurable` descriptors are set. However, in the time of ECMAScript 1, such syntax was not available (there were internal properties like `ReadOnly` and `DontDelete`, but they were not comprehensive), leading to this implementation approach.

# 3. Additional Information

## 3.1. Object to Primitive Value Coercion

As previously mentioned, when an object appears where a primitive value is expected, JavaScript typically attempts to coerce the object into a primitive value. This coercion is defined in the specification as the `ToPrimitive(input[, preferredType])` abstract operation.

Excluding error handling and other ancillary processes, the essential actions of `ToPrimitive` when an object is the input are as follows:

1. If the input object has the well-known symbol `Symbol.toPrimitive`, invoke it and return the value if it is a primitive.
2. If `preferredType` is `number`: call the `valueOf` and `toString` methods of `input` in order, returning the result if it is a primitive.
3. If `preferredType` is `string`: call the `toString` and `valueOf` methods of `input` in order, returning the result if it is a primitive.

The `Symbol.toPrimitive`, `valueOf`, and `toString` methods used here are all user-definable. This means that users can dictate the result of the object being converted to a primitive value.

```js
const user = {
  name: "Kim Seong-hyun",
  age: 25,

  [Symbol.toPrimitive](hint) {
    console.log(hint);
    return hint == "string" ? `name: "${this.name}"` : this.age;
  },
};

console.log(user);
console.log(Number(user)); // number, prints 25
console.log(String(user)); // string, prints name: "김성현"
```

Users can even redefine the object’s properties so that merely attempting to coerce the object changes its contents.

```js
const obj = {
  toString() {
    this.b = "witch";
    return "ho";
  },
  cnt: 0,
  valueOf() {
    this.a = this.cnt++;
    return 123;
  }
};

String(obj); // "ho"
console.log(obj.b); // "witch"

console.log(obj + 1); // 124
console.log(obj.a); // 1
console.log(obj + 2); // 125
console.log(obj.a); // 2
```

This indicates that when converting an object to a primitive value, the associated costs can depend on the user's definitions. 

However, allowing user involvement in Boolean coercion as shown earlier could lead to significant performance waste in Boolean operator chaining. Thus, Boolean coercion was defined not to attempt conversions from object to primitive, and this behavior was made non-negotiable.

## 3.2. IsHTMLDDA

Notably, the `ToBoolean` specification mentions that objects with the `[[IsHTMLDDA]]` internal slot are evaluated as false. What does this mean? This is an internal slot that exists in a very small number of host objects, retained for web compatibility.

Details about this can be found in the specification's section on [B.3.6 The `[[IsHTMLDDA]]` Internal Slot](https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot). The translation for relevant content is as follows:

> The `[[IsHTMLDDA]]` internal slot can exist in objects defined by the host. Objects with the `[[IsHTMLDDA]]` internal slot behave like `undefined` when used as operands in the `ToBoolean`, `IsLooselyEqual` (note: referring to the `==` operator), and `typeof` abstract operations.
>
> **NOTE**: Objects with the `[[IsHTMLDDA]]` internal slot are never defined by this specification. However, the `document.all` object in web browsers is a host-defined exotic object that includes this slot for the sake of web compatibility. No other objects known to have this internal slot should be implemented in the engine aside from `document.all`.

I will write an additional article regarding the `[[IsHTMLDDA]]` internal slot and provide a link to it.

# References

Axel Rauschmayer, translated by Han Seon-yong, "Speaking JavaScript," Hanbit Media, pp. 171-172

MDN Web Docs - JavaScript data types and data structures

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures

MDN Web Docs - Falsy Values

https://developer.mozilla.org/en-US/docs/Glossary/Falsy

MDN Web Docs - Boolean

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean

MDN Web Docs - Type Coercion

https://developer.mozilla.org/en-US/docs/Glossary/Type_coercion

Why all objects are truthy in JavaScript

https://2ality.com/2013/08/objects-truthy.html

ECMA-262 7.1.1 ToPrimitive

https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toprimitive

ECMA-262 7.1.2 ToBoolean

https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toboolean

ECMA-262 B.3.6 The `[[IsHTMLDDA]]` Internal Slot

https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot

JS Exploration - Comparison Operations 2.3. isHTMLDDA

https://witch.work/posts/javascript-compare-different-types#23-ishtmldda

Why is document.all falsy?

https://stackoverflow.com/questions/10350142/why-is-document-all-falsy