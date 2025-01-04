---
title: Exploring JavaScript - Exotic Objects
date: "2023-08-01T00:00:00Z"
description: "What are exotic objects in JS?"
tags: ["javascript"]
---

# 1. Introduction

`Object.create` creates and returns an object with the specified prototype object.

The Array object, therefore, is an object with `Array.prototype` as its prototype. What will be the following output?

```js
console.log(Array.isArray(Object.create(Array.prototype)));
```

Since it determines whether the object inherited from `Array.prototype` is an Array, one might expect it to return true. However, the answer is false. [The same is true even when using constructors for proper inheritance.](https://forum.kirupa.com/t/js-tip-of-the-day-exotic-objects/643152)

The reason lies in exotic objects. They have unique internal behaviors that prevent simple inheritance using prototypes. `Array` is a prime example of an exotic object.

# 2. Classification of JS Objects

In JS, objects are classified as ordinary objects and exotic objects. An ordinary object refers to the common objects we typically encounter, such as the following:

```js
{
  a: 1,
  b: 2,
  c: 3
}
```

Exotic objects, on the other hand, exhibit behaviors different from those of ordinary objects. For instance, since the `length` property of an Array behaves differently than that of a regular object, it is considered an exotic object.

In addition to `Array`, other exotic objects include `Proxy`, `String`, and `Arguments` objects.

So, what is an exotic object? According to specifications, an exotic object is one that does not conform to ordinary object definition, thus necessitating our understanding of ordinary objects first.

# 3. Ordinary Objects

[The specification provides the following definition for ordinary objects.](https://tc39.es/ecma262/#ordinary-object)

All objects must implement essential internal methods. Each object must have implementations for these essential internal methods, but they do not have to follow the same algorithms.

- `[[GetPrototypeOf]]`
- `[[SetPrototypeOf]]`
- `[[IsExtensible]]`
- `[[PreventExtensions]]`
- `[[GetOwnProperty]]`
- `[[DefineOwnProperty]]`
- `[[HasProperty]]`
- `[[Get]]`
- `[[Set]]`
- `[[Delete]]`
- `[[OwnPropertyKeys]]`

Function objects must also implement the following essential internal methods:

- `[[Call]]`
- `[[Construct]]`

An ordinary object is an object that implements these essential internal methods according to specific criteria. [These criteria are all outlined in the specification.](https://tc39.es/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots) Generally, an object like `{apple:"사과", banana:"바나나"}` satisfies this ordinary object criterion (though this is not the only example).

Typically, the essential internal methods for such objects are defined by prefixing the method names with `Ordinary`. For example, [the `[[GetPrototypeOf]]` of an ordinary object is defined as `OrdinaryGetPrototypeOf`.](https://tc39.es/ecma262/#sec-ordinarygetprototypeof)

# 4. Exotic Objects

Exotic objects are defined as those that do not fit the definition of ordinary objects mentioned above. However, it was noted that essential internal methods must be implemented by all objects.

This means that exotic objects also implement these methods, but in a way that differs from ordinary objects. Let’s examine a few examples of simple exotic objects.

For reference, the following are the exotic objects defined in the specification:

- Bound Function Exotic Objects
- Array Exotic Objects
- String Exotic Objects
- Arguments Exotic Objects
- Integer-Indexed Exotic Objects
- Module Namespace Exotic Objects
- Immutable Prototype Exotic Objects
- Proxy Exotic Objects

## 4.1. Array Exotic Object

In the case of the [Array Exotic Object](https://tc39.es/ecma262/#array-exotic-object), properties with array indices as property keys are treated specially, and it has a unique property called `length`.

This indicates that all other essential internal methods of the array exotic object behave like ordinary objects, except for the implementation of the `[[DefineOwnProperty]]` internal method.

The specification for `[[DefineOwnProperty]]` of an array exotic object shows that it behaves differently from the corresponding method in an ordinary object.

![Array Exotic Object's DefineOwnProperty](./js-array-defineownproperty.png)

When setting the `length` property, it calls a method `ArraySetLength` to define the property.

In simple terms, if the set `length` value is greater than the current `length`, the array expands to the set length, filling remaining slots with empty slots. If the set `length` value is less than the current `length`, it reduces the array to the set length, deleting remaining slots.

However, only properties with `configurable` set to true are deleted. The specific operations of this method are not the focus here, so refer to the [specification for more details.](https://tc39.es/ecma262/#sec-arraysetlength)

Properties that have valid array indices (non-negative integers) as property keys are treated specially as well. These properties are linked to the `length` property. If an array index exceeds the `length` property, the `length` is set to one greater than that index.

Aside from what has been described above, all other behaviors are identical to those of ordinary objects. 

Thus, the `[[DefineOwnProperty]]` method in array exotic objects behaves differently than in ordinary objects.

## 4.2. Bound Function Exotic Object

[For a brief explanation, please refer to the specification.](https://tc39.es/ecma262/#sec-bound-function-exotic-objects)

At first glance, one might misinterpret the term Bound Function as indicative of a bounded function, but it actually refers to the past tense of bind. In any case, this object is returned by `Function.prototype.bind`.

Given the purpose of `Function.prototype.bind`, this object naturally implements the required methods `[[Call]]` and `[[Construct]]`.

The difference between this bound function exotic object and an ordinary object is that it calls a function with the function, this, and arguments set as specified by bind when invoked.

In the case of constructor functions, it also interacts with `new.target`, which stores any constructor invoked with new.

![Bound function object specification](./js-bound-function.png)

These values are stored in the internal slots of the bound function exotic object: `[[BoundTargetFunction]]`, `[[BoundThis]]`, and `[[BoundArguments]]`. Before the function is invoked, these internal slots determine what function to call, what this refers to, and what arguments to use.

## 4.3. Immutable Prototype Exotic Object

This exotic object cannot change its internal slot `[[Prototype]]` once initialized.

This means that calling the `[[SetPrototypeOf]]` method does not change `[[Prototype]]`. If the input to this method is the same as the current prototype, it returns the first argument object; otherwise, it raises an error. The prototype remains immutable.

However, this object cannot be created directly, as it is used internally within `Object.prototype` and host environments. Naturally, attempting to modify the prototype of `Object.prototype` results in an error due to its status as an Immutable Prototype Exotic Object.

# 5. Operational Examples

As seen above, the Immutable Prototype Exotic Object cannot have its prototype changed. However, passing a value equal to the current prototype into `Object.setPrototypeOf` will not raise an error and will return the object that attempted the prototype change.

```js
// Outputs Object.prototype
Object.setPrototypeOf(Object.prototype, null);
// Throws error: Object prototype may only be an Object or null
Object.setPrototypeOf(Object.prototype, {x:1});
```

It is not possible to properly inherit the Array Exotic Object prototype. The internal method implementations of exotic objects cannot be inherited. The following code illustrates that the behaviors unique to the Array exotic object, such as the length mechanism, are not inherited and that `Array.isArray` does not pass as well.

```js
function ProtoArray(){
  // Mimicking super() behavior
  Array.prototype.push.apply(this, arguments);
}

ProtoArray.prototype = Object.create(Array.prototype);
ProtoArray.prototype.constructor = ProtoArray;

const arr = new ProtoArray(1,2,3);
console.log(arr.length); // 3
arr.push(4);
console.log(arr.length); // 4
arr[10]=5;
console.log(arr.length); // 4
console.log(Array.isArray(arr)); // false
```

In contrast, using `extends` in a class allows proper inheritance of such exotic object behaviors. The following code demonstrates that the length behaves correctly as an array and passes `Array.isArray`.

```js
class ClassArray extends Array{}

const arr = new ClassArray(1,2,3);
console.log(arr.length); // 3
arr.push(4);
console.log(arr.length); // 4
arr[10]=5;
console.log(arr.length); // 11
console.log(Array.isArray(arr)); // true
```

To effectively inherit the internal implementation of the Array exotic object (like its length behavior), the constructor of the subclass must call `super()`.

This ensures that the internal implementation of the Array exotic object is linked to the instance of the subclass. However, most methods on `Array.prototype` are generically implemented, operating independently of whether the `this` value is an Array exotic object.

> Subclass constructors that intend to inherit the exotic Array behavior must include a super call to the Array constructor to initialize subclass instances that are Array exotic objects. However, most of the Array.prototype methods are generic methods that are not dependent upon their this value being an Array exotic object.
>
> ECMA 262 Specification, https://tc39.es/ecma262/2021/#sec-array-constructor

Moreover, such special internal implementations cannot be easily manipulated by users. Only a few classes, like Array, allow inheritance via `extends`.

# 6. Principles of Built-in Object Inheritance

(This section was added on 2023.08.12)

How does the class syntax allow inheritance of internal implementations of exotic objects? This occurs because the class uses a new approach to instantiate objects.

There are two types of class constructors: base constructors and derived constructors. A class that inherits from another class will have a derived constructor (excluding relationships between built-in objects like `Array.prototype` inheriting from `Object.prototype`).

Previously, such a distinction was unnecessary. Before the class was introduced, constructor functions were used for instance creation, and all constructor functions had `Function.prototype` as their prototype, with built-in objects being the only exception.

However, with the class syntax, it is mandatory to call `super()` in inherited classes, and even the default constructor automatically calls `super()`. Thus, when instantiating derived classes, `super()` traverses back to the base class, creating objects through the base constructor.

Therefore, this principle allows classes that inherit from exotic objects to call up to the exotic object base class constructor, thereby inheriting the exotic behavior.

Expressed in pseudocode, it looks as follows. [Additionally, I have written a detailed article analyzing how Babel handles built-in object processing, which can be referenced for more in-depth exploration of this behavior.](https://witch.work/posts/javascript-prototype-misc#4.4.-%EB%B9%8C%ED%8A%B8%EC%9D%B8-%EA%B0%9D%EC%B2%B4-%EC%83%81%EC%86%8D)

```js
// Source: https://www.bsidesoft.com/5370
const Cls = class extends Array{
  constructor(){
    if(classKind == 'base'){ // If it's the base constructor, this creates itself
      this = Object.create(new.target.prototype);
    } else { // Otherwise, delegate to the parent, but maintain new.target
      this = Reflect.construct(Array, [], new.target); 
    }
  }
};
```

In other words, for derived classes, the instantiation process delegates back to the base constructor, and the `Reflect.construct` method ensures that `new.target` is fixed to the current class. In actuality, it does not use something like `classKind`, but rather utilizes a special internal property `[[ConstructorKind]]:"derived"` to distinguish between base and derived classes.

# References

https://blog.bitsrc.io/exotic-objects-understanding-why-javascript-behaves-so-moody-5f55e867354f

https://ui.toast.com/posts/ko_20221116_1

https://forum.kirupa.com/t/js-tip-of-the-day-exotic-objects/643152

ECMA262 specification: https://tc39.es/ecma262/

Principles of built-in object inheritance: https://www.bsidesoft.com/5370