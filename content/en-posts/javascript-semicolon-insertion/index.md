---
title: Exploring JavaScript - Automatic Semicolon Insertion
date: "2024-08-23T01:00:00Z"
description: "JS automatically inserts semicolons into the code. Let's understand the rules."
tags: ["javascript"]
---

(Originally written on 2022.12.16)

(Updated on 2024.08.23)

# 1. Introduction

## 1.1. Automatic Semicolon Insertion

JavaScript is a language where semicolons can be omitted while writing code. The following code works perfectly fine without any semicolons.

```js
const name = "Witch";

function greet() {
  return `Hello, I am ${name}.`;
}

console.log(greet());
```

The reason this code operates correctly is that the JavaScript engine automatically inserts semicolons when interpreting the code. This is called automatic semicolon insertion (ASI) and is defined in the ECMAScript standard specification.

However, this automatic semicolon insertion is not infallible. A representative example can be seen in the following [example](https://ko.javascript.info/structure):

```js
alert("This will cause an error.");

// TypeError: Cannot read properties of undefined (reading '2')
[1, 2].forEach(alert);
```

When executing this code, only the `alert` executes without issue, after which an error occurs. This is because JavaScript does not automatically insert a semicolon before the square brackets in the code. Therefore, the code is interpreted as follows:

```js
alert("This will cause an error.");[1, 2].forEach(alert);
```

This transformation results in a clearly erroneous code.

Automatic semicolon insertion allows omitting semicolons, which can lead to cleaner-looking code but also causes errors. Therefore, if you want to write code in a style that omits semicolons, you must be well aware of the rules and precautions.

In this document, we will explore the rules followed by automatic semicolon insertion and the precautions to take when omitting semicolons. References include explanations from the ECMAScript specification and several books such as "Effective JavaScript."

## 1.2. Statements Ending with Semicolons

First, here are the types of statements in JavaScript that must end with a semicolon. These statements can be affected by the automatic semicolon insertion discussed later.

- Empty statements
- `let`, `const`, `var` statements
- Expression statements
- `do...while` loops
- `continue`, `break`, `throw`, `return`
- Import, export statements, module declarations
- Class field declarations
- `debugger`

The terms "empty statement" and "expression statement" may be unfamiliar. Here is their meaning:

- **Empty Statement**: As the name suggests, this is a statement that does nothing. It must end with a semicolon.

```js
;
```

For example, it can be used as the body of a `for` loop. In the following code, it's a code that sets all elements of `arr` to 0, wherein the loop iteration itself is the sole purpose, so the body is an empty statement.

```js
let arr = [1, 2, 3, 4, 5];
for (let i = 0; i < arr.length; arr[i] = 0, i++);
```

- **Expression Statement**: This consists of expressions. The expression is evaluated, and its result is discarded. A simple example would be:

```js
1 + 2; 
```

Assignment operations are also expressions since they are operators. Therefore, assignment statements are a form of expressions. Side-effect expressions are used in this manner.

```js
a = 3; // This evaluates to 3, but the result is discarded.
```

# 2. Four Rules

Let's examine the rules that govern automatic semicolon insertion in detail. They can be summarized into four rules.

## 2.1. First Rule

> Semicolons are only inserted when the next input token cannot be parsed.
>
> "Effective JavaScript" p. 27

JavaScript programs consist of streams of tokens. These streams are parsed from left to right by the parser. Here, a token is a parsing unit, simply put, it refers to the minimal components that make up the code, such as JavaScript reserved words, identifiers, literals, punctuation, etc. For the purpose of this discussion, we can think of them as simply units of parsing.

However, during the parsing process, there can be offending tokens that create syntactically incorrect constructs. When this occurs, if the conditions described in the second rule are met, semicolons are inserted before such tokens.

Thus, we can say that automatic semicolon insertion serves to correct code that violates syntax. For example, consider the following code:

```js
a = b
func()
```

If this were parsed as `a = b func()`, it would result in an error. Thus, a semicolon is inserted before the offending token `func`, interpreting the code as `a = b; func()`.

## 2.2. Second Rule

> Semicolons are inserted only before a newline, before the end of a program input, or before a `}` token.
>
> "Effective JavaScript" p. 26

As mentioned in the first rule, semicolons are inserted before offending tokens that create incorrect syntax. However, semicolons are not necessarily inserted every time an offending token appears in the parsing process. The conditions under which semicolons are inserted are as follows:

- When an offending token is separated from the previous token by a newline character, a semicolon is inserted before the offending token.
- When the offending token is `}`, a semicolon is inserted before it.
  - For example, in `{1 2} 3`, when `}` is parsed, it creates an error, so a semicolon is inserted before the offending token `}`. Thus, it is interpreted as `{1 2;} 3`.
- If the previous token is `)` and the inserted semicolon serves to terminate a do-while loop, a semicolon is inserted after the `)`.
- If the input stream of tokens ends and the parser cannot parse the token stream as a complete program, a semicolon is inserted at the end of the input stream.

At this point, a newline character refers to a line terminator defined in the specification and includes characters such as `\n` (Line Feed), `\r` (Carriage Return), `\u2028` (Line Separator), `\u2029` (Paragraph Separator), and `\r\n` (Carriage Return + Line Feed).

Not being able to parse the token stream as a complete program refers to cases where the parsed program code cannot be considered complete. A simple example is the following:

```js
let a = 1
++a
```

Here, the parser first inserts a semicolon after `let a=1`. The previous token `1` and `++` are separated by a newline, which makes interpreting it as `a=1 ++a` syntactically incorrect, resulting in `++` being the offending token.

However, the parsed token stream `let a=1; ++a` cannot be considered a complete program because there is no semicolon after `++a`. Thus, a semicolon is automatically inserted at the end.

This means that the resulting automatic semicolon insertion produces:

```js
let a = 1;
++a;
```

In other words, if the parsed code cannot be considered a complete program, a semicolon will be automatically inserted.

## 2.3. Third Rule

> JavaScript forcibly inserts semicolons even if a parsing error is not detected. These are known as restricted productions, meaning no new lines are allowed between two tokens.
>
> "Effective JavaScript" p. 31

Even when the result of parsing the program is technically correct, the JavaScript specification does not allow new lines between certain keywords and their subsequent arguments. When a newline occurs in such places, semicolons are automatically inserted.

A representative keyword that creates such a situation is `return`. If a newline is present between `return` and the return value, it will not operate correctly. For example:

```js
return
a + b
```

Although this could be parsed as `return a+b`, it is technically correct. However, a newline has been inserted between `return` and `a+b`, resulting in an automatic semicolon insertion.

If you wish to introduce a newline in this manner, you can wrap the return value in parentheses. [A similar example is discussed in the React documentation regarding markup returns.](https://react.dev/learn/your-first-component#step-3-add-markup)

If the markup goes beyond the line with the `return` keyword, it is enclosed in parentheses as follows:

```jsx
return (
  <div>
    <h1>Hello, world!</h1>
  </div>
);
```

When documenting all cases where this rule is applied, any newline between specific keywords and their additional arguments will result in automatic semicolon insertion. This is indicated as `<here>` in the list below:

- Between `break`, `continue`, and explicit labels
  - `break <here> label;`, `continue <here> label;`
- Between `return`, `throw`, and expressions
  - `return <here> expression;`, `throw <here> expression;`
- Between `yield` and expressions or expressions beginning with `/*`
  - `yield <here> expression;`, `yield <here> * expression;`
- Between the parameter list and the arrow in arrow functions
  - `(param1, param2...) <here> => expr`
- Between the `async` keyword and `function`, `function*`, or arrow function declarations
  - `async <here> function() {}`, `async <here> function*() {}`, `async <here> () => {}` (and this includes the parameter list and the arrow)
- Between the `async` keyword and class method declarations
  - `async <here> method() {}`, `async <here> *method() {}`
- Between expressions and postfix expressions
  - `expression <here> ++`, `expression <here> --`

This application of the rule concerning postfix expressions is aimed at resolving ambiguity within the code. For example, if the following code did not have semicolons inserted automatically, it would be unclear whether `++` is a postfix for `a` or a prefix for `b`.

```js
a
++
b
```

Under the third rule, a semicolon is inserted between `a` and `++`, leading to the interpretation:

```js
a;
++b;
```

It can also be noted that a semicolon is inserted at the end of the program as per the second rule.

## 2.4. Fourth Rule

> Semicolons are never inserted as delimiters for `for` loops or in empty declarations.
>
> "Effective JavaScript" p. 33

This means that when a delimiter for a `for` loop or an empty statement (`;`) is required, you must explicitly insert a semicolon. In other words, if the insertion of a semicolon would be interpreted as a delimiter for a `for` loop or as an empty statement, a semicolon will not be inserted.

For example, in the following code, even though there are offending tokens and a newline, no semicolon is inserted, and an error occurs as the semicolon would be interpreted as a `for` loop delimiter.

```js
for (let i = 0, total = 1
  i < 10
  i++) {
  total *= i;
}
```

For the same reason, an explicit semicolon must be included in loops with empty statements.

```js
function loop() { while (false) } // Parsing error
function loop() { while (false); } // Parses correctly
```

# 3. Regarding Semicolon Omission

Nowadays, it is commonly recommended to rely on automatic insertion of semicolons, and many code correction tools insert semicolons automatically without the programmer needing to worry about it. Therefore, it seems that developers typically add semicolons explicitly.

However, there are many people who prefer a style that omits semicolons, as well as existing code written in such a style. Therefore, if you wish to follow or work with such a style, understanding the rules of automatic semicolon insertion is essential. Omitting semicolons without consideration may lead to unintended behavior of the code.

For example, the following program operates correctly with three semicolons automatically inserted at the end of each statement:

```js
a = b
var x
(f())
```

However, if the order is changed, a semicolon will not be inserted correctly, resulting in an error.

```js
a = b // A semicolon is not inserted correctly here
(f())
var x
```

This section will review potential issues that can arise when semicolons are indiscriminately omitted, as well as the rules to follow when doing so.

## 3.1. Issue Examples with Semicolon Omission

Automatic semicolon insertion occurs during the parsing process of the code. Therefore, if the code is syntactically valid, no semicolon will be inserted. In particular, great care should be taken with the characters `(`, `[`, `+`, `-`, `/`, and <code>\`</code> since they can be interpreted as operators or prefixes depending on the context.

For example, suppose a function is enclosed in parentheses as an Immediately Invoked Function Expression (IIFE).

```js
a = b
(function() { console.log('hello'); })()
```

This code could be parsed as `a=b(function(){console.log('hello');})()`. If `b` is a function, it might execute the code correctly. This indicates that a semicolon is not inserted due to the possibility of it being a single declaration. The same reason applies to the absence of a semicolon between `a = b` and `(f())`, as it could be interpreted as `a = b(f())`.

Another caution regarding `[` arises in examples related to arrays. Consider the following code:

```js
func()
['ul', 'ol'].forEach(function(tag){ handleTag(tag); });
```

In this case, the brackets on line 2 could be interpreted as indexing the result of `func()`, with the commas within the brackets considered as comma operators. Thus, the following code will not have an automatic semicolon inserted and will be interpreted as unintended:

```js
func()['ol'].forEach(function(tag){ handleTag(tag); });
```

When it comes to operators `+`, `-`, and `/`, these generally do not appear at the start of declarations, though instances like `/`, which is used for regular expression literals, warrant caution. For example, consider this code:

```js
a = b
/hi/g.exec('hi');
```

This code could be interpreted as `a=b/hi/g.exec('hi')`, where the regular expression’s `/` is mistakenly parsed as a division operator. Thus, no semicolon is inserted, leading to issues with the intended behavior or raising an error.

As such, when omitting semicolons, one must carefully observe the first token of the subsequent line. If the first token of the next line can be interpreted as a continuation of the previous code, omitting the semicolon may lead to issues.

These problems may not only arise in simple code but can also interfere with script merging. Previously, when module systems were not standardized, wrapping each file in an IIFE for limit scope was often recommended. Therefore, many files contained code like the following:

```js
//file1.js
(function(){
  //code
})()

//file2.js
(function(){
  //code 2
})()
```

If these files are merged and executed as one, they might be processed as follows, leading to issues:

```js
(function(){
  //code
})()(function(){
  //code 2
})()
```

Certainly, it would be beneficial if script merging tools handled such cases appropriately. However, not all script merging tools are well-designed (as noted in "Effective JavaScript"), so it may be advisable to adopt a style of inserting semicolons at the start of files that may be merged.

```js
//file1.js
;(function() {
  //code
})()
```

## 3.2. Rules to Follow When Omitting Semicolons

If you find a semicolon omission style visually appealing and wish to adopt it, you must understand the rules of automatic semicolon insertion.

According to the second rule, semicolons can only be omitted at the end of lines, at the end of blocks, or at the end of programs.

For example, if semicolons are omitted where no newline is present, automatic semicolon insertion may not occur correctly, leading to errors.

```js
// Uncaught SyntaxError: Unexpected token 'return'
function area(r) {
  r = Number(r) return Math.PI * r * r;
}
```

Additionally, take care with the restricted productions mentioned earlier—keywords that do not allow new lines. The rules recommended by the specification and MDN include:

- Postfix `++`, `--` should be on the same line as their operands.
- `return`, `throw`, `break`, `continue`, `yield` must be on the same line as the following token.
  - If the return value is lengthy and you want to introduce a newline, you can enclose the return value in parentheses.
```js
return (
  someLongExpression
);
```
- The arrow in arrow functions should be on the same line as the parameter list.
- The `async` keyword must be on the same line as the subsequent token (such as the `function` keyword or method name).
- If a line starts with `(`, `[`, `+`, `-`, `/`, or <code>\`</code>, a semicolon should be placed before that line, or a semicolon should be placed at the end of the previous line.
- Class field declarations should always end with a semicolon to avoid ambiguity.
```js
class A {
  a = 1
  [b] = 2
  *gen() {} // Without a semicolon, this is interpreted as a = 1[b] = 2 * gen() {}!
}
```

From my personal experience, using semicolons in JavaScript development is generally more recommended. The reasons include the complexity of the automatic semicolon insertion rules outlined above, as well as the fact that modern tools handle this task automatically.

It is not particularly difficult to add semicolons, and relying on the parser to correct errors during automatic semicolon insertion may not be a good practice. However, if you adhere to the rules while following a style that omits semicolons, the likelihood of issues occurring would be reduced.

Furthermore, understanding these rules is beneficial when refactoring existing code authored in such a style or integrating into organizations that follow such conventions.

# References

Modern JavaScript Tutorial, "Code Structure"

https://ko.javascript.info/structure

JavaScript/Automatic Semicolon Insertion

https://en.wikibooks.org/wiki/JavaScript/Automatic_semicolon_insertion

Lexical Grammar

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar

Empty Statement

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/Empty

https://tc39.es/ecma262/#sec-rules-of-automatic-semicolon-insertion

https://www.informit.com/articles/article.aspx?p=1997934&seqNum=6

Axel Rauschmeier, translated by Han Seon-yong, "Talking about JavaScript"

David Herman, translated by Kim Jun-ki, "Effective JavaScript"