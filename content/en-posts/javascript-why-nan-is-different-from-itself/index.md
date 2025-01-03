---
title: Exploring JavaScript - Why is NaN Different from Itself?
date: "2024-08-18T00:00:00Z"
description: "NaN is different from itself. The reason lies within computer science."
tags: ["javascript", "CS"]
---

![Thumbnail](./thumbnail.png)

# Summary

- `NaN` stands for "Not a Number," representing a special value of numeric type with the peculiar characteristic of being different from itself.
- This characteristic of NaN is defined in the IEEE 754 standard for floating-point arithmetic.
- The reason for this decision in IEEE 754 was the absence of a method to detect NaN at that time, necessitating a way to identify NaN.

# NaN

## Overview

`NaN` stands for "Not a Number," indicating a special value that denotes a value is not a number. In JavaScript, NaN is returned when, for instance, parsing a number fails or when an operation yields an invalid mathematical result.

```js
Math.sqrt(-1); // NaN
parseInt('hello'); // NaN
```

For more cases where NaN may occur, refer to the [official MDN documentation on NaN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN).

## Unique Characteristics

NaN possesses several unique characteristics, the most notable being that it is different from itself.

```js
const x = NaN;
x === NaN; // false
```

This property, where a value is different from itself, allows us to check if a value is NaN.

```js
function checkIsNaN(value) {
  return value !== value;
}
```

# Why is this the case?

