---
title: Learning Front-End Knowledge CSS-9
date: "2023-04-22T00:00:00Z"
description: "MDN CSS Tutorial - 9"
tags: ["web", "study", "front", "CSS"]
---

# 1. Floats

Floats were originally one of the most widely used tools for layout on a page. However, with the introduction of flex and grid, their primary purpose has shifted to supporting floating images within text blocks.

Float was introduced to create a layout where images float within text paragraphs, similar to photos embedded in newspaper articles, allowing text to wrap around these images. Let's explore this original use of float.

```css
float: left;
```

By setting an element like the above, the respective element will break away from the normal flow of the component layout and be fixed to the left side of the parent container. All subsequent content within the parent container in the HTML will wrap around the floated element.

But how can you make specific elements wrap around only the floated element? In this case, you would use clear.

```css
clear: left;
```

When this CSS property is set, it will no longer wrap around floated elements to the left and will start on a new line. Similarly, using right or both will prevent wrapping around floated elements on the respective side.

## 1.1. Resolving Float Issues

Consider a scenario where a large box is floated within a wrapper box. Inside the wrapper box, there is a small paragraph. Now, assume that a background color is applied to the wrapper box.

In this case, the wrapper box will expand to the size of its internal content, but the problem is that the floated box is removed from the normal flow, which means the wrapper does not encompass the floated box. Therefore, the background color of the wrapper box does not extend below the floated box.

![wrapper-and-float](./wrapper-and-float.png)

How can we resolve the issue where the wrapper box does not consider the size of the floated box?

One solution is to add a div class after the wrapper box and apply the clear: both; property. This can be achieved using the `::after` pseudo-element.

```css
.wrapper::after {
  content: "";
  display: block;
  clear: both;
}
```

This method is known as the clearfix hack. It adds an empty block element underneath, preventing float from being applied after this element. This way, the wrapper box will expand to account for the floated elements.

Setting `overflow: auto` on the wrapper class is also a solution. This will create a small layout within the wrapper box that includes the floated elements, allowing the wrapper box to expand accordingly.

A modern approach is to set `display: flow-root` on the wrapper box. This makes the wrapper box the root of the element's flow, thereby creating a small layout (block formatting) inside it, which results in the wrapper box expanding to consider the floated elements.

# 2. Position Property

