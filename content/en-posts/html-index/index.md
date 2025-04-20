---
title: HTML Reference Guide within the Blog
date: "2023-08-15T00:00:00Z"
description: "HTML glossary within the blog"
tags: ["HTML"]
---

# Introduction

You don't need to be an HTML master. However, relying on just a few basic tags like div to solve everything should be reconsidered, prompting a systematic review and categorization of HTML. While this may not cover HTML in its entirety...

Additionally, in front-end testing, it's recommended to test in a manner similar to user experience. It is crucial to consider the implications of HTML in this context.

HTML tags have designated official roles, and pages should be crafted and tested in compliance with these roles. Functions such as `getByRole` help to understand this easily.

Thus, I am beginning to organize the writings related to HTML.

# 1. What is HTML?

HTML is a markup language used to structure web pages and their content, enabling browsers to comprehend this structure. It allows different parts of content to be displayed in various formats or to behave in specific ways, such as hyperlinks.

Each HTML element consists of an opening tag, a closing tag, content, and attributes. Tags and elements are not the same; tags denote the start and end of an element in the source code, while elements are part of the DOM.

## 1.1. The Meaning of HTML Elements

Most HTML elements carry inherent meaning within the page structure. For example, the `<p>` tag, an abbreviation for "paragraph," represents a section of text, while the `<table>` tag literally signifies a table. These elements inform the browser about the meaning and structure of the content.

However, many pages, including those I have created, excessively rely on `<div>` tags, creating visual distinctions solely with CSS.

This disregards the semantic value of HTML, leading to potential issues when viewed with screen readers or in terms of SEO.

Although it is possible to differentiate parts of a site using CSS or font sizes, many users cannot rely entirely on screen readers or color to distinguish these elements.

Approximately 8% of men and 0.5% of women are colorblind. Around 4-5% of the global population is affected by color blindness. This number exceeds that of legacy browser users, yet colorblind users are frequently overlooked compared to legacy browser users.

Therefore, utilizing HTML tags with their respective meanings aids in clearly representing the site structure, allowing screen reader users to navigate the page more distinctly.

# 2. Classification of HTML Elements

Before delving into specific elements, it is essential to note that all HTML elements are categorized as either block-level elements or inline elements.

## 2.1. Block-Level Elements

These are elements that create blocks on a web page and occupy space. They insert a new line between preceding and following elements, representing the structural components of the page. Examples include `<p>` and `<div>` tags, generally considered to require space.

Block elements can be nested within other block elements, but cannot be nested within inline elements. For instance, a `<div>` cannot be nested within an `<a>` tag.

## 2.2. Inline Elements

These elements are always contained within block-level elements. They cannot apply to larger scopes like paragraphs and affect only smaller portions, such as a sentence or word. They do not create new lines but appear within the same paragraph. Examples include `<a>` and `<strong>` tags.

