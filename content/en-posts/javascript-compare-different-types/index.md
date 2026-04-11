---
title: Exploring JavaScript - Comparison Operations in ECMA-262
date: "2023-08-03T04:00:00Z"
description: "How are comparisons made between different types?"
tags: ["javascript"]
---

I have been exploring JS comparison operators. It is well known that `==` converts values to numeric types when the types differ. Thus, the result of `'2'==2` is true. While it's not an operator used as frequently as `===`, the similarity in appearance between `2` and `"2"` makes this behavior quite acceptable.

However, it doesn’t end there. The result of `null==undefined` is true, which seems odd. Additionally, `document.all==undefined` also yields true. Why is that? It’s not immediately clear. Therefore, I decided to look at the specifications to understand how this equality comparison works.

The comparison operator `==` behaves like `===` in certain cases. Let’s first examine the `===` case.

# 1. `===` Case

It is established that `===` returns true only if both the type and value of two operands are the same. For example, `1===1` is true while `1==='1'` is false. So, what is the detailed behavior?

The operation of `===` is defined in the specifications as IsStrictlyEqual(x,y). This is a binary operation that determines whether the two operands are strictly equal. The operation proceeds as follows:

1. If the types of the two values are different, it returns false.
2. If x is a number, it calls Number::equals(x,y) and returns the result.
3. If x is not a number, it calls SameValueNonNumber(x,y) and returns the result.

So, what are Number::equals and SameValueNonNumber?

## 1.1. Number::equals

Number::equals(x,y) is defined in the specifications as follows:

1. If either x or y is NaN, it returns false.
2. If x and y are the same number, it returns true.
3. If x is -0 and y is +0, it returns true.
4. If x is +0 and y is -0, it returns true.
5. In all other cases, it returns false.

## 1.2. SameValueNonNumber

SameValueNonNumber(x,y) takes non-numeric values x and y and returns a boolean. The specific behavior is defined as follows:

The types of x and y must be the same for proper functioning. Thus, if x is null, y must also be null; if x is undefined, y must also be undefined. Thus, item 3 handles cases where `null===null` and `undefined===undefined` are true.

1. Assert whether the types of x and y are the same. Since this comes through `===`, type equivalence is guaranteed.
2. If x is BigInt, it calls BigInt::equal(x,y) and returns the result. BigInt::equal simply compares BigInt values.
3. If x is undefined or null, it returns true.  
4. If x is a string, it compares the strings and returns true if they are equal, false otherwise. "Equal" means having the same length and composed of the same characters in order.
5. If x is a boolean, it compares the booleans and returns true if they are equal, false otherwise.
6. If x is a symbol, it compares the symbols and returns true if they are equal, false otherwise.
7. If x and y reference the same object, it returns true; otherwise, it returns false.

In summary, the operations proceed only if x and y are of the same type; if x is a BigInt, it invokes BigInt::equal; for primitive types other than objects, it compares values; and for objects, references are compared.

## 1.3. Summary

Thus, summarizing the operation of `===` so far, we have:

![isStrictlyEqual algorithm](./isStrictlyEqual-map.png)

# 2. `==` Case

The initial inquiry was why `null==undefined` evaluates to true. However, upon searching, there was no further explanation apart from the specification defining it as such. Therefore, I looked into the specifications.

This is defined in the specifications as `IsLooselyEqual(x,y)`, which takes x and y and returns a boolean value or throws a completion. This is referred to as normal completion, which may be explored further later on… [For those curious, there are several articles on Medium and similar platforms.](https://medium.com/geekculture/understanding-javascript-what-is-the-completion-record-2334a58c35c)

The specifications state:

![isLooselyEqual](./isLooselyEqual-ecma.png)

## 2.1. When Types are the Same

In this case, `IsLooselyEqual(x,y)` acts the same way as `===`, calling `IsStrictlyEqual(x,y)`.

## 2.2. Null and Undefined

If x is null and y is undefined, it returns true. The reverse is also true. There is no rationale provided; it simply is.

## 2.3. isHTMLDDA

If x is an object with the internal slot `[[isHTMLDDA]]` and y is null or undefined, it returns true. The reverse case also applies.

Note that this `[[isHTMLDDA]]` internal slot only exists in host-defined (non-native) objects. Objects with this slot are treated like undefined in operations like ToBoolean and IsLooselyEqual. Document.all falls under this category.

Therefore, `document.all == undefined` indeed returns true.

## 2.4. Strings and Numbers

If x is a string and y is a number, or vice versa, the values are compared after converting strings to numbers. 

More specifically, for instance, if x is a number and y is a string, `IsLooselyEqual(x,ToNumber(y))` is called, and the reverse case applies as well.

## 2.5. BigInt and Strings

If x is a string and y is a BigInt, it performs `StringToBigInt(x)` on x before comparing it to y. If `StringToBigInt(x)` results in undefined, it returns false. Otherwise, it calls `IsLooselyEqual(StringToBigInt(x),y)`.

The reverse also holds if x is a BigInt and y is a string.

## 2.6. One is Boolean

If one of the values is a boolean, it applies `ToNumber()` to that value before comparing it with the other. For example, if x is a boolean, it calls `IsLooselyEqual(ToNumber(x),y)`.

This is why `1==true` evaluates to true.

## 2.7. One is an Object

If one of the objects being compared is an object and the other is one of the types string, number, BigInt, or symbol, the object is converted to a primitive value using `ToPrimitive` before comparison. The hint for `ToPrimitive` is `default`, meaning the result is one of string, number, or symbol.

For more information on `ToPrimitive` operations, refer to [the well-documented MDN entry on the Symbol.toPrimitive](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive).

While this may not provide significant practical help, it can also result in peculiar outcomes such as:

```js
const temp={
  [Symbol.toPrimitive](hint){
    return "witch"
  }
}

console.log(temp=="witch"); // true
```

## 2.8. BigInt and Number

If one of the subjects being compared is a number and the other is a BigInt, and if either is Infinity, it returns false. This is because Infinity, by definition, must always be larger than any number.

In other cases, it compares the mathematical values.

**In all other cases, `isLooselyEqual` returns false.**

# References

[ECMA262 Specification on Comparison Operators](https://262.ecma-international.org/5.1/#sec-11.8.5)

https://tc39.es/ecma262/#sec-abstract-operations

https://tc39.es/ecma262/#sec-samevaluenonnumber

https://developer.mozilla.org/ko/docs/Glossary/Falsy

https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot