---
title: HTML Text Tags
date: "2023-08-15T00:00:00Z"
description: "Tags used to represent text in HTML"
tags: ["HTML"]
---

# Introduction

One of the main tasks of HTML is to assist the browser in displaying text correctly. Almost no page exists without text (especially in the early days of HTML).

Therefore, let's explore the basic tags used to represent text within a page, such as adding headings and paragraphs, and creating lists.

# 1. Text Content

Text content tags help organize the content sections within the `<body>` and are used to determine the purpose or structure of the content sections. They are crucial for accessibility and SEO.

These include the `<blockquote>`, `<dl>`, `<dt>`, `<dd>`, `<div>`, `<figcaption>`, `<figure>`, `<hr>`, `<li>`, `<menu>`, `<ol>`, `<p>`, `<pre>`, and `<ul>` tags.

## 1.1. blockquote

The `<blockquote>` element represents content that has been cited in a block-level format. For short quotations that do not require a separate block, use the `<q>` tag, which we will discuss later within inline text semantics.

Using the cite attribute of the blockquote tag allows you to indicate the source of the citation. The `<cite>` tag can also be used to provide source text.

```html
<blockquote cite="https://www.naver.com/">Something quoted from Naver</blockquote>
```

It is primarily represented as an indented paragraph.

Additionally, the cite attributes of the blockquote and q tags are not displayed on the page. If you want to show these citation sources on screen, you should use the `<cite>` tag discussed later.

## 1.2. dl, dt, dd

