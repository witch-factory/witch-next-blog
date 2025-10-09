---
title: HTML Document Metadata Tags
date: "2023-08-13T01:00:00Z"
description: "Tags that represent the metadata of a document"
tags: ["HTML"]
---

# 1. Simple Document Example

First, let's create a simple HTML document. The tags addressed here are very basic, and we will focus on the tags that handle the document's metadata, excluding the tags inside the `<body>`.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>HTML Document</title>
  </head>
  <body>
    <h1>HTML Document</h1>
    <p>This is an HTML document.</p>
  </body>
</html>
```

Let’s examine the elements of this document one by one.

# 2. DOCTYPE Declaration

This declaration is used to determine whether a web page should be rendered in compatibility mode or standards mode. With a DOCTYPE declaration, the web page is rendered in standards mode. This serves as a pathway to the rules that HTML pages must follow to be recognized as valid HTML.

If our page is served as XHTML by setting the Content-Type HTTP header to `application/xhtml+xml`, the browser will always render the page in standards mode, and thus a DOCTYPE declaration is unnecessary.

When the W3C established web standards, most websites were not adhering to the new standards. Therefore, browsers rendered non-compliant websites using the old methods, which is referred to as Quirks Mode.

Nowadays, standards mode is predominantly used; however, originally, web browsers supported three types of layout engines: Quirks Mode, Almost Standards Mode, and Standards Mode.

In Quirks Mode, browsers rendered non-compliant websites using the old methods. In strict Standards Mode, web pages are displayed using only HTML and CSS. Almost Standards Mode supports only a few elements from Quirks Mode.

# 3. Main Root

As the top-level element of the document, it encompasses the entire content of the document. The main root is always the `<html>` tag, and all other elements must be descendants of the `<html>` element. Therefore, the main root element must be positioned at the top of the HTML tag tree. This element has two child elements: head and the subsequent body element.

The lang attribute can be specified, which helps screen readers choose the language for voice representation when declared as a valid attribute. Also, a valid lang declaration is necessary to express significant metadata such as the title with accurate pronunciation.

```html
<html lang="ko">
```

# 4. Base

The `base` element specifies the base absolute URL for all relative URLs in the document. Therefore, there can only be one `base` element in a document. It must be used within the `<head>` tag.

```html
<base href="https://developer.mozilla.org/" target="_blank">
```

The href sets the base URL for relative URLs, while the target specifies the context in which non-specified elements (like a, area, form) will display their results. For example, specifying `_blank` will show the results in a new browsing context.

If multiple `base` tags are specified, only the first one is used, and it does not affect `og` tags.

# 5. Head

Placed as the first child tag of the `html` tag, it contains document metadata that can be identified by the browser rather than displayed to the user. It can hold the title, scripts, stylesheet files, etc.

```html
<head>
  <title>HTML Document</title>
</head>
```

# 6. Link

It specifies the relationship between the current document and external resources. It is used for linking CSS stylesheets and setting [favicons](https://witch.work/posts/favicon).

```html
<link rel="stylesheet" href="style.css">
<link rel="icon" href="favicon.ico">
<link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
```

The `media` property can be used to load resources according to media queries.

```html
<link rel="stylesheet" href="print.css" media="print">
```

# 7. Meta

The `meta` tag represents metadata that cannot be expressed through other meta-related elements, such as script or title. It can indicate the document's author, description, keywords, etc.

`<meta charset="utf-8">` sets the character set that the document should use to UTF-8 Unicode. Other character sets can also be used, although UTF-8 is common.

It must be located within the head tag and can have name, http-equiv, charset, and itemprop attributes.

You can provide document metadata in a name-value pair format by using name as the metadata name and content as the value. It is used as follows:

```html
<meta name="author" content="Kim Sung-hyun">
<meta name="description" content="This is an HTML document.">
```

The standard metadata names provided here can be seen [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name). Various metadata such as viewport can be provided.

Additionally, there are many non-standard metadata like creator and robots, which can also be designated using the meta tag.

At one time, the `<meta name="keywords" content="...">` feature was meant to provide keywords to search engines, but it was misused by spamming keyword lists with hundreds of terms, resulting in many search engines ignoring it now.

However, metadata like `og:image` is still commonly used. Metadata protocols like `og:` and `twitter:` were invented by various companies to provide richer metadata.

# 8. Style

This tag contains style information for the document or parts of the document. Although it is generally preferable to write styles in an external stylesheet and link it using `link`, styling the document is also possible with the `style` tag.

It can have attributes like `type="text/css"` and `media` indicating media queries.

# 9. Title

The title tag represents the title of the document as seen in the browser’s title bar or page tab. The title tag must be included within the head tag and can appear only once.

The content of this tag is displayed in search results and is used as the recommended bookmark name when bookmarking the site. For effective SEO, it is essential to compose a title that accurately describes the document.

It differs from the h1 tag, which carries meaning for the title and cannot contain other tags. Only text can be included, and any included tags are ignored.

# 10. Body

It contains all the content that you wish to show to users. It represents the document's content and should be the second child element of the html element.


# Reference

HTML Basics https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics