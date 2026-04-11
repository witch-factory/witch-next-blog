---
title: Modern JavaScript Tutorial Part 1.5 Data Structures and Data Types - 2
date: "2023-01-15T00:00:00Z"
description: "ko.javascript.info part 1-5 second section"
tags: ["javascript"]
---

# 1. Map and Set

## 1.1. Map

Map stores data in a key-value format. Unlike objects, it allows various data types as keys. You can also use objects as keys. The following methods are available:

- new Map()
- map.set(key, value): Returns the map itself, allowing for chaining.
- map.get(key): Returns undefined if the key does not exist.
- map.has(key)
- map.delete(key)
- map.clear()
- map.keys()
- map.values()
- map.entries()

There is also a size property to determine the size of the map.

You can access or set values using `map[key]`, but this treats the map like a regular object, so it's better to use get and set.

A map iterates in the order of insertion and supports forEach.

### 1.1.1. Objects and Maps

You can convert an object to a map using `Object.entries(obj)`. This method returns the object's key-value pairs as an array, which can be passed to the map constructor.

You can convert a map back to an object using `Object.fromEntries(map)`. This method takes an array of elements in the form of [key, value] and creates an object. Thus, passing map.entries() to Object.fromEntries converts the map back to an object.

## 1.2. Set

A set is a collection of values that does not allow duplicates. While similar to a map in that sets do not allow duplicates, they differ in that they store only values, not key-value pairs. A set supports the following methods:

Since a set does not allow duplicates, inserting the same value multiple times will only store one instance.

- new Set(iterable)
- set.add(value): Returns the set itself, allowing for chaining.
- set.delete(value)
- set.has(value)
- set.clear()
- set.keys()
- set.values(): Is the same as set.keys(). Exists for compatibility with maps.
- set.entries(): Exists for compatibility with maps; returns in [value, value] format.

It also supports for..of and forEach.

Additionally, you can convert a set to an array using Array.from.

* The keys and values methods of maps and sets return iterable objects rather than arrays. Therefore, you must use Array.from to convert them to arrays.

## 1.3. WeakMap and WeakSet

WeakMap and WeakSet are similar to Map and Set, but with key differences. WeakMap and WeakSet can only store objects; non-object primitive values cannot be stored.

Using WeakMap and WeakSet makes the object used as a key eligible for garbage collection. This means that if there are no other references to the object used as a key in a WeakMap or WeakSet, that key object is deleted.

WeakMap and WeakSet support the following methods. They do not support methods like keys or properties like size due to garbage collection.

Since garbage collection is unpredictable, it is not possible to determine what keys a WeakMap/WeakSet currently has or how many.

- new WeakMap()
- weakMap.set(key, value)
- weakMap.get(key)
- weakMap.delete(key)
- weakMap.has(key)

- new WeakSet()
- weakSet.add(value)
- weakSet.delete(value)
- weakSet.has(value)

WeakMap and WeakSet can be useful for assigning properties to objects belonging to external code. When the external object disappears, any associated properties will automatically vanish as well.

# 2. keys, values, entries

The keys(), values(), and entries() methods can be used with maps, sets, and array objects. Similar functionality for regular objects is as follows:

- Object.keys(obj): Returns an array of an object's keys.
- Object.values(obj): Returns an array of an object's values.
- Object.entries(obj): Returns an array of an object's [key, value] pairs.

For maps, sets, and array objects, methods like keys return iterable objects different from arrays, while Object.keys for regular objects returns actual arrays. Hence, you can use for..of on the return values of Object.xxx methods. Note that these methods ignore symbol-type keys among the object's properties.

In JavaScript, since complex structures are all based on objects, separate keys, values, and entries methods were created for objects. Therefore, Object.keys, Object.values, and Object.entries were developed as methods for regular objects.

## 2.1. Using Array Methods on Objects

Array-specific methods like map and filter cannot be used directly on objects. Instead, you can do the following:

```js
let prices = {
  apple: 0.67,
  orange: 1.49,
  banana: 0.39,
  grape: 2.79,
  pear: 1.29,
};

// Create an array of key-value pairs and apply filter
let overOneBill = Object.entries(prices).filter(
  ([key, value]) => value > 1.0
);
// Create an object again from the key-value pairs array
overOneBill = Object.fromEntries(overOneBill);
console.log(overOneBill);
```

# 3. Destructuring Assignment

## 3.1. Array Destructuring Assignment

Destructuring assignment allows you to unpack values from arrays or properties from objects into distinct variables. You can use `[]`.

```js
let blog = ["witch", "work"];
let [first, second] = blog;
console.log(first, second); //witch work
```

