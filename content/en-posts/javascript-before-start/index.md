---
title: Background Knowledge of JavaScript
date: "2023-08-21T00:00:00Z"
description: "Let's explore some background knowledge about JavaScript."
tags: ["javascript"]
---

# 1. Introduction to JS

## 1.1. Uses of JS

While HTML structures and gives meaning to web content and CSS applies styles to that content, JS makes the content dynamic. 

JavaScript is a programming language that operates within the browser. JS virtual machines (engines) like V8 and SpiderMonkey, which are built into the browser, read JS scripts, convert them into machine code, and execute them.

With this, pages can be made dynamic. For example, each DOM element has a style attribute containing all of its inline CSS styles; JS can change these to control styles dynamically.

Additionally, client-side JS can utilize browser APIs (like DOM API, Canvas, and [Audio/Video APIs](https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery)), as well as many third-party APIs to do even more.

Of course, JS can also be used server-side with tools like [Express](https://expressjs.com/ko/).

## 1.2. Operation of JS

When a web page is loaded in the browser, it first fetches the HTML and CSS. It then parses the HTML to create the DOM and parses the CSS to create the CSSOM. These two are combined to form a render tree.

The render tree consists of nodes displayed on the browser screen. Next, JS code is executed in the order it was written to dynamically modify the render tree and update the UI. While JS is fundamentally an interpreted language, it enhances performance by converting frequently executed code into bytecode through a JIT compiler.

To understand the principles of execution in detail, you can refer to [Wishone's blog](https://velog.io/@wish/JavaScript%EB%8A%94-%EC%96%B4%EB%96%BB%EA%B2%8C-%EC%BB%B4%ED%8C%8C%EC%9D%BC%EB%90%A0%EA%B9%8C).

## 1.3. Limitations of JS

There are several tasks that cannot be performed even in the browser. It can be said that there are things JS cannot do.

First, it cannot handle arbitrary files stored on the disk. This is only possible in special cases like using the `<input type="file">` tag or the `FormData` object.

Furthermore, it cannot access the camera, microphone, or location information without the user's explicit permission. This restriction is in place for security reasons. Permissions, such as 'Allow camera access,' are requests to obtain user consent for such operations.

Generally, different tabs or windows within a browser cannot access each other's information due to the Same Origin Policy. Therefore, for data exchange between two pages, both must consent to the data exchange and include specific JS code.

# 2. Setup and Some Information

Before learning the syntax of JS, we need to set up to use JS. While it can run in the browser or platforms like [code playground](https://playcode.io/), I will use an HTML file.

You can execute scripts by placing the `<script>` tag within the `<head>` tag of an HTML document. In this case, the `src` attribute can be used to load external script files. It is advisable to separate long JS code into `.js` files and load them this way.

Let's first create an HTML file that will serve as the background for executing JS. Create a folder named `js-study` and a file named `index.html`.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Study Page</title>
  </head>
  <body>
    <h1>Witch</h1>
  </body>
</html>
```

Using the Open in Browser extension in VSCode, you can open the HTML file directly through VSCode. Right-click on `index.html` in VSCode and select Open in Default Browser to open it.

Next, we will embed JS as follows.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Study Page</title>
  </head>
  <body>
    <script>
      alert("Hello World");
    </script>
  </body>
</html>
```

## 2.1. `<script>`

As a side note, the `<script>` tag may also have attributes. Let's briefly talk about a few.

The language attribute indicates the scripting language being used. However, it is now deprecated and the `type` attribute should be used instead.

The `type` attribute specifies which scripting language is being used. In HTML4, this attribute was mandatory.

However, in HTML5, this attribute can be omitted. The default is the JS MIME type. Nowadays, it is actually recommended to omit this attribute, thus not explicitly specifying the JS MIME type.

This attribute is also used to designate JS modules. Setting `type="module"` indicates that the code within this tag is a JS module.

As mentioned earlier, using the `src` attribute allows for the use of external scripts (files, URLs, etc.).

```html
<script src="./script.js"></script>
```

If the `<script>` tag has the `src` attribute, the code inside the tag is ignored. For the following file, only the content of `script.js` will be executed.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Study Page</title>
  </head>
  <body>
    <script src="./script.js">
      alert("Hello World");
    </script>
  </body>
</html>
```

## 2.2. Script Loading

You can execute scripts by placing the `<script>` tag within the `<head>` tag of an HTML document. In this case, the `src` attribute can also be used to load external script files.

However, the issue is that all HTML is fetched in order. Consider the following example.

```js
const buttons = document.querySelectorAll('button');

for (const button of buttons) {
  button.addEventListener('click', createParagraph);
}
```

```html
<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>My Test Page</title>
    <script src="test.js"></script>
  </head>
  <body>
    <button>Add Paragraph Button</button>
  </body>
</html>
```

If the above code worked correctly, clicking the button should add a paragraph every time. However, upon execution, it becomes evident that this is not the case.

The `<script>` tag in the `<head>` is loaded before the button tag in the body, leading to the execution of JS `addEventListener` before the button element is loaded. Loading HTML in order leads to this problem. There are three ways to solve this.

The most traditional method is to place the `<script>` tag at the very end of the body, just before the closing tag. This way, the script is loaded after all the HTML has been loaded. However, this presents the issue of not being able to execute any scripts until all HTML is completely fetched.

Another approach is to use `DOMContentLoaded`, which executes the script when the browser has read the entire HTML document.

```html
<script>
  document.addEventListener("DOMContentLoaded", (event)=>{
    // JS code to execute
  });
</script>
```

You can also use the `async` and `defer` attributes, which we will explore in the next section.

## 2.3. async, defer

To resolve the above issues, you can use the `async` or `defer` attributes.

Applying the `defer` attribute to the `<script>` tag makes it execute after the HTML document has been completely read. 

This means it executes after the HTML parsing is complete, just before the `DOMContentLoaded` event occurs. Additionally, the script is loaded in a separate thread during HTML parsing, reducing loading time. The execution of the script is delayed until the page composition is complete.

However, it can only be used when loading external scripts. If the `<script>` tag has no `src` attribute, the `defer` attribute is ignored.

```html
<script src="script.js" defer></script>
```

You can also designate the `async` attribute to the script. In this case, the script operates completely independently of the page loading.

Scripts with the `async` attribute will be downloaded in the background and executed immediately once the download is complete. The page rendering is briefly paused while the script is executing, and will resume upon completion.

With traditional script tags, when HTML parsing encounters a script, it halts the parsing to load and execute the script, then resumes parsing.

Using `async` allows for script loading during HTML parsing. The HTML parsing will only be paused for the time it takes to execute the loaded JS script.

The downside is that because scripts are loaded in parallel during HTML parsing, the execution order of scripts is not guaranteed. They are executed in the order they finish loading. Therefore, use `async` for independent scripts. If the execution order is important, use `defer`.

![Difference between async and defer](./async-defer.jpg)

Source: [MDN Document](https://developer.mozilla.org/ko/docs/Learn/JavaScript/First_steps/What_is_JavaScript#%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8_%EB%A1%9C%EB%94%A9_%EC%A0%84%EB%9E%B5)

Both `async` and `defer` allow scripts to be loaded while the browser is parsing HTML. This ensures the page can continue loading while scripts are being fetched.

Use `async` for scripts that have no dependencies and should be executed immediately upon loading. Use `defer` for scripts that must wait for the DOM loading and need to be executed in order.

# 3. Code Structure

A statement is the syntax structure or command that performs a task. In JS, you can write as many statements as desired, separated by semicolons (`;`). To enhance readability, it is common to place one statement per line.

```js
alert("Hello");
alert("World");
```

## 3.1. Semicolon

As mentioned earlier, statements are separated by semicolons (`;`). However, if there is a line break, the semicolon can be omitted. For example, the following code is valid. A semicolon is automatically added at the end of each statement.

```js
alert("Hello World")
alert("my code")
```

The method of interpreting line breaks as semicolons is known as automatic semicolon insertion. In most cases, line breaks imply a semicolon.

Specific rules concerning this can be found [here, but generally, it is better to always include semicolons between statements.](https://witch.work/posts/javascript-semicolon-insertion)

## 3.2. Comments

Comments can be written anywhere in the script and are ignored by the JS engine, so the placement of comments does not affect execution.

Single-line comments are created using `//`, while multi-line comments are enclosed in `/*` and `*/`.

```js
// Single-line comment
/* Multi
Line
Comment */
```

Note that comments cannot be nested. Placing `/* */` within `/* */` will cause an error.

As a tip, in VSCode, you can select multiple lines of code and press `Ctrl + /` to comment them out. For macOS users, press `Cmd + /` instead. Pressing the same shortcut again on the commented portions will uncomment them all.

This is a convenient feature available in most editors, so it's good to be aware of it.

# 4. Strict Mode

JS introduced new features and made changes to some existing functionalities when it transitioned to ES5. As a result, there were compatibility issues. Thus, a feature called strict mode was added starting from ES5. This feature applies ES5 changes. Otherwise, the previous rules will apply.

To enable strict mode, you should write `"use strict"` at the very top of the script. If it is not at the top level, strict mode will not be applied.

Once strict mode is activated, it cannot be deactivated.

## 4.1. Omitting use strict

Modern JavaScript offers structures like classes and modules. If you are using these, and also have a `type="module"` attribute in your script tag, strict mode will automatically apply to the code. In this case, you can omit `"use strict"`.

Therefore, if you're using modern JavaScript with classes or modules, there's no need to insist on using `"use strict"`.

# 5. Useful Resources

The JS series is primarily based on the JS resources from MDN. https://developer.mozilla.org/ko/docs/Web/JavaScript

For deeper materials, consider the following resources:

The official document for JS, ECMA-262: https://www.ecma-international.org/publications/standards/Ecma-262.htm  
However, for studying, MDN is preferable.

MDN's reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference

Check whether specific features are supported by browsers: https://caniuse.com/

# References

[MDN's type attribute for the script tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#attr-type)

async and defer scripts: https://ko.javascript.info/script-async-defer