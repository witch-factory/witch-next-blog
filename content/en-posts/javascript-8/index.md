---
title: Modern JavaScript Tutorial Part 1.4 Basics of Objects - 2
date: "2023-01-02T00:00:00Z"
description: "ko.javascript.info part 1-4 second"
tags: ["javascript"]
---

# 1. Methods and this

Objects can also have methods. When a function is assigned as a value to an object property, it becomes a method.

```js
let info = {
  name: "Kim Seonghyeon",
  age: 25,
};

info.sayHi = function () {
  alert("Hello");
};
```

In the above example, the method can be used with `info.sayHi()`.

## 1.1 Short Syntax for Methods

Methods can be declared inside an object using the function keyword, or simply by specifying the function name.

```js
// Using function keyword
let info = {
  name: "Kim Seonghyeon",
  age: 25,
  sayHi: function () {
    alert("Hello");
  },
};
// Using short syntax
let info = {
  name: "Kim Seonghyeon",
  age: 25,
  sayHi() {
    alert("Hello");
  },
};
```

The two ways have slight differences. First, a method declared using the short syntax cannot be used as a constructor.

```js
let info = {
  name: "Kim Seonghyeon",
  blog: "https://www.witch.work/",

  method1() {},
  method2: function () {
    console.log(this.name);
  },
};
new info.method1(); // Error occurs when using a short method as a constructor
new info.method2(); // Works normally using the standard method
```

Additionally, a method declared using short syntax is also referred to as a `method definition`. As the name suggests, only methods defined as such can access the super keyword.

# 1.2 Methods and this

Using the this keyword within a method allows referencing the object that called the method. This value is determined at runtime and can vary depending on the context. Even the same function can yield different this values when called by different objects or contexts. The following code shows that this changes based on the object calling sayHi.

```js
let user = {
  name: "Kim Seonghyeon",
};
let member = {
  name: "Kim Kidong",
};
function sayHi() {
  alert(this.name);
}

user.f = sayHi;
member.f = sayHi;

user.f(); // Kim Seonghyeon
member.f(); // Kim Kidong
```

Of course, you can force referencing a specific object by accessing external variables, such as writing `alert(user.name)`. However, doing so may cause issues if the content of user changes.

This topic will be covered in greater detail in another article.

# 2. new and Constructors

Constructor functions make it easy to create similar objects using new. By convention, constructor function names start with a capital letter.

Additionally, constructor functions are called with new. If called without new, they behave as regular functions. The following is an example of creating and using a constructor function called Person.

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}

let person = new Person("John", 30);
console.log(person.name);
```

When you call `new Person`, the following occurs: first, an empty object is created and assigned to this, then the function body executes, and finally this is returned. The following code demonstrates that at the start of the function, this references an empty object, and the created this is returned at the end.

```js
function Person(name, age) {
  console.log(this);
  this.name = name;
  this.age = age;
  console.log(this);
}

let person = new Person("John", 30);
```

When new is used, any function is executed as a constructor function. It is conventional for constructor function names to begin with an uppercase letter.

## 2.1. new.target

This is a special property within a function that allows checking whether it was called with new. If called with new, new.target refers to the function itself; otherwise, it refers to undefined.

## 2.2. Constructor Return

Constructor functions typically do not use return, but it is not forbidden. What happens if return is used?

If an object is returned, that object is returned instead of this. If a primitive is returned, this is ignored, and the returned value is returned. If nothing is returned, and only `return;` is used, this is returned.

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
  return 3;
}
// person will be this returned from the constructor, not 3
let person = new Person("John", 30);
console.log(person);
```

You can also call a constructor function without parentheses if there are no arguments. However, this is not considered good coding style.

Furthermore, it is naturally possible to add methods to this within the constructor.

# 3. Optional Chaining

When accessing properties of an object, if an attempt is made to access a property that does not exist, undefined is returned. However, when accessing nested properties like `user.address.city`, an error occurs if an intermediary property is missing. Optional chaining addresses this issue.

The `?.` operator stops evaluation and returns undefined if the object being evaluated before the `?.` is undefined or null. It can be used as follows:

```js
let user = null;
console.log(user?.address);
```

Since user is null, user?.address will be undefined. If `user.address` had been used, an error would have occurred.

However, `?.` only operates on the immediate preceding evaluation. If the result of `?.` is undefined and there is an attempt to access a property through a dot after that, an error will be thrown.

```js
let user = {
  name: "Kim Seonghyeon",
  age: 25,
};
// user.address does not exist, similar to undefined.city, thus an error occurs
console.log(user?.address.city);
```

Additionally, an error will be thrown if there is no evaluation target for `?.`.

```js
// Since the user variable itself does not exist, an error occurs
console.log(user?.address);
```

## 3.1. Using with Methods

?. is not an operator, but rather a special syntactical structure used in conjunction with functions or brackets. Therefore, it can also be used with method calls, for instance, when calling a function whose existence is uncertain.

In the following case, the method2 of the test object does not exist. However, since it is called through ?. no error occurs, and the evaluation simply stops.

test.method2 becomes undefined, and ?. detects this, stopping further evaluation.

```js
let test = {
  method() {
    console.log("method");
  },
};

test.method();
test.method2?.();
```

Similarly, `undefined?.()` does not throw an error.

## 3.2. Using with Brackets

When accessing object properties using brackets instead of dots, `?.[]` can be used. This allows safely reading properties even if the key's existence is uncertain.

