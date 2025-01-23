---
title: Exploring JavaScript - Template Literals
date: "2022-12-22T00:00:00Z"
description: "About JS Template Literals"
tags: ["javascript"]
---

An overview of the template literal syntax in JS.

# 1. Concept

Template literals are a new string representation introduced in ES6, used for string declaration. Instead of using quotes, backticks (`) are employed. It can be used in the same way as traditional string representations.

```js
let word=`witch`;
console.log(word);
```

By default, it supports multi-line strings and expression insertion. Expressions wrapped in `${}` are evaluated and inserted into the string.

```js
// Example of multi-line string
let word=`I am
Kim Sung Hyun
`;
console.log(word);

// Expression insertion
let myName="김성현"
let word=`I am ${myName}`;
console.log(word);
```

To use backticks inside a template literal, a backslash must be prefixed.

```js
let word=`\` <- This is a backtick.`;
console.log(word);
```

# 2. Tagged Functions

A more advanced form is the tagged template. Tagged functions parse template literals as functions, allowing various operations. A tagged function takes template literals as arguments and processes them before returning. It is not required to return a string.

The usage format is as follows:

```js
taggedFunctionName`template literal`
```

In this case, the first argument of the tagged function contains an array of unwrapped strings separated by `${}`, and from the second argument onward, wrapped expressions are included.

For example, consider the following code.

```js
function tag(strings, arg1, arg2){
  console.log(strings, arg1, arg2);
}

let myName="김성현"
let myAge=25;

tag`I am ${myName} and I am ${myAge} years old.`;
```

In the above code, the `tag` function is called with the parsed results of the template literal as arguments. The first argument contains an array of unwrapped strings: `"I am ", " and I am ", " years old."`, and from the second argument onward, the wrapped expressions `myName` and `myAge` are included.

Thus, the `console.log` within the `tag` function produces the following output:

```js
["I am ", " and I am ", " years old."] "김성현" 25
```
Note that the array of unwrapped strings is split based on `${}`, so even if there is nothing after the last `${}`, an empty string will still be included.

For example, when the tag function is called in the following code, `strings` will contain `["I am ", ""]`, even though there is no content after `${myName}`:

```js
function tag(strings, arg1){
  console.log(strings, arg1);
}

let myName="김성현"

tag`I am ${myName}`;
```

## 2.1. Raw String

Using `String.raw` with a tagged function returns the raw string of the template literal. The strings wrapped in `${}` are substituted, but escape sequences are not processed.

```js
let str = String.raw`Hi \n${myName}!`;
// The escape sequence is not processed, so "Hi \nwitch!" is printed.
console.log(str);
```

# 3. Applications

## 3.1. Creating HTML Templates

How can such template literals be utilized? A representative example is creating HTML templates.

Imagine we have the following personal information object.

```js
const me={
  name:"Kim Sung Hyun",
  blog:"https://www.witch.work/"
}
```

Using this object, we can create a reusable HTML template function.

```js
function makeMarkUp({name, blog}){
  return `
    <div class="me">
      <h1>${name}</h1>
      <a href="${blog}">${blog}</a>
    </div>
  `;
}

console.log(makeMarkUp(me));
```

Using tagged functions offers a more elegant way to perform the same operation.

First, let's create the following tagged function. To achieve the same operation, we need to return an immediately invoked function.

```js
function templater(strings, ...keys){
  return function(data){
    // Create a copy of strings
    let temp = strings.slice();
    // Append the results of the expressions following each string to the corresponding strings.
    keys.forEach((key, idx)=>{
      temp[idx] = temp[idx] + data[key];
    });
    // Join the split strings together.
    return temp.join('');
  }
}
```

Now, we can create the `makeMarkUp` function similarly.

```js
const makeMarkUp = templater`
  <div class="me">
    <h1>${'name'}</h1>
    <a href="${'blog'}">${'blog'}</a>
  </div>
`;
console.log(makeMarkUp(me));
``` 

Additionally, using this `templater` function allows us to create a variety of other templates.

```js
const costInfo={
	goods:"Caffè Latte",
  cost:4500,
}

const makeCostMarkUp = templater`
  <div class="cost">
    <h1>${'goods'}</h1>
    <h2>${'cost'} 원</h2>
  </div>
`;

console.log(makeCostMarkUp(costInfo));
```

## 3.2. TypeScript Type Definition

[Although not an example of JS, template literals can be used to extend multiple union types for defining new string literal types.](https://youthfulhps.dev/typescript/typescript-essentials-you-should-know/#9-%ED%83%80%EC%9E%85-%EC%84%A0%EC%96%B8%EB%8F%84-dry-%EC%9B%90%EC%B9%99%EC%9D%84-%EC%A4%80%EC%88%98%ED%95%B4%EC%95%BC-%ED%95%9C%EB%8B%A4)

```ts
type DrinkType = 'ade' | 'juice';
type Flavor = 'lemon' | 'grapefruit' | 'Strawberry'

type DrinkMenu = `${Flavor}${DrinkType}`;
// type DrinkMenu = "lemonade" | "lemonjuice" | "grapefruitade" | "grapefruitjuice" | "Strawberryade" | "Strawberryjuice"
```

# References

MDN's Template Literals documentation https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Template_literals

MDN String.raw() https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/raw

Poiemaweb's explanation of Template Literals https://poiemaweb.com/es6-template-literals

CSS Tricks article on Template Literals https://css-tricks.com/template-literals/

String literal type definitions https://youthfulhps.dev/typescript/typescript-essentials-you-should-know/