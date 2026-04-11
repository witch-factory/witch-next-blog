---
title: Learning Frontend Knowledge CSS-1
date: "2023-03-29T03:00:00Z"
description: "MDN CSS Tutorial - 1"
tags: ["web", "study", "front", "CSS"]
---

CSS stands for Cascading Style Sheets and is a language used to specify the style of web pages. CSS allows you to style HTML. It is also one of the barriers of frontend development. Let's study this through the MDN tutorial.

# 1. What is CSS?

CSS specifies how a document is displayed to the user. This includes settings such as font size and background color of the document. Generally, a document refers to a text file composed of a markup language, which could be HTML, SVG, or XML.

## 1.1. CSS Syntax

CSS selects specific elements or groups of elements through a selector and applies styles to them. The selector can be the name of the element, a class, or an ID. Styles consist of properties and values. For example:

```css
h1 {
  color: red;
  font-size: 5em;
}
```

The `h1` elements are selected, and styles are specified in the form of `property:value;`. Each style is separated by a `;`. The properties are known as CSS properties, and each property accepts specific values. For instance, the color property can only accept color values.

## 1.2. CSS Specifications

Like other web standard technologies, CSS also has standard organizations. The W3C's CSS Working Group develops it, and new CSS features are developed here.

When developing new features, backward compatibility is always considered to ensure that older websites work well in browsers.

## 1.3. Browser Support

The level of CSS support varies among browsers. If you use CSS not implemented in a browser, it will not render on the screen. For the latest specifications, some browsers implement them while others do not.

