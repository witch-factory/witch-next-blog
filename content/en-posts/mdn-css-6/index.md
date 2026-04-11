---
title: Acquiring Front Knowledge CSS-6
date: "2023-04-14T00:00:00Z"
description: "MDN CSS Tutorial - 5"
tags: ["web", "study", "front", "CSS"]
---

Now we are entering the part about styling text. Since I have done some CSS work already, I will briefly summarize only the new information I have learned.

# 1. Basic Text Styling

Text within an element can behave like an inline element and can have basic CSS styling properties applied. Pseudo-elements such as `::first-letter` can also be used for selection. The CSS properties for styling text can generally be classified into two categories.

One category is font styles that affect the font and italicization, while the other is text layout styles that adjust the position, spacing, and alignment of the text.

## 1.1. Basic Font Styles

I will simplify properties that I was not aware of.

The `text-decoration` property adds decorative lines to text. This is a shorthand property for `text-decoration-line`, `text-decoration-color`, `text-decoration-style`, and `text-decoration-thickness`. It includes properties such as underline, overline, and line-through (strikethrough). Multiple styles can be applied simultaneously.

```css
text-decoration: underline dotted blue 2px;
// Applying multiple styles at once
text-decoration: underline overline;
```

Font size can be set in px, em, or rem, with em based on the font size of the parent element and rem based on the font size of the root element. Remember that "rem inherits properties from the root element."

Thus, if you can use rem, it simplifies size calculations. Setting the base font size to 10px is also a good choice, as it makes rem calculations easier when creating various font sizes.

The `font-style` property allows for italicization. The `font-weight` property specifies the font's thickness using keywords or numbers.

The `text-transform` property can change the case of text to uppercase, lowercase, or capitalize the first letter.

The `text-shadow` property sets shadows. It is configured as follows:

```css
// text-shadow: horizontal distance, vertical distance, blur radius, color
text-shadow: 2px 2px 2px #000;
```

If the distance between the text and shadow is set as positive, the shadow will appear below and to the right of the text. However, by setting this distance to a negative value, the shadow can be positioned above or to the left of the text.

You can also apply multiple shadow values separated by commas to create several shadows.

```css
text-shadow: 2px 2px 2px #pink, -2px -2px 2px #purple;
```

## 1.3. Basic Layout Styles

The `text-align` property sets the alignment of the text. Options include left, right, center, and justify. Use justify with caution, as it can lead to undesirable designs.

The `line-height` property sets the height of a line. You can set it with units like `line-height:20px`, or simply provide a value without units. In this case, `line-height` will be applied as a multiple of the `font-size`. For example, `line-height: 1.5` is equivalent to `line-height: 15px` when the `font-size` is 10px.

A properly elevated line height improves readability due to spacing between lines. Therefore, a line height setting of 1.5–2.0 is recommended.

The `letter-spacing` and `word-spacing` properties set the spacing between characters and words, respectively. Most length units can be used.

# 2. Various Text Properties

## 2.1. Additional Text Styles

### 2.1.1. font-variant

This property can convert lowercase letters to small caps. It is a shorthand property for several attributes. A few notable attributes are briefly discussed. To experiment with this, a simple example is needed. Here's some Lorem Ipsum text.

```html
<p>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
</p>
```

The `font-variant-caps` property converts uppercase letters to small caps. Applying this property changes `Lorem` to `lorem`.

```css
font-variant: small-caps;
```

The result displays all lowercase letters as small caps.

![lorem-small-caps](./lorem-small-caps.png)

### 2.1.2. font-variant-ligatures

The `font-variant-ligatures` property pertains to connecting two letters into one shape. For instance, in some fonts, "ffi" in "difficult" is represented as a single connected form, known as a ligature.

Setting this property as follows prevents this behavior.

```css
font-variant-ligatures: none;
```

### 2.1.3. Others

Additional properties for the expression of East Asian characters include `font-variant-east-asian`, and for different representations of numbers (such as adding a diagonal to the number 0) there is `font-variant-numeric`.

## 2.2. font-kerning

This property adjusts the spacing between characters. However, it does not simply space them, as it adjusts the spacing based on the shapes of the characters.

For example, in the case of `AV`, the space between A and V may be slightly reduced for a more natural appearance. This is called kerning.

```css
// Let the browser handle kerning
font-kerning: auto;
// No kerning applied
font-kerning: none;
// Kerning applied
font-kerning: normal;
```

## 2.3. font-stretch

This property stretches the text to make it narrower or wider.

```css
// Stretch the text
font-stretch: expanded;
// Condense the text
font-stretch: condensed;
// Stretch the text by percentage, between 50% and 200%
font-stretch: 150%;
```

## 2.4. text-underline-position

