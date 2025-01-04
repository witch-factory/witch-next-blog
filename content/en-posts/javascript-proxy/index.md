---
title: Exploring JavaScript - Proxy and Reflect
date: "2023-10-22T00:00:00Z"
description: "Understanding Proxy and Reflect introduced in ES6"
tags: ["javascript"]
---

While studying decorators in TypeScript, I came across references to Proxy, and I decided to organize my thoughts on this topic that I had wanted to clarify for some time.

# 1. Basics of Proxy

## 1.1. Declaring a Proxy

A Proxy is an object that wraps another object, intercepting operations performed on it to either handle them or to perform additional tasks. After the additional tasks, it may pass the operations to the original object.

A Proxy object is created in the following manner:

```js
let proxy = new Proxy(target, handler);
```

`target` is the object that the proxy wraps, which can be any JS object. `handler` is an object that defines the operations the proxy will intercept and how to handle those operations. The methods in the handler that intercept the object's actions are called `traps`.

When an operation is invoked on the created proxy object, if there is a trap corresponding to the operation in the handler, that trap is executed; otherwise, the proxy forwards the operation to the original object.

In the following case, since there are no traps defined in the handler, all operations applied to `proxy` are forwarded to `target`. Unlike a regular object, the proxy does not have properties.

```js
let target = {};
let proxy = new Proxy(target, {});
```

## 1.2. Types of Traps

The operations that can be intercepted using traps in a Proxy include the following. These correspond to the internal methods of the original object, and can be intercepted through the proxy's traps.

