---
title: JS Exploration - Why is the typeof null "object"?
date: "2023-12-23T00:00:00Z"
description: "The reason why JavaScript's typeof operator considers null as an object"
tags: ["javascript"]
---

This article begins with the question of why `typeof null` returns `"object"`. Thus, the process of finding the answer is summarized and documented.

# Summary

![typeof result table](./typeof-result.png)

- `null` was originally designed as a value representing the absence of an object reference.
- Additionally, early implementations of `typeof` did not have specific logic for checking `null`.
- Consequently, `typeof null` became established as `"object"`, and attempts to correct this later failed.

# 1. Introduction

JavaScript has a `typeof` operator that returns the type of its operand as a string. For example, `typeof 1` returns `"number"` and `typeof "hello"` returns `"string"`.

```javascript
typeof 1; // "number"
typeof "hello"; // "string"
```

However, `typeof null` returns `"object"`. It seems odd that a value representing nonexistence is classified as an object.

I discovered this fact over a year ago. Previously, when I sought the reasoning behind it, most documents only mentioned historical reasons. More thorough explanations can be found in the article “The History of ‘typeof null’” and its original texts.

Having studied a bit more of JavaScript's history since then, I can now add a few more points regarding the result of `typeof null`. Thus, this article is written with newly acquired insights included.

# 2. Historical Reasons

This section primarily references the following materials:

- "JavaScript: the first 20 years" authored by ECMAScript 6 editor Allen Wirfs-Brock and JavaScript creator Brendan Eich.
- Multiple tweets and insights from Brendan Eich.
- Articles by Axel Rauschmayer, who has written several books on JavaScript, explaining `typeof`, including comments from Brendan Eich.

---

The reason `typeof null` is `"object"` can be considered in two contexts. One is the historical significance mentioned in this section, and the other is a technical aspect.

From a historical standpoint, the reason `typeof null` is `"object"` is that `null` was initially created as a value indicating that an object reference, which should exist, is absent.

In JavaScript, there are two values that signify "nonexistence": `null` and `undefined`. Since these two are used similarly to indicate "nonexistence," distinguishing between them is a common interview question.

Of course, there are already many writings explaining the differences between these two due to their prominence as interview topics, and I am also preparing a separate article on this topic (TODO: add link when the article is written). So here, let’s focus on the essential points needed to answer our initial question.

> Why is `typeof null` `"object"`?

## 2.1. null and undefined

In many programming languages, there is a single value representing 'no value' or 'empty reference'. In Java, this is `null`, and in Python, it is `None`. (The existence of this "none" value can also cause many issues, but that deviates from the article's topic, so let's move on.) However, JavaScript has both `null` and `undefined`.

Other languages represent this "absence" with a single value, so why does JavaScript separate it into two? This is tied to JavaScript's history.

When JavaScript first emerged, it was designed as a supplementary language to Java for non-professionals. One of its main goals was to assemble web components created with Java Applets or C++. Therefore, early JavaScript had to have syntax similar to Java. More details on JavaScript's history can be found in other articles (currently being written).

Due to this requirement, JavaScript adopted several features from Java, including the distinction between primitive values and objects. Consequently, JavaScript aimed to differentiate between a lack of an assigned value and the absence of an object reference.

The problem arises because, in Java, there is only one value that indicates "absence," which is `null`. However, the static typing of variables allows for the differentiation of meanings based on whether an object reference is present or not. In contrast, JavaScript lacks static typing, and a single variable can hold both object references and values. Therefore, there was no way to discern whether `null` signified an unassigned value or the absence of an object reference.

Thus, `null` was defined as a value indicating that an object reference, which should be present, is missing, and `undefined` was created to indicate that no assigned value exists.

In other words, `null` was used in contexts where an object value was anticipated, representing "there is no object." This was derived from Java's `null` and facilitated integration with Java-implemented objects.

## 2.2. typeof

In JavaScript 1.1, operators like `delete`, `typeof`, and `void` were introduced. Among these, the `typeof` operator returns the primitive type of its operand as a string.

