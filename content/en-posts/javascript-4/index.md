---
title: Modern JavaScript Tutorial Part 1.2 JavaScript Basics - 3
date: "2022-12-26T00:00:00Z"
description: "ko.javascript.info part 1-2 third"
tags: ["javascript"]
---

# 1. Loops

There are `while` and `for` loops.

## 1.1. while

It functions similarly to other languages. It executes the body while the `condition` is true.

```js
while(condition){
    // body
}
```

The evaluated value of `condition` is coerced to a boolean, and if it is true, the while loop's body executes.

## 1.2. do~while

The `do~while` loop exists in the same manner as in other languages.

```js
do{
    // body
} while(condition);
```

The body is executed first, and then the condition is evaluated, thus ensuring the body executes at least once while the condition is true.

## 1.3. for

The `for` loop is structured as follows:

```js
for(begin; condition; step){
    // body
}
```

`begin` executes when entering the loop, `condition` is checked each iteration, and `step` executes after each body execution.

This means it repeats the cycle of `begin -> (if condition is true, run body and then step)`. If `condition` is false from the start, the body will not execute at all.

Also, any unnecessary components of the `for` loop may be omitted. For example, if you are using a pre-initialized variable, there may be no need for `begin`.

## 1.4. break/continue with label

In JavaScript, `break` and `continue` function the same as in other languages, with the distinction that they can be used with labels. This allows breaking out of multiple nested loops. For example, consider the following nested loop:

```js
for(let i=0; i<3; i++){
  for(let j=0; j<3; j++){
    console.log(i, j);
  }
}
```

If you want to terminate this when both `i` and `j` are 1, you would need to use a flag and two breaks as follows:

```js
let flag=0;
for(let i=0; i<3; i++){
  for(let j=0; j<3; j++){
    console.log(i, j);
    if(i===1 && j===1){ flag=1; break; }
  }
  if(flag){ break; }
}
```

However, you can write a label for the loop you wish to exit from, and attach that label to `break`, allowing you to exit the specific loop directly.

```js
outer: for(let i=0; i<3; i++){
  for(let j=0; j<3; j++){
    console.log(i, j);
    if(i===1 && j===1){ break outer; }
  }
}
```

Similarly, `continue` can also be used with a label; in this case, the next iteration of the labeled loop is executed. For example, in the following code, if `i` is 1, the next iteration of `outer` executes, skipping the rest of the inner loop.

```js
outer: for(let i=0; i<3; i++){
  for(let j=0; j<3; j++){
    console.log(i, j);
    if(i===1){ continue outer; }
  }
}
```

# 2. switch

An `if` statement with multiple branches can be replaced with a `switch`. If the target matches a case value, the associated case's body executes. If there is no matching case, the default body executes.

```js
switch(target){
  case value1:
    // body
    break;
  case value2:
    // body
    break;
  default:
    // body
}
```

Since `switch` jumps to the matching case, if a `break` is omitted, all subsequent case bodies execute after the matched case is executed. For instance, the following switch statement:

```js
switch(target){
  case 1:
    console.log(1);
  case 2:
    console.log(2);
    break;
  case 3:
    console.log(3);
    break;
  default:
    console.log('default');
}
```

If the target is 1, both 1 and 2 will be logged to the console. Additionally, any expression can be used as the target and case values.

It is important to remember that `switch` uses strict comparison `===`. Therefore, 0 and '0' are treated as different. Be sure to check the type of the input when passing it to `switch`. For example, the `prompt` function returns a string.

```js
let a='0';
// 'String 0' is printed.
switch(a){
  case 0:
    console.log("Number 0");
    break;
  case '0':
    console.log("String 0");
    break;
  default:
    console.log("Something else");
}
```

# 3. Functions

Just like in other languages, functions can be created in JS using the `function` keyword.

```js
function functionName(parameter1, parameter2, ...){
  // body
}
```

Functions also create a new block scope with curly braces, allowing the creation of local variables only accessible within the function while also allowing access to variables outside the function's scope. However, if a local variable within the function has the same name as an external variable, the local variable takes precedence.

In the example code below, since `a` is declared within the function, within the function `a` is 3, while outside the function `a` remains 1.

```js
let a=1;
function test(){
  let a=3;
  console.log(a);
}
test();
console.log(a);
```

## 3.1. Parameters

In JS, parameters can be passed to a function. These parameters are copied to the function body. Observe the following code:

