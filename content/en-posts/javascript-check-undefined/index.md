---
title: Exploring JavaScript - Methods and Reasons for Determining Undefined
date: "2024-02-04T00:00:00Z"
description: "The determination of undefined involves more than simple comparison."
tags: ["javascript"]
---

# 1. Introduction

When using JavaScript, there are times when it is necessary to determine if a specific variable is `undefined`. This includes scenarios where one needs to check whether an argument specified in a function declaration has been passed or to verify the existence of certain keywords or methods for browser compatibility.

At these times, one can ascertain whether a variable is `undefined` simply by comparing it using the `===` operator. For instance, one might write code to check if the first argument in a function has been passed as follows:

```js
function foo(a) {
  if (a === undefined) {
    // Handling when argument a is not passed to the function
  }
  else {
    // Handling when argument a has been passed to the function
  }
}
```

In such cases, it is also possible to make the determination using `if (!a)`. However, to prevent `null` or empty strings from passing through the conditional statement, it is better to explicitly compare with `undefined`, which is a general point.

Yet, in older code, one can observe different methodologies. Examples include `typeof a === 'undefined'` or `a === void 0`.

For instance, prior to the release of ES5, the book "Effective JavaScript," published during the ES3 era, presents the following code that incorporates a procedure for checking undefined:

```js
function point(x, y){
  if(typeof x === 'undefined'){
    x = 320;
  }
  if(typeof y === 'undefined'){
    y = 240;
  }
  return {x: x, y: y};
}
```

What reasons were behind the use of such approaches?

This is because, until ES3, the global object property `undefined` was mutable. In other words, it was possible to override the name `undefined` with another value in the global scope. Since `undefined` was not a reserved word in JavaScript, this was feasible. Consequently, other comparison methods mentioned earlier were employed to avoid comparing against the overridden `undefined`.

Now, let's delve deeper into the implications of this statement by exploring the following topics:

- Why was using `=== undefined` insufficient?
- Previous methods for checking `undefined`
- The pros and cons of each method

# 2. Why was `=== undefined` insufficient?

Why were methods beyond simple comparison using the `===` operator employed to check if a variable is `undefined`? As previously discussed, this was necessitated because, until ES3, `undefined` was mutable in the global scope. This can be understood by comparing modern and historical specifications regarding `undefined`.

## 2.1. Current Specification of Undefined

First, let’s examine how the current specification defines `undefined`.

