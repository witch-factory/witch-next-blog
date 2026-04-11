---
title: Regarding the `$` Symbol in Developer Tools
date: "2022-12-28T00:00:00Z"
description: "What does the `$` in Developer Tools signify?"
tags: ["web", "tip"]
---

# 1. Introduction

While developing, you may encounter the `$` symbol in Developer Tools. For example, when selecting an element in the Elements tab, you might see `==$0` appear.

![devtool](./dev-tool.png)

Additionally, after selecting a specific element in the Elements tab and moving to the console window of Developer Tools, typing `$0` will output the selected element. What does the use of `$` in Developer Tools mean?

Let’s explore the handy expressions that include `$` in Developer Tools and some other convenient functions.

# 2. Basics

## 2.1. `$_`

`$_` represents the result of the most recently executed command. For instance, if you enter `1 + 2` and press `Enter`, `3` will be displayed. At this point, entering `$_` will also display `3`.

You can similarly apply properties or methods to that result. The example below shows applying `length` to `$_`, which outputs its result. Methods like `toUpperCase()` can also be applied to strings.

![underbar](./underbar.png)

## 2.2. `$0`, `$1`, `$2`, ...

`$0`, `$1`, `$2`, `$3`, and `$4` represent historical references to DOM elements selected in the Elements tab. Elements selected via the cursor are also included here.

`$0` refers to the most recently selected element, `$1` refers to the one selected before that, and so forth, allowing for a history of up to five selected elements.

It is also possible to edit these referenced DOM elements. For example, I can select my profile picture on my blog.

Using the Select cursor in Developer Tools, I can select my profile's self-introduction, which is contained within a `<p>` tag.

![select](./p-select.png)

Now, entering `$0` will confirm the selected tag. If I select another element in the Elements panel afterward, the previous `$0` becomes `$1`, and the new selection becomes `$0`.

![p-history](./p-history.png)

Now, applying `innerHTML` to `$0` will allow me to check the message written inside. Since `$0` contains a reference to the DOM element itself, it can also be edited.

![p-edit](./p-edit.png)

After editing, I can see that my blog's self-introduction section has changed.

![p-edit-complete](./p-edit-complete.png)

# 3. Shortcut Expressions for Other Functions

## 3.1. document.querySelector

`$(selector)` is a shorthand for `document.querySelector(selector)`. This allows for selecting DOM elements using CSS selectors.

Therefore, entering `$(selector)` in Developer Tools will select the first DOM element that corresponds to the given selector in the document. You can check attributes of the selected tag, such as `$('p').innerHTML`.

Furthermore, by right-clicking the resulting DOM element and selecting "Reveal in Elements Panel," the Elements panel will open with the corresponding element selected.

This function can also accept a second argument, which determines the starting node for searching for elements matching the selector. The default is `document`.

Note that in jQuery, `$` is already a defined function. If jQuery is in use, the library's `$` function will be utilized.

## 3.2. document.querySelectorAll

`$$(selector)` is a shorthand for `Array.from(document.querySelectorAll())`. It returns an array containing all elements that match the provided CSS selector.

For example, you can create an array containing all `<p>` tag elements on the page and easily compute its length.

![selectall](./selectAll-p.png)

This function can also accept a second argument that determines the starting node for searching elements matching the provided CSS selector. The default is `document`.

## 3.3. XPath Expression

`$x(path)` allows for selecting DOM elements using XPath expressions. XPath is a language for navigating XML documents, and since HTML documents are also XML, XPath can be used to navigate HTML documents.

For example, `$x('//p')` selects all `<p>` tag elements on the page. Additionally, `$x('//p[a]')` selects all `<p>` elements containing an `<a>` tag. It acts similarly to a kind of regex in XML, which may require further study.

This function can also accept a second argument that determines the starting node for searching elements matching the XPath expression. The default is `document`.

# 4. Other Functions

Additional functions available in the Developer Tools console include:

## 4.1. copy()

`copy(object)` copies the string representation of the provided element to the clipboard. It can be used as `copy($0)`.

## 4.2. debug(function)

This functionality activates the debugger and sets a breakpoint within the provided function. It aids in debugging via the Sources panel.

It may be more beneficial to use the breakpoint functionality directly within the Sources panel for debugging.

You can remove breakpoints set by `debug(function)` using `undebug(function)`.

## 4.3. dir(object)

`dir(object)` outputs the properties of the provided object. It can be used as `dir($0)`, functioning similarly to `console.dir`. There is also a `dirxml(object)` function.

## 4.4. inspect(object/function)

This displays the given element or object in the appropriate panel. For example, using `inspect($0)` or `inspect(document.body)` will open the Elements panel with the corresponding DOM element selected.

If the given argument is a function, it will navigate to the location where that function is defined in the Sources panel.

## 4.5. getEventListeners(object)

This outputs the object containing the event listeners registered on the specified object. Each event, like click or keydown, is mapped to an array of the corresponding listeners.

## 4.6. keys(object)

`keys(object)` returns the properties of the provided object.

```js
let info = {
  name: "Kim Seong-hyun",
  blog: "witch.work",
}

console.log(keys(info)) // ["name", "blog"]
```

There is also a function called `values(object)` that returns an array of the values mapped to the object's properties.

![values](./values.png)

## 4.7. monitorEvents(object[, events])

`monitorEvents(object[, events])` monitors the event listeners registered on the provided object. When an event listener is called, it prints to the console.

```js
monitorEvents(document.body, ["click", "keydown"])
```

Using the example above, it will log to the console whenever the click or keydown event listeners registered on `document.body` are called.

You can also monitor events based on their type. For instance, to monitor all key-related events on `document.body`, you could use `monitorEvents(document.body, "key")`.

Other event types include mouse, touch, and control.

You can stop monitoring event listeners on the specified object with `unmonitorEvents(object[, events])`. Using `unmonitorEvents(object)` will remove all event monitoring for that object.

## 4.8. monitor(function)

`monitor(function)` monitors the specified function. It logs to the console every time the function is called, displaying a message along with its arguments each time it is executed.

![monitor](./monitor.png)

You can stop monitoring the specified function using `unmonitor(function)`.

## 4.9. queryObjects(constructor)

`queryObjects(constructor)` returns an array of objects created by the provided constructor function. For example, using `queryObjects(HTMLDivElement)` will return objects created by the HTMLDivElement constructor.

If `a` is a class name, using `queryObjects(a)` will return all objects instantiated via `new a()`. This can also be applied to built-in constructor functions like Promise.

Using `queryObjects(Promise)` will return all objects created by the Promise constructor (`new Promise()`).

## 4.10. table(data)

This is a shorthand for `console.table()`, outputting the given object in a table format. You can apply it to a data object, for example:

```js
const data = [
  { name: "John", age: 30, city: "New York" },
  { name: "Jane", age: 25, city: "San Francisco" },
];
table(data);
```

A second argument—a columns array—can optionally be provided. When supplied, only keys included in this array will be displayed from the given object.

![table](./table.png)

# References

[Questions about `$` on Stack Overflow](https://stackoverflow.com/questions/11778477/variable-dollar-sign-in-chrome)

[Documentation on Chrome Console Utilities](https://developer.chrome.com/docs/devtools/console/utilities/)