Similar to the `<ul>` and `<ol>` tags for lists, these tags can be used to create a description list. They display each item along with its related description. [The article introducing the importance of using HTML also cites this tag as useful.](https://xo.dev/articles/why-html-is-important-than-you-think)

The `<dl>` tag creates a list that includes `<dt>` and `<dd>` tags. `<dt>` (description term) represents each item, while `<dd>` (description definition) represents the description of the item. It is used for implementing glossaries or question-and-answer formats and displaying metadata in key-value pair lists.

```html
<dl>
  <dt>HTML</dt>
  <dd>Used to structure web pages.</dd>
  <dt>CSS</dt>
  <dd>Used for styling web pages.</dd>
  <dt>JavaScript</dt>
  <dd>Allows dynamic composition of web pages.</dd>
</dl>
```

`<dt>` can represent a term, question, or title, and `<dd>` can represent a definition or answer. Note that the `<dt>` and `<dd>` groups can also be wrapped in a `<div>`, which is useful for styling purposes.

```html
<dl>
  <div class="some-class">
    <dt>HTML</dt>
    <dd>Used to structure web pages.</dd>
  </div>
</dl>
```

Due to the default styles provided by the browser, indentation is applied to sub-items. However, using these elements solely for indentation purposes is not advisable.

Also, the relationship between `<dt>` and `<dd>` is not one-to-one; multiple `<dd>` tags can be associated with a single `<dt>`.

```html
<dl>
  <dt>Witch</dt>
  <dd>This is my nickname.</dd>
  <dd>Originally, it did not have such a strong concept.</dd>
  <dd>I named myself Witch Factory without much thought, but everyone started calling me Witch, so I became a witch.</dd>
</dl>
```

## 1.3. div

The `<div>` tag is a container that provides a meaningless block-level element. It may not be related to the main content of the page.

Unlike other elements, `<div>` holds no semantic meaning. Therefore, when using `<div>`, consider whether a semantic element like `<article>` could be used instead. If none is suitable, then `<div>` should be used.

## 1.4. figure, figcaption

The `<figure>` element represents self-contained content and can use a `<figcaption>` element to provide a description. The following code serves to caption an image.

```html
<figure>
  <img src="assets/profile.jpg">
  <figcaption>My profile picture</figcaption>
</figure>
```

Of course, this design can also be implemented using `<div>`, `<img>`, and `<p>` tags, but using the above allows you to convey to the browser that a specific caption is associated with the image.

The elements within the `<figure>` tag do not necessarily have to be images. Videos, tables, codes, etc., can also fit.

## 1.5. hr

The `<hr>` tag is used to separate paragraphs or indicate a thematic break between paragraph-level elements. It is rendered as a horizontal line by the browser.

However, since it serves as a separation element, if your sole purpose is to draw a simple horizontal line, it is better to use CSS.

As it is an empty element, it should not have a closing tag.

## 1.6. ul, ol, li

The `<ul>` element represents an unordered list, while the `<ol>` element represents an ordered list. Both are block-level tags.

These two tags contain `<li>` elements, which represent list items. The `<li>` element must be located inside `<ul>`, `<ol>`, or `<menu>` tags.

```html
<ul>
  <li>Apple</li>
  <li>Pear</li>
  <li>Strawberry</li>
</ul>

<ol>
  Today's tasks
  <li>Study HTML</li>
  <li>Study CSS</li>
  <li>Study JS</li>
</ol>
```

The difference between `<ul>` and `<ol>` is that order matters for `<ol>`. If the items have a specific order, `<ol>` should be used.

As an ordered list, `<ol>` has the `reversed` attribute, indicating if the order is reversed, the `start` attribute indicating where the order begins, and the `type` attribute for specifying the counter style of the items.

Nested lists are also possible between these list tags.

## 1.7. menu

The `<menu>` tag refers to a collection of commands that a user can perform. It includes a label that represents the menu name and a `type` attribute that indicates the type of menu.

However, the `menuitem` tag used internally is deprecated, and the `<menu>` tag itself is considered experimental technology, so it is generally acceptable to skip it according to current standards.

[Link to the menu tag MDN documentation](https://developer.mozilla.org/ko/docs/Web/HTML/Element/menu)

## 1.8. p

Represents a block element of a single paragraph. Using this tag to divide content into paragraphs enhances the accessibility of the page. In the past, special characters like ¶ were used to separate paragraphs, but now the `<p>` tag is utilized.

By default, the browser separates paragraphs with a single line spacing, and other styles should be specified using CSS. As with the other tags mentioned earlier, the `<p>` tag should not be used just to add margins between paragraphs.

```html
<p>First paragraph</p>
<p>Second paragraph</p>
```

## 1.9. pre

Represents preformatted text, displaying the content exactly as written in the document. Whitespace characters within the element are preserved.

Normally, when multiple whitespaces are used in HTML, the parser reduces them to a single whitespace, but using the `<pre>` tag allows the whitespace within the `<pre>` content to be kept intact. Therefore, it can be used to represent ASCII art, etc.

For accessibility considerations, an alternative description for the `<pre>` element should be specified. You can use `<figure>`, `<figcaption>`, `id`, `aria-labelledby`, etc.

```html
<figure role="textbox" aria-labelledby="my-code">
  <pre>
    <code>
      function sayHello() {
        console.log('Hello, World!');
      }
    </code>
  </pre>
  <figcaption id="my-code">
    This code is written in JavaScript to output 'Hello, World!'
  </figcaption>
</figure>
```

# 2. Inline Text Semantics

Defines the structure or style of inline text. There are numerous types, including `<a>`, `<br>`, `<cite>`, `<code>`, `<q>`, `<small>`, `<span>`, `<strong>`, `<time>`, and `<sup>`. Only those commonly used are summarized here.

Not all inline text semantic tags hold significant meaning. Some are used for basic text styling in browsers that do not support CSS, like `<b>`, without conferring any special importance.

## 2.1. a

The `<a>` tag, or anchor, represents a hyperlink to another page, a specific location within the same page, a file, or any URL. The `href` (hypertext reference) attribute is used to specify the link's destination.

```html
<a href="https://www.google.com">Google</a>
```

As shown in the above `<a>` tag, the content within the `<a>` tag should describe the link’s destination for accessibility.

Also, for links that open in a new window (`target="_blank"`), or initiate a download, it is necessary to specify what action occurs when clicking the link in the link text.

```html
<a href="https://www.google.com" target="_blank">Google (opens in a new tab)</a>
```

When including images within the `<a>` tag to indicate the link’s action, remember to provide alt text.

[A detailed explanation regarding the `<a>` tag has been separately composed.](https://witch.work/posts/html-link-tag)

## 2.2. br

Inserted at points where you want to break text to specify line breaks. However, since it is solely an element for inserting line breaks, refrain from using it to separate paragraphs.

Using the `<p>` tag for paragraph separation is preferable, and using margin CSS is better for adding spacing.

## 2.3. cite

The `cite` attribute in references like `<blockquote>` appears useful, but browsers and most screen readers do not generally recognize the cite attribute by default. This means that unless additional CSS or JavaScript is employed, users will not see the `cite` attribute.

Hence, when you want to properly display the citation source, it is better to use the `<cite>` tag. The `<cite>` tag is used to indicate a source and should include the title of the cited source. It can contain various works, such as books, articles, scores, and games.

When used alongside `<blockquote>` or `<q>`, it can indicate the source of the citation.

Commonly, browsers render the content of this tag in italics.

```html
<p>
  Some of the content in this document is sourced from 
  <a href="https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Advanced_text_formatting">
    <cite>MDN's Advanced Text Formatting document</cite>
  </a>.
</p>
```

## 2.4. abbr

The `<abbr>` tag represents an abbreviation. It is used by providing the full term when it first appears, followed by the abbreviated form within the `<abbr>` tag. This offers users a clue as to the original meaning of the abbreviation.

If it is not essential to display the full term, you can provide it through the `title` attribute. The title attribute should not contain other content.

```html
<abbr title="HyperText Markup Language">HTML</abbr>
```

The `<acronym>` tag, present in earlier HTML versions, served a similar function as `<abbr>`. However, since `<abbr>` now supports both abbreviations and acronyms, `<acronym>` has been deprecated. Therefore, it is advisable to use `<abbr>` instead.

## 2.5. sup, sub

The `<sub>` tag specifies inline text that should be presented as subscript. It is used for footnotes, mathematical variable notation, and indicating chemical formula elements.

The `<sup>` tag specifies inline text that should be presented as superscript. It is used for exponent notation or ordinal forms like "4th."

## 2.6. em, strong

At times, it is necessary to emphasize or denote importance regarding sentences or content within a page. There are inline elements available for this purpose.

The `<em>` tag, short for emphasis, indicates text emphasis and is typically rendered in italics. However, it should not be used simply for italics; CSS should be utilized instead for that need.

```html
<p>HTML is designed to correctly display <em>text</em>.</p>
```

Using the `<em>` tag or the similar intention of the `<strong>` tag will result in screen readers expressing them in different tones.

On the other hand, the `<strong>` tag indicates significant or urgent content within the document or highlights an exceptionally important section compared to surrounding content. It can represent warnings or notes about the text on the page. It is typically rendered in bold by browsers.

```html
<strong>Absolutely</strong> must not be late.
```

However, it should not be used solely for bold text. Use CSS to achieve decorative bold text styling. If the intention is just to draw attention without significance, use the `<b>` tag.

It might arise the question, "Isn't `<em>` also an emphasis tag?" However, `<em>` is meant for emphasis, while `<strong>` is used to denote importance.

While `<em>` adds stress to specific parts during speech—changing meaning based on where the emphasis lies—`<strong>` injects importance directly into the statement. For example, "Warning! Dangerous substance" conveys a different gravity than just highlighting a part of the text.

### 2.6.1. b, i, u

Similar to the `<em>` tag, the `<i>` tag is utilized for producing italics. Also, `<b>` and `<u>` tags represent bold and underline, respectively. These elements are designed to be used when CSS support is lacking.

Elements that only impact presentation have little reason to be used nowadays given the popularity of CSS. However, HTML5 has bestowed new semantic roles for these tags.

In HTML5, it encourages using these tags to convey the meanings that were previously expressed through bold text, italics, or underlining.

For instance, technical terms or foreign languages have traditionally been italicized, so the `<i>` tag is used. Incorrect spellings, which have often been underlined, thus would use the `<u>` tag. (Note that typically, people have a strong association of underlining with hyperlinks, so if you are inclined to use the `u` tag, be mindful to consider more apt expressions.)

While the `<i>` tag also produces an italicized result, `<em>` is for emphasis, whereas `<i>` is used for terms diverging from the normative context such as foreign language text or monologues.

## 2.7. code

Represents a short snippet of code as an inline element. The default style is a monospaced font, as supported by the user agent.

This tag typically represents only a single line of code, thus for multiple lines, the `<pre>` tag should be utilized.

## 2.8. mark

Indicates important sections that are closely related to the current context or require attention. It is akin to highlighting with a highlighter.

However, it should not be used solely for marking; CSS should be employed for that purpose.

## 2.9. q

Represents a short inline quotation. The cite attribute can be used to indicate the source.

```html
<p>This sentence quotes <q cite="https://www.naver.com/">something quoted from Naver</q>.</p>
```

Inline quotations are typically rendered as plain text enclosed in quotation marks.

## 2.10. span

Essentially, it is a generic inline container that does not convey any inherent meaning. It can be used to apply styles or group elements that share particular characteristics. In that sense, it can be considered as the inline version of `<div>`.

## 2.11. time

Represents a specific point or period of time in a machine-readable format. You can specify the time using the `datetime` attribute with a string recognizable by user agents.

If the `datetime` attribute is absent, the element's textual content is considered the value for `datetime`, and it should not have any child elements.

```html
<p>Last modified on: <time datetime="2023-06-28">June 28, 2023</time></p>
```

When setting the datetime attribute, you may represent the date inside in any format you prefer, but the datetime attribute itself should be in a machine-readable format.

## 2.12. var

Denotes a variable name in contexts such as mathematical expressions or programming settings. It is often rendered in italics, albeit with variations across different browsers.

```html
<p>
  <var>x</var> is twice <var>y</var>.
</p>
```

It should not be used for styling. For styling needs, wrap it in a `<span>` and use CSS.

## 2.13. kbd

Represents user input, such as keyboard input. It is typically used for indicating keyboard commands.

```html
<p>Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy the text.</p>
```

The `<kbd>` element can be nested to indicate small portions of input within a larger input.

## 2.14. samp

[Link to the samp tag MDN documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/samp)

Represents an example of output from a computer program (or a quotation).

By nesting the kbd element within a samp element, you can illustrate the input that the system has echoed.

# References

HTML Text
https://developer.mozilla.org/ko/docs/Learn/HTML/Introduction_to_HTML/HTML_text_fundamentals

Advanced Techniques in HTML Text
https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Advanced_text_formatting