```js
let user = {
  name: "Kim Seonghyeon",
  age: 25,
};
// Outputs undefined
console.log(user?.["house address"]);
```

Note that ?. cannot be used on the left side of an assignment operator. It cannot be used for writing values but can be combined with delete to remove a property if the object exists.

# 4. Symbols

A separate article has been written regarding symbols.

# 5. Converting Objects to Primitives

When performing operations on an object, such as arithmetic or alerting, automatic type conversion occurs. The object is converted to a primitive value. So how does this conversion happen?

## 5.1. Cases of Primitive Conversion

When converting to a boolean, objects are always converted to true.

```js
let emptyObject = {};
console.log(Boolean(emptyObject));
// true
```

Converting to a number occurs when performing subtraction operations on objects or applying mathematical functions.

For instance, converting a Date object to a number yields the time elapsed in milliseconds since January 1, 1970. Thus, subtracting one Date object from another returns the time difference in milliseconds.

Conversion to a string occurs when applying functions like alert, String, etc.

## 5.2. ToPrimitive

ToPrimitive is one of the abstract operations in the specification. An abstract operation is not a direct part of the language but rather an operation used internally by the JavaScript engine.

Among these is the ToPrimitive method, which automates type conversion. This method is used for converting an object to a primitive value and is divided into three types based on the hint indicating the desired data type.

### 5.2.1. When the hint is "string"

When performing operations that expect a string, such as passing an argument to the alert function, the hint is "string".

When an object is converted to a string, it usually returns [object Object], which is the result of calling the object's toString method. This will be discussed in more detail in another article.

### 5.2.2. When the hint is "number"

When applying a mathematical operation, the hint becomes "number." The object first calls its valueOf method, and if the result is not a primitive, it calls its toString method.

### 5.2.3. When the hint is "default"

When the expected data type of an operator is uncertain, the hint is "default". An example from study materials is the `+` operator, which could have operands as either strings or numbers.

Likewise, using `==` for comparisons also results in a default hint.

However, for comparison operators `>,<`, while operands can be both strings and numbers, the hint is "number", as specified in the documentation.

Excluding Date objects, all built-in objects treat cases with "default" and "number" hints the same, so it is not necessary to be aware of everything.

## 5.3. Object Conversion Process

The algorithm for object conversion is as follows:

1. Check if the object has a method `obj[Symbol.toPrimitive](hint)`, and if so, call this method.
2. If the hint is "string," call `obj.toString()` and `obj.valueOf()`.
3. If the hint is "number" or "default," call `obj.valueOf()` and `obj.toString()`.

Let's examine each of these steps.

### 5.3.1. Symbol.toPrimitive

This is an internal symbol function for objects, which takes a hint and returns the appropriate conversion value. The hint received as an argument must be one of "string," "number," or "default."

```js
let user = {
  name: "Kim Seonghyeon",
  age: 25,

  [Symbol.toPrimitive](hint) {
    console.log(hint);
    return hint == "string" ? `name: "${this.name}"` : this.age;
  },
};

console.log(user);
console.log(Number(user)); // number, prints 25
console.log(String(user)); // string, prints name: "Kim Seonghyeon"
```

By implementing Symbol.toPrimitive as shown above, the method is invoked when the object is converted to a number or string.

### 5.3.2. toString, valueOf

If the object does not have a Symbol.toPrimitive, the methods toString and valueOf are called. Both are methods of the object and must return a primitive value.

If the hint is "string," toString is called first. If the hint is "number" or "default," valueOf is called first. Typically, valueOf returns the object itself and toString returns "[object Object]".

If an object does not have Symbol.toPrimitive or valueOf, toString handles all conversions. If none of Symbol.toPrimitive, toString, or valueOf return a primitive value, an error occurs.

Furthermore, if toString or valueOf does not return a primitive, the result of that function call is ignored, and the next conversion proceeds.

For instance, in the following code, since user’s toString returns an object, the result is ignored, and then valueOf is called, returning a primitive value, allowing the conversion to proceed normally. The logs show that toString is indeed called.

```js
let user = {
  name: "Kim Seonghyeon",
  age: 30,

  toString() {
    console.log("toString");
    return this;
  },

  valueOf() {
    console.log("valueOf");
    return this.name;
  },
};
console.log(String(user));
```

Note that these conversion functions do not guarantee conversion to the expected data type based on the hint. They must return a primitive value. Even if toString returns an integer, no error will occur.

```js
let user = {
  name: "Kim Seonghyeon",
  age: 25,

  toString() {
    return this.age;
  },
};
// Both work correctly.
console.log(+user);
console.log(String(user));
```

### 5.3.3. Additional Conversions

If an object is used as an operand, it may undergo a conversion, and then undergo another conversion according to the operator. This occurs when a primitive transformed by toString or similar is incompatible with the operator.

```js
let user = {
  toString() {
    return "10";
  },
};
console.log(user * 2);
```

In this example, the output will be 20. user is first converted to the primitive "10" and then multiplied by 2.

Conversely, if the operation is `"10" + 2`, the output will be 102.

```js
let user = {
  toString() {
    return "10";
  },
};
console.log(user + 2);
```

# References

Difference in methods defined with method definitions: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions

Regarding ToPrimitive: https://leesoo7595.github.io/javascript/2020/06/05/JavaScript_toPrimitive/