This sets the position of the underline. Setting `text-underline-position: under;` places the underline below the subscript of the text.

When set to auto, the browser determines the underline's position.

## 2.5. text-indent

This property sets the indentation of the text. Negative values can also be used, pushing the indented text to the left.

## 2.6. text-overflow

This property specifies how to handle text that overflows due to being too long.

Setting `text-overflow: ellipsis;` will show `...` when the text overflows.

Setting `text-overflow: clip;` will cut off any overflowing text.

The `text-overflow` property does not cause text to overflow as it does not alter the automatic line wrap. Therefore, to intentionally cause an overflow, set `white-space: nowrap;`.

## 2.7. white-space

This property specifies how an element handles whitespace. This includes spaces, indentations, and line breaks. Typically, even if whitespace appears consecutively, the browser merges them into a single whitespace.

This is due to `white-space: normal;` being the default. Continuous whitespaces will merge into one, and line breaks will occur automatically. Continuous whitespace or manual line breaks are not possible without using `&nbsp;` or `<br/>`.

Setting `white-space: nowrap` prevents automatic line breaks even if the text exceeds the width of the element. A common practice is to set `overflow:hidden; text-overflow: ellipsis;` to represent overflowing text as `...`.

Setting it to pre maintains consecutive whitespaces in the HTML document. Pre-wrap also preserves consecutive whitespaces but will automatically wrap long lines within the text. Pre-line will maintain line breaks but merge consecutive whitespaces.

## 2.8. word-break

This property specifies how to break lines when text overflows the box. Setting `break-all` will split words to prevent overflow.

Keep-all is a property for CJK text, which may not be relevant at this time.

# 3. List Styling

The `<ul>` and `<ol>` tags are used to create unordered and ordered lists, respectively, and are frequently used when building pages. The associated CSS properties are briefly summarized below.

## 3.1. list-style-type

This property sets the symbols used in the list. For instance, setting `list-style-type: circle;` will use circular symbols in an unordered list. Alternatively, setting `list-style-type: upper-roman;` will use uppercase Roman numerals to indicate order in an ordered list.

```css
ol {
  list-style-type: upper-roman;
}
```

## 3.2. list-style-position

By default, symbols are attached at the start of each list item without special settings. This property specifies the relative position of these symbols concerning each list item.

Generally, `outside` is used, indicating that the symbol is positioned outside the list item and separated from its content. When creating a list with `list-style-position: outside`, the list symbol appears within the padding of the list box, visually separating it from the content.

Using `inside` means the symbol appears inside the list item, right at the start of its content. So, in contrast to `outside`, the list symbol will be included within the box.

Let’s verify this by writing CSS that applies color solely to the content, excluding margins and paddings.

```css
ol{
  background-clip: content-box;
  background-color:#eebefa;
}

.bullet-outside{
  list-style-position:outside;
}

.bullet-inside{
  list-style-position:inside;
}
```

Next, let’s construct the HTML.

```html
<ol class="bullet-outside">
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
  <li>Fourth item</li>
</ol>

<ol class="bullet-inside">
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
  <li>Fourth item</li>
</ol>
```

You will notice the differences between outside and inside style.

![list-position-ex](./list-position-ex.png)

## 3.3. list-style-image

You can directly set list symbols to an image.

```css
ol{
  list-style-image: url(bullet.svg);
}
```

However, this has limitations such as difficulty in adjusting the symbol size. Thus, if you want to use an image for symbols, it is better to use the background property. The process is as follows:

1. Set `list-style-type` to none to remove symbols.
2. Add padding to the li tag to create space for the symbol.
3. Insert the symbol image with `background-image`.
4. Adjust the symbol image's position using `background-position`. Generally, `0 0` is preferred since it will position the symbol at the start.
5. Use `background-repeat: no-repeat` to ensure the symbol image appears only once.
6. Adjust the image size appropriately using `background-size`.

## 3.4. Shorthand

You can specify all three properties above using the list-style keyword.

```css
ol{
  list-style: outside circle url(bullet.svg);
}
```

## 3.5. Attributes for List Items

List items have several attributes useful for controlling aspects like starting the count from a number other than 1 in ordered lists.

The `start` attribute allows you to determine from what number the list should begin.

```html
<ol start="3">
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
  <li>Fourth item</li>
</ol>
```

Setting the `reversed` attribute will count the list in reverse order.

You can also enforce a specific order by using the value attribute on the li tag. In this case, following items will increment automatically. For instance, this will display the order as `1, 2, 7, 8`.

```html
<ol>
  <li>First item</li>
  <li>Second item</li>
  <li value="7">Third item</li>
  <li>Fourth item</li>
</ol>
```

# References

https://www.daleseo.com/css-white-space/

https://www.daleseo.com/html-nbsp/