---
title: Mastering Front Knowledge CSS-8
date: "2023-04-19T00:00:00Z"
description: "MDN CSS Tutorial - 8"
tags: ["web", "study", "front", "CSS"]
---

Let's understand layout now.

# 1. Introduction to Layout

## 1.1. Normal Flow

This is the default behavior when the page layout is not manipulated at all. Elements are arranged sequentially in a block direction. This block direction refers to vertical placement in horizontal writing languages like English.

When creating layouts with CSS, we move elements away from this normal flow. Layouts can be created using display, float, position, and table (though the latter is not recommended).

## 1.2. Overview of Display Property

We learned that the display property determines block and inline elements, and can be changed arbitrarily. However, there are other properties as well.

Setting `display:flex` makes all direct children flex items. This can be conveniently used to arrange items in one-dimensional concepts like rows or columns. This allows us to determine how to arrange internal children through properties like `flex-direction`.

Setting `display:grid` makes all direct children grid items. This is convenient for placing items in a two-dimensional concept. In this case, properties like `grid-template-rows` can be used to determine the placement of internal children.

In a grid display, the parent element can specify properties for rows and columns, as well as gaps between cells, allowing child elements to automatically position themselves within. Of course, it is also possible to directly position child elements using properties like `grid-row`.

## 1.3. Overview of Float Property

The float property allows an element to be placed outside the normal flow to the left or right. The rest of the page content will flow around the floated element, which can be useful for creating layouts.

```css
.box {
  // Floats the element to the left. Following elements will float around the box class element.
  float: left;
}
```

## 1.4. Overview of Position Property

Using the position property allows elements to be moved away from their original placement. There are five types.

`position:static` is the default, placing elements according to normal flow.

`position:relative` places elements based on normal flow, but allows adjustments using the top, right, bottom, and left properties. Overlapping with other elements is also possible.

`position:absolute` removes elements from normal flow and positions them relative to the nearest ancestor element or the html element. Naturally, it can overlap other elements within the same parent.

`position:fixed` is similar to absolute, removing the element from normal flow and positioning it relative to the browser viewport. It remains in a fixed position regardless of scrolling.

`position:sticky` behaves like static until a defined viewport point is reached, then acts like fixed. This means it will remain visible at the same position after a certain point in scrolling.

## 1.5. Multi-column Layout

A multi-column layout organizes the page into several columns, similar to a newspaper article. To create a multi-column container, specify the number of columns with `column-count` or the width of the columns with `column-width`.

# 2. Normal Flow

Normal flow is the way elements are laid out when there has been no alteration to the layout. The arrangement style depends on the parent's writing mode (writing-mode property), but generally, it can be considered horizontal placement.

Block elements stack vertically and appear with line breaks. They are separated by the margin of each element. If both adjacent elements have margins, only the larger value remains.

Inline elements stack horizontally and appear without line breaks. However, if there is insufficient space, overflowing text or elements will appear on a new line, as seen with the `span` element.

# 3. Flexbox

Flexbox is a method for laying out elements in one dimension. Previously, page layouts were accomplished through floats or position properties.

## 3.1. Flexbox Structure

![structure](./flex-structure.png)

The flex model has the structure shown above.

The parent element with `display:flex` is the flex container, and the child elements arranged within are called flex items.

The main axis is the axis that starts at the main start of the container and progresses towards the main end. Flex items are arranged along this axis. The cross axis is the axis perpendicular to the main axis.

## 3.2. Flexbox Properties

`flex-direction` can be set to row, column, row-reverse, or column-reverse. This property determines the direction of the main axis. The reverse option simply reverses the direction of the main axis.

`flex-wrap` can be set to nowrap, wrap, or wrap-reverse. The default nowrap places all flex items in a single row, overflowing if there is not enough space. Wrap moves to the next line when all flex items cannot fit in one row. Wrap-reverse is similar to wrap but arranges items in the opposite direction.

Setting `flex-flow` allows you to specify both flex-direction and flex-wrap in one go, such as `flex-flow:row wrap;`.

## 3.3. Exploring the Flex Property