At the time `typeof` was first implemented, `typeof null` was `"object"`, and it remains the case today. This is because, as explained earlier, `null` represents the absence of an object reference.

Thus, while `null` itself is not an object, it can be seen as holding the meaning of an object, resulting in `typeof null` returning `"object"`.

However, the issue is that Java did not have an equivalent to `typeof` and simply used `null` as the default value for uninitialized variables. As previously mentioned, in Java, the distinction between whether `null` is an object or primitive is based on the static type of the variable, meaning there was not a built-in connotation of `null` as an object.

In summary, the implementation of `typeof` naturally developed from a specific background, but it did not exhibit an entirely rational behavior.

JavaScript creator Brendan Eich recalled that the value of `typeof null` was a manifestation of "Leaky Abstraction" in the early Mocha implementation of JavaScript. This refers to instances where understanding the implementation details is necessary due to gaps in abstraction.

# 3. Technical Reasons

There is also a different reason why `typeof null` returns `"object"`, which can be considered a technical bug. To understand this, one must look into how `undefined` and `null` are internally represented and how the `typeof` operator evaluates value types.

## 3.1. Implementation of undefined and null

As noted earlier, `null` represents a value indicating the absence of an object reference. Therefore, following the precedent in C where `NULL` pointers are defined as 0, `null` was defined as a value that is coerced to 0.

On the other hand, `undefined`, which signifies the absence of a primitive value, needed a representation that is neither a reference (since a reference would be an object) nor coerced to 0. Thus, `undefined` was defined as the special value $-2^{30}$.

Interestingly, due to this reason, in JavaScript today, `null` converts to 0, while `undefined` converts to NaN. This is because `undefined` is neither a reference nor coerced to 0!

```js
Number(undefined); // NaN
Number(null); // 0
```

