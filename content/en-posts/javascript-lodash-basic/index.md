---
title: Exploring JavaScript - The History of JS and Lodash
date: "2023-01-03T00:00:00Z"
description: "Lodash once had its moment in time"
tags: ["javascript"]
---

# 1. Lodash

As of the first week of January 2023, Lodash is employed in approximately [20 million](https://github.com/lodash/lodash/network/dependents) GitHub repositories, undergoing around [25 million downloads](https://www.npmjs.com/package/lodash) per week, making it an extremely well-known library.

Thus, I examined a tutorial on Lodash. It offers many useful functions such as map, filter, flatten, remove, every, find, findIndex, and forEach.

However, as someone relatively new to JS, I began to wonder: Aren't these functions already provided by JS? If so, why is Lodash necessary?

Certainly, the functions supported by Lodash exhibit better performance than their JS counterparts. They also ensure greater safety and broader use. Nonetheless, I felt that was not the primary reason for Lodash's popularity.

# 2. The History of Lodash

![lodash-is-history](./lodash-is-history.jpeg)

Lodash originated from Underscore.js, which was created in 2009 to provide functional programming utilities for JS.

In 2012, John-David Dalton forked Underscore.js to create Lodash, offering more functions that were faster and safer. Starting from version 3.0.0, significant differences arose between Lodash and Underscore.js. Although there were attempts to merge the two, they ultimately failed due to opposition from the maintainers.

## 2.1 The Context at the Time

![js-past](./js-good-part.png)

[Image Source](https://pitzcarraldo.medium.com/javascript%EB%8A%94-%EC%9E%98%EB%AA%BB%EC%9D%B4-%EC%97%86%EB%8B%A4-%EC%A0%95%EB%A7%90%EB%A1%9C-fb9b8e033b10)

Compared to now, JS was nearly in a dark age. At that time, there was no JS class syntax, and fetch wasn't available. ES6's numerous convenience features were nonexistent, and browsers competed against each other's standards (notably IE), leading to poor browser compatibility. Libraries emerged to ameliorate the inadequacies of JS, such as Bootstrap, jQuery, Underscore.js, and Prototype.js.

ES6 was merely one of the hopes of front-end developers—though the term "front-end developer" wasn't widely used at the time—and ES5 was not widely adopted. ES3 was the reigning standard. For reference, functions like map, filter, and forEach were introduced in ES5, while findIndex and fill made their debut in ES6.

Features of JS that are now taken for granted, such as class syntax and functions that ensure immutability, were still years away from being released or had just emerged but weren't yet widely adopted. In this environment, Lodash emerged, providing a consistent and clean interface. It could be conveniently used with an underscore (`_`). Thus, Lodash gained significant recognition.

# 3. Present

## 3.1 Advantages of Lodash

Lodash continues to offer several advantages today. Depending on the function, it often outperforms native JS methods and provides various functions not currently available in JS that would need to be implemented directly. For example, there is the chunk function that splits an array into specific sizes.

```js
_.chunk(['a', 'b', 'c', 'd'], 2);
// => [['a', 'b'], ['c', 'd']]
```

Writing this in native code would require the following. The source of this code is [here](https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_chunk)

```js
const chunk = (input, size) => {
  return input.reduce((arr, item, idx) => {
    return idx % size === 0
      ? [...arr, [item]]
      : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]];
  }, []);
};

chunk(['a', 'b', 'c', 'd'], 2);
// => [['a', 'b'], ['c', 'd']]
```

There is also the `_.cloneDeep` function for deep copying. While it can be substituted using the spread operator, Object.assign, or JSON.parse(JSON.stringify()) (which does not work if there are functions within the object), these alternatives have their shortcomings.

Moreover, Lodash provides a broader range of functions. In contrast to JS's forEach, which executes a given function on each array element and returns nothing (undefined), Lodash's forEach can take an object as an argument and returns an array of results after applying a specific function to each element of the received object or array.

Recent variations such as lodash-fp, which supports functional programming, and lodash-es, written in ES6 and suited for tree-shaking, continue to receive good support. Given its usage in around 20 million repositories, this support may be expected.

## 3.2. Should You Use Lodash?

Lodash still provides many convenient features. However, many of those functionalities are now directly supported by JS or could be implemented succinctly. There is a [repository](https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore) that gathers replacement code for Lodash functions.

As a result, upon reviewing various articles, the prevailing opinion appears to be that using Lodash has transitioned into a matter of choice. Many speculate that Lodash may soon fade into obscurity, similar to jQuery and Prototype.js, which are no longer used in new projects.

However, it undoubtedly was a library that once represented an era in JS, and its value at the time was significant. The fact that it continues to be utilized in 20 million repositories today attests to this, many of which include new projects. Yet, whether using Lodash is more advantageous than not seems to be a situational decision now.

Regardless, the name Lodash, which occasionally crossed my path while learning front-end development, was one of the beacons that illuminated the dark era of JS.

# References

A comment noting that Lodash map existed long before Array.prototype.map: https://stackoverflow.com/questions/42861080/what-is-the-reason-to-use-lodash-underscore-map-function

[map](https://www.w3schools.com/jsref/jsref_map.asp), [filter](https://www.w3schools.com/jsref/jsref_filter.asp), [forEach](https://www.w3schools.com/jsref/jsref_foreach.asp)

Wikipedia article on Underscore.js: https://en.wikipedia.org/wiki/Underscore.js#History

Article advocating for letting go of Lodash: https://thejs.dev/jmitchell/its-time-to-let-go-of-lodash-nqc

Introduction to Prototype.js: http://runean.com/introduce-prototype-js/

You Don't Need Lodash Underscore: https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore

Performance comparison between JS and Lodash functions: https://ui.toast.com/weekly-pick/ko_20190515

lodash-es: https://yrnana.dev/post/2021-11-28-lodash-lodash-es