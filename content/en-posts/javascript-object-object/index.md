---
title: Exploring JavaScript - Why [object Object] Appears
date: "2023-02-09T05:00:00Z"
description: "An inquiry into why [object Object] appears when converting an object to a string."
tags: ["javascript"]
---

# 1. Introduction

While working with JS, you often encounter the output `[object Object]`. For example, this appears when an object is converted to a string.

```js
let obj = { a: 1, b: 2 };
alert(obj);
```

However, the `[object Object]` result from using `toString` does not seem appealing. Why does the object convert to such a string? The output of `JSON.stringify` looks much more convincing.

```js
let obj = {
  a: 1,
  b: 2,
};
console.log(JSON.stringify(obj));
// {"a":1,"b":2}
```

So, why does converting an object to a string result in `[object Object]`? This is due to the operation of `Object.prototype.toString`.

# 2. Reason for Calling Object.prototype.toString

All objects that do not have a specifically defined prototype have `Object.prototype` as their prototype. Therefore, the `[[Prototype]]` of the above `obj` object is `Object.prototype`. At this point, `Object.prototype` has no prototype.

Various methods, including `toString`, are implemented in `Object.prototype`. Consequently, all objects, including the aforementioned `obj`, use `toString` during string conversion. The output of that method is `[object Object]`.

## 2.1. What Is Object.prototype.toString?

This method returns the class name of the object passed as an argument and is called in contexts where a string value is expected, such as in `alert`.

Among the types available in JS—boolean, null, undefined, number, string, symbol, BigInt, and object—all types except null and undefined are instances of Object. Therefore, via prototype chaining, methods from Object.prototype can be used.

# 3. How Object.prototype.toString Works

This method checks the class type of the incoming value and provides that information. The ECMAScript specification describes the functioning of `toString` as follows:

![ecma6](./ecma6_toString.png)

Although this may have some shortcomings, it can be interpreted as follows:

