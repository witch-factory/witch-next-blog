---
title: Modern JavaScript Tutorial Part 1.7 Object Property Settings
date: "2023-02-06T00:00:00Z"
description: "ko.javascript.info part 1-7"
tags: ["javascript"]
---

# 1. Property Flags and Descriptors

Properties have three attribute flags along with their values: writable, enumerable, and configurable. By default, all three are set to true. The descriptions of each attribute are as follows.

- writable: Indicates whether the value can be modified
- enumerable: Indicates whether the property can be listed using methods such as for..in loops or Object.keys
- configurable: Indicates whether the property can be deleted or its flags modified

You can check the information of a property using the following method. This method returns a property descriptor object that contains both the property value and flags information.

```
Object.getOwnPropertyDescriptor(obj, property) 
```

It can be used as follows.

```js
let me = {
  firstName: "Kim Sung-hyun",
};
console.log(Object.getOwnPropertyDescriptor(me, "firstName"));
/*
{
  value: 'Kim Sung-hyun',
  writable: true,
  enumerable: true,
  configurable: true
}
*/
```

Using the `Object.defineProperty` method, you can modify the property flags.

```js
Object.defineProperty(obj, propertyName, descriptor)
```

If flag information is not provided in the descriptor, it is automatically set to false.

The settings of each property flag impart characteristics to the property. If writable is false, the value cannot be written. If enumerable is false, the property cannot be listed using methods such as for..in loops or Object.keys.

If configurable is false, the property cannot be deleted or its flags modified. For example, Math.PI is an immutable constant, hence configurable is false.

Once configurable is set to false, it cannot be reverted. Even with `defineProperty`, it is not possible to modify this flag.

You can use `Object.defineProperties` to set multiple properties.

Using `Object.getOwnPropertyDescriptors(obj)`, you can retrieve all property descriptors. By using defineProperties, copying an object along with its flags is also possible.

Additionally, while copying using for..in does not copy the object's symbol properties, the method below successfully copies symbol properties as well.

```js
// Returns an object with descriptors copied
Object.defineProperties({}, Object.getOwnPropertyDescriptors(obj));
```

# 2. Property Getter and Setter

Object properties are divided into data properties and accessor properties. Data properties hold the data we generally use, while accessor properties are essentially functions that serve as getters and setters.

They can be declared using the get and set keywords and are used as if the actual property exists. Below is an example using a getter.

```js
let me = {
  firstName: "Sung-hyun",
  lastName: "Kim",

  get fullName() {
    return this.lastName + this.firstName;
  },
};
console.log(me.fullName);
// Kim Sung-hyun
```

Since there is currently no setter method, the fullName property is read-only. Even attempting to directly assign a value will not work correctly.

```js
me.fullName = "Lee Sung-hyun";
console.log(me.fullName);
// Kim Sung-hyun
// In reality, there is no fullName property, so the value did not change
```

By adding a setter, you can assign a value to fullName as if you were using a regular object property.

```js
let me = {
  firstName: "Sung-hyun",
  lastName: "Kim",

  get fullName() {
    return this.lastName + this.firstName;
  },

  set fullName(value) {
    [this.lastName, this.firstName] = value.split(" ");
  },
};
console.log(me.fullName);
// Kim Sung-hyun
me.fullName = "Lee Sung-hyun";
console.log(me.fullName);
// Lee Sung-hyun
```

## 2.1. Descriptor of Accessor Properties

Accessor properties have a different descriptor from data properties. They include get, set, enumerable, and configurable flags. The value and writable flags are absent.

The difference lies in get and set, where get is a function with no arguments called when reading the property value, and set is a function with one argument called when writing the property value. The remaining descriptors are the same as those for data properties.

These descriptors can also be set using defineProperty. However, since properties can only be either accessor or data, setting both get and value simultaneously will result in an error.

## 2.2. Utilizing Getter and Setter

Getter and setter can be used to control values, such as allowing a value to be set only when it exceeds a certain threshold.

```js
let obj = {
  get num() {
    return this._num;
  },
  set num(value) {
    if (value < 10) {
      console.log("Value is too small");
    } else {
      this._num = value;
    }
  },
};

obj.num = 5;
console.log(obj.num); // The value is not set since it is less than 10
obj.num = 15;
console.log(obj.num);
```