The flex property is a shorthand for `flex-grow`, `flex-shrink`, and `flex-basis`. This property is applied to each item to specify how the item adjusts in size to fit the container space. Each of these properties is defined as follows.

### 3.3.1. Flex-grow

Flex-grow sets the method for distributing remaining space within the container when the combined width of items is less than the container width.

The space-filling method operates as follows. The base widths defined in flex-basis are allocated to all items. If there is remaining space, it is distributed according to the flex-grow values.

For example, if the HTML is defined as follows:

```html
<div class="container">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
</div>
```

And the CSS is written this way:

```css
.container {
  display: flex;
  flex-wrap: nowrap;
  gap: 0;
  padding: 10px;
  background: aqua;
  width: 600px;
}

.item {
  flex-basis: 100px;
}

.item:nth-child(1) {
  flex-grow: 1;
}
.item:nth-child(2) {
  flex-grow: 2;
}
.item:nth-child(3) {
  flex-grow: 3;
}
.item:nth-child(4) {
  flex-grow: 4;
}
```

Then, the total width allocated for contents in the container is 600px. Each item receives 100px according to flex-basis. The remaining space is 200px.

This 200px of remaining space is divided according to the flex-grow ratios: the first item receives 1/10, the second 2/10, the third 3/10, and the fourth 4/10, resulting in widths of 120px, 140px, 160px, and 180px, respectively.

### 3.3.2. Flex-shrink

Flex-shrink does not apply when `flex-wrap:wrap` is specified for the container. It sets the method by which items are reduced when their total width exceeds that of the container. In wrap mode, if item widths are too large, they simply move to the next line.

In any case, flex-shrink reduces exceeding elements based on the assigned values. If flex-shrink is set to 0, no reduction occurs. If the flex-shrink values are the same among sibling elements, they are reduced evenly to achieve the same size.

So, what happens if we set different flex-shrink values for each item? It works similarly to grow. The widths of items that exceed the container are reduced according to the ratios of their flex-shrink values.

For example, if there is an excess of 200px, and each item has flex-shrink values of 1, 2, 3, and 4, then item 1 will reduce its width by 20px, item 2 by 40px, item 3 by 60px, and item 4 by 80px.

### 3.3.3. Flex-basis

Flex-basis specifies the default size of an item before flex-grow and flex-shrink are applied. This size depends on the direction of the main axis: it is width if the main axis is row and height if it is column.

If flex-basis is set to auto, the size is determined based on the width or height specified on the item (also influenced by content). If set to content, the size is determined by the content, though content may not be supported in older browsers.

If flex-basis is 0, the default size of the item becomes 0. In this case, width allocation will occur based on flex-grow and flex-shrink values, as all portions are treated as margins.

Therefore, to make all items the same width regardless of their content, set flex-basis to 0 and flex-grow to 1.

### 3.3.4. Flex

Now, how does the shorthand flex work? Flex can be specified using 1 to 3 values.

- When there's 1 value
If a number is specified, it is for `flex-grow`. If a length (e.g., 100px) or ratio is specified, it is for `flex-basis`.

- When there are 2 values
The first value must be a number, representing `flex-grow`. The second can either be a number (for `flex-shrink`) or a length or ratio (for `flex-basis`).

- When there are 3 values
The first value becomes `flex-grow`, the second becomes `flex-shrink`, and the third becomes `flex-basis`. Naturally, the first two must be numbers, and the third must be a length or ratio.

- Special Keywords
`initial` causes the item to shrink to fit the container size if it exceeds, but otherwise follows its specified width and height, equivalent to `flex:0 1 auto`. This is the initial value for flex.

`auto` automatically determines the item's default size, allowing it to grow or shrink to fit the container, equivalent to `flex:1 1 auto`.

`none` automatically specifies and fixes the item's size, equivalent to `flex:0 0 auto`.

## 3.4. Item Placement

`justify-content` determines how items are positioned along the main axis. `align-items` determines how items are aligned along the cross axis.

If `flex-direction` is row, `justify-content` specifies where items are placed along the row, while `align-items` specifies their vertical alignment.