The property of NaN is widely recognized, as stated in the official MDN documentation and on popular [JavaScript tutorial sites](https://ko.javascript.info/number). But how did NaN come to have this property?

## IEEE 754 Standard

This property is dictated by the IEEE 754 standard, which defines the bit representation of floating-point numbers. The way NaN behaves, being different from itself, is well defined in the [IEEE 754 documentation available online](https://iremi.univ-reunion.fr/IMG/pdf/ieee-754-2008.pdf).

In section 5.11 of IEEE 754-2008 titled "Details of comparison predicates," the following is stated:

> There are four mutually exclusive relationships possible: less than, equal, greater than, unordered. The last case occurs when at least one operand is NaN. NaN has no order with respect to any value, including itself.

Since all JavaScript numbers follow the IEEE 754 64-bit floating-point standard, they must adhere to this definition. Therefore, for all relational operators (`<`, `>`, `<=`, `>=`) in which NaN is an operand, the result is `false`. Additionally, NaN is not equal to any value, including itself, for all comparison operators (`==`, `===`, `!=`, `!==`). This explains why `NaN === NaN` evaluates to `false`.

Most JavaScript engines, however, internally optimize the distinction between floating-point numbers and integers. Nonetheless, officially, all JavaScript numbers are IEEE 754 floating-point numbers, thus NaN must follow the IEEE 754 definition of being different from itself.

## Reasons for the IEEE 754 Decision

The reason NaN is defined as not equal to itself in JavaScript is due to IEEE 754. But why did IEEE 754 define NaN this way?

One can refer to a response by [Stephen Canon, a IEEE 754 committee member on Stack Overflow](https://stackoverflow.com/a/1573715), and [Kahan's lecture notes on IEEE 754](https://faculty.cc.gatech.edu/~hyesoon/spr09/ieee754.pdf) for insights on this.

From these documents, two reasons emerge:

1. The result of `x == y` should ideally be the same as `x - y == 0`.
   
   This is mathematically correct; however, the IEEE 754 committee had to forgo some mathematical rules when defining the standard (for example, the associative property of addition), but they sought to maintain this one.

   It's not just for mathematical consistency; there were hardware optimization considerations, as it was a significant issue when the standard was being developed.

   `NaN - NaN == 0` results in `NaN == 0`, which is `false`, therefore according to this rule, `NaN == NaN` must be `false`. This was not the primary reason, as there were already other exceptions to this rule.

2. A method was needed to detect NaN without a definition of isNaN.

   > If there is no way to eliminate NaNs, it would be as useless as the indefinite values of CRAY (a processor series that existed at the time). Upon encountering NaN, it is preferable to halt computations rather than continue indefinitely to reach an uncertain result. Consequently, some computation with NaN must return a non-NaN result. Which operations would serve this purpose?
   > (Omitted)
   > The chosen exceptions are the syntax `x == x` and `x != x`. For all numbers `x`, these yield 1 and 0, respectively, but become the opposite when x is Not a Number (NaN). This provides a simple method to distinguish NaN from numbers even in languages lacking NaN and IsNaN(x) syntax.
   >
   > William Kahan, Lecture Notes on the Status of IEEE 754, Page 8

When NaN is used as an operand in mathematical operations, results yield NaN in all cases except `NaN ** 0` (in JavaScript). Thus, NaN proliferates through subsequent calculations. However, stopping calculations upon detection of NaN is deemed more efficient than allowing its propagation.

Therefore, there needed to be a construct or function by which, when operating on NaN, a non-NaN result was produced, allowing detection of NaN in the calculation process.

At the time, the mathematical model in the design of the Intel 8087 processor, which underpinned IEEE 754, lacked a method to detect NaN with `isNaN`. Though `isNaN` could have been included in the standard, doing so would have delayed the implementation across all languages and processors.

Thus, the IEEE 754 committee required a method to detect NaN irrespective of whether programming languages supported `isNaN`.

The solution adopted was `x == x` and `x != x`. Generally, all values are equal to themselves, thus `x == x` is true, and `x != x` is false. However, NaN is uniquely defined where `x == x` is false, and `x != x` is true, enabling the detection of NaN.

While it would have ideally been better to include `isNaN` in the standard, they determined that it would take too long to realize its practical application.

# Additional Information

## NaN's Unique Characteristics

NaN has several unique traits. Extracting only the parts relating to operational characteristics from the official MDN documentation, we find the following:

- When NaN is an operand in mathematical operations (except bitwise operations), the result is typically NaN (excluding `NaN ** 0`).
- When NaN is an operand in relational operators (`<`, `>`, `<=`, `>=`), the result is always `false`.
- NaN is unequal to all values, including itself, with all comparison operators (`==`, `===`, `!=`, `!==`).

According to the third characteristic, `NaN === NaN` equals `false`. Thus, NaN is the only value in JavaScript that is different from itself.

The first characteristic ensures that NaN propagates without causing errors. This reflects NaN's original role of propagating to avoid immediate errors when an invalid computation is detected. While seldom used today, the original standard included provisions for setting an INVALID OPERATION flag when NaN first occurred in operations.

The second characteristic results from comparisons involving NaN always being unordered. For instance, in the case of `NaN < x`, since NaN cannot be less than anything, this holds true for any value. Hence, such comparisons consistently yield `false`.

## Ways to Check for NaN

In JavaScript, when performing calculations, checking if a value is NaN cannot be done using `x === NaN`. As seen earlier, NaN is different from itself.

```js
const x = NaN;
x === NaN; // false
```

Instead, `Number.isNaN` or `isNaN` should be utilized, noting that their behavior differs.

`isNaN` checks whether a given value is NaN after coercing it to a number. Thus, it can yield non-intuitive results for non-numeric values, returning `true` if they convert to NaN.

```js
isNaN(NaN); // true
isNaN("witch"); // true
isNaN(undefined); // true
isNaN({}); // true
```

In contrast, `Number.isNaN` checks if the given value is currently NaN, providing a more accurate outcome.

```js
Number.isNaN(NaN); // true
Number.isNaN("witch"); // false
Number.isNaN(undefined); // false
Number.isNaN({}); // false
```

Alternatively, as previously shown, the unique property of NaN can also be exploited using `x !== x` to check for NaN. Prior to ES2015, `Number.isNaN` was not available, hence this method was frequently employed.

```js
function checkIsNaN(value) {
  return value !== value;
}
```

## NaN's Bit Pattern

NaN is defined in IEEE 754 as having an exponent of `0x7ff` and a non-zero fraction. Generally, most languages represent NaN with a fraction where only the first bit is 1. Thus, using typed arrays, one could create NaNs with different bit patterns. The following is adapted from the MDN documentation.

```js
const float2bit = (x) => new Uint8Array(new Float64Array([x]).buffer);
const bit2float = (x) => new Float64Array(new Uint8Array(x).buffer)[0];

const nan1 = float2bit(NaN);

// Changing the first bit of the fraction alters the bit pattern but still results in NaN.
nan1[0] = 1;
const nan2 = bit2float(nan1);
console.log(nan2); // NaN
```

However, JavaScript uses a specific value for `NaN` (exponent `0x7ff`, fraction `0x8000000000000`). [There exists a technique called NaN boxing, which utilizes the available bit patterns to store different values.](https://witch.work/posts/javascript-trip-of-js-value-tagged-pointer-nan-boxing#4-nan-boxing-%EA%B0%9C%EC%9A%94)

# References

Axel Rauschmayer, Translated by Han Sun-yong, "Speaking JavaScript," Hanbit Media

IEEE Std 754-2008, "IEEE Standard for Floating-Point Arithmetic"

[William Kahan, "Lecture Notes on the Status of IEEE 754"](https://faculty.cc.gatech.edu/~hyesoon/spr09/ieee754.pdf)

MDN, "NaN"

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN

Why is NaN not equal to NaN?

https://stackoverflow.com/questions/10034149/why-is-nan-not-equal-to-nan

What is the rationale for all comparisons returning false for IEEE754 NaN values?

https://stackoverflow.com/questions/1565164/what-is-the-rationale-for-all-comparisons-returning-false-for-ieee754-nan-values

The stupid thing about IEEE NaN is that it's not equal to itself

https://news.ycombinator.com/item?id=9060796