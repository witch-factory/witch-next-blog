---
title: Modern JavaScript Tutorial Part 1.5 Data Structures and Data Types - 1
date: "2023-01-07T00:00:00Z"
description: "ko.javascript.info part 1-5 first"
tags: ["javascript"]
---

# 1. Methods of Primitive Values

Primitive values are not objects, therefore they cannot have properties or methods. However, there are clearly methods that apply to primitive values, such as `toUpperCase`, and there are properties like the length of a string. How does this work?

## 1.1. Wrapper Objects for Primitive Values

In JavaScript, methods are used on primitive values in this way.

First, primitive values maintain their form as primitive values. When a primitive value tries to access a method or property, a special temporary wrapper object is created to provide additional functionality, allowing access to the method/property. This object is deleted once the access is complete.

Thus, when accessing a method or property of a primitive value, the primitive value temporarily acts like an object. Hence, property access on primitive values can also be attempted.

```js
a = "test";
console.log(a.foo); //undefined
```

JavaScript engines take care of optimizing these wrapper objects so using them doesn’t require much resource.

## 1.2. Wrapper Object Constructors

You can create wrapper objects directly. You can use constructors such as Number, Boolean, and String. This will create a wrapper object for each primitive value.

However, it is not advisable to use this. Treating a value that should be a primitive as an object can cause confusion. For instance, creating a value with `new Number(0)` would generate a temporary object with the value of 0.

If this is used in a logical evaluation, since objects are always true in logical evaluations, `Number{0}` would be true. However, the number 0 is generally evaluated as false, which can lead to unintended behavior.

# 2. Numeric Type

In JavaScript, numbers are stored in IEEE-754 format, with the exception of BigInt.

## 2.1. Radix Representation

In general, all numbers in JavaScript are treated as decimal. Scientific notation like `1e9` is also possible.

However, hexadecimal, octal, and binary representations are supported, which can be expressed with the prefixes 0x, 0o, and 0b, respectively. But when using comparison operators, the same number judgment occurs regardless of the radix. For example, `0b11 === 3` evaluates to true.

If you want to use integers in another radix, you need to use parseInt.

## 2.1.1. Handling Radix with toString(base)

`num.toString(base)` converts num to the base representation and returns it as a string. The base can be between 2 and 36.

```js
let a = 33; 
console.log(a.toString(16)); //21
```

## 2.2. Inaccurate Calculations

In JavaScript, numbers (excluding BigInt) are represented internally using IEEE-754 format. They are stored in exactly 64 bits, where 52 bits store the number, 11 bits store the position of the decimal point, and 1 bit stores the sign.

However, if a number is too large to be stored, it exceeds the 64-bit space and is handled as Infinity. For example, printing `1e500` would return `Infinity`.

Moreover, the well-known example `0.1 + 0.2 === 0.3` being false is due to the IEEE 754 storage method. Numbers like 0.1 and 0.2 cannot be precisely represented in binary IEEE 754 format.

One of the ways to resolve this is by using toFixed. Since toFixed returns a string, unary operator `+` can be used for numeric conversion.

```js
let res = 0.1 + 0.2; 
console.log(+res.toFixed(2)); //0.3
```

Another example of precision loss occurs when a very large number is represented, leading to the loss of significant digits and thus causing inaccurate representations.

![inaccurate](./inaccurate.PNG)

## 2.3. Some Methods Related to Numeric Types

`Infinity`, `-Infinity`, and `NaN` belong to the numeric type. However, because they are not typical numbers, there are functions to check them: `isNaN` and `isFinite`.

The reason `isNaN` is necessary is that `NaN` is not equal to any other value, not even itself.

```js
alert(NaN === NaN) //false
```

`isFinite` returns true if the number passed as an argument is a typical number—not NaN, Infinity, or -Infinity.

There are also parseInt and parseFloat functions which read numbers from strings until they can't anymore. If a non-numeric character appears during string parsing, the collected number up to that point is returned.

```js
console.log(parseInt('120px')); //120
console.log(parseFloat('12.5rem')); //12.5
```

If no readable number exists like in `parseInt("a")`, it returns NaN. Additionally, by passing a base of 2 to 36 as the second argument of parseInt, the base used for parsing can be specified.

```js
console.log(parseInt('0xff', 16));
```

## 2.4. Object.is

`Object.is` is a method used for value comparison that returns different results compared to `===` in two cases.

1. `NaN === NaN` is false, but `Object.is(NaN, NaN)` is true.
2. `0 === -0` is true, while `Object.is(0, -0)` is false.

The comparison method of Object.is is referred to as SameValue.

## 2.5. Other Methods

### 2.5.1. Math.random()

Returns a random number between 0 and 1 (excluding 1).

### 2.5.2. Math.max, Math.min

Returns the maximum or minimum value among the given arguments. If any non-numeric string is present among the arguments, it attempts to return as a number, and if that fails, it returns NaN.

### 2.5.3. Math.pow(n, p)

Returns the value of n raised to the power of p. Real number powers are also possible.

# 3. Strings

JavaScript does not have a char type; it only has strings. These strings strictly follow UTF-16 encoding.

You can declare a string either using double quotes or single quotes. Another way is to use backticks for template literals, which is summarized in [this article](https://www.witch.work/javascript-template-literal/).

It is important to note that strings are immutable. Attempting to change like `word[0] = 'a'` will throw an error.

## 3.1. Unicode Representation

It is well-known that you can express escape characters using `\`. In JavaScript, it is also possible to represent Unicode symbols using this.

You can place the hexadecimal code of UTF-16 encoding in the format `\uXXXX`. If you want to use long UTF-32 Unicode, you can use `\u{XX..XX}`.

```js
console.log("\u00A9");
console.log("\u{1F60D}");
```

## 3.2. Properties and Methods

Although strings are primitive values, as previously discussed, property and method access is possible through temporary wrapper objects.

### 3.2.1. length

The length property stores the length of the string. It can be accessed as `str.length`.

### 3.2.2. charAt

To access a specific character at a given index in a string, you can use bracket indexing, but you can also use the `charAt` method. The difference is that if there is no character at the desired position, bracket indexing returns undefined, while charAt returns an empty string.

```js
let word = "witch";
console.log(word[10]); //undefined
console.log(word.charAt(10)); //empty string
```

### 3.2.3. Iterating Over Strings

You can iterate over the characters that make up a string using `for..of`.

```js
for (let ch of word) {
    console.log(ch);
}
```

### 3.2.4. Changing Case

`toUpperCase` returns a new string with all alphabetic characters converted to uppercase, while `toLowerCase` returns a new string with all alphabetic characters converted to lowercase.

### 3.2.5. Finding Substrings

You can find substrings using the `indexOf` method. `word.indexOf(substr, pos)` searches for substr in the word string and returns its starting position (index). If not found, it returns -1.

The second argument `pos` is optional; if not provided, the search starts from the beginning of the provided string. If `pos` is supplied, the search begins at that specified index.

Another method with the same functionality, but searching from the end of the string, is `lastIndexOf`.

One important note is that when checking if a substring was found, you should not compare directly to 0. This is because indexOf might return 0 upon success.

```js
let word = "witch";
// w is found, but since the return value is 0, nothing prints
if (word.indexOf('w')) {
    console.log("w is found");
}
```

In such cases, you should compare the indexOf return value to -1. The following code works correctly.

```js
let word = "witch";

if (word.indexOf('w') !== -1) {
    console.log("w is found");
}
```

To check the presence of a substring, you can use `str.includes(substr, pos)`, which returns true or false based on whether substr exists. The purpose of the second argument `pos` is the same as in indexOf.

You can also determine if a string starts or ends with a specific string using `startsWith` and `endsWith`.

### 3.2.6. Extracting Substrings

There are three methods to extract a part of a string.

`str.slice` returns the substring from start to end index (excluding end), similar to Python slicing. If the second argument end is omitted, it returns from start to the end.

You can also pass negative numbers, in which case counting starts from the end of the string. The last character becomes index -1.

```js
let word = "witch_work";

console.log(word.slice(1, 5)); //itch
console.log(word.slice(5)); //_work
console.log(word.slice(3, -4)); //ch_
console.log(word.slice(4, 3)); //empty string
```

If start equals or is greater than end, slice returns an empty string.

`substring` has similar functionality to slice but does not accept negative arguments. If negative arguments are supplied, they are treated as 0, and it also extracts strings correctly whether start is greater than end or vice versa.

```js
let word = "witch_work";
// witc is printed.
// Negative arguments are treated as 0, and therefore substring(4,0) extracts the string between indices 0 and 4.
console.log(word.substring(4, -1));
```

Instead of using indexes, you can also use lengths. `str.substr(start, length)` extracts length characters starting from the start index. However, this substr is a browser-specific feature and may not work properly outside a browser environment.

Since slice allows negative indices and is more flexible, using slice generally provides a better choice than substring.

## 3.3. String Comparison

In JS, all strings are encoded in UTF-16, which matches each character to its numeric code. The method `str.codePointAt(index)` can be used to find the code of the character at a specific index in str. Conversely, `String.fromCodePoint(code)` creates a character corresponding to a specific numeric code.

JavaScript compares strings using these numeric codes. It compares each character one by one from the starting index, concluding that the string with the larger numeric code is the greater string.

Therefore, simply using comparison operators on strings can lead to issues like lowercase letters being considered larger than uppercase letters. To compare correctly, you should use `str.localeCompare(str2)`, which follows the standard for internationalization (ECMA-402).

If str is less than str2, it returns a negative number; if equal, it returns 0; if str is greater than str2, it returns a positive number.

```js
console.log("ABC".localeCompare("abb")); //1
console.log("ABC" > "abb"); //false
```

As seen in the result above, while comparing directly, uppercase letters had smaller numeric codes, thus were judged to be less than lowercase, but localeCompare accurately compares "ABC" greater than "abb" based on standard alphabetical comparisons.

# 4. Arrays

## 4.1. Creating Arrays

Arrays can be created using square brackets or constructors.

```js
let arr = new Array();
let arr2 = [];
```

## 4.2. Iterating Over Arrays

When iterating over arrays, using a for loop is common. There are three options available. Iterating using indexes is the most basic method.

```js
let members = ["고주형", "전민지", "장소원"];

for (let i = 0; i < members.length; i++) {
    console.log(members[i]);
}
```

You can also use a for-of loop. This method iterates through the elements of the array while assigning each element to a variable. It is good to use when you only need the values, not their indexes.

```js
let members = ["고주형", "전민지", "장소원"];

for (let member of members) {
    console.log(member);
}
```

You could also use a for-in loop. However, for-in is primarily optimized for iterating through objects, and may lead to iterating over unwanted properties in similar array objects that have non-numeric keys.

```js
let members = ["고주형", "전민지", "장소원"];
members.foo = "김성현";
// members.foo is also included in the iteration
for (let name in members) {
    console.log(members[name]);
}
// members.foo is not included in the iteration
for (let name of members) {
    console.log(name);
}
```

Additionally, for-in is optimized for use with objects, making it slower than for-of when used with arrays.

## 4.3. Length

The length of an array does not count the actual number of elements in the array but is the value of the largest index plus one.

```js
let test = [];
test[1000] = 1;
console.log(test.length); 
// only one actual element, but length is 1001
```

You can also set the array's length. When you reduce the length, elements at the back of the array get removed. Specifying a length larger than the existing will leave empty spaces at the end of the array.

```js
let test = [1, 2, 3];
// [1, 2, 3] 3
console.log(test, test.length);
test.length = 5;
// [1, 2, 3, empty × 2] 5
console.log(test, test.length);
test.length = 2;
// [1, 2] 2. The array is truncated!
console.log(test, test.length);
```

## 4.4. Array Methods

Only methods that are less well-known are noted here.

### 4.4.1. splice

splice is used to remove or add elements of an array. The first argument is the starting index, the second is the number of elements to delete, and from the third argument onwards, the elements to add are listed.

```js
arr.splice(index[, deleteCount, elem1, ..., elemN])
```

The elements to add will be inserted before the element at the index position (0-based). For instance, `arr.splice(0, 0, 1)` would mean adding 1 at the first position of the array.

Negative indices can also be used here.

### 4.4.2. forEach

forEach iterates through the array's elements, executing a function for each element. forEach does not return any value (specifically, it returns undefined).

```js
let arr = [1, 2, 3, 4, 5];

arr.forEach((item, index) => {
    console.log(item, index);
});
```

### 4.4.3. indexOf, lastIndexOf, includes

These methods function similarly to those in strings.

```js
arr.indexOf(item, from) // Searches for item from the from index. Returns -1 if not found.
arr.lastIndexOf(item, from) // Searches for item from the end starting at from. Returns -1 if not found.
arr.includes(item, from) // Searches for item from the from index. Returns false if not found.
```

### 4.4.4. find, findIndex

find iterates over the array elements and returns the first element matching the condition. findIndex returns the index of the first element matching the condition.

If no matching elements are found, find returns undefined, and findIndex returns -1.

### 4.4.5. map

map iterates over the elements of the array, applying a function to each element and returning a new array with the results.

```js
let arr = [1, 2, 3, 4, 5];

let res = arr.map((item) => item + 10);
// 11, 12, 13, 14, 15
console.log(res);
```

### 4.4.6. reduce, reduceRight

reduce is used to derive a value based on all elements of the array. It is used in the following way.

```js
arr.reduce(function(accumulator, item, index, array) {
    // ...
}, [initial]);
```

reduce iterates from the first element of the array to the last, accumulating values in the accumulator. The accumulator can be initialized with initial, or if omitted, the first element of the array is used.

The arguments passed to the function used in reduce have the following meanings: accumulator is the accumulated value from the previous function call, item is the current element of the array, index is the current array index, and array refers to the array itself.

For example, you can use reduce to calculate the sum of all array elements.

```js
let arr = [1, 2, 3, 4, 5];
// Since no initial accumulated value is specified, the first array element, 1, is used as the initial accumulated value
let res = arr.reduce((s, current) => s + current);
// 15
console.log(res);
```

However, if no initial value is specified and the array is empty, issues can arise since there will be no first element. Therefore, it is safer to specify an initial value. For example:

```js
let res = arr.reduce((s, current) => s + current, 0);
```

reduceRight operates similarly to reduce but iterates from the end of the array.

### 4.4.7. isArray

Returns true if the element is an array, otherwise returns false.

### 4.4.8. thisArg

All array methods can accept an argument, thisArg. thisArg specifies the object to use as this within the method. If thisArg is not provided, this becomes undefined in the function (or the global window object in browser environments).

```js
let numberFilter = {
    min: 18,
    max: 99,
    filter(value) {
        if (value < this.min || value > this.max) {
            return false;
        }
        return true;
    },
};

let ages = [12, 18, 20, 1, 100, 90, 14];

// specifying numberFilter as the this for numberFilter.filter
let filtered = ages.filter(numberFilter.filter, numberFilter);
console.log(filtered);
```

# 5. Iterables

Making an object iterable means that any object can be traversed with for..of. This happens when for..of is called on an object.

1. It calls the object's Symbol.iterator method. This method must return an iterator object that has a next method.
2. for..of calls the next method of the iterator object whenever it needs the next value. The next method must return an object with value and done properties.
3. for..of continues to loop until the done property of the object returned by the next method is true.

The structure of an object's Symbol.iterator looks like this:

```js
object[Symbol.iterator] = function() {
    return {
        // Object with the next method implemented
        next() {
            if (there are more values to iterate) {
                return {done: false, value: the next value to iterate}
            } else {
                return {done: true}
            }
        }
    }
}
```

Alternatively, you can implement the next method directly on the object itself and return the object from Symbol.iterator.

```js
let obj = {
    [Symbol.iterator]: function() {
        // Set up initial conditions when for..of starts
        return this;
    },
    next() {
        if (there are more values to iterate) {
            return {done: false, value: the next value to iterate}
        } else {
            return {done: true}
        }
    }
}
```

However, the drawback of this approach is that you cannot use two for..of loops concurrently, as the iterator is just one object, sharing the loop's state.

Making an object iterable allows for separation of concerns. The next method can be entrusted to the iterator object, leaving the iterating object unconcerned with the looping mechanics.

## 5.1. Directly Calling Iterators

You can also directly call the iterator, although this is not commonly done.

```js
let it = obj[Symbol.iterator]();

while (1) {
    let result = it.next();
    if (result.done) break;
    console.log(result.value);
}
```

## 5.2. Iterables and Arrays

Iterables have the `Symbol.iterator` method, making them iterable objects. This differs from array-like objects, which have indexing and a length property.

There are array-like objects that have indexing and length but lack `Symbol.iterator`, thus making them non-iterable.

```js
// Has indexing and length, but lacks Symbol.iterator, hence it is an array-like object but not iterable
let arrayLike = {
    0: 'hello',
    1: 'world',
    length: 2
}
```

## 5.3. Array.from

The Array.from method converts an iterable or array-like object into a true array, allowing the use of array methods.

```js
let arr = {
    0: "witch",
    1: "work",
    length: 2,
};

let arr2 = Array.from(arr);
arr2.pop();
console.log(arr2); // ['witch']
```

Array.from transforms an object into an array if the object is iterable or array-like. This function also accepts an optional argument.

```js
Array.from(obj, [mapFn, thisArg])
```

If a mapFn is provided, it applies mapFn to each element before adding it to the resulting array. If thisArg is provided, it sets the object to use as this when calling mapFn.