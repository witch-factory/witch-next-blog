---
title: Learning Front-End Knowledge Javascript - 4
date: "2023-05-14T00:00:00Z"
description: "MDN Javascript Tutorial - 4"
tags: ["web", "study", "front", "javascript"]
---

This document discusses client-side web APIs.

# 1. Introduction

Client-side JavaScript provides developers with numerous APIs. While these are not formally defined by the JavaScript language itself, they are implemented within client-side JavaScript environments. They can be categorized into browser APIs and third-party APIs.

Common browser APIs include those for manipulating the DOM, such as `getElementById`, as well as network communication APIs like `fetch` and animation APIs like `requestAnimationFrame`. Features such as web storage, including session storage, are also part of what browser APIs offer.

## 1.1. Characteristics of JS APIs

JS APIs operate on slightly different principles, but they generally share common characteristics.

Most APIs consist of JavaScript objects. Objects serve as containers for the data and functions utilized by the API.

For instance, DOM APIs are encapsulated within the `document` object. When invoking an API like `document.getElementById`, you are essentially calling the `getElementById` function from the `document` object.

Typically, APIs have entry points. For example, the DOM API can utilize the document object or instances of HTML elements as entry points.

Another characteristic is that state changes commonly occur through events. Additionally, certain APIs may incorporate security mechanisms similar to those in other web technologies. For instance, some APIs may only function on pages served over HTTPS.

# 2. DOM Manipulation

When creating web pages, there are often instances where you want to change the document structure. DOM APIs can be used in such cases.

## 2.1. Other Web APIs

