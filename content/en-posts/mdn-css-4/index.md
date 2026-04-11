---
title: Mastering Front Knowledge CSS-4
date: "2023-04-06T00:00:00Z"
description: "MDN CSS Tutorial - 4"
tags: ["web", "study", "front", "CSS"]
---

# 1. CSS Values and Units

[Reference Link](https://developer.mozilla.org/en/docs/Learn/CSS/Building_blocks/Values_and_units)

All CSS properties have allowed values. These values can include colors, sizes, etc., and their names are often enclosed in angle brackets such as `<color>` to differentiate them from CSS properties.

Let's explore some frequently encountered types of values.

Numeric, length, and percentage values can be quite challenging in CSS.

`<integer>` represents an integer, while `<number>` extends this to include decimal numbers. `<dimension>` denotes a number followed by a unit, such as `10px`. Additionally, `<percentage>` denotes a percentage based on another value, such as the length of a parent element.

Length is divided into absolute units and relative units, with absolute units like cm, mm, and in considered to have a fixed size. These values are useful for printing, although px is commonly used.

Relative length units are related to other elements on the page, such as the font size of a parent element. Examples include em, rem, vw, and vh.

## 1.1. em, rem

em and rem are the two most widely used relative lengths. The difference between them lies in which element's font size they are based on.

The em unit inherits the font size from the parent element, while the rem unit inherits from the root element, which is typically the html element.

Let's create a simple html structure and use rem and em.

```html
<div class="box">
  First Box
  <div class="box">
    Second Box
    <div class="box">Third Box</div>
  </div>
</div>
```

```css
.box {
  font-size: 1.5em;
}
```

In this case, each nested box inherits the font size from its parent and sets its size to 1.5 times that, resulting in progressively larger font sizes due to nesting.

![em-example](./em-example.png)

Since rem inherits the font size from the root element, setting it as follows makes all boxes' font sizes 1.5 times that of the html element.

```css
.box {
  font-size: 1.5rem;
}
```

![rem-example](./rem-example.png)

Thus, changing the font size of the html element will change the base for all rem values.

## 1.2. Percentage

Percentages, by their nature, are set relative to other values, usually corresponding to the same value on the parent element. For example, if a parent element's width is 100px and a child element's width is set to 50%, then the child element’s width becomes 50px.

Many properties, including width, can accept both length and percentage values. However, some properties only allow length values, denoted by `<length>`.

## 1.3. Numbers

In properties like opacity, only numbers are accepted without any units.

# 2. Item Sizing

[Resizing Items in CSS](https://developer.mozilla.org/en/docs/Learn/CSS/Building_blocks/Sizing_items_in_CSS)

Let’s explore various sizes of items in CSS. HTML elements have inherent sizes even before any CSS sizing is applied. For instance, an img tag retains its original size when an image is inserted.

However, we can also set the size of elements separately using width and height.

Margins and paddings can be set in percentages. For example, setting `margin: 10%` means the margin will be 10% of the parent element's width. Importantly, percentages are calculated based solely on the inline size of the parent element, thus `margin-top: 10%` does not get calculated based on the parent's height.

We can define minimum and maximum sizes for elements using properties like min-height, max-height, max-width, etc.

We can also use vw and vh, representing 1% of the viewport width and height, respectively.

# 3. Images, Media, and Form Elements

Media elements such as images can be styled using CSS.

Images or videos serve as replaced elements, meaning CSS does not affect their internal layout and must be controlled using special CSS properties.

## 3.1. object-fit

This property specifies how to adjust the content size of replaced elements to fit their container. The available options include:

```css
object-fit: contain;
```

This maintains the aspect ratio of the content while fitting it within the parent element's dimensions. If the element's dimensions differ from the content's aspect ratio, there will be empty spaces.

```css
object-fit: cover;
```

This also maintains the content's aspect ratio while fitting it within the parent element's dimensions. In this case, the content is scaled to fill the element.

```css
object-fit: fill;
```

This adjusts the content to fit the size of the element's box without maintaining the aspect ratio, potentially distorting the content.

```css
object-fit: none;
```

This does not adjust the size of the replaced content.

```css
object-fit: scale-down;
```

This selects either none or contain, whichever results in a smaller content size.

## 3.2. Form

Forms utilize various elements, particularly input elements. Elements like input and textarea behave similarly to other boxes and are easy to style. We can use attribute selectors to apply different styles based on the input type.

```css
input[type="text"] {
  background-color: #f0f0f0;
}

input[type="submit"] {
  background-color: #333;
}
```

Some browsers may not inherit font styles in form elements by default, so it may be necessary to add font inheritance via CSS.

```css
button,
input,
select,
textarea {
  font-family: inherit;
  font-size: 100%;
}
```

# 4. Table Styling CSS Information

We previously learned how to create tables using HTML tags like table, caption, tr, th, td, thead, and tbody.

```html
<table>
  <caption>
    Table created using the table tag
  </caption>
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Age</th>
      <th scope="col">Gender</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Hong Gil-dong</td>
      <td>20</td>
      <td>Male</td>
    </tr>
    <tr>
      <td>Kim Chul-soo</td>
      <td>25</td>
      <td>Male</td>
    </tr>
    <tr>
      <td>Lee Young-hee</td>
      <td>30</td>
      <td>Female</td>
    </tr>
  </tbody>
</table>
```

When rendered in the browser, it appears as follows:

![table_no_style](./table-no-style.png)

Using standard tags for tables makes it semantically structured and accessible. However, the rendered table may appear difficult to read and unattractive, which can be enhanced using CSS.

Create a CSS file and link it to the HTML file using the link tag.

```html
<link href="index.css" rel="stylesheet" type="text/css" />
```

Now, let's look at some CSS properties we can modify.

## 4.1. table-layout

This property specifies how to determine the width of each cell in a table. It can be set to auto or fixed.

When set to auto, the browser determines the table layout, meaning that the table and each cell's width will be based on the content contained within them.

When set to fixed, the widths of the table and col elements are defined by their width properties. In this fixed layout, the specified widths directly apply. If no widths are defined, the widths of the cells in the first row determine the table and each column's widths.

Using fixed layout allows for faster rendering than auto since the browser can render the entire table immediately after recognizing the first row. However, when cell widths are determined by the first row, content overflow may occur in cells in subsequent rows, which can be controlled with the overflow property learned earlier.

## 4.2. border-collapse

This property determines how to handle overlapping table borders.

When set to collapse, overlapping borders are merged into one. The thickness of this border is determined by the thickest border.

Let's apply the following CSS.

```css
table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #000;
}

th {
  border: 3px solid #7048e8;
}

td {
  border: 5px solid #74c0fc;
}
```

You will see that the overlapping border thickness is determined by the thickest border, with the thicker border taking precedence.

![collapse](./collapse-table.png)

When set to separate, overlapping borders are processed individually. In this case, all borders are displayed separately, and the spacing between borders is determined by the value specified in `border-spacing`. The default value in my browser was set to 2px.

If we render the table with only the border-collapse set to separate in the above CSS, it appears as follows.

![separate](./separate-border-table.png)

## 4.3. font-family

This property specifies the font. Values can be separated by commas to indicate alternatives. The browser selects the first available font from those listed, either installed on the computer or downloadable via `@font-face`.

Since we cannot ensure that all specified fonts are available, it is essential to conclude with a generic family, such as `sans-serif` or `serif`.

Available generic families include serif, sans-serif, cursive, monospace, fantasy, and system-ui.

## 4.4. nth-child Styling

Using nth-child allows for applying styles to specific rows or columns. Let's create a striped effect where two colors alternate in each row.

```css
tbody tr:nth-child(odd) {
  background-color: #63e6be;
}

tbody tr:nth-child(even) {
  background-color: #c0eb75;
}
```

Keywords odd and even can select odd and even child elements, respectively.

![stripe-table](./stripe-table.png)

## 4.5. caption-side

This property specifies the position of the caption element and can be set to top or bottom. If set to bottom, the caption appears beneath the table.

```css
caption {
  caption-side: bottom;
}
```

![bottom](./bottom-caption-table.png)

This property is based on the table's writing-mode, allowing for logical positioning values as well.

```css
caption-side: block-start;
caption-side: block-end;
caption-side: inline-start;
caption-side: inline-end;
```

## 4.6. Key Points for Table Styling

- Use table-layout:fixed to achieve a predictable layout.
- Use border-collapse to handle overlapping borders.
- Use text-align to align text appropriately.