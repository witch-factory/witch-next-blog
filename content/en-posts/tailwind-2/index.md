---
title: Learning Frontend Knowledge with Tailwind - 2
date: "2022-07-28T00:00:00Z"
description: "Experience using Tailwind in projects - Tag organization"
tags: ["web", "study", "front"]
---

# 1. Purpose of the Second Article

The first article covered the introduction to Tailwind and some of its provided features. This article serves as a brief summary of the classes that exist in Tailwind before diving into its practical use. While it is possible to learn as one encounters various elements, I believe it is more efficient to organize them in advance. Having a general understanding of what is available is helpful for tackling challenges later.

# 2. Basic Styles

Tailwind automatically offers a preflight that eliminates browser-specific default CSS settings, allowing for a somewhat unified foundation to start from. This is injected through `@tailwind base;` in index.css. The specifics can be referenced in the official documentation's stylesheet. It is worth noting that it is designed to be as intuitive as possible.

If you wish to disable preflight due to a merger with another project with different base styles, you can configure this in `tailwind.config.js`. Change the corePlugins section to `preflight: false;`.

# 3. Layout-related Styles
Here are a few that seem necessary: 

- Aspect Ratio: Controls the aspect ratio of a component.
  aspect-auto, aspect-square (1:1), aspect-video (16:9)

- Columns: Adjusts the number of columns within an element.
  columns-{n}, columns-{size}
  You can specify the number of columns or create new columns at specific widths.

- Box Sizing: Determines whether to include padding and margin when measuring the size of each element.
  box-border: Size includes padding and margin.
  box-content: Size includes only the element's internal content.

- Display: Determines the display type of an element.
  block, inline-block, inline, flex, inline-flex, table, inline-table, table-caption, etc.
  For simplicity, let’s stick to block, inline-block, inline, flex, grid, hidden.

- Float: Specifies the position of an element so that text or inline elements wrap around it. For example, when an image and text are together, this determines the alignment of the image.
  float-right, float-left, float-none (element and inline elements do not mix).

- Object Fit: Determines how an element adjust its size when contained within another (like an image inside a box).
  object-contain, object-cover, object-fill, object-none, object-scale-down.
  These correspond to CSS object-fit values.

- Object Position: Specifies the position of the internal elements within a container.
  You can choose one of nine positions such as object-bottom, object-left, object-left-top, object-center.

- Overflow: Decides how to handle internal elements that exceed their container.
  overflow-{auto, hidden, clip, visible, scroll, x-auto, y-auto, x-hidden, y-hidden, x-clip, y-clip, x-visible, y-visible, x-scroll, y-scroll}.

- Overscroll Behavior: In cases with multiple scrollable areas, this class allows you to prevent scroll chaining when scrolling exceeds the bounds of one area. Using overscroll-contain can help avoid this (default is overscroll-auto).

- Position: Indicates how an element is positioned in the DOM. 
  static, fixed, absolute, relative, sticky.
  The position CSS can be similarly defined. Methods such as top-{n}, bottom-{n} can also be used depending on the positioning configuration.

- Visibility: Controls whether an element is visible or invisible.
  visible, invisible.

- z-index: Adjusts the z-index of an element, determining its display priority.
  z-0, z-10...z-50. There is also z-auto. Higher numbers are given priority.

# 4. Display (Layout) Related Styles

- Flex Direction: Defines the flex-direction.
  flex-row, flex-col, flex-row-reverse, flex-col-reverse.

- Flex Wrap: Determines if elements within the flex container are forced into a single line or wrapped.
  flex-wrap, flex-nowrap, flex-wrap-reverse.

- Flex: Determines how elements within the flex container grow or shrink. It acts as a shortcut for flex-grow (grow, grow-0), flex-shrink (shrink, shrink-0), and flex-basis (basis-{n}).
  flex-initial: Equivalent to `flex:0 1 auto`. The element shrinks according to content size but does not grow.
  flex-1: Equivalent to `flex: 1 1 0%;`. The element will grow or shrink as needed, ignoring its initial size.
  flex-auto: Equivalent to `flex: 1 1 auto;`. The element grows or shrinks while considering its initial size.
  flex-none: The element does not grow or shrink.

- Grid Template Columns: Determines the number of columns in a grid display.
  grid-cols-{n} corresponds to `grid-template-columns: repeat(n, minmax(0, 1fr));`.

- Grid Column Start/End: Determines how many columns an element spans, or where it starts and ends within the columns.
  col-span-n: This element spans n columns.
  col-start-n: This element starts at column n.
  col-end-n: This element ends at column n.

- Grid Template Rows, Grid Row Start/End: Similar to columns, determines the number of rows, which rows an element spans, or where it starts and ends.
  Use grid-rows-n, row-span-n, row-start-n, row-end-n.

- Grid Auto Flow: Determines how items are automatically placed. For rows, items fill a row before moving to the next.
  grid-flow-row, grid-flow-col, grid-flow-dense, grid-flow-row-dense, grid-flow-col-dense.

- Grid Auto Columns/Rows: Specifies the size of grid tracks outside the control of grid-template, used when the number of rows or columns is unknown.
  auto-cols-{auto, min, max, fr}
  auto-rows-{auto, min, max, fr}.

- Gap: Sets the spacing between grid rows, columns, or flexbox items. You can use gap-n or specify directionally with gap-x-n, gap-y-n.

- Justify Content: Determines how items are positioned along the main axis of the container.
  justify-{start, end, center, between, around, evenly}.