Referencing [this link](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents#the_important_parts_of_a_web_browser), let's write a new article.

For security reasons, there are many parts of the browser that developers cannot manipulate. However, there are still numerous functionalities available. Commonly used parts when displaying a webpage in a browser include:

The window represents the browser tab displaying the webpage. It is represented as the `Window` object in JS, allowing access to properties such as `innerWidth`, and enabling actions like manipulating the document being loaded into that window.

The navigator contains information about the browser's state. It is represented as the `Navigator` object.

The document corresponds to the actual page displayed in the window. It is represented as the `Document` object, allowing developers to manipulate and change the HTML and CSS information constituting the page using DOM APIs such as `getElementById`. We will explore the document object in detail here.

## 2.2. DOM (Document Object Model) Manipulation

Documents loaded into the browser are represented by the DOM. The DOM is structured as a tree and is generated by the browser to be accessible by programming languages. This constructed DOM is used both when the browser applies styling and when developers manipulate the DOM.

For instance, the following JS code can be used. `querySelector` finds elements in the DOM using CSS selectors.

```js
const linkComponent = document.querySelector('a');
```

The variable now holds a reference to the HTML anchor tag element, allowing access to the properties and methods defined on that element, such as those defined on HTMLAnchorElement or more generic elements like HTMLElement or Node (referring to all general nodes in the DOM). For example, you can use `Node.textContent`.

```js
linkComponent.textContent = 'Click me!';
```

You can also create new elements and add them to the document using methods like `document.createElement` or `Node.appendChild`.

Moving or deleting elements from the DOM is also possible, but it is important to note that we have a reference to the element. Executing the following HTML will demonstrate that the p tag has been moved as a child of the section tag. The original p tag remains intact; it does not mean a new p tag is added as a child of the section! If you want to add a new child, you should use `Node.cloneNode`.

```html
<body>
  <p>Example paragraph</p>
  <section>
    This is a section.
  </section>
  <script>
    const para = document.querySelector("p");
    const sect = document.querySelector("section");

    para.textContent = "Modified text of the example paragraph";
    sect.appendChild(para);
  </script>
</body>
```

You can also manipulate the inline styles of the DOM through this. You can change properties of `HTMLElement.style`.

Alternatively, you can define a class in advance and add it using `Element.setAttribute`. This way, you can apply CSS through classes instead of inline CSS.

```js
elem.setAttribute("class", "newClass");
```

Setting classes dynamically this way has the drawback of requiring pre-defined style classes, but it offers the advantage of better separation of CSS from JS. In larger projects, this approach is commonly adopted.

# 3. Fetching Data from the Server

Instead of reloading the entire page, it is common to update just a portion of the page with data fetched from the server. This subtle detail can lead to significant performance improvements. Therefore, let’s explore the fetch API that enables this.

## 3.1. Overview

A webpage typically consists of HTML, CSS, and JS files, which are fetched from the server. The browser sends HTTP requests to the server to retrieve the necessary files for page loading, and the server responds by providing the requested files. When navigating to another page, new files are requested, and the server sends those files.

However, you may want to update the page with only a portion of data that has changed. For example, while other parts of the page remain the same, only the nickname might change. In such cases, you can use JS APIs to update only the essential parts of the page without reloading. The fetch API is utilized for this purpose.

## 3.2. Fetch API

The fetch API retrieves resources from the network and returns a Promise that resolves when the response is available. The resolved value is a Response object representing the response. The format is as follows.

```js
fetch(resource);
fetch(resource, options);
```

The first argument, resource, is where you provide the path to the resource or pass a Request object. The second argument is an object that includes settings to be applied to the request. The format is as follows.

```js
options object
{
  method: 'GET', 'POST', etc. (request method),
  headers: {
    // object containing additional headers
  },
  body: // data to be included in the request,
  mode: 'cors', 'no-cors', 'same-origin', etc. (mode for the request),
  credentials: 'omit', 'same-origin', 'include', etc. (authentication information for the request),
  cache: // part that defines interaction with HTTP caching,
  redirect: 'manual', 'follow', 'error', etc. (redirect handling method),
  referrer: // referrer to be used in the request,
  referrerPolicy: // referrer policy,
  integrity: // for integrity checking of sub-resources,
  keepalive: // whether the request persists in the background after the page lifecycle ends,
  signal: // used to abort the request if needed during communication,
  priority: // importance degree among similar requests ('high', 'low', 'auto'),
}
```

The Promise returned rejects only in case of network issues and will not reject on HTTP errors. Therefore, you must check `Response.ok` or `Response.status` to handle HTTP errors.

An example is as follows.

```js
fetch(URL).then((res) => {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("HTTP error");
  }
}).then((json) => {
  // Utilize json data.
}).catch((err) => {
  console.log(err);
});
```

## 3.3. XHR

Sometimes, older code may utilize the XMLHttpRequest object, commonly referred to as XHR, which was the previously used method for AJAX communication before the fetch API was introduced.

A simple example code is as follows.

```js
const xhr = new XMLHttpRequest();

try {
  xhr.open("GET", URL);
  xhr.responseType = "json";

  xhr.onload = () => {
    if (xhr.status === 200) {
      console.log(xhr.response);
    } else {
      throw new Error("HTTP error");
    }
  };
  xhr.onerror = () => {
    throw new Error("XHR error");
  };
  xhr.send();
} catch (err) {
  console.log(`XHR error ${xhr.status}`);
}
```

# 4. Graphics Handling

Browsers also provide graphics programming tools. Here, we will discuss the canvas.

## 4.1. History of Web Graphics

The web was originally intended to display documents, containing only text. Subsequently, the `<img>` tag made it possible to display images, and later, the CSS `background-image` property allowed images to be shown as well.

However, since these were still expressed through markup, there were limitations in handling bitmap images, and tools for animation or 3D representation were absent. While libraries like OpenGL made such capabilities possible in C++ and Java, 

the introduction of the canvas element and Canvas API in 2004 enabled handling of 2D animations, data visualizations, and more. Additionally, WebGL emerged around 2006-2007, allowing interactions with 3D graphics. This document will focus solely on 2D canvas.

## 4.2. Working with Canvas

To create 2D or 3D graphics on a page, you need to include the canvas element in the document. This element defines the area where graphics will be drawn.

```html
<canvas width="1920" height="1080"></canvas>
```

If you place any elements inside the canvas, you can designate fallback content for browsers that do not support it, similar to supporting alt text for images.

Write the following HTML.

```js
<canvas class="myCanvas">
  <p>fallback here</p>
</canvas>
```

Set the canvas size using JS, making it fill the entire page. To manipulate the canvas, you need to refer to the drawing context using the `getContext` method. You can specify which context you’d like to retrieve as an argument. Let’s start by getting a 2D canvas.

```js
const canvas = document.querySelector('.myCanvas');
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);
// webgl can also be referenced as a context
const ctx = canvas.getContext('2d');
```

Now ctx is a CanvasRenderingContext2D object, and all drawing on the canvas is performed by manipulating this object. For example, the following code can draw a yellow rectangle.

```js
// rgba() allows you to set transparency
ctx.fillStyle = 'rgb(176,150,0)';
ctx.fillRect(50, 50, 100, 150);
```

Keep in mind that later drawings will appear on top, so be cautious of the order when drawing multiple shapes.

## 4.3. Other Functions

The `fillRect` function earlier mentioned draws a filled rectangle. Conversely, there are functions starting with `stroke` that draw only the outlines.

```js
ctx.strokeStyle = 'rgb(176,150,0)';
ctx.strokeRect(50, 50, 100, 150);
```

You can adjust the line width using the `lineWidth` property.

```js
ctx.lineWidth = 10;
```

You can also create paths.

```js
// Start a path. It starts at (0,0) by default.
ctx.beginPath();
// Move the current position to (100,100).
ctx.moveTo(100, 100);
// Draw a line to (200,100).
ctx.lineTo(200, 100);
// Draw a line to (200,200).
ctx.lineTo(200, 200);
// Render the line.
ctx.stroke();
```

Certainly, `fillStyle`, `strokeStyle`, etc., can also be applied.

To draw circles or arcs, use the `arc()` function. The format is as follows. Drawing a circle or arc centered at x, y with radius radius.

```js
// startAngle, endAngle are in radians.
arc(x, y, radius, startAngle, endAngle)
arc(x, y, radius, startAngle, endAngle, counterclockwise)
```

Text can be rendered using `fillText` or `strokeText`. The format is as follows.

```js
fillText(text, x, y [, maxWidth])
strokeText(text, x, y [, maxWidth])
```

It is also possible to render external images on the canvas using the `drawImage()` method. You create an image object and draw it on the canvas. However, be aware that trying to draw before the image has loaded will result in an error, so use an event listener to draw only after loading completes.

```js
const img = new Image();
img.src = "example.png";
// By providing additional parameters to drawImage, you can draw only a portion of the image
img.onload = () => {
  ctx.drawImage(img, 0, 0);
};
```

Since the contents of the canvas are not accessible to screen readers, it is advisable to set an `aria-label` or provide fallback content within the canvas tag. Here, we will set the aria-label.

```js
canvas.setAttribute("aria-label", "example image");
```

## 4.4. Animation

The canvas offers robust capabilities for creating animations. First, let’s look at a simple example of repeatedly drawing a shape. Start by including the canvas in the HTML document.

```html
<canvas class="myCanvas">
  <p>fallback here</p>
</canvas>
```

Then, get the canvas and set its size, positioning the origin at the center of the page.

```js
const canvas = document.querySelector('.myCanvas');
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

const ctx = canvas.getContext('2d');

ctx.fillStyle = 'rgb(0,0,0)';
ctx.fillRect(0, 0, width, height);

ctx.translate(width / 2, height / 2);
```

Now, let’s add the following code. When you run the page, you will see a triangle rotating.

```js
function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

// The drawn triangle gets smaller and further apart.
for (let i = 0, length = 250, moveOffset = 20; i < length; i++, length--, moveOffset += 0.7) {
  // Change color as length increases
  ctx.fillStyle = `rgba(${255 - length}, 0, ${255 - length}, 0.9)`;
  ctx.beginPath();
  ctx.moveTo(moveOffset, moveOffset);
  // Draw the triangle
  ctx.lineTo(moveOffset + length, moveOffset);
  const triangleHeight = (length / 2) * Math.tan(degToRad(60));
  ctx.lineTo(moveOffset + length / 2, moveOffset + triangleHeight);
  ctx.lineTo(moveOffset, moveOffset);
  ctx.fill();
  // Rotate the canvas slightly with each iteration
  ctx.rotate(degToRad(5));
}
```

However, what we want is an animation that runs repeatedly, with something different drawn on each frame. The JS function `window.requestAnimationFrame()` helps to achieve that.

This function executes the passed-in function as soon as the browser is ready to update the screen. When does this stop? When we stop calling `requestAnimationFrame` or call `cancelAnimationFrame` (it’s a good practice to call this to stop the animation if we don't want to continue).

## 4.5. Simple Drawing App

Creating a drawing app is often a rite of passage for those learning to use the canvas.

![talk](./canvas_talk.jpeg)

MDN presents this as an example, so let’s try it.

First, write the following HTML.

```html
<!DOCTYPE html>
<html lang="en-us">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width">
  <title>Canvas Drawing App</title>
  <script src="main.js" defer></script>
  <link rel="stylesheet" href="index.css">
</head>
<body>
  <section class="toolbar">
    <input type="color" aria-label="select color" value="#ff000">
    <input type="range" aria-label="select line width" min="1" max="50" value="25">
    <span class="output">25</span>
    <button>Reset Canvas</button>
  </section>
  <canvas class="myCanvas">
    <p>Canvas for the drawing app</p>
  </canvas>
</body>
</html>
```

In the JS file, first, set up the basic canvas settings and grab references to the elements.

```js
const canvas = document.querySelector('.myCanvas');
const width = (canvas.width = window.innerWidth);
// Set canvas height slightly smaller than the window
const height = (canvas.height = window.innerHeight - 85);

const ctx = canvas.getContext('2d');

ctx.fillStyle = 'rgb(0,0,0)';
ctx.fillRect(0, 0, width, height);

const colorPicker = document.querySelector('input[type="color"]');
const sizePicker = document.querySelector('input[type="range"]');
const output = document.querySelector('.output');
const clearBtn = document.querySelector('button');
```

Since our pen will draw circles, we create a function to convert between degrees and radians, and an event listener to change the span value according to the pen thickness.

```js
function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

sizePicker.addEventListener('input', () =>
  output.textContent = sizePicker.value
);
```

Next, we set up variables to track the mouse coordinates and whether the mouse is pressed, responding to events accordingly. We also create an event listener to reset the canvas to black when the button is clicked.

```js
let curX, curY, pressed = false;

document.addEventListener('mousemove', e => {
  curX = e.clientX;
  curY = e.clientY;
});

document.addEventListener('mousedown', () => (pressed = true));
document.addEventListener('mouseup', () => (pressed = false));

clearBtn.addEventListener('click', () => {
  ctx.fillStyle = 'rgb(0,0,0)';
  ctx.fillRect(0, 0, width, height);
});
```

Now we need to implement the drawing logic. If `pressed` is true, we draw a circle based on the mouse position adjusted for the toolbar height. We then utilize `requestAnimationFrame` to keep drawing continuously.

```js
const toolBar = document.querySelector('.toolbar');

function draw() {
  if (pressed) {
    ctx.fillStyle = colorPicker.value;
    ctx.beginPath();
    ctx.arc(
      curX,
      curY - toolBar.offsetHeight,
      sizePicker.value,
      degToRad(0),
      degToRad(360),
      false
    );
    ctx.fill();
  }
  requestAnimationFrame(draw);
}

draw();
```

## 4.6. 3D Canvas

The 3D canvas utilizes the WebGL API, which, like the 2D canvas, uses the `<canvas>` element but operates through a completely different API. WebGL is based on OpenGL and allows access to the computer's GPU.

Using WebGL directly is quite complex, so many developers opt for third-party libraries like ThreeJS or BabylonJS. These libraries primarily operate based on graphics, allowing you to create primitive shapes or custom designs lit by movable light sources and cameras.

This can be explored later by referencing [this link](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Drawing_graphics#using_a_library).

# 5. Video/Audio API

HTML also provides elements for embedding media, such as `<video>` and `<audio>`. Additionally, it offers APIs for manipulating these elements. These features are encapsulated in the `HTMLMediaElement` object, allowing methods such as `HTMLMediaElement.play()`.

Using these APIs, we can create video or audio players. Simply adding the controls attribute to the video tag displays the player. However, the resulting player may differ in specifications across browsers, and keyboard accessibility is often unavailable in most browser implementations.

Therefore, using the HTMLMediaElement API, we can create a custom player. You can explore the process in detail [here](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Video_and_audio_APIs) or design it using the [HTMLMediaElement API](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement).

# References

fetch API https://developer.mozilla.org/ko/docs/Web/API/fetch