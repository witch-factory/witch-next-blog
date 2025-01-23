---
title: TS Exploring - Object vs object, Number vs number
date: "2023-09-16T00:00:00Z"
description: "Reasons why number and object are acceptable, but Number and Object should not be used."
tags: ["typescript", "javascript"]
---

# 1. Why can we use object but not Object?

When using TypeScript, there are times we utilize the types of built-in objects. For example:

```ts
const date: Date = new Date();
```

Additionally, due to the availability of the `[]` notation, it is a matter of personal preference, but we can also use the built-in object type `Array`.

```ts
const arr: Array<number> = [1, 2, 3];
```

It then follows that there are similar types for `Number` and `String`. Indeed, such types exist. However, as you may know when first learning TS, the primitive type representing numbers is `number`.

There is also the `Object` type, but we are advised to use `object` instead. Other primitive types we need to use are also written in lowercase. What is the difference?

# 2. Object

In JS, everything is an object. All objects ultimately have `Object` constructor's `Object.prototype` as their prototype, and for this reason, we can utilize the methods defined in `Object.prototype`. Thus, we can view all objects as extensions of `Object`.

The `Object` type signifies all objects created through any constructor function in the prototype chain of the `Object` constructor. All constructor functions in JS inherit from `Object`. Therefore, due to TypeScript's type characteristics, `Object` can include all JS objects except for null and undefined. Functions are also possible.

```ts
const foo: Object = (a: number) => a + 1;
```

## 2.1. Definition of Object type

How is the `Object` type defined? The `Object` type is defined in `node_modules/typescript/lib/lib.es5.d.ts` as follows, containing all methods that objects created through the `Object` constructor must have.

```ts
interface Object {
    /** The initial value of Object.prototype.constructor is the standard built-in Object constructor. */
    constructor: Function;

    /** Returns a string representation of an object. */
    toString(): string;

    /** Returns a date converted to a string using the current locale. */
    toLocaleString(): string;

    /** Returns the primitive value of the specified object. */
    valueOf(): Object;

    /**
     * Determines whether an object has a specified property name.
     * @param v A property name.
     */
    hasOwnProperty(v: PropertyKey): boolean;

    /**
     * Determines whether an object exists in another object's prototype chain.
     * @param v Another object whose prototype chain is to be checked.
     */
    isPrototypeOf(v: Object): boolean;

    /**
     * Determines whether a specified property is enumerable.
     * @param v A property name.
     */
    propertyIsEnumerable(v: PropertyKey): boolean;
}
```

## 2.2. Object Constructor type

However, there are also statically defined methods directly on the `Object` constructor function, such as `Object.keys()`. These are defined in the interface named `ObjectConstructor`, which creates an `Object` type when called with `new`.

