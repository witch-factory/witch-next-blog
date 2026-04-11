---
title: Modern JavaScript Tutorial Part 1.6 Advanced Functions
date: "2023-01-20T00:00:00Z"
description: "ko.javascript.info part 1-6 first"
tags: ["javascript"]
---

# 1. Recursion and Stack

Recursive functions are excellent for creating self-repeating structures. For example, when writing a factorial function, it can be implemented as follows using a recursive approach:

```js
function factorial(n) {
  return n ? n * factorial(n - 1) : 1;
}
```

So how do these recursive functions actually work in JavaScript? They utilize an execution context. A detailed explanation can be found [here](https://www.witch.work/javascript-execution-context/).

# 2. Rest Parameters and Spread

Rest parameters allow for an unlimited number of arguments to be passed. The rest parameters gather the remaining arguments as an array, excluding the preceding parameters.

Although the `arguments` object, which is similar to an array, can be used to access arguments via indices, it is not an actual array and does not allow for array methods to be used, despite being iterable. Additionally, it captures all arguments, making it impossible to specifically include certain arguments in the rest. Arrow functions do not support `arguments`.

## 2.1. About Spread

The spread syntax can be used with iterables. It collects elements by calling the internal iterator in a manner similar to `for..of`. However, `Array.from` is more commonly used when converting specific objects to arrays since spread syntax is applicable only to iterables, while `Array.from` can also be used with array-like objects.

Interestingly, direct use of the spread syntax reveals that it can also be applied to objects:

```js
let a={a:1, b:2, c:3};
let aCopy={...a};
console.log(a===aCopy);
```

This is peculiar... simple objects are not iterable... why is this the case? This occurs because the spread property proposal was accepted, allowing the spread syntax to be used with object literals. This topic is summarized in [another article](https://www.witch.work/javascript-spread-object/).

# 3. Variable Scope and Closures

JavaScript is a function-oriented language where functions are treated as objects. Therefore, dynamic creation of functions and passing functions as arguments are possible. Here, we will explore the interaction between functions and the outside.

For reference, this section only addresses `let` and `const`. `var` will be covered later.

## 3.1 Code Blocks

A code block refers to sections of code enclosed in curly braces. These blocks group code meant for specific tasks and are also used for variable scoping.

In this case, since `let` uses block-level scoping, declaring a variable multiple times within the same scope will result in an error.

```js
let msg = "hello";
console.log(msg);
// Identifier 'msg' has already been declared
let msg = "hello";
```

## 3.2. Lexical Environment

Since functions are objects in JavaScript, they can naturally be returned from functions. This feature can also be utilized. For example:

```js
function addNumber(n) {
  return function (x) {
    return x + n;
  };
}

let add3 = addNumber(3);
console.log(add3(5)); // 8
```

However, if multiple functions are created via `addNumber`, will they be different objects? If there were variables within `addNumber`, what values would those variables hold in the functions returned by `addNumber`? The answer lies in the lexical environment.

In JavaScript, executing functions, code blocks, and global scripts have hidden associated objects known as lexical environments. Each scope contains an object that holds its information. This lexical environment object consists of an environment record and a reference to the outer lexical environment.

The environment record stores all local variables, `this` values, and other information held by the scope. Variables are properties of this environment record, and manipulating variables is equivalent to manipulating properties of the environment record. The outer lexical environment reference holds a reference to the outer lexical environment object.

### 3.2.1. Variables and Lexical Environments

Variables stored using `let` and `const` are recognized by the engine when the script starts and are added to the lexical environment. However, they enter an uninitialized state, meaning they cannot be accessed before they are declared.

Consider the following code with comments explaining the storage of variables and external lexical environment references.

```js
/* 
Global Lexical Environment
The external lexical environment reference points to null since there is no outer lexical environment
Stores local variable a with value 1 as property a:1
*/
let a=1;
if(a===1){
  /*
  The external lexical environment reference points to the global lexical environment
  Stores local variable b with value 2
  */
  let b=2;
  console.log(b);
}
```

As the code executes and the flow advances line by line, the lexical environment changes. For instance, when variable `a` is declared, it is stored as undefined in the lexical environment. Then, when `a` is assigned the value of 1, it changes to 1 in the lexical environment.

Let's observe the changes in the lexical environment as the flow of execution progresses:

```js
/*
Script starts. All variables declared in the script are added to the lexical environment, with values in the special state of uninitialized. The engine recognizes the variables, but until declared with let, they cannot be accessed.
*/
let a, b;
/*
a and b have been declared but not assigned values, so the property values are undefined. 
*/
a=1;
/* a has been assigned a value. This value is stored in the global lexical environment. */
```

However, for variables declared with `var`, they are initialized at the start of the script and are added to the lexical environment, initialized to undefined. Therefore, in practice, variables declared with `var` can be used as if they were declared at the top of the script.

```js
/* In the code, it appears before the declaration of a, but since a has been declared 
at the start of the script, it is available to use. */
a = 2;
console.log(a); // 2

var a = 1;
```

### 3.2.2. Functions and Lexical Environments

Functions are treated as values and are also stored in the lexical environment, similar to variables.

However, functions declared with function declarations are initialized alongside the creation of lexical environments, just like `var`. Thus, even if the code has not yet reached the function declaration, it can be used immediately as soon as the lexical environment is created.

```js
// foo is declared using a function declaration, so it can be used immediately
foo();

function foo() {
    console.log("hi");
}
```

Only functions declared via function declarations are initialized along with the creation of the lexical environment. Functions created via function expressions cannot be used before they are declared.

Additionally, every time a function is called, a new lexical environment is created. This environment includes local variables of the function, references to the outer lexical environment, and the parameters passed during the function call.

If a function accesses a variable, it first searches for that variable within its internal lexical environment. If an internal variable of the same name exists, access will go to that internal variable.

If the desired variable is not found within the internal lexical environment, the search expands to the outer lexical environment, continuing until the global lexical environment is reached.

### 3.2.3. Function Creation and Lexical Environment

Now let's look at a function that creates functions, simplified for clarity:

```js
function foo() {
    let t = 0;

    return function () {
        return t++;
    }
}
```

Calling `foo()` creates a new lexical environment each time. Since every function invocation adds a new execution context to the call stack, which includes the lexical environment, this is to be expected.

So what happens to the lexical environment of the nested function returned by `foo`? Every function carries a hidden property called `[[Environment]]`, which references the lexical environment where the function was created. This value changes only once when the function is created and remains constant thereafter.

```js
function foo() {
    let t = 0;

    return function () {
        return t++;
    }
}

let t1 = foo();
let t2 = foo();
// 0 1 2 0 1 outputs can be confirmed to see t1 and t2's Environment are independent
console.log(t1());
console.log(t1());
console.log(t1());
console.log(t2());
console.log(t2());
```

Thus, `t1` and `t2` possess Environment references to the lexical environments that were created when invoking `foo()`, remembering that `t`, a local variable, holds the value of 0. 

When `t1` or `t2` is executed, it will first search its own lexical environment for `t`. Since it doesn't exist there, it will look in the external lexical environment (i.e., `foo`). At that moment, it will access `[[Environment]]` to find `t`, which will return 0 and increment it to 1.

Functions capable of remembering and accessing external variables are known as closures. Since JavaScript functions inherently possess the hidden `[[Environment]]` property, all functions are closures.

Here’s another example illustrating this:

```js
function print() {
  let a = "김성현";
  return function () {
    console.log(a); // 김성현
  };
}

let a = "김성현2";

let p = print();
p();
```

During the creation of `p`, the lexical environment remembered the initial state, leading to this behavior.

## 3.3. Memory GC and Closures

Once a function call concludes, the lexical environment created for that function instance is removed from memory because it is no longer reachable.

However, if a function returns another function, the `[[Environment]]` of the returned function will refer back to the lexical environment in which it was created. As a result, even after the function call ends, the lexical environment retains its place in memory.

This retention of the lexical environment can lead to memory leaks.

For instance, consider the following code:

```js
function addNumber(n) {
  return function (x) {
    return x + n;
  };
}
// addOne, addTwo, addThree all independently remember their created lexical environments
let addOne = addNumber(1);
let addTwo = addNumber(2);
let addThree = addNumber(3);

console.log(addOne(1)); // 2
console.log(addTwo(1)); // 3
console.log(addThree(1)); // 4
```

In this code, even after the call to `addNumber` concludes, `addOne`, `addTwo`, and `addThree` still hold in their internal `Environment` properties their respective lexical environments. Therefore, these lexical environments are not eliminated from memory.

Naturally, if functions like `addOne` and `addTwo` are removed from memory, the lexical environment previously captured will also disappear.

### 3.3.1. V8 Memory Optimization

However, in V8 engines, there is an optimization process that analyzes variable usage and, if it determines that external variables are unused, it can eliminate them from memory.

```js
let val = "global";

function f() {
  let val = "local";
  function g() {
    debugger;
    /* When execution halts here, the val variable is
    optimized by V8. But since val is unused,
    its deletion will fail any attempts to print it in the console. */
  }
  return g;
}

let foo = f();
foo();
```

## 3.4. Closure Examples

### 3.4.1. Counter

```js
function Counter() {
  this.count = 0;

  this.increment = function () {
    return ++this.count;
  };

  this.decrement = function () {
    return --this.count;
  };
}

let counter = new Counter();
// 1 2 3 2
console.log(counter.increment());
console.log(counter.increment());
console.log(counter.increment());
console.log(counter.decrement());
```

In this example, the `increment` and `decrement` functions operate perfectly as they share the same lexical environment and the same `count` variable.

### 3.4.2. Visible Variables

```js
let x = 1;

function func() {
  console.log(x);
  let x = 2;
}

func();
```

In the above code, attempting to access `x` results in an error:

```
Uncaught ReferenceError: Cannot access 'x' before initialization
```

When the `func` function is called, a new lexical environment is created. The engine detects the declaration of a local variable `x`, initializing `x` to `<uninitialized>`.

Then, during the execution of `console.log(x)`, an attempt to access `x` is made, but it is in an uninitialized state, prohibiting access before declaration. Thus, this error is expected.

### 3.4.3. Creating Functions in a Loop

```js
function makeFunction() {
  let funcs = [];

  let i = 0;
  while (i < 3) {
    funcs[i] = function () {
      console.log(i);
    };
    i++;
  }
  return funcs;
}

let funcs = makeFunction();
// All output 3
funcs[0]();
funcs[1]();
funcs[2]();
```

Why do all calls output 3 instead of the expected values? The function `funcs[i]` retains a reference to the outer lexical environment. When this function is invoked, it accesses `i`. However, since there is no `i` defined within the inner function, it will refer to the outer lexical environment.

In this case, the outer lexical environment corresponds to the lexical environment of the `makeFunction` function, where at the end of its execution, `i` holds the value 3. Thus, calling any function in the `funcs` array will return 3.

To resolve this, we need to store the value of `i` at the time each `funcs[i]` function is created:

```js
function makeFunction() {
  let funcs = [];

  let i = 0;
  while (i < 3) {
    let j = i; // Capture the current value of i
    funcs[i] = function () {
      console.log(j);
    };
    i++;
  }
  return funcs;
}
```

Now we can see the expected outputs of 0, 1, and 2, as each function will capture and store its own value of `j` in the lexical environment.