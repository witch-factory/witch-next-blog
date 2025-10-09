---
title: Modern JavaScript Tutorial Part 1.3 Code Quality - 1
date: "2022-12-27T00:00:00Z"
description: "ko.javascript.info part 1-3 first"
tags: ["javascript"]
---

# 1. Debugging in Chrome

Press `F12` in Chrome or `Ctrl + Shift + I` on Mac to open the Developer Tools. Within it, there is the Sources panel. This panel allows you to view the code of the loaded page and debug it. It displays all resources used to construct the page in a tree format and provides access to their source.

Let's learn through an example. First, create index.html as follows:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Study Page</title>
  </head>
  <body>
    <script src="./script.js"></script>
  </body>
</html>
```

Next, write a simple script.js as follows:

```js
function hello(name) {
  console.log("Hello ", name);
}

function goodbye(name) {
  console.log("Goodbye ", name);
}

function greeting(name) {
  hello(name);
  goodbye(name);
}

greeting("witch");
```

Upon running index.html, you will see 'Hello witch' and 'Goodbye witch' printed in the console.

## 1.1. Setting Breakpoints

Now, let's open the Developer Tools. By clicking on script.js in the Sources panel, you will see the code as follows.

![devtools](./scriptjs-devtools.png)

To set a breakpoint, click on the line number in the source view. Breakpoints have been set on lines 6 and 10 as shown below.

![breakpoint](./break.png)

Now, refresh the page, and the execution will pause at the breakpoint. The message `Paused in debugger` will appear, allowing you to perform actions such as continuing execution to the next breakpoint.

In the example given, execution begins at `greeting("witch")`, immediately moving into the greeting function and halting at line 10, the first breakpoint. The next breakpoint triggers within the goodbye function at line 6 when the goodbye function is called.

While paused at a breakpoint, you can view the call stack (the sequence of function calls leading up to the breakpoint) and all currently defined variables (available in the scope), which aids in debugging.

For instance, you can see the call stack and currently defined variables. It indicates that the execution has reached the breakpoint at line 6 via the greeting function and the goodbye function, with the variable `name` defined.

![info](./devtool-info.png)

In addition, you can use the keyword `debugger` in the code to set a breakpoint at the point of execution. This allows you to set breakpoints without leaving the editor.

```js
function greeting(name) {
  hello(name);
  debugger;
  goodbye(name);
}
```

## 1.2. Action During Execution Trace

Let's explore features such as moving to the next breakpoint and executing the next command while debugging.

### 1.2.1. Resume

Resumes the script execution, running until the next breakpoint is reached. If there are no further breakpoints, execution completes to the end of the script. The shortcut key is `F8`.

### 1.2.2. Step

Executes the next statement. If there is a function call, it moves into the called function to execute the next statement. This allows executing the entire script one statement at a time. The shortcut key is `F9`.

### 1.2.3. Step over

Executes the next statement without stepping into any function. Consider a situation where a breakpoint is set on line 10 at the hello call.

![step-over](./stepover.png)

If you use step here, it will proceed into the hello function, executing line 2. However, if you use step over, it will skip into the execution of the goodbye function on line 11 without entering the hello function. The shortcut key is `F10`.

### 1.2.4. Step out

Executes until the currently running function finishes and then moves to the next command after the function. This is useful for quickly concluding a function's execution to proceed forward. The shortcut key is `Shift + F11`.

### 1.2.5. Step into

Executes the next command similarly to step. However, it behaves differently for asynchronous function calls. While step ignores asynchronous actions, step into delves into the asynchronous code and may wait until the asynchronous operation completes if necessary. The shortcut key is `F11`.

# 2. Writing Comments

Writing comments that describe everything happening in the code is generally not advisable. Ideally, it is best to structure functions appropriately and name them well so that the code is understandable without comments.

However, there are cases where comments are beneficial. Firstly, comments explaining architecture are useful. Comments that describe higher-order components or interactions between components assist in understanding code structure.

Additionally, if there is anything non-intuitive, it is better to provide a comment. For example, if there is code with intentional fall-through in a switch statement lacking a break, including a comment is beneficial.

Furthermore, if you have written code to solve a particular issue, documenting the approach can assist in later understanding the code, as parts meant for problem solving may get refactored.

## 2.1 JSDoc

It is also advisable to use commenting syntax called JSDoc to document functions. This includes usages, parameters, and return value information for each function.

Using this, it is easier to comment on APIs, and IDEs can display information on functions or classes. There are also tools that can automatically generate API documentation based on this.

JSDoc comments can be written enclosed with `/** */`, and keywords that start with `@` can be used for documentation.

```js
/**
 * @author witch
 * @param {string} name Name to greet
 * @version 1.0.0
 */
function hello(name) {
  console.log("Hello ", name);
}
```

Common tags include:

### 2.1.1. @author

Indicates the author.

### 2.1.2. @constructor

Indicates that the function is a class constructor. Omitting this is fine since constructor functions are recognized as constructors regardless.

### 2.1.3. @deprecated

Indicates that the function is no longer in use.

### 2.1.4. @exception

Indicates what error the function may throw. It can be written as `@exception {InvalidArgumentException} description`.

### 2.1.5. @exports

Indicates that the function is exported. There is no need for this tag if using the exports object. It is only used when exporting modules other than exports or module.exports. It can be written as `@export modulename`.

### 2.1.6. @param

Describes the function parameters. It can be written as `@param {string} name Name to greet`, detailing parameter type, name, and description.

### 2.1.7. @private

Indicates that the function has private access restrictions.

### 2.1.8. @return, returns

Describes the function's return value. It can be written as `@return {string} Description of the return value`.

### 2.1.9. @see

Indicates relationships with other entities. For example, if the bar function is associated with the foo function, you can write in foo's JSDoc `@see {@link bar}`.

### 2.1.10. @throws

Serves the same function as @exception.

### 2.1.11. @todo

Indicates TODO items pertaining to the function. This can be written as `@todo Task` .

### 2.1.12. @this

Indicates what the `this` keyword refers to when used within other symbols. For example, writing `@this {Foo}` indicates that when used within the Foo object, this function's this refers to the Foo object.

An example of JSDoc documentation is as follows, showing that when setName is used within the Greeter class, this refers to an instance of the Greeter class.

```js
/** @constructor */
function Greeter(name) {
    setName.apply(this, name);
}

/** @this Greeter */
function setName(name) {
    /** document me */
    this.name = name;
}
```

### 2.1.13. @version

Indicates the version. It can be written as `@version 1.0.0`.

# References

Wikipedia JSDoc documentation: https://en.wikipedia.org/wiki/JSDoc

JSDoc see: https://jsdoc.app/tags-see.html

JSDoc this: https://jsdoc.app/tags-this.html