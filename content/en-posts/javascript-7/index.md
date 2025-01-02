---
title: Modern JavaScript Tutorial Part 1.4 Basics of Objects - 1
date: "2023-01-01T00:00:00Z"
description: "ko.javascript.info part 1-4 first"
tags: ["javascript"]
---

The New Year of 2023 has arrived. And I am organizing my JS. Oh dear...

# 1. Concept of Objects

An object can store various data unlike primitive types. It can contain multiple properties composed of key-value pairs. Here, the key is a string, and the value can be of any type. Since it is managed as a hash, there are restrictions on the type of key.

Objects can be created using curly braces `{}` or the constructor `new Object()`, but typically curly braces are used.

## 1.1. Handling Properties

The key-value pairs of an object are called properties. They can be accessed using `.`.

```js
let user={
  name:"김성현",
  nickname:"witch",
  age:25,
}

console.log(user.name); // Outputs "김성현".
```

New properties can also be added. Additionally, properties can be deleted using the `delete` operator.

```js
let user={
  name:"김성현",
  nickname:"witch",
  age:25,
}

user.gender="Male";
delete user.age;
console.log(user); // {name: '김성현', nickname: 'witch', gender: 'Male'}
```

If the key string contains spaces, it must be enclosed in quotes.

```js
let user={
  name:"김성현",
  nickname:"witch",
  age:25,
  "now in":'서울',
}
```

Moreover, it is important to note that even if the object is declared as a constant, its properties can be modified. Declaring an object as `const` does not fix the contents of the object but rather the reference to the object.

## 1.2. Bracket Notation

If the key consists of multiple words, properties cannot be referenced with `.`. Dot notation can typically be used when the key is a valid variable name.

However, another point is that object keys can use reserved words in JS, such as for and let.

If the key is not a valid variable name, brackets can be used to retrieve the key. When using brackets, the result of the evaluation of any expression can be used as the key.

```js
let user={
  name:"김성현",
  nickname:"witch",
  age:25,
  "now in":'서울',
}

console.log(user["now in"]); // 서울
```

## 1.3. Computed Properties

When creating an object literal, if the key is enclosed in brackets, it is called a computed property, allowing the evaluation result of the expression to be used as the key. For example, values from a prompt window can be used as object keys.

```js
let name=prompt("Please enter your name", "");

let info={
  [name]:"me",
}
console.log(info);
```

Alternatively, complex computation results from variables can also be used as keys.

## 1.4. Property Name Constraints

Object keys can use reserved words like for or let, unlike variable names. Any character type or symbol can also be used. If a value of another type is used as a key, it will automatically convert to a string.

However, `__proto__` cannot be used as an object key for historical reasons, which will be covered later.

## 1.5. Checking Property Existence

If an attempt is made to access a property key that does not exist in an object, JS returns undefined instead of throwing an error. Therefore, one can check if a specific key exists in an object by comparing the result of the key lookup to undefined.

The `in` operator supports such functionality. The difference from checking after retrieving the key and comparing it to undefined is that using `in` allows us to detect when the value itself is undefined. Of course, it is rare to explicitly set a value to undefined.

```js
let info={
  name:"김성현",
  nickname:"마녀",
}
console.log("name" in info); // true, since name exists
console.log("age" in info); // false, since age does not exist
```

## 1.6. Iterating Over Objects

Using `for..in`, all keys of an object can be iterated over.

```js
let info={
  name:"김성현",
  nickname:"마녀",
}

for(let key in info){
  console.log(key);
}
```

## 1.7. Object Sorting Method

Properties also have an order. This order can be confirmed when iterating over the object using `for..in`.

Properties in integer form (which can be converted to integers without modification) are automatically sorted, while others are sorted in the order in which they were added.

# 2. Objects and References

Primitive types store values directly. For example, if `let a=1` is assigned, a actually holds the value 1. However, objects are stored and copied by reference. Therefore, when an object is assigned to another variable, a reference to that object is passed.