```js
function test(nickname){
  nickname = nickname + "me";
  console.log(nickname);
}
let t="witch";
// witchme is printed.
test(t);
// witch is printed.
console.log(t);
```

Although `nickname` is modified within the function, the variable passed in remains unchanged. This indicates that the parameter is used as a copy within the function. However, not everything is copied in a simple manner... this will be covered in another article.

## 3.2. Default Parameters

If a parameter is left blank when calling a function, `undefined` is placed in that position.

```js
function test(arg1, arg2){
  console.log(arg1, arg2);
}
// 1 undefined
test(1);
```

When default values are set for parameters, these values will be used if no arguments are provided or if `undefined` is passed.

```js
function test(arg1, arg2=2){
  console.log(arg1, arg2);
}
// 1 2
test(1);
```

Default parameters are evaluated each time the function is called, allowing for values or expressions that need to change with each call.

```js
function test(arg1, arg2=func()){
  console.log(arg1, arg2);
}
```

## 3.3. Alternative Methods for Default Parameters

If you need to set default values after function declaration, you can use a comparison with `undefined`, or use `||`, `??` as methods.

```js
function test(arg1, arg2){
  if(arg2 === undefined){
    arg2="default";
  }
  console.log(arg1, arg2);
}

// This will insert the default value if arg2 is a falsy value
function test(arg1, arg2){
  arg2 = arg2 || "default";
  console.log(arg1, arg2);
}

function test(arg1, arg2){
  arg2 = arg2 ?? "default";
  console.log(arg1, arg2);
}
```

## 3.4. Using Return Values

Values can be returned to the call site using `return`. However, if `return` is omitted or the return value is not specified, `undefined` is returned.

```js
function test(arg1, arg2){
  console.log(arg1, arg2);
}
// undefined
console.log(test(1, 0));
```

# 4. Function Expressions

Previously, we defined functions using function declarations. Here is one such example:

```js
function functionName(parameters){
  body
}
```

However, functions can also be defined using function expressions. In JS, functions are objects, allowing you to assign functions to variables.

```js
let functionName = function(parameters){
  body
};
```

Of course, since functions can be called, they behave differently from typical values, but you can perform actions on functions similar to actions on other variable types, such as assigning them to variables.

Note that the function expression must conclude with a semicolon, as it ultimately assigns a value to a variable, similar to `let a=0;`.

Using functions as values allows you to create callback functions invoked by specific events, serving various purposes.

## 4.1. Difference between Function Declarations and Function Expressions

What are the distinctions between creating functions via declarations and expressions?

Function expressions create the function only when the code execution reaches the expression. Thus, it is impossible to use the function prior to its definition.

```js
// Not yet defined, causing an error when called!
greeting();

let greeting = function(){
  console.log("Hi");
}
```

With function declarations, the function can be called even before reaching the code block defining it. This is because the JavaScript engine identifies and creates functions in the declarations before executing the code. Therefore, all code executes after all function declarations are established.

```js
greeting();
// Defined as a function declaration, callable before its definition.
function greeting(){
  console.log("Hi");
}
```

Let’s explore another function expression scenario. Sometimes, you might need to define different functions based on variable values. For example, if a variable represents age, and you wish to display whether a person is an adult (18 or older) or a minor (under 18), you could create a function accordingly.

Of course, you could write one function and use an if statement within it.

```js
function greeting(age){
  if(age >= 18){
    console.log("You are an adult.");
  }
  else{
    console.log("You are a minor.");
  }
}
```

However, you can also create completely different functions based on age. This method of defining functions is facilitated by function expressions, which can prove to be more practical.

```js
let greeting;

if(myAge >= 18){
  greeting = function(){
    console.log("You are an adult.");
  }
}
else{
  greeting = function(){
    console.log("You are a minor.");
  }
}
```

# 5. Basic Arrow Functions

Arrow functions allow for simplified creation of functions compared to function expressions.

```js
let functionName = (parameters) => returnValue;
```

For example, see the following usage:

```js
// Returns the argument prefixed with "Hi".
let greeting = (name) => "Hi " + name;
console.log(greeting("SungHyun"));
```

If the function has a body rather than just a return value, you can create a block of code using curly braces. In that case, you explicitly need to use `return` to indicate the returned value.

```js
let add = (a, b) => {
  // function body
  let sum = a + b;
  return sum;
}
```

Arrow functions will be discussed in more detail later.