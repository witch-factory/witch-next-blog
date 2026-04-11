---
title: Other HTML Tags
date: "2023-06-28T02:00:00Z"
description: "A brief list of various HTML tags"
tags: ["HTML"]
---

[Commonly used main tags are here](https://witch.work/posts/html-basic-tag)

# 1. Inline Text Semantic Tags

## 1.1. abbr

The abbr tag stands for abbreviation and represents an acronym. The title attribute can provide the full content of the abbreviation. The title attribute should not include any other content.

```html
<abbr title="HyperText Markup Language">HTML</abbr>
```

The acronym tag serves the same function as the abbr tag; however, acronym is no longer in use. Therefore, it is recommended to use abbr.

## 1.2. b

This tag represents bold text. Unlike `<strong>`, the `<b>` tag does not convey any special importance to the content. It was originally used to display bold text in browsers that cannot utilize CSS, but it is rarely used now.

## 1.3. bdi

This tag instructs the browser to handle the text enclosed separately from the surrounding text.

Most languages are written from left to right, but some languages, such as Arabic, are written from right to left. Browsers process this with specific algorithms, and using this tag allows the browser to handle the text directionality independently from the surrounding text.

It is used when including text content whose directionality is unknown in advance.

## 1.4. bdo

This tag overrides the current text writing direction and renders it in another direction. The dir attribute can specify the direction, either ltr (left to right) or rtl (right to left).

```html
<bdo dir="rtl">This text will be written from right to left</bdo>
```

## 1.5. data

The HTML data tag links content to a machine-readable interpretation. It can be used to display product prices or product numbers in a machine-readable format.

If providing time or date information, it is better to use the `<time>` tag.

## 1.6. dfn

This tag represents a term defined in the current context or sentence. It indicates the term being defined by finding the closest `<p>`, `<dt>`, `<dd>`, or `<section>` ancestor element.

```html
<p>
  <dfn id="def-me">마녀</dfn>는 이 블로그 주인의 닉네임이다.
</p>
```

Inserting an `<abbr>` tag within indicates that it is defining the corresponding abbreviation.

## 1.7. kbd

This tag represents user input, such as keyboard input. It is primarily used to indicate keyboard actions.

```html
<p>Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy the text.</p>
```

The `<kbd>` element can be nested to represent smaller parts of a single input.

## 1.8. rp, rt, ruby

These tags are used to display ruby annotations for the pronunciation of East Asian characters.

## 1.9. s

This tag strikes through text. However, if indicating an edit history, it is more appropriate to use del and ins.

## 1.10. samp

This tag represents an example (or quotation) of computer program output.

By placing the kbd element inside the samp element, it can represent the input that the system re-displayed.

## 1.11. small

This tag represents smaller text such as footnotes or copyright notices. It is often used in footers.

## 1.12. sub, sup

The `<sub>` tag specifies inline text to be displayed as subscript. It is traditionally used for footnotes, numerical representations of mathematical variables, and chemical element formulas.

The `<sup>` tag specifies inline text to be displayed as superscript. It is used for exponentiation and ordinal numbers such as 4th.

## 1.13. u

This tag indicates text that has a non-verbal comment. 

In browsers, it is simply rendered as an underline, which should not be used for adding underlines. For simple underlining, CSS with `text-decoration` should be utilized.

It can be used to denote parts with spelling errors, for instance.

```html
<p>이런 방법을 시도해 봤는데 <u>안됬어요</u>.</p>
```

However, in most cases, it is better to use other tags like em, mark, strong, cite, or i.

## 1.14. var

This tag represents variable names in mathematical expressions.

## 1.15. wbr

This tag indicates a permissible line break position, ignoring the current line break rules of the element. It may not be frequently needed.