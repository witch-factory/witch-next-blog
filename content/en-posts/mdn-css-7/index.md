---
title: Learning Front-End Knowledge CSS-7
date: "2023-04-16T00:00:00Z"
description: "MDN CSS Tutorial - 7"
tags: ["web", "study", "front", "CSS"]
---

Concluding text styling in the MDN CSS tutorial.

# 1. Link Styling

Let’s summarize some points that may not be well known.

## 1.1. Link States

Links have the following states, which can be styled using pseudo-class selectors (like `:hover`).

`:link` refers to an unvisited link, while `:visited` refers to a visited link. `:hover` indicates the state when the mouse is over the link, and `:active` represents the state when the link is clicked.

The state when a link is focused using the tab key or focus function is represented by `:focus`.

The general styling order for these states is as follows:

```css
a{}

a:link{}

a:visited{}

a:focus{}

a:hover{}

a:active{}
```

This order is followed due to overlapping states. Naturally, the styles defined in `a{}` will apply to all other selectors. An active link, if clicked by the user with a mouse, will also be in the hover state.

Given the potential for overlapping states, it is advisable to adhere to the above order in styling.

## 1.2. Selecting External Links

When creating links, there can be external or internal links. For instance, linking with `href="#id"` navigates to an element with the specified id on the same page. Alternatively, one may use a relative path such as `href="/login"`.

However, you may want to apply special styles only to links that lead to external pages. If the links are set up correctly, external links will begin with `http`.

Consequently, using a selector like `a[href^="http"]` allows the selection of external links. This targets all links whose `href` attribute starts with `http`.

# 2. Web Fonts

In CSS, it is possible to download and use fonts from the web. This enables the fonts to be downloaded for use when accessing the page.

At the beginning of the CSS, `@font-face` is utilized to designate a name that will be used when downloading the font.

```css
@font-face {
  font-family: "MyWebFont";
  src: url("fonts/myfont.woff") format("woff"),
       url("fonts/myfont.woff2") format("woff2");
}
```

Most browsers support `woff` and `woff2`, which are compressed file formats for web fonts. MDN recommends downloading from [Font Squirrel](https://www.fontsquirrel.com/).

In my case, I preferred to use Google Fonts for online downloads when opting for special fonts without downloading them separately.

Thereafter, the downloaded web fonts can be utilized using the `font-family` property.

## 2.1. Using font-face Properly

The `@font-face` rule is structured as follows:

```css
@font-face {
  font-family: "MyWebFont";
  src: url("fonts/myfont.woff2") format("woff2"),
        url("fonts/myfont.woff") format("woff");
  font-weight: bold;
  font-style: italic;
}
```

`font-family` specifies the name that will be used when downloading the font, which will later be referenced with the `font-family` property. In fact, the other properties are more crucial.

As seen above, multiple fonts can be added to `src`, separated by commas. The format can also be specified, although this is not mandatory. Including the format is advisable as it helps the browser determine whether it can use the font.

Additionally, the browser tests the fonts declared in the `src` sequentially and uses the first one that is usable, so place the `woff2` format font first if you prefer to use it.

`font-weight` and `font-style` designate the thickness and slant of the font. Of course, different fonts with various properties can have distinct font names defined, such as `myFont-bold` or `myFont-italic`.

However, by specifying weight and style in `@font-face`, you can reference different styles of the same font by using the same name, thus allowing use of the desired style with `font-weight` and `font-style`. More detailed information is provided in the link referenced below.

# References

https://www.456bereastreet.com/archive/201012/font-face_tip_define_font-weight_and_font-style_to_keep_your_css_simple/