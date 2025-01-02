---
title: JS Exploration - The Operation of Spread Syntax
date: "2023-01-22T00:00:00Z"
description: "Exploration Journal of Spread Syntax"
tags: ["javascript"]
---

# 1. Spread Syntax

The syntax known as spread `...` can be applied to iterable objects such as arrays and strings. It allows expansion of iterable objects when used in contexts where a variable number of arguments is expected, such as in function calls or within array literals.

For example, spread syntax can be used to pass all elements of an array as function arguments.

```js
const numbers = [1, 3, -8, 37, 5, -324, 623];

console.log(Math.max(...numbers)); //623
```

It can also be used with object literals, where spread syntax enumerates the properties of an object and adds key-value pairs to the new object being created.

This differs from the rest syntax. While both use `...`, the rest syntax gathers multiple elements into a single element (an array). The `...` discussed here refers to the role of elements spread (SpreadElement) for example in `let arr=[a,b,...c]`, which expands the iterable into a new iterable, and argument spread, `func(a,b,...c)`, which expands the iterable to pass elements individually as function arguments.

# 2. Is it the Spread Operator?

Searching online, one can find many documents referring to the spread operator. However, this is by no means an operator. Here are the reasons:

## 2.1. Failure to Meet Operator Conditions

An operator fundamentally receives arguments and evaluates them to yield a single value. The result can either be a simple value (rvalue) or an object that allows assignment (lvalue). For instance, `2+3` takes the arguments 2 and 3 and evaluates to the result of 5.

However, `...` does not evaluate to a single value. `...arr` unfolds the elements of the iterable `arr` and ultimately evaluates to multiple values. Therefore, `...` does not meet the basic condition of being an operator.

Moreover, `...` cannot be used in isolation. It can only be used in the context of arrays or function calls. It is only in those contexts that `...` can accept multiple values as inhabitants of arrays or objects. Using it in other contexts is not permissible. For example, the following code will produce an error related to `...`.

```js
let a=[1,2,3];
b=...a;
```

If `...` were an operator, it could naturally be used alone in conjunction with its operands. This inability to stand alone further supports that `...` is not an operator.

## 2.2. As per the Standards

