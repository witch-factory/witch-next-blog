---
title: About HTML Link Tags
date: "2023-06-28T01:00:00Z"
description: "HTML Hyperlink Tags"
tags: ["HTML"]
---

The `<a>` tag can do more than just navigate to other pages.

# 1. Basics

The `<a>` tag, also known as an anchor, represents a hyperlink to another page, a specific location on the same page, a file, or any URL. The `href` (hypertext reference) attribute is used to specify the destination of the link.

The text string used to navigate to a web page is called a URL, which stands for Uniform Resource Locator. Within this, the string used to identify a specific file is referred to as the path.

For example, in `https://www.naver.com/index.html`, `https://www.naver.com` is the URL, and `/index.html` is the path.

```html
<a href="https://www.google.com">Google</a>
```

As written in the above `<a>` tag, the content within the `<a>` tag should provide a description of the link's destination for accessibility purposes.

Additionally, for links that open in a new window using `target="_blank"` or start a download, it is advisable to specify the action that occurs when the link is clicked in the link text.

```html
<a href="https://www.google.com" target="_blank">Google (opens in a new tab)</a>
<a href="https://www.youtube.com/watch?v=QH2-TGUlwu4">Listen to the song (play video)</a>
```

Other principles to adhere to when writing link text include avoiding repetition of the URL as part of the link text, refraining from using meaningless link texts such as "click here" (as screen readers alert users to the presence of the link and visually distinguish the link), and using concise link text.

## 1.1. Block-Level Links

Even block-level elements can be wrapped in an `<a>` tag to create a link. The following demonstrates how to make a header tag a link.

```html
<a href="https://witch.work/">
  <h1>My Blog</h1>
</a>
```

Images can also become links by wrapping the `<img>` tag with an `<a>` tag. However, when inserting images within the `<a>` tag to indicate the link's action, it is essential to specify alt text for the `<img>` tag.

# 2. Specifying URLs

## 2.1. External URLs

As previously mentioned, you can insert URLs in the `href` attribute.

```html
<a href="https://www.google.com">Google</a>
```

You can also use a relative URL or specify a relative file path, such as `href="../projects/index.html"`.

## 2.2. Document Fragments Within the Same Page

A document fragment refers to a specific location within a document. Document fragments begin with `#` and point to a specific `id` within the document.

The following example navigates to the element with `id="section-1"` within the document.

```html
<a href="#section-1">Go to Section 1</a>
```

This is also possible for other pages. For instance, to navigate to `#section-1` of `https://www.google.com`, you can do the following.

```html
<a href="https://www.google.com#section-1">Navigate to Section 1 of Google</a>
```

## 2.3. Download Links

When linking to a resource for download rather than opening a page in the browser, you can use the `download` attribute to specify the default name of the file to be downloaded.

```html
<a href="download_link" download="blabla.pdf">Download from Google</a>
```

## 2.4. Email Addresses

You can specify an email address using `mailto:` in the `href` attribute.

```html
<a href="mailto:soakdma37@gmail.com">Email the blog owner</a>
```

Actually, you can omit the email address, in which case the browser will simply open the user’s email client to send a new email.

Additionally, several attributes can be specified, such as subject, cc (carbon copy), bcc (blind carbon copy), and body. This is done in a URL query string format.

You should use `?` and `&` to separate the entries.

```html
<a href="mailto:soakdma37@gmail.com?
cc=reference_email1, reference_email2&
bcc=hidden_reference_email1, hidden_reference_email2&
subject=email_subject&
body=email_body">Formatted Email Link</a>
```

## 2.5. Phone Numbers

You can specify a phone number using `tel:` in the `href` attribute.

```html
<a href="tel:010-1234-5678">Call the blog owner</a>
```

The action of this link varies depending on the device. On a mobile phone, it automatically enters the number, while on a desktop, it launches a program capable of making calls, such as Skype.

# 3. Relative Links vs. Absolute Links

When creating a link destination, which is better: relative URLs or absolute URLs?

If the structure of the document changes, links using relative URLs may no longer function correctly. Therefore, one might think it is better to use absolute URLs.

However, when connecting to another location within the same site, it is advisable to use relative links whenever possible. There are two reasons for this.

First, relative links are generally shorter, making the code easier to read.

Second, performance improves. When using absolute URLs, the browser queries the DNS server to fetch the requested file, which is unnecessary for links on the same page!

In contrast, when using relative URLs, the browser only needs to navigate to the URL on the same server, improving performance. Using absolute URLs necessitates additional steps by the browser, leading to decreased performance.

# 4. Additional Features

## 4.1. Title

You can specify the title that appears when hovering over a link by using the title attribute.

```html
<a href="https://www.google.com" title="Go to Google">Google</a>
```

However, if the information specified in the title is truly important, it should also be included in the content of the link tag. This is because users who navigate the page using only a keyboard cannot access the information provided in the `title`.

## 4.2. Fake Buttons

Although not the recommended method, `<a>` tags can be used like buttons. Since you’re disregarding the role at this point, it might not be necessary, but you should specify `role="button"`.

Setting the `href` to `javascript:void(0)` will ensure that nothing happens when clicked. By registering a click event handler here, it effectively acts as a button.

```html
<a href="javascript:void(0)" role="button">Google</a>
```

However, this naturally may cause unforeseen behaviors such as issues with link copying/dragging, opening links, or script errors, and can reduce accessibility. Using a `<button>` tag is the correct choice.

## 4.3. URL Display Location

It is well known that setting `target="_blank"` causes the link destination to be displayed in a new browsing context. There are also [security issues](https://witch.work/posts/misc/security-of-link-tag) associated with this.

In any case, the target attribute can be used to specify the location where the linked URL will be displayed.

The default is `_self`, which displays the link destination in the current browsing context. As previously mentioned, `_blank` displays it in a new browsing context.

`_parent` displays the URL in the parent of the current browsing context, behaving like `_self` if there is no parent.

`_top` displays the URL in the topmost browsing context, also behaving like `_self` if there is no parent.

# References

https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Creating_hyperlinks

https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#%E1%84%8B%E1%84%80%E1%85%A6%E1%84%89%E1%85%B5_url%E1%84%8B%E1%84%83%E1%85%B5%E1%84%85%E1%85%A1%E1%86%AF