The HTML elements classified in this manner include various tags like `head` and `title`. [Comprehensive lists can be found in the HTML reference guide.](https://developer.mozilla.org/ko/docs/Web/HTML/Element) This guide will focus on frequently used tags.

## 2.3. Note

The classification of block and inline elements here differs from the CSS `display` property. While they are related, changing the CSS display property does not alter the fundamental classification of HTML elements.

For example, setting the `<h1>` element to `display:inline;` does not change its classification as a block element in HTML. The standards governing what elements can contain or be contained within remain the same for block-level elements.

[To prevent confusion, HTML5 has removed the terms block and inline, introducing a new and more precise classification.](https://html.spec.whatwg.org/multipage/indices.html#element-content-categories)

# 3. Comments

Comments are written in the format `<!-- comment -->`. Comments are not displayed in the browser and are used to explain code or temporarily disable parts of the code.

# 4. Document Metadata Tags

Metadata tags in HTML are discussed in [this article](https://witch.work/posts/html-metadata-tag).

# 5. Content Section Tags

Content section tags in HTML are addressed in [this article](https://witch.work/posts/html-section-tag).

# 6. Text Content Tags

Text content tags in HTML are elaborated on in [this article](https://witch.work/posts/html-text-tag).

[An article specifically dedicated to HTML link tags has also been written.](https://witch.work/posts/html-link-tag)

# 7. Multimedia Embedding

Multimedia embedding in HTML is explored in [this article](https://witch.work/posts/html-multimedia-tag).

[Inserting responsive images in HTML is discussed here.](https://witch.work/posts/html-responsive-image)

[An example of embedding media in a simple page is available here.](https://witch.work/posts/mdn-simple-page-test)

[Audio and video delivery guidance](https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery) is also worth referring to.

# 8. Table Content

Tables are used to create and manage tabular data.

This includes the tags `<caption>`, `<col>`, `<colgroup>`, `<table>`, `<tbody>`, `<td>`, `<tfoot>`, `<th>`, `<thead>`, and `<tr>`.

[Creating tables with HTML is discussed in this article.](https://witch.work/posts/html-table-tags).

# 9. Forms

Forms provide multiple input elements.

This includes the tags `<button>`, `<datalist>`, `<fieldset>`, `<form>`, `<input>`, `<label>`, `<legend>`, `<meter>`, `<optgroup>`, `<option>`, `<output>`, `<progress>`, `<select>`, and `<textarea>`.

[Basic information on HTML form elements can be found here.](https://witch.work/posts/html-form-tag)
[An article specifically focused on the input tag has also been written.](https://witch.work/posts/html-input-tag)

[HTML form validation](https://witch.work/posts/html-form-validation) and [HTML form element styling](https://witch.work/posts/html-form-styling) are also provided.

# 10. Scripts

Scripts (particularly JS) can be included in an HTML document.

This encompasses the tags `<canvas>`, `<noscript>`, and `<script>`.

# Additional Notes

## Entities

As observed, HTML tags can include attribute values. For example:

```html
<a href="https://www.naver.com/" title="naver">naver</a>
```

In this case, it is recommended to enclose attribute values in quotes. However, if you want to include quotes within these quoted attribute values, what should you do?

HTML has reserved characters, such as quotes, which are represented using entities to display their original meaning. 

For instance, although you can use as many spaces as you like within an HTML element's content, the HTML parser will condense all spaces into a single space. To use multiple consecutive spaces, the `&nbsp;` entity can be used.

Some common entities include:

- `&lt;` : <
- `&gt;` : >
- `&amp;` : &
- `&quot;` : "
- `&apos;` : '
- `&nbsp;` : space
- `&copy;` : copyright symbol

There are more characters available to express in this manner, such as [diacritical marks and special symbols.](http://www.tcpschool.com/html/html_text_entities)

```html
<p>In HTML, you define a paragraph using the &lt;p&gt; element.</p>
```

## Miscellaneous Tags

There are `<del>` and `<ins>` tags that indicate that a specific part of the text has been modified.

Tags such as `<details>`, `<dialog>`, and `<summary>` are used to create interactive UI objects.

Tags like `<slot>` and `<template>` are employed for creating web component elements. These will be explored through various upcoming articles.

Note that HTML elements are distinguished from other text in the document using tags (e.g., <tag-name>), and the element names within these tags are not case-sensitive. Thus, `<div>` and `<Div>` are treated the same.

## Validation

HTML documents can be tested and debugged using the [HTML validation site](https://validator.w3.org/#validate_by_upload). You can validate it through methods like uploading a webpage address, a file, or directly inputting HTML code.

It checks against HTML standards.

## Elements without DOM Interfaces

[Some HTML elements do not have a separate DOM interface. This has been explored.](https://witch.work/posts/html-dom-missing-element)

# References

HTML Basics https://developer.mozilla.org/ko/docs/Learn/Getting_started_with_the_web/HTML_basics

MDN HTML Intro - Getting Started with HTML https://developer.mozilla.org/ko/docs/Learn/HTML/Introduction_to_HTML/Getting_started

Mozilla Foundation HTML Site https://developer.mozilla.org/ko/docs/Web/HTML

Introduction to HTML https://developer.mozilla.org/ko/docs/Learn/HTML/Introduction_to_HTML

HTML Element Reference https://developer.mozilla.org/ko/docs/Web/HTML/Element

https://developer.mozilla.org/ko/docs/Glossary/Doctype

https://developer.mozilla.org/en-US/docs/Web/HTML/Quirks_Mode_and_Standards_Mode

https://happycording.tistory.com/entry/HTML-Role-%EC%99%9C-%EC%82%AC%EC%9A%A9%ED%95%B4%EC%95%BC%EB%A7%8C-%ED%95%98%EB%8A%94%EA%B0%80

https://discourse.mozilla.org/t/marking-up-a-letter-assessment/24676

https://developer.mozilla.org/ko/docs/Learn/HTML/Introduction_to_HTML/Document_and_website_structure

https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track

https://medium.com/harrythegreat/%ED%94%8C%EB%9E%98%EC%8B%9C%EC%9D%98-%EB%AA%B0%EB%9D%BD%EC%9C%BC%EB%A1%9C-%EB%B3%B4%EB%8A%94-%EC%9B%B9%EC%9D%98-%EC%97%AD%EC%82%AC-ce6e387b60f

https://kkamagistory.tistory.com/808

embed vs object https://stackoverflow.com/questions/1244788/embed-vs-object

More information on SVG https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Getting_Started

https://frontdev.tistory.com/entry/strong-%ED%83%9C%EA%B7%B8%EC%99%80-em-%ED%83%9C%EA%B7%B8%EC%9D%98-%EC%B0%A8%EC%9D%B4