[It is suggested that the choice to coerce `null` to 0 was a good decision](https://twitter.com/rauschma/status/332953297294086144). The automatic coercion of `null` to 0 seems to have been useful at the time.

Regardless, keep in mind that `null` converts to 0 and `undefined` to NaN, and let’s see how `typeof` evaluated these values.

## 3.2. Early Implementation of typeof

When the JavaScript prototype (originally named Mocha) was being developed in May 1995, values were stored using a C-style discriminated union.

A structure was created to hold a type tag and values stored within a union, and this tag determined how the union value would be interpreted.

The existing code is not present, but by synthesizing several materials, we can speculate that JavaScript values were likely structured as follows. [The engine was not open source and has never been publicly disclosed, so the exact implementation is unknown.](https://twitter.com/BrendanEich/status/226310723691741185)

```c
enum TypeTag {
    OBJECT,
    NUMBER,
    STRING,
    BOOLEAN,
};

struct Value {
    enum TypeTag tag;
    union {
        double number;
        char* string;
        struct Object* object;
        bool boolean;
    } value;
};
```

When actually reading the value, the tag was utilized to determine how to read it. For instance, a function titled `printValue` could be implemented like this:

```c
void printValue(struct Value* value) {
    switch (value->tag) {
        case NUMBER:
            printf("%f", value->value.number);
            break;
        case STRING:
            printf("%s", value->value.string);
            break;
        case OBJECT:
            printf("%p", value->value.object);
            break;
        case BOOLEAN:
            printf("%s", value->value.boolean ? "true" : "false");
            break;
    }
}
```

Thus, it is reasonable to assume that `typeof` was implemented to read the appropriate type string based on the tag.

How were the special values `undefined` and `null` implemented? As previously noted, `undefined` was a special value coerced to NaN and represented by $-2^{30}$, making it suitable for comparison. `null`, on the other hand, was equivalent to a NULL pointer, thus being 0.

However, `typeof` had no special processing logic for `null`. Given the requirement to resemble Java, combined with a mere ten days of prototyping time, the `null` value was simply assessed as an object due to the historical context.

Based on certain sources, it can be speculated that when `typeof` was implemented without specific logic for `null`, the tag value of `null` was treated as equivalent to `OBJECT`. As previously mentioned, `null` represented a value encompassing the meaning of an object. Consequently, `typeof null` yielded `object`.

```c
JS_TYPE typeof(struct Value* value) {
  JS_TYPE type = value->tag;
  JS_OBJECT* obj;

  if(JSVAL_IS_VOID(value)) {
    type = JS_TYPE_VOID;
  } else if(JSVAL_IS_NUMBER(value)) {
    type = JS_TYPE_NUMBER;
  } else if(JSVAL_IS_STRING(value)) {
    type = JS_TYPE_STRING;
  } else if(JSVAL_IS_BOOLEAN(value)) {
    type = JS_TYPE_BOOLEAN;
  } else if(JSVAL_IS_OBJECT(value)) {
    obj = JSVAL_TO_OBJECT(value);
    if(obj && ...function judgment logic...) {
      type = JS_TYPE_FUNCTION;
    }
    else{
      type = JS_TYPE_OBJECT;
    }
  }
  return type;
}
```

Alternatively, it could also be hypothesized that since the type tag for objects was 0, checking the tag value of a null structure, initialized to all bits 0, would yield a result equivalent to `OBJECT` (the `enum` in the previous code was crafted with this intent).

In this case, the code might resemble the following:

```c
JS_TYPE typeof(struct Value* value) {
  JS_TYPE type = JS_TYPE_VOID;
  JS_OBJECT* obj;

  switch (value->tag){
    case JS_TYPE_OBJECT:
    // As the tag is 0, the null structure initialized with all bits 0 falls in here
      obj = JSVAL_TO_OBJECT(value);
      if(obj && ...function judgment logic...) {
        type = JS_TYPE_FUNCTION;
      } else{
        type = JS_TYPE_OBJECT;
      }
      break;
    case JS_TYPE_VOID:
      type = JS_TYPE_VOID;
      break;
    case JS_TYPE_NUMBER:
      type = JS_TYPE_NUMBER;
      break;
    case JS_TYPE_STRING:
      type = JS_TYPE_STRING;
      break;
    case JS_TYPE_BOOLEAN:
      type = JS_TYPE_BOOLEAN;
      break;
  }
  return type;
}
```

Consequently, it came to be that in the early engine, `typeof null` was assessed as the `"object"` type.

# 4. Unresolved Bug

This was, of course, a bug, but it remained uncorrected for quite some time.

## 4.1. Introduction of Type Tags

In 1996, efforts began to eliminate the technical debt of the initial JavaScript implementation for standardization and other purposes. During this period, the method of representing values transitioned from discriminated unions to tagged pointers, and the new engine was released under the name "SpiderMonkey."

This engine did not use discriminated unions. Instead, it employed tagged pointers that included a tag indicating the type of value. The values were stored in 32-bit units, with the first 1 to 3 bits serving as type tags and the remaining bits storing actual values or references.

There were five types of type tags:

- 000: object, with the data being a reference to an object.
- 1: integer, with the data being a signed 31-bit integer.
- 010: float, with the data being a reference to a double precision floating-point number.
- 100: character, with the data being a reference to a character.
- 110: boolean, with the data being true or false.

Thus, the lowest bit of the type tag determined its length; if the bit was 110, the lowest bit was 0, indicating a length of 1; if the lowest bit was 0, the tag length was 3, thus representing four types (using 2 bits).

This included the special value for `undefined`, represented as $-2^{30}$, and the NULL pointer (actually 0) corresponding to `null`.

## 4.2. New Implementation of typeof

In this engine, the implementation of `typeof` changed as well. It now determined the appropriate type string based on the type tag. However, the issue was that there was no explicit logic to check for the value of `null`.

Since `null` is represented as 0, checking the type tag of `null` would naturally yield 0, corresponding to the object type tag. The following code outlines how `typeof` was executed, providing an explanation for why `null`, or the value 0, is determined to be `"object"`.

```c
JS_PUBLIC_API(JSType) JS_TypeOfValue(JSContext *cx, jsval v) {
    JSType type = JSTYPE_VOID;
    JSObject *obj;
    JSObjectOps *ops;
    JSClass *clasp;

    CHECK_REQUEST(cx);
    if (JSVAL_IS_VOID(v)) {  // (1)
        type = JSTYPE_VOID;
    } else if (JSVAL_IS_OBJECT(v)) {  // (2)
        obj = JSVAL_TO_OBJECT(v);
        if (obj &&
            (ops = obj->map->ops,
              ops == &js_ObjectOps
              ? (clasp = OBJ_GET_CLASS(cx, obj),
                clasp->call || clasp == &js_FunctionClass) // (3,4)
              : ops->call != 0)) {  // (3)
              // Check if it is a function or class
            type = JSTYPE_FUNCTION;
        } else {
            type = JSTYPE_OBJECT;
        }
    } else if (JSVAL_IS_NUMBER(v)) {
        type = JSTYPE_NUMBER;
    } else if (JSVAL_IS_STRING(v)) {
        type = JSTYPE_STRING;
    } else if (JSVAL_IS_BOOLEAN(v)) {
        type = JSTYPE_BOOLEAN;
    }
    return type;
}
```

In line `(1)`, it checks if the value is `undefined`. In line `(2)`, it checks if the value is an object. Given that the type tag of `null` is 0, it naturally proceeds to line `(2)` and ultimately determines the returned type as `JSTYPE_OBJECT`, since `null` cannot have any function or class properties.

This could have provided a filter to identify `null`, but due to the rush of development, such logic was omitted. Thus, `null` was evaluated as `"object"` in `typeof`.

```c
#define JSVAL_IS_NULL(v)  ((v) == JSVAL_NULL)
```

In summary, the implementation of the `typeof` operator involved reading specific tag values contained within the values. `null`, with a tag value that indicated an object type, returned `"object"` without any special handling logic.

As everyone knows, this has caused significant confusion for those seeking to ascertain whether a value is genuinely an object through the `typeof` operator. After all, the expression `typeof obj === "object"` also returns true when `obj` is `null`, leading to runtime errors when accessing properties of `null`.

# 5. Conclusion

> "I think it is too late to fix typeof. The change proposed for typeof null will break existing code."

This was undeniably a bug, and attempts to rectify it have been proposed several times since. However, due to an excessive amount of existing code relying on that behavior of `typeof`, it became challenging to introduce a breaking change.

Notably, even Brendan Eich acknowledges the fact that the behavior of `typeof null === "object"` is a bug. Yet, fixing this issue now would disrupt too much existing code. Therefore, it has been suggested to gradually deprecate `typeof` rather than correct it immediately.

# References

“The History of ‘typeof null’” https://github.com/FEDevelopers/tech.description/wiki/%E2%80%9Ctypeof-null%E2%80%9D%EC%9D%98-%EC%97%AD%EC%82%AC

NaN and Infinity in JavaScript https://2ality.com/2012/02/nan-infinity.html

Categorizing values in JavaScript https://2ality.com/2013/01/categorizing-values.html

JavaScript history: undefined https://2ality.com/2013/05/history-undefined.html

JavaScript quirk 1: implicit conversion of values https://2ality.com/2013/04/quirk-implicit-conversion.html

JavaScript quirk 2: two “non-values” – undefined and null https://2ality.com/2013/04/quirk-undefined.html

The history of “typeof null” (and comments from Brendan Eich) https://2ality.com/2013/10/typeof-null.html

Brendan Eich's tweet on the presence of both undefined and null https://twitter.com/rauschma/status/333252517628628992

JavaScript types and data structures https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures

JavaScript: the first 20 years https://dl.acm.org/doi/10.1145/3386327, pages 12-13

Is conversion from null to int possible? https://stackoverflow.com/questions/6588856/conversion-from-null-to-int-possible

Leaky Abstraction in development http://rapapa.net/?p=3266

C/C++ Tagged/Discriminated Union https://medium.com/@almtechhub/c-c-tagged-discriminated-union-ecd5907610bf