- Justify Items: A container property that determines how grid items are arranged inside the container along the inline axis.
  justify-items-{start, end, center, stretch}.

- Justify Self: Applied to the item itself, determines its horizontal alignment.
  justify-self-{auto, start, end, center, stretch}.

- Align Content: Determines vertical positioning of items along the main axis.
  content-{center, start, end, between, around, evenly}.

- Align Items: Determines how items are arranged along the cross axis. Think of it as vertical alignment in a grid.
  items-{start, end, center, baseline, stretch}.

- Align Self: Applied to the item itself, determines its vertical alignment.
  self-{auto, start, end, center, stretch, baseline}.

- Place Content: A shortcut for the same alignment for justify and align content.
  place-content-{center, start, end, between, around, evenly, stretch}.

- Place Items: A shortcut for the same alignment for justify and align items.
  place-items-{start, end, center, stretch}.

- Place Self: Used when both justify-self and align-self share the same alignment for an item.
  place-self-{auto, start, end, center, stretch}.

# 5. Spacing Styles

- Padding: Determines the padding of an element. The difference between padding and margin lies in whether the space is outside the border or inside. 
  Margin is the outer space, while padding refers to the space between the border and the internal elements.
  Use p-n (where 1 unit equals 0.25rem or 4px), px-n, and py-n for horizontal and vertical padding, respectively. Individual sides can be specified with pt, pb, pl, pr.

- Margin: Determines the margin of an element in the same way as padding, using m-n where n is 1 equals 0.25rem or 4px. For instance, m-1 equals a 4px margin. Similar to padding, you can specify margins for horizontal (mx, my) and for individual sides (mt, mb, ml, mr).

- Space Between: Sets the spacing between child elements. Use space-x-n for margin-left and space-y-n for margin-top to set spacing. n is also 1 unit equals 0.25rem or 4px.

# 6. Sizing Styles

- Width: Sets the width of an element using w-n. n corresponds to 0.25rem or 4px. For examples of sizes, refer to this page: https://tailwindcss.com/docs/width, including ratios for width such as w-3/5, with 100% being w-full.

- Min-Width: Sets the minimum width of an element.
  Includes min-w-0, min-w-full, min-w-min, min-w-max, and min-w-fit.

- Max-Width: Sets the maximum width, referred with max-w-*, with further specifics available in the official documentation as needed.

- Height: Determines the height of an element, defined similarly to width.
  
- Min-Height, Max-Height: Similar to Min/Max Width.

# 7. Typography

- Font Family: Defines the font. It includes sans, serif, and mono styles with suitable fallback fonts based on browser support.
  font-sans, font-serif, font-mono.

- Font Size: Determines the size of the font, adjusting line-height as well.
  text-{xs, sm, base, lg, xl, 2xl, ..., 9xl}.
  For size specifics, refer to the official documentation.

- Font Smoothing: A property aimed at making fonts appear smoother but is considered non-standard.

- Font Style: Supports italic and not-italic.

- Font Weight: Changes the weight of the font, equivalent to font-weight CSS settings.
  font-{thin, extralight, light, normal, medium, semibold, bold, extrabold, black}, corresponding to font-weight values from 100 to 900.

- Font Variant Numeric: Decides numeric styles, mostly unnecessary for immediate use.

- Letter Spacing: Sets letter spacing.
  tracking-{tighter, tight, normal, wide, wider, widest}.

- Line Height: Sets the height of a line.
  leading-{number}. It is often adjusted automatically alongside font size.

- List Style Type: Decides whether to use bullet points or ordinal indicators (1., 2., ...).
  list-{none, disc, decimal}.

- List Style Position: Determines whether the list markers are outside the list area.

- Text Align: Aligns the text.
  text-{left, center, right, justify, start, end}.

- Text Color: Indicates the text color of an element.
  text-{color-name} for setting, with color palettes available in the official documentation: https://tailwindcss.com/docs/customizing-colors#default-color-palette.

- Text Decoration: Options for underlining or striking through text.
  underline, overline, line-through, no-underline.

- Text Decoration Color: Specifies colors for text decorations.
  decoration-{color-name} for setting, customizable following the provided palette: https://tailwindcss.com/docs/customizing-colors#customizing.

- Text Decoration Style: Specifies styles for decorations (such as double underlines or dotted lines).
  decoration-{solid, double, dotted, dashed, wavy}.

- Text Decoration Thickness: Specifies the thickness of text decorations.
  decoration-{number} or decoration-from-font can adapt based on font settings.

- Text Underline Offset: Adjusts the spacing between text and underline.

- Text Transform: Changes text to uppercase, lowercase, or capitalizes the first letter.

- Text Overflow: Specifies how to handle text that overflows an element's width.
  truncate, text-ellipsis, text-clip. All except text-clip create ellipses for overflow.

- Text Indent: Determines the indentation for text.
  indent-{number}.

- Vertical Alignment: Determines vertical text alignment, similar to vertical-align CSS.
  align-{baseline, top, middle, bottom, text-top, text-bottom, align-sub, align-super}.

- Whitespace: Specifies how whitespace characters are handled.
  whitespace-{normal, nowrap, pre, pre-line, pre-wrap}.

- Word Break: Determines the treatment of words exceeding the element size.
  break-{normal, words, all}.

# References
CSS grid [Link](https://studiomeal.com/archives/533)

Difference between padding and margin [Link](https://ofcourse.kr/css-course/margin-padding-%EC%86%8D%EC%84%B1)

About font-smooth [Link](https://developer.mozilla.org/en-US/docs/Web/CSS/font-smooth)