The [ECMAScript specification](https://tc39.es/ecma262/) states that `undefined` is used to represent a variable that has not been assigned a value.[^1]

> 4.4.13 undefined value
> 
> primitive value used when a variable has not been assigned a value

In the subsequent section, the `undefined` type is defined as a type that has exactly one value, `undefined`. This `undefined` type is also indicated in the ECMAScript specification.

> 6.1.1 The Undefined Type
> 
> The Undefined type has exactly one value, called undefined. Any variable that has not been assigned a value has the value undefined.

So where does the `undefined` value we use come from? It is a property of the global object.

```js
> Object.getOwnPropertyDescriptor(globalThis, 'undefined')
{
  value: undefined,
  writable: false,
  enumerable: false,
  configurable: false
}
```

The specification for properties of the global object defines `undefined` as a property with the value of `undefined`.

> 19.1 Value Properties of the Global Object
> 
> (Omitted)
> 
> 19.1.4 undefined
> 
> The value of undefined is undefined (see 6.1.1). This property has the attributes { [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: false }.

Thus, `undefined` is the sole value contained within the undefined type, and it can be accessed through the global object's `undefined` property. This property is defined with all descriptors `[[Writable]]`, `[[Enumerable]]`, and `[[Configurable]]` set to `false`. Therefore, it can be concluded that modification or deletion of the property, as well as modification of the descriptors, is not possible.

Consequently, since ES5, modification of the global property `undefined` is not possible. What was the situation prior to ES3?

## 2.2. The Era of Mutable Undefined

In the [ES3 specification](https://www-archive.mozilla.org/js/language/e262-3.pdf), the global object property `undefined` was defined as follows:

> 15.1.1 Value Properties of the Global Object 
> > (Omitted)
> > 
> 15.1.1.3 undefined
> 
> The initial value of undefined is undefined (section 8.1). This property has the attributes { DontEnum, DontDelete }.

At this time, a property attribute termed `[[ReadOnly]]` that corresponds to the modern `[[Writable]]` descriptor existed. However, it can be observed that `undefined` at that time did not possess this attribute, which means that `[[Enumerable]]` and `[[Configurable]]` were `false`, while `[[Writable]]` was `true`.

Thus, during that period, it was possible to override the global `undefined` property with another value.

```js
// This code was possible during the ES3 era
var undefined = 123;
console.log(undefined); // 123
console.log(undefined === 123); // true
```

Utilizing the name `undefined` in code would refer to the `undefined` value through the global property key, which could potentially return a different value if it had been assigned a different one.

In such cases, determining whether a specific value is `undefined` could lead to issues if a comparison like `a === undefined` were made, as `undefined` could potentially represent another value. Thus, various approaches such as using `typeof a` were employed to avoid this risk.

## 2.3. The Possibility of Undefined Being Overwritten

We noted that until ES3, it was possible to modify the global property `undefined`. But was this actually likely to happen?

If the occurrence of mistakenly overwriting `undefined` were highly improbable, then the alternative checking methods discussed would not have been necessary.

However, such accidental modifications are quite plausible[^2]. Let’s consider a function that assigns a value to a property of `this`.

```js
function assign(key, value) {
  this[key] = value;
}
```

But what happens if this function is called from the global scope? In this case, `this` would refer to the global object. If `key` is `undefined`, then a value would be assigned to the global `undefined` property.

Of course, a developer is unlikely to explicitly intend to pass `undefined`, as in `assign('undefined', 1)`.

However, there are numerous scenarios where an `undefined` value could accidentally be passed, such as when `obj['foo']` is used as the `key` argument, and `obj` lacks a `foo` property.

```js
var obj={
  name: 'foo',
}

assign('abc', 1); // window.abc === 1
assign(obj.foo, 'bar'); // window.undefined === 'bar'
```

In such cases, the modification of the global object property `undefined` could affect the entire codebase. Thus, reliance solely on the `===` operator for checking `undefined` proved insufficient. Now, let’s explore the methods that were utilized during that period.

Before ES6, even books from around 2014 highlighted `undefined`, `NaN`, and `Infinity` as not being reserved words. This is also evident from explanations that highlight the need to treat them as such, suggesting that the issue of overriding `undefined` was indeed significant.

# 3. Previous Methods

Preventing modification of the `undefined` property in the global scope only began from ES5. Therefore, before the wide adoption of ES5, various methods for checking `undefined` can be observed.

## 3.1. Using the typeof Operator

In examples where one needs to verify the existence of certain feature methods or properties in the current execution environment, comparisons to `undefined` often utilized this technique[^3].

```js
// From Javascript Patterns, 215p
if(typeof document.attachEvent !== 'undefined') {
  document.attachEvent('onclick', console.log);
}
```

Beyond the cited source, various other literature[^4] also employs the `typeof` method for checking undefined.

Moreover, various platforms—including jQuery’s contribution guide[^5]—recommend using `typeof` for checking global variables in their style guides.

![jQuery type-checking guide](./jquery-type-check.png)

`typeof` operates independently of the value held by the global object's `undefined` property, thereby enabling reliable determination of a value being `undefined`.

## 3.2. Using the void Operator

Comparisons using `void 0` or `void(0)` were also frequent methods. The `void` operator evaluates its operand and returns `undefined`, thus providing a way to obtain the `undefined` value for later use.

This can be observed in the source code of Babel. Below is a portion of code that processes constructors when transformed by Babel, which checks whether `self` is `undefined` using `void 0`.

```js
helpers.assertThisInitialized = helper("7.0.0-beta.0")`
  export default function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }
`;
```

Other Babel helper functions within the same file also employ comparisons to `void 0` for checking `undefined`.

Since `void 0` operates independently of the global `undefined` property and is an operator (and thus non-modifiable), it consistently provides a reliable means to obtain the `undefined` value.

## 3.3. Variable Shadowing[^7]

Until ES3, `undefined` could be overwritten globally. Nevertheless, this overridden `undefined` could also be shadowed in other scopes.

This characteristic gave rise to methods that involved overwriting `undefined` and checking upon it. Below is an example utilizing this method, where the parameter name for an immediately invoked function expression is purposely set to `undefined`, and the parameter is not passed, thereby shadowing the global `undefined` for comparison.

```js
// Code that was possible until ES3 with global variable overwriting
var undefined = 1;

function check(a){
  var result=(function(undefined){
    return a === undefined;
  })();

  return result;
}
```

Therefore, the `check` function returns `true` when `a` is actually `undefined`. It has been noted that this method can also be found in libraries like Backbone.js.[^8]

# 4. Pros and Cons of Each Method

From a contemporary perspective, checking `undefined` using a simple comparison with `===` is the most straightforward and intuitive method. However, the methods discussed earlier were established to overcome the issues associated with the mutable global object property `undefined` from the ES3 era. Therefore, we will discuss those historical methods.

## 4.1. Using typeof

One distinguishing aspect of the method utilizing `typeof` compared to other approaches is that it operates without error even when checking an undeclared variable. In contrast, other methods would trigger a ReferenceError during such checks.

```js
typeof undeclaredVariable === 'undefined'; // true
undeclaredVariable === undefined; // ReferenceError
undeclaredVariable === void 0; // ReferenceError
```

This behavior can be advantageous depending on the situation. For example, when engaging in feature detection to determine if a particular functionality exists in a browser, it may be the case that the variable name does not exist in the corresponding scope. In such cases, the evaluation using `typeof` would be suitable and more secure.

For instance, consider the following code that checks if the environment is CommonJS:

```js
if (typeof module !== 'undefined' && module.exports) {
  // CommonJS Environment
}
```

However, the reliance on `typeof` can lead to ambiguity in most cases. For instance, consider the following code. The conditional statement here cannot distinguish between `foo` being completely undeclared and `foo` being declared but yielding `undefined`.

```js
if (typeof foo === 'undefined') {
  // When this condition is true
}
```

If a typo leads to a conditional attempt checking an undeclared variable, identifying such a mistake might be quite difficult.

```js
if (typeof fooo === 'undefined') {
  // Misspelling 'foo' as 'fooo' leads to this condition being true.
}
```

There is also a small distinction regarding the peculiar object `document.all`. This object holds all elements of a page in an array and was primarily used in Internet Explorer; it remains for compatibility purposes.

Actual comparisons show that `document.all === undefined` returns `false`, but `typeof document.all === 'undefined'` returns `true`. This fact could be leveraged to deduce the presence of `document.all` when assessing compatibility with IE, though its significance has diminished in current contexts.

Additionally, the necessity of determining the operand’s type may lead to slightly decreased performance, but in general, most engines do not exhibit major differences.

## 4.2. Other Methods

The variable shadowing method tends to produce longer code with reduced readability. Moreover, since `undefined` could still be shadowed within function scopes, it wasn’t entirely safe. Thus, many drawbacks render it less favorable compared to other methods, and examples showcasing its use are quite rare.

Using `void 0` is arguably the safest and most explicit method for determining if a value is `undefined`. The operator `void` is immutable and will reliably yield `undefined`, making it a dependable choice.

Comparisons with `void 0` also clearly indicate "comparing the value with something else," though it might be somewhat less intuitive than directly using `undefined`. Hence, some developers opted to create functions like `isUndefined` to enhance clarity.

# 5. Additional Notes

## 5.1. `undefined` Is Still Shadowable

From ES5 onward, the global property `undefined` became immutable. However, this restriction only applies to the global scope. The name `undefined` remains non-reserved in other scopes, allowing the overwriting of `undefined` still to occur.

```js
// In function scope, it can be done like this
function foo() {
  var undefined = 123;
  console.log(undefined); // 123
}

foo();

// In block scope, it can also be achieved merely with curly braces
{
  let undefined = 123;
  console.log(undefined); // 123
}
```

[^1]: `null`, which is often grouped with `undefined`, is defined in the specification as a value representing the intentional absence of any object value.

[^2]: Comment by WebReflection on https://2ality.com/2013/04/check-undefined

[^3]: Stoyan Stefanov, "JavaScript Patterns," translated by Jin-ki Kim, Yoo-jin Byeon, Insight, 2011.

[^4]: Works by David Herman, "Effective JavaScript," and Axel Rauschmayer, "Speaking JavaScript," among others.

[^5]: jQuery Contribution Guide's Type Checks https://contribute.jquery.org/style-guide/js/#type-checks

[^6]: https://github.com/rubennorte/babel/blob/738060ebfa7ac133d7dd6a2590835acaa08f15f3/packages/babel-helpers/src/helpers.js#L645

[^7]: Axel Rauschmayer’s blog, author of "Speaking JavaScript" https://2ality.com/2013/04/check-undefined

[^8]: https://phuoc.ng/collection/this-vs-that/variable-undefined-vs-typeof-variable-undefined/

# References

variable === undefined vs. typeof variable === "undefined" https://stackoverflow.com/questions/4725603/variable-undefined-vs-typeof-variable-undefined

Checking for undefined: === versus typeof versus falsiness https://2ality.com/2013/04/check-undefined

The void operator in JavaScript https://2ality.com/2011/05/void-operator.html

MDN undefined https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/undefined

ECMAScript 3 Specification https://www-archive.mozilla.org/js/language/e262-3.pdf

How can I check for "undefined" in JavaScript? https://stackoverflow.com/questions/3390396/how-can-i-check-for-undefined-in-javascript

Detecting an undefined object property https://stackoverflow.com/questions/27509/detecting-an-undefined-object-property

What does "javascript:void(0)" mean? https://stackoverflow.com/questions/1291942/what-does-javascriptvoid0-mean

JavaScript `undefined` vs `void 0` https://stackoverflow.com/questions/5716976/javascript-undefined-vs-void-0