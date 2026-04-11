---
title: Content Sectioning Tags in HTML
date: "2023-08-13T02:00:00Z"
description: "Tags that semantically distinguish content in HTML"
tags: ["HTML"]
---

# 1. Section Root

All elements excluding those within `<head>` are included in the section root, namely the `<body>` tag.

The section root represents the content section of the document and is indicated by the `<body>` tag, which can only exist once in a document.

The `<body>` tag can have event handlers such as `onblur`, `onerror`, `onfocus`, `onload`, `onresize`, and `onpopstate`. These specify functions executed when specific events occur in the document. More event handlers can be found in the [MDN documentation for the body tag](https://developer.mozilla.org/ko/docs/Web/HTML/Element/body#%ED%8A%B9%EC%84%B1).

# 2. Areas Comprising a Page

HTML includes block elements that define various sections of a page, such as the area where the main content resides. Utilizing these elements allows for a basic page structure to be expressed in HTML.

A typical document is composed of the following areas:

- **header:** A band featuring large titles and logos, organizing main information, and usually appearing consistently across different pages.
- **nav:** An area containing links to navigate between pages, often filled with menus, links, and tabs, usually found within the header area, although not mandatory.
- **main:** The most significant content area of the page, containing narratives or important videos.
- **sidebar:** Information, links, and quotes surrounding the main content, varying by context. For instance, in an article page, the sidebar may include author information or links to related articles, typically located next to the main area.
- **footer:** A strip at the bottom of the page listing minor information or contact details, potentially containing links to the sitemap or popular content shortcuts.

It is crucial to use appropriate tags for each of these page elements. HTML indeed provides suitable tags for these, such as `<header>` for headers, `<nav>` for navigation bars, `<main>`, `<article>`, `<section>`, and `<div>` for main content, `<aside>` for sidebars, and `<footer>` for footers.

In summary, this includes tags such as `<address>`, `<article>`, `<aside>`, `<footer>`, `<header>`, `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`, `<main>`, `<nav>`, and `<section>`.

There was also an `<hgroup>` tag used to group heading tags, but it has been removed from the W3C HTML specification. Let’s examine each of these tags individually.

## 2.1. The Need for Tag Differentiation

It is possible to distinguish and style each part of a site using CSS or font sizes. However, many users cannot depend solely on screen readers or colors for differentiation.

Approximately 8% of men and 0.5% of women are colorblind, meaning about 4-5% of the global population is affected. This figure surpasses that of legacy browser users, yet colorblind individuals often remain overlooked compared to legacy browser users.

In such cases, using HTML markup that allows content to be sectioned by function helps to make the site structure clear. This also aids screen reader users in navigating pages effectively. Let’s explore the tags employed for this purpose.

# 3. Content Sectioning Tags

## 3.1. Simple Page Example

First, let’s construct a simple page and examine the meanings of the tags used.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="author" content="Kim Sung Hyun" />
    <title>My Semantic Page</title>
  </head>
  <body>
    <header>
      <h1>My Semantic Page</h1>
    </header>
    <nav>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
      <label for="search-input">Search</label>
      <input id="search-input" type="search" placeholder="Search" />
      <input type="submit" value="Search" />
    </nav>
    <main>
      <article>
        <h2>Home</h2>
        <p>Content of the Home page</p>
      </article>
      <aside>
        <h2>About</h2>
        <ul>
          <li><a href="#">About 1</a></li>
          <li><a href="#">About 2</a></li>
          <li><a href="#">About 3</a></li>
        </ul>
      </aside>
    </main>
    <footer>
      <p>My Semantic Page</p>
      <p>Contact: <address>soakdma37@gmail.com</address></p>
    </footer>
  </body>
</html>
```

Executing this code may appear unattractive due to the absence of styles. Styling will be applied later when organizing the CSS, but for now, let’s focus on the semantic construction of the page and the tags used.

## 3.2. header

The `<header>` tag represents a grouping of content that summarizes and aids in introducing and navigating within a section. If directly included in the body, it represents the document's overall header.

If included within elements such as section, article, nav, or aside, it indicates the header of that specific element, thereby wrapping the element's title and brief description.

However, it cannot be used as a descendant of other header tags, `<address>`, or `<footer>`.

```html
<!-- Nested headers should not be created like this. -->
<header>
  Parent header
  <header>
    Child header
  </header>
</header>
```

The `<header>` can include elements such as `<h1>` to `<h6>`, `<nav>`, `<form>`, `<section>`, `<article>`, `<aside>`, `<header>`, `<footer>`, and `<address>`.

## 3.3. footer

The `<footer>` tag denotes the footer of the nearest section. It generally contains author information, copyright details, or links to related documents, and it commonly includes an `<address>` element. However, it does not create a new section in the outline of the content.

If a footer is a child of the body element, it applies to the entire page.

## 3.4. main

The `<main>` element is used for the page’s primary content, directly linked to the core subject or functionality of the document.

Being the main content, it must exist only once in a document unless it has the hidden attribute. The `<main>` can include tags like `<article>`, `<section>`, `<div>`, and does not affect the document outline. Ideally, it should be included directly within the body and should not be nested within other elements.

## 3.5. article

The `<article>` tag represents a block of content that can be independently delineated and reused, irrespective of other elements on the page. This can include news articles or blog posts.

A single document can contain multiple `<article>` elements. For example, in a blog where users scroll to see successive posts, each post would be represented by an `<article>` tag.

When using `<article>`, the following semantic considerations should be taken into account:

- Each article must be clearly delineated as independent.
- A means to identify the article is necessary, typically achieved by including a heading element within the article.
- If articles are nested, the inner article pertains to the outer one.
- The `<address>` tag can provide author information.
- Elements such as the author and date can be indicated using the `datetime` attribute of the `<time>` tag.

## 3.6. aside

The `<aside>` tag indicates content that is indirectly related to the main content of the page. This is often represented as a sidebar, containing information such as the author’s bio, glossary terms, or related links.

## 3.7. nav

The `<nav>` tag signifies a section of the page that contains major links, mainly used for menus or tables of contents. However, it does not need to encompass all links in the document; only the primary ones suffice. Other links are often found in the footer.

Additionally, multiple `<nav>` elements can be present on a page based on purpose, and for accessibility improvements, it’s advisable to add `aria-labelledby` to `<nav>`. Screen readers consider `<nav>`, which influences accessibility.

## 3.8. address

The `<address>` tag conveys contact information pertaining to a person, organization, or entity related to the nearest HTML element. Any type of information, such as address, email, phone number, or social media links, can be included.

It can be used in the header to provide the creator's contact or placed within an article to denote the author. It is commonly found within the footer.

```html
<address>
  <p>Written by <a href="mailto:soakdma37@gmail.com">soakdma37</a>.</p>
</address>
```

More complex markup can be included within `<address>` for additional contact information.

```html
<address>
  <ul>
    <li>Tel: 01234 567 890</li>
    <li>Email: soakdma37@gmail.com</li>
  </ul>
</address>
```

However, the contents of the `<address>` tag should not contain information other than contact details, such as dates.

## 3.9. section

The `<section>` tag represents an independent section that serves a singular purpose within an HTML document. It should be used when no more appropriate semantic element exists. It may or may not include a heading, but a means to identify each section must be provided.

If content can stand alone and be distinctly separated, it may be preferable to utilize the `<article>` tag. Furthermore, `<section>` should not be used as a general container; it is designated for instances when logical separation of a section in the document is necessary. Use `<div>` for styling purposes only.

A section is similar to an article, with the distinction that articles must be independently distinguishable, whereas sections do not have that requirement. Contextually, an article can comprise multiple sections, or a section can contain multiple articles.

```html
<section>
  <h2>Heading</h2>
  <img src="./my-image.png" alt="Example page image" />
</section>
```

## 3.10. heading

Elements from `<h1>` to `<h6>` represent six levels of section headings, with `<h1>` being the largest.

It is advisable to use only one `<h1>` tag per page, and it is not recommended to use more than three heading tags of the same type within a page due to potential complexity in handling extensive outlines. In such cases, it is better to divide content across multiple pages.

When using headings, it is best to use them sequentially, such as `<h2>` following an `<h1>`, to enhance accessibility for screen reader users.

While heading tags come with basic styling, this is irrelevant to their semantic meaning.

For example, even if CSS is applied to span tags to visually resemble the default styling of an `<h1>`, the fundamental semantic distinction between the two tags remains unchanged.

Utilize these tags for heading text, and if font size styling is needed, employ the `font-size` CSS property.

## 3.11. non-semantic wrapper div, span

When there aren't specific semantic tags available for particular content, use `<div>` or `<span>` as non-semantic wrapper tags.

`<div>` is used for grouping block-level elements, while `<span>` is utilized for inline elements. By wrapping items this way, you can apply styles using classes, etc.

However, the convenience of `<div>` can lead to overuse, so it should only be considered when no semantic tag fits; otherwise, using meaningless `<div>` tags can clutter the code.

## 3.12. br

Use the `<br>` tag to force line breaks at desired points within the text. This is the only method to enforce line breaks for short sentences. It can be useful for formatting poetry in HTML.

However, since it is merely a line-breaking element, avoid using `<br>` for paragraph separation. Instead, utilize the `<p>` tag for paragraph distinctions and margin CSS for spacing.

## 3.13. hr

The `<hr>` tag signifies a thematic break or separation between paragraphs and serves to delineate different subject matters at the paragraph level. Browsers visually render it as a horizontal line.

Being an element that signifies subject separation, if the intention is merely to draw a line, it is recommended to use CSS.

Since it is an empty element, it should not have a closing tag.