1. If the value of `this` is undefined, it returns "[object Undefined]."
2. If the value of `this` is null, it returns "[object Null]."
3. It converts this to an object using ToObject(this). The behavior of this function is summarized [here](https://witch.work/posts/dev/javascript-spread-object#4.2.1.-CopyDataProperties).
4. It checks if ToObject(this) is an array; if so, it sets the builtinTag to "Array." At this point, it calls ReturnIfAbrupt(isArray) for error checking. For detailed information about ReturnIfAbrupt, refer to [here](https://ui.toast.com/posts/ko_20221116_1).
5. For other types, it sets the builtinTag appropriately according to the type. For instance, if it's a string, it sets it to "String"; if it's a function, it sets it to "Function," and so forth.
6. If the object has a well-known symbol key called Symbol.toStringTag, it sets the value of this key as tag; otherwise, it uses builtinTag as tag.
7. It returns "[object " + tag + "]".

Moreover, various distinctions between objects can be noted based on internal slots. The omitted details from step 4 above are as follows. This complex method is intended for backward compatibility with the existing `[[Class]]` internal slots. More detailed explanations can be found in the appendix below.

- If it is an exotic String object, it returns String.
- If there is a `[[ParameterMap]]` internal slot, it returns Arguments—an array-like object that holds function arguments.
- If there is a `[[Call]]` internal slot, it returns Function.
- If there is a `[[ErrorData]]` internal slot, it returns Error.
- If there is a `[[BooleanData]]` internal slot, it returns Boolean.
- If there is a `[[NumberData]]` internal slot, it returns Number.
- If there is a `[[DateValue]]` internal slot, it returns a Date object.
- If none of these apply, it simply returns Object.

Since this manipulates `this`, you can test the above specification using `call`.

```js
function test(obj) {
  console.log(Object.prototype.toString.call(obj));
}

test(undefined); // [object Undefined]
test(null); // [object Null]
test([1, 2]); // [object Array]
test("test"); // [object String]
(function () {
  // [object Arguments]
  test(arguments);
})();
test(function () {}); // [object Function]
test(new RangeError()); // [object Error]
test(true); // [object Boolean]
test(1); // [object Number]
test(new Date()); // [object Date]
test(/a-z/); // [object RegExp]
test({}); // [object Object]
```

# 4. Interpretation of Object.prototype.toString Appendix

The specification also contains an appendix. Let's interpret this.

```
Historically, this function was occasionally used to access the String value of the [[Class]] internal slot that was used in previous editions of this specification as a nominal type tag for various built-in objects. The above definition of toString preserves compatibility for legacy code that uses toString as a test for those specific kinds of built-in objects. It does not provide a reliable type testing mechanism for other kinds of built-in or program defined objects. In addition, programs can use @@toStringTag in ways that will invalidate the reliability of such legacy type tests.
```

In ECMAScript 5 (ECMA5), every object had a `[[Class]]` internal property, representing a string that indicated the classification of the object. For instance, if an object was a string, it would store "String".

Since this internal string existed for every object, the `toString` method in ECMA5 simply returned "[object " + tag + "]" based on this string. The method logic was straightforward.

![ecma5](./ecma5_toString.png)

However, starting with ECMA6, the `[[Class]]` internal property was removed. To maintain backward compatibility for legacy code using `toString` to differentiate between specific built-in object types, the complex method for determining `builtinTag` emerged.

Nonetheless, this approach is intended for legacy code and does not provide a reliable type-checking mechanism for other built-in or user-defined objects. Additionally, programs using `@@toStringTag` can invalidate the credibility of such legacy type tests.

# 5. Customizing toString

As can be inferred from the appendix above, using `@@toStringTag` allows for customization of `toString`.

You can also simply override `toString` without using anything special.

```js
function Person(name) {
  this.name = name;

  this.toString = function () {
    return this.name;
  };
}

let me = new Person("김성현");
console.log(me.toString());
// 김성현
```

But can this be done better? Using `@@toStringTag` is the key. According to the specification above, when `toString` returns "[object " + tag + "]", tag is the value assigned by default. It provides a primary description string for the object.

```js
function Person(name) {
  this.name = name;

  this[Symbol.toStringTag] = name;
}

let me = new Person("김성현");
console.log(me.toString());
// [object 김성현]
```

Although it looks somewhat unappealing with the square brackets and object string combined, it successfully overrides the original method! However, using this for type checking requires clean parsing of the tag from the `[object tag]` format, indicating that additional work is necessary.

It remains to be seen whether this will be practically useful, but JS's built-in objects utilize this feature.

```js
function test(obj) {
  console.log(Object.prototype.toString.call(obj));
}

test(new Map()); // [object Map]
test(function* (a) {
  // [object GeneratorFunction]
  yield a;
});
test(new Set()); // [object Set]
test(new WeakMap()); // [object WeakMap]
test(Promise.resolve()); // [object Promise]
```

Furthermore, it has been reported that browsers now support `@@toStringTag` for DOM prototype objects as well.

```js
const button = document.createElement("div");
console.log(button.toString()); // [object HTMLDivElement]
console.log(button[Symbol.toStringTag]); // HTMLDivElement
```

The `typeof` operator returns `undefined`, `boolean`, `string`, `number`, `symbol`, `bigint`, `function`, and `object` based on the specification. However, `toString` can detect a significantly greater variety of objects and supports customization. Therefore, if a comprehensive type check is needed, utilizing `toString` may be worth considering.

# 6. Conclusion

Ultimately, the reason why a generic object converts to a string such as `[object Object]` is due to the behavior of `Object.prototype.toString`.

(Added on 2023.10.13)

# 7. Cases When toString() Is Called Implicitly

Property keys of an object can only be strings or symbols. However, we know that using numbers as keys is still permissible in objects, including TypeScript. How is this possible?

When a value that is not a string or symbol is used as an object property key, it is automatically converted to a string. For example, the following code shows that when `{}` is used as an object key, `toString()` is automatically called, and its result is used as the key.

```ts
const obj={};
obj[{}]=1;
obj; // { '[object Object]': 1 }
obj['[object Object]']=2;
obj[{}]; // 2
```

# References

https://medium.com/%EC%98%A4%EB%8A%98%EC%9D%98-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BF%ED%8A%B8%EC%97%90%EC%84%9C-object-object-%EA%B0%80-%EB%8C%80%EC%B2%B4-%EB%AD%98%EA%B9%8C-fe55b754e709

http://xahlee.info/js/js_Object.prototype.toString.html

https://stackoverflow.com/questions/35900557/is-there-away-to-change-the-internal-class-property-of-a-javascript-object

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag

`Object.create` https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/create