---
title: Modern JavaScript Tutorial Part 1.2 Basic JavaScript - 2
date: "2022-12-17T00:00:00Z"
description: "ko.javascript.info part 1-2 Second"
tags: ["javascript"]
---

This document summarizes the [Modern JavaScript Tutorial](https://ko.javascript.info/).

# 1. Variables and Constants

A variable is a space for storing data, created with the `let` keyword.

```js
let a;
```

It can be assigned with `=` and the assigned data can be accessed via the variable name.

Previously, the `var` keyword was used to declare variables, but it is preferable to use `let`. The differences from `var` will be explained later.

However, if strict mode is not in effect, a variable can be created by assigning a value without `let`.

```js
a = 5;
```

Note that the above code will result in an error in strict mode.

## 1.1 Variable Names

Variable names can consist of letters, numbers, `$`, or `_`. They cannot start with a number. Remember that the `$` symbol can be used, although it does not hold a specific meaning for the interpreter. It is often used in variable names that have special meanings, such as jQuery objects or Angular framework variables.

## 1.2 Constants

A constant is a variable that cannot change its value once assigned. It is created using the `const` keyword.

However, this does not mean that the value contained cannot change; rather, it means that the reference to the variable cannot be changed.

When defining constants for magic numbers, there is a convention to use uppercase letters for the variable name, as follows.

```js
const MAX_COUNT = 5;
```

# 2. Data Types

JavaScript is a dynamically typed language. Therefore, the data type of a variable is determined by the value assigned to it. However, this does not mean that there are no data types. JavaScript has a total of eight basic data types.

## 2.1. Number

It represents integers and floating-point numbers. There are also special numeric values like `Infinity`, `-Infinity`, and `NaN`.

This numeric type can represent integers up to the range of $2^{53} - 1$. For larger numbers, there is a BigInt type, which is denoted by appending `n` to the integer literal.

```js
const bigInt = 1234567890123456789012345678901234567890n;
```

## 2.2. String

It represents strings, enclosed in single or double quotes.

Another way to represent strings is using backticks. A string wrapped in backticks is called a template literal, which allows for multi-line strings and string interpolation.

You can include variables or expressions within `${}` in the string.

```js
alert(`my number is ${5 + 10}`);
```

For more information about template literals, refer to [here](https://www.witch.work/javascript-template-literal/).

There is no char type in JavaScript; only strings exist.

## 2.3. Boolean

The boolean type has only two values: true and false.

## 2.4. Null

The null type indicates the absence of a value and does not belong to any other data type. A variable of null type can only hold the null value.

In other languages, null may be treated as 0 or an empty string, but in JavaScript, null represents a non-existent, empty, or unknown value.

## 2.5. Undefined

A variable of undefined type can only hold the undefined value, which indicates that no value has yet been assigned. For instance, if a variable is declared but not assigned, it will hold undefined.

```js
let a;
console.log(a); // Outputs undefined
```

## 2.6 Objects, Symbols

An object is a complex data structure that combines multiple values into a single unit. Objects can be used to represent more complex data structures.

Symbols are used to create unique identifiers for objects. Both of these will be discussed in more detail later.

## 2.7 typeof

The `typeof` operator returns the data type of the operand. It can be used in the form `typeof x` or as a function `typeof(x)`. Here, we will only address what needs to be remembered.

```js
typeof(null); // object

function add(a, b) {
  return a + b;
}
console.log(typeof add); // function
```

First, note that null is displayed as object. This is stated in the ECMAScript specification. Although considered a bug in JavaScript, fixing it would break compatibility, so it remains unchanged. A brief explanation of this follows in the next section.

In JavaScript, functions are first-class objects, but applying typeof to a function returns the string "function". This strange behavior is due to the absence of a function type in JavaScript, and it behaves this way because of longstanding conventions. For more on how functions are identified as type "function," see [here](https://www.howdy-mj.me/javascript/why-does-typeof-function-return-function).

## 2.8. Reason for typeof(null)

In the original version of JavaScript, values were stored in a 32-bit word. However, not all of those 32 bits were used for value storage. Some of the lower bits were allocated for a type tag, and the rest were used to store the actual value. The type tags were as follows:

| Type      | Tag  |
| ------- | --- |
| object  | 000 |
| integer | 001 |
| double  | 010 |
| string  | 100 |
| boolean | 110 |

The `typeof` operator used these lower tags to differentiate the types of values.

However, there were two exceptional values: null and undefined. Undefined was defined as `JSVAL_VOID` with a value of $-2^{30}$, while null was represented by a null pointer indicating a value `JSVAL_NULL`.

Since the null pointer value is 0, the lower bits would naturally be 000, causing the `typeof` operator to identify null as object.

# 3. Browser and Simple Interaction

## 3.1. alert

The alert function displays a warning dialog in the browser. It shows the string passed as an argument, and the dialog disappears when the user clicks the confirm button.

```js
alert("I am Kim Seong-hyun.");
```

## 3.2. prompt

The prompt function accepts two arguments and displays an input dialog in the browser. The first argument is the string shown in the input dialog, and the second is the default string displayed. The second argument is optional. The value entered by the user is returned.

If the user clicks confirm, the entered value goes into the return value of prompt. If the user cancels or presses the ESC key, the return value of prompt will be null. Consider the following code.

```js
let result = prompt("Creating an input dialog.", "Please enter here.");
alert(result);
```

When this code is executed, an input dialog appears.

![prompt](./prompt.png)

If the user enters `Kim Seong-hyun` and clicks confirm, an alert dialog stating Kim Seong-hyun appears.

![prompt_result](./prompt_result.png)

If the user clicks cancel, an alert dialog stating null will appear.

Be cautious, as in IE, if the second argument of prompt is omitted, undefined will automatically be inserted as the second argument. Therefore, if considering IE compatibility, it is not advisable to omit the second argument in prompt. Always provide at least an empty string.

## 3.3. confirm

The confirm function displays a dialog asking the user to confirm or cancel the received question. It returns true if the user confirms and false if canceled.

```js
let result = confirm("Are you Kim Seong-hyun?");
alert(result);
```

This can be written as above. Depending on the user's selection in the confirm dialog, an alert dialog will show either true or false. It can also be used to trigger specific actions based on the user's choice.

## 3.4. Constraints

All of the above functions display modal dialogs. While this modal is open, script execution is paused, and the user cannot interact with the rest of the page.

Additionally, the position and appearance of these modal dialogs are determined by the browser, and developers cannot control them. This is a trade-off for simplicity.

# 4. Type Conversion

We will focus only on type conversions for primitive types. Type conversions for object types will be covered later.

## 4.1. Conversion to String

You can convert any value to a string using the String function.

```js
let booleanValue = true;
console.log(typeof booleanValue);
let stringValue = String(booleanValue);
console.log(typeof stringValue); // Converted to string and outputs "string".
```

Also, if a non-string type is encountered where a string is expected, automatic conversion to a string occurs. For example, the alert function converts the passed argument to a string for output. In addition, when adding a string to another type, the other type gets converted to a string.

```js
console.log(10 + "string"); 
// 10 is converted to a string and results in "10string".
```

## 4.2. Conversion to Number

Likewise, you can convert to a number using the Number function, as in `Number(target)`.

Moreover, conversion to a number occurs automatically in mathematical functions or expressions. If a non-number type is encountered in a situation where a number is expected, it is automatically converted to a number. If a non-numeric value is attempted to be converted, it becomes NaN.

For example, since subtraction only accepts numbers, if a string is used, it converts automatically to a number.

```js
console.log(10 - "5");
// "5" converts to 5, resulting in 5.
```

However, if a string contains characters that cannot convert to a number, it results in NaN.

```js
console.log(10 - "Kim Seong-hyun"); // NaN
```

The rules for converting to a number are as follows:

- undefined becomes NaN.
- null becomes 0.
- true or false becomes 1 or 0, respectively.
- Strings have leading and trailing spaces removed; if empty after that, they become 0. If a space-removed string can convert to a number, it converts accordingly; otherwise, it results in NaN.

## 4.3. Conversion to Boolean

Values used in operations that require a boolean type automatically convert to a boolean. Alternatively, the Boolean function can be used to achieve this.

```js
console.log(Boolean(0)); // false
```

The rule is simple: falsy values convert to false, while all others convert to true.

Falsy values include the number 0, -0, 0n, empty strings, null, undefined, and NaN.

<span style="color:red">Note that an empty array is not a falsy value.</span>

# 5. Basic Operators and Mathematics

## 5.1. Mathematical Operators

Mathematical operators include +, -, *, /, %, **. The % operator is a remainder operator, while ** is the exponentiation operator. Note that the exponentiation operator works for non-integer values as well, like `3**(1/2)`.

### 5.1.1. Remainder Operator and Negatives

The remainder operator is straightforward when both operands are positive. For instance, the result of 5%3 is clearly 2. But what about -5%-3? Experiments reveal it results in -2.

The sign of the remainder operator's result always follows the sign of the left operand.

```js
5%3 // 2
5%-3 // 2
-5%3 // -2
-5%-3 // -2
```

If the remainder is 0, and the left operand is negative, the result will be `-0`.

```js
-4 % -2 // -0
```

The remainder of NaN is NaN. Also, the remainder of Infinity is NaN.

### 5.1.2. Operators and Type Conversion

Except for addition, all mathematical operators accept only number types. Thus, if the operand is not numerical, it is automatically converted to a number.

```js
10 - '3' // 7
'10' / '3' // 3.3333333333333335
```

The addition operator can also be used as a unary operator. If a number is prefixed with `+`, it remains unchanged unless it is not a number, in which case it converts to a number. The `+` can also serve as a numerical conversion instead of a Number function.

```js
+"123" // 123
```

## 5.2. Assignment Operators

The assignment operator `=` assigns the value of the right operand to the left operand. Just like addition operators return values, this assignment operator also evaluates to a value—the value assigned to the left operand.

```js
let a = 1;
let b = 2;
// c=2+3 is equivalent. a gets 2 and b gets 3.
let c = (a = 2) + (b = 3);
console.log(a, b, c);
```

You can also use chaining to assign multiple variables at once.

```js
a = b = c = 3;
```

However, code that relies on the evaluation of assignment operators is generally discouraged.

## 5.3. Compound Operators

Compound operators combine the logical and assignment operators. For example, `+=` combines the addition and assignment operators.

## 5.4. Increment and Decrement Operators

The increment and decrement operators, represented by `++` and `--`, increase or decrease the size of the operand by 1. There are prefix and postfix versions. As in C language, the prefix version alters the operand's value before use, while the postfix version uses the original value and then alters it.

Moreover, increment and decrement operators have higher precedence than most operators, so they are evaluated first.

## 5.5. Bitwise Operators

These are operators that manipulate bits. They include &, |, ^, ~, `<<`, `>>`. The right shift operator `>>>` also exists, which fills the sign bit with 0.

## 5.6. Comma Operator

The comma operator allows multiple expressions to be executed and evaluated in one line of code. Among the expressions connected by commas, only the last expression's evaluation result is returned.

Be cautious, as the comma operator has low precedence, so it should be wrapped in parentheses for proper usage.

```js
// Only the last expression among (1,2,3,4,5) is evaluated, thus a becomes 5.
let a = (1,2,3,4,5);
```

Although not recommended for readability, the comma operator can be useful in contexts where multiple actions are processed in a single line. A usage example is as follows.

```js
for(let l=0,r=0;r<s;l++,r++){
  if(left[l]!=right[r]){
    if(diff){p=0;break;}
    r--; diff++;
  }
}
```

# 6. Comparison Operators

JavaScript has comparison operators that function similarly to those in C language, indicating equality and inequality.

## 6.1. Evaluation Results

The result of a comparison operator expression evaluates to true or false based on the outcome. For example, `2>1` evaluates to true.

## 6.2. String Comparison

In JavaScript, strings are compared lexicographically. A string that appears later in the dictionary is considered larger. This comparison algorithm works by comparing characters one by one; if they are equal, it continues; when a different character is found, it returns the result based on that comparison. If one string ends before the other, the longer string is deemed larger.

Characters are compared not lexicographically but by their Unicode values. Thus, 'a' is greater than 'A', and '가' is greater than 'a' because of the higher Unicode value.

## 6.3. Comparison of Different Types

When the operand types of a comparison operator differ, they are converted to numbers for comparison. For example, evaluating `'2'>1` transforms the string '2' to a number, resulting in an expression `2>1`, which evaluates to true. More details on comparisons of different types can be found [here](https://www.witch.work/javascript-compare-different-types/).

This situation also arises with the equality operator `==`. It is widely known that `0=='0'` evaluates to true because `==` performs type conversion before comparison. Consequently, `0==false` also evaluates to true.

To avoid this issue, use `===` or `!==`, which are strict comparators that also check for type equality.

## 6.4 Null and Undefined

What happens when comparison operators are applied to null and undefined?

```js
null===undefined
```

The above expression returns false because the two values have different types. As discussed earlier, null is a null type, while undefined is a type constructed solely of undefined.

```js
null==undefined
```

However, the above expression returns true, as `==` applies a special rule to deem null and undefined equal. This is stated in the [specifications](https://262.ecma-international.org/5.1/#sec-11.9.3).

```js
null > 0 // false
null < 0 // false
null >= 0 // true
null == 0 // false
```

When comparing null using the >, <, >=, or <= operators, it is treated as 0. Thus, `null > 0` equates to `0 > 0`, resulting in false, and `null >= 0` equates to `0 >= 0`, yielding true.

However, when `null==0` is used, `==` does not involve type conversion, meaning that when one operand is null, the only scenario for true is when the other operand is null or undefined, and all other cases will return false.

```js
undefined > 0 // false
undefined < 0 // false
```

When used with comparison operators, undefined converts to NaN. Since comparisons yielding NaN always return false, the outlined results are achieved.

```js
undefined == 0 // false
```

When comparing undefined with `==`, it can only return true if the other operand is null or undefined; otherwise, it returns false.

Therefore, be particularly cautious when using comparison operators involving null or undefined.

# 7. if and Ternary Operator ?:

JavaScript, like other languages, has an if statement. It evaluates the condition inside if() parentheses and executes the code block within braces if the evaluation result, converted to boolean, is true.

Remember that falsy values that convert to false are limited to 0, empty strings, null, undefined, and NaN.

```js
if(NaN){
    // This block will never be executed.
}
```

Else and else if operate in the same manner as in other languages.

Moreover, the ternary operator `?:` functions similarly to that in C language, though using an if statement is recommended for better readability except in very simple cases.

# 8. Logical Operators

The logical operators include ||, &&, and !. Their basic functions are similar to those in other languages.

## 8.1. OR

The OR operator `||` evaluates the expression to true if either operand is true. This works the same as in other languages, but it can be utilized differently.

The OR operator evaluates operands from left to right and returns the first truthy value found. If all operands are falsy, the last operand is returned. This can be used to find the first true variable among several.

```js
0 || "" || NaN // All are falsy, so last operand NaN is returned.
null || "Kim Seong-hyun" || "a" // First truthy operand "Kim Seong-hyun" is returned.
```

Additionally, JavaScript supports short-circuit evaluation functionality. If a truthy value is encountered, subsequent operands are not evaluated. This can be useful when you want to execute a command only if the left condition is falsy.

```js
let me = "Alex";
me === "Ben" || console.log("You are not Ben.");
```

This simple example prints a specific message if the name is not Ben.

## 8.2. AND

The AND operator `&&` evaluates the expression to truthy only when both operands are truthy.

Similar to the `||` operator, it evaluates operands from left to right, returning the first falsy value. If both values are true, the last operand is returned.

```js
1 && 2 && null && 3 // Returns the first falsy which is null.
```

It can also be used to execute commands when the left command is true.

```js
let me = "Ben";
// The console log will be executed only when me equals Ben.
me === "Ben" && console.log("You are Ben!");
```

However, using these AND and OR functionalities in place of if statements can harm readability, so they should be used accordingly.

## 8.3. Precedence

`&&` has a higher precedence than `||`. Thus, `&&` is evaluated first.

Therefore, in the expression `null || 2 && 3 || 4`, `2 && 3` is evaluated first, resulting in `null || 3 || 4`, and the final result is 3.

## 8.4 NOT

The NOT operator `!` returns the inverse of the boolean value of the operand. For example, `!0` converts 0 to boolean (false) and returns the inverse, resulting in `!0` equal to true.

Using `!` twice returns the value of the operand converted to boolean, yielding the same outcome as using the Boolean function.

Additionally, NOT has a higher precedence than AND and OR, so it is evaluated first. The order of precedence is NOT > AND > OR (evaluated first).

# 9. Nullish ??

The ?? operator returns the right operand when the left operand is null or undefined, and otherwise, it returns the left operand. It is evaluated from left to right.

Thus, it returns the first defined operand among the operands. This distinction makes it different from `||`. For instance, if you assign a default value using `||`, consider the following.

```js
let result = count || 1; 
```

If count is falsy, result will be set to the default value of 1. However, if count represents the count of items, then 0 is certainly a meaningful value. Using `||` would treat 0 as a falsy value, thus assigning 1 to result. Instead, you should use `??`.

```js
let count = 0;
let result = count ?? 1;
console.log(result); // Outputs 0
```

The precedence of `??` is 5, making it lower than most operators, so it's good practice to use parentheses.

Short-circuit evaluation also functions the same way: if the left operand is determined to be not null or undefined, the right operand will not be evaluated.

Lastly, note that `??` cannot be combined with `&&` or `||`, as doing so results in a syntax error.

```js
true || undefined ?? "foo"; // SyntaxError occurs
```

However, using parentheses to explicitly define precedence works fine.

```js
true || (undefined ?? "foo") // Operates correctly, resulting in true.
```

# References

[Meaning of Dollar Sign in JavaScript Variable Names](https://stackoverflow.com/questions/846585/what-is-the-purpose-of-the-dollar-sign-in-javascript)

[MDN Template Literals](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Template_literals)

[Why is null an object in JavaScript?](https://stackoverflow.com/questions/18808226/why-is-typeof-null-object) and [Original Article](https://2ality.com/2013/10/typeof-null.html)

[JS Falsy Values](https://developer.mozilla.org/ko/docs/Glossary/Falsy)

[Remainder Operator](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Remainder)

[Nullish Coalescing Operator - JavaScript | MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