We also see that `Object` is defined in relation to `Object.prototype`. This is necessary for objects created using this constructor to have `Object` as their prototype. If you need knowledge about prototype inheritance, it is covered in [JS Exploration - Prototype Syntax](https://witch.work/posts/javascript-prototype-grammar).

```ts
interface ObjectConstructor {
    new(value?: any): Object;
    (): any;
    (value: any): any;

    /** A reference to the prototype for a class of objects. */
    readonly prototype: Object;

    /* Other methods omitted for brevity */

    /**
     * Returns the names of the enumerable string properties and methods of an object.
     * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
     */
    keys(o: object): string[];
}
```

# 3. Wrapper Object Types

What then are types like `Number` and `String`? They represent all objects created through the respective constructor (used as wrapper objects). The constructor functions are defined as types like `NumberConstructor`.

## 3.1. Wrapper Object

Let's briefly return to JS. While programming in JS, one may encounter methods or properties that do not inherently belong to primitive values but can still be used, such as the string `"hello"` having properties like `length` or methods like `indexOf`. Where do these come from?

This is made possible by wrapper objects. When attempting to access properties or methods on primitives or literals, a wrapper object is created by calling the constructor of the relevant object. This wrapper object possesses the properties or methods of the original object, hence it can be utilized.

For example, in the following code, when accessing `str.length`, JS invokes `new String(str)` to create a wrapper object. It then retrieves the string length of 5 from this wrapper object.

```js
const str = "hello";
console.log(str.length); // 5
```

There are five types of such wrapper objects: `String`, `Number`, `BigInt`, `Boolean`, and `Symbol`. Each is an object created through constructors like `new String(~~)`.

## 3.2. Issues with Wrapper Object Types

Types like `Number` and `String` are all types of wrapper objects. More specifically, they represent the types of all objects created with the respective constructors. For instance, the `Number` type represents all numerical wrapper objects created using `new Number(number)`.

So why should we avoid using these wrapper object types? The issue arises because when we generally use primitives through variables, we want to access the data of the primitive value, not the wrapper object itself.

If we specify the type as these wrapper object types, we will face issues with even basic operations. For example, both are types of the number wrapper, and operations like addition do not exist between wrapper objects.

```ts
// Operator '+' cannot be applied to types 'Number' and 'Number'.
const a: Number = 3, b: Number = 4;
console.log(a + b);
```

However, methods that exist on the `Number` wrapper object, such as `toString`, can be used without issue.

```ts
const a: Number = 3;
console.log(a.toString());
```

Yet, in almost all cases where we are using a variable that is assigned a primitive value, there is virtually no need for the wrapper object. Even if there were, the wrapper object would be created as needed if the variable is defined with the primitive type. For these reasons, it is not advisable to use wrapper object types that impose limitations while removing necessary functionality.

# 4. Viewing Wrapper Objects

Typically, you can check the TypeScript type definition files located in `node_modules` to see these types directly and confirm that types like `Number` encompass objects created through their constructor.

## 4.1. Type Definition

For example, the `Number` type is defined in `node_modules/typescript/lib/lib.es2020.number.d.ts` as follows:

```ts
interface Number {
    /**
     * Converts a number to a string by using the current or specified locale.
     * @param locales A locale string, array of locale strings, Intl.Locale object, or array of Intl.Locale objects that contain one or more language or locale tags. If you include more than one locale string, list them in descending order of priority so that the first entry is the preferred locale. If you omit this parameter, the default locale of the JavaScript runtime is used.
     * @param options An object that contains one or more properties that specify comparison options.
     */
    toLocaleString(locales?: Intl.LocalesArgument, options?: Intl.NumberFormatOptions): string;
}
```

Other methods related to numbers, like `toFixed`, are also defined at the same location in `lib.es5.d.ts`.

In the case of strings, there are numerous changes and features across versions, resulting in definitions being spread across more files. In `lib.es5.d.ts`, many familiar string methods are defined as types. In fact, there are quite a few, but most of the string methods we know are defined.

```js
interface String {
    /** Returns a string representation of a string. */
    toString(): string;

    /* (omitted) */

    /**
     * Returns the position of the first occurrence of a substring.
     * @param searchString The substring to search for in the string
     * @param position The index at which to begin searching the String object. If omitted, search starts at the beginning of the string.
     */
    indexOf(searchString: string, position?: number): number;

    /* omitted */

    /** Returns the length of a String object. */
    readonly length: number;

    /* omitted */

    readonly [index: number]: string;
}
```

Furthermore, properties related to the string wrapper object are defined across files encompassing ES2015 changes, such as `lib.es2015.core.d.ts`, `lib.es2015.iterable.d.ts`, and well-known symbols defined in `lib.es2015.symbol.wellknown.d.ts`.

## 4.2. Constructor Function Type

The types of constructor functions are also defined in `lib.es5.d.ts`. For instance, the `NumberConstructor` is defined as follows. Similar to the `ObjectConstructor` above, it returns `Number` when called with `new`, and you can verify static properties like `MAX_VALUE` contained in the `Number` constructor (not the type).

It is personally interesting to note that `NaN` is defined as a property here.

```ts
interface NumberConstructor {
    new(value?: any): Number;
    (value?: any): any;
    readonly prototype: Number;

    /** The largest number that can be represented in JavaScript. Equal to approximately 1.79E+308. */
    readonly MAX_VALUE: number;

    /** The closest number to zero that can be represented in JavaScript. Equal to approximately 5.00E-324. */
    readonly MIN_VALUE: number;

    /**
     * A value that is not a number.
     * In equality comparisons, NaN does not equal any value, including itself. To test whether a value is equivalent to NaN, use the isNaN function.
     */
    readonly NaN: number;

    /* (omitted) */
}
```

# 5. Conclusion

Types of built-in objects that start with uppercase letters, such as `Number` and `Object`, encompass all objects created with their respective constructors.

However, primitive values like `Number` are rarely used for their wrapper objects, and `Object` can encompass too many types because all object constructors originally inherit from the `Object` constructor. Therefore, we prefer to use primitive types like `number` or types that only encompass objects, like `object`, according to our intended purposes.

## 5.1. Other Built-in Object Types

Other built-in objects such as `Array` or `Date`, which we observed previously, are objects by nature and are utilized for object purposes; therefore, it is acceptable to use the types they generate. This is why there is no separate type like `array`.

Even when you look in `lib.es5.d.ts`, `Array` is defined as a type that encompasses objects created by the constructor function `ArrayConstructor`, and `Date` encompasses objects created by `DateConstructor`. However, this poses no issue in this context, as array objects created with `new Array` serve as objects in and of themselves, rather than as wrappers.