The following table is sourced from the article [Proxy and Reflect](https://ko.javascript.info/proxy).

| Trap Name          | Corresponding Internal Method | Invocation Time        |
|--------------------|-------------------------------|------------------------|
| get                | [[Get]]                      | When reading a property |
| set                | [[Set]]                      | When writing a property  |
| has                | [[HasProperty]]              | When using the in operator |
| deleteProperty     | [[Delete]]                   | When using the delete operator |
| apply              | [[Call]]                     | When invoking a function |
| construct          | [[Construct]]                | When using the new operator |
| getPrototypeOf     | [[GetPrototypeOf]]           | Object.getPrototypeOf    |
| setPrototypeOf     | [[SetPrototypeOf]]           | Object.setPrototypeOf     |
| isExtensible       | [[IsExtensible]]             | Object.isExtensible      |
| preventExtensions   | [[PreventExtensions]]        | Object.preventExtensions  |
| defineProperty     | [[DefineOwnProperty]]        | Object.defineProperty, Object.defineProperties |
| getOwnPropertyDescriptor | [[GetOwnProperty]]    | Object.getOwnPropertyDescriptor, for..in, Object.keys/values/entries |
| ownKeys            | [[OwnPropertyKeys]]          | Object.getOwnPropertyNames, Object.getOwnPropertySymbols, for..in, Object.keys/values/entries |

### 1.2.1. Rules for Using Traps

When using traps, the following rules must be adhered to:

If the operation for writing a value is successful, `[[Set]]` must return true; otherwise, it should return false.

If the operation for deleting a value is successful, `[[Delete]]` must return true; otherwise, it should return false.

When `[[GetPrototypeOf]]` is applied to the proxy object, it should return the same value as applying `[[GetPrototypeOf]]` to the target object. Naturally, their prototypes should be the same.

Other rules can be found in the [specifications for the internal methods of Proxy](https://tc39.es/ecma262/#sec-proxy-object-internal-methods-and-internal-slots).

# 2. Examples of Trap Usage

## 2.1. get Trap

The `get` trap executes when a property is read. It is defined in the form `get(target, property, receiver)`.

`target` is the object to which the operation will be directed, `property` is the property name, and `receiver` refers to the proxy object or any object inheriting from the proxy, which serves as the `this` context when the getter is invoked. The receiver can initially be omitted.

Let us print a message when the specified key does not exist in the object and return the key itself.

```js
let target = {};
let proxy = new Proxy(target, {
  get(target, property, receiver) {
    if (property in target) {
      return target[property];
    } else {
      console.log("no such property in the given target!");
      return property;
    }
  }
});

target[1] = "A";
// A
console.log(proxy[1]);
// no such ...
// 2
console.log(proxy[2]);
```

## 2.2. set Trap

The `set` trap is invoked when attempting to write a value to a property. It is defined as `set(target, property, value, receiver)`.

Naturally, `target` is the object to which the operation will be directed, `property` is the property name, `value` is the value to write to the property, and `receiver` is the same as in the `get` trap.

To ensure only numbers can be added to an array, the implementation can be as follows:

```js
let target = [];

let proxy = new Proxy(target, {
  set(target, property, value) {
    if (typeof value === "number") {
      console.log(value, "is added to the array!");
      target[property] = value;
      return true;
    } else {
      console.log("only number can be added to the array!");
      return false;
    }
  }
});
```

Methods like `push`, which internally use `[[Set]]`, will also function correctly with this proxy.

There is a rule to follow when using the `set` trap: if the operation for writing a value is successful, then `[[Set]]` must return true; otherwise, it must return false. Returning a falsy value will result in a `TypeError`.

## 2.3. has Trap

The `has` trap is invoked when the `in` operator is used. It is defined as `has(target, property)`.

You can perform specific validations for a property. For instance, the following code validates whether a value falls within a specified range when the `in` operator is invoked.

```js
let range = {
  start: 1,
  end: 10
};

range = new Proxy(range, {
  has(target, property) {
    return target.start <= property && property <= target.end;
  }
});

console.log(5 in range); // true
```

You can find further examples of trap usage on various reference pages.

# Limitations of Proxy

While proxies allow intercepting the operations of existing objects to perform additional tasks, they also have limitations. Proxies operate by intercepting the internal methods of objects, but some objects function differently through their own internal methods.

For instance, the `Map` object stores data in a special slot called `[[MapData]]`, and thus the proxy cannot effectively handle it.

# 3. Reflect

## 3.1. Basics of Reflect

`Reflect` offers a way to directly use internal methods similar to Proxy. However, it does not create new objects but allows us to use the internal methods of existing objects. It is neither a constructor function nor a class, so instances cannot be created, nor can it be invoked with `new`.

The methods of `Reflect` are identical to those provided in the handlers of `Proxy`. The first argument is the `target` on which to apply the internal methods, and the remaining arguments are aligned with the handlers of `Proxy`.

For example, `Reflect.get` allows using the `[[Get]]` internal method:

```js
const obj = {
  foo: 1,
  bar: 2,
};

console.log(Reflect.get(obj, "foo")); // 1
```

Of course, it can also be used alongside Proxy:

```js
const obj = {
  foo: 1,
  bar: 2,
};

const proxy = new Proxy(obj, {
  get(target, property) {
    console.log("get is called!");
    return Reflect.get(target, property);
  }
});
```

Call operators like `new` and `delete` can be invoked similarly through `Reflect.construct` and `Reflect.deleteProperty`.

However, these functionalities can be achieved without `Reflect`. For instance, accessing a property directly with `obj.foo` works without invoking `Reflect`. Therefore, let’s understand the advantages of using `Reflect`.

## 3.2. Advantages of Reflect

Consider an object that handles the `name` property. Suppose we fetch this property through a proxy object.

```js
let user = {
  _name: "김성현",
  get name() {
    return this._name;
  }
};

let userProxy = new Proxy(user, {
  get(target, property) {
    return target[property];
  }
});

console.log(userProxy.name); // 김성현
```

Once `userProxy` is created, it makes sense to use it instead of `user`. However, what happens if an object inherits from `userProxy`?

```js
let userOnline = {
  __proto__: userProxy,
  _name: "마녀",
};

// It seems that "마녀" should be returned, but "김성현" is shown.
console.log(userOnline.name);
```

Since `userOnline` does not have a `name` property, it resorts to the prototype `userProxy`, which returns `user`'s `name` due to its `get` trap being defined as `target[property]`.

Using `Reflect` helps solve this issue. By adjusting the `get` trap of `userProxy` to use `Reflect`, the `receiver` retains a proper reference to `this`, allowing `Reflect.get` to return `userOnline`'s `name` property correctly.

```js
let user = {
  _name: "김성현",
  get name() {
    return this._name;
  }
};

let userProxy = new Proxy(user, {
  get(target, property, receiver) {
    // Can also use return Reflect.get(...arguments)
    return Reflect.get(target, property, receiver);
  }
});

let userOnline = {
  __proto__: userProxy,
  _name: "마녀",
};
// Outputs "마녀"
console.log(userOnline.name);
```

# References

Modern JS Tutorial, Proxy and Reflect: https://ko.javascript.info/proxy

JavaScript Proxy. But now with Reflect added: https://ui.toast.com/posts/ko_20210413

JavaScript Proxy: https://yceffort.kr/2021/03/javascript-proxy