To ignore unnecessary elements, you can use commas to skip them.

```js
let myName = ["Kim", "Sung", "Hyun"];
let [first, , third] = myName; // The second element is skipped
console.log(first, third);
```

On the right side of the assignment, any iterable object can be used with for..of. The left side can contain anything assignable, including object properties.

For instance, since strings are also iterable objects, you can destructure them.

```js
let [first, second] = "hi";
console.log(first, second); //h i
```

Destructuring assignment can even be used in loops.

```js
let me = {
  name: "Kim Sung Hyun",
  age: 26,
  hobby: "coding",
};

// Returns an array of [key, value] for properties of me
console.log(Object.entries(me));
// Iterates over Object.entries(me) and prints each key and value
for (let [k, v] of Object.entries(me)) {
  console.log(k, v);
}
```

If the number of variables you are trying to assign exceeds the length of the array, no error occurs, but the surplus variables will be assigned undefined. You can prevent this by using `=` to set default values.

When item values are not available for destructuring, defaults can be assigned. If there is an assignable value, then the default is not assigned.

```js
let arr = ["Kim Sung Hyun"];

let [first = "1", second = "2"] = arr;
// Kim Sung Hyun 2
console.log(first, second);
```

## 3.2. Object Destructuring Assignment

To destructure an object, use `{}`. Place the object to be destructured on the right and the corresponding property patterns on the left. It looks like this:

```js
let me = {
  name: "Kim Sung Hyun",
  age: 26,
  hobby: "coding",
};
/* Properties with corresponding keys are assigned, so order doesn't matter.
Using let {age, name, hobby} produces the same result. */
let { name, age, hobby } = me;
// Kim Sung Hyun 26 coding
console.log(name, age, hobby);
```

However, if the variable names you wish to store the property values into differ from the property keys, you can use `:`. Use the format `propertyKey: variableName`.

```js
let me = {
  name: "Kim Sung Hyun",
  age: 26,
  hobby: "coding",
};

let { age: myAge, name: myName, hobby: myHobby } = me;
// Kim Sung Hyun 26 coding
console.log(myName, myAge, myHobby);
```

You can set default values using `=`, similarly as in array destructuring. The rest operator can also be used in the same way.

```js
let me = {
  name: "Kim Sung Hyun",
  age: 26,
  hobby: "coding",
};

let { age: myAge, ...rest } = me;
// 26, {name: "Kim Sung Hyun", hobby: "coding"}
console.log(myAge, rest);
```

Destructuring assignment can also be done on existing variables. However, if the `{}` is not used within an expression and instead placed directly in the main flow of code, it is recognized as a code block. Thus, to destructure into existing variables, you must wrap the assignment statement in parentheses.

```js
let me = {
  name: "Kim Sung Hyun",
  age: 26,
  hobby: "coding",
};

let age, name, hobby;
// Use parentheses to indicate it's not a code block
({ age: myAge, ...rest } = me);
// 26, {name: "Kim Sung Hyun", hobby: "coding"}
console.log(myAge, rest);
```

You can also destructure more complex objects as long as the structure matches.

# 4. Date Object

The Date object is used for handling dates and times and can be created with `new Date()`. If no arguments are passed to the constructor, it creates a Date object representing the current time. Let's explore how to utilize this.

## 4.1. Creating a Specific Date Object

`new Date(ms)` creates and returns a Date object that stores the point in time that is `ms` milliseconds past January 1, 1970, 00:00:00 UTC.

To create a time before January 1, 1970, you can use a negative value for `ms`.

```js
let date = new Date(0);
// 1970-01-01T00:00:00.000Z
console.log(date);
```

By passing a string argument to `new Date(dateString)`, the string is automatically parsed to create a Date object that reflects that time.

```js
let date = new Date("2020-01-01");
// 2020-01-01T00:00:00.000Z
console.log(date);
```

Using `new Date(year, month, date, hours, minutes, seconds, ms)` as arguments creates and returns a Date object that stores the specified time. Important considerations when using this include:

  - The year must be a four-digit number.
  - The month starts at 0, so 0 is January, 1 is February, and 11 is December.
  - The day starts at 1, with a default of 1.
  - Hours, minutes, seconds, and milliseconds are optional and default to 0 if omitted.

## 4.2. Date Object Methods

