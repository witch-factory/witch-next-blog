---
title: Modern JavaScript Tutorial Part 1.6 Advanced Study of Functions - Second
date: "2023-01-28T00:00:00Z"
description: "ko.javascript.info part 1-6 second"
tags: ["javascript"]
---

This is the second article summarizing Modern JavaScript Part 1.6.

# 1. The Old `var`

In addition to `let` and `const`, variables can also be declared using `var`. This was the original method used in JavaScript.

In many cases, changing `let` to `var` operates similarly. However, there are some significant differences.

## 1.1. Scope

Unlike `let`, which divides scope based on blocks, `var` only has function scope and global scope. Therefore, blocks that are not function scope do not separate scope.

```js
if (1) {
  var a = 1;
  console.log(a);
}

console.log(a);
// Since the if block does not have function scope,
// var does not separate scope, so a is accessible here
```

Conversely, scope is divided based on functions.

```js
function foo() {
  var bar = 1;
}

foo();
console.log(bar); 
// Referencing bar outside the function will cause a ReferenceError
```

## 1.2. Variable Redeclaration

`var` allows for redeclaration within the same scope. However, if a variable has already been declared, redeclaring it with `var` assigns a value to the variable without allocating new memory.

```js
var a = 1; // At this point, a has already been declared
var a = 2;
var a = 3;
console.log(a); // Outputs 3
```

## 1.3. Usage Before Declaration

The declaration of `var` occurs at the beginning of the function, regardless of where it is declared within the function. Therefore, it can be used anywhere in the function body, even before encountering `var`. However, only the declaration is processed, and the assignment of values is not handled until the beginning of the script.

```js
function foo() {
  // The declaration of a has been processed, but its value is not assigned, so undefined is output.
  console.log(a);
  var a = 1;
}

foo();
```

If a value is assigned beforehand, that value will be processed.

```js
function foo() {
  a = 2;
  console.log(a); // 2
  var a = 1;
  console.log(a); // 1
}

foo();
```

Of course, it cannot be used outside the function.

```js
function foo() {
  var a = 1;
  console.log(a);
}
console.log(a); // Error
foo();
```

## 1.4. IIFE

IIFE stands for Immediately Invoked Function Expression, which refers to declaring a function and executing it immediately. This allows for using `var` as a block-level scope alternative.

An immediately invoked function expression is created by wrapping a function expression in parentheses.

```js
(function () {
  let msg = "Hello World";
  console.log(msg);
})();
// hello world
```

This can be used to mimic private members. This was a trick used when only `var` was available.

```js
var User = (function () {
    var name = "김성현";

    return function () {
        this.getName = function () {
            return name;
        }

        this.setName = function (newName) {
            name = newName;
        }
    }
})();

var user1 = new User();
console.log(user1.name); // undefined
console.log(user1.getName()); // 김성현
user1.name = "다른 이름";
console.log(user1.getName()); // 김성현
user1.setName("다른 이름");
console.log(user1.getName()); // 다른 이름
```

In the above example, the User function is called immediately. After the call ends, the local variable name within the function (originally) disappears. Additionally, it cannot be accessed in the general way.

However, the hidden property `[[Environment]]` of the function returned by the immediately invoked function retains its lexical environment, so functions (here, getName and setName) can access the lexical environment of the immediately invoked function and thus access name. This is how we can mimic private access.

# 2. The Global Object

The global object is typically built into the language or host environment. In the browser environment, it's called `window`, and in Node.js, it's `global`, but recently it has been standardized to `globalThis`.

Variables declared with `var` (as opposed to `let` or `const`) are properties of the global object. However, it is generally advisable not to use `var`, and similarly to avoid using such methods to access the global object. Using `let` prevents access to variables through the global object.

If you want to create a variable that can be used everywhere, you can directly add it to the global object.

```js
globalThis.authorName = "김성현";
console.log(authorName);
```

A variable added in this way to the global object can be accessed anywhere in the script. However, creating global variables is not recommended.

# 3. Named Function Expressions

A named function expression is literally a function expression that has a name.

Consider the following code. There is a name attached to the function expression.

```js
let foo = function bar() {
    console.log("SH");
}
```

This does not prevent `foo` from being called, and it operates the same as a regular function expression. So what's different?

It can reference itself within the function expression, but the name cannot be used outside the expression.

```js
let greeting = function func(name) {
    if (name) {
        console.log(`안녕하세요 ${name}님`);
    }
    else {
        func("김성현");
    }
}

greeting(); // 안녕하세요 김성현님
func(); // An error occurs because func is not accessible outside the named function expression
```

However, this could easily be done by substituting `greeting` instead of `func`. Thus, it is not necessary to name the function expression. What is the benefit of this? It occurs when `greeting` is assigned to another function.

```js
let greeting = function (name) {
    if (name) {
        console.log(`안녕하세요 ${name}님`);
    }
    else {
        greeting("김성현");
    }
}

greeting(); // 안녕하세요 김성현님
let foo = greeting;
greeting = null;
foo();
// An error occurs because foo cannot access greeting's outer lexical environment
```

On the other hand, using a named function expression keeps the name of the function within the local lexical environment of the function, allowing the usage of that name regardless of what the outer function's name was.

```js
let greeting = function func(name) {
    if (name) {
        console.log(`안녕하세요 ${name}님`);
    }
    else {
        func("김성현");
    }
}

greeting(); // 안녕하세요 김성현님
let foo = greeting;
greeting = null;
foo();
// 안녕하세요 김성현님
```

You can always use the internal name of the function expression to call itself. JavaScript guarantees that the name given to a function expression will always refer to that particular function.

## 3.1. Function Properties

Since functions are objects, properties can be attached to them and they also have default properties such as `name` and `length`.

# References

https://coderwall.com/p/ta4caw/using-iife-to-create-private-members-in-javascript