Individual item placements along the cross axis can also be specified using `align-self`.

### 3.4.1. Justify-content Property

Other properties can generally be anticipated. `space-around` evenly distributes all items along the main axis with slight spaces on both ends.

In contrast, `space-between` distributes all items evenly along the main axis without leaving space on either end.

## 3.5. Order

Each flex item can have an order assigned. Items with lower order values are placed first, with the default being 0. For example, if an item's order is set to 1, it will be placed behind others.

Negative order values can also be used to position items ahead of those with default orders.

# 4. Grid

Grid layout allows elements on a page to be arranged in two dimensions. It divides the page into rows and columns, specifying which elements to place in which rows and columns. The grid display mode is specified as follows:

```css
display: grid;
```

## 4.1. Basic Grid Creation

Rows and columns can be created using `grid-template-columns` and `grid-template-rows`. Using the `fr` unit allows you to allocate the available space within the grid container to define the size of each row and column.

```css
// Create 3 columns by splitting available width in a 1:2:1 ratio
grid-template-columns: 1fr 2fr 1fr;
// Create 3 rows by splitting available height in a 1:1:2 ratio
grid-template-rows: 1fr 1fr 2fr;
```

Spacing between rows and columns can be specified using `grid-column-gap` and `grid-row-gap`. You can also use `grid-gap` to specify both at once (a shorthand for row-gap and column-gap) without the `grid-` prefix.

The `repeat()` function allows for easy specification of repeated rows/columns. For example, `repeat(5, 1fr)` creates 5 rows or columns of size 1fr. There is also `minmax()` for setting minimum and maximum sizes for each row or column.

```css
grid-template-columns: repeat(5, minmax(50px, auto));
```

## 4.2. Automatically Setting Rows and Columns

Until now, we had to directly specify the number of rows when using `grid-template-rows`. However, sometimes you may want to create as many rows as possible within the allowed size. In such cases, use auto-fill or auto-fit.

```css
.container {
  // Create as many 100px tall rows as possible
  // If there is remaining height, simply move to the next line
  grid-template-rows: repeat(auto-fill, 100px);
}
```

If you switch to auto-fit, when there is remaining space in the container, it will expand the existing row sizes to fill that space.

Using `grid-auto-rows` and `grid-auto-columns` specifies the sizes of rows/columns outside of those controlled by `grid-template-`. If you specify only this property without `grid-template-`, all rows/columns will be set to this property’s specified size.

```css
// Automatically create rows and columns of size 100px
grid-auto-rows: 100px;
grid-auto-columns: 100px;
```

## 4.3. Grid Item Placement

You can specify which rows and columns each grid item will occupy using the grid-row and grid-column properties. You can also specify starting and ending lines like `1/3`.

Alternatively, you can use grid-row-start, grid-row-end, grid-column-start, and grid-column-end properties to specify the starting and ending lines for each item.

## 4.4. Grid-template-areas

An interesting fact is that using the `grid-template-areas` property, you can name each grid element and arrange items using those names.

```css
.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "main main aside"
    "footer footer footer";
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
}

// The header tag occupies grid areas named header
header {
  grid-area: header;
}

main {
  grid-area: main;
}
...
```

You can use the named grids to arrange items accordingly. Names assigned to areas must fill all cells in the grid. To leave a cell empty, you must include a `.`.

Also, the named areas must form a rectangle, just like areas specified by row/column numbers, and must be unique.

# References

flex property https://developer.mozilla.org/en-US/docs/Web/CSS/flex

flex 2 https://blogpack.tistory.com/863

https://velog.io/@garcon/Flexbox-flex-basis-auto%EC%99%80-0%EC%9D%98-%EC%B0%A8%EC%9D%B4%EC%A0%90

auto-fill and auto-fit https://velog.io/@iandr0805/CSS-Grid-auto-fit%EA%B3%BC-auto-fill%EC%9D%98-%EC%B0%A8%EC%9D%B4%EC%A0%90

good organization of grid https://studiomeal.com/archives/533