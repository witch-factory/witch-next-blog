---
title: Exploring JavaScript - About the with Statement
date: "2024-07-03T01:00:00Z"
description: "What exactly is the with statement in JS that should never be used alongside eval?"
tags: ["javascript"]
---

![Thumbnail](./thumbnail.png)

When learning JavaScript, one often hears that `eval()` should never be used. However, there is another syntax that is also strongly discouraged, albeit less frequently mentioned: the `with` statement. Of course, it is a deprecated syntax and is prohibited in strict mode, rendering it practically obsolete. Nevertheless, it is a part of JavaScript history and is related to newer syntaxes such as `Symbol.unscopables`. Therefore, I will explore the `with` statement in two articles.

In this article, I will look at how the `with` statement emerged, how it is used, what its issues are, and how it can be replaced. The following article will discuss the problems caused by `with` and what followed afterward.

# 1. Emergence of the with Statement

When JavaScript 1.0 was created in 1996, its syntax was based on that of the C language. Constructs like `if`, `for`, `while`, `return`, and the use of braces were all influenced by C.

To access the properties of object data types, two additional syntaxes were introduced: one was the `for...in` loop influenced by AWK, and the other was the `with` statement.

Brandan Eich, who created JavaScript, was working at Netscape at the time, and the addition of the `with` statement was requested by the Netscape LiveWire team. It was intended to provide a more convenient way to access object properties.

# 2. Basic Concept

The basic form of the `with` statement is as follows:

```js
with (expression) {
  statement
}
```

The `with` statement adds the specified expression to the front of the scope chain during the evaluation of its internal statements.

## 2.1. Operation

When JavaScript searches for data corresponding to an identifier, it looks for that identifier in the scope chain unless it belongs to a specific object. However, when evaluating identifiers within a `with` statement, the prototype chain of the object provided to `with` is searched first.

This means that within the body of a `with` statement, all properties accessible from the `test` object can be used as if they were local variables. Before searching the scope chain to retrieve an identifier's data, it first looks for data in the object provided to `with`.

```js
// This can be used like so.
// Direct access to properties of the test object within the with statement.
var test = {
  firstName: "John",
  lastName: "Doe"
};
with(test) {
  console.log(firstName + " " + lastName);
  // John Doe
}
```

Using `in` indicates that properties in the prototype chain of the object provided to `with` can also be used like local variables.

```js
var parent = {
  myName: "witch"
};
var child = Object.create(parent);

with(child) {
  console.log(myName);
  // witch
}
```

When accessing methods of the object provided to `with`, they are called with `this` referring to that object.

```js
var obj = {
  toString: function() {
    return "It's witch's object";
  }
};

with(obj) {
  console.log(toString());
  // It's witch's object
}
```

## 2.2. Purpose

The `with` statement was originally created to avoid the hassle of accessing nested objects. For example, it can be used in this manner:

```js
foo.bar.baz.a = 1;
foo.bar.baz.b = 2;

// Using with
with (foo.bar.baz) {
  a = 1;
  b = 2;
}
```

## 2.3. Current Status

Currently, the strict mode that prohibits the use of the `with` statement has become almost standard practice. Thus, the `with` statement has largely fallen out of use. Although there was never a moment when the `with` statement was generally recommended after the very early days of JavaScript, certain tricks were possible.

It is well-known that `var` variable declarations have function scope. The following code is widely cited as an example demonstrating this fact.

```js
for (var i = 0; i < 10; i++) {
  setTimeout(function() {
    console.log(i);
  }, 10);
}
// 10 is printed 10 times.
```

As a result, block-scoped variables `let` and `const` were introduced in ES6. However, before ES6 became widely adopted, it was reportedly possible to mimic block scope using the `with` statement.

```js
for (var i = 0; i < 10; i++) {
  with({
    temp: i
  }) {
    setTimeout(function() {
      console.log(temp);
    }, 10);
  }
}
```

Naturally, this is not recommended. In practice, using the IIFE (Immediately Invoked Function Expression) pattern introduced later was more widely used and safer. Recently, the introduction of `Array.prototype.with()` and new array methods suggests that the `with` statement is unlikely to be used in the future.

# 3. Problems with the with Statement

