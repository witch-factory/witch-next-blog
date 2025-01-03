---
title: Mastering Front Knowledge CSS-3
date: "2023-04-04T00:00:00Z"
description: "MDN CSS Tutorial - 3"
tags: ["web", "study", "front", "CSS"]
---

# 1. Background and Border

What can be achieved with CSS background and border?

## 1.1. Background

The CSS background property is a shorthand for various background properties, which include:

- background-attachment
- background-clip
- background-color
- background-image
- background-origin
- background-position
- background-repeat
- background-size

Let's explore each of these.

### 1.1.1. background-color

Sets the background color of an element. Valid color representations include keywords like red and blue, hex notation, and functions such as rgb()/rgba().

### 1.1.2. background-image

Sets the background image of an element. You can specify the image path using the url() function. If the image is smaller than the box, it will repeat as the background (when background-repeat is set to default).

When a background color is specified alongside an image, the image appears above the color.

Using gradients for this property allows you to set a background gradient for the element. For example, using the linear-gradient() function sets a linear gradient:

```css
{
  background-image: linear-gradient(to right, red, blue);
}
```

Other types of gradient functions include radial-gradient, repeating-linear-gradient, repeating-radial-gradient, and conic-gradient.

Multiple background images can also be set by separating them with commas:

```css
background-image: url("image1.png"), url("image2.png");
```

Here, the first image is given priority, so image1 is displayed above image2.

### 1.1.3. background-repeat

As previously mentioned, if the image set via background-image is smaller than the box, it will repeat. However, by using this repeat property, you can prevent repetition or allow repetition in a specific direction.

### 1.1.4. background-size

When specifying a background image, if the image is larger than the element, it may get cropped. You can use the background-size property to adjust the image size. In this situation, the uncovered area will be filled with the color defined by background-color.

Using the keywords contain and cover will size the image as large as possible without cropping or distortion. In the case of cover, the image may be enlarged and cropped to ensure no empty space within the element.

You can also explicitly define the size; supplying one value will set the width with the height automatically adjusted. Using two values will set both width and height.

```css
{
  background-size: contain;
  // Set width
  background-size: 100px;
  // Set height
  background-size: 100px 50%;
}
```

### 1.1.5. background-position

This allows you to choose where the image appears within the box. The top-left corner is at `(0,0)`, allowing you to set starting positions for both the x-axis and y-axis.

Keywords such as top, right can be used or numeric values like 20px, 50%.

You can also use four values, where the length units refer to the distance from the respective keyword direction.

```css
{
  // Place at top right
  background-position: top right;
  // Offset 20px on x-axis and 50% on y-axis from the top left corner
  background-position: 20px 50%;
  // Offset 30% from bottom and right
  background-position: bottom 30% right 30%;
}
```

### 1.1.6. background-attachment

Specifies how the background scrolls with the content.

When set to scroll, the background will scroll with the page, independent of the element's scroll. Setting it to fixed will keep the background static, while local fixes the background to the element itself, causing it to scroll along with the element. It also responds to page scrolling.