If `...` were an operator, it would be a unary prefix operator. However, a thorough search of the [unary operators section](https://tc39.es/ecma262/#sec-unary-operators) of the ECMA specification fails to mention `...`. Certainly, in other content regarding operators, `...` is absent. The standard is based on when `...` was first introduced.

`...` is referenced solely in the parts pertaining to array literals and function calls. It can only be used in such contexts. Hence, the standard does not classify `...` as an operator and states that it can only be used in specific contexts.

However, as mentioned, operators should be able to function in isolation, which invalidates `...` as an operator.

## 2.3. Variation in Functioning Based on Context

Operators always function consistently. The result of `2+3` will be the same regardless of the context in which it is applied. However, it is well-known that the `...` syntax can be interpreted as spread or rest arguments.

```js
const arr=[1,2,3];
console.log(Math.max(...arr)); // Used as spread
console.log([...arr]);
function foo(arg1, ...rest){} // Used as rest
```

This means that how `...` operates varies based on the context it is used in. Sometimes it spreads elements, and other times it collects them. Operators should not exhibit variability in execution results based on context.

For the reasons outlined above, it is more appropriate to refer to `...` as spread syntax rather than a spread operator. Some suggest using the term syntax, but whatever terminology is employed, it remains true that it is not an operator.

## 2.4. Why is the Term "Spread Operator" Used?

The usage of `...a` may resemble a unary prefix operator. Furthermore, it is speculated that as official documentation lacks a specific name for passing function arguments with `...`, the term 'spread operator' was coined by individuals to denote it.

# 3. Functioning with Arrays

Assuming `...` is utilized to unfold elements from an iterable for purposes such as SpreadElement when within function calls or array literals, what are its internal mechanics?

When `...args` is detected, the JavaScript engine attempts to access the iterator for `args`. This is part of the iterator protocol, defined via `Symbol.iterator`. If `args` is not an iterable object, a type error will be thrown. Objects literals are an exception, which will be explained separately.

```js
console.log(...100);
```

Since 100 is not iterable, an error is expected. The error message clearly indicates that `Symbol.iterator` is required for the use of `...`.

```
Uncaught TypeError: Spread syntax requires ...iterable[Symbol.iterator] to be a function
```

In any case, when `...args` is triggered, the engine accesses the iterator of `args` and calls `iterator.next` until the iteration is complete. For example, consider the following code.

```js
let cnt = 1;

const it = {
    [Symbol.iterator]() {
        const arr = ["김", "성", "현"];
        let idx = arr.length;
        console.log("Iterator called");
        return {
            next() {
                console.log(cnt++);
                return {
                    value: arr[--idx],
                    done: idx < 0
                }
            }
        }
    }
}

function func() {}

let temp = [...it];
console.log(temp);
func(...it);
```

The execution result of this code indicates that when the JavaScript engine detects `...it`, it calls the `Symbol.iterator` of `it`, repeatedly invoking `next` until completion. The order in which `arr` is stored in `temp` supports this. This operates similarly to `for..of`.

![exec1](./iterator_exec.PNG)

# 4. Object Spread

Until now, we have discussed `...` being applicable only to iterables. However, consider the following code.

```js
let me = {
    name: "김성현",
    blog: "witch.work"
}

let meCopy = { ...me };
console.log(meCopy); // Object copied successfully
```

The `me` object does not contain anything like `Symbol.iterator`. Nevertheless, we observe the successful operation of spread. How is this possible?

This functionality stems from the proposal for spread properties, which allows the syntax for spreading to be used with object literals, now accepted for implementation. So, what internal mechanics does this involve?

Before examining the proposal, let’s understand what object spreading means by looking at the proposal document.

## 4.1. Basics

### 4.1.1. Rest Syntax

The rest property syntax gathers those properties within destructured assignments that are not yet assigned and have the enumerable attribute. The key-value pairs are copied.

```js
let temp = {
    x: 1,
    y: 2,
    z: 3,
    a: 6,
    b: 7,
}

let { x, y, ...rest } = temp;
let { ...c } = temp; // c copies temp
console.log(x, y, rest); // 1 2 { z: 3, a: 6, b: 7 }
console.log(c, temp);
console.log(c === temp); // c is a copy of temp, so false
```

This, however, does not imply deep copying. Inner objects are referred and copied.

```js
let temp = {
    x: 1,
    y: 2,
    z: 3,
    obj: {
        a: 10, b: 20,
    }
}

let { ...t } = temp;
console.log(t === temp);
console.log(t.obj === temp.obj); 
// true, as t is a shallow copy of temp
```

This syntax can also be applied in function declarations. When an object is passed as an argument to a function, properties of that object whose keys correspond to the function parameter names are automatically passed as arguments. The remaining properties are gathered into the `...` argument.

In the following code, `temp`, which is passed to the `foo` function, has its `x` and `y` properties destructured and assigned because they share the same name as the function parameters. The remaining properties are stored as `rest`.

```js
let temp = {
    x: 1,
    y: 2,
    z: 3,
    a: 12,
    b: 17,
}

function foo({ x, y, ...rest }) {
    console.log(x, y, rest);
}

foo(temp); // 1 2 { z: 3, a: 12, b: 17 }
```

Additionally, an object created via this rest syntax can be reorganized using spread.

```js
let temp = {
    x: 1,
    y: 2,
    z: 3,
    a: 12,
    b: 17,
}

let { x, y, ...rest } = temp;
let reassembled = { x, y, ...rest };
console.log(reassembled);
```

It is also worth noting that when used as rest syntax, prototype chaining is applied, hence the two cases below are not equivalent.

```js
let { x, y, ...z } = a;
// is not equivalent to
let { x, ...n } = a;
let { y, ...z } = n;
// because x and y use the prototype chain
```

### 4.1.2. Spread Syntax

Spreading creates a shallow copy of the object.

```js
let objCopy = {...obj}
```

This can also be performed using `Object.assign` as follows:

```js
let objCopy = Object.assign({}, a);
```

Of course, it can be used to merge two objects.

```js
let ab = {...a, ...b}
```

Further, properties of the spread object can be combined with additional properties.

```js
let temp = {
    x: 1,
    y: 2,
    z: 3,
    a: 12,
    b: 17,
}

let objWithDefaults = { x: 10, y: 20, k: 5, ...temp };
console.log(objWithDefaults);
```

## 4.2. Functioning Mechanism

Now, when spreading an object, what mechanism is used? Since non-iterable objects cannot utilize `Symbol.iterator`, the abstract operation defined in ECMAScript known as [CopyDataProperties](https://tc39.es/ecma262/#sec-copydataproperties) is employed. The operation takes the following form:

```js
CopyDataProperties(target, source, excludedItems)
```

Here, the source is copied to the target, excluding the specified excludedItems. Let’s delve into the details of this process.

### 4.2.1. CopyDataProperties

Here’s how this function operates.

Firstly, if the source is null or undefined, the function concludes and simply returns the target.

The next step converts the source to an object using `ToObject(arg)`, wherein this action encompasses the following:

1. If `arg` is null or undefined, a TypeError occurs. However, since we've preemptively filtered out these cases for source, it is not an issue.

2. If `arg` is a boolean, number, string, symbol, or BigInt, a corresponding object type is created with its internal slot set to `arg`. For instance, if `arg` is of Number type, a Number object is created with its internal `[[NumberData]]` slot set to the `arg`, which is then returned.

3. If `arg` is an object, it is simply returned.

All enumerable elements from the object returned by ToObject(source) are subsequently written to the target. Thus, the target becomes a new object containing a shallow copy of all enumerable elements from the source.

### 4.2.2. Example of Mechanics

In summary, object spread operates as follows: the spread target is first converted into an object. Enumerable elements from the converted object are then shallowly copied into the spread position. It works seamlessly with regular objects.

```js
let temp = {
    x: 1,
    y: 2,
    z: 3,
    a: 12,
    b: 17,
}

let obj = { ...temp };
console.log(obj);
```

However, closely analyzing the above operation reveals that any type that can go into the ToObject can be a spread target. If null or undefined is spread, during the operation `CopyDataProperties` detects the source as null/undefined and concludes without any action, leading to no change.

```js
let obj = { ...null, ...undefined };
console.log(obj); // Empty object
```

Moreover, wrapper objects for numbers, booleans, and symbols have no properties, hence spreading these results in no changes.

```js
let obj = { ...1, ...true, ...Symbol() };
console.log(obj); // Empty object
```

However, the wrapper object for strings has properties that are index-character pairs with the character at the respective index being enumerable. Therefore, spreading results in an object consisting of index-character pairs of the string.

```js
let obj = { ..."witch" };
console.log(obj); // {0: 'w', 1: 'i', 2: 't', 3: 'c', 4: 'h'}
```

Manipulating the enumerable flags of specific properties in an object can also prevent them from being included in the spread.

```js
let obj1 = {
    x: 1,
    y: 2,
}

let obj2 = Object.defineProperties({}, {
    name: {
        value: "김성현",
        enumerable: true,
    },
    blog: {
        value: "witch.work",
        enumerable: false,
    },
    age: {
        value: 26,
        enumerable: true,
    }
});

// {x: 1, y: 2}
console.log({ ...obj1 });
// {name: '김성현', age: 26}
// Non-enumerable items are excluded
console.log({ ...obj2 });
```

# 5. Conclusion

The use of `...` on iterables invokes the iterator protocol, namely `Symbol.iterator`, to copy elements from the iterable one by one.

The spread of an object relies on the abstract operation `CopyDataProperties` for a shallow copy of enumerable elements from the object.

# References

Proposal for Object Spread: https://github.com/tc39/proposal-object-rest-spread

Spread is not an operator: https://stackoverflow.com/questions/44934828/is-it-spread-syntax-or-the-spread-operator/44934830#44934830

Stack Overflow Q&A explaining object operation: https://stackoverflow.com/questions/64603492/i-dont-understand-about-spread-syntax-inside-objects

Basic understanding of spread: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax

About property flags: https://javascript.info/property-descriptors

Distinctions regarding the use of `...`: https://stackoverflow.com/questions/37151966/what-is-spreadelement-in-ecmascript-documentation-is-it-the-same-as-spread-synt/37152508#37152508