> [I blame 'with'. So, ex-Borland people at Netscape. And so, ultimately, myself. - Brendan Eich](https://esdiscuss.org/topic/array-prototype-values-compatibility-hazard#content-7)

As is well known, the `with` statement is not recommended at all, and it raises an error in strict mode. Let's delve into why the `with` statement is problematic.

## 3.1. Readability

The `with` statement makes code difficult to read and unpredictable. Consider the following short code snippet from Douglas Crockford’s "JavaScript: The Good Parts":

```js
with (obj){
  a=b;
}
```

This behaves differently depending on which properties the `obj` object has. Breaking this down reveals this functionality:

```js
if (obj.a === undefined) {
  a = (obj.b === undefined) ? b : obj.b;
} else {
  obj.a = (obj.b === undefined) ? b : obj.b;
}
```

This is because both `a` and `b` may be properties of `obj`, making it very difficult to interpret correctly.

Moreover, this introduces challenges not only for human readers but also for optimizing compilers, leading to performance issues. Typical JavaScript scopes can be efficiently represented with an internal structure, and variable lookups can be performed quickly. However, when using `with`, the search for variables must traverse the object's prototype chain, resulting in decreased performance.

Code where the behavior varies based on the properties of the object provided to `with` can easily occur in function parameters as well.

```js
function logit(msg, obj) {
  with(obj) {
    console.log(msg);
  }
}

logit("hello", {
  msg: "my object"
}); // "my object"
logit("hello", {}); // "hello"
```

If the `obj` has a `msg` property, the `console.log` inside the `with` statement references `obj.msg` rather than the parameter `msg`. The `with` statement makes it difficult to determine what an identifier references beforehand; this can only be accurately understood during runtime.

## 3.2. Code Vulnerability

> [The `with` statement violates lexical scoping, making program analysis for security and related purposes difficult or impossible. - Brandan Eich](https://twitter.com/BrendanEich/status/68001466471817216)

The `with` statement can introduce vulnerabilities in code. Brendan Eich also cited the challenges of program analysis, rather than performance issues, as a reason for deprecating `with`. Axel Rauschmayer, in "Speaking JavaScript," presents the following example code:

```js
function foo(someArray) {
  var values=...;
  with (someArray) {
    values.someMethod(...);
    // subsequent code...
  }
}

foo(myArray);
```

Even without accessing `myArray`, it can disrupt function calls if a method is added to `Array.prototype`.

```js
Array.prototype.values = function() {
  // new code...
};
```

Now, the body of the `with` block inside the `foo` function will reference `someArray.values` instead of the previously defined `values`, causing the call to potentially invoke the user-defined `Array.prototype.values`. Thus, the `with` statement can introduce vulnerabilities in code.

This is not mere speculation; it has previously caused actual bugs in Firefox. This will be discussed further in the next article.

## 3.3. Inability to Minify Code

The `with` statement interferes with code minification tools. These tools optimize code by shortening variable names, and the presence of `with` prevents renaming variables, as it can only be determined at runtime whether a name refers to a variable or a property of the `with` target object.

If code cannot be minified, its size increases and performance suffers. Moreover, simply increasing the size of the code can be problematic, but declaring common variable names such as `values` inside a `with` statement can expose the code to further vulnerabilities. This can contribute to some of the issues that will be discussed in the next article.

# 4. Alternatives to the with Statement

So, what alternatives exist for the `with` statement, which is not recommended? Nowadays, as the `with` statement is rarely used, perhaps "alternatives" is not the most fitting term; however, the original purpose of the `with` statement can be performed in the following way.

When accessing properties of a complex nested object, it is advisable to use temporary variables:

```js
var b = foo.bar.baz;
b.a = 1;
b.b = 2;
```

If you dislike creating a temporary variable in the current scope, the IIFE pattern can be employed:

```js
(function() {
  var b = foo.bar.baz;
  b.a = 1;
  b.b = 2;
})();

// Alternatively, IIFE can be used with parameters
(function(b) {
  b.a = 1;
  b.b = 2;
})(foo.bar.baz);
```

IIFE can also be used to replicate block scoping previously imitated with `with`:

```js
for (var i = 0; i < 10; i++) {
  (function(temp) {
    setTimeout(function() {
      console.log(temp);
    }, 10);
  })(i);
}
```

# References

[Allen Wirfs-Brock, Brandan Eich, "JavaScript: the first 20 years"](https://dl.acm.org/doi/10.1145/3386327), pp. 11-12

Axel Rauschmayer, "Speaking JavaScript", translated by Han Sunyong, Hanbit Media, pp. 244-248

Douglas Crockford, translated by Kim Myoungshin, "JavaScript: The Good Parts", Hanbit Media

David Herman, translated by Kim Junki, "Effective JavaScript", Insight

TYPO3 compatibility regression in Nightly

https://bugzilla.mozilla.org/show_bug.cgi?id=883914#c13

DCU Bank fails to display any accounts on "Accounts" page in Nightly

https://bugzilla.mozilla.org/show_bug.cgi?id=881782

Array.prototype.values() compatibility hazard

https://esdiscuss.org/topic/array-prototype-values-compatibility-hazard

MDN Web docs, "with"

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/with

Are there legitimate uses for JavaScript's "with" statement?

https://stackoverflow.com/questions/61552/are-there-legitimate-uses-for-javascripts-with-statement

JavaScript’s with statement and why it’s deprecated

https://2ality.com/2011/06/with-statement.html