While dealing with various coding tasks, one often encounters the content discussed in the [previous post](https://witch.work/mdn-css-8/#14-position-%EC%86%8D%EC%84%B1-%EA%B0%9C%EC%9A%94).~~ Even if it is just a fraction of my knowledge, it is more than sufficient for me!~~

# 3. Multi-Column Layout

Multi-column layout is a technique for arranging content in multiple columns, similar to newspaper articles. This is my first time addressing it, but it is not overly complicated.

`column-count` is set by a number, dividing the respective element into that many columns.

```css
.container {
  column-count: 3;
}
```

`column-width` is specified in length and creates as many columns as possible with that width. If there is leftover space, it is distributed evenly among the existing columns. If the specified column width is smaller than the actual container width, the container will form a single column with the inadequate width.

For instance, if `column-width` is 200px and the container is 150px, then the container will consist of one 150px column.

`column-gap` specifies the space between columns, while `column-rule` sets the style of the line separating columns. This is a shorthand property for line color, line style, and line width, and can be set as follows.

```css
.container {
  column-count: 5;
  column-rule: 1px solid black;
}
```

## 3.1. CSS Fragmentation

These properties determine how to display content that is split across multiple pages or columns. Refer to the [MDN page](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Fragmentation) if needed.

For example, `break-inside` specifies whether to break the element across multiple pages in environments such as printing, or if it should start a new page to display everything on one page. When `break-inside: avoid` is set, the element will not appear across multiple pages.

# 4. Responsive Design

Responsive design refers to webpages that adjust layouts according to different screen widths and resolutions. In the early days of mobile web, dedicated mobile webpages like `m.naver.com` were created. However, these were difficult to maintain and did not provide a good user experience.

Responsive design emerged as a solution. It is not a separate technology but encompasses the overall adaptation of the layout based on how the web is accessed or the screen size.

For instance, responsive images refer to the use of the `<picture>` tag's srcset and sizes attributes to allow browsers to select images to download based on screen size and resolution.

Font sizes can also be set using units like `vw`. However, using only `vw` units prevents users from resizing the text ensemble. Therefore, as an alternative, you can use `calc()` to combine fixed sizes with `vw` units.

```css
p {
  font-size: calc(16px + 0.5vw);
}
```

## 4.1. Viewport Meta Tag

Mobile browsers sometimes struggle to accurately report the viewport width. Therefore, the following meta tag is used to set the viewport width to the device width, expanding the document to full size.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

This is necessary because when smartphones were first released, most sites were not optimized for mobile. Consequently, mobile browsers often specified the viewport width as 960px. However, most sites are now mobile optimized, making this setting essential.

## 4.2. Media Queries

Media queries allow for the provision of different CSS based on the browser or device environment. The basic format is as follows.

```css
@media media-type and (media-feature) {
  /* CSS to apply when conditions are met */
}
```

Media types include all, print, and screen. 

### 4.2.1. Height and Width

Commonly used media features relate to height and width. For example, `min-width` specifies a minimum width which applies when the viewport width is greater than or equal to the specified width.

```css
@media screen and (min-width: 768px) {
  /* CSS to apply when viewing on screen and viewport width is 768px or wider */
}
```

`max-width` can also be applied. Additionally, using only `width` can create CSS that applies solely at a specific width, although this is not commonly utilized.

### 4.2.2. Device Orientation

There is a media feature called orientation that determines whether the device is in portrait or landscape mode. This is divided into `portrait` and `landscape`.

```css
@media screen and (orientation: portrait) {
  /* CSS to apply when the device is in portrait mode */
}
```

Typically, desktops are in landscape mode, while smartphones are in portrait mode.

### 4.2.3. Pointing Device

Pointing devices refer to inputs such as a mouse or touch. They are categorized into `pointer` and `hover`. Pointer refers to mouse input, while hover pertains to the action of placing the mouse over an element.

In devices like touchscreens, elements cannot be hovered over. Therefore, if you want to create CSS that applies only when hovering is possible, it can be done as follows:

```css
@media (hover: hover) {
  /* CSS to apply when the element can be hovered */
}
```

The pointer reflects the user's pointing device, which can take three values: none, fine, or coarse. Fine indicates the use of a mouse or trackpad, coarse refers to touch input with fingers, and none conveys that the user is operating without a pointing device, such as with a keyboard.

This can be utilized to make buttons larger when users are operating with touchscreens.

### 4.2.4. Logic in Media Queries

Using `and`, you can apply queries logically. Additionally, using `not`, you can negate a query. When using not, the entire media query is negated. The following applies the CSS only when the orientation is not portrait.

```css
@media not all and (orientation: portrait) {
  /* CSS to apply when the device is in portrait mode */
}
```

For applying logical disjunctions, commas are used instead of `or`.

## 4.3. Approaches to Responsive Design

When designing a responsive layout, you can start with the widest view and adjust to fit narrows views, or conversely, start with the smallest view and add layout as the viewport expands. The latter is known as mobile-first design and is more commonly used. Many libraries, such as Tailwind, also recommend this approach.

Of course, it is also possible to design without using media queries. For example, the following can be done.

```css
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
```

By setting this, you can achieve a responsive design without media queries, as the column settings adjust based on the viewport size while ensuring minimum width.

Moreover, properties like `column-width` in multi-column layouts can also be employed to create columns responsive to viewport width.

# 5. Browser Support

Flex and grid are commonly used for layouts. However, older browsers may not support these modern layout methods. You can check the browser support for each feature on [caniuse](https://caniuse.com/).

Additionally, [alternative methods](https://developer.mozilla.org/ko/docs/Learn/CSS/CSS_layout/Supporting_Older_Browsers#%EB%8C%80%EC%B2%B4_%EB%A9%94%EC%84%9C%EB%93%9C) can be used to substitute unsupported layout methods. For example, you can utilize floats, `display: table`, or multi-column layouts instead of grid layouts.

Furthermore, using `@supports` allows you to apply different CSS for browsers that support specific features. However, keep in mind that this feature query is a relatively recent development, so browsers that do not support grid may also not be able to utilize feature queries.