[Scroll example for each element](https://mdn.github.io/learning-area/css/styling-boxes/backgrounds/background-attachment.html)

## 1.2. Border

The border CSS property is a shorthand for border-width, border-style, and border-color.

```css
border: 1px solid red;
```

If you want to set different borders for each side, you can use properties like border-top, etc.

### 1.2.1. Rounded Borders

The border-radius property allows you to set the roundness of corners. You can set each corner individually or set all corners at once.

```css
{
  border-radius: 10px;
  // Horizontal radius 10px, vertical radius 20px
  border-radius: 10px 20px;
  border-top-left-radius: 1px;
  border-top-right-radius: 2px;
}
```

# 2. Text Display Direction

Arabic is written from right to left, while Japanese is written from top to bottom. To change these writing modes, the writing-mode property is used.

## 2.1. Influence of Display Direction

What does this display direction influence? It alters the placement of elements and the flow direction of text.

For example, if elements are arranged as follows:

```html
<div class="blue-box">Blue</div>
<div class="aqua-box">Aqua</div>
```

The Blue Box will be positioned above the Aqua Box, stacking blocks downwards.

Now, if the display direction is changed with:

```css
body {
  writing-mode: vertical-lr;
}
```

The block elements within the body will stack from left to right.

![dir-result](./writing-mode.png)

When set to vertical-rl, the blocks will stack from right to left.

Therefore, changing the reading mode allows you to dictate the direction in which users read the page.

Block elements follow the direction specified after the dash. For instance, with vertical-rl, the block elements stack from right to left. In contrast, inline elements follow the direction before the dash, meaning with vertical-rl, inline elements stack from top to bottom.

## 2.2. Text Flow Direction

As mentioned earlier, languages that are written from right to left, like Arabic, have a flow direction from right to left.

Since the web does not exclusively use languages that are read left to right, modern CSS does not reference direction. Instead, it starts with the concepts of inline and block, focusing on start and end. This topic will be revisited later.

## 2.3. Text Direction, Width, and Height

When setting writing-mode to vertical-rl, how will the direction of block elements change? Let's first establish the default width and height without any writing-mode.

```css
.box {
  width: 500px;
  height: 150px;
  border: 1px solid black;
}
```

Now, let's insert some lorem ipsum text appropriately.

```html
<div class="box">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
  veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
  commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
  velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
  cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
  est laborum.
</div>
```

The box would display as follows.

![lorem-horizontal](./lorem-horizontal.png)

What happens when writing-mode is set to vertical-rl? It will display as follows.

![lorem-vertical](./lorem-vertical.png)

The flow of the page has turned vertical, but the essential width and height remain unchanged.

To address this, CSS provides the block-size and inline-size properties to adjust width and height according to writing-mode.

Width corresponds to inline-size while height corresponds to block-size. Let's modify the earlier CSS accordingly.

```css
.box {
  inline-size: 500px;
  block-size: 150px;
  border: 1px solid black;
}
```

Now, even with writing-mode set to vertical-rl, the essential width and height remain unchanged.

![lorem-fit](./lorem-fit.png)

## 2.4. Text Direction, Margin, and Padding

There are additional properties that can differ based on direction, such as margin and padding. For example, the margin-top property.

Similar to the previous case with width and height, we can create properties that target logical directions based on writing-mode. Using properties such as margin-block-start allows you to apply margins at logical directions.

If you wish to apply margins at the top and bottom of a block, use margin-block. For margins on the left and right sides, use margin-inline. Additionally, by adding start and end, you can apply margins to the beginning and end of the respective direction.

For example, margin-left is equivalent to margin-inline-start. Padding works similarly.

- top -> block-start
- bottom -> block-end
- left -> inline-start
- right -> inline-end

However, logical properties such as these may be newer than physical attributes like top and bottom, meaning they may not be supported across all browsers.

Therefore, when not using multiple writing directions, it is still advisable to use physical properties. However, as layout techniques such as flex and grid become more prevalent, logical properties will become increasingly useful.

# 3. Content Overflow

When a box contains too much content, box overflow occurs. For example, having 100 lines of text in a box with a height of 100px.

CSS provides various methods to handle such overflow. The overflow property can be utilized.

The default value of the overflow property is visible, which displays the overflowed content. Setting overflow to hidden will cut off the overflowed content.

Using `overflow:scroll` gives a scrollbar for the overflowed content. At this point, even directions where overflow doesn't occur may still display scrollbars, so you can also set overflow-x and overflow-y separately. To let the browser handle scroll creation when overflow occurs, set overflow to auto.

## 3.1. Word Overflow 

In cases where long words must be handled within a small box, such as causing overflow on the x-axis, you can use word-break and overflow-wrap.

Word-break determines how words are treated when they overflow the box. The default is normal, which allows words to extend outside the box when overflowing.

Setting this to `word-break:break-all` ensures that regardless of how words are broken, they will line break within the box when overflowing.

The overflow-wrap property decides where to break lines if any character overflows the box. The default value, normal, only breaks lines at standard break points, such as spaces between words. Break-word will break lines at arbitrary points if no break point is available.