For instance, if the integer value 1 is stored in a and assigned to b, the value 1 is also stored in b. Since the value is stored, changing b does not affect a.

```js
let a=1;
let b=a;
b=2;
console.log(a,b); // 1 2
```

However, if an object is assigned to another variable and that variable is manipulated, the original variable also changes due to the reference being assigned.

```js
let info={
  name:"김성현",
  nickname:"마녀",
}

let info2=info;
info2.name="김상준";
console.log(info, info2); // Both info and info2 have changed.
```

## 2.1. Object Comparison

When comparing objects, both `==` and `===` behave the same. They both compare object references. For example, in the following code, a and b are completely identical objects, but since they point to different objects in memory, both `==` and `===` return false.

```js
let a = {
  name: "김성현",
  blog: "https://www.witch.work/",
};
let b = {
  name: "김성현",
  blog: "https://www.witch.work/",
};
console.log(a == b);
console.log(a === b);
```

## 2.2. Object Copying

However, there are cases when you want to copy the contents of an object instead of copying its reference. If the values of the object's properties are primitive types, you can iterate through the object and replicate them.

```js
let a = {
  name: "김성현",
  blog: "https://www.witch.work/",
};
let b = {};

for (let key in a) {
  b[key] = a[key];
}
console.log(b === a); // false
```

Alternatively, you can use the Object.assign method. This function copies objects received from the second argument to the last argument into the first argument.

```js
let a = {
  name: "김성현",
  blog: "https://www.witch.work/",
};
let b = {
  nickname: "마녀",
};

let info = {};

Object.assign(info, a, b);
console.log(info); // The contents of a and b are copied to info
```

If the first object has properties with the same key, the properties of the latter object will overwrite those of the first. For more details, refer to [here](https://www.witch.work/javascript-object-assign/).

## 2.3. Deep Copying of Objects

As mentioned earlier, if an object's property values are primitive types, you can iterate through the object and replicate it. 

But what if the property value is another object? In such cases, using the previous method leads to issues because references to each value are copied. This problem can be confirmed in the following code.

```js
let info1 = {
  name: "김성현",
  blog: "https://www.witch.work/",
  sizes: {
    height: 171,
    foot: 280,
  },
};

let info2 = info1;
info2.sizes.foot = 290;
// Because of the code above modifying info2's value, info1 is also modified.
console.log(info1);
```

To address this issue, you need to inspect each value of the object, and when the value is an object, also copy its structure. This is called deep copying.

To implement this, you can use the Structured cloning algorithm or the lodash `cloneDeep` function.

# 3. Garbage Collection

JS manages unused memory through garbage collection. This garbage collector monitors all objects and deletes those that are unreachable. Here, "reachable" means that the value can be accessed or used in some way.

For example, local variables of the current function, parameters, and variables or parameters inside nested function chains are not deleted.

What does "unreachable" mean? It means that there are no places referencing that object anymore.

```js
let info1 = {
  name: "김성현",
  blog: "https://www.witch.work/",
};
// Now there are no references to the object that info1 pointed to.
info1=null;
```

However, if the reference to the object exists in another variable or can be reached through another path, the object will not be garbage collected. It is important to note that simply referencing objects to each other is not sufficient; there must be a way for us to access them within the program.

The way to determine this reachability is as follows.

First, certain values are referred to as roots:

- Local variables and parameters of the current function
- Variables and parameters used within a chain of nested functions
- Global variables
- Other values that are fundamentally considered accessible, i.e., objects in the call stack.

All objects accessible through these roots are then marked. You should think of it as a graph where objects are vertices and references are edges; the traversal begins from the roots.

When all searches originating from the roots are completed, the objects that are unreachable become candidates for garbage collection.

# References

https://stackoverflow.com/questions/9748358/when-does-the-js-engine-create-a-garbage-collection-root