You can check whether a browser has implemented specific CSS at [caniuse.com](https://caniuse.com/). For example, searching for `grid` would yield the following results.

![caniuse-result](./caniuse-result.png)

# 2. Getting Started with CSS

CSS is applied to HTML documents. There are several ways to apply CSS to an HTML document, and we will use the most common method: linking CSS to the HTML document.

Create a CSS file in the same location as the HTML document and add the following to the head tag of the HTML document. Let’s name the CSS file `index.css`.

```html
<link href="index.css" rel="stylesheet" type="text/css" />
```

Now let's add styles to the CSS file. This is how it can be done:

```css
h1 {
  color: aqua;
}
```

Next, add an `h1` tag to the HTML document. Write `index.html` as follows:

```html
<!DOCTYPE html>
<html lang="ko-KR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Getting Started with CSS</title>
    <link href="index.css" rel="stylesheet" type="text/css" />
  </head>
  <body>
    <h1>Hello.</h1>
  </body>
</html>
```

Now, when you open `index.html` in the browser, the text "Hello" will appear in aqua color.

## 2.1. Various Selectors

### 2.1.1. Universal Selector

Using `*` allows you to select all elements.

```css
* {
  color: aqua;
}
```

### 2.1.2. ID Selector

The ID selector uses `#id`. Since there should only be one element with a specific ID in the document, the ID selector can select only one element.

```css
#title {
  color: aqua;
}
```

## 2.1.3. Class Selector

Selecting and styling all HTML elements has its limitations. You can use classes. In CSS, writing `.classname` allows you to select and style a class.

```css
.space-list {
  list-style-type: kannada;
}
```

Now, add `class="space-list"` to the `li` tags. The list will be displayed as follows:

![ul](./unordered-list.png)

You can also select elements with a specific class among specific tags by writing `tag.classname`.

```css
li.space-list {
  color: red;
}
```

Since an element can have multiple class values (separated by spaces), HTML elements can inherit styles just by specifying already styled classes.

## 2.1.4. Attribute Selector

You can select elements with specific attributes. By using `selector[attribute]`, you can select elements that possess a specific attribute among those selected. The following selects `a` tags that have a target attribute.

```css
a[target] {
  color: aqua;
}
```

`selector[attribute="value"]` selects elements that match the exact value of the attribute.

`selector[attribute~="value"]` selects elements that contain the specified value as a whole word separated by spaces. For example, `h1[title~="first"]` would not select elements with the title attribute "heading-first" but would select those with "heading first," since "first" is a distinct word.

If you want to compare attribute values case-insensitively, attach `i` directly before the closing bracket. 

```css
/* Case insensitive selection of attr as A or a. */
li[attr="a" i]
```

There are other types of selectors based on conditions with attributes, which can be found at [poiemaWeb](https://poiemaweb.com/css3-selector) when needed.

### 2.1.5. Compound Selector

A descendant selector is written as `parent desc`. It selects all descendant elements that match the desc selector from the elements selected by the parent selector.

The following would select all `p` tags that are descendants of a `div` tag.

```css
div p {
  color: aqua;
}
```

If you want to select only direct children rather than descendants, you can use the child selector written as `parent > child`.

Using `A + B` selects the B selector element that immediately follows the A selector. This is known as the adjacent sibling selector.

Using `A ~ B` selects all B selector elements following the A selector. This is known as the general sibling selector.

### 2.1.6. Pseudo-class Selector

The pseudo-class selector can style elements based on their state, such as when the mouse hovers over them or when they are focused. This is indicated with a `:` written as `selector:pseudo-class-name`.

The following would change the a tag text to aqua color when the mouse hovers over the a tag.

```css
a:hover {
  color: aqua;
}
```

The link selectors are as follows: `a:visited` for visited links and `a:link` for unvisited links.

Dynamic selectors function as follows: `selector:active` for the clicked state, `selector:focus` for the focused state, and `selector:hover` for the hovered state.

UI state selectors include `selector:enabled` indicating that the selector is activated and enabled, `selector:disabled` indicating it is disabled, and `selector:checked` indicating that checkboxes or radio buttons are checked.

These can be combined with other selectors; for example, `input:enabled + div` selects the div immediately following an enabled input.

Structural pseudo-classes are selected based on where the selector occupies a position.

`selector:first-child` selects the first child among the selected elements. `selector:last-child` selects the last child among the selected elements.

`selector:nth-child(n)` selects the nth child among the selected elements. `selector:nth-last-child(n)` selects the nth child from the end among the selected elements.

In this case, values of n that are 0 or negative are omitted. Therefore, `li:nth-child(2n-1)` selects the odd-numbered child `li` elements.

`selector:first-of-type` selects the first occurring element among siblings that match the selector. `selector:last-of-type` selects the last occurring element among siblings that match the selector.

`selector:nth-of-type(n)` selects the nth element among siblings that meet the selector condition. `selector:nth-last-of-type(n)` selects the nth element from the end among siblings that match the selector.

There is also a negation selector. `selector:not(A)` selects all elements except those corresponding to the A selector.

The validity selector `:valid` is applied when an input or form element's validation succeeds. `:invalid` is applied when validation fails. This validation can be done using attributes like required, pattern, etc.

### 2.1.7. Pseudo-element Selector

Pseudo-elements are used to style specific parts of an element, such as the space before a certain element. They are expressed using `::` and must use names defined in CSS standards.

`::first-letter` selects the first letter of the element's content. `::first-line` selects the first line of the element's content.

`::before` selects the space before the element and `::after` selects the space after the element's content. Additionally, `::selection` selects the content that has been dragged.

```css
::selection {
  background-color: aqua;
}
```

### 2.1.8. Selector Summary

Here’s a summary table of the selectors discussed above.

| Selector | Example |
| --- | --- |
| Universal Selector | `* {}` |
| Tag Selector | `h1 {}` |
| ID Selector | `#my-id {}` |
| Class Selector | `.my-class {}` |
| Attribute Selector | `a[target] {}` |
| Pseudo-class Selector | `a:link {}` |
| Pseudo-element Selector | `::first-line {}` |
| Descendant Selector | `div p {}` |
| Child Selector | `div > p {}` |
| Adjacent Sibling Selector | `h1 + p {}` |
| General Sibling Selector | `h1 ~ p {}` |

## 2.2. Combining Selectors

If two or more items share the same CSS, you can combine selectors using a `,`.

```css
h1, h2, h3 {
  color: aqua;
}
```

Doing so will apply styles to h1, h2, and h3. However, note that if any of the combined selectors are invalid, the entire rule will be ignored.

```css
h1, ..my-class, h2 {
  color: aqua;
}
```

In this case, `..my-class` is an invalid selector, so the whole rule will be ignored.

# 3. Structure of CSS

Let's examine the language structure of CSS more closely.

## 3.1. Applying CSS

There are several methods to apply a CSS file to an HTML document. The first is to use the link element and provide the path to the CSS file in the href attribute.

```html
<link rel="stylesheet" href="./styles.css">
```

The second method is to use the style element inside the head tag. 

```html
<head>
  <style>
    h1 {
      color: aqua;
    }
  </style>
</head>
```

The third method is to use inline styles. Inline styles involve directly writing styles as a string in the style attribute of an HTML element.

```html
<h1 style="color:blue;">Hello.</h1>
```

However, using inline styles mixes HTML and CSS information, reducing readability and making CSS reuse impossible.

## 3.2. CSS Selector Specificity

There may be cases where two selectors target the same element. Although the prioritization will be discussed in more detail later, generally, more specific selectors have higher precedence.

```css
h1 {
  color: red;
}

.hi {
  color: aqua;
}
```

And if the HTML element is written as follows:

```html
<h1 class="hi">Class</h1>
```

In this case, the style applied to the class will take precedence because it is more specific.

## 3.3. Functions

There are several functions available in CSS. For example, the `calc` function is used to calculate values.

```css
width: calc(100% - 20px);
```

This means the width of the element will be set to 100% minus 20px. There are also functions like `rotate` used with the transform property.

## 3.4. At-rules

At-rules begin with an at sign (`@`) and encompass the semicolon or the next CSS block. Generally, they follow the form:

```css
@IDENTIFIER RULE;
```

Examples include `@import` for importing additional stylesheets or `@media` for media queries.

```css
@media (max-width: 600px) {
  h1 {
    color: red;
  }
}
```

Other rules define character sets used in stylesheets with `@charset`, and `@font-face` is used for online fonts, among various others.

Once the browser meets the specified criteria, `@supports` applies that content, and `@keyframes` describes intermediate actions of CSS animations.

## 3.5. Comments

CSS comments are expressed using `/* */`.

# 4. How CSS Works

Let's take a look at how browsers create web pages.

The browser first loads the HTML. Then, it constructs a DOM in the form of a node tree. At this stage, it does not load resources or CSSLinked to the HTML.

After completing the DOM creation, it retrieves resources like images linked to the HTML document and the CSS. Once the CSS is analyzed, it sorts different rules by the type of selector. It then decides which rules to apply to each node and compiles them into a render tree.

The render tree is a collection of nodes that are displayed on the screen after rules are applied. The browser will render based on this generated render tree.

If there is CSS that the browser cannot recognize, it ignores those rules and proceeds to the next stage.

# References

CSS Selectors https://poiemaweb.com/css3-selector