The Date object provides methods to retrieve information including:

  - `getFullYear()`: Returns the year. Do not use getYear().
  - `getMonth()`: Returns the month, starting from 0 to 11.
  - `getDate()`: Returns the day of the month, ranging from 1 to 31.
  - `getDay()`: Returns the day of the week, starting from 0 (Sunday) to 6 (Saturday).
  - `getHours()`: Returns the hour.
  - `getMinutes()`: Returns the minutes.
  - `getSeconds()`: Returns the seconds.
  - `getMilliseconds()`: Returns the milliseconds.
  - `getTime()`: Returns the number of milliseconds since January 1, 1970, 00:00:00 UTC.

By using set instead of get, you can set the properties of the Date object.

- setFullYear(year, month, date)
- setMonth(month, date)
- setDate(date)
- setHours(hour, [min, sec, ms])
- setMinutes(min, [sec, ms])
- setSeconds(sec, [ms])
- setMilliseconds(ms)
- setTime(milliseconds)

The Date object also supports automatic correction. For example, there is no January 32. If you attempt to create a Date object with such a value, it will automatically adjust to February 1. Time overflowing will be distributed across other components accordingly.

```js
let now = new Date(2020, 01, 50);
// January is treated as February, so the result is March 21, 2020
console.log(now);
```

This automatic correction feature also applies when performing operations that add or subtract time or dates.

```js
let now = new Date();
now.setHours(now.getHours() + 3); 
// Time after 3 hours
console.log(now);
// Setting to 0 will give the last day of the previous month
now.setDate(0);
console.log(now);
```

## 4.3. Type Conversion

When a Date object is converted to a number, it returns the number of milliseconds since January 1, 1970, 00:00:00 UTC. This is equivalent to using the getTime method.

```js
let now = new Date();
console.log(+now);
```

You can convert the current time to milliseconds without creating a Date object using Date.now(). This method is faster than getTime and does not require garbage collection.

## 4.4. Date.parse

Date.parse converts a string to a Date object. The string must follow the format `YYYY-MM-DDTHH:mm:ss.sssZ`. The ss.sss portion represents seconds and milliseconds. The Z indicates UTC+0 time zone. Changing this to `+HH:mm` or `-HH:mm` indicates a different time zone.

It also supports the formats YYYY, YYYY-MM, and YYYY-MM-DD, in which case the time is set to 00:00:00.

When calling Date.parse with a correctly formatted string, it returns the timestamp for that time. If the string is incorrectly formatted, it returns NaN.

To create a Date object based on this, use the form `new Date(Date.parse(str))`.

# 5. JSON

JSON stands for JavaScript Object Notation and is a notation for representing JavaScript values or objects. However, JSON can also be used in other languages with libraries that support this functionality.

In JavaScript, methods to handle JSON are supported by default: `JSON.stringify` and `JSON.parse`, which convert objects to JSON and JSON back to objects, respectively.

```js
let me = {
  name: "Kim Sung Hyun",
  age: 25,
  hobby: "coding",
};

let meJSON = JSON.stringify(me);
// Result of converting an object to a string
console.log(meJSON);
```

The string converted using `JSON.stringify` is encoded as JSON, serialized, converted to a string, and a compact representation of the object. This string can be transferred over a network or stored.

## 5.1. Object Encoding

An object encoded with `JSON.stringify` has the following characteristics:

1. Strings are enclosed in double quotes. Single quotes or backticks are not allowed.
2. Object property names are wrapped in double quotes, expressed as "age": 30.

Objects and arrays can also be encoded, along with strings, numbers, booleans, and null. Strings are always enclosed in double quotes during encoding.

JSON is a language-agnostic format, so property types unique to JavaScript are ignored during the `JSON.stringify` encoding.

This means that function properties, properties with symbol keys, and properties with values of undefined are excluded from encoding.

```js
let me = {
  name: "Kim Sung Hyun",
  age: 25,
  hobby: "coding",
  // The following are ignored
  sayHi: function () {
    console.log(`Hello, I'm ${this.name}.`);
  },
  [Symbol("id")]: 12345,
  temp: undefined,
};

let meJSON = JSON.stringify(me);
// Result of converting the object to a string
console.log(meJSON);
```

If an object's property value is another object, it is also encoded. This means that nested objects are well-encoded. However, be cautious that encoding does not work correctly in cases of circular references.

```js
let room = {
  number: 105,
};

let me = {
  name: "Kim Sung Hyun",
  age: 25,
  hobby: "coding",
};

me.address = room;
room.owner = me;
// Uncaught TypeError: Converting circular structure to JSON, which indicates a circular reference error
let meJSON = JSON.stringify(me);
console.log(meJSON);
```

## 5.2. Replacer

The complete form of `JSON.stringify` is as follows:

```js
let json = JSON.stringify(value[, replacer, space]);
```

`value` is the value to encode as seen earlier. The `replacer` is either an array or a mapping function determining which properties to encode. `space` indicates the number of whitespace characters for formatting.

Usually, just one argument is passed to `JSON.stringify`, but when dealing with circular references, the second argument can be used.

For example, in the code above, the `address` property of the `me` object references the `room` object, which in turn references the `me` object, creating a circular reference. To resolve this, you can pass an array of keys excluding "address" to the `replacer` argument, which will encode only those properties.

```js
let room = {
  number: 105,
};

let me = {
  name: "Kim Sung Hyun",
  age: 25,
  hobby: "coding",
  friend: [{ name: "Kim Gi Dong" }, { name: "Kim Hyung Sik" }],
};

me.address = room;
room.owner = me;
let meJSON = JSON.stringify(me, ["name", "age", "hobby", "friend"]);
/* {"name":"Kim Sung Hyun","age":25,"hobby":"coding","friend":[{"name":"Kim Gi Dong"},{"name":"Kim Hyung Sik"}]}
Excludes address from encoding */
console.log(meJSON);
```

The `replacer` argument can also accept a mapping function. This function will be called for every (key, value) pair. The function can return a value, and if it returns undefined, that property will be excluded from encoding.

Thus, in the code above, if the key is "address", you can return undefined in the mapping function to exclude the address property from encoding.

```js
let room = {
  number: 105,
};

let me = {
  name: "Kim Sung Hyun",
  age: 25,
  hobby: "coding",
  friend: [{ name: "Kim Gi Dong" }, { name: "Kim Hyung Sik" }],
};

me.address = room;
room.owner = me;
let meJSON = JSON.stringify(me, function replacer(key, value) {
  if (key === "address") {
    return undefined;
  }
  console.log(key, value);
  return value;
});
console.log(meJSON);
```
If you add a logging feature to the `replacer` function, you can see that it handles all key-value pairs, including nested objects and array elements. It processes them recursively.

Additionally, when this function is called for the first time, a wrapper object in the form `{"":me}` is created, meaning that the encoding object itself is passed into the `replacer` function’s value.

The log output of the above code is as follows.

![stringify](./stringifyLog.png)

In this manner, you can use the `replacer` argument to encode only the desired properties.

## 5.3. Space

The third argument `space` in `JSON.stringify` represents the number of whitespace characters to insert for readability. The number of spaces affects indentation, and nested objects appear on separate lines.

```js
let me = {
  name: "Kim Sung Hyun",
  age: 25,
  hobby: "coding",
};

let meJSON = JSON.stringify(me, null, 4);
/*
{
    "name": "Kim Sung Hyun",
    "age": 25,
    "hobby": "coding"
}
*/
console.log(meJSON);
```

## 5.4. toJSON

If the object has a toJSON method, `JSON.stringify` will call this method to encode its return value. Thus, implementing the toJSON method allows you to manipulate the string returned by `JSON.stringify`.

```js
let me = {
  name: "Kim Sung Hyun",
  age: 25,
  hobby: "coding",
  toJSON: function () {
    return this.age;
  },
};

// The writer references the me object, so me.toJSON() is called,
// returning me.age which is then encoded.
let profile = {
  title: "Hello,",
  content: "I am Kim Sung Hyun.",
  writer: me,
};

let meJSON = JSON.stringify(profile);
console.log(meJSON);
```

## 5.5. JSON.parse

`JSON.parse` parses a JSON string and returns a JavaScript object. `JSON.parse` takes two arguments; the first is the JSON string to parse, and the second is the reviver function.

```js
let value = JSON.parse(str, [reviver])
```

This function is commonly used for debugging and when directly creating and decoding JSON. However, while directly creating JSON, it does not validate the JSON string format. Therefore, parsing an invalid JSON string will result in an error.

To construct valid JSON strings, observe the following rules:

1. Property keys and string values must be enclosed in double quotes. Single quotes or backticks are not allowed.
2. You cannot use constructs like `new`. Only pure values are acceptable.

The second argument, the reviver function, is called for every (key, value) pair. This function can return a value to replace the value used in the object, or if it returns nothing, the original value is used.

For example, if you wish to convert the value for the key "date" into a Date object, you would implement the reviver function as follows:

```js
let json = `{
    "name": "Kim Sung Hyun",
    "age": 25,
    "hobby": "coding",
    "date": "2021-01-01"
}`;

let obj = JSON.parse(json, (key, value) => {
  if (key === "date") {
    return new Date(value);
  }
  return value;
});

console.log(obj.date.getFullYear());
```