---
title: Modern JavaScript Tutorial Part 1.9 Class
date: "2023-02-10T00:00:00Z"
description: "ko.javascript.info part 1-9 First"
tags: ["javascript"]
---

# 1. Class and Basic Syntax

When creating multiple instances of the same object, you can use the constructor functions learned earlier, but you can also use classes introduced in modern JS.

```js
class MyClass {
  constructor() {
    // Constructor
  }
  method() {}
}
```

When `new MyClass()` is called, an object is created, and the constructor is executed.

## 1.1. What is a Class?

A class is a type of function.

```js
class MyClass {}
console.log(typeof MyClass); // function
```

Class syntax works as follows: First, it creates a function with the same name as the class, retrieves the function body from the constructor method, and adds class methods to the class name's prototype. In other words, class methods are retrieved from the prototype.

```js
class MyClass {
  constructor() {
    this.myVar = 1;
  }
  myMethod() {
    return this.myVar;
  }
}

console.log(MyClass === MyClass.prototype.constructor); // true
console.log(MyClass.prototype.myMethod); // Content of myMethod defined above
```

## 1.2. Classes and Constructor Functions

Classes function similarly to constructor functions, so you can create a constructor function that performs the same functionality as a class. However, a class is not merely syntactic sugar.

The first difference is that the function created through a class with the same name has an internal property `[[IsClassConstructor]]:true`. Due to this property, if you try to call a class constructor without `new`, an error will occur.

The same applies when converting to a string. Converting a class to a string will return a string that starts with "class". The internal property IsClassConstructor is used to distinguish that it is a class.

```js
class MyClass {
  constructor() {
    this.myVar = 1;
  }
  myMethod() {
    return this.myVar;
  }
}

console.log(MyClass.toString()); // Starts with class

function MyFunction() {
  this.myVar = 1;
  this.myMethod = function() {
    return this.myVar;
  };
}

console.log(MyFunction.toString());
// Starts with function
```

Methods within a class are not enumerable, meaning they do not appear in a for..in loop. Additionally, classes always run in strict mode.

## 1.3. Class Expressions

Similar to function expressions. Additionally, if you use a class name in a class expression, you can create a name that can only be used within the class.

```js
let MyClass = class {
  constructor() {
    this.myVar = 1;
  }
  myMethod() {
    return this.myVar;
  }
};

let myInstance = new MyClass();
console.log(myInstance.myMethod()); // 1
```

Of course, you can also dynamically create a class by returning a class from a function.

## 1.4. Getter, Setter, Computed Properties

You can also set getters and setters in classes. Additionally, you can use computed property names with `[]`.

```js
let MyClass = class {
  constructor(myName) {
    this.foo = myName;
    this.myNumber = 1;
  }
  get myNumber() {
    return this._myNumber;
  }
  set myNumber(value) {
    this._myNumber = value;
  }
  // Computed method name
  ["sung" + 1]() {
    console.log("hello");
  }
};

let myInstance = new MyClass("sunghyun");
console.log(myInstance.foo);
console.log(myInstance.myNumber);
myInstance.sung1(); // hello
```

## 1.5. Class Fields

You can create class fields like `class propertyName=value`. This allows individual class fields to be set for each object. Unlike class methods, class fields are stored in the class instance itself, not in `className.prototype`.

```js
class MyClass {
  value = 1;
  constructor() {}
  method() {
    this.value = 2;
  }
}

let inst1 = new MyClass();
let inst2 = new MyClass();
inst1.method();
console.log(inst1.value, inst2.value); // 2 1
```

From the above code, it can be seen that class fields stored in each class instance are separate.

## 1.6. Utilizing Class Fields

So how can this be used? You can create bound methods using class fields.

In JS, `this` is determined dynamically. Thus, if you call an object method from a different context, `this` may not operate correctly.

```js
function func(callback) {
  callback();
}

let obj = {
  value: 1,
  method() {
    console.log(this.value);
  },
};
obj.method(); // 1
func(obj.method); // undefined
// obj.method is stored in a state separated from the object..
```

To resolve this, you can create a wrapper function or use `bind`, `call`, etc. However, you can also use class fields. Initially, you make the wrapper function a class field.

The existing code where `this` does not operate correctly is as follows.

```js
function func(callback) {
  return callback();
}

class MyClass {
  constructor() {
    this.myVar = 1;
  }
  myMethod() {
    return this.myVar;
  }
}

const myClass = new MyClass();
console.log(myClass.myMethod()); // 1
console.log(func(myClass.myMethod)); // Error due to no `this` reference
```

You write the class field itself as an arrow function. Then, since arrow functions do not have `this`, they refer to the `this` of the enclosing scope. Therefore, here `this` refers to `MyClass`.

```js
function func(callback) {
  return callback();
}

class MyClass {
  constructor() {
    this.myVar = 1;
  }
  myMethod = () => this.myVar;
}

const myClass = new MyClass();
console.log(myClass.myMethod()); // 1
console.log(func(myClass.myMethod)); // 1
```

## 1.7. Disadvantages of Using Arrow Functions in Class Fields

This is noted in comments on study materials. The above method of using arrow functions as class fields has drawbacks.

First, arrow functions are not methods of the class; they are simply function objects stored in class fields. Therefore, they are not stored in `className.prototype`.

```js
class MyClass {
  constructor() {}
  myFunc() {
    return 1;
  }
}

console.log(MyClass.prototype.myFunc()); // 1

class MyClass2 {
  constructor() {}
  myFunc = () => {
    return 1;
  };
}

console.log(MyClass2.prototype.myFunc()); // Error
```

Thus, it poses a problem when writing test cases.

Additionally, it is said that inheritance does not work, though this seems to have been resolved now.

# 2. Class Inheritance

Classes can be inherited using the `extends` keyword. When this inheritance occurs, it uses the prototype.