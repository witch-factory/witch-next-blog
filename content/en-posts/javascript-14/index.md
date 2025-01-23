---
title: Modern JavaScript Tutorial Part 1.6 Advanced Learning of Functions Fourth
date: "2023-02-04T00:00:00Z"
description: "ko.javascript.info part 1-6 fourth"
tags: ["javascript"]
---

# 1. Function Binding

When an object method is passed to a different context or used as a callback, the information about `this` is lost. For instance, the `setTimeout` function causes this loss of `this` information.

```js
let me = {
  firstName: "Kim Seong-hyun",
  greeting() {
    console.log(`Hello. My name is ${this.firstName}.`);
  },
};

me.greeting(); // Hello. My name is Kim Seong-hyun.
setTimeout(me.greeting, 1000); // Hello. My name is undefined.
```

This occurs because only the function detached from the object context is passed to `setTimeout`.

In a browser environment, the `setTimeout` method will reference the `window` object for `this`.

```js
let me = {
  firstName: "Kim Seong-hyun",
  greeting() {
    console.log(`Hello. My name is ${this.firstName}.`);
  },
};
window.firstName = "Unnamed";

me.greeting(); // Hello. My name is Kim Seong-hyun.
setTimeout(me.greeting, 1000); // Hello. My name is Unnamed.
// In the browser environment, this refers to window, hence window.firstName is displayed.
```

So how can we maintain the context when passing an object method?

## 1.1. Wrapper Function

By creating a wrapper function like this, the call to `me.greeting` occurs as a method of the `me` object, rather than being called as a callback, ensuring it works properly.

```js
let me = {
  firstName: "Kim Seong-hyun",
  greeting() {
    console.log(`Hello. My name is ${this.firstName}.`);
  },
};

setTimeout(function () {
  me.greeting();
}, 1000);
```

However, if `me.greeting` is changed before the `setTimeout` callback is executed, an issue arises.

```js
let me = {
  firstName: "Kim Seong-hyun",
  greeting() {
    console.log(`Hello. My name is ${this.firstName}.`);
  },
};

setTimeout(function () {
  me.greeting();
}, 1000);
me.greeting = () => {
  console.log("Modified function");
};
// After 1 second, 'Modified function' is displayed.
```

In such cases, the `bind` method can be used instead.

## 1.2. Bind

`func.bind(context)` returns a new function that fixes `this` to the specified `context` when `func` is called. Therefore, we can create a new function that fixes `this` of `me.greeting` to `me` and pass it to `setTimeout`.

```js
let me = {
  firstName: "Kim Seong-hyun",
  greeting() {
    console.log(`Hello. My name is ${this.firstName}.`);
  },
};

let myGreeting = me.greeting.bind(me);
setTimeout(myGreeting, 1000);
```

Using `bind` fixes only `this` while preserving the function arguments.

If an object has multiple methods and you want to bind them all, you can use a loop.

```js
// Binding methods using a loop
for(let key in obj){
  if(typeof obj[key] === 'function'){
    obj[key] = obj[key].bind(obj);
  }
}
```

## 1.3. Argument Binding

The `bind` method can also fix function arguments in addition to `this`. You can pass arguments to the `bind` method like this.

```js
function f(a, b) {
  console.log(a + b);
}

let addTwo = f.bind(null, 2);
console.log(addTwo(1)); // 3
```

This approach is called a partial function, which creates a new function by fixing some parameters of an existing function. It can be used to generate several variations based on a comprehensive function.

However, using the `bind` method requires a default object for `this`, which can be cumbersome. Therefore, we can create a function that handles `this` automatically while fixing arguments.

```js
// argsBound represents the fixed arguments
function partial(func, ...argsBound) {
  return function (...args) {
    // Use call to utilize this same as an object method
    return func.call(this, ...argsBound, ...args);
  };
}
```

Using this function allows the `this` of the pre-fixed function to be bound to the partially fixed function.

## 1.4. Characteristics of Bind

The special object called a bound function returned by `bind` remembers the context at the time of function creation and only the arguments provided by `bind`. Therefore, calling `bind` again on an already bound function will be ignored.

```js
function f() {
  console.log(this.name);
}

let g = f.bind({ name: "John" }).bind({ name: "Kim Seong-hyun" });
g();
// John
```

Additionally, since a new function object is created and returned when using `bind`, existing properties of the original function are not transferred to the bound function.

```js
function f() {
  console.log(this.name);
}
f.test = 1;

let g = f.bind({ name: "John" });
console.log(f.test); // 1
console.log(g.test); // undefined
```

# 2. Arrow Functions Revisit

In JavaScript, when using methods like `forEach`, it is common to create and pass functions. Using arrow functions in this scenario preserves the current context.

Arrow functions do not have their own `this`. When `this` is used in an arrow function, it takes the value from the enclosing non-arrow function. Therefore, using arrow functions allows access to `this` of the enclosing context without creating a separate `this`.

For example, consider an object that holds study members and has a function to print them one by one. If we pass a function created using `function` to `forEach`, the `this` of that function will refer to `window` (in a browser environment).

```js
let study = {
  goal: "study JS",
  people: ["John", "Jane", "Jack", "Jill"],

  printPeople: function () {
    this.people.forEach(function (person) {
      // In this case, `this` will point to window, resulting in unexpected output
      console.log(`${this.goal}: ${person}`);
    });
  },
};

study.printPeople();
```

To make it work correctly, we must use an arrow function.

```js
let study = {
  goal: "study JS",
  people: ["John", "Jane", "Jack", "Jill"],

  printPeople: function () {
    this.people.forEach((person) => {
      // Here, `this` points to the object that called the enclosing function printPeople
      console.log(`${this.goal}: ${person}`);
    });
  },
};

study.printPeople();
/* study JS: John
study JS: Jane
study JS: Jack
study JS: Jill */
```

Since arrow functions do not have `this`, they cannot be used as constructors. Additionally, `bind` operates differently; `bind` creates a new function that fixes `this` to a specified context and can set `this` to a completely different object.

However, arrow functions do not specifically bind `this`; they simply use the `this` from their enclosing lexical environment.